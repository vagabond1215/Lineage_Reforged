# Calendar / Climate Popup IA Audit

Source route: ChatGPT via GitHub Connector
Date: 2026-05-19
Status: promoted supporting source-detail reference through `Version 0.5.82 - Calendar Climate Read-Only Popup`

## Current Status

This audit has been promoted into `docs/design/calendar-climate-popup-view-model-plan.md`.

The active planning source is now:

- `docs/design/calendar-climate-popup-view-model-plan.md`

The current next implementation target is:

- `Version 0.5.82 - Calendar Climate Read-Only Popup`

Use this audit only as supporting source-detail reference. Do not treat older version labels or prompt targets in this file as current pipeline authority.

## Purpose

This audit defines a safe read-only information architecture for a future calendar/climate popup.

The goal is to make time, season, and climate understandable without changing clock behavior, climate profiles, travel effects, body-state effects, weather simulation, or UI runtime behavior.

This document does not:

- change clock logic
- change season mapping
- edit climate profiles
- edit calendar content
- add weather simulation
- add climate effects
- add travel penalties
- add body-state penalties
- edit React UI
- update generated UI output
- update `docs/dev/current-codex-output.md`

## Sources Inspected

- `docs/dev/project-roadmap.md`
- `docs/design/future-system-design-ledger.md`
- `docs/data-dictionary/climate.md`
- `packages/shared/time/src/index.ts`
- `packages/content/base/world/climate_profiles.json`
- search results for climate/calendar/world-selection surfaces

## Current Calendar / Climate Reality

Current clock behavior:

- `createInitialClock()` starts at tick 0, subday 1, day 1, month 1, season `Winter`, year 1.
- `advanceClock(...)` advances ticks, subdays, days, months, and years.
- Default config uses 6 ticks per subday, 4 subdays per day, 8 days per month, and 13 months per year.
- Month-to-season mapping currently lives in `packages/shared/time/src/index.ts` as a temporary runtime source.

Current climate data:

- `docs/data-dictionary/climate.md` documents calendar alignment, profile identity, season lengths, temperature variance, temperature range templates, and seasonal temperature profiles.
- `climate_profiles.json` contains climate profile ids/names, season lengths, temperature variance, temperature range templates, and seasonal temperature profile lows/highs by season.

Important limitation:

- The runtime clock uses a temporary hardcoded month-to-season map.
- Climate profile seasonal lengths are authored content, but profile-driven season progression is not yet runtime-owned.

## Recommended Popup Purpose

The first popup should answer:

- What time is it?
- What season is it?
- What does this season usually mean here?
- What climate profile applies if known?
- What temperature band is expected if climate data is available?
- Which effects are informational only versus active gameplay effects?

It should not imply weather, travel, survival, crop, or combat behavior unless those systems actually consume the data.

## Recommended First Popup Structure

```text
Calendar & Climate
  Current Time
    Year, month, day, subday, tick
    Current season
  Seasonal Context
    Season name
    Month-to-season note
    Climate profile name if known
    Expected low/high band if known
  World Effects
    Informational only for now
    No active weather/travel/body-state effects unless implemented
  Data Notes
    Runtime season mapping currently comes from shared time config
    Climate profile data is authored content
```

## Candidate View-Model Fields

Future pure view-model shape:

```ts
type CalendarClimatePopupViewModel = {
  title: string;
  currentTimeRows: Array<{ label: string; valueLabel: string }>;
  seasonRows: Array<{ label: string; valueLabel: string }>;
  climateRows: Array<{ label: string; valueLabel: string }>;
  effectNotes: string[];
  warningNotes: string[];
};
```

Do not add this type in this audit.

## Safe Data Sources

Safe fields from `SimulationClock`:

- tick
- subday
- day
- month
- season
- year

Safe climate profile fields when a current owner supplies a profile id:

- profile name
- season lengths
- temperature variance
- seasonal low/high values for current season
- temperature unit

Do not guess a climate profile from settlement/region unless a current data link exists and is inspected in the implementation pass.

## Copy Rules

Safe copy:

```text
Current season: Winter
Expected seasonal band: -20°C to -2°C
Climate data is informational until weather and travel effects are wired.
```

Unsafe copy unless systems exist:

```text
Travel is slowed by snow.
Crops will fail this month.
You are at risk of freezing.
Roads are closed.
```

Use explicit inactive-state language:

```text
Climate effects are not active yet.
Weather simulation is not active yet.
```

## Implementation Boundary

A first implementation should be view-model/read-only only.

Allowed:

- format current clock fields
- show current season
- show current climate profile if an inspected owner supplies it
- show seasonal temperature band if profile and season exist
- show inactive-system notes

Forbidden:

- changing `advanceClock(...)`
- replacing month-to-season mapping
- deriving climate effects
- applying body-state penalties
- applying travel penalties
- applying economy/crop effects
- adding weather randomization
- adding world event behavior
- adding region/settlement climate inference without explicit current data owner

## Open Owner Questions

These should be answered before runtime climate effects:

1. Which data owner links a player location to a climate profile?
2. Should clock season use the hardcoded month mapping, calendar content, or climate-profile season lengths long-term?
3. Should starting season be creator-selectable, difficulty-linked, random, or fixed?
4. Should climates affect travel first, body-state first, economy first, or only presentation first?
5. Should weather be generated per settlement, region, route, or global time slice?

## Current Prompt Authority

Use `docs/design/calendar-climate-popup-view-model-plan.md`, `docs/dev/current-gpt-handoff.md`, and `docs/dev/codex-sequenced-implementation-plan.md` for current prompt generation. This audit remains a source-detail reference only.