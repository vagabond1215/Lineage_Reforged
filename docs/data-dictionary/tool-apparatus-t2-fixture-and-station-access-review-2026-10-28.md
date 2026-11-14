# T2 Apparatus and Workstation-Tool Boundary: 21 Source-Verified Candidates

Date: 2026-10-28
Status: connector source classification and owner-routing preflight only; neither station inventory nor installed fixtures or carry permissions are accepted.
Sources: master `a596112acf3945f2bf7c625e943f2511d12aa710`, unselected native candidate PR #42 `4b68c864f8f8a58dffef6dededcdc75de429a43d` (fit catalog unchanged in this path from earlier native v3), [T0 all-tools census](tool-class-census-and-recipe-station-crosswalk-2026-10-28.md), [T1 70 portable/grip candidates](tool-portable-t1-capability-classification-2026-10-28.md), [Tool and Station design](../design/tool-held-use-and-station-supplied-equipment-expansion-plan-2026-10-28.md).

## Verified source scope, and what it does not prove

All **21** keys listed below exist as unique canonical `itemClass: "tool"` records in `packages/content/base/items/items.json`. This is the entire T0 `apparatus-review` provisional bucket. No item has an authored `useProfiles` array or a row in the proposed native v3 `equipment_fit_profiles.json`. **Absence of fit is not proof of non-portability**. Several items use `itemSubBranch: "hand_tool"`, while others say `apparatus`; source naming alone cannot determine fixture size, installed location, mass, operation or whether the object needs to be held.

Only **two** are explicitly referenced by planned recipes as `requiredToolItemKeys`: `hoop_anvil` (the cask-making recipe, `workplace.coopers_shop`) and `smoking_rack` (the smoked-fish recipe, `workplace.smokehouse`). Planned recipes do not establish that these workplaces actually stock the apparatus. The other 19 are not required by the **28 inspected planned recipes**, not proof they have no future manufacturing roles. The exact `requiredWorkplaceIds` values describe required types, not physical station instances, ownership or a rental entitlement.

The reviewed `packages/content/base/civilization/workplaces.json` GitHub tree entry measures **2,173,521 bytes**. Full and bounded `fetch_file` reads through the connector returned empty. Therefore a **complete static workplace records crosswalk and any station inventory/permissions analysis is blocked** until a capable authenticated repository checkout can read it. No inferences of stock, actual workplace fixtures or public access have been made.

## Full T2 apparatus ledger (all 21)

Provisional physical-review lanes below are *not* accepted `itemClass`, placement, heft or storage fields.

| Exact canonical key | Catalog branch/subbranch | Candidate apparatus review lane | Recipe requirement mentions | Exact declared recipe and workplace (when referenced) |
| --- | --- | --- | ---: | --- |
| `alembic` | `utility/hand_tool` | heat / process vessel | 0 | none |
| `anvil` | `production/hand_tool` | anchored or powered apparatus | 0 | none |
| `boiling_kettle` | `utility/apparatus` | heat / process vessel | 0 | none |
| `brewing_kettle` | `production/apparatus` | heat / process vessel | 0 | none |
| `brick_mold` | `utility/hand_tool` | small / bench contact apparatus | 0 | none |
| `candle_mold` | `utility/hand_tool` | small / bench contact apparatus | 0 | none |
| `cellar_rack` | `utility/apparatus` | rack / resting surface | 0 | none |
| `crane_hook` | `production/apparatus` | anchored or powered apparatus | 0 | none |
| `curing_rack` | `utility/apparatus` | rack / resting surface | 0 | none |
| `grinding_stone` | `utility/hand_tool` | small / bench contact apparatus | 0 | none |
| `hoop_anvil` | `production/hand_tool` | small / bench contact apparatus | 1 | `barrel_stave_metal_ring_and_resin_pitch_to_cask` at `workplace.coopers_shop` |
| `mortar_pestle` | `production/hand_tool` | small / bench contact apparatus | 0 | none |
| `pottery_wheel` | `production/apparatus` | anchored or powered apparatus | 0 | none |
| `preserving_kettle` | `utility/apparatus` | heat / process vessel | 0 | none |
| `press_screw_key` | `production/apparatus` | small / bench contact apparatus | 0 | none |
| `rendering_pot` | `utility/hand_tool` | heat / process vessel | 0 | none |
| `roasting_drums` | `production/apparatus` | heat / process vessel | 0 | none |
| `smoker` | `utility/hand_tool` | heat / process vessel | 0 | none |
| `smoking_rack` | `utility/apparatus` | rack / resting surface | 1 | `fish_raw_and_salt_crystal_to_smoked_fish` at `workplace.smokehouse` |
| `well_winch` | `agriculture/apparatus` | anchored or powered apparatus | 0 | none |
| `wheel_jig` | `production/apparatus` | anchored or powered apparatus | 0 | none |

Review lane counts: `heat / process vessel` **7**; `rack / resting surface` **3**; `anchored or powered apparatus` **5**; `small / bench contact apparatus` **6**. The four lanes are **mutually exclusive review queues only**, and an item may eventually have multiple authored capabilities (e.g. movable vessel and station-installed process equipment).

## A source-backed resolution for the apparatus/tool conflict

The existing planned recipe `requiredToolItemKeys` list cannot on its own say whether a requirement is:

- an **owned portable tool** that the actor can legally retrieve/hold/use;
- a **station-provided portable tool** with a separate exact station owner and tool inventory / rental / work-role permission;
- **installed station equipment or a fixture**, potentially not a freely transferable item while assembled;
- a **locally placed portable apparatus** brought to an allowed workstation and authorized for the operation;
- a **deployable or consumable component**, subject to inventory/use/recovery rules rather than an implied permanently present fixture.

Recommended future decision: author a **capability/role-qualified requirement** (with a compatibility bridge to exact `itemKey` requirements), rather than reclassifying apparatus item identities as tools with free hand slots. The recipe and action engine should check actual usable capability and lawful station arrangement, never treat a matching descriptive workplace type as the fixture's existence.

Crucial source edge cases:
1. `hoop_anvil` in a `coopers_shop` recipe: no source proof of installation at every coopers shop, and a personal hoop anvil should not automatically count as carried-ready. The actual station surface, placement and ownership must be checked.
2. `smoking_rack` in a `smokehouse` recipe: source says required tool, but the app must later prove real usable rack capacity and local occupancy. Another smokehouse recipe currently declares **no required tools**; that does **not** prove all smokehouses provide racks to everyone.
3. `brick_mold`, `candle_mold`, `mortar_pestle`, `press_screw_key`: names can imply a hand-operated or bench-supported device; do not force all apparatus into fixed building slots or all into one generic right-hand slot.
4. `pottery_wheel`, `well_winch`, `crane_hook`, `roasting_drums`: installation, powered state, anchoring, access radius and mechanical dependencies must be authored before use.
5. `anvil` and `hoop_anvil`: apparent physical relationship is not proof they substitute for one another in a recipe.

## Contract shape to be settled by future owner review

Static candidate declarations must answer: **physical form** (fixed/installable/portable-supported/hand-held), **use capability and precise tool compatibility**, **required fixture components**, **capacity/occupancy**, **power/fuel/material dependencies**, **station placement requirements**, **portability/transport disposition**, **interaction/action envelope** and **safe-use constraints**. Actual state must be owned by a station/equipment instance, not the static workplace *type* or item name.

Authority responsibilities:
- `items.items` retains canonical item identities. Future item/fixture/container profiles, if approved, own static compatibility descriptors, not current station stock.
- Real workplace or fixture instances own presence, condition, mount/install posture, reservations, custody, operating state, contained work and tool availability.
- Craft/action owner validates recipe, capability, station permission, access/occupancy, active conditions, resources and timing; grants no tools by default.
- Player gear owner tracks only actually owned/held/carried instances. **No phantom inventory copies** of station tools or installed fixtures.
- An owned apparatus temporarily installed for work needs a single legal transfer/lease/return path with exact durable IDs, not a parallel station and inventory ledger.

## Prospective test acceptance matrix (not executed)

| Test ID | Source conflict | Required future behavior |
| --- | --- | --- |
| T2-01 | Cask recipe requires hoop anvil, but station has none | Refuse or require valid player-provided and installed fixture, no free tool |
| T2-02 | Smokehouse type exists, actual smoking rack does not | Reject the smoked-fish recipe or resolve another explicitly compatible source |
| T2-03 | Authorized shop offers appropriate intact rack | Admit only if capacity, permissions, stage and actual physical access pass |
| T2-04 | Worker can enter workshop but lacks tool usage permission | Deny use, no resource/time loss on rejected command |
| T2-05 | Player installs own apparatus and leaves | Preserve single owner/custody, rented space/installation permission and recovery |
| T2-06 | Two concurrent users reserve one apparatus position | Owner serializes occupancy, no duplicate station material results |
| T2-07 | Wrong apparatus has similar name to required one | No implicit `anvil` ↔ `hoop_anvil` substitution |
| T2-08 | Small hand-set mold used at a bench | Do not require an invented permanent building fixture if authored portable use is legal |
| T2-09 | Station fixture breaks or becomes inaccessible mid-use | Exact interruption, no duplicate outputs/material, timed recovery |
| T2-10 | Return a borrowed station-held tool after interruption | Remains in station custody, no copy in personal bag |
| T2-11 | Workstation exists only as descriptive canonical type | No recipe execution or stock entitlement absent actual instance |
| T2-12 | Save/restart with installed private apparatus | Exact owner, placement, condition and work receipts survive |

## Disposition

This audit closes **provisional T2 static apparatus identity classification** for all 21 records. It does not close **T2 actual workplace stock/fixture/access crosswalk**: that requires the full static workplaces file plus a selected station instance and authorization model. No data, schema, runtime, selected client, item identities, Save, current prompt/handoff or Codex branches were changed.

**HOLD_NAMED_CONSUMER**, docs-only PR #40. Owner-review trigger: selected native gear/Save gate and station-instance/recipe-capability design. Do not merge these candidate semantics into gameplay based on metadata alone.
