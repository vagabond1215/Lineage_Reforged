import type {
  CaravanAdvanceResultState,
  CaravanCargoEntryState,
  CaravanDispatchResultState,
  CaravanSegmentProgressState,
  CaravanState,
  CivilizationTransportState,
  RouteSegmentState,
  SettlementMarketState,
  SettlementStockAdjustmentState,
  TransportPerformanceBreakdownState,
  TransportType,
  TransportUnitState
} from "../../../shared/types/src/index.js";
import {
  loadTransportProfileContent,
  type TransportAnimalProfileRecord,
  type TransportHarnessProfileRecord,
  type TransportVehicleProfileRecord
} from "./content.js";
import { resolveLocalMarketPrice } from "./runtime-economy.js";
import { resolveResourceFamilies } from "./resource-taxonomy.js";
import { resolveBestRoute } from "./spatial-world.js";

const DEFAULT_FOOT_CAPACITY_PER_CREW = 18;
const MAX_OVERLOAD_RATIO = 1.35;

const BULK_BY_FAMILY: Array<{ family: string; units: number }> = [
  { family: "minerals", units: 1.6 },
  { family: "wood", units: 1.45 },
  { family: "tools", units: 1.3 },
  { family: "armor", units: 1.25 },
  { family: "weapons", units: 1.2 },
  { family: "grain", units: 1 },
  { family: "vegetables", units: 0.9 },
  { family: "fruit", units: 0.8 },
  { family: "fish", units: 0.9 },
  { family: "meat", units: 1 },
  { family: "hides", units: 0.85 },
  { family: "fur", units: 0.55 },
  { family: "textiles", units: 0.6 },
  { family: "herbs", units: 0.3 },
  { family: "tea", units: 0.25 },
  { family: "luxury_goods", units: 0.4 },
  { family: "records", units: 0.2 },
  { family: "maritime_goods", units: 0.75 },
  { family: "livestock", units: 2.4 }
];

interface TransportIndexes {
  harnessById: Map<string, TransportHarnessProfileRecord>;
  animalById: Map<string, TransportAnimalProfileRecord>;
  vehicleById: Map<string, TransportVehicleProfileRecord>;
}

let transportIndexesCache: TransportIndexes | null = null;

function roundNumber(value: number): number {
  return Number(value.toFixed(4));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function uniqueStrings(values: Iterable<string>): string[] {
  return [...new Set(values)];
}

function createTransportIndexes(): TransportIndexes {
  const catalogs = loadTransportProfileContent();
  const catalog = catalogs[0];
  if (!catalog) {
    throw new Error("No transport profile catalog is available.");
  }

  return {
    harnessById: new Map(catalog.harnessProfiles.map((record) => [record.id, record])),
    animalById: new Map(catalog.animalProfiles.map((record) => [record.id, record])),
    vehicleById: new Map(catalog.vehicleProfiles.map((record) => [record.id, record]))
  };
}

function getTransportIndexes(): TransportIndexes {
  if (!transportIndexesCache) {
    transportIndexesCache = createTransportIndexes();
  }
  return transportIndexesCache;
}

function modeSupportsTransportType(transportType: TransportType, modeId: string): boolean {
  if (transportType === "foot") {
    return modeId === "travel_mode.foot";
  }
  if (transportType === "mounted") {
    return modeId === "travel_mode.horseback" || modeId === "travel_mode.pack_animal";
  }
  return modeId === "travel_mode.wagon" || modeId === "travel_mode.pack_animal" || modeId === "travel_mode.river_craft" || modeId === "travel_mode.sea_vessel";
}

function getCargoUnitWeight(itemKey: string): number {
  const families = resolveResourceFamilies(itemKey);
  for (const entry of BULK_BY_FAMILY) {
    if (families.includes(entry.family)) {
      return entry.units;
    }
  }
  return 1;
}

export function resolveCargoLoadUnits(itemKey: string, quantity: number): number {
  return roundNumber(getCargoUnitWeight(itemKey) * quantity);
}

function mapCargoManifest(manifest: Array<{ itemKey: string; quantity: number }>): CaravanCargoEntryState[] {
  return manifest.map((entry) => ({
    itemKey: entry.itemKey,
    quantity: entry.quantity,
    loadUnits: resolveCargoLoadUnits(entry.itemKey, entry.quantity)
  }));
}

function sumCargoLoadUnits(manifest: CaravanCargoEntryState[]): number {
  return roundNumber(manifest.reduce((sum, entry) => sum + entry.loadUnits, 0));
}

function getVehicleProfile(unit: TransportUnitState): TransportVehicleProfileRecord | null {
  if (!unit.vehicleId) {
    return null;
  }
  const profile = getTransportIndexes().vehicleById.get(unit.vehicleId);
  if (!profile) {
    throw new Error(`Unknown vehicle profile '${unit.vehicleId}'.`);
  }
  return profile;
}

function getHarnessProfile(harnessId: string | null): TransportHarnessProfileRecord | null {
  if (!harnessId) {
    return null;
  }
  const profile = getTransportIndexes().harnessById.get(harnessId);
  if (!profile) {
    throw new Error(`Unknown harness profile '${harnessId}'.`);
  }
  return profile;
}

function expandAssignedAnimals(unit: TransportUnitState): TransportAnimalProfileRecord[] {
  const indexes = getTransportIndexes();
  const expanded: TransportAnimalProfileRecord[] = [];
  for (const assignment of unit.animals) {
    const profile = indexes.animalById.get(assignment.animalId);
    if (!profile) {
      throw new Error(`Unknown animal profile '${assignment.animalId}'.`);
    }
    for (let count = 0; count < assignment.count; count += 1) {
      expanded.push(profile);
    }
  }
  return expanded;
}

function validateTransportUnit(unit: TransportUnitState): {
  vehicle: TransportVehicleProfileRecord | null;
  harness: TransportHarnessProfileRecord | null;
  animals: TransportAnimalProfileRecord[];
} {
  const vehicle = getVehicleProfile(unit);
  const harness = getHarnessProfile(unit.harnessId);
  const animals = expandAssignedAnimals(unit);

  if (!modeSupportsTransportType(unit.transportType, unit.modeId)) {
    throw new Error(`Transport type '${unit.transportType}' is incompatible with mode '${unit.modeId}'.`);
  }

  if (unit.transportType === "foot") {
    if (vehicle || harness || animals.length > 0) {
      throw new Error("Foot transport cannot assign a vehicle, harness, or draft animals.");
    }
    return { vehicle: null, harness: null, animals: [] };
  }

  if (unit.transportType === "mounted") {
    if (vehicle) {
      throw new Error("Mounted transport cannot assign a vehicle profile.");
    }
    if (animals.length === 0) {
      throw new Error("Mounted transport requires at least one assigned animal.");
    }
    if (harness && !harness.supportedTransportTypes.includes("mounted")) {
      throw new Error(`Harness '${harness.id}' does not support mounted transport.`);
    }
  }

  if (unit.transportType === "vehicle" || unit.transportType === "ship") {
    if (!vehicle) {
      throw new Error(`Transport type '${unit.transportType}' requires an assigned vehicle profile.`);
    }
    if (vehicle.transportType !== unit.transportType) {
      throw new Error(`Vehicle '${vehicle.id}' does not match transport type '${unit.transportType}'.`);
    }
    if (vehicle.routeModeId !== unit.modeId) {
      throw new Error(`Vehicle '${vehicle.id}' requires route mode '${vehicle.routeModeId}'.`);
    }
    if (vehicle.requiredHarnessId !== unit.harnessId) {
      throw new Error(`Vehicle '${vehicle.id}' requires harness '${vehicle.requiredHarnessId ?? "none"}'.`);
    }
    if (animals.length > vehicle.maxAnimals) {
      throw new Error(`Vehicle '${vehicle.id}' only supports ${vehicle.maxAnimals} assigned animals.`);
    }
    if (unit.transportType === "vehicle" && (vehicle.propulsionType === "draft_animals" || vehicle.propulsionType === "pack_train") && animals.length === 0) {
      throw new Error(`Vehicle '${vehicle.id}' requires assigned draft animals.`);
    }
    if (unit.transportType === "vehicle" && vehicle.propulsionType === "human") {
      if (animals.length > 0) {
        throw new Error(`Human-powered vehicle '${vehicle.id}' cannot use draft animals.`);
      }
      if (unit.harnessId !== null) {
        throw new Error(`Human-powered vehicle '${vehicle.id}' cannot use a harness.`);
      }
    }
    if (unit.transportType === "ship" && animals.length > 0) {
      throw new Error(`Ship '${vehicle.id}' cannot use draft animals.`);
    }
  }

  if (harness) {
    if (!harness.supportedTransportTypes.includes(unit.transportType)) {
      throw new Error(`Harness '${harness.id}' does not support transport type '${unit.transportType}'.`);
    }
    for (const animal of animals) {
      if (!animal.compatibleHarnessIds.includes(harness.id) || !harness.compatibleAnimalIds.includes(animal.id)) {
        throw new Error(`Animal '${animal.id}' is incompatible with harness '${harness.id}'.`);
      }
    }
  }

  return { vehicle, harness, animals };
}

function getTerrainModifier(segment: RouteSegmentState, vehicle: TransportVehicleProfileRecord | null): number {
  const routeTerrainFactor =
    segment.baseSpeedKilometersPerDay > 0 ? segment.effectiveSpeedKilometersPerDay / segment.baseSpeedKilometersPerDay : 1;
  const vehicleModifier = vehicle ? vehicle.terrainModifiers[segment.edgeType] ?? 0.85 : 1;
  const riskCaution = clamp(1 - segment.riskLevel * 0.035, 0.82, 1);
  return roundNumber(routeTerrainFactor * vehicleModifier * riskCaution);
}

function getAnimalPullAndEndurance(
  animals: TransportAnimalProfileRecord[],
  harness: TransportHarnessProfileRecord | null,
  vehicle: TransportVehicleProfileRecord | null,
  segment: RouteSegmentState
): { effectivePullUnits: number; enduranceHours: number; notes: string[] } {
  if (animals.length === 0) {
    return {
      effectivePullUnits: 0,
      enduranceHours: vehicle?.baseEnduranceHours ?? 8,
      notes: []
    };
  }

  const ordered = [...animals].sort((left, right) => right.pullStrength - left.pullStrength);
  const inclinePenalty =
    segment.barrierTags.some((tag) => tag === "cliff" || tag === "mountain_pass" || tag === "switchbacks") || segment.edgeType === "pass";
  const harnessEfficiency = harness?.efficiencyModifier ?? 1;

  let effectivePullUnits = 0;
  let weightedEndurance = 0;
  for (const [index, animal] of ordered.entries()) {
    const diminishing = Math.pow(animal.diminishingExponent, index);
    const inclineFactor = inclinePenalty ? animal.inclineHandling : 1;
    effectivePullUnits += animal.pullStrength * diminishing * inclineFactor * harnessEfficiency;
    weightedEndurance += animal.enduranceHours;
  }

  const enduranceHours = vehicle ? Math.min(vehicle.baseEnduranceHours, weightedEndurance / ordered.length) : weightedEndurance / ordered.length;
  const notes = inclinePenalty ? ["Incline handling reduces effective pull on pass-country segments."] : [];
  return {
    effectivePullUnits: roundNumber(effectivePullUnits),
    enduranceHours: roundNumber(enduranceHours),
    notes
  };
}

function getLoadFactor(cargoLoadUnits: number, cargoCapacityUnits: number): number {
  const loadRatio = cargoCapacityUnits > 0 ? cargoLoadUnits / cargoCapacityUnits : 1;
  if (loadRatio <= 1) {
    return roundNumber(clamp(1 - 0.28 * Math.pow(loadRatio, 1.22), 0.45, 1.08));
  }
  return roundNumber(clamp(0.72 / (1 + (loadRatio - 1) * 1.6), 0.18, 0.72));
}

function getCrewFactor(crewSize: number, requiredCrew: number): number {
  return roundNumber(clamp(Math.pow(clamp(crewSize / Math.max(requiredCrew, 1), 0.3, 1.4), 0.38), 0.45, 1.18));
}

function getPropulsionFactor(
  unit: TransportUnitState,
  vehicle: TransportVehicleProfileRecord | null,
  harness: TransportHarnessProfileRecord | null,
  animals: TransportAnimalProfileRecord[],
  cargoLoadUnits: number,
  segment: RouteSegmentState
): { factor: number; effectivePullUnits: number; pullRequirementUnits: number; enduranceHours: number; notes: string[] } {
  if (unit.transportType === "ship") {
    const ship = vehicle;
    const requiredCrew = ship?.crewRequired ?? 1;
    return {
      factor: roundNumber(getCrewFactor(unit.crewSize, requiredCrew) * (ship?.speedModifier ?? 1)),
      effectivePullUnits: unit.crewSize,
      pullRequirementUnits: requiredCrew,
      enduranceHours: ship?.baseEnduranceHours ?? 12,
      notes: [unit.crewSize >= requiredCrew ? "Crew is sufficient for rated handling." : "Crew is below the rated complement."]
    };
  }

  if (unit.transportType === "foot") {
    return {
      factor: 1,
      effectivePullUnits: unit.crewSize,
      pullRequirementUnits: unit.crewSize,
      enduranceHours: 8,
      notes: ["Foot transport uses porter capacity and crew endurance only."]
    };
  }

  if (vehicle?.propulsionType === "human") {
    const requiredCrew = Math.max(vehicle.crewRequired, 1);
    return {
      factor: roundNumber(getCrewFactor(unit.crewSize, requiredCrew) * vehicle.speedModifier),
      effectivePullUnits: unit.crewSize,
      pullRequirementUnits: requiredCrew,
      enduranceHours: vehicle.baseEnduranceHours,
      notes: [unit.crewSize >= requiredCrew ? "Crew is sufficient for human-powered hauling." : "Crew is below the rated hauling complement."]
    };
  }

  const animalResult = getAnimalPullAndEndurance(animals, harness, vehicle, segment);
  const optimalAnimals = vehicle ? Math.max(vehicle.optimalAnimals, 1) : Math.max(1, animals.length);
  const teamPenalty = roundNumber(clamp(1 - Math.max(0, animals.length - optimalAnimals) * 0.04, 0.82, 1));
  const speedModifier =
    animals.length > 0 ? animals.reduce((sum, animal) => sum + animal.speedModifier, 0) / animals.length : 1;
  const pullRequirementUnits = roundNumber((vehicle?.baseWeightUnits ?? 0) + cargoLoadUnits);
  const powerRatio = pullRequirementUnits > 0 ? animalResult.effectivePullUnits / pullRequirementUnits : 1;
  const factor = roundNumber(clamp(Math.pow(clamp(powerRatio, 0.25, 1.8), 0.32) * speedModifier * teamPenalty, 0.42, 1.22));

  return {
    factor,
    effectivePullUnits: animalResult.effectivePullUnits,
    pullRequirementUnits,
    enduranceHours: animalResult.enduranceHours,
    notes: [
      ...animalResult.notes,
      animals.length > optimalAnimals ? "Extra draft animals add power sub-linearly and create team inefficiency." : "Draft team is within efficient size."
    ]
  };
}

export function resolveTransportPerformance(input: {
  transportUnit: TransportUnitState;
  cargoManifest: CaravanCargoEntryState[];
  segment: RouteSegmentState;
  fatigueLoad?: number;
}): TransportPerformanceBreakdownState {
  const { vehicle, harness, animals } = validateTransportUnit(input.transportUnit);
  const cargoLoadUnits = sumCargoLoadUnits(input.cargoManifest);
  const fatigueLoad = clamp(input.fatigueLoad ?? 0, 0, 2);
  const cargoCapacityUnits =
    input.transportUnit.transportType === "foot"
      ? input.transportUnit.crewSize * DEFAULT_FOOT_CAPACITY_PER_CREW
      : input.transportUnit.transportType === "mounted" && !vehicle
        ? roundNumber(animals.reduce((sum, animal) => sum + animal.packCapacityUnits, 0))
        : vehicle?.cargoCapacityUnits ?? 0;

  if (cargoCapacityUnits <= 0) {
    throw new Error("Transport configuration has no cargo capacity.");
  }
  if (cargoLoadUnits > cargoCapacityUnits * MAX_OVERLOAD_RATIO) {
    throw new Error(`Cargo load ${cargoLoadUnits} exceeds hard transport limit ${roundNumber(cargoCapacityUnits * MAX_OVERLOAD_RATIO)}.`);
  }

  const terrainFactor = getTerrainModifier(input.segment, vehicle);
  const loadFactor = getLoadFactor(cargoLoadUnits, cargoCapacityUnits);
  const propulsion = getPropulsionFactor(input.transportUnit, vehicle, harness, animals, cargoLoadUnits, input.segment);
  const fatigueFactor = roundNumber(clamp(1 - fatigueLoad * 0.16, 0.58, 1));
  const baseModeSpeedKilometersPerDay = input.segment.baseSpeedKilometersPerDay * (vehicle?.speedModifier ?? 1);
  const effectiveSpeedKilometersPerDay = roundNumber(
    clamp(baseModeSpeedKilometersPerDay * terrainFactor * loadFactor * propulsion.factor * fatigueFactor, 2, 220)
  );

  return {
    baseModeSpeedKilometersPerDay: roundNumber(baseModeSpeedKilometersPerDay),
    terrainFactor,
    loadFactor,
    propulsionFactor: roundNumber(propulsion.factor),
    fatigueFactor,
    effectiveSpeedKilometersPerDay,
    cargoCapacityUnits: roundNumber(cargoCapacityUnits),
    cargoLoadUnits,
    pullRequirementUnits: roundNumber(propulsion.pullRequirementUnits),
    effectivePullUnits: roundNumber(propulsion.effectivePullUnits),
    enduranceHours: roundNumber(propulsion.enduranceHours),
    restDaysPerFatigueCycle: roundNumber(vehicle?.restDaysPerFatigueCycle ?? 0.25),
    notes: uniqueStrings([
      ...propulsion.notes,
      loadFactor < 0.75 ? "Cargo load is above the comfort threshold and slows movement." : "Cargo load is within the comfort threshold."
    ])
  };
}

function cloneMarketStates(states: SettlementMarketState[]): SettlementMarketState[] {
  return states.map((state) => ({
    ...state,
    stock: state.stock.map((entry) => ({ ...entry })),
    laborPressure: state.laborPressure.map((entry) => ({ ...entry })),
    priceView: state.priceView.map((entry) => ({ ...entry, pressureSources: entry.pressureSources.map((source) => ({ ...source })) }))
  }));
}

function recomputeStockPressure(stockLevel: number, reservePerTick: number, unmetDemandPerTick: number): {
  supplyPressure: number;
  demandPressure: number;
} {
  const reserveTarget = Math.max(1, reservePerTick);
  const demandTarget = Math.max(1, unmetDemandPerTick + reservePerTick * 0.5);
  return {
    supplyPressure: roundNumber(clamp((stockLevel - reserveTarget) / reserveTarget, -1.5, 3)),
    demandPressure: roundNumber(clamp((demandTarget - stockLevel) / demandTarget, -1.5, 3))
  };
}

function ensureStockEntry(state: SettlementMarketState, itemKey: string) {
  let entry = state.stock.find((stockEntry) => stockEntry.itemKey === itemKey);
  if (!entry) {
    entry = {
      itemKey,
      stockLevel: 0,
      reservePerTick: 0,
      tradeSurplusPerTick: 0,
      unmetDemandPerTick: 0,
      netPerTick: 0,
      supplyPressure: 0,
      demandPressure: 1
    };
    state.stock.push(entry);
    state.stock.sort((left, right) => left.itemKey.localeCompare(right.itemKey));
  }
  return entry;
}

function mergeStockAdjustments(adjustments: SettlementStockAdjustmentState[]): SettlementStockAdjustmentState[] {
  const merged = new Map<string, SettlementStockAdjustmentState>();
  for (const adjustment of adjustments) {
    const key = `${adjustment.settlementId}|${adjustment.itemKey}|${adjustment.source}`;
    const existing = merged.get(key);
    if (existing) {
      existing.stockDelta = roundNumber(existing.stockDelta + adjustment.stockDelta);
      existing.note = uniqueStrings([existing.note, adjustment.note]).join(" ");
    } else {
      merged.set(key, { ...adjustment });
    }
  }
  return [...merged.values()].sort((left, right) => {
    const leftKey = `${left.settlementId}|${left.itemKey}|${left.source}`;
    const rightKey = `${right.settlementId}|${right.itemKey}|${right.source}`;
    return leftKey.localeCompare(rightKey);
  });
}

function repriceMarketStates(states: SettlementMarketState[]): SettlementMarketState[] {
  for (const state of states) {
    const pricedKeys = state.priceView.length > 0 ? state.priceView.map((entry) => entry.itemKey) : state.stock.map((entry) => entry.itemKey);
    state.priceView = pricedKeys
      .sort((left, right) => left.localeCompare(right))
      .map((itemKey) => resolveLocalMarketPrice({ itemKey, settlementId: state.settlementId, marketState: state }));
  }
  return states;
}

export function applyStockAdjustmentsToMarketStates(input: {
  marketStates: SettlementMarketState[];
  adjustments: SettlementStockAdjustmentState[];
}): SettlementMarketState[] {
  const clonedStates = cloneMarketStates(input.marketStates);
  const stateBySettlementId = new Map(clonedStates.map((state) => [state.settlementId, state]));

  for (const adjustment of input.adjustments) {
    const state = stateBySettlementId.get(adjustment.settlementId);
    if (!state) {
      continue;
    }
    const entry = ensureStockEntry(state, adjustment.itemKey);
    entry.stockLevel = roundNumber(Math.max(0, entry.stockLevel + adjustment.stockDelta));
    const pressure = recomputeStockPressure(entry.stockLevel, entry.reservePerTick, entry.unmetDemandPerTick);
    entry.supplyPressure = pressure.supplyPressure;
    entry.demandPressure = pressure.demandPressure;
  }

  return repriceMarketStates(clonedStates);
}

function nextCaravanId(transportState: CivilizationTransportState, originSettlementId: string, destinationSettlementId: string): string {
  const ordinal = transportState.nextCaravanOrdinal;
  return `caravan.${originSettlementId.replace(/^settlement\./, "")}_${destinationSettlementId.replace(/^settlement\./, "")}_${ordinal}`;
}

function getAdjustedMarketStates(baseMarketStates: SettlementMarketState[], transportState: CivilizationTransportState): SettlementMarketState[] {
  return applyStockAdjustmentsToMarketStates({
    marketStates: baseMarketStates,
    adjustments: transportState.stockAdjustments
  });
}

function buildInitialSegmentProgress(caravan: CaravanState): CaravanSegmentProgressState | null {
  const segment = caravan.routePlan.segments[caravan.currentSegmentIndex];
  if (!segment) {
    return null;
  }
  return {
    segmentIndex: caravan.currentSegmentIndex,
    routeId: segment.routeId,
    distanceKilometers: segment.distanceKilometers,
    distanceCompletedKilometers: 0,
    progressRatio: 0,
    elapsedDays: 0,
    performance: resolveTransportPerformance({
      transportUnit: caravan.transportUnit,
      cargoManifest: caravan.cargoManifest,
      segment,
      fatigueLoad: caravan.fatigueLoad
    })
  };
}

function createNegativeOriginAdjustments(
  caravanId: string,
  originSettlementId: string,
  cargoManifest: CaravanCargoEntryState[]
): SettlementStockAdjustmentState[] {
  return cargoManifest.map((entry) => ({
    settlementId: originSettlementId,
    itemKey: entry.itemKey,
    stockDelta: roundNumber(-entry.quantity),
    source: caravanId,
    note: `Loaded onto ${caravanId}.`
  }));
}

function createPositiveDestinationAdjustments(
  caravanId: string,
  destinationSettlementId: string,
  cargoManifest: CaravanCargoEntryState[]
): SettlementStockAdjustmentState[] {
  return cargoManifest.map((entry) => ({
    settlementId: destinationSettlementId,
    itemKey: entry.itemKey,
    stockDelta: roundNumber(entry.quantity),
    source: caravanId,
    note: `Delivered by ${caravanId}.`
  }));
}

export function createEmptyCivilizationTransportState(): CivilizationTransportState {
  return {
    caravans: [],
    stockAdjustments: [],
    nextCaravanOrdinal: 1,
    assetReservations: [],
    lastEvaluatedOpportunities: [],
    lastProcessedTick: 0
  };
}

export function dispatchCaravan(input: {
  transportState: CivilizationTransportState;
  marketStates: SettlementMarketState[];
  originSettlementId: string;
  destinationSettlementId: string;
  cargoManifest: Array<{ itemKey: string; quantity: number }>;
  transportUnit: TransportUnitState;
  strategy?: "fastest" | "lowest_risk" | "lowest_cost";
  marketStatesAlreadyAdjusted?: boolean;
}): {
  transportState: CivilizationTransportState;
  marketStates: SettlementMarketState[];
  dispatch: CaravanDispatchResultState;
} {
  const adjustedMarketStates = input.marketStatesAlreadyAdjusted ? cloneMarketStates(input.marketStates) : getAdjustedMarketStates(input.marketStates, input.transportState);
  const originMarketState = adjustedMarketStates.find((state) => state.settlementId === input.originSettlementId);
  if (!originMarketState) {
    throw new Error(`Missing market state for origin settlement '${input.originSettlementId}'.`);
  }

  const cargoManifest = mapCargoManifest(input.cargoManifest);
  const routePlan = resolveBestRoute({
    fromSettlementId: input.originSettlementId,
    toSettlementId: input.destinationSettlementId,
    modeId: input.transportUnit.modeId,
    strategy: input.strategy ?? "lowest_cost"
  });

  const caravanId = nextCaravanId(input.transportState, input.originSettlementId, input.destinationSettlementId);
  const firstSegment = routePlan.segments[0];
  if (firstSegment) {
    resolveTransportPerformance({
      transportUnit: input.transportUnit,
      cargoManifest,
      segment: firstSegment
    });
  }

  for (const entry of cargoManifest) {
    const stockEntry = originMarketState.stock.find((stock) => stock.itemKey === entry.itemKey);
    const availableStock = stockEntry?.stockLevel ?? 0;
    if (availableStock < entry.quantity) {
      throw new Error(`Origin settlement '${input.originSettlementId}' lacks ${entry.quantity} ${entry.itemKey}; available stock is ${availableStock}.`);
    }
  }

  const caravan: CaravanState = {
    id: caravanId,
    originSettlementId: input.originSettlementId,
    destinationSettlementId: input.destinationSettlementId,
    status: "in_transit",
    transportUnit: { ...input.transportUnit, animals: input.transportUnit.animals.map((entry) => ({ ...entry })) },
    cargoManifest,
    routePlan,
    currentSegmentIndex: 0,
    segmentProgress: null,
    daysInTransit: 0,
    fatigueLoad: 0,
    restRemainingDays: 0,
    failureReason: null,
    explanation: [
      `Dispatched from ${input.originSettlementId} to ${input.destinationSettlementId}.`,
      `Route mode ${input.transportUnit.modeId} selected with ${cargoManifest.length} cargo lines.`
    ]
  };
  caravan.segmentProgress = buildInitialSegmentProgress(caravan);

  const stockAdjustments = createNegativeOriginAdjustments(caravanId, input.originSettlementId, cargoManifest);
  const nextTransportState: CivilizationTransportState = {
    ...input.transportState,
    caravans: [...input.transportState.caravans, caravan],
    stockAdjustments: mergeStockAdjustments([...input.transportState.stockAdjustments, ...stockAdjustments]),
    nextCaravanOrdinal: input.transportState.nextCaravanOrdinal + 1,
    assetReservations: [...input.transportState.assetReservations],
    lastEvaluatedOpportunities: [...input.transportState.lastEvaluatedOpportunities]
  };

  return {
    transportState: nextTransportState,
    marketStates: input.marketStatesAlreadyAdjusted
      ? applyStockAdjustmentsToMarketStates({
          marketStates: input.marketStates,
          adjustments: stockAdjustments
        })
      : getAdjustedMarketStates(input.marketStates, nextTransportState),
    dispatch: {
      caravan,
      stockAdjustments,
      explanation: [
        `Removed cargo from ${input.originSettlementId} and loaded ${caravanId}.`,
        `Chosen route uses ${routePlan.routeIds.length} authored corridor(s).`
      ]
    }
  };
}

function getFatigueGain(performance: TransportPerformanceBreakdownState, segment: RouteSegmentState, travelDays: number): number {
  const dailyBudget = Math.max(performance.enduranceHours / 10, 0.2);
  const strain = clamp((1 / Math.max(performance.loadFactor, 0.2)) * (1 / Math.max(performance.terrainFactor, 0.25)) * (1 + segment.riskLevel * 0.08), 0.7, 2.4);
  return roundNumber((travelDays / dailyBudget) * strain);
}

function advanceSingleCaravan(caravan: CaravanState, elapsedDays: number): CaravanAdvanceResultState {
  const updated: CaravanState = {
    ...caravan,
    cargoManifest: caravan.cargoManifest.map((entry) => ({ ...entry })),
    transportUnit: { ...caravan.transportUnit, animals: caravan.transportUnit.animals.map((entry) => ({ ...entry })) },
    routePlan: {
      ...caravan.routePlan,
      routeIds: [...caravan.routePlan.routeIds],
      segments: caravan.routePlan.segments.map((segment) => ({
        ...segment,
        barrierTags: [...segment.barrierTags],
        allowedTravelModes: [...segment.allowedTravelModes],
        penalties: segment.penalties.map((penalty) => ({ ...penalty })),
        notes: [...segment.notes]
      })),
      rejectedRoutes: caravan.routePlan.rejectedRoutes.map((entry) => ({ ...entry })),
      explanation: [...caravan.routePlan.explanation]
    },
    segmentProgress: caravan.segmentProgress ? { ...caravan.segmentProgress, performance: { ...caravan.segmentProgress.performance, notes: [...caravan.segmentProgress.performance.notes] } } : null,
    explanation: [...caravan.explanation]
  };

  const appliedStockAdjustments: SettlementStockAdjustmentState[] = [];
  let remainingDays = elapsedDays;

  while (remainingDays > 0 && updated.status !== "arrived" && updated.status !== "blocked") {
    if (updated.restRemainingDays > 0) {
      const consumedRest = Math.min(remainingDays, updated.restRemainingDays);
      updated.restRemainingDays = roundNumber(updated.restRemainingDays - consumedRest);
      updated.daysInTransit = roundNumber(updated.daysInTransit + consumedRest);
      remainingDays = roundNumber(remainingDays - consumedRest);
      updated.fatigueLoad = roundNumber(Math.max(0, updated.fatigueLoad - consumedRest / 0.5));
      updated.status = updated.restRemainingDays > 0 ? "resting" : "in_transit";
      updated.explanation.push(`Rested for ${consumedRest.toFixed(2)} day(s).`);
      continue;
    }

    const segment = updated.routePlan.segments[updated.currentSegmentIndex];
    if (!segment) {
      updated.status = "arrived";
      break;
    }

    let performance: TransportPerformanceBreakdownState;
    try {
      performance = resolveTransportPerformance({
        transportUnit: updated.transportUnit,
        cargoManifest: updated.cargoManifest,
        segment,
        fatigueLoad: updated.fatigueLoad
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      updated.status = "blocked";
      updated.failureReason = message;
      updated.explanation.push(`Movement blocked on segment ${updated.currentSegmentIndex + 1}: ${message}`);
      break;
    }
    const distanceCompleted = updated.segmentProgress?.distanceCompletedKilometers ?? 0;
    const remainingDistance = roundNumber(Math.max(0, segment.distanceKilometers - distanceCompleted));
    const dailyTravelBudget = Math.max(performance.enduranceHours / 10, 0.2);
    const remainingEnduranceDays = roundNumber(Math.max(0.05, dailyTravelBudget * Math.max(1 - updated.fatigueLoad, 0.2)));
    const travelDays = roundNumber(Math.min(remainingDays, remainingEnduranceDays));
    const distanceCovered = roundNumber(Math.min(remainingDistance, performance.effectiveSpeedKilometersPerDay * travelDays));
    const timeSpent = roundNumber(distanceCovered / performance.effectiveSpeedKilometersPerDay);
    const newDistanceCompleted = roundNumber(distanceCompleted + distanceCovered);
    const progressRatio = roundNumber(newDistanceCompleted / segment.distanceKilometers);

    updated.daysInTransit = roundNumber(updated.daysInTransit + timeSpent);
    remainingDays = roundNumber(remainingDays - timeSpent);
    updated.fatigueLoad = roundNumber(updated.fatigueLoad + getFatigueGain(performance, segment, timeSpent));
    updated.segmentProgress = {
      segmentIndex: updated.currentSegmentIndex,
      routeId: segment.routeId,
      distanceKilometers: segment.distanceKilometers,
      distanceCompletedKilometers: newDistanceCompleted,
      progressRatio: roundNumber(clamp(progressRatio, 0, 1)),
      elapsedDays: roundNumber((updated.segmentProgress?.elapsedDays ?? 0) + timeSpent),
      performance
    };

    if (newDistanceCompleted + 0.0001 >= segment.distanceKilometers) {
      updated.explanation.push(`Completed segment ${updated.currentSegmentIndex + 1} on route ${segment.routeId}.`);
      updated.currentSegmentIndex += 1;
      updated.segmentProgress = null;
      if (updated.currentSegmentIndex >= updated.routePlan.segments.length) {
        updated.status = "arrived";
        appliedStockAdjustments.push(...createPositiveDestinationAdjustments(updated.id, updated.destinationSettlementId, updated.cargoManifest));
        updated.explanation.push(`Arrived at ${updated.destinationSettlementId} and transferred cargo.`);
        break;
      }
    }

    if (updated.fatigueLoad >= 1) {
      updated.restRemainingDays = roundNumber(Math.max(performance.restDaysPerFatigueCycle, 0.2));
      updated.status = "resting";
      updated.explanation.push(`Fatigue threshold reached; scheduled ${updated.restRemainingDays.toFixed(2)} rest day(s).`);
    } else {
      updated.status = "in_transit";
    }
  }

  return {
    caravan: updated,
    appliedStockAdjustments,
    explanation: uniqueStrings(updated.explanation.slice(-5))
  };
}

export function advanceTransportState(input: {
  transportState: CivilizationTransportState;
  marketStates: SettlementMarketState[];
  elapsedDays: number;
  tick?: number;
}): {
  transportState: CivilizationTransportState;
  marketStates: SettlementMarketState[];
  results: CaravanAdvanceResultState[];
} {
  let workingStates = getAdjustedMarketStates(input.marketStates, input.transportState);
  const results: CaravanAdvanceResultState[] = [];
  const updatedCaravans: CaravanState[] = [];
  let stockAdjustments = [...input.transportState.stockAdjustments];
  const activeTick = input.tick ?? input.transportState.lastProcessedTick ?? 0;
  const assetReservations = input.transportState.assetReservations.filter((reservation) => reservation.availableAtTick > activeTick);

  for (const caravan of input.transportState.caravans) {
    if (caravan.status === "arrived" || caravan.status === "blocked") {
      updatedCaravans.push(caravan);
      continue;
    }

    const result = advanceSingleCaravan(caravan, input.elapsedDays);
    results.push(result);
    updatedCaravans.push(result.caravan);
    if (result.appliedStockAdjustments.length > 0) {
      stockAdjustments = mergeStockAdjustments([...stockAdjustments, ...result.appliedStockAdjustments]);
      workingStates = applyStockAdjustmentsToMarketStates({
        marketStates: input.marketStates,
        adjustments: stockAdjustments
      });
    }
  }

  return {
    transportState: {
      ...input.transportState,
      caravans: updatedCaravans,
      stockAdjustments,
      assetReservations,
      lastEvaluatedOpportunities: [...input.transportState.lastEvaluatedOpportunities],
      lastProcessedTick: input.tick ?? input.transportState.lastProcessedTick
    },
    marketStates: workingStates,
    results
  };
}
