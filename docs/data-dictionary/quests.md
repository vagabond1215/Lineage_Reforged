# Quest Data

The repository now uses three quest layers:

Detailed system-design guidance for future reusable quest authoring lives in `docs/architecture/quest-template-system.md`.

- `packages/content/base/civilization/quest_templates.json`
  - lightweight procedural templates used by the civilization tick to emit broad guild and settlement quest offers from supply, demand, security, and frontier pressure
- `packages/content/base/civilization/quest_archetypes.json`
  - reusable branching quest structures for standard quest families such as gathering, escort, extermination, porter, crafting, menial labor, maritime salvage, and masterwork crafting
- `packages/content/base/civilization/quest_definitions.json`
  - authored branching quest definitions used for hand-built contracts, investigations, operations, escorts, surveys, and other scenario-style content

## Quest Archetype Fields

Each quest archetype includes:

- `name`, `slug`, `questType`, `summary`
- `typicalGiverTypes`
  - broad issuer categories such as guild, business, government, or individuals
- `commonGuildTypes`
  - canonical guild slugs that most naturally own that archetype
- `encounterMonsterIds`
  - likely monster ids or hostile pressure ids for that quest family
- `baselineRequirements`
  - level floor
  - optional class-tag hints
  - required skills, abilities, spells, traits, and items
  - notes describing current proxy fields or future specialization gaps
- `classification`
  - recommended rank band
  - baseline risk
  - timing pressure
  - normal failure profile
- `deployment`
  - party-size expectations
  - role slots
  - explicit notes for when extra or missing people help or hurt
- `logistics`
  - required and recommended tools
  - required equipment tags
  - recommended spells
  - consumed items
- `outcomeMetrics`
  - the standards the archetype judges, such as yield, quality, cargo integrity, safety, proof of kill, or pattern quality
- `failureStates`
  - named failure bands the runtime should eventually resolve
- `rewardDrivers`
  - the factors that most directly affect payout
- `scalingAxes`
  - the dimensions that should scale difficulty when a specific quest instance is generated from the archetype
- `actionTree`
  - at least 3 branching action points, usually more for craft and escort chains

## Archetype Intent

`quest_archetypes.json` exists to prevent copy-paste quest design.

- Gathering and extraction templates use early site-reading branches that change quantity and quality.
- Escort templates expose route planning, formation integrity, and lethal ambush branches.
- Extermination templates force identification, breach, and proof-of-clearance steps.
- Porter templates judge load balance, endurance, bottlenecks, and delivery condition.
- Crafting templates break output into natural production stages instead of one flat craft check.
- Masterwork crafting templates, such as the Damascus blade commission, model repeated fold-stack-weld passes as separate checkpoints with cumulative risk.
- Menial labor templates still branch on congestion, fatigue, and avoidable hazards rather than collapsing into filler work.

## Authored Quest Definition Fields

Each quest definition includes:

- `name`, `slug`, `category`, `summary`
- `giver`
  - supports individuals, businesses, governments, guilds, or other entity types
  - stores display name, contact name, and settlement context
- `requirements`
  - level floor
  - class-tag filters
  - required skills, abilities, spells, traits, items, and reputation thresholds
  - notes for edge cases or soft recommendations
- `scheduling`
  - expected duration
  - due window
  - planning window
  - repeatability
  - timing sensitivity
- `classification`
  - guild-style rank
  - expected risk
  - legal exposure
  - combat intensity
  - failure profile
- `deployment`
  - party-size constraints
  - whether solo play is allowed
  - role slots with preferred skills or abilities
  - rules for when extra or missing people are beneficial or harmful
- `logistics`
  - required and recommended tools
  - required equipment tags
  - recommended spells
  - consumed items
- `rewards`
  - base coin
  - perfect-run bonus coin
  - reputation
  - item rewards
  - unlocks or follow-on content flags
- `miscNotes`
  - freeform authored design notes
- `actionTree`
  - entry node
  - completion nodes
  - action nodes with checks and branching outcomes

## Action Tree Model

Each action node contains:

- a phase such as planning, execution, or resolution
- an estimated time cost
- assigned role slots
- participant bounds
- checks against:
  - attributes
  - skills
  - abilities
  - spells
  - tools
  - items
  - equipment tags
  - party size
  - RNG
- branching outcomes:
  - `criticalSuccess`
  - `success`
  - `partial`
  - `failure`
  - `criticalFailure`

Each branch can:

- advance to another node
- fail the quest
- complete the quest
- apply authored effects such as time loss, reward shifts, damage pressure, reputation changes, or unlock flags

## Design Intent

This authored quest-definition model is meant to support scenario-style quests where:

- the giver identity matters
- the crew composition matters
- the outcome changes based on stats, skills, spells, tools, and party size
- the quest can branch rather than collapsing into one generic success/failure roll

The archetype layer is meant to sit below those specific authored contracts, so future quest definitions can point at a standard quest family instead of reauthoring the entire branch grammar every time.

The current action-tree structure is partly inspired by the planning/execution style used by Torn's organized-crime systems, but adapted for Cataclysm RPG's broader quest and contract model.
