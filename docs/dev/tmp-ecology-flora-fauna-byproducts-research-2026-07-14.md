# GPT-DR.ecology.flora-fauna-byproducts Research

- Date: 2026-07-14
- Gate: `GPT-DR.ecology.flora-fauna-byproducts`
- Repository baseline: `cbecbeeadd26e546836ea6407d1cf9cf4c523791` on clean `master`
- Status: temporary cited research artifact; non-canonical until the cross-domain research integration dispositions it
- Scope: documentation and research only; no content, schema, validator, test, runtime, UI, save, migration, asset, dependency, economy-behavior, loot, harvesting, population, medical-effect, or gameplay change

## 1. Gate Result

The live repository already contains unusually broad biological source and output catalogs: 117 flora records expose 199 unique item-resolved outputs, 132 fauna records expose 459 unique item-resolved outputs, and 24 monsters expose 69 static drop/loot entries. This breadth does not establish executable harvesting, anatomy, population behavior, or finished-product transformations. The strongest integration opportunity is relationship correction and ownership clarification, not automatic catalog expansion.

The principal findings are:

1. Species or monster identity, a living individual, anatomical part, raw output, stabilized material, ingredient, finished product, market identity, static loot possibility, generated loot instance, and runtime ecology state require separate authority.
2. All 658 unique flora/fauna output keys resolve to canonical items and market values. Conversely, 245 flora/fauna identity keys are market-only and must not be treated as item aliases. Existing identity coverage strongly favors relationship-first work.
3. Flora part descriptors and output arrays are parallel but unpaired; fauna outputs distinguish passive and slaughter routes but do not provide an anatomy model. Static monster `drops` and `loot` are validated probability envelopes, yet no runtime rolls them or creates item instances.
4. The biological catalogs contain 11,290 empty-object placeholders where schemas declare numeric or boolean values. IDs, taxonomy, habitat references, and string output relationships remain reproducible; yields, reproduction, population, regrowth, domestication, destructive impact, and other scalar biology are unusable and must not be inferred.
5. External evidence consistently separates source biology from recovery method and later processing. Root or bark removal can be more damaging than selective fruit/leaf collection ([Chen et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC4967523/), A2; [Delvaux et al.](https://doi.org/10.1016/j.biocon.2010.07.009), A2). Resin, gum, latex, and sap are distinct exudate questions ([Lambert, Wu, and Santiago-Blay](https://doi.org/10.1021/np050005f), A2; [Konno](https://doi.org/10.1016/j.phytochem.2011.02.016), A2). Fungi require identity- and substrate-aware handling, and preparation does not neutralize every toxin ([Egli et al.](https://doi.org/10.1016/j.biocon.2005.10.042), A2; [FDA](https://www.fda.gov/food/outbreaks-foodborne-illness/investigation-illnesses-morel-mushrooms-may-2023), B1; [CDC](https://www.cdc.gov/mmwr/preview/mmwrhtml/00047808.htm), B1). Hide is not leather, fatty tissue is not a finished oil, shell is not purified chitin, and a gland is not its isolated secretion ([FAO hides and skins](https://www.fao.org/4/X6552E/X6552E10.htm), A1; [FAO slaughter byproducts](https://www.fao.org/4/X6114E/x6114e04.htm), A1; [FAO fisheries utilization](https://www.fao.org/4/cc0461en/online/sofia/2022/utilization-processing-fisheries-production.html), A1; [Codex CXS 19-1981](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+19-1981%2FCXS_019e.pdf), A1; [Hamed, Özogul, and Regenstein](https://doi.org/10.1016/j.tifs.2015.11.007), A2).
6. Several current relationships deserve later verification: the shared female-only egg/feather passive window, garter-snake egg output, female milk-producing ox, slaughter-only cervid antlers, shell/scale/scute ambiguity, roe presented as passive output, and direct fatty-tissue-to-oil collapse. These are candidates for later repository-authority review, not corrections authorized by this gate.
7. Existing generic identities such as `blood`, `bone_raw`, `hide_raw`, `fish_raw`, `game_meat_raw`, `milk_raw`, `honeycomb`, `wool_fleece`, `resin`, `sap`, `fungal_cap`, `mycelium`, and `river_reed` caution against new species-neutral items without a collision and consumer audit.
8. Canonical monster outputs prove only the source-local drop relationship. They do not prove anatomy, harvesting technique, stable magical potency, or postmortem affinity. `monster.kobold_trapmaster` dropping `venom_sac` is a direct warning that a drop name need not describe the source's body.
9. Ordinary biological handling and preservation remain the baseline. Bounded cold holding, warning, drying, ventilation, or containment could later be magic-assisted, but only through explicit finite infrastructure, mundane housing, skill, maintenance, recharge, failure, scarcity, and institutional-access decisions.
10. No new ID, item, body part, source, drop, recipe, yield, timer, effect, action, schema, validator, or runtime behavior is authorized. This gate supplies evidence and dispositions for the later cross-domain integration.

## 2. Method, Authority, And Source Quality

### Claim authority

- **Repository fact:** directly observed at the named baseline and controlling for current identity and ownership.
- **External evidence:** a cited biological, ecological, material, historical, or safety relationship; informative but non-canonical.
- **Design inference:** a repository-compatible interpretation, explicitly neither fact nor implementation permission.
- **Integration candidate:** a possible correction, static relationship, identity precondition, authored question, reservation, or rejection for later disposition.
- **Runtime reservation:** behavior or mutable state requiring a future execution and persistence owner.

### External-source quality

- **A1 - primary authority:** government or intergovernmental technical guidance, code, standard, or formal scientific assessment.
- **A2 - peer reviewed:** journal research or scholarly synthesis.
- **B1 - official evidence:** government, national-heritage, museum, or conservation evidence with narrower scope.
- **B2 - institutional evidence:** university, professional, extension, or specialist institutional material.
- **C - contextual analogue:** a bounded lexical, site-specific, or modern analogue used only to frame a question.

### Method

Repository inspection covered content catalogs, schemas, data dictionaries, focused design decisions, current coordination, Gate 1, semantic validation, and read-only runtime consumers. Targeted JSON traversals reproduced counts, type distributions, placeholder fields, identity collisions, references, outputs, item stages/roles, static drop coverage, and spatial derivation. Targeted code searches checked for harvesting, butchery, fishing, loot generation, biological population, spoilage, and medical/toxin consumers.

External research then tested repository relationships across plants, fungi, lichens, exudates, fibers, aquatic plants, terrestrial animals, birds, reptiles, amphibians, invertebrates, fish, shellfish, toxic sources, and monster-adjacent analogues. Repository canon remained controlling for every name and placement. Real-world evidence was used only for dependency, distinction, hazard, ecology, and compatibility claims.

Modern WHO, FAO, Codex, FDA, EFSA, NOAA, and conservation guidance establishes physical or biological constraints; it does not import modern law, institutions, exact thresholds, yields, process settings, or gameplay effects. Species-, site-, climate-, and culture-specific evidence is not generalized without a stated limitation. Historical existence is treated as evidence of possibility, never universal availability.

## 3. Live Repository Baseline And Owners

### Exact catalog baseline

| Catalog or owner | Exact live count | Gate-relevant posture |
| --- | ---: | --- |
| `world.flora` | 117: 64 herb, 19 tree, 19 shrub, 11 grass, 4 fungi | Biological source identity, habitats, life-stage descriptors, part descriptors, and output templates |
| `world.fauna` | 132: 53 mammal, 24 avian, 17 arthropod, 12 fish, 9 amphibian, 9 reptile, 8 mollusk | Biological source identity, habitats, lifecycle prose, passive outputs, and slaughter outputs |
| `world.monsters` | 24: 9 beast, 6 humanoid, 3 ooze, 3 undead, 2 elemental, 1 giantkin | Monster identity, combat content, and source-local static drops/loot |
| Encounter templates / spawn profiles | 6 / 5 | Encounter membership and spawn context; no separate monster-template catalog |
| Habitats / biomes | 93 / 36 | Habitat and biome authority; flora/fauna reference 35 habitats, with no missing references |
| Regional ecology profiles | 9 | Macroregional climate, native lists, strengths, gaps, and trade pressure; 44 flora references / 18 unique and 52 fauna references / 18 unique |
| Regions / localities | 41 / 47 | 5 continents, 4 island systems, 4 oceans, 28 subregions; locality/spatial descriptors |
| Items | 1,372 | Canonical inventory item identity |
| Market item values | 1,617 | All 1,372 item keys plus 245 market-only biological source identities |
| Production chains / recipes | 121 / 12 | Macro/descriptive process context; 12 planned bounded recipe records across 8 families only |
| Workplaces / tool items / skills | 58 / 131 / 121 | Static capability vocabulary; 18 skills are resource-facing |
| Extraction methods | 22 | Thin macro vocabulary: 12 flora, 4 fauna, 6 mineral |
| Resources / commodities | 2 / 2 | Planned iron-ore and grain descriptions; no biological node or runtime authority |
| Minerals / crystal catalog | 56 / 27 | Geological identities; 9 affinities across shard/crystal/cluster vessel tiers |
| Magic infrastructure | 4 | Static service/infrastructure descriptions with explicit prohibited bypasses |
| Knowledge domains / snippets | 7 / 28 | Lore/recognition authority; six snippets concern natural-world subjects |
| Consumable profiles | 9 | Nutrition/hydration/intoxication only; five profiles are item-referenced |

### Biological scalar caveat

`flora.json` contains 6,924 empty-object scalar placeholders and `fauna.json` contains 4,366, for 11,290 total. They occupy fields whose schemas declare booleans or numbers, including `baseValue`, harvest flags and limits, regrowth, domestication, reproduction, population, lifecycle timing, and yield fields. The content lint's placeholder path preserves identity/ecology/output topology without supplying quantitative authority, and no engine consumes these biological scalar mechanics.

Accordingly:

- IDs, names, types, habitats, lifecycle strings, part descriptors, and output strings are repository facts.
- Numeric or boolean biological claims are invalid/unavailable evidence.
- No rate, yield, calendar, destructive-harvest result, population cap, reproduction result, domestication result, or regrowth behavior may be inferred.
- Later reconciliation is a `factual_correction` plus `schema_or_validator_precondition`; this artifact does not authorize the fix.

### Output, part, item, and market resolution

Flora has 199 unique output keys across 1,394 occurrences. Every key resolves to a canonical item and market value. Its 23 `harvestableParts` descriptors - `bark`, `berries`, `cap`, `cherries`, `crown`, `fiber`, `flowers`, `fruit`, `grapes`, `leaves`, `mycelium`, `nuts`, `pods`, `roots`, `sap`, `seed_head`, `spore_body`, `stalk`, `stem`, `stems`, `twigs`, `vines`, and `wood` - occur 447 times. They remain descriptive strings. Six collide lexically with item keys (`bark`, `fiber`, `fruit`, `mycelium`, `sap`, `wood`), but there is no alias relationship. The 702 `partsByStages` occurrences likewise do not pair a particular part with a particular output.

Fauna has 459 unique output keys across 484 occurrences, all item- and market-resolved. All 132 records have slaughter outputs; 65 have passive outputs. The catalog contains 61 passive ingredient, 19 passive material, 11 passive byproduct, 137 slaughter ingredient, and 256 slaughter byproduct occurrences. There is no anatomical-part catalog: meaning is implied through item names and parallel arrays. Blood, fat, manure, guano, sinew, and tendon are absent from fauna output relationships even though some generic item identities exist.

The flora and fauna output sets do not overlap, yielding 658 unique canonical item keys. All 249 flora/fauna IDs have market-value records, but only `flora.lavender`, `flora.marigold`, `flora.rosemary`, and `flora.sunpetal` are also item keys. The other 245 are market-only identities, not inventory aliases.

Existing raw identities - some generic and some source-specific - already cover many apparent gaps: `blood`, `bone_raw`, `hide_raw`, `fish_raw`, `game_meat_raw`, `milk_raw`, `sheep_milk`, `wild_turkey_egg`, `wild_turkey_feather`, `honeycomb`, `wool_fleece`, `bark`, `fiber`, `resin`, `sap`, `wood`, `fungal_cap`, `mycelium`, `spore_dust`, `river_reed`, and `marsh_fiber`. Their existence does not prove a relationship to every compatible-looking source, but it makes consumer and collision review mandatory before proposing another identity.

### Fungi and aquatic representation

The four records explicitly typed `fungi` are `flora.cave_button`, `flora.frostcap`, `flora.morel`, and `flora.shelf_fungus`. `flora.cave_moss`, `flora.ember_moss`, `flora.crystal_lichen`, `flora.glowcap`, and `flora.stone_truffle` are currently typed `herb`. These are facts about live classification, not permission to retype them.

There is no authoritative `aquatic` field. The exact taxonomic subsets are 12 fish and 8 mollusks. Name/habitat review identifies four crustacean-like arthropods and four marine mammals as clearly aquatic, but that 28-record grouping is an audit inference, not a repository class. Amphibians remain their own nine-record type.

### Monster drops, loot, and execution boundary

The 24 monster records contain 49 `drops` entries using 37 unique item keys and 20 `loot` entries using 6 unique keys. All 69 entries resolve to canonical items. Every monster has drops; 12 have additional loot. `docs/design/monster-record-schema-decision.md` defines these as source-local static probability envelopes. No runtime reads them to roll loot or create inventory instances. Thus the live counts are 69 static entries, zero executable loot generators, and zero generated loot instances.

No monster populates optional `baseFaunaId`, `baseMonsterId`, `variantType`, `attunementLevel`, `elements`, or `originProfile`. Shared output keys merely imply six fauna/monster parallels: dire boar, ember boar, cave centipede, dune scorpion, dire wolf, and shadow wolf. Exact canonical biological-looking drops include boar tissues, spider silk/venom/chitin, harpy feather/talon, troll hide/tooth, rat tail, centipede/scorpion tissues, wolf tissues, and slime jelly/glands. River and storm cores are elemental, not biological. `heat_touched`, `cold_touched`, or `elemental` vocabulary does not establish retained affinity.

### Item-stage, consumable, knowledge, spatial, and magic owners

Of 1,372 items, 963 have no material `stage`; 183 are `finished`, 138 `processed`, 49 `raw`, and 39 `refined`. Roles occur on 409 items: 405 `trade_good`, 224 `material`, 186 `ingredient`, 144 `consumable`, 52 `reagent`, and 14 `fuel` occurrences. All 184 flora-branch, 455 fauna-branch, and 21 monster-branch items lack the newer stage/role metadata. Names alone therefore cannot establish a raw/prepared/finished transformation.

Nine consumable profiles describe nutrition, hydration, and one intoxication path. Five items reference them. The player engine executes those linked profiles. Poison/venom item identities and source-output relationships exist, but there is no dedicated biological poison, venom, disease, allergy, or medical-effect profile/catalog or execution runtime. `cream` and `fresh_cheese` mention `spoilage.dairy_fresh`, but no such profile catalog or runtime owner exists.

The six natural-world Knowledge snippets cover aloe identification, badger identification, iron-ore identification, Kaelvar ecology, sheep seasonality, and grape-vine habitat. They are lore/recognition records, not harvesting expertise or recognition criteria.

The civilization engine derives exactly 305 flora/fauna/mineral source records, availability across 47 world hexes, and settlement access for 88 settlements. It does not consume regional ecology profiles, resources, commodities, or extraction methods; create placed populations or nodes; grant outputs; or track harvest, depletion, regrowth, or persistence. It is static spatial availability/supply derivation, not biological ecology execution.

The crystal catalog contains 27 records: shard, crystal, and cluster tiers for neutral, light, water, wind, ice, darkness, fire, stone, and thunder. Each crystal `slug` currently equals one canonical `arcane`/`vessel` item key, but the crystal record has no `itemKey` and no schema relationship makes that an explicit map. The records carry finite capacity, efficiency, stability, attunement, recharge, reuse, and permanent-enchant-consumption metadata. Four magic-infrastructure records and the crystal catalog feed settlement-institution derivation; three catalyst profiles and seven conduit profiles feed spell cast-readiness checks. These are static projection/readiness consumers, not biological handling, enchanting execution, or generic material behavior. Flora/fauna have no affinity field, and monsters do not populate their optional affinity fields.

### Current owner boundary

| Concept | Current authority | Explicitly not owned |
| --- | --- | --- |
| Species/source identity | flora, fauna, minerals | Individual organism, placed population, quantity, action, recovery |
| Monster identity and source-local loot possibility | monsters | Anatomy model, loot roll, generated instance, inventory mutation |
| Anatomical/harvest part | Flora descriptive strings; fauna item-name implication | Canonical body-part catalog, explicit part-to-output mapping |
| Inventory identity | items | Biological source, location, availability, action, mutable stock |
| Market identity/value | market item values | Item alias, live price, inventory instance |
| Macro process context | production chains | Exact recipe inheritance, execution, yield, time, quality |
| Bounded transformation | planned recipes | Harvesting, butchery, fishing, population, or loot execution |
| Static spatial availability | civilization engine derived state | Source nodes, biological population, outputs, recovery, persistence |
| Recognition/lore | Knowledge snippets/domains | Recognition checks, expertise, harvest permission |
| Nutrition/hydration/intoxication | linked consumable profiles/player engine | Medicine, poison, disease, allergy, spoilage |
| Gathering, hunting, fishing, butchery, population, biological spoilage, loot generation | No general owner | All execution and changing state remain reserved |

## 4. Failed-Attempt Cleanup Audit

The complete repository and working tree were inspected before drafting:

- branch, head, recent commits, staged/unstaged/untracked status, and ignored-file inventory;
- tracked filenames and Git history for the exact artifact path and similarly named Gate 2 reports;
- repository text for `ChatGPT Deep Research Light`, Gate 2 labels, rejected source-note language, and the listed non-canonical examples;
- current coordination files and all allowed/forbidden content areas for accidental modifications;
- ignored/untracked names for ecology, flora, fauna, byproduct, and research-draft patterns.

No rejected Gate 2 report, source note, draft, staged change, untracked change, ignored Gate 2 file, or content/runtime remnant existed. The only relevant live material was the intentional rejection record in `docs/dev/current-gpt-handoff.md` and `docs/dev/current-codex-output.md`; recent commits changed only those coordination files. No rejected report existed in Git history under the accepted artifact path.

Disposition:

- **Assimilated:** nothing from the rejected attempt. All repository findings and external sources in this artifact were independently reproduced.
- **Retained:** the current coordination rejection record, because it explains why the gate was rerun and prohibits using the discarded report as evidence.
- **Removed or renamed:** nothing; manufacturing a cleanup change would be misleading.
- **Rejected:** every unsupported claim attributed to the failed attempt, including non-canonical creatures, invented outputs, unverified industries, direct record-creation recommendations, and assumed schema compatibility.

The rejected attempt is not cited, listed as a source, or treated as evidence anywhere in this artifact.

## 5. Required Conceptual Separation

| Layer | Definition | Repository example or boundary |
| --- | --- | --- |
| Species/source | Stable biological identity or monster identity | `fauna.sheep`, `flora.grape_vine`, `monster.cave_spider_matron` |
| Individual living source | A particular organism | No general owner |
| Population/recovery state | Abundance, age structure, breeding, migration, regeneration | No biological runtime owner; scalar placeholders unusable |
| Anatomical part/structure | Leaf, bark, root, hide, shell, horn, antler, gland | Flora descriptors; fauna mostly implied by item names |
| Naturally shed output | Cast antler, molted feather, shed skin | Must not be conflated with slaughter/plucking outputs |
| Secretion/excretion | Milk, venom, wax, honey, ink, manure | Source and collection relationship distinct from an organ or effect |
| Harvested raw output | Material as first recovered | Species-specific output item where explicitly listed |
| Initially stabilized output | Cleaned, sorted, cooled, dried, salted, drained, contained | Usually a relationship or later-gate question, not inferred identity |
| Prepared material | Retting-separated fiber, cured hide, rendered fat/oil, cleaned shell | Processed state requiring later chain/recipe authority |
| Ingredient/reagent/component | Material consumed or incorporated downstream | Item role when explicitly authored; many biological items lack roles |
| Finished product | Crafted, cooked, preserved, medicinal, ritual, or trade good | Item identity plus later recipe/chain relationship |
| Static item identity | Canonical inventory key | `items.items`; not inferred from part text or market coverage |
| Market identity | Static value key | May represent a source without being an inventory item |
| Potential loot relationship | Source may yield an item under a static envelope | Monster `drops`/`loot` entries |
| Loot-table entry | Item key plus chance and, for drops, quantity envelope | Static monster authority only |
| Generated loot instance | Rolled item awarded to inventory | No owner/execution |
| Harvest/butchery action | Command, eligibility, tool/skill check, output creation | No owner/execution |
| Magical affinity/potency | Explicit retained magical property | Crystal/conduit/catalyst metadata only where authored; not inferred from names |

Required distinctions include fruiting body versus mycelium; leaf/flower/fruit/seed/bark/root/sap/resin/gum/fiber versus whole-plant removal; sap versus syrup; resin versus rosin/pitch/tar/varnish; stem versus retted fiber; hide versus rawhide/cured hide/leather/parchment/glue; wool versus hair/fur/felt; horn versus antler; shell/scute versus scale/chitin/bone; whole catch versus tissues; fat/blubber/liver versus oil; gland versus secretion; venomous source versus contained venom; and visible monster anatomy versus authorized drop. Representative external support for these separations appears in [WHO plant guidance](https://www.who.int/publications/i/item/9241546271) (A1), [FAO animal-byproduct guidance](https://www.fao.org/4/X6114E/x6114e04.htm) (A1), [FAO fisheries utilization](https://www.fao.org/4/cc0461en/online/sofia/2022/utilization-processing-fisheries-production.html) (A1), and [the crustacean-byproduct review](https://doi.org/10.1016/j.tifs.2015.11.007) (A2).

## 6. Evidence Synthesis By Biological Lane

### 6.1 Useful plants

Correct species, harvested part, development stage, collection timing, sorting, contamination avoidance, and appropriate drying are separate dependencies. WHO and EMA guidance also stresses trained identification and control of toxic or allergenic lookalikes; it does not establish medicinal effects or game-scale harvest schedules ([WHO GACP](https://www.who.int/publications/i/item/9241546271), A1; [WHO herbal processing guidance](https://www.who.int/docs/default-source/medicines/norms-and-standards/guidelines/production/trs1010-annex1-herbal-processing.pdf), A1; [EMA GACP](https://www.ema.europa.eu/en/good-agricultural-collection-practice-starting-materials-herbal-origin-scientific-guideline), A1).

Harvest impact varies by species, part, intensity, frequency, population, and site. Root or whole-plant removal is generally more destructive than selective fruit/leaf collection, but the evidence does not support a universal regeneration class or recovery time. Bark removal is similarly sensitive to species, tree size, season, and removed circumference; one regional study cannot authorize a global ring-barking rule ([medicinal-plant harvest synthesis](https://pmc.ncbi.nlm.nih.gov/articles/PMC4967523/), A2; [bark-harvest study](https://doi.org/10.1016/j.biocon.2010.07.009), A2).

Repository-compatible relationship:

`canonical flora source + correct part/stage + suitable habitat/season + access -> selective collection/cutting/digging -> sort/clean/shade/dry or contain -> existing raw output -> later food/material/medicine/dye/fuel route`

Leaves, flowers, fruit, seed, bark, roots/rhizomes, stems, wood, oils, aromatics, tannins, dyes, fodder, and fuel are plausible biological lanes only when the canonical record names a compatible output. External evidence cannot add an output to a species.

Wild collection and cultivation may share a source output, but they do not share ownership, land, propagation, tending, or harvest authority; cultivation belongs to Gate 3. Tubers and plant waxes likewise remain explicit source-output questions rather than deductions from a plant type, while seed collection must remain distinct from seed processing, planting stock, and extracted oil.

### 6.2 Fungi and lichens

Fruiting body and persistent mycelium must remain distinct. A long-running Swiss field study found no decline in fruiting or richness from careful picking/cutting at its sites while trampling reduced fruit-body counts; it does not establish universal harmlessness ([Egli et al.](https://doi.org/10.1016/j.biocon.2005.10.042), A2). FDA and CDC evidence shows that expert identity, freshness, breathable handling, and preparation do not guarantee safety, and some mushroom toxins can survive cooking or drying ([FDA morel investigation](https://www.fda.gov/food/outbreaks-foodborne-illness/investigation-illnesses-morel-mushrooms-may-2023), B1; [CDC Amanita report](https://www.cdc.gov/mmwr/preview/mmwrhtml/00047808.htm), B1).

Lichen dyes are species- and process-specific, while many lichens are slow-growing and disturbance-sensitive. Conservation guidance favors minimal, detached, or otherwise doomed material where collection is permitted; this supports a scarcity/impact question, not a generic lichen-dye item or rule ([lichen dye study](https://doi.org/10.1016/j.microc.2019.104140), A2; [NPS lichens](https://www.nps.gov/jotr/learn/nature/lichens.htm), B1; [British Lichen Society position](https://britishlichensociety.org.uk/conservation/management/positions/use-of-lichens-for-dyeing), B2).

Design inference: the four canonical fungi and herb-typed moss/lichen-like records should retain their live classifications until later review. Spore, cap, fruiting body, mycelium, substrate, ventilation, drying, contamination, and lookalike relationships may be useful; universal spore harvesting, inoculation, fermentation, medicine, or toxin effects are not authorized.

### 6.3 Trees, bark, resin, sap, gums, and woody byproducts

Plant exudates are not interchangeable. Resin, gum, gum-resin, and latex differ in origin and composition; latex often functions in defense. Tapping effects depend on species, wound pattern, season, frequency, tree condition, and pest/pathogen exposure ([Lambert, Wu, and Santiago-Blay](https://doi.org/10.1021/np050005f), A2; [Konno](https://doi.org/10.1016/j.phytochem.2011.02.016), A2; [Lopez-Alvarez, Zas, and Marey-Perez](https://doi.org/10.1016/j.indcrop.2023.117105), A2).

Therefore:

- logging outputs, coppice outputs, bark stripping, controlled tapping, naturally exuded material, and incidental resin during later wood processing are different routes;
- raw sap is not syrup or concentrate;
- raw resin/gum/latex is not rosin, pitch, tar, varnish, incense, or solvent-derived material;
- bark, twigs, leaves, sawdust, and damaged tapping material may be coproducts, residues, or waste depending on a later consumer.

The live flora part/output arrays support an explicit part-to-output relationship candidate, but not a yield, tool action, recovery rate, or sustainability classification.

### 6.4 Fibers, reeds, grasses, and aquatic plants

Bast fibers originate in particular plant tissues; retting loosens fiber bundles, after which breaking, scutching, and combing separate long fiber, tow, and woody shives. Moisture, temperature, microbes, water, and timing change results; water retting also creates a liquid residue requiring management ([retting review](https://doi.org/10.3390/fib12030028), A2; [mechanical fiber-separation review](https://doi.org/10.1007/s10570-021-04051-x), A2).

Bast, seed, and leaf fibers are source-specific anatomical lanes, not interchangeable `fiber` synonyms. A canonical plant and explicit output relationship must precede any choice among stalk retting, husk separation, leaf scraping, spinning preparation, or later textile use.

Reed and straw thatching depend on species/material form, local weather, labor, access, preparation, and building tradition rather than one universal thatch route ([Historic England thatching-materials report](https://historicengland.org.uk/research/results/reports/30-2023), B1). Seaweed collection must distinguish attached frond, holdfast, loose or beach-cast material, species, shore zone, cutting method, season, and site; cutting above a growth region is species-specific, not a universal guarantee of renewal ([NatureScot seaweed guidance](https://www.nature.scot/doc/advice-sustainable-harvesting-seaweed), B1). FAO cultivation guidance supports clean, thin, raised, ventilated drying and protection from contamination as a tropical analogue only ([FAO Kappaphycus manual](https://openknowledge.fao.org/3/CA0873EN/ca0873en.pdf), B1).

Repository-compatible chain:

`canonical stem/reed/grass/aquatic plant -> cut or collect -> sort/wash/drain/dry -> stem or biomass -> later retting/stripping/beating/combing -> long fiber + tow + shives/leaves + retting liquor -> textile, cordage, mat, thatch, paper, fuel, or descriptive waste`

Gate 2 establishes source and initial stabilization only. Detailed material stages, tools, residues, and transformations belong to Gates 4 and 6.

### 6.5 Terrestrial mammals

FAO evidence separates meat/offal, blood, fat, hide/skin, bone, horn/hoof, hair, and glands as distinct streams, with clean collection and prompt handling determining whether a biologically present material remains useful ([FAO slaughter byproducts](https://www.fao.org/4/X6114E/x6114e04.htm), A1; [FAO slaughter and dressing guidance](https://www.fao.org/4/T0279E/T0279E04.htm), A1). Fresh hide is not leather: drying or salting is initial stabilization, while tanning is a later process ([FAO hides and skins](https://www.fao.org/4/X6552E/X6552E10.htm), A1).

Milk recovery depends on animal health, clean handling, feed/water, welfare, and environmental hygiene; this supports dependencies, not husbandry, nutrition, or spoilage mechanics ([FAO/IDF dairy guide](https://www.fao.org/4/ba0027e/ba0027e00.htm), A1). Antler is bone that is normally cast and renewed, while horn ordinarily has a bony core with a persistent keratin sheath; exceptions prevent a universal rule ([NPS horns versus antlers](https://www.nps.gov/articles/yell-horns-vs-antlers.htm), B1).

Required route separation:

- `living source -> milk | wool/hair | manure`;
- `living cervid -> naturally cast antler` where canonical biology supports it;
- `carcass -> meat/offal | blood | fat | hide/fur | bone | horn/teeth/tusk | sinew/tendon | glands`;
- `raw hide -> clean/salt/dry -> stabilized hide -> later rawhide/leather/parchment/glue route`;
- `fatty tissue or blubber -> later rendering/separation -> oil or tallow`, never direct identity equivalence.

Age, sex, diet, health, season, and handling are plausible qualifiers. Gate 3 owns domestication, fodder, breeding, milk, manure, and farm-slaughter context; Gates 4 and 5 own later material and food transformations.

### 6.6 Birds

Eggs, meat/offal, manure, feathers/down, eggshell, and carcass residues are distinct streams ([FAO poultry products](https://www.fao.org/poultry-production-products/products-and-processing/products-and-processing/), A1). EFSA distinguishes naturally ripe feather gathering during molt from forced plucking, which can injure birds; molt also need not be synchronized across a flock ([EFSA feather assessment](https://doi.org/10.2903/j.efsa.2010.1886), A1). Molt timing varies by species, individual, season, feather group, breeding, and migration demands ([Cornell Lab molt overview](https://www.allaboutbirds.org/news/the-basics-feather-molt/), B2).

The live shared female-only passive relationship for eggs and feathers therefore collapses reproductive and molt semantics. A later authority should verify:

- `living female -> egg`;
- `moulting bird of either sex -> naturally ripe feather/down`;
- `carcass -> meat/offal | fat | bone | feathers`;
- `flock/roost -> manure or guano` where a consumer justifies recovery.

No feather-collection action, nesting disturbance, breeding calendar, migration rule, or welfare mechanic is authorized.

### 6.7 Reptiles and amphibians

Venom collection is a specialist controlled activity requiring trained handlers, secure containment, source identity, traceability, and recognition of variation between species, populations, and individuals. WHO's modern antivenom guidance supplies those constraints, not an extraction procedure, medical effect, or institution for the game ([WHO antivenom guidance](https://www.who.int/publications/m/item/snake-antivenom-immunoglobulins-annex-5-trs-no-1004), A1).

Amphibian permeable skin and aquatic/terrestrial life stages make habitat and contaminant relationships especially important; this supports ecological caution, not population formulas or reagent claims ([USGS amphibian declines](https://www.usgs.gov/publications/understanding-amphibian-declines-through-geographic-approaches), B1). Garter snakes bear live young, making the current `fauna.garter_snake` oviparity/egg relationship a high-confidence verification candidate, subject to confirming that the canonical name intends the real genus analogue ([NPS garter snakes](https://www.nps.gov/articles/000/garter-snakes.htm), B1). Turtle shell combines bony structure and keratinous scutes, so shell, scute, scale, skin, and bone must not be used interchangeably ([AMNH turtle shells](https://www.amnh.org/research/science-conservation/projects/case-studies/collections-core-turtle-shells), B2).

Do not infer venom from `fauna.cliff_viper` by name, toxin from an amphibian by type, or recoverable skin secretion from habitat. A living shed skin, slaughter-derived skin, scale/scute, shell, anatomical gland, contained secretion, and gameplay poison/effect remain separate concepts.

Reptile or amphibian eggs, meat, bone, fat, and skin remain explicit source outputs only. Oviparity, visible anatomy, or a broad animal type cannot by itself authorize recovery, edibility, nonlethal collection, or a processed product.

### 6.8 Insects, arachnids, and other invertebrates

Honey, wax, pollen, propolis, royal jelly, and venom are biologically and operationally distinct bee products. Colony health, identity, clean handling, protective equipment, and specialized venom collection matter; the evidence supplies relationships, not outputs for every canonical arthropod ([FAO good beekeeping practices](https://doi.org/10.4060/cb5353en), B1; [FAO bee products](https://www.fao.org/4/w0076e/w0076e03.htm), B1). Pollination is an ecosystem service rather than an inventory drop ([IPBES pollination assessment](https://files.ipbes.net/ipbes-web-prod-public-files/downloads/pdf/2017_pollination_full_report_book_v12_pages.pdf), A1).

Silk production requires a compatible organism, feed source, lifecycle, workplace, and reeling/handling route ([FAO, *Silk Reeling and Testing Manual*](https://www.fao.org/4/x2099e/x2099e00.htm), B1). Pierced, double, or rejected cocoons and pupae create distinct streams, but the real analogue does not authorize a silk industry or item for a repository species ([FAO manual, byproduct chapter](https://www.fao.org/4/x2099e/x2099e09.htm), B1). Raw shell, carapace, or exuvia may contain chitin, but purified chitin is a processed material, not a body-part synonym ([Zainol Abidin et al.](https://doi.org/10.3390/ijms21144978), A2).

Canonical ecosystem-service candidates such as pollination and decomposition are best treated as lore, ecology, or future static relationships unless a real consumer exists. They must not become generic loot. Concentrated venom, purified chitin, shellac-like secretion, or insect dye is conditional on canonical species evidence, specialized ownership, and later materials/crafting gates.

### 6.9 Fish and aquatic vertebrates

Whole catch, meat, head/frame, liver/viscera, roe, skin, bone, scale, blood, offal, and oil-bearing tissues are separate streams. Fish oil is a later derived product. Codex defines edible fats and oils as foodstuffs composed of glycerides from vegetable, animal, or marine origin; it does not equate those product identities with anatomical tissue ([FAO fisheries utilization](https://www.fao.org/4/cc0461en/online/sofia/2022/utilization-processing-fisheries-production.html), A1; [Codex CXS 19-1981](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+19-1981%2FCXS_019e.pdf), A1). Rapid careful handling, clean containers, contamination control, shade/cooling, and transport pressure determine whether the catch remains usable; modern cold-chain settings are not game timers or exact requirements ([FAO small-scale handling](https://www.fao.org/flw-in-fish-value-chains/value-chain/capture-fisheries/on-board-handling-in-small-scale-fisheries/appropriate-technology/en/), A1).

Fishing pressure, selectivity, juveniles, spawning stock, and bycatch can change populations and ecosystems ([FAO ecosystem effects of fishing](https://www.fao.org/4/y4773e/y4773e05.htm), A1). Salmon migration/spawning and sturgeon slow growth/late maturity illustrate why species-specific life histories cannot be replaced by a generic fish calendar ([NOAA salmon planning](https://www.fisheries.noaa.gov/west-coast/sustainable-fisheries/salmon-life-cycle-and-seasonal-fishery-planning), B1; [NOAA Atlantic sturgeon science](https://www.fisheries.noaa.gov/species/atlantic-sturgeon/science), B1).

Repository-compatible relationship:

`canonical population/source water -> whole catch -> sort/clean/cool -> meat + roe/liver + skin/scales + bone/teeth + blood/offal/fat -> later food, oil, material, bait, fertilizer, or descriptive waste route`

Roe in a passive-output array does not authorize nonlethal collection. `bluefin_tuna_oil`, `dolphin_oil`, and `great_whale_oil` currently collapse a raw biological source into a processed material and should be reviewed as relationships, not automatically renamed. The Dawnreach profile's authored phrase `whale routes` does not authorize whaling, output items, placement, law, or action. Modern whaling evidence only demonstrates that marine-mammal use raises cultural, subsistence, conservation, and institutional questions requiring authored canon ([IWC whaling overview](https://iwc.int/management-and-conservation/whaling), B1).

### 6.10 Mollusks, shellfish, and crustaceans

Bivalves can concentrate contaminants and marine biotoxins from harvest waters. Water-source condition and monitoring are distinct from post-harvest cleaning, and purification cannot be assumed to remove every toxin, virus, metal, or severe contamination ([FAO/WHO bivalve code](https://www.fao.org/4/j1682e/j1682e04.htm), A1; [FAO/WHO bivalve-sanitation technical guidance](https://www.who.int/publications/i/item/9789240030213), A1).

Oysters can form habitat whose structure is damaged by dredging or overharvest, while abalone examples show that slow growth, longevity, disease, habitat, and low density can constrain recovery. These are species/site analogues, not generic shellfish rates ([NOAA oyster reef habitat](https://www.fisheries.noaa.gov/national/habitat-conservation/oyster-reef-habitat), B1; [NOAA white abalone](https://www.fisheries.noaa.gov/species/white-abalone), B1).

Pearls form only in suitable mollusks under specific biological conditions; cultured production adds skilled intervention and care. Existing `pearl_earring` and regional pearl prose establish a downstream concept but not a raw pearl/nacre item or generic oyster output ([GIA pearl overview](https://www.gia.edu/pearl), B2). Crustacean shell contains protein, mineral, and chitin; isolating chitin and converting it to chitosan require later chemical/material processing ([Hamed, Ozogul, and Regenstein](https://doi.org/10.1016/j.tifs.2015.11.007), A2). Cephalopod ink is a mixed secretion associated with specialized organs, not a generic black liquid or guaranteed dye ([Derby](https://doi.org/10.3390/md12052700), A2). Historical molluscan purple is species- and gland-specific, so the lack of a canonical compatible source supports rejecting generic oyster/snail purple dye ([molluscan purple review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10365538/), A2).

Required separation:

- `classified harvest water -> whole bivalve -> meat + shell`;
- `shell -> clean/dry -> whole shell/powder/craft destination`;
- `shell -> later deproteinization/demineralization -> chitin -> later derivative`;
- `canonically suitable mollusk + authored relationship -> pearl/nacre`;
- `cephalopod -> meat + separately contained ink secretion`.

### 6.11 Dangerous or toxic biological sources

Animal tissues, fluids, hides, wool, hair, and bone can transmit pathogens depending on source health and handling ([WHO zoonoses](https://www.who.int/news-room/fact-sheets/detail/zoonoses), A1). Venom, poisonous plants, toxic fungi, marine toxins, defensive secretions, allergens, contaminated tissues, and decay products therefore need source identity, separation, containers, labeling, specialist knowledge, cleanable tools, and restricted handling as design questions. Milk, egg, fish, and crustacean shellfish are modern major-allergen classes, but this supports qualitative hazard awareness only, not an allergy effect or repository law ([FDA allergen overview](https://www.fda.gov/industry/fda-basics-industry/what-major-food-allergen), B1).

No drying, cooking, washing, salting, smoke, magic, or ordinary preparation may be assumed to neutralize an unspecified hazard. This gate defines containment and authority boundaries only. Poison, disease, allergy, contamination, damage, treatment, antidote, medicine, spoilage, and diagnostic mechanics remain absent runtime owners.

### 6.12 Monster-adjacent biological materials

Only canonical monsters and explicit drops are usable evidence. The repository establishes:

- `monster.cave_spider_matron` -> `cave_silk`, `venom_sac`, `chitin_plate`;
- `monster.ember_boar` -> ordinary boar-like tissues plus `ember_core`;
- `monster.harpy_raider` -> `harpy_feather`, `talon_bundle`;
- `monster.bog_troll` -> `troll_hide`, `troll_tooth`;
- centipede/scorpion monsters -> meat, venom, chitin;
- slime monsters -> `slime_jelly` plus acid/frost gland variants;
- dire/shadow wolves -> canonical wolf/deep-wolf tissues.

Spider silk varies with species, gland, ecology, environment, and spinning behavior; this is a constraint analogue only and cannot establish giant-spider scale, uniformity, yield, or magical potency ([Blamires, Blackledge, and Tso](https://doi.org/10.1146/annurev-ento-031616-035615), A2). WHO venom guidance and chitin research similarly support specialist containment and raw-versus-processed distinctions, not fantasy anatomy or process quantities ([WHO antivenom guidance](https://www.who.int/publications/m/item/snake-antivenom-immunoglobulins-annex-5-trs-no-1004), A1; [Zainol Abidin et al.](https://doi.org/10.3390/ijms21144978), A2).

Safe relationship:

`canonical monster record -> explicit source-local static drop -> canonical item key`

This does not establish anatomical location, harvesting method, prepared state, magical persistence, affinity, legality, or generated loot. `ember_core`, slime glands, and elemental cores lack adequate real biological analogues; river/storm cores are outside the biological lane. No fantasy-named output receives retained magic merely from its name.

## 7. Source-To-Finished Chain Matrix

These are relationship maps, not recipes. Arrows do not imply execution, quantities, time, or guaranteed recovery.

| Lane | Source and harvest mode | Raw output and initial stabilization | Later destinations and useful coproducts | Waste / dangerous residue / constraint | Likely owner and disposition | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Fruit/seed/leaf/flower | Canonical flora; selective pick/cut at suitable stage | Sort, reject lookalikes, shade/ventilate/dry or contain | Food, oil, dye, aromatic, fodder, medicine/reagent research | Soil, stems, spoiled/contaminated matter; season and source health | Flora part-output relationship; `missing_static_relationship` | [WHO GACP](https://www.who.int/publications/i/item/9241546271), A1 |
| Root/rhizome/whole plant | Canonical flora; dig or remove | Clean, trim, dry; keep source identity | Ingredient/material research | High source damage, soil contamination, mistaken identity | Authored impact class; `authored_input_required`; runtime recovery reserved | [Chen et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC4967523/), A2 |
| Bark/wood/coppice | Canonical tree/shrub; peel/cut/fell under source-specific route | Sort bark, poles, wood; dry/season later | Timber, tannin, fuel, fiber, component routes | Cambium damage, chips, leaves, transport burden | Part-route correction; later Gates 4/6 | [Delvaux et al.](https://doi.org/10.1016/j.biocon.2010.07.009), A2 |
| Sap/resin/gum/latex | Canonical compatible plant; tap or collect exudate | Clean container, strain/settle if appropriate, cool/shade | Concentrate, adhesive, incense, varnish, reagent, fuel research | Wound/pest pressure, contamination, volatile/toxic fractions | Explicit exudate relationship; no generic interchange | [Lambert, Wu, and Santiago-Blay](https://doi.org/10.1021/np050005f), A2; [Konno](https://doi.org/10.1016/j.phytochem.2011.02.016), A2 |
| Fungal fruiting body | Canonical fungus; expert-identified pick/cut | Sort, ventilate, dry/cool; isolate suspect material | Food, dye, tinder, reagent research | Lookalikes, persistent toxins, decay, trampling | Flora/fungi plus Knowledge candidate; effects reserved | [Egli et al.](https://doi.org/10.1016/j.biocon.2005.10.042), A2; [FDA](https://www.fda.gov/food/outbreaks-foodborne-illness/investigation-illnesses-morel-mushrooms-may-2023), B1; [CDC](https://www.cdc.gov/mmwr/preview/mmwrhtml/00047808.htm), B1 |
| Lichen/moss-like source | Canonical source only; minimal/detached collection question | Dry, identify species/substrate | Dye/tinder/lore only if supported | Slow recovery, substrate damage, catalog noise | `optional_depth` or `lore_or_description_only` | [NPS](https://www.nps.gov/jotr/learn/nature/lichens.htm), B1; [British Lichen Society](https://britishlichensociety.org.uk/conservation/management/positions/use-of-lichens-for-dyeing), B2 |
| Bast fiber/reed/grass | Canonical stem/reed; cut and bundle | Dry or soak under later route; strip/sort | Retting -> breaking/scutching/combing -> fiber, tow, shives -> textile/cordage/thatch | Retting liquor, short fiber, leaves, mould | Source-relationship candidate; material/craft closure Gates 4/6 | [Angulu and Gusovius](https://doi.org/10.3390/fib12030028), A2; [Manian, Cordin, and Pham](https://doi.org/10.1007/s10570-021-04051-x), A2 |
| Seaweed/aquatic plant | Canonical source; attached-frond or beach-cast route | Wash/drain, thin raised drying, contamination control | Food, fertilizer, fiber, dye, binder research | Sand/salt, decay, holdfast/ecosystem damage | Conditional identity/relationship; source placement required | [NatureScot](https://www.nature.scot/doc/advice-sustainable-harvesting-seaweed), B1; [FAO](https://openknowledge.fao.org/3/CA0873EN/ca0873en.pdf), B1 |
| Milk | Living canonical fauna with an authored passive output; milking action not inferred | Clean container and hygienic handling | Dairy research | Contamination and animal health/welfare | Gate 3 primary; runtime husbandry reserved | [FAO/IDF](https://www.fao.org/4/ba0027e/ba0027e00.htm), A1 |
| Wool/hair/manure | Living canonical fauna only where a passive output is authored; shearing/collection not inferred | Handling and stabilization remain unresolved | Textile, soil, or fuel-consumer questions | Welfare, contamination, and runoff require source-specific evidence | Gate 3 evidence and ownership required | Repository relationship only; process evidence deferred to Gate 3 |
| Mammal carcass | Canonical fauna output route | Dress and separate meat/offal, blood, fat, hide, bone, horn/teeth, sinew, glands | Food; cured hide/leather; rendering; glue/gelatin; tools/components | Infected tissues, putrefaction, wastewater, unusable offal | Fauna-output and chain correction; Gates 3-6 | [FAO slaughter guidance](https://www.fao.org/4/T0279E/T0279E04.htm), A1; [FAO hide guidance](https://www.fao.org/4/X6552E/X6552E10.htm), A1 |
| Cast antler | Living compatible cervid; naturally cast/scavenged | Clean, dry, inspect | Component, tool, ornament, lore | Species/season uncertainty, scavenger/ecology question | Conditional passive relationship, not guaranteed action | [NPS](https://www.nps.gov/articles/yell-horns-vs-antlers.htm), B1 |
| Bird egg / molt / carcass | Female laying; ripe molt; or slaughter - three routes | Collect separately; clean/cool egg; dry/sort feather | Food, down/fill, quill, component, fertilizer | Nest disturbance, injury, manure/pathogen, seasonal scarcity | Separate shared passive window; schema/relationship precondition | [FAO poultry](https://www.fao.org/poultry-production-products/products-and-processing/products-and-processing/), A1; [EFSA](https://doi.org/10.2903/j.efsa.2010.1886), A1 |
| Reptile/amphibian | Shed skin, carcass, or explicit secretion route | Separate skin/scute/shell/gland/secretion; specialist containment | Material/reagent research only when canonical | Venom/toxin, permeable-skin sensitivity, contamination | Source-specific; no name inference; effects reserved | [WHO antivenom guidance](https://www.who.int/publications/m/item/snake-antivenom-immunoglobulins-annex-5-trs-no-1004), A1; [USGS](https://www.usgs.gov/publications/understanding-amphibian-declines-through-geographic-approaches), B1; [AMNH](https://www.amnh.org/research/science-conservation/projects/case-studies/collections-core-turtle-shells), B2 |
| Bee/other invertebrate | Colony secretion/structure, cocoon, exuvia, or explicit source | Separate honey/wax/pollen/propolis/venom/cocoon/shell | Food, wax, silk, dye, chitin routes | Stings, colony damage, dead brood/pupae, contaminants | Canonical organism/feed/workplace required; pollination is service | [FAO beekeeping](https://doi.org/10.4060/cb5353en), B1; [FAO silk byproducts](https://www.fao.org/4/x2099e/x2099e09.htm), B1; [Zainol Abidin et al.](https://doi.org/10.3390/ijms21144978), A2 |
| Fish/aquatic vertebrate | Whole catch from compatible water/season/gear | Sort, clean, shade/cool; separate tissues | Meat, roe/liver, skin/scale, bone/teeth, later oil | Bycatch, juveniles, offal, contamination, rapid decay | Static relationships; fishing/populations/runtime reserved | [FAO fisheries utilization](https://www.fao.org/4/cc0461en/online/sofia/2022/utilization-processing-fisheries-production.html), A1; [FAO handling](https://www.fao.org/flw-in-fish-value-chains/value-chain/capture-fisheries/on-board-handling-in-small-scale-fisheries/appropriate-technology/en/), A1; [FAO ecosystem effects](https://www.fao.org/4/y4773e/y4773e05.htm), A1 |
| Bivalve/crustacean | Whole source from compatible water | Clean/hold as source-appropriate; separate meat and shell | Shell craft/powder; later chitin; conditional pearl/nacre | Biotoxin/contaminant, shell waste, reef damage | Water/source relationship; later materials gate | [FAO/WHO bivalve code](https://www.fao.org/4/j1682e/j1682e04.htm), A1; [Hamed, Özogul, and Regenstein](https://doi.org/10.1016/j.tifs.2015.11.007), A2; [GIA](https://www.gia.edu/pearl), B2; [NOAA](https://www.fisheries.noaa.gov/national/habitat-conservation/oyster-reef-habitat), B1 |
| Cephalopod | Whole canonical source | Separate meat and contained ink | Food and ink/pigment research | Contamination, mixed secretion, unstable material | Explicit output relationship; no generic dye inference | [Derby](https://doi.org/10.3390/md12052700), A2 |
| Canonical biological monster | Combat/static source-local drop relationship only | No harvesting or stabilization method established | Existing item may later enter materials/food/craft research | Hazard, unstable/unknown potency, legal/ritual questions | Monster arrays remain canonical; `0.6.6` and later loot decision | [Blamires, Blackledge, and Tso](https://doi.org/10.1146/annurev-ento-031616-035615), A2; real-spider analogue only |

## 8. Technology Compatibility Without A Century Label

Compatibility is determined by source biology and operating conditions, not a date label. Every proposed relationship must be tested against:

- canonical source, anatomy/structure, life stage, health, diet, habitat, season, and ecological sensitivity;
- desired raw output and whether recovery is lethal, damaging, regenerative, shed, secreted, scavenged, or incidental;
- cutting, scraping, combing, milking, pressing, draining, washing, salting, drying, cooling, ventilating, or containing needs;
- portable tool, cleanable container, clean water, fuel/heat, shade, airflow, humidity, cold, drainage, storage, transport, and waste handling;
- skill, identification, workplace permanence, maintenance, labor organization, throughput, and institutional control;
- whether the abstraction adds gameplay choice or only catalog noise.

Capability bands:

1. **Household/subsistence:** selective collection, simple cutting/scraping, baskets, cloth, ordinary pots, shade, air drying, small salting/cleaning, and immediate use where source and skill permit.
2. **Village/ordinary town craft:** shared drying racks, smoke/cold rooms, presses, apiary/sheepfold/fishing facilities, curing areas, fiber preparation, clean water access, and organized waste handling.
3. **Urban specialist:** controlled venom/ink/reagent containment, advanced hide/fiber/material preparation, quality sorting, specialist storage, and documented source identity.
4. **Guild/temple/academy/military/major merchant:** secured dangerous materials, sustained cold holding, large wet or odorous processes, inspection, traceability, rare-source procurement, and trained maintenance.
5. **Elite/strategic/capital scale:** high-throughput or long-distance handling with uncommon infrastructure, security, transport coordination, and replacement capacity.
6. **Rare/exceptional/relic/legendary:** canonically magical or extraordinary sources whose stable recovery depends on explicit authority and cannot be generalized.

Historical or modern evidence can establish that a method is possible and dependency-heavy. It cannot establish universal access, a technology tier for every region, exact throughput, or an implementation-ready recipe. The compatibility dimensions above synthesize the cited plant-collection, animal-handling, fisheries, and specialist-hazard evidence ([WHO GACP](https://www.who.int/publications/i/item/9241546271), A1; [FAO slaughter guidance](https://www.fao.org/4/T0279E/T0279E04.htm), A1; [FAO fisheries handling](https://www.fao.org/flw-in-fish-value-chains/value-chain/capture-fisheries/on-board-handling-in-small-scale-fisheries/appropriate-technology/en/), A1; [WHO antivenom guidance](https://www.who.int/publications/m/item/snake-antivenom-immunoglobulins-annex-5-trs-no-1004), A1).

## 9. Regional And Cultural Variation

The nine regional ecology profiles are the only current macroregional biological authority. They reference just 18 distinct flora and 18 distinct fauna across their native lists, so the full catalogs must not be distributed geographically by inference. The profiles provide qualitative supply/scarcity emphasis, not species-specific abundance values. The table below separates authored facts from **design-inference questions**; it adds no species placement, cultural rule, taboo, institution, law, or seasonal calendar. For every profile, authors must separately decide access, ownership, sacred/taboo/status use, and institutional control; no profile inherits another profile's output list or handling route merely because the climates or names look similar.

| Ecology profile | Authored native coverage and qualitative supply/scarcity emphasis | Environmental, seasonal, and stabilization questions | Authored cultural/institutional question and copy boundary |
| --- | --- | --- | --- |
| `regional_ecology.kaelvar` | 8 flora / 8 fauna; dry uplands and Mediterranean-style coasts; grapes/orchards and pastoral goods are strengths; bulk grain is less reliable | Dry heat and long-summer conditions raise shade, water, fire, seasonal pasture, brittle-dry material, and transport questions | Who controls groves, pasture, and water access? A dry pastoral route cannot inherit wet-coast drying or fish assumptions. |
| `regional_ecology.valtherion` | 8 / 10; river basins and temperate mixed biomes; broad grain/herd/flax/timber base; warm-sea luxuries are import-biased | River access and cold/wet secondary climate raise flood, damp storage, fish-migration, winter, and high-throughput handling questions | Who manages river runs, herd access, and large shared facilities? Broad abundance does not make every species, season, or luxury local. |
| `regional_ecology.serathyl` | 8 / 8; wet coasts and forests; timber, citrus, dye plants, fish, and oyster; bulk grain/metal depth is weaker | Humidity, rain, salt air, mould, seafood cooling, harvest-water, reef, and drying-space questions differ from Kaelvar | Who governs forest/coastal access and reef-sensitive harvest? Do not copy inland herd, dryland, or generic shellfish behavior. |
| `regional_ecology.draemor` | 7 / 7; wet basin plains; staples, livestock, hides, and wetland agriculture are strong; metal/hardwood/prestige goods are weaker | Flood seasons, mud, manure/runoff, wet-hide stabilization, and bulk transport are later questions | Who controls basin water, herd waste, and slaughter facilities? Gate 3 must author this farm route rather than copy Valtherion's scale. |
| `regional_ecology.talmyra` | 3 / 5; tropical forest, mangrove, savanna; fruit/aromatics/resinous woods/rare animal goods; bulk grain and finished goods are weak | Heat, humidity, insects, storm/flood seasons, rapid deterioration, and long transport make temperate storage assumptions unsafe | Who controls rare forest and animal goods? No exotic output, institution, or restriction is inferred beyond listed sources. |
| `regional_ecology.myridian_chain` | 4 / 3; marine food, pearl trade pressure, and fisheries; scarce land, herds, grain, metal, and heavy timber | Salt exposure, seasonal storms, scarce land/fuel/fresh water, shellfish-water condition, and shipboard handling require distinct infrastructure | Who controls reefs, harbors, and scarce fresh water? Pearl prose does not establish raw pearl output, and island routes cannot inherit continental capacity. |
| `regional_ecology.lantern_isles` | 3 / 4; warm-island fish/citrus/spice gardens/wood lots; grain and iron remain structural imports | Heat/humidity, salt, seasonal storms, small storage, fragmented supply, and inter-island transport constrain reliability | Who allocates small stands, gardens, and landing access? Do not copy continental chain scale or self-sufficiency. |
| `regional_ecology.serpents_wake` | 1 / 4; storm-rich and sea-rich; select marine/tropical goods exist but broad reliability is weak | Storm season, political access, safe harbors, flooded/contaminated storage, and interrupted transport dominate | Who may use unstable harbors and mangrove/coastal sources? Availability does not imply safe access, law, or a dependable copied island route. |
| `regional_ecology.dawnreach_isles` | 2 / 3; cold fisheries, furs, conifer timber/resin; staple agriculture/textiles/metal are weak; authored `whale routes` phrase | Cold, wind, seasonal access, freeze/thaw, limited agriculture, and long transport remain constraints; cold is not automatic preservation | Who controls seasonal routes and scarce stores? Whale-route prose is not whaling/loot authority, and cold conditions cannot inherit warm-island fisheries behavior. |

Regional and cultural questions requiring authored input include who may collect sacred or restricted organisms; whether naturally shed, scavenged, hunted, farmed, or slaughter-derived material carries different status; who controls dangerous glands/venoms or rare monster remains; whether nesting grounds, spawning runs, reefs, managed groves, or medicinal stands are protected; and whether particular products are taboo, prestige-bearing, funerary, ritual, medicinal, military, or guild-controlled. External cases show that source uses can carry cultural and conservation controls, but they cannot supply Lineage: Reforged canon ([IWC](https://iwc.int/management-and-conservation/whaling), B1; [British Lichen Society](https://britishlichensociety.org.uk/conservation/management/positions/use-of-lichens-for-dyeing), B2).

Separate live guild charters in `packages/content/base/civilization/guilds.json` already author generic controls: fishing quotas, seasonal closures, landing inspections, and spawning protections; protected herbal beds, anti-overharvest rules, and dangerous-specimen surrender; agricultural harvest and quarantine duties; and pasture and quarantine controls. Those are institutional seeds, not region/source-specific sacred, taboo, or status rules, and they do not establish runtime enforcement.

Unplaced sources remain unplaced. In particular, `fauna.dolphin`, `fauna.great_whale`, and `fauna.walrus` receive no geographic assignment from this gate. The profile phrase `whale routes` remains descriptive pressure only.

## 10. Tools, Workplaces, Energy, Environment, And Scale

### Live capability vocabulary

The flora templates name 14 unique tool descriptors. Six exactly match item keys: `basket`, `grafting_knife`, `pruning_saw`, `pruning_shears`, `scythe`, and `sickle`. Eight do not: `axe`, `bundle_twine`, `fungal_knife`, `gathering_basket`, `gathering_gloves`, `hand_knife`, `hand_trowel`, and `spore_brush`. These strings have no descriptor-to-item or descriptor-to-capability schema. Similar naming is not an alias.

The 131 tool-class items are canonical identities, but only `lumber_axe` and `pickaxe` have `useProfiles`. The 58 workplaces comprise 33 processing, 15 extraction, and 10 manufacturing records. Gate-relevant extraction facilities include fishing, apiary, flax, garden, foraging, herbalism, hunting, riverbank gathering, sheepfold, and woodcutting records. Their `outputTags` are canonical item-key capability lists aligned with workplace output/yield-group context, but they do not execute actions or create inventory instances.

Eighteen skills cover general/source spotting and identification, gathering, woodcutting, mining, quarrying, fishing, hunting, butchering, trapping, foraging, and fuel gathering. Workplaces, production chains, and planned recipes already bind many biological output keys to some workplaces, skills, or tools. What is absent is one explicit crosswalk joining an extraction method, canonical biological source ID/output, exact tool, workplace, and skill; none of the partial relationships executes harvest or grants inventory.

### Relationship posture

| Layer | What can be static now | What remains authored or runtime-reserved |
| --- | --- | --- |
| Portable tool | Exact canonical item reference only after collision/semantic audit; otherwise a clearly defined capability descriptor | Action eligibility, efficiency, wear, maintenance, breakage, yield, quality |
| Container | Broad need for clean, breathable, sealed, cool, dry, padded, opaque, or secure containment | Capacity, contamination state, temperature, opening frequency, loss, inventory mutation |
| Workplace | Existing facility identity and broad capability relationship | Queue, labor, fuel, throughput, ownership, access enforcement, output generation |
| Skill | Existing skill reference and descriptive applicability | Checks, gain, success, hazards, recognition, yield, quality |
| Energy | Human/animal effort, passive sun/air, water, wind, fuel heat, or bounded magical assistance as compatibility context | Consumption, time, power, efficiency, cost, exhaustion, runtime allocation |
| Environment | Habitat, climate, season, shade, water, drainage, airflow, humidity, cold, substrate, transport access | Live weather, timers, contamination, population response, spoilage |
| Scale | Household through exceptional capability band | Numerical capacity, staffing, output, storage, market effect |

The strongest candidate is an authored source/output/method-to-tool/workplace/skill relationship model that keeps exact item references distinct from free capability vocabulary. Gate 6 should reconcile process order and tooling. It must not auto-resolve names or backfill behavior.

## 11. Ecology, Seasonality, Life Stage, Hazards, Residues, And Cultural Restrictions

| Concern | Possible static expression after later approval | Authored input required | Runtime reservation |
| --- | --- | --- | --- |
| Habitat/source compatibility | Existing habitat/biome/region references; explicit source-water or substrate relationship | Species and locality fit; exceptional placement | Availability changes, movement, access, source condition |
| Season/life stage | Broad authored tags such as flowering, fruiting, molt, spawning, lactation, maturity where schema permits | Species/region-specific meaning and useful granularity | Calendar windows, timers, eligibility, population consequences |
| Harvest route | Lethal, nonlethal, shed, secreted, scavenged, incidental, or waste-recovery descriptor | Source-specific truth and cultural acceptability | Action, tool/skill check, item creation, source mutation |
| Source impact | Broad qualitative concern such as selective, damaging, destructive, colony/reef sensitive | Species, part, intensity, habitat, management context | Depletion, injury, mortality, regrowth, recovery, enforcement |
| Health/quality | Descriptive dependencies on health, diet, age, sex, handling, or contamination | Which qualifiers materially matter | Quality rolls, disease, nutrition, reproduction, price effects |
| Hazard | Toxic, venomous, irritant, allergenic, infectious, sharp, putrefactive, or contamination concern | Canonical hazard identity, institutions, restrictions, lore | Damage, status, disease, allergy, medicine, diagnosis, treatment |
| Initial stabilization | Relationship such as sort, wash, drain, cool, shade, ventilate, dry, salt, or secure containment | Which output needs which route and available infrastructure | Time, temperature, fuel, water, loss, spoilage, success |
| Residue | Existing item relationship or descriptive waste when a consumer is proven | Reuse, trade, ritual, narrative, or hazard value | Accumulation, pollution, cleanup, recovery, inventory |
| Cultural restriction | Lore/description or institution/faction relationship | Region-specific taboo, sacredness, law, ownership, status | Permission checks, crime, reputation, enforcement, market behavior |

Residue should become a static identity only when it has repeated material, trade, hazard, ritual, quest, or narrative consumers. Ordinary soil, wash water, trimmings, spoiled matter, offal, broken shell, short fiber, retting liquor, manure/runoff, blood, feathers, hair, and unusable tissues may remain chain prose when itemization would add catalog noise. A hazardous residue can matter without becoming loot.

The live biological placeholders make quantitative ecology especially unsafe. No empty object may be interpreted as zero, false, unknown-but-benign, or a default value. A future schema/validator reconciliation must decide whether scalar biology is removed, made nullable/optional, or genuinely authored before any runtime consumer exists.

## 12. Magic Interaction Classification

Ordinary biology and mundane handling remain primary. The live magical basis is limited to the 27 finite vessel records, four magic-infrastructure records, three catalyst-profiled items, seven conduit-profiled items, spell metadata, and global affinity/material rules. There is no biological affinity owner, enchanting execution, or evidence that a fantasy-named tissue retains power.

| Class | Gate 2 application | Canonical basis and required mundane support | Why it is bounded / disposition |
| --- | --- | --- | --- |
| `mundane_only` | Ordinary collection, sorting, hide stabilization, fiber preparation, fisheries handling, and nonmagical outputs | Canonical source/item plus tools, skill, water, containers, airflow, shade, fuel, cold, transport | Default posture; magic is unnecessary or would add no meaningful choice |
| `mundane_baseline_magic_assisted` | Conditional cold holding, controlled drying/ventilation, clean-water indication, toxin warning, temporary containment | Later explicit spell/ward/enchantment; finite vessel; mundane insulated/sealed/drained/vented housing; trained operator | Capacity, recharge, ambient conditions, target mass/volume, duration, opening, maintenance, failure, security, and cost prevent universality |
| `parallel_magical_specialty` | Possible stabilization or handling of an explicitly magical canonical drop | Explicit source/drop and later authored affinity/persistence; specialist container, conduit/catalyst if canonically applicable | Must remain an optional specialist route beside ordinary material handling; no potency inferred here |
| `magic_equivalent_institutional` | Conditional fixed cold room, protected dangerous-material store, or specialist detection station | Relevant magic-infrastructure authority plus vessel tier, installation, mundane structure, inspection, recharge and security | Guild/temple/academy/military/major-merchant scale; attractive for reliability or rare cargo, not free throughput |
| `magic_exclusive` | No biological process accepted by this gate | Would require explicit canon that a material or containment route cannot exist mundanely | `ember_core`, slime glands, and other extraordinary outputs retain only their current item/drop identity pending Gate 7 and later authorship |
| `unstable_or_prohibited` | Free matter, automatic regeneration, universal purification/neutralization, zero-cost preservation, generic tag-driven harvesting, guaranteed magical persistence | Conflicts with bounded magic guardrails | Reject |

### Ice-conditioned biological container test

A defensible later comparison begins with cellar, icehouse, insulation, evaporative cooling, cold water, seasonal ice, and prompt transport. A small ice-assisted box or medicine/venom case could conditionally use an Ice shard; a larger fixed chest or merchant/ship store could require a crystal; an institutional cold room could require a cluster. Those are **relative research bands only**, not final assignments.

Every case still needs container volume, insulation, ambient temperature/humidity, desired difference, duration, opening frequency, target mass, seals, drainage, condensation/airflow, `cold_soak` recharge access, affinity/skill, stability, mismatch, maintenance, failure, transport, theft, and replacement decisions. The vessel supplies or stabilizes cooling; it does not create sterile storage, eliminate toxins, stop all decay, or imply a modern refrigerator. Gate 7 owns the detailed comparison and may reject or revise every band.

## 13. Content Candidate And Authority Matrix

No row is an accepted implementation action. Identity candidates remain conditional on collision audit, live consumers, schema capability, value coverage, dependency closure, later-gate findings, and the unversioned integration.

| # | Candidate | Classification | Proposed authority | Gameplay value | Confidence | Disposition | Dependencies | Blockers | Relevant later gate |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Preserve source/part/output/prepared/product/market/loot/runtime separation | `factual_correction` | Cross-domain synthesis and relevant existing owners | critical | high | Accept as integration principle | Gate 1 compatibility | None for documentation | Integration |
| 2 | Reconcile 11,290 biological scalar `{}` placeholders with declared schemas | `factual_correction`, `schema_or_validator_precondition` | Flora/fauna schemas, validators, content owners | critical | high | Verify and plan separately; no Gate 2 fix | Fresh schema/content audit | Broad content risk; no scalar authority | Before any biology runtime |
| 3 | Pair flora part descriptors explicitly to existing output keys | `missing_static_relationship` | Flora authority plus item references | high | high | Conditional relationship candidate | Schema decision; full collision/semantic audit | Parallel arrays do not establish pairing | Integration / later static ecology |
| 4 | Clarify fauna passive versus slaughter route semantics | `missing_static_relationship` | Fauna authority | high | high | Conditional correction | Source-by-source authorship | No anatomy owner; placeholders | Gate 3 / `0.6.6` |
| 5 | Separate bird egg production from feather molt | `missing_static_relationship`, `schema_or_validator_precondition` | Fauna authority | high | high | Verify then disposition | Bird-by-bird output audit | Shared female passive window | Gate 3 / `0.6.6` |
| 6 | Verify `fauna.garter_snake` oviparity and egg output | `factual_correction`, `authored_input_required` | Fauna authority | high | high | Confirm intended taxonomy before correction | Canon intent | Fictional divergence remains possible | `0.6.6` |
| 7 | Clarify female/reproductive `fauna.ox` and `ox_milk` | `factual_correction`, `authored_input_required` | Fauna authority | high | medium | Author intent required; do not auto-rewrite | Historical naming decision | `ox` can have broader historical use | Gate 3 / `0.6.6` |
| 8 | Represent naturally cast antler separately from slaughter material | `missing_static_relationship` | Fauna output relationships | medium | high | Conditional relationship using existing identities where possible | Canonical cervid audit | Season/recovery action absent | Gate 3 / `0.6.6` |
| 9 | Reconcile turtle/tortoise shell, scute, scale, and bone usage | `factual_correction`, `authored_input_required` | Fauna and item authorities | medium | medium | Anatomy/collision audit before disposition | Species and item review | Current naming inconsistency | `0.6.6` / Gate 4 |
| 10 | Separate fish/marine-mammal fatty tissue or liver from processed oil | `missing_static_relationship`, `factual_correction` | Fauna, items, production chains | high | high | Verify existing identities and consumers | Gates 4/5 chain evidence | Direct output currently collapses stages | Gates 4-5 |
| 11 | Treat roe as a biological output, not an authorized nonlethal harvest | `runtime_owner_required` | Future fishing/butchery owner | critical | high | Reserve action; retain static identity only | Fishing design | No catch/harvest runtime | Gate 5 / later runtime |
| 12 | Raw pearl/nacre relationship or identity | `missing_static_identity`, `missing_static_relationship`, `authored_input_required` | Suitable mollusk, items, values, chains | medium | medium | Conditional; no generic oyster output | Canon source, consumers, collision/value audit | No raw identity; regional prose only | Gates 4/6 / `0.6.6` |
| 13 | Blood, fat, sinew, tendon, manure, guano, offal, gland streams | `optional_depth`, `missing_static_relationship` | Fauna/items/chains as appropriate | medium | medium | Consider only where repeated consumers justify distinction | Gate 3-6 dependency closure | Generic `blood` and source-specific gland items already exist; other streams need exact collision checks; catalog-noise risk | Gates 3-6 |
| 14 | Fungal/lichen identity, substrate, lookalike, and handling lore | `lore_or_description_only`, `missing_static_relationship` | Flora, habitats, Knowledge | high | medium | Prefer recognition and relationship value over item sprawl | Canonical source audit | Classification ambiguity; effects absent | `0.6.6` / recognition plan |
| 15 | Explicit sap/resin/gum/latex source relationships | `missing_static_relationship` | Flora, items, chains | high | high | Preserve distinct routes; no universal products | Source-specific authorship | Current arrays unpaired | Gate 4 |
| 16 | Stem/reed-to-retted-fiber/tow/shive relationship | `missing_static_relationship` | Flora/items/chains | high | high | Carry process order to later gates | Existing item/chain collision audit | Exact transformations unresolved | Gates 4/6 |
| 17 | Aquatic source-water/substrate and water-quality relationship | `missing_static_relationship`, `authored_input_required` | Fauna/habitat/region or future source-site authority | high | high | Conditional static context | Owner/schema decision | No aquatic class/source-site owner | Integration / `0.6.6` |
| 18 | Reconcile 14 flora tool descriptors with exact item or capability vocabulary | `schema_or_validator_precondition` | Flora/tool/item authorities | critical | high | Do not auto-resolve names | Capability model | Eight descriptors lack item matches | Gate 6 |
| 19 | Source/output-to-workplace/tool/skill crosswalk | `missing_static_relationship`, `authored_input_required` | Existing source/item/workplace/skill owners | high | high | Author explicitly | Gate 6 process findings | No execution owner | Gate 6 |
| 20 | Natural-world Knowledge coverage for handling/identification | `lore_or_description_only`, `optional_depth` | Knowledge domains/snippets | medium | medium | Conditional lore support | Recognition taxonomy plan | Snippets do not execute recognition | Post-`0.6.7` plan |
| 21 | Explicit monster/fauna lineage for six implied parallels | `missing_static_relationship`, `authored_input_required` | Monster optional lineage fields | high | medium | Verify source-by-source | Stronger validation and canon intent | Fields currently unused | `0.6.6` |
| 22 | Treat monster drops as anatomy or butchery outputs | `conflicts_with_canon` | None | negative | high | Reject | None | Drops may be carried or contextual loot | `0.6.6` / loot decision |
| 23 | Retained magical potency/affinity on biological outputs | `authored_input_required`, `schema_or_validator_precondition` | Future explicit magic/material authority | high | low | Defer; absence is not zero and name is not proof | Gate 7; canonical source evidence | No flora/fauna affinity; monster fields unused | Gate 7 / `0.6.6` |
| 24 | General reusable loot-table authority | `schema_or_validator_precondition` | Future item-owned loot decision | high | medium | Preserve source-local arrays until dedicated decision | Monster/encounter/quest reconciliation | No runtime generator | Later loot plan |
| 25 | Harvest, hunt, fish, butcher, milk, shear, tap, collect, or scavenge commands | `runtime_owner_required` | Future engine/session/inventory owner | critical | high | Reserve | Command, eligibility, item creation, persistence design | No current owner | Later runtime |
| 26 | Population, migration, breeding, depletion, regrowth, reef/colony recovery | `runtime_owner_required` | Future ecology/population/save owner | critical | high | Reserve | Valid scalar model and spatial ownership | Placeholders; no biological state | Later runtime |
| 27 | Poison, venom, disease, allergy, contamination, medicine, spoilage effects | `runtime_owner_required`, `authored_input_required` | Future body/status/medical/spoilage owners | high | high | Qualitative hazards only | Dedicated high-risk design | No effect catalogs/runtime | Later dedicated runs |
| 28 | Bounded cold, warning, drying, ventilation, and containment assistance | `authored_input_required` | Gate 7 magic infrastructure plus later runtime | high | medium | Evaluate case by case | Vessel/affinity/infrastructure/maintenance design | Throughput and failure unresolved | Gate 7 |
| 29 | Free biological matter, infinite output, automatic regeneration, universal purification | `conflicts_with_canon`, `rejected_complexity` | None | negative | high | Reject | None | Violates magic and ecology guardrails | None |
| 30 | New output because real anatomy suggests it | `conflicts_with_canon` | None | negative | high | Reject without canonical source relationship and consumers | Full authority/collision review | External evidence cannot create canon | Integration |
| 31 | Whaling action or whale-derived expansion from `whale routes` prose | `conflicts_with_canon`, `authored_input_required` | No present action authority | negative | high | Reject as current inference; preserve existing fauna outputs as static relationships only | Dedicated canon/culture/ecology decision | `whale routes` supplies no placement, action, law, or new-output authority | Future only if explicitly scoped |
| 32 | Pollination/decomposition as loot items | `rejected_complexity` | None | negative | high | Reject; treat as service/lore/ecology if useful | Consumer evidence | Category error | `0.6.6` / lore |
| 33 | Exact yields, ratios, rates, calendars, timers, quality, hazard chances | `runtime_owner_required`, `authored_input_required` | Future balance/runtime owners | critical | high | Reserve | Valid source data and gameplay design | Research is not balance authority | Later dedicated runs |
| 34 | Sacred, taboo, status, legal, or institution-controlled biological use | `authored_input_required`, `lore_or_description_only` | Regions, cultures, religions, factions, institutions | high | medium | Author region/source specifically | Region/source-specific canon review | Generic guild charters author some quotas, closures, protected beds, harvest/pasture duties, and quarantine controls; region/source-specific sacred, taboo, and status rules plus runtime enforcement remain absent; external culture cannot be imported | Later lore/system work |
| 35 | Residue itemization rule: require repeated consumer, trade, hazard, ritual, or narrative value | `factual_correction`, `optional_depth` | Cross-domain synthesis and owning catalogs | high | high | Accept as integration filter | Cross-gate consumer audit | Avoid catalog noise | Integration |

## 14. Uncertainty And Confidence

### High confidence

- Live counts, references, output resolution, item/market collisions, placeholder count, static loot coverage, runtime absence, and spatial-derivation boundaries are repository facts at the named baseline.
- A biological source, part, raw output, prepared material, finished product, market identity, static loot possibility, generated instance, and mutable ecology state require distinct authority.
- The repository already covers all current flora/fauna output keys as items and values; identity expansion must be consumer-driven.
- Plant part and method affect source impact ([Chen et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC4967523/), A2); exudates are distinct ([Lambert, Wu, and Santiago-Blay](https://doi.org/10.1021/np050005f), A2; [Konno](https://doi.org/10.1016/j.phytochem.2011.02.016), A2); fungal identity/handling matters and some toxins persist through preparation ([Egli et al.](https://doi.org/10.1016/j.biocon.2005.10.042), A2; [FDA](https://www.fda.gov/food/outbreaks-foodborne-illness/investigation-illnesses-morel-mushrooms-may-2023), B1; [CDC](https://www.cdc.gov/mmwr/preview/mmwrhtml/00047808.htm), B1); hide is not leather ([FAO](https://www.fao.org/4/X6552E/X6552E10.htm), A1); fatty tissue is not a finished oil ([FAO fisheries utilization](https://www.fao.org/4/cc0461en/online/sofia/2022/utilization-processing-fisheries-production.html), A1; [Codex CXS 19-1981](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+19-1981%2FCXS_019e.pdf), A1); shell is not purified chitin ([Hamed, Özogul, and Regenstein](https://doi.org/10.1016/j.tifs.2015.11.007), A2); and dangerous sources require source-specific containment ([WHO](https://www.who.int/publications/m/item/snake-antivenom-immunoglobulins-annex-5-trs-no-1004), A1).
- Egg laying and feather molt are different biological routes ([EFSA](https://doi.org/10.2903/j.efsa.2010.1886), A1); the live shared bird relationship collapses them, while static roe/loot relationships do not authorize actions.
- No external source supplies game-scale yields, timers, effects, or implementation permission.

### Medium confidence

- Which qualitative part, route, impact, life-stage, source-water, substrate, or stabilization fields provide enough gameplay value to justify schema work.
- Which generic identities should coexist with species-specific outputs rather than replace them.
- Whether raw pearl/nacre, manure/guano, sinew/tendon, blood, fat, glands, or particular residues have enough live consumers for static identity/relationship work.
- Which monster/fauna parallels should populate optional lineage metadata and which are only thematic resemblance.
- Which biological Knowledge subjects should become recognition/lore support after the taxonomy plan.

### Low or unresolved

- Exact yield, loss, quality, age, sex, health, diet, season, breeding, migration, recovery, depletion, regrowth, contamination, spoilage, labor, time, fuel, price, and hazard values.
- Whether fantasy-named flora/fauna/monster outputs retain magical potency after recovery.
- Final magical vessel tier, target mass/volume, temperature difference, duration, recharge, failure, access, and cost.
- Final cultural, sacred, taboo, legal, guild, temple, military, merchant, or regional restrictions.
- Placement of unlisted biological sources and all individual source sites/populations.

### Source cautions

- Modern safety and industrial guidance supplies constraints and separation, not historical ubiquity or game mechanics.
- A result for one species, population, climate, reef, forest, or fishery cannot become a universal rule.
- Conservation evidence can identify risk dimensions without prescribing Lineage: Reforged law or culture.
- Real biology cannot establish fantasy-creature scale, anatomy, stable magic, or output.
- Absence from current output arrays is not proof that a body part does not exist; it is proof only that no output relationship is authored.

### Repository issues requiring later verification

- Resolve the 11,290 flora/fauna scalar placeholders against declared schemas and the lint placeholder path before any biological scalar consumer is considered.
- Verify the shared female-only bird egg/feather route and separate egg-laying from molt semantics if canon confirms the distinction.
- Confirm whether `fauna.garter_snake` intentionally diverges from its real-world namesake before correcting oviparity/egg output.
- Clarify the intended meaning of reproductive, milk-producing `fauna.ox` rather than assuming modern lexical usage.
- Review slaughter-only cervid antler relationships and shell/scute/scale/bone naming without inventing collection actions.
- Review passive roe and direct fish/marine-mammal oil outputs as relationship/stage questions, preserving current identities until authority changes.
- Verify the six implied monster/fauna parallels before populating optional lineage fields.
- Determine whether raw pearl/nacre has a canonical source and repeated consumers; regional pearl prose alone is insufficient.

### Later-gate deferrals

- Gate 3: husbandry, cultivation, fodder, milk, eggs, manure, wool, farm slaughter, land/water, and domestic outputs.
- Gate 4: hides, leather, fiber, chitin, shell, bone, horn, oils, wax, resin, dye, binder, and prepared-material chains.
- Gate 5: meat/fish/dairy/egg/fungi handling, rendering, preservation, food-safety abstraction, and residues.
- Gate 6: tools, workplaces, process order, energy, water, heat, drying, maintenance, waste, salvage, and recipe abstraction.
- Gate 7: bounded magic assistance, Ice-conditioned containers, retained potency, infrastructure, vessels, recharge, failure, and institutional access.
- `0.6.6`: exact monster/ecology/loot static content under the accepted authority boundary.
- Later runtime: commands, item creation, generated loot, populations, recovery, effects, spoilage, persistence, and enforcement.

## 15. Integration Disposition

The later cross-domain integration should:

1. **Accept** the conceptual separation, relationship-first posture, residue itemization filter, ordinary-technology baseline, and strict runtime reservations.
2. **Verify** the biological placeholder/schema conflict, bird egg/feather relationship, garter-snake biology, ox identity, antler route, shell/scute naming, roe posture, direct oil outputs, monster/fauna parallels, and raw pearl/nacre gap against live authority at integration time.
3. **Correct** no content automatically; convert verified issues into narrow, separately authorized work with explicit owners.
4. **Promote** durable source-to-output, part-to-output, route, stabilization, tool/workplace/skill, ecology, and hazard distinctions only where they serve accepted consumers.
5. **Defer** agriculture, material refinement, food preservation, production tooling, magitech, `0.6.6`, loot authority, recognition, and runtime questions to their named gates or later plans.
6. **Reject** market-key aliases, name-inferred outputs or affinity, generic monster anatomy, generic mollusk dye/pearls, pollination-as-loot, whale-route-to-whaling inference, free matter, universal purification, and exact research-derived balance values.
7. **Collision-audit** every conditional identity against items, market values, source outputs, stages/roles, chains, recipes, lore, and live consumers before considering it.
8. **Reserve** harvesting, hunting, fishing, butchery, milking, shearing, loot generation, item creation, population, migration, reproduction, depletion, regrowth, spoilage, medical/toxin/allergy effects, labor, fuel, time, quality, economy behavior, and persistence.

The next executable research gate is:

`GPT-DR.agriculture.land-food-livestock`

Its expected artifact is:

`docs/dev/tmp-agriculture-land-food-livestock-research-2026-07-14.md`

The active Codex integration prompt remains on hold until all seven accepted temporary cited research artifacts exist. Gate 2 does not unblock `Version 0.6.5 - Item, Material, And Recipe Static Content Expansion` by itself.

## 16. Sources

All 55 external sources actually relied on above are listed here. Accessed 2026-07-14. Distribution: 18 A1, 14 A2, 19 B1, and 4 B2. No C-class source or rejected-report material is used.

| Source | Quality | Supported findings and limitations |
| --- | --- | --- |
| [WHO, *Good Agricultural and Collection Practices for Medicinal Plants*](https://www.who.int/publications/i/item/9241546271) | A1 | Identity, plant part, collection, sorting, timing, drying, and contamination; no effects, yields, or calendars. |
| [WHO, *WHO Guidelines on Good Herbal Processing Practices for Herbal Medicines*](https://www.who.int/docs/default-source/medicines/norms-and-standards/guidelines/production/trs1010-annex1-herbal-processing.pdf) | A1 | Processing hygiene, segregation, drying, and contamination; modern safety analogue only. |
| [EMA, *Good Agricultural and Collection Practice for Starting Materials of Herbal Origin*](https://www.ema.europa.eu/en/good-agricultural-collection-practice-starting-materials-herbal-origin-scientific-guideline) | A1 | Identification, lookalikes, training, and toxic/allergenic handling; no game institutions or effects. |
| [Chen et al., *Conservation and Sustainable Use of Medicinal Plants: Problems, Progress, and Prospects*](https://pmc.ncbi.nlm.nih.gov/articles/PMC4967523/) | A2 | Part/intensity/population-dependent impact; no universal recovery rule. |
| [Delvaux, Sinsin, and Van Damme, *Impact of Season, Stem Diameter and Intensity of Debarking on Survival and Bark Re-growth Pattern of Medicinal Tree Species, Benin, West Africa*](https://doi.org/10.1016/j.biocon.2010.07.009) | A2 | Species, size, season, and circumference matter; regional species set only. |
| [Egli et al., *Mushroom Picking Does Not Impair Future Harvests: Results of a Long-term Study in Switzerland*](https://doi.org/10.1016/j.biocon.2005.10.042) | A2 | Site-specific harvest and trampling effects; not universal. |
| [FDA, 2023 morel-mushroom illness investigation](https://www.fda.gov/food/outbreaks-foodborne-illness/investigation-illnesses-morel-mushrooms-may-2023) | B1 | Expert identity, freshness, breathable handling, and preparation caution; modern incident evidence. |
| [CDC, Amanita mushroom poisoning report](https://www.cdc.gov/mmwr/preview/mmwrhtml/00047808.htm) | B1 | Some toxins survive preparation; disease-specific modern safety analogue. |
| [Calà et al., *Towards the Identification of the Lichen Species in Historical Orchil Dyes by HPLC-MS/MS*](https://doi.org/10.1016/j.microc.2019.104140) | A2 | Lichen dye is species/process specific; no generic repository dye identity. |
| [National Park Service, *Lichens*](https://www.nps.gov/jotr/learn/nature/lichens.htm) | B1 | Slow growth and disturbance sensitivity; site/educational scope. |
| [British Lichen Society, position on lichens for dyeing](https://britishlichensociety.org.uk/conservation/management/positions/use-of-lichens-for-dyeing) | B2 | Minimal/detached collection posture; cultural/conservation guidance, not canon. |
| [Lambert, Wu, and Santiago-Blay, *Taxonomic and Chemical Relationships Revealed by Nuclear Magnetic Resonance Spectra of Plant Exudates*](https://doi.org/10.1021/np050005f) | A2 | Resin, gum, and gum-resin distinctions; broad review, no source-specific game output. |
| [Konno, *Plant Latex and Other Exudates as Plant Defense Systems: Roles of Various Defense Chemicals and Proteins Contained Therein*](https://doi.org/10.1016/j.phytochem.2011.02.016) | A2 | Latex chemistry and defensive role; cannot infer latex from any plant name. |
| [López-Álvarez, Zas, and Marey-Pérez, *Resin Tapping: A Review of the Main Factors Modulating Pine Resin Yield*](https://doi.org/10.1016/j.indcrop.2023.117105) | A2 | Tapping depends on species, method, condition, and management; modern forestry scope. |
| [Angulu and Gusovius, *Retting of Bast Fiber Crops Like Hemp and Flax—A Review for Classification of Procedures*](https://doi.org/10.3390/fib12030028) | A2 | Retting dependencies and stage separation; no historical ratios or settings. |
| [Manian, Cordin, and Pham, *Extraction of Cellulose Fibers from Flax and Hemp: A Review*](https://doi.org/10.1007/s10570-021-04051-x) | A2 | Breaking/scutching/combing, long fiber, tow, and shives; modern machinery not imported. |
| [Historic England, thatching-materials report](https://historicengland.org.uk/research/results/reports/30-2023) | B1 | Reed/straw, regional weather, labor, access, and conservation; England-specific. |
| [NatureScot, sustainable seaweed harvesting guidance](https://www.nature.scot/doc/advice-sustainable-harvesting-seaweed) | B1 | Attached/beach-cast, frond/holdfast, site/species/method distinctions; Scotland-specific. |
| [FAO, *Kappaphycus Seaweed Cultivation Manual*](https://openknowledge.fao.org/3/CA0873EN/ca0873en.pdf) | B1 | Clean, raised, thin, ventilated drying and contamination protection; tropical cultivation analogue. |
| [FAO, *Utilization of Slaughterhouse By-products*](https://www.fao.org/4/X6114E/x6114e04.htm) | A1 | Distinct tissue/byproduct streams and recovery dependencies; older industrial guidance, no scale/yields. |
| [FAO, slaughtering, meat cutting, and further processing guidance](https://www.fao.org/4/T0279E/T0279E04.htm) | A1 | Dressing, separation, clean collection, and prompt handling; modern hygiene analogue. |
| [FAO, hides and skins curing](https://www.fao.org/4/X6552E/X6552E10.htm) | A1 | Fresh hide stabilization by drying/salting distinct from tanning; no numeric curing recipe. |
| [FAO/IDF, *Guide to Good Dairy Farming Practice*](https://www.fao.org/4/ba0027e/ba0027e00.htm) | A1 | Animal health, clean milking, feed/water, welfare, hygiene; no husbandry mechanics. |
| [National Park Service, *Horns Versus Antlers*](https://www.nps.gov/articles/yell-horns-vs-antlers.htm) | B1 | Bone antler/casting versus horn core/sheath; broad anatomy with exceptions. |
| [FAO, poultry products and processing](https://www.fao.org/poultry-production-products/products-and-processing/products-and-processing/) | A1 | Eggs, meat, manure, feathers, shell, offal as distinct streams; no yields or schedules. |
| [EFSA, feather collection from live geese](https://doi.org/10.2903/j.efsa.2010.1886) | A1 | Ripe-molt gathering versus forced plucking and injury; goose-specific modern welfare evidence. |
| [Cornell Lab of Ornithology, *The Basics: Feather Molt*](https://www.allaboutbirds.org/news/the-basics-feather-molt/) | B2 | Species/individual/season/breeding/migration variation; educational overview. |
| [WHO, snake-antivenom production guidance](https://www.who.int/publications/m/item/snake-antivenom-immunoglobulins-annex-5-trs-no-1004) | A1 | Trained handling, secure facilities, identity, traceability, venom variability; no extraction method/effect. |
| [USGS, amphibian declines through geographic approaches](https://www.usgs.gov/publications/understanding-amphibian-declines-through-geographic-approaches) | B1 | Permeable skin and aquatic/terrestrial habitat sensitivity; broad ecology only. |
| [National Park Service, *Garter Snakes*](https://www.nps.gov/articles/000/garter-snakes.htm) | B1 | Live-bearing garter-snake biology; confirm intended fictional taxonomy first. |
| [American Museum of Natural History, *Turtle Shells*](https://www.amnh.org/research/science-conservation/projects/case-studies/collections-core-turtle-shells) | B2 | Bony shell and keratinous scute distinction; museum-conservation context. |
| [FAO, *Good Beekeeping Practices*](https://doi.org/10.4060/cb5353en) | B1 | Colony health, protective equipment, hygiene, and product separation; modern apiculture guidance. |
| [FAO, *Value-added Products from Beekeeping*](https://www.fao.org/4/w0076e/w0076e03.htm) | B1 | Honey, wax, pollen, propolis, royal jelly, venom as distinct outputs; no canonical species additions. |
| [IPBES, pollination assessment](https://files.ipbes.net/ipbes-web-prod-public-files/downloads/pdf/2017_pollination_full_report_book_v12_pages.pdf) | A1 | Pollination as ecosystem service; not an inventory drop. |
| [FAO / Yong-woo Lee, *Silk Reeling and Testing Manual*](https://www.fao.org/4/x2099e/x2099e00.htm) | B1 | Organism/feed/lifecycle/reeling dependencies; does not authorize a silk industry. |
| [FAO / Yong-woo Lee, *Silk Reeling and Testing Manual*, Chapter 8, “Utilization of By-products”](https://www.fao.org/4/x2099e/x2099e09.htm) | B1 | Cocoon, pupa, and other byproduct streams; does not authorize repository outputs or processing. |
| [Zainol Abidin et al., *The Potential of Insects as Alternative Sources of Chitin: An Overview on the Chemical Method of Extraction from Various Sources*](https://doi.org/10.3390/ijms21144978) | A2 | Raw biological shell/exuvia versus isolated chitin; modern processing scope. |
| [FAO, utilization and processing of fisheries production](https://www.fao.org/4/cc0461en/online/sofia/2022/utilization-processing-fisheries-production.html) | A1 | Whole catch, tissues, byproducts, rapid degradation, later oil/material use; no quantities imported. |
| [FAO/WHO Codex Alimentarius, *Standard for Edible Fats and Oils Not Covered by Individual Standards (CXS 19-1981)*](https://www.fao.org/fao-who-codexalimentarius/sh-proxy/en/?lnk=1&url=https%3A%2F%2Fworkspace.fao.org%2Fsites%2Fcodex%2FStandards%2FCXS+19-1981%2FCXS_019e.pdf) | A1 | Establishes a fat/oil food-product category, not anatomical identity, marine-mammal rendering, or a process. |
| [FAO, on-board handling in small-scale fisheries](https://www.fao.org/flw-in-fish-value-chains/value-chain/capture-fisheries/on-board-handling-in-small-scale-fisheries/appropriate-technology/en/) | A1 | Careful handling, clean containers, contamination control, and cooling pressure; no exact settings. |
| [FAO, ecosystem effects of fishing](https://www.fao.org/4/y4773e/y4773e05.htm) | A1 | Selectivity, juveniles, spawning stock, bycatch, and ecosystem effects; no runtime formula. |
| [NOAA Fisheries, salmon life cycle and seasonal planning](https://www.fisheries.noaa.gov/west-coast/sustainable-fisheries/salmon-life-cycle-and-seasonal-fishery-planning) | B1 | Migration, spawning timing, and return-age vulnerability; salmon-specific. |
| [NOAA Fisheries, Atlantic sturgeon science](https://www.fisheries.noaa.gov/species/atlantic-sturgeon/science) | B1 | Slow growth, late maturity, migration, barriers, bycatch, water quality; species analogue only. |
| [International Whaling Commission, whaling overview](https://iwc.int/management-and-conservation/whaling) | B1 | Cultural, subsistence, conservation, and institutional dimensions; modern regime is not repository canon. |
| [FAO/WHO, code for live and raw bivalve molluscs](https://www.fao.org/4/j1682e/j1682e04.htm) | A1 | Harvest-water contamination, biotoxins, and limits of purification; no thresholds/mechanics. |
| [FAO/WHO, *Technical Guidance for the Development of the Growing Area Aspects of Bivalve Mollusc Sanitation Programmes*, 2nd ed.](https://www.who.int/publications/i/item/9789240030213) | A1 | Harvest-area condition and toxin monitoring as source concerns; no repository program or law. |
| [NOAA Fisheries, oyster reef habitat](https://www.fisheries.noaa.gov/national/habitat-conservation/oyster-reef-habitat) | B1 | Habitat-forming oysters and dredging/overharvest damage; US systems only. |
| [NOAA Fisheries, white abalone](https://www.fisheries.noaa.gov/species/white-abalone) | B1 | Slow growth, longevity, habitat, disease, and overharvest constraints; species-specific analogue. |
| [Gemological Institute of America, pearl overview](https://www.gia.edu/pearl) | B2 | Suitable mollusk, nacre, organism health/environment, skilled culture distinction; no frequency/yield. |
| [Hamed, Özogul, and Regenstein, *Industrial Applications of Crustacean By-products (Chitin, Chitosan, and Chitooligosaccharides): A Review*](https://doi.org/10.1016/j.tifs.2015.11.007) | A2 | Shell versus isolated chitin/chitosan and required processing; modern industrial scope. |
| [Derby, *Cephalopod Ink: Production, Chemistry, Functions and Applications*](https://doi.org/10.3390/md12052700) | A2 | Ink-sac secretion mixture and biological function; no universal dye or stabilization. |
| [Cooksey, *Tyrian Purple: The First Four Thousand Years*](https://pmc.ncbi.nlm.nih.gov/articles/PMC10365538/) | A2 | Species- and gland-specific purple dye; supports rejecting generic mollusk dye. |
| [WHO, zoonoses fact sheet](https://www.who.int/news-room/fact-sheets/detail/zoonoses) | A1 | Animal tissues/fluids/products can transmit pathogens; no disease mechanics or probabilities. |
| [FDA, major food allergen overview](https://www.fda.gov/industry/fda-basics-industry/what-major-food-allergen) | B1 | Milk, egg, fish, crustacean-shellfish hazard classes; US regulatory analogue only. |
| [Blamires, Blackledge, and Tso, *Physicochemical Property Variation in Spider Silk: Ecology, Evolution, and Synthetic Production*](https://doi.org/10.1146/annurev-ento-031616-035615) | A2 | Silk varies by species, gland, ecology, environment, and spinning; no fantasy scale/yield/potency. |
