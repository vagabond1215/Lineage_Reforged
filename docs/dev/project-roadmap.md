# Lineage: Reforged - Long-Term Project Roadmap

Last reviewed: 2026-06-03

This roadmap is a repo-readable planning document for long-term version direction, playability checkpoints, lightweight audit/planning passes, and major deferred systems. It complements:

- `AGENTS.md` for repository rules, version-label discipline, and tool routing.
- `docs/dev/current-codex-output.md` for the latest exact implementation handoff.
- `docs/dev/current-gpt-handoff.md` for current connector-side audits, immediate risks, and prompt guardrails.
- `docs/dev/codex-sequenced-implementation-plan.md` for the ordered near-term Codex queue after the current handoff.
- `docs/design/future-system-design-ledger.md` for durable future-system criteria, vocabulary, boundaries, and open conceptual questions.
- `docs/dev/project-vision-and-continuity-brief.md` for the strategic north star and source map.
- `docs/future_content_backlog.md` for deferred content and historical run notes.

The current Codex handoff controls exact current version state. The current GPT handoff controls immediate connector-side guardrails. This roadmap controls version order, maturity bands, playability checkpoints, and lightweight audit/source indexing. The sequenced implementation plan gives Codex a concrete ordered queue. The design ledger controls durable conceptual criteria.

## 1. Current Anchor

Current live anchor:

- Latest landed version: `Version 0.5.96 - Known Spell Acquisition Event Planning`
- Next recommended version: `Version 0.5.97 - Training Event Acquisition Helpers`
- Current near-term sequence source: `docs/dev/codex-sequenced-implementation-plan.md`
- Current phase: `v0.5.x` foundation stabilization / ownership hardening

Current repo reality:

- Family-scoped unlock ownership shape exists.
- Family unlock ownership is current-data only and defaults empty.
- Five low-risk Backstory Legacy records are live account-scoped unlock-only records in the Legacy catalog.
- Owned account-scoped Backstory Legacy purchases feed creator availability through `resolveOwnedBackstoryLegacyPurchaseIds(...)`.
- Higher-risk Backstory Legacy candidates remain locked, hidden, special, or deferred.
- The creator does not infer or supply `familyId`; family/source-run/scoped Backstory Legacy evidence remains deferred.
- Heirloom and bequest vocabulary/ownership boundaries are planned in `docs/design/heirloom-and-bequest-systems-plan.md`.
- Bloodlines pure projection and read-only account meta UI have landed.
- Chronicle run-end summary planning, pure projection, focused tests, and read-only Account Meta UI have landed.
- Typecheck script routing is explicit; default UI and broad workspace typecheck targets still fail on known pre-existing blockers, so focused tests remain the current confidence path.
- Economy price clarity planning, pure projection, and focused tests have landed.
- The 0.5.80 economy runtime/trade validation triage restored the focused civilization economy validation path.
- Calendar/climate popup planning, pure projection, and read-only UI have landed.
- Unified shell and creator refinement planning and first creator implementation have landed.
- Character creation now uses the launcher AppShell with left-sidebar summary, fixed-width steps, full-character randomization, no-selectable-backstory gating, and a total attribute matrix with contribution tooltips.
- Gameplay shell unification remains deferred.
- Combat equipment mapping audit has landed.
- `item.short_bow` now has a current ranged archery combat use profile for Hunter starter mapping.
- Known spell ownership planning has landed and chooses character-scoped known spells first.
- Known spell ownership helpers have landed as a pure character-scoped helper boundary with focused tests.
- Known spell validation helpers have landed as pure collection validation, duplicate id detection, and minimal training-event evidence validation.
- Known spell acquisition evidence helpers have landed as pure helpers for minimal `training_event` evidence.
- Known spell read-only projection has landed as a pure projection over explicit character-scoped known-spell records.
- Magic runtime readiness blocker tests have landed as test-only coverage proving current read-only spell surfaces and metadata do not imply cast readiness.
- Magic runtime boundary planning has landed as `docs/design/magic-runtime-boundary-plan.md`, defining the cast-readiness helper boundary.
- Magic cast readiness helpers have landed as pure deterministic read-only helpers that return blockers without applying effects or mutating state.
- Known spell acquisition event planning has landed as `docs/design/known-spell-acquisition-event-plan.md`, defining the training-event acquisition helper boundary before mutation.
- Early known spells require explicit character-scoped acquisition evidence; account, family, institution, Legacy, scroll, tome, and document access must not automatically become character spell knowledge.
- Current `PlayerSpellState[]` remains readiness context, not a complete acquisition/ownership model.
- No economy clarity React UI, shop/trade/craft/caravan command UI, generated output, active magic behavior, runtime casting, cast commands, catalyst consumption, or broad economy/climate expansion has been added.
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
| `0.5.84` | Unified Shell And Creator Refinement Plan | Codex Local docs-only | Planning | Landed. Added the source plan for creator shell/sidebar, backstory gating, full randomization, and stat preview cleanup before combat audit. | Planning-only; no UI/source behavior changes. |
| `0.5.85` | Creator Sidebar Layout And Backstory Gating | Codex Local | Focused creator UI/form helper implementation | Landed. Moved character creation into launcher AppShell/left-sidebar model with backstory gating, full randomization, and attribute matrix refinement. | Character creation only; no gameplay shell unification, generated output, or combat work. |
| `0.5.86` | Combat Equipment Mapping Audit | Codex Local | Audit | Landed. Audited current combat/equipment ownership and starter equipment mapping. | Audit only; no formula/content behavior changes. |
| `0.5.87` | Combat Equipment Mapping Follow-Up | Codex Local | Narrow content/test fix | Landed. Added current-content short-bow combat profile for Hunter starter mapping. | Short bow only; no formulas, ammo, range balance, UI, or broad equipment policy. |
| `0.5.88` | Known Spell Ownership Plan | Codex Local docs-only | Planning | Landed. Defined character-scoped known spell ownership/acquisition before runtime casting. | Planning-only; no spell execution. |
| `0.5.89` | Known Spell Ownership Helpers | Codex Local | Pure helpers + focused tests | Landed. Added character-scoped known-spell helper boundary. | No casting, UI, save schema migration, catalyst behavior, scroll/tome behavior, Magic Legacy power, or broader ownership scopes. |
| `0.5.90` | Known Spell Validation Helpers | Codex Local | Pure validation helpers + focused tests | Landed. Added collection validation, duplicate id checks, and minimal training-event evidence validation. | No casting, UI, save schema migration, catalyst behavior, scroll/tome behavior, Magic Legacy power, or broader ownership scopes. |
| `0.5.91` | Known Spell Acquisition Evidence Helpers | Codex Local | Pure acquisition evidence helpers + focused tests | Landed. Added training-event evidence helper boundaries. | No acquisition mutation, casting, UI, save schema migration, catalyst behavior, scroll/tome behavior, Magic Legacy power, or broader routes/scopes. |
| `0.5.92` | Known Spell Read-Only Projection | Codex Local | Pure projection + focused tests | Landed. Added read-only known-spell projection. | No acquisition mutation, casting, React UI, save schema migration, catalyst behavior, scroll/tome behavior, Magic Legacy power, or broader routes/scopes. |
| `0.5.93` | Magic Runtime Readiness Blocker Tests | Codex Local | Focused blocker tests | Landed. Added tests proving runtime magic remains blocked without required policy gates. | No runtime casting, commands, React UI, save schema migration, or broader routes/scopes. |
| `0.5.94` | Magic Runtime Boundary Plan | Codex Local docs-only | Planning | Landed. Defined the boundary between known-spell projection and a future pure cast-readiness helper. | Planning-only; no runtime casting, commands, React UI, JSON, schema, save/account, catalyst consumption, or broader routes/scopes. |
| `0.5.95` | Magic Cast Readiness Helper | Codex Local | Pure helper + focused tests | Landed. Added deterministic read-only blocker results for cast readiness. | No effect application, resource payment, catalyst consumption, combat events, acquisition creation, or save mutation. |
| `0.5.96` | Known Spell Acquisition Event Planning | Codex Local docs-only | Planning | Landed. Defined training-event acquisition ownership and evidence boundaries before any acquisition mutation. | Planning-only; no acquisition creation, runtime casting, commands, React UI, save/account changes, or broader routes/scopes. |
| `0.5.97` | Training Event Acquisition Helpers | Codex Local | Pure helper + focused tests | Next. Add a pure helper that validates explicit training-event acquisition input and returns a proposed character-scoped known-spell record. | No save/session mutation, persisted acquisition events, runtime casting, commands, React UI, broader routes/scopes, or schema changes. |

## 4. Remaining Magic Runtime Path

The magic runtime path must not jump directly from known-spell projection into active spell casting. The remaining sequence should keep each prerequisite narrow, testable, and owner-aware.

| Order | Step | Purpose | Boundary |
| ---: | --- | --- | --- |
| 1 | Runtime readiness blocker tests | Executable guardrails proving runtime magic remains blocked without explicit known-spell ownership, validated acquisition evidence, conduit policy, catalyst policy, control/failure policy, and blocked-hook policy. | Landed as test/scaffold only; no runtime casting. |
| 2 | Magic runtime boundary plan | Define what counts as a valid conduit, how catalyst presence is checked without consumption, how control/failure remains a pure gate, how unsupported/deferred/unknown hooks block readiness, and what blocker vocabulary `0.5.95` may return. | Landed as planning-only; no runtime casting. |
| 3 | Runtime cast-readiness helper | Add a pure helper that can return deterministic blockers such as `missing_known_spell`, `known_spell_blocked`, `missing_training_event_evidence`, `missing_conduit`, `invalid_conduit`, `missing_catalyst`, `insufficient_control`, `unsupported_spell_hooks`, or `spell_runtime_deferred`. | Landed as pure helper only; no effect application. |
| 4 | Acquisition event planning | Define training-event acquisition ownership and evidence boundaries before any mutation. | Landed as planning-only; do not add teacher, quest, scroll, tome, Legacy, family, institution, or document routes yet. |
| 5 | Training-event acquisition helpers | Validate explicit training-event acquisition input and return proposed character-scoped known-spell records. | Pure helper only; no persisted acquisition events or save/session mutation. |
| 6 | Active casting command contract | Define the command/intention shape for selected spell, caster, target, conduit source, catalyst source, and casting context. | Contract only before resolver behavior. |
| 7 | Runtime cast resolver | First narrow active magic resolver: known-spell check, readiness check, cost/conduit/catalyst/control checks, hook compatibility, and output event generation. | Engine-owned, narrow, and tested; no UI-authored ownership. |
| 8 | Spell hook support expansion | Explicitly handle or block authored spell hooks before broad casting can become reliable. | No generic assumption that every authored hook is executable. |
| 9 | UI command/readiness surface | Later read-only or disabled-command presentation for known spells, cast-ready state, and blocked reasons. | UI must consume engine/runtime state and must not author ownership. |
| 10 | Save/runtime state integration | Persist known spell records, acquisition evidence, training events, catalyst inventory changes, cooldowns, backlash, cast history, and Chronicle hooks when shapes are stable. | No old-save compatibility unless explicitly requested. |
| 11 | Expanded acquisition routes | Add teacher, quest/event reward, scroll/tome study, institution licensing, document-owned study access, Magic Legacy lanes, and family tradition only after explicit evidence and ownership rules exist. | Keep blocked until each route has evidence and validation. |

Practical near-term sequence after the acquisition-event plan:

1. `0.5.97 - Training Event Acquisition Helpers`
2. `0.5.98 - Magic Command Contract`
3. `0.5.99 - First Narrow Runtime Cast Resolver`
4. `0.6.x - UI command wiring / active magic integration`

## 5. Sequenced Near-Term Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` as the source of truth for the ordered near-term queue after the current handoff. Summary:

| Order | Version | Topic | Primary Source | Status |
| ---: | --- | --- | --- | --- |
| 1 | `0.5.92` | Known Spell Read-Only Projection | `docs/dev/current-codex-output.md` | Landed |
| 2 | `0.5.93` | Magic Runtime Readiness Blocker Tests | `docs/dev/current-codex-output.md` | Landed |
| 3 | `0.5.94` | Magic Runtime Boundary Plan | `docs/design/magic-runtime-boundary-plan.md` | Landed |
| 4 | `0.5.95` | Magic Cast Readiness Helper | `docs/design/magic-runtime-boundary-plan.md` | Landed |
| 5 | `0.5.96` | Known Spell Acquisition Event Planning | `docs/design/known-spell-acquisition-event-plan.md` | Landed |
| 6 | `0.5.97` | Training Event Acquisition Helpers | `docs/design/known-spell-acquisition-event-plan.md` | Next |

## 6. Lightweight GPT + GitHub Connector Audit / Planning Queue

| Pass | Current location of useful guidance |
| --- | --- |
| Typecheck Blocker Triage Plan | `docs/dev/typecheck-blocker-triage-plan.md`; Pass A consumed by `0.5.74`, keep for remaining blocker tracks. |
| Chronicle Run-End Summary Source Audit | Consumed by `0.5.75`-`0.5.77`; retained only as historical source-detail reference. |
| Economy Clarity Audit | Promoted into `docs/design/economy-price-clarity-view-model-plan.md`; keep until economy clarity UI direction is chosen. |
| Economy Runtime Test Failure Triage Plan | Consumed by `0.5.80`; retained only as historical source-detail reference. |
| Calendar / Climate Popup IA Audit | Promoted into `docs/design/calendar-climate-popup-view-model-plan.md`; keep until climate-profile resolver ownership is addressed or explicitly deferred. |
| Unified Shell And Creator Refinement Plan | `docs/design/unified-shell-and-creator-refinement-plan.md`; consumed by `0.5.85` for first creator implementation, keep as source-detail reference until gameplay shell unification is explicitly scoped or deferred. |
| Combat Audit Scoping Pass | Promoted into `docs/design/combat-equipment-mapping-audit-plan.md`; consumed by `0.5.86`; retained as the source-detail reference for remaining deferred combat/equipment mapping policy gaps. |
| Magic Runtime Readiness Audit | Promoted into `docs/design/known-spell-ownership-plan.md`; consumed by `0.5.88`; retained as the source-detail reference for known-spell ownership and blocker-test history. |
| Magic Runtime Boundary Plan | `docs/design/magic-runtime-boundary-plan.md`; consumed by `0.5.95`, retain for later magic runtime constraints. |
| Known Spell Acquisition Event Plan | `docs/design/known-spell-acquisition-event-plan.md`; use for `0.5.97 - Training Event Acquisition Helpers`. |
| Bloodlines Information Architecture Audit | Partially consumed by `0.5.71` and `0.5.72`; keep for richer tree and future Bloodlines presentation constraints. |
| Heirloom vs Bequest Vocabulary Audit | Consumed by `docs/design/heirloom-and-bequest-systems-plan.md` and the design ledger; retained only as compact checklist until inheritance-runtime readiness cleanup. |
| Prompt Template Hardening Pass | `docs/dev/prompt-template-hardening-pass.md`; use when generating future Codex/GitHub Connector prompts. |

## 7. Roadmap Maintenance Rules

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
