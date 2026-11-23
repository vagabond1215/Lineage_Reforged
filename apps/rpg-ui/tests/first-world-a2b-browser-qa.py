"""Atomic A2b acceptance through a normal compiled app entry on disposable origins."""
import argparse
import json
import os
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

PORTABLE = 'sha256:9d53637185c5e6e69649177619269bc7fedac55c91fd83b2428563fd44aba062'
WORLD = 'worldsV8'
RECEIPT = 'worldCreationReceiptsV8'


def request(revision, label='alpha'):
    return {'expectedAccountRevision': revision, 'creationIntentId': f'world.create.review.{label}',
            'proposedWorldInstanceId': f'world.instance.review.{label}', 'displayName': f'World {label}'}


def call(page, method, *args):
    return page.evaluate('([method, args]) => window.owner[method](...args)', [method, args])


def denied(page, method, arg, code_or_message):
    error = page.evaluate("""async ([method, arg]) => {
      try { await window.owner[method](arg); return ['unexpected success', '']; }
      catch (error) { return [error.code, error.message]; }
    }""", [method, arg])
    assert any(code_or_message in str(value) for value in error), error


def open_page(context, origin, name):
    page = context.new_page()
    page.goto(origin, wait_until='networkidle')
    page.wait_for_function('typeof window.worldOwnerReview === "object"')
    page.evaluate('async name => { window.owner = await worldOwnerReview.openWorldOwnerReview(name); }', name)
    return page


def queue(page, args):
    page.evaluate("""args => { window.pending = window.owner.create(args)
      .catch(error => ({ code: error.code, message: error.message })); }""", args)


def compare_families(a, b, limit=None):
    left, right = json.loads(a)['families'], json.loads(b)['families']
    assert (left if limit is None else left[:limit]) == (right if limit is None else right[:limit])


def raw_change(page, name, account, intent, fault):
    page.evaluate("""async ({name, account, intent, fault}) => {
      const db = await new Promise((resolve, reject) => {
        const open = indexedDB.open(name);
        open.onsuccess = () => resolve(open.result);
        open.onerror = () => reject(open.error);
      });
      try {
        const families = fault === 'seed' ? ['worldsV8','worldCreationReceiptsV8']
          : [fault === 'orphan' || fault === 'duplicate' ? 'worldCreationReceiptsV8' : 'worldsV8'];
        await new Promise((resolve, reject) => {
          const tx = db.transaction(families, 'readwrite');
          tx.oncomplete = resolve;
          tx.onabort = () => reject(tx.error);
          for (const family of families) {
            const records = tx.objectStore(family);
            if (fault === 'orphan') records.delete([account, intent]);
            else {
              const get = records.index('byAccount').get(account);
              get.onsuccess = () => {
                const record = get.result;
                if (fault === 'duplicate') records.add({...record, creationIntentId:'world.create.review.duplicate'});
                else {
                  if (fault === 'rules') record.binding.rules.hardcore = true;
                  else record.binding.seed = 'sha256:' + '0'.repeat(64);
                  records.put(record);
                }
              };
            }
          }
        });
      } finally { db.close(); }
    }""", {'name': name, 'account': account, 'intent': intent, 'fault': fault})


def run(review, ordinary):
    for url, variable in [(review, 'LINEAGE_TASK_OWNED_ORIGIN'), (ordinary, 'LINEAGE_TASK_OWNED_DEFAULT_ORIGIN')]:
        parsed = urlsplit(url)
        assert url == os.environ.get(variable) and parsed.hostname == '127.0.0.1' and parsed.port
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=os.environ['CHROMIUM_EXECUTABLE'])
        try:
            context = browser.new_context()
            try:
                plain = context.new_page()
                plain.goto(ordinary, wait_until='networkidle')
                assert plain.get_by_role('heading', name='Account Login').is_visible()
                assert not plain.evaluate("'worldOwnerReview' in window")
                plain.get_by_label('Display Name', exact=True).fill('Disposable ordinary launcher')
                plain.get_by_label('Password', exact=True).fill('disposable-ordinary-review')
                plain.get_by_label('Confirm Password', exact=True).fill('disposable-ordinary-review')
                plain.get_by_role('button', name='Create Account', exact=True).click()
                plain.get_by_role('navigation', name='Launcher sections').wait_for()
            finally:
                context.close()

            context = browser.new_context()
            active = open_page(context, review, 'a2b-review-main')
            peer = open_page(context, review, 'a2b-review-main')
            account = 'account.world.review.alpha'
            revision = call(active, 'authenticate', account, True)
            assert call(active, 'list') == [] and call(active, 'reopen') is None
            denied(active, 'forged', request(revision), 'credential-verified')
            denied(active, 'create', request(revision + 1), 'stale_head')
            revision = call(active, 'seedNativeHistory')
            before = call(active, 'exportArchive')
            assert call(peer, 'authenticate', account, False) == revision
            intent = request(revision)
            queue(active, intent)
            queue(peer, intent)
            outcomes = [page.evaluate('window.pending') for page in (active, peer)]
            assert sorted(outcome['status'] for outcome in outcomes) == ['committed', 'same_source_retry']
            committed = outcomes[0]
            assert outcomes[1]['world'] == committed['world'] and outcomes[1]['receipt'] == committed['receipt']
            assert committed['world']['version'] == committed['receipt']['version'] == 2
            assert committed['world']['projectionFingerprint'] == PORTABLE
            assert committed['world']['worldRevision'] == 0 and committed['world']['characterAssociations'] == []
            assert committed['world']['campaignSaveAssociations'] == []
            assert not committed['world']['economyState']['inventoryItemsMinted']
            denied(peer, 'create', request(revision, 'other'), 'conflict')
            denied(peer, 'create', dict(intent, displayName='Changed name'), 'conflict')
            after = call(active, 'exportArchive')
            compare_families(before, after, 14)
            assert [entry['count'] for entry in json.loads(after)['families'][-2:]] == [1, 1]
            for page in (active, peer):
                call(page, 'close')
                page.close()
            active = open_page(context, review, 'a2b-review-main')
            assert call(active, 'authenticate', account, False) == revision
            reopened = call(active, 'reopen')
            assert reopened['world'] == committed['world'] and reopened['receipt'] == committed['receipt']
            assert reopened['projectionFingerprint'] == PORTABLE
            sizes = active.evaluate("""({world, receipt}) => [world, receipt].map(value =>
              new TextEncoder().encode(JSON.stringify(value)).byteLength)""", reopened)
            assert call(active, 'create', intent)['status'] == 'same_source_retry'
            restored = open_page(context, review, 'a2b-review-restored')
            call(restored, 'restoreArchive', after)
            assert call(restored, 'authenticate', account, False) == revision
            assert call(restored, 'reopen') == reopened
            compare_families(call(restored, 'exportArchive'), after)
            denied(restored, 'restoreArchive', after, 'conflict')
            call(restored, 'close')
            corrupt = active.evaluate("""async archive => {
              const digest = async value => Array.from(new Uint8Array(await crypto.subtle.digest(
                'SHA-256', new TextEncoder().encode(JSON.stringify(value)))),
                byte => byte.toString(16).padStart(2, '0')).join('');
              const {sha256, ...data} = JSON.parse(archive);
              const family = data.families.find(f => f.name === 'worldsV8');
              family.rows[0].economyState.ledger.unverifiedMarker = true;
              family.sha256 = await digest(family.rows);
              return JSON.stringify({...data, sha256: await digest(data)});
            }""", after)
            fresh = open_page(context, review, 'a2b-review-corrupt-archive')
            denied(fresh, 'restoreArchive', corrupt, 'invalid_record')
            assert not any(row['count'] for row in json.loads(call(fresh, 'exportArchive'))['families'])
            call(fresh, 'close')
            assert call(active, 'lifecycle', 'delete')['status'] == 'ready'
            assert [row['count'] for row in json.loads(call(active, 'exportArchive'))['families'][-2:]] == [0, 0]
            call(active, 'close')
            print('PASS authenticated create, concurrent exact retry, quota, reopen, v8 archive, native-v3 ready/closed history, delete')

            for fault in ['abort', 'quota']:
                page = open_page(context, review, f'a2b-review-{fault}')
                revision = call(page, 'authenticate', account, True)
                call(page, 'arm', fault)
                denied(page, 'create', request(revision), 'aborted' if fault == 'abort' else 'quota')
                assert call(page, 'reopen') is None
                assert call(page, 'create', request(revision))['status'] == 'committed'
                call(page, 'close')
            print('PASS first-write abort and quota rollback with successful retry')

            page = open_page(context, review, 'a2b-review-compete')
            peer = open_page(context, review, 'a2b-review-compete')
            revision = call(page, 'authenticate', account, True)
            call(peer, 'authenticate', account, False)
            queue(page, request(revision))
            queue(peer, request(revision, 'competitor'))
            outcomes = [tab.evaluate('window.pending') for tab in (page, peer)]
            assert {item.get('status', item.get('code')) for item in outcomes} == {'committed', 'conflict'}
            other = 'account.world.review.beta'
            other_revision = call(peer, 'authenticate', other, True)
            assert call(peer, 'reopen') is None
            assert call(peer, 'create', request(other_revision))['world']['accountId'] == other
            assert call(page, 'reopen')['world']['accountId'] == account
            assert call(page, 'lifecycle', 'reset')['status'] == 'ready'
            denied(page, 'create', request(revision), 'stale_head')
            call(page, 'authenticate', account, False)
            assert call(page, 'list') == []
            assert call(peer, 'reopen')['world']['accountId'] == other
            for tab in (page, peer):
                call(tab, 'close')
            print('PASS competing intent, two accounts, reset and stale generation')

            for change in ['generation', 'revision']:
                name = f'a2b-review-stale-{change}'
                page = open_page(context, review, name)
                peer = open_page(context, review, name)
                revision = call(page, 'authenticate', account, True)
                call(peer, 'authenticate', account, False)
                holds = []

                def hold_first_source(route):
                    if not holds:
                        holds.append(route)
                    else:
                        route.continue_()

                pattern = '**/world-source/**/*.json'
                context.route(pattern, hold_first_source)
                queue(page, request(revision))
                for _ in range(60):
                    if holds:
                        break
                    page.wait_for_timeout(100)
                assert holds, 'Worker source never reached the controlled wait'
                outcome = call(peer, 'lifecycle', 'reset') if change == 'generation' else call(peer, 'changeRevision')
                assert outcome['status'] == 'ready'
                holds[0].continue_()
                context.unroute(pattern)
                result = page.evaluate('window.pending')
                assert result.get('code') == 'stale_head', result
                call(peer, 'authenticate', account, False)
                assert call(peer, 'reopen') is None
                for tab in (page, peer):
                    call(tab, 'close')
            print('PASS account revision and generation changed between Worker preload and transaction')

            for fault in ['missing', 'changed', 'orphan', 'duplicate', 'seed', 'rules']:
                name = f'a2b-review-bad-{fault}'
                page = open_page(context, review, name)
                revision = call(page, 'authenticate', account, True)
                intent = request(revision)
                outcome = call(page, 'create', intent) if fault not in ['missing', 'changed'] else None
                if outcome:
                    raw_change(page, name, account, intent['creationIntentId'], fault)
                    denied(page, 'reopen', None, 'invalid_record')
                    denied(page, 'exportArchive', None, 'invalid_record')
                else:
                    faults = []
                    def damage_source(route):
                        faults.append(route.request.url)
                        route.fulfill(status=404 if fault == 'missing' else 200, body='{}')
                    context.route('**/world-source/**/*.json', damage_source)
                    denied(page, 'create', intent, 'invalid_record')
                    assert faults
                    context.unroute('**/world-source/**/*.json')
                    assert call(page, 'reopen') is None
                call(page, 'close')
            print('PASS missing and changed sources, malformed rules/seed, orphan and duplicate receipts')

            legacy_page = context.new_page()
            legacy_page.goto(review, wait_until='networkidle')
            legacy_page.wait_for_function('typeof window.worldOwnerReview === "object"')
            legacy_name = 'a2b-review-original-v7'
            legacy_account = 'account.world.review.v7'
            legacy_archive = legacy_page.evaluate('args => worldOwnerReview.seedOriginalV7(...args)', [legacy_name, legacy_account])
            assert len(json.loads(legacy_archive)['families']) == 14
            legacy_page.evaluate("""async name => {
              window.blocker = await new Promise((resolve, reject) => {
                const pending = indexedDB.open(name, 7);
                pending.onsuccess = () => resolve(pending.result);
                pending.onerror = () => reject(pending.error);
              });
            }""", legacy_name)
            blocked = legacy_page.evaluate("""async name => {
              try { await worldOwnerReview.openWorldOwnerReview(name); return false; }
              catch (error) { return error.code === 'upgrade_blocked' || /block/i.test(error.message); }
            }""", legacy_name)
            assert blocked
            legacy_page.evaluate('blocker.close()')
            migrated = open_page(context, review, legacy_name)
            call(migrated, 'authenticate', legacy_account, False)
            assert call(migrated, 'reopen') is None
            compare_families(call(migrated, 'exportArchive'), legacy_archive, 14)
            call(migrated, 'close')
            target = open_page(context, review, 'a2b-review-v7-restored')
            call(target, 'restoreArchive', legacy_archive)
            compare_families(call(target, 'exportArchive'), legacy_archive, 14)
            call(target, 'close')
            print('PASS original v7 blocked upgrade, migration and archive restore; feature-off app')
            context.close()
            print(json.dumps({'status': 'PASS', 'archive_delta': len(after.encode()) - len(before.encode()),
                              'world_bytes': sizes[0], 'receipt_bytes': sizes[1],
                              'projection': reopened['projectionFingerprint'],
                              'source': reopened['world']['binding']['sourceFingerprint']}))
        finally:
            browser.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--review-origin', required=True)
    parser.add_argument('--ordinary-origin', required=True)
    args = parser.parse_args()
    run(args.review_origin.rstrip('/'), args.ordinary_origin.rstrip('/'))
