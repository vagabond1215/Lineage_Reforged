# Ordinary Encounter Admission And Outcome Ownership Contract Decision

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Cross-repository mutation is unauthorized.
<!-- /repo-scope-guard -->

Date: 2026-09-28. Game `0.1.1-prealpha`; `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Unversioned documentation prerequisite; development milestone impact `none`; game-version impact `none`.

## Objective and authority

Close the one prerequisite identified by `docs/design/ordinary-combat-challenge-and-recovery-package-decision.md`: an accepted ordinary campaign transition from a player action/context through authored encounter admission to success or Normal-Stakes defeat/recovery. This is a decision/owner contract only. Do not change production source, content, UI, tests, schemas, saves, or dependencies in this run; do not implement combat.

Begin with repository-first fresh fetch/prune, synchronized head/worktree, branches/PRs, current prompt/output/handoff/history/planning, focused authorities, live caller/engine/save/UI/test delta, and failure-pattern guardrails. Independently verify the decision's source claims rather than treating the Connector packet or prior units as ordinary-reachability proof.

## Exact decision questions

1. Select one ordinary player action and valid world context for the provisional Stonevein Warrior/arming-sword path. Resolve the `region.auric_marches` versus `region.kaelvar` profile mismatch and frontier habitat source from accepted geography/travel/activity authority, or record the one precise missing product/canon decision. Do not make a city arrival automatically hostile or inject a candidate.
2. Specify candidate eligibility, stable identity, ordering, age/expiry, admission, atomic consumption, one-active-encounter policy, stale/duplicate/conflict rejection, and restart/correction behavior. Keep `world.spawn_profiles` and `world.encounter_templates` as content owners and combat instance state in game engine.
3. Specify the accepted campaign mutation/publication owner for encounter start, legal manual commands/target selection, advancing time, resolved success and HP-zero defeat. Unknown/ungranted actions must not silently become basic melee in the player-facing contract. Define source identity, revision/stale behavior, retries, save/load, and exact no-reward success consequence.
4. Bind HP-zero to one `resolveNormalDefeat` receipt and cleanup. Prove exact known-safe settlement destination for the chosen context, `recovery_pending` entry/repair owner, continued play, publication failure and durable duplicate/conflict paths. Do not infer Starfall Port safety from harbor status.
5. Decide only the minimum observer-safe text-first labels, facts and controls for this encounter, including no-encounter/active/paused/resolved/pending/unavailable states, keyboard/focus and narrow/wide readability. Do not invent hidden enemy facts or gambits.
6. Treat the additional durable-history storage trigger as consumed. Define and, where this decision needs it, execute bounded repeated success/defeat/save-reload/quota measurement against the existing 166,674-byte retained headroom. Do not delete accepted history or witness evidence.

## Disposition and completion

Return one decision-complete owner contract or `CONTRACT_BLOCKED` with the exact unresolved source/product question. Name a smallest subsequent implementation package only if all admission, outcome, recovery, presentation, and capacity gates are closed. No implementation or vertical-slice/game-version acceptance in this run.

Create one focused durable contract; update current output, handoff, prompt if routing changes, material history/planning pointers and branch register. Record tests/probes and limits. Commit, push, fetch and read back exact hosted authority; separate inspected source and publication heads. Preserve accepted Soundings and Activity repair, the 137 broad UI diagnostic baseline, Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `DEV-0.7.0`, and all protected/held branch triggers.
