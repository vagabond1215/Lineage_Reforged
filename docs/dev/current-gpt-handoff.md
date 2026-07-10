# Current GPT Handoff

Source version/run: Version 0.5.312 - Combat Status Condition Injury Seed
Date: 2026-07-10

## Status

`Version 0.5.312 - Combat Status Condition Injury Seed` created the first live static combat health vocabulary seed.

Latest completed primary:

- `Version 0.5.312 - Combat Status Condition Injury Seed`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.313 - Combat Status Condition Injury Lint Registration Decision`

## Live Seed Posture

The live seed now exists at:

- `packages/content/base/game/combat_health_vocabulary.json`

It contains exactly two planned-only status records:

- `combat_status.stagger`
- `combat_status.bind`

No condition records, injury records, active records, relationship fields, class/severity/phase fields, runtime fields, UI fields, save/account fields, or gameplay fields were added.

Normal content-lint registration remains absent. `tools/content-lint/index.mjs` has no `combat-health-vocabulary.mjs`, `combat_health_vocabulary.json`, or `validateCombatHealthVocabularyContent` reference.

## Exact Live Records

`packages/content/base/game/combat_health_vocabulary.json` contains exactly:

- `combat_status.stagger`
  - `slug`: `stagger`
  - `name`: `Stagger`
  - `kind`: `status`
  - `status`: `planned`
  - `family`: `control`
  - `allowedOwnerTypes`: `combat_runtime`, `ability`, `spell`, `skill_effect`, `item_use_profile`
  - `tags`: `control`, `disruption`
- `combat_status.bind`
  - `slug`: `bind`
  - `name`: `Bind`
  - `kind`: `status`
  - `status`: `planned`
  - `family`: `control`
  - `allowedOwnerTypes`: `combat_runtime`, `spell`, `skill_effect`
  - `tags`: `control`, `restraint`

The exact summaries, source authority notes, and notes match `docs/design/combat-status-condition-injury-seed-plan.md`.

## Deferred Status / Condition / Injury Posture

Defer these possible later status records:

- `combat_status.stun`
- `combat_status.prone`
- `combat_status.pinned`
- `combat_status.hamstrung`
- `combat_status.protect`
- `combat_status.ward`
- `combat_status.grappled`

Defer these condition records:

- `combat_condition.blind`
- `combat_condition.slow`
- `combat_condition.burn`
- `combat_condition.curse`
- `combat_condition.poison`

Defer all `combat_injury.*` records.

No relationship fields, condition/class/severity/phase fields, active status values, runtime behavior, UI, save/account behavior, or gameplay should be added in the next seed.

## Focused Validation Posture

`tests/unit/combat-status-condition-injury-authority-validation.test.mjs` now validates the live seed through `validateCombatHealthVocabularyContent(...)`, proves the exact two ids, exact record values, planned-only status, status-only kind, absence of conditions/injuries, absence of relationship/class/severity/phase fields, absence of forbidden runtime/UI/save/account/gameplay fields, and continued normal-lint registration absence.

## Deep Research / Question / Support-Suffix Posture

Deep Research is not required before the tiny two-status seed.

Run `GPT-DR.health.injury-recovery` before any later seed plan that selects broad health, injury, treatment, recovery, disease/poison, poison exposure, medicine, death/defeat, healing-service, or long-term injury vocabulary.

No explicit user question or support-suffix run is needed before proceeding to `Version 0.5.313 - Combat Status Condition Injury Lint Registration Decision`, assuming that run remains docs-only.

## Remaining Deferred Authority Guardrails

The next route should decide, in documentation only, whether the new live `combat_health_vocabulary` seed should be registered in normal content lint.

Do not directly implement normal content-lint registration in the decision run. Do not add relationship fields, expand status catalog breadth, add condition or injury records, edit existing combat/player/item/monster/tactics/resource/commodity/service content, or add runtime behavior, UI, save/account behavior, damage/healing formulas, duration/tick/stack behavior, cure behavior, resistance/vulnerability execution, commands, events, rewards, migrations, or gameplay.

Resource/commodity expansion remains paused. Service authority remains stable. Generic `world.pois` remains rejected. The Highcrown settlement Knowledge lane remains closed.

Suggested next commit:

`feat(combat): seed combat health vocabulary`
