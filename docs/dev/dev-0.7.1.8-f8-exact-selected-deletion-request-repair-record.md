# DEV-0.7.1.8 — F8 Exact Selected Deletion Request Repair

Date: 2026-10-07. Support suffix of planned `DEV-0.7.1`. Inspected clean fetched `master`/`origin/master` `00bd7ce727bae9d04287c1faa56fbe3de5f50af0`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted DEV `DEV-0.7.0`. Development impact `supports_current_band`; Game-version impact `none`.

## Scope and reproduced failure

F8 from the independent `DEV-0.7.1.7` audit is the only repaired finding. Before production edits, two synthetic actual `EpochApp` probes selected an account, had a second owner delete it at the observed revision/generation before the first selected submission, and clicked picker or Settings Delete Account. Both cleared the UI without an error, claiming the second owner's tombstone. The selected-App QA was extended first to reproduce this behavior. No production account was touched.

## Repair

New account deletes carry a caller-minted UUID request identity. The v7 `accountLifecycle` store retains it in a version-2 delete tombstone in the same destructive transaction. A completed delete retry requires exact account ID, kind, expected revision, expected generation **and request ID**. The adapter rejects an absent account unless that exact version-2 tombstone exists. Version-1 reset receipts and retained version-1 delete tombstones remain readable; an old delete tombstone has no request identity, so it cannot authorize a new exact retry. Malformed version-2 tombstones fail closed. The IndexedDB database version stays 7 because the existing store/key structure is unchanged.

The actual selected App retains the first submitted delete request ID with its account ID, observed revision/generation and password while an outcome is uncertain. An unchanged retry reuses the ID; changed input mints a new ID and cannot claim the old tombstone. The owner verifies the current credential before the first delete; after erasure, possession of the exact retained request ID is the retry proof. No credential verifier is retained in the tombstone. Reset and session-generation contracts remain unchanged.

## Validation and limits

- Actual selected-App pre-edit F8 reproduction: picker and Settings each cleared without an error. Post-edit picker and Settings each showed `Account changed before deletion.` with the account already absent and no manufactured success. Changed selected request rejected; exact picker and Settings lost-post-commit-acknowledgement retries succeeded. Fresh picker delete, wrong password, stale reset generation and stale ordinary revision passed.
- Native G9F owner **90/90** passed, including same-generation competing request, exact restart/two-owner retry, changed request, unverified credential, malformed/missing tombstone, old v7 tombstone compatibility, all eight reset/delete abort/quota writes and lost readback. The added negative controls compare the target and other account's 12-family rows before/after rejection.
- Adjacent native G9B **8/8**, G9C **6/6**, G9D **14/14**, G9E **13/13**, first campaign **5/5**, descendant **16/16**, witnessed descendant **11/11** passed. Focused campaign/Soundings/survey Node **172/172** passed. Node UI-config typecheck and app-local Vite build passed. Broad UI typecheck still reports **137** existing diagnostics, zero in changed owner/App paths. `git diff --check` passed.

The browser accounts and fault injection are synthetic. The focused repair suite proves F8 behavior but is not an independent G9A–F parent acceptance audit. `G9_PARENT_ACCEPTED` and G10 activation remain held. The next run must design fresh probes from accepted G9A–F authority on the repaired hosted head, not reuse these repair checks as its acceptance proof.

## Branch and verification guardrails

At inspected source, fresh fetch/prune found two local/six hosted refs including `master`; the repository-scoped GitHub connector found zero open PRs. Readiness and prompt-integrity references remain protected; administration, creator planning and creator implementation remain held for their named consumers. Their merge bases, unique paths and exact review triggers were rechecked. F8 consumes none; no integration, merge, rebase, deletion, PR or disposition change was due or performed. See the refreshed branch register for inspected counts. No IndexedDB database-version upgrade, production dependency, generated output, deployment, G10, planned-primary or Game-version change.

Applicable FP-001/002/003/004/005/006/008/009/011/012/014/015/017/018/019: actual selected caller, independent parent gate, exact durable completion/retry and contention, no newer-account mutation, live branch/source identities, provenance and malformed receipt rejection, synthetic reachability limit, generation-bound reentry and prewrite graph regression. Suggested implementation commit: `fix(persistence): bind account deletion retry to exact request`.
