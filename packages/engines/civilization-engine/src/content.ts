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

export interface ItemUseProfileRecord {
  actionType: string;
  primarySkillId: string;
  supportSkillIds: string[];
  requiredSkillRank: number;
  masteryRank: number;
  effectChannels: string[];
  handlingType?: "weapon" | "shield" | "armor" | "hybrid";
  proficiencySkillId?: string;
  hybridSkillIds?: string[];
  combatTags?: string[];
  resolutionHooks?: string[];
  grantTags?: string[];
  targetProfile?: {
    disposition: "ally" | "enemy" | "self" | "any";
    shape: string;
    range: string;
    maxTargets: number;
    requiresAccuracy: boolean;
  };
  activation?: {
    type: "active" | "reaction" | "passive";
    actionType: string;
    timing: string;
    executionTimeTicks: number;
    recoveryTimeTicks: number;
    interruptible: boolean;
    costs: {
      hp?: number;
      mp?: number;
      stamina?: number;
    };
  };
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
  useProfiles?: ItemUseProfileRecord[];
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

export type RecipeSkillDimension = "timeEfficiency" | "waste" | "quality" | "quantity";

export interface RecipeSkillCheckRecord {
  skillId: string;
  minimumRank: number;
  efficiencyRank: number;
  qualityRank: number;
  lowSkillOutcome: "higher_labor_and_waste";
  allowedDimensions?: RecipeSkillDimension[];
  quantityRank?: number;
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
  category: string;
  domain: string;
  parentSkillId: string | null;
  description: string;
  leveling: {
    defaultRank: number;
    maximumRank: number;
  };
  progressionTrackId: string;
  governingAttributes: string[];
  combatHooks: {
    skillEffectIds: string[];
    actionGrantTags: string[];
    tacticalTags: string[];
    titleModifierTags: string[];
    spellTags: string[];
    resolutionHooks: string[];
  };
  itemHookTags: string[];
  knowledgeTrackId?: string;
  milestoneTitleTrackId?: string;
}

export interface PlayerAbilityContentRecord {
  id: string;
  name: string;
  category: string;
  description: string;
  activation: ItemUseProfileRecord["activation"];
  requirements: {
    skillRanks: Array<{ id: string; minRank: number }>;
    attributes: Array<{ id: string; minValue: number }>;
    equipmentTagsAny: string[];
    handlingTagsAny: string[];
    targetConditionsAny: Array<{ scope: "actor" | "target"; condition: string; qualifier?: string }>;
  };
  targetProfile: NonNullable<ItemUseProfileRecord["targetProfile"]>;
  governingSkillIds: string[];
  governingAttributeIds?: string[];
  effectChannels: string[];
  combatTags: string[];
  resolutionHooks: string[];
}

export interface PlayerSpellContentRecord {
  id: string;
  name: string;
  school: string;
  tradition?: string;
  discipline?: string;
  element?: string;
  governingSkillId: string;
  governingAttributes?: string[];
  effectTags: string[];
  scalingChannels: string[];
  targetProfile: NonNullable<ItemUseProfileRecord["targetProfile"]>;
  castProfile: NonNullable<ItemUseProfileRecord["activation"]>;
  resolutionHooks: string[];
  itemGenerationHooks?: Array<{
    generatedItemId: string;
    generatedItemName: string;
    charges: number;
    partyLimited: boolean;
    dissipatesOnChargeLoss: boolean;
    combatTags: string[];
  }>;
  description: string;
}

export interface PlayerTraitContentRecord {
  id: string;
  name: string;
  family: string;
  sourceType: string;
  tier: number;
  description: string;
  stackingRule: string;
  unlockRules: Array<{ type: string; id: string; level?: number }>;
  modifiers: Array<{ channel: string; mode: string; value: number; scope: string; skillId?: string }>;
  tags?: string[];
}

export interface PlayerBackstoryContentRecord {
  id: string;
  name: string;
  summary: string;
  description: string;
  startingSkills: Array<{
    skillId: string;
    level: number;
  }>;
  startingKnowledge: Array<{
    trackId: string;
    level: number;
  }>;
  startingAbilityIds?: string[];
}

export interface PlayerStartingBundleContentRecord {
  id: string;
  name: string;
  summary: string;
  fixedItems?: Array<{
    itemId: string;
    quantity: number;
  }>;
  choiceGroups?: Array<{
    id: string;
    label: string;
    options: Array<{
      itemId: string;
      quantity: number;
    }>;
  }>;
  startingCurrency?: {
    gold: number;
    silver: number;
    copper: number;
  };
}

export interface ProgressionTrackRecord {
  id: string;
  name: string;
  trackType: string;
  rankRange: { min: number; max: number };
  bands: Array<{
    id: string;
    label: string;
    minRank: number;
    maxRank: number;
    softCapRank: number;
    requiresBreakthrough: boolean;
    requiresMasteryTrial?: boolean;
  }>;
  breakthroughGateRanks: number[];
  gainModel: Record<string, number>;
  breakthroughSources: Record<string, number>;
}

export interface KnowledgeTrackRecord {
  id: string;
  name?: string;
  domain?: string;
  knowledgeSkillId: string;
  spottingSkillId?: string;
  identifySkillId?: string;
  universalSupportSkillId?: string;
  supportWeights: Record<string, number>;
  identifyDifficulty: Record<string, number>;
  autoIdentifyThresholds: Record<string, number>;
}

export interface SkillEffectContentRecord {
  id: string;
  skillId: string;
  name: string;
  family: string;
  channels: Array<{
    actionType?: string;
    actionTags?: string[];
    grantType?: string;
    effectChannel: string;
    combatTags?: string[];
    resolutionHooks?: string[];
    scaling: {
      mode: string;
      base: number;
      perRank: number;
      perAttributePoint?: number;
    };
  }>;
}

export interface TrialContentRecord {
  id: string;
  name: string;
  associatedSkillId: string;
  thresholdToPass: number;
  progress: number;
  maxPotential: number;
  checkpoints: Array<{ id: string; label: string; threshold: number }>;
  rewards: Array<Record<string, unknown>>;
  penalties: Array<Record<string, unknown>>;
}

export interface TitleContentRecord {
  id: string;
  name: string;
  family: string;
  trackId: string;
  sourceSkillId: string | null;
  milestone: {
    threshold: 50 | 100 | 125;
    requiresMasteryTrial: boolean;
    trialId: string | null;
  };
  description: string;
  effects: string[];
  tags: string[];
  reserved?: boolean;
}

export interface ReligionContentRecord {
  id: string;
  slug: string;
  name: string;
  summary: string;
  deities: Array<{
    id: string;
    name: string;
    presentationGender: "female" | "male";
    element: "light" | "water" | "wind" | "ice" | "darkness" | "fire" | "stone" | "thunder";
    domains: string[];
    opposedDeityId?: string;
  }>;
  dualities: Array<{
    leftDeityId: string;
    rightDeityId: string;
    relationship: "opposed";
  }>;
  dominanceCycle: Array<{
    winnerDeityId: string;
    loserDeityId: string;
    relationship: "dominant";
  }>;
  organizations: Array<{
    id: string;
    name: string;
    category: "elemental_order" | "prismatic_enclave" | "unbound";
    favoredDeityIds: string[];
    typicalTerrainTags: string[];
    summary: string;
  }>;
  structureTypes: Array<{
    id: string;
    label: string;
    minimumPopulationBand: "tiny" | "small" | "modest" | "large" | "major";
    magicSupport: "none" | "limited" | "moderate" | "high";
  }>;
}

export interface MagicInfrastructureContentRecord {
  id: string;
  slug: string;
  name: string;
  category: "adventurer_magic" | "utility_enchantment" | "ritual_religious";
  summary: string;
  requiredInfrastructure: {
    roadTier: number;
    waterTier: number;
    harborTier: number;
    marketTier: number;
    fortificationTier: number;
  };
  requiredGuildTypes: string[];
  requiredReligionOrganizationIds: string[];
  supportedUseCases: string[];
  prohibitedBypassTags: string[];
  preferredCrystalTiers: Array<"shard" | "crystal" | "cluster">;
  allowedElements: Array<"neutral" | "light" | "water" | "wind" | "ice" | "darkness" | "fire" | "stone" | "thunder">;
  serviceScaleBand: "small" | "moderate" | "large";
}

export interface CrystalCatalogContentRecord {
  id: string;
  slug: string;
  name: string;
  tier: "shard" | "crystal" | "cluster";
  element: "neutral" | "light" | "water" | "wind" | "ice" | "darkness" | "fire" | "stone" | "thunder";
  capacity: number;
  efficiency: number;
  stability: number;
  reusable: boolean;
  rechargeMethod: string;
  mismatchPenalty: number;
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
  const raw = readFileSync(fileUrl, "utf8");
  const parsed = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw) as T;
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

export function loadPlayerAbilityContent(): PlayerAbilityContentRecord[] {
  const parsed = loadJsonFile<{ records: PlayerAbilityContentRecord[] }>(
    "../../../content/base/player/abilities.json"
  );
  return parsed.records;
}

export function loadPlayerSpellContent(): PlayerSpellContentRecord[] {
  const parsed = loadJsonFile<{ records: PlayerSpellContentRecord[] }>("../../../content/base/player/spells.json");
  return parsed.records;
}

export function loadPlayerTraitContent(): PlayerTraitContentRecord[] {
  const parsed = loadJsonFile<{ records: PlayerTraitContentRecord[] }>("../../../content/base/player/traits.json");
  return parsed.records;
}

export function loadPlayerBackstoryContent(): PlayerBackstoryContentRecord[] {
  const parsed = loadJsonFile<{ records: PlayerBackstoryContentRecord[] }>(
    "../../../content/base/player/backstories.json"
  );
  return parsed.records;
}

export function loadPlayerStartingBundleContent(): PlayerStartingBundleContentRecord[] {
  const parsed = loadJsonFile<{ records: PlayerStartingBundleContentRecord[] }>(
    "../../../content/base/player/starting_bundles.json"
  );
  return parsed.records;
}

export function loadProgressionTrackContent(): ProgressionTrackRecord[] {
  const parsed = loadJsonFile<{ records: ProgressionTrackRecord[] }>(
    "../../../content/base/player/progression_tracks.json"
  );
  return parsed.records;
}

export function loadKnowledgeTrackContent(): KnowledgeTrackRecord[] {
  const parsed = loadJsonFile<{ records: KnowledgeTrackRecord[] }>(
    "../../../content/base/player/knowledge_tracks.json"
  );
  return parsed.records;
}

export function loadSkillEffectContent(): SkillEffectContentRecord[] {
  const parsed = loadJsonFile<{ records: SkillEffectContentRecord[] }>(
    "../../../content/base/player/skill_effects.json"
  );
  return parsed.records;
}

export function loadTrialContent(): TrialContentRecord[] {
  const parsed = loadJsonFile<{ records: TrialContentRecord[] }>("../../../content/base/player/trials.json");
  return parsed.records;
}

export function loadTitleContent(): TitleContentRecord[] {
  const parsed = loadJsonFile<{ records: TitleContentRecord[] }>("../../../content/base/player/titles.json");
  return parsed.records;
}

export function loadReligionContent(): ReligionContentRecord[] {
  const parsed = loadJsonFile<{ records: ReligionContentRecord[] }>("../../../content/base/world/religions.json");
  return parsed.records;
}

export function loadMagicInfrastructureContent(): MagicInfrastructureContentRecord[] {
  const parsed = loadJsonFile<{ records: MagicInfrastructureContentRecord[] }>(
    "../../../content/base/world/magic_infrastructure.json"
  );
  return parsed.records;
}

export function loadCrystalCatalogContent(): CrystalCatalogContentRecord[] {
  const parsed = loadJsonFile<{ records: CrystalCatalogContentRecord[] }>(
    "../../../content/base/world/crystal_catalog.json"
  );
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
