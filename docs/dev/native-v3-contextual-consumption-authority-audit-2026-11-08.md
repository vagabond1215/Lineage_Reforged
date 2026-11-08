# Native-v3 Contextual Consumption: Source Audit and Proposed UI/Owner Contract

Date: 2026-11-08
Review state: CONNECTOR_REVIEWED_DOCS_ONLY; implementation contract PROPOSED_PENDING_OWNER_ACCEPTANCE
Source: draft PR #70 at fad907301d85786feaeed9cf8fecf64bc9d37949
Companion plan: native-v3-contextual-consumption-first-sequence-plan-2026-11-08.md
Game: 0.1.1-prealpha; HOLD_SELECTED_ATOMIC_ACTIVATION
Change scope: documentation only. No gameplay, catalogs, schemas, tests, accounts, hosted deployment or branch integration modified.

## Executive disposition

The plan passes the architecture, provenance, owner-separation and scope review for connector-safe documentation delivery. It does NOT imply that a generic Eat command, a served-meal item instance, an environmental food source, a pack-opening operation or an enabled native inventory food action is ready to implement without an independent source/owner gate.

Preserve the accepted direction: context drives what action is offered, but a specific domain owner validates and executes the command. The ordinary path for a carried edible item is selection in Inventory; a future Current Area inspector may select an actually observed/owned serving or source only after its exact runtime identity and access authority exist. Neither surface owns nutrition. No global Food menu, universal Use executor, or duplicate item store is needed.

The owner's report says the exact PR #70 private staging artifact is running as version 6 and the hosted Soundings quest paid five gold once. That operational result is not reproduced by this connector-only read, and the held activation gate remains. Do not alter the approved version 6 bytes.

## Authority reconciliation

| Topic | Source-derived accepted direction | Status / limitation |
| --- | --- | --- |
| UI invocation | Contextual Action Surfaces section 2/4: select an accessible inventory item for Eat/Drink; broader entity, workplace and location-driven actions are contextual rather than permanent menus | Accepted surface rule |
| World commands | Contextual Player Action And Command Architecture sections 1-5: stable concrete command + source/target/method; read-only ephemeral descriptors, owner revalidation and accepted-only mutation | Architecture defined; implementation not authorized |
| Current Area | Local Scene / Context Projection: character-observed, accepted-head/tick projection; generic site label, map icon or prose does not establish an exact interior/furniture/serving instance | Accepted observation limit |
| Item identity | Item Equipment Inventory Authority Boundary: static canonical item identity and consumable profile are separate from current owned stack/instance, quantity, access, use and effects | Accepted owner separation |
| Prepared food | Culinary Preparation, Portion, Meal Composition and Ration Serving decisions: serving, recipe, preparation, vessel and container ownership cannot be inferred from a nutrition descriptor | Accepted conceptual boundary; live mechanics deferred |
| Provisions | Packed Food/Ration plan and Regional Ration Manifest decision: a pack is packaging, not edible; named contents must be fixed at creation and retained, with knowledge separate from truth | Accepted; no live manifest/Open owner supplied |
| Combat | Combat Item/Consumable Activation Prerequisites: Character nutrition Use does not grant a combat action, action timing, medicine effects or defeat bypass | No general combat consumption authorization |

The accepted documents do not explicitly authorize direct player eating from a communal pot as an executable operation. That is a proposed, contingent interaction, not a conflict to be resolved by choosing a label. The environmental instance, access, serving and depletion owners must exist first.

## Exact current native selected route

1. NativeCharacterReviewShell mounts the Inventory tab via apps/rpg-ui/src/features/NativeCharacterPanel.tsx.
2. The panel reads readNativeSelectedCharacter from game-shell/nativeSelectedCharacter.ts; each bag or overflow stack becomes a presentation with exact item ID/key, location, quantity, inventory fingerprint, revision and canUse based on item.consumableProfileId resolving to an authored profile.
3. The panel renders a direct Use [item name] button and invokes admitNativeSelectedItemCommand with a new request ID. This is a real mutation bridge, not a read-only menu.
4. game-shell/nativeSessionItemActions.ts admits fungible-use outcomes under campaign-session mutation ownership.
5. game-shell/nativeFungibleActions.ts validates current native snapshot and complete requested bag/overflow stack, inventory revision/fingerprint, matching item/key/quantity, and profile. On acceptance it decrements one stack unit, invokes applyConsumableToBodyState in packages/engines/player-engine/src/body-state.ts, then resolves derived player resources.
6. packages/engines/game-engine/src/native-fungible-use-ledger.ts retains an inventory-Use revision and request ID/fingerprint receipts. Duplicates/conflicts are checked against those receipts.
7. Accepted result/snapshot and session control return through the selected UI and established Save machinery; the native-v3 Save path persists the accepted campaign rather than the contextual descriptor itself.

This current request has only two source-location shapes: bag (bag ID + stack index) and overflow (stack index). It does not address a served table item, cauldron, NPC-owned meal or physical world food source. It currently consumes one whole stack unit per accepted use, not a generic portion or serving. There is no authored action-time cost in this owner transition; that is not permission to make every future nutrition action free in combat or time.

### Source-specific safety question requiring runtime verification

game-shell/nativeSelectedSession.ts::applyNativeSelectedItem explicitly rejects pending Normal defeat before item action. However features/NativeCharacterPanel.tsx calls the lower-level admitNativeSelectedItemCommand directly, while game-shell/nativeSessionItemActions.ts does not visibly call the same pending-defeat guard. The broader native validator/admission may still reject the affected state. This is a **potential guard divergence, not a demonstrated gameplay exploit**. The next Codex focused pass must reproduce the real selected caller during pending defeat and active combat, verify legality, and only then decide whether a narrow repair is needed. Do not claim that all selected inventory callers already enforce identical contextual eligibility.

## Current item/content classification

| Item or candidate | Observed source | Disposition |
| --- | --- | --- |
| item.ration_bundle | Canonical item entry marked consumable but no consumableProfileId; appears in starting bundles. consume.ration_bundle exists as an unlinked profile | Correctly disabled as direct Eat by current code; never link the orphan profile to make packaging edible |
| item.traveler_ration | Canonical item has consume.traveler_ration profile. legacyPreparationApplication.ts grants x1 under Storehouse Keys and a conditional Camp Supplies fallback | Structurally supported by the current native Use path, but generic direct-food naming conflicts with later named-food direction; lawful selected-user reachability, portion semantics and relevant entitlement are unverified |
| item.bread_loaf | Profile-linked food noted in prior consumable-coverage audit | Candidate for bounded owner characterization; whole loaf versus portion remains unresolved, and ordinary hosted acquisition is unverified |
| item.trail_meal | Generic consumable-class entry lacks an authored profile link; consume.trail_meal is orphaned | Not evidence of edible/inventory-ready Use |
| item.field_bandage | No authored nutrition/medical Use effect in selected source | Must not be treated as food or a generic healing action |
| Named jerky, stew bowl, tavern table, communal cauldron | Illustrative design examples only, unless exact canonical instances/authorities are independently found | No new items, stock, serving yields or world instances inferred |

An itemClass of consumable, a food tag, a named profile or a historical test fixture alone never establishes a legal playable Eat action. Historical consumable coverage audits also identify semantically mismatched profile links; linking a profile to a different item merely to enable the button is out of scope.

## Proposed player-facing interaction contract

These rows separate proposed UI from executable authority. A concrete label is optional presentation, not a command ID.

| Selected context | Proposed UI affordance | Required execution authority | Present readiness |
| --- | --- | --- | --- |
| Owned, ready-to-eat individual food in a bag | Inspect; Eat using owner-appropriate verb; choice only if actual serving size is supported | Existing exact stack Use and nutrition/body owner for current whole-unit semantics | Bounded native implementation exists; exact hosted path not yet proved for eligible food |
| Sealed Ration Bundle in bag | Inspect; later Open/Unpack, not Eat | Generic item-instance/container owner; creation-time immutable manifest, capacity, access, stack identity and accepted transfer | Deferred: no current manifest or Open command |
| Served bowl or plated meal on the character's table | Inspect; eventually Eat or Drink when the exact serving is authorized | Persistent meal/serving source, ownership/access and same nutrition outcome owner | Proposed only; Current Area identity/serving owner missing |
| Communal soup cauldron at an accessible hearth | Inspect; Request/Take Serving, then Eat authorized serving; a direct Eat method only after specific owner decision | Station/source quantity, vessel and access/social, serving/transfer and food consumption owners | Proposed only; cannot derive infinite servings from prose |
| Unowned food on someone else's table | Inspect or ask permission; acquisition/transfer as appropriate | Property/social/transaction or authorized risky consequence owner | No automatic Take or Eat |
| Ingredients at campfire/kitchen | Prepare/Cook through real station and recipe, not an Eat shortcut | Cooking/recipe/process, tools, fuel, work-time, input/output inventory owner | Deferred |
| Vendor tray or tavern meal for sale | Browse/Ask/Buy first, then obtain an authorized serving | Market/service provider, stock, payment and transfer authority | Not generic Inventory Eat |
| Food during active encounter or pending defeat | Omit or explain blocked until real combat legality/timing owner exists | Combat turn/queue, target/access, activity and item effect owners | Not authorized by existing nutrition Use |

A contextual action descriptor should carry owner route, concrete command or unresolved expansion, source identity, observed target, method, availability, safe reason, current accepted head/tick basis and owner-derived preview where supported. It is transient and must never become a persistent entitlement, mutation receipt or idempotency key. Refresh against authoritative state on invocation and rejection. Keep unsupported/hidden actions omitted rather than displaying a forest of disabled buttons.

## Ownership and dependency matrix

| Domain | Owns / must prove | Explicitly does not own |
| --- | --- | --- |
| Item and inventory | Exactly which current owned stack/instance, quantity, accessible container and valid debit/receipt | Edibility, nutrients, local table ownership or shop payment |
| Food/body | Exact edible identity/profile, legal whole/serving input, nutrition/hydration/other supported physiological effects | Where a merchant's stock came from, unauthorized inventory debit or invented recipes |
| Local scene | Character-observed entities and source/target references at accepted campaign head/tick | Creating a food item from narrative, durable source stock, entitlement or state mutation |
| World food/serving, future | Stable serving/source instance, capacity, decrement, access, spoilage/visibility as authored | Generic body nutrition, purchase price, crafting outcome |
| Generic containers, future | Open/close, manifest-bound contents transfer, sealing and physical state | Nutrition of packaging, opening-time RNG, merchant claims |
| Crafting/process, future | Cooking, preparation, recipe, station, inputs, time and output servings | Eat result or arbitrary world material grants |
| Social/market, future | Permission, provider, price, transfer/serving rights and consequences | Nutrition or generic inventory entitlement |
| Campaign/Save | Admission, stale source, exact request/retry result, readback and continuity | UI-label-derived permissions or hidden second persistence store |

An eventual shared nutrition calculation is useful; it is not evidence that one all-purpose food command can atomically debit inventory, communal soup, vendor stock and containers. Separate source-owning commands may delegate to the same validated food/body effect after source authorization. Cross-owner atomicity, rollback and ownership handoff must be explicit before environmental execution.

## Unresolved product and owner decisions

**R1. Portion/serving:** whole unit versus variable amount; whether a loaf, prepared bowl or pot is represented by items, portions or source instances; nutrition unit and remainder. Do not hardcode an arbitrary 100%-meal or fake serving scale.

**R2. Environmental identity:** exact world/interior/furniture/serving ID, persistence and lifecycle. Local-scene documents explicitly do not define these as live Save authority.

**R3. Access and rights:** who owns shared food, when a character may take or directly eat it, whom to ask, whether social refusal or unlawful action has a consequence owner.

**R4. Container unpack:** fixed manifest, character knowledge, stack compatibility, capacities, packaging disposition and save-stable contents. No opening-time reroll.

**R5. Action time and encounter state:** accepted action duration/cost, when eating is disabled, interruptions and combat turn economy. Existing nutrition Use does not answer these for future sources.

**R6. Reachable food candidate:** which source grants a coherent directly edible whole unit to a fresh native-v3 player without fixture injection, out-of-scope legacy entitlement or unapproved shop functionality. Traveler Ration is profile-linked but not yet verified as an ordinary fresh-account option.

**R7. Presentation:** when to show Eat/Drink, Open, Take Serving or a safe blocker; exact action names should come from owner/item support, not itemClass guesses. Current selected UI uses generic Use [item name] and can improve only after owner-backed labels.

## Codex implementation dependency sequence (NOT authorized here)

1. Focused real selected caller characterization of present inventory Use with a supported, genuinely attainable edible source. Include pending defeat/active combat guard parity, stale/duplicate/retry, one physical unit, body/resource delta and Save/readback. If lawful acquisition is unavailable, stop with an acquisition decision; do not seed production account state.
2. If needed, extract a narrow source-independent food/body evaluation only after an owner-contract test proves which logic is reusable. Preserve native inventory receipt and campaign admission paths; do not create a parallel inventory or Save.
3. Separately decide and implement generic container and immutable provisions manifest for Open/Unpack, with all physical ownership, capacity and idempotency gates.
4. Separately define exact local food instance/serving/access owners; only then expose Current Area Eat/Request Serving from accepted scene references.
5. Separately review item Use during combat, medicine, social theft, vendor/service payment, cooking and other effect families.

The first next task may be test-only, not necessarily a code repair. Every later step requires owner approval and an exact new artifact review before any staging deployment.

## Planned acceptance and adversarial checks

| Scenario | Required result |
| --- | --- |
| Known owned ready food | Owner validates canonical profile, exact stack and unit; accepted-only decrement and supported body/resource effect |
| Stale stack/index/quantity/inventory revision or campaign source | Reject or stale without consuming a different source |
| Same request replay versus same ID different content | Duplicate no second debit/effect; conflicting request rejected |
| Save abort, restart and cross-slot copy | No phantom use or untracked repeated intake; accepted state survives durable readback |
| Disabled starter pack/unsupported bandage | No direct nutrition use or inferred healing |
| Descriptive nearby table without instance owner | No executable Eat, Take or generated meal |
| Valid scene with absent serving/access owner | Inspect-only or safe explained blocker |
| Communal source depletion, unauthorized access and stale serving | No infinite servings, unauthorized transfer or double consumption |
| Pending defeat/active combat | Real selected UI, lower caller and owners must agree on legality; no free extra action |
| v2 and native-v3 Save continuity | No cast-based migration, witness replacement or new store |
| Keyboard/responsive selected inspector | Owner-reported state and available/blocked reasons remain navigable; no inaccessible action-only icon |

None of these scenarios was executed by this connector-only review.

## Independent plan-quality audit

| Gate | Assessment | Evidence and limitation |
| --- | --- | --- |
| Existing design precedence | PASS | Accepted Contextual Action Surfaces, Local Scene, Item/Inventory and Provisions decisions preserved |
| Honest implementation baseline | PASS | Traced NativeCharacterPanel -> nativeSelectedCharacter -> nativeSessionItemActions/nativeFungibleActions -> body-state and campaign admission |
| No duplicate owner | PASS | Distinct source, food/body, scene, container, process and transaction boundaries |
| Item semantics | PASS | Disabled Ration Bundle and orphan profile distinguished; traveler ration and bread loaf limitations labeled |
| Future Current Area action | PASS WITH GATE | Proposed only; requires exact observed source, access, serving and persistence owner |
| Failure and retry | PASS WITH RUNTIME GATE | Existing selected receipts mapped; no independent tests run; pending-defeat path divergence specifically flagged |
| Scope and deployment | PASS | Docs-only child of exact PR #70; no source/code/hosted publication changed |
| Next executable scope | PASS | Small test-first native inventory food path; environmental and pack features deferred |

Verdict: **PLAN_ACCEPTED_FOR_CONNECTOR_SAFE_DOCUMENTATION_ONLY**. It is not acceptance of a new gameplay command, an endorsed universal food-action schema, or a guarantee of combat/defeat safety.

## Required handoff

Before any Codex runtime pass, review this packet with the owner. Select one explicit next-slice question: (a) validate current lawful native carried-food Use and caller legality, (b) define lawful food acquisition, or (c) design an exact packed-provisions manifest/Open owner. Do not combine (a)-(c) with local environmental serving, cooking, trade, medicine or combat actions in one PR.

Preserve PRs #64-#70, master, private staging version 6 and its archived approved artifact, production v2 Site version 16 and existing accounts. Maintain HOLD_SELECTED_ATOMIC_ACTIVATION. The exact artifact's staging-publication acceptance does not grant approval for changed bytes or production cutover.
