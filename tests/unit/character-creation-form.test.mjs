import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_ACCOUNT_ID
} from "../../packages/engines/game-engine/src/index.ts";
import {
  buildCharacterCreationStepStates,
  createDefaultCharacterCreationFormState,
  getNextAvailableCharacterCreationStepId,
  getPreviousAvailableCharacterCreationStepId,
  hasCompleteCharacterCreationSelections,
  validateCharacterCreationForm
} from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getLineageIdentityCatalog
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
    playerName: "No Backstory Runner",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections:
      createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId,
    continentId: world.continentId,
    regionId: world.regionId,
    startingSettlementId: world.settlementId
  };
}

test("backstory is optional only when no selectable backstories exist", () => {
  const form = createCompleteCharacterForm("");

  assert.equal(
    validateCharacterCreationForm(form).errors.backstoryId,
    "Choose a valid backstory."
  );
  assert.equal(hasCompleteCharacterCreationSelections(form), false);

  const validation = validateCharacterCreationForm(form, {
    hasSelectableBackstories: false
  });

  assert.equal(validation.errors.backstoryId, undefined);
  assert.equal(validation.isValid, true);
  assert.equal(
    hasCompleteCharacterCreationSelections(form, { hasSelectableBackstories: false }),
    true
  );
});

test("forced unavailable backstory selections still fail when the step is locked", () => {
  const form = createCompleteCharacterForm("backstory.merchants_child");
  const validation = validateCharacterCreationForm(form, {
    hasSelectableBackstories: false
  });

  assert.equal(validation.errors.backstoryId, "Choose an available backstory.");
});

test("step helpers lock and skip unavailable backstory during navigation", () => {
  const valid = { isValid: true, errors: {} };
  const states = buildCharacterCreationStepStates({
    currentStepId: "settlement",
    validations: {
      lineage: valid,
      identity: valid,
      continent: valid,
      region: valid,
      settlement: valid,
      backstory: { isValid: false, errors: { backstoryId: "Choose a valid backstory." } },
      starting_bundle: valid,
      review: valid
    },
    backstoryLocked: true
  });
  const backstory = states.find((state) => state.stepId === "backstory");
  const review = states.find((state) => state.stepId === "review");

  assert.equal(backstory?.locked, true);
  assert.equal(backstory?.skipped, true);
  assert.equal(review?.locked, false);
  assert.equal(
    getNextAvailableCharacterCreationStepId("settlement", states),
    "starting_bundle"
  );
  assert.equal(
    getPreviousAvailableCharacterCreationStepId("starting_bundle", states),
    "settlement"
  );
});

test("new-game snapshot can start with no backstory package when unavailable", () => {
  const form = createCompleteCharacterForm("");
  const snapshot = createNewGameSnapshot(form, DEFAULT_ACCOUNT_ID, {
    hasSelectableBackstories: false
  });

  assert.equal(snapshot.playerState.coreData.backstoryId, null);
  assert.deepEqual(snapshot.playerState.skills, []);
  assert.deepEqual(snapshot.playerState.abilities, []);
  assert.equal(
    snapshot.playerState.flags.some((flag) => flag.startsWith("player.backstory.")),
    false
  );
  assert.equal(
    snapshot.sessionState.flags.some((flag) => flag.startsWith("character.backstory.")),
    false
  );
  assert.doesNotMatch(snapshot.sessionState.notifications[0]?.detail ?? "", /begins as/i);
  assert.equal(
    snapshot.sessionState.chronicle[0]?.title,
    "No Backstory Runner began the journey"
  );
});
