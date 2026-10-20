# Contextual Command Domain Census And Expansion Plan

Date: 2026-10-20
Status: **documentation-only command census and architecture expansion; implementation not authorized**.
Source head: `c7e8d4b45142250ade264d6e0a588eca700026c5`.

This plan extends the contextual player-command architecture after a repository-wide census of guilds, workplaces/jobs, crafting, skills/progression, magic, Knowledge, services/buildings, economy, institutions, religion, NPC/social planning, property/business planning and the current UI/runtime.

The active **Ordinary Combat Basic Action Selection Repair** remains the executable route. This document does not replace it.

## 1. Census rule

The repository contains many systems at different maturity levels. Keep these states distinct:

| State | Meaning |
| --- | --- |
| **Executable selected command** | A real player-facing control reaches a current mutation owner. |
| **Existing UI bridge** | The UI mutates current snapshot/state, but the durable owner boundary is still weaker than the desired command architecture. |
| **Read-only resolver/projection** | Engine/source logic can calculate availability, price, craft estimates, institution presence or other facts but cannot execute the player action. |
| **Authored capability/intent** | Content describes guild rights, jobs, recipes, services, skills, contracts or facilities without current player mutation authority. |
| **Planned owner** | Accepted design has identified the future owner/contract but no live executable path exists. |
| **Missing owner** | A verb would require new identity, lifecycle, attempt, access, payment, NPC, membership, item-instance or other authority before it can be exposed as gameplay. |

Content existence must never be used as evidence that a command is playable.

## 2. Current command baseline

The existing-command Home slice remains appropriately narrow.

Currently executable or selected-path commands include, at bounded scope:

- Travel to known supported destinations;
- Explore nearby environs;
- Approach an accepted nearby encounter candidate;
- owner-listed combat actions;
- Continue combat;
- settlement Rest;
- quest Accept;
- quest Track / Untrack;
- accepted Soundings Submit;
- current generic quest Turn In bridge;
- Equip / Unequip through the Character bridge;
- Use Consumable through the Character bridge.

UI-local convenience such as tracked-skill flags and item favorites is not world gameplay authority.

Current title, standing, reputation, guild, employment, business, crafting, market, recipe, military and naval surfaces are largely presentation/projection ahead of executable commands.

## 3. Repository capability evidence

The census found substantial authored structure that should shape future commands:

- **18 guild identities** spanning mercantile, martial, gathering, logistics, crafting and civic roles;
- guild policy includes entry methods, requirements, benefits, obligations, contract types, quest boards and tiered facility/service tags;
- **58 workplaces**, **208 workplace job rows** and **110 unique job ids** across extraction, processing and manufacturing;
- **28 authored recipes** across baking, preserving, leatherworking, tailoring, milling, metalsmithing, woodworking, assembly, cooperage and forging;
- **22 extraction-method records** including river netting, woodland foraging, trapping, mining, quarrying, brine evaporation, river dredging, orchard/vineyard tending and mixed-plot farming;
- **121 skills** across resource, survival, combat, magic, crafting, knowledge, settlement and leadership;
- **4 current skill/mastery trial records** with a broader accepted trial/study architecture planned;
- **55 spells** and **32 abilities**, with compatibility/readiness varying by record;
- **5 provider-independent service identities**: Lodging, Market Exchange, Warehouse Storage, Archives and Contract Board;
- **22 building templates** with service functions including lodging, markets, storage, archives, clinic, hygiene/laundry, guild hall, contract board, port/ferry handling, garrison and work/storage functions;
- descriptive magic-service infrastructure for field healing, utility enchantment, religious rites and affinity binding;
- deep economy, route, resource, institution and settlement projections that remain read-only or simulation-owned.

These facts justify command-family planning. They do not authorize runtime behavior.

## 4. Missing command families and lifecycle verbs

### 4.1 Guild and institutional participation

Potential contextual commands:

- View / Inspect Guild Presence
- Browse Guild Board
- Apply / Petition to Join
- Pay Buy-In where authored
- Attempt Entry Task / Trial
- Complete Probation / Sponsorship requirement
- View Membership Obligations
- Pay Dues / Fees
- Fulfill Guild Obligation
- Leave / Resign
- Browse Guild Contracts
- Accept Guild Contract
- Report / Submit Guild Contract
- Use Member Service
- Rent / Reserve Shared Facility
- Lease Storage / Warehouse Space
- Request Financing / Credit
- Request Arbitration / Brokerage
- Request or Exercise Licensed Rights such as fishing/mining/market access
- Begin Apprenticeship / Training
- Submit Work for Inspection / Masterwork Review
- Commission Work
- Offer Goods through Member Sale / Exchange

**Gate:** guild identity and local presence are not enough. Actual membership, affiliation/rank, dues, contract, provider/service, payment/access and attempt owners must exist first.

The canonical guild boundary explicitly says descriptive `membershipModel` policy does not establish current membership, rank, dues, standing or access.

### 4.2 Employment and workplace lifecycle

Potential contextual commands:

- Browse Available Work
- Inspect Job / Shift / Work Order
- Apply for Work
- Accept Job / Shift / Work Order
- Report for Work
- Start Shift / Start Work
- Perform / Advance Work
- Pause Work
- Resume Work
- Abandon / Cancel Work
- Complete / Report Work
- Collect Pay
- Deliver Required Inputs
- Collect Produced Output
- Use / Rent / Reserve Workplace
- Inspect Work Output
**Management boundary:** employer-side role assignment, worker assignment, shift scheduling, wage policy, staffing and labor coordination belong in Personnel / Work Roster / Business management surfaces rather than the character's world-command list.

**Gate:** workplace job ids are nested role vocabulary, not employee records. A future employment/work owner needs actor, employer/workplace, assignment, schedule, pay, attempt/progress, interruption, completion and payout authority.

### 4.3 Crafting and production lifecycle

Potential contextual commands:

- Browse Applicable Recipes
- Select Recipe / Variant / Method
- Select Inputs
- Select Tools / Station / Fuel
- Start Craft / Process / Assembly
- Continue / Advance Process
- Pause / Resume Process
- Cancel Process
- Collect Output
- Repair
- Maintain
- Refine / Process Material
- Preserve / Smoke / Dry / Bake / Cook
- Salvage / Disassemble where a future recipe/process owner supports it
- Commission Crafting
- Submit Work for Quality / Masterwork Review
- Inspect Result / Quality
- Learn / Study Recipe only after recipe-knowledge ownership exists

Existing `resolveCraftAtSettlement(...)` is an estimate, not a craft command. Recipe existence does not consume inputs or create outputs.

### 4.4 Resource discovery and extraction

The skills and extraction catalogs make the following families explicit future candidates:

- Spot Resource
- Identify / Classify Resource
- Prospect
- Gather
- Forage
- Harvest
- Cut / Fell / Collect Fuel
- Mine
- Quarry
- Dig Clay / Peat
- Dredge Sand / River Material
- Collect / Evaporate Brine or Salt
- Fish / Net
- Hunt
- Track
- Trap
- Butcher / Dress
- Tend Hive
- Tend Orchard / Vineyard
- Tend Pasture / Herd
- Farm / Reap
- Collect Water

These should resolve through **observed resource instance + method + actor capability + access + time + local conditions**, not through skill ids or biome names as commands.

### 4.5 Skill advancement, training and trials

Skills are usually modifiers, not buttons. Explicit advancement sources may nevertheless create real contextual commands:

- Review Skill Progress
- Track / Untrack Skill as UI preference
- Practice Skill when a bounded practice owner exists
- Train with Teacher
- Train at Institution / Guild
- Begin Apprenticeship
- Attempt Breakthrough
- Attempt Mastery Trial
- Continue Trial
- Choose Trial Checkpoint Option
- Recover from Trial Failure
- Retry after Cooldown

**Gate:** current progression helpers/trials are not a complete attempt owner. Trial visibility does not equal attempt authority, and generic repeated practice must not become a free XP button.

### 4.6 Knowledge, study and research

Potential commands:

- Observe / Spot
- Inspect
- Identify / Classify
- Study
- Read
- Consult Records / Archives
- Compare / Analyze evidence
- Survey / Record Observation
- Attempt Knowledge Trial
- Ask Teacher / Expert
- Research at eligible institution

Knowledge access, document ownership or archive presence does not imply successful study or knowledge completion. Hidden information must remain protected.

### 4.7 Magic and supernatural interaction

Potential commands where the appropriate known-spell/study/effect owner exists:

- Cast Spell
- Use Ability
- Study Spell
- Self-Study from Text
- Learn from Teacher
- Institutional Study
- Supervised Ritual Study
- Study Discovered Record / Artifact
- Attempt Study Checkpoint
- Recover / Retry Study
- Request Magical Service
- Request Field Healing
- Request Enchantment / Binding / Attunement
- Participate in Ritual
- Stabilize / Dispel / Attune / Commune only when a specific effect/consequence owner exists

The accepted magic boundary remains strict: access source -> study event -> acquisition evidence -> known spell -> cast readiness. A scroll, teacher, institution or magic-service record is not itself spell knowledge or execution.

### 4.8 General services and facilities

A location/provider may later expose concrete verbs such as:

- Book / Rent Lodging
- Stay / Sleep
- Store Goods
- Retrieve Goods
- Rent Storage
- Browse Market
- Request Quote
- Use Contract Board
- Consult Archives
- Request Treatment
- Bathe / Launder
- Use Ferry / Port Handling
- Reserve Berth
- Stable / Yard / Haulage service
- Rent / Reserve Workspace
- Request Inspection / Appraisal
- Pay Toll / Fee / Customs
- Request Permit / Charter / Lease

**Gate:** `civilization.services` is provider-independent vocabulary only. Every executable service needs provider, place, availability, access, price/payment, result and persistence authority.

### 4.9 Market, trade, commissions and logistics

Future command lifecycle:

- Browse Goods
- Inspect Offer
- Request Quote
- Buy
- Sell
- Barter
- Reserve Offer
- Place Order / Commission
- Cancel Order where permitted
- Collect Order
- Offer Goods for Sale
- Create Shipment / Caravan
- Assign Cargo
- Select Route
- Assign Vehicle / Animals / Crew
- Dispatch
- Track Shipment
- Receive / Unload / Deliver
- Settle Payment

Market prices, settlement demand, routes and transport profiles are inputs, not transaction authority.

### 4.10 Business, property and management

Business and property administration are **not ordinary world-command families**.

The character may still perform physical or direct-interaction actions involving owned assets:

- Inspect Site / Property;
- Enter / Exit;
- Repair or Build when personally performing the work;
- Store / Retrieve / Move goods when physically modeled;
- personally Buy / Sell / Deliver;
- collect a physical payment or item where a domain explicitly models that interaction.

Administration belongs in dedicated management UI:

- staffing and personnel;
- wages / payroll;
- schedules and work rosters;
- production priorities and queues;
- budgets and ledgers;
- pricing or restock policy;
- storage policy;
- tenancy / permissions;
- leases;
- upgrade planning;
- maintenance policy;
- farm plans;
- project administration;
- routine revenue/expense review.

Home or an asset card may expose `Manage Workshop`, `Property`, `Personnel`, `Ledger`, or similar **navigation affordances**. Opening those surfaces is not a world command and should not be persisted as gameplay history.

If the player changes business/property state through a management panel, that mutation remains domain-owned and may still have cost, timing, contracts, location or authority gates.

### 4.11 Social, NPC and party interaction

Social actions deserve a richer vocabulary than a single generic `Talk` command.

**Conversation / information**
- Greet / Talk
- Ask / Inquire
- Ask About a visible/known topic
- Ask Directions
- Ask About Work
- Ask About Rumors / News
- Tell / Inform / Report
- Discuss
- Request Explanation / Introduction

**Friendly / expressive**
- Joke
- Compliment
- Thank
- Congratulate
- Encourage
- Comfort / Console
- Apologize
- Offer Help

**Affection / romance-facing**
- Flirt
- Express Interest
- Court / Invite only after dedicated relationship/romance authority exists

Flirting is a social act, not automatic romance progression.

**Influence / negotiation**
- Persuade
- Negotiate / Bargain
- Request Favor
- Appeal
- Bribe only after transaction/law/social consequence ownership exists
- Intimidate / Threaten only after consequence ownership exists

**Provocative / hostile social**
- Insult / Mock / Taunt
- Provoke
- Challenge
- Accuse
- Threaten

**Exchange / relationship**
- Offer / Give
- Offer Payment
- Trade
- Hire
- Recruit / Invite
- Dismiss / Release
- Ask to Follow / Accompany
- Request Aid
- Request Service
- Request Training

**Immediate subordinate order**
- Give Order
- Warn
- Rally
- Direct Crisis Response
- Command Tactical Action

Routine role assignment, schedules, wages, crew slots and other personnel configuration belong in management UI. A selected subordinate may offer a `Manage...` navigation entry that opens their personnel/NPC card; that entry is not itself a gameplay command.

Canonical People/NPC identity and social mutation remain deferred. Do not infer executable NPCs from quest contact strings, workplace roles or prose.

### 4.12 Leadership, settlement and civic actions

Skills such as administration, logistics, agriculture, ranching, production management, trade, command, diplomacy, stewardship and labor coordination are usually **capability modifiers**, not buttons.

Use **direct world commands** for immediate leadership acts in an active situation:

- Command Formation / Unit;
- Rally;
- Warn;
- order Fall Back / Hold / Focus where the unit owner supports it;
- Respond to Crisis with a concrete immediate order;
- Negotiate Agreement through an actual counterparty interaction.

Use **management UI** for:

- Coordinate Labor as routine staffing;
- Assign Work;
- Set Priority;
- Organize autonomous convoy/dispatch;
- Manage Supplies as policy;
- standing orders;
- settlement/business policy;
- edicts;
- patrol policy;
- staffing;
- property/enterprise administration.

A crisis may permit both an immediate order and a policy/edict change. They are separate interaction classes.

Authority must come from party/unit/employment/property/office/settlement ownership, not from having the skill.

### 4.13 Religion and ritual

Potential sacred-site/provider actions:

- Observe Shrine / Sacred Site
- Pray / Worship
- Make Offering / Donation
- Request Blessing
- Request Healing
- Request Oath Rite
- Request Funerary Rite
- Participate in Seasonal Ritual
- Study Doctrine / Records
- Seek Religious Instruction
- Join / affiliate with an order only after membership authority exists

Current religion, sacred-site and hotspot content explicitly has no command/access/reward behavior. These remain future service/social/ritual owners.

### 4.14 Identity and progression management

Some player-state actions are legitimate but should not be mistaken for world affordances:

- Track / Untrack Skill
- Favorite / Unfavorite Item
- Select / Display Title if a durable owner is later exposed
- Manage tracked quest
- Manage equipment
- Review standing/reputation/renown
- Review discoveries

These belong to management/UI context. They normally should not occupy Home's primary world-action slots.

## 5. Promoted contextual shortcuts

A concrete sub-action may be promoted to Home/current-situation level when the target and likely intent are already obvious, while preserving the exact same authoritative command reachable through the deeper interaction.

Examples:

- `Pay Toll` beside `Talk to Toll Collector`;
- `Board Ferry` beside `Talk to Ferryman`;
- `Request Healing` beside `Talk to Healer`;
- `Apply to Guild` beside `Talk to Guild Clerk`;
- `Pay Dues` beside broader guild interaction;
- `Turn In Contract` beside issuer conversation;
- `Trade` beside merchant conversation;
- `Ask for Work` beside employer conversation;
- `Train` beside teacher conversation.

Promotion is presentation/ranking only. It must not create a second command identity, duplicate payment/result logic or bypass the interaction owner.

`Talk` is therefore **not a mandatory parent menu** for every entity action. It remains available for broader conversation while high-value context-specific interactions can be surfaced directly.

## 5. Cross-cutting lifecycle verbs

Several verbs recur across domains and should be modeled as lifecycle stages rather than separate universal command owners:

- **Browse / Inspect**: read projection before commitment.
- **Apply / Request**: asks another authority for eligibility/access.
- **Accept**: commits to an offer, assignment, quest, contract or work order.
- **Start**: creates an owner-specific attempt/activity.
- **Continue / Advance**: progresses the same durable attempt.
- **Pause / Resume**: valid only when the owner supports suspended state.
- **Cancel / Abandon**: owner-defined termination, potentially with consequences.
- **Submit / Report / Deliver**: presents completion evidence.
- **Collect / Claim**: receives already-authorized output/reward/property.
- **Renew / Extend**: optional lifecycle stage for rentals, contracts or permits.
- **Leave / Resign**: terminates membership/employment/participation.

Do **not** create one central `activity.start` or `request.accept` command. These are shared UX semantics over domain-specific commands.

## 6. Base UI action structure after the census

The first-level contextual vocabulary should remain compact.

Candidate **entry families**:

- Observe
- Move / Travel
- Interact / Use
- Talk
- Gather / Extract
- Work
- Craft / Process
- Trade / Transact
- Learn / Train
- Participate / Join
- Request Service
- Rest / Camp
- Direct / Command
- Engage / Defend

These are presentation families, not engine enums.

Examples:

- A guildhall may show `Browse Contracts`, `Apply to Guild`, `Use Guild Services`, not a permanent global Guild menu.
- A forge may show `Craft`, `Take Work`, `Rent Station`, `Commission Work` according to access and actor role.
- A teacher may show `Train` or `Study Spell`.
- A contract board may show `Browse Contracts`.
- An owned workshop may show `Manage Workshop` as a navigation affordance, not a world command.
- A selected subordinate may show immediate `Give Order` plus `Manage...` to open their personnel card.
- A sacred site may show `Pray`, `Request Rite`, or only `Inspect` until ritual/service owners exist.

Home promotes a few relevant concrete world actions and direct interactions. `More Actions` exposes the rest of the legitimate observed set. Business/property/personnel/crew/policy administration lives in Character, Activity, World or future specialized management views and does not need to masquerade as gameplay commands.

## 7. Important owner gaps before implementation

The following missing owners should be treated as architectural dependencies, not UI TODOs:

1. membership/affiliation/rank/dues;
2. employment/job assignment/pay/schedule;
3. generic durable activity attempt/progress/interruption;
4. general item-instance/container transfer authority;
5. recipe knowledge and crafting attempt/output ownership;
6. local resource-instance/depletion/discovery;
7. provider/service availability/access/payment/result;
8. market/vendor stock/offer/transaction;
9. NPC/person/dialogue/social relationship, memory, service-source and consequence authority;
10. contract/work-order lifecycle beyond current quests;
11. business/property/lease/project/staffing;
12. vehicle/vessel/cargo/crew ownership;
13. skill trial/study attempt owner;
14. magic study/acquisition and general cast/effect owner;
15. religion/ritual service/consequence;
16. law/permit/crime/enforcement where risky/illegal actions require it.

## 8. Revised sequencing

Do not insert all of these command families into the first Home implementation.

Recommended sequence remains:

1. current Basic Action Selection Repair;
2. independent ordinary encounter victory/choice acceptance;
3. separate Game-version decision;
4. Home / Current Situation over **existing commands only**;
5. Environmental Affordance Kernel;
6. first resource interaction owner;
7. first generic durable activity/work attempt owner;
8. then choose one economic/institutional vertical based on dependency value:
   - workplace employment + paid shift,
   - station crafting + durable process,
   - merchant transaction,
   - guild contract/membership,
   - or another explicitly accepted slice;
9. structural UI overhaul consumes the same contextual descriptor system throughout.

A useful progression is to prove **one full loop per owner class**, not one command per catalog:

- world/environment;
- resource/activity;
- production;
- transaction;
- institution/social;
- property/management.

## 9. Acceptance principle

A command family is not ready merely because:

- a skill with the same name exists;
- a guild promises the benefit;
- a workplace lists the job;
- a building lists a service function;
- a recipe exists;
- an engine can calculate a price or craft estimate;
- UI copy mentions the action;
- a quest giver string resembles a person or office.

Before exposure, require:

**observable context + stable target/source + actor eligibility + authoritative owner + current validation + accepted result + persistence/history contract where needed.**

That is the common command-system gate across the sandbox.
