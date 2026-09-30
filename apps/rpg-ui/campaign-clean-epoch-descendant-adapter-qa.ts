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
  await test("cross-slot quick save blocks without changing the manual head", async () => {
    const context = await setup("quick-slot");
    const blocked = await new CleanEpochDescendantAdapter(context.owner).save(request(context, "quick-save"));
    check(blocked.status === "blocked" && blocked.code === "conflict" &&
      (await context.owner.readSlot(accountId, "slot-1")).loaded?.sessionControl.campaignHeadRevision === 1 &&
      (await context.owner.readSlot(accountId, "quick-save")).status === "empty",
      "unsupported quick destination changed epoch authority");
    context.owner.close();
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
