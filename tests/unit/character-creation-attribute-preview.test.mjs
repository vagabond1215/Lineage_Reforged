import test from "node:test";
import assert from "node:assert/strict";

import {
  CHARACTER_ATTRIBUTE_ORDER
} from "../../apps/rpg-ui/src/game-shell/characterAttributes.ts";
import {
  createDefaultCharacterCreationFormState
} from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getLineageIdentityCatalog
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import {
  buildCharacterCreationAttributePreviewRows,
  buildCharacterCreationPreview
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
    playerName: "Attribute Runner",
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

test("attribute preview rows follow canonical order and visible totals", () => {
  const form = createCompleteCharacterForm();
  const rows = buildCharacterCreationAttributePreviewRows(form);
  const preview = buildCharacterCreationPreview(form);

  assert.deepEqual(
    rows.map((row) => row.id),
    CHARACTER_ATTRIBUTE_ORDER
  );

  for (const row of rows) {
    const metric = preview.attributeMetrics.find((entry) => entry.label === row.id);
    assert.equal(row.totalValue?.toString(), metric?.value);
    assert.equal(row.contributions.at(-1)?.id, "total");
    assert.equal(row.contributions.at(-1)?.value, row.totalValue);
    assert.equal(
      row.contributions
        .filter((contribution) => contribution.id !== "total")
        .reduce((total, contribution) => total + contribution.value, 0),
      row.totalValue
    );
  }
});

test("attribute preview omits backstory and legacy rows when not applied", () => {
  const rows = buildCharacterCreationAttributePreviewRows(
    createCompleteCharacterForm(""),
    { hasSelectableBackstories: false }
  );

  for (const row of rows) {
    assert.equal(
      row.contributions.some((contribution) => contribution.id === "backstory"),
      false,
      row.id
    );
    assert.equal(
      row.contributions.some((contribution) => contribution.id === "legacy_preparation"),
      false,
      row.id
    );
  }
});
