# Combat Status Condition Injury Seed Plan

Source version/run: Version 0.5.311 - Combat Status Condition Injury Seed Plan
Date: 2026-07-10
Status: documentation-only seed plan

## Plan Summary

Plan the first future live seed for the combined static `combat_health_vocabulary` authority.

This run does not create live content. It selects exactly two future planned-only status records for a later implementation:

- `combat_status.stagger`
- `combat_status.bind`

The selected records are descriptive vocabulary only. They do not define duration, stacks, magnitudes, actor references, movement rules, damage, healing, cure, resistance, runtime behavior, UI, save/account state, or gameplay.

Selected next route:

- `Version 0.5.312 - Combat Status Condition Injury Seed`

## Current Completed-State Posture

- `Version 0.5.310 - Combat Status Condition Injury Schema And Validator` completed the strict future schema, pure focused validator, focused tests, and schema-file parse coverage for the combined static combat health vocabulary.
- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit` remains the latest support/audit run.
- The resource/commodity lane is stable and paused after normal content-lint registration, post-registration audit, and next-expansion gate.
- Service authority is stable and does not need continuation here.
- Generic `world.pois` remains rejected.
- The Highcrown settlement Knowledge lane remains closed.

## Implementation Readiness Audit

| Check | Result | Evidence |
| --- | --- | --- |
| Does live `packages/content/base/game/combat_health_vocabulary.json` already exist? | No. | File remains absent. |
| Is the combat health schema present? | Yes. | `packages/schemas/game/combat-health-vocabulary.schema.json` exists. |
| Is the focused validator present? | Yes. | `tools/content-lint/combat-health-vocabulary.mjs` exists. |
| Are focused tests present? | Yes. | `tests/unit/combat-status-condition-injury-authority-validation.test.mjs` exists. |
| Is schema-file parse coverage present? | Yes. | `tests/unit/schema-files.test.mjs` includes `packages/schemas/game/combat-health-vocabulary.schema.json`. |
| Is normal content-lint registration still absent? | Yes. | `tools/content-lint/index.mjs` has no `combat-health-vocabulary`, `combat_health_vocabulary`, or `validateCombatHealthVocabularyContent` reference. |

The current schema supports all selected record values:

- `kind: "status"`
- `status: "planned"`
- `family: "control"`
- selected `allowedOwnerTypes`
- selected lower-snake tags
- string `sourceAuthorityNotes`
- string `notes`

No schema adjustment is needed.

## Evidence Basis

`combat_status.stagger` is selected because current repo evidence still shows `status.stagger` or `stagger` across abilities, spells, skill effects, item use profiles, combat hook support, and engine/runtime support. That makes it the strongest cross-owner status vocabulary candidate.

`combat_status.bind` is selected because current repo evidence still shows `status.bind` across spells, skill effects, spell hook support, combat hook support, and engine/runtime support. Its evidence is narrower than `stagger` but still strong enough for a tiny status-first seed.

The evidence supports static vocabulary only. Runtime systems remain the owner of actual application, expiry, magnitudes, source/target actors, movement constraints, and combat effects.

## Exact Future Seed Records

Future implementation should create `packages/content/base/game/combat_health_vocabulary.json` with exactly:

```json
{
  "records": [
    {
      "id": "combat_status.stagger",
      "slug": "stagger",
      "name": "Stagger",
      "kind": "status",
      "status": "planned",
      "family": "control",
      "summary": "Static vocabulary for the stagger combat status, used as a descriptive label for brief disruption or loss of footing without defining duration, stacks, damage, or recovery behavior.",
      "allowedOwnerTypes": ["combat_runtime", "ability", "spell", "skill_effect", "item_use_profile"],
      "tags": ["control", "disruption"],
      "sourceAuthorityNotes": "Selected because status.stagger or stagger appears across abilities, spells, skill effects, item use profiles, combat hook support, and existing engine runtime support.",
      "notes": "Descriptive vocabulary only. Runtime systems remain responsible for applying, expiring, stacking, magnitudes, targeting, actor references, and gameplay effects."
    },
    {
      "id": "combat_status.bind",
      "slug": "bind",
      "name": "Bind",
      "kind": "status",
      "status": "planned",
      "family": "control",
      "summary": "Static vocabulary for the bind combat status, used as a descriptive label for restrained or bound combat state without defining movement rules, duration, stacks, damage, cure, or escape behavior.",
      "allowedOwnerTypes": ["combat_runtime", "spell", "skill_effect"],
      "tags": ["control", "restraint"],
      "sourceAuthorityNotes": "Selected because status.bind appears in spells, skill effects, spell hook support, combat hook support, and existing engine runtime support.",
      "notes": "Descriptive vocabulary only. Runtime systems remain responsible for applying, expiring, stacking, magnitudes, movement constraints, actor references, escape rules, and gameplay effects."
    }
  ]
}
```

Both records should remain `planned`. No first-seed record should be `active`.

## Deferred Status Candidates

| Candidate | Decision | Rationale |
| --- | --- | --- |
| `combat_status.stun` | Defer. | Possible status vocabulary, but first seed does not need it and evidence is narrower than `stagger`. |
| `combat_status.prone` | Defer. | Possible status vocabulary, but first seed does not need it and evidence is narrower than `stagger`. |
| `combat_status.pinned` | Defer. | Possible status vocabulary, but first seed does not need it and evidence is narrower than `stagger`. |
| `combat_status.hamstrung` | Defer. | Possible status vocabulary, but first seed does not need it and evidence is narrower than `stagger`. |
| `combat_status.protect` | Defer. | Possible status vocabulary, but protection wording risks implying mitigation behavior. |
| `combat_status.ward` | Defer. | Possible status vocabulary, but ward wording risks implying barrier or resistance behavior. |
| `combat_status.grappled` | Defer. | Evidence comes from target-condition usage rather than hook evidence and should wait for later grappling boundary work. |

## Deferred Condition Candidates

| Candidate | Decision | Rationale |
| --- | --- | --- |
| `combat_condition.blind` | Defer. | Implies perception penalties, removal, and cure behavior that remain runtime-owned. |
| `combat_condition.slow` | Defer. | Implies movement/action timing behavior that remains runtime-owned. |
| `combat_condition.burn` | Defer. | Implies damage-over-time, suppression, recovery, and resistance questions. |
| `combat_condition.curse` | Defer. | Implies broad magic/runtime rules. |
| `combat_condition.poison` | Defer. | Requires poison exposure, disease/poison, treatment, cure, ticking, and persistence decisions. |

## Deferred Injury Posture

No `combat_injury.*` records should be included in the first seed.

Current evidence does not provide safe direct injury first-seed candidates. Injury seed planning should wait for stronger authored evidence or `GPT-DR.health.injury-recovery`.

## Relationship-Field Posture

No relationship fields should be used in the first seed.

Do not include:

- `relatedAbilityIds`
- `relatedSpellIds`
- `relatedSkillEffectIds`
- `relatedItemKeys`
- `relatedMonsterIds`
- `relatedStatusIds`
- `relatedConditionIds`
- `relatedInjuryIds`

Relationship fields remain deferred because the current evidence proves vocabulary candidates, not safe exact references. The focused validator also rejects these fields today.

## Class / Severity / Phase Posture

Do not include class, severity, or phase fields in the first seed.

Do not include:

- `conditionClass`
- `injuryClass`
- `severityBand`
- `combatPhaseTags`

The focused validator rejects these fields today.

## Deep Research Decision

Do not run Deep Research before this tiny two-status seed.

`GPT-DR.health.injury-recovery` should run before any seed plan that selects broad health, injury, treatment, recovery, disease/poison, poison exposure, medicine, death/defeat, healing-service, or long-term injury vocabulary.

## Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Tiny two-status seed | Selected. | `stagger` and `bind` have the strongest current evidence and can remain descriptive planned-only records. |
| Larger status seed | Rejected for now. | Other status candidates are possible but not needed for the first tiny seed. |
| Include condition records | Rejected. | Condition candidates imply runtime or broader health/poison/disease/treatment/recovery decisions. |
| Include injury records | Rejected. | No safe direct injury first-seed evidence exists. |
| Run Deep Research now | Rejected. | Not needed for a tiny status-first seed. |
| Implement live seed now | Rejected. | This run is docs-only. |
| Register normal lint now | Rejected. | Normal content-lint registration should wait until live content exists and a later registration decision approves it. |

## Selected Option And Rationale

Select the tiny two-status seed option.

This is the smallest useful seed after the schema/validator implementation. It proves the future content shape while keeping the vocabulary planned-only and non-executing. It avoids relationship fields, condition and injury records, active status records, normal content-lint registration, runtime behavior, UI, save/account behavior, and gameplay.

## Risks And Mitigations

- Risk: Static status records could be mistaken for runtime behavior. Mitigation: selected records use `planned` status, descriptive summaries, and explicit notes that runtime systems own application, expiry, stacks, magnitudes, actors, and gameplay effects.
- Risk: Relationship fields could imply exact cross-owner execution links. Mitigation: all relationship fields remain absent and rejected by the current validator.
- Risk: Protection, ward, grapple, or condition candidates could broaden the seed. Mitigation: defer them to later focused seed planning.
- Risk: Injury records could be invented from genre expectations. Mitigation: select no injury records without stronger evidence or Deep Research.

## Explicit Non-Goals

This plan does not:

- create `packages/content/base/game/combat_health_vocabulary.json`;
- edit `packages/schemas/game/combat-health-vocabulary.schema.json`;
- edit `tools/content-lint/combat-health-vocabulary.mjs`;
- edit `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`;
- edit `tests/unit/schema-files.test.mjs`;
- edit `tools/content-lint/index.mjs`;
- add live status, condition, or injury records;
- add relationship fields;
- add class, severity, or phase fields;
- add normal content-lint registration;
- edit combat role, tactics, encounter, monster, spawn profile, player ability, player spell, player skill, skill effect, item, resource/commodity, or service content;
- add damage formulas, healing formulas, duration/tick/stack behavior, cure behavior, immunity/resistance/vulnerability execution, runtime behavior, UI, storage behavior, commands, events, rewards, migrations, save/account behavior, or gameplay behavior;
- implement `world.pois`;
- reopen the closed Highcrown settlement Knowledge lane;
- run Deep Research;
- create temporary Deep Research artifacts.

## Plan Question Answers

1. Live `packages/content/base/game/combat_health_vocabulary.json` does not exist.
2. The combat health schema, focused validator, focused tests, and schema-file parse coverage are present.
3. Normal content-lint registration is still absent.
4. The strongest candidate statuses are `combat_status.stagger` and `combat_status.bind`.
5. Deferred condition candidates are `combat_condition.blind`, `combat_condition.slow`, `combat_condition.burn`, `combat_condition.curse`, and `combat_condition.poison`.
6. All injury candidates remain deferred.
7. The first seed should include `combat_status.stagger`.
8. The first seed should include `combat_status.bind`.
9. The first seed should not include `combat_status.stun`, `combat_status.prone`, `combat_status.pinned`, `combat_status.hamstrung`, `combat_status.protect`, `combat_status.ward`, or `combat_status.grappled`.
10. The first seed should not include `combat_condition.blind`, `combat_condition.slow`, `combat_condition.burn`, `combat_condition.curse`, or `combat_condition.poison`.
11. The first seed should not include any `combat_injury.*` records.
12. No relationship fields should be used in the first seed.
13. No condition/class/severity/phase fields should be used in the first seed.
14. No record should be `active`; both selected records should be `planned`.
15. `GPT-DR.health.injury-recovery` should not run before this tiny seed.
16. The live content file should not be created in this run.
17. Normal content-lint registration should not be added in this run.
18. The exact future records are `combat_status.stagger` and `combat_status.bind`.
19. The exact fields and values are listed in the "Exact Future Seed Records" section.
20. The immediate next route should be `Version 0.5.312 - Combat Status Condition Injury Seed`.

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master`
- Required reads of current handoffs, sequence, roadmap, backlog, schema plan, boundary decision, evidence audit, static authority audit, resource/commodity gate, pipeline consolidation decision, GPT Deep Research prompt-pack decision, schema, focused validator, focused tests, schema-file parse coverage, normal content-lint index, and current evidence surfaces.
- Fresh evidence scan for selected and deferred status/condition strings across combat hook support, spell hook support, abilities, spells, skill effects, and items.
- `node --test tests/unit/combat-status-condition-injury-authority-validation.test.mjs` (passed; 90 tests)
- `node --test tests/unit/schema-files.test.mjs` (passed; 102 tests)
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (66 files checked)`)
- `git diff --check` (passed with line-ending normalization warnings only)
- Conflict-marker scan across changed docs (no matches)
- Trailing-whitespace scan across changed docs (no matches)
- Accidental live-content scan confirmed `packages/content/base/game/combat_health_vocabulary.json` remains absent.
- Scope audit confirmed no schema, validator, focused test, schema-file test, normal-lint index, existing content, runtime, UI, save/account, or gameplay files changed.
- Relationship/class/severity/phase scan found only explicit doc examples or historical backlog text.
- Deep Research, Highcrown, and `world.pois` scans found no created artifacts or reopened lanes.
- Stale next-version pointer scan confirmed active handoff, roadmap, sequence, backlog, and current output route to `Version 0.5.312 - Combat Status Condition Injury Seed`; older `0.5.311` references are historical.
- `git status --short --branch`

## Next Recommended Version

Version 0.5.312 - Combat Status Condition Injury Seed
