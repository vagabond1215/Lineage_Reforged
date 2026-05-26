import test from "node:test";
import assert from "node:assert/strict";

import {
  createDefaultCharacterCreationFormState,
  validateCharacterCreationForm
} from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  hasValidStartingBundleChoiceSelections,
  isSelectableBackstoryId
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import {
  generateRandomCharacterCreationFormState
} from "../../apps/rpg-ui/src/game-shell/characterCreationRandomization.ts";

function fixedRng(value) {
  return () => value;
}

test("full character randomize produces valid current-content selections", () => {
  const currentForm = {
    ...createDefaultCharacterCreationFormState("slot-7"),
    sourceRunId: "run.retired_source"
  };
  const randomized = generateRandomCharacterCreationFormState({
    currentForm,
    rng: fixedRng(0.23)
  });
  const validation = validateCharacterCreationForm(randomized, {
    hasSelectableBackstories: randomized.backstoryId.trim().length > 0
  });

  assert.equal(randomized.saveSlotId, "slot-7");
  assert.equal(randomized.sourceRunId, "");
  assert.ok(randomized.playerName.trim());
  assert.ok(randomized.lineageId.trim());
  assert.ok(randomized.continentId.trim());
  assert.ok(randomized.regionId.trim());
  assert.ok(randomized.startingSettlementId.trim());
  assert.ok(randomized.startingBundleId.trim());
  assert.equal(
    hasValidStartingBundleChoiceSelections(
      randomized.startingBundleId,
      randomized.startingBundleChoiceSelections
    ),
    true
  );
  assert.equal(validation.isValid, true);
  assert.equal(isSelectableBackstoryId(randomized.backstoryId), true);
});

test("full character randomize leaves backstory empty when none are selectable", () => {
  const currentForm = createDefaultCharacterCreationFormState("slot-3");
  const randomized = generateRandomCharacterCreationFormState({
    currentForm,
    rng: fixedRng(0.01),
    backstoryOptions: [
      {
        id: "backstory.local",
        selectable: false
      }
    ]
  });
  const validation = validateCharacterCreationForm(randomized, {
    hasSelectableBackstories: false
  });

  assert.equal(randomized.saveSlotId, "slot-3");
  assert.equal(randomized.backstoryId, "");
  assert.equal(validation.errors.backstoryId, undefined);
  assert.equal(validation.isValid, true);
});
