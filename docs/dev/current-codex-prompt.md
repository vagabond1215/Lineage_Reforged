# DEV-0.7.1 Slice G9E — Slot Generation And Address Deletion

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-02. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and deployment activation remain held. Begin from synchronized hosted `master` after the hardened G9D verification. Read G9A, the G9D focused record and `docs/design/dev-0.7.1-slice-g9e-address-generation-prerequisite-decision.md`, plus current output/handoff, repository protocol, failure-pattern and branch registers, and historical/planning reconciliation.

## Objective

Complete the additive v6 slot-generation prerequisite decided in the focused G9E decision, then implement explicit manual/quick address deletion and post-settlement terminal address cleanup. Preserve immutable campaign artifacts, every historical first/descendant/terminal recovery, Soundings witnesses, Chronicle, estate and other addresses. Keep account reset/delete and G10 held.

## Required implementation and proof

- Migrate verified v5 first attempts/recoveries to campaign-scoped v6 authority with one current slot-generation pointer. Preserve historical rows, designate one active authority and fail closed on malformed or duplicate upgrade. A deleted slot must be honestly empty **and** reusable for a later creator attempt without overwriting the old generation.
- Implement exact account-revision and address/generation CAS, atomic account run-membership update, address removal and immutable deletion receipt. Apply accepted active-last-address deletion semantics; never mark a terminal archived run deleted. Reject stale, malformed, pending, cross-account, competing or changed-retry requests without partial effects.
- Permit terminal cleanup only after completed G9D settlement and independent readback. Remove all remaining character addresses atomically, record complete receipts and adapt terminal/slot/first/descendant validators so deliberate deletion remains distinguishable from unexpected address loss. Prove restart and exact retry.
- Preserve first-campaign exactly-once inheritance consumption for genuinely eligible retained `retired` sources. G9D retirement is `archived` and currently ineligible under the accepted rule: do not invent inheritance grants or expose a speculative creator selector. Test that distinction.
- Wire only existing verified selected-App delete controls after owner proof. Test actual ordinary UI delete, replacement, stale tab and failure/retry paths. Include native upgrade, multi-address, abort/quota per write, two owners, malformed rows, retained witness/history and lost readback. Re-run adjacent browser/Node suites, Node UI-config typecheck, app-local Vite build and broad UI baseline characterization.

## Exclusions and completion

No account reset/delete, new inheritance rule, normal/hardcore death caller without accepted gameplay state, pre-cutover migration, G10 deployment/reset/backup/capacity acceptance, broad combat or Game-version change. Do not prune immutable artifacts or witnesses on address deletion.

Fetch/prune from synchronized hosted `master`, inspect live branches/PRs and retained review triggers, validate, update the focused record and current output/handoff/prompt/planning/historical/branch registers, commit/push useful checkpoints and read back hosted head. If G9E is verified, install G9F from G9A; otherwise retain the narrowest support route. Do not claim G9E acceptance from this prerequisite document alone.
