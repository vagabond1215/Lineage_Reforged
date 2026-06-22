# Magic Study Source Schema Decision

Version: `Version 0.5.224 - Magic Study Source Schema Decision`

Status: approved documentation-only schema posture

## 1. Decision Summary

Approve future `player.magic_study_sources` as the static authored authority for stable opportunities, materials, providers, and contexts that can make magical study possible. A source describes access and context only. It does not grant a spell, create a known-spell record, write a spellbook entry, establish readiness, apply Knowledge progress, complete a trial, award Prestige, consume an item, execute a ritual, or mutate player/runtime state.

Keep future `player.magic_study_policies` separate. The first source schema must not include a policy reference because no policy contract exists yet. Add such a reference only after a dedicated policy decision and schema define its meaning.

The first contract uses typed source modes/kinds, typed subject references, typed source anchors, lifecycle status, provenance, and descriptive notes. Active records must fail closed when the referenced authority is missing or inactive. Free-form institution, teacher, mentor, person, lineage, school, tradition, ritual, or document ids are forbidden substitutes.

No schema, validator, content, test, loader, lint registration, Knowledge activation, Arcane Lore snippet, policy, ritual, institution/teacher, item/document, runtime, UI, storage, migration, reward, command, event, or gameplay change is authorized by this decision.

## 2. Live Repo Reality

- `player.spells` contains 55 authored spell records with ids, school/tradition/discipline metadata, primary families, compatibility status, item compatibility, cast descriptors, and resolution hooks.
- Known-spell helpers are character-scoped and accept only `training_event` acquisition. They validate/propose records and read-only readiness projections without persistence or broad acquisition routes.
- `knowledge_domain.arcane_lore` exists only as planned registry metadata. Its skill already resolves through `skill.knowledge.arcane_lore.knowledgeDomainId`, correcting stale notes that still describe that link as future.
- Arcane Lore has no live legacy knowledge-domain policy record, no snippets, and null trial/completion/visibility policy references. The Knowledge snippet schema names `spell`, but semantic activation/reference support remains blocked for the planned domain.
- Four general trials exist, including `trial.magic.elemental.mastery`; its authored checkpoints, rewards, and penalties do not establish study-source or study-policy authority.
- `world.magic_infrastructure` contains four `magic_service.*` descriptors. These are infrastructure/service categories, not institutions, teachers, rituals, study execution, or player access grants.
- Items contain blank/reference books and scroll substrates, seven conduit profiles, three catalyst profiles, and many reagent/crystal/focus candidates. No canonical magical book, teaching scroll, tome, grimoire, or enchanter-authored document authority exists.
- One sacred site is active and one religion exists. Sacred-place and religious context do not grant magic access, spell ownership, favor, alignment, or ritual authority.
- No authored magic-study source, study policy, ritual, general institution, teacher, mentor, magical document, or study-state collection exists.
- Current casting/readiness helpers remain pure or inert foundations; they do not execute casting, consume catalysts, persist study, or grant spells.

The temporary research correctly identifies the access gap but predates several live facts, including the landed Arcane Lore skill link and the current narrow known-spell acquisition route. Live authority controls this decision.

## 3. Existing Magic, Knowledge, Spell, Study, Trial, Item, Infrastructure, and Runtime Surface Inventory

Current owners remain distinct:

- spells own authored spell identity and compatibility metadata;
- known-spell records/helpers own character-scoped ownership evidence and read-only readiness, currently through `training_event` only;
- Knowledge registry/snippet/evidence/progress/completion/trial-policy layers own informational understanding and inert progression contracts;
- trials own authored challenge definitions or separate Knowledge eligibility/readiness policy;
- items own item identity, conduit/catalyst compatibility, and physical document substrates;
- world magic infrastructure owns descriptive service/infrastructure categories;
- religions, religious hotspots, and sacred sites own religious/place context;
- future people/NPCs own canonical teacher identity only after records exist;
- future institutions and rituals own their respective identity;
- player/session/save/runtime layers own access state, attempts, progress, evidence acceptance, ownership, readiness, casting, costs, history, and outcomes.

No current collection should be renamed, split, migrated, or absorbed into magic-study sources.

## 4. Magic Study Source Collection Posture

`player.magic_study_sources` is the future static authored source/access descriptor collection.

A record represents one stable authored study opportunity such as a particular magical text, a canonical instructor offering, an institutional curriculum context, supervised practice arrangement, repeatable observation context, ritual-participation context, sacred-site study context, or bounded experimental program.

It does not represent the player's copy of an item, a teacher appointment, a scheduled lesson, an active study attempt, a discovered source, eligibility, progress, evidence, completion, reward, or spell acquisition.

Sources remain player-domain content because they describe possible player study access, while their referenced spell, item, place, provider, institution, ritual, and trial authorities retain their own namespaces.

## 5. Candidate Paths, Wrapper, Ids, Slugs, and Record Lifecycle

Approve these future paths and identity rules:

- content: `packages/content/base/player/magic_study_sources.json`;
- schema: `packages/schemas/player/magic_study_source.schema.json`;
- logical collection: `player.magic_study_sources`;
- wrapper: strict object with exactly `records` in the first pass;
- record id: `magic_study_source.<slug>`;
- slug: lower snake case matching the id suffix;
- record lifecycle `status`: `planned`, `active`, or `retired`.

`planned` means an authored candidate that must not be treated as available. `active` means the static descriptor and all required references are valid; it still does not mean a particular character currently has access. `retired` preserves authority/history without offering new access. Lifecycle status must not be conflated with player discovery, eligibility, availability, progress, completion, or ownership.

## 6. Minimum Source Record Contract

Approve this future minimum record posture:

- `id`: required `magic_study_source.<slug>`;
- `slug`: required matching lower-snake-case slug;
- `name`: required authored source name;
- `summary`: required short descriptive purpose;
- `sourceMode`: required high-level access mode;
- `sourceKind`: required concrete kind compatible with the mode;
- `subjectRefs`: required non-empty typed array of what may be studied;
- `sourceAnchorRefs`: required non-empty typed array of canonical materials, providers, places, or contexts that constitute the source;
- `accessPosture`: required `context_only` or `study_candidate`;
- `status`: required `planned`, `active`, or `retired`;
- `sourceAuthorityNotes`: required non-empty provenance/authority notes;
- `notes`: required descriptive notes array, empty when none.

Do not add prerequisites, required ranks, costs, durations, attempt limits, checkpoints, success/failure, evidence requirements, unlocks, rewards, progress, ownership, readiness, or runtime availability. Those belong to policies or runtime state.

## 7. Source Mode and Source Kind Vocabulary

Approve the following first-contract mode vocabulary:

- `textual_study`;
- `instruction`;
- `institutional_study`;
- `supervised_practice`;
- `observation`;
- `ritual_context`;
- `experimental_study`.

Approve these compatible source kinds:

- `book`, `scroll`, `tome`, `grimoire`, and `authored_document` under `textual_study`;
- `teacher_instruction` under `instruction`;
- `institutional_curriculum` under `institutional_study`;
- `guided_exercise` under `supervised_practice`;
- `field_observation` and `combat_observation` under `observation`;
- `ritual_participation` and `sacred_site_context` under `ritual_context`;
- `controlled_experiment` under `experimental_study`.

This vocabulary defines descriptor kinds, not current implementability. Active textual sources require a canonical authored document/item owner beyond a blank substrate. Active teacher sources require canonical person/provider authority. Active institutional curricula require institution authority. Active ritual participation requires ritual authority. Until those owners exist, such records must remain absent or `planned` and unresolved; free-form ids are not allowed.

Observation kinds describe a stable authored observation opportunity, not an observation event or accepted Knowledge evidence. `combat_observation` does not execute combat. `sacred_site_context` does not grant religious or magical access.

## 8. Subject and Reference Model

Use tagged references rather than generic ids.

First-contract `subjectRefs` may support:

- `spell` with canonical `spell.*` id;
- `spell_family` with a current validated spell primary-family token;
- `spell_school` with a current validated spell `school` token;
- `knowledge_domain` with canonical active Knowledge-domain id.

Do not introduce separate spell-family or spell-school collections in this pass. Their tokens remain validated projections of the live spell catalog. A future dedicated tradition/domain authority may replace or supplement those branches only through a later decision.

First-contract `sourceAnchorRefs` may support typed branches for:

- `item` using canonical `itemKey`;
- `magic_infrastructure` using canonical `magic_service.*` id;
- `sacred_site` using canonical active sacred-site id;
- `guild` using an existing canonical guild slug/id form approved by its owner;
- `person` and `npc` only after active authored records exist;
- `institution` only after an institution authority exists;
- `ritual` only after a ritual authority exists;
- `trial` only after exact trial compatibility is approved.

Active records must resolve every branch against its owner and any active-status rule. Unsupported or absent branches fail closed. Religion ids, religious-hotspot ids, regions, settlements, workplaces, services, items, Knowledge snippets, trials, teachers, institutions, and rituals must not be smuggled through notes or generic strings.

## 9. Access vs Ownership Boundary

A source record states that an authored study path or context exists. `context_only` means it provides descriptive context without claiming a study route. `study_candidate` means a later policy/runtime layer may evaluate it as a candidate route.

Neither posture grants access to a character. Sources must not:

- create or update known-spell records;
- add spellbook/loadout entries;
- mark spells available, learned, prepared, attuned, or ready;
- create study attempts, progress, evidence, completion, or cooldowns;
- grant items, Knowledge, trials, rewards, Prestige, recognition, favor, alignment, reputation, standing, services, or access;
- execute casting, rituals, item use, consumption, crafting, or inventory mutation.

Only later explicit policy, evidence, acquisition, runtime, and persistence owners may act on source references.

## 10. Study Source vs Study Policy Boundary

Keep `player.magic_study_policies` separate and deferred.

A future policy may own prerequisites, allowed modes, skill/Knowledge thresholds, evidence categories, trial gates, ordering/checkpoints, repeatability, failure/block posture, and completion semantics. A source owns none of those.

The first source contract must not contain `studyPolicyId`, `policyRef`, inline prerequisites, evidence rules, trial rules, progress rules, or completion rules. A later policy schema decision may add an optional typed source-to-policy reference only after it answers cardinality, compatibility, lifecycle, and validation ownership.

This avoids inventing placeholder policy ids or allowing source records to become executable policy bundles.

## 11. Arcane Lore and Knowledge Sequencing

Do not activate Arcane Lore in this pass.

The Arcane Lore skill link is already live. A later activation-readiness decision must still resolve:

- planned registry status;
- absence of a live legacy `knowledge_domains` Arcane Lore record where that layer remains required;
- zero Arcane Lore snippets;
- semantic support for `spell` and any other intended subjects;
- active source records and discovery-source compatibility;
- null trial, completion, and visibility policy references or an explicit allowed-null posture;
- exact first snippet subjects, evidence sources, and non-ownership language.

Magic-study source schema/validator work may land while Arcane Lore remains planned. Source content and Arcane Lore activation require their own later seed/readiness decisions. Knowledge remains informational and cannot grant magic access, ownership, readiness, Prestige, rewards, or behavior.

## 12. Spell Catalog and Known-Spell Ownership Boundary

The 55-record spell catalog remains canonical for spell identity, classification, compatibility, targeting, cast metadata, and hooks. Sources reference spells; they do not duplicate spell fields.

Known-spell ownership remains character-scoped and currently accepts only validated `training_event` acquisition evidence. A magic-study source is not a training event and does not expand `KnownSpellAcquisitionRoute`.

Any future `magic_study` acquisition route requires a dedicated acquisition-evidence decision and helper pass after source and policy contracts exist. It must not be inferred from source status, Arcane Lore completion, trial success, item possession, teacher/institution references, sacred-site presence, or study progress.

Current readiness and resolver helpers remain pure/inert. Source records must not alter their blockers, hook support, conduit/catalyst requirements, resource policy, or execution behavior.

## 13. Item, Document, Catalyst, Conduit, Crafting, Alchemy, and Enchantment Boundary

Items retain canonical physical identity through `itemKey`. Existing blank books/scrolls and reference books are substrates or generic goods, not magical study documents. Existing conduit/catalyst profiles are compatibility metadata, not study access.

Future magical books, scrolls, tomes, grimoires, and enchanter-authored documents require explicit authored item/document content before an active textual source can reference them. A source descriptor must not turn a blank book or scroll into a spell-bearing document.

Focuses, conduits, catalysts, crystals, reagents, and tools may later appear as typed context anchors when relevant, but source records must not consume/deplete them, reserve inventory, grant casting, attune items, create charges, transform items, craft, repair, salvage, perform alchemy/enchantment, calculate prices, or generate documents.

Crafting owns transformations, items own physical identity/metadata, economy owns value/availability, and runtime owns inventory and consumption. Magical books/tomes, magical scrolls, and enchanter-authored arcane documents remain required deferred topics until source plus item/document authority exists.

## 14. Ritual, Trial, Institution, Teacher, Religion, Sacred Site, Prestige, and Recognition Boundary

`ritual_participation` is a future study-source kind, not ritual identity or execution. No active ritual-participation source may exist until a ritual authority defines canonical ids. `cast.ritual`, Knowledge `ritual_use`, a religious service label, a spell, or a trial does not create a ritual record.

Trials may later be typed challenge-context anchors only after a compatibility decision. Sources must not start trials, evaluate checkpoints, mutate progress, apply penalties, or grant trial rewards. The current elemental mastery trial is not automatically a study source.

Teacher instruction requires a canonical active `personId` and, if the interaction layer matters, an approved NPC reference. Institution study requires a canonical institution authority. Guilds and `world.magic_infrastructure` do not substitute for institutions or teachers. Free-form names, mentor ids, lineages, schools, roles, offices, quest contacts, and prose are invalid substitutes.

Religion, religious hotspots, and sacred sites may provide typed context only. They must not grant study access, spell ownership, ritual identity, favor, alignment, services, rewards, or divine/druidic spell access.

Prestige and recognition remain separate account/family/progression authorities. Sources must not require, spend, award, multiply, or mutate Prestige or recognition.

## 15. Player Runtime, Save-State, UI, Reward, Command, Event, and Gameplay Boundary

Runtime/player/session/save owners retain discovered/available sources, eligibility, attempts, progress, evidence, completion, known spells, spellbook/loadout, preparation, attunement, readiness, cooldowns, costs, catalysts, inventory, fatigue/strain, restrictions, casting history, outcomes, trial state, rewards, and UI projections.

Static source records must reject:

- owner/character ids, discovery state, availability state, progress, evidence, attempts, timers, cooldowns, completion, result, or history;
- known-spell grants, acquisition records, spellbook mutation, preparation, readiness, casting, costs, target state, active effects, or resolver output;
- trial execution/results, Prestige awards/costs, recognition, favor/alignment, reputation/standing, religious effects, services/access, rewards, item-instance/inventory mutation, or crafting outputs;
- UI state, storage/save state, migrations, commands, events, emitted effects, or gameplay behavior.

Authored status and access posture remain descriptive content fields, not runtime facts.

## 16. Future Schema and Validator Direction

`Version 0.5.236 - Magic Study Source Schema And Validator` remains the conditional implementation candidate after the docs-first queue.

That pass should create the strict schema, a pure semantic validator, and focused in-memory tests only. It should not add live source content, loaders, normal content-lint registration, Arcane Lore activation, Knowledge snippets, policies, rituals, institutions/teachers, acquisition routes, runtime state, UI, storage, or behavior.

Future validation should enforce:

1. strict records-only wrapper;
2. unique `magic_study_source.<slug>` ids/slugs and exact suffix agreement;
3. allowed lifecycle, access posture, mode, and mode-compatible kind vocabulary;
4. non-empty typed subject and source-anchor arrays with duplicate rejection;
5. spell ids and current spell-family/school tokens resolve against the live catalog;
6. Knowledge domains, items, infrastructure, sacred sites, guilds, people/NPCs, institutions, rituals, and trials resolve only when their branch and lifecycle are explicitly supported;
7. active records fail on planned, retired, missing, unsupported, or free-form references;
8. item branches use canonical `itemKey`;
9. no source-policy reference before policy authority exists;
10. access does not imply ownership, evidence, readiness, completion, reward, or execution;
11. forbidden runtime, persistence, UI, mutation, command, event, and gameplay fields are rejected.

After `0.5.236`, source seed planning and Arcane Lore activation/readiness remain separate docs-first passes.

## 17. Temporary Research Artifact Handling

Delete `docs/dev/tmp-magic-knowledge-study-systems-research-2026-06-20.md` in this pass.

Its useful spell, known-spell, Arcane Lore, source, policy, ritual, trial, Prestige, religion, institution/teacher, item/document, validation, authored/generated, and runtime boundaries are now permanently owned by `docs/design/magic-study-authority-boundary-decision.md`, this decision, and the future-content backlog. No named future consumer remains.

Future magic-study work must start from permanent design docs and a fresh live-repo audit rather than restoring or treating the temporary report as canon.

## 18. Non-Goals

- no schema, validator, content JSON, test, loader, normal lint registration, or migration changes;
- no Arcane Lore activation, registry/snippet/evidence/progress/completion/trial/readiness-policy behavior, or spell catalog changes;
- no known-spell acquisition-route expansion, ownership mutation, spellbook, readiness, casting, or resolver behavior;
- no source seed, study policy, ritual, institution, teacher/person/NPC, magical document, book, scroll, tome, grimoire, or enchanter-document implementation;
- no item consumption, catalyst depletion, reagent use, crafting, alchemy, enchantment, inventory mutation, trial execution, rewards, Prestige, recognition, favor, alignment, reputation, standing, service, or access mutation;
- no runtime, save-state, storage, UI, command, event, emitted effect, or gameplay behavior;
- no new Deep Research and no transition to `0.6.0`.

## 19. Next Recommended Version

Proceed with `Version 0.5.225 - Polity Schema Decision`.

That run remains documentation-only. It should define the future descriptive polity identity contract, preserve government/jurisdiction/law/faction/institution/runtime owners, and decide the civic temporary research artifact's retirement.

No new GPT Deep Research is required before `0.5.225`. GPT-DR gates remain non-Codex labels, and permanent prompt-pack guidance does not interrupt the immediate numbered queue.
