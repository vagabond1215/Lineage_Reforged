import { createDefaultAccountProfileState } from "../../../../packages/engines/game-engine/src/legacy-account.js";
import type { AccountProfileState } from "../../../../packages/shared/types/src/index.js";
import { CampaignStoreError, type CampaignStoreFailureCode } from "./campaignIndexedDbStore.js";
import {
  CLEAN_EPOCH_SESSION_STORAGE_KEY,
  type CleanEpochAccountRecord,
  type CleanEpochAccountStore
} from "./cleanEpochAccountStore.js";
import {
  createCredentialRecord,
  verifyPassword,
  type LauncherRuntimeSession
} from "./launcherAuthManager.js";

export type EpochAccountAdapterFailureCode = CampaignStoreFailureCode |
  "invalid_input" | "invalid_credentials";
export type EpochAccountAdapterResult<T> =
  | { status: "ready"; value: T }
  | { status: "blocked"; code: EpochAccountAdapterFailureCode; message: string; accountId?: string };

export type EpochSessionSelection =
  | { mode: "signed_in"; account: CleanEpochAccountRecord; session: LauncherRuntimeSession }
  | { mode: "pick_account"; accounts: Array<{ accountId: string; displayName: string; lastPlayedAt?: string }> };

type EpochSessionHint = { version: 1; accountId: string; issuedAt: string };

function blocked(error: unknown, accountId?: string): EpochAccountAdapterResult<never> {
  if (error instanceof CampaignStoreError) {
    return { status: "blocked", code: error.code, message: error.message, ...(accountId ? { accountId } : {}) };
  }
  return { status: "blocked", code: "unavailable", message: error instanceof Error ? error.message : String(error),
    ...(accountId ? { accountId } : {}) };
}

function rejected(code: EpochAccountAdapterFailureCode, message: string, accountId?: string): EpochAccountAdapterResult<never> {
  return { status: "blocked", code, message, ...(accountId ? { accountId } : {}) };
}

function hintStorage(storage?: Storage): Storage {
  if (storage) return storage;
  if (typeof window === "undefined") throw new Error("Epoch session storage requires a browser.");
  return window.localStorage;
}

function readHint(storage: Storage): EpochSessionHint | null {
  const raw = storage.getItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
  if (raw === null) return null;
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new CampaignStoreError("invalid_record", "Epoch session hint is malformed."); }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new CampaignStoreError("invalid_record", "Epoch session hint is invalid.");
  const hint = value as Record<string, unknown>;
  if (hint.version !== 1 || typeof hint.accountId !== "string" || !hint.accountId.trim() ||
      typeof hint.issuedAt !== "string" || !hint.issuedAt.trim())
    throw new CampaignStoreError("invalid_record", "Epoch session hint is invalid.");
  return hint as EpochSessionHint;
}

function runtimeSession(hint: EpochSessionHint, stayLoggedIn: boolean): LauncherRuntimeSession {
  return { accountId: hint.accountId, providerId: "local_password", issuedAt: hint.issuedAt,
    lastValidatedAt: new Date().toISOString(), stayLoggedIn };
}

function storeHint(storage: Storage, hint: EpochSessionHint | null): void {
  try {
    if (hint) {
      const raw = JSON.stringify(hint);
      storage.setItem(CLEAN_EPOCH_SESSION_STORAGE_KEY, raw);
      if (storage.getItem(CLEAN_EPOCH_SESSION_STORAGE_KEY) !== raw) throw new Error("Epoch session hint readback differed.");
    } else {
      storage.removeItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
      if (storage.getItem(CLEAN_EPOCH_SESSION_STORAGE_KEY) !== null) throw new Error("Epoch session hint removal failed.");
    }
  } catch (error) {
    throw new CampaignStoreError("unavailable", "Epoch session hint could not be saved or cleared.", error);
  }
}

export function createEpochAccountId(): string {
  if (typeof globalThis.crypto?.randomUUID !== "function")
    throw new CampaignStoreError("unavailable", "Secure account identity generation is unavailable.");
  return `account.local.${globalThis.crypto.randomUUID()}`;
}

/** Awaited caller adapter. The IndexedDB owner is the sole account and credential authority. */
export class CleanEpochAccountAdapter {
  constructor(private readonly owner: CleanEpochAccountStore, private readonly storage?: Storage) {}

  async register(input: { accountId: string; displayName: string; password: string;
    confirmPassword: string; stayLoggedIn: boolean }): Promise<EpochAccountAdapterResult<{
      account: CleanEpochAccountRecord; session: LauncherRuntimeSession }>> {
    const accountId = input.accountId.trim();
    const displayName = input.displayName.trim();
    const password = input.password.trim();
    if (!accountId || !displayName || !password || password !== input.confirmPassword.trim())
      return rejected("invalid_input", "Account name, password or confirmation is invalid.", accountId || undefined);
    try {
      // The caller creates and retains the account ID before invoking this async operation.
      // A lost registration response can therefore retry the same identity after restart.
      const existing = await this.owner.read(accountId);
      let account: CleanEpochAccountRecord;
      if (existing) {
        if (existing.profile.displayName !== displayName || !await verifyPassword(password, existing.credential))
          return rejected("conflict", "Account identity belongs to different retained credentials or profile.", accountId);
        account = existing;
      } else {
        const recordedAt = new Date().toISOString();
        const profile = createDefaultAccountProfileState({ accountId, displayName, createdAt: recordedAt, updatedAt: recordedAt });
        const credential = await createCredentialRecord(accountId, password, recordedAt);
        try {
          account = (await this.owner.register(profile, credential)).readback;
        } catch (error) {
          if (!(error instanceof CampaignStoreError) || error.code !== "conflict") throw error;
          const winner = await this.owner.read(accountId);
          if (!winner || winner.profile.displayName !== displayName ||
              !await verifyPassword(password, winner.credential)) throw error;
          account = winner;
        }
      }
      const hint: EpochSessionHint = { version: 1, accountId, issuedAt: new Date().toISOString() };
      storeHint(hintStorage(this.storage), input.stayLoggedIn ? hint : null);
      return { status: "ready", value: { account, session: runtimeSession(hint, input.stayLoggedIn) } };
    } catch (error) { return blocked(error, accountId); }
  }

  async signIn(input: { accountId: string; password: string; stayLoggedIn: boolean }): Promise<EpochAccountAdapterResult<{
      account: CleanEpochAccountRecord; session: LauncherRuntimeSession }>> {
    const accountId = input.accountId.trim();
    const password = input.password.trim();
    if (!accountId || !password) return rejected("invalid_input", "Account and password are required.", accountId || undefined);
    try {
      const current = await this.owner.read(accountId);
      if (!current || !await verifyPassword(password, current.credential))
        return rejected("invalid_credentials", "Account or password did not match.", accountId);
      // Reading again after the PBKDF2 await prevents an already-replaced
      // credential from yielding a session. Sign-in must not advance account
      // revision: a prepared campaign still needs that exact revision on restart.
      const account = await this.owner.readSelected(accountId);
      if (!account || account.revision !== current.revision ||
          account.credential.derivedKeyBase64 !== current.credential.derivedKeyBase64 ||
          account.credential.saltBase64 !== current.credential.saltBase64)
        return rejected("stale_head", "Account credential changed during sign-in.", accountId);
      const recordedAt = new Date().toISOString();
      const hint: EpochSessionHint = { version: 1, accountId, issuedAt: recordedAt };
      storeHint(hintStorage(this.storage), input.stayLoggedIn ? hint : null);
      return { status: "ready", value: { account, session: runtimeSession(hint, input.stayLoggedIn) } };
    } catch (error) { return blocked(error, accountId); }
  }

  async selectSession(): Promise<EpochAccountAdapterResult<EpochSessionSelection>> {
    try {
      const hint = readHint(hintStorage(this.storage));
      if (!hint) {
        const accounts = (await this.owner.list()).map(account => ({
          accountId: account.accountId,
          displayName: account.profile.displayName,
          ...(account.profile.lastPlayedAt ? { lastPlayedAt: account.profile.lastPlayedAt } : {})
        }));
        return { status: "ready", value: { mode: "pick_account", accounts } };
      }
      const account = await this.owner.readSelected(hint.accountId);
      if (!account) throw new CampaignStoreError("invalid_record", "Epoch session account is missing.");
      return { status: "ready", value: { mode: "signed_in", account, session: runtimeSession(hint, true) } };
    } catch (error) { return blocked(error); }
  }

  async updateProfile(accountId: string, expectedRevision: number, profile: AccountProfileState): Promise<EpochAccountAdapterResult<CleanEpochAccountRecord>> {
    try { return { status: "ready", value: (await this.owner.updateProfile(accountId, expectedRevision, profile)).readback }; }
    catch (error) { return blocked(error, accountId); }
  }

  async changePassword(input: { accountId: string; expectedRevision: number; currentPassword: string;
    newPassword: string; confirmPassword: string }): Promise<EpochAccountAdapterResult<CleanEpochAccountRecord>> {
    const accountId = input.accountId.trim();
    const currentPassword = input.currentPassword.trim();
    const newPassword = input.newPassword.trim();
    if (!accountId || !currentPassword || !newPassword || newPassword !== input.confirmPassword.trim())
      return rejected("invalid_input", "Current password, new password or confirmation is invalid.", accountId || undefined);
    try {
      const current = await this.owner.readSelected(accountId);
      if (!current) throw new CampaignStoreError("invalid_record", "Account is missing.");
      if (current.revision !== input.expectedRevision) return rejected("stale_head", "Account revision changed.", accountId);
      if (!await verifyPassword(currentPassword, current.credential))
        return rejected("invalid_credentials", "Current password did not match.", accountId);
      const credential = await createCredentialRecord(accountId, newPassword, new Date().toISOString());
      credential.createdAt = current.credential.createdAt;
      return { status: "ready", value: (await this.owner.updateCredential(accountId, input.expectedRevision, credential)).readback };
    } catch (error) { return blocked(error, accountId); }
  }
}
