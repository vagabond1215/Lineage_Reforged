# T3 Non-Handheld Tool-Class Review: Kits, Cargo, Deployables, Records and Unknowns

Date: 2026-10-28
Status: connector-only exact-key catalog audit and provisional capability routing, NOT approved item manifests, content/schema changes, weapon actions, deployable combat, containers or inventory.
Verified source master `a596112acf3945f2bf7c625e943f2511d12aa710`; native v3 fit branch PR #42 head `4b68c864f8f8a58dffef6dededcdc75de429a43d`; [T0 all-131 census](tool-class-census-and-recipe-station-crosswalk-2026-10-28.md), [T1 70 handheld](tool-portable-t1-capability-classification-2026-10-28.md), [T2 21 apparatus](tool-apparatus-t2-fixture-and-station-access-review-2026-10-28.md), [H1 apparel/holster census](apparel-holster-carrier-coverage-census-2026-10-28.md).

## Scope and verified catalog facts

Exactly **40** remaining non-`grip-candidate`, non-`apparatus-review` tool-class identities are reconciled by canonical `itemKey`. They retain their original five T0 review lanes, with exact source counts: `kit-or-bulk-review` **14**, `carrier-or-draft-review` **8**, `deployable-review` **7**, `record-or-utility-review` **9**, `unresolved` **2**. All 40 are unique canonical item records and are currently `itemClass: "tool"`. These 40 have **no source-authored `useProfiles`** and **none are in the inspected 28 planned recipes' `requiredToolItemKeys`**. Four have unselected v3 fit rows: `agriculture_kit`, `bedroll_kit`, `ledger` are carried-only, while `compass` fits `slot.accessory.waist`. The remaining **36** have no authored native fit row. Fit absence does not prove an item cannot be carried, installed or eventually used.

**Do not treat T0 lanes as legal physical forms.** `tool` is a canonical catalog class. These labels are a manual review sort based on exact names/branches and source evidence, not a rewrite to `weapon`, `consumable`, `vehicle` or `accessory`. Each case requires an owner-supported migration or extra capabilities rather than free behavior inferred from a name.

## Full T3 exact-key ledger (40 records)

| Canonical key | T0 review lane | Catalog branch/subbranch | Proposed sub-review queue, not capability | Unselected native v3 fit |
| --- | --- | --- | --- | --- |
| `agriculture_kit` | `kit-or-bulk-review` | `agriculture/field` | kit manifest unknown | carried-only |
| `basket` | `carrier-or-draft-review` | `utility/hand_tool` | vessel / portable cargo | not authored |
| `bedroll_kit` | `kit-or-bulk-review` | `survival/camp` | kit manifest unknown | carried-only |
| `bucket` | `carrier-or-draft-review` | `agriculture/hand_tool` | vessel / portable cargo | not authored |
| `caltrops` | `deployable-review` | `combat/trap` | placed hazard | not authored |
| `casting_net` | `deployable-review` | `combat/net` | projected / potentially recoverable gear | not authored |
| `compass` | `record-or-utility-review` | `utility/hand_tool` | navigation / reference | `slot.accessory.waist` |
| `fishing_gear` | `kit-or-bulk-review` | `utility/hand_tool` | kit manifest unknown | not authored |
| `forged_tools` | `kit-or-bulk-review` | `tool/bundle` | bulk trade goods vs kit | not authored |
| `grapnel_line` | `deployable-review` | `combat/mobility` | projected / potentially recoverable gear | not authored |
| `handcart` | `carrier-or-draft-review` | `agriculture/hand_tool` | draft / transport harness | not authored |
| `hunting_net` | `deployable-review` | `combat/net` | projected / potentially recoverable gear | not authored |
| `hunting_weapons` | `kit-or-bulk-review` | `utility/hand_tool` | kit manifest unknown | not authored |
| `lamp` | `record-or-utility-review` | `utility/hand_tool` | lighting apparatus | not authored |
| `lantern` | `record-or-utility-review` | `utility/hand_tool` | lighting apparatus | not authored |
| `ledger` | `record-or-utility-review` | `admin/hand_tool` | written record | carried-only |
| `oil_flask` | `deployable-review` | `combat/oil_flask` | thrown / expended payload | not authored |
| `pack_harness` | `carrier-or-draft-review` | `agriculture/hand_tool` | draft / transport harness | not authored |
| `plow` | `carrier-or-draft-review` | `agriculture/field` | draft / agricultural implement | not authored |
| `production_toolset` | `kit-or-bulk-review` | `production/workshop` | kit manifest unknown | not authored |
| `record_book` | `record-or-utility-review` | `admin/record` | written record | not authored |
| `record_scroll` | `record-or-utility-review` | `admin/scroll` | written record | not authored |
| `reference_book` | `record-or-utility-review` | `admin/reference` | written record | not authored |
| `rope_hook_kit` | `kit-or-bulk-review` | `survival/climbing` | kit manifest unknown | not authored |
| `route_charts` | `record-or-utility-review` | `admin/hand_tool` | navigation / reference | not authored |
| `seed_satchel` | `carrier-or-draft-review` | `agriculture/field` | vessel / portable cargo | not authored |
| `shuttle` | `unresolved` | `utility/hand_tool` | unresolved exact identity | not authored |
| `sled_harness` | `carrier-or-draft-review` | `agriculture/hand_tool` | draft / transport harness | not authored |
| `smoke_bomb` | `deployable-review` | `combat/smoke_bomb` | thrown / expended payload | not authored |
| `snare_trap` | `deployable-review` | `combat/trap` | placed hazard | not authored |
| `steel_tools` | `kit-or-bulk-review` | `tool/bundle` | bulk trade goods vs kit | not authored |
| `steel_weapons` | `kit-or-bulk-review` | `tool/bundle` | bulk trade goods vs kit | not authored |
| `surveyor_kit` | `kit-or-bulk-review` | `production/survey` | kit manifest unknown | not authored |
| `survival_kit` | `kit-or-bulk-review` | `survival/field` | kit manifest unknown | not authored |
| `testing_thief` | `unresolved` | `utility/hand_tool` | unresolved exact identity | not authored |
| `tools` | `kit-or-bulk-review` | `tool/bundle` | bulk trade goods vs kit | not authored |
| `tracking_lens` | `record-or-utility-review` | `admin/apparatus` | navigation / reference | not authored |
| `trap_set` | `kit-or-bulk-review` | `utility/hand_tool` | kit manifest unknown | not authored |
| `winnowing_set` | `kit-or-bulk-review` | `utility/hand_tool` | kit manifest unknown | not authored |
| `yoke` | `carrier-or-draft-review` | `agriculture/hand_tool` | draft / agricultural implement | not authored |

Proposed sub-review buckets only: `kit manifest unknown` 10; `bulk trade goods vs kit` 4; `vessel / portable cargo` 3; `draft / transport harness` 3; `draft / agricultural implement` 2; `placed hazard` 2; `thrown / expended payload` 2; `projected / potentially recoverable gear` 3; `navigation / reference` 3; `written record` 4; `lighting apparatus` 2; `unresolved exact identity` 2. No numerical volume, capacity, damage, deployment count, kit contents, money, NPC stock or item dimensions have been authored.

## Critical owner distinctions and cross-domain evidence

### 1. True kit vs abstract bulk-trade bundle (14 exact keys)

A field kit may become an **owned container or assembly** whose specific contents can be inspected/removed/used/returned, or a deliberately **abstract single good** without inspectable sub-items. These are different semantics: a recipe/action cannot create constituent durable tools by pretending an `agriculture_kit`, `survival_kit` or `rope_hook_kit` has a canonical manifest. None of the 14 currently has a canonical component manifest or `useProfiles` in the inspected item record.

Especially `forged_tools`, `steel_tools`, `steel_weapons`, `tools`: names and catalog branch `tool/bundle` are not a guarantee of free individual weapons or tool IDs. GitHub source search corroborates `forged_tools` as an economy `serviceOutputs` good and as part of the civilization resource taxonomy `tools` family. **Preserve bulk economy goods** as one appropriate trade identity unless an accepted crafting/assembly authority intentionally transforms/opens them with explicit quantities, quality and receipts. No automatic conversion into a set of unique durable pieces.

### 2. Carrier versus transport/draft implement (8 exact keys)

`basket`, `bucket`, `seed_satchel` are **candidate container-like** forms; they are not by default on-character quick holsters or approved storage with authored capacities. `handcart`, `pack_harness`, `sled_harness` are **candidate transport/tack**; `plow` and `yoke` are **candidate draft/work equipment**. The underlying item class `tool` does not authorize player-worn fit, stow capacity, a rideable vehicle, mount speed or instant use.

For a real carried basket/seed satchel, distinguish **container interior** from **body mount**; attaching a seed satchel to a belt requires an actual interface with reachability/closure and may give quick access only for eligible objects. For a handcart or harness, distinguish transport entity/animal ownership and vehicle capacity from a player's inventory bag. A plow is not a backpack accessory.

### 3. Deployed objects and effects (7 exact keys)

`caltrops`, `snare_trap`, `casting_net`, `hunting_net`, `grapnel_line`, `oil_flask`, `smoke_bomb` are seven **deployable-review candidates**. The catalog currently has no corresponding `useProfiles` for them. No source evidence allows a specific attack, area hazard, chance of retrieval, damage, detonation, duration or inventory consumption.

Recommend classifying them by future result semantics, not merely by name: **placed persistent object** (state persists at a legitimate world position); **projected/retrievable implement** (continues as one physical instance or explicitly damaged/consumed); or **expended payload** (explicit authoritative consumption and event/result receipt). This must be coordinated with a real Area/Atlas/encounter object owner and with legal draw/retrieval from a carried mount. Do not duplicate an attached knife/net while it is thrown/placed.

### 4. Records, navigation, lighting (9 exact keys)

`ledger`, `record_book`, `record_scroll`, `reference_book`, `route_charts` are candidates for **read/inspect/reference**, not combat tool slots by default. `compass` and `tracking_lens` can be evaluated as **instruments**; `lamp` and `lantern` as **lighting apparatus** with future hands/fuel/light rules. A compass's existing **accessory waist fit** does not imply a built-in quick sheath or current hands-free navigation effect.

Written records require an explicit read/ownership/custody/data provenance decision. Do not automatically place a large book in a cloak pocket or give it a combat stat, nor infer a live lore log from the presence of a physical record item.

### 5. Unresolved identities (2 exact keys)

`shuttle` and `weaving_shuttle` are distinct currently canonical item identities; planned recipes reference **`weaving_shuttle`**, not `shuttle`. It is not safe to silently merge them or invent an alias based only on their similar names. `shuttle` remains unresolved pending item-origin/content-owner review.

`testing_thief` is a canonical tool item with an unusual name. The inspected source search finds it in an earlier reference-graph audit as a **market-domain** occurrence; there is no supported statement that it is a test-only item, a thief NPC, a usable theft tool or removable junk. Keep it unchanged until provenance, intended gameplay role, market references and source consumers are found.

## Future action/physical ownership questions and test gates

| Gate | Key cases | Required proof before real gameplay |
| --- | --- | --- |
| T3-01 | `agriculture_kit`, `bedroll_kit` | Per-kit contents *or* explicit abstract form; no invented free hand tools |
| T3-02 | `forged_tools`, `steel_weapons`, `tools` | Economy trade identities conserved until authorized output conversion |
| T3-03 | `basket`, `seed_satchel`, `bucket` | Real finite container capacity, access, item identity and optional wearer mount |
| T3-04 | `handcart`, `pack_harness`, `sled_harness`, `yoke`, `plow` | Vehicle/animal/draft location and cargo rights, not humanoid item slot |
| T3-05 | `caltrops`, `snare_trap` | Only one world placement per real item, denial and Save/restart permanence |
| T3-06 | `smoke_bomb`, `oil_flask` | No effects or losses without a verified attack/action/consume receipt |
| T3-07 | `casting_net`, `hunting_net`, `grapnel_line` | Throw/deploy/recover with legitimate hands, line/range and single item location |
| T3-08 | `lamp`, `lantern` | Fuel/light/hand occupancy/attachment; no implicit perpetual glow |
| T3-09 | `ledger`, `route_charts`, `tracking_lens`, `compass` | Read/instrument action and custody, not auto-equipped combat stat |
| T3-10 | `shuttle` / `weaving_shuttle` | Exact key and recipe/alias/content-owner resolution, never silent identity rewrite |
| T3-11 | `testing_thief` | Intended meaning and source/reference graph verified before any rename or removal |
| T3-12 | Any nested kit or strapped item | Loaded carrier transfer/removal/return, no duplicated physical instances |
| T3-13 | Mixed physical equipment and abstract trade bundles | Durable gear conversion and quantities cannot disappear in economy/UI |
| T3-14 | All 40 canonical keys after selected native v3 | No schema/content activation until exact owner and Save/restart, including stale retries |

## Explicit disposition

This closes **connector-static identity/review routing for the remaining 40 non-handheld/non-apparatus keys**, not their operational mechanics. Together with [T1](tool-portable-t1-capability-classification-2026-10-28.md) (70) and [T2](tool-apparatus-t2-fixture-and-station-access-review-2026-10-28.md) (21), all **131 current canonical tool items** have a source-verified review route. The actual workplace stock/fixtures contract remains unverified because the full 2.17 MB workplace file could not be reliably fetched through this connector.

Only this new Markdown file was added in this pass. No item catalog/schema, gameplay, skill/weapon stats, inventory, gear/Save, tests, current Codex prompt, handoff/output or branch disposition register were edited. **HOLD_NAMED_CONSUMER** in draft PR #40, pending owner-reviewed data schema, native selected v3 and separate contextual action/Area/Atlas/station owners.
