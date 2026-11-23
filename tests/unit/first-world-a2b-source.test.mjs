import { historicalWorldSourceReader } from '../../apps/rpg-ui/build/first-world-source-v4.mjs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { repository, verifyWorldSourceV2 } from '../../apps/rpg-ui/build/first-world-source-pack.mjs';
import { verifyWorldOwnerSource } from '../../apps/rpg-ui/build/first-world-owner-source.mjs';

test('the World owner identity composes the unchanged browser algorithm pins and exact write owner', () => {
  const parent = verifyWorldSourceV2(historicalWorldSourceReader());
  const successor = verifyWorldOwnerSource(historicalWorldSourceReader());
  assert.equal(successor.count, 55);
  assert.equal(successor.parentFingerprint, parent.runtimeFingerprint);
  assert.notEqual(successor.runtimeFingerprint, parent.runtimeFingerprint);
  assert.throws(() => verifyWorldOwnerSource(historicalWorldSourceReader(path => {
    const bytes = readFileSync(resolve(repository, path));
    return path.endsWith('cleanEpochAccountAdapter.ts') ? Buffer.concat([bytes, Buffer.from(' ')]) : bytes;
  })), /does not match its pin/);
});
