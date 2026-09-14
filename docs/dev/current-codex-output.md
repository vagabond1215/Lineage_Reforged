# Current Codex Output

Date: 2026-09-14

Source run: `Quest Turn-In Completion And Consequence Receipt Owner Contract Decision`.

Label class: unversioned technical owner-contract decision; parent: not applicable.

Development milestone impact: `none`; game-version impact: `none`.

Game version: `0.1.0-prealpha`; phase: Early Pre-Alpha / First Playable; playability: `INTEGRATED_LOOP`.

Accepted development milestone: `DEV-0.7.0`; current band: `DEV-0.7.x`.

Disposition: `OWNER_CONTRACT_ACCEPTED`.

## A. Decision

Created:

`docs/design/quest-turn-in-completion-and-consequence-receipt-owner-contract-decision.md`

The contract is decision-complete for one bounded implementation.

Key ownership decisions:

- existing `player-travel.ts` remains the sole movement/time/body authority;
- add only route-aware Ashen Reef → Starfall Port facts within the existing travel-rules boundary;
- do not make the four-tick Starfall return cost universal from unrelated origins;
- first turn-in owner is quest-specific to Soundings rather than a generic reward framework;
- journal completed state is not payment proof;
- add a separate optional Soundings turn-in authority ledger with stable request/occurrence/result/consequence receipt identity;
- the new turn-in owner atomically coordinates completion, exact 5-gold credit, tracking cleanup, survey-operation closure, post-submission activity and projections;
- the durable currency-credit receipt proves payment delivery; wallet amount alone does not;
- exact retry after restart is a durable duplicate and cannot replay payment;
- conflicting request identity/intent or retained receipt graphs fail closed;
- all accepted survey authority and Stormglass remain preserved;
- real UI must use a production caller and accepted-only session application;
- the legacy Soundings `turnInQuest(...)` UI path is characterization only after migration.

## B. UI Design Intent

Updated:

`docs/design/ui-information-architecture-boundary.md`

The user-supplied concept is now reflected as accepted target composition guidance:

- compact global top band;
- richer but compact left character/navigation rail;
- one main domain workspace;
- within the main workspace: one dominant work surface, one contextual inspector/action column and one bounded supporting history/notes strip;
- World is the preferred first future shell-migration domain;
- dense grounded medieval-fantasy cartographic/administrative presentation rather than a generic card dashboard;
- player-facing debug/source-reference surfaces should progressively leave normal presentation;
- migrate incrementally by real gameplay slice;
- broad shell rebuild is deferred as implementation, not deferred as design intent.

The Soundings implementation may add only targeted return/readiness/turn-in/result affordances compatible with this future shell direction.

## C. Scope And Validation

This owner-contract/UI-intent pass was performed through remote repository-aware documentation writes.

No production code, tracked tests, schemas, saves, dependencies, assets, deployment, `GAME_VERSION`, or `worldVersion` were changed.

No local tests, builds, typechecks, browser execution, or local worktree synchronization are claimed.

Owner-contract decision commit: `85747b5fbd2202d2730e6fa27b4547d78423a46c`.

UI design-intent refinement commit: `864a727b4d5e7980b867adab931ad04840131fcc`.

Implementation prompt installation commit: `eedbec899d7b1908caf27b83016be9a35705ea5a`.

## D. Next Route

Active route:

**Soundings Return, Submission, Payment, And Durable Completion Implementation**

Package class: bounded `M`.

The implementation requires a synchronized local repository, executable tests/build validation, commit/push and post-push verification.

On successful implementation, install a separate **Soundings Durable Completion Independent Acceptance Audit**.

No `DEV-0.7.1` or game-version increment is allocated. `GAME_VERSION` remains `0.1.0-prealpha`.
