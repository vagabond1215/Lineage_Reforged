# Current Codex Output

Source version/run: Version 0.5.189 - First Sacred Site Content Seed
Date: 2026-06-19
Branch/status assumption: `master`; worktree was clean before this run at `9235705`.

## Result

Added `packages/content/base/world/sacred_sites.json` with exactly one planned record: `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine`.

Registered the collection and pure semantic validator in normal content lint and updated focused live-seed coverage. Normal lint now checks 58 files.

## Files Changed

- `packages/content/base/world/sacred_sites.json`
- `tools/content-lint/index.mjs`
- `tests/unit/sacred-sites-validation.test.mjs`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## Checks Run

- `node --test tests/unit/sacred-sites-validation.test.mjs` - passed, 55 tests
- `npm.cmd run tool:content-lint` - passed, `content-lint: ok (58 files checked)`
- `git diff --check` - passed
- conflict-marker scan on changed files - passed
- trailing-whitespace scan on changed files - passed
- changed-path scope audit - passed; only the eight intended content, lint, test, and coordination paths changed
- sacred-site seed audit - passed; the records-only wrapper contains exactly the approved planned record and no forbidden authority fields
- protected content/schema/validator audit - passed; religions, hotspots, Knowledge content, and the existing schema/validator module are unchanged
- Religion registry/locality audit - passed; Religion does not advertise sacred sites and the locality remains planned and unreferenced
- normal-lint registration audit - passed; the new collection and dependency validation pass are registered
- runtime/UI/storage audit - passed; no protected runtime path changed
- next-route audit - passed; 0.5.190 remains a planning-only Knowledge subject decision

## Behavior / Runtime Confirmation

Authored sacred-site content and normal content-lint registration changed. No schema, validator-module, Knowledge subject support, Knowledge snippet, Religion registry, religious hotspot, runtime, UI, storage, or gameplay behavior changed.

The only sacred-site record is `planned`. `religious_hotspot.lantern_shrine_gardens` remains planned and unreferenced. Hotspot `sacredSiteType` remains descriptive metadata only.

No pilgrimage, favorability, alignment, law, religious-order, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, travel, command, event, or reward behavior was added.

## Risks / Follow-Up

- Planned sacred-site content is not eligible for Knowledge snippets.
- Religion does not yet advertise `sacred_site` or `world.sacred_sites`.
- The next run is a subject-vocabulary decision only and must not implement support or activation.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.190 - Sacred Site Knowledge Subject Decision

## Suggested Commit Message

content(world): seed first sacred site
