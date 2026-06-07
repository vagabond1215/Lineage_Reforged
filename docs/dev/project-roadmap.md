# Lineage: Reforged - Long-Term Project Roadmap

Last reviewed: 2026-06-07

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

- Latest completed version: `Version 0.5.118 - Knowledge Snippet Seed Data`
- Next recommended version: `Version 0.5.119 - Knowledge Snippet Semantic Validator Plan`
- Current near-term sequence source: `docs/dev/codex-sequenced-implementation-plan.md`
- Current phase: `v0.5.x` foundation stabilization / ownership hardening

Versioning rule:

- Patch numbers may exceed two digits inside the current band.
- Do not roll from `0.5.118` to `0.6.0` unless the actual `0.6.x` runtime ownership milestone has been reached.

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
- Training-event acquisition helpers have landed as pure deterministic helpers that validate explicit character-scoped `training_event` acquisition input and propose in-memory known-spell records without mutation.
- Magic command contract planning has landed as `docs/design/magic-command-contract-plan.md`, defining the future `magic.cast` command/intention shape before resolver behavior.
- First narrow runtime cast resolver planning has landed as `docs/design/first-narrow-runtime-cast-resolver-plan.md`, defining the future pure resolver-readiness boundary before effectful casting.
- Runtime cast resolver readiness helpers have landed as pure deterministic helpers that validate explicit command-like input, call `buildMagicCastReadiness(...)`, and return resolver issues without mutation or event creation.
- Magic resolver planned output envelope policy has landed as `docs/design/magic-resolver-planned-output-envelope-plan.md`; planned envelopes are inert result projections only.
- Magic resolver inert envelope helpers have landed as pure deterministic helpers that return planned result envelopes with explicit no-event/no-mutation/no-effect safety flags.
- Spell hook support expansion planning has landed as `docs/design/spell-hook-support-expansion-plan.md`, defining the six-class readiness taxonomy, current classification drift, executable-owner criteria, and future hook sequence.
- Spell hook support constants cleanup has landed as `packages/shared/types/src/spell-hook-support.ts`, providing one browser-safe authored authority, a readiness-shaped adapter, lint/UI consumers, and exact parity, subset, inventory, and precedence tests.
- Pure hook support projection has landed as `buildMagicHookSupportProjection(...)`, returning deterministic six-class classification authority, supported/blocking readiness effects, source fields, blocker reasons, and explicit non-executable status from caller-supplied policy.
- The temporary spell-hook classification audit was consumed and removed. Its unresolved legacy combat staging, multi-effect, compatibility, and status-approximation findings now live in `docs/design/legacy-combat-spell-runtime-ownership-plan.md`.
- Skill mastery trials and magic study events are now planned in `docs/design/skill-mastery-trial-framework-plan.md`.
- Snippet-based knowledge progression has a planning schema at `packages/schemas/player/knowledge_snippet.schema.json` and a domain backlog in `docs/future_content_backlog.md`.
- Knowledge-domain registry planning has landed in `docs/design/knowledge-domain-registry-plan.md`, defining the broader future record shape, the five-domain Wave 0 target, Waves 1-3, groups, source/evidence vocabulary, ownership boundaries, validation rules, schema gaps, and future sequence.
- Knowledge-domain registry schema planning has landed in `docs/design/knowledge-domain-registry-schema-plan.md`. It selects a separate broad registry schema/content file, exact record constraints, file-derived content-collection ids, magic-school skill ids as the current school authority, content-lint semantic ownership, and a no-alias current-data transition.
- Knowledge-domain registry seed-data planning has landed in `docs/design/knowledge-domain-registry-seed-data-plan.md`. It defines complete drafts for the five Wave 0 records, constrains `custom` to General Lore, verifies current references, preserves the legacy policy subset, and separates the schema file, seed data, semantic validation, and skill-reference realignment into later runs.
- The broad registry record schema exists at `packages/schemas/player/knowledge-domain-registry.schema.json` with the exact 20-field structural contract and focused schema-file test registration.
- The authored broad registry catalog exists at `packages/content/base/player/knowledge_domain_registry.json` with the exact five approved Wave 0 records.
- Broad registry structural and semantic content lint now enforces wrapper shape, schema compliance, source families, references, policy-null posture, custom notes, legacy-policy subset membership, and broad-registry skill-domain authority.
- The current `knowledge_domains.json` and `KnowledgeDomainRecord` remain the narrow legacy resource-identification shape. Four policy records exist today; `knowledge_domain.arcane_lore` exists only in the broad registry and is now linked from the Arcane Lore skill as metadata only.
- Skill-domain reference realignment planning has landed in `docs/design/skill-knowledge-domain-reference-realignment-plan.md`. It confirms all ten current references, selects the Arcane Lore broad-registry link for `0.5.115`, defers Folk Lore and Civic Lore until specific broad domains exist, and identifies the focused validator-test fixture assumption that must be updated without changing validator behavior.
- Skill-domain reference realignment has landed. `skill.knowledge.arcane_lore` now references `knowledge_domain.arcane_lore`, and the positive validator test now proves optional skill references through a cloned fixture rather than depending on Arcane Lore remaining unlinked.
- Knowledge snippet content authoring planning has landed in `docs/design/knowledge-snippet-content-authoring-plan.md`. It selects four Tier 1 records across the active Flora, Fauna, Minerals, and General Lore domains, excludes planned Arcane Lore, defines the future content wrapper, and requires schema hardening before seed data.
- The authored knowledge snippet record schema is hardened and registered in the focused schema-file test. It requires explicit authored text, progression, visibility, notes, canonical identifier patterns, and exact-duplicate protections while defining no runtime/player state.
- The first authored knowledge snippet catalog exists at `packages/content/base/player/knowledge_snippets.json` with the exact four approved Tier 1 Aloe, Badger, Iron Ore, and Kaelvar records. It remains content-only and is not runtime-loaded.
- Early known spells require explicit character-scoped acquisition evidence; account, family, institution, Legacy, scroll, tome, and document access must not automatically become character spell knowledge.
- Current `PlayerSpellState[]` remains readiness context, not a complete acquisition/ownership model.
- No economy clarity React UI, shop/trade/craft/caravan command UI, generated output, active magic behavior, runtime casting, cast commands, catalyst consumption, or broad economy/climate expansion has been added.
- Family Prestige earning/spending behavior, Family management, heirs, heirlooms, bequests, item-instance persistence, estate transfer/claim execution, Chronicle Marks, Lineage Seals, scoped Backstory evidence, knowledge snippet runtime behavior, knowledge trials, knowledge UI, skill trial runtime behavior, and magic study runtime behavior remain deferred.

## 2. Version-Band Maturity Model

These are internal development maturity markers, not public release promises. Patch numbers may exceed two digits and do not automatically roll over to the next minor band.

| Version Band | Development Meaning | Playability / Stability Checkpoint |
| --- | --- | --- |
| `v0.1.x` | Repository scaffold, workspace conventions, schemas, first canonical content foundations. | Not meaningfully playable; focus is structure and validation. |
| `v0.2.x` | Player identity, clean save/load behavior, creator/start-state, core local UI flow foundations. | Basic local character/start flow can exist, but systems are still thin. |
| `v0.3.x` | World, civilization, economy, reputation foundations, stricter content validation. | World data becomes coherent enough for deterministic simulation scaffolds. |
| `v0.4.x` | Account, Legacy, Chronicle, progression, and local persistence foundations. | Long-term progression surfaces begin to exist, but many are read-only or inert. |
| `v0.5.x` | Foundation stabilization, metadata guardrails, repo hygiene, validation hardening, ownership scaffolding. | Current phase. Playability is secondary to trustworthy ownership and validation. |
| `v0.6.x` | Runtime ownership transition: replace UI-authored/demo handling with engine-owned commands, tick/event output, authoritative session updates, and first connected advancement event scaffolds. | Use only when the actual runtime ownership milestone has been reached. |
| `v0.7.x` | Integrated gameplay systems interacting through stable shared contracts. | Systems should start to feel like a connected game instead of isolated scaffolds. |
| `v0.8.x` | Pre-alpha vertical-slice hardening, narrow content completeness, balancing, regression coverage. | Use only when a narrow playable path is being stabilized and tested. |
| `v0.9.x` | Alpha-readiness stabilization, current-data policy, known limitations, packaging/launch flow, clean save/load reliability, release-candidate QA. | Alpha-readiness only when a playable validated vertical slice exists with explicit limits. |
| `v1.0+` | Public release maturity. | Reserved. Not relevant to current planning. |

## 3. Active Pipeline

| Version | Name | Route | Type | Status / Intent | Key Guardrail |
| --- | --- | --- | --- | --- | --- |
| `0.5.95` | Magic Cast Readiness Helper | Codex Local | Pure helper + focused tests | Landed. Added deterministic read-only blocker results for cast readiness. | No effect application, resource payment, catalyst consumption, combat events, acquisition creation, or save mutation. |
| `0.5.96` | Known Spell Acquisition Event Planning | Codex Local docs-only | Planning | Landed. Defined training-event acquisition ownership and evidence boundaries before any acquisition mutation. | Planning-only; no acquisition creation, runtime casting, commands, React UI, save/account changes, or broader routes/scopes. |
| `0.5.97` | Training Event Acquisition Helpers | Codex Local | Pure helper + focused tests | Landed. Added pure helpers that validate explicit training-event acquisition input and return proposed character-scoped known-spell records. | No save/session mutation, persisted acquisition events, runtime casting, commands, React UI, broader routes/scopes, or schema changes. |
| `0.5.98` | Magic Command Contract | Codex Local docs-first | Command contract plan | Landed. Defined the command/intention shape for selected spell, caster, target, conduit source, catalyst source, and casting context before resolver behavior. | Contract only; no runtime cast resolver, cast commands, UI, save mutation, effect application, or catalyst consumption. |
| `0.5.99` | First Narrow Runtime Cast Resolver Plan | Codex Local docs-first | Resolver boundary plan | Landed. Planned the first narrow engine-owned resolver boundary using known-spell, readiness, and command-contract inputs. | Planning only; no effect implementation, command handler wiring, UI dispatch, save mutation, resource payment, catalyst consumption, or event creation. |
| `0.5.100` | Runtime Cast Resolver Readiness Helper | Codex Local | Pure resolver readiness helper + focused tests | Landed. Added a pure deterministic resolver-readiness helper that consumes explicit command-like input and calls `buildMagicCastReadiness(...)`. | No effectful casting, command handlers, UI dispatch, save mutation, resource payment, catalyst consumption/reservation, inventory mutation, target resolution, or event creation. |
| `0.5.101` | Magic Resolver Planned Output Envelope Plan | Codex Local docs-first | Planning | Landed. Planned inert result-envelope policy before any resolver output/event implementation. | Planning only; no emitted events, effect application, command handlers, UI dispatch, save mutation, resource payment, catalyst consumption/reservation, inventory mutation, or target resolution. |
| `0.5.102` | Magic Resolver Inert Envelope Helper | Codex Local | Pure helper + focused tests | Landed. Added a pure inert planned-envelope result helper with explicit safety flags. | No emitted events, runtime dispatch, effects, target resolution, resource payment, catalyst behavior, mutation, UI, generated output, or schema migration. |
| `0.5.103` | Spell Hook Support Expansion Plan | Codex Local docs-first | Planning | Landed. Defined current hook classes, readiness/inert-envelope behavior, executable promotion criteria, owner requirements, authoring rules, and future sequence. | Planning only; no generic hook execution, runtime effects, target resolution, events, resource/catalyst behavior, UI, or mutation. |
| `0.5.104` | Spell Hook Classification Audit | Codex Local audit | Read-only audit + documentation | Landed. Confirmed spell lint as the authored-classification authority, documented intentional registry differences, and recorded readiness, UI-drift, and legacy combat risks. | Documentation only; no hook execution, source refactor, runtime behavior, content JSON, schema, or UI changes. |
| `0.5.105` | Spell Hook Support Constants Cleanup | Codex Local | Focused constants cleanup + parity tests | Landed. Added a shared browser-safe authored authority, lint/UI consumers, an explicit readiness adapter, and exact inventory/parity/subset/precedence tests. | Preserved all hook ids, classes, compatibility statuses, readiness results, UI output, combat behavior, and no-execution boundaries. |
| `0.5.106` | Pure Hook Support Projection Helper | Codex Local | Pure helper + focused tests | Landed. Returns deterministic six-class hook projections and blocker detail from explicit support input. | Executes nothing, mutates nothing, preserves readiness behavior, and reports every hook as non-executable. |
| `0.5.107` | Knowledge Domain Registry Plan | Codex Local docs-first | Planning | Landed. Defined the future record shape, five-domain Wave 0 set, Waves 1-3, groups, source/evidence vocabulary, ownership boundaries, validation rules, schema gaps, and safe sequence. | Documentation only; no runtime loading, content JSON, schemas, completion math, trials, UI, events, persistence, or ownership changes. |
| `0.5.108` | Knowledge Domain Registry Schema Plan | Codex Local docs-first | Planning | Landed. Selected a separate broad registry schema/content file, exact field and enum contract, reference authorities, lint ownership, and current-data transition. | Documentation only; no schema file, seed data, content migration, runtime loading, snippets, state, trials, UI, or events. |
| `0.5.109` | Knowledge Domain Registry Seed Data Plan | Codex Local docs-first | Planning | Landed. Defined complete exact drafts for the five Wave 0 registry records and the schema-first implementation sequence. | Documentation only; no schema or JSON creation, skill-link edits, runtime loading, persistence, snippets, state, trials, UI, or events. |
| `0.5.110` | Knowledge Domain Registry Schema File | Codex Local | Schema file + focused schema test | Landed. Added the exact broad registry record schema and focused parse-test registration. | Structural schema only; no seed JSON, content-lint implementation, skill-link edits, runtime loading, persistence, snippets, state, trials, UI, or events. |
| `0.5.111` | Knowledge Domain Registry Seed Data | Codex Local | Broad registry content JSON | Landed. Added the exact five Wave 0 records under the live schema. | Seed content only; no semantic validator, skill-link edits, legacy policy changes, runtime loading, persistence, snippets, state, trials, UI, or events. |
| `0.5.112` | Knowledge Domain Registry Semantic Validator Plan | Codex Local docs-first | Planning | Completed. Defined the schema-first lint entrypoint, semantic checks, focused tests, and acceptance criteria. | Documentation only; no validator code, content, schema, skill, runtime, persistence, snippets, state, trials, UI, or events. |
| `0.5.113` | Knowledge Domain Registry Semantic Validator | Codex Local | Focused content-lint validator + tests | Completed. Added schema-driven structural gating, semantic/cross-file checks, broad skill-domain authority, and focused mutation tests. | No content, schema, skill-link, runtime, persistence, generated-output, snippet, trial, UI, or gameplay changes. |
| `0.5.114` | Skill Knowledge Domain Reference Realignment Plan | Codex Local docs-first | Planning | Completed. Audited all current links, selected the Arcane Lore metadata link, deferred Folk and Civic Lore, and scoped the focused test-fixture correction. | Documentation only; no skill, registry, schema, validator, runtime, persistence, snippet, UI, or gameplay changes. |
| `0.5.115` | Skill Knowledge Domain Reference Realignment | Codex Local | Narrow skill metadata + focused test fixture | Completed. Added the Arcane Lore broad-domain reference and made the optional-reference test data-independent. | One skill field and one fixture-only test adjustment; no registry, legacy policy, schema, validator behavior, runtime, persistence, snippet, UI, or gameplay changes. |
| `0.5.116` | Knowledge Snippet Content Authoring Plan | Codex Local docs-first | Planning | Completed. Defined the exact four-record Tier 1 seed, content wrapper, schema-readiness requirements, semantic checks, and later sequence. | Documentation only; no snippet JSON, schema, validator, runtime loading, evidence, progress, completion, trials, UI, events, persistence, or ownership changes. |
| `0.5.117` | Knowledge Snippet Schema Hardening | Codex Local | Schema hardening + focused schema test | Completed. Hardened the authored record contract and registered it in the focused schema-file test. | No snippet JSON, semantic validator, registry, skill, runtime, UI, generated-output, persistence, ownership, or gameplay changes. |
| `0.5.118` | Knowledge Snippet Seed Data | Codex Local | Four-record content JSON | Completed. Added the exact planned Tier 1 Aloe, Badger, Iron Ore, and Kaelvar records under the hardened schema. | No semantic validator, schema, registry, skill, runtime, UI, generated-output, persistence, ownership, or gameplay changes. |
| `0.5.119` | Knowledge Snippet Semantic Validator Plan | Codex Local docs-first | Planning | Next. Define schema-first wrapper, compatibility, reference, prerequisite, and source validation before implementation. | Documentation only; no validator code, content/schema changes, runtime loading, state, UI, persistence, ownership, or gameplay changes. |

## 4. Remaining Magic Runtime Path

The magic runtime path must not jump directly from known-spell projection into active spell casting. The remaining sequence should keep each prerequisite narrow, testable, and owner-aware.

| Order | Step | Purpose | Boundary |
| ---: | --- | --- | --- |
| 1 | Runtime readiness blocker tests | Executable guardrails proving runtime magic remains blocked without explicit known-spell ownership, validated acquisition evidence, conduit policy, catalyst policy, control/failure policy, and blocked-hook policy. | Landed as test/scaffold only; no runtime casting. |
| 2 | Magic runtime boundary plan | Define what counts as a valid conduit, how catalyst presence is checked without consumption, how control/failure remains a pure gate, how unsupported/deferred/unknown hooks block readiness. | Landed as planning-only; no runtime casting. |
| 3 | Runtime cast-readiness helper | Add a pure helper that returns deterministic cast-readiness blockers. | Landed as pure helper only; no effect application. |
| 4 | Acquisition event planning | Define training-event acquisition ownership and evidence boundaries before any mutation. | Landed as planning-only; no broader routes. |
| 5 | Training-event acquisition helpers | Validate explicit training-event acquisition input and return proposed character-scoped known-spell records. | Landed as pure helper only; no persisted acquisition events or save/session mutation. |
| 6 | Active casting command contract | Define the command/intention shape for selected spell, caster, target, conduit source, catalyst source, and casting context. | Landed as contract-only; no resolver behavior. |
| 7 | Runtime cast resolver readiness boundary | First narrow resolver-readiness planning: known-spell check, readiness check, command shape, policy blockers, hook compatibility, and inert planned output envelopes. | Landed as planning-only in `docs/design/first-narrow-runtime-cast-resolver-plan.md`; no UI-authored ownership. |
| 8 | Runtime cast resolver readiness helper | Pure engine helper that consumes explicit command-like input, calls `buildMagicCastReadiness(...)`, and returns deterministic resolver issues. | Landed as pure helper only; no effect application, command handlers, UI dispatch, save mutation, resource payment, catalyst consumption/reservation, inventory mutation, target resolution, or event creation. |
| 9 | Planned output envelope policy | Define inert resolver output-envelope shape and policy before any emitted event behavior. | Landed as planning-only in `docs/design/magic-resolver-planned-output-envelope-plan.md`; no emitted events or runtime dispatch. |
| 10 | Planned output envelope helper | Return inert planned-output envelope projections from explicit inputs and readiness results. | Landed as pure helper only; no emitted events, effects, target resolution, resource payment, catalyst behavior, mutation, UI, or generated output. |
| 11 | Spell hook support expansion | Explicitly define supported, classifier-only, deferred, unsupported, and unknown hook behavior before broad casting. | Landed as planning-only in `docs/design/spell-hook-support-expansion-plan.md`; no hook became executable. |
| 12 | Spell hook classification audit | Reconcile canonical spell lint, combat support, engine readiness classes, UI copies, and authored content. | Landed in Version 0.5.104 and consumed after projection; durable taxonomy remains in `docs/design/spell-hook-support-expansion-plan.md`. |
| 13 | Hook support constants cleanup | Establish one browser-safe source for the current four authored classes and exact parity/subset tests. | Landed in Version 0.5.105; classifications and behavior remain unchanged. |
| 14 | Pure hook support projection | Return deterministic six-class hook projections and blockers from explicit inputs. | Landed in Version 0.5.106 as a pure non-executable helper. |
| 15 | First executable hook owner plan | Select one narrow hook family only after target, effect, mutation, event, and persistence owners are explicit. | Do not default to damage merely because combat recognizes the hook id. |
| 16 | UI command/readiness surface | Later read-only or disabled-command presentation for known spells, cast-ready state, and blocked reasons. | UI must consume engine/runtime state and must not author ownership. |
| 17 | Save/runtime state integration | Persist known spell records, acquisition evidence, training events, catalyst inventory changes, cooldowns, backlash, cast history, and Chronicle hooks when shapes are stable. | No old-save compatibility unless explicitly requested. |
| 18 | Expanded acquisition routes | Add teacher, quest/event reward, scroll/tome study, institution licensing, document-owned study access, Magic Legacy lanes, and family tradition only after explicit evidence and ownership rules exist. | Keep blocked until each route has evidence and validation. |

Practical near-term sequence:

1. `0.5.112 - Knowledge Domain Registry Semantic Validator Plan` - completed
2. `0.5.113 - Knowledge Domain Registry Semantic Validator` - completed
3. `0.5.114 - Skill Knowledge Domain Reference Realignment Plan` - completed
4. `0.5.115 - Skill Knowledge Domain Reference Realignment` - completed
5. `0.5.116 - Knowledge Snippet Content Authoring Plan` - completed
6. `0.5.117 - Knowledge Snippet Schema Hardening` - completed
7. `0.5.118 - Knowledge Snippet Seed Data` - completed
8. `0.5.119 - Knowledge Snippet Semantic Validator Plan`

## 5. Advancement Framework Roadmap

The advancement framework should preserve the current skill infrastructure while expanding the game loop through three distinct but related lanes.

| Lane | Source | Timing | Purpose | Boundary |
| --- | --- | --- | --- | --- |
| Skill Mastery Trials | `docs/design/skill-mastery-trial-framework-plan.md` | `0.5.x` planning, `0.6.x` runtime scaffolding | Preserve current 125-rank, five-band skill structure while adding narrative checkpoint trials at breakthrough gates. | Do not replace current bands, titles, hard caps, or breakthrough gates. |
| Magic Study Events | `docs/design/skill-mastery-trial-framework-plan.md` | `0.5.x` planning after magic resolver guardrails, `0.6.x` runtime scaffolding | Add Torn OC/Racing-style spell learning through self-study, paid teachers, institutions, scrolls, tomes, grimoires, and supervised rituals. | Study/access does not grant spell ownership without validated acquisition evidence. |
| Knowledge Discovery And Comprehension | `packages/schemas/player/knowledge_snippet.schema.json`; `docs/future_content_backlog.md` | `0.5.x` schema/planning, `0.6.x` pure helpers, `0.7.x` broad content expansion | Add snippet-based knowledge progression with 0-100% tier completion, travel/book/teacher/institution discovery, and later knowledge trials. | Knowledge remains distinct from skills and magic; discovery/access does not auto-complete snippets. |

Recommended advancement sequence:

1. `0.5.107 - Knowledge Domain Registry Plan` - landed
2. `0.5.108 - Knowledge Domain Registry Schema Plan` - landed
3. `0.5.109 - Knowledge Domain Registry Seed Data Plan` - landed
4. `0.5.110 - Knowledge Domain Registry Schema File` - landed
5. `0.5.111 - Knowledge Domain Registry Seed Data` - landed
6. `0.5.112 - Knowledge Domain Registry Semantic Validator Plan` - completed
7. `0.5.113 - Knowledge Domain Registry Semantic Validator` - completed
8. `0.5.114 - Skill Knowledge Domain Reference Realignment Plan` - completed
9. `0.5.115 - Skill Knowledge Domain Reference Realignment` - completed
10. `0.5.116 - Knowledge Snippet Content Authoring Plan` - completed
11. `0.5.117 - Knowledge Snippet Schema Hardening` - completed
12. `0.5.118 - Knowledge Snippet Seed Data` - completed
13. `0.5.119 - Knowledge Snippet Semantic Validator Plan`
14. `0.5.120 - Knowledge Snippet Semantic Validator`
15. `0.5.x - Knowledge Evidence Contract Plan`
16. `0.5.x - Knowledge Progress State Plan`
17. `0.5.x - Knowledge Completion Helper Plan`
18. `0.5.x - Knowledge Trial Plan`
19. `0.5.x - Knowledge UI Plan`
20. `0.5.x - Skill Trial Schema Expansion Plan`
21. `0.5.x - Pure Checkpoint Outcome Helper`
22. `0.5.x - Trial Attempt Cooldown Readiness Helper`
18. `0.5.x - Magic Study Event Plan`
19. `0.5.x - Magic Teaching Source Plan`
20. `0.6.x - First Advancement Event Runtime Shape`
21. `0.6.x - First Knowledge Completion Helper`
22. `0.6.x - First Skill Trial Family Content`
23. `0.6.x - First Magic Study Event Family Content`
24. `0.6.x - First Knowledge Trial Family Content`
25. `0.7.x - Chronicle/Renown Hooks For Trials, Study, And Knowledge`

## 6. Knowledge Domain Timing

Snippet-based knowledge should be introduced in staged waves so content scope stays manageable.

### Wave 0 - Existing domains to formalize

These already exist or are strongly implied by current skills/content and should be formalized first:

- `knowledge_domain.flora`
- `knowledge_domain.fauna`
- `knowledge_domain.minerals`
- `knowledge_domain.arcane_lore`
- `knowledge_domain.general_lore`

### Wave 1 - 0.5.x foundation domains

These domains should be planned before runtime knowledge helpers because they support existing world, resource, and magic systems:

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

### Wave 2 - 0.6.x runtime-readiness domains

These domains should be added when travel, study, teachers, institutions, and first advancement events begin consuming knowledge:

- `knowledge_domain.regional_geography`
- `knowledge_domain.routes_and_passes`
- `knowledge_domain.locality_lore`
- `knowledge_domain.biomes`
- `knowledge_domain.habitats`
- `knowledge_domain.climate`
- `knowledge_domain.seasonal_patterns`
- `knowledge_domain.guilds`
- `knowledge_domain.orders`
- `knowledge_domain.temples`
- `knowledge_domain.academies`
- `knowledge_domain.markets`
- `knowledge_domain.local_economy`
- `knowledge_domain.caravan_routes`
- `knowledge_domain.crafting_materials`
- `knowledge_domain.anatomy`
- `knowledge_domain.herbalism`
- `knowledge_domain.toxicology`
- `knowledge_domain.spellcraft`
- `knowledge_domain.rituals`
- `knowledge_domain.wards`
- `knowledge_domain.religion`
- `knowledge_domain.doctrine`
- `knowledge_domain.myth`
- `knowledge_domain.weapon_lore`
- `knowledge_domain.armor_lore`

### Wave 3 - 0.7.x expansion domains

These domains are useful, but should wait until core domain mechanics and first content loops are stable:

- `knowledge_domain.ocean_lanes`
- `knowledge_domain.beast_lore`
- `knowledge_domain.undead_lore`
- `knowledge_domain.aberration_lore`
- `knowledge_domain.draconic_lore`
- `knowledge_domain.customs`
- `knowledge_domain.law`
- `knowledge_domain.nobility`
- `knowledge_domain.local_politics`
- `knowledge_domain.heraldry`
- `knowledge_domain.underworld`
- `knowledge_domain.smithing_materials`
- `knowledge_domain.alchemy_reagents`
- `knowledge_domain.textiles`
- `knowledge_domain.woodworking_materials`
- `knowledge_domain.leatherworking_materials`
- `knowledge_domain.disease`
- `knowledge_domain.field_surgery`
- `knowledge_domain.elemental_lore`
- `knowledge_domain.divine_lore`
- `knowledge_domain.dark_lore`
- `knowledge_domain.druidic_lore`
- `knowledge_domain.saints_and_relics`
- `knowledge_domain.cults`
- `knowledge_domain.archaeology`
- `knowledge_domain.ancient_languages`
- `knowledge_domain.genealogy`
- `knowledge_domain.bloodline_lore`
- `knowledge_domain.relic_lore`
- `knowledge_domain.siegecraft`
- `knowledge_domain.military_orders`

Timing guardrails:

- Do not wire knowledge snippets into runtime content loading until the broad registry schema, seed content, and semantic validation exist.
- Do not let book, teacher, institution, scroll, tome, Chronicle, travel, or quest sources automatically grant knowledge without dedicated discovery/progression helpers.
- Keep knowledge distinct from skills and known spells: knowledge is discovered understanding, skills are action capability, and magic study can later produce acquisition evidence.
- Do not entangle knowledge snippet runtime behavior with magic resolver planned output envelopes.

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
| 11 | `0.5.102` | Magic Resolver Inert Envelope Helper | `docs/design/magic-resolver-planned-output-envelope-plan.md` | Landed |
| 12 | `0.5.103` | Spell Hook Support Expansion Plan | `docs/design/spell-hook-support-expansion-plan.md` | Landed |
| 13 | `0.5.104` | Spell Hook Classification Audit | `docs/design/spell-hook-support-expansion-plan.md` | Landed; temporary audit later consumed |
| 14 | `0.5.105` | Spell Hook Support Constants Cleanup | `packages/shared/types/src/spell-hook-support.ts` | Landed |
| 15 | `0.5.106` | Pure Hook Support Projection Helper | `packages/engines/game-engine/src/known-spells.ts` | Landed |
| 16 | `0.5.107` | Knowledge Domain Registry Plan | `docs/design/knowledge-domain-registry-plan.md` | Landed |
| 17 | `0.5.108` | Knowledge Domain Registry Schema Plan | `docs/design/knowledge-domain-registry-schema-plan.md` | Landed |
| 18 | `0.5.109` | Knowledge Domain Registry Seed Data Plan | `docs/design/knowledge-domain-registry-seed-data-plan.md` | Landed |
| 19 | `0.5.110` | Knowledge Domain Registry Schema File | `packages/schemas/player/knowledge-domain-registry.schema.json` | Landed |
| 20 | `0.5.111` | Knowledge Domain Registry Seed Data | `packages/content/base/player/knowledge_domain_registry.json` | Landed |
| 21 | `0.5.112` | Knowledge Domain Registry Semantic Validator Plan | `docs/design/knowledge-domain-registry-semantic-validator-plan.md` | Completed |
| 22 | `0.5.113` | Knowledge Domain Registry Semantic Validator | `tools/content-lint/knowledge-domain-registry.mjs` | Completed |
| 23 | `0.5.114` | Skill Knowledge Domain Reference Realignment Plan | `docs/design/skill-knowledge-domain-reference-realignment-plan.md` | Completed |
| 24 | `0.5.115` | Skill Knowledge Domain Reference Realignment | `docs/design/skill-knowledge-domain-reference-realignment-plan.md` | Completed |
| 25 | `0.5.116` | Knowledge Snippet Content Authoring Plan | `docs/design/knowledge-snippet-content-authoring-plan.md` | Completed |
| 26 | `0.5.117` | Knowledge Snippet Schema Hardening | `packages/schemas/player/knowledge_snippet.schema.json` | Completed |
| 27 | `0.5.118` | Knowledge Snippet Seed Data | `packages/content/base/player/knowledge_snippets.json` | Completed |
| 28 | `0.5.119` | Knowledge Snippet Semantic Validator Plan | `docs/design/knowledge-snippet-content-authoring-plan.md` | Next |

## 8. Lightweight GPT + GitHub Connector Audit / Planning Queue

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
| Known Spell Acquisition Event Plan | `docs/design/known-spell-acquisition-event-plan.md`; retained for training-event acquisition helper constraints and later acquisition mutation planning. |
| Magic Command Contract Plan | `docs/design/magic-command-contract-plan.md`; retained for future active magic command/intention constraints. |
| First Narrow Runtime Cast Resolver Plan | `docs/design/first-narrow-runtime-cast-resolver-plan.md`; consumed by `0.5.100` and `0.5.101`, retain for later resolver constraints. |
| Magic Resolver Planned Output Envelope Plan | `docs/design/magic-resolver-planned-output-envelope-plan.md`; consumed by `0.5.102`, retain for inert envelope and later resolver-output constraints. |
| Legacy Combat Spell Runtime Ownership Plan | `docs/design/legacy-combat-spell-runtime-ownership-plan.md`; owns only deferred legacy staging, compatibility, multi-effect, and status-approximation decisions after the temporary classification audit was consumed. |
| Skill Mastery Trial Framework Plan | `docs/design/skill-mastery-trial-framework-plan.md`; use for skill trials, magic study events, and advancement event planning. |
| Knowledge Snippet Schema | `packages/schemas/player/knowledge_snippet.schema.json`; use as the authored record structural contract, but do not treat it as runtime-wired content or semantic validation. |
| Bloodlines Information Architecture Audit | Partially consumed by `0.5.71` and `0.5.72`; keep for richer tree and future Bloodlines presentation constraints. |
| Heirloom vs Bequest Vocabulary Audit | Consumed by `docs/design/heirloom-and-bequest-systems-plan.md` and the design ledger; retained only as compact checklist until inheritance-runtime readiness cleanup. |
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
