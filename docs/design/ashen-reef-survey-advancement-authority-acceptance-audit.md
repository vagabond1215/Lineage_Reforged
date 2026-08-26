# Ashen Reef Survey Advancement Authority Acceptance Audit

Date: 2026-08-10

Source run: `Version 0.6.10.1 - Ashen Reef Survey Advancement Acceptance Audit`

Parent version: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Label class: support suffix

Milestone impact: `supports_current_band`

Inspected implementation: `008db9c93eb8818aea51652be07fd196df41c45f`

Audit starting head: `5f018b499b9e8c2feb31a75beec6b1f1b9b4e5e1`

Decision: `REPAIR_REQUIRED`

Representative-loop classification: blocked; no acceptance classification is made while parent authority is unaccepted

## 1. Decision

Parent `0.6.10` is not accepted. The bounded engine-owned survey path, persistence, duplicate handling, owner application, and positive recovery behavior are substantially implemented and their prescribed regressions remain green, but independent adversarial execution proved three authority defects. Source inspection also confirmed three caller/contract omissions. The active repair is `Version 0.6.10.2 - Ashen Reef Survey Advancement Authority Repair`.

No production source, shared contract, tracked test, serializer, migration, content, asset, dependency, branch, or pull-request state was changed by this audit. Temporary probes were removed before coordination commit.

## 2. Confirmed Findings

| ID | Contract | Finding | Exact current seam | Required repair evidence |
| --- | --- | --- | --- | --- |
| AR-001 | 1, 3 | Persisted normalized owner inputs are not deeply validated or fully canonicalized. Replacing `progression` and `reputation` with `{}` and recomputing the stored canonical string still validates as target authority. Nested object key order is also preserved rather than normalized. | `campaign-rules.ts` owner-input validation and canonical serializer | Deep semantic validation for every retained owner input; recursively deterministic canonical serialization; malformed and reordered-key probes. |
| AR-002 | 9 | A correction with the complete owner reconciliation set but `evidenceIds: []` validates, despite the accepted explicit reason/evidence contract. | `campaign-rules.ts` correction validation | Require one or more unique nonblank evidence ids and reject empty/malformed evidence without mutation. |
| AR-003 | 8 | Projection repair assumes destination order. At a capped, valid-but-reordered notification destination, same-tick repair prepends and truncates, evicting a newer retained row. The helper also lacks the required `(appliedTick, stable resultId)` tie-break. | `player-survey-activity-advancement.ts` projection ordering, retention, and insertion helpers | Order from derived authority rather than array position; stable result-id tie-break; reordered-cap, same-tick, newer-destination, and permutation tests for notification and Chronicle. |
| AR-004 | 10 | The real caller mints and retains a request id before command creation, but `GameSessionContext` collapses every creation exception to `null`; `ActivityPanel` returns without classifying or clearing that id. Invalid-authority/domain failures therefore retain identity as though they were technical pre-accept retries. | `ActivityPanel.tsx` and `GameSessionContext.tsx` | Typed preparation rejection/result; retain identity only for the explicit technical retry code; real-caller invalid-authority and technical-failure tests. |
| AR-005 | 6 | The permanent affected-owner matrix requires explicit `no_proposal` for geographic Knowledge/known-location/map authority. Current plan/result/receipt authority proves selected state stayed unchanged but carries no explicit non-effect fact. | survey plan/result contracts and command result construction/validation | Add one explicit result-level non-effect contract without inventing owner receipts; validate exact no-proposal scope and unchanged Knowledge/location/map/travel/reward surfaces. |
| AR-006 | 5, 10 | The panel renders every zero skill delta as “blocked at breakthrough gate,” although maximum-rank policy can return zero delta with `blockedGate: null`; engine projection correctly calls that case unchanged. | `ActivityPanel.tsx` survey preview detail | Render applied, blocked, and unchanged as distinct states and test the maximum-rank caller presentation. |

`AR-001`, `AR-002`, and `AR-003` were reproduced in an independent removable executable probe. `AR-004` through `AR-006` were reverified directly against the real caller, accepted decision, and current source. These are material under the active prompt; green implementation tests do not override them.

## 3. Evidence That Passed

The same independent probe confirmed:

- all four coherent stages use one plan and preserve source bytes;
- exact two-tick body/resource projection parity;
- a durable duplicate after a later accepted mutation returns original evidence with the latest snapshot and emits nothing;
- malformed receipt data fails closed without throwing;
- an unrelated continuity edge cannot authorize a legacy baseline;
- preparation cannot commit a candidate without its exact survey graph;
- pending event repair emits once and terminal retry is idempotent;
- non-empty survey authority survives later pending Normal defeat and completed recovery.

Repository validation reproduced:

- survey characterization/command/persistence: `25/25` passed;
- the required focused and adjacent group: `167/167` passed;
- additional Knowledge evidence boundary coverage: `76/76` passed;
- RPG UI production build: Vite `5.4.21`, `211` modules transformed, success with only the existing large-chunk advisory;
- bounded TypeScript audit: exact registered baseline `137` diagnostics, with only the same two pre-existing touched `ActivityPanel` diagnostics and no survey/campaign/contract/save/context/defeat diagnostic;
- raw serialization, version-7 publication/restart, version-6 migration, forwarding/public exports, browser build, real-caller guards, and Normal-defeat preservation through the focused suites.

The positive matrix establishes that the repair should be narrow. It does not make the failed contracts acceptable.

## 4. Branch, Pull Request, And Evidence Disposition

The audit fetched/pruned and began from clean synchronized `master == origin/master` at `5f018b499b9e8c2feb31a75beec6b1f1b9b4e5e1`. It inspected one local branch, 36 non-default remote branches, the four exact survey evidence refs, the protected integrated-gameplay readiness ref, and both open pull requests.

PR #2 remains open non-draft at `e78dc645cfb658685be12f45f46d34b7c0da1119`; PR #3 remains open draft at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`. Both remain `SUPERSEDED_PRESERVE_EVIDENCE`. The four Connector refs remain `CANDIDATE_INTEGRATION` for their broader consumers; the readiness and prompt-packaging refs remain `PROTECTED_REFERENCE`. No integration, mutation, closure, or deletion was due.

## 5. Representative-Loop And Milestone Posture

No `REPRESENTATIVE_LOOP_ACCEPTED` or `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE` classification is issued because the parent contract failed. Independently, current creator state does not organically supply the survey quest/activity/location eligibility chain; the fresh-character survey test injects those facts. That reachability limitation must be reconsidered only after `0.6.10.2` is implemented and independently accepted.

`0.7.0` remains `NOT_READY`. Survey turn-in/rewards, inventory, rest, generic activity infrastructure, other Stakes modes, cloud/checkpoint/death/succession work, and geographic Knowledge/map implementation remain excluded.

## 6. Applicable Failure Patterns

- `FP-001`: the real caller exposed request-retention and presentation defects absent from helper tests.
- `FP-002`: green prescribed tests did not accept the parent after adversarial authority failures.
- `FP-003`: projection repair remains reachable; its ordering contract requires repair.
- `FP-005`: caller-loss and pre-command identity classification remain part of the repair gate.
- `FP-006`: reordered capped destinations proved an older repair can replace newer truth.
- `FP-008`: mechanically mergeable evidence branches and PRs remained semantically protected.
- `FP-009`: inspected, implementation, coordination, final, remote, and hosted identities remain distinct.
- `FP-010`: the installed repair prompt maps every confirmed finding.
- `FP-011`: source/control/provenance validation passed and remains required before mutation.
- `FP-012`: unique complete evidence passed, but semantically weak nested authority did not.
- `FP-013`: nested survey authority survived every independently exercised rewrite.
- `FP-014`: newly recorded deep semantic/canonical validation guardrail applies to the repair.

## 7. Next Route

Execute only `Version 0.6.10.2 - Ashen Reef Survey Advancement Authority Repair`. After implementation, install a separate production-read-only `Version 0.6.10.3 - Ashen Reef Survey Advancement Post-Repair Acceptance Audit`. Parent and representative-loop acceptance remain blocked until that audit passes every repaired contract and the retained positive matrix.

## 8. Version 0.6.10.2 Implementation Appendix

Date: 2026-08-11

Repair implementation: `59af92629a79e95fa20247959159e336a8dbc88e`

Repair disposition: `IMPLEMENTED_PENDING_POST_REPAIR_AUDIT`

This appendix records implementation evidence only. It does not revise the historical `0.6.10.1` decision or accept parent `0.6.10`.

| Finding | Implemented closure | Focused evidence |
| --- | --- | --- |
| `AR-001` | Validator-owned deep semantic certification for every retained owner input, recursive stable canonical serialization, valid month 13, and no caller-controlled collision path before durable duplicate resolution. | Malformed `{}`/`[]`/`null`/missing/undefined/non-finite values; forged Echo/progression, reputation, and origin facts; nested-key permutation; persisted equivalent retry and duplicate. |
| `AR-002` | Corrections require nonempty unique valid evidence, exact affected-owner reconciliation, and evidence linkage while preserving cycle, uniqueness, and pending-work gates. | Missing, empty, duplicate, malformed, unlinked, incomplete/conflicting, and valid persisted correction cases. |
| `AR-003` | One total `(appliedTick, stable resultId)` order controls initial insertion and repair; complete destinations are inspected before cap truncation; opaque authority fails closed; applied or prior-repaired drift is rediscovered; event repair remains pending-only and terminal. | Reordered caps, newer-tail truth, same-tick genuine results in both invocation orders, notification/Chronicle parity, opaque rows, expiry, repeat drift/repair ordinal, correction, and event cases. |
| `AR-004` | Exception-total typed preparation and an extracted production caller retain request identity only for a classified technical retry and apply state only on acceptance. | Domain/invalid/unclassified/technical/accepted/duplicate outcomes, second-invocation same-id retry, disabled unavailable posture, and accepted-only state. |
| `AR-005` | Plan and result persist the exact nine-field `no_proposal` contract without inventing owner receipts. | Byte-stable Knowledge, location/map/travel, currency, standing, inventory, reputation, active unturned-in quest/reward, and General Lore boundaries. |
| `AR-006` | Shared panel facts distinguish applied, breakthrough-blocked, and unchanged skill outcomes. | Actual positive, blocked, and maximum-rank survey plans through the panel-facing adapter. |

Validation after the final repair passed the removable adversarial probe `6/6`, focused survey suite `35/35`, prescribed adjacent matrix `177/177`, Knowledge matrix `132/132`, clock/schema matrix `107/107`, Vite production build at 212 transformed modules, and the exact bounded TypeScript baseline of 137 diagnostics with only the same two pre-existing `ActivityPanel` findings. Three bounded read-only re-audits found no residual material blocker; the primary agent reverified their material claims against the settled checkout.

The active route is now production-read-only `Version 0.6.10.3 - Ashen Reef Survey Advancement Post-Repair Acceptance Audit`. Parent acceptance, representative-loop classification, and any `0.7.0` decision remain outside this appendix.

## 9. Version 0.6.10.3 Post-Repair Audit Appendix

Date: 2026-08-13

Inspected repair: `59af92629a79e95fa20247959159e336a8dbc88e`

Audit starting head: `bc9783803c08ab403cad0302727d5b701291da40`

Decision: `REPAIR_REQUIRED`

Representative-loop classification: blocked; no classification is issued while parent authority remains unaccepted

The six named `0.6.10.1` repair rows passed their direct matrices, but independent adversarial inspection found two residual authority failures within those same accepted contracts:

| ID | Contract | Finding | Exact seam | Required repair evidence |
| --- | --- | --- | --- | --- |
| `AR-007` | residual `AR-001`; contracts 1 and 3 | Progression validation proves only internally consistent Echo arithmetic. It does not recompute the retained progression from the retained attributes and skills. A forged, internally consistent zero-Echo state with a recomputed canonical intent remains valid target authority, turns the legitimate retry into `conflicting_retry`, and makes the forged retry a durable `duplicate`. | `campaign-rules.ts` progression and survey-owner validation before durable duplicate lookup | Recompute with the authoritative progression/Echo resolver and require exact semantic equality; reject forged zero/stale/contribution variants before duplicate resolution in-process and after restart. |
| `AR-008` | residual `AR-003`; contract 8 | Projection inspection returns `projection_already_correct` as soon as matching row bytes are present. Reversing two genuine, byte-correct notification and Chronicle rows is therefore undiscoverable, survives version-7 publish/load byte-for-byte, and cannot be repaired into total `(appliedTick, resultId)` authority order. | `player-survey-activity-advancement.ts` destination inspection and repair discovery | Detect content-correct placement drift, deterministically reorder survey-known rows without evicting or moving opaque rows, persist an explicit repair posture, and prove convergence/idempotency at different and equal ticks through restart and both invocation orders. |

Primary reexecution passed the focused and adjacent matrix `177/177`, Knowledge matrix `132/132`, clock/schema matrix `107/107`, the 212-module production build, and the registered bounded TypeScript baseline of 137 diagnostics with only the same two pre-existing `ActivityPanel` findings. A removable nine-case adversarial probe reproduced both blockers; eight cases passed and the row-placement acceptance assertion failed as expected. The probe and build output were removed.

`AR-002`, `AR-004`, `AR-005`, and `AR-006` passed independent inspection. Survey authority also survived non-empty save/load, publication/readback, duplicate retry, first fork, Normal defeat, and recovery checks. Those positive facts narrow the repair but cannot accept a parent whose durable duplicate and projection-repair authority remain forgeable or incomplete.

No formal representative-loop classification is made. Separately observed creator-to-survey reachability remains incomplete because ordinary new-game state does not organically supply the survey quest, tracked state, activity, or Ashen Reef known-location chain; reconsider that evidence only after the parent is accepted.

The next route is `Version 0.6.10.4 - Ashen Reef Survey Progression Coherence And Projection Placement Repair`. It may repair only `AR-007` and `AR-008`, must preserve every passing contract, and cannot self-accept parent `0.6.10`. A separate production-read-only `0.6.10.5` audit remains required. `0.7.0` stays `NOT_READY`.

## 10. Version 0.6.10.4 Progression And Placement Repair Appendix

Date: 2026-08-13

Synchronized starting head: `2c760eedd41e221fdfbd4caba9611cf0156af0b8`

Implementation commit: `07c57392c8078927e4f9e12efe18d8d89bb1fc70`

Disposition: `IMPLEMENTED_PENDING_REAUDIT`

The bounded implementation repairs only the two residual findings:

| ID | Implemented owner repair | Persisted/behavior posture | Direct evidence |
| --- | --- | --- | --- |
| `AR-007` | `validateSurveyOwnerInputs(...)` retains its structural and arithmetic checks, then requires full deep equality with `resolvePlayerEchoProgression(...)` applied to the retained attributes, complete skills, and progression inputs. | Internally coherent but owner-inconsistent progression is invalid before duplicate lookup, mutation, repair, or publication; legitimate derived variants and clean retries remain valid. | Forged zero, alternate-attribute, alternate-skill, and diversity-derived states fail in commands and retained authority even after unchecked recursive canonical recomputation; valid publication remains authoritative and reload retry remains duplicate. |
| `AR-008` | Destination inspection evaluates exact content and total survey-known placement. Explicit `misordered` / `reordered` authority sorts known rows by `(appliedTick desc, resultId asc)` and scatters only into known slots. | Opaque objects, serialized bytes, and indices remain exact; no placement repair evicts truth; reordered history is nonterminal, event-ineligible, correction-gated, restart-safe, and idempotent. | Notification and Chronicle cases pass at different/equal ticks, both invocation orders, interspersed opaque capped rows, inserted/replaced/reordered histories, correction boundaries, raw serialization, and version-7 publish/load/re-repair. |

The implementation changes only the survey semantic validator, survey projection owner, persisted repair literals, two focused survey test files, and the adjacent skill-gating fixture required to keep deliberately mutated skills owner-coherent. TypeScript re-export/type-only JavaScript mirrors remain unchanged and covered. It does not change UI/context/gameplay-loop production code, balance, save versions, migrations, Normal defeat/recovery, content, dependencies, generic projections, or representative reachability.

Post-repair validation passed the adversarial selection `6/6`, focused survey files `41/41`, prescribed focused/adjacent matrix `175/175` plus achievements `8/8` (`183/183`), additional account/run/legacy/deterministic coverage `72/72`, Knowledge `132/132`, clock/schema `107/107`, and the 212-module Vite production build. Bounded TypeScript retained the exact 137-diagnostic baseline with no repaired-surface diagnostic and only the same two relevant pre-existing `ActivityPanel` findings. Raw and version-7 persistence proved valid duplicate durability, forged-authority quarantine, drift discovery, explicit reorder persistence, opaque-slot stability, and restart idempotency.

No new failure-pattern row is required: this implementation directly closes the reusable `FP-015` owner-recomputation and `FP-016` projection-placement omissions while satisfying the retained `FP-003`, `FP-006`, `FP-011`, `FP-012`, `FP-013`, and `FP-014` gates.

This appendix is implementation evidence, not parent acceptance. Active next is production-read-only `Version 0.6.10.5 - Ashen Reef Survey Progression And Projection Post-Repair Acceptance Audit`. Only that audit may return `PARENT_ACCEPTED` or `REPAIR_REQUIRED` and, after a parent acceptance, issue the required representative-loop classification. `0.7.0` remains `NOT_READY`.

## 11. Version 0.6.10.5 Post-Repair Acceptance Appendix

Date: 2026-08-13

Original implementation: `008db9c93eb8818aea51652be07fd196df41c45f`

First repair: `59af92629a79e95fa20247959159e336a8dbc88e`

Residual audit authority: `ad4a080acc3d05a4a790c4b219780db11a1be1a1`

Progression/placement repair: `07c57392c8078927e4f9e12efe18d8d89bb1fc70`

Repair coordination and audit starting head: `fd40571bb0802177bd776fd3cd445b6b487716fd`

Parent decision: `PARENT_ACCEPTED`

Representative-loop classification: `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE`

The production-read-only audit independently accepted every repaired and retained parent contract. `AR-007` now recomputes the complete retained progression with the repository-authoritative Echo resolver before canonical retry or durable duplicate trust. `AR-008` now inspects content and placement, records exact `misordered` / `reordered` repair authority, sorts only survey-known rows in `(appliedTick desc, resultId asc)` order, and preserves opaque slots, caps, retention, correction, and pending-event boundaries. No production, contract, tracked-test, format, migration, content, dependency, asset, UI, or gameplay file changed during this audit.

Independent evidence included:

- a primary removable combined probe passed `16/16`, covering forged command and retained progression, atomic pre-duplicate rejection, raw quarantine, two genuine accepted results, restart drift discovery, explicit notification/Chronicle reorder, opaque index/byte preservation, repaired restart validation, and idempotent retry;
- a separate progression inspection passed a fresh `20/20` command/retained/publication matrix and focused command/persistence `40/40`;
- a separate projection inspection passed `176/176` two-result assertions plus `64/64` arbitrary four-result permutation assertions and focused command/persistence `40/40`;
- retained `AR-001` through `AR-006`, four-stage behavior, caller retry, correction, duplicate, publication, and Normal defeat/recovery evidence passed a separate 18-assertion probe;
- the primary prescribed matrix passed `175/175`, achievements passed `8/8`, Knowledge passed `132/132`, and clock/schema passed `107/107`;
- Vite `5.4.21` transformed `212` modules successfully with only the registered chunk advisory;
- bounded TypeScript remained at the exact registered `137` diagnostics, with only the same two pre-existing `ActivityPanel` TS2375 findings on the relevant surface and no repaired engine, contract, persistence, caller, or recovery diagnostic;
- JavaScript pass-through/type-only mirrors, public exports, raw serialization, version-6 migration, version-7 publication/readback/restart, browser storage, nested survey-ledger preservation, diff hygiene, and temporary-artifact cleanup remained valid.

Parent acceptance does not establish ordinary reachability. A fresh production `createNewGameSnapshot(...) -> publishSave(...) -> loadSaveWithAuthority(...)` probe produced zero quest-journal rows, `trackedQuestId: null`, only `settlement.stonevein` as known location, and only `activity.start.settlement.stonevein` as an activity record. Without injected facts, the Ashen Reef chain returned `quest_missing`, `destination_not_known`, `activity_missing`, and `survey_quest_missing`. The existing fresh-character survey test injects the demo quest, tracked state, Ashen Reef activity/location, and sector evidence; it cannot prove the ordinary representative loop.

Therefore parent `0.6.10` is accepted as the bounded engine-owned survey advancement authority, while `0.7.0` remains `NOT_READY`. The smallest next route is the unversioned docs-first `Ashen Reef Survey Ordinary Reachability And Representative Loop Dependency Closure Decision`. It must decide the quest-offer source, Ashen Reef known-location authority, activity activation/selection boundary, publication/restart order, and one injection-free creator-to-restart evidence path without inventing canon or weakening the persisted nine-field survey `no_proposal` boundary. Turn-in and rewards remain excluded.

## 12. Ordinary Reachability Dependency Closure Appendix

Date: 2026-08-20

Decision starting head: `cf46fc885c870c252bc587b853baa67435b07465`

Outcome: `NO_PACKAGE`

Representative-loop classification: `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE`

The documentation-only dependency decision reverified that accepted downstream authority is sufficient after valid upstream admission. Quest acceptance/tracking consume an existing `contracts` row; travel consumes an existing known-location row; tracked-quest travel to Ashen Reef already creates the survey operation and exact current activity; and the accepted survey, campaign, publication/restart, duplicate, correction/repair, and Normal defeat/recovery seams remain reusable. No separate activity-selection edge, save-format change, migration, or generic persistence framework is required for the straight representative path.

The package remains blocked upstream. Ordinary creation and version-7 reload produce no exact survey offer/journal row and no known `location.ashen_reef`. Production has no writer for either fact. Demo presentation, runtime Starfall destination facts, the distinct Brineharbor reef charter, and generic civilization offers are non-equivalent; no accepted authority chooses among them or maps them together. Existing “fresh character” and survey persistence tests inject the missing eligibility and therefore remain downstream-owner evidence only.

The active prerequisite is `Ashen Reef Survey Offer, Journal Admission, And Travel-Access Authored-Canon Decision`. It must obtain explicit quest/place identity, issuer, availability/eligibility/recurrence, stable journal-admission, and travel-access occurrence facts. It must fail closed rather than seed demo state, infer access from Knowledge/map/Codex/prose, alias the Brineharbor charter, or change any accepted survey `no_proposal` field. Provisional `0.6.11` is not authorized, and `0.7.0` remains `NOT_READY`.

## 13. Ordinary Reachability Package Authorization Appendix

Date: 2026-08-20

Accepted authored canon closed the missing offer/access facts. The subsequent implementation-package decision returned `PACKAGE_READY` and selected `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`.

The package does not reopen parent `0.6.10`. It adds only the upstream authored definition, new-campaign offer admission, accepted-quest access admission, direct Starfall/Ashen origin correction, canonical presentation with retained version-1 compatibility, and an injection-free creator-to-final-restart test. All four survey shifts, result/receipt identities, duplicate behavior, correction/repair, accepted-only caller application, persistence, defeat/recovery preservation, and nine non-proposals remain parent authority.

Parent `0.6.10` stays accepted. Representative-loop evidence remains incomplete until `0.6.11` is implemented and a separate production-read-only `0.6.11.1` audit accepts it. `0.7.0` remains `NOT_READY`.

## 14. Version 0.6.11 Ordinary Reachability Implementation Posture Appendix

Date: 2026-08-26

Implementation commit: `3ca23d6864541a899ea61a6bf26257665f754e78`

Disposition: `IMPLEMENTED_PENDING_PARENT_AUDIT`

`0.6.11` has implemented the bounded upstream reachability owners and the injection-free representative production path while preserving accepted parent `0.6.10` authority. The final scoped matrix passed `1072/1072`, the adversarial probe passed `24/24`, normal content lint passed for 71 files, the 219-module production build passed, and bounded TypeScript retained the exact 137-diagnostic baseline.

This appendix does not reopen or re-accept parent `0.6.10`, and it does not self-accept representative evidence. Run production-read-only `Version 0.6.11.1` next. `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE` remains controlling until that audit, survey turn-in/rewards remain excluded, and `0.7.0` remains `NOT_READY`.
