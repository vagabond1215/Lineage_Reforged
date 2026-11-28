"""World Creator acceptance through the real compiled splash and launcher."""
import argparse
import hashlib
import json
import os
import re
from pathlib import Path
from tempfile import TemporaryDirectory
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
VIEWPORTS = [(width, 800) for width in (1440, 1280, 768, 375, 320)] + [(320, 568), (375, 667), (667, 375)]


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


def open_selected_creator(page, world_id, title, keyboard=False):
    for action in ['Open World', 'Create Character']:
        control = button(page, action)
        if keyboard:
            control.press('Enter')
        else:
            control.click()
        if action == 'Open World':
            expect(page.get_by_role('heading', name='World Characters')).to_be_focused(timeout=30000)
            expect(page.get_by_role('heading', name='No characters in this World')).to_be_visible()
    expect(page.get_by_role('main').get_by_role('heading', name='Lineage', exact=True)).to_be_focused()
    options = button(page, 'Creator options')
    options.press('Enter')
    expect(options).to_have_attribute('aria-expanded', 'true')
    expect(page.get_by_role('group', name='Creator options').get_by_text(title, exact=True)).to_be_visible()
    identifier = page.get_by_role('textbox', name='World instance ID')
    expect(identifier).to_have_value(world_id)
    identifier.focus()
    assert identifier.evaluate('el => el.value.slice(el.selectionStart, el.selectionEnd)') == world_id
    identifier.press('Escape')
    expect(options).to_be_focused()
    expect(options).to_have_attribute('aria-expanded', 'false')
    expect(page.get_by_role('navigation', name='Creator stages')).to_be_visible()


CREATOR_STAGES = ['Lineage', 'Identity', 'Continent', 'Region', 'Settlement', 'World Entry', 'Summary', 'Opening']
CREATOR_VIEWPORTS = [(1440, 800), (1280, 800), (768, 800), (375, 667), (320, 568), (667, 375)]


def edit_character_draft(page, world_id, keyboard=False, evidence=None):
    steps = page.get_by_role('navigation', name='Creator stages')
    main = page.get_by_role('main', name=re.compile('|'.join(CREATOR_STAGES)))
    assert steps.locator('.swc-stage-link').all_text_contents() == [
        f'{index}{label}' for index, label in enumerate(CREATOR_STAGES, start=1)]
    expect(steps.get_by_role('button', name=re.compile('Backstory|Starting Bundle|Finalize'))).to_have_count(0)
    expect(steps.get_by_role('button', name='Summary')).to_be_disabled()

    has_touch = page.evaluate('navigator.maxTouchPoints > 0')
    controls = page.get_by_role('navigation', name='Creator controls')
    forward = controls.get_by_role('button', name='Next', exact=True)
    metrics = {}

    def activate(control):
        if keyboard:
            control.press('Enter')
        elif has_touch:
            control.tap()
        else:
            control.click()

    def check_stage(label):
        heading = main.get_by_role('heading', name=label, exact=True)
        expect(heading).to_be_focused()
        expect(steps.get_by_role('button', name=label, exact=True)).to_have_attribute('aria-current', 'step')
        assert main.evaluate('el => el.scrollTop') == 0
        width_check(page)

    def check_art(label):
        image = main.locator('.swc-card').filter(has=page.get_by_role('button', name=label, exact=True)).locator('img')
        image.scroll_into_view_if_needed()
        assert image.evaluate('''async image => {
            await image.decode();
            const art = image.parentElement.getBoundingClientRect();
            const photo = image.getBoundingClientRect();
            return photo.width >= art.width - 1 && photo.height >= art.height - 1;
        }'''), label

    def capture(label):
        if evidence is not None:
            page.evaluate('''async () => {
                document.querySelector('.swc-main').scrollTop = 0;
                document.querySelector('.swc-rail').scrollTop = 0;
                const pane = document.querySelector('.swc-main').getBoundingClientRect();
                const visible = [...document.querySelectorAll('.swc-card-art img')].filter(img => {
                    const bounds = img.getBoundingClientRect();
                    return bounds.bottom > pane.top && bounds.top < pane.bottom;
                });
                await Promise.allSettled(visible.map(img => img.decode()));
            }''')
            page.screenshot(path=evidence / f'{CREATOR_STAGES.index(label) + 1:02}-{label.lower().replace(" ", "-")}.png',
                            full_page=True, animations='disabled')

    def check_scroll(label, last_control):
        size = main.evaluate('el => ({visible: el.clientHeight, total: el.scrollHeight, width: el.clientWidth, contentWidth: el.scrollWidth})')
        assert size['contentWidth'] <= size['width'] + 1, (label, size)
        if size['total'] > size['visible'] + 1:
            main.press('End')
            page.wait_for_function("el => el.scrollTop >= el.scrollHeight - el.clientHeight - 2", arg=main.element_handle())
        last_control.scroll_into_view_if_needed()
        expect(last_control).to_be_in_viewport()
        size['reached'] = main.evaluate('el => el.scrollTop')
        metrics[label] = size
        main.press('Home')
        page.wait_for_function("el => el.scrollTop === 0", arg=main.element_handle())

    def card_choice(label):
        return main.get_by_role('button', name=label, exact=True)

    def select_fixed_tile(label):
        card = main.locator('.swc-card').filter(has=page.get_by_role('button', name=label, exact=True))
        # A lineage change can move the whole grid when the mobile header reflows.
        grid_geometry = '''cards => cards.map(card => [
            card.getBoundingClientRect().top - cards[0].getBoundingClientRect().top,
            card.getBoundingClientRect().height
        ])'''
        before = main.locator('.swc-card').evaluate_all(grid_geometry)
        activate(card_choice(label))
        overlay = main.get_by_role('region', name=f'{label} description')
        expect(overlay).to_be_visible()
        if overlay.evaluate('el => el.scrollHeight > el.clientHeight + 1'):
            overlay.press('End')
            page.wait_for_function("el => el.scrollTop > 0", arg=overlay.element_handle())
        after = main.locator('.swc-card').evaluate_all(grid_geometry)
        assert len(after) == len(before) and all(
            abs(old - new) < 0.5 for a, b in zip(before, after) for old, new in zip(a, b)
        ), (label, before, after)
        assert card.evaluate("el => { const overlay = el.querySelector('.swc-card-description'); const picture = el.querySelector('.swc-card-art'); return picture.contains(overlay) && overlay.getBoundingClientRect().bottom <= picture.getBoundingClientRect().bottom + 1; }")
        return card

    def inline_next(label):
        activate(main.get_by_role('button', name=f'Next from {label}', exact=True))

    stage_menu = button(page, 'Creator options')
    controls.evaluate("""el => {
        const [left, center, right] = el.children;
        if (!(left.offsetLeft < center.offsetLeft && center.offsetLeft < right.offsetLeft)) throw Error('Unexpected sub-bar order');
    }""")
    assert page.locator('.swc-header').evaluate("""el => {
        const header = el.getBoundingClientRect();
        const actions = el.querySelector('.swc-header-actions').getBoundingClientRect();
        return Math.abs((header.left + header.right - actions.left - actions.right) / 2) <= 1;
    }""")
    expect(page.get_by_role('navigation', name='Creator context')).to_have_count(0)
    expect(button(page, 'Back to World Characters')).to_have_count(0)
    assert stage_menu.evaluate("el => getComputedStyle(el).backgroundColor === 'rgba(0, 0, 0, 0)' && getComputedStyle(el).borderTopWidth === '0px'")
    activate(stage_menu)
    theme = page.locator('html').get_attribute('data-theme')
    opposite = 'light' if theme == 'dark' else 'dark'
    activate(button(page, f'Switch to {opposite} mode'))
    expect(page.locator('html')).to_have_attribute('data-theme', opposite)
    activate(button(page, f'Switch to {theme} mode'))
    expect(page.locator('html')).to_have_attribute('data-theme', theme)
    if has_touch:
        page.locator('.swc-header-profile').tap()
    else:
        page.locator('.swc-header-profile').click()
    expect(stage_menu).to_have_attribute('aria-expanded', 'false')
    expect(steps.locator('.swc-stage-dice')).to_have_count(6)
    expect(button(page, 'Randomize Summary')).to_have_count(0)
    expect(button(page, 'Randomize Opening')).to_have_count(0)
    for label in ('HP', 'MP', 'Stamina'):
        bar = page.get_by_role('progressbar', name=f'Starting {label}')
        expect(bar).to_be_visible()
        assert bar.evaluate("el => el.value === el.max && el.max === Number(el.closest('[data-resource]').querySelector('dd').textContent) && el.max > 0")
    assert page.locator('.swc-rail .swc-attributes abbr').count() == 9
    if page.locator('.swc-rail').evaluate('el => el.scrollHeight > el.clientHeight + 1'):
        page.locator('.swc-rail').press('End')
        page.wait_for_function("el => el.scrollTop > 0", arg=page.locator('.swc-rail').element_handle())
        assert main.evaluate('el => el.scrollTop') == 0
        page.locator('.swc-rail').press('Home')
        page.wait_for_function("el => el.scrollTop === 0", arg=page.locator('.swc-rail').element_handle())

    expect(steps.get_by_role('button', name='Lineage', exact=True)).to_have_attribute('aria-current', 'step')
    width_check(page)
    expect(main.get_by_role('group', name='Playable lineages').locator('.swc-card-target')).to_have_count(10)
    activate(button(page, 'Randomize Lineage'))
    expect(steps.get_by_role('button', name='Lineage', exact=True)).to_have_attribute('aria-current', 'step')
    expect(card_choice('Human')).to_have_attribute('aria-pressed', 'false')
    if card_choice('Elf').get_attribute('aria-pressed') == 'true':
        activate(card_choice('Human'))
    select_fixed_tile('Elf')
    assert page.locator('.swc-rail').evaluate('''el => {
        const stats = Object.fromEntries([...el.querySelectorAll('abbr')].map(label =>
            [label.textContent, Number(label.closest('dt').nextElementSibling.textContent)]));
        const limits = Object.fromEntries([...el.querySelectorAll('progress')].map(bar =>
            [bar.closest('[data-resource]').dataset.resource, bar.max]));
        return limits.HP === 112 + 4 * (stats.CON + stats.VIT - 20)
            && limits.MP === 70 + 4 * (stats.INT + stats.SPT - 20)
            && limits.Stamina === 96 + 3 * (stats.AGI + stats.CON + stats.VIT - 30);
    }''')
    expect(main.get_by_text('Playable ancestry')).to_have_count(0)
    check_scroll('Lineage', card_choice('Half Merfolk'))
    capture('Lineage')
    if has_touch or keyboard:
        inline_next('Elf')
    else:
        card_choice('Elf').dblclick(position={'x': 12, 'y': 12})
    check_stage('Identity')
    first = page.get_by_role('textbox', name='First name', exact=True)
    last = page.get_by_role('textbox', name='Last name', exact=True)
    activate(forward)
    expect(first).to_be_focused()
    expect(page.get_by_role('alert')).to_have_text('Enter a first and last name before continuing.')
    expect(first).to_have_attribute('aria-invalid', 'true')
    expect(last).to_have_attribute('aria-invalid', 'true')
    first.fill('Aerin')
    last.fill('   ')
    activate(forward)
    expect(last).to_be_focused()
    expect(first).to_have_attribute('aria-invalid', 'false')
    expect(page.get_by_role('alert')).to_have_text('Enter a last name before continuing.')
    expect(steps.get_by_role('button', name='Continent', exact=True)).to_be_disabled()
    detail = controls.get_by_role('button', name='Detail Hide')
    activate(detail)
    expect(main.locator('.swc-option-delta').first).to_be_hidden()
    expect(main.get_by_text('Attribute guide', exact=True)).to_be_hidden()
    expect(first).to_have_attribute('required', '')
    activate(controls.get_by_role('button', name='Detail Show'))
    expect(main.locator('.swc-option-delta').first).to_be_visible()
    expect(main.get_by_text('Attribute guide', exact=True)).to_be_visible()
    for label in ('Build', 'Aptitude'):
        expect(main.get_by_role('group', name=label, exact=True).get_by_role('button')).to_have_count(9)
    activate(button(page, 'Female'))
    activate(main.get_by_role('group', name='Build', exact=True).get_by_role('button', name=re.compile('^Lithe')))
    activate(button(page, 'Randomize first and last name only'))
    expect(button(page, 'Female')).to_have_attribute('aria-pressed', 'true')
    expect(first).not_to_have_value('')
    expect(last).not_to_have_value('')
    first.fill('Aerin')
    last.fill('Vale')
    activate(button(page, 'Randomize Identity'))
    expect(first).to_have_value('Aerin')
    expect(last).to_have_value('Vale')
    expect(steps.get_by_role('button', name='Identity', exact=True)).to_have_attribute('aria-current', 'step')
    activate(controls.get_by_role('button', name='Randomize current Identity'))
    expect(last).to_have_value('Vale')
    expect(first).to_have_value('Aerin')
    activate(button(page, 'Female'))
    activate(main.get_by_role('group', name='Build', exact=True).get_by_role('button', name=re.compile('^Lithe')))
    activate(main.get_by_role('group', name='Aptitude', exact=True).get_by_role('button', name=re.compile('^Analytical')))
    for group in ('Negative conditions', 'Positive conditions'):
        expect(main.get_by_role('group', name=group).get_by_role('button')).to_have_count(14)
    activate(button(page, 'Sickly'))
    activate(button(page, 'Quick Healer'))
    for palette in ('Skin', 'Hair', 'Eyes'):
        swatches = main.get_by_role('group', name=f'{palette} color options')
        activate(swatches.get_by_role('button', name=re.compile(f'^{palette} ')).last)
        swatches.get_by_role('slider', name=f'{palette} saturation').press('ArrowLeft')
    activate(button(page, 'Generate portrait prompt'))
    expect(main.get_by_role('textbox', name='Portrait prompt')).to_have_value(re.compile('Aerin Vale.*Elf'))
    check_scroll('Identity', main.get_by_role('textbox', name='Portrait prompt'))
    def reset_main():
        main.press('Home')
        page.wait_for_function("el => el.scrollTop === 0", arg=main.element_handle())

    def wait_for_scroll():
        page.wait_for_function("el => el.scrollTop > 0", arg=main.element_handle())
        return main.evaluate('el => el.scrollTop')

    main.press('PageDown')
    metrics['Identity']['pageDown'] = wait_for_scroll()
    reset_main()
    box = main.bounding_box()
    page.mouse.move(box['x'] + 5, box['y'] + box['height'] / 2)
    page.mouse.wheel(0, 450)
    metrics['Identity']['wheel'] = wait_for_scroll()
    reset_main()
    if has_touch:
        cdp = page.context.new_cdp_session(page)
        x, y = box['x'] + 8, box['y'] + box['height'] * .75
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]})
        for step in range(1, 8):
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y - step * 15}]})
        main.evaluate('''el => {
            el.addEventListener('scrollend', () => { el.dataset.touchSettled = 'true'; }, {once: true});
        }''')
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        metrics['Identity']['touch'] = wait_for_scroll()
        page.wait_for_function("el => el.dataset.touchSettled === 'true'", arg=main.element_handle())
        cdp.detach()
        reset_main()
    else:
        gutter = main.evaluate('el => el.offsetWidth - el.clientWidth')
        if gutter > 4:
            x = box['x'] + box['width'] - gutter / 2
            y = box['y'] + 24
            page.mouse.move(x, y)
            page.mouse.down()
            page.mouse.move(x, y + min(100, box['height'] / 4), steps=8)
            page.mouse.up()
            page.wait_for_function("el => el.scrollTop > 70", arg=main.element_handle())
            metrics['Identity']['scrollbarDrag'] = main.evaluate('el => el.scrollTop')
            reset_main()
    capture('Identity')
    activate(forward)
    check_stage('Continent')
    select_fixed_tile('Valtherion')
    check_art('Valtherion')
    check_scroll('Continent', main.locator('.swc-card-target').last)
    capture('Continent')
    if has_touch or keyboard:
        inline_next('Valtherion')
    else:
        card_choice('Valtherion').dblclick(position={'x': 12, 'y': 12})
    check_stage('Region')
    expect(main.get_by_text('Valtherion', exact=True)).to_be_visible()
    select_fixed_tile('The Sapphire Rivers')
    check_art('The Sapphire Rivers')
    check_scroll('Region', main.locator('.swc-card-target').last)
    capture('Region')
    if has_touch or keyboard:
        inline_next('The Sapphire Rivers')
    else:
        activate(button(page, 'Clear The Sapphire Rivers selection'))
        expect(card_choice('The Sapphire Rivers')).to_have_attribute('aria-pressed', 'false')
        card_choice('The Sapphire Rivers').dblclick(position={'x': 12, 'y': 12})
    check_stage('Settlement')
    expect(main.get_by_text('The Sapphire Rivers', exact=True)).to_be_visible()
    select_fixed_tile('Highcrown')
    check_art('Highcrown')
    check_scroll('Settlement', main.locator('.swc-card-target').last)
    capture('Settlement')
    if has_touch or keyboard:
        inline_next('Highcrown')
    else:
        card_choice('Highcrown').dblclick(position={'x': 12, 'y': 12})
    check_stage('World Entry')
    activate(button(page, 'Hardcore Wilderness · Read only'))
    expect(button(page, 'World-Stray · Prestige locked')).to_be_disabled()
    activate(main.get_by_role('button', name=re.compile('The Broken Wagon')))
    expect(main.get_by_text(re.compile('wagon frame leans'))).to_be_visible()
    activate(forward)
    expect(steps.get_by_role('button', name='Summary')).to_be_disabled()
    activate(button(page, 'Ordinary Core · 4'))
    activate(main.get_by_role('button', name=re.compile('The Room Paid For')))
    capture('World Entry')
    activate(forward)
    check_stage('Summary')
    for expected in ('Aerin Vale', 'Highcrown', 'The Room Paid For', 'Equipment & currency', '100 total'):
        expect(main).to_contain_text(expected)
    check_scroll('Summary', button(page, 'Change World Entry'))
    capture('Summary')
    activate(button(page, 'Read Opening'))
    check_stage('Opening')
    expect(main.get_by_text(re.compile('Morning filters through the shutters'))).to_be_visible()
    expect(button(page, 'Create Character')).to_be_disabled()
    expect(button(page, 'Create Character')).to_have_accessible_description(re.compile('approved World–Character–Save owner'))
    expect(main).to_contain_text('Aerin Vale')
    check_scroll('Opening', button(page, 'Create Character'))
    capture('Opening')
    activate(button(page, 'Examine the parcel'))
    expect(main.get_by_role('status')).to_contain_text('Examine the parcel')
    expect(main.get_by_role('status')).to_be_focused()
    activate(button(page, 'Revisit the first decision'))
    expect(button(page, 'Examine the parcel')).to_be_focused()
    activate(button(page, 'Ask the keeper'))
    expect(main.get_by_role('status')).to_contain_text('Ask the keeper')
    if evidence is not None:
        page.screenshot(path=evidence / '08-opening-draft-decision.png', full_page=True, animations='disabled')
    activate(controls.get_by_role('button', name='Back', exact=True))
    check_stage('Summary')
    activate(button(page, 'Change World Entry'))
    check_stage('World Entry')
    activate(steps.get_by_role('button', name='Continent', exact=True))
    check_stage('Continent')
    activate(button(page, 'Randomize Continent'))
    expect(steps.get_by_role('button', name='Continent', exact=True)).to_have_attribute('aria-current', 'step')
    expect(card_choice('Valtherion')).to_have_attribute('aria-pressed', 'false')
    expect(steps.get_by_role('button', name='Settlement', exact=True)).to_be_disabled()
    expect(steps.get_by_role('button', name='World Entry', exact=True)).to_be_disabled()
    activate(card_choice('Valtherion'))
    activate(forward)
    check_stage('Region')
    expect(main.locator('button[aria-pressed=true]')).to_have_count(0)
    activate(button(page, 'Randomize Region'))
    expect(main.locator('button[aria-pressed=true]')).to_have_count(1)
    expect(steps.get_by_role('button', name='Region', exact=True)).to_have_attribute('aria-current', 'step')
    if card_choice('The Sapphire Rivers').get_attribute('aria-pressed') != 'true':
        activate(card_choice('The Sapphire Rivers'))
    activate(forward)
    check_stage('Settlement')
    expect(main.locator('button[aria-pressed=true]')).to_have_count(0)
    activate(button(page, 'Randomize Settlement'))
    expect(main.locator('button[aria-pressed=true]')).to_have_count(1)
    expect(steps.get_by_role('button', name='Settlement', exact=True)).to_have_attribute('aria-current', 'step')
    activate(forward)
    check_stage('World Entry')
    expect(main.get_by_role('button', name=re.compile('The Room Paid For'))).to_have_attribute('aria-pressed', 'false')
    activate(button(page, 'Hardcore Wilderness · Read only'))
    activate(button(page, 'Randomize World Entry'))
    expect(button(page, 'Ordinary Core · 4')).to_have_attribute('aria-pressed', 'true')
    expect(main.locator('.swc-story[aria-pressed=true]')).to_have_count(1)
    expect(steps.get_by_role('button', name='World Entry', exact=True)).to_have_attribute('aria-current', 'step')
    activate(button(page, 'Randomize All'))
    expect(steps.get_by_role('button', name='World Entry', exact=True)).to_have_attribute('aria-current', 'step')
    activate(forward)
    check_stage('Summary')
    expect(main).not_to_contain_text('Aerin Vale')
    activate(button(page, 'Read Opening'))
    check_stage('Opening')
    expect(main.get_by_text('Draft decision recorded')).to_have_count(0)
    activate(main.get_by_role('region', name='First World Entry decision').get_by_role('button').first)
    activate(button(page, 'Randomize All'))
    check_stage('Summary')
    activate(button(page, 'Read Opening'))
    check_stage('Opening')
    expect(main.get_by_text('Draft decision recorded')).to_have_count(0)
    activate(stage_menu)
    expect(page.get_by_role('textbox', name='World instance ID')).to_have_value(world_id)
    stage_menu.press('Escape')
    if evidence is not None:
        metrics['ancestors'] = main.evaluate('''el => {
            const rows = {};
            for (let node = el; node; node = node.parentElement) {
                const key = node.id || [...node.classList].find(name => name.startsWith('swc')) || node.tagName;
                rows[key] = { overflowY: getComputedStyle(node).overflowY, height: node.clientHeight,
                    contentHeight: node.scrollHeight, width: node.clientWidth, contentWidth: node.scrollWidth };
            }
            return rows;
        }''')
        (evidence / 'scroll.json').write_text(json.dumps(metrics, indent=2), encoding='utf-8')


def persistent_restart_flow(playwright, origin):
    profile = 'Browser Restart Review'
    title = 'Persisted Chronicle'
    executable = os.environ['CHROMIUM_EXECUTABLE']
    with TemporaryDirectory(prefix='lineage-world-browser-') as data_directory:
        first = playwright.chromium.launch_persistent_context(data_directory, executable_path=executable, ignore_default_args=['--hide-scrollbars'])
        try:
            page = first.new_page()
            page.goto(origin + FLAGS)
            register(page, profile)
            button(page, 'Sign Out').click()
            sign_in(page, profile)
            library(page)
            expect(page.get_by_role('heading', name='No Worlds yet')).to_be_visible()
            before = snapshot(page)
            creator(page, title).click()
            world_id = ready(page, title, success=True)
            committed = snapshot(page)
            assert split_graph(before) == split_graph(committed)
            world, receipt = (committed[store][0] for store in PAIR)
            assert world['worldInstanceId'] == receipt['worldInstanceId'] == world_id
            assert world['creationIntentId'] == receipt['creationIntentId']
        finally:
            first.close()

        restarted = playwright.chromium.launch_persistent_context(data_directory, executable_path=executable, ignore_default_args=['--hide-scrollbars'])
        try:
            page = restarted.new_page()
            page.goto(origin + FLAGS)
            sign_in(page, profile)
            library(page)
            assert ready(page, title) == world_id
            assert snapshot(page) == committed
            open_selected_creator(page, world_id, title, keyboard=True)
            edit_character_draft(page, world_id, keyboard=True)
            button(page, 'Cancel').press('Enter')
            expect(page.get_by_role('heading', name='World Characters')).to_be_focused()
            expect(page.get_by_role('region', name='Selected World').get_by_text(world_id, exact=True)).to_be_visible()
            button(page, 'Back to World Library').click()
            assert ready(page, title) == world_id
            assert snapshot(page) == committed
            print(f'PASS real Create, full browser restart, selected World {world_id}, editable Creator and Back',
                  flush=True)
        finally:
            restarted.close()


def open_settings(page, profile):
    button(page, 'Open existing launcher').click()
    expect(page.get_by_role('region', name='Characters')).to_be_visible()
    button(page, profile).press('Enter')
    page.get_by_role('menuitem', name='Settings', exact=True).press('Enter')


def viewport_flow(browser, origin, width, height, theme):
    context = browser.new_context(viewport={'width': width, 'height': height}, color_scheme=theme, has_touch=width < 700)
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
        if (width, height, theme) == (375, 800, 'light'):
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
        page.get_by_role('checkbox', name=re.compile('Confirm these settings')).focus()
        page.keyboard.press('Tab')
        expect(submit).to_be_focused()
        expect(submit).to_be_in_viewport()
        page.keyboard.press('Enter')
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
        if (width, height) in CREATOR_VIEWPORTS:
            keyboard = width in (375, 768)
            open_selected_creator(page, world_id, title, keyboard=keyboard)
            evidence = None
            if output := os.getenv('LINEAGE_CREATOR_EVIDENCE'):
                evidence = Path(output) / f'{width}x{height}-{theme}'
                evidence.mkdir(parents=True, exist_ok=True)
            edit_character_draft(page, world_id, keyboard=keyboard, evidence=evidence)
            width_check(page)
            button(page, 'Cancel').click()
            expect(page.get_by_role('heading', name='World Characters')).to_be_focused()
            button(page, 'Back to World Library').click()
            assert ready(page, title) == world_id
            assert snapshot(page) == after
            open_selected_creator(page, world_id, title)
            expect(page.get_by_role('main').get_by_role('heading', name='Lineage')).to_be_visible()
            expect(page.locator('.swc-header-profile')).to_contain_text('Unnamed Wanderer')
            assert snapshot(page) == after
            page.get_by_role('navigation', name='Creator controls').get_by_role('button', name='Back', exact=True).click()
            expect(page.get_by_role('heading', name='World Characters')).to_be_focused()
            button(page, 'Back to World Library').click()
            print(f'PASS {width}x{height} {theme}, selected World interactive Character Creator', flush=True)
        button(page, 'Home').click()
        button(page, 'Open existing launcher').click()
        expect(page.get_by_role('region', name='Characters')).to_be_visible()
        digest = hashlib.sha256(json.dumps([world, receipt], sort_keys=True).encode()).hexdigest()
        print(f'PASS {width}x{height} {theme}, keyboard Create/reopen, quota, owner graph {digest}', flush=True)
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
        button(page, 'Open World').click()
        expect(page.get_by_role('heading', name='World inventory blocked')).to_be_visible(timeout=30000)
        expect(button(page, 'Create Character')).to_have_count(0)
        button(page, 'Home').click()
        library(page)
        expect(page.get_by_role('heading', name='World inventory blocked')).to_be_visible(timeout=30000)
        expect(page.get_by_role('heading', name='No Worlds yet')).to_have_count(0)
        assert snapshot(page) == after
        context.unroute(SOURCE)
        button(page, 'Home').click()
        library(page)
        ready(page, 'Retried World')
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
        button(page, 'Open World').click()
        expect(page.get_by_role('heading', name='World inventory blocked')).to_be_visible()
        expect(page.get_by_role('heading', name='No Worlds yet')).to_have_count(0)
        assert snapshot(page)[PAIR[0]] == after[PAIR[0]]
        print('PASS unavailable/tampered source and missing receipt deny World selection', flush=True)
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


def selected_session_flow(browser, origin):
    context = browser.new_context()
    try:
        page = context.new_page()
        page.goto(origin + FLAGS)
        profile = 'Selected session review'
        title = 'Protected Chronicle'
        register(page, profile, remember=True)
        library(page)
        creator(page, title).click()
        world_id = ready(page, title, success=True)
        page.reload()
        welcome(page, profile)
        library(page)
        assert ready(page, title) == world_id
        expect(button(page, 'Open World')).to_have_count(0)
        button(page, 'Sign in again to open this World').click()
        sign_in(page, profile)
        library(page)
        open_selected_creator(page, world_id, title)
        button(page, 'Creator options').click()
        button(page, 'Sign Out').click()
        expect(page.get_by_label('Account', exact=True)).to_be_visible()
        expect(page.get_by_role('navigation', name='Creator stages')).to_have_count(0)
        button(page, 'Create Account').click()
        register(page, 'Other selected account')
        library(page)
        expect(page.get_by_role('heading', name='No Worlds yet')).to_be_visible()
        expect(button(page, 'Open World')).to_have_count(0)
        button(page, 'Home').click()
        button(page, 'Sign Out').click()
        sign_in(page, profile)
        library(page)
        open_selected_creator(page, world_id, title)
        peer = context.new_page()
        peer.goto(origin + FLAGS)
        sign_in(peer, profile)
        open_settings(peer, profile)
        button(peer, 'Reset Account').click()
        peer.get_by_placeholder('Account password', exact=True).fill(PASSWORD)
        button(peer, 'Reset Account').last.click()
        expect(peer.get_by_role('region', name='Characters')).to_be_visible()
        page.bring_to_front()
        expect(page.get_by_role('heading', name='World inventory blocked')).to_be_visible(timeout=15000)
        expect(page.get_by_role('navigation', name='Creator stages')).to_have_count(0)
        assert all(not snapshot(page)[store] for store in PAIR)

        page.locator('summary').get_by_text(profile, exact=True).click()
        button(page, 'Logout').click()
        sign_in(page, profile)
        library(page)
        creator(page, 'Deletion review World').click()
        world_id = ready(page, 'Deletion review World', success=True)
        open_selected_creator(page, world_id, 'Deletion review World')
        peer.reload()
        sign_in(peer, profile)
        open_settings(peer, profile)
        button(peer, 'Delete Account').click()
        peer.get_by_placeholder('Account password', exact=True).fill(PASSWORD)
        button(peer, 'Delete Account').last.click()
        expect(peer.get_by_label('Account', exact=True)).to_be_visible()
        page.bring_to_front()
        expect(page.get_by_role('heading', name='World inventory blocked')).to_be_visible(timeout=15000)
        expect(page.get_by_role('navigation', name='Creator stages')).to_have_count(0)
        assert all(not snapshot(page)[store] for store in PAIR)
        print('PASS remembered reauthentication, Creator logout, account isolation, generation reset and deletion',
              flush=True)
    finally:
        context.close()


def classic_character_flow(browser, origin):
    context = browser.new_context()
    try:
        page = context.new_page()
        page.goto(origin + FLAGS)
        page.get_by_label('Display Name', exact=True).fill('Classic Character Review')
        page.get_by_label('Password', exact=True).fill(PASSWORD)
        page.get_by_label('Confirm Password', exact=True).fill(PASSWORD)
        button(page, 'Create Account').click()
        characters = page.get_by_role('region', name='Characters')
        characters.get_by_role('button', name=re.compile(r'^1\s*Empty')).click()
        steps = page.get_by_role('navigation', name='Character creation steps')
        finalize = steps.get_by_role('button', name=re.compile('Finalize$'))
        for _ in range(24):
            if finalize.is_enabled():
                break
            button(page, 'Randomize Character').click()
        finalize.click()
        expect(page.get_by_role('navigation', name='Creator stages')).to_have_count(0)
        expect(button(page, 'Begin Journey')).to_be_enabled()
        before = snapshot(page)
        button(page, 'Begin Journey').click()
        expect(button(page, 'Inventory')).to_be_visible(timeout=30000)
        assert split_graph(snapshot(page)) != split_graph(before)
        assert all(not snapshot(page)[store] for store in PAIR)
        print('PASS compiled Classic starts its ordinary campaign and leaves the World stores empty', flush=True)
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
        persistent_restart_flow(playwright, review)
        browser = playwright.chromium.launch(executable_path=os.environ['CHROMIUM_EXECUTABLE'],
                                               ignore_default_args=['--hide-scrollbars'])
        try:
            for width, height in VIEWPORTS:
                for theme in ('dark', 'light'):
                    viewport_flow(browser, review, width, height, theme)
            fault_flow(browser, review)
            stale_flow(browser, review)
            selected_session_flow(browser, review)
            retry_flow(browser, review)
            competing_flow(browser, review)
            backup_flow(browser, review)
            classic_character_flow(browser, ordinary)
            context = browser.new_context()
            try:
                page = context.new_page()
                for url in [ordinary + FLAGS, review, review + FLAGS + '&worldPresentation=1']:
                    page.goto(url)
                    expect(page.get_by_label('Display Name', exact=True)).to_be_visible()
                    expect(page.locator('[data-world-presentation]')).to_have_count(0)
                    expect(button(page, 'Open World')).to_have_count(0)
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
