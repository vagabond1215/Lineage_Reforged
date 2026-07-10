# Current Codex Output

Source version/run: Version 0.5.314 - Combat Status Condition Injury Lint Registration
Date: 2026-07-10
Branch/status assumption: `master`; worktree clean at start. `git pull --ff-only origin master` reported `Already up to date.`

## Result

Registered the existing live `combat_health_vocabulary` seed in normal content lint through the existing schema and pure focused validator.

The registration is exact-once: one validator import, one normal `checks` entry, one validator helper call, and one `main()` invocation. Focused tests now prove the registration boundary and unchanged two-record seed. Normal content lint reports 67 checked files.

## Files Changed

- `tools/content-lint/index.mjs`
- `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (`Already up to date.`)
- Required repository reads and targeted exact-once registration-pattern audits.
- Initial `node --test tests/unit/combat-status-condition-injury-authority-validation.test.mjs` run exposed one overbroad assertion against an unrelated pre-existing player-engine import; the assertion was narrowed to the new helper/import boundary.
- Final `node --test tests/unit/combat-status-condition-injury-authority-validation.test.mjs` (passed; 90 tests)
- `node --test tests/unit/schema-files.test.mjs` (passed; 102 tests)
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (67 files checked)`)
- Exact-once scan confirmed one combat health validator import, one normal checks entry, one validator helper call, and one `main()` helper invocation.
- Live seed scan confirmed exactly 2 records, exact sorted ids `combat_status.bind` and `combat_status.stagger`, status-only kinds, planned-only lifecycle, and no conditions, injuries, relationships, class/severity/phase fields, or forbidden runtime/UI/save/account/gameplay keys.
- Scope scan confirmed no live content, schema, focused validator, schema-file test, adjacent combat/player/item/monster/tactics/resource/commodity/service content, runtime, UI, save/account, or gameplay files changed.
- Registration helper scan confirmed it loads only the live combat health wrapper and its schema.
- Deep Research, Highcrown Knowledge, and generic `world.pois` scans found no created artifacts, reopened lanes, or implementation.
- `git diff --check` (passed with line-ending normalization warnings only)
- Conflict-marker and trailing-whitespace scans across changed files found no matches.
- Stale next-version pointer scan confirmed active handoff, roadmap, sequence, backlog, and current output route to `Version 0.5.315 - Combat Status Condition Injury Post-Registration Audit`; older `0.5.314` references are historical.
- Final `git status --short --branch` confirmed only the two approved implementation files and five approved coordination docs are changed.

## Behavior / Runtime Confirmation

Normal content-lint behavior changed only to include and focused-validate `packages/content/base/game/combat_health_vocabulary.json`; the reported checked-file count increased from 66 to 67.

No live JSON content, schema, focused validator behavior, schema-file coverage, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, formulas, ticking, stacking, cures, resistance/vulnerability execution, or gameplay behavior changed.

## Risks / Follow-Up

- The next run should be docs-only `Version 0.5.315 - Combat Status Condition Injury Post-Registration Audit`.
- That audit should verify stable exact-once registration, the unchanged live two-status seed, and whether the lane should pause before any expansion gate.
- Conditions, injuries, relationships, class/severity/phase fields, active records, runtime, UI, save/account, and gameplay remain deferred.

## Next Recommended Version

Version 0.5.315 - Combat Status Condition Injury Post-Registration Audit

## Suggested Commit Message

feat(combat): register combat health lint
