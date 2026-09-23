import type { SaveSnapshot, SoundingsAdmissionWitness, SoundingsAdmissionWitnessFacts } from "../../../shared/types/src/index.js";
import type { CampaignSessionControl } from "./campaign-session.js";
import { fingerprintSoundingsState, serializeSoundingsIntent, SOUNDINGS_QUEST_ID, SOUNDINGS_REQUEST_PATTERN, soundingsIds, validateSoundingsTurnInAuthority } from "./soundings-turn-in-authority.js";

const factKeys = ["version", "witnessId", "requestId", "accountId", "campaignId", "characterId", "questId", "sourceArtifactId", "sourcePublicationId", "sourceRevision", "sourceContinuityId", "acceptedContinuityId", "sourceSnapshotFingerprint", "surveyFingerprint", "canonicalIntentFingerprint", "occurrenceId", "resultId", "acceptedTick"] as const;
const nonblank = (value: unknown): value is string => typeof value === "string" && value.length > 0 && value.trim() === value;
const integer = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;

export function soundingsWitnessFacts(witness: SoundingsAdmissionWitness): SoundingsAdmissionWitnessFacts {
  return Object.fromEntries(factKeys.map(key => [key, witness[key]])) as unknown as SoundingsAdmissionWitnessFacts;
}

export function isSoundingsAdmissionWitness(value: unknown): value is SoundingsAdmissionWitness {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const w = value as SoundingsAdmissionWitness;
  if (w.version !== 1 || w.questId !== SOUNDINGS_QUEST_ID || !nonblank(w.requestId) || !SOUNDINGS_REQUEST_PATTERN.test(w.requestId)) return false;
  if (![w.accountId,w.campaignId,w.characterId,w.sourceArtifactId,w.sourcePublicationId,w.sourceContinuityId,w.acceptedContinuityId].every(nonblank) || ![w.sourceRevision,w.acceptedTick].every(integer)) return false;
  if (![w.sourceSnapshotFingerprint,w.surveyFingerprint,w.canonicalIntentFingerprint].every(x => typeof x === "string" && /^[a-f0-9]{64}$/.test(x))) return false;
  const ids = soundingsIds(w.requestId);
  if (w.witnessId !== `soundings_admission_witness.${fingerprintSoundingsState([w.accountId,w.campaignId,w.requestId])}` || w.resultId !== ids.resultId || w.occurrenceId !== ids.occurrenceId) return false;
  const durable = w.posture === "pending" || w.posture === "applied";
  if (!durable && w.posture !== "session") return false;
  if (durable && (!nonblank(w.firstDurableArtifactId) || !nonblank(w.firstDurablePublicationId) || !integer(w.firstDurableHeadRevision))) return false;
  const keys: readonly string[] = durable ? [...factKeys,"posture","firstDurableArtifactId","firstDurablePublicationId","firstDurableHeadRevision"] : [...factKeys,"posture"];
  return Object.keys(w).length === keys.length && Object.keys(w).every(key => keys.includes(key));
}

/** Comparison material only. This does not mint or authorize a witness. */
function snapshotFacts(snapshot: SaveSnapshot): SoundingsAdmissionWitnessFacts {
  const authority = snapshot.authorityLedger!.soundingsTurnIn!;
  const request = authority.requests[0]!, intent = request.normalizedIntent, result = authority.results[0]!;
  return {
    version: 1, witnessId: `soundings_admission_witness.${fingerprintSoundingsState([intent.accountId,intent.campaignId,request.requestId])}`,
    requestId: request.requestId, accountId: intent.accountId, campaignId: intent.campaignId, characterId: intent.characterId, questId: SOUNDINGS_QUEST_ID,
    sourceArtifactId: intent.sourceArtifactId, sourcePublicationId: intent.sourcePublicationId, sourceRevision: intent.sourceRevision,
    sourceContinuityId: intent.sourceContinuityId, acceptedContinuityId: request.acceptedContinuityId,
    sourceSnapshotFingerprint: intent.snapshotFingerprint, surveyFingerprint: intent.surveyFingerprint,
    canonicalIntentFingerprint: fingerprintSoundingsState(intent), occurrenceId: result.occurrenceId, resultId: result.resultId, acceptedTick: result.appliedTick
  };
}

export type SoundingsAdmissionVerificationContext = Pick<CampaignSessionControl, "soundingsAdmissionWitness" | "retainedMutationResults">;
export function verifySoundingsAdmissionProvenance(snapshot: SaveSnapshot, context?: SoundingsAdmissionVerificationContext): "not_completed" | "verified" | "legacy_unverified" | "missing_witness" | "invalid_witness" {
  try {
    const authority = snapshot.authorityLedger?.soundingsTurnIn;
    if (!validateSoundingsTurnInAuthority(snapshot)) return "invalid_witness";
    if (!authority?.requests.length) return "not_completed";
    const witness = context?.soundingsAdmissionWitness;
    if (!witness) return authority.version === 1 ? "legacy_unverified" : "missing_witness";
    if (!isSoundingsAdmissionWitness(witness) || witness.posture === "pending" || serializeSoundingsIntent(soundingsWitnessFacts(witness)) !== serializeSoundingsIntent(snapshotFacts(snapshot))) return "invalid_witness";
    if (witness.posture === "session") {
      const retained = context!.retainedMutationResults.filter(entry => entry.mutationId === witness.requestId);
      if (retained.length !== 1 || retained[0]!.resultId !== witness.resultId || !validateSoundingsTurnInAuthority(retained[0]!.snapshot) || serializeSoundingsIntent(snapshotFacts(retained[0]!.snapshot)) !== serializeSoundingsIntent(soundingsWitnessFacts(witness))) return "invalid_witness";
    }
    return "verified";
  } catch { return "invalid_witness"; }
}
