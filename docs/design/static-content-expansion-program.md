# Static Content Expansion Program

Date: 2026-07-14
Program versions: `0.6.4`-`0.6.7`
Status: `0.6.4` world/settlement package complete; `0.6.5` item/material/recipe package next

## 1. Purpose

The repository now has enough strict authority, validation, and runtime separation to author broader static canon deliberately. This program inserts three dependency-closed content packages and one coherence audit before another runtime consumer. It does not imply that static records are simulated, obtainable, buyable, craftable, spawned, discovered, or otherwise active in gameplay.

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
| Resources | `packages/content/base/world/resources.json` — 2 | 2 planned | `packages/schemas/world/resource.schema.json` | `tools/content-lint/resources.mjs`; registered | item keys, commodities, owner types | no runtime extraction owner | `paused` | Broad expansion requires gathering/extraction evidence or a fresh docs-first seed decision. Reuse only existing references now. |
| Commodities | `packages/content/base/world/commodities.json` — 2 | 2 planned | `packages/schemas/world/commodity.schema.json` | `tools/content-lint/commodities.mjs`; registered | resources, items, market values, owner types | no dynamic trade owner | `paused` | Paired resource/trade evidence is missing for broader expansion. Reuse only existing references now. |
| Items | `packages/content/base/items/items.json` — 1,372 | 1,114 commodity, 131 tool, 35 weapon, 26 consumable, 24 accessory, 18 armor, 14 clothing, 10 vehicle | `packages/schemas/items/item.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | item keys, skills/use profiles, currency/value rules | inventory/equipment/economy/catalog consumers | `ready-with-reference-constraints` | New marketable identities require market-value closure; static identity must not imply instances, ownership, durability, quality, or availability. |
| Market item values | `packages/content/base/civilization/market_item_values.json` — 1,617 | current static value catalog | `packages/schemas/civilization/market-item-value.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | canonical item keys or allowed external sources, currency/value units | economy presentation/baselines | `ready-with-reference-constraints` | Add only static baselines for valid sources; no dynamic prices, stock, access, or transactions. |
| Consumable profiles | `packages/content/base/items/consumable_profiles.json` — 9 | separate static descriptors | `packages/schemas/items/consumable-profile.schema.json` | registered in `tools/content-lint/index.mjs` | linked item `consumableProfileId` and supported descriptors | item/use presentation | `ready-with-reference-constraints` | Every profile and item reference must close; no effect execution or resource mutation. |
| Weapon profiles | no live collection — 0 | schema/validator fixtures only | `packages/schemas/items/weapon-profile.schema.json` | `tools/content-lint/equipment-profiles.mjs`; focused tests only; not registered | canonical weapon item keys, slots, skills, combat hooks | none | `requires-small-schema-or-validator-precondition` | Before profile content, create the decided live path/wrapper, register normal lint, and seed dependency-closed records. This may occur at the start of `0.6.5` if profiles are in its approved target. |
| Armor profiles | no live collection — 0 | schema/validator fixtures only | `packages/schemas/items/armor-profile.schema.json` | `tools/content-lint/equipment-profiles.mjs`; focused tests only; not registered | canonical armor item keys, slots, skills, mitigation hooks | none | `requires-small-schema-or-validator-precondition` | Same narrow live-collection and lint-registration precondition as weapon profiles. |
| Crafting recipes | `packages/content/base/crafting/recipes.json` — 12 | 12 planned; 8 families, all `standard` subtype | `packages/schemas/crafting/recipe.schema.json` | `tools/content-lint/crafting-recipes.mjs`; registered | input/output item keys, tools, workplaces, skills, production chains, Knowledge refs | no crafting execution owner | `ready-with-reference-constraints` | Dependency-close every family; planned recipes do not imply execution or availability. |
| Monsters | `packages/content/base/world/monsters.json` — 24 | 6 classes; threats: 5 low, 12 moderate, 6 high, 1 severe | `packages/schemas/world/monster.schema.json` | `tools/content-lint/monsters.mjs`; registered | item/value loot refs, combat roles, action packages, optional fauna lineage, tactics | combat/encounter static baselines | `ready-with-reference-constraints` | Reuse executable vocabulary; avoid variants needing unproved lineage or mechanics. Runtime spawning and combat execution remain separate. |
| Source-local monster loot | 49 drop entries and 20 loot entries; 12 monsters have empty loot | embedded in monster records | monster schema | monster semantic checks; registered | item keys and market values | authored reward descriptors only | `ready-with-reference-constraints` | No general loot-table authority, roll execution, ownership, payout, or dynamic generation. |
| Fauna | `packages/content/base/world/fauna.json` — 132 | 7 types; danger: 6 none, 73 low, 35 medium, 18 high | `packages/schemas/world/fauna.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | habitats, item/value outputs | ecology/economy reference content | `ready-with-reference-constraints` | Static ecology only; no population, migration, spawning, harvesting, or output execution. |
| Regional ecology | `packages/content/base/world/regional_ecology_profiles.json` — 9 | one profile per macro region | `packages/schemas/world/regional-ecology.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | regions, climates, biomes, flora, fauna, trade partner regions | world/ecology reference content | `ready-with-reference-constraints` | Profile associations may expand only with existing authority closure; no runtime ecology or trade simulation. |
| Combat roles | `packages/content/base/game/combat_roles.json` — 9 | stable role vocabulary | `packages/schemas/game/combat-role.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | tactics defaults and supported combat vocabulary | combat presentation/baselines | `ready-with-reference-constraints` | Prefer reuse in `0.6.6`; expand only for a proved missing niche. |
| Tactics presets | `packages/content/base/game/tactics_presets.json` — 9 | one linked preset per current role | `packages/schemas/game/tactics-preset.schema.json` | semantic checks in `tools/content-lint/index.mjs`; registered | combat role and supported tactics vocabulary | combat presentation/defaults | `ready-with-reference-constraints` | Defaults do not authorize AI execution; prefer reuse. |
| Knowledge domains | `packages/content/base/player/knowledge_domain_registry.json` — 7 | 6 active, Arcane Lore planned | `packages/schemas/player/knowledge-domain-registry.schema.json` | `tools/content-lint/knowledge-domain-registry.mjs`; registered | supported subject types/sources and policies | Knowledge projection/readiness | `ready-with-reference-constraints` | New snippets must use active domains, declared subject/source vocabulary, and live active subjects. No discovery or skill mutation. |
| Knowledge snippets | `packages/content/base/player/knowledge_snippets.json` — 28 | 18 General Lore plus flora/fauna, mineral, ecology, and religion subjects | `packages/schemas/player/knowledge_snippet.schema.json` | `tools/content-lint/knowledge-snippets.mjs`; registered | domain registry and live subject authorities | descriptive Knowledge content | `expanded-and-validated` | Expand alongside source canon; snippets remain informational and non-granting. |
| Services | `packages/content/base/civilization/services.json` — 5 | 5 planned; `0.6.4` added none | `packages/schemas/civilization/service.schema.json` | `tools/content-lint/services.mjs`; registered | provider anchor types and building service functions | vocabulary only; no availability owner | `paused` | Post-registration audit found no immediate expansion need; no provider, price, stock, or effect authority was added. |

## 3. Static And Runtime Boundary

Static authored expansion may add identity, prose, classification, geography, districts/sites, infrastructure descriptions, items and profiles, recipe relationships, monster archetypes, habitat/ecology associations, source-local loot descriptors, Knowledge subjects/snippets, and honest lifecycle changes supported by live contracts.

It must not add or claim item instances, provenance, ownership/storage mutation, capacity/reservations, durability/quality/spoilage mutation, crafting execution, dynamic availability/vendors/prices/stock/services, encounter or spawn simulation, dynamic loot, NPC population/schedules/workers, construction/property/growth/taxation/law enforcement, or runtime ecology/economy/reputation/reward/faction consequences. Runtime, UI, saves, migrations, dependencies, and gameplay behavior are outside all three content packages.

## 4. Geographic And Thematic Coverage Strategy

Expansion uses a coverage matrix, not isolated records. Each row must name a macro region, region, parent settlements, settlement scales/types, geographic features, district/site functions, cultural/economic themes, Knowledge subjects, and every dependency owner.

The first package enriches existing geography rather than inflating the already broad 88-settlement catalog. Its target matrix is:

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

## 6. Settlement, District, And Site Strategy

Major settlements become structurally distinct through civic, market, production, harbor, defensive, religious, residential, or archival districts and named sites justified by parent canon. Smaller settlements receive sites without artificial district layers when scale does not support them. All districts/sites require parent closure, honest status, distinct functional tags, and non-overlapping summaries.

## 7. Item, Material, And Recipe Closure Strategy

`0.6.5` builds recipe families from outputs backward through inputs, tools, workplaces, skills, item identities, static values, and allowed existing resource/commodity references. It may add a live weapon/armor profile collection and lint registration only as the documented small precondition for an approved profile batch. It must not broaden paused resource/commodity catalogs without their separate reopening trigger. Every added marketable item receives value closure; every recipe input/output/tool/workplace exists and validates.

## 8. Monster, Ecology, And Loot Closure Strategy

`0.6.6` uses a biome/region/role/threat matrix. Each monster fills a distinct niche, uses current combat/action vocabulary, closes role/tactics references, and uses valid item/value loot references. Fauna lineage or regional variants are allowed only when the current schema and validator prove them; otherwise author standalone archetypes. Static loot remains source-local. No spawn rules, population simulation, dynamic rolls, new combat mechanics, or status execution may be inferred.

## 9. Knowledge Integration

Knowledge is authored with source canon, not retrofitted as filler. Use active domains and declared subject vocabularies. A snippet identifies or contextualizes a live active subject without granting discovery, skill, rewards, travel access, magic, reputation, or runtime consequences. Arcane Lore remains planned and cannot receive live snippets in this program absent a dedicated activation decision.

## 10. Batch And Review Policy

Use the largest single coherent, dependency-closed, validator-backed batch that remains reviewable. Do not revert to arbitrary one- or two-record seeds, and do not combine world, item/recipe, and monster packages in one commit. Each package must begin with a live count, coverage matrix, explicit target count, collision search, dependency inventory, and clean/dirty worktree review. Review the complete changed path set and preserve unrelated edits.

## 11. Exact Primary Sequence And Acceptance

| Version | Package | Acceptance criteria |
| --- | --- | --- |
| `0.6.4` | World And Settlement Static Content Expansion | Complete. Target matrix, reference closure, 592 focused tests, and 67-file normal lint passed; no generic POI, geometry fabrication, paused-catalog expansion, or runtime claim. |
| `0.6.5` | Item, Material, And Recipe Static Content Expansion | Coherent recipe families; all item/value/input/output/tool/workplace/skill/profile references close; any equipment-profile precondition is narrow and lint-registered; paused resource/commodity gate preserved; focused tests and normal lint pass. |
| `0.6.6` | Monster, Ecology, And Loot Static Content Expansion | Region/biome/role/threat matrix completed; monster/fauna/ecology/role/tactics/item/value/loot closure; no adjective-only duplicates or unimplemented mechanics; focused tests and normal lint pass. |
| `0.6.7` | Cross-Content Coherence And Coverage Audit | All schemas/semantic validators pass; no duplicate ids/slugs, orphans, status contradictions, generic authorities, runtime claims, or hygiene failures; all coverage matrices reconciled. |

## 12. Cross-Content Audit Criteria

The `0.6.7` audit verifies schema compliance, 67-file-or-later normal lint registration, semantic validators, duplicate identities, orphan references, settlement/district/site/map/region anchoring, item/resource/commodity/value closure, recipe closure, equipment-profile closure if profiles landed, monster/loot/fauna/lineage/role/tactics closure, Knowledge closure, lifecycle honesty, formatting, and generated-output hygiene. Defects receive the smallest repair suffix attached to the content primary that introduced them. Validators must not be weakened to hide defects.

## 13. Deferred Integrated Gameplay Layer

After static acceptance, later owner-specific prompts may separately address inventory/storage, crafting execution, vendor/economy behavior, encounter/spawn selection, loot rolls and ownership, population/ecology simulation, settlement growth/property/construction, NPC workers/schedules, or other gameplay. Static content is input to those systems, not evidence that they exist.

## 14. Runtime-Ownership Resumption Rule

Only after `0.6.7` acceptance should current source be re-read to compare activity advancement, rest, and quest turn-in. Select exactly one bounded consumer based on live ownership and risk. Do not preassign `0.6.8`, bundle consumers, or let the content program reopen generic command infrastructure by inference.
