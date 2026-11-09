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
const { retireNativeSelectedSession, resumeNativeSelectedTerminal } =
  await vite.ssrLoadModule('/src/game-shell/nativeSelectedTerminal.ts');

function session() {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  const snapshot = createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Terminal Hunter',
    hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.local',
    continentId: world.continentId, regionId: world.regionId,
    startingSettlementId: world.settlementId, startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, 'account.native.terminal.host');
  const control = createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.native.terminal',
    publicationId: 'publication.native.terminal', artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: 'artifact.native.terminal', headRevision: 1, sourceSnapshot: snapshot });
  return createNativeSelectedSession({ snapshot, control, sourceSlotId: 'slot-1', accountRevision: 2 });
}

test('terminal host rejects a mixed-format or mismatched selected pair before owner access', async () => {
  const first = session();
  for (const changed of [
    { ...first, snapshot: { ...first.snapshot, snapshotVersion: 'lineage.save_snapshot.v2' } },
    { ...first, sourceAddress: { ...first.sourceAddress, publicationId: 'publication.other' } }
  ]) {
    const result = await retireNativeSelectedSession(null, changed);
    assert.equal(result.status, 'blocked');
    assert.equal(result.requiresReload, false);
    assert.strictEqual(result.session, changed);
  }
});

test('terminal resume cannot settle a different pending source or an absent receipt', async () => {
  const first = session();
  let reads = 0;
  const owner = { readPendingTerminalForAccount: async () => {
    reads += 1;
    return { accountId: first.snapshot.accountId,
      campaignId: first.control.campaignId, sourceArtifactId: first.sourceAddress.artifactId,
      sourcePublicationId: 'publication.other', slotId: first.sourceSlotId,
      expectedAccountRevision: first.accountRevision };
  } };
  const mismatch = await resumeNativeSelectedTerminal(owner, first);
  assert.equal(mismatch.status, 'blocked');
  assert.equal(reads, 1);
  assert.strictEqual(mismatch.session, first);
  const absent = await resumeNativeSelectedTerminal({ readPendingTerminalForAccount: async () => null }, first);
  assert.equal(absent.status, 'blocked');
  assert.strictEqual(absent.session, first);
});
