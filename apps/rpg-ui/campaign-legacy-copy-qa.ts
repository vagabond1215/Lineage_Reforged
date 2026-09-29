import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { CAMPAIGN_DATABASE_VERSION, openCampaignIndexedDbStore } from "./src/game-shell/campaignIndexedDbStore.ts";
import { stageLegacyCampaignCopy, type LegacyCopyFailureCode } from "./src/game-shell/legacyCampaignCopyStore.ts";

type Fixture = { raw: string; control: { accountId: string; campaignId: string; headArtifactId: string; headPublicationId: string; headRevision: number; previousHeadArtifactId: string | null; previousHeadPublicationId: string | null; closed: boolean; updatedAt: string; version: 1 }; witness?: Record<string, unknown> };
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
const name = () => `lineage.legacy-copy.qa.${crypto.randomUUID()}`;
const key = (account: string, suffix: string) => `cataclysm-rpg-ui.saves.v7.account.${account}.${suffix}`;
const profile = (accountId: string) => JSON.stringify(createDefaultAccountProfileState({ accountId, displayName: accountId }));
const env = (fixture: Fixture) => JSON.parse(fixture.raw) as { accountId: string; campaignId: string; slotId: string; artifactId: string; publicationId: string; generationId: string; headRevision: number; snapshot: string };
function ordinarySource(fixture: Fixture): MemoryStorage {
  const storage = new MemoryStorage(); const envelope = env(fixture);
  storage.setItem(key(envelope.accountId, `artifact.${envelope.artifactId}`), fixture.raw);
  storage.setItem(key(envelope.accountId, `slot.${envelope.slotId}`), fixture.raw);
  storage.setItem(key(envelope.accountId, `campaign.${envelope.campaignId}.control`), JSON.stringify(fixture.control));
  storage.setItem(`cataclysm-rpg-ui.accounts.v1.account.${envelope.accountId}`, profile(envelope.accountId));
  return storage;
}
async function test(label: string, run: () => Promise<void>) { await run(); passed.push(label); }
async function expectCode(run: () => Promise<unknown>, code: LegacyCopyFailureCode) {
  try { await run(); } catch (error) { check((error as { code?: string }).code === code, `${code} expected; got ${String(error)}`); return; }
  throw new Error(`${code} rejection expected`);
}
async function rawDb(dbName: string, version = CAMPAIGN_DATABASE_VERSION): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => { const op = indexedDB.open(dbName, version); op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); });
}
async function run() {
  const fixtures = await (await fetch("/.campaign-indexeddb-fixtures.json")).json() as { ordinary: Fixture; soundings: Fixture };
  await test("exact multi-account copy, no source writes, reopen and retry", async () => {
    const storage = ordinarySource(fixtures.ordinary);
    const account = env(fixtures.ordinary).accountId;
    storage.setItem("cataclysm-rpg-ui.accounts.v1.account.account.second", profile("account.second"));
    storage.setItem("cataclysm-rpg-ui.accounts.v1.active-account", account);
    storage.setItem("cataclysm-rpg-ui.auth.v1.credential.secret", "NEVER_COPY");
    storage.setItem("cataclysm-rpg.theme-mode", "dark");
    const before = [...Array(storage.length)].map((_, i) => [storage.key(i), storage.getItem(storage.key(i)!)]);
    const dbName = name();
    const first = await stageLegacyCampaignCopy({ storage, name: dbName });
    check(first.status === "committed" && first.manifest.status === "verified_with_blockers" && first.manifest.findings.some(finding => finding.code === "account_history_head_missing"), "missing account history not blocked");
    check(first.manifest.accountIds.length === 2 && first.records.length === before.length - 2, "multi-account count");
    check(!first.records.some(record => record.raw === "NEVER_COPY" || record.key.includes("theme-mode")), "launcher payload copied");
    check(JSON.stringify(before) === JSON.stringify([...Array(storage.length)].map((_, i) => [storage.key(i), storage.getItem(storage.key(i)!)])), "source changed");
    const retry = await stageLegacyCampaignCopy({ storage, name: dbName });
    check(retry.status === "same_source_retry" && retry.manifest.copyId === first.manifest.copyId, "same-source retry");
  });
  await test("profile-only source has a fully verified inert manifest", async () => {
    const storage = new MemoryStorage();
    storage.setItem("cataclysm-rpg-ui.accounts.v1.account.account.empty", profile("account.empty"));
    const result = await stageLegacyCampaignCopy({ storage, name: name() });
    check(result.manifest.status === "verified" && result.manifest.findings.length === 0, "profile-only exact copy blocked");
  });
  await test("unknown, malformed, obsolete and v6 evidence remain exact with blockers", async () => {
    const storage = ordinarySource(fixtures.ordinary);
    storage.setItem("cataclysm-rpg-ui.saves.v7.account.a.future.family", "{broken");
    storage.setItem("cataclysm-rpg-ui.saves.v6.account.a.slot.quick-save", "{legacy");
    storage.setItem("cataclysm-rpg-ui.save-slot.old", "\ud800");
    const result = await stageLegacyCampaignCopy({ storage, name: name() });
    check(result.manifest.status === "verified_with_blockers", "blocker posture");
    check(result.records.some(record => record.raw === "\ud800") && result.records.some(record => record.raw === "{broken"), "raw evidence lost");
    check(result.manifest.findings.some(finding => finding.code === "unknown_or_invalid_v7"), "unknown blocker missing");
  });
  await test("non-head slot and fork history preserve every exact artifact", async () => {
    const storage = ordinarySource(fixtures.ordinary); const head = env(fixtures.ordinary);
    const former = { ...head, slotId: "manual-2", metadata: { ...JSON.parse(fixtures.ordinary.raw).metadata, slotId: "manual-2" }, artifactId: `${head.artifactId}.former`, generationId: `${head.generationId}.former`, publicationId: `${head.publicationId}.former` };
    const formerRaw = JSON.stringify(former);
    storage.setItem(key(head.accountId, `artifact.${former.artifactId}`), formerRaw);
    storage.setItem(key(head.accountId, "slot.manual-2"), formerRaw);
    const result = await stageLegacyCampaignCopy({ storage, name: name() });
    check(result.records.filter(record => record.family === "artifact").length === 2, "historical artifact lost");
    check(!result.manifest.findings.some(finding => finding.code.startsWith("slot_artifact")), "non-head slot rejected");
  });
  await test("Soundings applied witness and independent first artifact verify", async () => {
    const storage = ordinarySource(fixtures.soundings); const envelope = env(fixtures.soundings); const witness = fixtures.soundings.witness!;
    const witnessKey = key(envelope.accountId, `campaign.${envelope.campaignId}.soundings-witness.${witness.requestId}`);
    storage.setItem(witnessKey, JSON.stringify(witness));
    const clean = await stageLegacyCampaignCopy({ storage, name: name() });
    check(!clean.manifest.findings.some(finding => finding.code.startsWith("soundings_")), JSON.stringify(clean.manifest.findings));
    storage.removeItem(key(envelope.accountId, `artifact.${envelope.artifactId}`));
    const broken = await stageLegacyCampaignCopy({ storage, name: name() });
    check(broken.manifest.findings.some(finding => finding.code === "soundings_first_artifact_invalid"), "missing first artifact accepted");
  });
  await test("pending cross-campaign recoveries and unfinished attempt block", async () => {
    const storage = ordinarySource(fixtures.ordinary); const envelope = env(fixtures.ordinary);
    for (const campaignId of [envelope.campaignId, `${envelope.campaignId}.other`]) {
      const recovery = { version: 1, accountId: envelope.accountId, campaignId, slotId: envelope.slotId, artifactId: envelope.artifactId,
        generationId: envelope.generationId, publicationId: envelope.publicationId, headRevision: envelope.headRevision, terminal: false,
        envelopeRaw: fixtures.ordinary.raw, status: "head_verified", consumerPlans: [], completedConsumerKinds: [], createdAt: "2026-09-29", updatedAt: "2026-09-29" };
      storage.setItem(key(envelope.accountId, `campaign.${campaignId}.publication-recovery`), JSON.stringify(recovery));
    }
    const attempt = { version: 1, accountId: envelope.accountId, slotId: envelope.slotId, attemptId: "attempt.one", inputFingerprint: "same", snapshotRaw: envelope.snapshot, consumerPlans: [], createdAt: "2026-09-29" };
    storage.setItem(`cataclysm-rpg-ui.new-campaign-attempts.v1.account.${envelope.accountId}.slot.${envelope.slotId}`, JSON.stringify(attempt));
    const result = await stageLegacyCampaignCopy({ storage, name: name() });
    check(result.manifest.findings.some(finding => finding.code === "competing_slot_recoveries"), "cross-campaign contention missed");
    check(result.manifest.findings.some(finding => finding.code === "pending_attempt"), "attempt missed");
  });
  await test("source changes before and during staging fail closed", async () => {
    const storage = ordinarySource(fixtures.ordinary);
    await expectCode(() => stageLegacyCampaignCopy({ storage, name: name(), afterCapture: pass => { if (pass === "first") storage.setItem("cataclysm-rpg-ui.accounts.v1.active-account", "changed"); } }), "source_changed");
    const stagedName = name();
    await expectCode(() => stageLegacyCampaignCopy({ storage, name: stagedName, afterCapture: pass => { if (pass === "staged") storage.setItem("cataclysm-rpg-ui.accounts.v1.active-account", "newer"); } }), "source_changed");
    const db = await rawDb(stagedName); const tx = db.transaction("legacyCopyManifests", "readonly"); const op = tx.objectStore("legacyCopyManifests").getAll();
    const manifests = await new Promise<{ status: string }[]>((resolve, reject) => { op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); });
    check(manifests.length === 1 && manifests[0]?.status === "stale", "stale generation not retained"); db.close();
  });
  await test("changed source creates a distinct generation", async () => {
    const storage = ordinarySource(fixtures.ordinary); const dbName = name();
    const first = await stageLegacyCampaignCopy({ storage, name: dbName });
    storage.setItem("cataclysm-rpg-ui.accounts.v1.active-account", env(fixtures.ordinary).accountId);
    const second = await stageLegacyCampaignCopy({ storage, name: dbName });
    check(first.manifest.copyId !== second.manifest.copyId && second.status === "committed", "changed source overwrote old copy");
  });
  await test("provisional crash resumes the exact same generation", async () => {
    const storage = ordinarySource(fixtures.ordinary); const dbName = name();
    await expectCode(() => stageLegacyCampaignCopy({ storage, name: dbName, afterCapture: pass => { if (pass === "staged") throw new Error("simulated interruption"); } }), "aborted");
    const resumed = await stageLegacyCampaignCopy({ storage, name: dbName });
    check(resumed.status === "same_source_retry" && resumed.manifest.status === "verified_with_blockers", "provisional copy did not resume");
  });
  await test("concurrent same-source tabs leave one exact generation", async () => {
    const storage = ordinarySource(fixtures.ordinary); const dbName = name();
    const outcomes = await Promise.allSettled([stageLegacyCampaignCopy({ storage, name: dbName }), stageLegacyCampaignCopy({ storage, name: dbName })]);
    check(outcomes.some(outcome => outcome.status === "fulfilled"), "both tabs failed");
    const final = await stageLegacyCampaignCopy({ storage, name: dbName });
    check(final.status === "same_source_retry" && final.manifest.status === "verified_with_blockers", "concurrent copy corrupted manifest");
  });
  await test("abort and injected quota leave no verified generation", async () => {
    for (const kind of ["aborted", "quota"] as const) {
      const storage = ordinarySource(fixtures.ordinary); const dbName = name();
      await expectCode(() => stageLegacyCampaignCopy({ storage, name: dbName, afterWrite: (family, tx) => { if (family === "record" && kind === "aborted") tx.abort(); },
        beforeWrite: family => { if (family === "manifest" && kind === "quota") throw new DOMException("quota", "QuotaExceededError"); } }), kind);
      const db = await rawDb(dbName); const tx = db.transaction("legacyCopyManifests", "readonly"); const op = tx.objectStore("legacyCopyManifests").getAll();
      check((await new Promise<unknown[]>((resolve, reject) => { op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error); })).length === 0, "partial manifest"); db.close();
    }
  });
  await test("blocked v1 upgrade fails closed and preserves connection", async () => {
    const dbName = name();
    const v1 = await new Promise<IDBDatabase>((resolve, reject) => {
      const op = indexedDB.open(dbName, 1);
      op.onupgradeneeded = () => { for (const family of ["artifacts", "controls", "slots", "witnesses"]) op.result.createObjectStore(family, { keyPath: "id" }); };
      op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error);
    });
    await expectCode(() => stageLegacyCampaignCopy({ storage: ordinarySource(fixtures.ordinary), name: dbName }), "blocked_upgrade");
    check(v1.version === 1, "v1 connection changed"); v1.close();
  });
  await test("unavailable IndexedDB fails without touching source", async () => {
    const storage = ordinarySource(fixtures.ordinary);
    const before = storage.length;
    await expectCode(() => stageLegacyCampaignCopy({ storage, name: name(), factory: { open: () => { throw new Error("unavailable"); } } as unknown as IDBFactory }), "unavailable");
    check(storage.length === before, "unavailable storage changed source");
  });
  await test("existing v1 records survive the additive v2 upgrade", async () => {
    const dbName = name(); const fixture = fixtures.ordinary; const envelope = env(fixture);
    const v1 = await new Promise<IDBDatabase>((resolve, reject) => {
      const op = indexedDB.open(dbName, 1);
      op.onupgradeneeded = () => {
        for (const [family, path] of [["artifacts", ["accountId", "artifactId"]], ["controls", ["accountId", "campaignId"]],
          ["slots", ["accountId", "slotId"]], ["witnesses", ["accountId", "campaignId", "requestId"]]] as const) {
          const store = op.result.createObjectStore(family, { keyPath: [...path] });
          store.createIndex("byAccountCampaign", ["accountId", "campaignId"], { unique: false });
        }
      };
      op.onsuccess = () => resolve(op.result); op.onerror = () => reject(op.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = v1.transaction(["artifacts", "controls", "slots"], "readwrite");
      tx.objectStore("artifacts").add({ version: 1, accountId: envelope.accountId, campaignId: envelope.campaignId, artifactId: envelope.artifactId,
        generationId: envelope.generationId, publicationId: envelope.publicationId, slotId: envelope.slotId, headRevision: envelope.headRevision, raw: fixture.raw });
      tx.objectStore("controls").add({ version: 1, accountId: envelope.accountId, campaignId: envelope.campaignId, value: fixture.control });
      tx.objectStore("slots").add({ version: 1, accountId: envelope.accountId, campaignId: envelope.campaignId, slotId: envelope.slotId,
        artifactId: envelope.artifactId, publicationId: envelope.publicationId, raw: fixture.raw });
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error);
    });
    v1.close();
    const result = await stageLegacyCampaignCopy({ storage: ordinarySource(fixture), name: dbName });
    check(result.manifest.findings.some(finding => finding.code === "existing_v1_authority_requires_reconciliation"), "v1 overlap not quarantined");
    const upgraded = await openCampaignIndexedDbStore({ name: dbName });
    check((await upgraded.read(envelope.accountId, envelope.campaignId, envelope.slotId))?.artifactRaw === fixture.raw, "v1 head changed by upgrade"); upgraded.close();
  });
  await test("v1 publication still works after v2 staging, and overlap is a blocker", async () => {
    const storage = ordinarySource(fixtures.ordinary); const dbName = name();
    await stageLegacyCampaignCopy({ storage, name: dbName });
    const fixture = fixtures.ordinary; const envelope = env(fixture);
    const store = await openCampaignIndexedDbStore({ name: dbName });
    const input = { accountId: envelope.accountId, campaignId: envelope.campaignId, slotId: envelope.slotId, expectedHead: null, artifactRaw: fixture.raw, control: fixture.control };
    check((await store.publish(input)).status === "committed", "v1 publication changed"); store.close();
    await expectCode(() => stageLegacyCampaignCopy({ storage, name: dbName }), "conflict");
  });
  output.textContent = `PASS ${passed.length}\n${passed.join("\n")}`;
}
run().catch(error => { output.textContent = `FAIL after ${passed.length}\n${String(error)}\n${(error as Error).stack ?? ""}`; });
