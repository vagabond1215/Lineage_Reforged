# Connector Preflight Evidence Packet - Version 0.6.11.1 Acceptance Audit

Date: 2026-08-26

Status: connector-prepared orientation evidence; documentation only; **not acceptance authority**

Active route: `Version 0.6.11.1 - Ashen Reef Survey Ordinary Reachability And Representative Loop Acceptance Audit`

Evidence source head: `06b633ef4523aa19ca69749e003581d0892e37c2`

Installed prompt blob at evidence source head: `064749af0435e839df71fe4619ccc30d7ce4ff35`

## 1. Independence Boundary

This packet exists only to reduce avoidable repository discovery during a constrained high-reasoning acceptance run.

It does **not** establish any of these outcomes:

- `PARENT_ACCEPTED`;
- `REPAIR_REQUIRED`;
- `REPRESENTATIVE_LOOP_ACCEPTED`;
- `REPRESENTATIVE_LOOP_EVIDENCE_INCOMPLETE` as a final audit result;
- `0.7.0` readiness or assignment.

The installed audit remains the sole owner of the parent and representative decisions. Green implementation tests, implementation reports, Connector inspection, this packet, and prior subagent findings are evidence inputs only.

Use these evidence labels throughout this packet:

- **`CONNECTOR_VERIFIED_STRUCTURE`** — current hosted source/file/ref structure inspected through the GitHub Connector. This does not prove local execution semantics.
- **`IMPLEMENTATION_CLAIM_TO_REPRODUCE`** — a result reported by the `0.6.11` implementation that the independent audit must reproduce or independently supersede.
- **`CODEX_MUST_VERIFY_LOCALLY`** — executable, local-worktree, semantic, adversarial, persistence, or final-publication evidence reserved to the independent audit.

## 2. Exact Commit Chain And Delta

### Parent implementation chain

| Role | Commit |
| --- | --- |
| `0.6.11` implementation starting head | `f68242fae03b22001a73e3a440ccdbf830347aba` |
| Connector evidence correction | `b54ea65b6fddf029f4fb12ea82c5cdc9f8c1e62a` |
| `0.6.11` implementation | `3ca23d6864541a899ea61a6bf26257665f754e78` |
| implementation coordination / `0.6.11.1` routing | `b63fc13d9574b419a8ac934db454db035eeaa146` |

`CONNECTOR_VERIFIED_STRUCTURE`: the correction commit changes only three documentation lines: one trailing-space cleanup and replacement of an incorrect Connector Pass 2 planning SHA with exact `61a74707a22a5e4f85ac9d1492f35da3bd7dcda8`.

### Post-implementation workflow delta

Between `b63fc13d9574b419a8ac934db454db035eeaa146` and this packet's evidence source head `06b633ef4523aa19ca69749e003581d0892e37c2`, exactly five commits/files-of-concern were added or updated and **all are workflow documentation**:

- added `docs/dev/codex-resource-budget-and-execution-slicing-policy.md`;
- updated `docs/dev/repository-first-agent-work-protocol.md`;
- updated `docs/dev/prompt-execution-platform-tool-selection-policy.md`;
- updated `docs/dev/gpt-connector-assistance-policy.md`;
- added `docs/dev/connector-preflight-0.6.11.1-acceptance-audit-plan.md`.

No production source, shared contract, schema, authored content, tracked test, migration, dependency, asset, generated output, current prompt, current output, or current handoff changed in that delta.

`CODEX_MUST_VERIFY_LOCALLY`: after fetch/prune, verify the synchronized local head and inspect the complete delta from `b63fc13...` or this packet head if anything newer exists. If a newer commit changes production/test/schema/content or the active route, this packet is stale and must be refreshed or narrowed before reliance.

## 3. `0.6.11` Changed-Surface Inventory

The implementation delta from `f68242fa...` through `b63fc13...` spans the following material groups.

### A. Authored definition / schema / static typing

- `packages/content/base/civilization/quest_definitions.json`
- `packages/schemas/civilization/quest-definition.schema.json`
- `packages/engines/civilization-engine/src/content.ts`
- `packages/shared/types/src/contracts.ts`
- `tests/unit/ashen-reef-survey-authored-content.test.mjs`

### B. Offer staging / new-campaign creator / admission

- `packages/engines/game-engine/src/ashen-reef-survey-offer-staging.ts`
- `packages/engines/game-engine/src/ashen-reef-survey-offer-staging.js`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `packages/engines/game-engine/src/campaign-rules.ts`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/ashen-reef-survey-offer-staging.test.mjs`
- `tests/unit/campaign-persistence-foundation.test.mjs`
- `tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs`

### C. Quest acceptance / travel-access atomicity

- `packages/engines/game-engine/src/ashen-reef-survey-travel-access.ts`
- `packages/engines/game-engine/src/ashen-reef-survey-travel-access.js`
- `packages/engines/game-engine/src/player-quest-acceptance.ts`
- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`
- `packages/engines/game-engine/src/index.ts`
- `tests/unit/ashen-reef-survey-travel-access.test.mjs`
- `tests/unit/player-quest-acceptance-characterization.test.mjs`
- `tests/unit/player-quest-tracking-characterization.test.mjs`
- `tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs`

### D. Starfall/Ashen travel identity and real arrival owner

- `packages/engines/game-engine/src/player-travel-rules.ts`
- `packages/engines/game-engine/src/player-travel.ts`
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`
- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`
- `tests/unit/ashen-reef-survey-travel-access.test.mjs`
- `tests/unit/player-travel-characterization.test.mjs`
- `tests/unit/player-activity-selection-characterization.test.mjs`
- `tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs`

### E. Versioned survey presentation / persistence / validation

- `packages/engines/game-engine/src/ashen-reef-survey-content.ts`
- `packages/engines/game-engine/src/ashen-reef-survey-content.js`
- `packages/engines/game-engine/src/player-survey-activity-advancement.ts`
- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`
- `packages/engines/game-engine/src/campaign-rules.ts`
- `apps/rpg-ui/src/runtime/demoSnapshot.ts`
- `tests/unit/ashen-reef-survey-authored-content.test.mjs`
- `tests/unit/player-survey-activity-advancement-characterization.test.mjs`
- `tests/unit/player-survey-activity-advancement-persistence.test.mjs`
- `tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs`

### F. Representative-loop evidence and parent retention

- `tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs`
- `tests/unit/player-survey-activity-advancement-persistence.test.mjs`
- adjacent campaign publication, acceptance/tracking, travel, activity-selection, survey command/characterization, save/load, Knowledge/non-proposal, correction/repair, and Normal defeat/recovery tests named by the installed prompt and implementation output.

`CODEX_MUST_VERIFY_LOCALLY`: inspect the complete `b54ea65...` and `3ca23d6...` diffs and every changed production/test file required by the installed prompt. The grouping above is an orientation map, not permission to skip the prompt's mandatory changed-file review.

## 4. Audit Section 1 - Authored Definition And Schema Honesty

### Connector-verified source/test map

Primary source:

- `packages/content/base/civilization/quest_definitions.json`
- `packages/schemas/civilization/quest-definition.schema.json`
- `packages/engines/civilization-engine/src/content.ts`
- `packages/shared/types/src/contracts.ts`

Tracked evidence:

- `tests/unit/ashen-reef-survey-authored-content.test.mjs`
- normal content lint / quest objective-action-tree validation selected by the audit.

### `CONNECTOR_VERIFIED_STRUCTURE` facts

The authored-content test currently asserts:

- definition record count `6`;
- the original five definitions remain first and in this exact order:
  1. `quest_definition.brineharbor_reef_soundings`
  2. `quest_definition.coppergate_ore_train_relief`
  3. `quest_definition.highcrown_catacomb_quietus`
  4. `quest_definition.aurelis_counterfeit_ring`
  5. `quest_definition.gullsreach_smokehouse_extortion`;
- new definition `quest_definition.starfall_ashen_reef_soundings`;
- slug `starfall_ashen_reef_soundings`;
- name `Soundings of Ashen Reef`;
- category `survey`;
- giver:
  - type `government`;
  - `entityId: null`;
  - display `Starfall Harbormaster's Office`;
  - contact `Duty Harbormaster`;
  - `settlement.starfall_port`;
- hard admission posture:
  - `levelMin: 0`;
  - empty class/skill/ability/spell/trait/item/standing gates;
- scheduling:
  - duration/due/planning `null`;
  - non-repeatable;
- descriptive classification rank `rank.d`;
- party posture `1 / 1 / 1`, solo;
- empty logistics;
- reward coin/bonus/standing `null`, item/unlock/reputation arrays empty;
- no `580 crown` or `salvage rights` in the new authored record.

The action tree is four sequential descriptive nodes:

1. `record_inshore_approach` / Inshore Approach;
2. `survey_working_reef` / Working Reef;
3. `survey_outer_passage` / Outer Passage;
4. `verify_ruin_markers` / Ruin Markers.

Each has `estimatedHours: null`, participant `1/1`, no assigned roles, no checks, and no success effects. Stormglass Bloom is absent from the objective tree.

The tracked test asserts the schema widens only these relevant semantics:

- requirements `levelMin.minimum = 0`;
- giver `entityId` allows string/null;
- expected duration / due / planning allow number/null;
- reward coin base / perfect bonus / standing base allow integer/null;
- action-node estimated hours allow number/null.

### `CODEX_MUST_VERIFY_LOCALLY`

- Compare the first five authored records semantically against the pre-implementation parent, not merely by ID/order.
- Independently inspect exact schema/type widening and reject any broader accidental permissiveness.
- Run normal content lint and objective/action-tree validation against the real authored file.
- Confirm no fabricated defaults and no archetype/template semantic change.

## 5. Audit Section 2 - Offer Staging And Initial Admission

### Connector-verified source/test map

Primary source:

- `packages/engines/game-engine/src/ashen-reef-survey-offer-staging.ts`
- `apps/rpg-ui/src/game-shell/newGameSnapshot.ts`
- `packages/engines/game-engine/src/campaign-rules.ts`
- new-campaign attempt coordinator and save-manager caller path named by the integration test.

Tracked evidence:

- `tests/unit/ashen-reef-survey-offer-staging.test.mjs`
- `tests/unit/campaign-persistence-foundation.test.mjs`
- `tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs`.

### `CONNECTOR_VERIFIED_STRUCTURE` facts

Offer identities:

- authored definition: `quest_definition.starfall_ashen_reef_soundings`;
- runtime quest/row: `quest.ashen_reef_survey`.

Canonical staged row is a `contracts` journal entry titled `Soundings of Ashen Reef`, Starfall Isle, untracked, with deferred paid-civic terms and objectives derived from the authored action-tree nodes.

`stageAshenReefSurveyOffer(...)` exposes these lifecycle codes:

- `staged`;
- `duplicate`;
- `consumed`;
- `ineligible`;
- `conflict`.

Current source fail-closes on:

- more than one matching quest row;
- non-exact authored `contracts` presentation;
- survey lifecycle residue with no quest row.

An existing non-`contracts` row is treated as consumed. An exact authored contract is a duplicate. Eligibility requires coherent target new-campaign state plus Starfall start event/flags and current Starfall settlement.

The staging helper clones/appends its output and does not mutate the input snapshot directly.

Tracked tests currently assert ordinary Starfall creation stages exactly one offer without Ashen known-location access, tracking, or operation; source purity/idempotency/consumed cases; duplicate/presentation/residue conflicts; and non-Starfall/non-new-campaign ineligibility.

### `CODEX_MUST_VERIFY_LOCALLY`

Fresh audit proof must additionally cover the installed prompt's initial-publication boundary:

- staging placement immediately after target initialization and before retention/publication;
- no second publication or load-time/backfill mutation;
- campaign/character/offer/attempt identity through publication failure, lost caller, retry, authoritative load, and restart;
- source immutability through failed publication/retry;
- exact initial version-7 publication/load as admission/availability occurrence.

Run an independent removable publication-failure/retry probe; do not treat the tracked staging unit tests as sufficient.

## 6. Audit Section 3 - Accepted-Quest Access Atomicity

### Connector-verified source/test map

Primary source:

- `packages/engines/game-engine/src/ashen-reef-survey-travel-access.ts`
- `packages/engines/game-engine/src/player-quest-acceptance.ts`
- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`
- campaign mutation admission owner in `campaign-rules.ts`.

Tracked evidence:

- `tests/unit/ashen-reef-survey-travel-access.test.mjs`
- quest acceptance/tracking characterization tests;
- representative integration test.

### `CONNECTOR_VERIFIED_STRUCTURE` exact access row

`ASHEN_REEF_SURVEY_ACCESS_LOCATION` is:

- `id: location.ashen_reef`;
- `name: Ashen Reef`;
- `regionId: region.starfall_isle`;
- `regionLabel: Starfall Isle`;
- `type: ruin`;
- `x: 68`;
- `y: 58`;
- note: `Survey anchorage and reef approach authorized for Soundings of Ashen Reef.`;
- `known: true`;
- **no `settlementId` property**.

Adapter semantics visible from current source:

- unrelated quest -> `applies:false`, no mutation;
- absent row -> append exact row, posture `established`;
- exact `known:false` row -> switch to true, posture `established`;
- exact known row -> no mutation, posture `already_known`;
- duplicate or conflicting facts -> `travel_access_conflict`, source snapshot returned.

Quest acceptance source currently:

- checks the adapter at plan time;
- clones the source only after plan acceptance;
- moves the quest to active, tracks it, prepares activity, notification and Chronicle;
- applies the adapter again to the cloned candidate;
- on access conflict returns the original source snapshot with no event;
- synchronizes the candidate only after access succeeds;
- catches downstream transition failures and returns the original source snapshot.

The tracked access test includes a post-plan transition failure by making `playerState.skills` invalid; it asserts no partial quest/access mutation and no emitted event.

### `CODEX_MUST_VERIFY_LOCALLY`

Independently probe the full command + campaign-admission boundary, including:

- malformed, wrong-player, stale and incoherent commands;
- rejected plan;
- access conflict;
- failure after plan but before committed transition;
- campaign admission failure after a locally successful engine result;
- exact no-partial-state behavior for quest category, tracking, access, activity, notification, Chronicle, and event;
- no Geographic Knowledge, Knowledge evidence/progress, map/fog/recognition, Codex, currency, standing, inventory, reputation, or survey non-proposal mutation.

The installed prompt requires a fresh post-plan failure probe independent of the implementation's tracked test.

## 7. Audit Section 4 - Starfall And Ashen Travel Identity

### Connector-verified source/test map

Primary source:

- `packages/engines/game-engine/src/player-travel-rules.ts`
- `packages/engines/game-engine/src/player-travel.ts`
- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`
- gameplay-shell caller in `apps/rpg-ui/src/game-shell/gameplayLoop.ts`.

Tracked evidence:

- `tests/unit/ashen-reef-survey-travel-access.test.mjs`
- `tests/unit/player-travel-characterization.test.mjs`
- `tests/unit/player-activity-selection-characterization.test.mjs`
- representative integration test.

### `CONNECTOR_VERIFIED_STRUCTURE` facts

Current destination `location.ashen_reef` is:

- display name `Ashen Reef`;
- region `region.starfall_isle` / Starfall Isle;
- settlement context `settlement.starfall_port`;
- arrival site label `Survey Anchorage`;
- travel ticks `4`;
- stamina `18`, HP `2`, MP `3`;
- arrival activity `activity.survey.ashen_reef`.

Tracked access tests assert:

- ordinary Starfall current position resolves to compatibility origin `settlement.starfall_port`;
- after Ashen access, travel plan to `location.ashen_reef` is available;
- both site labels `Survey Anchorage` and legacy `Ashen Reef` resolve current position to `location.ashen_reef` and redundant travel is rejected;
- destination display name is `Ashen Reef`.

Unrelated compatibility destination keys remain present:

- `location.saltmere` -> Aurelis;
- `location.westreach` -> Stonevein;
- `location.crown_bastion` -> Sunspire Reach.

### `CODEX_MUST_VERIFY_LOCALLY`

- Prove accepted travel writes `Survey Anchorage` while destination/current presentation remains `Ashen Reef` where required.
- Prove tracked accepted arrival, not an unrelated activity-selection edge, owns operation `operation.quest.ashen_reef_survey` and activity `activity.survey.ashen_reef`.
- Reconfirm no unrelated compatibility-id cleanup occurred.
- Reconfirm settlement-less known-location access does not collide with Normal recovery's Starfall settlement authority.

## 8. Audit Section 5 - Versioned Survey Presentation And Persistence

### Connector-verified source/test map

Primary source:

- `packages/engines/game-engine/src/ashen-reef-survey-content.ts`
- `packages/engines/game-engine/src/player-survey-activity-advancement.ts`
- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts`
- `packages/engines/game-engine/src/campaign-rules.ts`
- shared survey material-version contract in `packages/shared/types/src/contracts.ts`.

Tracked evidence:

- `tests/unit/ashen-reef-survey-authored-content.test.mjs`
- `tests/unit/player-survey-activity-advancement-persistence.test.mjs`
- survey characterization/command/correction/repair tests required by the prompt;
- representative integration test.

### `CONNECTOR_VERIFIED_STRUCTURE` version facts

`CURRENT_ASHEN_REEF_SURVEY_CONTENT_VERSION = 2`.

Version 1 deliberately retains legacy compatibility presentation:

- title `Ashen Reef Survey`;
- region `Glasswater`;
- `580 crown + salvage rights`;
- Saltmere / Saltmere Harbor Office;
- legacy Codex/region tags.

Version 2 uses accepted current canon:

- `Soundings of Ashen Reef`;
- Starfall Isle;
- deferred paid civic terms;
- Starfall Harbormaster's Office;
- Starfall-oriented tags and region.

`getAshenReefSurveyContent(version)` returns fresh arrays for reward/location/tag fields rather than exposing the internal content table's mutable arrays.

`resolveAshenReefSurveyContentVersion(...)` uses an explicit version when supplied, otherwise the latest retained survey request's embedded version, otherwise v2.

V1 objective rendering retains the historical three-line aggregate format. V2 renders Inshore Approach, Working Reef, Outer Passage, Ruin Markers, and the return-office line.

The authored-content test intentionally mutates arrays returned by one v2 lookup and then asserts a subsequent lookup remains canonical.

The representative integration test asserts all four new request intents embed survey-content version `[2,2,2,2]`.

### `CODEX_MUST_VERIFY_LOCALLY`

The independent audit must exercise the much broader persistence contract, not just inspect the content table:

- raw serialization accepts exact 1/2 and rejects every other survey-content value;
- version-7 publication/readback/restart preserves exact embedded request version;
- duplicate/correction/projection-repair semantics derive from retained request version;
- v1-only history stays exactly v1 through publication/restart/duplicate/repair;
- mixed incomplete v1 -> later v2 history preserves earlier request/occurrence/result/receipt/projection bytes;
- retained-existing discovery stays exact, while newly created discovery uses version-derived region;
- source-record-absent Codex stays absent;
- existing Codex rows receive exact version-derived tags/region tags;
- forged cross-version live Codex state fails target validation;
- returned content arrays cannot mutate module or later snapshot authority;
- exact survey balance, two one-tick owner applications, skill policy, correction blocking, projection ordering/repair, identities, receipt sets, and nine non-proposals remain unchanged.

The installed prompt requires fresh removable cross-version corruption and mixed-history probes rather than reuse of implementation transformation helpers alone.

## 9. Audit Section 6 - Injection-Free Representative Loop

### Connector-verified tracked caller map

`tests/integration/ashen-reef-survey-ordinary-reachability.test.mjs` imports and calls:

- production character-creation form/catalog;
- `createNewGameSnapshot(...)`;
- new-campaign attempt prepare/complete coordinator;
- `publishSave(...)` and `loadSaveWithAuthority(...)`;
- production quest acceptance command;
- campaign mutation admission;
- production travel command;
- real `advanceAshenReefSurveyCaller(...)`.

It does **not** import `demoSnapshot`.

### `CONNECTOR_VERIFIED_STRUCTURE` tracked-path assertions

The tracked representative test currently performs:

1. ordinary human Starfall character creation;
2. new-campaign attempt preparation;
3. exactly one initial canonical contract and no Ashen known-location row;
4. initial publication, attempt completion and authoritative load;
5. baseline currency/standing/inventory/Geographic Knowledge/General Lore capture;
6. production quest acceptance and campaign admission;
7. exact acceptance-owned Ashen access and tracking, with Geographic Knowledge unchanged;
8. publish/load before travel and no re-offer;
9. production travel and campaign admission;
10. arrival at `Survey Anchorage` with survey activity and Soundings operation;
11. publish/load;
12. four exact survey requests through `advanceAshenReefSurveyCaller(...)`;
13. mid-loop publish/load after request 2 and replacement of caller cache with a new empty `Map`;
14. final publish/load and another empty caller cache;
15. redelivery of request 4 and durable duplicate result with no snapshot change.

Final tracked assertions include:

- exactly `4` requests;
- exactly `4` occurrences;
- exactly `4` results;
- exactly `48` consequence receipts;
- stages `sector_1`, `sector_2`, `sector_3`, `ruins_confirmation`;
- all four request survey-content versions `2`;
- exact `ASHEN_REEF_SURVEY_NON_PROPOSALS` on each result;
- no projection repairs or corrections pending;
- sector flags 1/2/3 and ruins confirmed;
- operation progress `100`, title `Soundings of Ashen Reef`;
- current activity `activity.return.survey_packet` referencing Starfall Harbormaster's Office;
- quest remains active, tracked, not completed/turned-in;
- Stormglass discovery is Starfall and sourced from the quest;
- fresh creator has no `flora.unknown_bloom` Codex row and fourth result records `source_record_absent`;
- notification and Chronicle projections are ordered as expected;
- currency, standing and inventory equal pre-survey baseline;
- Geographic Knowledge equals pre-acceptance baseline;
- General Lore changes only by accepted survey-shift deltas;
- no consequence receipt kind matches turn-in/reward/payout.

### `CODEX_MUST_VERIFY_LOCALLY`

The audit cannot accept solely from this tracked test. Execute a **fresh independent representative path** with the same production owners and no direct injection of quest/tracking/access/activity/operation/sector/ruin/discovery/authority/request/occurrence/result/receipt/event/notification/Chronicle/correction/repair state.

Inspect the tracked test for hidden eligibility shortcuts and verify each campaign publication after admission uses current session-control authority.

Independently prove the final exact authority/projection/non-proposal counts and absence of excluded reward/turn-in/Geographic-Knowledge behavior.

## 10. Audit Section 7 - Retained `0.6.10` Parent And Caller Contracts

### Current retained owner surfaces

- `packages/engines/game-engine/src/player-survey-activity-advancement.ts`
- campaign/save/publication and snapshot synchronization owners;
- `apps/rpg-ui/src/runtime/ashenReefSurveyCaller.ts` real caller;
- survey command, characterization, persistence, correction/repair, Knowledge/no-proposal, migration/publication, and Normal defeat/recovery tracked tests;
- permanent `docs/design/ashen-reef-survey-advancement-authority-acceptance-audit.md`.

### `CONNECTOR_VERIFIED_STRUCTURE` orientation facts

`0.6.11` intentionally changed versioned presentation and ordinary reachability while retaining the accepted four-stage advancement owner. The representative test still expects the same four stage sequence and exact non-proposal object, and it explicitly asserts absence of turn-in/reward receipt execution.

### `CODEX_MUST_VERIFY_LOCALLY`

Reproduce the installed prompt's retained-parent gate, including:

- four deterministic stages and preview/execution parity;
- exact two-tick body/resource/stat sequencing;
- owner-derived progression and skill gates;
- deep canonical validation;
- continuity-before-receipt admission;
- durable later-state duplicate;
- projection ordering/repair;
- correction blocking;
- accepted-only real-caller application;
- version-6 migration and version-7 publication;
- browser storage;
- nested survey ledger through same-command and later Normal defeat/recovery;
- exact nine-field non-proposal object;
- no turn-in/reward execution.

Do not widen this audit into the intentionally excluded legacy turn-in implementation.

## 11. Implementation Validation Baselines - `TO_REPRODUCE`

The following came from `docs/dev/current-codex-output.md`. They are **`IMPLEMENTATION_CLAIM_TO_REPRODUCE`**, not Connector validation and not independent acceptance evidence:

| Claim | Implementation report |
| --- | ---: |
| final focused/adjacent test matrix | `1072 / 1072` passed |
| focused adversarial package selection | `24 / 24` passed |
| normal content lint | `71` files checked, passed |
| Vite production build | `219` modules transformed, passed |
| bounded UI TypeScript baseline | `137` diagnostics before and after |
| changed-surface new TS diagnostics | `0` claimed |
| changed-file pre-existing civilization-engine diagnostics | `3` claimed |
| TS/JS bridge + public-export parity | passed, claimed |
| `git diff --check` / scoped hygiene | passed, claimed |

The implementation also reports that broad `npm test` reproduced known unrelated failures and is **not** the accepted universal gate; one package-caused characterization drift was repaired before the final scoped gate.

`CODEX_MUST_VERIFY_LOCALLY`: run and report the exact required validation against the audit head. If legitimate repository changes alter a count, explain the delta rather than forcing the old number. Do not convert an implementation-reported number into an acceptance shortcut.

## 12. Independent Probe Matrix

These are the minimum fresh probes required by the installed prompt. The audit may add narrower probes if inspection reveals another material failure boundary.

| Probe | Must independently establish | Primary owner surfaces |
| --- | --- | --- |
| Initial-offer publication failure / retry | stable attempt/campaign/offer identity; no double staging; no load-time mutation; caller-loss/restart safety | new-game snapshot, offer staging, new-campaign coordinator, save/publication, campaign rules |
| Acceptance post-plan failure | no partial quest/tracking/access/notification/Chronicle/event state after a failure that would otherwise establish access | quest acceptance, access adapter, snapshot sync |
| Campaign admission failure | locally accepted engine candidate cannot leak state when authoritative admission rejects | quest acceptance result + campaign admission |
| V1 canonical history | exact v1 material survives serialization/publication/restart/duplicate/repair | survey content, survey advancement, sync, persistence |
| Mixed v1 -> v2 history | newer presentation does not rewrite earlier authority/projection bytes | survey request/result/receipt/projection owners |
| Forged live Codex mismatch | target validation rejects a well-shaped cross-version Codex projection | sync/deep validation/Codex projection |
| Returned-content mutation | mutation of a returned content-array cannot corrupt module authority or later snapshots | survey-content accessor |
| Fresh representative loop | ordinary production creator -> offer -> accept -> travel -> four shifts -> restarts -> durable duplicate without fixture injection | creator, save, acceptance, admission, travel, real survey caller |

Temporary probes remain outside tracked tests and must be removed before audit coordination commit.

## 13. Failure-Pattern Map

The installed prompt explicitly requires at minimum these permanent guardrails:

- **FP-001 — Test The Real Caller Path:** representative and acceptance evidence must exercise production creator, save/publication, campaign admission, travel and real survey caller, not helpers alone.
- **FP-002 — Green Tests Do Not Alone Accept A Parent:** add an independent failure-boundary/sequence review beyond tracked test counts.
- **FP-005 — Retry Tests Must Include Lost And Regenerated Caller State:** publication retry, restart and empty caller caches must not depend on original in-memory state.
- **FP-008 — Textual Mergeability Is Not Semantic Compatibility:** evidence/protected refs and PRs remain semantic evidence only; no branch integration is implied.
- **FP-009 — Distinguish Inspected Base From Final And Live Head:** report starting implementation, correction, implementation, coordination, audit starting, final audit, pushed/tracking/hosted heads separately.
- **FP-011 — Authority Precedence And Provenance Validation Must Control Mutation Order:** access/admission/provenance checks occur before authoritative mutation and failed cases retain source state.
- **FP-012 — Duplicate Results Require Unique Complete Durable Evidence:** fourth-request redelivery must resolve one complete retained result/evidence set after caller loss/restart without rollback/replay.
- **FP-013 — Parent Authority Rewrites Must Preserve Nested Owner State:** campaign/session rewrites, save/load, defeat/recovery and publication must retain the nested survey owner.
- **FP-014 — Container Shape And Recomputed Strings Are Not Semantic Authority:** v1/v2, result/receipt/projection and Codex semantics require deep validation, not merely shape/self-consistency.
- **FP-017 — Injected Eligibility Does Not Prove Representative Reachability:** final evidence must start from the production creator and gain offer/access/activity/progress through production owners rather than fixture injection.

`CODEX_MUST_VERIFY_LOCALLY`: read the current full guardrail entries and apply their exact verification expectations. This summary is an orientation index only.

## 14. Branch / PR / Evidence-Ref Snapshot

At Connector preflight inspection:

- hosted branches: `38` total = `master` plus `37` non-default refs;
- open PRs: exactly `2`.

Open PRs:

- PR #2 `Add launcher asset contract and sidebar metadata`
  - head branch `main-menu-asset-contract-pass`;
  - head `e78dc645cfb658685be12f45f46d34b7c0da1119`;
  - open, non-draft;
  - current semantic posture remains superseded/preserved evidence; no `0.6.11.1` integration trigger.
- PR #3 `Evidence only: preserve 0.6.9.7 repair bundle`
  - head branch `parallel/0.6.9.7-repair-bundle`;
  - head `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`;
  - open draft;
  - `SUPERSEDED_PRESERVE_EVIDENCE`;
  - its body contains stale historical active-route wording and must not be treated as current authority.

The installed audit names these read-only evidence refs for reinspection:

- `parallel/activity-advancement-audit` at `b4cbaea5f4292904bba62f60a0108bb84f2bd405`;
- `parallel/player-progression-reward-mutation-audit` at `387f2491d0d671ee7834656c28183e72a798f1ca`;
- `parallel/chronicle-notification-provenance-audit` at `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01`;
- `parallel/knowledge-discovery-visibility-audit` at `46434f31f8b06d49aad9a516543fbe36d188d519`;
- `prep/integrated-gameplay-0-7-readiness-audit` at `59c103c3a06d55f35bffa735fd4b7814dffb583e`.

Prior Connector Pass 6 and the implementation orientation found no lifecycle trigger. The admin genesis evidence ref remains a named-consumer hold. The audit must still fetch/prune and recheck exact tips if it depends on these facts.

## 15. What A Constrained Codex Audit Should Not Rediscover Broadly

Subject to the installed prompt's mandatory authority reading and fresh local verification, a synchronized audit starting from this exact packet head should not spend its highest-reasoning window rediscovering these facts from scratch merely for orientation:

- which three commits formed the `0.6.11` correction/implementation/coordination chain;
- which post-implementation commits are workflow-documentation-only;
- the high-level changed-file grouping by audit domain;
- the two open PR names/heads and their existing evidence posture;
- the current branch count and names, unless fetch/prune shows a delta;
- the exact source/test files listed above;
- the implementation-reported validation numbers that are only baselines to reproduce;
- the exact Connector Pass 2 corrected SHA;
- the already-authored list of required independent probe categories.

Use the packet as a navigation/index layer. Reverify only the material facts needed for implementation/acceptance and any delta since the packet source head.

## 16. What Codex Must Independently Establish

The independent audit must still own all of the following:

1. synchronized authenticated local checkout, actual HEAD/upstream/worktree state and full post-packet delta;
2. current active prompt/handoff/output and complete mandatory focused authorities required by that prompt;
3. complete material implementation diff and exact production/test semantics;
4. semantic equivalence of the five pre-existing quest definitions and bounded schema change;
5. initial publication/retry/admission behavior under fresh failure probes;
6. acceptance/access/campaign-admission atomicity under fresh failure probes;
7. travel/current-location/arrival semantics and Normal-recovery compatibility;
8. v1/v2/mixed persistence, serialization, deep validation, Codex mismatch, correction/repair and content immutability under fresh probes;
9. one independent injection-free production representative loop;
10. retained `0.6.10` advancement and real-caller contracts;
11. exact test/lint/build/TypeScript/mirror/export/migration/publication/browser/defeat-recovery validation required by the prompt;
12. final branch/PR/evidence-ref state, worktree cleanliness, commit/push/tracking/hosted identities;
13. final `PARENT_ACCEPTED` or `REPAIR_REQUIRED` decision in the primary audit agent.

No Connector statement in this packet may be cited as a substitute for one of those proofs.

## 17. Resource-Aware Audit Recommendation

Resource classification for the installed audit: **`L` read-only acceptance package** under the new resource-slicing policy because it spans authored/schema, offer/admission, access atomicity, travel identity, versioned persistence, representative-loop and retained-parent domains plus broad validation.

Because this prompt was installed before the new policy, this packet does not rewrite or weaken it. If the currently available highest-reasoning surface is materially constrained, the audit agent may internally organize its work into bounded read-only slices while preserving one synchronized implementation head and one final primary-agent disposition, for example:

- **Audit Slice A:** authored/schema + offer/publication;
- **Audit Slice B:** acceptance/access + travel identity;
- **Audit Slice C:** versioned persistence + retained-parent adversarial probes;
- **Audit Slice D:** fresh representative loop + full required validation + final disposition/publication.

Those are execution checkpoints, not new workflow versions and not partial acceptance outcomes. Any material failure should still force the installed prompt's `REPAIR_REQUIRED` route rather than being repaired inside the audit.

## 18. Packet Freshness Rule

This packet is current only for repository state descended from source head `06b633ef4523aa19ca69749e003581d0892e37c2` where the intervening delta is reviewed and does not invalidate the mapped production/test/authority facts.

Before using it, Codex must fetch/prune and compare its synchronized local head to this source head. Documentation-only additions such as this packet and its completion appendix can be reviewed as a small delta. Any production/test/schema/content or route change requires material reinspection.
