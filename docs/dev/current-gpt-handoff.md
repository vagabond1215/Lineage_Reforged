# Current GPT Handoff

Source version/run: Version 0.5.247 - First People And NPC Content Seed
Date: 2026-06-28
Status: conditional first people/NPC content seed completed as deferred docs-only result; no live people/NPC content, normal content-lint registration, quest migration, generated people, runtime, UI, storage, commands, events, rewards, or gameplay change

## Current People/NPC Authority

- `civilization.people` is future canonical named-person identity authority only.
- `civilization.npcs` is future optional authored presence/interaction overlay authority keyed to canonical people only.
- A person may exist without an NPC overlay. An NPC overlay may not exist without a resolvable `personId`.
- Live people path remains absent: `packages/content/base/civilization/people.json`.
- Live NPC path remains absent: `packages/content/base/civilization/npcs.json`.
- Pure validator helper exists at `tools/content-lint/people-npcs.mjs`; focused tests exist at `tests/unit/people-npc-validation.test.mjs`; schema-file parse registration exists.
- Normal content lint still does not register people/NPC content.

## Latest Result

Latest completed:

- `Version 0.5.247 - First People And NPC Content Seed`

Immediate next:

- `Version 0.5.248 - First Polity Content Seed Plan`

## People/NPC Seed Result

- No safe canonical named-person candidates were found.
- No `people.json` was created.
- No `npcs.json` was created.
- No normal content-lint registration was added for people/NPC content.
- The audit found only weak/insufficient evidence for named people: quest contact strings, the legacy-shaped `npc.corin_ash` contact string, generated settlement operator vocabulary, roles/titles/jobs/offices, organization/religion/order labels, and player/account/lineage terminology.
- Harbormaster Sel Varn, Foreman Mira Kell, Archivist-Provost Lysa Mar, Inspector Halwen Crest, and Corin Ash remain quest/contact metadata only.

## Validation Notes

- `node --test tests\unit\people-npc-validation.test.mjs` passes with 75 tests.
- Normal content lint passes with 59 files checked.
- `node --test tests\unit\schema-files.test.mjs` still parses the person and NPC schemas, then fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `packages/content/base/civilization/people.json` and `packages/content/base/civilization/npcs.json` remain absent.

## Next Route Guardrail

`Version 0.5.248 - First Polity Content Seed Plan` should be docs-only. People/NPC content remains deferred until a future approved run supplies or discovers explicit canonical named-person evidence. Do not create people or NPC records from quest contacts, `npc.*` strings, generated operators, roles, jobs, titles, offices, guild/religion/order labels, Knowledge teacher/source vocabulary, combatants, player/account identities, or prose-only names.
