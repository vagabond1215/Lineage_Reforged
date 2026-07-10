# Combat Status Condition Injury Lint Registration Decision

Source version/run: Version 0.5.313 - Combat Status Condition Injury Lint Registration Decision
Date: 2026-07-10
Status: documentation-only decision; no registration implemented

## Decision Summary

Approve normal content-lint registration in principle for the existing live `combat_health_vocabulary` seed, but defer implementation to a separate narrow run.

The future registration should reuse the existing schema and pure focused validator for the one live file. This decision does not edit `tools/content-lint/index.mjs`, content, schema, validator, or tests.

Immediate next route:

- `Version 0.5.314 - Combat Status Condition Injury Lint Registration`

## Current Completed-State Posture

- `Version 0.5.312 - Combat Status Condition Injury Seed` completed the live seed.
- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit` remains the latest support/audit run.
- The resource/commodity lane is stable and paused.
- Service authority is stable and needs no continuation here.
- Generic `world.pois` remains rejected.
- The Highcrown settlement Knowledge lane remains closed.

## Live Seed Audit

Live path:

- `packages/content/base/game/combat_health_vocabulary.json`

The records-only wrapper contains exactly two records, in this authored order:

1. `combat_status.stagger`
2. `combat_status.bind`

Both records have `kind: "status"` and `status: "planned"`. No condition or injury records exist.

The live wrapper contains none of the following:

- relationship fields;
- `conditionClass`, `injuryClass`, `severityBand`, or `combatPhaseTags`;
- active records;
- duration, tick, stack, magnitude, actor, damage, healing, cure, immunity, resistance, or vulnerability execution fields;
- runtime, UI, save, account, command, event, reward, migration, or gameplay fields.

The seed therefore remains static descriptive vocabulary only.

## Validation Audit

Focused validation is implemented by:

- schema: `packages/schemas/game/combat-health-vocabulary.schema.json`;
- validator: `tools/content-lint/combat-health-vocabulary.mjs`;
- focused tests: `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`;
- schema parse coverage: `tests/unit/schema-files.test.mjs`.

Fresh validation confirmed:

- the live wrapper returns `{ ok: true, recordIds: ["combat_status.bind", "combat_status.stagger"] }` through `validateCombatHealthVocabularyContent(...)`;
- the focused suite passes all 90 tests;
- schema-file validation passes all 102 tests, including the combat health schema;
- normal content lint passes today with `content-lint: ok (66 files checked)` even though the combat health file is not registered.

The focused validator is registration-ready as-is. It is a pure exported helper, accepts `relativePath`, `wrapper`, and `schema`, and does not load runtime, UI, app, save, or account code.

## Current Normal-Lint Registration Absence Audit

`tools/content-lint/index.mjs` currently contains:

- no import from `./combat-health-vocabulary.mjs`;
- no `packages/content/base/game/combat_health_vocabulary.json` entry in the normal `checks` list;
- no `validateCombatHealthVocabularyContent(...)` helper call.

Normal content lint can therefore pass while remaining unaware of drift in the live combat health vocabulary file. Focused test coverage proves the file today, but it is not a substitute for normal authored-content registration.

## Registration Decision

Approve normal content-lint registration in principle.

Implementation is deferred to `Version 0.5.314 - Combat Status Condition Injury Lint Registration` because this run is docs-only. No blocker was found in the live seed, schema, focused validator, focused tests, or schema parse coverage.

Registration is appropriate because the content file is now live authored authority, the existing validator enforces its intended static-only boundary, and the required dependency surface is only the live wrapper plus its schema. Leaving it focused-only indefinitely would allow the normal lint command to miss future drift.

## Future Registration Implementation Plan

The next run should narrowly:

1. Import `validateCombatHealthVocabularyContent` from `./combat-health-vocabulary.mjs` in `tools/content-lint/index.mjs` exactly once.
2. Add `packages/content/base/game/combat_health_vocabulary.json` to the normal `checks` list exactly once.
3. Add one local dependency-loading function that reads:
   - `packages/content/base/game/combat_health_vocabulary.json`;
   - `packages/schemas/game/combat-health-vocabulary.schema.json`.
4. Call `validateCombatHealthVocabularyContent({ relativePath, wrapper, schema })` exactly once through that function.
5. Invoke the function once from `main()` after generic file checks and alongside other dependency validators.
6. Update `tests/unit/combat-status-condition-injury-authority-validation.test.mjs` to prove the import, checks entry, validator call, and main invocation are present exactly once while preserving every live-seed and forbidden-field assertion.
7. Keep normal content lint passing and report the resulting checked-file count.

No item, market, resource, commodity, service, spell, ability, runtime, UI, save/account, or game-engine dependency is required for this registration.

## What Remains Excluded From Normal Lint Registration

The next run should register only the existing live static wrapper through its existing schema and validator. It should not register or add:

- additional status records;
- condition or injury records;
- relationship dependencies or relationship fields;
- class, severity, or phase fields;
- active records;
- combat role, tactics, encounter, monster, spawn profile, player ability, spell, skill, skill effect, or item dependencies;
- resource/commodity or service dependencies;
- runtime, UI, save/account, commands, events, rewards, migrations, formulas, ticking, stacking, cure, resistance, or gameplay behavior.

## Deep Research, Support-Suffix, And Explicit-Question Posture

Deep Research is not needed before registration. The decision concerns local validation wiring for an already selected, authored, and focused-validated two-record seed.

`GPT-DR.health.injury-recovery` remains deferred until broader health, injury, treatment, recovery, disease/poison, medicine, death/defeat, healing-service, or long-term injury vocabulary is considered.

No support-suffix run is needed. No explicit user question is needed before the next numbered route.

## Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Approve registration in principle | Selected | Live authored content and focused validation are stable; normal lint should eventually cover the file. |
| Implement registration now | Rejected | This run is explicitly docs-only. |
| Reject registration | Rejected | No content, schema, validator, or test blocker was found. |
| Broaden the seed before registration | Rejected | The exact two planned statuses are sufficient to prove the authority and lint path. |
| Run Deep Research now | Rejected | External grounding is unnecessary for local lint orchestration. |
| Pause the lane | Rejected | One narrow registration step remains before a later stability audit or lane gate. |

## Selected Option And Rationale

Select approval in principle with implementation deferred.

This is the smallest coherent next step: it recognizes that live authored content belongs in normal lint while preserving the docs-first decision boundary. The future implementation can remain limited to exact-once orchestration and its focused proof without changing the seed or expanding combat health authority.

## Risks And Mitigations

- Risk: registration could be mistaken for runtime combat-health implementation. Mitigation: register only the static wrapper through the existing non-executing validator.
- Risk: index wiring could be duplicated. Mitigation: add exact-once assertions for the import, checks entry, helper call, and main invocation.
- Risk: the next run could broaden the seed. Mitigation: preserve exactly `combat_status.stagger` and `combat_status.bind`, both planned statuses.
- Risk: adjacent authority dependencies could be introduced without need. Mitigation: load only the combat health wrapper and schema.
- Risk: checked-file expectations could drift. Mitigation: run normal content lint and report the observed count after registration.

## Explicit Non-Goals

This decision does not:

- edit `tools/content-lint/index.mjs` or implement normal lint registration;
- edit live combat health content, its schema, focused validator, focused tests, or schema-file tests;
- add or activate status records;
- add condition or injury records;
- add relationships, class/severity/phase fields, damage/healing formulas, duration/tick/stack behavior, cure behavior, immunity/resistance/vulnerability execution, or combat execution;
- edit combat role, tactics, encounter, monster, spawn, player ability, spell, skill, skill effect, item, resource/commodity, or service content;
- add runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay;
- run Deep Research or create temporary research artifacts;
- implement generic `world.pois` or reopen Highcrown settlement Knowledge.

## Decision Question Answers

1. Yes. Live `packages/content/base/game/combat_health_vocabulary.json` exists.
2. Yes. It contains exactly `combat_status.stagger` and `combat_status.bind`.
3. Yes. Both records are `kind: "status"`.
4. Yes. Both records are `status: "planned"`.
5. Yes. Condition records are absent.
6. Yes. Injury records are absent.
7. Yes. Relationship fields are absent.
8. Yes. Class, severity, and phase fields are absent.
9. Yes. Runtime, UI, save/account, and gameplay fields are absent.
10. Yes. The live wrapper validates through `validateCombatHealthVocabularyContent(...)` and returns the two sorted ids.
11. Yes. Focused tests pass: 90 tests.
12. Yes. Schema-file parse validation passes: 102 tests.
13. Yes. Normal content lint passes today at 66 checked files without this registration.
14. Yes. Normal content-lint registration is currently absent.
15. Yes. Registration should be approved in principle.
16. No. Registration must not be implemented in this docs-only decision run.
17. A future implementation should register only `packages/content/base/game/combat_health_vocabulary.json` through `packages/schemas/game/combat-health-vocabulary.schema.json` and `validateCombatHealthVocabularyContent({ relativePath, wrapper, schema })`, wired exactly once in `tools/content-lint/index.mjs` with exact-once focused assertions.
18. Additional records, conditions, injuries, relationships, class/severity/phase fields, active records, adjacent content dependencies, and all execution/state/presentation behavior remain out.
19. No. Deep Research is not needed before registration.
20. No. A support-suffix run is not needed.
21. No. An explicit user question is not needed before the next numbered route.
22. The immediate next route should be `Version 0.5.314 - Combat Status Condition Injury Lint Registration`.

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (`Already up to date.`)
- Required reads of current handoffs, sequence, roadmap, backlog, combat health planning/audit/decision docs, static authority audit, resource/commodity gate, pipeline consolidation decision, Deep Research prompt-pack decision, live content, schema, validator, focused tests, schema-file tests, and normal lint index.
- `node --test tests/unit/combat-status-condition-injury-authority-validation.test.mjs` (passed; 90 tests)
- `node --test tests/unit/schema-files.test.mjs` (passed; 102 tests)
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (66 files checked)`)
- Live seed and registration scans described above.
- Final docs-only scope, conflict-marker, whitespace, stale-route, and diff checks are recorded in `docs/dev/current-codex-output.md`.

## Next Recommended Version

Version 0.5.314 - Combat Status Condition Injury Lint Registration
