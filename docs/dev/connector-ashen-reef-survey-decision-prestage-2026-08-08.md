# Connector Prestage — Ashen Reef Survey Receipt Decision

Date: 2026-08-08

Execution surface: ChatGPT via GitHub Connector only

Source head inspected: `2c561b85852c9b47ecbfc9e278f8adb0e3dda2ad`

Active route: `Ashen Reef Survey Occurrence, Result, And Consequence Receipt Foundation Decision`

Status: `CONNECTOR_PRESTAGE_COMPLETE_NO_DECISION`

## Purpose

Reduce rediscovery during the documentation-only Ashen Reef survey receipt decision by consolidating the current survey mutation surface and the already-produced Connector evidence whose mandatory-consumer triggers now apply.

This prestage is evidence only. It does not decide the survey identity graph, persisted receipt shape, atomicity contract, correction model, version label, `PACKAGE_READY`/`NO_PACKAGE` outcome, or implementation surface. Codex must verify all dynamic facts and source claims against its freshly synchronized checkout.

## Accepted Starting Authority

`Version 0.6.9 - Normal Stakes Campaign Persistence Foundation` is accepted through installed independent audit `Version 0.6.9.11 - Historical Recovery Fork Authority Acceptance Audit` at acceptance authority commit `0262285e9f19c954ab1693838e27c8a7ea349640`.

The accepted bounded Model C lineage guarantee remains unchanged. The active survey decision may reuse campaign identity, continuity, immutable artifact, verified publication, campaign mutation admission, linked continuity-fork lineage, retained duplicate-result patterns, and authority-ledger foundations without reopening parent acceptance.

Survey behavior is still unimplemented as an engine-owned command/result/receipt package. `0.7.0` remains `NOT_READY`.

## Current Survey Mutation Inventory

The live Ashen Reef path remains in `apps/rpg-ui/src/game-shell/gameplayLoop.ts` inside `previewAdvanceCurrentActivity(...)` and `advanceCurrentActivity(...)`.

For an active tracked `quest.ashen_reef_survey` at `location.ashen_reef`, the current path uses a two-tick survey shift with a high metabolic profile and survey-specific attribute load, then directly coordinates multiple owners from the UI bridge.

Every survey shift currently applies:

- two clock ticks and synchronized total-play-time progression through the shared clock/body path;
- survey metabolic/body advancement;
- survey attribute load;
- `Stamina -10`;
- `MP -3`.

While fewer than three sectors are logged, the shift additionally:

- appends the next `gameplay.quest.ashen_reef_survey.sector.<n>` flag;
- attempts `skill.knowledge.general_lore` gain through the existing skill-rank policy, including the blocked-breakthrough posture;
- upserts the survey operation;
- appends a session notification;
- appends a Chronicle projection.

After all three sectors are logged and the ruins marker is not yet confirmed, the next shift additionally:

- appends `gameplay.quest.ashen_reef_survey.ruins_confirmed`;
- attempts `skill.resource.identify.flora` gain through the existing skill-rank policy;
- adds the `discovery.stormglass_bloom` discovery Chronicle entry when absent;
- adds `gameplay.discovery.stormglass_bloom` through the discovery helper;
- upserts the survey operation;
- replaces `currentActivity` with `activity.return.survey_packet`;
- appends a session notification;
- appends a Chronicle projection.

The preview path currently projects the clock/body consequence but does not expose the complete accepted multi-owner consequence set. This asymmetry is evidence for the decision; it is not permission to repair preview in the documentation-only run.

## Applicable Connector Evidence

The following isolated branches are directly applicable and must be inspected as evidence during the decision. They remain `CANDIDATE_INTEGRATION`; do not merge or modify them.

### 1. Activity advancement and effect routing

Branch: `parallel/activity-advancement-audit`

Head: `b4cbaea5f4292904bba62f60a0108bb84f2bd405`

Artifact: `docs/design/activity-advancement-command-result-and-effect-routing-audit.md`

Relevant finding: activity selection is engine-owned, but advancement is a UI-owned multi-domain mutation bridge. The audit identifies surveys, activity advancement, multi-owner rewards, preview parity, occurrence/result/effect contracts, and removal of UI gameplay-loop mutations as mandatory consumers.

Key constraint to preserve: do not begin with a universal activity resolver. Decide one bounded survey occurrence/result/effect route with explicit affected-owner boundaries.

### 2. Player progression and reward mutation

Branch: `parallel/player-progression-reward-mutation-audit`

Head: `387f2491d0d671ee7834656c28183e72a798f1ca`

Artifact: `docs/design/player-progression-and-reward-mutation-source-audit.md`

Relevant finding: deterministic player-engine helpers exist, but current noncombat progression and multi-owner reward orchestration is UI bridge-owned. Generic campaign admission proves snapshot admission, not the exact domain authority for each skill/resource/reward fact.

For this survey decision, inspect both current skill effects separately:

- `skill.knowledge.general_lore` during sector logging;
- `skill.resource.identify.flora` during final survey discovery.

Do not collapse these into one generic progression receipt without proving the owning policy and idempotency boundary.

### 3. Chronicle, notification, operation, and projection provenance

Branch: `parallel/chronicle-notification-provenance-audit`

Head: `4b65d7fb6e093743cdc4d5a6db5b0e1bb6638c01`

Artifact: `docs/design/chronicle-notification-operation-and-projection-provenance-audit.md`

Relevant finding: Chronicle rows and session notifications are persisted presentation records, not independent gameplay-result authority. UI-authored operation/current-activity state also lacks a common result identity in these bridge flows.

The survey decision must distinguish accepted gameplay truth from derived notification, Chronicle, notice, operation, and event projections, and must define duplicate/correction behavior without treating projection text or array position as authority.

### 4. Knowledge, discovery, observation, and visibility ownership

Branch: `parallel/knowledge-discovery-visibility-audit`

Head: `46434f31f8b06d49aad9a516543fbe36d188d519`

Artifact: `docs/design/knowledge-discovery-observation-and-visibility-ownership-audit.md`

Relevant finding: known locations, geographic Knowledge, discovery Chronicle, Codex visibility, quest/session flags, observation/provenance, map projection, and hidden truth are distinct authorities. The current Ashen Reef survey example already demonstrates simultaneous discovery entry, flag, Codex/reference link, notification, Chronicle narrative, and later reward consequences without a reusable discovery receipt.

The decision must not treat the discovery flag, discovery Chronicle entry, Codex reference, Knowledge progression, or presentation visibility as interchangeable.

## Protected Readiness Evidence

Read `prep/integrated-gameplay-0-7-readiness-audit` through read-only Git inspection only.

Its historical source snapshot is stale and its live routing is superseded, but its architecture finding remains useful evidence to verify against current source: authoritative activity advancement, not content volume, is the key representative-loop gap; Ashen Reef survey advancement was identified as the strongest bounded first integration candidate. Do not copy its old save, test, branch, or route facts.

## Decision Questions This Prestage Sharpens

Codex should independently resolve, from current repository authority:

1. Whether the survey occurrence and deterministic result live in one survey-owned persisted container or separate bounded records.
2. Which affected owners require durable consequence receipts versus result-linked deterministic re-projection.
3. Whether player skill consequences share one owner receipt kind or require distinct progression-owner evidence while remaining correlated to one survey result.
4. Whether sector/ruins flags are canonical survey result state, derived quest progress, compatibility projections, or some bounded combination.
5. Whether the Stormglass Bloom discovery entry and discovery flag are one accepted discovery application plus projections or separate owner facts.
6. How survey operation and `currentActivity` changes relate to accepted result authority and correction.
7. Which notification, Chronicle, notice, and typed event records are reproducible projections versus persisted repairable projections.
8. What exact state is committed atomically before verified campaign publication, and what can be repaired afterward without replaying gameplay effects.
9. Which current preview facts are required in a future pure shared plan so preview and execution cannot diverge on hidden owner effects.
10. Whether the smallest implementation package is fully owner-bounded now; if not, identify the single smallest prerequisite and return `NO_PACKAGE`.

## Branch And PR Posture

At Connector inspection, hosted inventory remained 37 branches total: `master` plus 36 non-default branches. PR #2 and PR #3 remained open preserved evidence. No evidence branch is authorized for merge or mutation by this prestage.

PR #3 metadata was corrected on 2026-08-08 to state the now-current posture: parent `0.6.9` is accepted and the repair bundle must not reopen acceptance or widen the active Ashen Reef decision.

Codex must fetch/prune and refresh all dynamic branch, PR, mergeability, status, and workflow facts before acting.

## Validation Limits

This prestage used GitHub Connector source, branch, PR, and documentation inspection only.

It did not run local Git, tests, builds, typechecks, browser checks, executable survey characterization, serialization probes, or worktree inspection. It did not modify production source, tests, schemas, migrations, assets, content, dependencies, branches, or PR lifecycle state.

## Resume Boundary

The next Codex run should read this prestage after synchronizing, then execute the exact active survey decision end to end without a routine Connector interruption.

The prestage should reduce orientation cost, not replace local verification. The final decision remains solely the responsibility of the repository-capable decision run.
