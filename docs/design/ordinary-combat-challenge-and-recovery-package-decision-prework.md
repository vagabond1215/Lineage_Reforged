# Ordinary Combat/Challenge And Recovery Package Decision — Connector Prework

Date: 2026-09-28. Status: **DECISION_PRESTAGED**. Repository: `vagabond1215/Lineage_Reforged` only. Connector inspection source: `8fbc63bdf4ccde39475d7e485dc8135d749703a1`. Game `0.1.1-prealpha`; playability `INTEGRATED_LOOP`; accepted `DEV-0.7.0`, band `DEV-0.7.x`. Documentation/planning only; no implementation permission and no game-version or milestone change.

## Purpose

Pre-stage the smallest evidence-backed next route after the verified Activity revenue repair. The objective is not to build a broad combat system. It is to decide whether one ordinary player-reachable challenge/encounter can be packaged as the next bounded playable-depth increment, including success, defeat/recovery, continued play, and only the minimum inventory/equipment or persistence dependencies actually required.

## Connector findings already established

1. **Combat foundations are live, not hypothetical.** `packages/engines/game-engine/src/combat/index.ts` already owns mutable encounters/combatants, action resolution, manual combat commands, weighted tactics behavior, damage/mitigation, equipment-derived grants, outcomes, and combat history. `tests/unit/combat-spawn-foundation.test.mjs` exercises encounter creation, manual commands, damage preview, skill-gain attempts, and ticking.
2. **Authored encounter/spawn authority already exists.** `world.monsters`, `world.encounter_templates`, and `world.spawn_profiles` are canonical static owners. Do not create parallel enemy/encounter/spawn collections.
3. **Normal-Stakes defeat/recovery is implemented.** `packages/engines/game-engine/src/normal-defeat.ts` and shared contracts implement deterministic nonterminal defeat receipts, safe-settlement destination authority, `recovery_pending`, Chronicle/notification projection, duplicate/idempotency protections, and recovery repair. Ordinary HP zero is defeat, not implicit death.
4. **The ordinary admission/context seam is the principal unresolved boundary.** Combat authority explicitly leaves world candidate selection, encounter initiation, and context consequences outside combat runtime. The post-Soundings decision therefore correctly requires a chosen ordinary encounter and recovery contract before combat exposure.
5. **Combat presentation is not implementation-ready as a broad UI.** The retained text-first combat presentation audit classifies source facts as sufficient for a bounded read-only plan, but observer/visibility policy and player-facing labels remain incomplete; a combat UI implementation was `NO_PACKAGE` at that audit. Any next package must decide the minimum presentation contract needed by the selected encounter rather than invent hidden information or a gambit system.
6. **Equipment can already matter without a generalized inventory rewrite.** Existing starter/equipment mapping supplies working combat profiles for arming sword, war spear, lumber axe, shields and some armor. Known gaps include short bow and butcher knife starter mappings. The next decision must choose a creator/loadout path whose current equipment is valid, or explicitly classify a narrowly necessary prerequisite; it must not authorize broad item-instance/provenance work by default.
7. **Storage remains a conditional gate.** Retained Soundings evidence peaked at 5,076,206 / 5,242,880 UTF-16 bytes, leaving 166,674 bytes. The existing trigger is before longer-campaign/additional durable-history expansion or upon ordinary quota failure. If the proposed encounter/recovery package adds materially recurring durable history, bounded growth measurement is a prerequisite before implementation.
8. **Harbor recovery must not be invented.** Existing evidence does not establish Starfall Port as a safe recovery settlement merely because it is a harbor/start location. Recovery must use accepted safe-settlement authority or stop for a bounded prerequisite.

## Decision questions for the next run

The decision must answer, from fresh synchronized source and executable evidence where required:

1. What exact ordinary context admits the first representative challenge/encounter without fixture injection or developer-only mutation?
2. Which existing authored encounter template/monster/spawn authority can support it, or is a narrowly authored encounter prerequisite required?
3. What player choices/actions constitute the minimum meaningful encounter loop?
4. Can an existing valid starter/loadout support that loop? If not, what is the smallest equipment prerequisite? Do not generalize to item instances unless the selected consumer proves that need.
5. What is the exact success outcome and what durable consequences, if any, are necessary? Do not invent loot/economy/reputation rewards.
6. What is the exact defeat path under Normal Stakes? Prove recovery destination authority for the selected ordinary context, continued play, and duplicate/restart behavior. Do not silently mark a harbor safe.
7. What minimum text-first presentation is required for an ordinary player to understand encounter state, legal actions, targets/resources/statuses, outcome, and recovery without exposing hidden information?
8. Does the package add materially recurring durable history? If yes, measure bounded storage growth and determine whether the existing storage reopening trigger is consumed.
9. What tests/browser evidence would constitute acceptance, including success and defeat/recovery paths?
10. Is the resulting package small/coherent enough for one current-band primary capability, or must a prerequisite decision/repair land first?

## Allowed dispositions

Return exactly one:

- **COMBAT_CHALLENGE_PACKAGE_READY** — one bounded ordinary encounter lifecycle is decision-complete and may be installed as the next implementation route.
- **COMBAT_CHALLENGE_PREREQUISITE_REQUIRED** — identify exactly one smallest prerequisite decision/repair and install only that route.
- **COMBAT_CHALLENGE_NO_PACKAGE** — evidence does not support a bounded player-facing package; leave implementation uninstalled and state the missing authority/evidence.

A documentation decision must not itself implement combat, UI, content, inventory/equipment, recovery, persistence, storage, rewards, or version changes.

## Hard boundaries

Preserve Game `0.1.1-prealpha`, `INTEGRATED_LOOP`, accepted `DEV-0.7.0`, known 137 broad UI diagnostics, accepted Soundings closure, and retained branch triggers. Do not reopen accepted Soundings work. Do not create a generalized combat framework, gambit language, party system, loot system, item-instance model, injury/trauma system, economy, NPC system, or broad responsive redesign.

Use `docs/design/combat-authority-boundary-decision.md`, `docs/design/normal-stakes-defeat-fallback-and-recovery-receipt-decision.md`, `docs/design/combat-equipment-mapping-audit-plan.md`, `docs/design/item-equipment-inventory-authority-boundary-decision.md`, the retained text-first combat presentation audit, post-Soundings prioritization, current playability/version policy, failure-pattern register, and repository workflow as controlling inputs. Fresh live source overrides this prework if materially changed.
