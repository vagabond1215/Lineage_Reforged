# Combat Authority Boundary Decision

Source version/run: Version 0.5.212 - Combat Authority Boundary Decision
Date: 2026-06-20
Status: approved documentation-only authority boundary; no implementation permission

## 1. Decision Summary

Preserve the live combat content owners rather than create parallel collections. `world.monsters` already owns static enemy archetypes; `world.encounter_templates` owns authored encounter compositions; `world.spawn_profiles` owns descriptive world selection envelopes; and `game.combat_roles` plus `game.tactics_presets` own tactical defaults. These records may describe possible actors and configurations but must not contain encounter-instance or combatant-instance state.

Keep encounter templates and spawn profiles world-owned. Combat runtime may consume their references, but combat content does not absorb them. Keep damage family hook-derived for now. Defer any canonical status/condition collection to a dedicated decision, keep injuries/recovery and death/defeat runtime-only, and preserve monster drops/loot plus quest rewards as source-local descriptive envelopes until a later loot decision.

The first implementation candidate is hardening the existing `world.monsters` authority, not adding `combat.enemy_archetypes`. The next run should therefore be `Version 0.5.213 - Monster Record Schema Decision`, a documentation-only review of the current monster contract and validation boundary.

This document consumes `docs/dev/tmp-combat-encounter-systems-research-2026-06-20.md` as planning input. The artifact is not canon. No schema, validator, content, test, runtime, UI, storage, or gameplay implementation is authorized.

## 2. Live Repo Reality

Live inspection confirms stronger existing authority than the temporary research sometimes implies:

- `packages/content/base/world/monsters.json` contains 24 static monster records governed by `packages/schemas/world/monster.schema.json` and `MonsterRecord`.
- `packages/content/base/world/encounter_templates.json` contains six templates governed by `packages/schemas/world/encounter-template.schema.json` and `EncounterTemplateRecord`.
- `packages/content/base/world/spawn_profiles.json` contains five profiles governed by `packages/schemas/world/spawn-profile.schema.json` and `SpawnProfileRecord`.
- `packages/content/base/game/combat_roles.json` and `tactics_presets.json` each contain nine records with strict schemas and shared tactics types.
- Normal content lint registers these collections and validates cross-references among monsters, encounter members, roles, presets, regions, settlements, world hexes, and encounter weights.
- The world engine resolves spawn candidates from world-owned spawn profiles and encounter templates. The game engine creates mutable encounter and combatant instances from those candidates and static monster records.
- `CombatEncounterState`, `CombatantState`, `CombatActionState`, resource pools, active status effects, action timing, targeting, manual overrides, outcomes, and history entries are live runtime types.
- No canonical static status/condition, injury, wound, recovery, death, or defeat collection exists.
- No explicit canonical damage-type collection or enum exists. Current family resolution uses action templates, item/spell/ability metadata, skills, handling, dispositions, and resolution hooks.
- Monster records embed `drops` and `loot`; quest records embed reward envelopes. No general loot-table collection exists.

Therefore, a new generic enemy-archetype, encounter, spawn, role, or tactics collection would duplicate live authority.

## 3. Combat Authority Ownership Boundary

The canonical split is:

| Concern | Current or future owner | Boundary |
| --- | --- | --- |
| Static enemy archetype | existing `world.monsters` | Identity, classification, descriptive base profile, default role, action-package refs, scaling hooks, and source-local drops/loot. |
| Encounter composition | existing `world.encounter_templates` | Possible member ranges, roles, disposition, movement posture, place/habitat scope, and difficulty. |
| Spawn selection envelope | existing `world.spawn_profiles` | World/place anchors, habitat/hazard filters, descriptive rate/density/hostility, movement filters, and template weights. |
| Tactical role/defaults | existing `game.combat_roles` | Stable tactical vocabulary and role defaults. |
| Tactics preset | existing `game.tactics_presets` | Reusable default preferences, not executed AI. |
| Status/condition definition | future dedicated static authority, if approved | Descriptive identity and semantics only. |
| Items, equipment, spells, abilities, skills | their existing content owners | Define their own identities and supported metadata; combat references them. |
| Combat session and combatants | game-engine runtime | Actual actors, current resources, actions, targets, statuses, outcomes, and history. |
| Loot rolls and rewards | future runtime/item/reward owners | Select, instantiate, transfer, and pay outcomes. |

Static references never imply creation, selection, execution, mutation, payout, or persistence.

## 4. Monster / Enemy Archetype Boundary

Existing `MonsterRecord` and `world.monsters` are the canonical static enemy-archetype authority. Do not introduce a parallel `combat.enemy_archetypes` collection or compatibility alias.

Monster records may own stable identity, slug/name, monster class, threat band, summary, habitat and behavior tags, descriptive base combat profile, default tactical role, action-package references, difficulty-scaling hooks, variant ancestry metadata, and current source-local drop/loot descriptors.

The existing `combatProfile.baseHp`, `baseMp`, and `baseStamina` fields are archetype baselines used to construct instances. They are not current combatant resource pools. Static records must reject combatant ids, current/max mutable resource pools, active status instances, current target/position/team/disposition changes, queued actions, timing, control overrides, incapacitated/defeated/dead flags, injury/recovery progress, rolled loot, rewards, ownership, storage, or UI state.

Named people, companions, guards, and other authored NPC identities remain person/NPC authority. If they later reference a monster or combat profile, that reference does not make the monster record their canonical identity.

## 5. Encounter Template Boundary

`world.encounter_templates` remains world-owned because it describes possible world encounter composition and geographic/habitat eligibility. It does not move under a new combat collection.

Templates may own member monster references with count ranges and role defaults, disposition, movement posture, region and habitat scope, tags, difficulty band, and supported allied-template references. They must not choose exact counts, instantiate combatants, assign runtime ids, place actors, select targets, queue actions, mutate disposition, determine outcomes, or persist a resolved encounter.

An `EncounterTemplateRecord` is not a `CombatEncounterState`. Runtime may retain its id as provenance after creating an encounter instance.

## 6. Spawn Profile Boundary

`world.spawn_profiles` remains a distinct world-owned authority. It describes where and under what authored envelope encounter templates are eligible; it does not execute spawning.

Profiles may own region, world-hex, settlement, site, and habitat anchors; hazard ranges; descriptive daily rate and density; hostility weights; allowed movement modes; and weighted encounter-template references. The existing world engine remains the runtime consumer that resolves candidates.

Profiles must not own current clocks, random seeds, selected candidates, live positions, actor instances, spawn history, cooldowns, population counts, pathfinding, encounter outcomes, or player effects. Future hazard and route-security authorities must reference rather than duplicate spawn composition or selection envelopes.

## 7. Tactical Role and Tactics Preset Boundary

`game.combat_roles` and `game.tactics_presets` already have stable content ownership, schemas, shared types, linting, and runtime consumers. Preserve both.

Roles define stable role vocabulary, preferred action types, and default tactics. Presets define reusable disposition-qualified role/tactics defaults. Their biases, spell preferences, target-rule weights, and focus directives are authored defaults only.

Runtime owns actual AI choice, legal action filtering, current resource evaluation, forced targets/roles/control modes, manual overrides, temporary suspension, pathfinding, positioning, timing, and action execution. Content preferences must not be treated as commands or guaranteed behavior.

## 8. Damage, Defense, Equipment, and Spell Boundary

Keep damage family hook-derived for now. Live content and runtime infer melee, ranged, magic, shield, support, and related behavior from action templates, resolution hooks, skill ids, spell metadata, item handling, and target disposition. No canonical damage-type owner exists, and this pass does not create one.

Items and future weapon/armor profiles own static equipment descriptors; spells, abilities, and skills own their respective identity and supported hooks; combat runtime owns calculations and effect resolution. Combat records may reference approved ids and hooks but must not duplicate item, equipment, spell, ability, skill, target, activation, or compatibility authority.

Damage calculation, mitigation, resource costs, spell execution, ammunition use, durability, equipment mutation, skill gain, status application, and magic compatibility remain runtime or source-owner concerns. The still-unlanded `Version 0.5.210 - Weapon And Armor Profile Schema Decision` remains valid and must reconcile current item `useProfiles` before equipment metadata expands.

## 9. Status, Condition, Injury, and Recovery Boundary

Do not add conditions or injuries to existing monster, encounter, spawn, role, or tactics records. A future static status/condition authority may be introduced only after a dedicated documentation decision defines identity, tags, duration posture, stacking posture, resistance/removal descriptors, provenance, and cross-system references.

Any future static status/condition record must remain descriptive. It must not contain active stacks, magnitude on an actor, source actor, start/expiry ticks, periodic effect progress, current resource changes, current target, or runtime removal state.

Persistent injuries, wounds, disease, trauma, impairment, treatment, healing progress, and recovery remain deferred to dedicated decisions. Current injuries and recovery are runtime/save state, not static combat content. This pass does not approve a combined condition/injury collection.

## 10. Death, Defeat, and Failure Boundary

Death, defeat, incapacitation, surrender, retreat, capture, corpse eligibility, recovery, and failure remain runtime-only outcomes. Current combat runtime already tracks incapacitated/defeated flags and encounter outcomes; static combat records must not pre-store an actor's current outcome.

Future descriptive lethal/nonlethal postures require a dedicated decision before entering static content. Player defeat, NPC/monster death, companion death, quest failure, legal consequences, faction consequences, Chronicle output, corpse creation, and loot eligibility remain with their respective runtime owners.

## 11. Loot, Drop, Reward, and Combat Economy Boundary

Preserve existing monster `drops` and `loot` arrays and quest reward envelopes as source-local descriptive authorities until a later loot decision. Do not create a combat-owned loot table in this pass.

The item boundary prefers a future general `items.loot_tables` authority. A later decision must determine whether source-local envelopes remain embedded or migrate to references. Until then, monster descriptors may list possible item keys, ranges, and chances but must not roll results, generate instances, populate corpses/containers, mutate inventory, transfer ownership, pay currency/XP, mark claims, change market values, or write history.

Economy retains currency, values, prices, stock, transactions, taxes, and trade behavior. Combat content does not own a combat economy.

## 12. NPC, Social, Faction, Civic, Law, and Reputation Boundary

Combat content may later reference canonical people, NPC overlays, factions, guilds, institutions, polities, jurisdictions, or public-order descriptors after those authorities exist. It must not define those identities by inference from combatants or prose.

Witness state, hostility changes, social memory, relationships, favorability, fame/notoriety, faction standing, wanted/bounty state, crimes, legal status, guard response, arrest, court outcomes, service access, and civic consequences remain outside combat content. Runtime events may later route a resolved combat outcome to those owners; static combat records may not apply mutations.

## 13. Quest, Trial, Event, Chronicle, and Knowledge Boundary

Quests, trials, authored events/storylets, Chronicle templates, and Knowledge may reference canonical monsters or encounter templates through approved contracts. Those references do not start combat, spawn actors, complete objectives, grant rewards, write Chronicle entries, or award Knowledge.

Existing quest objectives/conditions remain embedded and non-executable pending the deferred Quest Objective And Condition Schema Decision. Quest state, trial state, event execution, Chronicle writing, journal/history state, Knowledge evidence/progress, and reward/consequence application remain separate owners.

## 14. Travel, Hazard, Environment, and Spawn Integration Boundary

Travel, route, hazard, weather, ecology, biome, and environment authorities may filter or reference world-owned encounter templates and spawn profiles. They must not duplicate encounter member composition, monster archetypes, tactics, or combat state.

Route security and hazards remain future descriptive overlays. Runtime travel and world systems own candidate selection, timing, randomness, location, pathfinding, weather application, and encounter initiation. Combat runtime begins only after an encounter instance is created; it does not own world traversal or spawn selection.

## 15. Player Combat Runtime State Boundary

Player and party combat state remains runtime/save-owned. This includes combat sessions, combatant ids, teams/dispositions, current HP/MP/stamina, current equipment grants, known action grants, status instances, timing, action queues, current targets, tactics overrides, manual commands, incapacitation/defeat, outcomes, skill-gain attempts, and combat history.

Static combat authority must not store player ids, save/account/session ids, current inventory/equipment, current resources, learned/known spells, current cooldowns, active statuses, commands, selected UI state, or mutable history. Catalog visibility or content references do not prove player ownership, readiness, eligibility, or execution permission.

## 16. First Implementation Candidate

The first candidate is the existing `world.monsters` collection and `MonsterRecord` contract. The next pass should audit and decide whether the current strict schema needs narrow hardening, especially around archetype-baseline naming, variants, role/action-package references, source-local loot descriptors, cross-reference validation, and explicit rejection of runtime fields.

Do not create `combat.enemy_archetypes`, rename current ids, add aliases, migrate content, or implement schema changes during that decision pass. Encounter/template/spawn schema work should follow only if the monster decision identifies a concrete dependency.

## 17. Future Validation Direction

Future approved validation should preserve or strengthen:

1. strict records-only wrappers and rejection of unknown/runtime fields;
2. unique monster identities and coherent slug/variant ancestry;
3. complete non-negative archetype baseline profiles and scaling descriptors;
4. valid tactical-role and action-package references;
5. encounter member references, count ranges, role coherence, and allied-template coherence;
6. spawn place anchors, hazard ranges, hostility weights, movement modes, and encounter references;
7. role/preset vocabulary and internal role consistency;
8. supported item keys in source-local drop/loot descriptors without rolling or payout;
9. supported item, skill, ability, spell, action, and hook references where their owners expose stable contracts;
10. rejection of current HP/MP/stamina, active statuses, injuries, death/defeat state, actor placement, action queues, targets, AI execution, rolled loot, rewards, mutations, runtime, storage, UI, or gameplay fields.

This is validation direction only. No validator or test change is approved here.

## 18. Temporary Research Artifact Handling

`docs/dev/tmp-combat-encounter-systems-research-2026-06-20.md` was consumed as planning input and remains temporary. This permanent document supersedes it for authority decisions.

Keep the artifact through the next monster-record schema-decision pass because it still contains candidate field and later status, injury, loot, encounter, and tactics questions. That pass must delete it if all useful guidance is promoted, or retain it only with a named next concrete consumer and removal condition.

## 19. Non-Goals

- no schema, validator, content JSON, test, Knowledge registry, or snippet changes;
- no economy, crafting, item/equipment, quest, magic, NPC/social, travel, geography, religion, family, or civic authority changes;
- no combat runtime, HP/MP/stamina, action queue, AI, pathfinding, status-effect, injury, death, defeat, recovery, loot-roll, item-grant, reward-payout, vendor, economy, faction, reputation, legal, social, quest-state, Chronicle, command, event, storage, UI, or gameplay changes;
- no procedural generation, encounter spawning, migration, compatibility alias, or transition to `0.6.0`.

## 20. Next Recommended Version

`Version 0.5.213 - Monster Record Schema Decision`

That run should remain documentation-only and decide the exact current monster schema boundary, whether any narrow hardening is warranted, validation ownership, cross-reference posture, forbidden runtime fields, later implementation order, and temporary-artifact cleanup without implementing changes.

`Version 0.5.210 - Weapon And Armor Profile Schema Decision` remains valid if it has not landed. The displaced Quest Objective And Condition Schema Decision also remains valid and deferred.
