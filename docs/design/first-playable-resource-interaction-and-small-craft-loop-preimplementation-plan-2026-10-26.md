# First Playable Resource Interaction and Small Craft Loop: Preimplementation Plan

Date: 2026-10-26
Status: `BOUNDED_G3_DESIGN_PREP; NO_AUTHORED_TARGET_OR_IMPLEMENTATION_SELECTED`
Owner intent: grounded medieval-fantasy text/strategic gameplay with a coherent playable Area, not a universal gather-anywhere button.
Routing: [deferred consumer timing](deferred-and-outstanding-design-consumer-timing-map-2026-10-26.md), [Area detail](current-area-and-atlas-interaction-presentation-detailed-plan-2026-10-26.md), [ecology-grounded contextual affordances](ecology-grounded-contextual-affordance-expansion-plan.md), [Activity Resolution Depth and Attempt State](activity-resolution-depth-and-attempt-state-contract-plan.md), [contextual inventory/crafting](contextual-action-surfaces-inventory-crafting-and-trade-decision.md), [native gear Save direction](development-only-equipment-fresh-save-epoch-and-instance-owner-decision-2026-10-26.md) **on PR #19**, not on master.
Game `0.1.1-prealpha`. Everything here is preplanning, not implemented resource availability.

## 1. Why this is the first new loop

The existing fully accepted loop is **Soundings** (creator→travel→four shifts→return→one-time 5g submit→Save/restart). The next replayable *new* activity should produce a tangible world→item consequence while reusing the native item owner, current body/time behavior, player-location fact, and Area context. Target **one actually authored local resource**, one safe collection method, one bounded output and optionally one simple process/use transformation. It must have meaningful negative cases, not a generic recipe browser masquerading as play.

The existing world ecosystem includes authored biome/flora/fauna/mineral profiles, localities, world hexes and ecology availability. Those describe **potential**, not an observed persistent pile of usable material. The existing 28 static recipes describe transformations, not an executable player attempt. PR #20's new durable instance owner is isolated; source/Save/production inventory cutover remains a critical prerequisite for any new output path.

## 2. The required three-level source model

`ecologically plausible → actually observed/discovered in current place → durable resource instance/quantity with owner-authorized action`.

- **Plausible:** suitable conditions/tags/rarity from ecology/hex profiles; can appear as a cautious habitat description if known, never as guaranteed stock or selectable target.
- **Observed:** an explicit, accepted encounter/local-scene occurrence/projection that the current character can perceive. Does not automatically grant Knowledge, location unlock or inventory.
- **Interactable:** exact source instance ID, quantity/condition, location/ownership/access, method availability, depletion and current revision supplied by a **real world resource owner**. It yields an authorized command target, not a button invented from description.

Avoid first-implementing a general procedural resource generation pool, ecology abundance simulation, map click coordinates or all 22 extraction methods. Use a deterministic **one-source fixture** with a known source item and local access. Still require a generalizable owner shape that can support forest/steppe/river/shore later without flattening their environmental distinctions.

## 3. Source-backed target selection before authorship

A named implementation route must inspect exact current authored IDs in:
`packages/content/base/world/*`, actual location/encounter owners, `packages/content/base/items/items.json`, existing recipe/procedure/extraction content, `packages/engines/world-engine/src/*`, `packages/engines/game-engine/src/*`, `packages/engines/player-engine/src/*`, the current inventory/gear owner and clean-format Save path.

Prepare **two viable contrasting options**, then select one after readiness evidence:

- **Candidate A: simple safely reachable botanical/fiber/wood gather**, at an actual canon place and habitat, with real source identity and one fungible item yield. Favor a routine method with modest tool/body/time cost, without inventing an open-access forest or assumed land ownership.
- **Candidate B: modest shore/river material collection**, e.g. locally observed wrack/reeds or other actual item permitted by existing content. Treat salinity, tides, weather and crossing rights as separate current-authority limits; do not assume a river source is drinkable or a reef supports generic fishing.

The source, output, processing recipe, place and access rule must be **selected only from validated records** or in a separately accepted tight authored-content package. These examples are candidate *activity shapes*, not approved resource records or scene descriptions.

## 4. Smallest executable attempt/receipt contract

A future `GatherAttempt`/equivalent should keep:

- **Input:** current source head/revision, actor/campaign, current place and observed resource instance, quantity requested, chosen authored method, tool/item instance if needed, eligible skill/familiarity, current body and environmental blockers, current resource remaining and capacity; unique idempotent request.
- **Admission:** source existence/current visibility, location and reachability, access/permission, correct target identity/quantity, equipment/tool state and capacity, player consciousness/combat/activity restrictions; meaningful known time and fatigue preview.
- **Result:** deterministic bounded outcome for an ordinary routine action (Activity Depth 0/1) or one clear tradeoff if genuine (Depth 2), accepted success/failure/partial amount with exact resource depletion, time/body effects, item quantity created and durability/wear when defined.
- **Atomicity:** one world-resource decrement and one inventory increment/output per accepted request with exactly one result/Chronicle event and save publication. If capacity fails, do not spend time or deplete unless the authored method explicitly allows a known dropped/overflow result.
- **Retry and restart:** duplicate request no second yield, stale source rejected, interrupted app cannot half-award output, post-restart same quantities and provenance. Failed admission no hidden time, fatigue or item consumption.
- **Knowledge/Echo:** actual legitimate earned skill progress only through an accepted progression receipt; no automatic baseline Echo or family Hunter unlock from debug fixture/created item. The activity can be viable with no skill award at first.

**Do not** introduce a second gear location list, type-level condition flag, cloned bag stack, unverified local weather or imaginary NPC steward to make the demo work.

## 5. Optional one-step hand process

After successful source acquisition, select **one existing exact recipe** whose inputs/tools/outputs/workplace access are actually coherent at the selected Area. If none meets the local hand-processing boundary, **stop at a usable resource acquisition loop** and author a separate small craft candidate later. Do not create a nonsensical recipe simply to claim crafting is playable.

The process must consume specific owned input quantity from the actual bag or accessible owner, pay time/body/tool use through accepted activity/recipe, create output through the true item-grant authority, and commit one receipt/restart. Treat quality/material substitution/bulk processing/merchant sale as separate future consumers, not automatic extensions.

A direct `Use/Eat` output is also acceptable **if** a real item-use command currently supports it safely. Do not force a full six-stage minigame for splitting a branch or collecting reeds.

## 6. World/Area and contrast tests

| Test | Expected |
| --- | --- |
| Forest / woodland with plausible resource but **no observed instance** | Description only; no `Gather` |
| Accessible actual target, permitted method, enough capacity | One accepted bounded yield, source quantity reduced and exact bag increase |
| Wrong habitat, wrong location, unreachable target | Block with truthful reason, no state mutation |
| No required tool or tool not physically worn/accessible | Block or allowed lower capability per authored method; no guessed success |
| Stale source revision, duplicate attempt | Deterministic rejection/idempotent receipt, no double stock |
| Capacity reached / chosen overflow | Follow explicit inventory owner rules, no lost material or silent quantity merge error |
| Interrupted Save/publish and restart | Resource, body/time, item and Chronicle exactly coherent |
| Small hand process (if selected) | Inputs consumed once, output created once, quality/condition only if authored |
| Environment contrast (steppe creek, estuary, woodland) | Shared owner model, different eligible semantics; not every biome offers same resource list |
| Dev QA-origin item/evidence | No genuine earned Echo, achievement or downstream inherited backstory unlock |
| Narrow Area UI | Resource card fits, legal action visible, blocked reason/actual result readable and keyboard accessible |

## 7. Timing and consumer readiness

**G1, now:** audit actual IDs, shortlist, observation tiers and read-only Area affordance; author source-grounded short descriptions following [narrative plan](lore-grounded-naming-and-area-content-authoring-plan-2026-10-26.md).

**G2:** finish native gear/stack/Save and Area UI selected Soundings/encounter acceptance. Read-only ecology UI can show authored plausible features but no Gather yet.

**G3, separate PR:** one source instance/attempt/depletion and inventory output, with exact tests and selected-client Save/restart. Only add a process/recipe if it is genuinely dependency closed.

**G4+:** introduce additional authored locality/ecology families, extraction methods and risk/ownership complexity one real consumer at a time; only then broader hunting, fishing, camping, farming and businesses.

No exact name, newly created resource source, interactive world object, material drop, recipe, public NPC or image is authorized by this document. It does not install a new Codex task or change the current implementation branches.
