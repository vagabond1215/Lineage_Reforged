# Combat Status Condition And Injury Boundary Decision

Source version/run: Version 0.5.289 - Combat Status Condition And Injury Boundary Decision
Date: 2026-07-07

## 1. Decision summary

Select Option D: a limited hybrid boundary.

A future non-executing static combat health vocabulary is justified in principle, but implementation is deferred. The preferred future shape is one typed vocabulary/catalog planned together, with records explicitly classified as `status`, `condition`, or `injury`, rather than three immediate standalone authorities.

The future catalog, if implemented, may define stable identity, family, tags, plain-language semantics, persistence posture, source domains, and relationship hints. It must not own active status instances, resource deltas, current disease or poison exposure, wounds, recovery timers, scars, death, defeat, incapacitation, player/NPC state, save/account state, commands, events, rewards, UI, storage, or gameplay execution.

This run is documentation-only. It does not add combat status, condition, or injury content; schemas; validators; tests; runtime behavior; UI; storage; commands; events; rewards; migrations; save/account behavior; combat math; health/resource behavior; or gameplay behavior.

The immediate next route is `Version 0.5.290 - Static Authority Validation Consolidation Audit`.

## 2. Current completed-state posture

Latest completed primary before this run:

- `Version 0.5.288 - Resource And Commodity Schema Decision`

Latest completed support/audit run:

- `Version 0.5.276.1 - Pipeline Versioning And Roadmap Drift Audit`

Current run:

- `Version 0.5.289 - Combat Status Condition And Injury Boundary Decision`

Next primary route selected by this decision:

- `Version 0.5.290 - Static Authority Validation Consolidation Audit`

The Highcrown settlement Knowledge lane remains closed from `Version 0.5.285 - Highcrown Settlement Knowledge Lane Closure Review`. This decision does not reopen it.

## 3. Existing combat and health-like surfaces

Current combat and health-like concepts already exist across separate owners:

- `world.monsters` owns static monster identity, archetype baselines, default roles, action packages, difficulty hooks, and source-local drop/loot descriptors.
- `world.encounter_templates` owns authored encounter composition patterns.
- `world.spawn_profiles` owns world placement and selection envelopes for encounter templates.
- `game.combat_roles` and `game.tactics_presets` own tactical vocabulary and default preferences.
- Shared combat state already defines runtime `CombatStatusEffectState` with id, label, source, stacks, magnitude, start and expiry ticks, and tags.
- Shared combat state also owns combatant resources, active status-effect arrays, incapacitated and defeated flags, actions, targeting, timing, overrides, outcomes, and history.
- Player state owns `resources`, `resourceRuntime`, `bodyState`, `activeEffects`, equipment, inventory, flags, combat profile, save metadata, and other mutable state.
- Player resource runtime owns active resource modifiers, pending resource changes, tick breakdowns, and resource-change history for HP, MP, and stamina.
- Player body state owns nutrition, hydration, fatigue, intoxication, starvation, recovery, and resolved stamina/action/recovery multipliers.
- Spell hook support currently classifies some `status.*`, `buff.*`, and `debuff.*` hooks as runtime-consumed or deferred metadata. These hooks are not a static status catalog.
- Item `useProfiles`, future equipment profiles, spells, abilities, skills, and monster action-package references provide possible sources or metadata, but they do not own active applied status or injury state.

No canonical static status, condition, or injury vocabulary collection exists.

## 4. Term definitions

Status:

A status is an applied or applyable temporary combat/effect state such as bound, staggered, burned, slowed, protected, warded, blessed, blinded, cursed, poisoned, bleeding, or similar effect-like posture.

Status records, if later implemented, describe a stable effect vocabulary. Runtime owns active stacks, source actor, magnitude, start tick, expiry tick, periodic progress, removal, current modifiers, and resource changes.

Condition:

A condition is a broader health, body, mental, exposure, environmental, social-combat, or capability posture that may last beyond one combat exchange. Examples include fatigue, dehydration, intoxication, hunger, exhaustion, disease exposure, fear-like morale pressure, encumbrance-like strain, or recovery posture.

Condition records, if later implemented, describe vocabulary and category semantics. Player/NPC/body/runtime/save owners keep current severity, durations, resource effects, recovery, treatment, and persistence.

Injury:

An injury is a wound or lasting harm to a body or actor, such as cuts, fractures, burns, concussions, trauma, scars, maiming, blood loss, or other persistent impairment.

Injury records, if later implemented, describe static vocabulary and broad classification only. Runtime/save/player/NPC owners keep current wound instances, severity, location, healing progress, scars, complications, treatment state, disability, death risk, and persistence.

## 5. Options considered

Option A: no static authority.

Statuses, conditions, and injuries would remain entirely runtime or source-owner strings. This is safest today but risks vocabulary drift across combat, spells, items, body state, monsters, quests, and future services.

Option B: one combined static vocabulary with typed records.

One future records-only catalog defines common identity, tags, provenance, descriptions, and forbidden fields while each record declares whether it is a `status`, `condition`, or `injury`. This reduces duplication and lets validators enforce one non-executing contract.

Option C: three separate static authorities.

Separate future authorities for statuses, conditions, and injuries would make each boundary explicit, but this is too much immediate structure before runtime health, injury, disease, treatment, and persistence contracts are stable.

Option D: limited hybrid.

Approve the need for future static vocabulary in principle, prefer one typed catalog planned as a unit, and defer implementation until a later schema plan proves exact fields, names, paths, validation, and seed scope.

## 6. Selected option and rationale

Option D is selected.

A future static vocabulary is useful because status, condition, and injury language is cross-cutting. Combat, spells, item use profiles, body/resource runtime, monster descriptors, quests, services, healing, repair-like treatment, Chronicle output, and future NPC/social systems will all need stable names for effect and health states.

The static catalog should be typed rather than split immediately because first-pass validation needs a shared forbidden-field policy more than separate file ownership. All three families must reject active state, resource mutation, actor references, timers, recovery progress, payout, commands, UI, and persistence. A unified schema plan can still require family-specific fields only where needed.

Implementation remains deferred because current runtime already has active combat status state and player resource/body state, but persistent injuries, wounds, disease exposure, treatment, death/defeat consequences, and recovery are not ready for static seeds. Premature schemas could accidentally bake in gameplay math, save structure, medical systems, or combat outcomes.

## 7. Static status boundary

A future static status record may define:

- stable id, likely `combat_status.<slug>` or another path chosen by a later schema plan;
- slug and display name;
- `kind: "status"`;
- non-executing summary;
- status family such as control, damage-over-time, buff, debuff, protection, mobility, perception, morale, poison, disease-like, or environmental, if later approved;
- descriptive tags;
- broad duration posture such as instant, timed, encounter, rest-cleared, or persistent-risk only as vocabulary;
- broad stacking posture only as descriptive vocabulary;
- source domains such as spell, item, ability, environment, monster action, trap, body state, or scripted event;
- optional relationship hints to supported resolution hooks after those owners expose stable contracts;
- provenance and notes.

A future static status record must never define:

- active stacks, source actor, target actor, magnitude on an actor, start tick, expiry tick, current duration, periodic progress, current removal state, current target, or current owner;
- direct HP, MP, stamina, resource modifier, healing, damage, degeneration, or regeneration execution;
- runtime costs, cooldowns, action queues, targeting, AI behavior, threat, pathing, manual overrides, or combat outcomes;
- current poison/disease exposure, infection progression, recovery, treatment, scars, death risk, defeat state, or persistence;
- item instances, inventory mutation, reward payout, quest progress, Chronicle writing, UI state, command handlers, events, save/account state, or gameplay behavior.

## 8. Static condition boundary

A future static condition record may define:

- stable id, likely `combat_condition.<slug>` or another path chosen by a later schema plan;
- slug and display name;
- `kind: "condition"`;
- non-executing summary;
- condition family such as body, fatigue, hydration, nutrition, intoxication, exposure, morale, disease, poison, environmental, encumbrance, recovery, or social-combat posture, if later approved;
- descriptive tags;
- broad persistence posture, such as momentary, encounter, day, rest, treatment, chronic, or narrative, as vocabulary only;
- source domains such as body state, environment, combat, magic, item, service, disease, poison, law/social, or scripted event;
- optional relationship hints to player body/resource state, combat status records, or injury records after those contracts exist;
- provenance and notes.

A future static condition record must never define:

- current severity, current band, counters, timers, source actor, current location, treatment progress, recovery progress, or persistence on a player/NPC/save;
- resource maxima, resource deltas, stamina/action/recovery multipliers, fatigue gain, hydration loss, starvation load, intoxication decay, or any body-state math;
- active disease or poison exposure, symptoms, incubation, spread, cure, immunity, relapse, or infection state;
- runtime eligibility, access gates, service healing, rest execution, item consumption, spell execution, commands, events, rewards, UI, storage, save/account state, or gameplay behavior.

## 9. Static injury boundary

A future static injury record may define:

- stable id, likely `combat_injury.<slug>` or another path chosen by a later schema plan;
- slug and display name;
- `kind: "injury"`;
- non-executing summary;
- injury family such as cut, bruise, burn, fracture, sprain, puncture, concussion, trauma, blood loss, scar, impairment, or maiming, if later approved;
- descriptive tags;
- broad body-region compatibility only if a later body-part or anatomy contract exists;
- broad severity vocabulary only as descriptive labels, not thresholds or math;
- broad treatment or recovery posture as vocabulary only;
- possible source domains such as weapon, fall, fire, poison, disease, magic, trap, environment, or scripted event;
- provenance and notes.

A future static injury record must never define:

- a current wound instance, actor id, body location on a specific actor, active severity, current pain, current bleeding, current infection, healing progress, treatment state, scar state, disability, death risk, or recovery timer;
- HP damage, bleed ticks, fracture penalties, mobility penalties, stamina costs, action locks, medical checks, surgery, rest outcomes, item consumption, magic healing, or service execution;
- death, defeat, incapacitation, resurrection, capture, surrender, retreat, corpse state, loot eligibility, Chronicle writing, save/account persistence, UI, commands, rewards, or gameplay behavior.

## 10. Ownership matrix

| Concern | Future static vocabulary posture | Current or future owner |
| --- | --- | --- |
| Status identity | May define stable non-executing `status` vocabulary. | Future typed catalog, if implemented. |
| Condition identity | May define stable non-executing `condition` vocabulary. | Future typed catalog, if implemented. |
| Injury identity | May define stable non-executing `injury` vocabulary. | Future typed catalog, if implemented. |
| Active combat status instance | Forbidden. | Combat runtime/save state. |
| Current HP, MP, stamina | Forbidden. | Player/combat resource runtime and save state. |
| Resource modifiers and changes | Forbidden except descriptive source-domain hints. | Player resource runtime, equipment/runtime modifiers, events. |
| Body nutrition, fatigue, hydration, intoxication, starvation, recovery values | Forbidden. | Player body state and body-state runtime helpers. |
| Wounds, injury severity, treatment, scars, recovery timers | Forbidden. | Future health/injury runtime/save/player/NPC owners. |
| Disease or poison exposure state | Forbidden. | Future disease/poison runtime/save/player/NPC owners. |
| Death, defeat, incapacitation, surrender, retreat, capture | Forbidden. | Combat runtime, run lifecycle, narrative/consequence owners. |
| Monster archetype descriptors | May reference future vocabulary only after schema support. | `world.monsters`. |
| Encounter/spawn composition | May reference future vocabulary only descriptively if approved. | `world.encounter_templates`, `world.spawn_profiles`. |
| Spell/item/ability effect hooks | May reference future vocabulary only after hook contracts support it. | Spell, item, ability, skill, and runtime owners. |
| Healing or treatment services | May reference condition/injury vocabulary only descriptively if approved. | Future services plus runtime health/service owners. |
| Rewards, loot, inventory mutation | Forbidden. | Item, reward, inventory, runtime/save owners. |
| Quest, Chronicle, Knowledge, social, law consequences | Forbidden to execute. | Their respective authored and runtime owners. |
| UI, commands, events, storage, gameplay | Forbidden. | UI, command, event, storage, and runtime systems. |

## 11. Required blockers before implementation

Before any combat status, condition, or injury schema/content implementation, a fresh docs-first schema plan must resolve:

- exact collection path or paths, wrapper shape, id prefixes, slug rules, and `kind` vocabulary;
- whether the first implementation should use one typed catalog or split files under one schema plan;
- exact required fields and family-specific optional fields;
- first-pass status, condition, and injury family vocabularies;
- relationship to current `CombatStatusEffectState` and whether static ids can appear in active runtime state;
- relationship to `PlayerResourceModifierState`, `PlayerResourceChangeRequestState`, `PlayerBodyState`, and `activeEffects`;
- relationship to spell `status.*`, `buff.*`, and `debuff.*` hook classification;
- relationship to item `useProfiles`, future weapon/armor profiles, ability hooks, skill effects, monster action packages, tactics, and combat roles;
- relationship to poison, disease, morale, fear, death, defeat, treatment, recovery, scars, and future health/injury persistence;
- exact forbidden-field validator rules for active stacks, magnitudes, durations, resource deltas, current body values, wound instances, timers, runtime execution, save/account state, UI, commands, events, rewards, and gameplay;
- a seed plan proving any first records are small, source-backed, and not gameplay math.

## 12. Rejected alternatives

- Implement schemas or seed records now: rejected because this run is docs-only and runtime health/injury persistence is not ready.
- Use three immediate standalone authorities: rejected because the shared forbidden-field policy and unresolved health runtime boundaries are more important than separate files today.
- Treat runtime `CombatStatusEffectState` as the static catalog: rejected because it stores active instance fields such as stacks, source, start tick, and expiry tick.
- Put body-state math into conditions: rejected because player body state already owns current values and resolved multipliers.
- Put wound or injury instances into static records: rejected because injuries require actor-specific runtime/save state.
- Add poison, disease, morale, death, defeat, recovery, treatment, or healing behavior: rejected because those require dedicated runtime/save decisions.
- Reopen Highcrown Knowledge work: rejected because the Highcrown settlement Knowledge lane is closed.

## 13. Explicit non-goals

This decision does not add or edit combat status content, condition content, injury content, resource content, commodity content, service content, Knowledge snippets, Knowledge registry/domain/trial-policy content, content JSON files, schemas, validators, tests, runtime code, UI, storage, commands, events, rewards, migrations, save/account behavior, combat math, health/resource behavior, route/travel behavior, building/workplace/economy behavior, court/law behavior, vendor/market behavior, cargo/storage behavior, settlement/district/site content, anchors, sacred-site/religious-hotspot content, or gameplay behavior.

This decision does not implement `world.resources`, `world.commodities`, `civilization.services`, or any status/condition/injury catalog. It does not authorize migrations, compatibility aliases, generated content, normal content-lint registration, old-save preservation, or transition to `0.6.0`.

## 14. Validation and audit posture

This run should validate docs-only scope:

- only docs changed;
- no package content, schema, validator, test, runtime, UI, storage, command, event, reward, migration, save/account, combat, health/resource, route/travel, building/workplace/economy, court/law, vendor/market, cargo/storage, settlement/district/site, sacred-site/religious-hotspot, service/resource/commodity, Knowledge, or gameplay files changed;
- `0.5.289` is marked complete in workflow docs;
- `0.5.290 - Static Authority Validation Consolidation Audit` is the immediate next primary route;
- the Highcrown settlement Knowledge lane remains closed context.

## 15. Next recommended version

Version 0.5.290 - Static Authority Validation Consolidation Audit

That run should remain docs-first and audit settled static authority lanes before further seeds. It should check whether recent static boundary decisions have coherent validation posture, owner separation, stale roadmap references, and forbidden-field rules. It must not add content, schemas, validators, tests, runtime/UI/storage/commands/events/rewards/migrations/save-account behavior, combat status/injury behavior, resource/commodity/service implementation, or gameplay behavior unless a later focused implementation prompt explicitly scopes that work.
