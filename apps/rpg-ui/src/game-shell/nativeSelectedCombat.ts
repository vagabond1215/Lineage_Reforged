import { admitCampaignMutation } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import { isNativeTargetCampaignSnapshot } from '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import { createNearbyExplorationCommand, executeNearbyExplorationCommand,
  resolveNearbyExplorationPlan } from '../../../../packages/engines/game-engine/src/player-nearby-exploration.js';
import { admitNearbyEncounter, createNearbyEncounterAdmissionCommand,
  createNearbyEncounterStepCommand, executeNearbyEncounterStep,
  type NearbyEncounterAdmissionCommand, type NearbyEncounterStepCommand
} from '../../../../packages/engines/game-engine/src/player-nearby-encounter.js';
import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import type { CampaignSessionControl } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import { isNativeSelectedGameplaySource } from './nativeSelectedGameplay.js';
import type { NativeSelectedSession } from './nativeSelectedSession.js';

type Outcome = { status: 'accepted' | 'stale' | 'duplicate' | 'rejected';
  session: NativeSelectedSession; reason?: string };

function source(session: NativeSelectedSession) {
  // Existing nearby owners retain their v2 static interface. The native validator
  // at admission prevents a v2 equipment map or malformed graph from surviving.
  return { snapshot: session.snapshot as unknown as SaveSnapshot,
    control: session.control as unknown as CampaignSessionControl };
}

function fromEncounter(session: NativeSelectedSession,
  result: ReturnType<typeof admitNearbyEncounter>): Outcome {
  if (!result.accepted) return { status: result.duplicate ? 'duplicate' :
    result.code === 'stale_snapshot' ? 'stale' : 'rejected', session, reason: result.code };
  if (!isNativeTargetCampaignSnapshot(result.snapshot))
    return { status: 'rejected', session, reason: 'invalid_native_result' };
  return { status: 'accepted', session: { ...session, snapshot: result.snapshot,
    control: result.control as CampaignSessionControl<typeof result.snapshot> } };
}

/** The authored nearby exploration owner decides whether a candidate exists. */
export function advanceNativeSelectedExploration(session: NativeSelectedSession): Outcome {
  if (!isNativeSelectedGameplaySource(session))
    return { status: 'rejected', session, reason: 'invalid_source' };
  const { snapshot, control } = source(session);
  const plan = resolveNearbyExplorationPlan(snapshot);
  if (!plan.available) return { status: 'rejected', session, reason: plan.code };
  const result = executeNearbyExplorationCommand(snapshot, createNearbyExplorationCommand(snapshot));
  if (!result.accepted) return { status: result.code === 'stale_snapshot' ? 'stale' : 'rejected',
    session, reason: result.code };
  if (!isNativeTargetCampaignSnapshot(result.snapshot))
    return { status: 'rejected', session, reason: 'invalid_native_result' };
  const admission = admitCampaignMutation(session.control, {
    mutationId: result.commandId, sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision, ownerKind: 'engine_result', accepted: true,
    sourceSnapshot: session.snapshot, proposedSnapshot: result.snapshot,
    resultId: result.resultId, validateNativeSnapshot: isNativeTargetCampaignSnapshot
  });
  if (!admission.accepted) return { status: admission.duplicate ? 'duplicate' :
    admission.reason === 'stale_revision' ? 'stale' : 'rejected', session, reason: admission.reason };
  return { status: 'accepted', session: { ...session,
    snapshot: admission.snapshot, control: admission.control } };
}

export function createNativeSelectedEncounterAdmission(session: NativeSelectedSession) {
  if (!isNativeSelectedGameplaySource(session)) return null;
  const { snapshot, control } = source(session);
  return createNearbyEncounterAdmissionCommand(snapshot, control);
}

export function admitNativeSelectedEncounter(session: NativeSelectedSession,
  command: NearbyEncounterAdmissionCommand): Outcome {
  if (!isNativeSelectedGameplaySource(session))
    return { status: 'rejected', session, reason: 'invalid_source' };
  const { snapshot, control } = source(session);
  return fromEncounter(session, admitNearbyEncounter(snapshot, control, command,
    isNativeTargetCampaignSnapshot));
}

export function createNativeSelectedCombatStep(session: NativeSelectedSession,
  actionType: string, targetId: string | null, requestId: string) {
  if (!isNativeSelectedGameplaySource(session)) return null;
  const { snapshot, control } = source(session);
  return createNearbyEncounterStepCommand(snapshot, control, actionType, targetId, requestId);
}

export function applyNativeSelectedCombatStep(session: NativeSelectedSession,
  command: NearbyEncounterStepCommand): Outcome {
  if (!isNativeSelectedGameplaySource(session))
    return { status: 'rejected', session, reason: 'invalid_source' };
  const { snapshot, control } = source(session);
  return fromEncounter(session, executeNearbyEncounterStep(snapshot, control, command,
    isNativeTargetCampaignSnapshot));
}
