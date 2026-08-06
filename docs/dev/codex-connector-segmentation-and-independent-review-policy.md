# Codex And Connector Segmentation And Independent Review Policy

Date: 2026-08-06

Status: durable workflow authority; companion to `docs/dev/repository-first-agent-work-protocol.md`, `docs/dev/gpt-connector-assistance-policy.md`, and `docs/dev/prompt-execution-platform-tool-selection-policy.md`

Applies to: every Lineage: Reforged run where ChatGPT, ChatGPT via GitHub Connector, Deep Research, GPT Work, Agent Mode, Codex, plugins, or other repository agents could divide the work

## 1. Purpose

Use ChatGPT and connector-capable surfaces where their outside perspective, remote-repository access, research depth, or coordination tools reduce Codex token use without fragmenting one coherent repository run into repeated handoffs.

The objective is not to maximize delegation. The objective is to:

- reserve Codex work for tasks that require the authenticated checkout, implementation, executable validation, integration, or final repository truth;
- let Connector or research surfaces fully own bounded work Codex does not need to repeat materially;
- use independent post-run review to catch omissions, overclaims, and coordination drift after a concrete commit exists;
- avoid turning one complete Codex run into several smaller GPT/Codex exchanges with duplicated context and setup cost.

This policy narrows how the least-powerful-safe-tool rule should be applied. It does not override the current prompt, repository-first requirements, owner boundaries, branch policy, or validation authority.

## 2. Default Three-Stage Ceiling

A normal substantial run should use no more than these three stages.

### Stage A — Optional Connector Or Research Prepass

Use at most one prepass when it can produce a stable artifact that materially reduces later Codex inspection or research.

Useful prepass outputs include:

- exact branch, pull-request, commit, or issue inventory;
- focused source, caller, owner, contract, or test map;
- cross-document authority reconciliation;
- external research brief with citations;
- acceptance matrix, changed-path lock, probe plan, or evidence worksheet;
- prompt hardening and exact validation requirements;
- evidence-branch applicability and named-consumer summary;
- small complete-file documentation or metadata correction that is independent of implementation results.

Skip the prepass when Codex must perform substantially the same inspection to implement safely, when the evidence will become stale before use, or when the handoff would be larger than the expected token savings.

A prepass is evidence and preparation unless its task is a complete Connector-safe documentation or metadata change. Codex should verify dynamic facts but should not repeat stable analysis without a stated independent-verification reason.

### Stage B — One Complete Codex Run

Codex or another authenticated repository-capable implementation surface should normally execute the active prompt end to end without routine mid-run Connector handoffs.

Keep these tasks together inside the Codex run when they are part of the active package:

- fetch, prune, synchronization, worktree, branch, and history preflight;
- implementation, repair, executable decision work, or local cleanup;
- source, test, schema, migration, content, asset, dependency, or generated-output changes;
- focused and broad validation;
- failure reproduction and temporary executable probes;
- local branch integration, rebase, conflict resolution, and semantic merge review;
- run-specific `current-codex-output.md` evidence based on actual local execution;
- handoff, prompt, focused-decision, historical-register, planning, and branch-register updates required by the run outcome;
- final diff and worktree review;
- commit, push, and live-head verification.

Do not interrupt this stage merely because one documentation or metadata edit would also be Connector-safe. When Codex already owns the surrounding package and has the necessary evidence in context, completing the small adjacent task in the same run is normally cheaper and safer.

### Stage C — Optional Connector Independent Post-Run Review

Use at most one Connector post-run review after Codex has committed and pushed when outside scrutiny can materially improve confidence or reduce the need for Codex to audit its own package.

The post-run reviewer should inspect the exact committed head and check:

1. prompt and numbered-requirement compliance;
2. forbidden-scope and changed-path compliance;
3. source, test, validation, and completion-claim consistency;
4. whether acceptance, implementation, maturity, replay-safety, determinism, migration, or presentation claims exceed evidence;
5. handoff, output, prompt, focused authority, historical routing, planning, branch register, and PR metadata consistency;
6. applicable evidence-index consumption;
7. temporary-artifact retention or retirement decisions;
8. exact successor label, scope, and validation package;
9. branch and PR lifecycle posture;
10. whether one consolidated follow-up is actually required.

Connector may directly correct only small, complete, unambiguous documentation or metadata defects within its existing authority. Source, tests, executable evidence, large coordination reconciliation, or acceptance-critical deficiencies return to Codex.

## 3. Anti-Ping-Pong Rules

Unless a more specific accepted prompt requires otherwise:

- use no more than one prepass and one post-run review for one primary or support run;
- do not schedule routine Connector checkpoints in the middle of Codex implementation;
- do not return each minor review observation to Codex separately;
- accumulate post-run findings into one decision-complete review package;
- produce at most one consolidated follow-up prompt for the reviewed head;
- do not ask Codex to reread every Connector audit—only semantically applicable evidence;
- do not move run-specific local validation reporting out of Codex;
- do not create a Connector branch for a trivial adjacent edit Codex can safely complete while already editing the same package;
- do not use segmentation merely to preserve one platform's token pool when the resulting context duplication, stale evidence, or coordination overhead is larger than the savings;
- do not repeat research or repository inspection across stages without a clear freshness or independent-verification purpose.

Immediate return to Codex before the scheduled post-run boundary is justified only when the new finding is:

- acceptance-critical;
- scope-invalidating;
- evidence of a production or test defect that affects the active work;
- evidence that required executable validation cannot support the intended claim;
- evidence that the selected platform lacks necessary access or completion authority;
- a blocker requiring a user decision before implementation can continue safely.

Lower-severity findings should be batched.

## 4. Connector-Owned Tasks Codex Normally Need Not Repeat

When complete and current, Connector can fully own:

- remote branch and pull-request metadata inventory;
- exact changed-path and divergence summaries;
- issue and PR triage;
- focused source maps and owner/caller inventories;
- prompt hardening and packaging checks;
- cross-document consistency and stale-pointer audits;
- evidence indexing and named-consumer registration;
- external-research synthesis that does not require private-repository claims;
- acceptance checklists and characterization matrices;
- PR description, label, or disposition metadata corrections;
- tiny complete-file documentation corrections;
- independent post-run compliance and claim-to-evidence review.

Codex should normally perform only the minimum freshness check needed before acting on dynamic facts. It should not recreate the entire Connector artifact as a default orientation ritual.

## 5. Tasks That Remain With Codex

Do not segment these out merely because part of the work is text or documentation:

- local repository synchronization and worktree truth;
- Git history or ref actions requiring the checkout;
- coupled source and test inspection required for implementation judgment;
- implementation and executable repair;
- tests, builds, typechecks, lint, generators, simulations, browser checks, and temporary probes;
- deciding whether a local failure is new, baseline, or environment-specific;
- source/test/mirror/generated-output coordination;
- large complete branch-register or shared-planning reconciliation driven by the run outcome;
- run-specific output claims based on commands actually executed;
- final diff, status, commit, push, and post-push verification;
- acceptance or parent promotion requiring executable proof.

Connector evidence may reduce the inspection burden, but it cannot substitute for these authorities.

## 6. Handoff Contract

Every segmented stage must identify:

- exact repository source head;
- platform, mode, and available tools;
- scope completed;
- facts that are stable versus dynamic;
- files or metadata changed;
- validation performed and not performed;
- conclusions that remain provisional;
- exact artifact the next stage should read;
- what the next stage may reuse without repetition;
- what the next stage must independently verify;
- stop conditions and named owner for unresolved work.

The handoff should be smaller than the work it replaces. A large narrative dump that forces Codex to rediscover the actionable facts is not a successful prepass.

## 7. Post-Run Review Disposition

A Connector post-run review must return exactly one disposition:

- `REVIEW_CONFIRMS_PACKAGE_NO_CODEX_FOLLOW_UP`;
- `REVIEW_CONFIRMS_PACKAGE_METADATA_ONLY_CORRECTION_APPLIED`;
- `REVIEW_REQUIRES_ONE_CONSOLIDATED_CODEX_FOLLOW_UP`;
- `REVIEW_BLOCKED_MISSING_REPOSITORY_OR_EXECUTABLE_EVIDENCE`.

When follow-up is required, group findings by severity and provide one prompt that preserves accepted behavior and names exact validation. Do not create a chain of single-finding prompts unless independent repairs are genuinely unrelated and cannot safely share a worktree package.

## 8. Current Route Application

For the active `Historical Recovery Fork Evidence Verifiability And Parent Acceptance Reopening Decision`:

1. Stage A is complete through `docs/dev/connector-token-reset-waiting-period-prestage-2026-08-06.md`.
2. No additional prepass or routine mid-run Connector checkpoint is required before Codex resumes.
3. Codex should execute the current prompt end to end from a freshly synchronized authenticated checkout.
4. After the decision and exact successor are committed and pushed, one Connector independent review should inspect the committed package.
5. Any implementation, executable-evidence, acceptance, or large coordination deficiency should return as one consolidated Codex follow-up.
6. Small PR metadata or complete-file documentation corrections may be applied directly when unambiguous and outside protected scope.

## 9. Review And Evolution

Platform capabilities, token pools, plugins, and models can change. Apply `docs/dev/prompt-execution-platform-tool-selection-policy.md` before each prompt, but retain this segmentation principle unless a later accepted authority replaces it:

**Use outside research and Connector review where they eliminate duplicate Codex work; keep coherent implementation and executable validation inside one Codex run; segment at natural evidence boundaries, not at every tool boundary.**
