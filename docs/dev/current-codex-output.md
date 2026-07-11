# Current Codex Output

Source version/run: Version 0.5.328 - Institution Office Authority Boundary Decision
Date: 2026-07-11
Branch/status assumption: `master`; worktree clean at start and aligned with `origin/master`. `git pull --ff-only origin master` reported `Already up to date.`

## Result

Added the docs-only institution/office boundary decision. Institution and office are separate possible identity owners:

- institution may own narrow static identity for durable named bodies not better owned elsewhere;
- office may eventually own a durable civic position or narrowly defined administrative office independent of its holder, but remains not schema-ready because position/unit/department/force/role/facility meanings are unresolved.

Selected `Version 0.5.329 - Institution Authority Schema Plan` next. No institution/office candidates or implementation are authorized.

## Files Changed

- `docs/design/institution-office-authority-boundary-decision.md`
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
- Required handoff, active prompt, sequence, roadmap, backlog, roadmap selection, institutional audit/boundary, civic/economy/social/People boundaries, and relevant live owner/consumer reads.
- Narrow checks confirmed absent institution/office content and schemas; two presentation-only quest office anchors; Knowledge/Magic Study consumer vocabulary; and derived-only institution profiles.
- `node --test tests/unit/schema-files.test.mjs` (passed: 103 tests).
- `npm.cmd run tool:content-lint` (passed: 67 files checked).
- Scope, forbidden-path, artifact, paused/rejected/closed-lane, conflict-marker, trailing-whitespace, and stale-route scans (passed; only the seven allowed documentation files changed, with no conflict markers or implementation artifacts).
- `git diff --check` (passed; Git reported only expected LF-to-CRLF working-copy notices).
- `git status --short --branch` (only the seven allowed documentation files are modified or untracked on `master`).

## Behavior / Runtime Confirmation

Documentation only. No content, schema, validator, test, normal content-lint registration, consumer enablement, runtime, UI, storage, command, event, reward, migration, save/account, or gameplay behavior changed.

## Risks / Follow-Up

- `0.5.329` must plan institution as strict static body identity and preserve office/government/facility/service/person/link boundaries.
- Knowledge/Magic Study institution vocabulary must remain disabled or non-authoritative; planning a schema does not enable consumers.
- No candidate seed may be inferred from anchors, generic buildings, prose, or derived profiles.

## Next Recommended Version

Version 0.5.329 - Institution Authority Schema Plan

## Suggested Commit Message

docs(civ): decide institution office boundaries
