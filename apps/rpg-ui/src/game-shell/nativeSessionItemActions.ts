import {
  admitCampaignMutation,
  type CampaignSessionControl
} from '../../../../packages/engines/game-engine/src/campaign-session.js';
import {
  isNativeTargetCampaignSnapshot,
  type NativeFreshCampaignSnapshot
} from '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import { moveNativeGear, type NativeGearMoveRequest,
  type NativeGearMoveResult } from './nativeCharacterActions.js';
import { consumeNativeFungible, type NativeFungibleUseRequest,
  type NativeFungibleUseResult } from './nativeFungibleActions.js';

type NativeItemActionStatus = NativeGearMoveResult['status'] | NativeFungibleUseResult['status'] | 'rejected';
export type NativeSessionItemActionResult = {
  status: NativeItemActionStatus;
  snapshot: NativeFreshCampaignSnapshot;
  control: CampaignSessionControl<NativeFreshCampaignSnapshot>;
  reason?: string;
};

function admittedSource(snapshot: NativeFreshCampaignSnapshot,
  control: CampaignSessionControl<NativeFreshCampaignSnapshot>): boolean {
  return isNativeTargetCampaignSnapshot(snapshot) &&
    control.accountId === snapshot.accountId &&
    control.campaignId === snapshot.campaignIdentity?.campaignId;
}

function commit(snapshot: NativeFreshCampaignSnapshot,
  control: CampaignSessionControl<NativeFreshCampaignSnapshot>, requestId: string,
  kind: 'gear' | 'use', candidate: NativeFreshCampaignSnapshot): NativeSessionItemActionResult {
  const admitted = admitCampaignMutation(control, {
    mutationId: `mutation.native.${kind}.${requestId}`,
    sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision,
    ownerKind: 'engine_result', accepted: true,
    sourceSnapshot: snapshot, proposedSnapshot: candidate,
    validateNativeSnapshot: isNativeTargetCampaignSnapshot
  });
  return { status: admitted.accepted ? 'accepted' : admitted.duplicate ? 'duplicate' :
    admitted.reason === 'stale_revision' ? 'stale' : 'rejected',
    snapshot: admitted.snapshot, control: admitted.control,
    ...(!admitted.accepted && !admitted.duplicate ? { reason: admitted.reason } : {}) };
}

/** Unselected caller bridge: physical gear changes only in moveNativeGear. */
export function admitNativeGearSessionAction(snapshot: NativeFreshCampaignSnapshot,
  control: CampaignSessionControl<NativeFreshCampaignSnapshot>,
  request: NativeGearMoveRequest): NativeSessionItemActionResult {
  if (!admittedSource(snapshot, control))
    return { status: 'invalid', snapshot, control, reason: 'Native source/control is invalid.' };
  const action = moveNativeGear(snapshot, request);
  if (action.status !== 'accepted')
    return { status: action.status, snapshot, control,
      ...(action.reason ? { reason: action.reason } : {}) };
  return commit(snapshot, control, request.requestId, 'gear', action.snapshot);
}

/** Unselected caller bridge: fungible Use changes only in consumeNativeFungible. */
export function admitNativeFungibleSessionAction(snapshot: NativeFreshCampaignSnapshot,
  control: CampaignSessionControl<NativeFreshCampaignSnapshot>,
  request: NativeFungibleUseRequest): NativeSessionItemActionResult {
  if (!admittedSource(snapshot, control))
    return { status: 'invalid', snapshot, control, reason: 'Native source/control is invalid.' };
  const action = consumeNativeFungible(snapshot, request);
  if (action.status !== 'accepted')
    return { status: action.status, snapshot, control,
      ...(action.reason ? { reason: action.reason } : {}) };
  return commit(snapshot, control, request.requestId, 'use', action.snapshot);
}
