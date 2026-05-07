import test from "node:test";
import assert from "node:assert/strict";
import {
  createDefaultGameState,
  createDefaultPlayerCombatProfile
} from "../../packages/engines/game-engine/src/combat/state.ts";
import {
  createDefaultPlayerBodyState,
  createDefaultPlayerStatGrowthState,
  createPlayerProgressionState,
  resolvePlayerEchoProgression
} from "../../packages/engines/player-engine/src/index.ts";
import {
  createEncounterFromSpawnCandidate,
  queueManualCombatCommand,
  resolveCombatDamagePreview,
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

function mergeSkillFixtures(baseSkills, extraSkills) {
  const byId = new Map(baseSkills.map((skill) => [skill.id, skill]));
  for (const skill of extraSkills) {
    byId.set(skill.id, skill);
  }
  return [...byId.values()];
}

function createPlayerStateFixture({ equipmentOverrides = {}, extraSkills = [] } = {}) {
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
  const progression = createPlayerProgressionState({
    legacyGrowth: {
      resourceGrowthLevel: 4,
      classLevel: 0,
      unspentAttributePoints: 0,
      unspentSkillPoints: 0
    }
  });
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
    },
    ...equipmentOverrides
  };
  const skills = mergeSkillFixtures(
    [
      { id: "skill.combat.weapon.sword", rank: 18, source: "trained" },
      { id: "skill.combat.defense.shield_handling", rank: 14, source: "trained" },
      { id: "skill.combat.defense.evasion", rank: 12, source: "trained" }
    ],
    extraSkills
  );

  const playerState = {
    playerId: "player.verifier",
    regionId: "region.kaelvar",
    coreData,
    attributes,
    statGrowth: createDefaultPlayerStatGrowthState(1),
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
      },
      xp: {
        current: 0,
        total: 0,
        toNextLevel: 100
      }
    },
    bodyState: createDefaultPlayerBodyState({
      tick: 0,
      day: 1,
      lineageId: coreData.lineageId
    }),
    resourceRuntime: createEmptyPlayerResourceRuntimeState(),
    progression,
    skills,
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
      worldMapId: "world_map.first_world"
    },
    currency: {
      gold: 5,
      silver: 12,
      copper: 4
    },
    originProfile,
    standing: [],
    reputation: {
      fame: [],
      notoriety: [],
      notorietyEvents: []
    },
    titles: [],
    discoveryChronicle: {
      entries: [],
      lastUpdatedTick: null
    },
    geographicKnowledge: [
      { scope: "continent", geographyId: "region.kaelvar", level: 1 },
      { scope: "region", geographyId: "region.verdant_thalos", level: 1 },
      { scope: "settlement", geographyId: "settlement.aurelis", level: 1 },
      { scope: "settlement", geographyId: "settlement.stonevein", level: 1 }
    ],
    activeQuestIds: [],
    completedQuestIds: [],
    flags: [],
    combatProfile: createDefaultPlayerCombatProfile(),
    saveMeta: {
      totalPlayTicks: 0,
      lastRestAtTick: 0,
      lastSavedAtTick: 0,
      lastReputationDecayDay: 1
    }
  };

  playerState.progression = resolvePlayerEchoProgression(playerState);
  return playerState;
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

function createSpawnCandidateFixture(overrides = {}) {
  return {
    id: "test.spawn.kobold_patrol",
    spawnProfileId: "spawn.kaelvar.frontier_tracks",
    encounterTemplateId: "encounter.kaelvar.roadside_kobold_patrol",
    regionId: "region.kaelvar",
    worldHexId: null,
    settlementId: null,
    siteId: null,
    habitatTags: ["frontier_track", "roadside_ditch"],
    hazardPressure: 35,
    selectedAtTick: 1,
    difficultyTier: 0,
    disposition: "hostile",
    movementMode: "roaming",
    spawnWeight: 1,
    ...overrides
  };
}

function createEncounterFixture(playerState = createPlayerStateFixture(), candidateOverrides = {}) {
  const gameState = createDefaultGameState("normal");
  const candidate = createSpawnCandidateFixture(candidateOverrides);
  const encounter = createEncounterFromSpawnCandidate(gameState, playerState, candidate, candidate.selectedAtTick);
  assert.ok(encounter, "expected encounter fixture to be created");
  return { gameState, playerState, encounter, candidate };
}

function findPlayerCombatant(encounter) {
  const player = encounter.combatants.find((combatant) => combatant.kind === "player");
  assert.ok(player, "expected player combatant");
  return player;
}

function findEnemyCombatant(encounter, monsterId = null) {
  const enemy = encounter.combatants.find(
    (combatant) => combatant.kind === "enemy" && (!monsterId || combatant.sourceRefs.monsterId === monsterId)
  );
  assert.ok(enemy, `expected enemy combatant${monsterId ? ` for ${monsterId}` : ""}`);
  return enemy;
}

function queueActionFixture(encounter, actor, actionType, targetIds, sourceType = "basic_attack", sourceId = null) {
  queueManualCombatCommand(encounter, {
    actorCombatantId: actor.id,
    actionType,
    targetIds,
    sourceType,
    sourceId,
    queueMode: "replace"
  });
  const action = encounter.actions.at(-1);
  assert.ok(action, "expected queued action");
  return action;
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

test("createEncounterFromSpawnCandidate ignores echo level inflation when rating player threat", () => {
  const { tick, candidate } = resolveFirstSpawnCandidate(createWorldStateFixture());
  const baselineGameState = createDefaultGameState("normal");
  const inflatedGameState = createDefaultGameState("normal");
  const baselinePlayer = createPlayerStateFixture();
  const inflatedPlayer = structuredClone(baselinePlayer);

  inflatedPlayer.progression = {
    ...inflatedPlayer.progression,
    level: 99,
    echo: {
      ...inflatedPlayer.progression.echo,
      echoAdjusted: 999
    }
  };

  const baselineEncounter = createEncounterFromSpawnCandidate(baselineGameState, baselinePlayer, candidate, tick);
  const inflatedEncounter = createEncounterFromSpawnCandidate(inflatedGameState, inflatedPlayer, candidate, tick);

  assert.ok(baselineEncounter);
  assert.ok(inflatedEncounter);

  const baselineCombatant = baselineEncounter.combatants.find((combatant) => combatant.kind === "player");
  const inflatedCombatant = inflatedEncounter.combatants.find((combatant) => combatant.kind === "player");

  assert.ok(baselineCombatant);
  assert.ok(inflatedCombatant);
  assert.equal(inflatedCombatant.threatRating, baselineCombatant.threatRating);
});

test("ranged enemy packages resolve to ranged damage instead of the melee fallback", () => {
  const { encounter } = createEncounterFixture();
  const player = findPlayerCombatant(encounter);
  const scout = findEnemyCombatant(encounter, "monster.kobold_scout");

  const action = queueActionFixture(encounter, scout, "combat.attack.ranged.basic", [player.id]);
  const preview = resolveCombatDamagePreview(action, scout, player);

  assert.equal(action.actionType, "combat.attack.ranged.basic");
  assert.deepEqual(action.resolutionHooks, ["damage.ranged"]);
  assert.equal(preview.actionFamily, "ranged");
  assert.ok(preview.amount > 0);
});

test("unknown manual combat actions currently fall back to basic melee", () => {
  const { encounter } = createEncounterFixture();
  const player = findPlayerCombatant(encounter);
  const enemy = findEnemyCombatant(encounter);

  const action = queueActionFixture(
    encounter,
    player,
    "combat.future.unmapped",
    [enemy.id],
    "ability",
    "ability.future.unmapped"
  );
  const preview = resolveCombatDamagePreview(action, player, enemy);

  assert.equal(action.actionType, "combat.attack.melee.basic");
  assert.deepEqual(action.resolutionHooks, ["damage.melee"]);
  assert.deepEqual(action.resourceCosts, { stamina: 4 });
  assert.equal(preview.actionFamily, "melee");
  assert.ok(preview.amount > 0);
});

test("item-profile weapon actions receive basic weapon skill effects through action aliases", () => {
  const { encounter } = createEncounterFixture(
    createPlayerStateFixture({
      extraSkills: [{ id: "skill.combat.weapon.sword", rank: 60, source: "trained" }]
    })
  );
  const player = findPlayerCombatant(encounter);
  const enemy = findEnemyCombatant(encounter);

  const action = queueActionFixture(
    encounter,
    player,
    "combat.melee.primary",
    [enemy.id],
    "weapon_profile",
    "item.arming_sword"
  );
  const preview = resolveCombatDamagePreview(action, player, enemy);

  assert.equal(action.source.itemId, "item.arming_sword");
  assert.equal(action.source.weaponSkillId, "skill.combat.weapon.sword");
  assert.ok(preview.skillBonus > 0, "sword damage grants should apply to combat.melee.primary via aliases");
});

test("armor profiles and defensive skills contribute deterministic damage reduction", () => {
  const unarmoredPlayerState = createPlayerStateFixture({
    equipmentOverrides: {
      "slot.weapon.left": null,
      "slot.armor.chest": null
    },
    extraSkills: [{ id: "skill.combat.defense.evasion", rank: 80, source: "trained" }]
  });
  const armoredPlayerState = createPlayerStateFixture({
    equipmentOverrides: {
      "slot.weapon.left": null,
      "slot.armor.chest": {
        itemId: "item.plate_cuirass",
        itemKey: "plate_cuirass",
        quantity: 1,
        durability: 0.9
      }
    },
    extraSkills: [
      { id: "skill.combat.defense.evasion", rank: 80, source: "trained" },
      { id: "skill.combat.armor.plate_armor", rank: 80, source: "trained" }
    ]
  });
  const { encounter: unarmoredEncounter } = createEncounterFixture(unarmoredPlayerState);
  const { encounter: armoredEncounter } = createEncounterFixture(armoredPlayerState);
  const unarmoredPlayer = findPlayerCombatant(unarmoredEncounter);
  const armoredPlayer = findPlayerCombatant(armoredEncounter);
  const unarmoredEnemy = findEnemyCombatant(unarmoredEncounter);
  const armoredEnemy = findEnemyCombatant(armoredEncounter);

  const unarmoredAction = queueActionFixture(unarmoredEncounter, unarmoredEnemy, "combat.attack.melee.basic", [unarmoredPlayer.id]);
  const armoredAction = queueActionFixture(armoredEncounter, armoredEnemy, "combat.attack.melee.basic", [armoredPlayer.id]);
  const unarmoredPreview = resolveCombatDamagePreview(unarmoredAction, unarmoredEnemy, unarmoredPlayer);
  const armoredPreview = resolveCombatDamagePreview(armoredAction, armoredEnemy, armoredPlayer);

  assert.equal(unarmoredPreview.equipmentReduction, 0);
  assert.ok(unarmoredPreview.defensiveSkillReduction > 0, "evasion skill should contribute a small passive reduction");
  assert.ok(armoredPreview.equipmentReduction > unarmoredPreview.equipmentReduction);
  assert.ok(armoredPreview.amount < unarmoredPreview.amount);
});

test("active shield block applies a defensive status that reduces incoming preview damage", () => {
  const { tick, candidate } = resolveFirstSpawnCandidate(createWorldStateFixture());
  const gameState = createDefaultGameState("normal");
  const playerState = createPlayerStateFixture();
  const sessionState = createEmptySessionState();

  tickCombatFoundation(gameState, playerState, [candidate], tick, sessionState);
  const encounter = gameState.activeEncounter;
  assert.ok(encounter, "expected active encounter after the first combat tick");

  const playerCombatantId = encounter.alliedCombatantIds[0];
  assert.ok(playerCombatantId);
  sessionState.combatUi.stagedCommand = {
    actorCombatantId: playerCombatantId,
    actionType: "combat.defense.block",
    targetIds: [playerCombatantId],
    sourceType: "item",
    sourceId: "item.buckler_shield",
    queueMode: "replace"
  };

  tickCombatFoundation(gameState, playerState, [], tick + 1, sessionState);
  tickCombatFoundation(gameState, playerState, [], tick + 2, sessionState);

  const updatedEncounter = gameState.activeEncounter;
  assert.ok(updatedEncounter, "encounter should still be active after shield block resolves");
  const player = findPlayerCombatant(updatedEncounter);
  const enemy = findEnemyCombatant(updatedEncounter);
  const shieldStatus = player.statusEffects.find((status) => status.tags.includes("block"));
  assert.ok(shieldStatus, "expected active shield block status");

  const incomingAction = queueActionFixture(updatedEncounter, enemy, "combat.attack.melee.basic", [player.id]);
  const blockedPreview = resolveCombatDamagePreview(incomingAction, enemy, player);
  const unblockedPlayer = structuredClone(player);
  unblockedPlayer.statusEffects = unblockedPlayer.statusEffects.filter((status) => !status.tags.includes("block"));
  const unblockedPreview = resolveCombatDamagePreview(incomingAction, enemy, unblockedPlayer);

  assert.ok(blockedPreview.statusReduction > unblockedPreview.statusReduction);
  assert.ok(blockedPreview.amount <= unblockedPreview.amount);
});

test("monster base evasion is represented in combatant attributes", () => {
  const { encounter } = createEncounterFixture(
    createPlayerStateFixture(),
    {
      id: "test.spawn.slime_bloom",
      spawnProfileId: "spawn.valtherion.damp_lowlands",
      encounterTemplateId: "encounter.valtherion.lowland_slime_bloom",
      regionId: "region.valtherion",
      habitatTags: ["ditch", "cellar"],
      hazardPressure: 30
    }
  );
  const slime = findEnemyCombatant(encounter, "monster.green_slime");
  const monster = loadSpawnFoundationContent().monsterById.get("monster.green_slime");
  assert.ok(monster);

  assert.equal(slime.attributes.WIS, monster.combatProfile.baseEvasion);
  assert.equal(
    slime.attributes.AGI,
    Math.round((monster.combatProfile.baseAttackSpeed * 2 + monster.combatProfile.baseEvasion) / 3)
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
