import type { AccountProfileState } from "../../../../packages/shared/types/src/index.js";
import type { LocalAuthCredentialRecord } from "./launcherAuthManager.js";
import { isAccountProfileState } from "./accountProfileManager.js";
import {
  CAMPAIGN_DATABASE_NAME,
  CampaignStoreError,
  ensureCampaignPublicationStores,
  hasCampaignPublicationStores
} from "./campaignIndexedDbStore.js";

/** Inert new-epoch owner. No launcher, App or save caller opens it yet. */
export const CLEAN_EPOCH_DATABASE_NAME = "lineage.campaigns.epoch1";
export const CLEAN_EPOCH_DATABASE_VERSION = 1;
export const CLEAN_EPOCH_ACCOUNT_STORE = "accounts";
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
    };
    request.onerror = () => reject(classify(request.error, "unavailable"));
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      const database = request.result;
      if (!hasCampaignPublicationStores(database) || !database.objectStoreNames.contains(CLEAN_EPOCH_ACCOUNT_STORE)) {
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
