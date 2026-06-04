# Current GPT Handoff

Source route: Codex local docs pass after `Version 0.5.101 - Magic Resolver Planned Output Envelope Plan`
Date: 2026-06-04
Branch/status assumption: `master`; local `git pull` was attempted but blocked by local SSL certificate verification. The worktree was clean before edits; final status showed local `master` behind `origin/master` by one roadmap-only commit (`1c03067`), so remote sync should be repaired before committing or pushing this work.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/current-gpt-handoff.md` is the immediate prompt-prep handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the current sequenced Codex queue.
- `docs/design/magic-runtime-boundary-plan.md` owns the cast-readiness helper boundary.
- `docs/design/known-spell-acquisition-event-plan.md` owns the training-event acquisition helper boundary and later acquisition mutation constraints.
- `docs/design/magic-command-contract-plan.md` owns the active magic command/intention boundary.
- `docs/design/first-narrow-runtime-cast-resolver-plan.md` owns the first narrow runtime cast resolver readiness boundary.
- `docs/design/magic-resolver-planned-output-envelope-plan.md` owns the inert planned-output-envelope boundary.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.101 - Magic Resolver Planned Output Envelope Plan`

Immediate next version:

- `Version 0.5.102 - Magic Resolver Inert Envelope Helper`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.101` to `0.6.0` unless the actual `0.6.x` runtime ownership milestone has been reached.

## Recent Magic Results

- `0.5.88` through `0.5.92` added character-scoped known-spell ownership, validation, evidence, and read-only projection helpers.
- `0.5.93` added focused blocker tests proving current read-only spell surfaces and metadata do not imply cast readiness.
- `0.5.94` added `docs/design/magic-runtime-boundary-plan.md`.
- `0.5.95` added `buildMagicCastReadiness(...)` as a pure deterministic read-only helper.
- `0.5.96` added `docs/design/known-spell-acquisition-event-plan.md`.
- `0.5.97` added pure training-event acquisition proposal helpers.
- `0.5.98` added `docs/design/magic-command-contract-plan.md`.
- `0.5.99` added `docs/design/first-narrow-runtime-cast-resolver-plan.md`.
- `0.5.100` added `buildMagicCastResolverReadiness(...)` and `MAGIC_CAST_RESOLVER_READINESS_ISSUE_CODES` as pure deterministic exports through the game-engine barrel.
- `0.5.101` added `docs/design/magic-resolver-planned-output-envelope-plan.md` as the planning-only inert envelope policy.

Current non-inference rule:

- Catalog presence, Arcane Compendium entries, `PlayerSpellState[]`, account/family/institution/document/item/source-run/heir/Legacy data, lineage, backstory, selected character UI state, and UI state do not imply known spell ownership, acquisition, command authority, target authority, conduit authority, catalyst authority, or resource authority.

Current deferrals:

- Effectful casting, command handlers, UI dispatch, target resolution, resource payment, catalyst consumption/reservation, inventory mutation, runtime event creation, planned envelope helper implementation, save/account/session mutation, control failure, backlash, broader acquisition routes, broader owner scopes, knowledge snippet runtime behavior, skill trial runtime behavior, magic study event runtime behavior, and `PlayerSpellState[]` replacement remain deferred.

## Active Guardrails For 0.5.102

Magic Resolver Inert Envelope Helper:

- Use `docs/design/magic-resolver-planned-output-envelope-plan.md` as the primary source.
- Preserve `buildMagicCastResolverReadiness(...)` as the current pure readiness helper.
- Add only a pure inert planned-output-envelope helper if explicitly scoped.
- Planned envelopes are result projections only; they are not emitted runtime events, command results with side effects, persisted records, or stealth casting implementations.
- Do not emit events, dispatch commands, register commands, mutate save/account/session/inventory/combat/known-spell state, consume or reserve catalysts, pay resources, resolve targets, apply effects, create Chronicle/Renown/quest records, wire React UI, migrate schemas, or touch generated output.
- Keep resource, catalyst, failure, target, effect, Chronicle/Renown, magic study, skill trial, and knowledge snippet behavior deferred until owner boundaries exist.

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
| 1 | `0.5.97` | Training Event Acquisition Helpers | `docs/design/known-spell-acquisition-event-plan.md` | Landed |
| 2 | `0.5.98` | Magic Command Contract | `docs/design/magic-command-contract-plan.md` | Landed |
| 3 | `0.5.99` | First Narrow Runtime Cast Resolver Plan | `docs/design/first-narrow-runtime-cast-resolver-plan.md` | Landed |
| 4 | `0.5.100` | Runtime Cast Resolver Readiness Helper | `packages/engines/game-engine/src/known-spells.ts` | Landed |
| 5 | `0.5.101` | Magic Resolver Planned Output Envelope Plan | `docs/design/magic-resolver-planned-output-envelope-plan.md` | Landed |
| 6 | `0.5.102` | Magic Resolver Inert Envelope Helper | `docs/design/magic-resolver-planned-output-envelope-plan.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.102 - Magic Resolver Inert Envelope Helper`, inspect:

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/design/magic-resolver-planned-output-envelope-plan.md`
- `docs/design/first-narrow-runtime-cast-resolver-plan.md`
- `docs/design/magic-command-contract-plan.md`
- `docs/design/magic-runtime-boundary-plan.md`
- `docs/design/known-spell-acquisition-event-plan.md`
- `docs/design/known-spell-ownership-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/magic-cast-resolver-readiness.test.mjs`
- `tests/unit/magic-cast-readiness.test.mjs`
- `tests/unit/known-spell-training-event-acquisition.test.mjs`
- `tests/unit/known-spell-ownership.test.mjs`
- `tests/unit/magic-runtime-readiness-blockers.test.mjs`
- `packages/content/base/player/spells.json`
- `packages/content/base/items/items.json`
- `tools/content-lint/spell-hook-support.mjs`
- `tools/content-lint/magic-metadata-support.mjs`

## After 0.5.102

Use the inert envelope helper result in `docs/dev/current-codex-output.md` to decide whether the next safe run is another pure resolver guardrail, spell hook support expansion planning, or knowledge domain registry planning. Do not advance to `0.6.x` automatically.
