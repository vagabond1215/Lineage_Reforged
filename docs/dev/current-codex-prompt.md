# Current Codex Prompt

## Run Identity

`Narrative Realization, Mortal Crisis Presentation, And Elemental Ecology Repository Audit And Contract Planning`

Run classification: unversioned large documentation-only repository audit and contract planning

Milestone impact: `supports_current_band`

Parent version: none

Suggested commit:

`docs(design): audit narrative realization and elemental ecology contracts`

## Purpose

Perform one substantial repository-wide documentation audit that prepares two later durable design decisions:

1. a reusable narrative-realization boundary for grammar, referents, tense, event-time appearance/equipment truth, knowledge-limited prose, Mortal Crisis presentation, bounded prompt generation, validation, and deterministic fallback;
2. an elemental ecology and behavior boundary for the eight-element cosmology, three-and-three core alignment, environmental manifestation, passive/helpful temperament, active-magic stimuli, assimilation and opposition, beneficial capabilities, higher-element behavior, fae separation, and narrative projection.

This run may inspect broadly because these systems cross current player identity, equipment, Chronicle/manuscript, combat, party, encounter, spawn, magic, religion, monster, ecology, location, and presentation seams.

This run is documentation-only. It does not accept final design authority and does not implement runtime, shared types, schemas, generators, language-model integration, prompts sent to an external model, saves, migrations, combat, AI, encounters, spawning, magic reactions, religion changes, content, UI, tests, or gameplay.

## Why This Audit Is Required

The completed comparative mortality research supports a context-aware Mortal Crisis sequence, but the repository does not yet have an implementation-ready owner for generating accurate narrative from authoritative facts.

A Mortal Crisis scene must be able to describe, without inventing facts:

- who fell, acted, observed, carried, treated, or cast;
- correct names, titles, pronouns, grammatical number, and verb agreement;
- correct tense and chronology;
- event-time appearance, visible injuries, clothing, armor, held objects, worn equipment, dropped items, and positional changes;
- what each observer could actually see, recognize, diagnose, or know;
- qualitative urgency and changing condition without default exposure of exact hidden timers;
- multi-stage stabilization, transport, intermediate care, definitive treatment, resurrection, and closure decisions;
- elemental or other benevolent entities that were actually present and explicitly capable of helping.

The repository also has the eight canonical elemental identities and ecology hooks, but it does not yet have one accepted authority for:

- assigning three core elements to Light and three to Darkness;
- determining when elementals manifest from environmental affinity pressure;
- establishing their ordinary passive, curious, territorial, or helpful posture;
- reacting to active magic by resonance, higher-order alignment, assimilation, defensive opposition, or other typed response;
- handling beneficial elemental capabilities;
- distinguishing elementals from fae, spirits, guardian beasts, and other benevolent magical entities;
- preventing elemental assistance from becoming an unexplained rescue roll or deus ex machina.

## Temporary Precedence And Route Note

The active-run lines in `docs/dev/current-gpt-handoff.md` and `docs/dev/historical-version-and-deferred-route-register.md` predate this prompt and are stale only as to the current run identity.

This prompt temporarily controls the active run. Existing accepted design authorities remain controlling until a later explicit decision retains, narrows, or supersedes them.

The completed comparative research remains evidence, not authority.

Held `Version 0.6.6` remains paused. Do not restore it in this run.

## Required Source State

Read first:

- `docs/dev/tmp-comparative-checkpoint-mortality-rescue-and-stakes-research-2026-07-23.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`;
- `docs/design/campaign-rules-identity-migration-story-and-normal-stakes-decision.md`;
- `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`;
- `docs/design/restricted-stakes-continuity-death-closure-and-prestige-decision.md`;
- `docs/dev/tmp-normal-stakes-defeat-injury-trauma-and-restoration-audit-2026-07-22.md`;
- `docs/design/living-character-manuscript-design-boundary.md`;
- `docs/design/quest-event-chronicle-authority-boundary-decision.md`;
- `docs/design/person-vs-npc-schema-decision.md`;
- `docs/design/magic-system-charter.md`;
- `docs/simulation-rules/elemental_combat_and_enchanting.md`;
- `packages/content/base/world/religions.json`;
- relevant elemental monster reference files;
- `AGENTS.md`;
- `README.md`.

Relevant source identities:

- completed comparative research commit: `d2dff9fdf2b35206b5d7be91716aa614640f1ff3`;
- comparative research artifact blob: `26ce50958f348f316ab98bcafe31282393709fd6`;
- comparative research current-output blob: `e996fd61903431b4fd364b82ed2490e6dae6270a`;
- accepted defeat-fallback decision blob: `e32ee0eb7a64777e2ca1134600b189d80fd0eafe`;
- retained defeat/injury audit blob: `ad5b66157f61e25223e2abd7b2a7f4ef560366e3`;
- held `Version 0.6.6` prompt blob: `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.

## Execution Gate

1. Run `git status`, fetch, and fast-forward pull. Record branch, starting commit, and clean/dirty state.
2. Confirm this prompt is active.
3. Confirm commit `d2dff9fdf2b35206b5d7be91716aa614640f1ff3` is an ancestor of `HEAD`.
4. Confirm the comparative research artifact resolves to blob `26ce50958f348f316ab98bcafe31282393709fd6` and is unmodified.
5. Confirm the accepted defeat-fallback decision resolves to blob `e32ee0eb7a64777e2ca1134600b189d80fd0eafe` and is unmodified.
6. Confirm held `0.6.6` still resolves to blob `42014541c15d2d7ccc01f43dd8b0a4fa6fbf8769`.
7. Preserve unrelated work.
8. Do not use external research unless a repository term cannot be resolved internally. This run is primarily a live-repository audit, not another comparative survey.
9. If a required source identity does not match, record the contradiction in `docs/dev/current-codex-output.md`, do not invent a replacement authority, and stop without creating temporary audits.

# Part I — Narrative Realization And Mortal Crisis Presentation Audit

## 1. Live Narrative And Presentation Ownership Inventory

Inspect all current owners and consumers relevant to generated or assembled prose, including as applicable:

- Living Character Manuscript and Chronicle design boundaries;
- session Chronicle records and current UI-ready strings;
- discovery Chronicle;
- quest journals, event envelopes, run history, and run-end presentation;
- character-creation narrative copy;
- combat and encounter summaries;
- account history, titles, achievements, and Legacy presentation;
- any interpolation, templating, formatting, article, pluralization, pronoun, tense, or sentence-building helpers;
- any current external-AI, local-model, template, grammar, or prompt-builder foundation;
- deterministic fallback copy and error handling;
- TypeScript/JavaScript mirrors and tests.

For every discovered component, record:

- path and exported symbol;
- owning domain;
- whether it consumes authoritative facts, current snapshots, presentation strings, or prose;
- whether it is deterministic;
- whether it persists generated text;
- whether it can safely support Mortal Crisis scenes;
- gaps and collision risks.

Explicitly determine whether a general narrative realization engine exists. Do not treat scattered string interpolation as such an engine.

## 2. Identity, Sex, Gender, Pronoun, And Grammatical-Number Audit

Inspect current player, authored person, NPC, combatant, party, monster, animal, elemental, deity, generated-person, and group identities.

Determine:

- current sex identity values and their owners;
- whether gender presentation or pronoun preferences exist separately;
- whether `neutral` currently means a biological/mechanical value, grammatical profile, migration placeholder, or something else;
- whether singular `they` can be represented without confusing it with a plural group;
- whether non-person entities default to `it`, `they`, a name, a title, or authored terminology;
- whether deities' `presentationGender` can safely drive prose or is only descriptive content;
- whether generated people, combatants, party members, animals, monsters, and elementals have sufficient identity facts for prose;
- whether any source currently infers pronouns from sex, names, titles, lineage, appearance, or prose.

The audit must preserve these distinctions:

```text
physical or mechanical sex identity
  != gender identity or presentation
  != grammatical profile
  != narrative point of view
  != singular or plural referent count
```

Recommend a minimum future grammatical-profile contract capable of supporting:

- grammatical person;
- singular/plural number;
- subject, object, possessive-determiner, possessive-pronoun, and reflexive forms;
- singular `they`;
- group pronouns;
- irregular verb agreement;
- optional titles or honorifics;
- safe fallback when a profile is unavailable.

Do not accept final field names or modify current identity schemas in this run.

## 3. Referent, Discourse, And Ambiguity Audit

Determine the minimum future owner needed to choose safely among:

- canonical name;
- recognized name or alias;
- title;
- role description;
- relationship label;
- descriptive noun phrase;
- pronoun;
- collective group reference.

The proposed system must prevent ambiguous prose such as:

> Bran dragged Lyrian away as he began to lose consciousness.

when the intended referent is not unambiguous.

Audit requirements for a future discourse state, including:

- current paragraph subject;
- recently mentioned entities;
- competing same-pronoun referents;
- active threat and patient;
- recognition state;
- point of view;
- tense;
- location and scene phase;
- prior chosen labels;
- repetition avoidance that never sacrifices clarity.

Determine whether this belongs in a reusable narrative engine, a presentation package, a Chronicle/manuscript owner, or a narrower Mortal Crisis adapter.

## 4. Tense, Aspect, Grammar, And Inflection Audit

Inspect whether the repository currently supports:

- past and present tense;
- first, second, and third person;
- singular/plural verb agreement;
- irregular verbs such as `be`, `have`, `do`, `go`, `lie`, `lay`, `fall`, `flee`, and `carry`;
- articles and determiners;
- count and mass nouns;
- possessives;
- coordinated subjects;
- capitalization and punctuation;
- sentence joining and paragraph continuity.

Recommend whether the first implementation should use:

- deterministic authored grammar templates;
- a lightweight inflection/morphology layer;
- bounded generative prose over a fact envelope;
- a hybrid of deterministic planning, bounded generation, and deterministic validation.

The audit must not select or add a third-party package. It may identify existing dependencies and implementation risks.

## 5. Event-Time Appearance, Equipment, And Object Truth Audit

Inspect current owners for:

- player appearance and character-creation identity;
- visible body traits;
- equipment slots and worn items;
- held items, weapons, shields, tools, focuses, catalysts, consumables, and containers;
- item condition, damage, contamination, blood, breakage, and removal;
- inventory versus equipped versus held distinction;
- two-hand or hand-occupancy constraints if any;
- party carrying, body transport, mounts, wagons, and litters;
- combat positions and scene locations;
- event-time history versus current-state-only truth.

The audit must answer:

1. Can current live state support an accurate immediate Mortal Crisis scene?
2. Can a scene regenerated later prove what was worn, held, visible, dropped, consumed, damaged, or removed at the event tick?
3. Which facts must be retained by event owners rather than reconstructed from a later save snapshot?
4. How should a scene track transitions between beats, such as dropping a shield before lifting a patient or cutting armor away before treating a wound?
5. How should visibility, lighting, distance, coverings, observer position, and recognition prevent unsupported appearance claims?

Recommend a minimum event-time narrative view or fact-envelope posture without finalizing schema names.

## 6. Knowledge, Visibility, Diagnosis, And Uncertainty Audit

Mortal Crisis narrative must distinguish authoritative hidden truth from what an observer can perceive or infer.

Audit current foundations for:

- character Knowledge and recognition;
- skill and attribute evidence relevant to first aid, healing, magic, observation, medicine, alchemy, survival, or diagnosis;
- visibility and line-of-sight;
- lighting and weather;
- relationship and party membership;
- hidden statuses, injuries, poisons, internal bleeding, curses, and magical effects;
- professional healer, institution, or magical-service capabilities.

Recommend a future knowledge boundary capable of rendering:

- direct observation;
- confident professional assessment;
- uncertain assessment;
- hidden truth that must not appear in prose;
- later reassessment after stabilization or travel;
- honest worsening or improvement without promising a guaranteed outcome.

Do not permit narrative ambiguity to conceal a deterministic result arbitrarily. Uncertainty must arise from observer limits or genuinely committed uncertain events.

## 7. Mortal Crisis Narrative Presentation Contract Planning

Consume the comparative research and current user direction as proposal input.

The future Mortal Crisis system should resolve structured authoritative facts through named internal phases such as:

```text
threat disposition
  -> immediate access and protection
  -> assessment
  -> process-specific stabilization
  -> extraction
  -> route and intermediate-care planning
  -> transit and reassessment
  -> definitive treatment or resurrection
  -> recovery or final closure
```

The player-facing default must be connected narrative, not a battle log, state dump, or exact-timer dashboard.

Audit and recommend:

- which owner resolves each phase;
- which facts are deterministic and which may use committed event/draw identity;
- how narrative beats are planned from the accepted result;
- where player decisions may occur;
- how a scene pauses and resumes around decisions;
- how qualitative urgency is derived;
- how repeated inspections improve or revise the apparent prognosis;
- how the renderer avoids mechanical labels and raw state ids;
- how a deterministic factual fallback is produced if rich prose fails validation.

Default player-facing prose must not expose raw percentages, dice, random seeds, hidden survival clocks, exact bleed-out times, exact internal progression rates, or debug-state identifiers.

Exact time may be shown only when an accepted owner and character-facing context make it naturally knowable, such as a known travel duration, scheduled departure, visible clock, or specialist estimate. Even then, the Mortal Crisis narrative should normally express urgency qualitatively.

Examples of acceptable qualitative meanings include:

- no immediate danger;
- stable for the moment;
- needs care soon;
- urgent;
- rapidly worsening;
- unlikely to survive a long journey;
- unsafe to move without stabilization;
- stabilized enough for transport;
- beyond available mundane care.

These are semantic inputs, not mandatory labels to paste into player prose.

## 8. Multi-Stop Care, Transit, And Resource Planning Audit

The future crisis resolver must not reduce destination selection to `nearest healer`.

Inspect current foundations for:

- route topology and travel time;
- settlements, villages, districts, sites, and institutions;
- healer, alchemist, temple, guild, hospice, government, patrol, and service capabilities;
- mounts, wagons, carts, litters, carrying capacity, and road access;
- weather, terrain, barriers, pursuit, and environmental hazards;
- medicines, bandages, antidotes, healing potions, coagulation aids, blood-restorative items, stimulants, preservation items, and magical protections;
- affordability, reputation, legal access, faction access, and party willingness.

The audit must support routes such as:

```text
incident site
  -> field stabilization
  -> village healer for stronger stabilization, supplies, diagnosis, or transport
  -> guild hospice for surgery or definitive care
```

Determine how the future owner should compare:

- direct travel versus an intermediate stop;
- whether the stop is on the route or a detour;
- whether stabilization changes transport tolerance or the effective survival window;
- whether a horse, wagon, litter, escort, or road improves transit enough to justify the stop;
- whether movement itself worsens the patient;
- whether a local provider can diagnose or stabilize but not cure;
- whether a consumable changes one named lethal process without becoming a generic survival bonus.

The narrative plan should describe what changed causally rather than reveal raw timer arithmetic.

## 9. Bounded Prompt Generation And Validation Audit

The user requires an engine or function that can properly resolve and generate context-sensitive prompts or prose.

Audit and recommend a safe future pipeline:

```text
authoritative gameplay owners
  -> retained factual event or accepted snapshot
  -> narrative fact envelope
  -> scene/beat planner
  -> referent and grammar resolver
  -> deterministic template or bounded generation request
  -> candidate prose
  -> factual, continuity, grammar, knowledge, and style validation
  -> accepted prose or deterministic factual fallback
```

The audit must address:

- whether `prompt generation` and `prose realization` should be separate functions;
- stable source ids and provenance;
- deterministic regeneration and idempotence;
- allowed and forbidden facts;
- vocabulary restrictions;
- tense and point-of-view controls;
- scene length and repetition controls;
- validation of names, pronouns, objects, appearance, equipment, locations, injuries, magic, and chronology;
- rejection or simplification when a candidate adds unsupported dialogue, motives, emotions, witnesses, equipment, appearance, diagnoses, entities, or outcomes;
- no parsing generated prose back into canonical gameplay state;
- no external-model dependency for the minimum viable fallback.

## 10. Narrative Test Matrix Planning

Provide a focused future test matrix including at minimum:

- male singular `he/him/his/himself`;
- female singular `she/her/hers/herself`;
- singular `they/them/their/theirs/themself`;
- plural group `they/them/their/theirs/themselves`;
- non-person `it/its/itself` where appropriate;
- named or titled entities that should not use pronouns;
- ambiguous same-pronoun actors;
- coordinated subjects and plural verbs;
- past and present tense;
- irregular verb forms;
- identity unknown to the observer;
- appearance hidden by armor or darkness;
- equipment dropped, consumed, damaged, removed, or transferred between beats;
- a character carrying another character while no longer holding a two-handed object;
- progressive diagnosis with changing confidence;
- hidden exact timer with qualitative narrative only;
- direct versus intermediate-care route narrative;
- deterministic regeneration from the same fact envelope;
- unsupported-fact rejection;
- deterministic fallback when prose validation fails.

# Part II — Elemental Alignment, Manifestation, Temperament, And Magic-Stimulus Audit

## 11. Canonical Element And Religion Inventory

Confirm and inventory the current eight-element foundation:

- Fire;
- Water;
- Earth;
- Wind;
- Thunder;
- Ice;
- Light;
- Darkness.

Preserve current compatibility facts unless a later decision explicitly changes them:

- `stone` is a world/religion-facing legacy alias for Earth;
- `shadow` may be a lore-facing expression of Darkness rather than a ninth element;
- `holy` may be a lore-facing expression or tradition associated with Light rather than a ninth element;
- `electricity` or lightning is a manifestation of Thunder rather than a ninth canonical element.

Inventory:

- deities, domains, oppositions, dominance cycles, orders, sacred sites, and convergence sites;
- elemental spells, statuses, affinities, vessels, catalysts, enchantments, and magic tags;
- elemental monsters and reference entries;
- encounter and spawn foundations;
- terrain, habitat, weather, hazard, resource, magic-residue, and sacred-site facts;
- existing benevolent, neutral, territorial, or hostile magical entities;
- fae/faye, pixie, spirit, guardian, or similar content if present;
- tests, schemas, validators, and TypeScript/JavaScript mirrors.

Record contradictions, aliases, missing owners, and stale narrative-only content.

## 12. Three-And-Three Core Alignment Analysis

Treat this as an accepted structural requirement for the later decision:

- Light and Darkness are higher-order elements;
- exactly three of the six core elements are Light-aligned;
- exactly three are Darkness-aligned;
- higher-order alignment is not equivalent to moral good or evil.

The exact assignment is not yet accepted.

Evaluate the strongest internally coherent mappings against:

- current deity and religious-order pairings;
- current dominance cycle;
- physical and magical metaphors;
- combat status identities;
- environmental manifestation;
- beneficial and dangerous expressions;
- per-element assimilation and opposition relationships;
- player legibility;
- symmetry without forced false equivalence.

At minimum, evaluate this working hypothesis without treating it as canon:

```text
Light-aligned: Fire, Water, Wind
Darkness-aligned: Earth, Ice, Thunder
```

Explain where the current repository supports or contradicts it and compare any better alternative.

Provide one recommended mapping for a later human/GPT acceptance decision, but do not modify religion content or accept the mapping in this audit.

## 13. Elemental Manifestation And Affinity-Pressure Audit

Elementals should manifest where their element is strongly represented by the current environment, not from an undifferentiated monster table.

Audit the current data available to derive affinity pressure from:

- terrain;
- habitat;
- weather;
- season and climate;
- active hazards;
- geology and resources;
- water and air access;
- fire, cold, storm, or seismic conditions;
- sacred sites and religious structures;
- magical residue;
- active casting;
- breaches and convergence sites;
- prior elemental presence;
- world events.

Recommend a future affinity-pressure contract for each of the eight elements.

The audit must distinguish:

- ordinary core-element environmental manifestation;
- higher-element manifestation requiring rarer aligned convergence, sacred, magical, or world-event conditions;
- authored encounter placement;
- dynamic spawn candidacy;
- an elemental already present becoming stronger or more active;
- temporary magical residue that should not permanently rewrite ecology.

Do not define exact spawn percentages or implement dynamic spawning.

## 14. Baseline Temperament And Entity Taxonomy Audit

Treat this proposed direction as a later-decision invariant unless repository evidence requires a stated exception:

- elementals are generally passive, curious, territorial, conditionally cooperative, or helpful when undisturbed;
- they are not ordinary always-hostile monsters;
- they may still be dangerous through environmental behavior, territoriality, misunderstanding, assimilation, or active-magic response;
- higher alignment does not determine moral goodness;
- Darkness-aligned elementals may be benevolent;
- Light-aligned elementals may be destructive, purifying, judgmental, or hazardous.

Audit whether current monster records, schemas, encounter roles, AI dispositions, ecology records, or narrative references can represent:

- passive;
- curious;
- wary;
- territorial;
- helpful;
- conditional cooperation;
- assimilative hunger;
- defensive hostility;
- predatory behavior;
- guardian behavior;
- scripted hostility caused by local corruption, binding, exploitation, or an authored event.

Determine whether elemental identity belongs inside `monster`, a broader creature/entity authority, a disposition overlay, or a future magical-entity authority.

Do not erase existing hostile elemental encounters. Explain how they can remain valid context-specific manifestations without proving that all elementals are hostile.

## 15. Active-Magic Stimulus And Aggression Audit

The future system must react to accepted cast results, not to generic classification tags alone.

Audit current spell/cast outputs and determine whether they expose:

- resolved canonical element;
- source caster;
- target and area;
- position;
- intensity or power band;
- duration or active residue;
- conduit, catalyst, and environmental amplification;
- whether an enchantment is passive, activated, leaking, or discharged;
- stable event identity.

The later decision should distinguish:

### Resonance

Same-element magic is normally tolerated, ignored, observed, or empowering.

### Higher-order alignment

A core elemental normally tolerates its aligned higher element.

A Light elemental normally tolerates Light and the three Light-aligned core elements.

A Darkness elemental normally tolerates Darkness and the three Darkness-aligned core elements.

### Assimilative or nourishing stimulus

Some elements are perceived as fuel, material, charge, or conquerable power. This may trigger pursuit or attempted absorption even when the elemental is not morally hostile.

### Countering or disruptive stimulus

Some elements directly suppress, displace, fracture, quench, ground, freeze, ignite, or otherwise threaten the elemental. This may trigger defensive aggression, retreat, suppression, or retaliation.

### Foreign or unresolved active magic

Untyped, foreign, chaotic, or incompatible active magic may produce suspicion, retreat, investigation, or hostility according to the elemental's explicit response contract.

### Passive enchantment

A dormant worn or carried enchantment should not automatically provoke aggression merely by existing. Activation, discharge, leakage, deliberate presentation, overwhelming intensity, or environmental pressure may matter.

Audit the smallest future authority needed to resolve these categories without duplicating spell, combat, AI, or encounter ownership.

## 16. Per-Element Relationship Schema Planning

Every core element should use the same structural schema even when the relationships differ.

For each of Fire, Water, Earth, Wind, Thunder, and Ice, recommend:

- higher-order alignment candidate;
- same-element response;
- two or more plausible assimilable/nourishing relationships;
- countering or adversarial relationships;
- directional versus mutual relationships;
- environmental sources it may incorporate;
- beneficial capabilities it may possess;
- noncombat hazards it may create;
- what could calm, redirect, satisfy, or befriend it;
- what active magic should provoke immediate aggression;
- what passive magic should remain tolerated.

Use this user-provided Fire example as a required test case, not automatically accepted universal fact:

```text
Fire elemental
  -> indifferent or receptive to Fire
  -> safe with Light if Fire is Light-aligned
  -> may feed on or assimilate Wind and Thunder
  -> treats Water, Ice, and Earth as countering threats
```

Test the physical and magical logic behind the fire-triangle reasoning:

- Wind or oxygen may feed Fire;
- Thunder or electricity may provide ignition or energetic charge;
- Water quenches Fire;
- Ice represents cold and phase-change pressure;
- Earth may smother Fire or deny oxygen.

Then produce equally explicit recommended schemas for the other five core elements.

Do not force perfect rock-paper-scissors symmetry when directional ecology or magic is more coherent.

## 17. Beneficial Elemental Capabilities Audit

Elementals and other magical entities may provide aid when their explicit capabilities and context permit it.

Audit current foundations for beneficial magic and recommend capability categories such as:

- warming or shelter;
- cooling;
- water purification;
- air or breathing support;
- grounding or stabilization;
- illumination;
- concealment or shadow shelter;
- path guidance;
- hazard warning;
- poison suppression;
- wound stabilization;
- protective wards;
- transport assistance;
- preservation of a body;
- amplification of an aligned healer or spell;
- direct healing only where an explicit spell or capability authorizes it.

Requirements:

- `benevolent`, `passive`, `Light-aligned`, or `helpful` must not itself execute healing;
- aid must resolve from a present entity, explicit capability, accepted disposition, knowledge, range, cost, and event identity;
- elemental assistance in a Mortal Crisis must not appear randomly after defeat without prior world presence or a deterministic manifestation rule;
- ordinary healing must not imply anatomical regrowth or resurrection;
- resurrection must remain separately authorized.

## 18. Fae, Spirits, Guardian Beasts, And Other Benevolent Entities Audit

Search for existing fae/faye, pixie, sprite, spirit, guardian, sacred beast, familiar, or similar identities.

Recommend a boundary that allows these entities to have:

- one or more elemental affinities;
- benevolent, curious, mischievous, territorial, predatory, hostile, or conditional temperaments;
- explicit beneficial capabilities;
- environmental or sacred manifestation requirements;
- cultural and religious associations;
- reactions to elemental magic.

Do not collapse all magical beings into `elemental`.

Determine the minimum future taxonomy needed to distinguish:

- true elemental manifestations;
- fae or nature spirits;
- summoned or bound entities;
- constructs;
- magical animals;
- guardian beings;
- corrupted or altered variants;
- ordinary monsters with elemental affinity.

## 19. Elemental Narrative Integration Audit

The elemental system must project through the narrative-realization boundary rather than generating independent combat-log strings.

Plan how authoritative facts such as:

```text
fire elemental observed Wind stimulus
stimulus source was Selene
response was assimilative pursuit
Bran intercepted
nearby brush was incorporated into the elemental
```

can become accurate prose while preserving:

- entity pronouns and number;
- names and recognition;
- actual spell identity;
- current held and worn objects;
- visible environmental material;
- chronology;
- observer knowledge;
- response category without printing an internal state label;
- no unsupported intention or emotion.

Determine which elemental facts must be present in the narrative fact envelope and which remain hidden engine truth.

## 20. Elemental Test Matrix Planning

Provide a focused future test matrix including at minimum:

- all eight canonical identities and `stone -> earth` compatibility;
- exactly three Light-aligned and three Darkness-aligned core elements after later acceptance;
- Light elemental tolerating Light and all Light-aligned core magic;
- Darkness elemental tolerating Darkness and all Darkness-aligned core magic;
- same-element resonance;
- assimilative response versus defensive hostility;
- directional relationship behavior;
- passive enchanted equipment not provoking by default;
- activated or leaking incompatible enchantment provoking an appropriate response;
- environment with insufficient affinity pressure producing no dynamic elemental candidate;
- strong terrain/weather/sacred pressure producing a candidate;
- higher elementals requiring rarer convergence conditions;
- helpful elemental action requiring an explicit capability;
- hostile authored elemental encounter remaining valid;
- Darkness-aligned benevolent entity;
- Light-aligned dangerous entity;
- fae or guardian entity with affinity but not elemental identity;
- deterministic event identity across replay;
- narrative projection using accurate entity, spell, equipment, and terrain facts.

# Part III — Synthesis And Package Planning

## 21. Ownership And Dependency Graph

Produce one integrated ownership graph covering:

- authoritative gameplay/event owners;
- character/player/person/entity identity;
- grammatical profiles;
- appearance and equipment state;
- knowledge and visibility;
- narrative fact envelopes;
- scene/beat planning;
- prose realization;
- validation and fallback;
- Chronicle/manuscript projections;
- Mortal Crisis resolution;
- travel and care institutions;
- magic cast identity;
- elemental affinity pressure;
- elemental disposition and stimulus response;
- AI/encounter action selection;
- beneficial capabilities;
- save and event persistence.

Explicitly identify forbidden parallel authorities and likely dependency cycles.

## 22. Recommended Durable Decision Sequence

Recommend a bounded decision sequence after this audit.

The preferred route to test is:

1. `Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision`;
2. `Elemental Alignment, Environmental Manifestation, Temperament, And Magic-Stimulus Decision`;
3. `Checkpoint Commitment, Mortal Crisis Sequence, Resurrection Aftereffects, Final Closure, And Stakes Authority Revision`, consuming the narrative decision;
4. coordination-document reconciliation;
5. only then reconsider the `0.6.6 Restoration And Baseline Confirmation` gate.

Explain whether the audit supports this sequence or recommends a safer alternative.

Do not create these decisions in this run.

## 23. Implementation-Package Decomposition

Recommend later implementation packages without assigning release numbers.

At minimum distinguish:

- grammatical profile and inflection foundation;
- referent/discourse resolver;
- narrative fact envelope and validation;
- deterministic template fallback;
- bounded generative adapter, if ever authorized;
- Mortal Crisis narrative adapter;
- event-time appearance/equipment retention;
- elemental identity/alignment static authority;
- affinity-pressure candidate generation;
- magic-stimulus response resolver;
- temperament/disposition integration;
- beneficial capability integration;
- narrative projection and UI;
- save/migration and TypeScript/JavaScript mirrors;
- focused tests.

State which packages are dependencies of the revised Stakes/Mortal Crisis implementation and which can remain deferred.

## 24. Required Outputs

On successful completion, modify exactly:

1. create `docs/dev/tmp-narrative-realization-and-mortal-crisis-presentation-audit-2026-07-23.md`;
2. create `docs/dev/tmp-elemental-alignment-temperament-and-magic-stimulus-audit-2026-07-23.md`;
3. update `docs/dev/current-codex-output.md`.

Do not modify this prompt.

### Narrative audit required sections

1. execution and repository-state confirmation;
2. source and authority inventory;
3. live presentation and prose-generation seams;
4. identity, sex, gender, pronoun, and grammatical-number findings;
5. referent/discourse findings;
6. tense, inflection, and grammar findings;
7. event-time appearance/equipment/object findings;
8. knowledge/visibility/diagnosis findings;
9. Mortal Crisis narrative presentation findings;
10. multi-stop care and transit findings;
11. prompt-generation and validation architecture options;
12. recommended owner graph;
13. test matrix;
14. unresolved decisions;
15. explicit non-decisions and limitations.

### Elemental audit required sections

1. execution and repository-state confirmation;
2. canonical element/religion/magic/ecology inventory;
3. aliases and contradictions;
4. three-and-three alignment options and recommendation;
5. environmental affinity-pressure findings;
6. baseline temperament and taxonomy findings;
7. active-magic stimulus findings;
8. per-element relationship recommendations;
9. beneficial capability findings;
10. fae/spirit/guardian separation;
11. Mortal Crisis and narrative integration;
12. recommended owner graph;
13. test matrix;
14. unresolved decisions;
15. explicit non-decisions and limitations.

### Current output required fields

- source run identity;
- branch, starting commit, ending pre-edit commit, and repository state;
- exact changed paths;
- source-identity verification;
- strongest narrative-engine findings;
- strongest Mortal Crisis presentation findings;
- strongest elemental findings;
- repository contradictions and stale authorities;
- recommended narrative decision scope;
- recommended elemental decision scope;
- recommended later Stakes/Mortal Crisis authority-revision scope;
- implementation-package order;
- exact temporary-artifact retention/consumer posture;
- held `0.6.6` confirmation;
- checks run;
- next recommended run.

## 25. Temporary Artifact Retention

Both new temporary audits must be retained until their findings are consumed by named durable decisions.

The narrative audit's named consumers are:

1. `Narrative Realization, Referential Grammar, Appearance, And Fact-Projection Decision`;
2. the later Mortal Crisis/Stakes authority revision;
3. a later narrative-engine implementation prompt.

The elemental audit's named consumers are:

1. `Elemental Alignment, Environmental Manifestation, Temperament, And Magic-Stimulus Decision`;
2. a later elemental ecology/spawn implementation prompt;
3. a later magic-stimulus/AI behavior implementation prompt;
4. the held static monster/ecology route only if a later explicit integration decision says the static content must consume it.

Do not delete the completed comparative mortality research or retained defeat/injury audit in this run.

## 26. Forbidden Scope

Do not modify:

- this prompt;
- current GPT handoff;
- route register;
- roadmap;
- sequenced plan;
- continuity brief;
- accepted design authorities;
- completed comparative research;
- retained defeat/injury audit;
- held `0.6.6`;
- retained `0.6.7` artifacts;
- runtime;
- shared types;
- schemas;
- package manifests or dependencies;
- saves or migrations;
- tests;
- UI;
- content;
- religion records;
- monster records;
- elemental reference prose;
- generated files;
- gameplay.

Do not:

- accept final pronoun field names;
- infer pronouns solely from sex, name, title, lineage, or appearance;
- accept final three-and-three element alignment;
- accept exact per-element response matrices;
- define exact spawn rates, timers, survival windows, medical values, or elemental probabilities;
- add an external language-model dependency;
- send repository data to an external model;
- treat generated prose as gameplay authority;
- parse generated prose into canonical state;
- implement sleep checkpoints, deterministic RNG, Mortal Crisis, resurrection, Stakes, elementals, fae, AI, or narrative generation;
- restore `0.6.6`;
- assign a release or primary version;
- create an implementation prompt.

## 27. Stop Conditions

Stop after the exact three documentation outputs.

If the audit finds that the two domains cannot safely share one run, still complete both inventories and record why separate durable decisions are mandatory. Do not silently drop either domain.

If a source mismatch or repository contradiction prevents trustworthy completion, update only `docs/dev/current-codex-output.md` with the blocked result and stop.

Report the ending commit, exact changed paths, repository state, source identities, unresolved contradictions, and next recommended decision run.