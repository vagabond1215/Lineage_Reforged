import test from "node:test";
import assert from "node:assert/strict";
import {
  createDefaultGameState,
  createDefaultPlayerCombatProfile
} from "../../packages/engines/game-engine/src/combat/state.ts";
import {
  createEncounterFromSpawnCandidate,
  tickCombatFoundation
} from "../../packages/engines/game-engine/src/combat/index.ts";
import { createEmptySessionState } from "../../packages/engines/game-engine/src/save-snapshot.ts";
import { resolveSpawnCandidates } from "../../packages/engines/world-engine/src/spawn/index.ts";
import { loadSpawnFoundationContent } from "../../packages/engines/world-engine/src/spawn/content.ts";
import {
  createEmptyPlayerResourceRuntimeState,
  resolvePlayerOriginProfile
} from "../../packages/shared/types/src/index.js";

const EMPTY_EQUIPMENT = {
  "slot.weapon.left": null,
  "slot.weapon.right": null,
  "slot.armor.head": null,
  "slot.armor.shoulder": null,
  "slot.armor.chest": null,
  "slot.armor.arm": null,
  "slot.armor.hand": null,
  "slot.armor.waist": null,
  "slot.armor.leg": null,
  "slot.armor.foot": null,
  "slot.accessory.ear": null,
  "slot.accessory.eyes": null,
  "slot.accessory.neck": null,
  "slot.accessory.arms": null,
  "slot.accessory.fingers": null,
  "slot.accessory.waist": null,
  "slot.accessory.ankle": null
};

function createPlayerStateFixture() {
  const coreData = {
    playerName: "Verifier",
    lineageId: "lineage.human",
    sexId: "male",
    classId: null
  };
  const attributes = {
    STR: 11,
    DEX: 10,
    AGI: 11,
    CON: 10,
    VIT: 10,
    WIS: 9,
    INT: 10,
    SPT: 9,
    CHA: 10
  };
  const progression = {
    level: 4,
    classLevel: 0,
    unspentAttributePoints: 0,
    unspentSkillPoints: 0
  };
  const originProfile = resolvePlayerOriginProfile(coreData, progression);
  const equipment = {
    ...EMPTY_EQUIPMENT,
    "slot.weapon.left": {
      itemId: "item.buckler_shield",
      itemKey: "buckler_shield",
      quantity: 1,
      durability: 0.95
    },
    "slot.weapon.right": {
      itemId: "item.arming_sword",
      itemKey: "arming_sword",
      quantity: 1,
      durability: 0.96
    }
  };

  return {
    playerId: "player.verifier",
    regionId: "region.kaelvar",
    coreData,
    attributes,
    resources: {
      hp: {
        current: originProfile.resolvedResourceMaxima.hp,
        max: originProfile.resolvedResourceMaxima.hp
      },
      mp: {
        current: originProfile.resolvedResourceMaxima.mp,
        max: originProfile.resolvedResourceMaxima.mp
      },
      stamina: {
        current: originProfile.resolvedResourceMaxima.stamina,
        max: originProfile.resolvedResourceMaxima.stamina
      }
    },
    resourceRuntime: createEmptyPlayerResourceRuntimeState(),
    progression,
    skills: [
      { id: "skill.combat.weapon.sword", rank: 18, source: "trained" },
      { id: "skill.combat.defense.shield_handling", rank: 14, source: "trained" },
      { id: "skill.combat.defense.evasion", rank: 12, source: "trained" }
    ],
    spells: [
      {
        id: "spell.fire.elemental.firebolt",
        school: "elemental",
        element: "fire",
        rank: 1,
        source: "learned"
      }
    ],
    abilities: [
      {
        id: "ability.melee.guard_break",
        category: "melee",
        rank: 1,
        source: "learned"
      }
    ],
    traits: [{ id: "trait.lineage.human.adaptable", source: "lineage" }],
    equipment,
    inventory: {
      bags: [
        {
          id: "bag.verifier",
          label: "Verifier Satchel",
          slotCapacity: 8,
          stacks: [{ itemId: "item.field_bandage", itemKey: "field_bandage", quantity: 2 }]
        }
      ],
      overflow: []
    },
    activeEffects: [],
    location: {
      settlementId: "settlement.aurelis",
      siteLabel: "Harbor Quarter",
      worldMapId: "world_map.first_world",
      knownSettlementIds: ["settlement.aurelis", "settlement.stonevein"]
    },
    currency: {
      gold: 5,
      silver: 12,
      copper: 4
    },
    originProfile,
    reputation: [],
    titles: [],
    discoveryChronicle: {
      entries: [],
      lastUpdatedTick: null
    },
    discoveredRegions: ["region.kaelvar"],
    activeQuestIds: [],
    completedQuestIds: [],
    flags: [],
    combatProfile: createDefaultPlayerCombatProfile(),
    saveMeta: {
      totalPlayTicks: 0,
      lastRestAtTick: 0,
      lastSavedAtTick: 0
    }
  };
}

function createWorldStateFixture() {
  return {
    activeRegions: ["region.kaelvar"],
    weatherState: {},
    encounterContext: {
      regionId: "region.kaelvar",
      settlementId: null,
      siteId: null,
      worldHexId: null,
      habitatTags: ["frontier_track", "roadside_ditch"],
      hazardPressure: 35
    }
  };
}

function resolveFirstSpawnCandidate(worldState, seed = 17) {
  for (let tick = 1; tick <= 256; tick += 1) {
    const candidates = resolveSpawnCandidates(worldState, tick, seed);
    if (candidates.length > 0) {
      return {
        tick,
        candidate: candidates[0]
      };
    }
  }

  throw new Error("Expected at least one spawn candidate for the Kaelvar frontier fixture.");
}

test("resolveSpawnCandidates emits encounter candidates for matching region, habitat, and hazard", () => {
  const { tick, candidate } = resolveFirstSpawnCandidate(createWorldStateFixture());

  assert.ok(tick > 0);
  assert.equal(candidate.regionId, "region.kaelvar");
  assert.ok(candidate.encounterTemplateId.startsWith("encounter.kaelvar."));
  assert.equal(candidate.spawnProfileId.startsWith("spawn.kaelvar."), true);
  assert.equal(candidate.hazardPressure, 35);
});

test("createEncounterFromSpawnCandidate builds scaled enemy combatants and binds the player party", () => {
  const { tick, candidate } = resolveFirstSpawnCandidate(createWorldStateFixture());
  const gameState = createDefaultGameState("normal");
  const playerState = createPlayerStateFixture();
  const scaledCandidate = {
    ...candidate,
    difficultyTier: 2
  };

  const encounter = createEncounterFromSpawnCandidate(gameState, playerState, scaledCandidate, tick);
  assert.ok(encounter, "expected encounter to be created from the resolved spawn candidate");
  assert.equal(encounter.area.regionId, "region.kaelvar");
  assert.equal(encounter.enemyCombatantIds.length > 0, true);
  assert.equal(gameState.party.leaderCombatantId, encounter.alliedCombatantIds[0]);

  const enemy = encounter.combatants.find((combatant) => combatant.kind === "enemy");
  assert.ok(enemy, "expected at least one enemy combatant");

  const monsterId = enemy.sourceRefs.monsterId;
  assert.ok(monsterId, "enemy combatant should preserve its source monster id");

  const monster = loadSpawnFoundationContent().monsterById.get(monsterId);
  assert.ok(monster, `missing monster content for ${monsterId}`);
  assert.equal(
    enemy.resources.hp.max,
    monster.combatProfile.baseHp + monster.difficultyScalingHooks.hpPerTier * scaledCandidate.difficultyTier
  );
  assert.equal(
    enemy.threatRating,
    monster.combatProfile.threatRating + scaledCandidate.difficultyTier
  );
});

test("tickCombatFoundation consumes staged manual commands and records the override in combat UI", () => {
  const { tick, candidate } = resolveFirstSpawnCandidate(createWorldStateFixture());
  const gameState = createDefaultGameState("normal");
  const playerState = createPlayerStateFixture();
  const sessionState = createEmptySessionState();

  tickCombatFoundation(gameState, playerState, [candidate], tick, sessionState);
  const encounter = gameState.activeEncounter;
  assert.ok(encounter, "expected active encounter after the first combat tick");

  const playerCombatantId = encounter.alliedCombatantIds[0];
  const targetId = encounter.enemyCombatantIds[0];
  assert.ok(playerCombatantId);
  assert.ok(targetId);

  sessionState.combatUi.selectedEnemyTargetId = targetId;
  sessionState.combatUi.stagedCommand = {
    actorCombatantId: playerCombatantId,
    actionType: "combat.interrupt.shield_bash",
    targetIds: [targetId],
    sourceType: "ability",
    sourceId: "ability.melee.guard_break",
    queueMode: "replace"
  };

  tickCombatFoundation(gameState, playerState, [], tick + 1, sessionState);

  assert.equal(sessionState.combatUi.stagedCommand, null);
  assert.ok(sessionState.combatUi.lastIssuedCommand, "expected manual command audit entry");
  assert.equal(sessionState.combatUi.lastIssuedCommand.actorCombatantId, playerCombatantId);
  assert.equal(sessionState.combatUi.lastIssuedCommand.actionType, "combat.interrupt.shield_bash");

  const updatedEncounter = gameState.activeEncounter;
  assert.ok(updatedEncounter, "encounter should still be active after staging a manual action");
  assert.equal(updatedEncounter.targeting.currentPlayerTargetId, targetId);

  const playerCombatant = updatedEncounter.combatants.find((combatant) => combatant.id === playerCombatantId);
  assert.ok(playerCombatant, "expected player combatant to remain in the encounter");
  assert.equal(playerCombatant.controlMode, "manual");

  const manualAction = updatedEncounter.actions.find(
    (action) =>
      action.actorCombatantId === playerCombatantId &&
      action.actionType === "combat.interrupt.shield_bash" &&
      action.manualOverride
  );
  assert.ok(manualAction, "expected the staged manual command to become a combat action");
  assert.equal(manualAction.source.sourceId, "ability.melee.guard_break");
  assert.equal(manualAction.source.defensiveSkillId, "skill.combat.defense.shield_handling");
  assert.equal(manualAction.source.shieldSkillId, "skill.combat.armor.small_shields");
  assert.equal(manualAction.source.itemHandlingType, "shield");
  assert.equal(manualAction.source.itemProficiencyBand, "clumsy");
  assert.equal(manualAction.source.skillIds.includes("skill.combat.defense.shield_handling"), true);
  assert.equal(manualAction.source.skillIds.includes("skill.combat.armor.small_shields"), true);
});

test("tickCombatFoundation maps learned spell metadata into queued combat actions", () => {
  const { tick, candidate } = resolveFirstSpawnCandidate(createWorldStateFixture());
  const gameState = createDefaultGameState("normal");
  const playerState = createPlayerStateFixture();
  const sessionState = createEmptySessionState();

  tickCombatFoundation(gameState, playerState, [candidate], tick, sessionState);
  const encounter = gameState.activeEncounter;
  assert.ok(encounter, "expected active encounter after the first combat tick");

  const playerCombatantId = encounter.alliedCombatantIds[0];
  const targetId = encounter.enemyCombatantIds[0];
  assert.ok(playerCombatantId);
  assert.ok(targetId);

  sessionState.combatUi.selectedEnemyTargetId = targetId;
  sessionState.combatUi.stagedCommand = {
    actorCombatantId: playerCombatantId,
    actionType: "spell.fire.elemental.firebolt",
    targetIds: [targetId],
    sourceType: "spell",
    sourceId: "spell.fire.elemental.firebolt",
    queueMode: "replace"
  };

  tickCombatFoundation(gameState, playerState, [], tick + 1, sessionState);

  const updatedEncounter = gameState.activeEncounter;
  assert.ok(updatedEncounter, "encounter should still be active after spell staging");

  const spellAction = updatedEncounter.actions.find(
    (action) =>
      action.actorCombatantId === playerCombatantId &&
      action.actionType === "spell.fire.elemental.firebolt" &&
      action.manualOverride
  );
  assert.ok(spellAction, "expected the staged spell command to become a combat action");
  assert.equal(spellAction.source.sourceId, "spell.fire.elemental.firebolt");
  assert.equal(spellAction.source.spellSchool, "elemental");
  assert.equal(spellAction.source.spellTradition, "arcane");
  assert.equal(spellAction.source.spellElement, "fire");
  assert.equal(spellAction.source.skillIds.includes("skill.magic.school.elemental"), true);
  assert.equal(spellAction.source.spellScalingChannels.includes("power"), true);
  assert.equal(spellAction.source.effectChannels.includes("elemental"), true);
});
