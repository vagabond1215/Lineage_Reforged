import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';
import { getDefaultWorldSelection } from '../src/game-shell/worldSelectionCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
test.after(() => vite.close());
const { recoverPendingInventory } = await vite.ssrLoadModule('/src/EpochApp.tsx');
const { createNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/newGameSnapshot.ts');
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { serializeSnapshot } = await vite.ssrLoadModule('/../../packages/shared/persistence/src/index.ts');
const { buildSaveMetadata, buildNativeGearArtifactPublication } =
  await vite.ssrLoadModule('/src/game-shell/saveManager.ts');
const { CleanEpochTerminalAdapter } = await vite.ssrLoadModule('/src/game-shell/cleanEpochTerminalAdapter.ts');

function form(slotId) {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  return { ...createDefaultCharacterCreationFormState(slotId), playerName: 'Recovery Hunter',
    hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.local',
    continentId: world.continentId, regionId: world.regionId,
    startingSettlementId: world.settlementId, startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter') };
}
async function evidence(slotId, native) {
  const snapshot = native
    ? createNativeNewGameSnapshot(form(slotId), 'account.recovery.test')
    : createNewGameSnapshot(form(slotId), 'account.recovery.test');
  const sourceRaw = serializeSnapshot(snapshot);
  const envelope = native
    ? JSON.parse((await buildNativeGearArtifactPublication(snapshot, slotId, {
      artifactId: `artifact.${slotId}`, generationId: `generation.${slotId}`,
      publicationId: `publication.${slotId}`, savedAt: '2026-11-10T00:00:00.000Z',
      expectedHead: null })).artifactRaw)
    : { version: 7, accountId: snapshot.accountId, slotId,
      savedAt: '2026-11-10T00:00:00.000Z',
      metadata: buildSaveMetadata(slotId, snapshot), snapshotFormatId: 'lineage.save_snapshot.v2',
      campaignId: snapshot.campaignIdentity.campaignId,
      continuityId: snapshot.campaignIdentity.continuityId,
      characterId: snapshot.playerState.playerId, artifactId: `artifact.${slotId}`,
      generationId: `generation.${slotId}`, publicationId: `publication.${slotId}`,
      headRevision: 1, terminal: false, snapshot: sourceRaw };
  return { snapshot, sourceRaw, envelopeRaw: JSON.stringify(envelope),
    metadata: envelope.metadata };
}
function services(rows) {
  const calls = [];
  const inventory = async () => ({ status: 'ready', value: { account: { revision: 1 },
    slots: rows.map(row => ({ slotId: row.slotId, status: row.status, metadata: row.metadata })) } });
  return { calls, launcher: { inventory }, owner: {
    readAttempt: async (_account, slotId) => {
      calls.push(`read-attempt:${slotId}`);
      return rows.find(row => row.slotId === slotId)?.attempt ?? null;
    },
    readRecovery: async (_account, slotId) => rows.find(row => row.slotId === slotId)?.recovery ?? null,
    readCurrentDescendantRecovery: async (_account, slotId) =>
      rows.find(row => row.slotId === slotId)?.descendant ?? null,
    closePendingTerminalAddressesForAccount: async (_account, required) => {
      calls.push(`close:${required ?? 'v2'}`); return 0;
    }
  }, first: { resume: async (_account, slotId) => {
    calls.push(`first:${slotId}`);
    rows.find(row => row.slotId === slotId).status = 'ready';
    return { status: 'ready' };
  } }, descendant: { resumeCurrent: async (_account, slotId) => {
    calls.push(`descendant:${slotId}`);
    rows.find(row => row.slotId === slotId).status = 'ready';
    return { status: 'ready' };
  } }, terminal: { resumePending: async (_account, required) => {
    calls.push(`terminal:${required ?? 'v2'}`); return null;
  } } };
}

test('native inventory preserves a v2 pending source and admits an independent v3 ready slot', async () => {
  const old = await evidence('slot-2', false);
  const current = await evidence('slot-1', true);
  const rows = [{ slotId: 'slot-1', status: 'ready', metadata: current.metadata },
    { slotId: 'slot-2', status: 'pending_consumers', metadata: old.metadata,
      attempt: { snapshotRaw: old.sourceRaw },
      recovery: { status: 'accepted_pending_consumers', envelopeRaw: old.envelopeRaw } }];
  const before = JSON.stringify(rows);
  const next = services(rows);
  const result = await recoverPendingInventory(next, 'account.recovery.test', true);
  assert.equal(result.slots[0].status, 'ready');
  assert.equal(result.slots[1].status, 'pending_consumers');
  assert.equal(JSON.stringify(rows), before);
  assert.deepEqual(next.calls, ['read-attempt:slot-2',
    'terminal:lineage.save_snapshot.v3', 'close:lineage.save_snapshot.v3']);
});

test('native inventory completes one exact v3 pending source once', async () => {
  const current = await evidence('slot-1', true);
  const rows = [{ slotId: 'slot-1', status: 'pending_consumers', metadata: current.metadata,
    attempt: { snapshotRaw: current.sourceRaw },
    recovery: { status: 'accepted_pending_consumers', envelopeRaw: current.envelopeRaw } }];
  const next = services(rows);
  await recoverPendingInventory(next, 'account.recovery.test', true);
  await recoverPendingInventory(next, 'account.recovery.test', true);
  assert.equal(next.calls.filter(call => call === 'first:slot-1').length, 1);
});

test('malformed and unavailable pending reads fail without completion or closure', async () => {
  const old = await evidence('slot-2', false);
  const row = { slotId: 'slot-2', status: 'pending_consumers', metadata: old.metadata,
    attempt: { snapshotRaw: old.sourceRaw },
    recovery: { status: 'accepted_pending_consumers', envelopeRaw: 'corrupt' } };
  const next = services([row]);
  await assert.rejects(recoverPendingInventory(next, 'account.recovery.test', true));
  assert.deepEqual(next.calls, ['read-attempt:slot-2']);
  const unavailable = services([row]);
  unavailable.owner.readAttempt = async () => { throw new Error('unavailable'); };
  await assert.rejects(recoverPendingInventory(unavailable, 'account.recovery.test', true), /unavailable/);
  assert.deepEqual(unavailable.calls, []);
});

test('native terminal admission does not settle a retained v2 pending source', async () => {
  const old = await evidence('slot-1', false);
  let settlements = 0;
  const terminal = new CleanEpochTerminalAdapter({
    readPendingTerminalForAccount: async () => ({ sourceSnapshotRaw: old.sourceRaw,
      envelopeRaw: JSON.stringify({ ...JSON.parse(old.envelopeRaw), terminal: true }) }),
    completeTerminalSettlement: async () => { settlements++; }
  });
  assert.equal(await terminal.resumePending('account.recovery.test', 'lineage.save_snapshot.v3'), null);
  assert.equal(settlements, 0);
});
