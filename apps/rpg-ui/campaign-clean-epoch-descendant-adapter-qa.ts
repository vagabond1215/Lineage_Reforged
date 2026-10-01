import { createDefaultAccountProfileState } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { admitCampaignMutation } from "../../packages/engines/game-engine/src/campaign-session.ts";
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from "./src/game-shell/characterCreationCatalog.ts";
import { createDefaultCharacterCreationFormState } from "./src/game-shell/characterCreationForm.ts";
import { CleanEpochDescendantAdapter } from "./src/game-shell/cleanEpochDescendantAdapter.ts";
import { CleanEpochFirstCampaignAdapter } from "./src/game-shell/cleanEpochFirstCampaignAdapter.ts";
import { openCleanEpochAccountStore } from "./src/game-shell/cleanEpochAccountStore.ts";
import { createCredentialRecord } from "./src/game-shell/launcherAuthManager.ts";

const output = document.querySelector<HTMLPreElement>("#result")!;
const cases: string[] = [];
const check = (value: unknown, message: string) => { if (!value) throw new Error(message); };
const accountId = `account.local.${crypto.randomUUID()}`;
const name = (label: string) => `lineage.epoch-descendant-adapter.qa.${label}.${crypto.randomUUID()}`;
async function test(label: string, run: () => Promise<void>) { await run(); cases.push(label); }
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
async function setup(label: string) {
  const databaseName = name(label);
  const owner = await openCleanEpochAccountStore({ name: databaseName });
  await owner.register(createDefaultAccountProfileState({ accountId, displayName: "Epoch tester" }),
    await createCredentialRecord(accountId, "synthetic-only-password", new Date().toISOString()));
  const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
  if (first.status !== "ready") throw new Error(`First campaign failed: ${JSON.stringify(first)}`);
  const account = await owner.read(accountId);
  check(account?.revision === 2, "first campaign account consumers missing");
  return { databaseName, owner, first: first.value, account: account! };
}
function request(setupResult: Awaited<ReturnType<typeof setup>>, destinationSlotId: "slot-1" | "quick-save" = "slot-1") {
  return { accountId, sourceSlotId: "slot-1" as const, destinationSlotId,
    expectedAccountRevision: setupResult.account.revision,
    snapshot: setupResult.first.loaded.snapshot, control: setupResult.first.loaded.sessionControl };
}

async function suite() {
  await test("same-slot descendant completes consumers and preserves first artifact", async () => {
    const context = await setup("ordinary");
    const saved = await new CleanEpochDescendantAdapter(context.owner).save(request(context));
    check(saved.status === "ready" && saved.value.loaded.sessionControl.campaignHeadRevision === 2,
      `ordinary save did not read back: ${JSON.stringify(saved)}`);
    check((await context.owner.read(accountId))?.revision === 3, "ordinary account consumers did not complete");
    const first = await context.owner.readHistoricalArtifact(accountId, "slot-1",
      context.first.loaded.sessionControl.loadedArtifactId);
    check(first.sessionControl.posture === "non_head_unmutated" &&
      first.publication.publicationId === context.first.loaded.publication.publicationId,
      "first accepted artifact was lost");
    const retry = await new CleanEpochDescendantAdapter(context.owner).save(request(context));
    check(retry.status === "blocked" && retry.code === "stale_head", "stale caller created another head");
    context.owner.close();
  });
  await test("cross-slot quick save requires explicit destination CAS", async () => {
    const context = await setup("quick-slot");
    const blocked = await new CleanEpochDescendantAdapter(context.owner).save(request(context, "quick-save"));
    check(blocked.status === "blocked" && blocked.code === "invalid_record" &&
      (await context.owner.readSlot(accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1 &&
      (await context.owner.readSlot(accountId, "quick-save")).status === "empty",
      "missing quick destination expectation changed epoch authority");
    context.owner.close();
  });
  await test("manual to quick keeps manual address and loads quick head", async () => {
    const context = await setup("manual-quick");
    const saved = await new CleanEpochDescendantAdapter(context.owner).save({
      ...request(context, "quick-save"), expectedDestinationAddress: null });
    check(saved.status === "ready" && saved.value.loaded.sessionControl.campaignHeadRevision === 2,
      `quick publication failed: ${JSON.stringify(saved)}`);
    const manual = await context.owner.readSlot(accountId, "slot-1");
    const quick = await context.owner.readSlot(accountId, "quick-save");
    check(manual.status === "ready" && quick.status === "ready" &&
      manual.loaded.sessionControl.loadedArtifactId === context.first.loaded.sessionControl.loadedArtifactId &&
      manual.loaded.sessionControl.posture === "non_head_unmutated" &&
      manual.loaded.sessionControl.campaignHeadArtifactId === quick.loaded.sessionControl.loadedArtifactId &&
      quick.loaded.publication.publicationId === saved.value.loaded.publication.publicationId,
      "manual address moved or quick address did not load exact head");
    const account = await context.owner.read(accountId);
    check(account?.profile.history.runRecords[0]?.saveSlotIds.filter(id => id === "quick-save").length === 1 &&
      account.profile.history.runRecords[0]?.saveSlotIds.filter(id => id === "slot-1").length === 1,
      "account history omitted a source or destination address");
    context.owner.close();
  });
  await test("quick to occupied manual overwrites only its address and retains a non-head fork", async () => {
    const context = await setup("quick-manual");
    const adapter = new CleanEpochDescendantAdapter(context.owner);
    const quick = await adapter.save({ ...request(context, "quick-save"), expectedDestinationAddress: null });
    check(quick.status === "ready", "quick source failed");
    const firstAddress = { artifactId: context.first.loaded.sessionControl.loadedArtifactId,
      publicationId: context.first.loaded.sessionControl.loadedPublicationId };
    const manual = await adapter.save({ accountId, sourceSlotId: "quick-save", destinationSlotId: "slot-1",
      expectedDestinationAddress: firstAddress, expectedAccountRevision: 3,
      snapshot: quick.value.loaded.snapshot, control: quick.value.loaded.sessionControl });
    check(manual.status === "ready" && manual.value.loaded.sessionControl.campaignHeadRevision === 3,
      `occupied manual save failed: ${JSON.stringify(manual)}`);
    const retained = await context.owner.readHistoricalArtifact(accountId, "slot-1", firstAddress.artifactId);
    const oldQuick = await context.owner.readSlot(accountId, "quick-save");
    check(retained.publication.publicationId === firstAddress.publicationId &&
      oldQuick.status === "ready" && oldQuick.loaded.sessionControl.posture === "non_head_unmutated" &&
      oldQuick.loaded.sessionControl.loadedArtifactId === quick.value.loaded.sessionControl.loadedArtifactId,
      "manual overwrite deleted prior address or moved quick source");
    const proposed = structuredClone(oldQuick.loaded.snapshot);
    proposed.playerState.currency.gold += 1;
    const admitted = admitCampaignMutation(oldQuick.loaded.sessionControl,
      { mutationId: `mutation.${crypto.randomUUID()}`, sourceArtifactId: oldQuick.loaded.sessionControl.loadedArtifactId,
        sourceRevision: oldQuick.loaded.sessionControl.sessionRevision, ownerKind: "legacy_bridge",
        accepted: true, sourceSnapshot: oldQuick.loaded.snapshot, proposedSnapshot: proposed });
    check(admitted.accepted && admitted.snapshot.campaignIdentity?.forkedFromArtifactId ===
      oldQuick.loaded.sessionControl.loadedArtifactId, "older quick address did not fork");
    const fork = await adapter.save({ accountId, sourceSlotId: "quick-save", destinationSlotId: "slot-1",
      expectedDestinationAddress: { artifactId: manual.value.loaded.sessionControl.loadedArtifactId,
        publicationId: manual.value.loaded.sessionControl.loadedPublicationId },
      expectedAccountRevision: 4, snapshot: admitted.snapshot, control: admitted.control });
    check(fork.status === "ready" && fork.value.loaded.sessionControl.campaignHeadRevision === 4 &&
      fork.value.loaded.snapshot.campaignIdentity?.forkedFromArtifactId ===
        oldQuick.loaded.sessionControl.loadedArtifactId,
      `cross-slot fork was not retained: ${JSON.stringify(fork)}`);
    context.owner.close();
  });
  await test("stale destination address and competing owners cannot overwrite a winner", async () => {
    const context = await setup("destination-cas");
    const other = await openCleanEpochAccountStore({ name: context.databaseName });
    const stale = await new CleanEpochDescendantAdapter(context.owner).save({
      ...request(context, "quick-save"), expectedDestinationAddress: {
        artifactId: "artifact.stale", publicationId: "publication.stale" } });
    check(stale.status === "blocked" && stale.code === "conflict" &&
      (await context.owner.readSlot(accountId, "quick-save")).status === "empty",
      "stale destination expectation changed the slot");
    const [left, right] = await Promise.all([
      new CleanEpochDescendantAdapter(context.owner).save({ ...request(context, "quick-save"), expectedDestinationAddress: null }),
      new CleanEpochDescendantAdapter(other).save({ ...request(context, "quick-save"), expectedDestinationAddress: null })
    ]);
    check([left, right].filter(result => result.status === "ready").length === 1 &&
      [left, right].filter(result => result.status === "blocked").length === 1 &&
      (await context.owner.readSlot(accountId, "slot-1")).loaded?.sessionControl.loadedArtifactId ===
        context.first.loaded.sessionControl.loadedArtifactId,
      "destination race changed more than one address or source");
    context.owner.close(); other.close();
  });
  await test("another campaign in the destination blocks cross-slot overwrite", async () => {
    const context = await setup("other-campaign");
    const second = await new CleanEpochFirstCampaignAdapter(context.owner).start(accountId,
      { ...form(), saveSlotId: "slot-2" });
    check(second.status === "ready", `second campaign setup failed: ${JSON.stringify(second)}`);
    const result = await new CleanEpochDescendantAdapter(context.owner).save({
      ...request(context, "slot-2"), expectedAccountRevision: 3,
      expectedDestinationAddress: { artifactId: second.value.loaded.sessionControl.loadedArtifactId,
        publicationId: second.value.loaded.sessionControl.loadedPublicationId } });
    check(result.status === "blocked" && result.code === "conflict" &&
      (await context.owner.readSlot(accountId, "slot-2")).loaded?.sessionControl.loadedArtifactId ===
        second.value.loaded.sessionControl.loadedArtifactId,
      "cross-campaign destination was overwritten");
    context.owner.close();
  });
  await test("unrelated pending destination recovery blocks a cross-slot save", async () => {
    const context = await setup("other-pending");
    const original = context.owner.completePreparedAttemptConsumers.bind(context.owner);
    context.owner.completePreparedAttemptConsumers = async () => { throw new Error("synthetic pending second campaign"); };
    const second = await new CleanEpochFirstCampaignAdapter(context.owner).start(accountId,
      { ...form(), saveSlotId: "slot-2" });
    check(second.status === "blocked" && (await context.owner.readSlot(accountId, "slot-2")).status ===
      "pending_consumers", "second campaign did not retain pending address");
    context.owner.completePreparedAttemptConsumers = original;
    const result = await new CleanEpochDescendantAdapter(context.owner).save({
      ...request(context, "slot-2"), expectedDestinationAddress: null });
    check(result.status === "blocked" && result.code === "conflict" &&
      (await context.owner.readSlot(accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1,
      "unrelated pending destination allowed publication");
    context.owner.close();
  });
  await test("cross-slot lost caller resumes exact destination after restart", async () => {
    const context = await setup("cross-restart");
    const originalPublish = context.owner.publishDescendant.bind(context.owner);
    let captured: Parameters<typeof context.owner.publishDescendant>[0] | undefined;
    context.owner.publishDescendant = async value => { captured = value; return originalPublish(value); };
    const original = context.owner.completeDescendantConsumers.bind(context.owner);
    context.owner.completeDescendantConsumers = async () => { throw new Error("synthetic lost caller"); };
    const interrupted = await new CleanEpochDescendantAdapter(context.owner).save({
      ...request(context, "quick-save"), expectedDestinationAddress: null });
    check(interrupted.status === "blocked" &&
      (await context.owner.readSlot(accountId, "quick-save")).status === "pending_consumers",
      "cross-slot pending publication was not retained");
    context.owner.completeDescendantConsumers = original;
    context.owner.close();
    const failing = await openCleanEpochAccountStore({ name: context.databaseName,
      afterWrite: tx => tx.abort() });
    const failedResume = await new CleanEpochDescendantAdapter(failing).resumeCurrent(accountId, "quick-save");
    check(failedResume.status === "blocked" && failedResume.code === "aborted" &&
      (await failing.read(accountId))?.revision === 2,
      "consumer abort partially completed cross-slot account");
    failing.close();
    const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
    check(captured !== undefined &&
      (await reopened.publishDescendant(captured)).publication.status === "same_source_retry",
      "same-source cross-slot retry minted a second publication");
    const pending = await reopened.readCurrentDescendantRecovery(accountId, "quick-save");
    check(pending?.status === "accepted_pending_consumers" && pending.expectedSlotAddress === null &&
      await reopened.readCurrentDescendantRecovery(accountId, "slot-1") === null,
      "pending recovery was attributed to the wrong address");
    const resumed = await new CleanEpochDescendantAdapter(reopened).resumeCurrent(accountId, "quick-save");
    check(resumed.status === "ready" && resumed.value.loaded.publication.publicationId === pending.publicationId &&
      (await reopened.read(accountId))?.revision === 3,
      "cross-slot restart did not complete exact accepted publication");
    reopened.close();
  });
  await test("malformed destination address and stale source reject without fallback", async () => {
    const context = await setup("malformed-address");
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const opened = indexedDB.open(context.databaseName);
      opened.onsuccess = () => resolve(opened.result); opened.onerror = () => reject(opened.error);
    });
    const tx = db.transaction("slots", "readwrite");
    tx.objectStore("slots").put({ version: 1, accountId, slotId: "quick-save",
      campaignId: context.first.loaded.sessionControl.campaignId,
      artifactId: "artifact.missing", publicationId: "publication.missing", raw: "{}" });
    await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
    const result = await new CleanEpochDescendantAdapter(context.owner).save({
      ...request(context, "quick-save"), expectedDestinationAddress: null });
    check(result.status === "blocked" && result.code === "invalid_record" &&
      (await context.owner.readSlot(accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1,
      "malformed destination became empty or advanced the campaign");
    db.close(); context.owner.close();
    const fresh = await setup("stale-cross-source");
    const quick = await new CleanEpochDescendantAdapter(fresh.owner).save({
      ...request(fresh, "quick-save"), expectedDestinationAddress: null });
    check(quick.status === "ready", "fresh quick head missing");
    const stale = await new CleanEpochDescendantAdapter(fresh.owner).save({ ...request(fresh, "quick-save"),
      expectedAccountRevision: 3, expectedDestinationAddress: {
        artifactId: quick.value.loaded.sessionControl.loadedArtifactId,
        publicationId: quick.value.loaded.sessionControl.loadedPublicationId } });
    check(stale.status === "blocked" && stale.code === "stale_head" &&
      (await fresh.owner.readSlot(accountId, "quick-save")).loaded?.sessionControl.campaignHeadRevision === 2,
      "stale source advanced quick head");
    fresh.owner.close();
  });
  await test("cross-slot abort and quota at every publication write roll back both addresses", async () => {
    for (const mode of ["aborted", "quota"] as const) for (let stop = 1; stop <= 4; stop++) {
      const context = await setup(`cross-${mode}-${stop}`);
      context.owner.close();
      let writes = 0;
      const failing = await openCleanEpochAccountStore({ name: context.databaseName,
        ...(mode === "quota" ? { beforeWrite: () => {
          if (++writes === stop) throw new DOMException("quota", "QuotaExceededError");
        } } : { afterWrite: (tx: IDBTransaction) => { if (++writes === stop) tx.abort(); } }) });
      const result = await new CleanEpochDescendantAdapter(failing).save({
        ...request(context, "quick-save"), expectedDestinationAddress: null });
      check(result.status === "blocked" && result.code === mode,
        `${mode} at publication write ${stop} did not stop cross-slot save`);
      failing.close();
      const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
      check((await reopened.readSlot(accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1 &&
        (await reopened.readSlot(accountId, "quick-save")).status === "empty" &&
        (await reopened.read(accountId))?.revision === 2,
        `${mode} at write ${stop} left partial cross-slot authority`);
      reopened.close();
    }
  });
  await test("non-head gameplay mutation forks while retaining both prior artifacts", async () => {
    const context = await setup("fork");
    const second = await new CleanEpochDescendantAdapter(context.owner).save(request(context));
    check(second.status === "ready", "second head did not save");
    const historical = await context.owner.readHistoricalArtifact(accountId, "slot-1",
      context.first.loaded.sessionControl.loadedArtifactId);
    const source = historical.snapshot;
    const control = historical.sessionControl;
    const proposed = structuredClone(source);
    proposed.playerState.currency.gold += 1;
    const admitted = admitCampaignMutation(control, { mutationId: `mutation.${crypto.randomUUID()}`,
      sourceArtifactId: control.loadedArtifactId, sourceRevision: control.sessionRevision,
      ownerKind: "legacy_bridge", accepted: true, sourceSnapshot: source, proposedSnapshot: proposed });
    check(admitted.accepted && admitted.snapshot.campaignIdentity?.forkedFromArtifactId === control.loadedArtifactId,
      "ordinary mutation did not fork the historical source");
    const fork = await new CleanEpochDescendantAdapter(context.owner).save({ accountId,
      sourceSlotId: "slot-1", destinationSlotId: "slot-1", expectedAccountRevision: 3,
      snapshot: admitted.snapshot, control: admitted.control });
    check(fork.status === "ready" && fork.value.loaded.sessionControl.campaignHeadRevision === 3 &&
      fork.value.loaded.snapshot.campaignIdentity?.forkedFromArtifactId === control.loadedArtifactId &&
      (await context.owner.readHistoricalArtifact(accountId, "slot-1",
        second.value.loaded.sessionControl.loadedArtifactId)).publication.publicationId ===
          second.value.loaded.publication.publicationId,
      `non-head fork failed or displaced history: ${JSON.stringify(fork)}`);
    context.owner.close();
  });
  await test("lost caller after acceptance resumes exact pending descendant on restart", async () => {
    const context = await setup("lost-caller");
    const original = context.owner.completeDescendantConsumers.bind(context.owner);
    context.owner.completeDescendantConsumers = async () => { throw new Error("synthetic caller loss"); };
    const blocked = await new CleanEpochDescendantAdapter(context.owner).save(request(context));
    check(blocked.status === "blocked" && (await context.owner.readSlot(accountId, "slot-1")).status === "pending_consumers",
      "caller loss did not retain accepted pending head");
    context.owner.completeDescendantConsumers = original;
    context.owner.close();
    const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
    const retained = await reopened.readCurrentDescendantRecovery(accountId, "slot-1");
    check(retained?.status === "accepted_pending_consumers", "current pending recovery was not discoverable");
    const resumed = await new CleanEpochDescendantAdapter(reopened).resumeCurrent(accountId, "slot-1");
    check(resumed.status === "ready" && resumed.value.loaded.publication.publicationId === retained.publicationId &&
      (await reopened.read(accountId))?.revision === 3, "restart did not complete exact accepted descendant");
    const duplicate = await new CleanEpochDescendantAdapter(reopened).resumeCurrent(accountId, "slot-1");
    check(duplicate.status === "blocked" && (await reopened.read(accountId))?.revision === 3,
      "duplicate resume changed completed account");
    reopened.close();
  });
  await test("two owners permit one descendant head and one account completion", async () => {
    const context = await setup("contended");
    const other = await openCleanEpochAccountStore({ name: context.databaseName });
    const results = await Promise.all([
      new CleanEpochDescendantAdapter(context.owner).save(request(context)),
      new CleanEpochDescendantAdapter(other).save(request(context))
    ]);
    check(results.filter(result => result.status === "ready").length === 1 &&
      results.filter(result => result.status === "blocked").length === 1 &&
      (await context.owner.read(accountId))?.revision === 3 &&
      (await context.owner.readSlot(accountId, "slot-1")).status === "ready",
      "contending owners duplicated or lost descendant publication");
    context.owner.close(); other.close();
  });
  await test("stale account revision blocks before publication", async () => {
    const context = await setup("stale-account");
    await context.owner.updateProfile(accountId, 2, { ...context.account.profile, displayName: "Changed" });
    const blocked = await new CleanEpochDescendantAdapter(context.owner).save(request(context));
    check(blocked.status === "blocked" && blocked.code === "stale_head" &&
      (await context.owner.readSlot(accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1,
      "stale account save changed head");
    context.owner.close();
  });
  await test("publication abort and quota leave the prior head retryable", async () => {
    for (const mode of ["aborted", "quota"] as const) {
      const context = await setup(mode);
      context.owner.close();
      const failing = await openCleanEpochAccountStore({ name: context.databaseName,
        ...(mode === "quota" ? { beforeWrite: () => { throw new DOMException("quota", "QuotaExceededError"); } }
          : { afterWrite: (tx: IDBTransaction) => tx.abort() }) });
      const blocked = await new CleanEpochDescendantAdapter(failing).save(request(context));
      check(blocked.status === "blocked" && blocked.code === mode,
        `${mode} did not block the descendant caller`);
      failing.close();
      const reopened = await openCleanEpochAccountStore({ name: context.databaseName });
      check((await reopened.readSlot(accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1 &&
        (await reopened.read(accountId))?.revision === 2, `${mode} changed prior accepted authority`);
      const retried = await new CleanEpochDescendantAdapter(reopened).save(request(context));
      check(retried.status === "ready" && retried.value.loaded.sessionControl.campaignHeadRevision === 2,
        `${mode} could not retry from the verified source`);
      reopened.close();
    }
  });
  await test("closed owner cannot create a fallback publication", async () => {
    const context = await setup("unavailable"); context.owner.close();
    const blocked = await new CleanEpochDescendantAdapter(context.owner).save(request(context));
    check(blocked.status === "blocked" && blocked.code === "unavailable", "closed owner saved a campaign");
  });
}

suite().then(() => { output.textContent = `PASS ${cases.length}\n${cases.join("\n")}`; })
  .catch(error => { output.textContent = `FAIL after ${cases.length}: ${error instanceof Error ? error.stack : String(error)}`; });
