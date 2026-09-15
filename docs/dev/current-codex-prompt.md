# Soundings Return, Submission, Payment, And Durable Completion Implementation

Date: 2026-09-14

Label class: bounded current-band implementation; parent: unversioned owner-contract decision.

Development milestone impact: `none unless separately accepted later`; game-version impact: `none in this run`.

Game version: `0.1.0-prealpha`; playability: `INTEGRATED_LOOP`; accepted milestone: `DEV-0.7.0`; current band: `DEV-0.7.x`.

Package class: bounded `M`.

Source decision head: `85747b5fbd2202d2730e6fa27b4547d78423a46c`.

Controlling authorities:

- `docs/design/quest-turn-in-completion-and-consequence-receipt-owner-contract-decision.md`;
- `docs/design/soundings-return-submission-and-payment-authored-terms-decision.md`;
- `docs/design/game-0.1.x-playability-gap-prioritization-decision.md`;
- `docs/design/ui-information-architecture-boundary.md`.

## Objective

Implement one bounded authoritative closure for **Soundings of Ashen Reef**:

complete survey
→ return from Ashen Reef to Starfall Port
→ submit at the Starfall Harbormaster's Office
→ complete quest
→ receive exactly 5 gold
→ durable Chronicle/history result
→ save/restart
→ durable duplicate with no replay.

This run requires a synchronized local repository, executable tests, build/type validation as scoped below, commit, push, and post-push verification.

## Repository And Orientation

Work only in `vagabond1215/Lineage_Reforged`.

Follow `AGENTS.md`, repository-first protocol, current prompt/output/handoff, resource-slicing policy, branch policy/register, and failure-pattern guardrails.

Fetch/prune, synchronize clean `master`, inspect the delta from `85747b5fbd2202d2730e6fa27b4547d78423a46c` to live head, and fail closed on material drift affecting the owner contract.

Reuse accepted DEV-0.7.0 and playability evidence; do not redo broad repository discovery without contradictory drift.

## Accepted Product Terms

Preserve exactly:

- submission: Starfall Harbormaster's Office, Starfall Port;
- Duty Harbormaster remains a role, not a named person;
- packet is retained survey evidence, not an inventory item;
- Ashen Reef → Starfall Port return is 4 ticks with no fare;
- do not make the Ashen return cost a universal Starfall cost;
- immediate accepted submission/completion/payment;
- payment is exactly 5 gold, 0 silver;
- no standing, reputation/fame, turn-in skill gain, item, service/access, or salvage consequence;
- one-time-per-campaign;
- durable Chronicle/history consequence;
- Stormglass remains incidental;
- duplicate/retry cannot pay or complete twice.

## Required Implementation

### 1. Return travel

Keep `player-travel.ts` as the sole travel/movement/clock/body owner.

Add only the narrow route-aware support needed for:

`location.ashen_reef -> settlement.starfall_port`

The route must use the existing travel command and existing travel/body mechanics.

Do not encode a global four-tick Starfall destination rule for unrelated origins.

Share/derive the existing Ashen maritime travel profile rather than creating an unrelated second return-balance system.

Add focused tests proving:
- the accepted Ashen return succeeds at 4 ticks;
- unrelated origins do not inherit that route accidentally;
- existing stale/wrong-origin/malformed travel protections remain intact.

### 2. Quest-specific turn-in owner

Add one engine-owned Soundings turn-in module. Do not create a generic reward DSL or all-quests framework.

Implement stable:
- command/request identity;
- normalized intent fingerprint;
- occurrence identity;
- result identity;
- consequence receipt identities;
- rejection codes;
- durable duplicate classification.

Readiness must require:
- active Soundings quest;
- valid Starfall submission context;
- complete semantically valid retained four-shift survey authority;
- no required pending/conflicting survey repair;
- no prior conflicting turn-in authority.

UI objective flags alone are insufficient.

### 3. Durable authority

Extend the campaign authority-ledger family with one optional, versioned Soundings turn-in container as specified by the owner contract.

Keep it separate from `ashenReefSurvey` field-work authority.

Persist:
- requests;
- accepted occurrences;
- results;
- consequence receipts;
- only the projection-repair state actually required.

Update strict shared types, campaign validation, serialization/migration/default handling, TS/JS bridges and tests as required.

Do not change `worldVersion` merely to align labels. If a persisted migration/version change is actually required, prove and document it rather than assuming it.

### 4. Atomic completion and payment

One accepted turn-in must atomically:

- complete/turn in Soundings;
- clear tracking when Soundings is tracked;
- never auto-select another quest by array order;
- add exactly 5 gold and 0 silver;
- record exactly one durable currency-credit receipt;
- close/remove the Soundings operation as specified;
- transition current activity to post-submission presentation;
- append one completion Chronicle projection;
- append one success notification projection;
- preserve survey authority and Stormglass.

No excluded reward category may change.

The turn-in owner is the bounded transaction coordinator for this first currency consequence. Do not create arbitrary direct-wallet permission elsewhere.

### 5. Retry / failure semantics

Required rejection/duplicate coverage:

- malformed command;
- wrong player/campaign;
- stale snapshot/revision;
- wrong location;
- quest missing/not active/already consumed;
- incomplete survey;
- malformed/deeply incoherent survey authority;
- pending/conflicting survey repair;
- same request identity with conflicting normalized intent;
- conflicting retained turn-in receipt graph;
- exact durable duplicate;
- duplicate after restart;
- duplicate after later unrelated accepted mutation.

Every rejection before durable acceptance must preserve the original snapshot. No partial payment/completion/projection cleanup is allowed.

### 6. Real caller and accepted-only UI

Add a real runtime caller using campaign/session admission.

Expose `acceptedState` only after accepted mutation.

Update `GameSessionContext.tsx` to apply only accepted state.

Migrate the real Soundings turn-in path in `apps/rpg-ui/src/features/QuestsPanel.tsx` away from legacy `turnInQuest(snapshot,...)`.

Legacy Soundings handling in `gameplayLoop.ts` must be removed from the real path or retained only as clearly unreachable characterization. Avoid unrelated Rivet rewrites.

### 7. Targeted UI only

Honor the refined UI design intent without attempting the broad shell redesign.

This slice may change only what is needed to make the completed loop understandable:

- truthful Starfall return affordance;
- packet-ready / return-next state;
- exact turn-in blocker state;
- one authoritative Submit/Turn In action;
- 5-gold + completion preview/result;
- completion Chronicle result.

Reconcile stale current runtime/content presentation that still says exact Soundings turn-in terms are deferred. At minimum inspect:

- `packages/engines/game-engine/src/ashen-reef-survey-content.ts`;
- `packages/engines/game-engine/src/ashen-reef-survey-offer-staging.ts`;
- `apps/rpg-ui/src/runtime/demoSnapshot.ts`;
- `packages/content/base/civilization/quest_definitions.json`;
- matching focused tests and any other current user-visible publisher discovered from those owners.

Current runtime/content presentation must reflect the accepted 5-gold terms where it is user-visible or consumed by current runtime presentation. Preserve historical decision/audit wording as historical evidence; do not rewrite older records merely because later accepted authority closed the deferral.

Prefer presentation compatible with a future contextual inspector/next-action column.

Do not rebuild the top bar, left rail, Home, World shell, map system, Character, Activity, Codex, or Chronicle architecture in this package.

## Focused Validation

At minimum run:

1. existing ordinary reachability integration;
2. existing player-travel focused tests;
3. new return-route tests;
4. new Soundings turn-in command/authority tests;
5. persistence/campaign-admission tests covering the new ledger;
6. accepted-only caller/UI source guards;
7. a new ordinary end-to-end integration covering:
   creator/start
   → offer/acceptance
   → Ashen travel
   → four shifts
   → restart
   → Starfall return
   → turn-in
   → exactly +5g
   → quest completed
   → restart
   → durable duplicate
   → continued play;
8. Node-side UI configuration typecheck;
9. targeted UI/type checks for changed files;
10. direct current Vite production build or equivalent current build path;
11. `git diff --check` and clean final status.

The broad UI TypeScript baseline is known non-green. Do not silently claim it is green and do not mix broad cleanup into this package. Characterize changed-file impact explicitly.

Apply FP-001, FP-002, FP-009, FP-013, FP-014, FP-017 and any persistence/branch guardrails required by live source.

## Acceptance Result

Return exactly one implementation disposition:

- `IMPLEMENTED_PENDING_INDEPENDENT_ACCEPTANCE`; or
- `IMPLEMENTATION_BLOCKED`.

On success:

- record exact implementation commit and validation evidence;
- keep `GAME_VERSION` at `0.1.0-prealpha`;
- keep `DEV-0.7.x` current without auto-allocating `DEV-0.7.1`;
- install a separate **Soundings Durable Completion Independent Acceptance Audit**;
- do not issue a game-version acceptance decision in this run.

On blockage, identify the exact failed contract and install only the smallest coherent repair/decision.

Commit only intended changes, push `master`, fetch/prune, verify local/tracking equality, retrieve hosted current prompt/output/handoff, and finish clean.
