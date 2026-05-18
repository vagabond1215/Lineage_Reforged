import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_ACCOUNT_ID
} from "../../packages/engines/game-engine/src/index.ts";
import {
  createDefaultCharacterCreationFormState,
  validateCharacterCreationForm
} from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getBackstoryOptionsForSelection,
  getBackstoryTemplate,
  getLineageIdentityCatalog,
  isSelectableBackstoryId
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import {
  createNewGameSnapshot
} from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import {
  getDefaultWorldSelection
} from "../../apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts";

function createCompleteCharacterForm(backstoryId = "backstory.local") {
  const identity = getLineageIdentityCatalog("lineage.human");
  assert.ok(identity);
  const startingBundleId = "starting_bundle.traveler";
  const world = getDefaultWorldSelection(backstoryId);

  return {
    ...createDefaultCharacterCreationFormState("slot-1"),
    playerName: "Resolver Runner",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId,
    continentId: world.continentId,
    regionId: world.regionId,
    startingSettlementId: world.settlementId
  };
}

function byId(options, backstoryId) {
  return options.find((option) => option.id === backstoryId) ?? null;
}

function skillSignature(skills) {
  return skills
    .map((skill) => ({ id: skill.id, rank: skill.rank, source: skill.source }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

test("creator backstory presentation uses resolver projection", () => {
  const options = getBackstoryOptionsForSelection("lineage.human");
  const local = byId(options, "backstory.local");
  const merchant = byId(options, "backstory.merchants_child");
  const hedge = byId(options, "backstory.hedge_adept");
  const localHero = byId(options, "backstory.local_hero");

  assert.ok(local);
  assert.equal(local.availabilityState, "eligible");
  assert.equal(local.selectable, true);
  assert.equal(local.visible, true);
  assert.equal(local.isDefault, true);

  assert.ok(merchant);
  assert.equal(merchant.availabilityState, "locked");
  assert.equal(merchant.selectable, false);
  assert.equal(merchant.visible, true);
  assert.equal(merchant.availabilityBadge, "Locked");
  assert.equal(
    merchant.lockedReason,
    "Requires matching evidence that is not currently available."
  );

  assert.equal(hedge, null);
  assert.ok(localHero);
  assert.equal(localHero.isSpecial, true);
  assert.equal(localHero.selectable, false);
});

test("default records remain visible and selectable without evidence", () => {
  const options = getBackstoryOptionsForSelection("lineage.human");

  for (const backstoryId of [
    "backstory.local",
    "backstory.vagabond",
    "backstory.exile",
    "backstory.farmhand",
    "backstory.amnesiac"
  ]) {
    const option = byId(options, backstoryId);

    assert.ok(option, `${backstoryId} should be visible`);
    assert.equal(option.selectable, true, `${backstoryId} should be selectable`);
    assert.equal(option.isDefault, true, `${backstoryId} should be a default`);
  }
});

test("creator validation rejects selected ids that are not resolver-selectable", () => {
  const lockedForm = createCompleteCharacterForm("backstory.merchants_child");
  const specialForm = createCompleteCharacterForm("backstory.local_hero");

  assert.equal(isSelectableBackstoryId("backstory.merchants_child"), false);
  assert.equal(isSelectableBackstoryId("backstory.local_hero"), false);
  assert.equal(
    validateCharacterCreationForm(lockedForm).errors.backstoryId,
    "Choose an available backstory."
  );
  assert.equal(
    validateCharacterCreationForm(specialForm).errors.backstoryId,
    "Choose an available backstory."
  );
});

test("settlement-start validation remains separate from resolver availability", () => {
  const form = {
    ...createCompleteCharacterForm("backstory.local"),
    startingSettlementId: "settlement.not_real"
  };
  const validation = validateCharacterCreationForm(form);

  assert.equal(validation.errors.backstoryId, undefined);
  assert.equal(validation.errors.startingSettlementId, "Choose a valid starting settlement.");
});

test("new-game snapshot still applies only the selected live backstory package", () => {
  const form = createCompleteCharacterForm("backstory.local");
  const validation = validateCharacterCreationForm(form);
  const snapshot = createNewGameSnapshot(form, DEFAULT_ACCOUNT_ID);
  const template = getBackstoryTemplate(form.backstoryId);

  assert.deepEqual(validation.errors, {});
  assert.equal(snapshot.playerState.coreData.backstoryId, form.backstoryId);
  assert.deepEqual(
    skillSignature(snapshot.playerState.skills),
    skillSignature(template.startingSkills)
  );
});

test("visible unavailable copy avoids blocked-system promises and raw policy ids", () => {
  const options = getBackstoryOptionsForSelection("lineage.human");
  const forbiddenCopy = /legacy points|source_run|policy|backstory\.|estate|title|institution|contact|mount|magic|medical|oath|paladin/i;

  for (const option of options.filter((entry) => !entry.selectable)) {
    assert.doesNotMatch(option.lockedReason ?? "", forbiddenCopy, option.id);
    assert.doesNotMatch(option.unlockHint ?? "", forbiddenCopy, option.id);
  }
});

test("creator integration does not import design metadata or compatibility rescue logic", async () => {
  const creatorSourceFiles = [
    "apps/rpg-ui/src/game-shell/characterCreationCatalog.ts",
    "apps/rpg-ui/src/game-shell/characterCreationForm.ts",
    "apps/rpg-ui/src/game-shell/newGameSnapshot.ts",
    "apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx"
  ];

  for (const sourceFile of creatorSourceFiles) {
    const source = await readFile(sourceFile, "utf8");

    assert.doesNotMatch(source, /backstory-policy-metadata/, sourceFile);
    assert.doesNotMatch(source, /legacy-upgrade-catalog-draft/, sourceFile);
    assert.doesNotMatch(source, /futureBackstoryLaneDrafts/, sourceFile);
    assert.doesNotMatch(source, /docs\/design|docs\\design/, sourceFile);
    assert.doesNotMatch(source, /legacyIdAliases|idAliases|retired|converted|migrationFallback|old-save|old-account|historical id/i, sourceFile);
  }
});
