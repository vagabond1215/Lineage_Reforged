# Current GPT Handoff

Source version/run: Version 0.5.309 - Combat Status Condition Injury Evidence Audit
Date: 2026-07-09

## Status

`Version 0.5.309 - Combat Status Condition Injury Evidence Audit` completed a docs-only evidence audit for the future static combat health vocabulary lane.

Latest completed primary:

- `Version 0.5.309 - Combat Status Condition Injury Evidence Audit`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.310 - Combat Status Condition Injury Schema And Validator`

## Combat Status / Condition / Injury Evidence-Audit Posture

No canonical static combat health vocabulary exists yet:

- no `packages/content/base/game/combat_health_vocabulary.json`
- no `packages/schemas/game/combat-health-vocabulary.schema.json`
- no `tools/content-lint/combat-health-vocabulary.mjs`
- no `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`
- no normal content-lint registration in `tools/content-lint/index.mjs`

The accepted future authority posture remains one combined typed catalog:

- future content: `packages/content/base/game/combat_health_vocabulary.json`
- future schema: `packages/schemas/game/combat-health-vocabulary.schema.json`
- future validator: `tools/content-lint/combat-health-vocabulary.mjs`
- future focused tests: `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`

Records should carry `kind: "status"`, `kind: "condition"`, or `kind: "injury"` and use ids shaped as:

- `combat_status.<slug>`
- `combat_condition.<slug>`
- `combat_injury.<slug>`

## Candidate Evidence Summary

Strong first-pass evidence exists for status vocabulary only:

- `combat_status.stagger` from abilities, spells, skill effects, item use profiles, combat hook support, and engine runtime support.
- `combat_status.bind` from spells, skill effects, spell hook support, combat hook support, and engine runtime support.

Possible later status evidence exists for:

- `combat_status.stun`
- `combat_status.prone`
- `combat_status.pinned`
- `combat_status.hamstrung`
- `combat_status.protect`
- `combat_status.ward`
- `combat_status.grappled`

Condition evidence is deferred:

- `combat_condition.blind`
- `combat_condition.slow`
- `combat_condition.burn`
- `combat_condition.curse`
- `combat_condition.poison`

No injury record should be selected from current evidence without stronger direct evidence or later `GPT-DR.health.injury-recovery`.

## Rejected / Deferred Evidence Summary

Current strings remain evidence only:

- `incapacitated`, `helpless`, and `parry_window` are unsafe first-seed vocabulary because they imply runtime combatant state, execution predicates, or reaction timing.
- `debuff.disabled` and `status.sleep` are deferred despite runtime support because they are close to capability locking or lack direct authored evidence in the required content surfaces.
- Deferred spell hooks such as `buff.regeneration`, `restore.mp`, `restore.stamina`, `status.burn`, `status.slow`, `debuff.blind`, and `debuff.curse` must not be seeded as behavior-bearing records.
- Item use profiles, monster action packages, encounter templates, spawn profiles, combat roles, and tactics presets remain evidence-only and should stay untouched.

## Relationship-Field Posture

Relationship fields should remain absent from the first schema/validator implementation and first live seed.

Do not validate `relatedAbilityIds`, `relatedSpellIds`, `relatedSkillEffectIds`, `relatedItemKeys`, `relatedMonsterIds`, or cross-kind relationship fields in the first schema/validator run. Reconsider them only in a later seed plan after exact records are selected.

## Deep Research / Question / Support-Suffix Posture

`GPT-DR.health.injury-recovery` is not required before `Version 0.5.310 - Combat Status Condition Injury Schema And Validator`.

Run Deep Research before a later seed plan only if that plan selects broad health, injury, treatment, recovery, disease/poison, poison exposure, medicine, death/defeat, healing-service, or long-term injury vocabulary.

No nonstandard support-suffix run is needed.

No explicit user question is needed before proceeding to `Version 0.5.310 - Combat Status Condition Injury Schema And Validator`.

## Remaining Deferred Authority Guardrails

The next route should implement only the schema, pure focused validator, focused tests, and schema-file parse coverage for the combined static `combat_health_vocabulary` authority.

Do not create live content, register normal content lint, add relationship fields, edit existing combat/player/item/monster/tactics content, or add runtime behavior, UI, save/account behavior, damage/healing formulas, duration/tick/stack behavior, cure behavior, resistance/vulnerability execution, commands, events, rewards, migrations, or gameplay.

Resource/commodity expansion remains paused. Service authority remains stable. Generic `world.pois` remains rejected. The Highcrown settlement Knowledge lane remains closed.

Suggested next commit:

`docs(combat): audit status condition injury evidence`
