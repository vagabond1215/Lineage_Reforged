# Character Capability, Wearable Equipment, Storage, And Artisan Quality — Consolidated Deferred Intent

Date: 2026-10-25
Status: `USER_DIRECTION_CAPTURED; CROSS_SYSTEM_DESIGN_INTENT; DEFER_IMPLEMENTATION`
Run class: unversioned connector-safe design consolidation
Game/development version impact: none
Scope: future player/NPC attribute precision, use-driven development, wearable compatibility, physical storage, item quality, and artisan output.
Non-goal: this document does not authorize content, schema, balance, runtime, migration, save, UI, combat, crafting, NPC, or economic implementation.

> **2026-10-26 live UI follow-up:** The owner's Equipment/Casual/Accessories cycling, two accessory presets, real sided slots, simultaneous wearable layers, and one-watch apply now have a [source-grounded owner/save addendum](character-layered-loadouts-owner-follow-up-audit-2026-10-26.md). That addendum inspects default-head `cf8eb7a8d1e4a3acf389b5f02ed036047fc58737` and the [live layered-loadout preflight](character-layered-loadouts-and-sided-slots-preflight-2026-10-26.md). It refines migration/owner readiness only; the draft PR and this broader quality/artisan work remain non-executing design evidence.

## 1. Purpose and precedence

Capture the user-directed interconnected mechanics without creating a second owner for any accepted system. This is a focused *future implementation consumer and decision checklist*, not a replacement for accepted source contracts. More specific previously accepted owner boundaries continue to control until a dedicated decision reconciles exact new fields, formulas, migrations, and tests.

Relevant controlling/adjacent design documents:

- [Unified Physical Attribute Growth And Nutrition-Band Integration Decision](unified-physical-attribute-growth-and-nutrition-band-integration-decision.md): immutable base, developed adjustment, structural loss, reversible condition, one current-attribute resolver, one growth owner.
- [Attribute, Skill, Ability, And Spell Responsibility Audit](attribute-skill-ability-responsibility-audit.md): the nine distinct attributes, current formula consumers, growth-source gaps, and authored-vs-runtime drift.
- [Protein, Recovery, Muscle Adaptation And Nutrition Integration Decision](protein-recovery-muscle-adaptation-and-nutrition-integration-decision.md): qualified physical stimulus plus energy/protein/recovery; no second muscle-growth ledger.
- [Item Equipment Inventory Authority Boundary](item-equipment-inventory-authority-boundary-decision.md) and [Weapon And Armor Profile Schema Decision](weapon-and-armor-profile-schema-decision.md): item identity, existing use profiles, descriptive equipment structure, and runtime separation.
- [Inventory Stack And Item Instance Identity Audit](inventory-stack-and-item-instance-identity-audit.md): fungible carried stacks, richer equipped refs, and instance-identity migration debt.
- [Crafting Authority Boundary](crafting-authority-boundary-decision.md), [Recipe And Production Schema Decision](recipe-and-production-schema-decision.md), and [First Crafting Recipe Content Seed Plan](first-crafting-recipe-content-seed-plan.md): recipes versus civilization production, tools/workplaces, and deferred execution.
- [Artisan Mystery Assortment, Stock Window, And Contextual Quality Decision](artisan-mystery-assortment-stock-and-quality-decision.md): market assortment bands are not the truth of item workmanship.
- [Offspring Growth, Recipes, Ecology Engine Plan](offspring-growth-recipes-ecology-engine-plan.md): provisional quality ladder, learning, mentorship, per-craft outcomes, and future family access.
- [NPC Persistence And Generated Person Promotion Audit](npc-persistence-and-generated-person-promotion-audit.md): authored person/NPC identity is distinct from generated campaign-local persistent worker state.
- [Future System Design Ledger](future-system-design-ledger.md): purpose-relative material properties, constrained substitution, provenance, and owner boundaries.
- [Contextual Action Surfaces Decision](contextual-action-surfaces-inventory-crafting-and-trade-decision.md): UI requests valid actions from the domain owner rather than mutating gameplay independently.

An older document's historical claim that a future schema or collection is absent must not overrule current source. At inspection, weapon/armor profile schemas and validators exist but are not live populated equipment-profile authority; `packages/content/base/crafting/recipes.json` contains planned descriptive recipes. `resolveCraftAtSettlement` is an economic estimate, not per-item crafting execution.

## 2. Character attribute precision: approved user-facing direction, runtime deferred

**Player-facing integer; mechanically precise thousandths.** A character may display STR **12** while the resolved attribute used in eligible dependent calculations is **12.527**. Display must **truncate toward the lower whole value for nonnegative attributes**, not round 12.527 up to 13. The user-facing Character attribute tiles do not expose fractional digits. An optional separate debugging/inspection surface may show underlying contributions if deliberately authorized later; do not clutter the compact sheet.

Maintain the accepted ownership layers:

```text
immutable character-creation base
+ persistent developed adjustment from one stat-growth owner
+ persistent structural-loss adjustment from that owner
+ reversible body/condition/injury/illness/environment/equipment/magic/status adjustments
= resolved effective attribute used by eligible calculations
```

The exact modifier order, bounds, negative/temporary-value display policy, and which checks use resolved versus unmodified attributes require a specific formula contract. Attribute requirements expressed as integer thresholds should retain explicit integer admission semantics until separately changed; a fractional benefit must not silently bypass a minimum-rank or minimum-stat gate.

### 2.1 Current implementation facts to preserve

`packages/engines/player-engine/src/stat-growth.ts` already implements meaningful action attribute load, per-attribute thresholds, activity intensity, lineage biases, body-state/focus modifiers, saturation and diminishing returns, variety, qualified-recovery conversion, attribute tension, and deterministic variation. The current global rule's conversion RNG range is **0.95–1.05**. The current `statGrowth.progress` accumulates fractional progress, while integer points are granted through a whole-point conversion. Avoid calling current internal fractional progress mechanically effective STR/DEX/etc.

Before implementing precision, reconcile `playerState.attributes`, the immutable/developed/structural layers, and `statGrowth.progress` through a versioned migration. **Do not create a duplicate permanent-growth currency or double-count progress.** Prefer persisted fixed-point thousandths or an equivalent exact serialization contract; define rounding after each mutation versus only at calculation boundaries. Ensure stat-based consumers do not use integer display projections.

### 2.2 Growth-source expansion and safeguards

Activities supply authored weighted stimulus and independent skill-practice evidence. Plausible future weights require domain review, not this document's guessed fixed values:

| Meaningful activity | Candidate main attribute stimulus | Other possible inputs |
| --- | --- | --- |
| Loaded labor, heavy forging, construction | STR, CON | VIT, task-specific DEX |
| Precision shaping, finishing, toolmaking | DEX | INT, WIS |
| Running, climbing, mobility, field travel | AGI, CON | STR, VIT |
| Analysis, experiments, technical study | INT | WIS, task-specific DEX |
| Field judgment, medicine, surveying | WIS | INT, CON |
| Controlled magic practice, rituals | SPT | WIS, INT |
| Social leadership, negotiation, performance | CHA | WIS, INT |

Actual action owners must explicitly emit legitimate load and skill-practice events. Current inspected ordinary load profiles cover STR/DEX/AGI/CON/VIT/WIS but have gaps for **INT/SPT/CHA**. Preserve distinctions: DEX is precise control versus AGI movement; CON exertion versus VIT recovery/hardiness; INT analysis versus WIS judgment; SPT resonance versus CHA social presence.

Growth must respect challenge relative to current capacity, real duration/intensity, anti-triviality, daily diminishing returns, recovery windows, energy/protein/body state, age/lineage where authorized, and difficulty settings. Work may develop both skill and attribute through separate owners without paying duplicated growth for the same fact. No strength increase solely from eating, resting, repeated negligible actions, or a one-time lucky roll. Stimulation and delayed consolidation remain distinct. Persistent structural loss is not acute fatigue.

### 2.3 RNG and consumer integration

Preserve bounded, deterministic or seeded, replay-stable growth variance; RNG influences the amount of **qualifying consolidation**, never bypasses eligibility or generates arbitrary attribute points. Seed from a stable unique occurrence/recovery identity, not merely a UI request or retry. Investigate current player/tick/attribute seeding for same-tick repetition and save/reload replay; don't claim that extending it is already collision-safe.

Audit all stat consumers, especially resource maxima/regeneration, combat, skill and ability checks, spell scaling, tension, growth ceilings, Echo, load/carry capacity, and craft operations. Current `attributes.json` descriptive resource influences differ from actual resource formulas, and generic `governingAttributes` metadata is not yet a universal executing skill multiplier. Resolve these owner-by-owner; do not silently add new universal multipliers. Display integers and mechanically precise inputs must coexist without UI inference.

## 3. Physical wearable compatibility, attachments, and storage

**The question is not only whether clothing/armor accepts accessories.** Distinguish (a) an accessory fitting underneath or alongside clothing, (b) mounting an object onto a physical host, (c) access to an equipped item through a covering layer, and (d) capacity to store an item.

Use canonical body/anatomical anchor semantics, sided regions where needed, coverage footprints, layers, mounting features, physical fit and load constraints. Broad current weapon/armor/accessory slots remain compatibility interfaces; a future body-footprint model must explicitly reconcile them and the accepted `armor_profiles` owner of coarse compatible/coverage slots. Do not add a competing coverage owner by implication.

Illustrative future configurations:

- Slender wrist blade may fit alongside a narrow forearm bracer if profiles permit; an enclosing gauntlet may block the required space.
- Circlet may coexist with earrings; a fully enclosing helmet may obstruct, conceal, restrict access to, or prohibit them depending on explicit fit.
- Belt-fed pouch requires a compatible actual belt; independent strapped thigh pouch may anchor directly; sling satchel uses its own shoulder/torso requirements.
- Sword fits a compatible scabbard as a carried item, not an actively wielded hand weapon; drawing changes placement, not item identity.
- Integrated coat pocket is a compartment of the coat; detachable pouch is a separate mounted item with its own identity, wear, capacity, and contents.
- Backpack has finite load, bulk, shape/fit, shoulder/back space, and potentially external attachment points. Contents contribute to total carried burden.

Do not use a single `acceptsAccessories` boolean as complete gameplay truth. It may be an authoring convenience or default but needs per-region allowed/conditional/blocked accommodation, physical collision, layer order, mounting compatibility, and separate accessible/inaccessible states. Explicit item compatibility can never be inferred solely from display names.

Static capability ownership may require a wearable-fit/attachment descriptive contract reconciled with weapon/armor profiles; future `items.container_templates` owns *capacity/allowed shapes/compartments/closure/nesting*, not current contents. Runtime equipment/inventory owns exact item-instance placement, host-and-child attachment relation, nested contents, accessibility state, current closure/durability and save persistence. No magic capacity or weight-free carried container unless later separately authorized.

**Identity invariants:** a unique item has one authoritative location; parent/child mounts and nested containment are acyclic; removal of belt/coat/pack preserves attached gear and contents or returns a validated placement/spill decision; destroy/steal/loot/transfer/restart never duplicate, silently delete, or teleport items. Current fungible stacks remain appropriate for operationally interchangeable materials and coins as permitted by currency/quantity owner. Do not expand the UI session-flag item metadata stash as a surrogate instance model.

A future contextual equip/attach/store/detach/draw resolver must return permitted action, exact blockers, and explicit transaction plan before atomic mutation. Compact Character overview stays uncluttered; conditional attachment and compartment inspection can expand on item selection rather than permanently displaying a slot for every loop, pocket and hook.

## 4. Workmanship, material, and per-item quality

### 4.1 Keep independent quality vocabularies

The provisional user-facing crafted **workmanship** ladder is `poor`, `standard`, `good`, `fine`, `excellent`, `masterwork` for trades where appropriate. Final thresholds and culture/domain labels are deferred. An item's single grade summarizes its result but **does not replace its realized properties**.

The existing marketplace mystery-assortment `band_0..band_3` is a **selection/presentation tier** with category-specific meanings, not an item workmanship rank or a universal conversion to the six-grade ladder. Material grade, rarity/scarcity, recipe mastery, workmanship, condition/wear, magical properties, and price are also distinct.

### 4.2 Item-family functional quality

Each item-family property profile selects applicable dimensions and constraints, for example:

| Family | Candidate underlying dimensions |
| --- | --- |
| Sword / knife | balance, edge geometry, sharpness, edge retention, structural integrity, maximum durability |
| Bow | draw consistency, limb/string integrity, release behavior |
| Armor / gauntlet | protective integrity, fit, articulation, fastening reliability, mobility/coverage |
| Clothing / cloak | seam quality, flexibility, insulation, finish, weather resistance |
| Belt / pouch / backpack | strap/seam strength, closure security, max safe load, comfort, water resistance |
| Tools | precision, cutting/working efficiency, resilience, maintainability |
| Jewelry / fittings | precision, security of setting, finish, compatibility with selected mount |

Do not add irrelevant dimensions universally. A poor longsword may have weaker balance, edge retention, sharpness and maximum durability by different amounts. A Fine longsword can have a strong edge but only adequate balance. Two items sharing the label **Fine** need not share identical final stat multipliers. The example percentages discussed conversationally are illustrative and must **not** become accepted balance constants.

Separate design/base item properties, material/composition and processing, realized workmanship, current condition/durability, and effects/enchantment. Material suitability is purpose-specific, not an automatic higher-tier upgrade; processing may change material behavior only through the appropriate craft/material owner. Workmanship may affect physical fit within authored tolerances or fastening reliability but must not invent unlisted mount hardware, bypass a blocked anchor, or add magical storage capacity.

A differentiated finished item requires durable identity and persisted property/provenance values. Wear and repair affect **condition** and repair history, not silently reroll original workmanship or maximum design capability. Reforging/rebuilding/enhancement requires its own declared transformation. Merchant value belongs to economy; discovery/inspection may show estimated or incomplete quality knowledge rather than omniscient hidden values.

## 5. NPC artisan capability and per-craft variance

A crafting NPC should have a **typical competence** for an eligible trade and a **stable individualized deviation**, with skill rank on the existing 1–125 scale and any actual breakthrough rules satisfied. An illustrative journeyman template at 62 with a persistent `±8` initial variation is only a modeling example, not the final rank/band table. Generate a stable personal skill distribution once rather than reroll the person's base competence for each new item. Support narrow specializations (forging blades, toolmaking, armor, heat treatment, fine finish) without equating profession labels, job ids, skill tags or authored `civilization.people` with a fully realized runtime worker.

**Effective crafting outcome** depends on authorized recipe/process difficulty, relevant true skill(s), precise current attributes, recipe familiarity, condition/fatigue, real material properties, tool condition, station capabilities, environment, assistants, active supervision, and bounded per-output variation. Skill should dominate technique and typical consistency; recipe and material/facility prerequisites limit feasible outputs. An apprentice does not routinely make Masterwork from lucky rolls; a legendary smith cannot make every item Masterwork from poor material in an unsuitable forge.

Different steps should weight different attributes: heavy shaping may use STR/CON; fine fitting DEX; metallurgy INT and judgment WIS; VIT affects recovery rather than acting as a duplicate universal craft-quality bonus. Respect the existing Blacksmithing skill's authored STR/INT relationships without interpreting those tags as already-executing universal math. Training under a legendary mentor can (i) improve actual learning over sessions and (ii) assist supervised work; passive proximity is not an unconditional permanent bonus. Facility, material and tool gates are specific requirements or tolerances, not necessarily multipliers on one scalar.

RNG must be seeded from a **unique craft event/output identity**, resolved once, and persisted at item creation. A craft may yield a consistent grade expectation plus bounded variable dimensions, flaws, waste, time or success outcomes. Every meaningful output in bulk production retains unique result identity and outcome semantics; neither inventory transfer nor container opening rerolls. Define failure, partial output, salvage and overproduction explicitly rather than covertly transforming a low-grade item into a different identity.

Existing `resolveCraftAtSettlement` with `workerSkills`, time, waste, quantity and `qualityFactor` is an **economy projection**. It must not be misrepresented as unique NPC craft execution or used as the owner of persistent individual item quality. Current `crafting.recipes` records are planned static transformations, not instantiated outputs. A dedicated future craft command must bridge inputs, permission, actor, station, output-instance creation, skill practice, economic consequences and transactional persistence without duplicating macro-economy authority. Generated workers need a campaign-local identity, skill/attribute/mentor and progression owner; do not put mutable worker facts in authored people/NPC identity schemas.

## 6. Joint dependency order

1. **Design/authority reconciliation:** confirm one current-attribute resolver, a nonduplicated wearable-fit owner, item-family quality property profiles, generated worker identity and an actual craft output owner. Decide exact fields and profile references before schemas.
2. **Precision and migration:** versioned fixed-point developed/structural/current attribute contract, migration of existing integer values and `statGrowth.progress`, stat consumer audit, deterministic growth receipts.
3. **Durable item instances and locations:** unique equipment/containers, safe fungible stack retention, mounted/nested item graph, atomic equip/detach/store/move, restart preservation.
4. **Static capability profiles:** wearable coverage, attachment and fit; container template capacities and nesting; material and item-family dimensions; exact category vocabulary and validation.
5. **Craft output command:** process stages, eligible ingredients/tools/workplaces, actor stats and skill, stable RNG, per-instance quality/condition, consumed inputs and failed/partial outcomes. Preserve macro-economic projection separation.
6. **Generated artisan runtime:** stable campaign-local worker identity, rank distribution, specialization, training/supervision, fatigue/recovery, individual output history; integrate settlement and market only with correct owners.
7. **UI and broader content:** compact valid placement, expandable attachments/storage, item inspection with epistemic limits, merchant/commission provenance, staged representative archetypes, balance simulations, and wider content.

Do not advance GAME_VERSION, declare new `DEV-` primary milestone, change current installed Codex route, or claim execution acceptance from this planning work.

## 7. Representative acceptance fixtures and validation gates

- STR 12.527 shows `12` in the ordinary character UI, while eligible underlying checks genuinely consume 12.527; 12.999→13.000 changes display exactly once.
- Recovery conversion produces expected fractional development without duplicate progress, stat-boost reapplication, rounding drift, or save/reload gain. Trivial spam and same-event retry cannot farm a gain; legitimate action/recovery timing remains meaningful.
- INT, SPT, CHA gain activities are owner-authored and distinguish real eligible action from merely clicking an interaction.
- Earrings plus circlet may coexist; enclosing helmet and full gauntlet independently resolve fit/accessibility/blocked behavior rather than treating all head/arm slots as identical.
- Belt/coat/backpack, filled detachable pouch, integrated pocket, sheath with sword, and sided thigh mount preserve graph identity on unequip, drop, trade, death/loot, destruction, save/restart. Reject cyclic containment and over-capacity.
- Poor versus Fine swords of the same base design/material have persisted, dimension-specific variance; item grade never replaces actual edge/balance/durability. Repair does not reroll workmanship or grant a new item id.
- Two generated journeymen have persistent personal deviations and specialty differences; one maker's repeated output varies within plausible bounded distributions. Same craft receipt replay creates no duplicate or rerolled output.
- Mentor, facility, tools, material, fatigue and recipe difficulty have observable and testable effects on appropriate stages without overriding hard prerequisites. Apprentice Masterwork outcomes require explicit eligibility and genuinely exceptional evidence.
- Economy production estimate and player/NPC craft command remain separate; inventory, market, world, and Chronicle owners receive only properly validated accepted receipts.

## 8. Deferred decision register and reopen triggers

| Question / seam | Current posture | Reopen only when |
| --- | --- | --- |
| Precise stat representation, conversion and rounding | User intent accepted; formula, save and migration deferred | One stat-growth owner and cross-consumer migration slice selected |
| Attribute source weights and precise growth rate | Existing global rules retain authority; additional weights unapproved | Concrete study, social, magic, combat or crafting action owner supplies measurable meaningful event |
| Accessory fit, layered coverage, attachment capacity and constraints | Physical design direction accepted; no new static authority authorized | Equipment profile and item-instance runtime owner jointly scoped |
| Nested movable containers and pockets | Static container template + item-instance/runtime contracts missing | Exact non-fungible storage/movement consumer and persistence plan selected |
| Workmanship grades and functional variance per item family | Six-label candidate only; numeric ranges unapproved | First durable differentiated craft/loot/repair output needs family-owned dimensions |
| Skill-based per-craft generation and bounded RNG | Conceptual product direction; production estimate not execution | Crafting command with exact actor, recipe, inventory, station, output identity and atomic mutation |
| Generated artisan average skill ± variation and mentorship | Generated NPC persistence absent; rank-band calibration unapproved | Named generated-worker/profession or commission consumer with campaign-local actor owner |
| Quality inspection, revealed labels, market valuation | Visibility and economy separate | An inspection/market UI needs observed versus actual item-instance truth |

No numeric quality table, chance distribution, nominal crafter rank, growth increment, exact equipment slot schema, or formula from an exploratory conversation is final balance authority. Validate with focused source audits, contracts, simulations and selected end-to-end tests before promotion.
