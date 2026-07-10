# Current GPT Handoff

Source version/run: Version 0.5.314 - Combat Status Condition Injury Lint Registration
Date: 2026-07-10

## Status

Latest completed primary:

- `Version 0.5.314 - Combat Status Condition Injury Lint Registration`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.315 - Combat Status Condition Injury Post-Registration Audit`

## Normal-Lint Registration Posture

`packages/content/base/game/combat_health_vocabulary.json` is now registered in normal content lint through:

- `packages/schemas/game/combat-health-vocabulary.schema.json`;
- `validateCombatHealthVocabularyContent(...)` from `tools/content-lint/combat-health-vocabulary.mjs`.

`tools/content-lint/index.mjs` contains exactly one validator import, one normal checks entry, one validator helper call, and one `main()` invocation. The helper loads only the live wrapper and its schema.

## Exact Live Seed Summary

The live wrapper remains exactly two planned status records:

- `combat_status.stagger`
- `combat_status.bind`

Both remain `kind: "status"`, `status: "planned"`, and `family: "control"`. Conditions, injuries, relationships, class/severity/phase fields, active records, runtime/UI/save/account/gameplay fields, and execution semantics remain absent.

## Validation Posture

- Focused tests: 90 passing
- Schema-file tests: 102 passing
- Normal content lint: passing at 67 checked files
- Exact-once registration assertions: passing
- Live seed exact-value and forbidden-field assertions: passing

## Deep Research / Question / Support-Suffix Posture

Deep Research is not required before the docs-only post-registration audit. No explicit user question or support-suffix run is required before `Version 0.5.315`.

Reserve `GPT-DR.health.injury-recovery` for later broad health, injury, treatment, recovery, disease/poison, medicine, death/defeat, healing-service, or long-term injury work.

## Remaining Deferred Authority Guardrails

The next run should audit registration stability only. Do not expand statuses, add conditions or injuries, add relationships, class/severity/phase fields, active records, damage/healing formulas, duration/tick/stack behavior, cures, resistance/vulnerability execution, runtime, UI, save/account behavior, commands, events, rewards, migrations, or gameplay.

Do not edit existing combat/player/item/monster/tactics/resource/commodity/service content. Resource/commodity expansion remains paused. Service authority remains stable. Generic `world.pois` remains rejected. The Highcrown settlement Knowledge lane remains closed.

Suggested next commit:

`feat(combat): register combat health lint`
