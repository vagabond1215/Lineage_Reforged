# Current Codex Output

Source version/run: Version 0.5.330 - Institution Authority Schema And Validator
Date: 2026-07-11
Branch/status assumption: `master`; worktree clean at start and aligned with `origin/master`. `git pull --ff-only origin master` reported `Already up to date.`

## Result

Implemented the strict future institution validation scaffold:

- added the records-only institution schema;
- added a pure issue-returning, fixture-driven validator;
- added focused structural, semantic, forbidden-field, purity, absence, and no-candidate tests;
- added institution schema-file parse coverage.

Live institution content, normal content-lint registration, candidate ids, references, resolver logic, and consumer enablement remain absent. Selected `Version 0.5.331 - Institution Authority Seed Evidence Audit` next.

## Files Changed

- `packages/schemas/civilization/institution.schema.json`
- `tools/content-lint/institutions.mjs`
- `tests/unit/institution-validation.test.mjs`
- `tests/unit/schema-files.test.mjs`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/current-codex-prompt.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (`Already up to date.`)
- Required schema plan, boundary, nearby faction implementation, schema-test, coordination, and institution-consumer reads.
- `node --test tests/unit/institution-validation.test.mjs` (passed: 120 tests).
- `node --test tests/unit/schema-files.test.mjs` (passed: 104 tests).
- `npm.cmd run tool:content-lint` (passed: 67 files checked).
- Allowed-scope, absent-content, absent-registration, no-live-candidate, no-reference/resolver, consumer, artifact, conflict-marker, trailing-whitespace, and route-pointer scans (passed; exactly the ten allowed files changed).
- `git diff --check` (passed; Git reported only expected LF-to-CRLF working-copy notices).
- `git status --short --branch` (exactly the ten allowed files are modified or untracked on `master`).

## Behavior / Runtime Confirmation

Schema and validation scaffolding changed. No live JSON content, normal content-lint path, consumer, runtime, UI, storage, command, event, reward, migration, save/account, or gameplay behavior changed.

## Risks / Follow-Up

- The validator is intentionally not registered in normal lint while live content is absent.
- The schema intentionally rejects all reference and behavior fields.
- `0.5.331` must audit only durable authored institution evidence and may carry forward zero candidates.
- Knowledge/Magic Study and all other institution consumers remain fail closed; office remains not schema-ready.

## Next Recommended Version

Version 0.5.331 - Institution Authority Seed Evidence Audit

## Suggested Commit Message

feat(civ): add institution authority validation
