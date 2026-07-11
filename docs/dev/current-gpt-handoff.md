# Current GPT Handoff

Source version/run: Version 0.5.329 - Institution Authority Schema Plan
Date: 2026-07-11

## Status

Latest completed primary:

- `Version 0.5.329 - Institution Authority Schema Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.330 - Institution Authority Schema And Validator`

## Accepted Institution Contract

- Authority: `civilization.institutions`.
- Future content path: `packages/content/base/civilization/institutions.json` (must remain absent in `0.5.330`).
- Schema: `packages/schemas/civilization/institution.schema.json`.
- Pure validator: `tools/content-lint/institutions.mjs`.
- Focused tests: `tests/unit/institution-validation.test.mjs`.
- Strict records-only wrapper; exact fields `id`, `slug`, `name`, `status`, `category`, `publicPosture`, `summary`, `sourceAuthorityNotes`, and `notes`.
- Identity is `institution.<lower_snake_slug>` with exact id/slug coherence.
- Lifecycle is `planned|active|retired`.
- Category is `civic|administrative|judicial|scholarly|charitable|educational|archival|medical|other`.
- Public posture is descriptive visibility only: `public|semi_public|secret|unknown`.
- No first-pass references or resolver logic.

## Guardrails

No live wrapper, candidate id, normal content-lint registration, office work, consumer enablement, or behavior is authorized. Knowledge/Magic Study, backstory, service-provider, quest, derived/runtime, UI, and prose institution vocabulary is not canon and remains fail closed.

Preserve government/jurisdiction/law/force, guild, faction, religion/order, business, family, place/facility, service/provider, profession/role, People/NPC, membership/employment/office-holder, reputation/access, Knowledge/magic, and runtime owners.

Faction and People/NPC remain authored-input blocked. Service, resource/commodity, and combat health remain paused. Generic `world.pois` remains rejected. Highcrown Knowledge remains closed. Office remains not schema-ready.

No Deep Research, support-suffix run, or explicit user question is required before `0.5.330`.

Suggested next commit:

`docs(civ): plan institution authority schema`
