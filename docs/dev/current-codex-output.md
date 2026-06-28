# Current Codex Output

Source version/run: Version 0.5.254 - Settlement Site Schema Plan
Date: 2026-06-28
Branch/status assumption: `master`; initial worktree was clean before edits. `git fetch origin` passed. `git pull --ff-only origin master` returned Git's "Cannot fast-forward to multiple branches" error, but local `HEAD` and `origin/master` matched exactly; follow-up `git pull --ff-only` passed with "Already up to date."

## Result

Completed the docs-only settlement site schema plan.

Key outcome:

- `world.settlements` remains the settlement identity and broad place authority.
- Future `world.settlement_sites` should use a records-only strict authored schema posture when implemented later.
- Future site ids should use `settlement_site.<settlement_slug>.<site_slug>`, with `slug` as the lower-snake-case site slug only.
- The proposed future record requires exactly `id`, `slug`, `name`, `aliases`, `summary`, `parentSettlementId`, `parentDistrictId`, `siteType`, `functionalTags`, `placeRoleTags`, `status`, `sourceAuthorityNotes`, and `notes`.
- `parentDistrictId` is required as a nullable field; `null` remains valid when district authority is absent or the site is not district-scoped.
- Future `world.settlement_sites` normal lint remains unregistered until live site content exists.
- Building/workplace templates, settlement economy content, route/travel data, map/visual geometry, Knowledge snippets, sacred-site/hotspot records, runtime projections, UI, storage, commands, events, rewards, and gameplay systems do not create site authority by inference.

## Files Changed

- `docs/design/settlement-site-schema-plan.md` - added the docs-only future schema plan.
- `docs/dev/current-codex-output.md` - recorded the `0.5.254` result.
- `docs/dev/current-gpt-handoff.md` - updated immediate handoff and next route.
- `docs/dev/project-roadmap.md` - marked `0.5.254` complete and moved the next recommendation to `0.5.255`.
- `docs/dev/codex-sequenced-implementation-plan.md` - aligned the ordered queue after the site schema plan.
- `docs/future_content_backlog.md` - recorded the run note and durable settlement site follow-up.

## Checks Run

- `git status --short` before edits - clean.
- `git fetch origin` - passed.
- `git pull --ff-only origin master` - returned "Cannot fast-forward to multiple branches"; local `HEAD` equaled `origin/master`.
- `git pull --ff-only` - passed; already up to date.
- Local settlement authority audit - passed; live settlement content has `siteClass` and `siteContext` identity fields but no district, ward, placed-building, service-instance, or placed-site record fields.
- Candidate path audit - passed; `settlement_sites.json`, `settlement-site.schema.json`, `settlement-sites.mjs`, `settlement-site-validation.test.mjs`, and matching district implementation paths are absent.
- Adjacent authority audit - passed; buildings/workplaces are reusable definitions, travel and Knowledge stay separate, and sacred-site/religious-hotspot content remains specialized authority.
- `git diff --check` - passed with Git line-ending warnings on changed text files.
- Conflict-marker scan on changed files - passed.
- Trailing-whitespace scan on changed files - passed.
- Changed-path scope audit - passed; changed paths are docs-only.

## Behavior / Runtime Confirmation

Documentation only. No schema, validator, content JSON, normal content-lint registration, runtime behavior, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay behavior changed in this run.

No settlement site schema, validator, test, or content file was created.

## Risks / Follow-Up

- `Version 0.5.255 - Settlement District Schema And Validator` should implement only the future district schema, isolated validator, and focused in-memory tests.
- Future site candidates require explicit authored support in current content or an approved seed plan; settlement prose, runtime projections, building/workplace compatibility, route adjacency, map/visual evidence, Knowledge snippets, sacred-site/hotspot prose, quest metadata, and generic naming alone are not enough.
- The pre-existing `schema-files.test.mjs` Knowledge `sacred_site` assertion failure remains unrelated if encountered.

## Next Recommended Version

Version 0.5.255 - Settlement District Schema And Validator

## Suggested Commit Message

`docs(world): plan settlement site schema`
