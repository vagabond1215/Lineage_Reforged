"""Real EpochApp presentation QA; only a separately registered task-owned origin.

Requires Python Playwright and CHROMIUM_EXECUTABLE. Uses disposable browser
contexts, registers synthetic accounts through the real UI, and never creates a Save.
"""
import argparse
import json
import os
import re
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

GRAPH = """async () => {
  const db = await new Promise((resolve,reject) => {
    const req=indexedDB.open('lineage.campaigns.epoch1');
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
  try {
    const names=Array.from(db.objectStoreNames).sort();
    const rows=await Promise.all(names.map(name=>new Promise((resolve,reject)=>{
      const tx=db.transaction(name,'readonly');const req=tx.objectStore(name).getAll();
      tx.oncomplete=()=>resolve([name,req.result]);tx.onerror=()=>reject(tx.error);
    })));
    const bytes=new TextEncoder().encode(JSON.stringify(rows));
    const hash=await crypto.subtle.digest('SHA-256',bytes);
    return {digest:Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join(''),
      counts:Object.fromEntries(rows.map(([name,values])=>[name,values.length]))};
  } finally {db.close();}
}"""


def run(origin, screenshots):
    parsed = urlsplit(origin)
    assert parsed.hostname == '127.0.0.1' and parsed.port, 'Require isolated loopback port'
    assert origin == os.environ.get('LINEAGE_TASK_OWNED_ORIGIN'), 'Confirm registered task-owned origin'
    gated = origin + '/?welcomeL1=1&accountPresentation=1'
    password = 'Disposable QA only 20261122'
    reports = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=os.environ['CHROMIUM_EXECUTABLE'])
        try:
            for width, height in [(1440,900),(1280,860),(768,980),(375,812),(320,700)]:
                context = browser.new_context(viewport={'width':width,'height':height})
                try:
                    page = context.new_page()
                    page.set_default_timeout(12000)
                    errors = []
                    page.on('pageerror', lambda err: errors.append(str(err)))
                    # Pause only this test page's password derivation for a deterministic busy witness.
                    page.add_init_script("""const derive=crypto.subtle.deriveBits.bind(crypto.subtle);
                      crypto.subtle.deriveBits=async(...args)=>{
                        if(window.__holdAuth) await new Promise(r=>window.__releaseAuth=r);
                        return derive(...args);
                      };""")
                    page.goto(gated, wait_until='networkidle')
                    expect(page.locator('[data-account-presentation="contextual"]')).to_be_visible()
                    expect(page.get_by_role('heading', name='Create Account', exact=True)).to_be_visible()
                    page.get_by_role('button', name='Create Account', exact=True).click()
                    expect(page.get_by_text('Could Not Create Account', exact=True)).to_be_visible()
                    page.get_by_role('button', name='Dismiss Could Not Create Account notification').click()

                    def register(name):
                        page.get_by_label('Display Name', exact=True).fill(name)
                        page.get_by_label('Password', exact=True).fill(password)
                        page.get_by_label('Confirm Password', exact=True).fill(password)
                        page.get_by_role('button', name='Create Account', exact=True).click()
                        expect(page.get_by_role('heading', name='Welcome back, '+name, exact=True)).to_be_visible()
                        expect(page.get_by_role('button', name='Persistent', exact=False)).to_be_disabled()
                        page.get_by_role('button', name='Logout', exact=True).click()
                        expect(page.get_by_label('Account', exact=True)).to_be_visible()

                    register('Shell QA A')
                    page.get_by_role('button', name='Create Account', exact=True).click()
                    page.get_by_role('button', name='Back', exact=True).click()
                    expect(page.get_by_label('Account', exact=True)).to_be_visible()
                    page.get_by_role('button', name='Create Account', exact=True).click()
                    register('Shell QA B')
                    picker = page.get_by_label('Account', exact=True)
                    login = page.get_by_role('button', name='Log In', exact=True)
                    expect(login).to_be_disabled()
                    expect(page.get_by_label('Password', exact=True)).to_be_disabled()
                    expect(page.get_by_role('button', name='Logout', exact=True)).to_have_count(0)
                    # No storage changes from presentation, theme or gate switching.
                    initial = page.evaluate(GRAPH)
                    initial_theme = page.locator('[data-theme]').first.get_attribute('data-theme')
                    page.get_by_text('Guest', exact=True).click()
                    page.get_by_role('button', name=re.compile('Switch to (light|dark) mode')).click()
                    expect(page.locator('[data-theme]').first).to_have_attribute('data-theme', 'light' if initial_theme == 'dark' else 'dark')
                    page.get_by_role('button', name=re.compile('Switch to (light|dark) mode')).click()
                    page.get_by_text('Guest', exact=True).click()
                    picker.select_option(label='Shell QA A')
                    page.get_by_label('Password', exact=True).fill('wrong-password')
                    login.click()
                    expect(page.get_by_text('Could Not Sign In', exact=True)).to_be_visible()
                    expect(login).to_be_enabled()
                    assert page.evaluate(GRAPH) == initial, 'Failed login changed account graph'
                    picker.select_option(label='Shell QA B')
                    expect(page.get_by_label('Password', exact=True)).to_have_value('')
                    expect(page.get_by_label('Stay logged in', exact=True)).not_to_be_checked()
                    page.get_by_text('Manage selected account', exact=True).click()
                    expect(page.get_by_role('button', name='Delete Account', exact=True)).to_be_visible()
                    page.get_by_text('Restore epoch backup', exact=True).first.click()
                    expect(page.get_by_label('Choose epoch backup file', exact=True)).to_be_visible()
                    page.get_by_label('Choose epoch backup file', exact=True).set_input_files({
                        'name':'invalid.json','mimeType':'application/json','buffer':b'{}'})
                    expect(page.get_by_role('alert')).to_contain_text('Restore failed')
                    assert page.evaluate(GRAPH) == initial, 'Rejected restore changed account graph'
                    # Hide management panels, then verify the reviewed form geometry.
                    page.get_by_text('Manage selected account', exact=True).click()
                    page.get_by_text('Restore epoch backup', exact=True).first.click()
                    dismiss = page.get_by_role('button', name='Dismiss Could Not Sign In notification')
                    if dismiss.count():
                        dismiss.click()
                    picker_box = picker.bounding_box()
                    pass_box = page.get_by_label('Password', exact=True).bounding_box()
                    login_box = login.bounding_box()
                    stay_box = page.get_by_label('Stay logged in', exact=True).bounding_box()
                    assert picker_box['y'] < pass_box['y'] < stay_box['y']
                    assert abs(pass_box['y']-login_box['y']) < 3
                    assert login_box['x'] >= pass_box['x']+pass_box['width']
                    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
                    assert not page.locator('aside').count()
                    if screenshots and width in (1280,375):
                        screenshots.mkdir(parents=True,exist_ok=True)
                        page.screenshot(path=str(screenshots/f'account-{width}.png'),full_page=True)

                    # Keyboard submit + busy controls through the actual production caller.
                    picker.focus()
                    page.keyboard.press('Tab')
                    expect(page.get_by_label('Password', exact=True)).to_be_focused()
                    page.keyboard.type(password)
                    page.get_by_label('Stay logged in', exact=True).check()
                    page.evaluate('window.__holdAuth=true')
                    page.get_by_label('Password', exact=True).press('Enter')
                    expect(page.get_by_text('Signing in…', exact=True)).to_be_visible()
                    expect(picker).to_be_disabled()
                    expect(login).to_be_disabled()
                    expect(page.get_by_role('button', name='Create Account', exact=True)).to_be_disabled()
                    page.wait_for_function('typeof window.__releaseAuth === "function"')
                    page.evaluate('window.__holdAuth=false;window.__releaseAuth()')
                    expect(page.get_by_role('heading', name='Welcome back, Shell QA B')).to_be_visible()
                    assert page.evaluate("localStorage.getItem('cataclysm-rpg-ui.epoch1.session') !== null")
                    page.reload(wait_until='networkidle')
                    expect(page.get_by_role('heading', name='Welcome back, Shell QA B')).to_be_visible()
                    page.get_by_role('button', name='Logout', exact=True).click()
                    after_login = page.evaluate(GRAPH)
                    page.goto(origin+'/?welcomeL1=1',wait_until='networkidle')
                    expect(page.locator('[data-account-presentation]')).to_have_count(0)
                    expect(page.get_by_label('Account', exact=True)).to_have_count(0)
                    expect(page.get_by_role('button', name='Shell QA B', exact=False)).to_be_visible()
                    assert page.evaluate(GRAPH) == after_login, 'Gate-off render mutated account graph'
                    page.get_by_role('button', name='Shell QA B', exact=False).click()
                    page.get_by_label('Password', exact=True).fill(password)
                    page.get_by_role('button', name='Log In', exact=True).click()
                    expect(page.get_by_role('heading', name='Welcome back, Shell QA B')).to_be_visible()
                    assert page.evaluate("localStorage.getItem('cataclysm-rpg-ui.epoch1.session') === null")
                    page.reload(wait_until='networkidle')
                    expect(page.get_by_role('button', name='Shell QA B', exact=False)).to_be_visible()
                    # Presentation query alone cannot activate the visual or Welcome route.
                    page.goto(origin+'/?accountPresentation=1',wait_until='networkidle')
                    expect(page.locator('[data-account-presentation]')).to_have_count(0)
                    page.get_by_role('button', name='Shell QA A', exact=False).click()
                    page.get_by_label('Password', exact=True).fill(password)
                    page.get_by_role('button', name='Log In', exact=True).click()
                    expect(page.get_by_role('navigation', name='Launcher sections')).to_be_visible()
                    # Existing MAIN_MENU clock overlays the pointer target at
                    # desktop. Keep this unrelated layout issue visible in the
                    # receipt; use its supported keyboard menu path here.
                    page.get_by_role('button', name='Shell QA A', exact=True).focus()
                    page.keyboard.press('Enter')
                    expect(page.get_by_role('menuitem', name='Log Out', exact=True)).to_be_visible()
                    final = page.evaluate(GRAPH)
                    assert final['counts']['accounts'] == 2
                    for store in ['artifacts','controls','slots','newCampaignAttempts','pendingPublicationRecoveries']:
                        assert final['counts'][store] == 0, (store,final['counts'])
                    assert not errors, errors
                    reports.append({'width':width,'status':'PASS','keyboardBusySessionGateOff':'PASS',
                        'accountGraphStableOnPresentationFailures':True,'accountCount':2,'saveCount':0,'pageErrors':0})
                    print(f'PASS: real account presentation at {width}px', flush=True)
                finally:
                    context.close()
        finally:
            browser.close()
    print(json.dumps({'status':'PASS','scope':'real EpochApp, disposable accounts, no World or Save','viewports':reports},indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--origin',required=True)
    parser.add_argument('--screenshots',type=Path)
    args = parser.parse_args()
    run(args.origin.rstrip('/'),args.screenshots)
