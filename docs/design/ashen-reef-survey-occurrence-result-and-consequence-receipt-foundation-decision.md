# Ashen Reef Survey Occurrence, Result, And Consequence Receipt Foundation Decision

Date: 2026-08-08

Source run: unversioned `Ashen Reef Survey Occurrence, Result, And Consequence Receipt Foundation Decision`

Inspected base and implementation starting head: `25ede537bcfe78ee28c93ffb9ee7b9f71b2bfac9`

Branch assumption: clean synchronized `master` with `master == origin/master`

Label class: unversioned decision

Parent version: none

Milestone impact: `supports_current_band`

Decision: `PACKAGE_READY`

Selected next route: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Implementation audit status: `Version 0.6.10.1` returned `REPAIR_REQUIRED`; `Version 0.6.10.2` implemented all six repairs at `59af92629a79e95fa20247959159e336a8dbc88e`; parent `0.6.10` remains unaccepted pending independent audit

Active audit: `Version 0.6.10.3 - Ashen Reef Survey Advancement Post-Repair Acceptance Audit`

## 1. Executive Decision

The Ashen Reef survey occurrence, deterministic result, affected-owner receipt, persistence, retry, projection-repair, and correction boundary is decision-complete.

The smallest coherent implementation is not a static receipt type or an empty container. It is one bounded current-band primary that implements the receipt contract together with the one survey command that proves it, the narrow campaign-continuity admission seam it needs, the existing owner adapters, persisted duplicate/restart behavior, complete preview parity, and accepted-only UI application.

`Version 0.6.10 - Ashen Reef Survey Advancement Authority` is therefore `PACKAGE_READY`. It advances the current `0.6.x` runtime-ownership transition but does not assign or accept `0.7.0`. A later independent audit must decide whether the completed package satisfies any representative-loop or band-entry criterion.

No product, canon, balance, or broad-system question remains open for this bounded package.

The independent implementation audit and repair appendix are recorded in `docs/design/ashen-reef-survey-advancement-authority-acceptance-audit.md`. They do not reopen this design decision. The first implementation failed six bounded contracts; `0.6.10.2` reports those repairs implemented, and separate production-read-only `0.6.10.3` now owns acceptance.

## 2. Evidence And Reverification

### 2.1 Repository and hosted state

The run fetched and pruned all refs, fast-forwarded the clean checkout, and inspected one local branch, 36 non-default remote branches, and two open pull requests. The synchronized source head was `25ede537bcfe78ee28c93ffb9ee7b9f71b2bfac9`.

GitHub reported:

- PR #2 open, non-draft, unmerged, and mechanically non-mergeable at `e78dc645cfb658685be12f45f46d34b7c0da1119`;
- PR #3 open, draft, unmerged, and mechanically non-mergeable at `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`;
- no combined status contexts on the inspected source head.

Both PRs remain `SUPERSEDED_PRESERVE_EVIDENCE`. No branch or PR was merged, modified, rebased, force-updated, closed, or deleted.

### 2.2 Connector evidence artifacts

Each prompt-mandated artifact was read from its immutable ref and then compared with current source:

| Evidence artifact | Exact ref | Current classification | Reverified conclusion |
| --- | --- | --- | --- |
| Activity advancement | `b4cbaea5f4292904bba62f60a0108bb84f2bd405` | `CURRENTLY_CONFIRMED` | Activity selection is engine-owned; survey advancement remains a UI-owned multi-owner mutation with incomplete preview semantics. |
| Progression and rewards | `387f2491d0d671ee7834656c28183e72a798f1ca` | `CURRENTLY_CONFIRMED` | Player-engine calculation policy exists, but General Lore and flora-identification application and provenance remain shell-orchestrated. |
| Chronicle and projections | `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01` | `CURRENTLY_CONFIRMED` | Notification and session Chronicle rows are persisted presentation, not result authority; operation/current activity also lack source-result correlation. |
| Knowledge and discovery | `46434f31f8b06d49aad9a516543fbe36d188d519` | `CURRENTLY_CONFIRMED` | Discovery record, compatibility flag, Codex reference/unlock, Knowledge, known location, map visibility, and narrative presentation are distinct facts. |

The four branches remain `CANDIDATE_INTEGRATION` because each artifact has broader named consumers beyond this survey decision. Their applicable current facts are re-authored here; their refs remain untouched.

### 2.3 Protected readiness evidence

The protected branch was read only at `59c103c3a06d55f35bffa735fd4b7814dffb583e`.

Still current:

- survey advancement is the strongest bounded inventory-free representative-loop candidate;
- travel, quest acceptance/tracking, and activity selection are engine-owned;
- survey advancement is not;
- generic `type:domain:tick` event identity is unsuitable;
- `0.7.0` lacks an accepted engine-owned persisted consequence-bearing loop.

Historical and superseded:

- save authority is no longer version-6-only;
- campaign, continuity, character, immutable artifact, verified publication, first-mutation fork, target Normal defeat, and publication-keyed account-consumer foundations now exist through accepted `0.6.9`;
- the old static-sequence routing no longer controls execution.

The protected branch remains `PROTECTED_REFERENCE` and was not changed.

### 2.4 Local executable evidence

- `tests/unit/gameplay-loop-skill-gating.test.mjs`: `5/5` passed;
- `tests/unit/campaign-persistence-foundation.test.mjs`: `33/33` passed.

These checks verify current behavior and persistence assumptions. They do not substitute for the new package's adversarial command, receipt, restart, correction, projection-repair, caller, and publication tests.

## 3. Current Survey Mutation Inventory

`ActivityPanel` calls `previewAdvanceCurrentActivity(snapshot)`, then calls `advanceCurrentActivity(snapshot)` and submits the returned snapshot through `GameSessionContext.updateSnapshot(...)`. The current caller supplies neither a stable survey request id nor a survey result id, so generic campaign admission creates a fresh mutation UUID and classifies it as `legacy_bridge`.

The live survey branch in `apps/rpg-ui/src/game-shell/gameplayLoop.ts` owns four deterministic stages:

1. add sector flag 1 and attempt `skill.knowledge.general_lore +1`;
2. add sector flag 2 and attempt `skill.knowledge.general_lore +1`;
3. add sector flag 3 and attempt `skill.knowledge.general_lore +1`;
4. add ruins confirmation, attempt `skill.resource.identify.flora +1`, establish or retain the Stormglass Bloom discovery fact, complete the operation, and replace current activity.

Each valid stage also advances two ticks, advances body/metabolic state, applies the survey attribute-load profile, synchronizes player runtime state per tick, applies explicit Stamina `-10` and MP `-3`, updates the survey operation, appends one notification and one session Chronicle row, and synchronizes the snapshot.

Current defects that the package must replace rather than preserve:

- preview omits attribute load, explicit resources, skill gate, progress, operation, discovery, and activity facts;
- preview does not reject incoherent or completed state;
- completed execution falls through to generic labor advancement;
- noncontiguous flags can consume a shift without advancing progress;
- the caller lacks a survey accepted/rejected discriminator;
- generic mutation duplicate retention is in-memory and is empty after reload;
- current campaign admission receives an already-mutated snapshot and may then create a child continuity, making prebuilt non-head receipts stale;
- notification and session Chronicle ids use tick plus array length;
- a preexisting Stormglass discovery entry without its compatibility flag causes the current helper to skip the flag, leaving Codex projection inconsistent;
- a fresh character-created session has no `flora.unknown_bloom` Codex row, so the discovery can retain a Codex reference without creating or unlocking a session Codex record.

The final package must preserve the intended four-stage balance and visible text while rejecting these incoherent paths.

## 4. Persisted Identity Graph

All identities are distinct.

| Identity | Exact first-package form | Owner and lifetime | Required links |
| --- | --- | --- | --- |
| request/command | `survey_request.<uuid>` | client-created once per delivery intent; persisted only when admitted | source artifact/publication/revision, source continuity, character, normalized intent |
| occurrence | `survey_occurrence.<request-uuid>` | survey owner; snapshot-persisted after admission | admitted request, accepted campaign continuity, character, stage |
| deterministic result | `survey_result.<request-uuid>` | survey resolver; snapshot-persisted | occurrence, result code, material before/after facts |
| owner consequence | `survey_consequence.<request-uuid>.<kind>` | affected application owner; snapshot-persisted | result, owner, kind, exact effect and posture |
| typed event | `event.player.activity.survey.<request-uuid>` | survey transport projection; id retained in result, event transient | result and safe event payload |
| notification | `notification.survey.<request-uuid>` | session notification projection; snapshot row is bounded | result and projection receipt |
| session Chronicle | `chronicle.survey.<request-uuid>` | session narrative projection; snapshot row is bounded | result and projection receipt |
| projection repair | `survey_projection_repair.<request-uuid>.<projection-kind>.<ordinal>` | survey projection-repair owner; snapshot-persisted | source result, source receipt, observed destination state, repair outcome |
| correction | `survey_correction.<uuid>` | survey correction owner; snapshot-persisted | superseded result, evidence/reason, replacement if any, per-owner reconciliation |

The collision resistance comes from the request UUID. The distinct prefixes and owner links preserve semantic separation. Tick, event, notification, Chronicle, artifact, publication, slot, array position, global sequence, and generic hashes are not occurrence or result identity.

`expectedRevision` may remain stale-state evidence in a request. It is not occurrence identity or retry equivalence by itself.

The request record retains source artifact and source publication correlation. The accepted occurrence/result/receipts bind to the continuity selected by campaign admission. The containing immutable artifact and publication envelope correlate the accepted snapshot to its eventual publication; a snapshot record must not contain its own not-yet-known target artifact or publication id.

No account projection is created by the first survey package.

## 5. Survey-Owned Ledger Shape

The existing `CampaignAuthorityLedgerState.version` remains `1`. The package adds one optional, survey-owned nested container:

`CampaignAuthorityLedgerState.ashenReefSurvey?: AshenReefSurveyAuthorityState`

The container has:

- `version: 1`;
- optional `legacyBaseline`;
- `requests`;
- `occurrences`;
- `results`;
- `consequenceReceipts`;
- `projectionRepairs`;
- `corrections`.

One nested container preserves the accepted single campaign authority-ledger placement while separate typed collections preserve request, occurrence, result, consequence, repair, and correction ownership. Adding generic ledger-entry kinds would be too weak because the current common entry has no normalized intent, owner payload, posture, repair, or reconciliation contract.

### 5.1 Admitted request record

An admitted request record must include:

- schema/normalization version and intent `advance_ashen_reef_survey_shift`;
- request id;
- account, campaign, source continuity, accepted continuity, and character ids;
- quest, activity, and location ids;
- source artifact id, source publication id, and source/session revision;
- expected tick, snapshot format, and stale-state revision;
- stage and exact normalized material facts;
- resolver, body-balance, stat-growth, skill-policy, synchronization, and survey-content versions;
- canonical normalized-intent serialization;
- occurrence id and `admitted` posture.

The canonical retry fingerprint is the versioned canonical serialization of those named normalized fields, excluding presentation state and excluding the request id that keys the lookup. Exact structural equality is authoritative. A whole serialized source/proposed snapshot hash is not the survey fingerprint.

Malformed, wrong-player, stale, wrong-artifact, wrong-location, missing/inactive/untracked, incoherent, already-complete, and conflicting pre-admission rejections return the original snapshot object and create no occurrence or gameplay consequence. They may be retained in live `CampaignSessionControl` for same-session diagnostics and conflicting-id detection, but they are not snapshot-persisted in the first package. This newer focused decision deliberately narrows the older generic proposal to persist every pre-admission rejection: persisting a rejected click would contradict the accepted no-mutation boundary and Normal's unsaved-gameplay policy. Durable replay authority is required for admitted requests only.

### 5.2 Occurrence and result records

An occurrence records the admitted request, accepted continuity, character, exact stage, accepted start tick, source authority, and material-version set.

A result records:

- request, occurrence, result, campaign, continuity, character, and quest ids;
- `survey_sector_logged` or `survey_packet_completed`;
- stage;
- start/applied ticks;
- sector and ruins facts before/after;
- tick count and exact resource costs;
- skill id, requested/applied delta, blocked gate, and required band;
- discovery entry/flag/Codex-reference outcomes;
- operation stage and current-activity outcome;
- required consequence-receipt ids and projection ids;
- synchronization version and postcondition;
- immutable accepted material facts.

The persisted result does not embed another `SaveSnapshot`. Runtime duplicate responses combine the retained result with the current authoritative snapshot, preventing rollback after later mutations.

### 5.3 Consequence receipt envelope

Every receipt contains:

- receipt id and version;
- the structural idempotency tuple `(resultId, owner, kind)`;
- account, campaign, accepted continuity, character, request, occurrence, and result ids;
- source revision and stage;
- discriminated typed effect facts;
- applied tick;
- posture `applied`, `blocked_at_gate`, or `projection_pending`;
- optional correction/supersession link only through an appended correction record.

The tuple must be unique. The package permits one receipt of each exact kind per result. A blocked skill breakthrough records `blocked_at_gate`, requested delta `1`, applied delta `0`, and exact gate/band facts; it does not reject the survey result.

Original request, occurrence, result, and receipt records are immutable. `corrected` and `superseded` are effective postures derived from appended correction and per-owner reconciliation records, not in-place rewrites.

## 6. Atomic Admission, Application, And Publication

The required future order is:

1. Validate command shape, UUID namespace, account/player/campaign control, source artifact/publication/revision, snapshot format, and normalized intent.
2. Look up the request id before stale-state rejection. Return one complete persisted duplicate evidence set, or quarantine any conflicting reuse.
3. Resolve one pure authoritative plan used by preview and execution. Validate contiguous sector state, ruins ordering, discovery entry/flag coherence, current quest/location/activity facts, and all material versions.
4. Use a narrow campaign prepare/commit seam to select or create the accepted continuity before authoring the occurrence. A non-head first mutation creates exactly one child; later mutations reuse it.
5. Reserve the deterministic occurrence identity in the candidate survey container and clone the source snapshot under the accepted continuity.
6. Apply clock, captured tick, total-play-tick, body/metabolic, attribute-load/stat-growth, and resource consequences.
7. Apply the one stage-specific skill consequence, including a complete blocked-gate receipt.
8. Apply canonical survey progress and its quest-progress compatibility state.
9. Apply survey operation, final discovery entry/flag, conditional Codex projection, and final current-activity consequences.
10. Create every required gameplay-owner receipt and the immutable deterministic result, then validate their complete referential set.
11. Synchronize the snapshot and prove the synchronized postconditions. Synchronization creates no independent gameplay result.
12. Derive the notification, session Chronicle, safe notice facts, and typed event from the result. If a projection fails after gameplay truth is complete, retain `projection_pending` and do not repeat gameplay effects.
13. Commit campaign admission and return the accepted snapshot/control/result atomically.
14. On a later manual or quick save, reuse the existing version-7 candidate write, exact readback, semantic validation, immutable artifact, head publication, address projection, and verification pipeline.

The acceptance boundary is after all gameplay owner applications, complete owner receipts, result, and synchronized postconditions exist. Before that boundary, any failure returns the original snapshot/control byte-stable and no occurrence is persisted. The deterministic occurrence id ensures a same-request retry cannot mint another identity even if an in-memory provisional reservation was discarded.

Projection failure is the only post-accept repair posture in the first package. Missing or conflicting gameplay receipts make the candidate invalid and fail closed; the package must not replay a subset of gameplay effects as repair.

Accepted survey gameplay remains unsaved until manual or quick publication, preserving `0.6.9` policy. Exiting before save legitimately restores the prior published artifact. After publication, restart restores the survey ledger exactly and never invokes the resolver to recreate accepted truth.

## 7. Duplicate, Restart, Repair, And Correction Matrix

| Situation | Required result |
| --- | --- |
| Same request id and exact normalized intent, before later mutation | Return retained result and receipt status with current snapshot; no owner effect or projection repeats. |
| Same request id and exact normalized intent, after later mutations | Return the original retained result plus the latest authoritative snapshot; never roll state back. |
| Same request id with any normalized field changed | `conflicting_retry`; quarantine/fail closed; no mutation. |
| Duplicate evidence missing, duplicated, orphaned, or internally conflicting | Fail closed before effects; never choose first/last/latest array entry. |
| Caller rerender or lost prepared plan | Rebuild from the same request and persisted/live authority; do not mint replacement request identity. |
| Restart from a published accepted artifact | Find the unique complete request/occurrence/result/receipt set and return it without replay. |
| Restart after deliberately unsaved gameplay | Restore the previous published state; the prior unsaved occurrence is not durable authority. |
| Projection row missing or malformed while its result is still eligible under retention | Repair only that result-derived projection and append a repair record. |
| Projection was legitimately evicted by the 8/48 caps | Record/derive retention expiry; do not resurrect it or evict newer truth. |
| Projection id belongs to another source or a newer correction/result controls it | Fail closed or repair the newer authority; never overwrite newer truth. |
| Gameplay owner receipt missing after purported acceptance | Invalid/quarantined snapshot; no owner-application replay in the first package. |
| Explicit correction | Retain original records, append reason/evidence and supersession links, and record each affected owner's reconciliation posture. |
| Correction has pending owner reconciliation | Block a later survey command with a production-reachable diagnostic; no player-facing editor is added. |

Projection repair must compare the current destination row, source result, corrections, and retention ordering. Same-tick ordering uses applied tick plus stable result id. It may replace a row with the same projection id and source, or insert a still-eligible missing row at deterministic order. It must not replace unrelated or newer authority.

Correction execution, rollback, reroll, compensating gameplay effects, and a correction UI are deliberately unsupported. The first package defines and validates the correction/reconciliation shape and blocks on unresolved correction authority; a later owner-specific package must authorize actual compensation.

## 8. Affected-Owner Matrix

The structural idempotency key for each row is `(resultId, owner, receiptKind)`.

| Effect | Proposal owner | Application owner | Receipt kind | Required facts and posture |
| --- | --- | --- | --- | --- |
| clock, captured tick, total play ticks | survey plan | shared time application coordinated by survey engine | `time_advance` | start/end clock, two ticks, play-tick delta; `applied` |
| body/metabolic state | survey plan | player body owner via `advancePlayerBodyState` | `body_advance` | profile/version, before/after body facts, two-step timeline; `applied` |
| attribute load/stat growth | survey plan | player stat-growth owner via `applyActionAttributeLoad` | `attribute_load` | profile/version, weights, before/after accumulators; `applied` |
| HP/MP/Stamina | survey plan | bounded player-resource adapter | `resource_cost` | natural per-tick resolution plus explicit Stamina `-10`, MP `-3`, clamping, exact before/after; `applied` |
| General Lore sector gain | survey plan | player skill owner via `resolveSkillRankGainPolicy` and bounded application | `skill_progress` | skill id, request `+1`, before/after, gate/band; `applied` or `blocked_at_gate` |
| flora-identification final gain | survey plan | same skill owner | `skill_progress` | distinct flora skill facts; `applied` or `blocked_at_gate` |
| sector/ruins facts | survey plan | `player_activity.survey` progress owner | `survey_progress` | exact contiguous before/after stage and compatibility flags; `applied` |
| quest progress | survey progress result | quest-journal synchronization owner | `quest_progress_sync` | quest active/tracked identity and exact derived objectives/status; `applied` |
| survey operation | survey plan | bounded survey-operation application owner | `survey_operation` | stable operation id, 25/50/75/100 progress, stage/ETA/output; `applied` |
| Stormglass discovery entry | final-stage plan | player discovery owner | `player_discovery` | zero-or-one entry, fixed discovery id, source quest, Codex reference, before/after; `applied` |
| discovery compatibility flag | final-stage plan | survey/discovery compatibility adapter | `discovery_flag` | exact entry/flag coherence; `applied` |
| Codex/reference visibility | accepted discovery result | snapshot synchronization projection owner | `codex_visibility_projection` | reference id plus `unlocked_existing`, `already_unlocked`, or `source_record_absent`; `applied` evaluation |
| geographic Knowledge/known location/map | none | respective owners | none | explicit `no_proposal`; survey shift grants none |
| current activity completion/replacement | final-stage plan | activity-state owner | `activity_transition` | before id and `activity.return.survey_packet`; `applied` |
| snapshot synchronization | accepted applications | game-engine synchronizer | none | result retains synchronizer version/postcondition; it is not independent gameplay authority |
| notification | accepted result | survey projection owner | `notification_projection` | result-derived id/text/tone/order, cap 8; `applied` or `projection_pending` |
| session Chronicle | accepted result | survey projection owner | `chronicle_projection` | result-derived id/text/entities/effects/tags/order, cap 48; `applied` or `projection_pending` |
| panel notice | accepted/rejected result | UI presentation | none persisted | safe transient facts only |
| typed event | accepted result | survey transport projection owner | `event_projection` | result-derived id and typed safe payload; `applied` or `projection_pending` |

All currently missing application seams are bounded by this one survey family and can be implemented inside the selected package without inventing a general resource, skill, quest, discovery, operation, activity, event, or transaction framework.

## 9. Discovery And Legacy Coherence

Stormglass facts remain separate:

- `playerState.discoveryChronicle.entries` is the personal discovery record;
- `gameplay.discovery.stormglass_bloom` is compatibility state;
- `codexEntryId: flora.unknown_bloom` is a reference, not proof that a session Codex row exists;
- an existing matching Codex row may be unlocked by synchronization;
- a missing Codex row is not created by the survey package;
- flora skill progress and derived Echo/progression are separate consequences;
- session Chronicle and notification are projections;
- geographic Knowledge, known locations, map visibility, and travel access do not change.

Before final-stage admission:

- both discovery entry and flag absent is coherent and adds both;
- exactly one matching entry plus the flag is coherent and retains both;
- entry without flag, flag without exactly one matching entry, duplicate matching entries, or conflicting source/reference data is `survey_discovery_incoherent` and rejects before mutation.

This resolves a live mismatch that the Connector prestage did not state precisely.

## 10. Snapshot Format, Migration, Validation, And Retention

- Target snapshot format remains `lineage.save_snapshot.v2`.
- Save envelope remains version `7`.
- Campaign authority ledger remains version `1`.
- No package, protocol, public release, or workflow version is implied by those numbers.
- New target snapshots and version-6 migrations initialize an empty survey container when the implementation lands.
- Existing version-7 target snapshots without the optional container remain valid and are not rewritten merely to add emptiness.
- The first accepted survey command initializes the container in its candidate snapshot.
- If a pre-receipt target snapshot already has coherent survey progress, the first accepted command records one `legacyBaseline` with exact observed state and source artifact/revision. The baseline is migration provenance, not an invented request, occurrence, result, or consequence.
- Incoherent legacy flags/discovery state rejects; no history is inferred from flags, notifications, Chronicle rows, ticks, or hashes.
- Deep validation checks exact ids, uniqueness, campaign/character scope, reachable continuity lineage, request-to-occurrence-to-result links, required receipt sets, unique idempotency tuples, correction acyclicity, projection-repair provenance, stage coherence, and synchronized state.
- Raw JSON serialization preserves the optional container exactly once present.
- Retain every survey baseline, admitted request, occurrence, result, receipt, repair, and correction for the campaign. There is no pruning in the first package.
- Growth is bounded by admitted survey shifts across retained campaign continuities, their finite owner receipt set, and explicit repairs/corrections. The existing 8-notification and 48-session-Chronicle presentation caps remain unchanged and do not limit authority retention.

## 11. Selected Implementation Package

### 11.1 Classification

`Version 0.6.10 - Ashen Reef Survey Advancement Authority`

- label class: primary;
- parent version: none;
- milestone impact: `advances_current_band`;
- result: `PACKAGE_READY`;
- `0.7.0`: still `NOT_READY`.

The package materially moves one persisted, consequence-bearing advancement path out of UI ownership. A types-only or empty-container patch is not completion and must fail closed.

### 11.2 Authorized production surfaces

Required:

- `packages/shared/types/src/contracts.ts`;
- `packages/shared/events/src/index.ts` and `index.js`;
- `packages/engines/game-engine/src/campaign-rules.ts` and `campaign-rules.js`;
- `packages/engines/game-engine/src/campaign-session.ts` and `campaign-session.js`;
- new `packages/engines/game-engine/src/player-survey-activity-advancement.ts` and `.js`;
- `packages/engines/game-engine/src/index.ts` and `index.js`;
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx` for the bounded prepare/commit caller;
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts` to remove/delegate only the Ashen Reef advancement branch and preview;
- `apps/rpg-ui/src/features/ActivityPanel.tsx` for accepted-only result application and complete readiness/preview use.

Conditionally authorized only if direct proof shows validator/default wiring cannot otherwise be complete:

- `packages/engines/game-engine/src/gameplay-snapshot-sync.ts` and `.js`;
- `apps/rpg-ui/src/game-shell/saveManager.ts`.

No other production path is authorized without a fail-closed scope decision.

### 11.3 Required tests

- add `tests/unit/player-survey-activity-advancement-characterization.test.mjs` before extraction;
- add `tests/unit/player-survey-activity-advancement-command.test.mjs`;
- add or extend focused survey persistence/publication coverage;
- extend `tests/unit/campaign-persistence-foundation.test.mjs` only for the narrow continuity, durable duplicate, migration/default, publication, and repair seams;
- extend `tests/simulation/save-load-roundtrip.test.mjs` for receipt roundtrip;
- preserve and run `tests/unit/gameplay-loop-skill-gating.test.mjs`;
- run adjacent travel, quest acceptance/tracking, activity selection, body/resource, progression, campaign persistence, and current save/load regressions selected from the repository validation matrix;
- run the RPG UI production build, applicable bounded TypeScript check, JS/TS mirror/export checks, source guards, `git diff --check`, and complete diff/hygiene inspection.

Acceptance must prove:

1. all four exact stages and visible behavior;
2. one complete preview/execution plan including attributes and resources;
3. every specified no-mutation rejection;
4. exact discovery entry/flag/Codex-reference coherence, including fresh-character missing-Codex behavior;
5. distinct request, occurrence, result, receipt, event, notification, Chronicle, repair, and correction identities;
6. head and non-head admission, exactly one child fork, and receipt continuity matching the accepted child;
7. exact durable duplicate evidence before/after later mutation and after serialize/save/restart;
8. conflict, missing, duplicate, orphan, reordered, and copied-artifact failure closure;
9. caller-state loss and regenerated transient-state behavior;
10. injected owner failure before acceptance and projection failure after gameplay acceptance;
11. production-reachable projection repair that cannot replace newer truth;
12. legacy absent-container and coherent baseline behavior without invented history;
13. correction/supersession validation and pending-correction blocking without a correction UI;
14. accepted-only Activity-panel application and removal of direct survey mutation authority;
15. verified version-7 publication and exact roundtrip of the accepted ledger.

## 12. Explicit Exclusions

- no survey turn-in, payout, standing, reputation, currency, inventory, or rewards;
- no rivet cargo, procurement, rest, gathering, crafting, combat, injury, health, care, death, succession, or new content;
- no generic activity resolver, command bus, effect engine, transaction framework, replay service, correction service, lineage framework, or event bus;
- no new uncertainty, difficulty, competence, familiarity, compression, or RNG semantics;
- no geographic Knowledge, recognition, route, map, POI, or travel-access grant;
- no Committed/Ironbound Stakes, checkpoint selection, cloud synchronization, recovery UI, or account projection;
- no snapshot-format, envelope-version, ledger-version, dependency, asset, generated-output, or unrelated cleanup;
- no merge, modification, rebase, force update, deletion, or opportunistic integration of protected or Connector evidence branches.

## 13. Failure-Pattern Guardrails

Applicable guardrails:

- `FP-001`: the real caller path was traced through ActivityPanel, GameSessionContext, App, and the session reducer; the implementation must test that path.
- `FP-002`: the package gate includes a failure-boundary matrix in addition to green tests.
- `FP-003`: `projection_pending` and correction-pending postures require a production-reachable validated completion or diagnostic owner.
- `FP-005`: duplicate/retry tests include rerender, lost caller state, restart, and regenerated transient state.
- `FP-006`: projection repair compares current destination and newer authority before replacement.
- `FP-007`: this decision and coordination updates use bounded complete-file/local patches.
- `FP-008`: all branch/PR dispositions were semantically rechecked; mechanical mergeability was not treated as authority.
- `FP-009`: inspected base, implementation starting head, final commit, and post-push live head remain distinct report fields.
- `FP-011`: artifact, revision, continuity, and controlling source provenance are validated before clone, fork binding, or effect application.
- `FP-012`: duplicate handling requires one complete unique durable request/occurrence/result/receipt set and adversarial reordering/orphan tests.

`FP-004` and `FP-010` do not control this documentation decision: no contended save destination is repaired here, and this is not a repair prompt. Their general rules remain active.

## 14. Branch And PR Lifecycle Result

All live branches were inventoried by head, merge base, divergence, unique commits, and changed paths. The four exact evidence refs were consumed read-only; the protected readiness ref was inspected read-only. Their current dispositions and broader triggers remain valid.

PR #2 and PR #3 remain `SUPERSEDED_PRESERVE_EVIDENCE`. The other Connector branches retain their recorded `CANDIDATE_INTEGRATION`, `PROTECTED_REFERENCE`, `MERGED_RETIRE`, or evidence-preservation postures. No integration, retirement, closure, or deletion is due inside this decision.

The exact next review triggers remain those in `docs/dev/branch-disposition-register.md`. The four survey-applicable evidence branches must be reread during `0.6.10` orientation, but they must not be merged as implementation.

## 15. Final Answers

1. Persist one optional survey-owned container inside the existing campaign authority ledger, with separate typed collections.
2. Bind admitted occurrence/result/receipt records to the continuity selected before application.
3. Persist admitted requests and accepted truth; keep pre-admission rejections non-mutating and transient in the first package.
4. Use exact normalized structural request equality, not whole-snapshot hash equality, for retries.
5. Keep gameplay application atomic; allow only projection repair after acceptance.
6. Preserve original truth and append corrections/reconciliation without a correction UI.
7. Treat every Stormglass discovery, flag, Codex, Knowledge, and presentation fact separately.
8. Keep target snapshot `lineage.save_snapshot.v2`, envelope `7`, and ledger `1` with an additive optional container.
9. Retain all bounded survey authority for the campaign.
10. Execute `Version 0.6.10 - Ashen Reef Survey Advancement Authority` next.

`PACKAGE_READY`
