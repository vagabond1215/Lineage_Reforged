# World Spawn Candidate And Encounter Admission Audit

Date: 2026-08-03

Execution surface: ChatGPT through GitHub Connector only

Source head inspected: `8214327906fbc2edf7ab4d02168cf94b3abc7e6f`

Status: `CANDIDATE_INTEGRATION`; documentation-only evidence; no implementation permission

## Executive Result

The world engine resolves spawn candidates, persists them into world state, emits a spawn-candidate event, and the game tick passes the pending candidate list directly into combat.

That is a real world-to-combat integration seam. The exact candidate occurrence, consumption, duplicate-admission, persistence, and correction contract is not yet documented as one authority boundary.

Classification:

`SPAWN_CANDIDATE_RUNTIME_EXISTS; WORLD_TO_COMBAT_ADMISSION_CONTRACT_INCOMPLETE`

## Current World Tick Behavior

The current world tick:

- selects a region from encounter context or active regions;
- emits a weather delta using the current climate profile and tick;
- calls `resolveSpawnCandidates(...)` with world state, tick, and seed;
- writes the returned list to `world.state.pendingSpawnCandidates`;
- emits a spawn delta when candidates exist;
- emits `spawn.candidate.resolved` with region, candidate ids, encounter-template ids, and spawn-profile ids.

The game tick then supplies `pendingSpawnCandidates` to the combat foundation in the same orchestration pass.

## Candidate Versus Encounter Boundary

A spawn candidate is not automatically a durable encounter occurrence.

The contract should distinguish:

- static spawn profile;
- static encounter template;
- resolved candidate;
- admitted encounter;
- created combatant set;
- active encounter identity;
- completed or rejected encounter;
- retained event and correction evidence.

Candidate storage or event emission alone should not prove that combat admitted or consumed the candidate.

## Identity Questions

Future characterization must establish:

1. how candidate ids are derived;
2. whether ids are collision-safe across regions, ticks, seeds, profiles, and templates;
3. whether candidate ordering is deterministic;
4. whether the same candidate can be admitted more than once;
5. when a candidate is consumed, retained, replaced, or expired;
6. whether pending candidates survive save/load;
7. how stale candidates are rejected;
8. how an active encounter links back to exact candidate evidence;
9. how correction removes or supersedes a bad candidate or encounter;
10. whether event ids are unique for multiple candidates in one region/tick.

The current event id is tick-and-region-shaped while its payload may contain multiple candidates. That can be a valid batch event, but the batch/occurrence semantics must be explicit before replay or correction claims.

## Seed And Determinism Boundary

The world engine receives a seed. Connector inspection does not prove:

- seed ownership and versioning;
- channel separation from other random consumers;
- retained draw or decision evidence;
- identical-state replay;
- stable behavior under candidate-array reordering;
- migration behavior if the algorithm changes.

A seed value is an input, not by itself a replay receipt.

## Combat Admission Boundary

Combat must independently validate candidate facts before creating or reusing an encounter. A future contract should cover:

- candidate known and still pending;
- region and template compatibility;
- one active encounter or explicit concurrency policy;
- participant and spawn-profile validity;
- duplicate candidate rejection;
- deterministic combatant identity;
- atomic transition from pending candidate to admitted encounter;
- accepted result/event identity;
- save/load and correction behavior.

The world engine should not own combatant creation or combat outcome truth.

## Existing Parallel Evidence

Applicable evidence includes:

- bestiary/ecology and missing dynamic-spawn owners: `parallel/regional-bestiary-ecology-maturity-audit` at `2bafdb21a24535394c3cb32e946315c2c51eaa74`;
- text-first combat presentation: `parallel/text-first-combat-view-model-audit` at `b605175e6edce6889171e067a5c899e4c7a59788`;
- NPC-party and combatant persistence: `parallel/npc-party-companion-readiness-audit` at `c3092bcd02ff8530481f8cd4d16819f0a275c4a6`;
- content validation layers: `parallel/content-lint-schema-validator-coverage-audit` at `82ce2bfa12efa3cfa6810d3841c655b6a3635334`.

## Safe Future Sequence

1. focused executable characterization of candidate resolution;
2. exact candidate identity and ordering decision;
3. pure combat-admission plan with rejection codes;
4. atomic candidate consumption and encounter creation;
5. duplicate, stale, save/load, replay, and correction tests;
6. event and presentation projection review;
7. only then expansion of spawn selection or encounter concurrency.

Do not combine this with broad ecology simulation or NPC-party implementation.

## Mandatory Consumers

Future work must inspect this audit when it concerns:

- spawn candidate resolution;
- encounter selection or admission;
- world seed or spawn determinism;
- pending spawn persistence;
- combatant creation from encounter templates;
- duplicate encounter prevention;
- world-to-combat replay or correction;
- claims that dynamic spawning is complete.

## Review Trigger

Re-review when:

- spawn resolution or candidate identity changes;
- combat admission becomes command-shaped;
- pending-candidate persistence changes;
- multiple simultaneous encounters are proposed;
- spawn replay/correction tests land;
- a milestone claims world encounter integration maturity.

## Validation Limits

This audit used GitHub Connector source and document inspection only. It ran no tests, builds, typechecks, content lint, simulations, or local Git commands.

No source, tests, schemas, content, UI, prompt, handoff, roadmap, or branch register changed.