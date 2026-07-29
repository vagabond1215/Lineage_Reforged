# Ashen Reef Survey Activity Advancement Scope And Owner Contract Decision

Date: 2026-07-29

Source run: unversioned `Ashen Reef Survey Activity Advancement Scope And Owner Contract Decision`

Label class: unversioned

Milestone impact: `supports_current_band`

Status: accepted owner-contract decision; survey command scope is bounded; implementation remains blocked by minimum save identity and accepted-state publication

## 1. Decision

The Ashen Reef survey advancement path is suitable as the first engine-owned activity advancement consumer. One survey shift is deterministic, inventory-free, bounded to one authored quest, and can reuse accepted travel, quest, activity-selection, body/resource, skill-progression, synchronization, and UI patterns.

The command package is not dependency-closed.

Accepted occurrence provenance requires stable campaign and continuity identity. Current `SaveSnapshot` has account, player, snapshot-version, tick, and optional inheritance-source facts, but no campaign or continuity identity. The current local save adapter serializes a snapshot into a version-6 local-storage envelope and writes it directly; it does not implement the accepted candidate-write, verification, publication, and authoritative-head boundary.

Result:

`NO_PACKAGE`

Selected next route:

`Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision`

Classification:

`UNVERSIONED_PREREQUISITE`

No `0.6.9`, support suffix, or `0.7.0` label is assigned.

## 2. Repository And Route Evidence

- Starting commit: `3006c968eb40b1d72f64fb2dc0263e227f869a7d`.
- Branch: `master`.
- Upstream: `origin/master`.
- Starting worktree: clean.
- Starting divergence: zero local-only and zero remote-only commits.
- No pull was required.
- The prior classification selected this run as `UNVERSIONED_PREREQUISITE`.
- `0.7.0` remains `NOT_READY`.
- The focused current-capability group passed 40/40.
- The isolated readiness branch remains read-only, unmerged, unmodified, unre-based, and noncontrolling.

The isolated audit's refreshed runway remains correct in dependency order:

1. selected survey scope and owner decision;
2. minimum save identity and accepted-state publication;
3. owner-specific occurrence/result receipt foundation;
4. engine-owned survey command;
5. typed consequence adapters;
6. accepted-only UI/preview integration;
7. persistence and end-to-end regression;
8. separate `0.7.0` readiness audit.

This run completes item 1 only.

## 3. Exact Current Behavior

### 3.1 Eligibility and stages

The shell selects the survey branch when:

- `sessionState.trackedQuestId` is `quest.ashen_reef_survey`;
- that quest exists with category `active`.

Execution rejects without mutation when the current travel location is not `location.ashen_reef`.

At Ashen Reef:

1. sector count `0` adds sector flag `1`;
2. sector count `1` adds sector flag `2`;
3. sector count `2` adds sector flag `3`;
4. sector count `3` without ruins confirmation adds the ruins-confirmed flag and completes the packet.

Each accepted survey-specific shift:

- advances two ticks;
- advances metabolic body state with the skill/attribute-mitigated survey profile;
- applies the survey attribute-load profile;
- applies stamina `-10` and MP `-3`, clamped to current resource bounds;
- attempts one breakthrough-gated skill-rank gain;
- updates the survey operation;
- appends one notification and one Chronicle projection;
- synchronizes the snapshot.

Sector shifts attempt General Lore progression. Packet completion attempts flora-identification progression, adds the Stormglass Bloom discovery if absent, sets the discovery flag, and changes current activity to `activity.return.survey_packet`.

### 3.2 Deterministic posture

The current branch performs no difficulty check, result-band selection, uncertainty draw, or RNG consumption. Attribute and skill values deterministically mitigate metabolic load, and the skill policy deterministically applies or blocks the requested rank gain.

No general competence, difficulty, familiarity, compression, margin, recovery, aggregation, or named-uncertainty authority is required for exact bounded survey resolution.

### 3.3 Current defects and drift

The later transition must explicitly correct four bounded defects:

1. **Post-completion dispatch mismatch.** Preview continues to use the survey profile after ruins confirmation, while execution falls through to generic activity advancement and applies a different profile and stamina `-6`.
2. **Incomplete preview facts.** Preview projects body state only. It omits the explicit stamina/MP costs and does not apply the survey attribute-load profile.
3. **Noncontiguous flag replay.** Sector progress is count-based. A malformed noncontiguous flag set can cause `ensureFlag` to add no new sector while still applying time, resource, skill, operation, and projection effects.
4. **Unconditional UI application.** `ActivityPanel` applies every returned snapshot because the legacy action result has no accepted/rejected discriminator.

These are current source facts, not reasons to preserve the defects. The future command must reject incoherent sector state, reject an already-complete survey attempt, use one plan for preview/execution, expose complete projected costs, and permit accepted-only UI application.

## 4. Bounded Survey Intent And Plan

The future domain is:

`player_activity.survey`

The only initial intent is:

`advance_ashen_reef_survey_shift`

The intent is one shift, not the whole survey, a generic activity, a quest turn-in, or a mutable multi-node project.

Owner-certified material facts:

- player id;
- stable campaign and continuity id once implemented;
- quest id and active/tracked posture;
- current location id;
- exact contiguous sector state;
- ruins-confirmed posture;
- current tick/day and snapshot format version;
- run-difficulty facts used by body/stat growth;
- lineage id;
- current body state;
- current resources;
- attributes and stat-growth facts consumed by mitigation/load;
- current relevant skill and breakthrough state;
- existing discovery identity/flag posture for completion;
- governing survey material-normalization, resolver, body-balance, stat-growth, skill-policy, and content versions.

Presentation state, selected Activity panel section, search text, confirmation UI state, notification count, Chronicle order, wall-clock time, and slot address are not material gameplay facts.

## 5. Eligibility And Rejection Contract

Plan rejection codes:

- `survey_quest_missing`;
- `survey_quest_not_active`;
- `survey_quest_not_tracked`;
- `wrong_location`;
- `survey_progress_incoherent`;
- `survey_already_complete`.

Command-layer rejection codes additionally include:

- `malformed_command`;
- `wrong_player`;
- `stale_snapshot`;
- `incoherent_state`;
- `conflicting_retry`;
- `transition_failed`.

Survey progress is coherent only for:

- no sector flags and no ruins flag;
- sector `1` only and no ruins flag;
- sectors `1,2` only and no ruins flag;
- sectors `1,2,3` and no ruins flag;
- sectors `1,2,3` plus ruins flag, which is complete and therefore unavailable.

Unknown survey-sector suffixes, noncontiguous sets, duplicate discovery identities, or ruins confirmation before all three sectors reject as incoherent. Rejection mutates nothing and creates no gameplay occurrence.

## 6. Preview And Execution Contract

One pure plan must supply both preview and execution facts:

- stage: `sector_1`, `sector_2`, `sector_3`, or `ruins_confirmation`;
- tick count `2`;
- normalized execution metabolic profile;
- survey attribute-load profile;
- projected body state and timeline;
- projected HP, MP, and stamina;
- explicit resource deltas;
- requested skill effect and predicted breakthrough-gate disposition;
- quest/operation/discovery/current-activity proposals;
- safe readiness or rejection facts.

Execution must recompute the plan against the command's authoritative snapshot and accept only an equivalent plan. UI must not submit hidden preview output as authority.

After completion, the survey plan returns `survey_already_complete`; it does not fall through to generic activity advancement. The safe UI reason directs the player to return to Saltmere. Generic activity advancement remains a separate legacy path.

## 7. Identity And Receipt Contract

The identities remain distinct:

| Identity | Meaning | Persistence |
| --- | --- | --- |
| command/request id | one normalized delivery intent | retained with rejection or accepted receipt |
| admitted occurrence id | one accepted survey-shift causal opportunity | required |
| deterministic result id | accepted stage outcome | required |
| consequence receipt id | one affected owner applying one result consequence | required |
| event id | typed transport/projection of accepted safe facts | not occurrence authority |
| notification/Chronicle ids | presentation records | not result or receipt authority |

One survey shift is the admitted attempt, so no separate mutable attempt id or long-lived attempt record is required. The occurrence is admitted before mutation and produces exactly one deterministic result. It uses no uncertainty channel.

Command identity may reuse the accepted command-shape pattern:

- type;
- command sequence;
- player id;
- survey intent discriminator;
- expected tick;
- expected snapshot format;
- expected revision.

The command id remains delivery identity only. Occurrence identity additionally requires stable campaign/continuity scope and the owner-certified normalized material-input identity. It cannot be derived solely from the opaque snapshot hash, tick, event id, notification id, Chronicle id, global sequence, or slot address.

## 8. Result Contract

An accepted result must expose or persist:

- `accepted: true`;
- code `survey_sector_logged` or `survey_packet_completed`;
- command, occurrence, and result ids;
- campaign, continuity, player, and quest ids;
- material-normalization and resolver versions;
- starting and applied ticks;
- stage;
- sector count before and after;
- ruins-confirmed posture before and after;
- tick and resource costs;
- skill id, requested delta, applied delta, blocked gate, and required band;
- discovery id when completion adds or retains it;
- resulting operation stage;
- resulting current-activity id;
- owner-specific consequence receipts;
- safe event and notice facts;
- accepted synchronized snapshot.

A rejected result has:

- `accepted: false`;
- one rejection code;
- command id when shape allowed it to be retained;
- no occurrence/result id;
- no consequence receipts or event;
- safe notice facts;
- the original snapshot by identity.

A recognized equivalent retry returns the retained accepted result status and current authoritative snapshot without reapplying consequences or re-emitting projections.

## 9. Typed Consequence Owner Matrix

| Consequence | Current writer | Future owner/application posture | Receipt requirement |
| --- | --- | --- | --- |
| clock/captured tick/play ticks | shell clock loop | game-engine survey transaction consuming shared time owner | required |
| metabolic body advancement | shell using player-engine body helper | player body owner through existing deterministic helper | required |
| attribute load/stat growth | shell using player-engine stat-growth helper | player stat-growth owner | required |
| MP/stamina cost | shell clamp helper | player resource owner through bounded survey proposal | required |
| skill progression | shell wrapper over player-engine policy | player skill-progression owner | required even when gate blocks delta |
| sector/ruins facts | session flags | survey/quest-progress owner | required |
| operation state | shell upsert | survey-operation projection/application owner | required |
| discovery fact | shell discovery helper | player discovery owner; completion only | required |
| current activity | shell | activity-state owner; completion only | required |
| snapshot synchronization | shared game-engine synchronizer | synchronization step after accepted applications | no independent gameplay result |
| notification/Chronicle/notice | shell | projection from accepted result and receipts | projection receipt/idempotency required |

The survey domain proposes typed effects and coordinates one atomic transaction. It does not become a generic resource, skill, discovery, quest, or projection owner. Existing player-engine helpers remain the authoritative calculation/application seams where they already own meaning.

## 10. Atomicity And Ordering

Future execution order:

1. validate request shape, player, snapshot coherence, and accepted-state publication scope;
2. recognize retained equivalent delivery or quarantine conflict;
3. resolve one authoritative plan;
4. reserve the occurrence identity;
5. clone the snapshot;
6. apply time, body, stat-growth, and resource consequences;
7. apply skill consequence;
8. apply quest progress;
9. apply operation, discovery, and current-activity consequences where included;
10. record owner-specific applied receipts and the accepted deterministic result;
11. synchronize the snapshot;
12. append safe notification and Chronicle projections exactly once;
13. publish one typed event;
14. return the accepted snapshot.

Any failure before acceptance returns the original snapshot and no accepted occurrence/result. A failure after reservation resumes or resolves that reservation; it must not mint another occurrence. Partial downstream projection failure cannot repeat already applied gameplay consequences.

## 11. Retry, Replay, And Correction

- Duplicate delivery with the same request id and equivalent intent returns retained status.
- The same request id with different normalized intent or provenance is `conflicting_retry` and quarantined.
- Reload or restart within the same continuity does not create another survey opportunity for an already accepted result.
- Normal rollback to a different authoritative continuity may expose an earlier survey stage only after save authority creates or resolves the permitted branch relation.
- A source correction retains the original occurrence/result, explicit evidence/reason, supersession link, and owner-specific reconciliation status.
- No player-facing correction, reroll, rollback, or receipt editor is part of the first survey package.
- Projection-only repair may replace a notice or Chronicle view without changing the survey result.

## 12. Persistence Decision

Current serialization is mechanically sufficient to preserve any field already present in `SaveSnapshot`, but the current snapshot contract is not semantically sufficient for survey occurrence authority.

Missing:

- stable campaign id;
- stable continuity id;
- accepted Normal Stakes policy identity/revision in live save state;
- authoritative artifact/publication provenance;
- persisted survey occurrence/result/consequence receipts;
- migration/default behavior for current version-6 snapshots;
- verified publication and retry behavior.

`accountId`, `playerId`, `snapshotVersion`, `capturedAtTick`, local slot id, save-envelope timestamp, optional `sourceRunId`, flags, notifications, and Chronicle entries cannot substitute.

The survey command package must not introduce these cross-cutting identities opportunistically. The next save-identity decision must define the minimum Normal-only subset and return one dependency-closed persistence foundation or `NO_PACKAGE`.

## 13. Candidate Later Survey Implementation Surface

After save identity/publication and survey receipt persistence are accepted, the bounded command package is expected to inspect or change:

- `packages/shared/types/src/contracts.ts`;
- `packages/shared/events/src/index.ts`;
- `packages/engines/game-engine/src/save-snapshot.ts`;
- `packages/engines/game-engine/src/player-survey-activity-advancement.ts`;
- `packages/engines/game-engine/src/player-survey-activity-advancement.js`;
- `packages/engines/game-engine/src/index.ts`;
- `apps/rpg-ui/src/game-shell/gameplayLoop.ts`;
- `apps/rpg-ui/src/features/ActivityPanel.tsx`;
- `tests/unit/player-survey-activity-advancement-characterization.test.mjs`;
- `tests/unit/player-survey-activity-advancement-command.test.mjs`;
- `tests/simulation/save-load-roundtrip.test.mjs`;
- only the accepted save/persistence paths proven necessary by the prerequisite;
- required coordination documents.

The exact activated path list remains deferred until the persistence prerequisite closes.

## 14. Later Validation Obligations

- all four accepted stages and exact current intended consequences;
- wrong location, missing/inactive/untracked quest, incoherent flags, and already-complete rejection;
- complete preview/execution plan parity including body, attribute load, MP, and stamina;
- exact deterministic skill-gate behavior;
- no-mutation rejection and unexpected-failure atomicity;
- malformed, wrong-player, stale, conflicting-retry, and duplicate-delivery behavior;
- distinct command/occurrence/result/event/consequence identities;
- same-tick collision resistance independent of unrelated insertion;
- receipt persistence across serialize/load/restart;
- equivalent retry after restart without repeated consequences or projections;
- correction/supersession structure without a correction UI;
- synchronization of quest, activity, discovery, progression, and body/resource surfaces;
- accepted-only UI application and disabled/readiness reason;
- source guard removing direct survey mutation from the UI-owned branch;
- focused travel, quest acceptance/tracking, activity selection, body/resource, skill, save, and current survey regressions;
- documentation/path/hygiene gates.

## 15. Protected Boundaries

- No generic activity resolver.
- No general competence, difficulty, familiarity, compression, uncertainty, RNG, margin, recovery, or aggregation.
- No survey turn-in, rewards, rivet cargo, generic quest completion, rest, inventory transactions, gathering, crafting, combat, health, care, death, Geography recognition, or map reveal.
- No broad save topology, Committed/Ironbound UI, checkpoint ladder, cloud conflict, or recovery browser in the survey command.
- No notification, Chronicle, event, tick, opaque snapshot hash, slot, or timestamp as occurrence authority.
- No mutation of the isolated readiness branch.
- No broad workspace typecheck as a gate.

## 16. Explicit Answers

1. **Exact current survey behavior?** Four deterministic survey-specific shifts followed by a defective preview/generic-execution mismatch after completion.
2. **Accepted owner contract?** One `player_activity.survey` domain command, one admitted shift occurrence, one deterministic result, typed owner-specific consequences, and projection-only event/UI output.
3. **Are general activity semantics required?** No.
4. **Are command, occurrence, result, event, and receipts distinct?** Yes.
5. **Does current persistence suffice?** Mechanically for existing fields, but not semantically; campaign/continuity/publication and receipt authority are absent.
6. **Is an implementation package ready?** No; `NO_PACKAGE`.
7. **What is the next route?** Unversioned `Ashen Reef Survey Minimum Save Identity And Accepted-State Publication Decision`.
8. **Is a version assigned?** No.

## 17. Non-Implementation Confirmation

This run changes documentation and coordination only. It does not change content, schemas, validators, tests, engines, shared contracts, saves, migrations, dependencies, generated files, UI, assets, or gameplay behavior.
