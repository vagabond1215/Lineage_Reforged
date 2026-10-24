import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { deserializeSnapshot, serializeSnapshot } from '../../../packages/shared/persistence/src/index.ts';

const ARROWS = { itemId: 'item.arrow_bundle', itemKey: 'arrow_bundle', quantity: 1 };
const BREAD = { itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 1 };
const BREAST = { itemId: 'item.breast_cut', itemKey: 'breast_cut', quantity: 1 };
const BOW = { itemId: 'item.short_bow', itemKey: 'short_bow', quantity: 1 };

async function withOwner(run) {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const [{ demoSnapshot }, owner] = await Promise.all([
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts'),
      vite.ssrLoadModule('/src/features/characterPanelState.ts')
    ]);
    await run(structuredClone(demoSnapshot), owner);
  } finally {
    await vite.close();
  }
}

function bags(snapshot, firstItem, secondItem, duplicateIds = true) {
  const original = snapshot.playerState.inventory.bags[0];
  snapshot.playerState.inventory.bags = [
    { ...original, stacks: [firstItem] },
    { ...original, id: duplicateIds ? original.id : 'bag.second', label: 'Second Bag', stacks: [secondItem] }
  ];
  return deserializeSnapshot(serializeSnapshot(snapshot));
}

function secondEntry(snapshot, owner, itemId) {
  const entry = owner.buildInventoryEntries(snapshot).find((item) => item.containerIndex === 1 && item.itemId === itemId);
  assert.ok(entry);
  assert.equal(entry.containerId, snapshot.playerState.inventory.bags[1].id);
  return entry;
}

function rejectUnchanged(snapshot, owner, entry, action) {
  const before = structuredClone(snapshot);
  const result = action === 'equip'
    ? owner.equipInventoryItem(snapshot, entry)
    : owner.consumeInventoryItem(snapshot, entry);
  assert.strictEqual(result.snapshot, snapshot);
  assert.equal(result.notice.tone, 'warning');
  assert.deepEqual(snapshot, before);
}

for (const firstItem of [ARROWS, BREAST]) {
  test(`duplicate-ID Equip targets second bag Short Bow, not first-bag ${firstItem.itemKey}`, async () => {
    await withOwner((base, owner) => {
      const snapshot = bags(base, firstItem, BOW);
      const before = structuredClone(snapshot);
      const entry = secondEntry(snapshot, owner, BOW.itemId);
      const result = owner.equipInventoryItem(snapshot, entry);
      assert.equal(result.snapshot.playerState.equipment['slot.weapon.right']?.itemId, BOW.itemId);
      assert.deepEqual(result.snapshot.playerState.inventory.bags[0].stacks.filter((stack) => stack.itemId === firstItem.itemId), [firstItem]);
      assert.equal(result.snapshot.playerState.inventory.bags[1].stacks.some((stack) => stack.itemId === BOW.itemId), false);
      assert.equal(result.snapshot.playerState.inventory.bags.flatMap((bag) => bag.stacks)
        .concat(result.snapshot.playerState.inventory.overflow)
        .filter((stack) => stack.itemId === 'item.composite_bow')
        .reduce((count, stack) => count + stack.quantity, 0), 1);
      assert.deepEqual(snapshot, before);
    });
  });
}

for (const firstItem of [ARROWS, BREAD]) {
  test(`duplicate-ID Consume targets second bag Breast Cut, not first-bag ${firstItem.itemKey}`, async () => {
    await withOwner((base, owner) => {
      const snapshot = bags(base, firstItem, BREAST);
      const before = structuredClone(snapshot);
      const entry = secondEntry(snapshot, owner, BREAST.itemId);
      const result = owner.consumeInventoryItem(snapshot, entry);
      assert.deepEqual(result.snapshot.playerState.inventory.bags[0].stacks, [firstItem]);
      assert.deepEqual(result.snapshot.playerState.inventory.bags[1].stacks, []);
      assert.notDeepEqual(result.snapshot.playerState.bodyState, snapshot.playerState.bodyState);
      assert.deepEqual(result.snapshot.playerState.equipment, snapshot.playerState.equipment);
      assert.deepEqual(snapshot, before);
    });
  });
}

test('unique-ID bags and reversed duplicate-ID ordering retain exact source targeting', async () => {
  await withOwner((base, owner) => {
    for (const duplicateIds of [false, true]) {
      const equipSnapshot = bags(structuredClone(base), ARROWS, BOW, duplicateIds);
      equipSnapshot.playerState.inventory.bags.reverse();
      const bowEntry = owner.buildInventoryEntries(equipSnapshot).find((entry) => entry.containerIndex === 0 && entry.itemId === BOW.itemId);
      const equipped = owner.equipInventoryItem(equipSnapshot, bowEntry);
      assert.equal(equipped.snapshot.playerState.equipment['slot.weapon.right']?.itemId, BOW.itemId);
      assert.equal(equipped.snapshot.playerState.inventory.bags[1].stacks.some((stack) => stack.itemId === ARROWS.itemId), true);

      const useSnapshot = bags(structuredClone(base), ARROWS, BREAST, duplicateIds);
      useSnapshot.playerState.inventory.bags.reverse();
      const breastEntry = owner.buildInventoryEntries(useSnapshot).find((entry) => entry.containerIndex === 0 && entry.itemId === BREAST.itemId);
      const consumed = owner.consumeInventoryItem(useSnapshot, breastEntry);
      assert.equal(consumed.snapshot.playerState.inventory.bags[0].stacks.length, 0);
      assert.deepEqual(consumed.snapshot.playerState.inventory.bags[1].stacks, [ARROWS]);
    }
  });
});

test('stale, missing and invalid bag selections reject without any state change', async () => {
  await withOwner((base, owner) => {
    for (const [action, selectedItem] of [['equip', BOW], ['consume', BREAST]]) {
      const snapshot = bags(structuredClone(base), ARROWS, selectedItem);
      const entry = secondEntry(snapshot, owner, selectedItem.itemId);
      for (const invalid of [
        { ...entry, containerIndex: -1 },
        { ...entry, containerIndex: 3 },
        { ...entry, containerId: 'bag.missing' },
        { ...entry, stackIndex: 9 },
        { ...entry, itemId: ARROWS.itemId },
        { ...entry, itemKey: ARROWS.itemKey },
        { ...entry, quantity: 2 }
      ]) rejectUnchanged(snapshot, owner, invalid, action);

      const reordered = structuredClone(snapshot);
      reordered.playerState.inventory.bags.reverse();
      rejectUnchanged(reordered, owner, entry, action);

      const missingBag = structuredClone(snapshot);
      missingBag.playerState.inventory.bags.pop();
      rejectUnchanged(missingBag, owner, entry, action);

      const missingStack = structuredClone(snapshot);
      missingStack.playerState.inventory.bags[1].stacks = [];
      rejectUnchanged(missingStack, owner, entry, action);

      for (const quantity of [0, 1.5, Number.NaN]) {
        const invalidQuantity = structuredClone(snapshot);
        invalidQuantity.playerState.inventory.bags[1].stacks[0].quantity = quantity;
        rejectUnchanged(invalidQuantity, owner, entry, action);
      }
    }
  });
});

test('multiple and final units remain conserved in the selected bag across SaveSnapshot round trips', async () => {
  await withOwner((base, owner) => {
    const useSnapshot = bags(structuredClone(base), ARROWS, { ...BREAST, quantity: 2 });
    const first = owner.consumeInventoryItem(useSnapshot, secondEntry(useSnapshot, owner, BREAST.itemId));
    assert.equal(first.snapshot.playerState.inventory.bags[1].stacks[0].quantity, 1);
    const loaded = deserializeSnapshot(serializeSnapshot(first.snapshot));
    const second = owner.consumeInventoryItem(loaded, secondEntry(loaded, owner, BREAST.itemId));
    assert.equal(second.snapshot.playerState.inventory.bags[1].stacks.length, 0);
    assert.deepEqual(second.snapshot.playerState.inventory.bags[0].stacks, [ARROWS]);

    const equipSnapshot = bags(structuredClone(base), ARROWS, { ...BOW, quantity: 2 });
    const equipped = owner.equipInventoryItem(equipSnapshot, secondEntry(equipSnapshot, owner, BOW.itemId));
    assert.equal(equipped.snapshot.playerState.equipment['slot.weapon.right']?.itemId, BOW.itemId);
    assert.equal(equipped.snapshot.playerState.inventory.bags[1].stacks[0].quantity, 1);
    assert.equal(deserializeSnapshot(serializeSnapshot(equipped.snapshot)).playerState.inventory.bags[1].stacks[0].quantity, 1);
  });
});

test('same-item duplicate-ID bags have colliding display row IDs despite distinct container indices', async () => {
  await withOwner((base, owner) => {
    const snapshot = bags(base, BREAST, BREAST);
    const entries = owner.buildInventoryEntries(snapshot).filter((entry) => entry.itemId === BREAST.itemId);
    assert.equal(entries.length, 2);
    assert.equal(entries[0].id, entries[1].id);
    assert.notEqual(entries[0].containerIndex, entries[1].containerIndex);
  });
});
