import test from "node:test";
import assert from "node:assert/strict";

const formModule = await import("../../apps/rpg-ui/src/game-shell/characterCreationForm.ts");
const catalog = await import("../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts");
const sexProfiles = await import("../../apps/rpg-ui/src/game-shell/characterCreationSexProfiles.ts");
const snapshotModule = await import("../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts");
const world = await import("../../apps/rpg-ui/src/game-shell/worldSelectionCatalog.ts");

const EXPECTED = {
  "lineage.human": {
    male: { STR: 1, AGI: -1 },
    female: { STR: -1, AGI: 1 }
  },
  "lineage.dwarf": {
    male: { STR: 1, VIT: -1 },
    female: { STR: -1, VIT: 1 }
  },
  "lineage.gnome": { male: {}, female: {} },
  "lineage.halfling": {
    male: { VIT: 1, DEX: -1 },
    female: { VIT: -1, DEX: 1 }
  },
  "lineage.elf": { male: {}, female: {} },
  "lineage.dark_elf": {
    male: { DEX: 1, CON: -1 },
    female: { DEX: -1, CON: 1 }
  },
  "lineage.half_troll": {
    male: { STR: 2, CON: -1, VIT: -1 },
    female: { STR: -2, CON: 1, VIT: 1 }
  },
  "lineage.half_orc": {
    male: { STR: 1, CON: 1, DEX: -1, AGI: -1 },
    female: { STR: -1, CON: -1, DEX: 1, AGI: 1 }
  },
  "lineage.half_goblin": {
    male: { AGI: 1, CON: -1 },
    female: { AGI: -1, CON: 1 }
  },
  "lineage.half_merfolk": {
    male: { AGI: 1, VIT: -1 },
    female: { AGI: -1, VIT: 1 }
  }
};

test("every playable lineage owns an explicit zero-sum creator sex profile", () => {
  const lineageIds = catalog.lineageOptions.map((entry) => entry.id);
  assert.deepEqual(sexProfiles.validateCharacterCreationSexProfiles(lineageIds), []);

  for (const lineageId of lineageIds) {
    assert.deepEqual(
      sexProfiles.getCharacterCreationSexAttributeAdjustments(lineageId, "male"),
      EXPECTED[lineageId].male,
      `${lineageId} male`
    );
    assert.deepEqual(
      sexProfiles.getCharacterCreationSexAttributeAdjustments(lineageId, "female"),
      EXPECTED[lineageId].female,
      `${lineageId} female`
    );
  }
});

function createCompleteForm() {
  const form = formModule.createDefaultCharacterCreationFormState("slot-1");
  const identity = catalog.getLineageIdentityCatalog(form.lineageId);
  assert.ok(identity);
  const backstoryId = "backstory.local";
  const start = world.getDefaultWorldSelection(backstoryId);
  const startingBundleId = "starting_bundle.traveler";

  return {
    ...form,
    playerName: "Profile Boundary",
    hairColorId: identity.hairColorOptions[0].id,
    eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id,
    backstoryId,
    continentId: start.continentId,
    regionId: start.regionId,
    startingSettlementId: start.settlementId,
    startingBundleId,
    startingBundleChoiceSelections:
      catalog.createDefaultStartingBundleChoiceSelections(startingBundleId)
  };
}

test("new snapshots persist creator profile ids separately from runtime passive traits", () => {
  const form = createCompleteForm();
  const validation = formModule.validateCharacterCreationForm(form, {
    hasSelectableBackstories: true
  });
  assert.equal(validation.isValid, true, JSON.stringify(validation.errors));

  const snapshot = snapshotModule.createNewGameSnapshot(form, "account.creator-test", {
    hasSelectableBackstories: true
  });
  const identity = snapshot.playerState.coreData.identityProfile;
  assert.ok(identity);

  assert.deepEqual(identity.profileTraitIds, form.profileTraitIds);
  assert.deepEqual(identity.appearanceDescriptorIds, form.appearanceDescriptorIds);
  assert.equal(identity.physiqueId, null);
  assert.equal(identity.natureId, null);
  assert.equal(identity.focusId, null);

  assert.equal(
    snapshot.playerState.traits.some((entry) => entry.id.startsWith("profile_trait.")),
    false
  );
  assert.ok(snapshot.playerState.traits.every((entry) => entry.id.startsWith("trait.lineage.")));
  assert.deepEqual(snapshot.playerState.originProfile.attributeAdjustments, { STR: 1, AGI: -1 });
});
