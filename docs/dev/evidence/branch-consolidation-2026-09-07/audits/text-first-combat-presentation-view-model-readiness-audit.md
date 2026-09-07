# Text-First Combat Presentation View-Model Readiness Audit

Date: 2026-08-03

Source route: ChatGPT via GitHub Connector

Original branch baseline: `bcbe658d1be033cdc83d04acdca67ec8186c484d`

Inspected live master: `91bd8c2c89c85fb9ea7257b2c96b68ab41231b04`

Branch: `parallel/text-first-combat-view-model-audit`

Status: `REFRESHED_CONNECTOR_EVIDENCE_CANDIDATE_INTEGRATION`

Execution posture: connector-only, read-only presentation audit; no combat, UI, command, engine, shared contract, save, content, schema, test, asset, roadmap, or active-route change

## Purpose

Refresh whether the current combat contracts can support a bounded read-only text-first presentation view model without inventing combat rules or leaking hidden information.

This audit does not authorize a combat screen, a gambit editor, party implementation, or combat behavior change.

## Freshness Review

The baseline-to-master comparison spans 84 commits. No changed path in that range belongs to the live combat or tactics shared contracts, combat engine, combat content, combat tests, or combat save fields.

A later `Combat AI And Gambit Current-State Audit` confirms that weighted deterministic tactics AI, target ranking, mixed control, and static presets are real current infrastructure. It also confirms that a literal ordered condition/action gambit language and a complete NPC-party runtime remain absent.

Result:

`COMBAT_VIEW_MODEL_INPUTS_STABLE; AI_CONTEXT_CLARIFIED`

## Presentable Facts Already Available

A read-only view model can safely derive bounded presentation from accepted combat state, including:

- encounter identity and state;
- area-context identifiers subject to owner-resolved labels and knowledge rules;
- current combat tick;
- allied, guest, and enemy combatant groupings;
- team definitions;
- combatant resources and accepted statuses exposed by the contract;
- queued, executing, channeling, recovery, and resolved actions;
- targeting state and current player target;
- pause posture;
- manual-control and temporary override posture;
- terminal outcome;
- tactics role, preset, preference, and selected-target facts that are actually exposed.

The view model may organize and label these facts. It must not calculate new combat outcomes or mutate encounter state.

## Weighted AI Versus Gambits

Current combat AI scores candidate actions and targets from roles, preferences, thresholds, focus/ignore directives, resource state, casting/interrupt state, and supported action grants.

This supports presentation such as:

- current control mode;
- current role or preset label;
- queued action and target;
- manual override active/inactive;
- broad preference summary when safe and useful.

It does not support claiming that an ordered `condition -> action` gambit program exists. The repository lacks accepted rule ordering, fallthrough, conflict resolution, validation, interpreter authority, editor behavior, and durable decision traces.

## Missing Presentation Authority

A dedicated view-model decision still needs to decide:

- player-facing labels for actions, statuses, actors, teams, roles, presets, locations, hazards, and outcomes;
- observer visibility and hidden-information rules;
- when target intent, casting, interruptibility, threat, tactics preferences, or enemy resources are visible;
- queue ordering and timing language;
- action history retention and bounded display;
- party and guest presentation before ordinary NPC-party construction is complete;
- explanation versus debug information;
- keyboard/controller focus, screen-reader ordering, responsive layout, and pause behavior;
- whether presentation memory is local, persisted, or derived;
- error, stale, unavailable, and no-encounter states.

## Prohibited Inference

A presentation layer must not infer:

- undiscovered geographic labels;
- hidden enemy identity or capability;
- exact future action selection from weighted preferences;
- unexposed threat, weakness, target score, or RNG information;
- tactics/gambit rules that do not exist;
- durable party membership or persisted companion health not owned by current authority;
- combat outcomes, damage, timing, targeting legality, or action admission.

## Current Classification

| Boundary | Classification |
| --- | --- |
| Encounter/combatant/action source facts | `SUFFICIENT_FOR_BOUNDED_READ_ONLY_PLAN` |
| Weighted tactics AI | `LIVE_ENGINE_AUTHORITY` |
| Ordered gambit system | `ABSENT_DEFERRED` |
| Observer/visibility policy | `INCOMPLETE` |
| Player-facing label resolution | `INCOMPLETE` |
| Full NPC-party runtime | `INCOMPLETE` |
| Text-first view-model decision | `READY_AS_DOCUMENTATION_PREREQUISITE` |
| Combat UI implementation | `NO_PACKAGE` |

## Smallest Safe Future Decision

A text-first combat presentation contract should:

1. enumerate exact source fields and owner-resolved labels;
2. define observer visibility and hidden-information boundaries;
3. define encounter header, roster, current turn/tick, queue, target, status, resources, outcome, and history projections;
4. define control-mode and weighted-tactics presentation without inventing gambits;
5. define empty, forming, active, paused, resolved, stale, and unavailable states;
6. define accessibility, responsive, focus, and input posture;
7. identify one narrow implementation slice and explicit exclusions;
8. require the UI to remain read-only unless separate combat commands are already accepted.

## Named Consumer And Review Trigger

This audit must be read by:

- a text-first combat presentation contract;
- a combat UI/view-model implementation package;
- a tactics or gambit presentation decision;
- an NPC-party combat integration review;
- a representative-loop or `0.7.0` audit claiming combat is coherently presented.

The consuming run must cite this branch head or an integrated successor and re-inspect live combat/tactics contracts, engine output, save fields, visibility authority, and current tests from its own head.

## Branch Disposition

`CANDIDATE_INTEGRATION`

Integration condition: compare against then-current combat, tactics, party, and UI authority and integrate or re-author during a named consumer or dedicated parallel-document coordinator pass.

Retirement condition: all findings are integrated or superseded, named consumers can reach equivalent evidence on master, and the exact branch head is verified.

No local tests, combat simulations, builds, typechecks, accessibility checks, or UI execution were performed.
