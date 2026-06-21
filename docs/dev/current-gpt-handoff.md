# Current GPT Handoff

Source route: Codex local planning through `Version 0.5.214 - Crafting Authority Boundary Decision`
Date: 2026-06-20
Branch/status assumption: `master`; latest numbered run is documentation-only after a successful origin fetch and fast-forward pull check.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest numbered Codex handoff.
- `docs/design/crafting-authority-boundary-decision.md` is the permanent authority for future recipes, current production-chain overlap, item/material/tool/station references, professions/guilds/commissions, quality, repair/salvage, alchemy/enchanting, prerequisites, and player crafting-state separation.
- Future player-facing static transformations belong under candidate `crafting.recipes`; no schema or content exists yet.
- Existing `civilization.production_chains` and embedded `recipeProfile` data remain canonical for macro-production. Existing civilization craft/cost projections remain unchanged.
- Existing `civilization.workplaces` are first-pass fixed station anchors. Portable tools remain `items.items` identities and require a later audited reference contract.
- First-pass recipes should reference canonical item keys directly. Future resources/commodities are not recipe prerequisites.
- Professions, quality/affixes, repair/salvage execution, and player crafting state remain deferred. Alchemy/enchanting are future recipe subtypes and non-executing.
- Static crafting content must not consume/create items, mutate inventory/durability/quality, unlock recipes, change markets/vendors, advance quests/Knowledge/trials, pay rewards, or execute gameplay.

## Current Anchor

Latest completed numbered run:

- `Version 0.5.214 - Crafting Authority Boundary Decision`

Immediate next numbered Codex run:

- `Version 0.5.215 - Recipe And Production Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Version 0.5.214 Result

- Consumed `docs/dev/tmp-crafting-production-systems-research-2026-06-20.md` as planning input and corrected it against the live checkout.
- Selected future top-level `crafting.recipes` for player-facing static transformations.
- Preserved 121 existing production-chain `recipeProfile` records and current civilization production/craft projections without migration.
- Selected direct canonical `itemKey` inputs/outputs, item-owned portable tools, and workplace ids as initial station anchors.
- Deferred professions and quality/affix systems.
- Kept alchemy/enchanting as future recipe subtypes and repair/salvage as separate future descriptive profile authorities.
- Kept guilds, services, commissions, quests, Knowledge, trials, Chronicle, travel/gathering, economy, and player runtime state with their own owners.
- Changed no content, schema, validator, test, runtime, UI, storage, or gameplay behavior.

## Next Route Boundary

`Version 0.5.215 - Recipe And Production Schema Decision` should remain documentation-only. It must define exact future recipe paths, ids, wrapper, item-key input/output/byproduct shapes, workplace/tool/skill prerequisite posture, alchemy/enchanting subtype fields, forbidden fields, validation ownership, and the non-duplicating boundary with existing production-chain `recipeProfile` data.

The temporary crafting research artifact should be deleted after that run if its remaining useful guidance has been promoted; otherwise the handoff must name its next concrete consumer and removal condition.

The unlanded `Version 0.5.213 - Monster Record Schema Decision`, `Version 0.5.210 - Weapon And Armor Profile Schema Decision`, displaced Quest Objective And Condition Schema Decision, `Version 0.5.207 - Person vs NPC Schema Decision`, and `Version 0.5.205 - Magic Study Source Schema Decision` remain valid deferred roadmap items.
