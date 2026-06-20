# Current Codex Output

Source version/run: Version 0.5.195 - Sacred Site Active Text Cleanup
Date: 2026-06-19
Branch/status assumption: `master`; worktree was clean before this run at `a36cc2d`.

## Result

Cleaned stale status prose on exactly one active sacred-site record: `sacred_site.glasswake_shrine_lantern_gardens.glasswake_shrine`.

The summary now says `An active named shrine authority`, and the first note now says `Active descriptive authority only`. Status remains `active`; no other sacred-site field changed.

## Files Changed

- `packages/content/base/world/sacred_sites.json`
- `tests/unit/sacred-sites-validation.test.mjs`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## Checks Run

- `node --test tests/unit/sacred-sites-validation.test.mjs` - passed, 55 tests
- `node --test tests/unit/knowledge-snippets-validation.test.mjs` - passed, 89 tests
- `npm run tool:content-lint` - passed, 58 files checked
- `git diff --check` - passed
- conflict-marker scan on changed files - passed
- trailing-whitespace scan on changed files - passed
- changed-path scope audit - passed; exactly seven permitted files changed
- sacred-site two-field diff audit - passed; only the summary and first note changed
- registry/snippet/hotspot/runtime invariant audit - passed
- active-text audit - passed; no `planned` wording remains in the live site summary or notes

## Behavior / Runtime Confirmation

Only the active site's summary and first note changed. Its id, slug, name, status, place anchor, parent hotspot, religion ids, type, public posture, pilgrimage status, authority notes, and remaining notes are unchanged.

No Knowledge snippet was added and no Religion registry alignment occurred. Religion still does not advertise `sacred_site` or `world.sacred_sites`; policy refs remain null. No hotspot changed; `religious_hotspot.lantern_shrine_gardens` remains planned and unreferenced, and hotspot `sacredSiteType` remains descriptive only.

No pilgrimage, favorability, alignment, law, religious-order, spell, Magic Study, Prestige, family, NPC, inventory, map/grid, travel, runtime, UI, storage, command, event, reward, access, service, donation, or gameplay behavior changed.

## Risks / Follow-Up

- Registry alignment and the first sacred-site snippet must land together in the next narrow pass.
- The snippet must retain the approved named-site/non-duplication boundary.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.196 - Sacred Site Religion Registry And Snippet Seed

## Suggested Commit Message

content(world): clean active sacred site wording
