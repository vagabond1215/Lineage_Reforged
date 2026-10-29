import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';
import { getDefaultWorldSelection } from '../src/game-shell/worldSelectionCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
test.after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createCampaignSessionControl } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-session.ts');
const { createNativeSelectedSession, applyNativeSelectedItem, saveNativeSelectedSession } =
  await vite.ssrLoadModule('/src/game-shell/nativeSelectedSession.ts');

function hunter() {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  return createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Native Session Hunter',
    hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.local',
    continentId: world.continentId, regionId: world.regionId,
    startingSettlementId: world.settlementId, startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, 'account.native.session.host');
}
function control(snapshot) {
  return createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.native.host',
    publicationId: 'publication.native.host', artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: 'artifact.native.host', headRevision: 1 });
}

test('native selected host keeps accepted item snapshot and campaign control in one state', () => {
  const snapshot = hunter();
  const first = createNativeSelectedSession({ snapshot, control: control(snapshot),
    sourceSlotId: 'slot-1', accountRevision: 2 });
  const bow = first.snapshot.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
  const command = { kind: 'gear', expectedRevision: first.snapshot.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } };
  const moved = applyNativeSelectedItem(first, command, 'native.host.bow.1');
  assert.equal(moved.status, 'accepted');
  assert.equal(moved.session.control.hasUnpublishedGameplayState, true);
  assert.equal(moved.session.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId).location.kind, 'bag');
  assert.equal(first.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId).location.kind, 'worn');
  const stale = applyNativeSelectedItem(moved.session, command, 'native.host.bow.stale');
  assert.equal(stale.status, 'stale');
  assert.strictEqual(stale.session, moved.session);
  const duplicate = applyNativeSelectedItem(moved.session, command, 'native.host.bow.1');
  assert.equal(duplicate.status, 'duplicate');
  assert.strictEqual(duplicate.session, moved.session);
});

test('native selected host rejects mismatched account and obsolete development snapshots', () => {
  const snapshot = hunter();
  assert.throws(() => createNativeSelectedSession({ snapshot,
    control: { ...control(snapshot), accountId: 'account.other' },
    sourceSlotId: 'slot-1', accountRevision: 2 }), /session control/i);
  assert.throws(() => createNativeSelectedSession({ snapshot: { ...snapshot, snapshotVersion: 'lineage.save_snapshot.v2' },
    control: control(snapshot), sourceSlotId: 'slot-1', accountRevision: 2 }), /new campaign/i);
});

test('cross-slot native Save refuses an unobserved destination before consulting the owner', async () => {
  const snapshot = hunter();
  const session = createNativeSelectedSession({ snapshot, control: control(snapshot),
    sourceSlotId: 'slot-1', accountRevision: 2 });
  const result = await saveNativeSelectedSession(null, session, 'slot-2');
  assert.equal(result.status, 'blocked');
  assert.equal(result.requiresReload, false);
  assert.strictEqual(result.session, session);
  assert.match(result.message, /observed destination address/);
});
