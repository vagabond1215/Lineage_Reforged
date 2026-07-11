# Current Codex Output

Source version/run: Version 0.5.322 - Organization Faction Guild Boundary Decision
Date: 2026-07-11
Branch/status assumption: `master`; worktree clean at start and aligned with `origin/master`. `git pull --ff-only origin master` reported `Already up to date.`

## Result

Added the docs-only organization/faction/guild boundary decision. The decision protects existing guild, polity, religion/religious-order, service, place, economy, account, reputation, People/NPC, Knowledge, and runtime owners; rejects a general organization umbrella; and keeps institution/office, government/jurisdiction/law, business/company, provider, membership/affiliation, and local-reputation authorities separate and deferred.

Faction is selected as the one distinct future static identity owner ready for a docs-only schema plan. Selected `Version 0.5.323 - Faction Authority Schema Plan` next. No schema, content, candidate list, link/state, or implementation is authorized.

## Files Changed

- `docs/design/organization-faction-guild-boundary-decision.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (`Already up to date.`)
- Required authority audit, selection, civic/economy/social, pause/gate, roadmap, sequence, backlog, consolidation, and Deep Research decision reads.
- Fresh live checks confirmed exactly 18 guild records; unchanged guild schema presence; absent general organization/faction content and schemas; preserved guild normal-lint/schema-test posture; religion-owned nested orders; faction/institution-shaped future hooks; and existing player/runtime boundaries.
- `node --test tests/unit/schema-files.test.mjs` (passed; 102 tests)
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (67 files checked)`)
- Scope scan confirmed only the new decision and five approved coordination docs changed; no content, schema, validator, test, normal-lint index, runtime, UI, save/account, gameplay, organization/faction/guild implementation, People/NPC reopening, generic `world.pois`, Highcrown Knowledge, service, resource/commodity, or combat-health implementation paths changed.
- Deep Research artifact scan found no created artifact.
- Conflict-marker and trailing-whitespace scans found no matches.
- Active route scan confirms current handoff, sequence, roadmap, backlog, decision, and output route to `Version 0.5.323 - Faction Authority Schema Plan`; older `0.5.322` next-route references are historical run records.
- `git diff --check` (passed with line-ending normalization warnings only)
- Final `git status --short --branch` confirmed only the new decision and five approved coordination docs are changed.

## Behavior / Runtime Confirmation

Documentation only. No JSON content, schema, validator, test, normal content-lint registration, runtime, UI, storage, command, event, reward, migration, save/account, or gameplay behavior changed.

## Risks / Follow-Up

- `0.5.323` must define faction as narrow static identity and reject use as a generic organization bucket.
- The schema plan must preserve all existing owners and reject inference from guilds, religious orders, polities, governments, businesses, families/houses, quests, backstory hooks, settlements, derived networks, runtime groups, and reputation/standing.
- Membership, affiliation, rank, office holding, reputation, standing, favorability, services, access, relationships, diplomacy, conflict, law, runtime, UI, save/account, and gameplay must stay outside the faction identity contract.
- A later faction seed still requires explicit durable canonical evidence; current hooks do not approve candidates.

## Next Recommended Version

Version 0.5.323 - Faction Authority Schema Plan

## Suggested Commit Message

docs(civ): decide organization faction guild boundaries
