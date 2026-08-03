# Civilization Simulation Tick, Persistence, And Correction Audit

Date: 2026-08-03

Execution surface: ChatGPT through GitHub Connector only

Source head inspected: `8214327906fbc2edf7ab4d02168cf94b3abc7e6f`

Status: `CANDIDATE_INTEGRATION`; documentation-only evidence; no runtime permission

## Executive Result

The civilization engine is an active mutable simulation owner, not merely a static-content reader.

`tickCivilization(...)` rebuilds and advances economy, market, transport, autonomous trade, settlement simulation, and generated quest-offer state, then emits summary deltas and events.

Classification:

`ACTIVE_CIVILIZATION_SIMULATION_EXISTS; DURABLE_OCCURRENCE_REPLAY_AND_CORRECTION_BOUNDARY_INCOMPLETE`

## Current Tick Authority

The current tick path performs at least these operations:

- rebuilds economy state from settlement content and clock facts;
- aggregates economy hierarchy and summaries;
- builds settlement market states;
- advances transport state;
- applies transport-driven market changes;
- evaluates and dispatches autonomous trade;
- updates asset reservations and stock adjustments;
- generates settlement quest offers;
- stores economy snapshots, level totals, markets, transport, and quest state;
- builds economy, market, logistics, trade, settlement, and quest deltas;
- emits civilization events and warnings.

This is executable simulation authority. Static recipe, settlement, service, route, and economy content are inputs rather than the sole owners.

## Mutation Matrix

| Domain | Current mutation or output | Boundary concern |
| --- | --- | --- |
| Economy hierarchy | nodes, snapshots, level totals, supply/demand balances | rebuilt each tick; durable identity and correction semantics must remain exact |
| Markets | settlement market states, price views, stock adjustments | pricing projection and mutable stock authority must not be conflated |
| Transport | caravan progress, statuses, reservations, arrival/block results | route progress and asset reservation need duplicate/replay guarantees |
| Autonomous trade | opportunity evaluation and dispatch | deterministic opportunity identity and repeated-dispatch prevention need explicit proof |
| Settlements | population, businesses, districts, plots, morale, infrastructure summaries | derived profile versus mutable source ownership must remain distinguishable |
| Quests | generated active offers | offer identity, expiry, regeneration, and persistence must not duplicate or erase accepted player state |
| Deltas/events | aggregate summaries and emitted events | summaries are not complete mutation receipts |

## Persistence Boundary

Current save-shaped state can retain civilization economy, market, transport, settlement, and quest facts where included by the snapshot contract. Persistence alone does not establish:

- occurrence identity for each civilization tick;
- exact input-state revision;
- idempotent reapplication;
- replay from prior authoritative facts;
- correction or rollback semantics;
- event-to-state proof;
- provenance for derived profiles and aggregate summaries.

A later persistence claim must distinguish stored current state from retained simulation evidence.

## Determinism Questions

A focused local audit should prove:

1. identical starting state, clock, and content produce byte-stable next state and outputs;
2. array and map ordering do not affect selected opportunities or emitted summaries;
3. repeated application of the same tick is rejected or proven idempotent;
4. transport dispatch and reservations cannot duplicate;
5. quest offers cannot silently collide across settlements or regeneration;
6. stale content or snapshot revisions fail predictably;
7. warnings do not conceal partial state mutation;
8. market and stock rounding remain stable;
9. autonomous trade tie-breaking is deterministic;
10. correction does not reconstruct authority from aggregate delta prose.

Connector inspection cannot establish those executable properties.

## Delta And Event Boundary

The engine emits useful aggregate deltas, including top shortfalls, surpluses, market counts, caravan counts, route progress, settlement totals, and quest-offer counts.

These are projections. They do not necessarily retain every accepted mutation, reservation, stock adjustment, dispatch decision, or quest-offer change.

Future replay or correction work must use owner-certified state and exact result evidence, not summary deltas alone.

## Adjacent Evidence

Future civilization work must inspect applicable existing branches:

- economy command and transaction boundary: `parallel/economy-command-surface-refresh` at `c98199dc8069099dbf52ded5fffcbf715fc08522`;
- recipe and production maturity: `parallel/recipe-production-maturity-audit` at `3db3c0f52456b4007dedc43817ecca5c06edd239`;
- regional settlement maturity: `parallel/regional-settlement-maturity-audit` at `e96c3841d4e54f9bf6e2c40de8df5011bbbb4986`;
- travel, routes, and service availability: `parallel/travel-route-service-availability-audit` at `d308d5c571b6c4739fecf4213f5a3152857e97ee`;
- content validation layers: `parallel/content-lint-schema-validator-coverage-audit` at `82ce2bfa12efa3cfa6810d3841c655b6a3635334`.

## Safe Future Sequence

1. focused executable characterization of one civilization tick;
2. exact mutation/result inventory by sub-owner;
3. deterministic opportunity, caravan, reservation, and offer identity decision;
4. duplicate/replay/correction contract;
5. persistence and migration audit;
6. only then expansion or player-facing economy command integration.

Do not replace the current system with a generic simulation framework during characterization.

## Mandatory Consumers

Future work must inspect this audit when it concerns:

- civilization or economy ticking;
- settlement simulation;
- autonomous trade;
- caravan transport;
- market stock or pricing mutation;
- generated quest offers;
- civilization save/load, replay, or correction;
- claims that settlement or economy runtime is mature.

## Review Trigger

Re-review when:

- civilization tick tests or simulations change;
- transport or autonomous trade identity changes;
- market stock persistence changes;
- quest-offer generation changes;
- correction/replay contracts are proposed;
- a milestone claims civilization simulation persistence or determinism.

## Validation Limits

This audit used GitHub Connector source and document inspection only. It ran no tests, builds, typechecks, content lint, simulations, or local Git commands.

No runtime source, tests, schemas, content, UI, prompt, handoff, roadmap, or branch register changed.