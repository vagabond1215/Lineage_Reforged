# Current Codex Output

Source version/run: Version 0.5.200 - Family Authority Boundary Decision
Date: 2026-06-20
Branch/status assumption: `master`; worktree was clean after successful `git fetch origin` and `git pull --ff-only origin master` at `c466c1f`.

## Result

Created `docs/design/family-authority-boundary-decision.md` from the temporary family/lineage Deep Research artifact and live repository inspection.

The decision selects future `civilization.households` as the first family-lane implementation candidate, assigns direct kin facts to future `civilization.kinship_links`, separates households, families, genealogical lineages, political/cultural overlays, and estates, reserves bloodlines for explicit canon, keeps static inheritance and family prestige descriptive-only, requires visibility/dispute metadata, and defers full player heirs, bequests, descendants, property transfer, and legacy continuation to `0.6+`.

## Files Changed

- `docs/design/family-authority-boundary-decision.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/future_content_backlog.md`

## Checks Run

- `git diff --check` - passed
- conflict-marker scan on changed files - passed
- trailing-whitespace scan on changed files - passed
- changed-path scope audit - passed; exactly six documentation files changed
- implementation-scope audit - passed; no content, schema, validator, test, runtime, UI, storage, or gameplay file changed
- required-section and decision-posture audit - passed
- no tests run; documentation-only change

## Behavior / Runtime Confirmation

Documentation only. No content, schema, validator, test, Knowledge, economy/geography authority, account family, Family Prestige, estate, source-run inheritance, runtime, UI, storage, or gameplay behavior changed.

## Risks / Follow-Up

- Current player `lineageId` means ancestry/species context, not genealogical lineage. The next decision must establish non-conflicting ids and references.
- Existing account family, prestige ledger, estate, source-run, and Bloodlines owners are mutable state/presentation, not static civilization authority. The next decision must prevent parallel ownership.
- The temporary family research artifact remains temporary. The next schema-decision run must delete it if all useful guidance has been promoted, or name its next consumer and removal condition.
- `Version 0.5.199 - Settlement Economy Schema Decision` remains deferred and valid; it was displaced by this user-prioritized family pass.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.201 - Household vs Family Schema Decision

## Suggested Commit Message

docs(family): decide authority boundaries
