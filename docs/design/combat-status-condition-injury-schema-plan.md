# Combat Status Condition Injury Schema Plan

Source version/run: Version 0.5.308 - Combat Status Condition Injury Schema Plan
Date: 2026-07-09
Status: documentation-only schema plan

## Plan Summary

Plan one future typed, static, non-executing combat health vocabulary catalog for combat statuses, conditions, and injuries.

This plan does not implement that catalog. It defines the future schema, validator, test, seed, and registration posture needed before any content exists.

Selected next route:

- `Version 0.5.309 - Combat Status Condition Injury Evidence Audit`

## Current Completed-State Posture

- `Version 0.5.307 - Resource And Commodity Next Expansion Gate` completed the resource/commodity next-expansion gate.
- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit` remains the latest support/audit run.
- Resource/commodity normal content-lint registration remains stable and the resource/commodity lane is paused.
- Service authority is stable and needs no continuation here.
- Generic `world.pois` remains rejected.
- The Highcrown settlement Knowledge lane remains closed.

## Boundary Evidence

`Version 0.5.289 - Combat Status Condition And Injury Boundary Decision` authorized a future typed, non-executing static combat health vocabulary in principle.

That decision selected a limited hybrid model:

- future records should be planned as one typed vocabulary/catalog;
- records should be explicitly classified as `status`, `condition`, or `injury`;
- static records may own stable identity, family, tags, plain-language semantics, persistence posture, source domains, and relationship hints;
- static records must not own active status instances, stacks, magnitudes, actor references, timers, HP/MP/stamina changes, body-state math, wounds, injury instances, disease or poison exposure, treatment, recovery, scars, death, defeat, save/account state, commands, events, rewards, UI, storage, runtime, or gameplay.

`Version 0.5.290 - Static Authority Validation Consolidation Audit` confirmed that this lane remains coherent and deferred behind a schema plan, fresh audit, and seed plan.

## Existing Repo Evidence Audit

Current evidence supports planning a static vocabulary but not implementing it yet.

- `packages/shared/types/src/combat.ts` already defines runtime `CombatStatusEffectState` with `id`, `label`, `sourceType`, `sourceId`, `stacks`, optional `magnitude`, `startedAtTick`, optional `expiresAtTick`, and `tags`.
- `packages/engines/game-engine/src/combat/index.ts` maps `playerState.activeEffects` into combatant `statusEffects` and syncs combat status labels back to `playerState.activeEffects`.
- `packages/shared/types/src/contracts.ts` already owns player resource runtime modifiers, resource change requests/history, body state, fatigue, hydration, intoxication, starvation, protein deficit, recovery multipliers, and warnings.
- `tools/content-lint/combat-hook-support.mjs` defines runtime-consumed combat channels and hooks such as `damage`, `healingPower`, `duration`, `statusChance`, `stagger`, `stun`, `status.bind`, `status.stagger`, `status.stun`, `debuff.disabled`, `buff.protect`, and `buff.ward`.
- `tools/content-lint/spell-hook-support.mjs` and `packages/shared/types/src/spell-hook-support.ts` classify spell hooks as runtime, classifier, deferred, or unknown.
- Current spell hook evidence includes runtime `status.bind`, `status.stagger`, `buff.protect`, `buff.ward`, and `buff.anthem`; deferred hooks include `status.burn`, `status.slow`, `debuff.blind`, `debuff.curse`, and multiple `buff.*` hooks.
- `tools/content-lint/magic-metadata-support.mjs` validates spell compatibility and item conduit metadata, but magic tags remain compatibility metadata, not generic status execution.
- `packages/content/base/player/abilities.json` has 32 records. Its current target-condition strings are `grappled`, `helpless`, `incapacitated`, and `parry_window`; its status-like hooks include `status.hamstrung`, `status.pinned`, `status.prone`, `status.stagger`, `status.stun`, and `debuff.disabled`.
- `packages/content/base/player/spells.json` has 55 records: 23 ready, 5 partial, and 27 deferred by current compatibility tests. It contains status-like, buff-like, and debuff-like hook strings, but those hooks are spell behavior metadata, not static vocabulary records.
- `packages/content/base/player/skill_effects.json` has 38 records and uses supported channels and hooks, including `statusChance`, `stagger`, `staggerResistance`, and selected `status.*` / `buff.*` hooks.
- `packages/content/base/items/items.json` has 1372 records and 22 current `useProfiles`. Item `useProfiles` own action/use descriptors, effect channels, resolution hooks, target profile, and activation fields. They must remain untouched.
- `packages/content/base/world/monsters.json` has 24 records and owns static monster identity, combat baselines, default roles, action package ids, difficulty scaling hooks, drops, and loot.
- `packages/content/base/world/encounter_templates.json` has 6 records and owns encounter composition.
- `packages/content/base/world/spawn_profiles.json` has 5 records and owns spawn placement/selection envelopes.
- `packages/content/base/game/combat_roles.json` and `packages/content/base/game/tactics_presets.json` each have 9 records and own tactical vocabulary and AI preference metadata.
- `tests/unit/combat-hook-support.test.mjs`, `tests/unit/spell-hook-support.test.mjs`, `tests/unit/spell-compatibility-status.test.mjs`, `tests/unit/magic-metadata-support.test.mjs`, and `tests/unit/monster-validation-hardening.test.mjs` prove current hook, spell, magic metadata, and monster validation boundaries.

No canonical static status, condition, or injury content collection exists today.

## Authority Split Decision

Use one combined typed authority for the first future implementation.

Planned first-pass content path:

- `packages/content/base/game/combat_health_vocabulary.json`

Planned first-pass schema path:

- `packages/schemas/game/combat-health-vocabulary.schema.json`

Planned first-pass validator path:

- `tools/content-lint/combat-health-vocabulary.mjs`

Planned focused test path:

- `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`

This deviates from the optional separate-file suggestion in the prompt because the accepted boundary decision explicitly preferred one typed vocabulary/catalog planned as a unit, with records classified as `status`, `condition`, or `injury`. Three separate authorities can be reconsidered later only if a later evidence audit proves the combined contract is too constrained.

## Future File-Path Plan

Future content:

- `packages/content/base/game/combat_health_vocabulary.json`

Future schema:

- `packages/schemas/game/combat-health-vocabulary.schema.json`

Future focused validator:

- `tools/content-lint/combat-health-vocabulary.mjs`

Future focused tests:

- `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`

Normal content-lint registration should not happen with schema/validator implementation. It should remain deferred until live content exists and a separate registration decision approves normal lint wiring.

## Future Record-Shape Plan

All records should share these static fields:

- `id`
- `slug`
- `name`
- `kind`
- `status`
- `family`
- `summary`
- `allowedOwnerTypes`
- `tags`
- `sourceAuthorityNotes`
- `notes`

Lifecycle status vocabulary should follow current schema convention:

- `planned`
- `active`
- `retired`

### Status Records

Status records should use ids shaped as `combat_status.<slug>` and `kind: "status"`.

Status records may contain:

- all shared fields;
- `combatPhaseTags`;
- optional static relationships, only if a later seed plan selects them:
  - `relatedConditionIds`
  - `relatedInjuryIds`
  - `relatedAbilityIds`
  - `relatedSpellIds`
  - `relatedSkillEffectIds`
  - `relatedItemKeys`
  - `relatedMonsterIds`

Status records describe combat-state vocabulary only. They do not apply, tick, stack, clear, resist, or execute status effects.

### Condition Records

Condition records should use ids shaped as `combat_condition.<slug>` and `kind: "condition"`.

Condition records may contain:

- all shared fields;
- `conditionClass`;
- optional static relationships, only if a later seed plan selects them:
  - `relatedStatusIds`
  - `relatedInjuryIds`
  - `relatedAbilityIds`
  - `relatedSpellIds`
  - `relatedSkillEffectIds`
  - `relatedItemKeys`
  - `relatedMonsterIds`

Condition records describe ongoing-state vocabulary only. They do not own current fatigue, hydration, intoxication, starvation, morale, disease, poison, recovery, treatment, or persistence values.

### Injury Records

Injury records should use ids shaped as `combat_injury.<slug>` and `kind: "injury"`.

Injury records may contain:

- all shared fields;
- `injuryClass`;
- `severityBand`;
- optional static relationships, only if a later seed plan selects them:
  - `relatedStatusIds`
  - `relatedConditionIds`
  - `relatedAbilityIds`
  - `relatedSpellIds`
  - `relatedSkillEffectIds`
  - `relatedItemKeys`
  - `relatedMonsterIds`

Injury records describe wound/trauma vocabulary only. They do not own wound instances, body locations on actors, active severity, pain, bleeding, infection, treatment, scars, recovery timers, disability, death risk, or persistence.

## Controlled Vocabulary Plan

First-pass schema vocabulary should be deliberately small.

`kind`:

- `status`
- `condition`
- `injury`

Likely status families:

- `control`
- `mobility`
- `perception`
- `morale`
- `buff`
- `debuff`
- `protection`
- `damage_over_time`
- `poison`
- `disease_like`
- `environmental`

Likely condition classes:

- `body`
- `fatigue`
- `hydration`
- `nutrition`
- `intoxication`
- `exposure`
- `morale`
- `disease`
- `poison`
- `environmental`
- `recovery`

Likely injury classes:

- `cut`
- `bruise`
- `burn`
- `fracture`
- `sprain`
- `puncture`
- `concussion`
- `trauma`
- `blood_loss`
- `scar`
- `impairment`
- `maiming`

Likely severity bands:

- `minor`
- `moderate`
- `serious`
- `severe`
- `critical`

Likely combat phase tags:

- `pre_combat`
- `opening`
- `active_exchange`
- `reaction`
- `recovery`
- `post_combat`

Safe owner types:

- `combat_runtime`
- `player_state`
- `npc_state`
- `monster`
- `ability`
- `spell`
- `skill_effect`
- `item_use_profile`
- `body_state`
- `future_health_runtime`

Tags should use lower-snake descriptive strings only. They should reject broad wildcard namespaces and generic intent tags such as `runtime`, `ui`, `save`, `damage_formula`, `healing_formula`, `duration_rule`, or `stack_rule`.

## Safe Relationship Fields

Static relationship fields are safe only as optional ids after a seed plan selects them and the focused validator can resolve them.

Potential safe references:

- `relatedAbilityIds` against `packages/content/base/player/abilities.json`;
- `relatedSpellIds` against `packages/content/base/player/spells.json`;
- `relatedSkillEffectIds` against `packages/content/base/player/skill_effects.json`;
- `relatedItemKeys` against `packages/content/base/items/items.json`;
- `relatedMonsterIds` against `packages/content/base/world/monsters.json`;
- cross-kind refs inside the same combat health vocabulary wrapper.

Relationship fields should remain absent from the first schema/validator implementation unless the later evidence audit and seed plan prove exact use. The existence of current hook strings is evidence for vocabulary candidates, not permission to create relationship refs.

## Forbidden Field / Forbidden Behavior Plan

Future schemas and validators should reject keys anywhere in records that imply runtime, damage, healing, ticking, stacking, combat resolution, UI, save/account, or gameplay behavior.

Forbidden key examples:

- `duration`
- `durationTurns`
- `tickRate`
- `tickInterval`
- `stackCount`
- `stacks`
- `maxStacks`
- `magnitude`
- `sourceActorId`
- `targetActorId`
- `startedAtTick`
- `expiresAtTick`
- `damage`
- `damageFormula`
- `damagePerTick`
- `healing`
- `healingFormula`
- `healingPerTick`
- `cure`
- `cureRule`
- `cureItem`
- `immunity`
- `resistance`
- `vulnerability`
- `modifier`
- `combatRollModifier`
- `hitChance`
- `critChance`
- `effect`
- `runtime`
- `runtimeState`
- `saveState`
- `accountState`
- `ui`
- `uiState`
- `command`
- `event`
- `reward`
- `migration`
- `gameplay`
- `gameplayEffects`

Forbidden behavior:

- damage formulas;
- healing formulas;
- cure rules;
- duration or ticking rules;
- stack counts or stacking behavior;
- immunity, resistance, or vulnerability execution;
- combat roll modifiers;
- hit chance;
- crit chance;
- damage-over-time execution;
- AI behavior;
- targeting logic;
- player commands;
- events;
- rewards;
- item grants;
- runtime state;
- save/account state;
- UI rendering;
- gameplay effects.

## Future Validator Behavior Plan

Future focused validators should enforce at least:

- records-only wrapper with no extra top-level wrapper fields;
- non-empty `records` array for live content validation and allowance for empty wrapper fixtures during schema-validator-only tests if that pattern is chosen;
- required fields by `kind`;
- no extra record fields;
- ids matching `combat_status.<slug>`, `combat_condition.<slug>`, or `combat_injury.<slug>` based on `kind`;
- id/slug coherence;
- unique ids, slugs, and names across the whole typed catalog;
- controlled vocabulary values for `kind`, `status`, `family`, `conditionClass`, `injuryClass`, `severityBand`, `combatPhaseTags`, and `allowedOwnerTypes`;
- safe lower-snake tags;
- no duplicate tags;
- no generic forbidden-intent tags;
- no forbidden field keys anywhere in a record;
- optional relationship refs resolve when supplied;
- cross-kind refs resolve inside the same wrapper;
- relationship fields remain absent unless a seed plan explicitly selects them;
- normal content-lint registration remains absent until a separate registration decision.

## Future Test Plan

`tests/unit/combat-status-condition-injury-authority-validation.test.mjs` should cover:

- valid minimal status, condition, and injury fixtures;
- wrapper rejection;
- required-field rejection;
- extra-field rejection;
- id prefix and slug mismatch rejection;
- duplicate id, slug, and name rejection;
- controlled vocabulary rejection;
- duplicate tag rejection;
- forbidden tag rejection;
- forbidden field rejection at top level and nested positions;
- optional relationship resolution when dependency wrappers are supplied;
- unresolved relationship rejection;
- no mutation of validator inputs;
- no normal content-lint registration before an approved registration decision.

`tests/unit/schema-files.test.mjs` should gain schema parse coverage only in the later schema/validator implementation run, not in this docs-only run.

## Future Seed-Planning Requirements

A later fresh live-repo evidence audit should inspect:

- all current `status.*`, `buff.*`, and `debuff.*` hooks in abilities, spells, skill effects, and item use profiles;
- `targetConditionsAny` strings in abilities;
- current combat hook support and spell hook support classifications;
- magic metadata compatibility profiles;
- player body-state and resource-runtime fields;
- monster summaries, behavior tags, combat profiles, default roles, action package ids, and tactics evidence;
- encounter and spawn profile context;
- item keys that may safely support relationship evidence without implying item grants or item use execution;
- whether any candidate would require health/injury Deep Research before safe authoring.

A later seed plan should decide:

- exact tiny planned-only candidate records;
- whether candidates cover all three `kind` values or only the safest subset;
- exact ids, slugs, names, families, classes, tags, notes, and source-authority notes;
- whether relationship fields remain absent for the first seed;
- whether any selected candidate depends on deferred hooks, runtime body state, or future health systems too strongly to seed.

## Normal Content-Lint Registration Posture

Do not register the future catalog in normal content lint during schema/validator implementation.

Normal registration should wait until:

1. schema, focused validator, and focused tests exist;
2. a later seed plan selects exact records;
3. a later live seed creates `packages/content/base/game/combat_health_vocabulary.json`;
4. a separate registration decision approves adding the live file to normal content lint.

## Deep Research / Nonstandard-Run Posture

Deep Research is not required before this schema plan.

`GPT-DR.health.injury-recovery` remains useful later before broad health/injury/recovery content, disease/poison systems, treatment, long-term injury, medicine, death/defeat consequence modeling, or healing-service integration. It is not needed to define the static records-only schema posture.

No nonstandard support-suffix run is required.

No explicit user question is required before proceeding to the next numbered route.

## Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Combined typed authority | Selected | Matches the accepted boundary decision and keeps one shared forbidden-field policy for all three kinds. |
| Separate status/condition/injury authorities | Rejected for first implementation | Too much structure before a fresh evidence audit and seed plan. May be reconsidered later. |
| Implement schemas now | Rejected | This run is docs-only and schema implementation needs a later focused prompt. |
| Run Deep Research now | Rejected | Not needed for schema posture; reserve health research for broader health/injury/recovery decisions. |
| Defer lane entirely | Rejected | The accepted route is to produce this schema plan now. |
| Route back to resource/commodity | Rejected | The resource/commodity lane is stable and paused. |

## Selected Option And Rationale

Select one combined typed catalog:

- future content: `packages/content/base/game/combat_health_vocabulary.json`;
- future schema: `packages/schemas/game/combat-health-vocabulary.schema.json`;
- future validator: `tools/content-lint/combat-health-vocabulary.mjs`;
- future focused tests: `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`.

This preserves the boundary decision's intent while still allowing kind-specific record shape. The next safest step is not schema implementation. A fresh evidence audit should choose exact vocabulary candidates and confirm whether relationship fields can remain absent.

## Planning Question Answers

1. The authority solves vocabulary drift across combat, spells, abilities, item use profiles, monsters, body state, and future health systems.
2. `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision` authorized this lane in principle.
3. Use one combined typed authority for the first implementation.
4. Use `packages/content/base/game/combat_health_vocabulary.json`.
5. Use `packages/schemas/game/combat-health-vocabulary.schema.json`.
6. Use `tools/content-lint/combat-health-vocabulary.mjs`.
7. Use `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`.
8. Normal content-lint registration should wait until live content exists and a separate registration decision approves it.
9. Status records should contain shared fields plus `combatPhaseTags` and only seed-approved optional relationships.
10. Condition records should contain shared fields plus `conditionClass` and only seed-approved optional relationships.
11. Injury records should contain shared fields plus `injuryClass`, `severityBand`, and only seed-approved optional relationships.
12. Runtime, damage, healing, ticking, stacking, cure, resistance, combat resolution, UI, save/account, command, event, reward, migration, and gameplay fields must remain forbidden.
13. Schemas should control `kind`, lifecycle `status`, family/class vocabularies, severity bands, combat phase tags, owner types, and tag patterns.
14. Static owner types and optional refs to abilities, spells, skill effects, item keys, monsters, and cross-kind records are safe only when selected by a seed plan.
15. Current abilities, spells, skill effects, item `useProfiles`, monsters, encounters, spawn profiles, combat roles, tactics presets, combat hook support, spell hook support, magic metadata, player body state, and resource runtime may be referenced for evidence.
16. Existing content, schemas, validators, tests, normal content-lint code, runtime, UI, save/account, gameplay, resource/commodity, service, POI, and Highcrown Knowledge files must remain untouched.
17. Future validators should enforce wrapper shape, required fields, id/slug coherence, uniqueness, controlled vocabularies, safe tags, forbidden fields, optional ref resolution, and absence from normal lint until approved.
18. A later audit should inspect current live hook strings, condition strings, body/resource runtime, monster/encounter/spawn/tactics evidence, item keys, and candidate safety.
19. A later seed plan should select exact tiny planned-only records, fields, relationship omissions or inclusions, and candidate blockers.
20. Deep Research is not required before this schema plan.
21. No nonstandard support-suffix run is required.
22. No explicit user question is required before the next numbered route.
23. The immediate next route should be `Version 0.5.309 - Combat Status Condition Injury Evidence Audit`.

## Risks And Mitigations

- Risk: a combined catalog could become too broad. Mitigation: require `kind`, kind-specific fields, and a later evidence audit before schema implementation.
- Risk: hook strings could be mistaken for static records. Mitigation: this plan treats hooks as evidence only.
- Risk: static records could accidentally encode runtime math. Mitigation: forbidden fields and validators must reject runtime, damage, healing, duration, tick, stack, cure, and gameplay keys recursively.
- Risk: relationship fields could imply execution. Mitigation: keep relationships absent unless a seed plan explicitly selects and validates them.
- Risk: health/injury content could need external grounding. Mitigation: reserve `GPT-DR.health.injury-recovery` for broader health, injury, disease, poison, treatment, recovery, death/defeat, and medicine work.

## Explicit Non-Goals

This plan does not:

- create schema files;
- create validator files;
- create tests;
- create live content;
- edit existing schemas, validators, tests, or `tools/content-lint/index.mjs`;
- edit combat role, tactics, encounter, monster, spawn, player ability, player spell, player skill, skill effect, item, resource/commodity, or service content;
- add status, condition, or injury records;
- add damage formulas, healing formulas, duration/tick/stack behavior, cure behavior, immunity/resistance/vulnerability execution, runtime behavior, UI, storage, commands, events, rewards, migrations, save/account behavior, or gameplay behavior;
- implement `world.pois`;
- reopen the closed Highcrown settlement Knowledge lane;
- run Deep Research;
- create temporary Deep Research artifacts.

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master` (reported the known multi-branch fast-forward ambiguity)
- `git rev-parse HEAD`
- `git rev-parse origin/master`
- `git merge-base HEAD origin/master`
- Required reads of current handoffs, sequence, roadmap, backlog, resource/commodity gate docs, combat boundary decision, static authority validation audit, pipeline consolidation decision, and GPT Deep Research prompt-pack decision.
- Read relevant schemas, content-lint helpers, focused tests, runtime type definitions, and current combat-adjacent content evidence.
- Structured current evidence scan for counts, status-like hooks, target-condition strings, and item use profile count.
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (66 files checked)`)
- `node --test tests/unit/schema-files.test.mjs` (passed; 101 tests)
- `git diff --check` (passed with line-ending normalization warnings only)
- Conflict-marker scan across changed docs (no matches)
- Trailing-whitespace scan across changed docs (no matches)
- Changed-file audit confirmed only approved docs changed and no package, tool, test, app, runtime, schema, validator, or content files changed.
- Current-route scan confirmed the active next route points to `Version 0.5.309 - Combat Status Condition Injury Evidence Audit`; older `0.5.308` references are historical.
- Highcrown and `world.pois` scans found only closed-lane, rejection, or no-change language.

## Next Recommended Version

Version 0.5.309 - Combat Status Condition Injury Evidence Audit
