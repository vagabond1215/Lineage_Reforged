# Lineage: Reforged - Strategic Continuity Brief

Updated 2026-06-05 after `Version 0.5.104 - Spell Hook Classification Audit` landed.

## Purpose

This brief is the strategic north-star and source map for Lineage: Reforged. Keep it short. Detailed current state and implementation guidance live in the specialized repo docs.

## Source Map

- `docs/dev/current-codex-output.md` owns exact latest Codex implementation state.
- `docs/dev/current-gpt-handoff.md` owns current connector-side guardrails and prompt-prep direction.
- `docs/dev/project-roadmap.md` owns version order, version-band maturity, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the ordered near-term Codex queue.
- `docs/design/magic-runtime-boundary-plan.md` owns the cast-readiness helper boundary and later runtime guardrails.
- `docs/design/known-spell-acquisition-event-plan.md` owns the training-event acquisition helper boundary and later acquisition mutation constraints.
- `docs/design/magic-command-contract-plan.md` owns the future active magic command/intention boundary.
- `docs/design/first-narrow-runtime-cast-resolver-plan.md` owns the first narrow runtime cast resolver readiness boundary.
- `docs/design/magic-resolver-planned-output-envelope-plan.md` owns the inert planned-output-envelope boundary.
- `docs/design/spell-hook-support-expansion-plan.md` owns hook taxonomy, readiness classification, executable promotion criteria, and future hook-owner sequencing.
- `docs/design/spell-hook-classification-audit.md` is the temporary source for constants cleanup, projection requirements, and unresolved legacy combat ownership findings.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/design/skill-mastery-trial-framework-plan.md` owns skill trial and magic study-event planning constraints.
- `packages/schemas/player/knowledge_snippet.schema.json` is planning-only schema source for snippet-based knowledge progression; it is not runtime content loading.
- `docs/future_content_backlog.md` owns chronological deferred notes and run notes.

## Current Repo Anchor

Latest exact Codex handoff:

- `Version 0.5.104 - Spell Hook Classification Audit`

Next recommended version:

- `Version 0.5.105 - Spell Hook Support Constants Cleanup`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

## Current Implementation Reality

- Known spell ownership planning, helpers, validation helpers, acquisition-evidence helpers, read-only projection, blocker tests, boundary planning, cast-readiness helpers, acquisition event planning, training-event acquisition helpers, command contract planning, first narrow runtime cast resolver planning, resolver-readiness helpers, planned output-envelope policy, inert resolver envelope helpers, spell-hook support expansion planning, and spell-hook classification auditing have landed.
- `buildMagicCastReadiness(...)` is pure, deterministic, read-only, and exported through the game-engine boundary.
- `validateKnownSpellTrainingEventAcquisition(...)` and `buildKnownSpellRecordFromTrainingEvent(...)` are pure, deterministic, read-only, and exported through the game-engine boundary.
- `buildMagicCastResolverReadiness(...)` is pure, deterministic, read-only, and exported through the game-engine boundary.
- `buildMagicResolverInertEnvelope(...)` is pure, deterministic, read-only, and exported through the game-engine boundary.
- `docs/design/magic-resolver-planned-output-envelope-plan.md` defines planned resolver envelopes as inert result projections, not emitted events or side-effecting command results.
- `docs/design/spell-hook-support-expansion-plan.md` defines runtime-consumed, classifier, supported, deferred, unsupported, and unknown hook classes without making any hook executable.
- `docs/design/spell-hook-classification-audit.md` confirms spell lint as the authored classification authority, the current four authored classes, and the need for browser-safe constants cleanup before six-class projection.
- Runtime casting, command handling, acquisition mutation, save/account changes, UI work, broader ownership routes, broader acquisition routes, target resolution, effect application, resource payment, catalyst behavior, Chronicle/Renown hooks, skill trial runtime behavior, magic study event runtime behavior, and knowledge snippet runtime behavior remain deferred.
- Current `PlayerSpellState[]` remains readiness context, not a complete acquisition/ownership model.
- The project remains in foundation stabilization; validation and ownership boundaries remain higher priority than broad runtime expansion.

## North Star

Lineage: Reforged is a grounded medieval-fantasy, dynasty-driven systemic RPG. Its strongest identity is persistent history: characters live, struggle, earn status, create records, found or continue families, alter local standing, and pass limited but meaningful inheritance into future play.

Every major system should answer at least one of these questions:

- What did this character do?
- Who remembers it?
- Which family owns it?
- Where is it recognized?
- What can be carried forward?
- What remains dangerous, limited, or uncertain despite inheritance?

## Active Pipeline

| Version | Name | Intent | Key Guardrail |
| --- | --- | --- | --- |
| `0.5.98` | Magic Command Contract | Landed. Defined command/intention shape before resolver behavior. | Contract only; no runtime cast resolver, commands, UI, effects, or mutation. |
| `0.5.99` | First Narrow Runtime Cast Resolver Plan | Landed. Planned the first narrow engine-owned resolver readiness boundary. | Planning only; no UI dispatch, save mutation, resource payment, catalyst consumption, or event creation. |
| `0.5.100` | Runtime Cast Resolver Readiness Helper | Landed. Added a pure helper that consumes explicit command-like input, calls `buildMagicCastReadiness(...)`, and returns deterministic resolver issues. | Pure helper only; no effectful casting, command handlers, UI dispatch, save mutation, target resolution, resource payment, catalyst consumption/reservation, inventory mutation, or event creation. |
| `0.5.101` | Magic Resolver Planned Output Envelope Plan | Landed. Planned inert output-envelope policy before runtime events or effect application. | Planning only; no emitted events, effects, mutation, UI dispatch, or command handlers. |
| `0.5.102` | Magic Resolver Inert Envelope Helper | Landed. Added a pure inert envelope helper with explicit safety flags. | Pure projection only; no emitted events, effects, runtime dispatch, target resolution, resource payment, catalyst behavior, mutation, UI, or generated output. |
| `0.5.103` | Spell Hook Support Expansion Plan | Landed. Defined hook taxonomy, current readiness/inert-envelope behavior, executable promotion criteria, owner requirements, and future sequence. | Planning only; no generic hook execution, runtime effects, target resolution, events, resource/catalyst behavior, mutation, UI, or generated output. |
| `0.5.104` | Spell Hook Classification Audit | Landed. Reconciled spell lint, combat, engine readiness, UI presentation, and authored-hook classifications. | Documentation only; no source refactor, runtime behavior, content JSON, schema, or UI changes. |
| `0.5.105` | Spell Hook Support Constants Cleanup | Next. Establish a browser-safe authored classification source and exact parity/subset tests before projection. | Preserve all classifications and behavior; no hook execution, content changes, or legacy combat fixes. |

For the full queue, use `docs/dev/codex-sequenced-implementation-plan.md`.

## Core Development Rules

- Use current branch reality only.
- Prefer the smallest coherent patch that advances the current pipeline.
- Do not weaken validation unless the validator is demonstrably stale or wrong.
- Do not add old-save or old-account compatibility unless explicitly requested.
- Keep current data direct and validated.
- Patch numbers may exceed two digits inside the current band; do not roll from `0.5.102` to `0.6.0` unless the actual `0.6.x` milestone has been reached.
- For complex systems, prefer design criteria, runtime shape, pure helpers, validation, view model, read-only UI, then mutating behavior.

## New Thread Starter

```text
I am continuing development of Lineage: Reforged.

Repo: vagabond1215/Lineage_Reforged
Default branch: master
Primary repo instruction file: AGENTS.md
Latest Codex handoff: docs/dev/current-codex-output.md
Current GPT handoff: docs/dev/current-gpt-handoff.md
Roadmap: docs/dev/project-roadmap.md
Sequenced Codex plan: docs/dev/codex-sequenced-implementation-plan.md
Magic runtime boundary plan: docs/design/magic-runtime-boundary-plan.md
Known-spell acquisition event plan: docs/design/known-spell-acquisition-event-plan.md
Magic command contract plan: docs/design/magic-command-contract-plan.md
First narrow runtime cast resolver plan: docs/design/first-narrow-runtime-cast-resolver-plan.md
Magic resolver planned output envelope plan: docs/design/magic-resolver-planned-output-envelope-plan.md
Spell hook support expansion plan: docs/design/spell-hook-support-expansion-plan.md
Spell hook classification audit: docs/design/spell-hook-classification-audit.md
Future system design ledger: docs/design/future-system-design-ledger.md
Strategic continuity brief: docs/dev/project-vision-and-continuity-brief.md
Backlog: docs/future_content_backlog.md

Read current-codex-output first for exact implementation state.
Read current-gpt-handoff second for current connector-side guardrails.
Use the roadmap for version order and playability checkpoints.
Use the sequenced Codex plan for the current implementation queue.
Use the magic runtime boundary plan for cast-readiness helper and later runtime guardrails.
Use the known-spell acquisition event plan for training-event acquisition helper history and later acquisition mutation constraints.
Use the magic command contract plan for active magic command/intention constraints.
Use the first narrow runtime cast resolver plan for resolver-readiness and later resolver constraints.
Use the magic resolver planned output envelope plan for inert envelope constraints.
Use the spell hook support expansion plan for hook classification, readiness, executable-owner, and sequencing constraints.
Use the spell hook classification audit for constants cleanup, projection requirements, and current legacy combat findings.
Use the design ledger for durable conceptual criteria and vocabulary.
Use the continuity brief for north-star direction and source map.
Use the backlog for deferred work and historical run notes.

When I ask "inspect the push," read docs/dev/current-codex-output.md first, then inspect changed/important files as needed.

When I ask "prompt please," produce a routed, copy-paste-ready versioned prompt with platform/model recommendation, manual preflight, exact file list, allowed/forbidden changes, validation, and required handoff output.
```

## Maintenance Rules

- Keep this brief short.
- Move durable conceptual rules to `docs/design/future-system-design-ledger.md`.
- Move version sequencing to `docs/dev/project-roadmap.md` and `docs/dev/codex-sequenced-implementation-plan.md`.
- Move current connector findings to `docs/dev/current-gpt-handoff.md`.
- Move deferred chronological notes to `docs/future_content_backlog.md`.
