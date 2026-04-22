# Genre Gap Analysis: Materials, Ingredients, and Items

Generated: 2026-03-11

This report compares current Echoes of Legacy content DB coverage against common survival/sim/builder patterns (RimWorld, ARK, Valheim, Terraria, Don't Starve, Satisfactory references).

## Snapshot of Current Coverage
- Market entries: 373
- Item catalog entries (`packages/content/base/items/items.json`): 114
- Civilization economy entries (`source = civilization`): 101
- Production chains: 30

Category highlights from market entries:
- `material`: 21
- `ingredient`: 10
- `raw_material`: 16
- `fuel`: 7
- `food`: 13

## What Is Already Strong
- Core low-tech survival loops are present: wood, stone, clay, leather, cloth, basic metalworking (iron/copper), charcoal/firewood, preserved meat/fish, and simple alchemy.
- Combat/equipment breadth is solid for current scope (weapons/armor/tools/accessories).
- Production chain integrity is good: all chain outputs and byproducts map to market entries.

## Identified Gaps

### 1) Flora Output Token Mapping Gap (High)
Flora templates emit prefixed material/ingredient tokens that do not resolve to market item keys.

- Distinct template output tokens found: 22
- Tokens missing market mapping (18):
  - `ingredient.berries`
  - `ingredient.fungal_cap`
  - `ingredient.fungal_extract`
  - `ingredient.grain`
  - `ingredient.herb_bundle`
  - `ingredient.pollen`
  - `ingredient.sap`
  - `ingredient.seed_mix`
  - `ingredient.seeds`
  - `material.chaff`
  - `material.compost`
  - `material.fiber`
  - `material.mulch`
  - `material.mycelium`
  - `material.spore_dust`
  - `material.straw`
  - `material.twig_bundle`
  - `material.wood`

Why this matters:
- Harvest outputs can become design-only nouns unless translated into economy/market keys.

### 2) Metallurgy Progression Gap (High)
Mineral coverage includes many ores, but refinery coverage is shallow.

- `_ore` minerals: 13
- Corresponding `_ingot` keys present: 2 (`iron_ingot`, `copper_ingot`)
- Missing ingot progression for: `tin`, `lead`, `silver`, `gold`, `nickel`, `cobalt`, and fantasy ores (`mithrite`, `orichalcum`, `moon_silver`, `aetherite`).
- No alloy progression keys detected (for example bronze/steel ingot-grade commodity keys).

Why this matters:
- Common survival/builder economies rely on ore -> ingot -> alloy -> component progression for mid/late game pacing.

### 3) Agriculture and Ingredient Depth Gap (High)
Seed/farm-input coverage is thin relative to flora breadth.

- Cultivable-like flora records: 23
- Seed-related market keys: 2 (`flax_seed`, `seed_satchel`)
- Cultivable flora lacking explicit `<slug>_seed` commodity keys: 22

Also missing as explicit economy keys:
- Fertilizer/compost commodity loop
- Animal feed/fodder commodity loop
- General water ingredient commodity (outside terrain/biome semantics)

### 4) Fauna Output Payload Gap (High)
Fauna records define lifecycle/output timing but not concrete item/material payloads.

- Fauna records: 54
- Records with explicit passive output item/material/ingredient payload: 0
- Records with explicit slaughter output item/material/ingredient payload: 0

Why this matters:
- Species-level economy identity (milk/eggs/hides/fat/horn/etc.) is not expressed directly in fauna DB.

### 5) Food Processing Breadth Gap (Medium)
Food list exists, but culinary branches are narrow.

Observed:
- Raw/preserved staples are present (`fish_raw`, `game_meat_raw`, `smoked_meat`, `bread_loaf`, `flour`, etc.)

Missing common survival branches:
- Egg-based ingredients
- Dairy derivatives (`cheese`, `butter`, `curd`)
- Broths/stews/soups and cooked meal tiers
- Pickling/fermentation and seasoning ingredients beyond current basics

### 6) Construction and Crafting Component Gap (Medium)
Structural basics exist, but hardware/component layer is sparse.

Present:
- `plank`, `timber_beam`, `fired_brick`, `stone_tile`, `cut_stone`, `thatch_bundle`

Sparse or missing as standalone economy keys:
- Rope/twine/cordage commodity (tool exists: `rope_hook_kit`)
- Nails/rivets/fasteners
- Mortar/cement chain (quicklime exists but no mortar/cement endpoint)
- Mechanical parts (`gear`, `spring`, `pipe`, `wire`, generic `component` tier)

## Priority Backlog (Suggested)

### Phase 1: Consistency and Core Commodity Completeness
- Add mapping entries (or conversion rules) for missing flora `material.*` / `ingredient.*` outputs.
- Add staple commodity keys:
  - `rope`, `twine`, `nails`, `mortar`
  - crop-specific propagules only (for example `<crop>_seed`, `<plant>_bulb`, `<plant>_start`, `<fungus>_spore`)
  - `compost`, `fertilizer`, `animal_feed`
- Add minimal water ingredient commodity:
  - `water_raw`, `water_clean` (or equivalent naming convention)

### Phase 2: Progression Depth
- Expand ore refining coverage to ingots for all ore families already in minerals DB.
- Add alloy tier(s): `bronze_ingot`, `steel_ingot` (plus fantasy alloy equivalents as needed).
- Add fauna output payload schema data:
  - Passive: milk/eggs/wool/honey/wax variants by species
  - Slaughter: meat/hide/bone/fat/horn/sinew variants by species

### Phase 3: Builder-Oriented Optional Depth
- Add light industrial components where desired:
  - `iron_nails`, `brackets`, `wire_bundle`, `gear_set`
- Add storage/container commodity family:
  - `crate`, `storage_chest`, `grain_sack`, `barrel`

## Reference Baseline Sources
- RimWorld resource taxonomy: [RimWorld Wiki - Resources](https://rimworldwiki.com/wiki/Resources)
- ARK resource taxonomy: [ARK Wiki - Resource](https://ark.wiki.gg/wiki/Resource)
- Valheim material taxonomy: [Valheim Wiki - Materials](https://valheim.fandom.com/wiki/Materials)
- Terraria crafting-material taxonomy: [Terraria Wiki - Materials](https://terraria.wiki.gg/wiki/Materials)
- Don't Starve resource/material categories: [Don't Starve Wiki - Categories](https://dontstarve.fandom.com/wiki/Special:Categories)
- Satisfactory component progression examples: [Satisfactory Wiki - Craft Bench](https://satisfactory.wiki.gg/wiki/Craft_Bench)

