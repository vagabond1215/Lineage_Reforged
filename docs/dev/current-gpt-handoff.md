# Current GPT Handoff

Date: 2026-08-02

## Status

- Latest implemented primary: `Version 0.6.9 - Normal Stakes Campaign Persistence Foundation`.
- Latest completed repair implementation: `Version 0.6.9.5 - Pending-Defeat Completion Authority And Provenance Repair`.
- Latest completed acceptance audit: `Version 0.6.9.6 - Pending-Defeat Completion Authority And Provenance Acceptance Audit`.
- Latest attempted repair: `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`.
- `0.6.9.7` disposition: `IMPLEMENTATION_INCOMPLETE`; all nine findings reproduced, but two shared-contract questions triggered the prompt's stop gate before production edits.
- Parent `0.6.9` status: `REPAIR_BLOCKED_PENDING_FOCUSED_DECISION`.
- Active route: `Normal Defeat Recovery Continuity And Destination Provenance Contract Decision`.
- Active-route class: unversioned focused documentation decision.
- Required return route after an accepted decision: revised `Version 0.6.9.7 - Initial Defeat Authority, Durable Duplicate, And Effect-Provenance Repair`.
- Reserved independent successor: `Version 0.6.9.8 - Initial Defeat And Durable Recovery Completion Acceptance Audit`; do not install it before revised `0.6.9.7` succeeds.
- Draft PR #3 and `parallel/0.6.9.7-repair-bundle` remain evidence-only `HOLD_NAMED_CONSUMER` inputs.
- The Ashen Reef survey occurrence/result/consequence receipt decision remains blocked.
- `0.7.0` remains `NOT_READY`.

## Current Planning Precedence

Use current execution sources in this order:

1. `docs/dev/current-codex-prompt.md`;
2. this handoff;
3. `docs/dev/current-codex-output.md`;
4. `docs/dev/historical-version-and-deferred-route-register.md`;
5. the most specific focused decision or audit;
6. `docs/design/current-planning-anchor-reconciliation.md` for stale historical-header conflicts;
7. roadmap and sequenced plan for non-conflicting historical and long-term context.

Repository workflow authority also includes `AGENTS.md`, the repository-first protocol, failure-pattern register, branch policy/register, repository-wide review, and hardened `0.6.9.7` source review.

## Why `0.6.9.7` Stopped

The implementation prompt was updated and correct. A clean local `master` was fetched, pruned, and fast-forwarded from `2f05f59d8db6f030427ceec3fb4e21e2243b9da7` to synchronized starting head `6820ab8175f6b4d0b447b589045bc0a934663257`.

Fresh untouched-source execution reproduced all nine hardened findings:

1. unsafe automatic current/start authority can produce playable recovery;
2. completed restart replay cannot return a durable duplicate;
3. corrupted pending resource/tick/original-ledger facts are accepted;
4. valid explicit authority is vetoed by corrupt lower-priority evidence;
5. initial duplicate handling accepts partial first-match evidence;
6. invalid resource state enters defeat resolution;
7. conflicting campaign-session control identity is admitted;
8. non-head completion rewrites cloned continuity before receipt provenance validation;
9. automatic completion records `explicit_context`.

The first seven and much of the ninth finding are narrow code/test work. Findings 8 and 9 expose two unresolved persisted-contract choices that the active prompt explicitly prohibited Codex from guessing.

## Contract Blocker 1 — Non-Head Continuity

One persisted pending receipt names the loaded source continuity. The first accepted mutation from `non_head_unmutated` must create exactly one child continuity before applying the mutation. Pending provenance must also validate against the untouched source before any child is created.

Accepted authority does not decide whether the completed receipt:

- keeps the source continuity as original defeat truth;
- is rewritten to the child continuity;
- or links original defeat and completion through a new typed field, receipt, or correction authority.

The decision must preserve exact original provenance, one child, one completion, restart-safe duplicate replay, and byte-stable rejection with no child or repair effects.

## Contract Blocker 2 — Sole-Known Destination Source

Pending completion accepts an exactly-one-known-safe-settlement fallback after explicit, current, and campaign-start authority. The shared `destinationSource` union has no value for that automatic fallback. `App.tsx` calls completion without an explicit destination, so `explicit_context` is not truthful.

The decision must either add an exact typed provenance value with compatibility and migration rules or explicitly revise the accepted fallback contract without leaving a permanently blocked run.

## Evidence Bundle Posture

PR #3 identity remained exact:

- branch: `parallel/0.6.9.7-repair-bundle`;
- head: `10afdef7d85a3010b5afadd20c0cd014ceac5fcc`;
- merge/source base: `b6422118567a79a23be3377f035dd3a6905d4d8b`;
- reconstructed ZIP SHA-256: `c5d536b10580877191fc9dc730b5f4f5e5571dc18d15bc7b7200871bf912b3fe`.

The README was read before reconstruction. ZIP and member hashes matched. Candidate source, probes, and report were inspected only as evidence.

The bundle provides useful narrow candidate logic for initial destination validation, pending resource/tick validation, and stable completed-receipt targeting. It does not close the hardened scope: its non-head path still fails after the fork, it still labels completion as explicit, and it lacks complete initial duplicate/control/adversarial matrices.

Keep PR #3 under `HOLD_NAMED_CONSUMER` until revised `0.6.9.7` and its independent successor audit complete. Do not merge, cherry-pick, rebase, force-update, modify, or close it.

## Preserved Normal Persistence Baseline

The stopped run freshly passed the unchanged focused persistence suite at `26 / 26`. This is baseline evidence only, not implementation acceptance.

Preserve all accepted `0.6.9.2` through `0.6.9.5` behavior:

- verified publication and immutable address authority;
- durable account-consumer repair;
- new-campaign retry and same-slot recovery collision closure;
- pending ordinary mutation/publication blocking;
- unique pending receipt admission;
- exact known-settlement authority;
- original plus one deterministic correction ledger entry;
- explicit save after repair;
- terminal, migration, launcher, account, and command regressions.

## Failure-Pattern Posture

`FP-001` through `FP-012` remain applicable.

Highest-risk guards:

- real `App.tsx` caller, not helper-only validation;
- failure, restart, caller-loss, stale, competing, and order-reversed matrices;
- source provenance before cloning or continuity rewrite;
- unique complete durable duplicate evidence;
- exact inspected/starting/final/live head terminology;
- semantic branch review;
- no large coordination-file rewrite from partial reads.

## Branch Lifecycle Posture

Fresh live inventory at the stopped run contained:

- one local branch: synchronized `master`;
- eighteen non-default remote branches;
- two open pull requests;
- PR #2 / `main-menu-asset-contract-pass` retained as `SUPERSEDED_PRESERVE_EVIDENCE`;
- PR #3 / `parallel/0.6.9.7-repair-bundle` retained as `HOLD_NAMED_CONSUMER`;
- twelve one-document audit branches retained as `CANDIDATE_INTEGRATION` at named triggers;
- `prep/integrated-gameplay-0-7-readiness-audit` and `parallel/prompt-packaging-integrity-audit` retained read-only as `PROTECTED_REFERENCE`;
- no integration, deletion, rebase, force update, or PR closure due.

Live counts and PR mergeability remain snapshot facts and must be refreshed before action.

## Preserved Boundaries

- Decision run is documentation-only.
- Do not implement or partially land `0.6.9.7` while the contract decision is active.
- Do not change shared contracts or save formats until the decision explicitly authorizes the exact surface.
- Do not implement survey behavior, Committed/Ironbound Stakes, broad recovery UI, slot redesign, cloud synchronization, generic workflow/replay/event/transaction frameworks, or unrelated cleanup.
- Protected branches remain read-only.
- PR #2 remains unmerged; PR #3 remains evidence only.
- The broad TypeScript baseline remains a separate route.

## Near-Term Sequence

1. run `Normal Defeat Recovery Continuity And Destination Provenance Contract Decision`;
2. if accepted, reinstall and run revised `Version 0.6.9.7` with all nine findings and the exact authorized contract surface;
3. independently audit through `Version 0.6.9.8` only after complete implementation;
4. accept or further repair parent `0.6.9` from that audit;
5. only then run the unversioned Ashen Reef survey receipt-foundation decision;
6. keep `0.7.0` behind representative-loop acceptance.

## Active Prompt

`Normal Defeat Recovery Continuity And Destination Provenance Contract Decision`
