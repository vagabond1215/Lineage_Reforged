# Codex And Connector Segmentation And Independent Review Policy

Date: 2026-08-27

Status: durable workflow authority; companion to `docs/dev/repository-first-agent-work-protocol.md`, `docs/dev/gpt-connector-assistance-policy.md`, `docs/dev/codex-resource-budget-and-execution-slicing-policy.md`, `docs/dev/codex-vs-gpt-connector-handling-procedure.md`, and `docs/dev/prompt-execution-platform-tool-selection-policy.md`

Applies to: every Lineage: Reforged run where ChatGPT, ChatGPT via GitHub Connector, Deep Research, GPT Work, Agent Mode, Codex, plugins, or another repository agent could divide the work

## 1. Purpose

Use outside reasoning and Connector work where it removes work that Codex does not need to repeat, while keeping implementation, executable validation, and independent acceptance coherent inside the authenticated local repository surface.

The objective is to:

- reserve Codex for local-worktree truth, implementation, executable validation, integration, and acceptance;
- let Connector fully own bounded repository inspection, documentation, source mapping, packaging, and product-question preparation;
- permit multiple bounded Connector preparation passes when constrained high-reasoning/local execution makes them economically useful;
- avoid routine mid-implementation ping-pong that duplicates context and increases stale-state risk;
- use post-run Connector review to catch overclaims, routing drift, and missed coordination after a concrete hosted commit exists.

This policy does not override a more specific active prompt, repository-first requirements, owner boundaries, branch policy, persistence policy, independent-audit requirements, or explicit user instruction.

## 2. Default Rhythm

The preferred rhythm is:

`Connector preparation -> one bounded Codex slice -> Connector review -> next decision`

This is a rhythm, not a fixed three-message or three-pass ceiling.

### Stage A — Connector preparation

Connector preparation may contain **one or several bounded passes**.

Use additional preparation passes only when each pass materially reduces one or more of:

- Codex repository discovery;
- package size;
- product ambiguity;
- branch/PR uncertainty;
- acceptance setup cost;
- risk of an expensive run ending before a durable checkpoint.

Useful outputs include:

- exact branch/PR/ref inventory;
- focused source/caller/owner/test map;
- cross-document authority reconciliation;
- changed-path or implementation-delta inventory;
- acceptance matrix;
- adversarial-probe plan;
- known validation baseline;
- evidence-branch applicability;
- prompt hardening;
- exact-head orientation packet;
- small complete-file documentation correction independent of executable results.

Stop preparation when the next task materially requires local execution, independent acceptance, product direction, or when further inspection would substantially duplicate existing evidence.

### Stage B — One coherent Codex slice

Codex or another authenticated repository-capable surface should execute one coherent implementation, repair, migration, integration, or acceptance slice.

Keep inside Codex when required by the active package:

- local fetch/synchronization/worktree verification;
- source/test/schema/content/migration/generated-output changes;
- executable repair;
- tests, lint, builds, typechecks, generators, simulations, browser/runtime probes;
- local branch integration/rebase/conflict resolution;
- deciding whether failures are new, baseline, or environmental;
- run-specific executable evidence;
- final local diff/status review;
- substantive commit/push and post-push verification;
- independent acceptance decisions reserved to the run.

Codex should consume current Connector preparation through exact-head delta verification rather than recreating it by default.

### Stage C — Connector post-run review

After Codex has committed and pushed, Connector may perform one consolidated independent post-run review when useful.

Review:

1. active-prompt compliance;
2. forbidden-scope and changed-path compliance;
3. source/test/output-claim consistency;
4. whether implementation, acceptance, replay, persistence, migration, or maturity claims exceed evidence;
5. prompt/output/handoff/historical/planning/branch-register routing consistency;
6. evidence-index consumption;
7. temporary-artifact and branch disposition;
8. successor scope;
9. whether one actual Codex follow-up is required.

Connector may directly correct only small, complete, unambiguous documentation or metadata defects within its authority.

## 3. Resource-Aware Preparation

When a short-window quota, rate limit, expensive high-reasoning tier, or user-declared resource constraint is active:

- more Connector preparation passes are allowed;
- `M` Codex work should normally be split;
- `L` and `XL` Codex work should be decomposed before execution unless atomicity or explicit user approval requires otherwise;
- if the strongest/highest-cost reasoning tier is required, reduce scope further;
- require an early durable checkpoint;
- preserve an interrupted Codex thread/worktree when possible;
- if a clean interrupted run loses orientation context, return to Connector preparation rather than automatically paying to repeat broad discovery.

Do not treat a currently observed quota number as permanent repository truth. Recheck product capability when making future execution recommendations.

## 4. Anti-Ping-Pong Rules

Multiple Connector passes **before** Codex are not considered ping-pong when they are bounded and materially reduce the next Codex slice.

Routine alternation **during** one Codex slice is discouraged.

Unless a more specific prompt requires otherwise:

- do not interrupt Codex for minor documentation observations;
- do not return each review finding separately;
- batch post-run findings into one decision-complete package;
- do not ask Codex to reread every Connector audit;
- do not move executable validation reporting out of Codex;
- do not repeat repository inspection across surfaces without freshness or independent-verification value;
- do not use segmentation when handoff/context duplication costs more than it saves.

Immediate return from Codex to Connector/user is justified for:

- acceptance-critical new evidence;
- scope-invalidating evidence;
- a required product/canon/UX/balance decision;
- lack of required access or completion authority;
- a resource interruption where broad rediscovery would otherwise repeat;
- a newly discovered dependency large enough that the package should be re-sliced.

## 5. Connector-Owned Tasks Codex Normally Need Not Recreate

When current and exact-head, Connector can fully own:

- hosted branch and PR metadata inventory;
- exact changed-path/divergence summaries;
- issue/PR triage;
- focused source/caller/owner inventories;
- prompt hardening;
- cross-document consistency and stale-pointer audits;
- evidence indexing and named-consumer registration;
- acceptance checklists and characterization matrices;
- documentation-only authority audits;
- small complete-file documentation repairs;
- exact-head orientation packets;
- independent post-run claim-to-evidence review.

Codex should perform the minimum freshness check needed before relying on dynamic facts and must independently verify every material claim whose correctness is part of its executable implementation or acceptance decision.

## 6. Tasks That Remain With Codex

Do not segment these out merely because part of the work is textual:

- local repository synchronization/worktree truth;
- implementation/source repair;
- tests, builds, lint, typecheck, generators, simulations, browser/runtime probes;
- source/test/mirror/generated-output coordination;
- migrations/dependencies;
- local branch rebase/merge/conflict resolution;
- final diff/status and substantive commit/push;
- run-specific output claims based on executed commands;
- parent acceptance, representative acceptance, or milestone promotion requiring executable proof.

## 7. Handoff Contract

Every stage handoff must identify:

- exact source head;
- platform and available capability class;
- scope completed;
- stable versus dynamic facts;
- files/metadata changed;
- validation performed and not performed;
- conclusions that remain provisional;
- exact artifact the next stage should read;
- what the next stage may reuse without broad repetition;
- what it must independently verify;
- stop conditions and next owner.

The handoff should be smaller than the discovery it replaces.

## 8. Post-Run Review Disposition

A Connector post-run review should return one consolidated disposition:

- `REVIEW_CONFIRMS_PACKAGE_NO_CODEX_FOLLOW_UP`;
- `REVIEW_CONFIRMS_PACKAGE_METADATA_ONLY_CORRECTION_APPLIED`;
- `REVIEW_REQUIRES_ONE_CONSOLIDATED_CODEX_FOLLOW_UP`;
- `REVIEW_BLOCKED_MISSING_REPOSITORY_OR_EXECUTABLE_EVIDENCE`.

When follow-up is required, group findings and produce the smallest coherent follow-up rather than a chain of single-finding prompts.

## 9. Precedence And Evolution

Use `docs/dev/codex-vs-gpt-connector-handling-procedure.md` for the current operational sequence and `docs/dev/codex-resource-budget-and-execution-slicing-policy.md` for package-size/resource rules.

Platform capabilities, token pools, plugins, and models may change. Apply the prompt-execution platform/tool-selection policy before each run.

Retain this durable principle:

**Use Connector preparation where it eliminates avoidable Codex work; use Codex for coherent local/executable slices; review at natural evidence boundaries rather than every tool boundary.**
