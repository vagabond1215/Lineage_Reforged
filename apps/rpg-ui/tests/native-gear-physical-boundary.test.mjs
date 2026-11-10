import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { createGearOwner, grantGear } from '../../../packages/engines/game-engine/src/gear-instance-owner.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const {
  CANDIDATE_NATIVE_GEAR_SNAPSHOT_VERSION,
  validateNativeGearPhysicalBoundary
} = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-gear-physical-boundary.ts');

const records = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8').replace(/^\uFEFF/, '')).records;
const fits = records('../../../packages/content/base/items/equipment_fit_profiles.json');
const items = records('../../../packages/content/base/items/items.json');

function candidate() {
  const inventory = {
    bags: [{ id: 'bag.satchel', label: 'Satchel', slotCapacity: 3, stacks: [
      { itemId: 'item.traveler_ration', itemKey: 'traveler_ration', quantity: 300 }
    ] }],
    overflow: []
  };
  const capacities = [{ bagId: 'bag.satchel', slotCapacity: 3, fungibleSlots: 1 }];
  let gear = createGearOwner();
  for (const [requestId, durability, location] of [
    ['bow.worn', 0.91, { kind: 'worn', slotId: 'slot.equipment.weapon.right' }],
    ['bow.bag', 0.43, { kind: 'bag', bagId: 'bag.satchel' }]
  ]) {
    const result = grantGear(gear, {
      requestId, expectedRevision: gear.revision, itemId: 'item.composite_bow',
      itemKey: 'composite_bow', durability, location
    }, fits, capacities);
    assert.equal(result.status, 'accepted');
    gear = result.state;
  }
  return {
    snapshotVersion: CANDIDATE_NATIVE_GEAR_SNAPSHOT_VERSION,
    playerState: { gear, inventory },
    sessionState: { flags: [] }
  };
}

const check = value => validateNativeGearPhysicalBoundary(value, fits, items);

test('candidate native physical state retains distinct bow identity and condition beside 300 fungible rations', () => {
  const value = candidate();
  assert.deepEqual(check(value), { ok: true });
  const roundTrip = JSON.parse(JSON.stringify(value));
  assert.deepEqual(check(roundTrip), { ok: true });
  assert.deepEqual(roundTrip.playerState.gear.instances.map(item => item.durability), [0.91, 0.43]);
  assert.equal(new Set(roundTrip.playerState.gear.instances.map(item => item.itemInstanceId)).size, 2);
  assert.equal(roundTrip.playerState.inventory.bags[0].stacks[0].quantity, 300);
});

test('obsolete development format, parallel equipment map and old stash flags are rejected without mutation', () => {
  const obsolete = candidate();
  obsolete.snapshotVersion = 'lineage.save_snapshot.v2';
  const oldBytes = JSON.stringify(obsolete);
  assert.match(check(obsolete).reason, /incompatible.*start a new campaign/i);
  assert.equal(JSON.stringify(obsolete), oldBytes);

  const parallel = candidate();
  parallel.playerState.equipment = { 'slot.weapon.right': null };
  assert.match(check(parallel).reason, /parallel equipment/i);

  const stashed = candidate();
  stashed.sessionState.flags.push('ui.character.item-stash.item.composite_bow.example');
  assert.match(check(stashed).reason, /stash/i);
});

test('durable stacks, invalid fungible quantities and unknown item metadata are rejected', () => {
  const durableStack = candidate();
  durableStack.playerState.inventory.bags[0].stacks.push({ itemId: 'item.short_bow', itemKey: 'short_bow', quantity: 1 });
  assert.match(check(durableStack).reason, /fungible/i);

  const badQuantity = candidate();
  badQuantity.playerState.inventory.overflow.push({ itemId: 'item.traveler_ration', itemKey: 'traveler_ration', quantity: 0 });
  assert.match(check(badQuantity).reason, /quantity/i);

  const unknown = candidate();
  unknown.playerState.inventory.bags[0].stacks[0].itemId = 'item.not_authored';
  assert.match(check(unknown).reason, /canonical/i);
});

test('a mistaken fit profile cannot turn a fungible item into an equipment instance', () => {
  const mistaken = candidate();
  mistaken.playerState.gear.instances[0].itemId = 'item.traveler_ration';
  mistaken.playerState.gear.instances[0].itemKey = 'traveler_ration';
  const wrongFits = [...fits, {
    itemId: 'item.traveler_ration', itemKey: 'traveler_ration',
    slots: ['slot.equipment.weapon.right']
  }];
  assert.match(validateNativeGearPhysicalBoundary(mistaken, wrongFits, items).reason, /canonical durable/i);
});

test('duplicate bags, full bags and corrupt graph locations fail the same admission boundary', () => {
  const duplicateBag = candidate();
  duplicateBag.playerState.inventory.bags.push(structuredClone(duplicateBag.playerState.inventory.bags[0]));
  assert.match(check(duplicateBag).reason, /bag/i);

  const fullBag = candidate();
  fullBag.playerState.inventory.bags[0].slotCapacity = 1;
  assert.equal(check(fullBag).ok, false);

  const duplicateInstance = candidate();
  duplicateInstance.playerState.gear.instances[1].itemInstanceId = duplicateInstance.playerState.gear.instances[0].itemInstanceId;
  assert.match(check(duplicateInstance).reason, /identity/i);
});
