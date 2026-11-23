"""Supplemental compiled browser checks for original-owner migration and deliberate origin transfer."""
import argparse
import json
import os
import re
import runpy
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright

qa = runpy.run_path(str(Path(__file__).with_name('first-world-a3b-ui-browser-qa.py')))
button, snapshot, flags, password = (qa[key] for key in ('button', 'snapshot', 'FLAGS', 'PASSWORD'))


def origin(name):
    value = os.environ[f'LINEAGE_MAINLINE_{name}']
    url = urlsplit(value)
    assert url.scheme == 'http' and url.hostname == '127.0.0.1' and url.port and not url.path
    assert not (url.query or url.fragment or url.username or url.password)
    return value


def open_slot(page):
    roster = page.get_by_role('region', name='Characters')
    roster.get_by_role('button', name=re.compile(r'^1\s*Empty')).click()
    stages = page.get_by_role('navigation', name='Character creation steps')
    finalize = stages.get_by_role('button', name=re.compile('Finalize$'))
    for _ in range(24):
        if finalize.is_enabled():
            break
        button(page, 'Randomize Character').click()
    finalize.click()
    button(page, 'Begin Journey').click()
    expect(button(page, 'Inventory')).to_be_visible(timeout=30000)
    graph = snapshot(page)
    assert graph['artifacts'] and graph['controls'] and graph['slots']
    return graph


def classic_account(page, profile):
    return page.get_by_role('button', name=re.compile(r'^' + re.escape(profile) + r'(?:\s|$)'))


def classic_login(page, profile, credential=password):
    classic_account(page, profile).press('Enter')
    page.get_by_label('Password', exact=True).fill(credential)
    button(page, 'Log In').press('Enter')
    expect(page.get_by_role('region', name='Characters')).to_be_visible()


def export_backup(page, path):
    page.get_by_label('Password to export epoch backup').fill(password)
    with page.expect_download() as download:
        button(page, 'Download epoch backup').click()
    download.value.save_as(path)
    return json.loads(path.read_bytes())


def restore_input(page):
    field = page.get_by_label('Choose epoch backup file')
    if not field.is_visible():
        page.locator('summary').filter(has_text='Restore epoch backup').click()
    expect(field).to_be_visible()
    return field


def assert_version(page, version):
    databases = page.evaluate('indexedDB.databases()')
    assert any(db['name'] == qa['DATABASE'] and db['version'] == version for db in databases), databases


def continue_campaign(page):
    page.get_by_role('button', name=re.compile(r'^Continue .+ Legacy$')).press('Enter')
    expect(button(page, 'Inventory')).to_be_visible(timeout=30000)


def migration(browser):
    source, empty = origin('MIGRATION'), origin('ORDINARY')
    assert source != empty
    marker = Path(os.environ['LINEAGE_MAINLINE_QA']) / 'v8-switch'
    assert not marker.exists()
    profile = 'Mainline disposable classic'
    with browser.new_context(accept_downloads=True) as context, TemporaryDirectory(prefix='lineage-v7-transfer-') as folder:
        page = context.new_page()
        page.goto(source)
        page.get_by_label('Display Name', exact=True).fill(profile)
        page.get_by_label('Password', exact=True).fill(password)
        page.get_by_label('Confirm Password', exact=True).fill(password)
        button(page, 'Create Account').click()
        open_slot(page)
        page.reload()
        classic_login(page, profile)
        assert_version(page, 7)
        original = snapshot(page)
        assert len(original) == 14
        button(page, profile).press('Enter')
        page.get_by_role('menuitem', name='Settings', exact=True).press('Enter')
        archive = Path(folder) / 'original-v7.json'
        archive_data = export_backup(page, archive)
        assert len(archive_data['families']) == 14
        page.close()

        page = context.new_page()
        marker.touch(exist_ok=False)
        page.goto(source + '?integrationPhase=v8')
        expect(classic_account(page, profile)).to_be_visible()
        assert_version(page, 8)
        migrated = snapshot(page)
        assert qa['split_graph'](migrated) == original and all(not migrated[key] for key in qa['PAIR'])
        classic_login(page, profile)
        continue_campaign(page)

        target = context.new_page()
        target.goto(empty)
        expect(target.get_by_label('Display Name', exact=True)).to_be_visible()
        assert not any(snapshot(target).values())
        restore_input(target).set_input_files(archive)
        expect(classic_account(target, profile)).to_be_visible(timeout=30000)
        assert_version(target, 8)
        restored = snapshot(target)
        assert qa['split_graph'](restored) == original and all(not restored[key] for key in qa['PAIR'])
        classic_login(target, profile)
        continue_campaign(target)
        print('PASS exact master v7 real Classic Save, all 14 families preserved on same-origin v8 upgrade and cross-origin v7 archive restore; v8 Classic Continue works in both', flush=True)


def transfer(browser):
    source, destination = origin('REVIEW'), origin('RESTORE')
    assert source != destination
    profile = 'Mainline disposable transfer'
    title = 'Mainline transfer World'
    with browser.new_context(accept_downloads=True) as context, TemporaryDirectory(prefix='lineage-v8-transfer-') as folder:
        original = context.new_page()
        original.goto(source + flags)
        qa['register'](original, profile)
        button(original, 'Open existing launcher').press('Enter')
        open_slot(original)
        original.goto(source + flags)
        qa['sign_in'](original, profile)
        qa['library'](original)
        qa['creator'](original, title).click()
        world_id = qa['ready'](original, title, success=True)
        button(original, 'Home').press('Enter')
        qa['open_settings'](original, profile)
        archive = Path(folder) / 'world-v8.json'
        archive_data = export_backup(original, archive)
        assert len(archive_data['families']) == 16
        complete = snapshot(original)
        assert complete['artifacts'] and all(len(complete[key]) == 1 for key in qa['PAIR'])

        restored = context.new_page()
        restored.goto(destination + flags)
        expect(restored.get_by_label('Display Name', exact=True)).to_be_visible()
        assert not any(snapshot(restored).values())
        restore_input(restored).set_input_files({
            'name': 'invalid.json', 'mimeType': 'application/json', 'buffer': b'{"invalid":true}'})
        expect(restored.get_by_role('alert')).to_contain_text('Restore failed')
        assert not any(snapshot(restored).values())
        restore_input(restored).set_input_files(archive)
        expect(restored.get_by_label('Account', exact=True)).to_be_visible()
        assert snapshot(restored) == complete
        restore_input(restored).set_input_files(archive)
        expect(restored.get_by_role('alert')).to_contain_text('Restore failed')
        assert snapshot(restored) == complete
        qa['sign_in'](restored, profile)
        qa['library'](restored)
        assert qa['ready'](restored, title) == world_id
        qa['open_selected_creator'](restored, world_id, title)
        button(restored, 'Cancel').press('Enter')
        assert snapshot(restored) == snapshot(original) == complete

        restored.goto(destination)
        expect(button(restored, 'Classic UI')).to_have_attribute('aria-pressed', 'true')
        classic_login(restored, profile)
        assert_version(restored, 8)
        assert snapshot(restored) == complete
        continue_campaign(restored)
        print('PASS password-authorized v8 export transferred World, exact receipt and Classic Save across ports in one profile; corrupt and occupied imports refused; Classic reopened the Save', flush=True)


def dev_default(browser):
    base = origin('DEV')
    with browser.new_context() as context:
        page = context.new_page()
        page.goto(base)
        expect(button(page, 'New UI Preview')).to_have_attribute('aria-pressed', 'true')
        button(page, 'Classic UI').press('Enter')
        expect(button(page, 'Classic UI')).to_have_attribute('aria-pressed', 'true')
        assert urlsplit(page.url).query == 'classicUi=1'
        page.reload()
        expect(button(page, 'Classic UI')).to_have_attribute('aria-pressed', 'true')
        button(page, 'New UI Preview').press('Enter')
        expect(button(page, 'New UI Preview')).to_have_attribute('aria-pressed', 'true')
        qa['register'](page, 'Mainline disposable DEV')
        qa['library'](page)
        expect(page.get_by_role('heading', name='World inventory unavailable')).to_be_visible()
        assert not any(snapshot(page)[name] for name in qa['PAIR'])
        print('PASS named loopback Vite DEV defaults to New UI, Classic survives reload, real World owner stays gated', flush=True)


def native_fallback(browser):
    review, ordinary = origin('REVIEW'), origin('ORDINARY')
    assert review != ordinary
    owner_qa = runpy.run_path(str(Path(__file__).with_name('first-world-a2b-browser-qa.py')))
    account = 'account.world.review.native-fallback'
    with browser.new_context() as context:
        source = owner_qa['open_page'](context, review, 'a2b-review-mainline-native-fallback')
        call = owner_qa['call']
        call(source, 'authenticate', account, True)
        revision = call(source, 'seedNativeHistory')
        world = call(source, 'create', owner_qa['request'](revision, 'fallback'))
        archive = call(source, 'exportArchive')
        call(source, 'close')
        page = context.new_page()
        page.goto(ordinary)
        expect(page.get_by_label('Display Name', exact=True)).to_be_visible()
        assert not any(snapshot(page).values())
        restore_input(page).set_input_files({
            'name': 'native-v8.json', 'mimeType': 'application/json', 'buffer': archive.encode()})
        expect(classic_account(page, account)).to_be_visible(timeout=30000)
        assert_version(page, 8)
        restored = snapshot(page)
        assert restored['worldsV8'] == [world['world']]
        assert restored['worldCreationReceiptsV8'] == [world['receipt']]
        assert restored['artifacts'] and restored['terminalLifecycleRecoveries']
        classic_login(page, account, 'disposable-world-owner-review')
        continue_campaign(page)
        assert snapshot(page) == restored
        print('PASS ordinary v8 Classic opened a restored native-v3 ready Save with retired history and World/receipt intact', flush=True)


if __name__ == '__main__':
    cases = {fn.__name__: fn for fn in (migration, transfer, dev_default, native_fallback)}
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('case', choices=cases)
    args = parser.parse_args()
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=os.environ['CHROMIUM_EXECUTABLE'])
        try:
            cases[args.case](browser)
        finally:
            browser.close()
