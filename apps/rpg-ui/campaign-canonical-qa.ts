import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { CAMPAIGN_DATABASE_VERSION, CANONICAL_MANIFEST_STORE, CANONICAL_RECORD_STORE, openCampaignIndexedDbStore } from "./src/game-shell/campaignIndexedDbStore.ts";
import { materializeLegacyCanonical, type CanonicalMaterializationFailureCode } from "./src/game-shell/legacyCanonicalMaterializationStore.ts";
import { stageLegacyCampaignCopy } from "./src/game-shell/legacyCampaignCopyStore.ts";

type Fixture = { raw: string; control: Record<string, unknown>; witness?: Record<string, unknown> };
class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(String(key), String(value)); }
}
const output = document.querySelector<HTMLPreElement>("#result")!;
const passed: string[] = [];
const check = (value: unknown, message: string) => { if (!value) throw new Error(message); };
const name = () => `lineage.canonical.qa.${crypto.randomUUID()}`;
const key = (account: string, suffix: string) => `cataclysm-rpg-ui.saves.v7.account.${account}.${suffix}`;
const profile = (accountId: string) => JSON.stringify(createDefaultAccountProfileState({ accountId, displayName: accountId }));
const env = (fixture: Fixture) => JSON.parse(fixture.raw) as { accountId: string; campaignId: string; slotId: string; artifactId: string; publicationId: string; generationId: string; headRevision: number; snapshot: string; metadata: Record<string, unknown> };
const entries = (storage: Storage) => [...Array(storage.length)].map((_, i) => [storage.key(i), storage.getItem(storage.key(i)!)]);
function ordinarySource(fixture: Fixture): MemoryStorage {
  const storage = new MemoryStorage(); const envelope = env(fixture);
  storage.setItem(key(envelope.accountId, `artifact.${envelope.artifactId}`), fixture.raw);
  storage.setItem(key(envelope.accountId, `slot.${envelope.slotId}`), fixture.raw);
  storage.setItem(key(envelope.accountId, `campaign.${envelope.campaignId}.control`), JSON.stringify(fixture.control));
  storage.setItem(`cataclysm-rpg-ui.accounts.v1.account.${envelope.accountId}`, profile(envelope.accountId));
  return storage;
}
async function test(label: string, run: () => Promise<void>) { await run(); passed.push(label); }
async function expectCode(run: () => Promise<unknown>, code: CanonicalMaterializationFailureCode) {
  try { await run(); } catch (error) { check((error as { code?: string }).code === code, `${code} expected; got ${String(error)}`); return; }
  throw new Error(`${code} rejection expected`);
}
async function rawDb(dbName: string, version = CAMPAIGN_DATABASE_VERSION): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => { const op = indexedDB.open(dbName, version); op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); });
}
async function rows<T>(db: IDBDatabase, store: string): Promise<T[]> {
  const op = db.transaction(store, "readonly").objectStore(store).getAll();
  return new Promise((resolve, reject) => { op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); });
}
async function run() {
  const fixtures = await (await fetch("/.campaign-indexeddb-fixtures.json")).json() as { ordinary: Fixture; soundings: Fixture };
  await test("byte-exact account and unscoped records; no source or auth mutation", async () => {
    const storage = ordinarySource(fixtures.ordinary); const account = env(fixtures.ordinary).accountId;
    storage.setItem("cataclysm-rpg-ui.accounts.v1.account.account.second", profile("account.second"));
    storage.setItem("cataclysm-rpg-ui.save-slot.old", "\ud800");
    storage.setItem("cataclysm-rpg-ui.auth.v1.credential.secret", "NEVER_COPY");
    const before = JSON.stringify(entries(storage)); const dbName = name();
    const first = await materializeLegacyCanonical({ storage, name: dbName });
    check(first.status === "committed" && first.records.length === storage.length - 1, "record count");
    check(first.records.some(record => record.raw === "\ud800" && record.family === "quarantine" && record.scopeKind === "origin_unscoped"), "unscoped raw missing");
    check(first.records.some(record => record.family === "artifact" && record.scopeKind === "account" && record.scopeId === account), "account artifact missing");
    check(first.manifests.some(manifest => manifest.scopeId === "account.second" && manifest.status === "blocked"), "profile-only account not verified");
    check(!first.records.some(record => record.raw === "NEVER_COPY"), "credential copied");
    check(JSON.stringify(entries(storage)) === before, "source mutated");
    const db = await rawDb(dbName); check((await rows(db, CANONICAL_RECORD_STORE)).length === first.records.length, "reopen count"); db.close();
    const retry = await materializeLegacyCanonical({ storage, name: dbName });
    check(retry.status === "same_source_retry" && retry.copyId === first.copyId, "same-source retry");
  });
  await test("profile-only generation is verified and has no playable selector", async () => {
    const storage = new MemoryStorage(); storage.setItem("cataclysm-rpg-ui.accounts.v1.account.empty", profile("empty"));
    const dbName = name(); const result = await materializeLegacyCanonical({ storage, name: dbName });
    check(result.manifests.every(manifest => manifest.status === "verified"), "profile-only blocked");
    const db = await rawDb(dbName); check(!db.objectStoreNames.contains("authoritySelections"), "activation store appeared"); db.close();
  });
  await test("non-head fork artifact and slot retain separate identities", async () => {
    const storage = ordinarySource(fixtures.ordinary); const head = env(fixtures.ordinary);
    const former = { ...head, slotId: "manual-2", metadata: { ...head.metadata, slotId: "manual-2" }, artifactId: `${head.artifactId}.former`, generationId: `${head.generationId}.former`, publicationId: `${head.publicationId}.former` };
    const raw = JSON.stringify(former);
    storage.setItem(key(head.accountId, `artifact.${former.artifactId}`), raw);
    storage.setItem(key(head.accountId, "slot.manual-2"), raw);
    const result = await materializeLegacyCanonical({ storage, name: name() });
    check(result.records.filter(record => record.family === "artifact").length === 2 && result.records.filter(record => record.family === "slot").length === 2, "non-head history lost");
    check(result.records.some(record => record.raw === raw && record.identity === former.artifactId), "fork identity changed");
  });
  await test("Soundings first artifact and witness stay independent", async () => {
    const storage = ordinarySource(fixtures.soundings); const envelope = env(fixtures.soundings); const witness = fixtures.soundings.witness!;
    storage.setItem(key(envelope.accountId, `campaign.${envelope.campaignId}.soundings-witness.${witness.requestId}`), JSON.stringify(witness));
    const valid = await materializeLegacyCanonical({ storage, name: name() });
    check(valid.records.some(record => record.family === "witness") && valid.records.some(record => record.family === "artifact"), "first evidence missing");
    check(!valid.manifests.some(manifest => manifest.findings.some(finding => finding.code === "soundings_first_artifact_invalid")), "first evidence falsely invalid");
    storage.removeItem(key(envelope.accountId, `artifact.${envelope.artifactId}`));
    const broken = await materializeLegacyCanonical({ storage, name: name() });
    check(broken.manifests.some(manifest => manifest.findings.some(finding => finding.code === "soundings_first_artifact_invalid")), "missing first accepted");
  });
  await test("v6, migration source, receipt, candidates, attempts and recovery remain blocked", async () => {
    const storage = ordinarySource(fixtures.ordinary); const e = env(fixtures.ordinary);
    const v6 = JSON.stringify({ version: 6, accountId: e.accountId, slotId: e.slotId, savedAt: "2026-09-29", metadata: e.metadata, snapshot: e.snapshot });
    storage.setItem(`cataclysm-rpg-ui.saves.v6.account.${e.accountId}.slot.${e.slotId}`, v6);
    storage.setItem(key(e.accountId, `migration-source.person.${e.slotId}`), v6);
    storage.setItem(key(e.accountId, "migration.person"), JSON.stringify({ version: 1, accountId: e.accountId, legacyCharacterId: "person" }));
    storage.setItem(key(e.accountId, `candidate.${e.generationId}`), fixtures.ordinary.raw);
    storage.setItem(key(e.accountId, `campaign.${e.campaignId}.publication-recovery`), JSON.stringify({ version: 1, accountId: e.accountId, campaignId: e.campaignId, slotId: e.slotId, artifactId: e.artifactId, generationId: e.generationId, publicationId: e.publicationId, headRevision: e.headRevision, terminal: false, envelopeRaw: fixtures.ordinary.raw, status: "head_verified", consumerPlans: [], completedConsumerKinds: [], createdAt: "2026-09-29", updatedAt: "2026-09-29" }));
    storage.setItem(`cataclysm-rpg-ui.new-campaign-attempts.v1.account.${e.accountId}.slot.${e.slotId}`, JSON.stringify({ version: 1, accountId: e.accountId, slotId: e.slotId, attemptId: "attempt", inputFingerprint: "same", snapshotRaw: e.snapshot, consumerPlans: [], createdAt: "2026-09-29" }));
    const result = await materializeLegacyCanonical({ storage, name: name() });
    for (const family of ["v6_slot", "migration_source", "migration_receipt", "candidate", "recovery", "attempt"]) check(result.records.some(record => record.family === family), `${family} lost`);
    check(result.manifests.some(manifest => manifest.scopeId === e.accountId && manifest.status === "blocked"), "pending authority playable");
  });
  await test("malformed and unknown source quarantine raw bytes", async () => {
    const storage = ordinarySource(fixtures.ordinary);
    storage.setItem("cataclysm-rpg-ui.saves.v7.account.future.record", "{broken");
    const result = await materializeLegacyCanonical({ storage, name: name() });
    check(result.records.some(record => record.family === "quarantine" && record.raw === "{broken"), "malformed raw lost");
    check(result.manifests.every(manifest => manifest.status === "blocked"), "unknown source allowed activation");
  });
  await test("profile consumer receipts retain exact raw and block missing publication", async () => {
    const storage = new MemoryStorage(); const accountId = "account.receipt";
    const value = createDefaultAccountProfileState({ accountId, displayName: accountId });
    value.campaignPublicationReceipts = [{ consumerId: "receipt.one", publicationId: "publication.absent", campaignId: "campaign.absent", continuityId: "continuity.absent", characterId: "character.absent", kind: "active_history", payloadFingerprint: "fingerprint", status: "pending", createdAt: "2026-09-29" }];
    const raw = JSON.stringify(value);
    storage.setItem(`cataclysm-rpg-ui.accounts.v1.account.${accountId}`, raw);
    const result = await materializeLegacyCanonical({ storage, name: name() });
    check(result.records.some(record => record.family === "profile" && record.raw === raw), "nested receipt changed");
    check(result.manifests.some(manifest => manifest.scopeId === accountId && manifest.findings.some(finding => finding.code === "account_receipt_publication_missing") && manifest.status === "blocked"), "orphan consumer accepted");
  });
  await test("concurrent same-source attempts converge on one exact generation", async () => {
    const storage = ordinarySource(fixtures.ordinary); const dbName = name();
    const outcomes = await Promise.allSettled([materializeLegacyCanonical({ storage, name: dbName }), materializeLegacyCanonical({ storage, name: dbName })]);
    check(outcomes.some(outcome => outcome.status === "fulfilled"), "both attempts failed");
    const final = await materializeLegacyCanonical({ storage, name: dbName });
    const db = await rawDb(dbName); const stored = await rows<{ copyId: string; originalKey: string }>(db, CANONICAL_RECORD_STORE); db.close();
    check(stored.length === final.records.length && new Set(stored.map(record => `${record.copyId}:${record.originalKey}`)).size === stored.length, "concurrent duplicate or missing record");
  });
  await test("changed source creates a distinct inert generation", async () => {
    const storage = ordinarySource(fixtures.ordinary); const dbName = name();
    const first = await materializeLegacyCanonical({ storage, name: dbName });
    storage.setItem("cataclysm-rpg-ui.accounts.v1.active-account", env(fixtures.ordinary).accountId);
    const second = await materializeLegacyCanonical({ storage, name: dbName });
    check(first.copyId !== second.copyId && second.status === "committed", "generation overwritten");
  });
  await test("source mutation after provisional commit fails closed", async () => {
    const storage = ordinarySource(fixtures.ordinary); const dbName = name();
    await expectCode(() => materializeLegacyCanonical({ storage, name: dbName, afterCommit: () => storage.setItem("cataclysm-rpg-ui.accounts.v1.active-account", "new") }), "source_changed");
    const db = await rawDb(dbName); const manifests = await rows<{ status: string }>(db, CANONICAL_MANIFEST_STORE);
    check(manifests.length > 0 && manifests.every(manifest => manifest.status === "provisional"), "source change promoted generation"); db.close();
  });
  await test("interrupted provisional generation resumes exactly", async () => {
    const storage = ordinarySource(fixtures.ordinary); const dbName = name();
    await expectCode(() => materializeLegacyCanonical({ storage, name: dbName, afterCommit: () => { throw new Error("interrupted"); } }), "aborted");
    const resumed = await materializeLegacyCanonical({ storage, name: dbName });
    check(resumed.status === "same_source_retry" && resumed.manifests.every(manifest => manifest.status === "blocked" || manifest.status === "verified"), "provisional not resumed");
  });
  await test("abort and quota keep source and canonical manifest intact", async () => {
    for (const kind of ["aborted", "quota"] as const) {
      const storage = ordinarySource(fixtures.ordinary); const dbName = name(); const before = JSON.stringify(entries(storage));
      await expectCode(() => materializeLegacyCanonical({ storage, name: dbName, afterWrite: (family, tx) => { if (family === "record" && kind === "aborted") tx.abort(); }, beforeWrite: family => { if (family === "manifest" && kind === "quota") throw new DOMException("quota", "QuotaExceededError"); } }), kind);
      const db = await rawDb(dbName); check((await rows(db, CANONICAL_MANIFEST_STORE)).length === 0, "partial canonical manifest"); db.close();
      check(JSON.stringify(entries(storage)) === before, "source changed on failed canonical write");
    }
  });
  await test("existing v1 overlap blocks without altering v1 head", async () => {
    const storage = ordinarySource(fixtures.ordinary); const dbName = name(); const e = env(fixtures.ordinary);
    const store = await openCampaignIndexedDbStore({ name: dbName });
    check((await store.publish({ accountId: e.accountId, campaignId: e.campaignId, slotId: e.slotId, expectedHead: null, artifactRaw: fixtures.ordinary.raw, control: fixtures.ordinary.control as never })).status === "committed", "v1 seed failed"); store.close();
    const result = await materializeLegacyCanonical({ storage, name: dbName });
    check(result.manifests.some(manifest => manifest.scopeId === e.accountId && manifest.existingV1Overlap && manifest.status === "blocked"), "v1 overlap accepted");
    const reader = await openCampaignIndexedDbStore({ name: dbName }); check((await reader.read(e.accountId, e.campaignId, e.slotId))?.artifactRaw === fixtures.ordinary.raw, "v1 head changed"); reader.close();
  });
  await test("blocked upgrade and unavailable factory fail closed", async () => {
    const storage = ordinarySource(fixtures.ordinary); const dbName = name();
    const holder = await rawDb(dbName);
    await expectCode(() => materializeLegacyCanonical({ storage, name: dbName, factory: { open: () => indexedDB.open(dbName, CAMPAIGN_DATABASE_VERSION + 1) } as IDBFactory }), "blocked_upgrade"); holder.close();
    await expectCode(() => materializeLegacyCanonical({ storage, name: name(), factory: { open: () => { throw new Error("unavailable"); } } as unknown as IDBFactory }), "unavailable");
  });
  output.textContent = `PASS ${passed.length}\n${passed.join("\n")}`;
}
run().catch(error => { output.textContent = `FAIL after ${passed.length}\n${String(error)}\n${(error as Error).stack ?? ""}`; });
