# Calendar Climate Popup View Model Plan

Date: 2026-05-25
Route: Codex 5.5 Local
Status: finalized planning source for `Version 0.5.82 - Calendar Climate Read-Only Popup`

## Purpose

Plan a read-only Calendar/Climate popup projection that explains current clock, season, and authored climate context without adding weather, travel, crop, combat, body-state, economy, or command behavior.

This is a planning-only boundary. It does not implement `calendarClimatePresentation.ts`, React UI, tests, clock changes, season mapping changes, climate content changes, generated output, or active effect behavior.

## Current Repo Reality

- `packages/shared/time/src/index.ts` owns runtime clock progression. `createInitialClock()` starts at year 1, month 1, day 1, subday 1, tick 0, season Winter.
- The shared time default config uses 6 ticks per subday, 4 subdays per day, 8 days per month, and 13 months per year.
- Runtime season mapping is the temporary `SEASON_BY_MONTH` table in shared time, not climate profile season lengths.
- `tests/unit/clock-season-map.test.mjs` locks the current 13-month to 6-season runtime mapping.
- `packages/shared/types/src/contracts.ts` exposes `SeasonName`, `SimulationClock`, `SaveSnapshot.clock`, `WorldState.weatherState: Record<string, unknown>`, and `WorldTickContext.climateProfileId`.
- `packages/content/base/world/calendar.json` only lists numeric months and the six canonical season names. It does not provide display month names.
- `apps/rpg-ui/src/runtime/uiViewModel.ts` currently owns top-bar date labels through local month-name constants and top-bar season/time rows through `snapshot.clock`.
- `apps/rpg-ui/src/components/TopStatusBar.tsx` is the current rendered owner for date, season, and time-of-day display, and already has overlay/popover patterns for condition and settings panels.
- `packages/content/base/world/climate_profiles.json` has 18 records with profile id, display name, season lengths, temperature variance, a Celsius temperature template, and per-season low/high bands.
- `docs/data-dictionary/climate.md` documents climate profile semantics and the seasonal band formula. Those semantics are content/reference data, not runtime weather simulation.
- `packages/content/base/world/settlements.json` records have `visualMapRef.climateZoneId` for mapped settlements.
- `packages/content/base/world/world_map_features.json` maps authored climate zones to `climateProfileId`. This is an explicit authored content link, but it is not currently a runtime active-profile resolver.
- `packages/content/base/world/regional_ecology_profiles.json` also has macro-region `primaryClimateProfileId` and secondary profile ids. This is regional ecology content, not a current active player-location climate resolver.
- `apps/rpg-ui/src/runtime/demoSnapshot.ts` has world weather details but no `climateProfileId`; the save/load roundtrip fixture has `worldState.weatherState.climateProfileId`. Because `weatherState` is typed as a generic record, the popup must validate any supplied profile id before using it.
- Civilization economy code consumes `clock.season` and settlement `survivalModel.climateBurden` for economy math, but it does not consume climate profiles as active weather or climate progression.

## Inspected Source Owners

- `packages/shared/time/src/index.ts`
- `packages/shared/types/src/contracts.ts`
- `packages/content/base/world/calendar.json`
- `packages/content/base/world/climate_profiles.json`
- `packages/content/base/world/settlements.json`
- `packages/content/base/world/regions.json`
- `packages/content/base/world/region_localities.json`
- `packages/content/base/world/world_map_features.json`
- `packages/content/base/world/regional_ecology_profiles.json`
- `packages/engines/civilization-engine/src/content.ts`
- `packages/engines/civilization-engine/src/economy.ts`
- `packages/engines/civilization-engine/src/spatial-world.ts`
- `apps/rpg-ui/src/runtime/uiViewModel.ts`
- `apps/rpg-ui/src/runtime/demoSnapshot.ts`
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`
- `apps/rpg-ui/src/components/TopStatusBar.tsx`
- `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts`
- `tests/unit/clock-season-map.test.mjs`
- `tests/simulation/save-load-roundtrip.test.mjs`
- `tests/unit/economy-clarity-presentation.test.mjs`

Note: the prompt listed `region_locales.json`; the current repo file is `packages/content/base/world/region_localities.json`.

## Data-Owner Map

| Popup section | Current source owner | Safe 0.5.82 input | Rules |
| --- | --- | --- | --- |
| Title and subtitle | Future `calendarClimatePresentation.ts` | Optional location/profile labels plus clock | Title should stay literal, for example `Calendar and Climate`. Subtitle may name a known settlement or climate profile only when supplied. |
| Current time rows | `SimulationClock` from shared types and shared time | Required `clock: SimulationClock` | Show year, month, day, subday/watch, tick, and current runtime season from the supplied clock. Do not advance or normalize the clock. |
| Month labels | Current UI local constants in `uiViewModel.ts`; calendar content only has numeric months | Local constants in future projection, matching current UI labels, or a supplied label list | If a month has no label, fall back to `Month N`. Do not edit calendar content in 0.5.82. |
| Watch labels | Gameplay code has a 1-based `WATCH_LABELS` pattern; top-bar UI currently derives labels locally | Local 1-based label map in future projection | Subday 1 is Dawn Watch, 2 High Sun, 3 Dusk Watch, 4 Night Watch. Unknown subdays render `Unknown Watch`. |
| Runtime season rows | `clock.season` and `SEASON_BY_MONTH` in shared time | Required `clock.season` | Say this is the current runtime season from shared time. Do not claim climate profile season lengths drive runtime season progression. |
| Climate profile rows | `climate_profiles.json`, optionally resolved by caller | Optional `climateProfile` plus optional source metadata | Display profile name/id only when an explicit profile object is supplied or an explicitly resolved profile id validates against supplied profile records. |
| Settlement/location climate source | `settlements.json` `visualMapRef.climateZoneId` plus `world_map_features.json` `climateZones[].climateProfileId` | Deferred resolver input only if 0.5.82 explicitly includes a tested resolver | The projection should not guess from settlement or region ids by itself. If a resolver is added later, it must preserve source labels and warnings. |
| Regional climate source | `regional_ecology_profiles.json` | Deferred reference only | Macro-region ecology profiles may be shown only as regional context, not as an active local profile, unless a caller explicitly marks that source. |
| Temperature rows | `climateProfile.seasonalTemperatureProfiles[clock.season]` and `temperatureRangeTemplate.unit` | Optional explicit climate profile and clock | Display expected seasonal low/high only for the runtime season and only when that profile season band exists. |
| Informational effect notes | Projection-owned copy constants | None | Must say climate/weather effects are informational only until consuming systems exist. |
| Warning notes | Projection-owned validation | Missing or partial inputs | Missing clock/profile/season band/profile id should render unavailable notes, not inferred climate. |
| Action ids | Projection-owned invariant | None | Always emit `actionIds: []`. |

## 0.5.82 Implementation Decision

`Version 0.5.82 - Calendar Climate Read-Only Popup` should implement the pure projection and focused tests first. It should not add the React popup in the same pass unless the prompt explicitly broadens the implementation after reviewing this plan.

Reasoning:

- The UI attachment point is identifiable: `TopStatusBar.tsx` already renders date, season, and time of day and has overlay patterns.
- The data boundary is not fully runtime-owned: active climate profile resolution from player location is not stable because `weatherState` is generic and demo data lacks `climateProfileId`.
- A pure projection can lock the read-only copy, no-action invariant, missing-data behavior, and temperature-band display before any component wiring.

If a later implementation pass includes UI after the projection is green, it should attach a read-only top-status popup to the existing date/season/time area and render only the projection output. It must not add player actions, command ids, active warnings, generated UI output, or new runtime effects.

## Proposed Future Projection File

- `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts`

## Proposed Exported Types And Function

```ts
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

export function buildCalendarClimatePopupViewModel(
  input: CalendarClimatePopupInput
): CalendarClimatePopupViewModel;
```

Implementation notes:

- Keep the function pure and synchronous.
- Do not import design docs.
- Do not mutate input objects.
- Do not load global content inside the function.
- Accept a supplied climate profile object rather than deriving one from region/settlement ids.
- If a future wrapper resolves a profile from content, keep that resolver separate from the projection and test its source labels independently.

## Current Clock / Time Label Rules

- Title: `Calendar and Climate`.
- Subtitle with known location: `<Settlement or region> - read-only calendar context`.
- Subtitle with only profile: `<Profile name> - read-only climate context`.
- Subtitle with no location/profile: `Read-only calendar context`.
- Year row: `Year <clock.year>`.
- Month row: `<month label>` from the supplied month labels or projection constants; fallback `Month <clock.month>`.
- Day row: `Day <clock.day>`.
- Watch row: subday 1 `Dawn Watch`, 2 `High Sun`, 3 `Dusk Watch`, 4 `Night Watch`, otherwise `Unknown Watch`.
- Tick row: `Tick <clock.tick>`.
- Missing clock: current time rows should contain one unavailable row and warnings should include `No runtime clock was supplied.`

## Season Label Rules

- Always use `clock.season` for current season when clock is supplied.
- The primary season row value is the exact `SeasonName`: Winter, Thaw, Spring, Summer, Harvest, or Withering.
- Add a detail row/note: `Runtime season comes from shared time month mapping.`
- If climate profile `seasonLengths` are supplied, they may be displayed as authored profile context, but not as active runtime progression.
- Warning note when profile season lengths are displayed: `Climate profile season lengths are authored reference data; they do not drive the current runtime season yet.`

## Climate Profile Label Rules

- Known explicit profile:
  - Climate row label: `Climate Profile`
  - Value: profile `name` when available, otherwise humanized id.
  - Detail: profile id plus source label when supplied, for example `climate.mild_winter via Verdant Thalos Climate`.
- Profile id without matching profile object:
  - Value: `Unavailable`
  - Warning: `Climate profile data was not supplied for <id>.`
- No profile id/profile:
  - Value: `Unknown`
  - Warning: `No authoritative climate profile was supplied.`
- Climate zone labels may be shown only when a caller supplies `climateZoneId` or `climateZoneName`.
- Do not infer from `regionId`, `settlementId`, `activeRegions`, `climateBurden`, biome climate band, or `climateTendencies` inside the projection.

## Temperature Band Label Rules

- Temperature rows render only when both a clock and explicit climate profile are supplied.
- Use `profile.seasonalTemperatureProfiles[clock.season]`.
- Celsius band label format: `<low>C to <high>C`.
- Unknown/non-Celsius unit label format: `<low> to <high> <unit>`.
- If the current runtime season has no band in the supplied profile, render an unavailable temperature row and warning: `No expected temperature band is authored for <season>.`
- Temperature copy must say `Expected seasonal band`, not current weather, forecast, hazard, exposure, or penalty.
- Do not calculate random weather, daily temperature, or local exposure.

## Informational-Only Effect Note Rules

Future projection should always include concise informational notes:

- `Climate and weather are informational only in this popup.`
- `No travel, crop, body-state, combat, or economy effects are applied from this view model.`
- `Runtime season currently follows shared clock mapping, not climate profile season progression.`

Forbidden note language until consuming systems exist:

- travel slowdown
- freezing risk
- crop failure
- road closure
- survival penalty
- combat penalty
- active weather warning
- command, dispatch, rest, travel, shop, buy, sell, craft, or caravan action text

## Missing / Partial / Non-Authoritative Data Behavior

- Missing clock: return unavailable current-time row, no season/temperature claims, and no actions.
- Missing profile: keep climate and temperature rows as `Unknown` or `Unavailable`; do not resolve from settlement/region automatically.
- Supplied profile id but no supplied profile record: warn and display no temperature band.
- Supplied profile record without current-season band: warn and display no temperature band.
- Supplied invalid numbers: treat as unavailable and warn; do not coerce nonsensical ranges.
- Supplied settlement or region without explicit profile: show the location in subtitle only, not a climate profile.
- Supplied `weatherState.climateProfileId` from a save snapshot can be used only after type-checking it as a string and matching it to supplied profile data.
- All missing-data paths must return `actionIds: []`.

## Allowed / Deferred Behavior Table

| Area | Allowed in 0.5.82 projection | Deferred / forbidden |
| --- | --- | --- |
| Clock | Read supplied `SimulationClock`; format year/month/day/subday/tick/season | Advancing, normalizing, or changing clock progression |
| Season | Display `clock.season`; explain shared time ownership | Replacing `SEASON_BY_MONTH` or using profile season lengths as runtime season |
| Calendar content | Use existing month label constants or supplied labels | Editing `calendar.json` or adding calendar schema/content |
| Climate profile | Display supplied profile name/id and expected seasonal band | Guessing from region/settlement without explicit resolver input |
| Settlement map climate | Document as a future explicit resolver source | Hidden projection-side lookup from settlement id |
| Regional ecology profile | Optional contextual source if explicitly supplied | Treating macro-region ecology as active local climate |
| Temperature | Show authored expected seasonal low/high | Forecasts, random weather, daily weather, exposure, hazards |
| Effects | State informational-only status | Travel, body-state, crop, economy, combat, survival, or road effects |
| UI | Pure projection only for first 0.5.82 pass | React popup unless explicitly added after projection boundary is accepted |
| Commands | `actionIds: []` | Player actions, command ids, buttons that mutate state |
| Generated output | No generated UI output changes | Updating generated artifacts |

## Future Focused Test Plan For 0.5.82

Add `tests/unit/calendar-climate-presentation.test.mjs` if the projection is implemented.

Focused tests:

1. `initial clock renders year/month/day/watch/tick and Winter from runtime clock`.
2. `runtime month-to-season language stays informational and does not use profile season lengths as active progression`.
3. `known supplied climate profile renders profile label, source label, and current-season expected temperature band`.
4. `missing climate profile renders unknown/unavailable rows and no inferred settlement climate`.
5. `supplied profile id without matching profile data warns and omits temperature band`.
6. `profile missing current-season temperature band warns and keeps the temperature row unavailable`.
7. `view model always emits actionIds as an empty array`.
8. `projection does not mutate clock, location, or profile input objects`.
9. `informational notes avoid active-effect claims`, using assertions against banned phrases such as `slowdown`, `freezing risk`, `crop failure`, `road closure`, `survival penalty`, and `combat penalty`.
10. Optional only if an explicit resolver is added: `settlement visualMapRef climateZoneId resolves through world_map_features climateZones to a validated climate profile with source notes`.

## Validation Commands For 0.5.82

If 0.5.82 implements only the pure projection:

- `node --test tests/unit/calendar-climate-presentation.test.mjs`
- `node --test tests/unit/clock-season-map.test.mjs`
- `git diff --check`

If 0.5.82 also imports or resolves content:

- `npm.cmd run tool:content-lint`
- `node --test tests/unit/calendar-climate-presentation.test.mjs`
- `node --test tests/unit/clock-season-map.test.mjs`
- `git diff --check`

If 0.5.82 adds a React popup:

- Run the projection tests above.
- Add or run the narrow UI/component validation available for the touched component.
- Do not run broad workspace typecheck unless a future prompt explicitly asks for it.

## Cleanup Decision For IA Audit

Keep `docs/design/calendar-climate-popup-ia-audit.md` through 0.5.82 as a source-detail reference. After the projection implementation lands and this plan is confirmed against tests, a later cleanup pass should fold any still-useful source-detail notes into the current handoff or durable design ledger, then mark the IA audit consumed or delete it.
