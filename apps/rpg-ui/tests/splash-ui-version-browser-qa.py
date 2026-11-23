"""Real splash navigation on a registered disposable loopback origin."""
import argparse
import importlib.util
import os
import re
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

from playwright.sync_api import expect, sync_playwright

spec = importlib.util.spec_from_file_location(
    'account_qa', Path(__file__).with_name('account-presentation-browser-qa.py'))
account_qa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(account_qa)
GRAPH = account_qa.GRAPH
HINT = 'cataclysm-rpg-ui.epoch1.session'
FLAGS = ('welcomeL1', 'accountPresentation', 'worldPresentation')


def snapshot(page):
    return page.evaluate(GRAPH), page.evaluate('Object.entries(localStorage).sort()')


def hint(page):
    return page.evaluate('(key) => JSON.parse(localStorage.getItem(key))?.accountId', HINT)


def run(origin, screenshots, selected_width):
    assert origin == os.environ.get('LINEAGE_TASK_OWNED_ORIGIN')
    assert urlsplit(origin).hostname == '127.0.0.1' and urlsplit(origin).port
    entry = origin + '/index.html?tag=first&tag=second#splash'
    password = 'Disposable splash verification 20261122'
    display_name = 'Splash QA'
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ['CHROMIUM_EXECUTABLE'], headless=True)
        try:
            for width, height in [(1440, 900), (1280, 860), (768, 980), (375, 812), (320, 700)]:
                if selected_width and width != selected_width:
                    continue
                context = browser.new_context(viewport={'width': width, 'height': height})
                try:
                    page = context.new_page()
                    page.set_default_timeout(12000)
                    errors = []
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.add_init_script("""const derive = crypto.subtle.deriveBits.bind(crypto.subtle);
                      crypto.subtle.deriveBits = async (...args) => {
                        if (window.holdSplashAuth)
                          await new Promise(resolve => {window.releaseSplashAuth = resolve;});
                        return derive(...args);
                      };
                      const fileText = File.prototype.text;
                      File.prototype.text = async function () {
                        if (window.holdSplashArchive)
                          await new Promise(resolve => {window.releaseSplashArchive = resolve;});
                        return fileText.call(this);
                      };""")
                    region = page.get_by_role('region', name='UI version', exact=True)
                    classic = region.get_by_role('button', name='Classic UI', exact=True)
                    preview = region.get_by_role('button', name='New UI Preview', exact=True)
                    preview_layout = page.locator('[data-account-presentation="contextual"]')

                    def check_layout(new_ui):
                        expect(classic).to_have_attribute('aria-pressed', 'false' if new_ui else 'true')
                        expect(preview).to_have_attribute('aria-pressed', 'true' if new_ui else 'false')
                        expect(preview_layout).to_have_count(int(new_ui))
                        url = urlsplit(page.url)
                        assert url.path == '/index.html' and url.fragment == 'splash'
                        assert url.netloc == urlsplit(origin).netloc
                        query = parse_qs(url.query)
                        assert query == {'tag': ['first', 'second'],
                                         **({flag: ['1'] for flag in FLAGS} if new_ui else {})}
                        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
                        for button in (classic, preview):
                            button.scroll_into_view_if_needed()
                            expect(button).to_be_in_viewport(ratio=1)
                            box = button.bounding_box()
                            assert box and box['x'] >= 0 and box['x'] + box['width'] <= width

                    def switch(new_ui, keyboard=False):
                        button = preview if new_ui else classic
                        if keyboard:
                            button.focus()
                            expect(button).to_be_focused()
                            page.keyboard.press('Enter')
                        else:
                            button.click()
                        check_layout(new_ui)

                    def choose_account(new_ui, account_id):
                        if new_ui:
                            picker = page.get_by_label('Account', exact=True)
                            picker.select_option(value=account_id)
                            expect(picker).to_have_value(account_id)
                        else:
                            page.get_by_role('button', name=re.compile('^' + display_name)).click()

                    def login(persist):
                        page.get_by_label('Password', exact=True).fill(password)
                        page.get_by_label(re.compile(r'^Stay (logged|signed) in$')).set_checked(persist)
                        page.get_by_role('button', name='Log In', exact=True).click()

                    page.goto(entry, wait_until='networkidle')
                    check_layout(False)
                    expect(page.get_by_role('heading', name='Create Account', exact=True)).to_be_visible()
                    blank = snapshot(page)
                    history_length = page.evaluate('history.length')
                    page.get_by_label('Display Name', exact=True).fill('Discarded draft')
                    page.get_by_label('Password', exact=True).fill(password)
                    switch(True, keyboard=True)
                    expect(page.get_by_label('Display Name', exact=True)).to_have_value('')
                    expect(page.get_by_label('Password', exact=True)).to_have_value('')
                    assert snapshot(page) == blank
                    page.reload(wait_until='networkidle')
                    check_layout(True)
                    switch(False)
                    assert snapshot(page) == blank
                    assert page.evaluate('history.length') == history_length

                    page.get_by_label('Display Name', exact=True).fill(display_name)
                    page.get_by_label('Password', exact=True).fill(password)
                    page.get_by_label('Confirm Password', exact=True).fill(password)
                    page.get_by_label('Stay signed in', exact=True).check()
                    if width == 1280:
                        page.evaluate('window.holdSplashAuth = true')
                    page.get_by_role('button', name='Create Account', exact=True).click()
                    if width == 1280:
                        page.wait_for_function('typeof window.releaseSplashAuth === "function"')
                        expect(classic).to_be_disabled()
                        expect(preview).to_be_disabled()
                        page.evaluate('window.holdSplashAuth = false; window.releaseSplashAuth(); window.releaseSplashAuth = null')
                    nav = page.get_by_role('navigation', name='Launcher sections')
                    expect(nav).to_be_visible()
                    expect(region).to_have_count(0)
                    account_id = hint(page)
                    assert account_id
                    account_menu = page.get_by_role('button', name=display_name, exact=True)
                    account_menu.focus()
                    page.keyboard.press('Enter')
                    page.get_by_role('menuitem', name='Log Out', exact=True).click()
                    check_layout(False)
                    assert hint(page) is None
                    expect(page.get_by_label('Choose epoch backup file', exact=True)).to_be_visible()
                    before = snapshot(page)
                    if screenshots:
                        screenshots.mkdir(parents=True, exist_ok=True)
                        region.screenshot(path=str(screenshots / f'classic-{width}.png'))
                    switch(True)
                    assert snapshot(page) == before and hint(page) is None
                    if screenshots:
                        region.screenshot(path=str(screenshots / f'preview-{width}.png'))
                    page.locator('summary').get_by_text('Restore epoch backup', exact=True).click()
                    archive = page.get_by_label('Choose epoch backup file', exact=True)
                    expect(archive).to_be_visible()
                    if width == 1280:
                        page.evaluate('window.holdSplashArchive = true')
                        archive.set_input_files({'name': 'invalid.json', 'mimeType': 'application/json', 'buffer': b'{}'})
                        page.wait_for_function('typeof window.releaseSplashArchive === "function"')
                        expect(classic).to_be_disabled()
                        expect(preview).to_be_disabled()
                        page.evaluate('window.holdSplashArchive = false; window.releaseSplashArchive()')
                        expect(page.get_by_role('alert')).to_contain_text('Restore failed')
                        expect(preview).to_be_enabled()
                        assert snapshot(page) == before
                    choose_account(True, account_id)
                    if width == 1280:
                        manage = page.locator('summary').get_by_text('Manage selected account', exact=True)
                        manage.click()
                        page.get_by_label('Password', exact=True).fill('incorrect deletion password')
                        page.evaluate('window.holdSplashAuth = true')
                        page.get_by_role('button', name='Delete Account', exact=True).click()
                        page.wait_for_function('typeof window.releaseSplashAuth === "function"')
                        expect(classic).to_be_disabled()
                        expect(preview).to_be_disabled()
                        page.evaluate('window.holdSplashAuth = false; window.releaseSplashAuth(); window.releaseSplashAuth = null')
                        expect(preview).to_be_enabled()
                        assert snapshot(page) == before
                        manage.click()
                    page.get_by_label('Password', exact=True).fill('incorrect password')
                    page.evaluate('window.holdSplashAuth = true')
                    page.get_by_role('button', name='Log In', exact=True).click()
                    page.wait_for_function('typeof window.releaseSplashAuth === "function"')
                    expect(classic).to_be_disabled()
                    expect(preview).to_be_disabled()
                    page.evaluate('window.holdSplashAuth = false; window.releaseSplashAuth()')
                    expect(page.get_by_role('button', name='Dismiss Could Not Sign In notification')).to_be_visible()
                    page.get_by_role('button', name='Dismiss Could Not Sign In notification').click()
                    expect(classic).to_be_enabled()
                    assert snapshot(page) == before
                    login(persist=True)
                    welcome = page.locator('[data-world-presentation="welcome"]')
                    expect(welcome).to_be_visible()
                    expect(region).to_have_count(0)
                    assert hint(page) == account_id
                    page.reload(wait_until='networkidle')
                    expect(welcome).to_be_visible()
                    page.get_by_role('button', name='Sign Out', exact=True).click()
                    check_layout(True)
                    assert hint(page) is None
                    before = snapshot(page)
                    switch(False, keyboard=True)
                    assert snapshot(page) == before and hint(page) is None
                    choose_account(False, account_id)
                    login(persist=False)
                    expect(nav).to_be_visible()
                    assert hint(page) is None
                    page.reload(wait_until='networkidle')
                    check_layout(False)
                    expect(page.get_by_role('button', name=re.compile('^' + display_name))).to_be_visible()
                    counts = page.evaluate(GRAPH)['counts']
                    assert counts['accounts'] == 1
                    assert all(count == 0 for store, count in counts.items()
                               if store not in ('accounts', 'accountLifecycle'))
                    assert not errors, errors
                    print(f'PASS {width}px: both directions, owner/session continuity, busy, keyboard and overflow', flush=True)
                finally:
                    context.close()
        finally:
            browser.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--origin', required=True)
    parser.add_argument('--screenshots', type=Path)
    parser.add_argument('--width', type=int, choices=[1440, 1280, 768, 375, 320])
    args = parser.parse_args()
    run(args.origin.rstrip('/'), args.screenshots, args.width)
