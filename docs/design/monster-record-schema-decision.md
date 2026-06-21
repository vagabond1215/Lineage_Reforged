# Monster Record Schema Decision

Source version/run: Version 0.5.220 - Monster Record Schema Decision
Date: 2026-06-21
Status: approved documentation-only schema posture; no implementation permission

## 1. Decision Summary

Keep existing `world.monsters` as the canonical static monster identity, archetype, descriptor, and authored combat-baseline authority. Do not introduce `combat.enemy_archetypes`, replace the collection, split the schema, move fields, or normalize current content.

Preserve `world.encounter_templates`, `world.spawn_profiles`, `game.combat_roles`, and `game.tactics_presets` as separate authorities. Encounter templates compose monster records; spawn profiles place and weight encounter templates; combat roles define reusable tactical roles; tactics presets define reusable tactical defaults. Monster records do not own encounter composition, spawn placement, or AI execution.

Keep current `drops` and `loot` source-local. A future general loot-table authority should be a separate item-owned collection, provisionally `items.loot_tables`, but no field migration or table reference is approved until a dedicated loot decision reconciles monster drops, encounter rewards, quest rewards, harvests, and item identity.

Treat `threat`, `combatProfile`, `defaultRole`, `actionPackageIds`, and `difficultyScalingHooks` as authored static baselines, not combatant-instance state. Statuses, conditions, injuries, morale, fear, poison, disease, death, defeat, recovery, AI state, targeting, initiative, cooldowns, threat state, rewards, and item-instance generation remain outside monster records.

No schema, validator, content, test, runtime, UI, storage, migration, loot, combat, AI, or gameplay change is approved by this decision.

## 2. Live Repo Reality

Live inspection confirms and narrows the temporary combat research:

- `packages/content/base/world/monsters.json` is a live records-only authority with 24 records.
- `packages/schemas/world/monster.schema.json` is strict, rejects additional properties, defines 20 properties, and requires 14. All live records use the same required core; none currently uses the six optional lineage/variant/origin fields.
- All six allowed monster classes and all four threat bands are represented. Six of nine canonical tactical roles and two of three preferred ranges are currently used.
- Every monster has non-empty `drops`, an array-valued `loot` field, a full combat profile, a default role, at least one action package, and difficulty-scaling hooks. Current content has 49 drop entries and 20 loot entries; 12 monsters intentionally have empty loot arrays.
- The schema supports optional `baseFaunaId`, `baseMonsterId`, `variantType`, `attunementLevel`, `elements`, and `originProfile`, but current content does not yet exercise them.
- `world.encounter_templates` has six records. Encounter members reference monster ids and combat role ids; 12 of 24 monsters currently appear in encounter templates.
- `world.spawn_profiles` has five records. Spawn profiles reference encounter templates plus region, settlement, and world-hex context; they do not reference monsters directly.
- `game.combat_roles` has nine records and `game.tactics_presets` has nine records. Monster `defaultRole` resolves to a combat role. Runtime derives an enemy preset id by `preset.enemy.<defaultRole>`; all six currently used monster roles have matching enemy presets.
- Monster `actionPackageIds` resolve against the current closed combat-action-package vocabulary, not a standalone authored collection.
- Content lint validates monster structure, ids/slugs, vocabularies, tags, drops/loot shape, optional variant descriptors, combat baselines, role/action-package membership, and scaling hooks. Cross-file lint resolves roles, encounter members, spawn contexts, and drop/loot market keys.
- Runtime consumes monster records to build combatants and tactics, but current HP/MP/stamina, targeting, actions, cooldowns, statuses, AI decisions, encounter state, and rewards are not authored monster fields.

The temporary artifact's proposed replacement enemy-archetype collection and uncertainty about current authorities are stale. The live graph is established and should be hardened rather than replaced.

## 3. Existing Monster Schema Inventory

| Group | Existing fields | Current posture |
| --- | --- | --- |
| Stable identity | `id`, `slug`, `name`, `monsterClass`, `summary` | Intrinsic monster identity/archetype authority. |
| Ecology/behavior descriptors | `habitatTags`, `behaviorTags` | Intrinsic descriptive archetype context. |
| Threat and combat baseline | `threat`, `combatProfile`, `defaultRole`, `actionPackageIds`, `difficultyScalingHooks` | Embedded authored static combat descriptors to preserve. |
| Source-local outputs | `drops`, `loot` | Current descriptive drop/loot envelopes; preserve pending a loot decision. |
| Optional lineage/variant | `baseFaunaId`, `baseMonsterId`, `variantType` | Intrinsic optional derivation/variant identity when later authored. |
| Optional magic/origin | `attunementLevel`, `elements`, `originProfile` | Optional static descriptive origin/affinity/spawn-context hints, currently unused. |

`combatProfile` contains base HP, MP, stamina, accuracy, defense, evasion, attack speed, recovery speed, numeric threat rating, and preferred range. `difficultyScalingHooks` contains per-tier resource/accuracy/defense changes and action/recovery multipliers.

`drops` entries own item key, minimum/maximum quantity, and chance. `loot` entries own item key and chance. These are static probability envelopes only; they do not perform rolls or create items.

The current wrapper, namespace, id pattern, schema path, and content path remain unchanged.

## 4. Intrinsic Monster Identity Fields

Intrinsic monster identity/archetype authority consists of:

- `id`, `slug`, and `name` for stable identity;
- `monsterClass` for broad canonical classification;
- `summary` for authored identity description;
- `habitatTags` and `behaviorTags` for broad ecological and behavioral characterization;
- optional `baseFaunaId`, `baseMonsterId`, and `variantType` for explicit authored lineage/variant relationships;
- optional `attunementLevel`, `elements`, and `originProfile` for static magical affinity and origin descriptors when supported by future content.

These fields describe what an archetype is. They do not represent a spawned individual, current location, allegiance, ownership, encounter membership, target selection, active behavior, current health, or history.

`habitatTags` and `originProfile` remain descriptive suitability/source metadata. They do not place a monster in a region, settlement, hex, route, encounter, or spawn schedule. Optional lineage fields do not imply inheritance, generated variants, transformation execution, or compatibility aliases.

## 5. Embedded Static Combat Descriptor Fields To Preserve

Preserve these current embedded authored baselines:

- `threat` as a broad authored difficulty band;
- `combatProfile` as base archetype resources and combat ratings;
- `defaultRole` as the monster's reusable tactical-role default;
- `actionPackageIds` as the allowed authored action-package set;
- `difficultyScalingHooks` as deterministic authored inputs for later tier projection.

They remain monster-owned because they define the default combat shape of the archetype and are already consumed together by validation and runtime construction. Their presence does not make monster content an instance-state owner.

Base HP/MP/stamina are starting archetype values, not current resources. Accuracy, defense, evasion, timing, threat rating, and preferred range are baselines, not resolved rolls, active modifiers, initiative, targeting, or AI state. Scaling hooks are inputs, not current difficulty tier or mutable progression.

Do not move these fields merely because a future combat authority could reuse them. Any later normalization must prove independent reuse and define one canonical owner without breaking the current monster-to-combatant construction boundary.

## 6. Later Normalization Candidates

The following are review candidates only, not approved moves:

| Current field/data | Possible later owner | Required proof before normalization |
| --- | --- | --- |
| `drops`, `loot` | future item-owned general loot tables | A dedicated loot decision defines shared table identity, source-specific overlays, harvest posture, and a non-duplicating transition. |
| `actionPackageIds` | future authored combat action-package authority | Action packages need richer stable identity or reuse than the current closed vocabulary. |
| `combatProfile`, `difficultyScalingHooks` | future combat archetype/profile authority | Several non-monster combatants need the exact same canonical profile contract and runtime construction can reference it without dual ownership. |
| `defaultRole` and derived tactics convention | existing role/tactics authorities | Explicit preset references become necessary and improve validation without turning tactics into monster identity. |
| `habitatTags`, `originProfile` | ecology/spawn/hazard authorities | Canonical ecology/origin profiles exist and can replace free descriptors without making monster records own placement. |
| optional variant fields | future monster-variant authoring policy | Live variants prove required coupling, ancestry depth, override, and cycle rules. |
| poison/disease/fear-like behavior tags | future status/action-effect authorities | Static effect identities exist and separate descriptive capability from applied runtime state. |

Until those prerequisites exist, current monster fields remain canonical in place. No extraction, migration, alias, compatibility field, derived duplicate, or replacement collection is approved.

## 7. Encounter Template, Spawn Profile, Combat Role, and Tactics Boundary

Preserve the current directional graph:

```text
spawn profile -> encounter template -> monster record
                              \-> combat role override
monster record -> default combat role -> derived enemy tactics preset
monster record -> action package vocabulary
```

`world.encounter_templates` owns composition patterns: monster membership, count ranges, member roles, difficulty/disposition, habitat/region context, movement, tags, and optional allied-template relationships. Encounter-member role may intentionally override a monster's default role for that composition.

`world.spawn_profiles` owns where and how encounter templates are eligible and weighted: regions, settlements, sites, world hexes, habitat, movement, hostility, density, hazard pressure, and spawn rate. Monsters must not carry reverse encounter or spawn-profile arrays.

`game.combat_roles` owns reusable role identity and default tactical posture. Monster `defaultRole` remains a role id despite its unqualified field name. The reference is sufficient and already cross-validated.

`game.tactics_presets` owns reusable tactical defaults. Do not add `tacticsPresetId` to monsters now. Runtime's `preset.enemy.<defaultRole>` convention is sufficient for current content; later validation may prove the expected preset exists for every used role. Presets and roles are behavior descriptors, not AI execution.

Monster `actionPackageIds` remains a closed static capability vocabulary. It does not select actions, targets, timing, or outcomes.

## 8. Loot, Drop, Reward, Harvest, and Quest Output Boundary

Keep current monster `drops` and `loot` source-local. `drops` currently describe quantity-bearing materials or remains; `loot` describes additional chance-only item outputs. Both use canonical item keys and are validated against market item values.

These arrays are authored envelopes, not rolls. They do not grant items, create instances, mutate inventory, decide ownership, calculate market value, pay rewards, update quests, or record history.

Do not add reward, harvest, quest-output, equipment-drop, currency, rarity, affix, container, or generated-item fields to monster records. Quest definitions and encounter sources retain their own descriptive reward/output envelopes until a dedicated cross-source decision.

The preferred future general loot-table posture is a separate item-owned collection, provisionally `items.loot_tables`, because it describes reusable item-output distributions. It should not be monster-owned, encounter-owned, or quest-owned. Monsters, encounters, and quests may later reference general tables while retaining source-specific envelopes where semantics differ.

That preference is not implementation permission. A dedicated loot-table authority decision must first reconcile monster drops versus loot, biological harvests, encounter rewards, quest rewards, equipment/currency, table composition, item-key validation, and migration. Current arrays remain canonical until then.

## 9. Status, Condition, Injury, Morale, Death, Defeat, Disease, Poison, and Recovery Boundary

Keep all status, condition, injury, wound, morale, fear, death, defeat, disease, poison, and recovery systems future-only.

A later static combat status/condition authority may define stable effect identity and descriptive stacking/duration/application metadata after `Version 0.5.254 - Combat Status Condition And Injury Boundary`. Monster action packages may later reference those identities, but monster records must not own current applications.

Injury, wounds, current disease/poison exposure, morale values, fear state, death state, defeat outcome, incapacitation, bleeding, healing, recovery timers, scars, capture, retreat, surrender, and resurrection remain combat/runtime/player/NPC/save owners as appropriate.

Behavior tags such as `cowardly`, `corrosive`, or similar descriptors do not execute morale, poison, disease, damage, or status effects. Optional elements and attunement do not apply resistances, vulnerabilities, spells, or conditions by themselves.

## 10. Item, Equipment, Magic, Quest, Knowledge, Travel, Settlement, Region, Ecology, and Faction Reference Posture

Keep reference direction narrow and descriptive:

- monster `drops`/`loot` may reference canonical item keys;
- optional `baseFaunaId` may reference world fauna, and optional `baseMonsterId` may reference another monster after stronger lineage validation;
- optional `elements` and attunement remain descriptive magic metadata only;
- encounters reference monsters and roles;
- spawn profiles reference encounter templates and world placement authorities;
- quests, Knowledge, ecology, factions, equipment/loadouts, travel, settlements, regions, and hazards should reference monster ids from their own authorities when needed.

Do not add direct settlement, region, biome, route, travel-network, spawn-profile, encounter-template, quest, Knowledge-snippet, faction, polity, guild, equipment-loadout, spell, ritual, or reward references to the first monster record contract. Current habitat/behavior/origin descriptors are sufficient for archetype context; external placement and narrative owners retain exact relationships.

Any future reference remains descriptive. It must not spawn a monster, start/progress a quest, reveal Knowledge, alter faction/reputation/legal state, equip an instance, cast magic, select an encounter, move through travel, or execute ecology behavior.

## 11. Runtime Combat State And Forbidden Fields

Static monster records must reject:

- combatant/encounter instance ids;
- current HP, MP, stamina, wounds, conditions, statuses, buffs, debuffs, morale, fear, poison, disease, death, defeat, recovery, or timers;
- initiative, turn order, current action, action queue, cooldowns, target, threat/aggro tables, AI memory, perception, path, position, formation slot, or controller state;
- resolved attacks, damage, defense, resistances, rolls, hit results, costs, effects, or event output;
- current difficulty tier, scaled stats, temporary modifiers, equipment instances, inventory, ownership, durability, affixes, or generated variants;
- loot rolls, generated drops, reward payout, item instances, currency, containers, or inventory mutation;
- current encounter/spawn/region/settlement/location state;
- quest, Knowledge, Chronicle, faction, reputation, law, travel, UI, command, persistence, or gameplay state.

Runtime may derive a combatant from static monster baselines, but the derived state remains runtime/save-owned and must not be written back into canonical content.

## 12. Validation Hardening Direction

Existing schema and lint remain unchanged. The conditional `Version 0.5.232 - Monster Schema And Validator Hardening` may strengthen the current contract after a fresh scope check; it is not pre-approved implementation.

Candidate hardening:

1. preserve strict wrapper/record shape, unique ids/slugs, current required fields, and controlled vocabularies;
2. enforce `id === monster.<slug>` coherence;
3. reject duplicate habitat/behavior tags and duplicate item keys within drop/loot arrays where semantically invalid;
4. resolve drop/loot item keys directly against `items.items` as well as applicable market-value rules;
5. resolve `baseFaunaId` and `baseMonsterId`, reject missing targets and lineage cycles, and define required coupling with `variantType` before optional variant content is authored;
6. validate optional element/attunement/origin combinations only when permanent authority proves the relationship;
7. retain role and action-package validation and assert that every used monster role has the expected `preset.enemy.<role>` tactics preset while the convention remains runtime-owned;
8. define non-contradictory `threat` and numeric `combatProfile.threatRating` bands if current data proves stable thresholds;
9. apply bounded/scaled-number rules to combat profiles and difficulty hooks only where current runtime math provides canonical limits;
10. preserve encounter-member, spawn-profile, region, settlement, hex, and market cross-file validation;
11. reject runtime, AI, state, loot-roll, reward, item-instance, migration, alias, and gameplay fields.

Do not harden by introducing a replacement collection, moving current fields, requiring currently unused optional variant fields, adding explicit tactics ids without proven need, or changing content solely to satisfy speculative normalization.

## 13. Temporary Research Artifact Handling

Delete `docs/dev/tmp-combat-encounter-systems-research-2026-06-20.md` in this pass.

Every useful monster-record concern has been promoted:

- broad combat, encounter, spawn, tactics, consequence, loot, and runtime ownership lives in `docs/design/combat-authority-boundary-decision.md`;
- exact monster identity, embedded combat, relationship, loot, consequence, reference, forbidden-field, and validation posture lives in this document;
- equipment, item-instance, recipe, settlement, travel, quest, and Knowledge boundaries remain in their permanent decisions;
- future loot and `0.5.254` status/condition/injury work remains explicitly scheduled in the consolidation roadmap and backlog.

There is no remaining consumer for the temporary artifact. Its stale replacement-collection questions and old version sequence are superseded. Future status/injury or loot work must use permanent decisions and perform a fresh live-repo audit.

## 14. Non-Goals

This decision does not authorize:

- schema, validator, test, content JSON, runtime, UI, storage/save-state, migration, loot, AI, combat, or gameplay changes;
- monster, encounter-template, spawn-profile, combat-role, tactics-preset, item/equipment, quest, reward, settlement, travel, ecology, magic, or Knowledge edits;
- a replacement monster/enemy collection, `combat.enemy_archetypes`, field moves, normalization, aliases, or compatibility behavior;
- loot-table, reward, status/condition, injury, AI, encounter, spawn, tactics, action-package, or combat-runtime schemas;
- initiative, targeting, cooldown, threat/aggro, turn state, action selection, damage/effect execution, morale, fear, poison, disease, death, defeat, recovery, or AI logic;
- loot rolls, harvest execution, item-instance creation, reward payout, inventory mutation, quest mutation, travel/spawn execution, or settlement behavior;
- transition to `0.6.0`.

## 15. Next Recommended Version

Proceed with `Version 0.5.221 - Weapon And Armor Profile Schema Decision`.

That pass remains documentation-only. It should define future weapon/armor profile paths and fields against current item `useProfiles`, preserve item identity and runtime item-instance owners, decide equipment reference posture, and determine the item research artifact's retirement.

No new GPT Deep Research is required before `0.5.221`. GPT Deep Research gates remain supplemental non-Codex labels and do not consume `0.5.x` version numbers.
