import test from "node:test";
import assert from "node:assert/strict";

import {
  ASHEN_REEF_SURVEY_OFFER,
  stageAshenReefSurveyOffer
} from "../../packages/engines/game-engine/src/ashen-reef-survey-offer-staging.ts";
import {
  createDefaultCharacterCreationFormState
} from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getLineageIdentityCatalog
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import {
  createNewGameSnapshot
} from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";

function createStarfallForm(name = "Starfall Surveyor") {
  const identity = getLineageIdentityCatalog("lineage.human");
  const startingBundleId = "starting_bundle.traveler";
  return {
    ...createDefaultCharacterCreationFormState("slot-ashen-offer"),
    playerName: name,
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections:
      createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: "backstory.craftsmans_child",
    continentId: "region.myridian_chain",
    regionId: "region.starfall_isle",
    startingSettlementId: "settlement.starfall_port"
  };
}

function withoutOffer(snapshot) {
  const clone = structuredClone(snapshot);
  clone.sessionState.questJournal = clone.sessionState.questJournal.filter(
    (entry) => entry.id !== "quest.ashen_reef_survey"
  );
  return clone;
}

test("production Starfall creator stages one authored offer without granting access", () => {
  const snapshot = createNewGameSnapshot(
    createStarfallForm(),
    "account.ashen_offer_creator"
  );
  const offers = snapshot.sessionState.questJournal.filter(
    (entry) => entry.id === "quest.ashen_reef_survey"
  );
  assert.deepEqual(offers, [ASHEN_REEF_SURVEY_OFFER]);
  assert.equal(offers[0].title, "Soundings of Ashen Reef");
  assert.equal(offers[0].regionLabel, "Starfall Isle");
  assert.equal(offers[0].objectives.length, 4);
  assert.doesNotMatch(JSON.stringify(offers[0]), /580 crown|salvage rights/i);
  assert.equal(
    snapshot.sessionState.knownLocations.some(
      (entry) => entry.id === "location.ashen_reef"
    ),
    false
  );
  assert.equal(snapshot.sessionState.trackedQuestId, null);
  assert.equal(snapshot.sessionState.operations.length, 0);
});

test("offer staging is pure, idempotent, consumed-aware, and fail-closed", () => {
  const created = createNewGameSnapshot(
    createStarfallForm("Offer Lifecycle"),
    "account.ashen_offer_lifecycle"
  );
  const source = withoutOffer(created);
  const before = structuredClone(source);
  const staged = stageAshenReefSurveyOffer(source);
  assert.equal(staged.accepted, true);
  assert.equal(staged.code, "staged");
  assert.deepEqual(source, before);
  assert.deepEqual(staged.snapshot.sessionState.questJournal, [ASHEN_REEF_SURVEY_OFFER]);

  const duplicate = stageAshenReefSurveyOffer(staged.snapshot);
  assert.equal(duplicate.accepted, true);
  assert.equal(duplicate.code, "duplicate");
  assert.equal(duplicate.snapshot, staged.snapshot);

  for (const category of ["active", "completed", "failed"]) {
    const consumedSource = withoutOffer(created);
    consumedSource.sessionState.questJournal.push({
      ...structuredClone(ASHEN_REEF_SURVEY_OFFER),
      category
    });
    const consumed = stageAshenReefSurveyOffer(consumedSource);
    assert.equal(consumed.accepted, true);
    assert.equal(consumed.code, "consumed");
    assert.equal(consumed.snapshot, consumedSource);
  }

  const duplicated = structuredClone(created);
  duplicated.sessionState.questJournal.push(structuredClone(ASHEN_REEF_SURVEY_OFFER));
  assert.deepEqual(stageAshenReefSurveyOffer(duplicated).code, "conflict");

  const presentationConflict = structuredClone(created);
  presentationConflict.sessionState.questJournal[0].title = "Conflicting title";
  assert.deepEqual(stageAshenReefSurveyOffer(presentationConflict).code, "conflict");

  const residue = withoutOffer(created);
  residue.sessionState.trackedQuestId = "quest.ashen_reef_survey";
  assert.deepEqual(stageAshenReefSurveyOffer(residue).code, "conflict");
});

test("non-Starfall and non-new-campaign snapshots remain ineligible and unchanged", () => {
  const starfall = withoutOffer(
    createNewGameSnapshot(
      createStarfallForm("Ineligible Offer"),
      "account.ashen_offer_ineligible"
    )
  );
  const wrongSource = structuredClone(starfall);
  wrongSource.campaignRules.source = "developer_fixture";
  const result = stageAshenReefSurveyOffer(wrongSource);
  assert.equal(result.accepted, true);
  assert.equal(result.code, "ineligible");
  assert.equal(result.snapshot, wrongSource);

  const wrongSettlement = structuredClone(starfall);
  wrongSettlement.playerState.location.settlementId = "settlement.aurelis";
  const settlementResult = stageAshenReefSurveyOffer(wrongSettlement);
  assert.equal(settlementResult.accepted, true);
  assert.equal(settlementResult.code, "ineligible");
  assert.equal(settlementResult.snapshot, wrongSettlement);

  const incoherent = structuredClone(starfall);
  incoherent.campaignRules.version = 999;
  const incoherentResult = stageAshenReefSurveyOffer(incoherent);
  assert.equal(incoherentResult.accepted, true);
  assert.equal(incoherentResult.code, "ineligible");
  assert.equal(incoherentResult.snapshot, incoherent);
});
