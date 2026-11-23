import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { repository, verifySourcePack, verifyWorldSourceV2 } from '../../apps/rpg-ui/build/first-world-source-pack.mjs';
import { prepareWorldSourceCandidate } from '../../apps/rpg-ui/src/game-shell/world-source/candidate.mjs';

const source = verifyWorldSourceV2();
const template = source.bytes.get(source.templatePath).toString('utf8');
const input = {
  account: { accountId: 'a2a.fixture', revision: 4, lifecycleGeneration: 2 },
  expectedAccountRevision: 4,
  expectedAccountGeneration: 2,
  creationIntentId: 'world.create.a2a.fixture',
  proposedWorldInstanceId: 'world.instance.a2a.fixture',
  displayName: 'Separate A2a fixture',
  createdAt: '2026-11-22T02:04:08.000Z',
};

test('v2 preserves the A1 history and checks concrete successor implementation files', () => {
  const a1 = verifySourcePack();
  assert.equal(a1.runtimeFingerprint, 'sha256:c489ca61176bc3a2100f9ee80839760fc2733c9bce84be1555abe3525f3537ca');
  assert.deepEqual(a1.contentPins, source.contentPins);
  assert.notEqual(a1.runtimeFingerprint, source.runtimeFingerprint);
  assert.equal(source.bytes.size, 50);
  for (const changed of ['apps/rpg-ui/build/first-world-browser-loader.mjs',
    'apps/rpg-ui/src/game-shell/world-source/worker.mjs']) {
    assert.throws(() => verifyWorldSourceV2(path => {
      const bytes = readFileSync(resolve(repository, path));
      return path === changed ? Buffer.concat([bytes, Buffer.from(' ')]) : bytes;
    }), /does not match its pin/);
  }
  assert.throws(() => verifyWorldSourceV2(path => {
    const bytes = readFileSync(resolve(repository, path));
    if (!path.endsWith('first-world-economy-source-manifest-v2.json')) return bytes;
    const corrupt = JSON.parse(bytes);
    corrupt.runtimeFingerprint = a1.runtimeFingerprint;
    return Buffer.from(JSON.stringify(corrupt));
  }), /v2 fingerprint mismatch/);
});

test('compact genesis is unwritable, preserves the ledger and rebuilds exact tick-zero output', async () => {
  const result = await prepareWorldSourceCandidate(source, template, { input });
  const { compact } = result;
  assert.equal(result.status, 'UNCOMMITTED_TICK_ZERO_CANDIDATE');
  assert.equal(compact.receipt.state, 'PREPARED_NOT_COMMITTED');
  assert.equal(compact.source.sourceFingerprint, source.runtimeFingerprint);
  assert.equal(compact.economy.economyTick, 0);
  assert.ok(compact.economy.ledger);
  assert.ok(result.compactBytes < result.fullBytes / 100);
  assert.equal(result.portableProjectionFingerprint, 'sha256:344f5b9728d8b0276b803ef941c5e53c0f411998341f034670fda65c4740601a');
  const persisted = JSON.parse(JSON.stringify(compact));
  assert.deepEqual(await prepareWorldSourceCandidate(source, template, { retained: persisted }), result);
  for (const mutate of [
    copy => { copy.source.sourceFingerprint = 'sha256:broken'; },
    copy => { copy.world.worldRevision = 1; },
    copy => { delete copy.economy.ledger; },
    copy => { copy.projectionFingerprint = 'sha256:broken'; },
  ]) {
    const changed = structuredClone(persisted);
    mutate(changed);
    await assert.rejects(prepareWorldSourceCandidate(source, template, { retained: changed }),
      /does not match the verified source or retained authority/);
  }
});
