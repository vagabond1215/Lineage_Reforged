import type {
  CivilizationEconomyState,
  EconomyLevelTotals,
  EconomyHierarchyLevel,
  EconomyLedgerSnapshot,
  EconomyNodeState,
  ResourceBalanceEntry,
  ResourceFlowRate,
  SimulationClock
} from "../../../shared/types/src/index.js";
import {
  loadGuildContent,
  loadRegionContent,
  loadRegionLocalityContent,
  loadRegionalEcologyProfiles,
  loadSettlementContent,
  resolveEffectiveGuildPresence,
  type GuildContentRecord,
  type GuildPresenceRecord,
  type RegionContentRecord,
  type RegionLocalityContentRecord,
  type RegionalEcologyProfileRecord,
  type SettlementContentRecord
} from "./content.js";
import { resolveCoverageDimension, resolveResourceFamilies } from "./resource-taxonomy.js";

const LEVEL_ORDER: EconomyHierarchyLevel[] = ["workplace", "building", "settlement", "subregion", "region", "continent"];
const LEVEL_INDEX = new Map(LEVEL_ORDER.map((level, index) => [level, index]));

const ECOLOGY_BAND_FACTORS: Record<string, number> = {
  none: 0.2,
  scarce: 0.45,
  limited: 0.7,
  moderate: 1,
  strong: 1.2,
  surplus: 1.45
};

const LOCALITY_CATCHMENT_FACTORS: Record<string, number> = {
  none: 0.52,
  scarce: 0.72,
  limited: 0.86,
  moderate: 1,
  strong: 1.14,
  surplus: 1.28
};

const INFRASTRUCTURE_FACTORS: Record<string, number> = {
  rudimentary: 0.75,
  frontier: 0.88,
  established: 1,
  developed: 1.14,
  civic: 1.3,
  grand: 1.5
};

const GUILD_PRESENCE_FACTORS: Record<string, number> = {
  outpost: 0.55,
  hall: 0.8,
  chapterhouse: 1.05,
  guildhouse: 1.25,
  exchange: 1.5,
  great_house: 1.85
};

interface MutableBalance {
  supplyPerTick: number;
  demandPerTick: number;
}

interface GuildRuntimeProfile {
  serviceOutputs: string[];
  demandInputs: string[];
  tradedFamilies: string[];
}

const GUILD_RUNTIME_PROFILES: Record<string, GuildRuntimeProfile> = {
  merchant_guild: {
    serviceOutputs: ["market_warehousing", "market_wares", "bureaucratic_services"],
    demandInputs: ["paper_sheet", "writing_ink", "books", "grain", "pack_support"],
    tradedFamilies: ["grain", "fruit", "fish", "hides", "fur", "tools", "minerals", "textiles", "luxury_goods"]
  },
  adventurers_guild: {
    serviceOutputs: ["frontier_contracts", "patrol_support", "frontier_security"],
    demandInputs: ["trail_meal", "utility_salve", "replacement_arms", "bolts", "arrowshafts"],
    tradedFamilies: ["cured_meat", "hides", "fur", "tools"]
  },
  agricultural_guild: {
    serviceOutputs: ["bureaucratic_services"],
    demandInputs: ["tools", "pack_support", "paper_sheet", "horse_fodder"],
    tradedFamilies: ["grain", "vegetables", "fruit", "horse_fodder", "livestock"]
  },
  herbalists_guild: {
    serviceOutputs: ["utility_salve", "copywork"],
    demandInputs: ["paper_sheet", "writing_ink", "tea", "herbs"],
    tradedFamilies: ["herbs", "tea", "fruit"]
  },
  miners_guild: {
    serviceOutputs: ["ore", "salvaged_ore"],
    demandInputs: ["tools", "pack_support", "grain", "lamp_oil"],
    tradedFamilies: ["minerals"]
  },
  masons_guild: {
    serviceOutputs: ["worked_stone", "stone_blocks"],
    demandInputs: ["tools", "pack_support", "grain"],
    tradedFamilies: ["minerals"]
  },
  smiths_guild: {
    serviceOutputs: ["forged_tools", "steel_tools", "steel_weapons"],
    demandInputs: ["charcoal", "ore", "grain"],
    tradedFamilies: ["tools", "minerals"]
  },
  woodwrights_guild: {
    serviceOutputs: ["timber", "hardwood_planks", "wagon_parts"],
    demandInputs: ["tools", "pack_support", "firewood"],
    tradedFamilies: ["wood"]
  },
  textile_guild: {
    serviceOutputs: ["cloth", "finished_cloth", "winter_cloth"],
    demandInputs: ["wool", "flax", "dyes", "paper_sheet"],
    tradedFamilies: ["textiles", "luxury_goods"]
  },
  fishers_guild: {
    serviceOutputs: ["fish", "salted_fish", "netting"],
    demandInputs: ["salt", "ship_supplies", "rope", "grain"],
    tradedFamilies: ["fish", "maritime_goods"]
  },
  rivermen_guild: {
    serviceOutputs: ["river_barge_service", "river_barges"],
    demandInputs: ["rope", "tar", "timber", "grain"],
    tradedFamilies: ["fish", "grain", "minerals", "wood"]
  },
  shipwrights_guild: {
    serviceOutputs: ["ships", "shipbuilding", "ship_supplies"],
    demandInputs: ["ship_timber", "rope", "pitch", "iron_tools"],
    tradedFamilies: ["wood", "fish", "luxury_goods"]
  },
  teamsters_guild: {
    serviceOutputs: ["pack_support", "wagon_parts", "draft_animals"],
    demandInputs: ["horse_fodder", "grain", "tools", "pack_tack"],
    tradedFamilies: ["grain", "minerals", "wood", "tools", "livestock"]
  },
  drovers_guild: {
    serviceOutputs: ["horse_stock", "cattle", "pack_animals"],
    demandInputs: ["grain", "hay", "horse_fodder", "tools"],
    tradedFamilies: ["livestock", "meat", "hides"]
  },
  scribes_guild: {
    serviceOutputs: ["copywork", "ledgers", "books", "paper_sheet", "writing_ink"],
    demandInputs: ["paper_sheet", "writing_ink", "books", "grain"],
    tradedFamilies: ["records"]
  },
  gemcutters_guild: {
    serviceOutputs: ["cut_gems", "assayed_stones", "luxury_wares"],
    demandInputs: ["gems", "tools", "paper_sheet", "grain"],
    tradedFamilies: ["minerals", "luxury_goods"]
  },
  glassworkers_guild: {
    serviceOutputs: ["glassware", "bottles", "window_glass"],
    demandInputs: ["sand", "ash", "firewood", "tools"],
    tradedFamilies: ["luxury_goods", "minerals"]
  },
  potters_guild: {
    serviceOutputs: ["ceramics", "crocks", "kilnware"],
    demandInputs: ["clay", "firewood", "tools", "grain"],
    tradedFamilies: ["minerals", "luxury_goods"]
  }
};

function roundNumber(value: number): number {
  return Number(value.toFixed(4));
}

function addFlow(balanceMap: Map<string, MutableBalance>, itemKey: string, supplyPerTick: number, demandPerTick: number): void {
  if (supplyPerTick === 0 && demandPerTick === 0) {
    return;
  }

  const existing = balanceMap.get(itemKey) ?? { supplyPerTick: 0, demandPerTick: 0 };
  existing.supplyPerTick += supplyPerTick;
  existing.demandPerTick += demandPerTick;
  balanceMap.set(itemKey, existing);
}

function mergeBalanceMaps(target: Map<string, MutableBalance>, source: Map<string, MutableBalance>): void {
  for (const [itemKey, balance] of source.entries()) {
    addFlow(target, itemKey, balance.supplyPerTick, balance.demandPerTick);
  }
}

function toFlowArray(balanceMap: Map<string, MutableBalance>): ResourceFlowRate[] {
  return [...balanceMap.entries()]
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([itemKey, balance]) => ({
      itemKey,
      supplyPerTick: roundNumber(balance.supplyPerTick),
      demandPerTick: roundNumber(balance.demandPerTick)
    }));
}

function sanitizeIdPart(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function createNodeId(level: EconomyHierarchyLevel, ...parts: string[]): string {
  return `economy.${level}.${parts.map(sanitizeIdPart).filter(Boolean).join("_")}`;
}

function toFriendlyLabel(value: string): string {
  return value
    .replace(/\./g, "_")
    .split("_")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function getPopulationFactor(settlement: SettlementContentRecord): number {
  return Math.max(0.35, settlement.populationTotal / 6000);
}

function getInfrastructureFactor(settlement: SettlementContentRecord): number {
  const base = INFRASTRUCTURE_FACTORS[settlement.infrastructureProfile.overallLevel] ?? 1;
  const lift =
    settlement.infrastructureProfile.roadTier * 0.04 +
    settlement.infrastructureProfile.waterTier * 0.03 +
    settlement.infrastructureProfile.harborTier * 0.05 +
    settlement.infrastructureProfile.marketTier * 0.05 +
    settlement.infrastructureProfile.fortificationTier * 0.01;
  return roundNumber(base + lift);
}

function getCoverageFactor(ecologyProfile: RegionalEcologyProfileRecord | undefined, itemKey: string): number {
  if (!ecologyProfile) {
    return 1;
  }

  const coverageDimension = resolveCoverageDimension(itemKey);
  return ECOLOGY_BAND_FACTORS[ecologyProfile.coverageProfile[coverageDimension]] ?? 1;
}

function getCatchmentCoverageFactor(locality: RegionLocalityContentRecord | undefined, itemKey: string): number {
  if (!locality) {
    return 1;
  }

  const families = new Set(resolveResourceFamilies(itemKey));
  const catchment = locality.resourceCatchment;
  let band = "moderate";

  if (families.has("grain") || families.has("vegetables") || families.has("fruit")) {
    band = catchment.arableLand;
  } else if (
    families.has("livestock") ||
    itemKey.includes("wool") ||
    itemKey.includes("hide") ||
    itemKey.includes("leather") ||
    itemKey.includes("horse") ||
    itemKey.includes("cattle") ||
    itemKey.includes("goat")
  ) {
    band = catchment.pasture;
  } else if (families.has("wood")) {
    band = catchment.timber;
  } else if (families.has("fish") || families.has("maritime_goods")) {
    band = catchment.fishery;
  } else if (families.has("minerals")) {
    if (itemKey.includes("salt")) {
      band = catchment.salt;
    } else if (itemKey.includes("stone") || itemKey.includes("clay")) {
      band = catchment.stone;
    } else {
      band = catchment.ore;
    }
  } else if (families.has("herbs") || families.has("tea")) {
    band = catchment.herbs;
  } else if (families.has("luxury_goods")) {
    band = catchment.specialty;
  }

  return LOCALITY_CATCHMENT_FACTORS[band] ?? 1;
}

function getTradeAccessFactor(settlement: SettlementContentRecord, locality: RegionLocalityContentRecord | undefined): number {
  const routeAccess = settlement.tradeDependencyProfile?.routeAccess ?? locality?.routeAccessModifier;
  if (!routeAccess) {
    return 1;
  }

  const average =
    (routeAccess.road + routeAccess.river + routeAccess.coastal + routeAccess.caravan + routeAccess.pass + routeAccess.seaLane) / 6;
  return roundNumber(Math.max(0.85, Math.min(1.18, 0.9 + average * 0.12)));
}

function getSurvivalProductionFactor(settlement: SettlementContentRecord): number {
  const profile = settlement.survivalModel;
  const modifier =
    0.82 +
    profile.habitationScore / 280 +
    profile.foodSecurity / 520 +
    profile.waterSecurity / 520 -
    profile.climateBurden / 900 -
    profile.hazardPressure / 850 -
    profile.infrastructureDifficulty / 1100;

  return roundNumber(Math.max(0.76, Math.min(1.2, modifier)));
}

function getSettlementEconomicSupplyFactor(settlement: SettlementContentRecord, itemKey: string): number {
  if (settlement.economicModel.localSupplyStrengths.includes(itemKey)) {
    return Math.max(1.05, settlement.economicModel.specializationWeight ?? 1);
  }
  if (settlement.domesticResourceProfile.secondaryGoods.includes(itemKey)) {
    return 1;
  }
  return 0.88;
}

function getRegionPopulationMillions(region: RegionContentRecord): number {
  return (
    region.populationProfile?.populationCapacityMillions ??
    region.populationProfile?.estimatedPopulationMillions ??
    ((region.simulationProfile?.populationCapacity ?? 0) / 1000000)
  );
}

function getSeasonalProductionFactor(itemKey: string, clock: SimulationClock): number {
  const families = new Set(resolveResourceFamilies(itemKey));

  if (families.has("grain")) {
    return clock.season === "Harvest" ? 1.35 : clock.season === "Summer" ? 1.12 : clock.season === "Winter" ? 0.72 : 0.95;
  }

  if (families.has("vegetables") || families.has("fruit") || families.has("herbs") || families.has("tea")) {
    return clock.season === "Summer" ? 1.3 : clock.season === "Harvest" ? 1.16 : clock.season === "Winter" ? 0.58 : 0.92;
  }

  if (families.has("fish") || families.has("maritime_goods")) {
    return clock.season === "Harvest" ? 1.08 : clock.season === "Winter" ? 0.9 : 1;
  }

  if (families.has("luxury_goods")) {
    return clock.season === "Harvest" ? 1.15 : 1;
  }

  return clock.season === "Winter" ? 0.92 : 1;
}

function getSeasonalDemandFactor(itemKey: string, clock: SimulationClock): number {
  const families = new Set(resolveResourceFamilies(itemKey));

  if (itemKey === "firewood" || itemKey === "charcoal" || itemKey === "winter_cloth") {
    return clock.season === "Winter" ? 1.5 : clock.season === "Withering" ? 1.22 : clock.season === "Summer" ? 0.7 : 1;
  }

  if (families.has("grain") || families.has("vegetables") || families.has("fruit") || families.has("meat")) {
    return clock.season === "Winter" ? 1.14 : clock.season === "Withering" ? 1.08 : clock.season === "Harvest" ? 0.96 : 1;
  }

  if (families.has("tea") || families.has("herbs")) {
    return clock.season === "Winter" || clock.season === "Thaw" ? 1.12 : 1;
  }

  return 1;
}

function getProductionSupportDemands(itemKey: string): Array<{ itemKey: string; weight: number }> {
  const families = new Set(resolveResourceFamilies(itemKey));

  if (families.has("grain") || families.has("vegetables") || families.has("fruit")) {
    return [
      { itemKey: "tools", weight: 0.14 },
      { itemKey: "horse_fodder", weight: 0.08 },
      { itemKey: "pack_support", weight: 0.05 }
    ];
  }

  if (families.has("fish") || families.has("maritime_goods")) {
    return [
      { itemKey: "netting", weight: 0.12 },
      { itemKey: "salt", weight: 0.08 },
      { itemKey: "ship_supplies", weight: 0.1 }
    ];
  }

  if (families.has("minerals")) {
    return [
      { itemKey: "tools", weight: 0.18 },
      { itemKey: "pack_support", weight: 0.14 },
      { itemKey: "grain", weight: 0.08 }
    ];
  }

  if (families.has("wood")) {
    return [
      { itemKey: "tools", weight: 0.16 },
      { itemKey: "pack_support", weight: 0.1 }
    ];
  }

  if (families.has("textiles")) {
    return [
      { itemKey: "tools", weight: 0.08 },
      { itemKey: "dyes", weight: 0.06 }
    ];
  }

  if (families.has("luxury_goods")) {
    return [
      { itemKey: "casks", weight: 0.12 },
      { itemKey: "firewood", weight: 0.08 },
      { itemKey: "tools", weight: 0.06 }
    ];
  }

  if (families.has("records")) {
    return [
      { itemKey: "paper_sheet", weight: 0.18 },
      { itemKey: "writing_ink", weight: 0.12 }
    ];
  }

  return [{ itemKey: "tools", weight: 0.1 }];
}

function buildWorkplaceNode(
  settlement: SettlementContentRecord,
  locality: RegionLocalityContentRecord | undefined,
  ecologyProfile: RegionalEcologyProfileRecord | undefined,
  itemKey: string,
  role: "primary" | "secondary",
  clock: SimulationClock
): EconomyNodeState {
  const balanceMap = new Map<string, MutableBalance>();
  const baseWeight = role === "primary" ? 1.45 : 0.92;
  const specializationFactor = getSettlementEconomicSupplyFactor(settlement, itemKey);
  const tradeAccessFactor = getTradeAccessFactor(settlement, locality);
  const survivalFactor = getSurvivalProductionFactor(settlement);
  const supplyRate =
    getPopulationFactor(settlement) *
    getInfrastructureFactor(settlement) *
    getCoverageFactor(ecologyProfile, itemKey) *
    getCatchmentCoverageFactor(locality, itemKey) *
    getSeasonalProductionFactor(itemKey, clock) *
    specializationFactor *
    tradeAccessFactor *
    survivalFactor *
    baseWeight;

  addFlow(balanceMap, itemKey, supplyRate, 0);
  for (const support of getProductionSupportDemands(itemKey)) {
    if (support.itemKey !== itemKey) {
      addFlow(balanceMap, support.itemKey, 0, supplyRate * support.weight);
    }
  }

  const directFlows = toFlowArray(balanceMap);
  return {
    id: createNodeId("workplace", settlement.slug, role, itemKey),
    level: "workplace",
    displayName: `${settlement.name} ${toFriendlyLabel(itemKey)} ${role === "primary" ? "Works" : "Shops"}`,
    parentNodeId: createNodeId("settlement", settlement.slug),
    settlementId: settlement.id,
    regionId: settlement.regionId,
    tags: ["workplace", role, ...settlement.purposeTags],
    directFlows,
    sourceRecordType: "workplace",
    sourceRecordId: settlement.id,
    tradeCapacityPerTick: roundNumber(supplyRate * 0.55 * tradeAccessFactor + settlement.infrastructureProfile.marketTier * 0.35),
    reserveRatio: role === "primary" ? 0.22 : 0.18
  };
}

function addDemand(balanceMap: Map<string, MutableBalance>, itemKey: string, baseRate: number, clock: SimulationClock): void {
  addFlow(balanceMap, itemKey, 0, baseRate * getSeasonalDemandFactor(itemKey, clock));
}

function buildSettlementNode(
  settlement: SettlementContentRecord,
  locality: RegionLocalityContentRecord | undefined,
  parentNodeId: string,
  clock: SimulationClock
): EconomyNodeState {
  const balanceMap = new Map<string, MutableBalance>();
  const populationFactor = getPopulationFactor(settlement);
  const infra = settlement.infrastructureProfile;
  const guildCount = resolveEffectiveGuildPresence(settlement.guildPresence ?? []).length;
  const demandBias = 1 + settlement.tradeDependencyProfile.importBias * 0.22;
  const tradeAccessFactor = getTradeAccessFactor(settlement, locality);
  const survivalRelief = Math.max(0.8, Math.min(1.15, 1 + (settlement.survivalModel.foodSecurity - 50) / 500 + (settlement.survivalModel.waterSecurity - 50) / 600));

  addDemand(balanceMap, "grain", populationFactor * 0.95 * demandBias, clock);
  addDemand(balanceMap, "vegetables", populationFactor * 0.55 * demandBias, clock);
  addDemand(balanceMap, settlement.identityTags.some((tag) => tag.includes("coastal") || tag.includes("port")) ? "fish" : "cured_meat", populationFactor * 0.22, clock);
  addDemand(balanceMap, "firewood", populationFactor * (0.22 + settlement.survivalModel.climateBurden / 220), clock);
  addDemand(balanceMap, "tools", populationFactor * 0.11, clock);
  addDemand(balanceMap, "cloth", populationFactor * (0.06 + settlement.tradeDependencyProfile.importBias * 0.05), clock);
  addDemand(balanceMap, "herbs", populationFactor * 0.04, clock);
  addDemand(balanceMap, "tea", populationFactor * (infra.marketTier >= 2 ? 0.035 : 0.015), clock);

  if (infra.roadTier >= 2 || settlement.purposeTags.includes("regional_trade") || settlement.tradeDependencyProfile.routeAccess.caravan >= 0.9) {
    addDemand(balanceMap, "horse_fodder", populationFactor * 0.08, clock);
    addDemand(balanceMap, "pack_support", populationFactor * 0.06, clock);
  }

  if (infra.fortificationTier >= 2 || settlement.identityTags.some((tag) => tag.includes("fort") || tag.includes("watch"))) {
    addDemand(balanceMap, "replacement_arms", populationFactor * 0.05, clock);
    addDemand(balanceMap, "bolts", populationFactor * 0.04, clock);
    addFlow(balanceMap, settlement.identityTags.some((tag) => tag.includes("coastal")) ? "coastal_security" : "frontier_security", populationFactor * 0.08, 0);
  }

  if (settlement.administrativeRole !== "none") {
    addFlow(balanceMap, "civic_services", populationFactor * 0.09, 0);
    addFlow(balanceMap, "bureaucratic_services", populationFactor * 0.08, 0);
    addDemand(balanceMap, "paper_sheet", populationFactor * 0.05 + guildCount * 0.02, clock);
    addDemand(balanceMap, "writing_ink", populationFactor * 0.03 + guildCount * 0.015, clock);
    addDemand(balanceMap, "books", populationFactor * 0.02 + guildCount * 0.01, clock);
  }

  if (infra.marketTier >= 2) {
    addFlow(balanceMap, "market_wares", populationFactor * 0.07, 0);
    addFlow(balanceMap, "toll_services", populationFactor * (infra.roadTier + infra.marketTier) * 0.015, 0);
  }

  if (infra.harborTier >= 2) {
    addFlow(balanceMap, "beacon_service", populationFactor * 0.05, 0);
    addFlow(balanceMap, "ship_supplies", populationFactor * 0.03, 0);
  }

  for (const demandedGood of settlement.economicModel.demandPressures) {
    addDemand(balanceMap, demandedGood, populationFactor * (0.16 + settlement.tradeDependencyProfile.importBias * 0.16), clock);
  }

  const directFlows = toFlowArray(balanceMap);
  const totalSupply = directFlows.reduce((sum, flow) => sum + flow.supplyPerTick, 0);
  return {
    id: createNodeId("settlement", settlement.slug),
    level: "settlement",
    displayName: settlement.name,
    parentNodeId,
    settlementId: settlement.id,
    regionId: settlement.regionId,
    tags: ["settlement", settlement.settlementType, ...settlement.identityTags, ...settlement.purposeTags],
    directFlows,
    sourceRecordType: "settlement",
    sourceRecordId: settlement.id,
    tradeCapacityPerTick: roundNumber(
      populationFactor * (infra.marketTier * 1.2 + infra.roadTier * 0.9 + infra.waterTier * 0.6 + infra.harborTier * 1.1) * tradeAccessFactor * survivalRelief +
        totalSupply * 0.15 +
        settlement.tradeDependencyProfile.exportBias * 1.4
    ),
    reserveRatio: 0.12
  };
}

function buildContinentNode(region: RegionContentRecord, activeRegionCount: number): EconomyNodeState {
  const populationMillions = getRegionPopulationMillions(region);
  return {
    id: createNodeId("continent", region.id),
    level: "continent",
    displayName: `${region.name} Ledger`,
    parentNodeId: null,
    tags: ["continent", region.regionType, ...region.tags],
    directFlows: [],
    sourceRecordType: "region",
    sourceRecordId: region.id,
    tradeCapacityPerTick: roundNumber(Math.max(12, populationMillions * 0.35 + activeRegionCount * 6)),
    reserveRatio: 0.03
  };
}

function getGuildTierMultiplier(guild: GuildContentRecord | undefined, presenceLevel: string): number {
  const fromPresence = GUILD_PRESENCE_FACTORS[presenceLevel] ?? 0.8;
  const matchingTier = guild?.facilityTiers.find((tier) => tier.presenceLevel === presenceLevel);
  return matchingTier ? roundNumber(fromPresence + matchingTier.staffCapacity * 0.015) : fromPresence;
}

function buildGuildNode(
  settlement: SettlementContentRecord,
  guildPresence: GuildPresenceRecord,
  guildDefinition: GuildContentRecord | undefined,
  clock: SimulationClock
): EconomyNodeState {
  const balanceMap = new Map<string, MutableBalance>();
  const populationFactor = getPopulationFactor(settlement);
  const infraFactor = getInfrastructureFactor(settlement);
  const runtimeProfile = GUILD_RUNTIME_PROFILES[guildPresence.guildType] ?? {
    serviceOutputs: ["market_wares"],
    demandInputs: ["paper_sheet"],
    tradedFamilies: []
  };
  const tierMultiplier = getGuildTierMultiplier(guildDefinition, guildPresence.presenceLevel);
  const settlementGoods = [...settlement.domesticResourceProfile.primaryGoods, ...settlement.domesticResourceProfile.secondaryGoods];
  const settlementDemandedGoods = settlement.domesticResourceProfile.demandedGoods;
  const genericSupplyWeight = guildDefinition?.questBoardProfile?.allowMemberSales ? 0.07 : 0.04;
  const genericDemandWeight = guildDefinition?.questBoardProfile?.tracksAllResources ? 0.05 : 0.02;
  const focusedSupplyWeight = guildDefinition?.questBoardProfile?.allowMemberSales ? 0.16 : 0.1;
  const focusedDemandWeight = 0.08;

  for (const serviceOutput of runtimeProfile.serviceOutputs) {
    addFlow(balanceMap, serviceOutput, populationFactor * infraFactor * tierMultiplier * 0.08, 0);
  }

  for (const demandInput of runtimeProfile.demandInputs) {
    addDemand(balanceMap, demandInput, populationFactor * tierMultiplier * 0.06, clock);
  }

  for (const producedGood of settlementGoods) {
    const families = new Set(resolveResourceFamilies(producedGood));
    if (guildDefinition?.questBoardProfile?.tracksAllResources) {
      addFlow(balanceMap, producedGood, populationFactor * tierMultiplier * genericSupplyWeight, 0);
    }
    if (runtimeProfile.tradedFamilies.some((family) => families.has(family))) {
      addFlow(balanceMap, producedGood, populationFactor * tierMultiplier * focusedSupplyWeight, 0);
    }
  }

  for (const demandedGood of settlementDemandedGoods) {
    const families = new Set(resolveResourceFamilies(demandedGood));
    if (guildDefinition?.questBoardProfile?.tracksAllResources) {
      addDemand(balanceMap, demandedGood, populationFactor * tierMultiplier * genericDemandWeight, clock);
    }
    if (runtimeProfile.tradedFamilies.some((family) => families.has(family))) {
      addDemand(balanceMap, demandedGood, populationFactor * tierMultiplier * focusedDemandWeight, clock);
    }
  }

  const directFlows = toFlowArray(balanceMap);
  const totalSupply = directFlows.reduce((sum, flow) => sum + flow.supplyPerTick, 0);
  return {
    id: createNodeId("building", settlement.slug, guildPresence.guildType, guildPresence.presenceLevel),
    level: "building",
    displayName: guildPresence.name,
    parentNodeId: createNodeId("settlement", settlement.slug),
    settlementId: settlement.id,
    regionId: settlement.regionId,
    tags: ["building", "guild_hall", guildPresence.guildType, guildPresence.presenceLevel, ...guildPresence.functions],
    directFlows,
    sourceRecordType: "building",
    sourceRecordId: guildDefinition?.id ?? settlement.id,
    tradeCapacityPerTick: roundNumber(totalSupply * 0.7 + tierMultiplier * 1.8),
    reserveRatio: 0.08
  };
}

function buildRegionNode(level: "subregion" | "region", region: RegionContentRecord, parentNodeId: string | null, settlementCount: number): EconomyNodeState {
  const balanceMap = new Map<string, MutableBalance>();
  const estimatedPopulation = getRegionPopulationMillions(region);
  const densityFactor =
    region.simulationProfile?.densityBand === "very_high" || region.populationProfile?.densityBand === "very_high"
      ? 1.4
      : region.simulationProfile?.densityBand === "high" || region.populationProfile?.densityBand === "high"
        ? 1.2
        : region.simulationProfile?.densityBand === "low" || region.populationProfile?.densityBand === "low"
          ? 0.8
          : region.simulationProfile?.densityBand === "very_low" || region.populationProfile?.densityBand === "very_low"
            ? 0.6
            : 1;

  const exportBias = region.economicProfile?.exportBias ?? 0.5;
  const importBias = region.economicProfile?.importBias ?? 0.5;

  for (const itemKey of region.economicProfile?.supplyStrengths ?? region.economicProfile?.majorExports ?? []) {
    addFlow(balanceMap, itemKey, estimatedPopulation * densityFactor * (0.08 + exportBias * 0.08), 0);
  }

  for (const itemKey of region.economicProfile?.demandPressures ?? region.economicProfile?.majorImports ?? []) {
    addFlow(balanceMap, itemKey, 0, estimatedPopulation * densityFactor * (0.06 + importBias * 0.07));
  }

  const directFlows = toFlowArray(balanceMap);
  return {
    id: createNodeId(level, region.id),
    level,
    displayName: region.name,
    parentNodeId,
    regionId: region.id,
    tags: [level, region.regionType, ...region.tags],
    directFlows,
    sourceRecordType: "region",
    sourceRecordId: region.id,
    tradeCapacityPerTick: roundNumber(Math.max(directFlows.reduce((sum, flow) => sum + flow.supplyPerTick, 0) * 0.4, settlementCount * 2.5)),
    reserveRatio: 0.06
  };
}

export function buildEconomyStateFromContent(settlementIds: string[], clock: SimulationClock): { economy: CivilizationEconomyState; warnings: string[] } {
  const warnings: string[] = [];
  const settlements = loadSettlementContent();
  const guilds = loadGuildContent();
  const regions = loadRegionContent();
  const localities = loadRegionLocalityContent();
  const ecologyProfiles = loadRegionalEcologyProfiles();

  const settlementById = new Map(settlements.map((record) => [record.id, record]));
  const guildBySlug = new Map(guilds.map((record) => [record.slug, record]));
  const regionById = new Map(regions.map((record) => [record.id, record]));
  const localityById = new Map(localities.map((record) => [record.id, record]));
  const ecologyByRegionId = new Map(ecologyProfiles.map((record) => [record.regionId, record]));

  const activeSettlements = settlementIds
    .map((settlementId) => settlementById.get(settlementId) ?? null)
    .filter((record): record is SettlementContentRecord => record !== null);

  for (const settlementId of settlementIds) {
    if (!settlementById.has(settlementId)) {
      warnings.push(`Economy bootstrap skipped missing settlement content ${settlementId}.`);
    }
  }

  const nodes: EconomyNodeState[] = [];
  const macroRegionIds = new Set(activeSettlements.map((settlement) => settlement.macroRegionId));
  const subregionIds = new Set(activeSettlements.filter((settlement) => settlement.regionId !== settlement.macroRegionId).map((settlement) => settlement.regionId));

  for (const macroRegionId of [...macroRegionIds].sort()) {
    const region = regionById.get(macroRegionId);
    if (region) {
      const activeRegionCount = activeSettlements.filter((settlement) => settlement.macroRegionId === macroRegionId).length;
      nodes.push(buildContinentNode(region, activeRegionCount));
    } else {
      warnings.push(`Economy bootstrap could not resolve macro region ${macroRegionId}.`);
    }
  }

  for (const subregionId of [...subregionIds].sort()) {
    const region = regionById.get(subregionId);
    if (region) {
      const settlementCount = activeSettlements.filter((settlement) => settlement.regionId === subregionId).length;
      nodes.push(buildRegionNode("region", region, createNodeId("continent", region.parentRegionId ?? subregionId), settlementCount));
    }
  }

  for (const settlement of activeSettlements) {
    const ecologyProfile = ecologyByRegionId.get(settlement.regionId) ?? ecologyByRegionId.get(settlement.macroRegionId);
    const locality = localityById.get(settlement.localityBandId);
    if (!locality) {
      warnings.push(`Economy bootstrap could not resolve locality ${settlement.localityBandId} for settlement ${settlement.id}.`);
    }
    for (const primaryGood of settlement.domesticResourceProfile.primaryGoods) {
      nodes.push(buildWorkplaceNode(settlement, locality, ecologyProfile, primaryGood, "primary", clock));
    }
    for (const secondaryGood of settlement.domesticResourceProfile.secondaryGoods) {
      nodes.push(buildWorkplaceNode(settlement, locality, ecologyProfile, secondaryGood, "secondary", clock));
    }
    for (const guildPresence of resolveEffectiveGuildPresence(settlement.guildPresence ?? [])) {
      nodes.push(buildGuildNode(settlement, guildPresence, guildBySlug.get(guildPresence.guildType), clock));
    }
    const settlementParentNodeId =
      settlement.regionId !== settlement.macroRegionId ? createNodeId("region", settlement.regionId) : createNodeId("continent", settlement.macroRegionId);
    nodes.push(buildSettlementNode(settlement, locality, settlementParentNodeId, clock));
  }

  return {
    economy: {
      nodes,
      lastSnapshots: [],
      lastLevelTotals: [],
      marketStates: [],
      lastComputedTick: clock.tick
    },
    warnings
  };
}

function toResourceBalances(balanceMap: Map<string, MutableBalance>, node: EconomyNodeState): ResourceBalanceEntry[] {
  const nodeTradeCapacity = Math.max(0, node.tradeCapacityPerTick ?? Number.POSITIVE_INFINITY);
  const reserveRatio = Math.min(0.95, Math.max(0, node.reserveRatio ?? 0));

  return [...balanceMap.entries()]
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([itemKey, balance]) => {
      const netPerTick = balance.supplyPerTick - balance.demandPerTick;
      const surplusPerTick = Math.max(netPerTick, 0);
      const shortfallPerTick = Math.max(-netPerTick, 0);
      const reservePerTick = surplusPerTick * reserveRatio;
      const candidateTradeSurplus = Math.max(surplusPerTick - reservePerTick, 0);
      const tradeCapacityPerTick = Number.isFinite(nodeTradeCapacity) ? Math.min(nodeTradeCapacity, candidateTradeSurplus) : candidateTradeSurplus;

      return {
        itemKey,
        supplyPerTick: roundNumber(balance.supplyPerTick),
        demandPerTick: roundNumber(balance.demandPerTick),
        netPerTick: roundNumber(netPerTick),
        surplusPerTick: roundNumber(surplusPerTick),
        shortfallPerTick: roundNumber(shortfallPerTick),
        reservePerTick: roundNumber(reservePerTick),
        tradeCapacityPerTick: roundNumber(Math.max(0, tradeCapacityPerTick)),
        tradeSurplusPerTick: roundNumber(Math.max(0, tradeCapacityPerTick)),
        unmetDemandPerTick: roundNumber(shortfallPerTick)
      };
    });
}

export function aggregateEconomyHierarchy(state: CivilizationEconomyState): { snapshots: EconomyLedgerSnapshot[]; warnings: string[] } {
  const warnings: string[] = [];
  const nodeMap = new Map<string, EconomyNodeState>();
  const balanceMaps = new Map<string, Map<string, MutableBalance>>();

  for (const node of state.nodes) {
    nodeMap.set(node.id, node);
    const ownBalances = new Map<string, MutableBalance>();
    for (const flow of node.directFlows) {
      addFlow(ownBalances, flow.itemKey, flow.supplyPerTick, flow.demandPerTick);
    }
    balanceMaps.set(node.id, ownBalances);
  }

  const orderedNodes = [...state.nodes].sort((left, right) => {
    const leftIndex = LEVEL_INDEX.get(left.level) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = LEVEL_INDEX.get(right.level) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex || left.id.localeCompare(right.id);
  });

  for (const node of orderedNodes) {
    if (!node.parentNodeId) {
      continue;
    }

    const parent = nodeMap.get(node.parentNodeId);
    if (!parent) {
      warnings.push(`Economy node ${node.id} is missing parent ${node.parentNodeId}.`);
      continue;
    }

    const nodeBalances = balanceMaps.get(node.id) ?? new Map<string, MutableBalance>();
    const parentBalances = balanceMaps.get(parent.id) ?? new Map<string, MutableBalance>();
    mergeBalanceMaps(parentBalances, nodeBalances);
    balanceMaps.set(parent.id, parentBalances);
  }

  const snapshots = orderedNodes.map((node) => {
    const balances = toResourceBalances(balanceMaps.get(node.id) ?? new Map<string, MutableBalance>(), node);
    return {
      level: node.level,
      nodeId: node.id,
      displayName: node.displayName,
      parentNodeId: node.parentNodeId,
      settlementId: node.settlementId,
      regionId: node.regionId,
      sourceRecordType: node.sourceRecordType,
      sourceRecordId: node.sourceRecordId,
      totalSupplyPerTick: roundNumber(balances.reduce((sum, balance) => sum + balance.supplyPerTick, 0)),
      totalDemandPerTick: roundNumber(balances.reduce((sum, balance) => sum + balance.demandPerTick, 0)),
      totalSurplusPerTick: roundNumber(balances.reduce((sum, balance) => sum + balance.surplusPerTick, 0)),
      totalShortfallPerTick: roundNumber(balances.reduce((sum, balance) => sum + balance.shortfallPerTick, 0)),
      totalReservePerTick: roundNumber(balances.reduce((sum, balance) => sum + balance.reservePerTick, 0)),
      totalTradeCapacityPerTick: roundNumber(balances.reduce((sum, balance) => sum + balance.tradeCapacityPerTick, 0)),
      totalTradeSurplusPerTick: roundNumber(balances.reduce((sum, balance) => sum + balance.tradeSurplusPerTick, 0)),
      balances
    };
  });

  return { snapshots, warnings };
}

export function summarizeEconomyLevels(snapshots: EconomyLedgerSnapshot[]): EconomyLevelTotals[] {
  return LEVEL_ORDER.map((level) => {
    const matchingSnapshots = snapshots.filter((snapshot) => snapshot.level === level);
    return {
      level,
      nodeCount: matchingSnapshots.length,
      totalSupplyPerTick: roundNumber(matchingSnapshots.reduce((sum, snapshot) => sum + snapshot.totalSupplyPerTick, 0)),
      totalDemandPerTick: roundNumber(matchingSnapshots.reduce((sum, snapshot) => sum + snapshot.totalDemandPerTick, 0)),
      totalSurplusPerTick: roundNumber(matchingSnapshots.reduce((sum, snapshot) => sum + snapshot.totalSurplusPerTick, 0)),
      totalShortfallPerTick: roundNumber(matchingSnapshots.reduce((sum, snapshot) => sum + snapshot.totalShortfallPerTick, 0)),
      totalReservePerTick: roundNumber(matchingSnapshots.reduce((sum, snapshot) => sum + snapshot.totalReservePerTick, 0)),
      totalTradeCapacityPerTick: roundNumber(matchingSnapshots.reduce((sum, snapshot) => sum + snapshot.totalTradeCapacityPerTick, 0)),
      totalTradeSurplusPerTick: roundNumber(matchingSnapshots.reduce((sum, snapshot) => sum + snapshot.totalTradeSurplusPerTick, 0))
    };
  });
}
