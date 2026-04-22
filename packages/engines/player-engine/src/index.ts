import {
  resolvePlayerResources,
  type PlayerDelta,
  type PlayerTickContext,
  type RunDifficultyState,
  type TickResult
} from "../../../shared/types/src/index.js";
import { syncPlayerBodyState } from "./body-state.js";
import { createRunDifficultyState } from "./difficulty.js";
import { syncPlayerReputation } from "./reputation.js";
import { syncPlayerEchoProgression } from "./progression.js";
import { syncPlayerStatGrowth } from "./stat-growth.js";

export {
  applyReputationAward,
  canApplyReputationAward,
  grantContinentGeographicKnowledge,
  grantRegionGeographicKnowledge,
  grantSettlementGeographicKnowledge,
  loadReputationBalanceRule,
  normalizePlayerGeographicKnowledge,
  resolveHistoricalReputationTier,
  resolveScopedReputation,
  syncPlayerReputation,
  upsertGeographicKnowledgeEntry
} from "./reputation.js";
export {
  SKILL_PROGRESSION_BANDS,
  SPELL_SCALING_CHANNELS_BY_SCHOOL,
  accumulateBreakthroughProgress,
  canAttemptTrial,
  calculatePlayerEcho,
  createDefaultPlayerEchoState,
  createPlayerLegacyGrowthState,
  createPlayerProgressionState,
  applyBreakthroughGating,
  evaluateTrialOutcome,
  loadEchoBalanceRule,
  meetsEchoRequirement,
  meetsGlobalRuleEchoRequirement,
  normalizePlayerProgression,
  resolvePlayerEchoProgression,
  resolveGlobalRuleEchoRequirement,
  resolveKnowledgeProgressionDifficultyThresholds,
  resolveKnowledgeAssistance,
  resolveItemUseProfile,
  resolveEligibleTitleMilestones,
  resolveSkillProgressionDifficultyThresholds,
  resolveSkillBand,
  syncPlayerEchoProgression,
  validateSpellScalingChannelsForSchool
} from "./progression.js";
export {
  advancePlayerBodyState,
  applyConsumableToBodyState,
  createDefaultPlayerBodyState,
  createDefaultResolvedBodyState,
  loadBodyStateBalanceRule,
  normalizePlayerBodyState,
  resolveBodyState,
  rollBodyStateDay,
  syncPlayerBodyState
} from "./body-state.js";
export {
  createRunDifficultyState,
  loadRunDifficultyBalanceRule,
  normalizeRunDifficultyState,
  resolvePrestigeRewardMultiplier,
  resolveRecoveryGate,
  resolveRunDifficultyModifiers
} from "./difficulty.js";
export {
  applyActionAttributeLoad,
  applyAttributeTensionToActionProfile,
  convertPlayerStatGrowthOnRecovery,
  createDefaultPlayerStatGrowthState,
  createDefaultResolvedAttributeTensionState,
  loadStatGrowthBalanceRule,
  normalizePlayerStatGrowth,
  resolveAttributeTension,
  syncPlayerStatGrowth
} from "./stat-growth.js";

export function syncPlayerRuntimeState(
  playerState: PlayerTickContext["state"],
  tick: number,
  day: number,
  incomingEvents: PlayerTickContext["incomingEvents"] = [],
  runDifficulty?: Partial<RunDifficultyState> | null
) {
  syncPlayerStatGrowth(playerState, day);
  syncPlayerEchoProgression(playerState);
  syncPlayerBodyState(playerState, tick, day, runDifficulty);
  syncPlayerReputation(playerState, day);
  const resourceResolution = resolvePlayerResources(playerState, incomingEvents, tick);
  playerState.resources = resourceResolution.resources;
  playerState.resourceRuntime = resourceResolution.resourceRuntime;
  return resourceResolution;
}

export function tickPlayer(context: PlayerTickContext): TickResult<PlayerDelta> {
  const runDifficulty = createRunDifficultyState(context.runDifficulty);
  const resourceResolution = syncPlayerRuntimeState(
    context.state,
    context.clock.tick,
    context.clock.day,
    context.incomingEvents,
    runDifficulty
  );

  const inventoryStacks = context.state.inventory.bags.flatMap((bag) => bag.stacks);
  const equippedItems = Object.values(context.state.equipment).filter((item) => item !== null);

  const resourceDelta: PlayerDelta = {
    kind: "resources",
    playerId: context.state.playerId,
    payload: {
      saveSlotId: context.saveSlotId,
      tick: context.clock.tick,
      level: context.state.progression.level,
      echoAdjusted: context.state.progression.echo.echoAdjusted,
      skillContribution: context.state.progression.echo.skillContribution,
      statContribution: context.state.progression.echo.statContribution,
      knowledgeContribution: context.state.progression.echo.knowledgeContribution,
      bodyState: context.state.bodyState,
      resourceGrowthLevel: context.state.progression.legacyGrowth.resourceGrowthLevel,
      classLevel: context.state.progression.legacyGrowth.classLevel,
      xp: context.state.resources.xp.current,
      hp: context.state.resources.hp.current,
      hpMax: context.state.resources.hp.max,
      mp: context.state.resources.mp.current,
      mpMax: context.state.resources.mp.max,
      stamina: context.state.resources.stamina.current,
      staminaMax: context.state.resources.stamina.max,
      activeResourceModifiers: resourceResolution.activeModifiers.length,
      lastBreakdown: resourceResolution.breakdown,
      recentHistory: context.state.resourceRuntime.history.slice(-9),
      skillsKnown: context.state.skills.length,
      spellsKnown: context.state.spells.length,
      abilitiesKnown: context.state.abilities.length,
      activeTraits: context.state.traits.length
    }
  };

  const locationDelta: PlayerDelta = {
    kind: "location",
    playerId: context.state.playerId,
    payload: {
      regionId: context.state.regionId,
      settlementId: context.state.location.settlementId,
      siteLabel: context.state.location.siteLabel,
      worldMapId: context.state.location.worldMapId
    }
  };

  const originDelta: PlayerDelta = {
    kind: "origin",
    playerId: context.state.playerId,
    payload: {
      lineageId: context.state.originProfile.lineageId,
      classId: context.state.originProfile.classId,
      sexId: context.state.originProfile.sexId,
      resolvedResourceMaxima: context.state.originProfile.resolvedResourceMaxima,
      attributeAdjustments: context.state.originProfile.attributeAdjustments
    }
  };

  const currencyDelta: PlayerDelta = {
    kind: "currency",
    playerId: context.state.playerId,
    payload: {
      gold: context.state.currency.gold,
      silver: context.state.currency.silver,
      copper: context.state.currency.copper
    }
  };

  const inventoryDelta: PlayerDelta = {
    kind: "inventory",
    playerId: context.state.playerId,
    payload: {
      bagCount: context.state.inventory.bags.length,
      stackCount: inventoryStacks.length,
      overflowCount: context.state.inventory.overflow.length,
      totalItemQuantity:
        inventoryStacks.reduce((sum, stack) => sum + stack.quantity, 0) +
        context.state.inventory.overflow.reduce((sum, stack) => sum + stack.quantity, 0)
    }
  };

  const equipmentDelta: PlayerDelta = {
    kind: "equipment",
    playerId: context.state.playerId,
    payload: {
      equippedCount: equippedItems.length,
      occupiedSlots: equippedItems.length,
      durabilityAlerts: equippedItems.filter((item) => item?.durability !== undefined && item.durability < 0.35).length,
      resourceModifierCount: equippedItems.reduce(
        (count, item) => count + (item?.resourceModifiers?.length ?? 0),
        0
      )
    }
  };

  const discoveryDelta: PlayerDelta = {
    kind: "discovery",
    playerId: context.state.playerId,
    payload: {
      entryCount: context.state.discoveryChronicle.entries.length,
      lastUpdatedTick: context.state.discoveryChronicle.lastUpdatedTick,
      categories: context.state.discoveryChronicle.entries.reduce<Record<string, number>>((counts, entry) => {
        counts[entry.category] = (counts[entry.category] ?? 0) + 1;
        return counts;
      }, {}),
      recentResourceChanges: context.state.resourceRuntime.history.slice(-6)
    }
  };

  const standingDelta: PlayerDelta = {
    kind: "standing",
    playerId: context.state.playerId,
    payload: {
      entries: context.state.standing.map((entry) => ({
        id: entry.id,
        standingLabel: entry.standingLabel,
        score: entry.score
      })),
      titleCount: context.state.titles.length
    }
  };

  const reputationDelta: PlayerDelta = {
    kind: "reputation",
    playerId: context.state.playerId,
    payload: context.state.reputation
  };

  return {
    domain: "player",
    appliedTick: context.clock.tick,
    deltas: [
      resourceDelta,
      {
        kind: "body_state",
        playerId: context.state.playerId,
        payload: {
          tick: context.clock.tick,
          day: context.clock.day,
          bodyState: context.state.bodyState
        }
      },
      originDelta,
      locationDelta,
      currencyDelta,
      inventoryDelta,
      equipmentDelta,
      discoveryDelta,
      standingDelta,
      reputationDelta
    ],
    emittedEvents: [],
    warnings: [
      ...(context.state.resources.hp.current <= 0 ? ["Player HP is depleted."] : []),
      ...(context.state.resources.mp.current <= 0 ? ["Player MP is depleted."] : []),
      ...(context.state.resources.stamina.current <= 0 ? ["Player stamina is depleted."] : [])
    ]
  };
}
