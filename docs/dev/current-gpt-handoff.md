# Current GPT Handoff

Source version/run: Version 0.5.237 - Polity Schema And Validator
Date: 2026-06-26
Status: future polity schema and focused validator completed; no live polity content, normal content-lint registration, government, jurisdiction, law, claim, border, diplomacy, conflict, faction, institution, player legal state, runtime, UI, storage, rewards, commands, events, or gameplay change

## Authority Rules

- `world.polities` is approved as future static authored political identity only.
- Polity records use `polity.<slug>` ids and strict records-only wrapper shape.
- Polity records own identity, aliases, summary, controlled polity form, typed place anchors, lifecycle status, provenance, and notes only.
- Place anchors resolve only to current regions, region localities, and settlements.
- Place anchors are descriptive references only; they are not borders, claims, jurisdiction, control zones, administrative areas, tax areas, law scopes, route scopes, spawn areas, map geometry, ownership, or gameplay areas.
- `autonomous_settlement` requires an explicit polity record with a valid settlement anchor.
- Settlement administrative role, tags, hierarchy, map labels, world-map conflict zones, guild presence, religion, families, titles, backstories, synthetic operators, runtime projections, and player state do not create polity authority.
- Government, settlement government, jurisdiction, law, citizenship/status, claims, borders, vassalage, diplomacy, conflict, forces, taxation/customs, enforcement, player legal state, Knowledge subjects, runtime state, UI, storage, commands, events, rewards, and gameplay remain separate owners.

## Current Anchor

Latest completed:

- `Version 0.5.237 - Polity Schema And Validator`

Immediate next:

- `Version 0.5.238 - Household And Family Schemas And Validators`

## Polity Validation Result

- Added `packages/schemas/world/polity.schema.json`.
- Added `tools/content-lint/polities.mjs` as a pure in-memory structural and semantic validator helper.
- Added `tests/unit/polity-validation.test.mjs`.
- Registered the new schema in `tests/unit/schema-files.test.mjs`.
- No `packages/content/base/world/polities.json` file was created.
- No normal content-lint registration for future polity content was added.

## Known Test Notes

- `node --test tests\unit\polity-validation.test.mjs` passes.
- `npm.cmd run tool:content-lint` passes; `content-lint: ok (58 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` parses the new polity schema successfully, then still fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `tests/unit/region-first-world-data.test.mjs` still fails independently on BOM parsing when run directly.

## Next Route

`Version 0.5.238 - Household And Family Schemas And Validators` is the next queued run. It should use the `0.5.226` Household vs Family Schema Decision, keep households/families static/descriptive, and avoid membership, kinship, genealogy, inheritance, succession, property, runtime, UI, storage, rewards, commands, events, or gameplay behavior unless a later prompt explicitly authorizes them.
