# Current GPT Handoff

Source version/run: Version 0.5.323 - Faction Authority Schema Plan
Date: 2026-07-11

## Status

Latest completed primary:

- `Version 0.5.323 - Faction Authority Schema Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.324 - Faction Authority Schema And Validator`

## Faction Schema-Plan Posture

`docs/design/faction-authority-schema-plan.md` defines future `civilization.factions` as strict static identity authority only. Planned paths are `packages/content/base/civilization/factions.json`, `packages/schemas/civilization/faction.schema.json`, `tools/content-lint/factions.mjs`, and `tests/unit/faction-validation.test.mjs`.

Use the established `{ "records": [...] }` wrapper, not `schemaVersion` plus `factions`. Require `id`, `slug`, `name`, `status`, `category`, `publicPosture`, `summary`, `sourceAuthorityNotes`, and `notes`. Allow no cross-authority references in the first contract. Live content, candidates, and normal content-lint registration remain absent and unauthorized.

## Selected Option And Rationale

Schema/validator implementation is selected next because the boundary, strict record shape, enum vocabulary, validator behavior, and focused-test posture are decision-complete without live faction evidence. Excluding first-pass references prevents accidental affiliation, control, membership, or relationship semantics.

`0.5.324` may add only the schema, pure in-memory validator, focused tests, and schema-file parse coverage. It must not create the live wrapper or edit normal content-lint registration.

## Deep Research / Question / Support-Suffix Posture

Deep Research is not required before `0.5.324`. No explicit user question or support-suffix run is needed. Explicit user authorship or a new durable canonical source remains required before a later seed can approve records.

## Remaining Deferred Authority Guardrails

No faction seed or `faction.*` id is approved. Reject inference from guilds, religious orders, polities, governments, businesses, families/houses, quests, backstory hooks, settlements, movement/ideology labels, shadow networks, runtime groups, or standing/reputation.

Keep organization/institution/office, government/jurisdiction/law/force, business/company, provider, membership/affiliation/rank, relationships, and local reputation/standing/favorability separate and deferred. Do not add People/NPCs, services/access, territory, diplomacy/conflict, runtime, UI, save/account, or gameplay.

Service, resource/commodity, combat health, and People/NPC remain paused. Generic `world.pois` remains rejected. Highcrown Knowledge remains closed.

Suggested next commit:

`docs(civ): plan faction authority schema`
