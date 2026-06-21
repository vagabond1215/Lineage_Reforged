# Current GPT Handoff

Source version/run: Version 0.5.219 - Recipe And Production Schema Decision
Date: 2026-06-21
Branch/status assumption: `master`; latest numbered Codex run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/design/recipe-and-production-schema-decision.md` is the permanent recipe/schema-posture authority.
- `docs/design/crafting-authority-boundary-decision.md` remains the broader crafting/production ownership authority.
- `docs/design/pipeline-roadmap-consolidation-decision.md` remains the authority for sequence, version remapping, artifact lifecycle, and research gates.
- `docs/design/gpt-deep-research-version-tracking-decision.md` remains the supplemental GPT Deep Research label policy.
- GPT Deep Research gates use `GPT-DR.<lane>.<topic>` labels and do not consume `0.5.x` Codex version numbers.
- Runtime, UI, save state, inventory/item mutation, services, transactions, crafting execution, and player crafting state remain outside this `0.5.x` decision queue.

## Current Anchor

Latest completed numbered Codex run:

- `Version 0.5.219 - Recipe And Production Schema Decision`

Immediate next numbered Codex run:

- `Version 0.5.220 - Monster Record Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Recipe Decision Result

- Future `crafting.recipes` is approved for authored player-facing static transformations.
- Existing `civilization.production_chains` and embedded `recipeProfile` data remain macro-production authority in place, without extraction, migration, aliases, or inheritance.
- An optional future `relatedProductionChainId` is a validated non-inheriting cross-reference only.
- Recipe inputs, outputs, byproducts, reagents, catalysts, conduits, and portable tools use canonical `itemKey` references.
- Portable tools remain item-owned; existing workplace ids are the only first-pass fixed station anchors.
- Buildings, infrastructure, settlements, extraction stages, services, and future station profiles are not first-pass recipe anchors.
- Alchemy/enchanting are future recipe subtypes under the common deterministic contract. Repair/salvage and all durability/quality/rarity/affix/improvement behavior remain separate and deferred.
- The temporary crafting research artifact was deleted after full promotion. It has no remaining consumer.
- No schema, content, validator, test, runtime, UI, storage, gameplay, or migration change occurred.

## Consolidated Near-Term Queue

1. `0.5.220 - Monster Record Schema Decision`
2. `0.5.221 - Weapon And Armor Profile Schema Decision`
3. `0.5.222 - Quest Objective And Condition Schema Decision`
4. `0.5.223 - Person vs NPC Schema Decision`
5. `0.5.224 - Magic Study Source Schema Decision`
6. `0.5.225 - Polity Schema Decision`
7. `0.5.226 - Household vs Family Schema Decision`
8. `0.5.227 - Settlement Economy Schema Decision`
9. `0.5.228 - World Map Feature Authority Schema Decision`
10. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue. Use the matching permanent decision and temporary artifact for each remaining pass.

## Next Route Boundary

`Version 0.5.220 - Monster Record Schema Decision` remains documentation-only. It must audit the existing monster schema and content rather than introduce a replacement collection, preserve encounter/spawn/role/tactics owners, define source-local loot and runtime-field boundaries, and decide the combat research artifact's retirement.

It must not implement schemas, validators, content, tests, runtime combat, AI, loot rolls, rewards, UI, storage, or gameplay behavior.
