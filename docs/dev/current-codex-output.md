# Current Codex Output

Source version/run: v0.5.16 - Magic Readiness Documentation Cleanup
Date: 2026-05-13
Branch/status assumption: `master`; worktree was clean before edits and the live spell baseline matched the post-Beta expected counts.

## Result

Aligned current-facing magic readiness docs with the post-Beta spell catalog. The spellbook expansion blueprint now reports 23 ready, 5 partial, 27 deferred, 28 profiled spells, updates Beta-promoted spell statuses and Drain's profiled-partial status, and adds a Beta implementation-batch row. The magic system charter now points its recommended next prompt at a read-only spellbook compatibility UI readiness audit instead of the already-completed Phase 2 data-shape work.

## Files Changed

- `docs/design/spellbook-expansion-blueprint.md`
- `docs/design/magic-system-charter.md`
- `docs/dev/current-codex-output.md`

## Checks Run

- `git status --short`: clean before edits
- Live baseline verification from `spells.json`: 55 total, 23 ready, 5 partial, 27 deferred, 0 placeholder, 28 profiles, 55 primary families
- Stale-doc scan for pre-Beta current-facing counts/status prompts: no remaining matches in current magic docs
- `npm.cmd run tool:content-lint`: passed
- `node --test tests\unit\spell-compatibility-status.test.mjs tests\unit\spell-primary-family.test.mjs tests\unit\magic-metadata-support.test.mjs tests\unit\spell-hook-support.test.mjs`: passed, 45 tests
- `git diff --check`: passed

## Behavior / Runtime Confirmation

Docs-only cleanup. No README, CHANGELOG, backlog, source code, content JSON, schemas, package files, tests, runtime behavior, UI behavior, acquisition behavior, catalyst effects, affinity/resistance behavior, magic skill gain, Magic Legacy, save/account schema, or validator vocabulary changed.

## Risks / Follow-Up

- The next spellbook UI work should remain read-only and must not imply known-spell acquisition, castability, catalyst execution, or runtime effects.
- Historical backlog run notes still mention older counts by design; they were preserved as historical context.
- `spell-hook-support.test.mjs` still has an Alpha-named promoted-hook coverage helper, though all ready spells remain covered by compatibility validation.

## Next Recommended Version

Version 0.5.17 - Spellbook Read-Only UI Readiness Audit

## Suggested Commit Message

docs(magic): align readiness docs after beta profiles
