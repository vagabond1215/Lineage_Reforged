# Current Codex Output

Source version/run: Version 0.5.201 - Civic Authority Boundary Decision
Date: 2026-06-20
Branch/status assumption: `master`; worktree was clean after successful `git fetch origin` and `git pull --ff-only origin master` at `1dd7aef`.

## Result

Created `docs/design/civic-authority-boundary-decision.md` from the temporary civic Deep Research artifact and corrected its assumptions through live repository inspection.

The decision selects future `world.polities` as the first civic implementation candidate, separates polity from government and jurisdiction from law text, preserves existing guild and physical-place owners, keeps factions/guilds/institutions and diplomacy/conflict as distinct layers, and makes all first-pass civic authority descriptive-only. Player legal status, faction reputation, enforcement, guard AI, courts, wanted/bounty state, diplomacy runtime, and war/conflict simulation remain deferred to `0.6+`.

## Files Changed

- `docs/design/civic-authority-boundary-decision.md`
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
- required-section and decision-posture audit - passed; all 21 required sections and 11 required decisions are explicit
- no tests run; documentation-only change

## Behavior / Runtime Confirmation

Documentation only. No content, schema, validator, test, Knowledge, economy/family/geography/religion authority, runtime, UI, storage, legal-status, reputation, enforcement, diplomacy, conflict, or gameplay behavior changed.

## Risks / Follow-Up

- Existing settlement `administrativeRole`, map `conflictZones`, guild records, and derived settlement institution profiles are adjacent owners, not polity, government, jurisdiction, law, authored institution, or diplomatic-conflict authority.
- Jurisdiction authority must be decided before law-code or local-law schemas.
- The temporary civic research artifact remains temporary. The polity schema-decision run must delete it if all useful guidance has been promoted, or name its next consumer and removal condition.
- The uncompleted household/family and settlement-economy schema decisions remain deferred and valid after this user-prioritized civic pass.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.202 - Polity Schema Decision

## Suggested Commit Message

docs(civics): decide polity and law authority boundaries
