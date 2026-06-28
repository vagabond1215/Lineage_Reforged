# Current Codex Output

Source version/run: Version 0.5.247 - First People And NPC Content Seed
Date: 2026-06-28
Branch/status assumption: `master`; fetched and fast-forward pulled from `origin/master` before editing; pull was already up to date. The worktree was clean before `0.5.247` edits.

## Result

Completed the conditional first people/NPC content seed as a deferred, docs-only result.

The fresh audit found no explicit canonical named-person evidence that satisfies `docs/design/first-people-npc-content-seed-plan.md`. The observed named candidates remain quest contacts or legacy-shaped contact strings only, including Harbormaster Sel Varn, Foreman Mira Kell, Archivist-Provost Lysa Mar, Inspector Halwen Crest, and Corin Ash / `npc.corin_ash`; those sources are explicitly insufficient by the approved plan.

No `packages/content/base/civilization/people.json` was created. No `packages/content/base/civilization/npcs.json` was created. Normal content lint registration for people/NPC content remains deferred.

## Files Changed

- `docs/dev/current-codex-output.md` - recorded the `0.5.247` deferred seed result.
- `docs/dev/current-gpt-handoff.md` - updated immediate handoff and next route after the deferred seed.
- `docs/dev/project-roadmap.md` - marked `0.5.247` complete/deferred and moved the next recommendation to `0.5.248`.
- `docs/dev/codex-sequenced-implementation-plan.md` - aligned the ordered queue and guardrails after the deferred people seed.
- `docs/design/pipeline-roadmap-consolidation-decision.md` - aligned the consolidated sequence after `0.5.247`.
- `docs/future_content_backlog.md` - recorded the deferred people/NPC result and durable follow-up.

## Checks Run

- People/NPC evidence audit against quest contacts, `npc.*` references, generated settlement operators, lineage references, Knowledge/religion/guild references, and existing people/NPC paths - completed by read-only inspection.
- `node --test tests\unit\people-npc-validation.test.mjs` - passed; 75 tests.
- `npm.cmd run tool:content-lint` - passed; `content-lint: ok (59 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` - failed on the known unrelated Knowledge subject vocabulary assertion at `tests/unit/schema-files.test.mjs:292` (`true !== false` for the existing `sacred_site` expectation). The person and NPC schemas parsed before that failure.
- `git diff --check` - passed with Git line-ending warnings on changed text files.
- Conflict-marker scan on changed docs - passed.
- Trailing-whitespace scan on changed docs - passed.
- People/NPC content path audit - passed; both `packages/content/base/civilization/people.json` and `packages/content/base/civilization/npcs.json` are absent.
- Normal lint registration audit - passed; `tools/content-lint/index.mjs` still does not register `people-npcs.mjs`, `civilization/people.json`, or `civilization/npcs.json`.
- Runtime/source scope audit - passed; no `packages`, `apps`, `tools`, or `tests` files changed.

## Behavior / Runtime Confirmation

No runtime, JSON content, schema, validator, lint-index, UI, storage, command, event, reward, save/account, quest, Knowledge, lineage, guild, religion, generated operator, settlement, or gameplay behavior changed.

This run confirms that the correct `0.5.247` result is to leave people/NPC live content absent until explicit canonical named-person authority exists.

## Risks / Follow-Up

- First live `civilization.people` content remains deferred pending explicit canonical named-person evidence or an approved authored seed list.
- `civilization.npcs` remains deferred until canonical people exist and a later approved plan identifies stable authored presence/interaction overlays.
- Quest contact strings and `npc.corin_ash` remain presentation metadata only; they must not be promoted by inference.
- The pre-existing `schema-files.test.mjs` Knowledge `sacred_site` assertion failure remains unrelated to this run.

## Next Recommended Version

Version 0.5.248 - First Polity Content Seed Plan

## Suggested Commit Message

`docs(civilization): defer first people content seed`
