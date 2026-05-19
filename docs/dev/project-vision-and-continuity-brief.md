<!--
Converted from the repository DOCX continuity brief so GitHub Connector, Codex, and ChatGPT can inspect, search, diff, and cite the project vision directly.
Keep the DOCX as the formatted human-readable copy. Prefer this Markdown file as the repo-readable strategic index for AI-assisted development.
-->

# Lineage: Reforged - Strategic Continuity Brief

Updated 2026-05-19 after the development guidance cleanup and creation of `docs/design/future-system-design-ledger.md`.

## Purpose

This brief is the strategic north-star and source map for Lineage: Reforged. It should stay short enough for new ChatGPT and Codex threads to understand project identity, document authority, and active direction without carrying every durable design rule inline.

Detailed material now lives in specialized files:

- `docs/dev/current-codex-output.md` for exact latest Codex implementation state.
- `docs/dev/current-gpt-handoff.md` for current connector-side audits, immediate risks, and prompt guardrails.
- `docs/dev/project-roadmap.md` for version order, version-band maturity, playability checkpoints, and lightweight audit queue.
- `docs/design/future-system-design-ledger.md` for durable future-system criteria, vocabulary, conceptual boundaries, and open design questions.
- `docs/future_content_backlog.md` for chronological deferred work and historical run notes.

Older long-form material from the former continuity brief has been intentionally decomposed into the roadmap, current handoffs, backlog, and design ledger. Do not re-expand this file into a transcript or catch-all memory dump.

## Current Repo Anchor

Latest exact Codex handoff:

- `Version 0.5.63 - Backstory Legacy Purchase Runtime Shape`

Next recommended implementation version:

- `Version 0.5.64 - Backstory Legacy Purchase Content Draft`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Current high-risk refinement:

- `0.5.64` must not naively add live Backstory Legacy records to `legacy_unlocks.json` if they become visible or purchasable without an approved guard.
- `0.5.65` must not invent family context. Purchase ids and `familyId` must come from explicit scoped owners/helpers.

For exact current implementation state, inspect `docs/dev/current-codex-output.md` first. For current prompt guardrails, inspect `docs/dev/current-gpt-handoff.md` next.

## North Star

Lineage: Reforged is a grounded medieval-fantasy, dynasty-driven systemic RPG.

The project should not become a generic perk-tree RPG where every achievement becomes a universal account buff. Its strongest identity is persistent history: characters live, struggle, earn status, create records, found or continue families, alter local standing, and pass limited but meaningful inheritance into future play.

Every major system should answer at least one of these questions:

- What did this character do?
- Who remembers it?
- Which family owns it?
- Where is it recognized?
- What can be carried forward?
- What remains dangerous, limited, or uncertain despite inheritance?

## Product Identity

### What the game is

- A grounded medieval-fantasy RPG where actions, conditions, recovery, risk, and long-term progression shape the character.
- A dynasty and account-history game where individual runs matter even when they end badly.
- A systemic world game where settlements, regions, travel, economy, ecology, combat, magic, property, status, and history eventually interlock.
- A Legacy-driven RPG where the past opens options but does not erase the need to earn status, skill, local trust, and family legitimacy in-world.
- A project that should build slowly through narrow tested slices, strict validation, and owner-aware system boundaries.

### What the game is not

- Not a generic perk-tree RPG.
- Not a high-fantasy power fantasy where meta-currency bypasses world logic.
- Not a simulation sandbox that should implement every major world system at once.
- Not a UI-first redesign project where visuals destabilize logic.
- Not a backwards-compatibility project at this stage unless explicitly requested.

## Document Authority Map

Use this precedence when files disagree:

1. `docs/dev/current-codex-output.md` for exact latest implementation state.
2. `docs/dev/current-gpt-handoff.md` for current connector-side audits, immediate prompt guardrails, and near-term risks.
3. `docs/dev/project-roadmap.md` for active version order, version-band maturity, playability checkpoints, and tool routing.
4. `docs/design/future-system-design-ledger.md` for durable future-system criteria, vocabulary, boundaries, and open conceptual questions.
5. This brief for strategic north-star and source map.
6. `docs/future_content_backlog.md` for historical deferred notes and reminders.
7. Older `docs/design/*` plans for rationale and boundaries, unless newer handoffs supersede their exact sequence or state.

If a future Codex handoff conflicts with this brief, trust the newer Codex handoff for repo state and update this brief only if strategic direction changes.

## Active Pipeline

Keep the active implementation pipeline intact unless a newer handoff supersedes it:

| Version | Name | Intent | Key Guardrail |
| --- | --- | --- | --- |
| `0.5.64` | Backstory Legacy Purchase Content Draft | Author initial Backstory Legacy purchase records only if exposure is controlled. | Use draft-only records or add a minimal visibility/purchase guard. No resolver or creator wiring. |
| `0.5.65` | Backstory Legacy Purchase Resolver Integration | Pass owned purchase ids into resolver through the existing creator/resolver seam. | Explicit source of account purchase ids, family purchase ids, and `familyId`; no fake evidence. |
| `0.5.66` | Heirloom And Bequest Systems Plan | Plan material bequests separately from item-chain heirlooms and Bloodline traits. | Planning-only unless explicitly changed. |
| `0.5.67` | Bloodlines View Model Implementation Plan | Define pure projection of families, trees, and prestige summaries. | View-model first; no React sprawl. |
| `0.5.68` | Bloodlines Read-Only Account Meta UI | Render Bloodlines in the account meta / Chronicles surface. | Read-only; no family management, purchase execution, or resolver bypass. |

For version-band meaning and post-pipeline candidates, use `docs/dev/project-roadmap.md`.

## Core Development Rules

- Use current branch reality only. Inspect live code before proposing or implementing system changes.
- Prefer the smallest coherent patch that advances the current pipeline.
- Do not weaken validation unless the validator is demonstrably stale or wrong.
- Do not add old-save or old-account compatibility unless explicitly requested.
- Do not import design docs or draft catalogs into runtime code unless the pass is explicitly a live-content migration.
- Keep current data direct and validated.
- For complex systems, prefer design criteria, runtime shape, pure helpers, validation, view model, read-only UI, then mutating behavior.
- Pair major systems with readable payoff: feedback, UI clarity, progression consequence, and emotional meaning.

Durable design criteria now live in `docs/design/future-system-design-ledger.md`.

## Prompt Routing And Token Discipline

Every generated development prompt should include, outside the prompt body:

- recommended platform/tool/model
- reason for the recommendation
- manual preflight
- token posture
- whether research is needed
- whether Codex should use Plan Mode, Local, or Cloud

Default routing:

- ChatGPT via GitHub Connector: repo-aware inspection, handoff review, prompt prep, tiny docs edits.
- ChatGPT Deep Research: external/current/public research.
- ChatGPT Agent Mode: multi-step exploratory investigation.
- Codex 5.5 Plan Mode: non-mutating architecture plans.
- Codex 5.5 Local: real source/content/schema/UI edits and validation.
- Codex 5.5 Cloud: larger isolated repo tasks where cloud execution is justified.

Be token-aware, but do not sacrifice correctness, validation, architecture, or continuity to save tokens.

## High-ROI Tracks

Do not scatter these into unrelated patches. Use the roadmap and handoff to sequence them.

Near-term and high-value tracks:

- Backstory Legacy purchase content and resolver integration.
- Bloodlines view model and read-only presentation.
- Heirloom vs bequest planning.
- Combat/equipment audit before broad combat edits.
- Run-end / Chronicle impact summary.
- Difficulty and starting season creator page after creator scope stabilizes.
- Calendar/climate popup.
- Magic runtime readiness audit before runtime magic expansion.
- Economy clarity layer before full simulation.
- Context-aware actions after action ownership is clear.
- Failure feedback and soft tutorial through real system causes.

Major deferred tracks:

- home, land, gardening, ranching, and property
- living settlements, migration, prosperity, and supply/demand
- kingdoms, diplomacy, governance, conquest, and war
- full runtime magic expansion
- broad property/business/economy simulation

For detailed criteria, use `docs/design/future-system-design-ledger.md`.

## New Thread Starter

When starting a new ChatGPT thread, provide this note:

```text
I am continuing development of Lineage: Reforged.

Repo: vagabond1215/Lineage_Reforged
Default branch: master
Primary repo instruction file: AGENTS.md
Latest Codex handoff: docs/dev/current-codex-output.md
Current GPT handoff: docs/dev/current-gpt-handoff.md
Roadmap: docs/dev/project-roadmap.md
Future system design ledger: docs/design/future-system-design-ledger.md
Strategic continuity brief: docs/dev/project-vision-and-continuity-brief.md
Backlog: docs/future_content_backlog.md

Read current-codex-output first for exact implementation state.
Read current-gpt-handoff second for current connector-side guardrails.
Use the roadmap for version order and playability checkpoints.
Use the design ledger for durable conceptual criteria and vocabulary.
Use the continuity brief for north-star direction and source map.
Use the backlog for deferred work and historical run notes.

When I ask “inspect the push,” read docs/dev/current-codex-output.md first, then inspect changed/important files as needed.

When I ask “prompt please,” produce a routed, copy-paste-ready versioned prompt with platform/model recommendation, manual preflight, exact file list, allowed/forbidden changes, validation, and required handoff output.
```

## Maintenance Rules

- Keep this brief short.
- Do not use this brief as a transcript or full design archive.
- Move durable conceptual rules to `docs/design/future-system-design-ledger.md`.
- Move version sequencing to `docs/dev/project-roadmap.md`.
- Move current connector findings to `docs/dev/current-gpt-handoff.md`.
- Move deferred chronological notes to `docs/future_content_backlog.md`.
- Update this brief only when the north star, document authority map, or strategic source structure changes.
