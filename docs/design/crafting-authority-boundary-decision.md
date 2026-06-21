# Crafting Authority Boundary Decision

Source version/run: Version 0.5.214 - Crafting Authority Boundary Decision
Date: 2026-06-20
Status: approved documentation-only authority boundary; no implementation permission

## 1. Decision Summary

Approve a future top-level `crafting.recipes` static authority for player-facing authored transformations. Keep `items.items` as item identity, `civilization.workplaces` as the first fixed station anchor, `civilization.production_chains` as the current macro-production and embedded recipe-profile owner, and `civilization.market_item_values` as economy-owned value authority.

Do not move or duplicate the 121 existing production-chain `recipeProfile` records. The next schema decision must define how future crafting recipes differ from those profiles and must choose an explicit coexistence or later migration posture before any schema is created.

First-pass recipes should reference canonical `itemKey` values directly for ingredients and outputs, reference item-owned portable tools through audited item keys and narrow tool requirements, and reference existing workplace ids for fixed stations. Professions are deferred. Alchemy and enchanting are future recipe subtypes; repair and salvage remain separate future descriptive profile authorities because they depend on item-instance condition and destruction/recovery semantics. Quality rolls, affixes, and item improvement remain future-only.

Every future crafting record must remain descriptive and reject runtime, inventory, item-instance, price, market, vendor, recipe-unlock, quest-state, Knowledge-progress, trial-completion, storage, UI, and gameplay fields. This document consumes `docs/dev/tmp-crafting-production-systems-research-2026-06-20.md` as planning input, not canon, and implements nothing.

## 2. Live Repo Reality

Live inspection confirms and corrects the temporary research:

- No `packages/content/base/crafting/**` directory, standalone recipe collection, crafting schema, station schema, profession collection, repair/salvage collection, or player crafting-state authority exists.
- `packages/content/base/civilization/production_chains.json` contains 121 records. Every record carries an embedded `recipeProfile` with recipe class, primary skill, external inputs, intermediate items, processing steps, stage references, skill checks, and value-propagation metadata.
- Production chains are registered in normal content lint and receive substantial semantic validation even though no standalone production-chain JSON schema exists.
- `packages/content/base/civilization/workplaces.json` contains 58 records with workforce jobs, required tool tags, input/output profiles, progression, and facility context. A strict workplace schema and semantic validation exist.
- Production steps currently use 70 distinct stage references: 49 `workplace.*` references and 21 `extract.*` references. Extraction references are source stages, not portable crafting stations.
- `packages/content/base/items/items.json` contains 1,372 canonical item identities, including 131 tool-class records. Only a small subset has `useProfiles`; no general item-owned tool-profile authority exists.
- Item content includes seven conduit profiles and three catalyst profiles. These are magic compatibility metadata, not crafting execution.
- `civilization.market_item_values` contains 1,617 economy-owned records keyed by `itemKey`.
- `civilization.guilds` contains 18 broad guild records. Workplace jobs and crafting skills exist, but no canonical profession collection exists.
- Quest definitions, archetypes, and templates contain crafting, masterwork, commission-adjacent, and salvage language. They do not establish recipe authority or execute crafting.
- Player trials include crafting mastery content. Knowledge and trial records remain prerequisite/reference authorities, not crafting mutation.
- Contrary to the research's implication that crafting runtime is wholly absent, the civilization engine already exposes `resolveCraftAtSettlement` and `CraftResolutionState`. It derives input/output, time, cost, waste, quality-factor, and quantity-factor projections from production chains. It does not prove player inventory consumption, item-instance creation, recipe ownership, or player crafting state.

## 3. Crafting Authority Ownership Boundary

| Concern | Canonical owner | Boundary |
| --- | --- | --- |
| Item identity | existing `items.items` | Stable item ids/keys and classification; no instance mutation. |
| Macro production | existing `civilization.production_chains` | Staged economic transformations, skills, variants, value propagation, and current derived craft estimates. |
| Workplace/facility | existing `civilization.workplaces` | Workforce, fixed production capability, input/output posture, and tool requirements. |
| Player-facing recipe | future `crafting.recipes` | Static, declarative transformation and prerequisite references after overlap is decided. |
| Portable tool | existing item identity; later item-owned tool profile if approved | What the tool is; crafting references it without consuming or damaging it. |
| Profession | future `civilization.professions`, deferred | Occupational identity only, not required by first recipes. |
| Guild | existing `civilization.guilds` | Organization identity and descriptive remit; not recipe ownership or execution. |
| Market/value | existing economy authorities | Values, prices, stock, pressure, and transactions; not recipe fields. |
| Player crafting | future runtime/save owner | Known recipes, active orders, inventory mutation, outputs, history, and progression. |

Static references do not consume inputs, create outputs, grant access, prove possession, execute services, or mutate state.

## 4. Recipe Definition Boundary

Future player-facing recipes should live under a new top-level `crafting` authority, beginning with candidate collection `crafting.recipes`. They should not live under `civilization`, because civilization production chains already own macro-production and settlement economy projections. They should not live under items, because items own identities rather than transformations.

A recipe may later own stable identity, name/summary/status, recipe family/subtype, fixed input and output item-key references with positive quantities, byproducts, fixed workplace/station references, portable tool requirements, skill/Knowledge/trial references, deterministic prerequisite descriptors, provenance, and notes.

First-pass recipes should be strongly authored transformations, not scripts, free-form substitution engines, procedural formulas, or command definitions. Recipe existence must not consume items, create item instances, select quality, mutate durability, unlock itself, advance a skill, or emit an event/reward.

The next decision must define the exact distinction between a player-facing recipe and an embedded production-chain `recipeProfile`. Until then, no standalone recipe schema or content is approved.

## 5. Production Chain and Workplace Boundary

Preserve `civilization.production_chains` and every embedded `recipeProfile` in place until a dedicated migration decision. Current content, semantic validation, civilization-engine loaders, consistency checks, runtime economy projections, and tests consume those shapes. This run does not rename, extract, alias, or normalize them.

Production chains continue to own macroeconomic stages, variants, primary/byproduct outputs, skills, processing steps, and value propagation. Future crafting recipes should reference a production-chain id only if the next decision proves that link avoids duplicated transformations.

Use existing `civilization.workplaces` as the first-pass fixed station anchor. A recipe may reference one or more `workplace.*` ids as required facility types. This reference describes required capability only; it does not prove player access, current occupancy, operating tier, staffing, available fuel, tool availability, service access, or production capacity.

Do not turn `extract.*` production stages into crafting stations. Gathering/extraction remains a separate source boundary.

## 6. Item, Material, Ingredient, Reagent, and Commodity Boundary

Preserve `items.items` as canonical identity for all recipe inputs, outputs, ingredients, materials, reagents, tools, catalysts, conduits, and products. "Ingredient," "material," and "reagent" are recipe roles, not competing item registries.

First-pass recipes should reference canonical `itemKey` values directly. This matches production chains, workplace input/output profiles, market values, and current cross-validation. The next schema decision may require item ids for record identity links only if it defines an unambiguous id/key policy; it must not silently mix both.

Do not block recipes on future `world.resources` or `world.commodities`, and do not create those authorities here. Future resource/commodity records may later provide source and bulk-trade semantics, but recipes must not duplicate their identity, geography, stock, depletion, or market posture.

Recipe records must not embed item names, current quantities, owners, containers, prices, durability, quality instances, market stock, or inventory state.

## 7. Tool and Station Boundary

Portable tools remain item-owned. First-pass recipe planning should prefer canonical tool item keys and, where needed, narrow audited tool requirement tags that resolve to item-owned tools. Existing workplace `requiredToolTags` are facility/workforce requirements and must be reconciled before reuse; they are not a separate canonical tool catalog.

A recipe tool reference states compatibility or requirement only. Runtime later decides possession, availability, tier, wear, durability, breakage, reservation, consumption, or substitution.

Fixed stations use existing workplace ids initially. Do not introduce `crafting.station_profiles` in the first recipe pass. A later station-profile decision is justified only if recipes require station capability reusable across several workplaces and cannot express it without duplication.

## 8. Profession, Guild, Service, and Commission Boundary

Professions are deferred and are not required for the first recipe schema. Existing crafting skill ids and workplace job ids may be referenced under their current contracts. Do not infer a profession from a skill, job, backstory, workplace, guild, quest role, or prose.

Existing `civilization.guilds` remains broad organization authority. Guild references may later describe recipe provenance, sponsorship, or eligibility, but must not grant membership, rank, recipe knowledge, station access, discounts, services, commissions, or rewards.

Crafting services and commission offers remain NPC/economy/quest-adjacent authorities. Static commission templates may later reference recipe or output ids, but acceptance, availability, deadlines, progress, delivery, payment, reputation, and vendor/workshop state remain runtime owners.

## 9. Quality, Rarity, Affix, and Item Improvement Boundary

Quality tiers, workmanship grades, rarity changes, random affixes, material rolls, flaw rolls, masterwork outcomes, and item improvement remain future-only. Do not add a quality-profile collection in the first recipe pass.

The current civilization craft projection's `skillQualityFactor` is a derived economic resolution value. It is not canonical item-instance quality, rarity, an affix, or permission to create those systems.

Named masterwork products may remain separate canonical item identities when authored. Future recipes may reference fixed outputs or descriptive eligibility only. They must not roll quality, attach affixes, mutate an existing item, raise rarity, reroll statistics, or replace equipment state.

## 10. Repair, Durability, and Salvage Boundary

Repair and salvage should not be first-pass recipe subtypes. Reserve separate future `crafting.repair_profiles` and `crafting.salvage_profiles` decisions because both depend on item-instance identity, current condition/durability, ownership, destruction/replacement, and recovered-yield rules that ordinary fixed recipes do not own.

Future static profiles may describe eligible item classes/keys, required materials/tools/workplaces, supported condition bands, and possible recovery envelopes. They must remain non-executing.

Runtime/save owners must retain current durability, broken state, selected item instance, consumed repair inputs, restored condition, deleted source item, recovered quantities, output destinations, tool wear, ownership, and history. Quest "salvage" vocabulary may also mean site recovery rather than item dismantling and must not be treated as this authority.

## 11. Alchemy, Enchanting, Catalyst, and Conduit Boundary

Treat alchemy and enchanting as future `crafting.recipes` subtypes initially, not separate top-level authorities. Existing production chains already use `recipeClass: "alchemy"`; future player-facing alchemy recipes must not duplicate those transformations without an explicit link or coexistence rule.

Enchanting remains descriptive and blocked from execution. A future enchanting recipe may reference canonical base/output items, spells or rituals, Knowledge/trials, catalysts, conduits, tools, and workplaces only after each reference contract is approved.

Existing item catalyst/conduit metadata remains item/magic compatibility authority. Alchemy/enchanting records must not grant spell ownership/access, alter readiness, execute casting or rituals, reserve/consume reagents, apply enchantments, mutate charges/durability, create study evidence, advance Knowledge, or create item instances.

Separate alchemy or enchanting collections may be reconsidered only if subtype-specific fields cannot fit the common transformation contract without unsafe optional-field sprawl.

## 12. Quest, Contract, Trial, Knowledge, and Chronicle Boundary

Quests, contracts, trials, Knowledge, and Chronicle authorities may later reference approved recipe, output item, skill, workplace, guild, or commission-template ids. Current crafting/masterwork quest archetypes remain narrative structure, not recipe definitions or execution authority.

Recipe prerequisites may reference existing skill, Knowledge-domain/snippet, or trial ids only as descriptive eligibility. References must not unlock recipes, grant Knowledge progress, complete trials, change quest objectives, create rewards, write Chronicle entries, grant Prestige, or mutate reputation/standing.

Recipe visibility is not recipe ownership. Future known/unlocked recipe state requires a dedicated runtime/save decision and evidence policy.

## 13. Travel, Gathering, Agriculture, and Resource Node Boundary

Travel, gathering, extraction, agriculture, ecology, resource nodes, and weather may later supply crafting inputs or contextual eligibility. They retain source location, abundance, depletion, harvesting, discovery, seasonality, spoilage, travel, and environmental state.

Crafting recipes may reference canonical input items and, after approval, source/resource descriptors. They must not spawn nodes, harvest resources, advance travel, reveal maps, consume field abundance, run agriculture, apply weather, or mutate settlement stock.

Existing production-chain `extract.*` stages remain macro-production source references and are not promoted to player crafting or station authority here.

## 14. Player Crafting Runtime State Boundary

Future player crafting runtime/save state owns known/unlocked recipes, evidence/provenance, selected recipe, selected input item instances, tool/station access, active orders, start/end time, progress, interruptions, success/failure, input consumption, output creation/destination, quality/affix results, repair/salvage changes, skill gains, history, and UI selection.

Current `resolveCraftAtSettlement` and `CraftResolutionState` remain civilization economy projections. They may estimate production inputs, outputs, time, costs, waste, and quality/quantity factors, but they do not establish player recipe ownership or authorize inventory/item mutation.

Static crafting content must reject player/account/session ids, inventory/container state, item-instance ids, current quantities, active orders, progress, unlock flags, current station/tool state, prices, market/vendor state, quest/Knowledge/trial state, commands, events, rewards, persistence, or UI state.

## 15. First Implementation Candidate

The first candidate is the future `crafting.recipes` contract, beginning with a documentation-only `Version 0.5.215 - Recipe And Production Schema Decision`.

That decision must define exact paths, collection id, wrapper, ids, item-key references, input/output/byproduct shapes, workplace/tool/skill prerequisite posture, alchemy/enchanting subtype posture, forbidden fields, validation ownership, and the non-duplicating boundary with existing production-chain `recipeProfile` data.

It must not create schemas, validators, content, tests, loaders, aliases, migrations, runtime adapters, UI, or behavior.

## 16. Future Validation Direction

Future approved validation should enforce:

1. strict records-only wrappers, unique ids, and rejection of unknown/runtime fields;
2. canonical and unambiguous item-key references for inputs, outputs, and byproducts;
3. positive quantities and at least one output;
4. coherent recipe family/subtype and deterministic transformation structure;
5. valid workplace anchors and audited item-owned tool requirements;
6. valid skill, guild, Knowledge, trial, spell, ritual, catalyst, and conduit references only where explicitly supported;
7. no duplicate ownership or contradictory transformation against production-chain `recipeProfile` records;
8. no cycles, impossible dependencies, or uncontrolled substitution without explicit approval;
9. no price/value/market/vendor fields and no copied resource/commodity authority;
10. rejection of inventory, item-instance, owner, quantity-on-hand, durability, quality roll, affix, recipe unlock, active order, progress, quest state, Knowledge progress, trial completion, reward payout, runtime, storage, UI, command, event, or gameplay fields.

This is validation direction only. No schema, validator, or test change is approved here.

## 17. Temporary Research Artifact Handling

`docs/dev/tmp-crafting-production-systems-research-2026-06-20.md` was consumed as planning input and remains temporary, not final canon. This document supersedes it for the authority decisions above.

Keep the artifact through `Version 0.5.215 - Recipe And Production Schema Decision` because it retains candidate field, tool/station, resource/commodity, quality, repair/salvage, alchemy/enchanting, commission, and sequencing questions. That run must delete it if all useful guidance is promoted, or retain it only with a named next concrete consumer and removal condition.

## 18. Non-Goals

- no schema, validator, content JSON, test, Knowledge registry, or snippet changes;
- no economy, item/equipment, combat, quest, magic, NPC/social, travel, geography, religion, family, or civic authority changes;
- no production-chain recipe-profile migration, compatibility alias, or normalization;
- no player crafting/recipe-unlock state, runtime system, UI, storage, command, event, reward, or gameplay behavior;
- no inventory mutation, item consumption/creation, quality roll, random affix, repair/salvage execution, alchemy/enchanting execution, spell access, Knowledge progress, trial completion, quest-state mutation, reward payout, market price mutation, vendor stock mutation, or transition to `0.6.0`.

## 19. Next Recommended Version

`Version 0.5.215 - Recipe And Production Schema Decision`

The already recommended `Version 0.5.213 - Monster Record Schema Decision` and `Version 0.5.210 - Weapon And Armor Profile Schema Decision` remain valid if unlanded. The displaced Quest Objective And Condition Schema Decision also remains valid and deferred.
