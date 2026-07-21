# Artisan Mystery Assortment, Stock Window, And Contextual Quality Decision

Date: 2026-07-20

Status: accepted documentation-only design authority; no content, schema, validator, runtime, UI, save, economy, balance, or gameplay implementation permission

Run classification: unversioned cross-domain focused design decision

Milestone impact: `supports_current_band`

## 1. Purpose And Precedence

This decision records the accepted direction for randomized artisan and producer assortments, direct known-quantity store lots, contextual quality bands, finite stock, time-windowed availability, and reuse outside culinary trades.

It supplements:

- `docs/design/culinary-ration-serving-preparation-and-container-labeling-decision.md`;
- `docs/design/regional-ration-manifest-and-container-knowledge-decision.md`;
- `docs/design/item-equipment-inventory-authority-boundary-decision.md`;
- `docs/design/economy-authority-boundary-decision.md`;
- `docs/design/recipe-and-production-schema-decision.md`;
- `docs/design/crafting-authority-boundary-decision.md`.

Where this document is more specific, it controls mystery-assortment semantics, tier posture, stock timing, producer scope, contextual quality, and direct-lot coexistence.

The term `gacha` may be used internally as a design analogy for a randomized assortment. Player-facing names must remain grounded, physical, lore-appropriate goods rather than modern monetization terminology.

No implementation or new item content is authorized.

## 2. Direct Known Lots And Mystery Assortments Coexist

Artisan mystery assortments do not replace ordinary known store goods.

A merchant or producer may sell exact, directly described lots such as:

- a single loaf;
- half a dozen rolls;
- a dozen muffins;
- a dozen pastries;
- a measured sack of flour;
- a bolt of cloth;
- a hide of known leather;
- a bundle of known boards;
- a stated weight of metal stock.

These direct lots have known item identities, quantities, and manifests unless fraud or inspection rules create a separate discrepancy.

The same seller may also offer a mystery assortment such as a `Baker's Basket`, `Tailor's Scrap Bundle`, or `Smith's Assortment`. The assortment is purchased as a physical package with a resolved but potentially character-unknown manifest.

Direct lots provide certainty and specific planning. Mystery assortments provide variety, discovery, occasional value, and a market for surplus, offcuts, mixed production, or prestige leftovers.

## 3. Mystery Manifests Resolve Before Opening

Mystery does not mean opening-time generation.

The true manifest must be resolved and persisted when the physical stock unit or lot is generated. If a future market implementation does not instantiate individual stock before sale, it may resolve the manifest during the sale transaction immediately before ownership transfer. It must never wait until the player opens the package.

Required posture:

- opening reveals existing truth and never rerolls it;
- save/load preserves the same manifest;
- transfer preserves the same manifest;
- stock inspection, fraud, weight, value, and provenance can operate against an existing truth;
- visually identical unknown assortments may share one presentation group while retaining per-unit manifests;
- the seller's claim and the buyer's knowledge remain separate from true contents.

This is consistent with the accepted creation-time manifest and heterogeneous visible-group decisions.

## 4. Standard Three-Tier Assortment Template

Use one reusable three-tier template as the default. A particular producer may expose only two tiers when three would be redundant, but tier behavior must be mapped explicitly rather than improvised per shop.

The template operates on contextual assortment bands rather than one universal cross-domain quality meaning:

- `band_0`: clearance, scrap, day-old, irregular, low-grade, or otherwise least desirable but still honestly saleable for the stated offer;
- `band_1`: ordinary, standard, fresh, serviceable, or expected trade quality;
- `band_2`: fine, select, premium, specialty, unusually useful, or expensive quality;
- `band_3`: rare, exceptional, prestige, masterwork-adjacent, luxury, or otherwise scarce outcome.

The exact meaning of each band is defined by the producer/category profile. A fine pastry, fine leather hide, fine alloy billet, and fine medicinal herb do not share the same physical quality attributes merely because they occupy the same assortment band.

### Tier I — Clearance Assortment

Common player-facing prefixes or postures include:

- `Day-Old`;
- `Surplus`;
- `Scrap`;
- `Offcut`;
- `Seconds`;
- `End-of-Batch`;
- another trade-appropriate clearance term.

Candidate default per-slot band weights:

| Contextual band | Weight |
| --- | ---: |
| `band_0` | 68% |
| `band_1` | 27% |
| `band_2` | 4% |
| `band_3` | 1% |

Tier I has no minimum above `band_0`. It is usually discounted and may contain small, irregular, older, cosmetically imperfect, mixed, or low-value goods. It should still exclude unusable or undisclosed hazardous waste unless the offer explicitly says otherwise.

### Tier II — Standard Artisan Assortment

Common player-facing postures include:

- an unqualified producer assortment such as `Baker's Basket`;
- `Fresh`;
- `Standard`;
- `Assorted`;
- another ordinary trade name.

Candidate default per-slot band weights:

| Contextual band | Weight |
| --- | ---: |
| `band_0` | 0% |
| `band_1` | 72% |
| `band_2` | 23% |
| `band_3` | 5% |

Tier II has a `band_1` floor. It represents ordinary saleable trade output with a meaningful chance of fine or rare value.

### Tier III — Select Assortment

Common player-facing postures include:

- `Select`;
- `Fine`;
- `Festival`;
- `Master's Selection`;
- `Prestige`;
- `Luxury` where context supports it;
- another producer-appropriate high-tier name.

Candidate default per-slot band weights:

| Contextual band | Weight |
| --- | ---: |
| `band_0` | 0% |
| `band_1` | 0% |
| `band_2` | 80% |
| `band_3` | 20% |

Tier III has a `band_2` floor and materially increases the chance of rare or expensive goods. A producer-specific profile may add one guaranteed premium slot, but that is an explicit authored rule rather than a global assumption.

### Balance posture

These percentages are accepted candidate defaults for later balancing, not implemented values. A future balance package may tune them while preserving:

- increasing minimum band by tier;
- increasing rare/expensive chance by tier;
- no hidden downgrade below the stated floor;
- explicit slot count and pool eligibility;
- deterministic, persisted results;
- category-specific quality mapping.

## 5. Slot And Pool Rules

A mystery assortment should use a constrained slot manifest rather than selecting arbitrary items from an entire catalog.

A future profile should define at minimum:

- producer or trade family;
- physical package/container identity;
- tier;
- slot count or bounded slot-count range;
- eligible item or commodity pools by contextual band;
- quantity range per eligible result;
- duplicate permissions and caps;
- mutually exclusive result groups where necessary;
- minimum and maximum expected value posture;
- perishability or condition eligibility;
- regional, seasonal, settlement, event, and producer prerequisites;
- whether contents are listed, partly described, or character-unknown.

The assortment should not roll nonsensical cross-trade results merely because they share a broad material tag. A baker's assortment does not contain blacksmithing offcuts unless it is explicitly a mixed-market or salvage lot.

## 6. Contextual Quality, Not One Universal Quality Flag

Assortment bands are selection and presentation bands. They do not replace domain-specific quality truth.

Examples of contextual quality dimensions include:

### Baker, pastrymaker, or confectioner

- freshness and remaining useful life;
- flour refinement;
- enrichment with fat, eggs, sweetener, fruit, nuts, or spices;
- bake quality and finish;
- rarity or expense of ingredients;
- decorative labor;
- portion size and consistency.

Illustrative progression:

```text
Day-Old Baker's Basket
-> Baker's Basket or Fresh Baker's Basket
-> Select Baker's Basket, Festival Baker's Basket,
   Oven-Warm White Loaf Selection, or another lore-native premium offer
```

The examples do not authorize those exact items.

### Butcher, fishmonger, cheesemaker, or preserved-food producer

- freshness;
- cut or portion desirability;
- usable yield;
- fat, cure, smoke, aging, or preservation quality;
- rarity of source animal or ingredient;
- preparation labor;
- condition and storage history.

### Apothecary, herbalist, spice merchant, or alchemist

- purity;
- freshness;
- potency;
- rarity;
- provenance;
- processing quality;
- contamination or adulteration posture;
- documentation, seals, and trusted source.

### Tailor, weaver, leatherworker, or textile merchant

- fiber or hide type;
- usable dimensions;
- weave, tanning, dye, and finish;
- condition;
- color consistency;
- rarity;
- amount of waste or irregularity.

### Carpenter, joiner, woodworker, or lumber merchant

- species;
- dryness and seasoning;
- straightness;
- dimensions;
- knots, splits, rot, or warping;
- cut and finish;
- scarcity and intended use.

### Smith, foundry, metalworker, or toolmaker

- material or alloy;
- purity;
- usable mass and dimensions;
- defects or contamination;
- processing stage;
- finish;
- scarcity;
- workmanship where a finished good is eligible.

The eventual quality owner must preserve the underlying domain attributes rather than relying solely on `band_0` through `band_3`.

## 7. Culinary Producer Scope

Culinary assortment direction is broader than the initial examples.

Potential producer or merchant families include:

- baker;
- pastrymaker or patisserie-equivalent;
- confectioner;
- chocolatier or lore-native chocolate/cacao-equivalent specialist where the world supports it;
- butcher;
- fishmonger;
- cheesemaker;
- dairyer or creamery-equivalent producer;
- brewer, vintner, cidermaker, meadmaker, or distiller where supported;
- spice merchant;
- grocer;
- farmer or market gardener;
- orchardist;
- herbalist;
- apothecary;
- alchemist;
- preserver, pickler, smoker, curer, or another specialty producer.

These are category directions, not authorization to add professions, buildings, NPCs, items, or recipes without live repository support and a focused content decision.

A culinary mystery assortment is not automatically a complete meal. It may contain ingredients, direct foods, sweets, condiments, preserved goods, fresh perishables, or mixed producer output according to its manifest.

## 8. Nonculinary Reuse

The same mystery-assortment framework may be used outside food without creating a separate random-box system.

Illustrative families include:

### Textiles and leather

- `Scrap Textiles`;
- `Tailor's Scrap Bundle`;
- `Leather Scraps`;
- `Leatherworker's Offcuts`;
- `Assorted Textiles`;
- `Tailor's Bundle`;
- `Fine Cloth Selection`;
- `Fine Tanned Leather Selection`.

A textile scrap pool may contain controlled quantities of cloth, leather, cord, thread, wax, needles, buttons, fasteners, or other approved textile-working materials. Exact eligibility must be authored; the assortment must not infer unrelated contents.

### Wood

- wood scraps or offcuts;
- carpenter's offcut bundle;
- ordinary boards or stock assortment;
- select joinery wood;
- fine carved or processed stock where supported.

### Metal

- metal scrap;
- smith's scrap crate;
- ordinary metal stock assortment;
- selected alloy or processed stock;
- fine forged stock or another contextually appropriate premium result.

### Other producer families

The same pattern may later support:

- mason or stoneworker remnants;
- potter's seconds;
- glassworker's cullet or offcuts;
- fletcher or bowyer offcuts;
- cooper's stave and hoop assortment;
- candlemaker or chandler wax ends;
- scribe, bookbinder, or parchment scraps;
- jeweler, lapidary, enchanter, or magitech producer assortments where later authority permits them.

These examples are non-exhaustive and do not authorize content.

## 9. Ingredient And Production-Surplus Assortments

A producer may sell ingredient or material surplus in addition to finished-output assortments.

Examples include a baker's ingredient bag containing a controlled assortment of approved flour, eggs, sweetener, fats, dried fruit, nuts, or spices; a tailor's notions bundle; a smith's fuel and flux remnants; or a carpenter's fastener and offcut lot.

Eligibility must follow actual production inputs and seller context. A surplus assortment must not invent ingredients or materials that the producer does not use, stock, or plausibly acquire.

Ingredient assortments remain distinct from finished-goods assortments and should not silently substitute between those pools.

## 10. Stock, Replenishment, And Availability Windows

Assortment tier and stock posture are related but separate.

### Clearance, day-old, surplus, scrap, and seconds

- generated from prior production, excess inventory, offcuts, irregular goods, or an authored clearance source;
- finite quantity;
- commonly available near opening, production rollover, or another contextually appropriate release time;
- no automatic same-day replenishment unless another production batch creates more;
- removed, expired, consumed by ambient demand, or reclassified after a short sale window according to future economy and condition owners;
- intended to sell quickly because availability is limited and price/value is attractive.

A documentation-only design cannot claim simulated NPC sell-through already exists. Before dynamic demand is implemented, a deterministic finite stock and expiry/withdrawal window may represent the intended pressure.

### Fresh or standard stock

- finite production-batch quantity;
- replenishes at authored production intervals rather than infinitely after each purchase;
- availability depends on producer capacity, inputs, season, settlement, and operating schedule;
- may sell out before the next replenishment.

### Select, luxury, event, or prestige stock

- very limited quantity;
- may appear only during narrow hours, busy periods, market days, festivals, celebrations, commissions, catering, noble orders, guild events, or leftovers from such work;
- may be absent on ordinary days;
- may have a higher price and higher contextual quality floor;
- must not be guaranteed merely because the player waits at the shop.

Exact schedules, demand simulation, production replenishment, and stock mutation remain future economy/runtime work.

## 11. Honest Clearance Versus Fraud

A low-tier assortment is not automatically fraudulent, spoiled, unsafe, or worthless.

Honest clearance may include:

- day-old but still edible bread;
- small or irregular pastries;
- cosmetically imperfect goods;
- short pieces of usable cloth;
- leather or wood offcuts;
- mixed small quantities;
- older stock with clearly represented condition;
- seconds that remain usable for some purposes.

Undisclosed rot, contamination, false origin, hidden unusable filler, or deceptive top layers belong to the separate fraud and inspection model. Difficulty and seller ethics may affect fraud, but the declared assortment tier must not itself authorize lying below its stated floor.

## 12. Physical Package And Container Vocabulary

Mystery assortments must use a suitable physical package identity. The earlier examples of sacks, crates, baskets, jars, and casks were illustrative rather than exhaustive.

Potential physical forms include, where appropriate:

- pouch;
- purse;
- packet;
- wrapper;
- bag;
- sack;
- satchel;
- bundle;
- basket;
- bushel container;
- hamper;
- box;
- case;
- chest;
- crate;
- jar;
- bottle;
- flask;
- jug;
- crock;
- pot;
- tin or metal canister where setting technology permits;
- keg;
- cask;
- barrel;
- bale;
- bolt;
- roll;
- rack;
- pallet, cart, wagon, or other bulk transport posture where later supported.

The package name should match the actual container and goods. A basket is not used merely because `Basket` sounds artisanal.

Static container capabilities and mutable instance contents/state remain separate. This list is non-exhaustive and does not authorize adding every container.

## 13. Pricing And Expected Value Posture

A mystery assortment's price should be based on an authored expected-value posture, the seller, tier, stock context, package, and uncertainty. It should not be recalculated from player-visible contents when those contents are unknown.

General direction:

- clearance tiers normally offer a discount against expected direct-lot value because of age, irregularity, uncertainty, or mixed usability;
- standard tiers aim near ordinary expected trade value with variance;
- select tiers may charge a premium for the higher floor, scarcity, convenience, prestige, packaging, or rare-result chance;
- realized contents may be worth somewhat more or less than the purchase price;
- expected-value bounds and duplicate caps should prevent trivial infinite-profit loops;
- fraud, appraisal, reputation, and haggling remain separate systems.

No exact prices or currencies are authorized here.

## 14. Required Repair Of The Active Culinary Audit Artifacts

The active `Culinary Integration Results Repair And Contract Acceptance Audit` must incorporate this direction without implementing it.

At minimum, its repaired artifacts must:

1. state that artisan assortments are constrained randomized physical manifests rather than merely themed names;
2. distinguish direct known lots such as a dozen muffins from mystery assortments;
3. preserve creation-time or pre-transfer manifest resolution and reject opening-time RNG;
4. record the reusable three-tier clearance/standard/select template and contextual quality mapping;
5. distinguish tier from stock availability and release windows;
6. include culinary and nonculinary producer applicability;
7. make container examples explicitly non-exhaustive;
8. separate honest clearance from fraud and unsafe goods;
9. retain finite day-old/surplus stock, scheduled fresh replenishment, and narrow luxury/event availability as future economy/runtime direction;
10. add the cross-domain assortment owner and package dependency questions without authorizing content or implementation.

## 15. Route And Non-Goals

The completed culinary integration audit remains blocked from durable promotion until its current repair incorporates this more specific direction and passes GPT/human inspection.

`Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` remains paused and recoverable.

This decision changes no item, recipe, material, ration, provision, artisan assortment, store stock, profession, NPC, service, container, schema, validator, test, runtime, UI, save, economy, market, price, schedule, difficulty, dependency, asset, or gameplay behavior.