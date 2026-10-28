# Tool Use, Hand Occupancy, Station-Supplied Equipment, and Data Expansion Plan

Date: 2026-10-28
Status: USER TOOL-USE INTENT CAPTURED; CONNECTOR DOCUMENTATION-ONLY EXPANSION PLAN; NOT LIVE DATA OR IMPLEMENTATION AUTHORITY
Game-version impact: none. Current selected gameplay, Save and native v3 activation gates remain unchanged.

## 1. Decision and purpose

The player distinguishes **assigned/equipped gear**, **physically carried inventory**, and **actually held/in-use objects**. A sheathed sword may remain the selected primary weapon without using a hand. A carried pickaxe, shovel, hammer, axe, gold pan, or other tool may be temporarily retrieved, used, and returned without displacing that primary weapon assignment. A tool provided at an accessible crafting workstation may satisfy a recipe's tool requirement just as an eligible carried tool can, when the character has authority to use it.

These are product-direction requirements, not a claim that the current gameplay supports drawing, holding, station inventory, tool wear, mining, panning, or station-side recipe execution. Preserve separate physical-item ownership, contextual command ownership, workplace access, and Save integrity. The immediate package is **data classification and a source-grounded expansion specification**, not activation of new commands.

Sources inspected: master a596112acf3945f2bf7c625e943f2511d12aa710; current unselected native v3 branch codex/native-v3-survey-four-stage at ed351578f57a6f44a257c79715b55b46c3c9617b (PR #39, stacked on native gear PR #20 onward); the accepted item/equipment/inventory, crafting, recipe/production, contextual action, and layered-loadout decisions. Do not mistake these separate branch states for an integrated mainline.

## 2. Vocabulary and orthogonal dimensions

| Concept | Meaning | Non-implication |
| --- | --- | --- |
| **Primary Weapon** (recommended UI label) | A selected/assigned weapon ready for later use, commonly sheathed or otherwise stowed | Not necessarily physically in the right hand |
| **Secondary / Off-hand Weapon or Shield** | Selected secondary equipment, with its own carrying and readiness posture | Not necessarily drawn or gripped |
| **Carried** | A unique durable instance exists in an accessible on-person container or authorized carried position | Does not require placement in a weapon slot |
| **Worn / attached / stowed** | Where the physical gear is presently located (sheathed, strapped, worn, in bag, etc.), subject to fit | Not the same as occupying a hand |
| **Held / in hand** | An actual left/right/both hand commitment during action, persistent ready stance, or intervention | Not synonymous with item class or selected weapon |
| **Station-provided** | A specific compatible tool/fixture is available through an accessible station that the actor is permitted to use | Not owned by the player or permanently granted to inventory |
| **Tool requirement** | A recipe or activity needs a specified functional capability or accepted canonical tool item identity | Not an instruction to equip that tool as a weapon |
| **Action engagement** | Owner-backed reservation of a tool and required hands for a finite operation | Not a new permanent equipment slot or duplicate instance |

Name two different axes: **assignment/readiness** (primary/secondary loadout and allowed use profiles) and **current physical location/hand use**. UI must not infer one from the other. The existing internal weapon slot ids can remain until a reviewed atomic owner/Save cutover; relabel presentation independently only after truthful UI mapping. Do not rename or reinterpret saved slot ids by search-and-replace.

## 3. Example behavior

A. Sheathed sword assigned as Primary Weapon, pickaxe in backpack: Mine resolves the exact pickaxe instance, checks reachability and two-hand/one-hand posture once authored, retrieves it, performs the activity, and returns the same instance to its recorded container. The sword's assignment is unchanged; it never has to be unequipped.

B. Sword already drawn: a conflicting tool cannot occupy the same physical hand. An out-of-combat command may explicitly authorize a safe stow-use-restore sequence (with appropriate action time); otherwise explain why the tool cannot be used. In combat or dangerous interruptions, never silently sheathe, redraw, bypass action timing, or teleport inventory. A two-handed tool requires both actual hands free or validly cleared.

C. A blacksmith with an owned hammer in a carried bag may use it at a forge. If an accessible forge supplies an eligible hammer, that tool also satisfies the requirement even if the character owns no hammer. Station provision is free of an extra tool rental by default where authority explicitly permits it; recipe ingredients, fuel, labor, station fees, and wear remain independent owners.

D. An anvil, smoking rack, pottery wheel, loom, or similarly fixed apparatus is not necessarily something the character must grip or carry. Classify fixtures separately from handheld tools, even when legacy catalog records use itemClass tool or a recipe's requiredToolItemKeys field.

E. A gold panning action can later use a carried personal pan or a tool available at an authorized station/camp. **Gold pan is an illustrative candidate, not a verified existing item key**; it requires separate canonical authoring approval and a legitimate activity/resource owner before play.

## 4. Physical state, transactions, and save boundary

A single durable item instance must have **exactly one authoritative physical location** at any instant. The native gear owner currently models worn, bag, or overflow locations and rejects unsupported locations; no persistent hand location, tool draw command, or station-owned tool transfer is verified. A held reference must never create a second physical copy or double-count container capacity.

Preferred eventual model to be evaluated by the owner:
- An assigned weapon slot/ready configuration is an **identity reference** independent of the currently occupied hand; its physical stow point remains validated.
- A persistent drawn/held object has an owner-validated hand placement (left/right/both), an exact item-instance reference, and a remembered legal return destination. An item cannot remain simultaneously physically located in a bag or weapon sheath and physically held.
- A short atomic activity may perform retrieve/use/return inside one accepted transaction without publishing an intermediate held state. Any interruptible or long-running action requires explicit persisted or durably reconstructible engagement, hand occupancy, rollback/recovery, and return handling.
- A station-owned handheld tool retains station ownership; its momentary custody/hand use is authorized and recorded or reconstructed without a transfer to personal inventory. A fixture can be reserved or operated without becoming portable gear.
- Assignment slots or presets may point to the same owned instance only under explicit loadout rules; they never count as another physical location. If an item is dropped, broken, stolen, inaccessible, or transferred, assigned and held references must be revalidated and invalidated where necessary.
- Return-to-source uses the recorded actual bag, sheath, or station, not a guessed first free slot. A blocked return must follow explicit drop/alternate legal storage/held continuation or transaction refusal policy; never duplicate or destroy silently.

The physical-location representation and persistent held-state shape remain **implementation-gated decisions**. Do not add a boolean drawn flag to a static item definition or simply mark a bag item as physically in hand while simultaneously claiming exact-location integrity. One authoritative owner must coordinate gear, actions, hand occupancy, and Save publication.

## 5. Tool requirement satisfaction at stations

For a stationary crafting or processing command, validate in this sequence:

1. The contextual station/action is actually present and reachable, rather than inferred from descriptive workplace or settlement text.
2. Character access and authority are valid now: ownership, invitation, work role, rental, guild permission, use window, restrictions, and reservation/occupation as applicable. Permission to use a building does not automatically imply use of its restricted equipment.
3. The recipe is known/admissible and the station satisfies its requiredWorkplaceIds or later capability constraints.
4. Required tools are satisfiable from **either** accessible on-person durable instances **or** eligible actual station-provided equipment/fixtures that the station owner exposes. The user may deliberately select their own tool even if a station equivalent exists.
5. Select a compatible tool for each requirement using canonical item keys and any separately approved capability/quality requirements; resolve exact instance or station fixture identity, availability, condition, reachability, hand demand, and simultaneous-use constraints.
6. Reserve selected tools/fixtures and station capacity for the operation, recheck revision and permissions at execution, and release deterministically on success, rejection, interruption, cancellation, or restart.
7. Resolve inputs/outputs, time, body state, wear, and final publication atomically through the responsible owners. A station-provided tool is not consumed or transferred merely because it satisfied a non-consuming requirement.

Recommended default selection, only after validated compatibility: **explicit player selection first; otherwise eligible included station tool; otherwise eligible personal carried tool**. Allow choosing a better personal tool rather than silently defaulting to weaker station equipment. Do not require unnecessary explicit hand-equipping clicks for each recipe. Show a concise source hint such as "Hammer provided by forge" or "Using your Blacksmith Hammer"; never claim tool availability from a workplace type alone.

"On person" includes personally accessible bags/sheaths/pouches and other accepted carried storage, not remote stash, unclaimed overflow, inaccessible locked containers, another person's possessions, or station stock without permission. Ownership and actual reachability are distinct.

## 6. Existing repository facts and classification pressure

At inspected master: 1,372 item definitions; **131 tool-class items**, including portable hand tools, kits, deployables, apparatus, carts/harnesses, abstract bundles, administrative equipment, and workshop fixtures. Only **Pickaxe** and **Lumber Axe** among these tool-class records have explicit useProfiles in the present catalog. Twenty-eight authored planned crafting recipes all require a workplace; twenty-five name one or more requiredToolItemKeys. The schema supports those recipe references, but they do **not** execute crafting.

The stacked native gear fit table has **nine tool-class fit rows**, including five tool-class rows with assigned/worn eligibility and four carried-only rows with empty slots. More precisely, the tool rows are pickaxe, lumber_axe, skinning_knife, agriculture_kit, awl, butcher_knife, bedroll_kit, compass, and ledger; their slots reflect current legacy resolver parity, not an exhaustive policy that all tools must occupy weapon slots. The wider fit table has 56 rows. The remaining **122 tool-class records not in the fit table are not automatically broken or equippable**. Their class/use/physical-home policy has not been exhaustively authored. Current inventory physical boundary covers only fungible commodity/consumable/quest stacks and non-fungible weapon/armor/clothing/accessory/tool instances; vehicles and other physical categories require a separate decision.

Relevant source surfaces:
- packages/content/base/items/items.json; packages/schemas/items/item.schema.json
- packages/content/base/items/equipment_fit_profiles.json on the native gear branch
- packages/engines/game-engine/src/gear-instance-owner.ts and native-gear-physical-boundary.ts on the native branch
- apps/rpg-ui/src/game-shell/equipmentSlotEligibility.ts (legacy selection)
- packages/content/base/crafting/recipes.json; packages/schemas/crafting/recipe.schema.json
- packages/content/base/civilization/workplaces.json; packages/schemas/civilization/workplace.schema.json
- docs/design/crafting-authority-boundary-decision.md
- docs/design/contextual-action-surfaces-inventory-crafting-and-trade-decision.md
- docs/design/recipe-and-production-schema-decision.md
- docs/design/character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md

Accepted crafting direction keeps portable tool identity in items.items. Existing workplace workforce requiredToolTags are **not** portable tool identities or proof of station stock. Existing useProfiles own authored action/skill/handling/combat hooks where present. Do not fabricate an overlapping crafting.tool_profiles authority or translate every workplace tag into a free physical tool.

## 7. Tool taxonomy and first data audit

Classify each of the 131 current tool-class records (do not change itemClass automatically) across independent fields:

| Axis | Candidate vocabulary / questions |
| --- | --- |
| Physical form | handheld; two-handed portable; wearable/attached; carried kit; placeable/deployable; fixed apparatus/fixture; conveyance/harness; administrative/reference; abstract/bulk bundle |
| Use roles | extraction; excavation; woodcutting; agriculture; foraging; fishing; surveying; cutting; shaping; smithing; tailoring; cooking; medical; navigation; construction; inspection; defensive/improvised combat |
| Acquisition | personal carried; assigned stowed; station supplied; station fixed; borrowed; shared; installed; not individually instanced until future owner |
| Hand demand | none; one hand; either hand; left/right-specific; both hands; sequence of hand poses; cannot be inferred |
| Access | immediate carried; contained but accessible; station-local with permission; installed/anchored; unavailable |
| Tool durability | current per-instance condition; whether usage causes wear; breakage/repair policy deferred unless separately approved |
| Requirements | exact canonical itemKey; permitted substitute/capability group; minimum functional tier; specialist/tool-specific restriction |
| Evidence state | confirmed live field; source-backed candidate; design inference; unknown; new-canon decision required |

Seed classification examples **for review**, not automatic rules:
- Pickaxe, Lumber Axe, Shovel, Spade, Hammer, Blacksmith Hammer, Sickle, Awl, Skinning Knife, Butcher Knife: portable handheld; hand count and action capabilities require item-specific confirmation.
- Anvil, Hoop Anvil, Smoking Rack, Pottery Wheel, Cellar Rack: fixtures/apparatus candidates, not ordinary offhand weapon assignments.
- Agriculture Kit, Surveyor Kit, Survival Kit: carried kits whose internal manifest and usable components must not be invented.
- Handcart, Pack Harness, Plow, Well Winch: logistics/animal/installed apparatus boundary, not ordinary grip-and-swing tools.
- Forged Tools, Steel Tools, Tools, Steel Weapons: abstract/bulk or category-like goods needing identity classification before native instances.
- Pickaxe and Lumber Axe retain existing hybrid mining/woodcutting and weapon useProfiles; using as a work tool does not automatically select their combat profile.

## 8. Proposed static capability data, gated

Prefer a **bounded item-owned tool-use capability extension**, reconciled with existing item useProfiles and the accepted item schema, over a duplicate tool catalog. Candidate logical fields for design review (not JSON contract):
- canonical item key; profile status/provenance;
- capability tags/operation families, with exact item-key requirements retained where already authored;
- physical form, portable/fixture posture, eligible hand count/constraints and readiness mode;
- permitted station contexts, reachability/placement restrictions and whether an installed apparatus is usable without holding;
- compatibility/substitution groups and specialization, without inventing quality bands or skill results;
- optional use-profile refs for current utility/combat actions, not duplicate copies of their resolution hooks.

Separate concerns explicitly:
- **Item content**: what a pickaxe or anvil is and can structurally support.
- **Recipe content**: what portable tools are required for a given transformation; currently requiredToolItemKeys plus requiredWorkplaceIds.
- **Station content and runtime**: what tools/fixtures are actually available there, who controls them, and whether they can be used.
- **Character/item runtime**: exact instance/location, hand occupancy, condition, assignment, lawful access and reservation.
- **Action owner**: eligibility, timing, interruption, skill use, output, wear and atomic result.
- **UI**: contextual commands and truthful projections only.

No station-provided stock, handState, fixture reservations, or quality numbers should be added to existing static records until their schemas, owner contract and validation are accepted.

## 9. First evidence-first content batches

**Batch T0 (connector-safe, docs only):** Reproduce 131 current tool-class items, 9 native tool fits, 28 recipes/25 explicit tool lists; create a per-item classification ledger with exact item keys, relevant recipe/workplace references, current useProfiles, current fit/slot, source evidence and unknown decisions. Do not fill unknowns from item names alone.

**Batch T1 (portable basics, candidate):** Assess Pickaxe, Lumber Axe, Shovel, Spade, Hammer, Blacksmith Hammer, Awl, Skinning Knife, Butcher Knife, Sickle, Saw and Chisel for portable/held use. First resolve current identity/action compatibility and which actions actually have owners. Favor existing items over creating near-duplicates.

**Batch T2 (station production):** Audit forge, bloomery, mill, sawmill, tannery, bakery, cooper, loomhouse, smokehouse and smelter recipe requirements. For each requirement, distinguish exact tool item, installed fixture, accepted substitution, present station equipment, permitted user and separately owned ingredients/fuel. Never assume a named workplace provides a named tool.

**Batch T3 (field/survey/utility):** Audit field kits, survey staff/kit, compass, fishing gear, nets, measuring rod, lantern and appropriate digging/panning candidates. Match geography/ecology, source material and actions only where already owned. Gold pan may enter as a candidate with a source-backed definition, not an automatic new item or enabled Gather action.

**Batch T4 (specialty and awkward catalog shapes):** Review apparatus, harnesses, carts, placed traps, abstract tool bundles, combat-capable tools and separate vehicle owner candidates. Keep unresolved entries explicitly deferred instead of co-opting weapon slots.

Each batch artifact should contain exact canonical ids, all relevant references, provenance classification, physical/use category, proposed capability, owning domain, required decision, supported/not-supported status, and a negative-evidence column. An unverified candidate never upgrades to active data merely by being listed.

## 10. Required implementation sequencing after data planning

1. **Classification acceptance**: Owner reviews T0 and a bounded T1/T2 pilot, resolves portable versus station fixture versus abstract catalog entries and intended tool capabilities.
2. **Schema/validator decision**: Reconcile item useProfiles, fit profiles, recipe requiredToolItemKeys, and workplace workforce requiredToolTags. Decide minimal item-owned additions and station-equipment reference contract. No duplicate authority.
3. **Narrow static seed**: Authenticated checkout implements only approved candidate item/recipe/station metadata and strict semantic validation; normal content-lint registration, mirrored TS/JS rules as applicable, schema and negative tests, full diff audit.
4. **Native gear/access contract**: Only after selected v3 physical owners and Save gates are settled, design exact hand placements/assignment, one location, station custody, personal carried access, reservation, interruption, time and recoverability. This must not weaken the currently unselected v3 survey/dependency chain.
5. **First positive activity**: Choose one ordinary command with a real owner (e.g. existing portable tool use in an accepted area or one authored workplace recipe), verify from personal tool and authorized station tool, unchanged weapon assignment, physical conservation and Save/restart. Not a universal crafting/extraction activation.
6. **Broaden by domain**: Extend only after accepted owner-backed pilot, ecology/resource stock ownership and consistent production/tool semantics.

Do not confuse read-only candidate static data with runtime resource nodes, crafting, item movement or station inventory. The present Codex v3 account descendant/recovery work and PR integration remain independently held.

## 11. Negative and positive acceptance matrix for a future owner

- Sheathed primary sword plus backpack pickaxe: mining can use the exact pickaxe without changing the primary weapon assignment or losing either item.
- Drawn sword plus pickaxe competing for its hand: deny or run an explicitly authorized stow-use-restore command; no invisible conflicting occupancy.
- One-handed versus two-handed tool: required hands validated against held weapons, shields and condition restrictions; never two exclusive objects in one hand.
- Repeated use: exact item identity, durability and stored location conserved across retry, failure, Save and restart.
- Inaccessible bag, locked/remote stash, lost tool, or overflow: cannot count as on-person availability merely because an item key appears in a global catalog.
- Station tool available and permitted: satisfies the correct recipe requirement without a personal copy, implicit purchase or changing weapon assignment.
- Station present without actual tool evidence: tool requirement remains unsatisfied; no magically infinite free inventory.
- Station supplied but actor unauthorized or tool already reserved/broken: reject or offer reason without consuming ingredient, time, condition or item.
- Personal and station tools both eligible: explicit source selection wins; otherwise deterministic visible policy. No unreviewed quality downgrade.
- Station tool return: exact station-owned instance/fixture availability restored or changed according to accepted wear rules, never moved into player bag.
- Two simultaneous recipe requirements: enforce actual compatible simultaneous availability, reservation, and hand/fixture resource conflicts, not item-key presence alone.
- Broken tool mid-action, full source bag, active combat, player incapacitation or interrupted action: recover/settle without duplication, loss or unearned progress.
- Stale revision and duplicate request: only one accepted transaction/result; no double wear, time, item return or output.
- Tool with hybrid combat/utility profiles: activity selects intended profile through command, not class or assigned primary slot alone.
- Authored fixed fixture: can support a recipe as a station apparatus when compatible and authorized without pretending it is a portable weapon.
- Selected mobile/keyboard UI: both recipe and inventory surfaces explain tool source and access without a new compulsory equipment-management menu.
- Historical v2 survey witness and unselected native v3 retained replay remain unchanged unless a later owner-authorized versioned update explicitly covers them.

## 12. Deferred noteworthy expansions (not part of tool pass)

Priority and reopening trigger, subject to later owner selection:

| Lane | What to prepare later | Gate |
| --- | --- | --- |
| **Equipment fit, sheathing and loadouts** | Primary/secondary labels, sheaths, straps, shield readiness, layer fit, two-handed weapons, saved presets and timed draw/stow | Native gear/hand owner and selected Save, combat, resource, UI proofs |
| **Containers, real storage and item transport** | Bag/pouch capacity, nested containers, access time, stations storing tools, ground drops, carts/harnesses, vehicle ownership | One physical-location/container/transfer contract; no parallel stash |
| **Item materials, quality, crafting and repair** | Material composition, wear, quality/condition, maker provenance, substituted tools, repair/salvage and preservation | Item-instance and recipe/process authority; explicit balance and provenance |
| **Geographic resources and ecology** | Deposits, wood stands, soil, water, harvestable flora/fauna, seasonal availability, tool-environment suitability | Observed environment and lawful Gather/extract action, depletion/Save owner |
| **Station ownership and civic permissions** | Workshop access, loaned tools, employment, guild permission, rental, hours, maintenance, shared tool stock | Real actor/site/permission and tool availability owner |
| **NPC trades and professional equipment** | Craftsperson inventories, skills, station access, commissions, shared workplace tool use and apprenticeship | NPC/settlement/work order and production owners |
| **Combat/improvised weapons and wear** | Switching held tool to combat use, hand readiness, damage hooks, stamina/time and risk | Combat owner and authored item action profiles; no automatic every-tool weapon |
| **Loot, heirloom, custody and law** | Theft, borrowing, contraband, inherited tool copies, commission custody, provenance and named equipment | Authorized ownership/estate/legal state and durable receipts |
| **Vehicles, deployables and large apparatus** | Handcarts, plows, cranes, racks, vehicles and placed equipment not fitting ordinary gear slots | Non-character-held physical-object/site authority decision |

Do not open all lanes as active work. Preserve these as bounded downstream planning targets, each requiring a fresh source audit and accepted owner before static content or gameplay activation.

## 13. Connector-safe result and next handoff

This document captures the owner's tool-use intention, reconciles it with the inspected static catalog and the **unselected** native v3 owner, and defines the next safe audit T0. It creates no item definitions, gameplay state, action, recipe, station stock, permission, tool profile collection, schema, validator, tests, user-facing UI, migration or version advancement.

Recommended immediate next connector pass: **T0 tool census and evidence matrix**, followed by a narrow pilot of portable-versus-fixed tool classification and exact recipe/station requirement reconciliation. A Codex package is justified only after the data decision or runtime owner is accepted.

Branch disposition at creation: HOLD_NAMED_CONSUMER. Named consumer is the next tool T0 census / tool-ownership schema review after native v3 integration source reconciliation. Reinspect exact head before merging; do not merge this branch into currently unmerged native gear PRs or interpret the document as executable acceptance. Record branch disposition in the shared register during the next owned coordination merge/checkpoint rather than rewriting the actively contested register from an unrelated connector branch.
