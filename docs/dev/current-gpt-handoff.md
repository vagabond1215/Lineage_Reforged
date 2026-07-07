# Current GPT Handoff

Source version/run: Version 0.5.287 - Service Authority Boundary Decision
Date: 2026-07-07

## Status

`Version 0.5.287 - Service Authority Boundary Decision` completed as a docs-only decision.

Decision: select a hybrid service model. Current service-like data remains controlled descriptors on existing/future owners. A future narrow static service authority is justified in principle only for provider-independent service identity and vocabulary, but implementation is deferred.

Latest completed primary:

- `Version 0.5.287 - Service Authority Boundary Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.288 - Resource And Commodity Schema Decision`

## Current Versioning Posture

Three-segment labels such as `0.5.287` are primary roadmap versions. Four-segment labels such as `0.5.276.1` are support-run suffixes and do not consume planned primary roadmap slots.

`0.5.287` completed as the next primary after `0.5.286`.

## Highcrown Knowledge Lane Posture

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

Do not plan additional Highcrown settlement/district/site General Lore snippets unless a later owner decision explicitly reopens that lane.

## Service Boundary Posture

Selected model:

- Keep current service-like descriptors on existing and future owner records.
- Approve only a deferred, narrow future static service catalog in principle, likely `civilization.services`.
- Limit any future service catalog to provider-independent identity/vocabulary.
- Require a separate schema decision, fresh live-repo audit, and seed plan before implementation.

Static service authority must not own provider current availability, schedules, appointments, access checks, prices, payment, discounts, taxes, stock, shop inventory, item instances, item movement, storage contents, training/healing/repair effects, lodging/rest effects, banking/wallet behavior, travel execution, cargo movement, legal status, reputation/favorability/standing mutation, UI menus, commands, events, rewards, save state, runtime state, or gameplay behavior.

Existing `civilization.buildings.serviceFunctions`, building storage profiles, hosted workplaces, settlement economy posture, NPC/service-provider references, vendor/shop implications, route/travel-facing facilities, and civic/law/reputation gates remain owned by their current/future domain owners.

## Next Route Guardrail

`Version 0.5.288 - Resource And Commodity Schema Decision` should be docs-first.

It must not add service content, resource content, combat content, Knowledge snippets, Knowledge registry/domain/trial-policy content, content JSON files, schemas, validators, tests, runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, settlement/district/site content, anchors, sacred-site/religious-hotspot content, or gameplay behavior unless a later focused implementation prompt explicitly scopes that work.

Suggested next commit:

`docs(roadmap): decide service authority boundary`
