# Current Codex Output

Source version/run: v0.5.17 - Spellbook Read-Only UI Seam Audit
Date: 2026-05-13
Branch/status assumption: `master`; worktree was clean before the audit and before the output-file update.

## Result

Audited the RPG UI seams for a read-only spellbook / spell compatibility surface. The current magic baseline matches expectations: 55 authored spells, 23 ready, 5 partial, 27 deferred, 0 placeholder, 28 compatibility profiles, and 55 top-level `primaryFamily` values.

Implementation is safe now if the first UI slice is framed as an in-game Codex reference section, not as a player-owned spellbook. Use the existing Codex tab because it already owns reference-style lists, search/filter UI, detail panels, section counts, and generic pinning. Avoid Character, Legacy, launcher, and combat surfaces because those imply ownership, preparation, acquisition, account unlocks, or castability.

Recommended next run: `Version 0.5.18 - Spell Reference Codex Panel Implementation` using Codex Local.

## Files Changed

- `docs/dev/current-codex-output.md`

## Checks Run

- `git status --short`: clean before audit/output update
- Live `spells.json` baseline verification: 55 total, 23 ready, 5 partial, 27 deferred, 0 placeholder, 28 profiles, 55 primary families
- Inspected RPG UI shell/navigation and data flow: `InGameShell`, `CodexPanel`, `CharacterPanel`, `uiViewModel`, `GameSessionContext`, `SelectionList`, shared contracts, demo/new-game snapshots, gameplay codex sync, and relevant presentation tests
- Inspected magic docs/backlog context: `magic-system-charter.md`, `spellbook-expansion-blueprint.md`, `docs/future_content_backlog.md`
- `git diff --check`: passed

## Behavior / Runtime Confirmation

Audit/output-only. No source code, tests, content JSON, schemas, package files, README, CHANGELOG, backlog, runtime behavior, UI behavior, spell acquisition, castability, catalyst execution, affinity/resistance behavior, magic skill gain, Magic Legacy, or save/account schema changed.

## Audit Findings

- Best seam: add a `Spells` or `Spell Reference` section to the existing in-game Codex tab.
- Recommended data path: build static read-only spell entries from `packages/content/base/player/spells.json` into the existing `UiViewModel.codex` list/detail shapes.
- Keep this separate from `playerState.spells`, combat `spellActionGrants`, Legacy preparation, account unlocks, and save/schema state.
- Existing Codex behavior already supports list selection, details, search, section counts, and generic pinning; pinning a spell reference is acceptable if it remains a UI/session record and does not create known-spell state.
- Character panel is not the right first seam because its sections are player-owned runtime state and would imply known/owned spells.
- Launcher/Legacy surfaces are not safe for this slice because they suggest account progression, preparation, acquisition, or heir-start permissions.
- Content browser/debug tooling could show spell metadata, but it would not exercise the player-facing RPG UI seam.

## Allowed Future Display Fields

- Spell name and id
- Primary family
- School, tradition, discipline, and element where present
- Compatibility status and ready/partial/deferred state
- Compatibility profile summary
- Required, preferred, and discouraged compatibility tags
- Range, delivery, cast, control, and power tags already present in metadata
- Catalyst families already present in metadata
- Resolution hook summary by runtime/classifier/deferred/unknown classification
- Warning text for partial/deferred/runtime-blocked spells

## Forbidden Future Behavior

- Learned or known spell ownership
- Cast buttons or staged combat commands
- Spell slots, preparation, memorization, or active loadouts
- Catalyst execution or inventory consumption
- Runtime effect formulas, damage/heal/status execution, or combat behavior
- Acquisition sources, trainers, books, scrolls, or rewards
- Magic skill gain or progression mutation
- Magic Legacy power, starter spell grants, or account unlock behavior
- Save/account schema changes for spell ownership

## Future Implementation Scope

- Add a pure presentation helper, for example `apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts`, that imports `spells.json` and maps authored spell records to `ListItem`/detail groups.
- Add a Codex `spells` section and count in `uiViewModel.ts`; append static spell reference entries to `UiViewModel.codex.entries` without changing `SessionState.codexEntries`.
- Update `CodexPanel` initial selection and empty/filter copy to handle the new `spells` category.
- Use labels like `Spell Reference`, `Compatibility`, and `Runtime blocked`; avoid labels like `Known`, `Learned`, `Prepared`, `Available to Cast`, or `Owned`.
- Update `docs/future_content_backlog.md` during implementation with a concise run note because a previously deferred UI preview slice would be started.
- Overwrite `docs/dev/current-codex-output.md` during implementation.

## Tests Needed

- New focused presentation test for the spell compatibility mapper: count totals, maps ready/partial/deferred statuses, includes profile tags/catalyst families, and emits warnings for partial/deferred hooks.
- Codex view-model test proving the `spells` section appears with 55 entries and does not read from `playerState.spells`.
- Guard assertion that spell reference entries expose no cast/action/acquisition/known-spell fields.
- Existing checks: `npm.cmd run tool:content-lint`, focused spell metadata tests, focused UI presentation tests, and `git diff --check`.

## Risks / Follow-Up

- The primary risk is wording or placement that implies spells are known, owned, prepared, or castable. Mitigate by keeping the first slice in Codex as reference data and using explicit runtime-blocked warnings.
- Do not add a top-level Spellbook tab yet; that should wait until known-spell acquisition and ownership semantics exist.
- Combat already has learned-spell action paths; the Codex reference implementation must not connect to those command paths.
- A later narrower audit should cover known-spell acquisition before any true player spellbook or cast UI is attempted.

## Next Recommended Version

Version 0.5.18 - Spell Reference Codex Panel Implementation

## Suggested Commit Message

docs(magic): audit read-only spellbook UI seam
