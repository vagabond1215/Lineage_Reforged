import type { SaveSnapshot, SoundingsTurnInNormalizedIntentState, SoundingsTurnInResultState, SoundingsTurnInConsequenceReceiptState, UiTone } from "../../../shared/types/src/index.js";
import { isTargetCampaignSnapshot } from "./campaign-rules.js";
import { preparePlayerSurveyCampaignMutation, commitPreparedPlayerSurveyCampaignMutation, isSoundingsCampaignControlCoherent, admitCampaignMutation, type CampaignSessionControl } from "./campaign-session.js";
import { synchronizeGameplaySnapshot } from "./gameplay-snapshot-sync.js";
import { resolvePlayerSoundingsTurnIn } from "./soundings-turn-in-readiness.js";
import { SOUNDINGS_QUEST_ID, SOUNDINGS_OPERATION_ID, SOUNDINGS_REQUEST_PATTERN, SOUNDINGS_RECEIPT_KINDS, soundingsIds, serializeSoundingsIntent, isSoundingsIntent, soundingsCompletionActivity, soundingsCompletionNotice, soundingsChronicle, soundingsNotification, buildSoundingsReceipts, repairSoundingsTurnInProjections, fingerprintSoundingsState, retainSoundingsSource } from "./soundings-turn-in-authority.js";
export { resolvePlayerSoundingsTurnIn } from "./soundings-turn-in-readiness.js";

type Notice = { tone: UiTone; title: string; detail: string };
export interface PlayerSoundingsTurnInCommand {
  version: 1;
  type: "player.soundings.turn_in";
  requestId: string;
  commandId: string;
  normalizedIntent: SoundingsTurnInNormalizedIntentState;
  canonicalIntent: string;
}
export interface PlayerSoundingsTurnInOutcome {
  accepted: boolean;
  duplicate: boolean;
  code: string;
  requestId: string | null;
  result: SoundingsTurnInResultState | null;
  receipts: SoundingsTurnInConsequenceReceiptState[];
  notice: Notice;
  snapshot: SaveSnapshot;
  control: CampaignSessionControl;
}
const unavailable = (detail: string): Notice => ({ tone: "warning", title: "Soundings not submitted", detail });
function commandFor(requestId: string, normalizedIntent: SoundingsTurnInNormalizedIntentState): PlayerSoundingsTurnInCommand {
  return { version: 1, type: "player.soundings.turn_in", requestId, commandId: soundingsIds(requestId).commandId, normalizedIntent: structuredClone(normalizedIntent), canonicalIntent: serializeSoundingsIntent(normalizedIntent) };
}
export function preparePlayerSoundingsTurnInCommand(snapshot: SaveSnapshot, control: CampaignSessionControl, requestId: string):
  | { kind: "prepared"; command: PlayerSoundingsTurnInCommand; notice: Notice }
  | { kind: "expected_rejection"; code: string; notice: Notice } {
  const reject = (code: string, detail: string) => ({ kind: "expected_rejection" as const, code, notice: unavailable(detail) });
  try {
    if (!SOUNDINGS_REQUEST_PATTERN.test(requestId)) return reject("malformed_command", "Invalid submission request identity.");
    if (!isTargetCampaignSnapshot(snapshot) || !isSoundingsCampaignControlCoherent(control, snapshot)) return reject("invalid_authority", "Campaign or session authority is malformed or conflicting.");
    const retained = snapshot.authorityLedger?.soundingsTurnIn?.requests.find(r => r.requestId === requestId);
    if (retained) return { kind: "prepared", command: commandFor(requestId, retained.normalizedIntent), notice: soundingsCompletionNotice() };
    const readiness = resolvePlayerSoundingsTurnIn(snapshot);
    if (!readiness.accepted) return { kind: "expected_rejection", code: readiness.code, notice: readiness.notice };
    const identity = snapshot.campaignIdentity!;
    const intent: SoundingsTurnInNormalizedIntentState = { version: 1, accountId: snapshot.accountId!, campaignId: identity.campaignId, characterId: identity.characterId, questId: SOUNDINGS_QUEST_ID, sourceContinuityId: identity.continuityId, sourceArtifactId: control.loadedArtifactId, sourcePublicationId: control.loadedPublicationId, sourceRevision: control.sessionRevision, expectedRevision: control.sessionRevision, expectedTick: snapshot.clock.tick, expectedSnapshotVersion: snapshot.snapshotVersion, expectedLocationId: "settlement.starfall_port", sourceSnapshot: retainSoundingsSource(snapshot), snapshotFingerprint: fingerprintSoundingsState(snapshot), surveyFingerprint: fingerprintSoundingsState(snapshot.authorityLedger!.ashenReefSurvey) };
    return { kind: "prepared", command: commandFor(requestId, intent), notice: readiness.notice };
  } catch { return reject("invalid_authority", "The submission could not be prepared from valid retained authority."); }
}

export function executePlayerSoundingsTurnInCommand(snapshot: SaveSnapshot, control: CampaignSessionControl, input: unknown): PlayerSoundingsTurnInOutcome {
  let requestId: string | null = null;
  const reject = (code: string, detail: string): PlayerSoundingsTurnInOutcome => ({ accepted: false, duplicate: false, code, requestId, result: null, receipts: [], notice: unavailable(detail), snapshot, control });
  try {
    const command = input as PlayerSoundingsTurnInCommand | null;
    if (!command || typeof command !== "object" || command.version !== 1 || command.type !== "player.soundings.turn_in" || !SOUNDINGS_REQUEST_PATTERN.test(command.requestId) || !isSoundingsIntent(command.normalizedIntent) || serializeSoundingsIntent(command) !== serializeSoundingsIntent(commandFor(command.requestId, command.normalizedIntent))) return reject("malformed_command", "The submission command is malformed or internally inconsistent.");
    requestId = command.requestId;
    const intent = command.normalizedIntent;
    // Retained graphs and live session identity are validated BEFORE duplicate classification.
    if (!isTargetCampaignSnapshot(snapshot) || !isSoundingsCampaignControlCoherent(control, snapshot)) return reject("invalid_authority", "Retained campaign, survey, submission, or session authority is conflicting.");
    if (intent.accountId !== snapshot.accountId || intent.campaignId !== snapshot.campaignIdentity!.campaignId || intent.characterId !== snapshot.playerState.playerId) return reject("wrong_campaign", "This request belongs to another player or campaign.");
    const authority = snapshot.authorityLedger?.soundingsTurnIn;
    const retained = authority?.requests.find(r => r.requestId === requestId);
    if (retained) {
      if (retained.canonicalIntent !== command.canonicalIntent) return reject("request_conflict", "The retained request identity was reused for different intent.");
      const result = authority!.results[0]!;
      const repaired = structuredClone(snapshot);
      if (repairSoundingsTurnInProjections(repaired)) {
        const admission = admitCampaignMutation(control, {
          mutationId: `${requestId}.projection_repair.${control.loadedArtifactId}.${control.sessionRevision}`,
          sourceArtifactId: control.loadedArtifactId, sourceRevision: control.sessionRevision,
          ownerKind: "engine_result", accepted: true, sourceSnapshot: snapshot, proposedSnapshot: repaired
        });
        if (!admission.accepted) return reject("transition_failed", "Completion projections could not be repaired; payment was not replayed.");
        return { accepted: true, duplicate: true, code: "projections_repaired", requestId, result: structuredClone(result), receipts: structuredClone(authority!.consequenceReceipts), notice: result.notice, snapshot: admission.snapshot, control: admission.control };
      }
      return { accepted: false, duplicate: true, code: "duplicate", requestId, result: structuredClone(result), receipts: structuredClone(authority!.consequenceReceipts), notice: result.notice, snapshot, control };
    }
    const readiness = resolvePlayerSoundingsTurnIn(snapshot);
    if (!readiness.accepted) return reject(readiness.code, readiness.reason);
    if (intent.expectedRevision !== control.sessionRevision || intent.sourceArtifactId !== control.loadedArtifactId || intent.sourcePublicationId !== control.loadedPublicationId || intent.sourceContinuityId !== snapshot.campaignIdentity!.continuityId || intent.expectedTick !== snapshot.clock.tick || intent.expectedSnapshotVersion !== snapshot.snapshotVersion || intent.snapshotFingerprint !== fingerprintSoundingsState(snapshot) || intent.surveyFingerprint !== fingerprintSoundingsState(snapshot.authorityLedger!.ashenReefSurvey)) return reject("stale_snapshot", "The campaign changed after the submission was prepared.");
    const preparation = preparePlayerSurveyCampaignMutation(control, { mutationId: requestId, sourceArtifactId: intent.sourceArtifactId, sourcePublicationId: intent.sourcePublicationId, sourceRevision: intent.sourceRevision, sourceSnapshot: snapshot });
    if (!preparation.accepted) return reject(preparation.reason, "Campaign admission did not authorize this submission.");
    let next = preparation.candidateSnapshot;
    const ids = soundingsIds(requestId);
    const occurrence = { version: 1 as const, requestId, occurrenceId: ids.occurrenceId, resultId: ids.resultId, campaignId: intent.campaignId, continuityId: preparation.acceptedContinuityId, characterId: intent.characterId, appliedTick: intent.expectedTick };
    const result: SoundingsTurnInResultState = { ...occurrence, code: "soundings_completed", questId: SOUNDINGS_QUEST_ID, payment: { gold: 5, silver: 0 }, currencyBefore: structuredClone(next.playerState.currency), trackingBefore: next.sessionState.trackedQuestId, operationBefore: structuredClone(next.sessionState.operations.find(o => o.id === SOUNDINGS_OPERATION_ID) ?? null), activityBefore: structuredClone(next.sessionState.currentActivity), timeLabel: `Day ${next.clock.day} · Tick ${next.clock.tick}`, requiredReceiptIds: SOUNDINGS_RECEIPT_KINDS.map(ids.receiptId), notice: soundingsCompletionNotice() };
    if (!Number.isSafeInteger(result.currencyBefore.gold + 5)) return reject("invalid_authority", "The payment cannot be represented safely.");
    const receipts = buildSoundingsReceipts(result);
    next.authorityLedger!.soundingsTurnIn = { version: 1, requests: [{ version: 1, requestId, commandId: ids.commandId, normalizedIntent: structuredClone(intent), canonicalIntent: command.canonicalIntent, acceptedContinuityId: preparation.acceptedContinuityId, occurrenceId: ids.occurrenceId, resultId: ids.resultId }], occurrences: [occurrence], results: [result], consequenceReceipts: receipts };
    const quest = next.sessionState.questJournal.find(q => q.id === SOUNDINGS_QUEST_ID)!;
    quest.category = "completed";
    quest.statusLabel = "Turned in";
    if (next.sessionState.trackedQuestId === SOUNDINGS_QUEST_ID) next.sessionState.trackedQuestId = null;
    next.playerState.currency.gold += 5;
    next.sessionState.operations = next.sessionState.operations.filter(o => o.id !== SOUNDINGS_OPERATION_ID);
    next.sessionState.currentActivity = soundingsCompletionActivity();
    next.sessionState.chronicle.unshift(soundingsChronicle(result));
    next.sessionState.notifications.unshift(soundingsNotification(result));
    next = synchronizeGameplaySnapshot(next);
    const admission = commitPreparedPlayerSurveyCampaignMutation(control, snapshot, preparation, next, ids.resultId);
    if (!admission.accepted) return reject("transition_failed", "The submission transition was not admitted; no payment or completion was applied.");
    return { accepted: true, duplicate: false, code: "soundings_completed", requestId, result, receipts, notice: result.notice, snapshot: admission.snapshot, control: admission.control };
  } catch { return reject("transition_failed", "The submission transition failed; no payment or completion was applied."); }
}
