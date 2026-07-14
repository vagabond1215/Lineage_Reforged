# Static Content Expansion Program

Date: 2026-07-14
Program versions: `0.6.4`-`0.6.7`
Status: `0.6.4` world/settlement package complete; `0.6.5` item/material/recipe package remains next but is blocked at exact-target reconciliation; cross-domain research bridge queued after accepted `0.6.5` and before `0.6.6`

## 1. Purpose

The repository now has enough strict authority, validation, and runtime separation to author broader static canon deliberately. This program inserts three dependency-closed content packages and one coherence audit before another runtime consumer. It does not imply that static records are simulated, obtainable, buyable, craftable, spawned, discovered, or otherwise active in gameplay.

A user-directed cross-domain GPT Deep Research program now sits between accepted `0.6.5` and active `0.6.6`. It covers natural sources, byproducts, ingredients, material refinement, food processing, crafting production, technology level, and bounded magitech. It is unversioned research plus documentation integration and does not consume a primary `0.6.x` label.

Accepted runtime ownership through engine-owned travel, quest acceptance, quest tracking, and activity selection remains unchanged.

## 2. Reproducible Live Inventory

Counts below were reproduced on 2026-07-14 from the listed JSON `records` arrays. `npm.cmd run tool:content-lint` passed at 67 checked files. “Registered” means the file participates in normal content lint through JSON-schema and/or semantic checks in `tools/content-lint/index.mjs`.

| Authority | Content and count | Lifecycle or coverage | Schema | Focused validator / normal lint | Critical dependencies | Current consumer | Readiness | Exact blocker or constraint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Settlements | `packages/content/base/world/settlements.json` — 88 | 14 settlement types across 9 macro regions; no lifecycle field | `packages/schemas/world/settlement.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | macro region, region, locality band, hex, guild, trade partner, visual map refs | world content loader, travel/UI/world presentation | `ready-with-reference-constraints` | Every new identity needs valid geography, scale, trade, and visual-reference closure. Existing breadth favors enrichment over filler. |
| Settlement districts | `packages/content/base/world/settlement_districts.json` — 14 | 14 active across Highcrown and the three `0.6.4` clusters | `packages/schemas/world/settlement-district.schema.json` | `tools/content-lint/settlement-districts.mjs`; registered | active parent settlement, unique slug/id, supported district type | Knowledge/presentation authority; no simulation | `expanded-and-validated` | Parent and status coherence; active Knowledge subjects require active records. |
| Settlement sites | `packages/content/base/world/settlement_sites.json` — 20 | 20 active across Highcrown and the three `0.6.4` clusters | `packages/schemas/world/settlement-site.schema.json` | `tools/content-lint/settlement-sites.mjs`; registered | parent settlement, optional district, supported site type | Knowledge/presentation authority; no simulation | `expanded-and-validated` | Parent/district and status coherence; no generic POI substitution. |
| Regions | `packages/content/base/world/regions.json` — 41 | established hierarchy; `0.6.4` reused current records | `packages/schemas/world/region.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | world maps and parent-region hierarchy | geography/travel/world presentation | `ready-with-reference-constraints` | New regions require map and hierarchy evidence; the completed `0.6.4` matrix proved no gap. |
| Region localities | `packages/content/base/world/region_localities.json` — 47 | 47 locality types, one record each | `packages/schemas/world/region-locality.schema.json` | registered in `tools/content-lint/index.mjs` | region/macro-region, terrain/site class, hex anchoring | settlement/geography validation | `ready-with-reference-constraints` | Reuse existing locality anchors first; new localities require geographic evidence and hex closure. |
| Semantic map features | `packages/content/base/world/map_features.json` — 8 | 8 planned named semantic identities | `packages/schemas/world/map-feature.schema.json` | `tools/content-lint/map-features.mjs`; registered | region/settlement/world-map anchors and visual references | static semantic reference only | `expanded-and-validated` | Must represent named geographic features with valid anchors, not a generic POI catalog. |
| Visual world-map aggregate | `packages/content/base/world/world_map_features.json` — 1 | one geometry/reference record; `0.6.4` added no geometry | `packages/schemas/world/world-map-feature.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | world maps, image dimensions, regions, climate and biome zones | map rendering/reference | `authored-input-gated` | Requires authoritative cartography/geometry input; the completed semantic expansion did not fabricate any. |
| Resources | `packages/content/base/world/resources.json` — 2 | 2 planned | `packages/schemas/world/resource.schema.json` | `tools/content-lint/resources.mjs`; registered | item keys, commodities, owner types | no runtime extraction owner | `research-gated; paused` | Broad expansion requires the cross-domain research program, integration, and a later bounded seed decision. Reuse only existing references now. |
| Commodities | `packages/content/base/world/commodities.json` — 2 | 2 planned | `packages/schemas/world/commodity.schema.json` | `tools/content-lint/commodities.mjs`; registered | resources, items, market values, owner types | no dynamic trade owner | `research-gated; paused` | Paired resource/trade evidence is missing for broader expansion. Reuse only existing references now. |
| Items | `packages/content/base/items/items.json` — 1,372 | 1,114 commodity, 131 tool, 35 weapon, 26 consumable, 24 accessory, 18 armor, 14 clothing, 10 vehicle | `packages/schemas/items/item.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | item keys, skills/use profiles, currency/value rules | inventory/equipment/economy/catalog consumers | `ready-with-reference-constraints` | New marketable identities require market-value closure; static identity must not imply instances, ownership, durability, quality, or availability. |
| Market item values | `packages/content/base/civilization/market_item_values.json` — 1,617 | current static value catalog | `packages/schemas/civilization/market-item-value.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | canonical item keys or allowed external sources, currency/value units | economy presentation/baselines | `ready-with-reference-constraints` | Add only static baselines for valid sources; no dynamic prices, stock, access, or transactions. |
| Consumable profiles | `packages/content/base/items/consumable_profiles.json` — 9 | separate static descriptors | `packages/schemas/items/consumable-profile.schema.json` | registered in `tools/content-lint/index.mjs` | linked item `consumableProfileId` and supported descriptors | item/use presentation | `ready-with-reference-constraints` | Every profile and item reference must close; no effect execution or resource mutation. |
| Weapon profiles | no live collection — 0 | schema/validator fixtures only | `packages/schemas/items/weapon-profile.schema.json` | `tools/content-lint/equipment-profiles.mjs`; focused tests only; not registered | canonical weapon item keys, slots, skills, combat hooks | none | `requires-small-schema-or-validator-precondition` | Before profile content, create the decided live path/wrapper, register normal lint, and seed dependency-closed records. |
| Armor profiles | no live collection — 0 | schema/validator fixtures only | `packages/schemas/items/armor-profile.schema.json` | `tools/content-lint/equipment-profiles.mjs`; focused tests only; not registered | canonical armor item keys, slots, skills, mitigation hooks | none | `requires-small-schema-or-validator-precondition` | Same narrow live-collection and lint-registration precondition as weapon profiles. |
| Crafting recipes | `packages/content/base/crafting/recipes.json` — 12 before `0.6.5` | 12 planned; 8 families, all `standard` subtype | `packages/schemas/crafting/recipe.schema.json` | `tools/content-lint/crafting-recipes.mjs`; registered | input/output item keys, tools, workplaces, skills, production chains, Knowledge refs | no crafting execution owner | `active expansion` | `0.6.5` must dependency-close every family; planned recipes do not imply execution or availability. Research later audits the broader ecosystem and the resulting 30-recipe baseline. |
| Monsters | `packages/content/base/world/monsters.json` — 24 | 6 classes; threats: 5 low, 12 moderate, 6 high, 1 severe | `packages/schemas/world/monster.schema.json` | `tools/content-lint/monsters.mjs`; registered | item/value loot refs, combat roles, action packages, optional fauna lineage, tactics | combat/encounter static baselines | `ready-with-reference-constraints` | Reuse executable vocabulary; avoid variants needing unproved lineage or mechanics. Runtime spawning and combat execution remain separate. |
| Source-local monster loot | 49 drop entries and 20 loot entries; 12 monsters have empty loot | embedded in monster records | monster schema | monster semantic checks; registered | item keys and market values | authored reward descriptors only | `research-informed after integration` | No general loot-table authority, roll execution, ownership, payout, or dynamic generation. Research may inform plausible static byproducts and loot identities only. |
| Fauna | `packages/content/base/world/fauna.json` — 132 | 7 types; danger: 6 none, 73 low, 35 medium, 18 high | `packages/schemas/world/fauna.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | habitats, item/value outputs | ecology/economy reference content | `research-informed after integration` | Static ecology only; no population, migration, spawning, harvesting, or output execution. |
| Regional ecology | `packages/content/base/world/regional_ecology_profiles.json` — 9 | one profile per macro region | `packages/schemas/world/regional-ecology.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | regions, climates, biomes, flora, fauna, trade partner regions | world/ecology reference content | `research-informed after integration` | Profile associations may expand only with existing authority closure; no runtime ecology or trade simulation. |
| Combat roles | `packages/content/base/game/combat_roles.json` — 9 | stable role vocabulary | `packages/schemas/game/combat-role.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | tactics defaults and supported combat vocabulary | combat presentation/baselines | `ready-with-reference-constraints` | Prefer reuse in `0.6.6`; expand only for a proved missing niche. |
| Tactics presets | `packages/content/base/game/tactics_presets.json` — 9 | one linked preset per current role | `packages/schemas/game/tactics-preset.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | combat role and supported tactics vocabulary | combat presentation/defaults | `ready-with-reference-constraints` | Defaults do not authorize AI execution; prefer reuse. |
| Knowledge domains | `packages/content/base/player/knowledge_domain_registry.json` — 7 | 6 active, Arcane Lore planned | `packages/schemas/player/knowledge-domain-registry.schema.json` | `tools/content-lint/knowledge-domain-registry.mjs`; registered | supported subject types/sources and policies | Knowledge projection/readiness | `ready-with-reference-constraints` | New snippets must use active domains, declared subject/source vocabulary, and live active subjects. No discovery or skill mutation. |
| Knowledge snippets | `packages/content/base/player/knowledge_snippets.json` — 28 | 18 General Lore plus flora/fauna, mineral, ecology, and religion subjects | `packages/schemas/player/knowledge_snippet.schema.json` | `tools/content-lint/knowledge-snippets.mjs`; registered | domain registry and live subject authorities | descriptive Knowledge content | `expanded-and-validated` | Expand alongside source canon; snippets remain informational and non-granting. |
| Elemental vessels and magic production foundations | crystal catalog plus spell/conduit/catalyst/enchanter metadata | shard/crystal/cluster tiers; fixed and attunable affinities; static capacity/efficiency/stability/recharge and permanent-enchant consumption metadata | current magic and crystal schemas | current semantic validators and focused tests | spells, items, materials, enchanters, infrastructure, future runtime owners | static compatibility and readiness only | `research-ready; implementation-gated` | Research may classify magical production and infrastructure, but no casting, enchanting execution, catalyst consumption, recharge execution, or free modern-equivalent technology may be inferred. |
| Services | `packages/content/base/civilization/services.json` — 5 | 5 planned; `0.6.4` added none | `packages/schemas/civilization/service.schema.json` | `tools/content-lint/services.mjs`; registered | provider anchor types and building service functions | vocabulary only; no availability owner | `paused` | Post-registration audit found no immediate expansion need; no provider, price, stock, or effect authority was added. |

## 3. Static, Research, And Runtime Boundary

Static authored expansion may add identity, prose, classification, geography, districts/sites, infrastructure descriptions, items and profiles, recipe relationships, monster archetypes, habitat/ecology associations, source-local loot descriptors, Knowledge subjects/snippets, and honest lifecycle changes supported by live contracts.

The research bridge may compare external evidence, produce cited temporary artifacts, classify content candidates, and recommend future packages. It does not make recommendations canonical until integration and does not authorize implementation.

Neither static content nor research may add or claim item instances, provenance, ownership/storage mutation, capacity/reservations, durability/quality/spoilage mutation, crafting execution, dynamic availability/vendors/prices/stock/services, encounter or spawn simulation, dynamic loot, NPC population/schedules/workers, construction/property/growth/taxation/law enforcement, runtime ecology/economy/reputation/reward/faction consequences, spell casting, enchanting execution, or magitech operation. Runtime, UI, saves, migrations, dependencies, and gameplay behavior are outside all content and research packages.

## 4. Geographic And Thematic Coverage Strategy

Expansion uses a coverage matrix, not isolated records. Each row must name a macro region, region, parent settlements, settlement scales/types, geographic features, district/site functions, cultural/economic themes, Knowledge subjects, and every dependency owner.

The first package enriches existing geography rather than inflating the already broad 88-settlement catalog. Its completed target matrix was:

| Cluster | Existing parent settlements | Coverage purpose | Target records |
| --- | --- | --- | --- |
| Verdant Thalos | Aurelis, Vinecross, Redcliff Quay | continental city, inland market, and harbor relationships around the Thalos Run | 4 districts, 6 sites, 2 semantic map features, 4 Knowledge snippets |
| Heart Basin | Riverthrone, Granary Crown, Millrun | river capital, granary city, and production-market differentiation | 4 districts, 6 sites, 2 semantic map features, 4 Knowledge snippets |
| Stormcap Coast | Breaksail, Stormwatch Citadel, Cliffsalt Priory | harbor, defensive citadel, and religious coastal identity | 4 districts, 6 sites, 2 semantic map features, 4 Knowledge snippets |

`0.6.4` completed exactly 12 new districts, 18 new sites, 6 new semantic map features, and 12 new General Lore snippets across nine existing settlements. It added no settlement, region, locality, visual geometry, service, resource, or commodity records.

## 5. New-Canon Authoring Rules

- Every record must provide geographic, structural, thematic, dependency, Knowledge, or later vertical-slice value.
- Names and descriptions must be grounded medieval fantasy, region-specific, and non-duplicative.
- New canon must agree with existing parent settlement economy, survival, culture, terrain, trade, infrastructure, religion, and map descriptions.
- Use specific owner families. Districts and sites are not generic POIs; semantic geography is not visual geometry.
- Lifecycle means authored availability only. `active` does not mean simulated, visited, stocked, staffed, discoverable, or executable.
- Do not create aliases, migrations, retired-id compatibility, or historical-id preservation.
- Do not weaken a schema or validator to admit content.
- Research recommendations do not become canon until repository integration classifies and promotes them.

## 6. Settlement, District, And Site Strategy

Major settlements become structurally distinct through civic, market, production, harbor, defensive, religious, residential, or archival districts and named sites justified by parent canon. Smaller settlements receive sites without artificial district layers when scale does not support them. All districts/sites require parent closure, honest status, distinct functional tags, and non-overlapping summaries.

## 7. Item, Material, And Recipe Closure Strategy

`0.6.5` builds recipe families from outputs backward through inputs, tools, workplaces, skills, item identities, static values, and allowed existing resource/commodity references. It must not broaden paused resource/commodity catalogs. Every added marketable item would require value closure; every recipe input/output/tool/workplace exists and validates.

After `0.6.5`, the cross-domain research program audits the broader source-to-finished-product ecosystem rather than treating the 30-recipe catalog as complete. It may prove a narrow `0.6.5.x` correction, but it does not authorize direct content changes.

## 8. Cross-Domain Research Bridge

The durable authority is:

`docs/design/cross-domain-natural-resources-materials-production-and-magitech-research-program.md`

Required order:

1. `GPT-DR.resources.gathering-extraction`
2. `GPT-DR.ecology.flora-fauna-byproducts`
3. `GPT-DR.agriculture.land-food-livestock`
4. `GPT-DR.materials.refinement-processing`
5. `GPT-DR.food.processing-preservation`
6. `GPT-DR.crafting.tools-workplaces-production`
7. `GPT-DR.magitech.production-infrastructure-substitution`
8. Unversioned Cross-Domain Natural Resources, Materials, Production, And Magitech Research Integration

Each gate produces one cited temporary artifact. The integration promotes repo-corrected guidance, creates `docs/design/cross-domain-production-research-synthesis.md`, dispositions every temporary artifact, decides any `0.6.5` repair, and installs the revised exact `0.6.6` prompt.

The research must preserve a mundane technological baseline and make magic useful but non-universal. Magic may augment or replace modern-like functions only through explicit affinity, vessel, capacity, efficiency, stability, recharge, environmental, material, skill, installation, maintenance, scarcity, cost, and failure constraints.

## 9. Monster, Ecology, And Loot Closure Strategy

`0.6.6` uses a biome/region/role/threat matrix. Each monster fills a distinct niche, uses current combat/action vocabulary, closes role/tactics references, and uses valid item/value loot references. Fauna lineage or regional variants are allowed only when the current schema and validator prove them; otherwise author standalone archetypes. Static loot remains source-local. No spawn rules, population simulation, dynamic rolls, new combat mechanics, status execution, gathering, harvesting, body-part execution, crafting, or magic runtime may be inferred.

The revised `0.6.6` prompt must read the accepted cross-domain synthesis and use only recommendations classified as compatible with its static owner scope.

## 10. Knowledge Integration

Knowledge is authored with source canon, not retrofitted as filler. Use active domains and declared subject vocabularies. A snippet identifies or contextualizes a live active subject without granting discovery, skill, rewards, travel access, magic, reputation, or runtime consequences. Arcane Lore remains planned and cannot receive live snippets in this program absent a dedicated activation decision.

The Geographic Knowledge Taxonomy And Location Recognition Contract Plan remains queued after `0.6.7`. Current `Recognizing ...` snippets are structural authored lore, not implemented recognition criteria.

## 11. Batch And Review Policy

Use the largest single coherent, dependency-closed, validator-backed batch that remains reviewable. Do not revert to arbitrary one- or two-record seeds, and do not combine world, item/recipe, and monster packages in one commit. Each package must begin with a live count, coverage matrix, explicit target count, collision search, dependency inventory, and clean/dirty worktree review. Review the complete changed path set and preserve unrelated edits.

Deep Research uses one named gate and one temporary artifact at a time. Do not merge the seven research topics into one catch-all report.

## 12. Exact Sequence And Acceptance

| Route | Package | Acceptance criteria |
| --- | --- | --- |
| `0.6.4` | World And Settlement Static Content Expansion | Complete. Target matrix, reference closure, 592 focused tests, and 67-file normal lint passed; no generic POI, geometry fabrication, paused-catalog expansion, or runtime claim. |
| `0.6.5` | Item, Material, And Recipe Static Content Expansion | Currently blocked until the exact recipe target has production-chain transformation and quantity authority. On later acceptance: coherent recipe families; all item/value/input/output/tool/workplace/skill references close; paused resource/commodity gate preserved; focused tests and normal lint pass; exact research integration prompt activated afterward. |
| GPT-DR program | Seven cross-domain research gates | One cited artifact per gate; live repo baseline; technology, ecology, material, food, crafting, and magitech findings; explicit uncertainty and owner classification; no implementation. |
| unversioned integration | Cross-Domain Natural Resources, Materials, Production, And Magitech Research Integration | All seven artifacts reconciled; durable synthesis created; temporary artifacts dispositioned; `0.6.5` repair decision made; exact revised `0.6.6` prompt installed. |
| `0.6.6` | Monster, Ecology, And Loot Static Content Expansion | Research-informed region/biome/role/threat matrix; monster/fauna/ecology/role/tactics/item/value/loot closure; no adjective-only duplicates or unimplemented mechanics; focused tests and normal lint pass. |
| `0.6.7` | Cross-Content Coherence And Coverage Audit | All schemas/semantic validators pass; no duplicate ids/slugs, orphans, status contradictions, generic authorities, runtime claims, research-route drift, or hygiene failures; all coverage matrices reconciled. |
| unversioned support | Geographic Knowledge Taxonomy And Location Recognition Contract Plan | Geography bracket/facets and location-recognition criteria planned without treating current snippets as implemented mechanics. |

## 13. Cross-Content Audit Criteria

The `0.6.7` audit verifies schema compliance, 67-file-or-later normal lint registration, semantic validators, duplicate identities, orphan references, settlement/district/site/map/region anchoring, item/resource/commodity/value closure, recipe closure, equipment-profile closure if profiles landed, monster/loot/fauna/lineage/role/tactics closure, Knowledge closure, lifecycle honesty, research-synthesis compatibility, temporary-artifact disposition, route preservation, formatting, and generated-output hygiene. Defects receive the smallest repair suffix attached to the content primary that introduced them. Validators must not be weakened to hide defects.

## 14. Deferred Integrated Gameplay Layer

After static acceptance, later owner-specific prompts may separately address inventory/storage, crafting execution, vendor/economy behavior, encounter/spawn selection, loot rolls and ownership, population/ecology simulation, settlement growth/property/construction, NPC workers/schedules, active magitech infrastructure, spell casting, enchanting execution, or other gameplay. Static content and research are inputs to those systems, not evidence that they exist.

## 15. Runtime-Ownership Resumption Rule

Only after `0.6.7` acceptance and explicit completion or disposition of the Geographic Knowledge Taxonomy And Location Recognition Contract Plan should current source be re-read to compare activity advancement, rest, and quest turn-in. Select exactly one bounded consumer based on live ownership and risk. Do not preassign `0.6.8`, bundle consumers, or let the content and research programs reopen generic command infrastructure by inference.
