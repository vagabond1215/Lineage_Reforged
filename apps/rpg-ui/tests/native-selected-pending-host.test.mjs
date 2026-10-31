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
const { createNativeSelectedSession } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedSession.ts');
const { publishNativeSelectedPendingDefeat, recoverNativeSelectedPendingDefeat } =
  await vite.ssrLoadModule('/src/game-shell/nativeSelectedPendingDefeat.ts');

function session() {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  const snapshot = createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Pending Hunter',
    hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.local',
    continentId: world.continentId, regionId: world.regionId,
    startingSettlementId: world.settlementId, startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, 'account.native.pending.host');
  const control = createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.native.pending',
    publicationId: 'publication.native.pending', artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: 'artifact.native.pending', headRevision: 1, sourceSnapshot: snapshot });
  return createNativeSelectedSession({ snapshot, control, sourceSlotId: 'slot-1', accountRevision: 2 });
}

test('pending publication and recovery reject a playable or mixed selected source before owner access', async () => {
  const first = session();
  for (const changed of [first,
    { ...first, snapshot: { ...first.snapshot, snapshotVersion: 'lineage.save_snapshot.v2' } },
    { ...first, sourceAddress: { ...first.sourceAddress, publicationId: 'publication.other' } }]) {
    for (const call of [publishNativeSelectedPendingDefeat, recoverNativeSelectedPendingDefeat]) {
      const result = await call(null, changed, 'slot-1');
      assert.equal(result.status, 'blocked');
      assert.equal(result.requiresReload, false);
      assert.strictEqual(result.session, changed);
    }
  }
});

test('pending caller requires an observed destination address for cross-slot publication', async () => {
  const first = session();
  const result = await publishNativeSelectedPendingDefeat(null, first, 'slot-2');
  assert.equal(result.status, 'blocked');
  assert.equal(result.requiresReload, false);
  assert.strictEqual(result.session, first);
});
