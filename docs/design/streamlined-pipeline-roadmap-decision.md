# Streamlined Pipeline And Roadmap Decision

Source route: ChatGPT via GitHub Connector after Deep Research review
Date: 2026-07-12
Status: approved documentation-only pipeline and immediate-sequencing decision; no code, content, schema, runtime, UI, save/account, generated-output, or gameplay implementation permission

## 1. Decision Summary

The repository has completed enough static-authority, ownership-boundary, schema, seed, registration, and validation work that the default roadmap should stop searching for another isolated authority lane whenever the previous lane closes.

Adopt a **milestone-and-consumer-first pipeline** while preserving existing owner boundaries, authored-evidence gates, focused validation, and maturity bands.

Immediate decisions:

1. Treat `Version 0.5.356 - Tool Surface Test Boundary Repair` as complete and stable based on the landed source shape and the focused validation recorded in the current Codex output.
2. Do not spend a new primary version on the queued `Version 0.5.357 - Tool Surface Test Post-Repair Audit` unless local focused verification contradicts the current handoff. If such an audit is still desired, route it as support label `Version 0.5.356.1 - Tool Surface Test Post-Repair Audit`.
3. Select `Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation` as the next primary route.
4. Keep the project in `v0.5.x` during that consolidation. It may approve, reject, or condition the transition to `v0.6.x`, but it must not implement runtime ownership.
5. Use the consolidation to select one existing evidence-backed player/session path as the first engine-owned consumer. Do not invent a demonstration quest, NPC, monster, faction, currency, spell, location, or mechanic.
6. Preserve the other fourteen accepted full-suite failures and broad UI/workspace typecheck debt as owner-specific debt. They block only when they affect the selected path or change relative to an accepted baseline.

Until `docs/dev/project-roadmap.md` and `docs/dev/codex-sequenced-implementation-plan.md` are reconciled by an allowed local docs pass, this decision controls the immediate route where their old `0.5.357` pointer conflicts with it. Historical route facts in those files remain valid.

## 2. Why The Pipeline Changes Now

The repository has accumulated a long and useful static-foundation history, including:

- world, settlement, geography, map, route, ecology, economy, quest, item, monster, magic, player, Knowledge, Legacy, Chronicle, account, save metadata, UI, and engine foundations;
- durable authority-boundary decisions across the major design lanes;
- strict schemas and focused validators for multiple future/static authorities;
- live registered seeds for several narrow vocabulary/identity families;
- explicit authored-input, ready-consumer, dependency, research, maturity, pause, rejection, and closure gates;
- a validation source map, command matrix, and repaired tool-surface boundary.

The planning problem is no longer a lack of possible systems. It is selecting and integrating a bounded consumer without reopening every unresolved authority.

The following repeated pattern is now counterproductive when source evidence is unchanged:

```text
roadmap selection
  -> evidence audit
  -> zero candidates
  -> boundary decision
  -> evidence deferral
  -> roadmap selection
```

The following pattern is also too granular when every step is deterministic and shares one consumer:

```text
schema plan
  -> schema/validator
  -> seed plan
  -> seed
  -> registration decision
  -> registration
  -> post-registration audit
  -> next-expansion gate
```

These sequences remain available for high-risk or genuinely uncertain work. They are no longer mandatory templates for every lane.

## 3. Preserved Authority Boundaries

This decision does not collapse system ownership.

Preserve all current distinctions, including:

- authored identity versus runtime state;
- definition/template versus generated instance or offer;
- player, family, account, session, world, civilization, place, faction, institution, and UI owners;
- map visual geometry versus semantic geography and route topology;
- quest definitions/archetypes/templates versus mutable quest state and Chronicle/history;
- item identity/profile versus inventory/equipment/item-instance state;
- spell identity/metadata/readiness versus known-spell ownership, command handling, effects, resource payment, and emitted events;
- static combat vocabulary versus combat execution and injury state;
- service/resource/commodity vocabulary versus providers, availability, prices, stock, access, production, gathering, and transactions;
- generated prose/presentation versus canonical facts and durable event history;
- focused green validation versus known-failing audits and side-effectful generators.

Simplification applies to route packaging and gate reuse, not to owner semantics.

## 4. Revised Universal Pipeline

### Stage 1: Milestone And Consumer Selection

Every primary route must name:

- the repository capability to be gained;
- the consumer that will use it;
- the player-facing, runtime, persistence, validation, or dependency value;
- the maturity band it advances;
- explicit exclusions.

A schema-only prerequisite may be a primary route only when it is necessary for the active milestone and its consumer is scheduled.

### Stage 2: Evidence And Owner Check

Read existing decisions first. Audit only evidence that can change the route.

Entry criteria:

- one named consumer or necessary milestone dependency;
- a bounded owner question;
- current sources identified.

Exit criteria:

- owners and missing dependencies are explicit;
- no unresolved contradiction prevents the next package;
- authored canon is either present or explicitly not required.

Do not rescan unchanged sources after a fail-closed zero-result audit. Reopen only on a recorded trigger.

### Stage 3: Readiness Decision

Define:

- exact inputs and outputs;
- owner boundaries;
- risk and reversibility;
- validation commands by change class;
- persistence/event implications;
- generated-output behavior;
- stop conditions;
- user or research gates.

Merge this stage with Stage 2 when evidence is strong, scope is narrow, and the decision is reversible.

Keep it separate for:

- save/account/persistence mutation;
- engine-owned commands and emitted events;
- combat math or tactical execution;
- magic execution;
- economy/market mutation;
- authored canon creation;
- broad content migration;
- generated-output or packaging ownership.

### Stage 4: Minimal Coherent Implementation Package

Implement the smallest package that makes the consumer work.

A package may combine schema, validator, content, helper, registration, reference, adapter, and focused tests when:

- they share one consumer;
- the owner boundaries are already decided;
- the diff remains reviewable;
- stop conditions are clear;
- no high-risk mutation is hidden inside a broad change.

Do not split deterministic mechanical steps into separate primary versions merely to preserve the old template.

### Stage 5: Consumer Integration

A new static authority is not mature merely because it validates. Before expansion, prove one of:

- an existing runtime or UI consumer reads it;
- a scheduled consumer requires it in the next package;
- it is a deliberately approved vocabulary/identity foundation with a concrete reopening trigger and no further immediate expansion.

Do not create another static schema without a consumer or milestone dependency.

### Stage 6: Focused Validation And Acceptance

Use `docs/design/validation-command-matrix-plan.md`.

- Run exact owner-focused green gates.
- Run normal content lint for affected registered content/dependencies.
- Run schema parse coverage for schema changes.
- Run deterministic simulation/roundtrip tests for state, ticks, persistence, or events.
- Treat broad typechecks and full-suite results as baseline audits only when relevant and explicitly scoped.
- Keep DB/UI builds and other generators explicit and output-reviewed.

Acceptance requires the capability and consumer to work, not merely the existence of files.

### Stage 7: Stabilization And Support

Use a four-segment suffix for:

- retry;
- narrow repair;
- post-implementation audit;
- baseline capture;
- focused regression follow-up;
- coordination alignment;
- documentation correction that does not change milestone sequencing.

Promote support work to a primary route only when it changes capability, owner boundaries, dependency order, or maturity readiness.

### Stage 8: Close, Pause, Expand, Or Reopen

A zero-result or blocked lane must end with exactly one posture:

- closed;
- paused;
- authored-input gated;
- consumer gated;
- dependency gated;
- research gated;
- maturity gated;
- rejected;
- superseded.

Record a concrete reopening trigger. Do not create a generic roadmap-selection route immediately afterward when a milestone queue already exists.

## 5. Primary Version Rule

A three-segment primary route is justified when it does at least one of the following:

- adds or integrates a coherent capability;
- establishes a durable owner boundary required by the active milestone;
- removes a material blocker to the active milestone;
- changes dependency order or maturity readiness;
- creates a validated content/authority package with a named near-term consumer;
- completes a milestone acceptance gate.

A primary route is not justified solely by:

- repeating an unchanged-source audit;
- confirming a small repair already proved by focused tests;
- aligning coordination files;
- selecting another lane after a closure when no milestone context changed;
- producing a zero-candidate table that restates an existing gate;
- deciding to register an already approved deterministic seed when the registration can be part of the implementation package;
- post-registration confirmation with no contradictory evidence.

Historical labels remain unchanged.

## 6. Audit Reuse And Source-Fingerprint Rule

Every evidence audit or zero-result deferral should identify its effective source fingerprint:

- source files/families inspected;
- relevant latest commit or version anchor;
- candidate set;
- unresolved gate;
- reopening triggers.

A later route must not repeat the audit unless at least one fingerprint element changed. A new consumer may justify a targeted relationship audit, but it does not automatically justify rescanning all canon.

## 7. Named Consumer Rule

Before schema planning, live seed expansion, relationship authority, or runtime promotion, name the consumer.

Valid consumers include:

- an existing engine/helper path;
- an existing UI/read-only projection;
- a selected `v0.6.x` engine-owned command/state transition;
- a selected `v0.7.x` integrated loop;
- a required save/load or event-history contract;
- a focused validator protecting live registered content;
- a specific authored content package approved by the user.

“Future gameplay,” “eventual MMO,” “would be useful,” or “genre expectation” is not a named consumer.

## 8. User Input Rule

User input is mandatory only when repository evidence cannot decide a material product/canon choice, such as:

- approving exact new canon, names, ids, histories, organizations, people, or relationships;
- choosing between multiple evidence-backed player-loop anchors with materially different project identity or scope;
- selecting a persistence/product policy not determined by existing owners;
- authorizing a high-risk compatibility, migration, networking, or account policy;
- choosing a creative direction that changes content requirements.

Do not use user input as a generic deferral for technical decisions that repository evidence and established design rules can resolve.

Every question must state options, recommended default, unlocked work, and whether other work can continue.

## 9. Deep Research Rule

Commission Deep Research only when:

- one exact unresolved question blocks a scheduled route;
- repository evidence is insufficient;
- external evidence can materially change architecture, validation, design criteria, or risk handling;
- the output has a named durable consumer and retirement trigger.

Do not commission broad catch-all research or use research to create Lineage canon.

The temporary intake at `docs/dev/tmp-deep-research-streamlined-pipeline-review-2026-07-12.md` must be retired after its accepted material is fully promoted and its rejected assumptions are no longer needed for provenance.

## 10. Current Lane Decisions

### Tool-surface validation

Posture: complete and stable.

Evidence:

- repaired test source contains only content-lint execution;
- status/stderr and anchored positive-count output assertions are present;
- DB build and scenario runner are absent from the generic test;
- focused validation is recorded in the current Codex output.

Reopen only if focused local verification fails, tool behavior changes, or generated-output mutation reappears.

### Other full-suite failures

Posture: owner-specific untriaged or known debt.

Do not batch them into a general cleanup milestone. Promote only the failure families that block the selected consumer or materially prevent reliable baseline comparison.

### Broad typecheck debt

Posture: known-failing audit surfaces.

Do not require repository-wide cleanup before productive work. Use the relevant compiler context when the selected path touches that source, compare baseline, and fix only direct blockers unless a dedicated consolidation proves a broader dependency.

### Static zero-id authority lanes

People/NPC, faction, institution, business, government, jurisdiction, force, diplomacy, and conflict retain their authored-input/ready-consumer gates. Do not reopen them merely to seek another foundation route.

### Stable paused static lanes

Services, resources/commodities, and combat-health vocabulary remain valid foundations. Expand only for a named consumer.

### Rejected/closed lanes

Generic POI remains rejected in favor of specific owners. Highcrown settlement Knowledge remains closed. Reopen only under their recorded triggers.

### High-risk future lanes

Save/account/persistence, runtime ownership, magic execution, combat execution, economy mutation, Living Character Manuscript, construction, agriculture, maritime, broad social simulation, and MMO concerns retain their separate gates.

## 11. Roadmap Horizons

### Horizon 1: Finish `v0.5.x` With One Consolidated Gate

Next primary route:

- `Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation`

Purpose:

- map current UI/demo orchestration, engine commands/helpers, session/player/world/civilization state, events/results, save/load, and deterministic simulation seams;
- compare evidence-backed candidate first consumers;
- choose exactly one first engine-owned path or stop with a precise blocker/decision card;
- define the minimum validation and persistence requirements for `v0.6.0`;
- identify which accepted validation/typecheck failures are actually on that path;
- retire or demote planning-only routes that do not advance the selected path.

No code or canon is authorized in `0.5.357`.

Exit conditions for `v0.5.x`:

- one first runtime consumer selected;
- input/output/state/event owner boundaries fixed;
- UI adapter boundary fixed;
- save/load and roundtrip expectations fixed;
- focused green validation named;
- direct blockers separated from unrelated debt;
- explicit stop conditions and rollback/reversibility posture recorded;
- no unresolved user or research question remains hidden.

### Horizon 2: `v0.6.x` Runtime Ownership Transition

`v0.6.x` should move one bounded path from UI-authored/demo orchestration into engine ownership.

Expected milestone packages, subject to `0.5.357` evidence:

1. command/intention and authoritative state transition;
2. result/event envelope and deterministic tests;
3. save/load roundtrip for the changed state;
4. UI adapter migration with no direct owner bypass;
5. focused acceptance and direct blocker repair.

These are packages, not reserved version numbers. Combine them when one coherent reviewable change is safer than artificial separation.

### Horizon 3: `v0.7.x` Integrated Gameplay

Connect stable engine-owned systems through shared contracts into one bounded player loop. Consume existing content and authorities before expanding them. Add only the content required by the selected loop and only with approved canon.

The integrated loop must demonstrate meaningful Lineage identity where current systems support it: persistent state, remembered consequence, scoped ownership, or continuity. It does not need every long-term system.

### Horizon 4: `v0.8.x` Pre-Alpha Vertical-Slice Hardening

Harden one narrow playable path with:

- stable save/load;
- engine-owned runtime behavior;
- complete minimum content for the path;
- UI feedback and failure states;
- balancing sufficient for evaluation;
- focused and bounded regression coverage;
- explicit known limitations and excluded systems.

The slice is not required to include broad crafting, full economy, advanced combat, magic execution, construction, social simulation, manuscript generation, or multiplayer unless the selected path genuinely depends on them.

### Horizon 5: Later Maturity

After the slice proves the need, group expansion into milestone clusters:

- world/travel/content expansion;
- social/civic and authored population;
- economy/crafting/property/construction;
- combat/health/injury/equipment/loot;
- magic study/acquisition/execution;
- Legacy/Renown/family/character progression;
- Chronicle and Living Character Manuscript readiness;
- account/persistence evolution;
- simulation depth;
- multiplayer/MMO architecture only after a concrete product need and proven local loop.

## 12. Exact Next Route

Select:

`Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation`

Type: primary, documentation-only, dependency and maturity decision.

Required repository evidence:

- `AGENTS.md`, `README.md`, current output/handoff/prompt, roadmap, sequence, backlog;
- project vision and future-system ledger;
- existing runtime ownership plans and magic command/event precedent;
- game/player/world/civilization/session state contracts;
- save snapshot and roundtrip tests;
- UI game-shell orchestration and command/state mutation seams;
- simulation runner and deterministic tests;
- quest offer/state, discovery, Chronicle, economy tick, travel/movement, or other existing candidate paths;
- validation source map, command matrix, and current known failure inventory.

Required output:

- one durable readiness decision document;
- one candidate comparison table;
- one selected first consumer or one decision-ready blocker card;
- one dependency graph from current owners to `v0.6.x` acceptance;
- one bounded list of direct validation/typecheck blockers;
- updated coordination files and backlog only where relevant;
- cleanup/retirement disposition for temporary planning artifacts.

Prohibited:

- code, content, schema, test, config, dependency, UI, runtime, save/account, or generated-output edits;
- invented canon or demonstration content;
- broad typecheck/full-suite cleanup;
- reopening zero-id lanes without a qualifying input;
- assigning dozens of future micro-versions;
- selecting a path because it is conventional rather than supported by repository evidence.

## 13. Candidate Selection Framework For `0.5.357`

Score each evidence-backed candidate using High/Medium/Low or 0-3 ratings for:

- contribution to an engine-owned player/session loop;
- reuse of existing implemented content and helpers;
- dependency-unblocking value;
- player-visible value;
- persistence/save roundtrip readiness;
- deterministic test readiness;
- UI adapter clarity;
- owner-boundary clarity;
- architectural risk;
- runtime mutation risk;
- user-input dependency;
- external-research dependency;
- scope and coordination cost;
- reversibility;
- likelihood of creating another planning-only loop.

Candidate families must come from current repository evidence. The route may compare session start/continue, movement/travel, discovery, quest offer/acceptance/state, economy tick projection, or other current seams, but this list is not approval or a requirement to select any named candidate.

## 14. Source-Of-Truth Disposition

Retain as authoritative:

- `AGENTS.md`: repository rules and maturity-band meanings;
- `docs/dev/current-codex-output.md`: exact latest Codex result;
- `docs/dev/current-gpt-handoff.md`: immediate connector guidance;
- `docs/dev/project-roadmap.md`: long-term roadmap after reconciliation;
- `docs/dev/codex-sequenced-implementation-plan.md`: near-term queue after reconciliation;
- `docs/design/future-system-design-ledger.md`: durable design criteria;
- validation source map and command matrix: validation routing;
- lane-specific decisions: detailed owner and reopening gates.

This decision is authoritative for immediate sequencing where older coordination pointers conflict.

Retain historical data. Do not delete or rewrite the long completed-route history during the immediate consolidation. A later cleanup may move detailed chronology to release/history documents only after links and unique information are audited.

## 15. Risks Controlled

This decision directly addresses:

- endless documentation passes;
- repeated zero-candidate audits;
- version inflation;
- schema proliferation;
- static authorities without consumers;
- roadmap-selection churn;
- coordination-file drift;
- validation cleanup becoming the roadmap;
- hidden side effects in generic tests;
- save/load ownership arriving too late;
- premature MMO architecture;
- broad user questions used as deferral;
- research without a scheduled consumer;
- loss of valid historical decisions during simplification.

## 16. Required Coordination Follow-Up

A local docs-capable run should reconcile the current coordination files without deleting history:

- replace the old primary `0.5.357` post-repair-audit pointer with `0.5.357 - Runtime Ownership Transition Readiness Consolidation`;
- retain the optional audit as `0.5.356.1` only if local focused verification warrants it;
- add this decision to the roadmap source map;
- add the temporary Deep Research intake and its retirement trigger;
- keep current Codex output unchanged until the next Codex run;
- avoid copying the full completed-route chronology into new files.

## 17. Next Recommended Version

Version 0.5.357 - Runtime Ownership Transition Readiness Consolidation
