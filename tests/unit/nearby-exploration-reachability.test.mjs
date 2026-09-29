import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultCharacterCreationFormState } from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import { createNewGameSnapshot } from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import { advanceNearbyExplorationCaller } from "../../apps/rpg-ui/src/runtime/nearbyExplorationCaller.ts";
import { createCampaignSessionControl } from "../../packages/engines/game-engine/src/campaign-session.ts";
import {
  createNearbyExplorationCommand,
  executeNearbyExplorationCommand,
  nearbyExplorationCatalog,
  resolveNearbyExplorationPlan
} from "../../packages/engines/game-engine/src/player-nearby-exploration.ts";
import { deserializeSnapshot, serializeSnapshot } from "../../packages/shared/persistence/src/index.ts";
import { loadSpawnFoundationContent } from "../../packages/engines/world-engine/src/spawn/content.ts";
import { resolveSpawnCandidates } from "../../packages/engines/world-engine/src/spawn/index.ts";

function creator(settlementId = "settlement.stonevein", regionId = "region.auric_marches", continentId = "region.kaelvar") {
  const identity = getLineageIdentityCatalog("lineage.human");
  const startingBundleId = "starting_bundle.traveler";
  const form = {
    ...createDefaultCharacterCreationFormState("slot-nearby-exploration"),
    playerName: "Nearby Explorer",
    hairColorId: identity.hairColorOptions[0]?.id ?? "",
    eyeColorId: identity.eyeColorOptions[0]?.id ?? "",
    skinToneId: identity.skinToneOptions[0]?.id ?? "",
    startingBundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(startingBundleId),
    backstoryId: "backstory.craftsmans_child",
    continentId, regionId, startingSettlementId: settlementId
  };
  return createNewGameSnapshot(form, "account.nearby_exploration");
}

function controlFor(snapshot) {
  return createCampaignSessionControl({
    accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId,
    artifactId: "artifact.nearby_source",
    publicationId: "publication.nearby_source",
    artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: "artifact.nearby_source",
    headRevision: 1
  });
}

test("ordinary creator and campaign caller reach authored edge without admitting combat", () => {
  let snapshot = creator();
  let control = controlFor(snapshot);
  const initialSettlement = snapshot.playerState.location.settlementId;
  const initialTick = snapshot.clock.tick;
  const initialStamina = snapshot.playerState.resources.stamina.current;
  assert.equal(resolveNearbyExplorationPlan(snapshot).available, true);
  let positive = null;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const transition = advanceNearbyExplorationCaller(snapshot, control);
    assert.equal(transition.outcome.accepted, true);
    ({ snapshot, control } = transition.acceptedState);
    assert.equal(snapshot.playerState.location.settlementId, initialSettlement);
    assert.equal(snapshot.worldState.nearbyExplorationContext.worldHexEdgeId, "world_hex_edge.auric_marches_ore_ridges_auric_marches_caravan_marches");
    assert.deepEqual(snapshot.worldState.nearbyExplorationContext.habitatTags, ["frontier_track"]);
    assert.equal(snapshot.worldState.nearbyExplorationContext.hazardPressure, 46);
    assert.equal(snapshot.worldState.encounterContext, undefined);
    assert.equal(snapshot.worldState.pendingSpawnCandidates?.length ?? 0, 0);
    assert.equal(snapshot.gameState.activeEncounter, null);
    if (transition.outcome.code === "candidate_pending") { positive = snapshot.worldState.nearbyExplorationCandidate; break; }
    assert.equal(transition.outcome.code, "no_eligible_encounter");
  }
  assert.ok(positive, "ordinary attempts must eventually yield a candidate under authored 35% rate");
  assert.equal(positive.encounterTemplateId, "encounter.kaelvar.roadside_kobold_patrol");
  assert.equal(positive.selectionVersion, "ordinary.v1");
  assert.equal(positive.worldHexEdgeId, snapshot.worldState.nearbyExplorationContext.worldHexEdgeId);
  assert.equal(snapshot.clock.tick > initialTick, true);
  assert.equal(snapshot.playerState.resources.stamina.current <= initialStamina - 2, true);
  assert.equal(resolveNearbyExplorationPlan(snapshot).available, true);
  const restored = deserializeSnapshot(serializeSnapshot(snapshot));
  assert.deepEqual(restored.worldState.nearbyExplorationCandidate, snapshot.worldState.nearbyExplorationCandidate);
  assert.equal(restored.worldState.nearbyExplorationContext.sourceActionId, positive.sourceActionId);
  const repeated = advanceNearbyExplorationCaller(restored, control);
  assert.equal(repeated.outcome.accepted, true);
  assert.equal(repeated.acceptedState.snapshot.clock.tick, restored.clock.tick + 1);
  assert.notEqual(repeated.acceptedState.snapshot.worldState.nearbyExplorationContext.sourceActionId, positive.sourceActionId);
  assert.notEqual(repeated.acceptedState.snapshot.worldState.nearbyExplorationCandidate?.sourceActionId, positive.sourceActionId);
  assert.equal(repeated.acceptedState.snapshot.worldState.pendingSpawnCandidates?.length ?? 0, 0);
  assert.equal(repeated.acceptedState.snapshot.gameState.activeEncounter, null);
});

test("other creator origin and unlinked action have no authored encounter", () => {
  const snapshot = creator("settlement.starfall_port", "region.starfall_isle", "region.myridian_chain");
  const before = serializeSnapshot(snapshot);
  assert.equal(resolveNearbyExplorationPlan(snapshot).code, "no_eligible_encounter");
  const transition = advanceNearbyExplorationCaller(snapshot, controlFor(snapshot));
  assert.equal(transition.outcome.accepted, false);
  assert.equal(transition.acceptedState, null);
  assert.equal(serializeSnapshot(snapshot), before);
  const stonevein = creator();
  const command = createNearbyExplorationCommand(stonevein);
  assert.equal(executeNearbyExplorationCommand(stonevein, { ...command, type: "player.travel" }).accepted, false);
});

test("stale command and ambiguous or broken authored geography fail without mutation", () => {
  const snapshot = creator();
  const before = serializeSnapshot(snapshot);
  const command = createNearbyExplorationCommand(snapshot);
  const stale = structuredClone(snapshot);
  stale.sessionState.flags.push("new.source.fact");
  assert.equal(executeNearbyExplorationCommand(stale, command).code, "stale_snapshot");
  for (const mutate of [
    (c) => { c.contexts.push({ ...c.contexts[0], id: "encounter_action_context.duplicate" }); },
    (c) => { c.contexts[0].originWorldHexId = "world_hex.auric_marches_caravan_marches"; },
    (c) => { c.contexts[0].worldHexEdgeId = "world_hex_edge.aurelis_stonevein"; },
    (c) => { c.regions.find((r) => r.id === "region.auric_marches").parentRegionId = "region.missing"; },
    (c) => { c.regions.find((r) => r.id === "region.auric_marches").simulationProfile.hazardPressure = "bad"; },
    (c) => { c.contexts[0].habitatTags = []; }
  ]) {
    const catalog = structuredClone(nearbyExplorationCatalog);
    mutate(catalog);
    assert.equal(resolveNearbyExplorationPlan(snapshot, catalog).available, false);
    assert.equal(executeNearbyExplorationCommand(snapshot, command, catalog).accepted, false);
  }
  assert.equal(serializeSnapshot(snapshot), before);
});

test("selector excludes habitat-ineligible weighted templates and preserves stable ordering", () => {
  const snapshot = creator();
  const plan = resolveNearbyExplorationPlan(snapshot);
  assert.equal(plan.available, true);
  const state = structuredClone(snapshot.worldState);
  state.encounterContext = {
    regionId: plan.context.localRegionId,
    settlementId: plan.context.originSettlementId,
    siteId: null,
    worldHexId: plan.context.originWorldHexId,
    worldHexEdgeId: plan.context.worldHexEdgeId,
    habitatTags: plan.context.habitatTags,
    hazardPressure: plan.hazardPressure
  };
  const content = structuredClone(loadSpawnFoundationContent());
  let chosenKey = null;
  for (let seed = 0; seed < 100; seed += 1) {
    const key = `campaign:action:edge:${seed}`;
    if (resolveSpawnCandidates(state, 1, 0, { strict: true, selectionKey: key, content }).length) {
      chosenKey = key;
      break;
    }
  }
  assert.ok(chosenKey);
  const select = (catalog) => resolveSpawnCandidates(state, 1, 0, { strict: true, selectionKey: chosenKey, content: catalog });
  const selected = select(content);
  assert.equal(selected.length, 1);
  assert.equal(selected[0].encounterTemplateId, "encounter.kaelvar.roadside_kobold_patrol");
  const reversed = structuredClone(content);
  reversed.spawnProfiles.reverse();
  reversed.spawnProfileById.get("spawn.kaelvar.frontier_tracks").encounterWeights.reverse();
  assert.deepEqual(select(reversed), selected);
  const templateMismatch = structuredClone(content);
  templateMismatch.encounterTemplateById.get("encounter.kaelvar.roadside_kobold_patrol").habitatTags = ["quarry_edge"];
  assert.deepEqual(select(templateMismatch), []);
  const memberMismatch = structuredClone(content);
  memberMismatch.monsterById.get("monster.kobold_scout").habitatTags = ["quarry_edge"];
  assert.deepEqual(select(memberMismatch), []);
  const hazardMismatch = structuredClone(state);
  hazardMismatch.encounterContext.hazardPressure = 99;
  assert.deepEqual(resolveSpawnCandidates(hazardMismatch, 1, 0, { strict: true, selectionKey: chosenKey, content }), []);
});
