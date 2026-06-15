# Lineage: Reforged - Long-Term Project Roadmap

Last reviewed: 2026-06-15

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

- Latest completed version: `Version 0.5.157 - Knowledge Trial Registry Reference Alignment Plan`
- Next recommended version: `Version 0.5.158 - Knowledge Trial Registry Reference Alignment`
- Current near-term sequence source: `docs/dev/codex-sequenced-implementation-plan.md`
- Current phase: `v0.5.x` foundation stabilization / ownership hardening

Versioning rule:

- Patch numbers may exceed two digits inside the current band.
- Do not roll from `0.5.157` to `0.6.0` unless the actual `0.6.x` runtime ownership milestone has been reached.

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
- Normal content lint now checks `knowledge_trial_policies.json` and invokes the unchanged pure Knowledge trial policy validator against explicit policy-schema, domain-registry, and snippet inputs. The normal checked-file count is 56.
- Knowledge trial registry-reference alignment planning has landed in `docs/design/knowledge-trial-registry-reference-alignment-plan.md`. It selects the exact Flora-to-Flora-Tier-1 reference, keeps policy scope/tier authoritative, assigns cross-file coherence to the policy validator, and blocks multiple active tier policies per domain until the registry shape expands.
- The current `knowledge_domains.json` and `KnowledgeDomainRecord` remain the narrow legacy resource-identification shape. Four policy records exist today; `knowledge_domain.arcane_lore` exists only in the broad registry and is now linked from the Arcane Lore skill as metadata only.
- Skill-domain reference realignment planning has landed in `docs/design/skill-knowledge-domain-reference-realignment-plan.md`. It confirms all ten current references, selects the Arcane Lore broad-registry link for `0.5.115`, defers Folk Lore and Civic Lore until specific broad domains exist, and identifies the focused validator-test fixture assumption that must be updated without changing validator behavior.
- Skill-domain reference realignment has landed. `skill.knowledge.arcane_lore` now references `knowledge_domain.arcane_lore`, and the positive validator test now proves optional skill references through a cloned fixture rather than depending on Arcane Lore remaining unlinked.
- Knowledge snippet content authoring planning has landed in `docs/design/knowledge-snippet-content-authoring-plan.md`. It selects four Tier 1 records across the active Flora, Fauna, Minerals, and General Lore domains, excludes planned Arcane Lore, defines the future content wrapper, and requires schema hardening before seed data.
- The authored knowledge snippet record schema is hardened and registered in the focused schema-file test. It requires explicit authored text, progression, visibility, notes, canonical identifier patterns, and exact-duplicate protections while defining no runtime/player state.
- The first authored knowledge snippet catalog exists at `packages/content/base/player/knowledge_snippets.json` with the exact four approved Tier 1 Aloe, Badger, Iron Ore, and Kaelvar records. It remains content-only and is not runtime-loaded.
- Knowledge snippet semantic validator planning has landed in `docs/design/knowledge-snippet-semantic-validator-plan.md`. It assigns content-lint ownership, defines the snippet-scoped schema-first gate, initial authority maps, semantic and prerequisite graph rules, focused tests, and acceptance criteria before implementation.
- Knowledge snippet structural and semantic validation has landed in `tools/content-lint/knowledge-snippets.mjs` with focused tests and normal lint integration. The current catalog is now included in the 55-file content-lint count without runtime loading or state behavior.
- Knowledge evidence contract planning has landed in `docs/design/knowledge-evidence-contract-plan.md`. It defines evidence identity, character-first beneficiary ownership, source/context separation, snippet-reference rules, validation layers, and the schema-to-progress sequence without implementing evidence state.
- Knowledge evidence schema planning has landed in `docs/design/knowledge-evidence-schema-plan.md`. It selects the future strict record schema, required fields and patterns, character-only owner enum, nullable source reference, closed acquisition-context structure, focused schema-file test posture, and later semantic-validation boundary without implementing evidence state.
- The strict record-level knowledge evidence schema now exists at `packages/schemas/player/knowledge_evidence.schema.json` and is registered in the focused schema-file test. It defines structure only; no evidence collection, state, semantic validation, runtime loading, persistence, progress, completion, trials, UI, or ownership behavior exists.
- Knowledge evidence semantic-validator planning has landed in `docs/design/knowledge-evidence-semantic-validator-plan.md`. It selects a test-fixture-only pure helper as the first implementation, defines schema-first wrapper validation, active snippet/domain checks, character/pattern-only ownership, null-only source ids, narrow region/settlement context authorities, source/context compatibility, and duplicate identity without evidence state or behavior.
- Pure knowledge evidence semantic validation now exists at `tools/content-lint/knowledge-evidence.mjs` with 76 focused in-memory tests. It validates wrapper and record structure before semantics, rejects duplicate identities and authority ids, enforces active snippet/domain and source/context relationships, keeps source ids and unresolved context references blocked, and uses region/settlement data only as context authorities without normal content-lint registration or evidence state.
- Knowledge progress-state planning has landed in `docs/design/knowledge-progress-state-plan.md`. It defines character-owned state for one authored snippet, finite non-negative integer progress points, consumed-evidence references, deterministic update sequence, strict schema and semantic-validation boundaries, deferred source audit detail, and the schema-to-UI implementation sequence without implementing state or behavior.
- Knowledge progress schema planning has landed in `docs/design/knowledge-progress-schema-plan.md`. It selects the strict record-level schema path, all 11 required fields, exact patterns and enums, structurally empty consumed-evidence arrays, required notes, forbidden fields, focused schema registration, and `0.5.128` acceptance criteria without implementation.
- The strict record-level knowledge progress schema now exists at `packages/schemas/player/knowledge_progress.schema.json` and is registered in the focused schema-file test. It defines structure only; no progress collection/state, semantic validation, evidence credit, runtime loading, persistence, completion, trials, UI, or ownership behavior exists.
- Knowledge progress semantic-validator planning has landed in `docs/design/knowledge-progress-semantic-validator-plan.md`. It selects a test-fixture-only pure helper, exact wrapper and schema-first gates, snippet/domain/evidence authorities, owner and target parity, duplicate progress and cross-record evidence-consumption rules, explicit zero-state posture, focused tests, and `0.5.130` acceptance criteria without implementation.
- Pure knowledge progress semantic validation now exists at `tools/content-lint/knowledge-progress.mjs` with 59 focused in-memory tests. It validates exact wrapper and progress structure before semantics, delegates supplied evidence to the current evidence validator, rejects duplicate progress identities and cross-record evidence consumption, enforces active snippet/domain plus owner/target parity, and applies explicit zero-state consistency without normal content-lint registration, progress state, or calculation behavior.
- Knowledge evidence-to-progress rules planning has landed in `docs/design/knowledge-evidence-to-progress-rules-plan.md`. It selects a future pure in-memory helper, exact character owner and target parity, one positive integer point per eligible evidence id, duplicate and already-consumed blocking, deterministic ordering and sequence proposals, no automatic progress-record creation, and an inert no-mutation/no-persistence envelope.
- Pure knowledge evidence-to-progress proposals now exist at `tools/content-lint/knowledge-evidence-to-progress.mjs` with 36 focused in-memory tests. The helper gates inputs through current evidence/progress validators, requires one existing target, proposes exactly `+1` per eligible sorted evidence id, blocks duplicate and consumed ids, derives sequence only from explicit values, and returns an inert no-mutation/no-persistence envelope without normal content-lint registration or state behavior.
- Pure Knowledge observation evidence candidate proposals now exist at `tools/content-lint/knowledge-evidence-producers.mjs` with 29 focused in-memory tests. The helper derives current snippet snapshots, supports narrow field-identification and Kaelvar travel-observation candidates, constructs deterministic ids from explicit occurrence identity, validates through the current evidence helper, and remains unregistered and candidate-only without storage, persistence, progress invocation, runtime, UI, completion, trials, or gameplay behavior.
- Knowledge storage and persistence boundary planning has landed in `docs/design/knowledge-storage-persistence-boundary-plan.md`. It distinguishes candidate, accepted, rejected, and persisted evidence plus proposed and applied progress; keeps canonical storage ownership deferred; defines conceptual collection, acceptance, duplicate/replay, occurrence, sequence, owner, initialization, and atomicity responsibilities; and selects a docs-only fixture-boundary plan next without implementing storage or state.
- Knowledge storage fixture boundary planning has landed in `docs/design/knowledge-storage-fixture-boundary-plan.md`. It recommends a planned-only `tests/fixtures/knowledge/` family, defines test-only evidence/progress wrappers and combined scenario posture, keeps fixture metadata outside current exact validator inputs, isolates fixtures from authored content and normal lint, preserves separate Knowledge/Skill/Magic trial lanes, and selects a docs-only progress-record initialization plan next without creating fixtures or state.
- Knowledge progress-record initialization planning has landed in `docs/design/knowledge-progress-record-initialization-plan.md`. It selects lazy explicit zero-state initialization, freezes deterministic schema-compatible owner/snippet identity construction, requires active authored target authority plus explicit character owner, sequence, notes, and duplicate rejection, defers first-evidence consumption, and selects a pure focused initializer next without creating state or storage.
- Pure Knowledge progress-record initialization now exists at `tools/content-lint/knowledge-progress-initialization.mjs` with 26 focused tests. It proposes explicit zero-state records for active authored snippets, derives deterministic length-prefixed identities, rejects invalid owners, targets, domains, current-state duplicates, unsupported modes, and ambient-state shortcuts, and remains unregistered and in-memory without evidence creation or consumption, state, storage, persistence, progress application, completion, trials, UI, runtime, generated output, or gameplay behavior.
- Knowledge evidence acceptance helper planning has landed in `docs/design/knowledge-evidence-acceptance-helper-plan.md`. It selects a pure one-candidate decision, requires an explicit current accepted wrapper, retains the current evidence validator as the gate, rejects every existing `evidenceId`, returns a copied accepted record in an inert envelope, and defers storage-level idempotency, persistence, progress behavior, completion, trials, UI, runtime, and gameplay.
- Pure Knowledge evidence acceptance now exists at `tools/content-lint/knowledge-evidence-acceptance.mjs` with 27 focused tests. It validates one candidate and an explicit current accepted wrapper through the unchanged evidence validator, rejects every existing exact `evidenceId`, returns a deep copied accepted record in an inert decision envelope, and remains unregistered and in-memory without fixtures, state, storage, persistence, progress behavior, completion, trials, UI, runtime, generated output, or gameplay behavior.
- Knowledge progress application planning has landed in `docs/design/knowledge-progress-application-plan.md`. It defines explicit accepted-evidence and current-progress inputs, strict proposal verification, target parity, deterministic consumption, monotonic sequence, replacement-wrapper validation, and an inert application envelope.
- Pure Knowledge progress application now exists at `tools/content-lint/knowledge-progress-application.mjs` with 43 focused tests. It returns a validated applied progress record as in-memory output only and adds no storage, persistence, completion, trials, UI, runtime, or gameplay behavior.
- Knowledge completion-rule planning has landed in `docs/design/knowledge-completion-rules-plan.md`. It defines applied progress as input only, requires explicit authored/planned thresholds, treats `completionWeight` as aggregation weight rather than a snippet threshold, isolates owner/domain/tier aggregation, and specifies a fail-closed read-only decision envelope for a later helper.
- Pure Knowledge completion decisions now exist at `tools/content-lint/knowledge-completion.mjs` with 64 focused in-memory tests. The helper validates explicit applied progress through the unchanged current validator, requires exact in-memory completion-policy authority, evaluates isolated snippet/tier/domain targets, returns inert `candidate`, `incomplete`, or `blocked` envelopes, blocks planned Arcane Lore, and remains unregistered without state, persistence, trials, UI, runtime, events, rewards, ownership mutation, or gameplay behavior.
- Knowledge trial boundary planning has landed in `docs/design/knowledge-trial-boundary-plan.md`. It separates completion candidates, eligibility candidates, readiness candidates, attempts, checkpoints, outcomes, cooldowns, and rewards; requires explicit completion envelopes and separate trial policy; keeps owner/domain/tier isolation; and remains the source boundary for later readiness planning without trial behavior.
- Pure Knowledge trial eligibility decisions now exist at `tools/content-lint/knowledge-trial-eligibility.mjs` with 70 focused inline tests. The helper consumes exact current completion envelopes and exact implementation-local policy, returns only `eligible_candidate`, `not_eligible`, or `blocked`, isolates owner/domain/tier/snippet requirements, keeps reward references inert and readiness/attempt/cooldown status not evaluated, blocks Arcane Lore, and remains unregistered without state, storage, persistence, UI, runtime, events, rewards, ownership mutation, or gameplay behavior.
- Knowledge trial readiness boundary planning has landed in `docs/design/knowledge-trial-readiness-boundary-plan.md`. It requires exact eligibility-envelope validation plus explicit readiness policy, attempt/history/limit, cooldown, availability, prerequisite, and sequence/time authorities; defines `ready_candidate`, `not_ready`, and `blocked`; and keeps attempts, checkpoints, outcomes, cooldown mutation, rewards, storage, persistence, UI, runtime, events, and gameplay behavior outside readiness.
- Pure Knowledge trial readiness evaluation now exists at `tools/content-lint/knowledge-trial-readiness.mjs` with 83 focused in-memory tests. It consumes one exact eligibility envelope plus explicit operation-local readiness policy and authority inputs, returns deterministic `ready_candidate`, `not_ready`, or `blocked` decisions, preserves exact owner/domain/tier isolation, keeps rewards inert, fails closed on Arcane Lore and unsupported prerequisites, and remains unregistered without state or downstream trial behavior.
- Knowledge trial schema planning has landed in `docs/design/knowledge-trial-schema-plan.md`. It separates static authored eligibility/readiness policy from mutable owner-specific authority, selects an eligibility-policy-only record schema for `0.5.150`, omits concrete owner ids and operation-envelope fields from authored policy, rejects the existing cross-family `trials.json` as Knowledge policy authority, and defers readiness schema until attempt lifecycle vocabulary is canonical.
- The strict static Knowledge trial eligibility-policy record schema now exists at `packages/schemas/player/knowledge_trial_policy.schema.json` with focused schema-file contract coverage. It defines domain/tier policy targets, exact snippet/tier/domain completion requirements, nullable inert readiness references, inert reward references, and no concrete owner id or mutable/operation authority.
- Knowledge trial policy content planning has landed in `docs/design/knowledge-trial-policy-content-plan.md`. It selects a future `knowledge_trial_policies.json` records wrapper and exactly one first active policy, `knowledge_trial_policy.flora_tier_1`, requiring a Flora Tier 1 completion candidate while keeping readiness null, rewards empty, registry references null, and Arcane Lore absent.
- Knowledge trial policy normal-lint registration planning has landed in `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md`. It selects one-step index registration, exact explicit policy/schema/registry/snippet loading, policy content as one new checked file, a 55-to-56 count change, current top-level failure propagation, focused test updates, and unchanged validator/content authorities.
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
| `0.5.119` | Knowledge Snippet Semantic Validator Plan | Codex Local docs-first | Planning | Completed. Defined schema-first wrapper, compatibility, authority, prerequisite, source, focused-test, and acceptance contracts before implementation. | Documentation only; no validator code, tests, content/schema changes, runtime loading, state, UI, persistence, ownership, or gameplay changes. |
| `0.5.120` | Knowledge Snippet Semantic Validator | Codex Local | Focused content-lint validator + tests | Completed. Added fail-closed structural gating, semantic authority/reference checks, prerequisite graph validation, focused tests, and normal lint registration. | No snippet content, schema, registry, skill, runtime, persistence, generated-output, UI, ownership, or gameplay changes. |
| `0.5.121` | Knowledge Evidence Contract Plan | Codex Local docs-first | Planning | Completed. Defined evidence identity, beneficiary ownership, source/context separation, snippet relationships, validation layers, examples, and future sequence. | Documentation only; no schema, evidence storage, runtime loading, progress, completion, trials, UI, events, persistence, ownership mutation, or gameplay changes. |
| `0.5.122` | Knowledge Evidence Schema Plan | Codex Local docs-first | Planning | Completed. Selected the exact record-level schema path, required fields, identifier patterns, enums, strict context structure, schema-file test plan, and semantic-validation boundary. | Documentation only; no schema file, evidence content/state, runtime, progress, completion, trials, UI, persistence, or gameplay changes. |
| `0.5.123` | Knowledge Evidence Schema | Codex Local | Schema file + focused schema tests | Completed. Added the strict record schema and focused schema-file registration with exact field, enum, identifier, context, and deferred-field boundaries. | No evidence content/state, runtime loading, semantic validator, progress, completion, trials, UI, persistence, or gameplay changes. |
| `0.5.124` | Knowledge Evidence Semantic Validator Plan | Codex Local docs-first | Planning | Completed. Defined the schema-first wrapper gate, pure-helper ownership, authority posture, source/context matrix, duplicate identity checks, focused tests, and acceptance criteria. | Documentation only; no validator, evidence content/state, runtime, progress, completion, trials, UI, persistence, or gameplay changes. |
| `0.5.125` | Knowledge Evidence Semantic Validator | Codex Local | Focused validator + tests | Completed. Added the schema-first pure helper and 76 focused in-memory tests without selecting canonical evidence content or normal lint registration. | No evidence content/state, progress credit, runtime producers, persistence, trials, UI, ownership mutation, or gameplay behavior. |
| `0.5.126` | Knowledge Progress State Plan | Codex Local docs-first | Planning | Completed. Defined character-owned progress identity, integer-value posture, consumed-evidence boundaries, deferred source audit detail, schema ownership, semantic-validation responsibilities, examples, and later sequence. | Documentation only; no progress state/schema, completion math, evidence consumption, persistence, runtime producers, trials, UI, or gameplay behavior. |
| `0.5.127` | Knowledge Progress Schema Plan | Codex Local docs-first | Planning | Completed. Froze the first strict record-level schema contract, exact fields, identifier patterns, enums, empty consumed-evidence posture, notes posture, forbidden fields, and schema-test expectations. | Documentation only; no progress schema/state/validator, evidence state, runtime, persistence, completion, trials, UI, or gameplay behavior. |
| `0.5.128` | Knowledge Progress Schema | Codex Local | Schema + focused schema test | Completed. Added the strict record schema and focused schema-file registration with exact field, pattern, enum, array, notes, and deferred-field boundaries. | No progress/evidence state, semantic validator, credit rules, runtime, persistence, completion, trials, UI, or gameplay behavior. |
| `0.5.129` | Knowledge Progress Semantic Validator Plan | Codex Local docs-first | Planning | Completed. Defined the schema-first pure-helper boundary, exact wrapper gate, authorities, owner and target parity, duplicate and zero-state policies, focused tests, and acceptance criteria. | Documentation only; no validator, tests, progress/evidence state, credit rules, runtime, persistence, completion, trials, UI, or gameplay behavior. |
| `0.5.130` | Knowledge Progress Semantic Validator | Codex Local | Focused validator + tests | Completed. Added the pure schema-first helper and 59 focused in-memory tests without selecting canonical progress storage or normal lint registration. | No progress/evidence content or state, schema changes, credit rules, runtime, persistence, completion, trials, UI, generated output, or gameplay behavior. |
| `0.5.131` | Knowledge Evidence-to-Progress Rules Plan | Codex Local docs-first | Planning | Completed. Defined the pure-helper boundary, exact eligibility, `+1` integer deltas, duplicate-credit posture, deferred occurrence equivalence, deterministic ordering, inert proposal envelope, focused tests, and `0.5.132` acceptance criteria. | Documentation only; no helper, tests, state, mutation, producers, persistence, completion, trials, UI, generated output, or gameplay behavior. |
| `0.5.132` | Knowledge Evidence-to-Progress Rules | Codex Local | Pure helper + focused tests | Completed. Added the pure proposal helper and 36 focused in-memory tests for validation gates, eligibility, `+1` deltas, duplicate consumption, deterministic ordering/sequence, inert safety flags, and immutability. | No state creation, mutation, persistence, normal lint registration, producers, completion, trials, UI, generated output, or gameplay behavior. |
| `0.5.133` | Knowledge Evidence Producers Plan | Codex Local docs-first | Planning | Completed. Defined the candidate-only producer boundary, exact evidence output, deterministic identity and explicit sequence rules, category ownership, focused tests, and `0.5.134` acceptance criteria. | Documentation only; no producer, state mutation, persistence, events, completion, trials, UI, generated output, or gameplay behavior. |
| `0.5.134` | Knowledge Observation Evidence Producer | Codex Local | Pure helper + focused tests | Completed. Added a deterministic candidate-only helper and 29 focused tests for current Aloe, Badger, Iron Ore, and validator-supported Kaelvar observation contexts. | No persistence, runtime wiring, lint registration, progress invocation or mutation, completion, trials, UI, source expansion, or schema/validator changes. |
| `0.5.135` | Knowledge Storage And Persistence Boundary Plan | Codex Local docs-first | Planning | Completed. Defined candidate/accepted/persisted boundaries, future collection and acceptance responsibilities, duplicate/replay and occurrence identity posture, sequence/owner requirements, and atomicity recommendations while deferring canonical storage ownership. | Documentation only; no storage, fixtures, persistence, schema, migration, runtime, mutation, completion, trials, UI, or gameplay behavior. |
| `0.5.136` | Knowledge Storage Fixture Boundary Plan | Codex Local docs-first | Planning | Completed. Defined the planned-only fixture path family, test-only evidence/progress wrappers, combined scenarios, authority isolation, positive/negative matrices, lint exclusion, and future implementation criteria. | Documentation only; no fixture files/directories, loaders, adapters, schemas, storage, persistence, registration, initialization, mutation, runtime, completion, trials, UI, or gameplay behavior. |
| `0.5.137` | Knowledge Progress Record Initialization Plan | Codex Local docs-first | Planning | Completed. Defined lazy explicit zero-state initialization, deterministic `progressId`, active target and character-owner authority, sequence and notes posture, duplicate rejection, and future helper acceptance criteria. | Documentation only; no progress records, fixtures, helpers, tests, schemas, storage, persistence, runtime, mutation, completion, trials, UI, or gameplay behavior. |
| `0.5.138` | Knowledge Progress Record Initialization Helper | Codex Local | Pure helper + focused tests | Completed. Added deterministic in-memory zero-state initialization proposals, exact length-prefixed identity, active target authority, explicit character owner/sequence/notes, current-record duplicate blocking, 26 focused tests, and external current-validator confirmation. | No storage, persistence, fixtures, normal lint registration, evidence acceptance or consumption, progress application, completion, trials, UI, runtime, generated output, or gameplay behavior. |
| `0.5.139` | Knowledge Evidence Acceptance Helper Plan | Codex Local docs-first | Planning | Completed. Defined an explicit one-candidate acceptance boundary, required current accepted wrapper, existing-validator gates, exact-id rejection, accepted-record copy, inert output envelope, and future helper test criteria. | Documentation only; no acceptance helper, evidence/progress state, fixtures, storage, persistence, progress application, completion, trials, UI, runtime, generated output, or gameplay behavior. |
| `0.5.140` | Knowledge Evidence Acceptance Helper | Codex Local | Pure helper + focused tests | Completed. Added one-candidate acceptance, explicit current-wrapper validation, exact-id rejection, copied accepted output, deterministic validation/duplicate distinction, inert safety flags, and 27 focused tests. | No canonical storage, persistence, fixtures, normal lint registration, progress initialization/proposal/application, completion, trials, UI, runtime, generated output, or gameplay behavior. |
| `0.5.141` | Knowledge Progress Application Plan | Codex Local docs-first | Planning | Completed. Defined explicit accepted-evidence and current-progress inputs, strict proposal verification, target parity, positive delta and monotonic sequence rules, exact notes preservation, replacement-wrapper validation, and an inert application envelope. | Documentation only; no application helper, state mutation, storage, persistence, fixtures, completion, trials, UI, runtime, generated output, or gameplay behavior. |
| `0.5.142` | Knowledge Progress Application Helper | Codex Local | Pure helper + focused tests | Completed. Added deterministic one-proposal application, explicit accepted-evidence and current-progress validation, strict proposal/target/value/consumption/sequence/notes checks, replacement-wrapper validation, inert safety flags, and 43 focused tests. | No storage, persistence, fixtures, normal lint registration, evidence acceptance, progress initialization, completion, trials, UI, runtime, generated output, or gameplay behavior. |
| `0.5.143` | Knowledge Completion Rules Plan | Codex Local docs-first | Planning | Completed. Defined fail-closed threshold authority, applied-progress interpretation, authored completion-weight/counting posture, owner/domain/tier aggregation boundaries, exact inert safety flags, focused tests, and future helper acceptance criteria. | Documentation only; no completion helper, schema/content/validator edits, state mutation, storage, persistence, fixtures, trials, UI, runtime, generated output, or gameplay behavior. |
| `0.5.144` | Knowledge Completion Helper | Codex Local | Pure helper + focused tests | Completed. Added deterministic snippet/tier/domain completion decisions over explicit validated applied progress and exact in-memory policy, strict aggregation isolation, exact safety flags, Arcane Lore blocking, and 64 focused tests. | No schema/content/validator edits, storage, persistence, fixtures, normal lint registration, completion state, trials, UI, runtime, generated output, events, rewards, ownership mutation, or gameplay behavior. |
| `0.5.145` | Knowledge Trial Boundary Plan | Codex Local docs-first | Planning | Completed. Defined separate eligibility and readiness phases, exact completion-envelope and trial-policy authority, owner/domain/tier isolation, inert cooldown/attempt/reward posture, Arcane Lore blocking, and future helper acceptance criteria. | Documentation only; no trial helper, schema/content/test/fixture, state, storage, persistence, UI, runtime, generated output, events, rewards, ownership mutation, or gameplay behavior. |
| `0.5.146` | Knowledge Trial Eligibility Helper | Codex Local | Pure helper + focused tests | Completed. Added exact completion-envelope and policy validation, deterministic eligibility decisions, strict owner/domain/tier isolation, inert downstream statuses/reward references, Arcane Lore blocking, and 70 focused tests. | No readiness evaluation, attempt creation, checkpoints, outcomes, cooldown mutation, reward grant, storage, persistence, normal lint registration, UI, runtime, events, ownership mutation, or gameplay behavior. |
| `0.5.147` | Knowledge Trial Readiness Boundary Plan | Codex Local docs-first | Planning | Completed. Defined exact eligibility-envelope validation, readiness policy, attempt/history/limit, cooldown, availability, prerequisite, sequence/time, decision, isolation, safety, and future-helper boundaries. | Documentation only; no readiness helper, schema/content/test/fixture, state, attempt, checkpoint, outcome, cooldown mutation, reward, storage, persistence, UI, runtime, event, or gameplay behavior. |
| `0.5.148` | Knowledge Trial Readiness Helper | Codex Local | Pure helper + focused tests | Completed. Added exact eligibility-envelope and explicit-authority validation with deterministic readiness decisions and 83 focused tests. | No attempt creation, checkpoint/outcome resolution, cooldown mutation, reward grant, storage, persistence, normal lint registration, UI, runtime, events, or gameplay behavior. |
| `0.5.149` | Knowledge Trial Schema Plan | Codex Local docs-first | Planning | Completed. Selected the first static eligibility-policy schema slice, content-path split, owner-free authored posture, mutable-authority exclusions, and staged validation sequence. | Documentation only; no schema/content implementation, validator, helper adapter, state, attempts, checkpoints, outcomes, cooldown mutation, rewards, storage, persistence, UI, runtime, events, or gameplay behavior. |
| `0.5.150` | Knowledge Trial Static Policy Schema | Codex Local | Schema file + focused schema tests | Completed. Added one strict record-level static eligibility-policy schema and focused structural contract coverage. | No content JSON, readiness schema, semantic validator, helper adapter, fixture, registration, state, storage, UI, runtime, events, or gameplay behavior. |
| `0.5.151` | Knowledge Trial Policy Content Plan | Codex Local docs-first | Planning | Completed. Selected the future records wrapper, exact one-record Flora Tier 1 slice, registry-null posture, semantic-validation sequence, and content-skeleton acceptance criteria. | Documentation only; no policy content JSON, schema edit, validator, adapter, test, fixture, registration, state, storage, UI, runtime, events, or gameplay behavior. |
| `0.5.152` | Knowledge Trial Authored Policy Content Skeleton | Codex Local | Content JSON + focused parse tests | Completed. Added exactly the selected one-record Flora Tier 1 policy wrapper and focused structural coverage. | No registry reference update, readiness content, semantic validator, helper adapter, fixture, registration, state, storage, UI, runtime, events, or gameplay behavior. |
| `0.5.153` | Knowledge Trial Policy Semantic Validator Plan | Codex Local docs-first | Planning | Completed. Defined the pure validator location and inputs, schema-first semantics, exact coherence and reference checks, deterministic diagnostics, unregistered implementation posture, tests, and acceptance criteria. | Documentation only; no validator, content/schema edit, registry alignment, adapter, readiness content, state, storage, UI, runtime, events, or gameplay behavior. |
| `0.5.154` | Knowledge Trial Policy Semantic Validator | Codex Local | Pure validator + focused tests | Completed. Added the unregistered schema-first policy validator, deterministic diagnostics, exact semantic boundaries, and 76 focused tests. | No content/schema edit, registry alignment, helper calls, adapter, readiness content, normal lint registration, state, storage, UI, runtime, events, or gameplay behavior. |
| `0.5.155` | Knowledge Trial Policy Normal Lint Registration Plan | Codex Local docs-first | Planning | Completed. Defined one-step index registration, exact explicit dependency loading, 55-to-56 checked-file accounting, failure propagation, focused test updates, and registration acceptance criteria. | Documentation only; no registration, validator/content/schema edit, registry alignment, adapter, state, storage, UI, runtime, events, or gameplay behavior. |
| `0.5.156` | Knowledge Trial Policy Normal Lint Registration | Codex Local | Index registration + focused tests | Completed. Registered the unchanged pure validator, counted policy content exactly once, preserved registry/snippet validation, and changed successful normal lint from 55 to 56 checked files. | No validator/content/schema/registry/snippet/helper edit, registry alignment, adapter, readiness policy, state, storage, UI, runtime, events, rewards, or gameplay behavior. |
| `0.5.157` | Knowledge Trial Registry Reference Alignment Plan | Codex Local docs-first | Planning | Completed. Selected the exact Flora-to-Flora-Tier-1 reference, validator ownership, one-policy-per-domain posture, failure modes, tests, and `0.5.158` acceptance criteria. | Documentation only; no registry/content/schema/validator/test/helper/runtime behavior. |
| `0.5.158` | Knowledge Trial Registry Reference Alignment | Codex Local | Narrow validator/test/content alignment | Next. Reconcile null-only validator rules and set the single approved Flora reference while preserving 56-file normal lint. | No policy/snippet/schema/index/helper/adapter/readiness/state/storage/UI/runtime/reward/event/gameplay changes. |

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
8. `0.5.119 - Knowledge Snippet Semantic Validator Plan` - completed
9. `0.5.120 - Knowledge Snippet Semantic Validator` - completed
10. `0.5.121 - Knowledge Evidence Contract Plan` - completed
11. `0.5.122 - Knowledge Evidence Schema Plan` - completed
12. `0.5.123 - Knowledge Evidence Schema` - completed
13. `0.5.124 - Knowledge Evidence Semantic Validator Plan` - completed
14. `0.5.125 - Knowledge Evidence Semantic Validator` - completed
15. `0.5.126 - Knowledge Progress State Plan` - completed
16. `0.5.127 - Knowledge Progress Schema Plan` - completed
17. `0.5.128 - Knowledge Progress Schema` - completed
18. `0.5.129 - Knowledge Progress Semantic Validator Plan` - completed
19. `0.5.130 - Knowledge Progress Semantic Validator` - completed
20. `0.5.131 - Knowledge Evidence-to-Progress Rules Plan` - completed
21. `0.5.132 - Knowledge Evidence-to-Progress Rules` - completed
22. `0.5.133 - Knowledge Evidence Producers Plan` - completed
23. `0.5.134 - Knowledge Observation Evidence Producer` - completed
24. `0.5.135 - Knowledge Storage And Persistence Boundary Plan` - completed
25. `0.5.136 - Knowledge Storage Fixture Boundary Plan` - completed
26. `0.5.137 - Knowledge Progress Record Initialization Plan` - completed
27. `0.5.138 - Knowledge Progress Record Initialization Helper` - completed
28. `0.5.139 - Knowledge Evidence Acceptance Helper Plan` - completed
29. `0.5.140 - Knowledge Evidence Acceptance Helper` - completed
30. `0.5.141 - Knowledge Progress Application Plan` - completed
31. `0.5.142 - Knowledge Progress Application Helper` - completed
32. `0.5.143 - Knowledge Completion Rules Plan` - completed
33. `0.5.144 - Knowledge Completion Helper` - completed
34. `0.5.145 - Knowledge Trial Boundary Plan` - completed
35. `0.5.146 - Knowledge Trial Eligibility Helper` - completed
36. `0.5.147 - Knowledge Trial Readiness Boundary Plan` - completed
37. `0.5.148 - Knowledge Trial Readiness Helper` - completed
38. `0.5.149 - Knowledge Trial Schema Plan` - completed
39. `0.5.150 - Knowledge Trial Static Policy Schema` - completed
40. `0.5.151 - Knowledge Trial Policy Content Plan` - completed
41. `0.5.152 - Knowledge Trial Authored Policy Content Skeleton` - completed
42. `0.5.153 - Knowledge Trial Policy Semantic Validator Plan` - completed
43. `0.5.154 - Knowledge Trial Policy Semantic Validator` - completed
44. `0.5.155 - Knowledge Trial Policy Normal Lint Registration Plan` - completed
45. `0.5.156 - Knowledge Trial Policy Normal Lint Registration` - completed
46. `0.5.157 - Knowledge Trial Registry Reference Alignment Plan` - completed
47. `0.5.158 - Knowledge Trial Registry Reference Alignment` - next

## 5. Advancement Framework Roadmap

The advancement framework should preserve the current skill infrastructure while expanding the game loop through three distinct but related lanes.

| Lane | Source | Timing | Purpose | Boundary |
| --- | --- | --- | --- | --- |
| Skill Mastery Trials | `docs/design/skill-mastery-trial-framework-plan.md` | `0.5.x` planning, `0.6.x` runtime scaffolding | Preserve current 125-rank, five-band skill structure while adding narrative checkpoint trials at breakthrough gates. | Do not replace current bands, titles, hard caps, or breakthrough gates. |
| Magic Study Events | `docs/design/skill-mastery-trial-framework-plan.md` | `0.5.x` planning after magic resolver guardrails, `0.6.x` runtime scaffolding | Add Torn OC/Racing-style spell learning through self-study, paid teachers, institutions, scrolls, tomes, grimoires, and supervised rituals. | Study/access does not grant spell ownership without validated acquisition evidence. |
| Knowledge Discovery And Comprehension | `packages/schemas/player/knowledge_snippet.schema.json`; `docs/future_content_backlog.md` | `0.5.x` schema/planning, `0.6.x` pure helpers, `0.7.x` broad content expansion | Add snippet-based knowledge progression with later-authored tier completion, travel/book/teacher/institution discovery, and later knowledge trials. | Knowledge remains distinct from skills and magic; discovery/access does not auto-complete snippets. |

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
13. `0.5.119 - Knowledge Snippet Semantic Validator Plan` - completed
14. `0.5.120 - Knowledge Snippet Semantic Validator` - completed
15. `0.5.121 - Knowledge Evidence Contract Plan` - completed
16. `0.5.122 - Knowledge Evidence Schema Plan` - completed
17. `0.5.123 - Knowledge Evidence Schema` - completed
18. `0.5.124 - Knowledge Evidence Semantic Validator Plan` - completed
19. `0.5.125 - Knowledge Evidence Semantic Validator` - completed
20. `0.5.126 - Knowledge Progress State Plan` - completed
21. `0.5.127 - Knowledge Progress Schema Plan` - completed
22. `0.5.128 - Knowledge Progress Schema` - completed
23. `0.5.129 - Knowledge Progress Semantic Validator Plan` - completed
24. `0.5.130 - Knowledge Progress Semantic Validator` - completed
25. `0.5.131 - Knowledge Evidence-to-Progress Rules Plan` - completed
26. `0.5.132 - Knowledge Evidence-to-Progress Rules` - completed
27. `0.5.133 - Knowledge Evidence Producers Plan` - completed
28. `0.5.134 - Knowledge Observation Evidence Producer` - completed
29. `0.5.135 - Knowledge Storage And Persistence Boundary Plan` - completed
30. `0.5.136 - Knowledge Storage Fixture Boundary Plan` - completed
31. `0.5.137 - Knowledge Progress Record Initialization Plan` - completed
32. `0.5.138 - Knowledge Progress Record Initialization Helper` - completed
33. `0.5.139 - Knowledge Evidence Acceptance Helper Plan` - completed
34. `0.5.140 - Knowledge Evidence Acceptance Helper` - completed
35. `0.5.141 - Knowledge Progress Application Plan` - completed
36. `0.5.142 - Knowledge Progress Application Helper` - completed
37. `0.5.143 - Knowledge Completion Rules Plan` - completed
38. `0.5.144 - Knowledge Completion Helper` - completed
39. `0.5.145 - Knowledge Trial Boundary Plan` - completed
40. `0.5.146 - Knowledge Trial Eligibility Helper` - completed
41. `0.5.147 - Knowledge Trial Readiness Boundary Plan` - completed
42. `0.5.148 - Knowledge Trial Readiness Helper` - completed
43. `0.5.149 - Knowledge Trial Schema Plan` - completed
44. `0.5.150 - Knowledge Trial Static Policy Schema` - completed
45. `0.5.151 - Knowledge Trial Policy Content Plan` - completed
46. `0.5.152 - Knowledge Trial Authored Policy Content Skeleton` - completed
47. `0.5.153 - Knowledge Trial Policy Semantic Validator Plan` - completed
48. `0.5.154 - Knowledge Trial Policy Semantic Validator` - completed
49. `0.5.155 - Knowledge Trial Policy Normal Lint Registration Plan` - completed
50. `0.5.156 - Knowledge Trial Policy Normal Lint Registration` - completed
51. `0.5.157 - Knowledge Trial Registry Reference Alignment Plan` - completed
52. `0.5.158 - Knowledge Trial Registry Reference Alignment` - next
53. `0.5.x - Knowledge Trial Checkpoint Helper`
54. `0.5.x - Skill Trial Schema Expansion Plan`
55. `0.5.x - Skill Trial Checkpoint Outcome Helper`
56. `0.5.x - Skill Trial Cooldown/Readiness Helper`
57. `0.5.x - Magic Study Event Boundary Plan`
58. `0.5.x - Magic Study Source Plan`
59. `0.5.x - Magic Study Checkpoint Helper`
60. `0.5.x - Known-Spell Acquisition Evidence Integration Plan`
61. `0.5.x - Shared Trial Vocabulary / Envelope Plan`
62. `0.5.x - Trial UI Presentation Plan`
63. `0.6.x - First Advancement Event Runtime Shape`
64. `0.6.x - First Skill Trial Family Content`
65. `0.6.x - First Magic Study Event Family Content`
66. `0.6.x - First Knowledge Trial Family Content`
67. `0.7.x - Chronicle/Renown Hooks For Trials, Study, And Knowledge`

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
| 28 | `0.5.119` | Knowledge Snippet Semantic Validator Plan | `docs/design/knowledge-snippet-semantic-validator-plan.md` | Completed |
| 29 | `0.5.120` | Knowledge Snippet Semantic Validator | `tools/content-lint/knowledge-snippets.mjs` | Completed |
| 30 | `0.5.121` | Knowledge Evidence Contract Plan | `docs/design/knowledge-evidence-contract-plan.md` | Completed |
| 31 | `0.5.122` | Knowledge Evidence Schema Plan | `docs/design/knowledge-evidence-schema-plan.md` | Completed |
| 32 | `0.5.123` | Knowledge Evidence Schema | `packages/schemas/player/knowledge_evidence.schema.json` | Completed |
| 33 | `0.5.124` | Knowledge Evidence Semantic Validator Plan | `docs/design/knowledge-evidence-semantic-validator-plan.md` | Completed |
| 34 | `0.5.125` | Knowledge Evidence Semantic Validator | `tools/content-lint/knowledge-evidence.mjs` | Completed |
| 35 | `0.5.126` | Knowledge Progress State Plan | `docs/design/knowledge-progress-state-plan.md` | Completed |
| 36 | `0.5.127` | Knowledge Progress Schema Plan | `docs/design/knowledge-progress-schema-plan.md` | Completed |
| 37 | `0.5.128` | Knowledge Progress Schema | `packages/schemas/player/knowledge_progress.schema.json` | Completed |
| 38 | `0.5.129` | Knowledge Progress Semantic Validator Plan | `docs/design/knowledge-progress-semantic-validator-plan.md` | Completed |
| 39 | `0.5.130` | Knowledge Progress Semantic Validator | `tools/content-lint/knowledge-progress.mjs` | Completed |
| 40 | `0.5.131` | Knowledge Evidence-to-Progress Rules Plan | `docs/design/knowledge-evidence-to-progress-rules-plan.md` | Completed |
| 41 | `0.5.132` | Knowledge Evidence-to-Progress Rules | `tools/content-lint/knowledge-evidence-to-progress.mjs` | Completed |
| 42 | `0.5.133` | Knowledge Evidence Producers Plan | `docs/design/knowledge-evidence-producers-plan.md` | Completed |
| 43 | `0.5.134` | Knowledge Observation Evidence Producer | `tools/content-lint/knowledge-evidence-producers.mjs` | Completed |
| 44 | `0.5.135` | Knowledge Storage And Persistence Boundary Plan | `docs/design/knowledge-storage-persistence-boundary-plan.md` | Completed |
| 45 | `0.5.136` | Knowledge Storage Fixture Boundary Plan | `docs/design/knowledge-storage-fixture-boundary-plan.md` | Completed |
| 46 | `0.5.137` | Knowledge Progress Record Initialization Plan | `docs/design/knowledge-progress-record-initialization-plan.md` | Completed |
| 47 | `0.5.138` | Knowledge Progress Record Initialization Helper | `tools/content-lint/knowledge-progress-initialization.mjs` | Completed |
| 48 | `0.5.139` | Knowledge Evidence Acceptance Helper Plan | `docs/design/knowledge-evidence-acceptance-helper-plan.md` | Completed |
| 49 | `0.5.140` | Knowledge Evidence Acceptance Helper | `tools/content-lint/knowledge-evidence-acceptance.mjs` | Completed |
| 50 | `0.5.141` | Knowledge Progress Application Plan | `docs/design/knowledge-progress-application-plan.md` | Completed |
| 51 | `0.5.142` | Knowledge Progress Application Helper | `tools/content-lint/knowledge-progress-application.mjs` | Completed |
| 52 | `0.5.143` | Knowledge Completion Rules Plan | `docs/design/knowledge-completion-rules-plan.md` | Completed |
| 53 | `0.5.144` | Knowledge Completion Helper | `tools/content-lint/knowledge-completion.mjs` | Completed |
| 54 | `0.5.145` | Knowledge Trial Boundary Plan | `docs/design/knowledge-trial-boundary-plan.md` | Completed |
| 55 | `0.5.146` | Knowledge Trial Eligibility Helper | `tools/content-lint/knowledge-trial-eligibility.mjs` | Completed |
| 56 | `0.5.147` | Knowledge Trial Readiness Boundary Plan | `docs/design/knowledge-trial-readiness-boundary-plan.md` | Completed |
| 57 | `0.5.148` | Knowledge Trial Readiness Helper | `tools/content-lint/knowledge-trial-readiness.mjs` | Completed |
| 58 | `0.5.149` | Knowledge Trial Schema Plan | `docs/design/knowledge-trial-schema-plan.md` | Completed |
| 59 | `0.5.150` | Knowledge Trial Static Policy Schema | `packages/schemas/player/knowledge_trial_policy.schema.json` | Completed |
| 60 | `0.5.151` | Knowledge Trial Policy Content Plan | `docs/design/knowledge-trial-policy-content-plan.md` | Completed |
| 61 | `0.5.152` | Knowledge Trial Authored Policy Content Skeleton | `packages/content/base/player/knowledge_trial_policies.json` | Completed |
| 62 | `0.5.153` | Knowledge Trial Policy Semantic Validator Plan | `docs/design/knowledge-trial-policy-semantic-validator-plan.md` | Completed |
| 63 | `0.5.154` | Knowledge Trial Policy Semantic Validator | `tools/content-lint/knowledge-trial-policies.mjs` | Completed |
| 64 | `0.5.155` | Knowledge Trial Policy Normal Lint Registration Plan | `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md` | Completed |
| 65 | `0.5.156` | Knowledge Trial Policy Normal Lint Registration | `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md` | Completed |
| 66 | `0.5.157` | Knowledge Trial Registry Reference Alignment Plan | `docs/design/knowledge-trial-registry-reference-alignment-plan.md` | Completed |
| 67 | `0.5.158` | Knowledge Trial Registry Reference Alignment | `docs/design/knowledge-trial-registry-reference-alignment-plan.md` | Next |

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
| Knowledge Evidence Schema | `packages/schemas/player/knowledge_evidence.schema.json`; use as the strict evidence record structural contract, not as permission for evidence state, semantic validation, runtime loading, progress, persistence, or UI. |
| Knowledge Evidence Semantic Validator Plan | `docs/design/knowledge-evidence-semantic-validator-plan.md`; consumed by `0.5.125`, retain through progress-state and evidence-to-progress planning for authority, compatibility, duplicate-identity, and no-state boundaries. |
| Knowledge Progress State Plan | `docs/design/knowledge-progress-state-plan.md`; use for progress identity, character ownership, integer-value posture, evidence-consumption boundaries, schema ownership, validation layers, and the ordered progress implementation sequence. |
| Knowledge Progress Schema Plan | `docs/design/knowledge-progress-schema-plan.md`; use as the exact first-schema authority for required fields, patterns, enums, consumed-evidence and notes posture, forbidden fields, tests, and implementation acceptance criteria. |
| Knowledge Progress Schema | `packages/schemas/player/knowledge_progress.schema.json`; use as the strict progress record structural contract, not as permission for progress state, semantic validation, evidence credit, runtime loading, persistence, completion, trials, or UI. |
| Knowledge Completion Rules Plan | `docs/design/knowledge-completion-rules-plan.md`; use for completion terminology, explicit threshold authority, applied-progress interpretation, snippet/tier/domain aggregation, exact safety flags, focused tests, and the later pure-helper acceptance criteria. |
| Knowledge Trial Boundary Plan | `docs/design/knowledge-trial-boundary-plan.md`; use for completion-envelope authority, separate eligibility/readiness phases, owner/domain/tier isolation, inert attempt/cooldown/reward posture, Arcane Lore blocking, eligibility implementation history, and readiness-boundary planning. |
| Knowledge Trial Eligibility Helper | `tools/content-lint/knowledge-trial-eligibility.mjs`; use as the exact current eligibility-envelope and implementation-local policy authority, not as persisted trial state or readiness/attempt permission. |
| Knowledge Trial Readiness Boundary Plan | `docs/design/knowledge-trial-readiness-boundary-plan.md`; use for exact eligibility-envelope input, readiness policy, attempt/cooldown/availability/sequence-time authorities, decisions, safety flags, focused tests, and later helper acceptance criteria. |
| Knowledge Trial Readiness Helper | `tools/content-lint/knowledge-trial-readiness.mjs`; use as the exact current readiness-envelope and operation-local authority contract, not as persisted trial state or attempt permission. |
| Knowledge Trial Schema Plan | `docs/design/knowledge-trial-schema-plan.md`; use for static policy schema fields, owner-free authored posture, content-path decisions, mutable-state exclusions, validation sequencing, and `0.5.150` acceptance criteria. |
| Knowledge Trial Static Policy Schema | `packages/schemas/player/knowledge_trial_policy.schema.json`; use as the strict record-level structural authority for future authored eligibility-policy content, not as content, semantic authority, helper input adaptation, readiness state, or trial behavior. |
| Knowledge Trial Policy Content Plan | `docs/design/knowledge-trial-policy-content-plan.md`; use for the selected future content path and wrapper, exact Flora Tier 1 first record, registry-null posture, later semantic checks, and `0.5.152` acceptance criteria. |
| Knowledge Trial Policy Semantic Validator Plan | `docs/design/knowledge-trial-policy-semantic-validator-plan.md`; use for the pure validator boundary, exact semantic rules, unregistered implementation posture, focused tests, and `0.5.154` acceptance criteria. |
| Knowledge Trial Policy Normal Lint Registration Plan | `docs/design/knowledge-trial-policy-normal-lint-registration-plan.md`; use for exact index wiring, explicit dependency loading, checked-file accounting, failure propagation, focused test updates, and `0.5.156` acceptance criteria. |
| Knowledge Trial Registry Reference Alignment Plan | `docs/design/knowledge-trial-registry-reference-alignment-plan.md`; use for the exact Flora reference, single-policy-per-domain posture, validator ownership, failure modes, focused tests, and `0.5.158` acceptance criteria. |
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
