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
