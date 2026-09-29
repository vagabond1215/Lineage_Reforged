# Ordinary Campaign Publication Capacity And Retention Contract Decision

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-28. Unversioned cross-cutting publication and retention decision; no development-milestone or game-version advancement. Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`, accepted `DEV-0.7.0`; planned parent `DEV-0.7.1` remains held.

## Objective and authority

Decide the smallest safe bounded-retention and quota-failure contract for repeatable local campaign publication before ordinary encounter admission/outcome implementation resumes. Start from the Slice C focused record `docs/design/ordinary-encounter-publication-capacity-preflight.md`, its exact JSON evidence and probe at checkpoint `bb24c483d7d683466d28dcace57fc1e6a723de0a`; verify the synchronized live head first. In one isolated creator-to-World campaign, action 50 retained 5,150,828 / 5,242,880 UTF-16 bytes and action 51 hit quota while creating the recovery record. The prior verified head survived but the rejected candidate copy remained. This is a failed capacity gate, not combat acceptance.

Complete repository-first orientation: current prompt/output/handoff/history/planning, protocol, platform/tool policy, failure patterns, branch/PR state, focused ordinary encounter and Soundings provenance authorities, live save manager and every read/write/recovery/consumer path for local storage keys. Preserve unrelated work and protected refs. This is a documentation decision. Do not change production code, content, tests, browser saves, accounts, dependencies or `GAME_VERSION` in this run.

## Required decision

Inventory the actual candidate, immutable artifact, slot address, campaign control, publication recovery, new-campaign attempt, Soundings witness, migration source/receipt, account profile/history and other relevant keys. Identify which bytes and identities are independently required for current-head verification, non-head saves and forks, source provenance, duplicate classification, interrupted publication, consumer completion, migration and Normal-Stakes recovery. Distinguish safe ephemeral candidates from accepted authority; do not infer that an old artifact can be discarded from ancestry alone. Reconcile any existing retention or compaction policy and the 5 MiB failure with the accepted Soundings independent-provenance requirements.

Choose a concrete bounded retention/compaction policy and failure-order contract for a local single-account store. Specify eligibility, proof of supersession or equivalent preservation, atomic/restart-safe write sequence, exact readback, cross-slot/campaign references, conflict handling, recovery after a pre-head quota failure, and behavior when no safe reclaim is possible. Set measurable whole-store budgets for repeated ordinary action/save sequences and temporary peak writes; state what remains unmeasured for future combat admission, outcome, defeat and receipts. If a safe bounded policy cannot be decided from current authority, return an explicit blocked decision with precise missing facts rather than authorizing deletion or unlimited growth.

Produce a focused decision with a numbered finding-to-owner/repair/test matrix and one smallest implementation package, or a precise further prerequisite. Preserve source, witness, accepted history, and newer heads. No combat, reward, economy, broad storage migration, new production dependency, game-version change or parent acceptance. Update current output/handoff, historical/deferred register, planning pointer, branch register and the next installed prompt. Commit, push, fetch and read back exact hosted authority, separating inspected source and publication head. Report retained branch/PR review triggers and applicable failure-pattern evidence.
