# Current GPT Handoff

Source route: ChatGPT via GitHub Connector cleanup after `Version 0.5.81 - Calendar Climate Popup View Model Plan`
Date: 2026-05-25
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

- `Version 0.5.81 - Calendar Climate Popup View Model Plan`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.82 - Calendar Climate Read-Only Popup`

## Recent Results

Calendar / climate:

- `0.5.81` finalized the planning-only Calendar/Climate popup view-model plan from live repo inspection.
- The active source for the next implementation is `docs/design/calendar-climate-popup-view-model-plan.md`.
- The 0.5.82 recommendation is pure projection plus focused tests first.
- React popup wiring should stay deferred unless the next prompt explicitly broadens scope after accepting the projection boundary.
- The planned projection file is `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts`.
- The planned pure function is `buildCalendarClimatePopupViewModel(input)`.
- The projection should accept supplied `SimulationClock`, optional location labels, and optional explicit climate profile/source data.
- The projection must not load global content, infer climate from settlement/region ids, mutate input, or emit command/action ids.

Economy:

- `0.5.78` finalized the planning-only economy clarity data-owner map and label rules.
- `0.5.79` implemented the pure economy clarity projection and focused tests.
- `0.5.80` fixed the focused economy runtime/trade validation failures that appeared after `0.5.79`.
- The economy validation blocker is resolved.
- Future economy clarity UI must stay read-only and must not add buy/sell/dispatch/craft controls.

Chronicle:

- `0.5.75` finalized the planning-only Chronicle run-end summary data-owner map.
- `0.5.76` implemented the pure read-only Chronicle run-end summary projection and focused tests.
- `0.5.77` rendered that projection read-only inside Account Meta / Chronicles.
- The Chronicle source audit is consumed as active prompt authority.

Typecheck tooling:

- `0.5.74` made typecheck commands honest and repeatable.
- Default UI and broad workspace typecheck targets still fail on known pre-existing blockers.
- Do not require `npm.cmd run typecheck` unless a prompt specifically fixes those blockers.

## Active Guardrails For 0.5.82

Calendar/climate projection:

- `0.5.82` should implement pure projection plus focused tests first.
- Use `docs/design/calendar-climate-popup-view-model-plan.md` as the active source.
- Use `docs/design/calendar-climate-popup-ia-audit.md` only as supporting source-detail reference.
- Add `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts`.
- Add `tests/unit/calendar-climate-presentation.test.mjs`.
- Do not add React UI unless explicitly re-scoped.
- Do not load global content inside the projection.
- Do not infer climate from settlement or region ids inside the projection.
- Do not change clock progression, month-to-season mapping, climate profiles, calendar content, weather, travel, crop, body-state, economy, combat, save schema, generated output, or active-effect behavior.
- Do not add player actions, command ids, warning effects, penalties, buffs, travel changes, crop growth, weather randomization, or weather simulation.
- Use `clock.season` as the current runtime season.
- Show expected temperature bands only from supplied explicit climate profile data for the current runtime season.
- Missing clock/profile/profile season data should produce unavailable rows and warning notes, not inferred climate.
- Every view model must return `actionIds: []`.

Cross-system guardrails:

- Do not touch economy clarity, economy runtime, Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, or bequest behavior unless explicitly prompted.
- Do not infer `familyId` from `lineageId`, `sourceRunId`, account id, selected character, selected backstory, or UI state.

## Sequenced Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` for the full queue. Current near-term sequence:

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.81` | Calendar Climate Popup View Model Plan | `docs/design/calendar-climate-popup-view-model-plan.md` | Landed |
| 2 | `0.5.82` | Calendar Climate Read-Only Popup | `docs/design/calendar-climate-popup-view-model-plan.md` | Next |
| 3 | `0.5.83` | Combat Equipment Mapping Audit | `docs/design/combat-equipment-mapping-audit-plan.md` | Planned |
| 4 | `0.5.84` | Known Spell Ownership Plan | `docs/design/known-spell-ownership-plan.md` | Planned |

## Next Prompt Source Stack

For `Version 0.5.82 - Calendar Climate Read-Only Popup`, inspect:

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
- `apps/rpg-ui/src/runtime/uiViewModel.ts`
- `apps/rpg-ui/src/components/TopStatusBar.tsx`
- existing presentation helper tests/patterns

## After 0.5.82

If the pure projection lands cleanly, return to the sequence file. The next run should be:

- `Version 0.5.83 - Combat Equipment Mapping Audit`

If the user wants React popup wiring immediately after the projection, insert a narrow `Calendar Climate Read-Only Popup UI` pass before combat audit.