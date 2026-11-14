# Non-Fungible Gear Cutover: Caller, Classification, And Projection Audit

Date: 2026-10-26
Status: `CONNECTOR_SOURCE_AUDIT; NON_MUTATING; CUTOVER_NOT_ACCEPTED`
Inspected source: `master` at `a596112acf3945f2bf7c625e943f2511d12aa710`
Development effect: none; Game `0.1.1-prealpha`, parked `DEV-0.7.2.13`, and the installed owner-first Codex route remain unchanged.
Scope: connector-safe preparation for [Stage 2 location gate](character-durable-item-location-stage-2-decision-2026-10-26.md) and [current Codex cutover prompt](../dev/current-codex-prompt.md).
This audit is evidence, not a new decision, source edit, save schema, runtime API or authorization to change gameplay.

## 1. Result

**The next code package has one indivisible mutation requirement:** non-fungible worn and carried gear cannot acquire a durable identity through a second persisted ledger while `CharacterPanel` still mutates legacy `EquipmentState` and fungible inventory stacks. The actual Equip/Unequip selection, current gear locations, placement displacement, resource recomputation, combat item projection, UI inspection, and load/save must switch coherently or remain on the old implementation until independently accepted.

At the same time, this is **not a whole-inventory reimplementation**. Quest Rivet cargo and ordinary commodities/consumables still depend on stack-based addition/removal, and the existing account-estate owner currently expressly accepts only commodity and consumable catalog classes. Do not broaden either merely because a new gear ledger exists.

The new `auditLegacyItemLocations` enumerates all bag/overflow counts and hard-blocks a total over 256 preview units. This is valid for a bounded **inactive source diagnostic**, but not a final gate for equipment alone: 257 ordinary rations alongside a single unambiguous equipped knife should not be mistaken for 257 unique wearable instances. Conversely, excluding an item solely because its display category says `tool` may lose a usable weapon tool. Establish a complete source-grounded non-fungible eligibility rule before conversion.

## 2. Exact current contracts

| Existing authority | Observed contract | Relevant consequence |
| --- | --- | --- |
| `packages/shared/types/src/contracts.ts` | `EquipmentState` = 17 keys each `EquippedItemRef | null`; refs have itemId/itemKey/quantity/optional durability and resource modifiers. `InventoryStack` = itemId/itemKey/quantity; bag and overflow arrays. | No permanent item instance ID or per-copy carried condition. The old map cannot itself represent layered/sided positions. |
| `packages/content/base/items/items.json` | 1,372 records by `itemClass`: commodity **1,114**, consumable **26**, tool **131**, vehicle **10**, weapon **35**, armor **18**, clothing **14**, accessory **24**. | A broad family can guide first candidate coverage but is not a complete per-instance policy. Some tools can be equipped and many commodities remain fungible. |
| `packages/content/base/player/equipment_slots.json` | 17 broad slot definitions; Ear/Fingers metadata each allows two items, but the saved map has one nullable ref per key. | Do not equate slot-definition maximum, equipped-ref quantity and actual physical item count. |
| `apps/rpg-ui/src/game-shell/equipmentSlotEligibility.ts` | Established exceptions and category/use-profile heuristics choose a **single** current slot. | Not an accepted layer/fit/sided compatibility authority; don't silently use it to mint right-ear/ring/back placements. |
| `packages/engines/game-engine/src/equipment-migration-plan.ts` | Read-only, `activation: not_authorized`, 17-key left-first proposal; source copy retained. Proposed ID includes capture tick. | Proposed identities cannot become durable keys. |
| `packages/engines/game-engine/src/legacy-item-location-audit.ts` | Read-only and `activation: not_authorized`; all equipped, bag and overflow counts enumerated; blocks `ui.character.item-stash.` flag presence, count/shape ambiguity. | Convert to a gear-scoped and recoverable admission contract, not unconditional rejection of ordinary bulk cargo or permanent legacy-save lockout. |

The static `itemClass` counts are an inspection snapshot, not a future permanent schema count. A policy deciding whether a family member is non-fungible must reconcile use profiles, condition, repair and intended storage/attachment; **not** English item names, substring guessing or market value.

## 3. Mutation and creator source map

| Exact production path | Current behavior | Required cutover posture |
| --- | --- | --- |
| `apps/rpg-ui/src/features/CharacterPanel.tsx` → `characterPanelState.ts: equipInventoryItem` | Validates bag/overflow list selection, decrements one quantity, restores item-type stash, writes equipped ref, stashes displaced item, recomputes runtime resources. | Replace gear path with one authoritative instance/location transaction; preserve stale-selection behavior and bag/overflow action reachability, including displacement. |
| `CharacterPanel.tsx` → `characterPanelState.ts: unequipItem` | Creates inventory stack, merges same itemId/itemKey, clears worn slot and stashes metadata keyed by item type. | Must stop flattening gear identity/condition. Add caller-level exact-item selection, no duplication, overflow safety, and restart tests. |
| `CharacterPanel.tsx` → `characterPanelState.ts: consumeInventoryItem` | Decrements selected inventory stack and applies consumable/body effects. | Keep fungible consumption behavior working; explicitly reject or route consumable gear only if a supported item definition requires it. |
| `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` | Creates starter `equipment` and `inventory`, invokes `applyLegacyPreparationBonuses` then resolves starter resources. | New campaign initializer must create stable gear identity and effective-worn projection in the same accepted save version; preserve starter quantities/effects and no double grants. |
| `apps/rpg-ui/src/game-shell/legacyPreparationApplication.ts` | Reads equipped/bag/overflow item keys for dedupe, appends granted stacks, stores some unlock modifiers separately. | Reconcile initial gear grants and deduplication without changing accepted Legacy reward semantics or duplicating instances. |
| `apps/rpg-ui/src/game-shell/gameplayLoop.ts` | Quest Rivet cargo adds/removes `deepiron_rivet_crate` quantities through bag/overflow helpers. | Leave established fungible cargo owner intact; include explicit coexistence fixture with migrated gear. |
| Other item-producing consumers | Not exhaustively proved by this connector audit; further runtime callers and generated/quest rewards may be dormant or specialized. | Require Codex's authenticated whole-repo inventory, including tests, creator, combat rewards and new callers, before declaring the mutation graph closed. |

**Specific historical data-loss path:** `stashItem()` clears earlier `ui.character.item-stash.<itemId>` flags for the same item type. `restoreStashedItem()` later chooses a flag by item ID, not by physical copy. `addStackToInventory()` merges identical itemId/itemKey records. The Stage 2 actual-caller test proves a durability association can become unrecoverable. Do not fabricate identity from stash flags or copy one scalar durability across merged copies.

## 4. Reader, history and lifecycle source map

| Exact reader/owner | Current read | Required evidence / boundary |
| --- | --- | --- |
| `packages/engines/game-engine/src/combat/index.ts` | `buildPlayerHooks` traverses all values of `playerState.equipment`; combatant main/offhand read weapon slots, and `armorItemIds` currently aggregates equipped itemIds. | Define one projection of **effective physically worn** items, with same hooks/action legality for unchanged legacy gear; never activate gear present only in saved presets or inventory. |
| `packages/shared/types/src/player-resources.ts` | `collectActiveModifiers` gathers effects from `Object.values(state.equipment)`. | Use same effective-worn projection; verify maxima, current-value clamping, tick modifiers and removal/restoration exactly once. |
| `packages/engines/player-engine/src/index.ts` | Counts equipped refs, durability alerts and equipment modifier counts; counts carried inventory quantities separately. | Migrate delta/telemetry read so saved presets and independently indexed instances aren't double-counted. |
| `apps/rpg-ui/src/runtime/uiViewModel.ts` | Lists equipped refs and bag/overflow stacks, occupied slots, item quantities and capacity; builds cross-screen UI projections. | Preserve owner-backed row identities, sorted/filtered selection, accessibility and honest capacity; do not show inactive preset as equipped. |
| `packages/engines/game-engine/src/player-survey-activity-advancement.ts` → `campaign-rules.ts` | Captures equipment in survey owner inputs; the historical validator requires exactly **17** equipment keys. | Freeze old witnesses/fingerprints; only new capture through an explicitly versioned, tested compatibility adapter. |
| `packages/engines/game-engine/src/account-estate.ts` | `SAFE_ITEM_CLASSES` explicitly contains only `commodity` and `consumable`; current deposit folds bag/overflow eligible stacks by itemId, not equipped gear. | This is a **downstream policy boundary**, not evidence that gear is already estate-transferable. Do not automatically add individualized gear to estate/death/heirloom assets in the cutover; document any future owner handoff separately. |

Other provenance and lifecycle consumers may exist. The implementation must repeat the search for `playerState.equipment`, `inventory.bags`, `inventory.overflow`, `EquippedItemRef`, `InventoryStack`, gear rewards and serialized histories at the exact implementation head. File search results alone are not proof of mutation closure.

## 5. Save and historical compatibility correction

It is inaccurate to describe the entire save system as `0.6.0` format.

- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` creates current target snapshots as **`lineage.save_snapshot.v2`**.
- `apps/rpg-ui/src/game-shell/saveManager.ts` compares current target-envelope snapshots to `CURRENT_SNAPSHOT_VERSION = TARGET_SNAPSHOT_FORMAT`; separate **`0.6.0`** comparisons apply to legacy envelopes/readback.
- `apps/rpg-ui/src/game-shell/campaignIndexedDbStore.ts` validates `snapshot.snapshotVersion === envelope.snapshotFormatId` and target campaign/character/continuity IDs.
- `packages/shared/persistence/src/index.ts` uses direct JSON parse/stringify and does **not itself execute a gear migration**.
- `packages/engines/game-engine/src/campaign-rules.ts` still has a separate exact-17-key historical survey witness validator.

Future owner cutover must address **target-v2 admission, historical legacy-v0.6.0 migration, artifact identity/format matching, campaign continuity, historical witness preservation and retry/publication state** independently. Never change a displayed version string to make a new shape pass a validator, or rewrite historical evidence in place.

## 6. Minimal safe output contract for the next Codex slice

Before changing persisted state, require documented and tested answers to:

1. Which catalog/profile-defined gear receives unique identity now, and which tool/other items stay fungible? What happens when the same itemKey has mixed physical copies?
2. Who owns the stable instance ID, physical location, quantity, per-copy condition and attachment relationship? How do carry capacity and bag/overflow indexing coexist?
3. Can Equip, Unequip, creator grants and future acquisition still write any old gear shape independently? If yes, the cutover is incomplete.
4. How are old stash flags retained as evidence while preserving a playable/recoverable campaign without assigning unknown durability to a chosen bow?
5. Which typed effective-worn projection is consumed by combat, resources, player-engine counters, UI and historical witness adapters?
6. What is the exact rollback/idempotency contract across current target-v2 saves, old-v0.6.0 envelopes, IndexedDB artifacts and campaign revision? Is retry safe?
7. Which precise tests prove existing equipment action, inventory quantity and reward behavior at ordinary caller paths, not just a standalone resolver?

Related independent fixture matrix: [Non-Fungible Gear Migration Recovery And Regression Packet](nonfungible-gear-cutover-recovery-and-regression-packet-2026-10-26.md).

No runtime, balance, schema, save, UI, deployed Site, current prompt or Game version is modified by this audit.
