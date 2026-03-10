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

export interface CivilizationState {
  settlements: string[];
  markets: string[];
}

export interface PlayerState {
  playerId: string;
  regionId: string;
  stats: Record<string, number>;
  flags: string[];
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
  kind: "production" | "market" | "logistics";
  settlementId: string;
  payload: Record<string, unknown>;
}

export interface PlayerDelta {
  kind: "attributes" | "inventory" | "progression";
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