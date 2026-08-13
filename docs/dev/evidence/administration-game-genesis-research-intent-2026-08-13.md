# Administration Game Genesis Research Intent

Date: 2026-08-13

Status: `EVIDENCE_ONLY_FUTURE_ADMINISTRATION_INPUT`

Branch: `admin/genesis-research-evidence-2026-08-13`

## Non-interference rule

This file is intentionally isolated from the active Lineage: Reforged implementation and acceptance route.

It is **not** current product authority, **not** a replacement for the active GPT/Codex handoff, **not** a version-roadmap change, **not** authorization to modify current source, and **not** a request to interrupt the active `0.6.10.5` audit sequence.

Do not merge or operationalize this material into current Lineage authority while the active Codex pass is in progress. After that work is complete, this artifact may be consumed as research evidence for a later administration or repository-governance review.

## Why this artifact exists

The portfolio administration project is defining a reusable repository/template standard for future game projects. A key correction to the earlier template plan is that a new game repository should not create detailed version-control or roadmap documents immediately after an idea is injected.

A substantial **Game Genesis Research** phase should first determine what the game is from the player's point of view, what systems are actually needed to produce that experience, how those systems interact behind the scenes, and what creates sufficient depth, clarity, accessibility, replay value, and long-term appeal.

Only after that research is accepted should the project generate its version-intent map, architecture, implementation sequence, and repository-ready status.

## Research findings informing the future standard

### Player experience must drive mechanics

The MDA framework distinguishes mechanics, the runtime dynamics that emerge from them, and the player-facing aesthetics/experience. The useful administrative lesson is that a project should not inventory mechanics only as features. Every proposed system should answer what player experience it is intended to create and how the player perceives, learns, uses, and receives feedback from it.

Self-Determination Theory research applied to games repeatedly identifies autonomy, competence, and relatedness as important contributors to intrinsic motivation and sustained enjoyment. This does not mean every game must maximize all three equally; it means genesis research should explicitly ask how the intended game supports player agency, mastery, meaningful challenge, connection, identity, and belonging where those dimensions fit the concept.

Onboarding and UX research also supports treating the player's mental model, clarity of controls, feedback, objectives, and first-session understanding as design concerns from the beginning rather than late polish.

### Replay value should be designed as a system, not treated as content quantity

Long-term play can come from several different sources: mastery, multiple viable strategies, systemic interactions, procedural or authored variation, build diversity, world reactivity, social relationships, progression, collection, narrative uncertainty, challenge variation, and other forms of meaningful change between sessions or playthroughs.

The administration process should therefore research the intended **short-loop**, **session-loop**, **campaign-loop**, and **replay-loop** separately. A game can contain large amounts of content and still have weak replay value if the player is repeatedly making the same low-impact decisions.

Systemic design can increase replay value when general rules interact consistently enough for players to discover new strategies, but systemic complexity should be justified by the intended experience rather than added for its own sake.

### Runtime architecture must be researched before feature scheduling

A game's background behavior constrains its design. Time progression, update cadence, simulation ownership, rendering, persistence, event ordering, AI scheduling, pathfinding, spawning, world streaming, resource ownership, random-number behavior, and save/load semantics can create expensive rework if chosen independently after player-facing systems have already been scheduled.

For real-time or continuously simulated games, the project should explicitly decide whether simulation time is fixed-step, variable-step, turn-based, event-driven, calendar-driven, hybrid, or delegated to an engine. Simulation and presentation cadence should be treated as separate concerns where the architecture requires it.

Event/command decoupling, component boundaries, and other patterns can reduce unnecessary coupling, but the template should require the project to justify architectural mechanisms from actual dependency needs rather than pre-installing complexity.

### Accessibility belongs in genesis research

Accessibility affects control schemes, information presentation, difficulty options, tutorials, text, color use, audio alternatives, assist systems, input remapping, save behavior, and UI architecture. These choices become more expensive to retrofit after core interfaces and mechanics harden.

Genesis research should therefore classify accessibility requirements alongside ordinary gameplay requirements, not as a late optional polish track.

## Proposed Game Genesis sequence for future template repositories

The following sequence is intended for the future administration template. It is not a proposed replacement for Lineage's current workflow.

### Stage G0 - Idea intake

Capture the user's concept, target platform, intended player, constraints, non-goals, existing references/material, online/offline expectations, persistence expectations, distribution target, content restrictions, and tool restrictions.

Unknown answers are allowed. Classify unknowns as either:

- `BLOCKING_DECISION` - a decision that materially changes the architecture or player experience and should be resolved before implementation;
- `DEFERRED_DECISION` - safe to postpone if the project records a reversible assumption and a later decision point.

### Stage G1 - Player POV deep research

Research the game as the player would encounter it.

Create a player journey covering at minimum:

- first launch;
- first five minutes;
- first meaningful success/failure;
- first session;
- early progression;
- established mid-game play;
- long-session behavior;
- campaign/end-state behavior if applicable;
- replay/new-character/new-game behavior if applicable.

For every stage ask:

- What does the player see?
- What can the player do?
- What does the player understand?
- What does the player want next?
- What creates tension, curiosity, mastery, attachment, or satisfaction?
- What information or controls are required?
- What can confuse or frustrate the player?
- What permanent or temporary progress is visible?
- What choices have meaningful consequences?
- What changes when the player repeats the experience?

### Stage G2 - World and gameplay system discovery

Perform a broad system discovery before narrowing the roadmap. Each item is a question, not an assumption that the game needs it.

#### Character and identity

- character creation;
- ancestry/species/race;
- sex/gender/appearance where relevant;
- background/origin;
- personality/reputation/alignment;
- relationships;
- aging/lifespan;
- lineage/family/legacy;
- death, incapacitation, recovery, resurrection, permadeath;
- player housing/base/home ownership.

#### Character statistics and resources

Investigate whether the game needs concepts such as:

- attributes/stats;
- health / HP;
- mana / MP;
- stamina;
- spirit;
- action points / SP;
- energy;
- hunger;
- thirst;
- fatigue;
- morale;
- stress/sanity;
- temperature;
- injury/wounds;
- armor/defense;
- accuracy/evasion;
- resistances;
- encumbrance/carry capacity;
- skill proficiency;
- experience/levels;
- reputation/faction standing.

Do not create redundant bars merely because another RPG uses them. Every resource must have a player-facing purpose, regeneration/consumption model, UI contract, persistence rule, and interaction with other systems.

#### Combat

Investigate:

- whether combat exists at all;
- real-time, turn-based, active-time, tactical, action, simulation, or hybrid model;
- melee;
- ranged;
- magic;
- unarmed;
- shields/block/parry/dodge;
- targeting;
- positioning/range;
- status effects;
- damage types;
- armor/penetration/resistance;
- injuries;
- initiative/action economy;
- cooldowns/cast times;
- ammunition;
- companions/party combat;
- enemy AI;
- player AI/auto-combat helper;
- difficulty scaling;
- retreat/surrender/capture;
- defeat/recovery consequences;
- loot/resource provenance.

#### Magic and supernatural systems

Ask whether magic exists and, if so:

- source/origin;
- traditions/schools;
- who can learn it;
- costs/resources;
- casting/preparation;
- equipment/focus/reagents;
- targeting;
- failure/interruption;
- counter-magic/resistance;
- social/legal/religious consequences;
- world/ecology/economy effects;
- NPC access;
- crafting/enchanting interaction;
- persistence and balance implications.

#### Weapons, armor, equipment and tools

Investigate:

- weapon families;
- armor families;
- shields;
- ammunition;
- tools;
- durability;
- repair;
- quality tiers;
- materials;
- modifications/enchantments;
- equipment slots/loadouts;
- proficiency/requirements;
- encumbrance;
- acquisition/crafting/economy;
- salvage/recycling;
- visual identity.

#### Creatures, monsters, NPCs, flora and fauna

Investigate:

- ordinary wildlife;
- monsters/hostile entities;
- domesticated animals;
- mounts;
- pets;
- ecological niches;
- population/spawn rules;
- migration/seasons;
- predation;
- resource harvesting;
- corpse/remains behavior;
- rarity;
- habitat;
- faction relationships;
- NPC schedules;
- professions;
- needs/goals;
- memories/relationships;
- dialogue;
- crime/law reactions;
- combat behavior;
- trade/service behavior;
- death/replacement/persistence.

#### World, geography and environment

Investigate:

- world scale;
- regions/biomes;
- local maps;
- world maps;
- fog/discovery/knowledge;
- climate;
- weather;
- seasons;
- day/night;
- calendar;
- moon/tide/astronomy if relevant;
- environmental hazards;
- destructibility;
- resource regeneration;
- settlements;
- wilderness;
- dungeons/interiors;
- roads/routes;
- fast travel;
- procedural versus authored geography.

#### Travel and vehicles

Investigate:

- walking/running;
- mounts;
- carts/wagons;
- boats/ships;
- trains;
- automobiles;
- aircraft;
- fantasy vehicles;
- scheduled transport;
- fuel/feed/maintenance;
- cargo;
- travel time;
- encounters/hazards;
- pathfinding;
- world streaming;
- ownership/theft;
- repair and economy.

#### Economy, shops and services

Investigate:

- currency;
- barter;
- scarcity;
- pricing;
- supply/demand;
- shops;
- merchants;
- banks;
- inns;
- healers;
- trainers;
- crafting services;
- repair;
- storage;
- property;
- wages;
- taxes;
- theft/crime;
- faction restrictions;
- dynamic economy;
- anti-exploit controls.

#### Items, gathering and crafting

Investigate:

- item taxonomy;
- stack behavior;
- weight/volume;
- durability;
- rarity/quality;
- provenance;
- gathering;
- mining;
- logging;
- hunting;
- fishing;
- farming;
- foraging;
- processing;
- cooking;
- recipes;
- crafting professions;
- workstations;
- ingredients/components;
- substitutions;
- byproducts;
- repair;
- recycling/salvage;
- discovery/learning of recipes;
- market interaction.

#### Progression, jobs, classes and capabilities

Investigate:

- level-based progression;
- classless progression;
- classes/jobs/disciplines;
- skill trees;
- proficiencies;
- talents/perks;
- learn-by-doing;
- trainers;
- prerequisites;
- respec;
- specialization;
- multi-classing;
- permanent versus loadout-bound capability;
- character aging/legacy progression;
- horizontal versus vertical progression.

#### Quests, narrative and world state

Investigate:

- main narrative;
- side quests;
- procedural/dynamic tasks;
- contracts/bounties;
- faction arcs;
- branching outcomes;
- dialogue choices;
- failure states;
- time-sensitive quests;
- reputation consequences;
- world-state changes;
- quest generation;
- journal/objective tracking;
- replay implications.

#### Social, party and AI assistance

Investigate:

- recruitable party members;
- party size;
- relationship/loyalty;
- companion autonomy;
- tactical commands;
- formations;
- AI combat assistance;
- auto-healing/support;
- behavior priorities;
- party inventory;
- companion progression;
- multiplayer/co-op if relevant;
- guilds/clans/factions;
- NPC social networks.

#### Culture, religion and institutions

Investigate:

- religions/faiths;
- gods or absence of gods;
- rituals;
- temples;
- law;
- political factions;
- governments;
- social classes;
- crime/justice;
- languages;
- cultures;
- holidays;
- calendars;
- customs;
- economic institutions;
- education/training institutions.

#### Interface and accessibility

Investigate:

- keyboard/mouse/controller/touch;
- remapping;
- text size and readability;
- color independence;
- subtitles/captions;
- audio alternatives;
- assist modes;
- difficulty options;
- tutorial/onboarding;
- contextual help;
- objective reminders;
- save/accessibility settings persistence;
- screen-reader requirements where applicable;
- reduced-motion/speed options where applicable.

### Stage G3 - Technical/background deep research

Every accepted player-facing system must be traced into the hidden systems needed to support it.

Research at minimum:

- authoritative state ownership;
- simulation model;
- tick/update engine;
- fixed/variable/event-driven time;
- calendar/time-of-day scheduling;
- rendering/presentation separation;
- input command model;
- AI scheduling;
- pathfinding/navigation;
- entity lifecycle;
- spawn/despawn rules;
- world/scene loading;
- persistence/save model;
- schema migrations;
- deterministic/random behavior;
- event/message architecture;
- ordering/idempotency;
- task/job queues;
- background workers;
- resource ownership/disposal;
- memory lifecycle;
- cache policy;
- asset lifecycle;
- audio lifecycle;
- networking/server authority if applicable;
- security/anti-cheat if applicable;
- telemetry/crash reporting if applicable;
- modding/plugin boundary if applicable;
- content schemas/data validation;
- localization;
- accessibility persistence;
- testing/benchmark/soak infrastructure.

For each background subsystem, identify:

- owner;
- inputs;
- outputs;
- callers/consumers;
- update cadence;
- persistent state;
- deterministic requirements;
- failure behavior;
- cleanup/disposal behavior;
- performance sensitivity;
- test oracle;
- player-visible consequences when it fails.

### Stage G4 - Interconnectivity and dependency research

Build a system dependency graph before the version roadmap.

Examples:

- magic may depend on attributes, resources, targeting, effects, statuses, UI, AI, persistence, equipment, content data and combat timing;
- climate may affect flora, fauna, travel, gathering, visibility, NPC schedules, agriculture, survival resources, events and presentation;
- crafting may depend on item schemas, provenance, gathering, shops/economy, recipes, skills, tools, time, inventory and persistence;
- party AI may depend on combat commands, navigation, capabilities, resources, threat/targeting, relationship rules and interruption behavior.

Classify dependencies as:

- `HARD` - system cannot function coherently without it;
- `SOFT` - useful integration but safe to defer;
- `CONTENT` - requires data/content breadth rather than new architecture;
- `PRESENTATION` - simulation may exist before the full player-facing surface;
- `FUTURE` - intentionally unsupported until a later product band.

### Stage G5 - Replay value and game-success research

This stage should examine whether the intended game is likely to remain interesting after the first successful loop.

Research and explicitly decide which replay drivers fit the concept:

- mastery/skill expression;
- meaningful build diversity;
- multiple viable strategies;
- systemic/emergent interactions;
- randomized/procedural variation;
- world-state variation;
- branching narrative consequences;
- character origins/classes/jobs;
- collection/completion;
- exploration/discovery;
- dynamic ecology/economy;
- challenge modes;
- difficulty modifiers;
- New Game Plus;
- alternate starts;
- faction allegiance;
- social/party variation;
- player-created goals;
- sandbox systems;
- modding;
- multiplayer/co-op/competition;
- seasonal/live content only when actually appropriate.

Also research failure modes of replay design:

- repetition without new decisions;
- numerical grind without new capability;
- excessive maintenance chores;
- dominant builds invalidating choice;
- randomization without meaningful variation;
- content that becomes mechanically obsolete;
- rewards that undermine the game's core motivation;
- systems that compete for the same resource without interesting tradeoffs;
- long-term progression that trivializes early systems;
- replay modes that merely reset progress without changing play.

A project should define:

- core moment-to-moment loop;
- short-session loop;
- medium progression loop;
- long progression/campaign loop;
- replay/endgame loop;
- expected sources of novelty;
- expected sources of mastery;
- expected sources of player expression;
- expected sources of social/relational engagement when applicable.

### Stage G6 - Comparative and audience research

Before architecture freezes, review comparable games and relevant player communities to identify:

- genre expectations;
- common usability complaints;
- common content complaints;
- mechanics players consider mandatory versus optional;
- systems associated with strong mastery or replay value;
- accessibility expectations;
- platform expectations;
- successful onboarding conventions;
- common technical/performance failures;
- oversaturated or derivative mechanics;
- opportunities for meaningful differentiation.

Do not copy a competitor's design simply because it is successful. Treat comparisons as evidence about player expectations and risk.

### Stage G7 - System disposition register

Every discovered system receives one disposition before the roadmap is generated:

- `CORE_REQUIRED`;
- `REQUIRED_SUPPORT`;
- `PLANNED`;
- `OPTIONAL_CANDIDATE`;
- `DEFERRED`;
- `EXPLICITLY_ABSENT`;
- `RESEARCH_UNRESOLVED`.

This prevents unasked-for genre conventions from silently becoming requirements while still ensuring that major design categories were consciously considered.

## Proposed system version-intent model

Future template projects should maintain both a **product milestone version** and a **system maturity version**.

### Product milestone version

This is the project roadmap location where a system or integration is intended to become available. Multiple systems may share one product milestone.

Example only:

```yaml
system_id: magic
scheduled_product_version: 0.5.0
disposition: PLANNED
```

A deferred system can still be deliberately scheduled:

```yaml
system_id: naval-travel
scheduled_product_version: 0.9.0
disposition: DEFERRED
```

The number therefore communicates that the system is part of the known design but intentionally belongs later.

### System maturity version

Each mechanism/process also receives an independent maturity version so the project can distinguish a named system from a genuinely usable one.

Proposed pre-1.0 maturity semantics for future template use:

- `0.0.0` - identified only; no accepted contract;
- `0.1.x` - contract/research/schema foundation;
- `0.2.x` - isolated prototype;
- `0.3.x` - representative implementation;
- `0.4.x` - integrated with required dependencies;
- `0.5.x` - player-usable vertical implementation;
- `0.6.x` - meaningful content/behavior breadth;
- `0.7.x` - balance/tuning/depth refinement;
- `0.8.x` - robustness/performance/long-session hardening;
- `0.9.x` - feature-complete/release-candidate maturity;
- `1.0.0` - accepted stable baseline for that system's declared scope.

After a subsystem reaches `1.0.0`, normal semantic compatibility/versioning rules may be used where that makes sense for the project's APIs/contracts.

This maturity scale is **future template research**, not a proposal to retroactively renumber Lineage's current systems.

### System registry fields

A future `SYSTEM_VERSION_REGISTRY.yaml` should contain at minimum:

```yaml
- system_id: combat
  player_role: "Creates tactical conflict and risk"
  disposition: CORE_REQUIRED
  scheduled_product_version: 0.4.0
  maturity_version: 0.0.0
  target_maturity_at_product_version: 0.5.0
  dependencies:
    hard: [character-stats, health, targeting, action-resolution]
    soft: [party-ai, environmental-hazards]
  persistence: required
  deterministic_requirements: defined-by-project
  performance_class: latency-sensitive
  owner: undecided
  research_status: accepted
```

The registry should include player-facing mechanics, background mechanisms, content pipelines, persistence/schema systems, UI surfaces, AI systems, performance infrastructure, and other significant processes rather than versioning only headline gameplay features.

## Version-control document gate

The future template should not create its detailed version roadmap until the genesis research pack is accepted.

Required pre-version artifacts should include:

1. `PROJECT_INTAKE.yaml`;
2. `PLAYER_EXPERIENCE_RESEARCH.md`;
3. `GAME_SYSTEM_DISCOVERY.yaml`;
4. `TECHNICAL_SYSTEM_RESEARCH.md`;
5. `SYSTEM_DEPENDENCY_MAP.md`;
6. `REPLAY_AND_SUCCESS_RESEARCH.md`;
7. `SYSTEM_DISPOSITION_REGISTER.yaml`;
8. `RESEARCH_DECISIONS_PENDING.md`.

Only then generate:

9. `SYSTEM_VERSION_REGISTRY.yaml`;
10. `VERSION_INTENT_MAP.md`;
11. `ARCHITECTURE.md`;
12. expensive-to-reverse ADRs;
13. `ROADMAP.md` / version-control documents;
14. quality, performance, lifecycle and validation infrastructure;
15. `READY_STATUS.md`.

## Readiness implication

A future game repository should not receive `READY_TO_WORK: YES` merely because its folder structure and CI exist.

The readiness audit should additionally prove that:

- player POV research is complete enough to identify the intended experience;
- major game-system categories were considered;
- explicitly absent systems are recorded;
- technical/background dependencies are mapped;
- replay/retention risks were researched;
- system dispositions are recorded;
- every accepted/deferred major system has a scheduled version intent;
- blocking architecture questions are resolved;
- the first walking skeleton exercises the most important authoritative state path rather than a decorative UI shell.

## Suggested later use in Lineage: Reforged

After the active Codex/audit route is complete, this artifact may be useful for a **read-only retrospective coverage audit** of Lineage's existing design.

Such an audit should not assume the template is superior to Lineage's existing architecture. Instead it could ask:

- Which player-facing systems are already intentionally defined?
- Which candidate systems are intentionally absent?
- Which existing systems have clear maturity/version ownership?
- Are any major player POV areas present in code but weakly represented in design authority?
- Are any future systems mentioned casually without an explicit dependency or version-intent classification?
- Does the current roadmap sufficiently expose background prerequisites for later player-facing systems?
- Are replay/mastery/long-term engagement goals represented explicitly enough for the intended game?

Any resulting proposal should be reconciled with current Lineage authority after the active work completes and should not retroactively overwrite accepted version semantics without a deliberate migration decision.

## Research references

The concepts above were informed by the following external research and practitioner sources:

- Robin Hunicke, Marc LeBlanc, Robert Zubek, **MDA: A Formal Approach to Game Design and Game Research** (AAAI workshop, 2004).
- Self-Determination Theory / Player Experience of Needs Satisfaction research on autonomy, competence and relatedness in games.
- GDC/Game Developer material on onboarding, player engagement, core gameplay loops, long-term engagement, systemic design and mastery-driven replayability.
- Game Accessibility Guidelines, including early consideration of remapping, text readability, color-independent information, subtitles, difficulty/assist options and persisted settings.
- Glenn Fiedler, **Fix Your Timestep!**, on separating simulation timestep concerns from rendering cadence when deterministic/fixed simulation is required.
- Robert Nystrom, **Game Programming Patterns**, especially game loops, update methods, command/event queues and decoupling tradeoffs.
- Semantic Versioning 2.0.0 as a compatibility-oriented reference after a system has a declared stable contract; the proposed pre-1.0 maturity scale above is a separate administration convention and should not be confused with SemVer itself.

## Final administration principle

The template should not ask only:

> What features does this game have?

It should first ask:

> What does the player do, feel, understand, pursue, learn, master, remember and choose — and what hidden systems must remain coherent for that experience to work repeatedly over many hours?

Only after those answers exist should the project turn them into architecture and version numbers.
