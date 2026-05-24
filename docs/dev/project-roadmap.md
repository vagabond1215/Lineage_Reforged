# Lineage: Reforged - Long-Term Project Roadmap

Last reviewed: 2026-05-22

This roadmap is a repo-readable planning document for long-term version direction, playability checkpoints, lightweight audit/planning passes, and major deferred systems. It complements:

- `AGENTS.md` for repository rules, version-label discipline, and tool routing.
- `docs/dev/current-codex-output.md` for the latest exact Codex implementation handoff.
- `docs/dev/current-gpt-handoff.md` for current connector-side audits, immediate risks, and prompt guardrails.
- `docs/dev/codex-sequenced-implementation-plan.md` for the ordered near-term Codex queue after the current handoff.
- `docs/design/future-system-design-ledger.md` for durable future-system criteria, vocabulary, boundaries, and open conceptual questions.
- `docs/dev/project-vision-and-continuity-brief.md` for the strategic north star and source map until the brief is fully decomposed.
- `docs/future_content_backlog.md` for deferred content and historical run notes.

The current Codex handoff controls exact current version state. The current GPT handoff controls immediate connector-side guardrails. This roadmap controls version order, maturity bands, playability checkpoints, and lightweight audit/source indexing. The sequenced implementation plan gives Codex a concrete ordered queue. The design ledger controls durable conceptual criteria.

## 1. Current Anchor

Current live anchor:

- Latest landed version: `Version 0.5.74 - Typecheck Script And Target Policy Cleanup`
- Next recommended version: `Version 0.5.75 - Chronicle Run-End Summary View Model Plan`
- Current near-term sequence source: `docs/dev/codex-sequenced-implementation-plan.md`
- Current phase: `v0.5.x` foundation stabilization / ownership hardening

Current repo reality:

- Family-scoped unlock ownership shape exists.
- Family unlock ownership is current-data only and defaults empty.
- Five low-risk Backstory Legacy records are live account-scoped unlock-only records in the Legacy catalog.
- Owned account-scoped Backstory Legacy purchases feed creator availability through `resolveOwnedBackstoryLegacyPurchaseIds(...)`.
- Each of the five live account-owned Backstory Legacy purchases makes only its matching formative backstory selectable.
- Higher-risk Backstory Legacy candidates remain locked, hidden, special, or deferred.
- The creator does not infer or supply `familyId`; family/source-run/scoped Backstory Legacy evidence remains deferred.
- Heirloom and bequest vocabulary/ownership boundaries are planned in `docs/design/heirloom-and-bequest-systems-plan.md`.
- A pure read-only Bloodlines projection exists in `apps/rpg-ui/src/game-shell/bloodlinesPresentation.ts`.
- The account meta / launcher surface renders a read-only Bloodlines section beside Legacy and Chronicles.
- Bloodlines currently presents explicit family records, Family Prestige ledger totals, family unlock summaries, linked run/tree summaries, safe empty state copy, and inactive future-system notes.
- Typecheck script routing is now explicit: default `typecheck` delegates to the UI app, `typecheck:ui:node` passes, and `typecheck:workspace` is the broad root audit target.
- Default UI and broad workspace typecheck targets still fail on known pre-existing blockers; focused tests remain the current confidence path.
- Family Prestige earning/spending behavior is not implemented yet.
- Family management, heirs, heirlooms, bequests, item-instance persistence, estate transfer/claim execution, Chronicle Marks, Lineage Seals, and scoped Backstory evidence remain deferred.

## 2. Version-Band Maturity Model

These are internal development maturity markers, not public release promises. Patch numbers may exceed single digits and do not automatically roll over to the next minor band.

| Version Band | Development Meaning | Playability / Stability Checkpoint |
| --- | --- | --- |
| `v0.1.x` | Repository scaffold, workspace conventions, schemas, first canonical content foundations. | Not meaningfully playable; focus is structure and validation. |
| `v0.2.x` | Player identity, clean save/load behavior, creator/start-state, core local UI flow foundations. | Basic local character/start flow can exist, but systems are still thin. |
| `v0.3.x` | World, civilization, economy, reputation foundations, stricter content validation. | World data becomes coherent enough for deterministic simulation scaffolds. |
| `v0.4.x` | Account, Legacy, Chronicle, progression, and local persistence foundations. | Long-term progression surfaces begin to exist, but many are read-only or inert. |
| `v0.5.x` | Foundation stabilization, metadata guardrails, repo hygiene, validation hardening, ownership scaffolding. | Current phase. Playability is secondary to trustworthy ownership and validation. |
| `v0.6.x` | Runtime ownership transition: replace UI-authored/demo handling with engine-owned commands, tick/event output, and authoritative session updates. | First serious movement toward reliable playable runtime loops. |
| `v0.7.x` | Integrated gameplay systems interacting through stable shared contracts. | Systems should start to feel like a connected game instead of isolated scaffolds. |
| `v0.8.x` | Pre-alpha vertical-slice hardening, narrow content completeness, balancing, regression coverage. | Use only when a narrow playable path is being stabilized and tested. |
| `v0.9.x` | Alpha-readiness stabilization, current-data policy, known limitations, packaging/launch flow, clean save/load reliability, release-candidate QA. | Alpha-readiness only when a playable validated vertical slice exists with explicit limits. |
| `v1.0+` | Public release maturity. | Reserved. Not relevant to current planning. |

## 3. Active Pipeline

| Version | Name | Route | Type | Status / Intent | Key Guardrail |
| --- | --- | --- | --- | --- | --- |
| `0.5.63` | Backstory Legacy Purchase Runtime Shape | Codex Local | Runtime shape | Landed. Added family-scoped unlock ownership and read-only purchase evidence helper. | No content, resolver wiring, creator behavior, or visible availability changes. |
| `0.5.64` | Backstory Legacy Purchase Content Draft | Codex Local after GitHub prompt prep | Content / guard | Landed. Added draft-only low-risk Backstory Legacy candidate catalog outside runtime. | Draft remained non-runtime and guarded from runtime imports. |
| `0.5.65` | Backstory Legacy Live Content Readiness Decision | Codex Local | Readiness / guard | Landed. Chose the guarded live-catalog route for the low-risk account-scoped records. | Do not expose hidden draft/backlog records accidentally. |
| `0.5.66` | Backstory Legacy Live Catalog Guard | Codex Local | Runtime guard | Landed. Hardened live/non-live Backstory Legacy catalog and purchase boundaries. | Catalog-only/backlog Backstory Legacy records must not become purchasable or resolver evidence. |
| `0.5.67` | Backstory Legacy Live Content Migration | Codex Local | Live content | Landed. Migrated five low-risk account-scoped Backstory Legacy records into `legacy_unlocks.json`. | Live records are unlock-only access support, not starter effects or current identity. |
| `0.5.68` | Backstory Legacy Purchase Resolver Integration | Codex Local | Resolver caller integration | Landed. Owned account-scoped Backstory Legacy purchases now feed creator availability through the ownership helper. | Creator does not infer `familyId`; higher-risk and scoped evidence remains deferred. |
| `0.5.69` | Backstory Legacy Creator Copy And Handoff Cleanup | Codex Local | Copy / docs / metadata cleanup | Landed. Aligned locked copy, policy metadata, handoff, and roadmap after 0.5.68. | No new Backstory Legacy behavior or content expansion. |
| `0.5.70` | Heirloom And Bequest Systems Plan | Codex Local | Docs / planning | Landed. Created the active heirloom/bequest planning artifact. | Planning-only; no heirs, item-instance persistence, bequest runtime, UI, or spending behavior implemented. |
| `0.5.71` | Bloodlines View Model Implementation Plan | Codex Local | View-model / pure projection | Landed. Added a pure read-only Bloodlines projection from current account family, ledger, unlock, and run-history data. | No mutation, family management, spending, heir systems, bequests, heirlooms, or scoped Backstory evidence. |
| `0.5.72` | Bloodlines Read-Only Account Meta UI | Codex Local | Read-only UI | Landed. Rendered Bloodlines read-only in the account meta / launcher surface. | No management actions, purchase execution, transfer, claim, spend, or resolver bypass. |
| `0.5.73` | Bloodlines Handoff And Temporary Guardrail Cleanup | Codex Local | Docs / continuity cleanup | Landed. Aligned handoff, roadmap, continuity brief, design ledger, and temporary guardrail statuses after Bloodlines UI. | Docs-only; no source, UI, tests, schemas, content JSON, or generated output changes. |
| `0.5.74` | Typecheck Script And Target Policy Cleanup | Codex Local | Tooling / validation cleanup | Landed. Made typecheck commands honest and repeatable while preserving strictness. | Default and workspace typecheck targets still have known blockers; do not treat them as green gates yet. |
| `0.5.75` | Chronicle Run-End Summary View Model Plan | Codex Plan Mode or Codex Local docs-only | Planning | Next recommended step. Map current run-ending data into a future read-only impact summary before projection/UI work. | Planning-only; do not change lifecycle, payout, estate delivery, Chronicle Marks, Lineage Seals, Family Prestige grants, Bloodlines behavior, or generated output. |

## 4. Sequenced Near-Term Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` as the source of truth for the ordered near-term queue after the current handoff. Summary:

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.74` | Typecheck Script And Target Policy Cleanup | `docs/dev/typecheck-blocker-triage-plan.md` | Landed |
| 2 | `0.5.75` | Chronicle Run-End Summary View Model Plan | `docs/design/chronicle-run-end-summary-view-model-plan.md` | Next |
| 3 | `0.5.76` | Chronicle Run-End Summary Pure Projection | `docs/design/chronicle-run-end-summary-view-model-plan.md` | Planned |
| 4 | `0.5.77` | Chronicle Run-End Read-Only UI | `docs/design/chronicle-run-end-summary-view-model-plan.md` | Planned |
| 5 | `0.5.78` | Economy Price Clarity View Model Plan | `docs/design/economy-price-clarity-view-model-plan.md` | Planned |
| 6 | `0.5.79` | Economy Price Clarity Pure Projection | `docs/design/economy-price-clarity-view-model-plan.md` | Planned |
| 7 | `0.5.80` | Calendar Climate Popup View Model Plan | `docs/design/calendar-climate-popup-view-model-plan.md` | Planned |
| 8 | `0.5.81` | Calendar Climate Read-Only Popup | `docs/design/calendar-climate-popup-view-model-plan.md` | Planned |
| 9 | `0.5.82` | Combat Equipment Mapping Audit | `docs/design/combat-equipment-mapping-audit-plan.md` | Planned |
| 10 | `0.5.83` | Known Spell Ownership Plan | `docs/design/known-spell-ownership-plan.md` | Planned |

Do not skip planning-to-projection-to-UI stages unless a newer handoff or user instruction explicitly changes the order.

## 5. Lightweight GPT + GitHub Connector Audit / Planning Queue

These connector-safe audit/planning passes have been completed, folded, or promoted into source plans. They should not update `docs/dev/current-codex-output.md` unless they become actual Codex runs later.

| Pass | Current location of useful guidance |
| --- | --- |
| Typecheck Blocker Triage Plan | `docs/dev/typecheck-blocker-triage-plan.md`; Pass A consumed by `0.5.74`, keep for remaining blocker tracks. |
| Chronicle Run-End Summary Source Audit | Promoted into `docs/design/chronicle-run-end-summary-view-model-plan.md`; use for `0.5.75`-`0.5.77`. |
| Economy Clarity Audit | Promoted into `docs/design/economy-price-clarity-view-model-plan.md`; use for `0.5.78`-`0.5.79`. |
| Calendar / Climate Popup IA Audit | Promoted into `docs/design/calendar-climate-popup-view-model-plan.md`; use for `0.5.80`-`0.5.81`. |
| Combat Audit Scoping Pass | Promoted into `docs/design/combat-equipment-mapping-audit-plan.md`; use for `0.5.82`. |
| Magic Runtime Readiness Audit | Promoted into `docs/design/known-spell-ownership-plan.md`; use for `0.5.83`. |
| Bloodlines Information Architecture Audit | Partially consumed by `0.5.71` and `0.5.72`; keep for richer tree and future Bloodlines presentation constraints. |
| Heirloom vs Bequest Vocabulary Audit | Consumed by `docs/design/heirloom-and-bequest-systems-plan.md` and the design ledger; retained only as compact checklist until inheritance-runtime readiness cleanup. |
| Prompt Template Hardening Pass | `docs/dev/prompt-template-hardening-pass.md`; use when generating future Codex/GitHub Connector prompts. |

### Connector Pass Rules

Use GitHub Connector for future light passes when:

- The task is read-only, docs-only, or prompt-preparation.
- The output can be a memo, checklist, acceptance criteria, or a tiny documentation edit.
- No local test command, typecheck, content-lint, build, or generated artifact inspection is required.
- The pass does not edit runtime/source/content JSON beyond a deliberately tiny docs update.

Escalate to Codex Local when:

- Source code, tests, schemas, runtime content, or UI components must change.
- Validation commands must be run.
- The task touches save/account schema, Legacy runtime behavior, resolver behavior, combat math, economy simulation, magic runtime, or generated output.

### Temporary Guardrail File Lifecycle

Focused audit/source docs are useful, but they are temporary guardrails rather than a second backlog.

Keep a focused audit/source doc while:

- it will be directly referenced by an upcoming implementation or planning prompt;
- it prevents repeated connector-side analysis;
- its guidance is too detailed for `current-gpt-handoff.md` and too task-specific for the durable design ledger.

After the relevant Codex or planning run consumes it, do one of the following in the same cleanup window:

- delete it if its guidance is implemented or obsolete;
- fold durable concepts into `docs/design/future-system-design-ledger.md`;
- fold immediate risk/prompt guardrails into `docs/dev/current-gpt-handoff.md`;
- fold version/order changes into `docs/dev/project-roadmap.md`;
- fold chronological deferral/run-note material into `docs/future_content_backlog.md`.

Do not let temporary guardrail files accumulate indefinitely.

## 6. `v0.6.x` Runtime Ownership Transition

Goal: shift from UI-authored/demo handling toward engine-owned commands, authoritative session updates, and reliable runtime event output.

Expected checkpoints:

- Engine-owned command paths for core gameplay actions.
- Clear tick/event output for UI consumption.
- Authoritative session update boundaries.
- Clean separation between view models and mutating behavior.
- Backstory/Legacy/Bloodline ownership paths proven safe enough for limited runtime use.
- Save/load remains current-data-first and reliable for current branch state.

Do not enter `v0.6.x` just because the `0.5.x` patch count is high. Enter it only when implementation focus changes from foundation hardening to runtime ownership.

## 7. `v0.7.x` Integrated Gameplay Systems

Goal: make systems interact through stable shared contracts rather than isolated scaffolds.

Candidate integrated systems:

- Combat/equipment refinement after audit.
- Calendar and climate visibility tied to travel/start conditions.
- Economy clarity layer tied to markets, scarcity, and supply/demand hints.
- Context-aware actions once action ownership is stable.
- Run-end / Chronicle impact summaries tied to account/run history.
- Readable failure feedback tied to actual system causes.
- Soft tutorial surfaces using contextual hints rather than tutorial walls.

Expected playability checkpoint:

- A player can understand the consequences of major actions, run outcomes, and carry-forward effects without reading design docs.

## 8. `v0.8.x` Pre-Alpha Vertical-Slice Hardening

Goal: stabilize a narrow playable path as a pre-alpha slice.

Expected checkpoints:

- A coherent start-to-run-to-end loop exists.
- Current save/load works reliably for the slice.
- Core UI surfaces are readable and not placeholder-dependent.
- Known limitations are documented.
- Focused regression coverage exists for the vertical slice.
- Content completeness is narrow but intentional.
- Balance is acceptable for testing, not final.

Do not use `v0.8.x` labels before a narrow playable path is the thing being hardened.

## 9. `v0.9.x` Alpha-Readiness Stabilization

Goal: stabilize the project for alpha-style playtesting.

Expected checkpoints:

- Playable vertical slice has engine-owned runtime behavior.
- Save/load reliability is clean for current data.
- Packaging / launch flow is clear.
- Known limitations are explicit.
- Regression coverage protects the main slice.
- Major blockers are triaged into fix-now, known-limited, or deferred.
- No hidden compatibility policy drift: still current-data-first unless explicitly changed.

## 10. Major Deferred Systems

These are strategically important but should not interrupt the current ownership pipeline. For durable design criteria, see `docs/design/future-system-design-ledger.md`.

| System | Start Only After | Why Deferred |
| --- | --- | --- |
| Full heir system | Family records, Bloodlines read-only UI, inheritance terminology, and safe family management seams. | Easy to fabricate family status or overbuild genealogy before data owners exist. |
| Heirlooms | Item-instance persistence, ownership chains, loss/theft/breakage rules. | Must not duplicate items or become generic starter bonuses. |
| Bequests | Estate/material ownership and claim lifecycle. | Must not become disguised Bloodline traits or economy exploits. |
| Chronicle Marks | Account-wide milestone semantics and conversion rules. | Do not add another currency before payoff and source rules exist. |
| Lineage Seals | Heir claim retirement, branch closure, rare milestone rules. | Too abstract until family lifecycle exists. |
| Property / home / land / ranching | Estate ownership, economy guardrails, and material claim rules. | Strong dynasty fantasy, but high risk without ownership seams. |
| Living settlements / migration / supply-demand | Economy stability, settlement state, performance bounds. | Flagship simulation layer; too large for current phase. |
| Kingdoms / diplomacy / war / governance | Settlements, renown, titles, estate, combat, economy, AI/event systems. | Late-system dependency stack. |
| Runtime magic expansion | Magic design, scaling roles, access model, acquisition, runtime hooks. | Current magic is metadata/validation-first; runtime expansion is high-risk. |

## 11. Roadmap Maintenance Rules

- Update this file when a new handoff changes the active pipeline or maturity-band target.
- Do not replace `docs/dev/current-codex-output.md`; that file remains the latest Codex handoff.
- Do not treat this file as a substitute for validation, tests, or source inspection.
- Keep version labels internal and maturity-based, not public marketing release labels.
- Keep near-term work narrow and owner-aware.
- Prefer read-only audits before broad implementation work.
- Preserve the no-backwards-compatibility rule unless explicitly changed by the user.
- Move durable system criteria to `docs/design/future-system-design-ledger.md`, not into this roadmap.
- Delete or fold temporary guardrail/source docs after their guidance is implemented, superseded, or promoted into durable files.
- When in doubt, choose the smallest pass that clarifies ownership, dependencies, validation, or player-facing readability.