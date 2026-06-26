# Current GPT Handoff

Source version/run: Version 0.5.236 - Magic Study Source Schema And Validator
Date: 2026-06-26
Status: future magic study source schema and focused validator completed; no live magic study source content, normal content-lint registration, study policy, progress, runtime, known-spell acquisition, UI, storage, rewards, commands, events, or gameplay change

## Authority Rules

- `player.magic_study_sources` is approved as future static source/access/context metadata only.
- Source records use `magic_study_source.<slug>` ids and strict records-only wrapper shape.
- Source modes and source kinds are controlled and must be compatible.
- Subjects resolve only through current spell ids, current spell `primaryFamily` values, current spell `school` values, or active Knowledge domain registry records.
- Source anchors resolve only through current item keys, current `magic_service.*` records, active sacred sites, and current guild ids in this pass.
- Person/NPC anchors fail closed unless active authored records are explicitly supplied.
- Institution, ritual, and trial anchors fail closed unless a later validator contract explicitly enables compatible authority.
- Study policy, prerequisites, costs, duration, attempts, evidence, progress, readiness, completion, rewards, known-spell acquisition, spellbook mutation, runtime state, UI, storage, commands, events, and gameplay remain separate owners.

## Current Anchor

Latest completed:

- `Version 0.5.236 - Magic Study Source Schema And Validator`

Immediate next:

- `Version 0.5.237 - Polity Schema And Validator`

## Magic Study Source Validation Result

- Added `packages/schemas/player/magic_study_source.schema.json`.
- Added `tools/content-lint/magic-study-sources.mjs` as a pure in-memory structural and semantic validator helper.
- Added `tests/unit/magic-study-source-validation.test.mjs`.
- Registered the new schema in `tests/unit/schema-files.test.mjs`.
- No `packages/content/base/player/magic_study_sources.json` file was created.
- No normal content-lint registration for future magic study source content was added.

## Known Test Notes

- `node --test tests\unit\magic-study-source-validation.test.mjs` passes.
- `npm.cmd run tool:content-lint` passes; `content-lint: ok (58 files checked)`.
- Relevant known-spell and magic readiness/resolver suites pass.
- `node --test tests\unit\schema-files.test.mjs` parses the new magic study source schema successfully, then still fails on the unrelated pre-existing Knowledge subject vocabulary assertion around `sacred_site`.

## Next Route

`Version 0.5.237 - Polity Schema And Validator` is the next queued run. It should use the `0.5.225` Polity Schema Decision, keep polities narrow/static/descriptive, and avoid government, law, claims, diplomacy, factions, runtime, UI, storage, rewards, commands, events, or gameplay behavior unless a later prompt explicitly authorizes them.
