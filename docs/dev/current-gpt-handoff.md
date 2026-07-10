# Current GPT Handoff

Source version/run: Version 0.5.310 - Combat Status Condition Injury Schema And Validator
Date: 2026-07-09

## Status

`Version 0.5.310 - Combat Status Condition Injury Schema And Validator` completed the narrow schema/validator implementation for the future static combat health vocabulary lane.

Latest completed primary:

- `Version 0.5.310 - Combat Status Condition Injury Schema And Validator`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.311 - Combat Status Condition Injury Seed Plan`

## Combat Health Vocabulary Implementation Posture

Implemented:

- `packages/schemas/game/combat-health-vocabulary.schema.json`
- `tools/content-lint/combat-health-vocabulary.mjs`
- `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`
- schema-file parse coverage in `tests/unit/schema-files.test.mjs`

Still absent by design:

- `packages/content/base/game/combat_health_vocabulary.json`
- normal content-lint registration in `tools/content-lint/index.mjs`

The implemented authority is one combined typed catalog for future records:

- `kind: "status"` with ids shaped as `combat_status.<slug>`
- `kind: "condition"` with ids shaped as `combat_condition.<slug>`
- `kind: "injury"` with ids shaped as `combat_injury.<slug>`

The validator is pure and in-memory only. It validates strict records-only wrapper shape, required fields, duplicate ids/slugs/names, kind-specific id prefixes, slug/id coherence, lifecycle status, family vocabulary, owner vocabulary, non-empty string notes, non-empty unique lower-snake tags, forbidden intent tags, and recursive forbidden fields.

## Guardrails For Next Route

`Version 0.5.311 - Combat Status Condition Injury Seed Plan` should be docs-first.

It should select only a tiny planned-only future seed, likely status-first from the strongest existing evidence:

- `combat_status.stagger`
- possibly `combat_status.bind`

Keep deferred unless the seed plan proves otherwise:

- condition records such as burn, slow, blind, curse, and poison
- all injury records
- relationship fields
- normal content-lint registration
- live content implementation
- runtime/UI/save/account/gameplay behavior

Relationship fields remain absent from the first schema/validator and should remain absent from the first seed unless a later seed plan explicitly proves exact safe references.

## Deep Research / Question Posture

Deep Research is not required before a tiny status-first seed plan.

Run `GPT-DR.health.injury-recovery` before any seed plan that selects broad health, injury, treatment, recovery, disease/poison, poison exposure, medicine, death/defeat, healing-service, or long-term injury vocabulary.

No explicit user question is needed before proceeding to `Version 0.5.311 - Combat Status Condition Injury Seed Plan`.

## Remaining Deferred Authority Guardrails

Do not create live combat health content, register normal content lint, add relationship fields, edit existing combat/player/item/monster/tactics content, or add runtime behavior, UI, save/account behavior, damage/healing formulas, duration/tick/stack behavior, cure behavior, resistance/vulnerability execution, commands, events, rewards, migrations, or gameplay unless a later prompt explicitly scopes that work.

Resource/commodity expansion remains paused. Service authority remains stable. Generic `world.pois` remains rejected. The Highcrown settlement Knowledge lane remains closed.

Suggested next commit:

`feat(combat): add combat health vocabulary schema`
