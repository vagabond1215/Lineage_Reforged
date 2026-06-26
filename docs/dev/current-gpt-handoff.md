# Current GPT Handoff

Source version/run: Version 0.5.235 - People And NPC Schemas And Validators
Date: 2026-06-26
Status: future people/NPC schemas and focused validators completed; no live people/NPC content, normal content-lint registration, loaders, migrations, runtime, UI, storage, generated-person behavior, quest-contact migration, Knowledge integration, social simulation, or gameplay change

## Authority Rules

- `civilization.people` is approved as future canonical authored named-person identity only.
- `civilization.npcs` is approved as a future optional authored overlay keyed one-to-one to a canonical `personId`.
- Person identity owns only canonical name, aliases, summary, optional lineage reference, life status, lifecycle status, provenance, and notes.
- NPC overlays own only authored presence mode, interaction posture, optional primary settlement association, lifecycle status, provenance, and notes.
- NPC overlays must not duplicate person identity fields such as `name`, `aliases`, `summary`, `lineageId`, or `lifeStatus`.
- Existing quest giver/contact strings, `npc.corin_ash`, `npc_individual`, `npc_household`, synthetic settlement operators, generated combatants, players/account history, roles, titles, workplaces, Knowledge labels, and prose names are not canonical person/NPC authority.
- Relationship links, kinship, roles, workplaces, schedules, dialogue, services, quests, Chronicle, Knowledge, inventory, combat, AI, current location, runtime state, storage, UI, commands, events, rewards, and gameplay remain separate future or runtime owners.

## Current Anchor

Latest completed:

- `Version 0.5.235 - People And NPC Schemas And Validators`

Immediate next:

- `Version 0.5.236 - Magic Study Source Schema And Validator`

## People/NPC Validation Result

- Added `packages/schemas/civilization/person.schema.json`.
- Added `packages/schemas/civilization/npc.schema.json`.
- Added `tools/content-lint/people-npcs.mjs` as a pure in-memory semantic validator helper.
- Added `tests/unit/people-npc-validation.test.mjs`.
- Registered both new schema files in `tests/unit/schema-files.test.mjs`.
- No `packages/content/base/civilization/people.json` or `packages/content/base/civilization/npcs.json` files were created.
- No normal content-lint registration for future people/NPC content was added.

## Known Test Notes

- `node --test tests\unit\people-npc-validation.test.mjs` passes.
- `npm.cmd run tool:content-lint` passes; `content-lint: ok (58 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` parses both new people/NPC schemas successfully, then still fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.

## Next Route

`Version 0.5.236 - Magic Study Source Schema And Validator` is the next queued run. It should use the `0.5.224` Magic Study Source Schema Decision, keep study sources static/descriptive, fail closed on missing authorities, and avoid spell acquisition mutation, study progress/runtime state, teacher/person seeding, institution seeding, UI, storage, rewards, commands, events, or gameplay behavior unless a later prompt explicitly authorizes them.
