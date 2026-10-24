import type { EquipmentSlotId } from '../../../../packages/shared/types/src/index.js';
import itemCatalog from '../../../../packages/content/base/items/items.json';

type ItemRecord = {
  id: string;
  itemKey: string;
  itemClass: string;
  itemBranch: string;
  itemSubBranch: string;
  useProfiles?: Array<{ actionType: string; handlingType: string }>;
};

const ITEMS_BY_ID = new Map(
  (itemCatalog.records as ItemRecord[]).map((item) => [item.id, item])
);

// Current starter/loadout exceptions whose slots already exist in saved gameplay.
// Other armor coverage and tool grip require a dedicated authored compatibility owner.
const ESTABLISHED_ITEM_SLOTS: Partial<Record<string, EquipmentSlotId>> = {
  'item.leather_light_armor': 'slot.armor.chest',
  'item.compass': 'slot.accessory.waist',
  'item.butcher_knife': 'slot.weapon.right',
  'item.skinning_knife': 'slot.weapon.right'
};

export function resolveSupportedEquipmentSlot(itemId: string, itemKey: string): EquipmentSlotId | null {
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
