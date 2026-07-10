# Combat Status Condition Injury Next Expansion Gate

Source version/run: Version 0.5.316 - Combat Status Condition Injury Next Expansion Gate
Date: 2026-07-10
Status: documentation-only expansion gate

## Gate Summary

Pause the combat health vocabulary lane.

The live two-status seed is stable, exact-once registered, and fully covered by focused and normal validation. Fresh repo evidence does not justify immediate status expansion, a tiny status-only seed plan, condition or injury planning, registration follow-up, or Deep Research now.

Selected next route:

- `Version 0.5.317 - Roadmap Next Authority Selection`

That run should remain docs-first and select the next authority lane from current roadmap evidence without implementing content.

## Current Completed-State Posture

- `Version 0.5.315 - Combat Status Condition Injury Post-Registration Audit` confirmed stable exact-once registration, unchanged live content, and no immediate expansion authorization.
- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit` remains the latest support/audit run.
- The resource/commodity lane is stable and paused.
- Service authority is stable and should not continue here.
- Generic `world.pois` remains rejected.
- The Highcrown settlement Knowledge lane remains closed.

## Live Seed And Registration Stability Check

Live path:

- `packages/content/base/game/combat_health_vocabulary.json`

The records-only wrapper remains exactly two records:

1. `combat_status.stagger`
2. `combat_status.bind`

Both records remain `kind: "status"`, `status: "planned"`, and `family: "control"`.

The seed contains no condition records, injury records, active records, relationship fields, class/severity/phase fields, or runtime/UI/save/account/gameplay fields.

Normal content-lint registration remains stable and exact-once:

| Registration surface | Count |
| --- | ---: |
| Validator import | 1 |
| Normal `checks` entry | 1 |
| Validator helper call | 1 |
| `main()` helper invocation | 1 |

The registration helper still loads only:

- `packages/content/base/game/combat_health_vocabulary.json`;
- `packages/schemas/game/combat-health-vocabulary.schema.json`.

No adjacent authority, runtime, UI, save/account, app, or game-engine dependency is loaded for this registration.

## Validation Evidence

Fresh checks passed:

- focused combat health tests: 90 passed;
- schema-file tests: 102 passed;
- normal content lint: `content-lint: ok (67 files checked)`.

The live wrapper continues to validate through `validateCombatHealthVocabularyContent(...)` with exact sorted ids:

- `combat_status.bind`;
- `combat_status.stagger`.

## Expansion Readiness Assessment

### Status Expansion

Immediate status expansion is not authorized.

The current seed already contains the strongest cross-owner candidates identified by the evidence audit. Deferred candidates such as stun, prone, pinned, hamstrung, protect, ward, and grappled remain narrower, ambiguous, or more likely to imply movement, mitigation, escape, duration, or other execution behavior. No fresh evidence establishes that adding one or two now would materially improve the foundation.

### Condition Expansion

Immediate condition expansion and a condition seed plan are not authorized.

Condition candidates would require clearer boundaries for perception, movement/action timing, damage-over-time, poison/disease exposure, cure, treatment, recovery, and persistence.

### Injury Expansion

Immediate injury expansion and an injury seed plan are not authorized.

No safe direct injury seed evidence exists, and injury vocabulary risks implying wound instances, severity, body location, treatment, recovery, scars, disability, death risk, or persistence.

### Deferred Fields And Behavior

Relationship fields, class/severity/phase fields, active records, runtime behavior, UI, save/account state, and gameplay remain deferred. Successful validation and registration do not authorize those surfaces.

## Deep Research Gate

Deep Research is not needed now to pause the stable lane or select another roadmap authority.

`GPT-DR.health.injury-recovery` is required before any later route whose meaningful scope includes broad health or injury vocabulary, treatment, recovery, disease/poison, poison exposure, medicine, death/defeat, healing-service integration, or long-term injury posture.

A later tiny status-only planning pass may avoid Deep Research only if fresh local evidence proves one or two descriptive planned records without conditions, injuries, relationships, active state, or execution semantics.

## Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Registration follow-up | Rejected | Exact-once registration and all validation remain stable. |
| Immediate status expansion implementation | Rejected | No expansion implementation is authorized, and no fresh need is proven. |
| Docs-only tiny status expansion plan | Rejected for now | Deferred status candidates do not provide enough new foundation value to keep this lane active. |
| Condition/injury seed plan | Rejected | Broader health, recovery, persistence, and execution boundaries remain unresolved. |
| Run Deep Research now | Rejected | Research is unnecessary to pause the lane and select the next authority. |
| Pause combat health lane | Selected | The two-record seed is stable, registered, and sufficient for the current foundation slice. |
| Route to another deferred authority lane directly | Not selected | No single alternate lane is clearly ready without a fresh cross-roadmap selection pass. |

## Selected Option And Rationale

Pause combat health and route to `Version 0.5.317 - Roadmap Next Authority Selection`.

Combat health has completed its current foundation sequence: boundary, schema plan, evidence audit, schema/validator, seed plan, live seed, lint decision, registration, post-registration audit, and expansion gate. Continuing now would add breadth without a demonstrated need. A roadmap selection pass is the smallest safe way to compare remaining authority lanes and choose the next docs-first route.

The live two-status seed remains stable and registered while the lane is paused.

## Risks And Mitigations

- Risk: a pause could be mistaken for abandonment. Mitigation: retain the live registered seed and explicit future Deep Research/status-planning gates.
- Risk: roadmap selection could reopen a closed or rejected lane. Mitigation: preserve the service/resource pauses, generic `world.pois` rejection, and Highcrown Knowledge closure.
- Risk: future status work could imply runtime execution. Mitigation: require a fresh evidence-backed plan and preserve the static-vocabulary boundary.
- Risk: broad health work could proceed without grounding. Mitigation: require `GPT-DR.health.injury-recovery` before the broad scopes listed above.

## Explicit Non-Goals

This gate does not:

- edit registration, content, schema, validator, focused tests, or schema-file tests;
- add or activate status records;
- add condition or injury records;
- add relationships or class/severity/phase fields;
- add adjacent dependency loading;
- add damage/healing formulas, duration/tick/stack behavior, cures, immunity/resistance/vulnerability execution, combat execution, AI behavior, runtime, UI, save/account behavior, or gameplay;
- select or implement another authority lane;
- expand resource/commodity or service work;
- implement generic `world.pois` or reopen Highcrown settlement Knowledge;
- run Deep Research or create temporary research artifacts.

## Gate Question Answers

1. Yes. The live combat health vocabulary file is present.
2. Yes. It contains exactly `combat_status.stagger` and `combat_status.bind`.
3. Yes. Both records remain `kind: "status"`.
4. Yes. Both records remain `status: "planned"`.
5. Yes. Condition records remain absent.
6. Yes. Injury records remain absent.
7. Yes. Relationship fields remain absent.
8. Yes. Class, severity, and phase fields remain absent.
9. Yes. Runtime, UI, save/account, and gameplay fields remain absent.
10. Yes. The live wrapper still validates through `validateCombatHealthVocabularyContent(...)`.
11. Yes. Normal content-lint registration remains exact-once across all four required surfaces.
12. Yes. Normal content lint passes at 67 checked files.
13. No. No registration follow-up is needed.
14. No. Immediate status expansion is not authorized.
15. No. Immediate condition expansion is not authorized.
16. No. Immediate injury expansion is not authorized.
17. No. A tiny status-only seed plan is not justified now.
18. No. A condition/injury seed plan is not justified now.
19. No. `GPT-DR.health.injury-recovery` is not needed before the immediate next route.
20. Yes. It is needed before any later broad health, injury, treatment, recovery, disease/poison, medicine, death/defeat, healing-service, or long-term injury route.
21. Yes. The combat health lane should pause.
22. The next route should leave combat health and perform a general roadmap authority selection.
23. No. A support-suffix run is not needed.
24. No. An explicit user question is not needed before the next numbered route.
25. The immediate next route should be `Version 0.5.317 - Roadmap Next Authority Selection`.

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (`Already up to date.`)
- Required repository reads and roadmap candidate scans.
- `node --test tests/unit/combat-status-condition-injury-authority-validation.test.mjs` (passed; 90 tests)
- `node --test tests/unit/schema-files.test.mjs` (passed; 102 tests)
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (67 files checked)`)
- Structured live seed, exact-once registration, and helper-dependency scans described above.
- Final docs-only scope, conflict-marker, whitespace, stale-route, and diff checks are recorded in `docs/dev/current-codex-output.md`.

## Next Recommended Version

Version 0.5.317 - Roadmap Next Authority Selection
