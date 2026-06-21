# Current GPT Handoff

Source version/run: Version 0.5.220 - Monster Record Schema Decision
Date: 2026-06-21
Branch/status assumption: `master`; latest numbered Codex run is documentation-only.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex handoff.
- `docs/dev/gpt-codex-tooling-instructions.md` remains the active operational guide for tool, skill, mode, prompt, GPT-DR, and cross-thread setup choices.
- `docs/design/monster-record-schema-decision.md` is the permanent monster/schema-posture authority.
- `docs/design/combat-authority-boundary-decision.md` remains the broader combat/encounter/runtime ownership authority.
- `docs/design/pipeline-roadmap-consolidation-decision.md` remains the authority for sequence, version remapping, artifact lifecycle, and research gates.
- `docs/design/gpt-deep-research-version-tracking-decision.md` remains the supplemental GPT Deep Research label policy.
- Operational guidance does not replace permanent design decisions or current run state.
- GPT Deep Research gates use `GPT-DR.<lane>.<topic>` labels and do not consume `0.5.x` Codex version numbers.
- Runtime combat, AI, loot rolls, rewards, item instances, UI, and save state remain outside this `0.5.x` decision queue.

## Current Anchor

Latest completed numbered Codex run:

- `Version 0.5.220 - Monster Record Schema Decision`

Latest GPT-side documentation update:

- `docs/dev/gpt-codex-tooling-instructions.md`

Immediate next numbered Codex run:

- `Version 0.5.221 - Weapon And Armor Profile Schema Decision`

Current phase: `v0.5.x` foundation stabilization / ownership hardening. Do not roll to `0.6.0`.

## Monster Decision Result

- Existing `world.monsters` remains the canonical static monster identity/archetype authority; no replacement collection is planned.
- Identity, ecology/behavior, optional lineage/origin, combat baselines, role/action packages, and scaling hooks remain in the current record contract.
- Encounter templates compose monsters; spawn profiles place encounters; combat roles and tactics remain reusable descriptors rather than monster identity or AI execution.
- Current `defaultRole` is sufficient. Do not add explicit tactics-preset references now.
- Current monster drops/loot remain source-local. A future general loot-table authority is provisionally item-owned and requires a dedicated decision.
- Status, condition, injury, morale, fear, poison, disease, death, defeat, recovery, AI state, combatant state, loot rolls, rewards, and item instances remain outside static monsters.
- The temporary combat research artifact was deleted after full promotion. It has no remaining consumer.
- No schema, content, validator, test, runtime, UI, storage, gameplay, loot, AI, combat, or migration change occurred.

## Consolidated Near-Term Queue

1. `0.5.221 - Weapon And Armor Profile Schema Decision`
2. `0.5.222 - Quest Objective And Condition Schema Decision`
3. `0.5.223 - Person vs NPC Schema Decision`
4. `0.5.224 - Magic Study Source Schema Decision`
5. `0.5.225 - Polity Schema Decision`
6. `0.5.226 - Household vs Family Schema Decision`
7. `0.5.227 - Settlement Economy Schema Decision`
8. `0.5.228 - World Map Feature Authority Schema Decision`
9. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue. Use the matching permanent decision and temporary artifact for each remaining pass.

## Next Route Boundary

`Version 0.5.221 - Weapon And Armor Profile Schema Decision` remains documentation-only. It must define future weapon/armor profile contracts against current item `useProfiles`, preserve item identity and runtime item-instance owners, resolve equipment/combat references, and decide the item research artifact's retirement.

It must not implement schemas, validators, content, tests, equipment behavior, item instances, inventory mutation, combat execution, UI, storage, or gameplay behavior.
