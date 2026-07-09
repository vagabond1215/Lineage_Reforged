# Current Codex Output

Source version/run: Version 0.5.308 - Combat Status Condition Injury Schema Plan
Date: 2026-07-09
Branch/status assumption: `master`; worktree clean at start. `git fetch origin` succeeded. `git pull --ff-only origin master` reported the known multi-branch fast-forward ambiguity; `HEAD`, `origin/master`, and merge-base all resolved to `c924eb8ca1d06b1da670f3b2ff5c49725ff46a39`.

## Result

Completed the documentation-only combat status/condition/injury schema plan.

The plan selects one future combined typed `combat_health_vocabulary` catalog, with records classified by `kind` as `status`, `condition`, or `injury`. It keeps schemas, validators, tests, live content, normal lint registration, runtime behavior, UI, save/account behavior, combat execution, and gameplay deferred.

## Files Changed

- `docs/design/combat-status-condition-injury-schema-plan.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (known ambiguity)
- `git rev-parse HEAD`
- `git rev-parse origin/master`
- `git merge-base HEAD origin/master`
- Required reads of `AGENTS.md`, `README.md`, current output, current handoff, sequence, roadmap, backlog, resource/commodity gate docs, combat boundary decision, static authority validation audit, pipeline consolidation decision, and GPT Deep Research prompt-pack decision.
- Read relevant combat, spell, ability, skill-effect, item-use, monster, encounter, spawn, combat role, tactics, hook, magic metadata, schema-file, and focused test surfaces.
- Structured evidence scan for current content counts, status-like hooks, ability target-condition strings, and item use profile count.
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (66 files checked)`)
- `node --test tests/unit/schema-files.test.mjs` (passed; 101 tests)
- `git diff --check` (passed with line-ending normalization warnings only)
- Conflict-marker scan across changed docs (no matches)
- Trailing-whitespace scan across changed docs (no matches)
- Changed-file audit confirmed only approved docs changed and no package, tool, test, app, runtime, schema, validator, or content files changed.
- Current-route scan confirmed the active next route points to `Version 0.5.309 - Combat Status Condition Injury Evidence Audit`; older `0.5.308` references are historical.
- Highcrown and `world.pois` scans found only closed-lane, rejection, or no-change language.

## Behavior / Runtime Confirmation

Documentation changed only.

No combat status/condition/injury content, schemas, validators, tests, normal content-lint code, combat role content, tactics content, encounter content, monster content, spawn profile content, player ability content, player spell content, player skill content, skill effect content, item content, resource/commodity content, service content, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, damage formulas, healing formulas, duration/tick/stack behavior, cure behavior, immunity/resistance/vulnerability execution, `world.pois`, Highcrown Knowledge, or gameplay behavior changed.

## Risks / Follow-Up

- The plan intentionally follows the accepted boundary decision and chooses one combined typed catalog rather than three first-pass standalone authorities.
- A later evidence audit should inspect live hook strings, target-condition strings, body/resource runtime, monster/encounter/spawn/tactics evidence, and candidate safety before schema/validator implementation.
- `GPT-DR.health.injury-recovery` is not required for this schema plan, but remains prudent before broader health, injury, recovery, disease, poison, treatment, medicine, death/defeat, or healing-service work.
- Normal content-lint registration remains deferred until live content exists and a separate registration decision approves it.

## Next Recommended Version

Version 0.5.309 - Combat Status Condition Injury Evidence Audit

## Suggested Commit Message

docs(combat): plan status condition injury schemas
