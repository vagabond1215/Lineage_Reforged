# Game Tick Cross-Engine Delta, Event, And Warning Orchestration Audit

Date: 2026-08-03

Execution surface: ChatGPT through GitHub Connector only

Source head inspected: `8214327906fbc2edf7ab4d02168cf94b3abc7e6f`

Status: `CANDIDATE_INTEGRATION`; documentation-only evidence; no implementation permission

## Executive Result

`runGameTick(...)` is the central synchronous orchestrator for world, civilization, player, and combat ticks. It initializes missing game-state defaults, executes the domains in a fixed order, aggregates all emitted events and warnings, and returns combat deltas plus an orchestration summary.

The current return shape does not include the world, civilization, or player delta arrays themselves. That may be intentional because those engines mutate their own state and deltas are diagnostic projections, but the contract must be explicit before callers rely on `GameDelta[]` as a complete record of one game tick.

Classification:

`FIXED_CROSS_ENGINE_ORCHESTRATION_EXISTS; COMPLETE_DELTA_AND_ATOMIC_TICK_CONTRACT_UNCLEAR`

## Current Order

The game tick currently runs:

1. world;
2. civilization;
3. player;
4. combat;
5. aggregate global output.

The orchestration delta reports the same order and the count of each domain's returned deltas.

This order is semantically important because later domains can observe state mutated by earlier domains. It must not be treated as incidental call ordering.

## Current Return Shape

The returned `TickResult<GameDelta>` includes:

- `domain: "game"`;
- the applied tick;
- combat deltas;
- one orchestration delta containing domain-delta counts;
- all world, civilization, player, and combat emitted events;
- all world, civilization, player, and combat warnings.

It does not append the world, civilization, or player delta arrays to `deltas`.

A future contract must decide whether:

- `GameDelta[]` is intentionally combat-and-orchestration-only;
- noncombat deltas are diagnostic local outputs consumed before return;
- those deltas should be retained elsewhere;
- the current omission is evidence loss for observers, replay, debugging, or tests.

Do not call the aggregate delta list complete until that decision is explicit.

## Mutation And Atomicity Boundary

Each domain mutates its own context during the same call. The orchestrator does not visibly stage every domain against one cloned aggregate snapshot before committing all results.

Focused characterization should establish:

1. whether a later domain failure can leave earlier domain mutations applied;
2. whether warnings ever accompany partial or rejected mutation;
3. whether exceptions are permitted or normalized;
4. whether the same tick can be applied twice;
5. which revision or occurrence identity protects duplicate execution;
6. whether domain contexts always reference one coherent snapshot and clock;
7. whether event ordering exactly follows domain execution and within-domain order;
8. whether callers treat emitted events or deltas as authoritative receipts;
9. how correction or rollback works after partial execution;
10. whether state initialization is migration, normalization, or runtime mutation.

## Event Boundary

Aggregating domain events is useful transport. It does not prove that every mutation has a corresponding event or that an event is sufficient to replay its domain.

A future event contract should identify:

- owning domain;
- occurrence and result identity;
- source-state revision;
- accepted tick;
- payload completeness;
- duplicate and correction posture;
- whether ordering is meaningful;
- whether the event is authoritative or a projection.

Generic event aggregation must not flatten owner-specific acceptance semantics.

## Warning Boundary

Warnings from every domain are concatenated. The contract should clarify:

- informational versus degraded-success warnings;
- whether any warning indicates partial mutation;
- whether warning order is deterministic;
- whether warnings are persisted or presentation-only;
- whether repeated warnings can duplicate across replay;
- whether a warning can be safely ignored by the caller.

Warnings should not substitute for typed rejection or partial-result status.

## Default-State Initialization

The orchestrator fills missing run difficulty, combat mode, party, encounter, combat history, and player-context difficulty.

This is practical compatibility normalization, but future persistence and migration work must distinguish:

- valid old-snapshot defaulting;
- invalid missing authority;
- runtime initialization for a new game;
- silent repair of malformed state.

Default insertion should not hide unsupported schema or migration gaps.

## Existing Parallel Evidence

Mandatory adjacent evidence includes:

- civilization tick authority: `parallel/civilization-tick-audit` at `859aadea20efaf88b49183491b08181bdea463db`;
- world spawn and combat admission: `parallel/world-spawn-admission-audit` at `fb42f01bc91d6b31e8e20533c28935404f2c918c`;
- JS/TS export and module integrity: `parallel/js-ts-mirror-export-integrity-audit` at `6304ebf8ab00bbf74e81cd85099dea236373c2af`;
- Chronicle/notification provenance where events become presentation: `parallel/chronicle-notification-provenance-audit` at `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01`.

## Safe Future Sequence

1. focused executable characterization of one full game tick;
2. exact domain-context and state-sharing inventory;
3. decision on aggregate delta completeness;
4. failure, warning, and partial-mutation characterization;
5. duplicate tick and occurrence-identity contract;
6. event ordering and replay/correction decision;
7. only then refactoring or broader orchestration generalization.

Do not add a generic transaction framework merely to make the current shape look uniform.

## Mandatory Consumers

Future work must inspect this audit when it concerns:

- `runGameTick`;
- domain tick order;
- aggregate deltas, events, or warnings;
- whole-tick atomicity or replay;
- shared clock or snapshot contexts;
- simulation debugging and observability;
- claims that one tick's output is a complete durable record.

## Review Trigger

Re-review when:

- domain execution order changes;
- aggregate delta composition changes;
- full-tick tests or simulations land;
- duplicate or occurrence identity is added;
- exceptions or partial-failure handling changes;
- a milestone claims whole-tick replay, correction, or atomicity.

## Validation Limits

This audit used GitHub Connector source and document inspection only. It ran no tests, builds, typechecks, simulations, or local Git commands.

No runtime source, tests, schemas, content, UI, prompt, handoff, roadmap, or branch register changed.