import itemCatalog from '../../../../packages/content/base/items/items.json' with { type: 'json' };

const ITEMS_BY_ID = new Map(itemCatalog.records.map((item) => [item.id, item]));

const ESTABLISHED_ITEM_SLOTS = {
  'item.leather_light_armor': 'slot.armor.chest',
  'item.compass': 'slot.accessory.waist',
  'item.butcher_knife': 'slot.weapon.right',
  'item.skinning_knife': 'slot.weapon.right'
};

export function resolveSupportedEquipmentSlot(itemId, itemKey) {
  const item = ITEMS_BY_ID.get(itemId);
  if (!item || item.itemKey !== itemKey) return null;

  const establishedSlot = ESTABLISHED_ITEM_SLOTS[item.id];
  if (establishedSlot) return establishedSlot;

  if (item.itemClass === 'weapon') return 'slot.weapon.right';
  if (item.itemClass === 'armor' && item.itemBranch === 'shield') return 'slot.weapon.left';
  if (item.itemClass === 'clothing' && ['torso', 'outerwear', 'wear'].includes(item.itemSubBranch)) {
    return 'slot.armor.chest';
  }
  if (item.itemClass === 'tool' && item.useProfiles?.some(
    (profile) => profile.handlingType === 'weapon' && profile.actionType.startsWith('combat.melee.')
  )) {
    return 'slot.weapon.right';
  }

  return null;
}
