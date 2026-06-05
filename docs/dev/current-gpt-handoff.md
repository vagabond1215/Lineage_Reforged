# Current GPT Handoff

Source route: Codex local audit pass after `Version 0.5.104 - Spell Hook Classification Audit`
Date: 2026-06-05
Branch/status assumption: `master`; normal `git pull` succeeded and reported already up to date. The worktree was clean before edits.

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
- `docs/design/spell-hook-classification-audit.md` is the temporary authority for constants cleanup, projection requirements, current drift risks, and legacy combat findings.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.104 - Spell Hook Classification Audit`

Immediate next version:

- `Version 0.5.105 - Spell Hook Support Constants Cleanup`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.104` to `0.6.0` unless the actual `0.6.x` runtime ownership milestone has been reached.

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

Current non-inference rule:

- Catalog presence, Arcane Compendium entries, `PlayerSpellState[]`, account/family/institution/document/item/source-run/heir/Legacy data, lineage, backstory, selected character UI state, and UI state do not imply known spell ownership, acquisition, command authority, target authority, conduit authority, catalyst authority, resource authority, or effect authority.

Current deferrals:

- Effectful casting, command handlers, UI dispatch, target resolution, resource payment, catalyst consumption/reservation, inventory mutation, runtime event creation, save/account/session mutation, control failure, backlash, broader acquisition routes, broader owner scopes, knowledge snippet runtime behavior, skill trial runtime behavior, magic study event runtime behavior, and `PlayerSpellState[]` replacement remain deferred.

## Active Guardrails For 0.5.105

Spell Hook Support Constants Cleanup:

- Use `docs/design/spell-hook-classification-audit.md` as the primary source.
- Establish one browser-safe canonical source for the current four authored classes: `runtime`, `classifier`, `deferred`, and `unknown`.
- Keep `tools/content-lint/combat-hook-support.mjs` as a separate broader combat capability registry.
- Keep engine `supported` and `unsupported` classifications as explicit caller policy rather than authored classes.
- Make lint and UI consume the shared source, or establish an exact automated parity boundary if direct sharing would violate package/browser boundaries.
- Add exact authored-inventory, UI-parity, combat-subset, and readiness precedence/collision tests.
- Preserve all hook ids, classes, spell compatibility statuses, readiness outcomes, UI output, and combat behavior.
- Do not fix legacy combat spell staging, multi-effect branch order, status approximations, or ownership gating in this cleanup.
- Do not add hook execution, promote spells, edit content JSON, edit schemas, alter UI presentation, or touch generated output.
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
| 6 | `0.5.105` | Spell Hook Support Constants Cleanup | `docs/design/spell-hook-classification-audit.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.105 - Spell Hook Support Constants Cleanup`, inspect:

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

## After 0.5.105

Proceed to `Version 0.5.106 - Pure Hook Support Projection Helper` only if constants and parity ownership are clean. Keep the helper pure, deterministic, six-class, and explicitly non-executable. Do not advance to `0.6.x` automatically.
