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

export interface QuestOfferState {
  id: string;
  templateId: string;
  settlementId: string;
  issuerGuildType: string;
  issuerName: string;
  category: QuestTemplateCategory;
  urgency: number;
  rewardCoin: number;
  rewardReputation: number;
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

export type PlayerAttributeKey = "STR" | "DEX" | "AGI" | "CON" | "VIT" | "WIS" | "INT" | "SPT" | "CHA";
export type PlayerSexId = "male" | "female" | "neutral";

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

export interface PlayerProgression {
  level: number;
  classLevel: number;
  unspentAttributePoints: number;
  unspentSkillPoints: number;
}

export type PlayerSkillSource = "innate" | "trained";

export interface PlayerSkillState {
  id: string;
  rank: number;
  source: PlayerSkillSource;
}

export type LearnedPowerSource = "learned" | "taught";

export interface PlayerSpellState {
  id: string;
  school: string;
  element?: string;
  rank: number;
  source: LearnedPowerSource;
}

export type PlayerAbilityCategory = "class" | "job" | "weapon" | "general";

export interface PlayerAbilityState {
  id: string;
  category: PlayerAbilityCategory;
  rank: number;
  source: LearnedPowerSource;
}

export type PlayerTraitSource = "innate" | "lineage" | "class" | "equipment" | "story";

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
}

export interface PlayerSaveMetadata {
  totalPlayTicks: number;
  lastRestAtTick: number;
  lastSavedAtTick: number;
}

export interface PlayerLocationState {
  settlementId: string | null;
  siteLabel: string | null;
  worldMapId: string | null;
  knownSettlementIds: string[];
}

export interface PlayerCurrencyState {
  gold: number;
  silver: number;
  copper: number;
}

export interface PlayerReputationState {
  id: string;
  label: string;
  standingLabel: string;
  score: number;
  effects: string[];
}

export interface PlayerTitleState {
  id: string;
  label: string;
  source: string;
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
}

export interface PlayerState {
  playerId: string;
  regionId: string;
  coreData: PlayerCoreData;
  attributes: PlayerAttributes;
  resources: PlayerResources;
  resourceRuntime: PlayerResourceRuntimeState;
  progression: PlayerProgression;
  skills: PlayerSkillState[];
  spells: PlayerSpellState[];
  abilities: PlayerAbilityState[];
  traits: PlayerTraitState[];
  equipment: EquipmentState;
  inventory: PlayerInventoryState;
  activeEffects: string[];
  location: PlayerLocationState;
  currency: PlayerCurrencyState;
  originProfile: PlayerOriginProfileState;
  reputation: PlayerReputationState[];
  titles: PlayerTitleState[];
  discoveryChronicle: PlayerDiscoveryChronicleState;
  discoveredRegions: string[];
  activeQuestIds: string[];
  completedQuestIds: string[];
  flags: string[];
  saveMeta: PlayerSaveMetadata;
}

export interface GameState {
  worldVersion: string;
  activeScenario: string;
}

export interface WorldTickContext extends TickContextBase<WorldState> {
  climateProfileId: string;
}

export interface CivilizationTickContext extends TickContextBase<CivilizationState> {
  economyProfileId: string;
}

export interface PlayerTickContext extends TickContextBase<PlayerState> {
  saveSlotId: string;
}

export interface GameTickContext extends TickContextBase<GameState> {
  worldContext: WorldTickContext;
  civilizationContext: CivilizationTickContext;
  playerContext: PlayerTickContext;
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
    | "reputation"
    | "titles";
  playerId: string;
  payload: Record<string, unknown>;
}

export interface GameDelta {
  kind: "orchestration" | "events";
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
  snapshotVersion: string;
  capturedAtTick: number;
  clock: SimulationClock;
  playerState: PlayerState;
  worldState: WorldState;
  civilizationState: CivilizationState;
  sessionState: SessionState;
}
