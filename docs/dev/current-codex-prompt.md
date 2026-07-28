# Care Capability, Stabilization, And Process-Effect Contract Decision

## Run Identity

Unversioned `Care Capability, Stabilization, And Process-Effect Contract Decision`

Documentation only. This run does not consume a primary implementation version.

Suggested commit:

`docs(health): define care capability contract`

## Purpose

Define the smallest owner-safe conceptual contract for care capability, process-specific stabilization, and accepted process-effect results without creating treatment protocols, a universal care resolver, or executable behavior.

This is the third named consumer of the grounded lethal-process research artifact. It must produce a decision-complete contract or return `NO_PACKAGE`. It must not implement content, schemas, runtime, persistence, UI, services, items, spells, or gameplay.

Preserve a strict separation between precise internal authority and player-facing language. Internal ids and contracts may use technical distinctions where ownership requires them, but future status text, dialogue, narrative, and Chronicle presentation must remain simple, concrete, readable, and plausible for the setting.

## Required Reading

Read:

- `AGENTS.md`;
- `README.md`;
- current output, handoff, prompt, roadmap, sequenced plan, continuity brief, historical/deferred register, planning-anchor reconciliation, backlog, and static-content program;
- `docs/design/first-lethal-process-definition-and-catalog-plan.md`;
- `docs/design/lethal-process-and-stabilization-research-integration-decision.md`;
- `docs/design/functional-state-lethal-process-care-requirement-and-mortal-crisis-receipt-contract-decision.md`;
- `docs/design/injury-recovery-trauma-and-magical-restoration-decision.md`;
- `docs/design/occurrence-contract-taxonomy-and-commitment-clarification.md`;
- `docs/design/occurrence-identity-named-uncertainty-channels-outcome-commitment-and-correction-contract-decision.md`;
- `docs/design/narrative-realization-referential-grammar-appearance-and-fact-projection-decision.md`;
- `docs/design/checkpoint-commitment-mortal-crisis-resurrection-aftereffects-final-closure-and-stakes-authority-revision.md`;
- `docs/dev/tmp-grounded-lethal-process-stabilization-and-first-aid-research-2026-07-28.md`.

Inspect live:

- current spell, ability, skill-effect, item-use, service, resource, body-state, combat-status, active-effect, inventory, equipment, player/NPC, save, command, event/delta, UI, and presentation seams;
- `heal.hp`, current status hooks, consumable body-state application, service descriptors, and any existing skill/capability identifiers;
- current request, admission, occurrence, result, consequence-receipt, idempotency, replay, and correction structures;
- all current references that use words such as stabilize, care, heal, treatment, remedy, antidote, rescue, assist, healer, physician, alchemist, or restoration.

## Execution Gate

1. Verify repository, branch, clean worktree, remote alignment, current head, and active route.
2. Confirm the first catalog plan is accepted and implementation remains `NO_PACKAGE`.
3. Confirm the research artifact remains present and reproduce byte length `58943` and SHA-256 `95760de325004f7e19c030e0177e2022873ff8ff1690a0924974bd3b9674da6d`.
4. Confirm this run is the third named consumer and that only the observer-safe crisis assessment/presentation consumer remains afterward.
5. Reproduce relevant live capability, care-like, health-effect, owner, request/result, persistence, and presentation seams.
6. Reconcile every proposed contract with the accepted occurrence taxonomy and owner-specific mutation boundary.
7. Preserve the six conceptual first-scope processes without authoring process definitions or values.
8. Stop without edits if existing authority materially conflicts or an owner-safe contract cannot be supported.
9. Do not perform new external research.

## Required Output

Create:

- `docs/design/care-capability-stabilization-and-process-effect-contract-decision.md`.

The decision must include:

### 1. Live Authority Baseline

Record exact relevant current files, types, ids, hooks, descriptors, commands/results, persistence, and presentation behavior. Distinguish executable owners from static metadata and plain labels.

### 2. Capability Identity

Decide whether care capability is:

- one shared identity vocabulary with owner-specific grants and resolvers;
- multiple unrelated owner vocabularies;
- inferred from roles, skills, spells, items, or services;
- or not ready.

Capability identity must not itself perform care, prove access, diagnose a process, consume materials, or guarantee a result.

### 3. Scene And Destination Capability

Separate:

- capability available from an actor at the current scene;
- capability provided by equipment or materials;
- capability available only at a destination, institution, site, or service;
- remote advice or magical communication;
- actual access, willingness, legality, consent, reachability, timing, and environment.

A named healer, service, item, or spell must not imply that capability is present, reachable, eligible, or successful.

### 4. Requirements And Evidence

Define conceptual evidence categories for:

- actor knowledge, skill, training, or magical capability;
- equipment and material availability;
- body or process owner facts;
- scene safety and physical access;
- consent and authority;
- environmental constraints;
- destination/institutional access;
- accepted prior attempts and results.

Each input remains owned by its source. Do not create an omnibus character sheet or medical truth object.

### 5. Request, Admission, Occurrence, And Result

Apply the accepted taxonomy:

```text
request / command
  -> delivery and admission
       -> occurrence
            -> deterministic accepted result
            -> uncertain accepted result -> named channel evidence
            -> no accepted result

accepted result
  -> owner-specific consequence receipts
       -> projections
```

Define idempotency, replay, duplicate delivery, admitted rejection, no-result, and correction posture conceptually. Pre-admission rejection must not mutate gameplay truth.

### 6. Care Semantic Boundaries

Keep distinct:

- stabilization;
- suppression;
- supportive care;
- definitive treatment;
- process resolution;
- functional recovery;
- ordinary injury recovery;
- convalescence;
- anatomical restoration;
- resurrection.

Do not let `heal.hp`, generic healing, rest, a service label, or magic collapse these outcomes.

### 7. Process-Effect Proposals And Receipts

Define how a care owner may propose a bounded effect against one owner-defined process or requirement and how the process owner accepts, rejects, or qualifies it.

Preserve:

- one mutation owner per process instance;
- explicit source capability and evidence;
- target process or requirement reference;
- accepted result identity;
- owner-specific consequence receipts;
- no direct cross-owner mutation;
- no universal success roll or universal stabilization flag.

Do not define exact schema fields unless an exact later package is accepted.

### 8. Reassessment

Use qualitative reassessment after owner-certified material changes such as:

- movement or transport;
- meaningful delay;
- environment change;
- observed worsening or improvement;
- response to an accepted care attempt;
- destination/capability change;
- new owner evidence.

Do not define universal timers, clinical schedules, exact probabilities, hidden deadlines, or automatic diagnosis.

### 9. Magic Boundary

Decide how magic can supply extraordinary observation, communication, stabilization, suppression, treatment, restoration, or resurrection capability only when an accepted magic owner explicitly grants it.

Magic must not:

- provide omniscient diagnosis by default;
- make every healer equivalent;
- erase equipment, material, access, consent, or owner requirements automatically;
- make generic healing resolve every process, injury, impairment, or death;
- justify modern-scientific exposition or pseudo-scientific technobabble.

### 10. Player-Facing Language Boundary

Define mandatory future presentation constraints:

- internal ids and contracts may remain precise and hidden;
- player-facing text must be brief, concrete, everyday, and setting-appropriate;
- ordinary observation, trained judgment, and magical sensing must remain distinct;
- prefer phrases such as `the bleeding has slowed`, `breathing is easier`, `still faint and cold`, `stable for now`, `needs a healer`, or `must be taken somewhere safer`;
- avoid modern clinical terms such as `hypovolemic`, `respiratory compromise`, `cyanosis`, `perfusion`, `neurological deficit`, `syndrome`, or `triage` in ordinary display text;
- capability-bounded experts may express greater certainty, but their speech must remain understandable;
- never derive display strings mechanically from internal ids.

Do not author a final UI copy catalog.

### 11. First-Scope Compatibility

Disposition capability/process-effect needs conceptually for:

- external hemorrhage;
- confirmed internal hemorrhage;
- airway obstruction;
- post-submersion respiratory compromise;
- systemic hypothermia;
- hot-altered heat crisis.

Do not author procedures, actions, treatment instructions, durations, materials, recipes, dosages, values, checks, or balance.

Record why suspected internal bleeding, shock-like circulatory deterioration, poison families, local freezing injury, contextual heat illness, burns, and mechanism distinctions remain outside or require owner-specific handling.

### 12. Persistence, Replay, Correction, And Migration

Decide conceptual commitment boundaries for requests, admitted occurrences, accepted results, process-owner receipts, projections, save/load, replay, and correction.

Do not define save fields or migrations unless an exact later package is authorized. Current hooks, labels, HP, active effects, body-state warnings, inventory, services, and prose must not be silently migrated into care truth.

### 13. Validation And Test Plan

Define exact future validation only if a later package is justified. Otherwise record invariant-level requirements and return `NO_PACKAGE`.

Required invariants include:

- no inferred capability from display labels or role names;
- no capability-as-access or capability-as-success;
- no direct cross-owner mutation;
- no generic healing as universal stabilization;
- no universal timer, roll, diagnosis, process, remedy, or antidote;
- no treatment protocols or player-facing medical advice;
- deterministic replay of accepted facts;
- duplicate-delivery idempotency;
- correction through explicit owner authority;
- strict internal-versus-player-facing language separation.

### 14. Research Consumption And Retention

Record this run as the third named consumer. State exactly which research conclusions it consumed and preserve the decoded artifact.

After this run, the only outstanding named consumer must be:

1. the first observer-safe crisis assessment/presentation package.

### 15. Package Readiness

Return either:

- an exact documentation-authorized later contract/schema package with paths, scope, checks, and prohibitions; or
- `NO_PACKAGE` with exact missing authority.

No executable, treatment-bearing, or balance-bearing package may be authorized.

### 16. Exact Follow-Up Route

Select and package the first observer-safe crisis assessment/presentation route unless evidence proves a narrower prerequisite. Preserve the research artifact until that consumer records its use.

## Required Decisions

Answer explicitly:

1. What owns care-capability identity?
2. How are grants, scene availability, destination availability, access, consent, materials, and environment separated?
3. What evidence may a care resolver consume without taking ownership?
4. What are the exact request/admission/occurrence/result/receipt boundaries?
5. How do stabilization, suppression, support, definitive treatment, resolution, recovery, restoration, and resurrection differ?
6. How may a care result affect an owner-specific process without direct cross-owner mutation?
7. What reassessment triggers are accepted?
8. What can magic do, and what can it not imply?
9. What player-facing language boundary applies?
10. What current data may or may not migrate?
11. Is a later package ready, or is the result `NO_PACKAGE`?
12. What research conclusions were consumed?
13. What exact observer-safe route and prompt follow?

## Prohibited Scope

Do not:

- perform external research;
- create or modify content, schemas, validators, tests, helpers, runtime, commands/events, UI, saves, migrations, dependencies, generated output, or gameplay;
- define treatment procedures, first-aid instructions, dosages, recipes, actions, item requirements, healer/service content, spells, costs, durations, probabilities, formulas, balance, clinical protocols, or player-facing medical advice;
- diagnose from one observed sign or promote suspicion to process truth;
- make HP zero actual death;
- make a care capability, static definition, Mortal Crisis, save, UI, Chronicle, or generic resolver own process mutation;
- infer capability from role, profession, prose, dialogue, service name, item name, spell name, status label, `activeEffects`, alignment, religion, or narrative importance;
- treat `heal.hp`, rest, consumables, generic healing, or magic as universal care;
- expose internal technical names automatically as display strings;
- use magic as justification for modern medical exposition, omniscient diagnosis, or pseudo-scientific technobabble;
- delete or edit the decoded research artifact;
- authorize implementation merely because a conceptual contract is accepted.

## Allowed Changes

Documentation only:

- create the focused decision;
- update current output, handoff, and prompt;
- update roadmap, sequenced plan, continuity brief, historical/deferred register, planning anchor, backlog, and static-content program only for proven route or factual corrections.

## Validation

- Verify research artifact length and SHA-256.
- Verify the first catalog plan and `NO_PACKAGE` decision.
- Verify every cited live capability, care-like, effect, occurrence, persistence, and presentation claim.
- Verify this run records third-consumer status and leaves exactly one named consumer.
- Verify the internal-versus-player-facing language boundary and capability-bounded magic.
- Verify all referenced paths exist.
- Confirm no content, schema, validator, test, source, runtime, UI, save, dependency, generated, or gameplay path changed.
- Run conflict-marker and trailing-whitespace scans plus `git diff --check`.
- Inspect the complete changed-path set and full diff.

Do not run builds, tests, content lint, typecheck, generators, servers, package installation, or gameplay unless a repository-fact check strictly requires one.

## Completion Report

Report:

- starting commit and worktree state;
- live capability/care/health-effect/occurrence baseline;
- capability owner and availability decision;
- request/result/process-effect/receipt boundary;
- care semantic, reassessment, magic, language, persistence, and migration decisions;
- first-scope compatibility;
- package readiness or `NO_PACKAGE`;
- artifact consumption and retention;
- exact observer-safe next route and prompt;
- files changed;
- checks run;
- confirmation that no implementation, medical protocol, treatment instruction, or gameplay behavior changed.
