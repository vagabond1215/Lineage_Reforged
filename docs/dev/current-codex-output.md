# Current Codex Output

Source version/run: Version 0.5.88 - Known Spell Ownership Plan
Date: 2026-05-28
Branch/status assumption: Ran locally on `master`. Preflight worktree was clean and `master` was even with `origin/master` (`0 0`). Default `git pull` failed local SSL certificate validation; `git -c http.sslBackend=schannel pull` fast-forwarded `master` from `2814b9b` to `87dc35c`. Post-pull `master` was clean and even with `origin/master` before edits.

## Result
Updated the planning-only Known Spell Ownership Plan into a current `Version 0.5.88` source document and recorded the deferred magic ownership/runtime boundaries in the backlog.

## Files Inspected
- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/known-spell-ownership-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/content/base/player/spells.json`
- `packages/content/base/player/abilities.json`
- `packages/content/base/items/items.json`
- `packages/content/base/player/legacy_unlocks.json`
- `packages/schemas/player/spell.schema.json`
- `packages/schemas/player/ability.schema.json`
- `packages/schemas/items/item.schema.json`
- `packages/shared/types/src/contracts.ts`
- `packages/shared/types/src/combat.ts`
- `packages/engines/game-engine/src/combat/index.ts`
- `apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts`
- `tools/content-lint/spell-hook-support.mjs`
- `tools/content-lint/magic-metadata-support.mjs`
- `tests/unit/spell-hook-support.test.mjs`
- `tests/unit/spell-compatibility-status.test.mjs`
- `tests/unit/spell-primary-family.test.mjs`
- `tests/unit/magic-metadata-support.test.mjs`
- `tests/unit/arcane-compendium-presentation.test.mjs`
- `tests/unit/arcane-compendium-codex.test.mjs`

## Files Changed
- `docs/design/known-spell-ownership-plan.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Known Spell Ownership Plan
The plan chooses character-known spells as the first ownership model. Early known spells live on the current character/run through explicit character-scoped knowledge records; they do not persist after death or retirement unless a future inheritance/tradition evidence model is designed.

Account, family, institution, item, document, source-run, and heir-scoped ownership remain deferred.

## Acquisition Policy
A spell becomes known only through explicit character-scoped acquisition evidence. Safe early planning favors a pure `training_event` route, with `teacher` and `quest_event_reward` later when those owners can provide stable source ids.

Scroll/tome teaching, temporary document/item grants, discovered records, institution licensing, family tradition inheritance, Legacy-granted spell knowledge, and backstory/lineage starter spell bundles remain deferred.

## Legacy / Account / Family Boundaries
Magic Legacy must not grant direct spell power or free spell knowledge. Legacy, account unlocks, family tradition, institutions, scrolls, tomes, and documents may later unlock access lanes or study evidence, but they must not automatically create character-known spells.

The plan explicitly forbids inferring spell ownership from lineage, backstory, UI state, selected character, source run, account id, or family id alone.

## Data Shape Planning
The future owner record is planned around `knownSpellId`, `ownerScope`, `ownerId`, `characterId`, `spellId`, acquisition route/source fields, acquisition time/run/character fields, optional teacher/institution/source item/source event evidence, and an availability state such as available, blocked, forgotten, lost, or revoked.

Validation should require valid spell catalog ids, supported character owners, supported acquisition routes, required route evidence, and blocked unsupported/deferred/unknown hooks. Current-data-only policy applies; old-save compatibility is not required unless explicitly requested.

## Runtime Casting Blockers
- Known-spell check against a character-scoped record.
- Equipped conduit source and conduit tag resolution.
- Catalyst source plus consumption or persistence policy.
- Control capacity.
- MP, stamina, strain, and backlash/collateral cost handling.
- Combat versus noncombat context.
- Spell/effect lane ownership.
- Unsupported, deferred, and unknown hook behavior.
- UI command ownership and command validation.
- Save/current-data validation and tests proving blocked hooks remain blocked.

## First Safe Implementation Slice
Recommended next scope: `Version 0.5.89 - Known Spell Ownership Helpers`.

That slice should add pure known-spell ownership helper types/functions and focused tests only, supporting current-data character-scoped records, spell id validation, owner/acquisition validation, and a read-only `characterKnowsSpell(...)`-style helper. It should not wire combat casting, UI commands, save schema changes, catalyst behavior, scroll/tome behavior, Magic Legacy power, family inheritance, institution licensing, or document teaching.

## Behavior / Runtime Confirmation
No spells, spell metadata, known-spell runtime state, cast commands, catalyst behavior, scroll/tome behavior, magic skill gain, Magic Legacy power, combat magic runtime, active magic behavior, generated output, UI, save schema, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior changed.

This run changed planning docs only.

## Checks Run
- `git branch --show-current`
- `git status --short`
- `git rev-list --left-right --count origin/master...master`
- `git pull` (failed local SSL certificate validation)
- `git -c http.sslBackend=schannel pull`
- `git diff --check` (passed; Git reported expected LF-to-CRLF working-copy warnings)

Not run:
- `npm.cmd run tool:content-lint`, because no content or schema files were touched.
- Focused spell/magic/ability tests, because no source or test files were touched.
- Broad typecheck or generated output validation, per prompt.

## Risks / Follow-Up
- Current `PlayerSpellState[]` can still feed combat spell grants, but it is not a complete acquisition/ownership model and should be treated as readiness context until helpers/tests define the boundary.
- Keep scroll/tome/document teaching, temporary grants, institution licensing, family tradition inheritance, Magic Legacy access lanes, catalyst behavior, and active casting deferred until owner evidence and validation exist.

## Next Recommended Version
Version 0.5.89 - Known Spell Ownership Helpers

## Suggested Commit Message
docs(magic): plan known spell ownership
