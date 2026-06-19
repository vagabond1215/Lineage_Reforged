# Current Codex Output

Source version/run: Version 0.5.190 - Sacred Site Knowledge Subject Decision
Date: 2026-06-19
Branch/status assumption: `master`; worktree was clean before this run at `7a1d928`.

## Result

Approved future direct `sacred_site` Religion Knowledge subjects in a documentation-only decision. Future references must resolve against `world.sacred_sites` and may target only active records.

Live Religion registry alignment, sacred-site activation, and the first snippet remain separate later steps. No Knowledge support was implemented.

## Files Changed

- `docs/design/sacred-site-knowledge-subject-decision.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git diff --check` - passed
- conflict-marker scan on changed docs - passed
- trailing-whitespace scan on changed docs - passed
- changed-path scope audit - passed; only the six permitted documentation files changed
- protected live JSON/Knowledge/schema/validator/runtime audit - passed; no protected paths changed
- sacred-site and registry invariant audit - passed; one planned sacred site remains, Religion remains unaligned, and the planned locality hotspot remains unreferenced

No tests were run because 0.5.190 changed documentation only.

## Behavior / Runtime Confirmation

No Knowledge support, schema, validator, test, snippet, Religion registry, sacred-site content/status, religious hotspot, runtime, UI, storage, or gameplay behavior changed.

Religion still does not advertise `sacred_site` or `world.sacred_sites`. The only sacred-site record remains planned. `religious_hotspot.lantern_shrine_gardens` remains planned and unreferenced, and hotspot `sacredSiteType` remains descriptive only.

## Risks / Follow-Up

- `0.5.191` must use in-memory aligned registry/site fixtures because live Religion remains intentionally unaligned.
- Subject support alone must not activate a site or authorize a snippet.
- Religion policy refs remain null.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.191 - Sacred Site Knowledge Subject Support

## Suggested Commit Message

docs(knowledge): decide sacred site subject support
