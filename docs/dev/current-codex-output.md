# Current Codex Output

Source version/run: Version 0.5.91 - Known Spell Acquisition Evidence Helpers
Date: 2026-05-31
Branch/status assumption: Ran on `master`. Preflight was clean and even with `origin/master`; default `git pull` hit the known local SSL certificate validation issue, then `git -c http.sslBackend=schannel pull` fast-forwarded successfully and the branch remained even before edits.

## Result
Added a pure training-event acquisition evidence helper boundary on top of the existing character-scoped known-spell ownership helpers.

The new helper surface creates, validates, normalizes, and type-checks minimal `training_event` evidence only. Collection validation now reuses the evidence validator while preserving existing collection-level issue codes for missing ids, missing source, and unsupported evidence.

## Files Inspected
- `C:\Users\vagab\.codex\attachments\1d6a3be6-ccc5-4f64-9a5b-a4bda6343bf6\pasted-text.txt`
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
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/engines/game-engine/src/known-spells.js`
- `packages/engines/game-engine/src/index.ts`
- `packages/engines/game-engine/src/combat/index.ts`
- `apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts`
- `tools/content-lint/spell-hook-support.mjs`
- `tools/content-lint/magic-metadata-support.mjs`
- `tests/unit/known-spell-ownership.test.mjs`
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

## Known Spell Acquisition Evidence Helpers
Added exported pure helpers for the currently supported evidence shape:

- `validateKnownSpellTrainingEventEvidence(...)`
- `normalizeKnownSpellTrainingEventEvidence(...)`
- `isKnownSpellTrainingEventEvidence(...)`
- `createKnownSpellTrainingEventEvidence(...)`
- `KnownSpellTrainingEventEvidenceValidationResult`
- `KnownSpellTrainingEventEvidenceValidationIssue`
- `KnownSpellTrainingEventEvidenceValidationIssueCode`
- `CreateKnownSpellTrainingEventEvidenceParams`

The evidence boundary remains route-specific and minimal: `{ trainingEventId, sourceType: "training_event" }`. It does not introduce teacher, quest, scroll, tome, document, account, family, institution, item-instance, source-run, heir, or Legacy evidence behavior.

## Evidence Validation Rules
The evidence validator:

- accepts only object evidence
- requires a non-empty `trainingEventId`
- requires `sourceType: "training_event"`
- trims valid string fields in the normalized result
- rejects unsupported source types
- rejects extra future-route/source fields such as account, family, institution, document, item-instance, Legacy, or source-run evidence fields

Deterministic evidence issue codes now cover invalid evidence, missing training event id, missing source, unsupported source, and unsupported evidence fields.

## Record / Collection Integration
Single-record validation still treats `trainingEventEvidence` as optional record detail and does not require acquisition evidence by itself.

Collection validation still requires minimal evidence for otherwise-valid `training_event` records, but now delegates evidence shape checking to the dedicated evidence validator and maps evidence issues back to the existing collection-level issue vocabulary.

`characterKnowsSpell(...)` behavior remains unchanged: it is read-only and returns `true` only for matching valid, available, character-owned records.

## Tests
Expanded `tests/unit/known-spell-ownership.test.mjs` with focused coverage for:

- evidence validation and normalization
- create-helper default `sourceType`
- type guard behavior
- missing ids and missing source
- unsupported source type
- non-object evidence
- future-route-shaped evidence fields remaining blocked

Existing ownership, collection, read-only query, Arcane Compendium independence, and `PlayerSpellState[]` isolation tests remain in the same focused file.

## Behavior / Runtime Confirmation
No spells, spell metadata, active spell casting, known-spell runtime wiring, cast commands, catalyst behavior, scroll/tome behavior, magic skill gain, Magic Legacy power, combat magic runtime, generated output, UI, save schema, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior changed.

Arcane Compendium remains read-only and independent from known-spell ownership or acquisition evidence.

Current `PlayerSpellState[]` remains readiness/legacy context and is not treated as a complete acquisition or ownership model.

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
- family/institution/account/document ownership scopes remain deferred
- teacher, quest, discovered-record, item-instance, source-run, heir, and Legacy evidence routes remain deferred
- `PlayerSpellState[]` remains readiness/legacy context unless otherwise resolved

## Next Recommended Version
Version 0.5.92 - Known Spell Read-Only Projection

## Suggested Commit Message
feat(magic): add known spell acquisition evidence helpers
