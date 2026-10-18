// Read-only reconciliation of the nonsecret G10E selected graph receipts.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = new URL('../../docs/dev/evidence/', import.meta.url);
const read = stem => JSON.parse(readFileSync(new URL(`${stem}-2026-10-18.json`, base), 'utf8'));
const pre = read('g10e-held-preconcurrency-baseline');
const primary = read('g10e-held-after-primary');
const stale = read('g10e-held-after-stale');
const legacy = read('g10e-held-after-legacy');
const source = read('g10e-held-selected-source');
const retry = read('g10e-held-postretry-save');
const old2 = read('g10e-held-after-second-legacy');
const restored = read('g10e-held-restored-prelogin');
const restarted = read('g10e-held-restored-postload-restart');
const legacyBefore = read('g10e-held-legacy-hint-before-second-writer');
const legacyAfter = read('g10e-held-legacy-hint-after-second-writer');
const unchanged = (a, b) => {
  for (const key of ['archiveBytes', 'families', 'accounts', 'heads', 'addresses',
    'generations', 'artifacts', 'witnesses', 'lifecycle']) assert.deepEqual(a[key], b[key], key);
};
const count = (graph, family) => graph.families.find(row => row.name === family)?.count;
for (const graph of [pre, primary, stale, legacy, source, retry, old2, restored, restarted]) {
  assert.equal(graph.families.length, 14);
  assert.equal(graph.accounts.length, 2);
  assert.equal(graph.heads.length, 4);
  assert.equal(graph.witnesses.length, 2);
  assert.equal(graph.storage.persisted, false);
}
assert.equal(pre.accounts[0].runCharacterIds.length, 2);
assert.equal(pre.accounts[1].runCharacterIds.length, 2);
assert.equal(count(pre, 'artifacts') + 1, count(primary, 'artifacts'));
assert.equal(count(pre, 'descendantPublicationRecoveries') + 1,
  count(primary, 'descendantPublicationRecoveries'));
assert.equal(pre.accounts[0].revision + 1, primary.accounts[0].revision);
assert.deepEqual(pre.accounts[1], primary.accounts[1]);
assert.deepEqual(pre.witnesses, primary.witnesses);
unchanged(primary, stale);
unchanged(stale, legacy);
unchanged(legacy, source);
assert.equal(count(source, 'artifacts') + 1, count(retry, 'artifacts'));
assert.equal(count(source, 'descendantPublicationRecoveries') + 1,
  count(retry, 'descendantPublicationRecoveries'));
assert.equal(source.accounts[0].revision + 1, retry.accounts[0].revision);
assert.deepEqual(source.accounts[1], retry.accounts[1]);
assert.deepEqual(source.witnesses, retry.witnesses);
unchanged(retry, old2);
unchanged(source, restored);
unchanged(restored, restarted);
assert.equal(legacyBefore.legacyKeys.length, 8);
assert.equal(legacyAfter.legacyKeys.length, 14);
assert.equal(legacyBefore.epochHintSha256, legacyAfter.epochHintSha256);
assert.equal(legacyBefore.epochHintBytes, legacyAfter.epochHintBytes);
assert.equal(JSON.stringify(read('g10e-held-legacy-writer').legacyKeys),
  JSON.stringify(read('g10e-held-legacy-after-epoch-save').legacyKeys));
for (const stem of ['g10e-held-persist-source', 'g10e-held-persist-restored']) {
  const posture = read(stem);
  assert.deepEqual(posture, { persistSupported: true, persistResult: false, persisted: false });
}
console.log('PASS_G10E_FRESH_SELECTED_GRAPH_RECONCILIATION');
