# Connector-Safe Pass 1 - Open Design Questions Rebaseline Plan

Date: 2026-08-20

Status: ACTIVE

Execution surface: GitHub Connector, documentation-only

Protected active implementation route: `Version 0.6.11 - Ashen Reef Survey Ordinary Reachability And Representative Loop Evidence`

## Purpose

Rebaseline `docs/design/open-design-questions-index.md` from its stale June 18, 2026 pipeline context to the current repository state without changing runtime authority, implementation sequencing, source, content JSON, schemas, tracked tests, branches, pull requests, or the installed `0.6.11` Codex prompt.

The pass should make the question index useful again as a durable user/product-decision surface: questions that later repository authority already resolved must stop appearing open; genuinely unresolved questions must remain explicit; questions whose system lane is deferred must be categorized accordingly; and new unresolved product choices discovered by accepted work since June should be captured only when repository evidence proves that they remain open.

## Goals

1. Replace obsolete current-pipeline references with the live `0.6.11` posture while keeping the index non-authoritative for runtime execution.
2. Audit every listed question against later accepted design decisions, implementation/audit outputs, current planning, and durable product direction.
3. Classify each question as one of:
   - `OPEN_SOON`: likely to block a foreseeable implementation/design lane;
   - `OPEN_LATER`: valid but not near-term blocking;
   - `OPEN_STRATEGIC`: broad product direction needed before a major system/vertical-slice choice;
   - `RESOLVED`: answered by accepted user/product or repository authority;
   - `SUPERSEDED`: replaced by a newer model/question;
   - `DEFERRED_WITH_TRIGGER`: intentionally postponed until an explicit system/authority prerequisite exists.
4. Preserve traceability: resolved/superseded questions should retain a concise disposition and point to the controlling authority instead of disappearing without explanation.
5. Add only high-confidence post-June open questions that are materially useful for future planning. Do not manufacture speculative questions merely to make the index comprehensive.
6. Keep `docs/dev/current-codex-prompt.md` unchanged and preserve `0.6.11` as the resumable implementation route.

## Baseline Benchmarks

At pass start, record and report:

- hosted `master` head;
- index date and stale pipeline route currently stated;
- number of question rows by existing priority section where practical;
- number of clearly obsolete pipeline/current-state statements;
- number of later durable decision sources inspected;
- whether any question in the index is currently required before `0.6.11` (expected: none).

## Completion Benchmarks

The pass is successful only if all of the following hold:

- the index header/current-pipeline section reflects the current repository date and active `0.6.11` route;
- every pre-existing question has an explicit current disposition or remains in an open category;
- no question marked resolved contradicts a later accepted authority;
- no question remains `Soon` merely because of the obsolete June 2026 pipeline;
- all newly added questions cite or name the repository authority that exposed them;
- the current Codex prompt is byte-unchanged by this pass;
- no production/source/content/schema/test/runtime file is changed;
- no branch/PR lifecycle action occurs;
- `git`-equivalent hosted comparison from pass start to pass end contains documentation files only;
- the final handoff clearly states that this connector-safe pass does not alter `0.6.11` implementation scope or readiness.

## Evidence Set

Minimum documents to inspect before reclassifying questions:

- `AGENTS.md`;
- `docs/design/open-design-questions-index.md`;
- `docs/design/user-design-decisions-2026-06-17.md`;
- `docs/design/user-design-decisions-2026-06-18.md`;
- `docs/design/future-system-design-ledger.md`;
- `docs/future_content_backlog.md`;
- `docs/dev/project-roadmap.md`;
- `docs/dev/codex-sequenced-implementation-plan.md`;
- `docs/dev/current-gpt-handoff.md`;
- accepted design authorities relevant to questions under review, discovered through repository search.

## Method

1. Snapshot the live head and read the complete current question index.
2. Inventory every question row and normalize it into a working disposition table.
3. Search only `vagabond1215/Lineage_Reforged` for later authorities matching each question family.
4. Prefer explicit accepted user decisions and focused design/implementation authorities over old planning prose.
5. Reclassify conservatively: uncertainty remains open or deferred; do not infer product canon from implementation convenience.
6. Rewrite the index as a current decision surface with:
   - current context;
   - open questions grouped by current urgency;
   - deferred-with-trigger questions;
   - resolved/superseded disposition register;
   - source/precedence note.
7. Validate that the current Codex prompt and runtime route were not changed.
8. Record pass metrics and final hosted head.

## Scope Exclusions

Do not:

- modify `docs/dev/current-codex-prompt.md`;
- implement or alter `0.6.11`;
- change production source, content JSON, schemas, migrations, tracked tests, generated files, dependencies, assets, UI, saves, or gameplay behavior;
- create generic systems from open questions;
- resolve subjective product questions without explicit user authority;
- mutate, merge, close, delete, rebase, or integrate branches or pull requests;
- renumber versions or advance `0.7.0`;
- rewrite historical documents solely to make their dates current.

## Stop Conditions

Stop the pass and preserve the question as open if:

- two accepted authorities materially conflict;
- resolution requires user preference rather than repository evidence;
- classification would alter active implementation scope;
- a question depends on runtime validation unavailable to the Connector;
- a source change would be required to prove the answer.

## Expected Output

Primary output:

- refreshed `docs/design/open-design-questions-index.md`.

Optional documentation-only coordination output, only if needed:

- a short completion appendix in this plan recording metrics and final disposition counts.

No current prompt replacement is authorized.
