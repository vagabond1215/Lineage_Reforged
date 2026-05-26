# Codex Sequenced Implementation Plan

Date: 2026-05-26
Route: ChatGPT via GitHub Connector cleanup
Status: connector-updated sequencing plan for future Codex runs

## Purpose

This file gives Codex a stable ordered queue after `Version 0.5.85 - Creator Sidebar Layout And Backstory Gating` implemented the creator sidebar/layout, backstory gating, full randomization, and attribute preview refinement.

It does not replace:

- `docs/dev/current-codex-output.md` for exact latest Codex state
- `docs/dev/current-gpt-handoff.md` for immediate prompt guardrails
- `docs/dev/project-roadmap.md` for version-band meaning and pipeline status
- focused `docs/design/*` files for detailed implementation constraints

Use this file as the ordered table of what to implement or plan next, then inspect the focused source document for the active version.

## Current Anchor

Latest landed creator slice:

- `Version 0.5.85 - Creator Sidebar Layout And Backstory Gating`

Immediate next Codex run:

- `Version 0.5.86 - Combat Equipment Mapping Audit`

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
| 8 | `0.5.86` | Combat Equipment Mapping Audit | Codex 5.5 Local or connector-first if prompt prep is needed | `docs/design/combat-equipment-mapping-audit-plan.md` | audit tables/tests if safe | Next | Audit mapping before math; no combat formula rewrites. |
| 9 | `0.5.87` | Known Spell Ownership Plan | Codex 5.5 Plan Mode or Codex Local docs-only | `docs/design/known-spell-ownership-plan.md` | planning doc | Planned | Define ownership/acquisition before runtime casting; no spell execution. |

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
- Do not continue creator polishing inside the combat audit unless a blocking regression prevents validation.
- Do not extract a universal shell before a later dedicated shell pass scopes it.
- Do not add generated UI output during combat audit.
- Do not import Node-only content loaders or engine barrels into browser-facing UI files.
- Do not mix combat mapping audit with combat math rewrites.
- Do not begin runtime magic until known-spell ownership and acquisition are explicitly planned.

## When To Reorder

Reorder only if:

- a newer `docs/dev/current-codex-output.md` explicitly changes direction;
- a blocking validation/tooling issue prevents the next step;
- the user explicitly chooses a different target;
- a connector/Codex inspection finds the source plan stale or unsafe.

If reordered, update this file and `docs/dev/project-roadmap.md` together.