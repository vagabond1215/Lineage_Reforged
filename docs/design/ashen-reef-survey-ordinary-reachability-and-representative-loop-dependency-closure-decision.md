# Ashen Reef Survey Ordinary Reachability And Representative Loop Dependency Closure Decision

Date: 2026-08-20

Label class: unversioned documentation-only decision

Milestone impact: `supports_current_band`

Decision starting head: `cf46fc885c870c252bc587b853baa67435b07465`

Accepted parent: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Parent acceptance authority: `950e851446fb75bfbdb717d0ea33e33ec2907d4a`

Outcome: `NO_PACKAGE`

Representative classification: `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE`

Provisional `Version 0.6.11`: not authorized

`0.7.0`: `NOT_READY`

## 1. Decision

Current repository authority cannot define one implementation-ready ordinary-reachability package without inventing authored setting and product facts. The accepted survey command, quest acceptance/tracking commands, tracked-quest travel arrival hook, accepted-only UI application, campaign mutation admission, version-7 publication, restart, durable duplicate, correction, repair, and Normal defeat/recovery preservation are sufficient after valid upstream quest-offer and travel-access authority exists.

Two upstream owners are absent:

1. an authored/runtime owner that makes `quest.ashen_reef_survey` available and projects one stable `contracts` row into `sessionState.questJournal` before acceptance; and
2. an accepted occurrence and owner that creates a known/travelable `location.ashen_reef` row before travel admission.

Those are canon and ownership decisions, not gaps that a representative test may fill with fixture insertion. The provisional `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence` therefore remains unauthorized.

## 2. Production Reachability Map

| Edge | Current production authority | Fresh-checkout evidence | Disposition |
| --- | --- | --- | --- |
| Ordinary character creation | `createNewGameSnapshot(...)` and target initialization | Creates an empty quest journal, no tracked quest, no civilization quest offers, only the selected starting settlement as known, and only its arrival activity record | Settled |
| Initial publication/load | version-7 `publishSave(...)` and `loadSaveWithAuthority(...)` | Exact candidate verification, semantic validation, authoritative session-control restoration, and accepted survey-ledger persistence are present | Settled |
| Survey offer availability | No production writer for exact `quest.ashen_reef_survey` | Exact id exists only in demo/runtime/test material; civilization offers are a distinct type and have no session-journal bridge | Blocking |
| Journal admission | No owner appends or upserts the required `contracts` row | Quest acceptance and tracking only consume an existing journal row | Blocking |
| Quest acceptance/tracking | Engine-owned quest commands plus campaign admission | Existing `contracts` rows are accepted, activated, tracked, and applied only after acceptance | Settled after journal admission |
| Ashen Reef access acquisition | No production writer creates known `location.ashen_reef` | Creation adds only the starting settlement; travel only maps an already-present destination row | Blocking |
| Travel | Engine-owned travel command plus campaign admission | Correctly returns `destination_not_known` until the exact row exists | Settled after access acquisition |
| Survey activity activation | Existing tracked-quest Ashen Reef travel arrival hook | Accepted travel creates `operation.quest.ashen_reef_survey` and sets `activity.survey.ashen_reef` | Settled; no separate activity-record selection is required on the straight path |
| Four survey shifts | Accepted `0.6.10` survey owner and production caller | Exact four-stage plans/results/receipts, accepted-only application, duplicate, correction, and projection repair are present | Settled after upstream reachability |
| Mid-loop/final restart | Existing version-7 publication/load and survey authority | Accepted authority survives raw serialization, publication, restart, defeat/recovery, and durable duplicate delivery | Settled |

The production creator/publication/load probe reproduced the expected missing edges without mutating tracked files:

- `quest_missing`;
- `destination_not_known`;
- `activity_missing` for an attempted record-backed selection; and
- `survey_quest_missing`.

The selection failure is diagnostic, not an additional straight-path blocker: after an eligible tracked quest and known-location row exist, accepted travel itself establishes the survey activity and operation.

### 2.1 Source And Test Evidence

The production map is grounded in these live seams:

- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts` initializes empty offers/journal/tracking and adds only the selected starting settlement and arrival record;
- `packages/engines/civilization-engine/src/quest-generation.ts` emits distinct civilization offer instances, with no RPG session-journal projection owner;
- `packages/engines/game-engine/src/player-quest-acceptance.ts` and `player-quest-tracking.ts` consume an existing journal row and do not create one;
- `packages/engines/game-engine/src/player-travel-rules.ts` requires an exact known destination row;
- `packages/engines/game-engine/src/player-travel.ts` preserves the accepted tracked-survey arrival hook but only maps an already-present known-location row;
- `packages/engines/game-engine/src/player-survey-activity-advancement.ts` owns the accepted four-stage plan/result/receipt path after eligibility;
- `apps/rpg-ui/src/runtime/ashenReefSurveyCaller.ts`, `GameSessionContext.tsx`, and `ActivityPanel.tsx` preserve accepted-only caller application;
- `apps/rpg-ui/src/game-shell/saveManager.ts` owns verified version-7 publication/readback/load.

Current focused tests establish the downstream seams but not the missing owners:

- `player-quest-acceptance-command.test.mjs`, `player-quest-tracking-command.test.mjs`, `player-travel-command.test.mjs`, and `player-activity-selection-command.test.mjs` prove command behavior after required rows exist;
- `player-survey-activity-advancement-command.test.mjs`, `player-survey-activity-advancement-characterization.test.mjs`, and `player-survey-activity-advancement-persistence.test.mjs` prove eligible survey behavior, receipts, restart, and duplicate posture;
- `save-load-roundtrip.test.mjs` proves roundtrip behavior only after direct eligibility insertion;
- the named fresh-character survey fixture inserts the demo quest, tracking, Ashen location/activity, and prior sector facts directly;
- no tracked test traverses ordinary creator -> authoritative offer -> journal admission -> authoritative access -> travel -> four shifts -> restart without those insertions.

## 3. Exhausted Evidence And Canon Conflict

The repository does not contain a canonical definition for exact id `quest.ashen_reef_survey`.

- Demo-only presentation calls the quest “Ashen Reef Survey,” labels it `Glasswater`, and sends the chart packet to `Saltmere Harbor Office`.
- Accepted runtime travel facts map `location.ashen_reef` to `Starfall Port`, `Starfall Isle`, and `settlement.starfall_port`.
- The only authored reef-survey definition is `quest_definition.brineharbor_reef_soundings`, issued by the Brineharbor Harbor Office, with different eligibility, recurrence, rewards, and unlock facts.
- The generic frontier-survey template produces settlement/tick-derived civilization offers. No authority maps those instances to the exact survey id or projects them into the session journal.
- The four exact survey-applicable Connector audits and the protected integrated-gameplay readiness evidence supply useful owner/evidence boundaries but no current Ashen offer or access canon.

These sources are materially non-equivalent. None can be selected or combined by implementation inference.

## 4. Unsafe Inferences Prohibited

The follow-up must not:

- seed the demo quest, Ashen location, activity, or sector state into every new campaign;
- treat demo copy, notification text, quest objectives, role labels, or the protected readiness proposal as authored canon;
- alias the Brineharbor charter or a generic generated offer to `quest.ashen_reef_survey` without explicit authored approval;
- equate a Codex row, map display, geographic Knowledge, settlement identity, or quest prose with known-location or travel-access authority;
- make survey advancement grant access, because all nine accepted survey `no_proposal` fields must remain exact;
- add a generic quest, travel, activity, event, replay, correction, or publication framework;
- reopen the accepted survey parent, turn-in/rewards, or `0.7.0` entry.

## 5. Exact Authored Input Required

Before an implementation package can be selected, an authorized product/canon owner must decide all of the following:

1. **Canonical identity and place context**
   - whether `quest.ashen_reef_survey` and the current `location.ashen_reef` Starfall destination remain the intended identities;
   - the canonical quest title, issuer, delivery surface, region/settlement context, and offer copy;
   - whether the Saltmere/Glasswater demo wording is replaced, retained under an explicit reconciliation, or discarded.
2. **Availability and journal admission**
   - the exact ordinary occurrence that makes the offer available;
   - eligibility facts and whether availability is one-time or repeatable;
   - expiry, retention, and re-offer posture;
   - stable offer-instance identity and the bounded owner that idempotently projects it into `questJournal` as `contracts`.
3. **Travel-access acquisition**
   - the exact accepted occurrence that creates known/travelable `location.ashen_reef`—offer presentation, quest acceptance, or a separate authored interaction;
   - the owner and source facts for that row;
   - whether access is coupled to the quest or independently obtained.

The accepted quest acceptance/tracking commands, travel command, tracked-quest arrival hook, survey command, UI caller, campaign admission, and save authority should be reused after those inputs are fixed.

## 6. Held Representative Evidence Contract

Once authored inputs and owners are accepted, the smallest injection-free evidence path remains:

1. create an ordinary character through production creator/new-campaign coordination;
2. publish and reload version 7;
3. obtain the survey offer through the selected production owner;
4. accept and track through engine commands and campaign mutation admission;
5. obtain Ashen Reef access through the selected production owner;
6. travel through the engine owner and verify the existing survey activity/operation hook;
7. execute two distinct survey shifts through the production caller, applying only accepted state;
8. publish/reload to clear transient caller state and prove partial progression;
9. execute shifts three and four through the same caller;
10. publish/reload again;
11. redeliver the fourth request id with an empty caller cache and require durable `duplicate`, no accepted state/effect/event, and byte-stable current state;
12. assert exactly four request/occurrence/result sets, complete owner receipts, all nine `no_proposal` fields, contiguous progress, final discovery/operation/return activity, still-active unturned-in quest, authoritative projection order, and no pending correction or repair.

This is a held evidence contract, not authorization to write the test before the missing owners exist.

## 7. Smallest Next Route

Install the unversioned documentation-only:

`Ashen Reef Survey Offer, Journal Admission, And Travel-Access Authored-Canon Decision`

That decision must obtain explicit authored answers, record exact accepted facts and rejected alternatives, and remain fail-closed if any answer is unavailable. It may not implement production, tests, schemas, content, migration, or UI. If all authored inputs are accepted, it may install a separate implementation-package decision; it must not install an implementation prompt directly.

## 8. Branch, Failure-Pattern, And Scope Posture

All 37 non-default remote branches and open PRs #2 and #3 were inspected at the decision starting head. Their registered dispositions remain unchanged. PR #2 and PR #3 remain `SUPERSEDED_PRESERVE_EVIDENCE`; the four exact survey Connector refs remain `CANDIDATE_INTEGRATION` for broader named consumers; integrated-gameplay readiness remains `PROTECTED_REFERENCE`; the administration research branch remains `HOLD_NAMED_CONSUMER`. No integration, deletion, closure, rebase, or ref mutation is due.

Applicable guardrails were `FP-001`, `FP-002`, `FP-005`, `FP-008`, `FP-009`, `FP-011`, `FP-013`, `FP-014`, and especially `FP-017`. Current tests and fixture injections were not treated as ordinary reachability. No new failure-pattern entry is required.

This decision changes documentation only. It does not change production source, shared contracts, tracked tests, schemas, serializers, migrations, formats, dependencies, content, assets, UI, saves, or gameplay behavior.
