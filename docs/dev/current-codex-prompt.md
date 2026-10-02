# DEV-0.7.1 Slice G9E — Slot Closure/Delete And Inheritance Consumption

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-02. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and deployment activation remain held. Start from synchronized hosted `master` after the G9D terminal implementation. Read the G9A lifecycle/destructive authority decision, G9D prerequisite and focused implementation record, current output/handoff, repository protocol, failure-pattern register, branch policy/register and historical/planning reconciliation. Preserve G8 one-head/multiple-address, Soundings witness and exact retry/readback semantics.

## Objective

Implement explicit clean-epoch slot address deletion and post-settlement terminal address closure/cleanup, plus exactly-once retired inheritance-use consumption under the already accepted rules. Keep immutable campaign artifacts, terminal/descendant/first recoveries, Soundings witness, Chronicle, estate and unrelated account/slot state durable. Do not route through retained localStorage deletion or inheritance writers.

## Entry hardening gate

Before any G9E mutation, verify the connector-authored G9D hardening checkpoints now on hosted `master`: `7888f372` requires exact equality between retained account-history `saveSlotIds` and current IndexedDB campaign address membership at retirement, and `b20c7c0c` adds focused rejection coverage plus a distinct completed-settlement post-commit readback-loss/retry case. These connector edits are **not executable acceptance evidence**.

Run the focused native terminal suite first and require **14/14 PASS**. Then re-run the adjacent epoch owner/browser suites, campaign/Soundings/survey Node suites, Node UI-config typecheck, app-local Vite build, and broad UI characterization against the known 137-diagnostic baseline. If either hardening case fails, repair G9D narrowly and re-run before beginning G9E. Do not reuse the prior 12/12 G9D count as evidence for the hardened hosted head.

## Required implementation and proof

- Define the exact address and account revision CAS for manual/quick deletion. A player delete removes only the addressed artifact/publication pointer and adjusts the corresponding run-history `saveSlotIds` once. Other addresses and the singular campaign head remain authoritative. Reject stale, malformed, pending, cross-account or competing requests without partial effects. Define the no-address run outcome from accepted G9A rules; if an additional shared contract is genuinely missing, stop at the smallest decision-complete prerequisite.
- Permit terminal address cleanup only after G9D settlement is completed and independently read back. Adapt G9D terminal recovery, closed-head and slot inventory validators to recognize the post-deletion state without discarding the stable terminal identity or allowing an absent address to masquerade as an empty campaign before cleanup. Test multiple addresses, restart and exact retry at each boundary.
- Bind inheritance consumption to an exact retained retired source record/source-run identity and expected account revision. Use the existing accepted eligibility/count/auto-archive rules without inventing new grants. Decrement at most once; record any zero-use transition in the same account transaction. Keep the terminal/payout/estate evidence and unrelated profile data. If G9D retirement offers no eligible inheritance uses under the existing rule, prove that honestly and restrict the implementation to valid retained sources.
- Wire only existing verified selected-App controls. Do not add speculative UI or infer inheritance eligibility from a synthetic fixture. Exercise actual reachable delete/cleanup and failure/retry paths where a control exists; distinguish owner fixtures from ordinary UI reachability.
- Test abort/quota at each write, two owners/stale tabs, regenerated caller, conflicting source, malformed retained rows, exact readback and restart. Re-run adjacent epoch owner/campaign/Soundings suites, Node UI-config typecheck, app-local Vite build and broad UI characterization against the known 137-diagnostic baseline.

## Exclusions and repository completion

No account reset/delete, new inheritance eligibility or reward rule, normal/hardcore terminal caller without accepted gameplay state, pre-cutover migration, G10 deployment/reset/backup/capacity acceptance, broad combat work or Game-version change. No immutable artifact or witness pruning from ordinary address deletion.

Fetch/prune from synchronized hosted `master`; inspect live branches/PRs and exact retained review triggers. Review the source/test/doc diff, commit/push useful checkpoints, update focused authority plus current output/handoff/prompt/planning/historical/branch registers, then fetch and read back hosted head. If G9E is verified, install G9F from the accepted G9A order; otherwise retain the narrowest support route.
