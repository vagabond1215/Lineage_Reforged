# Native-v3 Contextual Food, Portions, Provisions, and Action Legality: Owner Decision Addendum

Date: 2026-11-08
Status: OWNER-REVIEWED PRODUCT DIRECTION; CONNECTOR-RECONCILED; IMPLEMENTATION NOT AUTHORIZED
Source baseline: draft PR #70 fad907301d85786feaeed9cf8fecf64bc9d37949
Documentation child: draft PR #71, codex/native-v3-contextual-consumption-prework
Game: 0.1.1-prealpha / INTEGRATED_LOOP; HOLD_SELECTED_ATOMIC_ACTIVATION

This addendum records the owner's decisions following review of the original connector-only plan and authority audit. It refines the proposed design choices in native-v3-contextual-consumption-authority-audit-2026-11-08.md. It is not a gameplay implementation decision or authorization. When that original proposal differs from the explicit owner decisions below, **this addendum controls the proposed next design**, while the repository's already accepted owner boundaries remain implementation gates. Do not quietly change accepted parent design documents, code or content.

## 1. Source precedents and their implications

- docs/design/regional-ration-manifest-and-container-knowledge-decision.md, sections 5-8: resolve each physical package's manifest **when generated or admitted to the world/ownership graph**, never on opening; generation may be fixed or constrained RNG; preserve true manifest separately from unknown/category-known/manifest-known player knowledge. Per-unit truth must survive visible grouping.
- docs/design/culinary-preparation-portion-meal-composition-and-food-knowledge-decision.md, sections 6-7 and 12-13: whole-only / portionable / pourable / stack-divisible concepts; physical containers; meaningful partial or transformed food state; do not use presentation percentages as canonical amounts; visible grouping does not homogenize hidden physical units.
- docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md, sections 6-9: serving is an authored reference amount resolved into count/mass/volume, not an independent physical dimension; vessel compatibility matters; uniform or individual multi-serving preparation may be offered where a real process owner exists.
- docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md: inventory selection exposes food and item actions, while food/body, generic item/container, crafting/process and social/market owners remain distinct.
- docs/design/contextual-player-action-and-command-architecture-decision.md, sections 1-5: owner-owned concrete commands and revalidation; ephemeral contextual descriptors. Existing design intentionally does **not** expose executable unlawful actions until a crime/social/consequence owner exists. The owner's proposed future theft behavior does not waive that present implementation safety gate.
- docs/design/local-scene-context-projection-decision.md: a textual scene, artwork, static map or place label alone does not instantiate a stable meal, source, seat or wagon.

## 2. Owner decisions: physical food and invocation surface

| Case | Owner-reviewed product direction | Implementation prerequisite |
| --- | --- | --- |
| Carried, ready food | Select exact item in Inventory and Eat/Drink; direct Eat normally consumes **one authored whole physical unit** by default | An accessible eligible item, valid profile, exact owned source and admitted effect |
| Character-owned or explicitly served single meal | The meal's observed instance can be eaten directly from Current Area; no pointless forced Inventory transfer | Actual durable serving instance, access, consumption and storage/body-state owners |
| Shared/communal pot or platter | **Take a physical serving first, then Eat.** Do not expose direct Eat from the shared source | Existing source/serving quantity, source transfer, appropriate vessel, rights and accepted inventory/serving result |
| Food owned by someone else | Physical taking is a future possible action even when illegal; do not assume permission grants physical possibility | A legitimate item transfer/crime-provenance owner and safe legal-consequence contract before executable unauthorized Take |
| Ingredients and cooking station | Prepare/Cook through valid physical process and station, not through direct Eat | Recipe/process, tool, material, time and location/station owners |

The common nutritional application path may be reused after the source owner validates and debits its own quantity; that is not a license to introduce one universal source-mutating Eat owner. Selecting an object never grants authority to take it. Player-facing direct actions can be compact, but owner checks must remain explicit.

## 3. Unauthorized taking: product truth vs presently safe executable surface

Owner direction: do not design the world so other people's food is mechanically untouchable. Unauthorized taking is stealing even if nobody sees it, and future observation/response systems can separately determine whether someone witnessed, discovered, reported or punished the act.

**Accepted implementation limit:** the current contextual command architecture omits executable unlawful commands until a suitable crime/social/consequence owner is present. Thus: record physical feasibility, prior ownership and unlawfulness as future owner requirements, but do not implement an unchecked generic Take, automatically permit theft, infer witnessed theft from location flavor, or create a consequence-free inventory shortcut. A future transaction should preserve actor, item, prior owner, source, time, access/consent and accepted transfer provenance; witness assessment is a separate future owner. No crime schema or event ID is prescribed in this document.

## 4. Portions: transform objects, not merely consumption charges

Owner choice: pressing Eat on a whole loaf consumes the whole loaf unless the character first portions it. Breaking or slicing creates **distinct canonical output item units** that can also be used for crafting, recipes, trade, gifting and other authorized non-consumption purposes.

Illustrative, **not authored canon**:
- Input: 1 Bread Loaf.
- Using a supported cutting method and surface: output 6 Bread Slices.
- Inventory shows one grouped entry `Bread Slice ×6`, meaning six individually usable items, not one loaf with six hidden charges.
- A recipe requiring 2 Bread Slices consumes two units and leaves `Bread Slice ×4`.
- Breaking the loaf by hand could instead produce authored chunks. No specific yield or nutrition loss is authorized by this example.

Inventory stack or UI entry count is **not** physical volume and is **not** the number of physical items. Compatible physical units may be represented in one authoritative stack with quantity N. If condition, quality, identity, contamination, origin, owner/knowledge or other truth differs materially, preserve it with compatible per-unit records or separate stacks. Do not merge differing units merely because names match.

Maintain approximate **conservation of edible amount, mass, volume and nutritive value** across transformations, subject to explicit modest preparation losses, packaging and physical form. Do not create food or calories by splitting. Use authored, approximate nutritional amounts and integer/fixed-point canonical units as appropriate; no fake exact grams or arbitrary percentage-only storage. New output items need their own canonical identities before a runtime transform is allowed.

### Physical method and storage capabilities

Instead of making one global Boolean `easyPortion` authoritative, distinguish:
1. Portionability: whole-only, divisible/portionable, pourable, stack-divisible, as applicable.
2. Permitted method: hand-break/tear, knife-cut, ladle/pour, other authored tools, surfaces and preparation.
3. Output: canonical item/serving identity, number/amount, edible/nutrition amount and supported transform loss.
4. Storage: grouping/stacking compatibility, container/vessel compatibility and actual occupied volume.

The UI can present natural verbs (Break Bread, Slice Bread, Pour into Flask) while an eventual static capability descriptor identifies why the method is possible. Use a single source of truth for methods where accepted crafting/process ownership already defines them; do not invent a competing food-only method registry.

Solid stacked bread slices should usually occupy approximately the loaf's former volume. Tearing dry jerky may also keep compact group storage. Independently stored liquid portions require appropriate additional containers and may increase combined container volume/weight. Drinking directly from a held container does not require another vessel. A communal cauldron's Take Serving requires a suitable serving vessel or other accepted physical serving method; do not make arbitrary liquid inventory stacks.

## 5. Rations and sealed mystery packages

**No reopening of the existing decision:** randomized manifest content is sampled once when a specific physical pack is created/enters world ownership, not when opened. Seed/RNG state and exact result belong to the authoritative instance/creation owner. Opening reveals and transfers existing content, with no reroll on retry, location change, transfer or Save/restart.

Accepted package direction:
- Ration archetypes cover composition such as preserved protein, fruit/nut, meat-and-cheese, bread, mixed, hearty and other **authored** variants. Avoid unbounded size × category permutations.
- Constrained weighted tables may vary quality and count while keeping value and content-role expectations within **authored** bands. Numeric values, distribution weights, and item catalog are not set here.
- Self-packed goods and genuinely declared exact contents are manifest-known to the character. A trusted categorical label can be category-known. Undeclared purchased/traded/institution-issued goods or unmarked bandit loot may be unknown or category-known according to observable evidence. Method of acquisition alone does not determine knowledge.
- Seller claims, labels, true manifest and character belief remain structurally distinct for future deception, mistakes and appraisal. Do not build the fraud system in this pass.
- Opening never forces consumption; it creates/places the individual food units while preserving the remaining amount and legitimate storage/capacity outcome. Packed provisions can be more space-efficient; opening may marginally change volume/packing requirements when packaging/contents actually justify it. No arbitrary slot penalty or disappearance on full inventory.
- Unknown physical manifests may be presented in one visible inventory group only if per-unit manifests and knowledge survive; grouping does not combine contents or roll once for all.

The generic starter `item.ration_bundle` remains non-edible packaging. Its orphaned `consume.ration_bundle` profile is **not** a shortcut. The Open/Unpack owner, manifest catalog and content/instance schema remain future implementation gates.

## 6. Eating, travel, vehicles and incapacitation

Eating takes contextual time when an activity owner authorizes it. Do not assume current one-unit native Use's lack of authored time cost sets the design for all future food interactions. Compatible walking/travel and a portable apple/jerky consumption may overlap without double-spending time; the travel/activity owner decides scheduling and interruption.

Use a capability combination rather than a single `requiresSeat` flag:
- Food: portable hand-held versus container-supported, temperature/handling constraints, need for stable surface, tools or free hand(s).
- Character: current activity/motion, hands, physical condition, voluntary agency.
- Place/vehicle: available stable table/surface, seat/resting place, reachability, occupancy and provider permission.
- Access: real passenger or visitor rights established by the transport/service/domain owner. A quest may supply an accepted grant; mere quest text, wagon art or a declared generic `canUse` flag does not override actual vehicle ownership.

Examples: hand-held fruit can be eaten while walking if compatible; a bowl of soup should not be eaten while walking or on horseback; a passenger may dine aboard a wagon/ship only when its actual facilities, motion and access allow it. Exact time ticks, interruption and hand-use costs are deferred balance/owner decisions.

Ordinary eating is **not available in active combat**. Pending-defeat, incapacitated and unconscious actors cannot initiate voluntary item actions. A separate actor may later administer physical, magical or medical care subject to the correct care/target/delivery owner; oral liquids to an unconscious patient must not be universally authorized as safe (swallowing/aspiration). No new combat item, healing or potion effect is implied.

Current native-v3 selected UI can call `admitNativeSelectedItemCommand` directly, whereas `nativeSelectedSession.ts::applyNativeSelectedItem` explicitly checks pending defeat. This is a potential gate divergence only, not a proven bypass. Codex must test the actual selected surface and correct owner fences before concluding the path is safe.

## 7. Technical invariants and acceptance prerequisites

- Existing native inventory-only fungible Use remains bound to exact owned bag/overflow source, inventory fingerprint/revision, profile and accepted session mutation; do not replace with unverified generic world-source commands.
- For owner-admitted actions, debit exact source and apply intended effects once or neither; duplicate, conflicting, stale, interrupted and rejected requests do not double-consume or retarget.
- A visible affordance is read-only projection, not an entitlement, persistent source or idempotency identity.
- Transformed solids use actual output item IDs and quantities, with compatible stack presentation; output cannot be manufactured from a food label or vague method tag.
- Pack manifests are true per physical unit before opening and persist across trading, Save, reload and character knowledge changes.
- Unowned/unknown environment sources remain non-executable until item/source/serving and legal transaction owners exist.
- v2 Save/account witness authority, production, current staging version 6 and publication-artifact checks remain unchanged.

## 8. Remaining executable gates; recommended next Codex pass

**Next narrowly executable task: native-v3 current carried-food Use legality and reachability characterization.** Read and test the exact PR #70 source, optional PR #71 documentation only. Find a naturally obtained, canonical, unambiguously directly edible individual item in a fresh native campaign. If ordinary acquisition cannot be proven, produce an exact missing-owner decision rather than granting items or linking orphan profiles. Test ordinary selected UI, pending defeat and active combat eligibility, exact stack/account/save admission, duplicate/stale/failed requests, body-state/resource outcome, Save/restart, and v2 isolation. Use test-only fixtures only to characterize lower-level owners and label them non-ordinary.

Do **not** implement pack opening, physical portion transforms, communal source serving, unlawful Take, crime witnessing, vehicle facilities, new nutrition profiles, generic contextual world-food UI, serving schemas or any new source-owner in the first Codex pass. Separately authorize implementation only after precise design/owner preconditions are met and a focused red-before-green reproduction exists.

The first pass may be wholly characterization/testing, not a repair. If a confirmed selected guard bypass is found, stop with a bounded fix recommendation unless the owner explicitly granted that repair in the same task.

## 9. Connector-only audit verdict

- **PASS:** exact source precedence for manifest generation vs opening, known/unknown manifest, per-unit visible grouping.
- **PASS:** physical portion-transform semantics preserve recipes/non-consumption uses, quantity and rough nutritional/volume conservation.
- **PASS:** communal serving-first choice, distinct owned meal and carried-food contexts.
- **PASS with implementation gate:** physically possible unlawful Take is a future product requirement, not a license for unowned transfer before crime ownership.
- **PASS with implementation gate:** food-handling capabilities and travel time/overlap require actual mobility/vehicle/action owners.
- **PASS with runtime test gate:** pending defeat/active combat player agency and source mutation fences need live Codex proof.
- **NO EXECUTABLE CHANGE:** this pass edits only documentation on PR #71 and cannot verify runtime, actual hosted account state or staging hashes.

Disposition: `OWNER_DIRECTION_RECONCILED_DOCS_ONLY`, `NEXT_CODEX_CHARACTERIZATION_READY`, `HOLD_SELECTED_ATOMIC_ACTIVATION`. No merge, publication, production activation or Game-version change is authorized.
