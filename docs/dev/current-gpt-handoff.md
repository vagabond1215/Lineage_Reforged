# Current GPT Handoff

Source route: ChatGPT via GitHub Connector cleanup after `Version 0.5.85 - Creator Sidebar Layout And Backstory Gating`
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

- `Version 0.5.85 - Creator Sidebar Layout And Backstory Gating`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.86 - Combat Equipment Mapping Audit`

## Recent Results

Unified shell / creator:

- `0.5.84` added `docs/design/unified-shell-and-creator-refinement-plan.md`.
- `0.5.85` implemented the character-creation sidebar/layout refinement.
- Character creation now uses the launcher `AppShell` with `ShellBrandLogo`, a left sidebar summary, fixed-width step navigation, full-character randomization, and a total attribute matrix with contribution tooltips.
- The separate creator live-summary toggle and right summary column were removed.
- Backstory is locked/skipped only when no selectable backstories exist.
- Backstory remains required once at least one selectable backstory exists.
- No-selectable-backstory starts create no backstory package: no invented placeholder id, no backstory starter skills or abilities, no backstory flags, nullable `coreData.backstoryId`, and neutral session/chronicle copy.
- Full randomize preserves `saveSlotId`, clears `sourceRunId`, chooses valid existing ids, and selects a backstory only when one is selectable.
- Touch long-press tooltip behavior for the attribute breakdown remains deferred.
- Gameplay shell unification remains deferred.

Calendar / climate:

- `0.5.81` finalized the planning-only Calendar/Climate popup view-model plan.
- `0.5.82` implemented `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` and `tests/unit/calendar-climate-presentation.test.mjs`.
- `0.5.83` rendered the existing Calendar/Climate projection in a compact read-only top-status popup.
- No actions, command ids, content loading, generated output, climate profile resolver, weather simulation, or active climate/weather/travel/crop/body-state effects were added.

Economy and Chronicle:

- `0.5.79` implemented the pure economy clarity projection and focused tests.
- `0.5.80` fixed the focused economy runtime/trade validation failures that appeared after `0.5.79`.
- `0.5.77` rendered Chronicle run-end projection read-only inside Account Meta / Chronicles.
- Future economy and Chronicle UI work must stay read-only unless explicitly re-scoped.

Typecheck tooling:

- `0.5.74` made typecheck commands honest and repeatable.
- Default UI and broad workspace typecheck targets still fail on known pre-existing blockers.
- Do not require broad typecheck unless a prompt specifically fixes those blockers.

## Active Guardrails For 0.5.86

Combat Equipment Mapping Audit:

- Use `docs/design/combat-equipment-mapping-audit-plan.md` as the primary source.
- This should be audit-first.
- Inspect combat runtime/source owners, equipment/loadout owners, item content/type owners, stat/skill/attribute mapping, and current focused combat/equipment tests before editing.
- Produce or update audit tables and focused tests only if safe and within the audit boundary.
- Do not rewrite combat formulas.
- Do not add combat UI unless explicitly re-scoped.
- Do not add new equipment behavior, durability behavior, item-instance behavior, loot behavior, crafting behavior, economy behavior, save schema changes, generated output, active magic behavior, or broad balancing changes.
- Do not mix combat mapping audit with creator shell/sidebar, calendar/climate, economy clarity, Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, or bequest behavior.

Creator follow-up guardrails:

- Do not continue creator/sidebar polishing inside the combat audit unless a blocking regression from `0.5.85` prevents validation.
- Do not attempt gameplay shell unification in `0.5.86`.
- Do not add generated UI output.

Browser-safety guardrail:

- Do not import Node-only content loaders or unsafe engine barrels into browser-facing UI files.
- Keep app-side scans clean for `node:fs`, `readFileSync`, `load.*Content`, `civilization-engine/src/content`, `civilization-engine/src/index`, and unsafe `game-engine/src/index` imports if UI files are touched.

Cross-system guardrails:

- Do not infer `familyId` from `lineageId`, `sourceRunId`, account id, selected character, selected backstory, or UI state.
- Do not let Bloodlines, bequests, heirlooms, estates, or UI state directly grant backstory identity.

## Sequenced Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` for the full queue. Current near-term sequence:

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.85` | Creator Sidebar Layout And Backstory Gating | `docs/design/unified-shell-and-creator-refinement-plan.md` | Landed |
| 2 | `0.5.86` | Combat Equipment Mapping Audit | `docs/design/combat-equipment-mapping-audit-plan.md` | Next |
| 3 | `0.5.87` | Known Spell Ownership Plan | `docs/design/known-spell-ownership-plan.md` | Planned |

## Next Prompt Source Stack

For `Version 0.5.86 - Combat Equipment Mapping Audit`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/combat-equipment-mapping-audit-plan.md`
- `docs/design/combat-audit-scoping-pass.md` if present
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- combat runtime/source owners
- equipment/loadout/source owners
- item content and item type definitions
- stat/skill/attribute mappings relevant to combat and equipment
- current focused combat/equipment tests if present

## After 0.5.86

If the combat equipment mapping audit lands cleanly, return to the sequence file. The next run should be:

- `Version 0.5.87 - Known Spell Ownership Plan`

Keep it planning-only unless explicitly re-scoped.