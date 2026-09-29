# Ordinary Encounter Context Authorship Decision

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-28. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Unversioned documentation decision; development milestone impact `none`; game-version impact `none`.

## Objective

Resolve the first held gate in `docs/design/ordinary-encounter-admission-and-outcome-ownership-contract-decision.md`: authoritatively identify one ordinary, player-reachable action and exact place/habitat context that can produce an eligible encounter using existing world-owned spawn/template/monster content. This is a reusable-context authoring decision, not combat implementation or a canonical first-encounter script.

Start from fresh synchronized repository head/worktree and review branches/PRs, current prompt/output/handoff/history/planning, the accepted reusable contract, exact world/travel/activity/content/test callers, and applicable failure patterns. Perform independent source and executable characterization where needed. Preserve accepted Soundings, Activity repair, the 137 broad UI diagnostic baseline, protected branches, Game `0.1.1-prealpha`, `INTEGRATED_LOOP` and `DEV-0.7.0`.

## Required decision

The project owner directed that encounters vary by authoritative current location and ordinary action. Stonevein's caravan/frontier approach may be one representative reference if supported by exact authored world authority. Never hard-code Stonevein, Kaelvar, kobolds or any single template as every character's first encounter. Other origins/actions with no matching authored context must return `no_eligible_encounter` or an unavailable action.

Choose one exact action-to-world-hex/edge/habitat link. Identify the action owner and its ordinary production caller, existing world records and geography hierarchy, proposed authored link location/schema/validation, hazard source, spawn-profile/template eligibility and a positive/negative creator-to-action acceptance path. Do not infer `frontier_track`, `quarry_edge` or any other habitat from prose, terrain name, risk tags or `frontier_entry` alone. Do not make city arrival automatically hostile, activate generic world ticks, or invent a generic route/quest/reward system.

If existing accepted authority cannot select a truthful action and place, return `AUTHORED_CONTEXT_BLOCKED` with the exact missing user/canon choice and leave implementation uninstalled. Otherwise return `AUTHORED_CONTEXT_DECIDED`, with an exact bounded authoring/validation route and a separate capacity gate before any combat implementation prompt. The decision may define data and owner contracts but must not edit production source, content, UI, tests, schemas or saves in this run.

## Completion

Write one focused decision, update current Codex output/handoff/prompt if routing changes, material history/planning pointers and branch register. Record source, probes/tests and limits. Commit, push, fetch and read back exact hosted authority, distinguishing inspected source from publication head. Do not claim positive ordinary combat reachability, repeatable storage safety, implementation acceptance, development milestone advancement or a game-version increment without the separate required evidence.
