import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createGearOwner,
  grantGear,
  moveGear,
  getWornGear,
  deriveGearBagCapacities,
  validateGearFits,
  validateGearOwner,
  readGearOwner
} from '../../packages/engines/game-engine/src/gear-instance-owner.ts';
import { GEAR_SLOT_IDS } from '../../packages/engines/game-engine/src/gear-instance-owner.ts';

const RIGHT = 'slot.equipment.weapon.right';
const CHEST = 'slot.clothing.chest';
const ARMOR = 'slot.equipment.armor.chest';
function catalog(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8').replace(/^\uFEFF/, '')).records;
}
const fits = catalog('../../packages/content/base/items/equipment_fit_profiles.json');
const items = catalog('../../packages/content/base/items/items.json');
const bags = [{ bagId: 'satchel', slotCapacity: 2, fungibleSlots: 1 }];

test('all seven creator bundles and choices have explicit durable-gear or fungible ownership', () => {
  const bundles = catalog('../../packages/content/base/player/starting_bundles.json');
  assert.equal(bundles.length, 7);
  const byId = new Map(items.map(item => [item.id, item]));
  const fitted = new Set(fits.map(fit => fit.itemId));
  for (const bundle of bundles) {
    const grants = [...bundle.fixedItems, ...(bundle.choiceGroups ?? []).flatMap(group => group.options)];
    for (const grant of grants) {
      const item = byId.get(grant.itemId);
      assert.ok(item, `${bundle.id} has a canonical ${grant.itemId}`);
      assert.ok(Number.isSafeInteger(grant.quantity) && grant.quantity > 0);
      if (['weapon', 'armor', 'clothing', 'accessory', 'tool'].includes(item.itemClass)) {
        assert.ok(fitted.has(grant.itemId), `${bundle.id} needs an authored durable profile for ${grant.itemId}`);
      } else {
        assert.ok(['commodity', 'consumable', 'quest'].includes(item.itemClass), `${grant.itemId} has an unclassified owner`);
      }
    }
  }
});

test('every item accepted by the current equipment eligibility policy has an explicit native fit', () => {
  const fitted = new Set(fits.map(fit => fit.itemId));
  const explicit = new Set(['item.leather_light_armor', 'item.compass', 'item.butcher_knife', 'item.skinning_knife']);
  const supported = items.filter(item =>
    explicit.has(item.id) || item.itemClass === 'weapon' ||
    (item.itemClass === 'armor' && item.itemBranch === 'shield') ||
    (item.itemClass === 'clothing' && ['torso', 'outerwear', 'wear'].includes(item.itemSubBranch)) ||
    (item.itemClass === 'tool' && item.useProfiles?.some(profile =>
      profile.handlingType === 'weapon' && profile.actionType.startsWith('combat.melee.')
    ))
  );
  assert.equal(supported.length, 50);
  for (const item of supported) assert.ok(fitted.has(item.id), `${item.id} needs authored native fit`);
});

test('every starter bundle choice grants distinct durable units without turning stack cargo into instances', () => {
  const bundles = catalog('../../packages/content/base/player/starting_bundles.json');
  const byId = new Map(items.map(item => [item.id, item]));
  const byFit = new Map(fits.map(fit => [fit.itemId, fit]));
  let variants = 0;
  for (const bundle of bundles) {
    const options = bundle.choiceGroups?.[0]?.options ?? [null];
    for (const option of options) {
      variants += 1;
      const grants = [...bundle.fixedItems, ...(option ? [option] : [])];
      const stackCount = grants.filter(grant => !byFit.has(grant.itemId)).length;
      const capacities = [{ bagId: 'starter', slotCapacity: 20, fungibleSlots: stackCount }];
      let state = createGearOwner();
      for (const grant of grants) {
        const fit = byFit.get(grant.itemId);
        if (!fit) {
          assert.ok(['commodity', 'consumable', 'quest'].includes(byId.get(grant.itemId)?.itemClass));
          continue;
        }
        for (let unit = 0; unit < grant.quantity; unit += 1) {
          const freeSlot = fit.slots.find(slot => !getWornGear(state).some(item => item.location.slotId === slot));
          const result = grantGear(state, {
            requestId: `${bundle.id}.${option?.itemId ?? 'fixed'}.${grant.itemId}.${unit}`,
            expectedRevision: state.revision,
            itemId: grant.itemId,
            itemKey: byId.get(grant.itemId).itemKey,
            durability: 1,
            location: freeSlot ? { kind: 'worn', slotId: freeSlot } : { kind: 'bag', bagId: 'starter' }
          }, fits, capacities);
          assert.equal(result.status, 'accepted', `${bundle.id}: ${result.reason}`);
          state = result.state;
        }
      }
      assert.equal(new Set(state.instances.map(item => item.itemInstanceId)).size, state.instances.length);
      assert.equal(validateGearOwner(state, fits, capacities).ok, true);
      assert.deepEqual(readGearOwner(JSON.stringify(state), fits, capacities), state);
    }
  }
  assert.equal(variants, 10);
});

test('carried-only durable tools cannot be equipped by an unproven slot rule', () => {
  const carried = grantGear(createGearOwner(), {
    requestId: 'grant-awl', expectedRevision: 0, itemId: 'item.awl', itemKey: 'awl', durability: 0.71,
    location: { kind: 'bag', bagId: 'satchel' }
  }, fits, bags);
  assert.equal(carried.status, 'accepted');
  const before = JSON.stringify(carried.state);
  const rejected = moveGear(carried.state, {
    requestId: 'equip-awl', expectedRevision: carried.state.revision,
    itemInstanceId: carried.state.instances[0].itemInstanceId,
    destination: { kind: 'worn', slotId: RIGHT }
  }, fits, bags);
  assert.equal(rejected.status, 'invalid');
  assert.equal(JSON.stringify(rejected.state), before);
});

test('initial fit profiles refer to unique canonical items and native slots', () => {
  assert.equal(validateGearFits(fits), true);
  const byId = new Map(items.map(item => [item.id, item]));
  assert.equal(new Set(fits.map(fit => fit.itemId)).size, fits.length);
  for (const fit of fits) {
    assert.equal(byId.get(fit.itemId)?.itemKey, fit.itemKey);
    assert.ok(Array.isArray(fit.slots));
    assert.ok(fit.slots.every(slot => slot.startsWith('slot.') && !['slot.weapon.right', 'slot.armor.chest'].includes(slot)));
  }
  assert.ok(GEAR_SLOT_IDS.includes('slot.equipment.back'));
  assert.ok(GEAR_SLOT_IDS.includes('slot.accessory.ear.left'));
  assert.ok(GEAR_SLOT_IDS.includes('slot.accessory.ear.right'));
  assert.ok(GEAR_SLOT_IDS.includes('slot.accessory.eye.left'));
  assert.ok(GEAR_SLOT_IDS.includes('slot.accessory.eye.right'));
  assert.equal(GEAR_SLOT_IDS.filter(slot => slot.startsWith('slot.accessory.ring.')).length, 10);
});

function grant(state, itemKey, durability, location, requestId) {
  const result = grantGear(state, {
    requestId,
    expectedRevision: state.revision,
    itemId: `item.${itemKey}`,
    itemKey,
    durability,
    location
  }, fits, bags);
  assert.equal(result.status, 'accepted');
  return result.state;
}

test('two same-type bows retain separate identities and durability through displacement, overflow, and JSON restart', () => {
  let state = createGearOwner();
  state = grant(state, 'composite_bow', 0.37, { kind: 'worn', slotId: RIGHT }, 'starter-1');
  state = grant(state, 'composite_bow', 0.91, { kind: 'bag', bagId: 'satchel' }, 'starter-2');
  const [worn, carried] = state.instances;
  assert.notEqual(worn.itemInstanceId, carried.itemInstanceId);

  const changed = moveGear(state, {
    requestId: 'equip-second', expectedRevision: state.revision,
    itemInstanceId: carried.itemInstanceId, destination: { kind: 'worn', slotId: RIGHT }
  }, fits, bags);
  assert.equal(changed.status, 'accepted');
  assert.deepEqual(getWornGear(changed.state).map(item => item.itemInstanceId), [carried.itemInstanceId]);
  assert.deepEqual(changed.state.instances.map(item => [item.itemInstanceId, item.durability, item.location]), [
    [worn.itemInstanceId, 0.37, { kind: 'bag', bagId: 'satchel' }],
    [carried.itemInstanceId, 0.91, { kind: 'worn', slotId: RIGHT }]
  ]);
  assert.equal(moveGear(changed.state, {
    requestId: 'equip-second', expectedRevision: state.revision,
    itemInstanceId: carried.itemInstanceId, destination: { kind: 'worn', slotId: RIGHT }
  }, fits, bags).status, 'duplicate');
  assert.equal(moveGear(changed.state, {
    requestId: 'equip-second', expectedRevision: changed.state.revision,
    itemInstanceId: worn.itemInstanceId, destination: { kind: 'worn', slotId: RIGHT }
  }, fits, bags).status, 'invalid');

  const afterRestart = readGearOwner(JSON.stringify(changed.state), fits, bags);
  assert.deepEqual(afterRestart, changed.state);
  const moved = moveGear(afterRestart, {
    requestId: 'unequip-second', expectedRevision: afterRestart.revision,
    itemInstanceId: carried.itemInstanceId, destination: { kind: 'carried' }
  }, fits, bags);
  assert.equal(moved.status, 'accepted');
  assert.deepEqual(moved.state.instances.find(item => item.itemInstanceId === carried.itemInstanceId)?.location, { kind: 'overflow' });
  assert.equal(validateGearOwner(moved.state, fits, bags).ok, true);
});

test('clothing and armor occupy independent real positions and stale or unsupported moves do not mutate', () => {
  let state = createGearOwner();
  state = grant(state, 'casual_tunic', 1, { kind: 'worn', slotId: CHEST }, 'tunic');
  state = grant(state, 'leather_light_armor', 0.62, { kind: 'worn', slotId: ARMOR }, 'armor');
  assert.equal(state.instances.filter(item => item.location.kind === 'worn').length, 2);
  const before = JSON.stringify(state);
  const stale = moveGear(state, {
    requestId: 'stale', expectedRevision: state.revision - 1,
    itemInstanceId: state.instances[0].itemInstanceId, destination: { kind: 'carried' }
  }, fits, bags);
  assert.equal(stale.status, 'stale');
  const invalid = moveGear(state, {
    requestId: 'invalid', expectedRevision: state.revision,
    itemInstanceId: state.instances[0].itemInstanceId, destination: { kind: 'worn', slotId: RIGHT }
  }, fits, bags);
  assert.equal(invalid.status, 'invalid');
  assert.equal(JSON.stringify(state), before);
  assert.equal(invalid.state, state);
});

test('malformed identities, duplicate slots, bad condition and overfull bags are rejected', () => {
  let state = grant(createGearOwner(), 'short_bow', 0.8, { kind: 'worn', slotId: RIGHT }, 'one');
  const duplicateId = structuredClone(state);
  duplicateId.instances.push({ ...duplicateId.instances[0] });
  assert.equal(validateGearOwner(duplicateId, fits, bags).ok, false);
  const duplicateSlot = structuredClone(state);
  duplicateSlot.instances.push({ ...duplicateSlot.instances[0], itemInstanceId: 'gear.unique-second' });
  assert.equal(validateGearOwner(duplicateSlot, fits, bags).ok, false);
  const badCondition = structuredClone(state);
  badCondition.instances[0].durability = 2;
  assert.equal(validateGearOwner(badCondition, fits, bags).ok, false);
  const falseRevision = structuredClone(state);
  falseRevision.revision += 1;
  assert.equal(validateGearOwner(falseRevision, fits, bags).ok, false);
  const secondLocation = structuredClone(state);
  secondLocation.instances[0].secondaryLocation = { kind: 'overflow' };
  assert.equal(validateGearOwner(secondLocation, fits, bags).ok, false);
  const overfull = structuredClone(state);
  overfull.instances[0].location = { kind: 'bag', bagId: 'satchel' };
  overfull.instances.push({ ...overfull.instances[0], itemInstanceId: 'gear.unique-second' });
  assert.equal(validateGearOwner(overfull, fits, bags).ok, false);
  assert.throws(() => readGearOwner(JSON.stringify({ ...state, version: 0 }), fits, bags), /incompatible/i);
});

test('bag capacity and fungible occupancy are conserved without minting one instance per commodity', () => {
  let state = grant(createGearOwner(), 'arming_sword', 0.6, { kind: 'worn', slotId: RIGHT }, 'sword');
  const bulkInventory = { bags: [{ id: 'satchel', slotCapacity: 1, stacks: [{ itemId: 'item.ration_bundle', itemKey: 'ration_bundle', quantity: 300 }] }] };
  assert.deepEqual(deriveGearBagCapacities(bulkInventory), [{ bagId: 'satchel', slotCapacity: 1, fungibleSlots: 1 }]);
  const denied = grantGear(state, {
    requestId: 'unsupported', expectedRevision: state.revision,
    itemId: 'item.ration_bundle', itemKey: 'ration_bundle', durability: 1,
    location: { kind: 'bag', bagId: 'satchel' }
  }, fits, bags);
  assert.equal(denied.status, 'invalid');
  assert.equal(denied.state, state);
  const fullBags = deriveGearBagCapacities(bulkInventory);
  const moved = moveGear(state, {
    requestId: 'unequip', expectedRevision: state.revision,
    itemInstanceId: state.instances[0].itemInstanceId, destination: { kind: 'carried' }
  }, fits, fullBags);
  assert.equal(moved.status, 'accepted');
  assert.deepEqual(moved.state.instances[0].location, { kind: 'overflow' });
  assert.equal(moved.state.instances.length, 1);
});
