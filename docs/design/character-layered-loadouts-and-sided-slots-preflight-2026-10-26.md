# Character layered loadouts and sided equipment slots — implementation preflight

> **2026-10-26 supersession: obsolete-save migration is no longer required.** The owner has confirmed the project is not in live play and old development saves need no compatibility, recovery or conversion. [The clean equipment save decision](development-only-equipment-fresh-save-epoch-and-instance-owner-decision-2026-10-26.md) supersedes this historical preflight's demands for 17-slot legacy player-save migration, left-side old-slot conversion, `0.6.0` admission, and old Ashen Reef witness/hash retention. The new equipment system can start directly with native Back, sided Eye/Ear/Ring slots, layered clothing and real instance ownership. Current-format Save/restart, combat/resources/survey provenance and atomic transaction tests **remain mandatory**. Earlier historical wording below remains an account of the first preflight, not a current blocker.

Date: 2026-10-26
Status: `USER_DIRECTION_CAPTURED; OWNER_AND_SAVE_IMPLEMENTATION_PENDING`
Game-version impact: none

The [2026-10-26 historical migration probe](character-layered-equipment-migration-probe-decision-2026-10-26.md) is read-only and leaves this owner/save implementation gate open.

## Settled product direction

- Character Overview cycles through Equipment, Casual clothing, and Accessories. Clothing remains worn beneath armor when compatible; removing armor does not discard its saved configuration. The Accessories view alone exposes a Combat/Casual preset selector. The selected configuration is applied with an adjacent, context-aware **Equip** action, not merely by viewing it.
- Applying a saved configuration costs **one watch** (six current clock ticks) if accepted. A rejected or stale request costs no time. The action must be unavailable during active combat, unconsciousness, captivity, swimming, and any other owner-defined inability to change gear. A future explicit ability can relax a specific restriction; the UI must not infer such an ability.
- Add a Back position beside Neck and Shoulder. Ear and Eye positions are independently left/right. Ring positions are L. Ring 1–5 and R. Ring 1–5. Existing unsided Ear, Eyes, and Fingers equipment migrates to the corresponding first left position. These are requested as **real saved positions**, not decorative empty frames.
- Armor and clothing authoring needs explicit layer/coverage compatibility. A generic item-name heuristic or one universal `acceptsAccessories` flag is insufficient for fit, coverage, accessibility, and attachment.
- Overview slot buttons have no outer box; their bounded item-image frames are 50% larger. Attribute abbreviation and up-to-three-digit value use a two-character gap. This presentation-only subset is implemented independently of the pending owner changes.

## Current source boundary

`EquipmentState` is one 17-slot map in `packages/shared/types/src/contracts.ts`. `newGameSnapshot.ts` creates that map; `characterPanelState.ts` equips from bag or overflow and stashes equipped durability in session flags. The authored slot resolver returns one supported slot per item. `SaveSnapshot`, equipment-derived resources/combat hooks, creator start state, UI projections, and old saves all consume that shape. There is no saved preset, clothing layer, Back or sided slot, durable item-instance identity, layer-fit profile, or loadout-change command. `advanceClock` uses six ticks per watch, while existing time-consuming actions also advance body state and synchronize gameplay. `gameState.activeEncounter` is a current combat guard; swimming/captivity/ability permissions do not have a general equipment-change authority.

The historical Ashen Reef survey authority in `packages/engines/game-engine/src/campaign-rules.ts` also validates an **exact 17-key equipment record**. Existing survey witnesses can therefore carry the old shape even after a live-player migration. `apps/rpg-ui/src/game-shell/saveManager.ts` expects snapshot format `0.6.0` at several admission/readback gates. A new live equipment map cannot simply replace that format or its historical fingerprint without an explicit backward-compatible authority migration and replay proof.

Draft PR #17 (`connector/design-attribute-quality-equipment-2026-10-25`) records deferred physical fit and item identity boundaries. It expressly does not authorize a schema or runtime migration. This new user direction reopens that implementation decision, while the accepted item/equipment/inventory boundary still requires one owner for item location, durability, quantity, and compatibility.

## Required owner contract before UI activation

1. Define a versioned slot and save migration. Migrate each legacy unsided equipped ref once to the first left position; retain unknown or invalid old data safely. Preserve old historical survey witnesses and their fingerprints while allowing a newly shaped live record. Reconcile the existing `0.6.0` admission gates explicitly. Prove round-trip load and restart, plus resource and combat projection equivalence for unchanged equipment.
2. Give non-fungible wearables durable identity and one authoritative location across worn layers, saved presets, bags and overflow. A preset references owned items; it does not clone them or create a second physical location. Preserve quantity, durability and displaced-item behavior. Define the same-item-in-two-presets case explicitly.
3. Author coverage/layer/fit capabilities in the item/profile owner, including clothing-under-armor and any item-specific exclusion. Unknown compatibility must reject with a reason until authored; UI labels alone are not eligibility.
4. Define an atomic loadout-apply command with live state and stale-request validation, condition/combat/ability guards, item availability and fit validation, a one-watch clock/body/world advancement, and an accepted receipt. Failure leaves equipment, inventory, presets, clock and resources unchanged. A selected Overview button must call this owner.
5. Integrate the new effective worn set with resource, combat-item and save consumers. Add focused migration, conservation, stale/denied/accepted, occupied-slot, body-time, combat, accessibility and selected Save/restart tests before exposing the new toggles in gameplay.

The compact Overview must continue to show the current 17 real slots until these owner steps exist. The present CSS change does not claim loadouts, restriction handling, layered gear, new authored item flags, or expanded saved slots.
