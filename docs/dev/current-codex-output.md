# Current Codex Output

Source version/run: Version 0.5.178 - Religious Hotspot Knowledge Subject Vocabulary Plan
Date: 2026-06-18
Branch/status assumption: `master`; worktree was clean before this documentation run.

## Result

Added a documentation-only plan for direct `religious_hotspot` Knowledge subject vocabulary.

The plan recommends adding `religious_hotspot` to both Knowledge subject enums and resolving ids through live `world.religious_hotspots` authority in 0.5.179. It also sets an active-only policy for future live hotspot snippets: the 0.5.179 validator should reject snippet references to `planned` hotspots, while leaving both current records unchanged until a separate content-status decision.

## Files Changed

- `docs/design/religious-hotspot-knowledge-subject-vocabulary-plan.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git diff --check`
- conflict-marker scan on changed files
- trailing-whitespace scan on changed files
- changed-path scope audit
- stale 0.5.178 reference scan
- 0.5.179 next-run consistency scan
- forbidden source/schema/content/test/runtime/UI/generated-output/storage/persistence/event/reward/gameplay edit audit

No tests or typecheck were run because only documentation files changed.

## Behavior / Runtime Confirmation

Documentation changed only. Normal content lint remains `content-lint: ok (57 files checked)` from 0.5.177. `world.religious_hotspots` remains exactly two `planned` records.

No direct `religious_hotspot` support, schema, validator, source, test, content JSON, live snippet, hotspot status, `world.sacred_sites`, religious order, favorability, alignment, relationship, law, runtime, UI, storage, reward, event, command, Magic Study, Prestige, family, or gameplay behavior changed.

## Risks / Follow-Up

- 0.5.179 should implement vocabulary and validation only, using active in-memory fixtures without activating live records or adding snippets.
- A separate future content-status update must activate selected hotspots before live hotspot snippets are seeded.
- The first snippet plan must decide whether one or both current records remain useful and should become active.
- Connector-side user decisions and open questions remain future planning context only.

## Next Recommended Version

Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator

## Suggested Commit Message

docs(knowledge): plan religious hotspot subject vocabulary
