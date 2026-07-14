# Cross-Domain Natural Resources, Materials, Production, And Magitech Research Program

Date: 2026-07-14
Status: approved user-intent research program; documentation only

## 1. Decision Summary

After `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` is accepted, pause the numbered static-content sequence before `0.6.6` and run a coordinated GPT Deep Research program covering natural sources, usable byproducts, ingredients, materials, refinement, food processing, crafting production, and bounded magical technology.

This is an overall research program, but it must preserve the repository's one-gate/one-artifact discipline. Do not collapse the entire subject into one catch-all report. Run seven named `GPT-DR.*` gates in sequence, commit one temporary cited artifact per gate, then run one unversioned Codex documentation integration that promotes repo-corrected guidance, retires or retains each temporary artifact explicitly, and installs the research-informed `0.6.6` prompt.

The program is research and planning only. It authorizes no content JSON, schemas, validators, tests, runtime, UI, saves, migrations, assets, generated output, economy behavior, gathering, crafting execution, spell casting, enchanting execution, or gameplay changes.

## 2. User Intent

The research must support a broad, internally coherent production world rather than only the 30 recipes expected after `0.6.5`.

It must cover:

- wild and cultivated flora;
- fungi and other useful biological sources where supported;
- wild, domestic, aquatic, and monster-adjacent fauna;
- edible, medicinal, toxic, ritual, textile, structural, fuel, dye, pigment, oil, wax, resin, tannin, fiber, hide, bone, horn, antler, shell, chitin, feather, sinew, gland, fat, blood, venom, and other plausible outputs or byproducts;
- minerals, ores, salts, stone, clay, sand, fuels, water, and other nonliving sources;
- ingredients, raw materials, prepared materials, intermediate goods, finished goods, residues, waste, recoverable scraps, and reusable byproducts;
- gathering, harvesting, extraction, cleaning, sorting, grading, preserving, refining, processing, cooking, manufacturing, assembly, repair, and recycling chains;
- tools, workplaces, infrastructure, specialist skills, environmental needs, and technological prerequisites;
- regional and cultural variation;
- ordinary technology, magic-assisted technology, and rare magical substitution.

The research must distinguish useful simulation depth from catalog noise. Real-world complexity is evidence, not an automatic instruction to model every stage.

## 3. Current Repository Reality

The research starts from live repository authority rather than external assumptions.

Current foundations include:

- 1,372 item identities and 1,617 static market-value records;
- 132 fauna records, 24 monsters, regional ecology profiles, habitats, biomes, flora, minerals, and related Knowledge foundations;
- planned resource and commodity authorities with only two records each, still paused for broad expansion;
- production chains, workplaces, tools, skills, recipe schemas and validators, and the `0.6.5` recipe expansion;
- elemental vessel tiers `shard`, `crystal`, and `cluster`, including fixed Ice vessels;
- vessel capacity, efficiency, stability, attunement, recharge method, mismatch, reuse, and permanent-enchant consumption metadata;
- conduit, catalyst, spell-compatibility, enchanter, magical-material conductivity, and retention foundations;
- no general gathering, extraction, crafting-execution, enchanting-execution, dynamic economy, storage, quality, spoilage, labor, fuel, or production runtime owner.

External research must never override current repository facts or durable ownership decisions. When external findings expose a contradiction or weak abstraction, the integration pass must classify it and recommend a bounded repair or future authority.

## 4. Technology And Magic Coexistence Rule

### 4.1 Mundane Baseline

The ordinary economy and daily-life baseline should remain achievable through setting-appropriate nonmagical technology.

Research must first identify the mundane process, its tools, facilities, materials, labor, fuel, environmental dependencies, throughput, maintenance, and limitations. Magic must not be used to avoid researching the underlying technology.

The world must not silently receive modern industrial capability merely because magic exists.

### 4.2 Magic Is Attractive But Not Universal

Magic should offer meaningful player-facing utility and broad opportunities for specialization. Most players are expected to be interested in magic, so the content model should provide useful magical production, preservation, infrastructure, exploration, medicine, defense, and artisan paths.

However, magical substitution is not the default household or settlement baseline.

Availability should normally distinguish:

1. household or subsistence practice;
2. common village or town craft;
3. urban specialist craft;
4. guild, temple, academy, military, or major-merchant infrastructure;
5. elite, strategic, or capital-scale magical infrastructure;
6. rare, exceptional, relic, or legendary capability.

A magical solution may be common within an institution or wealthy city while remaining uncommon across the wider world.

### 4.3 Magical Substitution Requirements

Every proposed magical analogue or augmentation must evaluate:

- element or affinity;
- spell, enchantment, ward, ritual, vessel, conduit, catalyst, or infrastructure route;
- vessel tier and capacity;
- efficiency and stability;
- fixed versus attunable affinity;
- permanent-enchantment consumption;
- recharge method and recharge access;
- ambient temperature, humidity, weather, terrain, elemental pressure, and other environmental effects;
- target size, mass, volume, area, duration, temperature change, force, throughput, or precision;
- material conductivity and retention;
- mundane insulation, housing, framing, seals, fittings, and safety components;
- enchanter or caster skill and affinity requirements;
- installation, maintenance, inspection, repair, and failure posture;
- scarcity, transport, security, theft, and replacement risk;
- cost relative to mundane alternatives;
- who can realistically access the result;
- whether the effect is portable, fixed, temporary, rechargeable, consumptive, or permanent;
- whether the proposal belongs in static content, a future schema, a runtime system, lore only, or should be rejected.

Magic must obey resource and authority constraints. It must not become a free source of matter, energy, refrigeration, sanitation, healing, transportation, communication, or industrial throughput by inference.

### 4.4 Technology-Substitution Classes

Research should classify each candidate as:

- `mundane_only`: no magical route is needed or justified;
- `mundane_baseline_magic_assisted`: ordinary technology works, while magic improves reliability, quality, safety, reach, or throughput;
- `parallel_magical_specialty`: a magical method exists as a specialist alternative rather than replacing the ordinary craft;
- `magic_equivalent_institutional`: magic can replace a modern-like function, but only through costly institutional infrastructure;
- `magic_exclusive`: the result has no mundane equivalent in the setting;
- `unstable_or_prohibited`: the concept breaks current canon, ownership, economy, or balance assumptions.

The research may recommend different classes by region, settlement scale, institution, or era.

## 5. Required GPT Deep Research Gates

Run these gates in order unless a fresh dependency audit proves a different order is necessary.

| Order | GPT-DR label | Core topic | Recommended mode | Temporary artifact |
| ---: | --- | --- | --- | --- |
| 1 | `GPT-DR.resources.gathering-extraction` | Wild resources, nodes, mining, quarrying, forestry, fishing, foraging, harvesting, extraction, and initial preparation | Extra High | `docs/dev/tmp-resources-gathering-extraction-research-YYYY-MM-DD.md` |
| 2 | `GPT-DR.ecology.flora-fauna-byproducts` | Useful flora, fungi, fauna, aquatic life, monster-adjacent biological materials, body parts, seasonal outputs, residues, hazards, and ecological constraints | Extra High | `docs/dev/tmp-ecology-flora-fauna-byproducts-research-YYYY-MM-DD.md` |
| 3 | `GPT-DR.agriculture.land-food-livestock` | Cultivation, husbandry, fodder, soil, water, harvests, staple ingredients, domestic outputs, and farm-level processing | Extra High | `docs/dev/tmp-agriculture-land-food-livestock-research-YYYY-MM-DD.md` |
| 4 | `GPT-DR.materials.refinement-processing` | Fibers, hides, wood, stone, clay, glass, metals, salts, oils, waxes, resins, dyes, pigments, fuels, binders, ceramics, and intermediate material states | Ultra | `docs/dev/tmp-materials-refinement-processing-research-YYYY-MM-DD.md` |
| 5 | `GPT-DR.food.processing-preservation` | Butchery, milling, baking, cooking, brewing, fermentation, smoking, salting, pickling, drying, rendering, dairy, oils, sauces, medicines, and culturally distinct food chains | Extra High | `docs/dev/tmp-food-processing-preservation-research-YYYY-MM-DD.md` |
| 6 | `GPT-DR.crafting.tools-workplaces-production` | Craft processes, assembly order, tools, workplaces, heat, fuel, water, drying, curing, finishing, maintenance, waste, salvage, and technology-level capability | Extra High | `docs/dev/tmp-crafting-tools-workplaces-production-research-YYYY-MM-DD.md` |
| 7 | `GPT-DR.magitech.production-infrastructure-substitution` | Magic-assisted production and infrastructure, elemental vessels, catalysts, enchanted containers, preservation, heating, lighting, pumping, lifting, medicine, transport, communication, and adoption constraints | Ultra | `docs/dev/tmp-magitech-production-infrastructure-substitution-research-YYYY-MM-DD.md` |

Use Ultra for the entire program when source budget permits. Per-gate recommendations above are the minimum preferred settings, not a prohibition on Ultra.

## 6. Gate-Specific Questions

### 6.1 Resources, Gathering, And Extraction

Research:

- what counts as a resource identity, a source site, a harvested output, and a market commodity;
- renewable versus nonrenewable sources;
- seasonal, geographic, ecological, ownership, access, and safety constraints;
- likely initial preparation before transport or sale;
- extraction residues and recoverable byproducts;
- tools and specialist labor;
- where gathering/extraction should remain abstract;
- how resource identities should relate to current item, commodity, geography, ecology, Knowledge, and production-chain authorities.

Do not implement resource nodes, depletion, yields, ownership, or gathering actions.

### 6.2 Flora, Fauna, And Byproducts

Research:

- useful parts of plants, fungi, terrestrial fauna, aquatic fauna, domestic animals, and plausible monster-derived materials;
- distinctions between primary product, coproduct, byproduct, waste, dangerous residue, and culturally prohibited use;
- food, medicine, poison, dye, fiber, oil, wax, resin, tannin, fuel, feed, fertilizer, hide, bone, horn, shell, chitin, feather, sinew, gland, blood, venom, and ritual uses;
- cleaning, stabilization, preservation, and contamination risks;
- seasonality, life stage, sex, habitat, diet, and regional variation where material;
- ecological consequences and why catalog presence must not imply infinite harvest.

Do not create population simulation, harvesting execution, body-part drops, dynamic loot, or medical effects.

### 6.3 Agriculture, Land, Food, And Livestock

Research:

- plausible staple systems by climate and region;
- crop rotations, soil amendment, irrigation, drainage, storage, fodder, animal traction, manure, and household versus estate-scale production;
- domestic animal products and slaughter byproducts;
- farm-level transformations before specialist craft;
- crop and livestock failure pressures;
- where magic could assist weather protection, irrigation, pest control, preservation, or fertility without replacing ordinary agriculture as the baseline.

Do not create farming simulation, land ownership, weather execution, crop timers, or production yields.

### 6.4 Materials, Refinement, And Processing

Research dependency-closed chains for at least:

- bast, wool, hair, silk-like, and other fibers;
- hides, rawhide, leather, parchment, glue, gelatin, horn, bone, and sinew;
- timber, lumber, charcoal, ash, pitch, tar, resin, cork, bark, and paper-like materials;
- stone, lime, plaster, mortar, clay, brick, tile, pottery, ceramic, glass, sand, and abrasives;
- copper, bronze, iron, steel, precious metals, magical metals, ores, concentrates, fluxes, slag, bloom, ingot, billet, plate, wire, ring, and blade intermediates;
- salt, pigments, dyes, inks, oils, waxes, soap, candles, fuels, solvents, mordants, tannins, and binders;
- gemstones, crystals, lapidary components, conduits, catalysts, and enchantment-compatible housings.

For every chain, distinguish essential intermediate identities from optional realism that would create low-value catalog noise.

### 6.5 Food Processing And Preservation

Research:

- ingredient classes and preparation states;
- grain cleaning, milling, doughs, breads, pastries, porridges, and regional analogues;
- meat, fish, dairy, eggs, fats, oils, vegetables, fruits, fungi, herbs, spices, sweeteners, and beverages;
- smoking, salting, drying, pickling, fermenting, brewing, curdling, rendering, pressing, and cellar storage;
- cookware, ovens, hearths, mills, smokehouses, presses, dairies, breweries, kitchens, and cold storage;
- food safety and spoilage at a design level without prescribing hazardous real-world procedures;
- cultural variants and substitutions;
- ordinary preservation versus magic-assisted preservation.

Do not implement hunger, nutrition, spoilage timers, disease, cooking execution, buffs, or consumable effects.

### 6.6 Crafting, Tools, Workplaces, And Production

Research:

- actual process order and dependencies for representative crafts;
- hand tools, measuring tools, jigs, forms, molds, anvils, looms, wheels, kilns, furnaces, mills, presses, cranes, pumps, drying racks, and other infrastructure;
- energy sources such as human effort, animal power, water, wind, wood, charcoal, and magical assistance;
- workplace scale and what can be done at household, village, urban-shop, guild, military, temple, academy, or industrial-complex levels;
- maintenance, sharpening, calibration, repair, and consumable tooling;
- yields, losses, offcuts, scrap, slag, ash, wastewater, and recoverable materials;
- where one repository recipe should remain one abstraction versus split into several linked transformations.

Do not implement labor, fuel consumption, queues, timers, quality rolls, tool wear, workplace capacity, or output creation.

### 6.7 Magitech Production And Infrastructure

Research ordinary technology first, then evaluate magical augmentation or substitution for:

- cooling, refrigeration, freezing, cellar stabilization, food and medicine preservation;
- heating, drying, kilns, furnaces, cooking, hot water, and climate control;
- lighting and signaling;
- pumping, drainage, irrigation, water purification, and sanitation;
- lifting, cranes, hoists, mills, and motive power;
- navigation, surveying, mapping, weather warning, and communication;
- medicine, containment, and hazard control;
- metallurgy, glass, ceramics, textiles, agriculture, mining, transport, and construction;
- defensive wards, storage protection, and secure containers.

Every proposal must identify why it is not automatically universal and what makes it attractive to players.

## 7. Shared Research Output Contract

Every artifact must include:

1. **Repo baseline:** relevant current files, counts, schemas, validators, decisions, and missing authorities.
2. **External findings:** cited research with source-quality classification.
3. **Technology compatibility:** likely period/capability range rather than one careless historical label.
4. **Regional and cultural variation:** differences that could produce meaningful content.
5. **Process chains:** source -> preparation -> intermediate -> refinement -> component -> finished product -> byproducts/waste.
6. **Tools and workplaces:** minimum and specialist requirements.
7. **Magic interaction:** none, assistance, parallel specialty, institutional equivalent, exclusive, or rejected.
8. **Content candidates:** identities or relationships worth considering.
9. **Authority classification:** current owner, missing schema/validator precondition, authored-input gate, runtime gate, lore-only, or rejected.
10. **Gameplay-value classification:** foundational, useful optional depth, flavor only, excessive complexity, or future simulation.
11. **Uncertainty:** disputed findings, regional limits, and confidence.
12. **Sources:** citations sufficient for later audit.

Research must not present unsourced fantasy invention as historical or scientific fact. Repo-canon magical extrapolation must be labeled as design inference.

## 8. Content-Candidate Classification

The integration pass must classify each recommendation as one of:

- `factual_correction`: a current record or transformation is materially wrong;
- `missing_static_identity`: a useful source, material, intermediate, tool, workplace, or product identity is absent;
- `missing_static_relationship`: identities exist but the production, ecology, value, geography, or Knowledge relation is absent;
- `schema_or_validator_precondition`: the concept requires a narrow authority change before content;
- `authored_input_required`: external research is insufficient without setting-specific canon;
- `runtime_owner_required`: the concept requires gathering, inventory, quality, spoilage, labor, fuel, crafting, magic, economy, or simulation ownership;
- `lore_or_description_only`: valuable context that should not become a mechanic or catalog record;
- `optional_depth`: useful but not required for the first coherent implementation;
- `rejected_complexity`: plausible but not worth modeling;
- `conflicts_with_canon`: incompatible with current decisions unless the user revises them.

## 9. Example: Ice-Conditioned Containers

The user's intended example is a design test case, not a preselected formula.

Research must compare:

- insulated boxes, cellars, icehouses, evaporative cooling, cold water, seasonal ice, and other mundane preservation methods;
- a small ice-assisted container;
- a permanently enchanted cold chest;
- a portable cold case;
- a healer's medicine chest;
- shipboard or warehouse cold storage;
- large institutional cold rooms.

A magical version may use an Ice shard, crystal, or cluster depending on researched and later-authored requirements such as:

- container volume and insulation;
- desired temperature difference;
- local ambient temperature and humidity;
- duration and opening frequency;
- fixed or portable installation;
- material conductivity and retention;
- recharge access through `cold_soak` or a later approved route;
- enchanter affinity and skill;
- stability, maintenance, and failure risk.

The research may recommend relative tier bands. It must not canonize exact size, temperature, duration, or formula values without a later schema and balance decision.

The mundane container and insulation remain necessary. Magic supplies or stabilizes cooling; it does not automatically provide a modern refrigerator, infinite power, perfect seals, sterile storage, universal affordability, or zero maintenance.

## 10. Source Standard

Prefer, in order:

- archaeological reports and experimental archaeology;
- museum, university, government, and scholarly history-of-technology sources;
- peer-reviewed ethnobotany, zoology, agriculture, food science, materials science, and conservation literature;
- historical manuals and translated primary sources with context;
- reputable specialist references;
- clearly labeled modern analogues used only to explain underlying processes.

Avoid relying on unsourced listicles, game wikis, fantasy crafting lists, AI-generated pages, or a single secondary source for contested claims.

For magic, the repository is the primary source. External fantasy settings may be used only as labeled comparative inspiration and must not become canon by imitation.

## 11. Integration And Sequence

The exact route is:

1. Complete and accept `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`.
2. Install the queued unversioned `Cross-Domain Production Research Integration` Codex prompt as the active hold/integration prompt.
3. Generate and run each named GPT-DR gate from current repository state.
4. Commit one temporary artifact per completed gate.
5. After all seven artifacts exist, run the unversioned Codex integration prompt.
6. Promote durable, repo-corrected guidance into a permanent synthesis.
7. Repair `0.6.5` only if research proves a material factual or authority defect; use the smallest `0.6.5.x` repair and audit.
8. Install a revised exact `Version 0.6.6 - Monster, Ecology, And Loot Static Content Expansion` prompt informed by the research, without broadening it into gathering, crafting, economy, or magic runtime.
9. Continue to `0.6.7`.
10. Preserve the post-`0.6.7` Geographic Knowledge Taxonomy And Location Recognition Contract Plan.

The research program does not consume a `0.6.x` primary version.

## 12. Required Permanent Synthesis

The integration pass should create:

`docs/design/cross-domain-production-research-synthesis.md`

The synthesis must contain:

- accepted technology-capability baseline and uncertainty;
- natural-source and byproduct taxonomy;
- ingredient and material-state taxonomy;
- process and transformation taxonomy;
- tool/workplace/infrastructure scale;
- magic adoption and substitution framework;
- candidate content matrices;
- current authority and blocker map;
- recommended implementation packages and ordering;
- explicit non-goals;
- `0.6.5` repair disposition;
- `0.6.6` implications;
- temporary artifact disposition.

## 13. Non-Goals

This program does not itself:

- add flora, fauna, monsters, items, resources, commodities, recipes, tools, workplaces, production chains, crystals, spells, services, Knowledge, or values;
- modify schemas, validators, tests, lint registration, packages, or dependencies;
- implement gathering, harvesting, extraction, agriculture, livestock, butchery, cooking, crafting, enchanting, alchemy, repair, salvage, trade, vendors, storage, quality, spoilage, labor, fuel, time, weather, population, ecology, or economy simulation;
- define final yields, prices, durations, temperatures, capacities, energy conversion, balance formulas, or drop rates;
- make magic standard, free, universal, self-recharging, perfectly reliable, or consequence-free;
- deny players useful magical paths;
- replace current static or runtime ownership decisions;
- bypass one-gate/one-artifact research discipline.

## 14. Acceptance Principles

The program is successful only when:

- the research covers the overall source-to-finished-product ecosystem rather than only current recipes;
- mundane technology is researched before magical substitution;
- magic remains useful, desirable, and broadly available as a progression path without becoming the universal baseline;
- flora, fauna, minerals, byproducts, intermediates, tools, workplaces, and processes are connected coherently;
- regional, climatic, cultural, and institutional differences are explicit;
- every recommendation is source-backed or labeled as repo-canon inference;
- every recommendation has an owner/readiness classification;
- no research artifact is treated as canonical before integration;
- `0.6.6` receives research-informed static ecology and loot guidance without runtime scope creep;
- the later implementation roadmap favors coherent dependency-closed batches over indiscriminate item inflation.
