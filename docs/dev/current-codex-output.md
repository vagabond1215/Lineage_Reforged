# Current Codex Output

Source version/run: Version 0.5.320 - Roadmap Post-People-NPC Deferral Selection
Date: 2026-07-11
Branch/status assumption: `master`; worktree clean at start and aligned with `origin/master`. `git pull --ff-only origin master` reported `Already up to date.`

## Result

Added the docs-only post-People/NPC roadmap selection. Selected organization/faction/guild authority for the next repository evidence audit because 18 live broad guild records and adjacent institutional references exist while general organization/faction collections and schemas are absent and current civic authority requires factions, guilds, and institutions to remain distinct.

People/NPC, service, resource/commodity, and combat health remain paused; generic `world.pois` remains rejected; Highcrown Knowledge remains closed. Selected `Version 0.5.321 - Organization Faction Guild Authority Evidence Audit` next. No implementation is authorized.

## Files Changed

- `docs/design/roadmap-post-people-npc-deferral-selection.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (`Already up to date.`)
- Required handoff, roadmap, sequence, backlog, People/NPC, service, resource/commodity, combat-health, consolidation, and Deep Research decision reads.
- Deferred-lane scans covering organization/faction/guild, locations, family/lineage/households, property/construction, dialogue/companions/social memory, agriculture, maritime, temporal/weather, progression, runtime transition, and other backlog candidates.
- Institutional surface scan confirmed 18 live guild records and a strict guild schema; separate polity/religion owners; organization-like settlement, quest, magic, Knowledge, and derived projection references; and absent general organization/faction collections and schemas.
- `node --test tests/unit/people-npc-validation.test.mjs` (passed; 75 tests)
- `node --test tests/unit/schema-files.test.mjs` (passed; 102 tests)
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (67 files checked)`)
- Scope scan confirmed only the new selection and five approved coordination docs changed; no content, schema, validator, test, normal-lint index, runtime, UI, save/account, gameplay, organization/faction/guild implementation, location/POI implementation, People/NPC reopening, generic `world.pois`, Highcrown Knowledge, service, resource/commodity, or combat-health implementation paths changed.
- Deep Research artifact scan found no created artifact.
- Conflict-marker and trailing-whitespace scans found no matches.
- Active route scan confirms current handoff, sequence, roadmap, backlog, selection, and output route to `Version 0.5.321 - Organization Faction Guild Authority Evidence Audit`; older `0.5.320` next-route references are historical run records.
- `git diff --check` (passed with line-ending normalization warnings only)
- Final `git status --short --branch` confirmed only the new selection and five approved coordination docs are changed.

## Behavior / Runtime Confirmation

Documentation only. No JSON content, schema, validator, test, normal content-lint registration, runtime, UI, storage, command, event, reward, migration, save/account, or gameplay behavior changed.

## Risks / Follow-Up

- `0.5.321` must preserve existing guild, polity, religion, settlement, service, resource/commodity, combat-health, People/NPC, Knowledge, and runtime owners.
- Organization-like quest anchors, settlement guild presence, Knowledge vocabulary, and derived institution projections must not be promoted to canon by inference.
- The next audit may validly conclude that no new general authority is justified or that only one narrowly separated future authority should proceed to a later boundary decision.
- Deep Research, content, schemas, validators, registration, memberships, reputation, runtime, UI, save/account, and gameplay remain unauthorized.

## Next Recommended Version

Version 0.5.321 - Organization Faction Guild Authority Evidence Audit

## Suggested Commit Message

docs(roadmap): select post people npc authority lane
