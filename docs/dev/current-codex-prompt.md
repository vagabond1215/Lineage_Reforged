# Ordinary Combat/Challenge And Recovery Package Decision

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-28. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Unversioned documentation/readiness decision. Development milestone impact `none`; game-version impact `none`.

## Objective

Decide the smallest ordinary player-reachable combat/challenge lifecycle that can become the next bounded playable-depth implementation package. Start from `docs/design/ordinary-combat-challenge-and-recovery-package-decision-prework.md`; independently revalidate its connector findings against fresh synchronized master and the complete controlling authorities. This run is a decision/readiness pass, not combat implementation.

Perform the repository-first orientation required by `AGENTS.md`: fetch/prune, clean/synchronized worktree, branches/open PRs, current prompt/output/handoff/history/planning anchors, focused authorities, relevant runtime callers/content/tests/build surfaces, and failure-pattern guardrails. Preserve unrelated edits and retained-branch triggers.

## Required decision work

Trace the real ordinary caller path from creator/campaign state and world/travel/activity context into encounter admission. Identify an exact existing authored encounter/template/monster/spawn candidate if one is honestly usable; otherwise identify the smallest authored prerequisite rather than inventing one. Distinguish world candidate/admission authority from combat runtime.

Characterize the minimum meaningful player choice/action loop using existing combat commands and runtime. Inspect success/outcome behavior, restart/save implications, and whether any durable consequence is actually owned. Do not invent loot, currency, reputation, quest, or progression rewards.

Trace Normal-Stakes defeat from HP zero through encounter cleanup, receipt, recovery destination selection, continued play, duplicate/restart behavior, and any `recovery_pending` case relevant to the selected ordinary context. Prove destination authority; do not treat Starfall Port or another harbor as safe merely by inference.

Inspect starter/equipment paths for the selected creator/loadout. Prefer an already valid profiled loadout. If the selected loop cannot work without an equipment repair, identify only the smallest consumer-driven prerequisite. Do not authorize generalized individualized-item/provenance work unless the exact selected consumer proves it necessary.

Define the minimum text-first presentation contract needed for the selected encounter: player-facing labels, visibility/hidden-information boundary, encounter/roster/resources/status/action/target/outcome/recovery facts, legal controls, unavailable/stale states, keyboard/focus/readability expectations. Reconcile the retained text-first combat presentation audit against current source. Do not invent a gambit system or broad combat UI.

Evaluate storage explicitly. The retained peak is 5,076,206 / 5,242,880 UTF-16 bytes with 166,674 bytes headroom. If the proposed lifecycle adds materially recurring durable history, perform/define the bounded growth evidence needed and treat the existing storage trigger as consumed before implementation. Do not delete accepted witness/history to gain space.

Use local executable probes/tests when necessary to establish runtime readiness, but do not mutate production source/content/UI in this decision. Browser inspection may characterize existing ordinary reachability only; do not use fixture injection as proof of ordinary admission.

## Disposition

Return exactly one:

- `COMBAT_CHALLENGE_PACKAGE_READY` — exact bounded lifecycle, owners, files/surfaces, tests, browser acceptance, success and defeat/recovery gates, storage posture, exclusions, and implementation route are decision-complete.
- `COMBAT_CHALLENGE_PREREQUISITE_REQUIRED` — exactly one smallest prerequisite is required; install only that prerequisite route.
- `COMBAT_CHALLENGE_NO_PACKAGE` — no coherent bounded package is currently supportable; record the missing authority/evidence and leave implementation uninstalled.

Do not implement the resulting package in this same run.

## Completion

Create a focused durable decision recording source identity, evidence, owner/caller trace, candidate encounter/context, equipment posture, presentation contract, success and defeat/recovery lifecycle, persistence/storage analysis, tests/browser acceptance plan, risks, exclusions, and disposition. Update current Codex output, GPT handoff, current prompt, material planning/history pointers, and branch register. Commit/push/fetch/read back hosted authority and report exact source and publication heads separately.

Preserve Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, the 137-diagnostic broad UI baseline, accepted Soundings closure, and protected/held branch triggers. Do not claim vertical-slice acceptance or allocate a game-version increment.
