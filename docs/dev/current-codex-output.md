# Current Codex Output

Source version/run: Version 0.5.206 - NPC And Social Authority Boundary Decision
Date: 2026-06-20
Branch/status assumption: `master`; worktree was clean after successful `git fetch origin` and `git pull --ff-only origin master` at `a2711f1`.

## Result

Created `docs/design/npc-social-authority-boundary-decision.md` from the temporary NPC/social Deep Research artifact and corrected its assumptions through live repository inspection.

The decision selects future `civilization.people` as the first NPC/social implementation candidate, separates stable person identity from NPC overlays and social roles, assigns canonical non-kin relationships to dedicated link records, and keeps schedules/dialogue/rumors/companions descriptive or eligibility-only. It preserves workplace/economy/service authority and existing player fame/notoriety runtime ownership while deferring new social memory, relationship/favorability/standing, companion, dialogue, schedule, AI, and service behavior to `0.6+`.

## Files Changed

- `docs/design/npc-social-authority-boundary-decision.md`
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
- required-section and decision-posture audit - passed; all 22 required sections and 11 required decisions are explicit
- no tests run; documentation-only change

## Behavior / Runtime Confirmation

Documentation only. No content, schema, validator, test, Knowledge, economy/family/civic/travel/geography/religion/magic authority, runtime, UI, storage, NPC, dialogue, relationship, reputation, companion, schedule, service, quest/event/reward, or gameplay behavior changed.

## Risks / Follow-Up

- Quest giver names/entity ids, synthetic `npc_household`/`npc_individual` operators, combat NPCs, and role labels are not canonical people and must not be migrated by inference.
- Existing fame/notoriety mutation is a live player runtime owner; future static people/NPC records must not duplicate or drive it.
- Direct kin/care facts remain owned by future family kinship links, not general social relationship links.
- The temporary NPC/social research artifact remains temporary. The next schema-decision run must delete it if all useful guidance has been promoted, or name its next consumer and removal condition.
- The previously recommended `Version 0.5.205 - Magic Study Source Schema Decision` remains deferred and valid because it has not landed.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.207 - Person vs NPC Schema Decision

## Suggested Commit Message

docs(npc): decide social authority boundaries
