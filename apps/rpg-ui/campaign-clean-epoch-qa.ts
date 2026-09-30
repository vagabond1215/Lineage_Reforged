import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { evaluateAchievementProgress, prepareCharacterAchievementProgress } from "../../packages/engines/game-engine/src/achievements.ts";
import { resolveLegacyPreparationSelection } from "../../packages/engines/game-engine/src/legacy-unlocks.ts";
import type { AccountProfileState, SaveSnapshot } from "../../packages/shared/types/src/index.ts";
import { CAMPAIGN_DATABASE_NAME, CampaignIndexedDbStore, ensureCampaignPublicationStores, type CampaignStoreFailureCode, type CampaignStorePublication } from "./src/game-shell/campaignIndexedDbStore.ts";
import {
  CLEAN_EPOCH_ACCOUNT_STORE,
  CLEAN_EPOCH_ATTEMPT_STORE,
  CLEAN_EPOCH_RECOVERY_STORE,
  CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
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
    for (const family of ["accounts", "newCampaignAttempts", "pendingPublicationRecoveries", "descendantPublicationRecoveries", "artifacts", "controls", "slots", "witnesses"]) check(db.objectStoreNames.contains(family), `missing ${family}`);
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
  function nextRequest(prior: typeof envelope, revision: number, expectedAccountRevision: number) {
    const next = { ...prior, artifactId: `artifact.${crypto.randomUUID()}`,
      generationId: `generation.${crypto.randomUUID()}`, publicationId: `publication.${crypto.randomUUID()}`,
      headRevision: revision, savedAt: `2026-09-30T0${revision}:00:00.000Z` };
    const expectedHead = { artifactId: prior.artifactId as string, publicationId: prior.publicationId as string,
      revision: revision - 1 };
    const publication = { ...firstPublication, expectedHead, artifactRaw: JSON.stringify(next),
      control: { ...firstPublication.control, headArtifactId: next.artifactId,
        headPublicationId: next.publicationId, headRevision: revision,
        previousHeadArtifactId: prior.artifactId, previousHeadPublicationId: prior.publicationId,
        updatedAt: next.savedAt } };
    return { publication, expectedAccountRevision, sourceArtifactId: prior.artifactId as string,
      sourcePublicationId: prior.publicationId as string, sourceSnapshotRaw: prior.snapshot as string,
      consumerPlans: newCampaignPlans(JSON.parse(next.snapshot), profile, "slot-1").slice(0, 4), next };
  }
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
    await expectCode(() => owner.updateProfile(accountId, 1, { ...profile, displayName: "later" }), "conflict");
    check(await owner.readRecovery(accountId, attempt.slotId) === null, "invalid request published");
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    check((await owner.readRecovery(accountId, attempt.slotId))?.status === "accepted_pending_consumers", "fenced attempt could not publish"); owner.close();
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
    await expectCode(() => owner.updateProfile(accountId, 1, { ...profile, displayName: "concurrent update" }), "conflict");
    check((await owner.read(accountId))?.revision === 1 && (await owner.readRecovery(accountId, attempt.slotId))?.status === "accepted_pending_consumers", "fence changed pending authority");
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    check((await owner.readSlot(accountId, attempt.slotId)).status === "ready", "fenced consumers could not complete"); owner.close();
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
  await test("raw descendant and closed heads without owner recovery fail closed while artifacts remain", async () => {
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
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    await expectCode(() => owner.listSlots(accountId), "invalid_record");
    check((await rawGetFamily(db, "artifacts", [accountId, envelope.artifactId])) !== undefined,
      "raw descendant erased first artifact");
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
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    check((await rawGetFamily(db, "artifacts", [accountId, descendant.artifactId])) !== undefined,
      "raw closed slot erased non-head artifact"); db.close(); owner.close();
  });
  await test("guarded descendant accepts one pending head with exact source and restart recovery", async () => {
    const databaseName = name("descendant-pending"); let owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const request = nextRequest(envelope, 2, 2);
    const accepted = await owner.publishDescendant(request);
    check(accepted.publication.status === "committed" && accepted.recovery.status === "accepted_pending_consumers" &&
      (await owner.readSlot(accountId, "slot-1")).loaded === undefined, "pending descendant became playable");
    check((await owner.publishDescendant(request)).publication.status === "same_source_retry", "descendant retry changed head");
    await expectCode(() => owner.publishDescendant(nextRequest(envelope, 2, 2)), "stale_head");
    await expectCode(() => owner.publishDescendant(nextRequest(request.next, 3, 2)), "conflict");
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName });
    check((await owner.readDescendantRecovery(accountId, attempt.campaignId, request.next.publicationId))?.status ===
      "accepted_pending_consumers", "restart lost pending descendant");
    check((await owner.readRecovery(accountId, attempt.slotId))?.status === "consumers_completed", "descendant displaced first recovery");
    const db = await rawOpen(databaseName);
    check((await rawGetFamily(db, "artifacts", [accountId, envelope.artifactId])) !== undefined &&
      (await rawGetFamily(db, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
        [accountId, attempt.campaignId, request.next.publicationId])) !== undefined, "accepted history was pruned");
    db.close(); owner.close();
  });
  await test("first and second descendants complete once, reload and retain every head", async () => {
    const databaseName = name("descendant-chain"); let owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const second = nextRequest(envelope, 2, 2);
    await owner.publishDescendant(second);
    check((await owner.readSlot(accountId, "slot-1")).status === "pending_consumers", "pending descendant exposed as ready");
    const completedSecond = await owner.completeDescendantConsumers(accountId, attempt.campaignId, second.next.publicationId);
    check(completedSecond.account.revision === 3 && completedSecond.recovery.status === "consumers_completed" &&
      (await owner.readSlot(accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 2,
      "first descendant did not become playable after consumers");
    check((await owner.completeDescendantConsumers(accountId, attempt.campaignId, second.next.publicationId)).status ===
      "same_source_retry", "completed descendant duplicated consumers");
    const third = nextRequest(second.next, 3, 3);
    await owner.publishDescendant(third);
    await owner.completeDescendantConsumers(accountId, attempt.campaignId, third.next.publicationId);
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName });
    const loaded = await owner.readSlot(accountId, "slot-1");
    check(loaded.status === "ready" && loaded.loaded?.sessionControl.campaignHeadRevision === 3 &&
      JSON.stringify(loaded.loaded.snapshot) === third.next.snapshot &&
      (await owner.read(accountId))?.revision === 4 &&
      (await owner.readDescendantRecovery(accountId, attempt.campaignId, second.next.publicationId))?.status ===
        "consumers_completed", "second descendant or restart lost history");
    for (const historicalId of [envelope.artifactId, second.next.artifactId]) {
      const historical = await owner.readHistoricalArtifact(accountId, "slot-1", historicalId);
      check(historical.sessionControl.posture === "non_head_unmutated" &&
        historical.sessionControl.campaignHeadRevision === 3 &&
        historical.sessionControl.loadedArtifactId === historicalId,
        "retained non-head artifact did not reload against current head");
    }
    await expectCode(() => owner.readHistoricalArtifact(accountId, "slot-1", "artifact.missing"), "invalid_record");
    const db = await rawOpen(databaseName);
    for (const artifactId of [envelope.artifactId, second.next.artifactId, third.next.artifactId])
      check((await rawGetFamily(db, "artifacts", [accountId, artifactId])) !== undefined, `lost artifact ${artifactId}`);
    db.close(); owner.close();
  });
  await test("non-head source forks a new continuity while retaining its source and prior head", async () => {
    const databaseName = name("descendant-fork"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const second = nextRequest(envelope, 2, 2);
    await owner.publishDescendant(second);
    await owner.completeDescendantConsumers(accountId, attempt.campaignId, second.next.publicationId);
    const third = nextRequest(second.next, 3, 3);
    const forkSnapshot = JSON.parse(third.next.snapshot);
    forkSnapshot.campaignIdentity = { ...forkSnapshot.campaignIdentity,
      parentContinuityId: snapshot.campaignIdentity.continuityId,
      continuityId: `continuity.${crypto.randomUUID()}`,
      forkedFromArtifactId: envelope.artifactId, forkedFromPublicationId: envelope.publicationId,
      firstDivergentMutationId: `mutation.${crypto.randomUUID()}` };
    third.next.snapshot = JSON.stringify(forkSnapshot);
    third.next.continuityId = forkSnapshot.campaignIdentity.continuityId;
    third.publication.artifactRaw = JSON.stringify(third.next);
    third.sourceArtifactId = envelope.artifactId;
    third.sourcePublicationId = envelope.publicationId;
    third.sourceSnapshotRaw = envelope.snapshot;
    await owner.publishDescendant(third);
    await owner.completeDescendantConsumers(accountId, attempt.campaignId, third.next.publicationId);
    const loaded = await owner.readSlot(accountId, "slot-1");
    check(loaded.status === "ready" && loaded.loaded?.snapshot.campaignIdentity?.forkedFromArtifactId === envelope.artifactId,
      "fork continuity not loadable");
    const db = await rawOpen(databaseName);
    check((await rawGetFamily(db, "artifacts", [accountId, second.next.artifactId])) !== undefined &&
      (await rawGetFamily(db, "artifacts", [accountId, envelope.artifactId])) !== undefined,
      "fork pruned accepted history"); db.close(); owner.close();
  });
  await test("descendant source, account revision and predecessor conflicts leave first head intact", async () => {
    const databaseName = name("descendant-conflict"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const request = nextRequest(envelope, 2, 2);
    await expectCode(() => owner.publishDescendant({ ...request, sourceSnapshotRaw: "{}" }), "invalid_record");
    await expectCode(() => owner.publishDescendant({ ...request, expectedAccountRevision: 1 }), "stale_head");
    await expectCode(() => owner.publishDescendant({ ...request, consumerPlans: request.consumerPlans.slice(1) }), "invalid_record");
    const db = await rawOpen(databaseName);
    check((await rawGetFamily(db, "controls", [accountId, attempt.campaignId]) as { value: { headRevision: number } }).value.headRevision === 1 &&
      (await rawGetFamily(db, CLEAN_EPOCH_DESCENDANT_RECOVERY_STORE,
        [accountId, attempt.campaignId, request.next.publicationId])) === undefined, "conflict changed head");
    db.close(); owner.close();
  });
  await test("two epoch owners contend for one descendant and one completion", async () => {
    const databaseName = name("descendant-contended"); const first = await openCleanEpochAccountStore({ name: databaseName });
    await first.register(profile, verifier); await first.prepareAttempt(attempt);
    await first.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await first.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const second = await openCleanEpochAccountStore({ name: databaseName });
    const left = nextRequest(envelope, 2, 2); const right = nextRequest(envelope, 2, 2);
    const results = await Promise.allSettled([first.publishDescendant(left), second.publishDescendant(right)]);
    check(results.filter(result => result.status === "fulfilled").length === 1 &&
      (results.find(result => result.status === "rejected") as PromiseRejectedResult).reason.code === "stale_head",
      "two owners both accepted descendant heads");
    const winner = results[0]?.status === "fulfilled" ? left : right;
    const completions = await Promise.allSettled([
      first.completeDescendantConsumers(accountId, attempt.campaignId, winner.next.publicationId),
      second.completeDescendantConsumers(accountId, attempt.campaignId, winner.next.publicationId)
    ]);
    check(completions.every(result => result.status === "fulfilled") &&
      completions.filter(result => result.status === "fulfilled" && result.value.status === "committed").length === 1 &&
      completions.filter(result => result.status === "fulfilled" && result.value.status === "same_source_retry").length === 1,
      "two owners duplicated or lost descendant consumers");
    check((await first.read(accountId))?.revision === 3 && (await second.readSlot(accountId, "slot-1")).status === "ready",
      "contended completion did not read back"); first.close(); second.close();
  });
  await test("abort and quota at each descendant consumer write preserve pending recovery", async () => {
    for (const mode of ["aborted", "quota"] as const) for (let stop = 1; stop <= 2; stop++) {
      const databaseName = name(`descendant-consumer-${mode}-${stop}`);
      const first = await openCleanEpochAccountStore({ name: databaseName });
      await first.register(profile, verifier); await first.prepareAttempt(attempt);
      await first.publishPreparedAttempt(attempt.attemptId, firstPublication);
      await first.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
      const request = nextRequest(envelope, 2, 2); await first.publishDescendant(request); first.close();
      let writes = 0;
      const failing = await openCleanEpochAccountStore({ name: databaseName,
        beforeWrite: () => { if (mode === "quota" && ++writes === stop) throw new DOMException("quota", "QuotaExceededError"); },
        afterWrite: tx => { if (mode === "aborted" && ++writes === stop) tx.abort(); } });
      await expectCode(() => failing.completeDescendantConsumers(accountId, attempt.campaignId, request.next.publicationId), mode);
      failing.close(); const reopened = await openCleanEpochAccountStore({ name: databaseName });
      check((await reopened.read(accountId))?.revision === 2 &&
        (await reopened.readDescendantRecovery(accountId, attempt.campaignId, request.next.publicationId))?.status ===
          "accepted_pending_consumers" &&
        (await reopened.readSlot(accountId, "slot-1")).status === "pending_consumers",
        `${mode} ${stop} partially completed descendant consumers`); reopened.close();
    }
  });
  await test("account edit after descendant acceptance blocks consumer completion without overwriting profile", async () => {
    const owner = await openCleanEpochAccountStore({ name: name("descendant-stale-consumer") });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const request = nextRequest(envelope, 2, 2); await owner.publishDescendant(request);
    const retained = (await owner.read(accountId))!;
    await expectCode(() => owner.updateProfile(accountId, 2, { ...retained.profile, displayName: "Concurrent profile edit" }), "conflict");
    check((await owner.read(accountId))?.profile.displayName === retained.profile.displayName &&
      (await owner.readSlot(accountId, "slot-1")).status === "pending_consumers", "fence changed pending profile");
    await owner.completeDescendantConsumers(accountId, attempt.campaignId, request.next.publicationId);
    check((await owner.readSlot(accountId, "slot-1")).status === "ready", "fenced descendant could not complete");
    owner.close();
  });
  await test("missing descendant artifact or applied receipt blocks load and retry", async () => {
    const databaseName = name("descendant-missing"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(profile, verifier); await owner.prepareAttempt(attempt);
    await owner.publishPreparedAttempt(attempt.attemptId, firstPublication);
    await owner.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
    const request = nextRequest(envelope, 2, 2);
    await owner.publishDescendant(request);
    await owner.completeDescendantConsumers(accountId, attempt.campaignId, request.next.publicationId);
    const db = await rawOpen(databaseName);
    const retainedArtifact = await rawGetFamily(db, "artifacts", [accountId, request.next.artifactId]);
    await rawDeleteFamily(db, "artifacts", [accountId, request.next.artifactId]);
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    await rawPutFamily(db, "artifacts", retainedArtifact);
    await rawPutFamily(db, "artifacts", { ...(retainedArtifact as object), generationId: "wrong.generation" });
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    await rawPutFamily(db, "artifacts", retainedArtifact);
    const retainedAccount = await rawGetFamily(db, CLEAN_EPOCH_ACCOUNT_STORE, accountId) as { profile: AccountProfileState };
    await rawPutFamily(db, CLEAN_EPOCH_ACCOUNT_STORE, { ...retainedAccount, profile: { ...retainedAccount.profile,
      campaignPublicationReceipts: retainedAccount.profile.campaignPublicationReceipts?.filter(receipt =>
        receipt.publicationId !== request.next.publicationId) } });
    await expectCode(() => owner.readSlot(accountId, "slot-1"), "invalid_record");
    await expectCode(() => owner.completeDescendantConsumers(accountId, attempt.campaignId, request.next.publicationId), "invalid_record");
    db.close(); owner.close();
  });
  await test("Soundings descendant retains first witness and immutable first artifact", async () => {
    const source = JSON.parse(fixtures.soundings.raw);
    const soundingsAccount = source.accountId as string;
    const soundingsProfile = createDefaultAccountProfileState({ accountId: soundingsAccount,
      displayName: "Soundings descendant", createdAt: "2026-09-29T00:00:00.000Z" });
    const soundingsSnapshot = prepareCharacterAchievementProgress(JSON.parse(source.snapshot),
      fixtures.soundings.control.updatedAt).snapshot;
    source.snapshot = JSON.stringify(soundingsSnapshot);
    const prepared = { ...attempt, accountId: soundingsAccount, slotId: source.slotId as string,
      campaignId: source.campaignId as string, attemptId: `attempt.${crypto.randomUUID()}`,
      snapshotRaw: source.snapshot as string, consumerPlans: newCampaignPlans(soundingsSnapshot, soundingsProfile, source.slotId) };
    const databaseName = name("soundings-descendant"); const owner = await openCleanEpochAccountStore({ name: databaseName });
    await owner.register(soundingsProfile, await credential(soundingsAccount)); await owner.prepareAttempt(prepared);
    const first = { accountId: soundingsAccount, campaignId: source.campaignId as string, slotId: source.slotId as string,
      expectedHead: null, artifactRaw: JSON.stringify(source), control: fixtures.soundings.control,
      witness: fixtures.soundings.witness };
    await owner.publishPreparedAttempt(prepared.attemptId, first);
    await owner.completePreparedAttemptConsumers(soundingsAccount, source.slotId, prepared.attemptId, source.publicationId);
    const descendant = { ...source, artifactId: `artifact.${crypto.randomUUID()}`,
      generationId: `generation.${crypto.randomUUID()}`, publicationId: `publication.${crypto.randomUUID()}`,
      headRevision: 2, savedAt: "2026-09-30T02:00:00.000Z" };
    const request = { publication: { accountId: soundingsAccount, campaignId: source.campaignId,
      slotId: source.slotId, artifactRaw: JSON.stringify(descendant),
      expectedHead: { artifactId: source.artifactId, publicationId: source.publicationId, revision: 1 },
      control: { ...fixtures.soundings.control, headArtifactId: descendant.artifactId,
        headPublicationId: descendant.publicationId, headRevision: 2,
        previousHeadArtifactId: source.artifactId, previousHeadPublicationId: source.publicationId,
        updatedAt: descendant.savedAt } },
      expectedAccountRevision: 2, sourceArtifactId: source.artifactId as string,
      sourcePublicationId: source.publicationId as string, sourceSnapshotRaw: source.snapshot as string,
      consumerPlans: newCampaignPlans(soundingsSnapshot, soundingsProfile, source.slotId).slice(0, 4) };
    await owner.publishDescendant(request);
    await owner.completeDescendantConsumers(soundingsAccount, source.campaignId, descendant.publicationId);
    check((await owner.readSlot(soundingsAccount, source.slotId)).loaded?.sessionControl.soundingsAdmissionWitness?.firstDurableArtifactId ===
      source.artifactId, "descendant lost first Soundings witness");
    const db = await rawOpen(databaseName);
    check((await rawGetFamily(db, "artifacts", [soundingsAccount, source.artifactId])) !== undefined,
      "descendant lost first Soundings artifact");
    await rawDeleteFamily(db, "witnesses", [soundingsAccount, source.campaignId, fixtures.soundings.witness.requestId]);
    await expectCode(() => owner.readSlot(soundingsAccount, source.slotId), "invalid_record");
    db.close(); owner.close();
  });
  await test("abort and quota at each descendant write leave no accepted partial head", async () => {
    for (const mode of ["aborted", "quota"] as const) for (let stop = 1; stop <= 4; stop++) {
      const databaseName = name(`descendant-${mode}-${stop}`); const first = await openCleanEpochAccountStore({ name: databaseName });
      await first.register(profile, verifier); await first.prepareAttempt(attempt);
      await first.publishPreparedAttempt(attempt.attemptId, firstPublication);
      await first.completePreparedAttemptConsumers(accountId, attempt.slotId, attempt.attemptId, envelope.publicationId);
      first.close(); let writes = 0;
      const failing = await openCleanEpochAccountStore({ name: databaseName,
        beforeWrite: () => { if (mode === "quota" && ++writes === stop) throw new DOMException("quota", "QuotaExceededError"); },
        afterWrite: tx => { if (mode === "aborted" && ++writes === stop) tx.abort(); } });
      const request = nextRequest(envelope, 2, 2);
      await expectCode(() => failing.publishDescendant(request), mode); failing.close();
      const reopened = await openCleanEpochAccountStore({ name: databaseName });
      check((await reopened.readSlot(accountId, "slot-1")).status === "ready" &&
        await reopened.readDescendantRecovery(accountId, attempt.campaignId, request.next.publicationId) === null,
        `${mode} ${stop} retained partial descendant`);
      reopened.close();
    }
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
