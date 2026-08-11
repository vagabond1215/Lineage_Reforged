# Version 0.6.10.2 - Ashen Reef Survey Advancement Authority Repair

Date: 2026-08-10

Label class: support suffix

Parent version: `Version 0.6.10 - Ashen Reef Survey Advancement Authority`

Milestone impact: `supports_current_band`

Execution posture: bounded repository implementation and validation

Suggested commit:

`fix(survey): repair advancement authority`

## Objective

Repair the six material authority and caller defects proven by `Version 0.6.10.1 - Ashen Reef Survey Advancement Acceptance Audit`, while preserving the accepted four-stage survey behavior and the positive persistence, retry, continuity, receipt, projection, correction, and UI contracts already implemented by `0.6.10`.

This is a parent-specific support repair. It does not accept parent `0.6.10`, classify representative-loop readiness, or authorize `0.7.0`. After implementation and full validation, install a separate `Version 0.6.10.3 - Ashen Reef Survey Advancement Post-Repair Acceptance Audit`.

## Starting Disposition

- `0.6.10`: implemented but not accepted;
- `0.6.10.1`: complete with primary result `REPAIR_REQUIRED`;
- survey receipt design decision: remains `PACKAGE_READY` as design authority, while its implementation has unresolved defects;
- representative-loop classification: not reached because the parent failed acceptance;
- accepted `0.6.9`: unchanged;
- `0.7.0`: `NOT_READY` pending repaired parent acceptance and a later explicit docs-first band-entry decision.

## Authority And Orientation

Read `AGENTS.md` completely and follow the complete repository-first protocol, prompt-execution platform/tool policy, branch policy/register, and applicable failure-pattern guardrails. Read the current prompt, handoff, output, permanent `0.6.10.1` audit record, all focused Ashen Reef survey decisions, accepted occurrence/correction and `0.6.9` persistence authorities, historical register, planning reconciliation, and every production/test file in the repair surface.

Fetch/prune and synchronize clean `master`. Record the audit starting head, implementation commit `008db9c93eb8818aea51652be07fd196df41c45f`, the `0.6.10.1` coordination commit, repair commit, pushed remote head, and post-fetch hosted head distinctly. Reinspect every local/remote branch and open PR, including the four exact Connector evidence refs and protected integrated-gameplay readiness ref, but keep all evidence and protected refs read-only.

Reverify each material claim below against the freshly synchronized source before editing. Prior audit probes and subagent reports are evidence, not implementation authority.

## Authorized Surface

The expected smallest production surface is:

- `packages/shared/types/src/contracts.ts`;
- `packages/engines/game-engine/src/campaign-rules.ts`;
- `packages/engines/game-engine/src/player-survey-activity-advancement.ts` and its JavaScript forwarding peer only when required by the existing mirror contract;
- `apps/rpg-ui/src/runtime/GameSessionContext.tsx`;
- `apps/rpg-ui/src/features/ActivityPanel.tsx`;
- the three focused survey test files and the smallest directly relevant caller/source-guard tests.

Treat `campaign-session`, `saveManager`, `normal-defeat`, `gameplayLoop`, shared event exports, and engine public indexes as conditional surfaces: edit them only if fresh direct evidence proves the repair cannot be complete otherwise. Preserve every TypeScript/JavaScript mirror and public export contract that actually applies.

Do not add production dependencies, redesign generic command/effect/replay/correction infrastructure, or refactor unrelated code.

## Required Repair Matrix

Implement all six rows. Each row must be mapped in the completion record to its exact owner, production patch, and focused regression evidence.

### AR-001 - Deep normalized-owner validation and canonical intent

`ownerInputs.progression` and `ownerInputs.reputation` currently pass with outer-record checks, and nested key order can be caller-preserved while a recomputed intent string is treated as canonical.

- Deeply validate every normalized owner input against the repository's accepted runtime shape and semantic invariants, including progression and reputation.
- Make canonical intent serialization recursively insertion-order independent. The validator, not caller-provided nested ordering, must own the one canonical representation.
- Preserve bounded owner input authority; do not replace it with a whole-snapshot retry fingerprint.
- Add no-throw negative tests for `{}`, `[]`, `null`, missing nested fields, well-shaped semantic corruption, nested-key permutation, and a caller-recomputed string. Add exact equivalent retry tests across key-order permutations.

### AR-002 - Correction evidence is mandatory

A complete correction currently validates with `evidenceIds: []`.

- Require a nonempty, unique, valid evidence-ID set for every correction while preserving exact reconciliation-owner completeness, acyclicity, and one-correction-per-superseded-result rules.
- Reject missing, empty, duplicate, malformed, and conflicting evidence before later survey work or publication can proceed.
- Add focused persistence/validator tests for each case and one valid correction round trip.

### AR-003 - Retention-safe deterministic projection ordering and production repair discovery

Notification and Chronicle repair currently order only by tick, prepend on ties, and truncate a capped destination that may be valid but reordered, allowing repair to evict a newer retained row. Post-run reconciliation also confirmed that the production discovery helper currently starts only from receipts whose original posture is `projection_pending`, even though the accepted direct repair API supports eligible notification/Chronicle rows that were originally `applied` and later become missing or malformed.

- Define and apply one total authority order using `(appliedTick, stable resultId)` for survey-derived notification and Chronicle rows.
- Inspect or normalize the entire retained destination before insertion; never assume array order proves authority order.
- Prove cap truncation cannot evict newer retained truth. Unknown, malformed, or ambiguous ordering must fail closed or resolve through the accepted retention-expired posture rather than overwrite evidence.
- Keep projection IDs result-derived and retry-stable. Do not change legitimate cap semantics or manufacture missing gameplay truth.
- Make `listPendingPlayerSurveyProjectionRepairs(snapshot)` mean "list the currently actionable survey projection repairs that the production caller can safely offer now," rather than "list only projections whose original receipt posture was pending."
- For notification and Chronicle receipts, derive current repairability from the retained result/receipt/correction graph plus the current destination: an originally `applied` row that is now missing or same-id malformed must be discoverable when the direct repair API would accept repair; a row previously repaired with `inserted` or `replaced` must become discoverable again if the destination later drifts and a later repair ordinal is valid; an exactly correct row must not be listed; terminal `retention_expired`, stale correction/newer-authority control, duplicate destination ids, and invalid authority must not be offered as unsafe repair work.
- Preserve the stricter event rule: only an event receipt originally `projection_pending` may be listed for re-emission; an originally applied event is never re-emitted, and `event_reemitted` is terminal.
- Keep the discovery helper pure: it must not mutate the snapshot, rerun gameplay, mint results/receipts, emit events, change corrections, or alter campaign continuity.
- Return multiple actionable repair candidates in deterministic owner-defined result/receipt order, not wall clock, UI state, destination insertion order, or an unrelated global sequence.
- Add permutation tests, reordered-cap tests with a newer row at the tail, same-tick stable-result-ID tie tests in both invocation orders, notification/Chronicle parity, duplicate repair, and legitimate retention-expiry cases.
- Add explicit production-discovery regressions for: applied notification -> missing -> listed -> repaired; applied notification -> malformed -> listed -> repaired; Chronicle equivalents; correct applied rows not listed; pending notification/Chronicle still listed; repaired notification/Chronicle drifting again -> listed and repaired at the next ordinal; retention-expired not relisted; pending event listed once; originally applied event never listed; event after `event_reemitted` not listed; correction/newer-authority and duplicated/malformed authority not offered.

### AR-004 - Caller request identity retention only for typed technical retry

The real caller currently mints an ID before command creation, catches every preparation exception as `null`, and leaves that ID retained on the null path without proving a classified technical `transition_failed` retry.

- Return or propagate a typed preparation outcome that distinguishes an accepted command result, an expected domain/authority/availability rejection, and the one authorized technical pre-accept transition failure.
- Clear the pending request ID for every nontechnical rejection or unclassified exception. Retain it only for the explicitly typed technical pre-accept retry and clear it after acceptance or any terminal result.
- Keep unavailable work disabled and preserve accepted-only snapshot/control application.
- Add real caller tests or decision-complete source guards for thrown preparation failures, domain rejection, unavailable preview, technical retry, rerender, acceptance, and terminal rejection. Regex presence alone is insufficient.

### AR-005 - Explicit survey non-proposals

The plan/result authority leaves geographic Knowledge, known-location, and map consequences merely absent instead of explicitly recording the accepted `no_proposal` posture.

- Add a typed, canonically validated plan/result non-effect posture for geographic Knowledge, known-location/map/travel-access changes, and preserve the audit's unchanged currency, standing, inventory, reputation-beyond-ordinary-synchronization, and turn-in-reward boundaries.
- Preview and execution must derive the same non-proposals from the shared pure plan. Do not create gameplay receipts or actual Knowledge/map/reward mutations for these exclusions.
- Add plan/result/serialization/parity tests and prove all named destinations remain byte-equivalent except for separately authorized ordinary synchronization.

### AR-006 - Accurate zero-delta skill presentation

The UI currently labels every zero skill delta as breakthrough-gate blocked, even when the policy reports `blockedGate: null`, such as max rank.

- Render `applied`, `blocked at <gate>`, and `unchanged` from the actual plan/result fields without inferring a block from delta alone.
- Preserve established copy for genuine General Lore and flora-identification gate blocks.
- Add focused caller/UI coverage for positive gain, blocked zero delta, and unblocked zero delta.

## Positive Contracts To Preserve

Do not regress:

1. exact four-stage sector/ruins sequencing and established copy;
2. two full one-tick clock/body/stat/resource steps, natural resource resolution before explicit Stamina/MP costs, and changing-maxima behavior;
3. source immutability and rejection identity/byte preservation;
4. duplicate lookup before stale rejection, current-state return without replay, exact request-created fork provenance, and atomic prepare/commit;
5. complete owner receipts, legacy baseline rules, correction pending block, and event repair restrictions;
6. nested survey authority across fork, version-6 migration, version-7 publication/restart, Normal defeat, and recovery completion;
7. fresh missing-Codex-row no-creation and demo locked-row unlock behavior;
8. accepted-only ActivityPanel/GameSessionContext application and disabled unavailable action posture.

## Required Validation

Run and report exact counts/results for:

1. a fresh removable adversarial probe covering all six repair rows before relying on tracked tests;
2. all three survey test files and all added repair cases;
3. `gameplay-loop-skill-gating`, campaign persistence, save/load round trip, and the same adjacent travel, quest acceptance/tracking, activity selection, body/resources, stat/progression, publication, and real-caller matrix used by `0.6.10.1`;
4. raw serialization, version-6 migration, version-7 publication/readback/restart, browser safety, Normal defeat/recovery, JS/TS mirror, and public-export checks;
5. RPG UI production build;
6. bounded TypeScript audit with the registered total baseline and every touched-file diagnostic; do not weaken or hide the baseline;
7. targeted source guards that prove semantics rather than identifier presence alone;
8. `git diff --check`, full diff and hygiene review, clean final worktree, branch/upstream, fetch/remote-head, hosted file/status, and workflow availability checks.

Apply at minimum `FP-001`, `FP-002`, `FP-003`, `FP-005`, `FP-006`, `FP-008`, `FP-009`, `FP-011`, `FP-012`, `FP-013`, and `FP-014`. A green test count does not replace caller, restart, retry, conflict, malformed-authority, retention-order, or production-repair-discovery evidence.

## Outcome And Coordination

This implementation run may return only `IMPLEMENTED_PENDING_POST_REPAIR_AUDIT` or `REPAIR_INCOMPLETE`.

Use `IMPLEMENTED_PENDING_POST_REPAIR_AUDIT` only if every repair row and positive gate passes. Then update the permanent audit record with an implementation appendix, current prompt/output/handoff, focused survey authority status, repository-first Current Application, historical register, planning reconciliation, roadmap, sequenced plan, continuity brief, backlog, static program, failure-pattern register when warranted, and branch register. Install `Version 0.6.10.3 - Ashen Reef Survey Advancement Post-Repair Acceptance Audit` as a production-read-only independent audit.

Use `REPAIR_INCOMPLETE` if any repair row or required gate fails. Preserve exact evidence, install the smallest support continuation without claiming parent acceptance, and keep representative-loop classification and `0.7.0` blocked.

Commit, push, fetch/verify, inspect hosted files/status/workflow availability, and report exact final/live identities. A chat response does not replace repository coordination.

## Scope Exclusions

Do not accept parent `0.6.10` in this repair; classify representative-loop evidence; assign or implement `0.7.0`; implement survey turn-in/rewards; implement geographic Knowledge, recognition, known-location, map, or travel-access effects; change generic activities, rest, inventory, transaction, replay, correction execution, lineage, or event infrastructure; add other Stakes modes, checkpoint/cloud/death/succession work; change versions, dependencies, content, assets, generated output, or unrelated UI/runtime; or merge, cherry-pick, rebase, force-update, close, delete, or otherwise mutate branches or PRs.
