"""Real owner login plus isolated World presentation; never creates a World/Save."""
import argparse
import importlib.util
import json
import os
import re
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

here = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('account_qa', here/'account-presentation-browser-qa.py')
account_qa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(account_qa)
GRAPH = account_qa.GRAPH
seasons = json.loads((here.parents[2]/'packages/content/base/world/calendar.json').read_text())['seasons']
SESSION_KEY = 'cataclysm-rpg-ui.epoch1.session'


def session_account(page):
    return page.evaluate('(key) => JSON.parse(localStorage.getItem(key))?.accountId', SESSION_KEY)


def open_existing_launcher(page):
    return page.get_by_role('button', name='Open existing launcher', exact=True)


def launcher_sections(page):
    return page.get_by_role('navigation', name='Launcher sections')


def verify_launcher(page, width, screenshots, account_id):
    graph = page.evaluate(GRAPH)
    storage = page.evaluate('JSON.stringify(Object.entries(localStorage).sort())')
    button = open_existing_launcher(page)
    expect(button).to_be_enabled()
    expect(button).to_be_in_viewport(ratio=1)
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
    if screenshots:
        screenshots.mkdir(parents=True, exist_ok=True)
        page.screenshot(path=str(screenshots / f'continuity-welcome-{width}.png'), full_page=True)
    if width in (768, 320):
        button.focus()
        expect(button).to_be_focused()
        page.keyboard.press('Enter')
    else:
        button.click()
    nav = launcher_sections(page)
    expect(nav).to_be_visible()
    expect(page.get_by_role('region', name='Characters', exact=True)).to_be_visible()
    expect(page.get_by_role('button', name='World QA A', exact=True)).to_be_visible()
    assert session_account(page) == account_id
    if screenshots:
        page.screenshot(path=str(screenshots / f'continuity-launcher-{width}.png'))

    page.get_by_role('button', name='Load Game / Quick Save', exact=True).click()
    expect(page.get_by_role('heading', name='Open A Local Save', exact=True)).to_be_visible()
    expect(page.get_by_role('button', name=re.compile(r'^Slot \d+\b'))).to_have_count(128)
    expect(page.get_by_role('button', name=re.compile('^Quick Save'))).to_be_visible()
    page.get_by_role('button', name='Back', exact=True).click()
    expect(nav).to_be_visible()

    for section in ('Legacy', 'Chronicles', 'Bloodlines'):
        section_button = nav.get_by_role('button', name=section, exact=True)
        section_button.click()
        expect(section_button).to_have_attribute('aria-current', 'page')
    nav.get_by_role('button', name='Settings', exact=True).click()
    expect(page.get_by_text('Timezone:', exact=True)).to_be_visible()
    for setting in ('12 hr', '24 hr', 'System', 'Light', 'Dark'):
        expect(page.get_by_role('button', name=setting, exact=True)).to_be_visible()
    nav.get_by_role('button', name='Characters', exact=True).click()
    page.get_by_role('button', name=re.compile(r'^1\s+Empty$')).click()
    return_to_menu = page.get_by_role('button', name='Return to main menu', exact=True)
    expect(return_to_menu).to_be_visible()
    return_to_menu.click()
    expect(nav).to_be_visible()
    assert page.evaluate(GRAPH) == graph
    assert page.evaluate('JSON.stringify(Object.entries(localStorage).sort())') == storage

    account_menu = page.get_by_role('button', name='World QA A', exact=True)
    bounds = account_menu.bounding_box()
    clock_overlap = account_menu.evaluate("""(button, {x, y, width, height}) =>
      !!document.elementFromPoint(x + width / 2, y + height / 2)?.closest('.launcher-sprite-clock')
    """, bounds)
    account_menu.focus()
    page.keyboard.press('Enter')
    page.get_by_role('menuitem', name='Log Out', exact=True).click()
    expect(page.get_by_label('Account', exact=True)).to_be_visible()
    assert session_account(page) is None
    assert page.evaluate(GRAPH) == graph
    return clock_overlap


def verify_launcher_admission(page, context, full, account_id):
    # Inject owner responses only in disposable pages. The real button, guard, and
    # showMenu path run unchanged, and no fixture writes to the retained account graph.
    script = """async fault => {
      const loadedModule = name => performance.getEntriesByType('resource')
        .find(({name: url}) => new URL(url).pathname.endsWith('/' + name + '.ts')).name;
      const {CleanEpochAccountAdapter} = await import(loadedModule('cleanEpochAccountAdapter'));
      const {CleanEpochLauncherRead} = await import(loadedModule('cleanEpochLauncherRead'));
      const accounts = CleanEpochAccountAdapter.prototype;
      const launcher = CleanEpochLauncherRead.prototype;
      const validate = accounts.validateSession;
      const inventory = launcher.inventory;
      window.continuityReads = {validation: 0, inventory: 0};
      accounts.validateSession = async function(session) {
        ++window.continuityReads.validation;
        if (fault === 'inventory')
          await new Promise(resolve => {window.releaseContinuityValidation = resolve;});
        const account = await validate.call(this, fault === 'stale'
          ? {...session, metadata: {...session.metadata, epochGeneration: 'stale'}} : session);
        return fault === 'mismatch' ? {...account, accountId: 'wrong-disposable-account'} : account;
      };
      launcher.inventory = async function(...args) {
        ++window.continuityReads.inventory;
        if (fault === 'inventory')
          return {status:'blocked', code:'unavailable', message:'Injected inventory failure.'};
        const result = await inventory.apply(this, args);
        if (fault === 'capture' && result.status === 'ready')
          result.value.slots[0] = {...result.value.slots[0], status:'ready'};
        return result;
      };
    }"""
    graph = page.evaluate(GRAPH)
    failures = [
        ('stale', 'lifecycle generation changed', 0),
        ('mismatch', 'The selected account changed', 0),
        ('inventory', 'Injected inventory failure', 1),
        ('capture', 'lost its deletion source', 2),
    ]
    for fault, message, expected_reads in failures:
        probe = context.new_page()
        try:
            probe.goto(full, wait_until='networkidle')
            entry = open_existing_launcher(probe)
            expect(entry).to_be_enabled()
            probe.evaluate(script, fault)
            entry.click()
            if fault == 'inventory':
                expect(entry).to_be_disabled()
                expect(probe.get_by_role('button', name='Sign Out', exact=True)).to_be_disabled()
                expect(launcher_sections(probe)).to_have_count(0)
                probe.wait_for_function('typeof window.releaseContinuityValidation === "function"')
                assert probe.evaluate('window.continuityReads') == {'validation': 1, 'inventory': 0}
                probe.evaluate('window.releaseContinuityValidation()')
            expect(probe.get_by_role('alert')).to_contain_text(message)
            expect(launcher_sections(probe)).to_have_count(0)
            assert probe.evaluate('window.continuityReads') == {'validation': 1, 'inventory': expected_reads}
            assert session_account(probe) == account_id and probe.evaluate(GRAPH) == graph
        finally:
            probe.close()
    probe = context.new_page()
    try:
        probe.add_init_script("""indexedDB.open = () => { throw new Error('Injected owner unavailable.'); };""")
        probe.goto(full, wait_until='networkidle')
        expect(probe.get_by_role('alert')).to_contain_text('Clean-epoch account transaction failed.')
        expect(open_existing_launcher(probe)).to_have_count(0)
        expect(launcher_sections(probe)).to_have_count(0)
    finally:
        probe.close()


def verify_creator_intent(context, full):
    probe = context.new_page()
    try:
        probe.goto(full, wait_until='networkidle')
        probe.evaluate("""async () => {
          const resource = name => performance.getEntriesByType('resource')
            .find(entry => new URL(entry.name).pathname.endsWith('/' + name + '.js')).name;
          const {default: React} = await import(resource('react'));
          const {default: ReactDOM} = await import(resource('react-dom_client'));
          const {WorldCreator} = await import('/src/game-shell/components/WorldCreator.tsx');
          const site = document.createElement('div');
          site.id = 'creator-intent-fixture';
          document.body.append(site);
          window.testWorldRequests = [];
          function Fixture() {
            const [busy, setBusy] = React.useState(false);
            return React.createElement(WorldCreator, {
              busy, onBusyChange: setBusy,
              onCreate: intent => {
                window.testWorldRequests.push(intent);
                return new Promise(resolve => {window.finishWorldRequest = resolve;});
              },
              onVerified: id => {window.verifiedWorld = id;},
            });
          }
          ReactDOM.createRoot(site).render(React.createElement(Fixture));
        }""")
        creator = probe.locator('#creator-intent-fixture')
        submit = creator.get_by_role('button', name='Create World', exact=True)
        creator.get_by_label('World name', exact=True).fill('  Retry test  ')
        expect(submit).to_be_disabled()
        creator.get_by_role('checkbox', name=re.compile('^Confirm these settings')).check()
        expect(submit).to_be_enabled()
        creator.locator('form').evaluate('form => { form.requestSubmit(); form.requestSubmit(); }')
        expect(submit).to_be_disabled()
        requests = probe.evaluate('window.testWorldRequests')
        assert len(requests) == 1 and requests[0]['displayName'] == 'Retry test'
        probe.evaluate("window.finishWorldRequest({status:'readback-failed',message:'Try again.'})")
        expect(creator.get_by_role('alert')).to_contain_text('World verification failed.')
        retry = creator.get_by_role('button', name='Retry Create World', exact=True)
        retry.click()
        assert probe.evaluate('window.testWorldRequests') == requests * 2
        probe.evaluate("window.finishWorldRequest({status:'verified',worldInstanceId:'world.instance.wrong'})")
        expect(creator.get_by_role('alert')).to_contain_text('differs from this request')
        assert probe.evaluate('window.verifiedWorld === undefined')
        retry.click()
        probe.evaluate("window.finishWorldRequest({status:'verified',worldInstanceId:window.testWorldRequests[0].proposedWorldInstanceId})")
        assert probe.evaluate('window.verifiedWorld') == requests[0]['proposedWorldInstanceId']
    finally:
        probe.close()


def run(origin, screenshots, selected_width=None):
    parsed = urlsplit(origin)
    assert parsed.hostname == '127.0.0.1' and parsed.port
    assert origin == os.environ.get('LINEAGE_TASK_OWNED_ORIGIN')
    full = origin+'/?welcomeL1=1&accountPresentation=1&worldPresentation=1'
    password = 'Disposable World review 20261122'
    reports = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=os.environ['CHROMIUM_EXECUTABLE'])
        try:
            for width,height in [(1440,900),(1280,860),(768,980),(375,812),(320,700)]:
                if selected_width is not None and selected_width != width:
                    continue
                context = browser.new_context(viewport={'width':width,'height':height})
                try:
                    page = context.new_page()
                    page.set_default_timeout(12000)
                    errors = []
                    page.on('pageerror',lambda err: errors.append(str(err)))
                    page.goto(full,wait_until='networkidle')

                    def register(name, account_password=password):
                        page.get_by_label('Display Name',exact=True).fill(name)
                        page.get_by_label('Password',exact=True).fill(account_password)
                        page.get_by_label('Confirm Password',exact=True).fill(account_password)
                        page.get_by_label('Stay signed in',exact=True).check()
                        page.get_by_role('button',name='Create Account',exact=True).click()
                        expect(page.locator('[data-world-presentation="welcome"]')).to_be_visible()
                        expect(page.get_by_role('heading',name='Welcome back, '+name,exact=True)).to_be_visible()
                        dismiss = page.get_by_role('button',name='Dismiss Account Created notification')
                        if dismiss.count(): dismiss.click()

                    def menu(name):
                        return page.locator('header summary').filter(has_text=name)

                    def open_library():
                        page.get_by_role('button',name=re.compile('^Chronicle')).focus()
                        page.keyboard.press('Enter')
                        expect(page.locator('[data-world-presentation="library"]')).to_be_visible()
                        expect(page.get_by_role('heading',name='Your Worlds')).to_be_focused()

                    def open_configuration():
                        page.get_by_role('button',name='Create New World',exact=True).click()
                        expect(page.locator('[data-world-presentation="configuration"]')).to_be_visible()
                        expect(page.get_by_role('heading',name='World Creator')).to_be_focused()

                    register('World QA A')
                    account_a = session_account(page)
                    assert account_a
                    expect(page.get_by_role('button',name=re.compile('^Persistent'))).to_be_disabled()
                    assert 'World time' not in page.locator('body').inner_text()
                    expect(page.locator('header time')).to_contain_text('Local time')
                    # Actual pointer interaction, then keyboard interaction; no force or JS click.
                    menu('World QA A').click()
                    original_theme = page.locator('[data-theme]').first.get_attribute('data-theme')
                    page.get_by_role('button',name=re.compile('Switch to (light|dark) mode')).click()
                    expect(page.locator('[data-theme]').first).to_have_attribute('data-theme','light' if original_theme=='dark' else 'dark')
                    page.get_by_role('button',name=re.compile('Switch to (light|dark) mode')).click()
                    menu('World QA A').click()
                    menu('World QA A').focus()
                    page.keyboard.press('Enter')
                    expect(page.get_by_role('button',name='Logout',exact=True)).to_be_visible()
                    page.keyboard.press('Enter')
                    initial_graph = page.evaluate(GRAPH)
                    initial_storage = page.evaluate('JSON.stringify(Object.entries(localStorage).sort())')
                    open_library()
                    expect(page.get_by_text('World inventory unavailable',exact=True)).to_be_visible()
                    expect(page.locator('#world-pilot-capacity')).to_contain_text('one World per account')
                    assert page.get_by_text('View Characters',exact=True).count() == 0
                    open_configuration()
                    original_theme = page.locator('[data-theme]').first.get_attribute('data-theme')
                    menu('World QA A').click()
                    theme_toggle = page.get_by_role('button',name=re.compile('Switch to (light|dark) mode'))
                    theme_toggle.click()
                    expect(page.locator('[data-theme]').first).to_have_attribute(
                        'data-theme','light' if original_theme == 'dark' else 'dark')
                    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                    if screenshots:
                        screenshots.mkdir(parents=True,exist_ok=True)
                        page.screenshot(path=str(screenshots/f'world-creator-alternate-theme-{width}.png'))
                    theme_toggle.click()
                    expect(page.locator('[data-theme]').first).to_have_attribute('data-theme',original_theme)
                    menu('World QA A').click()
                    expect(page.get_by_text('Individual',exact=True)).to_be_visible()
                    expect(page.get_by_text('Persistent, Living and Hardcore are Coming Soon.',exact=True)).to_be_visible()
                    expect(page.get_by_role('combobox',name=re.compile('^Difficulty'))).to_be_disabled()
                    final_create = page.get_by_role('button',name='Create World',exact=True)
                    expect(final_create).to_be_disabled()
                    for label in ['Temperature', 'Rainfall', 'Starting season']:
                        expect(page.get_by_role('combobox',name=label,exact=True)).to_be_disabled()
                    season = page.get_by_role('combobox',name=re.compile('^Starting season'))
                    assert season.locator('option').all_text_contents() == ['Scenario Default']+seasons
                    name = page.get_by_label('World name',exact=True)
                    confirm = page.get_by_role('checkbox',name=re.compile('^Confirm these settings'))
                    name.fill('  ')
                    name.press('Tab')
                    expect(name).to_have_attribute('aria-invalid','true')
                    expect(confirm).to_be_disabled()
                    name.fill('x'*81)
                    expect(name).to_have_attribute('aria-invalid','true')
                    name.fill('  Discard this draft  ')
                    expect(name).to_have_attribute('aria-invalid','false')
                    expect(page.get_by_text(re.compile('^Discard this draft · Chronicle'))).to_be_visible()
                    confirm.check()
                    expect(final_create).to_be_disabled()
                    name.press('Enter')
                    assert page.evaluate(GRAPH) == initial_graph
                    assert page.evaluate('JSON.stringify(Object.entries(localStorage).sort())') == initial_storage
                    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                    if screenshots:
                        screenshots.mkdir(parents=True,exist_ok=True)
                        page.screenshot(path=str(screenshots/f'world-review-{width}.png'),full_page=True)
                    final_create.scroll_into_view_if_needed()
                    expect(final_create).to_be_visible()
                    expect(final_create).to_be_disabled()
                    bounds = final_create.bounding_box()
                    assert 0 <= bounds['x'] and bounds['x']+bounds['width'] <= width
                    assert 0 <= bounds['y'] and bounds['y']+bounds['height'] <= height
                    if screenshots and width in (1280,375):
                        page.screenshot(path=str(screenshots/f'world-review-bottom-{width}.png'),full_page=True)
                    page.get_by_role('button',name='Back to World Library',exact=True).click()
                    open_configuration()
                    expect(name).to_have_value('')
                    expect(confirm).not_to_be_checked()
                    expect(season).to_have_value('Scenario Default')
                    expect(page.get_by_role('combobox',name=re.compile('^Temperature'))).to_have_value('Normal')
                    expect(page.get_by_role('combobox',name=re.compile('^Rainfall'))).to_have_value('Normal')
                    name.fill('Discard from Home')
                    page.get_by_role('button',name='Home',exact=True).click()
                    expect(page.locator('[data-world-presentation="welcome"]')).to_be_visible()
                    open_library()
                    open_configuration()
                    expect(name).to_have_value('')
                    name.fill('Discard on unmount')
                    page.reload(wait_until='networkidle')
                    expect(page.locator('[data-world-presentation="welcome"]')).to_be_visible()
                    open_library()
                    open_configuration()
                    expect(name).to_have_value('')
                    assert page.evaluate(GRAPH) == initial_graph
                    page.get_by_role('button',name='Back to World Library',exact=True).click()
                    page.get_by_role('button',name='Back to Welcome',exact=True).click()
                    expect(page.locator('[data-world-presentation="welcome"]')).to_be_visible()
                    assert session_account(page) == account_a
                    page.get_by_role('button',name='Sign Out',exact=True).click()
                    expect(page.get_by_label('Account',exact=True)).to_be_visible()
                    assert page.evaluate("localStorage.getItem('cataclysm-rpg-ui.epoch1.session')===null")
                    page.get_by_role('button',name='Create Account',exact=True).click()
                    second_password = password + ' second'
                    register('World QA A', second_password)
                    account_b = session_account(page)
                    assert account_b and account_b != account_a
                    open_library()
                    open_configuration()
                    expect(name).to_have_value('')
                    menu('World QA A').click()
                    page.get_by_role('button',name='Logout',exact=True).click()
                    expect(page.get_by_label('Account',exact=True)).to_be_visible()
                    picker = page.get_by_label('Account',exact=True)
                    options = picker.get_by_role('option',name=re.compile(r'^World QA A — .+ \(account [12]\)$'))
                    expect(options).to_have_count(2)
                    assert len(set(options.all_text_contents())) == 2
                    def login(account_id, account_password, persist=True):
                        picker.select_option(value=account_id)
                        expect(picker).to_have_value(account_id)
                        page.get_by_label('Password',exact=True).fill(account_password)
                        page.get_by_label('Stay logged in',exact=True).set_checked(persist)
                        page.get_by_role('button',name='Log In',exact=True).click()
                        expect(page.locator('[data-world-presentation="welcome"]')).to_be_visible()
                        assert session_account(page) == (account_id if persist else None)
                        dismiss = page.get_by_role('button',name='Dismiss Signed In notification')
                        if dismiss.count():
                            dismiss.click()

                    expect(open_existing_launcher(page)).to_have_count(0)
                    login(account_b, second_password)
                    page.get_by_role('button',name='Sign Out',exact=True).click()
                    expect(picker).to_be_visible()
                    login(account_b, second_password, persist=False)
                    open_existing_launcher(page).click()
                    expect(launcher_sections(page)).to_be_visible()
                    assert session_account(page) is None
                    page.reload(wait_until='networkidle')
                    expect(picker).to_be_visible()
                    login(account_a, password)
                    clock_overlap = verify_launcher(page, width, screenshots, account_a)
                    login(account_a, password)
                    if width == 1280:
                        verify_launcher_admission(page, context, full, account_a)
                        print('PASS: launcher rejects stale session, mismatched identity, unavailable owner, inventory and capture faults', flush=True)
                        verify_creator_intent(context, full)
                        print('PASS: isolated Creator callback serializes submit and preserves request identity through retry', flush=True)
                    # Missing either opt-in preserves the old L1 gate.
                    for query in ['?welcomeL1=1&accountPresentation=1','?welcomeL1=1&worldPresentation=1']:
                        page.goto(origin+'/'+query,wait_until='networkidle')
                        expect(page.locator('[data-world-presentation]')).to_have_count(0)
                        expect(open_existing_launcher(page)).to_have_count(0)
                        page.get_by_role('button',name=re.compile('^Repeat-run adventure')).click()
                        expect(page.get_by_role('heading',name='World Library not ready',exact=True)).to_be_visible()
                        page.get_by_role('button',name='Back to Welcome',exact=True).click()
                    page.goto(origin+'/?accountPresentation=1&worldPresentation=1',wait_until='networkidle')
                    expect(page.locator('[data-world-presentation]')).to_have_count(0)
                    expect(open_existing_launcher(page)).to_have_count(0)
                    expect(page.get_by_role('navigation',name='Launcher sections')).to_be_visible()
                    graph = page.evaluate(GRAPH)
                    assert graph['counts']['accounts'] == 2
                    for store,count in graph['counts'].items():
                        if store not in ['accounts','accountLifecycle']:
                            assert count == 0,(store,count)
                    assert not errors,errors
                    reports.append({'width':width,'status':'PASS','pointerKeyboardMenu':'PASS',
                        'existingLauncher':'PASS','launcherClockInterceptsAccountCenter':clock_overlap,
                        'draftResetGateOff':'PASS','graphAndSessionStableDuringReview':True,'saveCount':0,'pageErrors':0})
                    print(f'PASS: real Welcome/World presentation at {width}px',flush=True)
                finally: context.close()
        finally: browser.close()
    print(json.dumps({'status':'PASS','scope':'authenticated presentation and launcher compatibility; no World/Save publication','viewports':reports},indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--origin',required=True)
    parser.add_argument('--screenshots',type=Path)
    parser.add_argument('--width',type=int,choices=[1440,1280,768,375,320])
    args = parser.parse_args()
    run(args.origin.rstrip('/'),args.screenshots,args.width)
