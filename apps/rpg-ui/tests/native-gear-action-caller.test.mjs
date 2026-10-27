import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';
import { getDefaultWorldSelection } from '../src/game-shell/worldSelectionCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { moveNativeGear } = await vite.ssrLoadModule('/src/game-shell/nativeCharacterActions.ts');
const { projectNativeEffectiveWorn } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-effective-worn.ts');
const { readNativeFreshSaveSnapshot } = await vite.ssrLoadModule('/src/game-shell/saveManager.ts');

function created() {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  return createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'),
    playerName: 'Native Action Auditor',
    hairColorId: identity.hairColorOptions[0].id,
    eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id,
    backstoryId: 'backstory.local',
    continentId: world.continentId,
    regionId: world.regionId,
    startingSettlementId: world.settlementId,
    startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, 'account.native.actions');
}

test('instance-ID native caller preserves condition, identity and quantity through equip/unequip, duplicate and stale actions', async () => {
  const original = created();
  const bow = original.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
  assert.ok(bow);
  const first = moveNativeGear(original, { requestId: 'move.1', expectedRevision: original.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } });
  assert.equal(first.status, 'accepted');
  assert.notEqual(first.snapshot, original);
  assert.equal(original.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId).location.kind, 'worn');
  const carried = first.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId);
  assert.equal(carried.location.kind, 'bag');
  assert.equal(carried.durability, bow.durability);
  assert.equal(moveNativeGear(first.snapshot, { requestId: 'move.1', expectedRevision: original.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } }).status, 'duplicate');
  assert.equal(moveNativeGear(first.snapshot, { requestId: 'move.1', expectedRevision: first.snapshot.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'worn', slotId: 'slot.equipment.weapon.right' } }).status, 'invalid');
  assert.equal(moveNativeGear(first.snapshot, { requestId: 'stale.1', expectedRevision: original.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'worn', slotId: 'slot.equipment.weapon.right' } }).status, 'stale');
  const second = moveNativeGear(first.snapshot, { requestId: 'move.2', expectedRevision: first.snapshot.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'worn', slotId: 'slot.equipment.weapon.right' } });
  assert.equal(second.status, 'accepted');
  assert.equal(second.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId).location.slotId,
    'slot.equipment.weapon.right');
  assert.deepEqual(second.snapshot.playerState.inventory, original.playerState.inventory);
  assert.deepEqual(second.snapshot.playerState.gear.instances.map(item => [item.itemInstanceId, item.itemId, item.durability]),
    original.playerState.gear.instances.map(item => [item.itemInstanceId, item.itemId, item.durability]));
  assert.equal(moveNativeGear(second.snapshot, { requestId: 'noop.1', expectedRevision: second.snapshot.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'worn', slotId: 'slot.equipment.weapon.right' } }).status, 'noop');
  assert.equal(second.snapshot.playerState.gear.revision, original.playerState.gear.revision + 2);
  const restarted = await readNativeFreshSaveSnapshot(JSON.stringify(second.snapshot));
  assert.deepEqual(restarted.playerState.gear, second.snapshot.playerState.gear);
});

test('occupied native slot displaces exactly one instance and full bags send unequipped gear to overflow', async () => {
  const original = created();
  const bow = original.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
  const knife = original.playerState.gear.instances.find(item => item.itemId === 'item.skinning_knife');
  assert.ok(bow && knife);
  assert.equal(knife.location.kind, 'bag');
  const full = structuredClone(original);
  const bag = full.playerState.inventory.bags[0];
  const ration = bag.stacks.find(stack => stack.itemId === 'item.ration_bundle');
  assert.ok(ration);
  while (bag.stacks.length < bag.slotCapacity - 1) bag.stacks.push({ ...ration, quantity: 1 });
  assert.equal(bag.stacks.length + 1, bag.slotCapacity);
  const equipped = moveNativeGear(full, { requestId: 'displace.1', expectedRevision: full.playerState.gear.revision,
    itemInstanceId: knife.itemInstanceId, destination: { kind: 'worn', slotId: 'slot.equipment.weapon.right' } });
  assert.equal(equipped.status, 'accepted');
  assert.deepEqual(equipped.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId).location,
    { kind: 'bag', bagId: knife.location.bagId });
  const unequipped = moveNativeGear(equipped.snapshot, { requestId: 'displace.2',
    expectedRevision: equipped.snapshot.playerState.gear.revision, itemInstanceId: knife.itemInstanceId,
    destination: { kind: 'carried' } });
  assert.equal(unequipped.status, 'accepted');
  assert.deepEqual(unequipped.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === knife.itemInstanceId).location,
    { kind: 'overflow' });
  assert.deepEqual(unequipped.snapshot.playerState.gear.instances.map(item => [item.itemInstanceId, item.durability]),
    original.playerState.gear.instances.map(item => [item.itemInstanceId, item.durability]));
  assert.equal(moveNativeGear(unequipped.snapshot, { requestId: 'displace.3',
    expectedRevision: unequipped.snapshot.playerState.gear.revision, itemInstanceId: knife.itemInstanceId,
    destination: { kind: 'worn', slotId: 'slot.accessory.ear.left' } }).status, 'invalid');
  assert.equal(moveNativeGear(unequipped.snapshot, { requestId: 'displace.4',
    expectedRevision: unequipped.snapshot.playerState.gear.revision, itemInstanceId: 'missing',
    destination: { kind: 'carried' } }).status, 'invalid');
  const readback = await readNativeFreshSaveSnapshot(JSON.stringify(unequipped.snapshot));
  assert.deepEqual(readback.playerState.gear, unequipped.snapshot.playerState.gear);
});

test('malformed native action input fails closed without mutating the admitted graph', () => {
  const original = created();
  const before = JSON.stringify(original);
  assert.equal(moveNativeGear(original, { requestId: 'bad.1', expectedRevision: original.playerState.gear.revision,
    itemInstanceId: original.playerState.gear.instances[0].itemInstanceId, destination: null }).status, 'invalid');
  assert.equal(moveNativeGear(original, null).status, 'invalid');
  assert.equal(JSON.stringify(original), before);
});

test('one native worn projection changes combat and Character facts after physical moves', () => {
  const original = created();
  const bow = original.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
  const worn = projectNativeEffectiveWorn(original);
  assert.equal(worn.mainHandItemId, 'item.short_bow');
  assert.equal(worn.items.some(item => item.itemInstanceId === bow.itemInstanceId), true);
  assert.deepEqual(worn.combatItemIds, worn.items.map(item => item.itemId));
  assert.deepEqual(worn.resourceModifiers, []);
  const carried = moveNativeGear(original, { requestId: 'projection.1', expectedRevision: original.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } });
  assert.equal(carried.status, 'accepted');
  const after = projectNativeEffectiveWorn(carried.snapshot);
  assert.equal(after.mainHandItemId, null);
  assert.equal(after.items.some(item => item.itemInstanceId === bow.itemInstanceId), false);
  assert.equal(after.combatItemIds.includes('item.short_bow'), false);
  assert.deepEqual(after.resourceModifiers, []);
  assert.equal(projectNativeEffectiveWorn(original).mainHandItemId, 'item.short_bow');
});
