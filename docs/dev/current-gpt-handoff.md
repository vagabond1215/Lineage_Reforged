# Current GPT Handoff

Source version/run: Version 0.5.317 - Roadmap Next Authority Selection
Date: 2026-07-10

## Status

Latest completed primary:

- `Version 0.5.317 - Roadmap Next Authority Selection`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.318 - People NPC Authority Evidence Audit`

## Selection Posture

People/NPC is selected for a fresh docs-only evidence audit. Service, resource/commodity, and combat health remain stable and paused. Generic `world.pois` remains rejected, and Highcrown settlement Knowledge remains closed.

## Selected Lane And Rationale

People/NPC already has boundary/schema decisions, separate schemas, a pure validator, focused tests, and a prior people-first seed plan. However, live `people.json` and `npcs.json`, normal lint registration, and an approved canonical named-person seed list are absent. The prior seed implementation deferred rather than infer canon.

The next run should audit current canonical identity evidence and decide whether any later tiny people-only seed plan is justified. A no-safe-candidate result remains acceptable.

## Deep Research / Question / Support-Suffix Posture

Deep Research is not required before the evidence audit because canonical identity must come from repo evidence or explicit user-authored canon. No explicit user question or support-suffix run is required before `Version 0.5.318`.

## Remaining Deferred Authority Guardrails

Do not create people or NPC records in the evidence audit. Do not infer canon from quest contacts, `npc.*` strings, generated operators, combatants, player/account identities, roles, titles, workplaces, Knowledge vocabulary, deities, organizations, or prose alone.

Do not add NPC overlays, generated people, roles, affiliations, relationships, schedules, dialogue, services, companions, AI, inventory, combat profiles, runtime, UI, save/account behavior, or gameplay.

Service, resource/commodity, and combat health remain paused. Generic `world.pois` remains rejected. Highcrown Knowledge remains closed.

Suggested next commit:

`docs(roadmap): select next authority lane`
