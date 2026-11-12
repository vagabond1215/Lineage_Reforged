import type { SimulationClock } from "../../../shared/types/src/index.js";
import { aggregateEconomyHierarchy, buildEconomyStateFromContent } from "./economy.js";
import { buildSettlementMarketStates } from "./runtime-economy.js";
import { buildSettlementSimulationProfiles } from "./settlement-simulation.js";
import { loadSettlementContent, type SettlementContentRecord } from "./content.js";

/**
 * Read-only bootstrap for the first authored Starfall Chronicle World.
 * Settlement content, derived rates, stock/price projections and future World
 * storage retain their existing owners. This module never publishes a market,
 * creates a World instance, advances a clock, or fabricates player shop stock.
 */
export const STARFALL_STARTING_SETTLEMENT_IDS = [
  "settlement.starfall_port",
  "settlement.harbormast_quay",
  "settlement.foammarket_ferry"
] as const;

export const STARFALL_EXTERNAL_TRADE_CONTEXT_IDS = [
  "settlement.pearlwake",
  "settlement.chainlight_bastion"
] as const;

/** These are focus categories, NOT item keys or invented commodity IDs. */
export const STARFALL_ECONOMY_FOCUS = [
  { category: "fish", exactKeys: ["fish", "salted_fish"] },
  { category: "grain", exactKeys: ["grain"] },
  { category: "rope", exactKeys: ["rope", "ship_rigging"] },
  { category: "timber", exactKeys: ["timber", "bulk_timber"] },
  { category: "metal", exactKeys: ["metal", "iron_tools"] }
] as const;

export interface StarfallAuthoredGoodsPosture {
  settlementId: string;
  category: (typeof STARFALL_ECONOMY_FOCUS)[number]["category"];
  /** The exact raw authored goods, not inferred item identities. */
  supplyKeys: string[];
  demandKeys: string[];
  source: "canonical_settlement_profiles";
}

/**
 * The projection is intentionally separated from committed World-state
 * snapshots. Pass an owner-accepted clock; do not create, tick or accelerate
 * the World here. Runtime rates/market values are engine estimates, NOT
 * settled merchant inventory or player-tradable offers.
 */
export function buildStarfallBaseEconomyPreview(clock: SimulationClock) {
  const settlementIds = [
    ...STARFALL_STARTING_SETTLEMENT_IDS,
    ...STARFALL_EXTERNAL_TRADE_CONTEXT_IDS
  ];
  const settlements = loadSettlementContent();
  const byId = new Map(settlements.map((settlement) => [settlement.id, settlement]));
  const selected = settlementIds.map((id) => {
    const record = byId.get(id);
    if (!record) throw new Error(`Starfall economy source settlement is missing: ${id}`);
    if (record.macroRegionId !== "region.myridian_chain") {
      throw new Error(`Starfall economy source outside Myridian Chain: ${id}`);
    }
    return record;
  });

  const authoredPosture: StarfallAuthoredGoodsPosture[] = selected.flatMap(
    (settlement: SettlementContentRecord) => STARFALL_ECONOMY_FOCUS.map((focus) => {
      const supply = new Set([
        ...settlement.economicModel.localSupplyStrengths,
        ...settlement.domesticResourceProfile.primaryGoods,
        ...settlement.domesticResourceProfile.secondaryGoods,
        ...settlement.tradeDependencyProfile.exportFocus
      ]);
      const demand = new Set([
        ...settlement.economicModel.demandPressures,
        ...settlement.domesticResourceProfile.demandedGoods,
        ...settlement.tradeDependencyProfile.stapleImports
      ]);
      return {
        settlementId: settlement.id,
        category: focus.category,
        supplyKeys: focus.exactKeys.filter((key) => supply.has(key)),
        demandKeys: focus.exactKeys.filter((key) => demand.has(key)),
        source: "canonical_settlement_profiles" as const
      };
    })
  );

  // Reuse the actual Civilization simulation and market-owner algorithms.
  // Output is an uncommitted projection to be bound to a real World/head later.
  const { economy, warnings: baselineWarnings } =
    buildEconomyStateFromContent(settlementIds, clock);
  const { snapshots, warnings: aggregateWarnings } = aggregateEconomyHierarchy(economy);
  const marketStates = buildSettlementMarketStates({ settlementIds, snapshots, clock });
  const simulationStates = buildSettlementSimulationProfiles({ settlementIds, marketStates });

  return {
    kind: "starfall_base_economy_read_only_preview_v1" as const,
    committed: false as const,
    sourceWorldTemplateId: "world_template.first_world.starfall_port.chronicle_v1" as const,
    localSettlementIds: [...STARFALL_STARTING_SETTLEMENT_IDS],
    externalContextSettlementIds: [...STARFALL_EXTERNAL_TRADE_CONTEXT_IDS],
    economyTick: clock.tick,
    authoredPosture,
    projection: { economy, snapshots, marketStates, simulationStates },
    warnings: [...baselineWarnings, ...aggregateWarnings],
    limitations: [
      "No authoritative World or persisted market owner has been created.",
      "Estimated market stocks/prices are simulations, not available player goods or shop offers.",
      "Foammarket-to-Pearlwake is an authored trade relationship, not a confirmed ferry passenger route.",
      "Settlement economic commodity labels are not canonical inventory item keys."
    ]
  };
}
