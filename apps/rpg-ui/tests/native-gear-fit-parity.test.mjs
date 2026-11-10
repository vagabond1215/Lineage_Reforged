import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import itemCatalog from '../../../packages/content/base/items/items.json' with { type: 'json' };
import fitCatalog from '../../../packages/content/base/items/equipment_fit_profiles.json' with { type: 'json' };

test('candidate native fits preserve every current equipable item without adding an unproven worn slot', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
  try {
    const { resolveSupportedEquipmentSlot } = await vite.ssrLoadModule('/src/game-shell/equipmentSlotEligibility.ts');
    const fits = new Map(fitCatalog.records.map(fit => [fit.itemId, fit]));
    const expectedNativeSlot = (oldSlot, itemClass) => oldSlot === 'slot.weapon.right'
      ? 'slot.equipment.weapon.right'
      : oldSlot === 'slot.weapon.left'
        ? 'slot.equipment.weapon.left'
        : oldSlot === 'slot.armor.chest'
          ? itemClass === 'clothing' ? 'slot.clothing.chest' : 'slot.equipment.armor.chest'
          : oldSlot === 'slot.accessory.waist'
            ? 'slot.accessory.waist'
            : null;
    let supported = 0;
    for (const item of itemCatalog.records) {
      const oldSlot = resolveSupportedEquipmentSlot(item.id, item.itemKey);
      const fit = fits.get(item.id);
      if (oldSlot) {
        supported += 1;
        assert.ok(fit, `${item.id} was equipable before cutover`);
        assert.ok(fit.slots.includes(expectedNativeSlot(oldSlot, item.itemClass)), item.id);
      } else if (fit) {
        assert.deepEqual(fit.slots, [], `${item.id} has no established worn slot`);
      }
    }
    assert.equal(supported, 50);
  } finally {
    await vite.close();
  }
});
