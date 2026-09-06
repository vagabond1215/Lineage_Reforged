# Development Milestone And Game Version Policy

Source route: ChatGPT via GitHub Connector

Date: 2026-09-06

Status: durable version architecture policy; prospective; no historical renumbering

Primary game-version authority: `docs/dev/game-version-roadmap-and-acceptance-policy.md`

Canonical game-version source: root `GAME_VERSION`

## 1. Purpose

Lineage: Reforged uses two independent numbering systems:

1. **Game versions** describe accepted player-facing playable-build maturity.
2. **Development milestones** describe accepted engineering capability, authority ownership, validation, and technical integration.

The previous repository convention used labels such as `Version 0.6.11` and `Version 0.7.0` for development workflow milestones. Those labels remain stable historical references, but they are not game versions.

Prospectively, development milestones use a `DEV-` prefix so they cannot be mistaken for the player-facing game version.

## 2. Current State

Current game version:

`0.1.0-prealpha`

Current game phase:

`Early Pre-Alpha / First Playable`

Current playability posture:

`INTEGRATED_LOOP`

Current development milestone posture:

- accepted technical work through legacy `Version 0.6.11` / `DEV-0.6.11`;
- `DEV-0.7.0 - Integrated Gameplay Systems Band Entry` authorized and pending publication/verification;
- accepting `DEV-0.7.0` does **not** automatically change `GAME_VERSION`.

## 3. Identity Separation

Never conflate these identifiers:

- game version;
- development milestone;
- exact Git build/commit SHA;
- save/world/data version;
- deployment revision;
- npm/package version;
- protocol/schema version;
- model/tool version.

`worldVersion` remains persisted world/save authority. It is not a player-facing game version and must not be changed merely to keep numbers visually aligned.

## 4. Development Milestone Label Classes

### 4.1 Primary development milestone

Format:

```text
DEV-X.Y.Z - Short Name
```

Use a primary development milestone when a run adds, changes, activates, closes, or formally accepts a durable engineering capability or authority.

Examples:

- moving a real mutation behind an engine-owned command;
- adding a validated static authority required by an active dependency chain;
- implementing a bounded runtime consumer;
- establishing a stable persistence or replay contract;
- completing a cross-system technical integration gate.

A primary development milestone does not imply a game-version increment.

### 4.2 Support milestone

Format:

```text
DEV-X.Y.Z.S - Short Name
```

Use for:

- post-implementation audits;
- retries after a blocked run;
- parent-specific repairs;
- validation-only passes;
- regression-coverage corrections;
- acceptance audits;
- parent-specific handoff or authority clarification.

A support milestone:

- belongs to exactly one primary milestone;
- does not consume another primary number;
- does not advance the game version by itself.

### 4.3 Unversioned run

Use a stable unversioned name for:

- research;
- cross-domain synthesis;
- source indexing;
- coordination reconciliation;
- future-system planning;
- held prompt preparation;
- broad read-only audits;
- player-facing prioritization decisions that have not yet selected an implementation package.

## 5. Historical Label Compatibility

Do not mass-renumber accepted historical documents, commits, tests, prompts, or decisions.

Historical labels remain exact references. Interpret them as legacy development milestones when used in current planning.

Examples:

- historical `Version 0.6.11` remains written that way inside its accepted authority documents;
- current discussion may refer to it as legacy `Version 0.6.11` / development milestone `DEV-0.6.11`;
- the active legacy `Version 0.7.0 - Integrated Gameplay Systems Band Entry` is prospectively renamed `DEV-0.7.0 - Integrated Gameplay Systems Band Entry` without changing its accepted evidence or readiness decision.

No historical commit or accepted authority is rewritten merely to add the prefix.

## 6. Development Milestone Assignment Decision

Assign a development label in this order:

1. **Does the run satisfy a named development-band entry gate?**
   - Yes: use the reserved `DEV-X.Y.0` band-entry label.
2. **Does the run materially advance a durable engineering capability inside the current development band?**
   - Yes: use a primary `DEV-X.Y.Z` label.
3. **Is it an audit, repair, retry, validation, clarification, or cleanup attached to one primary?**
   - Yes: use a `DEV-X.Y.Z.S` support suffix.
4. **Is it research, planning, coordination, source indexing, or a held decision?**
   - Yes: use an unversioned name.

When uncertain, choose the less maturity-significant development label.

This decision is independent from the game-version decision.

## 7. Development Band Entry Protocol

Before accepting a reserved development band entry:

1. create or activate a docs-first readiness audit;
2. reproduce the live repository baseline;
3. evaluate every technical criterion individually;
4. list blockers, partials, unsupported claims, and known limitations;
5. run the required executable validation and representative caller-path checks;
6. issue an explicit accepted/not-ready/blocked result;
7. use the new development band only after acceptance;
8. keep the game version unchanged unless a separate game-version acceptance gate is also satisfied.

The band-entry package should be a bounded verification/publication package, not a speculative feature dump.

## 8. Reserved Development Milestones

These retain the technical intent of the historical workflow bands. They are **not** game release stages.

### `DEV-0.7.0` — Integrated Gameplay Systems

Reserve until a validated, engine-owned integrated gameplay loop exists through stable shared contracts.

Minimum technical evidence:

- character creation/start-state can enter the representative session;
- authoritative persistence preserves required state;
- travel/movement participates through engine-owned authority;
- quest/activity advancement moves beyond selection through authoritative attempt/result paths;
- at least one consequence-bearing interaction crosses multiple systems;
- commands, events, synchronization, stale/conflict protection, and accepted-only UI application are coherent;
- required resource/typed-effect ownership exists for the included interaction;
- replay/retry/failure behavior is bounded and tested;
- demo/UI-authored mutations do not control the representative milestone loop;
- known omissions are explicit and non-invalidating.

Acceptance of `DEV-0.7.0` means technical integrated-loop maturity. It does not mean `Game 0.7.0`, 70% complete, vertical slice, alpha, or beta.

### `DEV-0.8.0` — Vertical-Slice Technical Hardening

Reserve until the selected vertical slice has the engineering owners, persistence, UI/application boundaries, regression protection, accessibility/input posture, balance instrumentation, and technical hardening required by the selected slice.

This milestone may support `Game 0.2.0-prealpha`, but the game-version gate additionally requires a coherent player-facing vertical-slice experience and human-oriented playthrough acceptance.

### `DEV-0.9.0` — Alpha-Support Technical Readiness

Reserve until the agreed alpha-scope technical owners, persistence, packaging/launch, diagnostics, performance budgets, input/accessibility posture, and repeated external-play support are accepted.

This milestone may support `Game 0.5.0-alpha`; it does not independently declare alpha.

### `DEV-1.0.0` — Release-Engineering Readiness

Reserve for technical release-engineering acceptance: launch-critical owner closure, packaging, saves, performance, accessibility, diagnostics/support posture, and exact candidate validation.

`DEV-1.0.0` is neither identical to nor sufficient for `Game 1.0.0`. Public release requires the separate game-version release gate in `docs/dev/game-version-roadmap-and-acceptance-policy.md`.

## 9. Game-Version Authority

Game-version semantics, timeline, and acceptance criteria are controlled by:

`docs/dev/game-version-roadmap-and-acceptance-policy.md`

The root `GAME_VERSION` file is the canonical current game-version value.

The current accepted value is:

`0.1.0-prealpha`

Do not change `GAME_VERSION` during an ordinary development-milestone run unless that run explicitly includes and satisfies a separate game-version acceptance decision.

## 10. Game-Version Acceptance Rule

A development milestone can advance with no game-version change.

A game version can advance only after a separate player-facing acceptance decision proves a meaningful playable-build delta.

Tests, schemas, architecture, and owner cleanup are necessary evidence where relevant but are insufficient by themselves.

Every proposed game-version change must answer:

> What can the player meaningfully do, complete, understand, or retain in this accepted build that was not meaningfully available in the previous accepted game version?

If there is no decision-complete answer, do not change `GAME_VERSION`.

## 11. Current Crosswalk

| Dimension | Current value | Meaning |
| --- | --- | --- |
| Game version | `0.1.0-prealpha` | First Playable / Early Pre-Alpha |
| Playability | `INTEGRATED_LOOP` | One real bounded multi-system persistent loop exists |
| Development milestone | `DEV-0.7.0` pending | Integrated Gameplay technical band publication/verification |
| World/save version | `worldVersion: 0.1.0` | Persisted world-state compatibility identity; separate |
| Deployment | Sites version 2 | Owner-only preview revision; separate |
| Build | Git SHA | Exact immutable source identity |

## 12. Required Documentation Behavior

Future roadmap, handoff, output, and prompt updates must state, when relevant:

- `Game version: ...`;
- `Game phase: ...`;
- `Playability posture: ...`;
- `Development milestone: ...`;
- exact build/source SHA;
- save/world/data version only when relevant;
- deployment revision only when relevant.

For development runs:

- use `DEV-X.Y.Z` prospectively;
- name the parent for every support suffix;
- state milestone impact;
- do not imply a game-version increment unless a separate game-version gate was accepted.

For game-version changes:

- record the prior version;
- record the player-visible capability delta;
- record exact acceptance evidence/build identity;
- record save/data compatibility consequences;
- record an explicit `GAME_VERSION_ACCEPTED`, `GAME_VERSION_NOT_READY`, or `GAME_VERSION_BLOCKED` result.

## 13. Anti-Inflation Guardrails

Do not:

- use a development milestone number as a player-facing game version;
- allocate a primary development milestone merely because another task started;
- split one coherent implementation into many milestones to imply progress;
- advance `GAME_VERSION` because a schema, validator, test, refactor, audit, deployment, or owner migration completed without a meaningful playable delta;
- call `DEV-0.8.0` a pre-alpha game version;
- call `DEV-0.9.0` an alpha game version;
- call `DEV-1.0.0` the public release without the separate game release gate;
- infer save compatibility from the game version;
- infer game maturity from package or deployment version numbers.

## 14. Current Required Use

The active milestone should now be named:

`DEV-0.7.0 - Integrated Gameplay Systems Band Entry`

If it is accepted:

- record the development milestone as accepted;
- keep `GAME_VERSION` at `0.1.0-prealpha`;
- keep playability at `INTEGRATED_LOOP` unless runtime/playability evidence independently changes it;
- install the unversioned `Game 0.1.x Playability Gap Prioritization Decision`;
- do not allocate the next game patch or next development primary solely because `DEV-0.7.0` closed.
