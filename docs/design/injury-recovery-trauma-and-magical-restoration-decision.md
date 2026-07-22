# Injury Recovery, Trauma, And Magical Restoration Decision

Date: 2026-07-22

Status: accepted focused design authority; documentation only; no runtime, schema, save, combat, health, trauma, treatment, magic, resurrection, UI, content, or balance implementation is authorized

## 1. Purpose

Define the accepted injury and recovery classes needed by Normal Stakes defeat, future health persistence, combat consequences, recovery, trauma, magical healing, and Chronicle systems.

This decision separates:

- ordinary physical injuries that recover fully over time;
- trauma-instigated nonphysical conditions;
- normally irreversible physical harm that only exceptional magic can restore;
- actual death and resurrection, which remain separate from ordinary injury recovery.

It does not create a complete medical simulation or require a catalog of modern diagnoses.

## 2. Precedence And Boundaries

This decision is more specific than `docs/design/combat-status-condition-injury-boundary-decision.md` for:

- injury recovery classes;
- ordinary physical severity vocabulary;
- trauma-condition semantics;
- the player-facing trauma umbrella;
- naturally irreversible versus magically restorable harm;
- the relationship between injury, current attributes, defeat, magic, and death.

The older hybrid static-vocabulary decision remains controlling for the rule that static records do not own active actor state, timers, current severity, treatment progress, resource mutation, saves, commands, or gameplay execution.

`docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md` remains controlling for Normal Stakes:

- ordinary HP zero is defeat or incapacitation rather than implicit terminal death;
- campaign identity and saves remain intact;
- terminal outcomes require separate authority.

`docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md` remains controlling for future restricted Stakes:

- actual death is irreversible once terminally committed;
- the dead character is closed to gameplay and retained as read-only history;
- this injury decision does not create a resurrection exception to that terminal closure.

## 3. Core Classification Model

Severity and recoverability are separate dimensions.

A serious injury can still be naturally recoverable. A localized injury can be naturally irreversible. Trauma may be mild in immediate functional effect yet persist for a long time.

Conceptually:

```text
harm domain
  -> physical injury | trauma condition | actual death

physical recovery class
  -> naturally recoverable | normally irreversible, magically restorable

ordinary physical severity
  -> minor | moderate | major

use posture
  -> ordinary use | reduced use | protected/no use
```

These are conceptual contracts, not accepted schema field names.

## 4. Naturally Recoverable Physical Injuries

A naturally recoverable physical injury is acute, nonchronic harm that can return to full functional recovery through time and ordinary biological healing when it does not become complicated.

Accepted severity labels:

- `Minor`;
- `Moderate`;
- `Major`.

Severity primarily describes:

- immediate impairment;
- pain and functional burden;
- likely recovery duration;
- required protection or reduced use;
- treatment value;
- complication and reinjury risk.

Severity does not by itself determine permanence.

### 4.1 Minor

Minor injuries usually create limited impairment and relatively short recovery.

They may permit ordinary use, cautious use, or brief reduced use depending on the affected function.

Examples may include shallow cuts, bruising, mild strains, minor burns, and other bounded harm, but exact seed records remain deferred.

### 4.2 Moderate

Moderate injuries create meaningful impairment, longer recovery, and a greater need to protect the affected function.

They may require reduced use, splinting, rest, assistance, or other injury-specific precautions even when formal treatment is not required for eventual full recovery.

### 4.3 Major

Major naturally recoverable injuries create severe temporary impairment and long recovery but remain capable of complete functional healing by definition.

A complex wound that cannot plausibly recover fully without exceptional restoration does not belong in this class merely because it is severe.

Major injuries may require prolonged reduced use or protected nonuse. Continued misuse may delay recovery or create a separate complication.

### 4.4 Recovery Invariants

Naturally recoverable injuries:

- recover fully when their recovery course completes without conversion to another harm state;
- do not create a permanent base-attribute change;
- may create scars or cosmetic history without persistent functional loss;
- may temporarily affect current attributes, actions, speed, carrying, combat, work, sleep, or recovery through the appropriate owner;
- may recover without professional treatment;
- may recover faster, more safely, or with less impairment through competent treatment;
- may require reduced use or protected nonuse even without formal treatment;
- do not become chronic merely because their recovery duration is long.

Exact durations, formulas, and activity restrictions remain owner-specific balance work.

## 5. Treatment, Reduced Use, And Complications

Treatment and use restriction are independent.

An injury may be:

- safe to use normally while healing;
- safe only under reduced use;
- unsafe to use until a recovery threshold is reached;
- improved by treatment without requiring treatment;
- vulnerable to reinjury, infection, displacement, or other complications.

The naturally recoverable class guarantees the intended uncomplicated endpoint, not immunity from later harmful events.

Causal overuse, reinjury, contamination, neglect, or failed stabilization may:

- delay recovery;
- increase current severity;
- add a complication;
- convert the harm into a different persistent or normally irreversible state where a later owner contract permits it.

Such conversion must be traceable and must not be a hidden random punishment.

Grim World may deepen complication, sanitation, or treatment systems after their own owner contracts. Heroic World does not require those advanced layers merely to support ordinary injuries.

## 6. Trauma Conditions

Trauma-instigated nonphysical harm is represented as a condition family rather than as ordinary physical injury.

Accepted player-facing umbrella:

**Shaken Spirit**

Internal owners may use a neutral trauma-family identifier. `Shaken Spirit` is a broad lore-facing term, not an exact modern diagnosis.

It must not be interpreted as:

- magical soul damage;
- possession;
- moral weakness;
- insanity;
- a complete psychiatric taxonomy;
- a universal personality rewrite.

## 7. Shaken Spirit Expressions

A Shaken Spirit condition may express one or more trauma-linked patterns such as:

- recurring dread;
- nightmares or disturbed sleep;
- intrusive recollection;
- heightened startle or vigilance;
- avoidance of places, situations, crowds, open spaces, confinement, combat, or other event-linked triggers;
- persistent suspicion or fear after betrayal, captivity, violence, or persecution;
- emotional withdrawal or numbness;
- difficulty returning to a previously dangerous activity;
- panic-like or freezing responses under a relevant trigger.

These are descriptive expressions and tags, not a requirement to implement separate modern conditions such as PTSD, agoraphobia, paranoia, or anxiety disorders.

The source event and relevant triggers must remain part of the causal record where practical.

## 8. Trauma Recovery Courses

Trauma does not use the same guaranteed recovery rule as naturally recoverable physical injury.

A Shaken Spirit condition may be:

1. **Self-resolving** — improves with time, safety, sleep, ordinary routine, and distance from the initiating danger.
2. **Support-responsive** — may resolve naturally but improves through companionship, counsel, spiritual care, ritual, household support, trusted leadership, a healer, a confessor, a veteran mentor, or another lore-appropriate source of care.
3. **Treatment-dependent or persistent** — may remain unresolved for a long period, may require focused care or exceptional circumstances, and is not guaranteed to disappear merely because time passes.

A trauma condition can therefore recover:

- without treatment;
- with treatment or support;
- only after specific support, safety, or event resolution;
- incompletely or not at all during the observed campaign.

It remains a mutable condition, not an immutable base trait.

## 9. Trauma Gameplay Guardrails

Trauma consequences must be:

- caused by a sufficiently serious or personally meaningful event;
- related to recorded triggers, memories, locations, actors, or circumstances;
- telegraphed and explainable;
- capable of support, coping, avoidance, preparation, or treatment where appropriate;
- proportional rather than generated after every defeat or frightening event;
- distinct from magical compulsion and mind control;
- distinct from ordinary morale pressure or short combat fear;
- respectful of character agency.

Trauma must not routinely force arbitrary dialogue, betrayal, violence, or self-destructive action.

Possible effects should prefer bounded, contextual consequences such as:

- increased stress or recovery burden;
- reduced effectiveness under a known trigger;
- hesitation, avoidance, or impaired rest;
- additional preparation or support needs;
- altered current-state projections.

No trauma condition changes immutable base attributes. It must not permanently rewrite the character's authored personality without a separate narrative choice or authority.

## 10. Normally Irreversible, Magically Restorable Harm

Some physical harm does not recover fully through ordinary biological healing.

Accepted class:

**Normally irreversible harm**

Such harm may be stabilized, treated, rehabilitated, compensated for, or adapted to through mundane means, but complete restoration requires explicitly capable magic.

Potential examples include:

- loss of a limb;
- destruction of an eye or another nonregrowing organ;
- severe tissue loss;
- normally permanent blindness or deafness from destroyed structures;
- severe nerve or spinal damage;
- extreme disfigurement with functional tissue loss;
- certain magical wounds, blights, petrification effects, or curses where their own owner defines restoration requirements.

Exact injuries, anatomy, and setting capabilities remain future catalog and magic-authority work.

## 11. Mundane Adaptation Is Not Magical Recovery

Mundane treatment may:

- stop bleeding;
- close and protect a wound;
- prevent or treat infection;
- reduce pain;
- preserve remaining function;
- support rehabilitation;
- provide prostheses, braces, tools, mounts, attendants, or changed techniques;
- enable a stable and capable life with the impairment.

Those outcomes are meaningful recovery and adaptation, but they do not recreate destroyed anatomy.

Prosthetic or assistive function must not be mislabeled as regrowth. A character may regain substantial capability through equipment, training, and adaptation without the original injury being physically erased.

## 12. Magical Restoration

Only magic whose accepted capability explicitly includes the required restoration may reverse normally irreversible harm.

Ordinary healing magic must not automatically:

- regrow limbs;
- recreate destroyed organs;
- reverse every scar or impairment;
- restore a corpse to life;
- remove every trauma condition;
- erase all rehabilitation, adaptation, or narrative consequences.

Potential high-order magical capabilities may include:

- restoration of otherwise permanently damaged tissue;
- regrowth of a limb or organ;
- reversal of specific magical transformations or curses;
- resurrection under a separate death contract.

Availability direction:

- healers capable of such magic are extremely rare;
- access may require major travel, standing, patronage, faith, law, or institutional permission;
- service is exceptionally expensive or resource-intensive;
- rare materials, rituals, sites, timing, or obligations may be required;
- not every polity, faith, lineage, school, or settlement possesses the same capability;
- finding a healer does not guarantee willingness, legality, compatibility, or success.

Exact prices, probabilities, spell identities, healer counts, and requirements are deferred.

## 13. Resurrection Boundary

Resurrection is not ordinary injury healing.

It is a magical death-reversal system that must be governed by:

- the death owner;
- the magic owner;
- the selected Stakes rules;
- corpse, time, identity, soul, body, and causality contracts where later accepted;
- Chronicle, succession, estate, and save integrity.

Under Normal Stakes, a later focused contract may permit exceptionally rare and expensive resurrection.

Under the currently accepted future restricted-Stakes authority, once actual death is atomically committed as terminal, the character remains closed. This decision does not reopen that character through resurrection.

Any future desire to allow resurrection in restricted Stakes would require an explicit superseding Stakes decision and cannot be inferred from the existence of resurrection elsewhere in the setting.

## 14. Relationship To Attributes And Body State

Immutable base attributes never change because of injury or trauma.

Accepted posture:

```text
current attribute
  = immutable base
  + developed adjustment
  + structural-loss adjustment
  + reversible body-condition adjustments
  + physical-injury adjustments
  + trauma-condition adjustments
  + equipment, magic, status, and contextual adjustments
```

Naturally recoverable physical injuries produce reversible injury adjustments.

Trauma produces condition- and trigger-owned adjustments.

Normally irreversible harm may produce persistent injury or capability adjustments until compensated for, restored, or otherwise resolved by its owner.

Magical restoration removes or transforms the injury-owned adjustment through the authoritative health/magic resolver. It does not rewrite immutable base values.

Nutrition-derived structural loss remains separate. An injury cannot be counted again as structural atrophy merely because it temporarily prevents activity.

## 15. Relationship To Normal Stakes Defeat

Normal Stakes defeat may create:

- no injury;
- a naturally recoverable physical injury;
- a Shaken Spirit condition;
- both physical and trauma consequences;
- another context-owned nonterminal consequence.

Defeat must not guarantee an injury merely as a generic tax.

Consequence requirements:

- source context matters;
- severity follows the actual event rather than a detached random table;
- minor and moderate injuries may be common bounded consequences where appropriate;
- major injuries require proportionate causes;
- normally irreversible harm must be exceptional, strongly causal, and clearly surfaced;
- magic-only harm must not be a routine fallback for ordinary defeat;
- actual death remains separately resolved.

The default Normal Stakes fallback must preserve campaign continuation and must not use permanent maiming, trauma, or item loss as an unavoidable repeated punishment loop.

## 16. Difficulty, Story, And Grim World

Difficulty may tune owner-approved:

- injury consequence weighting;
- recovery duration;
- reduced-use burden;
- treatment effectiveness;
- complication resistance;
- trauma recovery and support effectiveness;
- warnings and forecast precision.

Difficulty does not change:

- what physically happened;
- whether a limb exists;
- immutable base attributes;
- whether a specific magical capability exists;
- whether the selected Stakes mode permits resurrection.

Story may project injuries and Shaken Spirit through coarse, generous RPG states. Story should not require detailed recovery management and should not routinely produce normally irreversible harm as a defeat consequence.

Grim World may later add infection, sanitation, treatment scarcity, social stigma, institutional access, and other advanced systems through their own owner contracts. Grim World does not automatically make every injury permanent or every traumatic event debilitating.

## 17. Static Vocabulary Direction

A later typed status/condition/injury catalog may describe:

- stable identity;
- `status`, `condition`, or `injury` kind;
- physical, trauma, or other family;
- severity compatibility;
- natural-recovery posture;
- use-restriction vocabulary;
- treatment relationship;
- magical-restoration requirement;
- source-domain hints;
- descriptive trigger or symptom tags;
- provenance.

Static records must not contain current actor severity, timers, recovery progress, treatment state, active penalties, save state, commands, magic execution, or death resolution.

`Shaken Spirit` should be represented as a condition-family presentation boundary, not as physical injury or magical soul damage.

## 18. Validation Requirements

Later implementation must prove:

- severity and recovery class are independent;
- minor, moderate, and major naturally recoverable injuries can reach complete functional recovery;
- required reduced-use posture is injury-specific;
- treatment can assist without being universally required for natural recovery;
- complications are causal and do not silently mutate every injury into permanence;
- Shaken Spirit is trauma-instigated, lore-facing, and not a modern diagnostic catalog;
- trauma can resolve naturally, respond to support, or persist;
- trauma does not rewrite immutable attributes or authored personality;
- normally irreversible harm does not regenerate through ordinary time or generic healing;
- prosthetic or adaptive capability is distinct from anatomical restoration;
- only explicitly capable magic can regrow or restore destroyed structures;
- exceptional magical restoration remains rare and costly in access posture;
- resurrection follows death, magic, and Stakes authority rather than injury healing;
- restricted-Stakes terminal closure is not bypassed;
- Normal Stakes defeat does not routinely create permanent maiming or unavoidable trauma loops;
- injury, body condition, and structural loss are not double-counted;
- save/load does not reroll injury, trauma, treatment, or restoration truth.

## 19. Deferred Decisions

Deferred:

- exact injury catalog and anatomical model;
- exact durations and recovery curves;
- exact pain, use, combat, work, travel, sleep, and resource modifiers;
- treatment skills, services, items, facilities, and checks;
- complication types and rates;
- exact Shaken Spirit expression list and trigger schema;
- cultural and regional terminology variants;
- exact trauma recovery formulas and treatment effectiveness;
- prosthetic and assistive-equipment implementation;
- exact magical restoration spells, schools, materials, rituals, prices, and healer availability;
- resurrection availability and mechanics under Normal Stakes;
- corpse, soul, time-window, identity, and failure rules;
- party/NPC injury and trauma persistence;
- release version and implementation package.

## 20. Explicit Non-Decisions

This decision does not:

- implement injuries, trauma, treatment, healing, magic, resurrection, prosthetics, death, or defeat;
- create static records, schemas, validators, saves, UI, commands, services, spells, items, or tests;
- require a modern mental-health diagnostic catalog;
- declare every severe injury naturally recoverable;
- declare every trauma condition permanent;
- make every HP-zero event cause injury or trauma;
- make normally irreversible harm common;
- make high-order magical restoration readily available;
- authorize resurrection after restricted-Stakes terminal death;
- change current runtime archival or save-deletion behavior;
- restore held `0.6.6` or alter retained `0.6.7` artifacts.
