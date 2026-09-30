import type { AccountProfileState, CampaignPublicationConsumerKind, SaveSnapshot } from "../../../../packages/shared/types/src/index.js";
import type { LocalAuthCredentialRecord } from "./launcherAuthManager.js";
import { isAccountProfileState } from "./accountProfileManager.js";
import { evaluateAchievementProgress } from "../../../../packages/engines/game-engine/src/achievements.js";
import { recordCampaignPublicationConsumer, type VerifiedCampaignPublication } from "../../../../packages/engines/game-engine/src/account-publication.js";
import { consumeSelectedLegacyPreparations, resolveLegacyPreparationSelection } from "../../../../packages/engines/game-engine/src/legacy-unlocks.js";
import { consumeRetiredRunInheritanceUse, resolveHeirSourceById } from "./runLifecycle.js";
import { deserializeSnapshot } from "../../../../packages/shared/persistence/src/index.js";
import { isTargetCampaignSnapshot } from "../../../../packages/engines/game-engine/src/campaign-rules.js";
import { isStoredSaveEnvelope, type CampaignPublicationConsumerPlan, type StoredSaveEnvelope } from "./saveManager.js";
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

/** Inert new-epoch owner. No launcher, App or save caller opens it yet. */
export const CLEAN_EPOCH_DATABASE_NAME = "lineage.campaigns.epoch1";
export const CLEAN_EPOCH_DATABASE_VERSION = 3;
export const CLEAN_EPOCH_ACCOUNT_STORE = "accounts";
export const CLEAN_EPOCH_ATTEMPT_STORE = "newCampaignAttempts";
export const CLEAN_EPOCH_RECOVERY_STORE = "pendingPublicationRecoveries";
export const CLEAN_EPOCH_SESSION_STORAGE_KEY = "cataclysm-rpg-ui.epoch1.session";

export type CleanEpochAccountRecord = {
  version: 1;
  accountId: string;
  revision: number;
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
export type CleanEpochConsumerCompletionResult = {
  status: "committed" | "same_source_retry";
  account: CleanEpochAccountRecord;
  recovery: CleanEpochPublicationRecovery & { status: "consumers_completed" };
};
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
    validProfile(value.profile, accountId) && validCredential(value.credential, accountId);
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
const FIRST_CAMPAIGN_CONSUMERS: CampaignPublicationConsumerKind[] = [
  "active_history", "account_achievements", "legacy_rewards", "last_played", "preparation_consumption"
];
function publicationFor(snapshot: SaveSnapshot, recovery: CleanEpochPublicationRecovery): VerifiedCampaignPublication {
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
  return recovery.consumerPlans.every(plan => (account.profile.campaignPublicationReceipts ?? []).some(receipt =>
    receipt.consumerId === `${publication.publicationId}.consumer.${plan.kind}` &&
    receipt.publicationId === publication.publicationId && receipt.campaignId === publication.campaignId &&
    receipt.continuityId === publication.continuityId && receipt.characterId === publication.characterId &&
    receipt.kind === plan.kind && receipt.payloadFingerprint === plan.payloadFingerprint &&
    receipt.status === "applied" && receipt.appliedAt === publication.publishedAt));
}
function publicationMatchesRecovery(published: CampaignStoreReadback | null, recovery: CleanEpochPublicationRecovery): boolean {
  return !!published && published.artifactRaw === recovery.envelopeRaw && published.slotRaw === recovery.envelopeRaw &&
    published.control.headArtifactId === recovery.artifactId && published.control.headPublicationId === recovery.publicationId &&
    published.control.headRevision === 1 && published.control.previousHeadArtifactId === null &&
    published.control.previousHeadPublicationId === null && published.control.closed === false &&
    published.control.updatedAt === recovery.updatedAt && (published.witness?.requestId ?? null) === recovery.witnessRequestId;
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
    request.onupgradeneeded = () => {
      const database = request.result;
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
    };
    request.onerror = () => reject(classify(request.error, "unavailable"));
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      const database = request.result;
      if (!hasCampaignPublicationStores(database) || !database.objectStoreNames.contains(CLEAN_EPOCH_ACCOUNT_STORE) ||
          !database.objectStoreNames.contains(CLEAN_EPOCH_ATTEMPT_STORE) || !database.objectStoreNames.contains(CLEAN_EPOCH_RECOVERY_STORE)) {
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

  async read(accountId: string): Promise<CleanEpochAccountRecord | null> {
    if (!nonblank(accountId)) fail("invalid_record", "Account ID is blank.");
    try {
      const transaction = this.db.transaction(CLEAN_EPOCH_ACCOUNT_STORE, "readonly");
      const value = await requestValue(transaction.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>);
      return value === undefined ? null : checkedAccount(value, accountId);
    } catch (error) { throw classify(error, "unavailable"); }
  }

  async list(): Promise<CleanEpochAccountRecord[]> {
    try {
      const transaction = this.db.transaction(CLEAN_EPOCH_ACCOUNT_STORE, "readonly");
      const values = await requestValue(transaction.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).getAll() as IDBRequest<unknown[]>);
      return values.map(value => checkedAccount(value, object(value) && typeof value.accountId === "string" ? value.accountId : ""));
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
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ATTEMPT_STORE], "readonly");
      const account = await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>);
      if (account === undefined) fail("invalid_record", "Retained attempt account is missing.");
      checkedAccount(account, accountId);
      const attempt = await requestValue(tx.objectStore(CLEAN_EPOCH_ATTEMPT_STORE).get([accountId, slotId]) as IDBRequest<unknown>);
      return attempt === undefined ? null : checkedAttempt(attempt, accountId, slotId);
    } catch (error) { throw classify(error, "unavailable"); }
  }

  /** Atomic account-slot reservation. Publication and completion require the successor owner. */
  async prepareAttempt(candidate: CleanEpochAttemptRecord): Promise<CleanEpochAttemptWriteResult> {
    if (!object(candidate) || !validSlotId(candidate.slotId) || !validAttempt(candidate, candidate.accountId, candidate.slotId))
      fail("invalid_record", "New-campaign attempt candidate is invalid.");
    let tx: IDBTransaction;
    try { tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ATTEMPT_STORE, CLEAN_EPOCH_RECOVERY_STORE, "slots", "controls"], "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(tx);
    let status: CleanEpochAttemptWriteResult["status"] = "committed";
    try {
      const accountRaw = await requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(candidate.accountId) as IDBRequest<unknown>);
      if (accountRaw === undefined) fail("invalid_record", "New-campaign account is missing.");
      const account = checkedAccount(accountRaw, candidate.accountId);
      if (account.revision !== candidate.expectedAccountRevision) fail("stale_head", "New-campaign account revision changed.");
      const attempts = tx.objectStore(CLEAN_EPOCH_ATTEMPT_STORE);
      const retainedRaw = await requestValue(attempts.get([candidate.accountId, candidate.slotId]) as IDBRequest<unknown>);
      if (retainedRaw !== undefined) {
        const retained = checkedAttempt(retainedRaw, candidate.accountId, candidate.slotId);
        if (!exactEqual(retained, candidate)) fail("conflict", "Account slot is reserved by a different attempt.");
        status = "same_source_retry";
      }
      const occupied = await requestValue(tx.objectStore("slots").get([candidate.accountId, candidate.slotId]) as IDBRequest<unknown>);
      const campaign = await requestValue(tx.objectStore("controls").get([candidate.accountId, candidate.campaignId]) as IDBRequest<unknown>);
      const recovery = await requestValue(tx.objectStore(CLEAN_EPOCH_RECOVERY_STORE).get([candidate.accountId, candidate.slotId]) as IDBRequest<unknown>);
      if (recovery !== undefined) {
        if (retainedRaw === undefined) fail("invalid_record", "Account slot has orphan publication recovery.");
        checkedRecovery(recovery, checkedAttempt(retainedRaw, candidate.accountId, candidate.slotId));
        fail("conflict", "Account slot has pending publication recovery.");
      }
      if (occupied !== undefined || campaign !== undefined) fail("conflict", "New-campaign destination already has publication authority.");
      if (status === "committed") {
        this.beforeWrite?.(tx);
        await requestValue(attempts.put(candidate));
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
    const publication = await publicationStore.publish(input, {
      storeNames: [CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ATTEMPT_STORE, CLEAN_EPOCH_RECOVERY_STORE],
      verify: async (tx, current) => {
        const [accountRaw, attemptRaw, recoveryRaw] = await Promise.all([
          requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(input.accountId) as IDBRequest<unknown>),
          requestValue(tx.objectStore(CLEAN_EPOCH_ATTEMPT_STORE).get([input.accountId, input.slotId]) as IDBRequest<unknown>),
          requestValue(tx.objectStore(CLEAN_EPOCH_RECOVERY_STORE).get([input.accountId, input.slotId]) as IDBRequest<unknown>)
        ]);
        if (accountRaw === undefined || attemptRaw === undefined) fail("invalid_record", "First publication lacks retained account or attempt.");
        const account = checkedAccount(accountRaw, input.accountId);
        const attempt = checkedAttempt(attemptRaw, input.accountId, input.slotId);
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
          if (account.revision !== attempt.expectedAccountRevision) fail("stale_head", "First-publication account revision changed.");
          firstCampaignProjection(account, attempt, proposed);
        }
      },
      write: async tx => {
        if (!proposed) fail("invalid_record", "First-publication recovery was not validated.");
        this.beforeWrite?.(tx);
        await requestValue(tx.objectStore(CLEAN_EPOCH_RECOVERY_STORE).put(proposed));
        this.afterWrite?.(tx);
      }
    });
    const recovery = await this.readRecovery(input.accountId, input.slotId);
    if (!recovery || !proposed || !sameRecoverySource(recovery, proposed)) fail("readback_failed", "First-publication recovery failed exact readback.");
    return { publication, recovery };
  }

  async readRecovery(accountId: string, slotId: string): Promise<CleanEpochPublicationRecovery | null> {
    if (!nonblank(accountId) || !validSlotId(slotId)) fail("invalid_record", "Recovery address is invalid.");
    let recovery: CleanEpochPublicationRecovery | null;
    let account: CleanEpochAccountRecord;
    try {
      const tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ATTEMPT_STORE, CLEAN_EPOCH_RECOVERY_STORE, "slots", "controls"], "readonly");
      const [accountRaw, attemptRaw, recoveryRaw, address] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_ATTEMPT_STORE).get([accountId, slotId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_RECOVERY_STORE).get([accountId, slotId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore("slots").get([accountId, slotId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined) fail("invalid_record", "Recovery account is missing.");
      account = checkedAccount(accountRaw, accountId);
      if (attemptRaw === undefined) {
        if (recoveryRaw !== undefined || address !== undefined) fail("invalid_record", "Recovery lacks its retained attempt.");
        return null;
      }
      const attempt = checkedAttempt(attemptRaw, accountId, slotId);
      const control = await requestValue(tx.objectStore("controls").get([accountId, attempt.campaignId]) as IDBRequest<unknown>);
      if (recoveryRaw === undefined) {
        if (address !== undefined || control !== undefined) fail("invalid_record", "Published campaign lacks recovery.");
        return null;
      }
      recovery = checkedRecovery(recoveryRaw, attempt);
      if (address === undefined) fail("invalid_record", "Accepted recovery lacks published slot.");
    } catch (error) { throw classify(error, "invalid_record"); }
    const published = await new CampaignIndexedDbStore(this.db).read(accountId, recovery.campaignId, slotId);
    if (!publicationMatchesRecovery(published, recovery) ||
        (recovery.status === "consumers_completed" && !completedReceiptsMatch(account, recovery))) {
      fail("invalid_record", "Accepted recovery and publication disagree.");
    }
    return recovery;
  }

  /** One account transaction completes every first-campaign consumer or none of them. */
  async completePreparedAttemptConsumers(accountId: string, slotId: string, attemptId: string,
    publicationId: string): Promise<CleanEpochConsumerCompletionResult> {
    if (!nonblank(accountId) || !validSlotId(slotId) || !nonblank(attemptId) || !nonblank(publicationId))
      fail("invalid_record", "Consumer completion identity is invalid.");
    let tx: IDBTransaction;
    try { tx = this.db.transaction([CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_ATTEMPT_STORE, CLEAN_EPOCH_RECOVERY_STORE,
      "artifacts", "controls", "slots", "witnesses"], "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(tx);
    let status: CleanEpochConsumerCompletionResult["status"] = "committed";
    let expectedAccount: CleanEpochAccountRecord;
    let expectedRecovery: CleanEpochPublicationRecovery & { status: "consumers_completed" };
    try {
      const [accountRaw, attemptRaw, recoveryRaw] = await Promise.all([
        requestValue(tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).get(accountId) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_ATTEMPT_STORE).get([accountId, slotId]) as IDBRequest<unknown>),
        requestValue(tx.objectStore(CLEAN_EPOCH_RECOVERY_STORE).get([accountId, slotId]) as IDBRequest<unknown>)
      ]);
      if (accountRaw === undefined || attemptRaw === undefined || recoveryRaw === undefined)
        fail("invalid_record", "Consumer completion lacks retained account, attempt or recovery.");
      const account = checkedAccount(accountRaw, accountId);
      const attempt = checkedAttempt(attemptRaw, accountId, slotId);
      const recovery = checkedRecovery(recoveryRaw, attempt);
      if (attempt.attemptId !== attemptId || recovery.attemptId !== attemptId || recovery.publicationId !== publicationId)
        fail("conflict", "Consumer completion does not match retained publication identity.");
      const published = await new CampaignIndexedDbStore(this.db).read(accountId, recovery.campaignId, slotId, tx);
      if (!publicationMatchesRecovery(published, recovery)) fail("invalid_record", "Consumer completion lost published authority.");
      if (recovery.status === "consumers_completed") {
        if (!completedReceiptsMatch(account, recovery)) fail("invalid_record", "Completed consumer evidence is missing or malformed.");
        status = "same_source_retry";
        expectedAccount = account;
        expectedRecovery = recovery;
      } else {
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
        await requestValue(tx.objectStore(CLEAN_EPOCH_RECOVERY_STORE).put(expectedRecovery));
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
    const next: CleanEpochAccountRecord = { version: 1, accountId, revision: 1, profile, credential };
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
    try { transaction = this.db.transaction(CLEAN_EPOCH_ACCOUNT_STORE, "readwrite"); }
    catch (error) { throw classify(error, "unavailable"); }
    const done = complete(transaction);
    let next: CleanEpochAccountRecord;
    let status: CleanEpochAccountWriteResult["status"] = "committed";
    try {
      const store = transaction.objectStore(CLEAN_EPOCH_ACCOUNT_STORE);
      const raw = await requestValue(store.get(accountId) as IDBRequest<unknown>);
      const current = raw === undefined ? null : checkedAccount(raw, accountId);
      if (expectedRevision === null) {
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
