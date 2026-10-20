# Ecology-Grounded Contextual Affordance Expansion Plan

Date: 2026-10-20  
Status: documentation-only expansion plan; no production implementation authority.  
Extends:
- `contextual-player-action-and-command-architecture-decision.md`
- `local-scene-context-projection-decision.md`
- `contextual-player-affordance-and-owner-matrices.md`

The active Ordinary Combat Basic Action Selection Repair remains separate and unchanged.

## 1. Purpose

The initial contextual-action examples emphasized forest, creek, bridge, town, dock, vessel, farm and combat. Repository ecology is materially broader. This plan expands environmental coverage using actual authored world data while preserving the architecture rule that **broad ecological classification is context, not executable authority**.

At the inspected source line the repository contains:

- 36 biomes;
- 93 habitats;
- 9 regional ecology profiles;
- 47 region-locality/world-hex records;
- 49 world-hex edges.

Biome climate bands include:

- desert;
- subterranean;
- temperate;
- wetlands;
- polar;
- shrublands;
- marine;
- tropical;
- grasslands.

Habitat families include:

- marine;
- coastal;
- hydrology;
- vegetation;
- disturbance;
- subterranean;
- geomorphology;
- supernatural.

Habitat geometry includes:

- point;
- patch;
- linear;
- edge;
- volume.

World-hex edge types include:

- road;
- trail;
- river;
- ferry;
- pass;
- sea lane.

Travel modes include:

- foot;
- horseback;
- pack animal;
- wagon;
- river craft;
- sea vessel.

The environmental action system must generalize across this data without one code branch per biome or habitat ID.

## 2. Environmental hierarchy

Use this conceptual hierarchy when determining contextual affordances:

```
regional ecology
  ↓
biome / climate envelope
  ↓
world hex + locality band
  ↓
local habitat / geomorphology / hydrology / disturbance
  ↓
edge / route / crossing
  ↓
site / structure / interior / vessel / resource instance
  ↓
transient weather / hazard / depletion / encounter / event
```

Each layer answers a different question.

### Regional ecology

Broadly answers:

- what flora/fauna/resource families are plausible;
- dominant/supporting biome tendencies;
- broad water/climate/hazard pressure;
- ecological/economic strengths and deficits.

It does **not** prove a local resource target.

### Biome

Broadly answers:

- ecological envelope;
- fertility tendency;
- common environmental hazards;
- climate compatibility.

Examples already authored include:

- Steppe;
- Savanna;
- Alpine Meadow;
- Temperate Rainforest;
- Taiga;
- Mixed Forest;
- Bog;
- Marsh;
- Mangrove Forest;
- Swamp;
- Tundra;
- Polar Ice Cap;
- Dry Scrub;
- Chaparral;
- Marine;
- Tropical Rainforest;
- Cloud Forest;
- Hot Desert;
- Cold Desert;
- Mushroom Forest;
- Underdark.

Biome modifies context. It does not itself create a Gather, Fish, Cross or Mine target.

### World hex / locality

Coarse spatial context already includes concepts such as:

- biome family;
- elevation;
- terrain type;
- freshwater type;
- barrier tags;
- hazard tags;
- resource-affinity tags;
- anchored settlements;
- locality resource catchment;
- route access;
- dominant industries.

This can shape discovery, route/movement, expected opportunities and Home summaries.

It still does not prove exact local adjacency.

### Habitat / feature

This is much closer to action-level environmental context.

Actual authored examples include:

**Coastal**
- Shoreline
- Sea Cliff
- Dune Ridge
- Beach
- Tidal Flat
- Estuary
- Tide Pools
- Blowhole

**Hydrology**
- Cold Spring
- Hot Spring
- Rapids
- Braided Channel
- River
- Stream
- Seasonal Creek
- Oxbow Lake
- Lake
- Pond
- Marsh Pool
- Riverbank
- Floodplain Terrace

**Vegetation**
- Flower Meadow
- Brush Patch
- Thicket
- Clearing
- Forest Edge
- Ancient Tree
- Fallen Log

**Disturbance**
- Dust Bowl
- Flood Debris Field
- Burn Scar
- Windthrow
- Landslide
- Blight Patch

**Subterranean**
- Fungal Grotto
- Lava Tube
- Dry/Flooded/Ice Cave
- Cavern
- Crystal Cave
- Chasm
- Tunnel Network
- Subterranean River
- Underground Lake
- Stalagmite Field
- Gas Vent
- Underground Spring

**Geomorphology**
- Escarpment
- Cliff
- Mountain Pass
- Scree Run
- Dry Wash
- Ravine
- Canyon
- Ridge Line
- Basin
- Sinkhole
- Talus Field
- Mudflat
- Salt Pan
- Geothermal Field
- Rock Spire

**Marine**
- Coral Reef
- Kelp Forest
- Seagrass Meadow
- Current Front
- Shelf Break
- Hydrothermal Vent
- Cold Seep

**Supernatural**
- Planar Rift
- Ley Node
- Portal Scar
- Cursed Idol Site
- Leyline
- Aether Fissure
- Genie Oasis
- Corrupted Grounds
- Chaos Garden
- Poison Forest
- Sanctuary
- Temporal Stillzone
- Elemental Zone
- Prismatic Curtain

Habitat records are environmental evidence and compatibility inputs. An executable action still requires player-relative observation plus an appropriate command owner.

## 3. Geometry matters

Habitat `shape` should influence scene semantics without becoming a command owner.

### Point

Examples:

- spring;
- ancient tree;
- blowhole;
- rock spire;
- planar rift.

Likely interaction pattern:

- approach/select;
- inspect;
- interact/gather/use if an owner exists;
- route around if hazardous.

### Patch

Examples:

- estuary;
- tidal flat;
- meadow;
- burn scar;
- salt pan;
- coral reef.

Likely interaction pattern:

- enter/occupy;
- explore/search;
- gather/hunt/fish within;
- traverse across;
- receive area hazards/modifiers.

### Linear

Examples:

- river;
- seasonal creek;
- canyon;
- leyline;
- subterranean river.

Likely interaction pattern:

- follow upstream/downstream/along;
- cross;
- navigate parallel to;
- enter/leave;
- use as route/resource boundary.

### Edge

Examples:

- shoreline;
- sea cliff;
- forest edge;
- escarpment.

Likely interaction pattern:

- cross boundary;
- follow edge;
- inspect below/across;
- transition between adjacent scene types.

### Volume

Examples:

- cave;
- cavern;
- fungal grotto.

Likely interaction pattern:

- enter/exit;
- occupy/explore internally;
- manage light/air/confined traversal;
- discover contained subfeatures/resources.

The final implementation may encode these semantics through capability tags rather than literal shape switches, but the scene model must not discard geometry.

## 4. Environment families and contextual-action pressure

### Open grassland / Steppe / Prairie / Savanna

Likely high-value contextual families:

- Look / scan horizon
- Travel / follow route
- Track / Hunt
- Forage
- Camp
- Tend herd where owned/employed
- Seek water / follow seasonal creek where observed
- Mounted/caravan actions where transport exists

Important modifiers:

- drought;
- grassfire;
- storms;
- wind/exposure;
- water scarcity;
- grazing/depletion;
- visibility;
- mounted mobility.

Steppe should not simply reuse a forest Gather menu with different labels.

### Wetland / Marsh / Swamp / Fen / Mangrove

Likely pressure:

- Wade / navigate
- Follow channel
- Fish
- Forage/gather wetland resources
- Collect water only where quality/method allows
- Boat/skiff context where owned
- Search for firm route
- Camp only on viable dry ground

Important modifiers:

- miasma/disease;
- waterlogged soil;
- flood;
- insects;
- predators;
- entangling vegetation;
- brackish water;
- visibility.

### Estuary / Tidal Flat / Shore / Beach

Likely pressure:

- Observe tide/current
- Fish / gather shellfish where owner/resources exist
- Follow shoreline/channel
- Wade/cross tidal flat
- Board / moor / launch where vessel/landing exists
- Collect salt/reeds or other resources only when observed
- Travel between river/coast modes

Important modifiers:

- tide;
- salinity;
- current;
- storm surge;
- mud/soft ground;
- daylight;
- fishing/access rights;
- vessel draft.

An estuary must not inherit `Drink Water` merely because it is water.

### Marine / Reef / Kelp / Current Front

Likely pressure:

- Sail / pilot
- Fish
- Navigate current
- Anchor/moor where viable
- Dive/swim only with a future owner and appropriate equipment
- Inspect marine feature
- Harvest marine resource only with owner/instance

Important modifiers:

- open sea;
- currents;
- waves;
- visibility;
- depth;
- vessel condition;
- storm;
- salinity;
- reef grounding risk.

### Forest / Rainforest / Taiga / Woodland

Likely pressure:

- Explore
- Follow trail/stream
- Forage
- Gather deadwood/plants
- Cut/fell if tool/rights permit
- Track/hunt
- Camp
- Climb where feature supports it

Important modifiers:

- density;
- canopy/light;
- rain/snow;
- fire/blight;
- visibility;
- ownership/stewardship;
- timber/resource depletion.

### Shrubland / Chaparral / Dry Scrub

Likely pressure:

- Travel / route finding
- Forage sparse resources
- Cut brush
- Track/hunt
- Camp with fire caution
- Seek water
- Gather woody/herbal material where present

Important modifiers:

- drought;
- wildfire;
- thorn thickets;
- heat;
- visibility;
- water scarcity.

### Desert / Salt Pan / Dry Wash / Dune

Likely pressure:

- Navigate
- Seek/collect water where observed
- Follow wash/caravan route
- Mine/prospect
- Forage rare resources
- Camp/shelter
- Travel mounted/caravan

Important modifiers:

- heat/cold desert exposure;
- sandstorm;
- drought;
- glare;
- water;
- load;
- navigation;
- fragile/rare resource patches.

### Polar / Tundra / Ice / Alpine

Likely pressure:

- Travel
- Seek shelter
- Camp
- Hunt/fish
- Cross snow/ice
- Climb/pass traversal
- Collect fuel/resource where available

Important modifiers:

- cold;
- whiteout;
- thin air;
- avalanche;
- crevasse;
- frostbite;
- daylight;
- ice condition.

### Subterranean

Likely pressure:

- Enter/Exit
- Explore
- Navigate tunnel/river
- Climb/descend
- Mine/prospect
- Collect underground water/resources
- Camp/rest only where safe
- Manage light/air

Important modifiers:

- darkness;
- cave-in;
- toxic gas/mold;
- flooding;
- confined space;
- route memory;
- vertical traversal;
- light source.

### Geomorphology / cliffs / passes / ravines / canyons

Likely pressure:

- Inspect route
- Cross
- Climb
- Descend
- Follow ridge/canyon
- Seek alternate route
- Mine/prospect where appropriate

Important modifiers:

- slope;
- surface stability;
- weather;
- load;
- mount/vehicle;
- rockfall;
- rope/tools;
- route condition.

### Disturbance habitats

Burn scars, windthrow, landslides, flood debris, dust bowls and blight patches should be modeled as **stateful scene modifiers/features**, not separate global modes.

They may:

- reveal salvage/resources;
- block or alter travel;
- create temporary gathering opportunities;
- suppress ordinary resources;
- raise hazard;
- change encounter/spawn pressure;
- create repair/clear-work opportunities where a work owner exists.

### Supernatural habitats

Supernatural authored data should not automatically create generic magical verbs.

Until an appropriate owner exists, contextual actions may be limited to character-observable:

- Look
- Inspect
- Avoid
- Travel around/through if ordinary movement permits

Later owners may add:

- attune;
- dispel;
- harvest;
- activate;
- stabilize;
- commune;
- enter portal;

but only with explicit command/consequence authority.

## 5. Ecology-derived resource availability

The existing spatial-world engine already computes `HexResourceAvailabilityState` for flora/fauna/minerals from:

- biome compatibility;
- climate;
- elevation;
- freshwater;
- locality;
- resource-affinity tags;
- rarity.

This should become an input to future environmental discovery, not direct Gather authority.

Maintain three levels:

```
ecologically plausible
→ locally discovered/observed
→ interactable resource instance with command owner
```

A Home surface may eventually say:

> This river plain is good country for fish and reeds.

before the character has located a specific fishable pool or harvestable reed bed.

It must not say:

> Gather 4 reeds

until a resource owner has supplied an actual eligible target.

## 6. Revised implementation sequence

### Phase 0 — current route

Unchanged:

1. Basic Action Selection Repair.
2. Independent ordinary encounter victory/choice acceptance.
3. Separate Game-version decision.

### Phase 1 — existing-command Home

Unchanged in principle:

- LocalSceneContext projection;
- Home / Current Situation;
- existing Travel;
- Explore;
- Approach;
- legal combat commands;
- Continue;
- Rest;
- quest commands;
- Equip/Unequip;
- Use Consumable.

New ecology requirement:

The Home projection must be able to carry broad environmental provenance even when no new environmental command exists.

For example, it should be possible to distinguish:

- Stonevein dry scrub/highland;
- Embersteppe open steppe;
- river plain;
- coastal bay;
- forest vale;

without inventing Gather/Fish/etc. actions.

### Phase 2 — Environmental Affordance Kernel

Before a full resource loop, implement/readably define a small environment capability layer that can project:

- broad biome/ecology background;
- hex/locality;
- observed habitat/features;
- feature geometry;
- water context;
- route/edge context;
- hazards;
- resource candidate summaries;
- uncertainty/provenance.

This remains read-only until command owners supply interactions.

Acceptance should use contrasting selected fixtures/scenes so the resolver is not forest-specific.

Minimum coverage targets:

1. open steppe / seasonal-water case;
2. forest/woodland case;
3. river/floodplain case;
4. estuary/tidal/coastal case;
5. upland/cliff/pass or subterranean case.

Not every case needs executable new commands in this phase.

### Phase 3 — First Resource Interaction Kernel

Keep the first implementation small, but require the **owner model** to generalize.

Implement one bounded resource family and one or two concrete gather/collect commands using real observed resource instances.

Recommended first target remains a low-risk material/water interaction because it exercises:

- scene feature;
- discovery;
- tool/container;
- time;
- capacity;
- inventory output;
- depletion;
- save/restart.

However, do not validate only in forest.

The owner-level test matrix should include representative ecology variation such as:

- steppe + seasonal creek / riverbank;
- estuary or tidal-flat compatibility;
- forest edge / fallen-log compatibility;

even if selected UI acceptance initially exposes only one or two authored locations.

The purpose is to prove the owner consumes environmental capabilities/provenance rather than hardcoded `if forest` logic.

### Phase 4 — Broaden environmental resource play

Expand by environmental family, not one biome at a time:

- terrestrial plant/wood;
- freshwater;
- coastal/brackish;
- marine;
- mineral/geology;
- fauna/hunting/fishing;
- disturbed/salvage;
- subterranean.

Each expansion should reuse the same scene/action contracts.

### Phase 5 — UI overhaul and broader sandbox systems

The structural UI overhaul continues to consume the same contextual descriptors.

Later systems plug into scene affordances:

- work/employment;
- merchant/trade;
- farming;
- property;
- building;
- mounts;
- vessels;
- crime;
- social interaction.

No separate environment-specific UI shell should be introduced.

## 7. Coverage acceptance principle

A contextual environment system is not considered generalized merely because it supports several named biomes.

Acceptance should ask:

1. Does adding an authored habitat with existing semantic capabilities require data/owner configuration rather than a new UI branch?
2. Does the scene preserve uncertainty between broad biome suitability and exact local observation?
3. Can the same command family operate across different environments while concrete methods/gates differ?
4. Do weather, water, elevation, geometry, ownership and hazards modify the descriptor without rewriting command identity?
5. Can unsupported supernatural or future environments remain descriptive without generating fake commands?
6. Can save/load recompute the same observed scene from authoritative owner state?

## 8. Explicit anti-patterns

Do not:

- create a 36-biome switch in the UI;
- create a 93-habitat command table in React;
- treat habitat names as command IDs;
- expose resources directly from hex compatibility scores;
- infer estuary water is potable;
- infer every steppe has a seasonal creek;
- infer every coastal hex has a dock or vessel;
- infer every cave has ore;
- treat supernatural habitat records as executable magic interactions;
- persist the entire ecology catalog inside PlayerLocationState;
- make every new biome require a new Home component.

The desired result is an environmental affordance system whose vocabulary can grow with authored ecology while command authority remains domain-specific.
