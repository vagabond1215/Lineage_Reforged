# T1 Portable Tool Capability Classification, Quick-Access Candidates, and Combat Review

Date: 2026-10-28
Status: CONNECTOR-SAFE T1 EVIDENCE AND CANDIDATE CLASSIFICATION; NOT ACCEPTED STATIC CAPABILITIES, BALANCE, EQUIPMENT FIT, CONTENT OR RUNTIME
Source: `master` `a596112acf3945f2bf7c625e943f2511d12aa710`
Reference: unselected native v3 PR #39 head `ed351578f57a6f44a257c79715b55b46c3c9617b`
Parent evidence: [131-tool T0 census](tool-class-census-and-recipe-station-crosswalk-2026-10-28.md)
Related physical design: [tool holding and station equipment plan](../design/tool-held-use-and-station-supplied-equipment-expansion-plan-2026-10-28.md); [carrier, readiness and shield design](../design/quick-access-tool-carriers-back-mounts-and-shield-readiness-decision-2026-10-28.md)

## 1. Scope and accepted facts

This is a classification of **all 70** records previously assigned the provisional `grip-candidate` review lane by T0. It does not assert they can actually be used, that their material/hand posture has been validated, or that a combat useProfile can be invented. Each existing item remains under its existing canonical `itemKey`.

- All 70 are present as `itemClass: "tool"` records in the inspected master catalog.
- Exactly **2 of the 70** have source-authored combat/utility `useProfiles`: `pickaxe` and `lumber_axe`.
- The remaining **68** of the 70 do **not** currently have source-authored use profiles, even if their names imply a practical use.
- Exactly **12 of 14** canonical recipe-required tool keys belong to these 70 grip candidates. `hoop_anvil` and `smoking_rack` remain separate T2 apparatus/fixture review, not made handheld to satisfy recipes.
- Current proposed native v3 gear fits are physical `worn`, `bag`, `overflow`, and one authored slot list per item. They do **not** represent a quick-access tool mount, separate draw/hold state, or a belt/backpack granting extra tool attachment capacity.
- The catalog includes `utility_belt`, `backpack`, `pack_frame`, and `coin_belt`, but none has item-owned **authored mount/quick-access capacity** in the inspected item records. The T1 tool table cannot grant one.

The three proposed holder-size buckets are **provisional ergonomics/packaging review categories**, not precise geometry or authority: compact/pocket candidate (could fit a suitable loop/sleeve); medium or specialized holder review; long/external mount review. A tool's eventual attachment eligibility requires authored size, mass/bulk, shape, hazard, retention/fasteners, worn-layer compatibility, and an actual holder capability. A long tool is not automatically mountable to a normal backpack.

**Recommendation:** item tool class does not create a `Tool` equipment slot. An actual worn *carrier item* with an authored mount can grant one or more attached tool positions. A carried tool can be used from an ordinary backpack with a small retrieval cost, while an eligible mounted tool has no **additional backpack retrieval** cost. All actions, movement, interruptions, draw/stow, and combat timing remain owner-gated.

## 2. Exact T1 ledger: all 70 current grip candidates

Legend: `not authored` under native fit is a gap in unselected v3 fit, not a prohibition of physical existence. `combat suitability review` is only a proposed future authoring review, not an action or accepted damage profile. `defer behavior` means retain identity while owner and use cases remain unproven.

| Canonical tool item | Current catalog branch/subbranch | Provisional carry/holder size review | Recipe references | Native fit source | Combat evidence/disposition | Next review |
| --- | --- | --- | ---: | --- | --- | --- |
| `adze` | production/hand_tool | medium or specialized holder review | 0 | not authored | combat suitability review | defer behavior |
| `awl` | utility/hand_tool | compact / pocket or loop review | 1 | carried-only | no combat proposal | T1 priority |
| `blacksmith_hammer` | production/hand_tool | medium or specialized holder review | 7 | not authored | combat suitability review | T1 priority |
| `bottle_funnel` | production/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `bread_peel` | utility/hand_tool | long / external mount review | 1 | not authored | no combat proposal | T1 priority |
| `butcher_knife` | production/hand_tool | compact / pocket or loop review | 0 | weapon.right | combat suitability review | T1 priority |
| `chisel` | production/hand_tool | compact / pocket or loop review | 0 | not authored | combat suitability review | T1 priority |
| `cooper_adze` | production/hand_tool | compact / pocket or loop review | 2 | not authored | combat suitability review | T1 priority |
| `crook` | agriculture/hand_tool | long / external mount review | 0 | not authored | combat suitability review | defer behavior |
| `crucible_tongs` | production/hand_tool | medium or specialized holder review | 2 | not authored | no combat proposal | T1 priority |
| `dye_stirrer` | production/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `fillet_knife` | utility/hand_tool | compact / pocket or loop review | 0 | not authored | combat suitability review | defer behavior |
| `fire_striker` | utility/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `fletching_knife` | production/hand_tool | compact / pocket or loop review | 0 | not authored | combat suitability review | defer behavior |
| `foraging_knife` | agriculture/hand_tool | compact / pocket or loop review | 0 | not authored | combat suitability review | defer behavior |
| `furnace_poker` | production/apparatus | long / external mount review | 0 | not authored | no combat proposal | defer behavior |
| `gate_hook` | production/hand_tool | long / external mount review | 0 | not authored | combat suitability review | defer behavior |
| `glassblowing_pipe` | utility/hand_tool | long / external mount review | 0 | not authored | no combat proposal | defer behavior |
| `grafting_knife` | agriculture/hand_tool | compact / pocket or loop review | 0 | not authored | combat suitability review | defer behavior |
| `hammer` | production/hand_tool | medium or specialized holder review | 0 | not authored | combat suitability review | T1 priority |
| `herb_knife` | utility/hand_tool | compact / pocket or loop review | 0 | not authored | combat suitability review | defer behavior |
| `hive_tool` | utility/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `hoe` | agriculture/hand_tool | long / external mount review | 0 | not authored | combat suitability review | T1 priority |
| `hook` | utility/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `kiln_paddle` | production/apparatus | long / external mount review | 0 | not authored | no combat proposal | defer behavior |
| `lumber_axe` | production/hand_tool | long / external mount review | 0 | weapon.right | authored combat profile | T1 priority |
| `malting_rake` | agriculture/hand_tool | long / external mount review | 0 | not authored | no combat proposal | defer behavior |
| `mason_chisel` | production/hand_tool | compact / pocket or loop review | 0 | not authored | combat suitability review | defer behavior |
| `mason_hammer` | production/hand_tool | medium or specialized holder review | 0 | not authored | combat suitability review | defer behavior |
| `maul` | utility/hand_tool | medium or specialized holder review | 0 | not authored | combat suitability review | T1 priority |
| `measuring_rod` | utility/hand_tool | long / external mount review | 0 | not authored | no combat proposal | defer behavior |
| `mill_rake` | agriculture/hand_tool | long / external mount review | 1 | not authored | no combat proposal | T1 priority |
| `mixing_spoon` | utility/hand_tool | compact / pocket or loop review | 1 | not authored | no combat proposal | T1 priority |
| `net_needle` | utility/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `oven_peel` | utility/hand_tool | long / external mount review | 0 | not authored | no combat proposal | defer behavior |
| `peat_spade` | agriculture/hand_tool | long / external mount review | 0 | not authored | combat suitability review | defer behavior |
| `pickaxe` | production/hand_tool | long / external mount review | 0 | weapon.right | authored combat profile | T1 priority |
| `pitch_ladle` | utility/hand_tool | medium or specialized holder review | 0 | not authored | no combat proposal | defer behavior |
| `pitchfork` | agriculture/hand_tool | long / external mount review | 0 | not authored | combat suitability review | T1 priority |
| `plumb_line` | admin/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `pruning_knife` | agriculture/field | compact / pocket or loop review | 0 | not authored | combat suitability review | defer behavior |
| `pruning_saw` | agriculture/hand_tool | medium or specialized holder review | 0 | not authored | combat suitability review | T1 priority |
| `pruning_shears` | agriculture/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `quarry_hammer` | production/hand_tool | medium or specialized holder review | 0 | not authored | combat suitability review | defer behavior |
| `rake` | agriculture/hand_tool | long / external mount review | 0 | not authored | no combat proposal | defer behavior |
| `repair_hammer` | production/workshop | medium or specialized holder review | 0 | not authored | no combat proposal | defer behavior |
| `retting_rake` | agriculture/hand_tool | long / external mount review | 0 | not authored | no combat proposal | defer behavior |
| `saw` | production/hand_tool | medium or specialized holder review | 1 | not authored | combat suitability review | T1 priority |
| `scraper` | production/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `scythe` | agriculture/hand_tool | long / external mount review | 0 | not authored | combat suitability review | T1 priority |
| `shears` | agriculture/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `shovel` | agriculture/hand_tool | long / external mount review | 0 | not authored | combat suitability review | T1 priority |
| `sickle` | agriculture/hand_tool | compact / pocket or loop review | 0 | not authored | combat suitability review | T1 priority |
| `skimmer_ladle` | utility/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `skinning_knife` | utility/hand_tool | compact / pocket or loop review | 0 | weapon.right | combat suitability review | T1 priority |
| `sledge_hammer` | production/hand_tool | long / external mount review | 0 | not authored | combat suitability review | T1 priority |
| `spade` | agriculture/hand_tool | long / external mount review | 0 | not authored | combat suitability review | T1 priority |
| `spindle` | utility/hand_tool | compact / pocket or loop review | 2 | not authored | no combat proposal | T1 priority |
| `surgical_needle` | utility/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `survey_staff` | admin/hand_tool | long / external mount review | 0 | not authored | no combat proposal | T1 priority |
| `tailor_needle` | production/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `tanning_scraper` | production/hand_tool | compact / pocket or loop review | 2 | not authored | no combat proposal | T1 priority |
| `thresher_flail` | utility/hand_tool | long / external mount review | 0 | not authored | combat suitability review | defer behavior |
| `valve_key` | production/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `wax_stamp` | utility/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `weaving_shuttle` | utility/hand_tool | compact / pocket or loop review | 2 | not authored | no combat proposal | T1 priority |
| `wedge_set` | utility/hand_tool | medium or specialized holder review | 0 | not authored | no combat proposal | defer behavior |
| `wick_knife` | production/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |
| `wood_plane` | production/hand_tool | compact / pocket or loop review | 2 | not authored | no combat proposal | T1 priority |
| `wrench` | utility/hand_tool | compact / pocket or loop review | 0 | not authored | no combat proposal | defer behavior |

## 3. Recipe tool eligibility, exact-key subset

The following 14 item keys are currently **non-consuming descriptive recipe requirements**. Only the first 12 below with a T1 classification are candidates to satisfy a requirement as a person-carried handheld tool; neither carried accessibility nor station supply is yet proven by this data.

| Canonical recipe `itemKey` | Planned recipe mentions | T1/T2 classification | Missing proof |
| --- | ---: | --- | --- |
| `awl` | 1 | T1 portable review | Hand use and holder dimensions not authored |
| `blacksmith_hammer` | 7 | T1 portable review | Hand use and holder dimensions not authored |
| `bread_peel` | 1 | T1 portable review | Hand use and holder dimensions not authored |
| `cooper_adze` | 2 | T1 portable review | Hand use and holder dimensions not authored |
| `crucible_tongs` | 2 | T1 portable review | Hand use and holder dimensions not authored |
| `hoop_anvil` | 1 | T2 equipment / fixture review | Portable form and installation require separate source evidence |
| `mill_rake` | 1 | T1 portable review | Hand use and holder dimensions not authored |
| `mixing_spoon` | 1 | T1 portable review | Hand use and holder dimensions not authored |
| `saw` | 1 | T1 portable review | Hand use and holder dimensions not authored |
| `smoking_rack` | 1 | T2 equipment / fixture review | Portable form and installation require separate source evidence |
| `spindle` | 2 | T1 portable review | Hand use and holder dimensions not authored |
| `tanning_scraper` | 2 | T1 portable review | Hand use and holder dimensions not authored |
| `weaving_shuttle` | 2 | T1 portable review | Hand use and holder dimensions not authored |
| `wood_plane` | 2 | T1 portable review | Hand use and holder dimensions not authored |

Full exact recipe ids and workplace ids are listed in T0; this audit deliberately does not copy or change `requiredToolItemKeys`, `requiredWorkplaceIds`, or any `civilization.workplaces` record.

## 4. Prioritized behavior/holder batches

**T1-A: source-backed hybrid controls (two records)**

- `pickaxe`: `utility.mining` uses the mining skill and extraction hook; `combat.melee.improvised` has an authored skill, timing, stamina and hooks. Its native gear fit currently admits `slot.equipment.weapon.right`. A future owner may allow it as an intentionally selected *Primary Weapon*, or as a temporarily held tool without changing selected weapon assignment. No extra free combat strike or utility Gather action is implied.
- `lumber_axe`: `utility.woodcutting` and `combat.melee.primary` are separately authored. Its native gear fit currently admits right weapon position. Do not strip its legitimate weapon use because it is classed tool. Do not infer a two-hand requirement from its name alone.
- For both: assign exact physical instance, one container/location, hand occupancy, retrieval/carry route, condition, and an explicit action profile; no split between "tool copy" and "weapon copy."

**T1-B: short grip candidates and the first quick-access mount**

- `awl`, `skinning_knife`, `butcher_knife`, `sickle`, `foraging_knife`, `tailor_needle`, `tanning_scraper`: investigate clip/holster/loop retention, one-hand manipulation if supported, sharp-edge safety, and whether a worn belt or suitable backpack exterior can hold the exact item.
- `awl` is specifically required by a tannery recipe and has a carried-only v3 fit. `skinning_knife` and `butcher_knife` are weapon-position eligible in the legacy-native parity fit but have **no** source-authored combat useProfiles. Their eligibility is not combat authority.
- Not every needle/small implement deserves the same instant-access mounting slot as a knife: tool use, holster size and protection are separate constraints.

**T1-C: common portable field and workshop tools**

- `shovel`, `spade`, `hoe`, `saw`, `hammer`, `blacksmith_hammer`, `chisel`, `pruning_saw`, `maul`, `sledge_hammer`, `pitchfork`, `survey_staff`: determine if the action should use a held personal instance, an authorized available station instance, or (for large objects) a physically installed position. Do not assign one universal weight, hand count, quick-access point, or improvised weapon profile.
- `blacksmith_hammer`, `saw`, `cooper_adze`, `mill_rake`, `spindle`, `weaving_shuttle`, `wood_plane`, `crucible_tongs`, `bread_peel`, and `mixing_spoon` all have direct recipe references. Their names do not prove station provision, so station permission/equipment resolution remains an independent T2 gate.
- Long tools require an actual mount/strap/harness with clearance and retrieval posture. A backpack by itself does not grant arbitrary long-weapon/tool capacity.

**T1-D: combat-capable subset and stat authoring gate**

- Preserve the two known source-backed combat profiles (`pickaxe`, `lumber_axe`).
- Consider a bounded **improvised-weapon review** for physically appropriate robust implements such as `hammer`, `blacksmith_hammer`, `maul`, `sledge_hammer`, `shovel`, `spade`, `pitchfork`, `sickle`, `skinning_knife`, `butcher_knife`, `saw`, and `chisel` (candidate list, not accepted combat affordances).
- Any approved combat tool must have item-specific handling/size, reach, skill/proficiency, damage family, accuracy/speed, stamina/time, durability risk, and conflicts with shield/second hand. It may be selected into Primary Weapon if a combat use profile and physical fit explicitly allow it. It does not become a duplicate `itemClass: weapon` record.
- Sharpness or physical danger is not sufficient to grant combat action. Fragile, hazardous, delicate, bulky, or fixed equipment may have **no selectable weapon use**, or only context-specific improvised actions, at author discretion.
- Do not assume a universal inferior damage multiplier. Relative combat stats require an audited weapon benchmark with trade-offs (reach, speed, accuracy, grip, durability, condition, stamina), no premature numbers from category labels.

## 5. Proposed static-capability authoring fields, not an active schema

One item-owned entry per *canonical existing item*, respecting current `useProfiles` and future weapon/armor profile ownership:

| Candidate descriptor | Example purpose | Required guardrail |
| --- | --- | --- |
| `physicalForm` | portable short, long, fixed/apparatus, kit | No claim of equipped location or manifest |
| `useCapabilityRefs` | existing utility mining/woodcutting; later approved work actions | Reference existing resolution hooks rather than duplicate combat or crafting owner |
| `handlingEnvelope` | owner-authored 1/2-hand, possible stow clearance and retention needs | No guessed defaults from item name |
| `carrySizeProfile` | compact/medium/long plus measured bulk/weight and hazard | No zero-cost mount inferred |
| `permittedMountProfileRefs` | scabbard, holster, axe loop, tool loop, backpack exterior mount | Requires actual owned fitted carrier |
| `combatProfileRef` | selected weapon/tool combat descriptor, if accepted | No automatic all-tools combat; keep current useProfiles source of truth until reconciled |
| `conditionUseProfile` | material-specific working wear or fragility, if later accepted | No current durability mutation or invented break rates |

Do not add any of these fields to JSON now. In particular, a worn belt or pack is a **carrier capacity provider**, not a free global slot, and an item-size candidate is not mount eligibility.

## 6. Contract tests to require before actual gameplay

- Assigned sheathed sword and bag pickaxe: tool can be retrieved and used without losing weapon assignment, with lawful retrieval cost.
- Same gear with an owned suitable belt loop: exact pickaxe/short tool must fit the actual mount; if legal, the **backpack retrieval overhead** is waived, not the time of mining, drawing under fire or hand-clearing.
- Switching/attaching a different tool to an occupied quick mount validates capacity, belt/pack ownership, state/permission, item condition and displacement.
- Removing belt/pack with an occupied mount atomically stows or rejects; no dangling slot, duplicated instance, or inaccessible invisible gear.
- A pack without an external tool mount never grants instant-access to a large shovel merely because it has bag capacity.
- `pickaxe` chosen as Primary Weapon still uses the **same unique instance** for mining, combat and holster storage, with legal stance/hands.
- A noncombat tool cannot be equipped to the weapon slot just because it appears dangerous; no arbitrary combat activation from `itemClass: tool`.
- Equipped sword and strapped forearm guard use distinct physical attachment/hand availability rules, not fake left-hand occupancy.
- Two-handed activity with a drawn shield or incompatible forearm restraint denies or explicitly requires legal stow, rather than silently overriding.
- Every action holds ownership, permission, exact physical location, accepted revision, saved/replayed held/attached state, no duplicate receipts, and correct failure-time/condition semantics.
- Unit/contract, schema, content-lint, resource, combat, migration and Save/restart tests must run in authenticated checkout after owner-approved implementation, not in this connector pass.

## 7. Disposition and next owner handoff

T1 **classification/evidence** is complete for all 70 previously selected grip candidates; **behavior authoring** is not authorized. Group counts: 35 compact/pocket candidates; 12 medium/special holder candidates; 23 long/external candidates. There are 2 actual combat profiles among these 70 and 30 additional items flagged for combat suitability review; no new weapon stats were authored. 28 items have initial higher-priority review labeling, with no new live action.

Required next owner decisions: carrier attachment contract, hand/forearm constraints, profile-level selection and improvised combat balance, exact tool retrieval timing policy, and versioned native gear/Save integration. T2 station stock remains deferred pending a reliable full `civilization.workplaces` read and station-instance ownership authority.

Branch: draft PR #40, `connector/tool-held-station-access-expansion-plan-2026-10-28`, remains **HOLD_NAMED_CONSUMER**. No native v3 PR or active Codex handoff edit.
