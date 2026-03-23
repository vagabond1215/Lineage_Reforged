# Player Stats and Progression Data

The player content layer now treats attributes, skills, abilities, spells, and traits as authored progression catalogs instead of thin placeholder lists.

## Core Fields

- `attributes`
  - nine base attributes: `STR`, `DEX`, `AGI`, `CON`, `VIT`, `WIS`, `INT`, `SPT`, `CHA`
  - each record now includes category, description, derived-stat hints, skill affinities, and HP/MP/Stamina influence vectors
  - top-level resource formula bindings document which attributes bias `hp`, `mp`, and `stamina`
- `skills`
  - catalog now includes FFXI-style combat, ranged, magic, defensive, mobility, and craft skills as placeholder progression tracks
  - each record carries `family`, `defaultCap`, governing attributes, gain sources, and a referenced diminishing-returns progression model
  - authored progression models currently cover weapon, ranged, magic, defensive, mobility, and craft curves
- `abilities`
  - active player or NPC actions that do not consume MP
  - each record now specifies ability type, family, stamina cost, cooldown, optional weapon-skill requirements, unlock rules, and effect payloads
  - current placeholder set mixes FFXI-style job abilities and weapon skills
- `spells`
  - magical actions that consume MP
  - each spell now carries school, discipline, governing skill, tier, required level, power rating, effect complexity, target profile, and a cost-model reference
  - black magic is currently modeled as `elemental_magic`, `dark_magic`, and `enfeebling_magic`
  - white magic is currently modeled as `divine_magic`, `enfeebling_magic`, `enhancing_magic`, and `healing_magic`
  - authored elements are `light`, `dark`, `earth`, `water`, `wind`, `fire`, `ice`, and `thunder`
- `traits`
  - passive bonuses granted by race, job, or later progression unlocks
  - each record now carries source type, tier, unlock rules, stacking rules, and structured effect payloads
  - the current authored set includes starter lineage traits plus FFXI-style job traits

## Placeholder Source Scope

- The current player progression catalogs intentionally use FFXI-style taxonomy from BG-Wiki as a temporary stand-in for the later game-native roster.
- `packages/content/base/player/spells.json` tracks the BG-Wiki reference totals for:
  - `Black Magic`: 178 total pages
  - `White Magic`: 187 total pages
- The authored records are still a subset, not a full mirror of BG-Wiki, but they now guarantee a minimum of five authored spells for each supported element and each current black/white magic discipline.
- Equipment lists and FFXI job-specific skill caps are intentionally excluded because the final class taxonomy will differ.

## Progression Rules

- Skills use diminishing returns.
  - higher ranks gain more slowly
  - repeated trivial actions are penalized
  - progression should come from level-appropriate combat, harder recipes, relevant traversal, and similarly meaningful use
- Abilities consume stamina and/or operate on cooldown.
  - they are active actions, not passive effects
  - they do not consume MP
- Spells consume MP in proportion to:
  - spell tier or power
  - required level
  - effect complexity
  - area or duration burden where relevant
- Traits are passive.
  - race traits generally begin at onset
  - job traits and progression traits unlock later through levels, roles, or proficiency milestones

## Storage Layer

The player SQLite migration now includes:

- `player_progression_models`
- `player_attributes`
- `player_resource_formula_bindings`
- `player_skills`
- `player_abilities`
- `player_spells`
- `player_traits`
- `player_resources`

Most authored progression detail currently stores as JSON payload columns so the content layer can evolve before the runtime settles on stricter relational ownership.
