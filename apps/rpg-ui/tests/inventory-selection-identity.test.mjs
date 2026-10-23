import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('Character Inventory selects the exact live row when bag IDs collide', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (String(args[0]).startsWith('Warning: useLayoutEffect does nothing on the server')) return;
    originalConsoleError(...args);
  };
  try {
    const [{ demoSnapshot }, itemActions, { CharacterPanel, inventoryPresentationId, inventorySelectionFor, selectVisibleInventoryItem }, { GameSessionProvider }, { createDefaultAccountProfileState }, { serializeSnapshot, deserializeSnapshot }] = await Promise.all([
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts'),
      vite.ssrLoadModule('/src/features/characterPanelState.ts'),
      vite.ssrLoadModule('/src/features/CharacterPanel.tsx'),
      vite.ssrLoadModule('/src/runtime/GameSessionContext.tsx'),
      vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-account.ts'),
      vite.ssrLoadModule('/../../packages/shared/persistence/src/index.ts')
    ]);
    const { buildInventoryEntries, sortInventoryEntries, toggleFavoriteItem, consumeInventoryItem, equipInventoryItem } = itemActions;
    const withBags = (left, right, sameId = true) => {
      const snapshot = structuredClone(demoSnapshot);
      const bag = snapshot.playerState.inventory.bags[0];
      snapshot.playerState.inventory.bags = [
        { ...structuredClone(bag), label: 'Same Bag', stacks: [left] },
        { ...structuredClone(bag), id: sameId ? bag.id : `${bag.id}.other`, label: 'Same Bag', stacks: [right] }
      ];
      snapshot.playerState.inventory.overflow = [];
      return snapshot;
    };
    const bread = { itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2 };
    const snapshot = withBags(bread, bread);
    const entries = buildInventoryEntries(snapshot);
    assert.equal(entries.length, 2);
    assert.equal(entries[0].id, entries[1].id, 'real entry IDs collide before the UI repair');
    assert.deepEqual(entries.map((entry) => entry.containerIndex), [0, 1]);

    const selection = inventorySelectionFor(entries[1], snapshot.playerState.inventory);
    assert.notEqual(inventoryPresentationId(entries[0]), selection.key, 'React row keys and selected styling are distinct');
    assert.equal(selectVisibleInventoryItem(entries, selection, snapshot.playerState.inventory), entries[1],
      'selecting the second visible row must pass that unmodified live InventoryEntry to Use');
    assert.equal(selectVisibleInventoryItem([entries[0]], selection, snapshot.playerState.inventory), undefined,
      'hiding the selected row must not redirect Use to the first bag');
    assert.equal(selectVisibleInventoryItem(sortInventoryEntries(entries, 'name', new Set(), 'all'), selection, snapshot.playerState.inventory), entries[1]);
    const favorited = toggleFavoriteItem(snapshot, bread.itemKey);
    assert.equal(selectVisibleInventoryItem(buildInventoryEntries(favorited), selection, favorited.playerState.inventory)?.containerIndex, 1,
      'item-type favorites do not redirect the row selection');
    for (const changed of [
      (() => { const next = structuredClone(snapshot); next.playerState.inventory.bags.reverse(); return next; })(),
      (() => { const next = structuredClone(snapshot); next.playerState.inventory.bags[1].stacks[0].quantity = 1; return next; })(),
      deserializeSnapshot(serializeSnapshot(snapshot))
    ]) {
      assert.equal(selectVisibleInventoryItem(buildInventoryEntries(changed), selection, changed.playerState.inventory), undefined,
        'reorder, quantity mutation and SaveSnapshot reload require reselection');
    }

    for (const [left, right, sameId] of [
      [bread, { itemId: 'item.breast_cut', itemKey: 'breast_cut', quantity: 2 }, true],
      [bread, bread, false]
    ]) {
      const variant = withBags(left, right, sameId);
      const rows = buildInventoryEntries(variant);
      const chosen = selectVisibleInventoryItem(rows, inventorySelectionFor(rows[1], variant.playerState.inventory), variant.playerState.inventory);
      assert.equal(chosen, rows[1]);
      assert.notEqual(inventoryPresentationId(rows[0]), inventoryPresentationId(rows[1]));
    }
    const overflow = withBags(bread, bread);
    overflow.playerState.inventory.overflow.push({ itemId: 'item.breast_cut', itemKey: 'breast_cut', quantity: 2 });
    const overflowRows = buildInventoryEntries(overflow);
    assert.equal(selectVisibleInventoryItem(overflowRows, inventorySelectionFor(overflowRows[2], overflow.playerState.inventory), overflow.playerState.inventory), overflowRows[2]);

    if (process.env.EXPECT_EXACT_OWNER === '1') {
      const consumed = consumeInventoryItem(snapshot, entries[1]);
      assert.equal(consumed.notice.title, 'Consumed');
      assert.equal(consumed.snapshot.playerState.inventory.bags[0].stacks[0].quantity, 2);
      assert.equal(consumed.snapshot.playerState.inventory.bags[1].stacks[0].quantity, 1);
      assert.equal(selectVisibleInventoryItem(buildInventoryEntries(consumed.snapshot), selection, consumed.snapshot.playerState.inventory), undefined);
      const final = consumeInventoryItem(consumed.snapshot, buildInventoryEntries(consumed.snapshot)[1]);
      assert.equal(final.snapshot.playerState.inventory.bags[0].stacks[0].quantity, 2);
      assert.equal(final.snapshot.playerState.inventory.bags[1].stacks.length, 0);

      for (const itemKey of ['short_bow', 'breast_cut']) {
        const actionSnapshot = withBags(
          { itemId: `item.${itemKey}`, itemKey, quantity: 2 },
          { itemId: `item.${itemKey}`, itemKey, quantity: 2 }
        );
        const rows = buildInventoryEntries(actionSnapshot);
        const chosen = selectVisibleInventoryItem(rows, inventorySelectionFor(rows[1], actionSnapshot.playerState.inventory), actionSnapshot.playerState.inventory);
        const result = itemKey === 'short_bow' ? equipInventoryItem(actionSnapshot, chosen) : consumeInventoryItem(actionSnapshot, chosen);
        assert.equal(result.notice.title, itemKey === 'short_bow' ? 'Item Equipped' : 'Consumed');
        assert.equal(result.snapshot.playerState.inventory.bags[0].stacks[0].quantity, 2);
        assert.equal(result.snapshot.playerState.inventory.bags[1].stacks[0].quantity, 1);
        if (itemKey === 'short_bow') assert.equal(result.snapshot.playerState.equipment['slot.weapon.right']?.itemKey, 'short_bow');
      }
    }

    const html = renderToStaticMarkup(React.createElement(GameSessionProvider, {
      accountProfile: createDefaultAccountProfileState(), snapshot, campaignSessionControl: {}, onSnapshotChange: () => {}
    }, React.createElement(CharacterPanel, {
      accent: 'var(--color-character)', searchQuery: '', pinnedIds: [], onTogglePin: () => {}, initialSection: 'inventory'
    })));
    assert.match(html, /Inspect Bread Loaf, quantity 2, Same Bag, bag 1/);
    assert.match(html, /Inspect Bread Loaf, quantity 2, Same Bag, bag 2/);
    assert.equal((html.match(/Pin unavailable for Same Bag/g) ?? []).length, 2);
    assert.equal((html.match(/aria-pressed="true" aria-label="Inspect Bread Loaf/g) ?? []).length, 1,
      'only one duplicate row begins selected');
    assert.equal((html.match(/aria-label="Inspect Bread Loaf[^" ]*(?:[^"]*)"/g) ?? []).length, 2,
      'both rows expose separate keyboard-reachable inspect buttons');
    assert.doesNotMatch(serializeSnapshot(snapshot), /inventoryPresentationId|inventorySelectionFor/, 'UI selection is not persisted');
  } finally {
    console.error = originalConsoleError;
    await vite.close();
  }
});
