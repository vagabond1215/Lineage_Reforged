# Calendar Climate Popup View Model Plan

Date: 2026-05-22
Route: ChatGPT via GitHub Connector
Status: planning source for `Version 0.5.80 - Calendar Climate Popup View Model Plan`

## Purpose

Plan a read-only calendar/climate popup that explains time, season, and climate context before any weather, travel, crop, or body-state effects are implemented.

This plan turns `docs/design/calendar-climate-popup-ia-audit.md` into a Codex-ready source for a later pure view-model and UI pass.

This plan does not:

- change clock logic
- change season mapping
- edit climate profiles
- edit calendar content
- add weather simulation
- add travel penalties
- add body-state penalties
- add crop/farming behavior
- edit generated UI output

## Current Source Reality

Current clock and climate sources can support an informational popup:

- shared time logic starts at Year 1, month 1, day 1, subday 1, tick 0, season Winter.
- default config uses ticks/subdays/days/months/year.
- runtime season mapping currently comes from shared time logic, not profile-driven climate seasons.
- `docs/data-dictionary/climate.md` documents calendar/climate content semantics.
- `packages/content/base/world/climate_profiles.json` contains authored climate profile names, season lengths, temperature variance, templates, and seasonal low/high bands.

Important limitation:

- Climate profile data is authored content, but profile-driven season progression is not yet runtime-owned.

## 0.5.80 Recommended Output

`Version 0.5.80 - Calendar Climate Popup View Model Plan` should refine this plan from live repo inspection.

If the repo shape is clear, the next implementation should be:

- `Version 0.5.81 - Calendar Climate Read-Only Popup`

## Future View-Model Shape

Suggested future file:

- `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts`

Suggested pure function:

```ts
buildCalendarClimatePopupViewModel(input)
```

Suggested output:

- title
- current time rows
- season rows
- climate rows
- expected temperature rows if profile data is known
- informational effect notes
- warning notes for missing climate profile / temporary season mapping
- no command ids

## Popup Content Rules

The popup should answer:

- What time is it?
- What season is it?
- What does this season usually mean here?
- What climate profile applies if known?
- What temperature band is expected if climate data is available?
- Which parts are informational only?

## Forbidden Behavior

- Do not change clock progression.
- Do not change month-to-season mapping.
- Do not add weather simulation.
- Do not add climate-driven travel penalties.
- Do not add body-state penalties.
- Do not add farming/crop behavior.
- Do not imply active effects exist unless runtime systems actually consume the data.
- Do not fabricate settlement climate data when no source exists.

## Future UI Rules

- Read-only popup or panel only.
- Clearly label informational-only effects.
- Missing profile data should render unavailable/unknown notes.
- No forecast, travel warning, crop warning, or survival penalty copy unless those systems are live.

## Future Tests

Future projection tests should prove:

1. Current clock rows render from current clock state.
2. Current season label is shown from runtime time source.
3. Known climate profile renders profile name and seasonal temperature bands.
4. Missing climate profile renders safe unavailable copy.
5. Informational-only notes are present.
6. No active weather/travel/body-state/crop effect claims are made.
7. No command/action ids are emitted.
8. Clock/climate content is not mutated.

## Validation For Implementation Pass

Future Codex implementation should run:

- `npm.cmd run tool:content-lint`
- focused shared time tests if present
- new calendar/climate projection tests
- relevant static UI tests if a popup is rendered
- `git diff --check`

Do not run broad typecheck unless typecheck target policy has been cleaned up and the prompt explicitly asks for it.