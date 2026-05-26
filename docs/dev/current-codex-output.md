# Current Codex Output

Source version/run: Version 0.5.82 - Calendar Climate Read-Only Popup
Date: 2026-05-26
Branch/status assumption: Ran locally on `master`. Initial worktree was clean and tracking `origin/master`. Default `git pull` failed local SSL issuer validation; `git -c http.sslBackend=schannel pull` succeeded and fast-forwarded to `9cfb69a`. Worktree was clean after sync and before edits.

## Result

Implemented the pure Calendar/Climate popup projection and focused tests. The new projection is read-only, synchronous, supplied-data-only, and returns no action ids. No React UI was added. Also fixed a browser loading error by replacing the only app import of the `game-engine/src/index.js` barrel with targeted browser-safe game-engine module imports.

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
- `packages/shared/time/src/index.ts`
- `packages/shared/types/src/contracts.ts`
- `apps/rpg-ui/src/game-shell/economyClarityPresentation.ts`
- `apps/rpg-ui/src/game-shell/chronicleRunEndSummaryPresentation.ts`
- `apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts`
- `apps/rpg-ui/src/runtime/uiViewModel.ts`
- `apps/rpg-ui/src/components/TopStatusBar.tsx`
- `tests/unit/economy-clarity-presentation.test.mjs`
- `tests/unit/clock-season-map.test.mjs`

## Files Changed

- `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `tests/unit/calendar-climate-presentation.test.mjs`
- `docs/dev/current-codex-output.md`

## Projection Boundary

Added `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` as a pure presentation module. It exports:

- `CalendarClimateTone`
- `CalendarClimateRow`
- `CalendarClimateTemperatureBand`
- `CalendarClimateProfileInput`
- `CalendarClimateProfileSourceInput`
- `CalendarClimateLocationInput`
- `CalendarClimatePopupInput`
- `CalendarClimatePopupViewModel`
- `buildCalendarClimatePopupViewModel(input)`

The input accepts an optional supplied `SimulationClock`, optional location labels/ids, optional explicit climate profile/source data, and optional month labels. The output includes `title`, `subtitle`, `currentTimeRows`, `seasonRows`, `climateRows`, `temperatureRows`, `informationalEffectNotes`, `warningNotes`, and `actionIds: []`.

Every path returns `actionIds: []`.

## Label / Copy Rules Implemented

- Title is always `Calendar and Climate`.
- Subtitle uses known settlement/region labels first, then known supplied profile label, otherwise `Read-only calendar context`.
- Time rows render year, month, day, watch, and tick from the supplied clock.
- Month labels use supplied labels, then local projection constants matching current UI month labels, then `Month <n>`.
- Watch labels map subday 1 to `Dawn Watch`, 2 to `High Sun`, 3 to `Dusk Watch`, 4 to `Night Watch`, and unknown subdays to `Unknown Watch`.
- Season rows use exact `clock.season` and state that runtime season comes from shared time month mapping.
- Supplied climate profiles render profile name or humanized id, with source label detail when supplied.
- Temperature rows render only `Expected seasonal band` from supplied profile data for the current runtime season.
- Informational notes state climate/weather are informational only, no travel/crop/body-state/combat/economy effects are applied, and runtime season follows shared clock mapping rather than climate profile season progression.
- Missing clock/profile/profile data/season band paths render unavailable or unknown rows with warning notes.

## Data Rules Enforced

The projection uses supplied data only. It does not load global content, import design docs, infer climate from settlement id, region id, active region, climate burden, biome, or ecology hints, mutate input objects, change runtime clock state, or emit command/action ids.

Browser-facing code no longer imports `packages/engines/game-engine/src/index.js` from `characterCreationCatalog.ts`; the file now imports only the specific legacy/backstory modules it needs. An app-only scan for `game-engine/src/index`, `civilization-engine/src/index`, `civilization-engine/src/content`, `load.*Content`, `node:fs`, and `readFileSync` in `apps/rpg-ui/src` returned no matches.

## Behavior / Runtime Confirmation

Clock progression, season mapping, climate profiles, calendar content, weather, travel, body-state, crops, economy, combat, save schema, UI, generated output, Chronicle, Bloodlines, Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heirloom, and bequest behavior did not change. The character creator import boundary changed only to avoid a browser-incompatible engine barrel import; backstory/Legacy resolver behavior was not changed.

## Tests Added / Updated

Added `tests/unit/calendar-climate-presentation.test.mjs` covering:

- initial clock year/month/day/watch/tick/Winter rows
- runtime season language staying informational and not profile-driven
- supplied climate profile label/source label/current-season temperature band
- missing profile unknown/unavailable behavior with no settlement climate inference
- profile id without profile data warning and omitted temperature band
- profile missing current-season band warning and unavailable row
- empty `actionIds` invariant
- input immutability
- banned active-effect phrases absent from projection copy

## Checks Run

- `git status --short --branch`
- `git rev-parse --abbrev-ref HEAD`
- `git pull` (failed due local SSL issuer validation)
- `git -c http.sslBackend=schannel pull`
- `git status --short --branch`
- `node --test tests/unit/calendar-climate-presentation.test.mjs`
- `node --test tests/unit/clock-season-map.test.mjs`
- `rg "node:fs|readFileSync|load.*Content|civilization-engine/src/content|civilization-engine/src/index" apps/rpg-ui packages/engines tests`
- `rg -n "game-engine/src/index|civilization-engine/src/index|civilization-engine/src/content|load.*Content|node:fs|readFileSync" apps/rpg-ui/src` (no matches)
- `node --test tests/unit/calendar-climate-presentation.test.mjs` (rerun after loading fix)
- `node --test tests/unit/clock-season-map.test.mjs` (rerun after loading fix)
- `git diff --check` (passed; Git reported LF-to-CRLF working-copy warnings)

Broad typecheck, broad workspace validation, and React/component tests were not run because this pass added no React UI and touched no broad runtime paths.

## Risks / Follow-Up

- The projection intentionally does not resolve a climate profile from settlement or region ids. A later resolver should stay separate and tested if the project chooses to use `settlements.json` plus `world_map_features.json` for active location climate context.
- UI wiring remains deferred. If desired, it should be a narrow read-only top-status popup pass that renders this projection without adding commands or active effects.
- Existing Node-side engine and test files still contain `node:fs` and content-loader imports by design. The browser-facing `apps/rpg-ui/src` scan is clean for the forbidden content-loader path.
- `docs/future_content_backlog.md` was not updated because no new deferred work was discovered beyond already recorded UI/resolver follow-up.

## Temporary Guardrail Cleanup Decision

Keep `docs/design/calendar-climate-popup-ia-audit.md` useful through a later UI wiring decision. After either a narrow UI pass lands or the UI path is explicitly deferred again, it can be marked consumed/folded/deleted in a cleanup pass.

## Next Recommended Version

Version 0.5.83 - Combat Equipment Mapping Audit

If the user wants immediate UI wiring after this projection lands, a narrow `Calendar Climate Read-Only Popup UI` pass can be inserted before 0.5.83.

## Suggested Commit Message

feat(calendar): add climate popup projection
