# Codex Sequenced Implementation Plan

Date: 2026-06-08
Route: Codex local sequencing alignment after `Version 0.5.123 - Knowledge Evidence Schema`
Status: locally aligned sequencing plan for future Codex runs

## Purpose

This file gives Codex a stable ordered queue after `Version 0.5.123 - Knowledge Evidence Schema` added the strict record structural contract and focused schema-file registration without evidence state or behavior.

It does not replace:

- `docs/dev/current-codex-output.md` for exact latest Codex state
- `docs/dev/current-gpt-handoff.md` for immediate prompt guardrails
- `docs/dev/project-roadmap.md` for version-band meaning and pipeline status
- focused `docs/design/*` files for detailed implementation constraints

Use this file as the ordered table of what to implement or plan next, then inspect the focused source document for the active version.

## Current Anchor

Latest landed foundation slice:

- `Version 0.5.123 - Knowledge Evidence Schema`

Immediate next Codex run:

- `Version 0.5.124 - Knowledge Evidence Semantic Validator Plan`

Versioning note:

- Patch numbers may exceed two digits inside the active band.
- Do not roll from `0.5.123` to `0.6.0` unless the actual `0.6.x` runtime ownership milestone has been reached.

## Ordered Trajectory

| Order | Version | Topic | Route | Primary Source | Output Type | Status | Guardrail |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | `0.5.79` | Economy Price Clarity Pure Projection | Codex 5.5 Local | `docs/design/economy-price-clarity-view-model-plan.md` | pure view-model + tests | Landed | No resolver calls, commands, UI, or simulation changes. |
| 2 | `0.5.80` | Economy Runtime Test Failure Triage | Codex 5.5 Local | `docs/dev/economy-runtime-test-failure-triage-plan.md` | focused runtime/test fix | Landed | Restored economy runtime/trade validation; no broad expansion. |
| 3 | `0.5.81` | Calendar Climate Popup View Model Plan | Codex 5.5 Local docs-only | `docs/design/calendar-climate-popup-view-model-plan.md` | planning doc | Landed | Planned pure projection boundary only. |
| 4 | `0.5.82` | Calendar Climate Read-Only Popup | Codex 5.5 Local | `docs/design/calendar-climate-popup-view-model-plan.md` | pure projection + tests | Landed | Projection only; no React UI or active effects. |
| 5 | `0.5.83` | Calendar Climate Read-Only Popup UI | Codex 5.5 Local | `apps/rpg-ui/src/game-shell/calendarClimatePresentation.ts` | read-only UI | Landed | Rendered projection only; no commands, active effects, content loading, or generated output. |
| 6 | `0.5.84` | Unified Shell And Creator Refinement Plan | Codex 5.5 Local docs-only | `docs/design/unified-shell-and-creator-refinement-plan.md` | planning doc | Landed | Planned creator shell/sidebar, backstory gating, full randomization, and stat preview cleanup only. |
| 7 | `0.5.85` | Creator Sidebar Layout And Backstory Gating | Codex 5.5 Local | `docs/design/unified-shell-and-creator-refinement-plan.md` | focused creator UI/form helpers + tests | Landed | Character creation only; no gameplay shell unification, generated output, or combat work. |
| 8 | `0.5.86` | Combat Equipment Mapping Audit | Codex 5.5 Local | `docs/design/combat-equipment-mapping-audit-plan.md` | audit tables + focused tests | Landed | Audit only; no combat formula rewrites or content behavior changes. |
| 9 | `0.5.87` | Combat Equipment Mapping Follow-Up | Codex 5.5 Local | `docs/design/combat-equipment-mapping-audit-plan.md` | narrow content/test fix | Landed | Added short-bow combat profile only; no formulas, ammo, balance, UI, or broad equipment policy. |
| 10 | `0.5.88` | Known Spell Ownership Plan | Codex 5.5 Local docs-only | `docs/design/known-spell-ownership-plan.md` | planning doc | Landed | Planned ownership/acquisition before runtime casting; no spell execution. |
| 11 | `0.5.89` | Known Spell Ownership Helpers | Codex 5.5 Local | `docs/design/known-spell-ownership-plan.md` | pure helpers + focused tests | Landed | Character-scoped known-spell helper boundary only; no casting, UI, save schema migration, catalyst behavior, or Legacy power. |
| 12 | `0.5.90` | Known Spell Validation Helpers | Codex 5.5 Local | `docs/dev/current-codex-output.md` | pure validation helpers + focused tests | Landed | Collection validation, duplicate id checks, and training-event evidence validation only; no casting, UI, save schema migration, or broader ownership scopes. |
| 13 | `0.5.91` | Known Spell Acquisition Evidence Helpers | Codex 5.5 Local | `docs/dev/current-codex-output.md` | pure acquisition evidence helpers + focused tests | Landed | Training-event evidence helper boundaries only; no acquisition mutation, casting, UI, save schema migration, or broader routes/scopes. |
| 14 | `0.5.92` | Known Spell Read-Only Projection | Codex 5.5 Local | `docs/dev/current-codex-output.md` | pure projection + focused tests | Landed | Read-only projection only; no acquisition mutation, casting, UI, save schema migration, or broader routes/scopes. |
| 15 | `0.5.93` | Magic Runtime Readiness Blocker Tests | Codex 5.5 Local | `docs/dev/current-codex-output.md` | focused blocker tests | Landed | Test/scaffold blocker boundaries only; no runtime casting, commands, UI, save schema migration, or broader routes/scopes. |
| 16 | `0.5.94` | Magic Runtime Boundary Plan | Codex 5.5 Local docs-only | `docs/design/magic-runtime-boundary-plan.md` | planning doc | Landed | Defined cast-readiness boundary only; no runtime casting, commands, UI, JSON, schema, save/account, catalyst consumption, or broader routes/scopes. |
| 17 | `0.5.95` | Magic Cast Readiness Helper | Codex 5.5 Local | `docs/design/magic-runtime-boundary-plan.md` | pure helper + focused tests | Landed | Read-only deterministic helper only; no effect application, resource payment, catalyst consumption, acquisition creation, combat events, or save mutation. |
| 18 | `0.5.96` | Known Spell Acquisition Event Planning | Codex 5.5 Local docs-only | `docs/design/known-spell-acquisition-event-plan.md` | planning doc | Landed | Planned training-event acquisition ownership only; no acquisition mutation, active casting, commands, UI, broader routes/scopes, or save/account changes. |
| 19 | `0.5.97` | Training Event Acquisition Helpers | Codex 5.5 Local | `docs/design/known-spell-acquisition-event-plan.md` | pure helper + focused tests | Landed | Produces proposed character-scoped known-spell records from explicit training-event evidence only; no save/session mutation, persisted acquisition events, active casting, commands, UI, or broader routes/scopes. |
| 20 | `0.5.98` | Magic Command Contract | Codex 5.5 Local docs-first | `docs/design/magic-command-contract-plan.md` | command contract plan | Landed | Defined selected spell, caster, target, conduit source, catalyst source, and casting-context command shape only; no runtime cast resolver, cast commands, UI, save mutation, effect application, or catalyst consumption. |
| 21 | `0.5.99` | First Narrow Runtime Cast Resolver Plan | Codex 5.5 Local docs-first | `docs/design/first-narrow-runtime-cast-resolver-plan.md` | resolver boundary plan | Landed | Planned the first narrow engine-owned resolver boundary only; no effect implementation, command handler wiring, UI dispatch, save mutation, resource payment, catalyst consumption, or event creation. |
| 22 | `0.5.100` | Runtime Cast Resolver Readiness Helper | Codex 5.5 Local | `docs/design/first-narrow-runtime-cast-resolver-plan.md` | pure resolver readiness helper + focused tests | Landed | Added pure deterministic resolver readiness only; calls `buildMagicCastReadiness(...)` and returns issues without effectful casting, command handlers, UI dispatch, save mutation, resource payment, catalyst consumption/reservation, inventory mutation, target resolution, or event creation. |
| 23 | `0.5.101` | Magic Resolver Planned Output Envelope Plan | Codex 5.5 Local docs-first | `docs/design/magic-resolver-planned-output-envelope-plan.md` | planning doc | Landed | Planned inert result-envelope policy only; no emitted events, effect application, command handlers, UI dispatch, save mutation, resource payment, catalyst consumption/reservation, inventory mutation, or target resolution. |
| 24 | `0.5.102` | Magic Resolver Inert Envelope Helper | Codex 5.5 Local | `docs/design/magic-resolver-planned-output-envelope-plan.md` | pure helper + focused tests | Landed | Added inert planned envelope result helper only; no emitted events, runtime dispatch, effects, target resolution, resource payment, catalyst behavior, mutation, UI, or generated output. |
| 25 | `0.5.103` | Spell Hook Support Expansion Plan | Codex 5.5 Local docs-first | `docs/design/spell-hook-support-expansion-plan.md` | planning doc | Landed | Defined six hook classes, current readiness/inert-envelope behavior, owner requirements, authoring rules, and future sequence; no hook execution or runtime behavior. |
| 26 | `0.5.104` | Spell Hook Classification Audit | Codex 5.5 Local audit | `docs/design/spell-hook-support-expansion-plan.md` | audit tables + narrow docs | Landed; temporary audit later consumed | Confirmed spell lint as the authored authority, recorded intentional differences and current risks, and changed no runtime, content, schema, or UI behavior. |
| 27 | `0.5.105` | Spell Hook Support Constants Cleanup | Codex 5.5 Local | `packages/shared/types/src/spell-hook-support.ts` | focused constants cleanup + parity tests | Landed | Added one browser-safe authored authority, lint/UI consumers, a readiness adapter, and exact inventory/parity/subset/precedence tests without behavior changes. |
| 28 | `0.5.106` | Pure Hook Support Projection Helper | Codex 5.5 Local | `packages/engines/game-engine/src/known-spells.ts` | pure helper + focused tests | Landed | Projects six classes and blocker details from explicit support input; no execution, mutation, readiness weakening, UI, content, schema, or combat changes. |
| 29 | `0.5.107` | Knowledge Domain Registry Plan | Codex 5.5 Local docs-first | `docs/design/knowledge-domain-registry-plan.md` | planning doc | Landed | Defined the broader future registry shape, Wave 0 target, Waves 1-3, groups, source/evidence vocabulary, ownership boundaries, validation rules, schema gaps, and safe sequence without implementation. |
| 30 | `0.5.108` | Knowledge Domain Registry Schema Plan | Codex 5.5 Local docs-first | `docs/design/knowledge-domain-registry-schema-plan.md` | planning doc | Landed | Selected the separate schema/content paths, exact field and enum contract, reference authorities, semantic lint ownership, and no-alias transition without implementation. |
| 31 | `0.5.109` | Knowledge Domain Registry Seed Data Plan | Codex 5.5 Local docs-first | `docs/design/knowledge-domain-registry-seed-data-plan.md` | planning doc | Landed | Defined all required fields for the five exact Wave 0 records, constrained General Lore `custom` use, and separated Arcane Lore registry metadata from legacy identification policy and skill linking. |
| 32 | `0.5.110` | Knowledge Domain Registry Schema File | Codex 5.5 Local | `packages/schemas/player/knowledge-domain-registry.schema.json` | schema file + focused schema test | Landed | Added the exact 20-field structural record schema and focused parse-test registration without seed content, semantic validation, runtime loading, or behavior changes. |
| 33 | `0.5.111` | Knowledge Domain Registry Seed Data | Codex 5.5 Local | `packages/content/base/player/knowledge_domain_registry.json` | broad registry content JSON | Landed | Added the exact approved five-record wrapper/content file without semantic validation, skill-link changes, legacy policy edits, runtime loading, or behavior changes. |
| 34 | `0.5.112` | Knowledge Domain Registry Semantic Validator Plan | Codex 5.5 Local docs-first | `docs/design/knowledge-domain-registry-semantic-validator-plan.md` | planning doc | Completed | Defined schema-first lint ownership, exact semantic checks, focused tests, and acceptance criteria without implementation or behavior changes. |
| 35 | `0.5.113` | Knowledge Domain Registry Semantic Validator | Codex 5.5 Local | `tools/content-lint/knowledge-domain-registry.mjs` | focused content-lint validator + tests | Completed | Added schema-driven structural and semantic validation plus focused tests without content, schema, skill-link, runtime, persistence, generated-output, snippet, trial, UI, or gameplay changes. |
| 36 | `0.5.114` | Skill Knowledge Domain Reference Realignment Plan | Codex 5.5 Local docs-first | `docs/design/skill-knowledge-domain-reference-realignment-plan.md` | planning doc | Completed | Audited every current link, selected the Arcane Lore metadata reference, deferred Folk and Civic Lore, and scoped a fixture-only focused-test update without implementation. |
| 37 | `0.5.115` | Skill Knowledge Domain Reference Realignment | Codex 5.5 Local | `docs/design/skill-knowledge-domain-reference-realignment-plan.md` | narrow skill metadata + focused test fixture | Completed | Added one Arcane Lore `knowledgeDomainId` field and made the positive unreferenced-domain test data-independent without registry, legacy policy, schema, validator behavior, runtime, persistence, snippet, UI, or gameplay changes. |
| 38 | `0.5.116` | Knowledge Snippet Content Authoring Plan | Codex 5.5 Local docs-first | `docs/design/knowledge-snippet-content-authoring-plan.md` | planning doc | Completed | Defined the exact four-record Tier 1 seed, future wrapper, schema hardening, semantic validation ownership, and non-runtime boundaries without implementation. |
| 39 | `0.5.117` | Knowledge Snippet Schema Hardening | Codex 5.5 Local | `packages/schemas/player/knowledge_snippet.schema.json` | schema hardening + focused schema test | Completed | Hardened and registered the record schema without snippet JSON, semantic validation, runtime loading, evidence, progress, completion, trials, UI, events, persistence, or ownership changes. |
| 40 | `0.5.118` | Knowledge Snippet Seed Data | Codex 5.5 Local | `packages/content/base/player/knowledge_snippets.json` | four-record content JSON | Completed | Added exactly the approved Tier 1 records under the hardened schema without semantic validation, runtime loading, evidence, progress, completion, trials, UI, events, persistence, or ownership changes. |
| 41 | `0.5.119` | Knowledge Snippet Semantic Validator Plan | Codex 5.5 Local docs-first | `docs/design/knowledge-snippet-semantic-validator-plan.md` | planning doc | Completed | Defined schema-first cross-file validation, authority maps, prerequisite graph rules, focused tests, and acceptance criteria without implementation. |
| 42 | `0.5.120` | Knowledge Snippet Semantic Validator | Codex 5.5 Local | `docs/design/knowledge-snippet-semantic-validator-plan.md` | focused content-lint validator + tests | Completed | Added schema-first semantic validation, 49 focused tests, and normal lint registration without content/schema, runtime, state, UI, persistence, or ownership changes. |
| 43 | `0.5.121` | Knowledge Evidence Contract Plan | Codex 5.5 Local docs-first | `docs/design/knowledge-evidence-contract-plan.md` | planning doc | Completed | Defined evidence identity, character-first beneficiary ownership, source/context separation, validation boundaries, examples, and implementation sequence without state behavior. |
| 44 | `0.5.122` | Knowledge Evidence Schema Plan | Codex 5.5 Local docs-first | `docs/design/knowledge-evidence-schema-plan.md` | planning doc | Completed | Selected the exact record schema path, wrapper posture, required fields, patterns, enums, strict context shape, schema tests, and semantic boundary without implementation. |
| 45 | `0.5.123` | Knowledge Evidence Schema | Codex 5.5 Local | `packages/schemas/player/knowledge_evidence.schema.json` | schema file + focused schema tests | Completed | Added evidence structure only; no evidence content/state, runtime loading, semantic validator, progress, completion, trials, UI, persistence, or ownership behavior. |
| 46 | `0.5.124` | Knowledge Evidence Semantic Validator Plan | Codex 5.5 Local docs-first | `packages/schemas/player/knowledge_evidence.schema.json` | planning doc | Next | Plan cross-reference, owner, source, source/context compatibility, duplicate identity, focused tests, and acceptance criteria without implementation. |
| 47 | `0.5.125` | Knowledge Evidence Semantic Validator | Codex 5.5 Local | Future validator plan | focused validator + tests | Planned | Validate evidence only; no progress credit, persistence, runtime producers, trials, UI, or gameplay behavior. |

## Default Prompt Pattern

Each future Codex prompt should:

1. Read `AGENTS.md`, `README.md`, `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`, and this sequence file first.
2. Read the active version's primary source plan or source file.
3. Keep the patch narrow and owner-aware.
4. Update `docs/dev/current-codex-output.md` at the end.
5. Update `docs/future_content_backlog.md` with a concise run note when useful.
6. Avoid updating direction-bearing docs unless a handoff would become misleading.
7. Keep numbering inside the current version band until the roadmap explicitly declares a milestone transition.

## Sequence Guardrails

- Do not skip directly from planning/audit to broad runtime rewrites.
- Do not mix tooling cleanup with gameplay features.
- Do not mix creator shell/sidebar refinement with combat, calendar/climate, economy, Chronicle, Bloodlines, Legacy, Family Prestige, heirloom, estate, or bequest work.
- Do not extract a universal shell before a later dedicated shell pass scopes it.
- Do not add generated UI output during magic runtime-helper work.
- Do not import Node-only content loaders or engine barrels into browser-facing UI files.
- Do not mix resolver readiness helper work with combat math rewrites, active spell effects, ammo behavior, ranged balancing, broad equipment slot metadata, shield/armor training, hybrid/improvised weapon policy, or UI implementation.
- Do not begin effectful runtime magic until known-spell ownership helpers, validation, acquisition evidence helpers, read-only projection, cast-readiness helper, training-event acquisition helpers, command contract, resolver readiness helper, planned-output-envelope policy, inert envelope helper, hook classification audit, pure hook projection, executable-owner planning, and blocked-hook tests are explicitly implemented in narrow slices.
- Do not combine the legacy combat spell-staging or multi-effect branch-order findings with constants cleanup or pure projection work.
- Keep the registry schema file, seed data, semantic validator planning, semantic validator implementation, and skill-reference realignment as separate runs.
- Keep snippet authoring, schema hardening, seed data, semantic validator planning, semantic validator implementation, evidence, progress, trials, and UI as separate runs.
- Keep the evidence contract, schema planning, schema file, evidence state, progress state, evidence-to-progress rules, trials, and UI as separate runs.

## When To Reorder

Reorder only if:

- a newer `docs/dev/current-codex-output.md` explicitly changes direction;
- a blocking validation/tooling issue prevents the next step;
- the user explicitly chooses a different target;
- a connector/Codex inspection finds the source plan stale or unsafe;
- the roadmap explicitly declares that the project has reached a new version-band milestone.

If reordered, update this file and `docs/dev/project-roadmap.md` together.
