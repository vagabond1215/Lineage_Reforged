# Current GPT Handoff

Source route: ChatGPT via GitHub Connector cleanup after `Version 0.5.82 - Calendar Climate Read-Only Popup`
Date: 2026-05-26
Branch/status assumption: `master`; use `docs/dev/current-codex-output.md` for the exact latest Codex run state.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records only current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/current-gpt-handoff.md` is the immediate prompt-prep handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the current sequenced Codex queue.
- `docs/design/future-system-design-ledger.md` owns durable system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.82 - Calendar Climate Read-Only Popup`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.83 - Calendar Climate Read-Only Popup UI`

## Recent Results

Calendar / climate:

- `0.5.81` finalized the planning-only Calendar/Climate popup view-model plan from live repo inspection.
- `0.5.82` implemented `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` and `tests/unit/calendar-climate-presentation.test.mjs`.
- The 0.5.82 projection is pure, synchronous, supplied-data-only, read-only, and always returns `actionIds: []`.
- The projection accepts supplied `SimulationClock`, optional location labels, and optional explicit climate profile/source data.
- The projection does not load global content, infer climate from settlement/region ids, mutate input, or emit command/action ids.
- A browser loading error was fixed by replacing the app import of `game-engine/src/index.js` with targeted browser-safe game-engine module imports in `characterCreationCatalog.ts`.
- Browser-facing app scans were clean for `node:fs`, `readFileSync`, content-loader paths, and engine barrel imports after the fix.

Economy and Chronicle:

- `0.5.79` implemented the pure economy clarity projection and focused tests.
- `0.5.80` fixed the focused economy runtime/trade validation failures that appeared after `0.5.79`.
- `0.5.77` rendered Chronicle run-end projection read-only inside Account Meta / Chronicles.
- Future economy and Chronicle UI work must stay read-only unless explicitly re-scoped.

Typecheck tooling:

- `0.5.74` made typecheck commands honest and repeatable.
- Default UI and broad workspace typecheck targets still fail on known pre-existing blockers.
- Do not require broad typecheck unless a prompt specifically fixes those blockers.

## Active Guardrails For 0.5.83

Calendar/climate UI:

- `0.5.83` is an inserted narrow UI pass before combat audit.
- Render the existing `buildCalendarClimatePopupViewModel(input)` output in a read-only Calendar/Climate popup or overlay.
- Prefer attaching it to the existing top status bar date/season/time area in `apps/rpg-ui/src/components/TopStatusBar.tsx` if current component ownership supports it.
- Reuse existing overlay/popover patterns from `TopStatusBar.tsx`; do not create a broad UI shell redesign.
- Do not add new projection behavior unless a tiny display-only shape adjustment is required and covered by existing/focused tests.
- Do not load global content or import Node-only content loaders into browser code.
- Do not import `packages/engines/*/src/index.js` barrels into browser-facing app files if that pulls Node-only modules.
- Do not add player actions, command ids, travel warnings, freezing-risk warnings, crop warnings, penalties, buffs, weather randomization, weather simulation, route changes, body-state changes, crop behavior, economy behavior, combat behavior, save schema changes, or generated output.
- UI copy must keep climate/weather clearly informational-only.
- Keep `actionIds: []` and do not render action buttons.

Cross-system guardrails:

- Do not touch economy clarity, economy runtime, Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, or bequest behavior unless explicitly prompted.
- Do not infer `familyId` from `lineageId`, `sourceRunId`, account id, selected character, selected backstory, or UI state.

## Sequenced Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` for the full queue. Current near-term sequence:

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.82` | Calendar Climate Read-Only Popup | `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` | Landed |
| 2 | `0.5.83` | Calendar Climate Read-Only Popup UI | `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` | Next |
| 3 | `0.5.84` | Combat Equipment Mapping Audit | `docs/design/combat-equipment-mapping-audit-plan.md` | Planned |
| 4 | `0.5.85` | Known Spell Ownership Plan | `docs/design/known-spell-ownership-plan.md` | Planned |

## Next Prompt Source Stack

For `Version 0.5.83 - Calendar Climate Read-Only Popup UI`, inspect:

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
- `apps/rpg-ui/src/components/TopStatusBar.tsx`
- `apps/rpg-ui/src/runtime/uiViewModel.ts`
- `apps/rpg-ui/src/runtime/demoSnapshot.ts`
- relevant narrow UI/component test patterns if present

## After 0.5.83

If the read-only Calendar/Climate UI pass lands cleanly, return to the sequence file. The next run should be:

- `Version 0.5.84 - Combat Equipment Mapping Audit`

Keep it audit-first and do not rewrite combat math unless explicitly re-scoped.