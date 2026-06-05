# Settlement Expansion Content Shape Plan

Source route: ChatGPT via GitHub Connector
Date: 2026-06-05
Status: connector-only prep for future settlement content expansion work; no source, schema, content JSON, UI implementation, generated output, roadmap advancement, or runtime behavior changes

## Purpose

Define minimum safe authoring rules and content-shape expectations for future regional population-center expansion before any settlement records are drafted.

This document is a planning source. It does not authorize settlement creation or content JSON edits.

## Source Basis

Primary connector prep sources:

- `docs/design/map-grid-distance-source-map.md`
- `docs/design/regional-population-center-expansion-audit.md`
- `docs/design/settlement-placement-heuristics-plan.md`
- `docs/design/travel-knowledge-route-source-map.md`
- `docs/design/economy-command-surface-source-map.md`

Primary code/content shape sources:

- `packages/engines/civilization-engine/src/content.ts`
- `packages/engines/civilization-engine/src/spatial-world.ts`

## Core Boundary Rule

A content shape plan is not content.

Field requirements, naming rules, id rules, population-band guidance, parent/dependency conventions, and validation expectations may prepare a future authoring pass, but they must not add settlements, alter regions, recalculate routes, assign UI markers, mutate economy, or complete knowledge.

## Settlement Record Minimum Authoring Fields

Future settlement expansion should require every drafted settlement record to provide:

- stable `id`
- stable `slug`
- display `name`
- `macroRegionId`
- `regionId`
- `localityBandId`
- `hexAnchorId`
- `settlementType`
- `siteClass`
- `terrainContext`
- `populationBand`
- `populationTotal`
- `administrativeRole`
- `identityTags`
- `purposeTags`
- `economicModel`
- `survivalModel`
- `tradeDependencyProfile`
- `infrastructureProfile`
- `domesticResourceProfile`
- `domesticTradeFlows`
- `guildPresence`

Optional fields should remain optional unless the future content pass scopes them:

- `summary`
- `siteContext`
- `parentSettlementId`
- `dependencyRole`
- `visualMapRef`

## Stable Id Rules

Recommended future id pattern:

```text
settlement.<region_slug>.<settlement_slug>
```

Recommended dependent-site id pattern:

```text
settlement.<region_slug>.<parent_slug>.<site_slug>
```

Rules:

- IDs must be durable and human-readable.
- IDs must not encode temporary population numbers.
- IDs must not encode UI pixel positions.
- IDs must not encode route recalculation assumptions.
- IDs must not depend on generated ordering.
- Renaming display names should not require id changes unless the underlying identity changes.

## Naming Rules

Future settlement names should:

- fit region language/culture/theme guidance if present
- avoid duplicate names inside the same region unless intentionally differentiated
- avoid implying a population class that conflicts with the record
- avoid implying route/harbor/fort/mine status unless supporting fields justify it
- avoid implying Chronicle/Renown/family/quest ownership unless those systems are explicitly linked later

## Settlement Type Vocabulary

Future content passes should map planned classes to explicit `settlementType` values before authoring.

Planning classes from the heuristic plan:

- city
- town
- village
- outpost
- strategic_site
- port
- fort
- mine
- waystation
- institutional_site

Recommended rule:

- Use canonical `settlementType` values consistently.
- Do not use visual or narrative labels as ad hoc settlement types.
- If a site has multiple roles, keep `settlementType` primary and express secondary roles through `purposeTags`, `identityTags`, economy fields, infrastructure, and parent/dependency relationships.

## Population Rules To Define Before Content

Future content passes should define numeric bands before adding records.

Planning guidance:

| Class | Expected relative population | Notes |
| --- | --- | --- |
| city | highest region bands | should fit regional urban population and administrative/economic role |
| town | moderate | local market/craft/trade/resource hub |
| village | low to moderate | rural food/resource support |
| outpost | low unless major fortress/camp | frontier/extraction/military/guild/travel support |
| strategic_site | low to moderate | role importance may exceed population |
| port | town to city range | depends on harbor and sea-lane importance |
| fort | low to moderate | garrison and support population |
| mine | low to moderate | extraction scale determines band |
| waystation | low | service population |
| institutional_site | low to moderate | depends on institution scale |

Rules:

- `populationBand` and `populationTotal` must agree.
- `populationTotal` should fit region population capacity.
- New records should not cause known region totals to exceed planned capacity unless explicitly justified.
- Population should not imply economy/trade behavior unless supporting profiles exist.

## Parent And Dependency Rules

Use `parentSettlementId` and `dependencyRole` for subordinate sites.

Good dependent-site cases:

- hamlet under town
- food-belt village under city
- mine under market town or city authority
- fort under city/regional authority
- waystation under town/guild/caravan route owner
- port district under coastal city
- monastery, temple, academy, or guild site under settlement/institution context

Rules:

- A dependent site still needs valid region/locality/hex anchoring.
- A parent relationship does not replace route validation.
- A parent relationship does not create family/account/estate ownership.
- A dependent settlement should state why it exists through `dependencyRole`, `purposeTags`, and economy/survival context.
- Whether dependent sites count against regional target counts must be decided before batch content authoring.

## Economy Model Authoring Expectations

Each future settlement should define:

- dominant role
- secondary roles
- local supply strengths
- demand pressures
- specialization weight

Rules:

- Dominant role should match locality resource catchment, route access, infrastructure, and population band.
- Secondary roles should not imply command behavior.
- Local supply strengths should align with resource catchment and domestic resource profile.
- Demand pressures should align with climate burden, water/food security, route dependence, and settlement role.
- Specialization weight should be higher for mines, ports, forts, institutional sites, and specialty towns than generic villages.

## Survival Model Authoring Expectations

Each future settlement should define:

- habitation score
- food security
- water security
- climate burden
- hazard pressure
- infrastructure difficulty

Rules:

- Values should be coherent with region simulation profile, locality modifier, and hex fields.
- High climate burden or hazard pressure should require purpose/role justification.
- Low water security should not coexist with high population without infrastructure/trade justification.
- High food security should be supported by arable, pasture, fishery, or import context.

## Trade Dependency And Infrastructure Expectations

Future settlements should define route access and infrastructure conservatively.

Trade dependency fields:

- import bias
- export bias
- dependency band
- staple imports
- export focus
- route access: road, river, coastal, caravan, pass, sea lane

Infrastructure fields:

- overall level
- road tier
- water tier
- fortification tier
- harbor tier
- market tier

Rules:

- Harbor tier should require coastal/river/sea-lane justification.
- Pass access should require pass/chokepoint/corridor support.
- Sea-lane access should require maritime context.
- High market tier should require population, route, administrative, or production justification.
- High fortification tier should require hazard, border, pass, administrative, or military justification.

## Domestic Trade Flow Rules

Future `domesticTradeFlows` should remain conservative until route/economy linkage is scoped.

Rules:

- Partner settlement ids must exist.
- Direction must be clear: exports, imports, or exchange.
- Goods should match domestic resource profile and economy model.
- Route modes should match plausible route access.
- Notes should explain why the flow exists.
- Do not add broad trade networks during initial settlement creation unless explicitly scoped.

## Guild Presence Rules

Future `guildPresence` entries should be used only when justified by settlement role.

Good candidates:

- market towns
- ports
- mines
- forts
- academy/temple/institutional sites
- major cities
- route hubs

Rules:

- Guild presence should not imply quest availability, command access, institutional study completion, or knowledge grants.
- Guild presence should not be used as filler for ordinary villages.

## Visual Map Reference Rules

`visualMapRef` should be deferred unless the future pass explicitly scopes map UI scale.

Rules:

- Pixel coordinates should not be assigned casually.
- Map refs should not override region/locality/hex ownership.
- Climate and biome zone ids should match known map layer data when active.
- A settlement can exist without visual map coordinates until UI placement is ready.

## Draft Record Checklist

Before any future settlement record is committed, check:

1. Stable id and slug follow planned conventions.
2. Region/locality/hex ids exist.
3. Settlement class and `settlementType` align.
4. Population band and total align.
5. Administrative role matches region/settlement class.
6. Site class is supported by locality.
7. Terrain context matches hex/locality.
8. Economy model matches resource and route assumptions.
9. Survival model matches region/locality/hex assumptions.
10. Trade dependency profile is plausible.
11. Infrastructure profile is plausible.
12. Domestic resource profile fits economy model.
13. Domestic trade flows reference existing settlements only.
14. Guild presence is justified.
15. Parent/dependency relationship is valid when used.
16. Visual map ref is omitted unless UI scale is scoped.

## Non-Mutation Rules

- This plan does not add settlement records.
- This plan does not change region target counts.
- This plan does not modify localities, hexes, routes, or travel networks.
- This plan does not generate settlement ids.
- This plan does not create map markers.
- This plan does not create trade routes.
- This plan does not create knowledge, Chronicle, Renown, family, quest, or economy events.

## Recommended Future Pass Order

Recommended sequence for this area:

1. `Settlement Content Source Audit`
   - inspect actual current settlement records, counts, and field conventions
   - read-only/docs-first
2. `Settlement Target Gap Report`
   - compare current settlements to regional target counts
   - read-only/generated report only if explicitly scoped
3. `Pilot Region Settlement Draft Plan`
   - choose one region and draft intended additions in docs only
4. `Pilot Region Settlement Content Pass`
   - content-only, small batch, validation-backed
5. `Pilot Region Settlement Validation Pass`
   - validate anchors, counts, economy/survival coherence, and relationships
6. `Route And Economy Linkage Plan`
   - only after settlement records are stable
7. `Map Marker/UI Scale Plan`
   - display-only and separate from content creation

## Forbidden Until Explicitly Scoped

Do not add or change:

- settlement content JSON
- region/locality/hex/edge/route content JSON
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

The next useful connector-only pass for this area is:

- `Settlement Target Gap Report Plan`

Rationale: this content-shape plan defines what a future settlement must contain. The next pass should define how to count current settlements against regional target counts before any content is drafted.

## Recommended Future Codex Work

Do not schedule settlement expansion ahead of active knowledge-domain work unless explicitly requested.

When ready, the safest first Codex pass is:

- `Version 0.5.x - Settlement Content Source Audit`

It should remain docs-only/read-only and should not alter content JSON, generated output, runtime, UI, travel/session behavior, economy, or knowledge state.
