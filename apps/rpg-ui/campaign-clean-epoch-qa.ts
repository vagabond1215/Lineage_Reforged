import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { evaluateAchievementProgress, prepareCharacterAchievementProgress } from "../../packages/engines/game-engine/src/achievements.ts";
import { resolveLegacyPreparationSelection } from "../../packages/engines/game-engine/src/legacy-unlocks.ts";
import type { AccountProfileState, SaveSnapshot } from "../../packages/shared/types/src/index.ts";
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
function newCampaignPlans(snapshot: SaveSnapshot, profile: AccountProfileState, slotId: string) {
  const core = JSON.stringify({ slotId, capturedAtTick: snapshot.capturedAtTick,
    characterAchievementIds: snapshot.playerState.achievements.unlocked.map(entry => entry.achievementId) });
  const selected = resolveLegacyPreparationSelection(profile);
  const sourceRunId = snapshot.playerState.saveMeta.sourceRunId?.trim() ?? "";
  const preparation = JSON.stringify({ selectedPreparationUnlockIds: selected.selectedUnlockIds,
    selectedPreparationChoicePayloads: selected.selectedChoicePayloads, sourceRunId: sourceRunId || null });
  return (["active_history", "account_achievements", "legacy_rewards", "last_played"] as const)
    .map(kind => ({ kind, payloadFingerprint: core }))
    .concat([{ kind: "preparation_consumption" as const, payloadFingerprint: preparation }])
    .concat(sourceRunId ? [{ kind: "inheritance_consumption" as const, payloadFingerprint: preparation }] : []);
}
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
function rawGetFamily(db: IDBDatabase, family: string, key: IDBValidKey): Promise<unknown> {
  return new Promise((resolve, reject) => { const tx = db.transaction(family, "readonly");
    const request = tx.objectStore(family).get(key); request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error); });
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
  const preparedSnapshot = prepareCharacterAchievementProgress(snapshot, envelope.savedAt).snapshot;
  const attempt = {
    version: 1 as const, status: "prepared" as const, accountId, slotId: "slot-1",
    campaignId: snapshot.campaignIdentity.campaignId, attemptId: `attempt.${crypto.randomUUID()}`,
    expectedAccountRevision: 1, expectedHead: null, inputFingerprint: "normalized-new-campaign-input",
    snapshotRaw: JSON.stringify(preparedSnapshot), consumerPlans: newCampaignPlans(preparedSnapshot, profile, "slot-1"),
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
    const soundingsSnapshot = prepareCharacterAchievementProgress(JSON.parse(source.snapshot), fixtures.soundings.control.updatedAt).snapshot;
    source.snapshot = JSON.stringify(soundingsSnapshot);
    const soundingsAttempt = { ...attempt, accountId: soundingsAccount, slotId: source.slotId as string,
      campaignId: source.campaignId as string, attemptId: `attempt.${crypto.randomUUID()}`, snapshotRaw: source.snapshot as string,
      consumerPlans: newCampaignPlans(soundingsSnapshot, soundingsProfile, source.slotId as string) };
    const databaseName = name("soundings-first"); let owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(soundingsProfile, await credential(soundingsAccount)); await owner.prepareAttempt(soundingsAttempt);
    const request = { accountId: soundingsAccount, campaignId: source.campaignId, slotId: source.slotId,
      expectedHead: null, artifactRaw: JSON.stringify(source), control: fixtures.soundings.control, witness: fixtures.soundings.witness };
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
  await test("all first-campaign consumers commit once, preserve prior history and recover after restart", async () => {
    const databaseName = name("consumer-complete");
    const older = structuredClone(preparedSnapshot);
    older.playerState.playerId = "player.qa.previous";
    const priorProfile = evaluateAchievementProgress(older, profile,
      { slotId: "slot-2", touchHistory: true, recordedAt: "2026-09-28T00:00:00.000Z", suppressLegacyRewards: true }).nextAccountProfile;
    const priorRun = structuredClone(priorProfile.history.runRecords[0]);
    let owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(priorProfile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    const result = await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    check(result.status === "committed" && result.account.revision === 2 && result.recovery.status === "consumers_completed", "consumer completion did not commit");
    check(JSON.stringify(result.recovery.completedConsumerKinds) === JSON.stringify(attempt.consumerPlans.map(plan => plan.kind)), "consumer evidence incomplete");
    check(result.account.profile.history.runRecords.length === 2 &&
      JSON.stringify(result.account.profile.history.runRecords[0]) === JSON.stringify(priorRun), "prior history changed");
    check(result.account.profile.history.runRecords.some(run => run.characterId === preparedSnapshot.playerState.playerId && run.saveSlotIds.includes(attempt.slotId)), "active history missing");
    check(result.account.profile.lastPlayedAt === firstPublication.control.updatedAt &&
      result.account.profile.legacy.selectedPreparationUnlockIds.length === 0, "account consumer effect missing");
    check(attempt.consumerPlans.every(plan => result.account.profile.campaignPublicationReceipts?.some(receipt =>
      receipt.publicationId === envelope.publicationId && receipt.kind === plan.kind && receipt.status === "applied")), "applied receipt missing");
    check((await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId)).status === "same_source_retry", "duplicate completion wrote again");
    check((await owner.publishPreparedAttempt(attempt.attemptId, firstPublication)).publication.status === "same_source_retry", "completed publication did not retry");
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName });
    check((await owner.readRecovery(accountId, attempt.slotId))?.status === "consumers_completed" &&
      (await owner.read(accountId))?.revision === 2, "restart lost completion"); owner.close();
  });
  await test("incomplete or conflicting first-campaign plans cannot publish", async () => {
    for (const [index, plans] of [
      attempt.consumerPlans.slice(0, 1),
      attempt.consumerPlans.map(plan => plan.kind === "active_history" ? { ...plan, payloadFingerprint: "wrong" } : plan),
      [...attempt.consumerPlans.slice(0, -1), { kind: "estate" as const, payloadFingerprint: "wrong" }]
    ].entries()) {
      const owner = await openCleanEpochAccountStore({ name: name("consumer-plan") });
      await owner.register(profile, verifier); const candidate = { ...attempt, consumerPlans: plans };
      await owner.prepareAttempt(candidate);
      await expectCode(() => owner.publishPreparedAttempt(candidate.attemptId, firstPublication), index === 1 ? "conflict" : "invalid_record");
      check(await owner.readRecovery(accountId, attempt.slotId) === null, "invalid plan published"); owner.close();
    }
  });
  await test("consumer identity and stale account revision block without partial profile change", async () => {
    const owner = await openCleanEpochAccountStore({ name: name("consumer-stale") });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt); await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await expectCode(() => owner.completePreparedAttemptConsumers(accountId, attempt.slotId, "wrong-attempt", envelope.publicationId), "conflict");
    await expectCode(() => owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, "wrong-publication"), "conflict");
    await owner.updateProfile(accountId, 1, { ...profile, displayName: "concurrent update" });
    await expectCode(() => owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId), "stale_head");
    check((await owner.read(accountId))?.revision === 2 && (await owner.readRecovery(accountId, attempt.slotId))?.status === "accepted_pending_consumers", "stale completion changed authority"); owner.close();
  });
  await test("abort and quota at each consumer write preserve pending recovery and account", async () => {
    for (const [mode, stop] of [["aborted", 1], ["aborted", 2], ["quota", 1], ["quota", 2]] as const) {
      const databaseName = name(`consumer-${mode}-${stop}`); const first = await openCleanEpochAccountStore({ name: databaseName });
      await first.register(profile, verifier); await first.prepareAttempt(attempt); await first.publishPreparedAttempt(attempt.attemptId, firstPublication); first.close();
      let writes = 0;
      const failing = await openCleanEpochAccountStore({ name: databaseName,
        beforeWrite: () => { if (mode === "quota" && ++writes === stop) throw new DOMException("quota", "QuotaExceededError"); },
        afterWrite: tx => { if (mode === "aborted" && ++writes === stop) tx.abort(); } });
      await expectCode(() => failing.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId), mode);
      failing.close(); const reopened = await openCleanEpochAccountStore({ name: databaseName });
      check((await reopened.read(accountId))?.revision === 1 &&
        (await reopened.readRecovery(accountId, attempt.slotId))?.status === "accepted_pending_consumers", `${mode} ${stop} committed partial consumers`);
      check((await reopened.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId)).status === "committed", "failed completion could not retry");
      reopened.close();
    }
  });
  await test("malformed recovery, lost artifact and missing witness block consumer completion", async () => {
    const databaseName = name("consumer-missing"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt); await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    const db = await rawOpen(databaseName); const retained = await owner.readRecovery(accountId, attempt.slotId);
    await rawPutFamily(db, CLEAN_EPOCH_RECOVERY_STORE, { ...retained, completedConsumerKinds: ["active_history"] });
    await expectCode(() => owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId), "invalid_record");
    await rawPutFamily(db, CLEAN_EPOCH_RECOVERY_STORE, retained);
    await rawDeleteFamily(db, "artifacts", [accountId, envelope.artifactId]);
    await expectCode(() => owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId), "invalid_record");
    check((await owner.read(accountId))?.revision === 1, "missing artifact advanced account"); db.close(); owner.close();
  });
  await test("concurrent duplicate consumer completion has one commit and one retry", async () => {
    const databaseName = name("consumer-concurrent"); const first = await openCleanEpochAccountStore({ name: databaseName });
    await first.register(profile, verifier); await first.prepareAttempt(attempt); await first.publishPreparedAttempt(attempt.attemptId, firstPublication);
    const second = await openCleanEpochAccountStore({ name: databaseName });
    const results = await Promise.all([first.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId),
      second.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId)]);
    check(results.filter(result => result.status === "committed").length === 1 &&
      results.filter(result => result.status === "same_source_retry").length === 1, "duplicate completion not serialized");
    check((await first.read(accountId))?.revision === 2, "duplicate completion incremented revision twice");
    first.close(); second.close();
  });
  await test("retired lineage source is consumed exactly once with prior run retained", async () => {
    const oldSnapshot = structuredClone(preparedSnapshot); oldSnapshot.playerState.playerId = "player.qa.retired-source";
    const oldProfile = evaluateAchievementProgress(oldSnapshot, profile,
      { slotId: "slot-2", touchHistory: true, recordedAt: "2026-09-28T00:00:00.000Z", suppressLegacyRewards: true }).nextAccountProfile;
    const previous = oldProfile.history.runRecords[0];
    const source = { ...previous, outcome: "retired" as const, endedAt: "2026-09-28T01:00:00.000Z", inheritanceUsesRemaining: 1 };
    const lineageProfile = { ...oldProfile, history: { runRecords: [source] } };
    const sourceRunId = `${source.characterId}::${source.startedAt}`;
    const heirSnapshot = structuredClone(preparedSnapshot);
    heirSnapshot.playerState.saveMeta.sourceRunId = sourceRunId;
    const heirAttempt = { ...attempt, snapshotRaw: JSON.stringify(heirSnapshot),
      consumerPlans: newCampaignPlans(heirSnapshot, lineageProfile, attempt.slotId) };
    const heirEnvelope = { ...envelope, snapshot: heirAttempt.snapshotRaw };
    const heirRequest = { ...firstPublication, artifactRaw: JSON.stringify(heirEnvelope) };
    const owner = await openCleanEpochAccountStore({ name: name("inheritance") });
    await owner.register(lineageProfile, verifier); await owner.prepareAttempt(heirAttempt);
    await owner.publishPreparedAttempt(heirAttempt.attemptId, heirRequest);
    const result = await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const retained = result.account.profile.history.runRecords.find(run => run.characterId === source.characterId);
    check(retained?.inheritanceUsesRemaining === 0 && result.account.profile.history.runRecords.length === 2, "inheritance or prior run was lost");
    check((await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId)).status === "same_source_retry" &&
      (await owner.read(accountId))?.profile.history.runRecords.find(run => run.characterId === source.characterId)?.inheritanceUsesRemaining === 0,
      "inheritance duplicate spent twice"); owner.close();
  });
  await test("Soundings witness and first artifact remain required for consumer completion", async () => {
    const source = JSON.parse(fixtures.soundings.raw);
    const soundingsAccount = source.accountId as string;
    const soundingsProfile = createDefaultAccountProfileState({ accountId: soundingsAccount, displayName: "Soundings consumer", createdAt: "2026-09-29T00:00:00.000Z" });
    const soundingsSnapshot = prepareCharacterAchievementProgress(JSON.parse(source.snapshot), fixtures.soundings.control.updatedAt).snapshot;
    source.snapshot = JSON.stringify(soundingsSnapshot);
    const candidate = { ...attempt, accountId: soundingsAccount, slotId: source.slotId as string,
      campaignId: source.campaignId as string, attemptId: `attempt.${crypto.randomUUID()}`,
      snapshotRaw: source.snapshot as string, consumerPlans: newCampaignPlans(soundingsSnapshot, soundingsProfile, source.slotId as string) };
    const request = { accountId: soundingsAccount, campaignId: source.campaignId as string, slotId: source.slotId as string,
      expectedHead: null, artifactRaw: JSON.stringify(source), control: fixtures.soundings.control, witness: fixtures.soundings.witness };
    const databaseName = name("soundings-consumer"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(soundingsProfile, await credential(soundingsAccount)); await owner.prepareAttempt(candidate);
    await owner.publishPreparedAttempt(candidate.attemptId, request);
    const db = await rawOpen(databaseName);
    await rawDeleteFamily(db, "witnesses", [soundingsAccount, source.campaignId, fixtures.soundings.witness.requestId]);
    await expectCode(() => owner.completePreparedAttemptConsumers(soundingsAccount, source.slotId, candidate.attemptId, source.publicationId), "invalid_record");
    check((await owner.read(soundingsAccount))?.revision === 1, "missing witness changed account");
    await rawPutFamily(db, "witnesses", { version: 1, accountId: soundingsAccount, campaignId: source.campaignId,
      requestId: fixtures.soundings.witness.requestId, value: fixtures.soundings.witness });
    check((await owner.completePreparedAttemptConsumers(soundingsAccount, source.slotId, candidate.attemptId, source.publicationId)).account.revision === 2,
      "restored witness could not complete consumers"); db.close(); owner.close();
  });
  await test("slot inventory separates empty, prepared, pending and completed first head across restart", async () => {
    const databaseName = name("slot-inventory"); let owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier);
    const otherId = `account.qa.other.${crypto.randomUUID()}`;
    const otherProfile = createDefaultAccountProfileState({ accountId: otherId, displayName: "Other account", createdAt: "2026-09-29T00:00:00.000Z" });
    await owner.register(otherProfile, await credential(otherId));
    check((await owner.listSlots(accountId)).length === 129 &&
      (await owner.readSlot(accountId, "slot-1")).status === "empty", "fresh slots not empty");
    await owner.prepareAttempt(attempt);
    check((await owner.readSlot(accountId, "slot-1")).status === "prepared" &&
      (await owner.listSlots(accountId))[0]?.status === "prepared", "prepared attempt not visible");
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    const pending = await owner.readSlot(accountId, "slot-1");
    check(pending.status === "pending_consumers" && pending.loaded === undefined &&
      (await owner.listSlots(accountId))[0]?.status === "pending_consumers", "pending publication became playable");
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const ready = await owner.readSlot(accountId, "slot-1");
    check(ready.status === "ready" && ready.loaded?.snapshot.accountId === accountId &&
      JSON.stringify(ready.loaded.snapshot) === JSON.stringify(JSON.parse(attempt.snapshotRaw)) &&
      ready.loaded.sessionControl.posture === "at_head" && ready.loaded.sessionControl.loadedHeadRevision === 1 &&
      ready.loaded.publication.publicationId === envelope.publicationId, "completed first head failed exact playable load");
    check((await owner.listSlots(accountId))[0]?.status === "ready" &&
      (await owner.listSlots(otherId))[0]?.status === "empty", "slot inventory crossed accounts");
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName });
    check((await owner.readSlot(accountId, "slot-1")).loaded?.snapshot.campaignIdentity?.campaignId === attempt.campaignId &&
      (await owner.readSlot(otherId, "slot-1")).status === "empty", "restart lost or aliased slot");
    owner.close();
  });
  await test("first-head reads do not alter account, recovery or immutable artifact", async () => {
    const databaseName = name("slot-readonly"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const db = await rawOpen(databaseName);
    const before = JSON.stringify(await Promise.all([
      rawGetFamily(db, CLEAN_EPOCH_ACCOUNT_STORE, accountId),
      rawGetFamily(db, CLEAN_EPOCH_RECOVERY_STORE, [accountId, attempt.slotId]),
      rawGetFamily(db, "artifacts", [accountId, envelope.artifactId])
    ]));
    await owner.listSlots(accountId); await owner.readSlot(accountId, "slot-1");
    const after = JSON.stringify(await Promise.all([
      rawGetFamily(db, CLEAN_EPOCH_ACCOUNT_STORE, accountId),
      rawGetFamily(db, CLEAN_EPOCH_RECOVERY_STORE, [accountId, attempt.slotId]),
      rawGetFamily(db, "artifacts", [accountId, envelope.artifactId])
    ]));
    check(after === before, "read changed retained account, recovery or artifact"); db.close(); owner.close();
  });
  await test("malformed slot authority and missing retained first artifact fail closed", async () => {
    const databaseName = name("slot-corrupt"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const db = await rawOpen(databaseName);
    const original = await rawGetFamily(db, "slots", [accountId, attempt.slotId]);
    await rawPutFamily(db, "slots", { ...(original as object), publicationId: "wrong.publication" });
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    await expectCode(() => owner.listSlots(accountId), "invalid_record");
    await rawPutFamily(db, "slots", original);
    const first = await rawGetFamily(db, "artifacts", [accountId, envelope.artifactId]);
    await rawDeleteFamily(db, "artifacts", [accountId, envelope.artifactId]);
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    await rawPutFamily(db, "artifacts", first);
    check((await owner.readSlot(accountId, "slot-1")).status === "ready", "restored exact authority not loadable");
    db.close(); owner.close();
  });
  await test("duplicate consumer receipt or missing first run blocks completed load", async () => {
    const databaseName = name("slot-history"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const db = await rawOpen(databaseName); const retained = await rawGetFamily(db, CLEAN_EPOCH_ACCOUNT_STORE, accountId) as {
      profile: AccountProfileState; [key: string]: unknown
    };
    await rawPutFamily(db, CLEAN_EPOCH_ACCOUNT_STORE, { ...retained, profile: { ...retained.profile,
      campaignPublicationReceipts: [...retained.profile.campaignPublicationReceipts,
        retained.profile.campaignPublicationReceipts[0]] } });
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    await rawPutFamily(db, CLEAN_EPOCH_ACCOUNT_STORE, { ...retained, profile: { ...retained.profile,
      history: { runRecords: [] } } });
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    await rawPutFamily(db, CLEAN_EPOCH_ACCOUNT_STORE, retained);
    check((await owner.readSlot(accountId, "slot-1")).status === "ready", "restored account history not loadable");
    db.close(); owner.close();
  });
  await test("descendant and closed heads stay nonplayable while first artifact is retained", async () => {
    const databaseName = name("slot-descendant"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const db = await rawOpen(databaseName); const rawStore = new CampaignIndexedDbStore(db);
    const descendant = { ...envelope, artifactId: `artifact.${crypto.randomUUID()}`,
      generationId: `generation.${crypto.randomUUID()}`, publicationId: `publication.${crypto.randomUUID()}`, headRevision: 2 };
    const nextControl = { ...firstPublication.control, headArtifactId: descendant.artifactId,
      headPublicationId: descendant.publicationId, headRevision: 2,
      previousHeadArtifactId: envelope.artifactId, previousHeadPublicationId: envelope.publicationId };
    await rawStore.publish({ ...firstPublication, artifactRaw: JSON.stringify(descendant),
      expectedHead: { artifactId: envelope.artifactId, publicationId: envelope.publicationId, revision: 1 }, control: nextControl });
    const unsupported = await owner.readSlot(accountId, "slot-1");
    check(unsupported.status === "descendant_unsupported" && unsupported.loaded === undefined &&
      (await owner.listSlots(accountId))[0]?.status === "descendant_unsupported" &&
      (await rawGetFamily(db, "artifacts", [accountId, envelope.artifactId])) !== undefined,
      "descendant was playable or erased first artifact");
    const retainedFirst = await rawGetFamily(db, "artifacts", [accountId, envelope.artifactId]);
    await rawDeleteFamily(db, "artifacts", [accountId, envelope.artifactId]);
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    await rawPutFamily(db, "artifacts", retainedFirst);
    const retainedControl = await rawGetFamily(db, "controls", [accountId, attempt.campaignId]) as { value: object; [key: string]: unknown };
    await rawPutFamily(db, "controls", { ...retainedControl, value: { ...retainedControl.value, closed: true } });
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    await rawPutFamily(db, "controls", retainedControl);
    const terminal = { ...descendant, artifactId: `artifact.${crypto.randomUUID()}`,
      generationId: `generation.${crypto.randomUUID()}`, publicationId: `publication.${crypto.randomUUID()}`,
      headRevision: 3, terminal: true };
    await rawStore.publish({ ...firstPublication, artifactRaw: JSON.stringify(terminal),
      expectedHead: { artifactId: descendant.artifactId, publicationId: descendant.publicationId, revision: 2 },
      control: { ...nextControl, headArtifactId: terminal.artifactId, headPublicationId: terminal.publicationId,
        headRevision: 3, previousHeadArtifactId: descendant.artifactId,
        previousHeadPublicationId: descendant.publicationId, closed: true } });
    check((await owner.readSlot(accountId, "slot-1")).status === "closed" &&
      (await rawGetFamily(db, "artifacts", [accountId, descendant.artifactId])) !== undefined,
      "closed slot erased non-head artifact"); db.close(); owner.close();
  });
  await test("Soundings first-head load requires its retained witness", async () => {
    const source = JSON.parse(fixtures.soundings.raw);
    const soundingsAccount = source.accountId as string;
    const soundingsProfile = createDefaultAccountProfileState({ accountId: soundingsAccount, displayName: "Soundings load", createdAt: "2026-09-29T00:00:00.000Z" });
    const soundingsSnapshot = prepareCharacterAchievementProgress(JSON.parse(source.snapshot), fixtures.soundings.control.updatedAt).snapshot;
    source.snapshot = JSON.stringify(soundingsSnapshot);
    const candidate = { ...attempt, accountId: soundingsAccount, slotId: source.slotId as string,
      campaignId: source.campaignId as string, attemptId: `attempt.${crypto.randomUUID()}`,
      snapshotRaw: source.snapshot as string, consumerPlans: newCampaignPlans(soundingsSnapshot, soundingsProfile, source.slotId as string) };
    const request = { accountId: soundingsAccount, campaignId: source.campaignId as string, slotId: source.slotId as string,
      expectedHead: null, artifactRaw: JSON.stringify(source), control: fixtures.soundings.control, witness: fixtures.soundings.witness };
    const databaseName = name("slot-soundings"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(soundingsProfile, await credential(soundingsAccount)); await owner.prepareAttempt(candidate);
    await owner.publishPreparedAttempt(candidate.attemptId, request);
    await owner.completePreparedAttemptConsumers(soundingsAccount, source.slotId, candidate.attemptId, source.publicationId);
    check((await owner.readSlot(soundingsAccount, source.slotId)).loaded?.sessionControl.soundingsAdmissionWitness?.requestId ===
      fixtures.soundings.witness.requestId, "Soundings witness omitted from load control");
    const db = await rawOpen(databaseName);
    await rawDeleteFamily(db, "witnesses", [soundingsAccount, source.campaignId, fixtures.soundings.witness.requestId]);
    await expectCode(() => owner.readSlot(soundingsAccount, source.slotId), "invalid_record");
    await expectCode(() => owner.listSlots(soundingsAccount), "invalid_record"); db.close(); owner.close();
  });
  await test("missing account and closed connection cannot become empty inventory", async () => {
    const owner = await openCleanEpochAccountStore({ name: name("slot-unavailable") });
    await expectCode(() => owner.listSlots("account.missing"), "invalid_record");
    await expectCode(() => owner.readSlot("account.missing", "slot-1"), "invalid_record");
    await owner.register(profile, verifier); owner.close();
    await expectCode(() => owner.listSlots(accountId), "unavailable");
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "unavailable");
  });
}

suite().then(() => { output.textContent = `PASS ${cases.length}\n${cases.join("\n")}`; output.dataset.done = "true"; })
  .catch(error => { output.textContent = `FAIL after ${cases.length}\n${String(error)}\n${error?.stack ?? ""}`; output.dataset.done = "true"; });
