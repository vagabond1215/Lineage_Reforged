import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { evaluateAchievementProgress } from "../../packages/engines/game-engine/src/achievements.ts";
import { admitCampaignMutation } from "../../packages/engines/game-engine/src/campaign-session.ts";
import { createPlayerQuestAcceptanceCommand, executePlayerQuestAcceptanceCommand } from "../../packages/engines/game-engine/src/player-quest-acceptance.ts";
import { createPlayerTravelCommand, executePlayerTravelCommand } from "../../packages/engines/game-engine/src/player-travel.ts";
import { verifySoundingsAdmissionProvenance } from "../../packages/engines/game-engine/src/soundings-admission-witness.ts";
import { serializeSnapshot } from "../../packages/shared/persistence/src/index.ts";
import type { SaveSnapshot } from "../../packages/shared/types/src/index.ts";
import { advanceAshenReefSurveyCaller } from "./src/runtime/ashenReefSurveyCaller.ts";
import { submitSoundingsTurnInCaller } from "./src/runtime/soundingsTurnInCaller.ts";
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from "./src/game-shell/characterCreationCatalog.ts";
import { createDefaultCharacterCreationFormState } from "./src/game-shell/characterCreationForm.ts";
import { CleanEpochDescendantAdapter } from "./src/game-shell/cleanEpochDescendantAdapter.ts";
import { CleanEpochFirstCampaignAdapter } from "./src/game-shell/cleanEpochFirstCampaignAdapter.ts";
import { CLEAN_EPOCH_DATABASE_VERSION, openCleanEpochAccountStore, type CleanEpochAccountStore } from "./src/game-shell/cleanEpochAccountStore.ts";
import { createCredentialRecord } from "./src/game-shell/launcherAuthManager.ts";
import type { CampaignSessionControl } from "../../packages/engines/game-engine/src/campaign-session.ts";
import type { CampaignStoreFailureCode, CampaignStorePublication } from "./src/game-shell/campaignIndexedDbStore.ts";
import { buildSaveMetadata, type StoredSaveEnvelope } from "./src/game-shell/saveManager.ts";

const output = document.querySelector<HTMLPreElement>("#result")!;
const cases: string[] = [];
const check = (value: unknown, message: string) => { if (!value) throw new Error(message); };
const freshName = (label: string) => `lineage.epoch-witness.qa.${label}.${crypto.randomUUID()}`;
async function test(label: string, run: () => Promise<void>) {
  output.textContent = `RUNNING ${label} after ${cases.length}`;
  await run(); cases.push(label);
}
async function expectCode(run: () => Promise<unknown>, code: CampaignStoreFailureCode) {
  try { await run(); } catch (error) { check((error as { code?: string }).code === code,
    `expected ${code}, got ${String(error)}`); return; }
  throw new Error(`expected ${code}`);
}
function form() {
  const identity = getLineageIdentityCatalog("lineage.human")!;
  const startingBundleId = "starting_bundle.traveler";
  return { ...createDefaultCharacterCreationFormState("slot-1"), playerName: "Mara Soundinghand",
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: "backstory.craftsmans_child", continentId: "region.myridian_chain",
    regionId: "region.starfall_isle", startingSettlementId: "settlement.starfall_port" };
}
type State = { snapshot: SaveSnapshot; control: CampaignSessionControl };
function admit(state: State, result: { accepted: boolean; snapshot: SaveSnapshot }, mutationId: string): State {
  check(result.accepted, `ordinary ${mutationId} was rejected`);
  const accepted = admitCampaignMutation(state.control, { mutationId,
    sourceArtifactId: state.control.loadedArtifactId, sourceRevision: state.control.sessionRevision,
    ownerKind: "engine_result", accepted: true, sourceSnapshot: state.snapshot, proposedSnapshot: result.snapshot });
  check(accepted.accepted, `session ${mutationId} was rejected`);
  return { snapshot: accepted.snapshot, control: accepted.control };
}
function travel(state: State, destination: string): State {
  const command = createPlayerTravelCommand(state.snapshot, destination);
  return admit(state, executePlayerTravelCommand(state.snapshot, command), `mutation.${command.commandId}`);
}
async function setup(label: string) {
  const name = freshName(label);
  const accountId = `account.epoch-witness.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name });
  await owner.register(createDefaultAccountProfileState({ accountId, displayName: "Witness QA" }),
    await createCredentialRecord(accountId, "synthetic-only-password", new Date().toISOString()));
  const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
  if (first.status !== "ready") throw new Error(`pure creator failed: ${JSON.stringify(first)}`);
  check(verifySoundingsAdmissionProvenance(first.value.loaded.snapshot) === "not_completed" &&
    first.value.loaded.sessionControl.campaignHeadRevision === 1, "creator was already witnessed");
  let state: State = { snapshot: first.value.loaded.snapshot, control: first.value.loaded.sessionControl };
  const quest = createPlayerQuestAcceptanceCommand(state.snapshot, "quest.ashen_reef_survey");
  state = admit(state, executePlayerQuestAcceptanceCommand(state.snapshot, quest), `mutation.${quest.commandId}`);
  state = travel(state, "location.ashen_reef");
  const surveyCache = new Map();
  for (let index = 1; index <= 4; index++) {
    const requestId = `survey_request.00000000-0000-4000-8000-${String(index).padStart(12, "0")}`;
    const result = advanceAshenReefSurveyCaller(state.snapshot, state.control, requestId, surveyCache);
    check(result.outcome.kind === "accepted" && result.acceptedState,
      `survey stage ${index} rejected: ${JSON.stringify(result.outcome)}`);
    state = result.acceptedState!;
  }
  state = travel(state, "settlement.starfall_port");
  const requestId = `soundings_turn_in_request.${crypto.randomUUID()}`;
  const submitted = submitSoundingsTurnInCaller(state.snapshot, state.control, requestId, new Map());
  check(submitted.outcome.kind === "accepted" && submitted.acceptedState,
    `Soundings rejected: ${JSON.stringify(submitted.outcome)}`);
  state = submitted.acceptedState!;
  check(state.control.soundingsAdmissionWitness?.posture === "session" &&
    verifySoundingsAdmissionProvenance(state.snapshot, state.control) === "verified",
    "accepted gameplay did not produce an independent session witness");
  const account = await owner.read(accountId);
  check(account?.revision === 2, "creator account consumers did not complete");
  return { name, accountId, owner, account: account!, first: first.value, state };
}
function input(context: Awaited<ReturnType<typeof setup>>) {
  return { accountId: context.accountId, sourceSlotId: "slot-1" as const,
    destinationSlotId: "slot-1" as const, expectedAccountRevision: 2,
    snapshot: context.state.snapshot, control: context.state.control };
}
function publicationRequest(context: Awaited<ReturnType<typeof setup>>,
  destinationSlotId: "slot-1" | "quick-save" = "slot-1") {
  const { accountId, first, state } = context;
  const savedAt = new Date().toISOString();
  const snapshot = evaluateAchievementProgress(state.snapshot, context.account.profile,
    { slotId: destinationSlotId, touchHistory: true, recordedAt: savedAt }).nextSnapshot;
  const identity = snapshot.campaignIdentity!;
  const artifactId = `artifact.${crypto.randomUUID()}`;
  const publicationId = `publication.${crypto.randomUUID()}`;
  const envelope: StoredSaveEnvelope = { version: 7, accountId, slotId: destinationSlotId, savedAt,
    metadata: { ...buildSaveMetadata(destinationSlotId, snapshot), lastSavedAt: savedAt,
      snapshotVersion: snapshot.snapshotVersion }, snapshotFormatId: snapshot.snapshotVersion,
    campaignId: identity.campaignId, continuityId: identity.continuityId,
    characterId: snapshot.playerState.playerId, artifactId,
    generationId: `generation.${crypto.randomUUID()}`, publicationId,
    headRevision: 2, terminal: false, snapshot: serializeSnapshot(snapshot) };
  const firstControl = first.loaded.sessionControl;
  const publication: CampaignStorePublication = { accountId, campaignId: identity.campaignId,
    slotId: destinationSlotId, expectedSlotAddress: destinationSlotId === "quick-save" ? null :
      { artifactId: firstControl.loadedArtifactId, publicationId: firstControl.loadedPublicationId },
    expectedHead: { artifactId: firstControl.loadedArtifactId,
      publicationId: firstControl.loadedPublicationId, revision: 1 }, artifactRaw: JSON.stringify(envelope),
    control: { version: 1, accountId, campaignId: identity.campaignId,
      headArtifactId: artifactId, headPublicationId: publicationId, headRevision: 2,
      previousHeadArtifactId: firstControl.loadedArtifactId,
      previousHeadPublicationId: firstControl.loadedPublicationId, closed: false, updatedAt: savedAt } };
  const payloadFingerprint = JSON.stringify({ slotId: destinationSlotId, capturedAtTick: snapshot.capturedAtTick,
    characterAchievementIds: snapshot.playerState.achievements.unlocked.map(entry => entry.achievementId) });
  return { publication, sessionWitness: state.control.soundingsAdmissionWitness,
    expectedAccountRevision: 2, sourceSlotId: "slot-1" as const,
    sourceArtifactId: firstControl.loadedArtifactId,
    sourcePublicationId: firstControl.loadedPublicationId,
    sourceSnapshotRaw: serializeSnapshot(first.loaded.snapshot),
    consumerPlans: (["active_history", "account_achievements", "legacy_rewards", "last_played"] as const)
      .map(kind => ({ kind, payloadFingerprint })) };
}
function rawOpen(name: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => { const request = indexedDB.open(name, CLEAN_EPOCH_DATABASE_VERSION);
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
}
function rawWrite(db: IDBDatabase, storeName: string, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => { const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(value); tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
}
function rawGet(db: IDBDatabase, storeName: string, key: IDBValidKey): Promise<any> {
  return new Promise((resolve, reject) => { const tx = db.transaction(storeName, "readonly");
    const request = tx.objectStore(storeName).get(key); request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error); });
}
async function suite() {
  await test("cross-slot first witness binds quick head and retains manual source", async () => {
    const context = await setup("cross-slot-first");
    const saved = await new CleanEpochDescendantAdapter(context.owner).save({ ...input(context),
      destinationSlotId: "quick-save", expectedDestinationAddress: null });
    check(saved.status === "ready", `witnessed quick save failed: ${JSON.stringify(saved)}`);
    const manual = await context.owner.readSlot(context.accountId, "slot-1");
    const quick = await context.owner.readSlot(context.accountId, "quick-save");
    check(manual.status === "ready" && quick.status === "ready" &&
      manual.loaded.sessionControl.loadedArtifactId === context.first.loaded.sessionControl.loadedArtifactId &&
      quick.loaded.sessionControl.soundingsAdmissionWitness?.posture === "applied" &&
      quick.loaded.sessionControl.soundingsAdmissionWitness.firstDurableArtifactId ===
        quick.loaded.sessionControl.loadedArtifactId,
      "first Soundings witness or source address changed across slots");
    const later = await new CleanEpochDescendantAdapter(context.owner).save({
      accountId: context.accountId, sourceSlotId: "quick-save", destinationSlotId: "slot-1",
      expectedDestinationAddress: { artifactId: manual.loaded.sessionControl.loadedArtifactId,
        publicationId: manual.loaded.sessionControl.loadedPublicationId },
      expectedAccountRevision: 3, snapshot: quick.loaded.snapshot, control: quick.loaded.sessionControl });
    check(later.status === "ready" && later.value.loaded.sessionControl.soundingsAdmissionWitness?.firstDurableArtifactId ===
      quick.loaded.sessionControl.loadedArtifactId,
      `later manual publication lost first witness: ${JSON.stringify(later)}`);
    context.owner.close();
  });
  await test("cross-slot witnessed abort and quota at every write leave no partial witness", async () => {
    for (const mode of ["aborted", "quota"] as const) for (let stop = 1; stop <= 5; stop++) {
      const context = await setup(`cross-${mode}-${stop}`);
      const request = publicationRequest(context, "quick-save");
      context.owner.close(); let writes = 0;
      const failing = await openCleanEpochAccountStore({ name: context.name,
        beforeWrite: () => { if (mode === "quota" && ++writes === stop)
          throw new DOMException("quota", "QuotaExceededError"); },
        afterWrite: tx => { if (mode === "aborted" && ++writes === stop) tx.abort(); } });
      await expectCode(() => failing.publishDescendant(request), mode);
      failing.close();
      const reopened = await openCleanEpochAccountStore({ name: context.name });
      check((await reopened.readSlot(context.accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1 &&
        (await reopened.readSlot(context.accountId, "quick-save")).status === "empty" &&
        (await reopened.read(context.accountId))?.revision === 2,
        `${mode} at cross-slot write ${stop} left partial authority`);
      const db = await rawOpen(context.name);
      check(await rawGet(db, "witnesses", [context.accountId, request.publication.campaignId,
        request.sessionWitness!.requestId]) === undefined,
        `${mode} at cross-slot write ${stop} left a first witness`);
      db.close(); reopened.close();
    }
  });
  await test("pure creator head accepts first independent Soundings witness and exact applied readback", async () => {
    const context = await setup("first");
    const saved = await new CleanEpochDescendantAdapter(context.owner).save(input(context));
    check(saved.status === "ready", `witnessed caller failed: ${JSON.stringify(saved)}`);
    const witness = saved.value.loaded.sessionControl.soundingsAdmissionWitness;
    const recovery = await context.owner.readDescendantRecovery(context.accountId,
      saved.value.loaded.sessionControl.campaignId, saved.value.loaded.publication.publicationId);
    check(witness?.posture === "applied" && witness.firstDurableArtifactId === saved.value.loaded.sessionControl.loadedArtifactId &&
      witness.firstDurablePublicationId === saved.value.loaded.publication.publicationId &&
      witness.firstDurableHeadRevision === 2 &&
      recovery?.status === "consumers_completed",
      "applied witness or completed recovery differs from head");
    check((await context.owner.readHistoricalArtifact(context.accountId, "slot-1",
      context.first.loaded.sessionControl.loadedArtifactId)).publication.publicationId ===
        context.first.loaded.publication.publicationId, "creator artifact was not retained");
    context.owner.close();
  });
  await test("publication restart and same-source retry reuse one witness and recovery", async () => {
    const context = await setup("retry"); const request = publicationRequest(context);
    const accepted = await context.owner.publishDescendant(request);
    check(accepted.publication.status === "committed" && accepted.recovery.status === "accepted_pending_consumers",
      "first witnessed publication did not commit pending");
    context.owner.close(); const owner = await openCleanEpochAccountStore({ name: context.name });
    const retry = await owner.publishDescendant(request);
    check(retry.publication.status === "same_source_retry" &&
      retry.publication.readback.witness?.firstDurableArtifactId === accepted.publication.readback.witness?.firstDurableArtifactId,
      "restart retry minted or changed first witness");
    await expectCode(() => owner.publishDescendant({ ...request,
      sessionWitness: { ...request.sessionWitness!, sourceRevision: request.sessionWitness!.sourceRevision + 1 } }),
    "conflict");
    const resumed = await new CleanEpochDescendantAdapter(owner).resumeCurrent(context.accountId, "slot-1");
    check(resumed.status === "ready" && resumed.value.loaded.publication.publicationId ===
      accepted.recovery.publicationId && (await owner.read(context.accountId))?.revision === 3,
      "lost caller did not complete the retained publication");
    owner.close();
  });
  await test("missing, tampered and stale session witnesses reject before publication", async () => {
    const context = await setup("invalid"); const request = publicationRequest(context);
    await expectCode(() => context.owner.publishDescendant({ ...request, sessionWitness: undefined }), "invalid_record");
    await expectCode(() => context.owner.publishDescendant({ ...request,
      sessionWitness: { ...request.sessionWitness!, resultId: "wrong.result" } }), "invalid_record");
    await expectCode(() => context.owner.publishDescendant({ ...request,
      sessionWitness: { ...request.sessionWitness!, sourcePublicationId: "publication.stale" } }), "invalid_record");
    check((await context.owner.readSlot(context.accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1,
      "rejected witness changed the head");
    context.owner.close();
  });
  await test("two owners contend for one witnessed head", async () => {
    const context = await setup("contended"); const other = await openCleanEpochAccountStore({ name: context.name });
    const results = await Promise.all([new CleanEpochDescendantAdapter(context.owner).save(input(context)),
      new CleanEpochDescendantAdapter(other).save(input(context))]);
    check(results.filter(result => result.status === "ready").length === 1 &&
      results.filter(result => result.status === "blocked").length === 1 &&
      (await context.owner.read(context.accountId))?.revision === 3, "two owners changed one head twice");
    context.owner.close(); other.close();
  });
  await test("abort or quota at every publication write leaves no first witness", async () => {
    for (const mode of ["aborted", "quota"] as const) for (let stop = 1; stop <= 5; stop++) {
      const context = await setup(`${mode}-${stop}`); const request = publicationRequest(context);
      context.owner.close(); let writes = 0;
      const failing = await openCleanEpochAccountStore({ name: context.name,
        beforeWrite: () => { if (mode === "quota" && ++writes === stop) throw new DOMException("quota", "QuotaExceededError"); },
        afterWrite: tx => { if (mode === "aborted" && ++writes === stop) tx.abort(); } });
      await expectCode(() => failing.publishDescendant(request), mode); failing.close();
      const reopened = await openCleanEpochAccountStore({ name: context.name });
      check((await reopened.readSlot(context.accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1 &&
        (await reopened.readCurrentDescendantRecovery(context.accountId, "slot-1")) === null,
        `${mode} at write ${stop} left a head or recovery`);
      const db = await rawOpen(context.name);
      check(await rawGet(db, "witnesses", [context.accountId, request.publication.campaignId,
        request.sessionWitness!.requestId]) === undefined, `${mode} at write ${stop} left a witness`);
      db.close(); reopened.close();
    }
  });
  await test("consumer abort retains exact pending witness and retries once", async () => {
    const context = await setup("consumer-abort"); const request = publicationRequest(context);
    await context.owner.publishDescendant(request); context.owner.close();
    const failing = await openCleanEpochAccountStore({ name: context.name, afterWrite: tx => tx.abort() });
    await expectCode(() => failing.completeDescendantConsumers(context.accountId,
      request.publication.campaignId, JSON.parse(request.publication.artifactRaw).publicationId), "aborted");
    failing.close(); const owner = await openCleanEpochAccountStore({ name: context.name });
    check((await owner.readSlot(context.accountId, "slot-1")).status === "pending_consumers" &&
      (await owner.readCurrentDescendantRecovery(context.accountId, "slot-1"))?.witnessRequestId ===
        request.sessionWitness!.requestId, "consumer abort lost pending witness");
    await owner.completeDescendantConsumers(context.accountId, request.publication.campaignId,
      JSON.parse(request.publication.artifactRaw).publicationId);
    check((await owner.readSlot(context.accountId, "slot-1")).status === "ready" &&
      (await owner.read(context.accountId))?.revision === 3, "consumer retry did not complete exactly once");
    owner.close();
  });
  await test("later descendant preserves the immutable first witness", async () => {
    const context = await setup("later");
    const first = await new CleanEpochDescendantAdapter(context.owner).save(input(context));
    check(first.status === "ready", "first witnessed save failed");
    const account = await context.owner.read(context.accountId);
    const later = await new CleanEpochDescendantAdapter(context.owner).save({ ...input(context),
      expectedAccountRevision: account!.revision, snapshot: first.value.loaded.snapshot,
      control: first.value.loaded.sessionControl });
    check(later.status === "ready" &&
      later.value.loaded.sessionControl.soundingsAdmissionWitness?.firstDurableArtifactId ===
        first.value.loaded.sessionControl.loadedArtifactId, "later head replaced first witness");
    context.owner.close();
  });
  await test("second first witness and provenance downgrade cannot advance the head", async () => {
    const context = await setup("second-or-downgrade");
    const first = await new CleanEpochDescendantAdapter(context.owner).save(input(context));
    check(first.status === "ready", "first witnessed save failed");
    const loaded = first.value.loaded;
    const second = await new CleanEpochDescendantAdapter(context.owner).save({ ...input(context),
      expectedAccountRevision: 3, snapshot: loaded.snapshot,
      control: { ...loaded.sessionControl, soundingsAdmissionWitness: context.state.control.soundingsAdmissionWitness!,
        retainedMutationResults: context.state.control.retainedMutationResults } });
    check(second.status === "blocked", "second session witness advanced the campaign");
    const downgraded = structuredClone(loaded.snapshot);
    delete downgraded.authorityLedger!.soundingsTurnIn;
    const downgrade = await new CleanEpochDescendantAdapter(context.owner).save({ ...input(context),
      expectedAccountRevision: 3, snapshot: downgraded, control: loaded.sessionControl });
    check(downgrade.status === "blocked" &&
      (await context.owner.readSlot(context.accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 2,
      "provenance downgrade changed the retained head");
    context.owner.close();
  });
  await test("malformed retained witness or recovery blocks exact readback", async () => {
    const context = await setup("malformed"); const request = publicationRequest(context);
    await context.owner.publishDescendant(request);
    const db = await rawOpen(context.name);
    const witnessKey = [context.accountId, request.publication.campaignId, request.sessionWitness!.requestId];
    const witness = await rawGet(db, "witnesses", witnessKey);
    await rawWrite(db, "witnesses", { ...witness, value: { ...witness.value, sourcePublicationId: "publication.wrong" } });
    await expectCode(() => context.owner.readSlot(context.accountId, "slot-1"), "invalid_record");
    await rawWrite(db, "witnesses", witness);
    const artifactId = JSON.parse(request.publication.artifactRaw).artifactId;
    const recoveryKey = [context.accountId, request.publication.campaignId,
      JSON.parse(request.publication.artifactRaw).publicationId];
    const recovery = await rawGet(db, "descendantPublicationRecoveries", recoveryKey);
    await rawWrite(db, "descendantPublicationRecoveries", { ...recovery, witnessRequestId: "wrong.request" });
    await expectCode(() => context.owner.readSlot(context.accountId, "slot-1"), "invalid_record");
    await expectCode(() => context.owner.readDescendantRecovery(context.accountId,
      request.publication.campaignId, recoveryKey[2]), "invalid_record");
    check(artifactId !== context.first.loaded.sessionControl.loadedArtifactId, "descendant identity collapsed");
    db.close(); context.owner.close();
  });
}

suite().then(() => { output.textContent = `PASS ${cases.length}\n${cases.join("\n")}`; })
  .catch(error => { output.textContent = `FAIL after ${cases.length}: ${error instanceof Error ? error.stack : String(error)}`; });
