# Current Codex Output

Source version/run: Version 0.5.83 - Calendar Climate Read-Only Popup UI
Date: 2026-05-26
Branch/status assumption: Ran locally on `master`. Initial worktree was clean and tracking `origin/master`. Default `git pull` failed local SSL issuer validation; `git -c http.sslBackend=schannel pull` succeeded and fast-forwarded to `bb95e0d`. Worktree was clean after sync and before edits.

## Result

Rendered the existing Calendar/Climate projection in a compact read-only top-status popup. The UI opens from the date/season/time label, shows projection rows and notes only, and adds no actions, content loading, generated output, or active climate/weather behavior.

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
- `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts`
- `tests/unit/calendar-climate-presentation.test.mjs`
- `tests/unit/clock-season-map.test.mjs`
- `apps/rpg-ui/src/components/TopStatusBar.tsx`
- `apps/rpg-ui/src/runtime/uiViewModel.ts`
- `apps/rpg-ui/src/runtime/demoSnapshot.ts`
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`
- `apps/rpg-ui/src/game-shell/InGameShell.tsx`
- `apps/rpg-ui/src/types.ts`
- `apps/rpg-ui/src/index.css`
- existing UI/source test search results under `tests/unit`

## Files Changed

- `apps/rpg-ui/src/components/TopStatusBar.tsx`
- `apps/rpg-ui/src/runtime/uiViewModel.ts`
- `docs/dev/current-codex-output.md`

## UI Boundary

`TopStatusBar.tsx` now renders a read-only Calendar/Climate overlay from the date/season/time text in the character header. It reuses the existing `forged-overlay` top-bar popover style and local toggle pattern. The overlay renders `title`, `subtitle`, `currentTimeRows`, `seasonRows`, `climateRows`, `temperatureRows`, `informationalEffectNotes`, and `warningNotes` from `buildCalendarClimatePopupViewModel` output. It does not render buttons or consume `actionIds`.

## Data Boundary

`uiViewModel.ts` supplies the existing runtime snapshot `clock`, existing top-bar settlement/region display labels, current settlement/region ids, and the existing UI month labels. No climate profile data is supplied because no authoritative browser-safe profile owner is already present in UI state, so the projection safely renders unknown/unavailable climate rows. No global content, JSON climate profile import, content resolver, settlement-to-climate inference, or engine content loader was added.

## Copy / Interaction Rules

The popup copy remains projection-owned and informational: calendar rows use runtime clock data, season rows identify shared time month mapping, climate rows show unknown/unavailable without a supplied profile, temperature rows stay unavailable without supplied profile data, informational notes state no travel/crop/body-state/combat/economy effects are applied, and warning notes render as passive warnings. The UI adds only a toggle interaction from the existing date/time label and no action buttons, player commands, command ids, or active-effect warning copy.

## Browser Safety

Browser-facing app scan is clean for forbidden Node/content-loader imports. No app-side file imports `node:fs`, `readFileSync`, `load.*Content`, `civilization-engine/src/content`, `civilization-engine/src/index`, or `game-engine/src/index`.

## Behavior / Runtime Confirmation

Clock progression, season mapping, climate profiles, calendar content, weather, travel, body-state, crops, economy, combat, save schema, generated output, Chronicle, Bloodlines, Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heirloom, and bequest behavior did not change. UI behavior changed only by adding the read-only top-status Calendar/Climate popup.

## Tests Added / Updated

No UI/component test was added. The repo has source-scan tests and view-model tests, but no clear TopStatusBar render/component test pattern for this overlay. Existing focused Calendar/Climate projection tests and the clock-season map test remain the validation boundary for this narrow UI wiring pass.

## Checks Run

- `git status --short --branch`
- `git rev-parse --abbrev-ref HEAD`
- `git pull` (failed due local SSL issuer validation)
- `git -c http.sslBackend=schannel pull`
- `git status --short --branch`
- `rg -n "Calendar|Climate|climate|weather|season" docs/design/future-system-design-ledger.md docs/future_content_backlog.md`
- `rg -n "@testing-library|react-test|TopStatusBar|render\\(" tests apps/rpg-ui/src -g "*.test.*" -g "*.spec.*"`
- `rg -n "createUiViewModel|uiViewModel|InGameShell|TopStatusBar" tests/unit tests/integration`
- `rg -n "game-engine/src/index|civilization-engine/src/index|civilization-engine/src/content|load.*Content|node:fs|readFileSync" apps/rpg-ui/src` (no matches)
- `node --test tests/unit/calendar-climate-presentation.test.mjs`
- `node --test tests/unit/clock-season-map.test.mjs`
- `git diff --check` (passed; Git reported LF-to-CRLF working-copy warnings)

## Risks / Follow-Up

- The popup intentionally shows unknown/unavailable climate context until a browser-safe authoritative climate-profile owner or resolver is designed.
- The overlay was not browser-render tested because no existing TopStatusBar component test pattern was available in this repo.
- `docs/future_content_backlog.md` was not updated because no new deferred work was discovered beyond the already recorded climate-profile resolver and weather/effect ownership gaps.

## Temporary Guardrail Cleanup Decision

Keep `docs/design/calendar-climate-popup-ia-audit.md` until climate-profile resolver ownership is addressed or explicitly deferred after this UI pass. It remains useful as a source-detail reference for avoiding settlement/region climate inference and content-loader drift.

## Next Recommended Version

Version 0.5.84 - Combat Equipment Mapping Audit

## Suggested Commit Message

feat(calendar): render climate popup read only
