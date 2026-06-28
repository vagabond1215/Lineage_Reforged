# Current GPT Handoff

Source version/run: Version 0.5.246 - First People And NPC Content Seed Plan
Date: 2026-06-28
Status: documentation-only first people/NPC seed plan completed; recommended first live seed posture is people-only; NPC overlays deferred; no live people/NPC content, normal content-lint registration, quest migration, generated people, runtime, UI, storage, commands, events, rewards, or gameplay change

## Authority Rules

- `civilization.people` is future canonical named-person identity authority only.
- `civilization.npcs` is future optional authored presence/interaction overlay authority keyed to canonical people only.
- The first future live seed should be people-only unless a newer approved plan explicitly supersedes that posture.
- NPC overlays remain deferred because the current audit found no stable authored presence/interaction evidence beyond weak quest-contact strings, organization labels, generated settlement operators, and runtime/player/account identities.
- A person may exist without an NPC overlay. An NPC overlay may not exist without a resolvable `personId`.
- Quest contact display names, legacy-shaped `npc.*` strings such as `npc.corin_ash`, generated settlement operators, combatants, player/account identities, Knowledge labels, roles, titles, workplaces, deity/religion/order labels, and prose names are not sufficient evidence by themselves.
- Live people path remains absent: `packages/content/base/civilization/people.json`.
- Live NPC path remains absent: `packages/content/base/civilization/npcs.json`.
- Schema files exist at `packages/schemas/civilization/person.schema.json` and `packages/schemas/civilization/npc.schema.json`.
- Pure validator helper exists at `tools/content-lint/people-npcs.mjs`; focused tests exist at `tests/unit/people-npc-validation.test.mjs`; schema-file parse registration exists.
- Normal content lint still does not register people/NPC content.

## Current Anchor

Latest completed:

- `Version 0.5.246 - First People And NPC Content Seed Plan`

Immediate next:

- `Version 0.5.247 - First People And NPC Content Seed`

## People/NPC Seed Plan Result

- Added `docs/design/first-people-npc-content-seed-plan.md`.
- Chose people-only as the conservative first live seed strategy.
- Deferred NPC overlays from the first live seed unless a newer approved plan and implementation prompt explicitly authorize inspected overlay candidates.
- Documented candidate evidence policy, non-inference guardrails, authoring rules, validation checklist, temporary-artifact handling, and deferred social/runtime topics.
- Current audit found five quest contact names and one `npc.corin_ash` entity string, but no safe live person candidates beyond weak contact metadata.
- `docs/dev/tmp-npc-social-systems-research-2026-06-20.md` remains absent after its `0.5.223` retirement.

## Known Test Notes

- `node --test tests\unit\people-npc-validation.test.mjs` passes with 75 tests.
- `npm.cmd run tool:content-lint` passes and reports `content-lint: ok (59 files checked)`.
- `node --test tests\unit\schema-files.test.mjs` still parses the person and NPC schemas, then fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.
- `tests/unit/region-first-world-data.test.mjs` still has the unrelated direct-run BOM parsing issue noted by prior handoffs.

## Next Route

`Version 0.5.247 - First People And NPC Content Seed` is conditional. It should proceed only if live people content is explicitly authorized and a fresh audit finds or receives explicit canonical named-person evidence. Under the current plan, that implementation should create at most `people.json`; `npcs.json` remains deferred unless a newer approved prompt supersedes this posture.
