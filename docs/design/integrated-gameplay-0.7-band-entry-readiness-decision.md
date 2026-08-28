# Integrated Gameplay 0.7 Band-Entry Readiness Decision

Date: 2026-08-27

Run class: unversioned documentation-only milestone decision

Milestone impact: `band_entry_candidate`

Inspected head: `dc89c8f0421e3e657740f03ecfa611a29ae2f8b3`

Accepted predecessor: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

Acceptance authority: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

Decision: `BAND_ENTRY_READY`

## 1. Decision

Every repository-defined `0.7.0 - Integrated Gameplay Systems` entry criterion is satisfied by accepted current authority and remains valid at the inspected live head. No unresolved omission is mandatory for `0.7.x` entry.

This decision authorizes a separate bounded `Version 0.7.0 - Integrated Gameplay Systems Band Entry` milestone-activation package. It does not itself assign or implement `0.7.0`, and it does not authorize new gameplay behavior.

The accepted representative loop is deliberately narrow: one ordinary Starfall creator reaches the canonical Soundings contract through production offer admission, accepts it with atomic Ashen access and tracking, travels through the engine-owned travel owner, receives arrival-owned survey activity/operation state, executes four engine-owned survey shifts through typed result/event/consequence authority, persists and restarts, and receives a durable empty-cache duplicate without replay. The quest remains active and ready for a later turn-in owner.

## 2. Current-Head Continuity

The accepted implementation is `3ca23d6864541a899ea61a6bf26257665f754e78`. The complete path delta from that commit through inspected head `dc89c8f...` changes only documentation and workflow authority. No production source, shared contract, schema, serializer, migration, tracked test, content, dependency, asset, UI, or save behavior changed after acceptance.

The current-head focused executable gate passed `77/77`:

- `tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs`;
- `tests/unit/player-survey-activity-advancement-command.test.mjs`;
- `tests/unit/player-survey-activity-advancement-persistence.test.mjs`;
- `tests/unit/campaign-persistence-foundation.test.mjs`.

The representative case independently remained green through the production creator, retained new-campaign attempt, verified publication/load, quest acceptance and campaign admission, Ashen travel, arrival-owned activation, four real-caller shifts, mid-loop and final restart, and empty-cache durable duplicate. The adjacent cases retained stale/conflicting rejection, transition failure, deep authority validation, correction/repair, versioned persistence, projection placement, arbitrary-depth recovery lineage, and Normal defeat/recovery preservation.

## 3. Milestone Criterion Matrix

| Criterion | Status | Current authority and executable evidence | Remaining gap |
| --- | --- | --- | --- |
| Character creation/start state enters a playable session | `satisfied` | `createNewGameSnapshot(...)`, the retained new-campaign attempt coordinator, verified version-7 publication/load, and the ordinary integration test begin from real Starfall creator inputs. | None for band entry. |
| Authoritative save/load preserves required slice state | `satisfied` | Accepted `0.6.9` campaign/publication authority plus current campaign-persistence and survey-persistence tests preserve the loop across pre-travel, mid-loop, final, correction/repair, and Normal defeat/recovery boundaries. | Other Stakes modes and later operational hardening are outside this slice. |
| Travel/movement is engine-owned and participates in the loop | `satisfied` | `player-travel.ts` owns command/result/stale protection and arrival activation; the representative path travels from compatibility Starfall origin to `location.ashen_reef`. | Generic travel-key migration is not required. |
| Quest/activity advances beyond selection through an authoritative attempt/result path | `satisfied` | `player-survey-activity-advancement.ts` owns preparation, normalized intent, command, result, event, occurrence, receipts, duplicate, correction, and repair. Four stages materially advance quest/operation/activity state. | Turn-in is a separate later interaction. |
| One consequence-bearing interaction crosses multiple systems | `satisfied` | Each accepted shift coordinates time, body/metabolic state, resources, attribute load, skill progression, quest progress, operation/activity, discovery, projections, event emission, campaign admission, and persisted receipts. Final accepted authority is 4 requests, 4 occurrences, 4 results, and 48 receipts. | No turn-in/reward consequence is needed to make the already accepted shift cross-system. |
| Commands, events, synchronization, stale protection, and accepted-only UI are coherent | `satisfied` | Owner-specific collision-safe identities, campaign control, stale/conflicting rejection, `gameplay-snapshot-sync`, `advanceAshenReefSurveyCaller(...)`, and `GameSessionContext` accepted-state application remain current. Rejected survey state is not applied. | The generic legacy event helper is not used by the slice. |
| Required inventory/resource ownership and typed effects exist for included interactions | `satisfied` | The included survey interaction uses authoritative player resources and typed owner receipts. Inventory is an exact persisted `no_proposal`, and the ordinary test proves inventory remains unchanged. | Future inventory-bearing interactions need their own owner; inventory is not universally required by the milestone wording. |
| Bounded replay/test coverage and explicit failure behavior exist | `satisfied` | Accepted `0.6.10.5` and `0.6.11.1` evidence plus current `77/77` cover success, malformed/wrong identity, stale state/revision, wrong location/quest, transition failure, conflicting retry, durable duplicate, correction/recovery pending, restart, mixed v1/v2 authority, corruption rejection, projection repair, and Normal defeat/recovery. | Later slice breadth is not an entry criterion. |
| Remaining demo/UI-authored mutations do not control the milestone loop | `satisfied` | The ordinary test imports no `demoSnapshot`, injects no eligibility state, and uses the real survey caller. Legacy shell turn-in remains outside the loop and is never invoked. | Turn-in must receive a future authoritative owner before it is included in a later slice. |
| Known omissions are documented and non-invalidating | `satisfied` | Soundings ends active/unturned-in. Rewards, class/progression cleanup, attribute balancing, generic quest architecture, travel-key migration, other Stakes modes, inventory instances, NPC promotion, and pre-alpha hardening are explicitly deferred. | These omissions govern later packages but do not invalidate the accepted loop. |

## 4. Installed-Prompt Eight-Part Gate

The installed decision's grouped criteria are also satisfied:

1. engine-owned advancement and typed results/events: `satisfied`;
2. current publication/load/restart persistence: `satisfied`;
3. typed cross-system consequences, deep validation, durable duplicate, correction/repair, and no hidden UI authority: `satisfied`;
4. accepted-only real production caller application: `satisfied`;
5. ordinary injection-free creator-to-loop acquisition: `satisfied`;
6. representative success/rejection/retry/restart/stale/conflict/duplicate/nested-authority coverage: `satisfied`;
7. active unturned-in Soundings and deferred rewards are explicit: `satisfied`;
8. no milestone-policy-mandatory blocker remains: `satisfied`.

## 5. Explicit Non-Requirements And Later Bands

The following are `not_required_for_entry`:

- quest turn-in, payout, reward delivery, economy/reputation settlement, and generic reward architecture;
- inventory/item-instance identity for an interaction that explicitly proposes no inventory effect;
- class/progression compatibility cleanup and attribute rebalance;
- generic quest, travel, activity, event, effect, or migration frameworks;
- broad travel-key migration and other Stakes modes;
- NPC/generated-person persistence and promotion;
- `0.8.x` region/adventure breadth, agreed combat/inventory/crafting/economy/NPC/service subset, accessibility/input hardening, balance, anti-exploit, and placeholder cleanup;
- `0.9.x` packaging, diagnostics, performance/stress, sustained external alpha, and issue/reset workflow;
- `1.0.0` launch scope, release-candidate QA, legal/support/privacy/operations, and release approval.

Recent Connector audits of inventory identity and generated-person persistence explicitly confirm that those future owner gaps do not affect this gate. They remain supporting evidence, not milestone authority.

## 6. Failure-Pattern Evidence

- `FP-001`: current source and the representative integration exercise the real creator, publication, command/admission, travel, real caller, and accepted-only session bridge.
- `FP-002`: the decision combines accepted predecessor audits, semantic source review, current-head delta verification, and fresh executable evidence rather than relying on green counts alone.
- `FP-008`: Connector packets, the protected readiness branch, candidate refs, and PR merge refs remain evidence only; none was promoted by textual mergeability.
- `FP-009`: accepted implementation, accepted audit publication, Connector packet, inspected decision head, later coordination commit, pushed head, tracking head, and hosted blobs remain distinct identities.
- `FP-013`: focused persistence re-proved survey authority through later campaign/defeat/recovery parent rewrites.
- `FP-014`: deep semantic and canonical validation, owner-derived progression, complete receipts, and projection placement remain part of the current gate.
- `FP-017`: the representative path starts from `createNewGameSnapshot(...)` and acquires every eligibility fact through production owners without fixture injection.

No new reusable failure pattern was discovered.

## 7. Branch And PR Disposition

Fresh fetch/prune found one local branch and 37 non-default remote branches. Live pull-request refs retain PR #2 head `e78dc645cfb658685be12f45f46d34b7c0da1119` and PR #3 head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`; both remain `SUPERSEDED_PRESERVE_EVIDENCE`.

The four survey evidence refs remain `CANDIDATE_INTEGRATION` for their broader named consumers. `prep/integrated-gameplay-0-7-readiness-audit` at `59c103c3a06d55f35bffa735fd4b7814dffb583e` and the prompt-packaging ref remain `PROTECTED_REFERENCE`. Administration evidence remains `HOLD_NAMED_CONSUMER`.

The protected readiness audit's earlier blockers were re-read as historical evidence. Accepted `0.6.9`, `0.6.10`, and `0.6.11` closed its missing campaign publication, survey owner, durable receipt, restart, correction/repair, and accepted-only caller gaps. No merge, cherry-pick, rebase, force update, PR mutation, closure, deletion, or disposition change is due.

## 8. Next Route

Execute only:

`Version 0.7.0 - Integrated Gameplay Systems Band Entry`

That package is a bounded milestone activation/publication run over the already accepted representative slice. It must recheck live-head continuity and the focused gate, then record the internal band entry without adding gameplay behavior. If current-head drift invalidates any criterion, it must fail closed and restore the smallest `0.6.x` prerequisite instead of claiming `0.7.0`.
