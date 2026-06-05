# Current Codex Output

Source version/run: Version 0.5.104 - Spell Hook Classification Audit
Date: 2026-06-05
Branch/status assumption: Ran on `master`. The worktree was clean before edits. Normal `git pull` succeeded and reported already up to date, confirming the prior SSL issue is resolved for the default Git path.

## Result

Completed the read-only spell-hook classification audit and added `docs/design/spell-hook-classification-audit.md`.

The audit confirms `tools/content-lint/spell-hook-support.mjs` as the current canonical authored-classification authority, with `magic-metadata-support.mjs` owning the ready-spell compatibility gate. Combat support remains a separate broader capability registry, engine `supported` and `unsupported` classes remain caller policy, and the Arcane Compendium remains a presentation consumer.

Current authored inventory is 55 spells, 56 unique resolution hooks, and 1 deferred item-generation hook. All authored hooks are known, UI classifications currently match the canonical four-class view, all 11 runtime-classified spell hooks are present in combat support, and no ready spell uses deferred or unknown hooks.

The next safe run is constants cleanup before six-class projection.

## Files Changed

- `docs/design/spell-hook-classification-audit.md`
- `docs/design/spell-hook-support-expansion-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`

## Checks Run

- `git pull` (passed: already up to date)
- Read-only authored hook inventory/classification probe (passed: 55 spells; 23 ready, 5 partial, 27 deferred; 56 unique resolution hooks; 1 deferred item-generation hook; 0 unknown hooks)
- Read-only UI/canonical and combat-subset comparison (passed: no authored UI classification mismatches; no runtime spell hooks missing from combat support)
- Read-only readiness precedence probe (confirmed explicit-map and iterable-set precedence, caller-supported unknown hooks, and absent collision diagnostics)
- Production-caller source search (confirmed no external production caller of `buildMagicCastReadiness(...)`; focused tests currently supply canonical hook support)
- `npm.cmd run tool:content-lint` (passed: 53 files checked)
- `node --test tests\unit\spell-hook-support.test.mjs tests\unit\spell-compatibility-status.test.mjs tests\unit\combat-hook-support.test.mjs tests\unit\arcane-compendium-presentation.test.mjs` (passed: 30 tests)
- `node --test tests\unit\magic-cast-readiness.test.mjs tests\unit\magic-cast-resolver-readiness.test.mjs tests\unit\magic-resolver-inert-envelope.test.mjs` (passed: 39 tests)
- Conflict-marker scan over touched direction docs (passed)
- Stale current-anchor scan for `0.5.104` still marked next or `0.5.103` still marked latest (passed)
- `git diff --check` (passed; Git reported LF-to-CRLF normalization warnings for edited tracked files)

## Behavior / Runtime Confirmation

Documentation only. No runtime source, React UI, content JSON, package schema, spell compatibility status, hook classification, combat behavior, readiness result, command handler, target resolution, spell effect, item generation, emitted event, resource payment, catalyst behavior, inventory mutation, save/account/session shape, Chronicle/Renown/quest output, knowledge behavior, skill trial behavior, or magic study behavior changed.

## Risks / Follow-Up

- `docs/design/spell-hook-classification-audit.md` is a temporary guardrail for `0.5.105` constants cleanup and `0.5.106` pure projection. Remove it or promote only unresolved findings after those runs consume it.
- The Arcane Compendium duplicates all four authored-classification lists. Current values match, but exact full parity tests do not yet prevent drift.
- `buildMagicCastReadiness(...)` accepts caller-supplied six-class support with precedence that can override canonical authored classification and provides no contradictory-input diagnostic.
- The legacy combat path stages catalog spells from `PlayerSpellState[]` without known-spell ownership or compatibility-status gating.
- `spell.shadow.healing.drain` is partial and carries both `heal.hp` and `damage.magic`; the legacy heal-before-damage branch order can heal its enemy target instead of resolving drain semantics.
- Do not fix the legacy combat findings during constants cleanup or pure projection. They require a later dedicated runtime ownership pass.
- Active casting, hook execution, target resolution, emitted events, effect owners, item generation, resource/catalyst/inventory mutation, Chronicle/Renown/quest outputs, and progression/study behavior remain deferred.

## Next Recommended Version

Version 0.5.105 - Spell Hook Support Constants Cleanup

## Suggested Commit Message

docs(magic): audit spell hook classifications
