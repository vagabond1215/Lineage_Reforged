# H1 Authored Apparel/Carrier Coverage and Holster Source Census

Date: 2026-10-28
Status: CONNECTOR-ONLY SOURCE AUDIT; PROVISIONAL PHYSICAL-REVIEW TAXONOMY, NOT ACCEPTED WEARABLE FIT / STORAGE / SCHEMA / GAMEPLAY AUTHORITY
Exact selected master: `a596112acf3945f2bf7c625e943f2511d12aa710`; native v3 unselected PR #41: `a3f24c9177034adf4f4068f356d4b0c39337b207`; follow-on from [holster and armor accessibility preflight](../design/holster-pocket-and-armor-layer-accessibility-preflight-2026-10-28.md), [Back and quick tool carrier preflight](../design/quick-access-tool-carriers-back-mounts-and-shield-readiness-decision-2026-10-28.md).

## 1. Source-grounded result

Inspected `packages/content/base/items/items.json`, `packages/schemas/items/item.schema.json`, and the unselected native `packages/content/base/items/equipment_fit_profiles.json`, at refs above.

- Exactly **56** canonical item records use item classes `armor`, `clothing`, or `accessory`: **18** armor, **14** clothing, **24** accessory. These are not all humanoid wearable objects: `reins`, `saddle` and `blanket` also need explicit exclusions, and class alone does not prove worn eligibility.
- **12** have a row in the unselected native fit table: **10** with nonempty worn eligibility and **2** with empty slots. **44** have no row in that candidate. Missing rows are coverage gaps, **not verified incompatibility with every future body mount**.
- **26** of these records have `materialDifficultyProfile`; **7** have `useProfiles`. Neither expresses anatomical coverage, rigid joint articulation, pockets or draw access.
- The canonical item schema's properties do **not** contain `attachmentMounts`, `bodyAnchor`, `mountCapacity`, `pocketCapacity`, `storageSlots`, `drawSpeed`, `concealment`, `coverageMap`, `layerDepth`, `bulk`, or `weight`. These names are **hypothetical search probes, not accepted new field names**; missing schema fields plus inspected record keys prove no already-authored generic storage/holster capability in this item authority.
- The native gear owner has `worn | bag | overflow` location types and a fixed authored fit list per item, **not** parented holster contents, dynamic mount keys, integrated cloak pockets, under-bracer hidden knife, and actual hand state.
- No source-backed universal "plate blocks all holsters" or "any cloak has pockets" rule exists. The approved layered-loadout decision already requires explicit armor/clothing coverage and compatibility.
- `plate_greaves` is a real item identity, but **full plate gauntlet** is not an inspected canonical armor item, and anatomical reach/fit cannot be inferred from greaves alone.

Review-category counts are **explicitly provisional routing labels**, not physical capabilities:

| Source-review lane | Records |
| --- | ---: |
| armor coverage review | 14 |
| belt or pouch | 4 |
| body-wear anchor candidate | 6 |
| core back carrier | 2 |
| garment/pocket surface review | 11 |
| other apparel / no mount assumed | 16 |
| shield/forearm interference review | 3 |
| **All** | **56** |

## 2. Complete current apparel/carrier/armor fit ledger

All source identities and class/branch fields below are exact catalog records. Fit is from unselected PR #41. "Review lane" is *not* a new catalog classification, fit, storage capacity, or guarantee of being worn.

| Canonical item key | Class | Branch/subbranch | Provisional review lane | Current native fit |
| --- | --- | --- | --- | --- |
| `adamantite_ward_bracelet` | `accessory` | `bracelet/ward` | other apparel / no mount assumed | not in v3 fit table |
| `apron` | `clothing` | `workwear/torso` | garment/pocket surface review | `clothing.chest` |
| `backpack` | `accessory` | `travel/pack` | core back carrier | not in v3 fit table |
| `blanket` | `clothing` | `textile/bedding` | other apparel / no mount assumed | not in v3 fit table |
| `buckler_shield` | `armor` | `shield/light` | shield/forearm interference review | `equipment.weapon.left` |
| `casual_boots` | `clothing` | `casual/footwear` | body-wear anchor candidate | not in v3 fit table |
| `casual_cloak` | `clothing` | `casual/outerwear` | garment/pocket surface review | `clothing.chest` |
| `casual_trousers` | `clothing` | `casual/legs` | body-wear anchor candidate | not in v3 fit table |
| `casual_tunic` | `clothing` | `casual/torso` | garment/pocket surface review | `clothing.chest` |
| `cloth_heavy_armor` | `armor` | `cloth/heavy` | armor coverage review | not in v3 fit table |
| `cloth_jerkin` | `armor` | `cloth/light` | armor coverage review | not in v3 fit table |
| `cloth_medium_armor` | `armor` | `cloth/medium` | armor coverage review | not in v3 fit table |
| `coin_belt` | `accessory` | `belt/utility` | belt or pouch | not in v3 fit table |
| `face_wrap` | `accessory` | `face/utility` | garment/pocket surface review | not in v3 fit table |
| `formal_cloak` | `clothing` | `formal/outerwear` | garment/pocket surface review | `clothing.chest` |
| `formal_doublet` | `clothing` | `formal/torso` | garment/pocket surface review | `clothing.chest` |
| `formal_shoes` | `clothing` | `formal/footwear` | body-wear anchor candidate | not in v3 fit table |
| `formal_trousers` | `clothing` | `formal/legs` | body-wear anchor candidate | not in v3 fit table |
| `gemmed_bracelet` | `accessory` | `bracelet/adornment` | other apparel / no mount assumed | not in v3 fit table |
| `gemmed_earrings` | `accessory` | `earring/adornment` | other apparel / no mount assumed | not in v3 fit table |
| `gemmed_necklace` | `accessory` | `necklace/adornment` | other apparel / no mount assumed | not in v3 fit table |
| `gemmed_ring` | `accessory` | `ring/adornment` | other apparel / no mount assumed | not in v3 fit table |
| `herb_pouch` | `accessory` | `pouch/utility` | belt or pouch | carried-only / empty slots |
| `iron_ring` | `accessory` | `ring/adornment` | other apparel / no mount assumed | not in v3 fit table |
| `kite_shield` | `armor` | `shield/standard` | shield/forearm interference review | `equipment.weapon.left` |
| `leather_greaves` | `armor` | `leather/medium` | armor coverage review | not in v3 fit table |
| `leather_heavy_armor` | `armor` | `leather/heavy` | armor coverage review | not in v3 fit table |
| `leather_light_armor` | `armor` | `leather/light` | armor coverage review | `equipment.armor.chest` |
| `leather_medium_armor` | `armor` | `leather/medium` | armor coverage review | not in v3 fit table |
| `mail_coif` | `armor` | `metal/component` | armor coverage review | not in v3 fit table |
| `mithrite_focus_ring` | `accessory` | `ring/focus` | other apparel / no mount assumed | not in v3 fit table |
| `neck_charm` | `accessory` | `necklace/adornment` | other apparel / no mount assumed | not in v3 fit table |
| `orichalcum_relic_chain` | `accessory` | `necklace/relic` | other apparel / no mount assumed | not in v3 fit table |
| `pack_frame` | `accessory` | `land/utility` | core back carrier | not in v3 fit table |
| `padded_gambeson` | `armor` | `textile/wear` | garment/pocket surface review | not in v3 fit table |
| `pearl_earring` | `accessory` | `earring/adornment` | other apparel / no mount assumed | not in v3 fit table |
| `plate_cuirass` | `armor` | `metal/plate` | armor coverage review | not in v3 fit table |
| `plate_greaves` | `armor` | `metal/plate` | armor coverage review | not in v3 fit table |
| `plate_helm` | `armor` | `metal/plate` | armor coverage review | not in v3 fit table |
| `reins` | `accessory` | `agriculture/tack` | other apparel / no mount assumed | not in v3 fit table |
| `ring_mail_hauberk` | `armor` | `metal/ring` | armor coverage review | not in v3 fit table |
| `ritual_necklace` | `accessory` | `necklace/adornment` | other apparel / no mount assumed | not in v3 fit table |
| `saddle` | `accessory` | `agriculture/tack` | other apparel / no mount assumed | not in v3 fit table |
| `scale_mail_armor` | `armor` | `metal/scale` | armor coverage review | not in v3 fit table |
| `scale_vest` | `armor` | `metal/scale` | armor coverage review | not in v3 fit table |
| `signet_ring` | `accessory` | `ring/adornment` | other apparel / no mount assumed | not in v3 fit table |
| `silver_earring` | `accessory` | `earring/adornment` | other apparel / no mount assumed | not in v3 fit table |
| `tower_shield` | `armor` | `shield/heavy` | shield/forearm interference review | `equipment.weapon.left` |
| `travel_cloak` | `clothing` | `textile/wear` | garment/pocket surface review | `clothing.chest` |
| `travel_hood` | `clothing` | `travel/headwear` | garment/pocket surface review | not in v3 fit table |
| `travel_pouch` | `accessory` | `pouch/utility` | belt or pouch | carried-only / empty slots |
| `utility_belt` | `accessory` | `belt/utility` | belt or pouch | not in v3 fit table |
| `veil_mask` | `accessory` | `face/utility` | garment/pocket surface review | not in v3 fit table |
| `work_gloves` | `clothing` | `workwear/handwear` | body-wear anchor candidate | not in v3 fit table |
| `work_hat` | `clothing` | `workwear/headwear` | garment/pocket surface review | not in v3 fit table |
| `wrist_bracer` | `accessory` | `wrist/utility` | body-wear anchor candidate | not in v3 fit table |

This ledger is a **documentary census**, not a proposal that all 56 require new dynamic mounts. Avoid promoting nonhumanoid tack or bedding to player equipment.

## 3. Related held and small carried items (exact class audit)

The following exact item identities give concrete tests for sleeves, dart cases, pockets, belt loops and weapon assignment. The fit table's weapon position should not be confused with a stowed sheath or a hand-held slot.

| Canonical item key | Item class | Current authored action use profiles | Native fit |
| --- | --- | --- | --- |
| `throwing_dart` | weapon | none | slot.equipment.weapon.right |
| `throwing_knife` | weapon | none | slot.equipment.weapon.right |
| `skinning_knife` | tool | none | slot.equipment.weapon.right |
| `butcher_knife` | tool | none | slot.equipment.weapon.right |
| `tailor_needle` | tool | none | none |
| `surgical_needle` | tool | none | none |
| `net_needle` | tool | none | none |
| `awl` | tool | none | carried-only |
| `pickaxe` | tool | `utility.mining`, `combat.melee.improvised` | slot.equipment.weapon.right |
| `lumber_axe` | tool | `utility.woodcutting`, `combat.melee.primary` | slot.equipment.weapon.right |

All instances of `weapon` or `tool` class are presently treated as separately durable in native gear; new dart case / needle roll quantity-compression must not silently discard per-item identity.

## 4. Bounded physical authoring decision sequence

**Carrier providers before exceptions:**
1. Select an existing exact candidate (e.g. `wrist_bracer`, `utility_belt`, `travel_pouch`, `travel_cloak`, `backpack`) and decide whether to extend that *particular* canonical record with a real small pocket/loop or defer a new dedicated garment/holster identity. The source does not prove every copy of existing bracers/cloaks already comes with storage.
2. Pick one legal attachment class and item with explicit fit, closure, retention, safe cover of sharp points, hand access direction, external/under-layer location and accessibility. Do not infer capacity from `baseValue`, material difficulty, name or aesthetic role.
3. Define a side/zone anatomy reference and layer intersection: wrist vs elbow vs upper arm; upper thigh vs knee vs calf; waist vs back. `slot.equipment.armor.arm` and `slot.equipment.armor.leg` are not sufficient to infer exact collision with one wrist, thigh or boot mount.
4. Declare a **separate** visibility/access result for each admitted attachment and current clothing/armor combination. Concealment is an observer-dependent posture, not a permanent item stat or guaranteed successful stealth check.
5. Refer every actual attachment back to the source carrier instance and exact child item instance. Do not duplicate same knife in weapon equip, inventory bag and holster UI.
6. Carry over the accepted one-watch *full preset apply* time separately from small tool/weapon retrieval time. No free combat draw from a quick mount or under-cloak pocket.

## 5. Focused compatibility candidates (NOT implemented)

| Pair of real/candidate source items | Question to prove | Expected reviewer posture |
| --- | --- | --- |
| `wrist_bracer` + `skinning_knife` | Is there a built-in or independent fitted under-wrist carrier? | **Unknown/deny absent authored mount**, not automatically yes |
| `wrist_bracer` + `throwing_knife` | Is shape and safe blade retention compatible? | Unknown until exact sheath |
| `wrist_bracer` + `surgical_needle` | Does a protective needle case exist? | Unknown; never treat exposed loose needle as safely retained |
| `utility_belt` + `awl` | Tool loop capacity and action retrieval | Strong first owner pilot; still no current capacity |
| `travel_pouch` + `tailor_needle` | Pocket/roll and protection | May be accessible but not instant weapon readiness |
| `travel_cloak` + `throwing_dart` | Does this cloak have an inner dart case? | No assumed pocket, finite identity-preserving count |
| `casual_trousers` + `throwing_knife` | Is there a sewn or strapped thigh mount? | Clothing leg slot is insufficient evidence |
| `plate_greaves` + thigh holster candidate | Does greave coverage reach target thigh and block strap access? | Unknown geometry, no blanket rejection |
| `backpack` + `short_bow` | External bow harness, retention and strap interference | Deny quick mount absent authored attachment |
| `backpack` + `arming_sword` | Length and back draw trajectory | No automatic sword-on-pack slot |
| `coin_belt` + `pickaxe` | Large-tool size and expected coin-only belt function | Deny pending explicit extraordinary tool harness |
| `buckler_shield` + under-bracer knife | Shield held/forearm state vs holster and hand access | Do not derive a hands-free buckler without new shield evidence |

## 6. Verified scope and next consumer

**Performed:** complete exact-key census of all 56 apparel/armor/accessory records; exact join with PR #41 candidate fit table; schema property inspection; source-backed paired cases with existing item keys; recorded negative provenance gaps.

**Not performed:** current selected-client fit, full clothing/armor body geometry, physical item dimensions, runtime ownership/mount transactions, combat/stealth action math, authenticated checkout, content lint, unit tests, Save/restart, Site.

**Next connector-safe consumer:** H2 owner/compatibility decision matrix and red-test preflight, with no executable code. T2 workplace-tool stock cannot be claimed from recipe workplace type; `civilization/workplaces.json` is **2,173,521 bytes**, and attempts to read full or bounded ranges returned empty through the connector. Do not "complete" station/tool stock classification from partial excerpts.

Branch `connector/tool-held-station-access-expansion-plan-2026-10-28`, draft PR #40, `HOLD_NAMED_CONSUMER`. No edit to active Codex stack or branch disposition register; coordinate that register on an owned checkpoint.
