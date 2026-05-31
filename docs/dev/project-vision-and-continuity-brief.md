# Lineage: Reforged - Strategic Continuity Brief

Updated 2026-05-30 after `Version 0.5.90 - Known Spell Validation Helpers` landed.

## Purpose

This brief is the strategic north-star and source map for Lineage: Reforged. Keep it short. Detailed current state and implementation guidance live in the specialized repo docs.

## Source Map

- `docs/dev/current-codex-output.md` owns exact latest Codex implementation state.
- `docs/dev/current-gpt-handoff.md` owns current connector-side guardrails and prompt-prep direction.
- `docs/dev/project-roadmap.md` owns version order, version-band maturity, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the ordered near-term Codex queue.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/future_content_backlog.md` owns chronological deferred notes and run notes.

## Current Repo Anchor

Latest exact Codex handoff:

- `Version 0.5.90 - Known Spell Validation Helpers`

Next recommended version:

- `Version 0.5.91 - Known Spell Acquisition Evidence Helpers`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

## Current Implementation Reality

- The low-risk account-scoped Backstory Legacy slice has landed.
- The Bloodlines projection and read-only account meta UI have landed.
- Chronicle run-end summary planning, pure projection, focused tests, and read-only Account Meta UI have landed.
- Typecheck script routing is explicit, but default UI and broad workspace typecheck targets still have known pre-existing blockers.
- Economy price clarity planning, pure projection, and focused tests have landed.
- The 0.5.80 economy runtime/trade validation triage restored the focused civilization economy validation path.
- Calendar/climate popup planning, pure projection, and read-only UI have landed.
- Character creation now uses the launcher AppShell with a left-sidebar summary, fixed-width step navigation, full-character randomization, no-selectable-backstory gating, and a total attribute matrix with contribution tooltips.
- Gameplay shell unification remains deferred.
- Combat equipment mapping audit has landed.
- `item.short_bow` now has a current ranged archery combat use profile for Hunter starter mapping.
- Known spell ownership planning has landed and chooses character-scoped known spells first.
- Known spell ownership helpers have landed as a pure character-scoped helper boundary with focused tests.
- Known spell validation helpers have landed as pure collection validation, duplicate id detection, and minimal training-event evidence validation.
- Current `PlayerSpellState[]` remains readiness context, not a complete acquisition/ownership model.
- Known spell acquisition evidence helpers are next and should remain pure helper/test work unless explicitly re-scoped.
- No economy clarity React UI, shop/trade/craft/caravan command UI, generated output, active magic behavior, or broad economy/climate expansion has been added.

## North Star

Lineage: Reforged is a grounded medieval-fantasy, dynasty-driven systemic RPG. Its strongest identity is persistent history: characters live, struggle, earn status, create records, found or continue families, alter local standing, and pass limited but meaningful inheritance into future play.

Every major system should answer at least one of these questions:

- What did this character do?
- Who remembers it?
- Which family owns it?
- Where is it recognized?
- What can be carried forward?
- What remains dangerous, limited, or uncertain despite inheritance?

## Product Identity

The game should build slowly through narrow tested slices, strict validation, and owner-aware system boundaries. It should not become a generic perk-tree RPG, a UI-first redesign project, or a broad simulation sandbox that implements every major world system at once.

## Active Pipeline

| Version | Name | Intent | Key Guardrail |
| --- | --- | --- | --- |
| `0.5.90` | Known Spell Validation Helpers | Landed. Added collection validation, duplicate id checks, and minimal training-event evidence validation. | Pure validation helpers/tests only; no casting, UI, save schema migration, catalyst behavior, scroll/tome behavior, Magic Legacy power, or broader ownership scopes. |
| `0.5.91` | Known Spell Acquisition Evidence Helpers | Next. Add training-event evidence helper boundaries. | Pure evidence helpers/tests only; no acquisition mutation, casting, UI, save schema migration, catalyst behavior, scroll/tome behavior, Magic Legacy power, or broader routes/scopes. |
| `0.5.92` | Post-evidence implementation TBD | Planned after `0.5.91` defines the next safe slice. | Follow `docs/dev/current-codex-output.md`. |

For the full queue, use `docs/dev/codex-sequenced-implementation-plan.md`.

## Core Development Rules

- Use current branch reality only.
- Prefer the smallest coherent patch that advances the current pipeline.
- Do not weaken validation unless the validator is demonstrably stale or wrong.
- Do not add old-save or old-account compatibility unless explicitly requested.
- Keep current data direct and validated.
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
Future system design ledger: docs/design/future-system-design-ledger.md
Strategic continuity brief: docs/dev/project-vision-and-continuity-brief.md
Backlog: docs/future_content_backlog.md

Read current-codex-output first for exact implementation state.
Read current-gpt-handoff second for current connector-side guardrails.
Use the roadmap for version order and playability checkpoints.
Use the sequenced Codex plan for the current implementation queue.
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
