# Ordinary Combat Basic Action Selection Repair

Date: 2026-10-20. Repository: `vagabond1215/Lineage_Reforged`. Clean synchronized starting `master`/`origin/master` `66f42e27`; repair checkpoint `42c0fcd5` was pushed. Unversioned player-action repair, development impact `none`, Game-version impact `none`. Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, `DEV-0.7.1_ACCEPTED_WITH_DOCUMENTED_LIMITS` and `GAME_VERSION_NOT_READY` remain unchanged.

## Reproduction and repair

The ordinary Warrior/Arming Sword owner and creator-to-encounter caller tests both failed before the production edit: `combat.attack.melee.basic` was absent from `listLegalPlayerCombatCommands`. The item-grant resolver matched the Arming Sword's `combat.melee.primary` by melee family when asked for basic melee, then the legal-list exact-action guard discarded it. The prior selected UI observation is recorded in `ordinary-encounter-selected-basic-action-and-victory-boundary.md`.

`getActionTemplate` now selects the engine's exact basic melee template before family-matched grants. The Arming Sword profile remains a distinct item-granted action. A basic attack's source no longer claims the equipped sword item; profile actions still retain the sword item and existing sword-skill alias effects. No content, costs, encounter balance, persistence, UI layout or Game version changed.

## Validation and limit

Focused combat, equipment, exploration and static encounter tests passed 100/100; the final narrower combat/equipment/exploration rerun passed 41/41. The ordinary Warrior creator test produced a natural nearby candidate, admitted it through the campaign owner, found both actions for a legal foe and separately accepted each action with its own queued identity. Owner tests covered source/cost identity, unequipped fallback, resource, target, queued-action and pause gates; the retained alias test passed. Node UI-config typecheck passed. The app-local Vite build passed with 256 client modules. Broad UI typecheck retained 137 diagnostics, matching the recorded baseline; it is not green. `git diff --check` passed. FP-001 is covered by the creator-to-encounter caller; FP-017 keeps this automated evidence separate from selected browser acceptance; FP-002 keeps Game acceptance separate; FP-008/009 govern held refs and hosted readback.

This is **BASIC_MELEE_OWNER_AND_CALLER_REPAIR_VERIFIED; INDEPENDENT_SELECTED_ACCEPTANCE_PENDING**. No new selected browser run, victory, continued play, Save/load or restart is claimed from this repair. The unchanged fixed selected matrix in `ordinary-encounter-victory-and-choice-browser-access-hold.md` is the next independent pass. The previous selected Normal-Stakes defeat remains a separate observed boundary. No deployment, protected-account access, retained-profile clear, G10 capacity/fault rerun, held-branch integration, Site-source mutation, or `GAME_VERSION` change occurred.
