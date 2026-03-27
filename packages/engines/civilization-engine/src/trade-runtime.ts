import type {
  CivilizationTransportState,
  SettlementBusinessState,
  SettlementMarketItemPressureState,
  SettlementMarketPriceState,
  SettlementMarketState,
  SettlementSimulationState,
  TradeOpportunityState,
  TransportAssetReservationState,
  TransportUnitState
} from "../../../shared/types/src/index.js";
import {
  loadSettlementContent,
  loadTransportProfileContent,
  type SettlementContentRecord,
  type TransportVehicleProfileRecord
} from "./content.js";
import { resolveResourceFamilies } from "./resource-taxonomy.js";
import { buildSettlementSimulationProfiles } from "./settlement-simulation.js";
import { resolveBestRoute } from "./spatial-world.js";
import {
  dispatchCaravan,
  resolveCargoLoadUnits,
  resolveTransportPerformance
} from "./transport-runtime.js";

interface OpportunityEvaluationContext {
  settlementsById: Map<string, SettlementContentRecord>;
  vehicleById: Map<string, TransportVehicleProfileRecord>;
  marketBySettlementId: Map<string, SettlementMarketState>;
  profileBySettlementId: Map<string, SettlementSimulationState>;
  activeIncomingByDestinationItem: Map<string, number>;
  routeUsageByRouteId: Map<string, number>;
  activeVehicleUsageBySettlementVehicle: Map<string, number>;
}

export interface AutonomousTradeDispatchResult {
  transportState: CivilizationTransportState;
  marketStates: SettlementMarketState[];
  settlementProfiles: SettlementSimulationState[];
  opportunities: TradeOpportunityState[];
  dispatched: TradeOpportunityState[];
}

const SCALE_INPUT_BUFFER: Record<SettlementBusinessState["scaleBand"], number> = {
  micro: 6,
  small: 12,
  moderate: 24,
  large: 40
};

const ROUTE_CAPACITY_BY_EDGE_TYPE: Record<string, number> = {
  road: 8,
  trail: 3,
  pass: 1.5,
  river: 10,
  ferry: 2.5,
  sea_lane: 14
};

const ESSENTIAL_FAMILIES = new Set([
  "grain",
  "vegetables",
  "fruit",
  "fish",
  "meat",
  "wood",
  "tools",
  "textiles",
  "herbs"
]);

const ESSENTIAL_ITEM_KEYS = new Set([
  "grain",
  "flour",
  "bread_loaf",
  "firewood",
  "charcoal",
  "cloth",
  "coarse_cloth",
  "tools",
  "iron_tools",
  "salt",
  "cured_meat",
  "salted_fish"
]);

function roundNumber(value: number): number {
  return Number(value.toFixed(4));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getVehicleById(): Map<string, TransportVehicleProfileRecord> {
  const catalog = loadTransportProfileContent()[0];
  return new Map((catalog?.vehicleProfiles ?? []).map((record) => [record.id, record]));
}

function getSettlementsById(): Map<string, SettlementContentRecord> {
  return new Map(loadSettlementContent().map((record) => [record.id, record]));
}

function getStockEntry(state: SettlementMarketState | undefined, itemKey: string): SettlementMarketItemPressureState | undefined {
  return state?.stock.find((entry) => entry.itemKey === itemKey);
}

function getPriceEntry(state: SettlementMarketState | undefined, itemKey: string): SettlementMarketPriceState | undefined {
  return state?.priceView.find((entry) => entry.itemKey === itemKey);
}

function getVehicleUsageKey(settlementId: string, vehicleId: string): string {
  return `${settlementId}|${vehicleId}`;
}

function getDestinationItemKey(settlementId: string, itemKey: string): string {
  return `${settlementId}|${itemKey}`;
}

function buildOpportunityId(originSettlementId: string, destinationSettlementId: string, itemKey: string, vehicleId: string): string {
  return `trade.${originSettlementId.replace(/^settlement\./, "")}.${destinationSettlementId.replace(/^settlement\./, "")}.${itemKey}.${vehicleId.replace(/^vehicle\./, "")}`;
}

function getBusinessInputBuffer(itemKey: string, businesses: SettlementBusinessState[]): number {
  return roundNumber(
    businesses
      .filter((business) => business.inputGoods.includes(itemKey))
      .reduce(
        (sum, business) =>
          sum +
          SCALE_INPUT_BUFFER[business.scaleBand] +
          Math.max(2, business.workforceCount * 0.06),
        0
      )
  );
}

function isEssentialGood(itemKey: string): boolean {
  if (ESSENTIAL_ITEM_KEYS.has(itemKey)) {
    return true;
  }
  return resolveResourceFamilies(itemKey).some((family) => ESSENTIAL_FAMILIES.has(family));
}

function getProtectedReserve(itemKey: string, stockEntry: SettlementMarketItemPressureState | undefined, businesses: SettlementBusinessState[]): number {
  const reservePerTick = stockEntry?.reservePerTick ?? 0;
  const unmetDemandPerTick = stockEntry?.unmetDemandPerTick ?? 0;
  const localConsumptionReserve = reservePerTick * 10;
  const productionInputReserve = getBusinessInputBuffer(itemKey, businesses);
  const emergencyBuffer = isEssentialGood(itemKey)
    ? Math.max(reservePerTick * 6, unmetDemandPerTick * 5)
    : Math.max(reservePerTick * 2, unmetDemandPerTick * 2);
  return roundNumber(localConsumptionReserve + productionInputReserve + emergencyBuffer);
}

function getExportableSurplus(itemKey: string, stockEntry: SettlementMarketItemPressureState | undefined, businesses: SettlementBusinessState[]): number {
  if (!stockEntry) {
    return 0;
  }
  return roundNumber(Math.max(0, stockEntry.stockLevel - getProtectedReserve(itemKey, stockEntry, businesses)));
}

function destinationExplicitlyDemandsItem(settlement: SettlementContentRecord, itemKey: string): boolean {
  if (settlement.economicModel.demandPressures.includes(itemKey)) {
    return true;
  }
  const itemFamilies = new Set(resolveResourceFamilies(itemKey));
  return settlement.economicModel.demandPressures.some((demandedKey) =>
    resolveResourceFamilies(demandedKey).some((family) => itemFamilies.has(family))
  );
}

function destinationNeedsItem(settlement: SettlementContentRecord, marketState: SettlementMarketState | undefined, itemKey: string): boolean {
  const stockEntry = getStockEntry(marketState, itemKey);
  return Boolean(
    destinationExplicitlyDemandsItem(settlement, itemKey) ||
      (stockEntry && (stockEntry.unmetDemandPerTick > 0.1 || stockEntry.demandPressure > 0.15))
  );
}

function getDestinationAbsorption(
  destinationSettlementId: string,
  itemKey: string,
  marketState: SettlementMarketState | undefined,
  incomingByDestinationItem: Map<string, number>
): number {
  const stockEntry = getStockEntry(marketState, itemKey);
  const incoming = incomingByDestinationItem.get(getDestinationItemKey(destinationSettlementId, itemKey)) ?? 0;
  const baseAbsorption =
    (stockEntry?.unmetDemandPerTick ?? 0) * 12 +
    Math.max(stockEntry?.demandPressure ?? 0, 0) * Math.max(stockEntry?.reservePerTick ?? 0, 1) * 8 +
    Math.max(stockEntry?.reservePerTick ?? 0, 0) * 4;
  return roundNumber(Math.max(0, baseAbsorption - incoming));
}

function isStrategicNecessity(destinationSettlement: SettlementContentRecord, marketState: SettlementMarketState | undefined, itemKey: string): boolean {
  const stockEntry = getStockEntry(marketState, itemKey);
  return Boolean(
    isEssentialGood(itemKey) &&
      ((stockEntry?.unmetDemandPerTick ?? 0) > 0.5 ||
        (stockEntry?.demandPressure ?? 0) >= 0.55 ||
        destinationSettlement.tradeDependencyProfile.dependencyBand === "high")
  );
}

function buildTransportUnit(
  vehicle: TransportVehicleProfileRecord,
  transportAvailability: SettlementSimulationState["infrastructure"]["transportAvailability"][number]
): TransportUnitState {
  return {
    transportType: vehicle.transportType,
    modeId: vehicle.routeModeId,
    vehicleId: vehicle.id,
    harnessId: transportAvailability.harnessId,
    animals:
      transportAvailability.animalId && transportAvailability.animalCount > 0
        ? [{ animalId: transportAvailability.animalId, count: transportAvailability.animalCount }]
        : [],
    crewSize: transportAvailability.crewSize
  };
}

function getRemainingTransportUnits(
  settlementId: string,
  transportOption: SettlementSimulationState["infrastructure"]["transportAvailability"][number],
  activeVehicleUsageBySettlementVehicle: Map<string, number>,
  reservations: TransportAssetReservationState[]
): number {
  const usageKey = getVehicleUsageKey(settlementId, transportOption.vehicleId);
  const activeUnits = activeVehicleUsageBySettlementVehicle.get(usageKey) ?? 0;
  const reservedUnits = reservations
    .filter((reservation) => reservation.settlementId === settlementId && reservation.vehicleId === transportOption.vehicleId)
    .reduce((sum, reservation) => sum + reservation.unitCount, 0);
  return Math.max(0, transportOption.availableUnits - Math.max(activeUnits, reservedUnits));
}

function getUnitLoad(itemKey: string): number {
  return Math.max(0.05, resolveCargoLoadUnits(itemKey, 1));
}

function getCapacityLimitedQuantity(itemKey: string, loadUnits: number): number {
  return Math.max(0, Math.floor(loadUnits / getUnitLoad(itemKey)));
}

function estimateRouteTravelDays(input: {
  routePlan: ReturnType<typeof resolveBestRoute>;
  transportUnit: TransportUnitState;
  itemKey: string;
  quantity: number;
}): number {
  const cargoManifest = [
    {
      itemKey: input.itemKey,
      quantity: input.quantity,
      loadUnits: resolveCargoLoadUnits(input.itemKey, input.quantity)
    }
  ];
  let fatigueLoad = 0;
  let totalDays = 0;

  for (const segment of input.routePlan.segments) {
    const performance = resolveTransportPerformance({
      transportUnit: input.transportUnit,
      cargoManifest,
      segment,
      fatigueLoad
    });
    const segmentDays = segment.distanceKilometers / Math.max(performance.effectiveSpeedKilometersPerDay, 0.01);
    totalDays += segmentDays;
    const dailyBudget = Math.max(performance.enduranceHours / 10, 0.2);
    const strain = clamp(
      (1 / Math.max(performance.loadFactor, 0.2)) *
        (1 / Math.max(performance.terrainFactor, 0.25)) *
        (1 + segment.riskLevel * 0.08),
      0.7,
      2.4
    );
    fatigueLoad += (segmentDays / dailyBudget) * strain;
    if (fatigueLoad >= 1) {
      totalDays += performance.restDaysPerFatigueCycle;
      fatigueLoad = Math.max(0, fatigueLoad - performance.restDaysPerFatigueCycle / 0.5);
    }
  }

  return roundNumber(totalDays);
}

function getRouteScaleCapacity(routePlan: ReturnType<typeof resolveBestRoute>): number {
  if (routePlan.segments.length === 0) {
    return 0;
  }
  return roundNumber(
    routePlan.segments.reduce((best, segment) => {
      const segmentCapacity = ROUTE_CAPACITY_BY_EDGE_TYPE[segment.edgeType] ?? 4;
      return Math.min(best, segmentCapacity);
    }, Number.POSITIVE_INFINITY)
  );
}

function getExistingRouteUsage(routeIds: string[], routeUsageByRouteId: Map<string, number>): number {
  return roundNumber(routeIds.reduce((sum, routeId) => sum + (routeUsageByRouteId.get(routeId) ?? 0), 0));
}

function recordRouteUsage(routeIds: string[], routeUsageByRouteId: Map<string, number>, routeScaleCost: number): void {
  for (const routeId of routeIds) {
    routeUsageByRouteId.set(routeId, roundNumber((routeUsageByRouteId.get(routeId) ?? 0) + routeScaleCost));
  }
}

function buildEvaluationContext(input: {
  marketStates: SettlementMarketState[];
  settlementProfiles: SettlementSimulationState[];
  transportState: CivilizationTransportState;
}): OpportunityEvaluationContext {
  const settlementsById = getSettlementsById();
  const vehicleById = getVehicleById();
  const marketBySettlementId = new Map(input.marketStates.map((state) => [state.settlementId, state]));
  const profileBySettlementId = new Map(input.settlementProfiles.map((profile) => [profile.settlementId, profile]));
  const activeIncomingByDestinationItem = new Map<string, number>();
  const routeUsageByRouteId = new Map<string, number>();
  const activeVehicleUsageBySettlementVehicle = new Map<string, number>();

  for (const caravan of input.transportState.caravans) {
    if (caravan.status !== "arrived" && caravan.transportUnit.vehicleId) {
      const usageKey = getVehicleUsageKey(caravan.originSettlementId, caravan.transportUnit.vehicleId);
      activeVehicleUsageBySettlementVehicle.set(
        usageKey,
        (activeVehicleUsageBySettlementVehicle.get(usageKey) ?? 0) + 1
      );
    }
    if (caravan.status === "arrived" || caravan.status === "blocked") {
      continue;
    }
    for (const cargo of caravan.cargoManifest) {
      const key = getDestinationItemKey(caravan.destinationSettlementId, cargo.itemKey);
      activeIncomingByDestinationItem.set(key, roundNumber((activeIncomingByDestinationItem.get(key) ?? 0) + cargo.quantity));
    }
    const vehicle = caravan.transportUnit.vehicleId ? vehicleById.get(caravan.transportUnit.vehicleId) : null;
    recordRouteUsage(caravan.routePlan.routeIds, routeUsageByRouteId, vehicle?.routeScaleCost ?? 1);
  }

  return {
    settlementsById,
    vehicleById,
    marketBySettlementId,
    profileBySettlementId,
    activeIncomingByDestinationItem,
    routeUsageByRouteId,
    activeVehicleUsageBySettlementVehicle
  };
}

function evaluateCandidateTransport(input: {
  originSettlement: SettlementContentRecord;
  destinationSettlement: SettlementContentRecord;
  originMarketState: SettlementMarketState | undefined;
  destinationMarketState: SettlementMarketState | undefined;
  originProfile: SettlementSimulationState;
  destinationProfile: SettlementSimulationState;
  transportOption: SettlementSimulationState["infrastructure"]["transportAvailability"][number];
  context: OpportunityEvaluationContext;
  transportState: CivilizationTransportState;
  itemKey: string;
  exportableSurplus: number;
  protectedReserve: number;
  destinationAbsorption: number;
  strategicNecessity: boolean;
}): TradeOpportunityState {
  const vehicle = input.context.vehicleById.get(input.transportOption.vehicleId);
  if (!vehicle) {
    return {
      opportunityId: buildOpportunityId(input.originSettlement.id, input.destinationSettlement.id, input.itemKey, input.transportOption.vehicleId),
      originSettlementId: input.originSettlement.id,
      destinationSettlementId: input.destinationSettlement.id,
      itemKey: input.itemKey,
      modeId: "unknown",
      vehicleId: input.transportOption.vehicleId,
      viable: false,
      strategicNecessity: input.strategicNecessity,
      projectedQuantity: 0,
      projectedLoadUnits: 0,
      fillRatio: 0,
      exportableSurplus: input.exportableSurplus,
      protectedReserve: input.protectedReserve,
      destinationAbsorption: input.destinationAbsorption,
      originSellPrice: 0,
      destinationBuyPrice: 0,
      unitMargin: 0,
      projectedGrossMargin: 0,
      projectedNetMargin: 0,
      routeTimeDays: 0,
      cycleDays: 0,
      routeIds: [],
      rejectionReasons: [`Missing vehicle profile ${input.transportOption.vehicleId}.`],
      explanation: ["Trade option rejected because the configured transport vehicle could not be resolved."]
    };
  }

  const rejectionReasons: string[] = [];
  const explanation: string[] = [];
  const originInfrastructure = input.originSettlement.infrastructureProfile;
  const destinationInfrastructure = input.destinationSettlement.infrastructureProfile;
  const remainingTransportUnits = getRemainingTransportUnits(
    input.originSettlement.id,
    input.transportOption,
    input.context.activeVehicleUsageBySettlementVehicle,
    input.transportState.assetReservations
  );

  if (remainingTransportUnits <= 0) {
    rejectionReasons.push("No free transport units of this configuration remain at the origin.");
  }
  if (originInfrastructure.roadTier < vehicle.minimumRoadTier) {
    rejectionReasons.push(`Origin road tier ${originInfrastructure.roadTier} is below ${vehicle.minimumRoadTier}.`);
  }
  if (originInfrastructure.waterTier < vehicle.minimumWaterTier) {
    rejectionReasons.push(`Origin water tier ${originInfrastructure.waterTier} is below ${vehicle.minimumWaterTier}.`);
  }
  if (originInfrastructure.harborTier < vehicle.minimumHarborTier) {
    rejectionReasons.push(`Origin harbor tier ${originInfrastructure.harborTier} is below ${vehicle.minimumHarborTier}.`);
  }
  if (originInfrastructure.marketTier < vehicle.minimumMarketTier) {
    rejectionReasons.push(`Origin market tier ${originInfrastructure.marketTier} is below ${vehicle.minimumMarketTier}.`);
  }
  if (destinationInfrastructure.harborTier < vehicle.minimumHarborTier && vehicle.transportType === "ship") {
    rejectionReasons.push(`Destination harbor tier ${destinationInfrastructure.harborTier} is below ${vehicle.minimumHarborTier}.`);
  }

  const modeId = vehicle.routeModeId;
  const opportunityId = buildOpportunityId(input.originSettlement.id, input.destinationSettlement.id, input.itemKey, vehicle.id);
  const capacityQuantity = getCapacityLimitedQuantity(input.itemKey, input.transportOption.cargoCapacityUnits);
  const projectedQuantity = Math.max(
    0,
    Math.min(
      capacityQuantity,
      Math.floor(input.exportableSurplus),
      Math.floor(input.destinationAbsorption),
      Math.floor(input.originProfile.infrastructure.tradeThroughputUnitsPerTick / Math.max(getUnitLoad(input.itemKey), 0.01)),
      Math.floor(input.destinationProfile.infrastructure.tradeThroughputUnitsPerTick / Math.max(getUnitLoad(input.itemKey), 0.01))
    )
  );
  const projectedLoadUnits = roundNumber(resolveCargoLoadUnits(input.itemKey, projectedQuantity));
  const fillRatio = input.transportOption.cargoCapacityUnits > 0 ? roundNumber(projectedLoadUnits / input.transportOption.cargoCapacityUnits) : 0;
  const originSellPrice = getPriceEntry(input.originMarketState, input.itemKey)?.localSellPrice ?? 0;
  const destinationBuyPrice = getPriceEntry(input.destinationMarketState, input.itemKey)?.localBuyPrice ?? 0;
  const unitMargin = roundNumber(destinationBuyPrice - originSellPrice);

  if (projectedQuantity <= 0) {
    rejectionReasons.push("No meaningful quantity fits reserve, absorption, and transport limits.");
  }
  if (!input.strategicNecessity && fillRatio < Math.max(input.transportOption.minimumFillRatio, vehicle.minimumFillRatio)) {
    rejectionReasons.push("Cargo fill ratio is below the minimum viable threshold.");
  }

  let routePlan: ReturnType<typeof resolveBestRoute> | null = null;
  let routeTimeDays = 0;
  let cycleDays = 0;
  let projectedGrossMargin = 0;
  let projectedNetMargin = 0;

  if (rejectionReasons.length === 0) {
    const transportUnit = buildTransportUnit(vehicle, input.transportOption);
    try {
      routePlan = resolveBestRoute({
        fromSettlementId: input.originSettlement.id,
        toSettlementId: input.destinationSettlement.id,
        modeId,
        strategy: input.strategicNecessity ? "lowest_risk" : "lowest_cost"
      });
      routeTimeDays = estimateRouteTravelDays({
        routePlan,
        transportUnit,
        itemKey: input.itemKey,
        quantity: projectedQuantity
      });
      cycleDays = roundNumber(vehicle.loadingDays + vehicle.unloadingDays + routeTimeDays * 2);

      const routeScaleCapacity = getRouteScaleCapacity(routePlan);
      const routeUsage = getExistingRouteUsage(routePlan.routeIds, input.context.routeUsageByRouteId);
      if (routeUsage + vehicle.routeScaleCost > routeScaleCapacity) {
        rejectionReasons.push(`Route corridor capacity ${routeScaleCapacity} is saturated by existing traffic ${routeUsage}.`);
      }

      projectedGrossMargin = roundNumber(unitMargin * projectedQuantity);
      const transportCostEstimate = roundNumber(
        (input.transportOption.crewSize * 0.45 +
          input.transportOption.animalCount * 0.28 +
          vehicle.baseWeightUnits * 0.01) *
          cycleDays +
          vehicle.routeScaleCost * 0.9 +
          routePlan.totalRisk * 0.2
      );
      projectedNetMargin = roundNumber(projectedGrossMargin - transportCostEstimate);

      if (!input.strategicNecessity && projectedNetMargin <= Math.max(6, projectedLoadUnits * 0.04)) {
        rejectionReasons.push("Projected net margin is below the viable dispatch threshold.");
      }
      if (input.originProfile.infrastructure.dispatchSlotsPerTick < 1) {
        rejectionReasons.push("Origin settlement has no dispatch slots available.");
      }
      if (input.destinationProfile.infrastructure.dispatchSlotsPerTick < 1 && input.destinationSettlement.tradeDependencyProfile.dependencyBand === "high") {
        rejectionReasons.push("Destination lacks receiving capacity for regular freight handling.");
      }

      explanation.push(
        `Route ${routePlan.routeIds.join(", ")} resolves at ${routeTimeDays} day(s) one way and ${cycleDays} day(s) per full cycle.`,
        `Projected quantity ${projectedQuantity} yields fill ratio ${fillRatio} with vehicle ${vehicle.name}.`,
        `Gross margin ${projectedGrossMargin} and net margin ${projectedNetMargin} derive from local price spread and full-cycle transport cost.`
      );
    } catch (error) {
      rejectionReasons.push(error instanceof Error ? error.message : String(error));
    }
  }

  return {
    opportunityId,
    originSettlementId: input.originSettlement.id,
    destinationSettlementId: input.destinationSettlement.id,
    itemKey: input.itemKey,
    modeId,
    vehicleId: vehicle.id,
    viable: rejectionReasons.length === 0,
    strategicNecessity: input.strategicNecessity,
    projectedQuantity,
    projectedLoadUnits,
    fillRatio,
    exportableSurplus: input.exportableSurplus,
    protectedReserve: input.protectedReserve,
    destinationAbsorption: input.destinationAbsorption,
    originSellPrice,
    destinationBuyPrice,
    unitMargin,
    projectedGrossMargin,
    projectedNetMargin,
    routeTimeDays,
    cycleDays,
    routeIds: routePlan?.routeIds ?? [],
    rejectionReasons,
    explanation: explanation.length > 0 ? explanation : ["Opportunity did not pass viability checks."]
  };
}

function compareOpportunities(left: TradeOpportunityState, right: TradeOpportunityState): number {
  return (
    Number(right.viable) - Number(left.viable) ||
    Number(right.strategicNecessity) - Number(left.strategicNecessity) ||
    right.projectedNetMargin - left.projectedNetMargin ||
    right.destinationBuyPrice - left.destinationBuyPrice ||
    left.originSettlementId.localeCompare(right.originSettlementId) ||
    left.destinationSettlementId.localeCompare(right.destinationSettlementId) ||
    left.itemKey.localeCompare(right.itemKey) ||
    left.vehicleId.localeCompare(right.vehicleId)
  );
}

export function evaluateAutonomousTradeOpportunities(input: {
  settlementIds: string[];
  marketStates: SettlementMarketState[];
  transportState: CivilizationTransportState;
}): {
  settlementProfiles: SettlementSimulationState[];
  opportunities: TradeOpportunityState[];
} {
  const settlementProfiles = buildSettlementSimulationProfiles({
    settlementIds: input.settlementIds,
    marketStates: input.marketStates
  });
  const context = buildEvaluationContext({
    marketStates: input.marketStates,
    settlementProfiles,
    transportState: input.transportState
  });
  const opportunities: TradeOpportunityState[] = [];

  for (const originProfile of settlementProfiles) {
    const originSettlement = context.settlementsById.get(originProfile.settlementId);
    const originMarketState = context.marketBySettlementId.get(originProfile.settlementId);
    if (!originSettlement || !originMarketState) {
      continue;
    }

    const candidateStock = originMarketState.stock
      .filter((entry) => entry.stockLevel > 0)
      .sort((left, right) => {
        const leftSurplus = getExportableSurplus(left.itemKey, left, originProfile.businesses);
        const rightSurplus = getExportableSurplus(right.itemKey, right, originProfile.businesses);
        return rightSurplus - leftSurplus || left.itemKey.localeCompare(right.itemKey);
      })
      .slice(0, 18);

    for (const stockEntry of candidateStock) {
      const protectedReserve = getProtectedReserve(stockEntry.itemKey, stockEntry, originProfile.businesses);
      const exportableSurplus = getExportableSurplus(stockEntry.itemKey, stockEntry, originProfile.businesses);
      if (exportableSurplus < 1) {
        continue;
      }

      for (const destinationProfile of settlementProfiles) {
        if (destinationProfile.settlementId === originProfile.settlementId) {
          continue;
        }
        const destinationSettlement = context.settlementsById.get(destinationProfile.settlementId);
        const destinationMarketState = context.marketBySettlementId.get(destinationProfile.settlementId);
        if (!destinationSettlement || !destinationMarketState) {
          continue;
        }
        if (!destinationNeedsItem(destinationSettlement, destinationMarketState, stockEntry.itemKey)) {
          continue;
        }

        const destinationAbsorption = getDestinationAbsorption(
          destinationProfile.settlementId,
          stockEntry.itemKey,
          destinationMarketState,
          context.activeIncomingByDestinationItem
        );
        const strategicNecessity = isStrategicNecessity(destinationSettlement, destinationMarketState, stockEntry.itemKey);
        const transportCandidates = originProfile.infrastructure.transportAvailability
          .map((transportOption) =>
            evaluateCandidateTransport({
              originSettlement,
              destinationSettlement,
              originMarketState,
              destinationMarketState,
              originProfile,
              destinationProfile,
              transportOption,
              context,
              transportState: input.transportState,
              itemKey: stockEntry.itemKey,
              exportableSurplus,
              protectedReserve,
              destinationAbsorption,
              strategicNecessity
            })
          )
          .sort(compareOpportunities);

        if (transportCandidates.length > 0) {
          opportunities.push(transportCandidates[0]);
        }
      }
    }
  }

  opportunities.sort(compareOpportunities);
  return {
    settlementProfiles,
    opportunities
  };
}

export function runAutonomousTradeDispatch(input: {
  settlementIds: string[];
  marketStates: SettlementMarketState[];
  transportState: CivilizationTransportState;
  tick: number;
}): AutonomousTradeDispatchResult {
  const evaluated = evaluateAutonomousTradeOpportunities({
    settlementIds: input.settlementIds,
    marketStates: input.marketStates,
    transportState: input.transportState
  });

  const profileBySettlementId = new Map(evaluated.settlementProfiles.map((profile) => [profile.settlementId, profile]));
  const settlementsById = getSettlementsById();
  const vehicleById = getVehicleById();
  const throughputRemaining = new Map(
    evaluated.settlementProfiles.map((profile) => [profile.settlementId, profile.infrastructure.tradeThroughputUnitsPerTick])
  );
  const dispatchSlotsRemaining = new Map(
    evaluated.settlementProfiles.map((profile) => [profile.settlementId, profile.infrastructure.dispatchSlotsPerTick])
  );
  const routeUsageByRouteId = new Map<string, number>();
  const dispatched: TradeOpportunityState[] = [];
  let workingTransportState: CivilizationTransportState = {
    ...input.transportState,
    assetReservations: [...input.transportState.assetReservations],
    lastEvaluatedOpportunities: [...evaluated.opportunities]
  };
  let workingMarketStates = input.marketStates;

  for (const caravan of input.transportState.caravans) {
    if (caravan.status === "arrived" || caravan.status === "blocked") {
      continue;
    }
    const vehicle = caravan.transportUnit.vehicleId ? vehicleById.get(caravan.transportUnit.vehicleId) : null;
    recordRouteUsage(caravan.routePlan.routeIds, routeUsageByRouteId, vehicle?.routeScaleCost ?? 1);
  }

  for (const opportunity of evaluated.opportunities) {
    if (!opportunity.viable) {
      continue;
    }

    const originProfile = profileBySettlementId.get(opportunity.originSettlementId);
    const destinationProfile = profileBySettlementId.get(opportunity.destinationSettlementId);
    const originSettlement = settlementsById.get(opportunity.originSettlementId);
    const vehicle = vehicleById.get(opportunity.vehicleId);
    if (!originProfile || !destinationProfile || !originSettlement || !vehicle) {
      continue;
    }

    const remainingOriginThroughput = throughputRemaining.get(opportunity.originSettlementId) ?? 0;
    const remainingDestinationThroughput = throughputRemaining.get(opportunity.destinationSettlementId) ?? 0;
    const remainingOriginSlots = dispatchSlotsRemaining.get(opportunity.originSettlementId) ?? 0;
    const remainingDestinationSlots = dispatchSlotsRemaining.get(opportunity.destinationSettlementId) ?? 0;
    const originMarketState = workingMarketStates.find((state) => state.settlementId === opportunity.originSettlementId);
    const currentOriginStock = getStockEntry(originMarketState, opportunity.itemKey)?.stockLevel ?? 0;

    if (currentOriginStock < opportunity.projectedQuantity) {
      continue;
    }
    if (remainingOriginThroughput < opportunity.projectedLoadUnits || remainingDestinationThroughput < opportunity.projectedLoadUnits) {
      continue;
    }
    if (remainingOriginSlots < 1 || remainingDestinationSlots < 1) {
      continue;
    }

    const transportOption = originProfile.infrastructure.transportAvailability.find((entry) => entry.vehicleId === opportunity.vehicleId);
    if (!transportOption) {
      continue;
    }
    const currentVehicleUsage = workingTransportState.caravans.filter(
      (caravan) =>
        caravan.status !== "arrived" &&
        caravan.originSettlementId === opportunity.originSettlementId &&
        caravan.transportUnit.vehicleId === opportunity.vehicleId
    ).length;
    const currentRemainingTransportUnits = getRemainingTransportUnits(
      opportunity.originSettlementId,
      transportOption,
      new Map([[getVehicleUsageKey(opportunity.originSettlementId, opportunity.vehicleId), currentVehicleUsage]]),
      workingTransportState.assetReservations
    );
    if (currentRemainingTransportUnits <= 0) {
      continue;
    }

    const transportUnit = buildTransportUnit(vehicle, transportOption);
    try {
      const routePlan = resolveBestRoute({
        fromSettlementId: opportunity.originSettlementId,
        toSettlementId: opportunity.destinationSettlementId,
        modeId: transportUnit.modeId,
        strategy: opportunity.strategicNecessity ? "lowest_risk" : "lowest_cost"
      });
      const routeUsage = getExistingRouteUsage(routePlan.routeIds, routeUsageByRouteId);
      const routeCapacity = getRouteScaleCapacity(routePlan);
      if (routeUsage + vehicle.routeScaleCost > routeCapacity) {
        continue;
      }
      const dispatchedResult = dispatchCaravan({
        transportState: workingTransportState,
        marketStates: workingMarketStates,
        marketStatesAlreadyAdjusted: true,
        originSettlementId: opportunity.originSettlementId,
        destinationSettlementId: opportunity.destinationSettlementId,
        cargoManifest: [{ itemKey: opportunity.itemKey, quantity: opportunity.projectedQuantity }],
        transportUnit,
        strategy: opportunity.strategicNecessity ? "lowest_risk" : "lowest_cost"
      });

      const reservation: TransportAssetReservationState = {
        settlementId: opportunity.originSettlementId,
        vehicleId: opportunity.vehicleId,
        availableAtTick: input.tick + Math.max(1, Math.ceil(opportunity.cycleDays)),
        unitCount: 1,
        note: `${opportunity.itemKey} convoy returning from ${opportunity.destinationSettlementId}.`
      };

      workingTransportState = {
        ...dispatchedResult.transportState,
        assetReservations: [...dispatchedResult.transportState.assetReservations, reservation],
        lastEvaluatedOpportunities: [...evaluated.opportunities]
      };
      workingMarketStates = dispatchedResult.marketStates;
      dispatched.push(opportunity);

      throughputRemaining.set(
        opportunity.originSettlementId,
        roundNumber(Math.max(0, remainingOriginThroughput - opportunity.projectedLoadUnits))
      );
      throughputRemaining.set(
        opportunity.destinationSettlementId,
        roundNumber(Math.max(0, remainingDestinationThroughput - opportunity.projectedLoadUnits))
      );
      dispatchSlotsRemaining.set(opportunity.originSettlementId, Math.max(0, remainingOriginSlots - 1));
      dispatchSlotsRemaining.set(opportunity.destinationSettlementId, Math.max(0, remainingDestinationSlots - 1));
      recordRouteUsage(routePlan.routeIds, routeUsageByRouteId, vehicle.routeScaleCost);
    } catch {
      continue;
    }
  }

  workingTransportState = {
    ...workingTransportState,
    lastEvaluatedOpportunities: [...evaluated.opportunities]
  };

  return {
    transportState: workingTransportState,
    marketStates: workingMarketStates,
    settlementProfiles: evaluated.settlementProfiles,
    opportunities: evaluated.opportunities,
    dispatched
  };
}
