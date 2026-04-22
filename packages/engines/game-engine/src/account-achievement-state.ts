import type {
  AccountAchievementsState,
  AccountHistoryState,
  AchievementMetricId,
  CharacterAchievementsState
} from "../../../shared/types/src/index.js";

export const ACHIEVEMENT_METRIC_IDS: AchievementMetricId[] = [
  "character.combat.entries",
  "character.travel.entries",
  "character.discovery.entries",
  "character.crafting.entries",
  "character.trade.entries",
  "character.quests.completed",
  "character.reputation.historical_total",
  "account.combat.entries_total",
  "account.travel.entries_total",
  "account.discovery.entries_total",
  "account.crafting.entries_total",
  "account.trade.entries_total",
  "account.quests.completed_total",
  "account.reputation.historical_total",
  "account.runs.started",
  "account.starts.lineages",
  "account.starts.continents",
  "account.starts.regions",
  "account.starts.settlements"
];

export function createAchievementMetricRecord(): Record<AchievementMetricId, number> {
  return ACHIEVEMENT_METRIC_IDS.reduce<Record<AchievementMetricId, number>>((record, metricId) => {
    record[metricId] = 0;
    return record;
  }, {} as Record<AchievementMetricId, number>);
}

export function createDefaultCharacterAchievementsState(): CharacterAchievementsState {
  return {
    unlocked: []
  };
}

export function createDefaultAccountAchievementsState(): AccountAchievementsState {
  return {
    unlocked: [],
    revealedCharacterAchievementIds: [],
    cumulativeMetrics: createAchievementMetricRecord(),
    characterMetricHighWaterMarks: {}
  };
}

export function createDefaultAccountHistoryState(): AccountHistoryState {
  return {
    runRecords: []
  };
}
