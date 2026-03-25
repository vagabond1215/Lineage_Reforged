import type {
  CivilizationDelta,
  CivilizationTickContext,
  TickResult
} from "../../../shared/types/src/index.js";
import { createEvent, EVENT_TYPES } from "../../../shared/events/src/index.js";
import { aggregateEconomyHierarchy, buildEconomyStateFromContent, summarizeEconomyLevels } from "./economy.js";
import { generateQuestOffers } from "./quest-generation.js";
import {
  buildSettlementMarketStates,
  resolveCraftAtSettlement,
  resolveItemValueAtSettlement,
  resolveLocalMarketPrice
} from "./runtime-economy.js";

export {
  buildSettlementMarketStates,
  resolveCraftAtSettlement,
  resolveItemValueAtSettlement,
  resolveLocalMarketPrice
} from "./runtime-economy.js";

export function tickCivilization(context: CivilizationTickContext): TickResult<CivilizationDelta> {
  const { economy: rebuiltEconomy, warnings: bootstrapWarnings } = buildEconomyStateFromContent(context.state.settlements, context.clock);
  context.state.economy.nodes = rebuiltEconomy.nodes;
  context.state.economy.lastComputedTick = context.clock.tick;

  const { snapshots, warnings: economyWarnings } = aggregateEconomyHierarchy(context.state.economy);
  const levelTotals = summarizeEconomyLevels(snapshots);
  const marketStates = buildSettlementMarketStates({
    settlementIds: context.state.settlements,
    snapshots,
    clock: context.clock
  });
  const { nextState: nextQuestState, warnings: questWarnings } = generateQuestOffers(
    context.state.settlements,
    snapshots,
    context.state.quests,
    context.clock.tick
  );

  context.state.economy.lastSnapshots = snapshots;
  context.state.economy.lastLevelTotals = levelTotals;
  context.state.economy.marketStates = marketStates;
  context.state.quests = nextQuestState;

  const settlementSnapshots = snapshots.filter((snapshot) => snapshot.level === "settlement");
  const topShortfalls = settlementSnapshots
    .flatMap((snapshot) =>
      snapshot.balances
        .filter((balance) => balance.shortfallPerTick > 0)
        .map((balance) => ({
          settlementId: snapshot.settlementId ?? snapshot.nodeId,
          itemKey: balance.itemKey,
          shortfallPerTick: balance.shortfallPerTick
        }))
    )
    .sort((left, right) => right.shortfallPerTick - left.shortfallPerTick)
    .slice(0, 5);
  const topTradeSurpluses = settlementSnapshots
    .flatMap((snapshot) =>
      snapshot.balances
        .filter((balance) => balance.tradeSurplusPerTick > 0)
        .map((balance) => ({
          settlementId: snapshot.settlementId ?? snapshot.nodeId,
          itemKey: balance.itemKey,
          tradeSurplusPerTick: balance.tradeSurplusPerTick
        }))
    )
    .sort((left, right) => right.tradeSurplusPerTick - left.tradeSurplusPerTick)
    .slice(0, 5);

  const economyDelta: CivilizationDelta = {
    kind: "economy",
    payload: {
      economyProfileId: context.economyProfileId,
      tick: context.clock.tick,
      snapshotCount: snapshots.length,
      marketStateCount: marketStates.length,
      levelCounts: levelTotals.reduce<Record<string, number>>((counts, summary) => {
        counts[summary.level] = summary.nodeCount;
        return counts;
      }, {}),
      levelTotals,
      totalSupplyPerTick: Number(snapshots.reduce((sum, snapshot) => sum + snapshot.totalSupplyPerTick, 0).toFixed(4)),
      totalDemandPerTick: Number(snapshots.reduce((sum, snapshot) => sum + snapshot.totalDemandPerTick, 0).toFixed(4)),
      totalSurplusPerTick: Number(snapshots.reduce((sum, snapshot) => sum + snapshot.totalSurplusPerTick, 0).toFixed(4)),
      totalShortfallPerTick: Number(snapshots.reduce((sum, snapshot) => sum + snapshot.totalShortfallPerTick, 0).toFixed(4)),
      totalReservePerTick: Number(snapshots.reduce((sum, snapshot) => sum + snapshot.totalReservePerTick, 0).toFixed(4)),
      totalTradeCapacityPerTick: Number(snapshots.reduce((sum, snapshot) => sum + snapshot.totalTradeCapacityPerTick, 0).toFixed(4)),
      totalTradeSurplusPerTick: Number(snapshots.reduce((sum, snapshot) => sum + snapshot.totalTradeSurplusPerTick, 0).toFixed(4)),
      topShortfalls,
      topTradeSurpluses
    }
  };

  const marketDelta: CivilizationDelta = {
    kind: "market",
    payload: {
      tick: context.clock.tick,
      marketStateCount: marketStates.length,
      pricedItemCount: marketStates.reduce((sum, state) => sum + state.priceView.length, 0),
      settlementIds: marketStates.map((state) => state.settlementId)
    }
  };

  const questDelta: CivilizationDelta = {
    kind: "quests",
    payload: {
      tick: context.clock.tick,
      activeOfferCount: nextQuestState.activeOffers.length,
      settlementCount: context.state.settlements.length,
      categories: nextQuestState.activeOffers.reduce<Record<string, number>>((counts, offer) => {
        counts[offer.category] = (counts[offer.category] ?? 0) + 1;
        return counts;
      }, {})
    }
  };

  return {
    domain: "civilization",
    appliedTick: context.clock.tick,
    deltas: [economyDelta, marketDelta, questDelta],
    emittedEvents: [
      createEvent(EVENT_TYPES.ECONOMY_LEDGER_UPDATED, "civilization", context.clock.tick, {
        snapshotCount: snapshots.length,
        totalShortfallPerTick: economyDelta.payload.totalShortfallPerTick,
        totalTradeSurplusPerTick: economyDelta.payload.totalTradeSurplusPerTick
      }),
      createEvent(EVENT_TYPES.MARKET_PRICE_UPDATED, "civilization", context.clock.tick, {
        marketStateCount: marketStates.length,
        pricedItemCount: marketDelta.payload.pricedItemCount
      }),
      createEvent(EVENT_TYPES.QUEST_BOARD_REFRESHED, "civilization", context.clock.tick, {
        activeOfferCount: nextQuestState.activeOffers.length
      })
    ],
    warnings: [...bootstrapWarnings, ...economyWarnings, ...questWarnings]
  };
}
