import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { deserializeSnapshot, serializeSnapshot } from '../../../packages/shared/persistence/src/index.ts';

const BREAST = { itemId: 'item.breast_cut', itemKey: 'breast_cut', quantity: 1 };
const BREAD = { itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 1 };
const ARROWS = { itemId: 'item.arrow_bundle', itemKey: 'arrow_bundle', quantity: 1 };

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

function setStacks(snapshot, location, stacks) {
  if (location === 'bag') snapshot.playerState.inventory.bags[0].stacks = stacks;
  else snapshot.playerState.inventory.overflow = stacks;
}

function selected(snapshot, owner, location, index = 0) {
  return owner.buildInventoryEntries(snapshot).find((entry) =>
    entry.location === location && entry.stackIndex === index);
}

function rejectUnchanged(snapshot, owner, entry) {
  const before = structuredClone(snapshot);
  const result = owner.consumeInventoryItem(snapshot, entry);
  assert.strictEqual(result.snapshot, snapshot);
  assert.equal(result.notice.title, 'Inventory Changed');
  assert.deepEqual(snapshot, before);
}

for (const location of ['bag', 'overflow']) {
  test(`stale ${location} Breast Cut selection cannot consume Arrow Bundle or apply Breast Cut effects`, async () => {
    await withOwner((snapshot, owner) => {
      setStacks(snapshot, location, [BREAST]);
      const entry = selected(snapshot, owner, location);
      setStacks(snapshot, location, [ARROWS]);
      rejectUnchanged(snapshot, owner, entry);
    });
  });

  test(`${location} rejects stale indices, missing stacks, invalid quantities and mismatched identity`, async () => {
    await withOwner((snapshot, owner) => {
      setStacks(snapshot, location, [BREAD, BREAST]);
      const entry = selected(snapshot, owner, location, 1);

      setStacks(snapshot, location, [BREAST]);
      rejectUnchanged(snapshot, owner, entry);
      setStacks(snapshot, location, [BREAD, BREAST]);
      if (location === 'bag') {
        setStacks(snapshot, location, [BREAD, BREAST, ARROWS]);
        const shifted = selected(snapshot, owner, location, 1);
        snapshot.playerState.inventory.bags[0].stacks.shift();
        rejectUnchanged(snapshot, owner, shifted);
        setStacks(snapshot, location, [BREAD, BREAST]);
      }
      for (const invalid of [
        { ...entry, stackIndex: -1 },
        { ...entry, stackIndex: 1.5 },
        { ...entry, stackIndex: Number.NaN },
        { ...entry, stackIndex: 99 },
        { ...entry, itemId: BREAD.itemId },
        { ...entry, itemKey: BREAD.itemKey },
        { ...entry, quantity: 0 },
        { ...entry, quantity: 2 },
        { ...entry, id: 'inventory.missing' },
        { ...entry, containerId: 'missing' },
        { ...entry, containerIndex: -1 },
        { ...entry, location: 'unknown' }
      ]) rejectUnchanged(snapshot, owner, invalid);

      setStacks(snapshot, location, [BREAD, { ...BREAST, itemKey: BREAD.itemKey }]);
      rejectUnchanged(snapshot, owner, selected(snapshot, owner, location, 1));

      setStacks(snapshot, location, [BREAD, { ...BREAST, quantity: 0 }]);
      rejectUnchanged(snapshot, owner, entry);
      setStacks(snapshot, location, [BREAD, { ...BREAST, quantity: 1.5 }]);
      rejectUnchanged(snapshot, owner, entry);
      setStacks(snapshot, location, [BREAD, { ...BREAST, quantity: Number.NaN }]);
      rejectUnchanged(snapshot, owner, entry);
      setStacks(snapshot, location, [BREAD]);
      rejectUnchanged(snapshot, owner, entry);
      if (location === 'bag') {
        snapshot.playerState.inventory.bags = [];
        rejectUnchanged(snapshot, owner, entry);
      }
    });
  });

  test(`${location} consumes authored Bread Loaf and Breast Cut one unit at a time`, async () => {
    await withOwner((snapshot, owner) => {
      for (const item of [BREAD, BREAST]) {
        const current = structuredClone(snapshot);
        setStacks(current, location, [{ ...item, quantity: 2 }]);
        const entry = selected(current, owner, location);
        assert.ok(entry.consumePreview, `${item.itemId} has an authored consume profile`);
        if (item.itemId === BREAST.itemId) assert.notEqual(entry.category, 'consumable');
        const before = structuredClone(current);
        const first = owner.consumeInventoryItem(current, entry);
        assert.notStrictEqual(first.snapshot, current);
        assert.deepEqual(current, before);
        assert.equal(selected(first.snapshot, owner, location)?.quantity, 1);
        assert.deepEqual(first.snapshot.playerState.equipment, current.playerState.equipment);
        assert.notDeepEqual(first.snapshot.playerState.bodyState, current.playerState.bodyState);
        const saved = deserializeSnapshot(serializeSnapshot(first.snapshot));
        assert.equal(selected(saved, owner, location)?.quantity, 1);
        const final = owner.consumeInventoryItem(saved, selected(saved, owner, location));
        assert.equal(final.snapshot.playerState.inventory.bags[0].stacks
          .concat(final.snapshot.playerState.inventory.overflow)
          .filter((stack) => stack.itemId === item.itemId).length, 0);
        assert.equal(selected(final.snapshot, owner, location), undefined);
        assert.equal(deserializeSnapshot(serializeSnapshot(final.snapshot)).playerState.inventory.bags[0].stacks
          .concat(final.snapshot.playerState.inventory.overflow)
          .filter((stack) => stack.itemId === item.itemId).length, 0);
      }
    });
  });
}

test('same-ID, same-key, same-quantity duplicate stack compaction is indistinguishable without instance identity', async () => {
  await withOwner((snapshot, owner) => {
    setStacks(snapshot, 'bag', [BREAST, BREAST]);
    const firstEntry = selected(snapshot, owner, 'bag', 0);
    snapshot.playerState.inventory.bags[0].stacks.shift();
    const result = owner.consumeInventoryItem(snapshot, firstEntry);
    assert.notStrictEqual(result.snapshot, snapshot);
    assert.equal(result.snapshot.playerState.inventory.bags[0].stacks.length, 0);
  });
});
