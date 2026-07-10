# Current GPT Handoff

Source version/run: Version 0.5.313 - Combat Status Condition Injury Lint Registration Decision
Date: 2026-07-10

## Status

Latest completed primary:

- `Version 0.5.313 - Combat Status Condition Injury Lint Registration Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.314 - Combat Status Condition Injury Lint Registration`

## Registration Decision Posture

Normal content-lint registration is approved in principle for the live combat health vocabulary seed. Implementation was intentionally deferred because `0.5.313` was docs-only.

The next run should narrowly register the existing live file in `tools/content-lint/index.mjs` through the existing schema and `validateCombatHealthVocabularyContent(...)`. It should add exact-once focused assertions and keep normal content lint passing.

## Live Seed Summary

`packages/content/base/game/combat_health_vocabulary.json` contains exactly:

- `combat_status.stagger`
- `combat_status.bind`

Both records are planned statuses. Conditions, injuries, relationships, class/severity/phase fields, active records, runtime/UI/save/account/gameplay fields, and execution semantics remain absent.

## Validation Posture

- Focused validator: `tools/content-lint/combat-health-vocabulary.mjs`
- Schema: `packages/schemas/game/combat-health-vocabulary.schema.json`
- Focused tests: 90 passing
- Schema-file tests: 102 passing
- Normal content lint: passing at 66 checked files without combat health registration
- Registration markers in `tools/content-lint/index.mjs`: all absent today

## Approved Future Registration Implementation

The next run should:

- import `validateCombatHealthVocabularyContent` exactly once;
- add `packages/content/base/game/combat_health_vocabulary.json` to `checks` exactly once;
- load only the live wrapper and combat health schema;
- call `validateCombatHealthVocabularyContent({ relativePath, wrapper, schema })` exactly once through a local helper;
- invoke that helper once from `main()`;
- update focused tests to prove exact-once registration;
- preserve the live seed unchanged and keep normal content lint passing.

No item, market, resource, commodity, service, spell, ability, runtime, UI, save/account, or game-engine dependency is needed.

## Deep Research / Question / Support-Suffix Posture

Deep Research is not required before registration. No explicit user question or support-suffix run is required before `Version 0.5.314`.

Reserve `GPT-DR.health.injury-recovery` for later broad health, injury, treatment, recovery, disease/poison, medicine, death/defeat, healing-service, or long-term injury work.

## Remaining Deferred Authority Guardrails

Do not add statuses, conditions, injuries, relationships, class/severity/phase fields, active records, damage/healing formulas, duration/tick/stack behavior, cures, resistance/vulnerability execution, runtime, UI, save/account behavior, commands, events, rewards, migrations, or gameplay.

Do not edit existing combat/player/item/monster/tactics/resource/commodity/service content. Resource/commodity expansion remains paused. Service authority remains stable. Generic `world.pois` remains rejected. The Highcrown settlement Knowledge lane remains closed.

Suggested next commit:

`docs(combat): decide combat health lint registration`
