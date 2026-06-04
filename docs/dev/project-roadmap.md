# Lineage: Reforged - Long-Term Project Roadmap

Last reviewed: 2026-06-04

This roadmap is a repo-readable planning document for long-term version direction, playability checkpoints, lightweight audit/planning passes, and major deferred systems. It complements:

- `AGENTS.md` for repository rules, version-label discipline, and tool routing.
- `docs/dev/current-codex-output.md` for the latest exact implementation handoff.
- `docs/dev/current-gpt-handoff.md` for current connector-side audits, immediate risks, and prompt guardrails.
- `docs/dev/codex-sequenced-implementation-plan.md` for the ordered near-term Codex queue after the current handoff.
- `docs/design/future-system-design-ledger.md` for durable future-system criteria, vocabulary, boundaries, and open conceptual questions.
- `docs/dev/project-vision-and-continuity-brief.md` for the strategic north star and source map.
- `docs/future_content_backlog.md` for deferred content and historical run notes.

The current Codex handoff controls exact current version state. The current GPT handoff controls immediate connector-side guardrails. This roadmap controls version order, maturity bands, playability checkpoints, and lightweight audit/source indexing.

## 1. Current Anchor

Current live anchor:

- Latest landed version: `Version 0.5.101 - Magic Resolver Planned Output Envelope Plan`
- Next recommended version: `Version 0.5.102 - Magic Resolver Inert Envelope Helper`
- Current near-term sequence source: `docs/dev/codex-sequenced-implementation-plan.md`
- Current phase: `v0.5.x` foundation stabilization / ownership hardening

Versioning rule:

- Patch numbers may exceed two digits inside the current band.
- Do not roll from `0.5.101` to `0.6.0` unless the actual `0.6.x` runtime ownership milestone has been reached.

Current repo reality:

- Family-scoped unlock ownership, Bloodlines projection, Chronicle run-end projection, economy clarity projection, calendar/climate projection, creator shell refinement, combat equipment mapping audit, and short-bow combat profile follow-up have landed in narrow slices.
- Typecheck script routing is explicit; default UI and broad workspace typecheck targets still fail on known pre-existing blockers, so focused tests remain the current confidence path.
- Known-spell ownership planning, helpers, validation helpers, acquisition-evidence helpers, read-only projection, blocker tests, cast-readiness helpers, acquisition planning/helpers, command contract planning, first narrow resolver planning, resolver-readiness helpers, and planned output-envelope policy have landed.
- `buildMagicCastResolverReadiness(...)` is pure/read-only and returns deterministic resolver issues without casting, target resolution, resource payment, catalyst behavior, event creation, or mutation.
- `docs/design/magic-resolver-planned-output-envelope-plan.md` defines inert planned output envelopes as result projections only.
- Early known spells require explicit character-scoped acquisition evidence; account, family, institution, Legacy, scroll, tome, and document access must not automatically become character spell knowledge.
- Current `PlayerSpellState[]` remains readiness context, not a complete acquisition/ownership model.
- No economy clarity React UI, shop/trade/craft/caravan command UI, generated output, active magic behavior, runtime casting, cast commands, catalyst consumption, or broad economy/climate expansion has been added.
- Family Prestige earning/spending behavior, Family management, heirs, heirlooms, bequests, item-instance persistence, estate transfer/claim execution, Chronicle Marks, Lineage Seals, scoped Backstory evidence, skill trial runtime behavior, magic study runtime behavior, and knowledge snippet runtime behavior remain deferred.

## 2. Version-Band Maturity Model

These are internal development maturity markers, not public release promises. Patch numbers may exceed two digits and do not automatically roll over to the next minor band.

| Version Band | Development Meaning | Playability / Stability Checkpoint |
| --- | --- | --- |
| `v0.1.x` | Repository scaffold, workspace conventions, schemas, first canonical content foundations. | Not meaningfully playable; focus is structure and validation. |
| `v0.2.x` | Player identity, clean save/load behavior, creator/start-state, core local UI flow foundations. | Basic local character/start flow can exist, but systems are still thin. |
| `v0.3.x` | World, civilization, economy, reputation foundations, stricter content validation. | World data becomes coherent enough for deterministic simulation scaffolds. |
| `v0.4.x` | Account, Legacy, Chronicle, progression, and local persistence foundations. | Long-term progression surfaces begin to exist, but many are read-only or inert. |
| `v0.5.x` | Foundation stabilization, metadata guardrails, repo hygiene, validation hardening, ownership scaffolding. | Current phase. Playability is secondary to trustworthy ownership and validation. |
| `v0.6.x` | Runtime ownership transition: replace UI-authored/demo handling with engine-owned commands, tick/event output, and authoritative session updates. | Use only when the actual runtime ownership milestone has been reached. |
| `v0.7.x` | Integrated gameplay systems interacting through stable shared contracts. | Systems should start to feel like a connected game instead of isolated scaffolds. |
| `v0.8.x` | Pre-alpha vertical-slice hardening, narrow content completeness, balancing, regression coverage. | Use only when a narrow playable path is being stabilized and tested. |
| `v0.9.x` | Alpha-readiness stabilization, current-data policy, known limitations, packaging/launch flow, clean save/load reliability, release-candidate QA. | Alpha-readiness only when a playable validated vertical slice exists with explicit limits. |
| `v1.0+` | Public release maturity. | Reserved. Not relevant to current planning. |

## 3. Active Pipeline

| Version | Name | Route | Type | Status / Intent | Key Guardrail |
| --- | --- | --- | --- | --- | --- |
| `0.5.97` | Training Event Acquisition Helpers | Codex Local | Pure helper + focused tests | Landed. Validates explicit training-event acquisition input and proposes character-scoped known-spell records. | No save/session mutation, persisted acquisition events, runtime casting, commands, UI, broader routes/scopes, or schema changes. |
| `0.5.98` | Magic Command Contract | Codex Local docs-first | Command contract plan | Landed. Defined the command/intention shape for selected spell, caster, target, conduit source, catalyst source, and casting context before resolver behavior. | Contract only; no runtime cast resolver, cast commands, UI, save mutation, effect application, or catalyst consumption. |
| `0.5.99` | First Narrow Runtime Cast Resolver Plan | Codex Local docs-first | Resolver boundary plan | Landed. Planned the first narrow engine-owned resolver boundary using known-spell, readiness, and command-contract inputs. | Planning only; no effect implementation, command handler wiring, UI dispatch, save mutation, resource payment, catalyst consumption, or event creation. |
| `0.5.100` | Runtime Cast Resolver Readiness Helper | Codex Local | Pure resolver readiness helper + focused tests | Landed. Added a pure deterministic resolver-readiness helper that consumes explicit command-like input and calls `buildMagicCastReadiness(...)`. | No effectful casting, command handlers, UI dispatch, save mutation, resource payment, catalyst consumption/reservation, inventory mutation, target resolution, or event creation. |
| `0.5.101` | Magic Resolver Planned Output Envelope Plan | Codex Local docs-first | Planning | Landed. Planned inert result-envelope policy before any resolver output/event implementation. | Planning only; no emitted events, effect application, command handlers, UI dispatch, save mutation, resource payment, catalyst consumption/reservation, inventory mutation, or target resolution. |
| `0.5.102` | Magic Resolver Inert Envelope Helper | Codex Local | Pure helper + focused tests | Next. Add a pure inert planned-envelope result helper if scoped by the plan. | No emitted events, runtime dispatch, effects, target resolution, resource payment, catalyst behavior, mutation, UI, generated output, or schema migration. |

## 4. Advancement Framework Roadmap

Advancement systems should stay layered and owner-aware:

1. Preserve current skill rank bands, titles, breakthrough gates, and rank maximum.
2. Use `docs/design/skill-mastery-trial-framework-plan.md` for skill trial and magic study-event structure.
3. Keep Skill Mastery Trials, Magic Study Events, and Knowledge Discovery as separate lanes until their data owners, validation helpers, and runtime behavior are scoped.
4. Let magic study produce future acquisition evidence only after study-event owner boundaries exist; it must not bypass character-scoped known-spell ownership.
5. Delay Chronicle/Renown hooks for trials, study events, and magic casting until event-owner boundaries exist.

Near-term advancement candidates after the current magic resolver guardrails:

- `Version 0.5.102 - Magic Resolver Inert Envelope Helper`
- `Version 0.5.102 - Spell Hook Support Expansion Plan`
- `Version 0.5.102 - Knowledge Domain Registry Plan`

Choose the next candidate from the latest Codex output instead of advancing to `0.6.x` automatically.

## 5. Knowledge Domain Timing

Snippet-based knowledge is planned but not runtime-wired.

Current source material:

- `packages/schemas/player/knowledge_snippet.schema.json` is a planning schema only.
- `docs/future_content_backlog.md` tracks snippet-based knowledge domains and candidate domain ids.
- `docs/design/skill-mastery-trial-framework-plan.md` defines how knowledge discovery may relate to future trials and magic study events.

Timing rules:

- Do not wire knowledge snippets into runtime content loading until a knowledge-domain registry/content plan exists.
- Do not let book, teacher, institution, scroll, tome, Chronicle, travel, or quest sources automatically grant knowledge without dedicated discovery/progression helpers.
- Keep knowledge distinct from skills and known spells: knowledge is discovered understanding, skills are action capability, and magic study can later produce acquisition evidence.
- Do not entangle knowledge snippet runtime behavior with magic resolver planned output envelopes.

## 6. Remaining Magic Runtime Path

The magic runtime path must not jump directly from known-spell projection into active spell casting.

| Order | Step | Purpose | Boundary |
| ---: | --- | --- | --- |
| 1 | Runtime readiness blocker tests | Executable guardrails proving runtime magic remains blocked without explicit known-spell ownership and policy support. | Landed as test/scaffold only; no runtime casting. |
| 2 | Magic runtime boundary plan | Define conduit, catalyst, control/failure, and hook readiness boundaries. | Landed as planning-only; no runtime casting. |
| 3 | Runtime cast-readiness helper | Add a pure helper that returns deterministic cast-readiness blockers. | Landed as pure helper only; no effect application. |
| 4 | Acquisition event planning | Define training-event acquisition ownership and evidence boundaries before any mutation. | Landed as planning-only; no broader routes. |
| 5 | Training-event acquisition helpers | Validate explicit training-event acquisition input and return proposed character-scoped known-spell records. | Landed as pure helper only; no persisted acquisition events or save/session mutation. |
| 6 | Active casting command contract | Define the command/intention shape for selected spell, caster, target, conduit source, catalyst source, and casting context. | Landed as contract-only; no resolver behavior. |
| 7 | Runtime cast resolver readiness boundary | First narrow resolver-readiness planning. | Landed as planning-only in `docs/design/first-narrow-runtime-cast-resolver-plan.md`; no UI-authored ownership. |
| 8 | Runtime cast resolver readiness helper | Pure engine helper that consumes explicit command-like input, calls `buildMagicCastReadiness(...)`, and returns deterministic resolver issues. | Landed as pure helper only; no effect application, command handlers, UI dispatch, save mutation, resource payment, catalyst consumption/reservation, inventory mutation, target resolution, or event creation. |
| 9 | Planned output envelope policy | Define inert resolver output-envelope shape and policy before any emitted event behavior. | Landed as planning-only in `docs/design/magic-resolver-planned-output-envelope-plan.md`; no emitted events or runtime dispatch. |
| 10 | Planned output envelope helper | Return inert planned-output envelope projections from explicit inputs and readiness results. | Next pure helper candidate; no emitted events, effects, target resolution, resource payment, catalyst behavior, mutation, UI, or generated output. |
| 11 | Spell hook support expansion | Explicitly handle or block authored spell hooks before broad casting can become reliable. | No generic assumption that every authored hook is executable. |
| 12 | UI command/readiness surface | Later read-only or disabled-command presentation for known spells, cast-ready state, and blocked reasons. | UI must consume engine/runtime state and must not author ownership. |
| 13 | Save/runtime state integration | Persist known spell records, acquisition evidence, training events, catalyst inventory changes, cooldowns, backlash, cast history, and Chronicle hooks when shapes are stable. | No old-save compatibility unless explicitly requested. |
| 14 | Expanded acquisition routes | Add teacher, quest/event reward, scroll/tome study, institution licensing, document-owned study access, Magic Legacy lanes, and family tradition only after explicit evidence and ownership rules exist. | Keep blocked until each route has evidence and validation. |

Practical near-term sequence:

1. `0.5.102 - Magic Resolver Inert Envelope Helper`
2. `0.5.x - Spell Hook Support Expansion Plan`
3. `0.5.x - Knowledge Domain Registry Plan`

## 7. Sequenced Near-Term Codex Queue

Use `docs/dev/codex-sequenced-implementation-plan.md` as the source of truth for the ordered near-term queue after the current handoff. Summary:

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
| 9 | `0.5.100` | Runtime Cast Resolver Readiness Helper | `packages/engines/game-engine/src/known-spells.ts` | Landed |
| 10 | `0.5.101` | Magic Resolver Planned Output Envelope Plan | `docs/design/magic-resolver-planned-output-envelope-plan.md` | Landed |
| 11 | `0.5.102` | Magic Resolver Inert Envelope Helper | `docs/design/magic-resolver-planned-output-envelope-plan.md` | Next |

## 8. Lightweight GPT + GitHub Connector Audit / Planning Queue

| Pass | Current location of useful guidance |
| --- | --- |
| Typecheck Blocker Triage Plan | `docs/dev/typecheck-blocker-triage-plan.md`; Pass A consumed by `0.5.74`, keep for remaining blocker tracks. |
| Economy Runtime Test Failure Triage Plan | Consumed by `0.5.80`; retained only as historical source-detail reference. |
| Calendar / Climate Popup IA Audit | Promoted into `docs/design/calendar-climate-popup-view-model-plan.md`; keep until climate-profile resolver ownership is addressed or explicitly deferred. |
| Unified Shell And Creator Refinement Plan | `docs/design/unified-shell-and-creator-refinement-plan.md`; consumed by `0.5.85` for first creator implementation. |
| Combat Audit Scoping Pass | Promoted into `docs/design/combat-equipment-mapping-audit-plan.md`; retained for remaining deferred combat/equipment mapping policy gaps. |
| Magic Runtime Boundary Plan | `docs/design/magic-runtime-boundary-plan.md`; consumed by `0.5.95`, retain for later magic runtime constraints. |
| Known Spell Acquisition Event Plan | `docs/design/known-spell-acquisition-event-plan.md`; retained for training-event acquisition helper constraints and later acquisition mutation planning. |
| Magic Command Contract Plan | `docs/design/magic-command-contract-plan.md`; retained for future active magic command/intention constraints. |
| First Narrow Runtime Cast Resolver Plan | `docs/design/first-narrow-runtime-cast-resolver-plan.md`; consumed by `0.5.100` and `0.5.101`, retain for later resolver constraints. |
| Magic Resolver Planned Output Envelope Plan | `docs/design/magic-resolver-planned-output-envelope-plan.md`; use for `0.5.102 - Magic Resolver Inert Envelope Helper`. |
| Skill Mastery Trial Framework Plan | `docs/design/skill-mastery-trial-framework-plan.md`; retain for future advancement, skill trial, and magic study-event planning. |
| Prompt Template Hardening Pass | `docs/dev/prompt-template-hardening-pass.md`; use when generating future Codex/GitHub Connector prompts. |

## 9. Roadmap Maintenance Rules

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
