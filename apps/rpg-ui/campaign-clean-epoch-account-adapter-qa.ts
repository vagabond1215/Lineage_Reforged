import { CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_SESSION_STORAGE_KEY,
  openCleanEpochAccountStore } from "./src/game-shell/cleanEpochAccountStore.ts";
import { CleanEpochAccountAdapter, createEpochAccountId } from "./src/game-shell/cleanEpochAccountAdapter.ts";

const output = document.querySelector<HTMLPreElement>("#result")!;
const cases: string[] = [];
const check = (value: unknown, message: string) => { if (!value) throw new Error(message); };
const name = (label: string) => `lineage.epoch-account-adapter.qa.${label}.${crypto.randomUUID()}`;
async function test(label: string, run: () => Promise<void>) { await run(); cases.push(label); }
class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}
function registration(accountId: string, stayLoggedIn = true) {
  return { accountId, displayName: "Epoch account", password: "secret password",
    confirmPassword: "secret password", stayLoggedIn };
}
function rawOpen(databaseName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => { const request = indexedDB.open(databaseName);
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
}
function rawPut(db: IDBDatabase, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => { const tx = db.transaction(CLEAN_EPOCH_ACCOUNT_STORE, "readwrite");
    tx.objectStore(CLEAN_EPOCH_ACCOUNT_STORE).put(value); tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
}

async function suite() {
  const accountId = createEpochAccountId();
  check(accountId.startsWith("account.local."), "account identity did not use secure epoch ID");
  const databaseName = name("account");
  const storage = new MemoryStorage();
  let owner = await openCleanEpochAccountStore({ name: databaseName });
  let adapter = new CleanEpochAccountAdapter(owner, storage);
  await test("registration retains one account and credential in IndexedDB", async () => {
    const result = await adapter.register(registration(accountId));
    check(result.status === "ready" && result.value.account.revision === 1, "registration failed");
    check((await owner.read(accountId))?.credential.credentialVersion === "pbkdf2_sha256_v1", "credential missing");
    check(JSON.parse(storage.getItem(CLEAN_EPOCH_SESSION_STORAGE_KEY)!).accountId === accountId, "session hint missing");
    check(storage.length === 1, "adapter wrote more than the session hint to local storage");
  });
  await test("restart and same-input registration preserve account identity", async () => {
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName });
    adapter = new CleanEpochAccountAdapter(owner, storage);
    const restored = await adapter.selectSession();
    check(restored.status === "ready" && restored.value.mode === "signed_in" &&
      restored.value.account.accountId === accountId, "session was not validated against retained account");
    const retry = await adapter.register(registration(accountId));
    check(retry.status === "ready" && retry.value.account.revision === 1 && (await owner.list()).length === 1,
      "registration retry generated another account");
  });
  await test("wrong password and conflicting registration do not mutate credentials", async () => {
    const before = await owner.read(accountId);
    check((await adapter.signIn({ accountId, password: "wrong", stayLoggedIn: true })).status === "blocked", "wrong password signed in");
    const collision = await adapter.register({ ...registration(accountId), displayName: "Other" });
    check(collision.status === "blocked" && collision.code === "conflict", "account identity collision was accepted");
    check((await owner.read(accountId))?.revision === before?.revision, "rejected auth changed revision");
  });
  await test("sign-in verifies retained credential without stranding prepared revisions", async () => {
    const result = await adapter.signIn({ accountId, password: "secret password", stayLoggedIn: true });
    check(result.status === "ready" && result.value.account.revision === 1 &&
      (await owner.read(accountId))?.revision === 1,
      "sign-in changed the account revision");
  });
  await test("nonpersistent sign-in clears only the epoch hint", async () => {
    storage.setItem("cataclysm-rpg-ui.auth.v1.session", "legacy-test-marker");
    const result = await adapter.signIn({ accountId, password: "secret password", stayLoggedIn: false });
    check(result.status === "ready" && storage.getItem(CLEAN_EPOCH_SESSION_STORAGE_KEY) === null,
      "nonpersistent session left epoch hint");
    check(storage.getItem("cataclysm-rpg-ui.auth.v1.session") === "legacy-test-marker", "legacy data was touched");
    const selected = await adapter.selectSession();
    check(selected.status === "ready" && selected.value.mode === "pick_account" && selected.value.accounts.length === 1 &&
      !("credential" in selected.value.accounts[0]!), "picker leaked credential or lost retained account");
  });
  await test("malformed and stale session hints block selection", async () => {
    storage.setItem(CLEAN_EPOCH_SESSION_STORAGE_KEY, "{");
    const malformed = await adapter.selectSession();
    check(malformed.status === "blocked" && malformed.code === "invalid_record", "malformed hint was ignored");
    storage.setItem(CLEAN_EPOCH_SESSION_STORAGE_KEY, JSON.stringify({ version: 1, accountId: "missing", issuedAt: new Date().toISOString() }));
    const missing = await adapter.selectSession();
    check(missing.status === "blocked" && missing.code === "invalid_record", "missing hinted account became a default");
    storage.removeItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
  });
  await test("profile compare-and-swap and two owners have one winner", async () => {
    const second = await openCleanEpochAccountStore({ name: databaseName });
    const rival = new CleanEpochAccountAdapter(second, new MemoryStorage());
    const current = (await owner.read(accountId))!;
    const firstProfile = { ...current.profile, displayName: "First", updatedAt: new Date().toISOString() };
    const secondProfile = { ...current.profile, displayName: "Second", updatedAt: new Date().toISOString() };
    const results = await Promise.all([adapter.updateProfile(accountId, current.revision, firstProfile),
      rival.updateProfile(accountId, current.revision, secondProfile)]);
    check(results.filter(result => result.status === "ready").length === 1 &&
      results.filter(result => result.status === "blocked" && result.code === "stale_head").length === 1,
      "concurrent profile owners did not serialize");
    second.close();
  });
  await test("password mutation checks prior secret and revision", async () => {
    const current = (await owner.read(accountId))!;
    const wrong = await adapter.changePassword({ accountId, expectedRevision: current.revision,
      currentPassword: "wrong", newPassword: "replacement", confirmPassword: "replacement" });
    check(wrong.status === "blocked" && wrong.code === "invalid_credentials", "wrong current password changed credential");
    const changed = await adapter.changePassword({ accountId, expectedRevision: current.revision,
      currentPassword: "secret password", newPassword: "replacement", confirmPassword: "replacement" });
    check(changed.status === "ready" && changed.value.accountId === accountId, "password did not change");
    check((await adapter.signIn({ accountId, password: "secret password", stayLoggedIn: false })).status === "blocked", "old password still worked");
    check((await adapter.signIn({ accountId, password: "replacement", stayLoggedIn: false })).status === "ready", "new password failed");
    const stale = await adapter.changePassword({ accountId, expectedRevision: current.revision,
      currentPassword: "replacement", newPassword: "next", confirmPassword: "next" });
    check(stale.status === "blocked" && stale.code === "stale_head", "stale credential CAS succeeded");
  });
  await test("registration abort and quota leave no partial account", async () => {
    for (const mode of ["aborted", "quota"] as const) {
      const dbName = name(mode); const id = createEpochAccountId();
      const failing = await openCleanEpochAccountStore({ name: dbName,
        beforeWrite: () => { if (mode === "quota") throw new DOMException("quota", "QuotaExceededError"); },
        afterWrite: tx => { if (mode === "aborted") tx.abort(); } });
      const result = await new CleanEpochAccountAdapter(failing, new MemoryStorage()).register(registration(id));
      check(result.status === "blocked" && result.code === mode, `${mode} did not block registration`);
      failing.close(); const reopened = await openCleanEpochAccountStore({ name: dbName });
      check(await reopened.read(id) === null, `${mode} retained partial account`); reopened.close();
    }
  });
  await test("session hint failure leaves committed account reachable by password", async () => {
    const dbName = name("hint-failure"); const id = createEpochAccountId();
    const selected = await openCleanEpochAccountStore({ name: dbName });
    const failingStorage = new MemoryStorage();
    failingStorage.setItem = () => { throw new Error("storage unavailable"); };
    const failed = await new CleanEpochAccountAdapter(selected, failingStorage).register(registration(id));
    check(failed.status === "blocked" && failed.accountId === id, "hint failure was reported as success");
    check((await selected.read(id))?.revision === 1, "hint failure lost durable account");
    const retry = await new CleanEpochAccountAdapter(selected, new MemoryStorage()).signIn({ accountId: id,
      password: "secret password", stayLoggedIn: true });
    check(retry.status === "ready", "hint failure account could not recover by sign-in"); selected.close();
  });
  await test("simultaneous same-input registration converges on one retained identity", async () => {
    const dbName = name("same-source-race"); const id = createEpochAccountId();
    const first = await openCleanEpochAccountStore({ name: dbName });
    const second = await openCleanEpochAccountStore({ name: dbName });
    const results = await Promise.all([
      new CleanEpochAccountAdapter(first, new MemoryStorage()).register(registration(id)),
      new CleanEpochAccountAdapter(second, new MemoryStorage()).register(registration(id))
    ]);
    check(results.every(result => result.status === "ready" && result.value.account.revision === 1) &&
      (await first.list()).length === 1, "same-input race diverged or duplicated account");
    first.close(); second.close();
  });
  await test("closed database blocks adapter selection without an empty picker", async () => {
    const selected = await openCleanEpochAccountStore({ name: name("closed") });
    selected.close();
    const result = await new CleanEpochAccountAdapter(selected, new MemoryStorage()).selectSession();
    check(result.status === "blocked" && result.code === "unavailable", "closed owner became an empty picker");
  });
  await test("malformed retained account blocks hint and picker", async () => {
    const db = await rawOpen(databaseName);
    await rawPut(db, { version: 1, accountId, revision: 1, profile: { accountId }, credential: {} }); db.close();
    const picker = await adapter.selectSession();
    check(picker.status === "blocked" && picker.code === "invalid_record", "malformed account became picker entry");
    storage.setItem(CLEAN_EPOCH_SESSION_STORAGE_KEY, JSON.stringify({ version: 1, accountId, issuedAt: new Date().toISOString() }));
    const selected = await adapter.selectSession();
    check(selected.status === "blocked" && selected.code === "invalid_record", "malformed selected account was accepted");
  });
  owner.close();
}

suite().then(() => { output.textContent = `PASS ${cases.length}\n${cases.join("\n")}`; })
  .catch(error => { output.textContent = `FAIL after ${cases.length}: ${error instanceof Error ? error.stack : String(error)}`; });
