# Current Codex Output

Source version/run: Version 0.5.223 - Person vs NPC Schema Decision
Date: 2026-06-21
Branch/status assumption: `master`; synced with `origin/master` before editing; worktree was clean at `b72fffd`.

## Result

Completed the documentation-only person-versus-NPC schema decision. Live inspection confirmed there is no authored people/NPC authority, while quest contacts, synthetic settlement operators, combatants, player/account characters, role labels, and Knowledge teacher/character vocabulary remain separate non-canonical identities.

The decision approves future strict records-only `civilization.people` and `civilization.npcs` collections. People own minimal stable identity; NPCs are optional one-to-one overlays keyed to `personId` and own only descriptive presence/interaction posture plus an optional settlement anchor. Roles, workplaces, affiliations, family/kinship, relationships, schedules, dialogue, services, quests, Knowledge, generated populations, and all runtime state remain separate. The fully promoted temporary NPC/social research artifact was deleted with no remaining consumer.

## Files Changed

- `docs/design/person-vs-npc-schema-decision.md` - added the permanent schema decision.
- `docs/design/pipeline-roadmap-consolidation-decision.md` - recorded artifact retirement and advanced the immediate queue.
- `docs/dev/current-codex-output.md` - replaced with this run result.
- `docs/dev/current-gpt-handoff.md` - advanced the current anchor and next decision.
- `docs/dev/project-roadmap.md` - marked `0.5.223` complete and `0.5.224` next.
- `docs/dev/codex-sequenced-implementation-plan.md` - advanced the ordered queue and decision source.
- `docs/future_content_backlog.md` - recorded the durable person/NPC posture and temporary-artifact deletion.
- `docs/dev/tmp-npc-social-systems-research-2026-06-20.md` - deleted after full promotion; no remaining consumer.

## Checks Run

- `git fetch origin` - passed.
- `git pull --ff-only origin master` - passed; already up to date.
- Live person/NPC-adjacent content, schema, source, runtime, and authority audit - passed.
- `git diff --check` - passed.
- Conflict-marker scan on changed files - passed.
- Trailing-whitespace scan on changed files - passed.
- Changed-path scope audit - passed; documentation paths only.
- Required-section audit - passed; all 17 sections present.
- Decision-completeness and implementation-scope audits - passed.
- Version/research tracking audit - passed: `0.5.223` completed, `0.5.224` next, GPT-DR labels remain non-Codex labels, and no new research gate interrupts the queue.
- Tests were not run because this pass changed documentation only.

## Behavior / Runtime Confirmation

No schema, content JSON, validator, test, loader, lint registration, runtime, UI, storage/save-state, gameplay, migration, generated-person, NPC AI, schedule, dialogue, relationship, service, quest, Chronicle, or Knowledge behavior changed.

## Risks / Follow-Up

- The later `0.5.235` pass must keep both schemas unregistered and content-free unless separately authorized.
- `npc.corin_ash`, quest contact names, and synthetic operator ids remain non-canonical; a later seed must not promote them without explicit canon.
- Role, affiliation, schedule, dialogue, service, relationship, family, and Knowledge references must wait for their owning authorities.

## Next Recommended Version

Version 0.5.224 - Magic Study Source Schema Decision

## Suggested Commit Message

`docs(npc): decide person and NPC schema posture`
