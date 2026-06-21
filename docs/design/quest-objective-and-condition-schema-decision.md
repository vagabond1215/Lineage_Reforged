# Quest Objective And Condition Schema Decision

Version: `Version 0.5.222 - Quest Objective And Condition Schema Decision`

Status: approved documentation-only schema posture

## 1. Decision Summary

Keep quest objectives and conditions embedded in their current owning records. Approve future reusable JSON Schema components for the duplicated authored structures in quest definitions and quest archetypes, but do not create standalone objective or condition content collections and do not give embedded components independent global ids.

`civilization.quest_definitions`, `civilization.quest_archetypes`, and `civilization.quest_templates` remain separate live authorities. Definitions and archetypes should later share schema definitions for their common requirement, action-tree, action-node, check, branch, deployment, and logistics shapes. Templates must retain their distinct parameterized generation-input contract. Generated `QuestOfferObjective` values remain runtime offer output, not authored objective authority.

All authored objective, condition, reward, consequence, and branch data remains static and descriptive. Generated offers, accepted/completed quest state, progress, condition satisfaction, reward execution, journal/Chronicle mutation, timers, cooldowns, events, and UI remain with their existing or future runtime/player/session owners.

No schema, validator, content, test, runtime, UI, storage, migration, or gameplay change is authorized by this decision.

## 2. Live Repo Reality

- `civilization.quest_definitions` contains five strict authored records. Each owns one unique quest, eligibility requirements, scheduling/classification, deployment/logistics, a descriptive reward envelope, and an embedded action tree.
- `civilization.quest_archetypes` contains eight strict reusable authored records. Each owns baseline requirements, classification, deployment/logistics, outcome/failure/reward-driver descriptors, scaling axes, and an embedded action tree.
- `civilization.quest_templates` contains 36 strict repeatable-offer inputs. Templates select generation sources, guild types, item keys, settlement tags, monster ids, thresholds, and reward profiles; they do not contain authored action trees or condition arrays.
- Definition and archetype schemas duplicate the same action-tree, action-node, action-check, branch-outcome, deployment, role, and logistics shapes. Their requirement shapes are nearly identical, with standing requirements currently definition-only.
- Content lint already resolves definition/archetype attributes, skills, abilities, spells, traits, item keys, monster ids, guild slugs, role ids, and action-tree links. Template lint resolves guild slugs, monster ids, and item keys against current market-item authority.
- Civilization quest generation consumes templates plus economy, settlement, guild, and monster data to create mutable `QuestOfferState` records. `QuestOfferObjective` currently supports `deliver_item`, `defeat_monster`, `labor`, `escort`, `survey`, and `salvage` output with optional item, monster, or target-tag fields.
- Mutable owners already include civilization `activeOffers`, player `activeQuestIds` and `completedQuestIds`, session `QuestJournalEntryState[]`, and session/player/account Chronicle state and projections.
- Quest giver `entityId` and contact strings are not canonical people. No standalone authored objective, condition, reward, quest-state, or Chronicle-template collection exists.

The temporary research artifact was correct about separating authored descriptors from mutable state, but stale about whether live quest collections and player/runtime owners existed. Live repo authority controls this decision.

## 3. Existing Quest Definition, Archetype, and Template Inventory

Quest definitions are canonical for unique authored quests. Their identity and surrounding fields remain unchanged. Their embedded action trees currently contain 20 nodes across five records and describe authored stages, checks, branch outcomes, and completion links.

Quest archetypes are canonical reusable quest-family structures. They are not generated offers and are not aliases for definitions. They provide reusable action flow and baseline posture for gathering, escort, extermination, porter, crafting, labor, salvage, and masterwork families without tracking any player's use of them.

Quest templates are canonical repeatable offer inputs for current civilization generation. They are parameterized by economic, frontier, and security facts. A template is not an authored objective graph, accepted quest, commission instance, task-board entry, journal entry, or Chronicle record.

Do not merge these collections. Do not add a parallel quest collection. Their separate identities and consumers are intentional.

## 4. Objective Structure Inventory

The current authored objective-equivalent contract is the embedded `actionTree` shared by definitions and archetypes:

- tree fields: `entryNodeId`, `completionNodeIds`, and `nodes`;
- node fields: `id`, `label`, `phase`, `summary`, `estimatedHours`, `assignedRoles`, `participantRange`, `checks`, and `branches`;
- check fields: `kind`, `targetId`, `minValue`, `weight`, `optional`, and `notes`;
- branch-outcome fields: `nextNodeId`, `questState`, `summary`, and descriptive `effects` strings;
- branch keys currently express authored result bands such as success, partial, failure, and critical variants;
- adjacent archetype descriptors include outcome metrics, failure states, reward drivers, and scaling axes.

These fields are authored static quest-design authority. They describe intended flow, checks, outcomes, and graph coherence; they do not execute checks, select branches, update counters, apply effects, or establish player progress.

The generated `QuestOfferObjective` structure is a separate runtime projection produced from templates. It must not be retrofitted into definition/archetype records or treated as the canonical authored objective schema.

## 5. Condition Structure Inventory

Current authored condition-equivalent data is distributed across explicit structures rather than one universal condition array:

- definition `requirements`: minimum level, class-tag alternatives, required skills, abilities, spells, traits, item keys, standing requirements, and notes;
- archetype `baselineRequirements`: the same core requirement families except standing requirements;
- action-node checks: typed target, threshold, weight, optionality, and notes;
- deployment role preferences and party-size rules;
- template generation constraints: generation source, guild types, settlement tags, item/monster targets, minimum quantity, shortfall threshold, and trade-surplus threshold;
- scheduling and repeatability descriptors on definitions.

These are static gating, eligibility, generation, and authored resolution descriptors. They do not evaluate player/world facts. `questState` and branch effect strings describe authored outcomes, not current state or executable mutations.

## 6. Future Objective Schema Posture

Approve reusable schema components, not standalone objective records.

A later `0.5.234` validation pass may extract the duplicated action-tree, node, check, participant-range, branch-set, and branch-outcome definitions into a shared civilization quest schema library or equivalent shared `$defs`. Definitions and archetypes should reference that common contract while keeping the actual trees embedded in each record.

Do not introduce `civilization.quest_objectives`, `player.quest_objectives`, independent objective ids, objective content files, objective registries, or objective references in place of current embedded nodes. Independent identity has not been demonstrated: current node ids are meaningful only inside their owning tree, and their labels, roles, checks, and branches depend on that owner.

Templates do not adopt this authored action-tree contract. Generated offer objectives remain a shared runtime type owned by civilization generation.

## 7. Future Condition Schema Posture

Approve reusable schema components for repeated requirement and check shapes, not standalone condition records.

A later validation pass may share threshold-reference, item-reference, requirement, action-check, and related structural definitions between definitions and archetypes. It may preserve definition-only standing requirements through a narrow extension or owner-specific wrapper. Template generation constraints remain template-local because they gate offer generation rather than quest eligibility or action resolution.

Do not introduce `civilization.quest_conditions`, `player.quest_conditions`, independent condition ids, a generic condition registry, or an executable condition language. Current field families are not semantically interchangeable, and forcing all requirements, checks, schedule descriptors, and generator thresholds into one union would erase ownership.

## 8. Definition, Archetype, and Template Boundary

Definitions and archetypes should share only the schema components that already represent the same authored concepts. They retain separate top-level schemas, ids, surrounding fields, and content purposes.

Templates do not share the same objective/condition contract. Their parameterized item, monster, settlement-tag, guild, quantity, economy, frontier, and security inputs are authored generation policy. They may continue producing `QuestOfferObjective` runtime descriptors without storing generated offer ids, issuer instances, urgency, calculated rewards, selected targets, or current objectives.

Archetypes and templates may remain reusable and parameterized without becoming runtime generation state. Archetypes describe reusable authored quest flow; templates describe repeatable-offer selection inputs. Neither records an instantiated commission, errand, task, rumor, hook, accepted quest, or player result.

## 9. Item, Monster, Encounter, Settlement, Region, Map, Route, Knowledge, Trial, Magic, Spell, NPC, Guild, Faction, Service, Workplace, and Resource Reference Posture

Use canonical `itemKey` for item requirements, tools, consumed items, item checks, template targets, bonus-item candidates, and item reward descriptors. Current lint and content already use item keys rather than `item.<itemKey>` ids in these quest fields. Do not mix forms within the same contract.

Preserve current supported references:

- canonical attribute, skill, ability, spell, and trait ids where current schemas/lint support them;
- canonical monster ids in archetype/template monster fields;
- canonical settlement ids where current definition/reputation fields support them;
- current guild slugs in archetype/template guild fields;
- item keys for all existing item relationships;
- owner-local role ids, node ids, result-band keys, tags, and RNG/check tokens where they are intentionally local vocabulary.

Future objectives or conditions may reference encounters, regions, map features, routes, Knowledge, trials, magic-study sources, rituals, people/NPCs, factions, services, workplaces, resources, discovery subjects, or other authorities only after the referenced authority and a typed field are approved. A generic `targetId` must not become permission to place arbitrary cross-system ids in current content.

People/NPCs, services, map features, and resources remain separate queued decisions. Their absence does not block the current shared-schema posture: future typed reference branches can be added later without standalone objective records. Current giver/contact strings, service tags, settlement tags, resource taxonomy tokens, office ids, and synthetic labels must not be promoted to canonical ids by inference.

## 10. Reward, Consequence, Commission, Rumor, Hook, Event, Journal, and Chronicle Boundary

Current definition `rewards`, template `rewardProfile`, archetype reward drivers, action-tree branch effects, failure states, and consequences remain source-local descriptive envelopes. They may preview intended coin, standing, reputation, item, unlock, failure, or consequence posture, but they do not execute payout or mutation.

A future dedicated reward/loot/consequence decision must reconcile quest rewards with monster/encounter loot, items, economy, reputation, services, Knowledge, magic, property, and other outputs before any general reward authority is introduced. This decision does not create one.

Commissions, errands, tasks, and repeatable board work remain template/generated-offer territory unless a later contract/task-board decision proves a separate authored owner. Rumors and hooks may reference candidate quests or reveal posture later but do not become quest objectives or conditions. Events/storylets remain authored seeds outside this schema decision. Journal and Chronicle templates remain distinct from mutable journal and Chronicle records.

## 11. Generated Offer, Player Quest State, Runtime Progress, Completion, Cooldown, Timer, and UI Boundary

Civilization generation owns generated offers, selected template/settlement/guild/monster/item targets, urgency, calculated reward previews, and generated `QuestOfferObjective[]` values.

Player/session/save/runtime owners retain or will own acceptance, active/completed/failed/abandoned state, objective progress, counters, hidden/revealed flags, condition satisfaction, branch selection, generated-instance identity, reward claims, cooldowns, timers, expiration, journal entries, Chronicle records, map markers, dialogue flags, commands, events, and UI projections.

Static definition, archetype, template, objective, condition, reward, or consequence structures must not store or mutate any of those values. Authored `repeatable`, duration, due-window, planning-window, result-band, and `questState` descriptors are design policy, not live clock or player state.

## 12. Validation Hardening Direction

`Version 0.5.234 - Quest Objective And Condition Validation Pass` is conditionally approved as the first implementation candidate from this decision. It should remain schema/validator/focused-test work and should not edit quest content unless a separately approved correction is unavoidable and explicitly scoped.

That pass should consider:

1. extracting shared schema components used by definitions and archetypes while preserving embedded storage;
2. preserving strict top-level wrappers and separate definition/archetype/template schemas;
3. enforcing action-tree entry, completion, node, role, and branch-link coherence;
4. enforcing owner-local uniqueness for node and role ids;
5. preserving typed current reference resolution for attributes, skills, abilities, spells, traits, items, monsters, guilds, and settlements;
6. standardizing current item relationships on canonical `itemKey`;
7. narrowing check kinds and validating kind-specific target forms without creating a universal cross-system target registry;
8. reviewing opaque effect strings, party-size condition strings, standing ids, class/equipment tags, generator tokens, and RNG target tokens as later normalization candidates rather than silently canonizing them;
9. keeping template generation inputs separate from generated `QuestOfferObjective` runtime output;
10. rejecting global objective/condition ids, standalone collections, executable expressions, progress/state, reward execution, event execution, journal/Chronicle mutation, timers, cooldowns, UI, storage, and gameplay fields.

Reference validation for future people, services, encounters, regions, map features, routes, resources, Knowledge, trials, magic-study sources, rituals, factions, and discovery systems remains deferred until those authorities are stable. Existing supported references should continue resolving in the later validation pass.

## 13. Temporary Research Artifact Handling

Delete `docs/dev/tmp-quest-event-chronicle-systems-research-2026-06-20.md` in this pass.

Its useful authority boundaries are now permanently owned by `docs/design/quest-event-chronicle-authority-boundary-decision.md` and this decision. Candidate quest arcs, contracts/task boards, events/storylets, rumors/hooks, rewards/consequences, Chronicle templates, integrations, validation, and runtime-state concerns are either promoted into permanent decisions/backlog or explicitly deferred here. No named future consumer remains.

Future narrative work must start from permanent design docs and a fresh live-repo audit rather than restoring or treating the temporary report as canon.

## 14. Non-Goals

- no schema, validator, content JSON, test, runtime, UI, storage/save-state, or migration changes;
- no quest record edits, field moves, renames, splits, normalization, aliases, replacement collections, objective migration, or condition migration;
- no objective, condition, event, reward, Chronicle, player quest-state, generated-offer, service, person/NPC, faction, discovery, map-feature, or resource schema;
- no quest execution, offer acceptance, progress tracking, condition evaluation, branch selection, reward/consequence execution, loot roll, item-instance creation, inventory mutation, event execution, commission generation, timer/cooldown execution, journal mutation, Chronicle mutation, map marker, or gameplay behavior;
- no new Deep Research run and no transition to `0.6.0`.

## 15. Next Recommended Version

Proceed with `Version 0.5.223 - Person vs NPC Schema Decision`.

That run remains documentation-only. It should decide exact authored person and NPC-overlay schema posture, preserve generated/runtime character owners, and decide the NPC/social temporary research artifact's retirement.

No new GPT Deep Research is required before `0.5.223`. GPT-DR gates remain non-Codex labels, and the permanent prompt-pack guidance does not interrupt the immediate numbered queue.
