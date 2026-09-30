import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from "./src/game-shell/characterCreationCatalog.ts";
import { createDefaultCharacterCreationFormState } from "./src/game-shell/characterCreationForm.ts";
import { CleanEpochAccountAdapter, createEpochAccountId } from "./src/game-shell/cleanEpochAccountAdapter.ts";
import { CleanEpochFirstCampaignAdapter } from "./src/game-shell/cleanEpochFirstCampaignAdapter.ts";
import { openCleanEpochAccountStore } from "./src/game-shell/cleanEpochAccountStore.ts";
import { CleanEpochLauncherRead } from "./src/game-shell/cleanEpochLauncherRead.ts";

const output = document.querySelector<HTMLPreElement>("#result")!;
const cases: string[] = [];
const check = (value: unknown, message: string) => { if (!value) throw new Error(message); };
async function test(label: string, run: () => Promise<void>) { await run(); cases.push(label); }
class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
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

async function suite() {
  const databaseName = `lineage.epoch-launcher-read.qa.${crypto.randomUUID()}`;
  const storage = new MemoryStorage();
  let owner = await openCleanEpochAccountStore({ name: databaseName });
  let accountAdapter = new CleanEpochAccountAdapter(owner, storage);
  let reader = new CleanEpochLauncherRead(owner, accountAdapter);
  const accountId = createEpochAccountId();
  await test("empty picker is verified and has no default account", async () => {
    const result = await reader.bootstrap();
    check(result.status === "ready" && result.value.mode === "pick_account" && result.value.accounts.length === 0,
      "empty picker was not read from epoch authority");
  });
  await test("registration and selected session list only verified empty epoch slots", async () => {
    const registered = await accountAdapter.register({ accountId, displayName: "Epoch tester",
      password: "synthetic-only-password", confirmPassword: "synthetic-only-password", stayLoggedIn: true });
    check(registered.status === "ready", "registration failed");
    const result = await reader.bootstrap();
    check(result.status === "ready" && result.value.mode === "signed_in" &&
      result.value.inventory.account.accountId === accountId && result.value.inventory.slots.length === 129 &&
      result.value.inventory.slots.every(slot => slot.status === "empty"), "verified empty inventory was lost");
  });
  await test("prepared slot stays visible and cannot load as an empty slot", async () => {
    const prepared = await new CleanEpochFirstCampaignAdapter(owner).prepare(accountId, form());
    check(prepared.status === "ready", "creator preparation failed");
    const inventory = await reader.inventory(accountId, 1);
    check(inventory.status === "ready" && inventory.value.slots[0]?.status === "prepared", "prepared slot became empty");
    const load = await reader.load(accountId, 1, "slot-1");
    check(load.status === "blocked" && load.slotStatus === "prepared" && load.code === "conflict",
      "prepared campaign became playable");
  });
  await test("restart and exact completion expose one ready loaded campaign", async () => {
    owner.close(); owner = await openCleanEpochAccountStore({ name: databaseName });
    accountAdapter = new CleanEpochAccountAdapter(owner, storage);
    reader = new CleanEpochLauncherRead(owner, accountAdapter);
    const completed = await new CleanEpochFirstCampaignAdapter(owner).resume(accountId, "slot-1");
    check(completed.status === "ready", "prepared campaign did not resume");
    const selected = await reader.bootstrap();
    check(selected.status === "ready" && selected.value.mode === "signed_in" &&
      selected.value.inventory.slots[0]?.status === "ready", "completed campaign was not inventoried");
    const stale = await reader.load(accountId, 1, "slot-1");
    check(stale.status === "blocked" && stale.code === "stale_head", "stale account revision loaded");
    const revision = (await owner.read(accountId))!.revision;
    const loaded = await reader.load(accountId, revision, "slot-1");
    check(loaded.status === "ready" && loaded.value.slot.loaded.publication.publicationId ===
      completed.value.loaded.publication.publicationId, "ready load differed from completed authority");
  });
  await test("another account cannot read selected campaign", async () => {
    const otherId = createEpochAccountId();
    const other = await accountAdapter.register({ accountId: otherId, displayName: "Other",
      password: "synthetic-only-password", confirmPassword: "synthetic-only-password", stayLoggedIn: false });
    check(other.status === "ready", "second account registration failed");
    const load = await reader.load(otherId, 1, "slot-1");
    check(load.status === "blocked" && load.slotStatus === "empty", "other account loaded first account campaign");
  });
  await test("malformed session hint blocks bootstrap", async () => {
    storage.setItem("cataclysm-rpg-ui.epoch1.session", "{");
    const result = await reader.bootstrap();
    check(result.status === "blocked" && result.code === "invalid_record", "malformed hint became a picker");
  });
  await test("closed owner blocks inventory without an empty fallback", async () => {
    owner.close();
    const result = await reader.inventory(accountId);
    check(result.status === "blocked" && result.code === "unavailable", "closed owner became empty slots");
  });
}

suite().then(() => { output.textContent = `PASS ${cases.length}\n${cases.join("\n")}`; })
  .catch(error => { output.textContent = `FAIL after ${cases.length}: ${error instanceof Error ? error.stack : String(error)}`; });
