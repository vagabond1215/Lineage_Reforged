# DEV-0.7.2.3 Enemy AI Legality And Target Adversarial Matrix Prework

Date: 2026-10-20. Repository: `vagabond1215/Lineage_Reforged`. Independent connector-only planning pass after source-orientation packet `a14cfa24524f5f9040eda7c50f3e792b35eaaf11`. **PLANNED_ADVERSARIAL_CASES_ONLY; NO TESTS EXECUTED; NO DEFECT YET PROVEN.** Applies only as a proposed input to active `DEV-0.7.2.3 Enemy AI Candidate Legality And Target Verification`; it does not supersede that prompt.

## Scope

Verification target: **enemy AI's currently supported action packages and actual runtime target/queue/execute path**, not a general redesign of NPC cognition, combat balance, weighted tactic preferences, magical casting, ally parties or ordered gambits.

One representative authored enemy from an ordinary admitted encounter should be the baseline. Alter only controlled test fixture state *after* legitimate encounter admission when testing hard-to-hit negative branches. Require actual `tickCombatFoundation` and, for integration claims, `executeNearbyEncounterStep` rather than isolated `chooseAiActionType` (which is currently an internal helper). Any logged result must be classified as owner/unit, real-caller, selected-browser or merely design expectation.

## First checkpoint: a falsifiable narrow candidate gate

The most efficient **first executable hypothesis** is the relationship among candidate scoring, cost affordability and action-start cancellation.

- The current source's `buildCandidateActionTypes` produces candidates; `scoreActionType` and `chooseAiActionType` choose by preference, then `queueAiActions` submits the winning candidate. `startReadyActions` checks `canPayCosts` and cancels an unaffordable queued action.
- Use an existing supported package to create a deterministic expensive/high-score candidate and, if possible, a separate currently payable supported candidate. Check whether one tick creates a cancelled action or a valid next action, and whether subsequent ready ticks repeat cancellation.
- **Do not invent a universal rule that AI always attacks when out of Stamina/MP.** If the currently valid policy is to skip/wait, demonstrate that coherently. If it repeatedly queues a cost-impossible candidate despite a live affordable choice, document it as a candidate defect and use an exact red test before any fix.
- Preserve tick timing, actor action IDs, costs, source IDs, target IDs, and action count; a passing code path without a target/effect trace is insufficient.

## Bounded adversarial cases

| ID | Controlled fixture or real caller variation | Required measurement / boundary | Priority |
| --- | --- | --- | --- |
| AI-01 | Ordinary admitted Kobold enemy with supported melee or ranged action package | Exact actor/source/action/target, legal team, one action queued/started, paid cost, actual damage hook, resolution/recovery. Distinguish real caller vs owner fixture. | P0 |
| AI-02 | Ready enemy with a high-scored unaffordable action and another permitted affordable action | Inspect candidate selection, cancellation/fallback/wait, subsequent tick, source integrity; no loop of apparently valid-but-never-executable actions unless expressly intended/accepted. | P0 |
| AI-03 | Only one supported action exists but Stamina/MP insufficient | No negative resource pools, no effect without paid cost, no duplicate paid attempt, documented legitimate wait/recovery/cancellation behavior. | P0 |
| AI-04 | Role action package ID absent/unknown; actor has no grant | Characterize `resolveActionPackageActionType` / `getActionTemplate` existing basic-melee compatibility fallback; ensure fabricated item/spell identity is not emitted. **Do not change global manual fallback contract** as incidental AI repair. | P0 |
| AI-05 | Candidate has an action identifier absent from an owned grant/library | Show whether AI falls back, silently substitutes or rejects; exact supported output, no unauthorized item/known-spell/ability action. Any global rejection requires its own contract review. | P1 |
| AI-06 | Target side has one living and one defeated/incapacitated combatant | Only living legal targets selected; no defeated target recycled, even with strongest tactics priority weight. | P0 |
| AI-07 | No live legal opposing target | No invalid target ID or phantom action; genuine terminal outcome handled via runtime without invented result object. | P0 |
| AI-08 | Enemy has support/healing action | Owner-relative “ally” is enemy team, “enemy” is player team, “self” is acting combatant; no accidental player healing or hostile friendly fire from target-label inversion. **Do not claim magic compatibility/ownership is solved.** | P1 |
| AI-09 | Multi-target template with eligible target count smaller than max | Stable bounded target list, no duplicate/defeated IDs, shape actually supports area/line/arc; no new range/spatial system inferred. | P1 |
| AI-10 | Target removed/defeated between queue and resolution | Inspect actual resolution skip, paid-cost semantics and no resurrection/phantom damage; distinguish current supported policy from an assumed refund. | P1 |
| AI-11 | Enemy already executing, recovering or has queued action | At most one additional AI selection at the correct next ready interval, not repeated queue or double resource payment. | P0 |
| AI-12 | Enemy paused, controlled, defeated, incapacitated or temporarily manually overridden | No unauthorized AI queue while blocked; after legitimate release/resumption, action selection obeys current timing. | P0 |
| AI-13 | Tactics focus/priority/ignore and changed target health | Supported actual preference weighting affects rankings as specified, but must never overrule hard legal life/team/source/resource gates. | P1 |
| AI-14 | Duplicate/stale/wrong-player command while AI would act on the same beat | Real nearby caller rejects without advancing a beat or causing hidden AI damage; accepted Continue advances once; campaign ledger remains coherent. | P0 |
| AI-15 | Serialize active encounter mid-AI queue/action and reopen | Exact actor timing, current action, source, targets and resources remain coherent; do not treat roundtrip alone as full browser restart proof. | P1 |
| AI-16 | New ability/spell-looking metadata inserted into an isolated fixture | Confirm existing staging/trust boundary and record any unsupported ownership gap without activating magic, catalyst, conduit, typed multi-effect or new ability system. | Later/deliberately limited |

P0 denotes recommended minimum current-slice acceptance; P1 only when bounded and supported by current owner/content. Codex may refine/omit a matrix row with explicit evidence rather than inflate the package to complete every future tactic rule.

## Exactly what to assert

For an admitted single AI action, inspect `CombatActionState.actorCombatantId`, `actionType`, `source.sourceType`, `source.sourceId`, `targeting.targetIds`, `targeting.targetDisposition`, `resourceCosts`, `queuedAtTick`, `startedAtTick`, `resolvesAtTick`, `recoveryEndsAtTick` and lifecycle. Confirm live combatant resources and target HP/effect only after actual resolution. Compare accepted changes against unmutated caller source and owner control; examine serialized action when meaningful.

For rejected/cancelled actions, record whether a request/queue exists, whether cost was paid, whether a duplicate action occurs on a later tick and whether a genuine legal alternative is available. “No AI action this tick” can be a valid behavior; “AI chose the highest score” is *not* by itself proof of executable legality.

For target side, compare `teamId`, `disposition`, status and life flags, relative ally/enemy/self conversion and current candidate’s exact target/area shape. A target order shaped by preferences must remain separate from a hard validation predicate.

For terminal cases, re-use the already proven deterministic victory/defeat fixture semantics without reopening the prior DEV-0.7.2.1 test run or changing balance. The existing nearby caller and its ledger are authoritative; do not invent an NPC ledger command for every autonomous enemy move if no owner emits one.

## Pre-edit and regression route

1. Prove the minimal AI-01 legitimate action to establish a stable integration fixture.
2. Probe AI-02, AI-03, AI-04, AI-06/07 and AI-11/12 before expanding to less common preferences.
3. If a defect appears, keep a failing **pre-edit** owner or real nearby caller test that demonstrates it; choose one minimum source/caller repair, not a universal combat rewrite.
4. Run a focused combined regression covering AI behavior and prior independently verified player basic/sword, Block, Short/Composite Bow and terminal/ledger tests, then Node UI-config typecheck and app-local Vite build. Compare any broad typecheck run against the known 137-diagnostic baseline; do not claim it is green unless actual current result is green.
5. Codex must update the focused evidence ledger, handoff/output, historical/planning/branch register and install one next small prompt after code/proof closure. Connector cannot accept the milestone or supply executable proof.

## Constraints and publication posture

This file exists alongside [AI Source/Owner Orientation](dev-0.7.2.3-enemy-ai-source-owner-orientation-packet-2026-10-20.md), [Combat Skeleton First](combat-skeleton-first-priority-and-acceptance-boundary-decision.md), [Combat AI/Gambit Current-State Audit](combat-ai-and-gambit-current-state-audit.md) and [Magic/Ability/AI Owner Gates](combat-magic-ability-and-ai-owner-gates-prework-2026-10-20.md). It is a proposed adversarial test matrix only.

No code/tests/UI/assets/content/schemas/saves/version, active Codex prompt/output/handoff, protected account/profile, Site/deployment or branch mutation was performed by this pass. No selected-browser acceptance, full Game-version readiness or balanced natural encounter is claimed.
