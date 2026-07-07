# Current GPT Handoff

Source version/run: Version 0.5.289 - Combat Status Condition And Injury Boundary Decision
Date: 2026-07-07

## Status

`Version 0.5.289 - Combat Status Condition And Injury Boundary Decision` completed as a docs-only decision.

Decision: select a limited hybrid combat status/condition/injury boundary. A future typed, non-executing static vocabulary/catalog is justified in principle, with records distinguished as status, condition, or injury. Implementation is deferred to a later schema plan and seed plan.

Static vocabulary may describe identity, family, tags, source domains, persistence posture, and non-executing semantics only. Active status instances, stacks, magnitudes, source/target actors, timers, HP/MP/stamina changes, body-state math, wounds, injury instances, disease/poison exposure, treatment, recovery, scars, death, defeat, save/account state, runtime, UI, commands, events, rewards, and gameplay remain outside static authority.

Latest completed primary:

- `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.290 - Static Authority Validation Consolidation Audit`

## Current Versioning Posture

Three-segment labels such as `0.5.289` are primary roadmap versions. Four-segment labels such as `0.5.276.1` are support-run suffixes and do not consume planned primary roadmap slots.

`0.5.289` completed as the next primary after `0.5.288`.

## Highcrown Knowledge Lane Posture

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`.

Do not plan additional Highcrown settlement/district/site General Lore snippets unless a later owner decision explicitly reopens that lane.

## Service Boundary Posture

`Version 0.5.287 - Service Authority Boundary Decision` selected a hybrid service model.

Current service-like descriptors remain on existing and future owner records. A future narrow static service catalog, likely `civilization.services`, is justified in principle only for provider-independent identity/vocabulary and requires a separate schema decision, fresh live-repo audit, and seed plan before implementation.

Services do not own status, condition, or injury execution. Healing, treatment, repair, lodging/rest effects, access checks, provider availability, prices, stock, transactions, storage contents, UI, runtime, and gameplay remain outside static service authority.

## Resource / Commodity Posture

`Version 0.5.288 - Resource And Commodity Schema Decision` approved separate future static `world.resources` and `world.commodities` authorities in principle.

Resources identify source materials and environmental compatibility. Commodities identify bulk trade or economic classes. `items.items` continues to own individual inventory item identity and canonical item keys. Implementation remains deferred until a separate schema plan and seed plan.

Static resource/commodity authority must not own prices, stock, item instances, cargo movement, storage contents, services, extraction, trading, crafting execution, runtime, UI, or gameplay behavior.

## Combat Status / Condition / Injury Posture

The new combat boundary preserves existing owners:

- `CombatStatusEffectState` remains runtime instance state, not a static catalog.
- Player `resources`, `resourceRuntime`, `bodyState`, and `activeEffects` remain player/runtime/save state.
- `world.monsters`, `world.encounter_templates`, `world.spawn_profiles`, `game.combat_roles`, and `game.tactics_presets` keep their current static combat-adjacent authority without status/condition/injury expansion.
- Spell, item, ability, and skill hooks may remain source metadata or runtime inputs; they do not define active applied status or injury state.

Any future static status/condition/injury schema must reject active stacks, source actors, target actors, magnitudes on actors, start/expiry ticks, resource deltas, body-state math, wound instances, treatment progress, recovery timers, death/defeat state, save/account state, commands, events, rewards, UI, storage, and gameplay behavior.

## Next Route Guardrail

`Version 0.5.290 - Static Authority Validation Consolidation Audit` should be docs-first and audit settled static authority lanes before further seeds.

It must not add content, schemas, validators, tests, runtime/UI/storage/commands/events/rewards/migrations/save-account behavior, combat status/injury behavior, resource/commodity/service implementation, Knowledge snippets, Knowledge registry/domain/trial-policy content, settlement/district/site content, sacred-site/religious-hotspot content, or gameplay behavior unless a later focused implementation prompt explicitly scopes that work.

Suggested next commit:

`docs(roadmap): decide combat status injury boundary`
