import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { repository, verifyPinnedBytes, verifySourcePack } from '../../apps/rpg-ui/build/first-world-source-pack.mjs';

const read = path => readFileSync(resolve(repository, path));
const canonical = verifySourcePack();

test('verifies every published pin and the additional in-memory row producer', () => {
  assert.equal(canonical.contentPins.length, 22);
  assert.equal(canonical.bytes.size, 42);
  assert.equal(canonical.historicalFingerprint, 'sha256:9482870a7784f877bb8c789f65f29dea8fd62a18392381dc1ffd7a3f7e2659eb');
  assert.equal(canonical.runtimeFingerprint, 'sha256:c489ca61176bc3a2100f9ee80839760fc2733c9bce84be1555abe3525f3537ca');
});

test('reconstructs the exact pinned checkout bytes without stripping the UTF-8 BOM', () => {
  const pin = canonical.contentPins.find(({ path }) =>
    canonical.bytes.get(path).subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])));
  assert.ok(pin);
  const original = canonical.bytes.get(pin.path);
  const windows = Buffer.from(original.toString('utf8').replaceAll('\n', '\r\n'));
  assert.notDeepEqual(windows, original);
  assert.deepEqual(verifyPinnedBytes(pin, windows), original);
  assert.throws(() => verifyPinnedBytes(pin, original.subarray(3)), /does not match its pin/);
});

test('fails closed for missing or modified content, modified algorithms and altered pin lists', () => {
  assert.throws(() => verifySourcePack(path => {
    if (path === canonical.templatePath) throw new Error('missing pinned input');
    return read(path);
  }), /missing pinned input/);
  for (const changed of [canonical.templatePath, 'packages/shared/time/src/index.ts']) {
    assert.throws(() => verifySourcePack(path =>
      path === changed ? Buffer.concat([read(path), Buffer.from(' ')]) : read(path)), /does not match its pin/);
  }
  assert.throws(() => verifySourcePack(path => {
    if (!path.startsWith('docs/')) return read(path);
    const manifest = JSON.parse(read(path));
    manifest.pinnedSourceFiles.pop();
    return Buffer.from(JSON.stringify(manifest));
  }), /source-manifest-v1\.json/);
});
