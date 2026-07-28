# First Lethal-Process Definition And Catalog Plan

Date: 2026-07-28

Source run: unversioned `First Lethal-Process Definition And Catalog Plan`

Status: accepted documentation-only plan

Milestone impact: `supports_current_band`

## Decision Summary

The existing combined combat-health vocabulary cannot safely host lethal-process definitions. It is a strict, static, non-executing catalog for `status`, `condition`, and `injury` identity. A lethal process is instead an independently owned causal process capable of producing actual death if unresolved. Adding it to the current catalog would require a new kind, prefix, families, owners, references, and semantics while falsely placing non-combat health causality under a combat-named authority.

Accept a future **shared structural envelope with owner-specific definition catalogs**. The shared envelope may eventually standardize identity, lifecycle, provenance, and safe references. Each domain that understands a process family must own that definition's meaning, mutable instances, accepted progression, and results. There is no universal medical owner and no universal lethal-process catalog.

The smallest coherent conceptual first definition scope is:

1. external hemorrhage;
2. confirmed internal hemorrhage;
3. airway obstruction;
4. post-submersion respiratory compromise;
5. systemic hypothermia;
6. hot-altered heat crisis.

This scope is a planning selection, not authored content. The implementation result is `NO_PACKAGE`: exact owner namespaces, physical catalog paths, shared fields, capability references, instance contracts, persistence, migration, and correction authority are not yet accepted.

The exact next route is the unversioned `Care Capability, Stabilization, And Process-Effect Contract Decision`.

## 1. Live Authority Baseline

### 1.1 Canonical static vocabulary

The live authority is:

- content: `packages/content/base/game/combat_health_vocabulary.json`;
- schema: `packages/schemas/game/combat-health-vocabulary.schema.json`;
- focused validator: `tools/content-lint/combat-health-vocabulary.mjs`;
- normal-lint registration and dependency helper: `tools/content-lint/index.mjs`;
- focused tests: `tests/unit/combat-status-condition-injury-authority-validation.test.mjs`;
- shared schema parse coverage: `tests/unit/schema-files.test.mjs`.

The content wrapper has exactly two records:

| Id | Kind | Lifecycle | Family | Allowed owner types |
| --- | --- | --- | --- | --- |
| `combat_status.stagger` | `status` | `planned` | `control` | `combat_runtime`, `ability`, `spell`, `skill_effect`, `item_use_profile` |
| `combat_status.bind` | `status` | `planned` | `control` | `combat_runtime`, `spell`, `skill_effect` |

There are zero live `condition` records and zero live `injury` records.

Both records are descriptive vocabulary only. They contain no duration, stack, magnitude, target, actor, damage, healing, escape, movement, save, UI, or runtime rule.

### 1.2 Exact schema boundary

The wrapper is strict, requires only `records`, and rejects additional properties. Every record is strict and requires exactly these eleven fields:

1. `id`;
2. `slug`;
3. `name`;
4. `kind`;
5. `status`;
6. `family`;
7. `summary`;
8. `allowedOwnerTypes`;
9. `tags`;
10. `sourceAuthorityNotes`;
11. `notes`.

The accepted kind vocabulary is exactly:

- `status`;
- `condition`;
- `injury`.

The lifecycle vocabulary is exactly:

- `planned`;
- `active`;
- `retired`.

The schema's exact family vocabulary is:

- `control`, `mobility`, `perception`, `morale`, `buff`, `debuff`, `protection`;
- `body`, `fatigue`, `hydration`, `nutrition`, `intoxication`, `exposure`, `disease`, `poison`, `environmental`, `recovery`;
- `cut`, `bruise`, `burn`, `fracture`, `sprain`, `puncture`, `concussion`, `trauma`, `blood_loss`, `scar`, `impairment`, `maiming`.

The exact allowed-owner vocabulary is:

- `combat_runtime`;
- `player_state`;
- `npc_state`;
- `monster`;
- `ability`;
- `spell`;
- `skill_effect`;
- `item_use_profile`;
- `body_state`;
- `future_health_runtime`.

Kind-specific ids must use:

- `combat_status.<slug>`;
- `combat_condition.<slug>`;
- `combat_injury.<slug>`.

There is no lethal-process kind, prefix, family, definition owner, causal reference, or process lifecycle.

### 1.3 Validator, registration, and tests

The focused validator is pure: it imports no filesystem, runtime, engine, app, save, or gameplay owner. It validates the strict wrapper and required fields, lower-snake ids/slugs, exact kind-specific prefixes, accepted enums, non-empty text, uniqueness of ids/slugs/names, and duplicate-free owner/tag arrays. It returns sorted record ids.

It recursively rejects relationship and deferred class fields, including related ability, spell, skill-effect, item, monster, status, condition, and injury ids, as well as condition class, injury class, severity band, and combat-phase tags.

It recursively rejects runtime and gameplay concepts including durations, ticks, stacks, magnitudes, source/target actors, damage, healing, cures, immunity, resistance, vulnerability, modifiers, effects, current runtime/save/account/UI state, commands, events, rewards, migrations, and gameplay effects.

Normal content lint:

- imports the focused validator exactly once;
- includes the content file exactly once in the normal check list;
- calls one dependency helper exactly once;
- reads the content and schema paths exactly once inside that helper;
- does not import or consult engine, app, save, account, item, market, resource, commodity, service, spell, ability, skill-effect, monster, or tactics owners from that helper.

The focused file contains 13 tests. They cover the exact live seed and exact-once registration, strict combined shape, empty-wrapper acceptance, valid status/condition/injury fixtures, non-mutation, invalid wrappers/schema, missing or extra fields, malformed ids and vocabulary, duplicates, relationship/class/phase/severity rejection, recursive runtime-field rejection, validator purity, and schema parse coverage.

### 1.4 Imports, references, and runtime behavior

No production module imports `combat_health_vocabulary.json`, its schema, or its validator. The only direct consumers are content lint and tests.

The live `combat_status.*` ids are not runtime hook ids:

- spells, abilities, skill effects, item use profiles, shared spell-hook support, combat-hook lint, and the game engine use `status.stagger` and `status.bind`;
- some source data also uses the unqualified channel/tag `stagger`;
- the game engine owns mutable `CombatStatusEffectState` values with actor-specific ids, labels, sources, stacks, magnitude, start/expiry ticks, and tags;
- the engine has local executable definitions for `status.bind` and `status.stagger`;
- combat initialization converts `playerState.activeEffects` strings into mutable combat effects and later writes combat-effect labels back to `activeEffects`;
- HP at or below zero currently marks a combatant both incapacitated and defeated;
- the player UI projects HP/MP/stamina, body-state bands, condition-strip presentation, and plain `activeEffects` labels.

These are adjacent runtime and projection seams, not imports of or references to canonical `combat_status.*` ids. The static catalog does not execute, persist, or project those records.

No live owner persists functional assessments, lethal-process definitions or instances, care requirements or attempts, Mortal Crisis receipts, accepted death results, body-after-death state, restoration eligibility, or correction lineage.

## 2. Existing Vocabulary Compatibility

The current status/condition/injury catalog cannot host lethal-process definitions.

The conflicts are:

1. **Kind conflict.** `lethal_process` is not an accepted kind, and reclassifying a process as status, condition, or injury would erase its causal and ownership boundary.
2. **Identity conflict.** Every current id is under `combat_status`, `combat_condition`, or `combat_injury`; no process prefix exists.
3. **Scope conflict.** Hypothermia, post-submersion harm, poisoning, and heat crisis are not inherently combat-owned.
4. **Family conflict.** Current families describe status, condition, and injury vocabulary, not independent causal process families.
5. **Owner conflict.** `future_health_runtime` is a compatibility label, not an accepted universal process owner. The schema cannot name the process-defining causal domain.
6. **Reference conflict.** The validator intentionally rejects relationships. A process definition eventually needs safe reference posture toward causal injury, hazard, body, poison, respiratory, environmental, or magic owners without taking their truth.
7. **Lifecycle conflict.** Current `planned | active | retired` is catalog lifecycle. An active lethal-process instance has a separate mutable lifecycle and must not be confused with an `active` definition.
8. **Semantic conflict.** A static status/condition/injury identity cannot establish a process capable of producing actual death, stabilization needs, resolution, or death causality.
9. **Naming conflict.** Internal technical process identity must not become automatic player-facing status text.
10. **Migration conflict.** Existing hook strings, effect labels, HP-zero defeat, body bands, and prose are not reliable process truth.

The accepted non-executing boundary of `combat_health_vocabulary` remains unchanged. No schema widening, new kind, new owner type, new family, relationship field, alias, or record is authorized.

## 3. Shared Envelope And Owner Boundary

The accepted future direction is a shared structural envelope with owner-specific definition catalogs.

The shared envelope may eventually standardize only these conceptual concerns:

- globally collision-safe definition identity;
- declaration of the one domain that owns definition meaning;
- catalog lifecycle distinct from instance lifecycle;
- human-readable internal summary;
- provenance and authority notes;
- bounded references to other static definitions without copying their meaning;
- explicit classification as static, non-executing vocabulary.

This plan does not accept exact field names, enums, file paths, or a schema.

Owner-specific catalogs must:

- define only process families the named owner understands;
- keep one definition owner and one mutable-instance owner explicit;
- retain causal source references without making the process owner mutate the source injury, hazard, body state, poison, spell, or environment;
- allow multiple independently owned processes to coexist;
- produce owner-specific accepted results or receipts for later consequence owners;
- never become a universal resolver, diagnosis authority, care resolver, death owner, save owner, UI owner, or Chronicle owner.

Shared identity does not mean shared mutation. A generic registry may later validate collision-free references, but it must not become an omnibus medical engine.

## 4. First Definition Scope

### 4.1 Selected conceptual scope

| Candidate | Disposition | Owner-safe reason |
| --- | --- | --- |
| External hemorrhage | `first_scope` | Distinct causal process linked to actual bleeding injury or other accepted source; not a universal timer or generic `bleeding` status. |
| Confirmed internal hemorrhage | `first_scope` | Distinct actual process when an owner accepts internal bleeding truth; observer suspicion is never promoted automatically. |
| Airway obstruction | `first_scope` | Distinct respiratory process with different cause, reassessment, and capability needs from hemorrhage or post-submersion harm. |
| Post-submersion respiratory compromise | `first_scope` | Distinct internal planning identity for accepted post-submersion respiratory harm; no delayed “dry drowning” fiction or automatic public diagnosis. |
| Systemic hypothermia | `first_scope` | Systemic environmental/body process, separate from local freezing injury. |
| Hot-altered heat crisis | `first_scope` | Coarse systemic heat process only when an accepted owner establishes materially altered function; non-stroke heat illness remains contextual. |

These six are the smallest set that preserves the research-integrated causal separations across hemorrhage, breathing, cold, and heat without inventing poison families or collapsing injury and process.

### 4.2 Deferred, owner-retained, contextual, or rejected candidates

| Candidate | Disposition | Boundary |
| --- | --- | --- |
| Suspected internal bleeding | `observer_only` | May support qualified concern and reassessment; never a process definition or instance until an owner accepts actual internal hemorrhage. |
| Shock-like circulatory deterioration | `deferred_owner_question` | May later become an owner-specific circulatory process or assessment input. It is not a universal status, synonym for all critical illness, or certain diagnosis. |
| Poisoning structure | `deferred_research_gap` | Retain multiple owner-specific poison processes and selective capability-bound antidotes in principle. Exact families are not sufficiently grounded. |
| Local freezing injury | `injury_owned` | Local tissue harm by default; may coexist causally with systemic hypothermia without becoming the same process. |
| Non-stroke heat illness | `contextual_condition_or_input` | Remains body/environment condition or care evidence unless an accepted transition creates hot-altered heat crisis. |
| Superficial burn | `injury_owned` | Local harm by default, not a lethal process. |
| Serious burn | `deferred_split_ownership` | Preserve burn injury, systemic body process, respiratory process, and causal mechanism separately; no omnibus burn process is accepted. |
| Chemical distinction | `mechanism_or_hazard_owned` | A cause or injury/hazard qualifier unless a later process owner proves a distinct causal process. |
| Electrical distinction | `mechanism_or_hazard_owned` | A cause with potentially separate injury/body consequences, not automatically a lethal process definition. |
| Inhalation-related distinction | `mechanism_or_respiration_input` | May source airway or later respiratory processes; visible exposure alone cannot establish hidden process truth. |

No candidate is rejected as impossible setting content. The rejected inference is treating mechanism, observed sign, contextual illness, local injury, or suspicion as an automatically active lethal process.

## 5. Identity, Lifecycle, And Reference Rules

Conceptual rules for a later package:

- lethal-process definition ids require their own namespace; `combat_status.*`, `combat_condition.*`, `combat_injury.*`, `status.*`, and plain effect labels are prohibited;
- the definition id must be globally collision-safe and visibly attributable to an accepted definition owner;
- one process meaning cannot be duplicated under multiple owners;
- owner-specific catalogs may share a validated envelope but cannot share mutation of one instance;
- catalog lifecycle must be visibly distinct from mutable instance state;
- provenance must identify repository authority and the basis for inclusion without embedding treatment instructions;
- a definition may reference an accepted source domain or compatible static identity only after that reference contract exists;
- references are directional and non-owning: a process may cite its causal injury/hazard/body/poison/environment source, but cannot mutate or reinterpret that source;
- observer concepts such as `suspected_internal_bleeding` must never occupy the process-definition namespace;
- display labels are projections, never canonical aliases for internal ids;
- aliases and migrations require explicit evidence of an existing canonical id; none exists today.

No exact prefix, delimiter, owner enum, lifecycle enum, or reference field is accepted by this plan.

## 6. Static And Mutable Separation

A future static definition may describe stable identity, process-family meaning, owning domain, provenance, and bounded compatibility/reference posture only after a schema plan accepts exact fields.

It must never contain:

- actor, target, body, encounter, save-slot, or episode instance identity;
- current severity, stage, band, trend, or progression;
- elapsed or remaining time, tick rates, deadlines, or hidden survival timers;
- probabilities, formulas, rolls, balance values, modifiers, damage, or healing;
- diagnostic certainty or observer knowledge;
- symptoms as automatic proof of process truth;
- care attempts, selected actions, treatment progress, materials consumed, actor capability, access, consent, or destination;
- stabilization, suppression, support, definitive treatment, or resolution state on an actor;
- inventory, spell execution, magic result, service execution, or institutional availability;
- functional state, HP state, defeat, incapacity, life state, death, corpse state, restoration, resurrection, or closure;
- commands, occurrences, events, consequence receipts, saves, migrations, correction lineage, UI, dialogue, narrative, Chronicle, or gameplay effects.

Mutable instances belong to their owner-specific runtime and persistence contracts. Static definitions never progress, kill, stabilize, diagnose, heal, save, display, or write history.

## 7. Observer And Care Boundaries

### 7.1 Later observer hooks

The later observer-safe consumer needs only:

- a way to refer to observations without making them process truth;
- attributed reports and qualified assessments;
- capability-bounded confidence;
- qualitative trend and reassessment triggers;
- explicit separation between hidden process identity and public projection;
- support for ordinary observation, trained-healer judgment, and magical sensing as different evidence sources.

It must not infer a process from one sign, prose, effect label, HP value, combat result, role, morality, alignment, religion, or narrative importance.

### 7.2 Later care hooks

The next care-capability consumer needs only:

- collision-safe capability identity;
- a way to state that an accepted capability can address one owner-defined requirement or process effect;
- actor, equipment, material, access, consent, scene, destination, and environmental evidence without transferring their ownership;
- distinct results for stabilization, suppression, supportive care, definitive treatment, and resolution;
- qualitative reassessment after material change;
- owner-specific receipts rather than direct cross-domain mutation.

This plan does not decide care actions, recipes, procedures, treatment protocols, checks, probabilities, costs, item use, services, spells, or exact UI text.

### 7.3 Player-facing language boundary

Internal ids, contracts, validators, and design documents may use precise technical distinctions when owner safety requires them. Those names are not default presentation.

Future labels, status text, dialogue, narrative, and Chronicle projections must:

- use brief, concrete, everyday language plausible for the setting;
- prefer observable or attributed wording such as `bleeding badly`, `struggling to breathe`, `faint and cold`, `badly burned`, `poisoned`, `stable for now`, or `needs a healer`;
- avoid exposing modern clinical or scientific terms such as `hypovolemic`, `respiratory compromise`, `cyanosis`, `perfusion`, `neurological deficit`, `syndrome`, or `triage`;
- distinguish what an ordinary observer sees, what a trained healer judges, and what accepted magic senses;
- keep healer, alchemist, scholar, and magical-diagnostician speech understandable and setting-appropriate;
- bound certainty by accepted capability and evidence;
- avoid modern-scientific exposition and pseudo-scientific technobabble.

The internal phrase `post-submersion respiratory compromise`, for example, is not an approved display label. No final display strings are authored here.

## 8. Validation And Test Plan

Because implementation is `NO_PACKAGE`, this plan does not authorize schema, content, validator, registration, helper, or test paths.

A later exact package must prove at minimum:

- no reuse or widening of the combined combat-health schema;
- collision-safe owner-attributed definition ids;
- one declared definition owner per record;
- definition lifecycle distinct from instance state;
- strict static-only fields and recursive rejection of mutable/runtime concepts;
- no observer suspicion as process truth;
- no universal process, critical meter, timer, resolver, poison family, antidote, diagnosis, or treatment rule;
- reference closure only to accepted static owners;
- no production runtime imports or execution;
- no automatic display-label derivation from internal ids;
- negative fixtures for HP, stages, timers, probabilities, symptoms-as-proof, treatment, saves, events, UI, dialogue, Chronicle, and gameplay fields;
- exact-once normal-lint registration only after a live catalog and its owner references are accepted;
- schema parse coverage and a pure focused validator;
- no change to current `combat_health_vocabulary` records, validation, registration, or behavior.

The care-capability decision must precede any renewed package-readiness review because capability/process-effect references are part of the owner boundary.

## 9. Migration And Compatibility

| Current surface | Classification | Rule |
| --- | --- | --- |
| `combat_status.stagger` and `combat_status.bind` | retained authority | Remain planned static combat-status identities; never migrate to lethal-process ids. |
| `status.stagger`, `status.bind`, and other hook strings | compatibility input | May later map through an explicit status contract; cannot imply a lethal process. |
| `CombatStatusEffectState` | retained mutable combat authority | Keeps combat-specific stacks, magnitude, timing, and tags; cannot host lethal-process instances by inference. |
| `playerState.activeEffects` | compatibility projection | Plain strings/labels are not stable definition ids, diagnosis, process truth, or migration evidence. |
| HP and HP-zero | retained resource/combat input | HP zero currently drives defeat/incapacitation but does not establish actual death or a lethal process. |
| Combat `defeated` and `incapacitated` | retained combat authority | Encounter control/outcome facts only; not life state or process identity. |
| `PlayerBodyState` values and warnings | retained body authority | May later supply owner-certified evidence; cannot be reinterpreted as process instances. |
| Condition-strip and readiness presentation | projection | Current metabolic/body projection, not crisis assessment or process diagnosis. |
| Saves | retained snapshot authority | No lethal-process data exists to migrate. Future fields require explicit persistence/migration authority. |
| Events, deltas, and combat history | compatibility input | Existing facts may be sources for later admitted occurrences; prose and generic ids are not process truth. |
| Narrative, Knowledge, dialogue, and descriptive prose | rejected inference | May project accepted facts but cannot seed or diagnose processes. |

There is no existing lethal-process canonical data, so no alias table, id migration, backfill, or save rewrite is justified.

## 10. Research Consumption And Retention

This plan is the second named consumer of:

`docs/dev/tmp-grounded-lethal-process-stabilization-and-first-aid-research-2026-07-28.md`

Verified retained integrity:

- UTF-8 byte length: `58943`;
- SHA-256: `95760de325004f7e19c030e0177e2022873ff8ff1690a0924974bd3b9674da6d`.

This plan consumed:

- separation of independently owned causal processes;
- external and confirmed internal hemorrhage distinctions;
- airway obstruction and post-submersion respiratory distinctions;
- systemic cold versus local freezing harm;
- contextual heat illness versus hot-altered crisis;
- serious-burn split ownership;
- poison-family uncertainty and selective antidote posture;
- stabilization, suppression, supportive care, definitive treatment, resolution, functional recovery, anatomical restoration, and resurrection distinctions;
- qualitative reassessment triggers;
- observer-safe evidence and uncertainty boundaries;
- rejection of universal meters, timers, poison/antidote models, diagnosis from one sign, delayed “dry drowning,” and transferred clinical protocols.

The decoded artifact remains unchanged and retained.

Outstanding named consumers are now exactly:

1. the first care-capability and stabilization contract/package;
2. the first observer-safe crisis assessment/presentation package.

## 11. Package Readiness

`NO_PACKAGE`

Exact missing authority:

- accepted process-definition owner namespaces;
- exact physical catalog ownership and paths;
- exact shared-envelope fields and enums;
- exact direction and validation of cross-owner references;
- the care-capability/process-effect contract;
- owner-specific mutable-instance contracts and accepted result/receipt semantics;
- persistence, migration, replay, idempotency, and correction authority;
- resolved ownership for shock-like circulatory deterioration;
- resolved split for serious burns and inhalation-related harm;
- exact poison-family research and design;
- exact validation posture for internal identity versus player-facing projection.

No content, schema, validator, test, runtime, persistence, migration, UI, or balance-bearing package is authorized.

## 12. Exact Follow-Up Route

Next:

Unversioned `Care Capability, Stabilization, And Process-Effect Contract Decision`

That documentation-only run must consume the research artifact as its third named consumer and decide:

- shared care-capability identity without a universal care resolver;
- scene versus destination capability;
- actor, equipment, material, access, consent, and environmental requirements;
- request, admission, occurrence, accepted result, and owner-specific consequence receipts;
- process-specific stabilization, suppression, support, definitive treatment, and resolution effects;
- qualitative reassessment and capability-bounded magic;
- the same internal-versus-player-facing language boundary.

It must not define treatment protocols, medical advice, values, items, spells, services, runtime, persistence, UI, or gameplay.

After that decision, the remaining final named consumer is the first observer-safe crisis assessment/presentation package.

## Explicit Answers

1. **Can the existing combat-health vocabulary host lethal-process definitions?** No.
2. **What catalog shape is accepted?** A shared structural envelope with owner-specific definition catalogs; not one universal catalog and not unrelated schemas without a shared identity contract.
3. **What is the first conceptual scope?** External hemorrhage, confirmed internal hemorrhage, airway obstruction, post-submersion respiratory compromise, systemic hypothermia, and hot-altered heat crisis.
4. **What remains outside?** Suspected internal bleeding is observer-only; shock-like deterioration and serious-burn splits are deferred; poison families are a research gap; local freezing and superficial burns are injury-owned; non-stroke heat illness is contextual; chemical, electrical, and inhalation distinctions are mechanism/hazard/injury/respiratory inputs unless later accepted otherwise.
5. **What static data is allowed?** Only stable identity, owner, lifecycle, provenance, meaning, and bounded reference posture after an exact schema plan. All mutable, diagnostic, care, persistence, presentation, and gameplay data is forbidden.
6. **What identity and validation are required?** A separate collision-safe owner-attributed namespace, one owner per definition, distinct definition/instance lifecycle, provenance, directional non-owning references, strict recursive runtime prohibitions, and no observer suspicion or display alias as truth.
7. **What current data migrates?** None. Current status ids remain; hooks, labels, body facts, combat flags, saves, events, and prose are inputs or projections only.
8. **What language boundary applies?** Precise internal authority may remain hidden; all later player-facing text must be plain, concrete, setting-appropriate, capability-bounded, and free of needless modern clinical jargon.
9. **Is a package ready?** No: `NO_PACKAGE`.
10. **What research was consumed and what remains?** This second consumer used process separations, care semantics, reassessment, observer boundaries, and unsafe-transfer rejections. Exactly care-capability/stabilization and observer-safe assessment/presentation remain.
11. **What follows?** Unversioned `Care Capability, Stabilization, And Process-Effect Contract Decision`.

## Non-Implementation Confirmation

This plan changes no content, schema, validator, test, helper, type, runtime, engine, UI, save, migration, dependency, generated output, medical protocol, balance value, or gameplay behavior.
