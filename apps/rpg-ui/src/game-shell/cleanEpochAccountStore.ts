import type { AccountProfileState, CampaignPublicationConsumerKind, SaveSnapshot, SoundingsAdmissionWitness } from "../../../../packages/shared/types/src/index.js";
import { createCampaignSessionControl } from "../../../../packages/engines/game-engine/src/campaign-session.js";
import { isSoundingsAdmissionWitness, verifySoundingsAdmissionProvenance } from "../../../../packages/engines/game-engine/src/soundings-admission-witness.js";
import { verifyPassword, type LocalAuthCredentialRecord } from "./launcherAuthManager.js";
import { isAccountProfileState } from "./accountProfileManager.js";
import { evaluateAchievementProgress, markRunDeleted } from "../../../../packages/engines/game-engine/src/achievements.js";
import { recordCampaignPublicationConsumer, type VerifiedCampaignPublication } from "../../../../packages/engines/game-engine/src/account-publication.js";
import { consumeSelectedLegacyPreparations, resolveLegacyPreparationSelection } from "../../../../packages/engines/game-engine/src/legacy-unlocks.js";
import { consumeRetiredRunInheritanceUse, resolveHeirSourceById } from "./runLifecycle.js";
import { createDefaultAccountProfileState } from "../../../../packages/engines/game-engine/src/legacy-account.js";
import { projectRetirementSettlement, retirementSettlementFingerprint, RETIREMENT_CONSUMERS } from "./cleanEpochTerminalProjection.js";
import { deserializeSnapshot } from "../../../../packages/shared/persistence/src/index.js";
import { isTargetCampaignSnapshot } from "../../../../packages/engines/game-engine/src/campaign-rules.js";
import { hasPendingNormalDefeat } from "../../../../packages/engines/game-engine/src/normal-defeat.js";
import { isStoredCampaignControl, isStoredSaveEnvelope, type CampaignPublicationConsumerPlan, type LoadedCampaignSave, type StoredSaveEnvelope } from "./saveManager.js";
import { SAVE_SLOT_ORDER, type SaveSlotId, type SaveSlotMetadata } from "./state.js";
import {
  CAMPAIGN_DATABASE_NAME,
  CampaignIndexedDbStore,
  CampaignStoreError,
  ensureCampaignPublicationStores,
  hasCampaignPublicationStores,
  type CampaignStorePublication,
  type CampaignStorePublishResult,
  type CampaignStoreReadback
} from "./campaignIndexedDbStore.js";

/** Clean-epoch account and campaign authority selected by the awaited App caller. */
export const CLEAN_EPOCH_DATABASE_NAME = "lineage.campaigns.epoch1";
export const CLEAN_EPOCH_DATABASE_VERSION = 7;
export const CLEAN_EPOCH_ACCOUNT_STORE = "accounts";
export const CLEAN_EPOCH_ATTEMPT_STORE = "newCampaignAttempts";
export const CLEAN_EPOCH_RECOVERY_STORE = "pendingPublicationRecoveries";
export const CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE = "descendantPublicationRecoveries";
export const CLEAN_EPOCH_TERMINAL_RECOVERY_STORE = "terminalLifecycleRecoveries";
export const CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE = "campaignAttemptsV6";
export const CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE = "firstPublicationRecoveriesV6";
export const CLEAN_EPOCH_SLOT_GENERATION_STORE = "currentSlotGenerations";
export const CLEAN_EPOCH_ADDRESS_DELETION_STORE = "addressDeletionReceipts";
export const CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE = "accountLifecycle";
export const CLEAN_EPOCH_SESSION_STORAGE_KEY = "cataclysm-rpg-ui.epoch1.session";
const ACCOUNT_DATA_STORES = [CLEAN_EPOCH_ATTEMPT_STORE, CLEAN_EPOCH_RECOVERY_STORE,
  CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
  CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE, CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE,
  CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE,
  "artifacts", "controls", "slots", "witnesses"] as const;

export type CleanEpochAccountRecord = {
  version: 1;
  accountId: string;
  revision: number;
  /** Missing only on retained v6 rows; their initial lifecycle generation is one. */
  lifecycleGeneration?: number;
  profile: AccountProfileState;
  credential: LocalAuthCredentialRecord;
};
export type CleanEpochAccountWriteResult = {
  status: "committed" | "same_source_retry";
  readback: CleanEpochAccountRecord;
};
/** A reservation, not an accepted campaign publication. One record owns one account slot. */
export type CleanEpochAttemptRecord = {
  version: 1;
  status: "prepared";
  accountId: string;
  slotId: string;
  campaignId: string;
  attemptId: string;
  expectedAccountRevision: number;
  expectedHead: null;
  inputFingerprint: string;
  snapshotRaw: string;
  consumerPlans: CampaignPublicationConsumerPlan[];
  createdAt: string;
};
export type CleanEpochAttemptWriteResult = {
  status: "committed" | "same_source_retry";
  readback: CleanEpochAttemptRecord;
};
export type CleanEpochSlotGeneration = {
  version: 1; accountId: string; slotId: SaveSlotId; slotGenerationId: string;
  campaignId: string; attemptId: string; status: "prepared" | "published" | "deleted";
};
export type CleanEpochAddressDeletionReceipt = {
  version: 1; accountId: string; slotId: SaveSlotId; slotGenerationId: string;
  campaignId: string; characterId: string; artifactId: string; publicationId: string;
  addressRaw: string; expectedAccountRevision: number; completedAccountRevision: number;
  reason: "player" | "terminal"; deletedAt: string;
};
export type CleanEpochAccountLifecycleReceipt = {
  version: 1; accountId: string; kind: "reset" | "delete";
  expectedRevision: number; expectedGeneration: number; completedGeneration: number;
  completedRevision: number | null; completedAt: string;
};
export type CleanEpochAccountLifecycleRequest = {
  accountId: string; expectedRevision: number; expectedGeneration: number;
  currentPassword: string;
};
export type CleanEpochAccountLifecycleResult = {
  status: "committed" | "same_source_retry";
  receipt: CleanEpochAccountLifecycleReceipt;
  account: CleanEpochAccountRecord | null;
};
export type CleanEpochAddressDeletionRequest = {
  accountId: string; slotId: SaveSlotId; expectedAccountRevision: number;
  expectedSlotGenerationId: string; expectedAddress: { artifactId: string; publicationId: string };
  deletedAt: string;
};
export type CleanEpochAddressDeletionResult = {
  status: "committed" | "same_source_retry";
  account: CleanEpochAccountRecord; receipt: CleanEpochAddressDeletionReceipt;
};
export type CleanEpochTerminalClosureResult = {
  status: "committed" | "same_source_retry";
  account: CleanEpochAccountRecord; recovery: CleanEpochTerminalRecovery;
};
function checkedSlotGeneration(value: unknown, accountId: string, slotId: string): CleanEpochSlotGeneration {
  if (!object(value) || value.version !== 1 || value.accountId !== accountId ||
      value.slotId !== slotId || !nonblank(value.slotGenerationId) ||
      !nonblank(value.campaignId) || !nonblank(value.attemptId) ||
      !["prepared", "published", "deleted"].includes(value.status as string))
    fail("invalid_record", "Current slot generation is malformed.");
  return value as CleanEpochSlotGeneration;
}
function validAddressDeletionReceipt(value: unknown, pointer: CleanEpochSlotGeneration,
  account: CleanEpochAccountRecord): value is CleanEpochAddressDeletionReceipt {
  if (!object(value) || value.version !== 1 || value.accountId !== pointer.accountId ||
      value.slotId !== pointer.slotId || value.slotGenerationId !== pointer.slotGenerationId ||
      value.campaignId !== pointer.campaignId || !nonblank(value.characterId) ||
      !nonblank(value.artifactId) || !nonblank(value.publicationId) ||
      typeof value.addressRaw !== "string" || !nonblank(value.deletedAt) ||
      !["player", "terminal"].includes(value.reason as string) ||
      !Number.isSafeInteger(value.expectedAccountRevision) ||
      value.completedAccountRevision !== (value.expectedAccountRevision as number) + 1 ||
      account.revision < (value.completedAccountRevision as number)) return false;
  try {
    const envelope = envelopeFromRaw(value.addressRaw);
    const runs = account.profile.history.runRecords.filter(run => run.characterId === value.characterId);
    return envelope.accountId === pointer.accountId && envelope.slotId === pointer.slotId &&
      envelope.campaignId === pointer.campaignId && envelope.characterId === value.characterId &&
      envelope.artifactId === value.artifactId && envelope.publicationId === value.publicationId &&
      runs.length === 1 && !runs[0]!.saveSlotIds.includes(pointer.slotId);
  } catch { return false; }
}
/** Publication recovery records the exact pending or completed account-consumer transition. */
type CleanEpochRecoveryBase = {
  version: 1;
  accountId: string;
  slotId: string;
  campaignId: string;
  attemptId: string;
  artifactId: string;
  generationId: string;
  publicationId: string;
  headRevision: 1;
  expectedAccountRevision: number;
  envelopeRaw: string;
  witnessRequestId: string | null;
  consumerPlans: CampaignPublicationConsumerPlan[];
  createdAt: string;
  updatedAt: string;
};
export type CleanEpochPublicationRecovery = CleanEpochRecoveryBase & (
  { status: "accepted_pending_consumers"; completedConsumerKinds: []; completedAccountRevision?: never } |
  { status: "consumers_completed"; completedConsumerKinds: CampaignPublicationConsumerKind[]; completedAccountRevision: number }
);
export type CleanEpochFirstPublicationResult = {
  publication: CampaignStorePublishResult;
  recovery: CleanEpochPublicationRecovery;
};
/** Every accepted descendant retains its own source, predecessor and consumer evidence. */
export type CleanEpochDescendantRecovery = {
  version: 1;
  status: "accepted_pending_consumers" | "consumers_completed";
  accountId: string;
  campaignId: string;
  slotId: string;
  sourceSlotId: string;
  expectedSlotAddress: { artifactId: string; publicationId: string } | null;
  artifactId: string;
  generationId: string;
  publicationId: string;
  headRevision: number;
  expectedHead: NonNullable<CampaignStorePublication["expectedHead"]>;
  expectedAccountRevision: number;
  sourceArtifactId: string;
  sourcePublicationId: string;
  sourceSnapshotRaw: string;
  envelopeRaw: string;
  witnessRequestId: string | null;
  consumerPlans: CampaignPublicationConsumerPlan[];
  completedConsumerKinds: CampaignPublicationConsumerKind[];
  completedAccountRevision?: number;
  createdAt: string;
};
export type CleanEpochDescendantRequest = {
  publication: CampaignStorePublication;
  /** The session witness minted by accepted gameplay, before any durable promotion. */
  sessionWitness?: SoundingsAdmissionWitness;
  expectedAccountRevision: number;
  sourceArtifactId: string;
  sourceSlotId: SaveSlotId;
  sourcePublicationId: string;
  sourceSnapshotRaw: string;
  consumerPlans: CampaignPublicationConsumerPlan[];
};
export type CleanEpochDescendantResult = {
  publication: CampaignStorePublishResult;
  recovery: CleanEpochDescendantRecovery;
};
export type CleanEpochTerminalRecovery = {
  version: 1;
  status: "accepted_pending_settlement" | "settlement_completed";
  accountId: string;
  campaignId: string;
  characterId: string;
  slotId: SaveSlotId;
  sourceArtifactId: string;
  sourcePublicationId: string;
  sourceSnapshotRaw: string;
  sourceAddress: { artifactId: string; publicationId: string };
  expectedHead: NonNullable<CampaignStorePublication["expectedHead"]>;
  expectedAccountRevision: number;
  sourceProfile: AccountProfileState;
  artifactId: string;
  publicationId: string;
  envelopeRaw: string;
  archiveReason: "retired";
  addressSlotIds: SaveSlotId[];
  consumerPlans: CampaignPublicationConsumerPlan[];
  settlementFingerprint: string;
  payoutTransactionId: string | null;
  estateSourceRunId: string;
  estateDepositId: string;
  completedAccountRevision?: number;
  addressClosure?: { completedAccountRevision: number; closedAt: string;
    receipts: { slotId: SaveSlotId; slotGenerationId: string; artifactId: string; publicationId: string }[] };
  createdAt: string;
};
export type CleanEpochTerminalRequest = {
  publication: CampaignStorePublication;
  sessionWitness?: SoundingsAdmissionWitness;
  expectedAccountRevision: number;
  sourceArtifactId: string;
  sourcePublicationId: string;
  sourceSnapshotRaw: string;
  sourceAddress: { artifactId: string; publicationId: string };
  addressSlotIds: SaveSlotId[];
  consumerPlans: CampaignPublicationConsumerPlan[];
};
export type CleanEpochConsumerCompletionResult = {
  status: "committed" | "same_source_retry";
  account: CleanEpochAccountRecord;
  recovery: CleanEpochPublicationRecovery & { status: "consumers_completed" };
};
export type CleanEpochSlotStatus = "empty" | "prepared" | "pending_consumers" | "ready" | "closed" | "descendant_unsupported";
export type CleanEpochSlotSummary = { slotId: SaveSlotId; status: CleanEpochSlotStatus; metadata: SaveSlotMetadata | null };
export type CleanEpochSlotRead =
  | (CleanEpochSlotSummary & { status: "ready"; loaded: LoadedCampaignSave })
  | (CleanEpochSlotSummary & { status: Exclude<CleanEpochSlotStatus, "ready">; loaded?: never });
export type CleanEpochAccountStoreOptions = {
  name?: string;
  factory?: IDBFactory;
  /** Synthetic QA fault injection only. */
  beforeWrite?: (transaction: IDBTransaction) => void;
  afterWrite?: (transaction: IDBTransaction) => void;
};

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function nonblank(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.trim() === value;
}
function fail(code: ConstructorParameters<typeof CampaignStoreError>[0], message: string): never {
  throw new CampaignStoreError(code, message);
}
function classify(error: unknown, fallback: ConstructorParameters<typeof CampaignStoreError>[0]): CampaignStoreError {
  if (error instanceof CampaignStoreError) return error;
  if (object(error) && error.name === "QuotaExceededError") return new CampaignStoreError("quota", "Clean-epoch account quota exceeded.", error);
  return new CampaignStoreError(fallback, "Clean-epoch account transaction failed.", error);
}
function requestValue<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function complete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new DOMException("Transaction aborted", "AbortError"));
    transaction.onerror = () => { /* onabort carries the final transaction result */ };
  });
}
function exactEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
function decodedLength(value: unknown): number {
  if (typeof value !== "string" || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) return -1;
  try { return atob(value).length; } catch { return -1; }
}
function validCredential(value: unknown, accountId: string): value is LocalAuthCredentialRecord {
  return object(value) && value.accountId === accountId && value.providerId === "local_password" &&
    value.credentialVersion === "pbkdf2_sha256_v1" && value.iterations === 120_000 &&
    decodedLength(value.saltBase64) === 16 && decodedLength(value.derivedKeyBase64) === 32 &&
    nonblank(value.createdAt) && nonblank(value.updatedAt) &&
    (value.lastSignedInAt === undefined || nonblank(value.lastSignedInAt));
}
function validProfile(value: unknown, accountId: string): value is AccountProfileState {
  return isAccountProfileState(value) && value.accountId === accountId &&
    nonblank(value.displayName) && nonblank(value.createdAt) && nonblank(value.updatedAt) &&
    value.achievements !== undefined && value.history !== undefined && value.estate !== undefined &&
    value.campaignPublicationReceipts !== undefined;
}
function validAccount(value: unknown, accountId: string): value is CleanEpochAccountRecord {
  return object(value) && value.version === 1 && value.accountId === accountId &&
    Number.isSafeInteger(value.revision) && (value.revision as number) >= 1 &&
    (value.lifecycleGeneration === undefined ||
      (Number.isSafeInteger(value.lifecycleGeneration) && (value.lifecycleGeneration as number) >= 1)) &&
    validProfile(value.profile, accountId) && validCredential(value.credential, accountId);
}
export function accountLifecycleGeneration(account: CleanEpochAccountRecord): number {
  return account.lifecycleGeneration ?? 1;
}
function checkedLifecycle(value: unknown, accountId: string): CleanEpochAccountLifecycleReceipt {
  if (!object(value) || value.version !== 1 || value.accountId !== accountId ||
      (value.kind !== "reset" && value.kind !== "delete") ||
      !Number.isSafeInteger(value.expectedRevision) || (value.expectedRevision as number) < 1 ||
      !Number.isSafeInteger(value.expectedGeneration) || (value.expectedGeneration as number) < 1 ||
      value.completedGeneration !== (value.expectedGeneration as number) + 1 ||
      value.completedRevision !== (value.kind === "reset" ? (value.expectedRevision as number) + 1 : null) ||
      !nonblank(value.completedAt)) fail("invalid_record", "Account lifecycle receipt is malformed.");
  return value as CleanEpochAccountLifecycleReceipt;
}
function checkedAccount(value: unknown, accountId: string): CleanEpochAccountRecord {
  if (!validAccount(value, accountId)) fail("invalid_record", "Retained clean-epoch account is malformed or mismatched.");
  return value;
}
const CONSUMER_KINDS = new Set([
  "active_history", "account_achievements", "legacy_rewards", "preparation_consumption",
  "inheritance_consumption", "retirement_settlement", "estate", "last_played"
]);
function validAttempt(value: unknown, accountId: string, slotId: string): value is CleanEpochAttemptRecord {
  if (!object(value) || value.version !== 1 || value.status !== "prepared" ||
      value.accountId !== accountId || value.slotId !== slotId ||
      !nonblank(value.campaignId) || !nonblank(value.attemptId) ||
      !Number.isSafeInteger(value.expectedAccountRevision) || (value.expectedAccountRevision as number) < 1 ||
      value.expectedHead !== null || !nonblank(value.inputFingerprint) ||
      !nonblank(value.createdAt) || typeof value.snapshotRaw !== "string" ||
      !Array.isArray(value.consumerPlans)) return false;
  const plans = value.consumerPlans;
  if (!plans.every(plan => object(plan) && CONSUMER_KINDS.has(plan.kind as string) && nonblank(plan.payloadFingerprint)) ||
      new Set(plans.map(plan => (plan as CampaignPublicationConsumerPlan).kind)).size !== plans.length) return false;
  try {
    const snapshot = deserializeSnapshot(value.snapshotRaw);
    return snapshot.accountId === accountId && snapshot.campaignIdentity?.campaignId === value.campaignId &&
      snapshot.campaignRules?.source === "new_campaign" && isTargetCampaignSnapshot(snapshot);
  } catch { return false; }
}
function checkedAttempt(value: unknown, accountId: string, slotId: string): CleanEpochAttemptRecord {
  if (!validAttempt(value, accountId, slotId)) fail("invalid_record", "Retained clean-epoch attempt is malformed or mismatched.");
  return value;
}
function validSlotId(value: unknown): value is string {
  return typeof value === "string" && (value === "quick-save" || /^slot-[1-9][0-9]*$/.test(value));
}
function envelopeFromRaw(raw: string): StoredSaveEnvelope {
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return fail("invalid_record", "First-publication envelope is malformed."); }
  if (!isStoredSaveEnvelope(parsed)) fail("invalid_record", "First-publication envelope is invalid.");
  return parsed;
}
function retainedArtifactMatches(value: unknown, envelope: StoredSaveEnvelope): boolean {
  return object(value) && value.version === 1 && value.accountId === envelope.accountId &&
    value.campaignId === envelope.campaignId && value.slotId === envelope.slotId &&
    value.artifactId === envelope.artifactId && value.generationId === envelope.generationId &&
    value.publicationId === envelope.publicationId && value.headRevision === envelope.headRevision &&
    typeof value.raw === "string" && exactEqual(envelopeFromRaw(value.raw), envelope);
}
const FIRST_CAMPAIGN_CONSUMERS: CampaignPublicationConsumerKind[] = [
  "active_history", "account_achievements", "legacy_rewards", "last_played", "preparation_consumption"
];
function publicationFor(snapshot: SaveSnapshot, recovery: Pick<CleanEpochPublicationRecovery, "publicationId" | "campaignId" | "updatedAt">): VerifiedCampaignPublication {
  if (!snapshot.campaignIdentity) fail("invalid_record", "First publication lacks campaign identity.");
  return { publicationId: recovery.publicationId, campaignId: recovery.campaignId,
    continuityId: snapshot.campaignIdentity.continuityId, characterId: snapshot.playerState.playerId,
    publishedAt: recovery.updatedAt };
}
function firstCampaignProjection(account: CleanEpochAccountRecord, attempt: CleanEpochAttemptRecord,
  recovery: CleanEpochPublicationRecovery): AccountProfileState {
  try {
    const snapshot = deserializeSnapshot(attempt.snapshotRaw);
    const sourceRunId = snapshot.playerState.saveMeta.sourceRunId?.trim() ?? "";
    const requiredKinds = [...FIRST_CAMPAIGN_CONSUMERS, ...(sourceRunId ? ["inheritance_consumption" as const] : [])];
    if (attempt.consumerPlans.length !== requiredKinds.length ||
        requiredKinds.some(kind => !attempt.consumerPlans.some(plan => plan.kind === kind)))
      fail("invalid_record", "First-publication consumer plan set is incomplete or inapplicable.");
    if ((account.profile.campaignPublicationReceipts ?? []).some(receipt => receipt.publicationId === recovery.publicationId))
      fail("conflict", "First-publication consumer identity already exists in the account.");
    const evaluated = evaluateAchievementProgress(snapshot, account.profile, {
      slotId: attempt.slotId, touchHistory: true, recordedAt: recovery.updatedAt, suppressLegacyRewards: true
    });
    if (!exactEqual(evaluated.nextSnapshot, snapshot))
      fail("invalid_record", "First-publication account projection would change the accepted artifact.");
    const coreFingerprint = JSON.stringify({ slotId: attempt.slotId, capturedAtTick: snapshot.capturedAtTick,
      characterAchievementIds: snapshot.playerState.achievements.unlocked.map(entry => entry.achievementId) });
    const selected = resolveLegacyPreparationSelection(account.profile);
    if (!exactEqual(snapshot.playerState.saveMeta.appliedLegacyPreparationIds ?? [], selected.selectedUnlockIds) ||
        !exactEqual(snapshot.playerState.saveMeta.appliedLegacyPreparationChoices ?? {}, selected.selectedChoicePayloads))
      fail("conflict", "Retained preparation selection differs from the published campaign.");
    const preparationFingerprint = JSON.stringify({ selectedPreparationUnlockIds: selected.selectedUnlockIds,
      selectedPreparationChoicePayloads: selected.selectedChoicePayloads, sourceRunId: sourceRunId || null });
    for (const plan of attempt.consumerPlans) {
      const expected = FIRST_CAMPAIGN_CONSUMERS.slice(0, 4).includes(plan.kind)
        ? coreFingerprint : preparationFingerprint;
      if (plan.payloadFingerprint !== expected) fail("conflict", "First-publication consumer payload fingerprint differs from retained authority.");
    }
    const publication = publicationFor(snapshot, recovery);
    let next: AccountProfileState = { ...evaluated.nextAccountProfile, lastPlayedAt: recovery.updatedAt };
    next = consumeSelectedLegacyPreparations(next).profile;
    if (sourceRunId) {
      const source = resolveHeirSourceById(next, sourceRunId);
      if (!source) fail("conflict", "Retained inheritance source is unavailable.");
      const consumed = consumeRetiredRunInheritanceUse(next,
        { characterId: source.characterId, recordedAt: recovery.updatedAt });
      if (!consumed.consumed) fail("conflict", "Retained inheritance use was not consumed.");
      next = consumed.accountProfile;
    }
    for (const plan of attempt.consumerPlans) {
      next = recordCampaignPublicationConsumer(next, publication, plan.kind, plan.payloadFingerprint, { status: "applied" });
    }
    if (!validProfile(next, account.accountId)) fail("invalid_record", "Projected account consumers are malformed.");
    return next;
  } catch (error) { throw classify(error, "invalid_record"); }
}
function validRecovery(value: unknown, attempt: CleanEpochAttemptRecord): value is CleanEpochPublicationRecovery {
  if (!object(value) || value.version !== 1 ||
      value.accountId !== attempt.accountId || value.slotId !== attempt.slotId ||
      value.campaignId !== attempt.campaignId || value.attemptId !== attempt.attemptId ||
      !nonblank(value.artifactId) || !nonblank(value.generationId) || !nonblank(value.publicationId) ||
      value.headRevision !== 1 || value.expectedAccountRevision !== attempt.expectedAccountRevision ||
      typeof value.envelopeRaw !== "string" || !Array.isArray(value.consumerPlans) ||
      !exactEqual(value.consumerPlans, attempt.consumerPlans) || !Array.isArray(value.completedConsumerKinds) ||
      !nonblank(value.createdAt) || !nonblank(value.updatedAt) ||
      (value.witnessRequestId !== null && !nonblank(value.witnessRequestId))) return false;
  const plans = value.consumerPlans as CampaignPublicationConsumerPlan[];
  const pending = value.status === "accepted_pending_consumers" && value.completedConsumerKinds.length === 0 &&
    value.completedAccountRevision === undefined;
  const completed = value.status === "consumers_completed" &&
    value.completedAccountRevision === attempt.expectedAccountRevision + 1 &&
    exactEqual(value.completedConsumerKinds, attempt.consumerPlans.map(plan => plan.kind));
  if (!pending && !completed) return false;
  try {
    const envelope = envelopeFromRaw(value.envelopeRaw);
    const snapshot = deserializeSnapshot(envelope.snapshot);
    const requestId = snapshot.authorityLedger?.soundingsTurnIn?.version === 2
      ? snapshot.authorityLedger.soundingsTurnIn.requests[0]?.requestId ?? null : null;
    return envelope.accountId === attempt.accountId && envelope.slotId === attempt.slotId &&
      envelope.campaignId === attempt.campaignId && envelope.artifactId === value.artifactId &&
      envelope.generationId === value.generationId && envelope.publicationId === value.publicationId &&
      envelope.headRevision === 1 && envelope.terminal === false && envelope.snapshot === attempt.snapshotRaw &&
      value.witnessRequestId === requestId;
  } catch { return false; }
}
function checkedRecovery(value: unknown, attempt: CleanEpochAttemptRecord): CleanEpochPublicationRecovery {
  if (!validRecovery(value, attempt)) fail("invalid_record", "Retained clean-epoch recovery is malformed or unlinked.");
  return value;
}
function sameRecoverySource(left: CleanEpochPublicationRecovery, right: CleanEpochPublicationRecovery): boolean {
  const { status: _leftStatus, completedConsumerKinds: _leftKinds, completedAccountRevision: _leftRevision, ...leftSource } = left;
  const { status: _rightStatus, completedConsumerKinds: _rightKinds, completedAccountRevision: _rightRevision, ...rightSource } = right;
  return exactEqual(leftSource, rightSource);
}
function completedReceiptsMatch(account: CleanEpochAccountRecord, recovery: CleanEpochPublicationRecovery): boolean {
  if (recovery.status !== "consumers_completed" || account.revision < recovery.completedAccountRevision) return false;
  const snapshot = deserializeSnapshot(envelopeFromRaw(recovery.envelopeRaw).snapshot);
  const publication = publicationFor(snapshot, recovery);
  const receipts = (account.profile.campaignPublicationReceipts ?? []).filter(receipt =>
    receipt.publicationId === publication.publicationId);
  if (receipts.length !== recovery.consumerPlans.length) return false;
  return recovery.consumerPlans.every(plan => receipts.filter(receipt =>
    receipt.consumerId === `${publication.publicationId}.consumer.${plan.kind}` &&
    receipt.publicationId === publication.publicationId && receipt.campaignId === publication.campaignId &&
    receipt.continuityId === publication.continuityId && receipt.characterId === publication.characterId &&
    receipt.kind === plan.kind && receipt.payloadFingerprint === plan.payloadFingerprint &&
    receipt.status === "applied" && receipt.appliedAt === publication.publishedAt).length === 1);
}
function publicationMatchesRecovery(published: CampaignStoreReadback | null, recovery: CleanEpochPublicationRecovery): boolean {
  return !!published && published.artifactRaw === recovery.envelopeRaw && published.slotRaw === recovery.envelopeRaw &&
    published.control.headArtifactId === recovery.artifactId && published.control.headPublicationId === recovery.publicationId &&
    published.control.headRevision === 1 && published.control.previousHeadArtifactId === null &&
    published.control.previousHeadPublicationId === null && published.control.closed === false &&
    published.control.updatedAt === recovery.updatedAt && (published.witness?.requestId ?? null) === recovery.witnessRequestId;
}

const ORDINARY_DESCENDANT_CONSUMERS: CampaignPublicationConsumerKind[] = [
  "active_history", "account_achievements", "legacy_rewards", "last_played"
];
function descendantFingerprint(snapshot: SaveSnapshot, slotId: string): string {
  return JSON.stringify({ slotId, capturedAtTick: snapshot.capturedAtTick,
    characterAchievementIds: snapshot.playerState.achievements.unlocked.map(entry => entry.achievementId) });
}
function validDescendantRecovery(value: unknown, accountId: string, campaignId: string,
  publicationId: string): value is CleanEpochDescendantRecovery {
  if (!object(value) || value.version !== 1 || value.accountId !== accountId || value.campaignId !== campaignId ||
      value.publicationId !== publicationId || !validSlotId(value.slotId) || !validSlotId(value.sourceSlotId) ||
      (value.expectedSlotAddress !== null && (!object(value.expectedSlotAddress) ||
        !nonblank(value.expectedSlotAddress.artifactId) || !nonblank(value.expectedSlotAddress.publicationId))) ||
      !nonblank(value.artifactId) ||
      !nonblank(value.generationId) || !nonblank(value.sourceArtifactId) || !nonblank(value.sourcePublicationId) ||
      typeof value.sourceSnapshotRaw !== "string" || typeof value.envelopeRaw !== "string" ||
      !Number.isSafeInteger(value.headRevision) || (value.headRevision as number) < 2 ||
      !Number.isSafeInteger(value.expectedAccountRevision) || (value.expectedAccountRevision as number) < 1 ||
      !object(value.expectedHead) || !nonblank(value.expectedHead.artifactId) ||
      !nonblank(value.expectedHead.publicationId) || value.expectedHead.revision !== (value.headRevision as number) - 1 ||
      !nonblank(value.createdAt) || (value.witnessRequestId !== null && !nonblank(value.witnessRequestId)) ||
      !Array.isArray(value.consumerPlans) || !Array.isArray(value.completedConsumerKinds) ||
      value.consumerPlans.length !== ORDINARY_DESCENDANT_CONSUMERS.length ||
      !ORDINARY_DESCENDANT_CONSUMERS.every(kind => (value.consumerPlans as unknown[]).some(plan => object(plan) && plan.kind === kind)) ||
      new Set((value.consumerPlans as unknown[]).map(plan => object(plan) ? plan.kind : null)).size !== value.consumerPlans.length) return false;
  const plans = value.consumerPlans as CampaignPublicationConsumerPlan[];
  const pending = value.status === "accepted_pending_consumers" && value.completedConsumerKinds.length === 0 &&
    value.completedAccountRevision === undefined;
  const completed = value.status === "consumers_completed" &&
    value.completedAccountRevision === (value.expectedAccountRevision as number) + 1 &&
    exactEqual(value.completedConsumerKinds, plans.map(plan => plan.kind));
  if (!pending && !completed) return false;
  try {
    const envelope = envelopeFromRaw(value.envelopeRaw);
    const snapshot = deserializeSnapshot(envelope.snapshot);
    const source = deserializeSnapshot(value.sourceSnapshotRaw);
    const requestId = snapshot.authorityLedger?.soundingsTurnIn?.version === 2
      ? snapshot.authorityLedger.soundingsTurnIn.requests[0]?.requestId ?? null : null;
    return envelope.accountId === accountId && envelope.campaignId === campaignId &&
      envelope.slotId === value.slotId && envelope.artifactId === value.artifactId &&
      envelope.generationId === value.generationId && envelope.publicationId === publicationId &&
      envelope.headRevision === value.headRevision && !envelope.terminal &&
      snapshot.accountId === accountId && snapshot.campaignIdentity?.campaignId === campaignId &&
      source.accountId === accountId && source.campaignIdentity?.campaignId === campaignId &&
      value.witnessRequestId === requestId &&
      plans.every(plan => plan.payloadFingerprint === descendantFingerprint(snapshot, value.slotId as string));
  } catch { return false; }
}
function checkedDescendantRecovery(value: unknown, accountId: string, campaignId: string,
  publicationId: string): CleanEpochDescendantRecovery {
  if (!validDescendantRecovery(value, accountId, campaignId, publicationId))
    fail("invalid_record", "Retained descendant recovery is malformed or mismatched.");
  return value;
}
function sameDescendantSource(left: CleanEpochDescendantRecovery, right: CleanEpochDescendantRecovery): boolean {
  const { status: _ls, completedConsumerKinds: _lk, completedAccountRevision: _lr, ...a } = left;
  const { status: _rs, completedConsumerKinds: _rk, completedAccountRevision: _rr, ...b } = right;
  return exactEqual(a, b);
}
function descendantReceiptsMatch(account: CleanEpochAccountRecord, recovery: CleanEpochDescendantRecovery): boolean {
  if (recovery.status !== "consumers_completed" || account.revision < (recovery.completedAccountRevision ?? Infinity)) return false;
  const snapshot = deserializeSnapshot(envelopeFromRaw(recovery.envelopeRaw).snapshot);
  const publication = publicationFor(snapshot, { ...recovery, updatedAt: recovery.createdAt });
  const receipts = (account.profile.campaignPublicationReceipts ?? []).filter(receipt => receipt.publicationId === recovery.publicationId);
  return receipts.length === recovery.consumerPlans.length && recovery.consumerPlans.every(plan => receipts.filter(receipt =>
    receipt.consumerId === `${recovery.publicationId}.consumer.${plan.kind}` &&
    receipt.campaignId === recovery.campaignId && receipt.continuityId === publication.continuityId &&
    receipt.characterId === publication.characterId && receipt.kind === plan.kind &&
    receipt.payloadFingerprint === plan.payloadFingerprint && receipt.status === "applied" &&
    receipt.appliedAt === recovery.createdAt).length === 1);
}
function validTerminalRecovery(value: unknown, accountId: string, campaignId: string,
  publicationId: string): value is CleanEpochTerminalRecovery {
  if (!object(value) || value.version !== 1 || value.accountId !== accountId ||
      value.campaignId !== campaignId || value.publicationId !== publicationId ||
      value.archiveReason !== "retired" || !nonblank(value.characterId) ||
      !validSlotId(value.slotId) || !nonblank(value.sourceArtifactId) ||
      !nonblank(value.sourcePublicationId) || !nonblank(value.artifactId) ||
      !nonblank(value.createdAt) || typeof value.sourceSnapshotRaw !== "string" ||
      typeof value.envelopeRaw !== "string" || !validProfile(value.sourceProfile, accountId) ||
      !object(value.sourceAddress) || !nonblank(value.sourceAddress.artifactId) ||
      !nonblank(value.sourceAddress.publicationId) ||
      !object(value.expectedHead) || !nonblank(value.expectedHead.artifactId) ||
      !nonblank(value.expectedHead.publicationId) ||
      !Number.isSafeInteger(value.expectedHead.revision) || (value.expectedHead.revision as number) < 1 ||
      !Number.isSafeInteger(value.expectedAccountRevision) || (value.expectedAccountRevision as number) < 1 ||
      !Array.isArray(value.addressSlotIds) || !value.addressSlotIds.every(validSlotId) ||
      new Set(value.addressSlotIds).size !== value.addressSlotIds.length ||
      !value.addressSlotIds.includes(value.slotId) || !Array.isArray(value.consumerPlans) ||
      value.consumerPlans.length !== RETIREMENT_CONSUMERS.length ||
      !RETIREMENT_CONSUMERS.every(kind => (value.consumerPlans as unknown[]).some(plan =>
        object(plan) && plan.kind === kind && nonblank(plan.payloadFingerprint))) ||
      !nonblank(value.settlementFingerprint) ||
      !nonblank(value.estateSourceRunId) || !nonblank(value.estateDepositId) ||
      (value.payoutTransactionId !== null && !nonblank(value.payoutTransactionId))) return false;
  const pending = value.status === "accepted_pending_settlement" && value.completedAccountRevision === undefined;
  const completed = value.status === "settlement_completed" &&
    value.completedAccountRevision === (value.expectedAccountRevision as number) + 1;
  if (!pending && !completed) return false;
  if (value.addressClosure !== undefined) {
    const closure = value.addressClosure;
    const receiptRows: unknown[] = object(closure) && Array.isArray(closure.receipts)
      ? closure.receipts : [];
    if (!completed || !object(closure) || !nonblank(closure.closedAt) ||
        !Number.isSafeInteger(closure.completedAccountRevision) ||
        (closure.completedAccountRevision as number) <= (value.completedAccountRevision as number) ||
        receiptRows.length !== value.addressSlotIds.length ||
        new Set(receiptRows.map(entry => object(entry) ? entry.slotId : null)).size !== receiptRows.length ||
        !value.addressSlotIds.every(id => receiptRows.some(entry =>
          object(entry) && entry.slotId === id && nonblank(entry.slotGenerationId) &&
          nonblank(entry.artifactId) && nonblank(entry.publicationId)))) return false;
  }
  try {
    const envelope = envelopeFromRaw(value.envelopeRaw);
    const snapshot = deserializeSnapshot(envelope.snapshot);
    const source = deserializeSnapshot(value.sourceSnapshotRaw);
    if (!envelope.terminal || envelope.accountId !== accountId || envelope.campaignId !== campaignId ||
        envelope.publicationId !== publicationId || envelope.artifactId !== value.artifactId ||
        envelope.slotId !== value.slotId || envelope.characterId !== value.characterId ||
        envelope.headRevision !== (value.expectedHead.revision as number) + 1 ||
        source.accountId !== accountId || source.campaignIdentity?.campaignId !== campaignId ||
        source.playerState.playerId !== value.characterId ||
        snapshot.playerState.playerId !== value.characterId ||
        snapshot.campaignIdentity?.campaignId !== campaignId || hasPendingNormalDefeat(snapshot) ||
        value.sourceAddress.artifactId !== value.sourceArtifactId ||
        value.sourceAddress.publicationId !== value.sourcePublicationId ||
        (value.consumerPlans as CampaignPublicationConsumerPlan[]).some(plan =>
          plan.payloadFingerprint !== value.settlementFingerprint)) return false;
    const projection = projectRetirementSettlement({ profile: value.sourceProfile, snapshot,
      publication: publicationFor(snapshot, { publicationId, campaignId, updatedAt: value.createdAt }),
      slotId: value.slotId as SaveSlotId, addressSlotIds: value.addressSlotIds as SaveSlotId[],
      consumerPlans: value.consumerPlans as CampaignPublicationConsumerPlan[] });
    return projection.payoutTransactionId === value.payoutTransactionId &&
      projection.estateSourceRunId === value.estateSourceRunId &&
      projection.estateDepositId === value.estateDepositId &&
      value.settlementFingerprint === retirementSettlementFingerprint({ accountId, campaignId,
        sourceArtifactId: value.sourceArtifactId as string,
        sourcePublicationId: value.sourcePublicationId as string,
        terminalArtifactId: value.artifactId as string, terminalPublicationId: publicationId,
        sourceSlotId: value.slotId as SaveSlotId, addressSlotIds: value.addressSlotIds as SaveSlotId[],
        payout: projection.payout, payoutTransactionId: projection.payoutTransactionId,
        estateSourceRunId: projection.estateSourceRunId, estateDepositId: projection.estateDepositId });
  } catch { return false; }
}
function checkedTerminalRecovery(value: unknown, accountId: string, campaignId: string,
  publicationId: string): CleanEpochTerminalRecovery {
  if (!validTerminalRecovery(value, accountId, campaignId, publicationId))
    fail("invalid_record", "Retained terminal recovery is malformed or disagrees with derived settlement.");
  return value;
}
function terminalReceiptsMatch(account: CleanEpochAccountRecord, recovery: CleanEpochTerminalRecovery): boolean {
  if (recovery.status !== "settlement_completed" ||
      account.revision < (recovery.completedAccountRevision ?? Infinity)) return false;
  const receipts = (account.profile.campaignPublicationReceipts ?? []).filter(
    receipt => receipt.publicationId === recovery.publicationId);
  const run = account.profile.history.runRecords.find(record => record.characterId === recovery.characterId);
  return receipts.length === RETIREMENT_CONSUMERS.length &&
    RETIREMENT_CONSUMERS.every(kind => receipts.filter(receipt =>
      receipt.consumerId === `${recovery.publicationId}.consumer.${kind}` &&
      receipt.kind === kind && receipt.status === "applied" &&
      receipt.payloadFingerprint === recovery.settlementFingerprint &&
      receipt.campaignId === recovery.campaignId &&
      receipt.characterId === recovery.characterId &&
      receipt.appliedAt === recovery.createdAt).length === 1) &&
    run?.outcome === "archived" && run.archiveReason === "retired" &&
    run.legacyPayoutTransactionId === (recovery.payoutTransactionId ?? undefined) &&
    (recovery.addressClosure
      ? account.revision >= recovery.addressClosure.completedAccountRevision && run.saveSlotIds.length === 0
      : recovery.addressSlotIds.every(id => run.saveSlotIds.includes(id))) &&
    account.profile.estate.deposits.filter(deposit =>
      deposit.sourceRunId === recovery.estateSourceRunId &&
      deposit.depositId === recovery.estateDepositId).length === 1 &&
    (recovery.payoutTransactionId === null ||
      account.profile.legacy.legacyTransactions.filter(tx =>
        tx.id === recovery.payoutTransactionId).length === 1);
}

export async function openCleanEpochAccountStore(options: CleanEpochAccountStoreOptions = {}): Promise<CleanEpochAccountStore> {
  const name = options.name ?? CLEAN_EPOCH_DATABASE_NAME;
  if (!nonblank(name) || name === CAMPAIGN_DATABASE_NAME) fail("invalid_record", "Clean-epoch database must be separate from legacy staging.");
  let factory: IDBFactory | undefined;
  try { factory = options.factory ?? globalThis.indexedDB; }
  catch (error) { throw classify(error, "unavailable"); }
  if (!factory) fail("unavailable", "IndexedDB is unavailable in this browser.");
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    let blocked = false;
    let request: IDBOpenDBRequest;
    try { request = factory.open(name, CLEAN_EPOCH_DATABASE_VERSION); }
    catch (error) { reject(classify(error, "unavailable")); return; }
    request.onblocked = () => { blocked = true; reject(new CampaignStoreError("blocked_upgrade", "Clean-epoch database upgrade is blocked.")); };
    request.onupgradeneeded = event => {
      const database = request.result;
      const upgrade = request.transaction;
      if (!upgrade) { reject(new CampaignStoreError("invalid_record", "Clean-epoch upgrade transaction is missing.")); return; }
      ensureCampaignPublicationStores(database);
      if (!database.objectStoreNames.contains(CLEAN_EPOCH_ACCOUNT_STORE)) {
        database.createObjectStore(CLEAN_EPOCH_ACCOUNT_STORE, { keyPath: "accountId" });
      }
      if (!database.objectStoreNames.contains(CLEAN_EPOCH_ATTEMPT_STORE)) {
        database.createObjectStore(CLEAN_EPOCH_ATTEMPT_STORE, { keyPath: ["accountId", "slotId"] });
      }
      if (!database.objectStoreNames.contains(CLEAN_EPOCH_RECOVERY_STORE)) {
        database.createObjectStore(CLEAN_EPOCH_RECOVERY_STORE, { keyPath: ["accountId", "slotId"] });
      }
      if (!database.objectStoreNames.contains(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE)) {
        const store = database.createObjectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
          { keyPath: ["accountId", "campaignId", "publicationId"] });
        store.createIndex("byAccountCampaign", ["accountId", "campaignId"], { unique: false });
      }
      if (!database.objectStoreNames.contains(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)) {
        const store = database.createObjectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
          { keyPath: ["accountId", "campaignId", "publicationId"] });
        store.createIndex("bySourcePublication", ["accountId", "campaignId", "sourcePublicationId"], { unique: true });
        store.createIndex("byAccount", "accountId", { unique: false });
      }
      if (!database.objectStoreNames.contains(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE))
        database.createObjectStore(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE, { keyPath: ["accountId", "campaignId"] });
      if (!database.objectStoreNames.contains(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE))
        database.createObjectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, { keyPath: ["accountId", "campaignId"] });
      if (!database.objectStoreNames.contains(CLEAN_EPOCH_SLOT_GENERATION_STORE))
        database.createObjectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE, { keyPath: ["accountId", "slotId"] });
      if (!database.objectStoreNames.contains(CLEAN_EPOCH_ADDRESS_DELETION_STORE))
        database.createObjectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE,
          { keyPath: ["accountId", "slotId", "slotGenerationId"] });
      if (!database.objectStoreNames.contains(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE))
        database.createObjectStore(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE, { keyPath: "accountId" });
      // The v5 families remain untouched as retained evidence. The v6 copies are the
      // sole active attempt/recovery authority after this atomic upgrade.
      if (event.oldVersion < 6) {
        const names = [CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ATTEMPT_STORE,
          CLEAN_EPOCH_RECOVERY_STORE, "slots", "controls"];
        const rows = new Map<string, unknown[]>();
        let pending = names.length;
        for (const name of names) {
          const read = upgrade.objectStore(name).getAll();
          read.onsuccess = () => {
            rows.set(name, read.result as unknown[]);
            if (--pending !== 0) return;
            try {
              const accounts = new Map<string, CleanEpochAccountRecord>();
              for (const raw of rows.get(CLEAN_EPOCH_ACCOUNT_STORE) ?? []) {
                if (!object(raw) || !nonblank(raw.accountId) || accounts.has(raw.accountId))
                  throw new Error("Malformed or duplicate v5 account during upgrade.");
                accounts.set(raw.accountId, checkedAccount(raw, raw.accountId));
              }
              const attempts = new Map<string, CleanEpochAttemptRecord>();
              const pointers = new Map<string, CleanEpochSlotGeneration>();
              const key = (accountId: string, campaignId: string) => `${accountId}\u0000${campaignId}`;
              const slotKey = (accountId: string, slotId: string) => `${accountId}\u0000${slotId}`;
              for (const raw of rows.get(CLEAN_EPOCH_ATTEMPT_STORE) ?? []) {
                if (!object(raw) || !nonblank(raw.accountId) || !validSlotId(raw.slotId) ||
                    !nonblank(raw.campaignId) || !accounts.has(raw.accountId) ||
                    attempts.has(key(raw.accountId, raw.campaignId)) ||
                    pointers.has(slotKey(raw.accountId, raw.slotId)))
                  throw new Error("Malformed or duplicate v5 attempt during upgrade.");
                const attempt = checkedAttempt(raw, raw.accountId, raw.slotId);
                attempts.set(key(attempt.accountId, attempt.campaignId), attempt);
                pointers.set(slotKey(attempt.accountId, attempt.slotId), { version: 1,
                  accountId: attempt.accountId, slotId: attempt.slotId as SaveSlotId,
                  slotGenerationId: `slot.v5.${globalThis.crypto.randomUUID()}`,
                  campaignId: attempt.campaignId, attemptId: attempt.attemptId, status: "prepared" });
                upgrade.objectStore(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE).put(attempt);
              }
              const recovered = new Set<string>();
              for (const raw of rows.get(CLEAN_EPOCH_RECOVERY_STORE) ?? []) {
                if (!object(raw) || !nonblank(raw.accountId) || !nonblank(raw.campaignId) ||
                    recovered.has(key(raw.accountId, raw.campaignId)))
                  throw new Error("Malformed or duplicate v5 recovery during upgrade.");
                const attempt = attempts.get(key(raw.accountId, raw.campaignId));
                if (!attempt) throw new Error("Orphan v5 recovery during upgrade.");
                const recovery = checkedRecovery(raw, attempt);
                recovered.add(key(raw.accountId, raw.campaignId));
                const pointer = pointers.get(slotKey(attempt.accountId, attempt.slotId));
                if (!pointer) throw new Error("V5 recovery lost slot generation.");
                pointer.status = "published";
                upgrade.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE).put(recovery);
              }
              const controls = new Set<string>();
              for (const raw of rows.get("controls") ?? []) {
                if (!object(raw) || !nonblank(raw.accountId) || !nonblank(raw.campaignId) ||
                    controls.has(key(raw.accountId, raw.campaignId)))
                  throw new Error("Malformed or duplicate v5 control during upgrade.");
                controls.add(key(raw.accountId, raw.campaignId));
              }
              for (const raw of rows.get("slots") ?? []) {
                if (!object(raw) || !nonblank(raw.accountId) || !validSlotId(raw.slotId) ||
                    !nonblank(raw.campaignId) || !nonblank(raw.artifactId) ||
                    !nonblank(raw.publicationId) || typeof raw.raw !== "string")
                  throw new Error("Malformed v5 address during upgrade.");
                const attempt = attempts.get(key(raw.accountId, raw.campaignId));
                if (!attempt || !recovered.has(key(raw.accountId, raw.campaignId)) ||
                    !controls.has(key(raw.accountId, raw.campaignId)))
                  throw new Error("V5 address lacks retained campaign authority.");
                const id = slotKey(raw.accountId, raw.slotId);
                const existing = pointers.get(id);
                if (existing && (existing.campaignId !== raw.campaignId || existing.status !== "published"))
                  throw new Error("V5 address conflicts with slot generation.");
                if (!existing) pointers.set(id, { version: 1, accountId: raw.accountId,
                  slotId: raw.slotId as SaveSlotId,
                  slotGenerationId: `slot.v5.${globalThis.crypto.randomUUID()}`,
                  campaignId: raw.campaignId, attemptId: attempt.attemptId, status: "published" });
              }
              for (const pointer of pointers.values())
                upgrade.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE).put(pointer);
            } catch (error) {
              try { upgrade.abort(); } catch { /* already aborted */ }
              reject(classify(error, "invalid_record"));
            }
          };
        }
      }
    };
    request.onerror = () => reject(classify(request.error, "unavailable"));
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      const database = request.result;
      if (!hasCampaignPublicationStores(database) || !database.objectStoreNames.contains(CLEAN_EPOCH_ACCOUNT_STORE) ||
          !database.objectStoreNames.contains(CLEAN_EPOCH_ATTEMPT_STORE) || !database.objectStoreNames.contains(CLEAN_EPOCH_RECOVERY_STORE) ||
          !database.objectStoreNames.contains(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE) ||
          !database.objectStoreNames.contains(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE) ||
          !database.objectStoreNames.contains(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE) ||
          !database.objectStoreNames.contains(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE) ||
          !database.objectStoreNames.contains(CLEAN_EPOCH_SLOT_GENERATION_STORE) ||
          !database.objectStoreNames.contains(CLEAN_EPOCH_ADDRESS_DELETION_STORE) ||
          !database.objectStoreNames.contains(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE) ||
          !database.transaction(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE).objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
            .indexNames.contains("bySourcePublication")) {
        database.close(); reject(new CampaignStoreError("invalid_record", "Clean-epoch schema is incomplete.")); return;
      }
      database.onversionchange = () => database.close();
      resolve(database);
    };
  });
  return new CleanEpochAccountStore(db, options.beforeWrite, options.afterWrite);
}

export class CleanEpochAccountStore {
  constructor(private readonly db: IDBDatabase,
    private readonly beforeWrite?: CleanEpochAccountStoreOptions["beforeWrite"],
    private readonly afterWrite?: CleanEpochAccountStoreOptions["afterWrite"]) {}

  close(): void { this.db.close(); }

  async readLifecycleReceipt(accountId: string): Promise<CleanEpochAccountLifecycleReceipt | null> {
    if (!nonblank(accountId)) fail("invalid_record", "Account lifecycle identity is invalid.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE], "readonly");
      const [accountRaw, receiptRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE).get(accountId) as IDBRequest<unknown>)
      ]);
      const receipt = receiptRaw === undefined ? null : checkedLifecycle(receiptRaw, accountId);
      if (accountRaw !== undefined) {
        const account = checkedAccount(accountRaw, accountId);
        if ((!receipt && accountLifecycleGeneration(account) !== 1) ||
            (receipt && (receipt.kind === "delete" ||
              accountLifecycleGeneration(account) !== receipt.completedGeneration)))
          fail("invalid_record", "Account disagrees with lifecycle authority.");
      } else if (receipt?.kind === "reset") fail("invalid_record", "Reset receipt lacks its account.");
      return receipt;
    } catch (error) { throw classify(error, "unavailable"); }
  }

  /** One database transaction erases every account-owned row and records the generation boundary. */
  async transitionAccount(kind: "reset" | "delete", input: CleanEpochAccountLifecycleRequest):
    Promise<CleanEpochAccountLifecycleResult> {
    if (!object(input) || !nonblank(input.accountId) ||
        !Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 1 ||
        !Number.isSafeInteger(input.expectedGeneration) || input.expectedGeneration < 1 ||
        typeof input.currentPassword !== "string" || !input.currentPassword.trim())
      fail("invalid_record", "Account lifecycle request is invalid.");
    const verified = await this.read(input.accountId);
    if (verified && !await verifyPassword(input.currentPassword, verified.credential))
      fail("conflict", "Current account credential did not match.");
    let tx: IDBTransaction;
    try { tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE,
      ...ACCOUNT_DATA_STORES], "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(tx);
    let status: CleanEpochAccountLifecycleResult["status"] = "committed";
    let receipt: CleanEpochAccountLifecycleReceipt;
    let next: CleanEpochAccountRecord | null = null;
    try {
      const accounts = tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE);
      const lifecycle = tx.objectStore(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE);
      const [accountRaw, receiptRaw] = await Promise.all([
        requestValue(accounts.get(input.accountId) as IDBRequest<unknown>),
        requestValue(lifecycle.get(input.accountId) as IDBRequest<unknown>)
      ]);
      const prior = receiptRaw === undefined ? null : checkedLifecycle(receiptRaw, input.accountId);
      if (prior && prior.expectedRevision === input.expectedRevision &&
          prior.expectedGeneration === input.expectedGeneration && prior.kind === kind) {
        status = "same_source_retry";
        receipt = prior;
        next = accountRaw === undefined ? null : checkedAccount(accountRaw, input.accountId);
        if (kind === "reset" && (!next || accountLifecycleGeneration(next) !== prior.completedGeneration ||
            next.revision < prior.completedRevision!))
          fail("invalid_record", "Reset completion lacks its account generation.");
        if (kind === "delete" && next) fail("invalid_record", "Deleted account was recreated.");
      } else {
        if (prior && prior.kind === "delete") fail("conflict", "Deleted account identity is tombstoned.");
        if (accountRaw === undefined) fail("invalid_record", "Lifecycle account is missing.");
        const account = checkedAccount(accountRaw, input.accountId);
        if ((!prior && accountLifecycleGeneration(account) !== 1) ||
            (prior && accountLifecycleGeneration(account) !== prior.completedGeneration))
          fail("invalid_record", "Account lifecycle generation lacks exact retained authority.");
        if (account.revision !== input.expectedRevision ||
            accountLifecycleGeneration(account) !== input.expectedGeneration)
          fail("stale_head", "Account revision or lifecycle generation changed.");
        const completedAt = new Date().toISOString();
        next = kind === "reset" ? { ...account, revision: account.revision + 1,
          lifecycleGeneration: input.expectedGeneration + 1,
          profile: createDefaultAccountProfileState({ accountId: input.accountId,
            displayName: account.profile.displayName, createdAt: account.profile.createdAt,
            updatedAt: completedAt }) } : null;
        receipt = { version: 1, accountId: input.accountId, kind,
          expectedRevision: input.expectedRevision, expectedGeneration: input.expectedGeneration,
          completedGeneration: input.expectedGeneration + 1,
          completedRevision: next?.revision ?? null, completedAt };
        // Validate the entire account prefix before the first write. Incomplete rows
        // cannot be silently mistaken for a successful destructive transition.
        const keys = new Map<string, IDBValidKey[]>();
        const range = IDBKeyRange.bound([input.accountId], [input.accountId, []]);
        for (const name of ACCOUNT_DATA_STORES) {
          const store = tx.objectStore(name);
          const found = await requestValue(store.getAllKeys(range));
          for (const key of found) {
            const raw = await requestValue(store.get(key) as IDBRequest<unknown>);
            if (!Array.isArray(key) || key[0] !== input.accountId ||
                !object(raw) || raw.version !== 1 || raw.accountId !== input.accountId)
              fail("invalid_record", `Malformed ${name} account row blocks lifecycle transition.`);
          }
          keys.set(name, found);
        }
        const write = async <T,>(request: () => IDBRequest<T>) => {
          this.beforeWrite?.(tx);
          await requestValue(request());
          this.afterWrite?.(tx);
        };
        for (const name of ACCOUNT_DATA_STORES)
          for (const key of keys.get(name) ?? [])
            await write(() => tx.objectStore(name).delete(key));
        if (next) await write(() => accounts.put(next));
        else await write(() => accounts.delete(input.accountId));
        await write(() => lifecycle.put(receipt));
      }
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* already settled */ }
      try { await done; } catch { /* retain original failure */ }
      throw classify(error, "aborted");
    }
    const [actual, durableReceipt] = await Promise.all([
      this.read(input.accountId), this.readLifecycleReceipt(input.accountId)
    ]);
    if (!durableReceipt || !exactEqual(durableReceipt, receipt) ||
        (kind === "delete" ? actual !== null : !actual ||
          (status === "committed" && !exactEqual(actual, next))))
      fail("readback_failed", "Account lifecycle completion failed exact readback.");
    // A later authorized caller may have created new-generation rows after the
    // reset. The receipt proves the old generation was erased; do not expose
    // the newer account or misclassify its rows as failed old-generation cleanup.
    const advancedReset = kind === "reset" && status === "same_source_retry" &&
      actual !== null && actual.revision > receipt.completedRevision!;
    if (!advancedReset) for (const name of ACCOUNT_DATA_STORES) {
      try {
        const check = this.db.transaction(name, "readonly");
        const count = await requestValue(check.objectStore(name)
          .count(IDBKeyRange.bound([input.accountId], [input.accountId, []])));
        if (count !== 0) fail("readback_failed", `Account lifecycle left ${name} rows.`);
      } catch (error) { throw classify(error, "readback_failed"); }
    }
    return { status, receipt, account: advancedReset ? null : actual };
  }

  async readCampaignHead(accountId: string, campaignId: string, slotId: SaveSlotId):
    Promise<{ artifactId: string; publicationId: string; revision: number }> {
    if (!nonblank(accountId) || !nonblank(campaignId) || !validSlotId(slotId))
      fail("invalid_record", "Campaign head address is invalid.");
    const published = await new CampaignIndexedDbStore(this.db).read(accountId, campaignId, slotId);
    if (!published) fail("invalid_record", "Campaign head is missing.");
    return { artifactId: published.control.headArtifactId,
      publicationId: published.control.headPublicationId, revision: published.control.headRevision };
  }

  private async campaignAttempt(tx: IDBTransaction, accountId: string,
    campaignId: string): Promise<CleanEpochAttemptRecord> {
    const raw = await requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE)
      .get([accountId, campaignId]) as IDBRequest<unknown>);
    if (!object(raw) || !validSlotId(raw.slotId))
      fail("invalid_record", "Campaign has no singular retained creator attempt.");
    return checkedAttempt(raw, accountId, raw.slotId as string);
  }

  private async assertNoPendingTerminal(tx: IDBTransaction, accountId: string): Promise<void> {
    const rows = await requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
      .index("byAccount").getAll(accountId) as IDBRequest<unknown[]>);
    for (const raw of rows) {
      if (!object(raw) || !nonblank(raw.campaignId) || !nonblank(raw.publicationId))
        fail("invalid_record", "Account has malformed terminal recovery.");
      const recovery = checkedTerminalRecovery(raw, accountId, raw.campaignId, raw.publicationId);
      if (recovery.status !== "settlement_completed")
        fail("conflict", "Account has pending terminal settlement.");
    }
  }

  /** First-head inventory. A failed read never becomes an empty slot. */
  async listSlots(accountId: string): Promise<CleanEpochSlotSummary[]> {
    if (!nonblank(accountId)) fail("invalid_record", "Slot account ID is blank.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
        "artifacts", "controls", "slots", "witnesses"], "readonly");
      const accountRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>);
      if (accountRaw === undefined) fail("invalid_record", "Slot account is missing.");
      const account = checkedAccount(accountRaw, accountId);
      const summaries: CleanEpochSlotSummary[] = [];
      for (const slot of SAVE_SLOT_ORDER) {
        const { loaded: _loaded, ...summary } = await this.inspectSlot(tx, account, slot.id);
        summaries.push(summary);
      }
      return summaries;
    } catch (error) { throw classify(error, "unavailable"); }
  }

  /** Side-effect-free load of a fully recovered current head. */
  async readSlot(accountId: string, slotId: SaveSlotId): Promise<CleanEpochSlotRead> {
    if (!nonblank(accountId) || !SAVE_SLOT_ORDER.some(slot => slot.id === slotId))
      fail("invalid_record", "Slot address is invalid.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
        "artifacts", "controls", "slots", "witnesses"], "readonly");
      const accountRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>);
      if (accountRaw === undefined) fail("invalid_record", "Slot account is missing.");
      return await this.inspectSlot(tx, checkedAccount(accountRaw, accountId), slotId);
    } catch (error) { throw classify(error, "unavailable"); }
  }

  /** Read a retained accepted artifact under the verified current chain without rebinding the slot. */
  async readHistoricalArtifact(accountId: string, slotId: SaveSlotId,
    artifactId: string): Promise<LoadedCampaignSave> {
    if (!nonblank(accountId) || !SAVE_SLOT_ORDER.some(slot => slot.id === slotId) || !nonblank(artifactId))
      fail("invalid_record", "Historical artifact address is invalid.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
        "artifacts", "controls", "slots", "witnesses"], "readonly");
      const accountRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>);
      if (accountRaw === undefined) fail("invalid_record", "Historical artifact account is missing.");
      const current = await this.inspectSlot(tx, checkedAccount(accountRaw, accountId), slotId);
      if (current.status !== "ready") fail("conflict", "Historical load requires a completed open campaign head.");
      if (current.loaded.sessionControl.loadedArtifactId === artifactId) return current.loaded;
      const attempt = await this.campaignAttempt(tx, accountId, current.loaded.sessionControl.campaignId);
      const [firstRaw, artifactRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE).get([accountId, attempt.campaignId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("artifacts").get([accountId, artifactId]) as IDBRequest<unknown>)
      ]);
      const first = checkedRecovery(firstRaw, attempt);
      if (!object(artifactRaw) || typeof artifactRaw.raw !== "string")
        fail("invalid_record", "Historical artifact is missing.");
      const envelope = envelopeFromRaw(artifactRaw.raw);
      if (!retainedArtifactMatches(artifactRaw, envelope))
        fail("invalid_record", "Historical artifact record identity is malformed.");
      let publishedAt: string;
      if (artifactId === first.artifactId) {
        if (artifactRaw.raw !== first.envelopeRaw || first.status !== "consumers_completed")
          fail("invalid_record", "Historical first artifact lacks completed recovery.");
        publishedAt = first.updatedAt;
      } else {
        const recoveryRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE)
          .get([accountId, attempt.campaignId, envelope.publicationId]) as IDBRequest<unknown>);
        const recovery = checkedDescendantRecovery(recoveryRaw, accountId, attempt.campaignId, envelope.publicationId);
        if (recovery.artifactId !== artifactId || recovery.envelopeRaw !== artifactRaw.raw ||
            recovery.status !== "consumers_completed")
          fail("invalid_record", "Historical descendant lacks completed recovery.");
        publishedAt = recovery.createdAt;
      }
      if (envelope.accountId !== accountId || envelope.campaignId !== attempt.campaignId ||
          envelope.slotId !== slotId || envelope.artifactId !== artifactId || envelope.terminal)
        fail("invalid_record", "Historical artifact identity or posture is invalid.");
      const snapshot = deserializeSnapshot(envelope.snapshot);
      const head = current.loaded.sessionControl;
      const sessionControl = createCampaignSessionControl({ accountId, campaignId: attempt.campaignId,
        artifactId, publicationId: envelope.publicationId, artifactRevision: envelope.headRevision,
        continuityId: envelope.continuityId, headArtifactId: head.campaignHeadArtifactId,
        headRevision: head.campaignHeadRevision });
      return { snapshot,
        sessionControl: head.soundingsAdmissionWitness
          ? { ...sessionControl, soundingsAdmissionWitness: head.soundingsAdmissionWitness } : sessionControl,
        publication: publicationFor(snapshot, { campaignId: attempt.campaignId,
          publicationId: envelope.publicationId, updatedAt: publishedAt }),
        migratedLegacy: false, repairedLegacyDefeat: false };
    } catch (error) { throw classify(error, "unavailable"); }
  }

  private async inspectSlot(tx: IDBTransaction, account: CleanEpochAccountRecord,
    slotId: SaveSlotId): Promise<CleanEpochSlotRead> {
    const accountId = account.accountId;
    const [pointerRaw, addressRaw] = await Promise.all([
      requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE).get([accountId, slotId]) as IDBRequest<unknown>),
      requestValue(tx.objectStore("slots").get([accountId, slotId]) as IDBRequest<unknown>)
    ]);
    const empty = (status: "empty" | "prepared"): CleanEpochSlotRead => ({ slotId, status, metadata: null });
    if (pointerRaw === undefined) {
      if (addressRaw !== undefined) fail("invalid_record", "Address lacks a current slot generation.");
      return empty("empty");
    }
    const pointer = checkedSlotGeneration(pointerRaw, accountId, slotId);
    const attempt = await this.campaignAttempt(tx, accountId, pointer.campaignId);
    if (pointer.attemptId !== attempt.attemptId)
      fail("invalid_record", "Slot generation disagrees with retained creator attempt.");
    const recoveryRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE)
      .get([accountId, attempt.campaignId]) as IDBRequest<unknown>);
    const controlRaw = await requestValue(tx.objectStore("controls").get([accountId, attempt.campaignId]) as IDBRequest<unknown>);
    if (pointer.status === "deleted") {
      if (addressRaw !== undefined || recoveryRaw === undefined || controlRaw === undefined)
        fail("invalid_record", "Deleted slot generation lacks completed retained authority.");
      const recovery = checkedRecovery(recoveryRaw, attempt);
      if (recovery.status !== "consumers_completed" || !completedReceiptsMatch(account, recovery))
        fail("invalid_record", "Deleted slot lacks completed first recovery.");
      const receipt = await requestValue(tx.objectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE)
        .get([accountId, slotId, pointer.slotGenerationId]) as IDBRequest<unknown>);
      if (!validAddressDeletionReceipt(receipt, pointer, account))
        fail("invalid_record", "Deleted slot lacks an exact durable deletion receipt.");
      return empty("empty");
    }
    if (recoveryRaw === undefined) {
      if (pointer.status !== "prepared" || attempt.slotId !== slotId ||
          addressRaw !== undefined || controlRaw !== undefined)
        fail("invalid_record", "Published slot lacks consumer recovery.");
      return empty("prepared");
    }
    if (pointer.status !== "published") fail("invalid_record", "Published slot generation has wrong posture.");
    const recovery = checkedRecovery(recoveryRaw, attempt);
    if (!object(addressRaw) || addressRaw.accountId !== accountId || addressRaw.slotId !== slotId ||
        addressRaw.campaignId !== attempt.campaignId || controlRaw === undefined)
      fail("invalid_record", "Accepted slot address or campaign control is missing or mismatched.");
    const published = await new CampaignIndexedDbStore(this.db).read(accountId, attempt.campaignId, slotId, tx);
    if (!published) fail("invalid_record", "Accepted slot lacks verified publication.");
    const firstRaw = await requestValue(tx.objectStore("artifacts").get([accountId, recovery.artifactId]) as IDBRequest<unknown>);
    if (!object(firstRaw) || firstRaw.accountId !== accountId || firstRaw.campaignId !== attempt.campaignId ||
        firstRaw.version !== 1 || firstRaw.slotId !== attempt.slotId ||
        firstRaw.artifactId !== recovery.artifactId || firstRaw.generationId !== recovery.generationId ||
        firstRaw.publicationId !== recovery.publicationId || firstRaw.headRevision !== 1 ||
        firstRaw.raw !== recovery.envelopeRaw ||
        (recovery.witnessRequestId !== null && published.witness?.requestId !== recovery.witnessRequestId) ||
        (published.control.headRevision === 1 &&
          (published.witness?.requestId ?? null) !== recovery.witnessRequestId))
      fail("invalid_record", "Retained first artifact or Soundings provenance disagrees with recovery.");
    if (recovery.status === "consumers_completed" && !completedReceiptsMatch(account, recovery))
      fail("invalid_record", "Completed slot lacks exact account consumer receipts.");
    if (published.control.headRevision !== 1) {
      if (recovery.status !== "consumers_completed" || published.control.headRevision < 2)
        fail("invalid_record", "Descendant head lacks completed first-campaign authority.");
      const descendant = envelopeFromRaw(published.artifactRaw);
      if (published.control.closed !== descendant.terminal)
        fail("invalid_record", "Descendant terminal posture disagrees with campaign control.");
      const retained = await requestValue(tx.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE)
        .index("byAccountCampaign").getAll([accountId, attempt.campaignId]) as IDBRequest<unknown[]>);
      const regularHeadRevision = published.control.closed
        ? published.control.headRevision - 1 : published.control.headRevision;
      if (retained.length !== regularHeadRevision - 1)
        fail("invalid_record", "Descendant chain has missing or extra recovery evidence.");
      const byRevision = new Map<number, CleanEpochDescendantRecovery>();
      for (const raw of retained) {
        if (!object(raw) || !nonblank(raw.publicationId)) fail("invalid_record", "Descendant chain contains malformed recovery.");
        const entry = checkedDescendantRecovery(raw, accountId, attempt.campaignId, raw.publicationId);
        if (byRevision.has(entry.headRevision)) fail("invalid_record", "Descendant chain repeats a revision.");
        byRevision.set(entry.headRevision, entry);
      }
      let priorId = recovery.artifactId;
      let priorPublication = recovery.publicationId;
      for (let revision = 2; revision <= regularHeadRevision; revision++) {
        const entry = byRevision.get(revision);
        if (!entry || entry.expectedHead.artifactId !== priorId ||
            entry.expectedHead.publicationId !== priorPublication || entry.expectedHead.revision !== revision - 1)
          fail("invalid_record", "Descendant predecessor chain is incomplete.");
        const [artifactRaw, sourceRaw] = await Promise.all([
          requestValue(tx.objectStore("artifacts").get([accountId, entry.artifactId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore("artifacts").get([accountId, entry.sourceArtifactId]) as IDBRequest<unknown>)
        ]);
        if (!object(artifactRaw) || artifactRaw.raw !== entry.envelopeRaw ||
            !object(sourceRaw) || typeof sourceRaw.raw !== "string")
          fail("invalid_record", "Descendant immutable source or artifact is missing.");
        const source = envelopeFromRaw(sourceRaw.raw);
        const target = envelopeFromRaw(entry.envelopeRaw);
        if (!retainedArtifactMatches(sourceRaw, source) || !retainedArtifactMatches(artifactRaw, target))
          fail("invalid_record", "Descendant artifact record identity is malformed.");
        const sourceIdentity = deserializeSnapshot(source.snapshot).campaignIdentity;
        const targetIdentity = deserializeSnapshot(target.snapshot).campaignIdentity;
        if (source.accountId !== accountId || source.campaignId !== attempt.campaignId ||
            source.artifactId !== entry.sourceArtifactId || source.publicationId !== entry.sourcePublicationId ||
            source.snapshot !== entry.sourceSnapshotRaw || source.headRevision >= revision ||
            !sourceIdentity || !targetIdentity ||
            (entry.sourceArtifactId === priorId
              ? targetIdentity.continuityId !== sourceIdentity.continuityId
              : targetIdentity.parentContinuityId !== sourceIdentity.continuityId ||
                targetIdentity.forkedFromArtifactId !== entry.sourceArtifactId ||
                targetIdentity.forkedFromPublicationId !== entry.sourcePublicationId ||
                !nonblank(targetIdentity.firstDivergentMutationId)))
          fail("invalid_record", "Descendant source continuity is invalid.");
        if (entry.sourceSlotId !== source.slotId ||
            (entry.expectedSlotAddress !== null && entry.expectedSlotAddress.artifactId === entry.artifactId))
          fail("invalid_record", "Descendant source or destination address evidence is invalid.");
        if (revision < regularHeadRevision &&
            (entry.status !== "consumers_completed" || !descendantReceiptsMatch(account, entry)))
          fail("invalid_record", "Non-head descendant lacks completed consumers.");
        priorId = entry.artifactId;
        priorPublication = entry.publicationId;
      }
      if (published.control.closed) {
        const terminalRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
          .get([accountId, attempt.campaignId, published.control.headPublicationId]) as IDBRequest<unknown>);
        const terminal = checkedTerminalRecovery(terminalRaw, accountId, attempt.campaignId,
          published.control.headPublicationId);
        if (terminal.expectedHead.artifactId !== priorId ||
            terminal.expectedHead.publicationId !== priorPublication ||
            terminal.expectedHead.revision !== regularHeadRevision ||
            terminal.artifactId !== published.control.headArtifactId ||
            terminal.envelopeRaw !== published.artifactRaw ||
            terminal.sourceArtifactId !== priorId ||
            terminal.sourcePublicationId !== priorPublication ||
            terminal.status === "settlement_completed" && !terminalReceiptsMatch(account, terminal) ||
            terminal.status === "accepted_pending_settlement" &&
              (account.revision !== terminal.expectedAccountRevision ||
                !exactEqual(account.profile, terminal.sourceProfile)))
          fail("invalid_record", "Closed campaign lacks exact terminal lifecycle authority.");
        const addressed = envelopeFromRaw(published.slotRaw);
        if (addressed.artifactId === terminal.artifactId) {
          if (terminal.slotId !== slotId || published.slotRaw !== terminal.envelopeRaw)
            fail("invalid_record", "Terminal address disagrees with lifecycle recovery.");
        } else if (addressed.headRevision > 1) {
          const prior = byRevision.get(addressed.headRevision);
          if (!prior || prior.slotId !== slotId || prior.artifactId !== addressed.artifactId ||
              prior.envelopeRaw !== published.slotRaw || prior.status !== "consumers_completed" ||
              !descendantReceiptsMatch(account, prior))
            fail("invalid_record", "Closed campaign address lost completed descendant evidence.");
        } else if (addressed.artifactId !== recovery.artifactId ||
            recovery.envelopeRaw !== published.slotRaw)
          fail("invalid_record", "Closed campaign address lost first publication evidence.");
        const run = account.profile.history.runRecords.filter(entry => entry.characterId === addressed.characterId);
        if (run.length !== 1 || !run[0]!.saveSlotIds.includes(slotId))
          fail("invalid_record", "Closed address lacks retained run history membership.");
        return { slotId, status: "closed", metadata: addressed.metadata };
      }
      const head = byRevision.get(published.control.headRevision)!;
      if (head.artifactId !== descendant.artifactId || head.publicationId !== descendant.publicationId ||
          head.envelopeRaw !== published.artifactRaw ||
          head.expectedHead.artifactId !== published.control.previousHeadArtifactId ||
          head.expectedHead.publicationId !== published.control.previousHeadPublicationId ||
          (published.witness?.requestId ?? null) !== head.witnessRequestId)
        fail("invalid_record", "Descendant head, recovery or Soundings witness disagree.");
      const addressed = envelopeFromRaw(published.slotRaw);
      if (head.status === "accepted_pending_consumers")
        return { slotId, status: "pending_consumers", metadata: addressed.metadata };
      if (!descendantReceiptsMatch(account, head)) fail("invalid_record", "Head descendant lacks exact account receipts.");
      const addressedRecovery = addressed.headRevision === 1 ? recovery : byRevision.get(addressed.headRevision);
      if (!addressedRecovery || addressedRecovery.status !== "consumers_completed" ||
          addressedRecovery.artifactId !== addressed.artifactId ||
          addressedRecovery.publicationId !== addressed.publicationId ||
          addressedRecovery.envelopeRaw !== published.slotRaw ||
          (addressed.headRevision > 1 && (addressedRecovery as CleanEpochDescendantRecovery).slotId !== slotId))
        fail("invalid_record", "Slot address lacks completed retained publication authority.");
      const firstRun = account.profile.history.runRecords.filter(run => run.characterId === addressed.characterId);
      if (firstRun.length !== 1 || !firstRun[0]!.saveSlotIds.includes(slotId))
        fail("invalid_record", "Address lacks retained account history.");
      if (published.control.closed) return { slotId, status: "closed", metadata: addressed.metadata };
      const snapshot = deserializeSnapshot(addressed.snapshot);
      const sessionControl = createCampaignSessionControl({ accountId, campaignId: attempt.campaignId,
        artifactId: addressed.artifactId, publicationId: addressed.publicationId,
        artifactRevision: addressed.headRevision, continuityId: addressed.continuityId,
        headArtifactId: descendant.artifactId, headRevision: descendant.headRevision });
      return { slotId, status: "ready", metadata: addressed.metadata, loaded: {
        snapshot, sessionControl: published.witness ? { ...sessionControl, soundingsAdmissionWitness: published.witness } : sessionControl,
        publication: publicationFor(snapshot, addressed.headRevision === 1 ? recovery :
          { ...(addressedRecovery as CleanEpochDescendantRecovery), updatedAt: addressedRecovery.createdAt }),
        migratedLegacy: false, repairedLegacyDefeat: false
      } };
    }
    if (!publicationMatchesRecovery(published, recovery))
      fail("invalid_record", "First-head publication and recovery disagree.");
    if (recovery.status === "accepted_pending_consumers")
      return { slotId, status: "pending_consumers", metadata: envelopeFromRaw(published.artifactRaw).metadata };
    const envelope = envelopeFromRaw(published.artifactRaw);
    const snapshot = deserializeSnapshot(envelope.snapshot);
    const firstRun = account.profile.history.runRecords.filter(run => run.characterId === envelope.characterId);
    if (firstRun.length !== 1 || !firstRun[0]!.saveSlotIds.includes(slotId))
      fail("invalid_record", "Completed first head lacks its retained account history address.");
    const sessionControl = createCampaignSessionControl({ accountId, campaignId: attempt.campaignId,
      artifactId: envelope.artifactId, publicationId: envelope.publicationId, artifactRevision: 1,
      continuityId: envelope.continuityId, headArtifactId: published.control.headArtifactId,
      headRevision: published.control.headRevision });
    return { slotId, status: "ready", metadata: envelope.metadata, loaded: {
      snapshot, sessionControl: published.witness ? { ...sessionControl, soundingsAdmissionWitness: published.witness } : sessionControl,
      publication: publicationFor(snapshot, recovery), migratedLegacy: false, repairedLegacyDefeat: false
    } };
  }

  async read(accountId: string): Promise<CleanEpochAccountRecord | null> {
    if (!nonblank(accountId)) fail("invalid_record", "Account ID is blank.");
    try {
      const transaction = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE,
        CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE], "readonly");
      const [value, receiptRaw] = await Promise.all([
        requestValue(transaction.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(transaction.objectStore(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE).get(accountId) as IDBRequest<unknown>)
      ]);
      const receipt = receiptRaw === undefined ? null : checkedLifecycle(receiptRaw, accountId);
      if (value === undefined) {
        if (receipt?.kind === "reset") fail("invalid_record", "Reset account is missing.");
        return null;
      }
      const account = checkedAccount(value, accountId);
      if ((!receipt && accountLifecycleGeneration(account) !== 1) ||
          (receipt && (receipt.kind === "delete" ||
            accountLifecycleGeneration(account) !== receipt.completedGeneration)))
        fail("invalid_record", "Account disagrees with lifecycle receipt.");
      return account;
    } catch (error) { throw classify(error, "unavailable"); }
  }

  async list(): Promise<CleanEpochAccountRecord[]> {
    try {
      const transaction = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE,
        CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE], "readonly");
      const values = await requestValue(transaction.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).getAll() as IDBRequest<unknown[]>);
      const accounts = values.map(value => checkedAccount(value,
        object(value) && typeof value.accountId === "string" ? value.accountId : ""));
      for (const account of accounts) {
        const raw = await requestValue(transaction.objectStore(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE)
          .get(account.accountId) as IDBRequest<unknown>);
        if (raw === undefined) {
          if (accountLifecycleGeneration(account) !== 1)
            fail("invalid_record", "Listed account lacks lifecycle authority.");
          continue;
        }
        const receipt = checkedLifecycle(raw, account.accountId);
        if (receipt.kind === "delete" || accountLifecycleGeneration(account) !== receipt.completedGeneration)
          fail("invalid_record", "Listed account disagrees with lifecycle authority.");
      }
      return accounts;
    } catch (error) { throw classify(error, "unavailable"); }
  }

  /** Session/active-account hints are non-authoritative; a stale hint cannot create a profile. */
  async readSelected(accountId: string | null): Promise<CleanEpochAccountRecord | null> {
    if (accountId === null) return null;
    const selected = await this.read(accountId);
    if (!selected) fail("invalid_record", "Selected clean-epoch account is missing.");
    return selected;
  }

  /** A lost caller must read this reservation before preparing another identity. */
  async readAttempt(accountId: string, slotId: string): Promise<CleanEpochAttemptRecord | null> {
    if (!nonblank(accountId) || !validSlotId(slotId)) fail("invalid_record", "Attempt address is invalid.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_SLOT_GENERATION_STORE], "readonly");
      const account = await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>);
      if (account === undefined) fail("invalid_record", "Retained attempt account is missing.");
      checkedAccount(account, accountId);
      const rawPointer = await requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
        .get([accountId, slotId]) as IDBRequest<unknown>);
      if (rawPointer === undefined) return null;
      const pointer = checkedSlotGeneration(rawPointer, accountId, slotId);
      if (pointer.status === "deleted") return null;
      const attempt = await requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE)
        .get([accountId, pointer.campaignId]) as IDBRequest<unknown>);
      if (attempt === undefined) fail("invalid_record", "Current slot generation lacks its creator attempt.");
      if (object(attempt) && attempt.slotId !== slotId) return null;
      const checked = checkedAttempt(attempt, accountId, slotId);
      if (checked.attemptId !== pointer.attemptId) fail("invalid_record", "Slot generation disagrees with creator identity.");
      return checked;
    } catch (error) { throw classify(error, "unavailable"); }
  }

  /** Atomic account-slot reservation. Publication and completion require the successor owner. */
  async prepareAttempt(candidate: CleanEpochAttemptRecord): Promise<CleanEpochAttemptWriteResult> {
    if (!object(candidate) || !validSlotId(candidate.slotId) || !validAttempt(candidate, candidate.accountId, candidate.slotId))
      fail("invalid_record", "New-campaign attempt candidate is invalid.");
    let tx: IDBTransaction;
    try { tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
      CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, "slots", "controls"], "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(tx);
    let status: CleanEpochAttemptWriteResult["status"] = "committed";
    try {
      const accountRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(candidate.accountId) as IDBRequest<unknown>);
      if (accountRaw === undefined) fail("invalid_record", "New-campaign account is missing.");
      const account = checkedAccount(accountRaw, candidate.accountId);
      if (account.revision !== candidate.expectedAccountRevision) fail("stale_head", "New-campaign account revision changed.");
      await this.assertNoPendingTerminal(tx, candidate.accountId);
      const attempts = tx.objectStore(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE);
      const retainedRaw = await requestValue(attempts.get([candidate.accountId, candidate.campaignId]) as IDBRequest<unknown>);
      const pointerRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
        .get([candidate.accountId, candidate.slotId]) as IDBRequest<unknown>);
      const pointer = pointerRaw === undefined ? null :
        checkedSlotGeneration(pointerRaw, candidate.accountId, candidate.slotId);
      if (retainedRaw !== undefined) {
        const retained = checkedAttempt(retainedRaw, candidate.accountId, candidate.slotId);
        if (!exactEqual(retained, candidate)) fail("conflict", "Account slot is reserved by a different attempt.");
        if (!pointer || pointer.status !== "prepared" || pointer.campaignId !== candidate.campaignId ||
            pointer.attemptId !== candidate.attemptId)
          fail("invalid_record", "Retained creator attempt lacks its current prepared slot generation.");
        status = "same_source_retry";
      }
      const occupied = await requestValue(tx.objectStore("slots").get([candidate.accountId, candidate.slotId]) as IDBRequest<unknown>);
      const campaign = await requestValue(tx.objectStore("controls").get([candidate.accountId, candidate.campaignId]) as IDBRequest<unknown>);
      const recovery = await requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE)
        .get([candidate.accountId, candidate.campaignId]) as IDBRequest<unknown>);
      if (recovery !== undefined) {
        if (retainedRaw === undefined) fail("invalid_record", "Account slot has orphan publication recovery.");
        checkedRecovery(recovery, checkedAttempt(retainedRaw, candidate.accountId, candidate.slotId));
        fail("conflict", "Account slot has pending publication recovery.");
      }
      if (occupied !== undefined || campaign !== undefined) fail("conflict", "New-campaign destination already has publication authority.");
      if (status === "committed" && pointer && pointer.status !== "deleted")
        fail("conflict", "Physical slot is owned by another generation.");
      if (status === "committed" && pointer) {
        const receipt = await requestValue(tx.objectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE)
          .get([candidate.accountId, candidate.slotId, pointer.slotGenerationId]) as IDBRequest<unknown>);
        if (!validAddressDeletionReceipt(receipt, pointer, account))
          fail("invalid_record", "Deleted slot generation lacks its exact deletion receipt.");
      }
      if (status === "committed") {
        this.beforeWrite?.(tx);
        await requestValue(attempts.put(candidate));
        this.afterWrite?.(tx);
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE).put({ version: 1,
          accountId: candidate.accountId, slotId: candidate.slotId as SaveSlotId,
          slotGenerationId: `slot.${globalThis.crypto.randomUUID()}`,
          campaignId: candidate.campaignId, attemptId: candidate.attemptId,
          status: "prepared" } satisfies CleanEpochSlotGeneration));
        this.afterWrite?.(tx);
      }
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* already settled */ }
      try { await done; } catch { /* original error is authoritative */ }
      throw classify(error, "aborted");
    }
    const readback = await this.readAttempt(candidate.accountId, candidate.slotId);
    if (!readback || !exactEqual(readback, candidate)) fail("readback_failed", "Attempt reservation failed exact readback.");
    return { status, readback };
  }

  /** The only new-epoch first-publication entry point; consumers remain pending. */
  async publishPreparedAttempt(attemptId: string, input: CampaignStorePublication): Promise<CleanEpochFirstPublicationResult> {
    if (!nonblank(attemptId) || !object(input) || !object(input.control) || !validSlotId(input.slotId) || input.expectedHead !== null ||
        input.control.headRevision !== 1 || input.control.closed) fail("invalid_record", "First-publication request is invalid.");
    const envelope = envelopeFromRaw(input.artifactRaw);
    if (envelope.accountId !== input.accountId || envelope.slotId !== input.slotId ||
        envelope.campaignId !== input.campaignId || envelope.headRevision !== 1 || envelope.terminal ||
        !nonblank(envelope.artifactId) || !nonblank(envelope.generationId) || !nonblank(envelope.publicationId)) {
      fail("invalid_record", "First-publication identity is invalid.");
    }
    const publicationStore = new CampaignIndexedDbStore(this.db,
      (_, tx) => this.beforeWrite?.(tx), (_, tx) => this.afterWrite?.(tx));
    let proposed: CleanEpochPublicationRecovery | null = null;
    let pointerToPublish: CleanEpochSlotGeneration | null = null;
    const publication = await publicationStore.publish(input, {
      storeNames: [CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE],
      verify: async (tx, current) => {
        const [accountRaw, attemptRaw, recoveryRaw, pointerRaw] = await Promise.all([
          requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(input.accountId) as IDBRequest<unknown>),
          requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE).get([input.accountId, input.campaignId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE).get([input.accountId, input.campaignId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE).get([input.accountId, input.slotId]) as IDBRequest<unknown>)
        ]);
        if (accountRaw === undefined || attemptRaw === undefined) fail("invalid_record", "First publication lacks retained account or attempt.");
        const account = checkedAccount(accountRaw, input.accountId);
        await this.assertNoPendingTerminal(tx, input.accountId);
        const attempt = checkedAttempt(attemptRaw, input.accountId, input.slotId);
        const pointer = checkedSlotGeneration(pointerRaw, input.accountId, input.slotId);
        if (pointer.campaignId !== input.campaignId || pointer.attemptId !== attemptId ||
            (pointer.status !== "prepared" && pointer.status !== "published"))
          fail("conflict", "First publication slot generation changed.");
        if (attempt.attemptId !== attemptId || attempt.campaignId !== input.campaignId ||
            attempt.snapshotRaw !== envelope.snapshot || !attempt.consumerPlans.some(plan => plan.kind === "active_history")) {
          fail("conflict", "First publication does not match the retained attempt and required history plan.");
        }
        const snapshot = deserializeSnapshot(attempt.snapshotRaw);
        const witnessRequestId = snapshot.authorityLedger?.soundingsTurnIn?.version === 2
          ? snapshot.authorityLedger.soundingsTurnIn.requests[0]?.requestId ?? null : null;
        proposed = {
          version: 1, status: "accepted_pending_consumers", accountId: input.accountId, slotId: input.slotId,
          campaignId: input.campaignId, attemptId, artifactId: envelope.artifactId, generationId: envelope.generationId,
          publicationId: envelope.publicationId, headRevision: 1, expectedAccountRevision: attempt.expectedAccountRevision,
          envelopeRaw: input.artifactRaw, witnessRequestId, consumerPlans: attempt.consumerPlans,
          completedConsumerKinds: [], createdAt: attempt.createdAt, updatedAt: input.control.updatedAt
        };
        if (!validRecovery(proposed, attempt)) fail("invalid_record", "Proposed first-publication recovery is invalid.");
        if (recoveryRaw !== undefined) {
          if (pointer.status !== "published") fail("invalid_record", "Accepted first recovery lacks published slot generation.");
          const retained = checkedRecovery(recoveryRaw, attempt);
          if (retained.status === "accepted_pending_consumers" && account.revision !== attempt.expectedAccountRevision)
            fail("stale_head", "First-publication account revision changed.");
          if (!current || !exactEqual(current, input.control) || !sameRecoverySource(retained, proposed) ||
              (retained.status === "consumers_completed" && !completedReceiptsMatch(account, retained)))
            fail("conflict", "Pending account-slot recovery conflicts with first publication.");
          if (retained.status === "accepted_pending_consumers") firstCampaignProjection(account, attempt, retained);
        } else if (current && exactEqual(current, input.control))
          fail("invalid_record", "Published campaign lacks its pending consumer recovery.");
        else {
          if (pointer.status !== "prepared") fail("invalid_record", "Prepared first campaign has published slot generation.");
          if (account.revision !== attempt.expectedAccountRevision) fail("stale_head", "First-publication account revision changed.");
          firstCampaignProjection(account, attempt, proposed);
          pointerToPublish = { ...pointer, status: "published" };
        }
      },
      write: async tx => {
        if (!proposed) fail("invalid_record", "First-publication recovery was not validated.");
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE).put(proposed));
        this.afterWrite?.(tx);
        if (pointerToPublish) {
          this.beforeWrite?.(tx);
          await requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE).put(pointerToPublish));
          this.afterWrite?.(tx);
        }
      }
    });
    const recovery = await this.readRecovery(input.accountId, input.slotId);
    if (!recovery || !proposed || !sameRecoverySource(recovery, proposed)) fail("readback_failed", "First-publication recovery failed exact readback.");
    return { publication, recovery };
  }

  /** Accept one closed head and its recoverable retirement identity atomically. */
  async publishTerminal(request: CleanEpochTerminalRequest): Promise<CleanEpochTerminalRecovery> {
    const { publication: input, expectedAccountRevision, sourceArtifactId, sourcePublicationId,
      sourceSnapshotRaw, sourceAddress, addressSlotIds, consumerPlans, sessionWitness } = request;
    if (!input.expectedHead || !validSlotId(input.slotId) ||
        input.expectedSlotAddress === undefined || !nonblank(sourceArtifactId) ||
        !nonblank(sourcePublicationId) || typeof sourceSnapshotRaw !== "string" ||
        !Number.isSafeInteger(expectedAccountRevision) || expectedAccountRevision < 1 ||
        !object(sourceAddress) || !nonblank(sourceAddress.artifactId) ||
        !nonblank(sourceAddress.publicationId) || !Array.isArray(addressSlotIds) ||
        !Array.isArray(consumerPlans) ||
        (sessionWitness && (!isSoundingsAdmissionWitness(sessionWitness) ||
          sessionWitness.posture !== "session")))
      fail("invalid_record", "Terminal publication request is malformed.");
    const envelope = envelopeFromRaw(input.artifactRaw);
    const snapshot = deserializeSnapshot(envelope.snapshot);
    if (!envelope.terminal || envelope.accountId !== input.accountId ||
        envelope.campaignId !== input.campaignId || envelope.slotId !== input.slotId ||
        hasPendingNormalDefeat(snapshot) || sourceAddress.artifactId !== sourceArtifactId ||
        sourceAddress.publicationId !== sourcePublicationId)
      fail("invalid_record", "Terminal artifact or source address is invalid.");
    let proposed: CleanEpochTerminalRecovery | null = null;
    const store = new CampaignIndexedDbStore(this.db,
      (_, tx) => this.beforeWrite?.(tx), (_, tx) => this.afterWrite?.(tx));
    await store.publish(input, {
      storeNames: [CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
        CLEAN_EPOCH_TERMINAL_RECOVERY_STORE],
      ...(sessionWitness ? { firstSessionWitness: sessionWitness } : {}),
      verify: async (tx, current) => {
        const [accountRaw, sourceRaw, addressRaw, retainedRaw, bySourceRaw] = await Promise.all([
          requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(input.accountId) as IDBRequest<unknown>),
          requestValue(tx.objectStore("artifacts").get([input.accountId, sourceArtifactId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore("slots").get([input.accountId, input.slotId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
            .get([input.accountId, input.campaignId, envelope.publicationId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
            .index("bySourcePublication").get([input.accountId, input.campaignId, sourcePublicationId]) as IDBRequest<unknown>)
        ]);
        if (accountRaw === undefined || !current || !object(sourceRaw) ||
            typeof sourceRaw.raw !== "string" || !object(addressRaw))
          fail("invalid_record", "Terminal source account, head, artifact or address is missing.");
        const account = checkedAccount(accountRaw, input.accountId);
        const source = envelopeFromRaw(sourceRaw.raw);
        if (!retainedArtifactMatches(sourceRaw, source) || source.snapshot !== sourceSnapshotRaw ||
            source.accountId !== input.accountId || source.campaignId !== input.campaignId ||
            source.slotId !== input.slotId || source.artifactId !== sourceArtifactId ||
            source.publicationId !== sourcePublicationId || source.terminal ||
            (retainedRaw === undefined &&
              (addressRaw.artifactId !== sourceArtifactId ||
                addressRaw.publicationId !== sourcePublicationId ||
                addressRaw.raw !== sourceRaw.raw || addressRaw.campaignId !== input.campaignId)) ||
            !exactEqual(input.expectedSlotAddress, sourceAddress) ||
            snapshot.playerState.playerId !== source.characterId ||
            snapshot.campaignIdentity?.continuityId !== source.continuityId ||
            snapshot.campaignIdentity?.campaignId !== input.campaignId ||
            sourceArtifactId !== input.expectedHead!.artifactId ||
            sourcePublicationId !== input.expectedHead!.publicationId ||
            source.headRevision !== input.expectedHead!.revision)
          fail("conflict", "Terminal source is not the exact retained open head and address.");
        const attempt = await this.campaignAttempt(tx, input.accountId, input.campaignId);
        const firstRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE)
          .get([input.accountId, attempt.campaignId]) as IDBRequest<unknown>);
        const first = checkedRecovery(firstRaw, attempt);
        if (first.status !== "consumers_completed" || !completedReceiptsMatch(account, first))
          fail("conflict", "Terminal source lacks completed first publication.");
        if (input.expectedHead!.revision > 1) {
          const priorRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE)
            .get([input.accountId, input.campaignId, input.expectedHead!.publicationId]) as IDBRequest<unknown>);
          const prior = checkedDescendantRecovery(priorRaw, input.accountId,
            input.campaignId, input.expectedHead!.publicationId);
          if (prior.status !== "consumers_completed" || !descendantReceiptsMatch(account, prior))
            fail("conflict", "Terminal source has pending descendant consumers.");
        }
        if (bySourceRaw !== undefined && (!object(bySourceRaw) ||
            bySourceRaw.publicationId !== envelope.publicationId))
          fail("conflict", "Source already owns a different terminal publication.");
        if (retainedRaw !== undefined) {
          const retained = checkedTerminalRecovery(retainedRaw, input.accountId,
            input.campaignId, envelope.publicationId);
          if (retained.envelopeRaw !== input.artifactRaw ||
              retained.sourceArtifactId !== sourceArtifactId ||
              retained.sourcePublicationId !== sourcePublicationId ||
              retained.expectedAccountRevision !== expectedAccountRevision ||
              !exactEqual(retained.addressSlotIds, addressSlotIds) ||
              !exactEqual(retained.consumerPlans, consumerPlans) ||
              current.headPublicationId !== envelope.publicationId ||
              (retained.status === "settlement_completed" && !terminalReceiptsMatch(account, retained)))
            fail("conflict", "Terminal retry differs from accepted lifecycle authority.");
          proposed = retained;
          return;
        }
        if (current.closed || current.headArtifactId !== sourceArtifactId ||
            account.revision !== expectedAccountRevision)
          fail("stale_head", "Terminal head or account revision changed.");
        await this.assertNoPendingTerminal(tx, input.accountId);
        const addressed = await requestValue(tx.objectStore("slots").index("byAccountCampaign")
          .getAll([input.accountId, input.campaignId]) as IDBRequest<unknown[]>);
        const actualIds: SaveSlotId[] = [];
        for (const raw of addressed) {
          if (!object(raw) || !validSlotId(raw.slotId) || !nonblank(raw.artifactId) ||
              !nonblank(raw.publicationId) || typeof raw.raw !== "string")
            fail("invalid_record", "Terminal campaign has malformed address membership.");
          const prior = envelopeFromRaw(raw.raw);
          const artifact = await requestValue(tx.objectStore("artifacts")
            .get([input.accountId, raw.artifactId]) as IDBRequest<unknown>);
          if (!retainedArtifactMatches(artifact, prior) ||
              prior.characterId !== envelope.characterId || prior.terminal)
            fail("invalid_record", "Terminal address lacks a retained open artifact.");
          actualIds.push(raw.slotId as SaveSlotId);
        }
        if (!exactEqual([...actualIds].sort(), [...addressSlotIds].sort()) ||
            new Set(actualIds).size !== actualIds.length)
          fail("conflict", "Terminal address membership changed.");
        const publication = publicationFor(snapshot,
          { publicationId: envelope.publicationId, campaignId: input.campaignId, updatedAt: input.control.updatedAt });
        const projection = projectRetirementSettlement({ profile: account.profile, snapshot,
          publication, slotId: input.slotId as SaveSlotId, addressSlotIds: actualIds, consumerPlans });
        const fingerprint = retirementSettlementFingerprint({ accountId: input.accountId,
          campaignId: input.campaignId, sourceArtifactId, sourcePublicationId,
          terminalArtifactId: envelope.artifactId, terminalPublicationId: envelope.publicationId,
          sourceSlotId: input.slotId as SaveSlotId, addressSlotIds: actualIds,
          payout: projection.payout, payoutTransactionId: projection.payoutTransactionId,
          estateSourceRunId: projection.estateSourceRunId, estateDepositId: projection.estateDepositId });
        if (consumerPlans.some(plan => plan.payloadFingerprint !== fingerprint))
          fail("conflict", "Terminal consumer fingerprints differ from derived settlement.");
        proposed = { version: 1, status: "accepted_pending_settlement", accountId: input.accountId,
          campaignId: input.campaignId, characterId: envelope.characterId,
          slotId: input.slotId as SaveSlotId, sourceArtifactId, sourcePublicationId,
          sourceSnapshotRaw, sourceAddress, expectedHead: input.expectedHead!,
          expectedAccountRevision, sourceProfile: account.profile, artifactId: envelope.artifactId,
          publicationId: envelope.publicationId, envelopeRaw: input.artifactRaw, archiveReason: "retired",
          addressSlotIds: actualIds, consumerPlans, settlementFingerprint: fingerprint,
          payoutTransactionId: projection.payoutTransactionId,
          estateSourceRunId: projection.estateSourceRunId, estateDepositId: projection.estateDepositId,
          createdAt: input.control.updatedAt };
        if (!validTerminalRecovery(proposed, input.accountId, input.campaignId, envelope.publicationId))
          fail("invalid_record", "Proposed terminal recovery failed derived validation.");
      },
      write: async tx => {
        if (!proposed) fail("invalid_record", "Terminal recovery was not prepared.");
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE).put(proposed));
        this.afterWrite?.(tx);
      }
    });
    const recovery = await this.readTerminalRecovery(input.accountId, input.campaignId, envelope.publicationId);
    if (!recovery || !proposed || !exactEqual(recovery, proposed))
      fail("readback_failed", "Terminal acceptance failed durable lifecycle readback.");
    return recovery;
  }

  async readTerminalRecovery(accountId: string, campaignId: string,
    publicationId: string): Promise<CleanEpochTerminalRecovery | null> {
    if (![accountId, campaignId, publicationId].every(nonblank))
      fail("invalid_record", "Terminal recovery address is invalid.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE,
        CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
        "artifacts", "controls", "slots", "witnesses"], "readonly");
      const [accountRaw, raw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
          .get([accountId, campaignId, publicationId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined) fail("invalid_record", "Terminal recovery account is missing.");
      const account = checkedAccount(accountRaw, accountId);
      if (raw === undefined) return null;
      const recovery = checkedTerminalRecovery(raw, accountId, campaignId, publicationId);
      const [sourceRaw, terminalRaw, controlRaw, addressRaw] = await Promise.all([
        requestValue(tx.objectStore("artifacts")
          .get([accountId, recovery.sourceArtifactId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("artifacts")
          .get([accountId, recovery.artifactId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("controls")
          .get([accountId, campaignId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("slots")
          .get([accountId, recovery.slotId]) as IDBRequest<unknown>)
      ]);
      if (!object(sourceRaw) || typeof sourceRaw.raw !== "string" ||
          !retainedArtifactMatches(sourceRaw, envelopeFromRaw(sourceRaw.raw)) ||
          envelopeFromRaw(sourceRaw.raw).snapshot !== recovery.sourceSnapshotRaw ||
          envelopeFromRaw(sourceRaw.raw).publicationId !== recovery.sourcePublicationId ||
          !object(terminalRaw) || terminalRaw.raw !== recovery.envelopeRaw ||
          !retainedArtifactMatches(terminalRaw, envelopeFromRaw(recovery.envelopeRaw)) ||
          !object(controlRaw) || !object(controlRaw.value) || controlRaw.value.closed !== true ||
          controlRaw.value.headArtifactId !== recovery.artifactId ||
          controlRaw.value.headPublicationId !== publicationId ||
          controlRaw.value.headRevision !== recovery.expectedHead.revision + 1)
        fail("invalid_record", "Terminal recovery lost its retained source, closed head or address.");
      if (!recovery.addressClosure) {
        if (!object(addressRaw) || addressRaw.artifactId !== recovery.artifactId ||
            addressRaw.publicationId !== publicationId || addressRaw.raw !== recovery.envelopeRaw)
          fail("invalid_record", "Unclosed terminal recovery lost its terminal address.");
        const published = await new CampaignIndexedDbStore(this.db).read(accountId, campaignId,
          recovery.slotId, tx);
        if (!published || published.artifactRaw !== recovery.envelopeRaw ||
            published.slotRaw !== recovery.envelopeRaw || !published.control.closed)
          fail("invalid_record", "Terminal recovery failed closed campaign readback.");
      } else {
        const addressed = await requestValue(tx.objectStore("slots").index("byAccountCampaign")
          .getAll([accountId, campaignId]) as IDBRequest<unknown[]>);
        if (addressed.length !== 0 ||
            (addressRaw !== undefined && object(addressRaw) && addressRaw.campaignId === campaignId))
          fail("invalid_record", "Closed terminal campaign regained an address.");
        const attempt = await this.campaignAttempt(tx, accountId, campaignId);
        const firstRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE)
          .get([accountId, campaignId]) as IDBRequest<unknown>);
        const first = checkedRecovery(firstRaw, attempt);
        if (first.status !== "consumers_completed" || !completedReceiptsMatch(account, first))
          fail("invalid_record", "Closed terminal lost first-campaign recovery.");
        if (first.witnessRequestId) {
          const witnessRaw = await requestValue(tx.objectStore("witnesses")
            .get([accountId, campaignId, first.witnessRequestId]) as IDBRequest<unknown>);
          if (!object(witnessRaw) || !isSoundingsAdmissionWitness(witnessRaw.value) ||
              witnessRaw.value.posture !== "applied")
            fail("invalid_record", "Closed terminal lost retained Soundings witness.");
        }
        for (const ref of recovery.addressClosure.receipts) {
          const receiptRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE)
            .get([accountId, ref.slotId, ref.slotGenerationId]) as IDBRequest<unknown>);
          const pointer: CleanEpochSlotGeneration = { version: 1, accountId,
            slotId: ref.slotId, slotGenerationId: ref.slotGenerationId,
            campaignId, attemptId: attempt.attemptId, status: "deleted" };
          if (!validAddressDeletionReceipt(receiptRaw, pointer, account) ||
              receiptRaw.reason !== "terminal" || receiptRaw.artifactId !== ref.artifactId ||
              receiptRaw.publicationId !== ref.publicationId ||
              receiptRaw.completedAccountRevision !== recovery.addressClosure.completedAccountRevision ||
              receiptRaw.deletedAt !== recovery.addressClosure.closedAt)
            fail("invalid_record", "Terminal address closure receipt is missing or mismatched.");
          const artifact = await requestValue(tx.objectStore("artifacts")
            .get([accountId, ref.artifactId]) as IDBRequest<unknown>);
          if (!object(artifact) || artifact.raw !== receiptRaw.addressRaw)
            fail("invalid_record", "Terminal deletion receipt lost its immutable artifact.");
          const currentPointerRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
            .get([accountId, ref.slotId]) as IDBRequest<unknown>);
          const currentPointer = checkedSlotGeneration(currentPointerRaw, accountId, ref.slotId);
          if (currentPointer.slotGenerationId === ref.slotGenerationId && currentPointer.status !== "deleted")
            fail("invalid_record", "Closed terminal slot generation is still published.");
        }
      }
      if (recovery.status === "accepted_pending_settlement") {
        if (account.revision !== recovery.expectedAccountRevision ||
            !exactEqual(account.profile, recovery.sourceProfile))
          fail("conflict", "Pending terminal source account changed.");
      } else if (!terminalReceiptsMatch(account, recovery))
        fail("invalid_record", "Completed terminal account receipts are missing.");
      return recovery;
    } catch (error) { throw classify(error, "invalid_record"); }
  }

  async readPendingTerminalForAccount(accountId: string): Promise<CleanEpochTerminalRecovery | null> {
    if (!nonblank(accountId)) fail("invalid_record", "Terminal account is invalid.");
    let rows: unknown[];
    try {
      const tx = this.db.transaction(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, "readonly");
      rows = await requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
        .index("byAccount").getAll(accountId) as IDBRequest<unknown[]>);
    } catch (error) { throw classify(error, "unavailable"); }
    const pending: CleanEpochTerminalRecovery[] = [];
    for (const raw of rows) {
      if (!object(raw) || !nonblank(raw.campaignId) || !nonblank(raw.publicationId))
        fail("invalid_record", "Account has malformed terminal recovery.");
      const verified = await this.readTerminalRecovery(accountId, raw.campaignId, raw.publicationId);
      if (!verified) fail("invalid_record", "Account terminal recovery disappeared.");
      if (verified.status === "accepted_pending_settlement") pending.push(verified);
    }
    if (pending.length > 1) fail("invalid_record", "Account has multiple pending terminal settlements.");
    return pending[0] ?? null;
  }

  async closePendingTerminalAddressesForAccount(accountId: string): Promise<number> {
    if (!nonblank(accountId)) fail("invalid_record", "Terminal closure account is invalid.");
    let rows: unknown[];
    try {
      const tx = this.db.transaction(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, "readonly");
      rows = await requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
        .index("byAccount").getAll(accountId) as IDBRequest<unknown[]>);
    } catch (error) { throw classify(error, "unavailable"); }
    let completed = 0;
    for (const raw of rows) {
      if (!object(raw) || !nonblank(raw.campaignId) || !nonblank(raw.publicationId))
        fail("invalid_record", "Account has malformed terminal closure source.");
      const recovery = await this.readTerminalRecovery(accountId, raw.campaignId, raw.publicationId);
      if (!recovery) fail("invalid_record", "Terminal closure source disappeared.");
      if (recovery.status !== "settlement_completed" || recovery.addressClosure) continue;
      const account = await this.readSelected(accountId);
      if (!account) fail("invalid_record", "Terminal closure account disappeared.");
      await this.closeTerminalAddresses(accountId, recovery.campaignId, recovery.publicationId,
        account.revision, new Date().toISOString());
      completed++;
    }
    return completed;
  }

  async readTerminalForSource(accountId: string, campaignId: string,
    sourcePublicationId: string): Promise<CleanEpochTerminalRecovery | null> {
    if (![accountId, campaignId, sourcePublicationId].every(nonblank))
      fail("invalid_record", "Terminal source identity is invalid.");
    let raw: unknown;
    try {
      const tx = this.db.transaction(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, "readonly");
      raw = await requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
        .index("bySourcePublication")
        .get([accountId, campaignId, sourcePublicationId]) as IDBRequest<unknown>);
    } catch (error) { throw classify(error, "unavailable"); }
    if (raw === undefined) return null;
    if (!object(raw) || !nonblank(raw.publicationId))
      fail("invalid_record", "Terminal source index is malformed.");
    const recovery = await this.readTerminalRecovery(accountId, campaignId, raw.publicationId);
    if (!recovery || recovery.sourcePublicationId !== sourcePublicationId)
      fail("invalid_record", "Terminal source index disagrees with recovery.");
    return recovery;
  }

  /** The account profile and completion marker advance together or neither does. */
  async completeTerminalSettlement(accountId: string, campaignId: string,
    publicationId: string): Promise<CleanEpochAccountWriteResult> {
    await this.readTerminalRecovery(accountId, campaignId, publicationId);
    let tx: IDBTransaction;
    try { tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
      "artifacts", "controls", "slots"], "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(tx);
    let expectedAccount: CleanEpochAccountRecord;
    let expectedRecovery: CleanEpochTerminalRecovery;
    let status: CleanEpochAccountWriteResult["status"] = "committed";
    try {
      const [accountRaw, recoveryRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
          .get([accountId, campaignId, publicationId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined || recoveryRaw === undefined)
        fail("invalid_record", "Terminal settlement lacks account or recovery.");
      const account = checkedAccount(accountRaw, accountId);
      const recovery = checkedTerminalRecovery(recoveryRaw, accountId, campaignId, publicationId);
      const [controlRaw, artifactRaw, addressRaw] = await Promise.all([
        requestValue(tx.objectStore("controls").get([accountId, campaignId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("artifacts").get([accountId, recovery.artifactId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("slots").get([accountId, recovery.slotId]) as IDBRequest<unknown>)
      ]);
      if (!object(controlRaw) || !object(controlRaw.value) ||
          controlRaw.value.headArtifactId !== recovery.artifactId ||
          controlRaw.value.headPublicationId !== publicationId || controlRaw.value.closed !== true ||
          !object(artifactRaw) || artifactRaw.raw !== recovery.envelopeRaw ||
          (!recovery.addressClosure && (!object(addressRaw) ||
            addressRaw.artifactId !== recovery.artifactId ||
            addressRaw.publicationId !== publicationId)))
        fail("invalid_record", "Terminal settlement lost closed publication authority.");
      if (recovery.status === "settlement_completed") {
        if (!terminalReceiptsMatch(account, recovery))
          fail("invalid_record", "Completed settlement receipts are inconsistent.");
        expectedAccount = account;
        expectedRecovery = recovery;
        status = "same_source_retry";
      } else {
        if (account.revision !== recovery.expectedAccountRevision ||
            !exactEqual(account.profile, recovery.sourceProfile))
          fail("stale_head", "Terminal settlement account revision changed.");
        const snapshot = deserializeSnapshot(envelopeFromRaw(recovery.envelopeRaw).snapshot);
        const projection = projectRetirementSettlement({ profile: account.profile, snapshot,
          publication: publicationFor(snapshot, { campaignId, publicationId,
            updatedAt: recovery.createdAt }), slotId: recovery.slotId,
          addressSlotIds: recovery.addressSlotIds, consumerPlans: recovery.consumerPlans });
        if (projection.payoutTransactionId !== recovery.payoutTransactionId ||
            projection.estateSourceRunId !== recovery.estateSourceRunId ||
            projection.estateDepositId !== recovery.estateDepositId ||
            !validProfile(projection.profile, accountId))
          fail("invalid_record", "Terminal settlement projection conflicts with recovery.");
        expectedAccount = { ...account, revision: account.revision + 1, profile: projection.profile };
        expectedRecovery = { ...recovery, status: "settlement_completed",
          completedAccountRevision: expectedAccount.revision };
        if (!validTerminalRecovery(expectedRecovery, accountId, campaignId, publicationId))
          fail("invalid_record", "Completed terminal recovery is malformed.");
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).put(expectedAccount));
        this.afterWrite?.(tx);
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE).put(expectedRecovery));
        this.afterWrite?.(tx);
      }
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* already settled */ }
      try { await done; } catch { /* original error is authoritative */ }
      throw classify(error, "aborted");
    }
    const [account, recovery] = await Promise.all([
      this.read(accountId), this.readTerminalRecovery(accountId, campaignId, publicationId)
    ]);
    if (!account || !recovery || !exactEqual(recovery, expectedRecovery) ||
        (status === "committed" && !exactEqual(account, expectedAccount)) ||
        !terminalReceiptsMatch(account, recovery))
      fail("readback_failed", "Completed terminal settlement failed exact readback.");
    return { status, readback: account };
  }

  /** Close all retained terminal addresses only after independently verified settlement. */
  async closeTerminalAddresses(accountId: string, campaignId: string, publicationId: string,
    expectedAccountRevision: number, closedAt: string): Promise<CleanEpochTerminalClosureResult> {
    if (![accountId, campaignId, publicationId, closedAt].every(nonblank) ||
        !Number.isSafeInteger(expectedAccountRevision) || expectedAccountRevision < 1)
      fail("invalid_record", "Terminal closure request is invalid.");
    const verified = await this.readTerminalRecovery(accountId, campaignId, publicationId);
    if (!verified || verified.status !== "settlement_completed")
      fail("conflict", "Terminal settlement is not completed and verified.");
    let tx: IDBTransaction;
    try { tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
      CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE,
      CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
      CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, "artifacts", "controls", "slots", "witnesses"], "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(tx);
    let status: CleanEpochTerminalClosureResult["status"] = "committed";
    let expectedAccount: CleanEpochAccountRecord;
    let expectedRecovery: CleanEpochTerminalRecovery;
    try {
      const [accountRaw, recoveryRaw, controlRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE)
          .get([accountId, campaignId, publicationId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("controls").get([accountId, campaignId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined || recoveryRaw === undefined || !object(controlRaw) ||
          !object(controlRaw.value) || controlRaw.value.closed !== true ||
          controlRaw.value.headPublicationId !== publicationId)
        fail("invalid_record", "Terminal closure lost account, lifecycle row or closed head.");
      const account = checkedAccount(accountRaw, accountId);
      const recovery = checkedTerminalRecovery(recoveryRaw, accountId, campaignId, publicationId);
      if (recovery.status !== "settlement_completed" || !terminalReceiptsMatch(account, recovery))
        fail("invalid_record", "Terminal closure lacks completed settlement receipts.");
      if (recovery.addressClosure) {
        if (recovery.addressClosure.completedAccountRevision !== expectedAccountRevision + 1 ||
            recovery.addressClosure.closedAt !== closedAt)
          fail("conflict", "Terminal closure retry differs from retained identity.");
        expectedAccount = account;
        expectedRecovery = recovery;
        status = "same_source_retry";
      } else {
        if (account.revision !== expectedAccountRevision)
          fail("stale_head", "Terminal closure account revision changed.");
        const runs = account.profile.history.runRecords.filter(run => run.characterId === recovery.characterId);
        if (runs.length !== 1 || runs[0]!.outcome !== "archived" ||
            runs[0]!.archiveReason !== "retired" ||
            !exactEqual([...runs[0]!.saveSlotIds].sort(), [...recovery.addressSlotIds].sort()))
          fail("invalid_record", "Terminal closure history membership differs from settled addresses.");
        const receipts: CleanEpochAddressDeletionReceipt[] = [];
        for (const slotId of recovery.addressSlotIds) {
          const inspected = await this.inspectSlot(tx, account, slotId);
          if (inspected.status !== "closed") fail("conflict", "Terminal address is not a completed closed slot.");
          const [addressRaw, pointerRaw] = await Promise.all([
            requestValue(tx.objectStore("slots").get([accountId, slotId]) as IDBRequest<unknown>),
            requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
              .get([accountId, slotId]) as IDBRequest<unknown>)
          ]);
          const pointer = checkedSlotGeneration(pointerRaw, accountId, slotId);
          if (!object(addressRaw) || typeof addressRaw.raw !== "string" ||
              addressRaw.campaignId !== campaignId || pointer.status !== "published" ||
              pointer.campaignId !== campaignId)
            fail("invalid_record", "Terminal closure address or slot generation changed.");
          const envelope = envelopeFromRaw(addressRaw.raw);
          if (envelope.characterId !== recovery.characterId ||
              envelope.artifactId !== addressRaw.artifactId ||
              envelope.publicationId !== addressRaw.publicationId)
            fail("invalid_record", "Terminal closure address lacks exact immutable identity.");
          receipts.push({ version: 1, accountId, slotId, slotGenerationId: pointer.slotGenerationId,
            campaignId, characterId: recovery.characterId, artifactId: envelope.artifactId,
            publicationId: envelope.publicationId, addressRaw: addressRaw.raw,
            expectedAccountRevision, completedAccountRevision: expectedAccountRevision + 1,
            reason: "terminal", deletedAt: closedAt });
        }
        const profile: AccountProfileState = { ...account.profile, updatedAt: closedAt,
          history: { ...account.profile.history, runRecords: account.profile.history.runRecords.map(run =>
            run.characterId === recovery.characterId ? { ...run, saveSlotIds: [] } : run) } };
        expectedAccount = { ...account, revision: account.revision + 1, profile };
        expectedRecovery = { ...recovery, addressClosure: {
          completedAccountRevision: expectedAccount.revision, closedAt,
          receipts: receipts.map(receipt => ({ slotId: receipt.slotId,
            slotGenerationId: receipt.slotGenerationId, artifactId: receipt.artifactId,
            publicationId: receipt.publicationId })) } };
        if (!validProfile(profile, accountId) ||
            !validTerminalRecovery(expectedRecovery, accountId, campaignId, publicationId) ||
            !terminalReceiptsMatch(expectedAccount, expectedRecovery))
          fail("invalid_record", "Projected terminal address closure is malformed.");
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).put(expectedAccount));
        this.afterWrite?.(tx);
        for (const receipt of receipts) {
          const pointerRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
            .get([accountId, receipt.slotId]) as IDBRequest<unknown>);
          const pointer = checkedSlotGeneration(pointerRaw, accountId, receipt.slotId);
          if (!validAddressDeletionReceipt(receipt, { ...pointer, status: "deleted" }, expectedAccount))
            fail("invalid_record", "Terminal deletion receipt is malformed.");
          this.beforeWrite?.(tx);
          await requestValue(tx.objectStore("slots").delete([accountId, receipt.slotId]));
          this.afterWrite?.(tx);
          this.beforeWrite?.(tx);
          await requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
            .put({ ...pointer, status: "deleted" } satisfies CleanEpochSlotGeneration));
          this.afterWrite?.(tx);
          this.beforeWrite?.(tx);
          await requestValue(tx.objectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE).put(receipt));
          this.afterWrite?.(tx);
        }
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_TERMINAL_RECOVERY_STORE).put(expectedRecovery));
        this.afterWrite?.(tx);
      }
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* already settled */ }
      try { await done; } catch { /* original failure is authoritative */ }
      throw classify(error, "aborted");
    }
    const [account, recovery] = await Promise.all([
      this.read(accountId), this.readTerminalRecovery(accountId, campaignId, publicationId)
    ]);
    if (!account || !recovery || !exactEqual(recovery, expectedRecovery) ||
        (status === "committed" && !exactEqual(account, expectedAccount)))
      fail("readback_failed", "Terminal address closure failed exact readback.");
    if (status === "committed") for (const slotId of recovery.addressSlotIds)
      if ((await this.readSlot(accountId, slotId)).status !== "empty")
        fail("readback_failed", "Closed terminal address remains occupied.");
    return { status, account, recovery };
  }

  /** Ordinary-save entry point. The accepted head remains nonplayable until its consumers complete. */
  async publishDescendant(request: CleanEpochDescendantRequest): Promise<CleanEpochDescendantResult> {
    const { publication: input, sessionWitness, expectedAccountRevision, sourceSlotId,
      sourceArtifactId, sourcePublicationId, sourceSnapshotRaw, consumerPlans } = request;
    if (!object(input) || !input.expectedHead || !validSlotId(input.slotId) || !validSlotId(sourceSlotId) ||
        input.expectedSlotAddress === undefined ||
        !Number.isSafeInteger(expectedAccountRevision) || expectedAccountRevision < 1 ||
        !nonblank(sourceArtifactId) || !nonblank(sourcePublicationId) || typeof sourceSnapshotRaw !== "string" ||
        !Array.isArray(consumerPlans) || input.witness !== undefined ||
        (sessionWitness !== undefined && (!isSoundingsAdmissionWitness(sessionWitness) || sessionWitness.posture !== "session")))
      fail("invalid_record", "Descendant request identity is invalid.");
    const envelope = envelopeFromRaw(input.artifactRaw);
    if (envelope.accountId !== input.accountId || envelope.campaignId !== input.campaignId ||
        envelope.slotId !== input.slotId || envelope.headRevision < 2 || envelope.terminal ||
        hasPendingNormalDefeat(deserializeSnapshot(envelope.snapshot)))
      fail("invalid_record", "Ordinary descendant artifact is invalid or requires lifecycle settlement.");
    const snapshot = deserializeSnapshot(envelope.snapshot);
    const proposed: CleanEpochDescendantRecovery = {
      version: 1, status: "accepted_pending_consumers", accountId: input.accountId,
      campaignId: input.campaignId, slotId: input.slotId, sourceSlotId,
      expectedSlotAddress: input.expectedSlotAddress!, artifactId: envelope.artifactId,
      generationId: envelope.generationId, publicationId: envelope.publicationId,
      headRevision: envelope.headRevision, expectedHead: input.expectedHead,
      expectedAccountRevision, sourceArtifactId, sourcePublicationId, sourceSnapshotRaw,
      envelopeRaw: input.artifactRaw,
      witnessRequestId: snapshot.authorityLedger?.soundingsTurnIn?.version === 2
        ? snapshot.authorityLedger.soundingsTurnIn.requests[0]?.requestId ?? null : null,
      consumerPlans, completedConsumerKinds: [], createdAt: input.control.updatedAt
    };
    if (!validDescendantRecovery(proposed, input.accountId, input.campaignId, envelope.publicationId))
      fail("invalid_record", "Descendant consumer plans or recovery are invalid.");
    let destinationPointerToPublish: CleanEpochSlotGeneration | null = null;
    const publicationStore = new CampaignIndexedDbStore(this.db,
      (_, tx) => this.beforeWrite?.(tx), (_, tx) => this.afterWrite?.(tx));
    const publication = await publicationStore.publish(input, {
      storeNames: [CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE, CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE,
        CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE],
      ...(sessionWitness ? { firstSessionWitness: sessionWitness } : {}),
      verify: async (tx, current) => {
        const [accountRaw, sourceAddress, destinationAddress, retainedRaw, sourceRaw, predecessorRaw] = await Promise.all([
          requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(input.accountId) as IDBRequest<unknown>),
          requestValue(tx.objectStore("slots").get([input.accountId, sourceSlotId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore("slots").get([input.accountId, input.slotId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE).get([input.accountId, input.campaignId, envelope.publicationId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore("artifacts").get([input.accountId, sourceArtifactId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore("artifacts").get([input.accountId, input.expectedHead!.artifactId]) as IDBRequest<unknown>)
        ]);
        if (accountRaw === undefined || !current)
          fail("invalid_record", "Descendant lacks retained account, first publication or predecessor.");
        const account = checkedAccount(accountRaw, input.accountId);
        await this.assertNoPendingTerminal(tx, input.accountId);
        const [sourcePointerRaw, destinationPointerRaw] = await Promise.all([
          requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
            .get([input.accountId, sourceSlotId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
            .get([input.accountId, input.slotId]) as IDBRequest<unknown>)
        ]);
        const sourcePointer = checkedSlotGeneration(sourcePointerRaw, input.accountId, sourceSlotId);
        const destinationPointer = destinationPointerRaw === undefined ? null :
          checkedSlotGeneration(destinationPointerRaw, input.accountId, input.slotId);
        if (sourcePointer.status !== "published" || sourcePointer.campaignId !== input.campaignId ||
            (destinationAddress !== undefined && (!destinationPointer ||
              destinationPointer.status !== "published" || destinationPointer.campaignId !== input.campaignId)))
          fail("conflict", "Descendant source or destination slot generation changed.");
        if (destinationAddress === undefined && destinationPointer?.status === "deleted") {
          const receipt = await requestValue(tx.objectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE)
            .get([input.accountId, input.slotId, destinationPointer.slotGenerationId]) as IDBRequest<unknown>);
          if (!validAddressDeletionReceipt(receipt, destinationPointer, account))
            fail("invalid_record", "Deleted destination lacks verified prior occupancy.");
        } else if (destinationAddress === undefined && destinationPointer)
          fail("conflict", "Unaddressed destination still owns a slot generation.");
        const attempt = await this.campaignAttempt(tx, input.accountId, input.campaignId);
        const firstRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE)
          .get([input.accountId, attempt.campaignId]) as IDBRequest<unknown>);
        const first = checkedRecovery(firstRaw, attempt);
        if (attempt.campaignId !== input.campaignId || first.status !== "consumers_completed" ||
            !completedReceiptsMatch(account, first))
          fail("invalid_record", "Descendant lacks completed first-campaign consumers.");
        if (!object(sourceAddress) || sourceAddress.accountId !== input.accountId ||
            sourceAddress.slotId !== sourceSlotId || sourceAddress.campaignId !== input.campaignId ||
            !nonblank(sourceAddress.artifactId) || !nonblank(sourceAddress.publicationId) ||
            (destinationAddress !== undefined && (!object(destinationAddress) ||
              destinationAddress.campaignId !== input.campaignId)))
          fail("conflict", "Source or destination slot belongs to another campaign.");
        const sourceAddressArtifact = await requestValue(tx.objectStore("artifacts")
          .get([input.accountId, sourceAddress.artifactId]) as IDBRequest<unknown>);
        const sourceAddressEnvelope = envelopeFromRaw(sourceAddress.raw as string);
        if (!object(sourceAddressArtifact) || typeof sourceAddressArtifact.raw !== "string" ||
            sourceAddressArtifact.raw !== sourceAddress.raw ||
            sourceAddressArtifact.campaignId !== input.campaignId ||
            sourceAddressEnvelope.slotId !== sourceSlotId ||
            sourceAddressEnvelope.headRevision > current.headRevision ||
            !retainedArtifactMatches(sourceAddressArtifact, sourceAddressEnvelope) ||
            sourceAddressArtifact.publicationId !== sourceAddress.publicationId)
          fail("invalid_record", "Source slot address lacks its retained immutable artifact.");
        if (!object(sourceRaw) || typeof sourceRaw.raw !== "string" ||
            !object(predecessorRaw) || typeof predecessorRaw.raw !== "string")
          fail("invalid_record", "Descendant source or predecessor artifact is missing.");
        const source = envelopeFromRaw(sourceRaw.raw);
        const predecessor = envelopeFromRaw(predecessorRaw.raw);
        if (!retainedArtifactMatches(sourceRaw, source) || !retainedArtifactMatches(predecessorRaw, predecessor))
          fail("invalid_record", "Retained source or predecessor record identity is malformed.");
        if (source.accountId !== input.accountId || source.campaignId !== input.campaignId ||
            source.slotId !== sourceSlotId || source.artifactId !== sourceArtifactId ||
            source.publicationId !== sourcePublicationId || source.snapshot !== sourceSnapshotRaw ||
            source.headRevision > input.expectedHead!.revision ||
            predecessor.accountId !== input.accountId || predecessor.campaignId !== input.campaignId ||
            predecessor.artifactId !== input.expectedHead!.artifactId ||
            predecessor.publicationId !== input.expectedHead!.publicationId ||
            predecessor.headRevision !== input.expectedHead!.revision)
          fail("conflict", "Descendant source or expected predecessor is inconsistent.");
        if (source.headRevision > 1) {
          const sourceRecoveryRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE)
            .get([input.accountId, input.campaignId, source.publicationId]) as IDBRequest<unknown>);
          const sourceRecovery = checkedDescendantRecovery(sourceRecoveryRaw, input.accountId,
            input.campaignId, source.publicationId);
          if (sourceRecovery.status !== "consumers_completed" ||
              sourceRecovery.artifactId !== source.artifactId || sourceRecovery.envelopeRaw !== sourceRaw.raw ||
              !descendantReceiptsMatch(account, sourceRecovery))
            fail("conflict", "Non-head source lacks completed retained publication authority.");
        } else if (source.artifactId !== first.artifactId || first.envelopeRaw !== sourceRaw.raw) {
          fail("conflict", "First source differs from retained first publication.");
        }
        const sourceSnapshot = deserializeSnapshot(sourceSnapshotRaw);
        const identity = snapshot.campaignIdentity;
        const sourceIdentity = sourceSnapshot.campaignIdentity;
        if (!identity || !sourceIdentity || snapshot.playerState.playerId !== sourceSnapshot.playerState.playerId ||
            (sourceArtifactId === input.expectedHead!.artifactId
              ? identity.continuityId !== sourceIdentity.continuityId
              : identity.parentContinuityId !== sourceIdentity.continuityId ||
                identity.forkedFromArtifactId !== sourceArtifactId ||
                identity.forkedFromPublicationId !== sourcePublicationId ||
                !nonblank(identity.firstDivergentMutationId)))
          fail("conflict", "Descendant continuity does not derive from its retained source.");
        if (sessionWitness) {
          if (verifySoundingsAdmissionProvenance(sourceSnapshot) !== "not_completed" ||
              sessionWitness.accountId !== input.accountId || sessionWitness.campaignId !== input.campaignId ||
              sessionWitness.characterId !== source.characterId || sessionWitness.characterId !== envelope.characterId ||
              sessionWitness.sourceArtifactId !== sourceArtifactId ||
              sessionWitness.sourcePublicationId !== sourcePublicationId ||
              sessionWitness.sourceRevision < source.headRevision ||
              sessionWitness.sourceContinuityId !== source.continuityId ||
              sessionWitness.acceptedContinuityId !== snapshot.authorityLedger?.soundingsTurnIn?.requests[0]?.acceptedContinuityId ||
              sessionWitness.requestId !== proposed.witnessRequestId)
            fail("invalid_record", "Session Soundings witness disagrees with the retained source or target.");
        }
        if (current.headRevision === input.expectedHead!.revision) {
          if (current.headArtifactId !== predecessor.artifactId || current.headPublicationId !== predecessor.publicationId)
            fail("stale_head", "Descendant campaign head changed.");
          if (current.headRevision > 1) {
            const priorRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE)
              .get([input.accountId, input.campaignId, current.headPublicationId]) as IDBRequest<unknown>);
            const prior = checkedDescendantRecovery(priorRaw, input.accountId, input.campaignId, current.headPublicationId);
            if (prior.status !== "consumers_completed" || !descendantReceiptsMatch(account, prior))
              fail("conflict", "Previous descendant still has pending consumers.");
          }
        }
        if (retainedRaw !== undefined) {
          if (!destinationPointer || destinationPointer.status !== "published")
            fail("invalid_record", "Accepted descendant lacks its destination slot generation.");
          const retained = checkedDescendantRecovery(retainedRaw, input.accountId, input.campaignId, envelope.publicationId);
          if (!sameDescendantSource(retained, proposed) || current.headArtifactId !== envelope.artifactId ||
              current.headPublicationId !== envelope.publicationId ||
              (retained.status === "consumers_completed" && !descendantReceiptsMatch(account, retained)))
            fail("conflict", "Descendant retry differs from accepted source.");
          if (retained.status === "accepted_pending_consumers" && account.revision !== expectedAccountRevision)
            fail("stale_head", "Pending descendant account revision changed.");
        } else {
          if (current.headRevision !== input.expectedHead!.revision || account.revision !== expectedAccountRevision)
            fail("stale_head", "Descendant campaign or account revision changed.");
          const evaluated = evaluateAchievementProgress(snapshot, account.profile,
            { slotId: input.slotId, touchHistory: true, recordedAt: input.control.updatedAt });
          if (!exactEqual(evaluated.nextSnapshot, snapshot))
            fail("invalid_record", "Descendant account projection would change accepted artifact.");
          if (destinationAddress === undefined)
            destinationPointerToPublish = { version: 1, accountId: input.accountId,
              slotId: input.slotId as SaveSlotId,
              slotGenerationId: `slot.${globalThis.crypto.randomUUID()}`,
              campaignId: input.campaignId, attemptId: attempt.attemptId, status: "published" };
        }
      },
      write: async tx => {
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE).put(proposed));
        this.afterWrite?.(tx);
        if (destinationPointerToPublish) {
          this.beforeWrite?.(tx);
          await requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE).put(destinationPointerToPublish));
          this.afterWrite?.(tx);
        }
      }
    });
    const recovery = await this.readDescendantRecovery(input.accountId, input.campaignId, envelope.publicationId);
    if (!recovery || !sameDescendantSource(recovery, proposed))
      fail("readback_failed", "Descendant recovery failed exact readback.");
    return { publication, recovery };
  }

  async readDescendantRecovery(accountId: string, campaignId: string,
    publicationId: string): Promise<CleanEpochDescendantRecovery | null> {
    if (![accountId, campaignId, publicationId].every(nonblank)) fail("invalid_record", "Descendant recovery address is invalid.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
        "artifacts", "controls", "slots", "witnesses"], "readonly");
      const [accountRaw, recoveryRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE)
          .get([accountId, campaignId, publicationId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined) fail("invalid_record", "Descendant recovery account is missing.");
      const account = checkedAccount(accountRaw, accountId);
      if (recoveryRaw === undefined) return null;
      const recovery = checkedDescendantRecovery(recoveryRaw, accountId, campaignId, publicationId);
      const [artifactRaw, sourceRaw, predecessorRaw, controlRaw] = await Promise.all([
        requestValue(tx.objectStore("artifacts").get([accountId, recovery.artifactId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("artifacts").get([accountId, recovery.sourceArtifactId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("artifacts").get([accountId, recovery.expectedHead.artifactId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("controls").get([accountId, campaignId]) as IDBRequest<unknown>)
      ]);
      if (!object(artifactRaw) || artifactRaw.raw !== recovery.envelopeRaw ||
          !object(sourceRaw) || typeof sourceRaw.raw !== "string" ||
          envelopeFromRaw(sourceRaw.raw).snapshot !== recovery.sourceSnapshotRaw ||
          !object(predecessorRaw) || typeof predecessorRaw.raw !== "string" ||
          envelopeFromRaw(predecessorRaw.raw).publicationId !== recovery.expectedHead.publicationId ||
          !retainedArtifactMatches(artifactRaw, envelopeFromRaw(recovery.envelopeRaw)) ||
          !retainedArtifactMatches(sourceRaw, envelopeFromRaw(sourceRaw.raw)) ||
          !retainedArtifactMatches(predecessorRaw, envelopeFromRaw(predecessorRaw.raw)) ||
          !object(controlRaw) || !object(controlRaw.value) ||
          (controlRaw.value.headRevision as number) < recovery.headRevision ||
          (recovery.status === "consumers_completed" && !descendantReceiptsMatch(account, recovery)))
        fail("invalid_record", "Descendant recovery lost immutable or account evidence.");
      if (controlRaw.value.headRevision === recovery.headRevision) {
        const slotRaw = await requestValue(tx.objectStore("slots")
          .get([accountId, recovery.slotId]) as IDBRequest<unknown>);
        const current = object(slotRaw) && slotRaw.campaignId === campaignId
          ? await new CampaignIndexedDbStore(this.db).read(accountId, campaignId, recovery.slotId, tx)
          : null;
        if (current) {
          if (current.artifactRaw !== recovery.envelopeRaw ||
              current.control.headPublicationId !== publicationId ||
              (current.witness?.requestId ?? null) !== recovery.witnessRequestId)
            fail("invalid_record", "Current descendant recovery disagrees with head or witness.");
        } else {
          if (recovery.status !== "consumers_completed")
            fail("invalid_record", "Pending descendant head lost its address.");
          const rows = await requestValue(tx.objectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE)
            .getAll(IDBKeyRange.bound([accountId, recovery.slotId, ""],
              [accountId, recovery.slotId, "\uffff"])) as IDBRequest<unknown[]>);
          const matching = rows.filter(row => object(row) && row.campaignId === campaignId &&
            row.artifactId === recovery.artifactId && row.publicationId === publicationId);
          if (matching.length !== 1 || !object(matching[0]) ||
              !nonblank(matching[0].slotGenerationId))
            fail("invalid_record", "Historical descendant head lacks deletion evidence.");
          const attempt = await this.campaignAttempt(tx, accountId, campaignId);
          const pointer: CleanEpochSlotGeneration = { version: 1, accountId,
            slotId: recovery.slotId as SaveSlotId, slotGenerationId: matching[0].slotGenerationId,
            campaignId, attemptId: attempt.attemptId, status: "deleted" };
          if (!validAddressDeletionReceipt(matching[0], pointer, account))
            fail("invalid_record", "Historical descendant deletion receipt is malformed.");
        }
      }
      return recovery;
    } catch (error) { throw classify(error, "invalid_record"); }
  }

  /** Locate an accepted pending descendant by its durable account-slot head after caller loss. */
  async readCurrentDescendantRecovery(accountId: string, slotId: SaveSlotId): Promise<CleanEpochDescendantRecovery | null> {
    const slot = await this.readSlot(accountId, slotId);
    if (slot.status !== "pending_consumers") return null;
    try {
      const tx = this.db.transaction(["slots", "controls"], "readonly");
      const address = await requestValue(tx.objectStore("slots").get([accountId, slotId]) as IDBRequest<unknown>);
      if (!object(address) || address.accountId !== accountId || address.slotId !== slotId ||
          !nonblank(address.campaignId) || !nonblank(address.publicationId))
        fail("invalid_record", "Pending descendant slot address is malformed.");
      const raw = await requestValue(tx.objectStore("controls").get([accountId, address.campaignId]) as IDBRequest<unknown>);
      if (!object(raw) || !isStoredCampaignControl(raw.value) ||
          raw.value.accountId !== accountId || raw.value.campaignId !== address.campaignId ||
          raw.value.closed)
        fail("invalid_record", "Pending descendant control disagrees with slot address.");
      if (raw.value.headPublicationId !== address.publicationId) return null;
      if (raw.value.headRevision === 1) return null;
      const recovery = await this.readDescendantRecovery(accountId, address.campaignId, address.publicationId);
      if (!recovery || recovery.slotId !== slotId || recovery.headRevision !== raw.value.headRevision)
        fail("invalid_record", "Current descendant recovery is missing or mismatched.");
      return recovery;
    } catch (error) { throw classify(error, "invalid_record"); }
  }

  /** Apply ordinary history, achievement, Legacy reward and last-played consumers as one account revision. */
  async completeDescendantConsumers(accountId: string, campaignId: string,
    publicationId: string): Promise<{ status: "committed" | "same_source_retry";
      account: CleanEpochAccountRecord; recovery: CleanEpochDescendantRecovery }> {
    if (![accountId, campaignId, publicationId].every(nonblank))
      fail("invalid_record", "Descendant consumer identity is invalid.");
    let tx: IDBTransaction;
    try { tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
      CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE, CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE,
      "artifacts", "controls", "slots", "witnesses"], "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(tx);
    let status: "committed" | "same_source_retry" = "committed";
    let expectedAccount: CleanEpochAccountRecord;
    let expectedRecovery: CleanEpochDescendantRecovery;
    try {
      const [accountRaw, recoveryRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE)
          .get([accountId, campaignId, publicationId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined || recoveryRaw === undefined)
        fail("invalid_record", "Descendant consumer completion lacks account or recovery.");
      const account = checkedAccount(accountRaw, accountId);
      const recovery = checkedDescendantRecovery(recoveryRaw, accountId, campaignId, publicationId);
      const published = await new CampaignIndexedDbStore(this.db).read(accountId, campaignId, recovery.slotId, tx);
      if (!published || published.artifactRaw !== recovery.envelopeRaw ||
          published.control.headPublicationId !== publicationId ||
          published.control.headRevision !== recovery.headRevision ||
          (published.witness?.requestId ?? null) !== recovery.witnessRequestId)
        fail("conflict", "Descendant is no longer the verified current head.");
      if (recovery.status === "consumers_completed") {
        if (!descendantReceiptsMatch(account, recovery)) fail("invalid_record", "Completed descendant receipts are missing.");
        status = "same_source_retry";
        expectedAccount = account;
        expectedRecovery = recovery;
      } else {
        await this.assertNoPendingTerminal(tx, accountId);
        if (account.revision !== recovery.expectedAccountRevision)
          fail("stale_head", "Descendant consumer account revision changed.");
        const snapshot = deserializeSnapshot(envelopeFromRaw(recovery.envelopeRaw).snapshot);
        const evaluated = evaluateAchievementProgress(snapshot, account.profile,
          { slotId: recovery.slotId, touchHistory: true, recordedAt: recovery.createdAt });
        if (!exactEqual(evaluated.nextSnapshot, snapshot))
          fail("invalid_record", "Descendant consumer projection changes accepted artifact.");
        const publication = publicationFor(snapshot, { ...recovery, updatedAt: recovery.createdAt });
        let profile: AccountProfileState = { ...evaluated.nextAccountProfile, lastPlayedAt: recovery.createdAt };
        for (const plan of recovery.consumerPlans) {
          profile = recordCampaignPublicationConsumer(profile, publication, plan.kind,
            plan.payloadFingerprint, { status: "applied" });
        }
        if (!validProfile(profile, accountId)) fail("invalid_record", "Projected descendant account is malformed.");
        expectedAccount = { ...account, revision: account.revision + 1, profile };
        expectedRecovery = { ...recovery, status: "consumers_completed",
          completedConsumerKinds: recovery.consumerPlans.map(plan => plan.kind),
          completedAccountRevision: expectedAccount.revision };
        if (!validDescendantRecovery(expectedRecovery, accountId, campaignId, publicationId))
          fail("invalid_record", "Completed descendant recovery is malformed.");
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).put(expectedAccount));
        this.afterWrite?.(tx);
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE).put(expectedRecovery));
        this.afterWrite?.(tx);
      }
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* already settled */ }
      try { await done; } catch { /* original failure is authoritative */ }
      throw classify(error, "aborted");
    }
    const [account, recovery] = await Promise.all([
      this.read(accountId), this.readDescendantRecovery(accountId, campaignId, publicationId)
    ]);
    if (!account || !recovery || !exactEqual(recovery, expectedRecovery) ||
        (status === "committed" && !exactEqual(account, expectedAccount)) ||
        !descendantReceiptsMatch(account, recovery))
      fail("readback_failed", "Completed descendant consumers failed durable readback.");
    return { status, account, recovery };
  }

  async readRecovery(accountId: string, slotId: string): Promise<CleanEpochPublicationRecovery | null> {
    if (!nonblank(accountId) || !validSlotId(slotId)) fail("invalid_record", "Recovery address is invalid.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE, CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE,
        "artifacts", "slots", "controls", "witnesses"], "readonly");
      const [accountRaw, pointerRaw, address] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE).get([accountId, slotId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("slots").get([accountId, slotId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined) fail("invalid_record", "Recovery account is missing.");
      const account = checkedAccount(accountRaw, accountId);
      if (pointerRaw === undefined) {
        if (address !== undefined) fail("invalid_record", "Recovery address lacks its slot generation.");
        return null;
      }
      const pointer = checkedSlotGeneration(pointerRaw, accountId, slotId);
      const attempt = await this.campaignAttempt(tx, accountId, pointer.campaignId);
      if (pointer.attemptId !== attempt.attemptId) fail("invalid_record", "Recovery slot generation disagrees with attempt.");
      if (pointer.status === "deleted" || attempt.slotId !== slotId) return null;
      const recoveryRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE)
        .get([accountId, attempt.campaignId]) as IDBRequest<unknown>);
      const control = await requestValue(tx.objectStore("controls").get([accountId, attempt.campaignId]) as IDBRequest<unknown>);
      if (recoveryRaw === undefined) {
        if (pointer.status !== "prepared" || address !== undefined || control !== undefined)
          fail("invalid_record", "Published campaign lacks recovery.");
        return null;
      }
      const recovery = checkedRecovery(recoveryRaw, attempt);
      if (pointer.status !== "published" || address === undefined)
        fail("invalid_record", "Accepted recovery lacks published slot generation or address.");
      const artifactRaw = await requestValue(tx.objectStore("artifacts").get([accountId, recovery.artifactId]) as IDBRequest<unknown>);
      if (!object(artifactRaw) || artifactRaw.raw !== recovery.envelopeRaw ||
          !retainedArtifactMatches(artifactRaw, envelopeFromRaw(recovery.envelopeRaw)) ||
          !object(control) || !object(control.value) || (control.value.headRevision as number) < 1)
        fail("invalid_record", "First recovery lost immutable artifact or campaign control.");
      const published = await new CampaignIndexedDbStore(this.db).read(accountId, recovery.campaignId, slotId, tx);
      if (!published || (published.witness?.requestId ?? null) !== recovery.witnessRequestId ||
          (published.control.headRevision === 1 && !publicationMatchesRecovery(published, recovery)) ||
          (published.control.headRevision > 1 && recovery.status !== "consumers_completed") ||
          (recovery.status === "consumers_completed" && !completedReceiptsMatch(account, recovery)))
        fail("invalid_record", "Accepted first recovery and publication disagree.");
      return recovery;
    } catch (error) { throw classify(error, "invalid_record"); }
  }

  async readSlotGeneration(accountId: string, slotId: SaveSlotId): Promise<CleanEpochSlotGeneration | null> {
    if (!nonblank(accountId) || !validSlotId(slotId)) fail("invalid_record", "Slot generation address is invalid.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE,
        CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
        CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, "artifacts", "controls", "slots", "witnesses"], "readonly");
      const accountRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>);
      if (accountRaw === undefined) fail("invalid_record", "Slot generation account is missing.");
      const account = checkedAccount(accountRaw, accountId);
      const pointerRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
        .get([accountId, slotId]) as IDBRequest<unknown>);
      await this.inspectSlot(tx, account, slotId);
      return pointerRaw === undefined ? null : checkedSlotGeneration(pointerRaw, accountId, slotId);
    } catch (error) { throw classify(error, "unavailable"); }
  }

  async readAddressDeletionReceipt(accountId: string, slotId: SaveSlotId,
    slotGenerationId: string): Promise<CleanEpochAddressDeletionReceipt | null> {
    if (!nonblank(accountId) || !validSlotId(slotId) || !nonblank(slotGenerationId))
      fail("invalid_record", "Deletion receipt identity is invalid.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_ADDRESS_DELETION_STORE, "artifacts", "controls"], "readonly");
      const [accountRaw, raw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE)
          .get([accountId, slotId, slotGenerationId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined) fail("invalid_record", "Deletion receipt account is missing.");
      const account = checkedAccount(accountRaw, accountId);
      if (raw === undefined) return null;
      if (!object(raw) || !nonblank(raw.campaignId)) fail("invalid_record", "Deletion receipt campaign is malformed.");
      const attempt = await this.campaignAttempt(tx, accountId, raw.campaignId);
      const pointer: CleanEpochSlotGeneration = { version: 1, accountId, slotId,
        slotGenerationId, campaignId: raw.campaignId, attemptId: attempt.attemptId, status: "deleted" };
      if (!validAddressDeletionReceipt(raw, pointer, account))
        fail("invalid_record", "Historical address deletion receipt is malformed.");
      const artifact = await requestValue(tx.objectStore("artifacts")
        .get([accountId, raw.artifactId]) as IDBRequest<unknown>);
      const control = await requestValue(tx.objectStore("controls")
        .get([accountId, raw.campaignId]) as IDBRequest<unknown>);
      if (!object(artifact) || artifact.raw !== raw.addressRaw || !object(control))
        fail("invalid_record", "Deleted address lost its retained artifact or campaign control.");
      return raw;
    } catch (error) { throw classify(error, "invalid_record"); }
  }

  /** One account transaction removes one active address, never campaign history. */
  async deleteSlotAddress(input: CleanEpochAddressDeletionRequest): Promise<CleanEpochAddressDeletionResult> {
    if (!object(input) || !nonblank(input.accountId) || !validSlotId(input.slotId) ||
        !nonblank(input.expectedSlotGenerationId) ||
        !Number.isSafeInteger(input.expectedAccountRevision) || input.expectedAccountRevision < 1 ||
        !object(input.expectedAddress) || !nonblank(input.expectedAddress.artifactId) ||
        !nonblank(input.expectedAddress.publicationId) || !nonblank(input.deletedAt))
      fail("invalid_record", "Slot deletion request is invalid.");
    let tx: IDBTransaction;
    try { tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
      CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE,
      CLEAN_EPOCH_ADDRESS_DELETION_STORE, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
      CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, "artifacts", "controls", "slots", "witnesses"], "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(tx);
    let status: CleanEpochAddressDeletionResult["status"] = "committed";
    let expectedAccount: CleanEpochAccountRecord;
    let expectedReceipt: CleanEpochAddressDeletionReceipt;
    try {
      const [accountRaw, pointerRaw, addressRaw, receiptRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(input.accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
          .get([input.accountId, input.slotId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("slots").get([input.accountId, input.slotId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE)
          .get([input.accountId, input.slotId, input.expectedSlotGenerationId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined) fail("invalid_record", "Deletion account is missing.");
      const account = checkedAccount(accountRaw, input.accountId);
      if (receiptRaw !== undefined) {
        if (!object(receiptRaw) || !nonblank(receiptRaw.campaignId))
          fail("invalid_record", "Retained deletion receipt is malformed.");
        const attempt = await this.campaignAttempt(tx, input.accountId, receiptRaw.campaignId);
        const priorPointer: CleanEpochSlotGeneration = { version: 1, accountId: input.accountId,
          slotId: input.slotId, slotGenerationId: input.expectedSlotGenerationId,
          campaignId: receiptRaw.campaignId, attemptId: attempt.attemptId, status: "deleted" };
        if (!validAddressDeletionReceipt(receiptRaw, priorPointer, account) ||
            receiptRaw.reason !== "player" ||
            receiptRaw.expectedAccountRevision !== input.expectedAccountRevision ||
            receiptRaw.artifactId !== input.expectedAddress.artifactId ||
            receiptRaw.publicationId !== input.expectedAddress.publicationId ||
            receiptRaw.deletedAt !== input.deletedAt)
          fail("conflict", "Slot deletion retry differs from retained receipt.");
        expectedAccount = account;
        expectedReceipt = receiptRaw;
        status = "same_source_retry";
      } else {
        if (account.revision !== input.expectedAccountRevision)
          fail("stale_head", "Slot deletion account revision changed.");
        if (pointerRaw === undefined) fail("conflict", "Slot has no published generation to delete.");
        const pointer = checkedSlotGeneration(pointerRaw, input.accountId, input.slotId);
        if (pointer.status !== "published" || pointer.slotGenerationId !== input.expectedSlotGenerationId)
          fail("stale_head", "Slot generation changed before deletion.");
        const inspected = await this.inspectSlot(tx, account, input.slotId);
        if (inspected.status !== "ready") fail("conflict", "Only a fully recovered open address may be player deleted.");
        if (!object(addressRaw) || typeof addressRaw.raw !== "string" ||
            addressRaw.campaignId !== pointer.campaignId ||
            addressRaw.artifactId !== input.expectedAddress.artifactId ||
            addressRaw.publicationId !== input.expectedAddress.publicationId)
          fail("stale_head", "Slot address changed before deletion.");
        const envelope = envelopeFromRaw(addressRaw.raw);
        const runs = account.profile.history.runRecords.filter(run => run.characterId === envelope.characterId);
        if (runs.length !== 1 || runs[0]!.outcome !== "active" ||
            !runs[0]!.saveSlotIds.includes(input.slotId))
          fail("invalid_record", "Active address lacks singular account history.");
        const profile = markRunDeleted(account.profile, { characterId: envelope.characterId,
          slotId: input.slotId, recordedAt: input.deletedAt });
        expectedAccount = { ...account, revision: account.revision + 1, profile };
        expectedReceipt = { version: 1, accountId: input.accountId, slotId: input.slotId,
          slotGenerationId: pointer.slotGenerationId, campaignId: pointer.campaignId,
          characterId: envelope.characterId, artifactId: envelope.artifactId,
          publicationId: envelope.publicationId, addressRaw: addressRaw.raw,
          expectedAccountRevision: account.revision, completedAccountRevision: expectedAccount.revision,
          reason: "player", deletedAt: input.deletedAt };
        if (!validProfile(profile, input.accountId) ||
            !validAddressDeletionReceipt(expectedReceipt, { ...pointer, status: "deleted" }, expectedAccount))
          fail("invalid_record", "Projected address deletion is malformed.");
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).put(expectedAccount));
        this.afterWrite?.(tx);
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore("slots").delete([input.accountId, input.slotId]));
        this.afterWrite?.(tx);
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE)
          .put({ ...pointer, status: "deleted" } satisfies CleanEpochSlotGeneration));
        this.afterWrite?.(tx);
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_ADDRESS_DELETION_STORE).put(expectedReceipt));
        this.afterWrite?.(tx);
      }
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* already settled */ }
      try { await done; } catch { /* original failure is authoritative */ }
      throw classify(error, "aborted");
    }
    const [account, receipt, slot] = await Promise.all([
      this.read(input.accountId), this.readAddressDeletionReceipt(input.accountId, input.slotId,
        input.expectedSlotGenerationId), this.readSlot(input.accountId, input.slotId)
    ]);
    if (!account || !receipt || !exactEqual(receipt, expectedReceipt) ||
        (status === "committed" && !exactEqual(account, expectedAccount)) ||
        (status === "committed" && slot.status !== "empty"))
      fail("readback_failed", "Slot deletion failed exact durable readback.");
    return { status, account, receipt };
  }

  /** Historical first authority is keyed by campaign, never by a reused physical slot. */
  async readHistoricalFirstRecovery(accountId: string, campaignId: string): Promise<CleanEpochPublicationRecovery> {
    if (!nonblank(accountId) || !nonblank(campaignId)) fail("invalid_record", "Historical first recovery identity is invalid.");
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE,
        CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, "artifacts", "controls"], "readonly");
      const [accountRaw, attemptRaw, recoveryRaw, controlRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE).get([accountId, campaignId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE).get([accountId, campaignId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("controls").get([accountId, campaignId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined || !object(attemptRaw) || !validSlotId(attemptRaw.slotId) ||
          !object(controlRaw) || !object(controlRaw.value))
        fail("invalid_record", "Historical first authority is incomplete.");
      const account = checkedAccount(accountRaw, accountId);
      const attempt = checkedAttempt(attemptRaw, accountId, attemptRaw.slotId);
      const recovery = checkedRecovery(recoveryRaw, attempt);
      const artifactRaw = await requestValue(tx.objectStore("artifacts")
        .get([accountId, recovery.artifactId]) as IDBRequest<unknown>);
      if (!object(artifactRaw) || artifactRaw.raw !== recovery.envelopeRaw ||
          !retainedArtifactMatches(artifactRaw, envelopeFromRaw(recovery.envelopeRaw)) ||
          (recovery.status === "consumers_completed" && !completedReceiptsMatch(account, recovery)))
        fail("invalid_record", "Historical first recovery lost artifact or receipts.");
      return recovery;
    } catch (error) { throw classify(error, "invalid_record"); }
  }

  /** One account transaction completes every first-campaign consumer or none of them. */
  async completePreparedAttemptConsumers(accountId: string, slotId: string, attemptId: string,
    publicationId: string): Promise<CleanEpochConsumerCompletionResult> {
    if (!nonblank(accountId) || !validSlotId(slotId) || !nonblank(attemptId) || !nonblank(publicationId))
      fail("invalid_record", "Consumer completion identity is invalid.");
    let tx: IDBTransaction;
    try { tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE, CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE,
      CLEAN_EPOCH_TERMINAL_RECOVERY_STORE, "artifacts", "controls", "slots", "witnesses"], "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(tx);
    let status: CleanEpochConsumerCompletionResult["status"] = "committed";
    let expectedAccount: CleanEpochAccountRecord;
    let expectedRecovery: CleanEpochPublicationRecovery & { status: "consumers_completed" };
    try {
      const [accountRaw, pointerRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_SLOT_GENERATION_STORE).get([accountId, slotId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined || pointerRaw === undefined)
        fail("invalid_record", "Consumer completion lacks retained account, attempt or recovery.");
      const account = checkedAccount(accountRaw, accountId);
      const pointer = checkedSlotGeneration(pointerRaw, accountId, slotId);
      if (pointer.status !== "published") fail("conflict", "First consumer slot generation is no longer published.");
      const [attemptRaw, recoveryRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE)
          .get([accountId, pointer.campaignId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE)
          .get([accountId, pointer.campaignId]) as IDBRequest<unknown>)
      ]);
      if (attemptRaw === undefined || recoveryRaw === undefined)
        fail("invalid_record", "Consumer completion lost campaign-scoped first authority.");
      const attempt = checkedAttempt(attemptRaw, accountId, slotId);
      const recovery = checkedRecovery(recoveryRaw, attempt);
      if (pointer.attemptId !== attemptId || attempt.attemptId !== attemptId ||
          recovery.attemptId !== attemptId || recovery.publicationId !== publicationId)
        fail("conflict", "Consumer completion does not match retained publication identity.");
      const published = await new CampaignIndexedDbStore(this.db).read(accountId, recovery.campaignId, slotId, tx);
      if (!publicationMatchesRecovery(published, recovery)) fail("invalid_record", "Consumer completion lost published authority.");
      if (recovery.status === "consumers_completed") {
        if (!completedReceiptsMatch(account, recovery)) fail("invalid_record", "Completed consumer evidence is missing or malformed.");
        status = "same_source_retry";
        expectedAccount = account;
        expectedRecovery = recovery;
      } else {
        await this.assertNoPendingTerminal(tx, accountId);
        if (account.revision !== recovery.expectedAccountRevision)
          fail("stale_head", "Consumer completion account revision changed.");
        const profile = firstCampaignProjection(account, attempt, recovery);
        expectedAccount = { ...account, revision: account.revision + 1, profile };
        expectedRecovery = { ...recovery, status: "consumers_completed",
          completedConsumerKinds: attempt.consumerPlans.map(plan => plan.kind),
          completedAccountRevision: expectedAccount.revision };
        if (!validRecovery(expectedRecovery, attempt)) fail("invalid_record", "Completed consumer recovery is malformed.");
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).put(expectedAccount));
        this.afterWrite?.(tx);
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE).put(expectedRecovery));
        this.afterWrite?.(tx);
      }
      await done;
    } catch (error) {
      try { tx.abort(); } catch { /* already settled */ }
      try { await done; } catch { /* original error is authoritative */ }
      throw classify(error, "aborted");
    }
    const [account, recovery] = await Promise.all([this.read(accountId), this.readRecovery(accountId, slotId)]);
    if (!account || !recovery || recovery.status !== "consumers_completed" ||
        !exactEqual(recovery, expectedRecovery) ||
        (status === "committed" && !exactEqual(account, expectedAccount)) ||
        !completedReceiptsMatch(account, recovery))
      fail("readback_failed", "Completed account consumers failed durable readback.");
    return { status, account, recovery };
  }

  async register(profile: AccountProfileState, credential: LocalAuthCredentialRecord): Promise<CleanEpochAccountWriteResult> {
    const accountId = profile.accountId;
    if (!nonblank(accountId) || !validProfile(profile, accountId) || !validCredential(credential, accountId)) {
      fail("invalid_record", "New account profile or credential is invalid.");
    }
    const next: CleanEpochAccountRecord = { version: 1, accountId, revision: 1,
      lifecycleGeneration: 1, profile, credential };
    return this.write(accountId, null, next);
  }

  async updateProfile(accountId: string, expectedRevision: number, profile: AccountProfileState): Promise<CleanEpochAccountWriteResult> {
    if (!nonblank(accountId) || !validProfile(profile, accountId)) fail("invalid_record", "Updated account profile is invalid.");
    return this.update(accountId, expectedRevision, current => ({ ...current, profile }));
  }

  async updateCredential(accountId: string, expectedRevision: number, credential: LocalAuthCredentialRecord): Promise<CleanEpochAccountWriteResult> {
    if (!nonblank(accountId) || !validCredential(credential, accountId)) fail("invalid_record", "Updated account credential is invalid.");
    return this.update(accountId, expectedRevision, current => ({ ...current, credential }));
  }

  private async update(accountId: string, expectedRevision: number,
    change: (current: CleanEpochAccountRecord) => CleanEpochAccountRecord): Promise<CleanEpochAccountWriteResult> {
    if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 1) fail("invalid_record", "Expected account revision is invalid.");
    return this.write(accountId, expectedRevision, change);
  }

  private async write(accountId: string, expectedRevision: number | null,
    nextValue: CleanEpochAccountRecord | ((current: CleanEpochAccountRecord) => CleanEpochAccountRecord)): Promise<CleanEpochAccountWriteResult> {
    let transaction: IDBTransaction;
    try { transaction = this.db.transaction(expectedRevision === null ?
      [CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE] :
      [CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE, CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE, CLEAN_EPOCH_SLOT_GENERATION_STORE, CLEAN_EPOCH_ADDRESS_DELETION_STORE,
        CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE, CLEAN_EPOCH_TERMINAL_RECOVERY_STORE], "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(transaction);
    let next: CleanEpochAccountRecord;
    let status: CleanEpochAccountWriteResult["status"] = "committed";
    try {
      const store = transaction.objectStore(CLEAN_EPOCH_ACCOUNT_STORE);
      const raw = await requestValue(store.get(accountId) as IDBRequest<unknown>);
      const current = raw === undefined ? null : checkedAccount(raw, accountId);
      if (expectedRevision === null) {
        const receiptRaw = await requestValue(transaction.objectStore(CLEAN_EPOCH_ACCOUNT_LIFECYCLE_STORE)
          .get(accountId) as IDBRequest<unknown>);
        if (receiptRaw !== undefined) {
          checkedLifecycle(receiptRaw, accountId);
          fail("conflict", "Account identity has durable lifecycle history.");
        }
        next = nextValue as CleanEpochAccountRecord;
        if (current) {
          if (!exactEqual(current, next)) fail("conflict", "Account identity already belongs to different durable data.");
          status = "same_source_retry";
        }
      } else {
        if (!current) fail("invalid_record", "Retained account is missing.");
        next = { ...(nextValue as (current: CleanEpochAccountRecord) => CleanEpochAccountRecord)(current), revision: expectedRevision + 1 };
        if (current.revision === expectedRevision + 1 && exactEqual(current, next)) status = "same_source_retry";
        else if (current.revision !== expectedRevision) fail("stale_head", "Account revision changed.");
      }
      if (status === "committed") {
        if (expectedRevision !== null) {
          await this.assertNoPendingTerminal(transaction, accountId);
          // The account CAS and every publication recovery share this transaction scope.
          // An edit cannot consume the revision reserved by a lost campaign caller.
          const attempts = await requestValue(transaction.objectStore(CLEAN_EPOCH_CAMPAIGN_ATTEMPT_STORE)
            .getAll(IDBKeyRange.bound([accountId, ""], [accountId, "\uffff"])) as IDBRequest<unknown[]>);
          const firstRecoveries = await requestValue(transaction.objectStore(CLEAN_EPOCH_CAMPAIGN_RECOVERY_STORE)
            .getAll(IDBKeyRange.bound([accountId, ""], [accountId, "\uffff"])) as IDBRequest<unknown[]>);
          const byCampaign = new Map<string, CleanEpochAttemptRecord>();
          for (const raw of attempts) {
            const slotId = object(raw) && typeof raw.slotId === "string" ? raw.slotId : "";
            const attempt = checkedAttempt(raw, accountId, slotId);
            if (byCampaign.has(attempt.campaignId)) fail("invalid_record", "Account has duplicate creator campaign.");
            byCampaign.set(attempt.campaignId, attempt);
          }
          const recovered = new Set<string>();
          for (const raw of firstRecoveries) {
            const campaignId = object(raw) && typeof raw.campaignId === "string" ? raw.campaignId : "";
            const attempt = byCampaign.get(campaignId);
            if (!attempt) fail("invalid_record", "Account has orphan first-publication recovery.");
            const recovery = checkedRecovery(raw, attempt);
            recovered.add(campaignId);
            if (recovery.status !== "consumers_completed")
              fail("conflict", "Account has pending first-publication consumers.");
            if (!completedReceiptsMatch(current!, recovery))
              fail("invalid_record", "Completed first-publication receipts are missing.");
          }
          if ([...byCampaign.keys()].some(campaignId => !recovered.has(campaignId)))
            fail("conflict", "Account has a prepared first-campaign attempt.");
          const descendants = await requestValue(transaction.objectStore(CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE)
            .getAll(IDBKeyRange.bound([accountId, "", ""], [accountId, "\uffff", "\uffff"])) as IDBRequest<unknown[]>);
          for (const raw of descendants) {
            const campaignId = object(raw) && typeof raw.campaignId === "string" ? raw.campaignId : "";
            const publicationId = object(raw) && typeof raw.publicationId === "string" ? raw.publicationId : "";
            const recovery = checkedDescendantRecovery(raw, accountId, campaignId, publicationId);
            if (recovery.status !== "consumers_completed")
              fail("conflict", "Account has pending descendant consumers.");
            if (!descendantReceiptsMatch(current!, recovery))
              fail("invalid_record", "Completed descendant receipts are missing.");
          }
        }
        this.beforeWrite?.(transaction);
        await requestValue(store.put(next));
        this.afterWrite?.(transaction);
      }
      await done;
    } catch (error) {
      try { transaction.abort(); } catch { /* already settled */ }
      try { await done; } catch { /* retain the original failure */ }
      throw classify(error, "aborted");
    }
    const readback = await this.read(accountId);
    if (!readback || !exactEqual(readback, next)) fail("readback_failed", "Committed account failed exact readback.");
    return { status, readback };
  }
}
