# DEV-0.7.1.2 — G9 Destructive Campaign-Graph Preflight Repair

Date: 2026-10-05. Source: synchronized `master`/`origin/master` `f528df391f47429901218642029ee4eacb58c9a1`. Support suffix of planned `DEV-0.7.1`; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted DEV `DEV-0.7.0`. Development impact: `supports_current_band`; Game-version impact: `none`.

## Result and boundary

**F1_REPAIR_VERIFIED; INDEPENDENT_G9_PARENT_REAUDIT_REQUIRED; G10_ACTIVATION_HELD.** This closes the bounded repair requirement in `docs/design/dev-0.7.1.1-g9-lifecycle-parent-acceptance-audit.md`, not the parent acceptance decision. No schema, ordinary campaign owner, localStorage lifecycle writer, deployment, primary milestone, or Game version changed.

`CleanEpochAccountStore.transitionAccount` now inventories all 12 account-owned families in its destructive readwrite transaction and validates the complete account graph before the first write. It rejects missing or mismatched v6 attempts, first/descendant/terminal recoveries, immutable artifacts, controls, Soundings witness, live addresses, generation pointers, deletion receipts, account history, and consumer receipts. The proof includes historical campaigns after slot reuse, pending publication/settlement, closed terminal history and zero-address terminal cleanup. A rejected preflight leaves account revision and generation, surviving bytes, the other account, and lifecycle receipt unchanged. Existing password, CAS, exact retry, tombstone and post-commit readback semantics remain in the same owner.

The focused native QA now starts with coherent published campaigns and applies isolated raw IndexedDB corruption to one required edge while version-1 account rows survive. Paired reset/delete cases cover valid published, prepared, pending first and descendant, settled/pending terminal, terminal cleanup, witnessed Soundings, G9E deletion and historical slot reuse; missing artifact/control/recovery/address/generation/attempt/witness/deletion receipt and corrupt terminal closure binding fail closed. Existing two-owner contention, restart, old hints/sessions, abort/quota at every destructive write, lost readback and exact retry remain. The synthetic selected App shows a blocked error for Settings reset/delete after removal of its required artifact, and opening Characters shows campaign data unavailable.

## Fresh verification

- Native lifecycle browser: **64/64 PASS** after final source and QA edits. Selected App Settings reset and delete each displayed `Campaign artifact is missing.` on the synthetic corrupt account; Characters displayed `Campaign data is unavailable`.
- Adjacent native browser: G9B Normal defeat **8/8**, G9C Legacy **6/6**, G9D terminal **14/14**, G9E slot generation **13/13**, first campaign **5/5**, descendant adapter **16/16**, witnessed descendant **11/11**.
- Focused campaign/Soundings/survey Node: **174/174 PASS**. Node UI-config typecheck and app-local Vite build **PASS**. Broad UI typecheck remains **nonzero with 137 existing diagnostics**, none in the changed production or QA files. `git diff --check` passes.

These browser fixtures are synthetic, isolated accounts. They prove the accepted storage contracts and selected caller presentation, not production-account reachability or a G9 parent acceptance result.

Applicable guardrails: FP-001 (selected caller), FP-002/014/019 (cross-store existence and provenance before erasure), FP-003/004/005/006/011/012/013 (restart, conflict, abort/quota, exact retry/readback and retained authority), FP-008/009 (source versus hosted identity and branch review), FP-015/017/018 (all failure branches, synthetic limits and generation-bound reentry). The exact evidence is the native matrix and this record; no new generalized pattern is needed beyond FP-019.

Branch/PR lifecycle: fresh fetch/prune found two local and six hosted branches including `master`, and zero open PRs. Readiness and prompt-integrity remain `PROTECTED_REFERENCE`; administration, creator planning and creator implementation remain `HOLD_NAMED_CONSUMER` with the exact review triggers in the branch register. This repair consumes no such trigger; no branch integration, rebase, deletion or PR action is due.

Next: independently re-audit the whole G9 parent against the repaired hosted head, including fresh partial-graph corruption and valid historical controls. Only an explicit `G9_PARENT_ACCEPTED` from that later audit can release a separate G10 decision. Suggested commit: `fix(persistence): preflight account campaign graph before erasure`.
