# Magic Study Authority Boundary Decision

Version: `Version 0.5.204 - Magic Study Authority Boundary Decision`

Status: approved documentation-only authority boundary

## 1. Decision Summary

Approve magic study as the next narrow implementation lane, beginning with a documentation-only schema decision for future `player.magic_study_sources`. Keep study policies as a separate follow-up authority rather than combining requirements/evidence rules into source identity.

Activate Arcane Lore only after the study-source schema decision and a separate activation-readiness check; activation is not a prerequisite for designing the source contract. Preserve the existing spell catalog, character-scoped known-spell ownership, Knowledge, trials, item metadata, world magic infrastructure, and Prestige owners.

Spell identity, study access, study evidence, Knowledge understanding, known-spell ownership, cast readiness, and casting execution remain separate. New first-pass magic-study records must reject runtime, gameplay, reward, mutation, player-state, storage, and UI fields.

This document consumes `docs/dev/tmp-magic-knowledge-study-systems-research-2026-06-20.md` as planning input, corrects it against the live repository, and does not make that temporary artifact canon.

## 2. Live Repo Reality

The live repository already has substantial but deliberately separated magic foundations:

- `packages/content/base/player/spells.json` contains 55 authored spell records under the existing strict spell schema and magic metadata validation.
- `packages/engines/game-engine/src/known-spells.ts` owns pure character-scoped known-spell validation, read-only projection, training-event acquisition proposals, cast-readiness blockers, resolver-readiness checks, and inert output envelopes. Its supported live owner scope is `character`, and its acquisition route is `training_event`.
- Known-spell helpers propose records from explicit evidence but do not persist or mutate player state.
- `knowledge_domain.arcane_lore` exists only as `planned` registry metadata. It has null policy references, no live `knowledge_domains.json` record, and no snippets.
- Knowledge schema vocabulary includes `spell`, but the live Knowledge snippet validator currently blocks spell subjects. Arcane Lore activation therefore cannot imply usable spell snippets.
- `world.magic_infrastructure` has four descriptive service/infrastructure records. It is not institution, teacher, study-source, known-spell, or runtime authority.
- Current trials include a magic mastery record with authored checkpoints/rewards/penalties, while the broader Knowledge trial policy framework exists separately. Neither proves a magic-study source or acquisition route.
- Items already carry validated conduit/catalyst metadata, and spells carry compatibility metadata. Those fields are metadata/current readiness inputs, not study access or item-consumption authority.
- Existing character/account recognition and Family Prestige owners exist outside magic. There is no magic Prestige or recognition authority.

No `magic_study_sources`, `magic_study_policies`, ritual authority, authored generic institution/teacher collection, player spellbook state, or persisted study-progress collection exists.

## 3. Magic Authority Ownership Boundary

Magic authority remains layered:

- spell catalog owns authored spell identity and compatibility metadata;
- study sources own stable opportunities or materials that can provide access to study;
- study policies own prerequisites, process/evidence posture, and completion criteria;
- study evidence records what happened without itself granting ownership;
- Knowledge owns discovered understanding;
- known-spell records own explicit character-scoped spell ownership;
- readiness helpers determine whether an owned spell is eligible for a later cast attempt;
- future runtime owners execute casting, costs, cooldowns, effects, and mutation.

Rituals, institutions/teachers, items/crafting, Religion, trials, Prestige, and player state keep separate owners. A reference between layers does not transfer authority or trigger behavior.

## 4. Spell Catalog Boundary

The existing player spell catalog remains canonical for authored spell identity, family/school classification, descriptive casting metadata, compatibility posture, and resolution-hook metadata.

Spell records must not own player-known state, access eligibility, study progress, study evidence, teacher/institution access, spellbook slots, preparation, attunement, cooldowns, fatigue, Prestige, rewards, or acquisition events. A catalog record's existence, compatibility status, Knowledge visibility, item compatibility, or Arcane Compendium presentation does not make a spell known or cast-ready.

No spell catalog or spell schema change is authorized here.

## 5. Known-Spell Ownership Boundary

Known-spell ownership remains explicit, character-scoped, and evidence-gated. The current pure helper boundary supports `ownerScope: "character"`, `training_event` acquisition evidence, available/blocked state, collection validation, read-only projection, and non-mutating acquisition proposals.

Known-spell ownership must remain separate from study access and study evidence. Access to a source permits a possible study path; evidence records a supported event; only a separately validated acquisition boundary may propose a known-spell record. Study source, policy, Knowledge, trial, item, institution, teacher, Religion, family, Legacy, or Prestige records must not directly create or imply ownership.

This decision does not persist known-spell records, add acquisition routes, or change readiness behavior.

## 6. Arcane Lore and Knowledge Boundary

Arcane Lore owns informational understanding of spells, materials, practices, institutions, history, risks, and ritual context after activation. Knowledge snippets remain informational and must never grant spell access, study completion, known-spell ownership, spell readiness, Prestige, recognition, rewards, favorability, alignment, services, items, or runtime behavior.

Arcane Lore should activate after the magic-study source schema decision, not before it. A later activation-readiness decision must address its currently planned status, absent live domain/snippet records, blocked `spell` snippet subjects, skill linkage, and null trial/completion/visibility policies. Activation must not be bundled with study-source schemas or content.

Knowledge evidence may later inform study-policy prerequisites or record understanding, but Knowledge progress is not study access or acquisition evidence by default.

## 7. Magic Study Source Boundary

Future `player.magic_study_sources` is the first schema-decision target. A study source owns stable authored access context such as source identity, source mode/kind, supported spell or subject references, access posture, sponsor/holder references when canonical owners exist, descriptive availability, provenance, and notes.

Potential source modes include books, scrolls, tomes, teacher instruction, institutional study, supervised practice, observation, ritual participation, sacred-site context, or experimental study only when their source owners and canon support them.

A source does not own prerequisites, completion thresholds, evidence acceptance rules, known-spell grants, trial execution, item consumption, study progress, player availability, readiness, rewards, or casting. The schema decision must begin with sources whose referenced authorities already exist and must not use free-form institution/teacher ids as substitutes for missing canonical owners.

## 8. Magic Study Policy / Study Path Boundary

Future `player.magic_study_policies` should remain separate from study sources. A policy owns reusable prerequisite and evidence posture: required Knowledge/skills, supported study modes, optional trial references, required evidence categories, sequencing/checkpoint description, failure/blocked posture, and completion semantics.

The first schema decision should target sources only, not a combined source-and-policy model. Separating them avoids duplicating requirements across books, teachers, institutions, and other sources and prevents a source record from becoming an executable study workflow.

A source may later reference a policy after both contracts exist. Policies must not track attempts/progress, execute trials, grant spells, spend items, award Prestige/rewards, mutate state, or run gameplay.

## 9. Ritual Authority Boundary

Rituals are a separate future authority from ordinary spells, study sources, and study policies. A ritual may later describe a high-ceremony procedure, participants/roles, place/time/material context, associated spell/lore references, risks, provenance, and cultural/religious context.

Knowledge `ritual_use` vocabulary, an item name, a trial, a `cast.ritual` action label, or world infrastructure does not establish canonical ritual records. Ritual participation may later be a study source or evidence type, but it must not collapse ritual identity into the source record.

No ritual schema, execution, cost, effect, reward, favor, alignment, or state is authorized here.

## 10. Trial and Challenge-Gate Boundary

Existing trial content and Knowledge trial policies retain challenge-gate authority. A future study policy may reference a canonical trial as a prerequisite or accepted evidence only after exact compatibility is decided.

Trials remain separate from source access, study evidence, known-spell ownership, and casting readiness. Existing trial reward/penalty metadata is unchanged and does not authorize a magic-study record to execute the trial, apply rewards/penalties, unlock mastery, grant a spell, award Prestige, or mutate progress.

No trial schema, content, policy, readiness, attempt, cooldown, checkpoint, outcome, or execution change is authorized here.

## 11. Prestige and Recognition Boundary

Prestige and recognition remain outside magic throughout `0.5.x`. Existing character/global recognition rules, Family Prestige transactions, civic/faction reputation planning, guild/institution standing, and descriptive prestige labels keep their own owners.

Magic-study sources and policies must not require, spend, award, transfer, multiply, or mutate Prestige; use recognition as spell access; or create magical rank/reputation state. A later recognition-authority decision is required before magic may reference a canonical recognition category mechanically.

Descriptive renown or historical reputation may appear only as prose/provenance and must not be interpreted as a gate or reward.

## 12. Religion, Sacred Sites, and Magic Boundary

Religion, religious hotspots, and sacred sites retain their current descriptive authorities. They may later be referenced as study context, ritual setting, lore association, sponsor, restriction, or source anchor after a dedicated decision.

Religious Knowledge, deity links, hotspot dominance, sacred-site visits, pilgrimage, orders, favor, or alignment must not grant study access, evidence acceptance, known spells, readiness, items, rewards, or casting. Divine or Druidic spell catalog classification does not transfer spell ownership to Religion records.

No Religion registry/snippet, sacred-site, hotspot, favorability, alignment, service, pilgrimage, or gameplay change is authorized here.

## 13. Institutions, Guilds, and Teachers Boundary

Magical institutions must wait for generic authored institution authority. Existing derived settlement institution profiles and `world.magic_infrastructure` are not canonical institution identities. Existing `civilization.guilds` retains guild identity and must not be duplicated as a magic-study institution.

Canonical teacher references should likewise wait for an explicit person/NPC/teacher authority. Until those owners exist, study-source decisions may define reference posture or source kinds but must not seed free-form institution, teacher, mentor, lineage, or school identities.

Institutions, guilds, teachers, religions, and families may later sponsor or host sources; they must not directly own spells, grant known-spell records, mutate membership/standing, provide services, or bypass study/evidence requirements.

## 14. Items, Crafting, Alchemy, and Magical Tools Boundary

Items retain physical identity and existing conduit/catalyst compatibility metadata. Spells retain their compatibility requirements. Magic-study sources may reference canonical item ids or metadata without item consumption or runtime behavior when the later schema explicitly permits it.

A reference may describe a book, scroll, tome, focus, conduit, catalyst, reagent, tool, or required material context. It must not consume/deplete items, mutate inventory, create documents, craft/enchant equipment, resolve recipes, calculate prices, grant temporary casting, or prove known-spell ownership.

Crafting owns transformations/recipes, economy owns value/availability, alchemy requires its own authority, and runtime casting later owns checks/consumption. Magical books/tomes, scrolls, and enchanter-authored documents remain deferred until the study source and relevant item/document owners exist.

## 15. Player Runtime Magic State Boundary

Future player runtime/save owners may track persisted known spells, spellbook/loadout, study access, attempts/progress/evidence, trial state, preparation, attunement, readiness, cooldowns, costs, catalysts, fatigue/strain, restrictions, casting history, and outcomes.

Static spell, Knowledge, source, policy, ritual, infrastructure, institution, item, or trial content must not store mutable player state. Current pure known-spell/readiness/acquisition-proposal helpers remain non-mutating foundations and do not authorize persistence or casting execution.

Player spellbook state, study mechanics, spell access mutation, readiness mutation, and spellcasting runtime remain deferred to `0.6+`.

## 16. First Implementation Candidate

Magic study is the next narrow implementation lane. The first implementation candidate is future `player.magic_study_sources`, beginning with a documentation-only schema decision rather than a schema file.

Sources come first because the live repository already has spell identity, character-known ownership/evidence helpers, Knowledge vocabulary, item metadata, trials, and world magic infrastructure, but no canonical authored owner for stable study access. Source identity can be decided without activating Arcane Lore or implementing policies/runtime.

The candidate does not authorize schema, validator, content, test, loader, Knowledge, runtime, UI, storage, reward, or gameplay changes.

## 17. Future Validation Direction

Later schema and validator work should be staged separately and eventually enforce:

1. strict records-only wrappers and canonical source id/slug agreement;
2. supported source modes/kinds and stable descriptive status/provenance;
3. valid active spell, item, world-infrastructure, Religion/place, guild, institution, teacher, trial, and Knowledge references only after each owner is explicitly supported;
4. no free-form institution/teacher/person ids as substitutes for missing authority;
5. no embedded policy prerequisites/evidence rules in source identity once policy authority exists;
6. policy references and subject/source compatibility only after the policy contract exists;
7. Knowledge references remain informational and do not imply access, evidence, ownership, readiness, Prestige, or rewards;
8. known-spell ownership remains character-scoped and requires separately validated acquisition evidence;
9. item references remain non-consuming and non-mutating;
10. no ritual execution, trial execution, Prestige, favor/alignment, reward, spellbook, study-progress, readiness, casting, inventory, runtime, storage, UI, command, event, or gameplay fields.

No schema, validator, test, content, or content-lint change is authorized by this decision.

## 18. Temporary Research Artifact Handling

`docs/dev/tmp-magic-knowledge-study-systems-research-2026-06-20.md` was consumed as planning input and remains temporary, not final canon.

Keep it through the next magic-study source schema-decision pass because it contains candidate fields and later policy, Arcane Lore activation, ritual, institution/teacher, item/document, trial, Prestige, and runtime questions not fully promoted here. That pass must delete it if all useful guidance is promoted, or retain it only with a named next concrete consumer and removal condition.

## 19. Non-Goals

- no schema, validator, content JSON, test, Knowledge registry, or snippet changes;
- no religion, economy, family, civic, travel, or geography authority changes;
- no runtime system, UI, storage, spellcasting, spell-access mutation, known-spell grant, spellbook, study-progress, trial-execution, Prestige, reward, favor, alignment, command, event, or gameplay behavior;
- no item consumption/reagent depletion, cooldown, attunement, magical fatigue, preparation, readiness mutation, crafting, alchemy, ritual execution, institution/teacher content, or acquisition-route expansion;
- no migration, compatibility alias, data rename, or transition to `0.6.0`.

## 20. Next Recommended Version

`Version 0.5.205 - Magic Study Source Schema Decision`

That run should remain documentation-only and decide the exact `player.magic_study_sources` paths, wrapper, ids, source modes/kinds, supported subject/reference model, descriptive status/provenance, future policy-reference posture, forbidden fields, validation ownership, Arcane Lore sequencing, and temporary-artifact cleanup without implementation.
