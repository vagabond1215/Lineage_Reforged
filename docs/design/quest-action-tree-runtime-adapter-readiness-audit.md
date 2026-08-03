# Quest Action-Tree Runtime Adapter Readiness Audit

Date: 2026-08-03

Execution surface: ChatGPT through GitHub Connector only

Source head inspected: `8214327906fbc2edf7ab4d02168cf94b3abc7e6f`

Status: `CANDIDATE_INTEGRATION`; documentation-only evidence; no runtime permission

## Executive Result

The repository has substantial validated quest action-tree content, but it does not have a runtime action-tree executor or persisted quest-attempt cursor.

The safest future posture is a quest-owned adapter over a separately defined resolution grammar, not promotion of quest content into a universal activity engine.

Classification:

`VALIDATED_QUEST_GRAPH_CONTENT_EXISTS; RUNTIME_ATTEMPT_AND_EFFECT_AUTHORITY_ABSENT`

## Current Static Foundation

Quest archetypes and definitions already model:

- planning, execution, and resolution phases;
- local node identity and graph entry/completion structure;
- checks using attributes, skills, abilities, spells, tools, items, party size, and an authored `rng` label;
- critical-success, success, partial, failure, and critical-failure branches;
- local next-node references;
- quest-state outcomes;
- summaries and effect-token strings;
- participant-range constraints.

Schemas and semantic validators protect strict shape, local graph closure, supported check kinds, reference validity, and participant bounds.

This is meaningful static authority. It is not an executable check formula or mutable attempt.

## Missing Runtime Owners

The current action-tree model does not own:

- occurrence or attempt identity;
- mutable current node and phase;
- accepted choices;
- actor and participant assignments;
- contribution or aggregation semantics;
- target and method difficulty;
- continuous check margin;
- result-band thresholds;
- named uncertainty channel or retained draw evidence;
- typed proposed effects;
- effect idempotency;
- command, result, event, replay, correction, or cooldown state;
- save persistence for an active action-tree attempt.

An authored `rng` check kind does not authorize randomness by itself.

## Quest-Owned Boundary

Quest-local identities and transitions should remain quest-owned:

- archetype and definition identity;
- local node ids;
- quest-state transitions;
- quest-specific branch summaries;
- quest completion and journal consequences.

Reusable concepts may be adapted from a shared resolution grammar only where exact semantics are accepted:

- phase vocabulary;
- check-source vocabulary;
- result-band vocabulary;
- participant roles and contribution evidence;
- typed effect proposals;
- attempt and occurrence identity;
- deterministic uncertainty receipts.

A generic resolver must not directly mutate quest journal state or execute opaque quest effect strings.

## Adapter Contract Requirements

A future quest adapter must define:

1. validated quest definition and node inputs;
2. attempt identity and snapshot revision;
3. participant and contribution facts;
4. admitted method, target, and difficulty facts;
5. check formula and result-band thresholds;
6. uncertainty channel and retained evidence where used;
7. deterministic branch selection;
8. quest-owned transition proposal;
9. typed cross-owner effect proposals;
10. accepted result, event, and owner receipts;
11. duplicate, stale, replay, and correction behavior;
12. active-attempt persistence and migration;
13. observer-safe projection.

## Effect-Token Boundary

Existing effect strings are useful authored intent and migration evidence. They are not executable commands.

A future pass must classify each effect token as:

- quest-state transition;
- player progression proposal;
- inventory or item proposal;
- currency/economy proposal;
- standing or reputation proposal;
- Knowledge/discovery proposal;
- notification or Chronicle projection;
- unsupported/deferred token.

No token should be interpreted by string pattern without a typed owner contract.

## Current Command Relationship

Quest acceptance and tracking already use engine-owned command/result/event patterns. Those commands manage journal admission and tracking only.

They do not execute action-tree nodes, resolve checks, apply rewards, or prove quest completion idempotency.

The dedicated quest turn-in evidence remains mandatory:

`parallel/quest-turn-in-reward-source-audit` at `470e8aca48510f68824f7a5aa8f603d0b13bbc1f`

The activity advancement audit is also applicable where quest nodes are currently represented by hard-coded UI activity branches:

`parallel/activity-advancement-audit` at `b4cbaea5f4292904bba62f60a0108bb84f2bd405`

## Safe Future Sequence

1. docs-only shared resolution vocabulary and quest-adapter decision;
2. pure action-tree attempt projection with no mutation;
3. one deterministic node/check family;
4. quest-owned transition proposal;
5. typed owner-specific effects and receipts;
6. persisted attempt cursor and duplicate/replay tests;
7. accepted-only UI projection;
8. later expansion to additional check and effect families.

Do not implement all check kinds or migrate every quest definition in one package.

## Mandatory Consumers

Future work must inspect this audit when it concerns:

- quest action-tree execution;
- quest checks, choices, phases, or result bands;
- quest effect-token interpretation;
- quest attempt persistence;
- uncertainty or RNG in quest resolution;
- quest completion, turn-in, or reward routing;
- shared activity-resolution claims that use quest content as evidence.

## Review Trigger

Re-review when:

- a shared resolution grammar is accepted;
- a quest action-tree adapter is proposed;
- typed effect proposals land;
- active quest-attempt state is added;
- one action-tree node becomes executable;
- a milestone claims quest action trees are runtime-ready.

## Validation Limits

This audit used GitHub Connector source and accepted-document inspection only. It ran no tests, builds, typechecks, content lint, simulations, or local Git commands.

No source, tests, schemas, content, UI, prompt, handoff, roadmap, or branch register changed.