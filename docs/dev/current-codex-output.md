# Current Codex Output

Source version/run: Version 0.5.81 - Calendar Climate Popup View Model Plan
Date: 2026-05-25
Branch/status assumption: Ran locally on `master`. Initial worktree was clean and tracking `origin/master`. Default `git pull` failed local SSL issuer validation; `git -c http.sslBackend=schannel pull` succeeded and fast-forwarded to `f6a6525`. Worktree was clean after sync and before edits.

## Result

Finalized the planning-only Calendar/Climate popup view-model plan from live repo inspection. The 0.5.82 recommendation is pure projection plus focused tests first, with React popup wiring deferred unless the next prompt explicitly broadens scope after accepting the projection boundary.

## Files Inspected

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/calendar-climate-popup-view-model-plan.md`
- `docs/design/calendar-climate-popup-ia-audit.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `docs/data-dictionary/climate.md`
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

## Files Changed

- `docs/design/calendar-climate-popup-view-model-plan.md`
- `docs/dev/current-codex-output.md`

## Current Repo Reality

Shared time owns runtime clock progression and the temporary month-to-season mapping. The clock starts at year 1, month 1, day 1, subday 1, tick 0, season Winter; the default clock config is 6 ticks per subday, 4 subdays per day, 8 days per month, and 13 months per year.

Calendar content currently lists numeric months and six season names only. UI month/watch labels are local game-shell presentation details. Climate profiles are authored content with names, season lengths, variance, Celsius templates, and seasonal low/high bands, but profile-driven season progression and active weather are not runtime-owned.

Settlement records link to map climate zones through `visualMapRef.climateZoneId`, and `world_map_features.json` maps those zones to `climateProfileId`. That is an explicit authored content link, but the active save/runtime path does not yet provide a stable current-location climate profile resolver. `worldState.weatherState` remains a generic record.

## Data-Owner Map

- Current time rows: `SimulationClock` from shared time/shared types.
- Month labels: current game-shell UI constants or supplied projection labels; calendar content has no display month names.
- Watch labels: 1-based watch labels should be projection-owned for 0.5.82.
- Runtime season rows: `clock.season` from shared time mapping.
- Climate rows: explicit supplied climate profile data only.
- Temperature rows: supplied profile `seasonalTemperatureProfiles[clock.season]` only.
- Settlement climate source: authored settlement climate zone plus world-map climate zone profile link, reserved for a separate explicit resolver if needed.
- Informational/warning notes and `actionIds: []`: future projection owner.

## Planned Projection Boundary

Future file: `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts`

Future pure function: `buildCalendarClimatePopupViewModel(input)`

Future output shape:

- `title`
- `subtitle`
- `currentTimeRows`
- `seasonRows`
- `climateRows`
- `temperatureRows`
- `informationalEffectNotes`
- `warningNotes`
- `actionIds: []`

The projection should accept a `SimulationClock`, optional location labels, and optional explicit climate profile/source data. It should not load global content, mutate inputs, infer climate from settlement/region ids, or emit command/action ids.

## Label / Copy Rules

- Current time: render year, month, day, subday/watch, tick, and current runtime season from the supplied clock.
- Season: always use `clock.season`; explain that runtime season comes from shared time month mapping.
- Climate profile: display profile name/id only when explicit profile data is supplied or an explicitly resolved profile id validates against supplied profile records.
- Temperature band: show `Expected seasonal band` from the supplied profile's current-season low/high values only.
- Informational notes: clearly state climate/weather are informational only and no travel, crop, body-state, combat, or economy effects are applied.
- Warning notes: missing clock/profile/profile data/season band should produce unavailable notes, not inferred climate or active-effect warnings.

## Allowed / Deferred Behavior

- Allowed: read supplied clock/profile/location data, format read-only rows, show authored expected seasonal temperature bands, and emit informational-only notes.
- Deferred/forbidden: clock progression changes, month-to-season changes, climate profile edits, calendar content edits, weather simulation, weather randomization, climate-driven travel penalties, body-state penalties, crop/farming behavior, economy/crop effects, combat/weather effects, player actions, command ids, generated UI output, or projection-side climate inference from settlement/region ids.

## Future Tests

- `initial clock renders year/month/day/watch/tick and Winter from runtime clock`
- `runtime month-to-season language stays informational and does not use profile season lengths as active progression`
- `known supplied climate profile renders profile label, source label, and current-season expected temperature band`
- `missing climate profile renders unknown/unavailable rows and no inferred settlement climate`
- `supplied profile id without matching profile data warns and omits temperature band`
- `profile missing current-season temperature band warns and keeps the temperature row unavailable`
- `view model always emits actionIds as an empty array`
- `projection does not mutate clock, location, or profile input objects`
- `informational notes avoid active-effect claims`
- Optional only if an explicit resolver is added: settlement `visualMapRef.climateZoneId` resolves through `world_map_features.json` to a validated climate profile with source notes.

## Behavior / Runtime Confirmation

Docs-only planning change. Clock progression, season mapping, climate profiles, calendar content, weather, travel, body-state, crops, economy, combat, save schema, UI, generated output, Chronicle, Bloodlines, Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heirloom, and bequest behavior did not change.

## Checks Run

- `git status --short --branch`
- `git rev-parse --abbrev-ref HEAD`
- `git pull` (failed due local SSL issuer validation)
- `git -c http.sslBackend=schannel pull`
- `git status --short --branch`
- `git diff --check` (passed; Git reported LF-to-CRLF working-copy warnings)

Focused runtime tests were not required because no source, test, content, schema, or UI files changed.

## Risks / Follow-Up

- The existing top-bar date/time labels are local UI presentation constants, not shared calendar content. 0.5.82 should avoid treating them as calendar data ownership.
- Active climate profile resolution is not runtime-owned yet. The future projection should accept explicit profile data and keep any settlement-to-climate-zone resolver separate and tested.
- The requested `region_locales.json` file is not present; the current repo uses `region_localities.json`.

## Temporary Guardrail Cleanup Decision

Keep `docs/design/calendar-climate-popup-ia-audit.md` through 0.5.82 as a source-detail reference. After projection implementation lands and tests confirm the boundary, a later cleanup pass should fold useful leftovers into the current handoff or durable design ledger, then mark the IA audit consumed or delete it.

## Next Recommended Version

Version 0.5.82 - Calendar Climate Read-Only Popup

## Suggested Commit Message

docs(calendar): finalize climate popup view model plan
