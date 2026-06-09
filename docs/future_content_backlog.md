# Future Content Backlog

This file tracks content and systems that are intentionally deferred.

## Update Policy

- Review this file alongside `README.md` before substantial Codex command runs or content edits so deferred intent is considered up front.
- Update this file on every Codex run that adds, defers, narrows, or re-scopes future content.
- Add new backlog items as soon as they are deferred.
- Revise prerequisites and implementation notes when the plan changes.
- Remove items only when the underlying content and wiring are actually implemented.

## Run Notes

- 2026-06-09: Completed Knowledge Progress Schema for `Version 0.5.128`. Added `packages/schemas/player/knowledge_progress.schema.json` as the strict 11-field record-level structural contract and registered it in the focused schema-file test. The schema preserves character-only ownership, exact snippet/domain/subject snapshots, non-negative integer progress and sequence values, structurally empty consumed-evidence arrays, required notes, and strict deferred-field exclusion. Progress/evidence content or state, semantic validation, evidence credit, runtime producers, persistence, completion, trials, UI, generated output, ownership mutation, and gameplay behavior remain deferred.
- 2026-06-08: Completed the planning-only Knowledge Progress Schema Plan for `Version 0.5.127`. `docs/design/knowledge-progress-schema-plan.md` selects `packages/schemas/player/knowledge_progress.schema.json` as a future strict record-level schema, requires the 11 approved fields, freezes exact id patterns and enums, allows empty consumed-evidence arrays structurally, requires at least one unique note, excludes deferred state fields, and defines focused schema registration plus `0.5.128` acceptance criteria. No progress schema/content/state/validator, evidence content/state, runtime producer, persistence, completion, trials, UI, generated output, events, ownership behavior, or gameplay behavior was added.
- 2026-06-08: Completed the planning-only Knowledge Progress State Plan for `Version 0.5.126`. `docs/design/knowledge-progress-state-plan.md` defines character-owned progress identity for one authored snippet, finite non-negative integer progress points, consumed-evidence boundaries, deferred source audit detail, future schema and semantic-validation ownership, illustrative fixtures, and the schema-to-UI sequence. No progress schema/content/state, evidence content/state, runtime producer, persistence, completion, trials, UI, generated output, events, ownership behavior, or gameplay behavior was added.
- 2026-06-08: Completed Knowledge Evidence Semantic Validator for `Version 0.5.125`. Added `tools/content-lint/knowledge-evidence.mjs` as a pure schema-first helper plus 76 focused in-memory tests. The helper validates exact wrapper shape, evidence schema compliance, duplicate evidence and authority ids, active snippet/domain relationships, source/context compatibility, null-only source ids, character-only owner posture, and narrow region/settlement context relationships. No evidence JSON/content/state, normal content-lint registration, runtime producer, persistence, progress, completion, trials, UI, events, sharing, ownership mutation, or gameplay behavior was added.
- 2026-06-08: Completed the planning-only Knowledge Evidence Semantic Validator Plan for `Version 0.5.124`. `docs/design/knowledge-evidence-semantic-validator-plan.md` selects a schema-first, test-fixture-only pure helper for the first implementation, defines snippet/domain and narrow location authorities, character/pattern-only ownership, null-only source ids, source/context compatibility, duplicate identity checks, focused tests, and acceptance criteria. Validator implementation, evidence content/state, runtime producers, progress, completion, trials, UI, events, persistence, sharing, ownership mutation, and gameplay behavior remain deferred.
- 2026-06-08: Completed Knowledge Evidence Schema for `Version 0.5.123`. Added `packages/schemas/player/knowledge_evidence.schema.json` as a strict record-level contract and registered it in the focused schema-file test. The schema requires exact evidence identity, snippet/domain/subject/source, character ownership, deterministic sequence, strict context, and at least one note while excluding deferred state fields. Evidence content/state, semantic validation, runtime loading, progress, completion, trials, UI, events, persistence, sharing, ownership mutation, and gameplay behavior remain deferred.
- 2026-06-08: Completed the planning-only Knowledge Evidence Schema Plan for `Version 0.5.122`. `docs/design/knowledge-evidence-schema-plan.md` selects the future strict record-level schema path, required fields and identifier patterns, character-only owner enum, nullable source reference, closed acquisition-context structure, focused schema-file test posture, and later semantic-validation boundary. Evidence schema/content/state, semantic validation, runtime loading, progress, completion, trials, UI, events, persistence, sharing, ownership mutation, and gameplay behavior remain deferred.
- 2026-06-08: Completed the planning-only Knowledge Evidence Contract Plan for `Version 0.5.121`. `docs/design/knowledge-evidence-contract-plan.md` defines evidence identity, character-first beneficiary ownership, source-route compatibility, acquisition context, snippet relationships, validation layers, illustrative examples, and the schema-to-progress sequence. Evidence schema/content/state, runtime loading, progress, completion, trials, UI, events, persistence, sharing, ownership mutation, and gameplay behavior remain deferred.
- 2026-06-07: Completed Knowledge Snippet Semantic Validator for `Version 0.5.120`. Added a snippet-scoped fail-closed structural adapter, active-domain and canonical-authority checks, discovery-source and location validation, visibility constraints, prerequisite reference and cycle checks, 49 focused tests, and normal content-lint registration. The unchanged four-record catalog now passes as part of the 55-file lint count. Runtime loading, evidence, progress, completion, trials, UI, events, persistence, ownership, and gameplay behavior remain deferred.
- 2026-06-07: Completed the planning-only Knowledge Snippet Semantic Validator Plan for `Version 0.5.119`. `docs/design/knowledge-snippet-semantic-validator-plan.md` defines content-lint ownership, a snippet-scoped fail-closed structural gate, active-domain and authority checks, discovery-source and prerequisite graph rules, the complete focused test matrix, and acceptance criteria. Validator implementation, runtime loading, evidence, progress, completion, trials, UI, events, persistence, ownership, and gameplay behavior remain deferred.
- 2026-06-07: Completed Knowledge Snippet Seed Data for `Version 0.5.118`. Added `packages/content/base/player/knowledge_snippets.json` with exactly the approved Tier 1 Aloe, Badger, Iron Ore, and Kaelvar records under the hardened schema. Semantic validation, runtime loading, evidence, progress, completion, trials, UI, events, persistence, ownership, and gameplay behavior remain deferred.
- 2026-06-07: Completed Knowledge Snippet Schema Hardening for `Version 0.5.117`. The record-level schema now requires the intended authored fields, explicit progression and visibility values, canonical identifier patterns, non-empty authored strings, and exact-duplicate protections, and it is registered in the focused schema-file test. Snippet JSON, semantic validation, runtime loading, evidence, progress, completion, trials, UI, events, persistence, ownership, and gameplay behavior remain deferred.
- 2026-06-07: Completed the planning-only Knowledge Snippet Content Authoring Plan for `Version 0.5.116`. `docs/design/knowledge-snippet-content-authoring-plan.md` defines a four-record Tier 1 seed for Aloe, Badger, Iron Ore, and Kaelvar across the four active broad domains, excludes planned Arcane Lore, selects `player/knowledge_snippets.json`, and requires schema hardening before seed data followed by separate semantic validation. Snippet JSON, schema changes, validators, runtime loading, evidence, progress, completion, trials, UI, events, persistence, and ownership remain deferred.
- 2026-06-07: Completed Skill Knowledge Domain Reference Realignment for `Version 0.5.115`. `skill.knowledge.arcane_lore` now references the broad-only `knowledge_domain.arcane_lore` metadata record, while Folk Lore and Civic Lore remain unlinked pending specific future domains. The focused optional-reference test now constructs an unreferenced-domain condition in a cloned fixture. The broad Arcane Lore record's now-stale future-link note remains for a later explicitly authorized registry metadata cleanup. Legacy policy, schemas, validator behavior, runtime loading, snippets, evidence, progress, completion, trials, UI, events, persistence, and ownership remain unchanged or deferred.
- 2026-06-06: Completed the planning-only Skill Knowledge Domain Reference Realignment Plan for `Version 0.5.114`. `docs/design/skill-knowledge-domain-reference-realignment-plan.md` confirms all ten current links, selects `knowledge_domain.arcane_lore` for the later Arcane Lore skill metadata edit, defers Folk Lore and Civic Lore until specific broad domains exist, and identifies the focused validator-test fixture assumption that must change in `0.5.115`. Skill-reference implementation, domain expansion, snippets, evidence, progress, completion, trials, UI, events, persistence, and runtime loading remain deferred.
- 2026-06-06: Completed Knowledge Domain Registry Semantic Validator for `Version 0.5.113`. Content lint now applies a narrow fail-closed structural adapter plus semantic checks for wrapper identity, source families, custom notes, skill and school-skill references, content collections, policy-null posture, the legacy-policy subset, and broad-registry skill `knowledgeDomainId` authority. Skill-reference realignment, snippets, evidence, progress, completion, trials, UI, events, persistence, and runtime loading remain deferred.
- 2026-06-06: Completed the planning-only Knowledge Domain Registry Semantic Validator Plan for `Version 0.5.112`. `docs/design/knowledge-domain-registry-semantic-validator-plan.md` defines schema-first lint orchestration, exact wrapper/identity/source/reference/policy/custom/subset checks, broad-registry ownership for skill `knowledgeDomainId`, focused tests, and acceptance criteria. Validator implementation, skill-reference realignment, snippets, evidence, progress, completion, trials, UI, events, persistence, and runtime loading remain deferred.
- 2026-06-06: Completed Knowledge Domain Registry Seed Data for `Version 0.5.111`. Added `packages/content/base/player/knowledge_domain_registry.json` with exactly the approved five Wave 0 records and verified exact plan parity plus structural compliance with the live broad-registry schema. Semantic validator planning/implementation, skill-reference realignment, snippets, evidence, progress, completion, trials, UI, events, persistence, and runtime loading remain deferred.
- 2026-06-06: Completed the Knowledge Domain Registry Schema File for `Version 0.5.110`. Added `packages/schemas/player/knowledge-domain-registry.schema.json` with the exact structural 20-field record contract and registered it in the focused schema-file test. Broad registry seed content, semantic validator planning/implementation, skill-reference realignment, snippets, evidence, progress, completion, trials, UI, events, persistence, and runtime loading remain deferred.
- 2026-06-06: Completed the planning-only Knowledge Domain Registry Seed Data Plan for `Version 0.5.109`. `docs/design/knowledge-domain-registry-seed-data-plan.md` defines every required field for the exact five Wave 0 records, verifies current skill, school-skill, snippet-enum, and base-content collection references, limits `custom` to explicitly constrained General Lore use, and keeps Arcane Lore separate from legacy identification policy and skill-link behavior. Registry schema creation, seed content, semantic validator planning/implementation, skill-reference realignment, snippets, evidence, progress, completion, trials, UI, events, persistence, and runtime loading remain deferred.
- 2026-06-05: Completed the planning-only Knowledge Domain Registry Schema Plan for `Version 0.5.108`. `docs/design/knowledge-domain-registry-schema-plan.md` selects a separate broad registry schema/content file, exact required fields and enums, file-derived content-collection ids, `skill.magic.school.*` records as the current magic-school authority, content-lint semantic ownership, and a no-alias transition that leaves current identification behavior untouched. Registry seed data planning, schema/content implementation, legacy identification-policy naming cleanup, snippets, evidence, progress, completion, trials, UI, events, persistence, and runtime loading remain deferred.
- 2026-06-05: Completed the planning-only Knowledge Domain Registry Plan for `Version 0.5.107`. `docs/design/knowledge-domain-registry-plan.md` now defines the stable future record shape, the five-domain Wave 0 set, normalized groups and Waves 0-3, source-family and evidence-owner vocabulary, registry/snippet/runtime ownership boundaries, validation rules, schema gaps, and the safe future sequence. Registry schema, seed data, snippet content, evidence contracts, progress state, completion math, trials, UI, Chronicle/Renown events, persistence, and runtime loading remain deferred.
- 2026-06-05: Completed the Pure Hook Support Projection Helper for `Version 0.5.106`. `buildMagicHookSupportProjection(...)` now returns deterministic six-class policy provenance, supported/blocking readiness effects, source fields, blocker reasons, and explicit `executable: false` results without changing readiness outcomes. The temporary classification audit was consumed; legacy combat staging, compatibility gating, multi-effect semantics, and status approximations were promoted into `docs/design/legacy-combat-spell-runtime-ownership-plan.md`. Executable hook-owner planning, active casting, target resolution, runtime events, and resource/catalyst/inventory mutation remain deferred.
- 2026-06-05: Completed Spell Hook Support Constants Cleanup for `Version 0.5.105`. A browser-safe shared authored authority now feeds lint, Arcane Compendium presentation, and focused readiness tests, with exact inventory, parity, combat-subset, and six-class precedence coverage. The pure six-class hook support projection helper, legacy combat spell-staging ownership, multi-effect spell resolution, status-approximation review, executable hook-owner planning, active casting, hook execution, target resolution, runtime events, and resource/catalyst/inventory mutation remain deferred.
- 2026-06-05: Completed the read-only Spell Hook Classification Audit for `Version 0.5.104`. Browser-safe hook support constants cleanup, exact parity/subset and readiness-precedence tests, a pure six-class hook support projection helper, legacy combat spell-staging ownership, multi-effect spell resolution, status-approximation review, executable hook-owner planning, active casting, hook execution, target resolution, runtime events, and resource/catalyst/inventory mutation remain deferred.
- 2026-06-05: Added the planning-only Spell Hook Support Expansion Plan for `Version 0.5.103`. Hook classification audit, hook support constants cleanup, a pure hook support projection helper, executable hook-owner plans, active casting, target resolution, effect execution, runtime events, resource/catalyst/inventory mutation, Chronicle/Renown/quest outputs, knowledge snippet runtime behavior, skill trial runtime behavior, magic study runtime behavior, and teacher/institution/scroll/tome/document acquisition routes remain deferred.
- 2026-06-04: Added the pure Magic Resolver Inert Envelope Helper for `Version 0.5.102`. Active runtime cast resolver implementation, emitted events, command handlers, UI dispatch, target resolution, spell effect application, resource payment, catalyst consumption/reservation, inventory mutation, combat/Chronicle/quest/account/save/UI event creation, save/account/session schema changes, control/failure/backlash behavior, knowledge snippet runtime behavior, skill trial runtime behavior, magic study event runtime behavior, scroll/tome/document/teacher/institution/family/Legacy acquisition routes, broader owner scopes, and `PlayerSpellState[]` replacement remain deferred.
- 2026-06-04: Added the planning-only Magic Resolver Planned Output Envelope Plan for `Version 0.5.101`. The future pure inert envelope helper, active runtime cast resolver implementation, emitted events, command handlers, UI dispatch, target resolution, effect application, resource payment, catalyst consumption/reservation, inventory mutation, combat/Chronicle/quest/account/save/UI event creation, save/account/session schema changes, control/failure/backlash behavior, knowledge snippet runtime behavior, skill trial runtime behavior, magic study event runtime behavior, scroll/tome/document/teacher/institution/family/Legacy acquisition routes, broader owner scopes, and `PlayerSpellState[]` replacement remain deferred.
- 2026-06-04: Added snippet-based knowledge domain backlog after creating the planning-only `packages/schemas/player/knowledge_snippet.schema.json`. The schema is not wired into runtime content loading. Knowledge snippets, domain completion, knowledge trials, book/teacher/institution discovery, travel-gated knowledge, Chronicle/Renown outputs, and UI remain deferred.
- 2026-06-04: Added the pure Runtime Cast Resolver Readiness Helper for `Version 0.5.100`. Active runtime cast resolver implementation, planned output envelope implementation, command handlers, UI dispatch, effect application, target resolution, resource payment, catalyst consumption/reservation, inventory mutation, combat/Chronicle/quest/account/save/UI event creation, save/account/session schema changes, control/failure/backlash behavior, scroll/tome/document teaching, broader acquisition routes, broader owner scopes, and `PlayerSpellState[]` replacement remain deferred.

## Knowledge Systems

### Snippet-based knowledge domains

- Status: deferred
- Source planning: `docs/design/knowledge-domain-registry-plan.md`, `docs/design/knowledge-domain-registry-schema-plan.md`, `docs/design/knowledge-domain-registry-seed-data-plan.md`, `docs/design/knowledge-domain-registry-semantic-validator-plan.md`, `docs/design/skill-knowledge-domain-reference-realignment-plan.md`, `docs/design/knowledge-snippet-content-authoring-plan.md`, `docs/design/knowledge-snippet-semantic-validator-plan.md`, `docs/design/knowledge-evidence-contract-plan.md`, `docs/design/knowledge-evidence-schema-plan.md`, `docs/design/knowledge-evidence-semantic-validator-plan.md`, `docs/design/knowledge-progress-state-plan.md`, `docs/design/knowledge-progress-schema-plan.md`, `packages/schemas/player/knowledge_snippet.schema.json`, `packages/schemas/player/knowledge_evidence.schema.json`, `packages/schemas/player/knowledge_progress.schema.json`, and `docs/design/skill-mastery-trial-framework-plan.md`
- Prerequisite: semantic validation, evidence contract/schema/validator work, progress-state planning, progress-schema planning, and the strict progress record schema have landed; next plan and implement progress semantic validation before evidence-to-progress rules, producers, completion behavior, and later trial/checkpoint integration
- Intended owner: player progression/knowledge content, future codex/map/resource UI, travel/exploration systems, economy/material systems, magic study systems, and Chronicle/Renown projection layers
- Intended implementation:
  - use snippet-based knowledge rather than whole-record-only discovery
  - track domain/tier completion from authored snippets such as identification, habitat, use, byproduct, processing, danger, lookalike, regional variant, ritual use, historical context, and cultural context
  - allow snippets to come from field identification, resource use, crafting use, combat observation, travel observation, book study, teacher instruction, institutional study, scroll/tome study, quest events, and Chronicle records
  - keep book, scroll, tome, teacher, institution, and travel access as study/discovery sources only; possession or access must not automatically grant knowledge
  - use knowledge trials to unlock deeper tiers when enough tier completion is reached
  - keep knowledge distinct from skills and magic: skills represent action capability, magic study represents spell acquisition, knowledge represents discovered understanding

#### Canonical domain backlog

Initial/current domains to retain and formalize:

- `knowledge_domain.flora`
- `knowledge_domain.fauna`
- `knowledge_domain.minerals`
- `knowledge_domain.arcane_lore`
- `knowledge_domain.general_lore`

High-priority missing domains for the first registry pass:

- `knowledge_domain.ecology`
- `knowledge_domain.geography`
- `knowledge_domain.settlement_lore`
- `knowledge_domain.monster_lore`
- `knowledge_domain.trade_goods`
- `knowledge_domain.material_processing`
- `knowledge_domain.medicine`
- `knowledge_domain.arcane_theory`
- `knowledge_domain.catalysts`
- `knowledge_domain.conduits`
- `knowledge_domain.institutions`
- `knowledge_domain.cultures`
- `knowledge_domain.history`
- `knowledge_domain.tactics`

Full candidate backlog for later domain expansion:

- `knowledge_domain.regional_geography`
- `knowledge_domain.routes_and_passes`
- `knowledge_domain.ocean_lanes`
- `knowledge_domain.locality_lore`
- `knowledge_domain.biomes`
- `knowledge_domain.habitats`
- `knowledge_domain.climate`
- `knowledge_domain.seasonal_patterns`
- `knowledge_domain.beast_lore`
- `knowledge_domain.undead_lore`
- `knowledge_domain.aberration_lore`
- `knowledge_domain.draconic_lore`
- `knowledge_domain.customs`
- `knowledge_domain.law`
- `knowledge_domain.nobility`
- `knowledge_domain.local_politics`
- `knowledge_domain.heraldry`
- `knowledge_domain.guilds`
- `knowledge_domain.orders`
- `knowledge_domain.temples`
- `knowledge_domain.academies`
- `knowledge_domain.underworld`
- `knowledge_domain.markets`
- `knowledge_domain.local_economy`
- `knowledge_domain.caravan_routes`
- `knowledge_domain.crafting_materials`
- `knowledge_domain.smithing_materials`
- `knowledge_domain.alchemy_reagents`
- `knowledge_domain.textiles`
- `knowledge_domain.woodworking_materials`
- `knowledge_domain.leatherworking_materials`
- `knowledge_domain.anatomy`
- `knowledge_domain.herbalism`
- `knowledge_domain.toxicology`
- `knowledge_domain.disease`
- `knowledge_domain.field_surgery`
- `knowledge_domain.spellcraft`
- `knowledge_domain.rituals`
- `knowledge_domain.wards`
- `knowledge_domain.elemental_lore`
- `knowledge_domain.divine_lore`
- `knowledge_domain.dark_lore`
- `knowledge_domain.druidic_lore`
- `knowledge_domain.religion`
- `knowledge_domain.doctrine`
- `knowledge_domain.myth`
- `knowledge_domain.saints_and_relics`
- `knowledge_domain.cults`
- `knowledge_domain.archaeology`
- `knowledge_domain.ancient_languages`
- `knowledge_domain.genealogy`
- `knowledge_domain.bloodline_lore`
- `knowledge_domain.relic_lore`
- `knowledge_domain.weapon_lore`
- `knowledge_domain.armor_lore`
- `knowledge_domain.siegecraft`
- `knowledge_domain.military_orders`

## Cleanup Notes

This backlog was intentionally compacted on 2026-06-04 to remove stale long-form historical run notes that had already been processed into current handoffs, roadmap entries, design plans, or retained historical audit documents. Durable current guidance should live in the specific design documents and handoffs referenced above rather than remaining duplicated as old run-note paragraphs here.
