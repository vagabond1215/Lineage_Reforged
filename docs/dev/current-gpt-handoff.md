# Current GPT Handoff

Source version/run: Version 0.5.223 - Person vs NPC Schema Decision
Date: 2026-06-21
Status: documentation-only decision completed; no implementation occurred

## Authority Rules

- Future `civilization.people` owns stable authored named-person identity.
- Future `civilization.npcs` is a separate optional one-to-one authored overlay keyed to canonical `personId`.
- Person ids are `person.<slug>`; NPC overlay ids are `npc.<person-slug>` with matching suffixes.
- People own canonical name, aliases, summary, optional lineage, life status, record status, provenance, and notes.
- NPC overlays own descriptive presence mode, interaction posture, record status, optional primary settlement anchor, provenance, and notes.
- NPC overlays do not duplicate person identity. A person may exist without an overlay; an overlay may not exist without a person.
- Quest contacts, `npc.corin_ash`, synthetic `npc_individual`/`npc_household` operators, combatants, player/account characters, roles, titles, offices, workplaces, and Knowledge teacher/character vocabulary are not canonical people.
- Roles, employment, affiliations, family/kinship, relationships, schedules, dialogue, services, quests, companions, rumors, Chronicle, Knowledge, generated populations, and mutable state retain separate owners.
- All people/NPC data remains descriptive-only; no runtime behavior is approved.

## Current Anchor

Latest completed:

- `Version 0.5.223 - Person vs NPC Schema Decision`

Immediate next:

- `Version 0.5.224 - Magic Study Source Schema Decision`

## Person/NPC Decision Result

- No live authored person or NPC collection/schema exists.
- Future paths are `packages/content/base/civilization/people.json`, `packages/schemas/civilization/person.schema.json`, `packages/content/base/civilization/npcs.json`, and `packages/schemas/civilization/npc.schema.json`.
- The first NPC schema permits only a person link, descriptive presence/interaction posture, lifecycle status, optional settlement anchor, provenance, and notes.
- Generated people and all runtime NPC instances remain deferred.
- Conditional implementation remains `0.5.235 - People And NPC Schemas And Validators`; the first seed plan remains `0.5.245`.
- `docs/dev/tmp-npc-social-systems-research-2026-06-20.md` was deleted after full promotion and has no remaining consumer.

## Consolidated Near-Term Queue

1. `0.5.224 - Magic Study Source Schema Decision`
2. `0.5.225 - Polity Schema Decision`
3. `0.5.226 - Household vs Family Schema Decision`
4. `0.5.227 - Settlement Economy Schema Decision`
5. `0.5.228 - World Map Feature Authority Schema Decision`
6. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue. GPT-DR labels remain non-Codex labels and do not consume `0.5.x` numbers. Permanent prompt-pack guidance remains active but does not interrupt the numbered queue.

## Next Route Boundary

`Version 0.5.224 - Magic Study Source Schema Decision` remains documentation-only. It must define the future source collection/paths, subjects and references, access-versus-ownership boundary, status/provenance, forbidden state, validation ownership, Arcane Lore sequence, and temporary research artifact disposition.

It must not implement schemas, validators, content, tests, magic study, spell ownership/casting, Knowledge/trial behavior, Prestige, institutions/teachers, items, UI, storage, migration, or gameplay behavior.
