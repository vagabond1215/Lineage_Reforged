import test from "node:test";
import assert from "node:assert/strict";

import {
  ASHEN_REEF_SURVEY_ACCESS_LOCATION,
  establishAshenReefSurveyTravelAccess
} from "../../packages/engines/game-engine/src/ashen-reef-survey-travel-access.ts";
import {
  createPlayerQuestAcceptanceCommand,
  executePlayerQuestAcceptanceCommand
} from "../../packages/engines/game-engine/src/player-quest-acceptance.ts";
import {
  getCurrentPlayerTravelLocationId,
  getCurrentPlayerTravelLocationLabel,
  getPlayerTravelDestinationFacts,
  resolvePlayerTravelPlan
} from "../../packages/engines/game-engine/src/player-travel-rules.ts";
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

function createSource() {
  const identity = getLineageIdentityCatalog("lineage.human");
  const startingBundleId = "starting_bundle.traveler";
  const form = {
    ...createDefaultCharacterCreationFormState("slot-ashen-access"),
    playerName: "Access Surveyor",
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
  return createNewGameSnapshot(form, "account.ashen_access");
}

test("Ashen access adapter handles absent, unknown, exact, unrelated, and conflicts purely", () => {
  const source = createSource();
  const before = structuredClone(source);
  const absent = establishAshenReefSurveyTravelAccess(
    source,
    "quest.ashen_reef_survey"
  );
  assert.equal(absent.accepted, true);
  assert.deepEqual(absent.facts, {
    locationId: "location.ashen_reef",
    posture: "established"
  });
  assert.deepEqual(source, before);
  assert.deepEqual(
    absent.snapshot.sessionState.knownLocations.at(-1),
    ASHEN_REEF_SURVEY_ACCESS_LOCATION
  );
  assert.equal(
    Object.hasOwn(ASHEN_REEF_SURVEY_ACCESS_LOCATION, "settlementId"),
    false
  );

  const unknownSource = structuredClone(source);
  unknownSource.sessionState.knownLocations.push({
    ...structuredClone(ASHEN_REEF_SURVEY_ACCESS_LOCATION),
    known: false
  });
  const unknown = establishAshenReefSurveyTravelAccess(
    unknownSource,
    "quest.ashen_reef_survey"
  );
  assert.equal(unknown.accepted, true);
  assert.equal(unknown.facts.posture, "established");
  assert.equal(
    unknown.snapshot.sessionState.knownLocations.at(-1).known,
    true
  );

  const exact = establishAshenReefSurveyTravelAccess(
    absent.snapshot,
    "quest.ashen_reef_survey"
  );
  assert.equal(exact.accepted, true);
  assert.equal(exact.facts.posture, "already_known");
  assert.equal(exact.snapshot, absent.snapshot);

  const unrelated = establishAshenReefSurveyTravelAccess(
    source,
    "quest.other"
  );
  assert.equal(unrelated.accepted, true);
  assert.equal(unrelated.applies, false);
  assert.equal(unrelated.snapshot, source);

  const conflicting = structuredClone(source);
  conflicting.sessionState.knownLocations.push({
    ...structuredClone(ASHEN_REEF_SURVEY_ACCESS_LOCATION),
    name: "Conflicting Reef"
  });
  const conflict = establishAshenReefSurveyTravelAccess(
    conflicting,
    "quest.ashen_reef_survey"
  );
  assert.equal(conflict.accepted, false);
  assert.equal(conflict.code, "travel_access_conflict");
  assert.equal(conflict.snapshot, conflicting);

  const duplicateSource = structuredClone(absent.snapshot);
  duplicateSource.sessionState.knownLocations.push(
    structuredClone(ASHEN_REEF_SURVEY_ACCESS_LOCATION)
  );
  assert.equal(
    establishAshenReefSurveyTravelAccess(
      duplicateSource,
      "quest.ashen_reef_survey"
    ).accepted,
    false
  );
});

test("accepted quest establishes access, tracking, event facts, and atomic conflict rejection", () => {
  const source = createSource();
  const command = createPlayerQuestAcceptanceCommand(
    source,
    "quest.ashen_reef_survey"
  );
  const accepted = executePlayerQuestAcceptanceCommand(source, command);
  assert.equal(accepted.accepted, true);
  assert.deepEqual(accepted.facts.travelAccess, {
    locationId: "location.ashen_reef",
    posture: "established"
  });
  assert.deepEqual(
    accepted.emittedEvents[0].payload.travelAccess,
    accepted.facts.travelAccess
  );
  assert.equal(accepted.snapshot.sessionState.trackedQuestId, "quest.ashen_reef_survey");
  assert.equal(
    accepted.snapshot.sessionState.questJournal.find(
      (entry) => entry.id === "quest.ashen_reef_survey"
    ).category,
    "active"
  );
  assert.deepEqual(
    accepted.snapshot.sessionState.knownLocations.find(
      (entry) => entry.id === "location.ashen_reef"
    ),
    ASHEN_REEF_SURVEY_ACCESS_LOCATION
  );
  assert.equal(
    source.sessionState.knownLocations.some(
      (entry) => entry.id === "location.ashen_reef"
    ),
    false
  );

  const conflictSource = createSource();
  conflictSource.sessionState.knownLocations.push({
    ...structuredClone(ASHEN_REEF_SURVEY_ACCESS_LOCATION),
    x: 999
  });
  const rejected = executePlayerQuestAcceptanceCommand(
    conflictSource,
    createPlayerQuestAcceptanceCommand(
      conflictSource,
      "quest.ashen_reef_survey"
    )
  );
  assert.equal(rejected.accepted, false);
  assert.equal(rejected.code, "travel_access_conflict");
  assert.equal(rejected.snapshot, conflictSource);
  assert.equal(
    conflictSource.sessionState.questJournal[0].category,
    "contracts"
  );
  assert.equal(conflictSource.sessionState.trackedQuestId, null);

  const staleSource = createSource();
  const staleCommand = createPlayerQuestAcceptanceCommand(
    staleSource,
    "quest.ashen_reef_survey"
  );
  staleSource.clock.tick += 1;
  staleSource.capturedAtTick += 1;
  const staleBefore = structuredClone(staleSource);
  const stale = executePlayerQuestAcceptanceCommand(staleSource, staleCommand);
  assert.equal(stale.accepted, false);
  assert.equal(stale.code, "stale_snapshot");
  assert.equal(stale.snapshot, staleSource);
  assert.deepEqual(staleSource, staleBefore);
  assert.equal(
    staleSource.sessionState.knownLocations.some(
      (entry) => entry.id === "location.ashen_reef"
    ),
    false
  );
});

test("Ashen acceptance transition failure exposes no partial access or quest mutation", () => {
  const source = createSource();
  source.playerState.skills = null;
  const command = createPlayerQuestAcceptanceCommand(
    source,
    "quest.ashen_reef_survey"
  );
  const before = structuredClone(source);

  const failed = executePlayerQuestAcceptanceCommand(source, command);

  assert.equal(failed.accepted, false);
  assert.equal(failed.code, "transition_failed");
  assert.equal(failed.snapshot, source);
  assert.deepEqual(failed.emittedEvents, []);
  assert.deepEqual(source, before);
  assert.equal(
    source.sessionState.knownLocations.some(
      (entry) => entry.id === "location.ashen_reef"
    ),
    false
  );
  assert.equal(
    source.sessionState.questJournal.find(
      (entry) => entry.id === "quest.ashen_reef_survey"
    ).category,
    "contracts"
  );
  assert.equal(source.sessionState.trackedQuestId, null);
  assert.deepEqual(
    source.sessionState.currentActivity,
    before.sessionState.currentActivity
  );
});

test("ordinary Starfall, survey anchorage, and legacy Ashen labels resolve distinctly", () => {
  const source = createSource();
  assert.equal(
    getCurrentPlayerTravelLocationId(source),
    "settlement.starfall_port"
  );
  assert.equal(
    getCurrentPlayerTravelLocationLabel(source),
    source.playerState.location.siteLabel
  );
  const access = establishAshenReefSurveyTravelAccess(
    source,
    "quest.ashen_reef_survey"
  );
  assert.equal(resolvePlayerTravelPlan(access.snapshot, "location.ashen_reef").accepted, true);
  assert.equal(getPlayerTravelDestinationFacts("location.ashen_reef").name, "Ashen Reef");

  for (const siteLabel of ["Survey Anchorage", "Ashen Reef"]) {
    const atReef = structuredClone(access.snapshot);
    atReef.playerState.location.siteLabel = siteLabel;
    assert.equal(getCurrentPlayerTravelLocationId(atReef), "location.ashen_reef");
    assert.equal(getCurrentPlayerTravelLocationLabel(atReef), "Ashen Reef");
    assert.equal(
      resolvePlayerTravelPlan(atReef, "location.ashen_reef").code,
      "already_at_destination"
    );
  }
});
