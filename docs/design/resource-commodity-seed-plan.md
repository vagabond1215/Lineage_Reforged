# Resource And Commodity Seed Plan

Source version/run: Version 0.5.302 - Resource And Commodity Seed Plan
Date: 2026-07-09
Status: documentation-only seed plan

## Plan Summary

This plan selects a tiny first future seed for the separate static authorities:

- `world.resources`
- `world.commodities`

Selected future resource records:

- `resource.iron_ore`
- `resource.grain`

Selected future commodity records:

- `commodity.iron_ore_lots`
- `commodity.grain_bundles`

All selected records should be `planned`. The later seed implementation should create both future content files together, use only the exact record shapes below, keep normal content-lint registration deferred, and avoid runtime, economy, storage, cargo, crafting, service, UI, save/account, or gameplay behavior.

This run does not add live resource or commodity content.

## Current Completed-State Posture

- `Version 0.5.301 - Resource And Commodity Schema And Validator` completed schema, validator, focused-test, and schema-parse support.
- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit` remains the latest support/audit run.
- `packages/content/base/world/resources.json` remains absent.
- `packages/content/base/world/commodities.json` remains absent.
- Normal content-lint registration remains absent.
- The Highcrown settlement Knowledge lane remains closed.
- Generic `world.pois` remains rejected.
- Service authority is stable and needs no continuation in this run.

## Current Schema / Validator Posture

- Resource schema: `packages/schemas/world/resource.schema.json`
- Commodity schema: `packages/schemas/world/commodity.schema.json`
- Resource validator: `tools/content-lint/resources.mjs`
- Commodity validator: `tools/content-lint/commodities.mjs`
- Focused test: `tests/unit/resource-commodity-authority-validation.test.mjs`
- Schema parse coverage: `tests/unit/schema-files.test.mjs`

The validators enforce records-only wrappers, strict id/slug coherence, unique ids/slugs/names, controlled vocabulary, safe lower-snake tags, canonical `items.items` item-key resolution, market-only key rejection, peer resource/commodity refs, optional relationship refs where supplied, and recursive rejection of forbidden ownership fields.

## Candidate Selection Criteria

The first seed should prefer records that:

- resolve through existing `items.items` item keys;
- also have `civilization.market_item_values` coverage without copying values or pricing fields;
- use existing resource and commodity vocabulary without new enums;
- are boring source-material or bulk-good concepts;
- can be expressed without production-chain, recipe, ecology, geography, service, cargo, storage, or runtime references;
- can remain planned without implying active gameplay use.

The first seed should avoid records that:

- require new resource or commodity vocabularies;
- need resource-node, gathering, extraction, agriculture, or simulation policy;
- depend on free-form settlement goods migration;
- require market-only keys;
- require concrete production-chain or recipe references;
- require service, provider, storage, cargo, vendor, price, or stock behavior.

## Fresh Evidence Audit

Read-only inspection found:

- `items.items` contains 1,372 item records.
- `civilization.market_item_values` contains 1,617 market value records.
- There are 245 market-only keys that do not resolve to `items.items`; these remain rejected as resource/commodity `relatedItemKeys`.
- `iron_ore` resolves to `item.iron_ore`, is `itemClass: "commodity"`, has branch `metal`, sub-branch `ore`, roles `material` and `trade_good`, stage `raw`, is marketable, and has `market.item.iron_ore`.
- `grain_bundle` resolves to `item.grain_bundle`, is `itemClass: "commodity"`, has branch `food`, sub-branch `raw`, roles `ingredient` and `trade_good`, stage `raw`, is marketable, and has `market.item.grain_bundle`.
- Current recipe content contains `recipe.iron_ore_to_iron_ingot` and `recipe.grain_bundle_to_flour`, but recipe refs are omitted from the first seed to avoid implying crafting execution.
- Current production-chain content contains grain-related chain ids such as `chain.food.bread` and `chain.food.flour`, but production-chain refs are omitted from the first seed to avoid implying macro-production integration.
- Current settlement records contain exact goods terms `iron_ore` and `grain`, but `observedSettlementGoodsTerms` is omitted from the exact first records to avoid implying settlement goods normalization or migration.
- Current ecology/geography records include exact authorities, and current mineral content includes `mineral.iron_ore`, but the current resource schema has no mineral relationship field and the first seed should not infer flora, biome, habitat, region, or map-feature refs from broad prose.
- Current `civilization.services` and `civilization.buildings` remain service/building authorities only; they provide boundary context, not resource/commodity candidate evidence.

## Selected Resource Candidates

| Future id | Status | Family | Related item keys | Related commodities | Rationale |
| --- | --- | --- | --- | --- | --- |
| `resource.iron_ore` | `planned` | `mineral` | `iron_ore` | `commodity.iron_ore_lots` | Canonical raw ore item key, market coverage, existing ore/material/trade-good language, simple mined source-material identity. |
| `resource.grain` | `planned` | `food_crop` | `grain_bundle` | `commodity.grain_bundles` | Canonical raw grain bundle item key, market coverage, frequent settlement goods term `grain`, simple cultivated food-crop identity. |

## Selected Commodity Candidates

| Future id | Status | Family | Trade category | Related item keys | Related resources | Rationale |
| --- | --- | --- | --- | --- | --- | --- |
| `commodity.iron_ore_lots` | `planned` | `raw_bulk` | `raw_material` | `iron_ore` | `resource.iron_ore` | Bulk-trade class for the selected raw ore resource, represented by a canonical item key. |
| `commodity.grain_bundles` | `planned` | `staple_food` | `foodstuff` | `grain_bundle` | `resource.grain` | Bulk/staple foodstuff class for the selected grain resource, represented by a canonical item key. |

## Exact Future Resource Record Shapes

Future `packages/content/base/world/resources.json`:

```json
{
  "records": [
    {
      "id": "resource.iron_ore",
      "slug": "iron_ore",
      "name": "Iron Ore",
      "status": "planned",
      "family": "mineral",
      "summary": "Static source-material identity for iron-bearing ore before it is refined or represented as a bulk trade good.",
      "sourceDomains": ["mined"],
      "allowedOwnerTypes": ["item", "production_chain", "settlement_descriptor"],
      "tags": ["ore", "metal"],
      "sourceAuthorityNotes": [
        "The canonical item key `iron_ore` resolves to `item.iron_ore` in `items.items`.",
        "`iron_ore` has market-value coverage in `civilization.market_item_values`; values and pricing remain economy-owned.",
        "The paired commodity candidate is `commodity.iron_ore_lots`."
      ],
      "notes": [
        "Planned descriptive resource identity only.",
        "No prices, stock, resource nodes, extraction behavior, cargo, storage, runtime, UI, save/account, or gameplay behavior."
      ],
      "relatedItemKeys": ["iron_ore"],
      "relatedCommodityIds": ["commodity.iron_ore_lots"]
    },
    {
      "id": "resource.grain",
      "slug": "grain",
      "name": "Grain",
      "status": "planned",
      "family": "food_crop",
      "summary": "Static source-material identity for harvested grain before milling, cooking, or bulk market handling.",
      "sourceDomains": ["cultivated"],
      "allowedOwnerTypes": ["item", "production_chain", "settlement_descriptor"],
      "tags": ["grain", "crop"],
      "sourceAuthorityNotes": [
        "The canonical item key `grain_bundle` resolves to `item.grain_bundle` in `items.items`.",
        "`grain_bundle` has market-value coverage in `civilization.market_item_values`; values and pricing remain economy-owned.",
        "The paired commodity candidate is `commodity.grain_bundles`."
      ],
      "notes": [
        "Planned descriptive resource identity only.",
        "No harvest mechanics, stock, storage, recipe execution, cargo, runtime, UI, save/account, or gameplay behavior."
      ],
      "relatedItemKeys": ["grain_bundle"],
      "relatedCommodityIds": ["commodity.grain_bundles"]
    }
  ]
}
```

## Exact Future Commodity Record Shapes

Future `packages/content/base/world/commodities.json`:

```json
{
  "records": [
    {
      "id": "commodity.iron_ore_lots",
      "slug": "iron_ore_lots",
      "name": "Iron Ore Lots",
      "status": "planned",
      "family": "raw_bulk",
      "tradeCategory": "raw_material",
      "summary": "Static bulk-trade class for lots of iron ore represented by canonical item keys and paired to the iron ore resource.",
      "handlingTags": ["bulky", "dry"],
      "allowedOwnerTypes": ["item", "resource", "settlement_descriptor", "market_profile"],
      "tags": ["ore", "metal", "bulk"],
      "sourceAuthorityNotes": [
        "The canonical item key `iron_ore` resolves to `item.iron_ore` in `items.items`.",
        "`iron_ore` has market-value coverage in `civilization.market_item_values`; values and pricing remain economy-owned.",
        "The paired resource candidate is `resource.iron_ore`."
      ],
      "notes": [
        "Planned descriptive commodity identity only.",
        "No prices, stock, vendor inventory, cargo movement, storage contents, trading execution, runtime, UI, save/account, or gameplay behavior."
      ],
      "relatedItemKeys": ["iron_ore"],
      "relatedResourceIds": ["resource.iron_ore"]
    },
    {
      "id": "commodity.grain_bundles",
      "slug": "grain_bundles",
      "name": "Grain Bundles",
      "status": "planned",
      "family": "staple_food",
      "tradeCategory": "foodstuff",
      "summary": "Static bulk foodstuff class for grain bundles represented by canonical item keys and paired to the grain resource.",
      "handlingTags": ["dry", "perishable", "staple"],
      "allowedOwnerTypes": ["item", "resource", "settlement_descriptor", "market_profile"],
      "tags": ["grain", "staple", "bulk"],
      "sourceAuthorityNotes": [
        "The canonical item key `grain_bundle` resolves to `item.grain_bundle` in `items.items`.",
        "`grain_bundle` has market-value coverage in `civilization.market_item_values`; values and pricing remain economy-owned.",
        "The paired resource candidate is `resource.grain`."
      ],
      "notes": [
        "Planned descriptive commodity identity only.",
        "No prices, stock, cargo movement, storage contents, trading execution, recipe execution, runtime, UI, save/account, or gameplay behavior."
      ],
      "relatedItemKeys": ["grain_bundle"],
      "relatedResourceIds": ["resource.grain"]
    }
  ]
}
```

## Candidate Rejection Table

| Candidate | Decision | Reason |
| --- | --- | --- |
| `resource.timber` / timber commodity | Rejected for first seed | `timber` is a processed item in current item content; a clean wood-resource seed should wait for a later plan that handles tree/flora, lumber, forestry, and production-stage boundaries. |
| `resource.salt` / salt commodity | Rejected for first seed | `salt_crystal` is viable, but it adds another raw-food/mineral boundary and is less useful than the paired iron/grain starter set. |
| `resource.stone` / stone-block commodity | Rejected for first seed | Stone-block terms are well represented, but selecting them would push toward quarry/construction-material breadth that is not needed for the first tiny seed. |
| `resource.clay` / pottery commodity | Rejected for first seed | Clay has item support, but pottery/clay-vessel links trend toward production and crafted-good classification. |
| Market-only `fauna.*` keys | Rejected | These keys appear in market values but do not resolve to `items.items`; validators reject them as `relatedItemKeys`. |
| Recipe-linked commodity records | Rejected for first seed | Recipe ids exist for selected item keys, but including recipe refs would imply integration that the first seed does not need. |
| Ecology/geography relationship refs | Rejected for first seed | Exact ecology/geography authorities exist, but the selected first records do not need them, and broad inference from prose is intentionally avoided. |

## Relationship Proof

Item keys:

- `iron_ore` resolves to `item.iron_ore`.
- `grain_bundle` resolves to `item.grain_bundle`.
- Both selected keys have market value records, but no value or pricing fields are copied into future resource or commodity records.

Market-only key rejection:

- Read-only audit found 245 market-only keys.
- No selected `relatedItemKeys` value is market-only.
- The later seed validator should load `civilization.market_item_values` so any market-only key used by mistake fails closed.

Resource/commodity cross-refs:

- `resource.iron_ore.relatedCommodityIds` points to selected `commodity.iron_ore_lots`.
- `resource.grain.relatedCommodityIds` points to selected `commodity.grain_bundles`.
- `commodity.iron_ore_lots.relatedResourceIds` points to selected `resource.iron_ore`.
- `commodity.grain_bundles.relatedResourceIds` points to selected `resource.grain`.

Production and recipe refs:

- Omitted from first seed.
- Exact recipes exist for selected item keys, but the seed should not imply crafting execution or production-chain integration.

Ecology/geography refs:

- Omitted from first seed.
- No flora, fauna, biome, habitat, region, or map-feature ids should be inferred from prose for the first records.

Settlement goods terms:

- Omitted from exact first records.
- Settlement terms `iron_ore` and `grain` are evidence only; they should not be treated as a settlement goods migration or normalization.

## Normal Content-Lint Registration Posture

Normal content-lint registration remains deferred.

The later seed implementation should not edit `tools/content-lint/index.mjs`. A separate `Version 0.5.304 - Resource And Commodity Lint Registration Decision` or equivalent docs-first decision should approve registration after live content exists and focused validation proves the live seed.

## Deep Research / Nonstandard-Run Posture

`GPT-DR.resources.gathering-extraction` is not required before the seed implementation because this plan does not select resource nodes, gathering/extraction policy, agriculture policy, or simulation behavior.

No nonstandard support-suffix run is required.

No explicit user question is required before the next standard numbered route if the user accepts this tiny planned-only seed.

## Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Seed resources only | Rejected | The paired resource/commodity relationship is validator-supported and clarifies the boundary without broadening content. |
| Seed commodities only | Rejected | Commodities should point to selected resource ids where possible, so resources should land in the same tiny seed. |
| Seed both together | Selected | Creates two small paired wrappers and lets cross-reference validation prove the first contract. |
| Run `GPT-DR.resources.gathering-extraction` first | Rejected | External research is unnecessary for a two-pair descriptive planned seed with no nodes or execution. |
| Skip seed plan and add live content immediately | Rejected | The roadmap requires seed plans before content seeds. |

## Selected Option And Rationale

Seed both resources and commodities together in a later implementation run.

This is the smallest coherent content step because:

- both resource records have canonical item-key evidence;
- both commodity records can point back to selected resource ids;
- all four records remain planned;
- no production, recipe, ecology, geography, service, storage, cargo, price, stock, runtime, UI, save/account, or gameplay behavior is needed;
- normal lint registration can remain deferred until after the live seed exists.

## Risks And Mitigations

- Risk: settlement goods terms might be mistaken for migration instructions.
  - Mitigation: omit `observedSettlementGoodsTerms` from the first live records and keep settlement terms as evidence only.
- Risk: recipe and production refs could imply execution.
  - Mitigation: omit `relatedRecipeIds`, `relatedProductionChainIds`, and `relatedProductionStageRefs` from the first seed.
- Risk: `resource.grain` could later need richer crop/flora modeling.
  - Mitigation: keep only the canonical `grain_bundle` item-key relationship now; defer flora/agriculture detail.
- Risk: normal lint registration before live content is validated could broaden scope.
  - Mitigation: require a separate registration decision after the live seed lands.

## Explicit Non-Goals

This plan does not create `resources.json` or `commodities.json`.

This plan does not edit schemas, validators, tests, normal content-lint registration, item content, market value content, crafting content, recipe content, production-chain content, settlement/economy content, service content, building/workplace descriptors, geography/ecology content, route/travel content, Knowledge content, combat status/condition/injury content, POI/discovery content, runtime behavior, UI, storage behavior, commands, events, rewards, migrations, save/account behavior, gameplay behavior, `world.pois`, or the closed Highcrown settlement Knowledge lane.

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master`
- Required reads of current handoffs, roadmap, sequence, backlog, resource/commodity decisions, boundary docs, schemas, validators, and tests.
- Read-only JSON audits of item keys, market values, production chains, recipes, settlement goods terms, ecology/geography counts, services, and buildings.
- Validation and scope scans are recorded in `docs/dev/current-codex-output.md` for this run.

## Next Recommended Version

Version 0.5.303 - Resource And Commodity Seed

Recommended scope:

- Create only `packages/content/base/world/resources.json` and `packages/content/base/world/commodities.json` with the exact records selected here.
- Update focused validation to read the live seed if appropriate.
- Keep normal content-lint registration deferred.
- Do not add additional records, production/recipe/ecology/geography refs, prices, stock, cargo, storage, gathering, trading, crafting execution, service execution, runtime, UI, save/account, or gameplay behavior.
