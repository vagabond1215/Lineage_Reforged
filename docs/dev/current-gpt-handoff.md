# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.216 - Settlement Authority Boundary Decision`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered run is documentation-only after a successful origin fetch and fast-forward pull check.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/settlement-authority-boundary-decision.md` is the permanent authority for settlement identity, world/map anchors, future districts/sites, building/infrastructure/workplace references, services, property anchors, specialized spaces, travel anchors, and settlement runtime-state separation.
- Existing `world.settlements` is canonical and world-owned. It contains 88 strict live records and is not a future collection.
- Existing `civilization.buildings` are generic templates, `civilization.infrastructure` owns reusable infrastructure definitions, and `civilization.workplaces` owns production/workforce semantics. None are placed settlement structures.
- Districts are optional separate future records and deferred. A future `world.settlement_sites` layer may place important structures after a dedicated decision.
- Services remain descriptive tags/functions first. Housing/property anchors remain static and separate from ownership, inheritance, rent/tax, storage, and player housing state.
- Civic/guild/institution, religion/sacred-site, magic-study, Knowledge, economy/crafting, NPC/family, quest/event, and travel authorities remain separate and reference settlement/place ids.
- Static settlement-space content must not execute services, construction, property, markets/vendors, schedules, quests/events, Chronicle, travel/pathfinding, UI, or gameplay.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.216 - Settlement Authority Boundary Decision`

Immediate next numbered Codex run:

- `Version 0.5.217 - Settlement Identity Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.216 Result

- Consumed `docs/dev/tmp-settlement-space-systems-research-2026-06-20.md` as planning input and corrected its stale settlement-existence assumption against the live checkout.
- Preserved `world.settlements` as the canonical world-owned settlement identity authority.
- Kept region/locality/hex anchors semantic and pixel map references optional/display-oriented.
- Deferred optional districts as separate records rather than embedded required sections.
- Preserved generic building, infrastructure, and workplace owners; deferred placed `world.settlement_sites` to a later decision.
- Kept services descriptive and property/housing anchors separate from mutable ownership/storage/runtime state.
- Kept civic, guild, religion, sacred-site, magic-study, Knowledge, economy, crafting, NPC/family, quest/event, and travel authorities separate.
- Changed no content, schema, validator, test, runtime, UI, storage, or gameplay behavior.

## Next Route Boundary

`Version 0.5.217 - Settlement Identity Schema Decision` should remain documentation-only. It must audit the existing settlement schema; classify intrinsic identity/place fields versus current embedded population/economy/trade/infrastructure/guild descriptors; preserve region/locality/hex and parent/dependency coherence; define future district/site reference posture; and specify forbidden runtime fields and validation ownership without changing schemas or content.

The temporary settlement research artifact should be deleted after that run if its remaining useful guidance has been promoted; otherwise the handoff must name its next concrete consumer and removal condition.

The unlanded `Version 0.5.215 - Recipe And Production Schema Decision`, `Version 0.5.213 - Monster Record Schema Decision`, `Version 0.5.210 - Weapon And Armor Profile Schema Decision`, displaced Quest Objective And Condition Schema Decision, `Version 0.5.207 - Person vs NPC Schema Decision`, and `Version 0.5.205 - Magic Study Source Schema Decision` remain valid deferred roadmap items.
