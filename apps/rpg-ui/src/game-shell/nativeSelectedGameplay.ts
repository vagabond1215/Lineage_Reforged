import { admitCampaignMutation } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import { isNativeTargetCampaignSnapshot, type NativeFreshCampaignSnapshot } from
  '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import { hasPendingNormalDefeat } from '../../../../packages/engines/game-engine/src/normal-defeat.js';
import { commitNativeSurveyShift } from '../../../../packages/engines/game-engine/src/native-survey-ledger.js';
import { prepareNativeSurveySource, type NativeSurveySourceIdentity } from
  '../../../../packages/engines/game-engine/src/native-survey-source.js';
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand,
  type PlayerQuestAcceptanceCommand } from '../../../../packages/engines/game-engine/src/player-quest-acceptance.js';
import { createPlayerTravelCommand, executePlayerTravelCommand,
  type PlayerTravelCommand } from '../../../../packages/engines/game-engine/src/player-travel.js';
import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import type { CleanEpochAccountStore } from './cleanEpochAccountStore.js';
import type { NativeSelectedSession } from './nativeSelectedSession.js';

type Outcome = { status: 'accepted' | 'stale' | 'duplicate' | 'rejected';
  session: NativeSelectedSession; reason?: string; stage?: string };
type ReadOwner = Pick<CleanEpochAccountStore, 'readSelected' | 'readSlot'>;

export function isNativeSelectedGameplaySource(session: NativeSelectedSession): boolean {
  return isNativeTargetCampaignSnapshot(session.snapshot) &&
    session.control.accountId === session.snapshot.accountId &&
    session.control.campaignId === session.snapshot.campaignIdentity?.campaignId &&
    session.sourceAddress.artifactId === session.control.loadedArtifactId &&
    session.sourceAddress.publicationId === session.control.loadedPublicationId &&
    Number.isSafeInteger(session.accountRevision) && session.accountRevision > 0 &&
    !session.control.soundingsAdmissionWitness && !hasPendingNormalDefeat(session.snapshot);
}

function admit(session: NativeSelectedSession, mutationId: string,
  proposedSnapshot: NativeFreshCampaignSnapshot): Outcome {
  const result = admitCampaignMutation(session.control, {
    mutationId, sourceArtifactId: session.control.loadedArtifactId,
    sourceRevision: session.control.sessionRevision, ownerKind: 'engine_result',
    accepted: true, sourceSnapshot: session.snapshot, proposedSnapshot,
    validateNativeSnapshot: isNativeTargetCampaignSnapshot
  });
  if (!result.accepted) return { status: result.duplicate ? 'duplicate' :
    result.reason === 'stale_revision' ? 'stale' : 'rejected', session, reason: result.reason };
  return { status: 'accepted', session: { ...session,
    snapshot: result.snapshot, control: result.control } };
}

/** The established quest owner authors the command; this host only binds its accepted result. */
export function createNativeSelectedQuestCommand(session: NativeSelectedSession, questId: string) {
  if (!isNativeSelectedGameplaySource(session)) throw new Error('Native selected quest source is invalid.');
  return createPlayerQuestAcceptanceCommand(session.snapshot as unknown as SaveSnapshot, questId);
}

export function applyNativeSelectedQuest(session: NativeSelectedSession,
  command: PlayerQuestAcceptanceCommand): Outcome {
  if (!isNativeSelectedGameplaySource(session)) return { status: 'rejected', session, reason: 'invalid_source' };
  const result = executePlayerQuestAcceptanceCommand(session.snapshot as unknown as SaveSnapshot, command);
  if (!result.accepted) return { status: result.code === 'stale_snapshot' ? 'stale' : 'rejected',
    session, reason: result.code };
  if (!isNativeTargetCampaignSnapshot(result.snapshot))
    return { status: 'rejected', session, reason: 'invalid_native_result' };
  return admit(session, `mutation.native.quest.${result.commandId}`, result.snapshot);
}

/** The established travel owner authors the command and all time/resource effects. */
export function createNativeSelectedTravelCommand(session: NativeSelectedSession, destinationId: string) {
  if (!isNativeSelectedGameplaySource(session)) throw new Error('Native selected travel source is invalid.');
  return createPlayerTravelCommand(session.snapshot as unknown as SaveSnapshot, destinationId);
}

export function applyNativeSelectedTravel(session: NativeSelectedSession,
  command: PlayerTravelCommand): Outcome {
  if (!isNativeSelectedGameplaySource(session)) return { status: 'rejected', session, reason: 'invalid_source' };
  const result = executePlayerTravelCommand(session.snapshot as unknown as SaveSnapshot, command);
  if (!result.accepted) return { status: result.code === 'stale_snapshot' ||
    result.code === 'stale_origin' ? 'stale' : 'rejected', session, reason: result.code };
  if (!isNativeTargetCampaignSnapshot(result.snapshot))
    return { status: 'rejected', session, reason: 'invalid_native_result' };
  return admit(session, `mutation.native.travel.${result.commandId}`, result.snapshot);
}

/** Each stage binds an exact ready account head; the next stage waits for descendant Save. */
export async function advanceNativeSelectedSurvey(owner: ReadOwner,
  session: NativeSelectedSession, requestId: string): Promise<Outcome> {
  if (!isNativeSelectedGameplaySource(session)) return { status: 'rejected', session, reason: 'invalid_source' };
  try {
    const account = await owner.readSelected(session.snapshot.accountId);
    if (!account || account.revision !== session.accountRevision)
      return { status: 'stale', session, reason: 'account_revision_changed' };
    const slot = await owner.readSlot(session.snapshot.accountId, session.sourceSlotId);
    if (slot.status !== 'ready') return { status: 'rejected', session, reason: `slot_${slot.status}` };
    const retained = slot.loaded;
    const head = retained.sessionControl;
    if (!isNativeTargetCampaignSnapshot(retained.snapshot) ||
        head.loadedArtifactId !== session.sourceAddress.artifactId ||
        head.loadedPublicationId !== session.sourceAddress.publicationId ||
        head.campaignId !== session.control.campaignId ||
        head.campaignHeadRevision !== session.control.campaignHeadRevision ||
        head.loadedContinuityId !== session.control.loadedContinuityId)
      return { status: 'stale', session, reason: 'retained_head_changed' };
    const mutationId = `mutation.native.survey.${requestId}`;
    if (session.snapshot.nativeSurvey?.receipts.some(row => row.requestId === requestId)) {
      const retainedResult = session.control.retainedMutationResults.some(row =>
        row.mutationId === mutationId && JSON.stringify(row.snapshot) === JSON.stringify(session.snapshot));
      if ((!session.control.hasUnpublishedGameplayState &&
           JSON.stringify(retained.snapshot) === JSON.stringify(session.snapshot)) ||
          (session.control.hasUnpublishedGameplayState && retainedResult &&
           session.control.lastAcceptedMutationId === mutationId))
        return { status: 'duplicate', session, reason: 'retained_request' };
      return { status: 'stale', session, reason: 'request_source_changed' };
    }
    if (session.control.hasUnpublishedGameplayState || session.control.posture !== 'at_head')
      return { status: 'rejected', session, reason: 'save_current_stage_first' };
    if (JSON.stringify(retained.snapshot) !== JSON.stringify(session.snapshot))
      return { status: 'stale', session, reason: 'selected_snapshot_differs_from_head' };
    const sourceIdentity: NativeSurveySourceIdentity = {
      accountId: session.snapshot.accountId, campaignId: head.campaignId,
      continuityId: head.loadedContinuityId, artifactId: head.loadedArtifactId,
      publicationId: head.loadedPublicationId, revision: head.loadedHeadRevision
    };
    const prepared = prepareNativeSurveySource(retained.snapshot, sourceIdentity);
    if (!prepared.accepted) return { status: 'rejected', session, reason: prepared.code };
    const committed = commitNativeSurveyShift({ snapshot: retained.snapshot,
      sourceIdentity, witness: prepared.witness }, requestId);
    const admitted = admit(session, mutationId, committed.snapshot);
    return admitted.status === 'accepted' ? { ...admitted, stage: committed.result.stage } : admitted;
  } catch (error) {
    return { status: 'rejected', session,
      reason: error instanceof Error ? error.message : String(error) };
  }
}
