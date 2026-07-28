# Parallel Prompt Packaging And Execution Pointer Integrity Audit

## Hold Status

This is an isolated parallel documentation audit. It does not control current execution on `master`, does not replace `docs/dev/current-codex-prompt.md`, and must not advance, repair, or reinterpret the active Activity Resolution route.

Run it only on the dedicated branch:

`parallel/prompt-packaging-integrity-audit`

Do not merge this branch automatically. Its report may be reviewed after the active route reaches a safe coordination point.

## Run Identity

- Run name: `Prompt Packaging And Execution Pointer Integrity Audit`
- Label class: unversioned repository-coordination audit
- Milestone impact: `none`
- Scope: documentation audit only
- Parent version: not applicable

Suggested commit:

`docs(audit): verify prompt packaging integrity`

## Objective

Audit the repository's prompt packaging, active/queued execution-pointer boundaries, precedence rules, and successor-installation conventions. Produce one evidence-based report that identifies any stale, ambiguous, duplicated, or unsafe execution pointer without editing the active route or applying repairs.

This run must not implement or modify gameplay, content, schemas, validators, tests, helpers, runtime, UI, saves, dependencies, assets, generated output, or active coordination authority.

## Parallel Branch And Concurrency Gate

1. Read `AGENTS.md` and obey repository, version-label, prompt-packaging, and development-discipline rules.
2. Confirm the checked-out branch is exactly `parallel/prompt-packaging-integrity-audit` or a dedicated worktree branch created from it.
3. Confirm the worktree is clean before the audit.
4. Fetch the tracked remote without merging, rebasing, pulling, cherry-picking, or changing branch ancestry.
5. Record the branch `HEAD`, current `origin/master`, and their merge base.
6. Use `origin/master` as a read-only live-reference surface where current-route verification is required. Inspect files with read-only git commands; do not import current master changes into this branch during the audit.
7. Confirm `docs/dev/parallel-prompt-packaging-integrity-audit-prompt.md` is the prompt being executed and that it is not installed as `docs/dev/current-codex-prompt.md`.
8. Confirm the active `master` route is still separate. If another process has modified this branch, the report path already exists, or the worktree contains unrelated changes, stop without edits and report the exact conflict.

## Required Reading

Read at minimum:

- `AGENTS.md`;
- `README.md`;
- `docs/dev/current-codex-prompt.md` from both this branch and `origin/master`;
- `docs/dev/current-gpt-handoff.md` from both this branch and `origin/master`;
- `docs/dev/current-codex-output.md` from both this branch and `origin/master`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/design/current-planning-anchor-reconciliation.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- the live top override and lower `## 1. Current Anchor` block in `docs/dev/project-roadmap.md`;
- every tracked file whose path contains `prompt` and every tracked queued or held prompt file under `docs/dev`;
- recent prompt-installation commits needed to distinguish active, queued, held, historical, and superseded prompt bodies.

Do not infer active authority from a filename, title, commit subject, historical roadmap row, or queued file alone.

## Required Audit Matrix

### 1. Active Prompt Identity

Verify:

- exactly one authoritative active prompt path exists;
- its title and run identity agree;
- current handoff, current output, route register, sequenced-plan current anchor, and roadmap top override agree on the active or next route;
- any lower-precedence stale wording is explicitly reconciled and cannot control execution;
- the active prompt does not contain queued-only or held-only language.

### 2. Platform And Mode Separation

Verify:

- no active or queued prompt body embeds a platform/tool/mode line unless a focused repository rule explicitly requires it;
- `AGENTS.md` contains durable mode-selection policy rather than a stale run-specific mode pointer;
- no historical run-specific mode line can be mistaken for current execution authority.

### 3. Queued And Held Prompt Boundaries

For every queued or held prompt, classify:

- path;
- intended run identity;
- hold prerequisites;
- whether it explicitly states that it does not control current execution;
- whether activation instructions define how queued-only wrappers are removed;
- whether any prerequisite is stale, already satisfied, contradictory, or missing;
- whether the file remains historical, queued, held, conditional, or superseded.

A queued or held prompt must not become active merely because it is edited, referenced, or copied without its activation gate.

### 4. Successor Installation Integrity

Inspect current and recent active prompts for successor-installation rules. Verify:

- the successor title is active rather than queued;
- queued-only titles, Hold Status sections, and noncontrolling wrappers are omitted during installation;
- the substantive body is preserved unless a proven contradiction requires a separately recorded revision;
- the installed file is fetched or read back after writing;
- route coordination is advanced only after acceptance gates pass;
- no prompt can silently skip a required intermediate route.

### 5. Precedence And Stale Pointer Safety

Build a compact precedence matrix for:

- current prompt;
- current handoff;
- current output;
- historical/deferred register;
- focused design authority;
- planning-anchor reconciliation;
- roadmap;
- sequenced plan;
- queued/held prompt files.

Identify every stale pointer found. Classify each as:

- `controlling_defect`;
- `reconciled_noncontrolling`;
- `historical_only`;
- `queued_only`;
- `superseded`;
- `no_defect`.

Do not repair any pointer in this run.

### 6. Path And Reference Closure

Verify:

- every prompt-referenced required file exists on the relevant branch/ref;
- every queued successor path exists when named;
- no deleted temporary artifact remains a required input;
- no prompt requires an unavailable generated file, local-only capture, or nonexistent prior evidence without an explicit fail-closed instruction;
- branch names and isolated-branch prohibitions are consistent where they are part of prompt safety.

### 7. Parallel-Safety Review

Confirm this audit itself:

- changes only its single report file;
- does not change any active coordination file;
- does not change the isolated `prep/integrated-gameplay-0-7-readiness-audit` branch;
- does not merge, rebase, cherry-pick, or fast-forward from `master`;
- does not modify source, tests, content, schemas, validators, runtime, UI, saves, dependencies, assets, or generated output;
- can be discarded without affecting current execution.

## Required Output

Create exactly:

`docs/dev/prompt-packaging-and-execution-pointer-integrity-audit.md`

The report must include:

1. run identity, branch, starting commit, `origin/master`, and merge base;
2. overall result: `PASS`, `PASS_WITH_NONCONTROLLING_DRIFT`, or `BLOCKED`;
3. exact active prompt identity and blob SHA on `origin/master`;
4. the active-route agreement matrix;
5. the queued/held prompt inventory and classifications;
6. successor-installation findings;
7. stale-pointer findings and precedence classifications;
8. path/reference-closure findings;
9. exact recommended repairs, if any, as unapplied patch descriptions;
10. changed paths and confirmation that only the report was created;
11. checks run and limitations;
12. explicit confirmation that no route was advanced and no active prompt was changed.

If a controlling defect is found, return `BLOCKED` and describe the smallest safe repair. Do not apply it.

## Allowed Change

Only:

- create `docs/dev/prompt-packaging-and-execution-pointer-integrity-audit.md`.

Do not modify this prompt file during execution.

## Prohibited Scope

Do not change:

- `AGENTS.md`;
- `README.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/current-codex-output.md`;
- roadmap, sequenced plan, route register, backlog, continuity brief, or planning-anchor reconciliation;
- any queued or held prompt;
- any design authority other than the new audit report;
- content, schemas, validators, tests, helpers, source, runtime, commands/events, UI, saves, persistence, dependencies, assets, generated output, or gameplay;
- any branch other than the dedicated parallel branch.

Do not create a pull request, merge the branch, or update `master` in this run.

## Validation

1. Verify the complete changed-path set contains exactly `docs/dev/prompt-packaging-and-execution-pointer-integrity-audit.md`.
2. Search the report for conflict markers and trailing whitespace.
3. Run `git diff --check`.
4. Inspect the complete report diff.
5. Confirm the active prompt, handoff, output, roadmap, route register, queued prompts, and all implementation paths are unchanged on this branch.
6. Do not run builds, content lint, typechecks, tests, servers, generators, package installation, or gameplay commands.

## Completion Report

Report:

- branch and concurrency-gate result;
- overall audit classification;
- active prompt and route agreement;
- queued/held prompt findings;
- controlling defects or reconciled drift;
- recommended but unapplied repairs;
- report path;
- exact changed-path set;
- checks run;
- confirmation that `master`, the active prompt, and all implementation behavior remain untouched.
