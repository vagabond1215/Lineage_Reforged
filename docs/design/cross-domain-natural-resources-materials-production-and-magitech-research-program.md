# Cross-Domain Natural Resources, Materials, Production, And Magitech Research Program

Date: 2026-07-14
Status: approved user-intent research program; active prerequisite before revised `0.6.5`; documentation only

## 1. Decision Summary

The accepted `0.6.5` pre-authoring blocker proved that the previous exact recipe target lacked sufficient transformation and quantity authority. Run this coordinated GPT Deep Research program **before** the revised `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion`.

Preserve one-gate/one-artifact discipline. Run seven named `GPT-DR.*` gates, commit one cited temporary artifact per gate, then run one unversioned Codex documentation integration. The integration promotes repo-corrected guidance and installs a revised exact `0.6.5` prompt.

This program authorizes no content JSON, schemas, validators, tests, runtime, UI, saves, migrations, assets, generated output, economy behavior, gathering, crafting execution, spell casting, enchanting execution, or gameplay changes.

## 2. Corrected Sequence

1. `GPT-DR.resources.gathering-extraction`
2. `GPT-DR.ecology.flora-fauna-byproducts`
3. `GPT-DR.agriculture.land-food-livestock`
4. `GPT-DR.materials.refinement-processing`
5. `GPT-DR.food.processing-preservation`
6. `GPT-DR.crafting.tools-workplaces-production`
7. `GPT-DR.magitech.production-infrastructure-substitution`
8. Unversioned cross-domain research integration
9. Revised `0.6.5` recipe implementation
10. `0.6.6` monster/ecology/loot expansion
11. `0.6.7` cross-content audit
12. Geographic Knowledge and location-recognition contract planning

`docs/design/0.6.5-research-prerequisite-and-recipe-authority-reconciliation.md` owns the route correction and recipe-versus-production-chain default posture.

## 3. User Intent

The research supports a broad, internally coherent production world rather than a fixed list of 30 recipes.

It covers:

- wild and cultivated flora;
- fungi and other useful biological sources;
- wild, domestic, aquatic, and monster-adjacent fauna;
- edible, medicinal, toxic, ritual, textile, structural, fuel, dye, pigment, oil, wax, resin, tannin, fiber, hide, bone, horn, antler, shell, chitin, feather, sinew, gland, fat, blood, venom, and other plausible outputs or byproducts;
- minerals, ores, salts, stone, clay, sand, fuels, water, and other nonliving sources;
- ingredients, raw materials, prepared materials, intermediates, components, finished goods, residues, waste, recoverable scraps, and reusable byproducts;
- gathering, harvesting, extraction, cleaning, sorting, grading, preservation, refinement, processing, cooking, manufacturing, assembly, repair, salvage, and recycling chains;
- tools, workplaces, infrastructure, skills, energy sources, environmental needs, and technological prerequisites;
- regional and cultural variation;
- ordinary technology, magic-assisted technology, and rare magical substitution.

Real-world complexity is evidence, not an automatic instruction to model every stage. Distinguish meaningful simulation depth from catalog noise.

## 4. Current Repository Reality

Start from live repository authority rather than external assumptions.

Current foundations include:

- 1,372 item identities and 1,617 static market-value records at the blocker baseline;
- 12 planned standard recipes across 8 families until revised `0.6.5` lands;
- 131 tool-class items, 58 workplaces, 121 skills, and 121 production chains at the blocker baseline;
- 132 fauna records, 24 monsters, regional ecology profiles, habitats, biomes, flora, minerals, and Knowledge foundations;
- two planned resources and two planned commodities, still paused for broad expansion;
- elemental vessel tiers `shard`, `crystal`, and `cluster`, including Ice vessels;
- vessel capacity, efficiency, stability, attunement, recharge, mismatch, reuse, and permanent-enchant consumption metadata;
- conduit, catalyst, spell-compatibility, enchanter, magical-material conductivity/retention, and infrastructure foundations;
- no general gathering, extraction, crafting-execution, enchanting-execution, dynamic economy, storage, quality, spoilage, labor, fuel, or production runtime owner.

Correct counts through live inspection when the gates run. External research cannot override repository facts or durable ownership decisions.

## 5. Technology And Magic Coexistence

### Mundane baseline

Research the ordinary process first: tools, facilities, materials, labor, fuel, environmental dependencies, throughput, maintenance, limitations, residues, and failures. Magic must not grant modern industrial capability by inference.

### Useful but non-universal magic

Magic should provide meaningful player-facing production, preservation, infrastructure, exploration, medicine, defense, and artisan paths. It is not the default household or settlement baseline.

Classify access as:

1. household or subsistence;
2. common village or town craft;
3. urban specialist craft;
4. guild, temple, academy, military, or major-merchant infrastructure;
5. elite, strategic, or capital-scale infrastructure;
6. rare, exceptional, relic, or legendary capability.

A magical solution may be routine inside one institution while uncommon across the world.

### Magical substitution requirements

Evaluate:

- affinity or element;
- spell, enchantment, ward, ritual, vessel, conduit, catalyst, or infrastructure route;
- vessel tier, capacity, efficiency, stability, attunement, mismatch, reuse, and permanent-enchant consumption;
- recharge method and access;
- ambient temperature, humidity, weather, terrain, and elemental pressure;
- target size, mass, volume, area, duration, temperature difference, force, throughput, and precision;
- material conductivity and retention;
- mundane insulation, housing, seals, fittings, framing, and safety components;
- skill, affinity, installation, maintenance, inspection, repair, and failure;
- scarcity, transport, security, theft, replacement, and cost;
- accessibility and institutional ownership;
- portable, fixed, temporary, rechargeable, consumptive, or permanent posture.

Magic must not become free matter, energy, refrigeration, sanitation, healing, transportation, communication, or industrial throughput.

Classify candidates as:

- `mundane_only`;
- `mundane_baseline_magic_assisted`;
- `parallel_magical_specialty`;
- `magic_equivalent_institutional`;
- `magic_exclusive`;
- `unstable_or_prohibited`.

## 6. Required Gates

| Order | Gate | Core topic | Preferred mode | Artifact |
| ---: | --- | --- | --- | --- |
| 1 | `GPT-DR.resources.gathering-extraction` | wild resources, nodes, mining, quarrying, forestry, fishing, foraging, harvesting, extraction, and initial preparation | Extra High | `docs/dev/tmp-resources-gathering-extraction-research-YYYY-MM-DD.md` |
| 2 | `GPT-DR.ecology.flora-fauna-byproducts` | useful flora, fungi, fauna, aquatic life, monster-adjacent materials, outputs, residues, hazards, and ecological constraints | Extra High | `docs/dev/tmp-ecology-flora-fauna-byproducts-research-YYYY-MM-DD.md` |
| 3 | `GPT-DR.agriculture.land-food-livestock` | cultivation, husbandry, soil, water, fodder, staple ingredients, domestic outputs, and farm processing | Extra High | `docs/dev/tmp-agriculture-land-food-livestock-research-YYYY-MM-DD.md` |
| 4 | `GPT-DR.materials.refinement-processing` | fibers, hides, wood, stone, clay, glass, metals, salts, oils, waxes, resins, dyes, pigments, fuels, binders, ceramics, and intermediates | Ultra | `docs/dev/tmp-materials-refinement-processing-research-YYYY-MM-DD.md` |
| 5 | `GPT-DR.food.processing-preservation` | butchery, milling, baking, cooking, brewing, fermentation, smoking, salting, pickling, drying, rendering, dairy, oils, sauces, medicines, and food chains | Extra High | `docs/dev/tmp-food-processing-preservation-research-YYYY-MM-DD.md` |
| 6 | `GPT-DR.crafting.tools-workplaces-production` | craft order, tools, workplaces, heat, fuel, water, drying, curing, finishing, maintenance, waste, salvage, and capability | Extra High | `docs/dev/tmp-crafting-tools-workplaces-production-research-YYYY-MM-DD.md` |
| 7 | `GPT-DR.magitech.production-infrastructure-substitution` | magic-assisted production, preservation, heating, cooling, lighting, pumping, lifting, medicine, transport, communication, and infrastructure | Ultra | `docs/dev/tmp-magitech-production-infrastructure-substitution-research-YYYY-MM-DD.md` |

Use Ultra for all seven when source budget permits.

## 7. Gate Requirements

### Resources and extraction

Distinguish resource identity, source site, harvested output, market commodity, renewable/nonrenewable source, initial preparation, residues, tools, labor, access, seasonality, hazards, geography, ecology, ownership, and abstraction boundaries. Do not implement nodes, depletion, yields, ownership, or actions.

### Flora, fauna, and byproducts

Cover primary products, coproducts, byproducts, waste, dangerous residues, culturally prohibited uses, stabilization, contamination, seasonality, life stage, habitat, diet, and ecological consequences. Do not implement body-part drops, harvest execution, population simulation, dynamic loot, or medical effects.

### Agriculture

Cover climate-appropriate staples, crop rotations, soil amendment, irrigation, drainage, storage, fodder, traction, manure, domestic outputs, slaughter byproducts, farm transformations, failure pressures, and bounded magical assistance. Do not implement farming simulation, ownership, weather execution, crop timers, or yields.

### Materials and refinement

Cover dependency-closed chains for fibers; hides/leather/parchment/glue/gelatin/horn/bone/sinew; timber/lumber/charcoal/ash/pitch/tar/resin/cork/bark/paper; stone/lime/plaster/mortar/clay/brick/tile/pottery/ceramic/glass/sand/abrasives; ores/concentrates/fluxes/slag/bloom/ingot/billet/plate/wire/ring/blade and magical metals; salts/pigments/dyes/inks/oils/waxes/soap/candles/fuels/solvents/mordants/tannins/binders; gemstones/crystals/lapidary components/conduits/catalysts/enchantment housings. Separate essential identities from catalog noise.

### Food processing

Cover preparation states, grains, doughs, breads, pastries, porridges, meat, fish, dairy, eggs, fats, oils, vegetables, fruits, fungi, herbs, spices, sweeteners, beverages, smoking, salting, drying, pickling, fermenting, brewing, curdling, rendering, pressing, cellars, cookware, ovens, hearths, mills, smokehouses, presses, dairies, breweries, kitchens, and cold storage. Keep food safety at design level; do not implement hunger, nutrition, spoilage timers, disease, cooking execution, buffs, or consumable effects.

### Crafting production

Cover process order, dependencies, hand and measuring tools, jigs, forms, molds, anvils, looms, wheels, kilns, furnaces, mills, presses, cranes, pumps, drying racks, human/animal/water/wind/fuel/magical energy, workplace scale, maintenance, calibration, repair, consumable tooling, yields, losses, offcuts, scrap, slag, ash, wastewater, recoverable materials, and recipe abstraction. Do not implement labor, fuel, queues, timers, quality rolls, wear, capacity, or outputs.

### Magitech

Research ordinary technology first, then cooling, heating, drying, lighting, signaling, pumping, drainage, irrigation, purification, sanitation, lifting, motive power, navigation, mapping, weather warning, communication, medicine, containment, metallurgy, glass, ceramics, textiles, agriculture, mining, transport, construction, wards, and secure storage. Every proposal must state why it is not universal and why it remains attractive to players.

## 8. Shared Artifact Contract

Every artifact must include:

1. repo baseline and owners;
2. cited external findings with source-quality classification;
3. technology compatibility without a simplistic century label;
4. regional and cultural variation;
5. source-to-finished process chains including byproducts/waste;
6. tools, workplaces, energy, environment, and scale;
7. magic interaction classification;
8. content candidates;
9. authority classification;
10. gameplay-value classification;
11. uncertainty and confidence;
12. complete sources.

Do not present unsourced fantasy invention as fact. Label repo-canon magical extrapolation as design inference.

## 9. Candidate Classifications

- `factual_correction`
- `missing_static_identity`
- `missing_static_relationship`
- `schema_or_validator_precondition`
- `authored_input_required`
- `runtime_owner_required`
- `lore_or_description_only`
- `optional_depth`
- `rejected_complexity`
- `conflicts_with_canon`

## 10. Ice-Conditioned Container Test Case

Compare cellars, icehouses, insulation, evaporative cooling, cold water, seasonal ice, small ice-assisted containers, permanent cold chests, portable medicine cases, shipboard/warehouse storage, and institutional cold rooms.

Evaluate container volume, insulation, desired temperature difference, ambient temperature/humidity, duration, opening frequency, fixed/portable posture, material properties, `cold_soak` recharge access, affinity/skill, stability, maintenance, and failure. Recommend relative shard/crystal/cluster bands only. Do not canonize exact temperatures, volumes, durations, or formulas.

Mundane construction, seals, and insulation remain necessary. Magic supplies or stabilizes cooling; it does not imply a modern refrigerator, infinite power, sterile storage, universal affordability, or zero maintenance.

## 11. Source Standard

Prefer archaeological and experimental-archaeology reports; museum, university, government, and scholarly history-of-technology sources; peer-reviewed ethnobotany, zoology, agriculture, food science, materials science, and conservation literature; historical manuals and translated primary sources with context; reputable specialist references; and clearly labeled modern analogues.

Avoid unsourced listicles, game wikis, fantasy crafting lists, AI-generated pages, and single-source contested claims. Repository canon is primary for magic.

## 12. Integration

After all seven artifacts are committed, run the exact prompt in both:

- `docs/dev/current-codex-prompt.md`
- `docs/dev/queued-cross-domain-production-research-integration-prompt.md`

The integration creates `docs/design/cross-domain-production-research-synthesis.md`, dispositions all temporary artifacts, reconciles recipe and production-chain ownership, and installs revised `0.6.5`.

The research program does not consume a `0.6.x` primary number.

## 13. Non-Goals

This program does not add content, change schemas/validators/tests/lint, implement gathering/agriculture/crafting/cooking/enchanting/magic/economy/storage/quality/spoilage/labor/fuel/time/weather/population/ecology/runtime/UI/saves/gameplay, define final yields/prices/durations/formulas, or authorize `0.6.6` before revised `0.6.5` acceptance.
