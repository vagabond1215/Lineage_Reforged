# Current Codex Output

Source version/run: Version 0.5.318 - People NPC Authority Evidence Audit
Date: 2026-07-11
Branch/status assumption: `master`; worktree clean at start and aligned with `origin/master`. `git pull --ff-only origin master` reported `Already up to date.`

## Result

Added the docs-only People/NPC authority evidence audit. The fresh repository scan found no strong canonical named-person candidate: quest contacts (including `npc.corin_ash`), synthetic operators, player/account/combat actors, deity labels, Knowledge vocabulary, prose, and tests/examples remain insufficient or rejected.

No exact people/NPC ids are carried forward. Live People/NPC content, normal lint registration, and NPC overlays remain unauthorized. Selected `Version 0.5.319 - People NPC Seed Evidence Deferral` as the next docs-only route.

## Files Changed

- `docs/design/people-npc-authority-evidence-audit.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (`Already up to date.`)
- Required authority, roadmap, handoff, sequence, backlog, schema, validator, focused-test, normal-lint index, and schema-test reads.
- Quest, lore/design, Knowledge, settlement/site, civilization/guild, player/account/runtime, combat, legacy/backlog, and test/example evidence scans.
- Verified `packages/content/base/civilization/people.json` and `packages/content/base/civilization/npcs.json` remain absent.
- Verified `tools/content-lint/index.mjs` still has no People/NPC content paths, validator import, or normal-lint registration.
- `node --test tests/unit/people-npc-validation.test.mjs` (passed; 75 tests)
- `node --test tests/unit/combat-status-condition-injury-authority-validation.test.mjs` (passed; 90 tests)
- `node --test tests/unit/schema-files.test.mjs` (passed; 102 tests)
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (67 files checked)`)
- Scope scan confirmed only the new audit and five approved coordination docs changed; no content, schema, validator, test, normal-lint index, runtime, UI, save/account, gameplay, generic `world.pois`, Highcrown Knowledge, service, resource/commodity, or combat-health implementation paths changed.
- Deep Research artifact scan found no created artifact.
- Conflict-marker and trailing-whitespace scans found no matches.
- Active route scan confirms current handoff, sequence, roadmap, backlog, audit, and output route to `Version 0.5.319 - People NPC Seed Evidence Deferral`; older `0.5.318` next-route references are historical run records.
- `git diff --check` (passed with line-ending normalization warnings only)
- Final `git status --short --branch` confirmed only the new audit and five approved coordination docs are changed.

## Behavior / Runtime Confirmation

Documentation only. No JSON content, schema, validator, test, normal content-lint registration, runtime, UI, storage, command, event, reward, migration, save/account, or gameplay behavior changed.

## Risks / Follow-Up

- Repeated evidence audits should stop after `0.5.319` records the exact authored-input gate.
- If no new durable canonical person source is authored, an explicit user-authored seed list is required before live content.
- NPC overlays remain deferred until canonical person identity and independent stable presence/interaction posture are both proven.
- Service, resource/commodity, and combat health remain stable and paused; generic `world.pois` remains rejected; Highcrown Knowledge remains closed.

## Next Recommended Version

Version 0.5.319 - People NPC Seed Evidence Deferral

## Suggested Commit Message

docs(npc): audit people npc evidence
