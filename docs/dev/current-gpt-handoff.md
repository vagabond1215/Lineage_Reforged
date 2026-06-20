# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.209 - Item Equipment Inventory Authority Boundary Decision`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered run is documentation-only after a successful origin fetch and fast-forward pull check.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/item-equipment-inventory-authority-boundary-decision.md` is the permanent authority for item identity, consumables, future weapon/armor/container/loot profiles, currency/value references, integrations, and runtime item-state boundaries.
- `docs/dev/tmp-item-equipment-inventory-systems-research-2026-06-20.md` is temporary planning input, not design canon and not a complete combat report.
- Existing `items.items` retains canonical static item identity; `items.consumable_profiles` retains separate consumable descriptors.
- Existing item `useProfiles` and magic metadata remain current owners until a dedicated profile schema decision resolves any split.
- Currency systems and market values remain economy-owned; player inventory/equipment/container/wallet/item-instance state remains runtime/save-owned.
- Reward, NPC/vendor, crafting, magic, combat, and encounter references do not create, grant, consume, equip, transfer, or mutate items.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.209 - Item Equipment Inventory Authority Boundary Decision`

Immediate next numbered Codex run:

- `Version 0.5.210 - Weapon And Armor Profile Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.209 Result

- Preserved `items.items` as canonical static item identity.
- Preserved separate `items.consumable_profiles` linked through `consumableProfileId`.
- Selected separate future weapon and armor profile authorities, subject to reconciliation with current embedded `useProfiles`.
- Selected separate future container templates and item-owned general loot tables.
- Kept the existing currency system and market values economy-owned; preserved current `itemKey` references.
- Kept authored reward envelopes, NPC gear, vendor stock, magic metadata, crafting references, and combat/encounter drops non-mutating.
- Preserved runtime inventory bags/stacks/overflow, equipment refs/slots, quantities, durability, and wallet owners.
- Required new first-pass item/profile/template/table records to reject runtime, gameplay, inventory, ownership, durability, payout, player-state, storage, and UI fields.
- Recorded that the source artifact was item/inventory-focused and does not replace a later complete combat research pass.
- Changed no content, schema, validator, test, runtime, UI, storage, or gameplay behavior.

## Next Route Boundary

`Version 0.5.210 - Weapon And Armor Profile Schema Decision` should remain documentation-only. It must decide exact paths/wrappers/ids, item references, shared-vs-distinct fields, ownership against current embedded `useProfiles`, equipment-slot/combat-hook references, forbidden fields, validation ownership, and implementation order without creating schemas or content.

The temporary item research artifact should be deleted after that run if its remaining useful guidance has been promoted; otherwise the handoff must name its next concrete consumer and removal condition.

The displaced `Version 0.5.209 - Quest Objective And Condition Schema Decision`, unlanded `Version 0.5.207 - Person vs NPC Schema Decision`, `Version 0.5.205 - Magic Study Source Schema Decision`, and other deferred authority decisions remain valid later roadmap items. A complete dedicated combat Deep Research pass also remains recommended.
