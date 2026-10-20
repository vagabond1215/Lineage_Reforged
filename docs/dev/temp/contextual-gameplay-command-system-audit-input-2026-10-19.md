# Temporary Audit Input — Contextual Gameplay Command System And UI

Date: 2026-10-19  
Repository: `vagabond1215/Lineage_Reforged`  
Source head at publication: `c58a5c81abf4337140a1e4687af2dcdf3a8db513`

Status: **temporary, non-authoritative design-consumption artifact**

This file intentionally gathers player-facing gameplay, location, contextual-action, UI, sandbox-role, and selected-proof findings into one place for a later architecture/design pass.

It is **not** an accepted design decision, implementation contract, schema authority, Game-version decision, or production work order. Where this file conflicts with an accepted repository authority, the accepted authority wins. Once a durable contextual-command architecture decision is published, this file should be deleted or moved to historical evidence.

## 1. Why this artifact exists

Recent UI/gameplay auditing found that Lineage: Reforged does not currently suffer from having too many executable player actions. Instead, a relatively small set of real commands is distributed across broad domain panels, record/catalog surfaces, disabled controls, and developer-facing presentation.

The game direction is an open-world sandbox in which a character may pursue combat, trade, crafting, farming, land/property ownership, exploration, transport, social/economic play, or combinations of those paths. The UI therefore needs a common answer to:

> Given where the character is, what is around them, what they know/carry/control, and what is currently happening, what can they actually do right now?

The desired end state is **not** a permanent global verb wall. It is a contextual player-action projection whose execution remains owned by the correct gameplay domain.

## 2. Current repository reality to preserve

### 2.1 Accepted contextual-action direction

Read before using this artifact:

- `docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md`
- `docs/design/ui-information-architecture-boundary.md`
- `docs/dev/playability-posture-and-version-calibration.md`
- `docs/dev/game-version-roadmap-and-acceptance-policy.md`
- `docs/design/ordinary-encounter-admission-and-outcome-ownership-contract-decision.md`
- `docs/design/ordinary-encounter-selected-basic-action-and-victory-boundary.md`

The accepted contextual-action decision already establishes the critical ownership rule:

- presentation/invocation is contextual;
- authoritative validation/execution remains domain-specific;
- impossible actions should normally be omitted;
- a blocked action may be shown when its concise reason teaches the player something useful.

Do not replace that with a monolithic UI-owned action engine.

### 2.2 Current selected gameplay state

At this source line:

- Game remains `0.1.1-prealpha`;
- playability remains `INTEGRATED_LOOP`;
- `DEV-0.7.1_ACCEPTED_WITH_DOCUMENTED_LIMITS` is settled;
- hosted epoch version 3 is live and protected;
- the current ordinary encounter proof reached a genuine Stonevein encounter through a fresh isolated browser lane;
- selected combat exposed `combat.melee.primary`, `combat.interrupt.shield_bash`, and Continue;
- the intended `combat.attack.melee.basic` command was not projected;
- the next installed route is a narrow Basic Action Selection Repair;
- ordinary victory and post-victory durability remain unproven;
- the UI overhaul has not begun.

The combat finding is relevant to this future architecture because it demonstrates a concrete identity problem:

- **action family**: melee;
- **concrete command identity**: `combat.attack.melee.basic`, `combat.melee.primary`, `combat.interrupt.shield_bash`;
- **effect/skill compatibility**: which melee/sword/shield modifiers apply.

Family matching is useful for effects and aliases, but must not silently replace concrete player-command identity.

## 3. UI/gameplay audit findings

### 3.1 What is currently playable

The current product can, in bounded paths:

- create a character;
- inspect character/world records;
- manage basic inventory/equipment;
- travel to supported known locations;
- rest in supported settlement context;
- accept/track/complete the accepted Soundings quest path;
- explore nearby environs;
- naturally discover and approach a nearby encounter;
- execute projected legal combat commands;
- survive Normal-Stakes defeat/recovery;
- save/load/restart through the accepted epoch persistence path.

### 3.2 What is not yet an ordinary player-command loop

Current authored records or domain data should not be mistaken for executable sandbox play. Ordinary player paths are not yet broadly established for:

- repeatable local paid work;
- general resource gathering;
- broad crafting/production;
- farming;
- property/land management;
- building;
- guild membership/rank;
- companion recruiting/party building;
- swimming/climbing traversal;
- boat piloting/docking;
- general merchant/storefront transaction flow;
- repeatable mob-material reward loops.

These should become executable only when a domain owner and durable player path exist.

### 3.3 Main UI discovery problem

The current shell exposes six broad domains:

- Character;
- World;
- Activity;
- Codex;
- Quests;
- Chronicle.

The player-facing problem is not raw command count. It is that the product does not consistently foreground:

1. where the character is;
2. what is immediately around them;
3. what is happening;
4. the small set of actions that are actually executable now.

The future Home/re-entry/current-situation surface should answer those four questions before it asks the player to browse domain catalogs.

## 4. Missing architectural foundation: local scene projection

Current durable player location is comparatively thin:

- `settlementId`;
- `siteLabel`;
- `worldMapId`.

World/encounter state already carries richer contextual material such as:

- region;
- settlement;
- site;
- world hex;
- world-hex edge;
- habitat tags;
- hazard pressure;
- route/terrain/barrier information elsewhere in the world/travel domain.

A generalized contextual-action system needs a reusable **local scene/context projection** that can answer questions such as:

- Is the character in a forest, field, mine, town street, interior, dock, boat, bridge, riverbank, or lake?
- Is there a creek, bridge, ford, road, tree line, workstation, field plot, merchant, NPC, vessel, resource node, container, or doorway nearby?
- What property/permission/law applies?
- What is the weather, light, season, danger, depletion, or closure state?
- What equipment, knowledge, abilities, injuries, encumbrance, active work, or combat state changes what the player can do?

This projection should **not** become a new source-of-truth database. It should be derived from existing authoritative owners.

## 5. Proposed conceptual pipeline

Use the following conceptual separation when designing the durable system:

```
Authoritative world/player/domain state
          ↓
LocalSceneContext
          ↓
Context/Affordance Resolver
          ↓
ContextActionDescriptor[]
          ↓
Player-facing contextual UI
          ↓
Selected concrete command
          ↓
Domain-specific command owner
          ↓
Authoritative result / mutation / history
```

Important:

- the resolver decides what is relevant and how it is presented;
- the command owner decides whether the attempted command is legal at execution time;
- the resolver must not duplicate domain simulation logic;
- the UI must not mutate gameplay state directly.

## 6. Proposed LocalSceneContext shape

This is an architecture input, not an accepted schema.

```text
LocalSceneContext
  actor
    playerId
    body/resources/status
    equipment/inventory
    skills/abilities/spells
    knowledge/discovery
    encumbrance
  position
    continent
    region
    hex
    edge
    settlement
    district
    site
    interior
    workplace
    property
    vehicle/vessel
  environment
    biome
    habitatTags
    terrain
    waterFeatures
    elevation
    structures
    routes
    weather
    light
    season
    hazards
  nearby
    characters
    creatures
    looseItems
    containers
    resources
    buildings
    workplaces
    vehicles/vessels
    exits
    pointsOfInterest
  access
    ownership
    permission
    law/trespass
    claims
    openingHours
    employment
    rental/invitation
  activity
    combat
    travel
    work
    rest
    crafting
    interruption
  world
    depletion
    events
    closures
    market/work demand
```

The durable design should decide which of these are identifiers/references versus projected presentation facts.

## 7. Proposed ContextActionDescriptor shape

This is likewise an architecture input, not an accepted contract.

```text
ContextActionDescriptor
  id
  family
  concreteCommandType
  verb
  label
  target
  sourceContext
  availability
    available
    risky
    blocked_explained
  blockedReason?
  presentationPriority
  interactionShape
    direct
    expand
    activity
    confirm
  durationPreview?
  costPreview?
  riskPreview?
  consequencePreview?
  subActionProvider?
  commandOwner
  commandPayloadSeed
```

Do not expose hidden information merely to explain a blocked action.

## 8. Action identity must be separated from action-family matching

The selected combat proof provides a concrete warning.

The architecture should distinguish at least:

```text
ActionFamily
  combat.melee

ConcreteCommandIdentity
  combat.attack.melee.basic
  combat.melee.primary
  combat.interrupt.shield_bash

Compatibility / modifier tags
  melee
  weapon.sword
  shield
  interrupt
```

A family match may decide that a skill modifier applies. It must not silently rewrite or shadow the concrete command the player is choosing.

Apply this lesson outside combat as well:

- `gather` family versus `gather.deadwood` / `gather.berries` / `collect.water`;
- `travel` family versus `cross.bridge` / `ford.stream` / `sail.route`;
- `craft` family versus a concrete recipe/process command;
- `trade` family versus buy/sell/barter;
- `farm` family versus plow/sow/water/weed/harvest.

## 9. Availability/gating philosophy

For an open-world sandbox, skills should usually **modify** actions rather than merely hide them.

A novice may often attempt an action poorly.

Skills/attributes/knowledge/equipment may change:

- success chance;
- output quality;
- yield;
- speed/duration;
- stamina/resource cost;
- injury/failure risk;
- information revealed;
- available methods;
- maximum complexity;
- consequence severity.

Use hard gates mainly for genuine impossibility or institutional authority:

- no cutting implement -> cannot fell a mature tree;
- no controllable vessel -> cannot sail;
- no spell knowledge -> cannot cast that spell;
- no property authority -> cannot legitimately manage/build on that plot;
- no forge -> cannot perform forge-only production.

Risky, illegal, or socially restricted does not always mean impossible. Where the game supports it, surface a risky/illegal command with proper consequences instead of pretending the world physically forbids it.

## 10. Interaction shapes

### Direct

Use when there is one obvious interpretation and no meaningful remaining choice.

Examples:

- Look Around;
- Exit Tavern;
- Board the only available moored vessel;
- Cross an intact unrestricted footbridge.

### Expand

Use when a meaningful target/method/quantity/recipe/destination decision remains.

Examples:

- Gather;
- Travel;
- Craft;
- Talk;
- Trade;
- Farm;
- Manage Property;
- Fish.

### Activity

Use for time-consuming work that can advance, pause, interrupt, fail, or complete.

Examples:

- forage;
- mine;
- chop;
- harvest;
- travel;
- work;
- craft;
- sleep.

### Confirm

Use when the action is semantically clear but carries unusual danger, illegality, expense, or irreversibility.

Examples:

- enter a restricted property;
- swim a dangerous flooded river;
- attack a neutral NPC;
- destroy/abandon a valuable item.

Do not create fake one-item submenus where confirmation is sufficient.

## 11. Base contextual action taxonomy

The following is a **candidate base taxonomy for design evaluation**. These are player-facing concepts, not final command IDs.

| Base action | Typical scene/context | Primary gates | Common modifiers | Recommended shape |
| --- | --- | --- | --- | --- |
| Look Around | anywhere | ability to perceive | light, weather, perception, knowledge | direct |
| Inspect | object/feature/tracks/corpse/plant | observable/access | skill, light, tools, permission | direct or expand |
| Move | local traversable scene | reachable position | terrain, injury, load, mount | expand |
| Travel | known destination/route | reachable route/mode | weather, load, mount, danger | expand → activity |
| Follow | road/trail/river/tracks | followable feature | visibility, tracking, navigation | direct/activity |
| Enter / Exit | building/cave/gate/ship/property | accessible entrance | lock, permission, hours, danger | direct/confirm |
| Cross | bridge/ford/obstacle | traversable feature | condition, toll, current, load | direct/confirm/expand |
| Climb | wall/cliff/tree/ladder/rigging | climbable feature | skill, rope, weather, fatigue | direct/confirm/activity |
| Swim / Wade / Ford | accessible water | physically possible route | depth, current, load, temperature | expand/confirm |
| Explore | wilderness/ruin/district | valid exploration context | time, stamina, weather, danger | activity |
| Search | room/site/camp/shore | searchable area | time, perception, knowledge | activity |
| Gather | accessible resource | resource + access | tool, skill, season, ownership, capacity | expand → activity |
| Forage | viable habitat | forage profile | ecology, knowledge, daylight, depletion | activity |
| Cut / Fell / Chop | timber/deadwood | wood + usable tool | skill, law, ownership, stamina | expand → activity |
| Mine / Quarry / Dig | deposit/ground | viable source + access | tools, claim, safety, skill | expand → activity |
| Track / Hunt | prey/sign/habitat | viable target/context | skill, weather, stealth, gear, law | expand → activity |
| Fish | creek/river/lake/coast/dock/boat | fishable water | gear, bait, season, rights, ecology | expand → activity |
| Drink Water | reachable water | source reachable | safety, contamination knowledge | direct |
| Collect Water | source + container | valid source/container | volume, quality, permission | expand |
| Board / Disembark | vessel/landing | reachable vessel | permission, position, load | direct |
| Row / Sail / Pilot | controllable vessel | control access | skill, weather, current, crew | expand → activity |
| Moor / Dock / Anchor | suitable vessel/site | valid berth/anchor context | depth, current, rights, gear | direct/expand |
| Load / Unload | cargo/vehicle/storage | accessible source/destination | ownership, capacity, labor | expand → activity |
| Mount / Dismount | mount/vehicle | controllable transport | permission, injury, load | direct |
| Camp | suitable open land | viable campsite | law, danger, terrain, weather, supplies | expand |
| Rest | safe/permitted place | ability to pause | shelter, safety, price, time | expand/activity |
| Sleep | bed/camp/shelter | sleep-capable context | safety, fatigue, permission | activity |
| Build Fire | fire-safe site/hearth | valid site | fuel, ignition, weather, law | direct/expand |
| Cook / Prepare | food + station/process | viable process | recipe, fuel, tools, ingredients | expand → activity |
| Craft | item/tool/station/workplace | relevant process | material, tools, recipe, access | expand → activity |
| Repair / Maintain | damaged target | repairable target | tools, material, skill, ownership | expand → activity |
| Use / Operate | lever/pump/mill/forge/etc. | interactable | state, power/fuel, access, skill | direct/expand |
| Talk | nearby communicative NPC | reachable/available NPC | language, hostility, schedule, relation | expand |
| Ask / Inquire | active NPC interaction | relevant topic/context | role, relation, knowledge | sub-action |
| Trade | merchant/market/counterparty | willing trade context | hours, funds, reputation, stock | expand |
| Browse Goods | shop/stall/market | observable seller/stock | access, hours | direct → view |
| Seek Work | settlement/employer/workplace | job source exists | demand, reputation, skills, season | expand |
| Perform Work | accepted work order | valid active job | skill, tool, schedule, stamina | activity |
| Farm | owned/permitted plot | agricultural authority | season, soil, weather, tools | expand |
| Plow/Sow/Water/Weed/Harvest | selected plot/stage | valid crop/plot stage | tools, seeds, water, labor | activity |
| Tend Animals | accessible livestock | animal + authority | feed, tools, health, ownership | expand → activity |
| Manage Property | owned/leased property | legal control | taxes, lease, staff, upgrades | expand |
| Build / Improve | controlled buildable site | authority + viable site | permit, materials, labor, terrain | project/activity |
| Store / Retrieve | container/warehouse/home/vehicle | accessible storage | locks, ownership, capacity | expand |
| Take / Pick Up | loose item | reachable item | ownership/law, weight, trap, capacity | direct/quantity |
| Drop / Place | held item | valid placement | terrain, law, quantity | direct/expand |
| Eat / Drink / Use Item | selected item | item supports action | body state, amount, condition | direct/quantity |
| Equip / Ready | selected equipment | compatible item/slot | requirements, body/combat state | direct |
| Offer / Give | NPC/party interaction | recipient can receive | ownership, relation, willingness | expand |
| Accept Contract | NPC/board/event/location | eligible offer | location, prerequisites, reputation | direct/confirm |
| Report / Turn In | relevant counterparty/site | objective complete | availability, evidence/items | direct |
| Steal / Pickpocket | viable owned target | physically possible attempt | stealth, awareness, law, witnesses | confirm/activity |
| Lockpick / Force Entry | locked portal/container | viable method | tools/strength, skill, witnesses | expand/confirm |
| Trespass / Sneak In | restricted location | physical path | law, guards, stealth, visibility | confirm/activity |
| Engage / Attack | viable target | combat-capable target | hostility, range, rules, body state | direct/confirm |
| Combat Action | active encounter | currently legal command | timing, target, equipment, resources | direct/target picker |
| Flee / Disengage | combat/immediate danger | escape method | terrain, speed, injury, enemy control | direct/confirm |

This table should be normalized into a smaller durable taxonomy rather than copied blindly into schemas.

## 12. Context examples the architecture must support

### Forest beside a creek

Potential base surface:

- Look Around
- Explore Woods
- Follow Creek
- Gather
- Collect Water
- Fish
- Make Camp

Possible expansion under Gather:

- deadwood;
- berries;
- medicinal herbs;
- stones/clay if context supports them.

Changes:

- rain may improve water availability but hinder fire/climb/tracking;
- darkness reduces observation;
- axe enables timber processes;
- local ownership/law may make felling illegal while deadwood remains permitted;
- season changes forage/fish/resource availability;
- depletion changes yield or removes a resource action.

### Bridge / ford / river crossing

Potential surface:

- Inspect Crossing
- Cross Bridge
- Pay Toll and Cross
- Wade/Ford
- Swim Across
- Follow River
- Turn Back

Changes:

- bridge damage converts a direct crossing into risky confirmation;
- flooding may remove ordinary fording;
- horse/cart may add Lead Across / Ride Across / Find Another Route;
- toll/guard ownership introduces social/economy commands.

### Town center

Potential surface:

- Look Around
- Browse Local Places
- Talk
- Seek Work
- Visit Market
- Travel within town
- Enter selected building

Do not expose guild membership, employment, or services merely because descriptive records exist. Only project actions backed by real owner state.

### Dock / riverfront

Potential surface:

- Look Around
- Fish from Dock
- Talk to Dockmaster
- Browse Cargo/Market
- Seek Dock Work
- Board Vessel
- Load/Unload
- Travel by vessel if a valid route/transport owner exists

### On a vessel

Potential surface may change to:

- Look Around
- Pilot / Row / Sail
- Adjust course
- Anchor / Moor
- Inspect vessel
- Manage cargo
- Rest
- Fish
- Disembark when valid

The UI should not preserve irrelevant land actions merely because they exist elsewhere.

### Farm / owned land

Potential surface:

- Inspect Plot
- Farm
- Tend Animals
- Gather/Harvest
- Manage Storage
- Repair
- Manage Property
- Build/Improve

Property ownership/lease/employment controls legitimacy; weather/season/crop stage controls available work.

## 13. UI presentation direction

The future primary contextual surface should answer:

1. **Where am I?**
2. **What is around me?**
3. **What is happening now?**
4. **What can I do right now?**

The proposed Home/re-entry/current-situation surface should not replace all domain panels.

Instead:

- Home/context is the default action-oriented surface;
- domain panels remain deeper management/information surfaces;
- selecting a nearby entity, place, resource, item, NPC, workplace, vessel, or property can refine contextual actions;
- after a contextual flow completes, the UI should return naturally to the current situation instead of dropping the player into an unrelated catalog.

Base actions should be human-readable:

- `Gather nearby resources`
- `Follow the creek`
- `Browse the waterfront`
- `Talk to Dockmaster`
- `Fish from the dock`

Do not expose internal command IDs as primary labels.

## 14. Action ranking/grouping direction

The durable design should decide how many actions are primary versus secondary.

Candidate ranking inputs:

- immediate threat/urgency;
- current tracked objective;
- current location role;
- selected entity;
- recently used action;
- actionable local opportunity;
- player profession/knowledge;
- blocked-but-instructive action.

Avoid ranking solely by the character's archetype. A trader in a burning building should see `Exit` before `Browse Market`.

Possible UI groups:

- Immediate
- Move / Travel
- Interact
- Work / Gather
- Social / Trade
- Rest / Camp
- More...

The final design should keep the base surface compact without making valid actions undiscoverable.

## 15. Blocked-action policy

Default:

- omit actions that are irrelevant or physically impossible;
- show blocked actions only when seeing the requirement is useful to the player.

Good examples:

- `Chop Tree — Requires an axe`
- `Use Forge — Requires permission`
- `Sail — No controllable vessel`
- `Harvest — Crop is not ready`

Bad examples:

- hundreds of disabled verbs for systems not implemented or contexts not present;
- hidden-information leaks such as revealing a secret door merely by showing `Open Secret Door — blocked`.

## 16. Preview policy

Actions should preview consequences when the player can reasonably know them.

Candidate previews:

- time;
- stamina/resource cost;
- money/toll;
- inventory capacity;
- obvious legal/risk warning;
- expected destination;
- known required tool;
- likely body-state strain.

Do not promise exact hidden yields, unseen enemy state, secret probability rolls, or undiscovered information.

## 17. Domain-owner routing candidates

The architecture pass should map action families to existing or required owners.

Examples:

- travel/cross/local movement -> travel/location owner;
- explore/search/encounter approach -> world/exploration/encounter owners;
- combat commands -> combat owner;
- item open/split/transfer/store -> generic item-instance owner;
- equip/use -> equipment/item/consumption owner;
- gather/forage/mine/fish -> resource/activity owners to be defined/confirmed;
- craft/cook/repair -> crafting/process owner;
- trade -> market/economy transaction owner;
- talk/give/social -> NPC/interaction owner;
- farm/property/build -> agriculture/property/project owners to be defined;
- boat/vehicle -> travel/transport/vessel owner;
- quest accept/submit -> quest owner.

Do not invent owner boundaries that contradict accepted design docs. Identify missing owners explicitly.

## 18. What should be implemented first

Do **not** start by implementing the full taxonomy.

Recommended sequence:

### Phase A — finish current gameplay baseline

1. Repair the narrow selected basic-action identity bug.
2. Independently complete ordinary encounter victory/choice proof.
3. Make the separate Game-version policy decision.

### Phase B — documentation-first contextual command architecture

Publish a durable design package that resolves:

1. local scene projection;
2. concrete action descriptor contract;
3. command identity versus family/tag semantics;
4. availability/gating vocabulary;
5. direct/expand/activity/confirm rules;
6. action ranking/grouping;
7. owner routing matrix;
8. preview/blocked-action rules;
9. interruption/time semantics;
10. target selection/sub-action rules;
11. persistence/history boundary;
12. UI consumption contract.

### Phase C — first implementation uses only existing commands

Before inventing gathering/farming/etc., make the new resolver project commands that already exist:

- Travel
- Explore
- Approach Encounter
- legal Combat Actions
- Rest
- quest Accept / Track / Submit
- Equip
- Use Consumable

Expose these through the new Home / Current Situation surface.

This proves the architecture without simultaneously inventing new gameplay domains.

### Phase D — first new sandbox loop

A strong first new loop is environmental resource interaction because it crosses the important boundaries:

```
local scene
→ observable resource
→ contextual Gather/Collect action
→ tools/skills/permissions/time
→ resource depletion/yield
→ durable inventory
→ later hand/station crafting
```

A bounded initial example could use forest/creek context with:

- deadwood;
- a forageable plant/herb;
- collectable water;
- a simple material useful in one hand/station crafting process.

Do not jump directly to the entire farming/property/economy simulation.

## 19. UI overhaul relationship

The visual/UI overhaul should consume this architecture, not independently recreate action logic.

Desired order:

```
combat baseline closure
→ Game-version decision
→ contextual command architecture
→ Home/current-situation implementation over existing commands
→ structural UI overhaul around the contextual system
→ first new sandbox action loop
→ broader 0.2 vertical-slice development
```

If architecture work can proceed documentation-only in parallel with the narrow combat repair, it must not alter the current combat acceptance route or claim implementation authority.

## 20. Questions the durable architecture pass must explicitly answer

1. What state is canonical for exact local position/context?
2. Which context data is persisted versus derived?
3. How are nearby entities/resources discovered and projected?
4. What is the stable identifier for a concrete player command?
5. How are action families/tags kept distinct from command identity?
6. Can more than one owner contribute actions to the same target?
7. How are duplicate/synonymous affordances merged without changing authority?
8. When are blocked actions shown?
9. How does the resolver avoid hidden-information leaks?
10. How are direct, expand, confirm, and activity actions represented?
11. How are target/method/quantity/recipe sub-actions resolved?
12. How are costs/duration/risks previewed?
13. How does context react to time/weather/season/ownership/law/depletion?
14. How does active combat or interruption suppress/replace ordinary actions?
15. How are actions ordered so Home remains concise?
16. How does a player inspect "all available actions" when contextual ranking hides low-priority actions?
17. How does the system integrate accessibility/input/controller/keyboard concerns?
18. How are accepted commands recorded in history/chronicle where appropriate?
19. How does save/load preserve owner state without persisting presentation-only descriptors?
20. What is the migration path from existing per-panel action buttons to shared contextual projection?

## 21. Non-goals for the first architecture pass

Do not:

- implement every action listed in this artifact;
- replace accepted domain owners with one generic command executor;
- rewrite the persistence system;
- merge the held character-creator branch;
- promote the Game version merely because an architecture exists;
- claim guild/farming/building/boat/companion functionality is playable;
- encode speculative schemas before owner boundaries are resolved;
- make the UI overhaul responsible for gameplay authority;
- reopen G10 persistence work without a new contradiction.

## 22. Expected output from a Codex architecture-consumption pass

The consuming pass should produce durable, authoritative documentation separate from this temporary artifact.

At minimum, it should publish:

1. a focused Contextual Player Action And Command Architecture decision;
2. a Local Scene / Context projection contract decision;
3. an action identity / family / compatibility rule;
4. a context-action descriptor/presentation contract;
5. a domain-owner routing matrix;
6. a location/surroundings affordance matrix covering at least:
   - wilderness/forest;
   - creek/river;
   - bridge/ford;
   - town;
   - interior/shop/workplace;
   - dock;
   - vessel;
   - farm/property;
   - active combat;
7. a UI Home/current-situation consumption design;
8. a phased migration plan from current per-panel controls;
9. a first implementation slice using only already-existing commands;
10. a separately bounded first-new-sandbox-loop proposal;
11. explicit deferred/unknown owner gaps;
12. a deletion/retirement instruction for this temporary artifact after durable decisions supersede it.

The architecture pass may split these into several durable decisions if repository protocol prefers smaller authorities.

## 23. Audit-derived product direction

The intended experience is not "choose one class/job and follow its menu."

A character should be able to change behavior because of:

- where they are;
- what surrounds them;
- what they possess;
- what they know;
- who controls the place/resource;
- what time/weather/world state makes possible;
- current threats and obligations.

A warrior can trade. A trader can fight. A farmer can travel. A landowner can gather wood. A crafter can take contracts. The contextual system should make those affordances legible without hard-wiring the UI around a permanent profession identity.

The UI should feel like interacting with a world, not navigating a database of future systems.
