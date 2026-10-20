# Self-Target Shield Block Legal Command Slice

<!-- repo-scope-guard -->
> **Repository boundary — mandatory:** This document applies only to `vagabond1215/Lineage_Reforged`. All repository work must stay in this repository. Another Git repository is read-only reference/data only unless a separate explicit work order/context names and authorizes it.
<!-- /repo-scope-guard -->

Current Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted DEV-0.7.1 with limits and `GAME_VERSION_NOT_READY` remain unchanged. Follow `docs/design/combat-skeleton-first-priority-and-acceptance-boundary-decision.md` and the fresh `docs/design/combat-skeleton-capability-and-owner-contract-audit-2026-10-20.md`. This is a bounded combat skeleton implementation, not a balance, Home UI or Game-version run.

## Preflight and failure reproduction

Synchronize Lineage `master`; inspect exact source/status, open PRs, five held/protected refs, current output/handoff, historical/planning anchors, combat authority, failure patterns and applicable owner/caller tests. Preserve unrelated changes. Reproduce in a focused test that an equipped shield's authored `combat.defense.block` is missing from `listLegalPlayerCombatCommands` and rejected by ordinary `executeNearbyEncounterStep`, while basic/sword attacks remain available.

## Bounded patch

Use the existing equipped shield `itemUseProfileGrants` and recognized `defense.shield.*` hook to project one exact self-target Block command when the actor is ready, alive, unpaused and can pay valid costs. Keep enemy-damage commands as-is. Do not expose generic self/ally spells, healing, support, in-combat items or unknown hooks. The nearby owner must revalidate the exact action and self target with its existing source/revision/tick/ledger checks; do not bypass `listLegalPlayerCombatCommands` or mint a UI-only rule. WorldPanel must render a truthful Block — Self command and send the existing exact action/target. Preserve basic and Arming Sword profile independence.

Verify Block queues, spends its 2 Stamina at start, resolves a self Shield Block status, gives the existing mitigation effect, recovers through Continue and remains in an admitted snapshot. Reject no-shield, wrong/enemy/other-ally target, stale/busy/paused/insufficient-cost and unsupported self-hook cases without mutation. Test real nearby command caller, exact duplicate/conflict and an enemy attack regression. If a helper must be shared, keep it narrow and owner-local; preserve TypeScript/JavaScript mirror policy.

## Validation and handoff

Run focused owner and caller tests, relevant equipment/profile checks, Node UI-config typecheck and app-local Vite build. If broad UI typecheck is run, compare diagnostics to the recorded baseline; do not call it green when it is not. Inspect the resulting selected UI when an accessible isolated profile/origin is available; label any absent selected proof explicitly. Do not use protected accounts or clear retained profiles. Record applicable failure-pattern IDs, code/test/UI evidence, limitations and exact next gate in current output, handoff, historical/planning route and branch register. Commit/push and verify hosted source readback. After this slice, install only the smallest evidence-supported next combat skeleton prompt.

No combat stat, enemy count, difficulty, damage math, creator/starting gear, content, schema, Game version, Site source, deployment, Home overhaul, contextual command architecture rewrite, held-ref integration, G10 rerun, forced selected victory or balance tuning.
