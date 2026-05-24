# Codex Sequenced Implementation Plan

Date: 2026-05-24
Route: ChatGPT via GitHub Connector
Status: connector-authored sequencing plan for future Codex runs

## Purpose

This file gives Codex a stable ordered queue after `Version 0.5.76 - Chronicle Run-End Summary Pure Projection`.

It does not replace:

- `docs/dev/current-codex-output.md` for exact latest Codex state
- `docs/dev/current-gpt-handoff.md` for immediate prompt guardrails
- `docs/dev/project-roadmap.md` for version-band meaning and pipeline status
- focused `docs/design/*` plans for detailed implementation constraints

Use this file as the ordered table of what to implement or plan next, then inspect the focused source document for the active version.

## Current Anchor

Latest landed feature slice:

- `Version 0.5.72 - Bloodlines Read-Only Account Meta UI`

Latest cleanup/tooling slice:

- `Version 0.5.74 - Typecheck Script And Target Policy Cleanup`

Latest Chronicle slice:

- `Version 0.5.76 - Chronicle Run-End Summary Pure Projection`

Immediate next Codex run:

- `Version 0.5.77 - Chronicle Run-End Read-Only UI`

## Ordered 10-Step Trajectory

| Order | Version | Topic | Route | Primary Source | Output Type | Status | Guardrail |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | `0.5.74` | Typecheck Script And Target Policy Cleanup | Codex 5.5 Local | `docs/dev/typecheck-blocker-triage-plan.md` | tooling/config cleanup | Landed | Make targets honest and repeatable; do not weaken strictness or touch gameplay. |
| 2 | `0.5.75` | Chronicle Run-End Summary View Model Plan | Codex 5.5 Local docs-only | `docs/design/chronicle-run-end-summary-view-model-plan.md` | planning doc | Landed | Planned data-owner map and projection; no lifecycle, payout, estate, or UI behavior. |
| 3 | `0.5.76` | Chronicle Run-End Summary Pure Projection | Codex 5.5 Local | `docs/design/chronicle-run-end-summary-view-model-plan.md` | pure view-model + tests | Landed | Read stored/lifecycle result data only; do not recompute payout. |
| 4 | `0.5.77` | Chronicle Run-End Read-Only UI | Codex 5.5 Local | `docs/design/chronicle-run-end-summary-view-model-plan.md` | read-only UI | Next | Render the tested projection read-only; no payout mutation, estate delivery, Chronicle Marks, Lineage Seals, or Family Prestige grants. |
| 5 | `0.5.78` | Economy Price Clarity View Model Plan | Codex 5.5 Plan Mode or Codex Local docs-only | `docs/design/economy-price-clarity-view-model-plan.md` | planning doc | Planned | Explain existing prices/scarcity only; no economy math changes. |
| 6 | `0.5.79` | Economy Price Clarity Pure Projection | Codex 5.5 Local | `docs/design/economy-price-clarity-view-model-plan.md` | pure view-model + tests | Planned | Derive labels from existing state; no trade commands or simulation changes. |
| 7 | `0.5.80` | Calendar Climate Popup View Model Plan | Codex 5.5 Plan Mode or Codex Local docs-only | `docs/design/calendar-climate-popup-view-model-plan.md` | planning doc | Planned | Informational only; no weather, travel, body-state, crop, or clock changes. |
| 8 | `0.5.81` | Calendar Climate Read-Only Popup | Codex 5.5 Local | `docs/design/calendar-climate-popup-view-model-plan.md` | read-only projection/UI | Planned | Render current time/season/climate context only; no active effects. |
| 9 | `0.5.82` | Combat Equipment Mapping Audit | Codex 5.5 Local, or GitHub Connector first if prompt prep is needed | `docs/design/combat-equipment-mapping-audit-plan.md` | audit tables/tests if safe | Planned | Audit mapping before math; no combat formula rewrites. |
| 10 | `0.5.83` | Known Spell Ownership Plan | Codex 5.5 Plan Mode or Codex Local docs-only | `docs/design/known-spell-ownership-plan.md` | planning doc | Planned | Define ownership/acquisition before runtime casting; no spell execution. |

## Default Prompt Pattern

Each future Codex prompt should:

1. Read `AGENTS.md`, `README.md`, `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`, and this sequence file first.
2. Read the active version's primary source plan.
3. Keep the patch narrow and owner-aware.
4. Update `docs/dev/current-codex-output.md` at the end.
5. Update `docs/future_content_backlog.md` with a concise run note when useful.
6. Avoid updating direction-bearing docs unless a handoff would become misleading.

## Sequence Guardrails

- Do not skip directly from planning to mutating runtime behavior.
- Do not mix tooling cleanup with gameplay features.
- Do not mix Chronicle summary work with Chronicle Marks, Lineage Seals, estate delivery, or Family Prestige grants.
- Do not mix economy clarity with economy simulation changes.
- Do not mix calendar/climate UI with weather, travel, crop, body-state, or clock behavior.
- Do not mix combat mapping audit with combat math rewrites.
- Do not begin runtime magic until known-spell ownership and acquisition are explicitly planned.

## When To Reorder

Reorder only if:

- a newer `docs/dev/current-codex-output.md` explicitly changes direction;
- a blocking validation/tooling issue prevents the next step;
- the user explicitly chooses a different target;
- a connector/Codex inspection finds the source plan stale or unsafe.

If reordered, update this file and `docs/dev/project-roadmap.md` together.