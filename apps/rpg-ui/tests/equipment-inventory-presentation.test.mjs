import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('Equipment and Inventory show selected owner state and truthful action reasons', async (t) => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (String(args[0]).startsWith('Warning: useLayoutEffect does nothing on the server')) return;
    originalConsoleError(...args);
  };
  try {
    const [{ CharacterPanel, inventorySelectionFor, selectVisibleItem, selectVisibleInventoryItem }, { GameSessionProvider }, { demoSnapshot }, { createDefaultAccountProfileState }, itemActions] = await Promise.all([
      vite.ssrLoadModule('/src/features/CharacterPanel.tsx'),
      vite.ssrLoadModule('/src/runtime/GameSessionContext.tsx'),
      vite.ssrLoadModule('/src/runtime/demoSnapshot.ts'),
      vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-account.ts'),
      vite.ssrLoadModule('/src/features/characterPanelState.ts')
    ]);
    const renderSection = (section, snapshot = demoSnapshot) => {
      return renderToStaticMarkup(
          React.createElement(GameSessionProvider, {
            accountProfile: createDefaultAccountProfileState(),
            snapshot,
            campaignSessionControl: {},
            onSnapshotChange: () => {}
          }, React.createElement(CharacterPanel, {
            accent: 'var(--color-character)', searchQuery: '', pinnedIds: [], onTogglePin: () => {}, initialSection: section,
            inventoryOnly: section === 'inventory', onOpenInventory: () => {}
          }))
        );
    };

    const singleStack = (itemId, itemKey, quantity, location = 'bag') => {
      const snapshot = structuredClone(demoSnapshot);
      snapshot.playerState.inventory.bags[0].stacks = location === 'bag' ? [{ itemId, itemKey, quantity }] : [];
      snapshot.playerState.inventory.overflow = location === 'overflow' ? [{ itemId, itemKey, quantity }] : [];
      return snapshot;
    };

    await t.test('occupied and empty slots disclose selection, count, durability and route without nested controls', () => {
      const equipment = renderSection('equipment');
      assert.match(equipment, /Equipment Loadout/);
      assert.match(equipment, /aria-pressed="true"/);
      assert.match(equipment, /Browse carried items/);
      assert.match(equipment, /Inspect Weapon Right: Composite Bow/);
      assert.match(equipment, /94% durability/);
      assert.match(equipment, /Empty Slot/);
      assert.match(equipment, /aria-label="Favorite item"/);
      let openButtons = 0;
      for (const [tag] of equipment.matchAll(/<\/?button\b[^>]*>/g)) {
        openButtons += tag.startsWith('</') ? -1 : 1;
        assert.ok(openButtons <= 1, 'buttons must not be nested');
      }
      assert.equal(openButtons, 0);
    });

    await t.test('authored Use stays available outside the heuristic consumable category', () => {
      const breastCut = singleStack('item.breast_cut', 'breast_cut', 2);
      const entry = itemActions.buildInventoryEntries(breastCut)[0];
      assert.notEqual(entry.category, 'consumable');
      assert.ok(entry.consumePreview);
      const inventory = renderSection('inventory', breastCut);
      assert.match(inventory, /aria-label="Inventory section"/);
      assert.doesNotMatch(inventory, /aria-label="Character sections"/, 'Inventory has its own main dock destination');
      assert.match(inventory, /Hide information pane/, 'item inspection remains available on narrow screens');
      assert.match(inventory, /Use available/);
      assert.match(inventory, /Use consumes one item with its authored consume profile/);
      assert.match(inventory, /role="group" aria-label="Filter inventory by category"/);
      assert.match(inventory, /role="group" aria-label="Sort inventory"/);
      const useButton = inventory.match(/<button([^>]*)>Use Item<\/button>/)?.[1];
      assert.ok(useButton);
      assert.doesNotMatch(useButton, /\sdisabled(?:=|\s|$)/);
      assert.match(inventory, /Quantity 2/);
    });

    await t.test('unsupported, empty and overflow stacks show precise availability', () => {
      const arrows = renderSection('inventory', singleStack('item.arrow_bundle', 'arrow_bundle', 1));
      assert.match(arrows, /No supported equipment slot for this item/);
      assert.match(arrows, /No authored consume profile for this item/);
      assert.match(arrows.match(/<button([^>]*)>Equip Item<\/button>/)?.[1] ?? '', /\sdisabled(?:=|\s|$)/);
      assert.match(arrows.match(/<button([^>]*)>Use Item<\/button>/)?.[1] ?? '', /\sdisabled(?:=|\s|$)/);
      const empty = renderSection('inventory', singleStack('item.bread_loaf', 'bread_loaf', 0));
      assert.match(empty, /This stack has no items available to use/);
      assert.doesNotMatch(empty, /Use available/);
      const overflow = renderSection('inventory', singleStack('item.short_bow', 'short_bow', 1, 'overflow'));
      assert.match(overflow, /Inspect Short Bow, quantity 1, Overflow/);
    });

    await t.test('bow action labels follow the current owner projection', () => {
      for (const [itemId, itemKey] of [
        ['item.composite_bow', 'composite_bow'],
        ['item.short_bow', 'short_bow']
      ]) {
        const snapshot = singleStack(itemId, itemKey, 1, 'overflow');
        const entry = itemActions.buildInventoryEntries(snapshot)[0];
        if (process.env.EXPECT_EQUIPMENT_OWNER === '1') {
          assert.equal(entry.preferredSlotId, 'slot.weapon.right', `${itemKey} after PR #10 composition`);
        }
        const inventory = renderSection('inventory', snapshot);
        const equipButton = inventory.match(/<button([^>]*)>Equip Item<\/button>/)?.[1] ?? '';
        assert.equal(/\sdisabled(?:=|\s|$)/.test(equipButton), !entry.preferredSlotId);
        assert.equal(inventory.includes('Supported equip slot'), Boolean(entry.preferredSlotId));
      }
    });

    await t.test('removed stack selection cannot silently use the next item twice', () => {
      const snapshot = singleStack('item.bread_loaf', 'bread_loaf', 1);
      snapshot.playerState.inventory.bags[0].stacks.push({ itemId: 'item.arrow_bundle', itemKey: 'arrow_bundle', quantity: 1 });
      const bread = itemActions.buildInventoryEntries(snapshot)[0];
      const used = itemActions.consumeInventoryItem(snapshot, bread);
      assert.equal(used.notice.title, 'Consumed');
      assert.notEqual(used.snapshot, snapshot);
      assert.equal(itemActions.buildInventoryEntries(used.snapshot).length, 1);
      assert.equal(selectVisibleItem(itemActions.buildInventoryEntries(used.snapshot), bread.id), undefined);
      const roundTrip = JSON.parse(JSON.stringify(used.snapshot));
      assert.deepEqual(roundTrip.playerState.inventory, used.snapshot.playerState.inventory);
    });

    await t.test('same-item stack compaction invalidates the old actionable selection', () => {
      for (const location of ['bag', 'overflow']) {
        const snapshot = singleStack('item.breast_cut', 'breast_cut', 1, location);
        const stacks = location === 'bag' ? snapshot.playerState.inventory.bags[0].stacks : snapshot.playerState.inventory.overflow;
        stacks.push({ itemId: 'item.breast_cut', itemKey: 'breast_cut', quantity: 1 });
        const [first, second] = itemActions.buildInventoryEntries(snapshot);
        const selection = inventorySelectionFor(first, snapshot.playerState.inventory);
        assert.equal(selectVisibleInventoryItem([second, first], selection, snapshot.playerState.inventory)?.id, first.id,
          `${location} sort order must not change selection`);
        assert.equal(selectVisibleInventoryItem([second], selection, snapshot.playerState.inventory), undefined,
          `${location} filter hiding the selection must disable actions`);
        const favorited = itemActions.toggleFavoriteItem(snapshot, first.itemKey);
        assert.equal(selectVisibleInventoryItem(itemActions.buildInventoryEntries(favorited), selection, favorited.playerState.inventory)?.id, first.id,
          `${location} favorite change must keep the same inventory selection`);
        const used = itemActions.consumeInventoryItem(snapshot, first);
        const remaining = itemActions.buildInventoryEntries(used.snapshot);
        assert.equal(remaining.length, 1);
        assert.equal(remaining[0].id, first.id);
        assert.notEqual(remaining[0].id, second.id);
        assert.equal(selectVisibleInventoryItem(remaining, selection, used.snapshot.playerState.inventory), undefined,
          `${location} compaction must invalidate the old selection`);
      }
    });
  } finally {
    console.error = originalConsoleError;
    await vite.close();
  }
});
