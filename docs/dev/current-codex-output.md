# Current Codex Output

Source version/run: Version 0.5.226 - Household vs Family Schema Decision
Date: 2026-06-22
Branch/status assumption: `master`; synced with `origin/master` before editing; worktree was clean at `7120f9d`.

## Result

Completed the documentation-only household-versus-family schema decision. The decision approves separate future strict records-only `civilization.households` and `civilization.families` identity collections with collision-proof `civilization_household.<slug>` and `civilization_family.<slug>` ids.

Household membership, family membership, and direct kin/care facts remain separate future relation authorities. Authored identity records do not embed people, membership, property, inheritance, account Family Prestige, source-run state, estate state, synthetic settlement operators, or runtime behavior. The temporary family research artifact was deleted after full promotion with no remaining consumer.

## Files Changed

- `docs/design/household-vs-family-schema-decision.md` - added the permanent schema-posture decision.
- `docs/design/pipeline-roadmap-consolidation-decision.md` - recorded artifact retirement and advanced the immediate queue.
- `docs/dev/current-codex-output.md` - replaced with this run result.
- `docs/dev/current-gpt-handoff.md` - advanced the current anchor and household/family authority rules.
- `docs/dev/project-roadmap.md` - marked `0.5.226` complete and `0.5.227` next.
- `docs/dev/codex-sequenced-implementation-plan.md` - advanced the ordered queue and decision source.
- `docs/future_content_backlog.md` - recorded the durable posture and artifact deletion.
- `docs/dev/tmp-family-lineage-systems-research-2026-06-20.md` - deleted after full promotion; no remaining consumer.

## Checks Run

- `git fetch origin` - passed.
- `git pull --ff-only origin master` - passed; already up to date.
- Live household, family, person/NPC, account family, Family Prestige, estate, source-run, Bloodlines, settlement projection, and lineage ownership audit - passed.
- `git diff --check` - passed.
- Conflict-marker scan on changed files - passed.
- Trailing-whitespace scan on changed files - passed.
- Changed-path scope audit - passed; documentation paths only.
- Required-section audit - passed; all 18 sections present.
- Decision-completeness, artifact-retirement, and version-tracking audits - passed.
- Tests were not run because this pass changed documentation only.

## Behavior / Runtime Confirmation

No schema, content JSON, validator, test, loader, lint registration, Knowledge, people/NPC, household/family/kinship, account family, Family Prestige, estate, Bloodlines, settlement, lineage, runtime, UI, storage/save-state, migration, generated people, AI, schedule, dialogue, relationship mutation, service, reward, command, event, or gameplay behavior changed.

## Risks / Follow-Up

- Conditional `0.5.238` must implement two identity schemas only unless separate relation-schema decisions approve household memberships, family memberships, or kinship links.
- Static authored records must not reuse mutable account `family.*` ids or synthetic settlement `household.*` ids.
- Genealogical lineage remains deferred; current player `lineageId` continues to mean ancestry/species.

## Next Recommended Version

Version 0.5.227 - Settlement Economy Schema Decision

## Suggested Commit Message

`docs(family): decide household family schema posture`
