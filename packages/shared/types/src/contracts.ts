import type {
  CombatEncounterHistoryEntryState,
  CombatEncounterState,
  CombatModeState,
  CombatUiState,
  PartyRuntimeState
} from "./combat.js";
import type { ResolvedSpawnCandidateState } from "./encounters.js";
import type { PlayerCombatProfileState } from "./tactics.js";

export type DomainKey = "world" | "civilization" | "player" | "game";

export type SeasonName = "Winter" | "Thaw" | "Spring" | "Summer" | "Harvest" | "Withering";

export interface SimulationClock {
  tick: number;
  subday: number;
  day: number;
  month: number;
  season: SeasonName;
  year: number;
}

export interface SqliteDbHandle {
  readonly filePath: string;
  query<T = unknown>(sql: string, params?: ReadonlyArray<unknown>): Promise<T[]>;
  execute(sql: string, params?: ReadonlyArray<unknown>): Promise<void>;
}

export interface DomainDbHandles {
  worldDb: SqliteDbHandle;
  civilizationDb: SqliteDbHandle;
  playerDb: SqliteDbHandle;
  simViewDb: SqliteDbHandle;
}

export interface GameEventEnvelope<TPayload = Record<string, unknown>> {
  id: string;
  type: string;
  domain: DomainKey;
  atTick: number;
  payload: TPayload;
  tags?: string[];
}

export interface TickContextBase<TState = Record<string, unknown>> {
  clock: SimulationClock;
  seed: number;
  db: DomainDbHandles;
  state: TState;
  incomingEvents: ReadonlyArray<GameEventEnvelope>;
}

export interface WorldState {
  activeRegions: string[];
  weatherState: Record<string, unknown>;
  encounterContext?: {
    regionId: string;
    settlementId?: string | null;
    siteId?: string | null;
    worldHexId?: string | null;
    habitatTags: string[];
    hazardPressure: number;
  };
  pendingSpawnCandidates?: ResolvedSpawnCandidateState[];
}

export type EconomyHierarchyLevel = "workplace" | "building" | "settlement" | "subregion" | "region" | "continent";

export interface ResourceFlowRate {
  itemKey: string;
  supplyPerTick: number;
  demandPerTick: number;
}

export interface ResourceBalanceEntry {
  itemKey: string;
  supplyPerTick: number;
  demandPerTick: number;
  netPerTick: number;
  surplusPerTick: number;
  shortfallPerTick: number;
  reservePerTick: number;
  tradeCapacityPerTick: number;
  tradeSurplusPerTick: number;
  unmetDemandPerTick: number;
}

export type EconomyNodeSourceType =
  | "workplace"
  | "building"
  | "settlement"
  | "region"
  | "ecology"
  | "infrastructure"
  | "simulation";

export interface EconomyNodeState {
  id: string;
  level: EconomyHierarchyLevel;
  displayName: string;
  parentNodeId: string | null;
  settlementId?: string;
  regionId?: string;
  tags: string[];
  directFlows: ResourceFlowRate[];
  sourceRecordType?: EconomyNodeSourceType;
  sourceRecordId?: string;
  tradeCapacityPerTick?: number;
  reserveRatio?: number;
}

export interface EconomyLedgerSnapshot {
  level: EconomyHierarchyLevel;
  nodeId: string;
  displayName: string;
  parentNodeId: string | null;
  settlementId?: string;
  regionId?: string;
  sourceRecordType?: EconomyNodeSourceType;
  sourceRecordId?: string;
  totalSupplyPerTick: number;
  totalDemandPerTick: number;
  totalSurplusPerTick: number;
  totalShortfallPerTick: number;
  totalReservePerTick: number;
  totalTradeCapacityPerTick: number;
  totalTradeSurplusPerTick: number;
  balances: ResourceBalanceEntry[];
}

export interface EconomyLevelTotals {
  level: EconomyHierarchyLevel;
  nodeCount: number;
  totalSupplyPerTick: number;
  totalDemandPerTick: number;
  totalSurplusPerTick: number;
  totalShortfallPerTick: number;
  totalReservePerTick: number;
  totalTradeCapacityPerTick: number;
  totalTradeSurplusPerTick: number;
}

export interface EconomyPressureContribution {
  source: string;
  factor: number;
  impact: number;
  note: string;
}

export interface SettlementMarketItemPressureState {
  itemKey: string;
  stockLevel: number;
  reservePerTick: number;
  tradeSurplusPerTick: number;
  unmetDemandPerTick: number;
  netPerTick: number;
  supplyPressure: number;
  demandPressure: number;
}

export interface SettlementMarketLaborPressureState {
  skillId: string;
  availability: number;
  pressure: number;
  supportingSupplyPerTick: number;
  shortfallPerTick: number;
}

export interface SettlementMarketPriceState {
  itemKey: string;
  baseProductionCost: number;
  effectiveProductionCost: number;
  estimatedMarketValue: number;
  localBuyPrice: number;
  localSellPrice: number;
  spread: number;
  pressureSources: EconomyPressureContribution[];
}

export interface SettlementMarketState {
  settlementId: string;
  tick: number;
  productionCapacityModifier: number;
  stock: SettlementMarketItemPressureState[];
  laborPressure: SettlementMarketLaborPressureState[];
  priceView: SettlementMarketPriceState[];
}

export type ResourceAvailabilityTier = "abundant" | "common" | "uncommon" | "rare" | "absent";

export interface HexResourceAvailabilityState {
  hexId: string;
  sourceType: "flora" | "fauna" | "mineral";
  sourceId: string;
  displayName: string;
  resourceKeys: string[];
  availabilityTier: ResourceAvailabilityTier;
  compatibilityScore: number;
  notes: string[];
}

export interface SettlementResourceFamilyState {
  family: string;
  accessibleTier: ResourceAvailabilityTier;
  usableTier: ResourceAvailabilityTier;
  notes: string[];
}

export interface SettlementResourceAccessState {
  settlementId: string;
  localityBandId: string;
  homeHexId: string;
  accessibleHexIds: string[];
  accessibleResources: HexResourceAvailabilityState[];
  usableResources: HexResourceAvailabilityState[];
  familyAvailability: SettlementResourceFamilyState[];
  explanation: {
    blockedFamilies: string[];
    infrastructureNotes: string[];
    notes: string[];
  };
}

export interface SettlementSupplyCapabilityState {
  settlementId: string;
  itemKey: string;
  accessible: boolean;
  usable: boolean;
  supplyFactor: number;
  reason: string[];
}

export interface TravelPenaltyState {
  source: string;
  factor: number;
  note: string;
}

export interface RouteSegmentState {
  segmentIndex: number;
  routeId: string;
  edgeId: string | null;
  fromHexId: string;
  toHexId: string;
  edgeType: string;
  distanceKilometers: number;
  terrain: string;
  barrierTags: string[];
  riskLevel: number;
  allowedTravelModes: string[];
  baseSpeedKilometersPerDay: number;
  effectiveSpeedKilometersPerDay: number;
  timeDays: number;
  penalties: TravelPenaltyState[];
  notes: string[];
}

export interface RejectedRouteState {
  routeId: string;
  reason: string;
}

export interface RouteResolutionState {
  fromSettlementId: string;
  toSettlementId: string;
  modeId: string;
  strategy: "fastest" | "lowest_risk" | "lowest_cost";
  routeIds: string[];
  totalDistanceKilometers: number;
  totalTimeDays: number;
  totalRisk: number;
  totalCostWeight: number;
  segments: RouteSegmentState[];
  rejectedRoutes: RejectedRouteState[];
  explanation: string[];
}

export type TransportType = "foot" | "mounted" | "vehicle" | "ship";
export type CaravanStatus = "planned" | "in_transit" | "resting" | "arrived" | "blocked";

export interface CaravanCargoEntryState {
  itemKey: string;
  quantity: number;
  loadUnits: number;
}

export interface TransportAnimalAssignmentState {
  animalId: string;
  count: number;
}

export interface TransportUnitState {
  transportType: TransportType;
  modeId: string;
  vehicleId: string | null;
  harnessId: string | null;
  animals: TransportAnimalAssignmentState[];
  crewSize: number;
}

export interface TransportPerformanceBreakdownState {
  baseModeSpeedKilometersPerDay: number;
  terrainFactor: number;
  loadFactor: number;
  propulsionFactor: number;
  fatigueFactor: number;
  effectiveSpeedKilometersPerDay: number;
  cargoCapacityUnits: number;
  cargoLoadUnits: number;
  pullRequirementUnits: number;
  effectivePullUnits: number;
  enduranceHours: number;
  restDaysPerFatigueCycle: number;
  notes: string[];
}

export interface CaravanSegmentProgressState {
  segmentIndex: number;
  routeId: string;
  distanceKilometers: number;
  distanceCompletedKilometers: number;
  progressRatio: number;
  elapsedDays: number;
  performance: TransportPerformanceBreakdownState;
}

export interface CaravanState {
  id: string;
  originSettlementId: string;
  destinationSettlementId: string;
  status: CaravanStatus;
  transportUnit: TransportUnitState;
  cargoManifest: CaravanCargoEntryState[];
  routePlan: RouteResolutionState;
  currentSegmentIndex: number;
  segmentProgress: CaravanSegmentProgressState | null;
  daysInTransit: number;
  fatigueLoad: number;
  restRemainingDays: number;
  failureReason: string | null;
  explanation: string[];
}

export interface SettlementStockAdjustmentState {
  settlementId: string;
  itemKey: string;
  stockDelta: number;
  source: string;
  note: string;
}

export interface CaravanDispatchResultState {
  caravan: CaravanState;
  stockAdjustments: SettlementStockAdjustmentState[];
  explanation: string[];
}

export interface CaravanAdvanceResultState {
  caravan: CaravanState;
  appliedStockAdjustments: SettlementStockAdjustmentState[];
  explanation: string[];
}

export interface TransportAssetReservationState {
  settlementId: string;
  vehicleId: string;
  availableAtTick: number;
  unitCount: number;
  note: string;
}

export interface SettlementPopulationClassState {
  classId: string;
  count: number;
  share: number;
  notes: string[];
}

export interface SettlementPopulationProfileState {
  settlementId: string;
  totalPopulation: number;
  workforcePopulation: number;
  dependentPopulation: number;
  civicPopulation: number;
  militaryPopulation: number;
  explanation: string[];
  laborClasses: SettlementPopulationClassState[];
}

export interface SettlementTransportAvailabilityState {
  vehicleId: string;
  harnessId: string | null;
  animalId: string | null;
  animalCount: number;
  crewSize: number;
  availableUnits: number;
  cargoCapacityUnits: number;
  minimumFillRatio: number;
  notes: string[];
}

export interface SettlementStorageProfileState {
  storageType: "granary" | "cellar" | "warehouse" | "vault";
  capacityUnits: number;
  loadUnits: number;
  utilization: number;
  supportedGoods: string[];
  notes: string[];
}

export type SettlementDevelopmentLevel = "low" | "moderate" | "high";
export type SettlementTradeRole = "exporter" | "importer" | "mixed";
export type SettlementRouteConnectivityBand = "low" | "moderate" | "high";
export type SettlementDistrictType =
  | "central_market"
  | "residential_low"
  | "residential_medium"
  | "residential_high"
  | "industrial_production"
  | "storage_trade"
  | "military"
  | "civic_religious"
  | "slums_fringe"
  | "rural_edge";
export type SettlementDensityClass = "low" | "medium" | "high";
export type SettlementLandValueBand = "low" | "moderate" | "high";
export type SettlementInfrastructureBand = "low" | "moderate" | "high";
export type SettlementPlotStateType =
  | "developed"
  | "underdeveloped"
  | "vacant"
  | "dilapidated"
  | "abandoned";
export type SettlementBuildingDecayState = "sound" | "worn" | "damaged" | "abandoned";
export type SettlementRepairMode = "passive_maintenance" | "standard_repair" | "major_restoration";

export interface SettlementDevelopmentProfileState {
  settlementId: string;
  settlementType: string;
  primaryIndustries: string[];
  secondaryIndustries: string[];
  environmentalConstraints: string[];
  tradeRole: SettlementTradeRole;
  developmentLevel: SettlementDevelopmentLevel;
  routeConnectivityBand: SettlementRouteConnectivityBand;
  explanation: string[];
}

export interface SettlementDistrictState {
  districtId: string;
  settlementId: string;
  districtType: SettlementDistrictType;
  densityClass: SettlementDensityClass;
  landValue: SettlementLandValueBand;
  terrainConstraints: string[];
  infrastructureLevel: SettlementInfrastructureBand;
  plotCapacity: number;
  developedPlots: number;
  underdevelopedPlots: number;
  vacantPlots: number;
  degradedPlots: number;
  plotIds: string[];
  notes: string[];
}

export interface SettlementPlotState {
  plotId: string;
  settlementId: string;
  districtId: string;
  state: SettlementPlotStateType;
  tags: string[];
  landValue: SettlementLandValueBand;
  assignedBuildingInstanceId: string | null;
  developmentDiscountFactor: number;
  notes: string[];
}

export interface SettlementRepairMaterialState {
  itemKey: string;
  quantity: number;
}

export interface SettlementBuildingInstanceState {
  instanceId: string;
  buildingId: string;
  settlementId: string;
  districtId: string;
  plotId: string;
  condition: number;
  usability: number;
  efficiencyModifier: number;
  storageCapacityModifier: number;
  decayState: SettlementBuildingDecayState;
  repairMode: SettlementRepairMode;
  materialRequirements: SettlementRepairMaterialState[];
  assignedTradeIds: string[];
  notes: string[];
}

export interface SettlementBuildingState {
  buildingId: string;
  settlementId: string;
  category: string;
  instanceCount: number;
  averageCondition: number;
  effectiveUsability: number;
  hostedWorkplaceIds: string[];
  serviceFunctions: string[];
  storageProfiles: SettlementStorageProfileState[];
  assignedDistrictIds: string[];
  instances: SettlementBuildingInstanceState[];
  placeability: {
    supportedSiteClasses: string[];
    allowedTerrainContexts: string[];
    requiresWaterAccess: boolean;
    requiresCoastalAccess: boolean;
    requiresRiverAccess: boolean;
    requiredRouteModes: string[];
  };
  notes: string[];
}

export interface SettlementInfrastructureRuntimeState {
  settlementId: string;
  storageCapacityUnits: number;
  storageLoadUnits: number;
  storageUtilization: number;
  storageProfiles: SettlementStorageProfileState[];
  tradeThroughputUnitsPerTick: number;
  dispatchSlotsPerTick: number;
  securityScore: number;
  corruptionPressure: number;
  averageBuildingCondition: number;
  conditionThroughputModifier: number;
  maintenanceCapacityPerTick: number;
  serviceAvailability: string[];
  transportAvailability: SettlementTransportAvailabilityState[];
  explanation: string[];
}

export interface SettlementBusinessState {
  businessId: string;
  settlementId: string;
  businessType: string;
  category: string;
  scaleBand: "micro" | "small" | "moderate" | "large";
  workforceCount: number;
  inputGoods: string[];
  outputGoods: string[];
  infrastructureDependencies: string[];
  notes: string[];
}

export interface SettlementRepairProjectState {
  projectId: string;
  settlementId: string;
  buildingId: string;
  buildingInstanceId: string;
  districtId: string;
  plotId: string;
  mode: SettlementRepairMode;
  blockingSeverity: "low" | "moderate" | "high";
  canExecute: boolean;
  requiredTradeIds: string[];
  assistantLaborClassIds: string[];
  materialRequirements: SettlementRepairMaterialState[];
  laborDays: number;
  notes: string[];
}

export interface SettlementTradeDependencyState {
  direction: "import" | "export";
  itemKey: string;
  partnerSettlementIds: string[];
  reason: string;
}

export interface SettlementSupplyDemandState {
  settlementId: string;
  surplusGoods: string[];
  shortageGoods: string[];
  exportGoods: string[];
  importGoods: string[];
  consumptionGoods: string[];
  tradeDependencies: SettlementTradeDependencyState[];
  notes: string[];
}

export interface SettlementMoraleState {
  settlementId: string;
  moraleScore: number;
  productionModifier: number;
  housingPressure: number;
  contributors: EconomyPressureContribution[];
  notes: string[];
}

export interface SettlementSimulationState {
  settlementId: string;
  regionId: string;
  localityBandId: string;
  profile: SettlementDevelopmentProfileState;
  population: SettlementPopulationProfileState;
  infrastructure: SettlementInfrastructureRuntimeState;
  districts: SettlementDistrictState[];
  plots: SettlementPlotState[];
  businesses: SettlementBusinessState[];
  buildings: SettlementBuildingState[];
  repairProjects: SettlementRepairProjectState[];
  morale: SettlementMoraleState;
  supplyDemand: SettlementSupplyDemandState;
  explanation: string[];
}

export interface TradeOpportunityState {
  opportunityId: string;
  originSettlementId: string;
  destinationSettlementId: string;
  itemKey: string;
  modeId: string;
  vehicleId: string;
  viable: boolean;
  strategicNecessity: boolean;
  projectedQuantity: number;
  projectedLoadUnits: number;
  fillRatio: number;
  exportableSurplus: number;
  protectedReserve: number;
  destinationAbsorption: number;
  originSellPrice: number;
  destinationBuyPrice: number;
  unitMargin: number;
  projectedGrossMargin: number;
  projectedNetMargin: number;
  routeTimeDays: number;
  cycleDays: number;
  routeIds: string[];
  rejectionReasons: string[];
  explanation: string[];
}

export interface CivilizationTransportState {
  caravans: CaravanState[];
  stockAdjustments: SettlementStockAdjustmentState[];
  nextCaravanOrdinal: number;
  assetReservations: TransportAssetReservationState[];
  lastEvaluatedOpportunities: TradeOpportunityState[];
  lastProcessedTick?: number;
}

export interface SimulationConsistencyGoodsCoverageState {
  groupId: string;
  requiredKeys: string[];
  coveredKeys: string[];
  missingKeys: string[];
}

export interface InvalidSettlementGeographyState {
  settlementId: string;
  reasons: string[];
}

export interface UnrealisticTradeDispatchState {
  opportunityId: string;
  originSettlementId: string;
  destinationSettlementId: string;
  itemKey: string;
  vehicleId: string;
  rejectionReasons: string[];
  explanation: string[];
}

export interface SimulationConsistencyReportState {
  essentialGoodsCoverage: SimulationConsistencyGoodsCoverageState[];
  itemsWithoutProductionSource: string[];
  missingRecipeDependencies: string[];
  cyclicProductionDependencies: string[];
  workplacesWithoutDefinedFunction: string[];
  unusedWorkplaces: string[];
  workplacesWithoutBuildingCoverage: string[];
  buildingsWithoutFunction: string[];
  invalidSettlementGeography: InvalidSettlementGeographyState[];
  unrealisticTradeDispatchAttempts: UnrealisticTradeDispatchState[];
  explanation: string[];
}

export interface CraftResolutionInputState {
  itemKey: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface CraftResolutionOutputState {
  itemKey: string;
  quantity: number;
  role: "primary" | "byproduct" | "waste";
  unitValueBasis: number;
  totalValueBasis: number;
}

export type CraftSkillDimension = "timeEfficiency" | "waste" | "quality" | "quantity";

export interface CraftResolutionStepState {
  stepId: string;
  stageRef: string;
  operation: string;
  skillId: string;
  skillRank: number;
  minimumRank: number | null;
  effectiveRequiredRank: number;
  inputItems: string[];
  outputItems: string[];
  materialCost: number;
  laborCost: number;
  processingCost: number;
  wasteCost: number;
  processingTimeHours: number;
  materialDifficultyFactor: number;
  skillTimeFactor: number;
  skillQualityFactor: number;
  quantityFactor: number;
  appliedDimensions: CraftSkillDimension[];
  laborRate: number;
  notes: string[];
}

export interface CraftResolutionExplanationState {
  selectedVariantId: string | null;
  valuePropagation: {
    materialCostMode: string;
    laborCostMode: string;
    processingCostMode: string;
    difficultyMode: string;
    demandBand: string;
    carriesForward: boolean;
  };
  stepBreakdown: CraftResolutionStepState[];
  notes: string[];
}

export interface CraftResolutionState {
  chainId: string;
  settlementId: string | null;
  primarySkillId: string;
  targetOutputItemKey: string;
  outputQuantity: number;
  processingTimeHours: number;
  laborCost: number;
  materialCost: number;
  processingCost: number;
  wasteCost: number;
  totalCost: number;
  inputConsumption: CraftResolutionInputState[];
  outputs: CraftResolutionOutputState[];
  explanation: CraftResolutionExplanationState;
}

export interface ItemValueResolutionState {
  itemKey: string;
  baseProductionCost: number;
  effectiveProductionCost: number;
  estimatedMarketValue: number;
  profitMarginEstimate: number;
  resolutionPath: string[];
  explanation: EconomyPressureContribution[];
}

export interface CivilizationEconomyState {
  nodes: EconomyNodeState[];
  lastSnapshots: EconomyLedgerSnapshot[];
  lastLevelTotals: EconomyLevelTotals[];
  marketStates: SettlementMarketState[];
  lastComputedTick?: number;
}

export type QuestTemplateCategory =
  | "gathering"
  | "hunting"
  | "domestic_labor"
  | "escort"
  | "porter"
  | "exploration"
  | "monster_subjugation"
  | "salvage";

export type QuestObjectiveType = "deliver_item" | "defeat_monster" | "labor" | "escort" | "survey" | "salvage";

export interface QuestOfferObjective {
  objectiveType: QuestObjectiveType;
  label: string;
  itemKey?: string;
  monsterId?: string;
  targetTag?: string;
  quantity: number;
}

export type ReputationScope = "local" | "regional" | "continental" | "world";
export type ReputationAxis = "fame" | "notoriety";
export type FameBranchId =
  | "civic"
  | "folk"
  | "trade"
  | "martial"
  | "heroic"
  | "political"
  | "commercial"
  | "historical"
  | "legendary"
  | "mythic";
export type NotorietyCategoryId =
  | "theft"
  | "fraud"
  | "violent"
  | "murder"
  | "arson"
  | "banditry"
  | "treason"
  | "sacrilege"
  | "smuggling";
export type NotorietySeverityId = "minor" | "standard" | "major";
export type NotorietyModifierId =
  | "mass"
  | "organized"
  | "repeat"
  | "public"
  | "against_nobility"
  | "against_temple"
  | "wartime"
  | "ritual";
export type FameRecognitionBandId = "known" | "admired" | "renowned" | "legendary" | "mythic";
export type ReputationHistoricalTierId = "common" | "historical" | "epic";
export type NotorietySeriousnessClassId =
  | "nuisance"
  | "offender"
  | "outlaw"
  | "menace"
  | "infamous"
  | "atrocity_marked";
export type ReputationExposureRequirement = "public" | "witnessed_or_reported" | "evidenced";
export type NotorietyExposureState = "hidden" | ReputationExposureRequirement;
export type NotorietyAttributionState = "unknown" | "identified" | "credible_link";

export interface FameReputationAwardDefinitionState {
  axis: "fame";
  branchId: FameBranchId;
  directEarnedScope: ReputationScope;
  baseValue: number;
  originSettlementIds?: string[];
}

export interface NotorietyReputationAwardDefinitionState {
  axis: "notoriety";
  categoryId: NotorietyCategoryId;
  severity: NotorietySeverityId;
  modifiers?: NotorietyModifierId[];
  directEarnedScope: ReputationScope;
  baseValue: number;
  originSettlementIds?: string[];
  exposureRequirement: ReputationExposureRequirement;
  attributionRequired: boolean;
  allowCredibleLink: boolean;
}

export type ReputationAwardDefinitionState =
  | FameReputationAwardDefinitionState
  | NotorietyReputationAwardDefinitionState;

export interface QuestOfferState {
  id: string;
  templateId: string;
  settlementId: string;
  issuerGuildType: string;
  issuerName: string;
  category: QuestTemplateCategory;
  urgency: number;
  rewardCoin: number;
  rewardStanding: number;
  reputationAwards?: ReputationAwardDefinitionState[];
  objectives: QuestOfferObjective[];
  notes: string[];
}

export interface CivilizationQuestState {
  activeOffers: QuestOfferState[];
  lastGeneratedTick: number;
}

export interface CivilizationState {
  settlements: string[];
  markets: string[];
  economy: CivilizationEconomyState;
  transport: CivilizationTransportState;
  quests: CivilizationQuestState;
}

export type PlayerAttributeKey = "STR" | "DEX" | "AGI" | "CON" | "VIT" | "INT" | "WIS" | "SPT" | "CHA";
export type PlayerSexId = "male" | "female" | "neutral";
export type PlayerIdentityAgeBandId = "young_adult" | "prime" | "mature" | "senior";
export type PlayerIdentityPhysiqueId =
  | "large"
  | "athletic"
  | "hardy"
  | "stocky"
  | "wiry"
  | "compact"
  | "lithe"
  | "frail"
  | "sickly"
  | "sluggish";
export type PlayerIdentityNatureId =
  | "graceful"
  | "poised"
  | "comely"
  | "insightful"
  | "resolute"
  | "commanding"
  | "disciplined";
export type PlayerIdentityFocusId =
  | "martial"
  | "practical"
  | "balanced"
  | "learned"
  | "mystic";

export interface PlayerResourceGrowthVector {
  hp: number;
  mp: number;
  stamina: number;
}

export type PlayerAttributeAdjustments = Partial<Record<PlayerAttributeKey, number>>;

export interface PlayerAttributes {
  STR: number;
  DEX: number;
  AGI: number;
  CON: number;
  VIT: number;
  WIS: number;
  INT: number;
  SPT: number;
  CHA: number;
}

export interface ResourcePool {
  current: number;
  max: number;
}

export interface ExperiencePool {
  current: number;
  total: number;
  toNextLevel: number;
}

export interface PlayerResources {
  hp: ResourcePool;
  mp: ResourcePool;
  stamina: ResourcePool;
  xp: ExperiencePool;
}

export type PlayerResourceKey = "hp" | "mp" | "stamina";

export type PlayerPartialResourceVector = Partial<Record<PlayerResourceKey, number>>;

export type PlayerResourceModifierSourceType =
  | "origin"
  | "class"
  | "equipment"
  | "buff"
  | "debuff"
  | "food"
  | "aura"
  | "trait"
  | "spell"
  | "environment"
  | "system";

export interface PlayerResourceModifierState {
  id: string;
  label: string;
  sourceType: PlayerResourceModifierSourceType;
  sourceId: string | null;
  maxFlat: PlayerPartialResourceVector;
  maxPercent: PlayerPartialResourceVector;
  tickDeltaFlat: PlayerPartialResourceVector;
  expiresAtTick?: number | null;
  notes: string[];
}

export type PlayerResourceChangeKind =
  | "natural_regen"
  | "assisted_regen"
  | "degeneration"
  | "damage"
  | "heal"
  | "potion"
  | "spell_cost"
  | "food"
  | "aura"
  | "scripted";

export interface PlayerResourceChangeRequestState {
  id: string;
  label: string;
  resource: PlayerResourceKey;
  amount: number;
  kind: PlayerResourceChangeKind;
  sourceType: PlayerResourceModifierSourceType;
  sourceId: string | null;
}

export interface PlayerResourceChangeRecordState extends PlayerResourceChangeRequestState {
  appliedTick: number;
  before: number;
  after: number;
}

export interface PlayerResourceTickEntryState {
  max: number;
  before: number;
  after: number;
  naturalRegen: number;
  assistedRegen: number;
  degeneration: number;
  directChange: number;
  clampAdjustment: number;
}

export interface PlayerResourceTickBreakdownState {
  appliedTick: number;
  activeModifierIds: string[];
  resources: Record<PlayerResourceKey, PlayerResourceTickEntryState>;
}

export interface PlayerResourceRuntimeState {
  modifiers: PlayerResourceModifierState[];
  pendingChanges: PlayerResourceChangeRequestState[];
  lastBreakdown: PlayerResourceTickBreakdownState | null;
  history: PlayerResourceChangeRecordState[];
}

export type ActionIntensityTier = "low" | "moderate" | "high" | "extreme";
export type BodyEnergyBandId = "well_fed" | "stable" | "low_energy" | "drained";
export type BodyProteinBandId = "protein_rich" | "supported" | "thin_diet" | "deficient";
export type BodyHydrationBandId =
  | "optimal"
  | "slightly_dehydrated"
  | "dehydrated"
  | "severely_dehydrated";
export type BodyFatigueBandId = "fresh" | "strained" | "fatigued" | "exhausted";
export type BodyIntoxicationBandId =
  | "clear"
  | "buzzed"
  | "drunk"
  | "heavily_intoxicated"
  | "blackout_risk";
export type RecoveryCampTierId = "none" | "basic" | "proper" | "secure_indoor";
export type RecoverySafetyTierId = "unsafe" | "exposed" | "stable" | "secure";

export interface PlayerBodyEnergyReserveState {
  quick: number;
  stored: number;
}

export interface ActionMetabolicProfileState {
  intensity: ActionIntensityTier;
  fatigueGain: number;
  energyDemand: number;
  hydrationDemand: number;
  highIntensityLoad?: number;
}

export interface ActionAttributeLoadProfileState {
  intensity: ActionIntensityTier;
  weights: Partial<Record<PlayerAttributeKey, number>>;
  sourceTag: string;
  meaningfulInteraction?: boolean;
}

export interface RecoveryContextState {
  sleepUnits: number;
  campTier: RecoveryCampTierId;
  safetyTier: RecoverySafetyTierId;
  mealSupport?: number;
  waterSupport?: number;
}

export interface RecoveryAssessmentState {
  quality: number;
  durationHours: number;
}

export interface ConsumableProfileState {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  hydration?: number;
  intoxication?: number;
  useVerb?: string;
}

export interface ResolvedBodyState {
  energyBand: BodyEnergyBandId;
  proteinBand: BodyProteinBandId;
  hydrationBand: BodyHydrationBandId;
  fatigueBand: BodyFatigueBandId;
  intoxicationBand: BodyIntoxicationBandId;
  effectiveEnergy: number;
  requiredProtein: number;
  proteinCoverage: number;
  staminaMaxMultiplier: number;
  staminaRegenMultiplier: number;
  actionEfficiencyMultiplier: number;
  fatigueGainMultiplier: number;
  recoveryEffectivenessMultiplier: number;
  strengthEfficiencyMultiplier: number;
  hydrationLossMultiplier: number;
  warnings: string[];
}

export interface ResolvedAttributeTensionState {
  precisionPenalty: number;
  mobilityPenalty: number;
  stabilityPenalty: number;
  loadGenerationModifiers: Record<PlayerAttributeKey, number>;
  warnings: string[];
}

export interface PlayerStatGrowthState {
  load: Record<PlayerAttributeKey, number>;
  progress: Record<PlayerAttributeKey, number>;
  dailyConvertedLoad: Record<PlayerAttributeKey, number>;
  dailyVarietyCount: Record<PlayerAttributeKey, number>;
  dailyVarietySources: Record<PlayerAttributeKey, string[]>;
  lastRecoveryTick: number | null;
  lastDailyResetDay: number;
}

export interface StatGrowthThresholdState {
  loadThreshold: number;
  progressPerPoint: number;
  dailySoftCap: number;
  growthScale: number;
  growthExponent: number;
}

export interface StatGrowthIntensityMultipliersState {
  low: number;
  moderate: number;
  high: number;
  extreme: number;
}

export interface StatGrowthSaturationRuleState {
  startMultiplier: number;
  hardCapMultiplier: number;
  exponent: number;
}

export interface StatGrowthRecoveryCapacityState {
  base: number;
  constitutionWeight: number;
  vitalityWeight: number;
  wisdomWeight: number;
  spiritWeight: number;
}

export interface StatGrowthRecoveryGateState {
  minimumQuality: number;
  minimumDurationHours: number;
}

export interface StatGrowthDiminishingRuleState {
  trivialCutoff: number;
  dailyExponent: number;
  varietyBonusPerSource: number;
  maxVarietyBonus: number;
  loadDecayWithoutRecovery: number;
  postRecoveryRetention: number;
}

export interface StatGrowthRngRuleState {
  minimum: number;
  maximum: number;
}

export interface StatGrowthTensionRuleState {
  threshold: number;
  gapStart: number;
  precisionCap: number;
  precisionPerGap: number;
  mobilityCap: number;
  mobilityPerGap: number;
  stabilityCap: number;
  stabilityPerGap: number;
}

export interface StatGrowthBalanceRuleState {
  version: number;
  intensityMultipliers: StatGrowthIntensityMultipliersState;
  thresholds: Record<PlayerAttributeKey, StatGrowthThresholdState>;
  saturation: StatGrowthSaturationRuleState;
  recoveryCapacity: StatGrowthRecoveryCapacityState;
  recoveryGate: StatGrowthRecoveryGateState;
  diminishing: StatGrowthDiminishingRuleState;
  rng: StatGrowthRngRuleState;
  tension: StatGrowthTensionRuleState;
}

export type RunDifficultyTierId = "easy" | "normal" | "hard" | "brutal";

export interface RunDifficultyState {
  tier: RunDifficultyTierId;
  hardcore: boolean;
}

export interface DifficultyStatGrowthRuleState {
  loadThresholdScalar: number;
  saturationScalar: number;
  recoveryCapacityScalar: number;
  minimumRecoveryQualityScalar: number;
  minimumRecoveryDurationScalar: number;
}

export interface DifficultyProgressionRuleState {
  requirementScalar: number;
  meaningfulActionScalar: number;
  antiTrivialityScalar: number;
  trainingGateScalar: number;
  retentionPressureScalar: number;
}

export interface DifficultyBodyStateRuleState {
  deficitOnsetScalar: number;
  surplusPersistenceScalar: number;
  resourceDrainScalar: number;
  recoveryEffectivenessScalar: number;
  fatigueDebtPersistenceScalar: number;
  penaltySeverityScalar: number;
  starvationEscalationScalar: number;
  dehydrationEscalationScalar: number;
}

export interface DifficultyEchoRuleState {
  requirementScalar: number;
}

export interface DifficultyPrestigeRuleState {
  rewardMultiplier: number;
}

export interface DifficultyTierRuleState {
  statGrowth: DifficultyStatGrowthRuleState;
  skillProgression: DifficultyProgressionRuleState;
  knowledgeProgression: DifficultyProgressionRuleState;
  bodyState: DifficultyBodyStateRuleState;
  echo: DifficultyEchoRuleState;
  prestige: DifficultyPrestigeRuleState;
}

export interface HardcoreDifficultyOverlayState {
  recoveryScalar: number;
  deficitRecoveryScalar: number;
  aftereffectPersistenceScalar: number;
  partialRecoveryScalar: number;
  removeForgivenessCaps: boolean;
  deathZeroesPrestige: boolean;
  prestigeMultiplier: number;
}

export interface DifficultyBalanceRuleState {
  version: number;
  tiers: Record<RunDifficultyTierId, DifficultyTierRuleState>;
  hardcore: HardcoreDifficultyOverlayState;
}

export interface ResolvedDifficultyModifiersState extends DifficultyTierRuleState {
  tier: RunDifficultyTierId;
  hardcoreEnabled: boolean;
  hardcore: HardcoreDifficultyOverlayState | null;
}

export interface PlayerBodyState {
  energyReserve: PlayerBodyEnergyReserveState;
  energyBalance: number;
  proteinSufficiency: number;
  hydrationLevel: number;
  fatigue: number;
  fatigueDebt: number;
  intoxicationLevel: number;
  dailyCaloriesConsumed: number;
  dailyProteinConsumed: number;
  dailyCarbsConsumed: number;
  dailyFatConsumed: number;
  dailyHydrationConsumed: number;
  dailyEnergyDemand: number;
  dailyHighIntensityLoad: number;
  energyDeficitDays: number;
  starvationLoad: number;
  proteinDeficitLoad: number;
  lastAdvancedTick: number;
  lastDailyRolloverDay: number;
  resolved: ResolvedBodyState;
}

export interface BodyStateTargetRuleState {
  dailyCalories: number;
  dailyHydration: number;
  proteinBaseline: number;
  proteinLoadScale: number;
}

export interface BodyStateEnergyRuleState {
  quickWeight: number;
  storedWeight: number;
  quickDecayByIntensity: Record<ActionIntensityTier, number>;
  storedDecayByIntensity: Record<ActionIntensityTier, number>;
  quickGainPerCalorie: number;
  storedGainPerCalorie: number;
  energyBands: {
    wellFed: number;
    stable: number;
    lowEnergy: number;
  };
  staminaRegenMultipliers: Record<BodyEnergyBandId, number>;
  fatigueGainMultipliers: Record<BodyEnergyBandId, number>;
  recoveryMultipliers: Record<BodyEnergyBandId, number>;
}

export interface BodyStateProteinRuleState {
  smoothing: number;
  recoveryMultipliers: Record<BodyProteinBandId, number>;
  strengthPenaltyByLoad: {
    mild: number;
    moderate: number;
    severe: number;
  };
}

export interface BodyStateHydrationRuleState {
  passiveLossPerTick: number;
  recoveryGainPerTick: number;
  bands: {
    optimal: number;
    slightlyDehydrated: number;
    dehydrated: number;
  };
  staminaRegenMultipliers: Record<BodyHydrationBandId, number>;
  fatigueGainMultipliers: Record<BodyHydrationBandId, number>;
  actionEfficiencyMultipliers: Record<BodyHydrationBandId, number>;
}

export interface BodyStateFatigueRuleState {
  passiveRecoveryPerTick: number;
  sleepRecoveryPerUnit: number;
  carryoverThreshold: number;
  carryoverScale: number;
  actionEfficiencyPerPoint: number;
  staminaMaxPerPoint: number;
  staminaDebtMaxPerPoint: number;
  staminaRegenPerPoint: number;
  staminaDebtRegenPerPoint: number;
}

export interface BodyStateIntoxicationRuleState {
  decayPerTick: number;
  buzzedThreshold: number;
  drunkThreshold: number;
  heavilyIntoxicatedThreshold: number;
  blackoutRiskThreshold: number;
  mediumActionPenalty: number;
  mediumHydrationLossMultiplier: number;
  highActionPenalty: number;
  highStaminaPenalty: number;
  highHydrationLossMultiplier: number;
  nextDayFatigueDebt: number;
}

export interface BodyStateStarvationRuleState {
  dailyRecoveryWhenCovered: number;
  maxDeficitDays: number;
  stageTwoThreshold: number;
  stageThreeThreshold: number;
}

export interface BodyStateRecoveryRuleState {
  campMultipliers: Record<RecoveryCampTierId, number>;
  safetyMultipliers: Record<RecoverySafetyTierId, number>;
}

export interface BodyStateBalanceRuleState {
  version: number;
  targets: BodyStateTargetRuleState;
  energy: BodyStateEnergyRuleState;
  protein: BodyStateProteinRuleState;
  hydration: BodyStateHydrationRuleState;
  fatigue: BodyStateFatigueRuleState;
  intoxication: BodyStateIntoxicationRuleState;
  starvation: BodyStateStarvationRuleState;
  recovery: BodyStateRecoveryRuleState;
}

export interface EchoBalanceExponentsState {
  skill: number;
  stat: number;
  knowledge: number;
}

export interface EchoBalanceWeightsState {
  skills: number;
  stats: number;
  knowledge: number;
}

export interface EchoBalanceNormalizationState {
  skillReferenceRank: number;
  skillReferenceSlots: number;
  knowledgeSkillReferenceRank: number;
  knowledgeSkillReferenceSlots: number;
  statReferenceDelta: number;
  trackedAttributeKeys: PlayerAttributeKey[];
}

export interface EchoBalanceDiversityState {
  thresholdRank: number;
  bonusPerSkill: number;
  maxMultiplier: number;
}

export interface EchoBalanceRuleState {
  version: number;
  exponents: EchoBalanceExponentsState;
  weights: EchoBalanceWeightsState;
  levelScale: number;
  normalization: EchoBalanceNormalizationState;
  diversity: EchoBalanceDiversityState;
}

export interface EchoRequirementState {
  minLevel: number;
  minEchoAdjusted?: number | null;
}

export interface PlayerEchoState {
  balanceRuleId: string;
  balanceRuleVersion: number;
  skillContribution: number;
  statContribution: number;
  knowledgeContribution: number;
  echoBase: number;
  diversityCount: number;
  diversityBonus: number;
  echoAdjusted: number;
}

export interface PlayerLegacyGrowthState {
  resourceGrowthLevel: number;
  classLevel: number;
  unspentAttributePoints: number;
  unspentSkillPoints: number;
}

export interface PlayerProgression {
  level: number;
  echo: PlayerEchoState;
  legacyGrowth: PlayerLegacyGrowthState;
}

export type SkillProgressionBandId = "clumsy" | "familiar" | "proficient" | "skilled" | "mastery";
export type ProgressionTrackType =
  | "resource"
  | "survival"
  | "combat_fundamentals"
  | "weapon"
  | "defense"
  | "armor"
  | "tactical_combat"
  | "magic_core"
  | "magic_school"
  | "crafting"
  | "settlement"
  | "leadership"
  | "knowledge";
export type SpellScalingChannel =
  | "power"
  | "duration"
  | "magnitude"
  | "radius"
  | "manaEfficiency"
  | "accuracy"
  | "healingPower"
  | "barrier"
  | "charges"
  | "statusChance"
  | "summonPotency"
  | "tempo";

export interface SkillProgressionBandState {
  id: SkillProgressionBandId;
  label: string;
  minRank: number;
  maxRank: number;
  softCapRank: number;
  requiresBreakthrough: boolean;
  requiresMasteryTrial?: boolean;
}

export interface SkillProgressionTrackState {
  id: string;
  name: string;
  trackType: ProgressionTrackType;
  rankRange: {
    min: number;
    max: number;
  };
  bands: SkillProgressionBandState[];
  breakthroughGateRanks: number[];
  gainModel: Record<string, number>;
  breakthroughSources: Record<string, number>;
}

export interface KnowledgeSupportWeightsState {
  domainKnowledge: number;
  generalLore: number;
  spotting: number;
}

export interface KnowledgeDomainThresholdState {
  common: number;
  uncommon: number;
  rare: number;
  obscure: number;
}

export interface KnowledgeDomainState {
  id: string;
  name?: string;
  domain?: string;
  knowledgeSkillId: string;
  spottingSkillId?: string;
  identifySkillId?: string;
  generalSupportSkillId?: string;
  supportWeights: KnowledgeSupportWeightsState;
  identifyDifficulty: KnowledgeDomainThresholdState;
  autoIdentifyThresholds: KnowledgeDomainThresholdState;
}

export interface SkillLevelingState {
  defaultRank: number;
  maximumRank: number;
}

export interface SkillCombatHooksState {
  skillEffectIds: string[];
  actionGrantTags: string[];
  tacticalTags: string[];
  titleModifierTags: string[];
  spellTags: string[];
  resolutionHooks: string[];
}

export interface SkillEffectScalingState {
  mode: string;
  base: number;
  perRank: number;
  perAttributePoint?: number;
}

export interface SkillEffectChannelState {
  actionType?: string;
  actionTags?: string[];
  grantType?: string;
  effectChannel: string;
  scaling: SkillEffectScalingState;
  combatTags?: string[];
  resolutionHooks?: string[];
}

export interface SkillEffectProfileState {
  id: string;
  skillId: string;
  name: string;
  channels: SkillEffectChannelState[];
}

export interface ActionCostProfileState {
  hp?: number;
  mp?: number;
  stamina?: number;
}

export interface ActionTargetConditionState {
  scope: "actor" | "target";
  condition: string;
  qualifier?: string;
}

export interface ActionTargetProfileState {
  disposition: "ally" | "enemy" | "self" | "any";
  shape: string;
  range: string;
  maxTargets: number;
  requiresAccuracy: boolean;
}

export interface ActionActivationProfileState {
  type: "active" | "reaction" | "passive";
  actionType: string;
  timing: string;
  executionTimeTicks: number;
  recoveryTimeTicks: number;
  interruptible: boolean;
  costs: ActionCostProfileState;
}

export interface SpellItemGenerationHookState {
  generatedItemId: string;
  generatedItemName: string;
  charges: number;
  partyLimited: boolean;
  dissipatesOnChargeLoss: boolean;
  combatTags: string[];
}

export interface TitleMilestoneState {
  threshold: number;
  requiresMasteryTrial: boolean;
  trialId?: string | null;
}

export interface TrialCheckpointState {
  id: string;
  label: string;
  progressRequired: number;
}

export interface TrialDefinitionState {
  id: string;
  name: string;
  associatedSkillId: string;
  echoRequirement?: EchoRequirementState | null;
  thresholdToPass: number;
  progress: number;
  maxPotential: number;
  checkpoints: TrialCheckpointState[];
  rewards: Record<string, unknown>[];
  penalties: Record<string, unknown>[];
}

export interface PlayerSkillProgressState {
  progressionTrackId?: string;
  currentBandId?: SkillProgressionBandId;
  unlockedBandIds: SkillProgressionBandId[];
  breakthroughProgress: number;
  lastBreakthroughRank?: number | null;
}

export interface PlayerTrialProgressState {
  trialId: string;
  associatedSkillId: string;
  progress: number;
  maxPotential: number;
  completedCheckpointIds: string[];
  passed: boolean;
  failed: boolean;
}

export interface ItemUseProfileState {
  actionType: string;
  primarySkillId: string;
  supportSkillIds: string[];
  requiredSkillRank: number;
  masteryRank: number;
  effectChannels: string[];
  handlingType?: "weapon" | "shield" | "armor" | "tool" | "hybrid";
  proficiencySkillId?: string;
  hybridSkillIds?: string[];
  combatTags?: string[];
  resolutionHooks?: string[];
  targetProfile?: ActionTargetProfileState;
  activation?: ActionActivationProfileState;
  grantTags?: string[];
}

export type PlayerSkillSource = "innate" | "trained";

export interface PlayerSkillState {
  id: string;
  rank: number;
  source: PlayerSkillSource;
  progression?: PlayerSkillProgressState;
}

export type LearnedPowerSource = "learned" | "taught";

export interface PlayerSpellState {
  id: string;
  school: string;
  tradition?: string;
  discipline?: string;
  element?: string;
  rank: number;
  source: LearnedPowerSource;
}

export type PlayerAbilityCategory = "melee" | "ranged" | "tactical" | "defensive" | "command" | "reaction";

export interface PlayerAbilityState {
  id: string;
  category: PlayerAbilityCategory;
  rank: number;
  source: LearnedPowerSource;
}

export type PlayerTraitSource = "innate" | "lineage" | "supernatural";

export interface PlayerTraitState {
  id: string;
  source: PlayerTraitSource;
}

export type EquipmentSlotId =
  | "slot.weapon.left"
  | "slot.weapon.right"
  | "slot.armor.head"
  | "slot.armor.shoulder"
  | "slot.armor.chest"
  | "slot.armor.arm"
  | "slot.armor.hand"
  | "slot.armor.waist"
  | "slot.armor.leg"
  | "slot.armor.foot"
  | "slot.accessory.ear"
  | "slot.accessory.eyes"
  | "slot.accessory.neck"
  | "slot.accessory.arms"
  | "slot.accessory.fingers"
  | "slot.accessory.waist"
  | "slot.accessory.ankle";

export interface EquippedItemRef {
  itemId: string;
  itemKey: string;
  quantity: number;
  durability?: number;
  resourceModifiers?: PlayerResourceModifierState[];
}

export type EquipmentState = Record<EquipmentSlotId, EquippedItemRef | null>;

export interface InventoryStack {
  itemId: string;
  itemKey: string;
  quantity: number;
}

export interface InventoryBag {
  id: string;
  label: string;
  slotCapacity: number;
  stacks: InventoryStack[];
}

export interface PlayerInventoryState {
  bags: InventoryBag[];
  overflow: InventoryStack[];
}

export interface PlayerCoreData {
  playerName: string;
  lineageId: string;
  sexId: PlayerSexId;
  classId: string | null;
  jobId: string | null;
  backstoryId?: string | null;
  startingBundleId?: string | null;
  identityProfile?: PlayerIdentityProfile | null;
}

export interface PlayerSaveMetadata {
  totalPlayTicks: number;
  lastRestAtTick: number;
  lastSavedAtTick: number;
  lastReputationDecayDay?: number | null;
}

export interface PlayerLocationState {
  settlementId: string | null;
  siteLabel: string | null;
  worldMapId: string | null;
}

export interface PlayerCurrencyState {
  gold: number;
  silver: number;
  copper: number;
}

export interface PlayerIdentityProfile {
  heightCm: number | null;
  ageBandId: PlayerIdentityAgeBandId | null;
  physiqueId: PlayerIdentityPhysiqueId | null;
  natureId: PlayerIdentityNatureId | null;
  focusId: PlayerIdentityFocusId | null;
  hairColorId: string | null;
  hairHighlightColorId: string | null;
  eyeColorId: string | null;
  skinToneId: string | null;
}

export interface PlayerStandingState {
  id: string;
  label: string;
  standingLabel: string;
  score: number;
  effects: string[];
}

export type AchievementLayer = "account" | "character";
export type AchievementCategory =
  | "combat"
  | "travel"
  | "discovery"
  | "crafting"
  | "trade"
  | "social"
  | "reputation"
  | "beginnings";
export type AchievementRarity = "common" | "notable" | "legendary";
export type AchievementMetricId =
  | "character.combat.entries"
  | "character.travel.entries"
  | "character.discovery.entries"
  | "character.crafting.entries"
  | "character.trade.entries"
  | "character.quests.completed"
  | "character.reputation.historical_total"
  | "account.combat.entries_total"
  | "account.travel.entries_total"
  | "account.discovery.entries_total"
  | "account.crafting.entries_total"
  | "account.trade.entries_total"
  | "account.quests.completed_total"
  | "account.reputation.historical_total"
  | "account.runs.started"
  | "account.starts.lineages"
  | "account.starts.continents"
  | "account.starts.regions"
  | "account.starts.settlements";

export interface AchievementRewardState {
  legacyPoints?: number;
  unlockId?: string;
}

export interface AchievementDefinitionState {
  id: string;
  layer: AchievementLayer;
  category: AchievementCategory;
  title: string;
  description: string;
  metricId: AchievementMetricId;
  targetValue: number;
  hiddenByDefault?: boolean;
  rarity?: AchievementRarity;
  reward?: AchievementRewardState;
  tags?: string[];
}

export interface CharacterAchievementUnlockState {
  achievementId: string;
  unlockedAt: string;
}

export interface AccountAchievementUnlockState {
  achievementId: string;
  unlockedAt: string;
  sourceCharacterId: string;
  rewardTransactionId?: string;
}

export interface CharacterAchievementsState {
  unlocked: CharacterAchievementUnlockState[];
}

export interface AccountAchievementsState {
  unlocked: AccountAchievementUnlockState[];
  revealedCharacterAchievementIds: string[];
  cumulativeMetrics: Record<AchievementMetricId, number>;
  characterMetricHighWaterMarks: Record<string, Partial<Record<AchievementMetricId, number>>>;
}

export type SaveSlotId = string;
export type AccountRunHistoryOutcome = "active" | "retired" | "archived" | "deleted";
export type AccountRunArchiveReason = "retired" | "dead" | "hardcore_dead";

export interface RunLegacyPayoutBreakdownState {
  progressionDepth: number;
  notableDeeds: number;
  survivalDepth: number;
  milestoneQuality: number;
  archiveReasonModifier: number;
  challengeModifier: number;
  shallowRunModifier: number;
  repeatedWeakRunModifier: number;
  rawScore: number;
  modifiedScore: number;
  finalAmount: number;
}

export interface AccountRunHistoryRecord {
  characterId: string;
  name: string;
  lineageId: string;
  startingContinentId: string;
  startingRegionId: string;
  startingSettlementId: string;
  startedAt: string;
  endedAt?: string;
  lastSeenAt: string;
  outcome: AccountRunHistoryOutcome;
  archiveReason?: AccountRunArchiveReason;
  echoLevelReached: number;
  notableCharacterAchievementIds: string[];
  legacyGranted?: number;
  inheritanceUsesRemaining?: number;
  totalPlayTicks?: number;
  survivedDays?: number;
  payoutEligible?: boolean;
  payoutBreakdown?: RunLegacyPayoutBreakdownState;
  legacyPayoutResolvedAt?: string;
  legacyPayoutTransactionId?: string;
  saveSlotIds: SaveSlotId[];
}

export interface AccountHistoryState {
  runRecords: AccountRunHistoryRecord[];
}

export interface PlayerTitleState {
  id: string;
  name: string;
  family: string;
  trackId: string;
  sourceSkillId: string | null;
  milestone: TitleMilestoneState;
  equipped: boolean;
  effects: string[];
}

export type PlayerDiscoveryCategory =
  | "flora"
  | "fauna"
  | "minerals"
  | "items"
  | "recipes"
  | "factions"
  | "notes";

export interface PlayerDiscoveryChronicleEntryState {
  id: string;
  codexEntryId: string;
  category: PlayerDiscoveryCategory;
  title: string;
  discoveredAtTick: number;
  discoveredAtLabel: string;
  regionLabel: string;
  sourceType: string;
  sourceId: string | null;
  notes: string[];
}

export interface PlayerDiscoveryChronicleState {
  entries: PlayerDiscoveryChronicleEntryState[];
  lastUpdatedTick: number | null;
}

export type GeographicKnowledgeScope = "continent" | "region" | "settlement";

export interface PlayerGeographicKnowledgeState {
  scope: GeographicKnowledgeScope;
  geographyId: string;
  level: number;
}

export interface PlayerFameBranchState {
  scope: ReputationScope;
  scopeId: string;
  branchId: FameBranchId;
  earned: number;
  currentEarned: number;
  historical: number;
  lastMeaningfulGainTick: number | null;
}

export interface PlayerNotorietyCategoryState {
  scope: ReputationScope;
  scopeId: string;
  categoryId: NotorietyCategoryId;
  severity: NotorietySeverityId;
  modifiers: NotorietyModifierId[];
  modifiersSignature: string;
  earned: number;
  currentEarned: number;
  historical: number;
  lastMeaningfulGainTick: number | null;
  repeatCount: number;
}

export interface PlayerNotorietyEventState {
  id: string;
  scope: ReputationScope;
  scopeId: string;
  settlementId: string;
  categoryId: NotorietyCategoryId;
  severity: NotorietySeverityId;
  modifiers: NotorietyModifierId[];
  earned: number;
  currentEarned: number;
  historical: number;
  occurredAtTick: number;
  lastMeaningfulGainTick: number | null;
  exposureState: NotorietyExposureState;
  attributionState: NotorietyAttributionState;
  unresolved: boolean;
}

export interface PlayerReputationState {
  fame: PlayerFameBranchState[];
  notoriety: PlayerNotorietyCategoryState[];
  notorietyEvents: PlayerNotorietyEventState[];
}

export interface ResolvedFameScopeState {
  scope: ReputationScope;
  scopeId: string;
  currentEarned: number;
  currentThreshold: number;
  currentTotal: number;
  historical: number;
  topBranchId: FameBranchId | null;
  recognitionBandId: FameRecognitionBandId | null;
  historicalTier: ReputationHistoricalTierId;
}

export interface ResolvedNotorietyScopeState {
  scope: ReputationScope;
  scopeId: string;
  currentEarned: number;
  currentThreshold: number;
  currentTotal: number;
  historical: number;
  topCategoryId: NotorietyCategoryId | null;
  highestSeverity: NotorietySeverityId | null;
  activeFlags: NotorietyModifierId[];
  seriousnessClass: NotorietySeriousnessClassId;
  historicalTier: ReputationHistoricalTierId;
}

export interface FameRecognitionBandThresholdState {
  id: FameRecognitionBandId;
  minimumCurrentTotal: number;
  minimumHistorical: number;
  directHigherScopeBonus: number;
}

export interface ReputationVectorWeightState {
  value: number;
  persistence: number;
  seriousness: number;
}

export interface NotorietySeriousnessThresholdState {
  id: NotorietySeriousnessClassId;
  minimumScore: number;
  minimumSeverity?: NotorietySeverityId | null;
  violentOnly?: boolean;
  requiredModifiers?: NotorietyModifierId[];
  minimumDirectScope?: ReputationScope | null;
}

export interface ReputationBalanceRuleState {
  version: number;
  localCurrentDirectDecayPerDay: number;
  regionalCurrentDirectDecayPerDay: number;
  continentalCurrentDirectDecayPerDay: number;
  worldCurrentDirectDecayPerDay: number;
  regionalThresholdFloor: number;
  continentalThresholdFloor: number;
  worldThresholdFloor: number;
  regionalCarryoverFactor: number;
  continentalCarryoverFactor: number;
  worldCarryoverFactor: number;
  meaningfulContributionFloor: number;
  fameBranchValidation: Record<ReputationScope, FameBranchId[]>;
  notorietyCategoryWeights: Partial<Record<NotorietyCategoryId, ReputationVectorWeightState>>;
  notorietySeverityMultipliers: Record<NotorietySeverityId, ReputationVectorWeightState>;
  notorietyModifierMultipliers: Partial<Record<NotorietyModifierId, ReputationVectorWeightState>>;
  simultaneousSeriousCrimePersistenceCap: number;
  notorietySeriousnessThresholds: NotorietySeriousnessThresholdState[];
  fameRecognitionBandThresholds: FameRecognitionBandThresholdState[];
}

export interface PlayerOriginProfileState {
  lineageId: string;
  lineageLabel: string;
  classId: string | null;
  classLabel: string | null;
  sexId: PlayerSexId;
  attributeAdjustments: PlayerAttributeAdjustments;
  resourceBaseAdjustments: PlayerResourceGrowthVector;
  lineageResourceGrowthPerLevel: PlayerResourceGrowthVector;
  classResourceGrowthPerClassLevel: PlayerResourceGrowthVector;
  resolvedResourceMaxima: PlayerResourceGrowthVector;
  notes: string[];
}

export type UiTone = "accent" | "success" | "warning" | "neutral" | "danger";

export interface NotificationState {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  tone: UiTone;
}

export type WorldLocationType = "settlement" | "ruin" | "harbor" | "fort";

export interface KnownLocationState {
  id: string;
  name: string;
  regionLabel: string;
  type: WorldLocationType;
  x: number;
  y: number;
  note: string;
  known: boolean;
}

export interface PanelRecordDetailEntry {
  label: string;
  value: string;
}

export interface PanelRecordState {
  id: string;
  sectionId: string;
  title: string;
  subtitle?: string;
  meta?: string;
  status?: string;
  summary: string;
  tags: string[];
  detailEntries: PanelRecordDetailEntry[];
}

export interface CodexEntryState {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  status?: string;
  summary: string;
  tags: string[];
  habitat: string;
  uses: string;
  valueDescription: string;
  regionTags: string[];
  locked?: boolean;
}

export type QuestJournalCategory = "active" | "contracts" | "completed" | "failed";

export interface QuestJournalEntryState {
  id: string;
  category: QuestJournalCategory;
  title: string;
  regionLabel: string;
  rewardLabel: string;
  summary: string;
  statusLabel?: string;
  tracked?: boolean;
  objectives: string[];
  rewards: string[];
  relatedLocations: string[];
  tags: string[];
}

export type ChronicleCategory =
  | "combat"
  | "trade"
  | "social"
  | "travel"
  | "crafting"
  | "discovery"
  | "reputation";

export interface ChronicleEventState {
  id: string;
  category: ChronicleCategory;
  title: string;
  timeLabel: string;
  summary: string;
  statusLabel?: string;
  entities: string[];
  results: string[];
  statChanges: string[];
  tags: string[];
}

export interface OperationState {
  id: string;
  title: string;
  stage: string;
  progress: number;
  etaLabel: string;
  owner: string;
  output: string;
  priority: "Low" | "Normal" | "High";
}

export type LegacyTransactionKind = "grant" | "spend";

export type LegacyUnlockCategory =
  | "Origins"
  | "Titles"
  | "Perks"
  | "Traits"
  | "Account"
  | "Chronicle"
  | "Heir";

export type LegacyUnlockKind = "binary" | "tiered" | "incremental";

export type LegacyUnlockRequirementResolutionState =
  | "eligible"
  | "unmet"
  | "unsupported";

export type LegacyUnlockRequirementState =
  | {
      type: "achievement";
      achievementId: string;
    }
  | {
      type: "run_count";
      count: number;
      outcome?: AccountRunHistoryOutcome;
      archiveReason?: AccountRunArchiveReason;
    }
  | {
      type: "lineage_recorded";
      lineageId: string;
    }
  | {
      type: "echo_peak";
      level: number;
    }
  | {
      type: "survived_days";
      days: number;
    }
  | {
      type: "lifetime_legacy";
      amount: number;
    }
  | {
      type: "character_skill";
      skillId: string;
      rank: number;
    }
  | {
      type: "role_rank";
      roleId: string;
      rank: number;
    }
  | {
      type: "wealth";
      amount: number;
    };

export type LegacyUnlockCostState =
  | {
      type: "fixed";
      amount: number;
    }
  | {
      type: "per_rank";
      amounts: number[];
    }
  | {
      type: "progressive";
      baseAmount: number;
      growthFactor: number;
      thresholdJumps?: Array<{
        rank: number;
        multiplier: number;
      }>;
    };

export type LegacyUnlockEffectKind =
  | "account_flag"
  | "profile_title"
  | "chronicle_presentation"
  | "future_heir_start"
  | "future_inheritance_uses";

export interface LegacyUnlockEffectState {
  type: LegacyUnlockEffectKind;
  key: string;
  value?: string | number | boolean;
}

export interface LegacyUnlockDefinitionState {
  id: string;
  category: LegacyUnlockCategory;
  kind: LegacyUnlockKind;
  title: string;
  description: string;
  maxRank?: number;
  cost: LegacyUnlockCostState;
  requirements?: LegacyUnlockRequirementState[];
  rankRequirements?: LegacyUnlockRequirementState[][];
  effects: LegacyUnlockEffectState[];
  tags?: string[];
}

export interface LegacyUnlockState {
  unlockId: string;
  unlockedAt: string;
  sourceTransactionId: string;
  rank?: number;
}

export interface LegacyTransactionState {
  id: string;
  kind: LegacyTransactionKind;
  amount: number;
  balanceAfter: number;
  recordedAt: string;
  summary: string;
  sourceType: string;
  sourceId: string;
  unlockId?: string;
}

export interface AccountLegacyState {
  legacyPoints: number;
  lifetimeLegacyEarned: number;
  legacyUnlocks: LegacyUnlockState[];
  legacyTransactions: LegacyTransactionState[];
}

export interface AccountProfileState {
  accountId: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  lastPlayedAt?: string;
  legacy: AccountLegacyState;
  achievements: AccountAchievementsState;
  history: AccountHistoryState;
}

export interface CurrentActivityState {
  id: string;
  label: string;
  category: string;
  detail?: string;
}

export interface SessionState {
  activeEvents: string[];
  flags: string[];
  triggers: string[];
  completedEvents: string[];
  trackedQuestId: string | null;
  currentActivity: CurrentActivityState | null;
  pinnedRecordIds: string[];
  notifications: NotificationState[];
  knownLocations: KnownLocationState[];
  worldRecords: PanelRecordState[];
  activityRecords: PanelRecordState[];
  operations: OperationState[];
  codexEntries: CodexEntryState[];
  questJournal: QuestJournalEntryState[];
  chronicle: ChronicleEventState[];
  combatUi: CombatUiState;
}

export interface PlayerState {
  playerId: string;
  regionId: string;
  coreData: PlayerCoreData;
  attributes: PlayerAttributes;
  statGrowth: PlayerStatGrowthState;
  resources: PlayerResources;
  resourceRuntime: PlayerResourceRuntimeState;
  bodyState: PlayerBodyState;
  progression: PlayerProgression;
  skills: PlayerSkillState[];
  spells: PlayerSpellState[];
  abilities: PlayerAbilityState[];
  traits: PlayerTraitState[];
  activeTrials?: PlayerTrialProgressState[];
  equipment: EquipmentState;
  inventory: PlayerInventoryState;
  activeEffects: string[];
  location: PlayerLocationState;
  currency: PlayerCurrencyState;
  originProfile: PlayerOriginProfileState;
  standing: PlayerStandingState[];
  reputation: PlayerReputationState;
  titles: PlayerTitleState[];
  geographicKnowledge: PlayerGeographicKnowledgeState[];
  discoveryChronicle: PlayerDiscoveryChronicleState;
  achievements: CharacterAchievementsState;
  activeQuestIds: string[];
  completedQuestIds: string[];
  flags: string[];
  combatProfile: PlayerCombatProfileState;
  saveMeta: PlayerSaveMetadata;
}

export interface GameState {
  worldVersion: string;
  activeScenario: string;
  runDifficulty: RunDifficultyState;
  mode: CombatModeState;
  party: PartyRuntimeState;
  activeEncounter: CombatEncounterState | null;
  combatHistory: CombatEncounterHistoryEntryState[];
}

export interface WorldTickContext extends TickContextBase<WorldState> {
  climateProfileId: string;
}

export interface CivilizationTickContext extends TickContextBase<CivilizationState> {
  economyProfileId: string;
}

export interface PlayerTickContext extends TickContextBase<PlayerState> {
  saveSlotId: string;
  runDifficulty?: RunDifficultyState;
}

export interface GameTickContext extends TickContextBase<GameState> {
  worldContext: WorldTickContext;
  civilizationContext: CivilizationTickContext;
  playerContext: PlayerTickContext;
  sessionState?: SessionState;
}

export interface WorldDelta {
  kind: "weather" | "ecology" | "spawn";
  regionId: string;
  payload: Record<string, unknown>;
}

export interface CivilizationDelta {
  kind: "production" | "market" | "logistics" | "economy" | "quests" | "trade" | "settlement";
  settlementId?: string;
  payload: Record<string, unknown>;
}

export interface PlayerDelta {
  kind:
    | "attributes"
    | "body_state"
    | "inventory"
    | "progression"
    | "resources"
    | "origin"
    | "location"
    | "currency"
    | "equipment"
    | "skills"
    | "abilities"
    | "spells"
    | "traits"
    | "discovery"
    | "standing"
    | "reputation"
    | "titles"
    | "combat_profile";
  playerId: string;
  payload: Record<string, unknown>;
}

export interface GameDelta {
  kind: "orchestration" | "events" | "combat";
  payload: Record<string, unknown>;
}

export interface TickResult<TDelta = unknown> {
  domain: DomainKey;
  appliedTick: number;
  deltas: TDelta[];
  emittedEvents: GameEventEnvelope[];
  warnings: string[];
}

export interface ContentPackManifest {
  id: string;
  version: string;
  title: string;
  author: string;
  dependencies: string[];
  loadOrder: number;
  enabledByDefault: boolean;
}

export interface ContentRecordRef {
  domain: DomainKey;
  table: string;
  id: string;
}

export interface OverrideRule {
  target: ContentRecordRef;
  strategy: "merge" | "replace" | "remove";
  sourceFile: string;
}

export interface SaveSnapshot {
  accountId: string;
  snapshotVersion: string;
  capturedAtTick: number;
  clock: SimulationClock;
  gameState: GameState;
  playerState: PlayerState;
  worldState: WorldState;
  civilizationState: CivilizationState;
  sessionState: SessionState;
}
