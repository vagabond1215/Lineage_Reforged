"""Compare the real compiled engine in Chromium with a verified Node oracle."""
import argparse
import json
import os
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright


def run(origin, oracle):
    parsed = urlsplit(origin)
    assert parsed.hostname == '127.0.0.1' and parsed.port
    assert origin == os.environ.get('LINEAGE_TASK_OWNED_ORIGIN')
    node = json.loads(oracle.read_text(encoding='utf-8-sig'))
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=os.environ['CHROMIUM_EXECUTABLE'])
        try:
            context = browser.new_context()
            try:
                page = context.new_page()
                errors = []
                requests = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('request', lambda request: requests.append(request.url) if '/content/' in request.url else None)
                page.goto(origin + '/index.html')
                page.wait_for_function('typeof window.measureFirstWorldA1 === "function"')
                chromium = page.evaluate('window.measureFirstWorldA1("alpha")')
                assert chromium == node, (node, chromium)
                alternate = page.evaluate('window.measureFirstWorldA1("beta")')
                assert alternate['result']['projection'] == chromium['result']['projection']
                assert alternate['result']['worldInstanceId'] != chromium['result']['worldInstanceId']
                assert alternate['result']['world'] != chromium['result']['world']
                assert page.evaluate('window.measureFirstWorldA1("alpha")') == node
                assert len(requests) == len(set(requests)) == node['source']['files']
                assert not errors, errors
                assert page.evaluate('async () => (await indexedDB.databases()).length === 0 && localStorage.length === 0')
            finally:
                context.close()

            for fault in ('missing', 'changed'):
                context = browser.new_context()
                try:
                    page = context.new_page()
                    asset = requests[-1]
                    page.route(asset, lambda route: route.fulfill(status=404) if fault == 'missing'
                               else route.fulfill(status=200, content_type='application/json', body='{}'))
                    page.goto(origin + '/index.html')
                    result = page.evaluate("""async () => {
                      try { await window.measureFirstWorldA1("alpha"); return 'unexpected success'; }
                      catch (error) { return error.message; }
                    }""")
                    assert ('HTTP 404' if fault == 'missing' else 'failed integrity validation') in result, result
                    assert page.evaluate('async () => (await indexedDB.databases()).length === 0')
                finally:
                    context.close()
            # A clean realm can reopen the verified source after failed loads elsewhere.
            context = browser.new_context()
            try:
                page = context.new_page()
                page.goto(origin + '/index.html')
                assert page.evaluate('window.measureFirstWorldA1("alpha")') == node
            finally:
                context.close()
        finally:
            browser.close()
    print(json.dumps({'status': 'PASS', **node}, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--origin', required=True)
    parser.add_argument('--node-oracle', type=Path, required=True)
    args = parser.parse_args()
    run(args.origin.rstrip('/'), args.node_oracle)
