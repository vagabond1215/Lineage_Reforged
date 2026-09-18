import test from "node:test";
import assert from "node:assert/strict";
import {
  createPlayerQuestAcceptanceCommand,
  executePlayerQuestAcceptanceCommand,
  createPlayerTravelCommand,
  executePlayerTravelCommand,
  getCurrentPlayerTravelLocationId,
  getPlayerTravelDestinationFacts,
  resolvePlayerTravelPlan
} from "../../packages/engines/game-engine/src/index.ts";
import { deserializeSnapshot, serializeSnapshot } from "../../packages/shared/persistence/src/index.ts";
import { createDefaultCharacterCreationFormState } from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import {
  createDefaultStartingBundleChoiceSelections,
  getLineageIdentityCatalog
} from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import { createNewGameSnapshot } from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";

const QUEST = "quest.ashen_reef_survey";
const STARFALL = "settlement.starfall_port";
const ASHEN = "location.ashen_reef";

function createAcceptedContract() {
  const identity = getLineageIdentityCatalog("lineage.human");
  const startingBundleId = "starting_bundle.traveler";
  const snapshot = createNewGameSnapshot({
    ...createDefaultCharacterCreationFormState("slot-return-route"),
    playerName: "Return Surveyor",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: "backstory.craftsmans_child",
    continentId: "region.myridian_chain",
    regionId: "region.starfall_isle",
    startingSettlementId: STARFALL
  }, "account.return_route");
  const result = executePlayerQuestAcceptanceCommand(snapshot, createPlayerQuestAcceptanceCommand(snapshot, QUEST));
  assert.equal(result.accepted, true);
  return result.snapshot;
}

function atAshen() {
  const source = createAcceptedContract();
  const result = executePlayerTravelCommand(source, createPlayerTravelCommand(source, ASHEN, 1));
  assert.equal(result.accepted, true);
  assert.equal(getCurrentPlayerTravelLocationId(result.snapshot), ASHEN);
  return result.snapshot;
}

function rejectUnchanged(snapshot, command, expectedCode) {
  const before = structuredClone(snapshot);
  const result = executePlayerTravelCommand(snapshot, command);
  assert.equal(result.accepted, false);
  assert.equal(result.code, expectedCode);
  assert.equal(result.snapshot, snapshot);
  assert.deepEqual(snapshot, before);
  assert.deepEqual(result.emittedEvents, []);
}

test("ordinary accepted Soundings return uses the maritime profile, four ticks, no fare or knowledge grant", () => {
  const source = atAshen();
  const before = structuredClone(source);
  const plan = resolvePlayerTravelPlan(source, STARFALL);
  const outbound = getPlayerTravelDestinationFacts(ASHEN);
  assert.equal(plan.accepted, true);
  assert.equal(plan.originLocationId, ASHEN);
  assert.equal(plan.facts.travelTicks, 4);
  for (const key of ["travelTicks", "hpCost", "mpCost", "staminaCost", "regionId", "settlementId"]) {
    assert.equal(plan.facts[key], outbound[key], key);
  }
  assert.equal(plan.timeline.length, 4);
  const result = executePlayerTravelCommand(source, createPlayerTravelCommand(source, STARFALL, 2));
  assert.equal(result.accepted, true);
  assert.deepEqual(result.facts, plan.facts);
  assert.equal(result.snapshot.clock.tick, source.clock.tick + 4);
  assert.equal(result.snapshot.playerState.saveMeta.totalPlayTicks, source.playerState.saveMeta.totalPlayTicks + 4);
  assert.equal(getCurrentPlayerTravelLocationId(result.snapshot), STARFALL);
  assert.equal(result.snapshot.playerState.location.siteLabel, "Starfall Harbormaster's Office");
  assert.deepEqual(result.snapshot.playerState.currency, source.playerState.currency);
  assert.deepEqual(result.snapshot.playerState.geographicKnowledge, source.playerState.geographicKnowledge);
  assert.deepEqual(result.snapshot.sessionState.knownLocations, source.sessionState.knownLocations);
  assert.notDeepEqual(result.snapshot.playerState.bodyState, source.playerState.bodyState);
  assert.equal(result.emittedEvents.length, 1);
  assert.equal(result.emittedEvents[0].payload.originLocationId, ASHEN);
  assert.equal(result.emittedEvents[0].payload.destinationId, STARFALL);
  assert.deepEqual(deserializeSnapshot(serializeSnapshot(result.snapshot)), result.snapshot);
  assert.deepEqual(source, before);
});

test("Starfall return is route-specific and is not a global destination profile", () => {
  assert.equal(getPlayerTravelDestinationFacts(STARFALL), null);
  for (const settlementId of ["settlement.aurelis", "settlement.stonevein", "settlement.sunspire_reach", STARFALL]) {
    const source = createAcceptedContract();
    source.playerState.location.settlementId = settlementId;
    source.playerState.location.siteLabel = "Harbor Quarter";
    rejectUnchanged(source, createPlayerTravelCommand(source, STARFALL, 3), "unknown_destination");
  }
});

test("return requires the retained accepted contract and exact known Ashen access", () => {
  const cases = [
    (snapshot) => { snapshot.sessionState.questJournal = snapshot.sessionState.questJournal.filter((quest) => quest.id !== QUEST); },
    (snapshot) => { snapshot.sessionState.questJournal.find((quest) => quest.id === QUEST).category = "contracts"; },
    (snapshot) => { snapshot.sessionState.questJournal.push(structuredClone(snapshot.sessionState.questJournal.find((quest) => quest.id === QUEST))); },
    (snapshot) => { snapshot.sessionState.knownLocations = snapshot.sessionState.knownLocations.filter((location) => location.id !== ASHEN); },
    (snapshot) => { snapshot.sessionState.knownLocations.find((location) => location.id === ASHEN).known = false; },
    (snapshot) => { snapshot.sessionState.knownLocations.find((location) => location.id === ASHEN).note = "Conflicting access"; },
    (snapshot) => { snapshot.sessionState.knownLocations.push(structuredClone(snapshot.sessionState.knownLocations.find((location) => location.id === ASHEN))); }
  ];
  for (const mutate of cases) {
    const source = atAshen();
    mutate(source);
    rejectUnchanged(source, createPlayerTravelCommand(source, STARFALL, 4), "unknown_destination");
  }
});

test("completed contract retains return eligibility without a new access reward", () => {
  // Bounded route eligibility fixture: full authoritative completion is covered
  // by the separate ordinary completion integration, not manufactured here.
  const source = atAshen();
  const quest = source.sessionState.questJournal.find((entry) => entry.id === QUEST);
  quest.category = "completed";
  quest.turnedIn = true;
  const result = executePlayerTravelCommand(source, createPlayerTravelCommand(source, STARFALL, 5));
  assert.equal(result.accepted, true);
  assert.equal(result.facts.travelTicks, 4);
  assert.deepEqual(result.snapshot.sessionState.knownLocations, source.sessionState.knownLocations);
});

test("Starfall return preserves malformed, stale, wrong-player and wrong-origin rejection", () => {
  const malformed = atAshen();
  rejectUnchanged(malformed, { type: "player.travel" }, "malformed_command");
  for (const [mutate, code] of [
    [(snapshot) => { snapshot.clock.tick += 1; snapshot.capturedAtTick += 1; }, "stale_snapshot"],
    [(snapshot) => { snapshot.playerState.currency.gold += 1; }, "stale_snapshot"],
    [(snapshot) => { snapshot.playerState.playerId = "player.other"; }, "wrong_player"],
    [(snapshot) => { snapshot.playerState.location.siteLabel = "Harbor Quarter"; }, "stale_origin"],
    [(snapshot) => { snapshot.capturedAtTick += 1; }, "incoherent_state"]
  ]) {
    const source = atAshen();
    const command = createPlayerTravelCommand(source, STARFALL, 6);
    mutate(source);
    rejectUnchanged(source, command, code);
  }
});
