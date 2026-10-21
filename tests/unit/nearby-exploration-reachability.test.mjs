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
import { buildSaveMetadata, createSave, loadSave } from "../../apps/rpg-ui/src/game-shell/saveManager.ts";
import { loadSpawnFoundationContent } from "../../packages/engines/world-engine/src/spawn/content.ts";
import { resolveSpawnCandidates } from "../../packages/engines/world-engine/src/spawn/index.ts";

function creator(settlementId = "settlement.stonevein", regionId = "region.auric_marches", continentId = "region.kaelvar",
  startingBundleId = "starting_bundle.traveler") {
  const identity = getLineageIdentityCatalog("lineage.human");
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

function admittedSyntheticCombatCase(startSnapshot = creator()) {
  let snapshot = startSnapshot;
  let control = controlFor(snapshot);
  for (let attempt = 0; !snapshot.worldState.nearbyExplorationCandidate && attempt < 100; attempt += 1) {
    const result = advanceNearbyExplorationCaller(snapshot, control);
    assert.equal(result.outcome.accepted, true);
    ({ snapshot, control } = result.acceptedState);
  }
  assert.ok(snapshot.worldState.nearbyExplorationCandidate);
  const admitted = admitNearbyEncounter(snapshot, control, createNearbyEncounterAdmissionCommand(snapshot, control));
  assert.equal(admitted.accepted, true);
  return { snapshot: admitted.snapshot, control: admitted.control };
}

function hunterSnapshot() {
  return creator("settlement.stonevein", "region.auric_marches", "region.kaelvar", "starting_bundle.hunter");
}

test("ordinary nearby caller advances one authored enemy ranged AI action through damage and recovery", () => {
  let { snapshot, control } = admittedSyntheticCombatCase();
  const encounter = snapshot.gameState.activeEncounter;
  const scout = encounter.combatants.find((entry) => entry.sourceRefs?.monsterId === "monster.kobold_scout");
  const player = encounter.combatants.find((entry) => entry.kind === "player");
  assert.ok(scout);
  assert.ok(player);
  assert.equal(scout.controlMode, "ai");
  assert.ok(scout.hooks.roleModifierIds.includes("ranged_harrier"));
  scout.resources.stamina.current = 20;
  scout.resources.stamina.max = 20;
  for (const enemy of encounter.combatants.filter((entry) => entry.disposition === "enemy" && entry.id !== scout.id))
    enemy.timing.readyAtTick = snapshot.clock.tick + 1000;
  player.resources.hp.current = 999;
  player.resources.hp.max = 999;
  snapshot.playerState.resources.hp.current = 999;
  snapshot.playerState.resources.hp.max = 999;
  const staminaBefore = scout.resources.stamina.current;
  const sourceBefore = serializeSnapshot(snapshot);
  const wrongActor = createNearbyEncounterStepCommand(snapshot, control, "combat.advance", null, "ai.baseline.wrong_actor");
  assert.equal(executeNearbyEncounterStep(snapshot, control,
    { ...wrongActor, actorCombatantId: scout.id }).code, "wrong_actor");
  const stale = createNearbyEncounterStepCommand(snapshot, control, "combat.advance", null, "ai.baseline.stale");
  assert.equal(executeNearbyEncounterStep(snapshot, control,
    { ...stale, sourceRevision: stale.sourceRevision + 1 }).code, "stale_snapshot");
  assert.equal(serializeSnapshot(snapshot), sourceBefore);
  const first = createNearbyEncounterStepCommand(snapshot, control, "combat.advance", null, "ai.baseline.continue");
  const accepted = executeNearbyEncounterStep(snapshot, control, first);
  assert.equal(accepted.accepted, true);
  assert.equal(serializeSnapshot(snapshot), sourceBefore);
  assert.equal(accepted.control.sessionRevision, control.sessionRevision + 1);
  assert.equal(accepted.control.acceptedMutationIds.at(-1), first.requestId);
  assert.equal(executeNearbyEncounterStep(accepted.snapshot, accepted.control, first).code, "duplicate");
  assert.equal(accepted.snapshot.authorityLedger.nearbyEncounters.commands.at(-1).requestId, first.requestId);
  ({ snapshot, control } = accepted);
  let active = snapshot.gameState.activeEncounter;
  const aiActions = () => active.actions.filter((entry) => entry.actorCombatantId === scout.id);
  assert.equal(aiActions().length, 1);
  const actionId = aiActions()[0].id;
  assert.equal(aiActions()[0].actionType, "combat.attack.ranged.basic");
  assert.equal(aiActions()[0].source.sourceType, "basic_attack");
  assert.equal(aiActions()[0].source.sourceId, null);
  assert.equal(aiActions()[0].source.itemId, null);
  assert.deepEqual(aiActions()[0].resolutionHooks, ["damage.ranged"]);
  assert.deepEqual(aiActions()[0].targeting.targetIds, [player.id]);
  assert.equal(aiActions()[0].targeting.targetDisposition, "enemy");
  assert.notEqual(active.combatants.find((entry) => entry.id === scout.id).teamId, player.teamId);
  assert.equal(aiActions()[0].lifecycle, "executing");
  assert.equal(active.combatants.find((entry) => entry.id === scout.id).resources.stamina.current,
    staminaBefore - aiActions()[0].resourceCosts.stamina);
  const observed = new Set([aiActions()[0].lifecycle]);
  for (let beat = 0; active.actions.find((entry) => entry.id === actionId).lifecycle !== "resolved" && beat < 20; beat += 1) {
    const command = createNearbyEncounterStepCommand(snapshot, control, "combat.advance", null, `ai.baseline.beat.${beat}`);
    const result = executeNearbyEncounterStep(snapshot, control, command);
    assert.equal(result.accepted, true, `AI beat ${beat}: ${result.code}`);
    ({ snapshot, control } = result);
    active = snapshot.gameState.activeEncounter;
    assert.equal(aiActions().length, 1, "busy or recovering enemy must not queue another action");
    observed.add(active.actions.find((entry) => entry.id === actionId).lifecycle);
  }
  const resolved = active.actions.find((entry) => entry.id === actionId);
  assert.equal(resolved.lifecycle, "resolved");
  assert.ok(observed.has("recovering"));
  assert.ok(resolved.resolvesAtTick > resolved.startedAtTick);
  assert.ok(resolved.recoveryEndsAtTick > resolved.resolvesAtTick);
  assert.equal(active.combatants.find((entry) => entry.id === scout.id).resources.stamina.current,
    staminaBefore - resolved.resourceCosts.stamina);
  assert.ok(active.combatants.find((entry) => entry.id === player.id).resources.hp.current < 999);
  const reopened = deserializeSnapshot(serializeSnapshot(snapshot));
  assert.deepEqual(reopened.gameState.activeEncounter.actions.find((entry) => entry.id === actionId), resolved);
  assert.deepEqual(reopened.authorityLedger.nearbyEncounters.commands, snapshot.authorityLedger.nearbyEncounters.commands);
  const next = executeNearbyEncounterStep(snapshot, control,
    createNearbyEncounterStepCommand(snapshot, control, "combat.advance", null, "ai.baseline.next_ready"));
  assert.equal(next.accepted, true);
  const nextActions = next.snapshot.gameState.activeEncounter.actions.filter((entry) => entry.actorCombatantId === scout.id);
  assert.equal(nextActions.length, 2, "enemy may select only once on the next ready interval");
  assert.notEqual(nextActions[1].id, actionId);
  assert.equal(nextActions[1].lifecycle, "executing");
  assert.equal(next.snapshot.gameState.activeEncounter.combatants.find((entry) => entry.id === scout.id)
    .resources.stamina.current, staminaBefore - resolved.resourceCosts.stamina - nextActions[1].resourceCosts.stamina);
});

test("equipped bows reach ranged damage and archery through the ordinary nearby caller", () => {
  for (const { bowId, arrows } of [
    { bowId: "item.short_bow", arrows: true },
    { bowId: "item.short_bow", arrows: false },
    { bowId: "item.composite_bow", arrows: true }
  ]) {
    const start = hunterSnapshot();
    assert.equal(start.playerState.equipment["slot.weapon.right"].itemId, "item.short_bow");
    if (bowId === "item.composite_bow") {
      start.playerState.equipment["slot.weapon.right"] = {
        itemId: bowId, itemKey: "composite_bow", quantity: 1, durability: 1
      };
    }
    if (!arrows) for (const bag of start.playerState.inventory.bags)
      bag.stacks = bag.stacks.filter((stack) => stack.itemId !== "item.arrow_bundle");
    const inventoryBefore = structuredClone(start.playerState.inventory);
    let { snapshot, control } = admittedSyntheticCombatCase(start);
    const encounter = snapshot.gameState.activeEncounter;
    const player = encounter.combatants.find((entry) => entry.kind === "player");
    const targetId = encounter.enemyCombatantIds[0];
    for (const enemy of encounter.combatants.filter((entry) => entry.disposition === "enemy")) {
      enemy.resources.hp.current = 999;
      enemy.resources.hp.max = 999;
      enemy.timing.readyAtTick = snapshot.clock.tick + 1000;
    }
    const legal = listLegalPlayerCombatCommands(encounter);
    const archeryRankBefore = snapshot.playerState.skills.find((entry) =>
      entry.id === "skill.combat.weapon.archery")?.rank ?? 0;
    const ranged = legal.find((entry) => entry.actionType === "combat.ranged.primary" && entry.targetId === targetId);
    assert.ok(ranged, `${bowId} must be projected to the ordinary caller`);
    assert.equal(ranged.sourceType, "weapon_profile");
    assert.equal(ranged.sourceId, "combat.ranged.primary");
    assert.equal(ranged.staminaCost, 5);
    assert.equal(ranged.hpCost, 0);
    assert.equal(ranged.mpCost, 0);
    assert.ok(legal.some((entry) => entry.actionType === "combat.attack.melee.basic"));
    const sourceBefore = serializeSnapshot(snapshot);
    const wrongTarget = createNearbyEncounterStepCommand(snapshot, control, "combat.ranged.primary", player.id,
      `ranged.${bowId}.${arrows}.wrong_target`);
    assert.equal(executeNearbyEncounterStep(snapshot, control, wrongTarget).code, "illegal_command");
    assert.equal(serializeSnapshot(snapshot), sourceBefore);
    const command = createNearbyEncounterStepCommand(snapshot, control, "combat.ranged.primary", targetId,
      `ranged.${bowId}.${arrows}.shot`);
    const accepted = executeNearbyEncounterStep(snapshot, control, command);
    assert.equal(accepted.accepted, true, `${bowId} must be admitted by the nearby caller`);
    assert.equal(serializeSnapshot(snapshot), sourceBefore);
    assert.equal(accepted.control.sessionRevision, control.sessionRevision + 1);
    assert.equal(accepted.control.acceptedMutationIds.at(-1), command.requestId);
    assert.equal(executeNearbyEncounterStep(accepted.snapshot, accepted.control, command).code, "duplicate");
    assert.equal(executeNearbyEncounterStep(accepted.snapshot, accepted.control,
      { ...command, targetId: player.id }).code, "request_conflict");
    assert.ok(accepted.snapshot.authorityLedger.nearbyEncounters.commands.some((entry) =>
      entry.requestId === command.requestId && entry.actionType === "combat.ranged.primary" &&
      entry.targetId === targetId && entry.result === "active"));
    assert.equal(executeNearbyEncounterStep(accepted.snapshot, accepted.control,
      createNearbyEncounterStepCommand(snapshot, control, "combat.ranged.primary", targetId,
        `ranged.${bowId}.${arrows}.stale`)).code, "stale_snapshot");
    ({ snapshot, control } = accepted);
    const action = snapshot.gameState.activeEncounter.actions.find((entry) =>
      entry.actorCombatantId === player.id && entry.manualOverride && entry.actionType === "combat.ranged.primary");
    assert.ok(action);
    assert.equal(action.lifecycle, "executing");
    assert.equal(action.source.sourceType, "weapon_profile");
    assert.equal(action.source.sourceId, "combat.ranged.primary");
    assert.equal(action.source.itemId, bowId);
    assert.equal(action.source.weaponSkillId, "skill.combat.weapon.archery");
    assert.equal(action.source.itemHandlingType, "weapon");
    assert.deepEqual(action.targeting.targetIds, [targetId]);
    assert.ok(action.resolutionHooks.includes("damage.ranged"));
    assert.equal(action.resourceCosts.stamina, 5);
    assert.equal(action.executionTimeTicks > 0 && action.recoveryTimeTicks > 0, true);
    assert.notEqual(action.startedAtTick, null);
    assert.equal(snapshot.gameState.activeEncounter.combatants.find((entry) => entry.id === player.id)
      .resources.stamina.current, player.resources.stamina.current - 5);
    const observedLifecycles = new Set([action.lifecycle]);
    for (let beat = 0; snapshot.gameState.activeEncounter.actions.find((entry) => entry.id === action.id).lifecycle !== "resolved" &&
        beat < 20; beat += 1) {
      const result = executeNearbyEncounterStep(snapshot, control,
        createNearbyEncounterStepCommand(snapshot, control, "combat.advance", null,
          `ranged.${bowId}.${arrows}.advance.${beat}`));
      assert.equal(result.accepted, true, `${bowId} beat ${beat}: ${result.code}`);
      ({ snapshot, control } = result);
      observedLifecycles.add(snapshot.gameState.activeEncounter.actions.find((entry) => entry.id === action.id).lifecycle);
    }
    const resolved = snapshot.gameState.activeEncounter.actions.find((entry) => entry.id === action.id);
    assert.equal(resolved.lifecycle, "resolved");
    assert.ok(observedLifecycles.has("recovering"));
    assert.ok(resolved.resolvesAtTick > resolved.startedAtTick);
    assert.ok(resolved.recoveryEndsAtTick > resolved.resolvesAtTick);
    assert.ok(snapshot.gameState.activeEncounter.combatants.find((entry) => entry.id === targetId).resources.hp.current < 999);
    assert.ok(snapshot.gameState.activeEncounter.skillGainAttemptState.attemptedCapKeys.includes(
      "combat_action:weapon_attack:skill.combat.weapon.archery"));
    assert.equal(snapshot.playerState.skills.find((entry) => entry.id === "skill.combat.weapon.archery")?.rank,
      archeryRankBefore + 1);
    assert.ok(listLegalPlayerCombatCommands(snapshot.gameState.activeEncounter).some((entry) =>
      entry.actionType === "combat.ranged.primary" && entry.targetId === targetId));
    assert.deepEqual(snapshot.playerState.inventory, inventoryBefore, "current ranged action does not debit arrows");
    const reopened = deserializeSnapshot(serializeSnapshot(snapshot));
    assert.deepEqual(reopened.gameState.activeEncounter.actions.find((entry) => entry.id === action.id), resolved);
    assert.deepEqual(reopened.authorityLedger.nearbyEncounters.commands, snapshot.authorityLedger.nearbyEncounters.commands);
    assert.deepEqual(reopened.playerState.inventory, inventoryBefore);
  }
});

test("nearby basic, sword and bow receipts retain a paid action when its target becomes incapacitated", () => {
  for (const { actionType, start } of [
    { actionType: "combat.attack.melee.basic", start: () => creator("settlement.stonevein", "region.auric_marches", "region.kaelvar", "starting_bundle.warrior") },
    { actionType: "combat.melee.primary", start: () => creator("settlement.stonevein", "region.auric_marches", "region.kaelvar", "starting_bundle.warrior") },
    { actionType: "combat.ranged.primary", start: hunterSnapshot }
  ]) {
    let { snapshot, control } = admittedSyntheticCombatCase(start());
    const encounter = snapshot.gameState.activeEncounter;
    const player = encounter.combatants.find((entry) => entry.kind === "player");
    const targetId = encounter.enemyCombatantIds[0];
    for (const enemy of encounter.combatants.filter((entry) => entry.disposition === "enemy")) {
      enemy.resources.hp.current = 999;
      enemy.resources.hp.max = 999;
      enemy.timing.readyAtTick = snapshot.clock.tick + 1000;
    }
    const legal = listLegalPlayerCombatCommands(encounter).find((entry) =>
      entry.actionType === actionType && entry.targetId === targetId);
    assert.ok(legal, `${actionType} must reach the nearby caller`);
    const wrong = createNearbyEncounterStepCommand(snapshot, control, actionType, player.id,
      `target_change.${actionType}.wrong`);
    const sourceBefore = serializeSnapshot(snapshot);
    assert.equal(executeNearbyEncounterStep(snapshot, control, wrong).code, "illegal_command");
    assert.equal(serializeSnapshot(snapshot), sourceBefore);
    const command = createNearbyEncounterStepCommand(snapshot, control, actionType, targetId,
      `target_change.${actionType}.attack`);
    const accepted = executeNearbyEncounterStep(snapshot, control, command);
    assert.equal(accepted.accepted, true);
    assert.equal(serializeSnapshot(snapshot), sourceBefore);
    assert.equal(accepted.control.sessionRevision, control.sessionRevision + 1);
    assert.equal(executeNearbyEncounterStep(accepted.snapshot, accepted.control, command).code, "duplicate");
    assert.equal(executeNearbyEncounterStep(accepted.snapshot, accepted.control,
      { ...command, targetId: player.id }).code, "request_conflict");
    assert.equal(executeNearbyEncounterStep(accepted.snapshot, accepted.control,
      createNearbyEncounterStepCommand(snapshot, control, actionType, targetId,
        `target_change.${actionType}.stale`)).code, "stale_snapshot");
    ({ snapshot, control } = accepted);
    const action = snapshot.gameState.activeEncounter.actions.find((entry) =>
      entry.actorCombatantId === player.id && entry.manualOverride && entry.actionType === actionType);
    assert.ok(action);
    assert.equal(action.lifecycle, "executing");
    assert.equal(snapshot.gameState.activeEncounter.combatants.find((entry) => entry.id === player.id)
      .resources.stamina.current, player.resources.stamina.current - legal.staminaCost);
    const target = snapshot.gameState.activeEncounter.combatants.find((entry) => entry.id === targetId);
    const hpBefore = target.resources.hp.current;
    target.incapacitated = true;
    for (let beat = 0; snapshot.gameState.activeEncounter.actions.find((entry) => entry.id === action.id).lifecycle !== "resolved" &&
        beat < 20; beat += 1) {
      const next = executeNearbyEncounterStep(snapshot, control,
        createNearbyEncounterStepCommand(snapshot, control, "combat.advance", null,
          `target_change.${actionType}.advance.${beat}`));
      assert.equal(next.accepted, true, `${actionType} beat ${beat}: ${next.code}`);
      ({ snapshot, control } = next);
    }
    const ended = snapshot.gameState.activeEncounter.actions.find((entry) => entry.id === action.id);
    assert.equal(ended.lifecycle, "resolved");
    assert.equal(snapshot.gameState.activeEncounter.combatants.find((entry) => entry.id === targetId)
      .resources.hp.current, hpBefore);
    assert.equal(snapshot.gameState.activeEncounter.combatants.find((entry) => entry.id === player.id)
      .resources.stamina.current, player.resources.stamina.current - legal.staminaCost);
    assert.ok(snapshot.authorityLedger.nearbyEncounters.commands.some((entry) =>
      entry.requestId === command.requestId && entry.targetId === targetId));
    const reopened = deserializeSnapshot(serializeSnapshot(snapshot));
    assert.deepEqual(reopened.gameState.activeEncounter.actions.find((entry) => entry.id === action.id), ended);
    assert.deepEqual(reopened.authorityLedger.nearbyEncounters.commands, snapshot.authorityLedger.nearbyEncounters.commands);
  }
});

test("inventory-only bow and insufficient stamina do not project an equipped ranged command", () => {
  for (const condition of ["inventory_only", "unaffordable"]) {
    const start = hunterSnapshot();
    if (condition === "inventory_only") {
      start.playerState.equipment["slot.weapon.right"] = null;
      start.playerState.inventory.bags[0].stacks.push({ itemId: "item.short_bow", itemKey: "short_bow", quantity: 1 });
    }
    const { snapshot, control } = admittedSyntheticCombatCase(start);
    if (condition === "unaffordable") {
      snapshot.playerState.resources.stamina.current = 4;
      snapshot.gameState.activeEncounter.combatants.find((entry) => entry.kind === "player")
        .resources.stamina.current = 4;
    }
    const targetId = snapshot.gameState.activeEncounter.enemyCombatantIds[0];
    assert.equal(listLegalPlayerCombatCommands(snapshot.gameState.activeEncounter).some((entry) =>
      entry.actionType === "combat.ranged.primary"), false, condition);
    assert.ok(listLegalPlayerCombatCommands(snapshot.gameState.activeEncounter).some((entry) =>
      entry.actionType === "combat.attack.melee.basic"));
    const sourceBefore = serializeSnapshot(snapshot);
    assert.equal(executeNearbyEncounterStep(snapshot, control,
      createNearbyEncounterStepCommand(snapshot, control, "combat.ranged.primary", targetId,
        `ranged.${condition}.rejected`)).code, "illegal_command");
    assert.equal(serializeSnapshot(snapshot), sourceBefore);
  }
});

function withSyntheticLocalSave(run) {
  const priorWindow = globalThis.window;
  const values = new Map();
  globalThis.window = { localStorage: {
    get length() { return values.size; },
    key(index) { return [...values.keys()][index] ?? null; },
    getItem(key) { return values.get(String(key)) ?? null; },
    setItem(key, value) { values.set(String(key), String(value)); },
    removeItem(key) { values.delete(String(key)); },
    clear() { values.clear(); }
  } };
  try { return run(); } finally {
    if (priorWindow === undefined) delete globalThis.window;
    else globalThis.window = priorWindow;
  }
}

test("synthetic terminal owner fixtures admit real victory and defeat with durable receipts", () => {
  for (const expected of ["allies_victorious", "enemies_victorious"]) {
    let { snapshot, control } = admittedSyntheticCombatCase();
    const encounterId = snapshot.gameState.activeEncounter.encounterId;
    const playerId = snapshot.gameState.activeEncounter.alliedCombatantIds[0];
    if (expected === "allies_victorious") {
      for (const enemy of snapshot.gameState.activeEncounter.combatants.filter((entry) => entry.disposition === "enemy")) {
        enemy.resources.hp.current = 1;
        enemy.timing.readyAtTick = snapshot.clock.tick + 1000;
      }
    } else {
      const player = snapshot.gameState.activeEncounter.combatants.find((entry) => entry.id === playerId);
      player.resources.hp.current = 1;
      snapshot.playerState.resources.hp.current = 1;
    }
    const rejectedSource = serializeSnapshot(snapshot);
    const rejectedControl = structuredClone(control);
    const rejectedCommand = createNearbyEncounterStepCommand(snapshot, control, "combat.advance", null,
      `terminal.${expected}.rejected`);
    assert.equal(executeNearbyEncounterStep(snapshot, control,
      { ...rejectedCommand, sourceRevision: rejectedCommand.sourceRevision + 1 }).code, "stale_snapshot");
    assert.equal(executeNearbyEncounterStep(snapshot, control,
      { ...rejectedCommand, actorCombatantId: "combatant.wrong_actor" }).code, "wrong_actor");
    assert.equal(serializeSnapshot(snapshot), rejectedSource);
    assert.deepEqual(control, rejectedControl);
    let terminalCommand = null;
    for (let beat = 0; snapshot.gameState.activeEncounter && beat < 150; beat += 1) {
      const legal = listLegalPlayerCombatCommands(snapshot.gameState.activeEncounter);
      const attack = expected === "allies_victorious"
        ? legal.find((entry) => entry.actionType === "combat.attack.melee.basic") : null;
      const actionType = attack?.actionType ?? "combat.advance";
      terminalCommand = createNearbyEncounterStepCommand(snapshot, control, actionType, attack?.targetId ?? null,
        `terminal.${expected}.${beat}`);
      const source = serializeSnapshot(snapshot);
      const sourceRevision = control.sessionRevision;
      const result = executeNearbyEncounterStep(snapshot, control, terminalCommand);
      assert.equal(result.accepted, true, `${expected} beat ${beat}: ${result.code}`);
      assert.equal(result.control.sessionRevision, sourceRevision + 1);
      assert.equal(result.control.acceptedMutationIds.at(-1), terminalCommand.requestId);
      assert.equal(serializeSnapshot(snapshot), source, "source snapshot must remain unchanged");
      ({ snapshot, control } = result);
    }
    assert.equal(snapshot.gameState.activeEncounter, null, `${expected} fixture must terminate via the real caller`);
    assert.equal(snapshot.gameState.combatHistory.at(-1).result, expected);
    assert.equal(snapshot.gameState.combatHistory.at(-1).encounterId, encounterId);
    assert.equal(snapshot.gameState.combatHistory.at(-1).endedAtTick, terminalCommand.expectedTick + 1);
    assert.equal(snapshot.gameState.party.leaderCombatantId, null);
    assert.ok(snapshot.gameState.party.members.every((entry) => entry.combatantId === null));
    const terminalLedger = snapshot.authorityLedger.nearbyEncounters.commands.filter((entry) =>
      entry.encounterId === encounterId && entry.result === expected);
    assert.equal(terminalLedger.length, 1);
    assert.equal(terminalLedger[0].requestId, terminalCommand.requestId);
    assert.equal(executeNearbyEncounterStep(snapshot, control, terminalCommand).code, "duplicate");
    assert.equal(executeNearbyEncounterStep(snapshot, control,
      { ...terminalCommand, targetId: "combatant.conflict" }).code, "request_conflict");
    const restored = deserializeSnapshot(serializeSnapshot(snapshot));
    assert.deepEqual(restored.gameState.combatHistory.at(-1), snapshot.gameState.combatHistory.at(-1));
    assert.deepEqual(restored.authorityLedger.nearbyEncounters.commands.at(-1),
      snapshot.authorityLedger.nearbyEncounters.commands.at(-1));
    assert.equal(restored.gameState.activeEncounter, null);
    if (expected === "enemies_victorious") {
      assert.equal(restored.normalDefeatReceipts.at(-1).posture, "playable");
      assert.ok(restored.playerState.resources.hp.current > 0);
    } else {
      assert.equal(restored.normalDefeatReceipts?.length ?? 0, 0);
    }
    withSyntheticLocalSave(() => {
      createSave(snapshot.accountId, "manual-1", snapshot, buildSaveMetadata("manual-1", snapshot));
      const loaded = loadSave(snapshot.accountId, "manual-1");
      assert.ok(loaded);
      assert.deepEqual(loaded.gameState.combatHistory.at(-1), snapshot.gameState.combatHistory.at(-1));
      assert.deepEqual(loaded.authorityLedger.nearbyEncounters.commands.at(-1),
        snapshot.authorityLedger.nearbyEncounters.commands.at(-1));
      assert.equal(loaded.gameState.activeEncounter, null);
      assert.equal(resolveNearbyExplorationPlan(loaded).available, true);
    });
    assert.equal(resolveNearbyExplorationPlan(restored).available, true);
    const continued = advanceNearbyExplorationCaller(restored, control);
    assert.equal(continued.outcome.accepted, true);
  }
});

test("synthetic defeat without a safe destination retains the recovery gate", () => {
  let { snapshot, control } = admittedSyntheticCombatCase();
  const player = snapshot.gameState.activeEncounter.combatants.find((entry) => entry.kind === "player");
  player.resources.hp.current = 1;
  snapshot.playerState.resources.hp.current = 1;
  snapshot.playerState.location.settlementId = null;
  snapshot.sessionState.knownLocations = [];
  snapshot.playerState.flags = snapshot.playerState.flags.filter((flag) => !flag.startsWith("player.start."));
  let terminalCommand = null;
  for (let beat = 0; snapshot.gameState.activeEncounter && beat < 80; beat += 1) {
    const command = createNearbyEncounterStepCommand(snapshot, control, "combat.advance", null, `pending.defeat.${beat}`);
    terminalCommand = command;
    const result = executeNearbyEncounterStep(snapshot, control, command);
    assert.equal(result.accepted, true, `beat ${beat}: ${result.code}`);
    ({ snapshot, control } = result);
  }
  assert.equal(snapshot.gameState.activeEncounter, null);
  assert.equal(snapshot.gameState.combatHistory.at(-1).result, "enemies_victorious");
  assert.equal(snapshot.normalDefeatReceipts.at(-1).posture, "recovery_pending");
  assert.equal(resolveNearbyExplorationPlan(snapshot).code, "recovery_pending");
  const reopened = deserializeSnapshot(serializeSnapshot(snapshot));
  assert.equal(reopened.normalDefeatReceipts.at(-1).posture, "recovery_pending");
  assert.equal(resolveNearbyExplorationPlan(reopened).code, "recovery_pending");
  const replay = createNearbyEncounterStepCommand(snapshot, control, "combat.advance", null, "pending.defeat.blocked");
  assert.equal(replay, null, "no encounter can mint a new step while recovery is pending");
  assert.equal(executeNearbyEncounterStep(snapshot, control, {
    ...terminalCommand, requestId: "pending.defeat.blocked", sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision, sourceSnapshot: serializeSnapshot(snapshot), expectedTick: snapshot.clock.tick
  }).code, "recovery_pending");
});

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
