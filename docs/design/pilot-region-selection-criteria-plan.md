# Pilot Region Selection Criteria Plan

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future pilot-region settlement expansion; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Define how to choose the first region for a narrow future settlement/population-center expansion pass after map/grid/distance, placement heuristics, content-shape rules, and target-gap reporting are planned.

This document is a planning source. It does not authorize settlement creation, content JSON edits, generated reports, or runtime behavior.

## Source Basis

Primary connector prep sources:

- `docs/design/map-grid-distance-source-map.md`
- `docs/design/regional-population-center-expansion-audit.md`
- `docs/design/settlement-placement-heuristics-plan.md`
- `docs/design/settlement-expansion-content-shape-plan.md`
- `docs/design/settlement-target-gap-report-plan.md`
- `docs/design/travel-knowledge-route-source-map.md`
- `docs/design/economy-command-surface-source-map.md`

Primary code/content shape sources:

- `packages/engines/civilization-engine/src/content.ts`
- `packages/engines/civilization-engine/src/spatial-world.ts`

## Core Boundary Rule

Selecting a pilot region is not expanding that region.

A region may be a good candidate because it has clear target-count gaps, strong locality/hex placement data, route context, and low ambiguity, but selection criteria must not add settlements, modify targets, create routes, assign map markers, or rebalance economy/population.

## Pilot Region Selection Goals

The first settlement expansion pilot should maximize learning while minimizing systemic risk.

Preferred pilot qualities:

- clear existing region identity
- existing region population and settlement distribution metadata
- enough localities to support placement decisions
- enough hex anchors to validate placement
- existing settlements for style/field convention examples
- clear target-count gaps
- manageable number of proposed new records
- low dependency on route recalculation
- low dependency on map UI pixel placement
- low dependency on economy/runtime mutation

## Selection Criteria

| Criterion | Prefer | Avoid for first pilot |
| --- | --- | --- |
| Region type | subregion or contained island system | entire continent/ocean-scale regions |
| Target counts | present and plausible | missing/ambiguous targets |
| Current settlements | some existing examples, but clear gaps | zero examples or already saturated regions |
| Locality coverage | multiple localities with suitability/resource/route fields | sparse or inconsistent locality coverage |
| Hex anchors | valid region/locality hexes with varied habitability | unclear/contested anchors |
| Route dependency | existing route context but no required recalculation | regions requiring broad route network redesign |
| Economy dependency | clear resource/market roles | regions requiring economy rebalance first |
| Narrative ambiguity | low; roles can be inferred from content fields | heavily story-dependent regions |
| UI dependency | no need for immediate visual map ref | regions requiring precise map marker placement |
| Scope size | 2-6 draft additions | very large settlement batches |

## Pilot Region Readiness Score

Future source audits can score each candidate region using a simple planning rubric.

| Signal | Score guidance |
| --- | --- |
| target counts present | +2 if present and complete, +1 if partial, 0 if absent |
| existing settlements present | +2 if enough examples, +1 if sparse, 0 if none |
| clear target gaps | +2 if gaps are obvious, +1 if ambiguous, 0 if saturated |
| locality coverage | +2 if strong, +1 if partial, 0 if weak |
| hex anchor coverage | +2 if strong, +1 if partial, 0 if weak |
| route context | +2 if sufficient, +1 if future-facing, 0 if missing/needs redesign |
| economy/resource context | +2 if coherent, +1 if partial, 0 if unclear |
| low runtime dependency | +2 if content-only feasible, +1 if minor follow-up needed, 0 if blocked |
| manageable batch size | +2 if 2-6 additions, +1 if 7-10, 0 if larger |

Recommended first-pilot threshold:

- 13+ points and no hard blockers.

## Hard Blockers

Do not select a pilot region if it requires any of these first:

- schema expansion
- generated content pipeline changes
- spatial-world runtime changes
- map scale constant changes
- route recalculation
- economy mutation
- UI marker placement
- save/session/travel state
- Chronicle/Renown output
- knowledge discovery/completion changes
- broad typecheck cleanup

## Candidate Addition Mix

A first pilot should use a small, varied batch rather than filling every gap.

Good first batch patterns:

- one town, two villages, one outpost
- one port, one market town, one village, one strategic site
- one fort, one waystation, one village, one mine
- one institutional site, one town, one village, one outpost

Avoid first batch patterns:

- adding multiple cities at once
- filling an entire region to target count
- adding a new route network at the same time
- adding visual map refs at the same time
- adding new guild/institution mechanics at the same time
- adding Chronicle/knowledge hooks at the same time

## Pilot Output Shape

A future docs-only pilot region draft plan should include:

1. selected region id/name
2. why this region was selected
3. current settlement count by class
4. target count by class
5. proposed addition list
6. locality/hex rationale per addition
7. parent/dependency rationale per addition
8. economy/survival/infrastructure rationale per addition
9. explicit non-goals
10. validation checklist

## Content Pass Gate

Before a pilot content pass is allowed, these should exist:

- settlement target gap report or source audit
- selected pilot region and rationale
- proposed additions documented in a draft plan
- stable id/name conventions
- validation checklist
- explicit statement that no route/economy/UI/runtime behavior will be changed

## Non-Mutation Rules

- Do not select a real pilot region in this plan.
- Do not add settlements in this plan.
- Do not modify region target counts.
- Do not generate reports in this plan.
- Do not assign map markers.
- Do not create or recalculate routes.
- Do not create economy, knowledge, Chronicle, Renown, travel, or UI behavior.

## Recommended Future Pass Order

Recommended sequence for this area:

1. `Settlement Target Gap Source Audit`
   - inspect actual content and existing settlement type conventions
   - read-only/docs-first
2. `Settlement Target Gap Markdown Report`
   - generated/committed report only if explicitly scoped
3. `Pilot Region Selection Report`
   - apply this selection rubric to candidate regions
   - docs-only
4. `Pilot Region Settlement Draft Plan`
   - docs-only proposed additions
5. `Pilot Region Settlement Content Pass`
   - content-only, small batch, validation-backed
6. `Pilot Region Settlement Validation Pass`
   - content validation only
7. `Route/Economy/Map Follow-up Plans`
   - separate from initial settlement creation

## Forbidden Until Explicitly Scoped

Do not add or change:

- settlement content JSON
- region/locality/hex/edge/route content JSON
- generated reports
- generated output
- spatial-world runtime
- map scale constants
- route calculations
- travel/session state
- economy mutation
- map UI markers
- knowledge completion/discovery from settlement visibility
- Chronicle/Renown output

## Recommended Stop Point

The map/grid/distance and population-center connector prep set is now sufficient for future Codex work.

Recommended next project work after token reset:

- `Version 0.5.107 - Knowledge Domain Registry Plan`

## Optional Future Connector Work

If waiting continues and more prep is desired, useful connector-only follow-ups are:

1. `Main Menu Theme Asset Source Map`
2. `Content Generation Boundary Map`
3. `Save Load Reliability Source Map`

These should remain docs-only unless explicitly scoped otherwise.
