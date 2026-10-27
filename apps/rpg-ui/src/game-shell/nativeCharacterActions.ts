import fitCatalog from '../../../../packages/content/base/items/equipment_fit_profiles.json' with { type: 'json' };
import {
  deriveGearBagCapacities,
  moveGear,
  type GearFit,
  type GearResult,
  type GearSlotId
} from '../../../../packages/engines/game-engine/src/gear-instance-owner.js';
import {
  isNativeTargetCampaignSnapshot,
  type NativeFreshCampaignSnapshot
} from '../../../../packages/engines/game-engine/src/native-campaign-rules.js';

export type NativeGearMoveRequest = {
  requestId: string;
  expectedRevision: number;
  itemInstanceId: string;
  destination: { kind: 'worn'; slotId: GearSlotId } | { kind: 'carried' };
};

export type NativeGearMoveResult = {
  status: GearResult['status'];
  snapshot: NativeFreshCampaignSnapshot;
  reason?: string;
};

/** Unselected v3 action boundary. The gear owner alone changes physical locations. */
export function moveNativeGear(
  snapshot: NativeFreshCampaignSnapshot,
  request: NativeGearMoveRequest
): NativeGearMoveResult {
  if (!isNativeTargetCampaignSnapshot(snapshot)) {
    return { status: 'invalid', snapshot, reason: 'Native campaign is not admitted.' };
  }
  const result = moveGear(
    snapshot.playerState.gear,
    request,
    fitCatalog.records as GearFit[],
    deriveGearBagCapacities(snapshot.playerState.inventory)
  );
  if (result.status !== 'accepted') {
    return { status: result.status, snapshot, ...(result.reason ? { reason: result.reason } : {}) };
  }
  const next: NativeFreshCampaignSnapshot = {
    ...snapshot,
    playerState: { ...snapshot.playerState, gear: result.state }
  };
  if (!isNativeTargetCampaignSnapshot(next)) {
    return { status: 'invalid', snapshot, reason: 'Native campaign failed post-action admission.' };
  }
  return { status: 'accepted', snapshot: next };
}
