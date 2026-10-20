import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultCharacterCreationFormState } from "../../apps/rpg-ui/src/game-shell/characterCreationForm.ts";
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from "../../apps/rpg-ui/src/game-shell/characterCreationCatalog.ts";
import { createNewGameSnapshot } from "../../apps/rpg-ui/src/game-shell/newGameSnapshot.ts";
import { advanceNearbyExplorationCaller } from "../../apps/rpg-ui/src/runtime/nearbyExplorationCaller.ts";
import { listLegalPlayerCombatCommands } from "../../packages/engines/game-engine/src/combat/index.ts";
import { admitNearbyEncounter, createNearbyEncounterAdmissionCommand, createNearbyEncounterStepCommand, executeNearbyEncounterStep } from "../../packages/engines/game-engine/src/player-nearby-encounter.ts";
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

test("ordinary Warrior creator exposes and accepts basic melee beside Arming Sword attack", () => {
  const identity = getLineageIdentityCatalog("lineage.human");
  const bundle = "starting_bundle.warrior";
  const form = {
    ...createDefaultCharacterCreationFormState("slot-warrior-combat"),
    playerName: "Warrior Combat",
    hairColorId: identity.hairColorOptions[0].id,
    eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id,
    startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: "backstory.craftsmans_child",
    continentId: "region.kaelvar", regionId: "region.auric_marches",
    startingSettlementId: "settlement.stonevein"
  };
  let snapshot = createNewGameSnapshot(form, "account.warrior_combat");
  let control = controlFor(snapshot);
  assert.equal(snapshot.playerState.equipment["slot.weapon.right"]?.itemId, "item.arming_sword");
  for (let attempt = 0; !snapshot.worldState.nearbyExplorationCandidate && attempt < 100; attempt += 1) {
    const result = advanceNearbyExplorationCaller(snapshot, control);
    assert.equal(result.outcome.accepted, true);
    ({ snapshot, control } = result.acceptedState);
  }
  assert.ok(snapshot.worldState.nearbyExplorationCandidate);
  const admitted = admitNearbyEncounter(snapshot, control, createNearbyEncounterAdmissionCommand(snapshot, control));
  assert.equal(admitted.accepted, true);
  ({ snapshot, control } = admitted);
  const legal = listLegalPlayerCombatCommands(snapshot.gameState.activeEncounter);
  const firstTarget = snapshot.gameState.activeEncounter.enemyCombatantIds[0];
  const self = snapshot.gameState.activeEncounter.combatants.find((entry) => entry.kind === "player");
  assert.ok(legal.some((entry) => entry.actionType === "combat.defense.block" && entry.targetId === self.id));
  for (const actionType of ["combat.attack.melee.basic", "combat.melee.primary"]) {
    const choice = legal.find((entry) => entry.actionType === actionType && entry.targetId === firstTarget);
    assert.ok(choice, `${actionType} must be offered to the real caller`);
    const command = createNearbyEncounterStepCommand(snapshot, control, actionType, firstTarget, `step.${actionType}`);
    const result = executeNearbyEncounterStep(snapshot, control, command);
    assert.equal(result.accepted, true, `${actionType} must be accepted`);
    const player = result.snapshot.gameState.activeEncounter.combatants.find((entry) => entry.kind === "player");
    assert.ok(result.snapshot.gameState.activeEncounter.actions.some((entry) =>
      entry.actorCombatantId === player.id && entry.manualOverride && entry.actionType === actionType));
  }
  const sourceBefore = serializeSnapshot(snapshot);
  const wrongTarget = createNearbyEncounterStepCommand(snapshot, control, "combat.defense.block", firstTarget, "step.block.wrong_target");
  assert.equal(executeNearbyEncounterStep(snapshot, control, wrongTarget).code, "illegal_command");
  assert.equal(serializeSnapshot(snapshot), sourceBefore);
  const blockCommand = createNearbyEncounterStepCommand(snapshot, control, "combat.defense.block", self.id, "step.block.self");
  const blockResult = executeNearbyEncounterStep(snapshot, control, blockCommand);
  assert.equal(blockResult.accepted, true);
  assert.equal(serializeSnapshot(snapshot), sourceBefore, "admission must not mutate the source snapshot");
  const blockEncounter = blockResult.snapshot.gameState.activeEncounter;
  const blockPlayer = blockEncounter.combatants.find((entry) => entry.id === self.id);
  const blockAction = blockEncounter.actions.find((entry) => entry.actorCombatantId === self.id &&
    entry.manualOverride && entry.actionType === "combat.defense.block");
  assert.ok(blockAction);
  assert.deepEqual(blockAction.targeting.targetIds, [self.id]);
  assert.equal(blockAction.source.itemId, "item.buckler_shield");
  assert.equal(blockPlayer.resources.stamina.current, self.resources.stamina.current - 2);
  assert.ok(blockResult.snapshot.authorityLedger.nearbyEncounters.commands.some((entry) =>
    entry.requestId === "step.block.self" && entry.actionType === "combat.defense.block" && entry.targetId === self.id));
  assert.equal(executeNearbyEncounterStep(blockResult.snapshot, blockResult.control, blockCommand).code, "duplicate");
  assert.equal(executeNearbyEncounterStep(blockResult.snapshot, blockResult.control,
    { ...blockCommand, targetId: firstTarget }).code, "request_conflict");
  const staleBlock = createNearbyEncounterStepCommand(snapshot, control, "combat.defense.block", self.id, "step.block.stale");
  assert.equal(executeNearbyEncounterStep(blockResult.snapshot, blockResult.control, staleBlock).code, "stale_snapshot");
  const continued = executeNearbyEncounterStep(blockResult.snapshot, blockResult.control,
    createNearbyEncounterStepCommand(blockResult.snapshot, blockResult.control, "combat.advance", null, "step.block.continue"));
  assert.equal(continued.accepted, true);
  const continuedPlayer = continued.snapshot.gameState.activeEncounter.combatants.find((entry) => entry.id === self.id);
  assert.ok(continuedPlayer.statusEffects.some((entry) => entry.tags.includes("block")));
  const reopened = deserializeSnapshot(serializeSnapshot(continued.snapshot));
  assert.ok(reopened.gameState.activeEncounter.combatants.find((entry) => entry.id === self.id)
    .statusEffects.some((entry) => entry.tags.includes("block")));
  let resumed = continued;
  for (let beat = 0; beat < 3; beat += 1) {
    resumed = executeNearbyEncounterStep(resumed.snapshot, resumed.control,
      createNearbyEncounterStepCommand(resumed.snapshot, resumed.control, "combat.advance", null,
        `step.block.recovery.${beat}`));
    assert.equal(resumed.accepted, true);
  }
  assert.equal(resumed.snapshot.gameState.activeEncounter.actions.find((entry) => entry.id === blockAction.id).lifecycle,
    "resolved");
  assert.ok(listLegalPlayerCombatCommands(resumed.snapshot.gameState.activeEncounter).some((entry) =>
    entry.actionType === "combat.defense.block" && entry.targetId === self.id));
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
