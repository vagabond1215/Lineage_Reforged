import { prepareCharacterAchievementProgress } from "../../packages/engines/game-engine/src/achievements.ts";
import { createAuthorityId, TARGET_SNAPSHOT_FORMAT } from "../../packages/engines/game-engine/src/campaign-rules.ts";
import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { resolveNormalDefeat } from "../../packages/engines/game-engine/src/normal-defeat.ts";
import { serializeSnapshot } from "../../packages/shared/persistence/src/index.ts";
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from "./src/game-shell/characterCreationCatalog.ts";
import { createDefaultCharacterCreationFormState } from "./src/game-shell/characterCreationForm.ts";
import { CLEAN_EPOCH_DATABASE_NAME, CLEAN_EPOCH_SESSION_STORAGE_KEY, CleanEpochAccountStore,
  openCleanEpochAccountStore } from "./src/game-shell/cleanEpochAccountStore.ts";
import { CleanEpochDescendantAdapter } from "./src/game-shell/cleanEpochDescendantAdapter.ts";
import { CleanEpochNormalDefeatRecoveryAdapter } from "./src/game-shell/cleanEpochNormalDefeatRecoveryAdapter.ts";
import { createCredentialRecord } from "./src/game-shell/launcherAuthManager.ts";
import { createNewGameSnapshot } from "./src/game-shell/newGameSnapshot.ts";
import { buildSaveMetadata, type CampaignPublicationConsumerPlan, type StoredSaveEnvelope } from "./src/game-shell/saveManager.ts";

const output = document.querySelector<HTMLPreElement>("#result")!;
const cases: string[] = [];
const check = (value: unknown, message: string) => { if (!value) throw new Error(message); };
async function test(label: string, run: () => Promise<void>) { await run(); cases.push(label); }
function form() {
  const identity = getLineageIdentityCatalog("lineage.human")!;
  const startingBundleId = "starting_bundle.traveler";
  return { ...createDefaultCharacterCreationFormState("slot-1"), playerName: "Mara Recovery",
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: "backstory.craftsmans_child", continentId: "region.myridian_chain",
    regionId: "region.starfall_isle", startingSettlementId: "settlement.starfall_port" };
}
async function setup(label: string, selectedApp = false) {
  const accountId = `account.local.${crypto.randomUUID()}`;
  const databaseName = selectedApp ? CLEAN_EPOCH_DATABASE_NAME :
    `lineage.epoch-normal-defeat.qa.${label}.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name: databaseName });
  const profile = createDefaultAccountProfileState({ accountId, displayName: "Recovery tester" });
  await owner.register(profile, await createCredentialRecord(accountId, "synthetic-only-password", new Date().toISOString()));
  const original = createNewGameSnapshot(form(), accountId, { accountProfile: profile });
  original.playerState.location.settlementId = null;
  original.playerState.flags = original.playerState.flags.filter(flag => !flag.startsWith("player.start."));
  original.sessionState.knownLocations = [{ id: "location.recovery_haven", name: "Recovery Haven",
    regionLabel: "Test March", settlementId: "settlement.recovery_haven", regionId: "region.test_march",
    type: "settlement", x: 1, y: 1, note: "Authoritative recovery test settlement.", known: true }];
  original.playerState.resources.hp.current = 0;
  const pending = resolveNormalDefeat(original, {
    sourceMutationId: "mutation.normal_defeat.qa", sourceKind: "accepted_mutation" }).snapshot;
  const createdAt = new Date().toISOString();
  const snapshot = prepareCharacterAchievementProgress(pending, createdAt).snapshot;
  const receiptId = snapshot.normalDefeatReceipts?.find(receipt => receipt.posture === "recovery_pending")?.receiptId;
  check(receiptId, "fixture did not produce pending receipt");
  const slotId = "slot-1" as const;
  const campaignId = snapshot.campaignIdentity!.campaignId;
  const core = JSON.stringify({ slotId, capturedAtTick: snapshot.capturedAtTick,
    characterAchievementIds: snapshot.playerState.achievements.unlocked.map(entry => entry.achievementId) });
  const preparation = JSON.stringify({ selectedPreparationUnlockIds: [], selectedPreparationChoicePayloads: {}, sourceRunId: null });
  const consumerPlans: CampaignPublicationConsumerPlan[] = [
    ...(["active_history", "account_achievements", "legacy_rewards", "last_played"] as const)
      .map(kind => ({ kind, payloadFingerprint: core })),
    { kind: "preparation_consumption", payloadFingerprint: preparation } ];
  const attemptId = createAuthorityId("new_campaign_attempt");
  await owner.prepareAttempt({ version: 1, status: "prepared", accountId, slotId, campaignId,
    attemptId, expectedAccountRevision: 1, expectedHead: null, inputFingerprint: "qa.retained.pending",
    snapshotRaw: serializeSnapshot(snapshot), consumerPlans, createdAt });
  const artifactId = createAuthorityId("artifact");
  const generationId = createAuthorityId("generation");
  const publicationId = createAuthorityId("publication");
  const envelope: StoredSaveEnvelope = { version: 7, accountId, slotId, savedAt: createdAt,
    metadata: { ...buildSaveMetadata(slotId, snapshot), lastSavedAt: createdAt, snapshotVersion: TARGET_SNAPSHOT_FORMAT },
    snapshotFormatId: TARGET_SNAPSHOT_FORMAT, campaignId,
    continuityId: snapshot.campaignIdentity!.continuityId, characterId: snapshot.playerState.playerId,
    artifactId, generationId, publicationId, headRevision: 1, terminal: false,
    snapshot: serializeSnapshot(snapshot) };
  await owner.publishPreparedAttempt(attemptId, { accountId, campaignId, slotId, expectedHead: null,
    artifactRaw: JSON.stringify(envelope), control: { version: 1, accountId, campaignId,
      headArtifactId: artifactId, headPublicationId: publicationId, headRevision: 1,
      previousHeadArtifactId: null, previousHeadPublicationId: null, closed: false, updatedAt: createdAt } });
  await owner.completePreparedAttemptConsumers(accountId, slotId, attemptId, publicationId);
  const first = await owner.readSlot(accountId, slotId);
  check(first.status === "ready", "pending source did not become ready");
  const request = { accountId, sourceSlotId: slotId, destinationSlotId: slotId,
    expectedDestinationAddress: { artifactId, publicationId }, expectedAccountRevision: 2,
    snapshot: first.loaded.snapshot, control: first.loaded.sessionControl, receiptId: receiptId! };
  return { accountId, databaseName, owner, first, request };
}

async function suite() {
  await test("retained head repair publishes exact playable descendant and duplicate is stable", async () => {
    const context = await setup("head");
    const adapter = new CleanEpochNormalDefeatRecoveryAdapter(context.owner);
    const result = await adapter.recover(context.request);
    if (result.status !== "ready") throw new Error(`head recovery blocked: ${JSON.stringify(result)}`);
    const exact = await context.owner.readSlot(context.accountId, "slot-1");
    check(exact.status === "ready" && exact.loaded.publication.publicationId === result.value.loaded.publication.publicationId &&
      exact.loaded.snapshot.normalDefeatReceipts?.find(receipt => receipt.receiptId === context.request.receiptId)?.posture === "playable" &&
      exact.loaded.snapshot.clock.tick === context.request.snapshot.clock.tick + 4,
      "head did not read back as the four-tick playable recovery");
    const replay = await adapter.recover(context.request);
    check(replay.status === "ready" && replay.value.loaded.publication.publicationId === result.value.loaded.publication.publicationId,
      "duplicate receipt minted a new publication");
    check((await context.owner.read(context.accountId))?.revision === 3, "duplicate changed account revision");
    context.owner.close();
  });
  await test("bad destination and malformed or multiple receipts leave retained head unchanged", async () => {
    const context = await setup("invalid");
    const adapter = new CleanEpochNormalDefeatRecoveryAdapter(context.owner);
    const invalid = [
      { ...context.request, explicitDestinationId: "settlement.not_known" },
      { ...context.request, receiptId: "receipt.missing" },
      { ...context.request, snapshot: { ...context.request.snapshot, normalDefeatReceipts: [] } },
      { ...context.request, snapshot: { ...context.request.snapshot,
        normalDefeatReceipts: [...context.request.snapshot.normalDefeatReceipts!,
          context.request.snapshot.normalDefeatReceipts![0]!] } }
    ];
    for (const request of invalid) {
      const result = await adapter.recover(request);
      check(result.status === "blocked", "invalid recovery was accepted");
    }
    check((await context.owner.readSlot(context.accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1 &&
      (await context.owner.read(context.accountId))?.revision === 2,
      "invalid recovery changed retained authority");
    context.owner.close();
  });
  await test("stale account, head and destination cannot publish a recovery", async () => {
    const accountCase = await setup("stale-account");
    const account = await accountCase.owner.readSelected(accountCase.accountId);
    await accountCase.owner.updateProfile(accountCase.accountId, 2,
      { ...account!.profile, displayName: "Changed" });
    const staleAccount = await new CleanEpochNormalDefeatRecoveryAdapter(accountCase.owner).recover(accountCase.request);
    check(staleAccount.status === "blocked" && staleAccount.code === "stale_head" &&
      (await accountCase.owner.readSlot(accountCase.accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1,
      "stale account changed campaign head");
    accountCase.owner.close();
    const destinationCase = await setup("stale-destination");
    const staleHead = await new CleanEpochNormalDefeatRecoveryAdapter(destinationCase.owner).recover({
      ...destinationCase.request, control: { ...destinationCase.request.control,
        campaignHeadRevision: destinationCase.request.control.campaignHeadRevision + 1 } });
    check(staleHead.status === "blocked" && staleHead.code === "stale_head" &&
      (await destinationCase.owner.readSlot(destinationCase.accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1,
      "stale campaign head changed retained source");
    const staleDestination = await new CleanEpochNormalDefeatRecoveryAdapter(destinationCase.owner).recover({
      ...destinationCase.request, destinationSlotId: "quick-save",
      expectedDestinationAddress: { artifactId: "artifact.stale", publicationId: "publication.stale" } });
    check(staleDestination.status === "blocked" && staleDestination.code === "conflict" &&
      (await destinationCase.owner.readSlot(destinationCase.accountId, "quick-save")).status === "empty",
      "stale destination changed the quick address");
    destinationCase.owner.close();
  });
  await test("lost caller resumes destination-owned publication after restart", async () => {
    const context = await setup("restart");
    const original = context.owner.completeDescendantConsumers.bind(context.owner);
    context.owner.completeDescendantConsumers = async () => { throw new Error("synthetic caller loss"); };
    const interrupted = await new CleanEpochNormalDefeatRecoveryAdapter(context.owner).recover(context.request);
    check(interrupted.status === "blocked" &&
      (await context.owner.readSlot(context.accountId, "slot-1")).status === "pending_consumers",
      "accepted recovery was not retained after caller loss");
    context.owner.completeDescendantConsumers = original;
    context.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
    const retained = await reopened.readCurrentDescendantRecovery(context.accountId, "slot-1");
    const resumed = await new CleanEpochNormalDefeatRecoveryAdapter(reopened).recover(context.request);
    check(retained?.status === "accepted_pending_consumers" && resumed.status === "ready" &&
      resumed.value.loaded.publication.publicationId === retained.publicationId &&
      (await reopened.read(context.accountId))?.revision === 3,
      "restart did not resume exact pending recovery");
    reopened.close();
  });
  await test("two owners converge on one publication and one consumer completion", async () => {
    const context = await setup("race");
    const second = await openCleanEpochAccountStore({ name: context.databaseName });
    const results = await Promise.all([
      new CleanEpochNormalDefeatRecoveryAdapter(context.owner).recover(context.request),
      new CleanEpochNormalDefeatRecoveryAdapter(second).recover(context.request) ]);
    const head = await context.owner.readSlot(context.accountId, "slot-1");
    check(head.status === "ready" && head.loaded.sessionControl.campaignHeadRevision === 2 &&
      (await context.owner.read(context.accountId))?.revision === 3 &&
      results.some(result => result.status === "ready"),
      "two owners duplicated or lost recovery authority");
    context.owner.close(); second.close();
  });
  await test("write abort and quota preserve the prior head and allow exact retry", async () => {
    for (const mode of ["aborted", "quota"] as const) {
      const context = await setup(mode);
      context.owner.close();
      const failing = await openCleanEpochAccountStore({ name: context.databaseName,
        ...(mode === "quota" ? { beforeWrite: () => { throw new DOMException("quota", "QuotaExceededError"); } }
          : { afterWrite: (tx: IDBTransaction) => tx.abort() }) });
      const blocked = await new CleanEpochNormalDefeatRecoveryAdapter(failing).recover(context.request);
      check(blocked.status === "blocked" && blocked.code === mode,
        `${mode} did not block publication`);
      failing.close();
      const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
      check((await reopened.readSlot(context.accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1 &&
        (await reopened.read(context.accountId))?.revision === 2,
        `${mode} changed prior accepted authority`);
      const retried = await new CleanEpochNormalDefeatRecoveryAdapter(reopened).recover(context.request);
      check(retried.status === "ready", `${mode} retry did not recover`);
      reopened.close();
    }
  });
  await test("retained non-head pending source forks and keeps both artifacts", async () => {
    const context = await setup("fork");
    const first = await new CleanEpochNormalDefeatRecoveryAdapter(context.owner).recover({
      ...context.request, destinationSlotId: "quick-save", expectedDestinationAddress: null });
    if (first.status !== "ready") throw new Error(`quick recovery failed: ${JSON.stringify(first)}`);
    const historical = await context.owner.readHistoricalArtifact(context.accountId, "slot-1",
      context.request.control.loadedArtifactId);
    check(historical.sessionControl.posture === "non_head_unmutated", "source did not become non-head");
    const fork = await new CleanEpochNormalDefeatRecoveryAdapter(context.owner).recover({
      ...context.request, expectedAccountRevision: 3, snapshot: historical.snapshot,
      control: historical.sessionControl });
    check(fork.status === "ready" && fork.value.loaded.snapshot.campaignIdentity?.forkedFromArtifactId ===
      context.request.control.loadedArtifactId &&
      (await context.owner.readSlot(context.accountId, "quick-save")).loaded?.publication.publicationId ===
        first.value.loaded.publication.publicationId,
      `non-head recovery failed or displaced quick history: ${JSON.stringify(fork)}`);
    context.owner.close();
  });
  await test("later head rejects stale duplicate instead of reviving old authority", async () => {
    const context = await setup("later-head");
    const recovered = await new CleanEpochNormalDefeatRecoveryAdapter(context.owner).recover(context.request);
    if (recovered.status !== "ready") throw new Error("recovery failed");
    const saved = await new CleanEpochDescendantAdapter(context.owner).save({ accountId: context.accountId,
      sourceSlotId: "slot-1", destinationSlotId: "slot-1", expectedAccountRevision: 3,
      snapshot: recovered.value.loaded.snapshot, control: recovered.value.loaded.sessionControl });
    if (saved.status !== "ready") throw new Error("later ordinary head missing");
    const stale = await new CleanEpochNormalDefeatRecoveryAdapter(context.owner).recover(context.request);
    check(stale.status === "blocked" &&
      (await context.owner.readSlot(context.accountId, "slot-1")).loaded?.publication.publicationId ===
        saved.value.loaded.publication.publicationId,
      "stale recovery displaced a later head");
    context.owner.close();
  });
}

if (new URLSearchParams(location.search).has("app")) {
  const params = new URLSearchParams(location.search);
  let run = params.get("run");
  if (!run) { run = crypto.randomUUID(); params.set("run", run);
    history.replaceState(null, "", `${location.pathname}?${params}`); }
  const marker = `lineage.epoch-normal-defeat.qa.${run}`;
  let accountId = localStorage.getItem(marker);
  const originalPut = IDBObjectStore.prototype.put;
  const originalComplete = CleanEpochAccountStore.prototype.completeDescendantConsumers;
  let armed: "quota" | "abort" | null = null;
  let consumerLoss = false;
  IDBObjectStore.prototype.put = function(value: unknown, key?: IDBValidKey) {
    if (armed && this.name === "artifacts") {
      const fault = armed; armed = null;
      if (fault === "quota") throw new DOMException("synthetic artifact quota", "QuotaExceededError");
      const result = key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
      queueMicrotask(() => { try { this.transaction.abort(); } catch { /* already settled */ } });
      return result;
    }
    return key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
  };
  CleanEpochAccountStore.prototype.completeDescendantConsumers = async function(...args) {
    if (consumerLoss) { consumerLoss = false; throw new Error("synthetic lost recovery caller"); }
    return originalComplete.apply(this, args);
  };
  document.querySelector<HTMLButtonElement>("#arm-quota")!.onclick = () => { armed = "quota"; output.textContent = "Artifact quota armed."; };
  document.querySelector<HTMLButtonElement>("#arm-abort")!.onclick = () => { armed = "abort"; output.textContent = "Artifact abort armed."; };
  document.querySelector<HTMLButtonElement>("#arm-loss")!.onclick = () => { consumerLoss = true; output.textContent = "Consumer loss armed."; };
  document.querySelector<HTMLButtonElement>("#inspect")!.onclick = () => { void (async () => {
    const owner = await openCleanEpochAccountStore();
    try {
      const account = await owner.read(accountId!);
      const slot = await owner.readSlot(accountId!, "slot-1");
      const recovery = await owner.readCurrentDescendantRecovery(accountId!, "slot-1");
      output.textContent = JSON.stringify({ accountId, revision: account?.revision,
        status: slot.status, publicationId: slot.status === "ready" ? slot.loaded.publication.publicationId : null,
        receipt: slot.status === "ready" ? slot.loaded.snapshot.normalDefeatReceipts?.[0] : null,
        pendingPublicationId: recovery?.publicationId, receipts: account?.profile.campaignPublicationReceipts?.length }, null, 2);
    } finally { owner.close(); }
  })(); };
  (async () => {
    if (!accountId) {
      const context = await setup("selected-app", true);
      accountId = context.accountId;
      localStorage.setItem(marker, accountId);
      context.owner.close();
    }
    output.textContent = `SELECTED APP SEED\naccount=${accountId}`;
    localStorage.setItem(CLEAN_EPOCH_SESSION_STORAGE_KEY,
      JSON.stringify({ version: 1, accountId, issuedAt: new Date().toISOString() }));
    await import("./src/main.tsx");
  })().catch(error => { output.textContent = `APP SEED FAIL: ${error instanceof Error ? error.stack : String(error)}`; });
} else {
  suite().then(() => { output.textContent = `PASS ${cases.length}\n${cases.join("\n")}`; })
    .catch(error => { output.textContent = `FAIL after ${cases.length}: ${error instanceof Error ? error.stack : String(error)}`; });
}
