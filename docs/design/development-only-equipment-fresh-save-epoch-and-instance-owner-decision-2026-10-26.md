# Development-Only Equipment Fresh-Save Epoch And Item-Instance Owner Decision

Date: 2026-10-26
Status: `OWNER_DIRECTION_ACCEPTED; CLEAN_EQUIPMENT_FORMAT_AUTHORIZED_IN_DESIGN; RUNTIME_NOT_YET_IMPLEMENTED`
Repository: `vagabond1215/Lineage_Reforged`
Inspected `master`: `a596112acf3945f2bf7c625e943f2511d12aa710`
Run: unversioned connector-safe owner policy and planning reconciliation; no code, schema, Save, or Site mutation
Game: `0.1.1-prealpha`; parked `DEV-0.7.2.13` remains untouched.

## 1. Owner decision and precedence

**Lineage: Reforged is not in live play. Do not preserve backward compatibility for old development saves as a prerequisite to implementing the new equipment system.** The owner expressly rejects the recent assumption that old 17-slot save records, v0.6.0 envelopes, old item-type stash flags, old generated item quantities, or old pre-cutover Ashen Reef survey witnesses must be migrated into or accepted by a replacement equipment schema.

This direction is consistent with the already accepted [Development-Only Clean Persistence Epoch Route Decision](development-only-clean-persistence-epoch-route-decision.md), which explicitly waived importer, old-account, old-campaign, old-history, and old-save preservation for pre-cutover test data. It **supersedes the old-save-compatibility requirements** in the more recent [Layered Loadout Preflight](character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md), [Stage 1 Migration Probe Decision](character-layered-equipment-migration-probe-decision-2026-10-26.md), [Stage 2 Location Gate](character-durable-item-location-stage-2-decision-2026-10-26.md), [PR #17 equipment owner audit](https://github.com/vagabond1215/Lineage_Reforged/pull/17), and [PR #18 recovery fixture packet](https://github.com/vagabond1215/Lineage_Reforged/pull/18) **only where they require preserving or converting obsolete pre-cutover save data**. Those historical documents and tests remain useful observations of why the old model is insufficient; they no longer control the implementation gate.

This decision does **not** supersede the core item/equipment/inventory ownership boundary, the current target campaign publication/recovery authority, the requirement for real effective-worn equipment projections, authored slot/fit profiles, or user-directed loadout semantics. Prior acceptance proof that legitimately supported active post-epoch mechanisms is historical evidence; do not rewrite it to look like it used a new schema.

## 2. Old development saves are disposable; new-format saves are durable

### Explicitly removed from the equipment cutover gate

- No migration of old 17-key `EquipmentState` to new left/right/back/ring slots.
- No arbitrary left-first conversion of saved Ear/Eyes/Fingers items and no reconciliation of multi-unit unsided legacy slots.
- No recovery or quarantine UX for legacy `ui.character.item-stash.<itemId>` flags, ambiguous old bow durability, or item-type stash information loss.
- No legacy gear instance ID generation based on original saved equipment, snapshot capture ticks, bag stack indexes, or revision-bound conversion receipts.
- No obligation to load obsolete `0.6.0` saves or preserve old target-snapshot equipment layouts, old browser-local campaign/account test records, old equipment witnesses, and their old hashes into the replacement epoch.
- No requirement to maintain mixed-format equipment resolvers, read-through adapters, dual writes, fallback equipment ledgers, or simulated compatibility support just to retain old data.
- No compatibility fixtures asserting old saves remain playable or that legacy equipment-to-combat projections match the new world after cutover.

Read-only `equipment-migration-plan.ts` and `legacy-item-location-audit.ts` can be retained as diagnostic history, removed in a separately scoped cleanup, or left unreferenced; **do not route new implementation through them or treat `activation: not_authorized` as a current blocker**. Do not extend these probes further absent a genuinely new consumer.

### Required for the replacement system

- New campaigns created **after cutover** must have stable uniquely identified non-fungible gear, exactly one authoritative physical location per owned instance, correct amounts/condition, valid containers/bags/overflow, durable save/restart identity, and no independent UI stash ledger.
- New target-format save validation and publication must detect malformed data, stale revisions, incomplete writes, duplicate IDs, corrupt graph edges, lost artifact references and incompatible schema formats. Reject safely and expose a legitimate restart/recovery path for **new** data.
- The replacement format or explicitly isolated storage epoch must be distinguishable from earlier development data. If old storage cannot be decoded, present a truthful **development save incompatible / start a new campaign** path, not a best-effort importer, silent conversion, fake empty campaign, or unexplained crash.
- An obsolete record may remain physically present until a deliberate owner-approved/dev-only reset. **Do not automatically delete development save/account data merely because the user waived compatibility.** Any cleanup is a separate, explicit, origin/profile-scoped action. Never clear an origin's credentials or unrelated data opportunistically.
- Once accepted, the new format must persist legitimate campaign history, Chronicle, lineage/continuity, world state, inventory/equipment and publication receipts across current-format Save/restart and interrupted actions. Rejecting obsolete formats is **not permission to abandon integrity of data written by the new system**.
- Active clients/tabs of different schemas must not corrupt new data. Follow the accepted new-epoch partition/version checks and real transaction/caller durability. New/current campaign artifacts should never be reinterpreted as obsolete through naive format-string swapping.

## 3. New-format equipment owner and content boundary

### Durable physical truth

Design one non-fungible item-instance owner with stable `itemInstanceId`, canonical `itemKey` and `itemId`, per-item condition/durability and eventual workmanship/provenance hooks, and **exactly one physical location** (worn position/layer, carried bag, overflow, nested container once authorized, world/transfer as an explicit later scope). Distinguish *owned item* from *currently worn item* and from *preset reference*. Instance IDs persist across sorting, equip/unequip, re-equipping, multiple presets, and accepted save/restart. Do not create a second gear ledger under `sessionState.flags` or allow item-type stack merges to destroy differentiated gear.

Fungible ordinary cargo, commodities, consumables and quantity-only quest items can remain stacks under their existing owners. Some `tool` items can be equipped; eligibility must be authored/item-profile driven, not assumed from `itemClass === "weapon"` or from English names. The pre-cutover source inventory was 1,372 catalog records, mostly commodity (1,114) with 131 tools; converting all commodity quantities into unique items is not the desired feature. Historical 256-unit audit count is not a new-format item limit.

**Current actual-worn projection** is the only source of truth for resource modifiers, player-engine equipment counts, combat grants/actions and UI equipped indicators. No inactive preset should grant an action or resource bonus. Cross-cutover tests compare *expected current-format mechanics* to approved game contracts; they do not need an obsolete save witness.

### New slots and layers from the beginning

Author real, durable, sided and layered positions instead of creating the old 17-key map first and migrating it:

- Equipment (combat-intended armor/weapons), Clothing (casual/underlayers), Accessories (its own category), all as **Overview views/preset selectors**, not separate physical inventories.
- Compatible armor and clothing coexist on the body. Removing armor need not strip clothing; a saved combat loadout remembers intended items without physical duplication.
- New **Back** beside Neck and Shoulder; separate L./R. Ear, L./R. Eye; **L. Ring 1–5** and **R. Ring 1–5** as true saved positions.
- Accessories have Combat/Casual saved plans, changed only through an explicit accepted action. Browsing a view or plan does not equip it, consume time, alter resource modifiers or silently change the currently worn arrangement.
- Static coverage, layer fit, anatomical side, attachment compatibility, accessory accommodation and accessibility must be authored in the appropriate item/profile contract and validated by the shared owner. Do not use names or a blanket `acceptsAccessories` boolean to bypass a real collision.

Any old survey exact-17-key validator whose **current-format** caller still captures equipment must be migrated **as part of the same new-format schema/caller change** to a new versioned evidence contract, or replaced by equivalent new-format test/fixture expectations. Do not continue producing old 17-slot witnesses simply to placate the historical validator. Preserve accepted gameplay semantics (e.g. provenance, same-actor evidence, save replay, correct actions), but do not require historical witness bytes or hashes from discarded pre-cutover saves.

## 4. Atomic action and current-format persistence contract

Every ordinary gear Equip/Unequip and loadout apply must route through one authoritative atomic mutation; no UI helper independently edits `playerState.equipment` or merges gear into fungible stacks once the new owner is live. Validate item identity, actual location, legal slot/layer/coverage, stale selection, ownership, displaced items, capacity and permission before writing. Failed/no-op requests do not move items or change unrelated state. Accepted events are replay/idempotency safe; save/restart restores exact gear and location, not a reconstructed item-type stash.

The future one-watch Equip action applies an entire eligible selected configuration and advances **six current ticks** exactly once through the correct time/body/world owner. Reject during active combat and modeled inability states such as unconsciousness, captivity or swimming; ability exceptions must be explicit owner-authored permissions. The action's state-transition timing and interruption semantics need a dedicated accepted contract; it is not part of merely viewing a loadout category.

Keep the compact 50%-larger item frames, narrowed three-digit attribute tiles and no unnecessary slot clutter. Expose contextual action availability from owner-backed state, not UI optimism.

## 5. Related deferred consumers: integrate authority, not implementation

The replacement item-instance contract should be extensible for:

- [Inventory stack and instance identity](inventory-stack-and-item-instance-identity-audit.md): dynamic condition, stack splitting, exact movement and idempotent location receipts.
- [Static item/equipment/container authority](item-equipment-inventory-authority-boundary-decision.md) and [Weapon/Armor Profiles](weapon-and-armor-profile-schema-decision.md): canonical item metadata, layer/coverage capability and later container templates remain separate from mutable instance contents.
- [Contextual action surfaces](contextual-action-surfaces-inventory-crafting-and-trade-decision.md): the UI asks the owner which actions are legal.
- [Future system design ledger](future-system-design-ledger.md): material purpose-fit, attachment/mounting, item workmanship and provenance are future candidate properties of **the same** instances.
- [Crafting authority](crafting-authority-boundary-decision.md): per-output craftsmanship and stable NPC smith skill can later mint unique differentiated items but are not a prerequisite for the current wearable UI.
- [Heirloom/bequest plan](heirloom-and-bequest-systems-plan.md): heirs/estate may later reference same instance IDs without assuming gear transfer exists today. The account estate currently archives only eligible fungible commodity/consumable items.

Do not implement workbench recipes, NPC artisan quality distributions, mixed-item nested storage, magical wearables or inheritance merely to complete the equipment base owner.

## 6. Replaced test gates and work package

| Earlier legacy-save gate | Current owner-approved replacement |
| --- | --- |
| Recover identical old bows and their item-type stash flags | New-format two bow instances with differing durability survive equip/unequip/Save/restart without ever merging |
| Convert v0.6.0 and old 17-slot equipment in place | New current-format campaign starts with native sided/layered owner; obsolete format is rejected with honest new-campaign guidance |
| Keep old Ashen Reef 17-slot source bytes and hash valid | New current-format survey has a deliberately versioned compatible provenance/witness contract; current-format capture/replay validated |
| Source-version conversion receipts and arbitrary legacy ID minting | Newly created instance IDs and mutation receipts stable across current-format save, transfer and retry |
| Save 300 rations and migrate historical bags into instances | New inventory may hold stacks of 300 rations alongside identity-bearing gear; neither becomes the other's authority |
| Preserve old combat hooks after conversion from historical gear | Exercise starter/new-gear hooks and resource effects against current gameplay rules; no phantom duplicate/inactive-preset effects |
| Permanent old-save repair/quarantine operation | Current-format malformed/partial writes have reachable recovery; obsolete pre-cutover test saves can be started over without lossless migration |

**Implementation package:** use an isolated Codex branch and replace the old gear/save representation and its current production callers as one coherent, testable **fresh-format cutover**. Version the new format intentionally and test actual new-game → Equip/Unequip → Save/restart → combat/resources/survey/quest/creator paths. Apply new slot/coverage/profile work only as required by this immediate owner feature. If an independent source/schema prerequisite blocks completion, record the precise blocker and focus on that owner, **not** additional obsolete-save probes. Keep the current production preview unchanged until the new code and selected acceptance are authorized.

## 7. Superseded requirements and implementation state

The Stage 1 and 2 legacy equipment probes are **valid historical diagnostics of the obsolete shape** but are **no longer release/activation gates**. Similarly, PR #18's old-save recovery tests are archival suggestions, not required work. Their nonlegacy insights (item conservation, physical ownership, full caller-path checks, fungible-vs-gear boundary, effective-worn parity, publication safety) remain applicable.

Current `master` still contains the 17-slot runtime and the old save-manager paths. This document is a *product-direction and design-authorization* correction only; no code, format, profile, new slot, action, SaveManager or Site deployment has yet changed. The installed `docs/dev/current-codex-prompt.md` on `master` still contains superseded old-save migration instructions until a reviewed prompt replacement is integrated. A Codex run must not follow those obsolete instructions over this explicit owner decision.
