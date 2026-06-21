# Person vs NPC Schema Decision

Version: `Version 0.5.223 - Person vs NPC Schema Decision`

Status: approved documentation-only schema posture

## 1. Decision Summary

Approve two separate future authored collections:

- `civilization.people` for stable canonical named-person identity;
- `civilization.npcs` for optional authored presence and interaction posture keyed to a canonical person.

People come first conceptually and by reference. A person may exist without an NPC overlay. An NPC overlay may not exist without a resolvable `personId`. First-pass authored NPC overlays are one-to-one with people; multiple location, encounter, schedule, or service instances remain separate future authorities or runtime state.

Keep both authorities descriptive-only. Do not infer people from quest contacts, `npc.*` strings, generated settlement operators, combatants, player characters, account history, names in prose, Knowledge evidence vocabulary, roles, titles, offices, or workplaces.

No schema, validator, content, loader, lint registration, test, runtime, UI, storage/save-state, migration, generated-person, NPC AI, schedule, dialogue, relationship, service, Knowledge, or gameplay change is authorized by this decision.

## 2. Live Repo Reality

- No authored people, NPC, social-role, relationship, schedule, dialogue, rumor, or companion collection or schema exists.
- `civilization.workplaces` owns facilities, jobs, labor, tools, and production. It does not own named workers.
- Five quest definitions carry giver organization metadata plus free-form contact names. One uses `entityId: "npc.corin_ash"`; that string is not backed by a person or NPC record.
- Settlement institution/property projections synthesize `npc_individual` and `npc_household` operator types and ids. Those runtime-derived placeholders are not authored people or households.
- Combat systems may create NPC combatants, but combat actor identity/state does not establish canonical person authority.
- Player state owns `playerId`, player-created identity, progression, inventory, reputation, quest state, and runtime character state. Account run history owns archived player-character identity. Neither becomes `civilization.people` automatically.
- Knowledge tooling uses character-owner and teacher/source vocabulary for evidence and acquisition. Those terms do not establish authored person subjects or teacher records.
- Settlements, guilds, workplaces, quests, religions, civic records, families, and other content include names, roles, offices, or labels without owning a general named-person registry.

The temporary NPC/social research correctly recommends separating identity from interaction and runtime state. Its collection and field proposals are planning input only; this decision narrows them against live authority.

## 3. Canonical Person Authority

Future `civilization.people` is the sole authored authority for canon named-person identity. It may represent living, deceased, historical, absent, or non-interactable people when explicit canon supports them.

A person record owns only identity facts that remain valid when location, occupation, affiliation, relationship, service, dialogue, schedule, encounter, or interactability changes. It must not become a character sheet, biography dump, NPC instance, employee record, family graph, inventory owner, quest state, or social simulation record.

The future collection path is:

- content: `packages/content/base/civilization/people.json`;
- schema: `packages/schemas/civilization/person.schema.json`;
- logical collection: `civilization.people`;
- wrapper: strict object with exactly `records` for the first pass;
- record id: `person.<slug>`;
- slug: lower snake case, matching the id suffix.

## 4. NPC Overlay Authority

Future `civilization.npcs` is an optional authored overlay for a canonical person who has a stable narrative/world presence or interaction posture.

The future collection path is:

- content: `packages/content/base/civilization/npcs.json`;
- schema: `packages/schemas/civilization/npc.schema.json`;
- logical collection: `civilization.npcs`;
- wrapper: strict object with exactly `records` for the first pass;
- record id: `npc.<person-slug>`;
- required identity link: `personId: person.<person-slug>`;
- cardinality: at most one authored NPC overlay per `personId` in the first pass.

The overlay owns authored presence and interaction posture, not identity. It must not duplicate `name`, `aliases`, `lineageId`, life status, biography, kinship, or other person fields. A presentation label may be added only in a later dedicated UI/dialogue need and must not become alternate identity authority.

Multiple appearances, encounters, schedules, workplaces, shops, service sessions, travel parties, or combat instances must reference the one person/NPC authority rather than create duplicate overlays.

## 5. Minimum Person Record Contract

Approve this future minimum person record posture:

- `id`: required canonical `person.<slug>` id;
- `slug`: required matching lower-snake-case slug;
- `name`: required canonical public display name;
- `aliases`: required array, empty when none; aliases are identity labels, not disguise or recognition state;
- `summary`: required short public identity description;
- `lineageId`: optional canonical existing lineage reference when explicit canon proves it;
- `lifeStatus`: required `living`, `deceased`, or `unknown`;
- `status`: required authored-record lifecycle posture `planned`, `active`, or `retired`;
- `sourceAuthorityNotes`: required non-empty provenance/authority notes;
- `notes`: required descriptive notes array, empty when none.

Do not add age, birth/death dates, sex/gender, pronouns, physique, attributes, skills, traits, class, job, rank, title, office, residence, workplace, family, household, faction, guild, religion, inventory, equipment, spell, Knowledge, quest, relationship, schedule, dialogue, service, combat, or runtime fields in the first pass. Those fields require explicit canon and an owning authority decision. This project remains classless; person records must not introduce class gates.

`lineageId` is optional because lineage identity is stable and an existing canonical registry is available. It must not be inferred from names, appearance, settlement, role, or prose.

## 6. Minimum NPC Overlay Contract

Approve this future minimum NPC overlay posture:

- `id`: required `npc.<person-slug>` id;
- `personId`: required canonical person reference with the same suffix;
- `primarySettlementId`: optional canonical settlement anchor for a stable authored association, not current position or residence ownership;
- `presenceMode`: required `resident`, `visitor`, `itinerant`, `remote`, or `unknown` descriptive posture;
- `interactionPosture`: required `reference_only` or `interactable` authored posture;
- `status`: required authored-record lifecycle posture `planned`, `active`, or `retired`;
- `sourceAuthorityNotes`: required non-empty provenance/authority notes;
- `notes`: required descriptive notes array, empty when none.

Do not include role ids, workplace ids, schedule ids, dialogue ids, service/vendor ids, companion ids, encounter ids, home/property ids, faction/guild/religion/civic/family memberships, inventory, combat profile, current location, availability clock, AI, memory, relationship values, or player-local state in the first schema. Those references should be added only after their owners exist and a concrete consumer requires them.

`primarySettlementId` is intentionally the only first-pass external NPC anchor because `world.settlements` is live and stable. It describes an authored association, not a spawn point, pathfinding target, schedule, service area, current location, or proof of residence.

## 7. Life, Presence, Interaction, and Record Status

Keep four concepts separate:

- person `lifeStatus` answers whether canon says the person is living, deceased, or unknown;
- NPC `presenceMode` describes broad authored world association, not current coordinates;
- NPC `interactionPosture` describes whether authored content intends an interaction surface, not whether runtime currently permits interaction;
- record `status` controls whether the authored record is planned, active, or retired.

A deceased or historical person normally has no active NPC overlay. A living person may remain reference-only or have no overlay. `interactable` does not grant dialogue, services, quests, schedules, markers, access, or UI. `retired` does not rewrite history or delete references.

Do not use one generic `active` flag to collapse life, presence, interaction, and record lifecycle.

## 8. Identity Duplication and Reference Rules

The person record owns canonical name, aliases, summary, lineage, and life status. The NPC overlay owns only presence and interaction posture plus its narrow settlement anchor.

Future authorities must reference `personId` when the relationship concerns the enduring person. They may reference `npcId` only when the relationship specifically concerns the authored interaction overlay. Prefer `personId` for quests, events, Chronicle subjects, Knowledge recognition, kinship, social relationships, affiliations, offices, and historical facts. Reserve `npcId` for dialogue, schedule, service, encounter-presentation, map-presentation, or companion overlays after those authorities exist.

Do not copy names or identity data into dependent records merely for convenience. Presentation snapshots in runtime/history may retain labels when their own persistence requirements demand it, but they do not become authored identity authority.

## 9. Existing Strings and Synthetic Identity Posture

Existing quest giver/contact fields remain presentation and organization-anchor metadata. `npc.corin_ash` is a non-resolving legacy-shaped string, not evidence sufficient to author Corin Ash as canon. No quest field is migrated or normalized in this pass.

`npc_individual`, `npc_household`, `household.<settlement>.<district>`, company, guild, authority, and unclaimed operator ids generated by settlement projections remain synthetic runtime/projection identities. They must not resolve against `civilization.people` or `civilization.npcs` unless a later explicit adapter and authored record prove the relationship.

Combatant ids, generated enemies/allies, trial actors, player ids, account `characterId` values, archived run names, backstory labels, role labels, titles, office ids, workplace job ids, trainer/teacher vocabulary, and names embedded in prose are also non-canonical for this authority.

## 10. Authored vs Generated People

First-pass collections cover explicitly authored canon named people and their optional NPC overlays only.

Generated residents, workers, guards, merchants, travelers, household members, ambient quest contacts, combatants, and crowds remain future generated-once/save or runtime data. Do not add template ids, generator seeds, random names, demographic distributions, spawn weights, population quotas, persistence keys, or generated-person status to authored people/NPC records.

A later generated-person contract must decide identity duration, id allocation, deduplication, persistence, promotion to canon, save ownership, and references. Until then, generated entities must not masquerade as authored `person.*` or `npc.*` records.

## 11. Roles, Workplaces, Affiliations, Family, and Relationships

People and NPC records do not own roles, employment, offices, titles, memberships, household/family membership, kinship, or social relationships.

- workplaces retain facility/job/economy authority;
- future social-role and assignment authorities own reusable roles and temporal assignments;
- future factions, institutions, polities, governments, religions/orders, guilds, offices, and services own their identities and membership/assignment links;
- future households/families and `civilization.kinship_links` own direct kin/care facts;
- future `civilization.relationship_links` owns non-kin social claims.

Do not place arrays of role, affiliation, membership, kinship, friendship, rivalry, favorability, or relationship data on people or NPC overlays. Cross-authority links must remain descriptive and non-mutating when later approved.

## 12. Schedule, Dialogue, Service, Quest, Chronicle, and Knowledge Boundary

Schedules, dialogue topics/scenes, services/vendors, quests, events, rumors, companions, Chronicle templates, and Knowledge subjects remain separate authorities.

People/NPCs may become reference targets after those schemas explicitly support them. They must not execute schedules, AI, pathfinding, conversations, service access, shops, quest offering/completion, rewards, events, rumor propagation, companion recruitment, Chronicle writing, or Knowledge progress.

Current quest contact strings remain unchanged until a later narrow quest-reference alignment has explicit authored people to reference. Knowledge character-owner and teacher/source vocabulary remains informational/acquisition metadata and does not gain person/NPC subject support in this pass.

## 13. Player and Runtime Character Boundary

Player-created identity, active player state, account run history, combatants, NPC instances, generated offers, schedules, current positions, inventories, equipment, injuries, memory, dialogue history, relationships, reputation/standing, party membership, service access, and AI remain runtime/player/session/account/save owners.

Do not require the player character or archived run characters to resolve to `civilization.people`. Do not reuse `playerId` or account `characterId` as `personId`. A future explicit bridge may reference an authored person only if narrative requirements prove it; no bridge is approved here.

Authored people/NPC records must not store current HP/resources, stats, progression, abilities, spells, inventory, equipment, combat state, current coordinates, active effects, quest state, flags, memory, relationship scores, service state, or save metadata.

## 14. Validation and Staged Implementation Direction

`Version 0.5.235 - People And NPC Schemas And Validators` remains the conditional implementation candidate after the docs-first queue.

That pass should create schemas, pure semantic validators, and focused in-memory tests only. It should not add live content files, normal content-lint registration, loaders, migrations, runtime types, UI, or gameplay behavior unless separately authorized.

Future validation should enforce:

1. strict records-only wrappers;
2. unique ids/slugs and exact id-suffix agreement;
3. `person.<slug>` and `npc.<person-slug>` patterns;
4. unique canonical person names only where explicit policy can safely distinguish aliases and homonyms;
5. allowed person life status, NPC presence mode, interaction posture, and record status vocabularies;
6. optional lineage references resolve to current lineage authority;
7. optional primary settlement references resolve to active settlement authority;
8. every NPC resolves one person, suffixes match, and no person has multiple first-pass overlays;
9. NPC overlays reject duplicated person identity fields;
10. no inference from quest contacts, synthetic operator ids, combatants, players, account history, roles, titles, workplaces, Knowledge labels, or prose;
11. rejection of roles, affiliations, relationships, schedules, dialogue, services, quests, inventory, combat, AI, current location, runtime, storage, UI, command, event, reward, and gameplay fields.

After `0.5.235`, a separate docs-only seed plan should choose only explicitly canonical named people and decide whether the first seed includes both person and NPC records. The existing conditional `Version 0.5.245 - First People And NPC Content Seed Plan` remains appropriate.

## 15. Temporary Research Artifact Handling

Delete `docs/dev/tmp-npc-social-systems-research-2026-06-20.md` in this pass.

Its useful person/NPC, authored/generated, role/workplace, schedule, dialogue, relationship, rumor, companion, reputation, service, Knowledge, validation, and runtime boundaries are now permanently owned by `docs/design/npc-social-authority-boundary-decision.md`, this decision, and the future-content backlog. No named future consumer remains.

Future social work must start from permanent design docs and a fresh live-repo audit rather than restoring or treating the temporary report as canon.

## 16. Non-Goals

- no schema, validator, content JSON, test, loader, lint registration, runtime, UI, storage/save-state, or migration changes;
- no person/NPC records, generated people, population templates, roster generation, id promotion, or quest-contact migration;
- no social-role, assignment, workplace, household, family, kinship, relationship, schedule, dialogue, rumor, companion, service, vendor, faction, institution, polity, office, religion/order, quest, Chronicle, or Knowledge schema/content changes;
- no NPC AI, pathfinding, spawning, current position, schedule execution, dialogue execution, relationship mutation, social memory, reputation/favorability/standing mutation, party state, service access/execution, inventory, combat, reward, event, command, or gameplay behavior;
- no backwards compatibility, aliases, generated-id migration, new Deep Research, or transition to `0.6.0`.

## 17. Next Recommended Version

Proceed with `Version 0.5.224 - Magic Study Source Schema Decision`.

That run remains documentation-only. It should decide the exact future magic-study source contract and references, preserve spell, Knowledge, trial, known-spell, Prestige, institution/teacher, item, and runtime owners, and decide the magic-study temporary research artifact's retirement.

No new GPT Deep Research is required before `0.5.224`. GPT-DR gates remain non-Codex labels, and permanent prompt-pack guidance does not interrupt the immediate numbered queue.
