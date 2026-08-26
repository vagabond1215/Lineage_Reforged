# Ashen Reef Survey Ordinary Reachability Implementation Package Decision

Date: 2026-08-20

Label class: unversioned documentation-only implementation-package decision

Milestone impact: `supports_current_band`

Accepted parent: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Parent acceptance authority: `950e851446fb75bfbdb717d0ea33e33ec2907d4a`

Inspected source head: `31f5b851fd0adfe878d7e8e0496d7070b6daac96`

Decision: `PACKAGE_READY`

Selected implementation: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

Starting representative classification: `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE`

`0.7.0`: `NOT_READY`

## 1. Decision

The accepted **Soundings of Ashen Reef** canon closes the authored dependency that previously required `NO_PACKAGE`. Live source now proves one bounded current-band implementation package. No further authored input, generic quest framework, generic travel redesign, reward decision, or migration is required before implementation.

`Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence` is the correct next primary. It materially adds an ordinary production creator-to-survey path, an authored quest record, two narrow engine-owned admission boundaries, and representative integration evidence. It is not a parent repair or audit suffix, and it does not independently satisfy the `0.7.0` gate.

The package must implement all of the following as one coherent unit:

1. an honest authored `quest_definition.starfall_ashen_reef_soundings` record under a narrow nullable/deferred schema correction;
2. a quest-specific new-campaign offer-staging owner that projects one Starfall contracts row into the unpublished candidate, with verified initial version-7 publication/load as the admission and availability occurrence;
3. a quest-specific access adapter inside accepted quest acceptance that atomically establishes `location.ashen_reef`;
4. a site-aware Starfall/Ashen travel-origin correction, because current source otherwise treats a Starfall creator as already at the reef;
5. directly necessary Starfall presentation corrections with versioned compatibility for retained survey authority;
6. one injection-free production creator-to-restart regression path plus the complete adjacent parent matrix.

## 2. Source Findings And Package Boundary

### 2.1 Authored definition

`packages/content/base/civilization/quest_definitions.json` is the correct static owner. The existing Brineharbor record is a different quest and must remain unchanged.

The current schema cannot express the accepted canon honestly without a bounded correction:

- production progression begins at level `0`, so current `levelMin >= 1` would create an unauthorized admission gate;
- the accepted quest has no authored hour conversion, offer deadline, or planning window, while the schema requires numbers;
- exact payout, bonus, and standing values are deliberately deferred, while the schema requires numeric reward values;
- no canonical office/person entity id exists, while `giver.entityId` is required as a string;
- action nodes require authored hours even though the accepted runtime structure is four deterministic two-tick shifts and no tick-to-hour authority exists.

The smallest honest correction is to keep the fields required while admitting explicit `null` for deliberately unspecified values:

- lower `requirements.levelMin` minimum from `1` to `0`;
- permit `giver.entityId` to be `string | null`;
- permit `scheduling.expectedDurationHours`, `dueWithinHours`, and `planningWindowHours` to be `number | null`;
- permit `rewards.coinBase`, `coinBonusOnPerfect`, and `standingBase` to be `integer | null`;
- permit action-node `estimatedHours` to be `number | null`;
- widen the matching civilization-engine TypeScript record fields without changing unrelated loaders or quest archetypes.

`null` means intentionally unauthored, deferred, or not converted from runtime ticks. It must not be normalized to zero. Existing records remain byte-for-byte unchanged and retain their numeric semantics.

### 2.2 Production offer gap

`createNewGameSnapshot(...)` builds an empty journal, then calls `initializeTargetCampaignSnapshot(...)`. `prepareNewCampaignAttempt(...)` retains that exact target snapshot before verified publication. No production writer currently appends the Ashen contract.

General snapshot synchronization is not the owner: it projects already-admitted state and would hide a new quest mutation inside unrelated accepted commands. Generic civilization offer instances also have different identities and no session-journal bridge.

The smallest owner is a pure Ashen-specific game-engine staging module invoked by `createNewGameSnapshot(...)` immediately after target initialization and before the snapshot is returned to `prepareNewCampaignAttempt(...)`. That unpublished candidate is not an active campaign and the staged row is not yet available. Verified initial version-7 publication plus authoritative load is the admission/availability occurrence required by authored canon. This two-phase boundary avoids a second post-load mutation while preserving the exact causal rule.

### 2.3 Access gap and direct travel defect

Quest acceptance already atomically changes `contracts -> active`, sets `trackedQuestId`, and returns one proposed snapshot/event. Travel already requires an exact known destination and already creates the survey operation/activity when the tracked quest arrives at `location.ashen_reef`.

The access owner therefore belongs inside accepted Ashen quest acceptance, before synchronization and before the caller submits the single proposed snapshot to campaign admission.

Current `getCurrentPlayerTravelLocationId(...)` maps every `settlement.starfall_port` position to `location.ashen_reef`. A genuine Starfall creator is consequently treated as already at the reef once access is granted. This is a direct Ashen correctness dependency, not the deferred generic destination-key cleanup.

The bounded correction is site-aware:

- Starfall plus site label `Survey Anchorage`, or legacy site label `Ashen Reef`, resolves to `location.ashen_reef`;
- other Starfall site labels resolve to the compatibility origin `settlement.starfall_port`;
- the label resolver falls back to the player's site label when the origin has no destination-catalog row;
- accepted travel continues to write `Survey Anchorage`, so downstream survey eligibility is unchanged;
- other compatibility destination keys remain untouched.

## 3. Exact Authored Record Posture

Add one and only one definition:

- `id`: `quest_definition.starfall_ashen_reef_soundings`;
- `slug`: `starfall_ashen_reef_soundings`;
- `name`: `Soundings of Ashen Reef`;
- `category`: `survey`;
- summary: the accepted post-storm civic hydrographic/pilotage commission to re-sound channels, breakers, draft-safe approaches, and ruin markers before fishing and commercial traffic intensify.

Giver:

- `type`: `government`;
- `entityId`: `null`;
- `displayName`: `Starfall Harbormaster's Office`;
- `contactName`: `Duty Harbormaster`;
- `settlementId`: `settlement.starfall_port`.

`Duty Harbormaster` remains a role label. `null` avoids manufacturing a canonical office or person identity.

Requirements and scheduling:

- `levelMin: 0`;
- all class, skill, ability, spell, trait, item, and standing requirements empty;
- all three hour fields `null`;
- `repeatable: false`;
- a descriptive post-storm/non-expiring time-sensitivity value that does not create a weather trigger or deadline.

Classification and deployment:

- routine-fieldwork rank `rank.d`, kept distinct from the zero-gate admission posture;
- moderate environmental risk, sanctioned legal posture, and no commissioned combat;
- solo-capable current-runtime posture with `1/1/1` party sizes and no invented party-role gate.

Logistics and action tree:

- no required or consumed inventory, spell, equipment, or tool state;
- old charts, departure instructions, authorization, and arranged access remain narrative source facts supplied on acceptance, not inventory grants;
- four sequential, success-only descriptive nodes: inshore approach, working reef, outer passage, and ruin-marker verification;
- `estimatedHours: null`, no fabricated checks or thresholds, and no reward effects;
- final node ends with the field packet ready for later turn-in;
- Stormglass Bloom remains incidental and is not an authored objective.

Rewards:

- all three numeric values `null`;
- item rewards and unlocks empty;
- no reputation award;
- notes state that this is a paid civic contract whose exact turn-in terms are deferred.

Do not copy Brineharbor fields, old demo `580 crown + salvage rights`, or any numeric balance inference.

## 4. Offer Staging And Admission Owner

Add a narrowly named engine module, exported through the game engine, that maps the accepted authored definition to one runtime journal row.

Recommended production surface:

- `packages/engines/game-engine/src/ashen-reef-survey-offer-staging.ts` and its `.js` bridge;
- `packages/engines/game-engine/src/index.ts`;
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`.

The module may import the authored quest-definition JSON directly, as existing browser-safe engine/app modules already do. Narrative identity and action-node labels must come from the authored definition or one exact mapper tested against it; do not copy Brineharbor or demo prose into an unrelated runtime constant.

The projected row is:

- runtime id `quest.ashen_reef_survey`;
- category `contracts`;
- title `Soundings of Ashen Reef`;
- region `Starfall Isle`;
- status `Open contract`;
- nonnumeric reward presentation such as `Paid civic contract - terms set at later turn-in`;
- objectives and related locations derived from the accepted authored record;
- untracked and with no activity mutation.

Eligibility is exact:

- target campaign source is `new_campaign`;
- authoritative start flag and current settlement identify `settlement.starfall_port`;
- no consumed Ashen row or conflicting residue exists.

Lifecycle rules:

- exact matching row: byte-stable duplicate/no-op;
- active/completed/failed row: consumed, never re-offer;
- duplicate same-id rows, conflicting same-id presentation, or survey lifecycle residue without the row: fail closed before publication;
- non-Starfall creator: ineligible/no change;
- source object remains unchanged;
- no notification, Chronicle row, activity, event, or separate publication is authored by offer admission.

The stable one-time offer identity is `(campaignId, quest.ashen_reef_survey)`. Its source facts are staged in the retained new-campaign candidate carrying `event.campaign.started` and `character.start.settlement.starfall_port`; staging alone is not admission. `prepareNewCampaignAttempt(...)` supplies lost-caller retry durability. Verified initial version-7 publication followed by authoritative load is the single offer-admission occurrence and first availability/observation. Do not add a generic offer ledger, a second post-load campaign mutation, or re-run this owner during unrelated synchronization/load.

## 5. Accepted-Quest Access Owner

Add a pure Ashen-specific access adapter and consume it only inside successful `executePlayerQuestAcceptanceCommand(...)` for `quest.ashen_reef_survey`.

Recommended production surface:

- `packages/engines/game-engine/src/ashen-reef-survey-travel-access.ts` and its `.js` bridge;
- `packages/engines/game-engine/src/player-quest-acceptance.ts`;
- `packages/engines/game-engine/src/index.ts`.

The exact known-location row is:

- `id`: `location.ashen_reef`;
- `name`: `Ashen Reef`;
- `regionId`: `region.starfall_isle`;
- `regionLabel`: `Starfall Isle`;
- `type`: `ruin` as the retained compatibility location kind;
- compatibility coordinates `68,58`;
- note limited to the survey anchorage/reef approach;
- `known: true`;
- no `settlementId`, because the anchorage is not Starfall Port and the extra settlement association would distort recovery-location ownership.

Semantics:

- absent row: establish it;
- exact row with `known: true`: retained duplicate/no-op;
- exact row with `known: false`: establish `known: true`;
- duplicate ids or materially conflicting same-id row: explicit access conflict and original snapshot;
- wrong quest, stale command, wrong player, incoherent state, or failed acceptance: no access proposal;
- adapter exception/failure: original snapshot, no accepted event, no partial quest mutation.

Acceptance facts/result/event must expose the Ashen access posture (`established` or `already_known`) and exact location id so the effect is not hidden. The accepted quest row, tracking state, access row, notification/Chronicle presentation, and event are one atomic proposed snapshot/result. `GameSessionContext` must continue applying only campaign-admitted accepted state. Publish and reload the accepted snapshot before travel.

This adapter grants only known/travelable access. It must not mutate Geographic Knowledge evidence/progress, map/fog/recognition, Codex, currency, standing, inventory, reputation beyond existing ordinary synchronization, turn-in rewards, or any of the survey owner's nine `no_proposal` fields.

## 6. Arrival Hook And Tracking Reuse

Retain the existing tracked-quest arrival hook in `player-travel.ts`:

- successful travel to `location.ashen_reef` while `quest.ashen_reef_survey` is tracked upserts `operation.quest.ashen_reef_survey`;
- the same transition sets `activity.survey.ashen_reef`.

Do not add an activity record, a separate activity-selection prerequisite, or a second arrival owner.

Quest acceptance already establishes initial tracking. The representative path must assert that accepted state. It must not issue one blind tracking toggle and accidentally untrack the quest. Existing quest-tracking suites remain adjacent authority; an explicit untrack/retrack pair is optional but unnecessary to the straight path.

## 7. Canon Presentation And Retained Authority Compatibility

Correct only presentation directly published by the implemented path:

- quest title and contracts/active objectives: `Soundings of Ashen Reef`;
- issuer/return office: `Starfall Harbormaster's Office`;
- quest/discovery region: `Starfall Isle`;
- travel destination name: `Ashen Reef`;
- Stormglass Bloom discovery/Codex region labels and tags: Starfall Isle;
- directly displayed post-survey next-step copy: Starfall office.

Update the demo's exact Ashen quest, known-location, operation/activity, office, reward-placeholder, Stormglass, and directly related records as needed by focused tests. Do not rewrite unrelated Glasswater/Saltmere content.

Do not execute or redesign the existing turn-in/reward path. Its payout and later authority remain excluded even if stale copy remains inside the unexecuted turn-in implementation.

Persisted survey receipts and projections embed some old strings. New writes must use `materialVersions.surveyContent: 2`; retained version-1 authority must remain valid under its original expected strings.

Required compatibility behavior:

- shared survey material-version type accepts `1 | 2`;
- canonical serialization preserves the stored version rather than forcing the latest value;
- semantic validation accepts both exact versions and derives expected results/receipts/projections from the request's version;
- new commands always author version 2;
- live survey synchronization uses the latest retained survey request's content version when one exists, uses version 1 for a v1-only retained graph, and uses current version 2 for new authority with no retained survey request;
- version-1 raw publication/load/restart and durable duplicate remain valid;
- an incomplete version-1 campaign can advance under version 2 without invalidating its earlier accepted graph;
- version-2 raw publication/load/restart, duplicate, correction, and projection repair remain exact;
- no migration rewrites existing version-1 evidence.

Survey balance, two-tick sequencing, owner receipts, result identities, projection order, correction/repair posture, and all nine non-proposals remain unchanged.

## 8. Injection-Free Representative Evidence

Add a tracked production-representative integration test using production creator inputs, new-campaign retention/publication, commands, campaign admission, save/load, and the real survey caller.

The path must:

1. create a character through `createNewGameSnapshot(...)` with an actually valid Starfall selection, such as `backstory.craftsmans_child`;
2. retain, publish, verify, load, and restart the initial version-7 campaign;
3. observe exactly one canonical `Soundings of Ashen Reef` contracts row and no Ashen access before acceptance;
4. accept through the production quest command and campaign admission;
5. assert acceptance-owned tracking and atomic exact Ashen access;
6. publish/load/restart before travel and prove no re-offer/duplicate row;
7. travel through the production travel command and campaign admission;
8. prove arrival alone created the survey operation and current activity;
9. execute all four shifts through `advanceAshenReefSurveyCaller`, with a publish/load/restart and empty caller cache at a mid-loop boundary;
10. publish/load/restart after shift four;
11. redeliver the fourth shift's exact request id with an empty caller cache and require durable `duplicate`, latest authoritative snapshot, and no replay;
12. assert the four ordered request/occurrence/result graphs, complete receipts, ordered projections, active unturned-in quest, 3/3 sectors plus ruins, complete operation, return activity, Stormglass discovery/Codex posture, and exact nine no-proposals;
13. assert ordinary output has no pending projection repair or correction.

The representative test must not import `demoSnapshot` or directly insert/change quest, tracked, known-location, activity, operation, sector, ruin, discovery, authority-ledger, result, receipt, event, notification, Chronicle, correction, or repair rows to create eligibility. Ordinary user selections and command ids are allowed. Deliberate malformed/repair/correction cases remain in adjacent focused suites rather than being disguised as ordinary play.

The final quest remains active and unturned-in. Currency, standing, inventory, General Lore turn-in gain, payout, and reward delivery remain unchanged.

## 9. Validation Matrix

Implementation must run and report:

1. authored content/schema:
   - schema-file tests;
   - quest objective/action-tree validation;
   - new exact authored-record and null-semantics tests;
   - normal content lint;
   - existing five definitions unchanged and Brineharbor distinct;
2. creator/offer/publication:
   - new offer-owner tests for Starfall, non-Starfall, repeat, consumed, duplicate/conflict, source immutability, target validation, failed publication, lost caller, reload, and restart;
   - character-creation and campaign-persistence/new-campaign-attempt suites;
3. acceptance/access/travel:
   - quest acceptance and tracking characterization/command suites;
   - access absent/exact/unknown/conflict/stale/atomicity/publication tests;
   - travel characterization/command suites, including Starfall origin versus Survey Anchorage and legacy Ashen site labels;
   - Normal recovery destination regression with both the Starfall settlement row and anchorage row;
4. survey parent:
   - survey characterization, command, persistence, duplicate, correction, projection-repair, and skill-gating suites;
   - version-1 retained authority plus version-2 and mixed-version cases;
   - exact nine-field no-proposal/Knowledge regressions;
   - Normal defeat/recovery preservation;
5. representative integration:
   - the injection-free creator-to-final-restart test above;
6. adjacent persistence:
   - save/load roundtrip and campaign publication suites;
7. repository gates:
   - production Vite build;
   - bounded TypeScript capture compared to the freshly reproduced repository baseline, with no new diagnostic in changed files;
   - TS/JS bridge/export parity, `git diff --check`, scoped status, and clean post-push synchronization.

Exploratory probes must be removable and reported separately from tracked regression evidence.

## 10. Exact Implementation Surface

Expected production/content/schema surface, subject to live-call proof during implementation:

- `packages/content/base/civilization/quest_definitions.json`;
- `packages/schemas/civilization/quest-definition.schema.json`;
- `packages/engines/civilization-engine/src/content.ts`;
- new Ashen offer-staging and access-admission engine modules plus required `.js` bridges;
- `packages/engines/game-engine/src/index.ts`;
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`;
- `packages/engines/game-engine/src/player-quest-acceptance.ts`;
- `packages/engines/game-engine/src/player-travel-rules.ts`;
- `packages/engines/game-engine/src/player-travel.ts` only for directly necessary Ashen presentation, not arrival ownership redesign;
- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`;
- `packages/engines/game-engine/src/player-survey-activity-advancement.ts`;
- `packages/engines/game-engine/src/campaign-rules.ts`;
- `packages/shared/types/src/contracts.ts` for the survey-content version union only;
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts` only for directly displayed next-step copy, not turn-in behavior;
- `apps/rpg-ui/src/runtime/demoSnapshot.ts` only for directly conflicting Ashen fixture/presentation facts;
- focused and representative tracked tests named above.

`saveManager.ts`, `campaign-session.ts`, migrations, shared save format, UI components, and event registries are conditional only if compilation or direct caller evidence proves an unavoidable bounded need. Do not edit them speculatively.

## 11. Atomicity, Retry, And Publication Rules

- Offer facts are staged before the first retained new-campaign snapshot, but admission/availability occurs only at verified initial publication/load; publication failure exposes no offer authority.
- New-campaign retry reuses the retained exact campaign/character/offer state and must not mint a second offer occurrence.
- Quest acceptance and Ashen access are one command result and one campaign-admitted mutation.
- Stale, wrong-player, malformed, incoherent, access-conflict, or campaign-admission failure returns/applies the original authoritative state and emits no accepted access effect.
- Exact access retry is idempotent; acceptance cannot duplicate the location row.
- Travel only consumes the published known row and never authors access.
- Survey retry behavior remains request-derived, durable, duplicate-safe, and latest-snapshot returning.
- Every publication boundary uses existing version-7 candidate verification/readback/head authority; no new save format or migration is authorized.

## 12. Exclusions

This package does not:

- implement turn-in, payout, reward balance, standing, salvage, items, services, or quest turn-in/completion receipts;
- create a generic quest offer, mission, order, favor, arc, activity, travel-access, effect, event, replay, correction, or migration framework;
- add a weather trigger or contract expiry clock;
- add Geographic Knowledge/map/fog/recognition/Codex access authority;
- change survey balance, stages, skill policy, body/resource/stat effects, correction, projection order, or receipt ownership;
- globally rename compatibility travel keys;
- seed the quest outside exact Starfall new-campaign context or backfill old campaigns;
- add activity-record selection to the straight path;
- advance `0.7.0` or claim representative acceptance before implementation and independent audit.

## 13. Failure Patterns And Branch Posture

Applicable guardrails are `FP-001`, `FP-002`, `FP-005`, `FP-008`, `FP-009`, `FP-011`, `FP-012`, `FP-013`, `FP-014`, and `FP-017`:

- test the real creator, caller, admission, publication, restart, duplicate, and repair paths;
- do not let green fixture suites substitute for reachability;
- preserve request identity and retry classifications;
- keep Connector/branch artifacts as evidence;
- distinguish inspected, decision, implementation, pushed, and hosted heads;
- prove provenance and source-before-mutation;
- deep-validate exact retained authority and content-version semantics;
- preserve nested survey authority across defeat/recovery;
- do not treat schema shape, demo copy, static content, known location, Knowledge, or map presentation as interchangeable;
- forbid eligibility injection in the representative test.

No new generalized failure-pattern entry is required; the existing register already covers the newly observed omissions.

Fresh orientation found one local branch, 37 non-default remote branches, and exactly two open pull requests. PR #2 and PR #3 remain `SUPERSEDED_PRESERVE_EVIDENCE`; the four survey evidence refs remain `CANDIDATE_INTEGRATION` for broader consumers; integrated-gameplay readiness remains `PROTECTED_REFERENCE`; and the administration evidence branch remains `HOLD_NAMED_CONSUMER`. No integration, deletion, closure, rebase, or disposition change is triggered by this package decision.

## 14. Next Route

Execute only:

`Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

After implementation, install a separate production-read-only `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`. The implementation run may report `IMPLEMENTED_PENDING_PARENT_AUDIT`; it may not self-accept representative-loop evidence or advance `0.7.0`.

## 15. Version 0.6.11 Implementation Appendix

Date: 2026-08-26

Synchronized implementation starting head: `f68242fae03b22001a73e3a440ccdbf830347aba`

Connector-evidence correction commit: `b54ea65b6fddf029f4fb12ea82c5cdc9f8c1e62a`

Implementation commit: `3ca23d6864541a899ea61a6bf26257665f754e78`

Disposition: `IMPLEMENTED_PENDING_PARENT_AUDIT`

The bounded package is implemented. Production now owns the exact Starfall Soundings quest definition, initial new-campaign offer staging, atomic accepted-quest Ashen Reef access admission, site-aware direct Starfall/Ashen travel, versioned canonical survey presentation with retained version-1 compatibility, and an injection-free creator-through-final-restart representative path. The implementation preserves the accepted four-shift survey authority, exact result and receipt identities, duplicate/retry behavior, correction/repair seams, accepted-only caller application, persistence, defeat/recovery preservation, and every named non-proposal.

The final scoped matrix passed `1072/1072`, the final adversarial probe passed `24/24`, normal content lint passed for 71 files, the production Vite build completed for 219 modules, and bounded TypeScript retained the exact 137-diagnostic baseline with no new diagnostic tuple. `git diff --check` passed apart from repository line-ending warnings.

Run only `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit` next. This appendix is implementation evidence, not independent acceptance. `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE` remains controlling until that audit, survey turn-in/rewards remain excluded, and `0.7.0` remains `NOT_READY`.
