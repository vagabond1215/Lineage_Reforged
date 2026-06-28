# First People And NPC Content Seed Plan

Source version/run: Version 0.5.246 - First People And NPC Content Seed Plan
Date: 2026-06-28
Status: approved documentation-only seed plan; no live people or NPC content

## 1. Decision Summary

`Version 0.5.246` is documentation-only. It approves a future first content seed pass for `civilization.people`, but it does not create people or NPC content now.

The recommended first live seed posture is people-only first. NPC overlays should be deferred from the first live seed because the current audit did not find explicit stable canon for authored presence and interaction posture beyond quest-contact strings, organization labels, settlement projections, and generated operator placeholders.

A later seed may add NPC overlays only after matching canonical person records exist and a fresh audit proves the overlay can be represented solely by `presenceMode`, optional `primarySettlementId`, `interactionPosture`, `status`, provenance, and notes. Until then, a person may exist without an NPC overlay, and an NPC overlay may not exist without a resolvable `personId`.

This pass does not approve live `people.json` or `npcs.json`, normal content-lint registration, quest-contact migration, legacy `npc.*` normalization, generated people, settlement operator changes, social roles, relationships, schedules, dialogue, services, Knowledge changes, runtime behavior, UI, storage, commands, events, rewards, or gameplay implementation.

## 2. Current Schema And Validator Reality

Current landed contract:

- `civilization.people` is the future canonical named-person identity collection.
- Future people content path remains `packages/content/base/civilization/people.json`.
- Person schema exists at `packages/schemas/civilization/person.schema.json`.
- `civilization.npcs` is the future optional authored presence/interaction overlay keyed to canonical people.
- Future NPC content path remains `packages/content/base/civilization/npcs.json`.
- NPC schema exists at `packages/schemas/civilization/npc.schema.json`.
- Pure validator helper exists at `tools/content-lint/people-npcs.mjs`.
- Focused tests exist at `tests/unit/people-npc-validation.test.mjs`.
- Schema-file parse registration exists in `tests/unit/schema-files.test.mjs`.
- No live `packages/content/base/civilization/people.json` exists.
- No live `packages/content/base/civilization/npcs.json` exists.
- No normal content-lint registration exists in `tools/content-lint/index.mjs`.
- People and NPCs remain future-contract validation only.

Current person records require strict `records` wrapper content with `person.<slug>` ids, matching lower-snake-case `slug`, `name`, `aliases`, `summary`, `lifeStatus`, `status`, `sourceAuthorityNotes`, and `notes`. Optional `lineageId` is supported by the schema, but should be used only when a current validator-supplied lineage authority is explicit. The live repo does not currently have `packages/content/base/player/lineages.json`; observed `lineage.*` data is player ancestry/species metadata, not person genealogy proof.

Current NPC records require strict `records` wrapper content with `npc.<person-slug>` ids, `personId`, `presenceMode`, `interactionPosture`, `status`, `sourceAuthorityNotes`, and `notes`. Optional `primarySettlementId` is the only first-pass external anchor and must remain a broad authored association, not a current location, residence, schedule, service area, or spawn point.

The validator currently proves strict wrappers, supported schema structure, unique person ids/slugs, exact person id/slug coherence, optional lineage resolution when lineages are supplied, unique NPC ids and person ids, required NPC person resolution, NPC id/personId suffix agreement, optional settlement resolution when settlements are supplied, one overlay per person in the first pass, and rejection of forbidden person/NPC fields.

## 3. Current Content Audit Summary

This pass inspected the current person and NPC schema files, validator helper, focused tests, schema registration, normal content-lint index posture, quest definitions, quest archetypes, settlements, guilds, religion and religious-site content, player lineage/ancestry usage, Knowledge content, settlement operator projections, and player/account/runtime character surfaces.

Current audit findings:

- `packages/content/base/civilization/people.json` is absent.
- `packages/content/base/civilization/npcs.json` is absent.
- `tools/content-lint/index.mjs` does not import `people-npcs.mjs` or register people/NPC content.
- Five quest definitions have free-form contact names: Harbormaster Sel Varn, Foreman Mira Kell, Archivist-Provost Lysa Mar, Inspector Halwen Crest, and Corin Ash.
- One quest definition uses `entityId: "npc.corin_ash"`, but this legacy-shaped string is not backed by a person or NPC record.
- Quest archetypes include `typicalGiverTypes` such as `individual`, but those are structural template labels, not canonical people.
- Settlements include guild presence, institutions, population, racial mix, and descriptive place fields, but no named-person authority.
- Generated settlement institution/property projections use `npc_individual` and `npc_household` operator types and generated operator ids; these are not authored people, households, or NPC overlays.
- Religion content defines religions, deities, and religious orders as their own authority labels. Current canon does not treat those labels as people.
- Knowledge registry and snippets use character/teacher/source vocabulary and Religion subjects, but they do not provide person/NPC subject support or named teacher records.
- Player/account/runtime surfaces own created character identity, account history, player ids, and runtime state; they are not canonical `civilization.people`.
- The retired temporary artifact `docs/dev/tmp-npc-social-systems-research-2026-06-20.md` is absent, matching its retirement in `0.5.223`.

The audit found no safe live person candidates that are explicit canon beyond weak contact strings or generated placeholders. The future live seed should either use a separately approved canonical named-person list or delay content until such canon is authored.

## 4. First Seed Scope

The first actual people/NPC content seed should include only people records.

Recommended first seed rules:

- include only explicitly canonical named people already supported by stable authored canon;
- keep records small, auditable, and descriptive;
- use `status: "planned"` by default;
- use `lifeStatus: "unknown"` unless canon explicitly proves `living` or `deceased`;
- use `aliases: []` unless alternate identity labels are explicit canon;
- use `lineageId` only when current lineage authority is explicit and validator-supported in that seed;
- write short public identity summaries only;
- use `sourceAuthorityNotes` to cite why each person is canonical;
- use `notes` to state that no role, workplace, relationship, schedule, dialogue, service, runtime, UI, storage, reward, or gameplay authority is created.

The first seed should not include NPC overlays. If a future prompt insists on overlays, the safe fallback is to reject or skip any overlay whose evidence does not prove stable authored presence and interaction posture under the current NPC schema.

## 5. Candidate Evidence Policy

Allowed evidence:

- explicit canonical content records or design docs naming a person as a stable authored named person;
- explicit canonical lineage references when a validator-supported lineage source is supplied;
- explicit stable settlement association only for optional future NPC `primarySettlementId`;
- explicit textual canon that can be cited in `sourceAuthorityNotes`.

Insufficient evidence by itself:

- quest contact display names;
- `entityId: "npc.*"` strings;
- generated settlement operators;
- runtime `npc_individual` or `npc_household` operator ids;
- workplace jobs;
- roles, titles, offices, guild labels, religion labels, order labels, deity labels, or settlement labels;
- combatant ids;
- player/account character ids or archived run names;
- Knowledge teacher/source vocabulary;
- names embedded in prose without durable identity authority;
- synthetic or generated examples.

Specifically, the legacy-shaped `npc.corin_ash` string is not sufficient by itself to seed a person or NPC record. Corin Ash may become a future candidate only if a later source establishes him as explicit canon beyond the quest contact field.

## 6. Candidate Lanes

Future seed planning may look for candidates in these lanes, without creating records now:

- named people from durable design docs, if the docs explicitly treat them as stable canon people;
- named religious or historical figures only if current canon treats them as people rather than deity, religion, order, title, or mythic label;
- named quest-facing people only if independently canonical beyond a contact string;
- named settlement-associated people only if explicit canon exists outside generated operators, guild-presence labels, offices, and settlement prose;
- lineage-linked people only if current lineage authority supports the identity directly and the seed supplies validator-supported lineage records.

No safe concrete candidate list is approved by this plan. The future seed should perform a fresh reference audit and keep the batch very small. If that audit still finds only quest contacts, generated operators, roles, titles, workplaces, Knowledge labels, or prose names, the correct implementation result is to delay live people/NPC content rather than guess.

## 7. Candidate Example Posture

This plan does not approve exact `person.<slug>` or `npc.<slug>` ids.

The quest contact names observed in this pass are evidence examples only, not approved candidates:

- Harbormaster Sel Varn;
- Foreman Mira Kell;
- Archivist-Provost Lysa Mar;
- Inspector Halwen Crest;
- Corin Ash.

Each is currently visible only as quest presentation/contact metadata. Do not infer `lifeStatus`, settlement association, interactability, role authority, office authority, guild affiliation, or NPC overlay posture from those strings.

Do not assign `primarySettlementId` unless a current settlement id is verified and the person-to-settlement association is explicit stable canon. Do not use `interactionPosture: "interactable"` unless there is explicit authored interaction intent beyond a quest/contact placeholder.

## 8. Future Person Authoring Rules

Every future person record must:

- be complete under `packages/schemas/civilization/person.schema.json`;
- use `person.<slug>` id and matching `slug`;
- use `status: "planned"` unless a future seed explicitly decides `active`;
- use `lifeStatus: "unknown"` unless explicit canon proves `living` or `deceased`;
- use `aliases: []` unless explicit aliases exist;
- use `notes: []` only if no notes are needed; otherwise keep notes concise and non-empty;
- use `sourceAuthorityNotes` to document why the person is canonical and what the record does not imply.

Do not include age, birth/death date, sex/gender, pronouns, physique, attributes, skills, traits, class, job, rank, title, office, residence, workplace, family, household, faction, guild, religion, inventory, equipment, spells, Knowledge, quests, relationships, schedules, dialogue, service, combat, runtime, UI, storage, commands, events, rewards, generated-person, or gameplay fields.

Person records are descriptive identity authority only. They do not define roles, workplaces, relationships, schedules, dialogue, services, quests, Knowledge, combat, runtime state, UI, storage, rewards, or gameplay behavior.

## 9. Future NPC Overlay Authoring Rules

Every future NPC overlay must:

- be complete under `packages/schemas/civilization/npc.schema.json`;
- use `npc.<person-slug>` id;
- set `personId` to a resolving `person.<same-slug>`;
- remain one-to-one with a person in the first pass;
- use `primarySettlementId` only when it resolves to a current settlement and describes an authored association;
- use `presenceMode` only as broad descriptive posture, not current location;
- use `interactionPosture` only as authored posture, not dialogue, service, marker, or runtime access;
- avoid duplicating name, aliases, summary, lineage, or life status.

Do not include roles, workplaces, schedules, dialogue, services, vendors, companions, encounters, homes, factions, guilds, religions, family/household, inventory, equipment, combat, current location, availability clock, AI, memory, relationships, reputation/favorability, player state, runtime state, UI, storage, commands, events, rewards, generated-person, or gameplay fields.

Because this plan recommends people-only first, future NPC overlays should remain deferred unless a newer approved plan explicitly supersedes this posture with inspected, stable overlay candidates.

## 10. Selection Criteria For First Actual Content Implementation

The first live seed must:

- start from explicit canonical identity, not convenient references;
- prefer people-only records whenever interaction posture is unclear;
- avoid any candidate that requires new roles, affiliations, relationships, schedules, dialogue, services, quests, Knowledge subjects, generated people, runtime state, or migration;
- avoid any candidate that requires changing quest contact fields;
- avoid any candidate whose only support is a quest contact name, legacy `npc.*` string, generated operator, combatant id, player/account identity, Knowledge label, role, title, workplace, or prose mention;
- include no content until this seed plan is approved and a separate implementation prompt explicitly authorizes live content.

If the future audit identifies explicit canonical named people but no stable overlay posture, create only `people.json`. If it identifies no safe people, do not create live people or NPC files.

## 11. Future Content Seed Implementation Plan

The next implementation candidate is `Version 0.5.247 - First People And NPC Content Seed`, conditional on this seed plan being accepted and live content being explicitly authorized.

That future pass may create `packages/content/base/civilization/people.json` only if it finds or is given an explicit canonical named-person list. It should not create `packages/content/base/civilization/npcs.json` under this plan. It may register people content in normal content lint only if the implementation prompt explicitly approves registration.

Future implementation sequence:

1. Re-run the person/NPC schema, validator, tests, normal-lint index, quest, settlement, generated-operator, player/account/runtime, Knowledge, religion, guild, and lineage audits.
2. Select a very small people-only batch from explicit canonical identity evidence.
3. Draft `people.json` with `status: "planned"` and `lifeStatus: "unknown"` by default.
4. Skip `npcs.json` unless a newer approved plan explicitly authorizes overlays.
5. Run focused people/NPC validation tests.
6. Register normal content lint only if explicitly approved.
7. Audit changed paths to prove no quest, settlement, generated-operator, Knowledge, lineage, guild, religion, player/account/runtime, UI, storage, command, event, reward, or gameplay files changed.

## 12. Validation Checklist For Future Content Seed

The future seed implementation must run or document:

- focused people/NPC validation tests;
- schema-file test;
- normal content lint after registration, if registration is approved;
- content audit proving every person id/slug is unique and coherent;
- content audit proving every NPC id/personId suffix matches, if NPC overlays are later approved;
- NPC overlay audit proving every `personId` resolves, if NPC overlays are later approved;
- settlement audit proving every `primarySettlementId` resolves, if used;
- lineage audit proving every `lineageId` resolves, if used;
- forbidden-field audit for person and NPC records;
- non-inference audit proving no record was inferred from quest contacts, `npc.*` strings, generated operators, combatants, player/account identities, Knowledge labels, roles, titles, workplaces, or prose alone;
- scope audit proving no quest, settlement, generated-operator, Knowledge, lineage, guild, religion, player/account/runtime, UI, storage, command, event, reward, or gameplay changes;
- behavior audit proving people/NPCs are static descriptive content only.

## 13. Deferred Topics

The following remain explicitly deferred:

- live person content until a later implementation prompt;
- live NPC overlay content unless a later approved plan and implementation prompt explicitly authorize it;
- generated people;
- generated residents, workers, guards, merchants, travelers, and crowds;
- population templates;
- social roles;
- assignments;
- workplace/person employment links;
- household/family membership;
- kinship links;
- relationship links;
- affiliations;
- offices and titles;
- schedules;
- dialogue;
- rumors;
- companions;
- services and vendors;
- quest contact migration;
- Chronicle subjects;
- Knowledge person subjects;
- recognition/discovery state;
- current location;
- NPC AI, pathfinding, and spawning;
- inventory, equipment, and combat profiles;
- reputation, favorability, and standing;
- player/account/person bridges;
- runtime/save-state ownership;
- UI markers and presentation;
- commands, events, rewards, and gameplay.

## 14. Temporary Artifact Handling

`docs/dev/tmp-npc-social-systems-research-2026-06-20.md` is absent. This matches the `0.5.223` decision, which deleted it after promotion into permanent NPC/social authority and person-vs-NPC decision docs.

No temporary people/NPC seed artifact was found in this pass. No temporary artifact is deleted or created by this plan.

## 15. Non-Goals

This plan does not authorize:

- live people content;
- live NPC overlay content;
- `packages/content/base/civilization/people.json`;
- `packages/content/base/civilization/npcs.json`;
- normal people/NPC content-lint registration;
- schema, validator, or focused-test changes;
- quest contact migration or `npc.*` normalization;
- generated people or settlement-operator changes;
- social roles, affiliations, relationships, schedules, dialogue, services, companions, rumors, Knowledge subjects, Chronicle subjects, runtime, UI, storage, commands, events, rewards, or gameplay.

## 16. Next Recommended Version

`Version 0.5.247 - First People And NPC Content Seed`

That future pass is conditional and should proceed only if live people content is explicitly authorized. Under this plan, the first implementation should be people-only and should defer NPC overlays unless a newer approved prompt explicitly supersedes this posture.
