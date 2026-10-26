# Character Layered Loadouts — Connector Owner/Save Follow-Up Audit

Date: 2026-10-26
Status: `CONNECTOR_AUDIT_COMPLETE; DESIGN_AND_IMPLEMENTATION_UNACCEPTED`
Route class: unversioned read-only source audit plus documentation on isolated draft PR #17
Inspected default-head SHA: `cf8eb7a8d1e4a3acf389b5f02ed036047fc58737`
Scope: refine the next independent Codex implementation checkpoint; do not create executable authority through this document.
Version impact: none. Preserve Game `0.1.1-prealpha`, parked `DEV-0.7.2.13`, and unaccepted selected Character/Save gates.

## 1. Current first-pass disposition

The user requested Overview view cycling Equipment → Casual (Clothing) → Accessories → Equipment, with a separately displayed Combat/Casual accessory selector **only** when Accessories is visible; a context-sensitive Equip action; simultaneous physically compatible clothing under armor; authored coverage/layer rules; a one-watch successful apply; blocked unsafe state; real Back, left/right Ear/Eye, and L/R Ring 1–5 positions; borderless and 50%-larger item frames; and narrower three-digit stat blocks.

Codex first pass published the independent presentation subset to current `master`, including `apps/rpg-ui/src/features/character-sheet.css` and `apps/rpg-ui/tests/character-overview-render.test.mjs`, and created [the controlling loadout preflight](character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md). The final main source SHA `cf8eb7a8d1e4a3acf389b5f02ed036047fc58737` includes the earlier recorded UI checkpoint `3c9a71e2d5722101ee45be8b5b1d7e0753cc5c4a`; those are successive source identities, not contradicting claims. Preview Site v16 was reported by Codex, but this connector pass did not authenticate to the private preview or independently prove selected gameplay and Save/restart.

GitHub comparison from the inspected preflight base `18260c6a5a64eeb918f000cef57e0a0d23eaf768` to current main shows CSS, the render test, and routing/design/handoff files, **not** live loadout state/slot/command implementations. Leave the current 17 owner-backed Overview positions until owner-side persistence and mutation are accepted.

## 2. Critical source facts and unresolved seams

- `packages/shared/types/src/contracts.ts`: `EquipmentSlotId` contains 17 broad ids, `EquipmentState` maps one `EquippedItemRef | null` per id, and `EquippedItemRef` contains `itemId`, `itemKey`, quantity and optional durability/modifiers **but no unique instance id**. Bags/overflow remain fungible `InventoryStack` quantities.
- `packages/content/base/player/equipment_slots.json`: Ear declares `maxItems: 2`, Fingers declares `maxItems: 2`, Arm and Ankle also declare `maxItems: 2`; the live equipment map still stores a *single ref per key*. Do not assume old unsided Ear/Fingers means exactly one object or silently discard a stack quantity of two. Distinguish slot-catalog capacity metadata from actual persisted map cardinality and item quantity. Audit whether other `maxItems` values have active consumers.
- `apps/rpg-ui/src/game-shell/equipmentSlotEligibility.ts`: supports established item exceptions and broad heuristics (e.g., chest clothing, right-hand weapons), not sided fit, layer interaction, real anatomy or back mount. Do not rebrand these heuristics as static compatibility authority.
- `apps/rpg-ui/src/features/characterPanelState.ts`: equip/unequip moves unit quantities between bag/overflow and equipped refs, relies on `ui.character.item-stash.` session flags for equipped metadata, and reconstructs resource state. Do not persist individual gear, presets, containers or item-slot identity in these UI flags; prevent parallel mutation entrypoints once an authoritative command is introduced.
- `packages/engines/game-engine/src/combat/index.ts`: `buildPlayerHooks` reads `Object.values(playerState.equipment)`; player combatant projection sets `mainHandItemId`/`offHandItemId` from specific weapon slots and flattens all equipped refs into armor IDs. `packages/shared/types/src/player-resources.ts` aggregates resource modifiers from `Object.values(state.equipment)`; `packages/engines/player-engine/src/index.ts` counts those equipped refs. All must consume one effective **physically worn** projection, not unactivated preset contents and not duplicated clothing/armor references.
- `packages/engines/game-engine/src/campaign-rules.ts` checks `SURVEY_EQUIPMENT_SLOTS` with **exact 17-key records** for historical survey facts; replacing them in-place with expanded live slots would invalidate historical witnesses. Keep historical serialized evidence/fingerprints immutable, with version-aware live projection/readers.
- `apps/rpg-ui/src/game-shell/saveManager.ts` uses snapshot version `0.6.0` in admissions/readbacks; the schema/version decision must be explicit and preserve old campaign records, not simply bump a string.
- `packages/shared/time/src/index.ts` uses six ticks per subday watch. Current activity/travel/quest paths advance more than just clock tick: body, resources, attribute load and synchronized snapshot/world projections may be affected. Equip apply cannot call `advanceClock` in isolation.
- `gameState.activeEncounter` provides a real active-combat guard; general swimming/captivity/unconsciousness/equipment-change-ability state is not yet a reliable owner. Do not fabricate these flags or claim full prohibition/ability handling.

## 3. Model clarifications: views, plans, and worn reality

The Overview main cycle selects **which category is inspected or planned**: `Equipment` (combat-intended protective/weapon set), `Casual/Clothing` (underlayers/noncombat set), or `Accessories` (accessory family). This is not an exclusive physical state toggle. The Accessories-only Combat/Casual selector chooses between **two accessory preset plans**; it is not a second way to mutate the wardrobe. Browsing any view/preset is read-only and must never equip, unequip, spend ticks, reroll a fit check, mutate resources or change physical inventory. A preview of a proposed state must not be shown as active equipment.

Actual worn state can include compatible armor **and** clothing simultaneously, with accessories selected from the actually applied accessory arrangement. Saving an equipment/clothing/accessory configuration **does not** assert it is currently worn. Removing combat armor may leave underlayers in place and preserve a combat loadout for later reapplication.

The user's word `Equip` means **apply the selected eligible target configuration**, with an adjacent context-aware action label/state. The design must name precisely whether an Equipment or Casual apply changes only its intended layer or composes a complete target effective outfit. It must define the expected handling of weapons, underlayers, accessories, partial/no-op changes, unavailable saved items, existing attachments and displacement before implementing. Do not silently unequip compatible clothing when equipping armor, or silently apply a different accessory preset because a category is hidden.

**Recommended resolution for owner design (requires validation before implementation):** separate `currentlyWorn` or a canonical physical item-location graph, `presets` as instance-id references, `selectedOverviewCategory` and `selectedAccessoryPreset` as view/planning preferences; present UI never owns physically wearing an item. A real item may be *referenced* by multiple presets but has exactly one physical location at a time. A saved item that has been sold, lost, damaged, destroyed, transferred or otherwise made ineligible must be identified as unavailable, never conjured or silently substituted.

## 4. Slot migration and cardinality traps

The new Back, separate left/right Ear and Eye and ten Ring slots add physical placement decisions, not just UI labels. Relative to the existing 17 broad slot ids, the user requests 1 added Back, 1 added Ear, 1 added Eye and 9 added Ring positions, but **do not declare a final 29-slot schema** until the combat/clothing layers and other category positions are reconciled.

The preflight's first-left-position target for old unsided Ear/Eye/Fingers should be treated as the deterministic **single-item default**, with conservation rules for actual `quantity > 1` and collisions. If multiple physical copies are encoded under one legacy ref, split deterministically when provenance permits and assign sequential legal target positions or preserve excess as independently identified inventory/overflow with a migration receipt. If classification/quantity/material identity is ambiguous, fail closed and retain recoverable source evidence, not silent data destruction. Never claim old ring placement maps to a particular finger without newly accepted rules.

Preserve old survey witness payload and hash; migrate current player state through a versioned, idempotent boundary. An unchanged legacy live equipment item must retain itemKey/quantity/durability/resource effects and legal combat capabilities through repeated load/save, and must not appear as both a worn instance and a separate inventory instance. Provenance and live migrated-save marker must distinguish converted data from original history.

## 5. One-watch command and time/condition invariants

An accepted apply of a **whole chosen configuration** should cost one watch (six current ticks), not six ticks per changed slot. Switching read-only views, selecting a different accessory target or merely saving a preset costs no watch. An unaccepted, stale, blocked, invalid, conflict, duplicate or unavailable-item apply costs **zero** ticks, body advancement, stat/resource changes or inventory movements. A true no-op apply should be detected and return a no-op outcome without time cost unless an explicit later product decision chooses otherwise.

One authoritative owner resolves the full intended target first: actor/character and campaign address, stable request identity and expected state revision/fingerprint; current physical item locations and preset references; compatibility with already worn layers, sided anatomy, material/mount rules and storage capacity; condition/combat/permissions; displacement destinations and burden; any resource/perk implications. Only after all checks pass may one atomic mutation take place. Repeat of the *same accepted request* must return the recorded outcome, not apply or charge another watch. Concurrent stale requests fail before side effects.

The operator must explicitly decide when items take effect during the six-tick interval (start/end), how current resource maxima are reconciled, whether normal time-dependent hazards and body/rest/calendar/world updates occur, and what happens if an interruption occurs; absence of that contract is a hold, not a reason to implement a clock-only patch. Rejected requests do not pass through a mutating clock/body path.

Combat, incapacitation, swimming, restraint/captivity and ability exceptions must use **actual owner-backed state**. Viewing/inspecting a gear preset need not be prohibited just because applying it is. A future equipment-change-in-combat ability must be explicit and bounded; do not create a generic exception from an item name or UI label. The selected Character action must expose a truthful reason when prohibited and remain keyboard accessible.

## 6. Tests and execution gates for the next Codex slice

**Before code:** independently inspect live main, active prompt/branch/pr lifecycle, selected SaveSnapshot and item owners, and all relevant history/readers; write an explicit migration/transaction contract. Reconcile with [accepted item authority](item-equipment-inventory-authority-boundary-decision.md), [item instance identity audit](inventory-stack-and-item-instance-identity-audit.md), [equipment profile posture](weapon-and-armor-profile-schema-decision.md), [the 2026-10-26 live preflight](character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md), and [the 2026-10-25 cross-system deferred intent](character-capability-equipment-storage-and-artisan-quality-deferred-intent-2026-10-25.md). PR #17 is draft design evidence, not merged runtime authority.

**First bounded implementation candidate:** smallest independently testable durable wearable instance/id and versioned legacy-to-live conversion boundary, *provided it can be introduced without prematurely expanding UI/combat schema and without invalidating historical survey evidence*. If complete safety requires another owner first, deliver a decision-complete contract and tests/probes rather than a half-working UI toggle.

| Scenario | Required proof |
| --- | --- |
| Old 17-slot campaign with durable completion witness | Legacy witness verifies byte/logical semantics; live equipment migrates idempotently |
| Old Ear/Fingers with quantity 2 or ambiguous shape | No disappearing second object, duplicate instance, accidental ring assignment or silent overflow loss |
| Old equipped durability/modifier | Exact original value retained after unequip, re-equip and Save/restart |
| Unchanged worn items | No resource/combat modifier gain/loss or double application after new projection |
| Armor over compatible clothing | Both are physically worn; removing armor does not remove clothing or forget saved outfit |
| Circlet/earrings vs enclosing helmet | True authored fit/accessibility/blocked outcome; no name guessing |
| Preset references a sold/stolen/destroyed item | Fail with stable reason; never spawn a replacement |
| Same instance listed in two saved presets | Only one physical location; selecting plans is read-only |
| Simultaneous valid and invalid target entries | Whole apply rejected with no partial mutations or tick costs |
| Rejected combat/incapacitated apply | Owner-level refusal, zero time and zero side effects |
| Accepted apply and immediate retry | Exactly one successful six-tick charge, stable outcome on retry |
| Save/restart after accepted apply | Worn state, preset targets, item locations, timer, condition and provenance preserved |
| Selected Overview flow at normal/mobile zoom | Correct cycling and accessory-only selector, truthful Equip availability, keyboard access and Save/restart |

Do not promise selected-client acceptance from SSR/unit tests or unauthenticated login preview. Use existing failure patterns for real caller tests, idempotency, recovery, saved history, independent acceptance and transparent source/deployment identities.

## 7. Connector disposition and next code owner

This is a source-grounded **documentation-only follow-up pass** on retained draft PR #17. No code, schema, game-version, player Save, item art, live slot, UI control, active development prompt or branch integration changed. The current installed Codex prompt on `master` remains the owner-first staged migration route. A repository-capable Codex session must review this addendum against the latest source before choosing its bounded code edit, and must record any accepted disagreement in the focused preflight rather than assuming this audit unilaterally changes authority.

Next connector review trigger: Codex owner/snapshot migration output and exact diff, before the later one-watch command and UI activation passes.
