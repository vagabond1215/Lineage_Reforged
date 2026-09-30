import { createDefaultAccountProfileState, grantLegacy } from "../../packages/engines/game-engine/src/legacy-account.ts";
import { purchaseLegacyUnlock, selectLegacyPreparation } from "../../packages/engines/game-engine/src/legacy-unlocks.ts";
import { verifySoundingsAdmissionProvenance } from "../../packages/engines/game-engine/src/soundings-admission-witness.ts";
import { deserializeSnapshot } from "../../packages/shared/persistence/src/index.ts";
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from "./src/game-shell/characterCreationCatalog.ts";
import { createDefaultCharacterCreationFormState } from "./src/game-shell/characterCreationForm.ts";
import { CleanEpochAccountAdapter } from "./src/game-shell/cleanEpochAccountAdapter.ts";
import { CleanEpochFirstCampaignAdapter } from "./src/game-shell/cleanEpochFirstCampaignAdapter.ts";
import type { EpochFirstCampaignResult } from "./src/game-shell/cleanEpochFirstCampaignAdapter.ts";
import { openCleanEpochAccountStore } from "./src/game-shell/cleanEpochAccountStore.ts";
import { createCredentialRecord } from "./src/game-shell/launcherAuthManager.ts";

const output = document.querySelector<HTMLPreElement>("#result")!;
const cases: string[] = [];
const check = (value: unknown, message: string) => { if (!value) throw new Error(message); };
function mustReady<T>(result: EpochFirstCampaignResult<T>): T {
  if (result.status !== "ready") throw new Error(`Expected ready result: ${JSON.stringify(result)}`);
  return result.value;
}
const name = (label: string) => `lineage.clean-epoch-first.qa.${label}.${crypto.randomUUID()}`;
async function test(label: string, run: () => Promise<void>) { await run(); cases.push(label); }
const accountId = `account.local.${crypto.randomUUID()}`;
function form(playerName = "Mara Soundinghand") {
  const identity = getLineageIdentityCatalog("lineage.human")!;
  const startingBundleId = "starting_bundle.traveler";
  return { ...createDefaultCharacterCreationFormState("slot-1"), playerName,
    hairColorId: identity.hairColorOptions[0]!.id,
    eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id,
    startingBundleId, startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: "backstory.craftsmans_child", continentId: "region.myridian_chain",
    regionId: "region.starfall_isle", startingSettlementId: "settlement.starfall_port" };
}
async function account(owner: Awaited<ReturnType<typeof openCleanEpochAccountStore>>) {
  await owner.register(createDefaultAccountProfileState({ accountId, displayName: "Epoch tester" }),
    await createCredentialRecord(accountId, "synthetic-only-password", new Date().toISOString()));
}

async function suite() {
  await test("prepared creator retains exact identity across restart and fences account edits", async () => {
    const databaseName = name("prepared"); let owner = await openCleanEpochAccountStore({ name: databaseName });
    await account(owner); let adapter = new CleanEpochFirstCampaignAdapter(owner);
    const prepared = await adapter.prepare(accountId, form());
    check(prepared.status === "ready", `creator preparation failed: ${JSON.stringify(prepared)}`);
    const attempt = mustReady(prepared);
    check(verifySoundingsAdmissionProvenance(deserializeSnapshot(attempt.snapshotRaw)) === "not_completed", "creator completed Soundings");
    check((await owner.readSlot(accountId, "slot-1")).status === "prepared", "prepared attempt became playable");
    const profile = (await owner.read(accountId))!.profile;
    const edit = await new CleanEpochAccountAdapter(owner).updateProfile(accountId, 1, { ...profile, displayName: "Later" });
    check(edit.status === "blocked" && edit.code === "conflict", "prepared account edit bypassed fence");
    const password = await new CleanEpochAccountAdapter(owner).changePassword({ accountId, expectedRevision: 1,
      currentPassword: "synthetic-only-password", newPassword: "different-synthetic-password",
      confirmPassword: "different-synthetic-password" });
    check(password.status === "blocked" && password.code === "conflict", "prepared password edit bypassed fence");
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName }); adapter = new CleanEpochFirstCampaignAdapter(owner);
    const signedIn = await new CleanEpochAccountAdapter(owner).signIn({ accountId, password: "synthetic-only-password", stayLoggedIn: false });
    check(signedIn.status === "ready" && signedIn.value.account.revision === 1, "sign-in changed reserved revision");
    const retry = await adapter.prepare(accountId, form());
    check(retry.status === "ready" && retry.value.attemptId === attempt.attemptId && retry.value.snapshotRaw === attempt.snapshotRaw,
      "lost caller regenerated creator authority");
    const rival = await adapter.prepare(accountId, form("Different person"));
    check(rival.status === "blocked" && rival.code === "conflict", "conflicting input replaced reservation");
    const ready = await adapter.resume(accountId, "slot-1");
    check(ready.status === "ready" && ready.value.loaded.snapshot.campaignIdentity?.campaignId === attempt.campaignId,
      `prepared restart did not complete: ${JSON.stringify(ready)}`);
    check((await owner.read(accountId))?.revision === 2, "account consumers did not complete once");
    const completed = await adapter.start(accountId, form());
    check(completed.status === "ready" && completed.value.loaded.publication.publicationId === mustReady(ready).loaded.publication.publicationId,
      "completed retry changed accepted publication");
    owner.close();
  });
  await test("two owners serialize same creator input and preserve one campaign", async () => {
    const databaseName = name("contended"); const left = await openCleanEpochAccountStore({ name: databaseName });
    const right = await openCleanEpochAccountStore({ name: databaseName }); await account(left);
    const [first, second] = await Promise.all([
      new CleanEpochFirstCampaignAdapter(left).prepare(accountId, form()),
      new CleanEpochFirstCampaignAdapter(right).prepare(accountId, form())]);
    check(first.status === "ready" && second.status === "ready" && first.value.attemptId === second.value.attemptId,
      "same-input contenders retained different attempts");
    const [one, two] = await Promise.all([
      new CleanEpochFirstCampaignAdapter(left).resume(accountId, "slot-1"),
      new CleanEpochFirstCampaignAdapter(right).resume(accountId, "slot-1")]);
    check(one.status === "ready" && two.status === "ready" &&
      one.value.loaded.publication.publicationId === two.value.loaded.publication.publicationId,
      `contenders did not converge: ${JSON.stringify([one, two])}`);
    left.close(); right.close();
  });
  await test("consumer abort leaves accepted publication reachable after restart", async () => {
    const databaseName = name("consumer-abort"); const initial = await openCleanEpochAccountStore({ name: databaseName });
    await account(initial); const preparation = await new CleanEpochFirstCampaignAdapter(initial).prepare(accountId, form());
    check(preparation.status === "ready", "preparation failed"); initial.close();
    let writes = 0;
    const failing = await openCleanEpochAccountStore({ name: databaseName,
      afterWrite: tx => { if (++writes === 6) tx.abort(); } });
    const blocked = await new CleanEpochFirstCampaignAdapter(failing).resume(accountId, "slot-1");
    check(blocked.status === "blocked" && blocked.code === "aborted", `consumer abort did not block: ${JSON.stringify(blocked)}`);
    failing.close(); const recovered = await openCleanEpochAccountStore({ name: databaseName });
    const pending = await recovered.readRecovery(accountId, "slot-1");
    check(pending?.status === "accepted_pending_consumers" &&
      (await recovered.readSlot(accountId, "slot-1")).status === "pending_consumers", "abort did not retain pending authority");
    const profile = (await recovered.read(accountId))!.profile;
    const edit = await new CleanEpochAccountAdapter(recovered).updateProfile(accountId, 1,
      { ...profile, displayName: "Pending edit" });
    check(edit.status === "blocked" && edit.code === "conflict", "pending consumers allowed profile edit");
    const password = await new CleanEpochAccountAdapter(recovered).changePassword({ accountId, expectedRevision: 1,
      currentPassword: "synthetic-only-password", newPassword: "different-synthetic-password",
      confirmPassword: "different-synthetic-password" });
    check(password.status === "blocked" && password.code === "conflict", "pending consumers allowed password edit");
    const resumed = await new CleanEpochFirstCampaignAdapter(recovered).resume(accountId, "slot-1");
    check(resumed.status === "ready" && resumed.value.loaded.publication.publicationId === pending.publicationId,
      "restart did not finish exact accepted publication"); recovered.close();
  });
  await test("selected preparation and retired-run inheritance consume once from retained account", async () => {
    const owner = await openCleanEpochAccountStore({ name: name("lineage") });
    const granted = grantLegacy(createDefaultAccountProfileState({ accountId }), {
      amount: 100, summary: "Synthetic grant", sourceType: "test", sourceId: "qa.grant",
      recordedAt: "2026-09-30T00:00:00.000Z" });
    check(granted.ok, "synthetic Legacy grant failed");
    const capacity = purchaseLegacyUnlock(granted.profile, "legacy.unlock.lineage.prepared_lineage", "2026-09-30T00:01:00.000Z");
    check(capacity.ok, "preparation capacity purchase failed");
    const purchased = purchaseLegacyUnlock(capacity.profile, "legacy.unlock.preparation.storehouse_keys", "2026-09-30T00:02:00.000Z");
    check(purchased.ok, "preparation purchase failed");
    const selected = selectLegacyPreparation(purchased.profile, "legacy.unlock.preparation.storehouse_keys");
    check(selected.ok, "preparation selection failed");
    await owner.register(selected.profile, await createCredentialRecord(accountId, "synthetic-only-password", new Date().toISOString()));
    const adapter = new CleanEpochFirstCampaignAdapter(owner);
    const first = await adapter.start(accountId, form());
    check(first.status === "ready" && first.value.loaded.snapshot.playerState.saveMeta.appliedLegacyPreparationIds?.includes(
      "legacy.unlock.preparation.storehouse_keys"), `selected preparation did not reach first artifact: ${JSON.stringify(first)}`);
    const completed = (await owner.read(accountId))!;
    check(completed.profile.legacy.selectedPreparationUnlockIds.length === 0, "selected preparation was not consumed");
    const prior = completed.profile.history.runRecords[0]!;
    const retired = { ...prior, outcome: "retired" as const, endedAt: new Date().toISOString(), inheritanceUsesRemaining: 1 };
    await owner.updateProfile(accountId, completed.revision, { ...completed.profile, history: {
      ...completed.profile.history, runRecords: [retired] } });
    const heir = { ...form("Mara's heir"), saveSlotId: "slot-2" as const,
      sourceRunId: `${retired.characterId}::${retired.startedAt}` };
    const second = await adapter.start(accountId, heir);
    check(second.status === "ready" && second.value.loaded.snapshot.playerState.saveMeta.sourceRunId === heir.sourceRunId,
      `heir campaign did not publish: ${JSON.stringify(second)}`);
    const final = (await owner.read(accountId))!.profile;
    check(final.history.runRecords.length === 2 &&
      final.history.runRecords.find(run => run.characterId === retired.characterId)?.inheritanceUsesRemaining === 0,
      "retired source was not consumed once");
    const retry = await adapter.start(accountId, heir);
    check(retry.status === "ready" && retry.value.loaded.publication.publicationId === mustReady(second).loaded.publication.publicationId,
      "heir retry republished accepted source");
    owner.close();
  });
  await test("attempt and publication quota leave a resumable reservation", async () => {
    const databaseName = name("quota"); const initial = await openCleanEpochAccountStore({ name: databaseName });
    await account(initial); initial.close();
    const denied = await openCleanEpochAccountStore({ name: databaseName,
      beforeWrite: () => { throw new DOMException("synthetic quota", "QuotaExceededError"); } });
    const first = await new CleanEpochFirstCampaignAdapter(denied).prepare(accountId, form());
    check(first.status === "blocked" && first.code === "quota" && await denied.readAttempt(accountId, "slot-1") === null,
      "quota left partial attempt"); denied.close();
    const preparedOwner = await openCleanEpochAccountStore({ name: databaseName });
    const prepared = await new CleanEpochFirstCampaignAdapter(preparedOwner).prepare(accountId, form());
    check(prepared.status === "ready", "retry could not reserve attempt"); preparedOwner.close();
    const publishDenied = await openCleanEpochAccountStore({ name: databaseName,
      beforeWrite: () => { throw new DOMException("synthetic quota", "QuotaExceededError"); } });
    const blocked = await new CleanEpochFirstCampaignAdapter(publishDenied).resume(accountId, "slot-1");
    check(blocked.status === "blocked" && blocked.code === "quota" &&
      (await publishDenied.readAttempt(accountId, "slot-1"))?.attemptId === mustReady(prepared).attemptId &&
      await publishDenied.readRecovery(accountId, "slot-1") === null, "publication quota lost or partly published attempt");
    publishDenied.close(); const recovered = await openCleanEpochAccountStore({ name: databaseName });
    const ready = await new CleanEpochFirstCampaignAdapter(recovered).resume(accountId, "slot-1");
    check(ready.status === "ready", "publication quota retry could not complete"); recovered.close();
  });
  output.textContent = `PASS ${cases.length}\n${cases.join("\n")}`;
}
suite().catch(error => { output.textContent = `FAIL after ${cases.length}\n${error instanceof Error ? error.stack : String(error)}`; });
