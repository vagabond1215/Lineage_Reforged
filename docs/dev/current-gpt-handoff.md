# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.212 - Combat Authority Boundary Decision`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered run is documentation-only after a successful origin fetch and fast-forward pull check.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/combat-authority-boundary-decision.md` is the permanent authority for monster/enemy archetypes, encounter templates, spawn profiles, tactics defaults, damage-family posture, future statuses, injury/death/recovery, loot descriptors, cross-system references, and combat runtime-state separation.
- Existing `world.monsters`, `world.encounter_templates`, `world.spawn_profiles`, `game.combat_roles`, and `game.tactics_presets` remain canonical. Do not add parallel enemy, encounter, spawn, role, or tactics collections.
- Monster records are archetypes, encounter templates are possible compositions, spawn profiles are descriptive world selection envelopes, and tactics content contains defaults only.
- Keep damage family hook-derived unless a dedicated later decision establishes a canonical damage-type authority.
- No static status/condition authority is approved yet. Injuries, recovery, death, defeat, active statuses, combatants, encounter instances, loot rolls, rewards, consequences, and history remain runtime-owned.
- Existing monster drops/loot and quest rewards remain source-local descriptive envelopes pending a later loot decision.
- Combat content does not own NPC, faction, civic, law, social, reputation, quest, Chronicle, Knowledge, travel, hazard, economy, item, equipment, or spell mutation.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.212 - Combat Authority Boundary Decision`

Immediate next numbered Codex run:

- `Version 0.5.213 - Monster Record Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.212 Result

- Consumed `docs/dev/tmp-combat-encounter-systems-research-2026-06-20.md` as planning input and corrected it against the live checkout.
- Confirmed that `MonsterRecord` and `world.monsters` already own static enemy archetypes.
- Kept encounter templates and spawn profiles separate and world-owned.
- Confirmed stable `game.combat_roles` and `game.tactics_presets` content ownership.
- Kept damage family hook-derived and deferred static status/condition authority to a dedicated decision.
- Kept injury, recovery, death, defeat, encounter instances, combatants, current resources, actions, AI decisions, and active statuses runtime-owned.
- Preserved monster drops/loot and quest rewards as source-local descriptive envelopes.
- Kept NPC/faction/civic/law/social/reputation, quest/Chronicle/Knowledge, travel/hazard, item/equipment/spell, and economy consequences outside combat content.
- Changed no content, schema, validator, test, runtime, UI, storage, or gameplay behavior.

## Next Route Boundary

`Version 0.5.213 - Monster Record Schema Decision` should remain documentation-only. It must audit the existing strict monster schema rather than propose a parallel enemy-archetype collection; decide archetype-baseline naming, variant posture, role/action-package/item references, source-local loot posture, forbidden runtime fields, validation ownership, and any later implementation order without changing schemas or content.

The temporary combat research artifact should be deleted after that run if its remaining useful guidance has been promoted; otherwise the handoff must name its next concrete consumer and removal condition.

The unlanded `Version 0.5.210 - Weapon And Armor Profile Schema Decision`, displaced Quest Objective And Condition Schema Decision, `Version 0.5.207 - Person vs NPC Schema Decision`, and `Version 0.5.205 - Magic Study Source Schema Decision` remain valid deferred roadmap items.
