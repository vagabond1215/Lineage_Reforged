# Current Codex Output

Source version/run: Version 0.5.41 - Backstory Policy Metadata Plan
Date: 2026-05-14
Branch/status assumption: Current local branch reality; `git status --short` was clean before edits.

## Result

Added a non-runtime backstory policy metadata draft and focused validation tests for future Background Legacy unlock work.

The new metadata lives under `docs/design/` so it remains clearly planning-only. It covers every current backstory id, records the future default/locked/rename/rewrite/special/convert decisions from the v0.5.40 audit, assigns one recommended primary background skill per relevant backstory, and records intended future evidence kinds without changing current creator behavior or starter skill application.

## Files Changed

- `docs/design/backstory-policy-metadata.json`
- `docs/design/backstory-policy-metadata.md`
- `tests/unit/backstory-policy-metadata.test.mjs`
- `docs/dev/current-codex-output.md`

## Metadata Shape

`docs/design/backstory-policy-metadata.json` uses:

- `schemaVersion`
- `status: "non_runtime_policy_draft"`
- `runtimeImportAllowed: false`
- `baseBackgroundSkillBonusDefault: 5`
- `futureStatusValues`
- `toneActionValues`
- `unlockEvidenceKindValues`
- `records`

Each record includes:

- `backstoryId`
- `futureStatus`
- `defaultUnlocked`
- `recommendedPrimaryBackgroundSkillId`
- `baseBackgroundSkillBonus`
- `unlockEvidenceKinds`
- `toneAction`
- `recommendedName`
- `notes`

`docs/design/backstory-policy-metadata.md` explicitly states that this is non-runtime planning metadata. It also states that `futureStatus` is not an executable creator availability state, is not a resolver contract, and must not be consumed directly by a future runtime resolver.

## Backstory Status Summary

Default-unlocked:

- `backstory.local`
- `backstory.vagabond`
- `backstory.exile`
- `backstory.farmhand`
- `backstory.amnesiac`

Rename candidates:

- `backstory.gutter_rat` -> `Street-Raised`
- `backstory.military_brat` -> `Garrison Ward`

Legacy-locked or rewrite/split planning records:

- `backstory.merchants_child`
- `backstory.craftsmans_child`
- `backstory.performer`
- `backstory.minor_noble`
- `backstory.carpenters_child`
- `backstory.village_hunter`
- `backstory.miners_kin`
- `backstory.scouts_ward`
- `backstory.scholars_apprentice`
- `backstory.temple_acolyte`
- `backstory.hedge_adept`

Special/converted:

- `backstory.isekai_outcast`: `special_non_default`, recommended in-world name `World-Stray`, future bonus `0`.
- `backstory.local_hero`: `convert_to_achievement`, recommended title-style name `Local Champion`, future bonus `0`.

## Validation / Tests Added

Added `tests/unit/backstory-policy-metadata.test.mjs` with coverage for:

- every current `backstories.json` id has exactly one policy record
- no policy record references a missing backstory id
- every `futureStatus`, `toneAction`, and `unlockEvidenceKinds` value belongs to the manifest's declared allowed-value arrays
- every non-retired/non-converted record references an existing skill id
- implementation-ready future backgrounds use `baseBackgroundSkillBonus: 5`
- at least one default-unlocked backstory exists
- the exact expected default-unlocked set is present
- rename candidates have non-empty `recommendedName`
- `backstory.isekai_outcast` is explicit as `special_non_default` with bonus `0`
- `backstory.local_hero` is explicit as `convert_to_achievement` with bonus `0`
- locked/rename/rewrite/special records declare unlock evidence kinds
- live runtime/source files do not import or reference `backstory-policy-metadata`

The live runtime/source non-import check includes:

- `apps/rpg-ui/src/game-shell/characterCreationCatalog.ts`
- `apps/rpg-ui/src/game-shell/characterCreationForm.ts`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `apps/rpg-ui/src/game-shell/components/CharacterCreationNarrativeScreen.tsx`
- `packages/engines/game-engine/src/legacy-unlocks.ts`
- `packages/content/base/player/legacy_unlocks.json`

## Checks Run

- `git status --short`: run before edits; clean.
- `npm.cmd run tool:content-lint`: passed, `content-lint: ok (53 files checked)`.
- `node --test tests\unit\*backstory*.mjs tests\unit\*legacy*.mjs tests\unit\*creator*.mjs`: passed, 62 tests.
- `git diff --check`: passed. Git emitted the line-ending warning that `docs/dev/current-codex-output.md` will be normalized from LF to CRLF the next time Git touches it.

## Behavior / Runtime Confirmation

No runtime behavior changed.

This pass did not change character creator behavior, save/account schemas, Legacy runtime, starter skill application, progression gates, combat, magic, launcher UI, live backstory selection behavior, or `packages/content/base/player/backstories.json`.

The new manifest is planning-only and is not imported by live runtime/source files.

## Risks / Follow-Up

- This is not a runtime-safe resolver contract. A later implementation must define a reviewed runtime policy shape before enforcing creator availability.
- The manifest is validated by a focused unit test rather than a JSON schema, by design for this planning slice.
- `backstory.isekai_outcast`, `backstory.local_hero`, and the rename/rewrite candidates still need later content-edit passes before any runtime lock resolver should consume equivalent live policy.

## Next Recommended Version

Version 0.5.42 - Backstory Tone Rename Content Pass

## Suggested Commit Message

content(policy): add backstory policy metadata plan
