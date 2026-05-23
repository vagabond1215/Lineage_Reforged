<!--
Converted from the repository DOCX continuity brief so GitHub Connector, Codex, and ChatGPT can inspect, search, diff, and cite the project vision directly.
Keep the DOCX as the formatted human-readable copy. Prefer this Markdown file as the repo-readable strategic index for AI-assisted development.
-->

# Lineage: Reforged - Strategic Continuity Brief

Updated 2026-05-22 after `Version 0.5.74 - Typecheck Script And Target Policy Cleanup` landed.

## Purpose

This brief is the strategic north-star and source map for Lineage: Reforged. It should stay short enough for new ChatGPT and Codex threads to understand project identity, document authority, and active direction without carrying every durable design rule inline.

Detailed material now lives in specialized files:

- `docs/dev/current-codex-output.md` for exact latest Codex implementation state.
- `docs/dev/current-gpt-handoff.md` for current connector-side audits, immediate risks, and prompt guardrails.
- `docs/dev/project-roadmap.md` for version order, version-band maturity, playability checkpoints, and lightweight audit queue.
- `docs/dev/codex-sequenced-implementation-plan.md` for the ordered near-term Codex queue.
- `docs/design/future-system-design-ledger.md` for durable future-system criteria, vocabulary, conceptual boundaries, and open design questions.
- `docs/future_content_backlog.md` for chronological deferred work and historical run notes.

Older long-form material from the former continuity brief has been intentionally decomposed into the roadmap, current handoffs, backlog, sequenced implementation plan, and design ledger. Do not re-expand this file into a transcript or catch-all memory dump.

## Current Repo Anchor

Latest exact Codex handoff:

- `Version 0.5.74 - Typecheck Script And Target Policy Cleanup`

Next recommended version:

- `Version 0.5.75 - Chronicle Run-End Summary View Model Plan`

Current sequence source:

- `docs/dev/codex-sequenced-implementation-plan.md`

Current phase:

- `v0.5.x` foundation stabilization / ownership hardening

Current implementation reality:

- The low-risk account-scoped Backstory Legacy slice has landed.
- Five low-risk Backstory Legacy records are live, purchasable, account-scoped, unlock-only records.
- Owned account-scoped Backstory Legacy purchases feed creator availability through `resolveOwnedBackstoryLegacyPurchaseIds(...)`.
- Each owned low-risk purchase makes only its matching formative backstory selectable.
- The creator does not infer or supply `familyId`.
- Family/source-run/region/institution/estate/title/heir/preparation-scoped Backstory Legacy evidence remains deferred.
- Higher-risk Backstory Legacy candidates remain deferred.
- Heirloom and bequest vocabulary/ownership boundaries are planned in `docs/design/heirloom-and-bequest-systems-plan.md`.
- The Bloodlines projection and read-only account meta UI have landed.
- Bloodlines currently shows explicit family records, Family Prestige ledger totals, family unlock summaries, linked run/tree summaries, safe empty state copy, and inactive future-system notes.
- Typecheck script routing is explicit: default `typecheck` delegates to the UI app, `typecheck:ui:node` passes, and `typecheck:workspace` is the broad root audit target.
- Default UI and broad workspace typecheck targets still fail on known pre-existing blockers, so future prompts should not require them as passing gates unless the task is specifically fixing those blockers.
- No Bloodlines mutation path, family management, Family Prestige earning/spending behavior, heirs, heirlooms, bequests, Chronicle Marks, Lineage Seals, scoped Backstory evidence, or generated output was added.

For exact current implementation state, inspect `docs/dev/current-codex-output.md` first. For current prompt guardrails, inspect `docs/dev/current-gpt-handoff.md` next. For version order, inspect `docs/dev/project-roadmap.md`.

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
4. `docs/dev/codex-sequenced-implementation-plan.md` for the ordered near-term Codex queue.
5. `docs/design/future-system-design-ledger.md` for durable future-system criteria, vocabulary, boundaries, and open conceptual questions.
6. This brief for strategic north-star and source map.
7. `docs/future_content_backlog.md` for historical deferred notes and reminders.
8. Older `docs/design/*` plans for rationale and boundaries, unless newer handoffs supersede their exact sequence or state.

If a future Codex handoff conflicts with this brief, trust the newer Codex handoff for repo state and update this brief only if strategic direction changes.

## Active Pipeline

Keep the active implementation pipeline aligned with the current roadmap and sequenced plan unless a newer handoff supersedes it:

| Version | Name | Intent | Key Guardrail |
| --- | --- | --- | --- |
| `0.5.74` | Typecheck Script And Target Policy Cleanup | Landed. Clarified root/app typecheck targets without weakening strictness. | Default and workspace typecheck targets still have known blockers; do not treat them as green gates yet. |
| `0.5.75` | Chronicle Run-End Summary View Model Plan | Map current run-ending data into a future read-only impact summary before projection, UI, or mutation. | Planning-only; do not change payout, estate delivery, Chronicle Marks, Lineage Seals, Family Prestige grants, Bloodlines behavior, or generated output. |
| `0.5.76` | Chronicle Run-End Summary Pure Projection | Planned. Implement a pure projection only after the 0.5.75 plan lands. | No UI or mutation; do not recompute payout. |
| `0.5.77` | Chronicle Run-End Read-Only UI | Planned. Render the tested projection read-only. | No payout mutation, estate delivery, Chronicle Marks, Lineage Seals, or Family Prestige grants. |

For the full 10-step queue, use `docs/dev/codex-sequenced-implementation-plan.md`. For version-band meaning and post-pipeline candidates, use `docs/dev/project-roadmap.md`.

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

Do not scatter these into unrelated patches. Use the roadmap, sequence plan, and handoff to sequence them.

Near-term and high-value tracks:

- Run-end / Chronicle impact summary.
- Remaining typecheck blocker tracks, kept separate from feature work.
- Combat/equipment audit before broad combat edits.
- Difficulty and starting season creator page after creator scope stabilizes.
- Calendar/climate popup.
- Magic runtime readiness audit before runtime magic expansion.
- Economy clarity layer before full simulation.
- Context-aware actions after action ownership is clear.
- Failure feedback and soft tutorial through real system causes.
- Future scoped Backstory Legacy evidence only after owner systems and storage seams exist.

Major deferred tracks:

- family management and full heir system
- heirlooms and bequests as runtime systems
- Chronicle Marks and Lineage Seals
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
Sequenced Codex plan: docs/dev/codex-sequenced-implementation-plan.md
Future system design ledger: docs/design/future-system-design-ledger.md
Strategic continuity brief: docs/dev/project-vision-and-continuity-brief.md
Backlog: docs/future_content_backlog.md

Read current-codex-output first for exact implementation state.
Read current-gpt-handoff second for current connector-side guardrails.
Use the roadmap for version order and playability checkpoints.
Use the sequenced Codex plan for the current 10-step implementation queue.
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
- Move version sequencing to `docs/dev/project-roadmap.md` and `docs/dev/codex-sequenced-implementation-plan.md`.
- Move current connector findings to `docs/dev/current-gpt-handoff.md`.
- Move deferred chronological notes to `docs/future_content_backlog.md`.
- Update this brief only when the north star, document authority map, strategic source structure, or current anchor becomes materially stale.
