# Current Codex Output

Source version/run: Version 0.5.214 - Crafting Authority Boundary Decision
Date: 2026-06-20
Branch/status assumption: `master`; worktree was clean after successful `git fetch origin` and `git pull --ff-only origin master` at `023b7e5`.

## Result

Created `docs/design/crafting-authority-boundary-decision.md` from the temporary crafting/production Deep Research artifact and corrected its assumptions through live repository inspection.

The decision selects future `crafting.recipes` for player-facing static transformations; preserves existing civilization production chains, embedded recipe profiles, workplaces, economy projections, item identity, guilds, and market values; uses direct item-key and workplace anchors initially; keeps tools item-owned; defers professions, quality/affixes, and player crafting state; treats alchemy/enchanting as future recipe subtypes; and reserves repair/salvage for separate future descriptive profile decisions.

## Files Changed

- `docs/design/crafting-authority-boundary-decision.md`
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
- required-section audit - passed; all 19 required sections are present
- required-decision audit - passed; all 11 decisions are explicit
- implementation-scope audit - passed; no content, schema, validator, test, runtime, UI, storage, or gameplay file changed
- no tests run; documentation-only change

## Behavior / Runtime Confirmation

Documentation only. No content, schema, validator, test, Knowledge, economy, item/equipment, combat, quest, magic, NPC/social, travel, geography, religion, family, civic, production-chain, runtime, UI, storage, crafting, inventory, item-state, market, vendor, repair, salvage, alchemy, enchanting, trial, Chronicle, or gameplay behavior changed.

## Risks / Follow-Up

- The live repository already has 121 embedded production-chain recipe profiles plus civilization craft/cost projections. Future recipes must not duplicate or silently replace them.
- Existing workplace tool tags are workforce/facility requirements, while portable tools are item identities. The next decision must define a resolvable reference contract.
- Current craft `skillQualityFactor` is an economy projection, not item-instance quality or affix authority.
- The temporary crafting research artifact remains temporary through the next recipe/production schema-decision pass, which must delete it if fully promoted or name its next consumer and removal condition.
- The unlanded `Version 0.5.213 - Monster Record Schema Decision` and `Version 0.5.210 - Weapon And Armor Profile Schema Decision` remain valid.
- The displaced Quest Objective And Condition Schema Decision remains valid and deferred.
- Do not roll to `0.6.0`.

## Next Recommended Version

Version 0.5.215 - Recipe And Production Schema Decision

## Suggested Commit Message

docs(crafting): decide crafting authority boundaries
