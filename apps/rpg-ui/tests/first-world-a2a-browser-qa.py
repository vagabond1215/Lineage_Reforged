"""Run the read-only A2a source seam through standard built application entries."""
import argparse
import json
import os
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

PREPARE = 'request => window.prepareChronicleWorldSourceForReview(request)'
DENIAL = """async request => {
  try { await window.prepareChronicleWorldSourceForReview(request); return 'unexpected success'; }
  catch (error) { return error.message; }
}"""
STORAGE = """async () => {
  const existing = await indexedDB.databases();
  const stores = [];
  for (const {name, version} of existing) {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      for (const store of db.objectStoreNames) {
        const count = await new Promise((resolve, reject) => {
          const request = db.transaction(store).objectStore(store).count();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        stores.push([name, version, store, count]);
      }
    } finally { db.close(); }
  }
  return [stores.sort(), Object.entries(localStorage).sort()];
}"""


def run(review, ordinary, oracle):
    origins = (review, ordinary)
    for origin in origins:
        parsed = urlsplit(origin)
        assert parsed.hostname == '127.0.0.1' and parsed.port
    assert review == os.environ.get('LINEAGE_TASK_OWNED_ORIGIN')
    assert ordinary == os.environ.get('LINEAGE_TASK_OWNED_DEFAULT_ORIGIN')
    node = json.loads(oracle.read_text(encoding='utf-8-sig'))
    input_request = {'input': node['input']}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=os.environ['CHROMIUM_EXECUTABLE'])
        try:
            context = browser.new_context()
            try:
                page = context.new_page()
                transfers = []
                page.on('request', lambda r: transfers.append(r.url)
                        if '/world-source/' in r.url or '/assets/worker-' in r.url else None)
                page.goto(ordinary, wait_until='networkidle')
                assert not page.evaluate("'prepareChronicleWorldSourceForReview' in window")
                assert not transfers
            finally:
                context.close()

            context = browser.new_context()
            try:
                page = context.new_page()
                page.goto(review, wait_until='networkidle')
                before = page.evaluate(STORAGE)
                assert not any(row[3] for row in before[0])
                candidate = page.evaluate(PREPARE, input_request)
                assert candidate == node['expected']
                assert page.evaluate(STORAGE) == before
                retained = json.loads(json.dumps(candidate['compact']))
            finally:
                context.close()

            context = browser.new_context()
            try:
                page = context.new_page()
                page.goto(review, wait_until='networkidle')
                before = page.evaluate(STORAGE)
                assert page.evaluate(PREPARE, {'retained': retained}) == candidate
                altered = json.loads(json.dumps(retained))
                altered['economy']['economyTick'] = 1
                assert 'retained authority' in page.evaluate(DENIAL, {'retained': altered})
                assert page.evaluate(STORAGE) == before
            finally:
                context.close()

            for fault in ('missing', 'changed'):
                context = browser.new_context()
                try:
                    context.route('**/world-source/**/*.json',
                                  lambda r: r.fulfill(status=404) if fault == 'missing'
                                  else r.fulfill(status=200, content_type='application/json', body='{}'))
                    page = context.new_page()
                    page.goto(review, wait_until='networkidle')
                    before = page.evaluate(STORAGE)
                    result = page.evaluate(DENIAL, input_request)
                    assert ('HTTP 404' if fault == 'missing' else 'failed integrity validation') in result, result
                    assert page.evaluate(STORAGE) == before
                finally:
                    context.close()
        finally:
            browser.close()
    print(json.dumps({
        'status': 'PASS', 'source': candidate['compact']['source'],
        **{key: candidate[key] for key in ('fullBytes', 'compactBytes', 'sourceBytes',
                                          'projectionFingerprint', 'portableProjectionFingerprint')},
    }, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--review-origin', required=True)
    parser.add_argument('--ordinary-origin', required=True)
    parser.add_argument('--node-oracle', type=Path, required=True)
    args = parser.parse_args()
    run(args.review_origin.rstrip('/'), args.ordinary_origin.rstrip('/'), args.node_oracle)
