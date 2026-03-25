$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$worldDir = Join-Path $root 'packages/content/base/world'

function Split-List([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value) -or $value -eq '-') { return @() }
  return @($value -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
}

$regionRows = @"
id|dominantBiomeMix|elevationProfile|climateTendencies|freshwaterAvailability|climateSeverity|agriculturalPotential|extractivePotential|hazardLevel|habitationScore|foodProductionCapacity|waterAvailability|climateBurden|hazardPressure|infrastructureDifficulty|populationCapacityMillions|densityBand|urbanPercent|ruralPercent|supplyStrengths|demandPressures|importBias|exportBias|cityCount|townCount|villageCount|outpostCount|strategicCount|resourceDiversityBand|settlementPattern
region.kaelvar|mediterranean_woodland;steppe;dry_scrub;alpine_meadow|mixed_plateau|dry_summers;mild_winters;wind_stressed_interior|moderate|moderate|moderate|strong|moderate|68|64|58|42|38|46|40|moderate|18|82|wine;olive_oil;wool;copper;iron;salt|grain;silk;exotic_woods;magical_reagents|0.58|0.62|0|0|0|0|0|high|Southern coasts cluster dense ports and estates while the interior depends on marches, mines, and caravan forts.
region.valtherion|mixed_forest;deciduous_forest;prairie;steppe|broad_lowlands_with_northern_uplands|temperate_core;wet_river_belts;cold_north|high|low|very_high|strong|low|86|88|84|28|26|30|140|very_high|22|78|grain;horses;flax;river_trade;steel_tools|spices;rare_ores;pearls;prestige_goods|0.42|0.74|0|0|0|0|0|very_high|Dense basin and river corridors support the largest settlement mesh in the world.
region.serathyl|temperate_rainforest;mixed_forest;chaparral_coast|maritime_lowlands_with_mountain_spine|mild_maritime;wet_coasts;long_summers|high|moderate|moderate|moderate|moderate|72|63|78|36|44|48|55|moderate|24|76|hardwood_lumber;citrus;ships;dyes;fish|grain;iron;construction_stone|0.57|0.67|0|0|0|0|0|high|Ports and estuaries are dense, while wet forests and mountains remain sparser and more specialized.
region.draemor|prairie;deciduous_forest;wet_lowland|broad_fertile_basin|wet_temperate;stable_rivers;floodplain_seasons|very_high|low|very_high|moderate|low|89|92|88|24|28|32|90|high|20|80|grain;beer;cattle;vegetables|metal_ore;hardwood;prestige_goods|0.38|0.72|0|0|0|0|0|high|The basin can sustain dense agrarian networks with strong river market towns.
region.talmyra|seasonal_forest;savanna;rainforest;cloud_forest|rugged_uplands_and_peninsulas|hot;storm_prone;frontier_wet_dry_swings|moderate|high|low_moderate|strong|high|57|54|72|52|58|60|25|low|20|80|spices;rare_hardwood;resin;precious_metals;tropical_fruit|grain;steel;cloth|0.68|0.63|0|0|0|0|0|very_high|Valleys and controlled coasts hold most population while harsher coasts and uplands stay specialized.
region.myridian_chain|mixed_forest_archipelago;temperate_rainforest;marine_shelf|rugged_archipelago|mild_wet_maritime|moderate_high|moderate|moderate|moderate|moderate|62|48|60|44|42|50|8|moderate|28|72|maritime_services;fish;pearls;ship_repair|grain;metal;bulk_timber|0.62|0.66|0|0|0|0|0|moderate|Harbor chains and relay islands dominate settlement while interior ridges remain sparse.
region.lantern_isles|seasonal_tropical_forest;mangrove;chaparral|low_volcanic_islands|hot_seasonal;wet_coastal_belts|moderate|moderate|moderate|moderate|moderate|56|46|55|50|48|58|4|low|24|76|fish;citrus;spices;tropical_woods|grain;iron;draft_animals|0.65|0.61|0|0|0|0|0|moderate|Harbors and sheltered lagoons sustain the islands more than inland acreage does.
region.serpents_wake|mangrove;dry_forest;savanna;reef_shelf|low_swampy_islands|hot_wet;storm_exposed;flood_prone|high_but_managed|high|low|moderate|very_high|43|36|58|62|68|70|2|low|22|78|salt_fish;mangrove_timber;dyestuffs;passage_services|grain;iron;cloth|0.8|0.57|0|0|0|0|0|moderate|Settlement survives through convoy support, salvage, and hard coastal adaptation rather than agrarian depth.
region.dawnreach_isles|taiga;conifer_forest;tundra;cold_marine|rugged_cold_islands|long_winters;short_growing_season;cold_maritime|moderate|very_high|low|limited_moderate|high|34|28|46|74|56|72|1|very_low|18|82|cold_fish;furs;conifer_timber;resin|grain;textiles;forged_metal|0.82|0.54|0|0|0|0|0|moderate|Tiny cold-harbor networks persist through fisheries, fur, and maritime relay work.
region.verdant_thalos|mediterranean_woodland;mixed_forest;coastal_scrub|low_hills_and_coast|mild|high|low|high|moderate|low|84|82|78|32|24|36|24|high|24|76|wine;olive_oil;fruit;wool;timber|grain;iron_tools;luxury_cloth|0.44|0.71|3|10|34|5|4|high|Cities and estate belts favor the coast and vineyard corridors, with secondary towns on the farm interior.
region.auric_marches|dry_scrub;steppe;upland_meadow|plateau_and_broken_uplands|dry;wind_hard;frontier|low_moderate|moderate|low_moderate|high|medium|52|38|34|48|46|58|10|low|14|86|copper;iron;salt;stone;goat_wool|grain;finished_cloth;timber;oils|0.72|0.58|1|5|14|10|6|high|Sparse mining towns and caravan forts occupy water-secured breaks in the plateau.
region.shattercap_isles|conifer_islands;cold_marine;rocky_shoals|rugged_islands|cool_maritime;storm_washed|moderate|moderate_high|low_moderate|moderate|medium|61|46|52|56|42|54|6|low|20|80|cold_fish;resin_timber;furs|grain;textiles;worked_metal|0.68|0.55|1|4|10|5|4|moderate|Harbors and beacon cliffs dominate the small island settlement pattern.
region.sapphire_rivers|alluvial_mixed_forest;floodplain;marsh_edge|lowland_basin|wet_river;temperate|very_high|low|very_high|moderate|low|92|95|96|22|20|28|52|very_high|24|76|grain;flax;river_fish;paper_inputs|salt;hardwood;spices;prestige_goods|0.34|0.82|6|18|70|8|6|high|River cities, floodplain markets, and crossing towns create the densest inland network.
region.jade_expanse|prairie;steppe;orchard_belt|rolling_plains|temperate_open_country|high|low|very_high|moderate|low|88|90|82|24|22|30|44|high|20|80|grain;cattle;horses;leather|timber;refined_metal;luxury_goods|0.37|0.77|4|16|64|5|4|high|Broad agrarian settlement with horse-breeding and market corridors rather than deep forest clustering.
region.crownlands|taiga;mixed_forest;river_vales|upland_northland|cold_temperate;long_winter|high|moderate_high|moderate|strong|medium|68|56|70|58|38|46|22|moderate|18|82|timber;furs;iron;smoked_fish|grain;salt;fine_textiles|0.61|0.59|2|9|32|6|5|high|Forest valleys and winter strongholds support moderate settlement with protected gates and bastions.
region.embersteppe|dry_steppe;prairie;canyon_breaks|open_plain_badland_fringe|dry_temperate;windy|moderate|moderate|moderate|moderate_high|medium|64|58|50|46|40|44|22|moderate|16|84|horses;sheep;hides;copper|grain;cloth;timber;river_goods|0.63|0.57|2|8|28|9|5|moderate|Pastoral corridors and guarded wells define the viable settlement pattern.
region.sailors_verge|chaparral_coast;mixed_forest;estuary|coastal_lowlands|mild_maritime|high|moderate|moderate_high|moderate|medium|79|66|74|34|36|38|25|high|26|74|fish;citrus;wine;ships|grain;iron;stone|0.49|0.74|3|11|24|4|4|high|Dense maritime settlement follows estuaries, ports, and rope or mast towns.
region.green_reach|rainforest;wet_forest;river_jungle|lowland_forest_basin|wet;humid|very_high|moderate|moderate|moderate|high|70|56|88|44|54|62|18|moderate|16|84|hardwood;dyes;herbs;game|iron;grain;worked_stone|0.6|0.63|2|7|18|8|5|high|Forested clearings, timber crossings, and herb-processing villages dominate the sparse network.
region.windward_spine|alpine;cloud_forest;high_conifer|mountain_chain|cold_wet_highlands;pass_burden|moderate|high|low|high|high|46|28|48|62|60|72|12|low|12|88|iron;silver;stone;mountain_wool|grain;salt;cloth|0.78|0.56|1|4|10|10|7|high|Pass holds, quarry towns, and alpine redoubts anchor a harsh but valuable mountain corridor.
region.heart_basin|prairie;mixed_deciduous;wetland_edge|broad_basin|wet_temperate;stable_rivers|very_high|low|very_high|moderate|low|94|97|95|20|18|26|48|very_high|20|80|grain;beer;cattle;vegetables|metal_ore;hardwood;prestige_goods|0.3|0.83|5|18|72|4|4|high|The primary southern breadbasket supports dense market towns and multiple large cities.
region.emerald_mantle|deciduous_forest;mixed_forest;marsh_fringe|rolling_forest_uplands|temperate;wet_springs|high|moderate|high|moderate|low_moderate|78|74|80|30|28|40|24|high|16|84|timber;orchards;hides;herbs|iron;salt;ceramics;glass|0.45|0.7|2|10|30|6|4|high|Mixed pasture, orchard, and forest lanes support moderate-high inland settlement.
region.stormcap_coast|storm_coast;estuary;chaparral_fringe|low_coast_and_bluffs|storm_washed_maritime|high|moderate|moderate_high|moderate|medium|74|62|76|38|44|42|18|high|24|76|fish;salt;ship_stores;harbor_services|grain;construction_timber;worked_metal|0.55|0.69|2|8|20|4|4|moderate|Storm harbors and defended coast villages cluster where anchorages are reliable enough.
region.silver_valleys|seasonal_forest;river_valleys;savanna_fringe|broken_valleys_and_uplands|hot_valley;wet_seasonal|high|moderate_high|moderate|high|medium_high|65|54|72|44|46|54|12|moderate|18|82|silver;gold;valley_produce;pack_animals|textiles;salt;lowland_timber|0.62|0.61|1|6|18|8|5|high|Valley cities and ford towns are viable, while uplands favor camps, mines, and forts.
region.thorn_peninsula|dry_forest;savanna;mangrove_fringe|peninsula_hills|hot;dry_seasonal;storm_exposed|moderate|high|moderate_low|moderate_high|high|54|42|48|54|56|60|8|low|20|80|spices;rare_hardwood;tropical_fruit;resin|grain;steel;cloth|0.74|0.64|1|4|10|8|6|high|Peninsula trade favors spice ports, fortified routes, and estate belts rather than broad urban build-out.
region.watcher_coast|cliff_coast;dry_coastal_forest;marsh_edge|steep_coast|storm_exposed;hazardous|moderate|high|low|high|very_high|41|26|44|52|68|74|5|low|24|76|fish;stone;harbor_services;military_staging|grain;timber;textiles|0.81|0.52|1|2|6|7|6|moderate|Defense, quarrying, and hard-port control matter more than agrarian settlement here.
"@ | ConvertFrom-Csv -Delimiter '|'

$regionBlueprints = @{}
foreach ($row in $regionRows) {
  $regionBlueprints[$row.id] = [ordered]@{
    dominantBiomeMix = Split-List $row.dominantBiomeMix
    elevationProfile = $row.elevationProfile
    climateTendencies = Split-List $row.climateTendencies
    freshwaterAvailability = $row.freshwaterAvailability
    climateSeverity = $row.climateSeverity
    agriculturalPotential = $row.agriculturalPotential
    extractivePotential = $row.extractivePotential
    hazardLevel = $row.hazardLevel
    simulationProfile = [ordered]@{
      habitationScore = [int][double]$row.habitationScore
      foodProductionCapacity = [int][double]$row.foodProductionCapacity
      waterAvailability = [int][double]$row.waterAvailability
      climateBurden = [int][double]$row.climateBurden
      hazardPressure = [int][double]$row.hazardPressure
      infrastructureDifficulty = [int][double]$row.infrastructureDifficulty
      populationCapacity = [int]([double]$row.populationCapacityMillions * 1000000)
      densityBand = $row.densityBand
    }
    populationProfile = [ordered]@{
      densityBand = $row.densityBand
      estimatedPopulationMillions = [double]$row.populationCapacityMillions
      populationCapacityMillions = [double]$row.populationCapacityMillions
      urbanPopulationPercent = [int][double]$row.urbanPercent
      ruralPopulationPercent = [int][double]$row.ruralPercent
      settlementPattern = $row.settlementPattern
    }
    economicProfile = [ordered]@{
      supplyStrengths = Split-List $row.supplyStrengths
      demandPressures = Split-List $row.demandPressures
      importBias = [double]$row.importBias
      exportBias = [double]$row.exportBias
      resourceDiversityBand = $row.resourceDiversityBand
    }
    settlementDistributionModel = [ordered]@{
      targetCounts = [ordered]@{
        city = [int][double]$row.cityCount
        town = [int][double]$row.townCount
        village = [int][double]$row.villageCount
        outpost = [int][double]$row.outpostCount
        strategic_site = [int][double]$row.strategicCount
      }
      generationRules = [ordered]@{
        asymmetryMode = 'region_locality_weighted'
        survivabilityDriver = 'simulation_profile'
        settlementPattern = $row.settlementPattern
      }
    }
  }
}

$ecoRows = @"
id|regionId|primaryClimate|secondaryClimates|dominantBiomes|supportingBiomes|nativeFlora|nativeFauna|staple|herd|maritime|timber|metals|herbs|luxury|strengths|gaps|partners|notes|hab|food|water|climateBurden|hazard|infra|populationCapacityMillions|densityBand|resourceDiversityBand|supplyStrengths|demandPressures|importBias|exportBias
regional_ecology.kaelvar|region.kaelvar|climate.dry_year|climate.mild_winter;climate.long_summer|biome.shrublands.mediterranean_woodland;biome.shrublands.dry_scrub;biome.grasslands.steppe;biome.grasslands.alpine_meadow|biome.temperate.mixed_forest;biome.marine.marine|flora.grape_vine;flora.wheat;flora.barley;flora.flax;flora.lavender;flora.chamomile;flora.walnut_tree;flora.lemon_tree|fauna.sheep;fauna.goat;fauna.horse;fauna.deer;fauna.boar;fauna.rabbit;fauna.trout;fauna.cod|moderate|strong|moderate|moderate|strong|moderate|limited|Wine grapes and orchard-edge agriculture;Wool, goats, and horse stock;Copper, iron, and salt districts|Bulk grain is less reliable than basin continents;Silk and tropical luxuries are weak;Rare magical reagents and exotic hardwoods are limited|region.draemor;region.serathyl;region.talmyra|Kaelvar exports metals, wool, and wine while leaning outward for reliable grain and warmer luxuries.|68|64|58|42|38|46|40|moderate|high|wine;olive_oil;wool;copper;iron;salt|grain;silk;exotic_woods;magical_reagents|0.58|0.62
regional_ecology.valtherion|region.valtherion|climate.standard|climate.wet_year;climate.cold|biome.temperate.mixed_forest;biome.temperate.deciduous_forest;biome.grasslands.steppe;biome.grasslands.stormbound_prairie|biome.grasslands.alpine_meadow;biome.marine.marine|flora.wheat;flora.barley;flora.flax;flora.apple_tree;flora.pear_tree;flora.walnut_tree;flora.chamomile;flora.peppermint|fauna.cattle;fauna.horse;fauna.sheep;fauna.deer;fauna.elk;fauna.goat;fauna.trout;fauna.pike;fauna.sturgeon;fauna.cod|surplus|strong|moderate|strong|strong|moderate|limited|Massive grain output and river-fed orchards;Horse, cattle, and sheep husbandry;Flax fiber and timber support for industry|Spices and tropical plant luxuries are weak;Rare hardwoods and exotic fauna are not native strengths;Warm-sea luxury fisheries remain import-biased|region.talmyra;region.serathyl;region.myridian_chain|Valtherion can feed itself and others, but its scale creates permanent demand for luxuries and prestige imports.|86|88|84|28|26|30|140|very_high|very_high|grain;horses;flax;river_trade;steel_tools|spices;rare_ores;pearls;prestige_goods|0.42|0.74
regional_ecology.serathyl|region.serathyl|climate.mild_winter|climate.wet_year;climate.long_summer|biome.temperate.temperate_rainforest;biome.temperate.mixed_forest;biome.temperate.deciduous_forest;biome.marine.marine|biome.shrublands.mediterranean_woodland;biome.shrublands.chaparral|flora.grape_vine;flora.grapefruit_tree;flora.lemon_tree;flora.orange_tree;flora.flax;flora.lavender;flora.chamomile;flora.willow_sapling|fauna.cod;fauna.salmon;fauna.deer;fauna.boar;fauna.goat;fauna.rabbit;fauna.mallard;fauna.oyster|limited|moderate|strong|strong|limited|strong|strong|Hardwood and ship timber output;Citrus, vineyard, and dye-plant crops;Coastal fisheries and preserved seafood|Bulk grain depth is weaker than the basin continents;Iron and stone are limited;Large cavalry herds are not a standout domestic strength|region.valtherion;region.draemor;region.kaelvar|Serathyl trades maritime craft goods and luxury crops for grain, metal, and stone.|72|63|78|36|44|48|55|moderate|high|hardwood_lumber;citrus;ships;dyes;fish|grain;iron;construction_stone|0.57|0.67
regional_ecology.draemor|region.draemor|climate.wet_year|climate.standard;climate.long_summer|biome.grasslands.stormbound_prairie;biome.temperate.deciduous_forest;biome.temperate.mixed_forest;biome.wetlands.floodplain_marsh|biome.marine.marine;biome.shrublands.chaparral|flora.wheat;flora.barley;flora.flax;flora.apple_tree;flora.pear_tree;flora.peppermint;flora.chamomile|fauna.cattle;fauna.horse;fauna.sheep;fauna.goat;fauna.deer;fauna.trout;fauna.catfish|surplus|strong|moderate|strong|moderate|moderate|limited|Massive grain and beer output;Cattle, horse, and hide production;Vegetable belts and market orchards|Needs more metal ore, hardwood, and prestige goods than it produces locally|region.kaelvar;region.serathyl;region.talmyra|Draemor is a southern breadbasket whose deficits are mostly higher-tier goods, not staples.|89|92|88|24|28|32|90|high|high|grain;beer;cattle;vegetables|metal_ore;hardwood;prestige_goods|0.38|0.72
regional_ecology.talmyra|region.talmyra|climate.long_summer|climate.wet_year;climate.dry_year|biome.temperate.seasonal_forest;biome.grasslands.savanna;biome.tropical.tropical_rainforest;biome.grasslands.alpine_meadow|biome.marine.marine;biome.shrublands.dry_scrub|flora.cinnamon_tree;flora.orange_tree;flora.lemon_tree;flora.cassava;flora.tea_shrub;flora.mahogany_tree|fauna.goat;fauna.boar;fauna.deer;fauna.parrotfish;fauna.oyster;fauna.crab|limited|moderate|moderate|moderate|strong|strong|strong|Spices, rare hardwoods, and tropical fruit;Gold, gems, and resinous woods;Strong frontier extraction value|Bulk grain is weak;Steel and finished cloth remain import-heavy|region.valtherion;region.serathyl;region.lantern_isles|Talmyra survives through valleys, coasts, and high-value exports rather than broad agrarian self-sufficiency.|57|54|72|52|58|60|25|low|very_high|spices;rare_hardwood;resin;precious_metals;tropical_fruit|grain;steel;cloth|0.68|0.63
regional_ecology.myridian_chain|region.myridian_chain|climate.mild_winter|climate.wet_year|biome.temperate.mixed_forest;biome.temperate.temperate_rainforest;biome.marine.marine|biome.shrublands.chaparral|flora.coconut_palm;flora.orange_tree;flora.flax;flora.reed|fauna.cod;fauna.oyster;fauna.crab|limited|limited|strong|moderate|limited|moderate|moderate|Pearls, fisheries, and maritime repair services;Reliable relay harbors|Grain, metal, and heavy timber are import-biased|region.valtherion;region.serathyl;region.lantern_isles|The chain thrives as a relay and specialty maritime economy.|62|48|60|44|42|50|8|moderate|moderate|maritime_services;fish;pearls;ship_repair|grain;metal;bulk_timber|0.62|0.66
regional_ecology.lantern_isles|region.lantern_isles|climate.long_summer|climate.wet_year|biome.shrublands.chaparral;biome.wetlands.mangrove;biome.marine.marine|biome.temperate.seasonal_forest|flora.orange_tree;flora.lemon_tree;flora.cinnamon_tree;flora.reed|fauna.cod;fauna.oyster;fauna.crab;fauna.goat|limited|limited|strong|moderate|limited|moderate|strong|Fish, citrus, spice gardens, and tropical wood lots|Grain and iron remain structural imports|region.talmyra;region.myridian_chain;region.draemor|Lantern settlement depends on harbors and reef logistics more than inland acreage.|56|46|55|50|48|58|4|low|moderate|fish;citrus;spices;tropical_woods|grain;iron;draft_animals|0.65|0.61
regional_ecology.serpents_wake|region.serpents_wake|climate.wet_year|climate.long_summer;climate.dry_year|biome.wetlands.mangrove;biome.grasslands.savanna;biome.marine.marine|biome.shrublands.dry_scrub|flora.reed;flora.mangrove_tree;flora.indigo_plant|fauna.crab;fauna.oyster;fauna.cod;fauna.goat|scarce|limited|strong|limited|limited|moderate|moderate|Salt fish, mangrove timber, dyestuffs, and passage services|Grain, iron, and cloth are persistent imports|region.talmyra;region.lantern_isles;region.draemor|Serpent's Wake remains viable through convoy support, salvage, and hard coastal adaptation.|43|36|58|62|68|70|2|low|moderate|salt_fish;mangrove_timber;dyestuffs;passage_services|grain;iron;cloth|0.8|0.57
regional_ecology.dawnreach_isles|region.dawnreach_isles|climate.cold|climate.mild_winter|biome.temperate.taiga;biome.temperate.conifer_forest;biome.tundra.tundra;biome.marine.marine|biome.grasslands.alpine_meadow|flora.pine_tree;flora.spruce_tree;flora.birch_tree;flora.reed|fauna.cod;fauna.seal;fauna.rabbit|scarce|limited|strong|moderate|limited|limited|moderate|Cold fisheries, furs, conifer timber, and resin|Grain, textiles, and forged metal remain import-heavy|region.valtherion;region.myridian_chain;region.serathyl|Dawnreach survives through cold-water specialization, not inland carrying capacity.|34|28|46|74|56|72|1|very_low|moderate|cold_fish;furs;conifer_timber;resin|grain;textiles;forged_metal|0.82|0.54
"@ | ConvertFrom-Csv -Delimiter '|'

$ecoBlueprints = @{}
foreach ($row in $ecoRows) {
  $ecoBlueprints[$row.regionId] = [ordered]@{
    primaryClimateProfileId = $row.primaryClimate
    secondaryClimateProfileIds = Split-List $row.secondaryClimates
    dominantBiomeIds = Split-List $row.dominantBiomes
    supportingBiomeIds = Split-List $row.supportingBiomes
    nativeFloraIds = Split-List $row.nativeFlora
    nativeFaunaIds = Split-List $row.nativeFauna
    coverageProfile = [ordered]@{
      stapleCrops = $row.staple
      herdAndGame = $row.herd
      maritimeFoods = $row.maritime
      timberAndFiber = $row.timber
      metalsAndStone = $row.metals
      herbsAndReagents = $row.herbs
      luxuryGoods = $row.luxury
    }
    domesticStrengths = Split-List $row.strengths
    domesticGaps = Split-List $row.gaps
    likelyTradePartnerRegionIds = Split-List $row.partners
    tradePressureNotes = @($row.notes)
    simulationProfile = [ordered]@{
      habitationScore = [int][double]$row.hab
      foodProductionCapacity = [int][double]$row.food
      waterAvailability = [int][double]$row.water
      climateBurden = [int][double]$row.climateBurden
      hazardPressure = [int][double]$row.hazard
      infrastructureDifficulty = [int][double]$row.infra
      populationCapacity = [int]([double]$row.populationCapacityMillions * 1000000)
      densityBand = $row.densityBand
    }
    resourceDiversityBand = $row.resourceDiversityBand
    supplyStrengths = Split-List $row.supplyStrengths
    demandPressures = Split-List $row.demandPressures
    importBias = [double]$row.importBias
    exportBias = [double]$row.exportBias
  }
}

$regionsPath = Join-Path $worldDir 'regions.json'
$regionsDoc = Get-Content $regionsPath -Raw | ConvertFrom-Json
foreach ($record in $regionsDoc.records) {
  $blueprint = $regionBlueprints[$record.id]
  if ($null -eq $blueprint) { continue }

  $record | Add-Member -NotePropertyName environmentProfile -NotePropertyValue ([pscustomobject][ordered]@{
    dominantBiomeMix = $blueprint.dominantBiomeMix
    elevationProfile = $blueprint.elevationProfile
    climateTendencies = $blueprint.climateTendencies
    freshwaterAvailability = $blueprint.freshwaterAvailability
    climateSeverity = $blueprint.climateSeverity
    agriculturalPotential = $blueprint.agriculturalPotential
    extractivePotential = $blueprint.extractivePotential
    hazardLevel = $blueprint.hazardLevel
  }) -Force
  $record | Add-Member -NotePropertyName simulationProfile -NotePropertyValue ([pscustomobject]$blueprint.simulationProfile) -Force

  $populationProfile = [ordered]@{}
  if ($record.populationProfile) {
    foreach ($prop in $record.populationProfile.PSObject.Properties) {
      $populationProfile[$prop.Name] = $prop.Value
    }
  }
  foreach ($prop in $blueprint.populationProfile.Keys) {
    $populationProfile[$prop] = $blueprint.populationProfile[$prop]
  }
  $record | Add-Member -NotePropertyName populationProfile -NotePropertyValue ([pscustomobject]$populationProfile) -Force

  $economicProfile = [ordered]@{}
  if ($record.economicProfile) {
    foreach ($prop in $record.economicProfile.PSObject.Properties) {
      $economicProfile[$prop.Name] = $prop.Value
    }
  }
  if (-not $economicProfile.Contains('majorExports')) { $economicProfile.majorExports = @() }
  if (-not $economicProfile.Contains('majorImports')) { $economicProfile.majorImports = @() }
  foreach ($prop in $blueprint.economicProfile.Keys) {
    $economicProfile[$prop] = $blueprint.economicProfile[$prop]
  }
  $record | Add-Member -NotePropertyName economicProfile -NotePropertyValue ([pscustomobject]$economicProfile) -Force

  $record | Add-Member -NotePropertyName settlementDistributionModel -NotePropertyValue ([pscustomobject]$blueprint.settlementDistributionModel) -Force
}
[pscustomobject]@{ records = $regionsDoc.records } | ConvertTo-Json -Depth 100 | Set-Content $regionsPath -Encoding UTF8

$ecologyPath = Join-Path $worldDir 'regional_ecology_profiles.json'
$ecologyDoc = Get-Content $ecologyPath -Raw | ConvertFrom-Json
foreach ($record in $ecologyDoc.records) {
  $blueprint = $ecoBlueprints[$record.regionId]
  if ($null -eq $blueprint) { continue }

  $record.primaryClimateProfileId = $blueprint.primaryClimateProfileId
  $record.secondaryClimateProfileIds = $blueprint.secondaryClimateProfileIds
  $record.dominantBiomeIds = $blueprint.dominantBiomeIds
  $record.supportingBiomeIds = $blueprint.supportingBiomeIds
  $record.nativeFloraIds = $blueprint.nativeFloraIds
  $record.nativeFaunaIds = $blueprint.nativeFaunaIds
  $record.coverageProfile = [pscustomobject]$blueprint.coverageProfile
  $record.domesticStrengths = $blueprint.domesticStrengths
  $record.domesticGaps = $blueprint.domesticGaps
  $record.likelyTradePartnerRegionIds = $blueprint.likelyTradePartnerRegionIds
  $record.tradePressureNotes = $blueprint.tradePressureNotes
  if ($record.PSObject.Properties['mapClimateZoneIds']) { $record.PSObject.Properties.Remove('mapClimateZoneIds') }
  if ($record.PSObject.Properties['mapBiomeZoneIds']) { $record.PSObject.Properties.Remove('mapBiomeZoneIds') }
  $record | Add-Member -NotePropertyName simulationProfile -NotePropertyValue ([pscustomobject]$blueprint.simulationProfile) -Force
  $record | Add-Member -NotePropertyName resourceDiversityBand -NotePropertyValue $blueprint.resourceDiversityBand -Force
  $record | Add-Member -NotePropertyName supplyStrengths -NotePropertyValue $blueprint.supplyStrengths -Force
  $record | Add-Member -NotePropertyName demandPressures -NotePropertyValue $blueprint.demandPressures -Force
  $record | Add-Member -NotePropertyName importBias -NotePropertyValue $blueprint.importBias -Force
  $record | Add-Member -NotePropertyName exportBias -NotePropertyValue $blueprint.exportBias -Force
}
[pscustomobject]@{ records = $ecologyDoc.records } | ConvertTo-Json -Depth 100 | Set-Content $ecologyPath -Encoding UTF8

Write-Output ('regions=' + @($regionsDoc.records).Count + '; ecology=' + @($ecologyDoc.records).Count)
