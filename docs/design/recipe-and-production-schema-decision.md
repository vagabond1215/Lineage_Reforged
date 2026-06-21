# Recipe And Production Schema Decision

Source version/run: Version 0.5.219 - Recipe And Production Schema Decision
Date: 2026-06-21
Status: approved documentation-only schema posture; no implementation permission

## 1. Decision Summary

Approve a future top-level `crafting.recipes` collection for authored player-facing static transformations. Keep it separate from `civilization.production_chains`, which remains the live macro-production authority with embedded `recipeProfile` data.

Preserve all production chains and embedded recipe profiles in place. Do not extract, migrate, alias, normalize, or make future recipes inherit from them. A future recipe may carry an optional `relatedProductionChainId` as a validated, non-inheriting cross-reference when the same transformation has a macro-production analogue. The recipe remains complete in its own player-facing contract, and the link does not make either record an alias or source the other's fields.

First-pass recipes use canonical `itemKey` values for inputs, outputs, byproducts, reagents, catalysts, conduits, and portable tools. Existing `civilization.workplaces` ids are the only approved first-pass fixed station anchors. Buildings, infrastructure, settlements, services, extraction stages, and future station profiles are not first-pass recipe anchors.

Alchemy and enchanting fit as future recipe subtypes when they remain deterministic transformations to canonical output items. Repair and salvage remain separate deferred profile authorities because they operate on item-instance condition, destruction, and recovery. Quality rolls, rarity changes, affixes, masterwork generation, and item improvement remain future-only.

No schema, validator, content, test, runtime, UI, storage, migration, or gameplay change is approved by this decision.

## 2. Live Repo Reality

Live inspection corrects and narrows the temporary research:

- No `packages/content/base/crafting/**` directory, crafting schema, standalone recipe collection, station/tool/profile collection, profession collection, or player crafting-state authority exists.
- `civilization.production_chains` contains 121 live records. Every record has an embedded `recipeProfile`; all are registered in normal content lint and semantically validated without a standalone JSON schema.
- Production chains own `stages`, `primaryOutput`, `byProducts`, optional `facilityStrategy`, optional `variantConfig`, and embedded `recipeProfile` data. There are 311 processing steps and 70 distinct stage references: 49 `workplace.*` and 21 `extract.*`.
- The 121 recipe profiles use 19 recipe classes and six canonical crafting skill ids. They describe external inputs, intermediates, processing steps, step-level skill checks, labor/processing/difficulty posture, and value propagation.
- `civilization.workplaces` contains 58 records and has a strict schema plus semantic validation. Workplaces already own workforce jobs, required tool tags, input/output posture, progression, upgrades, market context, and fixed production capability.
- `items.items` contains 1,372 canonical item records. Every item id equals `item.<itemKey>`; all 1,372 item keys and ids are unique. Production-chain references use `itemKey`, and all 274 distinct referenced keys resolve to current item records.
- The item catalog includes 131 tool-class items, seven conduit profiles, and three catalyst profiles. Portable tool, conduit, and catalyst identity therefore remains item-owned.
- `civilization.market_item_values` contains 1,617 economy-owned records keyed by `itemKey`. Production lint currently requires market coverage for chain item keys, but market values and prices are not recipe fields.
- Buildings host workplace ids and infrastructure defines reusable capability/tier metadata. Neither is a placed crafting station or recipe execution owner.
- Current quests, trials, Knowledge, skills, guilds, magic, and settlement content provide adjacent identity/reference authorities but do not establish recipe ownership or crafting mutation.
- Civilization runtime has existing production-chain-based craft projections. That live behavior does not prove player recipe ownership, inventory consumption, item-instance creation, or player crafting state.

The temporary research's possible `civilization.recipes`, general station authority, tool-profile authority, and immediate resource/commodity dependency are unnecessary for the first recipe contract.

## 3. Existing Production Chain and Recipe Profile Inventory

The live production-chain contract is macro-production authority:

| Layer | Live fields | Authority retained |
| --- | --- | --- |
| Chain identity/output | `id`, `primaryOutput`, `byProducts` | Canonical macro-production chain and aggregate outputs. |
| Staging | `stages` | Ordered extraction/workplace production context. |
| Facility strategy | optional `facilityStrategy` | Facility mode, tier range, ownership models, combo group, and market context. |
| Variants | optional `variantConfig` | Input-driven macro variants, default variant, outputs, byproducts, and labor weighting. |
| Recipe classification | `recipeProfile.recipeClass`, `primarySkillId` | Macro process classification and primary skill context. |
| Process graph | `externalInputs`, `intermediateItems`, `processingSteps` | Multi-stage inputs, intermediates, operations, stage refs, and outputs. |
| Process difficulty | step intensity/difficulty/material modes and `skillCheck` | Workforce/process projection inputs, including efficiency, quality, and quantity dimensions. |
| Value propagation | `recipeProfile.valuePropagation` | Material, labor, processing, difficulty, demand, and carry-forward value logic. |

These fields remain embedded because macro production, lint, economy projections, and tests consume them together. Their use of the term `recipeProfile` does not make them player recipe records.

No production-chain field is renamed or deprecated. No future `crafting.recipes` record replaces a chain, and no chain is required to point back to a recipe.

## 4. Future Recipe Collection Posture

Use collection name `crafting.recipes`, not `civilization.recipes` and not a differently named `crafting.*` collection. Recipes describe player-facing transformation knowledge, while civilization owns aggregate production and economy projection.

Candidate future paths and identity posture:

- content: `packages/content/base/crafting/recipes.json`;
- schema: `packages/schemas/crafting/recipe.schema.json`;
- wrapper: strict `{ "records": [...] }`;
- record id: `recipe.<slug>`;
- strict records with no additional properties.

The first schema candidate should require:

- `id`, `slug`, `name`, `status`, `summary`;
- `recipeFamily` and `recipeSubtype`;
- non-empty `inputs` and `outputs` arrays;
- `requiredWorkplaceIds`, `requiredToolItemKeys`, and `skillRequirements`, allowing empty arrays where the transformation needs none;
- optional `prerequisiteRefs` limited to approved canonical authorities;
- optional `relatedProductionChainId` as a non-inheriting cross-reference;
- `sourceAuthorityNotes` and `notes` for provenance and authoring limits.

Each input/output entry should contain `itemKey`, positive integer `quantity`, and a controlled role. Initial input roles are `ingredient`, `material`, `reagent`, `catalyst`, and `conduit`; initial output roles are `primary` and `byproduct`. Exactly one output is primary. The same item key must not appear twice in the same role; validation should reject no-op transformations unless a later item-improvement decision explicitly permits them.

`recipeSubtype` begins with `standard`, while `alchemy` and `enchanting` are reserved future subtypes under the same common contract. `recipeFamily` is a controlled crafting-domain vocabulary informed by, but not mechanically identical to, the 19 macro `recipeClass` values.

Do not add scripts, effect payloads, commands, time/cost formulas, substitution expressions, generated variants, market values, execution outputs, or mutable state.

## 5. Production Chain vs Player-Facing Recipe Boundary

Production chains answer: how does a civilization, facility network, or economy transform resources through stages and propagate labor, difficulty, and value?

Player-facing recipes answer: which fixed canonical item quantities may be transformed into which fixed canonical item quantities, and which static item/workplace/skill/prerequisite references describe eligibility?

Recipes must not duplicate these macro-production fields:

- extraction/workplace `stages` or multi-stage process graphs;
- `facilityStrategy`, facility tiers, ownership models, combo groups, or market context;
- `variantConfig`, automatic input variants, labor weights, or production substitutions;
- intermediate economic stage inventories;
- labor intensity, processing intensity, material difficulty mode, or value propagation;
- demand bands, costs, prices, wages, workforce slots, jobs, efficiency curves, production rates, or settlement projections;
- production-chain skill quality/quantity projection rules.

Keep embedded `recipeProfile` records permanently in place under current authority unless a later dedicated migration decision proves extraction is necessary. No migration is currently recommended.

The optional future `relatedProductionChainId` only records an audited relationship. It must resolve to a live chain, must not import or override fields, and must not be required for recipes without a macro analogue. Multiple player-facing recipes may reference one chain only when they represent explicitly authored variants; validation should require their item transformations to remain distinguishable.

## 6. Item, Material, Ingredient, Output, Byproduct, Reagent, Catalyst, and Conduit Reference Posture

Use direct canonical `itemKey` references for every item role. Do not use item ids in recipe entries, because live production, workplace, and market-value cross-references consistently use `itemKey`; the item validator already proves the mechanical `item.<itemKey>` identity relationship.

Ingredient, material, output, byproduct, reagent, catalyst, and conduit are roles within a transformation, not separate item authorities. Do not duplicate item names, classes, tags, values, profiles, marketability, spoilage, durability, or inventory properties in recipes.

Catalyst and conduit inputs use item keys like all other inputs. For future alchemy/enchanting subtypes, semantic validation may additionally require the referenced item to carry the applicable item-owned `catalystProfile` or `conduitProfile`. The recipe must not copy that profile or interpret it as spell execution permission.

Do not block first-pass recipes on future `world.resources` or `world.commodities`. Those authorities may later describe natural sources and bulk trade forms, but recipes continue to transform canonical item identities unless a dedicated decision changes the contract.

Quantities are authored positive integers. The static record describes a deterministic batch transformation only; it does not inspect inventory, reserve or consume inputs, generate outputs, choose substitutions, or create item instances.

## 7. Tool, Workplace, Building, Infrastructure, Station, and Settlement Anchor Posture

Portable tools remain `items.items` records. First-pass recipes use `requiredToolItemKeys` with direct item keys that must resolve to tool-class items. Do not create `crafting.tool_profiles`, copy item tags, or treat workplace `requiredToolTags` as a canonical portable-tool vocabulary.

A portable-tool reference is descriptive and non-consuming. Runtime later owns possession, accessibility, count, tier, compatibility, substitution, reservation, durability, wear, breakage, and use.

Use `requiredWorkplaceIds` for first-pass fixed station capability. Each id must resolve to `civilization.workplaces`. The reference says that the transformation requires that kind of fixed production environment; it does not prove a placed station, settlement availability, access, staffing, operating tier, fuel, services, ownership, capacity, or execution.

Do not reference:

- `extract.*` stages as stations;
- `civilization.buildings` directly, because buildings are reusable templates that may host workplaces;
- `civilization.infrastructure` directly, because infrastructure owns reusable capability/tier definitions;
- settlement ids, because a recipe is portable authored knowledge rather than place-specific content;
- future station ids, placed sites, service providers, vendors, or property anchors.

Regional or institution-specific access belongs in separate descriptive prerequisite/reference layers after those authorities are stable, not in the core transformation shape.

## 8. Alchemy and Enchanting Posture

Alchemy and enchanting are future `crafting.recipes` subtypes, not separate collections, when they fit the common deterministic item-key transformation contract.

Alchemy may use reagent/catalyst input roles and canonical alchemical output items. It may require an alchemy workplace, tool items, skills, Knowledge, or trials descriptively. It must not execute effects, consume inventory, roll potency, create condition state, or grant progress.

Enchanting may use a canonical base-item input, catalyst/conduit inputs, and a distinct canonical enchanted output item. It may reference approved spell, ritual, Knowledge, trial, magic-study, skill, or workplace authorities descriptively after semantic contracts exist. It must not mutate an existing item instance, add an affix, execute a spell/ritual, grant spell ownership, alter readiness, consume magic resources, or create study evidence.

Subtype-specific fields beyond common item roles and prerequisite refs are deferred. If future enchanting requires arbitrary target mutation or effect payloads, it no longer fits the base recipe contract and needs a separate decision before schema expansion.

## 9. Repair, Salvage, Durability, Quality, Rarity, Affix, and Item Improvement Posture

Repair and salvage are not recipe subtypes in the first collection. Defer them to separate future descriptive `crafting.repair_profiles` and `crafting.salvage_profiles` decisions, or another later owner selected by those decisions.

Repair depends on an existing item's current condition, durability, damage, materials, and restoration limit. Salvage depends on destroying or consuming an existing item and resolving recovered quantities. Those are item-instance operations, not fixed creation transformations.

Defer all of the following:

- current durability/condition and repair execution;
- salvage execution, destruction, recovery ratios, and recovered quantities;
- output quality ranges or rolls;
- rarity changes;
- random or selected affixes;
- masterwork generation;
- material substitution and flexible formulas;
- item improvement, upgrade, reforging, or mutation of an existing instance.

Named masterwork or enchanted outcomes may later be distinct canonical item identities and deterministic outputs, but recipes must not generate rarity/affix state. Quality, rarity, and improvement systems require dedicated item-instance and runtime decisions.

## 10. Skill, Profession, Guild, Knowledge, Trial, Magic, Quest, Commission, and Service Prerequisite Posture

Prerequisite references are descriptive eligibility metadata only. They do not prove player state, grant access, advance progress, execute services, or mutate any owner.

First-pass posture:

- skills may appear as `skillRequirements` containing canonical skill id and positive minimum rank;
- existing guild, Knowledge-domain/snippet, and trial ids may appear in a constrained `prerequisiteRefs` object only after the schema pass confirms exact active-authority validation;
- professions remain deferred because no canonical profession collection exists;
- magic-study, spell, ritual, quest, commission, service, and settlement references remain deferred from the first base schema unless a subtype-specific decision proves a stable need;
- production-chain relationship uses only optional `relatedProductionChainId`, not a prerequisite;
- market values, prices, stock, wages, transactions, reputation, legal access, and service availability never belong in recipe prerequisites.

Future alchemy/enchanting extensions may add canonical magic/Knowledge/trial references without granting spell ownership, readiness, study evidence, Knowledge progress, or trial completion. Future quests or commissions may reference recipe ids and output item keys; recipes must not reference mutable quest/commission state or pay rewards.

## 11. Validation Hardening Direction

The conditional `Version 0.5.231 - Crafting Recipe Schema And Validator` may implement the approved base contract only after a fresh scope check. That later pass should include a strict schema, a pure semantic validator, focused in-memory tests, and schema-file registration before any content seed.

Candidate validation requirements:

1. strict records wrapper, no additional properties, unique ids/slugs, and `recipe.<slug>` coherence;
2. controlled status, family, subtype, input-role, and output-role vocabularies;
3. non-empty inputs/outputs, positive integer quantities, exactly one primary output, and duplicate-role rejection;
4. every item key resolves to `items.items`; tool keys resolve to tool-class items;
5. catalyst/conduit roles resolve to applicable item-owned profiles when subtype rules require them;
6. workplace ids resolve to `civilization.workplaces`; no building, infrastructure, settlement, extraction, service, or runtime anchors;
7. skill and approved prerequisite ids resolve to canonical active authorities;
8. optional `relatedProductionChainId` resolves without inheritance, aliasing, or implied execution;
9. reject no-op cycles, direct self-transformations, and unsupported flexible substitutions;
10. reject macro-production, value-propagation, market, workforce, runtime, inventory, item-instance, state, command, event, reward, UI, storage, migration, and gameplay fields.

The later pass must not edit production chains, items, workplaces, market values, quests, Knowledge, magic, or settlements. Recipe content remains a separate seed-plan decision after schema/validator approval.

## 12. Temporary Research Artifact Handling

Delete `docs/dev/tmp-crafting-production-systems-research-2026-06-20.md` in this pass.

Every useful concern has been promoted:

- broad crafting/production/item/runtime ownership lives in `docs/design/crafting-authority-boundary-decision.md`;
- the exact collection, coexistence, fields, item references, anchors, subtype, prerequisite, and validation posture lives in this document;
- resource/commodity, tool/station, repair/salvage, quality, profession, commission, content-seed, and runtime sequencing remains in permanent decisions, the consolidation roadmap, sequenced plan, and backlog.

There is no remaining consumer for the temporary artifact. Its old version sequence and unresolved live-repo questions are superseded. Future follow-ups must use permanent decisions and a fresh live-repo audit.

## 13. Non-Goals

This decision does not authorize:

- schema, validator, test, content JSON, runtime, UI, storage/save-state, migration, or gameplay changes;
- production-chain, recipe-profile, workplace, building, infrastructure, item, market-value, quest, Knowledge, magic, trial, or settlement edits;
- recipe, tool, station, quality, repair, salvage, alchemy, enchanting, resource, commodity, profession, commission, or player-state schemas/content;
- extraction, normalization, migration, aliases, compatibility behavior, or item key/id conversion;
- recipe execution, unlock state, crafting orders/history, inventory mutation, item consumption/creation, tool wear, station/service access, transactions, or rewards;
- quality rolls, rarity/affix generation, masterwork generation, item improvement, repair/salvage execution, alchemy/enchanting execution, spell/ritual behavior, Knowledge/trial progress, quest mutation, or economy simulation;
- transition to `0.6.0`.

## 14. Next Recommended Version

Proceed with `Version 0.5.220 - Monster Record Schema Decision`.

That pass remains documentation-only. It should audit the existing `world.monsters` schema and content, preserve existing encounter/spawn/role/tactics owners, define later hardening direction, and decide the combat research artifact's retirement.

No new GPT Deep Research is required before `0.5.220`. GPT Deep Research gates remain supplemental non-Codex labels and do not consume `0.5.x` version numbers.
