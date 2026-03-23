import {
  resolvePlayerResources,
  type PlayerDelta,
  type PlayerTickContext,
  type TickResult
} from "../../../shared/types/src/index.js";

export function tickPlayer(context: PlayerTickContext): TickResult<PlayerDelta> {
  const resourceResolution = resolvePlayerResources(context.state, context.incomingEvents, context.clock.tick);
  context.state.resources = resourceResolution.resources;
  context.state.resourceRuntime = resourceResolution.resourceRuntime;

  const inventoryStacks = context.state.inventory.bags.flatMap((bag) => bag.stacks);
  const equippedItems = Object.values(context.state.equipment).filter((item) => item !== null);

  const resourceDelta: PlayerDelta = {
    kind: "resources",
    playerId: context.state.playerId,
    payload: {
      saveSlotId: context.saveSlotId,
      tick: context.clock.tick,
      level: context.state.progression.level,
      classLevel: context.state.progression.classLevel,
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
      worldMapId: context.state.location.worldMapId,
      knownSettlementIds: context.state.location.knownSettlementIds
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

  const reputationDelta: PlayerDelta = {
    kind: "reputation",
    playerId: context.state.playerId,
    payload: {
      entries: context.state.reputation.map((entry) => ({
        id: entry.id,
        standingLabel: entry.standingLabel,
        score: entry.score
      })),
      titleCount: context.state.titles.length
    }
  };

  return {
    domain: "player",
    appliedTick: context.clock.tick,
    deltas: [
      resourceDelta,
      originDelta,
      locationDelta,
      currencyDelta,
      inventoryDelta,
      equipmentDelta,
      discoveryDelta,
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
