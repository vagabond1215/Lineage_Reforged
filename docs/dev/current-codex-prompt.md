# Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence

Date: 2026-08-20

Label class: primary current-band implementation

Parent version: not applicable

Milestone impact: `advances_current_band`

Execution posture: repository-first implementation, validation, coordination, commit, push, and hosted verification

Package authority: `docs/design/ashen-reef-survey-ordinary-reachability-implementation-package-decision.md`

Accepted authored canon: `docs/design/ashen-reef-soundings-authored-canon-decision.md`

Accepted survey parent: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Parent acceptance authority: `950e851446fb75bfbdb717d0ea33e33ec2907d4a`

Starting representative classification: `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE`

## Objective

Implement the smallest coherent production package that makes **Soundings of Ashen Reef** ordinarily reachable from a real Starfall character creation, preserves every accepted downstream survey contract, and adds one injection-free creator-to-final-restart regression path.

Complete the package end to end. Do not stop after static content, offer admission, access admission, travel, presentation, or tests in isolation.

At implementation completion report only:

`IMPLEMENTED_PENDING_PARENT_AUDIT`

and install a separate production-read-only:

`Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

The implementation run must not self-accept representative-loop evidence. `0.7.0` remains `NOT_READY`.

## Authority And Orientation

Read `AGENTS.md` completely and follow the repository-first protocol, prompt-execution policy, branch policy/register, and applicable failure-pattern register.

Read completely before editing:

- current prompt, handoff, and prior Codex output;
- `docs/design/ashen-reef-survey-ordinary-reachability-implementation-package-decision.md`;
- `docs/design/ashen-reef-soundings-authored-canon-decision.md`;
- `docs/design/quest-identity-offer-context-and-travel-access-product-direction.md`;
- the earlier ordinary-reachability dependency decision;
- permanent survey acceptance audit and appendices;
- quest definition/objective authority;
- quest acceptance/tracking authority;
- player travel/known-location authority;
- survey scope/owner, occurrence/result/receipt, persistence, and nine-field `no_proposal` authorities;
- current planning/version/branch/failure-pattern authorities.

Fetch/prune and synchronize clean `master`. Record separately the inspected base, implementation starting head, implementation commit, coordination commit if separate, pushed remote head, post-fetch local/tracking head, and hosted prompt/output/handoff identities.

Inventory all local/remote branches and open pull requests. Preserve protected/evidence/superseded refs. No branch/PR lifecycle mutation is authorized unless a fresh controlling trigger proves it due.

Use subagents only for bounded, separable read-only inspection or post-implementation adversarial review. The primary agent owns every edit, package reconciliation, final classification, commit, push, and hosted verification. Reverify material subagent claims against the synchronized checkout.

Begin with a clean worktree. Preserve unrelated user changes if any appear; stop rather than overwrite an overlapping change.

## Controlling Canon - Do Not Reopen

- authored definition id: `quest_definition.starfall_ashen_reef_soundings`;
- runtime quest id: `quest.ashen_reef_survey`;
- title: **Soundings of Ashen Reef**;
- issuer: **Starfall Harbormaster's Office**;
- contact role label: **Duty Harbormaster**;
- context: `settlement.starfall_port`, `region.starfall_isle`;
- one-time non-expiring-before-acceptance post-storm civic hydrographic/pilotage contract;
- no hard level, class, reputation, magic, skill, or weather-event gate;
- four deterministic survey shifts: inshore approach, working reef, outer passage, ruin-marker verification;
- Stormglass Bloom is incidental discovery, not the commissioned objective;
- Brineharbor's charter is separate;
- exact payout/bonus/standing/item/salvage/service terms are deferred;
- old `580 crown + salvage rights` is non-canonical;
- offer presentation does not grant access;
- accepted quest acceptance supplies charts, instructions, authorization, and arranged access;
- `location.ashen_reef` is a compatibility key for the reef anchorage/approach, not identity equality with Starfall Port;
- survey turn-in/reward execution remains excluded.

Do not ask for further authored input merely because the current schema requires fields that the accepted canon deliberately leaves deferred.

## Required Implementation

### 1. Honest authored quest definition

Add exactly one record to `packages/content/base/civilization/quest_definitions.json` for `quest_definition.starfall_ashen_reef_soundings`. Keep every existing record, especially `quest_definition.brineharbor_reef_soundings`, byte-equivalent except for unavoidable surrounding JSON punctuation.

Apply the bounded schema/type correction from the package decision:

- `requirements.levelMin` minimum becomes `0`;
- `giver.entityId` admits `null`;
- `scheduling.expectedDurationHours`, `dueWithinHours`, and `planningWindowHours` admit `null`;
- `rewards.coinBase`, `coinBonusOnPerfect`, and `standingBase` admit `null` while retaining integer semantics when present;
- action-node `estimatedHours` admits `null`;
- widen the matching civilization-engine TypeScript record fields only where consumed.

Do not broaden quest archetypes, infer numeric defaults, translate survey ticks into hours, or normalize `null` to zero.

The new definition must use:

- slug `starfall_ashen_reef_soundings`;
- title `Soundings of Ashen Reef`;
- category `survey`;
- exact accepted civic hydrographic/pilotage summary;
- giver type `government`, `entityId: null`, display `Starfall Harbormaster's Office`, contact `Duty Harbormaster`, settlement `settlement.starfall_port`;
- `levelMin: 0` and empty class/skill/ability/spell/trait/item/standing requirements;
- three null hour fields, `repeatable: false`, and descriptive post-storm/non-expiring timing posture without an executable trigger;
- `rank.d` as routine field work with manageable danger, moderate environmental risk, sanctioned legal posture, and no commissioned combat; keep this descriptive classification distinct from zero-gate admission;
- current solo runtime posture `1/1/1` without a party-role gate;
- no required/consumed tools, equipment, spells, or inventory;
- three null numeric reward fields, empty item/unlock arrays, no reputation award, and a note that paid civic terms are deferred;
- four sequential success-only descriptive action nodes with null hours, no fabricated checks/thresholds/reward effects, and a final field-packet-ready outcome.

Keep Stormglass Bloom outside the objective tree.

### 2. New-campaign offer staging and admission

Add a pure Ashen-specific game-engine staging owner, recommended name:

- `packages/engines/game-engine/src/ashen-reef-survey-offer-staging.ts`;
- matching `.js` bridge;
- public game-engine export.

Invoke it from `createNewGameSnapshot(...)` immediately after `initializeTargetCampaignSnapshot(...)` and before the snapshot is returned to `prepareNewCampaignAttempt(...)`. This creates only an unpublished candidate. The staged row is not available and the campaign is not active until verified initial version-7 publication followed by authoritative load; that publication/load boundary is the single offer-admission occurrence required by canon. Do not add a second post-load mutation.

The owner must map the actual authored definition to one runtime `quest.ashen_reef_survey` `contracts` row. It may import the JSON using the repository's existing browser-safe JSON import pattern. Do not copy Brineharbor or demo prose.

Eligibility requires a coherent target campaign with `campaignRules.source === "new_campaign"`, an authoritative Starfall start flag and current settlement, and no conflicting/consumed Ashen lifecycle residue.

The output row uses title `Soundings of Ashen Reef`, region `Starfall Isle`, status `Open contract`, nonnumeric paid-civic/deferred-terms reward presentation, exact objectives and related locations from the accepted record/mapping, and no tracking or activity mutation.

Semantics:

- exact row is a byte-stable duplicate/no-op;
- active/completed/failed row is consumed and never re-offered;
- duplicate ids, conflicting same-id state, or survey lifecycle residue without the row fails closed before publication;
- non-Starfall creation remains unchanged;
- source snapshot remains unchanged;
- no offer notification, Chronicle row, activity, event, generic ledger, second publication, load-time backfill, or synchronization-time mutation.

The first retained version-7 new-campaign candidate carries durable staged provenance. Lost-caller retry must return its exact campaign/character/offer identity. Verified publication plus authoritative load is the durable admission/availability occurrence.

### 3. Accepted-quest Ashen access

Add a pure quest-specific access adapter, recommended name:

- `packages/engines/game-engine/src/ashen-reef-survey-travel-access.ts`;
- matching `.js` bridge;
- public game-engine export.

Consume it only inside successful `executePlayerQuestAcceptanceCommand(...)` for `quest.ashen_reef_survey`, before synchronization and before the one accepted result is handed to campaign admission.

Exact row:

- `id: "location.ashen_reef"`;
- `name: "Ashen Reef"`;
- `regionId: "region.starfall_isle"`;
- `regionLabel: "Starfall Isle"`;
- `type: "ruin"`;
- `x: 68`, `y: 58`;
- note limited to the survey anchorage/approach;
- `known: true`;
- omit `settlementId`.

Semantics:

- absent: establish;
- exact known row: `already_known` no-op;
- exact unknown row: establish known;
- duplicate or conflicting same-id row: explicit conflict, original snapshot;
- stale/wrong-player/malformed/incoherent/rejected acceptance: no access proposal;
- transition failure: original snapshot, no event, no partial quest/access state.

Expose exact `locationId` and `established | already_known` posture through the Ashen acceptance plan/result/event facts. Acceptance, tracking, access, notification/Chronicle, and accepted event remain one proposed mutation. Preserve accepted-only application through the current campaign admission caller.

Do not mutate Geographic Knowledge, Knowledge evidence/progress, map/fog/recognition, Codex, currency, standing, inventory, reputation beyond existing synchronization, turn-in rewards, or any survey non-proposal.

### 4. Starfall versus Ashen travel identity

Correct only the direct Ashen collision in `player-travel-rules.ts`:

- `settlement.starfall_port` plus `Survey Anchorage` or legacy `Ashen Reef` site label resolves to `location.ashen_reef`;
- other Starfall site labels resolve to compatibility origin `settlement.starfall_port`;
- current-location label falls back to the player's site label for an origin without a destination catalog row;
- `location.ashen_reef` destination name is `Ashen Reef`;
- accepted travel continues to set site label `Survey Anchorage`.

Do not rename or clean up other compatibility destination ids.

Reverify that tracked accepted arrival still directly upserts `operation.quest.ashen_reef_survey` and sets `activity.survey.ashen_reef`. Do not add an activity-record or activity-selection edge.

Quest acceptance already tracks the quest. Do not blindly issue one tracking toggle in the representative path. Preserve adjacent tracking behavior and tests.

### 5. Canon presentation and versioned survey content

Correct directly published Ashen presentation to Starfall canon in the smallest live surfaces:

- quest/contracts/active objectives and title;
- Starfall Harbormaster's Office return copy;
- Starfall Isle quest/discovery/Codex region copy;
- `Ashen Reef` destination name;
- directly displayed final-survey next-step copy;
- exact Ashen demo fixtures required by focused characterization.

Do not edit or execute the excluded turn-in/reward implementation merely to remove its old payout copy, and do not rewrite unrelated Glasswater/Saltmere records.

Retained survey authority embeds old strings. Introduce content version 2 without rewriting old evidence:

- shared `surveyContent` type admits `1 | 2`;
- new commands author `2`;
- canonical serialization preserves `1` or `2` exactly;
- deep validation derives expected material facts, receipts, notifications, Chronicle rows, operation/activity, quest progress, discovery, and Codex presentation from the request's content version;
- live survey synchronization uses the latest retained request's content version, preserves v1 presentation for a v1-only graph, and defaults new/no-request authority to v2;
- version-1 raw authority remains publishable/loadable/retryable under original strings;
- version-2 authority uses the accepted Starfall strings;
- incomplete version-1 authority can continue with a version-2 request while every earlier result remains valid;
- no migration rewrites version-1 requests/results/receipts/projections.

Do not change stage balance, two one-tick body/stat/resource sequencing, skill policy, identities, receipt sets, projection total order, correction/repair posture, or the exact nine-field non-proposal object.

### 6. Injection-free representative integration test

Add one tracked test under the repository's integration test surface. It must use production creator, new-campaign attempt, version-7 publication/load, command, campaign admission, travel, and `advanceAshenReefSurveyCaller` boundaries.

Required path:

1. create a valid Starfall character with an ordinary production selection such as `backstory.craftsmans_child`;
2. retain/publish/verify/load/restart initial version 7;
3. assert one canonical contracts row and no Ashen access;
4. accept via the production command and campaign admission;
5. assert acceptance-owned tracking and atomic Ashen access;
6. publish/load/restart before travel and assert no re-offer;
7. travel via the production command and campaign admission;
8. assert arrival-owned operation/activity;
9. run all four shifts through the production caller, with a mid-loop publish/load/restart and empty caller cache;
10. publish/load/restart after shift four;
11. redeliver the fourth shift's exact request id with an empty cache and require durable duplicate, latest state, and no replay;
12. assert ordered request/occurrence/result/receipt/projection authority, 3/3 plus ruins, complete operation, return activity, active unturned-in quest, Stormglass discovery/Codex posture, exact nine non-proposals, and no pending ordinary repair/correction.

Forbidden eligibility shortcuts:

- no `demoSnapshot`;
- no direct insertion or mutation of quest, tracking, known-location, activity, operation, sector, ruin, discovery, survey ledger, request, occurrence, result, receipt, event, notification, Chronicle, correction, or repair rows.

Keep deliberate corruption, correction, and projection-repair tests in the adjacent focused suites. The representative path must end before turn-in and prove currency, standing, inventory, General Lore turn-in gain, payout, and reward delivery unchanged.

## Required Tests And Checks

Run, at minimum:

- `tests/unit/schema-files.test.mjs`;
- `tests/unit/quest-objective-condition-validation.test.mjs`;
- new authored-record/schema-null tests;
- normal content lint;
- new offer-admission tests;
- character-creation identity/form/profile tests relevant to the Starfall selection;
- new-campaign attempt and `tests/unit/campaign-persistence-foundation.test.mjs` coverage;
- quest acceptance and tracking command/characterization tests;
- travel command/characterization tests;
- Normal recovery destination and survey-authority preservation tests;
- survey characterization, command, persistence, skill-gating, duplicate, correction, and projection-repair tests;
- Knowledge/no-proposal regression tests;
- `tests/simulation/save-load-roundtrip.test.mjs`;
- the new injection-free representative integration test;
- the production Vite build;
- a fresh bounded TypeScript baseline capture and post-change comparison with no new changed-file diagnostic;
- TS/JS bridge and public-export parity checks;
- `git diff --check`, scoped diff/status, and artifact cleanup.

Add tracked adversarial cases for Starfall/non-Starfall offer admission; exact offer repeat, consumed lifecycle, duplicate/conflict, residue, source immutability, publication failure, lost caller, and restart; access absent/exact/unknown/duplicate/conflict/stale/atomic failure; Starfall origin, anchorage destination, and legacy Ashen site-label recognition; version-1, version-2, and mixed-version survey authority through raw serialization/publication/restart/duplicate/repair; exact non-proposal and reward/turn-in exclusions; and a representative-path forbidden-fixture source guard where useful.

Tracked tests are acceptance evidence. Any temporary probe must be removable, separately labeled, and deleted before commit.

## Failure Patterns To Apply

Apply and report evidence for:

- `FP-001`: real creator/caller/admission/publication path;
- `FP-002`: green fixture tests do not replace representative evidence;
- `FP-005`: retained caller/request identity and durable retry;
- `FP-008`: Connector/branch artifacts remain evidence only;
- `FP-009`: exact inspected/implementation/pushed/hosted identities;
- `FP-011`: provenance and source-before-mutation;
- `FP-012`: deep exact authority/content-version validation;
- `FP-013`: survey authority survives every ledger rewrite and defeat/recovery path;
- `FP-014`: static definition, journal state, known location, Knowledge, map, and presentation are non-equivalent;
- `FP-017`: no injected eligibility in representative evidence.

If implementation reveals a new reusable omission, update the generalized register once and link the focused evidence. Do not duplicate a one-off narrative as a new pattern.

## Scope Exclusions

Do not implement turn-in, payout, reward delivery, balance, standing, salvage, service, item, or quest turn-in/completion receipts; create generic quest/mission/order/favor/arc offer infrastructure; create generic travel-access, activity, effect, event, replay, correction, or migration infrastructure; add weather triggers, deadlines, expiry, or re-offer systems; add Geographic Knowledge/map/fog/recognition/Codex access authority; redesign all travel destination ids; seed Ashen outside exact Starfall new-campaign context or backfill older campaigns; change survey costs, stages, body/resource/stat/skill balance, receipt owners, correction, or projection ordering; refactor unrelated code or add production dependencies; mutate protected/evidence/superseded branches or PRs without a fresh trigger; advance `0.7.0`; or claim parent/representative acceptance.

## Required Coordination And Completion

After implementation and validation:

1. update the package decision with an implementation appendix, but do not rewrite its decision history;
2. update permanent survey acceptance/reachability appendices only for the new implementation posture;
3. update current output, handoff, historical register, planning anchor, branch register, and lower-precedence live headers required to keep one route;
4. install a separate production-read-only `Version 0.6.11.1` audit prompt;
5. record exact files changed, tests/checks, baseline comparison, failure-pattern evidence, branch/PR review, risks, and suggested commit message;
6. commit only intended work, push `master`, fetch/prune again, and verify `HEAD == origin/master`;
7. retrieve hosted prompt/output/handoff and inspect hosted status/check/workflow evidence;
8. finish with a clean worktree and no removable artifacts or unnecessary background processes.

If a material contract cannot be implemented safely within this package, fail closed with exact evidence. Do not silently omit one owner or substitute fixture evidence.
