# Queued Codex Cleanup Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

This is a queued documentation-maintenance prompt. It must not displace, renumber, or broaden the active engine-ownership implementation sequence.

## Run Identity

Run an **unversioned support maintenance pass** named:

`Historical Version, Deferred Route, And Roadmap Reconciliation`

Do not claim a primary roadmap version or a four-segment support version for this maintenance pass. The current primary and its audit/repair suffixes remain reserved for the active runtime transition.

Suggested commit message:

`docs(roadmap): reconcile historical versions and deferred routes`

## Execution Gate

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state. Preserve unrelated work.
2. Read `AGENTS.md`, `README.md`, `docs/dev/current-codex-output.md`, `docs/dev/current-gpt-handoff.md`, `docs/dev/current-codex-prompt.md`, `docs/dev/codex-sequenced-implementation-plan.md`, `docs/dev/project-roadmap.md`, `docs/dev/project-vision-and-continuity-brief.md`, `docs/dev/historical-audit-doc-index.md`, `docs/future_content_backlog.md`, `docs/design/pipeline-roadmap-consolidation-decision.md`, `docs/design/streamlined-pipeline-roadmap-decision.md`, and `docs/design/runtime-ownership-transition-readiness-consolidation.md`.
3. Determine the live runtime anchor before editing:
   - If `Version 0.6.3 - Engine-Owned Activity Selection Command` has completed and the next expected route is still its post-transition audit, this cleanup may restore `docs/dev/current-codex-prompt.md` to the embedded `0.6.3.1` prompt at the end.
   - If the repository has already advanced beyond that point, preserve the actual current prompt and runtime anchors. Do not rewind them. The embedded prompt remains historical handoff context only.
   - If the activity-selection implementation is still in progress or the worktree contains overlapping changes, do not edit active output, handoff, or prompt files. Perform the cleanup only in non-overlapping historical/roadmap documents and report the skipped active files.
4. This run is documentation-only. Do not modify runtime, UI, tests, schemas, content, saves, migrations, dependencies, generated output, package metadata, or assets.

## Purpose

Reconcile the large `0.5.x` history and all still-deferred work into one trustworthy, queryable source of truth. Remove stale route identities, explain intentional numbering gaps and remaps, distinguish completed work from conditional support, and preserve explicit reopening gates for unfinished lanes.

This is intentionally a larger maintenance run. Inspect the complete historical sequence rather than patching only the currently known examples.

## Required Analysis

### 1. Exhaustive version-label inventory

Use repository search plus a one-off local script or shell pipeline to collect every version label matching `0.5.*` from at least:

- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/future_content_backlog.md`
- `docs/dev/current-codex-output.md`
- `docs/dev/current-gpt-handoff.md`
- focused roadmap, deferral, consolidation, and historical-index documents

Normalize each label into:

- canonical primary version;
- support suffix, if any;
- title or route identity;
- status;
- source document;
- replacement/remap, if any;
- whether it consumed a roadmap slot;
- whether any implementation remains.

Do not commit a temporary analysis script unless it is genuinely reusable and documented. Remove temporary files before completion.

### 2. Detect and resolve historical inconsistencies

At minimum, resolve these known cases:

- The stale historical trajectory row that still identifies `0.5.357` as `Tool Surface Test Post-Repair Audit` even though the current override uses `0.5.357` for `Runtime Ownership Transition Readiness Consolidation`.
- The obsolete recommendation that still points to the old `0.5.357` tool-surface audit.
- `0.5.356.1 - Tool Surface Test Post-Repair Audit` must be represented as conditional support only, runnable only if fresh focused evidence contradicts the accepted repair.
- The unexplained absence of `0.5.211`. Determine from commit/docs evidence whether it was intentionally unused, reserved, or a numbering accident. Do not invent a missing implementation. Record the evidence-backed classification.
- Historical proposed labels `0.5.199`, `0.5.202`, `0.5.205`, `0.5.207`, `0.5.210`, `0.5.213`, and `0.5.215` must be clearly marked as remapped aliases whose final routes completed at `0.5.227`, `0.5.225`, `0.5.224`, `0.5.223`, `0.5.221`, `0.5.220`, and `0.5.219` respectively.
- Verify all other labels marked `Historical`, `Planned`, `Deferred`, `Paused`, `Rejected`, `Conditional`, `Superseded`, or `Completed` for stale or contradictory wording.
- Check for duplicate canonical version numbers with different titles, planned rows left behind after completion, suffix runs accidentally treated as primary rows, and primary versions incorrectly described as support runs.

When two documents disagree, prefer the newest accepted current handoff/override and the actual commit history, then preserve older text only as explicitly historical context.

### 3. Exhaustive deferred-lane inventory

Identify every substantive lane that still requires later work, including lanes where a schema or helper exists but content, registration, runtime ownership, UI, persistence, or a ready consumer is still absent.

Do not limit the scan to the examples below. At minimum evaluate:

- People/NPC identity and NPC overlays;
- factions;
- institutions and separate institution-office authority;
- business/company identity;
- government and jurisdiction;
- force/public-order identity;
- diplomacy and conflict;
- household/family content and later membership/kinship/runtime owners;
- settlement economy content and integration;
- magic study sources and effectful engine-owned casting;
- weapon/armor structural-profile content and migration;
- hazard-profile and route-security-profile content, overlays, and runtime consumers;
- service provider/availability/access/price/stock/effect integration;
- resource/commodity expansion and runtime integrations;
- combat status/condition/injury expansion and execution semantics;
- locality-scale religious-hotspot coverage;
- Living Character Manuscript/history/provenance work;
- Home/compact shell, linked records/search/history/pins, player notes, Codex certainty, combat presentation, tactics editing, and any ordered gambit interpreter;
- activity advancement, rest, quest turn-in, rewards, inventory, reputation, and other runtime-ownership consumers;
- generic command bus, event dispatch, replay/idempotent delivery, and durable event/history retention;
- full-suite/typecheck debt and environment-dependent validation debt;
- any other lane revealed by schema-without-content, content-without-registration, plan-without-implementation, or explicit deferral language.

For every open lane, classify it as exactly one of:

- `ready`: enough evidence exists for a bounded next run;
- `consumer-gated`: requires a named ready consumer;
- `authored-input-gated`: requires materially new canonical authored evidence;
- `research-gated`: requires targeted research before planning;
- `maturity-gated`: correct but intentionally later in the product sequence;
- `paused`: accepted stable state with no current expansion authorization;
- `conditional-support`: run only if contrary evidence appears;
- `rejected`: not an approved future authority or route;
- `closed`: completed with no expected follow-up under current scope.

For non-closed lanes, record:

- current completed foundation;
- exact missing layer;
- explicit reopening trigger;
- forbidden premature work;
- preferred next output type;
- best source document;
- whether the lane should compete for the near-term runtime queue.

Do not convert a gate into permission. Do not schedule weak-source rescans where an authored-input deferral prohibits them.

### 4. Current runtime queue preservation

The cleanup must not change the owner-first runtime sequence selected by accepted audits.

- Preserve the actual active primary, support audit/repair route, and next consumer chosen by the current handoff.
- Do not insert historical cleanup, UI implementation, broad content expansion, magic execution, or infrastructure work ahead of an active post-transition audit.
- Preserve the rule that activity advancement, rest, and quest turn-in are separate owner-specific packages.
- Preserve deferred command-bus, replay/idempotency, event-dispatch, and generic lifecycle work unless current evidence explicitly promotes one.

## Required Deliverables

### A. Create a canonical register

Create:

`docs/dev/historical-version-and-deferred-route-register.md`

Use two main sections.

#### Historical version register

Include a compact table with at least:

| Canonical version | Historical alias/suffix | Route | Status | Final disposition | Source |

Requirements:

- Cover every identified remap, gap, duplicate, superseded pointer, and conditional suffix.
- Explain `0.5.211` without inventing work.
- Make the `0.5.357` identity unambiguous.
- Separate primary versions from support suffixes.
- Avoid reproducing hundreds of routine completed entries when a contiguous completed range can be summarized safely; list exceptions individually.

#### Deferred route register

Include a compact table with at least:

| Lane | Classification | Completed foundation | Missing layer | Reopening trigger | Near-term queue posture | Primary source |

Requirements:

- Be exhaustive enough to prevent forgotten work.
- Keep rejected routes visibly rejected rather than treating them as backlog.
- Keep conditional support visibly conditional.
- Distinguish static authority/content work from runtime ownership and UI presentation.
- State whether a lane is eligible for a larger future run now that token limits are less restrictive. Larger scope is permitted only when ownership and acceptance boundaries remain coherent.

### B. Reconcile existing roadmap documents

Update only where necessary:

- `docs/dev/codex-sequenced-implementation-plan.md`
- `docs/dev/project-roadmap.md`
- `docs/dev/project-vision-and-continuity-brief.md`
- `docs/dev/historical-audit-doc-index.md`
- `docs/future_content_backlog.md`

Required corrections:

- Remove or explicitly historicalize the stale `0.5.357` tool-surface row and recommendation.
- Record `0.5.356.1` as conditional support only.
- Explain `0.5.211` consistently.
- Link the new canonical register from the sequence plan, roadmap, continuity brief, and historical index where appropriate.
- Replace repeated long deferred-lane lists with a concise pointer to the canonical register when doing so reduces drift without erasing important context.
- Preserve accepted current runtime anchors exactly.

Do not rewrite historical design decisions merely to modernize their language. Correct only false current pointers, ambiguous version identities, stale statuses, and duplicated direction-bearing summaries.

### C. Preserve active handoff files

Default behavior:

- Do not overwrite `docs/dev/current-codex-output.md` or `docs/dev/current-gpt-handoff.md` for this maintenance pass.
- Add at most a short pointer to the canonical register only if the active files would otherwise remain materially misleading.
- Do not replace a newer current prompt with the embedded older prompt.

If, and only if, the branch has completed `0.6.3` and the current next route is still `0.6.3.1`, set `docs/dev/current-codex-prompt.md` to the embedded prompt below verbatim.

## Validation

Run documentation-focused checks:

1. Re-run the version inventory after edits and confirm:
   - no canonical version has conflicting live identities;
   - every historical alias points to one final disposition;
   - suffix runs are not counted as primary slots;
   - no stale `Planned` row remains for a completed route unless explicitly marked historical.
2. Search for all references to:
   - `0.5.211`;
   - `0.5.356.1`;
   - `0.5.357`;
   - `Tool Surface Test Post-Repair Audit`;
   - `Runtime Ownership Transition Readiness Consolidation`.
   Confirm their wording is mutually consistent.
3. Search all direction-bearing docs for stale current-primary, next-version, and next-route statements.
4. Check every linked path in the new register exists.
5. Run conflict-marker and trailing-whitespace searches.
6. Run `git diff --check`.
7. Inspect the complete changed-path set and confirm it is documentation-only.

Do not run the full test suite, builds, typechecks, package installation, servers, generators, or content-lint unless a documentation claim specifically requires verification and the command is side-effect free.

## Completion Report

Report:

- starting commit and branch state;
- files inspected;
- exact files changed;
- version conflicts corrected;
- classification of `0.5.211`;
- remaps confirmed;
- conditional-support routes preserved;
- count of open lanes by classification;
- lanes judged ready for a larger bounded run;
- current runtime sequence preserved;
- whether the embedded next prompt was installed or only retained in this queued file;
- checks run and results;
- remaining uncertainties requiring user judgment.

Do not select or implement a new gameplay consumer in this cleanup.

---

# Embedded Expected Next Prompt

Install the following content as `docs/dev/current-codex-prompt.md` **only** when `Version 0.6.3 - Engine-Owned Activity Selection Command` has completed and the repository has not advanced beyond its expected post-transition audit.

```markdown
# Current Codex Prompt

You are working in the `vagabond1215/Lineage_Reforged` repository on branch `master`.

Run:

`Version 0.6.3.1 - Engine-Owned Activity Selection Post-Transition Audit`

## Accepted State

- Player travel, quest acceptance, and repaired quest tracking are engine-owned and accepted.
- `Version 0.6.3 - Engine-Owned Activity Selection Command` moved only activity-record selection behind one browser-safe engine resolver, deterministic transient command, atomic synchronized result, and typed accepted event.
- The transition is required to preserve the locked success snapshot hash `1f2f5178d3ac4d9c592184f714bdec5c71f421012608b6850d548ed300e5fc40`, success notice hash `ca04212b7f64e83b8462653ab090144b4710a6e98b7ae64aa68f6846b04415ee`, and missing-record notice hash `31bafd513a34fce0bceb4c7c3b779e89da098cdb1b18b1e669b078ae4d13ed77`.
- Activity advancement/preview, rest/preview, quest turn-in, and every other `currentActivity` writer remain separate.
- No Deep Research or user decision is required.

## Purpose

Perform one read-only post-transition audit of engine-owned activity selection. Decide whether the extraction is accepted or whether one smallest repair run is required.

Do not modify runtime, UI, shared contracts, events, tests, content, schemas, saves, dependencies, or generated output in this run.

## Required First Steps

1. Run branch status, fetch, and fast-forward pull. Record the starting commit and clean/dirty state; preserve unrelated work.
2. Read `AGENTS.md`, README, current output/handoff/prompt, sequencing plan, roadmap, continuity brief, runtime-readiness and travel-clarification sources, the historical/deferred-route register if present, and backlog.
3. Inspect the committed `0.6.3` changed-path set and exact diff; the activity-selection resolver/command/result/event; JS peer and public exports; shared event registration; snapshot synchronizer; persistence contracts; gameplay-loop bridge; `ActivityPanel.tsx`; characterization/command tests; notification cap/time-label behavior; all production `currentActivity` writers; and accepted travel/quest command patterns.

## Audit Gates

### Authority and scope

- Confirm the engine resolver is the sole owner of activity-record lookup, category derivation, and selection eligibility used by execution.
- Confirm the UI bridge contains no direct activity-selection mutation or selection-notification append.
- Confirm `ActivityPanel.tsx` applies returned snapshots only on accepted results and always displays the returned notice.
- Classify every remaining production `currentActivity` assignment by owner. Travel, quest acceptance, activity advancement, rest, quest turn-in, synchronizer cleanup, or other pre-existing owner-specific assignments may remain; duplicate activity-selection ownership may not.
- Confirm no advancement, preview, rest, turn-in, reward, inventory, reputation, clock/body/resource, activity-record content, notification infrastructure, UI-layout, or unrelated refactor entered the patch.

### Behavior parity

- Re-run complete success and missing-record snapshot/notice characterization and confirm the accepted hashes remain exact.
- Confirm selected id, label, derived category, and detail are exact.
- Confirm the exact `Current activity set` notification id, title, detail, time label, tone, newest-first order, and eight-entry cap.
- Confirm Chronicle state is unchanged.
- Confirm selecting an already-selected record remains accepted and appends another notification.
- Confirm missing-record behavior returns the original snapshot identity/content and the exact warning notice.
- Confirm input snapshots remain immutable.

### Command identity and atomicity

- Confirm command shape includes player id, activity record id, deterministic sequence, expected tick, snapshot version, full snapshot revision, and collision-safe deterministic identity.
- Confirm identical fixtures repeat exactly and distinct same-tick record selections cannot collide.
- Confirm malformed, wrong-player, stale tick/version/revision, incoherent, missing-record, and injected-failure paths return the original snapshot identity/content and emit zero events.
- Confirm accepted execution clones before mutation, changes only selection state plus the existing notification before synchronization, and cannot expose a partial clone.

### Event, persistence, and browser boundary

- Confirm exactly one typed `player.activity.selected` event is emitted on acceptance.
- Confirm its payload contains exactly `commandId`, `playerId`, `recordId`, `previousActivityId`, and `selectedActivityId`.
- Confirm no label, category, detail, notification text, notice text, presentation prose, or snapshot internals exist in the event.
- Confirm current-data serialization roundtrip preserves accepted selection and notification state while persisting no command correlation.
- Confirm browser-safe imports, intentional TS/JS peer alignment, public exports, and shared event registration.

### UI adapter and hygiene

- Confirm every rejection notice remains visible while rejected snapshots are not applied.
- Confirm no conflict markers, temporary artifacts, accidental generated/vendor edits, unrelated dependency changes, or broad formatting churn.
- Run `git show --check`, `git diff --check`, and inspect the complete changed-path set.

## Required Tests

Run the activity-selection command and characterization tests created by `0.6.3`, plus:

`node --test tests/unit/player-quest-tracking-command.test.mjs tests/unit/player-quest-tracking-characterization.test.mjs tests/unit/player-quest-acceptance-command.test.mjs tests/unit/player-quest-acceptance-characterization.test.mjs tests/unit/player-travel-command.test.mjs tests/unit/player-travel-characterization.test.mjs tests/unit/gameplay-loop-skill-gating.test.mjs tests/simulation/save-load-roundtrip.test.mjs tests/simulation/deterministic-scenario.test.mjs`

If the activity-selection files use the expected names, run them in the same command:

`tests/unit/player-activity-selection-command.test.mjs tests/unit/player-activity-selection-characterization.test.mjs`

Do not run the full suite, DB build, UI build, package installation, servers, or generated-output refresh. Run typecheck only if it materially clarifies a touched-boundary diagnostic.

## Decision Rule

- If every gate passes, accept `0.6.3`, compare activity advancement, rest, and quest turn-in from current source evidence, and select exactly one bounded `Version 0.6.4 - ...` consumer. Larger scope is allowed only when it remains one coherent owner-specific command package with characterization, preview/execution reconciliation where required, atomicity, and focused validation.
- If a material defect exists, select `Version 0.6.3.2 - Engine-Owned Activity Selection Repair`, define only the smallest coherent repair, and do not select another consumer.
- Do not implement a repair or next consumer during this read-only audit.

## Documentation And Handoff

Overwrite current output and handoff; update only current sequencing/roadmap/continuity/backlog anchors; and overwrite this file with the exact accepted next implementation or smallest repair prompt. Record source/run/date, starting status, files inspected, checks, gate evidence, acceptance decision, consumer comparison if allowed, risks, next version, and suggested commit.

Suggested commit message:

`docs(audit): verify engine-owned activity selection transition`
```
