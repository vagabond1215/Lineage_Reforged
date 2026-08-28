# Connector Preflight - Integrated Gameplay 0.7 Band-Entry Evidence Packet

Date: 2026-08-27

Status: `CONNECTOR_PREFLIGHT_COMPLETE_DECISION_RESERVED_TO_CODEX`

Execution surface: ChatGPT via GitHub Connector; documentation-only/read-only evidence preparation

Source baseline: `cb00c406d079f2c4fb3b018404995780885a9e2a`

Active route: `Integrated Gameplay 0.7 Band-Entry Readiness Decision`

Decision authority reserved to Codex:

- `BAND_ENTRY_READY`; or
- `BAND_ENTRY_NOT_READY`.

This packet must not be cited as the final band-entry decision.

## 1. Purpose

Reduce the next Codex run to milestone judgment and executable verification rather than repository rediscovery.

This packet maps the current accepted `0.7.0` entry criteria to:

- accepted predecessor authority;
- live production owners;
- representative tests;
- current evidence strength;
- exact facts that still require local verification.

It also records stale historical readiness claims that are now superseded and later-band requirements that must not be imported into the `0.7.x` gate.

## 2. Exact 0.7.0 Entry Authority

The controlling milestone authority is:

`docs/design/internal-versioning-and-release-milestone-policy.md`

Section 6.1 requires, in substance:

1. character creation/start state can enter a playable session;
2. authoritative save/load preserves required slice state;
3. travel/movement is engine-owned and participates in the loop;
4. quests/contracts/activities advance beyond selection through an authoritative attempt/result path;
5. at least one consequence-bearing interaction crosses multiple systems;
6. commands, events, synchronization, revision/stale protection, and accepted-only UI application are coherent for the slice;
7. required inventory/resource ownership and typed effects exist for included interactions;
8. deterministic or bounded replay/test coverage and explicit failure behavior exist;
9. remaining demo/UI-authored mutations do not control the milestone loop;
10. known omissions are documented and do not invalidate the integrated loop.

The installed prompt groups these into eight audit questions but does not replace the ten policy bullets above. Codex should evaluate both views as the same gate.

## 3. Accepted Predecessor Authority

The following current facts are no longer merely implementation claims:

### 0.6.11.1 result

`Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

returned:

- `PARENT_ACCEPTED`;
- `REPRESENTATIVE_LOOP_ACCEPTED`.

Hosted acceptance commit:

`6fea077953eb24dbcf27488ea1a037035512cd04`

Accepted implementation:

`3ca23d6864541a899ea61a6bf26257665f754e78`

Independent accepted evidence included:

- fresh removable audit probe `4/4`;
- prescribed matrix `1072/1072`;
- content lint 71 files;
- production Vite build 219 modules;
- bounded TypeScript exact 137-diagnostic registered baseline with no new tuple;
- injection-free production creator path;
- persistence/restart;
- durable duplicate;
- failure/retry and post-plan atomicity;
- v1/v2 mixed survey authority and corruption rejection;
- Normal defeat/recovery preservation.

Codex must verify current-head continuity and may run targeted executable checks, but it does not need to pretend this accepted predecessor never occurred.

## 4. Current Representative Production Chain

Candidate milestone chain:

`createNewGameSnapshot(...)`

-> initial target campaign retention/publication/load

-> canonical Starfall Soundings offer

-> engine-owned quest acceptance

-> accepted tracking + Ashen known access

-> engine-owned travel

-> arrival-owned survey operation/activity

-> real `advanceAshenReefSurveyCaller(...)`

-> engine-owned survey advancement command/result/event/receipts

-> campaign admission

-> publication/load/restart

-> empty-cache durable duplicate.

Principal owners:

| Concern | Current owner/source |
| --- | --- |
| ordinary creator/start state | `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` |
| campaign target/persistence rules | `packages/engines/game-engine/src/campaign-rules.ts` |
| campaign mutation admission | `packages/engines/game-engine/src/campaign-session.ts` |
| save/publication/load | current save manager/persistence owners used by accepted tests |
| quest acceptance | `packages/engines/game-engine/src/player-quest-acceptance.ts` |
| Ashen access consequence | `packages/engines/game-engine/src/ashen-reef-survey-travel-access.ts` |
| travel | `packages/engines/game-engine/src/player-travel.ts` + travel rules |
| survey advancement | `packages/engines/game-engine/src/player-survey-activity-advancement.ts` |
| real caller adapter | `apps/rpg-ui/src/runtime/ashenReefSurveyCaller.ts` |
| accepted-only session application | `apps/rpg-ui/src/runtime/GameSessionContext.tsx` |
| snapshot synchronization | `packages/engines/game-engine/src/gameplay-snapshot-sync.ts` |
| representative integration | `tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs` |

## 5. Criterion Matrix

Status vocabulary here is intentionally **not** the final milestone vocabulary:

- `STRONG_ACCEPTED_PREDECESSOR_EVIDENCE` — accepted current authority strongly supports the criterion, but the band-entry decision still owns the final classification.
- `LOCAL_CURRENT_HEAD_VERIFY` — Codex should verify current-head source/executable continuity before relying on it.
- `SLICE_NOT_REQUIRING_INVENTORY` — inventory is outside this representative interaction, so inventory implementation should not be imported merely to satisfy a generic word in the milestone rule.
- `LATER_BAND_NOT_REQUIRED` — explicit later-band criterion.

### Criterion 1 — creator/start state enters playable session

Candidate evidence:
- production creator used by the accepted injection-free representative test;
- first version-7 publication/load occurs before gameplay mutation;
- ordinary Starfall start obtains the offer through production staging rather than fixture mutation.

Candidate status:
`STRONG_ACCEPTED_PREDECESSOR_EVIDENCE + LOCAL_CURRENT_HEAD_VERIFY`.

Codex should verify:
- production creator path remains unchanged since accepted implementation;
- no post-acceptance documentation commit changed source/tests.

### Criterion 2 — authoritative save/load preserves slice state

Candidate evidence:
- accepted version-7 publication/load/restart before travel, mid-loop, and after completion;
- authority ledger retains request/occurrence/result/receipt graph;
- empty-caller-cache duplicate resolves from durable state;
- correction/projection-repair and Normal defeat/recovery preservation were accepted.

Principal evidence:
- `tests/unit/campaign-persistence-foundation.test.mjs`;
- `tests/unit/player-survey-activity-advancement-persistence.test.mjs`;
- representative integration test.

Candidate status:
`STRONG_ACCEPTED_PREDECESSOR_EVIDENCE + LOCAL_CURRENT_HEAD_VERIFY`.

### Criterion 3 — engine-owned travel participates in loop

Candidate evidence:
- travel command/result owner exists in game engine;
- accepted path travels from Starfall to `location.ashen_reef`;
- accepted arrival owns survey operation/activity;
- redundant destination and compatibility-origin semantics were independently audited.

Principal source:
- `packages/engines/game-engine/src/player-travel.ts`;
- `packages/engines/game-engine/src/player-travel-rules.ts`.

Candidate status:
`STRONG_ACCEPTED_PREDECESSOR_EVIDENCE + LOCAL_CURRENT_HEAD_VERIFY`.

### Criterion 4 — quest/activity advances beyond selection via authoritative result

Candidate evidence:
- quest acceptance is engine-owned;
- survey advancement has typed preparation, plan, command, result, event and rejection codes;
- four survey stages materially advance quest/operation state rather than only select an activity.

Principal source:
- `packages/engines/game-engine/src/player-survey-activity-advancement.ts`.

The result contract includes:
- `accepted`;
- `duplicate`;
- stable code;
- request id;
- persisted result;
- typed consequence receipts;
- projection-pending set;
- emitted events;
- resulting snapshot;
- resulting campaign control.

Candidate status:
`STRONG_ACCEPTED_PREDECESSOR_EVIDENCE + LOCAL_CURRENT_HEAD_VERIFY`.

### Criterion 5 — consequence-bearing interaction crosses multiple systems

The accepted survey advancement is the strongest candidate.

One accepted shift coordinates, under one authoritative owner/result graph:

- clock advancement;
- body/metabolic state;
- player resources;
- use-driven attribute load/stat growth;
- skill progression policy;
- quest progress;
- operation progress;
- current activity;
- discovery;
- Codex behavior where applicable;
- notifications/Chronicle projections;
- typed game event;
- campaign mutation/session control;
- persisted consequence receipts.

Accepted final graph after four shifts:
- 4 requests;
- 4 occurrences;
- 4 results;
- 48 receipts.

Candidate status:
`STRONG_ACCEPTED_PREDECESSOR_EVIDENCE + LOCAL_CURRENT_HEAD_VERIFY`.

Important:
- do not require quest turn-in/rewards to satisfy this criterion if the already accepted survey interaction itself meets the cross-system consequence definition;
- do not count projections alone as the cross-system consequence.

### Criterion 6 — commands/events/sync/stale protection/accepted-only UI are coherent

Candidate evidence:

Survey command owner exposes:
- canonical normalized intent;
- source control/artifact/publication/revision checks;
- wrong-player/account/campaign/control rejection;
- stale revision/snapshot rejection;
- conflicting retry;
- correction/recovery pending rejection;
- transition-failure posture;
- typed event payload.

Real caller:
`apps/rpg-ui/src/runtime/ashenReefSurveyCaller.ts`

returns accepted state only when `result.accepted`.

Real session bridge:
`apps/rpg-ui/src/runtime/GameSessionContext.tsx`

applies:

`if (transition.acceptedState) onSnapshotChange(...)`

and does not apply rejected survey state.

Candidate status:
`STRONG_ACCEPTED_PREDECESSOR_EVIDENCE + LOCAL_CURRENT_HEAD_VERIFY`.

Codex should specifically recheck:
- real caller path remains accepted-only;
- no UI fallback mutates survey advancement independently;
- current event/result identities remain collision-safe for this owner;
- generic legacy event helper defects are not used as the representative authority.

### Criterion 7 — required inventory/resource ownership and typed effects exist for included interactions

The representative survey slice uses player resources but deliberately does not require inventory delivery/consumption.

Accepted survey plan/result owns explicit resource costs and typed affected-owner consequences.

Inventory is an exact non-proposal for the accepted representative survey path.

Candidate interpretation:
`SLICE_NOT_REQUIRING_INVENTORY`.

The milestone wording says **required inventory/resource ownership for the included interactions**, not “implement inventory regardless of slice.”

Codex must decide whether current resource ownership is sufficient for the included survey interaction without importing an unrelated future inventory requirement.

Do not use legacy turn-in or Rivet inventory behavior as milestone evidence.

### Criterion 8 — bounded replay/test coverage and explicit failure behavior

Accepted coverage already includes:

- success;
- malformed/wrong identity;
- stale state/revision;
- incoherent progression;
- wrong location;
- inactive/untracked quest;
- transition failure;
- conflicting retry;
- durable duplicate;
- correction pending;
- recovery pending;
- publication/restart;
- mixed v1/v2 history;
- cross-version corruption;
- projection repair;
- Normal defeat/recovery preservation.

Candidate status:
`STRONG_ACCEPTED_PREDECESSOR_EVIDENCE + LOCAL_CURRENT_HEAD_VERIFY`.

Codex should run only the focused current-head checks needed to ensure no relevant drift has occurred, rather than replaying every historical package solely for volume.

### Criterion 9 — remaining demo/UI-authored mutations do not control milestone loop

The accepted representative path explicitly avoids:
- `demoSnapshot`;
- fixture-side quest injection;
- direct known-location injection;
- direct operation/activity injection;
- direct survey-authority injection.

Survey advancement real caller applies only accepted engine state.

Legacy UI mutation still exists elsewhere, notably turn-in, but it is outside the representative loop.

Candidate status:
`STRONG_ACCEPTED_PREDECESSOR_EVIDENCE + LOCAL_CURRENT_HEAD_VERIFY`.

Codex must distinguish:
- unrelated legacy/UI-authored behavior still present in repository;
- behavior that actually controls the milestone slice.

The milestone policy does not require all legacy UI mutation everywhere in the project to be eliminated before `0.7.0`.

### Criterion 10 — known omissions documented and non-invalidating

Known exclusions are explicitly documented:

- Soundings remains active/unturned-in;
- no quest payout/reward execution;
- no generic quest framework;
- no class compatibility retirement;
- no attribute rebalance;
- no broad travel-key migration;
- no Geographic Knowledge/map/fog system;
- no other Stakes mode;
- no `0.8.x` vertical-slice breadth.

Candidate status:
`LOCAL_DECISION_REQUIRED`.

The band-entry decision must determine whether any one of these is actually mandatory for `0.7.0` rather than merely later work.

## 6. Protected Historical Readiness Reference

Protected ref:

`prep/integrated-gameplay-0-7-readiness-audit`

head:

`59c103c3a06d55f35bffa735fd4b7814dffb583e`

Disposition:
`PROTECTED_REFERENCE`.

It is useful only as historical evidence.

Its earlier major gaps included:
- no campaign continuity/publication authority;
- no survey advancement owner;
- no persisted consequence receipts;
- no restart end-to-end representative loop;
- no correction/supersession;
- no accepted-only advancement caller.

Those gaps were written before accepted `0.6.9`, `0.6.10`, and `0.6.11`.

Do **not** copy its old `0.7 NOT READY` reasoning directly into the current decision.

Still-useful warnings from that branch include:
- generic event identity collision must not become the representative owner;
- legacy turn-in/reward mutation is not authoritative;
- later-band packaging/accessibility/operational requirements must remain separated;
- static content alone does not justify band entry.

## 7. Requirements That Belong To Later Bands

Do not fail the `0.7` gate merely because these `0.8+` requirements remain incomplete:

### 0.8 pre-alpha concerns

- complete bounded adventure/region content breadth;
- agreed combat/inventory/crafting/economy/NPC/service subset;
- hardened accessibility/input posture;
- representative balance and anti-exploit;
- complete vertical-slice placeholder cleanup.

### 0.9 alpha concerns

- target-platform packaging/install/update;
- crash/diagnostic posture;
- stress/performance budgets;
- sustained external testing;
- alpha issue/reset workflow.

### 1.0 release concerns

- launch scope completion;
- release-candidate QA;
- support/legal/privacy/operational acceptance;
- release documentation and rollback posture.

These are explicitly later maturity gates.

## 8. Exact Current-Head Checks Recommended For Codex

The band-entry decision is docs-first and should avoid a wasteful full implementation rerun.

Recommended local current-head checks:

1. verify clean synchronized `master`;
2. inspect complete source/test delta from accepted implementation `3ca23d6...` through current head and confirm no representative production/test drift;
3. run the representative ordinary-reachability integration test;
4. run the survey advancement command/persistence focused tests;
5. run the campaign persistence focused tests covering publication/restart and Normal defeat/recovery;
6. source-check real caller accepted-only application;
7. verify current active prompt/output/handoff and hosted identity;
8. recheck relevant branch/PR refs as required by repository policy.

Only expand validation if one of those checks exposes drift or ambiguity.

The decision prompt may require additional validation; that controlling requirement still applies.

## 9. Current Post-Audit Documentation Delta

The accepted audit was published at:

`6fea077953eb24dbcf27488ea1a037035512cd04`.

Subsequent Connector changes before this packet are documentation-only:

- corrected the invalid audit-output SHA to the real pre-audit handoff identity;
- added this preflight plan.

No production or tracked test change is introduced by this preflight.

Codex should inspect the full delta from `6fea077...` to its local head and verify that statement rather than rediscovering older implementation changes.

## 10. Candidate Decision Pressure Points

The likely decision turns on interpretation of the milestone gate rather than missing repository discovery.

Codex should explicitly answer:

1. Does the accepted survey advancement count as the required cross-system consequence-bearing interaction even though quest turn-in/rewards remain deferred?
2. Does “required inventory/resource ownership” require inventory only when the included interaction uses inventory, or does it impose inventory implementation universally?
3. Do unrelated legacy UI mutation paths invalidate the gate, or only legacy mutation that controls the representative milestone loop?
4. Are any documented omissions mandatory `0.7` entry blockers under the actual milestone policy rather than `0.8+` concerns?

These are decision questions for Codex against accepted authority, not questions requiring new product canon.

## 11. Failure-Pattern Mapping

At minimum the active decision should apply:

- `FP-001` — real caller versus helper/fixture evidence;
- `FP-002` — green tests do not replace semantic inspection;
- `FP-008` — branches/Connector artifacts remain evidence only;
- `FP-009` — distinct inspected/decision/coordination/pushed identities;
- `FP-013` — nested accepted authority survives later persistence/recovery;
- `FP-014` — do not collapse distinct owner/projection concepts;
- `FP-017` — fixture eligibility is not representative reachability.

Additional relevant accepted predecessor patterns:
- `FP-005` request identity/retry;
- `FP-011` provenance before mutation;
- `FP-012` deep validation.

## 12. Connector Disposition

`PREFLIGHT_COMPLETE_DECISION_RESERVED_TO_CODEX`

This packet provides no final milestone classification.

It does not:
- assign `0.7.0`;
- install a `0.7.0` implementation;
- declare `BAND_ENTRY_READY`;
- declare `BAND_ENTRY_NOT_READY`;
- change production/tests/content/schema;
- reopen turn-in/reward work;
- mutate protected evidence refs.
