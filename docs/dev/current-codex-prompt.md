# Ashen Reef Survey Ordinary Reachability Implementation Package Decision

Date: 2026-08-20

Label class: unversioned documentation-only implementation-package decision

Milestone impact: `supports_current_band`

Execution posture: repository-first, docs-only decision; no production implementation in this run

Accepted parent: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Parent acceptance authority: `950e851446fb75bfbdb717d0ea33e33ec2907d4a`

Reachability dependency decision: `NO_PACKAGE`

Authored-canon authority: `docs/design/ashen-reef-soundings-authored-canon-decision.md`

Authored input: `AUTHORED_INPUT_ACCEPTED`

Starting representative classification: `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE`

## Objective

Decide the smallest coherent implementation package that makes the accepted Ashen Reef survey ordinarily reachable from production character creation under the now-accepted **Soundings of Ashen Reef** canon, while preserving every already accepted downstream survey seam.

Return exactly one outcome:

- `PACKAGE_READY` only if live repository authority plus the accepted authored-canon decision settle a bounded implementation, validation, persistence, and representative-test package without inventing generic quest/travel infrastructure or weakening accepted owners;
- `NO_PACKAGE` if a material implementation ownership/schema/content dependency remains unresolved, in which case install only the smallest decision/prerequisite route required to close it.

Do **not** implement production, content, schemas, migrations, tracked tests, or UI during this decision.

If and only if `PACKAGE_READY`, determine whether the package is correctly numbered:

`Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

and install a separate implementation prompt for that package. Do not execute the implementation during this decision.

`0.7.0` remains `NOT_READY`.

## Starting Disposition

- `0.6.10`: `PARENT_ACCEPTED` through independent `0.6.10.5`;
- ordinary-reachability dependency decision: `NO_PACKAGE` because authored quest/access facts were missing;
- authored facts are now explicitly settled in `docs/design/ashen-reef-soundings-authored-canon-decision.md`;
- representative loop remains `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE` until an injection-free production creator-to-restart path is implemented and independently accepted;
- quest acceptance/tracking, tracked-quest travel activation, four-shift survey advancement, accepted-only application, version-7 publication/restart, durable duplicate, correction/repair, and Normal defeat/recovery preservation are accepted downstream seams;
- survey turn-in/rewards and Geographic Knowledge/map proposals remain excluded.

## Accepted Canon - Do Not Reopen

Treat these as controlling authored facts:

- authored definition id: `quest_definition.starfall_ashen_reef_soundings`;
- runtime compatibility quest id: `quest.ashen_reef_survey`;
- title: **Soundings of Ashen Reef**;
- issuer presentation: **Starfall Harbormaster's Office**;
- issuer type: government;
- delivery context: Starfall Harbormaster's Office, `settlement.starfall_port`, `region.starfall_isle`;
- premise: one-time post-storm civic hydrographic/pilotage contract to re-sound channels, breakers, draft-safe approaches, and ruin markers before fishing and commercial traffic intensify;
- the post-storm condition is authored background already in effect, not a new runtime weather-trigger requirement;
- Ashen Reef is not established as a protected conservation area;
- fishing is a secondary practical/economic motive, not a modern ecological stock-assessment program;
- three survey sectors plus final ruin-marker verification retain the accepted four-shift mechanical structure;
- Stormglass Bloom remains an incidental final-shift discovery, not the commissioned objective;
- Brineharbor's reef-soundings charter remains a separate quest;
- the first contract is one-time per campaign, non-expiring before acceptance, and must not duplicate/re-offer after acceptance/completion;
- no hard level/class/reputation/magic/skill gate is authored for initial offer admission;
- representative test may explicitly choose Starfall Port as the starting settlement; this is not a global starting-location requirement;
- offer presentation alone does not grant travel to the survey anchorage;
- accepted quest acceptance is the causal occurrence that supplies old charts, departure instructions, authorization, and arranged access;
- preferred access boundary is a narrow Ashen-specific adapter/owner consuming accepted quest acceptance and idempotently ensuring `location.ashen_reef` is known/travelable;
- `location.ashen_reef` remains a compatibility travel key for the Starfall-associated survey anchorage/approach, not canonical proof that Starfall Port and Ashen Reef are the same place;
- Saltmere/Glasswater presentation for this quest is non-canonical and should be corrected only where the implementation package directly publishes contradictory Ashen presentation.

Do not ask the user to re-answer these facts.

## Authority And Orientation

Read `AGENTS.md` completely and follow the repository-first protocol, prompt-execution platform/tool policy, branch policy/register, applicable failure-pattern register, and protected-ref rules.

Read completely:

- current prompt, handoff, and prior Codex output;
- `docs/design/ashen-reef-soundings-authored-canon-decision.md`;
- `docs/design/quest-identity-offer-context-and-travel-access-product-direction.md`;
- `docs/design/ashen-reef-survey-ordinary-reachability-and-representative-loop-dependency-closure-decision.md`;
- permanent survey acceptance audit;
- quest definition/objective authority;
- quest acceptance/tracking authority;
- player travel/known-location authority;
- survey `no_proposal` contract;
- current version/planning/branch/failure-pattern authorities.

Fetch/prune and synchronize clean `master`. Record the inspected base, starting head, decision commit, pushed remote head, and post-fetch hosted head distinctly.

Inventory all local/remote branches and open pull requests. Preserve protected/evidence/superseded refs. No branch/PR lifecycle mutation is authorized unless a fresh controlling trigger proves it due.

Use multi-agent work only for bounded separable read-only inspection. The primary agent owns package classification and must reverify material claims against the synchronized checkout.

## Required Package Decision

### 1. Authored Quest Content Boundary

Determine the smallest correct way to represent `quest_definition.starfall_ashen_reef_soundings` in live authored content.

Reconcile the current strict `civilization.quest_definitions` schema and the existing Brineharbor survey definition without copying its unrelated level/class/standing/reward assumptions.

The package should prefer an actual authored quest definition over hard-coding all narrative copy in runtime if that can be done without broad schema redesign.

Decide exact first-pass fields for:

- id/slug/name/category/summary;
- giver presentation metadata without inventing a canonical office/person id that current authority cannot support;
- requirements consistent with no hard level/class/reputation/magic/skill admission gate;
- one-time/non-expiring scheduling posture to the extent current schema can honestly express it;
- descriptive logistics/action-tree material only where required and coherent with accepted four-shift runtime;
- reward fields: keep descriptive/non-executing and do not authorize turn-in/payout implementation.

If current schema forces materially false authored facts, do not silently fill them. Decide whether a narrow schema/content correction belongs in the package or whether that blocks package readiness.

### 2. Production Offer Admission Owner

Trace production creator -> initial version-7 publication/load -> session synchronization and determine the smallest owner that can idempotently project the one-time Starfall contract into `sessionState.questJournal` as category `contracts`.

The package must preserve:

- static authored definition separate from mutable journal state;
- current runtime compatibility row id `quest.ashen_reef_survey` unless a schema change is proven indispensable;
- deterministic eligibility when the character is currently in `settlement.starfall_port` and the one-time contract is not consumed;
- no global grant to characters outside the Starfall delivery context;
- durable visibility across publication/restart before acceptance;
- no duplicates under repeated synchronization/retry;
- existing quest acceptance/tracking ownership after the row exists.

Do not create a generic quest-offer framework unless live callers prove a smaller quest-specific owner is impossible.

### 3. Accepted-Quest Travel Access Owner

Determine the smallest Ashen-specific owner/adapter that consumes accepted `quest.ashen_reef_survey` acceptance and idempotently ensures the exact known/travelable `location.ashen_reef` row.

The accepted narrative source facts are old working charts, departure instructions, survey authorization, and arranged harbor launch/access.

Preserve separation from:

- Geographic Knowledge evidence/progress;
- Codex/map/fog/recognition;
- survey advancement's nine `no_proposal` geographic fields;
- generic travel-access policy.

Decide duplicate, retry, stale/conflict, persistence, and publication order. The access row must survive version-7 restart before travel.

### 4. Existing Arrival Hook Reuse

Reverify that accepted tracked-quest travel to `location.ashen_reef` still directly creates/updates:

- `operation.quest.ashen_reef_survey`;
- `activity.survey.ashen_reef`.

The straight representative path must not inject an activity record or add a separate activity-selection command if this hook remains sufficient.

### 5. Canon Presentation Reconciliation

Audit only Ashen-facing production/demo presentation that would contradict accepted Starfall canon.

Known candidates include stale `Glasswater` and `Saltmere Harbor Office` wording and the current `Stormglass Bloom` discovery region label.

The package may include the smallest directly necessary corrections so the representative path does not publish mutually contradictory place/issuer facts.

Do **not** turn this into a broad world/travel naming cleanup.

### 6. Injection-Free Representative Test

Define a production-representative tracked test that performs, without direct insertion of quest/tracked/known-location/activity/sector/discovery/receipt rows:

1. production character creation with an explicitly selected Starfall Port starting settlement;
2. ordinary initial version-7 publish/load/restart boundary as appropriate;
3. deterministic appearance of **Soundings of Ashen Reef** in `contracts`;
4. production quest acceptance;
5. production quest tracking;
6. accepted-quest-triggered durable `location.ashen_reef` access;
7. production travel to Ashen Reef;
8. automatic survey operation/activity activation;
9. all four survey shifts through the accepted production caller;
10. publication/load/restart;
11. final result, duplicate behavior, projections, quest progress, operation/activity, discovery, and accepted correction/repair behavior required by parent authority.

The test may make ordinary user choices through production creator inputs. It must not use developer fixtures to create eligibility state that a real player path cannot create.

### 7. Version And Package Classification

If all required owners and validation surfaces are bounded, return `PACKAGE_READY` and decide whether the implementation is correctly named:

`Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

If another numbered version has appeared on live `master`, use the next valid live primary instead of blindly reusing `0.6.11`.

If `NO_PACKAGE`, name the exact unresolved owner/schema/content dependency and install only its smallest prerequisite decision.

## Non-Quest Sanity Note - Deferred, Non-Blocking

The current travel runtime contains compatibility destination keys whose names do not always match canonical settlement identities, including examples such as `location.saltmere` -> Aurelis, `location.westreach` -> Stonevein, and `location.crown_bastion` -> Sunspire Reach.

Treat this as **deferred travel-identity cleanup**, not as part of the Ashen reachability package. Do not rename these keys during this decision or its implementation unless a direct Ashen correctness dependency is proven. Preserve current save/runtime compatibility.

Also re-check current planning/header dates and route summaries during final coordination; refresh stale live-routing metadata when safe, but do not rewrite historical chronology merely to make dates current.

## Required Validation Plan

For `PACKAGE_READY`, specify exact focused and adjacent validation expected from the implementation run, including at minimum:

- quest-definition schema/content lint/focused tests if authored content changes;
- quest acceptance/tracking characterization;
- travel command/known-location characterization;
- production creator/publication/restart persistence;
- Ashen survey advancement/persistence/duplicate/correction/repair suites;
- injection-free representative creator-to-restart test;
- relevant Knowledge/no-proposal regression checks;
- build and TypeScript baseline comparison under current repository policy.

Preserve the distinction between tracked regression tests and removable exploratory probes.

## Required Output For `PACKAGE_READY`

Create/update one durable implementation-package decision recording:

1. exact package classification and version recommendation;
2. live owner/caller/content/schema files to change;
3. exact authored-definition strategy;
4. exact offer-admission owner and lifecycle;
5. exact access-admission owner and lifecycle;
6. accepted presentation corrections;
7. atomicity/retry/duplicate/stale/conflict/publication/restart rules;
8. exact representative test path and forbidden fixture insertions;
9. focused/adjacent validation matrix;
10. explicit exclusions and deferred generic work.

Then install a separate implementation prompt. The implementation prompt must include clean-worktree, branch, validation, commit, push, post-push verification, and handoff requirements.

Do not implement during the decision run.

## Required Output For `NO_PACKAGE`

Record the exact blocker, evidence, unsafe shortcut, and smallest next prerequisite. Keep `0.7.0` `NOT_READY`. Do not install a broad implementation prompt.

## Required Coordination And Publication

This run may change only documentation and removable temporary probes. Update current prompt/output/handoff and the permanent decision/planning/version/branch/failure-pattern authorities required to keep one coherent live route.

Commit only intended documentation/removable-probe cleanup, push `master`, fetch again, verify `HEAD == origin/master`, retrieve hosted prompt/output/handoff, inspect hosted status/check/workflow evidence, and finish with a clean worktree.

## Scope Exclusions

Do not implement quest offers, authored quest content, journal admission, known-location access, survey reachability, tracked tests, schemas, validators, serializers, migrations, UI, rewards, or turn-in during this decision; change survey balance or four-stage behavior; implement generic quests/missions/orders/favors/arcs; add generic weather triggers; add Geographic Knowledge/map/fog/recognition; redesign all travel destination ids; add generic quest/activity/effect/event/replay/correction infrastructure; add other Stakes/checkpoint/cloud/death/succession work; mutate dependencies/formats/assets/generated output; advance `0.7.0`; or mutate/integrate/close/delete/rebase/force-update branches or pull requests without a fresh controlling lifecycle trigger.
