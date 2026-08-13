# Static Content Expansion Program

Date: 2026-08-13
Program versions: `0.6.4`-`0.6.8`
Status: static program `0.6.4`-`0.6.8.1` complete and accepted; Normal persistence `0.6.9` accepted; Ashen Reef `0.6.10.4` repair complete pending production-read-only `0.6.10.5`

## 1. Purpose

The repository has enough strict authority, validation, and runtime separation to author broader static canon deliberately. Static records do not imply that content is simulated, obtainable, buyable, craftable, spawned, discovered, or active in gameplay.

The accepted `0.6.5` pre-authoring blocker proved that the former exact recipe target lacked transformation and quantity authority. The seven research gates and unversioned integration are now accepted. `docs/design/cross-domain-production-research-synthesis.md` owns the revised exact target and preserves `docs/design/0.6.5-research-prerequisite-and-recipe-authority-reconciliation.md` as the route/ownership decision.

Accepted engine ownership for travel, quest acceptance, quest tracking, and activity selection remains unchanged.

## 2. Reproducible Live Inventory

Counts were initially reproduced on 2026-07-14 and advanced through accepted `0.6.6` on 2026-07-27. Normal content lint passes at 67 checked files. Reproduce current counts before every later package.

| Authority | Content and count | Lifecycle or coverage | Readiness | Exact blocker or constraint |
| --- | --- | --- | --- | --- |
| Settlements | `world/settlements.json` — 88 | 14 types across 9 macro regions | `ready-with-reference-constraints` | New identities require geography, scale, trade, and visual-reference closure; enrichment is preferred to filler. |
| Settlement districts | `world/settlement_districts.json` — 14 | 14 active | `expanded-and-validated` | Parent/status coherence; active Knowledge subjects require active records. |
| Settlement sites | `world/settlement_sites.json` — 20 | 20 active | `expanded-and-validated` | Parent/district/status closure; no generic POI substitution. |
| Regions | `world/regions.json` — 41 | established hierarchy | `ready-with-reference-constraints` | New regions require map and hierarchy evidence. |
| Region localities | `world/region_localities.json` — 47 | established locality anchors | `ready-with-reference-constraints` | Reuse current anchors first; new records require geographic and hex closure. |
| Semantic map features | `world/map_features.json` — 8 | 8 planned named semantic identities | `expanded-and-validated` | Named geography only; no generic POI catalog. |
| Visual world-map aggregate | `world/world_map_features.json` — 1 | geometry/reference owner | `authored-input-gated` | Requires authoritative cartography; no fabricated geometry. |
| Resources | `world/resources.json` — 2 | 2 planned | `research-integrated; paused` | Broad expansion still requires a separate bounded seed and relationship/schema decision. |
| Commodities | `world/commodities.json` — 2 | 2 planned | `research-integrated; paused` | Broader paired resource/trade evidence still requires a separate bounded decision. |
| Items | `items/items.json` — 1,372 | 1,114 commodity, 131 tool, 35 weapon, 26 consumable, 24 accessory, 18 armor, 14 clothing, 10 vehicle | `ready-with-reference-constraints` | Marketable identities require value closure; identity does not imply instances, ownership, durability, quality, or availability. |
| Market values | `civilization/market_item_values.json` — 1,617 | static baselines | `ready-with-reference-constraints` | No dynamic price, stock, access, or transaction authority. |
| Consumable profiles | `items/consumable_profiles.json` — 9 | static descriptors | `ready-with-reference-constraints` | References must close; no effect execution. |
| Weapon profiles | no live collection — 0 | schema/validator fixtures only | `requires-small-precondition` | Requires live collection and normal-lint registration before content. |
| Armor profiles | no live collection — 0 | schema/validator fixtures only | `requires-small-precondition` | Same precondition as weapon profiles. |
| Crafting recipes | `crafting/recipes.json` — 28 | 28 planned standard records across 10 families | `expanded-and-validated` | Accepted `0.6.5`; explicit `bounded_design_inference`, reference closure, and resolver quarantine are preserved. |
| Monsters | `world/monsters.json` — 33 | 6 classes; low through severe threats; 9 fauna lineages | `expanded-and-validated` | Static source-local drops only; no unproved mechanics or execution. |
| Source-local monster loot | 77 drop entries and 20 loot entries; 21 monsters empty | embedded descriptors | `expanded-and-validated` | No general loot table, rolls, ownership, payout, or dynamic generation. |
| Fauna | `world/fauna.json` — 132 | 7 types; none through high danger | `research-informed later` | Static ecology only; no population, migration, spawning, harvesting, or output execution. |
| Regional ecology | `world/regional_ecology_profiles.json` — 9 | one per macro region; 9 accepted fauna additions | `expanded-and-validated` | No runtime ecology or trade simulation. |
| Combat roles | `game/combat_roles.json` — 9 | stable vocabulary | `ready-with-reference-constraints` | Reused without expansion in `0.6.6`. |
| Tactics presets | `game/tactics_presets.json` — 9 | linked defaults | `ready-with-reference-constraints` | Defaults do not authorize AI execution. |
| Knowledge domains | `player/knowledge_domain_registry.json` — 7 | 6 active; Arcane Lore planned | `ready-with-reference-constraints` | New snippets require active domains, supported subjects/sources, and live subjects. |
| Knowledge snippets | `player/knowledge_snippets.json` — 28 | 18 General Lore plus natural/religious subjects | `expanded-and-validated` | Informational and non-granting; current `Recognizing ...` records are not recognition mechanics. |
| Elemental vessels and magic production foundations | crystal, spell, conduit, catalyst, enchanter, and material metadata | shard/crystal/cluster tiers and static compatibility data | `research-integrated; implementation-gated` | Synthesis classifies bounded candidates; no casting, enchanting execution, recharge execution, catalyst consumption, or free modern-equivalent technology. |
| Services | `civilization/services.json` — 5 | 5 planned | `paused` | No provider, availability, price, stock, access, or effect authority. |

## 3. Static, Research, And Runtime Boundary

Static content may add identity, prose, classification, geography, districts/sites, infrastructure descriptions, items/profiles, recipe relationships, monster archetypes, habitat/ecology associations, source-local loot descriptors, Knowledge subjects/snippets, and honest lifecycle changes supported by live contracts.

Research may compare external evidence, produce cited temporary artifacts, classify candidates, and recommend future packages. Findings remain non-canonical until integration.

Neither static content nor research may add or claim item instances, ownership/storage mutation, capacity/reservations, durability/quality/spoilage mutation, crafting execution, dynamic availability/vendors/prices/stock/services, encounter/spawn simulation, dynamic loot, NPC population/schedules/workers, construction/property/growth/tax/law enforcement, runtime ecology/economy/reputation/rewards, spell casting, enchanting execution, or magitech operation. Runtime, UI, saves, migrations, dependencies, and gameplay remain outside these packages.

## 4. Geographic And Thematic Coverage Strategy

Use coverage matrices rather than isolated records. Each matrix names regions, parent settlements, scales/types, geographic features, district/site functions, cultural/economic themes, Knowledge subjects, and dependency owners.

`0.6.4` enriched nine existing settlements:

| Cluster | Parents | Purpose | Added |
| --- | --- | --- | --- |
| Verdant Thalos | Aurelis, Vinecross, Redcliff Quay | capital, inland market, and harbor relationships | 4 districts, 6 sites, 2 features, 4 snippets |
| Heart Basin | Riverthrone, Granary Crown, Millrun | river capital, granary, and production-market differentiation | 4 districts, 6 sites, 2 features, 4 snippets |
| Stormcap Coast | Breaksail, Stormwatch Citadel, Cliffsalt Priory | harbor, citadel, and religious coast | 4 districts, 6 sites, 2 features, 4 snippets |

No settlements, regions, localities, visual geometry, services, resources, or commodities were added by `0.6.4`.

## 5. New-Canon Authoring Rules

- Every record must provide geographic, structural, thematic, dependency, Knowledge, or later vertical-slice value.
- Names and descriptions must be grounded, region-specific, and non-duplicative.
- New canon must agree with parent economy, survival, culture, terrain, trade, infrastructure, religion, and map descriptions.
- Use specific owner families; districts/sites are not generic POIs and semantic geography is not visual geometry.
- Lifecycle is authored availability only, not simulation or discovery.
- Do not create aliases, migrations, retired-id compatibility, or historical-id preservation.
- Do not weaken schemas or validators.
- Research recommendations are not canon until integration.

## 6. Settlement, District, And Site Strategy

Major settlements use justified civic, market, production, harbor, defensive, religious, residential, or archival districts and named sites. Smaller settlements receive sites without artificial district layers. Require parent closure, honest status, distinct functions, and non-overlapping summaries.

## 7. Item, Material, And Recipe Strategy

The failed original `0.6.5` target remains historical blocker evidence. The accepted synthesis replaced it with the exact 16-row package now implemented and validated.

The accepted package:

- start from the live 12-recipe baseline;
- build dependency-closed families from outputs backward through inputs, tools, workplaces, skills, item identities, values, and optional chain relationships;
- treat recipe records as owners of bounded static transformations and production chains as macro process context unless live evidence selects a narrow correction;
- classify every quantity as source-backed, bounded design inference, balance placeholder, or authored-input blocked;
- avoid false precision and silent item invention;
- preserve paused resources/commodities;
- remain planned, descriptive, and non-executable.

The target removes the unsupported flour-only pastry and savory-meat-pie rows, increases recipes from 12 to 28 across 10 families, and classifies every selected integer as authored game-scale `bounded_design_inference`.

## 8. Cross-Domain Research Prerequisite

Durable authorities:

- `docs/design/0.6.5-research-prerequisite-and-recipe-authority-reconciliation.md`
- `docs/design/cross-domain-natural-resources-materials-production-and-magitech-research-program.md`
- `docs/design/cross-domain-production-research-synthesis.md`

Required order:

1. `GPT-DR.resources.gathering-extraction`
2. `GPT-DR.ecology.flora-fauna-byproducts`
3. `GPT-DR.agriculture.land-food-livestock`
4. `GPT-DR.materials.refinement-processing`
5. `GPT-DR.food.processing-preservation`
6. `GPT-DR.crafting.tools-workplaces-production`
7. `GPT-DR.magitech.production-infrastructure-substitution`
8. Unversioned integration
9. Revised `0.6.5`

All seven gates, integration, `0.6.5`, and the `0.6.7` artifact audit are complete. The synthesis owns recipe/chain authority and artifact dispositions; all eight temporary research/audit artifacts were removed after their sole-consumer conditions passed.

Research ordinary technology first. Magic may augment or replace modern-like functions only through explicit affinity, vessel, capacity, efficiency, stability, recharge, environment, material, skill, installation, maintenance, scarcity, cost, security, and failure constraints.

## 9. Monster, Ecology, And Loot Strategy

The accepted `0.6.6` implements the exact nine-monster, nine-fauna-lineage, nine-regional-ecology biome/region/role/threat matrix with 28 source-local drop rows. Each row reuses current combat/action vocabulary, closes role/tactics and item/value references, and keeps source-local drop arrays static. Do not infer spawn rules, population simulation, dynamic rolls, new combat mechanics, status execution, gathering, harvesting, body-part execution, crafting, or magic runtime.

## 10. Knowledge Integration

Knowledge is authored with source canon, not filler. Use active domains and declared subject vocabularies. A snippet identifies or contextualizes a live active subject without granting discovery, skill, rewards, travel access, magic, reputation, or runtime consequences. Arcane Lore remains planned.

The complete health planning chain through lethal-process definition owner/schema planning, version classification, implementation, and parent acceptance is complete after `0.6.7`. Current `Recognizing ...` snippets remain structural lore, not implemented recognition criteria. The exact `Version 0.6.8` static health-definition foundation is accepted by `0.6.8.1` with its prescribed focused/schema/combat-health checks plus 71-file normal lint green; mutable health implementation remains `NO_PACKAGE`.

## 11. Batch And Review Policy

Use the largest coherent, dependency-closed, validator-backed batch that remains reviewable. Do not revert to arbitrary tiny seeds or combine world, recipe, and monster packages. Begin each package with live counts, a coverage matrix, explicit targets, collision searches, dependency inventory, and worktree review. Inspect all changed paths.

Deep Research uses one gate and one artifact at a time.

## 12. Exact Sequence And Acceptance

| Route | Package | Acceptance criteria |
| --- | --- | --- |
| `0.6.4` | World And Settlement Static Content Expansion | Complete: target matrix, reference closure, 592 focused tests, and 67-file normal lint passed. |
| GPT-DR program | Seven cross-domain gates | One cited artifact per gate; repo baseline; technology, ecology, materials, food, crafting, and magitech findings; explicit uncertainty and ownership; no implementation. |
| unversioned integration | Cross-Domain Production Research Integration | Seven artifacts reconciled; synthesis created; artifacts dispositioned; recipe/chain authority resolved; exact revised `0.6.5` prompt installed. |
| revised `0.6.5` | Item, Material, And Recipe Static Content Expansion | Complete: exact 16-row dependency-closed batch, 310 focused tests, and 67-file normal lint passed; no execution claims. |
| `0.6.6` | Monster, Ecology, And Loot Static Content Expansion | Complete: exact nine-row regional matrix, 28 source-local drops, full reference closure, 147 focused tests, and 67-file lint passed. |
| `0.6.7` | Cross-Content Coherence And Coverage Audit | Complete: inventories/reference/lifecycle/static-runtime closure passed, prescribed focused tests passed 688/688, normal lint passed at 67 files, and all artifact decisions closed. |
| unversioned support | Geographic Knowledge Taxonomy And Location Recognition Contract Plan | Complete: accepted Geography domain/taxonomy/profile/source/observation/legacy boundaries without implementation. |
| unversioned support | Activity Resolution Existing-System Reuse Audit | Complete and accepted read-only reuse decision; no implementation authority. |
| unversioned support | Functional State, Lethal Process, Care Requirement, And Mortal Crisis Receipt Contract Decision | Complete and accepted documentation authority; bounded research required before any executable or balance-bearing catalog. |
| unversioned integration | Lethal Process And Stabilization Research Integration Decision | Complete: grounded research narrowed into durable process, care, reassessment, and observer boundaries; executable work remains `NO_PACKAGE`. |
| unversioned support | First Lethal-Process Definition And Catalog Plan | Complete: six-process conceptual scope selected; implementation remains `NO_PACKAGE`. |
| unversioned support | Care Capability, Stabilization, And Process-Effect Contract Decision | Complete: grants, availability, access, attempts, results, and owner receipts separated; implementation remains `NO_PACKAGE`. |
| unversioned support | Observer-Safe Crisis Assessment And Presentation Contract Decision | Complete: evidence, assessment, urgency, safe projection, realization, and validator separation accepted; final research artifact retired; implementation remains `NO_PACKAGE`. |
| unversioned audit | Health Runtime Ownership And Dependency Closure Audit | Complete: dependency graph and owner-readiness matrix selected the definition owner-namespace/shared-envelope documentation prerequisite; implementation remains `NO_PACKAGE`. |
| unversioned support | Lethal-Process Definition Owner Namespace And Shared Envelope Schema Plan | Complete: four definition domains, six ids, strict envelope, references, exact paths, and static package boundary accepted; version classification required before implementation. |
| unversioned gate | Lethal-Process Static Foundation Version Classification And Implementation Gate | Complete: classified the dependency-closed static package `CURRENT_BAND_PRIMARY` and assigned `Version 0.6.8`. |
| `0.6.8` | Lethal-Process Definition Static Foundation | Implemented: exactly six canonical definitions, four owner catalogs, one strict shared schema, one pure validator, exact registration, and prescribed checks green. |
| `0.6.8.1` | Lethal-Process Definition Static Foundation Acceptance Audit | Complete: parent accepted without repair; static-only and protected-authority boundaries preserved. |
| unversioned gate | Post-Lethal-Process Static Foundation Next-Capability Classification Gate | Complete: found `0.7.0` `NOT_READY`, selected deterministic Ashen Reef survey advancement, classified its exact owner-contract decision as `UNVERSIONED_PREREQUISITE`, and kept implementation `NO_PACKAGE`. |
| unversioned support | Ashen Reef Survey Activity Advancement Scope And Owner Contract Decision | Complete: accepted one deterministic shift occurrence, shared preview/execution planning, typed owner receipts, distinct identities, atomic accepted-state application, and accepted-only UI; returned `NO_PACKAGE` pending minimum save identity/publication authority. |
| unversioned support | Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision | Complete: accepted minimum identity, migration, candidate-verification, publication, and ledger contracts; returned `NO_PACKAGE` pending Normal activation/continuity/account-publication closure. |
| unversioned support | Normal Stakes Activation, First-Mutation Continuity, And Account-Value Publication Dependency Closure Decision | Complete: returned `PACKAGE_READY` and assigned current-band primary `0.6.9`. |
| `0.6.9` | Normal Stakes Campaign Persistence Foundation | Implemented; parent acceptance reopened by later independent recovery evidence. |
| `0.6.9.1`-`0.6.9.6` | Parent-specific acceptance and repair chain | Complete historical support chain; later audits supersede earlier acceptance claims and culminate in the nine hardened findings. |
| `0.6.9.7` | Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair | Implemented at `ba35dacd`; result `IMPLEMENTED_PENDING_PARENT_AUDIT`. |
| `0.6.9.8` | Initial Defeat And Durable Recovery Completion Acceptance Audit | Complete; found durable completion-lineage repair required. |
| `0.6.9.9` | Durable Recovery Completion Lineage Repair | Complete at `cbad987`; linked fork authority implemented. |
| `0.6.9.10` | Durable Recovery Completion Lineage Post-Repair Acceptance Audit | Historical acceptance claim superseded because no separately installed audit prompt preceded it. |
| unversioned decision | Historical Recovery Fork Evidence Verifiability And Parent Acceptance Reopening Decision | Complete; selected bounded Model C and classified `cbad987` conforming with re-audit required. |
| `0.6.9.11` | Historical Recovery Fork Authority Acceptance Audit | Complete; parent `0.6.9` accepted, survey receipt decision reactivated, `0.7.0` remains `NOT_READY`. |
| unversioned support | Ashen Reef Survey Occurrence, Result, And Consequence Receipt Foundation Decision | Complete with `PACKAGE_READY`: accepted one bounded survey-owned persisted authority, continuity-before-receipt admission, exact retry/repair/correction boundaries, and selected active `Version 0.6.10`; no static-content route changed. |
| `0.6.10` | Ashen Reef Survey Advancement Authority | Implemented at `008db9c...` and repaired at `59af926...` plus `07c5739...`; parent remains unaccepted pending `0.6.10.5`; static catalogs/content remain unchanged and `0.7.0` remains `NOT_READY`. |
| `0.6.10.1` | Ashen Reef Survey Advancement Acceptance Audit | Complete with `REPAIR_REQUIRED`; preserved the positive matrix and did not reopen static content. |
| `0.6.10.2` | Ashen Reef Survey Advancement Authority Repair | Complete at `59af926...` with `IMPLEMENTED_PENDING_POST_REPAIR_AUDIT`; did not add or change static content. |
| `0.6.10.3` | Ashen Reef Survey Advancement Post-Repair Acceptance Audit | Complete with `REPAIR_REQUIRED`; proved two residual authority defects without changing production, tests, or static content. |
| `0.6.10.4` | Ashen Reef Survey Progression Coherence And Projection Placement Repair | Complete at `07c5739...` with `IMPLEMENTED_PENDING_REAUDIT`; repaired only the two residual authority seams and added/changed no static content. |
| `0.6.10.5` | Ashen Reef Survey Progression And Projection Post-Repair Acceptance Audit | Active production-read-only support audit; may decide parent and representative evidence but may not add/change static content. |

## 13. Cross-Content Audit Criteria

Accepted `0.6.7` verified schema compliance, normal lint, semantic validators, duplicate identities, orphan references, settlement/district/site/map/region anchoring, item/resource/commodity/value closure, recipe closure, monster/loot/fauna/lineage/role/tactics closure, Knowledge closure, lifecycle honesty, synthesis compatibility, artifact disposition, route preservation, formatting, and generated-output hygiene. It found no production defect requiring repair. Validators remain unchanged.

## 14. Deferred Integrated Gameplay

Later owner-specific prompts may address inventory/storage, crafting execution, vendors/economy, encounters/spawns, loot rolls/ownership, population/ecology, settlement growth/property/construction, NPC workers/schedules, active magitech, casting, enchanting, or other gameplay. Static content and research are inputs, not evidence these systems exist.

## 15. Runtime Resumption

Run only production-read-only `Version 0.6.10.5 - Ashen Reef Survey Progression And Projection Post-Repair Acceptance Audit` against the twice-repaired parent and retained positive matrix. Do not broaden the audit into production repair, static content, survey turn-in/rewards, geographic Knowledge implementation, broad Stakes modes, checkpoint/death, cloud synchronization, mutable health, or unrelated UI/runtime work. Creator reachability is inspected only for the post-parent representative classification. Static-content expansion remains complete through accepted `0.6.7` and is not reopened by the survey route.
