/**
 * L2 pure Chronicle World genesis contract. No browser stores, source authority,
 * Save slots, economy mutations, or UI activation are created by this module.
 * The L3 durable World owner must validate and commit the candidate atomically.
 */
export const FIRST_WORLD_TEMPLATE_ID = "world_template.first_world.starfall_port.chronicle_v1";
export const FIRST_WORLD_MAP_ID = "world_map.first_world";
export const FIRST_WORLD_LOCAL_AREA_TEMPLATE_ID = "area_template.starfall_port.harbor_approach_v1";
export const WORLD_GENESIS_CONTRACT_VERSION = 1;

export type WorldContractFailureCode =
  | "invalid_input" | "stale_account" | "template_mismatch"
  | "conflict" | "incomplete_receipt";
export class WorldContractError extends Error {
  readonly code: WorldContractFailureCode;
  constructor(code: WorldContractFailureCode, message: string) {
    super(message);
    this.name = "WorldContractError";
    this.code = code;
  }
}

export type WorldAccountPreflight = {
  accountId: string;
  revision: number;
  lifecycleGeneration: number;
};

export type ChronicleWorldCreationInput = {
  account: WorldAccountPreflight;
  expectedAccountRevision: number;
  expectedAccountGeneration: number;
  creationIntentId: string;
  proposedWorldInstanceId: string;
  displayName: string;
  createdAt: string;
  /** Exact UTF-8 content read from the immutable, source-pinned template. */
  sourceTemplateJson: string;
};

export type ChronicleWorldGenesisCandidate = {
  version: 1;
  accountId: string;
  accountLifecycleGeneration: number;
  worldInstanceId: string;
  creationIntentId: string;
  createdAt: string;
  displayName: string;
  sourceTemplateId: typeof FIRST_WORLD_TEMPLATE_ID;
  sourceTemplateVersion: 1;
  sourceManifestFingerprint: string;
  worldMapId: typeof FIRST_WORLD_MAP_ID;
  localAreaTemplateId: typeof FIRST_WORLD_LOCAL_AREA_TEMPLATE_ID;
  worldRevision: 0;
  rules: {
    progressionMode: "chronicle";
    worldKind: "individual";
    hardcore: false;
    difficultyPreset: null;
    worldRules: null;
    stakesRules: null;
    pausePolicy: "allow";
    timePolicy: {
      speedMultiplier: 1; worldTimeEpoch: null;
      allowsPlayerTimeSkip: false; policyVersion: null;
    };
  };
  clock: { elapsedWorldSeconds: 0; paused: false; lastAuthoritativeUpdateAt: null };
  characterAssociations: [];
  campaignSaveAssociations: [];
  materializedAreaInstances: [];
  areaMutationRecords: [];
  spawnedEntityRecords: [];
  resourceDepletionRecords: [];
  scheduledActionRecords: [];
  pendingPublicationReceipts: [];
  committedWorldEvents: [];
  inventoryMutationRecords: [];
  economyBootstrap: {
    owner: "existing_civilization_economy_engine_only";
    status: "read_only_preview_until_world_save_owner_is_approved";
    localSettlementIds: string[];
    externalTradeContextSettlementIds: string[];
    focusGoods: string[];
    stockSnapshot: null; productionRates: null; prices: null; lastEconomyTick: null;
    sourceSettlementReferencesNotCloned: true; note: string;
  };
  /** A plan is never the durable World instance. */
  candidateOnly: true;
  canonicalWritable: false;
};

export type ChronicleWorldReceiptCandidate = {
  version: 1;
  accountId: string;
  accountLifecycleGeneration: number;
  creationIntentId: string;
  worldInstanceId: string;
  expectedAccountRevision: number;
  sourceManifestFingerprint: string;
  initialDisplayName: string;
  /** Records intent, not a committed IndexedDB transaction. */
  state: "PREPARED_NOT_COMMITTED";
  canonicalWritable: false;
};

export type ChronicleWorldGenesisPlan = {
  status: "L2_CANDIDATE_ONLY_NOT_PERSISTED";
  world: ChronicleWorldGenesisCandidate;
  receipt: ChronicleWorldReceiptCandidate;
  allowedToWriteExistingEpochV7: false;
};

type Dict = Record<string, unknown>;
function record(value: unknown): value is Dict {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function error(code: WorldContractFailureCode, message: string): never {
  throw new WorldContractError(code, message);
}
function stringId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{3,119}$/.test(value);
}
function integerAtLeast(value: unknown, minimum: number): value is number {
  return Number.isSafeInteger(value) && (value as number) >= minimum;
}
function exactKeys(value: Dict, expected: string[]): boolean {
  return Object.keys(value).sort().join("\u0000") === [...expected].sort().join("\u0000");
}
function emptyList(value: unknown): boolean {
  return Array.isArray(value) && value.length === 0;
}
function nonblank(value: unknown): value is string {
  return typeof value === "string" && !!value.trim();
}

export function inspectChronicleWorldTemplate(parsed: unknown): void {
  if (!record(parsed) || parsed.format !== "lineage-reborn.starfall-world-seed.v1" ||
      parsed.templateId !== FIRST_WORLD_TEMPLATE_ID || parsed.templateVersion !== 1 ||
      parsed.lifecycle !== "authored_draft_unregistered" || parsed.runtimeEligible !== false)
    error("template_mismatch", "Source must be the unregistered, immutable Starfall Chronicle v1 template.");
  const identity = parsed.immutableIdentity;
  if (!record(identity) || identity.worldBlueprintId !== FIRST_WORLD_MAP_ID ||
      identity.progressionMode !== "chronicle" || identity.worldKind !== "individual" ||
      identity.localAreaTemplateId !== FIRST_WORLD_LOCAL_AREA_TEMPLATE_ID ||
      identity.startSettlementId !== "settlement.starfall_port" ||
      identity.startRegionId !== "region.starfall_isle" ||
      identity.startLocalityBandId !== "region_locality.myridian_ports")
    error("template_mismatch", "Starfall template identity or region/local-area source changed.");
  const seed = parsed.proposedInstanceSeed;
  if (!record(seed) || seed.sourceTemplateId !== FIRST_WORLD_TEMPLATE_ID ||
      seed.sourceTemplateVersion !== 1 || seed.worldRevision !== 0)
    error("template_mismatch", "World instance seed version or identity changed.");
  for (const key of ["accountId", "worldInstanceId", "creationIntentId", "createdAt",
                     "displayName", "sourceManifestFingerprint"]) {
    if (seed[key] !== null) error("template_mismatch", "World instance seed already contains mutable identity.");
  }
  for (const key of ["characterAssociations", "campaignSaveAssociations",
                     "materializedAreaInstances", "areaMutationRecords",
                     "spawnedEntityRecords", "resourceDepletionRecords",
                     "scheduledActionRecords", "pendingPublicationReceipts",
                     "committedWorldEvents", "inventoryMutationRecords"]) {
    if (!emptyList(seed[key])) error("template_mismatch", "World must start with no characters or effects.");
  }
  const rules = seed.rules;
  if (!record(rules) || !exactKeys(rules, ["progressionMode", "worldKind", "hardcore",
      "difficultyPreset", "worldRules", "stakesRules", "pausePolicy", "timePolicy"]) ||
      rules.progressionMode !== "chronicle" || rules.worldKind !== "individual" ||
      rules.hardcore !== false || rules.difficultyPreset !== null ||
      rules.worldRules !== null || rules.stakesRules !== null || rules.pausePolicy !== "allow")
    error("template_mismatch", "Chronicle World rules are not locked at their initial posture.");
  const time = rules.timePolicy;
  if (!record(time) || !exactKeys(time, ["speedMultiplier", "worldTimeEpoch",
      "allowsPlayerTimeSkip", "policyVersion"]) ||
      time.speedMultiplier !== 1 || time.worldTimeEpoch !== null ||
      time.allowsPlayerTimeSkip !== false || time.policyVersion !== null)
    error("template_mismatch", "Template would enable unsupported time behavior.");
  const clock = seed.clock;
  if (!record(clock) || !exactKeys(clock, ["elapsedWorldSeconds", "paused",
      "lastAuthoritativeUpdateAt"]) || clock.elapsedWorldSeconds !== 0 ||
      clock.paused !== false || clock.lastAuthoritativeUpdateAt !== null)
    error("template_mismatch", "Initial World clock must be paused-state false at elapsed zero.");
  const economy = seed.economyBootstrap;
  if (!record(economy) ||
      economy.owner !== "existing_civilization_economy_engine_only" ||
      economy.status !== "read_only_preview_until_world_save_owner_is_approved" ||
      economy.stockSnapshot !== null || economy.productionRates !== null ||
      economy.prices !== null || economy.lastEconomyTick !== null ||
      economy.sourceSettlementReferencesNotCloned !== true ||
      !Array.isArray(economy.localSettlementIds) ||
      !Array.isArray(economy.externalTradeContextSettlementIds) ||
      !Array.isArray(economy.focusGoods) ||
      economy.localSettlementIds.join("|") !==
        ["settlement.starfall_port","settlement.harbormast_quay","settlement.foammarket_ferry"].join("|") ||
      economy.externalTradeContextSettlementIds.join("|") !==
        ["settlement.pearlwake","settlement.chainlight_bastion"].join("|") ||
      economy.focusGoods.join("|") !== ["fish","grain","rope","timber","metal"].join("|") ||
      !nonblank(economy.note))
    error("template_mismatch", "World must not invent or own a live economy bootstrap.");
  const area = parsed.localAreaBlueprint;
  if (!record(area) || area.id !== FIRST_WORLD_LOCAL_AREA_TEMPLATE_ID ||
      !emptyList(area.placedNpcInstances) || !emptyList(area.placedResourceInstances) ||
      !emptyList(area.placedMonsterInstances) || !emptyList(area.activeEncounterSpawnZones))
    error("template_mismatch", "Local Starfall source may not pre-create active entities.");
}

function validateCreateInput(input: ChronicleWorldCreationInput): void {
  if (!record(input) || !record(input.account) || !stringId(input.account.accountId) ||
      !integerAtLeast(input.account.revision, 1) ||
      !integerAtLeast(input.account.lifecycleGeneration, 1) ||
      !integerAtLeast(input.expectedAccountRevision, 1) ||
      !integerAtLeast(input.expectedAccountGeneration, 1) ||
      !stringId(input.creationIntentId) || !input.creationIntentId.startsWith("world.create.") ||
      !stringId(input.proposedWorldInstanceId) || !input.proposedWorldInstanceId.startsWith("world.instance.") ||
      !nonblank(input.displayName) ||
      input.displayName !== input.displayName.trim() || input.displayName.length > 80 ||
      /[\u0000-\u001f\u007f]/.test(input.displayName) ||
      !nonblank(input.createdAt) ||
      !Number.isFinite(Date.parse(input.createdAt)) ||
      new Date(input.createdAt).toISOString() !== input.createdAt ||
      typeof input.sourceTemplateJson !== "string")
    error("invalid_input", "Chronicle World creation request has invalid identity or source fields.");
  if (input.account.revision !== input.expectedAccountRevision ||
      input.account.lifecycleGeneration !== input.expectedAccountGeneration)
    error("stale_account", "Account revision or generation changed before World creation.");
}

/** This pure projection can be test-executed without upgrading an existing v7 browser. */
export async function prepareChronicleWorldGenesis(input: ChronicleWorldCreationInput):
  Promise<ChronicleWorldGenesisPlan> {
  validateCreateInput(input);
  let parsed: unknown;
  try { parsed = JSON.parse(input.sourceTemplateJson); }
  catch { error("template_mismatch", "Source template JSON is malformed."); }
  inspectChronicleWorldTemplate(parsed);
  const bytes = new TextEncoder().encode(input.sourceTemplateJson);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  const fingerprint = "sha256:" + Array.from(new Uint8Array(digest), byte =>
    byte.toString(16).padStart(2, "0")).join("");
  const seed = (parsed as Dict).proposedInstanceSeed as Dict;
  const economy = seed.economyBootstrap as Dict;
  const world: ChronicleWorldGenesisCandidate = {
    version: 1,
    accountId: input.account.accountId,
    accountLifecycleGeneration: input.account.lifecycleGeneration,
    worldInstanceId: input.proposedWorldInstanceId,
    creationIntentId: input.creationIntentId,
    createdAt: input.createdAt,
    displayName: input.displayName,
    sourceTemplateId: FIRST_WORLD_TEMPLATE_ID,
    sourceTemplateVersion: 1,
    sourceManifestFingerprint: fingerprint,
    worldMapId: FIRST_WORLD_MAP_ID,
    localAreaTemplateId: FIRST_WORLD_LOCAL_AREA_TEMPLATE_ID,
    worldRevision: 0,
    rules: JSON.parse(JSON.stringify(seed.rules)),
    clock: JSON.parse(JSON.stringify(seed.clock)),
    characterAssociations: [],
    campaignSaveAssociations: [],
    materializedAreaInstances: [],
    areaMutationRecords: [],
    spawnedEntityRecords: [],
    resourceDepletionRecords: [],
    scheduledActionRecords: [],
    pendingPublicationReceipts: [],
    committedWorldEvents: [],
    inventoryMutationRecords: [],
    economyBootstrap: {
      owner: "existing_civilization_economy_engine_only",
      status: "read_only_preview_until_world_save_owner_is_approved",
      localSettlementIds: [...(economy.localSettlementIds as string[])],
      externalTradeContextSettlementIds: [...(economy.externalTradeContextSettlementIds as string[])],
      focusGoods: [...(economy.focusGoods as string[])],
      stockSnapshot: null, productionRates: null, prices: null, lastEconomyTick: null,
      sourceSettlementReferencesNotCloned: true, note: economy.note as string
    },
    candidateOnly: true,
    canonicalWritable: false
  };
  const receipt: ChronicleWorldReceiptCandidate = {
    version: 1, accountId: world.accountId,
    accountLifecycleGeneration: world.accountLifecycleGeneration,
    creationIntentId: world.creationIntentId, worldInstanceId: world.worldInstanceId,
    expectedAccountRevision: input.expectedAccountRevision,
    sourceManifestFingerprint: fingerprint,
    initialDisplayName: world.displayName,
    state: "PREPARED_NOT_COMMITTED", canonicalWritable: false
  };
  return { status: "L2_CANDIDATE_ONLY_NOT_PERSISTED", world, receipt,
    allowedToWriteExistingEpochV7: false };
}

/** Preflight expected L3 retained state. Requires the future caller's one atomic DB read. */
export function inspectRetainedChronicleCreate(
  input: ChronicleWorldGenesisPlan,
  existingWorlds: unknown[],
  retainedReceipt: unknown | null
): "NEW" | "SAME_SOURCE_RETRY" {
  if (!record(input) || input.status !== "L2_CANDIDATE_ONLY_NOT_PERSISTED" ||
      !Array.isArray(existingWorlds) || existingWorlds.length > 1)
    error("invalid_input", "World creation preflight is malformed.");
  if (existingWorlds.length === 0 && retainedReceipt === null) return "NEW";
  if (existingWorlds.length !== 1 || !record(retainedReceipt))
    error("incomplete_receipt", "Partial world/creation receipt cannot be reported as empty.");
  const row = existingWorlds[0];
  const w = input.world, r = input.receipt;
  if (!record(row) || row.accountId !== w.accountId || row.worldInstanceId !== w.worldInstanceId ||
      row.creationIntentId !== w.creationIntentId ||
      row.accountLifecycleGeneration !== w.accountLifecycleGeneration ||
      row.sourceManifestFingerprint !== w.sourceManifestFingerprint ||
      row.sourceTemplateId !== w.sourceTemplateId || row.sourceTemplateVersion !== 1 ||
      row.displayName !== w.displayName ||
      retainedReceipt.accountId !== r.accountId ||
      retainedReceipt.creationIntentId !== r.creationIntentId ||
      retainedReceipt.worldInstanceId !== r.worldInstanceId ||
      retainedReceipt.accountLifecycleGeneration !== r.accountLifecycleGeneration ||
      retainedReceipt.sourceManifestFingerprint !== r.sourceManifestFingerprint ||
      retainedReceipt.initialDisplayName !== r.initialDisplayName)
    error("conflict", "Existing World belongs to another creation intent or source.");
  return "SAME_SOURCE_RETRY";
}
