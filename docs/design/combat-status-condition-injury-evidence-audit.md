# Combat Status Condition Injury Evidence Audit

Source version/run: Version 0.5.309 - Combat Status Condition Injury Evidence Audit
Date: 2026-07-09
Status: documentation-only evidence audit

## Audit Summary

Current repo evidence supports the accepted future static combat health vocabulary lane, but it does not support live records yet.

No canonical static `combat_health_vocabulary` content file, schema, focused validator, focused test, or normal content-lint registration exists. Current hook strings, ability target-condition strings, item use profiles, monster action packages, encounter composition, spawn profiles, combat roles, and tactics presets are evidence only.

The next numbered route can be:

- `Version 0.5.310 - Combat Status Condition Injury Schema And Validator`

That route should implement only the future combined schema, pure focused validator, focused tests, and schema-file parse coverage. It should not create live content or normal content-lint registration.

## Current Completed-State Posture

- `Version 0.5.308 - Combat Status Condition Injury Schema Plan` completed the docs-only schema plan.
- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit` remains the latest support/audit run.
- Resource/commodity normal content-lint registration is stable and the resource/commodity lane is paused.
- Service authority is stable and does not need continuation here.
- Generic `world.pois` remains rejected.
- The Highcrown settlement Knowledge lane remains closed.

## Current Implementation Absence Audit

| Question | Answer | Evidence |
| --- | --- | --- |
| Does a canonical static combat health vocabulary content file already exist? | No. | `packages/content/base/game/combat_health_vocabulary.json` is absent. |
| Are combat status, condition, and injury schemas already present? | No. | `packages/schemas/game/combat-health-vocabulary.schema.json` is absent. No separate status, condition, or injury schemas were found. |
| Are focused validators already present? | No. | `tools/content-lint/combat-health-vocabulary.mjs` is absent. |
| Are focused tests already present? | No. | `tests/unit/combat-status-condition-injury-authority-validation.test.mjs` is absent. |
| Is normal content-lint registration present for this future authority? | No. | `tools/content-lint/index.mjs` has no combat-health vocabulary check or import. |

No schema, validator, test, normal lint registration, content seed, runtime behavior, UI, save/account behavior, or gameplay behavior should be implemented in this run.

## Runtime Ownership Audit

Runtime already owns active combat status state.

- `packages/shared/types/src/combat.ts` defines `CombatStatusEffectState` with active instance fields: `id`, `label`, `sourceType`, `sourceId`, `stacks`, optional `magnitude`, `startedAtTick`, optional `expiresAtTick`, and `tags`.
- `CombatantState` owns `statusEffects`, `incapacitated`, `defeated`, resources, action queues, targeting, timing, hooks, tactical state, and combatant synchronization.
- `packages/engines/game-engine/src/combat/index.ts` builds status effects from runtime hooks, assigns durations, magnitudes, source ids, start ticks, expiry ticks, and tags, and expires effects by combat tick.
- The engine syncs player HP, MP, stamina, and combat status labels back to `playerState`.
- `packages/shared/types/src/contracts.ts` owns `PlayerResourceRuntimeState`, active resource modifiers, pending resource changes, resource history, player body state, fatigue, hydration, intoxication, starvation, protein deficit, recovery values, resolved multipliers, warnings, and save-facing player state.

These runtime-owned concerns must not move into static vocabulary records.

## Hook-Support Audit

`tools/content-lint/combat-hook-support.mjs` currently separates runtime-consumed combat hooks from descriptive hooks. Runtime-consumed status-like combat hooks include:

- `status.bind`
- `status.sleep`
- `status.hamstrung`
- `status.pinned`
- `status.prone`
- `status.stagger`
- `status.stun`
- `debuff.disabled`
- `buff.protect`
- `buff.ward`
- `buff.anthem`

It also supports runtime hooks that can create status-like runtime effects but are not clean first-pass static vocabulary candidates: shield defense hooks, stance hooks, command hooks, `mobility.shadow_step`, and `support.berry`.

`tools/content-lint/spell-hook-support.mjs` and `packages/shared/types/src/spell-hook-support.ts` classify authored spell hooks as `runtime`, `classifier`, `deferred`, or `unknown`.

Current authored spells have:

- 55 records total.
- 23 `ready`, 5 `partial`, and 27 `deferred` compatibility statuses.
- Runtime status-like hooks: `status.bind`, `status.stagger`, `buff.protect`, `buff.ward`, `buff.anthem`.
- Deferred status-like hooks: `buff.bless`, `buff.charge`, `buff.ember_spikes`, `buff.grace`, `buff.haste`, `buff.haze`, `buff.march`, `buff.preserve`, `buff.regeneration`, `buff.thornskin`, `buff.veil`, `buff.war_song`, `buff.warmth`, `buff.waterbreath`, `debuff.blind`, `debuff.curse`, `debuff.dirge`, `debuff.discord`, `debuff.soaked`, `status.burn`, and `status.slow`.
- Unknown authored spell hooks: none in the current spell test inventory.

`tools/content-lint/magic-metadata-support.mjs` validates spell compatibility and item conduit/catalyst metadata. It does not authorize generic tag-driven status execution.

## Ability Evidence Audit

`packages/content/base/player/abilities.json` has 32 records.

Status-like ability hooks:

- `status.hamstrung`
- `status.pinned`
- `status.prone`
- `status.stagger`
- `status.stun`
- `debuff.disabled`

Status-like channels:

- `damageMitigation`
- `slow`
- `stagger`
- `stun`

Current ability `requirements.targetConditionsAny` strings:

| Condition string | Source ability | Scope | Posture |
| --- | --- | --- | --- |
| `incapacitated` | `ability.melee.execute` | `target` | Runtime/combat-state evidence only. |
| `helpless` | `ability.melee.execute` | `target` | Execution predicate evidence only. |
| `parry_window` | `ability.reaction.riposte` | `actor` | Reaction timing evidence only. |
| `grappled` | `ability.tactical.takedown` | `target` | Possible future status vocabulary evidence only. |

The older schema-plan summary treated `targetConditionsAny` as a direct record-level scan. Fresh evidence shows these strings are nested under ability `requirements`.

## Spell Evidence Audit

`packages/content/base/player/spells.json` has 55 records.

Runtime-supported status-like spell hooks:

- `status.bind`
- `status.stagger`
- `buff.protect`
- `buff.ward`
- `buff.anthem`

Deferred status-like spell hooks:

- `buff.bless`
- `buff.charge`
- `buff.ember_spikes`
- `buff.grace`
- `buff.haste`
- `buff.haze`
- `buff.march`
- `buff.preserve`
- `buff.regeneration`
- `buff.thornskin`
- `buff.veil`
- `buff.war_song`
- `buff.warmth`
- `buff.waterbreath`
- `debuff.blind`
- `debuff.curse`
- `debuff.dirge`
- `debuff.discord`
- `debuff.soaked`
- `status.burn`
- `status.slow`

These strings are candidate vocabulary evidence only. Deferred spell hooks especially must not become static records that imply damage-over-time execution, healing, restoration, cure, duration, ticks, stacks, movement rules, blindness rules, curse rules, or resistance behavior.

## Skill-Effect Evidence Audit

`packages/content/base/player/skill_effects.json` has 38 records.

Status-like skill-effect hooks:

- `status.bind`
- `status.stagger`
- `buff.protect`
- `buff.ward`
- `buff.anthem`

Status-like channels:

- `barrier`
- `damageMitigation`
- `healingPower`
- `mitigation`
- `stagger`
- `staggerResistance`
- `statusChance`

Skill effects provide strong evidence that some vocabulary terms are cross-owner strings, but their channels and scaling remain runtime or skill-effect-owned.

## Item-Use Evidence Audit

`packages/content/base/items/items.json` has 1372 records and 22 current `useProfiles`.

Status-like item use profile hooks:

- `status.stagger` appears on `item.battle_staff.useProfiles[0]`, `item.buckler_shield.useProfiles[1]`, `item.kite_shield.useProfiles[1]`, and `item.tower_shield.useProfiles[1]`.

Item status-like channels include:

- `barrier`
- `damageMitigation`
- `mitigation`
- `stagger`
- `staggerResistance`

No item `useProfiles` provide safe first-seed relationship evidence. They own action/use descriptors, effect channels, resolution hooks, target profiles, and activation data. Item relationships should remain absent from the first schema/validator implementation and first seed.

## Monster / Encounter / Spawn / Tactics Evidence Audit

Current records:

- `packages/content/base/world/monsters.json`: 24 records.
- `packages/content/base/world/encounter_templates.json`: 6 records.
- `packages/content/base/world/spawn_profiles.json`: 5 records.
- `packages/content/base/game/combat_roles.json`: 9 records.
- `packages/content/base/game/tactics_presets.json`: 9 records.

Monsters provide indirect combat-health evidence through `actionPackageIds`, including `enfeebling_burst`, `elemental_burst`, `disruptor_bash`, and support/healing action packages in engine templates. Encounters and spawn profiles provide composition and placement evidence, not status vocabulary. Combat roles and tactics provide tactical terms such as `disruptor`, `healer`, `support_buffer`, `debuffer_controller`, and `tank_protector`.

These files should remain evidence-only and untouched. Monster relationships should remain absent from the first seed because current monster records do not directly identify safe static status, condition, or injury refs.

## Candidate Classification Table

This table is intentionally small. It is not a live seed plan.

| Classification | Source string | Source file(s) | Proposed kind | Proposed future id if safe | Evidence basis | Safe or unsafe | Requires Deep Research? | Requires runtime behavior? | Requires relationship fields? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `strong_candidate` | `status.stagger` / `stagger` | Abilities, spells, skill effects, item use profiles, combat hook support, engine runtime | `status` | `combat_status.stagger` | Cross-owner hook plus channel evidence; runtime-supported. | Safe only as non-executing vocabulary. | No. | No new runtime; existing runtime remains owner. | No. |
| `strong_candidate` | `status.bind` | Spells, skill effects, spell hook support, combat hook support, engine runtime | `status` | `combat_status.bind` | Runtime-supported spell/skill evidence. | Safe only as non-executing vocabulary. | No. | No new runtime; existing runtime remains owner. | No. |
| `possible_candidate` | `status.stun` | Abilities, combat hook support, engine runtime | `status` | `combat_status.stun` | Ability hook and runtime support. | Safe only as vocabulary; first seed can wait because evidence is narrower. | No. | No new runtime; existing runtime remains owner. | No. |
| `possible_candidate` | `status.prone` | Abilities, combat hook support, engine runtime | `status` | `combat_status.prone` | Ability hook and runtime support. | Safe only as vocabulary; first seed can wait. | No. | No new runtime; existing runtime remains owner. | No. |
| `possible_candidate` | `status.pinned` | Abilities, combat hook support, engine runtime | `status` | `combat_status.pinned` | Ability hook and runtime support. | Safe only as vocabulary; first seed can wait. | No. | No new runtime; existing runtime remains owner. | No. |
| `possible_candidate` | `status.hamstrung` | Abilities, combat hook support, engine runtime | `status` | `combat_status.hamstrung` | Ability hook and runtime support. | Safe only as vocabulary; first seed can wait. | No. | No new runtime; existing runtime remains owner. | No. |
| `possible_candidate` | `buff.protect` | Spells, skill effects, spell hook support, combat hook support, engine runtime | `status` | `combat_status.protect` | Protection buff evidence. | Safe only as vocabulary; avoid encoding mitigation math. | No. | No new runtime; existing runtime remains owner. | No. |
| `possible_candidate` | `buff.ward` | Spells, skill effects, spell hook support, combat hook support, engine runtime | `status` | `combat_status.ward` | Ward buff evidence. | Safe only as vocabulary; avoid barrier/resistance behavior. | No. | No new runtime; existing runtime remains owner. | No. |
| `possible_candidate` | `grappled` | Ability `requirements.targetConditionsAny` | `status` | `combat_status.grappled` | Target-condition string, not a hook. | Evidence is weaker; needs later seed plan. | No before schema/validator; maybe later if broad grappling rules are scoped. | No for static record; yes for actual grapple behavior. | No. |
| `defer` | `debuff.blind` | Spells, spell hook support | `condition` | `combat_condition.blind` | Deferred spell hook. | Defer because perception penalties and cure/removal behavior are not static authority. | No before schema/validator; maybe before seed. | Yes for gameplay effects. | No. |
| `defer` | `status.slow` | Spells, spell hook support; ability channel `slow` | `condition` | `combat_condition.slow` | Deferred spell hook and ability channel. | Defer because movement/action timing behavior is runtime-owned. | No before schema/validator; maybe before seed. | Yes for gameplay effects. | No. |
| `defer` | `status.burn` | Spells, spell hook support | `condition` | `combat_condition.burn` | Deferred spell hook. | Defer because burn implies damage-over-time, suppression, recovery, and resistance questions. | Not before schema/validator; likely before broad burn seed or behavior. | Yes for gameplay effects. | No. |
| `defer` | `debuff.curse` | Spells, spell hook support | `condition` | `combat_condition.curse` | Deferred spell hook. | Defer because curse implies broad magic/runtime rules. | Not before schema/validator; likely before broad curse seed or behavior. | Yes for gameplay effects. | No. |
| `defer` | `poison` | Item and habitat names only, no current status hook. | `condition` | `combat_condition.poison` | Weak lexical evidence only. | Defer because poison requires disease/poison exposure, treatment, cure, ticking, and persistence decisions. | Yes before seed. | Yes for gameplay effects. | No. |
| `defer` | wound/injury terms | Attribute/backstory/tactics prose only. | `injury` | none | No direct static injury vocabulary record or hook evidence. | No safe injury first seed candidate. | Yes before injury seed. | Yes for gameplay effects. | No. |

## Rejected / Deferred Evidence Table

| Evidence | Source | Decision | Rationale |
| --- | --- | --- | --- |
| `incapacitated` | Ability target condition and combatant runtime flag | `reject_for_static_authority` for first seed | It is runtime-owned combatant state tied to defeat/incapacitation logic. |
| `helpless` | Ability target condition and `execute.helpless` hook | `reject_for_static_authority` for first seed | It is an execution predicate and would imply targeting/execution behavior. |
| `parry_window` | Ability target condition | `reject_for_static_authority` for first seed | It is a reaction timing window, not stable health vocabulary. |
| `debuff.disabled` | Ability hook and runtime support | `defer` | It may become vocabulary later, but it is semantically close to runtime capability locking. |
| `status.sleep` | Engine/runtime hook | `defer` | Runtime-supported, but no current authored content surface in the required evidence set uses it directly. |
| `buff.regeneration` | Deferred spell hook | `defer` | Implies healing-over-time behavior. |
| `restore.mp` / `restore.stamina` | Deferred spell hooks | `reject_for_static_authority` | Resource restoration is resource runtime, not static health vocabulary. |
| `buff.haste`, `buff.charge`, `buff.grace`, `buff.march`, `buff.war_song` | Deferred spell hooks | `defer` | Buff behavior and timing effects are runtime-owned. |
| `buff.ember_spikes`, `buff.thornskin`, `buff.warmth`, `buff.preserve`, `buff.waterbreath`, `debuff.soaked`, `debuff.dirge`, `debuff.discord` | Deferred spell hooks | `defer` | Require element, environment, healing, control, or performance behavior decisions. |
| Item `useProfiles` | `items.json` | Evidence only | Item action, channel, hook, and activation ownership remains item/runtime-owned. |
| Monster action packages | `monsters.json` plus engine templates | Evidence only | Action package refs are indirect and should not become relationship fields yet. |
| Encounter/spawn/tactics descriptors | Encounter, spawn, role, and tactics content | Evidence only | They describe composition and AI posture, not static health vocabulary refs. |

## Relationship-Field Decision

Future relationship fields should remain absent for the first live seed.

The first schema/validator implementation should also defer relationship-field validation. Current evidence is strong enough to validate wrapper shape, `kind`, ids, slug coherence, names, lifecycle, tags, safe summaries, owner posture, and forbidden-field rules. It is not strong enough to validate relationships to abilities, spells, skill effects, items, monsters, or cross-kind records without implying behavior or overfitting the first seed.

Relationship fields can be reconsidered in a later seed plan after exact records are selected.

## Combined-Catalog Posture Check

One combined `combat_health_vocabulary` catalog remains the right first-pass authority shape.

The accepted future file-path posture remains valid:

- future content: `packages/content/base/game/combat_health_vocabulary.json`
- future schema: `packages/schemas/game/combat-health-vocabulary.schema.json`
- future validator: `tools/content-lint/combat-health-vocabulary.mjs`
- future focused tests: `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`

The shared forbidden-field policy is more important than splitting status, condition, and injury files before any live seed exists.

## Deep Research Decision

Deep Research is not required before schema/validator implementation.

`GPT-DR.health.injury-recovery` is required before a later seed plan if that seed plan selects broad health, injury, treatment, recovery, disease/poison, poison exposure, medicine, death/defeat, healing-service, or long-term injury vocabulary. It is not required for a records-only schema and pure validator that reject runtime behavior.

## Future Schema/Validator Readiness Decision

The future schema/validator route is ready if it stays narrow:

- implement one combined schema;
- implement one pure focused validator;
- add focused tests;
- add schema-file parse coverage;
- keep live content absent;
- keep normal content-lint registration absent;
- keep relationship fields absent;
- recursively reject runtime, damage, healing, duration, tick, stack, cure, resistance, UI, save/account, command, event, reward, migration, and gameplay fields.

No boundary contradiction or roadmap drift was found.

## Future Seed-Plan Requirements

A later seed plan should:

- choose a tiny planned-only candidate list;
- prefer `combat_status.stagger` and possibly `combat_status.bind` as the first status candidates if fresh evidence still matches;
- avoid condition records until deferred hook behavior is reviewed;
- avoid injury records until stronger direct evidence or Deep Research exists;
- omit relationship fields unless exact safe refs are proven;
- keep records descriptive and non-executing;
- avoid normal content-lint registration until live content exists and a separate registration decision approves it.

## Options Considered

| Option | Decision | Rationale |
| --- | --- | --- |
| Proceed to schema/validator implementation | Selected as next route | Evidence confirms absence, boundary, combined path posture, no Deep Research blocker, and relationship omission. |
| Run seed plan next | Rejected | Schemas and focused validators do not exist yet. |
| Run Deep Research next | Rejected for now | Not needed for schema/validator implementation. |
| Boundary follow-up | Rejected | The accepted boundary decision remains coherent. |
| Pause lane | Rejected | A narrow schema/validator route is ready. |

## Selected Option And Rationale

Select:

- `Version 0.5.310 - Combat Status Condition Injury Schema And Validator`

This is the smallest useful implementation route after the evidence audit. It creates validation authority without creating live vocabulary records, normal lint registration, relationships, runtime behavior, or gameplay semantics.

## Risks And Mitigations

- Risk: Static vocabulary could be mistaken for runtime behavior. Mitigation: schema and validator must recursively reject runtime, damage, healing, duration, tick, stack, cure, resistance, UI, save/account, command, event, reward, migration, and gameplay fields.
- Risk: Relationship fields could imply execution. Mitigation: keep them absent until a seed plan proves exact safe refs.
- Risk: Deferred spell hooks could be seeded prematurely. Mitigation: treat deferred hooks as candidate evidence only and require a later seed plan.
- Risk: Injury records could be invented from broad genre expectations. Mitigation: select no injury candidates without stronger direct evidence or Deep Research.

## Explicit Non-Goals

This audit does not:

- create `packages/content/base/game/combat_health_vocabulary.json`;
- create `packages/schemas/game/combat-health-vocabulary.schema.json`;
- create `tools/content-lint/combat-health-vocabulary.mjs`;
- create `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`;
- edit schemas, validators, tests, content, runtime, UI, save/account, commands, events, rewards, migrations, or gameplay;
- add status, condition, or injury records;
- add damage formulas, healing formulas, duration/tick/stack behavior, cure behavior, immunity/resistance/vulnerability execution, or combat execution;
- implement `world.pois`;
- reopen Highcrown settlement Knowledge;
- run Deep Research;
- create temporary Deep Research artifacts.

## Audit Question Answers

1. No canonical static combat health vocabulary content file exists.
2. Combat status, condition, and injury schemas are not present.
3. Focused validators are not present.
4. Focused tests are not present.
5. Normal content-lint registration is not present.
6. Abilities contain `status.hamstrung`, `status.pinned`, `status.prone`, `status.stagger`, `status.stun`, and `debuff.disabled`.
7. Spells contain runtime and deferred `status.*`, `buff.*`, and `debuff.*` hooks; unknown spell hooks are absent.
8. Skill effects contain `status.bind`, `status.stagger`, `buff.protect`, `buff.ward`, and `buff.anthem`.
9. Item use profiles contain `status.stagger` only among status-like hooks.
10. Ability `requirements.targetConditionsAny` strings are `grappled`, `helpless`, `incapacitated`, and `parry_window`.
11. Runtime-supported current status-like hooks include `status.bind`, `status.hamstrung`, `status.pinned`, `status.prone`, `status.stagger`, `status.stun`, `debuff.disabled`, `buff.protect`, `buff.ward`, and `buff.anthem`; engine support also includes `status.sleep`.
12. Deferred current spell status-like hooks are listed in the spell evidence audit.
13. Unknown or unsupported current authored spell hooks are absent; unsupported fixture hooks exist only in tests.
14. Candidate future `status` records include `stagger`, `bind`, `stun`, `prone`, `pinned`, `hamstrung`, `protect`, `ward`, and possibly `grappled`.
15. Candidate future `condition` records are deferred: `blind`, `slow`, `burn`, `curse`, and `poison`.
16. Candidate future `injury` records: none should be selected from current evidence.
17. Unsafe strings include terms that imply runtime behavior, damage, healing, duration, ticks, stacks, cure, resistance, UI, save/account, or gameplay, especially burn, regeneration, restore hooks, incapacitated, helpless, parry windows, poison, wound, and injury terms.
18. Existing ability, spell, skill-effect, item, monster, encounter, spawn, combat role, and tactics files should remain evidence-only and untouched.
19. Future relationship fields should be absent for the first live seed.
20. First schema/validator implementation should defer relationship-field validation.
21. One combined `combat_health_vocabulary` catalog remains the right first-pass shape.
22. The accepted future file-path posture remains valid.
23. Deep Research is not required before schema/validator implementation.
24. Deep Research is required before a later seed plan only if broad health, injury, treatment, recovery, disease/poison, death/defeat, medicine, healing-service, or long-term injury modeling is selected.
25. No nonstandard support-suffix run is needed.
26. No explicit user question is needed before proceeding.
27. The immediate next route should be `Version 0.5.310 - Combat Status Condition Injury Schema And Validator`.

## Checks Run

- `git status --short --branch`
- `git fetch origin`
- `git pull --ff-only origin master`
- Required reads of current handoffs, sequence, roadmap, backlog, schema plan, boundary decision, static authority consolidation audit, resource/commodity gate, pipeline consolidation decision, GPT Deep Research prompt-pack decision, relevant runtime/type files, content-lint hook support, magic metadata support, required content files, and relevant tests.
- Structured scans for file absence, normal-lint registration absence, status-like hooks, ability target-condition strings, item use profile count, monster/encounter/spawn/tactics evidence, and candidate safety.
- `npm.cmd run tool:content-lint` (passed; `content-lint: ok (66 files checked)`)
- `node --test tests/unit/schema-files.test.mjs` (passed; 101 tests)
- `git diff --check` (passed with line-ending normalization warnings only)
- `git status --short --branch`
- Conflict-marker scan across changed docs (no matches)
- Trailing-whitespace scan across changed docs (no matches)
- Changed-file audit confirmed only approved docs changed and no package, tool, test, app, runtime, schema, validator, or content files changed.
- Current-route scan confirmed active next-route pointers use `Version 0.5.310 - Combat Status Condition Injury Schema And Validator`; older `0.5.309` references are historical.
- Highcrown and `world.pois` scans found only closed-lane, rejection, or no-change language.

## Next Recommended Version

Version 0.5.310 - Combat Status Condition Injury Schema And Validator
