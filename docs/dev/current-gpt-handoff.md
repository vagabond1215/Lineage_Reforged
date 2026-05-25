# Current GPT Handoff

Source route: ChatGPT via GitHub Connector cleanup after `Version 0.5.80 - Economy Runtime Test Failure Triage`
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

- `Version 0.5.80 - Economy Runtime Test Failure Triage`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

- `Version 0.5.81 - Calendar Climate Popup View Model Plan`

## Recent Results

Economy runtime validation:

- `0.5.80` fixed the focused economy runtime/trade validation failures that appeared after `0.5.79`.
- Craft fixture tests now use the canonical authored cooking skill id `skill.crafting.cooking`.
- Autonomous trade protected reserve math now operates in current stock snapshot units.
- Autonomous trade destination need, absorption, and strategic necessity now use the same family-aware demand reference.
- The focused economy runtime, trade runtime, economy clarity projection, civilization consistency, content lint, and diff checks passed in `0.5.80`.
- `docs/dev/economy-runtime-test-failure-triage-plan.md` is consumed as active implementation guidance. Keep only as historical reference unless a cleanup deletes or folds it later.

Economy clarity:

- `0.5.78` finalized the planning-only economy clarity data-owner map and label rules.
- `0.5.79` implemented the pure economy clarity projection and focused tests.
- The new projection is source-only; no React UI consumes it yet.
- Future economy clarity UI must stay read-only and must not add buy/sell/dispatch/craft controls.

Chronicle run-end summary:

- `0.5.75` finalized the planning-only Chronicle run-end summary data-owner map.
- `0.5.76` implemented the pure read-only Chronicle run-end summary projection and focused tests.
- `0.5.77` rendered that projection read-only inside Account Meta / Chronicles.
- The Chronicle source audit is consumed as active prompt authority.

Typecheck tooling:

- `0.5.74` made typecheck commands honest and repeatable.
- Default UI and broad workspace typecheck targets still fail on known pre-existing blockers.
- Do not require `npm.cmd run typecheck` unless a prompt specifically fixes those blockers.

## Active Guardrails For 0.5.81

Calendar/climate planning:

- `0.5.81` should be planning-only.
- Use `docs/design/calendar-climate-popup-view-model-plan.md` and `docs/design/calendar-climate-popup-ia-audit.md` as the active source stack.
- Inspect current repo reality before writing or updating the plan.
- Define the future data-owner map, view-model boundary, input/output shape, missing-data behavior, and test plan for a later read-only Calendar/Climate popup.
- Do not implement React UI.
- Do not implement a calendar/climate projection yet unless explicitly re-scoped.
- Do not change weather, travel, crop, body-state, clock, economy, combat, magic, settlement simulation, save schema, generated output, or active-effect behavior.
- Do not add player actions, command ids, warning effects, penalties, buffs, travel changes, crop growth, or weather simulation.

Economy:

- The 0.5.80 runtime validation blocker is resolved.
- Do not expand economy clarity into UI, shop, trade commands, caravan controls, crafting execution, passive income, contacts, market privileges, or Legacy effects without a dedicated prompt.
- Keep the 0.5.79 economy clarity projection pure and read-only.

Cross-system guardrails:

- Do not touch Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, or bequest behavior unless explicitly prompted.
- Do not infer `familyId` from `lineageId`, `sourceRunId`, account id, selected character, selected backstory, or UI state.
- Future Backstory Legacy records must describe formative-past access, not current employment, current social identity, family history proof, institution membership, title/status ownership, contacts, items, coin, skills, magic, authority, or live obligations.

## Sequenced Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` for the full queue. Current near-term sequence:

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.80` | Economy Runtime Test Failure Triage | `docs/dev/economy-runtime-test-failure-triage-plan.md` | Landed |
| 2 | `0.5.81` | Calendar Climate Popup View Model Plan | `docs/design/calendar-climate-popup-view-model-plan.md` | Next |
| 3 | `0.5.82` | Calendar Climate Read-Only Popup | `docs/design/calendar-climate-popup-view-model-plan.md` | Planned |
| 4 | `0.5.83` | Combat Equipment Mapping Audit | `docs/design/combat-equipment-mapping-audit-plan.md` | Planned |
| 5 | `0.5.84` | Known Spell Ownership Plan | `docs/design/known-spell-ownership-plan.md` | Planned |

## Next Prompt Source Stack

For `Version 0.5.81 - Calendar Climate Popup View Model Plan`, inspect:

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
- shared time/calendar types and helpers
- existing UI presentation helper patterns
- any existing climate, calendar, season, settlement, travel, or start-condition source owners relevant to display-only planning

## After 0.5.81

If the planning pass lands cleanly, return to the sequence file. The next run should be:

- `Version 0.5.82 - Calendar Climate Read-Only Popup`

Keep it read-only and informational unless explicitly re-scoped.