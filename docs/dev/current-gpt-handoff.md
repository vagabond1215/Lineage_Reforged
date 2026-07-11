# Current GPT Handoff

Source version/run: Version 0.5.324 - Faction Authority Schema And Validator
Date: 2026-07-11

## Status

Latest completed primary:

- `Version 0.5.324 - Faction Authority Schema And Validator`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.325 - Faction Authority Seed Evidence Audit`

## Faction Schema / Validator Posture

`packages/schemas/civilization/faction.schema.json` now defines strict records-only `civilization.factions` static identity. `tools/content-lint/factions.mjs` exports pure `validateFactions(wrapper, options)` validation that returns human-readable issue strings without filesystem or owner dependencies. `tests/unit/faction-validation.test.mjs` covers the full contract and absence gates; schema parse coverage is active.

The contract requires `id`, `slug`, `name`, `status`, `category`, `publicPosture`, `summary`, `sourceAuthorityNotes`, and `notes`. It allows no cross-authority references and rejects all unknown fields.

## Live Content / Normal Registration Posture

`packages/content/base/civilization/factions.json` remains absent. No live faction candidate id is approved or present in content. `tools/content-lint/index.mjs` remains unchanged and contains no faction import, path/check, helper call, or invocation.

Normal registration remains deferred until live content exists and a separate decision approves exact-once wiring.

## Deep Research / Question / Support-Suffix Posture

Deep Research is not required before `0.5.325`. No explicit user question or support-suffix run is needed for the repository evidence audit. External research cannot manufacture project canon.

## Remaining Deferred Authority Guardrails

`0.5.325` should audit only durable canonical faction evidence against the accepted seed gate. Do not infer candidates from guilds, religious orders, polities, governments, businesses, families/houses, quests, backstory hooks, settlements, movement/ideology labels, shadow networks, runtime groups, or standing/reputation.

Keep organization/institution/office, government/jurisdiction/law/force, business/company, provider, membership/affiliation/rank, relationships, and local reputation/standing/favorability separate and deferred. Do not add content, registration, People/NPCs, services/access, territory, diplomacy/conflict, runtime, UI, save/account, or gameplay.

Service, resource/commodity, combat health, and People/NPC remain paused. Generic `world.pois` remains rejected. Highcrown Knowledge remains closed.

Suggested next commit:

`docs(civ): add faction authority schema validation`
