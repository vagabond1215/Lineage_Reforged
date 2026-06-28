# Current Codex Output

Source version/run: Version 0.5.246 - First People And NPC Content Seed Plan
Date: 2026-06-28
Branch/status assumption: `master`; fetched and fast-forward pulled from `origin/master` before editing; pull was already up to date. After the requested fetch/pull/status sequence, the worktree was clean before `0.5.246` edits.

## Result

Completed the documentation-only first people/NPC content seed plan.

Added `docs/design/first-people-npc-content-seed-plan.md`. The plan chooses a people-only first live seed posture and defers NPC overlays because the current audit found no stable authored presence/interaction evidence beyond quest-contact strings, organization labels, generated settlement operators, and runtime/player/account identities.

No live people/NPC content, normal content-lint registration, quest-contact migration, legacy `npc.*` normalization, generated people, settlement-operator change, Knowledge change, runtime behavior, UI, storage, commands, events, rewards, or gameplay implementation was added.

## Files Changed

- `docs/design/first-people-npc-content-seed-plan.md` - added the docs-only seed plan.
- `docs/dev/current-codex-output.md` - replaced with this run result.
- `docs/dev/current-gpt-handoff.md` - advanced the current anchor and next route.
- `docs/dev/project-roadmap.md` - marked `0.5.246` complete and `0.5.247` next.
- `docs/dev/codex-sequenced-implementation-plan.md` - advanced the ordered queue.
- `docs/design/pipeline-roadmap-consolidation-decision.md` - aligned the completed people/NPC seed plan and next conditional seed route.
- `docs/future_content_backlog.md` - recorded the run note and durable people/NPC seed-plan pointer.

## Checks Run

- `git fetch origin` - passed.
- `git pull --ff-only origin master` - passed; already up to date.
- `git status --short` before editing - passed; clean.
- People/NPC schema, validator, focused test, schema-registration, normal content-lint, quest, settlement, generated-operator, player/account/runtime, Knowledge, religion, guild, and lineage/ancestry boundary audits - completed by read-only inspection.
- Temporary artifact audit - passed; `docs/dev/tmp-npc-social-systems-research-2026-06-20.md` remains absent.
- `node --test tests\unit\people-npc-validation.test.mjs` - passed; 75 tests.
- `npm.cmd run tool:content-lint` - passed; `content-lint: ok (59 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` - failed on the known unrelated Knowledge subject vocabulary assertion at `tests/unit/schema-files.test.mjs:292` (`true !== false` for the existing `sacred_site` expectation). The person and NPC schemas parsed successfully before that failure.
- `git diff --check` - passed with line-ending warnings on changed text files.
- Documentation scope audit - passed; no schema, validator, test, content JSON, normal content-lint registration, quest, settlement, generated-operator, Knowledge, lineage, guild, religion, player/account/runtime, UI, storage, command, event, reward, or gameplay files changed.
- People/NPC seed-plan authority audit - passed; this pass creates planning only and does not authorize live content by itself.
- Person/NPC boundary audit - passed; person identity and NPC overlay remain separate, with people-only first recommended and NPC overlays deferred.
- Non-inference audit - passed; quest contacts, `npc.*` strings, generated operators, combatants, player/account identities, Knowledge labels, roles, titles, workplaces, deity/religion/order labels, and prose names remain insufficient evidence by themselves.
- Version-tracking audit - passed; `0.5.246` is complete and `Version 0.5.247 - First People And NPC Content Seed` is the next conditional recommendation.

## Behavior / Runtime Confirmation

No runtime, JSON live content, normal content-lint live content registration, loader, migration, schema, validator, focused test, quest, settlement, generated-operator, Knowledge, lineage, guild, religion, player/account/runtime, UI, storage/save-state, command, event, reward, or gameplay behavior changed.

The new plan is documentation only. It recommends a future people-only seed if explicit canonical named-person evidence exists; otherwise the correct future implementation result is to delay live content rather than infer from weak references.

## Risks / Follow-Up

- `Version 0.5.247 - First People And NPC Content Seed` is conditional and should proceed only if live people content is explicitly authorized.
- Under this plan, the first live implementation should be people-only. NPC overlays remain deferred unless a newer approved plan and implementation prompt explicitly supersede that posture.
- Current quest contact names and `npc.corin_ash` are not sufficient by themselves to seed people or NPC records.
- `tests/unit/schema-files.test.mjs` still has the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`; this pass did not change or fix it.
- `tests/unit/region-first-world-data.test.mjs` still has the unrelated direct-run BOM parsing issue noted by prior handoffs; it was not rerun or fixed in this docs-only pass.

## Next Recommended Version

Version 0.5.247 - First People And NPC Content Seed

## Suggested Commit Message

`docs(civilization): plan first people npc content seed`
