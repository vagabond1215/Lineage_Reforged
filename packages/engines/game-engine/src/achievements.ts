import achievementCatalogData from "../../../content/base/player/achievements.json" with { type: "json" };
import type {
  AccountAchievementUnlockState,
  AccountProfileState,
  AccountRunArchiveReason,
  AccountRunHistoryRecord,
  AchievementCategory,
  AchievementDefinitionState,
  AchievementLayer,
  AchievementMetricId,
  AchievementRarity,
  CharacterAchievementUnlockState,
  CharacterAchievementsState,
  ChronicleCategory,
  SaveSnapshot,
  SaveSlotId
} from "../../../shared/types/src/index.js";
import {
  ACHIEVEMENT_METRIC_IDS,
  createAchievementMetricRecord,
  createDefaultAccountAchievementsState,
  createDefaultAccountHistoryState,
  createDefaultCharacterAchievementsState
} from "./account-achievement-state.js";
import { createDefaultAccountEstateState } from "./account-estate.js";
import { grantLegacyReward } from "./legacy-account.js";

type AchievementCatalogRecord = {
  records: AchievementDefinitionState[];
};

export type ResolvedAchievementDefinition = AchievementDefinitionState & {
  hiddenByDefault: boolean;
  rarity: AchievementRarity;
  tags: string[];
};

export type AchievementUpdateResult = {
  nextSnapshot: SaveSnapshot;
  nextAccountProfile: AccountProfileState;
  changed: boolean;
};

const ACHIEVEMENT_LAYERS: AchievementLayer[] = ["account", "character"];
const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  "combat",
  "travel",
  "discovery",
  "crafting",
  "trade",
  "social",
  "reputation",
  "beginnings"
];
const ACHIEVEMENT_RARITIES: AchievementRarity[] = ["common", "notable", "legendary"];

const HISTORY_METRIC_IDS: AchievementMetricId[] = [
  "account.runs.started",
  "account.starts.lineages",
  "account.starts.continents",
  "account.starts.regions",
  "account.starts.settlements"
];

const CHARACTER_TO_ACCOUNT_METRIC_PAIRS: Array<{
  characterMetricId: AchievementMetricId;
  accountMetricId: AchievementMetricId;
}> = [
  {
    characterMetricId: "character.combat.entries",
    accountMetricId: "account.combat.entries_total"
  },
  {
    characterMetricId: "character.travel.entries",
    accountMetricId: "account.travel.entries_total"
  },
  {
    characterMetricId: "character.discovery.entries",
    accountMetricId: "account.discovery.entries_total"
  },
  {
    characterMetricId: "character.crafting.entries",
    accountMetricId: "account.crafting.entries_total"
  },
  {
    characterMetricId: "character.trade.entries",
    accountMetricId: "account.trade.entries_total"
  },
  {
    characterMetricId: "character.quests.completed",
    accountMetricId: "account.quests.completed_total"
  },
  {
    characterMetricId: "character.reputation.historical_total",
    accountMetricId: "account.reputation.historical_total"
  }
];

let cachedAchievementDefinitions: ResolvedAchievementDefinition[] | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAchievementCategory(value: unknown): value is AchievementCategory {
  return typeof value === "string" && ACHIEVEMENT_CATEGORIES.includes(value as AchievementCategory);
}

function isAchievementLayer(value: unknown): value is AchievementLayer {
  return typeof value === "string" && ACHIEVEMENT_LAYERS.includes(value as AchievementLayer);
}

function isAchievementMetricId(value: unknown): value is AchievementMetricId {
  return typeof value === "string" && ACHIEVEMENT_METRIC_IDS.includes(value as AchievementMetricId);
}

function isAchievementRarity(value: unknown): value is AchievementRarity {
  return typeof value === "string" && ACHIEVEMENT_RARITIES.includes(value as AchievementRarity);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function normalizeDefinition(
  record: AchievementDefinitionState
): ResolvedAchievementDefinition {
  return {
    ...record,
    hiddenByDefault:
      typeof record.hiddenByDefault === "boolean"
        ? record.hiddenByDefault
        : record.layer === "character",
    rarity: record.rarity ?? "common",
    tags: record.tags ?? []
  };
}

export function validateAchievementDefinitions(
  scopeLabel: string,
  records: AchievementDefinitionState[]
): ResolvedAchievementDefinition[] {
  const seenIds = new Set<string>();

  return records.map((record, index) => {
    const recordLabel = `${scopeLabel}[${index}]`;

    if (!isRecord(record)) {
      throw new Error(`${recordLabel} must be an object`);
    }

    if (typeof record.id !== "string" || record.id.trim().length === 0) {
      throw new Error(`${recordLabel}.id must be a non-empty string`);
    }

    if (seenIds.has(record.id)) {
      throw new Error(`${recordLabel}.id '${record.id}' is duplicated`);
    }
    seenIds.add(record.id);

    if (!isAchievementLayer(record.layer)) {
      throw new Error(`${recordLabel}.layer must be 'account' or 'character'`);
    }

    if (!isAchievementCategory(record.category)) {
      throw new Error(`${recordLabel}.category must be a supported achievement category`);
    }

    if (typeof record.title !== "string" || record.title.trim().length === 0) {
      throw new Error(`${recordLabel}.title must be a non-empty string`);
    }

    if (typeof record.description !== "string" || record.description.trim().length === 0) {
      throw new Error(`${recordLabel}.description must be a non-empty string`);
    }

    if (!isAchievementMetricId(record.metricId)) {
      throw new Error(`${recordLabel}.metricId must be a supported achievement metric id`);
    }

    if (!isPositiveInteger(record.targetValue)) {
      throw new Error(`${recordLabel}.targetValue must be a positive integer`);
    }

    if (record.hiddenByDefault !== undefined && typeof record.hiddenByDefault !== "boolean") {
      throw new Error(`${recordLabel}.hiddenByDefault must be a boolean when provided`);
    }

    if (record.rarity !== undefined && !isAchievementRarity(record.rarity)) {
      throw new Error(`${recordLabel}.rarity must be 'common', 'notable', or 'legendary'`);
    }

    if (record.tags !== undefined) {
      if (!Array.isArray(record.tags) || !record.tags.every((tag) => typeof tag === "string")) {
        throw new Error(`${recordLabel}.tags must be an array of strings when provided`);
      }
    }

    if (record.reward !== undefined) {
      if (!isRecord(record.reward)) {
        throw new Error(`${recordLabel}.reward must be an object when provided`);
      }

      if (record.layer === "character") {
        throw new Error(`${recordLabel}.reward is only allowed for account achievements`);
      }

      const hasLegacyPoints = record.reward.legacyPoints !== undefined;
      const hasUnlockId = record.reward.unlockId !== undefined;

      if (!hasLegacyPoints && !hasUnlockId) {
        throw new Error(`${recordLabel}.reward must define legacyPoints, unlockId, or both`);
      }

      if (hasLegacyPoints && !isPositiveInteger(record.reward.legacyPoints)) {
        throw new Error(`${recordLabel}.reward.legacyPoints must be a positive integer`);
      }

      if (
        hasUnlockId &&
        (typeof record.reward.unlockId !== "string" || record.reward.unlockId.trim().length === 0)
      ) {
        throw new Error(`${recordLabel}.reward.unlockId must be a non-empty string`);
      }
    }

    return normalizeDefinition(record);
  });
}

export function getAchievementDefinitions(): ResolvedAchievementDefinition[] {
  if (!cachedAchievementDefinitions) {
    const parsed = achievementCatalogData as AchievementCatalogRecord;
    cachedAchievementDefinitions = validateAchievementDefinitions(
      "achievements.records",
      parsed.records
    );
  }

  return cachedAchievementDefinitions;
}

export function getAchievementDefinitionById(
  achievementId: string
): ResolvedAchievementDefinition | null {
  return getAchievementDefinitions().find((record) => record.id === achievementId) ?? null;
}

function cloneCharacterAchievementsState(
  state: CharacterAchievementsState | undefined
): CharacterAchievementsState {
  const source = state ?? createDefaultCharacterAchievementsState();
  return {
    unlocked: source.unlocked.map((entry) => ({ ...entry }))
  };
}

function cloneAccountProfileState(profile: AccountProfileState): AccountProfileState {
  const accountAchievements = profile.achievements ?? createDefaultAccountAchievementsState();
  const accountHistory = profile.history ?? createDefaultAccountHistoryState();
  const accountEstate = profile.estate ?? createDefaultAccountEstateState();

  return {
    ...profile,
    achievements: {
      unlocked: accountAchievements.unlocked.map((entry) => ({ ...entry })),
      revealedCharacterAchievementIds: [...accountAchievements.revealedCharacterAchievementIds],
      cumulativeMetrics: {
        ...createAchievementMetricRecord(),
        ...accountAchievements.cumulativeMetrics
      },
      characterMetricHighWaterMarks: Object.fromEntries(
        Object.entries(accountAchievements.characterMetricHighWaterMarks ?? {}).map(
          ([characterId, values]) => [characterId, { ...values }]
        )
      )
    },
    history: {
      runRecords: accountHistory.runRecords.map((record) => ({
        ...record,
        notableCharacterAchievementIds: [...record.notableCharacterAchievementIds],
        saveSlotIds: [...record.saveSlotIds]
      }))
    },
    estate: {
      deposits: accountEstate.deposits.map((deposit) => ({ ...deposit })),
      assets: accountEstate.assets.map((asset) => ({
        ...asset,
        ...(asset.location ? { location: { ...asset.location } } : {})
      }))
    }
  };
}

function countChronicleEntries(snapshot: SaveSnapshot, category: ChronicleCategory): number {
  return snapshot.sessionState.chronicle.filter((entry) => entry.category === category).length;
}

function sumHistoricalFame(snapshot: SaveSnapshot): number {
  return snapshot.playerState.reputation.fame.reduce(
    (sum, entry) => sum + Math.max(0, Math.trunc(entry.historical)),
    0
  );
}

function deriveSnapshotMetrics(snapshot: SaveSnapshot): Record<AchievementMetricId, number> {
  const metrics = createAchievementMetricRecord();
  metrics["character.combat.entries"] = countChronicleEntries(snapshot, "combat");
  metrics["character.travel.entries"] = countChronicleEntries(snapshot, "travel");
  metrics["character.discovery.entries"] = snapshot.playerState.discoveryChronicle.entries.length;
  metrics["character.crafting.entries"] = countChronicleEntries(snapshot, "crafting");
  metrics["character.trade.entries"] = countChronicleEntries(snapshot, "trade");
  metrics["character.quests.completed"] = snapshot.playerState.completedQuestIds.length;
  metrics["character.reputation.historical_total"] = sumHistoricalFame(snapshot);

  for (const mapping of CHARACTER_TO_ACCOUNT_METRIC_PAIRS) {
    metrics[mapping.accountMetricId] = metrics[mapping.characterMetricId];
  }

  return metrics;
}

function resolveStartingSettlementId(snapshot: SaveSnapshot): string {
  const flag = snapshot.playerState.flags.find(
    (entry) =>
      entry.startsWith("player.start.") &&
      !entry.startsWith("player.start_authority.") &&
      !entry.startsWith("player.start_mode.")
  );

  if (flag) {
    return flag.slice("player.start.".length);
  }

  return snapshot.playerState.location.settlementId ?? "unknown.start.settlement";
}

function resolveStartingContinentId(snapshot: SaveSnapshot): string {
  const continentEntry = snapshot.playerState.geographicKnowledge.find(
    (entry) => entry.scope === "continent" && entry.level > 0
  );

  return continentEntry?.geographyId ?? "unknown.start.continent";
}

function findRunRecordIndex(profile: AccountProfileState, characterId: string): number {
  return profile.history.runRecords.findIndex((record) => record.characterId === characterId);
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.trim().length > 0))];
}

function selectNotableCharacterAchievementIds(
  unlocked: CharacterAchievementUnlockState[]
): string[] {
  return dedupeStrings(
    unlocked
      .map((entry) => getAchievementDefinitionById(entry.achievementId))
      .filter(
        (definition): definition is ResolvedAchievementDefinition =>
          definition !== null && definition.rarity !== "common"
      )
      .map((definition) => definition.id)
  );
}

function createLegacyPayoutBaseline(
  existingRecord: AccountRunHistoryRecord | null,
  snapshot: SaveSnapshot
): AccountRunHistoryRecord["legacyPayoutBaseline"] {
  if (existingRecord?.legacyPayoutBaseline) {
    return {
      echoLevel: Math.max(0, Math.trunc(existingRecord.legacyPayoutBaseline.echoLevel))
    };
  }

  if (existingRecord) {
    return undefined;
  }

  return {
    echoLevel: Math.max(0, Math.trunc(snapshot.playerState.progression.level))
  };
}

function createOrUpdateRunRecord(
  existingRecord: AccountRunHistoryRecord | null,
  snapshot: SaveSnapshot,
  recordedAt: string,
  slotId?: SaveSlotId,
  touchHistory = true
): AccountRunHistoryRecord {
  const startingSettlementId =
    existingRecord?.startingSettlementId ?? resolveStartingSettlementId(snapshot);
  const startingContinentId =
    existingRecord?.startingContinentId ?? resolveStartingContinentId(snapshot);
  const saveSlotIds = dedupeStrings([
    ...(existingRecord?.saveSlotIds ?? []),
    ...(slotId ? [slotId] : [])
  ]);
  const legacyPayoutBaseline = createLegacyPayoutBaseline(existingRecord, snapshot);
  const sourceRunId =
    existingRecord?.sourceRunId?.trim() ||
    (snapshot.playerState.saveMeta.sourceRunId?.trim()
      ? snapshot.playerState.saveMeta.sourceRunId.trim()
      : undefined);
  const crossLineageStart =
    existingRecord?.crossLineageStart ?? snapshot.playerState.saveMeta.crossLineageStart;

  return {
    characterId: snapshot.playerState.playerId,
    name: snapshot.playerState.coreData.playerName,
    lineageId: snapshot.playerState.coreData.lineageId,
    startingContinentId,
    startingRegionId: existingRecord?.startingRegionId ?? snapshot.playerState.regionId,
    startingSettlementId,
    startedAt: existingRecord?.startedAt ?? recordedAt,
    ...(existingRecord?.endedAt ? { endedAt: existingRecord.endedAt } : {}),
    lastSeenAt: touchHistory ? recordedAt : existingRecord?.lastSeenAt ?? recordedAt,
    outcome: "active",
    echoLevelReached: Math.max(
      existingRecord?.echoLevelReached ?? 0,
      snapshot.playerState.progression.level
    ),
    notableCharacterAchievementIds: selectNotableCharacterAchievementIds(
      snapshot.playerState.achievements.unlocked
    ),
    ...(legacyPayoutBaseline ? { legacyPayoutBaseline } : {}),
    ...(existingRecord?.legacyGranted !== undefined
      ? { legacyGranted: existingRecord.legacyGranted }
      : {}),
    ...(sourceRunId ? { sourceRunId } : {}),
    ...(crossLineageStart !== undefined ? { crossLineageStart } : {}),
    saveSlotIds
  };
}

function deriveAccountHistoryMetricValues(
  profile: AccountProfileState
): Partial<Record<AchievementMetricId, number>> {
  const runRecords = profile.history.runRecords.filter(
    (record) => record.outcome !== "deleted"
  );
  const lineageIds = new Set<string>();
  const continentIds = new Set<string>();
  const regionIds = new Set<string>();
  const settlementIds = new Set<string>();

  for (const record of runRecords) {
    lineageIds.add(record.lineageId);
    continentIds.add(record.startingContinentId);
    regionIds.add(record.startingRegionId);
    settlementIds.add(record.startingSettlementId);
  }

  return {
    "account.runs.started": runRecords.length,
    "account.starts.lineages": lineageIds.size,
    "account.starts.continents": continentIds.size,
    "account.starts.regions": regionIds.size,
    "account.starts.settlements": settlementIds.size
  };
}

function applyHistoryMetrics(profile: AccountProfileState): boolean {
  const nextMetrics = {
    ...profile.achievements.cumulativeMetrics,
    ...deriveAccountHistoryMetricValues(profile)
  };

  const changed = HISTORY_METRIC_IDS.some(
    (metricId) => profile.achievements.cumulativeMetrics[metricId] !== nextMetrics[metricId]
  );

  if (changed) {
    profile.achievements.cumulativeMetrics = nextMetrics;
  }

  return changed;
}

function applyHighWaterMetrics(
  profile: AccountProfileState,
  snapshotMetrics: Record<AchievementMetricId, number>,
  characterId: string
): boolean {
  const currentHighWater =
    profile.achievements.characterMetricHighWaterMarks[characterId] ?? {};
  const nextHighWater = { ...currentHighWater };
  let changed = false;

  for (const mapping of CHARACTER_TO_ACCOUNT_METRIC_PAIRS) {
    const observed = snapshotMetrics[mapping.accountMetricId];
    const prior = currentHighWater[mapping.accountMetricId] ?? 0;

    if (observed <= prior) {
      continue;
    }

    const delta = observed - prior;
    profile.achievements.cumulativeMetrics[mapping.accountMetricId] += delta;
    nextHighWater[mapping.accountMetricId] = observed;
    changed = true;
  }

  if (changed) {
    profile.achievements.characterMetricHighWaterMarks[characterId] = nextHighWater;
  }

  return changed;
}

export function upsertActiveRunRecord(
  profile: AccountProfileState,
  snapshot: SaveSnapshot,
  slotId?: SaveSlotId,
  recordedAt = new Date().toISOString()
): AccountProfileState {
  const nextProfile = cloneAccountProfileState(profile);
  const index = findRunRecordIndex(nextProfile, snapshot.playerState.playerId);
  const existing = index >= 0 ? nextProfile.history.runRecords[index] ?? null : null;
  const nextRecord = createOrUpdateRunRecord(existing, snapshot, recordedAt, slotId, true);

  if (index >= 0) {
    nextProfile.history.runRecords[index] = nextRecord;
  } else {
    nextProfile.history.runRecords.push(nextRecord);
  }

  nextProfile.updatedAt = recordedAt;
  return nextProfile;
}

export function refreshRunHistoryFromSnapshot(
  profile: AccountProfileState,
  snapshot: SaveSnapshot,
  slotId?: SaveSlotId,
  recordedAt = new Date().toISOString()
): AccountProfileState {
  return upsertActiveRunRecord(profile, snapshot, slotId, recordedAt);
}

export function archiveRunRecord(
  profile: AccountProfileState,
  params: {
    characterId: string;
    archiveReason: AccountRunArchiveReason;
    endedAt?: string;
    legacyGranted?: number;
  }
): AccountProfileState {
  const nextProfile = cloneAccountProfileState(profile);
  const index = findRunRecordIndex(nextProfile, params.characterId);

  if (index < 0) {
    return nextProfile;
  }

  const recordedAt = params.endedAt ?? new Date().toISOString();
  const current = nextProfile.history.runRecords[index];
  if (!current) {
    return nextProfile;
  }

  nextProfile.history.runRecords[index] = {
    ...current,
    endedAt: recordedAt,
    lastSeenAt: recordedAt,
    outcome: "archived",
    archiveReason: params.archiveReason,
    ...(params.legacyGranted !== undefined ? { legacyGranted: params.legacyGranted } : {}),
    saveSlotIds: []
  };
  nextProfile.updatedAt = recordedAt;
  return nextProfile;
}

export function markRunDeleted(
  profile: AccountProfileState,
  params: {
    characterId: string;
    slotId?: SaveSlotId;
    recordedAt?: string;
  }
): AccountProfileState {
  const nextProfile = cloneAccountProfileState(profile);
  const index = findRunRecordIndex(nextProfile, params.characterId);

  if (index < 0) {
    return nextProfile;
  }

  const recordedAt = params.recordedAt ?? new Date().toISOString();
  const current = nextProfile.history.runRecords[index];
  if (!current) {
    return nextProfile;
  }

  if (current.outcome !== "active") {
    return nextProfile;
  }

  const remainingSlotIds = params.slotId
    ? current.saveSlotIds.filter((slot) => slot !== params.slotId)
    : [];
  const nextOutcome = remainingSlotIds.length === 0 ? "deleted" : "active";

  nextProfile.history.runRecords[index] = {
    ...current,
    lastSeenAt: recordedAt,
    ...(nextOutcome === "deleted" ? { endedAt: recordedAt } : {}),
    outcome: nextOutcome,
    saveSlotIds: remainingSlotIds
  };
  applyHistoryMetrics(nextProfile);
  nextProfile.updatedAt = recordedAt;
  return nextProfile;
}

function applyCharacterAchievementUnlocks(
  snapshot: SaveSnapshot,
  profile: AccountProfileState,
  definitions: ResolvedAchievementDefinition[],
  snapshotMetrics: Record<AchievementMetricId, number>,
  recordedAt: string
): boolean {
  const unlockedIds = new Set(snapshot.playerState.achievements.unlocked.map((entry) => entry.achievementId));
  let changed = false;

  for (const definition of definitions) {
    if (definition.layer !== "character") {
      continue;
    }

    if (snapshotMetrics[definition.metricId] < definition.targetValue || unlockedIds.has(definition.id)) {
      continue;
    }

    snapshot.playerState.achievements.unlocked.push({
      achievementId: definition.id,
      unlockedAt: recordedAt
    });
    unlockedIds.add(definition.id);
    changed = true;

    if (!profile.achievements.revealedCharacterAchievementIds.includes(definition.id)) {
      profile.achievements.revealedCharacterAchievementIds = [
        ...profile.achievements.revealedCharacterAchievementIds,
        definition.id
      ];
    }
  }

  return changed;
}

function applyAccountAchievementUnlocks(
  profile: AccountProfileState,
  snapshot: SaveSnapshot,
  definitions: ResolvedAchievementDefinition[],
  recordedAt: string,
  suppressLegacyRewards = false
): boolean {
  const unlockedIds = new Set(profile.achievements.unlocked.map((entry) => entry.achievementId));
  let changed = false;

  for (const definition of definitions) {
    if (definition.layer !== "account") {
      continue;
    }

    if (
      profile.achievements.cumulativeMetrics[definition.metricId] < definition.targetValue ||
      unlockedIds.has(definition.id)
    ) {
      continue;
    }

    let rewardTransactionId: string | undefined;

    if (definition.reward && !suppressLegacyRewards) {
      const reward = grantLegacyReward(profile, {
        ...(definition.reward.legacyPoints !== undefined
          ? { legacyPoints: definition.reward.legacyPoints }
          : {}),
        ...(definition.reward.unlockId ? { unlockId: definition.reward.unlockId } : {}),
        summary: `${definition.title} was recorded in the chronicles.`,
        sourceType: "achievement",
        sourceId: definition.id,
        recordedAt
      });

      if (reward.ok) {
        profile.legacy = reward.profile.legacy;
        profile.updatedAt = reward.profile.updatedAt;
        rewardTransactionId = reward.transaction.id;
      }
    }

    const unlockState: AccountAchievementUnlockState = {
      achievementId: definition.id,
      unlockedAt: recordedAt,
      sourceCharacterId: snapshot.playerState.playerId,
      ...(rewardTransactionId ? { rewardTransactionId } : {})
    };
    profile.achievements.unlocked = [...profile.achievements.unlocked, unlockState];
    unlockedIds.add(definition.id);
    changed = true;
  }

  return changed;
}

export function evaluateAchievementProgress(
  snapshot: SaveSnapshot,
  accountProfile: AccountProfileState,
  options: {
    recordedAt?: string;
    slotId?: SaveSlotId;
    touchHistory?: boolean;
    suppressLegacyRewards?: boolean;
  } = {}
): AchievementUpdateResult {
  const recordedAt = options.recordedAt ?? new Date().toISOString();
  const definitions = getAchievementDefinitions();
  const nextSnapshot: SaveSnapshot = {
    ...snapshot,
    playerState: {
      ...snapshot.playerState,
      achievements: cloneCharacterAchievementsState(snapshot.playerState.achievements)
    }
  };
  const nextAccountProfile = cloneAccountProfileState(accountProfile);
  let changed = false;

  const snapshotMetrics = deriveSnapshotMetrics(nextSnapshot);
  if (
    applyCharacterAchievementUnlocks(
      nextSnapshot,
      nextAccountProfile,
      definitions,
      snapshotMetrics,
      recordedAt
    )
  ) {
    changed = true;
  }

  const latestRecordIndex = findRunRecordIndex(nextAccountProfile, nextSnapshot.playerState.playerId);
  const currentRecord =
    latestRecordIndex >= 0
      ? nextAccountProfile.history.runRecords[latestRecordIndex] ?? null
      : null;
  const updatedRecord = createOrUpdateRunRecord(
    currentRecord,
    nextSnapshot,
    recordedAt,
    options.slotId,
    options.touchHistory ?? false
  );

  if (currentRecord === null) {
    nextAccountProfile.history.runRecords.push(updatedRecord);
    changed = true;
  } else if (JSON.stringify(updatedRecord) !== JSON.stringify(currentRecord)) {
    nextAccountProfile.history.runRecords[latestRecordIndex] = updatedRecord;
    changed = true;
  }

  if (applyHistoryMetrics(nextAccountProfile)) {
    changed = true;
  }

  if (
    applyHighWaterMetrics(
      nextAccountProfile,
      snapshotMetrics,
      nextSnapshot.playerState.playerId
    )
  ) {
    changed = true;
  }

  if (
    applyAccountAchievementUnlocks(
      nextAccountProfile,
      nextSnapshot,
      definitions,
      recordedAt,
      options.suppressLegacyRewards ?? false
    )
  ) {
    changed = true;
  }

  if (changed) {
    nextAccountProfile.updatedAt = recordedAt;
  }

  return {
    nextSnapshot,
    nextAccountProfile,
    changed
  };
}
