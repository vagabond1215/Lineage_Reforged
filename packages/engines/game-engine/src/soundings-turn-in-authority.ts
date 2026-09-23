import type { ChronicleEventState, CurrentActivityState, NotificationState, SaveSnapshot, SoundingsTurnInConsequenceKind, SoundingsTurnInConsequenceReceiptState, SoundingsTurnInNormalizedIntentState, SoundingsTurnInResultState } from "../../../shared/types/src/index.js";
import { isTargetCampaignSnapshot } from "./campaign-rules.js";
import { getCurrentPlayerTravelLocationId } from "./player-travel-rules.js";
import { soundingsSha256 } from "./soundings-fingerprint.js";
import { verifySoundingsAdmissionProvenance, type SoundingsAdmissionVerificationContext } from "./soundings-admission-witness.js";

export const SOUNDINGS_QUEST_ID = "quest.ashen_reef_survey" as const;
export const SOUNDINGS_OPERATION_ID = "operation.quest.ashen_reef_survey";
export const SOUNDINGS_REQUEST_PATTERN = /^soundings_turn_in_request\.([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;
export const SOUNDINGS_RECEIPT_KINDS: readonly SoundingsTurnInConsequenceKind[] = ["quest_completion", "currency_credit", "tracking_clear", "operation_close", "activity_transition", "chronicle_projection", "notification_projection"];

/** Canonical full material serialization: no lossy hash can collapse distinct intents. */
export function serializeSoundingsIntent(value: unknown): string {
  function normalize(input: unknown): unknown {
    if (input === null || typeof input === "string" || typeof input === "boolean") return input;
    if (typeof input === "number" && Number.isFinite(input)) return input;
    if (Array.isArray(input)) return input.map(normalize);
    if (input && typeof input === "object") return Object.fromEntries(Object.keys(input).sort().map(key => [key, normalize((input as Record<string, unknown>)[key])]));
    throw new Error("Non-JSON Soundings authority");
  }
  return JSON.stringify(normalize(value));
}

export function soundingsIds(requestId: string) {
  const suffix = SOUNDINGS_REQUEST_PATTERN.exec(requestId)?.[1];
  if (!suffix) throw new Error("Invalid Soundings request id");
  return { commandId: `command.player.soundings.turn_in.${suffix}`, occurrenceId: `soundings_turn_in_occurrence.${suffix}`, resultId: `soundings_turn_in_result.${suffix}`, receiptId: (kind: string) => `soundings_turn_in_receipt.${suffix}.${kind}`, chronicleId: `soundings_turn_in_chronicle.${suffix}`, notificationId: `soundings_turn_in_notification.${suffix}` };
}

export const fingerprintSoundingsState = (value: unknown): string => soundingsSha256(serializeSoundingsIntent(value));
export function retainSoundingsSource(snapshot: SaveSnapshot): string {
  const source = structuredClone(snapshot);
  // The immutable survey graph is already retained once by its own owner.
  delete source.authorityLedger!.ashenReefSurvey;
  return serializeSoundingsIntent(source);
}

export function isSoundingsIntent(value: unknown): value is SoundingsTurnInNormalizedIntentState {
  if (!value || typeof value !== "object") return false;
  const v = value as SoundingsTurnInNormalizedIntentState;
  return v.version === 1 && v.questId === SOUNDINGS_QUEST_ID && v.expectedLocationId === "settlement.starfall_port" &&
    [v.accountId,v.campaignId,v.characterId,v.sourceContinuityId,v.sourceArtifactId,v.sourcePublicationId,v.expectedSnapshotVersion,v.sourceSnapshot].every(x => typeof x === "string" && x.length > 0 && x.trim() === x) &&
    [v.snapshotFingerprint,v.surveyFingerprint].every(x => typeof x === "string" && /^[a-f0-9]{64}$/.test(x)) &&
    [v.sourceRevision,v.expectedRevision,v.expectedTick].every(x => Number.isSafeInteger(x) && x >= 0) && v.sourceRevision === v.expectedRevision &&
    Object.keys(v).length === 16;
}

export function soundingsCompletionActivity(): CurrentActivityState {
  return { id: "activity.soundings.submitted", label: "Soundings Submitted", category: "Contract", detail: "The Starfall Harbormaster's Office accepted the survey packet. Contract completed; 5 gold received." };
}
export function soundingsCompletionNotice() {
  return { tone: "success" as const, title: "Soundings completed — 5 gold received", detail: "The Starfall Harbormaster's Office accepted your survey packet and paid 5 gold." };
}
export function soundingsChronicle(result: SoundingsTurnInResultState): ChronicleEventState {
  return { id: soundingsIds(result.requestId).chronicleId, category: "social", title: "Soundings submitted at Starfall", timeLabel: result.timeLabel, summary: "The Starfall Harbormaster's Office accepted the survey packet and completed the contract.", statusLabel: "Completed · 5 gold received", entities: ["Soundings of Ashen Reef", "Starfall Harbormaster's Office"], results: ["Contract completed", "Payment received: 5 gold"], statChanges: ["+5 gold"], tags: ["Contract", "Starfall"] };
}
export function soundingsNotification(result: SoundingsTurnInResultState): NotificationState {
  return { id: soundingsIds(result.requestId).notificationId, ...soundingsCompletionNotice(), timeLabel: result.timeLabel };
}
export function buildSoundingsReceipts(result: SoundingsTurnInResultState): SoundingsTurnInConsequenceReceiptState[] {
  const ids = soundingsIds(result.requestId);
  const effects: Record<SoundingsTurnInConsequenceKind, Record<string, unknown>> = {
    quest_completion: { questId: SOUNDINGS_QUEST_ID, before: "active", after: "completed", statusLabel: "Turned in" },
    currency_credit: { currency: "gold", amount: 5, silver: 0, before: result.currencyBefore, after: { ...result.currencyBefore, gold: result.currencyBefore.gold + 5 } },
    tracking_clear: { before: result.trackingBefore, after: result.trackingBefore === SOUNDINGS_QUEST_ID ? null : result.trackingBefore },
    operation_close: { operationId: SOUNDINGS_OPERATION_ID, before: result.operationBefore, after: null },
    activity_transition: { before: result.activityBefore, after: soundingsCompletionActivity() },
    chronicle_projection: { projectionId: ids.chronicleId, row: soundingsChronicle(result) },
    notification_projection: { projectionId: ids.notificationId, row: soundingsNotification(result) }
  };
  return SOUNDINGS_RECEIPT_KINDS.map(kind => ({ version: 1, receiptId: ids.receiptId(kind), requestId: result.requestId, resultId: result.resultId, occurrenceId: result.occurrenceId, campaignId: result.campaignId, continuityId: result.continuityId, characterId: result.characterId, appliedTick: result.appliedTick, owner: "soundings_turn_in", posture: "applied", kind, effect: effects[kind] }));
}

/** Structural validation only; original admission provenance requires a save-owned witness. */
export function validateSoundingsTurnInAuthority(snapshot: SaveSnapshot): boolean {
  try {
    const a = snapshot.authorityLedger?.soundingsTurnIn;
    if (a === undefined) return true;
    if ((a.version !== 1 && a.version !== 2) || Object.keys(a).length !== 5 || ![a.requests,a.occurrences,a.results,a.consequenceReceipts].every(Array.isArray)) return false;
    if (a.requests.length === 0) return a.occurrences.length === 0 && a.results.length === 0 && a.consequenceReceipts.length === 0;
    if (a.requests.length !== 1 || a.occurrences.length !== 1 || a.results.length !== 1 || a.consequenceReceipts.length !== 7) return false;
    const request = a.requests[0]!, result = a.results[0]!, intent = request.normalizedIntent, identity = snapshot.campaignIdentity;
    if (!identity || !isSoundingsIntent(intent)) return false;
    const ids = soundingsIds(request.requestId);
    const ancestors = new Set<string>();
    let continuity: string | undefined = identity.continuityId;
    while (continuity) {
      if (ancestors.has(continuity)) return false;
      ancestors.add(continuity);
      continuity = snapshot.authorityLedger?.entries.find(e => e.kind === "continuity_fork" && e.childContinuityId === continuity)?.parentContinuityId;
    }
    if (!ancestors.has(result.continuityId) || !ancestors.has(intent.sourceContinuityId) || intent.accountId !== snapshot.accountId || intent.campaignId !== identity.campaignId || intent.characterId !== identity.characterId || intent.characterId !== snapshot.playerState.playerId || intent.expectedSnapshotVersion !== snapshot.snapshotVersion || intent.expectedTick > snapshot.clock.tick) return false;
    if (intent.surveyFingerprint !== fingerprintSoundingsState(snapshot.authorityLedger?.ashenReefSurvey)) return false;
    // Before-state facts must be recomputed from the retained source, not merely
    // repeated consistently in a result and its receipts. Disallow recursive
    // completed authority before invoking the shared deep campaign validator.
    const source = JSON.parse(intent.sourceSnapshot) as SaveSnapshot;
    if (!source.authorityLedger || source.authorityLedger.ashenReefSurvey !== undefined) return false;
    source.authorityLedger.ashenReefSurvey = snapshot.authorityLedger!.ashenReefSurvey!;
    if (fingerprintSoundingsState(source) !== intent.snapshotFingerprint) return false;
    if (source.authorityLedger?.soundingsTurnIn?.requests.length || !isTargetCampaignSnapshot(source) ||
      source.accountId !== intent.accountId || source.campaignIdentity?.campaignId !== intent.campaignId ||
      source.campaignIdentity?.characterId !== intent.characterId || source.campaignIdentity?.continuityId !== intent.sourceContinuityId ||
      source.clock.tick !== intent.expectedTick || source.snapshotVersion !== intent.expectedSnapshotVersion ||
      getCurrentPlayerTravelLocationId(source) !== "settlement.starfall_port" || source.playerState.location.settlementId !== "settlement.starfall_port" ||
      source.sessionState.questJournal.filter(q => q.id === SOUNDINGS_QUEST_ID && q.category === "active").length !== 1 ||
      fingerprintSoundingsState(source.authorityLedger?.ashenReefSurvey) !== intent.surveyFingerprint ||
      serializeSoundingsIntent(source.playerState.currency) !== serializeSoundingsIntent(result.currencyBefore) ||
      source.sessionState.trackedQuestId !== result.trackingBefore ||
      serializeSoundingsIntent(source.sessionState.operations.find(o => o.id === SOUNDINGS_OPERATION_ID) ?? null) !== serializeSoundingsIntent(result.operationBefore) ||
      serializeSoundingsIntent(source.sessionState.currentActivity) !== serializeSoundingsIntent(result.activityBefore) ||
      result.timeLabel !== `Day ${source.clock.day} · Tick ${source.clock.tick}`) return false;
    const survey = source.authorityLedger?.ashenReefSurvey;
    if (!survey || survey.results.length !== 4 || survey.results.map(r => r.stage).join(",") !== "sector_1,sector_2,sector_3,ruins_confirmation" || !survey.results[3]!.materialAfter.ruinsConfirmed || survey.corrections.some(c => c.reconciliations.some(r => r.status === "pending"))) return false;
    const expectedRequest = { version: 1, requestId: request.requestId, commandId: ids.commandId, normalizedIntent: intent, canonicalIntent: serializeSoundingsIntent(intent), acceptedContinuityId: result.continuityId, occurrenceId: ids.occurrenceId, resultId: ids.resultId };
    const occurrence = { version: 1, requestId: request.requestId, occurrenceId: ids.occurrenceId, resultId: ids.resultId, campaignId: identity.campaignId, continuityId: result.continuityId, characterId: identity.characterId, appliedTick: intent.expectedTick };
    if (serializeSoundingsIntent(request) !== serializeSoundingsIntent(expectedRequest) || serializeSoundingsIntent(a.occurrences[0]) !== serializeSoundingsIntent(occurrence)) return false;
    if (!result.currencyBefore || ![result.currencyBefore.gold,result.currencyBefore.silver,result.currencyBefore.copper].every(x => Number.isSafeInteger(x) && x >= 0) || !Number.isSafeInteger(result.currencyBefore.gold + 5) || (result.trackingBefore !== null && typeof result.trackingBefore !== "string") || typeof result.timeLabel !== "string" || !result.timeLabel.length) return false;
    const expectedResult = { ...occurrence, code: "soundings_completed", questId: SOUNDINGS_QUEST_ID, payment: { gold: 5, silver: 0 }, currencyBefore: result.currencyBefore, trackingBefore: result.trackingBefore, operationBefore: result.operationBefore, activityBefore: result.activityBefore, timeLabel: result.timeLabel, requiredReceiptIds: SOUNDINGS_RECEIPT_KINDS.map(ids.receiptId), notice: soundingsCompletionNotice() };
    if (serializeSoundingsIntent(result) !== serializeSoundingsIntent(expectedResult) || serializeSoundingsIntent(a.consequenceReceipts) !== serializeSoundingsIntent(buildSoundingsReceipts(result))) return false;
    // Projection identity cannot substitute for exact accepted projection facts.
    // Missing projections are repairable from receipts; conflicting rows fail closed.
    const chronicles = snapshot.sessionState.chronicle.filter(row => row.id === ids.chronicleId);
    const notifications = snapshot.sessionState.notifications.filter(row => row.id === ids.notificationId);
    if (chronicles.length > 1 || notifications.length > 1 || (chronicles.length === 1 && serializeSoundingsIntent(chronicles[0]) !== serializeSoundingsIntent(soundingsChronicle(result))) || (notifications.length === 1 && serializeSoundingsIntent(notifications[0]) !== serializeSoundingsIntent(soundingsNotification(result)))) return false;
    const quests = snapshot.sessionState.questJournal.filter(q => q.id === SOUNDINGS_QUEST_ID);
    return quests.length === 1 && quests[0]!.category === "completed" && quests[0]!.statusLabel === "Turned in" && snapshot.sessionState.trackedQuestId !== SOUNDINGS_QUEST_ID && !snapshot.sessionState.operations.some(o => o.id === SOUNDINGS_OPERATION_ID);
  } catch { return false; }
}

/** Rebuild presentation rows only with independently verified admission context. */
export function repairSoundingsTurnInProjections(snapshot: SaveSnapshot, requireCapacity = true, context?: SoundingsAdmissionVerificationContext): boolean {
  const result = snapshot.authorityLedger?.soundingsTurnIn?.results[0];
  if (!result || verifySoundingsAdmissionProvenance(snapshot, context) !== "verified") return false;
  let repaired = false;
  const source = JSON.parse(snapshot.authorityLedger!.soundingsTurnIn!.requests[0]!.normalizedIntent.sourceSnapshot) as SaveSnapshot;
  function restore<T extends { id: string }>(rows: T[], expected: T, prior: { id: string }[], cap: number): void {
    const current = rows.findIndex(row => row.id === expected.id);
    const others = rows.filter(row => row.id !== expected.id);
    // Insert before the first surviving pre-submission row; newer opaque rows
    // remain ahead of completion, and pre-existing rows retain their own order.
    const priorIds = new Set(prior.map(row => row.id));
    const anchor = others.findIndex(row => priorIds.has(row.id));
    const position = anchor < 0 ? others.length : anchor;
    if (current === position) return;
    if (current < 0 && rows.length >= cap) {
      if (requireCapacity) throw new Error("Completion projection capacity is full; no row may be evicted for repair.");
      return; // Ordinary feed trimming must not block unrelated accepted play.
    }
    others.splice(position, 0, expected);
    rows.splice(0, rows.length, ...others);
    repaired = true;
  }
  restore(snapshot.sessionState.chronicle, soundingsChronicle(result), source.sessionState.chronicle, 48);
  restore(snapshot.sessionState.notifications, soundingsNotification(result), source.sessionState.notifications, 12);
  return repaired;
}
