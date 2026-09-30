import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { CAMPAIGN_DATABASE_NAME, CampaignIndexedDbStore, ensureCampaignPublicationStores, type CampaignStoreFailureCode, type CampaignStorePublication } from "./src/game-shell/campaignIndexedDbStore.ts";
import {
  CLEAN_EPOCH_ACCOUNT_STORE,
  CLEAN_EPOCH_ATTEMPT_STORE,
  CLEAN_EPOCH_RECOVERY_STORE,
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
function rawPutFamily(db: IDBDatabase, family: string, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => { const tx = db.transaction(family, "readwrite");
    tx.objectStore(family).put(value); tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
}
function rawDeleteFamily(db: IDBDatabase, family: string, key: IDBValidKey): Promise<void> {
  return new Promise((resolve, reject) => { const tx = db.transaction(family, "readwrite");
    tx.objectStore(family).delete(key); tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
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
    for (const family of ["accounts", "newCampaignAttempts", "pendingPublicationRecoveries", "artifacts", "controls", "slots", "witnesses"]) check(db.objectStoreNames.contains(family), `missing ${family}`);
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
  await test("version-one account upgrades without losing its profile or credential", async () => {
    const databaseName = name("upgrade");
    const old = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(CLEAN_EPOCH_ACCOUNT_STORE, { keyPath: "accountId" });
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    await rawPut(old, { version: 1, accountId, revision: 1, profile, credential: verifier }); old.close();
    const owner = await openCleanEpochAccountStore({ name: databaseName });
    check((await owner.read(accountId))?.credential.derivedKeyBase64 === verifier.derivedKeyBase64, "account lost on schema upgrade");
    check(await owner.readAttempt(accountId, "slot-1") === null, "upgrade invented attempt"); owner.close();
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

  const fixtures = await (await fetch("/.campaign-indexeddb-fixtures.json")).json() as {
    ordinary: { raw: string; control: CampaignStorePublication["control"] };
    soundings: { raw: string; control: CampaignStorePublication["control"]; witness: NonNullable<CampaignStorePublication["witness"]> };
  };
  const envelope = JSON.parse(fixtures.ordinary.raw);
  const snapshot = JSON.parse(envelope.snapshot);
  snapshot.accountId = accountId;
  snapshot.campaignRules.source = "new_campaign";
  const attempt = {
    version: 1 as const, status: "prepared" as const, accountId, slotId: "slot-1",
    campaignId: snapshot.campaignIdentity.campaignId, attemptId: `attempt.${crypto.randomUUID()}`,
    expectedAccountRevision: 1, expectedHead: null, inputFingerprint: "normalized-new-campaign-input",
    snapshotRaw: JSON.stringify(snapshot), consumerPlans: [{ kind: "active_history" as const, payloadFingerprint: "history-fingerprint" }],
    createdAt: "2026-09-29T00:00:00.000Z"
  };
  envelope.accountId = accountId;
  envelope.snapshot = attempt.snapshotRaw;
  const firstPublication: CampaignStorePublication = {
    accountId, campaignId: attempt.campaignId, slotId: attempt.slotId, expectedHead: null,
    artifactRaw: JSON.stringify(envelope), control: { ...fixtures.ordinary.control, accountId }
  };
  await test("version-two prepared attempt upgrades with exact account and attempt", async () => {
    const databaseName = name("upgrade-v2");
    const old = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(databaseName, 2);
      request.onupgradeneeded = () => {
        ensureCampaignPublicationStores(request.result);
        request.result.createObjectStore(CLEAN_EPOCH_ACCOUNT_STORE, { keyPath: "accountId" });
        request.result.createObjectStore(CLEAN_EPOCH_ATTEMPT_STORE, { keyPath: ["accountId", "slotId"] });
      };
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    await rawPut(old, { version: 1, accountId, revision: 1, profile, credential: verifier });
    await rawPutFamily(old, CLEAN_EPOCH_ATTEMPT_STORE, attempt); old.close();
    const owner = await openCleanEpochAccountStore({ name: databaseName });
    check((await owner.read(accountId))?.revision === 1 && (await owner.readAttempt(accountId, attempt.slotId))?.attemptId === attempt.attemptId,
      "v2 upgrade lost account or attempt");
    check(await owner.readRecovery(accountId, attempt.slotId) === null, "v2 upgrade invented recovery"); owner.close();
  });
  await test("account-slot reservation, exact retry, restart and lost caller read", async () => {
    const databaseName = name("attempt"); let owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier);
    check((await owner.prepareAttempt(attempt)).status === "committed", "attempt not committed");
    check((await owner.prepareAttempt(attempt)).status === "same_source_retry", "attempt retry failed");
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName });
    check((await owner.readAttempt(accountId, attempt.slotId))?.attemptId === attempt.attemptId, "lost caller identity not recovered");
    owner.close();
  });
  await test("regenerated attempt and second campaign cannot replace pending slot", async () => {
    const owner = await openCleanEpochAccountStore({ name: name("contention") }); await owner.register(profile, verifier);
    await owner.prepareAttempt(attempt);
    await expectCode(() => owner.prepareAttempt({ ...attempt, attemptId: `attempt.${crypto.randomUUID()}` }), "conflict");
    const otherSnapshot = { ...snapshot, campaignIdentity: { ...snapshot.campaignIdentity, campaignId: `campaign.${crypto.randomUUID()}` } };
    await expectCode(() => owner.prepareAttempt({ ...attempt, campaignId: otherSnapshot.campaignIdentity.campaignId,
      attemptId: `attempt.${crypto.randomUUID()}`, snapshotRaw: JSON.stringify(otherSnapshot) }), "conflict");
    check((await owner.readAttempt(accountId, attempt.slotId))?.attemptId === attempt.attemptId, "contention changed reservation"); owner.close();
  });
  await test("concurrent account-slot reservations have one exact winner", async () => {
    const databaseName = name("attempt-concurrent");
    const first = await openCleanEpochAccountStore({ name: databaseName }); await first.register(profile, verifier);
    const second = await openCleanEpochAccountStore({ name: databaseName });
    const competing = { ...attempt, attemptId: `attempt.${crypto.randomUUID()}` };
    const results = await Promise.allSettled([first.prepareAttempt(attempt), second.prepareAttempt(competing)]);
    check(results.filter(result => result.status === "fulfilled").length === 1, "concurrent attempts had multiple winners");
    check((results.find(result => result.status === "rejected") as PromiseRejectedResult)?.reason?.code === "conflict", "loser did not conflict");
    check([attempt.attemptId, competing.attemptId].includes((await first.readAttempt(accountId, attempt.slotId))?.attemptId ?? ""), "winner changed");
    first.close(); second.close();
  });
  await test("invalid snapshot and duplicate consumer plans never reserve a slot", async () => {
    const owner = await openCleanEpochAccountStore({ name: name("attempt-invalid") }); await owner.register(profile, verifier);
    await expectCode(() => owner.prepareAttempt({ ...attempt, snapshotRaw: "{" }), "invalid_record");
    await expectCode(() => owner.prepareAttempt({ ...attempt, campaignId: "wrong.campaign" }), "invalid_record");
    await expectCode(() => owner.prepareAttempt({ ...attempt, consumerPlans: [attempt.consumerPlans[0], attempt.consumerPlans[0]] }), "invalid_record");
    check(await owner.readAttempt(accountId, attempt.slotId) === null, "invalid candidate reserved slot"); owner.close();
  });
  await test("missing or stale account and occupied publication destination block reservation", async () => {
    const databaseName = name("authority"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await expectCode(() => owner.prepareAttempt(attempt), "invalid_record"); await owner.register(profile, verifier);
    await expectCode(() => owner.prepareAttempt({ ...attempt, expectedAccountRevision: 2 }), "stale_head");
    const db = await rawOpen(databaseName);
    await rawPutFamily(db, "slots", { version: 1, accountId, slotId: attempt.slotId, campaignId: "occupied", artifactId: "a", publicationId: "p", raw: "occupied" });
    await expectCode(() => owner.prepareAttempt(attempt), "conflict");
    db.close(); owner.close();
  });
  await test("abort and quota leave no partial attempt", async () => {
    for (const code of ["aborted", "quota"] as const) {
      const databaseName = name(`attempt-${code}`); const first = await openCleanEpochAccountStore({ name: databaseName });
      await first.register(profile, verifier); first.close();
      const failing = await openCleanEpochAccountStore({ name: databaseName,
        beforeWrite: () => { if (code === "quota") throw new DOMException("quota", "QuotaExceededError"); },
        afterWrite: tx => { if (code === "aborted") tx.abort(); } });
      await expectCode(() => failing.prepareAttempt(attempt), code); failing.close();
      const reopened = await openCleanEpochAccountStore({ name: databaseName });
      check(await reopened.readAttempt(accountId, attempt.slotId) === null, `${code} retained attempt`); reopened.close();
    }
  });
  await test("malformed retained attempt and account block retry", async () => {
    const databaseName = name("attempt-malformed"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    const db = await rawOpen(databaseName);
    await rawPutFamily(db, CLEAN_EPOCH_ATTEMPT_STORE, { ...attempt, consumerPlans: [{ kind: "unknown", payloadFingerprint: "x" }] });
    await expectCode(() => owner.readAttempt(accountId, attempt.slotId), "invalid_record");
    await expectCode(() => owner.prepareAttempt(attempt), "invalid_record");
    await rawPut(db, { version: 1, accountId, revision: 1, profile: { accountId }, credential: verifier });
    await expectCode(() => owner.prepareAttempt(attempt), "invalid_record"); db.close(); owner.close();
  });
  await test("first publication, pending recovery, exact retry and restart", async () => {
    const databaseName = name("first-publication"); let owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    const accepted = await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    check(accepted.publication.status === "committed" && accepted.recovery.status === "accepted_pending_consumers", "first publication not accepted pending consumers");
    check(accepted.recovery.completedConsumerKinds.length === 0, "consumers falsely completed");
    check((await owner.publishPreparedAttempt(attempt.attemptId, firstPublication)).publication.status === "same_source_retry", "publication retry failed");
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName });
    check((await owner.readRecovery(accountId, attempt.slotId))?.attemptId === attempt.attemptId, "lost caller recovery missing");
    await expectCode(() => owner.prepareAttempt({ ...attempt, attemptId: `attempt.${crypto.randomUUID()}` }), "conflict"); owner.close();
  });
  await test("first publication rejects missing, stale and mismatched attempt authority", async () => {
    const owner = await openCleanEpochAccountStore({ name: name("publication-input") }); await owner.register(profile, verifier);
    await expectCode(() => owner.publishPreparedAttempt(attempt.attemptId, firstPublication), "invalid_record");
    await owner.prepareAttempt(attempt);
    await expectCode(() => owner.publishPreparedAttempt("attempt.regenerated", firstPublication), "conflict");
    await expectCode(() => owner.publishPreparedAttempt(attempt.attemptId, { ...firstPublication, campaignId: "wrong.campaign" }), "invalid_record");
    await owner.updateProfile(accountId, 1, { ...profile, displayName: "later" });
    await expectCode(() => owner.publishPreparedAttempt(attempt.attemptId, firstPublication), "stale_head");
    check(await owner.readRecovery(accountId, attempt.slotId) === null, "invalid request published"); owner.close();
  });
  await test("stale campaign head rejects first publication without changing its artifact", async () => {
    const databaseName = name("publication-stale-head"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    const db = await rawOpen(databaseName);
    const competingEnvelope = { ...envelope, artifactId: `${envelope.artifactId}.other`, publicationId: `${envelope.publicationId}.other` };
    const competing: CampaignStorePublication = { ...firstPublication, artifactRaw: JSON.stringify(competingEnvelope),
      control: { ...firstPublication.control, headArtifactId: competingEnvelope.artifactId, headPublicationId: competingEnvelope.publicationId } };
    await new CampaignIndexedDbStore(db).publish(competing); // synthetic corruption: bypass only to exercise the clean owner fence
    await expectCode(() => owner.publishPreparedAttempt(attempt.attemptId, firstPublication), "stale_head");
    check((await new CampaignIndexedDbStore(db).read(accountId, attempt.campaignId, attempt.slotId))?.artifactRaw === competing.artifactRaw,
      "stale request rewrote accepted artifact"); db.close(); owner.close();
  });
  await test("abort at each publication write and quota at recovery preserve prepared attempt", async () => {
    for (let stop = 1; stop <= 4; stop++) {
      const databaseName = name(`publish-abort-${stop}`); const initial = await openCleanEpochAccountStore({ name: databaseName });
      await initial.register(profile, verifier); await initial.prepareAttempt(attempt); initial.close();
      let writes = 0; const failing = await openCleanEpochAccountStore({ name: databaseName, afterWrite: tx => { if (++writes === stop) tx.abort(); } });
      await expectCode(() => failing.publishPreparedAttempt(attempt.attemptId, firstPublication), "aborted"); failing.close();
      const reopened = await openCleanEpochAccountStore({ name: databaseName });
      check(await reopened.readRecovery(accountId, attempt.slotId) === null && (await reopened.readAttempt(accountId, attempt.slotId))?.attemptId === attempt.attemptId,
        `abort ${stop} lost attempt or published partial recovery`); reopened.close();
    }
    const databaseName = name("publish-quota"); const initial = await openCleanEpochAccountStore({ name: databaseName });
    await initial.register(profile, verifier); await initial.prepareAttempt(attempt); initial.close();
    let writes = 0; const failing = await openCleanEpochAccountStore({ name: databaseName, beforeWrite: () => {
      if (++writes === 4) throw new DOMException("quota", "QuotaExceededError");
    } });
    await expectCode(() => failing.publishPreparedAttempt(attempt.attemptId, firstPublication), "quota"); failing.close();
    const reopened = await openCleanEpochAccountStore({ name: databaseName });
    check(await reopened.readRecovery(accountId, attempt.slotId) === null, "quota left accepted recovery"); reopened.close();
  });
  await test("missing or malformed recovery blocks same-head retry and read", async () => {
    const databaseName = name("recovery-invalid"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt); await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    const valid = await owner.readRecovery(accountId, attempt.slotId);
    const db = await rawOpen(databaseName);
    await rawPutFamily(db, CLEAN_EPOCH_RECOVERY_STORE, { ...valid, consumerPlans: [] });
    await expectCode(() => owner.readRecovery(accountId, attempt.slotId), "invalid_record");
    await expectCode(() => owner.publishPreparedAttempt(attempt.attemptId, firstPublication), "invalid_record");
    await rawPutFamily(db, CLEAN_EPOCH_RECOVERY_STORE, valid);
    await rawDeleteFamily(db, CLEAN_EPOCH_ATTEMPT_STORE, [accountId, attempt.slotId]);
    await expectCode(() => owner.readRecovery(accountId, attempt.slotId), "invalid_record");
    await expectCode(() => owner.publishPreparedAttempt(attempt.attemptId, firstPublication), "invalid_record");
    db.close(); owner.close();
  });
  await test("missing recovery and orphaned head cannot be mistaken for an empty destination", async () => {
    const databaseName = name("recovery-missing"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt); await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    const db = await rawOpen(databaseName);
    await rawDeleteFamily(db, CLEAN_EPOCH_RECOVERY_STORE, [accountId, attempt.slotId]);
    await expectCode(() => owner.readRecovery(accountId, attempt.slotId), "invalid_record");
    await expectCode(() => owner.publishPreparedAttempt(attempt.attemptId, firstPublication), "invalid_record");
    await rawDeleteFamily(db, "slots", [accountId, attempt.slotId]);
    await expectCode(() => owner.readRecovery(accountId, attempt.slotId), "invalid_record");
    db.close(); owner.close();
  });
  await test("concurrent duplicate first publication has one commit and one exact retry", async () => {
    const databaseName = name("publication-concurrent"); const first = await openCleanEpochAccountStore({ name: databaseName });
    await first.register(profile, verifier); await first.prepareAttempt(attempt);
    const second = await openCleanEpochAccountStore({ name: databaseName });
    const results = await Promise.all([first.publishPreparedAttempt(attempt.attemptId, firstPublication),
      second.publishPreparedAttempt(attempt.attemptId, firstPublication)]);
    check(results.filter(result => result.publication.status === "committed").length === 1 &&
      results.filter(result => result.publication.status === "same_source_retry").length === 1, "concurrent duplicate was not serialized");
    check((await first.readRecovery(accountId, attempt.slotId))?.publicationId === envelope.publicationId, "concurrent recovery changed");
    first.close(); second.close();
  });
  await test("Soundings first publication retains independent applied witness and artifact", async () => {
    const source = JSON.parse(fixtures.soundings.raw);
    const soundingsAccount = source.accountId as string;
    const soundingsProfile = createDefaultAccountProfileState({ accountId: soundingsAccount, displayName: "Soundings synthetic", createdAt: "2026-09-29T00:00:00.000Z" });
    const soundingsAttempt = { ...attempt, accountId: soundingsAccount, slotId: source.slotId as string,
      campaignId: source.campaignId as string, attemptId: `attempt.${crypto.randomUUID()}`, snapshotRaw: source.snapshot as string };
    const databaseName = name("soundings-first"); let owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(soundingsProfile, await credential(soundingsAccount)); await owner.prepareAttempt(soundingsAttempt);
    const request = { accountId: soundingsAccount, campaignId: source.campaignId, slotId: source.slotId,
      expectedHead: null, artifactRaw: fixtures.soundings.raw, control: fixtures.soundings.control, witness: fixtures.soundings.witness };
    const accepted = await owner.publishPreparedAttempt(soundingsAttempt.attemptId, request);
    check(accepted.publication.readback.witness?.firstDurableArtifactId === source.artifactId, "first witness not retained");
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName });
    check((await owner.readRecovery(soundingsAccount, source.slotId))?.witnessRequestId === fixtures.soundings.witness.requestId, "witness lost on reopen");
    const db = await rawOpen(databaseName);
    await rawDeleteFamily(db, "witnesses", [soundingsAccount, source.campaignId, fixtures.soundings.witness.requestId]);
    await expectCode(() => owner.readRecovery(soundingsAccount, source.slotId), "invalid_record");
    await rawPutFamily(db, "witnesses", { version: 1, accountId: soundingsAccount, campaignId: source.campaignId,
      requestId: fixtures.soundings.witness.requestId, value: fixtures.soundings.witness });
    await rawDeleteFamily(db, "artifacts", [soundingsAccount, source.artifactId]);
    await expectCode(() => owner.readRecovery(soundingsAccount, source.slotId), "invalid_record"); db.close(); owner.close();
  });
}

suite().then(() => { output.textContent = `PASS ${cases.length}\n${cases.join("\n")}`; output.dataset.done = "true"; })
  .catch(error => { output.textContent = `FAIL after ${cases.length}\n${String(error)}\n${error?.stack ?? ""}`; output.dataset.done = "true"; });
