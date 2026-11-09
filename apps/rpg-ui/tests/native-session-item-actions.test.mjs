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
const { admitCampaignMutation } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-session.ts');
const { isNativeTargetCampaignSnapshot } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-campaign-rules.ts');
const { projectNativeEffectiveWorn } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-effective-worn.ts');
const { readNativeFreshSaveSnapshot } = await vite.ssrLoadModule('/src/game-shell/saveManager.ts');
const { fingerprintNativeInventory, consumeNativeFungible } = await vite.ssrLoadModule('/src/game-shell/nativeFungibleActions.ts');
const { admitNativeGearSessionAction, admitNativeFungibleSessionAction } =
  await vite.ssrLoadModule('/src/game-shell/nativeSessionItemActions.ts');

function controlFor(snapshot) {
  return createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.native.session.qa',
    publicationId: 'publication.native.session.qa', artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: 'artifact.native.session.qa', headRevision: 1,
    sourceSnapshot: snapshot });
}

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
  const control = controlFor(snapshot);
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
  const mixed = admitCampaignMutation(control, { mutationId: 'native.mixed.v2',
    sourceArtifactId: control.loadedArtifactId, sourceRevision: control.sessionRevision,
    ownerKind: 'engine_result', accepted: true, sourceSnapshot: obsolete,
    proposedSnapshot: obsolete });
  assert.equal(mixed.accepted, false);
  assert.equal(mixed.reason, 'stale_revision');
  assert.equal(control.retainedMutationResults.length, 0);
  assert.equal(JSON.stringify(snapshot), original);
});

test('native fungible Use admits one exact stack and rejects changed, duplicate and stale requests', async () => {
  const { snapshot } = created();
  const source = structuredClone(snapshot);
  const bag = source.playerState.inventory.bags[0];
  bag.stacks.push({ itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2 });
  const control = controlFor(source);
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

test('newer control refuses stale native source across Use then gear and gear then Use', () => {
  const { snapshot } = created();
  const source = structuredClone(snapshot);
  const bag = source.playerState.inventory.bags[0];
  bag.stacks.push({ itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2 });
  const control = controlFor(source);
  const bow = source.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
  assert.ok(bow);
  const use = { requestId: 'native.order.use', expectedRevision: source.nativeInventoryUse.revision,
    expectedInventoryFingerprint: fingerprintNativeInventory(source.playerState.inventory),
    itemId: 'item.bread_loaf', itemKey: 'bread_loaf', expectedQuantity: 2,
    location: { kind: 'bag', bagId: bag.id, stackIndex: bag.stacks.length - 1 } };
  const gear = { requestId: 'native.order.gear', expectedRevision: source.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } };
  const used = admitNativeFungibleSessionAction(source, control, use);
  assert.equal(used.status, 'accepted');
  const staleGear = admitNativeGearSessionAction(source, used.control, gear);
  assert.equal(staleGear.status, 'stale');
  assert.deepEqual(staleGear.snapshot, used.snapshot);
  assert.strictEqual(staleGear.control, used.control);
  assert.equal(staleGear.snapshot.playerState.inventory.bags[0].stacks.at(-1).quantity, 1);

  const moved = admitNativeGearSessionAction(source, control, gear);
  assert.equal(moved.status, 'accepted');
  const staleUse = admitNativeFungibleSessionAction(source, moved.control, use);
  assert.equal(staleUse.status, 'stale');
  assert.deepEqual(staleUse.snapshot, moved.snapshot);
  assert.strictEqual(staleUse.control, moved.control);
  assert.equal(staleUse.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId).location.kind, 'bag');
});

test('central native duplicate after a later accepted mutation retains the latest state', () => {
  const { snapshot } = created();
  const source = structuredClone(snapshot);
  const bag = source.playerState.inventory.bags[0];
  bag.stacks.push({ itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2 });
  const control = controlFor(source);
  const bow = source.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
  assert.ok(bow);
  const use = { requestId: 'native.duplicate.use', expectedRevision: source.nativeInventoryUse.revision,
    expectedInventoryFingerprint: fingerprintNativeInventory(source.playerState.inventory),
    itemId: 'item.bread_loaf', itemKey: 'bread_loaf', expectedQuantity: 2,
    location: { kind: 'bag', bagId: bag.id, stackIndex: bag.stacks.length - 1 } };
  const originalUse = consumeNativeFungible(source, use);
  assert.equal(originalUse.status, 'accepted');
  const used = admitNativeFungibleSessionAction(source, control, use);
  assert.equal(used.status, 'accepted');
  const gear = { requestId: 'native.duplicate.gear', expectedRevision: used.snapshot.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } };
  const moved = admitNativeGearSessionAction(used.snapshot, used.control, gear);
  assert.equal(moved.status, 'accepted');
  const retry = admitCampaignMutation(moved.control, {
    mutationId: `mutation.native.use.${use.requestId}`,
    sourceArtifactId: control.loadedArtifactId, sourceRevision: control.sessionRevision,
    ownerKind: 'engine_result', accepted: true,
    sourceSnapshot: source, proposedSnapshot: originalUse.snapshot,
    validateNativeSnapshot: isNativeTargetCampaignSnapshot
  });
  assert.equal(retry.duplicate, true);
  assert.deepEqual(retry.snapshot, moved.snapshot);
  assert.strictEqual(retry.control, moved.control);
});

test('native admission requires a bound initial source and preserves a non-head fork across ordered actions', async () => {
  const { snapshot } = created();
  const source = structuredClone(snapshot);
  const bag = source.playerState.inventory.bags[0];
  bag.stacks.push({ itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2 });
  const unbound = createCampaignSessionControl({ accountId: source.accountId,
    campaignId: source.campaignIdentity.campaignId, artifactId: 'artifact.native.prior',
    publicationId: 'publication.native.prior', artifactRevision: 1,
    continuityId: source.campaignIdentity.continuityId,
    headArtifactId: 'artifact.native.head', headRevision: 2 });
  const proposed = structuredClone(source);
  proposed.playerState.currency.copper += 1;
  const rejected = admitCampaignMutation(unbound, { mutationId: 'native.unbound',
    sourceArtifactId: unbound.loadedArtifactId, sourceRevision: unbound.sessionRevision,
    ownerKind: 'engine_result', accepted: true, sourceSnapshot: source,
    proposedSnapshot: proposed, validateNativeSnapshot: isNativeTargetCampaignSnapshot });
  assert.equal(rejected.accepted, false);
  assert.equal(rejected.reason, 'stale_revision');
  assert.strictEqual(rejected.control, unbound);
  assert.equal(unbound.retainedMutationResults.length, 0);

  const control = createCampaignSessionControl({ accountId: source.accountId,
    campaignId: source.campaignIdentity.campaignId, artifactId: 'artifact.native.prior',
    publicationId: 'publication.native.prior', artifactRevision: 1,
    continuityId: source.campaignIdentity.continuityId,
    headArtifactId: 'artifact.native.head', headRevision: 2,
    sourceSnapshot: source });
  const bow = source.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
  assert.ok(bow);
  const gear = { requestId: 'native.nonhead.gear', expectedRevision: source.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } };
  const moved = admitNativeGearSessionAction(source, control, gear);
  assert.equal(moved.status, 'accepted');
  assert.equal(moved.control.posture, 'forked_unpublished');
  const forkId = moved.snapshot.campaignIdentity.continuityId;
  assert.notEqual(forkId, source.campaignIdentity.continuityId);
  const use = { requestId: 'native.nonhead.use', expectedRevision: source.nativeInventoryUse.revision,
    expectedInventoryFingerprint: fingerprintNativeInventory(source.playerState.inventory),
    itemId: 'item.bread_loaf', itemKey: 'bread_loaf', expectedQuantity: 2,
    location: { kind: 'bag', bagId: bag.id, stackIndex: bag.stacks.length - 1 } };
  const stale = admitNativeFungibleSessionAction(source, moved.control, use);
  assert.equal(stale.status, 'stale');
  assert.deepEqual(stale.snapshot, moved.snapshot);
  const next = admitNativeFungibleSessionAction(moved.snapshot, moved.control, use);
  assert.equal(next.status, 'accepted');
  assert.equal(next.snapshot.campaignIdentity.continuityId, forkId);
  assert.equal(next.snapshot.playerState.inventory.bags[0].stacks.at(-1).quantity, 1);
  assert.equal(next.snapshot.playerState.gear.instances.find(item =>
    item.itemInstanceId === bow.itemInstanceId).location.kind, 'bag');
  assert.deepEqual((await readNativeFreshSaveSnapshot(JSON.stringify(next.snapshot))).playerState.gear,
    next.snapshot.playerState.gear);
});
