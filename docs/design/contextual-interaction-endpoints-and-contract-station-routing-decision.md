# Contextual Interaction Endpoints and Contract Station Routing Decision

Date: 2026-10-20  
Status: **documentation-only clarification; no implementation, new identity/schema, or gameplay mutation authorized**.  
Extends the contextual player-command package, especially [world commands versus management](world-command-vs-management-operation-boundary-decision.md), [quest issuer and offer architecture](quest-offer-issuer-and-arc-architecture-consolidation.md), and [quest/contract board ownership](quest-event-chronicle-authority-boundary-decision.md). The installed Ordinary Combat Basic Action Selection Repair and Game version route are unchanged.

## 1. Decision: actor, station, listing, then owning operation

Contextual interactions are **anchored to the relevant observed person, station, or offer/listing**, not to a nested global menu of all prospective verbs.

- **Person/service counter:** select a reachable guild clerk, artisan/crafter, employer, or authorized representative. Conversation and supported services appear together, with direct/promoted shortcuts where useful.
- **Station:** select an actual available contract board, notice board, desk, counter, or other provider-controlled posting surface. Its **default interaction is Browse Contracts**, opening the list of offers the character can currently inspect. Do not force `Use Board -> Services -> Contracts -> Browse`.
- **Listing/card:** selecting a real visible offer opens the contract detail/card. **Accept Contract** belongs on that card, and calls the existing or future quest/contract acceptance owner. It is not a duplicate board command or a generic `Accept` attached to every guild.
- **Turn-in representative:** **Report Contract Completion / Turn In Contract** is a contextual interaction with an authorized clerk, issuer delegate or explicitly designated recipient when the contract allows it. It validates active contract, evidence/delivery, location, status, and reward/receipt through the same owning quest/contract lifecycle. Merely returning to the board or opening a completed card does not settle it.
- **Commission provider:** request/arrange commissioned work directly with a reachable crafter, or through a crafting guild's authorized counter/broker. Opening a workshop or guild description does not itself create an order. A commission solicitation posted as a contract is an explicit, separately owned offer path, not an automatic alias for a crafter order.

An advertised action requires owner-grounded actor/target and current availability. Descriptive `civilization.guilds`, `civilization.services`, building tags, workplace roles, quest contact strings, or a decorative board/desk do not prove a live clerk, craftsperson, station or executable operation.

## 2. Guild clerk as the ordinary membership/service entry

When an authorized guild clerk is present, interactions such as **Apply/Petition**, **Pay Buy-In**, **Pay Dues**, **Inquire About Membership or Benefits**, **Request Apprenticeship**, **Request Guild Service**, **Request Arbitration**, **Submit Work for Review**, **Resign**, and **Report Guild Contract** normally live on that clerk's conversation/service surface. Show only actions justified by the character's membership, available institutional functions and the relevant owners. A required physical trial, workshop use, or direct negotiation may instead route to its actual examiner, workstation or craftsperson.

`Talk to Clerk` may open the broader interaction. An immediately useful `Apply to Guild`, `Pay Dues` or `Report Contract` may be promoted beside it; promotion changes **only UI placement**. No compulsory `Talk -> Guild -> Services -> Membership -> Pay` ladder, second command ID or duplicated membership/payment resolver.

A guild hall alone is not a universal service NPC. Without a present/authorized clerk or explicitly owner-provided remote/counter channel, clerk-dependent services remain unavailable or informational.

## 3. Posted-contract flow and identity

Illustrative future flow (no claim of current playability):

```text
Observed Contract Board / Notice Desk
  -> Browse Contracts [default station view; read/query only]
  -> Select posted offer [open contract card]
  -> Accept Contract [one quest/contract owner's command, with admission/recheck]
  -> Undertake work [owner-specific objectives/progress]
  -> Talk to authorized guild/issuer clerk or designated recipient
  -> Report Completion [owner checks proof/delivery, validates turn-in]
  -> Settlement/Claim Reward [only as the owner actually supports]
```

**Browse**, filter, sort, inspect, open or close a contract card are presentation/read interactions, not world-state commands by default. If reading a protected ledger, acquiring information, or registering a notice materially changes world/knowledge state, that requires a **separate explicitly owned discovery/access action**; ordinary Browse must not silently do it. Clicking a station may open its default browse view directly with no extra `Use` confirmation.

The board/counter/desk is the *presentation endpoint*, the displayed entry is an *offer instance*, and the contracting guild/person/institution is the *canonical issuer* where established. Multiple boards, clerks, and shortcut paths may present one eligible offer without multiplying definitions, offers or acceptance receipts. Respect separate quest definition, template, runtime offer, active quest, completion and consequence ownership. Use stable owner references and offer/attempt/request identity where those owners supply it, **never UI labels or an invented universal station ID**.

Acceptance is possible only for an owner-provided visible offer after current eligibility, capacity, availability/expiry and head/attempt checks. Reopening cards or retrying acceptance cannot award duplicated obligations or rewards. Reporting is a **distinct lifecycle stage**, not an alternative means of acceptance and not automatic on the UI's local `complete` display. A clerk's ability to receive reports must be grounded in the offer/issuer and current local presence, not inferred from the word `clerk`.

## 4. Crafting commission flow

**Commission Work** means the character asks another provider to supply work or goods, not that the character performs `Craft` at a station. A directly selected crafter may allow discuss specification, request quote, negotiate terms, place/confirm order, pay/deposit, inquire about progress, collect work and resolve dispute if future owners support each stage. A crafting guild may provide brokerage, a masterwork-review service, or an authorized commissioned-work desk, but cannot silently become the artisan, item producer, transaction owner or obligor.

A posted request for a crafter to undertake work (contract listing) and a customer placing an order with a crafter are **different workflows** even if the wording resembles a commission. Preserve actual counterparty, work specification, deadline, access/permissions, quote, material ownership, deposit/escrow, process, delivery, cancellation/refund, receipt and fulfillment authority only where separately accepted. Do not mint `Accept Commission` as an independent guild/world command without an owning offer or order instance.

## 5. Presentation and non-duplication rules

| Selection / surface | Default result | Executing owner (future unless already accepted) |
| --- | --- | --- |
| Guild clerk/NPC card | Conversational and eligible guild-service choices; shortcut permitted | Membership, payment, service, employment, or quest/contract owner per action |
| Contract board, posting counter, desk | **Browse Contracts** read view; filter/select listing | Board/service/offer **projection**, not a universal Browse mutation |
| Contract card/listing | Details, requirements, reward preview, **Accept Contract** where eligible | Canonical quest/contract offer acceptance owner |
| Authorized clerk/recipient with accepted work | **Report Completion** where evidence/turn-in is eligible | Quest/contract completion, delivery, receipt and consequence owners |
| Crafter/NPC | Discuss/order/commission service, with optional direct shortcut | Crafting-order/provider, transaction, inventory and fulfillment owners |
| Crafting guild broker/counter | Brokerage/commission service, member gates where required | Service/transaction/order owners; guild is not automatically the crafter |
| Workshop/forge station | Personally craft/repair/process when eligible | Player craft/process attempt and item/station owners |
| Guild officer's administrative view | Guild roster/treasury/policy/facility navigation | Management UI and guild administration, not world-command list |

One underlying operation may be exposed from a contextual shortcut, person dialog, selected card, journal or owning domain panel. These entry points must resolve to the **same concrete command+target+method and authoritative result path**. Do not add `Browse Contracts`, `Accept Contract`, `Pay Dues`, `Report Contract` or `Commission Work` as redundant first-level and nested commands merely to cover all possible UI hierarchies. A first-level action exists only if selecting it immediately advances a real interaction or presents a necessary choice. Avoid one-item submenu ladders.

## 6. Implementation and acceptance gates

This is **routing and presentation architecture**, not executable authority. Before any new clerk/station/contract/order behavior becomes playable: prove observable identity and local reachability; authority/delegation of presenter versus issuer; board/listing/offer identity and visibility; owner-supplied eligibility/price/consent; unique command route from every entry; accepted/rejected/retry admission; durable active obligation/attempt/receipt where applicable; evidence-based completion/settlement; consequences, inventory and payment ownership; and save/restart fidelity. Preserve existing quest Accept, Soundings Submit and generic Turn In limitations; do not silently elevate the generic bridge to a durable contract-completion owner.

The first Home implementation still uses **currently executable commands only**, after the installed combat repair, independent acceptance and separate Game-version decision. No new NPC, guild, service, crafting, contract or commission capability, schema, Game version, production source, or Codex work is approved by this clarification.
