# Current GPT Handoff

<<<<<<< HEAD
Source route: Codex local implementation after `Version 0.5.100 - Runtime Cast Resolver Readiness Helper`
Date: 2026-06-04
=======
Source route: Connector cleanup after `Version 0.5.99 - First Narrow Runtime Cast Resolver Plan`
Date: 2026-06-03
>>>>>>> e1efcb4baca9e4149f6c43fcbfe98a3f5fbe4c87
Branch/status assumption: `master`; use `docs/dev/current-codex-output.md` for the exact latest Codex run state.

## Purpose

This file is the short current handoff for future ChatGPT/GitHub Connector, Deep Research, Agent Mode, or Codex prompt prep. It records only current guardrails and immediate direction; it is not a transcript, backlog, roadmap, or durable design ledger.

## Authority Rules

- `docs/dev/current-codex-output.md` is the exact latest Codex implementation handoff.
- `docs/dev/current-gpt-handoff.md` is the immediate prompt-prep handoff.
- `docs/dev/project-roadmap.md` owns version order, version-band meaning, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the current sequenced Codex queue.
- `docs/design/magic-runtime-boundary-plan.md` owns the `0.5.95` cast-readiness helper boundary.
- `docs/design/known-spell-acquisition-event-plan.md` owns the training-event acquisition helper boundary and later acquisition mutation constraints.
- `docs/design/magic-command-contract-plan.md` owns the active magic command/intention boundary.
- `docs/design/first-narrow-runtime-cast-resolver-plan.md` owns the first narrow runtime cast resolver readiness boundary.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/dev/project-vision-and-continuity-brief.md` owns the strategic north-star and source map.
- `docs/future_content_backlog.md` owns chronological deferred-work and run notes.

## Current Anchor

Latest landed Codex version:

- `Version 0.5.100 - Runtime Cast Resolver Readiness Helper`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Immediate next version:

<<<<<<< HEAD
- `Version 0.5.101 - Magic Resolver Planned Output Envelope Plan`
=======
- `Version 0.5.100 - Runtime Cast Resolver Readiness Helper`
>>>>>>> e1efcb4baca9e4149f6c43fcbfe98a3f5fbe4c87

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.99` to `0.6.0` unless the actual `0.6.x` runtime ownership milestone has been reached.

## Recent Magic Results

- `0.5.88` added known-spell ownership planning before active magic expansion.
- `0.5.89` through `0.5.92` added pure character-scoped known-spell ownership, validation, evidence, and read-only projection helpers.
- `0.5.93` added focused blocker tests proving current read-only spell surfaces and metadata helpers do not imply cast readiness.
- `0.5.94` added `docs/design/magic-runtime-boundary-plan.md` as the planning boundary for cast readiness.
- `0.5.95` added `buildMagicCastReadiness(...)` as a pure deterministic read-only helper.
- `0.5.96` added `docs/design/known-spell-acquisition-event-plan.md` as the planning-only boundary for training-event acquisition helpers.
- `0.5.97` added `validateKnownSpellTrainingEventAcquisition(...)` and `buildKnownSpellRecordFromTrainingEvent(...)` as pure deterministic helpers that propose in-memory `KnownSpellRecordState` records without mutation.
- `0.5.98` added `docs/design/magic-command-contract-plan.md` as the planning-only `magic.cast` command/intention boundary.
- `0.5.99` added `docs/design/first-narrow-runtime-cast-resolver-plan.md` as the planning-only boundary for a future engine-owned runtime cast resolver readiness helper.
<<<<<<< HEAD
- The resolver plan defines a future pure resolver request/result shape, required resolver gates, issue/blocker vocabulary, inert planned output envelopes, target/effect boundaries, resource/catalyst/failure policy boundaries, and exact scope for `0.5.100`.
- The resolver plan keeps command handlers, UI dispatch, effectful casting, target resolution, resource payment, catalyst consumption/reservation, inventory mutation, runtime event creation, save/account/session schema changes, control failure, backlash, broader acquisition routes, broader owner scopes, and `PlayerSpellState[]` replacement deferred.
- `0.5.100` added `buildMagicCastResolverReadiness(...)` and `MAGIC_CAST_RESOLVER_READINESS_ISSUE_CODES` as pure deterministic exports through the game-engine barrel.
- The resolver-readiness helper validates explicit command-like input, known-spell reference presence, target/source descriptors, casting context, runtime policy, resource/catalyst/failure policy refs when required, and then delegates to `buildMagicCastReadiness(...)`.
- The helper returns `ok`, `blocked`, `resolverRequestId`, optional `commandId`, optional `readiness`, and deterministic resolver issues without applying spell effects, mutating state, creating events, paying resources, consuming/reserving catalysts, resolving targets, registering commands, or wiring UI.
- Catalog presence, Arcane Compendium entries, `PlayerSpellState[]`, account/family/institution/document/item/source-run/heir/Legacy data, lineage, backstory, selected character UI state, and UI state do not imply known spell ownership.
- `characterKnowsSpell(...)` remains a pure read-only query helper and still counts only valid, available, character-owned records under existing query semantics.
- Arcane Compendium remains read-only and independent from known-spell ownership/acquisition evidence/projection.
- Current `PlayerSpellState[]` remains readiness/legacy context and is not a complete acquisition/ownership model.
- `0.5.100` changed source and tests only inside the pure magic readiness boundary plus narrow handoff docs: no spells, spell metadata, active spell casting, known-spell runtime wiring, persisted acquisition event creation, cast commands, command handlers, catalyst behavior, target resolution, resource payment, scroll/tome behavior, magic skill gain, Magic Legacy power, combat magic runtime, generated output, React UI, save schema, economy, loot, crafting, equipment, family, Bloodlines, Chronicle, estate, heir, heirloom, bequest, or Backstory Legacy behavior changed.
- Remaining known-spell/magic follow-up: planned output envelope policy, active casting, acquisition event mutation, conduit/catalyst/control implementation, scroll/tome/document teaching, Magic Legacy access lanes, broader ownership scopes/routes, and `PlayerSpellState[]` replacement remain deferred.
=======
>>>>>>> e1efcb4baca9e4149f6c43fcbfe98a3f5fbe4c87

Current non-inference rule:

- Catalog presence, Arcane Compendium entries, `PlayerSpellState[]`, account/family/institution/document/item/source-run/heir/Legacy data, lineage, backstory, selected character UI state, and UI state do not imply known spell ownership or casting authority.

Current deferrals:

- Effectful casting, command handlers, UI dispatch, target resolution, resource payment, catalyst consumption/reservation, inventory mutation, runtime event creation, save/account/session mutation, control failure, backlash, broader acquisition routes, broader owner scopes, and `PlayerSpellState[]` replacement remain deferred.

<<<<<<< HEAD
Calendar / climate:

- `0.5.81` finalized the planning-only Calendar/Climate popup view-model plan.
- `0.5.82` implemented `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` and `tests/unit/calendar-climate-presentation.test.mjs`.
- `0.5.83` rendered the existing Calendar/Climate projection in a compact read-only top-status popup.
- No actions, command ids, content loading, generated output, climate profile resolver, weather simulation, or active climate/weather/travel/crop/body-state effects were added.

Economy and Chronicle:

- `0.5.79` implemented the pure economy clarity projection and focused tests.
- `0.5.80` fixed the focused economy runtime/trade validation failures that appeared after `0.5.79`.
- `0.5.77` rendered Chronicle run-end projection read-only inside Account Meta / Chronicles.
- Future economy and Chronicle UI work must stay read-only unless explicitly re-scoped.

Typecheck tooling:

- `0.5.74` made typecheck commands honest and repeatable.
- Default UI and broad workspace typecheck targets still fail on known pre-existing blockers.
- Do not require broad typecheck unless a prompt specifically fixes those blockers.

## Active Guardrails For 0.5.101
=======
## Active Guardrails For 0.5.100
>>>>>>> e1efcb4baca9e4149f6c43fcbfe98a3f5fbe4c87

Magic Resolver Planned Output Envelope Plan:

- Use `buildMagicCastResolverReadiness(...)`, `docs/design/first-narrow-runtime-cast-resolver-plan.md`, `docs/design/magic-command-contract-plan.md`, `docs/design/magic-runtime-boundary-plan.md`, `docs/design/known-spell-acquisition-event-plan.md`, `docs/design/known-spell-ownership-plan.md`, and the focused known-spell/magic tests as the primary sources.
- Plan only the next inert output-envelope boundary unless the prompt explicitly scopes a pure helper.
- Keep any planned output envelopes non-emitted result data only.
- Preserve the existing read-only readiness and acquisition-helper boundaries.
- Preserve the explicit `magic.cast` command/intention descriptors from `docs/design/magic-command-contract-plan.md`.
- Do not wire command handlers or UI command dispatch.
- Do not write to save/account/session state, mutate known-spell collections, mutate inventory, or create persisted acquisition events.
- Do not implement effectful spell casting.
- Do not add active magic behavior, React UI, generated output, spell execution effects, combat actions, save schema changes, catalyst consumption, resource payment, magic skill gain, Magic Legacy power, scroll/tome/document teaching, or broader ownership/acquisition routes.
- Preserve character-scoped known-spell ownership only.
- Do not infer spell ownership, acquisition, command authority, target authority, conduit authority, catalyst authority, or resource authority from `PlayerSpellState[]`, Arcane Compendium entries, catalog presence, lineage, backstory, account id, family id, source run id, selected character UI state, Legacy data, item ownership, document ownership, scroll ownership, or tome ownership.

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
| 1 | `0.5.92` | Known Spell Read-Only Projection | `docs/dev/current-codex-output.md` | Landed |
| 2 | `0.5.93` | Magic Runtime Readiness Blocker Tests | `docs/dev/current-codex-output.md` | Landed |
| 3 | `0.5.94` | Magic Runtime Boundary Plan | `docs/design/magic-runtime-boundary-plan.md` | Landed |
| 4 | `0.5.95` | Magic Cast Readiness Helper | `docs/design/magic-runtime-boundary-plan.md` | Landed |
| 5 | `0.5.96` | Known Spell Acquisition Event Planning | `docs/design/known-spell-acquisition-event-plan.md` | Landed |
| 6 | `0.5.97` | Training Event Acquisition Helpers | `docs/design/known-spell-acquisition-event-plan.md` | Landed |
| 7 | `0.5.98` | Magic Command Contract | `docs/design/magic-command-contract-plan.md` | Landed |
| 8 | `0.5.99` | First Narrow Runtime Cast Resolver Plan | `docs/design/first-narrow-runtime-cast-resolver-plan.md` | Landed |
<<<<<<< HEAD
| 9 | `0.5.100` | Runtime Cast Resolver Readiness Helper | `packages/engines/game-engine/src/known-spells.ts` | Landed |
| 10 | `0.5.101` | Magic Resolver Planned Output Envelope Plan | `docs/design/first-narrow-runtime-cast-resolver-plan.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.101 - Magic Resolver Planned Output Envelope Plan`, inspect:
=======
| 9 | `0.5.100` | Runtime Cast Resolver Readiness Helper | `docs/design/first-narrow-runtime-cast-resolver-plan.md` | Next |

## Next Prompt Source Stack

For `Version 0.5.100 - Runtime Cast Resolver Readiness Helper`, inspect:
>>>>>>> e1efcb4baca9e4149f6c43fcbfe98a3f5fbe4c87

- `AGENTS.md`
- `README.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/design/first-narrow-runtime-cast-resolver-plan.md`
- `docs/design/magic-command-contract-plan.md`
- `docs/design/known-spell-acquisition-event-plan.md`
- `docs/design/magic-runtime-boundary-plan.md`
- `docs/design/known-spell-ownership-plan.md`
- `docs/design/future-system-design-ledger.md`
- `docs/future_content_backlog.md`
- `packages/engines/game-engine/src/known-spells.ts`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/magic-cast-resolver-readiness.test.mjs`
- `tests/unit/known-spell-training-event-acquisition.test.mjs`
- `tests/unit/known-spell-ownership.test.mjs`
- `tests/unit/magic-cast-readiness.test.mjs`
- `tests/unit/magic-runtime-readiness-blockers.test.mjs`
- `packages/content/base/player/spells.json`
- `packages/content/base/items/items.json`
- `tools/content-lint/spell-hook-support.mjs`
- `tools/content-lint/magic-metadata-support.mjs`

<<<<<<< HEAD
## After 0.5.101

Use the planned output envelope decision in `docs/dev/current-codex-output.md` to decide whether the next safe run is a pure envelope helper, another command/readiness guardrail, or a separate acquisition mutation plan.
=======
## After 0.5.100

Use the resolver readiness helper result in `docs/dev/current-codex-output.md` to decide whether the next safe run is another pure resolver guardrail, a command/readiness validation helper, or a later milestone-gated runtime implementation. Do not advance to `0.6.x` automatically.
>>>>>>> e1efcb4baca9e4149f6c43fcbfe98a3f5fbe4c87
