# World Command vs Management Operation Boundary Decision

Date: 2026-10-20  
Status: **documentation-only architecture decision; implementation not authorized**.  
Extends the contextual player-command package. The active Ordinary Combat Basic Action Selection Repair remains unchanged.

## 1. Decision

The contextual command system is for things the player character **does in the world** or **does directly with another world entity**.

Administrative configuration of entities the player controls belongs primarily to dedicated management UI and is not required to become a player-world command.

This separation keeps Home / Current Situation focused on immediate play rather than turning every mutable field in the simulation into a verb.

## 2. World command

A **world command** is normally one or more of:

- a physical action performed by the character;
- movement or traversal by the character;
- use of an item, tool, station, vehicle or environmental feature;
- an immediate social interaction with another character/entity;
- a transaction or service interaction with a present/available counterparty;
- a direct order issued to a present or actively controlled subordinate/unit;
- an action that begins or advances a character-owned activity;
- an action whose immediate legality/risk/cost/result is revalidated by a gameplay owner.

Examples:

- Cross Bridge;
- Gather Reeds;
- Forge Blade;
- Eat Bread;
- Talk to Guard;
- Joke with Innkeeper;
- Flirt with Companion;
- Ask Merchant About Prices;
- Buy;
- Pay Toll;
- Request Healing;
- Apply to Guild;
- Accept Contract;
- Report for Work;
- Start Shift;
- Cast Spell;
- Attempt Mastery Trial;
- Order Squad to Fall Back during an active crisis/combat context.

A command may open a real target/method/quantity choice before execution.

## 3. Management operation

A **management operation** changes the configuration, policy, assignment or administration of an owned/controlled system without representing a discrete immediate physical/social act by the player character.

Examples include:

- business staffing;
- payroll configuration;
- production priorities;
- business budgets and ledgers;
- property tenancy/access configuration;
- construction/project planning;
- routine building upgrades;
- crew assignments;
- work rosters;
- shift schedules;
- dispatch planning;
- cargo allocation for autonomous shipments;
- personnel assignment;
- standing military orders;
- settlement policies;
- edicts;
- recurring work policies;
- guild administration;
- household/family administration;
- routine subordinate task assignment;
- selecting displayed titles, tracked skills or other UI preferences.

These belong in specialized surfaces such as:

- Business;
- Property;
- Personnel;
- Crew;
- Work Roster;
- Dispatch Board;
- Ledger;
- Policy / Edicts;
- NPC card;
- Unit / Formation;
- Guild administration;
- other domain-specific management views.

A management operation may still have costs, timing, legality and simulation consequences. Its classification here concerns **interaction surface**, not importance.

## 4. Management entry points are navigation, not gameplay commands

Home or a selected entity may expose a concise entry such as:

- Manage Workshop;
- Open Personnel Roster;
- Review Property;
- Crew Assignments;
- Open Ledger;
- Manage [NPC];
- Unit Orders;
- Policies / Edicts.

These are navigation affordances into a management surface. They should not be logged, persisted or treated as player-world commands merely because they appear beside commands.

The management screen may then issue domain-owned management mutations.

## 5. Character interaction can bridge into management

When a specific person is selected, their interaction surface may contain both immediate social actions and an authorized management entry.

Example:

```
Talk to Mara
Joke
Ask About Work
Give Item
Give Direct Order
Manage...
```

`Manage...` may open an NPC/personnel card containing:

- role;
- assignment;
- schedule;
- equipment policy;
- wages;
- permissions;
- training plan;
- crew/unit membership;
- other authorized administrative fields.

Changing those fields is management. Saying `Take the wounded inside now` during a crisis is a direct social/order command.

## 6. Leadership boundary

Leadership skills are normally capability modifiers, not commands.

### Direct command

Use a world command when the character issues an immediate order in an active situation:

- Fall Back;
- Hold Formation;
- Focus Target;
- Evacuate the Building;
- Man the Pumps;
- Close the Gate;
- Carry the Wounded;
- Put Out the Fire.

The current authored command-style combat abilities such as `Press the Attack`, `Hold Formation`, `Focus Target` and `Fall Back` are examples of this shape.

### Policy / standing instruction

Use management UI for:

- standing rules of engagement;
- patrol priorities;
- staffing levels;
- default crisis procedure;
- automatic evacuation policy;
- work priority;
- convoy escort policy;
- ration policy;
- production policy;
- recurring schedules;
- edicts.

An active crisis may offer either:

- execute an immediate direct order now; or
- open the relevant policy/management surface to change automated behavior.

Those are related but not the same operation.

## 7. Personnel, crew and dispatch boundary

Routine assignment belongs to management:

- assign worker to station;
- assign sailor to watch;
- assign crew role;
- schedule shift;
- attach escort to caravan;
- allocate cargo;
- select autonomous route;
- dispatch subordinate expedition;
- reassign employee;
- set work priority.

If the player is physically leading the activity, the eventual world command is the character's own action:

- Depart;
- Travel;
- Board;
- Sail;
- Lead Caravan;
- Begin Shift;
- Operate Station.

If the character directly tells a present subordinate to perform an immediate task, that can be a social/order command, but the resulting task state remains owned by the personnel/work/activity domain.

## 8. Promoted contextual shortcuts

A concrete sub-action may be promoted to the first contextual level when:

- the target and intent are already obvious from the scene;
- the action is frequent or time-sensitive;
- showing the parent interaction first adds little useful choice;
- the same authoritative command remains reachable through the deeper interaction.

Example:

At a controlled toll bridge with a visible toll official, the UI may show:

- Pay Toll;
- Talk to Toll Collector;
- Turn Back.

`Pay Toll` is a **promoted contextual shortcut** to the same transaction that may also appear under:

`Talk to Toll Collector → Pay Toll`.

The shortcut must not create a second command identity, result path, price calculation or owner.

Other likely examples:

- Board Ferry;
- Buy Ticket / Passage;
- Request Healing;
- Rent Room;
- Turn In Contract;
- Pay Dues;
- Present Papers;
- Open Gate if authorized;
- Ask for Work;
- Trade;
- Train.

Promotion is a presentation/ranking decision only.

### 8.1 Clerk, station, listing and crafter routing

The [interaction endpoint and contract-station routing decision](contextual-interaction-endpoints-and-contract-station-routing-decision.md) specifies which **selected entity** ordinarily carries each stage. A guild clerk provides membership/dues/eligible guild services and reports; selecting an observed contract board, desk or posting counter opens **Browse Contracts by default**; selecting a listing/card provides **Accept Contract** under its offer owner; completion is reported to an authorized clerk or designated recipient. Merely browsing a board/card is read-only presentation, not an additional gameplay command. Do not create `Talk -> Services -> Contracts -> Browse` and `Use Board -> Browse` as redundant paths.

`Commission Work` belongs to an interaction with the actual crafter or an authorized crafting-guild brokerage counter. It is not synonymous with the player's own `Craft` action, and a posted contract/commission request is not automatically the same provider-order operation. Service/order/transaction owners must authorize any real quotation, deposit, order, delivery or settlement.

A promoted clerk shortcut, contract card action or domain-panel action invokes the *same owner command* that would be reached through a deeper conversation. The observable board, clerk and offer must have owner-grounded presence and identity; descriptions alone cannot instantiate them.

## 9. Social action architecture

A selected NPC/person may expose several social-action families. These are future presentation vocabulary, not proof of current social execution.

### Conversation / information

- Greet;
- Talk;
- Ask / Inquire;
- Ask About [topic];
- Ask Directions;
- Ask About Work;
- Ask About Rumors / News;
- Tell / Inform;
- Report;
- Discuss;
- Request Explanation;
- Request Introduction.

### Friendly / expressive

- Joke;
- Tease, where socially appropriate;
- Compliment;
- Thank;
- Congratulate;
- Encourage;
- Comfort / Console;
- Apologize;
- Offer Help.

### Affection / romance-facing

- Flirt;
- Express Interest;
- Court / Invite on an outing only after a dedicated relationship/romance owner exists.

Flirt is a social act, not automatic romance progression. Relationship, consent, memory, familiarity and consequences require future social runtime authority.

### Influence / negotiation

- Persuade;
- Negotiate;
- Bargain;
- Request Favor;
- Appeal;
- Bribe only after transaction/law/social consequence ownership exists;
- Intimidate / Threaten only after social/consequence ownership exists.

Skills such as diplomacy, negotiation, authority or reputation may modify these actions. Possessing the skill does not mint the command.

### Hostile / provocative social action

- Insult;
- Mock / Taunt;
- Provoke;
- Challenge;
- Accuse;
- Threaten.

These require a social/consequence owner before executable exposure.

### Exchange / relationship action

- Give / Offer Item;
- Offer Payment;
- Trade;
- Hire;
- Recruit / Invite;
- Dismiss / Release;
- Ask to Follow / Accompany;
- Request Service;
- Request Training;
- Request Aid.

Actual party, employment, transaction, service and relationship owners retain execution authority.

### Direct orders

For a subordinate, follower, employee, crew member or unit under current authority:

- Give Order;
- Warn;
- Rally;
- Direct Crisis Response;
- Command Tactical Action.

Routine assignment remains management.

## 10. Social action presentation

`Talk` is not required to be a mandatory parent menu for every social interaction.

Use either:

### Entity-first interaction

```
Talk to Toll Collector
  Ask About Road
  Pay Toll
  Ask About Alternate Route
```

or a promoted scene action:

```
Pay Toll
Talk to Toll Collector
Turn Back
```

depending on scene clarity and ranking.

Likewise a guild clerk may expose `Apply to Guild` directly while `Talk` still provides broader conversation.

A merchant may expose `Trade` directly while conversation remains separate.

This preserves quick play without flattening every NPC into one generic Talk submenu.

## 11. Domain examples reclassified

| Domain | World commands | Management UI |
| --- | --- | --- |
| Business | physically inspect site, perform work, buy/sell as character, collect/move goods when physically modeled | staff, payroll, budgets, pricing policy, production priority, upgrades, recurring supply policy, ledgers |
| Property | enter, inspect, repair, build when personally performed, use/store items | tenancy, permissions, planned improvements, maintenance policy, leases, project administration |
| Employment | ask for work, apply, accept, report, start/perform/end shift, collect pay | employer-side roster, schedule, wages policy, staffing |
| Crew | board, sail/row/pilot, direct immediate order | crew assignments, watches, payroll, berth roster, routine duty schedule |
| Logistics | personally load/unload, travel/lead caravan, deliver cargo | dispatch, route plan for autonomous transport, cargo assignment, recurring convoy policy |
| Leadership | immediate crisis/tactical order | policy, edict, standing order, staffing, routine coordination |
| Guild | apply/pay dues/report at an eligible clerk; undertake required trial at its real target; select a posted offer card to accept; request authorized guild services | guild administration, officer rosters, policy, treasury, facility planning |
| Crafting | personally craft/process/repair/operate at a station; commission an eligible crafter or authorized guild broker through a separate order/service owner | owned-workshop production queue/priorities and workforce administration |
| Farming | personally plow/sow/water/harvest/tend | crop plan, field assignment, labor roster, recurring husbandry policy |
| Social | talk, joke, flirt, apologize, persuade, give, request, threaten, direct order | relationship/personnel card configuration only where a domain explicitly supports administrative settings |

## 12. Home / Current Situation consequence

Home should prioritize:

- immediate world commands;
- direct interactions;
- urgent direct orders;
- a small number of useful promoted shortcuts.

Management should normally appear as a secondary navigation affordance:

- Manage Workshop;
- Personnel;
- Property;
- Crew;
- Ledger;
- Policies.

Home must not become a business-management dashboard merely because the character owns assets.

## 13. Owner boundary

This decision creates no executable social, relationship, romance, employment, membership, property, business, personnel, policy, law or service owner.

The approved NPC/social boundary remains controlling:

- canonical person identity;
- NPC presence/interactable overlay;
- dialogue content;
- relationship links;
- social runtime/memory;
- service execution;
- local favorability/standing;
- companion/party state

remain separate owners and may be implemented only through later bounded decisions.

The command architecture may reserve presentation families now while remaining fail-closed until those owners exist.
