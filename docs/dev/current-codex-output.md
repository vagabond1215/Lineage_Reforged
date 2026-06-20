# Current Codex Output

Source version/run: Version 0.5.212 - Combat Authority Boundary Decision
Date: 2026-06-20
Branch/status assumption: `master`; worktree was clean after successful `git fetch origin` and `git pull --ff-only origin master` at `255d977`.

## Result

Created `docs/design/combat-authority-boundary-decision.md` from the temporary combat/encounter Deep Research artifact and corrected its assumptions through live repository inspection.

The decision preserves existing `world.monsters`, `world.encounter_templates`, `world.spawn_profiles`, `game.combat_roles`, and `game.tactics_presets` authorities; separates all static records from runtime combat and encounter state; keeps damage family hook-derived; defers static status/condition authority to a dedicated decision; keeps injury/death/recovery runtime-only; and preserves source-local loot/reward envelopes pending a later loot decision.

## Files Changed

- `docs/design/combat-authority-boundary-decision.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git diff --check` - passed
- conflict-marker scan on changed files - passed
- trailing-whitespace scan on changed files - passed
- changed-path scope audit - passed; exactly six documentation files changed
- required-section audit - passed; all 20 required sections are present
- implementation-scope audit - passed; no content, schema, validator, test, runtime, UI, storage, or gameplay file changed
- no tests run; documentation-only change

## Behavior / Runtime Confirmation

Documentation only. No content, schema, validator, test, Knowledge, economy/crafting/item/equipment/quest/magic/NPC/social/travel/geography/religion/family/civic authority, runtime, UI, storage, combat, resources, actions, AI, pathfinding, status, injury, death, recovery, loot, reward, reputation, law, Chronicle, or gameplay behavior changed.

## Risks / Follow-Up

- Existing monster, encounter, spawn, role, and tactics records are already strict live authorities. Future work must harden these contracts rather than introduce parallel collections.
- Existing monster `combatProfile.base*` values are archetype baselines, not current resources; the next decision should make that boundary explicit.
- Monster drops/loot and quest rewards remain source-local descriptive envelopes pending a later item-owned loot-table decision.
- The temporary combat research artifact remains temporary through the next monster-record schema-decision pass, which must delete it if fully promoted or name its next consumer and removal condition.
- The unlanded `Version 0.5.210 - Weapon And Armor Profile Schema Decision` remains valid.
- The displaced Quest Objective And Condition Schema Decision remains valid and deferred.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.213 - Monster Record Schema Decision

## Suggested Commit Message

docs(combat): decide combat authority boundaries
