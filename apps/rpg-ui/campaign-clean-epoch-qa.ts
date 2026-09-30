import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { CAMPAIGN_DATABASE_NAME, type CampaignStoreFailureCode } from "./src/game-shell/campaignIndexedDbStore.ts";
import {
  CLEAN_EPOCH_ACCOUNT_STORE,
  CLEAN_EPOCH_DATABASE_NAME,
  CLEAN_EPOCH_DATABASE_VERSION,
  CLEAN_EPOCH_SESSION_STORAGE_KEY,
  openCleanEpochAccountStore
} from "./src/game-shell/cleanEpochAccountStore.ts";
import type { LocalAuthCredentialRecord } from "./src/game-shell/launcherAuthManager.ts";

const output = document.querySelector<HTMLPreElement>("#result")!;
const cases: string[] = [];
const check = (value: unknown, message: string) => { if (!value) throw new Error(message); };
const name = (label: string) => `lineage.clean-epoch.qa.${label}.${crypto.randomUUID()}`;
async function test(label: string, run: () => Promise<void>) { await run(); cases.push(label); }
async function expectCode(run: () => Promise<unknown>, code: CampaignStoreFailureCode) {
  try { await run(); } catch (error) { check((error as { code?: string }).code === code, `expected ${code}, got ${String(error)}`); return; }
  throw new Error(`expected ${code}`);
}
function encode(bytes: Uint8Array): string { return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join("")); }
async function credential(accountId: string): Promise<LocalAuthCredentialRecord> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode("synthetic-only-password"), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 120_000 }, material, 256);
  return { accountId, providerId: "local_password", credentialVersion: "pbkdf2_sha256_v1", saltBase64: encode(salt),
    iterations: 120_000, derivedKeyBase64: encode(new Uint8Array(bits)), createdAt: "2026-09-29T00:00:00.000Z", updatedAt: "2026-09-29T00:00:00.000Z" };
}
function rawOpen(databaseName: string, version = CLEAN_EPOCH_DATABASE_VERSION): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => { const op = indexedDB.open(databaseName, version); op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); });
}
function rawPut(db: IDBDatabase, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => { const tx = db.transaction(CLEAN_EPOCH_ACCOUNT_STORE, "readwrite");
    tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).put(value); tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
}

async function suite() {
  const accountId = `account.qa.${crypto.randomUUID()}`;
  const profile = createDefaultAccountProfileState({ accountId, displayName: "Synthetic account", createdAt: "2026-09-29T00:00:00.000Z" });
  const verifier = await credential(accountId);
  await test("fresh namespace has publication stores and no legacy staging", async () => {
    check(CLEAN_EPOCH_DATABASE_NAME !== CAMPAIGN_DATABASE_NAME && !CLEAN_EPOCH_SESSION_STORAGE_KEY.includes("auth.v1"), "namespace aliases legacy");
    await expectCode(() => openCleanEpochAccountStore({ name: CAMPAIGN_DATABASE_NAME }), "invalid_record");
    const databaseName = name("schema"); const owner = await openCleanEpochAccountStore({ name: databaseName }); owner.close();
    const db = await rawOpen(databaseName);
    for (const family of ["accounts", "artifacts", "controls", "slots", "witnesses"]) check(db.objectStoreNames.contains(family), `missing ${family}`);
    for (const family of ["legacyCopyRecords", "legacyCopyManifests", "canonicalRecords", "canonicalManifests"]) check(!db.objectStoreNames.contains(family), `legacy ${family} leaked`);
    db.close();
  });
  await test("atomic registration, exact readback, retry, reopen and selection", async () => {
    const databaseName = name("register"); let owner = await openCleanEpochAccountStore({ name: databaseName });
    check((await owner.register(profile, verifier)).status === "committed", "registration failed");
    check((await owner.register(profile, verifier)).status === "same_source_retry", "registration retry failed");
    check((await owner.readSelected(accountId))?.profile.displayName === profile.displayName, "selection readback");
    await expectCode(() => owner.readSelected("account.missing"), "invalid_record");
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName });
    check((await owner.read(accountId))?.revision === 1 && (await owner.list()).length === 1, "restart account readback"); owner.close();
  });
  await test("profile revision compare-and-swap, retry and stale update", async () => {
    const owner = await openCleanEpochAccountStore({ name: name("profile") }); await owner.register(profile, verifier);
    const updated = { ...profile, displayName: "Updated synthetic account", updatedAt: "2026-09-29T01:00:00.000Z" };
    check((await owner.updateProfile(accountId, 1, updated)).readback.revision === 2, "profile update failed");
    check((await owner.updateProfile(accountId, 1, updated)).status === "same_source_retry", "profile retry failed");
    await expectCode(() => owner.updateProfile(accountId, 1, { ...updated, displayName: "stale" }), "stale_head");
    check((await owner.read(accountId))?.profile.displayName === updated.displayName, "stale write changed profile"); owner.close();
  });
  await test("credential revision and duplicate identity fail closed", async () => {
    const owner = await openCleanEpochAccountStore({ name: name("credential") }); await owner.register(profile, verifier);
    const changed = { ...verifier, updatedAt: "2026-09-29T02:00:00.000Z" };
    check((await owner.updateCredential(accountId, 1, changed)).readback.revision === 2, "credential update failed");
    await expectCode(() => owner.register(profile, verifier), "conflict");
    await expectCode(() => owner.register(profile, { ...verifier, accountId: "account.wrong" }), "invalid_record");
    check((await owner.read(accountId))?.credential.updatedAt === changed.updatedAt, "credential reverted"); owner.close();
  });
  await test("injected abort and quota preserve prior account", async () => {
    for (const code of ["aborted", "quota"] as const) {
      const databaseName = name(code); const initial = await openCleanEpochAccountStore({ name: databaseName });
      await initial.register(profile, verifier); initial.close();
      const failing = await openCleanEpochAccountStore({ name: databaseName, beforeWrite: tx => {
        if (code === "quota") throw new DOMException("quota", "QuotaExceededError");
      }, afterWrite: tx => { if (code === "aborted") tx.abort(); } });
      await expectCode(() => failing.updateProfile(accountId, 1, { ...profile, displayName: "not committed" }), code);
      failing.close(); const reopened = await openCleanEpochAccountStore({ name: databaseName });
      check((await reopened.read(accountId))?.revision === 1 && (await reopened.read(accountId))?.profile.displayName === profile.displayName, `${code} changed prior account`); reopened.close();
    }
  });
  await test("registration abort leaves no partial account or credential", async () => {
    const databaseName = name("register-abort");
    const failing = await openCleanEpochAccountStore({ name: databaseName, afterWrite: tx => tx.abort() });
    await expectCode(() => failing.register(profile, verifier), "aborted"); failing.close();
    const reopened = await openCleanEpochAccountStore({ name: databaseName });
    check(await reopened.read(accountId) === null && (await reopened.list()).length === 0, "aborted registration retained authority"); reopened.close();
  });
  await test("concurrent conflicting registration has one exact winner", async () => {
    const databaseName = name("concurrent");
    const first = await openCleanEpochAccountStore({ name: databaseName });
    const second = await openCleanEpochAccountStore({ name: databaseName });
    const other = { ...profile, displayName: "Competing account" };
    const results = await Promise.allSettled([first.register(profile, verifier), second.register(other, verifier)]);
    check(results.filter(result => result.status === "fulfilled").length === 1, "concurrent registration had multiple winners");
    const rejected = results.find(result => result.status === "rejected") as PromiseRejectedResult | undefined;
    check(rejected?.reason?.code === "conflict", "concurrent loser did not conflict");
    const retained = await first.read(accountId);
    check(retained?.revision === 1 && [profile.displayName, other.displayName].includes(retained.profile.displayName), "concurrent winner mismatch");
    first.close(); second.close();
  });
  await test("malformed retained record blocks read, list and update", async () => {
    const databaseName = name("malformed"); const owner = await openCleanEpochAccountStore({ name: databaseName }); await owner.register(profile, verifier);
    const db = await rawOpen(databaseName); await rawPut(db, { version: 1, accountId, revision: 1, profile: { accountId }, credential: verifier }); db.close();
    await expectCode(() => owner.read(accountId), "invalid_record");
    await expectCode(() => owner.list(), "invalid_record");
    await expectCode(() => owner.updateProfile(accountId, 1, profile), "invalid_record"); owner.close();
  });
  await test("missing durable profile history and cross-account alias reject", async () => {
    const owner = await openCleanEpochAccountStore({ name: name("history") });
    await expectCode(() => owner.register({ ...profile, history: undefined } as unknown as typeof profile, verifier), "invalid_record");
    await expectCode(() => owner.register({ ...profile, accountId: "account.other" }, verifier), "invalid_record");
    check((await owner.list()).length === 0, "invalid registration created authority"); owner.close();
  });
  await test("unavailable, blocked upgrade and incompatible schema reject", async () => {
    await expectCode(() => openCleanEpochAccountStore({ factory: { open: () => { throw new Error("unavailable"); } } as unknown as IDBFactory }), "unavailable");
    const databaseName = name("blocked"); const created = await openCleanEpochAccountStore({ name: databaseName }); created.close();
    const holder = await rawOpen(databaseName);
    await expectCode(() => openCleanEpochAccountStore({ name: databaseName, factory: { open: () => indexedDB.open(databaseName, CLEAN_EPOCH_DATABASE_VERSION + 1) } as IDBFactory }), "blocked_upgrade");
    holder.close();
    const wrong = name("incompatible"); const old = await rawOpen(wrong); old.close();
    await expectCode(() => openCleanEpochAccountStore({ name: wrong }), "invalid_record");
  });
}

suite().then(() => { output.textContent = `PASS ${cases.length}\n${cases.join("\n")}`; output.dataset.done = "true"; })
  .catch(error => { output.textContent = `FAIL after ${cases.length}\n${String(error)}\n${error?.stack ?? ""}`; output.dataset.done = "true"; });
