# Codex Sequenced Implementation Plan

Date: 2026-06-03
Route: Codex local sequencing alignment after `Version 0.5.96 - Known Spell Acquisition Event Planning`
Status: locally aligned sequencing plan for future Codex runs

## Purpose

This file gives Codex a stable ordered queue after `Version 0.5.96 - Known Spell Acquisition Event Planning` added the planning-only training-event acquisition boundary.

It does not replace:

- `docs/dev/current-codex-output.md` for exact latest Codex state
- `docs/dev/current-gpt-handoff.md` for immediate prompt guardrails
- `docs/dev/project-roadmap.md` for version-band meaning and pipeline status
- focused `docs/design/*` files for detailed implementation constraints

Use this file as the ordered table of what to implement or plan next, then inspect the focused source document for the active version.

## Current Anchor

Latest landed known-spell acquisition slice:

- `Version 0.5.96 - Known Spell Acquisition Event Planning`

Immediate next Codex run:

- `Version 0.5.97 - Training Event Acquisition Helpers`

## Ordered Trajectory

| Order | Version | Topic | Route | Primary Source | Output Type | Status | Guardrail |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | `0.5.79` | Economy Price Clarity Pure Projection | Codex 5.5 Local | `docs/design/economy-price-clarity-view-model-plan.md` | pure view-model + tests | Landed | No resolver calls, commands, UI, or simulation changes. |
| 2 | `0.5.80` | Economy Runtime Test Failure Triage | Codex 5.5 Local | `docs/dev/economy-runtime-test-failure-triage-plan.md` | focused runtime/test fix | Landed | Restored economy runtime/trade validation; no broad expansion. |
| 3 | `0.5.81` | Calendar Climate Popup View Model Plan | Codex 5.5 Local docs-only | `docs/design/calendar-climate-popup-view-model-plan.md` | planning doc | Landed | Planned pure projection boundary only. |
| 4 | `0.5.82` | Calendar Climate Read-Only Popup | Codex 5.5 Local | `docs/design/calendar-climate-popup-view-model-plan.md` | pure projection + tests | Landed | Projection only; no React UI or active effects. |
| 5 | `0.5.83` | Calendar Climate Read-Only Popup UI | Codex 5.5 Local | `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` | read-only UI | Landed | Rendered projection only; no commands, active effects, content loading, or generated output. |
| 6 | `0.5.84` | Unified Shell And Creator Refinement Plan | Codex 5.5 Local docs-only | `docs/design/unified-shell-and-creator-refinement-plan.md` | planning doc | Landed | Planned creator shell/sidebar, backstory gating, full randomization, and stat preview cleanup only. |
| 7 | `0.5.85` | Creator Sidebar Layout And Backstory Gating | Codex 5.5 Local | `docs/design/unified-shell-and-creator-refinement-plan.md` | focused creator UI/form helpers + tests | Landed | Character creation only; no gameplay shell unification, generated output, or combat work. |
| 8 | `0.5.86` | Combat Equipment Mapping Audit | Codex 5.5 Local | `docs/design/combat-equipment-mapping-audit-plan.md` | audit tables + focused tests | Landed | Audit only; no combat formula rewrites or content behavior changes. |
| 9 | `0.5.87` | Combat Equipment Mapping Follow-Up | Codex 5.5 Local | `docs/design/combat-equipment-mapping-audit-plan.md` | narrow content/test fix | Landed | Added short-bow combat profile only; no formulas, ammo, balance, UI, or broad equipment policy. |
| 10 | `0.5.88` | Known Spell Ownership Plan | Codex 5.5 Local docs-only | `docs/design/known-spell-ownership-plan.md` | planning doc | Landed | Planned ownership/acquisition before runtime casting; no spell execution. |
| 11 | `0.5.89` | Known Spell Ownership Helpers | Codex 5.5 Local | `docs/design/known-spell-ownership-plan.md` | pure helpers + focused tests | Landed | Character-scoped known-spell helper boundary only; no casting, UI, save schema migration, catalyst behavior, or Legacy power. |
| 12 | `0.5.90` | Known Spell Validation Helpers | Codex 5.5 Local | `docs/dev/current-codex-output.md` | pure validation helpers + focused tests | Landed | Collection validation, duplicate id checks, and training-event evidence validation only; no casting, UI, save schema migration, or broader ownership scopes. |
| 13 | `0.5.91` | Known Spell Acquisition Evidence Helpers | Codex 5.5 Local | `docs/dev/current-codex-output.md` | pure acquisition evidence helpers + focused tests | Landed | Training-event evidence helper boundaries only; no acquisition mutation, casting, UI, save schema migration, or broader routes/scopes. |
| 14 | `0.5.92` | Known Spell Read-Only Projection | Codex 5.5 Local | `docs/dev/current-codex-output.md` | pure projection + focused tests | Landed | Read-only projection only; no acquisition mutation, casting, UI, save schema migration, or broader routes/scopes. |
| 15 | `0.5.93` | Magic Runtime Readiness Blocker Tests | Codex 5.5 Local | `docs/dev/current-codex-output.md` | focused blocker tests | Landed | Test/scaffold blocker boundaries only; no runtime casting, commands, UI, save schema migration, or broader routes/scopes. |
| 16 | `0.5.94` | Magic Runtime Boundary Plan | Codex 5.5 Local docs-only | `docs/design/magic-runtime-boundary-plan.md` | planning doc | Landed | Defined cast-readiness boundary only; no runtime casting, commands, UI, JSON, schema, save/account, catalyst consumption, or broader routes/scopes. |
| 17 | `0.5.95` | Magic Cast Readiness Helper | Codex 5.5 Local | `docs/design/magic-runtime-boundary-plan.md` | pure helper + focused tests | Landed | Read-only deterministic helper only; no effect application, resource payment, catalyst consumption, acquisition creation, combat events, or save mutation. |
| 18 | `0.5.96` | Known Spell Acquisition Event Planning | Codex 5.5 Local docs-only | `docs/design/known-spell-acquisition-event-plan.md` | planning doc | Landed | Planned training-event acquisition ownership only; no acquisition mutation, active casting, commands, UI, broader routes/scopes, or save/account changes. |
| 19 | `0.5.97` | Training Event Acquisition Helpers | Codex 5.5 Local | `docs/design/known-spell-acquisition-event-plan.md` | pure helper + focused tests | Next | Produce proposed character-scoped known-spell records from explicit training-event evidence only; no save/session mutation, persisted acquisition events, active casting, commands, UI, or broader routes/scopes. |

## Default Prompt Pattern

Each future Codex prompt should:

1. Read `AGENTS.md`, `README.md`, `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`, and this sequence file first.
2. Read the active version's primary source plan or source file.
3. Keep the patch narrow and owner-aware.
4. Update `docs/dev/current-codex-output.md` at the end.
5. Update `docs/future_content_backlog.md` with a concise run note when useful.
6. Avoid updating direction-bearing docs unless a handoff would become misleading.

## Sequence Guardrails

- Do not skip directly from planning/audit to broad runtime rewrites.
- Do not mix tooling cleanup with gameplay features.
- Do not mix creator shell/sidebar refinement with combat, calendar/climate, economy, Chronicle, Bloodlines, Legacy, Family Prestige, heirloom, estate, or bequest work.
- Do not extract a universal shell before a later dedicated shell pass scopes it.
- Do not add generated UI output during cast-readiness helper work.
- Do not import Node-only content loaders or engine barrels into browser-facing UI files.
- Do not mix cast-readiness helper work with combat math rewrites, active spell execution, ammo behavior, ranged balancing, broad equipment slot metadata, shield/armor training, hybrid/improvised weapon policy, or UI implementation.
- Do not begin runtime magic until known-spell ownership helpers, validation, acquisition evidence helpers, read-only projection, conduit/catalyst/control policy, blocked-hook tests, and a pure cast-readiness helper are explicitly implemented in narrow slices.

## When To Reorder

Reorder only if:

- a newer `docs/dev/current-codex-output.md` explicitly changes direction;
- a blocking validation/tooling issue prevents the next step;
- the user explicitly chooses a different target;
- a connector/Codex inspection finds the source plan stale or unsafe.

If reordered, update this file and `docs/dev/project-roadmap.md` together.
