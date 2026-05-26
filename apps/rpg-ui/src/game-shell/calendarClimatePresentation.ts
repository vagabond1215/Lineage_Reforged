import type { SeasonName, SimulationClock } from "../../../../packages/shared/types/src/index.js";

export type CalendarClimateTone = "neutral" | "info" | "warning" | "unavailable";

export type CalendarClimateRow = {
  id: string;
  label: string;
  valueLabel: string;
  detailLabel: string | null;
  tone: CalendarClimateTone;
};

export type CalendarClimateTemperatureBand = {
  low: number;
  high: number;
  lowOffsetRatio?: number;
  highOffsetRatio?: number;
};

export type CalendarClimateProfileInput = {
  id: string;
  name?: string;
  seasonLengths?: readonly number[];
  temperatureRangeTemplate?: {
    unit?: "celsius" | string;
    lowLimit?: number;
    highLimit?: number;
    range?: number;
  };
  seasonalTemperatureProfiles?: Partial<Record<SeasonName, CalendarClimateTemperatureBand>>;
};

export type CalendarClimateProfileSourceInput = {
  climateProfileId?: string | null;
  climateProfile?: CalendarClimateProfileInput | null;
  sourceLabel?: string | null;
  climateZoneId?: string | null;
  climateZoneName?: string | null;
};

export type CalendarClimateLocationInput = {
  settlementId?: string | null;
  settlementName?: string | null;
  regionId?: string | null;
  regionName?: string | null;
};

export type CalendarClimatePopupInput = {
  clock?: SimulationClock | null;
  location?: CalendarClimateLocationInput | null;
  profileSource?: CalendarClimateProfileSourceInput | null;
  monthLabels?: readonly string[];
};

export type CalendarClimatePopupViewModel = {
  title: string;
  subtitle: string;
  currentTimeRows: CalendarClimateRow[];
  seasonRows: CalendarClimateRow[];
  climateRows: CalendarClimateRow[];
  temperatureRows: CalendarClimateRow[];
  informationalEffectNotes: string[];
  warningNotes: string[];
  actionIds: [];
};

const DEFAULT_MONTH_LABELS = [
  "Deepfrost",
  "Thawrise",
  "Seedcall",
  "Rainmere",
  "Suncrest",
  "Highbloom",
  "Harvestfall",
  "Redleaf",
  "Frostwane",
  "Longnight",
  "Emberwane",
  "Stormwane",
  "Yearsend"
] as const;

const WATCH_LABELS: Record<number, string> = {
  1: "Dawn Watch",
  2: "High Sun",
  3: "Dusk Watch",
  4: "Night Watch"
};

const INFORMATIONAL_EFFECT_NOTES = [
  "Climate and weather are informational only in this popup.",
  "No travel, crop, body-state, combat, or economy effects are applied from this view model.",
  "Runtime season currently follows shared clock mapping, not climate profile season progression."
] as const;

function emptyActionIds(): [] {
  return [];
}

function createRow(
  id: string,
  label: string,
  valueLabel: string,
  detailLabel: string | null = null,
  tone: CalendarClimateTone = "neutral"
): CalendarClimateRow {
  return {
    id,
    label,
    valueLabel,
    detailLabel,
    tone
  };
}

function isUsefulNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatTemperatureNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1
  }).format(value);
}

function formatTemperatureBand(
  band: CalendarClimateTemperatureBand,
  unit: string | null | undefined
): string {
  const low = formatTemperatureNumber(band.low);
  const high = formatTemperatureNumber(band.high);

  if (!unit || unit === "celsius") {
    return `${low}C to ${high}C`;
  }

  return `${low} to ${high} ${unit}`;
}

function humanizeId(value: string | null | undefined, fallback = "Unknown"): string {
  if (!value) {
    return fallback;
  }

  const lastSegment = value.split(".").at(-1) ?? value;
  const words = lastSegment
    .split(/[_-]+/g)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return fallback;
  }

  return words
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function firstNonEmpty(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return null;
}

function getLocationLabel(location: CalendarClimateLocationInput | null | undefined): string | null {
  if (!location) {
    return null;
  }

  return (
    firstNonEmpty(location.settlementName, location.regionName) ??
    (location.settlementId ? humanizeId(location.settlementId) : null) ??
    (location.regionId ? humanizeId(location.regionId) : null)
  );
}

function getProfileId(profileSource: CalendarClimateProfileSourceInput | null | undefined): string | null {
  return profileSource?.climateProfile?.id ?? profileSource?.climateProfileId ?? null;
}

function getProfileLabel(profileSource: CalendarClimateProfileSourceInput | null | undefined): string | null {
  const profile = profileSource?.climateProfile ?? null;

  if (!profile) {
    return null;
  }

  return firstNonEmpty(profile.name) ?? humanizeId(profile.id);
}

function buildSubtitle(input: CalendarClimatePopupInput): string {
  const locationLabel = getLocationLabel(input.location);
  if (locationLabel) {
    return `${locationLabel} - read-only calendar context`;
  }

  const profileLabel = getProfileLabel(input.profileSource);
  if (profileLabel) {
    return `${profileLabel} - read-only climate context`;
  }

  return "Read-only calendar context";
}

function getMonthLabel(clock: SimulationClock, monthLabels: readonly string[] | undefined): string {
  return monthLabels?.[clock.month - 1] ?? DEFAULT_MONTH_LABELS[clock.month - 1] ?? `Month ${clock.month}`;
}

function buildCurrentTimeRows(
  clock: SimulationClock | null | undefined,
  monthLabels: readonly string[] | undefined,
  warningNotes: string[]
): CalendarClimateRow[] {
  if (!clock) {
    warningNotes.push("No runtime clock was supplied.");
    return [
      createRow(
        "current-time-unavailable",
        "Current Time",
        "Unavailable",
        "No runtime clock was supplied.",
        "unavailable"
      )
    ];
  }

  return [
    createRow("year", "Year", `Year ${clock.year}`),
    createRow("month", "Month", getMonthLabel(clock, monthLabels), `Month ${clock.month}`),
    createRow("day", "Day", `Day ${clock.day}`),
    createRow(
      "watch",
      "Watch",
      WATCH_LABELS[clock.subday] ?? "Unknown Watch",
      `Subday ${clock.subday}`,
      WATCH_LABELS[clock.subday] ? "neutral" : "unavailable"
    ),
    createRow("tick", "Tick", `Tick ${clock.tick}`)
  ];
}

function buildSeasonRows(
  clock: SimulationClock | null | undefined,
  profile: CalendarClimateProfileInput | null | undefined,
  warningNotes: string[]
): CalendarClimateRow[] {
  if (!clock) {
    return [
      createRow(
        "runtime-season",
        "Runtime Season",
        "Unavailable",
        "No runtime clock was supplied.",
        "unavailable"
      )
    ];
  }

  const rows = [
    createRow(
      "runtime-season",
      "Runtime Season",
      clock.season,
      "Runtime season comes from shared time month mapping.",
      "info"
    )
  ];

  if (profile?.seasonLengths) {
    rows.push(
      createRow(
        "profile-season-lengths",
        "Profile Season Lengths",
        profile.seasonLengths.join(" / "),
        "Authored climate profile season lengths are reference data only.",
        "info"
      )
    );
    warningNotes.push(
      "Climate profile season lengths are authored reference data; they do not drive the current runtime season yet."
    );
  }

  return rows;
}

function buildClimateRows(
  profileSource: CalendarClimateProfileSourceInput | null | undefined,
  warningNotes: string[]
): CalendarClimateRow[] {
  const profile = profileSource?.climateProfile ?? null;
  const profileId = getProfileId(profileSource);

  if (profile) {
    const sourceLabel = firstNonEmpty(
      profileSource?.sourceLabel,
      profileSource?.climateZoneName,
      profileSource?.climateZoneId
    );
    const detailParts = [profile.id, sourceLabel ? `via ${sourceLabel}` : null].filter(
      (part): part is string => !!part
    );

    if (profileSource?.climateProfileId && profileSource.climateProfileId !== profile.id) {
      warningNotes.push("Supplied climate profile id does not match supplied profile data.");
    }

    return [
      createRow(
        "climate-profile",
        "Climate Profile",
        getProfileLabel(profileSource) ?? humanizeId(profile.id),
        detailParts.length > 0 ? detailParts.join(" ") : null,
        "info"
      )
    ];
  }

  if (profileId) {
    warningNotes.push(`Climate profile data was not supplied for ${profileId}.`);
    return [
      createRow(
        "climate-profile",
        "Climate Profile",
        "Unavailable",
        `Profile id ${profileId} was supplied without profile data.`,
        "unavailable"
      )
    ];
  }

  warningNotes.push("No authoritative climate profile was supplied.");
  return [
    createRow(
      "climate-profile",
      "Climate Profile",
      "Unknown",
      "No authoritative climate profile was supplied.",
      "unavailable"
    )
  ];
}

function buildTemperatureRows(
  clock: SimulationClock | null | undefined,
  profileSource: CalendarClimateProfileSourceInput | null | undefined,
  warningNotes: string[]
): CalendarClimateRow[] {
  const profile = profileSource?.climateProfile ?? null;

  if (!clock) {
    return [
      createRow(
        "expected-seasonal-band",
        "Expected seasonal band",
        "Unavailable",
        "No runtime clock was supplied.",
        "unavailable"
      )
    ];
  }

  if (!profile) {
    return [
      createRow(
        "expected-seasonal-band",
        "Expected seasonal band",
        "Unavailable",
        "No climate profile data was supplied.",
        "unavailable"
      )
    ];
  }

  const band = profile.seasonalTemperatureProfiles?.[clock.season] ?? null;
  if (!band) {
    warningNotes.push(`No expected temperature band is authored for ${clock.season}.`);
    return [
      createRow(
        "expected-seasonal-band",
        "Expected seasonal band",
        "Unavailable",
        `No expected temperature band is authored for ${clock.season}.`,
        "unavailable"
      )
    ];
  }

  if (!isUsefulNumber(band.low) || !isUsefulNumber(band.high)) {
    warningNotes.push(`Expected seasonal temperature band has invalid values for ${clock.season}.`);
    return [
      createRow(
        "expected-seasonal-band",
        "Expected seasonal band",
        "Unavailable",
        `Expected seasonal temperature band has invalid values for ${clock.season}.`,
        "unavailable"
      )
    ];
  }

  return [
    createRow(
      "expected-seasonal-band",
      "Expected seasonal band",
      formatTemperatureBand(band, profile.temperatureRangeTemplate?.unit),
      `${clock.season} band from ${getProfileLabel(profileSource) ?? humanizeId(profile.id)}.`,
      "info"
    )
  ];
}

export function buildCalendarClimatePopupViewModel(
  input: CalendarClimatePopupInput
): CalendarClimatePopupViewModel {
  const warningNotes: string[] = [];
  const clock = input.clock ?? null;
  const profile = input.profileSource?.climateProfile ?? null;

  return {
    title: "Calendar and Climate",
    subtitle: buildSubtitle(input),
    currentTimeRows: buildCurrentTimeRows(clock, input.monthLabels, warningNotes),
    seasonRows: buildSeasonRows(clock, profile, warningNotes),
    climateRows: buildClimateRows(input.profileSource, warningNotes),
    temperatureRows: buildTemperatureRows(clock, input.profileSource, warningNotes),
    informationalEffectNotes: [...INFORMATIONAL_EFFECT_NOTES],
    warningNotes,
    actionIds: emptyActionIds()
  };
}
