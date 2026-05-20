import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import {
  BACKSTORY_ELIGIBILITY_POLICY,
  createDefaultAccountProfileState,
  getLegacyUnlockDefinitions,
  purchaseLegacyUnlock,
  resolveBackstoryEligibility,
  resolveLegacyUnlockStates,
  resolveOwnedBackstoryLegacyPurchaseIds
} from "../../packages/engines/game-engine/src/index.ts";
import { buildAccountMetaViewModel } from "../../apps/rpg-ui/src/game-shell/accountMetaPresentation.ts";
import { getBackstoryOptionsForSelection } from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";

const DRAFT_PATH = "docs/design/backstory-legacy-purchase-content-draft.json";
const DRAFT_IMPORT_PATTERN =
  /backstory-legacy-purchase-content-draft|legacy\.backstory\.street_vendor|legacy\.backstory\.net_tender|legacy\.backstory\.kitchen_hand/;
const EXPECTED_DRAFT_IDS = [
  "legacy.backstory.street_vendor",
  "legacy.backstory.net_tender",
  "legacy.backstory.gatherer",
  "legacy.backstory.scribes_apprentice",
  "legacy.backstory.kitchen_hand"
];
const EXPECTED_TARGET_BACKSTORY_IDS = [
  "backstory.street_vendor",
  "backstory.net_tender",
  "backstory.gatherer",
  "backstory.scribes_apprentice",
  "backstory.kitchen_hand"
];
const FORBIDDEN_DRAFT_IDS = [
  "legacy.backstory.drovers_hand",
  "legacy.backstory.militia_levy",
  "legacy.backstory.merchant_family",
  "legacy.backstory.garrison_ward",
  "legacy.backstory.carpenter_household",
  "legacy.backstory.miners_kin",
  "legacy.backstory.village_hunter",
  "legacy.backstory.scouts_ward",
  "legacy.backstory.minor_noble",
  "legacy.backstory.local_champion",
  "legacy.backstory.world_stray",
  "legacy.backstory.hedge_adept",
  "legacy.backstory.temple_acolyte",
  "legacy.backstory.scholars_apprentice",
  "legacy.backstory.performer"
];

async function loadDraft() {
  const raw = await readFile(DRAFT_PATH, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, ""));
}

async function loadLiveBackstoryIds() {
  const raw = await readFile("packages/content/base/player/backstories.json", "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, "")).records.map((record) => record.id);
}

function createAccountUnlock(unlockId) {
  return {
    unlockId,
    unlockedAt: "2026-05-20T12:00:00.000Z",
    sourceTransactionId: "legacy.transaction.test.draft"
  };
}

async function listSourceFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const resolved = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listSourceFiles(resolved)));
    } else if (/\.(?:ts|tsx|js|mjs)$/.test(entry.name)) {
      files.push(resolved);
    }
  }

  return files;
}

test("draft Backstory Legacy purchase content is explicitly non-runtime and low-risk", async () => {
  const draft = await loadDraft();
  const recordIds = draft.records.map((record) => record.id);
  const targetBackstoryIds = draft.records.map((record) => record.targetBackstoryId);

  assert.equal(draft.status, "draft_only_non_runtime");
  assert.equal(draft.runtimeImportAllowed, false);
  assert.deepEqual(recordIds, EXPECTED_DRAFT_IDS);
  assert.deepEqual(targetBackstoryIds, EXPECTED_TARGET_BACKSTORY_IDS);

  for (const forbiddenId of FORBIDDEN_DRAFT_IDS) {
    assert.equal(recordIds.includes(forbiddenId), false, forbiddenId);
  }

  for (const record of draft.records) {
    assert.equal(record.status, "draft_only_non_runtime", record.id);
    assert.equal(record.tier, "tier_1", record.id);
    assert.equal(record.scopeIntent, "account", record.id);
    assert.equal(record.purchaseIntent, "early_legacy_access_support_only", record.id);
    assert.equal(record.evidenceRole, "legacy_purchase_support", record.id);
    assert.equal(record.effectIntent, "none", record.id);
    assert.deepEqual(record.candidateTags.slice(0, 2), ["backstory", "backstory_legacy"]);
    assert.equal("cost" in record, false, record.id);
    assert.equal("effects" in record, false, record.id);
    assert.equal("purchaseMode" in record, false, record.id);
    assert.equal("currency" in record, false, record.id);
    assert.equal("requirements" in record, false, record.id);
  }
});

test("draft content is not imported by runtime Legacy unlock state resolution", async () => {
  const draft = await loadDraft();
  const draftIds = draft.records.map((record) => record.id);
  const liveDefinitionIds = getLegacyUnlockDefinitions().map((definition) => definition.id);
  const resolvedIds = resolveLegacyUnlockStates(createDefaultAccountProfileState()).map(
    (entry) => entry.id
  );

  for (const draftId of draftIds) {
    assert.equal(liveDefinitionIds.includes(draftId), false, draftId);
    assert.equal(resolvedIds.includes(draftId), false, draftId);
  }
});

test("draft content does not appear in account meta Legacy purchase entries", async () => {
  const draft = await loadDraft();
  const draftIds = draft.records.map((record) => record.id);
  const profile = createDefaultAccountProfileState();
  const viewModel = buildAccountMetaViewModel(profile);
  const accountMetaIds = viewModel.legacy.unlockEntries.map((entry) => entry.id);
  const purchaseEntryIds = viewModel.legacy.unlockEntries
    .filter((entry) => entry.catalogCanPurchase)
    .map((entry) => entry.id);

  for (const draftId of draftIds) {
    assert.equal(accountMetaIds.includes(draftId), false, draftId);
    assert.equal(purchaseEntryIds.includes(draftId), false, draftId);
  }
});

test("draft content cannot be purchased through the live Legacy purchase path", async () => {
  const draft = await loadDraft();
  const profile = createDefaultAccountProfileState();

  for (const record of draft.records) {
    const result = purchaseLegacyUnlock(profile, record.id);
    assert.equal(result.ok, false, record.id);
    assert.equal(result.error, "unknown_unlock", record.id);
  }
});

test("draft content does not change creator backstory availability", async () => {
  const draft = await loadDraft();
  const options = getBackstoryOptionsForSelection("lineage.human");

  for (const record of draft.records) {
    const option = options.find((entry) => entry.id === record.targetBackstoryId);

    assert.ok(option, `${record.targetBackstoryId} should remain a resolver-visible live backstory`);
    assert.equal(option.selectable, false, record.targetBackstoryId);
    assert.equal(option.availabilityState, "locked", record.targetBackstoryId);
    assert.equal(option.availabilityStatus, "early_legacy", record.targetBackstoryId);
    assert.doesNotMatch(option.lockedReason ?? "", /Legacy points|purchase|buy/i);
  }
});

test("draft content does not enter resolver purchase evidence", async () => {
  const draft = await loadDraft();
  const draftIds = draft.records.map((record) => record.id);
  const profile = {
    ...createDefaultAccountProfileState(),
    legacy: {
      ...createDefaultAccountProfileState().legacy,
      legacyUnlocks: draftIds.map(createAccountUnlock)
    }
  };
  const purchaseEvidence = resolveOwnedBackstoryLegacyPurchaseIds({
    profile,
    legacyUnlockDefinitions: getLegacyUnlockDefinitions()
  });
  const liveBackstoryIds = await loadLiveBackstoryIds();
  const resolverResult = resolveBackstoryEligibility({
    liveBackstoryIds,
    policy: BACKSTORY_ELIGIBILITY_POLICY,
    evidence: {
      legacyPurchaseIds: purchaseEvidence.legacyPurchaseIds
    }
  });

  assert.deepEqual(purchaseEvidence.legacyPurchaseIds, []);
  assert.deepEqual(purchaseEvidence.accountUnlockIds, []);
  assert.deepEqual(purchaseEvidence.familyUnlockIds, []);

  for (const targetBackstoryId of EXPECTED_TARGET_BACKSTORY_IDS) {
    assert.equal(resolverResult.eligibleBackstoryIds.includes(targetBackstoryId), false);
  }
});

test("runtime and creator source do not import the draft catalog", async () => {
  const sourceFiles = [
    ...(await listSourceFiles("packages/engines/game-engine/src")),
    "apps/rpg-ui/src/game-shell/accountMetaPresentation.ts",
    "apps/rpg-ui/src/game-shell/components/AccountMetaPanel.tsx",
    "apps/rpg-ui/src/game-shell/characterCreationCatalog.ts",
    "apps/rpg-ui/src/game-shell/characterCreationForm.ts",
    "apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx"
  ];

  for (const sourceFile of sourceFiles) {
    const source = await readFile(sourceFile, "utf8");
    assert.doesNotMatch(source, DRAFT_IMPORT_PATTERN, sourceFile);
    assert.doesNotMatch(source, /backstory-legacy-purchase-content-draft/, sourceFile);
    assert.doesNotMatch(source, /docs[\\/]+design/, sourceFile);
  }
});
