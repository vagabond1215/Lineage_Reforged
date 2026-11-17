/**
 * L3b candidate-only durable World authority for the clean-epoch v8 store.
 * No UI is bound to this API. Do not advertise travel, shops, or playable areas.
 */
import { createInitialClock } from "../../../../packages/shared/time/src/index.js";
import { buildStarfallBaseEconomyPreview,
  STARFALL_STARTING_SETTLEMENT_IDS, STARFALL_EXTERNAL_TRADE_CONTEXT_IDS
} from "../../../../packages/engines/civilization-engine/src/starfall-base-economy.js";
import {
  FIRST_WORLD_TEMPLATE_ID, FIRST_WORLD_MAP_ID, FIRST_WORLD_LOCAL_AREA_TEMPLATE_ID,
  prepareChronicleWorldGenesis,
  type ChronicleWorldCreationInput, type ChronicleWorldGenesisCandidate,
  type ChronicleWorldGenesisPlan
} from "./firstWorldCreationContract.js";

export type RetainedChronicleWorld = Omit<ChronicleWorldGenesisCandidate,
  "candidateOnly" | "canonicalWritable" | "economyBootstrap"> & {
  status: "CREATED_EMPTY";
  economyState: WorldEconomyGenesis;
};

export type WorldEconomyGenesis = {
  version: 1;
  owner: "civilization-engine";
  source: "starfall_base_economy_read_only_preview_v1";
  worldInstanceId: string;
  sourceManifestFingerprint: string;
  economyTick: 0;
  clock: ReturnType<typeof createInitialClock>;
  localSettlementIds: string[];
  externalTradeContextSettlementIds: string[];
  authoredPosture: ReturnType<typeof buildStarfallBaseEconomyPreview>["authoredPosture"];
  projection: ReturnType<typeof buildStarfallBaseEconomyPreview>["projection"];
  warnings: string[];
  servicesEnabled: false;
  inventoryItemsMinted: false;
};

export type RetainedWorldCreationReceipt = Omit<ChronicleWorldGenesisPlan["receipt"],
  "state" | "canonicalWritable"> & {
  state: "COMMITTED";
  createdAt: string;
  completedWorldRevision: 0;
};

export type PreparedDurableWorld = {
  world: RetainedChronicleWorld;
  receipt: RetainedWorldCreationReceipt;
};

type ObjectRecord = Record<string, unknown>;
function obj(x: unknown): x is ObjectRecord {
  return !!x && typeof x === "object" && !Array.isArray(x);
}
function str(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0 && x.trim() === x;
}
function validDate(x: unknown): boolean {
  return str(x) && !Number.isNaN(Date.parse(x)) && new Date(x).toISOString() === x;
}
function same(a: unknown, b: unknown): boolean { return JSON.stringify(a) === JSON.stringify(b); }
function emptyLists(x: ObjectRecord): boolean {
  return ["characterAssociations", "campaignSaveAssociations", "materializedAreaInstances",
    "areaMutationRecords", "spawnedEntityRecords", "resourceDepletionRecords",
    "scheduledActionRecords", "pendingPublicationReceipts", "committedWorldEvents",
    "inventoryMutationRecords"].every(key => Array.isArray(x[key]) && (x[key] as unknown[]).length === 0);
}
/** Canonicalize only optional undefined OBJECT fields from engine projections.
 * Undefined/holes in arrays, Map/Set, nonfinite numbers, and prototypes fail
 * closed rather than being silently serialized to null or empty objects.
 */
function portableEngineProjection<T>(value: T): T {
  const walk = (current: unknown, path: string): unknown => {
    if (current === null || typeof current === "string" || typeof current === "boolean") return current;
    if (typeof current === "number" && Number.isFinite(current)) return current;
    if (Array.isArray(current)) {
      return current.map((entry, i) => {
        if (!Object.prototype.hasOwnProperty.call(current, i) || entry === undefined)
          throw Error("L3b economy has an unsupported array element: " + path + "." + i);
        return walk(entry, path + "." + i);
      });
    }
    if (!current || typeof current !== "object" ||
        Object.getPrototypeOf(current) !== Object.prototype ||
        Object.getOwnPropertySymbols(current).length)
      throw Error("L3b economy has an unsupported record value: " + path);
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(current))
      if (entry !== undefined) result[key] = walk(entry, path + "." + key);
    return result;
  };
  return walk(value, "economy") as T;
}

function jsonSafe(value: unknown): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (!value || typeof value !== "object" || Object.getOwnPropertySymbols(value).length) return false;
  if (Array.isArray(value))
    return Object.keys(value).length === value.length && value.every(jsonSafe);
  return Object.getPrototypeOf(value) === Object.prototype &&
    Object.values(value).every(jsonSafe);
}

/** Preliminary immutable economy state. Committed only by a successful v8 DB transaction. */
export async function prepareDurableChronicleWorld(input: ChronicleWorldCreationInput):
  Promise<PreparedDurableWorld> {
  const genesis = await prepareChronicleWorldGenesis(input);
  if (genesis.allowedToWriteExistingEpochV7 !== false ||
      genesis.receipt.state !== "PREPARED_NOT_COMMITTED") throw Error("L3b genesis source was promoted.");
  const clock = createInitialClock();
  if (clock.tick !== 0) throw Error("L3b initial civilization clock must be at tick zero.");
  const economy = buildStarfallBaseEconomyPreview(clock);
  if (economy.economyTick !== clock.tick || economy.committed !== false ||
      economy.sourceWorldTemplateId !== FIRST_WORLD_TEMPLATE_ID ||
      !same(economy.localSettlementIds, [...STARFALL_STARTING_SETTLEMENT_IDS]) ||
      !same(economy.externalContextSettlementIds, [...STARFALL_EXTERNAL_TRADE_CONTEXT_IDS]))
    throw Error("L3b civilization-engine economy baseline is incompatible with Starfall.");

  const { candidateOnly: _candidate, canonicalWritable: _authority, economyBootstrap: _preview, ...rest } = genesis.world;
  const world: RetainedChronicleWorld = {
    ...rest,
    status: "CREATED_EMPTY",
    economyState: {
      version: 1, owner: "civilization-engine", source: economy.kind,
      worldInstanceId: rest.worldInstanceId,
      sourceManifestFingerprint: rest.sourceManifestFingerprint,
      economyTick: 0, clock,
      localSettlementIds: economy.localSettlementIds,
      externalTradeContextSettlementIds: economy.externalContextSettlementIds,
      authoredPosture: economy.authoredPosture,
      projection: portableEngineProjection(economy.projection),
      warnings: portableEngineProjection(economy.warnings),
      servicesEnabled: false,
      inventoryItemsMinted: false
    }
  };
  const { state: _prepared, canonicalWritable: _receiptAuthority, ...receiptBase } = genesis.receipt;
  const receipt: RetainedWorldCreationReceipt = {
    ...receiptBase,
    state: "COMMITTED",
    createdAt: world.createdAt,
    completedWorldRevision: 0
  };
  if (!jsonSafe(world) || !jsonSafe(receipt)) {
    const firstNonPortable = (value: unknown, location: string): string | null => {
      if (value === undefined) return location + ":undefined";
      if (typeof value === "function" || typeof value === "symbol" || typeof value === "bigint")
        return location + ":" + typeof value;
      if (typeof value === "number" && !Number.isFinite(value)) return location + ":nonfinite";
      if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number") return null;
      if (!value || typeof value !== "object") return location + ":invalid";
      if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype)
        return location + ":" + (value as object).constructor?.name;
      for (const [k, entry] of Object.entries(value))
        { const invalid = firstNonPortable(entry, location + "." + k); if (invalid) return invalid; }
      return null;
    };
    throw Error("L3b projected World must be JSON-portable: " +
      (firstNonPortable(world, "world") ?? firstNonPortable(receipt, "receipt") ?? "nonportable"));
  }
  assertRetainedWorldGraph(world.accountId, world.accountLifecycleGeneration,
    [world], [receipt], genesis.receipt.expectedAccountRevision);
  return { world, receipt };
}

/**
 * Validates the complete retained per-account World graph, including archives,
 * reset/delete graph preflight, and account-scoped readback. A malformed row
 * is NEVER interpreted as a legitimate empty World library.
 */
export function assertRetainedWorldGraph(accountId: string, lifecycleGeneration: number,
  worlds: unknown[], receipts: unknown[], accountRevision: number): void {
  if (!str(accountId) || !Number.isSafeInteger(lifecycleGeneration) || lifecycleGeneration < 1 ||
      !Number.isSafeInteger(accountRevision) || accountRevision < 1 ||
      !Array.isArray(worlds) || !Array.isArray(receipts) ||
      worlds.length > 1 || receipts.length > 1)
    throw Error("L3b invalid World graph scope, account or multiplicity.");
  if (worlds.length === 0 && receipts.length === 0) return;
  if (worlds.length !== 1 || receipts.length !== 1)
    throw Error("L3b World and creation receipt must be a complete pair.");
  const world = worlds[0], receipt = receipts[0];
  if (!obj(world) || !obj(receipt) || !jsonSafe(world) || !jsonSafe(receipt) ||
      world.version !== 1 || receipt.version !== 1 ||
      world.status !== "CREATED_EMPTY" || receipt.state !== "COMMITTED" ||
      world.accountId !== accountId || receipt.accountId !== accountId ||
      world.accountLifecycleGeneration !== lifecycleGeneration ||
      receipt.accountLifecycleGeneration !== lifecycleGeneration ||
      !str(world.worldInstanceId) || !str(world.creationIntentId) ||
      !String(world.worldInstanceId).startsWith("world.instance.") ||
      !String(world.creationIntentId).startsWith("world.create.") ||
      world.worldInstanceId !== receipt.worldInstanceId ||
      world.creationIntentId !== receipt.creationIntentId ||
      world.sourceTemplateId !== FIRST_WORLD_TEMPLATE_ID ||
      world.sourceTemplateVersion !== 1 || world.worldMapId !== FIRST_WORLD_MAP_ID ||
      world.localAreaTemplateId !== FIRST_WORLD_LOCAL_AREA_TEMPLATE_ID ||
      world.sourceManifestFingerprint !== receipt.sourceManifestFingerprint ||
      !str(world.sourceManifestFingerprint) ||
      !/^sha256:[0-9a-f]{64}$/.test(world.sourceManifestFingerprint as string) ||
      !str(world.displayName) || world.displayName !== receipt.initialDisplayName ||
      !validDate(world.createdAt) || world.createdAt !== receipt.createdAt ||
      !Number.isSafeInteger(receipt.expectedAccountRevision) ||
      (receipt.expectedAccountRevision as number) < 1 ||
      (receipt.expectedAccountRevision as number) > accountRevision ||
      receipt.completedWorldRevision !== 0 || world.worldRevision !== 0 ||
      !emptyLists(world) || world.candidateOnly !== undefined ||
      world.canonicalWritable !== undefined || world.economyBootstrap !== undefined)
    throw Error("L3b retained World/receipt identity is invalid.");
  const rules = world.rules, clock = world.clock, econ = world.economyState;
  if (!obj(rules) || rules.progressionMode !== "chronicle" || rules.worldKind !== "individual" ||
      rules.hardcore !== false || rules.pausePolicy !== "allow" ||
      rules.difficultyPreset !== null || rules.worldRules !== null || rules.stakesRules !== null ||
      !obj(rules.timePolicy) || rules.timePolicy.speedMultiplier !== 1 ||
      rules.timePolicy.allowsPlayerTimeSkip !== false ||
      rules.timePolicy.worldTimeEpoch !== null || rules.timePolicy.policyVersion !== null ||
      !obj(clock) || clock.elapsedWorldSeconds !== 0 ||
      clock.paused !== false || clock.lastAuthoritativeUpdateAt !== null ||
      !obj(econ) || econ.version !== 1 || econ.owner !== "civilization-engine" ||
      econ.source !== "starfall_base_economy_read_only_preview_v1" ||
      econ.worldInstanceId !== world.worldInstanceId ||
      econ.sourceManifestFingerprint !== world.sourceManifestFingerprint ||
      econ.economyTick !== 0 || !obj(econ.clock) || econ.clock.tick !== 0 ||
      !same(econ.clock, createInitialClock()) ||
      !same(econ.localSettlementIds, [...STARFALL_STARTING_SETTLEMENT_IDS]) ||
      !same(econ.externalTradeContextSettlementIds, [...STARFALL_EXTERNAL_TRADE_CONTEXT_IDS]) ||
      !Array.isArray(econ.authoredPosture) || econ.authoredPosture.length !== 25 ||
      !obj(econ.projection) || !Array.isArray(econ.warnings) ||
      econ.servicesEnabled !== false || econ.inventoryItemsMinted !== false)
    throw Error("L3b World simulation clock/rules/economy graph is invalid.");
}

/** For exact duplicate intent, the retained World and receipt are authoritative. */
export function assertSameWorldCreation(request: PreparedDurableWorld,
  retainedWorld: RetainedChronicleWorld,
  retainedReceipt: RetainedWorldCreationReceipt): void {
  const { world, receipt } = request;
  if (retainedReceipt.creationIntentId !== receipt.creationIntentId ||
      retainedWorld.worldInstanceId !== world.worldInstanceId ||
      retainedWorld.creationIntentId !== world.creationIntentId ||
      retainedWorld.accountId !== world.accountId ||
      retainedWorld.accountLifecycleGeneration !== world.accountLifecycleGeneration ||
      retainedWorld.sourceManifestFingerprint !== world.sourceManifestFingerprint ||
      retainedWorld.sourceTemplateId !== world.sourceTemplateId ||
      retainedWorld.sourceTemplateVersion !== world.sourceTemplateVersion ||
      retainedWorld.displayName !== world.displayName ||
      retainedWorld.createdAt !== world.createdAt ||
      retainedReceipt.expectedAccountRevision !== receipt.expectedAccountRevision ||
      retainedReceipt.createdAt !== receipt.createdAt ||
      retainedReceipt.initialDisplayName !== receipt.initialDisplayName)
    throw Error("L3b creation retry differs from the committed source.");
}
