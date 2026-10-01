import { getLineageIdentityCatalog, createDefaultStartingBundleChoiceSelections } from "./src/game-shell/characterCreationCatalog.ts";
import { createDefaultCharacterCreationFormState } from "./src/game-shell/characterCreationForm.ts";
import { CleanEpochAccountAdapter, createEpochAccountId } from "./src/game-shell/cleanEpochAccountAdapter.ts";
import { CLEAN_EPOCH_SESSION_STORAGE_KEY, CleanEpochAccountStore,
  openCleanEpochAccountStore } from "./src/game-shell/cleanEpochAccountStore.ts";
import { CleanEpochDescendantAdapter } from "./src/game-shell/cleanEpochDescendantAdapter.ts";
import { CleanEpochFirstCampaignAdapter } from "./src/game-shell/cleanEpochFirstCampaignAdapter.ts";

const output = document.querySelector<HTMLPreElement>("#qa-result")!;
const params = new URLSearchParams(location.search);
const scenario = params.get("scenario") ?? "ready";
if (!["ready", "prepared", "pending-first", "pending-descendant", "pending-cross-slot", "account-only"].includes(scenario))
  throw new Error("Unknown local QA scenario.");
let run = params.get("run");
if (!run) {
  run = crypto.randomUUID();
  params.set("run", run);
  history.replaceState(null, "", `${location.pathname}?${params}`);
}
const marker = `lineage.epoch-app-failure.qa.${scenario}.${run}`;
const writeLog: string[] = [];
const allowedKeys = new Set([CLEAN_EPOCH_SESSION_STORAGE_KEY,
  "cataclysm-rpg.theme-mode", "cataclysm-rpg.launcher-time-settings.v1"]);
const originalSet = Storage.prototype.setItem;
const originalRemove = Storage.prototype.removeItem;
const originalClear = Storage.prototype.clear;
const originalPut = IDBObjectStore.prototype.put;
let armed: "quota" | "abort" | null = null;
let consumerLoss = false;
let staleDestination = false;
let staleHead = false;
let accountId = localStorage.getItem(marker);

function form() {
  const identity = getLineageIdentityCatalog("lineage.human")!;
  const startingBundleId = "starting_bundle.traveler";
  return { ...createDefaultCharacterCreationFormState("slot-1"), playerName: "Epoch Fault Tester",
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: "backstory.craftsmans_child", continentId: "region.myridian_chain",
    regionId: "region.starfall_isle", startingSettlementId: "settlement.starfall_port" };
}

async function inspect(label: string) {
  const owner = await openCleanEpochAccountStore();
  try {
    const account = accountId ? await owner.read(accountId) : null;
    const slot = accountId ? await owner.readSlot(accountId, "slot-1") : null;
    const quick = accountId ? await owner.readSlot(accountId, "quick-save") : null;
    const recovery = accountId ? await owner.readRecovery(accountId, "slot-1") : null;
    const descendant = accountId ? await owner.readCurrentDescendantRecovery(accountId, "slot-1") : null;
    const quickDescendant = accountId ? await owner.readCurrentDescendantRecovery(accountId, "quick-save") : null;
    const attempt = accountId ? await owner.readAttempt(accountId, "slot-1") : null;
    output.textContent = JSON.stringify({ label, scenario, accountId, accountRevision: account?.revision,
      slotStatus: slot?.status, slotArtifact: slot?.status === "ready" ? slot.loaded.sessionControl.loadedArtifactId : null,
      quickStatus: quick?.status, quickArtifact: quick?.status === "ready" ? quick.loaded.sessionControl.loadedArtifactId : null,
      quickPublicationId: quick?.status === "ready" ? quick.loaded.publication.publicationId : null,
      firstRecovery: recovery?.status,
      firstAttemptId: attempt?.attemptId, firstPublicationId: recovery?.publicationId,
      descendantRecovery: descendant?.status, descendantPublicationId: descendant?.publicationId,
      quickDescendantRecovery: quickDescendant?.status, quickDescendantPublicationId: quickDescendant?.publicationId,
      receipts: account?.profile.campaignPublicationReceipts?.length,
      unexpectedLocalStorageWrites: writeLog }, null, 2);
  } finally { owner.close(); }
}

async function seed() {
  const owner = await openCleanEpochAccountStore();
  try {
    if (!accountId || !await owner.read(accountId)) {
      accountId = createEpochAccountId();
      const registered = await new CleanEpochAccountAdapter(owner).register({ accountId,
        displayName: `G8F.1 ${scenario}`, password: "synthetic QA password",
        confirmPassword: "synthetic QA password", stayLoggedIn: true });
      if (registered.status !== "ready") throw new Error(registered.message);
      if (scenario !== "account-only") {
        if (scenario === "prepared") {
          owner.publishPreparedAttempt = async () => { throw new Error("synthetic lost prepared caller"); };
        } else if (scenario === "pending-first") {
          owner.completePreparedAttemptConsumers = async () => { throw new Error("synthetic lost first caller"); };
        }
        const first = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
        if (scenario === "prepared") {
          if (first.status !== "blocked" || (await owner.readSlot(accountId, "slot-1")).status !== "prepared")
            throw new Error("Creator attempt was not retained as prepared.");
        } else if (scenario === "pending-first") {
          if (first.status !== "blocked" || (await owner.readSlot(accountId, "slot-1")).status !== "pending_consumers")
            throw new Error("First publication did not retain pending authority.");
        } else if (first.status !== "ready") throw new Error(`First campaign failed: ${JSON.stringify(first)}`);
        if ((scenario === "pending-descendant" || scenario === "pending-cross-slot") && first.status === "ready") {
          const current = await owner.read(accountId);
          if (!current) throw new Error("Seeded account disappeared.");
          owner.completeDescendantConsumers = async () => { throw new Error("synthetic lost descendant caller"); };
          const destinationSlotId = scenario === "pending-cross-slot" ? "quick-save" : "slot-1";
          const saved = await new CleanEpochDescendantAdapter(owner).save({ accountId,
            sourceSlotId: "slot-1", destinationSlotId, expectedAccountRevision: current.revision,
            expectedDestinationAddress: destinationSlotId === "quick-save" ? null : {
              artifactId: first.value.loaded.sessionControl.loadedArtifactId,
              publicationId: first.value.loaded.sessionControl.loadedPublicationId },
            snapshot: first.value.loaded.snapshot, control: first.value.loaded.sessionControl });
          if (saved.status !== "blocked" ||
              (await owner.readSlot(accountId, destinationSlotId)).status !== "pending_consumers")
            throw new Error("Descendant publication did not retain pending authority.");
        }
      }
      originalSet.call(localStorage, marker, accountId);
    }
    originalSet.call(localStorage, CLEAN_EPOCH_SESSION_STORAGE_KEY,
      JSON.stringify({ version: 1, accountId, issuedAt: new Date().toISOString() }));
  } finally { owner.close(); }
}

await seed();
Storage.prototype.setItem = function(key: string, value: string) {
  if (this === localStorage && !allowedKeys.has(key)) writeLog.push(`set:${key}`);
  return originalSet.call(this, key, value);
};
Storage.prototype.removeItem = function(key: string) {
  if (this === localStorage && !allowedKeys.has(key)) writeLog.push(`remove:${key}`);
  return originalRemove.call(this, key);
};
Storage.prototype.clear = function() {
  if (this === localStorage) writeLog.push("clear");
  return originalClear.call(this);
};
IDBObjectStore.prototype.put = function(value: unknown, key?: IDBValidKey) {
  if (armed && this.name === "artifacts") {
    const fault = armed;
    armed = null;
    if (fault === "quota") throw new DOMException("synthetic artifact quota", "QuotaExceededError");
    const request = key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
    queueMicrotask(() => { try { this.transaction.abort(); } catch { /* already settled */ } });
    return request;
  }
  return key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
};
const originalComplete = CleanEpochAccountStore.prototype.completeDescendantConsumers;
CleanEpochAccountStore.prototype.completeDescendantConsumers = async function(...args) {
  if (consumerLoss) { consumerLoss = false; throw new Error("synthetic lost descendant caller"); }
  return originalComplete.apply(this, args);
};
const originalSave = CleanEpochDescendantAdapter.prototype.save;
CleanEpochDescendantAdapter.prototype.save = async function(input) {
  if (staleHead) {
    staleHead = false;
    return originalSave.call(this, { ...input, control: { ...input.control,
      campaignHeadRevision: input.control.campaignHeadRevision + 1 } });
  }
  if (staleDestination) {
    staleDestination = false;
    return originalSave.call(this, { ...input, expectedDestinationAddress: {
      artifactId: "artifact.synthetic-stale", publicationId: "publication.synthetic-stale" } });
  }
  return originalSave.call(this, input);
};
document.querySelector<HTMLButtonElement>("#arm-quota")!.onclick = () => { armed = "quota"; output.textContent = "Artifact quota armed for the next App write."; };
document.querySelector<HTMLButtonElement>("#arm-abort")!.onclick = () => { armed = "abort"; output.textContent = "Artifact abort armed for the next App write."; };
document.querySelector<HTMLButtonElement>("#arm-consumer-loss")!.onclick = () => { consumerLoss = true; output.textContent = "Descendant caller loss armed for the next App save."; };
document.querySelector<HTMLButtonElement>("#arm-stale-destination")!.onclick = () => { staleDestination = true; output.textContent = "Stale destination armed for the next App save."; };
document.querySelector<HTMLButtonElement>("#arm-stale-head")!.onclick = () => { staleHead = true; output.textContent = "Stale campaign head armed for the next App save."; };
document.querySelector<HTMLButtonElement>("#inspect-epoch")!.onclick = () => { void inspect("retained epoch"); };
await inspect("seed before App");
await import("./src/main.tsx");
