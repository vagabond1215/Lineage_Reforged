# Connector T0 Tool-Class Census and T1/T2 Evidence Crosswalk

Date: 2026-10-28
Status: READ-ONLY SOURCE CENSUS AND DOCUMENTATION-ONLY CANDIDATE DISPOSITIONS; NO ITEM DATA, SCHEMA, STATION STOCK OR GAMEPLAY AUTHORIZATION
Run: Tool expansion plan T0, bounded T1 portable and T2 workplace preflight
Source master: `a596112acf3945f2bf7c625e943f2511d12aa710`
Native v3 source: PR #39, `ed351578f57a6f44a257c79715b55b46c3c9617b` (unselected)
Parent design plan: [Tool Use, Hand Occupancy and Station-Supplied Equipment](tool-held-use-and-station-supplied-equipment-expansion-plan-2026-10-28.md)

## 1. Audit conclusion

This is an **exact-key reconciliation** of catalog `itemClass: "tool"`, planned recipe requirements and the proposed native v3 gear fit table. It does **not** classify every tool as legally usable, draw-ready, equippable or present at a station.

- Canonical item identities: **1372**.
- Item-class tool records: **131**, all unique by itemKey in the inspected tool subset.
- Tool records carrying an authored `useProfiles` array: **2** (`pickaxe` and `lumber_axe`). The remaining **129** have no explicit useProfile, not proof that they are invalid or incapable of future actions.
- Proposed native v3 equipment-fit tool records: **9**, of which **5** have one or more author-selected equipment positions and **4** have empty, carried-only `slots` entries. **122** other tools lack authored fit rows on the unselected v3 branch. This must not become an automatic 122-slot expansion.
- Planned `crafting.recipes`: **28**, with **25** naming tool requirements, **26** tool requirement occurrences and **14** distinct required tool keys across **12** referenced workplace ids.
- Every one of the **26** referenced recipe tool keys resolves to an inspected canonical `itemClass: "tool"` record; no dangling or non-tool recipe tool references found in this exact comparison.
- **3** planned recipes have an empty required tool list. This does not mean their stations supply tools, nor that they are executable with bare hands.
- No `gold_pan` item key occurs in the inspected canonical item catalog; do not assign it a live capability or source it from an imagined resource node.

**Important owner discrepancy to resolve:** `smoking_rack` and `hoop_anvil` are explicit `requiredToolItemKeys` even though these records are **apparatus/fixture physical-form candidates** rather than ordinary in-hand tools. The existing recipe schema describes the portable-tool requirement and does not establish a station fixture instance or permission route. This is a targeted schema/owner review item, not a direction to mutate those recipes now.

## 2. Evidence and interpretation boundary

Authoritative catalog source: [item definitions](https://github.com/vagabond1215/Lineage_Reforged/blob/a596112acf3945f2bf7c625e943f2511d12aa710/packages/content/base/items/items.json). First-pass recipe source: [planned recipes](https://github.com/vagabond1215/Lineage_Reforged/blob/a596112acf3945f2bf7c625e943f2511d12aa710/packages/content/base/crafting/recipes.json). Unselected native source: [fit profiles](https://github.com/vagabond1215/Lineage_Reforged/blob/ed351578f57a6f44a257c79715b55b46c3c9617b/packages/content/base/items/equipment_fit_profiles.json). Control documents: [crafting authority](https://github.com/vagabond1215/Lineage_Reforged/blob/a596112acf3945f2bf7c625e943f2511d12aa710/docs/design/crafting-authority-boundary-decision.md), [recipe/production authority](https://github.com/vagabond1215/Lineage_Reforged/blob/a596112acf3945f2bf7c625e943f2511d12aa710/docs/design/recipe-and-production-schema-decision.md).

- Columns `itemKey`, class/branch, `useProfiles`, recipe counts and native v3 fit are **source facts**.
- Column `candidate review lane` is a **human review sort**, inferred from the existing item key/branch/subbranch and individually curated as a hypothesis, **not an accepted equipment classification or guaranteed physical capability**.
- `grip-candidate` does not specify left/right, handedness, action eligibility, time, tool tier or draw behavior.
- `apparatus-review` does not assert installation or station stock. `kit-or-bulk-review` never asserts a manifest. `record-or-utility-review` never asserts worn fit.
- `unresolved` is explicitly allowed; all entries, including apparently obvious ones, need owner acceptance for usable behavior.
- `none` under native fit means **not in that branch's fit table**, not forbidden from existing as a physical object or being held in the future.

## 3. Classification disposition totals (candidate only)

| Provisional review lane | Exact tool records |
| --- | ---: |
| `apparatus-review` | 21 |
| `carrier-or-draft-review` | 8 |
| `deployable-review` | 7 |
| `grip-candidate` | 70 |
| `kit-or-bulk-review` | 14 |
| `record-or-utility-review` | 9 |
| `unresolved` | 2 |
| **All tool-class items** | **131** |

These lanes are intentionally mutually exclusive review buckets, not a flat functional ontology. A future accepted static capability schema may express multiple independent roles for one item.

## 4. Full T0 ledger: all 131 canonical tool-class records

| Canonical `itemKey` | Current branch / subbranch | Candidate review lane | Native v3 fit | Current authored `useProfiles.actionType` | Planned recipe mentions |
| --- | --- | --- | --- | --- | ---: |
| `adze` | production / hand_tool | grip-candidate | none | none | 0 |
| `agriculture_kit` | agriculture / field | kit-or-bulk-review | carried-only | none | 0 |
| `alembic` | utility / hand_tool | apparatus-review | none | none | 0 |
| `anvil` | production / hand_tool | apparatus-review | none | none | 0 |
| `awl` | utility / hand_tool | grip-candidate | carried-only | none | 1 |
| `basket` | utility / hand_tool | carrier-or-draft-review | none | none | 0 |
| `bedroll_kit` | survival / camp | kit-or-bulk-review | carried-only | none | 0 |
| `blacksmith_hammer` | production / hand_tool | grip-candidate | none | none | 7 |
| `boiling_kettle` | utility / apparatus | apparatus-review | none | none | 0 |
| `bottle_funnel` | production / hand_tool | grip-candidate | none | none | 0 |
| `bread_peel` | utility / hand_tool | grip-candidate | none | none | 1 |
| `brewing_kettle` | production / apparatus | apparatus-review | none | none | 0 |
| `brick_mold` | utility / hand_tool | apparatus-review | none | none | 0 |
| `bucket` | agriculture / hand_tool | carrier-or-draft-review | none | none | 0 |
| `butcher_knife` | production / hand_tool | grip-candidate | weapon.right | none | 0 |
| `caltrops` | combat / trap | deployable-review | none | none | 0 |
| `candle_mold` | utility / hand_tool | apparatus-review | none | none | 0 |
| `casting_net` | combat / net | deployable-review | none | none | 0 |
| `cellar_rack` | utility / apparatus | apparatus-review | none | none | 0 |
| `chisel` | production / hand_tool | grip-candidate | none | none | 0 |
| `compass` | utility / hand_tool | record-or-utility-review | acc.waist | none | 0 |
| `cooper_adze` | production / hand_tool | grip-candidate | none | none | 2 |
| `crane_hook` | production / apparatus | apparatus-review | none | none | 0 |
| `crook` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `crucible_tongs` | production / hand_tool | grip-candidate | none | none | 2 |
| `curing_rack` | utility / apparatus | apparatus-review | none | none | 0 |
| `dye_stirrer` | production / hand_tool | grip-candidate | none | none | 0 |
| `fillet_knife` | utility / hand_tool | grip-candidate | none | none | 0 |
| `fire_striker` | utility / hand_tool | grip-candidate | none | none | 0 |
| `fishing_gear` | utility / hand_tool | kit-or-bulk-review | none | none | 0 |
| `fletching_knife` | production / hand_tool | grip-candidate | none | none | 0 |
| `foraging_knife` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `forged_tools` | tool / bundle | kit-or-bulk-review | none | none | 0 |
| `furnace_poker` | production / apparatus | grip-candidate | none | none | 0 |
| `gate_hook` | production / hand_tool | grip-candidate | none | none | 0 |
| `glassblowing_pipe` | utility / hand_tool | grip-candidate | none | none | 0 |
| `grafting_knife` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `grapnel_line` | combat / mobility | deployable-review | none | none | 0 |
| `grinding_stone` | utility / hand_tool | apparatus-review | none | none | 0 |
| `hammer` | production / hand_tool | grip-candidate | none | none | 0 |
| `handcart` | agriculture / hand_tool | carrier-or-draft-review | none | none | 0 |
| `herb_knife` | utility / hand_tool | grip-candidate | none | none | 0 |
| `hive_tool` | utility / hand_tool | grip-candidate | none | none | 0 |
| `hoe` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `hook` | utility / hand_tool | grip-candidate | none | none | 0 |
| `hoop_anvil` | production / hand_tool | apparatus-review | none | none | 1 |
| `hunting_net` | combat / net | deployable-review | none | none | 0 |
| `hunting_weapons` | utility / hand_tool | kit-or-bulk-review | none | none | 0 |
| `kiln_paddle` | production / apparatus | grip-candidate | none | none | 0 |
| `lamp` | utility / hand_tool | record-or-utility-review | none | none | 0 |
| `lantern` | utility / hand_tool | record-or-utility-review | none | none | 0 |
| `ledger` | admin / hand_tool | record-or-utility-review | carried-only | none | 0 |
| `lumber_axe` | production / hand_tool | grip-candidate | weapon.right | utility.woodcutting; combat.melee.primary | 0 |
| `malting_rake` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `mason_chisel` | production / hand_tool | grip-candidate | none | none | 0 |
| `mason_hammer` | production / hand_tool | grip-candidate | none | none | 0 |
| `maul` | utility / hand_tool | grip-candidate | none | none | 0 |
| `measuring_rod` | utility / hand_tool | grip-candidate | none | none | 0 |
| `mill_rake` | agriculture / hand_tool | grip-candidate | none | none | 1 |
| `mixing_spoon` | utility / hand_tool | grip-candidate | none | none | 1 |
| `mortar_pestle` | production / hand_tool | apparatus-review | none | none | 0 |
| `net_needle` | utility / hand_tool | grip-candidate | none | none | 0 |
| `oil_flask` | combat / oil_flask | deployable-review | none | none | 0 |
| `oven_peel` | utility / hand_tool | grip-candidate | none | none | 0 |
| `pack_harness` | agriculture / hand_tool | carrier-or-draft-review | none | none | 0 |
| `peat_spade` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `pickaxe` | production / hand_tool | grip-candidate | weapon.right | utility.mining; combat.melee.improvised | 0 |
| `pitch_ladle` | utility / hand_tool | grip-candidate | none | none | 0 |
| `pitchfork` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `plow` | agriculture / field | carrier-or-draft-review | none | none | 0 |
| `plumb_line` | admin / hand_tool | grip-candidate | none | none | 0 |
| `pottery_wheel` | production / apparatus | apparatus-review | none | none | 0 |
| `preserving_kettle` | utility / apparatus | apparatus-review | none | none | 0 |
| `press_screw_key` | production / apparatus | apparatus-review | none | none | 0 |
| `production_toolset` | production / workshop | kit-or-bulk-review | none | none | 0 |
| `pruning_knife` | agriculture / field | grip-candidate | none | none | 0 |
| `pruning_saw` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `pruning_shears` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `quarry_hammer` | production / hand_tool | grip-candidate | none | none | 0 |
| `rake` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `record_book` | admin / record | record-or-utility-review | none | none | 0 |
| `record_scroll` | admin / scroll | record-or-utility-review | none | none | 0 |
| `reference_book` | admin / reference | record-or-utility-review | none | none | 0 |
| `rendering_pot` | utility / hand_tool | apparatus-review | none | none | 0 |
| `repair_hammer` | production / workshop | grip-candidate | none | none | 0 |
| `retting_rake` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `roasting_drums` | production / apparatus | apparatus-review | none | none | 0 |
| `rope_hook_kit` | survival / climbing | kit-or-bulk-review | none | none | 0 |
| `route_charts` | admin / hand_tool | record-or-utility-review | none | none | 0 |
| `saw` | production / hand_tool | grip-candidate | none | none | 1 |
| `scraper` | production / hand_tool | grip-candidate | none | none | 0 |
| `scythe` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `seed_satchel` | agriculture / field | carrier-or-draft-review | none | none | 0 |
| `shears` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `shovel` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `shuttle` | utility / hand_tool | unresolved | none | none | 0 |
| `sickle` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `skimmer_ladle` | utility / hand_tool | grip-candidate | none | none | 0 |
| `skinning_knife` | utility / hand_tool | grip-candidate | weapon.right | none | 0 |
| `sled_harness` | agriculture / hand_tool | carrier-or-draft-review | none | none | 0 |
| `sledge_hammer` | production / hand_tool | grip-candidate | none | none | 0 |
| `smoke_bomb` | combat / smoke_bomb | deployable-review | none | none | 0 |
| `smoker` | utility / hand_tool | apparatus-review | none | none | 0 |
| `smoking_rack` | utility / apparatus | apparatus-review | none | none | 1 |
| `snare_trap` | combat / trap | deployable-review | none | none | 0 |
| `spade` | agriculture / hand_tool | grip-candidate | none | none | 0 |
| `spindle` | utility / hand_tool | grip-candidate | none | none | 2 |
| `steel_tools` | tool / bundle | kit-or-bulk-review | none | none | 0 |
| `steel_weapons` | tool / bundle | kit-or-bulk-review | none | none | 0 |
| `surgical_needle` | utility / hand_tool | grip-candidate | none | none | 0 |
| `survey_staff` | admin / hand_tool | grip-candidate | none | none | 0 |
| `surveyor_kit` | production / survey | kit-or-bulk-review | none | none | 0 |
| `survival_kit` | survival / field | kit-or-bulk-review | none | none | 0 |
| `tailor_needle` | production / hand_tool | grip-candidate | none | none | 0 |
| `tanning_scraper` | production / hand_tool | grip-candidate | none | none | 2 |
| `testing_thief` | utility / hand_tool | unresolved | none | none | 0 |
| `thresher_flail` | utility / hand_tool | grip-candidate | none | none | 0 |
| `tools` | tool / bundle | kit-or-bulk-review | none | none | 0 |
| `tracking_lens` | admin / apparatus | record-or-utility-review | none | none | 0 |
| `trap_set` | utility / hand_tool | kit-or-bulk-review | none | none | 0 |
| `valve_key` | production / hand_tool | grip-candidate | none | none | 0 |
| `wax_stamp` | utility / hand_tool | grip-candidate | none | none | 0 |
| `weaving_shuttle` | utility / hand_tool | grip-candidate | none | none | 2 |
| `wedge_set` | utility / hand_tool | grip-candidate | none | none | 0 |
| `well_winch` | agriculture / apparatus | apparatus-review | none | none | 0 |
| `wheel_jig` | production / apparatus | apparatus-review | none | none | 0 |
| `wick_knife` | production / hand_tool | grip-candidate | none | none | 0 |
| `winnowing_set` | utility / hand_tool | kit-or-bulk-review | none | none | 0 |
| `wood_plane` | production / hand_tool | grip-candidate | none | none | 2 |
| `wrench` | utility / hand_tool | grip-candidate | none | none | 0 |
| `yoke` | agriculture / hand_tool | carrier-or-draft-review | none | none | 0 |

**Ledger caveat:** the native fit branch is unselected and uses slot eligibility, not real hand occupancy. `pickaxe` and `lumber_axe` combat/utility profiles are source facts, not proof that mining, woodcutting or combat drawing is currently available through the expected player command. Recipe mentions count references, not ingredient consumption or station provisioning.

## 5. Exact player-facing planned recipe-to-workplace/tool map (T2)

This crosswalk includes every planned recipe, not just recipes that mention tools. Values are copied from `requiredWorkplaceIds` and `requiredToolItemKeys` in the recipe records.

| `recipe.` key | Declared required `workplace.` type | Declared required tool keys |
| --- | --- | --- |
| `barrel_stave_metal_ring_and_resin_pitch_to_cask` | `coopers_shop` | `cooper_adze`, `hoop_anvil` |
| `blade_blank_tool_handle_and_leather_strap_to_arming_sword` | `weaponsmith_forge` | `blacksmith_hammer` |
| `bread_dough_to_bread_loaf` | `bakehouse` | `bread_peel` |
| `butchered_meat_to_smoked_meat` | `smokehouse` | none |
| `copper_ore_and_tin_ore_to_bronze_ingot` | `smelter_hall` | `crucible_tongs` |
| `copper_ore_to_copper_ingot` | `smelter_hall` | `crucible_tongs` |
| `cured_leather_to_hardened_leather_panel` | `tannery` | `tanning_scraper` |
| `cured_leather_to_leather_panel` | `tannery` | `awl` |
| `cured_leather_to_leather_strap` | `tannery` | `tanning_scraper` |
| `fiber_to_cloth` | `loomhouse` | none |
| `fish_raw_and_salt_crystal_to_smoked_fish` | `smokehouse` | `smoking_rack` |
| `flax_bundle_to_linen_thread` | `loomhouse` | `spindle` |
| `flour_to_bread_dough` | `bakery` | `mixing_spoon` |
| `grain_bundle_to_flour` | `millhouse` | `mill_rake` |
| `hide_raw_to_cured_leather` | `tannery` | none |
| `iron_ingot_to_blade_blank` | `weaponsmith_forge` | `blacksmith_hammer` |
| `iron_ingot_to_metal_plate` | `armorers_forge` | `blacksmith_hammer` |
| `iron_ingot_to_metal_rod` | `weaponsmith_forge` | `blacksmith_hammer` |
| `iron_ore_to_iron_ingot` | `bloomery_forge` | `blacksmith_hammer` |
| `linen_thread_to_fine_cloth` | `loomhouse` | `weaving_shuttle` |
| `log_to_plank` | `sawmill` | `saw` |
| `metal_ring_and_leather_strap_to_mail_coif` | `armorers_forge` | `blacksmith_hammer` |
| `metal_rod_and_tool_handle_to_hammer` | `weaponsmith_forge` | `blacksmith_hammer` |
| `plank_to_barrel_stave` | `coopers_shop` | `cooper_adze` |
| `plank_to_tool_handle` | `sawmill` | `wood_plane` |
| `plank_to_wood_shaft` | `sawmill` | `wood_plane` |
| `wool_fleece_to_yarn` | `loomhouse` | `spindle` |
| `yarn_to_wool_cloth` | `loomhouse` | `weaving_shuttle` |

### Required tool-key index

| Item key | Recipe mentions | Recipe-declared workplace types | Candidate review lane |
| --- | ---: | --- | --- |
| `awl` | 1 | `tannery` | grip-candidate |
| `blacksmith_hammer` | 7 | `armorers_forge`, `bloomery_forge`, `weaponsmith_forge` | grip-candidate |
| `bread_peel` | 1 | `bakehouse` | grip-candidate |
| `cooper_adze` | 2 | `coopers_shop` | grip-candidate |
| `crucible_tongs` | 2 | `smelter_hall` | grip-candidate |
| `hoop_anvil` | 1 | `coopers_shop` | apparatus-review |
| `mill_rake` | 1 | `millhouse` | grip-candidate |
| `mixing_spoon` | 1 | `bakery` | grip-candidate |
| `saw` | 1 | `sawmill` | grip-candidate |
| `smoking_rack` | 1 | `smokehouse` | apparatus-review |
| `spindle` | 2 | `loomhouse` | grip-candidate |
| `tanning_scraper` | 2 | `tannery` | grip-candidate |
| `weaving_shuttle` | 2 | `loomhouse` | grip-candidate |
| `wood_plane` | 2 | `sawmill` | grip-candidate |

### Declared workplace-type summary

| Planned `requiredWorkplaceIds` | Recipe count | Union of required item keys | Station-owned tool reality |
| --- | ---: | --- | --- |
| `workplace.armorers_forge` | 2 | `blacksmith_hammer` | No station-owned stock or access verified |
| `workplace.bakehouse` | 1 | `bread_peel` | No station-owned stock or access verified |
| `workplace.bakery` | 1 | `mixing_spoon` | No station-owned stock or access verified |
| `workplace.bloomery_forge` | 1 | `blacksmith_hammer` | No station-owned stock or access verified |
| `workplace.coopers_shop` | 2 | `cooper_adze`, `hoop_anvil` | No station-owned stock or access verified |
| `workplace.loomhouse` | 5 | `spindle`, `weaving_shuttle` | No station-owned stock or access verified |
| `workplace.millhouse` | 1 | `mill_rake` | No station-owned stock or access verified |
| `workplace.sawmill` | 3 | `saw`, `wood_plane` | No station-owned stock or access verified |
| `workplace.smelter_hall` | 2 | `crucible_tongs` | No station-owned stock or access verified |
| `workplace.smokehouse` | 2 | `smoking_rack` | No station-owned stock or access verified |
| `workplace.tannery` | 4 | `awl`, `tanning_scraper` | No station-owned stock or access verified |
| `workplace.weaponsmith_forge` | 4 | `blacksmith_hammer` | No station-owned stock or access verified |

**Not confirmed:** `civilization.workplaces` currently defines facility/workforce descriptors; its `requiredToolTags` are not a portable tool catalog or actual offered tool stock. The connector could parse complete item and recipe files and the v3 fit file, but the large workplace-content file was not retrievable in full through this connection. Therefore this audit makes **no claim** that the 12 referenced workplace identities have been independently verified in the full workplace catalog in this pass, and **no claim** that any physical station supplies a given tool. Exact workplace-record, tag and job crosswalk is an explicit later checkout or bounded-source access task.

Existing recipe validation tests perform cross-reference checks locally; this connector pass did not run those tests. The references here are exact recipe declarations, not an inventory of live player-accessible sites.

## 6. Bounded T1/T2 candidate priorities and decision blockers

| Existing canonical item key | Proposed native fit, if any | Planned recipe mentions | Decision needed before executable tool data |
| --- | --- | ---: | --- |
| `pickaxe` | weapon.right | 0 | Utility mining + improvised combat are authored; held and hand count are not. |
| `lumber_axe` | weapon.right | 0 | Utility woodcutting + melee combat are authored; weapon assignment is not real hand occupancy. |
| `shovel` | none | 0 | Existing identity, no useProfile; excavation action and hand demand not established. |
| `spade` | none | 0 | Existing identity, no useProfile; distinguish from shovel by authored utility only. |
| `hammer` | none | 0 | Distinct from blacksmith_hammer; no automatic substitute across recipe item keys. |
| `blacksmith_hammer` | none | 7 | Explicit recipe tool, not automatically station stock; no current useProfile. |
| `awl` | carried-only | 1 | Recipe tool, carried-only native fit; held use must not require weapon slot. |
| `skinning_knife` | weapon.right | 0 | Weapon-eligible legacy fit, but no currently authored useProfile. |
| `butcher_knife` | weapon.right | 0 | Weapon-eligible legacy fit, but no currently authored useProfile. |
| `sickle` | none | 0 | Potential hand harvesting tool; no available canonical Gather action proven. |
| `saw` | none | 1 | Sawmill recipe tool; hand demand and station provision unknown. |
| `chisel` | none | 0 | Existing grip candidate; related recipes and action owner not established. |
| `smoking_rack` | none | 1 | Apparatus candidate currently required as a tool item; decision needed on fixture placement. |
| `hoop_anvil` | none | 1 | Anvil/fixture candidate currently required as a tool item; decide physical station role. |
| `anvil` | none | 0 | Existing tool-class record may be a fixture; absence from requiredToolItemKeys is not proof of free access. |
| `fishing_gear` | none | 0 | Bundle/carry kit candidate; contents and active fish action not proven. |
| `agriculture_kit` | carried-only | 0 | Carried-only native fit, not proof of invented kit components. |
| `handcart` | none | 0 | Transport/carry object with distinct physical-capacity/owner gate. |
| `forged_tools` | none | 0 | Potential abstract bulk good, not an automatically extractable inventory of individual tools. |

**Preferred first use cases for owner review:**

1. **Portable tool carried from backpack:** choose an existing `pickaxe` or `shovel` by item instance without moving a sheathed primary sword out of its assignment. The action owner, one/two-hand requirement, safe return, interruption and resource-source legitimacy are still gates.
2. **Recipe-required carried hand tool:** `awl` at `workplace.tannery` and `blacksmith_hammer` at forge workplace types are clean static cross-references. Their actual use still requires an admitted station, available item, permission and ownership-aware crafting transaction.
3. **Recipe-required apparatus:** `smoking_rack` and `hoop_anvil` should not be forced into weapon or hand slots to satisfy existing `requiredToolItemKeys`. Decide explicitly whether the recipe should reference item-owned equipment installed or stationed at an authorized facility, or whether a later separate station capability is needed. Do not alter current recipe keys without a deliberate authority decision.
4. **Portable/installed distinction:** `handcart`, `plow`, `well_winch`, `pottery_wheel`, `anvil`, `tools`, `forged_tools` and `steel_weapons` are candidate boundary items. Do not silently instantiate bulk categories as functional individual hand tools.

## 7. Negative evidence and no-canon guardrails

- A catalog `itemClass` of `tool` does not mean portable, hand-held, equippable, combat-usable, station-provided or currently useable.
- A `hand_tool` subbranch can include objects that need more nuanced form classification; it is not a handedness contract.
- A `requiredToolItemKeys` reference is a non-consuming static prerequisite, not a physical tool at the site.
- `requiredWorkplaceIds` identify a required workplace type, not a live reachable workshop instance, occupancy, storage, permission, payment or stock.
- `civilization.workplaces.requiredToolTags` concern workforce/economic production and are not automatically substitutable with recipe item keys.
- Neither tool candidate lanes nor recipe links create commands, inputs/outputs, inventory changes, extra hand slots, alternative equipment locations, stations, environmental deposits, ecology nodes or loot.
- A new gold pan, specialist metal quality, a fictional one/two-hand count, tool wear rate, station inventory or recipe substitution must not be introduced without a separately accepted exact authority and data seed.
- Do not change stacked PRs #20 through #39, selected Save/restart format, Ashen Reef survey witness, active Codex prompt, resource production, economy or gameplay.

## 8. Verification actually performed and follow-on

**Performed by connector:**
- Parsed full item catalog, all planned recipe records and the native fit table as JSON.
- Enforced unique canonical item keys and unique recipe ids in the in-memory audit, checked 131 tool records against the catalog, and compared every recipe tool requirement against `itemClass: "tool"`.
- Reconciled all recipe rows, distinct tool keys, station-type declarations and all 131 census entries using exact keyed joins.
- Reviewed accepted crafting / item / contextual decision authority and current draft PR #40.
- Created this documentation-only ledger on the isolated draft-PR branch. The branch is a **HOLD_NAMED_CONSUMER** until owner-reviewed data and native v3 integration are ready.

**Not performed:** authenticated checkout, full workplace content parse, repo lint/tests, build, implementation, mutation of item/recipe/fit/workplace data, native state/save testing, station inventory or runtime crafting demonstration.

**Next smallest connector-safe pass:** T1 owner-candidate decisions restricted to portable basics and the 14 recipe-required tool identities. T2 must first obtain the complete 58-workplace static catalog through a checkout or reliable bounded source for a true workplace tool-tag crosswalk; until then, it can only map the 12 recipe-declared workplace ids as done here. After accepted T1/T2 classification, request an owner/schema plan before Codex mutation. No further connector pass should infer actual station-supplied tools solely from descriptors.

Branch/PR lifecycle: add to [draft PR #40](https://github.com/vagabond1215/Lineage_Reforged/pull/40) without modifying active PRs. A coordination-owned checkpoint must register the branch disposition in `docs/dev/branch-disposition-register.md`; do not overwrite actively contested coordination paths from this independent census branch.
