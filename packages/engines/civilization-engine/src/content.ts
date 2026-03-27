import { readFileSync } from "node:fs";
import type { QuestTemplateCategory } from "../../../shared/types/src/index.js";

export interface GuildFacilityTierRecord {
  tier: number;
  label: string;
  presenceLevel: string;
  staffCapacity: number;
  dormitoryCapacity: number;
  stableCapacity: number;
  kitchenScale: string;
  workshopScale: string;
  storehouseScale: string;
  autonomy: string;
  serviceTags: string[];
}

export interface GuildContentRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary?: string;
  governsActivities: string[];
  excludedActivities?: string[];
  contractTypes?: string[];
  typicalPresenceLevels?: string[];
  typicalSettlementTags: string[];
  membershipModel: {
    entryMethod: string;
    buyInRequirement?: string;
    entryRequirements: string[];
    benefits: string[];
    memberObligations: string[];
    notes?: string;
  };
  questBoardProfile: {
    enabled: boolean;
    questCategories: QuestTemplateCategory[];
    tracksAllResources: boolean;
    allowMemberSales: boolean;
    demandFocusTags: string[];
    supplyFocusTags: string[];
  };
  facilityTiers: GuildFacilityTierRecord[];
}

export interface GuildPresenceRecord {
  guildType: string;
  name: string;
  presenceLevel: string;
  functions: string[];
  notes: string;
}

export interface SettlementContentRecord {
  id: string;
  slug: string;
  name: string;
  macroRegionId: string;
  regionId: string;
  localityBandId: string;
  hexAnchorId: string;
  settlementType: string;
  siteClass: "surface" | "subterranean" | "underwater";
  terrainContext: string;
  populationBand: string;
  populationTotal: number;
  administrativeRole: string;
  summary?: string;
  siteContext?: string;
  parentSettlementId?: string;
  dependencyRole?: string;
  identityTags: string[];
  purposeTags: string[];
  economicModel: {
    dominantRole: string;
    secondaryRoles: string[];
    localSupplyStrengths: string[];
    demandPressures: string[];
    specializationWeight: number;
  };
  survivalModel: {
    habitationScore: number;
    foodSecurity: number;
    waterSecurity: number;
    climateBurden: number;
    hazardPressure: number;
    infrastructureDifficulty: number;
  };
  tradeDependencyProfile: {
    importBias: number;
    exportBias: number;
    dependencyBand: "low" | "moderate" | "high";
    stapleImports: string[];
    exportFocus: string[];
    routeAccess: {
      road: number;
      river: number;
      coastal: number;
      caravan: number;
      pass: number;
      seaLane: number;
    };
  };
  infrastructureProfile: {
    overallLevel: string;
    roadTier: number;
    waterTier: number;
    fortificationTier: number;
    harborTier: number;
    marketTier: number;
  };
  domesticResourceProfile: {
    primaryGoods: string[];
    secondaryGoods: string[];
    demandedGoods: string[];
  };
  domesticTradeFlows: Array<{
    partnerSettlementId: string;
    direction: "exports_to" | "imports_from" | "exchange_with";
    goods: string[];
    routeModes: string[];
    notes: string;
  }>;
  guildPresence: GuildPresenceRecord[];
  visualMapRef?: {
    mapId: string;
    pixelX: number;
    pixelY: number;
    climateZoneId: string;
    biomeZoneId: string;
    notes?: string;
  };
}

export interface WorldMapContentRecord {
  id: string;
  slug: string;
  name: string;
  mapType: string;
  continentRegionIds: string[];
  islandSystemRegionIds: string[];
  oceanRegionIds: string[];
  totalPopulationMillions?: number;
}

export interface QuestTemplateRecord {
  id: string;
  slug: string;
  name: string;
  category: QuestTemplateCategory;
  summary: string;
  issuingGuildTypes: string[];
  allowAdventurersFallback: boolean;
  generationSource: "shortfall" | "surplus" | "security" | "frontier";
  targetItemKeys: string[];
  targetSettlementTags: string[];
  monsterIds: string[];
  minimumQuantity: number;
  minimumShortfallPerTick: number;
  minimumTradeSurplusPerTick: number;
  rewardProfile: {
    coinBase: number;
    reputationBase: number;
    bonusItemKeys: string[];
  };
}

export interface QuestDefinitionRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  giver: {
    type: string;
    entityId: string;
    displayName: string;
    contactName: string;
    settlementId: string;
  };
  requirements: Record<string, unknown>;
  scheduling: Record<string, unknown>;
  classification: Record<string, unknown>;
  deployment: Record<string, unknown>;
  logistics: Record<string, unknown>;
  rewards: Record<string, unknown>;
  miscNotes: string[];
  actionTree: {
    entryNodeId: string;
    completionNodeIds: string[];
    nodes: Array<Record<string, unknown>>;
  };
}

export interface QuestArchetypeRecord {
  id: string;
  slug: string;
  name: string;
  questType: string;
  summary: string;
  typicalGiverTypes: string[];
  commonGuildTypes: string[];
  encounterMonsterIds: string[];
  baselineRequirements: Record<string, unknown>;
  classification: Record<string, unknown>;
  deployment: Record<string, unknown>;
  logistics: Record<string, unknown>;
  outcomeMetrics: Array<Record<string, unknown>>;
  failureStates: Array<Record<string, unknown>>;
  rewardDrivers: string[];
  scalingAxes: string[];
  actionTree: {
    entryNodeId: string;
    completionNodeIds: string[];
    nodes: Array<Record<string, unknown>>;
  };
}

export interface MonsterContentRecord {
  id: string;
  slug: string;
  name: string;
  monsterClass: string;
  threat: string;
  summary: string;
  habitatTags: string[];
  behaviorTags: string[];
  drops: Array<{
    itemKey: string;
    quantityMin: number;
    quantityMax: number;
    chance: number;
  }>;
  loot: Array<{
    itemKey: string;
    chance: number;
  }>;
}

export interface RegionContentRecord {
  id: string;
  slug: string;
  name: string;
  regionType: "continent" | "subregion" | "island_system" | "ocean";
  parentRegionId?: string;
  tags: string[];
  environmentProfile?: {
    dominantBiomeMix: string[];
    elevationProfile: string;
    climateTendencies: string;
    freshwaterAvailability: string;
    climateSeverity: string;
    agriculturalPotential: string;
    extractivePotential: string;
    hazardLevel: string;
  };
  simulationProfile?: {
    habitationScore: number;
    foodProductionCapacity: number;
    waterAvailability: number;
    climateBurden: number;
    hazardPressure: number;
    infrastructureDifficulty: number;
    populationCapacity: number;
    densityBand: "very_high" | "high" | "moderate" | "low" | "very_low";
  };
  populationProfile?: {
    densityBand?: "very_high" | "high" | "moderate" | "low" | "very_low";
    settlementPattern?: string;
    estimatedPopulationMillions?: number;
    populationCapacityMillions?: number;
    urbanPopulationPercent?: number;
    ruralPopulationPercent?: number;
  };
  economicProfile?: {
    majorExports?: string[];
    majorImports?: string[];
    supplyStrengths?: string[];
    demandPressures?: string[];
    importBias?: number;
    exportBias?: number;
    resourceDiversityBand?: "very_high" | "high" | "moderate" | "low" | "very_low";
  };
  settlementDistributionModel?: {
    targetCounts: {
      city: number;
      town: number;
      village: number;
      outpost: number;
      strategic_site: number;
    };
    generationRules: {
      asymmetryMode: string;
      survivabilityDriver: string;
      settlementPattern: string;
    };
  };
}

export interface RegionalEcologyProfileRecord {
  id: string;
  slug: string;
  name: string;
  regionId: string;
  coverageProfile: {
    stapleCrops: string;
    herdAndGame: string;
    maritimeFoods: string;
    timberAndFiber: string;
    metalsAndStone: string;
    herbsAndReagents: string;
    luxuryGoods: string;
  };
  simulationProfile: {
    habitationScore: number;
    foodProductionCapacity: number;
    waterAvailability: number;
    climateBurden: number;
    hazardPressure: number;
    infrastructureDifficulty: number;
    populationCapacity: number;
    densityBand: "very_high" | "high" | "moderate" | "low" | "very_low";
  };
  resourceDiversityBand: "very_high" | "high" | "moderate" | "low" | "very_low";
  supplyStrengths: string[];
  demandPressures: string[];
  importBias: number;
  exportBias: number;
}

export interface RegionLocalityContentRecord {
  id: string;
  slug: string;
  name: string;
  macroRegionId: string;
  regionId: string;
  localityType: string;
  summary: string;
  habitationScoreModifier: number;
  resourceCatchment: {
    arableLand: string;
    pasture: string;
    timber: string;
    fishery: string;
    stone: string;
    ore: string;
    salt: string;
    herbs: string;
    specialty: string;
  };
  settlementSuitability: {
    settlementWeight: number;
    maxPopulationBand: string;
    strategicSiteWeight: number;
    favoredSettlementTypes: string[];
  };
  routeAccessModifier: {
    road: number;
    river: number;
    coastal: number;
    caravan: number;
    pass: number;
    seaLane: number;
  };
  dominantIndustries: string[];
  supportedSiteClasses: Array<"surface" | "subterranean" | "underwater">;
}

export interface ResourceEcologyProfileRecord {
  compatibleBiomeIds?: string[];
  compatibleClimateBands?: string[];
  compatibleElevationBands?: string[];
  compatibleLocalityTags?: string[];
  freshwaterAffinity?: "none" | "stream" | "river" | "coast" | "marsh" | "any";
  rarityTendency?: "abundant" | "common" | "uncommon" | "rare";
}

export interface BiomeContentRecord {
  id: string;
  slug: string;
  name: string;
  climateBand: string;
  baseFertility: number;
  hazards: string[];
}

export interface HabitatContentRecord {
  id: string;
  slug: string;
  name: string;
  shape: string;
  biomeId?: string;
  biomeIds?: string[];
}

export interface FloraContentRecord {
  id: string;
  slug: string;
  name: string;
  type: string;
  habitatIds: string[];
  ecologyProfile?: ResourceEcologyProfileRecord;
  template?: Record<string, unknown>;
}

export interface FaunaContentRecord {
  id: string;
  slug: string;
  name: string;
  type: string;
  habitatIds: string[];
  dangerClass: string;
  ecologyProfile?: ResourceEcologyProfileRecord;
  template?: Record<string, unknown>;
}

export interface MineralContentRecord {
  id: string;
  slug: string;
  itemKey: string;
  name: string;
  tier: number;
  depositForms: string[];
  extractionTypes: string[];
  ecologyProfile?: ResourceEcologyProfileRecord;
}

export interface WorldHexContentRecord {
  id: string;
  slug: string;
  regionId: string;
  localityBandId: string;
  biomeFamily: string;
  elevationBand: string;
  terrainType: string;
  freshwaterType: "none" | "stream" | "river" | "coast" | "marsh";
  habitabilityScore: number;
  frictionByMode: Record<string, number>;
  barrierTags: string[];
  hazardTags: string[];
  resourceAffinityTags: string[];
  anchoredSettlementIds: string[];
}

export interface WorldHexEdgeContentRecord {
  id: string;
  fromHexId: string;
  toHexId: string;
  edgeType: string;
  hexSpan: number;
  routeQuality: string;
  crossingDifficulty: number;
  barrierTags: string[];
  allowedTravelModes: string[];
  directionFrom: string;
  directionTo: string;
  corridorName: string;
  terrainTags?: string[];
  featureTags?: string[];
}

export interface TravelModeProfileRecord {
  id: string;
  name: string;
  domain: "land" | "water";
  baseMilesPerDay: number;
  baseKilometersPerDay?: number;
  allowedEdgeTypes?: string[];
  barrierSensitivity?: "low" | "moderate" | "high" | "very_high";
  notes: string;
}

export interface TravelTimeEstimateRecord {
  modeId: string;
  expectedDays: number;
  varianceDays: number;
}

export interface TravelVarianceRuleRecord {
  tag: string;
  name: string;
  summary: string;
  modeEffects: Array<{
    modeId: string;
    speedMultiplier: number;
    variancePercent: number;
  }>;
}

export interface TravelRouteRecord {
  id: string;
  name: string;
  fromSettlementId: string;
  toSettlementId: string;
  routeClass: string;
  routeType?: string;
  availableModeIds: string[];
  notes: string;
  terrainTags: string[];
  featureTags: string[];
  distanceMiles: number;
  travelTimeEstimates: TravelTimeEstimateRecord[];
  orderedHexIds?: string[];
  edgeIds?: string[];
  accessRequirements?: string[];
  signage?: {
    corridorName?: string;
    forward?: string;
    reverse?: string;
  };
  intraHexDistanceKm?: number;
  seaRegionIds?: string[];
}

export interface TravelNetworkContentRecord {
  id: string;
  slug: string;
  name: string;
  mapId?: string;
  summary: string;
  modeProfiles: TravelModeProfileRecord[];
  travelBenchmarks: Array<{
    modeId: string;
    summary: string;
    examples: Array<{
      distanceKilometers: number;
      distanceMiles: number;
      expectedDaysMin: number;
      expectedDaysMax: number;
    }>;
  }>;
  terrainVarianceRules: TravelVarianceRuleRecord[];
  featureVarianceRules: TravelVarianceRuleRecord[];
  routeRecords: TravelRouteRecord[];
  interPortShipRoutes: TravelRouteRecord[];
}

export interface TransportHarnessProfileRecord {
  id: string;
  name: string;
  supportedTransportTypes: Array<"foot" | "mounted" | "vehicle" | "ship">;
  compatibleAnimalIds: string[];
  efficiencyModifier: number;
  notes: string;
}

export interface TransportAnimalProfileRecord {
  id: string;
  slug: string;
  name: string;
  compatibleHarnessIds: string[];
  pullStrength: number;
  packCapacityUnits: number;
  speedModifier: number;
  enduranceHours: number;
  inclineHandling: number;
  sprintFactor: number;
  diminishingExponent: number;
  notes: string;
}

export interface TransportVehicleProfileRecord {
  id: string;
  slug: string;
  name: string;
  transportType: "vehicle" | "ship";
  propulsionType: "human" | "draft_animals" | "pack_train" | "crew";
  routeModeId: string;
  cargoCapacityUnits: number;
  baseWeightUnits: number;
  crewRequired: number;
  baseEnduranceHours: number;
  restDaysPerFatigueCycle: number;
  maxAnimals: number;
  optimalAnimals: number;
  requiredHarnessId: string | null;
  minimumRoadTier: number;
  minimumWaterTier: number;
  minimumHarborTier: number;
  minimumMarketTier: number;
  minimumFillRatio: number;
  loadingDays: number;
  unloadingDays: number;
  routeScaleCost: number;
  terrainModifiers: Record<string, number>;
  speedModifier: number;
  notes: string;
}

export interface TransportProfileCatalogRecord {
  id: string;
  slug: string;
  name: string;
  summary: string;
  harnessProfiles: TransportHarnessProfileRecord[];
  animalProfiles: TransportAnimalProfileRecord[];
  vehicleProfiles: TransportVehicleProfileRecord[];
}

export interface ItemValueProfileRecord {
  valueMode: "source_derived" | "recipe_derived";
  materialCostModel: "source_effort" | "input_rollup";
  laborIntensity: "light" | "moderate" | "heavy";
  processingIntensity: "minimal" | "standard" | "fuel_heavy" | "precision";
  difficultyTier: "easy" | "moderate" | "hard" | "expert";
  demandBand: "subsistence" | "common" | "utility" | "specialty" | "luxury";
}

export interface MaterialDifficultyProfileRecord {
  family: "wood" | "metal" | "textile" | "leather";
  workability: "easy" | "moderate" | "hard";
  hardness: "soft" | "medium" | "hard";
  refinementDifficulty: "low" | "moderate" | "high";
  processingCostImpact: "light" | "moderate" | "heavy";
}

export interface ItemContentRecord {
  id: string;
  itemKey: string;
  name: string;
  itemClass: string;
  itemBranch?: string;
  itemSubBranch?: string;
  baseValue: number;
  currencyId: string;
  valueUnit: string;
  marketable: boolean;
  roles?: string[];
  tags?: string[];
  processingGroups?: string[];
  stage?: string;
  valueProfile: ItemValueProfileRecord;
  materialDifficultyProfile?: MaterialDifficultyProfileRecord;
}

export interface MarketPricingProfileRecord {
  pricingMode: "derived_snapshot";
  materialCostSource: "source_effort" | "input_rollup";
  laborCostSource: "recipe_skill_time";
  processingCostSource: "fuel_and_tool_wear";
  difficultySource: "material_and_precision";
  demandBand: "subsistence" | "common" | "utility" | "specialty" | "luxury";
}

export interface MarketItemValueRecord {
  id: string;
  itemKey: string;
  source: string;
  category: string;
  baseValue: number;
  currencyId: string;
  valueUnit: string;
  marketable: boolean;
  pricingProfile: MarketPricingProfileRecord;
}

export interface WorkplaceToolPenaltyRecord {
  mode: "no_output" | "reduced_output";
  outputMultiplier?: Record<string, number>;
}

export interface WorkplaceJobToolRequirementRecord {
  minimumToolTier?: Record<string, number>;
  requiredToolTags: string[];
  missingToolPenalty: WorkplaceToolPenaltyRecord;
}

export interface WorkplaceJobRecord {
  jobId: string;
  role: string;
  toolRequirements?: WorkplaceJobToolRequirementRecord;
}

export interface WorkplaceIoItemRecord {
  itemKey: string;
  quantityPerCycle?: Record<string, number>;
  unit: string;
  consumptionType: string;
}

export interface WorkplaceYieldGroupOutputRecord {
  itemKey: string;
  weight?: number;
  quantityPerCycle?: Record<string, number>;
  unit?: string;
}

export interface WorkplaceYieldGroupRecord {
  groupId: string;
  selectionMode: string;
  drawsPerCycle?: Record<string, number>;
  outputs: WorkplaceYieldGroupOutputRecord[];
}

export interface WorkplaceContentRecord {
  id: string;
  name: string;
  category: string;
  inputTags?: string[];
  outputTags?: string[];
  workforceProfile?: {
    jobs?: WorkplaceJobRecord[];
  };
  ioProfile?: {
    workCycleHours?: Record<string, number>;
    inputs?: WorkplaceIoItemRecord[];
    outputs?: WorkplaceIoItemRecord[];
    yieldGroups?: WorkplaceYieldGroupRecord[];
  };
}

export interface BuildingStorageProfileRecord {
  storageType: "granary" | "cellar" | "warehouse" | "vault";
  capacityUnits: number;
  goodsFocus: string[];
}

export interface BuildingContentRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  hostedWorkplaceIds: string[];
  serviceFunctions: string[];
  triggerBusinessTypes: string[];
  compatibleSettlementTypes: string[];
  requiredInfrastructure: {
    roadTier: number;
    waterTier: number;
    harborTier: number;
    marketTier: number;
    fortificationTier: number;
  };
  placeability: {
    supportedSiteClasses: Array<"surface" | "subterranean" | "underwater">;
    allowedTerrainContexts: string[];
    requiresWaterAccess: boolean;
    requiresCoastalAccess: boolean;
    requiresRiverAccess: boolean;
    requiredRouteModes: string[];
  };
  storageProfiles?: BuildingStorageProfileRecord[];
}

export interface RecipeSkillCheckRecord {
  skillId: string;
  minimumRank: number;
  efficiencyRank: number;
  qualityRank: number;
  lowSkillOutcome: "higher_labor_and_waste";
}

export interface RecipeProcessingStepRecord {
  id: string;
  stageRef: string;
  operation: string;
  inputs: string[];
  outputs: string[];
  laborIntensity: "light" | "moderate" | "heavy";
  processingIntensity: "minimal" | "standard" | "fuel_heavy" | "precision";
  difficultyTier: "easy" | "moderate" | "hard" | "expert";
  materialDifficultyMode: "input_weighted";
  usesVariantInputs?: boolean;
  usesVariantPrimaryOutput?: boolean;
  usesVariantByProducts?: boolean;
  skillCheck?: RecipeSkillCheckRecord;
}

export interface RecipeValuePropagationRecord {
  materialCostMode: "input_sum";
  laborCostMode: "skill_time_weighted";
  processingCostMode: "fuel_tool_wear";
  difficultyMode: "step_material_weighted";
  demandBand: "subsistence" | "common" | "utility" | "specialty" | "luxury";
  carriesForward: boolean;
}

export interface ProductionChainVariantRecord {
  id: string;
  inputItemKeys?: string[];
  primaryOutput?: string;
  byProducts?: string[];
}

export interface ProductionChainRecord {
  id: string;
  stages: string[];
  primaryOutput: string;
  byProducts?: string[];
  variantConfig?: {
    defaultVariant?: string;
    variants: ProductionChainVariantRecord[];
  };
  recipeProfile: {
    recipeClass: string;
    primarySkillId: string;
    externalInputs: string[];
    intermediateItems: string[];
    processingSteps: RecipeProcessingStepRecord[];
    valuePropagation: RecipeValuePropagationRecord;
  };
}

export interface SkillContentRecord {
  id: string;
  name: string;
  kind: string;
  family: string;
  defaultRank: number;
  defaultCap: number;
  progressionModelId: string;
}

export const DEFAULT_ADVENTURERS_PRESENCE: GuildPresenceRecord = {
  guildType: "adventurers_guild",
  name: "Adventurers Guild Desk",
  presenceLevel: "outpost",
  functions: ["quest_board", "escort_contracts", "hazard_clearance"],
  notes: "A standing adventurers desk appears anywhere organized guild business already exists."
};

const contentCache = new Map<string, unknown>();

function loadJsonFile<T>(relativePath: string): T {
  if (contentCache.has(relativePath)) {
    return contentCache.get(relativePath) as T;
  }

  const fileUrl = new URL(relativePath, import.meta.url);
  const parsed = JSON.parse(readFileSync(fileUrl, "utf8")) as T;
  contentCache.set(relativePath, parsed);
  return parsed;
}

export function loadGuildContent(): GuildContentRecord[] {
  const parsed = loadJsonFile<{ records: GuildContentRecord[] }>("../../../content/base/civilization/guilds.json");
  return parsed.records;
}

export function loadSettlementContent(): SettlementContentRecord[] {
  const parsed = loadJsonFile<{ records: SettlementContentRecord[] }>("../../../content/base/world/settlements.json");
  return parsed.records;
}

export function loadBuildingContent(): BuildingContentRecord[] {
  const parsed = loadJsonFile<{ records: BuildingContentRecord[] }>(
    "../../../content/base/civilization/buildings.json"
  );
  return parsed.records;
}

export function loadQuestTemplates(): QuestTemplateRecord[] {
  const parsed = loadJsonFile<{ records: QuestTemplateRecord[] }>("../../../content/base/civilization/quest_templates.json");
  return parsed.records;
}

export function loadQuestDefinitions(): QuestDefinitionRecord[] {
  const parsed = loadJsonFile<{ records: QuestDefinitionRecord[] }>(
    "../../../content/base/civilization/quest_definitions.json"
  );
  return parsed.records;
}

export function loadQuestArchetypes(): QuestArchetypeRecord[] {
  const parsed = loadJsonFile<{ records: QuestArchetypeRecord[] }>(
    "../../../content/base/civilization/quest_archetypes.json"
  );
  return parsed.records;
}

export function loadMonsterContent(): MonsterContentRecord[] {
  const parsed = loadJsonFile<{ records: MonsterContentRecord[] }>("../../../content/base/world/monsters.json");
  return parsed.records;
}

export function loadRegionContent(): RegionContentRecord[] {
  const parsed = loadJsonFile<{ records: RegionContentRecord[] }>("../../../content/base/world/regions.json");
  return parsed.records;
}

export function loadRegionalEcologyProfiles(): RegionalEcologyProfileRecord[] {
  const parsed = loadJsonFile<{ records: RegionalEcologyProfileRecord[] }>(
    "../../../content/base/world/regional_ecology_profiles.json"
  );
  return parsed.records;
}

export function loadRegionLocalityContent(): RegionLocalityContentRecord[] {
  const parsed = loadJsonFile<{ records: RegionLocalityContentRecord[] }>(
    "../../../content/base/world/region_localities.json"
  );
  return parsed.records;
}

export function loadWorldHexContent(): WorldHexContentRecord[] {
  const parsed = loadJsonFile<{ records: WorldHexContentRecord[] }>("../../../content/base/world/world_hexes.json");
  return parsed.records;
}

export function loadWorldHexEdgeContent(): WorldHexEdgeContentRecord[] {
  const parsed = loadJsonFile<{ records: WorldHexEdgeContentRecord[] }>(
    "../../../content/base/world/world_hex_edges.json"
  );
  return parsed.records;
}

export function loadTravelNetworkContent(): TravelNetworkContentRecord[] {
  const parsed = loadJsonFile<{ records: TravelNetworkContentRecord[] }>(
    "../../../content/base/world/travel_networks.json"
  );
  return parsed.records;
}

export function loadTransportProfileContent(): TransportProfileCatalogRecord[] {
  const parsed = loadJsonFile<{ records: TransportProfileCatalogRecord[] }>(
    "../../../content/base/world/transport_profiles.json"
  );
  return parsed.records;
}

export function loadWorldMapContent(): WorldMapContentRecord[] {
  const parsed = loadJsonFile<{ records: WorldMapContentRecord[] }>("../../../content/base/world/world_maps.json");
  return parsed.records;
}

export function loadBiomeContent(): BiomeContentRecord[] {
  const parsed = loadJsonFile<{ records: BiomeContentRecord[] }>("../../../content/base/world/biomes.json");
  return parsed.records;
}

export function loadHabitatContent(): HabitatContentRecord[] {
  const parsed = loadJsonFile<{ records: HabitatContentRecord[] }>("../../../content/base/world/habitats.json");
  return parsed.records;
}

export function loadFloraContent(): FloraContentRecord[] {
  const parsed = loadJsonFile<{ records: FloraContentRecord[] }>("../../../content/base/world/flora.json");
  return parsed.records;
}

export function loadFaunaContent(): FaunaContentRecord[] {
  const parsed = loadJsonFile<{ records: FaunaContentRecord[] }>("../../../content/base/world/fauna.json");
  return parsed.records;
}

export function loadMineralContent(): MineralContentRecord[] {
  const parsed = loadJsonFile<{ records: MineralContentRecord[] }>("../../../content/base/world/minerals.json");
  return parsed.records;
}

export function loadItemContent(): ItemContentRecord[] {
  const parsed = loadJsonFile<{ records: ItemContentRecord[] }>("../../../content/base/items/items.json");
  return parsed.records;
}

export function loadMarketItemValues(): MarketItemValueRecord[] {
  const parsed = loadJsonFile<{ records: MarketItemValueRecord[] }>("../../../content/base/civilization/market_item_values.json");
  return parsed.records;
}

export function loadProductionChainContent(): ProductionChainRecord[] {
  const parsed = loadJsonFile<{ records: ProductionChainRecord[] }>("../../../content/base/civilization/production_chains.json");
  return parsed.records;
}

export function loadWorkplaceContent(): WorkplaceContentRecord[] {
  const parsed = loadJsonFile<{ records: WorkplaceContentRecord[] }>("../../../content/base/civilization/workplaces.json");
  return parsed.records;
}

export function loadSkillContent(): SkillContentRecord[] {
  const parsed = loadJsonFile<{ records: SkillContentRecord[] }>("../../../content/base/player/skills.json");
  return parsed.records;
}

export function resolveEffectiveGuildPresence(guildPresence: GuildPresenceRecord[]): GuildPresenceRecord[] {
  if (guildPresence.length === 0) {
    return [];
  }

  if (guildPresence.some((guild) => guild.guildType === "adventurers_guild")) {
    return guildPresence;
  }

  return [...guildPresence, DEFAULT_ADVENTURERS_PRESENCE];
}
