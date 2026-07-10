# Current GPT Handoff

Source version/run: Version 0.5.311 - Combat Status Condition Injury Seed Plan
Date: 2026-07-10

## Status

`Version 0.5.311 - Combat Status Condition Injury Seed Plan` completed the docs-only seed plan for the future static combat health vocabulary lane.

Latest completed primary:

- `Version 0.5.311 - Combat Status Condition Injury Seed Plan`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Immediate next primary route:

- `Version 0.5.312 - Combat Status Condition Injury Seed`

## Seed-Plan Posture

The new plan lives at:

- `docs/design/combat-status-condition-injury-seed-plan.md`

The plan selects exactly two future planned-only status records for a later live seed:

- `combat_status.stagger`
- `combat_status.bind`

No live content was created in this run. `packages/content/base/game/combat_health_vocabulary.json` remains absent.

Normal content-lint registration remains absent. `tools/content-lint/index.mjs` should stay untouched until live content exists and a later registration decision approves normal lint wiring.

## Exact Future Selected Records

Future `packages/content/base/game/combat_health_vocabulary.json` should contain exactly two records unless a fresh implementation audit finds a blocker:

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

Use the exact summaries, source authority notes, and notes from `docs/design/combat-status-condition-injury-seed-plan.md`.

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

## Deep Research / Question / Support-Suffix Posture

Deep Research is not required before the tiny two-status seed.

Run `GPT-DR.health.injury-recovery` before any seed plan that selects broad health, injury, treatment, recovery, disease/poison, poison exposure, medicine, death/defeat, healing-service, or long-term injury vocabulary.

No explicit user question or support-suffix run is needed before proceeding to `Version 0.5.312 - Combat Status Condition Injury Seed`, assuming the implementation prompt remains narrow.

## Remaining Deferred Authority Guardrails

The next route should create only:

- `packages/content/base/game/combat_health_vocabulary.json`

with exactly the two planned status records selected in the seed plan. It may update focused tests for live seed validation if needed.

Do not register normal content lint, add relationship fields, expand status catalog breadth, add condition or injury records, edit existing combat/player/item/monster/tactics/resource/commodity/service content, or add runtime behavior, UI, save/account behavior, damage/healing formulas, duration/tick/stack behavior, cure behavior, resistance/vulnerability execution, commands, events, rewards, migrations, or gameplay.

Resource/commodity expansion remains paused. Service authority remains stable. Generic `world.pois` remains rejected. The Highcrown settlement Knowledge lane remains closed.

Suggested next commit:

`docs(combat): plan combat health vocabulary seed`
