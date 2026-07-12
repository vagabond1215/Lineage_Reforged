# Current GPT Handoff

Source version/run: Version 0.5.330 - Institution Authority Schema And Validator
Date: 2026-07-11

## Status

Latest completed primary:

- `Version 0.5.330 - Institution Authority Schema And Validator`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.331 - Institution Authority Seed Evidence Audit`

## Implemented Institution Scaffold

- `packages/schemas/civilization/institution.schema.json`
- `tools/content-lint/institutions.mjs`
- `tests/unit/institution-validation.test.mjs`
- institution entry in `tests/unit/schema-files.test.mjs`

The strict contract uses records-only static identity, exact `institution.<slug>` coherence, lifecycle `planned|active|retired`, the approved category/public-posture vocabularies, trimmed provenance/notes, and no references. The pure validator does not read files or import normal lint.

Focused validation passes 120 tests; schema smoke passes 104 tests; normal content lint remains 67 files.

## Remaining Guardrails

No `packages/content/base/civilization/institutions.json`, normal registration, candidate id, reference, resolver, adapter, or consumer enablement exists. Knowledge/Magic Study, backstory, service provider, quest, prose, derived/runtime, demo, and UI institution vocabulary remains non-canonical and fail closed.

`0.5.331` must perform a narrow repository evidence audit against the exact seed gate. It may approve zero candidates and must not infer records from generic nouns or existing specific owners. Office remains not schema-ready.

Faction and People/NPC remain authored-input blocked. Service, resource/commodity, and combat health remain paused. Generic `world.pois` remains rejected. Highcrown Knowledge remains closed.

Suggested next commit:

`feat(civ): add institution authority validation`
