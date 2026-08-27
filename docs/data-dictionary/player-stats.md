# Player Stats And Progression Data

Date refreshed: 2026-08-27

Status: current data-dictionary summary; implementation authority remains in live schemas, content, shared contracts, and engine owners

## Purpose

The player progression layer separates:

- nine primary attributes;
- learned skills;
- active abilities;
- spells;
- passive traits;
- resource pools;
- use-driven attribute growth;
- skill breakthrough progression;
- overall Echo progression.

The current ordinary character model is classless. Historical class/job compatibility fields remain in serialized/runtime contracts and must not be removed or reused as new class gates without a dedicated migration/design package.

For the detailed current-state audits, see:

- `docs/design/attribute-skill-ability-responsibility-audit.md`;
- `docs/design/classless-progression-and-placeholder-provenance-audit.md`.

## Primary Attributes

The live catalog defines nine attributes, each with authored default `10`:

- `STR` — Strength: force, leverage, carrying and heavy melee/labor pressure;
- `DEX` — Dexterity: fine control, precision, timing and tool/weapon handling;
- `AGI` — Agility: balance, reaction, footwork and movement economy;
- `CON` — Constitution: sustained exertion, conditioning and fatigue resistance;
- `VIT` — Vitality: hardiness, injury tolerance and recovery;
- `WIS` — Wisdom: judgment, discipline, support and practical field reading;
- `INT` — Intelligence: analysis, technical/arcane comprehension and complex processes;
- `SPT` — Spirit: supernatural resonance, concentration and channel stability;
- `CHA` — Charisma: presence, morale, leadership and social projection.

`packages/content/base/player/attributes.json` stores:

- category;
- description;
- derived-stat hints;
- skill affinities;
- resource-influence hints;
- tags;
- top-level resource formula bindings.

### Metadata Versus Executed Resource Authority

The attribute catalog's resource fields are descriptive/authored metadata. They are **not** currently the sole executable resource formula.

Live resource maxima/regeneration are owned by `packages/shared/types/src/player-resources.ts` and currently use:

- HP: CON + VIT;
- MP: INT + SPT;
- Stamina: AGI + CON + VIT;

plus origin growth, body-state effects and active resource modifiers where applicable.

This differs from some richer `attributes.json` hints, such as STR/WIS/CHA secondary resource influence. Do not infer runtime effects from `resourceInfluence` alone.

A later focused resource/attribute integration decision should reconcile the metadata/runtime drift rather than silently changing either side.

## Character Creation

Ordinary character creation is classless.

The current new-game path initializes:

- `classId: null`;
- `jobId: null`;
- legacy `classLevel: 0`.

Starting attributes are resolved from:

1. lineage base attributes;
2. identity adjustments such as sex/age/height where applicable;
3. backstory adjustments;
4. physique and nature weighting;
5. focus shifting the physique/nature share;
6. exactly 10 generated profile points.

Current creator invariants require:

- base stat total 90 before generated profile points;
- generated profile points total 10;
- final stat total 100;
- no primary attribute below the supported minimum.

## Skills

Current live catalog size: **121** records.

Skills are learned/progressed competencies distinct from raw attributes. Records currently include:

- stable id/name;
- category/domain and optional parent skill;
- description;
- default and maximum rank;
- progression-track reference;
- governing attributes;
- combat/action/item/knowledge hooks where applicable.

Examples:

- Spotting uses WIS + DEX;
- Identify uses INT + WIS;
- weapon, armor, survival, resource, crafting, knowledge, magic and settlement skills declare their own governing-attribute relationships.

### Skill Rank Scale

Current authored maximum rank is generally `125`.

The runtime progression engine defines overlapping proficiency bands:

- Clumsy;
- Familiar;
- Proficient;
- Skilled;
- Mastery.

Breakthrough gates occur around ranks 30, 55, 80 and 100. Mastery can require a mastery trial.

### Governing Attributes

The `governingAttributes` arrays express authored relationships, but there is not currently one universal formula making those attributes automatically determine every skill check or every skill-gain event.

Skill gain remains owner-specific. A future generic skill-resolution/training owner must explicitly decide how governing attributes affect success, gain rate, breakthroughs or suitability.

## Abilities

Current live catalog size: **32** records.

Abilities are active techniques represented separately from skills. Current records can include:

- activation/action type;
- execution and recovery timing;
- stamina/resource costs;
- skill-rank requirements;
- minimum attribute requirements;
- handling/equipment context;
- governing skill ids;
- governing attribute ids;
- target profiles;
- effect channels;
- combat tags;
- resolution hooks.

The current model supports classless unlock logic in principle: an ability can depend on competence, attributes and equipment rather than a class level.

### Runtime Maturity

Combat consumes learned ability ownership, governing skills, timing, costs, targets and resolution hooks.

The authored requirement fields are ahead of a universal action-time eligibility resolver. Do not assume every content requirement is re-evaluated generically every time an already-learned ability is used.

## Spells

Current live catalog size: **55** records.

Spell records include:

- school/tradition/element;
- governing magic skill;
- governing attributes;
- scaling channels;
- MP/Stamina costs;
- target profile;
- compatibility metadata where applicable;
- effect/resolution hooks.

The combat runtime currently uses spell skill/scaling metadata plus family-level attribute formulas. A spell record's exact `governingAttributes` should not be treated as a complete generic executable scaling formula unless the consuming runtime explicitly uses it.

## Traits

Current live catalog size: **30** records.

All current trait records inspected use `sourceType: lineage`.

Traits primarily modify downstream channels such as:

- skill or breakthrough progression;
- resource maxima/regeneration;
- effective skill-rank bonuses;
- awareness;
- movement;
- combat behavior.

The older statement that the current catalog contains FFXI-style job traits is no longer accurate.

## Resources

Static resource catalog:

- HP — base 120;
- MP — base 60;
- Stamina — base 100;
- Experience — progression resource.

Actual current player maxima can differ based on:

- lineage origin profile;
- developed attributes;
- body-state multipliers;
- equipment/runtime resource modifiers;
- retained compatibility growth where applicable.

## Use-Driven Attribute Growth

`packages/engines/player-engine/src/stat-growth.ts` supports all nine attributes.

Meaningful actions can apply an `ActionAttributeLoadProfileState` containing:

- intensity;
- per-attribute weights;
- source tag;
- meaningful-interaction posture.

Accumulated load is converted during sufficient recovery rather than granting an immediate stat point.

The current model considers:

- action intensity;
- relevance weights;
- body condition;
- lineage growth bias;
- daily saturation/diminishing returns;
- activity variety;
- current attribute value;
- recovery quality/capacity;
- difficulty modifiers;
- deterministic variance.

Current production profiles inspected cover STR, DEX, AGI, CON, VIT and WIS through travel, survey, labor and procurement. INT, SPT and CHA already have full stat-growth infrastructure but still need ordinary production action sources from their future study/magic/social/crafting verticals.

## Attribute Tension

Current stat growth includes bounded imbalance penalties:

- very high STR relative to DEX can reduce precision;
- high CON/VIT bulk relative to AGI can reduce peak mobility;
- high SPT relative to WIS can reduce stability.

These relationships are balancing/support mechanics, not permission to merge the paired attributes.

## Echo

Echo is the current overall composite-development measure.

The authored balance rule currently weights:

- skills: 50%;
- stats: 30%;
- knowledge: 20%.

All nine primary attributes participate in the tracked stat component.

Echo is therefore distinct from:
- a class level;
- an individual skill rank;
- a single attribute;
- a knowledge rank.

## Class/Job Compatibility Fields

Live contracts still retain compatibility fields including:

- `PlayerCoreData.classId`;
- `PlayerCoreData.jobId`;
- `PlayerLegacyGrowthState.classLevel`;
- origin-profile class id/label/resource-growth fields;
- `PLAYER_CLASS_PROFILES`.

These are **not** current product authority for adding classes.

They remain live because progression normalization, origin/resource resolution, semantic validation, UI projection and historical save compatibility still know about them.

Ordinary current construction uses null/zero class state.

Removing these fields requires a dedicated persistence/migration/compatibility retirement package.

## Historical FFXI Provenance

Earlier player-progression work used Final Fantasy XI/BG-Wiki taxonomy as temporary reference material, particularly for broad skill/spell/ability coverage.

That history does not make FFXI job architecture current Lineage authority.

Current inspected skill, ability and spell records contain no literal player class/job gates, and current trait records are lineage-sourced.

The user-approved FFXI-style **elemental relationship** reference remains a separate design input. Preserve that elemental reference unless a later focused elemental decision changes it.

Future content passes should replace placeholder/imported naming or taxonomy when Lineage-native equivalents are authored, without assuming that provenance requires a class system.

## Storage Layer

`packages/db/migrations/003_player.sql` currently defines:

- `player_attributes`;
- `player_resource_formula_bindings`;
- `player_equipment_slots`;
- `player_progression_tracks`;
- `player_knowledge_domains`;
- `player_skill_effects`;
- `player_trials`;
- `player_skills`;
- `player_abilities`;
- `player_spells`;
- `player_traits`;
- `player_resources`.

Most structured details are stored in JSON payload columns while runtime/schema ownership continues to mature.

Note: the older dictionary incorrectly named `player_progression_models`; the live migration uses `player_progression_tracks`.

## Authority Rule

When this dictionary conflicts with live source or a newer focused accepted design:

1. use the live executable owner for current behavior;
2. use the most specific accepted focused design for intended architecture;
3. treat this dictionary as a maintained summary and repair it in a bounded documentation pass.

Do not use historical placeholder wording to reintroduce hard class gates.
