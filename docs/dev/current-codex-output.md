# Current Codex Output

Source version/run: Version 0.5.216 - Settlement Authority Boundary Decision
Date: 2026-06-20
Branch/status assumption: `master`; worktree was clean after successful `git fetch origin` and `git pull --ff-only origin master` at `6ee6a8f`.

## Result

Created `docs/design/settlement-authority-boundary-decision.md` from the temporary settlement-space Deep Research artifact and corrected its assumptions through live repository inspection.

The decision preserves existing `world.settlements` as the canonical world-owned settlement identity authority; keeps districts optional and deferred; preserves generic civilization building, infrastructure, and workplace owners; plans a later separate placed `world.settlement_sites` layer; keeps services descriptive; separates property anchors from mutable ownership/storage; preserves specialized civic/religious/magic/Knowledge authorities; and separates local ports/gates/bridges from travel topology and runtime state.

## Files Changed

- `docs/design/settlement-authority-boundary-decision.md`
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
- required-section audit - passed; all 20 required sections are present
- required-decision audit - passed; all 11 decisions are explicit
- implementation-scope audit - passed; no content, schema, validator, test, runtime, UI, storage, or gameplay file changed
- no tests run; documentation-only change

## Behavior / Runtime Confirmation

Documentation only. No content, schema, validator, test, Knowledge, economy, crafting, item/equipment, combat, quest, magic, NPC/social, travel, geography, religion, family, civic, settlement, district, building, infrastructure, workplace, service, vendor, property, construction, ownership, runtime, UI, storage, or gameplay behavior changed.

## Risks / Follow-Up

- The live settlement schema is broad: identity/place fields coexist with descriptive population, economy, trade, infrastructure, racial-mix, and guild-presence fields. Future normalization must resolve ownership before moving or duplicating them.
- Existing `civilization.buildings` are reusable templates, not placed structures. A future `world.settlement_sites` decision must preserve that distinction.
- Existing settlement simulation and spatial/economy/institution projections are runtime consumers, not authored settlement identity.
- The temporary settlement research artifact remains temporary through the next settlement-identity schema-decision pass, which must delete it if fully promoted or name its next consumer and removal condition.
- The unlanded `Version 0.5.215 - Recipe And Production Schema Decision`, `Version 0.5.213 - Monster Record Schema Decision`, and `Version 0.5.210 - Weapon And Armor Profile Schema Decision` remain valid.
- The displaced Quest Objective And Condition Schema Decision remains valid and deferred.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.217 - Settlement Identity Schema Decision

## Suggested Commit Message

docs(world): decide settlement authority boundaries
