# Current GPT Handoff

Source version/run: Version 0.5.315 - Combat Status Condition Injury Post-Registration Audit
Date: 2026-07-10

## Status

Latest completed primary:

- `Version 0.5.315 - Combat Status Condition Injury Post-Registration Audit`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.316 - Combat Status Condition Injury Next Expansion Gate`

## Post-Registration Audit Posture

Registration is stable, exact-once, and correctly scoped. No registration follow-up or immediate status/condition/injury expansion is needed or authorized.

The next route is a docs-first gate that should decide whether the combat health lane pauses, plans a tiny evidence-backed later status step, requires health/injury Deep Research, or routes elsewhere.

## Exact Live Seed Summary

`packages/content/base/game/combat_health_vocabulary.json` remains exactly two records:

- `combat_status.stagger`
- `combat_status.bind`

Both remain planned control-family statuses. Conditions, injuries, relationships, class/severity/phase fields, active records, runtime/UI/save/account/gameplay fields, and execution semantics remain absent.

## Exact-Once Registration Summary

`tools/content-lint/index.mjs` contains exactly:

- one import of `validateCombatHealthVocabularyContent`;
- one normal checks entry for the live wrapper;
- one validator helper call;
- one `main()` helper invocation.

The registration helper loads only the live wrapper and `packages/schemas/game/combat-health-vocabulary.schema.json`. Adjacent authority, runtime, UI, save/account, app, and game-engine dependencies remain absent.

## Validation Posture

- Focused tests: 90 passing
- Schema-file tests: 102 passing
- Normal content lint: passing at 67 checked files
- Exact live seed and forbidden-field assertions: passing
- Exact-once and narrow helper-dependency assertions: passing

## Deep Research / Question / Support-Suffix Posture

Deep Research is not required before the docs-first next-expansion gate. No explicit user question or support-suffix run is required before `Version 0.5.316`.

Reserve `GPT-DR.health.injury-recovery` for broad health, injury, treatment, recovery, disease/poison, medicine, death/defeat, healing-service, or long-term injury work.

## Remaining Deferred Authority Guardrails

Do not implement expansion in the next gate. Do not add statuses, conditions, injuries, relationships, class/severity/phase fields, active records, damage/healing formulas, duration/tick/stack behavior, cures, resistance/vulnerability execution, runtime, UI, save/account behavior, commands, events, rewards, migrations, or gameplay.

Resource/commodity expansion remains paused. Service authority remains stable. Generic `world.pois` remains rejected. The Highcrown settlement Knowledge lane remains closed.

Suggested next commit:

`docs(combat): audit combat health lint registration`
