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

export interface CivilizationEconomyState {
  nodes: EconomyNodeState[];
  lastSnapshots: EconomyLedgerSnapshot[];
  lastLevelTotals: EconomyLevelTotals[];
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
  quests: CivilizationQuestState;
}

export type PlayerAttributeKey = "STR" | "DEX" | "AGI" | "CON" | "VIT" | "WIS" | "INT" | "SPT" | "CHA";

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

export interface PlayerProgression {
  level: number;
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
  classId: string | null;
  jobId: string | null;
}

export interface PlayerSaveMetadata {
  totalPlayTicks: number;
  lastRestAtTick: number;
  lastSavedAtTick: number;
}

export interface PlayerState {
  playerId: string;
  regionId: string;
  coreData: PlayerCoreData;
  attributes: PlayerAttributes;
  resources: PlayerResources;
  progression: PlayerProgression;
  skills: PlayerSkillState[];
  spells: PlayerSpellState[];
  abilities: PlayerAbilityState[];
  traits: PlayerTraitState[];
  equipment: EquipmentState;
  inventory: PlayerInventoryState;
  activeEffects: string[];
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
  kind: "production" | "market" | "logistics" | "economy" | "quests";
  settlementId?: string;
  payload: Record<string, unknown>;
}

export interface PlayerDelta {
  kind:
    | "attributes"
    | "inventory"
    | "progression"
    | "resources"
    | "equipment"
    | "skills"
    | "abilities"
    | "spells"
    | "traits";
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
  playerState: PlayerState;
  worldState: WorldState;
  civilizationState: CivilizationState;
  sessionState: {
    activeEvents: string[];
    flags: string[];
    triggers: string[];
    completedEvents: string[];
  };
}
