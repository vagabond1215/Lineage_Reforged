# DEV-0.7.1 Slice G9E — Slot Generation And Address Deletion

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-10-02. Internal implementation slice of planned primary `DEV-0.7.1`; parent, Game version and deployment activation remain held. Begin from synchronized hosted `master` after the hardened G9D verification. Read G9A, the G9D focused record and `docs/design/dev-0.7.1-slice-g9e-address-generation-prerequisite-decision.md`, plus current output/handoff, repository protocol, failure-pattern and branch registers, and historical/planning reconciliation.

## Objective

Complete the additive v6 slot-generation prerequisite decided in the focused G9E decision, then implement explicit manual/quick address deletion and post-settlement terminal address cleanup. Preserve immutable campaign artifacts, every historical first/descendant/terminal recovery, Soundings witnesses, Chronicle, estate and other addresses. Keep account reset/delete and G10 held.

## Required implementation and proof

- Migrate verified v5 first attempts/recoveries to campaign-scoped v6 authority with one current slot-generation pointer. The pointer must carry a stable `slotGenerationId` for one physical-slot occupancy. Preserve historical rows, designate one active authority and fail closed on malformed or duplicate upgrade. A deleted slot must be honestly empty **and** reusable for a later creator attempt without overwriting the old generation.
- Keep `slotGenerationId` semantically and structurally distinct from the existing save/publication `generationId`. `slotGenerationId` survives all publications within one slot occupancy; save/publication `generationId` may change with first, descendant or terminal publication. Never alias, derive, substitute or compare these as the same authority. Stale slot-generation CAS must fail even when an artifact/publication generation is otherwise valid.
- Implement exact account-revision and address/`slotGenerationId` CAS, atomic account run-membership update, address removal and immutable deletion receipt. Apply accepted active-last-address deletion semantics; never mark a terminal archived run deleted. Reject stale, malformed, pending, cross-account, competing or changed-retry requests without partial effects.
- Permit terminal cleanup only after completed G9D settlement and independent readback. Remove all remaining character addresses atomically, record complete receipts and adapt terminal/slot/first/descendant validators so deliberate deletion remains distinguishable from unexpected address loss. Prove restart and exact retry.
- Preserve the accepted lifecycle distinction: G9D selected terminal retirement is archival settlement (`outcome: archived`, `archiveReason: retired`) with payout/estate and is intentionally **not** a lineage-inheritance source. `retainRetiredRun(...)` / `outcome: retired` is a separate retained-lineage state not selected by G9D. Do not convert archival retirement, mint inheritance uses or broaden eligibility in G9E. Preserve first-campaign exactly-once inheritance consumption only for genuinely eligible retained `retired` sources and test archival-terminal rejection separately.
- Prove repeated physical-slot reuse, not merely one replacement: campaign A in a slot -> delete -> campaign B in the same slot -> delete -> campaign C in the same slot. A and B historical attempts/recoveries/receipts must remain independently readable; stale A/B callers must not load or mutate C; the current slot-generation pointer must identify only C; and physical-slot reuse must not collide history, receipts or recovery identities.
- Wire only existing verified selected-App delete controls after owner proof. Test actual ordinary UI delete, replacement, stale tab and failure/retry paths. Include native upgrade, multi-address, abort/quota per write, two owners, malformed rows, retained witness/history and lost readback. Re-run adjacent browser/Node suites, Node UI-config typecheck, app-local Vite build and broad UI baseline characterization.

## Exclusions and completion

No account reset/delete, new inheritance rule, normal/hardcore death caller without accepted gameplay state, pre-cutover migration, G10 deployment/reset/backup/capacity acceptance, broad combat or Game-version change. Do not prune immutable artifacts or witnesses on address deletion. A future decision to make terminal retirement an inheritable retained-lineage state is explicitly outside G9E.

Fetch/prune from synchronized hosted `master`, inspect live branches/PRs and retained review triggers, validate, update the focused record and current output/handoff/prompt/planning/historical/branch registers, commit/push useful checkpoints and read back hosted head. If G9E is verified, install G9F from G9A; otherwise retain the narrowest support route. Do not claim G9E acceptance from this prerequisite document alone.
