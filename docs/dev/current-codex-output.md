# Current Codex Output

Source version/run: Version 0.5.319 - People NPC Seed Evidence Deferral
Date: 2026-07-11
Branch/status assumption: `master`; worktree clean at start and aligned with `origin/master`. `git pull --ff-only origin master` reported `Already up to date.`

## Result

Added the docs-only People/NPC seed evidence deferral. People/NPC is now paused until an explicit user-authored canonical seed list, a new durable repository lore/content source owning named people, or an equivalent later person-authority source exists.

The gate defines minimum People candidate, NPC overlay, and separate normal-lint registration requirements; carries forward no exact candidate ids; and prohibits repeated weak-source audits without new authored material. Selected `Version 0.5.320 - Roadmap Post-People-NPC Deferral Selection` next.

## Files Changed

- `docs/design/people-npc-seed-evidence-deferral.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (`Already up to date.`)
- Required authority, audit, roadmap, handoff, sequence, backlog, schema, validator, focused-test, normal-lint index, and schema-test reads.
- Verified `packages/content/base/civilization/people.json` and `packages/content/base/civilization/npcs.json` remain absent.
- Verified `tools/content-lint/index.mjs` still has no People/NPC import, content path, check registration, validator call, or `main()` invocation.
- Verified both People/NPC schemas, the pure validator, focused tests, and schema-file parse entries remain present.
- Verified no exact People/NPC candidate is carried forward; `npc.corin_ash`, Elda Mire, quest contacts, and other weak classes appear only in explicit rejection/stop conditions.
- `node --test tests/unit/people-npc-validation.test.mjs` (passed; 75 tests)
- `node --test tests/unit/schema-files.test.mjs` (passed; 102 tests)
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (67 files checked)`)
- Scope scan confirmed only the new deferral and five approved coordination docs changed; no content, schema, validator, test, normal-lint index, runtime, UI, save/account, gameplay, generic `world.pois`, Highcrown Knowledge, service, resource/commodity, or combat-health implementation paths changed.
- Deep Research artifact scan found no created artifact.
- Conflict-marker and trailing-whitespace scans found no matches.
- Active route scan confirms current handoff, sequence, roadmap, backlog, deferral, and output route to `Version 0.5.320 - Roadmap Post-People-NPC Deferral Selection`; older `0.5.319` next-route references are historical run records.
- `git diff --check` (passed with line-ending normalization warnings only)
- Final `git status --short --branch` confirmed only the new deferral and five approved coordination docs are changed.

## Behavior / Runtime Confirmation

Documentation only. No JSON content, schema, validator, test, normal content-lint registration, runtime, UI, storage, command, event, reward, migration, save/account, or gameplay behavior changed.

## Risks / Follow-Up

- A future People/NPC reopening prompt must name a genuinely new durable authored input before evidence scanning or seed planning resumes.
- If no durable repository person-authority source exists, an explicit user-authored canonical seed list is required before live content.
- NPC overlays remain deferred until canonical person identity and independent stable presence/interaction posture are both proven.
- Normal-lint registration remains separately gated after a live validated wrapper exists.
- The next roadmap selection must preserve People/NPC, service, resource/commodity, and combat-health pauses plus generic `world.pois` rejection and Highcrown Knowledge closure unless a later explicit decision changes them.

## Next Recommended Version

Version 0.5.320 - Roadmap Post-People-NPC Deferral Selection

## Suggested Commit Message

docs(npc): defer people npc seed evidence
