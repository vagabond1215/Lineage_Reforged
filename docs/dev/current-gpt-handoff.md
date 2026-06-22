# Current GPT Handoff

Source version/run: Version 0.5.224 - Magic Study Source Schema Decision
Date: 2026-06-22
Status: documentation-only decision completed; no implementation occurred

## Authority Rules

- Future `player.magic_study_sources` owns static authored magical study access/context descriptors.
- Future paths are `packages/content/base/player/magic_study_sources.json` and `packages/schemas/player/magic_study_source.schema.json`.
- Records use `magic_study_source.<slug>`, strict records-only wrapping, and `planned`/`active`/`retired` lifecycle status.
- Sources use typed modes/kinds, typed subject references, typed source anchors, `context_only`/`study_candidate` access posture, provenance, and notes.
- Future `player.magic_study_policies` remains separate. The first source contract has no policy reference.
- Access/context never grants known-spell ownership, spellbook entries, readiness, Knowledge progress, trial completion, rewards, Prestige, items, favor/alignment, services, or behavior.
- Active references fail closed when document, person/NPC, institution, ritual, trial compatibility, or other owning authority is absent or inactive.
- Item references use canonical `itemKey`; blank books/scrolls are substrates, not magical documents.
- Arcane Lore remains planned. Its skill link is live, but it has no snippets and null trial/completion/visibility policies.
- Known-spell ownership remains character-scoped and `training_event`-only.

## Current Anchor

Latest completed:

- `Version 0.5.224 - Magic Study Source Schema Decision`

Immediate next:

- `Version 0.5.225 - Polity Schema Decision`

## Magic Study Decision Result

- Live spell catalog: 55 records.
- Live item magic metadata: seven conduit profiles and three catalyst profiles; no authored magical study document authority.
- Live world magic infrastructure: four descriptive `magic_service.*` records, not institutions or access grants.
- Source modes cover textual study, instruction, institutional study, supervised practice, observation, ritual context, and experimental study.
- Conditional implementation remains `0.5.236 - Magic Study Source Schema And Validator` with no content or normal lint registration.
- `docs/dev/tmp-magic-knowledge-study-systems-research-2026-06-20.md` was deleted after full promotion and has no remaining consumer.

## Consolidated Near-Term Queue

1. `0.5.225 - Polity Schema Decision`
2. `0.5.226 - Household vs Family Schema Decision`
3. `0.5.227 - Settlement Economy Schema Decision`
4. `0.5.228 - World Map Feature Authority Schema Decision`
5. `0.5.229 - Hazard And Route Security Boundary Decision`

No new Deep Research is required before this queue. GPT-DR labels remain non-Codex labels and do not consume `0.5.x` numbers. Permanent prompt-pack guidance remains active but does not interrupt the numbered queue.

## Next Route Boundary

`Version 0.5.225 - Polity Schema Decision` remains documentation-only. It must define exact polity paths, wrapper, ids, form/status fields, physical-place references, government/claim posture, provenance, forbidden fields, validation ownership, staging, and civic research artifact disposition.

It must not implement schemas, validators, content, tests, government, jurisdiction, law, faction/institution, diplomacy, conflict, player legal state, runtime, UI, storage, migration, or gameplay behavior.
