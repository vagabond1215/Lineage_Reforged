# Codex Sequenced Implementation Plan

Date: 2026-05-26
Route: ChatGPT via GitHub Connector
Status: connector-authored sequencing plan for future Codex runs

## Purpose

This file gives Codex a stable ordered queue after `Version 0.5.83 - Calendar Climate Read-Only Popup UI` rendered the existing Calendar/Climate projection in a narrow read-only top-status popup.

It does not replace:

- `docs/dev/current-codex-output.md` for exact latest Codex state
- `docs/dev/current-gpt-handoff.md` for immediate prompt guardrails
- `docs/dev/project-roadmap.md` for version-band meaning and pipeline status
- focused `docs/design/*` files for detailed implementation constraints

Use this file as the ordered table of what to implement or plan next, then inspect the focused source document for the active version.

## Current Anchor

Latest landed calendar/climate UI slice:

- `Version 0.5.83 - Calendar Climate Read-Only Popup UI`

Immediate next Codex run:

- `Version 0.5.84 - Combat Equipment Mapping Audit`

## Ordered Trajectory

| Order | Version | Topic | Route | Primary Source | Output Type | Status | Guardrail |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | `0.5.79` | Economy Price Clarity Pure Projection | Codex 5.5 Local | `docs/design/economy-price-clarity-view-model-plan.md` | pure view-model + tests | Landed | No resolver calls, commands, UI, or simulation changes. |
| 2 | `0.5.80` | Economy Runtime Test Failure Triage | Codex 5.5 Local | `docs/dev/economy-runtime-test-failure-triage-plan.md` | focused runtime/test fix | Landed | Restored economy runtime/trade validation; no broad expansion. |
| 3 | `0.5.81` | Calendar Climate Popup View Model Plan | Codex 5.5 Local docs-only | `docs/design/calendar-climate-popup-view-model-plan.md` | planning doc | Landed | Planned pure projection boundary only. |
| 4 | `0.5.82` | Calendar Climate Read-Only Popup | Codex 5.5 Local | `docs/design/calendar-climate-popup-view-model-plan.md` | pure projection + tests | Landed | Projection only; no React UI or active effects. |
| 5 | `0.5.83` | Calendar Climate Read-Only Popup UI | Codex 5.5 Local | `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` | read-only UI | Landed | Rendered projection only; no commands, active effects, content loading, or generated output. |
| 6 | `0.5.84` | Combat Equipment Mapping Audit | Codex 5.5 Local or connector-first if prompt prep is needed | `docs/design/combat-equipment-mapping-audit-plan.md` | audit tables/tests if safe | Next | Audit mapping before math; no combat formula rewrites. |
| 7 | `0.5.85` | Known Spell Ownership Plan | Codex 5.5 Plan Mode or Codex Local docs-only | `docs/design/known-spell-ownership-plan.md` | planning doc | Planned | Define ownership/acquisition before runtime casting; no spell execution. |

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
- Do not mix calendar/climate UI with weather, travel, crop, body-state, clock, economy, or active-effect behavior.
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