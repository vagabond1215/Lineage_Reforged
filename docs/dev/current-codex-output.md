# Current Codex Output

Source version/run: Version 0.5.191 - Sacred Site Knowledge Subject Support
Date: 2026-06-19
Branch/status assumption: `master`; worktree was clean before this run at `a43ac5b`.

## Result

Implemented direct `sacred_site` Knowledge subject vocabulary and validation support. Sacred-site subjects resolve only through `world.sacred_sites`, require the exact place-qualified id shape, and accept only active records.

The live planned Glasswake site remains rejected. Live Religion registry content, Knowledge snippets, sacred-site status, religious hotspots, and runtime behavior remain unchanged.

## Files Changed

- `packages/schemas/player/knowledge_snippet.schema.json`
- `packages/schemas/player/knowledge-domain-registry.schema.json`
- `tools/content-lint/knowledge-snippets.mjs`
- `tools/content-lint/index.mjs`
- `tests/unit/knowledge-snippets-validation.test.mjs`
- `tests/unit/knowledge-domain-registry-validation.test.mjs`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## Checks Run

- `node --test tests/unit/knowledge-snippets-validation.test.mjs` - passed, 89 tests
- `node --test tests/unit/knowledge-domain-registry-validation.test.mjs` - passed, 51 tests
- `npm run tool:content-lint` - passed, 58 files checked
- `git diff --check` - passed
- conflict-marker scan on changed files - passed
- trailing-whitespace scan on changed files - passed
- changed-path scope audit - passed; exactly 11 permitted files changed
- protected live-content and runtime audit - passed; no live content JSON or runtime paths changed
- sacred-site/registry/snippet/hotspot invariant audit - passed

`tests/unit/schema-files.test.mjs` was not changed, so its conditional focused run was not required.

## Behavior / Runtime Confirmation

Knowledge schemas now permit future `sacred_site` registry and snippet vocabulary. Normal Knowledge validation loads `world.sacred_sites`, enforces `sacred_site.<place>.<site>` identity, canonical resolution, and active-only eligibility.

No live content JSON changed. Religion still does not advertise `sacred_site` or `world.sacred_sites`; policy refs remain null. No Knowledge snippet or sacred-site status changed, the only site remains planned, and `religious_hotspot.lantern_shrine_gardens` remains planned and unreferenced. Hotspot `sacredSiteType` remains descriptive only.

No pilgrimage, favorability, alignment, law, religious-order, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, travel, runtime, UI, storage, command, event, reward, access, service, donation, or gameplay behavior changed.

## Risks / Follow-Up

- Subject support alone does not authorize a live snippet because Religion remains intentionally unaligned and the only site remains planned.
- Activation readiness must be decided before changing the site status.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.192 - Sacred Site Activation Decision

## Suggested Commit Message

feat(knowledge): add sacred site subject validation
