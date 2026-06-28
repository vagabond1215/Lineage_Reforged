# Current Codex Output

Source version/run: Version 0.5.245 - First Crafting Recipe Content Seed
Date: 2026-06-28
Branch/status assumption: `master`; fetched and fast-forward pulled from `origin/master` before editing; pull was already up to date. After the requested fetch/pull/status sequence, the worktree was clean before `0.5.245` edits.

## Result

Completed the first live planned crafting recipe content seed.

Added `packages/content/base/crafting/recipes.json` with 12 planned `standard` subtype recipes for deterministic item-key transformations across food, lumber, leather, textile, metal, and tool-component lanes. Each recipe uses existing item, workplace, tool, skill, and optional non-inheriting production-chain references only.

Registered the live crafting recipe content in normal content lint and added focused coverage for the live seed and registration.

No runtime crafting, inventory mutation, item-instance creation, UI, storage, commands, events, rewards, economy behavior, production-chain behavior, gameplay implementation, schema expansion, or broad validator behavior changed.

## Files Changed

- `packages/content/base/crafting/recipes.json` - added 12 planned standard recipe records.
- `tools/content-lint/index.mjs` - registered the live recipe content and dependency-backed recipe validation in normal content lint.
- `tests/unit/crafting-recipes-validation.test.mjs` - added focused live-seed and normal-lint registration assertions.
- `docs/dev/current-codex-output.md` - replaced with this run result.
- `docs/dev/current-gpt-handoff.md` - advanced the current anchor and next route.
- `docs/dev/project-roadmap.md` - marked `0.5.245` complete and `0.5.246` next.
- `docs/dev/codex-sequenced-implementation-plan.md` - advanced the ordered queue.
- `docs/design/pipeline-roadmap-consolidation-decision.md` - aligned the completed recipe seed and next NPC/person route.
- `docs/future_content_backlog.md` - recorded the run note and live crafting recipe authority status.

## Checks Run

- `git fetch origin` - passed.
- `git pull --ff-only origin master` - passed; already up to date.
- `git status --short` before editing - passed; clean.
- Direct recipe seed audit - passed; 12 records, sorted ids, all `planned`, all `standard`, no prerequisites, exactly one primary output per recipe, and no direct self-transformations.
- `node --test tests\unit\crafting-recipes-validation.test.mjs` - passed; 42 tests.
- `npm.cmd run tool:content-lint` - passed; `content-lint: ok (59 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` - failed on the known unrelated Knowledge subject vocabulary assertion at `tests/unit/schema-files.test.mjs:292` (`true !== false` for the existing `sacred_site` expectation). The new recipe schema parsed successfully before that failure.
- `git diff --check` - passed with line-ending warnings on changed text files.
- Runtime/economy/inventory scope audit - passed; no changes under `packages/engines`, `apps`, `packages/shared`, `packages/db`, `packages/schemas`, `packages/content/base/civilization`, `packages/content/base/items`, or `packages/content/base/player`.

## Behavior / Runtime Confirmation

Runtime behavior did not change.

This run adds static live recipe content plus validation registration only. The recipes remain planned descriptive authority records and do not consume inventory, create item instances, execute crafting, mutate production chains, affect markets, grant rewards, unlock recipes, or alter UI/storage/gameplay.

## Risks / Follow-Up

- The broad `schema-files` test still has the unrelated pre-existing Knowledge subject vocabulary failure around `sacred_site`; this run did not change or fix it.
- Recipe execution, inventory mutation, item-instance output, crafting UI, unlocks/history, station access, tool wear, quality/rarity/affixes, repair/salvage, alchemy, enchanting, Knowledge/trial effects, quests, markets, and economy simulation remain deferred.
- `Version 0.5.246 - First People And NPC Content Seed Plan` should stay planning-only unless explicitly scoped otherwise.

## Next Recommended Version

Version 0.5.246 - First People And NPC Content Seed Plan

## Suggested Commit Message

`feat(crafting): seed first recipe content`
