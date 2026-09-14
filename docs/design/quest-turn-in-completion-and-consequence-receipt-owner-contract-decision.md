# Quest Turn-In Completion And Consequence Receipt Owner Contract Decision

Date: 2026-09-14

Status: `OWNER_CONTRACT_ACCEPTED`

Label class: unversioned technical owner-contract decision; parent: not applicable.

Development milestone impact: `none`; game-version impact: `none`.

Accepted milestone: `DEV-0.7.0`; current band: `DEV-0.7.x`; Game `0.1.0-prealpha`; playability: `INTEGRATED_LOOP`.

Accepted authored prerequisite: `docs/design/soundings-return-submission-and-payment-authored-terms-decision.md`, `AUTHORED_TERMS_ACCEPTED`.

UI design authority: `docs/design/ui-information-architecture-boundary.md`, including the 2026-09-14 concept-derived gameplay-shell refinement.

## 1. Decision

The first authoritative quest turn-in remains **quest-specific**.

Implement one bounded Soundings closure package rather than a generic quest-reward framework.

The authoritative player path becomes:

completed four-shift Soundings evidence
→ authoritative Ashen Reef → Starfall Port return through existing player-travel ownership
→ valid Starfall submission context
→ one engine-owned Soundings turn-in command
→ exact durable completion/consequence receipts
→ quest completed
→ 5-gold payment delivered exactly once
→ Chronicle/notification projection
→ save/restart
→ durable duplicate with no replay.

No additional product/canon decision blocks implementation.

## 2. Return-Travel Ownership

### 2.1 Existing travel engine remains sole movement owner

`packages/engines/game-engine/src/player-travel.ts` remains the authority for:

- travel command identity;
- stale player/snapshot/origin validation;
- travel clock advancement;
- body/metabolic/attribute-load processing;
- resource application;
- location mutation;
- travel completion event;
- gameplay snapshot synchronization.

The quest turn-in owner must **not** directly teleport the player to Starfall or mutate travel time.

### 2.2 Bounded route-aware return facts

The current destination-only table cannot safely represent “Starfall costs four ticks from Ashen Reef” as a universal Starfall fact.

The implementation may add the smallest route-aware resolver inside the existing player-travel-rules boundary for exactly:

`location.ashen_reef -> settlement.starfall_port`

Required return facts:

- destination identity: `settlement.starfall_port`;
- settlement: `settlement.starfall_port`;
- region: `region.starfall_isle`;
- site/presentation context: Starfall Port / Harbormaster-facing arrival;
- travel ticks: **4**;
- monetary fare: none;
- availability: only from the accepted Ashen return context in this package.

Do not make those facts the cost of traveling to Starfall from unrelated origins.

Reuse the existing Ashen maritime travel/body-risk machinery rather than creating a second clock or a quest-owned travel simulation. The implementation should share/derive the outbound Ashen travel profile rather than create unrelated return-balance constants.

The ordinary World/travel UI continues to invoke the existing player-travel command.

## 3. Soundings Turn-In Owner

Add one game-engine owner dedicated to the current contract, preferably a narrowly named module such as:

`player-soundings-turn-in.ts`

The name is illustrative; repository conventions control the final filename.

Do not widen the first owner into a universal reward DSL, generic Quest/Mission/Order/Favor command, or generic transaction framework.

## 4. Durable Authority Ledger

Journal state alone is not proof that payment was delivered.

Extend the existing campaign authority-ledger family with one optional quest-specific Soundings turn-in authority container.

Recommended shape:

`CampaignAuthorityLedgerState.soundingsTurnIn?: SoundingsTurnInAuthorityState`

with versioned arrays for:

- requests;
- accepted occurrences;
- results;
- consequence receipts;
- projection-repair records only where needed for restart/idempotent repair.

Do not merge these receipts into the existing `ashenReefSurvey` advancement ledger. Survey field-work authority remains complete historical evidence; turn-in is a later transaction with distinct identity.

Do not create a generic all-quests reward ledger yet.

## 5. Command / Request Contract

The first command should identify at minimum:

- command/request type for Soundings turn-in;
- stable command id;
- command sequence or equivalent deterministic collision input;
- player id;
- campaign/continuity identity where required by existing campaign admission;
- fixed runtime quest id `quest.ashen_reef_survey`;
- expected tick;
- expected snapshot version;
- expected snapshot revision;
- expected current location identity;
- normalized intent fingerprint;
- retained survey-evidence fingerprint/version facts sufficient to reject drift or substitution.

The command must be self-consistent and collision-safe.

Same request identity with changed normalized intent is a conflict, never a duplicate.

## 6. Readiness Contract

Accepted turn-in readiness requires all of the following:

1. the Soundings quest exists and is active;
2. the one-time contract has not already been completed/consumed;
3. the player is in the accepted Starfall Port submission context;
4. retained Ashen survey authority exists and is semantically valid;
5. all four accepted field-work stages are complete in the required order;
6. the final packet-complete state is present;
7. no survey correction/reconciliation required for authoritative completion is pending;
8. retained survey requests/occurrences/results/receipts are coherent under the accepted survey validator rules;
9. campaign/session admission accepts the mutation;
10. no conflicting Soundings turn-in request/result/receipt graph already exists.

Do not accept readiness from:
- UI objective checkmarks alone;
- `category: completed`;
- a presentation string such as “Survey Packet Ready”;
- an inventory packet item;
- the legacy Saltmere turn-in helper.

## 7. Accepted Result And Occurrence Identity

An accepted result must expose stable identities for:

- command/request;
- turn-in occurrence;
- result;
- quest-completion receipt;
- 5-gold currency-credit receipt;
- operation/activity/tracking consequence receipts where they are treated as authoritative state changes;
- Chronicle/notification projection identities or repair records where required.

The result should return one synchronized accepted snapshot plus typed result facts.

Rejected results return the original snapshot unchanged.

## 8. Atomic Consequence Contract

The Soundings turn-in owner is the bounded transaction coordinator for this first quest.

On one accepted submission, atomically:

1. mark the quest completed/turned in;
2. remove the completed quest from active/tracked ownership as required by synchronization;
3. **clear tracking if Soundings is tracked; do not auto-select another quest by array order**;
4. deliver exactly **5 gold, 0 silver**;
5. close/remove the Soundings survey operation as appropriate;
6. transition current activity away from field survey/return-packet posture to a completed Starfall submission presentation;
7. append one completion Chronicle projection;
8. append one completion notification projection;
9. preserve all retained survey authority and Stormglass discovery state;
10. synchronize the gameplay snapshot.

No standing, fame/reputation, skill, item, service/access, or salvage consequence may be emitted or applied.

### 8.1 Currency boundary

No reusable wallet command/receipt owner currently exists.

For this first bounded consumer:

- the turn-in owner may apply the authored 5-gold credit atomically to the existing player wallet state;
- the delivery must be represented by a typed, durable `currency_credit` consequence receipt in the Soundings turn-in ledger;
- the receipt, not the post-hoc wallet amount alone, proves delivery;
- duplicate processing consults durable authority before any currency mutation.

This is a quest-specific first consumer, not authorization for arbitrary direct wallet writes elsewhere. A reusable wallet-consequence owner may be extracted later when another materially different accepted consumer justifies it.

## 9. Projection Contract

### Quest journal
Project the Soundings row to completed/turned-in.

### Tracking
If Soundings is currently tracked, clear `trackedQuestId`. Do not choose the “first remaining active quest” automatically.

### Operation/activity
Remove or close `operation.quest.ashen_reef_survey` and replace the return-packet activity with a completed-submission presentation derived from the accepted result.

### Chronicle
Append one durable completion entry derived from accepted authority. It should communicate:
- Soundings submitted at Starfall;
- contract completed;
- payment received: 5 gold.

It must not claim standing, fame, salvage, item, or skill rewards.

### Notification
Project one concise success notice from the accepted result.

Chronicle and notification rows are projections, not transaction identity.

If projection repair is necessary after accepted authority is already durable, repair the missing/misordered projection without replaying quest completion or payment.

## 10. Duplicate, Retry, Conflict, And Rejection

Required behavior:

- exact accepted request retry after restart → durable duplicate/current accepted result, no mutation replay;
- exact retry after later unrelated accepted mutation → return current/latest valid snapshot without re-paying;
- same request id with different normalized intent → conflict rejection;
- malformed command → reject unchanged;
- wrong player/campaign → reject unchanged;
- stale snapshot/revision → reject unchanged;
- wrong location → reject unchanged;
- quest missing/not active/already consumed → reject unchanged except exact durable duplicate classification;
- incomplete or malformed survey evidence → reject unchanged;
- pending/conflicting survey correction → reject unchanged;
- conflicting retained turn-in receipt graph → fail closed;
- transition/application failure before durable acceptance → original source state unchanged.

No failure path may partially:
- add currency;
- complete the quest;
- remove survey authority;
- remove the operation;
- append completion Chronicle;
- append success notification.

## 11. Survey Authority Preservation

Completion must preserve the accepted survey graph exactly except for separately authorized turn-in authority:

- four survey requests;
- four occurrences;
- four results;
- 48 survey consequence receipts;
- content/material version facts;
- ordered stages;
- accepted non-proposals;
- correction/repair history;
- incidental Stormglass discovery;
- nested owner state preserved by survey persistence contracts.

Turn-in must not rewrite survey receipts into generic quest receipts or consume them as if the packet were an inventory object.

## 12. Campaign Admission And Persistence

The real caller must submit the candidate accepted mutation through the existing campaign/session admission and publication boundary used by current authoritative gameplay.

The implementation must prove:

- accepted mutation publication;
- save/restart with completed quest and +5 gold;
- exact turn-in authority survives serialization;
- survey authority remains intact;
- no re-offer after completion;
- durable duplicate after an empty caller cache/restart;
- no replay of payment, completion, Chronicle, or operation cleanup.

Any shared schema/campaign-rule change needed for the new authority ledger must be narrow, version-compatible, and validated in the same implementation package.

Do not change `worldVersion` merely because a new optional authority owner is added unless executable migration evidence independently proves it is required.

## 13. Real Caller And UI Boundary

Add a real runtime caller analogous in responsibility to the accepted survey caller.

The caller must:

- create/submit the authoritative engine command;
- use campaign/session admission;
- retain request identity only according to accepted result semantics;
- expose accepted/rejected facts for presentation;
- expose `acceptedState` only after accepted campaign mutation;
- never treat UI success text as acceptance.

`GameSessionContext.tsx` should apply the returned snapshot only when `acceptedState` is present.

`apps/rpg-ui/src/features/QuestsPanel.tsx` must stop invoking the legacy `turnInQuest(snapshot, ...)` path for Soundings.

Legacy `apps/rpg-ui/src/game-shell/gameplayLoop.ts` Soundings turn-in code becomes characterization-only and should be removed or made unreachable from the real Soundings path. Do not disturb the Rivet legacy turn-in beyond what a source guard or safe extraction requires.

## 14. Targeted UI Contract

Use the refined UI design intent without attempting the broad shell migration.

For this slice the ordinary UI needs only enough to:

- make Starfall a truthful reachable return destination from Ashen Reef;
- show packet readiness and the current “return to Starfall” next action;
- show exact turn-in blocker facts when not ready or not in Starfall;
- enable one authoritative Submit/Turn In action at the accepted context;
- preview the authored consequence as **5 gold** and quest completion, with excluded rewards absent;
- show the accepted completion result and Chronicle entry.

Prefer contextual-inspector/next-action presentation compatible with the future World/Quest shell composition.

Do not redesign the entire top bar, left rail, World map, Home, Character, Activity, Codex, or Chronicle surfaces in this package.

## 15. Focused Validation Contract

The implementation package must include focused tests for at least:

### Return travel
- Ashen Reef → Starfall Port resolves through existing travel ownership at 4 ticks;
- unrelated origin → Starfall does not inherit the Ashen 4-tick route by accident;
- stale/wrong-origin/malformed travel remains rejected;
- return travel preserves existing travel clock/body/persistence semantics.

### Turn-in command
- accepted success from exact ready Starfall state;
- quest missing;
- quest not active;
- already consumed;
- wrong location;
- incomplete packet;
- malformed survey authority;
- pending/conflicting survey repair;
- wrong player/campaign;
- malformed command;
- stale snapshot/revision;
- same request id/conflicting intent;
- exact durable duplicate;
- duplicate after restart;
- duplicate after later unrelated accepted mutation;
- conflicting retained receipt graph.

### Consequences
- wallet increases by exactly 5 gold and 0 silver;
- currency receipt exists exactly once;
- no standing/reputation/skill/item/service/salvage mutation;
- quest completed;
- tracking cleared only when it was Soundings;
- operation/activity transition correct;
- one Chronicle completion projection;
- one success notification projection;
- survey authority and Stormglass preserved.

### Ordinary end-to-end path
creator/start
→ accepted offer
→ Ashen access
→ travel
→ four survey shifts
→ restart
→ return to Starfall
→ turn in
→ 5g/completion
→ save/restart
→ durable duplicate
→ continued ordinary play.

The end-to-end proof must use production callers and no demo/eligibility/packet injection.

## 16. Failure-Pattern Guardrails

Apply at minimum:

- FP-001 — real caller path;
- FP-002 — failure sequence beyond green happy-path tests;
- FP-009 — exact source/publication identity;
- FP-013 — nested-owner preservation;
- FP-014 — deep semantic validation;
- FP-017 — ordinary injection-free acquisition.

Add branch and persistence guardrails required by live source.

## 17. Package Classification

The resulting implementation is one bounded **M** package, not a repository-wide feature.

It may touch:
- shared authority-ledger types/validation/migration only as required;
- shared event type;
- player travel rules for the exact return route;
- one new Soundings turn-in engine owner;
- engine export/JS bridges;
- gameplay snapshot synchronization if required;
- campaign admission validation;
- one real runtime caller and GameSessionContext bridge;
- targeted Quests/World affordance;
- focused unit/integration tests;
- current coordination docs after executable completion.

No generic reward framework, inventory work, NPC work, broad shell redesign, broad TypeScript cleanup, or unrelated quest migration belongs in this package.

## 18. Disposition And Successor

`OWNER_CONTRACT_ACCEPTED`

The contract is decision-complete for one bounded local implementation.

Install next:

**Soundings Return, Submission, Payment, And Durable Completion Implementation**

The implementation requires Codex/local repository execution and executable validation.

After implementation, run an independent production-read-only acceptance audit before any game-version decision.

No `DEV-0.7.1` or game-version increment is allocated here. `GAME_VERSION` remains `0.1.0-prealpha`.
