# Current Codex Output

Source version/run: Version 0.5.92 - Known Spell Read-Only Projection
Date: 2026-06-01
Branch/status assumption: Ran on `master`. Preflight started clean and even with `origin/master`; default `git pull` hit the known local SSL certificate validation issue, then `git -c http.sslBackend=schannel pull` fast-forwarded to `16e6794` and `origin/master...HEAD` reported `0 0` before edits.

## Result
Added a pure read-only known-spell projection helper on top of the existing character-scoped known-spell validation boundary.

The projection consumes explicit known-spell records plus caller-supplied spell catalog records, reuses collection validation and training-event evidence validation, and returns deterministic available, blocked, and invalid-record summaries for later UI or runtime consumers.

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
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/engines/game-engine/src/known-spells.js`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/known-spell-ownership.test.mjs`
- `packages/content/base/player/spells.json`
- `packages/schemas/player/spell.schema.json`
- `apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts`
- `tests/unit/spell-hook-support.test.mjs`
- `tests/unit/spell-compatibility-status.test.mjs`
- `tests/unit/spell-primary-family.test.mjs`
- `tests/unit/magic-metadata-support.test.mjs`
- `tests/unit/arcane-compendium-presentation.test.mjs`
- `tests/unit/arcane-compendium-codex.test.mjs`

## Files Changed
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/known-spell-ownership.test.mjs`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Known Spell Read-Only Projection
Added `buildKnownSpellReadOnlyProjection(...)` plus exported projection params/result/entry types.

The result shape includes:

- `ok`
- `characterId`
- `knownSpellCount`
- `availableSpellCount`
- `blockedSpellCount`
- `invalidRecordCount`
- `knownSpells`
- `blockedSpells`
- `issues`

Projected entries stay minimal:

- `knownSpellId`
- `spellId`
- `characterId`
- `availability`
- `acquisitionRoute`
- `acquiredAt`
- `trainingEventId` when valid evidence is present
- `blockedReason` when present

`knownSpellCount` counts valid projected available plus blocked entries. `knownSpells` contains available records, while `blockedSpells` contains blocked records.

## Projection Rules
- Valid available records appear in `knownSpells`.
- Valid blocked records appear in `blockedSpells` and do not count as available.
- Invalid records produce deterministic `issues`, increase `invalidRecordCount`, and do not appear as known.
- The helper first runs `validateKnownSpellRecordCollection(...)` so duplicate ids, missing evidence, unsupported evidence, unknown spells, unsupported owner scopes, and unsupported routes use the existing collection/record validation path.
- `training_event` evidence remains the stronger gate for projection: record-level validation alone is not enough to project a record.
- If a collection contains both valid and invalid records, `ok` is `false`; valid records not implicated by validation issues may still appear in the read-only projection, while invalid indexes are skipped.
- Duplicate `knownSpellId` records fail through the existing duplicate collection issue and are skipped from projection.
- Catalog spell presence alone projects no entries.
- Projection output is stable for stable input order and does not mutate input records or catalog records.

## Ownership / Independence Confirmation
The projection does not infer ownership from catalog presence, Arcane Compendium, `PlayerSpellState[]`, account data, family data, institution data, document data, Legacy data, item or item-instance data, source-run data, heir data, lineage, backstory, selected character UI state, or any UI state.

The projection remains character-scoped only and supports only the current explicit `training_event` route.

## Query Helper Confirmation
`characterKnowsSpell(...)` remains pure/read-only and unchanged. It still returns `true` only for matching valid, available, character-owned records under the existing query semantics.

## Tests
Expanded `tests/unit/known-spell-ownership.test.mjs` with focused coverage for:

- available and blocked projection counts and entry shapes
- non-mutating projection behavior
- no ownership inference from catalog presence
- invalid records producing issues without being projected
- mixed valid/invalid projection behavior
- missing training-event evidence failing via collection validation
- duplicate `knownSpellId` records failing through collection validation
- unsupported owner scopes and acquisition routes staying blocked
- Arcane Compendium independence
- `PlayerSpellState[]` isolation from known-spell projection

## Behavior / Runtime Confirmation
No spells, spell metadata, active spell casting, known-spell runtime wiring, acquisition event creation, cast commands, catalyst behavior, scroll/tome behavior, magic skill gain, Magic Legacy power, combat magic runtime, generated output, React UI, save schema, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior changed.

No content JSON, schema, Arcane Compendium presentation source, combat runtime source, save/account schema source, or browser-facing app source was edited.

## Checks Run
- `node --test tests\unit\known-spell-ownership.test.mjs`
- `node --test tests\unit\spell-hook-support.test.mjs tests\unit\spell-compatibility-status.test.mjs tests\unit\spell-primary-family.test.mjs tests\unit\magic-metadata-support.test.mjs tests\unit\arcane-compendium-presentation.test.mjs tests\unit\arcane-compendium-codex.test.mjs`
- `git diff --check`

## Risks / Follow-Up
- acquisition event creation remains deferred
- active casting remains deferred
- conduit/catalyst/control policy remains deferred
- scroll/tome/document teaching remains deferred
- Magic Legacy access lanes remain deferred
- family/institution/account/document/item-instance/source-run/heir ownership scopes remain deferred
- teacher/quest/discovered-record routes remain deferred
- `PlayerSpellState[]` remains readiness/legacy context unless otherwise resolved

## Next Recommended Version
Version 0.5.93 - Magic Runtime Readiness Blocker Tests

## Suggested Commit Message
feat(magic): add known spell read-only projection
