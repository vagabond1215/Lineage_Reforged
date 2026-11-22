"""World Creator acceptance through the real compiled splash and launcher."""
import argparse
import hashlib
import json
import os
import re
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright

FLAGS = '?welcomeL1=1&accountPresentation=1&worldPresentation=1'
PASSWORD = 'disposable-browser-password'
SOURCE = '**/world-source/**/*.json'
DATABASE = 'lineage.campaigns.epoch1'
SNAPSHOT = """async name => {
  const db = await new Promise((resolve, reject) => {
    const open = indexedDB.open(name);
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error);
  });
  try {
    const stores = [...db.objectStoreNames];
    const tx = db.transaction(stores);
    return Object.fromEntries(await Promise.all(stores.map(store => new Promise((resolve, reject) => {
      const read = tx.objectStore(store).getAll();
      read.onsuccess = () => resolve([store, read.result]);
      read.onerror = () => reject(read.error);
    }))));
  } finally { db.close(); }
}"""
PAIR = ('worldsV8', 'worldCreationReceiptsV8')


def button(page, name):
    return page.get_by_role('button', name=name, exact=True)


def welcome(page, name):
    expect(page.get_by_role('heading', name=f'Welcome back, {name}')).to_be_visible()


def register(page, name, remember=False):
    page.get_by_label('Display Name', exact=True).fill(name)
    page.get_by_label('Password', exact=True).fill(PASSWORD)
    page.get_by_label('Confirm Password', exact=True).fill(PASSWORD)
    page.get_by_label('Stay signed in', exact=True).set_checked(remember)
    button(page, 'Create Account').click()
    welcome(page, name)


def sign_in(page, name, remember=False):
    picker = page.get_by_label('Account', exact=True)
    account = picker.get_by_role('option', name=re.compile(name)).get_attribute('value')
    picker.select_option(account)
    page.get_by_label('Password', exact=True).fill(PASSWORD)
    page.get_by_label('Stay logged in', exact=True).set_checked(remember)
    button(page, 'Log In').click()
    welcome(page, name)


def library(page):
    page.get_by_role('button', name=re.compile('^Chronicle')).click()
    heading = page.get_by_role('heading', name='Your Worlds')
    expect(heading).to_be_visible()
    expect(heading).to_be_focused()


def creator(page, name):
    expect(button(page, 'Create New World')).to_be_enabled()
    button(page, 'Create New World').focus()
    page.keyboard.press('Enter')
    expect(page.get_by_role('heading', name='World Creator')).to_be_focused()
    expect(button(page, 'Create World')).to_be_disabled()
    page.get_by_label('World name').fill(name)
    page.get_by_role('checkbox', name=re.compile('Confirm these settings')).check()
    return button(page, 'Create World')


def snapshot(page):
    return page.evaluate(SNAPSHOT, DATABASE)


def split_graph(graph):
    return {key: value for key, value in graph.items() if key not in PAIR}


def ready(page, name, success=False):
    expect(page.get_by_role('heading', name=name, exact=True)).to_be_visible(timeout=30000)
    expect(button(page, 'Create New World')).to_be_disabled()
    expect(page.get_by_role('button', name=re.compile('^(Open|Play)$'))).to_have_count(0)
    expect(page.get_by_text('World created.', exact=True)).to_have_count(int(success))
    return page.get_by_text(re.compile(r'^world\.instance\.[a-f\d-]+$')).inner_text()


def width_check(page):
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')


def open_settings(page, profile):
    button(page, 'Open existing launcher').click()
    expect(page.get_by_role('region', name='Characters')).to_be_visible()
    button(page, profile).click()
    page.get_by_role('menuitem', name='Settings', exact=True).click()


def viewport_flow(browser, origin, width, theme):
    context = browser.new_context(viewport={'width': width, 'height': 800}, color_scheme=theme)
    try:
        page = context.new_page()
        page.goto(origin + FLAGS)
        expect(button(page, 'New UI Preview')).to_have_attribute('aria-pressed', 'true')
        button(page, 'Classic UI').click()
        expect(button(page, 'Classic UI')).to_have_attribute('aria-pressed', 'true')
        width_check(page)
        button(page, 'New UI Preview').click()
        expect(button(page, 'New UI Preview')).to_have_attribute('aria-pressed', 'true')
        profile = f'Browser {width}'
        register(page, profile, remember=True)
        expect(page.locator('html')).to_have_attribute('data-theme', theme)
        library(page)
        expect(page.get_by_role('heading', name='No Worlds yet')).to_be_visible()
        width_check(page)
        page.get_by_role('button', name='Back to Welcome').click()
        welcome(page, profile)
        library(page)
        if width == 375:
            page.reload()
            welcome(page, profile)
            library(page)
            expect(button(page, 'Create New World')).to_be_disabled()
            button(page, 'Sign in again to create a World').click()
            sign_in(page, profile, remember=True)
            library(page)
        before = snapshot(page)
        title = f'Chronicle {width}'
        submit = creator(page, '  ' + title + '  ')
        width_check(page)
        submit.press('Enter')
        world_id = ready(page, title, success=True)
        after = snapshot(page)
        assert split_graph(before) == split_graph(after)
        world, receipt = [after[key][0] for key in PAIR]
        assert len(after[PAIR[0]]) == len(after[PAIR[1]]) == 1
        assert world['worldInstanceId'] == receipt['worldInstanceId'] == world_id
        assert world['creationIntentId'] == receipt['creationIntentId']
        assert world['displayName'] == receipt['initialDisplayName'] == title
        assert world['projectionFingerprint'] == receipt['projectionFingerprint']
        assert world['binding']['sourceFingerprint'] == (
            'sha256:90d19ed5fa6f9c06bc093d6f775b65a5b69ad12b66a40362bd42a3bf948cfe33')
        page.close()
        page = context.new_page()
        page.goto(origin + FLAGS)
        welcome(page, profile)
        library(page)
        assert ready(page, title) == world_id
        assert snapshot(page) == after
        button(page, 'Home').click()
        button(page, 'Sign Out').click()
        sign_in(page, profile)
        library(page)
        assert ready(page, title) == world_id
        assert snapshot(page)[PAIR[0]] == after[PAIR[0]]
        button(page, 'Home').click()
        button(page, 'Open existing launcher').click()
        expect(page.get_by_role('region', name='Characters')).to_be_visible()
        digest = hashlib.sha256(json.dumps([world, receipt], sort_keys=True).encode()).hexdigest()
        print(f'PASS {width}px {theme}, UI Create/reopen, one-World quota, stable owner graph {digest}', flush=True)
    finally:
        context.close()


def fault_flow(browser, origin):
    context = browser.new_context()
    try:
        page = context.new_page()
        page.goto(origin + FLAGS)
        register(page, 'Fault review')
        library(page)
        before = snapshot(page)
        context.route(SOURCE, lambda route: route.abort())
        creator(page, 'Retried World').click()
        expect(page.get_by_role('alert')).to_contain_text('No World was verified.', timeout=30000)
        assert snapshot(page) == before
        button(page, 'Home').click()
        library(page)
        button(page, 'Create New World').click()
        expect(page.get_by_label('World name')).to_have_value('Retried World')
        expect(page.get_by_label('World name')).to_have_attribute('readonly', '')
        context.unroute(SOURCE)
        page.get_by_role('checkbox', name=re.compile('Confirm these settings')).check()
        button(page, 'Create World').click()
        ready(page, 'Retried World', success=True)
        after = snapshot(page)
        assert split_graph(before) == split_graph(after)
        context.route(SOURCE, lambda route: route.fulfill(status=200, body='{}'))
        button(page, 'Home').click()
        library(page)
        expect(page.get_by_role('heading', name='World inventory blocked')).to_be_visible(timeout=30000)
        expect(page.get_by_role('heading', name='No Worlds yet')).to_have_count(0)
        assert snapshot(page) == after
        context.unroute(SOURCE)
        page.evaluate("""async name => {
          const db = await new Promise((resolve, reject) => {
            const open = indexedDB.open(name);
            open.onsuccess = () => resolve(open.result);
            open.onerror = () => reject(open.error);
          });
          try {
            await new Promise((resolve, reject) => {
              const tx = db.transaction('worldCreationReceiptsV8', 'readwrite');
              tx.oncomplete = resolve;
              tx.onabort = () => reject(tx.error);
              tx.objectStore('worldCreationReceiptsV8').clear();
            });
          } finally { db.close(); }
        }""", DATABASE)
        button(page, 'Home').click()
        library(page)
        expect(page.get_by_role('heading', name='World inventory blocked')).to_be_visible()
        expect(page.get_by_role('heading', name='No Worlds yet')).to_have_count(0)
        assert snapshot(page)[PAIR[0]] == after[PAIR[0]]
        print('PASS unavailable and tampered source, retained intent through Home, and missing receipt', flush=True)
    finally:
        context.close()


def stale_flow(browser, origin):
    context = browser.new_context()
    try:
        page = context.new_page()
        page.goto(origin + FLAGS)
        register(page, 'Stale review', remember=True)
        library(page)
        creator(page, 'Stale request')
        peer = context.new_page()
        peer.goto(origin + FLAGS)
        welcome(peer, 'Stale review')
        button(peer, 'Sign Out').click()
        expect(peer.get_by_label('Account', exact=True)).to_be_visible()
        expect(page.get_by_role('heading', name='World inventory blocked')).to_be_visible()
        expect(button(page, 'Create World')).to_have_count(0)
        expect(page.get_by_text('World created.', exact=True)).to_have_count(0)
        assert all(not snapshot(page)[store] for store in PAIR)
        page.reload()
        sign_in(page, 'Stale review')
        library(page)
        creator(page, 'Invalid generation')
        sign_in(peer, 'Stale review')
        open_settings(peer, 'Stale review')
        button(peer, 'Reset Account').click()
        peer.get_by_placeholder('Account password', exact=True).fill(PASSWORD)
        button(peer, 'Reset Account').last.click()
        expect(peer.get_by_role('region', name='Characters')).to_be_visible()
        button(page, 'Create World').click()
        expect(page.get_by_role('heading', name='World inventory blocked')).to_be_visible()
        assert all(not snapshot(page)[store] for store in PAIR)
        print('PASS remembered-session logout and account generation reset invalidate the old Creator', flush=True)
    finally:
        context.close()


def retry_flow(browser, origin):
    context = browser.new_context()
    try:
        page = context.new_page()
        page.goto(origin + FLAGS)
        register(page, 'Retry review')
        library(page)
        before = snapshot(page)
        submit = creator(page, 'One committed World')
        # Inject a write failure or a lost acknowledgement at the real IndexedDB boundary.
        page.evaluate("""() => {
          const transaction = IDBDatabase.prototype.transaction;
          const add = IDBObjectStore.prototype.add;
          window.worldTestFault = 'abort';
          window.worldTestWrites = [];
          IDBDatabase.prototype.transaction = function(stores, mode, options) {
            if (window.worldTestFault === 'readback' && mode === 'readonly' && stores.length === 4 &&
                stores.includes('worldCreationReceiptsV8'))
              throw new DOMException('Simulated missing readback', 'InvalidStateError');
            return transaction.call(this, stores, mode, options);
          };
          IDBObjectStore.prototype.add = function(row, key) {
            if (this.name !== 'worldCreationReceiptsV8') return add.call(this, row, key);
            window.worldTestWrites.push([row.creationIntentId, row.worldInstanceId, row.expectedAccountRevision]);
            if (window.worldTestFault === 'abort') this.transaction.abort();
            if (window.worldTestFault === 'quota')
              throw new DOMException('Simulated storage quota', 'QuotaExceededError');
            if (window.worldTestFault === 'lose-response')
              this.transaction.addEventListener('complete', () => { window.worldTestFault = 'readback'; });
            return add.call(this, row, key);
          };
        }""")
        submit.click()
        expect(page.get_by_role('alert')).to_contain_text('No World was verified.', timeout=30000)
        assert snapshot(page) == before
        page.evaluate("window.worldTestFault = 'quota'")
        button(page, 'Retry Create World').click()
        expect(page.get_by_role('alert')).to_contain_text('No World was verified.', timeout=30000)
        assert snapshot(page) == before
        page.evaluate("window.worldTestFault = 'lose-response'")
        page.evaluate("""() => {
          const form = document.querySelector('form[aria-label="Create World"]');
          form.requestSubmit();
          form.requestSubmit();
        }""")
        expect(page.get_by_role('alert')).to_contain_text('World creation could not be verified.', timeout=30000)
        expect(page.get_by_text('World created.', exact=True)).to_have_count(0)
        after = snapshot(page)
        assert split_graph(before) == split_graph(after)
        world, receipt = [after[key][0] for key in PAIR]
        assert len(after[PAIR[0]]) == len(after[PAIR[1]]) == 1
        assert page.evaluate('window.worldTestWrites') == [[
            receipt['creationIntentId'], receipt['worldInstanceId'], receipt['expectedAccountRevision']
        ]] * 3
        fresh_page = context.new_page()
        fresh_page.goto(origin + FLAGS)
        sign_in(fresh_page, 'Retry review')
        library(fresh_page)
        assert ready(fresh_page, 'One committed World') == world['worldInstanceId']
        assert snapshot(fresh_page)[PAIR[1]] == after[PAIR[1]]
        fresh_page.close()
        page.evaluate('window.worldTestFault = null')
        button(page, 'Retry Create World').click()
        assert ready(page, 'One committed World', success=True) == world['worldInstanceId']
        assert snapshot(page) == after
        page.reload()
        sign_in(page, 'Retry review')
        library(page)
        assert ready(page, 'One committed World') == world['worldInstanceId']
        assert snapshot(page)[PAIR[1]] == after[PAIR[1]]
        print('PASS IndexedDB abort/quota, lost acknowledgement, stable intent and double submit', flush=True)
    finally:
        context.close()


def competing_flow(browser, origin):
    context = browser.new_context()
    try:
        left = context.new_page()
        left.goto(origin + FLAGS)
        register(left, 'Concurrent review')
        right = context.new_page()
        right.goto(origin + FLAGS)
        sign_in(right, 'Concurrent review')
        for page in [left, right]:
            library(page)
            creator(page, 'Left World' if page == left else 'Right World')
        for page in [left, right]:
            page.evaluate('document.querySelector(\'form[aria-label="Create World"]\').requestSubmit()')
        for page in [left, right]:
            page.locator('form[aria-label="Create World"] [role="alert"], [data-world-presentation] [role="status"]'
                         ).filter(has_text=re.compile('World created|could not be verified')).wait_for(timeout=30000)
        results = [page.get_by_text('World created.', exact=True).count() for page in [left, right]]
        assert sorted(results) == [0, 1]
        graph = snapshot(left)
        assert len(graph[PAIR[0]]) == len(graph[PAIR[1]]) == 1
        loser = left if results[0] == 0 else right
        loser.get_by_role('button', name='Back to World Library').click()
        world = graph[PAIR[0]][0]
        assert ready(loser, world['displayName']) == world['worldInstanceId']
        button(loser, 'Home').click()
        button(loser, 'Sign Out').click()
        button(loser, 'Create Account').click()
        register(loser, 'Separate review')
        library(loser)
        expect(loser.get_by_role('heading', name='No Worlds yet')).to_be_visible()
        assert snapshot(loser)[PAIR[0]] == graph[PAIR[0]]
        print('PASS competing tabs, one retained World, and separate account scope', flush=True)
    finally:
        context.close()


def backup_flow(browser, origin):
    original = browser.new_context(accept_downloads=True)
    restored = browser.new_context()
    try:
        profile = 'Backup review'
        title = 'Portable World'
        page = original.new_page()
        page.goto(origin + FLAGS)
        register(page, profile)
        library(page)
        creator(page, title).click()
        world_id = ready(page, title, success=True)
        button(page, 'Home').click()
        open_settings(page, profile)
        page.get_by_label('Password to export epoch backup').fill(PASSWORD)
        with page.expect_download() as saved:
            button(page, 'Download epoch backup').click()
        same = restored.new_page()
        same.goto(origin + FLAGS)
        expect(same.get_by_label('Display Name', exact=True)).to_be_visible()
        same.locator('summary').filter(has_text='Restore epoch backup').click()
        same.get_by_label('Choose epoch backup file').set_input_files(saved.value.path())
        sign_in(same, profile)
        library(same)
        assert ready(same, title) == world_id
        assert snapshot(same) == snapshot(page)
        print('PASS v8 backup export and restore across isolated browser contexts', flush=True)
    finally:
        restored.close()
        original.close()


def run(review, ordinary):
    for url, variable in [(review, 'LINEAGE_TASK_OWNED_ORIGIN'), (ordinary, 'LINEAGE_TASK_OWNED_DEFAULT_ORIGIN')]:
        parsed = urlsplit(url)
        assert url == os.environ[variable] and parsed.hostname == '127.0.0.1' and parsed.port and not parsed.path
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=os.environ['CHROMIUM_EXECUTABLE'])
        try:
            for width, theme in [(1440, 'dark'), (1280, 'light'), (768, 'dark'), (375, 'light'), (320, 'dark')]:
                viewport_flow(browser, review, width, theme)
            fault_flow(browser, review)
            stale_flow(browser, review)
            retry_flow(browser, review)
            competing_flow(browser, review)
            backup_flow(browser, review)
            context = browser.new_context()
            try:
                page = context.new_page()
                for url in [ordinary + FLAGS, review, review + FLAGS + '&worldPresentation=1']:
                    page.goto(url)
                    expect(page.get_by_label('Display Name', exact=True)).to_be_visible()
                    expect(page.locator('[data-world-presentation]')).to_have_count(0)
                    assert not any(snapshot(page)[store] for store in PAIR)
                    if url.startswith(ordinary):
                        assert page.evaluate('typeof window.worldOwnerReview === "undefined"')
                print('PASS ordinary build and missing/duplicate compiled opt-ins remain Classic', flush=True)
            finally:
                context.close()
        finally:
            browser.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--review-origin', required=True)
    parser.add_argument('--ordinary-origin', required=True)
    args = parser.parse_args()
    run(args.review_origin, args.ordinary_origin)
