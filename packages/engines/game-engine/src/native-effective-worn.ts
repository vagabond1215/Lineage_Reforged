import type { PlayerResourceModifierState } from '../../../shared/types/src/index.js';
import type { GearItemInstance } from './gear-instance-owner.js';
import { projectNativeEffectiveWornFromGear } from './native-worn-projection.js';
import {
  isNativeTargetCampaignSnapshot,
  type NativeFreshCampaignSnapshot
} from './native-campaign-rules.js';

export { projectNativeEffectiveWornFromGear } from './native-worn-projection.js';

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
  return projectNativeEffectiveWornFromGear(snapshot.playerState.gear);
}
