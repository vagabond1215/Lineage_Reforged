# Lineage: Reforged - Long-Term Project Roadmap

Last reviewed: 2026-06-28

This roadmap is a repo-readable planning document for long-term version direction, playability checkpoints, lightweight audit/planning passes, and major deferred systems. It complements:

- `AGENTS.md` for repository rules, version-label discipline, and tool routing.
- `docs/dev/current-codex-output.md` for the latest exact implementation handoff.
- `docs/dev/current-gpt-handoff.md` for current connector-side audits, immediate risks, and prompt guardrails.
- `docs/dev/codex-sequenced-implementation-plan.md` for the ordered near-term Codex queue after the current handoff.
- `docs/design/future-system-design-ledger.md` for durable future-system criteria, vocabulary, boundaries, and open conceptual questions.
- `docs/design/survival-builder-rpg-mmo-content-gap-audit.md` for broad survival/builder/RPG/MMO gap context after the current narrow Religion/hotspot lane.
- `docs/dev/project-vision-and-continuity-brief.md` for the strategic north star and source map.
- `docs/future_content_backlog.md` for deferred content and historical run notes.

The current Codex handoff controls exact current version state. The current GPT handoff controls immediate connector-side guardrails. This roadmap controls version order, maturity bands, playability checkpoints, and lightweight audit/source indexing. The sequenced implementation plan gives Codex a concrete ordered queue. The design ledger controls durable conceptual criteria.

## 1. Current Anchor

Current live anchor:

- Latest completed version: `Version 0.5.251 - First World Map Feature Content Seed`
- Next recommended version: `Version 0.5.252 - Settlement District And Site Authority Boundary Decision`
- Current near-term sequence source: `docs/dev/codex-sequenced-implementation-plan.md`
- Current phase: `v0.5.x` foundation stabilization / ownership hardening

Versioning rule:

- Patch numbers may exceed two digits inside the current band.
- `Version 0.5.170 - Religion Knowledge Domain Seed` activated Religion and added the exact two planned Religion snippets while keeping policy refs null.
- `Version 0.5.171 - Religious Hotspot Knowledge Snippet Plan` found hotspot snippets blocked by missing place/religion affiliation authority, dominant/tolerated faith, hotspot intensity, mismatch/public posture, and supported place/hotspot subjects.
- `Version 0.5.172 - Religious Hotspot Content Authority Plan` selected a future separate `world.religious_hotspots` authored content collection as the preferred hotspot authority and deferred `world.sacred_sites` as a possible later specialization.
- `Version 0.5.173 - Documentation Authority Consolidation And Gap Audit Integration` integrated the survival/builder/RPG/MMO gap audit as durable design context without changing runtime authority or derailing the Religion/hotspot path.
- `Version 0.5.174 - Religious Hotspot Content Authority Schema Plan` defined the exact future `world.religious_hotspots` schema and semantic-validator contract without implementation.
- `Version 0.5.175 - Religious Hotspot Content Authority Schema And Validator` added the strict schema, pure focused validator, and in-memory tests without adding live content or normal lint registration.
- `Version 0.5.176 - Religious Hotspot Content Authority Seed Plan` selected two future planned records: `religious_hotspot.glasswake_shrine_lantern_gardens` and `religious_hotspot.lantern_shrine_gardens`.
- `Version 0.5.177 - Religious Hotspot Content Authority Seed` added both planned records and registered 57-file normal lint.
- `Version 0.5.178 - Religious Hotspot Knowledge Subject Vocabulary Plan` selected direct `religious_hotspot` vocabulary and an active-only policy for future live snippets without implementation.
- `Version 0.5.179 - Religious Hotspot Knowledge Subject Schema And Validator` added direct schema vocabulary, live authority resolution, active-only enforcement, and focused tests without content changes.
- `Version 0.5.180 - Religious Hotspot Knowledge Snippet Seed Plan` selected the settlement-scale Glasswake hotspot for first activation and one later identification snippet.
- `Version 0.5.181 - Religious Hotspot Content Status Activation` activated only the settlement-scale Glasswake hotspot and added its validator-required Elemental Pantheon dominant faith; the locality hotspot remains planned without a dominant faith.
- `Version 0.5.182 - Religious Hotspot Knowledge Snippet Seed` added exactly one Glasswake hotspot snippet and aligned the Religion registry; existing Religion snippets remain unchanged and the locality hotspot remains planned and unreferenced.
- `Version 0.5.183 - Religious Hotspot Locality Snippet Decision` kept the locality hotspot planned and unreferenced because current authority does not prove distinct value beyond the Glasswake settlement snippet; it selected a planning-only sacred-site authority pass next.
- `Version 0.5.184 - Sacred Site Authority Plan` selected a future separate `world.sacred_sites` named-site authority linked to parent religious hotspots, kept `sacredSiteType` descriptive, and separated authority from Knowledge, pilgrimage, order, law, relationship, and runtime behavior.
- `Version 0.5.185 - Religion System Expansion Research Integration` integrated broad Deep Research findings as planning only, preserved the sacred-site lane, and shifted its schema-decision follow-up to 0.5.186.
- `Version 0.5.186 - Sacred Site Authority Schema Decision` fixed the future records-only wrapper, paths, place-qualified ids, record contract, parent-hotspot coherence, vocabularies, validation posture, and staged Knowledge boundary without implementation.
- `Version 0.5.187 - Sacred Site Content Seed Plan` selected exactly one future planned Glasswake Shrine candidate and proved its place, parent-hotspot, and broad religion authority without live content.
- `Version 0.5.188 - Sacred Site Schema And Validator` added the strict schema, pure validator, focused tests, and schema-file registration without content or normal-lint registration.
- `Version 0.5.189 - First Sacred Site Content Seed` added exactly one planned Glasswake Shrine record and registered the collection in normal content lint at 58 files.
- `Version 0.5.190 - Sacred Site Knowledge Subject Decision` approved future direct `sacred_site` Religion subjects, active-only authority resolution, deferred registry alignment, and strict descriptive snippet boundaries without implementation.
- `Version 0.5.191 - Sacred Site Knowledge Subject Support` added schema vocabulary, `world.sacred_sites` authority loading, active-only validation, and focused tests without live registry, snippet, or status changes.
- `Version 0.5.192 - Sacred Site Activation Decision` approved the planned Glasswake Shrine record for later active status without changing live content.
- `Version 0.5.193 - Sacred Site Content Status Activation` changed exactly one Glasswake Shrine status value from planned to active without registry, snippet, hotspot, or behavior changes.
- `Version 0.5.194 - Sacred Site Knowledge Snippet Seed Plan` approved one future named-site snippet but found stale `planned` wording that requires cleanup before registry/snippet seeding.
- `Version 0.5.195 - Sacred Site Active Text Cleanup` cleaned exactly two stale status phrases while preserving active status and all authority fields.
- `Version 0.5.196 - Sacred Site Religion Registry And Snippet Seed` aligned Religion with `sacred_site` and `world.sacred_sites`, kept policy refs null, and added exactly one descriptive Glasswake Shrine snippet without changing site or hotspot content.
- `Version 0.5.197 - World Geography Authority Boundary Decision` established docs-only boundaries across place hierarchy, semantic map features, visual geometry, routes, political overlays, ecology/biome profiles, POIs, and future grids.
- `Version 0.5.198 - Economy Authority Boundary Decision` established docs-only boundaries across settlement economies, market profiles, resources, commodities, production, professions, guilds, institutions, crafting, route overlays, property/law, and Economy Knowledge.
- `Version 0.5.200 - Family Authority Boundary Decision` established docs-only boundaries across people, households, families, kinship links, genealogical lineages, bloodlines, overlays, estates, inheritance, prestige, and player legacy state.
- `Version 0.5.201 - Civic Authority Boundary Decision` established docs-only boundaries across polities, governments, jurisdictions, laws, civic actors, public-order descriptors, diplomacy/conflict overlays, and future mutable player state.
- `Version 0.5.203 - Travel Authority Boundary Decision` established docs-only boundaries across map/pixel geometry, semantic hexes, traversal edges, travel networks, route security, hazards, encounters/spawning, camps/rest, discovery, and future player journey state.
- `Version 0.5.204 - Magic Study Authority Boundary Decision` established docs-only boundaries across spell identity, known-spell ownership, Arcane Lore, study sources/policies, rituals, trials, Prestige, institutions/teachers, item metadata, and future player magic state.
- `Version 0.5.206 - NPC And Social Authority Boundary Decision` established docs-only boundaries across people, NPC overlays, social roles, workplaces, schedules, dialogue, relationship links, rumors, companions, services, Knowledge recognition, and player social state.
- `Version 0.5.208 - Quest Event Chronicle Authority Boundary Decision` established docs-only boundaries across quest definitions/arcs/objectives/conditions/rewards, templates/offers, events/storylets, rumors/hooks, Chronicle templates, and narrative runtime state.
- `Version 0.5.209 - Item Equipment Inventory Authority Boundary Decision` established docs-only boundaries across item identity, consumables, weapon/armor/container/loot profiles, currency/values, integrations, and runtime item state.
- `Version 0.5.212 - Combat Authority Boundary Decision` established docs-only boundaries across monster archetypes, encounter templates, spawn profiles, tactical defaults, damage-family posture, future statuses, loot descriptors, cross-system consequences, and runtime combat state.
- `Version 0.5.214 - Crafting Authority Boundary Decision` established docs-only boundaries across recipes, production chains, items/materials/tools/stations, professions/guilds/commissions, quality, repair/salvage, alchemy/enchanting, prerequisites, and player crafting state.
- `Version 0.5.216 - Settlement Authority Boundary Decision` established docs-only boundaries across live settlement identity, world/map anchors, future districts/sites, building/infrastructure/workplace references, services, property anchors, specialized spaces, travel anchors, and settlement runtime state.
- `Version 0.5.217 - Pipeline Roadmap Consolidation` replaced stale proposed labels with one monotonic dependency sequence, named all temporary-artifact retirement triggers, and classified future Deep Research gates.
- `Version 0.5.218 - Settlement Identity Schema Decision` preserved the live settlement contract, classified intrinsic and embedded descriptive fields, kept district/site references external, and retired the fully consumed temporary settlement research artifact.
- `Version 0.5.219 - Recipe And Production Schema Decision` approved future player-facing `crafting.recipes`, preserved embedded macro-production profiles, fixed item/tool/workplace reference posture, and retired the temporary crafting research artifact.
- `Version 0.5.220 - Monster Record Schema Decision` preserved the live monster authority, retained encounter/spawn/role/tactics separation and source-local loot, and retired the temporary combat research artifact.
- `Version 0.5.221 - Weapon And Armor Profile Schema Decision` approved additive weapon/armor structural profiles, preserved current item-local use profiles, and retired the temporary item/equipment research artifact.
- `Version 0.5.222 - Quest Objective And Condition Schema Decision` kept objectives/conditions embedded, approved future shared schema components for definition/archetype duplication, preserved template/generated-offer/runtime owners, and retired the temporary quest/event/Chronicle research artifact.
- `Version 0.5.223 - Person vs NPC Schema Decision` approved separate future people identity and optional one-to-one NPC overlay authorities, rejected inferred/synthetic identities, and retired the temporary NPC/social research artifact.
- `Version 0.5.224 - Magic Study Source Schema Decision` approved future static study-source access descriptors, kept policies and ownership separate, preserved Arcane Lore blockers, and retired the temporary magic/Knowledge/study research artifact.
- `Version 0.5.225 - Polity Schema Decision` approved future narrow political identity records, kept civic/legal/claim/relation/runtime owners separate, and retired the temporary civic research artifact.
- `Version 0.5.226 - Household vs Family Schema Decision` approved separate future household and family identities, kept membership/kinship/account/runtime owners separate, and retired the temporary family research artifact.
- `Version 0.5.227 - Settlement Economy Schema Decision` approved a future content-free settlement-economy schema posture, fixed embedded-field transition ownership, and retired the temporary economy research artifact.
- `Version 0.5.228 - World Map Feature Authority Schema Decision` approved future geometry-free semantic map-feature records, preserved existing visual geometry ownership, and retired the temporary world-map research artifact.
- `Version 0.5.229 - Hazard And Route Security Boundary Decision` approved separate future descriptive route-security and hazard-profile authorities, preserved current map/hex/edge/travel-network/encounter/spawn/ecology/civic/economy/runtime owners, selected a later combined hazard/security schema decision, and retired the temporary travel research artifact.
- `Version 0.5.230 - Settlement Schema And Validator Hardening` added pure settlement visual-map reference validation against current map and visual-map-feature authorities, with focused tests and no schema/content/runtime change.
- `Version 0.5.231 - Crafting Recipe Schema And Validator` added the first strict future recipe schema, isolated pure semantic validator, focused in-memory tests, and schema-file registration without live recipe content or normal lint registration.
- `Version 0.5.232 - Monster Schema And Validator Hardening` added pure monster authority validation for id/slug coherence, duplicate tags and loot keys, item/market/fauna/lineage/role/preset references, with focused tests and no schema/content/runtime change.
- `Version 0.5.233 - Weapon And Armor Profile Schemas And Validators` added strict future weapon/armor profile schemas, an isolated pure validator, focused tests, and schema-file registration without live profile content, normal content-lint registration, item edits, use-profile migration, runtime, UI, storage, combat execution, inventory, or gameplay change.
- `Version 0.5.234 - Quest Objective And Condition Validation Pass` added pure embedded quest action-tree semantic validation, wired it into normal content lint, added focused tests, and minimally corrected two negative quest definition check weights without schema, runtime, UI, storage, reward, journal/Chronicle, generated-offer, player quest-state, or gameplay change.
- `Version 0.5.235 - People And NPC Schemas And Validators` added strict future people/NPC schemas, an isolated pure validator, focused tests, and schema-file registration without live people/NPC content, normal lint registration, runtime, UI, storage, generated-person behavior, Knowledge integration, or gameplay change.
- `Version 0.5.236 - Magic Study Source Schema And Validator` added a strict future magic study source schema, an isolated pure validator, focused tests, and schema-file registration without live content, normal lint registration, study policy, progress, runtime, known-spell acquisition, spellbook mutation, UI, storage, rewards, events, commands, or gameplay change.
- `Version 0.5.237 - Polity Schema And Validator` added a strict future polity schema, an isolated pure validator, focused tests, and schema-file registration without live content, normal lint registration, government, law, claim, diplomacy, faction, institution, player legal state, runtime, UI, storage, rewards, events, commands, or gameplay change.
- `Version 0.5.238 - Household And Family Schemas And Validators` added strict future household/family schemas, an isolated pure validator, focused tests, and schema-file registration without live content, normal lint registration, membership, kinship, account-family bridge, inheritance, property, runtime, UI, storage, rewards, events, commands, or gameplay change.
- `Version 0.5.239 - Settlement Economy Schema And Validator` added a strict future settlement-economy schema, an isolated pure validator, focused tests, and schema-file registration without live content, normal lint registration, settlement migration, exact pricing, runtime economy, trade mutation, UI, storage, rewards, events, commands, or gameplay change.
- `Version 0.5.240 - World Map Feature Schema And Validator` added a strict future semantic map-feature schema, an isolated pure validator, focused tests, and schema-file registration without live content, normal lint registration, visual geometry migration, route topology mutation, map assets/UI, Knowledge, runtime, storage, rewards, events, commands, or gameplay change.
- `Version 0.5.241 - Hazard And Route Security Schema Decision` approved separate future `world.hazard_profiles` and `world.route_security_profiles` descriptive authorities, chose hazard vocabulary schema/validator first, route-security schema/validator second, and hazard target overlays later, without schema, content, validator, test, lint, route topology, travel runtime, encounter/spawn, UI, storage, command, event, reward, service, access, or gameplay change.
- `Version 0.5.242 - Hazard Profile Schema And Validator` added a strict future target-free hazard-profile schema, an isolated pure validator, focused tests, and schema-file registration without live content, normal lint registration, hazard overlays, route-security schema/content, route topology, travel runtime, encounter/spawn, Knowledge, UI, storage, command, event, reward, service, access, or gameplay change.
- `Version 0.5.243 - Route Security Profile Schema And Validator` added a strict future route-security profile schema, an isolated pure validator, focused tests, and schema-file registration without live content, normal lint registration, route topology mutation, route/crossing/port/trade-route authority, civic/law/economy records, runtime, UI, storage, command, event, reward, service, access, or gameplay change.
- `Version 0.5.244 - First Crafting Recipe Content Seed Plan` added `docs/design/first-crafting-recipe-content-seed-plan.md`; selected a conservative standard-recipe first seed strategy, candidate lanes, planning examples, authoring rules, future validation checklist, and conditional `0.5.245` implementation route without live recipe content, normal lint registration, production-chain migration, runtime, UI, storage, economy, inventory, or gameplay change.
- `Version 0.5.245 - First Crafting Recipe Content Seed` added 12 planned standard recipes in `packages/content/base/crafting/recipes.json`, registered recipe content in normal lint through the existing pure validator, and preserved production-chain, runtime, UI, storage, economy, inventory, item-instance, command, event, reward, and gameplay boundaries.
- `Version 0.5.246 - First People And NPC Content Seed Plan` added `docs/design/first-people-npc-content-seed-plan.md`; selected a people-only first seed posture, deferred NPC overlays, rejected inference from quest contacts, `npc.*` strings, generated operators, combatants, player/account identities, Knowledge labels, roles, titles, workplaces, and prose alone, and preserved no-live-content posture.
- `Version 0.5.247 - First People And NPC Content Seed` completed as a deferred docs-only result after a fresh audit found no explicit canonical named-person evidence; no `people.json`, `npcs.json`, normal lint registration, or runtime/content behavior changed.
- `Version 0.5.248 - First Polity Content Seed Plan` added `docs/design/first-polity-content-seed-plan.md`; selected a tiny planned-only future polity seed posture, identified Valtherion and Draemor as conditional future candidates, and preserved no-live-content posture.
- `Version 0.5.249 - First Polity Content Seed` added exactly two planned static polity identity records, `polity.valtherion` and `polity.draemor`, and registered `world.polities` in normal content lint through the existing validator without adding civic/runtime behavior.
- `Version 0.5.250 - First World Map Feature Content Seed Plan` added `docs/design/first-world-map-feature-content-seed-plan.md`; selected a tiny planned-only future semantic map-feature seed posture, identified Windward Spine and Thalos Run as conditional future candidates, and preserved no-live-content posture.
- `Version 0.5.251 - First World Map Feature Content Seed` added exactly two planned static semantic map-feature identity records, `map_feature.windward_spine` and `map_feature.thalos_run`, and registered `world.map_features` in normal content lint through the existing validator without adding geometry, route, travel, Knowledge, runtime, UI, storage, command, event, reward, or gameplay behavior.
- Do not roll from `0.5.251` to `0.6.0` unless a dedicated runtime-readiness decision confirms the actual `0.6.x` ownership milestone.

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
- Knowledge trial registry-reference alignment has landed. `knowledge_domain.flora` now references `knowledge_trial_policy.flora_tier_1`; every other registry trial reference remains null; registry-local and cross-file policy lint enforce active non-Arcane exact-id coherence; and normal lint remains at 56 checked files without making trials runnable.
- Knowledge trial readiness-policy schema planning has landed in `docs/design/knowledge-trial-readiness-policy-schema-plan.md`. It selects a minimal but meaningful owner-free record, exact one-to-one eligibility linkage, always-only availability, empty prerequisite gates, and strict exclusion of raw state, lifecycle, reward, helper, runtime, storage, and UI authority.
- The strict Knowledge trial readiness-policy record schema now exists at `packages/schemas/player/knowledge_trial_readiness_policy.schema.json` with focused domain/tier, identity, empty-gate, availability, notes, and forbidden-authority coverage. It adds no content or runnable trial behavior.
- Ecology Knowledge domain planning has landed in `docs/design/ecology-knowledge-domain-plan.md`. It selects one broad Wave 1 `knowledge_domain.ecology`, defines an exact future registry sketch and current-vocabulary seed constraints, and keeps all content, simulation, runtime, trial, readiness, UI, storage, event, reward, and gameplay work deferred.
- Ecology seed-content planning has landed in `docs/design/ecology-knowledge-domain-seed-content-plan.md`. It freezes the exact registry record plus Kaelvar regional-variation, sheep seasonality, and grape-vine habitat snippets, and confirms that all four records pass unchanged live validation in memory.
- The active Wave 1 Ecology registry record and its three Tier 1 snippets are now live authored content. All Ecology policy references remain null; no runtime, simulation, trial, readiness, UI, storage, event, reward, command, ownership, or gameplay behavior was added.
- Religion Knowledge domain planning has landed in `docs/design/religion-knowledge-domain-plan.md`. It selects one broad Wave 1 planned domain, freezes an exact registry candidate that passes current validation, and records that useful snippets require direct religion/deity/rite/order/site/hotspot authority rather than `custom` or an invented region bridge.
- The exact Wave 1 Religion registry record is now live metadata with `status: "planned"` and all policy references null. No Religion snippets or world religion content were added; normal content lint remains 56 checked files.
- Religion vocabulary and validator planning has landed in `docs/design/religion-knowledge-vocabulary-validator-plan.md`. It selects only `religion` and `deity` for the first direct-subject implementation, requires both snippet and registry schema-enum expansion, defines top-level and nested resolver authority with duplicate rejection, preserves active-domain gating, and defers orders, sites, hotspots, and broad blocked-subject enablement.
- Religion schema and validator vocabulary has landed. The snippet and registry schemas now include exactly `religion` and `deity`; normal snippet lint loads `world.religions` top-level religion records plus flattened deity records with duplicate and malformed-id rejection.
- Religion seed-content planning has landed in `docs/design/religion-knowledge-domain-seed-content-plan.md`. It selects exactly `knowledge_snippet.religion.elemental_pantheon.identification` and `knowledge_snippet.religion.light_lady.identification`, recommends activating Religion in the same future run that adds them, keeps all Religion policy refs null, and defers hotspots, favorability/alignment, trials, readiness, runtime, UI, storage, and gameplay behavior.
- Religion Knowledge Domain Seed has landed. `knowledge_domain.religion` is active, exactly two Religion snippets are live, all Religion policy refs remain null, and no world religion content, schema, validator, runtime, UI, storage, trials, readiness, rewards, events, commands, favorability, elemental alignment, or gameplay behavior changed.
- Religious Hotspot Knowledge Snippet planning has landed in `docs/design/religious-hotspot-knowledge-snippet-plan.md`. It finds live hotspot snippets blocked because current content mentions shrine-related geography but does not author exact hotspot place identity, religion/deity/institution affiliation, dominant/tolerated faith, hotspot severity, mismatch or visitor-risk posture, or supported settlement/shrine/sacred-site/hotspot snippet authority.
- Religious Hotspot Content Authority planning has landed in `docs/design/religious-hotspot-content-authority-plan.md`. It selects a future separate `world.religious_hotspots` authored collection as the preferred descriptive authority between existing place anchors and religion/deity/order records, defers `world.sacred_sites` as a later possible specialization, and keeps favorability/alignment/consequence/runtime behavior separate.
- Religious Hotspot Content Authority schema planning has landed in `docs/design/religious-hotspot-content-authority-schema-plan.md`. It defines the future schema, semantic-validator, focused-test, place-anchor coherence, religion/deity reference, descriptive enum, lint-count, and staged implementation contracts without adding live content, subject support, snippets, schema files, validators, tests, or runtime behavior.
- Religious Hotspot Content Authority schema and validator implementation has landed. `packages/schemas/world/religious-hotspot.schema.json`, `tools/content-lint/religious-hotspots.mjs`, and `tests/unit/religious-hotspots-validation.test.mjs` now define and prove the future `world.religious_hotspots` schema/semantic boundary with in-memory fixtures only. No live hotspot content file exists and normal content lint remains 56 checked files.
- Religious Hotspot Content Authority seed planning has landed in `docs/design/religious-hotspot-content-authority-seed-plan.md`. It recommends two planned seed records, omits unsupported deity/order/dominant-faith fields, and defines the future normal-lint registration path from 56 to 57 checked files.
- Survival/builder/RPG/MMO gap audit context now lives in `docs/design/survival-builder-rpg-mmo-content-gap-audit.md`. It is durable documentation-only design context for later roadmap planning, not runtime authority, not a backlog replacement, and not permission to broaden narrow prompts.
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
| `0.5.157` | Knowledge Trial Registry Reference Alignment Plan | Codex Local docs-first | Planning | Completed. Selected the exact Flora-to-Flora-Tier-1 reference, validator ownership, one-policy-per-domain posture, failure modes, tests, and acceptance criteria now assigned to `0.5.159`. | Documentation only; no registry/content/schema/validator/test/helper/runtime behavior. |
| `0.5.158` | 0.5.x Roadmap Integration Pass | Codex Local docs-only | Roadmap integration | Completed. Integrated family, heir, religion, ecology, recipe, crafting, civil-society, maturation, and estate design notes into candidate lanes and near-term direction. | Documentation only; no source, schema, content, test, runtime, UI, persistence, event, reward, or gameplay behavior. |
| `0.5.159` | Knowledge Trial Registry Reference Alignment | Codex Local | Narrow validator/test/content alignment | Completed. Set the exact Flora reference and added registry-local plus cross-file policy-reference validation while preserving 56-file normal lint. | No policy/snippet/schema/index/helper/adapter/readiness/state/storage/UI/runtime/reward/event/gameplay changes. |
| `0.5.160` | Knowledge Trial Readiness Policy Schema Plan | Codex Local docs-first | Planning | Completed. Selected the strict record shape, first Flora candidate, validator/reference boundaries, and staged sequence. | Documentation only; no schema/content/helper/runtime implementation. |
| `0.5.161` | Knowledge Trial Readiness Policy Schema | Codex Local | Schema + focused tests | Completed. Added the strict record-level readiness schema and focused structural contract coverage while preserving 56-file normal lint. | No content, validator, reference alignment, helper, adapter, state, storage, UI, runtime, event, reward, or gameplay behavior. |
| `0.5.162` | Ecology Knowledge Domain Plan | Codex Local docs-first | Planning | Completed. Selected one broad Wave 1 Ecology domain, candidate registry shape, vocabulary gaps, seed direction, and validation sequence. | Documentation only; no registry content, snippets, schemas, validators, tests, runtime, UI, storage, events, or gameplay behavior. |
| `0.5.163` | Ecology Knowledge Domain Seed Content Plan | Codex Local docs-first | Planning | Completed. Selected the exact registry record and three Tier 1 snippets and proved them against current live validation. | Documentation only; no content, schema, validator, test, runtime, UI, storage, events, or gameplay behavior. |
| `0.5.164` | Ecology Knowledge Domain Registry And Snippet Seed | Codex Local | Narrow content seed | Completed. Added the exact active Wave 1 record and three approved snippets; normal lint remains 56 files. | Content only; schemas, validators, tests, runtime, UI, storage, events, and gameplay behavior unchanged. |
| `0.5.165` | Religion Knowledge Domain Plan | Codex Local docs-first | Planning | Completed. Selected one broad planned Religion domain, exact registry metadata, hotspot boundary, vocabulary gaps, and registry-first sequence. | Documentation only; no registry, snippet, schema, validator, runtime, UI, storage, events, or gameplay behavior. |
| `0.5.166` | Religion Knowledge Domain Registry Seed | Codex Local | Narrow content seed | Completed. Added the exact planned Wave 1 Religion registry record; normal lint remains 56 files. | Registry metadata only; no snippets, world religion content, schemas, validators, tests, runtime, UI, storage, events, or gameplay behavior. |
| `0.5.167` | Religion Knowledge Vocabulary And Validator Plan | Codex Local docs-first | Planning | Completed. Selected `religion` and `deity`, exact schema/validator authority, tests, and activation sequence. | Documentation only; no snippets, schemas, validators, tests, hotspot content, world religion content, runtime, or gameplay behavior. |
| `0.5.168` | Religion Knowledge Schema And Validator Vocabulary | Codex Local | Narrow schema/validator vocabulary | Completed. Added the two direct subjects, planned registry vocabulary, explicit religion/deity authority, duplicate/malformed authority rejection, and focused tests. | No snippets, status activation, world religion content, hotspot content, runtime, UI, storage, trials, readiness, or gameplay behavior. |
| `0.5.169` | Religion Knowledge Domain Seed Content Plan | Codex Local docs-first | Planning | Completed. Selected two exact future snippets and a same-run activation path for the next seed implementation. | Documentation only; no snippets, activation, source content, schema, validator, tests, hotspot content, runtime, UI, storage, trials, readiness, or gameplay behavior. |
| `0.5.170` | Religion Knowledge Domain Seed | Codex Local | Narrow content seed | Completed. Activated Religion and added the two planned Religion snippets. | Kept all Religion policy refs null; no schema, validator, world religion, hotspot, favorability/alignment, runtime, UI, storage, trial, readiness, reward, event, command, or gameplay changes. |
| `0.5.171` | Religious Hotspot Knowledge Snippet Plan | Codex Local docs-first | Planning | Completed. Added the hotspot snippet readiness plan and found snippets blocked by missing content authority. | Documentation only; no live snippets, registry content, world religion content, schemas, validators, tests, runtime, UI, storage, trials, readiness, favorability/alignment, rewards, events, commands, or gameplay changes. |
| `0.5.172` | Religious Hotspot Content Authority Plan | Codex Local docs-first | Planning | Completed. Selected future `world.religious_hotspots` as the descriptive authority model and deferred `world.sacred_sites` as a later specialization. | Documentation only; no content JSON, schema, validator, tests, runtime, UI, storage, trials, readiness, favorability/alignment, rewards, events, commands, or gameplay changes. |
| `0.5.173` | Documentation Authority Consolidation And Gap Audit Integration | Codex Local docs-only | Documentation consolidation | Completed. Integrated the survival/builder/RPG/MMO gap audit as durable design context and shifted hotspot schema planning to `0.5.174`. | Documentation only; no source, content JSON, schema, validator, tests, runtime, UI, storage, trial/readiness, favorability/alignment, events, commands, or gameplay changes. |
| `0.5.174` | Religious Hotspot Content Authority Schema Plan | Codex Local docs-first | Planning | Completed. Added the exact future schema and semantic-validator plan for `world.religious_hotspots`. | Documentation only; no content JSON, schema, validator, tests, runtime, UI, storage, trial/readiness, favorability/alignment, events, commands, or gameplay changes. |
| `0.5.175` | Religious Hotspot Content Authority Schema And Validator | Codex Local | Narrow schema/validator implementation | Completed. Added the schema file, pure focused validator, schema-file smoke registration, and in-memory validator tests. | No live content file, normal lint registration, direct snippet subject support, snippets, `world.sacred_sites`, favorability/alignment, consequences, runtime, UI, or gameplay behavior. |
| `0.5.176` | Religious Hotspot Content Authority Seed Plan | Codex Local docs-first | Planning | Completed. Selected two future planned seed records and defined future lint registration from 56 to 57 files. | No live content file, normal lint registration, direct snippet subject support, snippets, favorability/alignment, runtime, UI, or gameplay behavior. |
| `0.5.177` | Religious Hotspot Content Authority Seed | Codex Local | Narrow content seed | Completed. Added both planned hotspot records and registered the existing validator in normal lint, moving from 56 to 57 checked files. | No Knowledge subject support, snippets, `world.sacred_sites`, deity/order/faith-posture fields, favorability/alignment, runtime, UI, storage, or gameplay behavior. |
| `0.5.178` | Religious Hotspot Knowledge Subject Vocabulary Plan | Codex Local docs-first | Planning | Completed. Selected direct `religious_hotspot` vocabulary, exact schema/validator touchpoints, active-only live-snippet policy, focused tests, and deferred boundaries. | Documentation only; no schema, validator, source, test, content JSON, snippets, runtime, UI, storage, or gameplay behavior. |
| `0.5.179` | Religious Hotspot Knowledge Subject Schema And Validator | Codex Local | Narrow schema/validator vocabulary | Completed. Added direct subject vocabulary, hotspot authority resolution, active-only enforcement, and focused tests while preserving 57-file normal lint. | No live hotspot activation, registry content, snippets, sacred sites, orders, favorability/alignment, runtime, UI, storage, or gameplay behavior. |
| `0.5.180` | Religious Hotspot Knowledge Snippet Seed Plan | Codex Local docs-first | Planning | Completed. Selected only the settlement-scale Glasswake hotspot for activation, one Tier 1 identification snippet, registry alignment timing, and supported discovery sources. | Documentation only; no content, schema, validator, source, test, runtime, UI, storage, or gameplay changes. |
| `0.5.181` | Religious Hotspot Content Status Activation | Codex Local | Narrow content status | Completed. Activated only `religious_hotspot.glasswake_shrine_lantern_gardens` with validator-required `dominantFaithIds: ["religion.elemental_pantheon"]`. | Kept the locality hotspot planned without `dominantFaithIds`; added no registry/snippet content or behavior. |
| `0.5.182` | Religious Hotspot Knowledge Snippet Seed | Codex Local | Narrow registry/snippet seed | Completed. Aligned Religion registry content and added exactly one hotspot identification snippet. | Policy refs remain null; no runtime or gameplay behavior changed. |
| `0.5.183` | Religious Hotspot Locality Snippet Decision | Codex Local docs-first | Planning | Completed. Kept the locality hotspot planned and unreferenced because current authority does not prove distinct coverage. | Documentation only; no live content or behavior changed. |
| `0.5.184` | Sacred Site Authority Plan | Codex Local docs-first | Planning | Completed. Selected a future separate named-site authority linked to religious hotspots and defined minimum fields and boundaries. | Documentation only; no sacred-site content, schema, validator, snippet, pilgrimage, runtime, or gameplay implementation. |
| `0.5.185` | Religion System Expansion Research Integration | Codex Local docs-first | Planning | Completed. Integrated knowledge-first, authority-layered Religion research, feature lanes, naming candidates, relationships, and staged sequencing. | Documentation only; no live content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.186` | Sacred Site Authority Schema Decision | Codex Local docs-first | Planning | Completed. Finalized the future records-only wrapper, paths, record shape, ids, references, enums, status rules, validation, and Knowledge sequencing. | Documentation only; no schema, validator, tests, content, or behavior. |
| `0.5.187` | Sacred Site Content Seed Plan | Codex Local docs-first | Planning | Completed. Selected and drafted exactly one planned Glasswake Shrine record with explicit authority proof and blockers. | Documentation only; no `sacred_sites.json`, schema, validator, tests, snippets, or behavior. |
| `0.5.188` | Sacred Site Schema And Validator | Codex Local | Schema/validator | Completed. Added the strict schema, pure validator, 55 focused tests, and schema-file registration. | No content file, normal lint registration, Knowledge support, activation, pilgrimage, runtime, or gameplay behavior. |
| `0.5.189` | First Sacred Site Content Seed | Codex Local | Narrow content seed | Completed. Added exactly one planned Glasswake Shrine record and registered the collection in normal lint at 58 files. | No Knowledge support, activation, snippet, pilgrimage, runtime, UI, storage, or gameplay behavior. |
| `0.5.190` | Sacred Site Knowledge Subject Decision | Codex Local docs-first | Planning | Completed. Approved direct vocabulary, active-only references, exact authority, deferred registry timing, tests, and snippet boundaries. | Documentation only; no schema, validator, registry, activation, snippet, runtime, or gameplay changes. |
| `0.5.191` | Sacred Site Knowledge Subject Support | Codex Local | Schema/validator vocabulary | Completed. Added both subject enums, authority loading, active-only resolution, and focused tests; normal lint remains 58 files. | No live registry update, site activation, snippet, runtime, UI, storage, or gameplay behavior. |
| `0.5.192` | Sacred Site Activation Decision | Codex Local docs-first | Planning | Completed. Approved the planned Glasswake sacred-site record for later active status and fixed the narrow activation meaning. | Documentation only; no status, registry, snippet, runtime, UI, storage, or gameplay changes. |
| `0.5.193` | Sacred Site Content Status Activation | Codex Local | Narrow content status | Completed. Changed exactly one approved Glasswake Shrine status from planned to active; normal lint remains 58 files. | No registry, snippet, hotspot, runtime, UI, storage, or gameplay changes. |
| `0.5.194` | Sacred Site Knowledge Snippet Seed Plan | Codex Local docs-first | Planning | Completed. Approved exact first snippet content and paired registry timing; found stale active-site wording. | Documentation only; no registry, snippet, content, runtime, UI, storage, or gameplay changes. |
| `0.5.195` | Sacred Site Active Text Cleanup | Codex Local | Narrow content text | Completed. Replaced exactly two stale planned-status phrases and added focused assertions; normal lint remains 58 files. | No status, registry, snippet, hotspot, runtime, UI, storage, or gameplay changes. |
| `0.5.196` | Sacred Site Religion Registry And Snippet Seed | Codex Local | Narrow registry and snippet content | Completed. Religion advertises `sacred_site` and `world.sacred_sites`; exactly one approved Tier 1 snippet is live. | Policy refs remain null; no hotspot, runtime, UI, storage, or gameplay changes. |
| `0.5.197` | World Geography Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Defined semantic geography/map ownership and deferred new grid reliance to `0.6+`. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.198` | Economy Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Defined descriptive economy authority ownership against substantial existing content and runtime surfaces. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.199` | Settlement Economy Schema Decision | Codex Local docs-first | Planning | Historical proposed label; remapped to `0.5.227`. | No implementation landed under this label. |
| `0.5.200` | Family Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Defined authored family authority against existing account family, estate, source-run, and Bloodlines owners. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.201` | Civic Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Defined polity, government, jurisdiction, law, civic-actor, public-order, diplomacy/conflict, and player-state boundaries. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.202` | Polity Schema Decision | Codex Local docs-first | Planning | Historical proposed label; remapped to `0.5.225`. | No implementation landed under this label. |
| `0.5.203` | Travel Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Defined travel/map/hex/edge/security/hazard/encounter/camp/discovery/player-state ownership. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.204` | Magic Study Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Defined spell/study/Knowledge/ownership/ritual/trial/Prestige/institution/item/runtime boundaries. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.205` | Magic Study Source Schema Decision | Codex Local docs-first | Planning | Historical proposed label; remapped to `0.5.224`. | No implementation landed under this label. |
| `0.5.206` | NPC And Social Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Defined people/NPC/role/schedule/dialogue/relationship/rumor/companion/service/social-state ownership. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.207` | Person vs NPC Schema Decision | Codex Local docs-first | Planning | Historical proposed label; remapped to `0.5.223`. | No implementation landed under this label. |
| `0.5.208` | Quest Event Chronicle Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Defined quest/event/Chronicle/narrative authority and runtime-state boundaries. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.209` | Item Equipment Inventory Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Defined item/profile/container/loot/currency/integration/runtime-state boundaries. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.210` | Weapon And Armor Profile Schema Decision | Codex Local docs-first | Planning | Historical proposed label; remapped to `0.5.221`. | No implementation landed under this label. |
| `0.5.212` | Combat Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Preserved existing monster/encounter/spawn/tactics owners and separated them from runtime combat state. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.213` | Monster Record Schema Decision | Codex Local docs-first | Planning | Historical proposed label; remapped to `0.5.220`. | No implementation landed under this label. |
| `0.5.214` | Crafting Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Defined future recipe authority while preserving live production-chain, workplace, item, and economy owners. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.215` | Recipe And Production Schema Decision | Codex Local docs-first | Planning | Historical proposed label; remapped to `0.5.219`. | No implementation landed under this label. |
| `0.5.216` | Settlement Authority Boundary Decision | Codex Local docs-first | Planning | Completed. Preserved live settlement identity and separated future districts/sites from building, infrastructure, workplace, service, property, travel, and runtime owners. | Documentation only; no content, schema, validator, test, runtime, UI, storage, or gameplay changes. |
| `0.5.217` | Pipeline Roadmap Consolidation | Codex Local docs-first | Planning | Completed. Consolidated dependency order, version mappings, research gates, and artifact retirement policy. | Documentation only; no schema, validator, content, test, runtime, UI, storage, gameplay, migration, or artifact deletion. |
| `0.5.218` | Settlement Identity Schema Decision | Codex Local docs-first | Planning | Completed. Preserved the live settlement contract and external future district/site references; retired the temporary settlement artifact. | Documentation only; no schema, content, validator, test, runtime, UI, storage, gameplay, or migration change. |
| `0.5.219` | Recipe And Production Schema Decision | Codex Local docs-first | Planning | Completed. Approved future static recipes while preserving macro production; retired the temporary crafting artifact. | Documentation only; no schema, content, validator, test, runtime, UI, storage, gameplay, or migration change. |
| `0.5.220` | Monster Record Schema Decision | Codex Local docs-first | Planning | Completed. Preserved the live monster contract and separate encounter/spawn/role/tactics owners; retired the temporary combat artifact. | Documentation only; no schema, content, validator, test, runtime, UI, storage, gameplay, loot, AI, combat, or migration change. |
| `0.5.221` | Weapon And Armor Profile Schema Decision | Codex Local docs-first | Planning | Completed. Approved additive profiles while preserving item identity/use profiles; retired the temporary item artifact. | Documentation only; no schema, content, validator, test, runtime, UI, storage, gameplay, equipment, combat, inventory, item-instance, or migration change. |
| `0.5.222` | Quest Objective And Condition Schema Decision | Codex Local docs-first | Planning | Completed. Kept objectives/conditions embedded, approved future shared schema components, and retired the temporary quest artifact. | Documentation only; no schema, content, validator, test, runtime, UI, storage, gameplay, quest-state, reward, event, Chronicle, or migration change. |
| `0.5.223` | Person vs NPC Schema Decision | Codex Local docs-first | Planning | Completed. Approved separate people identity and optional NPC overlay authorities; retired the temporary NPC artifact. | Documentation only; no schema, content, validator, test, loader, runtime, UI, storage, gameplay, generated-person, social, Knowledge, or migration change. |
| `0.5.224` | Magic Study Source Schema Decision | Codex Local docs-first | Planning | Completed. Approved static source access descriptors, kept policy/ownership/runtime separate, and retired the temporary magic-study artifact. | Documentation only; no schema, content, validator, test, loader, Knowledge, magic, item, trial, runtime, UI, storage, reward, event, or migration change. |
| `0.5.225` | Polity Schema Decision | Codex Local docs-first | Planning | Completed. Approved narrow political identity/place-anchor records and retired the temporary civic artifact. | Documentation only; no schema, content, validator, test, loader, civic/legal, runtime, UI, storage, reward, event, or migration change. |
| `0.5.226` | Household vs Family Schema Decision | Codex Local docs-first | Planning | Completed. Approved separate household/family identities and retired the temporary family artifact. | Documentation only; no schema, content, validator, test, loader, account, runtime, UI, storage, relationship, inheritance, or gameplay change. |
| `0.5.227` | Settlement Economy Schema Decision | Codex Local docs-first | Planning | Completed. Approved future descriptive settlement-economy records, fixed embedded-field transition ownership, and retired the temporary economy artifact. | Documentation only; no schema, content, validator, test, loader, economy, runtime, UI, storage, transaction, or gameplay change. |
| `0.5.228` | World Map Feature Authority Schema Decision | Codex Local docs-first | Planning | Completed. Approved semantic geometry-free map features, preserved visual geometry, and retired the temporary world-map artifact. | Documentation only; no schema, content, validator, test, geometry, topology, runtime, UI, storage, or gameplay change. |
| `0.5.229` | Hazard And Route Security Boundary Decision | Codex Local docs-first | Planning | Completed. Approved separate route-security and hazard-profile descriptive authorities and retired the temporary travel artifact. | Documentation only; no schema, content, validator, test, travel, encounter, spawn, runtime, UI, storage, or gameplay change. |
| `0.5.230` | Settlement Schema And Validator Hardening | Codex Local | Validator + tests | Completed. Added pure settlement visual-map reference validation against `world_maps` and current `world_map_features`. | No schema/content/runtime/UI/storage/gameplay change; `visualMapRef` remains optional and non-authoritative for simulation. |
| `0.5.231` | Crafting Recipe Schema And Validator | Codex Local | Schema + validator + tests | Completed. Added strict future recipe schema, isolated pure validator, focused tests, and schema-file registration. | No live recipe content, normal content-lint registration, production-chain extraction, runtime, UI, storage, economy, inventory, or gameplay behavior. |
| `0.5.232` | Monster Schema And Validator Hardening | Codex Local | Validator + tests | Completed. Added pure monster authority validation and focused tests. | No schema/content/runtime/UI/storage/AI/loot execution/reward/inventory/gameplay change. |
| `0.5.233` | Weapon And Armor Profile Schemas And Validators | Codex Local | Schemas + validators + tests | Completed. Added strict future weapon/armor profile schemas, isolated pure validators, focused tests, and schema-file registration. | No live profile content, normal lint registration, item edits, use-profile migration, runtime/UI/storage/combat/inventory/gameplay change. |
| `0.5.234` | Quest Objective And Condition Validation Pass | Codex Local | Validator + tests | Completed. Added pure embedded quest action-tree validation, normal content-lint wiring, focused tests, and two minimal non-negative weight fixes. | No schema/runtime/UI/storage/reward/journal/Chronicle/generated-offer/player quest-state/gameplay change. |

## Expanded 0.5.x Candidate Lanes

These lanes are roadmap candidates, not active implementation commitments:

- Knowledge Trial completion/readiness lane
- Ecology Knowledge Domain lane
- Religion-as-Knowledge lane
- Family/heir/offspring continuity lane
- Marriage/adoption/legitimacy/unused-heir lane
- Estate/mortality/orphan/wardship/betrayal lane
- Recipe ownership/learning/crafting/cooking lane
- Civil institutions/social opportunity lane
- Flora/fauna macro and micro ecology engine lane
- Renown labels by race/kingdom/culture lane
- Skill Trial and Magic Study lanes
- Survival/builder/RPG/MMO gap roadmap lane
- Runtime Ownership Transition bridge

Recommended near-term direction:

1. `0.5.247 - First People And NPC Content Seed`

This ordering is directional, not implementation lock-in. Each candidate still requires a focused prompt, owner review, and scope check. The conditional sequence through `0.5.257` is authoritative in `docs/design/pipeline-roadmap-consolidation-decision.md` and mirrored in the sequenced implementation plan. Under the current people/NPC seed plan, `0.5.247` should be people-only unless a newer approved prompt supersedes that posture.

High-priority unresolved questions:

- What is the default human adult age?
- Should non-human adult ages differ immediately or in a later content pass?
- Should maturation advance by yearly tick, birthday, season, level step, or another explicit interval?
- Should parent-stat authority use the active parent, both parents, or a weighted blend?
- Should growth roles be player-selected, inferred, event-assigned, or mixed?
- After the first seed, does authored content justify splitting broad Ecology into habitat, flora, fauna, climate, or resource subdomains?
- Which religion, element, and doctrine concepts should seed first?
- Which recipe quality labels should apply to cooking and crafting?
- What is the first bulk-crafting unlock scope?
- Should macro flora/fauna use exact counts, abundance bands, or hidden estimates?
- Which survival/builder/RPG/MMO gap lane should get a later roadmap pass after the current Religion/hotspot authority lane stabilizes?

Scope guardrails:

- The integrated family, religion, ecology, recipe, crafting, civil-society, maturation, and estate documents are future roadmap material only. They do not authorize runtime behavior.
- `docs/design/survival-builder-rpg-mmo-content-gap-audit.md` is durable broad design context, not runtime authority, not a backlog replacement, and not permission to broaden the next hotspot schema prompt.
- `Version 0.5.177 - Religious Hotspot Content Authority Seed` is completed with two live planned records and 57-file normal lint.
- `Version 0.5.180 - Religious Hotspot Knowledge Snippet Seed Plan` is completed as documentation only.
- `Version 0.5.181 - Religious Hotspot Content Status Activation` is completed with only the settlement-scale Glasswake hotspot active.
- `Version 0.5.182 - Religious Hotspot Knowledge Snippet Seed` is completed with exactly one Glasswake snippet and live Religion registry alignment.
- The completed registry alignment remains content-lint authority only and does not make Knowledge trials runnable.
- `Version 0.5.183 - Religious Hotspot Locality Snippet Decision` is completed as documentation only; the locality hotspot remains planned and unreferenced.
- `Version 0.5.184 - Sacred Site Authority Plan` is completed as documentation only; no sacred-site authority content exists and `sacredSiteType` remains descriptive.
- `Version 0.5.185 - Religion System Expansion Research Integration` is completed as documentation only; its broad feature lanes are planning guidance, not implementation permission.
- `Version 0.5.186 - Sacred Site Authority Schema Decision` is completed as documentation only; no schema, validator, test, content, or Knowledge support exists.
- `Version 0.5.187 - Sacred Site Content Seed Plan` is completed as documentation only with exactly one planned Glasswake Shrine candidate.
- `Version 0.5.188 - Sacred Site Schema And Validator` is completed with no live content or normal lint registration; normal lint remains 57 files.
- `Version 0.5.189 - First Sacred Site Content Seed` is completed with exactly one planned record and normal lint at 58 files.
- `Version 0.5.190 - Sacred Site Knowledge Subject Decision` is completed as documentation only; live Religion remains unaligned and the site remains planned.
- `Version 0.5.191 - Sacred Site Knowledge Subject Support` is completed; schema vocabulary and active-only authority exist while live Religion remains unaligned and the site remains planned.
- `Version 0.5.192 - Sacred Site Activation Decision` is completed as documentation only; the site remains planned but is approved for later activation.
- `Version 0.5.193 - Sacred Site Content Status Activation` is completed; exactly one site is active while live Religion remains unaligned and no sacred-site snippet exists.
- `Version 0.5.194 - Sacred Site Knowledge Snippet Seed Plan` is completed as documentation only; the snippet is approved but stale active-site wording blocks seeding.
- `Version 0.5.195 - Sacred Site Active Text Cleanup` is completed; active site prose is consistent and the approved registry/snippet seed is unblocked.
- `Version 0.5.196 - Sacred Site Religion Registry And Snippet Seed` is completed; Religion registry alignment and exactly one approved sacred-site snippet are live without hotspot or behavior changes.
- `Version 0.5.197 - World Geography Authority Boundary Decision` is completed as documentation only; no implementation occurred.
- `Version 0.5.198 - Economy Authority Boundary Decision` is completed as documentation only; no implementation occurred.
- `Version 0.5.200 - Family Authority Boundary Decision` is completed as documentation only; no implementation occurred.
- `Version 0.5.201 - Civic Authority Boundary Decision` is completed as documentation only; no implementation occurred.
- `Version 0.5.203 - Travel Authority Boundary Decision` is completed as documentation only; no implementation occurred.
- `Version 0.5.204 - Magic Study Authority Boundary Decision` is completed as documentation only; no implementation occurred.
- `Version 0.5.206 - NPC And Social Authority Boundary Decision` is completed as documentation only; no implementation occurred.
- `Version 0.5.208 - Quest Event Chronicle Authority Boundary Decision` is completed as documentation only; no implementation occurred.
- `Version 0.5.209 - Item Equipment Inventory Authority Boundary Decision` is completed as documentation only; no implementation occurred.
- Keep `0.5.210` limited to weapon/armor profile schema ownership against existing item/combat/equipment fields.

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
47. `0.5.158 - 0.5.x Roadmap Integration Pass` - completed
48. `0.5.159 - Knowledge Trial Registry Reference Alignment` - completed
49. `0.5.160 - Knowledge Trial Readiness Policy Schema Plan` - completed
50. `0.5.161 - Knowledge Trial Readiness Policy Schema` - next

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
52. `0.5.158 - 0.5.x Roadmap Integration Pass` - completed
53. `0.5.159 - Knowledge Trial Registry Reference Alignment` - completed
54. `0.5.160 - Knowledge Trial Readiness Policy Schema Plan` - completed
55. `0.5.161 - Knowledge Trial Readiness Policy Schema` - next
56. `0.5.x - Knowledge Trial Checkpoint Helper`
57. `0.5.x - Skill Trial Schema Expansion Plan`
58. `0.5.x - Skill Trial Checkpoint Outcome Helper`
59. `0.5.x - Skill Trial Cooldown/Readiness Helper`
60. `0.5.x - Magic Study Event Boundary Plan`
60. `0.5.x - Magic Study Source Plan`
61. `0.5.x - Magic Study Checkpoint Helper`
62. `0.5.x - Known-Spell Acquisition Evidence Integration Plan`
63. `0.5.x - Shared Trial Vocabulary / Envelope Plan`
64. `0.5.x - Trial UI Presentation Plan`
65. `0.6.x - First Advancement Event Runtime Shape`
66. `0.6.x - First Skill Trial Family Content`
67. `0.6.x - First Magic Study Event Family Content`
68. `0.6.x - First Knowledge Trial Family Content`
69. `0.7.x - Chronicle/Renown Hooks For Trials, Study, And Knowledge`

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
| 67 | `0.5.158` | 0.5.x Roadmap Integration Pass | `docs/dev/project-roadmap.md` | Completed |
| 68 | `0.5.159` | Knowledge Trial Registry Reference Alignment | `docs/design/knowledge-trial-registry-reference-alignment-plan.md` | Completed |
| 69 | `0.5.160` | Knowledge Trial Readiness Policy Schema Plan | `docs/design/knowledge-trial-readiness-policy-schema-plan.md` | Completed |
| 70 | `0.5.161` | Knowledge Trial Readiness Policy Schema | `packages/schemas/player/knowledge_trial_readiness_policy.schema.json` | Completed |
| 71 | `0.5.162` | Ecology Knowledge Domain Plan | `docs/design/ecology-knowledge-domain-plan.md` | Completed |
| 72 | `0.5.163` | Ecology Knowledge Domain Seed Content Plan | `docs/design/ecology-knowledge-domain-seed-content-plan.md` | Completed |
| 73 | `0.5.164` | Ecology Knowledge Domain Registry And Snippet Seed | `docs/design/ecology-knowledge-domain-seed-content-plan.md` | Completed |
| 74 | `0.5.165` | Religion Knowledge Domain Plan | `docs/design/religion-knowledge-domain-plan.md` | Completed |
| 75 | `0.5.166` | Religion Knowledge Domain Registry Seed | `docs/design/religion-knowledge-domain-plan.md` | Completed |
| 76 | `0.5.167` | Religion Knowledge Vocabulary And Validator Plan | `docs/design/religion-knowledge-vocabulary-validator-plan.md` | Completed |
| 77 | `0.5.168` | Religion Knowledge Schema And Validator Vocabulary | `docs/design/religion-knowledge-vocabulary-validator-plan.md` | Completed |
| 78 | `0.5.169` | Religion Knowledge Domain Seed Content Plan | `docs/design/religion-knowledge-domain-seed-content-plan.md` | Completed |
| 79 | `0.5.170` | Religion Knowledge Domain Seed | `docs/design/religion-knowledge-domain-seed-content-plan.md` | Completed |
| 80 | `0.5.171` | Religious Hotspot Knowledge Snippet Plan | `docs/design/religious-hotspot-knowledge-snippet-plan.md` | Completed |
| 81 | `0.5.172` | Religious Hotspot Content Authority Plan | `docs/design/religious-hotspot-content-authority-plan.md` | Completed |
| 82 | `0.5.173` | Documentation Authority Consolidation And Gap Audit Integration | `docs/design/survival-builder-rpg-mmo-content-gap-audit.md` | Completed |
| 83 | `0.5.174` | Religious Hotspot Content Authority Schema Plan | `docs/design/religious-hotspot-content-authority-schema-plan.md` | Completed |
| 84 | `0.5.175` | Religious Hotspot Content Authority Schema And Validator | `docs/design/religious-hotspot-content-authority-schema-plan.md` | Completed |
| 85 | `0.5.176` | Religious Hotspot Content Authority Seed Plan | `docs/design/religious-hotspot-content-authority-seed-plan.md` | Completed |
| 86 | `0.5.177` | Religious Hotspot Content Authority Seed | `docs/design/religious-hotspot-content-authority-seed-plan.md` | Completed |
| 87 | `0.5.178` | Religious Hotspot Knowledge Subject Vocabulary Plan | `docs/design/religious-hotspot-knowledge-subject-vocabulary-plan.md` | Completed |
| 88 | `0.5.179` | Religious Hotspot Knowledge Subject Schema And Validator | `docs/design/religious-hotspot-knowledge-subject-vocabulary-plan.md` | Completed |
| 89 | `0.5.180` | Religious Hotspot Knowledge Snippet Seed Plan | `docs/design/religious-hotspot-knowledge-snippet-seed-plan.md` | Completed |
| 90 | `0.5.181` | Religious Hotspot Content Status Activation | `docs/design/religious-hotspot-knowledge-snippet-seed-plan.md` | Completed |
| 91 | `0.5.182` | Religious Hotspot Knowledge Snippet Seed | `docs/design/religious-hotspot-knowledge-snippet-seed-plan.md` | Completed |
| 92 | `0.5.183` | Religious Hotspot Locality Snippet Decision | `docs/design/religious-hotspot-locality-snippet-decision.md` | Completed |
| 93 | `0.5.184` | Sacred Site Authority Plan | `docs/design/sacred-site-authority-plan.md` | Completed |
| 94 | `0.5.185` | Religion System Expansion Research Integration | `docs/design/religion-system-expansion-research-plan.md` | Completed |
| 95 | `0.5.186` | Sacred Site Authority Schema Decision | `docs/design/sacred-site-authority-schema-decision.md` | Completed |
| 96 | `0.5.187` | Sacred Site Content Seed Plan | `docs/design/sacred-site-content-seed-plan.md` | Completed |
| 97 | `0.5.188` | Sacred Site Schema And Validator | `packages/schemas/world/sacred-site.schema.json`; `tools/content-lint/sacred-sites.mjs` | Completed |
| 98 | `0.5.189` | First Sacred Site Content Seed | `packages/content/base/world/sacred_sites.json` | Completed |
| 99 | `0.5.190` | Sacred Site Knowledge Subject Decision | `docs/design/sacred-site-knowledge-subject-decision.md` | Completed |
| 100 | `0.5.191` | Sacred Site Knowledge Subject Support | `docs/design/sacred-site-knowledge-subject-decision.md` | Completed |
| 101 | `0.5.192` | Sacred Site Activation Decision | `docs/design/sacred-site-activation-decision.md` | Completed |
| 102 | `0.5.193` | Sacred Site Content Status Activation | `docs/design/sacred-site-activation-decision.md` | Completed |
| 103 | `0.5.194` | Sacred Site Knowledge Snippet Seed Plan | `docs/design/sacred-site-knowledge-snippet-seed-plan.md` | Completed |
| 104 | `0.5.195` | Sacred Site Active Text Cleanup | `docs/design/sacred-site-knowledge-snippet-seed-plan.md` | Completed |
| 105 | `0.5.196` | Sacred Site Religion Registry And Snippet Seed | `docs/design/sacred-site-knowledge-snippet-seed-plan.md` | Completed |
| 106 | `0.5.197` | World Geography Authority Boundary Decision | `docs/design/world-geography-authority-boundary-decision.md` | Completed; documentation only |
| 107 | `0.5.198` | Economy Authority Boundary Decision | `docs/design/economy-authority-boundary-decision.md` | Completed; documentation only |
| 108 | `0.5.199` | Settlement Economy Schema Decision | `docs/design/economy-authority-boundary-decision.md` | Historical proposed label; remapped to `0.5.227` |
| 109 | `0.5.200` | Family Authority Boundary Decision | `docs/design/family-authority-boundary-decision.md` | Completed; documentation only |
| 110 | `0.5.201` | Civic Authority Boundary Decision | `docs/design/civic-authority-boundary-decision.md` | Completed; documentation only |
| 111 | `0.5.202` | Polity Schema Decision | `docs/design/civic-authority-boundary-decision.md` | Historical proposed label; remapped to `0.5.225` |
| 112 | `0.5.203` | Travel Authority Boundary Decision | `docs/design/travel-authority-boundary-decision.md` | Completed; documentation only |
| 113 | `0.5.204` | Magic Study Authority Boundary Decision | `docs/design/magic-study-authority-boundary-decision.md` | Completed; documentation only |
| 114 | `0.5.205` | Magic Study Source Schema Decision | `docs/design/magic-study-authority-boundary-decision.md` | Historical proposed label; remapped to `0.5.224` |
| 115 | `0.5.206` | NPC And Social Authority Boundary Decision | `docs/design/npc-social-authority-boundary-decision.md` | Completed; documentation only |
| 116 | `0.5.207` | Person vs NPC Schema Decision | `docs/design/npc-social-authority-boundary-decision.md` | Historical proposed label; remapped to `0.5.223` |
| 117 | `0.5.208` | Quest Event Chronicle Authority Boundary Decision | `docs/design/quest-event-chronicle-authority-boundary-decision.md` | Completed; documentation only |
| 118 | `0.5.209` | Item Equipment Inventory Authority Boundary Decision | `docs/design/item-equipment-inventory-authority-boundary-decision.md` | Completed; documentation only |
| 119 | `0.5.210` | Weapon And Armor Profile Schema Decision | `docs/design/item-equipment-inventory-authority-boundary-decision.md` | Historical proposed label; remapped to `0.5.221` |
| 120 | `0.5.212` | Combat Authority Boundary Decision | `docs/design/combat-authority-boundary-decision.md` | Completed; documentation only |
| 121 | `0.5.213` | Monster Record Schema Decision | `docs/design/combat-authority-boundary-decision.md` | Historical proposed label; remapped to `0.5.220` |
| 122 | `0.5.214` | Crafting Authority Boundary Decision | `docs/design/crafting-authority-boundary-decision.md` | Completed; documentation only |
| 123 | `0.5.215` | Recipe And Production Schema Decision | `docs/design/crafting-authority-boundary-decision.md` | Historical proposed label; remapped to `0.5.219` |
| 124 | `0.5.216` | Settlement Authority Boundary Decision | `docs/design/settlement-authority-boundary-decision.md` | Completed; documentation only |
| 125 | `0.5.217` | Pipeline Roadmap Consolidation | `docs/design/pipeline-roadmap-consolidation-decision.md` | Completed; documentation only |
| 126 | `0.5.218` | Settlement Identity Schema Decision | `docs/design/settlement-identity-schema-decision.md` | Completed; documentation only; temporary research retired |
| 127 | `0.5.219` | Recipe And Production Schema Decision | `docs/design/recipe-and-production-schema-decision.md` | Completed; documentation only; temporary research retired |
| 128 | `0.5.220` | Monster Record Schema Decision | `docs/design/monster-record-schema-decision.md` | Completed; documentation only; temporary research retired |
| 129 | `0.5.221` | Weapon And Armor Profile Schema Decision | `docs/design/weapon-and-armor-profile-schema-decision.md` | Completed; documentation only; temporary research retired |

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
| Knowledge Trial Registry Reference Alignment Plan | `docs/design/knowledge-trial-registry-reference-alignment-plan.md`; use for the exact Flora reference, single-policy-per-domain posture, validator ownership, failure modes, focused tests, and acceptance criteria now assigned to `0.5.159`. |
| Knowledge Trial Readiness Policy Schema Plan | `docs/design/knowledge-trial-readiness-policy-schema-plan.md`; use for the strict owner-free readiness record, exact eligibility linkage, always-only first availability posture, forbidden lifecycle/raw-state fields, validator/reference boundaries, and `0.5.161` acceptance criteria. |
| Knowledge Trial Readiness Policy Schema | `packages/schemas/player/knowledge_trial_readiness_policy.schema.json`; use as the strict structural authority for future authored readiness records, not as content, semantic authority, helper input adaptation, mutable readiness state, or trial behavior. |
| Ecology Knowledge Domain Plan | `docs/design/ecology-knowledge-domain-plan.md`; use for the broad Wave 1 domain decision, candidate registry record, current vocabulary and validator gaps, relationships to existing domains, seed direction, deferred simulation boundaries, and `0.5.163` acceptance criteria. |
| Ecology Knowledge Domain Seed Content Plan | `docs/design/ecology-knowledge-domain-seed-content-plan.md`; use for the exact future registry record, three approved Tier 1 snippets, live-validator proof, implementation scope, and `0.5.164` acceptance criteria. |
| Religion Knowledge Domain Plan | `docs/design/religion-knowledge-domain-plan.md`; use for the broad planned-domain decision, exact registry candidate, current religion authority, snippet and hotspot gaps, Prestige/family boundaries, and `0.5.166` acceptance criteria. |
| Religion Knowledge Vocabulary And Validator Plan | `docs/design/religion-knowledge-vocabulary-validator-plan.md`; use for the exact `religion`/`deity` subject set, schema changes, nested resolver and duplicate rules, activation boundary, focused tests, and `0.5.168` acceptance criteria. |
| Religion Knowledge Domain Seed Content Plan | `docs/design/religion-knowledge-domain-seed-content-plan.md`; use for the exact two future Religion snippets, same-run activation decision, world religion authority mapping, validation plan, and deferred hotspot/favorability boundaries. |
| Religious Hotspot Knowledge Snippet Plan | `docs/design/religious-hotspot-knowledge-snippet-plan.md`; use for the blocked hotspot snippet decision, missing content-authority list, subject strategy, and non-runtime consequence/favorability boundaries. |
| Religious Hotspot Content Authority Plan | `docs/design/religious-hotspot-content-authority-plan.md`; use for the preferred `world.religious_hotspots` model, deferred `world.sacred_sites` specialization, candidate fields, descriptive enum posture, future-only Glasswake sketches, validation requirements, and favorability/alignment/consequence boundaries. |
| Religious Hotspot Content Authority Schema Plan | `docs/design/religious-hotspot-content-authority-schema-plan.md`; use for the exact future `world.religious_hotspots` schema, semantic-validator, focused-test, place-anchor coherence, religion/deity reference, descriptive enum, lint-count, and staged implementation contracts. |
| Religious Hotspot Content Authority Schema And Validator | `packages/schemas/world/religious-hotspot.schema.json`, `tools/content-lint/religious-hotspots.mjs`, and `tests/unit/religious-hotspots-validation.test.mjs`; use for the current strict hotspot wrapper/record schema, in-memory semantic validation, and focused proof coverage. |
| Religious Hotspot Content Authority Seed Plan | `docs/design/religious-hotspot-content-authority-seed-plan.md`; use for the selected first future planned hotspot records, omitted deity/order/faith-posture decisions, and future normal-lint registration path from 56 to 57 checked files. |
| Religious Hotspot Content Authority Seed | `packages/content/base/world/religious_hotspots.json`; use for the two live planned hotspot records and their validated place/religion authority. Normal lint registers the collection and reports 57 checked files. |
| Religious Hotspot Knowledge Subject Vocabulary Plan | `docs/design/religious-hotspot-knowledge-subject-vocabulary-plan.md`; use for direct `religious_hotspot` vocabulary, exact future schema and validator touchpoints, active-only live-snippet references, focused tests, and deferred sacred-site/order/favorability boundaries. |
| Religious Hotspot Knowledge Snippet Seed Plan | `docs/design/religious-hotspot-knowledge-snippet-seed-plan.md`; use for the one-record activation decision, first Tier 1 snippet posture, registry alignment timing, supported discovery sources, and 0.5.181/0.5.182 sequence. |
| Religious Hotspot Locality Snippet Decision | `docs/design/religious-hotspot-locality-snippet-decision.md`; use for the decision to keep locality coverage planned and unreferenced, the missing-authority criteria, forbidden claims, and the planning-only sacred-site authority next route. |
| Sacred Site Authority Plan | `docs/design/sacred-site-authority-plan.md`; use for the future separate named-site authority decision, parent-hotspot relationship, minimum fields, Knowledge sequencing, pilgrimage separation, and forbidden inferences. |
| Religion System Expansion Research Plan | `docs/design/religion-system-expansion-research-plan.md`; use for broad layered Religion architecture, future feature lanes, naming candidates, relationship guidance, research lessons, and staged sequencing. It does not override focused authority plans. |
| Sacred Site Authority Schema Decision | `docs/design/sacred-site-authority-schema-decision.md`; use for the future wrapper, paths, place-qualified identity, record fields, parent/place coherence, enums, status semantics, validation posture, and first-seed readiness. |
| Sacred Site Content Seed Plan | `docs/design/sacred-site-content-seed-plan.md`; use for the one planned Glasswake Shrine candidate, non-live draft, source proof, activation/Knowledge blockers, and 0.5.188 implementation boundary. |
| Sacred Site Knowledge Subject Decision | `docs/design/sacred-site-knowledge-subject-decision.md`; use for direct subject vocabulary, `world.sacred_sites` resolution, active-only eligibility, registry timing, snippet posture, focused tests, and later activation sequence. |
| Sacred Site Activation Decision | `docs/design/sacred-site-activation-decision.md`; use for Glasswake Shrine activation readiness, narrow active-status meaning, remaining snippet blockers, and the status-only 0.5.193 boundary. |
| Sacred Site Knowledge Snippet Seed Plan | `docs/design/sacred-site-knowledge-snippet-seed-plan.md`; use for the approved first snippet draft, named-site non-duplication boundary, active-text cleanup prerequisite, paired registry timing, and future validation. |
| Survival Builder RPG MMO Content Gap Audit | `docs/design/survival-builder-rpg-mmo-content-gap-audit.md`; durable documentation-only broad genre/system gap context for later roadmap planning. Do not treat it as a backlog replacement, runtime authority, or permission to broaden narrow prompts. |
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
