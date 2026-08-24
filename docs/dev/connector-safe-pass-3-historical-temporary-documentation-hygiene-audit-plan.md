# Connector-Safe Pass 3 - Historical And Temporary Documentation Hygiene Audit Plan

Date: 2026-08-24

Status: COMPLETE

Execution surface: GitHub Connector, documentation-only

Protected active implementation route: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

## Purpose

Audit repository documentation artifacts that are temporary-looking, queued, historical, superseded, research-only, consumed, or potentially stale. Classify retention posture and identify safe future cleanup candidates without deleting evidence, rewriting history, changing active routing, or touching runtime/source/content/schema/test files.

The pass should reduce future orientation cost by making it clear which documents remain current inputs, which are historical evidence, which have been consumed into permanent authority, and which might eventually be deleted only after explicit retention closure.

## Goals

1. Inventory temporary-looking documentation, especially `tmp-*`, queued prompt/research artifacts, old connector/Codex research inputs, and explicitly retired documents referenced by current authorities.
2. Classify each reviewed artifact as one of:
   - `CURRENT_REFERENCE`;
   - `HISTORICAL_EVIDENCE`;
   - `CONSUMED_RETAIN`;
   - `SUPERSEDED_RETAIN`;
   - `DORMANT_FUTURE_INPUT`;
   - `DELETE_CANDIDATE_REQUIRES_CLOSURE`.
3. Record the concrete reason and named consumer/authority for retention or potential cleanup.
4. Distinguish filename hygiene (`tmp-*`, `queued-*`, old dates) from actual authority status; do not infer deletability from names.
5. Identify stale current-state wording that is safely historical versus wording that still risks routing confusion.
6. Prefer a durable classification index over destructive cleanup.
7. Preserve `0.6.11` current prompt/handoff/output and branch/PR posture unchanged.

## Baseline Benchmarks

At pass start record:

- hosted head after Pass 2;
- current prompt blob SHA;
- number of documentation paths whose basename or path contains `tmp`, `temporary`, `queued`, `research`, `handoff`, `prompt`, or explicit retirement language where practical;
- number of candidates inspected deeply enough for disposition;
- number of deletion candidates, if any;
- number of actual deletions performed (expected: 0).

## Completion Benchmarks

Pass 3 succeeds only if:

- a durable hygiene audit lists each reviewed candidate and its disposition;
- no artifact is marked deletable merely because it is old, temporary-named, or superseded;
- deletion candidates name a future closure condition and are not deleted in this pass unless retention closure is exceptionally explicit and complete;
- historical chronology/accepted audit evidence remains intact;
- current prompt SHA remains unchanged;
- no source/content/schema/test/save/runtime/generated/asset file changes;
- no branch/PR lifecycle actions;
- hosted comparison from Pass 3 start contains documentation-only additions/edits.

## Evidence Set

Minimum inspection:

- `AGENTS.md`;
- `docs/dev/repository-first-agent-work-protocol.md`;
- `docs/dev/current-codex-prompt.md`;
- `docs/dev/current-codex-output.md`;
- `docs/dev/current-gpt-handoff.md`;
- `docs/dev/historical-version-and-deferred-route-register.md`;
- `docs/dev/branch-disposition-register.md`;
- `docs/future_content_backlog.md`;
- directory inventories under `docs/dev` and `docs/design`;
- direct references to candidate files found through repository search;
- focused permanent authority that states a temporary/research artifact is retired, consumed, superseded, or still required.

## Method

1. Snapshot hosted head and current prompt SHA.
2. Inventory candidate filenames through directory listing and repository search.
3. For each candidate, inspect its header/status/purpose and search direct references/consumers.
4. Assign the least-destructive disposition supported by evidence.
5. Create a durable hygiene audit with named reopening/deletion triggers.
6. Do not update active prompt/handoff/output unless an actual current routing defect is discovered; historical wording alone is not a defect.
7. Verify prompt SHA and final documentation-only diff.

## Scope Exclusions

Do not:

- delete source, tests, content, schemas, generated output, assets, saves, migrations, or dependencies;
- delete documentation solely by filename pattern;
- rewrite accepted historical decisions to current tense;
- mass-rename old documents;
- alter current Codex route or `0.7.0` readiness;
- close/merge/delete/rebase branches or PRs;
- convert research evidence into canon by inference;
- perform broad broken-link remediation beyond documenting a concrete live-routing risk.

## Stop Conditions

Retain and classify rather than delete when:

- a file is referenced by current or historical authority;
- it preserves provenance, accepted reasoning, branch/PR evidence, or a consumed research input;
- a later audit may need the exact historical artifact;
- the Connector cannot prove that all named consumers are complete;
- deletion would require repository-local link/test validation.

## Expected Outputs

Primary:

- `docs/dev/historical-temporary-documentation-hygiene-audit.md`.

Coordination:

- completion appendix in this plan.

Optional:

- a tiny future-backlog note only if a concrete deletion batch becomes decision-ready later.

Expected deletion count for this pass: **0**.

## Completion Appendix

Outcome: `CLASSIFIED_RETAIN_NO_DELETION`.

Pass 3 start head: `a588654fb5f8b74434007a33a9d5e7ba2ca82be9`.

Primary audit: `docs/dev/historical-temporary-documentation-hygiene-audit.md`.

Measured classification set:

- `tmp-*` artifacts: **13**;
- `queued-*` prompts: **4**;
- `held-*` prompts: **1**;
- dated connector prestage/triage/post-run artifacts reviewed: **5**;
- parallel connector candidate/result artifacts: **5**;
- prior temporary/historical cleanup indexes: **2**;
- primary candidate artifacts deeply classified: **30**;
- `tmp-*` artifacts in `docs/design`: **0**;
- deletion candidates approved: **0**;
- actual deletions: **0**.

The audit found no live-routing defect. Old version/prompt language in dated artifacts is historical by design. Raw `tmp-*` research is generally consumed provenance behind permanent decisions, while queued/held/prestage artifacts are historical workflow evidence. The two older cleanup indexes are superseded supporting references but remain referenced and should not yet be deleted.

No source/content/schema/test/save/runtime/generated/asset, branch, or PR mutation was performed. `0.6.11` remains parked and unchanged.
