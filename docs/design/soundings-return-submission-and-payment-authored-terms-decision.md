# Soundings Return, Submission, And Payment Authored-Terms Decision

Date: 2026-09-14

Status: `AUTHORED_TERMS_ACCEPTED`

Label class: unversioned authored product decision; parent: not applicable.

Development milestone impact: `none`; game-version impact: `none`.

Accepted milestone: `DEV-0.7.0`; current band: `DEV-0.7.x`; Game `0.1.0-prealpha`; playability: `INTEGRATED_LOOP`.

Source head inspected for this authored decision: `857306c84849a7917f417af4c499d5ceee58349e`.

## 1. Decision Summary

The project owner explicitly accepted the bounded recommendations for closing **Soundings of Ashen Reef** on 2026-09-14.

The accepted player-facing closure is:

completed Ashen Reef survey packet
→ return to Starfall Port
→ submit at the Starfall Harbormaster's Office
→ authoritative quest completion
→ immediate payment of **5 gold**
→ durable Chronicle/history consequence
→ continued play.

This decision supplies authored product terms only. It does not implement travel, turn-in, payment, UI, content, schemas, tests, saves, migrations, dependencies, assets, or version changes.

## 2. Accepted Terms

| Question | Accepted authored term | Explicit exclusions / boundary |
| --- | --- | --- |
| Monetary payment | **5 gold, 0 silver** on accepted completion | No bonus payment and no inheritance of legacy `5g 8s` or demo `580 crown` values |
| Standing | None | No Harbor Office standing award |
| Public/regional reputation | None | No fame/reputation award |
| Turn-in skill gain | None | Survey field-work gains remain separate; no extra General Lore or other skill gain at submission |
| Item reward | None | No item grant |
| Service/access unlock | None | No new service, merchant, office, or travel unlock as a completion reward |
| Salvage right | None | No salvage rights or claim |
| Recurrence | None | One-time-per-campaign contract remains controlling |
| Chronicle/history | Yes | Record accepted completion and payment durably |
| Quest lifecycle | Completed | Quest must leave active/tracked state and remain consumed after accepted completion |

The payment is an independently authored civic-contract amount. Legacy turn-in values are characterization only and must not become authority by reuse.

## 3. Survey Packet Representation

The completed chart packet remains **retained authoritative survey evidence**, not a physical inventory item.

Do not create a survey-packet item merely to support turn-in.

The completion owner must validate the already-retained survey evidence and preserve it after completion. The four survey requests, occurrences, results, receipts, ordered progress, correction/repair posture, and accepted non-proposals remain authoritative evidence and must not be consumed or rewritten merely because the quest is completed.

Stormglass Bloom remains an incidental discovery. It is not surrendered, converted into the packet, or treated as payment consideration.

This boundary deliberately avoids pulling item-instance, provenance, loss, duplication, inventory-capacity, or item-serialization work into the first quest-completion package.

## 4. Return Destination And Presentation

Canonical submission surface:

**Starfall Harbormaster's Office, Starfall Port**

Canonical settlement context remains:

`settlement.starfall_port`

Contact presentation remains:

**Duty Harbormaster**

`Duty Harbormaster` is a role label only. Do not invent a named canonical NPC, permanent person id, institution id, or office id for this package.

## 5. Return Travel Terms

For this contract, the accepted return leg from the Ashen Reef survey anchorage to Starfall Port is:

- **4 travel ticks**;
- **no monetary fare**;
- available because the player legitimately accepted the civic contract and reached the authorized Ashen survey route;
- a return to the already canonical Starfall settlement context, not a new discovery or Geographic Knowledge grant.

The implementation must not encode these terms as a universal fixed cost for traveling to Starfall from every origin.

The owner-contract decision must select the narrowest safe route authority for the **Ashen Reef → Starfall Port** return leg or a compatible origin/destination route model. The existing destination-only travel table must not be extended in a way that accidentally implies the same four-tick/no-fare journey from unrelated settlements or future origins.

Return travel may reuse the established travel risk/body-state machinery where compatible, but this decision does not prescribe the technical owner.

## 6. Submission And Payment Timing

Submission is **immediate** at the Starfall Harbormaster's Office once all readiness conditions are satisfied.

There is no later clerical-review wait state for this first contract.

One accepted submission must atomically cause the authorized completion consequences:

1. validate the quest is active and the retained Soundings evidence is complete and semantically valid;
2. validate the player is in the accepted Starfall return/submission context;
3. accept the submission exactly once;
4. mark **Soundings of Ashen Reef** completed/turned in;
5. pay **5 gold**;
6. append the durable Chronicle/history consequence;
7. clear or transition the survey operation/current activity only as required by the owner contract;
8. leave the player able to continue ordinary play.

Duplicate/retry delivery must not pay twice, complete twice, erase retained survey evidence, or create conflicting Chronicle consequences.

## 7. Explicit Rejection Of Legacy Turn-In Authority

The existing legacy Ashen turn-in behavior in `apps/rpg-ui/src/game-shell/gameplayLoop.ts` is not canonical authority for this contract.

Specifically, do not promote its:

- Saltmere submission requirement;
- `5g 8s` payment;
- Harbor Office standing award;
- reputation/fame award;
- extra General Lore gain;
- direct snapshot mutation pattern;
- legacy activity/notification/Chronicle wording.

It may be used only as source characterization when planning removal, bypass, or replacement.

## 8. Accepted Product Boundary

The first bounded completion package therefore needs only:

- reachable Ashen Reef → Starfall Port return;
- authoritative readiness from retained Soundings evidence plus return context;
- one accepted submission;
- quest completion;
- 5-gold payment;
- durable Chronicle/history record;
- correct projection/cleanup;
- retry/restart/persistence safety.

It does not require:

- inventory instances;
- a survey-packet item;
- a named NPC;
- persistent-person promotion;
- standing/reputation systems expansion;
- service unlocks;
- salvage mechanics;
- a recurring quest framework;
- a generic quest reward framework;
- a general travel-system rewrite.

## 9. Required Successor

Install and execute the separate unversioned:

**Quest Turn-In Completion And Consequence Receipt Owner Contract Decision**

That decision must establish the smallest authoritative technical contract for:

- bounded Ashen Reef → Starfall Port return ownership;
- submission readiness over retained survey evidence and return context;
- command/request identity;
- completion occurrence/result identity;
- typed authorized payment and other completion consequences;
- atomic accepted-only state application;
- wallet ownership/consumption of authorized payment consequences;
- quest journal/tracking, survey operation, current-activity and Chronicle projections;
- duplicate, retry, stale, conflict and malformed-evidence rejection;
- nested survey-evidence preservation;
- save/restart/publication behavior;
- real caller/UI ownership and legacy-bridge retirement or bypass;
- focused implementation and independent acceptance boundaries.

The owner-contract decision does not itself authorize implementation.

No `DEV-0.7.1` or game-version increment is allocated by this authored decision. `GAME_VERSION` remains `0.1.0-prealpha`.
