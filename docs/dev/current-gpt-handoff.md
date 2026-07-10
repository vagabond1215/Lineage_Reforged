# Current GPT Handoff

Source version/run: Version 0.5.316 - Combat Status Condition Injury Next Expansion Gate
Date: 2026-07-10

## Status

Latest completed primary:

- `Version 0.5.316 - Combat Status Condition Injury Next Expansion Gate`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.317 - Roadmap Next Authority Selection`

## Next-Expansion Gate Posture

The combat health lane is paused. Registration is stable, no follow-up is needed, and no immediate status, condition, or injury expansion or planning is authorized.

The next run should compare current deferred authority lanes and select the next docs-first route without implementing content.

## Exact Live Seed Summary

`packages/content/base/game/combat_health_vocabulary.json` remains exactly:

- `combat_status.stagger`
- `combat_status.bind`

Both remain planned control-family statuses. Conditions, injuries, relationships, class/severity/phase fields, active records, runtime/UI/save/account/gameplay fields, and execution semantics remain absent.

## Exact-Once Registration Summary

Normal content-lint registration still contains exactly one validator import, one checks entry, one validator helper call, and one `main()` helper invocation.

The helper loads only the live wrapper and combat health schema. Adjacent authority, runtime, UI, save/account, app, and game-engine dependencies remain absent.

## Validation Posture

- Focused tests: 90 passing
- Schema-file tests: 102 passing
- Normal content lint: passing at 67 checked files
- Exact seed, forbidden-field, exact-once, and helper-isolation assertions: passing

## Deep Research / Question / Support-Suffix Posture

Deep Research is not required before `Version 0.5.317`. No explicit user question or support-suffix run is required.

`GPT-DR.health.injury-recovery` remains required before later broad health, injury, treatment, recovery, disease/poison, medicine, death/defeat, healing-service, or long-term injury work.

## Remaining Deferred Authority Guardrails

Do not reopen combat health during roadmap selection without fresh evidence and an explicit route. Do not add statuses, conditions, injuries, relationships, class/severity/phase fields, active records, runtime, UI, save/account behavior, or gameplay.

Resource/commodity expansion remains paused. Service authority remains stable. Generic `world.pois` remains rejected. The Highcrown settlement Knowledge lane remains closed.

Suggested next commit:

`docs(combat): gate combat health expansion`
