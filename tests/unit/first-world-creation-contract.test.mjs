import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { webcrypto } from 'node:crypto';
import {
  FIRST_WORLD_TEMPLATE_ID, FIRST_WORLD_MAP_ID,
  WorldContractError, inspectChronicleWorldTemplate,
  prepareChronicleWorldGenesis, inspectRetainedChronicleCreate
} from '../../apps/rpg-ui/src/game-shell/firstWorldCreationContract.ts';

if (!globalThis.crypto) globalThis.crypto = webcrypto;
const source = fs.readFileSync('packages/content/base/world/templates/starfall_port_chronicle_v1.json', 'utf8');
const template = JSON.parse(source);
const base = {
  account: { accountId: 'account.synthetic.alpha', revision: 7, lifecycleGeneration: 3 },
  expectedAccountRevision: 7,
  expectedAccountGeneration: 3,
  creationIntentId: 'world.create.synthetic.alpha.1',
  proposedWorldInstanceId: 'world.instance.synthetic.alpha.1',
  displayName: 'The First World',
  createdAt: '2026-11-17T11:10:00.000Z',
  sourceTemplateJson: source
};
function rejectsCode(code, operation) {
  return assert.rejects(operation, error => error instanceof WorldContractError && error.code === code);
}

test('L2 Starfall source and candidate are fixed, character-free and never v7 writable', async () => {
  inspectChronicleWorldTemplate(template);
  const snapshot = structuredClone(template);
  const plan = await prepareChronicleWorldGenesis(base);
  assert.equal(plan.status, 'L2_CANDIDATE_ONLY_NOT_PERSISTED');
  assert.equal(plan.allowedToWriteExistingEpochV7, false);
  assert.equal(plan.world.canonicalWritable, false);
  assert.equal(plan.receipt.canonicalWritable, false);
  assert.equal(plan.receipt.state, 'PREPARED_NOT_COMMITTED');
  assert.equal(plan.world.worldInstanceId, base.proposedWorldInstanceId);
  assert.equal(plan.world.worldMapId, FIRST_WORLD_MAP_ID);
  assert.equal(plan.world.sourceTemplateId, FIRST_WORLD_TEMPLATE_ID);
  assert.match(plan.world.sourceManifestFingerprint, /^sha256:[a-f0-9]{64}$/);
  assert.equal(plan.receipt.sourceManifestFingerprint, plan.world.sourceManifestFingerprint);
  assert.equal(plan.world.accountLifecycleGeneration, 3);
  assert.equal(plan.world.worldRevision, 0);
  assert.equal(plan.world.clock.elapsedWorldSeconds, 0);
  assert.equal(plan.world.clock.paused, false);
  assert.equal(plan.world.rules.progressionMode, 'chronicle');
  assert.equal(plan.world.rules.worldKind, 'individual');
  assert.equal(plan.world.rules.hardcore, false);
  assert.equal(plan.world.rules.timePolicy.allowsPlayerTimeSkip, false);
  for (const key of ['characterAssociations','campaignSaveAssociations','materializedAreaInstances',
      'areaMutationRecords','spawnedEntityRecords','resourceDepletionRecords',
      'scheduledActionRecords','pendingPublicationReceipts','committedWorldEvents',
      'inventoryMutationRecords']) assert.deepEqual(plan.world[key], [], key);
  assert.equal(plan.world.economyBootstrap.stockSnapshot, null);
  assert.equal(plan.world.economyBootstrap.status, 'read_only_preview_until_world_save_owner_is_approved');
  assert.deepEqual(template, snapshot, 'genesis must not mutate source template');
});

test('L2 exact same account, same source and intent are deterministically retriable', async () => {
  const first = await prepareChronicleWorldGenesis(base);
  const again = await prepareChronicleWorldGenesis(structuredClone(base));
  assert.deepEqual(again, first);
  assert.equal(inspectRetainedChronicleCreate(first, [], null), 'NEW');
  assert.equal(inspectRetainedChronicleCreate(first, [first.world], first.receipt), 'SAME_SOURCE_RETRY');
  await rejectsCode('incomplete_receipt', async () => inspectRetainedChronicleCreate(first, [first.world], null));
  await rejectsCode('incomplete_receipt', async () => inspectRetainedChronicleCreate(first, [], first.receipt));
  await rejectsCode('invalid_input', async () => inspectRetainedChronicleCreate(first, [first.world, first.world], first.receipt));
});

test('L2 account lifecycle and revision mismatch fail closed', async () => {
  await rejectsCode('stale_account', () =>
    prepareChronicleWorldGenesis({ ...base, expectedAccountRevision: 6 }));
  await rejectsCode('stale_account', () =>
    prepareChronicleWorldGenesis({ ...base, expectedAccountGeneration: 2 }));
  await rejectsCode('invalid_input', () =>
    prepareChronicleWorldGenesis({ ...base, displayName: '' }));
  await rejectsCode('invalid_input', () =>
    prepareChronicleWorldGenesis({ ...base, displayName: ' CRLF\n' }));
  await rejectsCode('invalid_input', () =>
    prepareChronicleWorldGenesis({ ...base, proposedWorldInstanceId: 'legacy_save_slot_1' }));
});

test('L2 one World cannot be re-used across accounts, intents, names or source hashes', async () => {
  const first = await prepareChronicleWorldGenesis(base);
  const other = await prepareChronicleWorldGenesis({
    ...base,
    account: { accountId: 'account.synthetic.beta', revision: 7, lifecycleGeneration: 3 },
    creationIntentId: 'world.create.synthetic.beta.1',
    proposedWorldInstanceId: 'world.instance.synthetic.beta.1'
  });
  await rejectsCode('conflict', async () =>
    inspectRetainedChronicleCreate(other, [first.world], first.receipt));
  await rejectsCode('conflict', async () =>
    inspectRetainedChronicleCreate(first, [{ ...first.world, sourceManifestFingerprint: 'sha256:tampered' }], first.receipt));
  await rejectsCode('conflict', async () =>
    inspectRetainedChronicleCreate(first, [first.world], { ...first.receipt, creationIntentId: 'world.create.other' }));
  await rejectsCode('conflict', async () =>
    inspectRetainedChronicleCreate(first, [{ ...first.world, displayName: 'Different' }], first.receipt));
});

test('L2 rejects changed template authority, altered modes, clock, actors and seeded trade', async () => {
  const modifications = [
    t => { t.templateVersion = 2; },
    t => { t.runtimeEligible = true; },
    t => { t.immutableIdentity.startSettlementId = 'settlement.fiction'; },
    t => { t.proposedInstanceSeed.rules.progressionMode = 'persistent'; },
    t => { t.proposedInstanceSeed.rules.hardcore = true; },
    t => { t.proposedInstanceSeed.rules.timePolicy.allowsPlayerTimeSkip = true; },
    t => { t.proposedInstanceSeed.clock.elapsedWorldSeconds = 1; },
    t => { t.proposedInstanceSeed.characterAssociations.push('character.fake'); },
    t => { t.proposedInstanceSeed.economyBootstrap.stockSnapshot = { fish: 9 }; },
    t => { t.localAreaBlueprint.placedMonsterInstances.push({ id: 'monster.fake' }); },
    t => { t.proposedInstanceSeed.accountId = 'account.synthetic.alpha'; },
  ];
  for (const modify of modifications) {
    const changed = structuredClone(template);
    modify(changed);
    await rejectsCode('template_mismatch', () =>
      prepareChronicleWorldGenesis({ ...base, sourceTemplateJson: JSON.stringify(changed) }));
  }
  await rejectsCode('template_mismatch', () =>
    prepareChronicleWorldGenesis({ ...base, sourceTemplateJson: '{not-json}' }));
});
