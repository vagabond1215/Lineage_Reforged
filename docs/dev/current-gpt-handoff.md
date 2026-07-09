# Current GPT Handoff

Source version/run: Version 0.5.308 - Combat Status Condition Injury Schema Plan
Date: 2026-07-09

## Status

`Version 0.5.308 - Combat Status Condition Injury Schema Plan` completed a docs-only schema plan for the future static combat health vocabulary lane.

Latest completed primary:

- `Version 0.5.308 - Combat Status Condition Injury Schema Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.309 - Combat Status Condition Injury Evidence Audit`

## Combat Status / Condition / Injury Schema-Plan Posture

The accepted future authority posture is one combined typed catalog for first implementation:

- future content: `packages/content/base/game/combat_health_vocabulary.json`
- future schema: `packages/schemas/game/combat-health-vocabulary.schema.json`
- future validator: `tools/content-lint/combat-health-vocabulary.mjs`
- future focused tests: `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`

Records should carry `kind: "status"`, `kind: "condition"`, or `kind: "injury"` and use ids shaped as:

- `combat_status.<slug>`
- `combat_condition.<slug>`
- `combat_injury.<slug>`

This combined-catalog decision follows `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`, which preferred one typed vocabulary/catalog planned as a unit over three immediate standalone authorities.

## Forbidden Behavior Posture

Future static records may define stable names, families/classes, descriptive summaries, tags, owner posture, source notes, and seed-approved static relationship hints.

Future static records must not own:

- active status instances, stacks, magnitudes, source actors, target actors, start ticks, expiry ticks, or current owners;
- HP/MP/stamina deltas, resource modifiers, body-state math, fatigue/hydration/intoxication/starvation values, recovery values, wounds, injury instances, disease or poison exposure, treatment, scars, death, defeat, or persistence;
- damage formulas, healing formulas, cure rules, duration/tick/stack behavior, immunity/resistance/vulnerability execution, combat roll modifiers, hit chance, crit chance, AI behavior, targeting, player commands, events, rewards, item grants, runtime state, save/account state, UI rendering, or gameplay effects.

Normal content-lint registration remains deferred until live content exists and a separate registration decision approves it.

## Evidence Posture For Next Run

The next docs-first run should audit current live evidence before any schema/validator implementation.

Inspect:

- `status.*`, `buff.*`, and `debuff.*` hooks in abilities, spells, skill effects, and item use profiles;
- ability `targetConditionsAny` strings;
- combat hook support, spell hook support, magic metadata, player body-state/resource-runtime contracts;
- monsters, encounters, spawn profiles, combat roles, tactics presets, and safe item-key evidence.

The evidence audit should decide exact first-pass vocabulary candidates and whether relationship fields should remain absent.

## Deep Research / Question / Support-Suffix Posture

Do not run `GPT-DR.health.injury-recovery` before the evidence audit by default. It remains useful later before broad health, injury, disease, poison, treatment, recovery, medicine, death/defeat, or healing-service work.

No nonstandard support-suffix run is needed.

No explicit user question is required before `Version 0.5.309 - Combat Status Condition Injury Evidence Audit`.

## Remaining Deferred Authority Guardrails

Do not implement status/condition/injury schemas, validators, tests, live content, normal lint registration, runtime behavior, UI, save/account behavior, combat execution, damage/healing formulas, duration/tick/stack behavior, cure behavior, immunity/resistance/vulnerability execution, events, rewards, commands, migrations, or gameplay without a later focused implementation prompt.

Resource/commodity expansion remains paused. Service authority remains stable. Generic `world.pois` remains rejected. The Highcrown settlement Knowledge lane remains closed.

Suggested next commit:

`docs(combat): plan status condition injury schemas`
