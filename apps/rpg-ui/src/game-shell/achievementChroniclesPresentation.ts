import type { AccountProfileState } from "../../../../packages/shared/types/src/index.js";
import { getAchievementDefinitions } from "../../../../packages/engines/game-engine/src/achievements.js";

export type ChronicleUnlockViewModel = {
  id: string;
  title: string;
  rarityLabel: string;
  recordedAtLabel: string;
  rewardLabel: string | null;
};

export type ChroniclesSummaryViewModel = {
  unlockedCountLabel: string;
  totalCountLabel: string;
  categoryCoverageLabel: string;
  emptyState: string | null;
  recentUnlocks: ChronicleUnlockViewModel[];
};

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatTimestamp(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.valueOf())) {
    return "Unknown entry";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(parsed);
}

function humanizeId(value: string | null | undefined): string {
  if (!value) {
    return "Unknown";
  }

  const lastSegment = value.split(".").at(-1) ?? value;
  return lastSegment
    .split("_")
    .filter(Boolean)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1))
    .join(" ");
}

function rarityPriority(rarity: string): number {
  switch (rarity) {
    case "legendary":
      return 3;
    case "notable":
      return 2;
    default:
      return 1;
  }
}

function formatRewardLabel(reward: { legacyPoints?: number; unlockId?: string } | undefined): string | null {
  if (!reward) {
    return null;
  }

  const parts = [
    reward.legacyPoints ? `${reward.legacyPoints} Legacy` : null,
    reward.unlockId ? humanizeId(reward.unlockId) : null
  ].filter((value): value is string => Boolean(value));

  return parts.length > 0 ? parts.join(" | ") : null;
}

export function buildChroniclesSummary(
  accountProfile: AccountProfileState,
  limit = 5
): ChroniclesSummaryViewModel {
  const definitions = getAchievementDefinitions().filter((entry) => entry.layer === "account");
  const unlockedById = new Map(
    accountProfile.achievements.unlocked.map((entry) => [entry.achievementId, entry])
  );
  const unlockedDefinitions = definitions.filter((entry) => unlockedById.has(entry.id));
  const unlockedCategories = new Set(unlockedDefinitions.map((entry) => entry.category));
  const allCategories = new Set(definitions.map((entry) => entry.category));

  const recentUnlocks = unlockedDefinitions
    .sort((left, right) => {
      const timeCompare =
        (unlockedById.get(right.id)?.unlockedAt ?? "").localeCompare(
          unlockedById.get(left.id)?.unlockedAt ?? ""
        );
      if (timeCompare !== 0) {
        return timeCompare;
      }

      return rarityPriority(right.rarity) - rarityPriority(left.rarity);
    })
    .slice(0, limit)
    .map((definition) => ({
      id: definition.id,
      title: definition.title,
      rarityLabel: humanizeId(definition.rarity),
      recordedAtLabel: formatTimestamp(unlockedById.get(definition.id)?.unlockedAt ?? ""),
      rewardLabel: formatRewardLabel(definition.reward)
    }));

  return {
    unlockedCountLabel: formatCount(unlockedDefinitions.length),
    totalCountLabel: formatCount(definitions.length),
    categoryCoverageLabel: `${formatCount(unlockedCategories.size)} / ${formatCount(allCategories.size)}`,
    emptyState:
      recentUnlocks.length === 0 ? "No chronicles have been recorded yet." : null,
    recentUnlocks
  };
}
