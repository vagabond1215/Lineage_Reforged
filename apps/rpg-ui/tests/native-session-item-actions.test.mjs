import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';
import { getDefaultWorldSelection } from '../src/game-shell/worldSelectionCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createCampaignSessionControl } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-session.ts');
const { projectNativeEffectiveWorn } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-effective-worn.ts');
const { readNativeFreshSaveSnapshot } = await vite.ssrLoadModule('/src/game-shell/saveManager.ts');
const { fingerprintNativeInventory } = await vite.ssrLoadModule('/src/game-shell/nativeFungibleActions.ts');
const { admitNativeGearSessionAction, admitNativeFungibleSessionAction } =
  await vite.ssrLoadModule('/src/game-shell/nativeSessionItemActions.ts');

function created() {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  const snapshot = createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Native Session Auditor',
    hairColorId: identity.hairColorOptions[0].id,
    eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id,
    backstoryId: 'backstory.local', continentId: world.continentId,
    regionId: world.regionId, startingSettlementId: world.settlementId,
    startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, 'account.native.session.qa');
  const control = createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.native.session.qa',
    publicationId: 'publication.native.session.qa', artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: 'artifact.native.session.qa', headRevision: 1 });
  return { snapshot, control };
}

test('real native creator gear move is admitted once by the campaign session and survives snapshot readback', async () => {
  const { snapshot, control } = created();
  const bow = snapshot.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
  assert.ok(bow);
  const request = { requestId: 'native.session.gear.1', expectedRevision: snapshot.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } };
  const moved = admitNativeGearSessionAction(snapshot, control, request);
  assert.equal(moved.status, 'accepted');
  assert.equal(moved.control.hasUnpublishedGameplayState, true);
  assert.equal(moved.control.retainedMutationResults.length, 1);
  assert.equal(moved.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId)
    .location.kind, 'bag');
  assert.equal(projectNativeEffectiveWorn(moved.snapshot).mainHandItemId, null);
  assert.equal(moved.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId)
    .durability, bow.durability);
  assert.deepEqual((await readNativeFreshSaveSnapshot(JSON.stringify(moved.snapshot))).playerState.gear,
    moved.snapshot.playerState.gear);
  const retry = admitNativeGearSessionAction(moved.snapshot, moved.control, request);
  assert.equal(retry.status, 'duplicate');
  assert.strictEqual(retry.snapshot, moved.snapshot);
  assert.strictEqual(retry.control, moved.control);
  const stale = admitNativeGearSessionAction(moved.snapshot, moved.control,
    { ...request, requestId: 'native.session.gear.stale' });
  assert.equal(stale.status, 'stale');
  assert.strictEqual(stale.snapshot, moved.snapshot);
  assert.strictEqual(stale.control, moved.control);
});

test('native item bridge rejects foreign session and obsolete snapshot before mutation', () => {
  const { snapshot, control } = created();
  const bow = snapshot.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
  assert.ok(bow);
  const request = { requestId: 'native.session.foreign', expectedRevision: snapshot.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } };
  const original = JSON.stringify(snapshot);
  const foreign = { ...control, accountId: 'account.foreign' };
  const rejected = admitNativeGearSessionAction(snapshot, foreign, request);
  assert.equal(rejected.status, 'invalid');
  assert.strictEqual(rejected.snapshot, snapshot);
  assert.strictEqual(rejected.control, foreign);
  const obsolete = { ...snapshot, snapshotVersion: 'lineage.save_snapshot.v2' };
  assert.equal(admitNativeGearSessionAction(obsolete, control, request).status, 'invalid');
  assert.equal(JSON.stringify(snapshot), original);
});

test('native fungible Use admits one exact stack and rejects changed, duplicate and stale requests', async () => {
  const { snapshot, control } = created();
  const source = structuredClone(snapshot);
  const bag = source.playerState.inventory.bags[0];
  bag.stacks.push({ itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2 });
  const request = { requestId: 'native.session.use.1',
    expectedRevision: source.nativeInventoryUse.revision,
    expectedInventoryFingerprint: fingerprintNativeInventory(source.playerState.inventory),
    itemId: 'item.bread_loaf', itemKey: 'bread_loaf', expectedQuantity: 2,
    location: { kind: 'bag', bagId: bag.id, stackIndex: bag.stacks.length - 1 } };
  const used = admitNativeFungibleSessionAction(source, control, request);
  assert.equal(used.status, 'accepted');
  assert.equal(used.snapshot.playerState.inventory.bags[0].stacks.at(-1).quantity, 1);
  assert.deepEqual(used.snapshot.playerState.gear, source.playerState.gear);
  assert.equal(used.control.retainedMutationResults.length, 1);
  assert.deepEqual((await readNativeFreshSaveSnapshot(JSON.stringify(used.snapshot))).nativeInventoryUse,
    used.snapshot.nativeInventoryUse);
  const duplicate = admitNativeFungibleSessionAction(used.snapshot, used.control, request);
  assert.equal(duplicate.status, 'duplicate');
  assert.strictEqual(duplicate.control, used.control);
  assert.equal(admitNativeFungibleSessionAction(used.snapshot, used.control,
    { ...request, itemId: 'item.ration_bundle' }).status, 'invalid');
  assert.equal(admitNativeFungibleSessionAction(used.snapshot, used.control,
    { ...request, requestId: 'native.session.use.stale' }).status, 'stale');
});
