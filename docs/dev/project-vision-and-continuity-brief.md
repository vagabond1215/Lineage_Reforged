# Lineage: Reforged - Strategic Continuity Brief

Updated 2026-06-02 after `Version 0.5.94 - Magic Runtime Boundary Plan` landed.

## Purpose

This brief is the strategic north-star and source map for Lineage: Reforged. Keep it short. Detailed current state and implementation guidance live in the specialized repo docs.

## Source Map

- `docs/dev/current-codex-output.md` owns exact latest Codex implementation state.
- `docs/dev/current-gpt-handoff.md` owns current connector-side guardrails and prompt-prep direction.
- `docs/dev/project-roadmap.md` owns version order, version-band maturity, and active pipeline direction.
- `docs/dev/codex-sequenced-implementation-plan.md` owns the ordered near-term Codex queue.
- `docs/design/magic-runtime-boundary-plan.md` owns the `0.5.95` cast-readiness helper boundary.
- `docs/design/future-system-design-ledger.md` owns durable future-system criteria and vocabulary.
- `docs/future_content_backlog.md` owns chronological deferred notes and run notes.

## Current Repo Anchor

Latest exact Codex handoff:

- `Version 0.5.94 - Magic Runtime Boundary Plan`

Next recommended version:

- `Version 0.5.95 - Magic Cast Readiness Helper`

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
- Known spell acquisition evidence helpers have landed as pure helpers for minimal `training_event` evidence.
- Known spell read-only projection has landed as a pure projection over explicit character-scoped known-spell records.
- Magic runtime readiness blocker tests have landed as test-only coverage proving current read-only spell surfaces and metadata do not imply cast readiness.
- Magic runtime boundary planning has landed as `docs/design/magic-runtime-boundary-plan.md`, defining the next pure cast-readiness helper boundary.
- Current `PlayerSpellState[]` remains readiness context, not a complete acquisition/ownership model.
- The next magic slice is a pure deterministic cast-readiness helper, not runtime casting.
- No economy clarity React UI, shop/trade/craft/caravan command UI, generated output, active magic behavior, runtime casting, cast commands, catalyst consumption, or broad economy/climate expansion has been added.

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
| `0.5.93` | Magic Runtime Readiness Blocker Tests | Landed. Added tests proving runtime magic remains blocked without required policy gates. | Focused blocker tests/scaffold only; no runtime casting, commands, React UI, save schema migration, or broader routes/scopes. |
| `0.5.94` | Magic Runtime Boundary Plan | Landed. Added planning-only boundary for a future pure cast-readiness helper. | Docs-only; no runtime casting, commands, UI, JSON, schema, save/account, catalyst consumption, or broader routes/scopes. |
| `0.5.95` | Magic Cast Readiness Helper | Next. Add a pure deterministic helper that reports readiness blockers without applying effects. | No effect application, resource payment, catalyst consumption, combat events, acquisition creation, or save mutation. |

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
Magic runtime boundary plan: docs/design/magic-runtime-boundary-plan.md
Future system design ledger: docs/design/future-system-design-ledger.md
Strategic continuity brief: docs/dev/project-vision-and-continuity-brief.md
Backlog: docs/future_content_backlog.md

Read current-codex-output first for exact implementation state.
Read current-gpt-handoff second for current connector-side guardrails.
Use the roadmap for version order and playability checkpoints.
Use the sequenced Codex plan for the current implementation queue.
Use the magic runtime boundary plan for Version 0.5.95 - Magic Cast Readiness Helper.
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
