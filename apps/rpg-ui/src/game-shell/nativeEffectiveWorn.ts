import itemCatalog from '../../../../packages/content/base/items/items.json' with { type: 'json' };
import type { PlayerResourceModifierState } from '../../../../packages/shared/types/src/index.js';
import { getWornGear, type GearItemInstance } from '../../../../packages/engines/game-engine/src/gear-instance-owner.js';
import {
  isNativeTargetCampaignSnapshot,
  type NativeFreshCampaignSnapshot
} from '../../../../packages/engines/game-engine/src/native-campaign-rules.js';

type AuthoredItem = {
  id: string;
  itemKey: string;
  name: string;
  resourceModifiers?: PlayerResourceModifierState[];
};

const items = new Map((itemCatalog.records as AuthoredItem[]).map(item => [item.id, item]));

export type NativeWornItem = GearItemInstance & { name: string };
export type NativeEffectiveWorn = {
  items: NativeWornItem[];
  mainHandItemId: string | null;
  offHandItemId: string | null;
  combatItemIds: string[];
  resourceModifiers: PlayerResourceModifierState[];
};

/** One read-only source for v3 Character, combat provenance and resource facts. */
export function projectNativeEffectiveWorn(snapshot: NativeFreshCampaignSnapshot): NativeEffectiveWorn {
  if (!isNativeTargetCampaignSnapshot(snapshot)) throw new Error('Native campaign is not admitted.');
  const worn = getWornGear(snapshot.playerState.gear);
  const projected = worn.map(instance => {
    const authored = items.get(instance.itemId);
    if (!authored || authored.itemKey !== instance.itemKey) throw new Error('Worn item lacks canonical content.');
    return { ...instance, location: { ...instance.location }, name: authored.name };
  });
  const inSlot = (slotId: string) => worn.find(item =>
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
