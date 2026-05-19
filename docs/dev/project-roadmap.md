# Lineage: Reforged - Long-Term Project Roadmap

Last reviewed: 2026-05-19

This roadmap is a repo-readable planning document for long-term version direction, playability checkpoints, lightweight audit/planning passes, and major deferred systems. It complements:

- `AGENTS.md` for repository rules, version-label discipline, and tool routing.
- `docs/dev/current-codex-output.md` for the latest exact Codex implementation handoff.
- `docs/dev/current-gpt-handoff.md` for current connector-side audits, immediate risks, and prompt guardrails.
- `docs/design/future-system-design-ledger.md` for durable future-system criteria, vocabulary, boundaries, and open conceptual questions.
- `docs/dev/project-vision-and-continuity-brief.md` for the strategic north star and source map until the brief is fully decomposed.
- `docs/future_content_backlog.md` for deferred content and historical run notes.

The current Codex handoff controls exact current version state. The current GPT handoff controls immediate connector-side guardrails. This roadmap controls version order, maturity bands, playability checkpoints, and lightweight audit queue. The design ledger controls durable conceptual criteria.

## 1. Current Anchor

Current live anchor:

- Latest landed version: `Version 0.5.63 - Backstory Legacy Purchase Runtime Shape`
- Next recommended version: `Version 0.5.64 - Backstory Legacy Purchase Content Draft`
- Current phase: `v0.5.x` foundation stabilization / ownership hardening

Current repo reality:

- Family-scoped unlock ownership shape exists.
- Family unlock ownership is current-data only and defaults empty.
- Backstory Legacy purchase evidence helper exists.
- Backstory Legacy purchase content records are not added yet.
- Backstory Eligibility resolver purchase wiring is not added yet.
- Creator-visible purchase behavior is not changed yet.
- Family Prestige earning/spending behavior is not implemented yet.
- Family tree UI, heirs, heirlooms, bequests, Chronicle Marks, and Lineage Seals remain deferred.
- Workspace-wide typecheck still has known pre-existing blockers; focused tests are the current confidence path.

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
| `0.5.64` | Backstory Legacy Purchase Content Draft | Codex Local after GitHub prompt prep | Content / guard | Next implementation run. Author initial Backstory Legacy purchase records only if exposure is controlled. | Do not naively add live `legacy_unlocks.json` records that become visible/purchasable. Use draft-only records or a minimal visibility/purchase guard. |
| `0.5.65` | Backstory Legacy Purchase Resolver Integration | Codex Local, or Plan Mode first if seam is unclear | Resolver integration | Pass owned purchase ids into resolver in a scoped tested way. | Explicit source of account purchase ids, family purchase ids, and `familyId`; no fake evidence. |
| `0.5.66` | Heirloom And Bequest Systems Plan | GitHub Connector or Codex Plan Mode | Docs / planning | Separate material bequests from item-chain heirlooms and Bloodline traits. | Use `docs/design/heirloom-vs-bequest-vocabulary-audit.md`; planning-only unless explicitly changed. |
| `0.5.67` | Bloodlines View Model Implementation Plan | GitHub Connector or Codex Plan Mode | Docs / planning | Define pure projection of families, tree, and prestige summaries. | Use `docs/design/bloodlines-information-architecture-audit.md`; view-model-first; no React sprawl. |
| `0.5.68` | Bloodlines Read-Only Account Meta UI | Codex Local | View-model / UI | Render Bloodlines in account meta / Chronicles surface. | Read-only; no family management, purchase execution, or resolver bypass. |

## 4. Lightweight GPT + GitHub Connector Audit / Planning Queue

These connector-safe audit/planning passes have been completed or folded. They should not update `docs/dev/current-codex-output.md` unless they become actual Codex runs later.

| Pass | Current location of useful guidance |
| --- | --- |
| `0.5.64` Content Exposure Audit | `docs/dev/current-gpt-handoff.md` immediate guardrails. |
| `0.5.65` Family Context Seam Plan | `docs/dev/current-gpt-handoff.md` immediate guardrails. |
| Creator Terminology Drift Audit | `docs/design/future-system-design-ledger.md` durable vocabulary rules; `current-gpt-handoff.md` near-term cleanup note. |
| Backlog Superseded-Ordering Cleanup Plan | `current-gpt-handoff.md` precedence rules; `future_content_backlog.md` remains historical. |
| Typecheck Blocker Triage Plan | Folded into `current-gpt-handoff.md`; temporary plan file removed. |
| Future System Design Ledger Creation | `docs/design/future-system-design-ledger.md`. |
| Development Guidance File Cleanup | Roadmap, current handoff, and continuity brief deconstruction. |
| Bloodlines Information Architecture Audit | `docs/design/bloodlines-information-architecture-audit.md`; use for `0.5.67` / `0.5.68`. |
| Heirloom vs Bequest Vocabulary Audit | `docs/design/heirloom-vs-bequest-vocabulary-audit.md`; use for `0.5.66`. |
| Chronicle Run-End Summary Source Audit | `docs/design/chronicle-run-end-summary-source-audit.md`; use for future run-end summary planning. |
| Combat Audit Scoping Pass | `docs/design/combat-audit-scoping-pass.md`; use before combat/equipment implementation. |
| Magic Runtime Readiness Audit | `docs/design/magic-runtime-readiness-audit.md`; use before magic runtime/acquisition work. |
| Economy Clarity Audit | `docs/design/economy-clarity-audit.md`; use before market/trade clarity UI work. |
| Calendar / Climate Popup IA Audit | `docs/design/calendar-climate-popup-ia-audit.md`; use before calendar/climate UI work. |
| Prompt Template Hardening Pass | `docs/dev/prompt-template-hardening-pass.md`; use when generating future Codex/GitHub Connector prompts. |
| Roadmap Maintenance Pass | This update. |

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

## 5. Near-Term Roadmap After Active Pipeline

These are likely candidates after `0.5.68`, subject to the current handoff at that time.

| Candidate Version Band | Candidate Topic | Route | Work Type | Dependency / Note |
| --- | --- | --- | --- | --- |
| `0.5.69+` | README dynasty identity alignment | GitHub Connector | Docs-only | Low-risk once roadmap, brief, and ledger are stable. |
| `0.5.69+` | Creator terminology cleanup | Codex Local or GitHub Connector for docs-only | Copy / small source cleanup | Use ledger vocabulary. Do not rewrite creator UI during active resolver work. |
| `0.5.69+` | Typecheck script and target policy cleanup | Codex Local | Tooling/config cleanup | Keep separate from feature work; do not weaken strictness. |
| `0.5.69+` | Chronicle run-end summary view-model plan | GitHub Connector or Plan Mode | Planning | Use `chronicle-run-end-summary-source-audit.md`; map data sources before UI. |
| `0.5.69+` | Combat / equipment mapping audit | GitHub Connector first, Codex Local later | Audit then focused fixes | Use `combat-audit-scoping-pass.md`; audit before touching math. |
| `0.5.69+` | Known spell ownership plan | GitHub Connector or Plan Mode | Planning | Use `magic-runtime-readiness-audit.md`; no runtime magic until owners are explicit. |
| `0.5.69+` | Economy price clarity view-model plan | GitHub Connector or Plan Mode | Planning | Use `economy-clarity-audit.md`; clarity before simulation changes. |
| `0.5.69+` | Calendar climate popup view-model plan | GitHub Connector | UI IA | Use `calendar-climate-popup-ia-audit.md`; data-backed popup before effects. |
| `0.5.69+` | Continuity brief maintenance | GitHub Connector | Docs-only | Keep strategic index short as other docs absorb detail. |

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
- When in doubt, choose the smallest pass that clarifies ownership, dependencies, validation, or player-facing readability.
