import itemCatalog from '../../../content/base/items/items.json' with { type: 'json' };
import { getWornGear } from './gear-instance-owner.ts';

const items = new Map(itemCatalog.records.map(item => [item.id, item]));

/** One read-only runtime projection shared by native Character, combat and resources. */
export function projectNativeEffectiveWornFromGear(gear) {
  const worn = getWornGear(gear);
  const projected = worn.map(instance => {
    const authored = items.get(instance.itemId);
    if (!authored || authored.itemKey !== instance.itemKey) throw new Error('Worn item lacks canonical content.');
    return { ...instance, location: { ...instance.location }, name: authored.name };
  });
  const inSlot = slotId => worn.find(item =>
    item.location.kind === 'worn' && item.location.slotId === slotId
  )?.itemId ?? null;
  return {
    items: projected,
    mainHandItemId: inSlot('slot.equipment.weapon.right'),
    offHandItemId: inSlot('slot.equipment.weapon.left'),
    combatItemIds: worn.map(item => item.itemId),
    resourceModifiers: worn.flatMap(instance => items.get(instance.itemId)?.resourceModifiers ?? [])
  };
}
