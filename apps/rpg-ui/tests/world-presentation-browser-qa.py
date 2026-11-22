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


def run(origin, screenshots):
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
                context = browser.new_context(viewport={'width':width,'height':height})
                try:
                    page = context.new_page()
                    page.set_default_timeout(12000)
                    errors = []
                    page.on('pageerror',lambda err: errors.append(str(err)))
                    page.goto(full,wait_until='networkidle')

                    def register(name):
                        page.get_by_label('Display Name',exact=True).fill(name)
                        page.get_by_label('Password',exact=True).fill(password)
                        page.get_by_label('Confirm Password',exact=True).fill(password)
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

                    def open_configuration():
                        page.get_by_role('button',name='Create World',exact=True).click()
                        expect(page.locator('[data-world-presentation="configuration"]')).to_be_visible()

                    register('World QA A')
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
                    expect(page.get_by_text('No Worlds available',exact=True)).to_be_visible()
                    expect(page.locator('#world-review-boundary')).to_contain_text('World registry unavailable')
                    assert page.get_by_text('View Characters',exact=True).count() == 0
                    open_configuration()
                    expect(page.get_by_role('radio',name='Individual',exact=True)).to_be_checked()
                    expect(page.get_by_role('radio',name='Living — Coming Soon',exact=True)).to_be_disabled()
                    expect(page.get_by_role('combobox',name=re.compile('^Difficulty'))).to_be_disabled()
                    expect(page.get_by_role('button',name='Create World (unavailable)',exact=True)).to_be_disabled()
                    for label in ['Hardcore','Climate variability','Disasters','Extreme weather']:
                        expect(page.get_by_label(label,exact=True)).to_be_disabled()
                    season = page.get_by_role('combobox',name=re.compile('^Starting season'))
                    assert season.locator('option').all_text_contents() == ['Scenario Default']+seasons
                    page.get_by_label('World name (review only)',exact=True).fill('Discard this draft')
                    page.get_by_role('combobox',name=re.compile('^Temperature')).select_option(label='Hot')
                    page.get_by_role('combobox',name=re.compile('^Rainfall')).select_option(label='Wet')
                    season.select_option(label='Harvest')
                    assert page.evaluate(GRAPH) == initial_graph
                    assert page.evaluate('JSON.stringify(Object.entries(localStorage).sort())') == initial_storage
                    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                    if screenshots and width in (1280,375):
                        screenshots.mkdir(parents=True,exist_ok=True)
                        page.screenshot(path=str(screenshots/f'world-review-{width}.png'),full_page=True)
                    final_create = page.get_by_role('button',name='Create World (unavailable)',exact=True)
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
                    expect(page.get_by_label('World name (review only)',exact=True)).to_have_value('')
                    expect(season).to_have_value('Scenario Default')
                    expect(page.get_by_role('combobox',name=re.compile('^Temperature'))).to_have_value('Normal')
                    expect(page.get_by_role('combobox',name=re.compile('^Rainfall'))).to_have_value('Normal')
                    page.get_by_label('World name (review only)',exact=True).fill('Discard on unmount')
                    page.reload(wait_until='networkidle')
                    expect(page.locator('[data-world-presentation="welcome"]')).to_be_visible()
                    open_library()
                    open_configuration()
                    expect(page.get_by_label('World name (review only)',exact=True)).to_have_value('')
                    assert page.evaluate(GRAPH) == initial_graph
                    page.get_by_role('button',name='Back to World Library',exact=True).click()
                    page.get_by_role('button',name='Back to Welcome',exact=True).click()
                    expect(page.locator('[data-world-presentation="welcome"]')).to_be_visible()
                    # Existing owner callback, not a local pretend logout.
                    page.get_by_role('button',name='Back to account access (sign out)',exact=True).click()
                    expect(page.get_by_label('Account',exact=True)).to_be_visible()
                    assert page.evaluate("localStorage.getItem('cataclysm-rpg-ui.epoch1.session')===null")
                    page.get_by_role('button',name='Create Account',exact=True).click()
                    register('World QA B')
                    open_library()
                    open_configuration()
                    expect(page.get_by_label('World name (review only)',exact=True)).to_have_value('')
                    menu('World QA B').click()
                    page.get_by_role('button',name='Logout',exact=True).click()
                    expect(page.get_by_label('Account',exact=True)).to_be_visible()
                    page.get_by_label('Account',exact=True).select_option(label='World QA A')
                    page.get_by_label('Password',exact=True).fill(password)
                    page.get_by_label('Stay logged in',exact=True).check()
                    page.get_by_role('button',name='Log In',exact=True).click()
                    expect(page.locator('[data-world-presentation="welcome"]')).to_be_visible()
                    # Missing either opt-in preserves the old L1 gate.
                    for query in ['?welcomeL1=1&accountPresentation=1','?welcomeL1=1&worldPresentation=1']:
                        page.goto(origin+'/'+query,wait_until='networkidle')
                        expect(page.locator('[data-world-presentation]')).to_have_count(0)
                        page.get_by_role('button',name=re.compile('^Repeat-run adventure')).click()
                        expect(page.get_by_role('heading',name='World Library not ready',exact=True)).to_be_visible()
                        page.get_by_role('button',name='Back to Welcome',exact=True).click()
                    page.goto(origin+'/?accountPresentation=1&worldPresentation=1',wait_until='networkidle')
                    expect(page.locator('[data-world-presentation]')).to_have_count(0)
                    expect(page.get_by_role('navigation',name='Launcher sections')).to_be_visible()
                    graph = page.evaluate(GRAPH)
                    assert graph['counts']['accounts'] == 2
                    for store,count in graph['counts'].items():
                        if store not in ['accounts','accountLifecycle']:
                            assert count == 0,(store,count)
                    assert not errors,errors
                    reports.append({'width':width,'status':'PASS','pointerKeyboardMenu':'PASS',
                        'draftResetGateOff':'PASS','graphAndSessionStableDuringReview':True,'saveCount':0,'pageErrors':0})
                    print(f'PASS: real Welcome/World presentation at {width}px',flush=True)
                finally: context.close()
        finally: browser.close()
    print(json.dumps({'status':'PASS','scope':'authenticated presentation; no World/Save owner activation','viewports':reports},indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--origin',required=True)
    parser.add_argument('--screenshots',type=Path)
    args = parser.parse_args()
    run(args.origin.rstrip('/'),args.screenshots)
