import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

test('Character Equipment and Inventory routes retain their shared owner actions', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { demoSnapshot } = await vite.ssrLoadModule('/src/runtime/demoSnapshot.ts');
    const { buildEquipmentEntries, buildInventoryEntries, unequipItem, equipInventoryItem, consumeInventoryItem } =
      await vite.ssrLoadModule('/src/features/characterPanelState.ts');
    const original = JSON.stringify(demoSnapshot);

    const weapon = buildEquipmentEntries(demoSnapshot).find((entry) => entry.slotId === 'slot.weapon.right');
    assert.equal(weapon?.item?.itemKey, 'composite_bow');
    const unequipped = unequipItem(demoSnapshot, weapon);
    assert.equal(unequipped.notice.title, 'Item Unequipped');
    assert.equal(unequipped.snapshot.playerState.equipment[weapon.slotId], null);
    const carriedWeapon = buildInventoryEntries(unequipped.snapshot).find((entry) => entry.itemId === weapon.item.itemId);
    assert.equal(carriedWeapon?.itemKey, weapon.item.itemKey);

    const equipableSnapshot = structuredClone(demoSnapshot);
    equipableSnapshot.playerState.inventory.bags[0].stacks.push({
      itemId: 'item.arming_sword', itemKey: 'arming_sword', quantity: 1
    });
    const carriedSword = buildInventoryEntries(equipableSnapshot).find((entry) => entry.itemKey === 'arming_sword');
    assert.equal(carriedSword?.preferredSlotId, weapon.slotId);
    const equipped = equipInventoryItem(equipableSnapshot, carriedSword);
    assert.equal(equipped.notice.title, 'Item Equipped');
    assert.equal(equipped.snapshot.playerState.equipment[weapon.slotId]?.itemId, carriedSword.itemId);
    assert.ok(!buildInventoryEntries(equipped.snapshot).some((entry) => entry.itemId === carriedSword.itemId));
    assert.ok(buildInventoryEntries(equipped.snapshot).some((entry) => entry.itemId === weapon.item.itemId));

    const consumableSnapshot = structuredClone(demoSnapshot);
    consumableSnapshot.playerState.inventory.bags[0].stacks.push({
      itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2
    });
    const bread = buildInventoryEntries(consumableSnapshot).find((entry) => entry.itemKey === 'bread_loaf');
    assert.equal(bread?.quantity, 2);
    const consumed = consumeInventoryItem(consumableSnapshot, bread);
    assert.equal(buildInventoryEntries(consumed.snapshot).find((entry) => entry.itemKey === 'bread_loaf')?.quantity, 1);
    assert.equal(JSON.stringify(demoSnapshot), original, 'owner actions do not mutate the source snapshot');
  } finally {
    await vite.close();
  }
});
