# Lineage: Reforged - Strategic Continuity Brief

Updated 2026-06-03 after `Version 0.5.99 - First Narrow Runtime Cast Resolver Plan` landed, with follow-up cleanup keeping the next helper in the `0.5.x` line.

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
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/future_content_backlog.md` owns chronological deferred notes and run notes.

## Current Repo Anchor

Latest exact Codex handoff:

- `Version 0.5.99 - First Narrow Runtime Cast Resolver Plan`

Next recommended version:

- `Version 0.5.100 - Runtime Cast Resolver Readiness Helper`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

## Current Implementation Reality

- Known spell ownership planning, helpers, validation helpers, acquisition-evidence helpers, read-only projection, blocker tests, boundary planning, cast-readiness helpers, acquisition event planning, training-event acquisition helpers, command contract planning, and first narrow runtime cast resolver planning have landed.
- `buildMagicCastReadiness(...)` is pure, deterministic, read-only, and exported through the game-engine boundary.
- `validateKnownSpellTrainingEventAcquisition(...)` and `buildKnownSpellRecordFromTrainingEvent(...)` are pure, deterministic, read-only, and exported through the game-engine boundary.
- `docs/design/magic-command-contract-plan.md` defines the future `magic.cast` command/intention shape before resolver behavior.
- `docs/design/first-narrow-runtime-cast-resolver-plan.md` defines the future pure runtime cast resolver readiness boundary before effectful casting.
- The next magic slice is a pure runtime cast resolver readiness helper under `0.5.100`, not a `0.6.x` milestone transition.
- Runtime casting, command handling, acquisition mutation, save/account changes, UI work, broader ownership routes, and broader acquisition routes remain deferred.
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
| `0.5.96` | Known Spell Acquisition Event Planning | Landed. Defined acquisition event ownership and evidence boundaries before any acquisition mutation. | Planning-only; no acquisition creation or broader routes. |
| `0.5.97` | Training Event Acquisition Helpers | Landed. Added pure helper types/functions for validating explicit training-event acquisition input and proposing a known-spell record. | Pure helper only; no persisted acquisition events or state mutation. |
| `0.5.98` | Magic Command Contract | Landed. Defined command/intention shape before resolver behavior. | Contract only; no runtime cast resolver, commands, UI, effects, or mutation. |
| `0.5.99` | First Narrow Runtime Cast Resolver Plan | Landed. Planned the first narrow engine-owned resolver readiness boundary. | Planning only; no UI dispatch, save mutation, resource payment, catalyst consumption, or event creation. |
| `0.5.100` | Runtime Cast Resolver Readiness Helper | Next. Add a pure helper that consumes explicit command-like input, calls `buildMagicCastReadiness(...)`, and returns deterministic resolver issues. | Pure helper only; no effectful casting, command handlers, UI dispatch, save mutation, target resolution, resource payment, catalyst consumption/reservation, inventory mutation, or event creation. |

For the full queue, use `docs/dev/codex-sequenced-implementation-plan.md`.

## Core Development Rules

- Use current branch reality only.
- Prefer the smallest coherent patch that advances the current pipeline.
- Do not weaken validation unless the validator is demonstrably stale or wrong.
- Do not add old-save or old-account compatibility unless explicitly requested.
- Keep current data direct and validated.
- Patch numbers may exceed two digits inside the current band; do not roll from `0.5.99` to `0.6.0` unless the actual `0.6.x` milestone has been reached.
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
Use the first narrow runtime cast resolver plan for Version 0.5.100 - Runtime Cast Resolver Readiness Helper.
Use the design ledger for durable conceptual criteria and vocabulary.
Use the continuity brief for north-star direction and source map.
Use the backlog for deferred work and historical run notes.

When I ask “inspect the push,” read docs/dev/current-codex-output.md first, then inspect changed/important files as needed.

When I ask “prompt please,” produce a routed, copy-paste-ready versioned prompt with platform/model recommendation, manual preflight, exact file list, allowed/forbidden changes, validation, and required handoff output.
```

## Maintenance Rules

- Keep this brief short.
- Move durable conceptual rules to `docs/design/future-system-design-ledger.md`.
- Move version sequencing to `docs/dev/project-roadmap.md` and `docs/dev/codex-sequenced-implementation-plan.md`.
- Move current connector findings to `docs/dev/current-gpt-handoff.md`.
- Move deferred chronological notes to `docs/future_content_backlog.md`.
