import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { deserializeSnapshot, serializeSnapshot } from '../../../packages/shared/persistence/src/index.ts';
import itemCatalog from '../../../packages/content/base/items/items.json' with { type: 'json' };

async function withCharacterState(run) {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ demoSnapshot }, state] = await Promise.all([
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts'),
      vite.ssrLoadModule('/src/features/characterPanelState.ts')
    ]);
    await run(structuredClone(demoSnapshot), state);
  } finally {
    await vite.close();
  }
}

function countItem(snapshot, itemId) {
  return Object.values(snapshot.playerState.equipment).filter((item) => item?.itemId === itemId)
    .reduce((sum, item) => sum + item.quantity, 0)
    + snapshot.playerState.inventory.bags.flatMap((bag) => bag.stacks)
      .concat(snapshot.playerState.inventory.overflow)
      .filter((stack) => stack.itemId === itemId)
      .reduce((sum, stack) => sum + stack.quantity, 0);
}

function equipmentEntry(snapshot, state, slotId = 'slot.weapon.right') {
  return state.buildEquipmentEntries(snapshot).find((entry) => entry.slotId === slotId);
}

function inventoryEntry(snapshot, state, itemId) {
  return state.buildInventoryEntries(snapshot).find((entry) => entry.itemId === itemId);
}

test('Composite Bow can be unequipped and re-equipped without losing its state', async () => {
  await withCharacterState((original, state) => {
    const bow = original.playerState.equipment['slot.weapon.right'];
    assert.equal(bow?.itemId, 'item.composite_bow');

    const unequipped = state.unequipItem(original, equipmentEntry(original, state));
    const selected = inventoryEntry(unequipped.snapshot, state, 'item.composite_bow');
    assert.equal(selected?.preferredSlotId, 'slot.weapon.right');

    const reequipped = state.equipInventoryItem(unequipped.snapshot, selected);
    assert.deepEqual(reequipped.snapshot.playerState.equipment['slot.weapon.right'], bow);
    assert.deepEqual(reequipped.snapshot.playerState.inventory, original.playerState.inventory);
    assert.deepEqual(deserializeSnapshot(serializeSnapshot(reequipped.snapshot)).playerState.equipment['slot.weapon.right'], bow);
  });
});

test('Short Bow and Arming Sword round trips conserve source, quantity and durability', async () => {
  await withCharacterState((base, state) => {
    for (const [itemId, itemKey] of [['item.short_bow', 'short_bow'], ['item.arming_sword', 'arming_sword']]) {
      const snapshot = structuredClone(base);
      snapshot.playerState.equipment['slot.weapon.right'] = { itemId, itemKey, quantity: 1, durability: 0.47 };
      const originalCount = countItem(snapshot, itemId);
      const unequipped = state.unequipItem(snapshot, equipmentEntry(snapshot, state));
      const selected = inventoryEntry(unequipped.snapshot, state, itemId);
      assert.equal(selected?.preferredSlotId, 'slot.weapon.right');
      const reequipped = state.equipInventoryItem(unequipped.snapshot, selected);
      assert.deepEqual(reequipped.snapshot.playerState.equipment['slot.weapon.right'], snapshot.playerState.equipment['slot.weapon.right']);
      assert.equal(countItem(reequipped.snapshot, itemId), originalCount);
      assert.equal(countItem(deserializeSnapshot(serializeSnapshot(reequipped.snapshot)), itemId), originalCount);
    }
  });
});

test('occupied slot and overflow preserve displaced items and quantities', async () => {
  await withCharacterState((snapshot, state) => {
    snapshot.playerState.equipment['slot.weapon.right'] = {
      itemId: 'item.short_bow', itemKey: 'short_bow', quantity: 1, durability: 0.36
    };
    snapshot.playerState.inventory.bags[0].slotCapacity = snapshot.playerState.inventory.bags[0].stacks.length;
    snapshot.playerState.inventory.overflow = [{ itemId: 'item.composite_bow', itemKey: 'composite_bow', quantity: 2 }];
    const beforeBow = countItem(snapshot, 'item.composite_bow');
    const beforeShort = countItem(snapshot, 'item.short_bow');
    const selected = inventoryEntry(snapshot, state, 'item.composite_bow');
    assert.equal(selected.location, 'overflow');
    const equipped = state.equipInventoryItem(snapshot, selected);
    assert.equal(equipped.snapshot.playerState.equipment['slot.weapon.right']?.itemId, 'item.composite_bow');
    assert.equal(countItem(equipped.snapshot, 'item.composite_bow'), beforeBow);
    assert.equal(countItem(equipped.snapshot, 'item.short_bow'), beforeShort);
    assert.equal(equipped.snapshot.playerState.inventory.overflow.find((stack) => stack.itemId === 'item.short_bow')?.quantity, 1);
    const returned = state.equipInventoryItem(equipped.snapshot, inventoryEntry(equipped.snapshot, state, 'item.short_bow'));
    assert.equal(returned.snapshot.playerState.equipment['slot.weapon.right']?.durability, 0.36);
    assert.equal(countItem(returned.snapshot, 'item.composite_bow'), beforeBow);
    assert.equal(countItem(returned.snapshot, 'item.short_bow'), beforeShort);
  });
});

test('unsupported and stale inventory selections cannot equip or create items', async () => {
  await withCharacterState((snapshot, state) => {
    const unsupported = inventoryEntry(snapshot, state, 'item.arrow_bundle');
    assert.equal(unsupported.preferredSlotId, null);
    const forged = state.equipInventoryItem(snapshot, { ...unsupported, preferredSlotId: 'slot.weapon.right' });
    assert.strictEqual(forged.snapshot, snapshot);
    assert.equal(forged.notice.tone, 'warning');

    snapshot.playerState.inventory.bags[0].stacks.push({ itemId: 'item.short_bow', itemKey: 'short_bow', quantity: 1 });
    const stale = inventoryEntry(snapshot, state, 'item.short_bow');
    snapshot.playerState.inventory.bags[0].stacks[stale.stackIndex] = { itemId: 'item.arming_sword', itemKey: 'arming_sword', quantity: 1 };
    assert.strictEqual(state.equipInventoryItem(snapshot, stale).snapshot, snapshot);

    const zero = structuredClone(snapshot);
    zero.playerState.inventory.bags[0].stacks[stale.stackIndex] = { itemId: 'item.short_bow', itemKey: 'short_bow', quantity: 0 };
    const zeroEntry = inventoryEntry(zero, state, 'item.short_bow');
    assert.strictEqual(state.equipInventoryItem(zero, zeroEntry).snapshot, zero);

    const changedQuantity = structuredClone(zero);
    changedQuantity.playerState.inventory.bags[0].stacks[stale.stackIndex].quantity = 2;
    assert.strictEqual(state.equipInventoryItem(changedQuantity, zeroEntry).snapshot, changedQuantity);

    const once = state.unequipItem(snapshot, equipmentEntry(snapshot, state));
    assert.strictEqual(state.unequipItem(once.snapshot, equipmentEntry(snapshot, state)).snapshot, once.snapshot);
  });
});

test('TypeScript and Node slot resolvers agree for every canonical item', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ resolveSupportedEquipmentSlot: tsSlot }, { resolveSupportedEquipmentSlot: jsSlot }] = await Promise.all([
      vite.ssrLoadModule('/src/game-shell/equipmentSlotEligibility.ts'),
      vite.ssrLoadModule('/src/game-shell/equipmentSlotEligibility.js')
    ]);
    for (const item of itemCatalog.records) {
      assert.equal(tsSlot(item.id, item.itemKey), jsSlot(item.id, item.itemKey), item.id);
    }
    assert.equal(tsSlot('item.composite_bow', 'composite_bow'), 'slot.weapon.right');
    assert.equal(tsSlot('item.short_bow', 'short_bow'), 'slot.weapon.right');
    assert.equal(tsSlot('item.buckler_shield', 'buckler_shield'), 'slot.weapon.left');
    assert.equal(tsSlot('item.ration_bundle', 'ration_bundle'), null);
    assert.equal(tsSlot('item.composite_bow', 'short_bow'), null);
  } finally {
    await vite.close();
  }
});
