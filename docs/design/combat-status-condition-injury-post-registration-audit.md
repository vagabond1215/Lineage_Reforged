# Combat Status Condition Injury Post-Registration Audit

Source version/run: Version 0.5.315 - Combat Status Condition Injury Post-Registration Audit
Date: 2026-07-10
Status: documentation-only post-registration audit

## Audit Summary

Normal content-lint registration for the live combat health vocabulary is stable, exact-once, and correctly scoped.

The live seed remains exactly two planned status records. Focused validation, schema-file validation, and normal content lint all pass. The registration helper loads only the live wrapper and its schema. No registration follow-up or immediate status, condition, or injury expansion is needed or authorized.

Selected next route:

- `Version 0.5.316 - Combat Status Condition Injury Next Expansion Gate`

That route should remain docs-first and decide whether the lane pauses, plans a tiny later status expansion, requires health/injury Deep Research, or routes elsewhere. It is not permission to implement expansion.

## Current Completed-State Posture

- `Version 0.5.314 - Combat Status Condition Injury Lint Registration` completed exact-once normal content-lint registration for the live seed.
- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit` remains the latest support/audit run.
- The resource/commodity lane is stable and paused.
- Service authority is stable and needs no continuation here.
- Generic `world.pois` remains rejected.
- The Highcrown settlement Knowledge lane remains closed.

## Live Seed Stability Check

Live path:

- `packages/content/base/game/combat_health_vocabulary.json`

The records-only wrapper remains exactly two records:

1. `combat_status.stagger`
2. `combat_status.bind`

Both records remain:

- `kind: "status"`;
- `status: "planned"`;
- `family: "control"`.

The live wrapper still contains no:

- condition or injury records;
- active records;
- relationship fields;
- `conditionClass`, `injuryClass`, `severityBand`, or `combatPhaseTags`;
- runtime, UI, save/account, command, event, reward, migration, or gameplay fields;
- damage or healing formulas;
- duration, tick, stack, or magnitude behavior;
- cure, immunity, resistance, or vulnerability execution.

The seed remains static descriptive vocabulary only.

## Registration Stability Check

Fresh source scans of `tools/content-lint/index.mjs` confirmed:

| Registration surface | Count |
| --- | ---: |
| Import of `validateCombatHealthVocabularyContent` from `./combat-health-vocabulary.mjs` | 1 |
| `packages/content/base/game/combat_health_vocabulary.json` entry in normal `checks` | 1 |
| `validateCombatHealthVocabularyContent({ ... })` helper call | 1 |
| `main()` invocation of `validateCombatHealthVocabularyAgainstDependencies()` | 1 |

`validateCombatHealthVocabularyAgainstDependencies()` loads exactly:

- `packages/content/base/game/combat_health_vocabulary.json`;
- `packages/schemas/game/combat-health-vocabulary.schema.json`.

It does not load abilities, spells, skill effects, items, markets, monsters, tactics, resources, commodities, services, runtime, UI, save/account, apps, or game-engine dependencies.

## Validation Evidence

Fresh validation passed:

- `node --test tests/unit/combat-status-condition-injury-authority-validation.test.mjs`: 90 tests passed;
- `node --test tests/unit/schema-files.test.mjs`: 102 tests passed;
- `npm.cmd run tool:content-lint`: `content-lint: ok (67 files checked)`.

The focused suite still proves the exact live record values, sorted ids, planned-only lifecycle, status-only kind, forbidden-field absence, validator purity, schema parse coverage, exact-once registration, and narrow helper dependency surface.

## Scope Audit

This run is documentation-only.

No edits are made to:

- `tools/content-lint/index.mjs`;
- live combat health content;
- the combat health schema;
- the focused validator;
- focused tests;
- schema-file tests;
- adjacent combat, player, item, monster, tactics, resource/commodity, or service content;
- runtime, UI, storage, commands, events, rewards, migrations, save/account, or gameplay code.

## Expansion Readiness Check

No immediate expansion is authorized.

The current two-record seed proves the static authority, validation, and registration shape. It does not establish a need for more statuses, conditions, injuries, relationships, class/severity/phase fields, or active records. Condition and injury work still risks crossing into health, treatment, recovery, disease/poison, persistence, death/defeat, or gameplay semantics that require a dedicated evidence and research decision.

A next-expansion gate is preferable to immediate implementation because it can explicitly compare:

- pausing the lane;
- a tiny evidence-backed status-only plan;
- health/injury Deep Research;
- routing to another deferred authority lane.

## Deep Research / Support-Suffix / Explicit-Question Posture

Deep Research is not needed before the immediate docs-first next-expansion gate.

`GPT-DR.health.injury-recovery` remains deferred until the next meaningful work requires broad health, injury, treatment, recovery, disease/poison, medicine, death/defeat, healing-service, or long-term injury vocabulary.

No support-suffix run is needed. No explicit user question is needed before proceeding to `Version 0.5.316`.

## Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Registration follow-up | Rejected | Registration, focused validation, and normal lint are stable. |
| Immediate status expansion | Rejected | No current gate or seed plan proves a need for more records. |
| Condition/injury seed plan | Rejected | Broader health and persistence boundaries remain deferred. |
| Run Deep Research now | Rejected | Not needed to audit stable local registration or choose the next docs gate. |
| Pause the lane immediately | Viable but not selected yet | Stability supports a pause, but the next-expansion gate should make that route decision explicitly. |
| Next-expansion gate | Selected | Smallest safe way to choose pause, tiny later planning, research, or another lane without authorizing implementation. |
| Route directly to another deferred authority lane | Deferred to gate | The combat health lane is stable enough to pause, but route selection should be explicit and coordinated. |

## Selected Option And Rationale

Select `Version 0.5.316 - Combat Status Condition Injury Next Expansion Gate`.

The registration phase is complete and stable. A final docs-first gate can decide whether the lane should pause and route elsewhere or whether any evidence-backed future planning is justified. This preserves the narrow authority boundary and avoids treating successful registration as a reason to expand content.

## Risks And Mitigations

- Risk: successful registration could be mistaken for expansion approval. Mitigation: explicitly authorize no new records or fields and route only to a docs-first gate.
- Risk: the gate could drift into runtime health design. Mitigation: preserve static-vocabulary ownership and require Deep Research before broad health/injury/recovery work.
- Risk: exact-once wiring could regress later. Mitigation: retain focused exact-once assertions and normal lint in required validation.
- Risk: the lane could remain active without a useful next candidate. Mitigation: require the next gate to consider pausing and routing elsewhere.

## Explicit Non-Goals

This audit does not:

- edit registration, content, schema, validator, focused tests, or schema-file tests;
- add, remove, activate, or change status records;
- add condition or injury records;
- add relationships or class/severity/phase fields;
- add adjacent dependency loading;
- add damage/healing formulas, duration/tick/stack behavior, cures, immunity/resistance/vulnerability execution, combat execution, or AI behavior;
- add runtime, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay;
- edit resource/commodity or service authority;
- implement generic `world.pois` or reopen Highcrown settlement Knowledge;
- run Deep Research or create temporary research artifacts.

## Decision Question Answers

1. Yes. The live combat health vocabulary file is present.
2. Yes. It contains exactly `combat_status.stagger` and `combat_status.bind`.
3. Yes. Both records are still `kind: "status"`.
4. Yes. Both records are still `status: "planned"`.
5. Yes. Condition records remain absent.
6. Yes. Injury records remain absent.
7. Yes. Relationship fields remain absent.
8. Yes. Class, severity, and phase fields remain absent.
9. Yes. Runtime, UI, save/account, and gameplay fields remain absent.
10. Yes. The live wrapper still validates through `validateCombatHealthVocabularyContent(...)`.
11. Yes. All 90 focused tests pass.
12. Yes. All 102 schema-file tests pass.
13. Yes. Normal content lint passes.
14. Normal content lint reports 67 files checked.
15. Yes. Normal content-lint registration is present exactly once across each required surface.
16. Yes. The validator import is present exactly once.
17. Yes. The normal `checks` entry is present exactly once.
18. Yes. The validator helper call is present exactly once.
19. Yes. The `main()` helper invocation is present exactly once.
20. Yes. The helper loads only the live wrapper and schema.
21. Yes. Adjacent content dependencies are absent from this registration.
22. No. This audit changes no content, schema, validator, focused test, runtime, UI, save/account, or gameplay behavior.
23. No. No immediate registration follow-up is needed.
24. No. No immediate status, condition, or injury expansion is authorized.
25. No. Deep Research is not needed before the immediate next route.
26. No. A support-suffix run is not needed.
27. No. An explicit user question is not needed before proceeding.
28. Continue only to a docs-first next-expansion gate; that gate should decide whether the lane pauses or has a justified future planning step.
29. The immediate next route should be `Version 0.5.316 - Combat Status Condition Injury Next Expansion Gate`.

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (`Already up to date.`)
- Required repository reads and targeted coordination/history scans.
- `node --test tests/unit/combat-status-condition-injury-authority-validation.test.mjs` (passed; 90 tests)
- `node --test tests/unit/schema-files.test.mjs` (passed; 102 tests)
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (67 files checked)`)
- Structured live seed, exact-once registration, and helper-dependency scans described above.
- Final docs-only scope, conflict-marker, whitespace, stale-route, and diff checks are recorded in `docs/dev/current-codex-output.md`.

## Next Recommended Version

Version 0.5.316 - Combat Status Condition Injury Next Expansion Gate
