import type { AccountProfileState } from "../../../../packages/shared/types/src/index.js";
import { createDefaultAccountProfileState } from "../../../../packages/engines/game-engine/src/legacy-account.js";
import {
  clearActiveAccountId,
  deleteStoredAccountProfile,
  listStoredAccountProfiles,
  loadStoredAccountProfile,
  saveAccountProfile,
  setActiveAccountId
} from "./accountProfileManager.js";
import { resetAllSaves } from "./saveManager.js";

const AUTH_STORAGE_PREFIX = "cataclysm-rpg-ui.auth.v1";
const SESSION_STORAGE_KEY = `${AUTH_STORAGE_PREFIX}.session`;
const LOCAL_AUTH_PROVIDER_ID = "local_password";
const LOCAL_CREDENTIAL_VERSION = "pbkdf2_sha256_v1";
const LOCAL_PASSWORD_ITERATIONS = 120_000;
const LOCAL_PASSWORD_SALT_BYTES = 16;
const LOCAL_PASSWORD_DERIVED_KEY_BYTES = 32;
export const MALFORMED_AUTH_NOTICE =
  "Stored sign-in data was unreadable and has been cleared. Account data remains intact.";

type LocalAuthProviderId = typeof LOCAL_AUTH_PROVIDER_ID;
type LocalCredentialVersion = typeof LOCAL_CREDENTIAL_VERSION;

export interface LocalAuthCredentialRecord {
  accountId: string;
  providerId: LocalAuthProviderId;
  credentialVersion: LocalCredentialVersion;
  saltBase64: string;
  iterations: number;
  derivedKeyBase64: string;
  createdAt: string;
  updatedAt: string;
  lastSignedInAt?: string;
}

export interface LauncherAuthSessionRecord {
  accountId: string;
  providerId: LocalAuthProviderId;
  issuedAt: string;
  lastValidatedAt: string;
  stayLoggedIn: boolean;
  providerAccountRef?: string;
  metadata?: Record<string, string>;
}

export interface LauncherRuntimeSession {
  accountId: string;
  providerId: LocalAuthProviderId;
  issuedAt: string;
  lastValidatedAt: string;
  stayLoggedIn: boolean;
  providerAccountRef?: string;
  metadata?: Record<string, string>;
}

export interface LocalAccountPickerEntry {
  accountId: string;
  displayName: string;
  lastPlayedAt?: string;
}

export type LauncherAuthBootstrapState =
  | {
      mode: "signed_in";
      session: LauncherRuntimeSession;
      accountProfile: AccountProfileState;
      notice: string | null;
    }
  | {
      mode: "pick_account" | "create_first_account";
      accounts: LocalAccountPickerEntry[];
      notice: string | null;
    };

export type LauncherAuthResult =
  | {
      ok: true;
      session: LauncherRuntimeSession;
      accountProfile: AccountProfileState;
    }
  | {
      ok: false;
      message: string;
    };

export type LauncherAccountDeletionResult =
  | {
      ok: true;
      accountId: string;
      displayName: string;
    }
  | {
      ok: false;
      message: string;
    };

export type LauncherAccountResetResult =
  | {
      ok: true;
      accountProfile: AccountProfileState;
    }
  | {
      ok: false;
      message: string;
    };

class LocalAuthStorageError extends Error {}

function getAuthStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("Launcher auth storage is only available in the browser.");
  }

  return window.localStorage;
}

function getCredentialStorageKey(accountId: string): string {
  return `${AUTH_STORAGE_PREFIX}.credential.${accountId}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringMap(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) &&
    Object.values(value).every((entry) => typeof entry === "string")
  );
}

function isLauncherAuthSessionRecord(value: unknown): value is LauncherAuthSessionRecord {
  return (
    isRecord(value) &&
    typeof value.accountId === "string" &&
    value.providerId === LOCAL_AUTH_PROVIDER_ID &&
    typeof value.issuedAt === "string" &&
    typeof value.lastValidatedAt === "string" &&
    typeof value.stayLoggedIn === "boolean" &&
    (typeof value.providerAccountRef === "string" ||
      value.providerAccountRef === undefined) &&
    (value.metadata === undefined || isStringMap(value.metadata))
  );
}

function isLocalAuthCredentialRecord(value: unknown): value is LocalAuthCredentialRecord {
  return (
    isRecord(value) &&
    typeof value.accountId === "string" &&
    value.providerId === LOCAL_AUTH_PROVIDER_ID &&
    value.credentialVersion === LOCAL_CREDENTIAL_VERSION &&
    typeof value.saltBase64 === "string" &&
    typeof value.iterations === "number" &&
    Number.isInteger(value.iterations) &&
    value.iterations > 0 &&
    typeof value.derivedKeyBase64 === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    (typeof value.lastSignedInAt === "string" || value.lastSignedInAt === undefined)
  );
}

function parseAuthJson<T>(
  storageKey: string,
  raw: string,
  validator: (value: unknown) => value is T
): T {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new LocalAuthStorageError(`Stored auth record '${storageKey}' is malformed.`);
  }

  if (!validator(parsed)) {
    throw new LocalAuthStorageError(`Stored auth record '${storageKey}' is malformed.`);
  }

  return parsed;
}

function encodeBase64(bytes: Uint8Array): string {
  const binary = Array.from(bytes, (value) => String.fromCharCode(value)).join("");
  return globalThis.btoa(binary);
}

function decodeBase64(value: string): Uint8Array {
  const binary = globalThis.atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
}

function getCryptoApi(): Crypto {
  if (typeof globalThis.crypto === "undefined" || !globalThis.crypto.subtle) {
    throw new Error("Secure local sign-in requires Web Crypto support.");
  }

  return globalThis.crypto;
}

function listAuthStorageKeys(storage: Storage): string[] {
  const keys: string[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (key && key.startsWith(AUTH_STORAGE_PREFIX)) {
      keys.push(key);
    }
  }

  return keys;
}

function readStoredCredentialRecord(storage: Storage, accountId: string): LocalAuthCredentialRecord | null {
  const raw = storage.getItem(getCredentialStorageKey(accountId));

  if (!raw) {
    return null;
  }

  return parseAuthJson(getCredentialStorageKey(accountId), raw, isLocalAuthCredentialRecord);
}

function readStoredSessionRecord(storage: Storage): LauncherAuthSessionRecord | null {
  const raw = storage.getItem(SESSION_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  return parseAuthJson(SESSION_STORAGE_KEY, raw, isLauncherAuthSessionRecord);
}

function toRuntimeSession(session: LauncherAuthSessionRecord): LauncherRuntimeSession {
  return {
    accountId: session.accountId,
    providerId: session.providerId,
    issuedAt: session.issuedAt,
    lastValidatedAt: session.lastValidatedAt,
    stayLoggedIn: session.stayLoggedIn,
    ...(session.providerAccountRef ? { providerAccountRef: session.providerAccountRef } : {}),
    ...(session.metadata ? { metadata: { ...session.metadata } } : {})
  };
}

function createRuntimeSession(
  accountId: string,
  options: {
    stayLoggedIn: boolean;
    recordedAt?: string;
    providerAccountRef?: string;
    metadata?: Record<string, string>;
  }
): LauncherRuntimeSession {
  const recordedAt = options.recordedAt ?? new Date().toISOString();

  return {
    accountId,
    providerId: LOCAL_AUTH_PROVIDER_ID,
    issuedAt: recordedAt,
    lastValidatedAt: recordedAt,
    stayLoggedIn: options.stayLoggedIn,
    ...(options.providerAccountRef ? { providerAccountRef: options.providerAccountRef } : {}),
    ...(options.metadata ? { metadata: { ...options.metadata } } : {})
  };
}

function saveRuntimeSession(session: LauncherRuntimeSession): void {
  const storage = getAuthStorage();
  const persisted: LauncherAuthSessionRecord = {
    accountId: session.accountId,
    providerId: session.providerId,
    issuedAt: session.issuedAt,
    lastValidatedAt: session.lastValidatedAt,
    stayLoggedIn: session.stayLoggedIn,
    ...(session.providerAccountRef ? { providerAccountRef: session.providerAccountRef } : {}),
    ...(session.metadata ? { metadata: { ...session.metadata } } : {})
  };

  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(persisted));
}

function writeCredentialRecord(record: LocalAuthCredentialRecord): void {
  const storage = getAuthStorage();
  storage.setItem(getCredentialStorageKey(record.accountId), JSON.stringify(record));
}

async function derivePasswordVerifier(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<Uint8Array> {
  const cryptoApi = getCryptoApi();
  const encoder = new TextEncoder();
  const keyMaterial = await cryptoApi.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await cryptoApi.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: toArrayBuffer(salt),
      iterations
    },
    keyMaterial,
    LOCAL_PASSWORD_DERIVED_KEY_BYTES * 8
  );

  return new Uint8Array(derivedBits);
}

export function constantTimeEqualBytes(left: Uint8Array, right: Uint8Array): boolean {
  if (left.byteLength !== right.byteLength) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.byteLength; index += 1) {
    difference |= left[index]! ^ right[index]!;
  }

  return difference === 0;
}

async function createCredentialRecord(
  accountId: string,
  password: string,
  recordedAt: string
): Promise<LocalAuthCredentialRecord> {
  const cryptoApi = getCryptoApi();
  const salt = cryptoApi.getRandomValues(new Uint8Array(LOCAL_PASSWORD_SALT_BYTES));
  const derivedKey = await derivePasswordVerifier(
    password,
    salt,
    LOCAL_PASSWORD_ITERATIONS
  );

  return {
    accountId,
    providerId: LOCAL_AUTH_PROVIDER_ID,
    credentialVersion: LOCAL_CREDENTIAL_VERSION,
    saltBase64: encodeBase64(salt),
    iterations: LOCAL_PASSWORD_ITERATIONS,
    derivedKeyBase64: encodeBase64(derivedKey),
    createdAt: recordedAt,
    updatedAt: recordedAt
  };
}

async function verifyPassword(
  password: string,
  credential: LocalAuthCredentialRecord
): Promise<boolean> {
  const expectedBytes = decodeBase64(credential.derivedKeyBase64);
  const derivedBytes = await derivePasswordVerifier(
    password,
    decodeBase64(credential.saltBase64),
    credential.iterations
  );

  return constantTimeEqualBytes(derivedBytes, expectedBytes);
}

function buildPickerEntries(storage: Storage): LocalAccountPickerEntry[] {
  return listStoredAccountProfiles()
    .filter((profile) => readStoredCredentialRecord(storage, profile.accountId))
    .map((profile) => ({
      accountId: profile.accountId,
      displayName: profile.displayName,
      ...(profile.lastPlayedAt ? { lastPlayedAt: profile.lastPlayedAt } : {})
    }));
}

function buildAccessBootstrapState(
  storage: Storage,
  notice: string | null
): LauncherAuthBootstrapState {
  const accounts = buildPickerEntries(storage);

  if (accounts.length > 0) {
    return {
      mode: "pick_account",
      accounts,
      notice
    };
  }

  return {
    mode: "create_first_account",
    accounts: [],
    notice
  };
}

function generateAccountId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return `account.local.${globalThis.crypto.randomUUID()}`;
  }

  const randomSuffix = Math.random().toString(16).slice(2, 10);
  return `account.local.${Date.now().toString(16)}.${randomSuffix}`;
}

function sanitizeDisplayName(displayName: string): string {
  return displayName.trim();
}

function sanitizePassword(password: string): string {
  return password.trim();
}

function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): string | null {
  const normalizedPassword = sanitizePassword(password);
  const normalizedConfirm = sanitizePassword(confirmPassword);

  if (!normalizedPassword) {
    return "Enter a password before continuing.";
  }

  if (normalizedPassword !== normalizedConfirm) {
    return "Password confirmation does not match.";
  }

  return null;
}

export function clearLauncherAuthStorage(): void {
  const storage = getAuthStorage();

  for (const key of listAuthStorageKeys(storage)) {
    storage.removeItem(key);
  }
}

export function signOutLauncherSession(): void {
  const storage = getAuthStorage();
  storage.removeItem(SESSION_STORAGE_KEY);
}

export function bootstrapLauncherAuth(): LauncherAuthBootstrapState {
  const storage = getAuthStorage();

  try {
    const storedSession = readStoredSessionRecord(storage);

    if (storedSession) {
      if (!storedSession.stayLoggedIn) {
        storage.removeItem(SESSION_STORAGE_KEY);
      } else {
        const accountProfile = loadStoredAccountProfile(storedSession.accountId);
        const credential = readStoredCredentialRecord(storage, storedSession.accountId);

        if (accountProfile && credential) {
          const runtimeSession = toRuntimeSession(storedSession);
          setActiveAccountId(accountProfile.accountId);

          return {
            mode: "signed_in",
            session: runtimeSession,
            accountProfile,
            notice: null
          };
        }

        storage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    return buildAccessBootstrapState(storage, null);
  } catch (error) {
    if (!(error instanceof LocalAuthStorageError)) {
      throw error;
    }

    clearLauncherAuthStorage();
    return buildAccessBootstrapState(storage, MALFORMED_AUTH_NOTICE);
  }
}

export async function signInLocalAccount(options: {
  accountId: string;
  password: string;
  stayLoggedIn: boolean;
}): Promise<LauncherAuthResult> {
  const storage = getAuthStorage();
  const password = sanitizePassword(options.password);

  if (!password) {
    return {
      ok: false,
      message: "Enter the account password before continuing."
    };
  }

  try {
    const accountProfile = loadStoredAccountProfile(options.accountId);

    if (!accountProfile) {
      return {
        ok: false,
        message: "That account could not be found on this device."
      };
    }

    const credential = readStoredCredentialRecord(storage, options.accountId);

    if (!credential) {
      return {
        ok: false,
        message: "That account could not be found on this device."
      };
    }

    const passwordMatches = await verifyPassword(password, credential);

    if (!passwordMatches) {
      return {
        ok: false,
        message: "The account password did not match."
      };
    }

    const recordedAt = new Date().toISOString();
    const updatedCredential: LocalAuthCredentialRecord = {
      ...credential,
      updatedAt: recordedAt,
      lastSignedInAt: recordedAt
    };
    writeCredentialRecord(updatedCredential);

    const session = createRuntimeSession(options.accountId, {
      stayLoggedIn: options.stayLoggedIn,
      recordedAt
    });

    if (session.stayLoggedIn) {
      saveRuntimeSession(session);
    } else {
      storage.removeItem(SESSION_STORAGE_KEY);
    }

    setActiveAccountId(options.accountId);

    return {
      ok: true,
      session,
      accountProfile
    };
  } catch (error) {
    if (!(error instanceof LocalAuthStorageError)) {
      throw error;
    }

    clearLauncherAuthStorage();
    return {
      ok: false,
      message: MALFORMED_AUTH_NOTICE
    };
  }
}

export async function createLocalAccount(options: {
  displayName: string;
  password: string;
  confirmPassword: string;
  stayLoggedIn: boolean;
}): Promise<LauncherAuthResult> {
  const displayName = sanitizeDisplayName(options.displayName);

  if (!displayName) {
    return {
      ok: false,
      message: "Enter an account name before continuing."
    };
  }

  const validationError = validatePasswordConfirmation(
    options.password,
    options.confirmPassword
  );

  if (validationError) {
    return {
      ok: false,
      message: validationError
    };
  }

  const accountId = generateAccountId();
  const recordedAt = new Date().toISOString();
  const profile = saveAccountProfile(
    createDefaultAccountProfileState({
      accountId,
      displayName,
      createdAt: recordedAt,
      updatedAt: recordedAt
    })
  );
  const credential = await createCredentialRecord(
    accountId,
    sanitizePassword(options.password),
    recordedAt
  );
  writeCredentialRecord(credential);

  const session = createRuntimeSession(accountId, {
    stayLoggedIn: options.stayLoggedIn,
    recordedAt
  });
  const storage = getAuthStorage();

  if (session.stayLoggedIn) {
    saveRuntimeSession(session);
  } else {
    storage.removeItem(SESSION_STORAGE_KEY);
  }

  setActiveAccountId(accountId);

  return {
    ok: true,
    session,
    accountProfile: profile
  };
}

export async function resetLocalAccount(options: {
  accountId: string;
  password: string;
}): Promise<LauncherAccountResetResult> {
  const storage = getAuthStorage();
  const password = sanitizePassword(options.password);

  if (!password) {
    return {
      ok: false,
      message: "Enter the account password before resetting this account."
    };
  }

  try {
    const accountProfile = loadStoredAccountProfile(options.accountId);

    if (!accountProfile) {
      return {
        ok: false,
        message: "That account could not be found on this device."
      };
    }

    const credential = readStoredCredentialRecord(storage, options.accountId);

    if (!credential) {
      return {
        ok: false,
        message: "That account could not be found on this device."
      };
    }

    const passwordMatches = await verifyPassword(password, credential);

    if (!passwordMatches) {
      return {
        ok: false,
        message: "The account password did not match."
      };
    }

    resetAllSaves(options.accountId);

    const recordedAt = new Date().toISOString();
    const resetProfile = saveAccountProfile(
      createDefaultAccountProfileState({
        accountId: accountProfile.accountId,
        displayName: accountProfile.displayName,
        createdAt: accountProfile.createdAt,
        updatedAt: recordedAt
      })
    );

    setActiveAccountId(accountProfile.accountId);

    return {
      ok: true,
      accountProfile: resetProfile
    };
  } catch (error) {
    if (!(error instanceof LocalAuthStorageError)) {
      throw error;
    }

    clearLauncherAuthStorage();
    return {
      ok: false,
      message: MALFORMED_AUTH_NOTICE
    };
  }
}

export async function deleteLocalAccount(options: {
  accountId: string;
  password: string;
}): Promise<LauncherAccountDeletionResult> {
  const storage = getAuthStorage();
  const password = sanitizePassword(options.password);

  if (!password) {
    return {
      ok: false,
      message: "Enter the account password before deleting this account."
    };
  }

  try {
    const accountProfile = loadStoredAccountProfile(options.accountId);

    if (!accountProfile) {
      return {
        ok: false,
        message: "That account could not be found on this device."
      };
    }

    const credential = readStoredCredentialRecord(storage, options.accountId);

    if (!credential) {
      return {
        ok: false,
        message: "That account could not be found on this device."
      };
    }

    const passwordMatches = await verifyPassword(password, credential);

    if (!passwordMatches) {
      return {
        ok: false,
        message: "The account password did not match."
      };
    }

    const storedSession = readStoredSessionRecord(storage);

    if (storedSession?.accountId === options.accountId) {
      storage.removeItem(SESSION_STORAGE_KEY);
    }

    storage.removeItem(getCredentialStorageKey(options.accountId));
    resetAllSaves(options.accountId);
    deleteStoredAccountProfile(options.accountId);
    clearActiveAccountId(options.accountId);

    return {
      ok: true,
      accountId: options.accountId,
      displayName: accountProfile.displayName
    };
  } catch (error) {
    if (!(error instanceof LocalAuthStorageError)) {
      throw error;
    }

    clearLauncherAuthStorage();
    return {
      ok: false,
      message: MALFORMED_AUTH_NOTICE
    };
  }
}
