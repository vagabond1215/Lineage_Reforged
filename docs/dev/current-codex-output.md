# Current Codex Output

Source version/run: Version 0.5.354 - Validation Command Matrix Plan
Date: 2026-07-12
Branch/status assumption: `master`; worktree clean at start and aligned with `origin/master`; required fetch and fast-forward pull reported `Already up to date.`

## Result

Defined exact validation routing by change class and command behavior. Separated green gates, known-failing audits, side-effectful generators/builds, interactive commands, and environment/network operations.

Fixed focused-test selection, baseline comparison, reporting, schema/content-lint timing, typecheck timing, full-suite authorization, and generated-output rules without changing tooling. Selected docs-only `Version 0.5.355 - Tool Surface Test Boundary Decision` next; the other 14 full-suite failures remain separate and untriaged.

## Files Changed

- `docs/design/validation-command-matrix-plan.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- Required branch status, fetch, and fast-forward pull.
- Required README, coordination, source-map, blocker-prep, package-script, TypeScript-config, tool-surface test, ignore/generated-output, roadmap, and backlog reads.
- Full suite, broad typechecks, UI build, DB build, package installation, and network-dependent commands were intentionally not run.
- `node --test tests/unit/polity-validation.test.mjs`.
- `node --test tests/unit/institution-validation.test.mjs`.
- `node --test tests/unit/schema-files.test.mjs`.
- `npm.cmd run tool:content-lint`.
- Docs-only scope, unchanged scripts/config/dependencies/source/content/schemas/validators/tests/generated output, gate, artifact, conflict-marker, whitespace, and route-pointer checks.
- `git diff --check`.
- `git status --short --branch`.

## Behavior / Runtime Confirmation

Documentation only. No script, config, dependency, source, content, schema, validator, test, normal-lint registration, generated output, runtime, UI, save/account, or gameplay behavior changed.

## Risks / Follow-Up

- The tool-surface test still hardcodes 56 checked files while standalone content lint reports 67 and still executes DB build inside the default suite.
- The remaining 14 full-suite failures and both broad typecheck baselines remain outside this route.
- `docs/design/validation-blocker-inventory.md` is superseded for current routing but retained as historical connector prep.
- `AGENTS.md` still names the completed `0.5.349` chat mode line; changing that workflow pointer remains outside this prompt's allowed files. The `0.5.355` prompt body correctly omits an embedded platform/mode line.

## Next Recommended Version

Version 0.5.355 - Tool Surface Test Boundary Decision

## Suggested Commit Message

docs(validation): define validation command matrix
