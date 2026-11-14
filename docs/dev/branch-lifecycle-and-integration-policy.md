# Branch Lifecycle And Integration Policy

Date: 2026-07-29

Status: durable repository workflow instruction; applies to Codex, ChatGPT via GitHub Connector, and human repository maintenance unless a more specific accepted route protects a branch

## 1. Purpose

Branches are temporary work containers, evidence surfaces, or explicitly protected long-lived references. They must not accumulate indefinitely without a reviewed disposition.

Every non-default branch must eventually be:

- integrated through an appropriate reviewed path;
- retained temporarily with a named consumer or review trigger;
- superseded and closed after useful evidence is preserved; or
- explicitly protected as a long-lived read-only reference.

Branch handling is part of completing repository work. Creating a branch without later inspection, integration, supersession, or retirement leaves the task operationally incomplete.

## 2. Mandatory Branch Inventory

Codex must inspect relevant local and remote branches at these checkpoints:

1. before starting a primary implementation package;
2. before installing a successor implementation prompt;
3. after completing a package that may overlap parallel work;
4. when the active route, owner boundary, or prerequisite materially changes;
5. when the branch disposition register identifies a review trigger;
6. during an explicitly scheduled branch-integration or repository-hygiene pass.

The inventory must include:

- `git fetch --all --prune`;
- current branch, upstream, worktree, and divergence;
- open pull requests and their head/base identities;
- local and remote branches relevant to the active or near-term route;
- merge base and ahead/behind counts against current `master`;
- commits and exact changed paths unique to each candidate branch;
- overlap with current work, accepted decisions, and protected paths;
- whether the branch contains implementation, tests, generated output, assets, documentation, research, or coordination changes.

A branch name or old description is not sufficient evidence. Inspect the actual commit range and diff.

## 3. Disposition Classes

Classify each reviewed branch as exactly one of:

### `ACTIVE_WORK`

Work is still being produced or validated. Record the owner, source/base commit, current head, expected outputs, and next review trigger.

### `CANDIDATE_INTEGRATION`

The branch has useful unmerged work. Record the integration method, required validation, conflict posture, and the event after which it should be integrated.

### `HOLD_NAMED_CONSUMER`

The branch is intentionally retained because a named future audit, implementation, comparison, or acceptance pass still needs it. Record the consumer and retirement condition.

### `PROTECTED_REFERENCE`

The branch is an explicitly protected read-only reference. Do not merge, rebase, force-update, or delete it unless a later accepted prompt or explicit user instruction changes that status.

### `SUPERSEDED_PRESERVE_EVIDENCE`

The branch should not be merged as a unit, but contains findings or files that must first be promoted, re-authored, or recorded elsewhere. After preservation and verification, close any PR and delete the branch.

### `ABANDON_SAFE_TO_DELETE`

The branch has no required unique value, or its value is already present on `master`. Verify ancestry or equivalent integration, then delete local and remote refs.

### `MERGED_RETIRE`

The branch has been accepted and integrated. Verify the merged commit or equivalent patch is on `master`, close the PR if necessary, then delete local and remote refs.

## 4. Integration Method By Content

Choose the method based on the branch contents rather than branch age or convenience.

### Documentation-only, unique-path branches

A clean cherry-pick or small reviewed merge is normally preferred when:

- the branch adds independent documents;
- no controlling coordination file is stale or conflicting;
- no accepted decision has superseded its conclusions;
- the documents still provide durable value.

Review every document against current authority before integration. Do not merge stale execution pointers merely because the path is unique.

### Source, schema, content, save, migration, dependency, asset, or generated-output branches

Rebase or recreate from current `master` as appropriate, inspect conflicts semantically, run all required focused validation, and review the complete diff. Do not use a blind merge to avoid understanding drift.

### Mixed or stale branches

Separate reusable work from obsolete work. Re-author or cherry-pick only the accepted subset when the branch as a whole no longer matches current contracts.

### Research and audit branches

Promote durable findings into accepted documents or retain the branch for a named consumer. Research does not become implementation authority merely by being merged.

### Pull-request branches

Inspect the live PR metadata, review threads, changed files, current mergeability, and divergence. A stale or conflicting PR may be closed without merge after useful evidence is preserved and the disposition is recorded.

## 5. Validation Before Merge

Before integrating a branch, Codex must record:

- exact base, head, and merge base;
- unique commits and changed paths;
- controlling authority and route compatibility;
- conflict resolution decisions;
- tests, lint, build, schema, content, generated-output, or documentation checks actually run;
- known workspace failures that are unrelated and non-gating;
- whether the integrated result matches the branch or is a deliberately re-authored subset;
- final diff and repository hygiene review.

Never claim that a branch is safe because Git reports no textual conflict. Semantic conflict review is mandatory.

## 6. Branch Deletion Rules

Delete a local or remote branch only after one of these proofs exists:

1. its accepted commits are reachable from `master`;
2. an equivalent reviewed patch is on `master` and the original branch is explicitly superseded;
3. all required evidence has been promoted and the branch is classified `ABANDON_SAFE_TO_DELETE`;
4. the user explicitly directs abandonment after the unique diff is inspected.

Before deletion:

- confirm the exact ref and head SHA;
- confirm there is no open work or named consumer;
- close or update any linked PR;
- preserve required commit IDs, findings, or artifact references in the disposition register;
- avoid wildcard or broad branch deletion commands.

After deletion, prune and verify that no stale local tracking ref remains.

## 7. Protected Branches

A protected branch must be read-only unless the active prompt explicitly owns it.

Protected status prohibits:

- merge;
- cherry-pick into the branch;
- rebase;
- force-update;
- deletion;
- using the branch as an unreviewed source of current authority.

Reading, comparing, and refreshing a read-only audit against current `master` is allowed only when the controlling route requires it.

## 8. Disposition Register

`docs/dev/branch-disposition-register.md` is the current coordination surface for known non-default branches and PRs.

Update the register when:

- a branch is created for durable work;
- its head or purpose materially changes;
- a review changes its disposition;
- it is merged, superseded, protected, or deleted;
- its named consumer completes;
- a PR opens, closes, merges, or becomes obsolete.

The register is coordination authority, not proof by itself. Reinspect the live ref before acting.

## 9. Codex Completion Requirement

Every Codex completion report must include a branch-lifecycle section stating:

- branches and PRs inspected;
- branches changed or intentionally untouched;
- disposition changes;
- merges, cherry-picks, rebases, closures, or deletions performed;
- validation performed for each integration;
- branches still retained and their exact next review triggers.

If no branch action was due, say so and identify the evidence used. Do not silently ignore the branch register.

## 10. Scope Discipline

Branch cleanup must not become an excuse to broaden an active implementation package.

When integration is useful but not safe inside the active run:

- record the disposition;
- schedule the smallest dedicated integration pass;
- continue the active route without merging unrelated work.

Conversely, do not defer a clean, dependency-relevant branch indefinitely when its review trigger has arrived and integration can be validated within the current package.

## 11. Worktree and branch-count control (owner direction, 2026-11-14)

This section supplements, not weakens, sections 2–10. It applies to Codex,
Connector, human operators and agents. The objective is to stop permanent
checkout accumulation without weakening unique-work preservation.

### Checkout budget

- Keep one primary local checkout (`C:\Codex\EoL`).
- Use **at most two concurrent persistent task worktrees by default**, beyond
  the primary checkout. A third requires a documented active consumer,
  owner, reason and closeout trigger in the run handoff. The limit is a
  default planning budget, **never an instruction to delete existing work
  before it is verified safe**.
- For read-only audits, single-SHA CI reproduction, geometry previews and
  acceptance checks, prefer an already clean checkout or a **temporary
  detached worktree** outside the primary tree. Record its path and SHA,
  protect outputs externally, then remove it after the last dependent test.
- Do not open a new worktree automatically for every prompt, stage letter,
  revision, test rerun or connector checkpoint. Prefer continuing an
  existing purpose-matched clean checkout and reusing the same topic branch
  for an ongoing coherent integration series.
- Each new worktree/branch must have a **named consumer, base SHA, target
  output, lifetime/closeout event, and disposition**. If that information is
  unavailable, do not create it by default.

### Exit is part of completion

Every run that creates or uses a nonprimary checkout must finish with a
worktree closeout receipt: exact path, branch/HEAD, dirty/untracked/ignored
inspection, output-retention location, action (removed or retained), reason
for retention and next review trigger.

When safe, remove completed disposable worktrees via `git worktree remove`
**without `--force`**, then run `git worktree list --porcelain` to verify.
Generated `dist` directories can be reclaimed only after proving they are
ignored, reproducible, within an intended checkout, and not needed by a
running preview. Never equate worktree removal with branch deletion.

No generic `git clean -fdx`, `git reset --hard`, forced worktree removal,
mass branch deletion or immediate object pruning is allowed as a cleanup
shortcut. Inspect ignored and untracked content separately, along with
locks, junctions, active processes and output consumers.

### Prevent branch/PR snowballing

- Prefer **one maintained topic branch and one active review PR per coherent
  integration lane**, rather than a new branch and draft PR for every small
  proof stage. Reviewed milestone SHAs remain immutable witnesses without
  requiring a permanent checkout.
- Existing stacked drafts (including C1 geography) remain protected under
  their existing holds until their own accepted integration review. This
  rule is prospective; do not collapse historical stacks blindly.
- Do not create a branch merely to prepare a chat prompt, inspect an audit
  or render a disposable preview. Record the source SHA and report instead.
- Reinspect active topic branches and draft PRs on every major handoff and
  at least once per 14 calendar days while work continues. Record their
  named consumers and retire conditions; elapsed time alone never
  authorizes deletion.
- When a reviewed integration is accepted, close/retire its branch promptly
  after proving the accepted result on `master`, preserving the evidence,
  resolving linked PRs and verifying exact ref identity (sections 5–8).
- Do not treat a newer branch as an automatic supersession of older
  protected branches; compare ancestry and unique diffs first.

### Storage telemetry and responsibility

Codex owns **local** inventory, cleanup and readback because the GitHub
Connector cannot inspect `C:\Codex` or certify Windows process, dependency,
junction and untracked-file state. Connector may inspect remote branches,
PRs and design reviews, but must not claim a local worktree was cleaned.

At every substantial cleanup and at the next planned maintenance review,
report physical checkout count, bytes in primary checkout, bytes in sibling
worktrees, largest ignored build/dependency outputs, Git-object usage and
disk space actually recovered. Use the procedures in
[Worktree closeout runbook](worktree-lifecycle-closeout-runbook-2026-11-14.md).

**Acceptance:** A worktree policy is operationally effective only when
subsequent local runs show closeout receipts and declining redundant
checkout/build-output counts. Documentation and remote acceptance alone
do not prove local disk recovery.
