# Character Equipment: Fresh-Format Item Instance And Layered Equipment Foundation

Date/route: 2026-10-26, owner-directed fresh-format equipment cutover, unversioned implementation package. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, no game-version bump. Prior Character UI readiness and `DEV-0.7.2.13` combat execution remain deferred.

## Binding policy correction

The owner has expressly confirmed Lineage: Reforged is **not in live play** and does **not** require backward compatibility for old development saves. Read [the 2026-10-26 clean equipment save epoch decision](../design/development-only-equipment-fresh-save-epoch-and-instance-owner-decision-2026-10-26.md) and [the already accepted development-only persistence reset policy](../design/development-only-clean-persistence-epoch-route-decision.md).

**Do not spend this implementation repairing, importing, quarantining, translating or retaining old pre-cutover 17-key equipment saves, legacy v0.6.0 envelopes, old item-type stash flags, prior survey witness hashes or the former left-side migration proposals.** The Stage 1/2 legacy migration probes remain source evidence about defects only, not active gates. PR #17 and PR #18 are optional design/source-audit references where they are not superseded.

The replacement format may make obsolete development characters/saves incompatible. It **must** fully validate and durably preserve the new-format character, campaign/Chronicle history, item identity, resources, accepted action receipts, and Save/restart. Never silently relabel an old schema or fabricate a character from an incompatible record. An origin-scoped development reset requires explicit user approval and is **not** authorized by this coding prompt.

## Mission

From an authenticated, synchronized `master`, build the smallest complete **fresh-format** authoritative non-fungible equipment/item-location foundation in an **isolated implementation branch**, protecting `master` until review.

First inspect all real callers and accepted owners: `docs/design/item-equipment-inventory-authority-boundary-decision.md`, `inventory-stack-and-item-instance-identity-audit.md`, `character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md` with supersession header, `weapon-and-armor-profile-schema-decision.md`, `contextual-action-surfaces-inventory-crafting-and-trade-decision.md`, current saved-target publication/IndexedDB, Character Equip/Unequip/Use, new campaign and starter grants, quest cargo, combat hooks, resource modifiers, player-engine deltas, UI projections, survey capture, and account estate eligibility. The current item catalogue has many commodity/consumable stacks and some equip-capable tools; author explicit non-fungible selection rather than converting all items or guessing by item name.

Implement one stable gear-instance ID and one physical location per instance (worn, bag, overflow, or explicitly scoped other). Preserve per-instance durability/condition, identity through actions, source count, bag capacity and any displaced-item movement. Keep ordinary commodity/consumable/quest quantities fungible. Eliminate old item-type durability stash as an independent gear owner. An inactive future preset will reference IDs and may not apply combat/resource effects.

Define the native new-equipment data/slot shape **without old-save conversion**. Plan for simultaneous compatible clothing under combat armor, Equipment/Casual/Accessories Overview views, Back, L/R Ear, L/R Eye, L/R Ring 1–5, and Combat/Casual accessory plans. Real placements and fit need an authored compatibility owner; if content coverage is not ready, scope a truthful supported initial fit subset instead of guessed item-name compatibility. All source code that grants/changes non-fungible gear must use the single new owner after activation. Current combat/resources/player-engine/UI/survey writers should consume one effective *actually worn* projection. New survey capture may use a new versioned contract; do not force it through the old exact-17-key witness.

For Save: explicitly version or isolate the new equipment format. Reconcile `TARGET_SNAPSHOT_FORMAT = lineage.save_snapshot.v2`, saved envelope `snapshotFormatId`, `saveManager.ts`, `campaignIndexedDbStore.ts` and current campaign publication/recovery. Decide the proper new format/schema boundary through source evidence. Preserve **new-format** source identity, session/continuity, accepted history, replay/rollback, retry and corruption behavior. Obsolete development saves should be rejected with truthful "incompatible, start a new campaign" guidance rather than imported, made up, or silently erased.

## Required proofs

- Start a **new-format** campaign with real equipped and carried gear, Save/restart, and confirm exact stable instance identity, quantity, durability and location after changing equipment.
- Two physically distinct same-type wearables with **different durability**, including sort, Equip/Unequip, occupied slot displacement, full bag/overflow and restart. No merge, duplication, orphaning, provenance swap, or ghost flag.
- Bulk fungible stacks (e.g. 300 rations) coexist with one wearable without per-item instance explosion or old 256-row diagnostic blocking.
- Selected UI actions stale/repeated/invalid requests do not mutate or create extra copies; any accepted action persists atomically.
- Resource modifier maxima/ticks, combat action grants/weapon provenance and player-engine counts reflect **current worn** items only, with no ghost bonus from bag/inactive plan.
- New-game starter and legacy preparation content grants remain legal for fresh characters; quest Rivet cargo still adds/removes stacks. Do not extend estate's commodity/consumable rules to individualized gear without separate authority.
- Current-format Save readback, browser restart where authorized, interrupted/stale publication, malformed instance graph rejection, correct new survey capture/replay, and explicit **rejection** (not migration) of obsolete format.
- Node UI tests, focused unit/equipment/combat/resource/quest/persistence/survey tests, Node typecheck, Vite build, broad TypeScript diagnostics compared with exact clean baseline, and `git diff --check`; name actual vs inferred/held selected-client evidence.

Add failing owner/caller regression tests before implementation and keep each intermediate commit coherent. If a **new-format** ownership/content/save dependency genuinely prevents safe activation, document the narrow blocker and next accepted owner slice; do not return to repeated old-save migration audits or create a second live equipment ledger.

## Deferred in this execution

Do **not** rush functional Overview view cycling, accessory Combat/Casual apply, full clothing layering, nested container/backpack UI, one-watch/six-tick Equip command or temporary inability/ability exceptions ahead of item/Save/fit owners. Do not implement full item-quality/crafting, persistent NPC artisan distributions, heirloom transfer, broad combat rebalancing or unrelated nutrition. Preserve current non-mutating Character presentation and version label.

Update the focused design/decision, exact current Codex output/handoff, branch-disposition register and **next** prompt. Commit/push verified work on the isolated branch, report exact head and test evidence, and request appropriate review before any master merge/deployment. Do not merge/close/retarget draft PRs #5–#18, touch protected refs, adjust `DEV-0.7.2.13`, change Game version or deploy a Site version.
