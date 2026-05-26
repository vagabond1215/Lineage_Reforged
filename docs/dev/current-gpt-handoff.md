# Current GPT Handoff

Source route: Codex Local docs-only planning after `Version 0.5.84 - Unified Shell And Creator Refinement Plan`
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

- `Version 0.5.84 - Unified Shell And Creator Refinement Plan`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.85 - Creator Sidebar Layout And Backstory Gating`

## Recent Results

Calendar / climate:

- `0.5.81` finalized the planning-only Calendar/Climate popup view-model plan.
- `0.5.82` implemented `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` and `tests/unit/calendar-climate-presentation.test.mjs`.
- `0.5.83` rendered the existing Calendar/Climate projection in a compact read-only top-status popup.
- No actions, command ids, content loading, generated output, climate profile resolver, weather simulation, or active climate/weather/travel/crop/body-state effects were added.

Unified shell / creator:

- `0.5.84` added `docs/design/unified-shell-and-creator-refinement-plan.md`.
- The plan inserts a creator/main-shell refinement track before returning to combat audit.
- It scopes the first implementation to character creation sidebar/layout, backstory gating, full randomization, and stat preview cleanup.
- It keeps gameplay shell unification deferred unless the creator pass proves a tiny shared shell extraction is safe.

Economy and Chronicle:

- `0.5.79` implemented the pure economy clarity projection and focused tests.
- `0.5.80` fixed the focused economy runtime/trade validation failures that appeared after `0.5.79`.
- `0.5.77` rendered Chronicle run-end projection read-only inside Account Meta / Chronicles.
- Future economy and Chronicle UI work must stay read-only unless explicitly re-scoped.

Typecheck tooling:

- `0.5.74` made typecheck commands honest and repeatable.
- Default UI and broad workspace typecheck targets still fail on known pre-existing blockers.
- Do not require broad typecheck unless a prompt specifically fixes those blockers.

## Active Guardrails For 0.5.85

Creator Sidebar Layout And Backstory Gating:

- Use `docs/design/unified-shell-and-creator-refinement-plan.md` as the primary source.
- This is an implementation pass for character creation only.
- Prefer adapting the creator to current `AppShell`/left-sidebar conventions before extracting a universal shell.
- Move the current right summary into the left sidebar.
- Remove the separate summary toggle/right summary column.
- Add a sidebar full-character randomize control through a pure helper.
- Keep page-specific randomizers scoped to their existing page/field behavior.
- Make step indicators fixed-width and theme-consistent.
- Lock and skip backstory only when no selectable/unlocked backstory exists.
- Keep backstory required once at least one selectable backstory exists.
- Do not select locked/special/deferred backstories.
- Make the visible stat preview one total attribute matrix; move source breakdown into tooltip/popover content.
- Add focused tests for validation/navigation, randomization, and attribute preview.

Do not in `0.5.85`:

- Do not change gameplay shell layout.
- Do not add generated UI output.
- Do not add backstory content ids.
- Do not add backstory purchase UI.
- Do not add family/source-run/scoped Backstory evidence.
- Do not change stat math beyond presentation/preview shape.
- Do not add save compatibility or migration behavior.
- Do not proceed to combat audit inside the creator refinement pass.

Browser-safety guardrail:

- Do not import Node-only content loaders or unsafe engine barrels into browser-facing UI files.
- Keep app-side scans clean for `node:fs`, `readFileSync`, `load.*Content`, `civilization-engine/src/content`, `civilization-engine/src/index`, and unsafe `game-engine/src/index` imports.

Cross-system guardrails:

- Do not infer `familyId` from `lineageId`, `sourceRunId`, account id, selected character, selected backstory, or UI state.
- Do not let Bloodlines, bequests, heirlooms, estates, or UI state directly grant backstory identity.

## Sequenced Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` for the full queue. Current near-term sequence:

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.84` | Unified Shell And Creator Refinement Plan | `docs/design/unified-shell-and-creator-refinement-plan.md` | Landed |
| 2 | `0.5.85` | Creator Sidebar Layout And Backstory Gating | `docs/design/unified-shell-and-creator-refinement-plan.md` | Next |
| 3 | `0.5.86` | Combat Equipment Mapping Audit | `docs/design/combat-equipment-mapping-audit-plan.md` | Planned |
| 4 | `0.5.87` | Known Spell Ownership Plan | `docs/design/known-spell-ownership-plan.md` | Planned |

## Next Prompt Source Stack

For `Version 0.5.85 - Creator Sidebar Layout And Backstory Gating`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/unified-shell-and-creator-refinement-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `apps/rpg-ui/src/game-shell/components/AppShell.tsx`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationMath.ts`
- `apps/rpg-ui/src/game-shell/characterAttributes.ts`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- current creator/backstory/start-resource/profile tests

## After 0.5.85

If the creator sidebar/layout and backstory gating pass lands cleanly, return to the sequence file. The next run should be:

- `Version 0.5.86 - Combat Equipment Mapping Audit`

Keep it audit-first unless explicitly re-scoped.
