# Current GPT Handoff

Source version/run: Version 0.5.234 - Quest Objective And Condition Validation Pass
Date: 2026-06-25
Status: quest objective/condition validation hardening completed; embedded action trees preserved; no schema, runtime, UI, storage, command, event, reward execution, journal/Chronicle mutation, generated-offer, player quest-state, or gameplay change

## Authority Rules

- Quest definitions remain canonical for unique authored quests.
- Quest archetypes remain reusable authored action-tree structures.
- Quest templates remain separate repeatable-offer input records and do not adopt authored action-tree validation.
- Objectives and conditions remain embedded inside quest definitions/archetypes; standalone objective/condition collections, global ids, and registries are not approved.
- Authored action checks remain descriptive static gates/contributions. They do not execute, select branches, mutate rewards, update journal/Chronicle state, create generated offers, or track runtime progress.
- Current check target posture:
  - `attribute` -> player attribute id;
  - `skill` -> player skill id;
  - `ability` -> player ability id;
  - `spell` -> player spell id;
  - `tool` / `item` -> canonical `itemKey`;
  - `equipment_tag`, `party_size`, and `rng` -> owner-local descriptive tokens only.
- Forbidden authored fields now guarded by content lint include global objective/condition ids, runtime progress/state, reward execution, journal/Chronicle mutation, UI/storage state, command/event state, generated-offer state, and gameplay effects.

## Current Anchor

Latest completed:

- `Version 0.5.234 - Quest Objective And Condition Validation Pass`

Immediate next:

- `Version 0.5.235 - People And NPC Schemas And Validators`

## Quest Validation Result

- Added `tools/content-lint/quest-action-trees.mjs`.
- Wired it into `tools/content-lint/index.mjs` for live `quest_definitions.json` and `quest_archetypes.json`.
- Added `tests/unit/quest-objective-condition-validation.test.mjs`.
- Corrected two existing negative `party_size` check weights in `packages/content/base/civilization/quest_definitions.json` from `-0.15` to `0.15`.
- No quest schemas were changed.
- No quest templates were changed.
- No standalone objective/condition content or registry was created.
- Normal content lint still reports `content-lint: ok (58 files checked)`.

## Known Test Notes

- `node --test tests/unit/quest-objective-condition-validation.test.mjs` passes.
- `npm.cmd run tool:content-lint` passes.
- `node --test tests/unit/civilization-reputation-validation.test.mjs` passes.
- `node --test tests/unit/civilization-system-consistency.test.mjs` passes.
- `node --test tests/unit/schema-files.test.mjs` parses quest schemas successfully, then still fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.

## Next Route

`Version 0.5.235 - People And NPC Schemas And Validators` is the next queued run. It should use the `0.5.223` Person vs NPC Schema Decision, keep people identity and NPC overlays separate, avoid inferred/synthetic people, and avoid runtime NPC AI, schedules, dialogue, services, relationship mutation, UI, storage, generated-person behavior, Knowledge snippets, and gameplay behavior unless a later prompt explicitly authorizes them.
