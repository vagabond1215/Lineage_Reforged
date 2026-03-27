import type {
  EconomyPressureContribution,
  SettlementBuildingState,
  SettlementBuildingInstanceState,
  SettlementBusinessState,
  SettlementDevelopmentProfileState,
  SettlementDistrictState,
  SettlementInfrastructureRuntimeState,
  SettlementMarketState,
  SettlementMoraleState,
  SettlementPopulationClassState,
  SettlementPopulationProfileState,
  SettlementPlotState,
  SettlementRepairMaterialState,
  SettlementRepairProjectState,
  SettlementSimulationState,
  SettlementStorageProfileState,
  SettlementSupplyDemandState,
  SettlementTransportAvailabilityState
} from "../../../shared/types/src/index.js";
import {
  loadBuildingContent,
  loadRegionLocalityContent,
  loadSettlementContent,
  loadTransportProfileContent,
  type BuildingContentRecord,
  type RegionLocalityContentRecord,
  type SettlementContentRecord,
  type TransportVehicleProfileRecord
} from "./content.js";
import { resolveResourceFamilies } from "./resource-taxonomy.js";
import { resolveSettlementResourceAccess } from "./spatial-world.js";
import { resolveCargoLoadUnits } from "./transport-runtime.js";

const OVERALL_INFRA_FACTORS: Record<string, number> = {
  rudimentary: 0.72,
  frontier: 0.86,
  established: 1,
  developed: 1.16,
  civic: 1.32,
  grand: 1.55
};

const SETTLEMENT_WORKFORCE_BASE: Record<string, number> = {
  camp: 0.5,
  citadel: 0.53,
  city: 0.61,
  estate: 0.54,
  ferry_post: 0.52,
  fort: 0.52,
  hamlet: 0.53,
  harbor_town: 0.59,
  market_town: 0.6,
  monastery: 0.5,
  outpost: 0.5,
  port_city: 0.62,
  town: 0.58,
  village: 0.55,
  waystation: 0.52
};

interface SettlementSimulationIndexes {
  settlementById: Map<string, SettlementContentRecord>;
  localityById: Map<string, RegionLocalityContentRecord>;
  vehicleById: Map<string, TransportVehicleProfileRecord>;
  buildingCatalog: BuildingContentRecord[];
}

let simulationIndexesCache: SettlementSimulationIndexes | null = null;

function roundNumber(value: number): number {
  return Number(value.toFixed(4));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getIndexes(): SettlementSimulationIndexes {
  if (!simulationIndexesCache) {
    const transportCatalog = loadTransportProfileContent()[0];
    simulationIndexesCache = {
      settlementById: new Map(loadSettlementContent().map((record) => [record.id, record])),
      localityById: new Map(loadRegionLocalityContent().map((record) => [record.id, record])),
      vehicleById: new Map((transportCatalog?.vehicleProfiles ?? []).map((record) => [record.id, record])),
      buildingCatalog: loadBuildingContent()
    };
  }
  return simulationIndexesCache;
}

function tierWeight(tier: string | undefined): number {
  switch (tier) {
    case "abundant":
      return 4;
    case "common":
      return 3;
    case "uncommon":
      return 2;
    case "rare":
      return 1;
    default:
      return 0;
  }
}

function hasUsableFamily(accessState: ReturnType<typeof resolveSettlementResourceAccess>, family: string): boolean {
  return accessState.familyAvailability.some((entry) => entry.family === family && entry.usableTier !== "absent");
}

function getUsableFamilyTier(accessState: ReturnType<typeof resolveSettlementResourceAccess>, family: string): number {
  return tierWeight(accessState.familyAvailability.find((entry) => entry.family === family)?.usableTier);
}

function normalizeLaborWeights(weights: Record<string, number>, workforcePool: number): SettlementPopulationClassState[] {
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);
  const normalized = totalWeight > 0 ? totalWeight : 1;
  return Object.entries(weights)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([classId, weight]) => ({
      classId,
      count: Math.max(0, Math.round(workforcePool * (weight / normalized))),
      share: roundNumber(weight / normalized),
      notes: []
    }));
}

function resolvePopulationProfile(settlement: SettlementContentRecord, accessState: ReturnType<typeof resolveSettlementResourceAccess>): SettlementPopulationProfileState {
  const infra = settlement.infrastructureProfile;
  const workforceBase = SETTLEMENT_WORKFORCE_BASE[settlement.settlementType] ?? 0.56;
  const workforceShare = clamp(
    workforceBase +
      infra.marketTier * 0.01 +
      infra.roadTier * 0.008 +
      infra.harborTier * 0.008 +
      (settlement.survivalModel.foodSecurity - 50) / 750 -
      settlement.survivalModel.climateBurden / 900 -
      settlement.survivalModel.hazardPressure / 1100,
    0.46,
    0.68
  );
  const workforcePopulation = Math.round(settlement.populationTotal * workforceShare);
  const dependentPopulation = Math.max(0, settlement.populationTotal - workforcePopulation);
  const civicShare = clamp(
    0.015 +
      (settlement.administrativeRole !== "none" ? 0.025 : 0) +
      infra.marketTier * 0.004 +
      (settlement.settlementType === "city" || settlement.settlementType === "port_city" ? 0.01 : 0),
    0.015,
    0.12
  );
  const militaryShare = clamp(
    0.02 +
      infra.fortificationTier * 0.012 +
      (settlement.identityTags.some((tag) => /fort|watch|border|garrison/.test(tag)) ? 0.035 : 0) +
      (settlement.purposeTags.includes("military") ? 0.02 : 0),
    0.02,
    0.2
  );

  const civicPopulation = Math.min(workforcePopulation, Math.round(workforcePopulation * civicShare));
  const militaryPopulation = Math.min(workforcePopulation - civicPopulation, Math.round(workforcePopulation * militaryShare));
  const laborPool = Math.max(0, workforcePopulation - civicPopulation - militaryPopulation);

  const weights: Record<string, number> = {
    agrarian: 1,
    extractive: 0.7,
    maritime: 0.6,
    craft: 1,
    trade: 1,
    logistics: 0.8,
    service: 1.2
  };
  const dominantRole = settlement.economicModel.dominantRole;

  if (/agri|grain|orchard|livestock|pastoral/.test(dominantRole)) {
    weights.agrarian += 4;
    weights.logistics += 0.7;
  }
  if (/mining|quarry|extract|salt|stone/.test(dominantRole)) {
    weights.extractive += 4;
    weights.logistics += 1.3;
    weights.craft += 1;
  }
  if (/fish|maritime|harbor|port|river/.test(dominantRole)) {
    weights.maritime += 4;
    weights.trade += 1.5;
    weights.logistics += 1.5;
  }
  if (/trade|market|merchant|caravan/.test(dominantRole)) {
    weights.trade += 4;
    weights.logistics += 2;
    weights.service += 0.8;
  }
  if (/timber|wood/.test(dominantRole)) {
    weights.extractive += 1.8;
    weights.craft += 1.8;
  }
  if (/craft|smith|scribe|textile|potter|glass/.test(dominantRole)) {
    weights.craft += 3.5;
  }
  if (hasUsableFamily(accessState, "grain") || hasUsableFamily(accessState, "vegetables") || hasUsableFamily(accessState, "fruit")) {
    weights.agrarian += Math.max(getUsableFamilyTier(accessState, "grain"), getUsableFamilyTier(accessState, "vegetables"), getUsableFamilyTier(accessState, "fruit")) * 0.8;
  }
  if (hasUsableFamily(accessState, "minerals")) {
    weights.extractive += getUsableFamilyTier(accessState, "minerals") * 0.9;
  }
  if (hasUsableFamily(accessState, "fish") || hasUsableFamily(accessState, "maritime_goods")) {
    weights.maritime += Math.max(getUsableFamilyTier(accessState, "fish"), getUsableFamilyTier(accessState, "maritime_goods")) * 0.9;
  }
  if (hasUsableFamily(accessState, "wood")) {
    weights.craft += getUsableFamilyTier(accessState, "wood") * 0.7;
    weights.extractive += getUsableFamilyTier(accessState, "wood") * 0.5;
  }
  if (infra.marketTier >= 2) {
    weights.trade += 1.1;
    weights.service += 0.6;
  }
  if (infra.roadTier >= 2 || settlement.tradeDependencyProfile.routeAccess.caravan >= 0.7) {
    weights.logistics += 1;
  }
  if (infra.harborTier >= 2 || settlement.tradeDependencyProfile.routeAccess.coastal >= 0.7) {
    weights.maritime += 1;
    weights.trade += 0.7;
  }

  const laborClasses = normalizeLaborWeights(weights, laborPool).map((entry) => ({
    ...entry,
    notes: [
      entry.classId === "agrarian" ? "Driven by arable catchment, food security, and rural labor demand." : "",
      entry.classId === "extractive" ? "Driven by mineral, timber, salt, and frontier extraction pressure." : "",
      entry.classId === "maritime" ? "Driven by fishery access, harbor work, and river or coastal movement." : "",
      entry.classId === "trade" ? "Driven by market activity, warehousing, and merchant exchange." : "",
      entry.classId === "logistics" ? "Driven by haulage, teamsters, ferries, and caravan handling." : "",
      entry.classId === "craft" ? "Driven by workshops, refining trades, and secondary production." : "",
      entry.classId === "service" ? "Driven by daily urban support, hospitality, and household service." : ""
    ].filter(Boolean)
  }));

  return {
    settlementId: settlement.id,
    totalPopulation: settlement.populationTotal,
    workforcePopulation,
    dependentPopulation,
    civicPopulation,
    militaryPopulation,
    explanation: [
      `Workforce share ${roundNumber(workforceShare)} derived from settlement type, infrastructure, and survival burden.`,
      `Civic and military staffing vary with administration, fortification, and frontier pressure.`
    ],
    laborClasses
  };
}

function chooseAnimalId(settlement: SettlementContentRecord, vehicle: TransportVehicleProfileRecord, accessState: ReturnType<typeof resolveSettlementResourceAccess>): string | null {
  if (vehicle.propulsionType === "human" || vehicle.propulsionType === "crew") {
    return null;
  }
  if (vehicle.id === "vehicle.pack_train") {
    if (settlement.economicModel.dominantRole.includes("trade")) {
      return "animal.horse";
    }
    return settlement.populationTotal < 1200 ? "animal.donkey" : "animal.mule";
  }
  if (vehicle.requiredHarnessId === "harness.heavy_yoke") {
    return hasUsableFamily(accessState, "grain") || settlement.economicModel.dominantRole.includes("agr") ? "animal.ox" : "animal.mule";
  }
  if (vehicle.requiredHarnessId === "harness.caravan_team") {
    if (vehicle.id === "vehicle.freight_wagon" || vehicle.id === "vehicle.heavy_wagon") {
      return hasUsableFamily(accessState, "grain") ? "animal.ox" : "animal.mule";
    }
    return settlement.economicModel.dominantRole.includes("trade") || settlement.economicModel.dominantRole.includes("port") ? "animal.horse" : "animal.mule";
  }
  if (vehicle.requiredHarnessId === "harness.light_draft") {
    return settlement.populationTotal < 1200 ? "animal.donkey" : settlement.economicModel.dominantRole.includes("trade") ? "animal.horse" : "animal.mule";
  }
  return null;
}

function addTransportOption(
  options: SettlementTransportAvailabilityState[],
  vehicle: TransportVehicleProfileRecord | undefined,
  count: number,
  settlement: SettlementContentRecord,
  accessState: ReturnType<typeof resolveSettlementResourceAccess>,
  note: string
) {
  if (!vehicle || count <= 0) {
    return;
  }
  const animalId = chooseAnimalId(settlement, vehicle, accessState);
  options.push({
    vehicleId: vehicle.id,
    harnessId: vehicle.requiredHarnessId,
    animalId,
    animalCount: vehicle.optimalAnimals,
    crewSize: vehicle.crewRequired,
    availableUnits: count,
    cargoCapacityUnits: vehicle.cargoCapacityUnits,
    minimumFillRatio: vehicle.minimumFillRatio,
    notes: [note, vehicle.notes]
  });
}

function resolveTransportAvailability(
  settlement: SettlementContentRecord,
  accessState: ReturnType<typeof resolveSettlementResourceAccess>,
  population: SettlementPopulationProfileState
): SettlementTransportAvailabilityState[] {
  const indexes = getIndexes();
  const infra = settlement.infrastructureProfile;
  const tradePopulation = population.laborClasses.find((entry) => entry.classId === "trade")?.count ?? 0;
  const logisticsPopulation = population.laborClasses.find((entry) => entry.classId === "logistics")?.count ?? 0;
  const extractivePopulation = population.laborClasses.find((entry) => entry.classId === "extractive")?.count ?? 0;
  const maritimePopulation = population.laborClasses.find((entry) => entry.classId === "maritime")?.count ?? 0;
  const freightWorkers = logisticsPopulation + Math.round(tradePopulation * 0.45) + Math.round(extractivePopulation * 0.2);
  const options: SettlementTransportAvailabilityState[] = [];
  const roadReady = infra.roadTier >= 1 || settlement.tradeDependencyProfile.routeAccess.road >= 0.55 || settlement.tradeDependencyProfile.routeAccess.caravan >= 0.6;
  const wagonReady = infra.roadTier >= 2 || settlement.tradeDependencyProfile.routeAccess.caravan >= 0.7;
  const waterReady = infra.waterTier >= 1 || settlement.tradeDependencyProfile.routeAccess.river >= 0.6;
  const harborReady = infra.harborTier >= 1 || settlement.tradeDependencyProfile.routeAccess.coastal >= 0.6 || settlement.tradeDependencyProfile.routeAccess.seaLane >= 0.6;
  const hasDraftSupport = hasUsableFamily(accessState, "livestock") || hasUsableFamily(accessState, "grain") || settlement.economicModel.secondaryRoles.some((role) => /livestock|pastoral/.test(role));
  const hasFishery = hasUsableFamily(accessState, "fish");

  if (roadReady) {
    addTransportOption(options, indexes.vehicleById.get("vehicle.hand_cart"), Math.max(1, Math.floor(settlement.populationTotal / 2500)), settlement, accessState, "Basic human freight is available on most settled roads.");
    addTransportOption(options, indexes.vehicleById.get("vehicle.push_cart"), Math.max(0, Math.floor(settlement.populationTotal / 4000) + infra.marketTier - 1), settlement, accessState, "Market-side hauling supports push-cart movement.");
  }
  if (hasDraftSupport && settlement.tradeDependencyProfile.routeAccess.caravan >= 0.55) {
    addTransportOption(options, indexes.vehicleById.get("vehicle.pack_train"), Math.max(0, Math.floor(freightWorkers / 2200) + 1), settlement, accessState, "Pack-train handling is available for rough-country or narrow-corridor freight.");
  }
  if (hasDraftSupport && roadReady) {
    addTransportOption(options, indexes.vehicleById.get("vehicle.light_cart"), Math.max(0, Math.floor(freightWorkers / 1800) + 1), settlement, accessState, "Light draft haulage is supported by local roads and animal husbandry.");
    addTransportOption(options, indexes.vehicleById.get("vehicle.cart"), Math.max(0, Math.floor(freightWorkers / 2400) + infra.marketTier), settlement, accessState, "Standard carts support village-to-market freight.");
    addTransportOption(options, indexes.vehicleById.get("vehicle.heavy_cart"), Math.max(0, Math.floor((freightWorkers + extractivePopulation) / 3200)), settlement, accessState, "Dense-load carts support quarry, timber, and ore hauling.");
  }
  if (hasDraftSupport && wagonReady) {
    addTransportOption(options, indexes.vehicleById.get("vehicle.light_wagon"), Math.max(0, Math.floor((freightWorkers + tradePopulation) / 4200)), settlement, accessState, "Maintained roads support light wagon traffic.");
    addTransportOption(options, indexes.vehicleById.get("vehicle.wagon"), Math.max(0, Math.floor((freightWorkers + tradePopulation) / 5200)), settlement, accessState, "Standard wagon freight is available on established corridors.");
    addTransportOption(options, indexes.vehicleById.get("vehicle.heavy_wagon"), Math.max(0, Math.floor((freightWorkers + extractivePopulation) / 7000)), settlement, accessState, "Heavy wagon traffic appears where roads and dense freight justify it.");
  }
  if (hasDraftSupport && wagonReady && infra.marketTier >= 1) {
    addTransportOption(options, indexes.vehicleById.get("vehicle.caravan_wagon"), Math.max(0, Math.floor((freightWorkers + tradePopulation) / 8500)), settlement, accessState, "Regional caravan service emerges from trade access, storage, and draft capacity.");
  }
  if (hasDraftSupport && infra.roadTier >= 3 && infra.marketTier >= 2) {
    addTransportOption(options, indexes.vehicleById.get("vehicle.freight_wagon"), Math.max(0, Math.floor((freightWorkers + extractivePopulation) / 12000)), settlement, accessState, "Heavy corridor freight supports dedicated freight wagons.");
  }
  if (hasDraftSupport && infra.fortificationTier >= 2) {
    addTransportOption(options, indexes.vehicleById.get("vehicle.military_supply_wagon"), Math.max(0, Math.floor((population.militaryPopulation + logisticsPopulation) / 2600)), settlement, accessState, "Fortified settlements maintain dedicated military supply wagons.");
  }

  if (waterReady) {
    addTransportOption(options, indexes.vehicleById.get("vehicle.small_boat"), Math.max(0, Math.floor((maritimePopulation + logisticsPopulation) / 1800) + 1), settlement, accessState, "River and water access support small local craft.");
    addTransportOption(options, indexes.vehicleById.get("vehicle.ferry_boat"), Math.max(0, infra.waterTier - 1 + Math.floor(settlement.tradeDependencyProfile.routeAccess.river)), settlement, accessState, "Managed crossings support ferry craft.");
    if (infra.waterTier >= 2) {
      addTransportOption(options, indexes.vehicleById.get("vehicle.barge"), Math.max(0, Math.floor((logisticsPopulation + tradePopulation) / 6000)), settlement, accessState, "Bulk inland freight supports barges on navigable waterways.");
      addTransportOption(options, indexes.vehicleById.get("vehicle.tow_barge"), Math.max(0, Math.floor((logisticsPopulation + extractivePopulation) / 10000)), settlement, accessState, "Large river settlements can support slow high-volume tow barges.");
    }
  }

  if (harborReady) {
    if (hasFishery) {
      addTransportOption(options, indexes.vehicleById.get("vehicle.fishing_skiff"), Math.max(0, Math.floor(maritimePopulation / 1600) + 1), settlement, accessState, "Near-shore fishing and harbor work support skiffs.");
      addTransportOption(options, indexes.vehicleById.get("vehicle.fishing_vessel"), Math.max(0, Math.floor(maritimePopulation / 3200)), settlement, accessState, "Harbor fishing fleets emerge from maritime labor and fishery access.");
    }
    if (infra.harborTier >= 2) {
      addTransportOption(options, indexes.vehicleById.get("vehicle.coastal_vessel"), Math.max(0, Math.floor((tradePopulation + logisticsPopulation) / 7000)), settlement, accessState, "Smaller merchant hulls appear where harbor and market systems are established.");
      addTransportOption(options, indexes.vehicleById.get("vehicle.fast_courier_vessel"), Math.max(0, Math.floor((tradePopulation + population.civicPopulation) / 12000)), settlement, accessState, "Administrative and merchant traffic support fast courier sail.");
      addTransportOption(options, indexes.vehicleById.get("vehicle.coastal_cargo_ship"), Math.max(0, Math.floor((tradePopulation + logisticsPopulation) / 13000)), settlement, accessState, "Coastal cargo hulls appear in larger harbor economies.");
    }
    if (infra.harborTier >= 3 && infra.marketTier >= 2) {
      addTransportOption(options, indexes.vehicleById.get("vehicle.trade_ship"), Math.max(0, Math.floor((tradePopulation + logisticsPopulation) / 22000)), settlement, accessState, "Major ports support dedicated long-haul trade ships.");
    }
    if (infra.harborTier >= 2 && infra.fortificationTier >= 2) {
      addTransportOption(options, indexes.vehicleById.get("vehicle.military_vessel"), Math.max(0, Math.floor(population.militaryPopulation / 5000)), settlement, accessState, "Defended harbors maintain patrol and escort vessels.");
    }
  }

  return options.filter((entry) => entry.availableUnits > 0);
}

function uniqueGoods(goods: string[]): string[] {
  return [...new Set(goods.filter((good) => good.length > 0))].sort((left, right) => left.localeCompare(right));
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRatio(...parts: Array<string | number>): number {
  return (hashString(parts.join("|")) % 10000) / 9999;
}

function labelFromId(value: string): string {
  const segments = value.split(".");
  const tail = segments[segments.length - 1] ?? value;
  return tail
    .split("_")
    .filter((segment) => segment.length > 0)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join(" ");
}

function resolveRouteConnectivityBand(settlement: SettlementContentRecord): SettlementDevelopmentProfileState["routeConnectivityBand"] {
  const strongestAccess = Math.max(
    settlement.tradeDependencyProfile.routeAccess.road,
    settlement.tradeDependencyProfile.routeAccess.river,
    settlement.tradeDependencyProfile.routeAccess.coastal,
    settlement.tradeDependencyProfile.routeAccess.caravan,
    settlement.tradeDependencyProfile.routeAccess.pass,
    settlement.tradeDependencyProfile.routeAccess.seaLane
  );
  if (strongestAccess >= 0.72 || settlement.infrastructureProfile.harborTier >= 2 || settlement.infrastructureProfile.roadTier >= 2) {
    return "high";
  }
  if (strongestAccess >= 0.48 || settlement.infrastructureProfile.waterTier >= 1 || settlement.infrastructureProfile.marketTier >= 1) {
    return "moderate";
  }
  return "low";
}

function resolveTradeRole(settlement: SettlementContentRecord): SettlementDevelopmentProfileState["tradeRole"] {
  if (settlement.tradeDependencyProfile.exportBias >= settlement.tradeDependencyProfile.importBias + 0.12) {
    return "exporter";
  }
  if (settlement.tradeDependencyProfile.importBias >= settlement.tradeDependencyProfile.exportBias + 0.12) {
    return "importer";
  }
  return "mixed";
}

function resolveDevelopmentLevel(settlement: SettlementContentRecord): SettlementDevelopmentProfileState["developmentLevel"] {
  const infraWeight =
    settlement.infrastructureProfile.marketTier * 1.1 +
    settlement.infrastructureProfile.roadTier * 0.9 +
    settlement.infrastructureProfile.waterTier * 0.45 +
    settlement.infrastructureProfile.harborTier * 0.8 +
    settlement.infrastructureProfile.fortificationTier * 0.55;
  const populationWeight =
    settlement.populationTotal >= 25000 ? 3 : settlement.populationTotal >= 8000 ? 2 : settlement.populationTotal >= 2200 ? 1 : 0;
  const difficultyPenalty = settlement.survivalModel.infrastructureDifficulty >= 65 ? 0.7 : settlement.survivalModel.infrastructureDifficulty >= 45 ? 0.35 : 0;
  const score = infraWeight + populationWeight - difficultyPenalty;
  if (score >= 5.4 || settlement.infrastructureProfile.overallLevel === "civic" || settlement.infrastructureProfile.overallLevel === "grand") {
    return "high";
  }
  if (score >= 2.7 || settlement.infrastructureProfile.overallLevel === "developed" || settlement.infrastructureProfile.overallLevel === "established") {
    return "moderate";
  }
  return "low";
}

function businessIndustryLabel(businessType: string): string {
  const mapping: Record<string, string> = {
    barracks_and_supply_depots: "military supply",
    construction_yards: "construction",
    farm_estates: "agriculture",
    fishing_docks: "fishing",
    gathering_and_trapping: "hunting and gathering",
    guild_halls: "guild administration",
    herb_and_dye_houses: "herbs and dyes",
    inns_and_taprooms: "hospitality",
    logging_yards: "logging",
    market_warehouses: "trade warehousing",
    mills_and_granaries: "milling",
    mine_works: "mining",
    pasture_runs: "livestock",
    sanitation_and_soapworks: "sanitation",
    scribal_houses: "administration",
    shadow_markets: "shadow trade",
    shipyards_and_roperies: "maritime outfitting",
    smelters_and_toolshops: "metalworking",
    teamster_yards: "haulage",
    textile_houses: "textiles",
    woodworking_yards: "woodworking"
  };
  return mapping[businessType] ?? labelFromId(businessType).toLowerCase();
}

function resolveSettlementProfile(
  settlement: SettlementContentRecord,
  locality: RegionLocalityContentRecord | undefined,
  accessState: ReturnType<typeof resolveSettlementResourceAccess>,
  businesses: SettlementBusinessState[]
): SettlementDevelopmentProfileState {
  const businessLabels = businesses
    .slice()
    .sort((left, right) => right.workforceCount - left.workforceCount || left.businessType.localeCompare(right.businessType))
    .map((business) => businessIndustryLabel(business.businessType));
  const primaryIndustries = uniqueGoods([
    settlement.economicModel.dominantRole,
    ...(locality?.dominantIndustries ?? []).slice(0, 2),
    ...businessLabels.slice(0, 3)
  ]).slice(0, 3);
  const secondaryIndustries = uniqueGoods([
    ...settlement.economicModel.secondaryRoles,
    ...(locality?.dominantIndustries ?? []).slice(2),
    ...businessLabels.slice(1, 8)
  ])
    .filter((label) => !primaryIndustries.includes(label))
    .slice(0, 5);
  const environmentalConstraints = uniqueGoods([
    locality ? `locality:${locality.localityType}` : "",
    `terrain:${settlement.terrainContext}`,
    settlement.tradeDependencyProfile.routeAccess.coastal >= 0.55 ? "coastal exposure" : "",
    settlement.tradeDependencyProfile.routeAccess.river >= 0.55 ? "river access" : "",
    settlement.survivalModel.waterSecurity < 55 ? "water stress" : "",
    settlement.survivalModel.climateBurden >= 55 ? "climate burden" : "",
    settlement.survivalModel.hazardPressure >= 55 ? "hazard pressure" : "",
    settlement.survivalModel.infrastructureDifficulty >= 55 ? "difficult ground" : "",
    accessState.explanation.blockedFamilies.length > 0 ? `blocked:${accessState.explanation.blockedFamilies[0]}` : ""
  ]).slice(0, 5);
  const routeConnectivityBand = resolveRouteConnectivityBand(settlement);
  const tradeRole = resolveTradeRole(settlement);
  const developmentLevel = resolveDevelopmentLevel(settlement);

  return {
    settlementId: settlement.id,
    settlementType: settlement.settlementType,
    primaryIndustries,
    secondaryIndustries,
    environmentalConstraints,
    tradeRole,
    developmentLevel,
    routeConnectivityBand,
    explanation: [
      `Primary industries follow dominant role ${settlement.economicModel.dominantRole}, locality industry cues, and the heaviest derived businesses.`,
      `Development level ${developmentLevel} comes from population scale, infrastructure tiers, and geography burden.`,
      `Trade role ${tradeRole} comes from import/export bias rather than hardcoded settlement classes.`
    ]
  };
}

function resolveDistrictTypes(
  settlement: SettlementContentRecord,
  businesses: SettlementBusinessState[],
  profile: SettlementDevelopmentProfileState,
  population: SettlementPopulationProfileState,
  infrastructure: SettlementInfrastructureRuntimeState
): Array<SettlementDistrictState["districtType"]> {
  const districtTypes: Array<SettlementDistrictState["districtType"]> = ["residential_low"];
  const businessCategories = new Set(businesses.map((business) => business.category));

  if (settlement.infrastructureProfile.marketTier >= 1 || settlement.populationTotal >= 900) {
    districtTypes.push("central_market");
  }
  if (settlement.populationTotal >= 1800 || profile.developmentLevel !== "low") {
    districtTypes.push("residential_medium");
  }
  if (settlement.populationTotal >= 12000 || settlement.settlementType === "city" || settlement.settlementType === "port_city") {
    districtTypes.push("residential_high");
  }
  if (businessCategories.has("extractive") || businessCategories.has("craft") || businessCategories.has("construction") || businessCategories.has("maritime")) {
    districtTypes.push("industrial_production");
  }
  if (businessCategories.has("trade") || businessCategories.has("logistics") || settlement.infrastructureProfile.marketTier >= 1) {
    districtTypes.push("storage_trade");
  }
  if (settlement.infrastructureProfile.fortificationTier >= 1 || population.militaryPopulation > 80) {
    districtTypes.push("military");
  }
  if (settlement.administrativeRole !== "none" || businessCategories.has("civic") || population.civicPopulation > 50) {
    districtTypes.push("civic_religious");
  }
  if (infrastructure.corruptionPressure >= 0.9 || settlement.populationTotal >= 9000) {
    districtTypes.push("slums_fringe");
  }
  if (
    businessCategories.has("agrarian") ||
    businessCategories.has("livestock") ||
    settlement.settlementType === "village" ||
    settlement.settlementType === "estate" ||
    settlement.settlementType === "hamlet"
  ) {
    districtTypes.push("rural_edge");
  }

  return [...new Set(districtTypes)];
}

function resolveDistrictShape(
  districtType: SettlementDistrictState["districtType"],
  profile: SettlementDevelopmentProfileState,
  settlement: SettlementContentRecord
): Pick<SettlementDistrictState, "densityClass" | "landValue" | "infrastructureLevel" | "terrainConstraints"> {
  const highDevelopment = profile.developmentLevel === "high";
  switch (districtType) {
    case "central_market":
      return {
        densityClass: highDevelopment ? "high" : "medium",
        landValue: "high",
        infrastructureLevel: highDevelopment ? "high" : "moderate",
        terrainConstraints: uniqueGoods(["market streets", settlement.tradeDependencyProfile.routeAccess.river >= 0.55 ? "quay access" : ""])
      };
    case "residential_medium":
      return {
        densityClass: "medium",
        landValue: highDevelopment ? "high" : "moderate",
        infrastructureLevel: profile.developmentLevel === "low" ? "low" : "moderate",
        terrainConstraints: uniqueGoods([settlement.terrainContext])
      };
    case "residential_high":
      return {
        densityClass: "high",
        landValue: "high",
        infrastructureLevel: highDevelopment ? "high" : "moderate",
        terrainConstraints: uniqueGoods(["dense streets", settlement.terrainContext])
      };
    case "industrial_production":
      return {
        densityClass: "medium",
        landValue: "moderate",
        infrastructureLevel: profile.developmentLevel === "low" ? "low" : "moderate",
        terrainConstraints: uniqueGoods(["haulage access", settlement.tradeDependencyProfile.routeAccess.coastal >= 0.55 ? "waterfront sidings" : ""])
      };
    case "storage_trade":
      return {
        densityClass: "medium",
        landValue: highDevelopment ? "high" : "moderate",
        infrastructureLevel: profile.developmentLevel === "low" ? "moderate" : "high",
        terrainConstraints: uniqueGoods(["wagon access", settlement.tradeDependencyProfile.routeAccess.coastal >= 0.55 ? "dock frontage" : ""])
      };
    case "military":
      return {
        densityClass: "medium",
        landValue: "moderate",
        infrastructureLevel: settlement.infrastructureProfile.fortificationTier >= 2 ? "high" : "moderate",
        terrainConstraints: uniqueGoods(["defensive lines", settlement.tradeDependencyProfile.routeAccess.pass >= 0.55 ? "gate control" : ""])
      };
    case "civic_religious":
      return {
        densityClass: "medium",
        landValue: "high",
        infrastructureLevel: profile.developmentLevel === "low" ? "moderate" : "high",
        terrainConstraints: uniqueGoods(["public square", settlement.terrainContext])
      };
    case "slums_fringe":
      return {
        densityClass: "high",
        landValue: "low",
        infrastructureLevel: "low",
        terrainConstraints: uniqueGoods(["edge ground", settlement.tradeDependencyProfile.routeAccess.road >= 0.55 ? "gate sprawl" : ""])
      };
    case "rural_edge":
      return {
        densityClass: "low",
        landValue: "low",
        infrastructureLevel: profile.developmentLevel === "high" ? "moderate" : "low",
        terrainConstraints: uniqueGoods(["field access", settlement.tradeDependencyProfile.routeAccess.river >= 0.55 ? "water meadows" : settlement.terrainContext])
      };
    case "residential_low":
    default:
      return {
        densityClass: "low",
        landValue: profile.developmentLevel === "high" ? "moderate" : "low",
        infrastructureLevel: profile.developmentLevel === "low" ? "low" : "moderate",
        terrainConstraints: uniqueGoods([settlement.terrainContext])
      };
  }
}

function resolveDistrictPlotCapacity(
  districtType: SettlementDistrictState["districtType"],
  settlement: SettlementContentRecord,
  buildings: SettlementBuildingState[]
): number {
  const totalBuildingInstances = buildings.reduce((sum, building) => sum + building.instanceCount, 0);
  const populationFactor =
    settlement.populationTotal >= 30000 ? 8 : settlement.populationTotal >= 10000 ? 6 : settlement.populationTotal >= 2500 ? 4 : 2;
  const categoryBase: Record<SettlementDistrictState["districtType"], number> = {
    central_market: 6,
    residential_low: 7,
    residential_medium: 7,
    residential_high: 8,
    industrial_production: 6,
    storage_trade: 5,
    military: 4,
    civic_religious: 4,
    slums_fringe: 5,
    rural_edge: 6
  };
  const totalBase = Math.max(1, Object.keys(categoryBase).length);
  return Math.max(
    4,
    Math.round(categoryBase[districtType] + populationFactor + totalBuildingInstances / totalBase * (districtType === "residential_low" || districtType === "rural_edge" ? 0.45 : 0.28))
  );
}

function assignPlotStateCounts(
  districtType: SettlementDistrictState["districtType"],
  plotCapacity: number,
  developmentLevel: SettlementDevelopmentProfileState["developmentLevel"]
): { developed: number; underdeveloped: number; vacant: number; degraded: number } {
  let vacantRatio = developmentLevel === "high" ? 0.12 : developmentLevel === "moderate" ? 0.15 : 0.18;
  let degradedRatio = developmentLevel === "high" ? 0.12 : developmentLevel === "moderate" ? 0.16 : 0.2;
  let underdevelopedRatio = developmentLevel === "high" ? 0.16 : developmentLevel === "moderate" ? 0.18 : 0.2;

  if (districtType === "slums_fringe") {
    vacantRatio += 0.04;
    degradedRatio += 0.08;
  } else if (districtType === "military" || districtType === "civic_religious") {
    vacantRatio -= 0.03;
    degradedRatio -= 0.03;
  }

  let vacant = Math.max(1, Math.round(plotCapacity * vacantRatio));
  let degraded = Math.max(1, Math.round(plotCapacity * degradedRatio));
  let underdeveloped = Math.max(1, Math.round(plotCapacity * underdevelopedRatio));
  let developed = plotCapacity - vacant - degraded - underdeveloped;

  while (developed < 1) {
    if (underdeveloped > 1) {
      underdeveloped -= 1;
    } else if (vacant > 1) {
      vacant -= 1;
    } else if (degraded > 1) {
      degraded -= 1;
    } else {
      break;
    }
    developed = plotCapacity - vacant - degraded - underdeveloped;
  }

  return { developed, underdeveloped, vacant, degraded };
}

function resolvePlotTags(
  settlement: SettlementContentRecord,
  districtType: SettlementDistrictState["districtType"],
  plotIndex: number,
  plotCapacity: number
): string[] {
  const tags = new Set<string>();
  if (districtType === "central_market" || districtType === "storage_trade") {
    tags.add("near_market");
  }
  if (
    settlement.tradeDependencyProfile.routeAccess.river >= 0.55 ||
    settlement.tradeDependencyProfile.routeAccess.coastal >= 0.55 ||
    settlement.infrastructureProfile.waterTier >= 1
  ) {
    if (districtType === "storage_trade" || districtType === "industrial_production" || districtType === "rural_edge" || plotIndex % 3 === 0) {
      tags.add("near_water");
    }
  }
  if (districtType === "military" || districtType === "storage_trade" || plotIndex >= Math.floor(plotCapacity * 0.8)) {
    tags.add("near_gate");
  }
  if (plotIndex >= Math.floor(plotCapacity * 0.7)) {
    tags.add("outer_edge");
  }
  if (/upland|cliff|ridge|hill|pass|plateau/.test(settlement.terrainContext)) {
    tags.add("high_ground");
  }
  if (/delta|marsh|basin|flood|river|mire/.test(settlement.terrainContext)) {
    tags.add("low_ground");
  }
  return [...tags];
}

function resolveDistrictsAndPlots(
  settlement: SettlementContentRecord,
  profile: SettlementDevelopmentProfileState,
  population: SettlementPopulationProfileState,
  infrastructure: SettlementInfrastructureRuntimeState,
  businesses: SettlementBusinessState[],
  buildings: SettlementBuildingState[]
): {
  districts: SettlementDistrictState[];
  plots: SettlementPlotState[];
} {
  const districtTypes = resolveDistrictTypes(settlement, businesses, profile, population, infrastructure);
  const districts: SettlementDistrictState[] = [];
  const plots: SettlementPlotState[] = [];

  for (const districtType of districtTypes) {
    const districtId = `${settlement.id}.${districtType}`;
    const shape = resolveDistrictShape(districtType, profile, settlement);
    const plotCapacity = resolveDistrictPlotCapacity(districtType, settlement, buildings);
    const counts = assignPlotStateCounts(districtType, plotCapacity, profile.developmentLevel);
    const plotStates: SettlementPlotState["state"][] = [
      ...Array.from({ length: counts.developed }, () => "developed" as const),
      ...Array.from({ length: counts.underdeveloped }, () => "underdeveloped" as const),
      ...Array.from({ length: counts.vacant }, () => "vacant" as const),
      ...Array.from({ length: counts.degraded }, (_, index) => (index % 4 === 0 ? "abandoned" : "dilapidated") as const)
    ].slice(0, plotCapacity);

    const districtPlots = Array.from({ length: plotCapacity }, (_, index) => {
      const plotId = `${districtId}.plot_${String(index + 1).padStart(2, "0")}`;
      const plotState =
        plotStates
          .slice()
          .sort((left, right) => seededRatio(plotId, left) - seededRatio(plotId, right))[0] ??
        plotStates[index] ??
        "developed";
      if (plotStates.length > 0) {
        const stateIndex = plotStates.findIndex((entry) => entry === plotState);
        if (stateIndex >= 0) {
          plotStates.splice(stateIndex, 1);
        }
      }
      return {
        plotId,
        settlementId: settlement.id,
        districtId,
        state: plotState,
        tags: resolvePlotTags(settlement, districtType, index, plotCapacity),
        landValue: shape.landValue,
        assignedBuildingInstanceId: null,
        developmentDiscountFactor:
          plotState === "vacant" ? 0.82 : plotState === "underdeveloped" ? 0.74 : plotState === "dilapidated" ? 0.58 : plotState === "abandoned" ? 0.42 : 1,
        notes: [
          plotState === "vacant"
            ? "Reserved but not yet developed, leaving growth headroom and speculative frontage."
            : plotState === "underdeveloped"
              ? "Occupied lightly, with room for infill or upgraded construction."
              : plotState === "dilapidated" || plotState === "abandoned"
                ? "Discounted parcel carrying structural wear, deferred maintenance, or abandonment."
                : "Actively developed parcel supporting current settlement activity."
        ]
      };
    });

    plots.push(...districtPlots);
    districts.push({
      districtId,
      settlementId: settlement.id,
      districtType,
      densityClass: shape.densityClass,
      landValue: shape.landValue,
      terrainConstraints: shape.terrainConstraints,
      infrastructureLevel: shape.infrastructureLevel,
      plotCapacity,
      developedPlots: districtPlots.filter((plot) => plot.state === "developed").length,
      underdevelopedPlots: districtPlots.filter((plot) => plot.state === "underdeveloped").length,
      vacantPlots: districtPlots.filter((plot) => plot.state === "vacant").length,
      degradedPlots: districtPlots.filter((plot) => plot.state === "dilapidated" || plot.state === "abandoned").length,
      plotIds: districtPlots.map((plot) => plot.plotId),
      notes: [
        `${districtType} exists because of settlement scale, role, and infrastructure thresholds.`,
        "Each district retains both vacant and degraded parcels so the initial state is not artificially full or pristine."
      ]
    });
  }

  return {
    districts: districts.sort((left, right) => left.districtId.localeCompare(right.districtId)),
    plots: plots.sort((left, right) => left.plotId.localeCompare(right.plotId))
  };
}

function preferredDistrictTypesForBuilding(category: string): SettlementDistrictState["districtType"][] {
  switch (category) {
    case "agrarian":
      return ["rural_edge", "residential_low", "storage_trade"];
    case "civic":
      return ["civic_religious", "central_market", "residential_medium"];
    case "extractive":
      return ["industrial_production", "rural_edge", "storage_trade"];
    case "industrial":
      return ["industrial_production", "storage_trade", "residential_medium"];
    case "maritime":
      return ["storage_trade", "industrial_production", "central_market"];
    case "military":
      return ["military", "storage_trade", "civic_religious"];
    case "service":
      return ["central_market", "residential_medium", "residential_low"];
    case "hospitality":
      return ["central_market", "residential_medium", "storage_trade"];
    case "storage":
      return ["storage_trade", "central_market", "rural_edge"];
    default:
      return ["residential_low", "residential_medium", "central_market"];
  }
}

function resolveBuildingMaterialRequirements(category: string, conditionDeficit: number): SettlementRepairMaterialState[] {
  const scale = clamp(conditionDeficit, 0.05, 0.6);
  const requirements: SettlementRepairMaterialState[] = [];
  const addRequirement = (itemKey: string, quantity: number) => {
    requirements.push({
      itemKey,
      quantity: roundNumber(Math.max(1, quantity * (0.8 + scale * 1.7)))
    });
  };

  switch (category) {
    case "agrarian":
      addRequirement("plank", 3);
      addRequirement("nail", 8);
      addRequirement("rope", 1);
      break;
    case "civic":
    case "military":
      addRequirement("worked_stone", 4);
      addRequirement("timber_beam", 2);
      addRequirement("iron_ingot", 1);
      break;
    case "extractive":
    case "industrial":
      addRequirement("timber_beam", 2);
      addRequirement("nail", 10);
      addRequirement("iron_ingot", 1);
      break;
    case "maritime":
      addRequirement("timber_beam", 2);
      addRequirement("rope", 1);
      addRequirement("resin_pitch", 1);
      addRequirement("nail", 8);
      break;
    case "storage":
      addRequirement("plank", 2);
      addRequirement("nail", 6);
      addRequirement("worked_stone", 2);
      break;
    case "hospitality":
    case "service":
    default:
      addRequirement("plank", 2);
      addRequirement("nail", 5);
      addRequirement("worked_stone", 1);
      break;
  }

  return requirements;
}

function resolveAssignedTrades(category: string): string[] {
  switch (category) {
    case "civic":
    case "military":
      return ["trade.mason", "trade.carpenter", "trade.blacksmith"];
    case "extractive":
    case "industrial":
      return ["trade.blacksmith", "trade.carpenter"];
    case "maritime":
      return ["trade.carpenter", "trade.blacksmith"];
    case "agrarian":
    case "storage":
      return ["trade.carpenter"];
    default:
      return ["trade.carpenter", "trade.mason"];
  }
}

function getRouteModeAccess(settlement: SettlementContentRecord, routeMode: string): number {
  switch (routeMode) {
    case "road":
      return settlement.tradeDependencyProfile.routeAccess.road;
    case "river":
      return settlement.tradeDependencyProfile.routeAccess.river;
    case "coastal":
      return settlement.tradeDependencyProfile.routeAccess.coastal;
    case "pack":
      return Math.max(settlement.tradeDependencyProfile.routeAccess.caravan, settlement.tradeDependencyProfile.routeAccess.pass);
    case "sea_lane":
      return settlement.tradeDependencyProfile.routeAccess.seaLane;
    case "canal":
      return settlement.tradeDependencyProfile.routeAccess.river;
    default:
      return 0;
  }
}

function meetsBuildingInfrastructure(record: BuildingContentRecord, settlement: SettlementContentRecord): boolean {
  return (
    settlement.infrastructureProfile.roadTier >= record.requiredInfrastructure.roadTier &&
    settlement.infrastructureProfile.waterTier >= record.requiredInfrastructure.waterTier &&
    settlement.infrastructureProfile.harborTier >= record.requiredInfrastructure.harborTier &&
    settlement.infrastructureProfile.marketTier >= record.requiredInfrastructure.marketTier &&
    settlement.infrastructureProfile.fortificationTier >= record.requiredInfrastructure.fortificationTier
  );
}

function meetsBuildingPlaceability(
  record: BuildingContentRecord,
  settlement: SettlementContentRecord,
  locality: RegionLocalityContentRecord | undefined
): boolean {
  if (!record.compatibleSettlementTypes.includes(settlement.settlementType)) {
    return false;
  }
  if (!record.placeability.supportedSiteClasses.includes(settlement.siteClass)) {
    return false;
  }
  if (
    record.placeability.allowedTerrainContexts.length > 0 &&
    !record.placeability.allowedTerrainContexts.includes(settlement.terrainContext) &&
    !record.placeability.allowedTerrainContexts.includes(locality?.localityType ?? "")
  ) {
    return false;
  }

  const routeAccess = settlement.tradeDependencyProfile.routeAccess;
  const hasWaterAccess = settlement.infrastructureProfile.waterTier >= 1 || routeAccess.river >= 0.55 || routeAccess.coastal >= 0.55;
  const hasCoastalAccess = settlement.infrastructureProfile.harborTier >= 1 || routeAccess.coastal >= 0.55 || routeAccess.seaLane >= 0.55;
  const hasRiverAccess = settlement.infrastructureProfile.waterTier >= 1 || routeAccess.river >= 0.55;

  if (record.placeability.requiresWaterAccess && !hasWaterAccess) {
    return false;
  }
  if (record.placeability.requiresCoastalAccess && !hasCoastalAccess) {
    return false;
  }
  if (record.placeability.requiresRiverAccess && !hasRiverAccess) {
    return false;
  }
  for (const routeMode of record.placeability.requiredRouteModes) {
    if (getRouteModeAccess(settlement, routeMode) < 0.45) {
      return false;
    }
  }
  return true;
}

function resolveBuildingInstanceCount(
  record: BuildingContentRecord,
  settlement: SettlementContentRecord,
  matchingBusinesses: SettlementBusinessState[]
): number {
  const totalBusinessWorkforce = matchingBusinesses.reduce((sum, business) => sum + business.workforceCount, 0);
  let instanceCount = 1;
  if (record.category === "storage" || record.category === "trade" || record.category === "maritime") {
    instanceCount += settlement.infrastructureProfile.marketTier >= 2 ? 1 : 0;
    instanceCount += settlement.infrastructureProfile.harborTier >= 3 ? 1 : 0;
  }
  if (record.category === "industrial" || record.category === "extractive") {
    instanceCount += totalBusinessWorkforce >= 750 ? 1 : 0;
    instanceCount += totalBusinessWorkforce >= 1800 ? 1 : 0;
  }
  if (record.category === "civic" || record.category === "military") {
    instanceCount += settlement.populationTotal >= 12000 ? 1 : 0;
    instanceCount += settlement.populationTotal >= 35000 ? 1 : 0;
  }
  if (record.category === "hospitality" || record.category === "service") {
    instanceCount += settlement.infrastructureProfile.marketTier >= 2 ? 1 : 0;
  }
  return Math.max(1, Math.min(3, instanceCount));
}

function resolveBuildings(
  settlement: SettlementContentRecord,
  locality: RegionLocalityContentRecord | undefined,
  businesses: SettlementBusinessState[]
): SettlementBuildingState[] {
  const indexes = getIndexes();
  const businessTypes = new Set(businesses.map((business) => business.businessType));

  return indexes.buildingCatalog
    .filter((record) => record.triggerBusinessTypes.some((businessType) => businessTypes.has(businessType)))
    .filter((record) => meetsBuildingInfrastructure(record, settlement))
    .filter((record) => meetsBuildingPlaceability(record, settlement, locality))
    .map((record) => {
      const matchingBusinesses = businesses.filter((business) => record.triggerBusinessTypes.includes(business.businessType));
      const instanceCount = resolveBuildingInstanceCount(record, settlement, matchingBusinesses);
      return {
        buildingId: record.id,
        settlementId: settlement.id,
        category: record.category,
        instanceCount,
        averageCondition: 1,
        effectiveUsability: 1,
        hostedWorkplaceIds: [...record.hostedWorkplaceIds].sort((left, right) => left.localeCompare(right)),
        serviceFunctions: [...record.serviceFunctions].sort((left, right) => left.localeCompare(right)),
        storageProfiles: (record.storageProfiles ?? []).map((profile) => ({
          storageType: profile.storageType,
          capacityUnits: roundNumber(profile.capacityUnits * instanceCount),
          loadUnits: 0,
          utilization: 0,
          supportedGoods: uniqueGoods(profile.goodsFocus),
          notes: [`Raw building storage capacity from ${record.name}.`]
        })),
        assignedDistrictIds: [],
        instances: [],
        placeability: {
          supportedSiteClasses: [...record.placeability.supportedSiteClasses],
          allowedTerrainContexts: [...record.placeability.allowedTerrainContexts],
          requiresWaterAccess: record.placeability.requiresWaterAccess,
          requiresCoastalAccess: record.placeability.requiresCoastalAccess,
          requiresRiverAccess: record.placeability.requiresRiverAccess,
          requiredRouteModes: [...record.placeability.requiredRouteModes]
        },
        notes: [
          `${record.name} is justified by ${matchingBusinesses.map((business) => business.businessType).sort().join(", ")}.`,
          `Placement follows settlement type ${settlement.settlementType}, terrain context ${settlement.terrainContext}, and infrastructure thresholds.`
        ]
      };
    })
    .sort((left, right) => left.buildingId.localeCompare(right.buildingId));
}

function resolveBuildingInstances(
  settlement: SettlementContentRecord,
  districts: SettlementDistrictState[],
  plots: SettlementPlotState[],
  buildings: SettlementBuildingState[],
  profile: SettlementDevelopmentProfileState
): SettlementBuildingState[] {
  const districtsById = new Map(districts.map((district) => [district.districtId, district]));
  const assignablePlots = plots.filter((plot) => plot.state !== "vacant");
  const byDistrict = new Map<string, SettlementPlotState[]>();
  for (const plot of assignablePlots) {
    const current = byDistrict.get(plot.districtId) ?? [];
    current.push(plot);
    byDistrict.set(plot.districtId, current);
  }

  const pickPlot = (preferredDistrictIds: string[], instanceSeed: string): SettlementPlotState | null => {
    for (const districtId of preferredDistrictIds) {
      const pool = (byDistrict.get(districtId) ?? [])
        .filter((plot) => plot.assignedBuildingInstanceId === null)
        .sort((left, right) => seededRatio(instanceSeed, left.plotId) - seededRatio(instanceSeed, right.plotId));
      const chosen = pool.find((plot) => plot.state === "developed") ?? pool.find((plot) => plot.state === "underdeveloped") ?? pool[0];
      if (chosen) {
        return chosen;
      }
    }
    return (
      assignablePlots
        .filter((plot) => plot.assignedBuildingInstanceId === null)
        .sort((left, right) => seededRatio(instanceSeed, left.plotId) - seededRatio(instanceSeed, right.plotId))[0] ?? null
    );
  };

  return buildings.map((building) => {
    const preferredDistrictTypes = preferredDistrictTypesForBuilding(building.category);
    const preferredDistrictIds = districts
      .filter((district) => preferredDistrictTypes.includes(district.districtType))
      .map((district) => district.districtId);
    const instances: SettlementBuildingInstanceState[] = [];

    for (let index = 0; index < building.instanceCount; index += 1) {
      const instanceId = `${building.buildingId}.instance_${String(index + 1).padStart(2, "0")}.${settlement.id.replace(/^settlement\./, "")}`;
      const plot = pickPlot(preferredDistrictIds, instanceId);
      if (!plot) {
        continue;
      }
      plot.assignedBuildingInstanceId = instanceId;
      const district = districtsById.get(plot.districtId);
      const statePenalty =
        plot.state === "developed"
          ? 0
          : plot.state === "underdeveloped"
            ? 0.09
            : plot.state === "dilapidated"
              ? 0.27
              : plot.state === "abandoned"
                ? 0.42
                : 0;
      const developmentBoost = profile.developmentLevel === "high" ? 0.06 : profile.developmentLevel === "moderate" ? 0.02 : -0.02;
      const districtBoost = district?.infrastructureLevel === "high" ? 0.04 : district?.infrastructureLevel === "moderate" ? 0.01 : -0.03;
      const condition = roundNumber(
        clamp(0.84 + developmentBoost + districtBoost - statePenalty + seededRatio(instanceId) * 0.12 - settlement.survivalModel.infrastructureDifficulty / 800, 0.18, 0.98)
      );
      const usability = roundNumber(clamp(condition * (plot.state === "abandoned" ? 0.45 : 1), 0.1, 1));
      const decayState =
        condition < 0.32 ? "abandoned" : condition < 0.55 ? "damaged" : condition < 0.78 ? "worn" : "sound";
      const repairMode = condition < 0.4 ? "major_restoration" : condition < 0.72 ? "standard_repair" : "passive_maintenance";
      const materialRequirements = resolveBuildingMaterialRequirements(building.category, 1 - condition);
      instances.push({
        instanceId,
        buildingId: building.buildingId,
        settlementId: settlement.id,
        districtId: plot.districtId,
        plotId: plot.plotId,
        condition,
        usability,
        efficiencyModifier: roundNumber(clamp(0.7 + usability * 0.35, 0.5, 1.05)),
        storageCapacityModifier: roundNumber(clamp(0.5 + usability * 0.6, 0.35, 1)),
        decayState,
        repairMode,
        materialRequirements,
        assignedTradeIds: resolveAssignedTrades(building.category),
        notes: [
          `Placed in ${district?.districtType ?? "fallback"} based on building category ${building.category} and plot state ${plot.state}.`,
          `Condition ${condition} is deterministic from district infrastructure, plot state, terrain burden, and settlement development.`
        ]
      });
    }

    const averageCondition = roundNumber(
      instances.length > 0 ? instances.reduce((sum, instance) => sum + instance.condition, 0) / instances.length : 0
    );
    const effectiveUsability = roundNumber(
      instances.length > 0 ? instances.reduce((sum, instance) => sum + instance.usability, 0) / instances.length : 0
    );
    const storageProfiles = building.storageProfiles.map((profileEntry) => ({
      ...profileEntry,
      capacityUnits: roundNumber(profileEntry.capacityUnits * Math.max(0.35, effectiveUsability || 1)),
      utilization: 0,
      notes: [
        ...profileEntry.notes,
        `Effective storage scaled by average building usability ${effectiveUsability || 1}.`
      ]
    }));

    return {
      ...building,
      averageCondition,
      effectiveUsability,
      storageProfiles,
      assignedDistrictIds: uniqueGoods(instances.map((instance) => instance.districtId)),
      instances,
      notes: [
        ...building.notes,
        `${instances.length} instantiated buildings were assigned to plots with condition and repair states.`
      ]
    };
  });
}

function resolveStorageProfiles(
  settlement: SettlementContentRecord,
  infrastructure: SettlementInfrastructureRuntimeState,
  buildings: SettlementBuildingState[]
): SettlementStorageProfileState[] {
  const indexes = getIndexes();
  const loadByType = new Map<string, number>();
  const derivedProfiles: Array<{
    storageType: SettlementStorageProfileState["storageType"];
    capacityUnits: number;
    supportedGoods: string[];
    notes: string[];
  }> = [];

  for (const building of buildings) {
    const record = indexes.buildingCatalog.find((entry) => entry.id === building.buildingId);
    for (const profile of building.storageProfiles) {
      derivedProfiles.push({
        storageType: profile.storageType,
        capacityUnits: profile.capacityUnits,
        supportedGoods: uniqueGoods(profile.supportedGoods),
        notes: [...profile.notes, `Scaled from ${record?.name ?? building.buildingId} x${building.instanceCount}.`]
      });
    }
  }

  if (derivedProfiles.length === 0) {
    const fallbackType: SettlementStorageProfileState["storageType"] =
      settlement.economicModel.dominantRole.includes("grain") || settlement.economicModel.dominantRole.includes("agri")
        ? "granary"
        : settlement.tradeDependencyProfile.routeAccess.coastal >= 0.55 || settlement.infrastructureProfile.harborTier >= 1
          ? "warehouse"
          : settlement.administrativeRole !== "none"
            ? "vault"
            : "cellar";
    derivedProfiles.push({
      storageType: fallbackType,
      capacityUnits: infrastructure.storageCapacityUnits,
      supportedGoods: uniqueGoods([...settlement.domesticResourceProfile.primaryGoods, ...settlement.domesticResourceProfile.secondaryGoods]),
      notes: ["Fallback storage profile derived from settlement economy and infrastructure."]
    });
  }

  const totalDerivedCapacity = derivedProfiles.reduce((sum, profile) => sum + profile.capacityUnits, 0);
  let assignedLoad = 0;

  return derivedProfiles
    .sort((left, right) => left.storageType.localeCompare(right.storageType))
    .map((profile, index, profiles) => {
      const capacityShare = totalDerivedCapacity > 0 ? profile.capacityUnits / totalDerivedCapacity : 1 / Math.max(profiles.length, 1);
      const capacityUnits =
        index === profiles.length - 1
          ? roundNumber(Math.max(0, infrastructure.storageCapacityUnits - profiles.slice(0, index).reduce((sum, earlier) => sum + earlier.capacityUnits * (infrastructure.storageCapacityUnits / Math.max(totalDerivedCapacity, 1)), 0)))
          : roundNumber(infrastructure.storageCapacityUnits * capacityShare);
      const loadUnits =
        index === profiles.length - 1
          ? roundNumber(Math.max(0, infrastructure.storageLoadUnits - assignedLoad))
          : roundNumber(infrastructure.storageLoadUnits * (capacityUnits / Math.max(infrastructure.storageCapacityUnits, 1)));
      assignedLoad = roundNumber(assignedLoad + loadUnits);
      loadByType.set(profile.storageType, (loadByType.get(profile.storageType) ?? 0) + loadUnits);
      return {
        storageType: profile.storageType,
        capacityUnits,
        loadUnits,
        utilization: capacityUnits > 0 ? roundNumber(loadUnits / capacityUnits) : 0,
        supportedGoods: profile.supportedGoods,
        notes: profile.notes
      };
    });
}

function resolveRepairProjects(
  settlement: SettlementContentRecord,
  population: SettlementPopulationProfileState,
  buildings: SettlementBuildingState[]
): SettlementRepairProjectState[] {
  const craftCount = population.laborClasses.find((entry) => entry.classId === "craft")?.count ?? 0;
  const logisticsCount = population.laborClasses.find((entry) => entry.classId === "logistics")?.count ?? 0;
  const serviceCount = population.laborClasses.find((entry) => entry.classId === "service")?.count ?? 0;
  const maintenanceStrength = craftCount + Math.round(logisticsCount * 0.35) + Math.round(serviceCount * 0.15);

  return buildings
    .flatMap((building) =>
      building.instances
        .filter((instance) => instance.condition < 0.86)
        .map((instance) => {
          const laborDays = roundNumber(
            Math.max(
              2,
              (1 - instance.condition) * 18 *
                (instance.repairMode === "major_restoration" ? 1.9 : instance.repairMode === "standard_repair" ? 1.15 : 0.55)
            )
          );
          const requiredTradeIds = [...instance.assignedTradeIds];
          const canExecute =
            maintenanceStrength >= (instance.repairMode === "major_restoration" ? 42 : instance.repairMode === "standard_repair" ? 18 : 8);
          return {
            projectId: `${instance.instanceId}.repair`,
            settlementId: settlement.id,
            buildingId: building.buildingId,
            buildingInstanceId: instance.instanceId,
            districtId: instance.districtId,
            plotId: instance.plotId,
            mode: instance.repairMode,
            blockingSeverity:
              instance.repairMode === "major_restoration" ? "high" : instance.repairMode === "standard_repair" ? "moderate" : "low",
            canExecute,
            requiredTradeIds,
            assistantLaborClassIds: ["service", "logistics"],
            materialRequirements: instance.materialRequirements,
            laborDays,
            notes: [
              `${labelFromId(building.buildingId)} repair uses existing craftsmen and competes with regular production labor.`,
              canExecute
                ? "Current craft and support labor can sustain the repair workload."
                : "Current craft and support labor are insufficient, so repairs will queue behind higher-priority work."
            ]
          };
        })
    )
    .sort((left, right) => right.laborDays - left.laborDays || left.projectId.localeCompare(right.projectId));
}

function pickGoodsByFamily(goods: string[], families: string[]): string[] {
  return uniqueGoods(goods.filter((itemKey) => families.some((family) => resolveResourceFamilies(itemKey).includes(family))));
}

function addBusiness(
  businesses: SettlementBusinessState[],
  settlement: SettlementContentRecord,
  businessType: string,
  category: string,
  scaleBand: "micro" | "small" | "moderate" | "large",
  workforceCount: number,
  inputGoods: string[],
  outputGoods: string[],
  dependencies: string[],
  notes: string[]
) {
  if (workforceCount <= 0 || outputGoods.length === 0) {
    return;
  }
  businesses.push({
    businessId: `${settlement.id}.${businessType}`,
    settlementId: settlement.id,
    businessType,
    category,
    scaleBand,
    workforceCount,
    inputGoods: uniqueGoods(inputGoods),
    outputGoods: uniqueGoods(outputGoods),
    infrastructureDependencies: uniqueGoods(dependencies),
    notes
  });
}

function resolveBusinesses(
  settlement: SettlementContentRecord,
  locality: RegionLocalityContentRecord | undefined,
  accessState: ReturnType<typeof resolveSettlementResourceAccess>,
  population: SettlementPopulationProfileState,
  infrastructure: SettlementInfrastructureRuntimeState
): SettlementBusinessState[] {
  const businesses: SettlementBusinessState[] = [];
  const primaryGoods = settlement.domesticResourceProfile.primaryGoods;
  const secondaryGoods = settlement.domesticResourceProfile.secondaryGoods;
  const allGoods = uniqueGoods([...primaryGoods, ...secondaryGoods]);
  const agrarianWorkers = population.laborClasses.find((entry) => entry.classId === "agrarian")?.count ?? 0;
  const extractiveWorkers = population.laborClasses.find((entry) => entry.classId === "extractive")?.count ?? 0;
  const maritimeWorkers = population.laborClasses.find((entry) => entry.classId === "maritime")?.count ?? 0;
  const craftWorkers = population.laborClasses.find((entry) => entry.classId === "craft")?.count ?? 0;
  const tradeWorkers = population.laborClasses.find((entry) => entry.classId === "trade")?.count ?? 0;
  const logisticsWorkers = population.laborClasses.find((entry) => entry.classId === "logistics")?.count ?? 0;

  addBusiness(
    businesses,
    settlement,
    "market_warehouses",
    "trade",
    settlement.populationTotal >= 20000 ? "large" : settlement.populationTotal >= 5000 ? "moderate" : "small",
    Math.max(8, Math.round((tradeWorkers + logisticsWorkers) * 0.35)),
    ["pack_harness", "rope", "cask"],
    pickGoodsByFamily(allGoods, ["grain", "fruit", "fish", "minerals", "wood", "textiles", "luxury_goods"]),
    ["storage", "market", "roads"],
    ["Warehousing appears anywhere regular exchange and storage are both present."]
  );

  if (hasUsableFamily(accessState, "grain") || hasUsableFamily(accessState, "vegetables") || hasUsableFamily(accessState, "fruit")) {
    addBusiness(
      businesses,
      settlement,
      "farm_estates",
      "agrarian",
      agrarianWorkers > 1200 ? "large" : agrarianWorkers > 450 ? "moderate" : "small",
      Math.max(10, Math.round(agrarianWorkers * 0.55)),
      ["tools", "cord", "pack_harness"],
      pickGoodsByFamily(allGoods, ["grain", "vegetables", "fruit", "horse_fodder"]),
      ["arable_land", "storage"],
      ["Arable catchment and food security justify field agriculture and orchard output."]
    );
    addBusiness(
      businesses,
      settlement,
      "mills_and_granaries",
      "processing",
      settlement.populationTotal >= 6000 ? "moderate" : "small",
      Math.max(6, Math.round((agrarianWorkers + craftWorkers) * 0.16)),
      ["grain", "cask", "sack"],
      uniqueGoods([...pickGoodsByFamily(allGoods, ["grain"]), "flour"]),
      ["storage", "roads"],
      ["Stable grain flow and settlement storage support milling and granary work."]
    );
  }

  if (hasUsableFamily(accessState, "livestock") || hasUsableFamily(accessState, "hides") || hasUsableFamily(accessState, "meat")) {
    addBusiness(
      businesses,
      settlement,
      "pasture_runs",
      "livestock",
      agrarianWorkers > 900 ? "moderate" : "small",
      Math.max(6, Math.round(agrarianWorkers * 0.24)),
      ["horse_fodder", "cord"],
      pickGoodsByFamily(allGoods, ["livestock", "hides", "meat", "fur", "textiles"]),
      ["pasture", "water"],
      ["Pasture and herd support create animal-product output and transport stock."]
    );
  }

  if (hasUsableFamily(accessState, "herbs") || hasUsableFamily(accessState, "fur") || hasUsableFamily(accessState, "meat")) {
    addBusiness(
      businesses,
      settlement,
      "gathering_and_trapping",
      "extractive",
      extractiveWorkers > 700 ? "moderate" : "small",
      Math.max(5, Math.round((extractiveWorkers + agrarianWorkers) * 0.16)),
      ["trap_set", "basket", "sack"],
      uniqueGoods(["herbs_raw", "fur", "hide_raw", "game_meat_raw"].filter((itemKey) => allGoods.includes(itemKey) || itemKey === "herbs_raw" || itemKey === "hide_raw")),
      ["frontier_store", "timber_access"],
      ["Wildland-compatible settlements support trapping, foraging, and hide handling businesses."]
    );
  }

  if (hasUsableFamily(accessState, "fish") || hasUsableFamily(accessState, "maritime_goods")) {
    addBusiness(
      businesses,
      settlement,
      "fishing_docks",
      "maritime",
      maritimeWorkers > 800 ? "moderate" : "small",
      Math.max(6, Math.round(maritimeWorkers * 0.58)),
      ["rope", "salt", "cask"],
      pickGoodsByFamily(allGoods, ["fish", "maritime_goods"]),
      ["waterfront", "boat_access"],
      ["Water access and fishery compatibility create dockside extraction and processing work."]
    );
  }

  if (
    hasUsableFamily(accessState, "textiles") ||
    settlement.economicModel.dominantRole.includes("textile") ||
    settlement.economicModel.secondaryRoles.some((role) => /textile|cloth|wool|flax/.test(role))
  ) {
    addBusiness(
      businesses,
      settlement,
      "textile_houses",
      "craft",
      craftWorkers > 850 ? "moderate" : "small",
      Math.max(6, Math.round(craftWorkers * 0.22)),
      ["flax_bundle", "wool_fleece", "linen_thread", "yarn"],
      uniqueGoods(["linen_thread", "yarn", "cord", "coarse_cloth", "fine_cloth", "cloth"].filter((itemKey) => allGoods.includes(itemKey) || itemKey === "cord")),
      ["cloth_storage", "water"],
      ["Fiber access and cloth demand support weaving, spinning, and dye-adjacent workshop work."]
    );
  }

  if (hasUsableFamily(accessState, "wood")) {
    addBusiness(
      businesses,
      settlement,
      "logging_yards",
      "extractive",
      extractiveWorkers > 700 ? "moderate" : "small",
      Math.max(6, Math.round((extractiveWorkers + craftWorkers) * 0.28)),
      ["tools", "cord", "pack_harness"],
      pickGoodsByFamily(allGoods, ["wood"]),
      ["timber_access", "roads"],
      ["Timber catchment justifies logging, rough cutting, and haulage businesses."]
    );
    addBusiness(
      businesses,
      settlement,
      "woodworking_yards",
      "craft",
      craftWorkers > 800 ? "moderate" : "small",
      Math.max(5, Math.round((craftWorkers + extractiveWorkers) * 0.18)),
      ["plank", "nail", "cord", "leather_strap"],
      uniqueGoods(["crate", "cask", "wood_shaft", "tool_handle", "wood_spoke", "wood_axle"].filter((itemKey) => allGoods.includes(itemKey) || itemKey === "crate" || itemKey === "cask")),
      ["timber_access", "roads", "storage"],
      ["Timber-rich settlements with craft labor support wheelwright, joinery, and cooper-style yards."]
    );
  }

  if (hasUsableFamily(accessState, "minerals")) {
    addBusiness(
      businesses,
      settlement,
      "mine_works",
      "extractive",
      extractiveWorkers > 1000 ? "large" : extractiveWorkers > 350 ? "moderate" : "small",
      Math.max(8, Math.round(extractiveWorkers * 0.62)),
      ["tools", "oil_flask", "pack_harness"],
      pickGoodsByFamily(allGoods, ["minerals"]),
      ["ore_access", "stone_access"],
      ["Mineral access and extractive labor create mine, quarry, and assaying operations."]
    );
    addBusiness(
      businesses,
      settlement,
      "smelters_and_toolshops",
      "craft",
      craftWorkers > 900 ? "moderate" : "small",
      Math.max(6, Math.round(craftWorkers * 0.22)),
      uniqueGoods([...pickGoodsByFamily(allGoods, ["minerals"]), "charcoal"]),
      pickGoodsByFamily(allGoods, ["tools", "weapons", "armor", "minerals"]),
      ["fuel", "roads"],
      ["Extractive centers with craft labor usually support refining, forge, and repair work."]
    );
  }

  if (
    hasUsableFamily(accessState, "minerals") ||
    settlement.economicModel.secondaryRoles.some((role) => /mason|brick|stone|construction/.test(role)) ||
    settlement.infrastructureProfile.roadTier >= 2
  ) {
    addBusiness(
      businesses,
      settlement,
      "construction_yards",
      "construction",
      settlement.populationTotal >= 12000 ? "moderate" : "small",
      Math.max(4, Math.round((craftWorkers + logisticsWorkers) * 0.14)),
      ["timber_beam", "stone_rubble", "lime"],
      uniqueGoods(["stone_blocks", "worked_stone", "brick", "timber_beam"].filter((itemKey) => allGoods.includes(itemKey) || itemKey === "timber_beam")),
      ["construction_stockyard", "roads"],
      ["Settlements above subsistence scale support construction yards, masons, and civic works handling."]
    );
  }

  if (settlement.infrastructureProfile.harborTier >= 2 || settlement.tradeDependencyProfile.routeAccess.coastal >= 0.7) {
    addBusiness(
      businesses,
      settlement,
      "shipyards_and_roperies",
      "infrastructure",
      settlement.populationTotal >= 15000 ? "moderate" : "small",
      Math.max(8, Math.round((craftWorkers + logisticsWorkers + maritimeWorkers) * 0.2)),
      ["wood_shaft", "cord", "resin_pitch", "nail"],
      uniqueGoods([...pickGoodsByFamily(allGoods, ["maritime_goods", "wood"]), "ship_timber", "cask", "resin_pitch"]),
      ["harbor", "storage", "roads"],
      ["Harbor infrastructure and maritime labor support hull repair, ropework, and supply outfitting."]
    );
  }

  if (settlement.infrastructureProfile.fortificationTier >= 2 || settlement.identityTags.some((tag) => /fort|watch|border/.test(tag))) {
    addBusiness(
      businesses,
      settlement,
      "barracks_and_supply_depots",
      "military",
      settlement.populationTotal >= 10000 ? "moderate" : "small",
      Math.max(8, Math.round((population.militaryPopulation + logisticsWorkers) * 0.3)),
      ["grain", "cured_meat", "steel_weapons", "bolt_bundle"],
      uniqueGoods(["steel_weapons", "plate_helm", "bolt_bundle", "pack_wagon"]),
      ["storage", "defenses"],
      ["Fortified settlements maintain organized guard supply, armories, and reserve stores."]
    );
  }

  if (settlement.administrativeRole !== "none") {
    addBusiness(
      businesses,
      settlement,
      "scribal_houses",
      "civic",
      settlement.populationTotal >= 10000 ? "moderate" : "small",
      Math.max(4, Math.round((population.civicPopulation + tradeWorkers) * 0.18)),
      ["paper_sheet", "writing_ink", "blank_book"],
      uniqueGoods(["ledger", "record_book", "reference_book"]),
      ["administration", "market"],
      ["Administrative centers support recordkeeping, contracts, and ledger services."]
    );
  }

  if (locality?.dominantIndustries?.some((industry) => /herb|dye|spice/.test(industry))) {
    addBusiness(
      businesses,
      settlement,
      "herb_and_dye_houses",
      "craft",
      craftWorkers > 500 ? "moderate" : "small",
      Math.max(4, Math.round(craftWorkers * 0.12)),
      ["herbs", "flower_bloom", "cask"],
      pickGoodsByFamily(allGoods, ["herbs", "luxury_goods", "tea"]),
      ["water", "storage"],
      ["Specialty botanical localities support herb drying, dye work, and refined gatherer output."]
    );
  }

  if (settlement.populationTotal >= 1500 && (settlement.infrastructureProfile.marketTier >= 1 || settlement.infrastructureProfile.roadTier >= 1)) {
    addBusiness(
      businesses,
      settlement,
      "inns_and_taprooms",
      "hospitality",
      settlement.populationTotal >= 12000 ? "moderate" : "small",
      Math.max(5, Math.round((tradeWorkers + population.civicPopulation) * 0.12)),
      ["bread_loaf", "ale_cask", "wine_cask", "cured_meat"],
      uniqueGoods(["bread_loaf", "ale_cask", "wine_cask", "cured_meat"]),
      ["lodging", "market", "roads"],
      ["Road traffic, markets, and public-house demand support inns, taverns, and taprooms."]
    );
  }

  if (settlement.populationTotal >= 1800 && (settlement.infrastructureProfile.marketTier >= 1 || settlement.infrastructureProfile.waterTier >= 1)) {
    addBusiness(
      businesses,
      settlement,
      "sanitation_and_soapworks",
      "service",
      settlement.populationTotal >= 14000 ? "moderate" : "small",
      Math.max(4, Math.round((population.civicPopulation + craftWorkers) * 0.1)),
      ["rendered_tallow", "ash", "bucket"],
      uniqueGoods(["soap", "bucket", "candle"].filter((itemKey) => itemKey !== "soap" || settlement.infrastructureProfile.marketTier >= 1)),
      ["public_hygiene", "water", "waste_handling"],
      ["Denser settlements support washing, rendered-fat processing, and soapmaking services."]
    );
  }

  if (settlement.guildPresence.length > 0 || settlement.infrastructureProfile.marketTier >= 2 || settlement.administrativeRole !== "none") {
    addBusiness(
      businesses,
      settlement,
      "guild_halls",
      "civic",
      settlement.populationTotal >= 12000 ? "moderate" : "small",
      Math.max(4, Math.round((tradeWorkers + population.civicPopulation) * 0.14)),
      ["ledger", "record_book", "reference_book"],
      uniqueGoods(["ledger", "record_book", "reference_book"]),
      ["administration", "market", "archives"],
      ["Organized trade and guild presence produce charter halls, exchanges, and contract houses."]
    );
  }

  if (infrastructure.dispatchSlotsPerTick >= 3 && infrastructure.transportAvailability.length >= 4) {
    addBusiness(
      businesses,
      settlement,
      "teamster_yards",
      "logistics",
      logisticsWorkers > 700 ? "moderate" : "small",
      Math.max(5, Math.round(logisticsWorkers * 0.24)),
      ["horse_fodder", "pack_harness", "rope"],
      uniqueGoods(["pack_harness", "pack_wagon", "crate", "sack"]),
      ["roads", "storage"],
      ["Transport-heavy settlements support yards, haulers, handlers, and convoy services."]
    );
  }

  if (infrastructure.corruptionPressure >= 1.1 && settlement.infrastructureProfile.marketTier >= 1) {
    const shadowGoods = uniqueGoods([
      ...pickGoodsByFamily(allGoods, ["luxury_goods", "herbs", "records"]),
      ...(allGoods.includes("silver_ingot") ? ["silver_ingot"] : []),
      ...(allGoods.includes("tea") ? ["tea"] : [])
    ]);
    addBusiness(
      businesses,
      settlement,
      "shadow_markets",
      "shadow",
      settlement.populationTotal >= 18000 ? "moderate" : "small",
      Math.max(3, Math.round((tradeWorkers + logisticsWorkers) * 0.08)),
      uniqueGoods(["crate", "sack", "coin_belt"].filter((itemKey) => shadowGoods.length > 0 || itemKey !== "coin_belt")),
      shadowGoods,
      ["market", "storage"],
      ["Corruption pressure and portable high-value goods support smuggling and gray-market exchange."]
    );
  }

  return businesses;
}

function resolveSupplyDemand(
  settlement: SettlementContentRecord,
  marketState: SettlementMarketState | null | undefined,
  businesses: SettlementBusinessState[]
): SettlementSupplyDemandState {
  const shortageGoods = uniqueGoods([
    ...(marketState?.stock ?? [])
      .filter((entry) => entry.unmetDemandPerTick > 0.1 || entry.demandPressure >= 0.18)
      .sort((left, right) => right.unmetDemandPerTick - left.unmetDemandPerTick || right.demandPressure - left.demandPressure)
      .map((entry) => entry.itemKey)
      .slice(0, 6),
    ...settlement.domesticResourceProfile.demandedGoods.slice(0, 4),
    ...settlement.tradeDependencyProfile.stapleImports.slice(0, 4)
  ]).slice(0, 8);
  const surplusGoods = uniqueGoods([
    ...(marketState?.stock ?? [])
      .filter((entry) => entry.tradeSurplusPerTick > 0.1 || entry.netPerTick > 0.12)
      .sort((left, right) => right.tradeSurplusPerTick - left.tradeSurplusPerTick || right.netPerTick - left.netPerTick)
      .map((entry) => entry.itemKey)
      .slice(0, 6),
    ...settlement.domesticResourceProfile.primaryGoods.slice(0, 4),
    ...settlement.tradeDependencyProfile.exportFocus.slice(0, 4)
  ]).slice(0, 8);
  const exportGoods = uniqueGoods([...surplusGoods, ...settlement.tradeDependencyProfile.exportFocus, ...settlement.domesticResourceProfile.primaryGoods]).slice(0, 5);
  const importGoods = uniqueGoods([...shortageGoods, ...settlement.tradeDependencyProfile.stapleImports, ...settlement.domesticResourceProfile.demandedGoods]).slice(0, 5);
  const consumptionGoods = uniqueGoods([
    ...businesses.flatMap((business) => business.inputGoods),
    ...settlement.domesticResourceProfile.demandedGoods
  ]).slice(0, 8);
  const tradeDependencies = [
    ...importGoods.map((itemKey) => ({
      direction: "import" as const,
      itemKey,
      partnerSettlementIds: settlement.domesticTradeFlows
        .filter((flow) => flow.direction === "imports_from" || flow.direction === "exchange_with")
        .filter((flow) => flow.goods.includes(itemKey) || flow.goods.some((good) => resolveResourceFamilies(good).some((family) => resolveResourceFamilies(itemKey).includes(family))))
        .map((flow) => flow.partnerSettlementId)
        .slice(0, 4),
      reason: `Import pressure is driven by local demand, reserve protection, and the settlement dependency band ${settlement.tradeDependencyProfile.dependencyBand}.`
    })),
    ...exportGoods.map((itemKey) => ({
      direction: "export" as const,
      itemKey,
      partnerSettlementIds: settlement.domesticTradeFlows
        .filter((flow) => flow.direction === "exports_to" || flow.direction === "exchange_with")
        .filter((flow) => flow.goods.includes(itemKey) || flow.goods.some((good) => resolveResourceFamilies(good).some((family) => resolveResourceFamilies(itemKey).includes(family))))
        .map((flow) => flow.partnerSettlementId)
        .slice(0, 4),
      reason: "Export focus follows local productive strengths, route access, and derived market surplus."
    }))
  ];

  return {
    settlementId: settlement.id,
    surplusGoods,
    shortageGoods,
    exportGoods: exportGoods.length > 0 ? exportGoods : settlement.domesticResourceProfile.primaryGoods.slice(0, 1),
    importGoods: importGoods.length > 0 ? importGoods : settlement.tradeDependencyProfile.stapleImports.slice(0, 1),
    consumptionGoods,
    tradeDependencies,
    notes: [
      "Surpluses and shortages derive from live market pressure when available, then fall back to authored domestic and trade profiles.",
      "Every settlement keeps both export and import obligations so no settlement initializes as fully self-sufficient."
    ]
  };
}

function resolveMorale(
  settlement: SettlementContentRecord,
  infrastructure: SettlementInfrastructureRuntimeState,
  buildings: SettlementBuildingState[],
  districts: SettlementDistrictState[],
  supplyDemand: SettlementSupplyDemandState
): SettlementMoraleState {
  const averageCondition =
    buildings.length > 0 ? buildings.reduce((sum, building) => sum + building.averageCondition, 0) / buildings.length : 0.7;
  const residentialPlots = districts.filter((district) => district.districtType.startsWith("residential"));
  const housingPressure =
    residentialPlots.length > 0
      ? residentialPlots.reduce((sum, district) => sum + (district.developedPlots + district.underdevelopedPlots) / Math.max(district.plotCapacity, 1), 0) / residentialPlots.length
      : 0.55;
  const contributors: EconomyPressureContribution[] = [
    {
      source: "food_security",
      factor: 1,
      impact: roundNumber((settlement.survivalModel.foodSecurity - 50) * 0.35),
      note: "Food security remains the largest morale input in the initial settlement model."
    },
    {
      source: "security",
      factor: 1,
      impact: roundNumber((infrastructure.securityScore - 50) * 0.18),
      note: "Security improves confidence in movement, storage, and ordinary work."
    },
    {
      source: "building_condition",
      factor: 1,
      impact: roundNumber((averageCondition - 0.65) * 42),
      note: "Average building condition shapes perceived civic health and service quality."
    },
    {
      source: "housing_pressure",
      factor: 1,
      impact: roundNumber((0.72 - housingPressure) * 22),
      note: "Overcrowded or underbuilt residential districts depress morale modestly."
    },
    {
      source: "shortages",
      factor: 1,
      impact: roundNumber(-Math.min(12, supplyDemand.shortageGoods.length * 1.8)),
      note: "Visible shortages reduce confidence in everyday life and trade reliability."
    }
  ];
  const moraleScore = roundNumber(clamp(50 + contributors.reduce((sum, entry) => sum + entry.impact, 0), 28, 88));
  return {
    settlementId: settlement.id,
    moraleScore,
    productionModifier: roundNumber(clamp(1 + (moraleScore - 50) / 400, 0.95, 1.05)),
    housingPressure: roundNumber(housingPressure),
    contributors,
    notes: [
      "Morale is intentionally light-touch in this pass and only nudges production efficiency.",
      "Food, security, condition, and housing pressure dominate the initial morale foundation."
    ]
  };
}

export function resolveSettlementSimulationProfile(input: {
  settlementId: string;
  marketState?: SettlementMarketState | null;
}): SettlementSimulationState {
  const indexes = getIndexes();
  const settlement = indexes.settlementById.get(input.settlementId);
  if (!settlement) {
    throw new Error(`Unknown settlement '${input.settlementId}'.`);
  }
  const locality = indexes.localityById.get(settlement.localityBandId);
  const accessState = resolveSettlementResourceAccess({ settlementId: settlement.id });
  const population = resolvePopulationProfile(settlement, accessState);
  const storageCapacityUnits = roundNumber(
    settlement.populationTotal * (0.09 + settlement.infrastructureProfile.marketTier * 0.006 + settlement.infrastructureProfile.harborTier * 0.004) * (OVERALL_INFRA_FACTORS[settlement.infrastructureProfile.overallLevel] ?? 1)
  );
  const storageLoadUnits = roundNumber(
    (input.marketState?.stock ?? []).reduce((sum, entry) => sum + resolveCargoLoadUnits(entry.itemKey, entry.stockLevel), 0)
  );
  const logisticsPopulation = population.laborClasses.find((entry) => entry.classId === "logistics")?.count ?? 0;
  const tradePopulation = population.laborClasses.find((entry) => entry.classId === "trade")?.count ?? 0;
  const throughputBase = logisticsPopulation + Math.round(tradePopulation * 0.45);
  const routeLift =
    settlement.infrastructureProfile.roadTier * 0.22 +
    settlement.infrastructureProfile.waterTier * 0.16 +
    settlement.infrastructureProfile.harborTier * 0.24 +
    settlement.infrastructureProfile.marketTier * 0.2;
  const tradeThroughputUnitsPerTick = roundNumber(
    Math.max(
      6,
      throughputBase *
        0.08 *
        (OVERALL_INFRA_FACTORS[settlement.infrastructureProfile.overallLevel] ?? 1) *
        Math.max(1, routeLift) *
        Math.max(0.7, 1 - settlement.survivalModel.infrastructureDifficulty / 220)
    )
  );
  const dispatchSlotsPerTick = Math.max(
    1,
    Math.round(
      tradeThroughputUnitsPerTick / 120 +
        settlement.infrastructureProfile.marketTier * 0.6 +
        settlement.infrastructureProfile.harborTier * 0.7 +
        settlement.infrastructureProfile.roadTier * 0.5
    )
  );
  const securityScore = roundNumber(
    clamp(
      settlement.infrastructureProfile.fortificationTier * 18 +
        settlement.infrastructureProfile.roadTier * 2 +
        settlement.infrastructureProfile.harborTier * 3 +
        (population.militaryPopulation / Math.max(settlement.populationTotal, 1)) * 180 -
        settlement.survivalModel.hazardPressure * 0.28,
      5,
      100
    )
  );
  const corruptionPressure = roundNumber(
    clamp(
      settlement.populationTotal / 24000 +
        settlement.infrastructureProfile.marketTier * 0.38 -
        (settlement.administrativeRole !== "none" ? 0.45 : 0) -
        settlement.infrastructureProfile.fortificationTier * 0.12,
      0.08,
      4
    )
  );
  const infrastructure: SettlementInfrastructureRuntimeState = {
    settlementId: settlement.id,
    storageCapacityUnits,
    storageLoadUnits,
    storageUtilization: storageCapacityUnits > 0 ? roundNumber(storageLoadUnits / storageCapacityUnits) : 0,
    storageProfiles: [],
    tradeThroughputUnitsPerTick,
    dispatchSlotsPerTick,
    securityScore,
    corruptionPressure,
    averageBuildingCondition: 1,
    conditionThroughputModifier: 1,
    maintenanceCapacityPerTick: 0,
    serviceAvailability: [
      settlement.infrastructureProfile.marketTier >= 1 ? "market_access" : "",
      settlement.infrastructureProfile.roadTier >= 1 ? "road_access" : "",
      settlement.infrastructureProfile.waterTier >= 1 ? "waterfront_access" : "",
      settlement.infrastructureProfile.harborTier >= 1 ? "harbor_access" : "",
      settlement.infrastructureProfile.fortificationTier >= 1 ? "defensive_watch" : "",
      settlement.administrativeRole !== "none" ? "administrative_services" : ""
    ].filter(Boolean),
    transportAvailability: [],
    explanation: [
      "Storage and throughput derive from population, infrastructure, and current stock load.",
      "Security and corruption derive from fortification, administration, market size, and hazard burden."
    ]
  };
  infrastructure.transportAvailability = resolveTransportAvailability(settlement, accessState, population);
  const businesses = resolveBusinesses(settlement, locality, accessState, population, infrastructure);
  const profile = resolveSettlementProfile(settlement, locality, accessState, businesses);
  const baseBuildings = resolveBuildings(settlement, locality, businesses);
  const districtsAndPlots = resolveDistrictsAndPlots(settlement, profile, population, infrastructure, businesses, baseBuildings);
  const buildings = resolveBuildingInstances(
    settlement,
    districtsAndPlots.districts,
    districtsAndPlots.plots,
    baseBuildings,
    profile
  );
  infrastructure.averageBuildingCondition = roundNumber(
    buildings.length > 0 ? buildings.reduce((sum, building) => sum + building.averageCondition, 0) / buildings.length : 1
  );
  infrastructure.conditionThroughputModifier = roundNumber(clamp(0.75 + infrastructure.averageBuildingCondition * 0.3, 0.7, 1.05));
  infrastructure.tradeThroughputUnitsPerTick = roundNumber(infrastructure.tradeThroughputUnitsPerTick * infrastructure.conditionThroughputModifier);
  infrastructure.dispatchSlotsPerTick = Math.max(1, Math.round(infrastructure.dispatchSlotsPerTick * infrastructure.conditionThroughputModifier));
  infrastructure.storageCapacityUnits = roundNumber(infrastructure.storageCapacityUnits * clamp(0.7 + infrastructure.averageBuildingCondition * 0.35, 0.65, 1.05));
  infrastructure.storageUtilization =
    infrastructure.storageCapacityUnits > 0 ? roundNumber(infrastructure.storageLoadUnits / infrastructure.storageCapacityUnits) : 0;
  infrastructure.maintenanceCapacityPerTick = roundNumber(
    Math.max(
      2,
      ((population.laborClasses.find((entry) => entry.classId === "craft")?.count ?? 0) * 0.028 +
        (population.laborClasses.find((entry) => entry.classId === "logistics")?.count ?? 0) * 0.012) *
        infrastructure.conditionThroughputModifier
    )
  );
  infrastructure.storageProfiles = resolveStorageProfiles(settlement, infrastructure, buildings);
  infrastructure.serviceAvailability = uniqueGoods([
    ...infrastructure.serviceAvailability,
    ...buildings.flatMap((building) => building.serviceFunctions)
  ]);
  const repairProjects = resolveRepairProjects(settlement, population, buildings);
  const supplyDemand = resolveSupplyDemand(settlement, input.marketState, businesses);
  const morale = resolveMorale(settlement, infrastructure, buildings, districtsAndPlots.districts, supplyDemand);
  infrastructure.tradeThroughputUnitsPerTick = roundNumber(infrastructure.tradeThroughputUnitsPerTick * morale.productionModifier);
  infrastructure.explanation.push(
    `${buildings.length} building patterns were derived from settlement role, compatible terrain, and infrastructure thresholds.`
  );
  infrastructure.explanation.push(
    `Average building condition ${infrastructure.averageBuildingCondition} and morale ${morale.moraleScore} now feed throughput and storage efficiency.`
  );

  return {
    settlementId: settlement.id,
    regionId: settlement.regionId,
    localityBandId: settlement.localityBandId,
    profile,
    population,
    infrastructure,
    districts: districtsAndPlots.districts,
    plots: districtsAndPlots.plots,
    businesses,
    buildings,
    repairProjects,
    morale,
    supplyDemand,
    explanation: [
      `${settlement.name} derives labor from ${settlement.settlementType} scale, survival burden, and local role ${settlement.economicModel.dominantRole}.`,
      "Businesses and buildings align to usable resources, locality industry, placeability, and infrastructure availability instead of static hand assignment.",
      "Districts, plots, building condition, repair pressure, morale, and shortage/surplus state are all derived deterministically from the same settlement, locality, and market truth."
    ]
  };
}

export function buildSettlementSimulationProfiles(input: {
  settlementIds: string[];
  marketStates?: SettlementMarketState[];
}): SettlementSimulationState[] {
  const marketStateBySettlementId = new Map((input.marketStates ?? []).map((state) => [state.settlementId, state]));
  return input.settlementIds
    .map((settlementId) =>
      resolveSettlementSimulationProfile({
        settlementId,
        marketState: marketStateBySettlementId.get(settlementId) ?? null
      })
    )
    .sort((left, right) => left.settlementId.localeCompare(right.settlementId));
}
