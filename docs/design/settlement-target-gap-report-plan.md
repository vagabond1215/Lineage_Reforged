# Settlement Target Gap Report Plan

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future regional settlement-count reporting; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Define how a future read-only settlement target gap report should compare current settlement records against regional settlement distribution targets before any population-center content is drafted.

This document is a planning source. It does not authorize report generation, content JSON edits, or settlement creation.

## Source Basis

Primary connector prep sources:

- `docs/design/map-grid-distance-source-map.md`
- `docs/design/regional-population-center-expansion-audit.md`
- `docs/design/settlement-placement-heuristics-plan.md`
- `docs/design/settlement-expansion-content-shape-plan.md`

Primary code/content shape sources:

- `packages/engines/civilization-engine/src/content.ts`
- `packages/engines/civilization-engine/src/spatial-world.ts`

## Core Boundary Rule

A gap report is not an expansion pass.

Counting current settlements against regional targets may identify missing cities, towns, villages, outposts, or strategic sites, but it must not create settlements, modify target counts, alter population totals, change routes, assign map markers, or generate content.

## Report Inputs

A future report should read only:

- region records
- settlement records
- locality records
- hex records
- route/travel records only as optional context

The minimum report input fields are:

### Region fields

- `id`
- `slug`
- `name`
- `regionType`
- `parentRegionId`
- `simulationProfile.densityBand`
- `simulationProfile.populationCapacity`
- `populationProfile.estimatedPopulationMillions`
- `populationProfile.populationCapacityMillions`
- `populationProfile.urbanPopulationPercent`
- `populationProfile.ruralPopulationPercent`
- `settlementDistributionModel.targetCounts`

### Settlement fields

- `id`
- `slug`
- `name`
- `regionId`
- `localityBandId`
- `hexAnchorId`
- `settlementType`
- `siteClass`
- `populationBand`
- `populationTotal`
- `administrativeRole`
- `parentSettlementId`
- `dependencyRole`
- `purposeTags`
- `identityTags`

### Optional context fields

- locality `settlementSuitability`
- locality `routeAccessModifier`
- hex `habitabilityScore`
- hex `freshwaterType`
- hex `barrierTags`
- hex `hazardTags`
- route endpoints and available modes

## Count Classification Rules To Define

Before a report is generated, define exactly how each existing settlement maps to target-count buckets.

Potential buckets:

- `city`
- `town`
- `village`
- `outpost`
- `strategic_site`
- `unclassified`
- `dependent_site`

Recommended approach:

1. Prefer canonical `settlementType` if it maps directly to a target bucket.
2. Use `purposeTags`, `identityTags`, `administrativeRole`, and `dependencyRole` only as secondary signals.
3. Track dependent sites separately unless the target-count policy explicitly includes them.
4. Keep ports, forts, mines, waystations, and institutional sites as subclass annotations rather than primary target buckets unless target counts expand later.
5. Never recategorize content in the report; only classify for analysis.

## Dependent Site Policy Questions

Future reporting must decide:

1. Do dependent villages count against `village` targets?
2. Do mines, forts, ports, and waystations count as `strategic_site`, `outpost`, or dependent-site overlays?
3. Do city districts count as independent population centers?
4. Should parent/child population totals be aggregated for regional capacity checks?
5. Should dependent sites be excluded from city/town/village gaps but included in infrastructure/economy context?

Recommended default for first report:

- Count independent settlements against region targets.
- List dependent sites separately.
- Do not aggregate parent/child populations unless explicitly scoped.

## Recommended Report Sections

A future read-only report should include:

1. **Summary**
   - total regions inspected
   - total settlements inspected
   - total independent settlements
   - total dependent sites
   - total regions with missing target counts

2. **Region Gap Table**
   - region id
   - region name
   - region type
   - density band
   - target city/town/village/outpost/strategic_site counts
   - current counted city/town/village/outpost/strategic_site counts
   - gaps by class
   - dependent-site count
   - unclassified count

3. **Population Capacity Context**
   - estimated population
   - capacity population
   - urban/rural percent
   - sum of settlement population totals
   - warning if current settlement totals exceed capacity or appear far below expected authoring density

4. **Placement Context**
   - localities with high settlement weight but few/no settlements
   - localities with high strategic-site weight but few/no outposts/strategic sites
   - high habitability hexes without anchored settlements
   - settlements anchored to low-habitability/high-hazard hexes for review

5. **Classification Warnings**
   - settlements with unknown/unmapped settlement type
   - settlements missing parent ids despite dependency roles
   - dependent sites without dependency roles
   - population band/total mismatches if ranges are defined

6. **Recommended Next Planning Targets**
   - candidate regions for pilot expansion
   - candidate classes with clearest gaps
   - content risks requiring manual review

## Report Output Policy

Future output should be explicit about whether it is:

- docs-only summary
- generated markdown report
- generated JSON report
- local-only scratch output
- committed report artifact

Recommended first pass:

- Create a committed markdown report only if explicitly scoped.
- Do not generate or commit JSON until report shape is stable.
- Do not update content JSON from report output.

## Validation Rules To Plan Later

Future reporting should validate:

- every settlement region exists
- every settlement locality exists
- every settlement hex anchor exists
- every parent settlement id exists
- dependent sites declare dependency roles
- settlement type maps to a known report bucket or `unclassified`
- region target counts are present for regions expected to participate
- population totals are numeric and non-negative
- report counts are deterministic and stable

## Non-Mutation Rules

- Do not create settlements from report gaps.
- Do not update target counts from report gaps.
- Do not modify population totals.
- Do not modify route or travel content.
- Do not modify localities or hex anchors.
- Do not assign visual map refs.
- Do not generate map markers.
- Do not infer knowledge discovery/completion from settlement visibility.
- Do not create Chronicle/Renown output.

## Recommended Future Pass Order

Recommended sequence for this area:

1. `Settlement Target Gap Source Audit`
   - inspect actual region and settlement content records and existing naming/type conventions
   - read-only/docs-first
2. `Settlement Target Gap Report Script Plan`
   - define exact bucket mapping, dependent-site policy, and output shape
   - planning only
3. `Settlement Target Gap Markdown Report`
   - generated/committed report only if explicitly scoped
4. `Pilot Region Selection Plan`
   - choose a region for small-batch expansion based on clear gaps and low ambiguity
5. `Pilot Region Settlement Draft Plan`
   - docs-only intended additions
6. `Pilot Region Settlement Content Pass`
   - content-only, narrow, validation-backed

## Forbidden Until Explicitly Scoped

Do not add or change:

- settlement content JSON
- region/locality/hex/edge/route content JSON
- generated report artifacts
- generated output
- spatial-world runtime
- map scale constants
- route calculations
- travel/session state
- economy mutation
- map UI markers
- knowledge completion/discovery from settlement visibility
- Chronicle/Renown output

## Recommended Next Connector Work

The map/population-center prep set is now sufficient for future Codex work.

Recommended stop point:

- Return to `Version 0.5.107 - Knowledge Domain Registry Plan` after Codex tokens reset.

Optional connector-only follow-up if waiting continues:

- `Pilot Region Selection Criteria Plan`

Rationale: this would define how to pick the first region for expansion without inspecting or modifying content records.

## Recommended Future Codex Work

Do not schedule settlement reporting or expansion ahead of active knowledge-domain work unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Settlement Target Gap Source Audit`

It should remain docs-only/read-only and should not alter content JSON, generated output, runtime, UI, travel/session behavior, economy, or knowledge state.
