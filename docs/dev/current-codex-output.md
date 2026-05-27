# Current Codex Output

Source version/run: Version 0.5.87 - Combat Equipment Mapping Follow-Up
Date: 2026-05-27
Branch/status assumption: Ran locally on `master`. Default `git pull` failed local SSL certificate validation; `git -c http.sslBackend=schannel pull` fast-forwarded `master` from `87034c4` to `e918764`. Pre-edit worktree was clean and `master` was even with `origin/master` (`0 0`).

## Result
Added the narrow current-content combat use profile for `item.short_bow` and updated the focused combat/equipment mapping test so Hunter's starter bow is no longer an allowed weapon-profile gap.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/combat-equipment-mapping-audit-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/content/base/items/items.json`
- `packages/schemas/items/item.schema.json`
- `packages/engines/game-engine/src/combat/index.ts`
- `tests/unit/combat-equipment-mapping.test.mjs`
- `tests/unit/combat-spawn-foundation.test.mjs`
- `tests/unit/combat-hook-support.test.mjs`

## Files Changed
- `packages/content/base/items/items.json`
- `tests/unit/combat-equipment-mapping.test.mjs`
- `docs/dev/current-codex-output.md`

## Short Bow Mapping
`item.short_bow` now has one `useProfiles` entry matching the existing `item.composite_bow` ranged combat profile shape: `combat.ranged.primary`, `skill.combat.weapon.archery`, `handlingType: "weapon"`, `proficiencySkillId: "skill.combat.weapon.archery"`, `weapon.archery`/`ranged` tags, `weapon.archery` plus `damage.ranged` resolution hooks, single enemy ranged target profile, and the same active timing/stamina profile.

No conduit profile, ammo behavior, new action id, new skill id, new hook, schema field, or balance-specific ranged behavior was added.

## Test Update
`tests/unit/combat-equipment-mapping.test.mjs` now removes `item.short_bow` from `KNOWN_STARTER_WEAPON_PROFILE_GAPS`. A focused Hunter assertion confirms `starting_bundle.hunter` still equips `item.short_bow` into `slot.weapon.right`, then verifies the short-bow ranged archery weapon profile matches the current `item.composite_bow` profile and is a current weapon-training candidate profile.

The remaining known starter weapon-profile gap is `item.butcher_knife`.

## Behavior / Runtime Confirmation
Combat formulas, combat runtime code, equipment behavior, durability, item instances, loot, crafting, economy, UI, save schema, generated output, active magic, creator shell/sidebar, calendar/climate, Chronicle, Bloodlines, Backstory Legacy, Family Prestige, Chronicle Marks, Lineage Seals, estate, heir, heirloom, and bequest behavior were not changed.

This run changed current item content metadata for `item.short_bow`, focused test coverage, and this Codex output file only.

## Checks Run
- `git branch --show-current`
- `git pull` (failed local SSL certificate validation)
- `git -c http.sslBackend=schannel pull`
- `git status --short`
- `git rev-list --left-right --count origin/master...master`
- `node --test tests/unit/combat-equipment-mapping.test.mjs`
- `node --test tests/unit/combat-equipment-mapping.test.mjs tests/unit/combat-spawn-foundation.test.mjs tests/unit/combat-hook-support.test.mjs`
- `git diff --check` (passed; Git reported expected LF-to-CRLF working-copy warnings)

Not run:
- Browser-facing UI import safety scan, because no browser-facing app files were touched.
- Broad workspace typecheck or generated output validation, per prompt.

## Risks / Follow-Up
- Keep known deferred gaps separate:
  - `item.butcher_knife` equip/profile policy
  - hybrid staff skill-gain policy
  - improvised pickaxe skill-gain policy
  - shield/armor defensive skill-gain policy
  - content-owned equipment slot/handedness/offhand/two-handed metadata
  - explicit damage-type table
  - broad weapon/armor/clothing profile coverage

## Next Recommended Version
Version 0.5.88 - Known Spell Ownership Plan

## Suggested Commit Message
fix(content): add short bow combat profile
