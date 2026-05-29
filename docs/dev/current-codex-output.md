# Current Codex Output

Source version/run: Version 0.5.89 - Known Spell Ownership Helpers
Date: 2026-05-29
Branch/status assumption: Ran locally on `master`. Preflight worktree was clean and `master` was initially even with `origin/master`. Default `git pull` failed local SSL certificate validation; `git -c http.sslBackend=schannel pull` fast-forwarded `master` from `d56e8f5` to `440abf9`. Post-pull `master` was clean and even with `origin/master` (`0 0`) before edits.

## Result
Added the first pure known-spell ownership helper boundary for current-data character-scoped spell knowledge, plus focused tests proving the boundary remains independent from combat casting, Arcane Compendium projection, save schema, UI, catalyst behavior, and current `PlayerSpellState[]` readiness context.

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
- `packages/schemas/player/spell.schema.json`
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
- `packages/engines/game-engine/src/index.ts`
- `packages/engines/game-engine/src/backstory-legacy-purchases.ts`
- `packages/engines/game-engine/src/backstory-eligibility.ts`
- `packages/engines/game-engine/src/account-family.ts`
- `packages/engines/game-engine/src/legacy-account.ts`

## Files Changed
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/engines/game-engine/src/known-spells.js`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/known-spell-ownership.test.mjs`
- `docs/dev/current-codex-output.md`

## Known Spell Helper Boundary
The helper lives in `packages/engines/game-engine/src/known-spells.ts` with a matching `.js` bridge and game-engine index exports.

Added pure helper-facing types and constants for:

- `KnownSpellOwnerScope`, currently only `"character"`.
- `KnownSpellAcquisitionRoute`, currently only `"training_event"`.
- `KnownSpellAvailabilityState`, currently `"available"` and `"blocked"`.
- `KnownSpellRecordState`, a minimal current-data character-owned record shape.

The helper does not import spell JSON, UI code, combat runtime, design docs, content loaders, or `PlayerSpellState`. Callers supply spell catalog ids or records, so the boundary remains pure and non-mutating.

## Validation Rules
`validateKnownSpellRecord(...)` validates deterministic issue codes for:

- required `knownSpellId`, `ownerScope`, `ownerId`, `characterId`, `spellId`, `acquisitionRoute`, `acquiredAt`, and `availability`
- spell ids against the supplied current spell catalog
- `ownerScope` exactly `"character"`
- `acquisitionRoute` exactly `"training_event"`
- `availability` as `"available"` or `"blocked"`
- current character consistency by requiring `ownerId`, `characterId`, and optional query context to match

Unsupported account, family, institution, document, item-instance, source-run, heir, Legacy, scroll, tome, discovered-record, teacher, and quest/event routes are rejected by scope or route validation rather than treated as spell knowledge.

## Query Helper
`characterKnowsSpell(...)` is a read-only pure query helper. It returns `true` only when a supplied record validates as an available character-owned known-spell record for the requested character id and spell id.

Blocked records, unknown spell ids, mismatched characters, unsupported owner scopes, unsupported acquisition routes, and legacy `PlayerSpellState[]`-shaped entries return `false` and do not mutate input.

`createKnownSpellRecord(...)` is also pure: it builds the minimal supported character/training-event shape and returns the same validation result structure without writing runtime state.

## Tests
Added `tests/unit/known-spell-ownership.test.mjs`.

Focused coverage proves:

- valid character-scoped known-spell records pass
- unknown spell ids fail
- unsupported owner scopes fail
- unsupported acquisition routes fail
- missing required fields fail with deterministic issue codes
- owner and character ids must match the current character context
- unsupported availability states fail
- `characterKnowsSpell(...)` only returns true for matching available character-owned records
- blocked records do not count as known
- account/family/institution/document/Legacy-like records do not count as known
- Arcane Compendium projection remains independent from known-spell ownership
- current `PlayerSpellState[]` remains readiness/legacy context, not an acquisition model
- the helper source does not import content JSON, UI, combat, planning docs, or `PlayerSpellState`

## Behavior / Runtime Confirmation
No spells, spell metadata, active spell casting, known-spell runtime wiring, cast commands, catalyst behavior, scroll/tome behavior, magic skill gain, Magic Legacy power, combat magic runtime, generated output, UI, save schema, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior changed.

This run added pure helper code and focused tests only.

## Checks Run
- `git branch --show-current`
- `git status --short --branch`
- `git pull` (failed local SSL certificate validation)
- `git -c http.sslBackend=schannel pull`
- `git rev-list --left-right --count origin/master...master`
- `node --test tests\unit\known-spell-ownership.test.mjs`
- `node --test tests\unit\spell-hook-support.test.mjs tests\unit\spell-compatibility-status.test.mjs tests\unit\spell-primary-family.test.mjs tests\unit\magic-metadata-support.test.mjs tests\unit\arcane-compendium-presentation.test.mjs tests\unit\arcane-compendium-codex.test.mjs`
- `git diff --check` (passed; Git reported expected LF-to-CRLF working-copy warnings)

Not run:

- `npm.cmd run tool:content-lint`, because no content or schema files were touched.
- `npm.cmd run typecheck` or broad workspace validation, per prompt and known pre-existing blockers.
- Generated output validation, because no generated output was touched.

## Risks / Follow-Up
- Acquisition event creation remains deferred.
- Active casting remains deferred.
- Conduit/catalyst/control policy remains deferred.
- Scroll/tome/document teaching remains deferred.
- Magic Legacy access lanes remain deferred.
- Family, institution, account, document, item-instance, source-run, and heir ownership scopes remain deferred.
- `PlayerSpellState[]` remains readiness/legacy context and is not a complete acquisition/ownership model.
- Collection-level validation, such as duplicate `knownSpellId` detection and route-evidence validation beyond the minimal `training_event` route, should be handled in the next validation pass.

## Next Recommended Version
Version 0.5.90 - Known Spell Validation Helpers

## Suggested Commit Message
feat(magic): add known spell ownership helpers
