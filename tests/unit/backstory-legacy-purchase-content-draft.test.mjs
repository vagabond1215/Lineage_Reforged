import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import {
  getLegacyUnlockDefinitions
} from "../../packages/engines/game-engine/src/index.ts";
import { getBackstoryOptionsForSelection } from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";

const DRAFT_PATH = "docs/design/backstory-legacy-purchase-content-draft.json";
const DRAFT_IMPORT_PATTERN =
  /backstory-legacy-purchase-content-draft|legacy\.backstory\.street_vendor|legacy\.backstory\.net_tender|legacy\.backstory\.kitchen_hand/;
const PLAYER_COPY_FORBIDDEN_PATTERN = /\b(future|low-risk|account-level|support purchase|purchase|eligibility|runtime|legacy unlock|scope|resolver|catalog|draft-only|draft_only|guardrail)\b/i;
const PAST_SHAPING_PATTERN = /\b(shaped|taught|learned|formed|trained|raised|grew|worked)\b/i;
const CURRENT_IDENTITY_PATTERN = /\bcurrently employed|currently recognized|now employed|now recognized|is a vendor|is a net-tender|is a gatherer|is a scribe|is a kitchen hand\b/i;
const EXPECTED_DRAFT_IDS = [
  "legacy.backstory.street_vendor",
  "legacy.backstory.net_tender",
  "legacy.backstory.gatherer",
  "legacy.backstory.scribes_apprentice",
  "legacy.backstory.kitchen_hand"
];
const EXPECTED_DRAFT_NAMES = [
  "Market-Learned Habits",
  "Water-Work Lessons",
  "Field-Gathering Habits",
  "Records-Room Training",
  "Kitchen-Service Discipline"
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
  const recordNames = draft.records.map((record) => record.name);
  const targetBackstoryIds = draft.records.map((record) => record.targetBackstoryId);

  assert.equal(draft.status, "draft_only_non_runtime");
  assert.equal(draft.runtimeImportAllowed, false);
  assert.deepEqual(recordIds, EXPECTED_DRAFT_IDS);
  assert.deepEqual(recordNames, EXPECTED_DRAFT_NAMES);
  assert.deepEqual(targetBackstoryIds, EXPECTED_TARGET_BACKSTORY_IDS);
  assert.match(draft.notes.join("\n"), /formative past conditions that shaped the new character/);
  assert.match(draft.notes.join("\n"), /not current job titles/);

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
    assert.equal("summary" in record, false, record.id);
    assert.equal(typeof record.playerFacingSummary, "string", record.id);
    assert.equal(typeof record.implementationSummary, "string", record.id);
    assert.equal("cost" in record, false, record.id);
    assert.equal("effects" in record, false, record.id);
    assert.equal("purchaseMode" in record, false, record.id);
    assert.equal("currency" in record, false, record.id);
    assert.equal("requirements" in record, false, record.id);
  }
});

test("draft player-facing copy describes formative past instead of implementation mechanics", async () => {
  const draft = await loadDraft();

  for (const record of draft.records) {
    assert.doesNotMatch(record.name, PLAYER_COPY_FORBIDDEN_PATTERN, record.id);
    assert.doesNotMatch(record.name, CURRENT_IDENTITY_PATTERN, record.id);
    assert.doesNotMatch(record.playerFacingSummary, PLAYER_COPY_FORBIDDEN_PATTERN, record.id);
    assert.doesNotMatch(record.playerFacingSummary, CURRENT_IDENTITY_PATTERN, record.id);
    assert.match(record.playerFacingSummary, PAST_SHAPING_PATTERN, record.id);
    assert.match(record.implementationSummary, /Draft-only internal candidate/, record.id);
    assert.match(record.implementationSummary, /formative/, record.id);
    assert.match(record.guardrails.join("\n"), /Represents formative past experience only/, record.id);
    assert.match(record.guardrails.join("\n"), /does not make the new character currently employed/, record.id);
  }
});

test("approved draft candidates are live only through runtime-owned Legacy catalog records", async () => {
  const draft = await loadDraft();
  const definitionsById = new Map(
    getLegacyUnlockDefinitions().map((definition) => [definition.id, definition])
  );

  for (const record of draft.records) {
    const definition = definitionsById.get(record.id);

    assert.ok(definition, `${record.id} should have a live migrated definition`);
    assert.equal(definition.title, record.name, record.id);
    assert.equal(definition.description, record.playerFacingSummary, record.id);
    assert.equal(definition.implementationPriority, "live", record.id);
    assert.equal(definition.scope, "account", record.id);
    assert.equal(definition.purchaseMode, "unlock_only", record.id);
    assert.ok(definition.tags?.includes("backstory"), record.id);
    assert.ok(definition.tags?.includes("backstory_legacy"), record.id);
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
