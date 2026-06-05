# Current GPT Handoff

Source route: Codex local implementation pass after `Version 0.5.105 - Spell Hook Support Constants Cleanup`
Date: 2026-06-05
Branch/status assumption: `master` at commit `6ed3fc9` before edits; the worktree was clean. `git pull` could not write `.git/FETCH_HEAD` because Git metadata is read-only in the current sandbox, so remote synchronization was not reverified in this run.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/current-gpt-handoff.md` is the immediate prompt-prep handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the current sequenced Codex queue.
- `docs/design/magic-runtime-boundary-plan.md` owns the cast-readiness helper boundary and hook-support runtime guardrails.
- `docs/design/known-spell-acquisition-event-plan.md` owns the training-event acquisition helper boundary and later acquisition mutation constraints.
- `docs/design/magic-command-contract-plan.md` owns the active magic command/intention boundary.
- `docs/design/first-narrow-runtime-cast-resolver-plan.md` owns the first narrow runtime cast resolver readiness boundary.
- `docs/design/magic-resolver-planned-output-envelope-plan.md` owns inert planned-output-envelope constraints.
- `docs/design/spell-hook-support-expansion-plan.md` owns hook taxonomy, readiness classification, executable promotion criteria, and future hook-owner sequencing.
- `docs/design/spell-hook-classification-audit.md` is the temporary authority for projection requirements and unresolved legacy combat findings.
- `packages/shared/types/src/spell-hook-support.ts` is the browser-safe authored hook classification authority.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.105 - Spell Hook Support Constants Cleanup`

Immediate next version:

- `Version 0.5.106 - Pure Hook Support Projection Helper`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.105` to `0.6.0` unless the actual `0.6.x` runtime ownership milestone has been reached.

## Recent Magic Results

- `0.5.88` through `0.5.92` added character-scoped known-spell ownership, validation, evidence, and read-only projection helpers.
- `0.5.93` added focused blocker tests proving current read-only spell surfaces and metadata do not imply cast readiness.
- `0.5.94` added `docs/design/magic-runtime-boundary-plan.md`.
- `0.5.95` added `buildMagicCastReadiness(...)` as a pure deterministic read-only helper.
- `0.5.96` added `docs/design/known-spell-acquisition-event-plan.md`.
- `0.5.97` added pure training-event acquisition proposal helpers.
- `0.5.98` added `docs/design/magic-command-contract-plan.md`.
- `0.5.99` added `docs/design/first-narrow-runtime-cast-resolver-plan.md`.
- `0.5.100` added `buildMagicCastResolverReadiness(...)`.
- `0.5.101` added `docs/design/magic-resolver-planned-output-envelope-plan.md`.
- `0.5.102` added `buildMagicResolverInertEnvelope(...)` plus explicit inert safety flags and focused tests.
- `0.5.103` added `docs/design/spell-hook-support-expansion-plan.md` with the six-class hook taxonomy, current readiness/inert-envelope behavior, executable promotion criteria, owner requirements, authoring rules, and future sequence.
- `0.5.104` added `docs/design/spell-hook-classification-audit.md`, confirming spell lint as the current authored authority, exact authored inventory and UI parity, the combat subset, caller-supplied readiness precedence risks, and legacy combat staging hazards.
- `0.5.105` added `packages/shared/types/src/spell-hook-support.{ts,js}` as the browser-safe authored authority, made lint and Arcane Compendium presentation consume it, added `AUTHORED_SPELL_HOOK_SUPPORT`, and added exact inventory, UI parity, combat subset, and readiness precedence/collision tests.

Current non-inference rule:

- Catalog presence, Arcane Compendium entries, `PlayerSpellState[]`, account/family/institution/document/item/source-run/heir/Legacy data, lineage, backstory, selected character UI state, and UI state do not imply known spell ownership, acquisition, command authority, target authority, conduit authority, catalyst authority, resource authority, or effect authority.

Current deferrals:

- Effectful casting, command handlers, UI dispatch, target resolution, resource payment, catalyst consumption/reservation, inventory mutation, runtime event creation, save/account/session mutation, control failure, backlash, broader acquisition routes, broader owner scopes, knowledge snippet runtime behavior, skill trial runtime behavior, magic study event runtime behavior, and `PlayerSpellState[]` replacement remain deferred.

## Active Guardrails For 0.5.106

Pure Hook Support Projection Helper:

- Use `docs/design/spell-hook-classification-audit.md` as the primary source.
- Use `packages/shared/types/src/spell-hook-support.ts` and `AUTHORED_SPELL_HOOK_SUPPORT` as the authored input boundary.
- Add a pure deterministic six-class projection from explicit hook ids and explicit `MagicCastReadinessHookSupport`-shaped policy input.
- Preserve current precedence: explicit map, runtime, classifier, supported, deferred, unsupported, unknown.
- Project classification authority, supported/blocking readiness effect, and source field without implying execution.
- Keep `supported` and `unsupported` as caller policy rather than authored classes.
- Do not alter current hook ids, authored classes, compatibility statuses, readiness outcomes, UI output, combat behavior, or item-generation policy.
- Do not fix legacy combat spell staging, multi-effect branch order, status approximations, or ownership gating.
- Do not add hook execution, active casting, target resolution, events, mutation, content JSON, schemas, React changes, or generated output.
- Preserve `buildMagicCastReadiness(...)`, `buildMagicCastResolverReadiness(...)`, and `buildMagicResolverInertEnvelope(...)` as pure deterministic helper boundaries.

Browser-safety guardrail:

- Avoid browser-facing UI changes.
- If any browser-facing app files are touched, keep app-side scans clean for `node:fs`, `readFileSync`, `load.*Content`, `civilization-engine/src/content`, `civilization-engine/src/index`, and unsafe `game-engine/src/index` imports.

Cross-system guardrails:

- Do not infer `familyId` from `lineageId`, `sourceRunId`, account id, selected character, selected backstory, or UI state.
- Do not let Bloodlines, bequests, heirlooms, estates, or UI state directly grant backstory identity.

## Sequenced Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` for the full queue. Current near-term sequence:

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.100` | Runtime Cast Resolver Readiness Helper | `packages/engines/game-engine/src/known-spells.ts` | Landed |
| 2 | `0.5.101` | Magic Resolver Planned Output Envelope Plan | `docs/design/magic-resolver-planned-output-envelope-plan.md` | Landed |
| 3 | `0.5.102` | Magic Resolver Inert Envelope Helper | `packages/engines/game-engine/src/known-spells.ts` | Landed |
| 4 | `0.5.103` | Spell Hook Support Expansion Plan | `docs/design/spell-hook-support-expansion-plan.md` | Landed |
| 5 | `0.5.104` | Spell Hook Classification Audit | `docs/design/spell-hook-classification-audit.md` | Landed |
| 6 | `0.5.105` | Spell Hook Support Constants Cleanup | `packages/shared/types/src/spell-hook-support.ts` | Landed |
| 7 | `0.5.106` | Pure Hook Support Projection Helper | `docs/design/spell-hook-classification-audit.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.106 - Pure Hook Support Projection Helper`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/magic-runtime-boundary-plan.md`
- `docs/design/first-narrow-runtime-cast-resolver-plan.md`
- `docs/design/magic-resolver-planned-output-envelope-plan.md`
- `docs/design/spell-hook-support-expansion-plan.md`
- `docs/design/spell-hook-classification-audit.md`
- `docs/design/magic-command-contract-plan.md`
- `docs/design/known-spell-ownership-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/engines/game-engine/src/index.ts`
- `packages/shared/types/src/spell-hook-support.ts`
- `packages/shared/types/src/spell-hook-support.js`
- `tests/unit/magic-resolver-inert-envelope.test.mjs`
- `tests/unit/magic-cast-resolver-readiness.test.mjs`
- `tests/unit/magic-cast-readiness.test.mjs`
- `tests/unit/spell-hook-support.test.mjs`
- `tests/unit/spell-compatibility-status.test.mjs`
- `tests/unit/combat-hook-support.test.mjs`
- `tests/unit/arcane-compendium-presentation.test.mjs`
- `packages/content/base/player/spells.json`
- `packages/content/base/items/items.json`
- `tools/content-lint/spell-hook-support.mjs`
- `tools/content-lint/combat-hook-support.mjs`
- `tools/content-lint/magic-metadata-support.mjs`
- `apps/rpg-ui/src/runtime/spellCompatibilityPresentation.ts`
- `packages/engines/game-engine/src/combat/index.ts`

## After 0.5.106

Make an explicit cleanup decision for `docs/design/spell-hook-classification-audit.md`. Promote only unresolved legacy combat ownership findings into a dedicated plan or current handoff before removing the temporary audit. Do not advance to executable hooks or `0.6.x` automatically.
