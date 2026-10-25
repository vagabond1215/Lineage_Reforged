import type { SeasonName, SimulationClock } from "../../types/src/index.js";

export interface ClockConfig {
  ticksPerSubday: number;
  subdaysPerDay: number;
  daysPerMonth: number;
  monthsPerYear: number;
}

const DEFAULT_CONFIG: ClockConfig = {
  ticksPerSubday: 6,
  subdaysPerDay: 4,
  daysPerMonth: 8,
  monthsPerYear: 13
};

// Temporary runtime source of month->season mapping until profile-driven season progression is implemented.
const SEASON_BY_MONTH: Record<number, SeasonName> = {
  1: "Deepfrost",
  2: "Deepfrost",
  3: "Thaw",
  4: "Waking",
  5: "Waking",
  6: "Swelter",
  7: "Swelter",
  8: "Harvest",
  9: "Harvest",
  10: "Withering",
  11: "Withering",
  12: "Deepfrost",
  13: "Thaw"
};

const SEASONS: readonly SeasonName[] = ["Deepfrost", "Thaw", "Waking", "Swelter", "Harvest", "Withering"];
const LEGACY_SEASONS: Record<string, SeasonName> = {
  Winter: "Deepfrost",
  Spring: "Waking",
  Summer: "Swelter"
};

export function normalizeSeasonName(value: unknown): SeasonName | null {
  if (typeof value !== "string") return null;
  if (SEASONS.includes(value as SeasonName)) return value as SeasonName;
  return Object.prototype.hasOwnProperty.call(LEGACY_SEASONS, value) ? LEGACY_SEASONS[value] ?? null : null;
}

export function getFormalSeasonName(value: string): string | null {
  const season = normalizeSeasonName(value);
  return season ? `The ${season}` : null;
}

export function createInitialClock(): SimulationClock {
  return {
    tick: 0,
    subday: 1,
    day: 1,
    month: 1,
    season: SEASON_BY_MONTH[1]!,
    year: 1
  };
}

export function advanceClock(
  current: SimulationClock,
  ticks: number = 1,
  config: ClockConfig = DEFAULT_CONFIG
): SimulationClock {
  let tick = current.tick;
  let subday = current.subday;
  let day = current.day;
  let month = current.month;
  let year = current.year;

  for (let i = 0; i < ticks; i += 1) {
    tick += 1;

    if (tick % config.ticksPerSubday === 0) {
      subday += 1;
    }

    if (subday > config.subdaysPerDay) {
      subday = 1;
      day += 1;
    }

    if (day > config.daysPerMonth) {
      day = 1;
      month += 1;
    }

    if (month > config.monthsPerYear) {
      month = 1;
      year += 1;
    }
  }

  return {
    tick,
    subday,
    day,
    month,
    season: SEASON_BY_MONTH[month]!,
    year
  };
}
