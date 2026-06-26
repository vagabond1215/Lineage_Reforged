# Current Codex Output

Source version/run: Version 0.5.235 - People And NPC Schemas And Validators
Date: 2026-06-26
Branch/status assumption: `master`; fetched and fast-forward pulled from `origin/master` before editing; worktree was clean and the pull was already up to date.

## Result

Completed the narrow people/NPC schema and validator pass from `0.5.223`.

Added strict future `civilization.people` and `civilization.npcs` collection schemas, an isolated pure in-memory validator helper, focused tests, and schema-file parse registration only. The validator hardens person id/slug coherence, duplicate person ids/slugs, optional lineage resolution when lineage records are supplied, NPC id/personId suffix coherence, duplicate NPC ids/personId values, required NPC person resolution, optional settlement resolution when settlement records are supplied, and the approved person-vs-NPC identity boundary.

No live people/NPC content files, normal content-lint registration, loaders, migrations, runtime types, UI, storage, generated people, quest-contact migration, Knowledge integration, social simulation, or gameplay behavior were added.

## Files Changed

- `packages/schemas/civilization/person.schema.json` - added the strict future `civilization.people` schema.
- `packages/schemas/civilization/npc.schema.json` - added the strict future `civilization.npcs` overlay schema.
- `tools/content-lint/people-npcs.mjs` - added pure in-memory semantic validation helpers.
- `tests/unit/people-npc-validation.test.mjs` - added focused schema/validator tests and no-live-content/no-lint-registration assertions.
- `tests/unit/schema-files.test.mjs` - registered the two new schema files for parse coverage.
- `docs/dev/current-codex-output.md` - replaced with this run result.
- `docs/dev/current-gpt-handoff.md` - advanced the current anchor and next route.
- `docs/dev/project-roadmap.md` - marked `0.5.235` complete and `0.5.236` next.
- `docs/dev/codex-sequenced-implementation-plan.md` - advanced the ordered queue.
- `docs/future_content_backlog.md` - recorded the run note and remaining deferred people/NPC/social boundaries.
- `docs/design/pipeline-roadmap-consolidation-decision.md` - aligned the next recommended version.

## Checks Run

- `git fetch origin` - passed.
- `git pull --ff-only origin master` - passed; already up to date.
- `node --test tests\unit\people-npc-validation.test.mjs` - passed.
- `npm.cmd run tool:content-lint` - passed; `content-lint: ok (58 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` - expected existing failure after both new people/NPC schemas parse successfully; unrelated Knowledge subject vocabulary assertion around `sacred_site` still fails.
- `git diff --check` - passed.
- Conflict-marker scan on changed files - passed.
- Trailing-whitespace scan on changed files - passed.
- Changed-path scope audit - passed; changed paths are the two future schemas, isolated validator helper, focused tests/schema registration, and coordination docs.
- Implementation-scope audit - passed; no live people/NPC content, normal content-lint registration, loaders, migrations, runtime, UI, storage, command, event, reward, NPC AI, schedules, dialogue, relationship mutation, service execution, generated-person behavior, quest-contact migration, Knowledge mutation, or gameplay files changed.
- People/NPC authority audit - passed; people identity and NPC overlays remain separate, no inferred/synthetic people were authored, no aliases/migrations were introduced, and no replacement social/relationship/service/dialogue/schedule authority was created.
- Temp-artifact audit for `docs/dev/tmp-npc-social-systems-research-2026-06-20.md` - passed; artifact remains absent.
- Version-tracking audit - passed; `0.5.235` is marked complete and `0.5.236` is the next recommended version.

## Behavior / Runtime Confirmation

No runtime, JSON live content, normal content-lint live content registration, loader, migration, UI, storage/save-state, command, event, reward, NPC AI, schedule, dialogue, service, relationship mutation, generated-person, quest-contact migration, Knowledge mutation, or gameplay behavior changed.

The new schemas and validator helper are future-contract validation only and are exercised by focused in-memory tests.

## Risks / Follow-Up

- First live people/NPC content remains deferred and should start with a separate seed plan.
- Quest giver/contact strings and legacy-shaped `npc.*` strings remain presentation metadata and are not migrated.
- Generated residents/workers/guards/merchants/travelers, roles, affiliations, family/kinship, relationships, schedules, dialogue, services, quests, Chronicle, Knowledge support, runtime state, UI, storage, commands, events, rewards, and gameplay remain deferred.
- The broader `schema-files.test.mjs` suite still has the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.

## Next Recommended Version

Version 0.5.236 - Magic Study Source Schema And Validator

## Suggested Commit Message

`feat(civilization): add people npc schemas`
