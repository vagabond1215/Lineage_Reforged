# Codex Failure Patterns And Verification Guardrails

Date: 2026-07-31

Status: active durable workflow authority; documentation only

## Purpose

This register preserves reusable project-specific lessons from defects, omissions, incomplete audits, unsafe retries, connector mistakes, and branch-lifecycle failures. It is not a blame log and does not replace focused decisions, acceptance audits, tests, or the active Codex prompt.

Use it to prevent recurrence by converting a proven failure pattern into an explicit inspection or validation requirement.

## Applicability

Read the relevant entries before:

- implementation or repair runs;
- parent acceptance audits;
- save, migration, publication, replay, or correction work;
- UI workflows whose caller state affects authority;
- branch integration, retirement, or supersession work;
- large connector documentation rewrites;
- prompt-packaging or workflow-authority maintenance.

Trivial isolated edits do not need to cite unrelated entries.

Every applicable Codex completion report must list the pattern IDs applied and the evidence used to satisfy them. If no entry applies, state that explicitly.

## Entry Rules

A new entry is warranted only when the lesson is reusable beyond one exact defect. Each entry must include:

- a stable pattern ID;
- the generalized failure pattern;
- why it escaped prior review;
- the required guardrail;
- exact verification expectations;
- affected surfaces;
- primary evidence;
- active, superseded, or retired status.

Do not copy full defect narratives into this register. Link the focused audit or repair source instead. Merge duplicate lessons. Retire an entry only when accepted architecture makes recurrence impossible.

## Active Guardrails

### FP-001 — Test The Real Caller Path

- **Pattern:** A lower-level helper test passes while the actual application caller regenerates state, changes ordering, discards returned authority, or handles errors differently.
- **Why it escaped:** Validation stopped at the corrected helper instead of exercising the UI or orchestration workflow that originally exposed the defect.
- **Guardrail:** Reproduce and test defects through the highest real production caller that owns the user or system workflow. Helper-level tests remain necessary but are not sufficient.
- **Verification:** Exercise the actual caller, state transition, error path, retry, and returned-state application. State which caller was tested.
- **Applies to:** UI flows, launchers, commands, save/load, account operations, adapters, orchestration.
- **Evidence:** `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`.
- **Status:** active.

### FP-002 — Green Tests Do Not Alone Accept A Parent

- **Pattern:** Existing and newly added focused tests pass, but adversarial inspection finds an untested authority or recovery sequence.
- **Why it escaped:** Acceptance relied on prescribed test counts without independently enumerating failure boundaries and state-loss scenarios.
- **Guardrail:** Parent acceptance requires both automated validation and a sequence review covering failure before acceptance, failure after durable acceptance, restart, retry, stale state, conflicting state, and projection repair.
- **Verification:** Include a failure-boundary matrix and identify which tests or inspections cover each row.
- **Applies to:** acceptance audits, persistence, migrations, transactions, receipts, multi-owner packages.
- **Evidence:** `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`; `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`.
- **Status:** active.

### FP-003 — Every Blocking Posture Needs A Reachable Completion Owner

- **Pattern:** A state correctly blocks ordinary work but no production-reachable owner can validate inputs and complete or repair it.
- **Why it escaped:** Tests proved blocking and helper behavior but not production invocation or exit from the blocked state.
- **Guardrail:** Any blocking posture must define entry, permitted operations, diagnostic surface, repair owner, production invocation, input validation, exit, persistence, restart, and duplicate behavior.
- **Verification:** Demonstrate the production caller and one restart-safe successful completion; prove invalid repair input fails closed.
- **Applies to:** recovery, migration quarantine, pending projection, blocked commands, repair queues, account reconciliation.
- **Evidence:** `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`.
- **Status:** active.

### FP-004 — Recovery Scope Must Cover The Contended Resource

- **Pattern:** Recovery lookup is keyed by a newly generated or narrower identity while collision occurs at a broader resource such as account plus slot.
- **Why it escaped:** The implementation searched only the candidate campaign rather than all pending authority capable of rewriting the destination.
- **Guardrail:** Before creating, retrying, or projecting authority, inspect every pending record that can affect the destination resource. Define compatibility, ordering, quarantine, and stale-replacement rules at that resource scope.
- **Verification:** Inject one compatible recovery, one incompatible recovery, and multiple recoveries targeting the same destination.
- **Applies to:** save slots, publication recovery, migrations, account consumers, branch destinations, generated artifacts.
- **Evidence:** `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`.
- **Status:** active.

### FP-005 — Retry Tests Must Include Lost And Regenerated Caller State

- **Pattern:** Retry succeeds only while the original in-memory snapshot, IDs, or prepared plan remains available.
- **Why it escaped:** Tests repeated a function call with the same prepared object and did not model rerender, restart, repeated user submission, or regenerated transient inputs.
- **Guardrail:** Recovery tests must include same-process retry, caller-state loss, UI rerender, restart, regenerated transient values, and repeated user action where those conditions are plausible.
- **Verification:** Prove stable authority is resumed or conflict is surfaced without minting unintended authority.
- **Applies to:** identity creation, save publication, payments/value consumption, uploads, commands, background repair.
- **Evidence:** `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`.
- **Status:** active.

### FP-006 — Projection Repair Must Not Replace Newer Truth

- **Pattern:** An older retained recovery or projection can overwrite a newer valid destination state.
- **Why it escaped:** Recovery verified its own retained artifact but did not compare destination authority or define ordering among multiple recoveries.
- **Guardrail:** Projection repair must inspect current destination authority, reject stale replacement, define deterministic ordering, and explicitly resolve or quarantine competing recoveries.
- **Verification:** Test older recovery versus newer destination, newer recovery versus older destination, and multiple pending recoveries in different enumeration orders.
- **Applies to:** save addresses, indexes, caches, account projections, generated manifests, branch promotion.
- **Evidence:** `docs/design/normal-campaign-new-game-retry-and-recovery-collision-audit.md`.
- **Status:** active.

### FP-007 — Never Rewrite Large Files From Partial Fetches

- **Pattern:** A connector replacement based on truncated content removes valid sections outside the fetched range.
- **Why it escaped:** A complete-file replacement was attempted from an incomplete connector response.
- **Guardrail:** Large-file replacement requires a confirmed complete fetch or a bounded patch mechanism. If neither is available, update a smaller controlling document and record the larger file as stale.
- **Verification:** Confirm returned line count or full blob content before replacement; inspect the post-write file for retained terminal sections and headings.
- **Applies to:** connector documentation maintenance, roadmaps, handoffs, generated registries.
- **Evidence:** `docs/dev/project-vision-and-continuity-brief.md`; repository history around the continuity-brief restoration.
- **Status:** active.

### FP-008 — Textual Mergeability Is Not Semantic Compatibility

- **Pattern:** A branch or pull request merges mechanically but conflicts with accepted authority, current intent, asset rules, or later implementation.
- **Why it escaped:** Review relied on Git conflict status rather than current semantic ownership and validation.
- **Guardrail:** Inspect merge base, unique commits, changed paths, current authority, supersession, and appropriate tests before integration. Preserve useful evidence by re-authoring when direct merge is unsafe.
- **Verification:** Record disposition, semantic comparison, validation, reachability/equivalence proof, and post-integration retirement action.
- **Applies to:** branches, pull requests, assets, schemas, docs, migrations, implementation packages.
- **Evidence:** `docs/dev/branch-lifecycle-and-integration-policy.md`; `docs/design/launcher-sidebar-asset-pr-disposition-audit.md`.
- **Status:** active.

### FP-009 — Distinguish Inspected Base From Final And Live Head

- **Pattern:** Coordination documents call the starting SHA “current master” after the run itself advances `master`.
- **Why it escaped:** Snapshot terminology was not separated from final publication state.
- **Guardrail:** Report inspected base head, implementation starting head, final committed head, and live head resolved after fetch/prune as distinct facts.
- **Verification:** Completion report and branch register must label each SHA correctly and avoid treating snapshot ahead/behind counts as live action authority.
- **Applies to:** branch registers, audits, handoffs, release notes, integration reports.
- **Evidence:** `docs/dev/branch-disposition-register.md`.
- **Status:** active.

### FP-010 — Repair Prompts Must Reconcile Every Confirmed Finding

- **Pattern:** A repair prompt is installed with fewer findings than the controlling inspections have established.
- **Why it escaped:** Findings were copied from one audit without reconciling later independent inspection and current output.
- **Guardrail:** Before installing a repair prompt, create one numbered finding inventory and map every finding to a code surface, test, acceptance gate, and explicit disposition.
- **Verification:** Completion report must include a finding-to-test matrix and state whether any finding was deferred, superseded, or remains open.
- **Applies to:** repair prompts, acceptance audits, post-incident follow-ups, multi-commit support chains.
- **Evidence:** `docs/design/normal-stakes-campaign-persistence-foundation-acceptance-audit.md`; repository history for the four-to-six finding correction.
- **Status:** active.

### FP-011 — Authority Precedence And Provenance Validation Must Control Mutation Order

- **Pattern:** A higher-priority explicit authority claim is rejected because lower-priority fallback evidence is inspected first, or retained provenance is checked only after identity or state has already been rewritten.
- **Why it escaped:** Tests covered each authority source independently but did not combine a valid controlling source with corrupt lower-priority evidence or a provenance-sensitive repair with a pre-validation identity transition.
- **Guardrail:** Follow the accepted authority chain as a strict short-circuit. Validate the controlling source and retained source provenance before cloning, identity rewrite, continuity fork, relocation, time advancement, correction append, or projection mutation.
- **Verification:** Pair valid explicit authority with every corrupt lower-priority source; exercise provenance-sensitive repair from head and non-head control; prove rejected cases leave source snapshot and control byte-stable and accepted cases apply the required identity transition exactly once.
- **Applies to:** destination resolution, continuity admission, migration correction, recovery repair, command fallback chains, authority projection.
- **Evidence:** `docs/dev/version-0.6.9.7-pre-implementation-source-review-2026-07-31.md`.
- **Status:** active.

### FP-012 — Duplicate Results Require Unique Complete Durable Evidence

- **Pattern:** First, last, latest, or `.find(...)` array selection treats ambiguous or partial retained state as a completed duplicate result.
- **Why it escaped:** Idempotency tests exercised one clean retained result but did not reverse arrays, duplicate identities, remove associated ledger/projection evidence, or restart without in-memory retained results.
- **Guardrail:** Duplicate handling must target stable identity and prove exactly one complete internally consistent evidence set. Ambiguous, missing, duplicated, orphaned, or conflicting evidence fails closed before effects.
- **Verification:** Reverse receipt and ledger order; inject duplicate same-source receipts, missing/duplicate original entries, orphan corrections and projections, multiple historical results, caller-state loss, and explicit save/reload. An exact duplicate returns current state without rollback or repeated effects.
- **Applies to:** defeat receipts, recovery completion, publication consumers, migrations, command retries, correction ledgers, durable replay.
- **Evidence:** `docs/dev/version-0.6.9.7-pre-implementation-source-review-2026-07-31.md`; `docs/dev/current-codex-output.md`.
- **Status:** active.

### FP-013 — Parent Authority Rewrites Must Preserve Nested Owner State

- **Pattern:** A mutation or migration rebuilds a parent authority object from selected legacy fields and silently drops a newer optional nested owner container.
- **Why it escaped:** The new container round-tripped through ordinary serialization, but separate fork, migration, defeat, or recovery paths reconstructed `{ version, entries }` instead of preserving the full parent object.
- **Guardrail:** Inventory every assignment that replaces a parent authority object. Preserve all existing nested owner state before changing the owned fields, and initialize new emptiness only at an authorized creation/migration boundary.
- **Verification:** Exercise the new owner container through first non-head mutation, same-command downstream mutation, later downstream mutation, recovery/repair, migration, save/load, and publication; prove exact nested authority survives each rewrite and that existing absent-container targets remain valid without load-time rewrite.
- **Applies to:** additive ledgers, save migrations, campaign/session forks, defeat/recovery, publication metadata, correction/reconciliation containers.
- **Evidence:** `docs/dev/current-codex-output.md`; `tests/unit/player-survey-activity-advancement-persistence.test.mjs`.
- **Status:** active.

## Completion Report Format

For applicable runs include:

```text
Applicable verification guardrails:
- FP-001: exercised the actual production caller and retry path
- FP-003: proved a production-reachable validated completion owner
- FP-006: injected stale and competing destination recovery
```

For non-applicable runs include:

```text
Applicable verification guardrails: none; the run is documentation-only and does not touch a registered risk surface.
```

## Maintenance

- Keep the active register compact, normally no more than 25 entries.
- Add only generalized lessons supported by durable evidence.
- Update evidence links when a focused audit is superseded, but preserve historical provenance.
- Do not let this register override the active prompt or a more specific accepted contract.
- Review the register during workflow-integrity maintenance and after any parent is reopened by independent inspection.
