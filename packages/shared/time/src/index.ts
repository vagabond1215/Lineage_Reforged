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

const SEASON_BY_MONTH: Record<number, SeasonName> = {
  1: "Winter",
  2: "Winter",
  3: "Thaw",
  4: "Spring",
  5: "Spring",
  6: "Summer",
  7: "Summer",
  8: "Harvest",
  9: "Harvest",
  10: "Withering",
  11: "Withering",
  12: "Winter",
  13: "Thaw"
};

export function createInitialClock(): SimulationClock {
  return {
    tick: 0,
    subday: 1,
    day: 1,
    month: 1,
    season: SEASON_BY_MONTH[1],
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
    season: SEASON_BY_MONTH[month],
    year
  };
}