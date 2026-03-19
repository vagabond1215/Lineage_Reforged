$ErrorActionPreference = "Stop"

function Normalize-FloraType {
    param([string]$Type, [string]$Slug)

    $value = $Type.ToLowerInvariant()
    if ($value -eq "fungus") { $value = "fungi" }
    if ($value -eq "vine") { $value = "herb" }

    if ($Slug -in @("wheat", "barley", "oats", "rye", "ryegrass", "river_reed", "cattail")) {
        $value = "grass"
    }

    if ($value -notin @("tree", "shrub", "herb", "grass", "fungi")) {
        $value = "herb"
    }

    return $value
}

function Normalize-Lifecycle {
    param([string]$Lifecycle)

    $value = $Lifecycle.ToLowerInvariant()
    if ($value -notin @("annual", "biennial", "perennial")) {
        return "perennial"
    }

    return $value
}

function Get-HarvestableParts {
    param([string]$Type)

    switch ($Type) {
        "tree" { return @("wood", "bark", "sap", "leaves") }
        "shrub" { return @("berries", "leaves", "twigs") }
        "grass" { return @("seed_head", "stalk", "fiber", "leaves") }
        "fungi" { return @("cap", "stem", "spore_body", "mycelium") }
        default { return @("leaves", "stems", "roots", "flowers") }
    }
}

function Get-Tools {
    param([string]$Type)

    switch ($Type) {
        "tree" { return @("axe", "pruning_saw", "grafting_knife") }
        "shrub" { return @("pruning_shears", "gathering_gloves", "hand_trowel") }
        "grass" { return @("sickle", "scythe", "bundle_twine") }
        "fungi" { return @("fungal_knife", "spore_brush", "basket") }
        default { return @("sickle", "hand_knife", "gathering_basket") }
    }
}

function Get-OutputProfile {
    param([string]$Type)

    switch ($Type) {
        "tree" {
            return [ordered]@{
                materials = @("material.wood", "material.bark")
                ingredients = @("ingredient.sap")
                byMaterials = @("material.sawdust")
                byIngredients = @("ingredient.resin")
            }
        }
        "shrub" {
            return [ordered]@{
                materials = @("material.twig_bundle")
                ingredients = @("ingredient.berries")
                byMaterials = @("material.mulch")
                byIngredients = @("ingredient.seed_mix")
            }
        }
        "grass" {
            return [ordered]@{
                materials = @("material.straw", "material.fiber")
                ingredients = @("ingredient.grain")
                byMaterials = @("material.chaff")
                byIngredients = @("ingredient.bran")
            }
        }
        "fungi" {
            return [ordered]@{
                materials = @("material.mycelium")
                ingredients = @("ingredient.fungal_cap")
                byMaterials = @("material.spore_dust")
                byIngredients = @("ingredient.fungal_extract")
            }
        }
        default {
            return [ordered]@{
                materials = @("material.fiber")
                ingredients = @("ingredient.herb_bundle")
                byMaterials = @("material.compost")
                byIngredients = @("ingredient.pollen")
            }
        }
    }
}

function Get-WaterNeed {
    param([string[]]$HabitatIds, [string]$Type)

    $joined = ($HabitatIds -join " ").ToLowerInvariant()

    if ($Type -eq "fungi") { return "medium" }
    if ($joined -match "coastal|tidal|wetland|marsh|river") { return "high" }
    if ($joined -match "subterranean|cave") { return "medium" }

    return "medium"
}

function Get-LightNeed {
    param([string[]]$HabitatIds, [string]$Type)

    $joined = ($HabitatIds -join " ").ToLowerInvariant()

    if ($Type -eq "fungi") { return "low" }
    if ($joined -match "subterranean|cave") { return "low" }
    if ($Type -in @("tree", "grass")) { return "high" }

    return "medium"
}

function Get-ClimateRange {
    param([string[]]$HabitatIds)

    $joined = ($HabitatIds -join " ").ToLowerInvariant()

    if ($joined -match "subterranean|cave") { return "subterranean" }
    if ($joined -match "coastal|tidal") { return "temperate_coastal" }
    if ($joined -match "wetland|marsh") { return "wetland_temperate" }

    return "temperate"
}

function Get-SoilType {
    param([string[]]$HabitatIds, [string]$Type)

    $values = New-Object System.Collections.Generic.List[string]
    $joined = ($HabitatIds -join " ").ToLowerInvariant()

    if ($joined -match "coastal|tidal") {
        $values.Add("silt")
        $values.Add("loam")
    }

    if ($joined -match "subterranean|cave") {
        $values.Add("mineral")
        $values.Add("stone_dust")
    }

    if ($joined -match "wetland|marsh") {
        $values.Add("peat")
    }

    switch ($Type) {
        "tree" { $values.Add("loam") }
        "shrub" { $values.Add("sandy_loam") }
        "grass" { $values.Add("topsoil") }
        "herb" { $values.Add("garden_loam") }
        "fungi" { $values.Add("organic_compost") }
    }

    $distinct = $values | Select-Object -Unique
    if ($distinct.Count -eq 0) {
        return @("loam")
    }

    return @($distinct)
}

$cropSlugs = @(
    "wheat", "barley", "oats", "rye", "flax", "hemp", "potato", "lentil", "cabbage", "onion", "garlic", "turnip", "carrot", "beet", "pea_vine", "bean_pod",
    "chamomile", "thyme", "rosemary", "ryegrass", "clover", "river_reed", "cattail"
)

$data = Get-Content -Raw "packages/content/base/world/flora.json" | ConvertFrom-Json
$outRecords = New-Object System.Collections.Generic.List[object]

foreach ($record in $data.records) {
    $slug = [string]$record.slug
    $type = Normalize-FloraType ([string]$record.type) $slug
    $lifecycle = Normalize-Lifecycle ([string]$record.lifecycle)
    $habitats = @($record.habitatIds)

    $harvestActive = [bool]$record.harvest.active
    $harvestPassive = [bool]$record.harvest.passive
    $yieldCap = [double]$record.harvest.yieldCap

    $harvestableParts = Get-HarvestableParts $type
    $tools = Get-Tools $type
    $output = Get-OutputProfile $type

    $matureAgeDays = 240
    if ($lifecycle -eq "annual") {
        $matureAgeDays = 110
    } elseif ($lifecycle -eq "biennial") {
        $matureAgeDays = 180
    }
    if ($type -eq "fungi") {
        $matureAgeDays = 75
    }

    $growthCycles = 2.2
    if ($lifecycle -eq "annual") {
        $growthCycles = 1.3
    } elseif ($lifecycle -eq "biennial") {
        $growthCycles = 1.8
    }
    if (-not $harvestPassive) {
        $growthCycles = [Math]::Max(1.0, $growthCycles - 0.5)
    }

    $unitGrowthSpeed = [Math]::Round((1 + ($yieldCap / 10)), 3)

    $structuralMultiplier = 1.0
    if ($type -eq "tree") {
        $structuralMultiplier = 1.8
    } elseif ($type -eq "shrub") {
        $structuralMultiplier = 1.2
    } elseif ($type -eq "fungi") {
        $structuralMultiplier = 0.7
    }
    $harvestableStructuralUnits = [Math]::Max(1, [int][Math]::Round($yieldCap * $structuralMultiplier))

    $maxStagnation = 3
    if ($type -eq "tree") {
        $maxStagnation = 5
    } elseif ($type -eq "shrub") {
        $maxStagnation = 4
    } elseif ($type -eq "fungi") {
        $maxStagnation = 2
    }

    $maxDeath = $maxStagnation + 2
    $canRegrow = ($lifecycle -ne "annual") -or $harvestPassive

    $timeToRegrowDays = 0
    if ($canRegrow) {
        if ($lifecycle -eq "annual") {
            $timeToRegrowDays = 45
        } else {
            $timeToRegrowDays = 90
        }
    }

    $regrowthPeriod = "none"
    if ($canRegrow) {
        if ($lifecycle -eq "annual") {
            $regrowthPeriod = "growth_season"
        } else {
            $regrowthPeriod = "annual"
        }
    }

    $cultivable = ($cropSlugs -contains $slug) -or ($type -eq "grass")
    $domesticVariant = $null
    if ($cultivable) {
        $domesticVariant = "flora.domestic.$slug"
    }
    $domesticationYieldModifier = if ($cultivable) { 1.12 } else { 0.96 }

    $waterNeed = Get-WaterNeed $habitats $type
    $lightNeed = Get-LightNeed $habitats $type
    $climateRange = Get-ClimateRange $habitats
    $soilType = Get-SoilType $habitats $type

    $growthSeasons = @("spring", "summer", "harvest")
    if ($lifecycle -eq "annual") {
        $growthSeasons = @("thaw", "spring", "summer", "harvest")
    }
    if ($type -eq "fungi") {
        $growthSeasons = @("thaw", "spring", "summer", "harvest", "withering")
    }

    $plantingWindow = @("spring")
    if ($cultivable -and $lifecycle -eq "annual") {
        $plantingWindow = @("thaw", "spring")
    }

    $harvestWindow = @("harvest")
    if ($harvestPassive) {
        $harvestWindow = @("summer", "harvest")
    }

    $shedSeasons = @()
    if ($type -in @("tree", "shrub")) {
        $shedSeasons = @("withering")
    }

    $companionCrops = @("flora.clover")
    if ($type -eq "grass") {
        $companionCrops = @("flora.clover", "flora.pea_vine")
    } elseif ($type -eq "shrub") {
        $companionCrops = @("flora.yarrow", "flora.chamomile")
    } elseif ($type -eq "tree") {
        $companionCrops = @("flora.chamomile")
    } elseif ($type -eq "fungi") {
        $companionCrops = @("flora.shelf_fungus")
    }

    $antagonisticCrops = @("flora.ryegrass")
    if ($type -eq "grass") {
        $antagonisticCrops = @("flora.star_thistle")
    } elseif ($type -eq "fungi") {
        $antagonisticCrops = @("flora.sunpetal")
    }

    $invasivity = 0.44
    if ($type -eq "grass") {
        $invasivity = 0.62
    } elseif ($type -eq "fungi") {
        $invasivity = 0.38
    }

    $fragilityFactors = @("water_stress", "pest_pressure")
    if ($type -eq "tree") {
        $fragilityFactors = @("sapling_damage", "bark_stripping")
    } elseif ($type -eq "fungi") {
        $fragilityFactors = @("humidity_loss", "substrate_contamination")
    }

    $soilDegradation = 0.11
    if ($type -eq "tree") {
        $soilDegradation = 0.18
    } elseif ($type -eq "grass") {
        $soilDegradation = 0.07
    }

    $difficultySurvivability = if ($lifecycle -eq "perennial") { 0.80 } else { 0.66 }

    $landArea = 1.2
    if ($type -eq "tree") {
        $landArea = 6.0
    } elseif ($type -eq "shrub") {
        $landArea = 3.0
    } elseif ($type -eq "fungi") {
        $landArea = 0.8
    }

    $netting = ($type -eq "shrub") -or $harvestPassive
    $pollinationFertilization = ($type -ne "fungi")
    $weedControl = $cultivable
    $fungusControl = ($type -ne "fungi")
    $irrigation = $cultivable -or ($waterNeed -eq "high")
    $greenhouse = ($type -eq "fungi")
    $mulch = $cultivable
    $trellising = ($slug -match "vine")
    $raisedBeds = $cultivable -and ($type -in @("herb", "grass", "fungi"))

    $stageDurations = [ordered]@{
        germination = 28
        vegetative = 112
        flowering = 42
        fruiting = 63
        dormancy = 90
    }

    if ($lifecycle -eq "annual") {
        $stageDurations = [ordered]@{
            germination = 18
            vegetative = 84
            flowering = 36
            fruiting = 54
            dormancy = 28
        }
    } elseif ($lifecycle -eq "biennial") {
        $stageDurations = [ordered]@{
            germination = 24
            vegetative = 96
            flowering = 38
            fruiting = 58
            dormancy = 120
        }
    }

    if ($type -eq "fungi") {
        $stageDurations.flowering = 16
        $stageDurations.fruiting = 42
    }

    $stages = [ordered]@{
        germination = [ordered]@{
            mortalityThreshold = 0.45
            transitionTriggers = @("temperature_stable", "soil_hydrated")
            duration = [ordered]@{ baseDurationDays = $stageDurations.germination; environmentalVariability = 0.30 }
        }
        vegetative = [ordered]@{
            mortalityThreshold = 0.22
            transitionTriggers = @("sunlight_threshold", "nutrient_minimum")
            duration = [ordered]@{ baseDurationDays = $stageDurations.vegetative; environmentalVariability = 0.20 }
        }
        flowering = [ordered]@{
            mortalityThreshold = 0.25
            transitionTriggers = @("pollination_window", "temperature_window")
            duration = [ordered]@{ baseDurationDays = $stageDurations.flowering; environmentalVariability = 0.18 }
        }
        fruiting = [ordered]@{
            mortalityThreshold = 0.30
            transitionTriggers = @("fruit_set", "moisture_balance")
            duration = [ordered]@{ baseDurationDays = $stageDurations.fruiting; environmentalVariability = 0.22 }
        }
        dormancy = [ordered]@{
            mortalityThreshold = 0.18
            transitionTriggers = @("season_shift", "light_drop")
            duration = [ordered]@{ baseDurationDays = $stageDurations.dormancy; environmentalVariability = 0.35 }
        }
    }

    $habitatCount = [Math]::Max(1, $habitats.Count)
    $biomes = New-Object System.Collections.Generic.List[object]
    for ($i = 0; $i -lt $habitats.Count; $i++) {
        $biomes.Add([ordered]@{
            habitatId = $habitats[$i]
            prevalence = [Math]::Round((1 / $habitatCount), 3)
        })
    }

    $floweringParts = @("flowers")
    if ($type -eq "fungi") {
        $floweringParts = @("spore_body")
    }

    $partsByStages = @(
        [ordered]@{ stage = "germination"; parts = @("seedling") },
        [ordered]@{ stage = "vegetative"; parts = @($harvestableParts[0], $harvestableParts[1]) },
        [ordered]@{ stage = "flowering"; parts = @($floweringParts) },
        [ordered]@{ stage = "fruiting"; parts = @($harvestableParts[0]) },
        [ordered]@{ stage = "dormancy"; parts = @($harvestableParts[$harvestableParts.Count - 1]) }
    )

    $passiveYieldStartAgeDays = if ($harvestPassive) { [int]([Math]::Round($matureAgeDays * 0.6)) } else { $matureAgeDays }
    $passiveAnnualMultiplier = if ($lifecycle -eq "annual") { 1.5 } else { 2.4 }
    $yieldCapAnnual = if ($harvestPassive) { [int][Math]::Round($yieldCap * $passiveAnnualMultiplier) } else { [int][Math]::Round($yieldCap) }
    $unitsPerGrowthSeasonWhenMature = if ($harvestPassive) { [Math]::Max(1, [int][Math]::Round($yieldCap * 0.7)) } else { 0 }
    $passiveYieldEffectPerHarvest = if ($harvestPassive) { 0.04 } else { 0.08 }
    $allPartGrowthSpeedReductionPerHarvest = if ($type -eq "tree") { 0.05 } else { 0.03 }
    $unharvestedConversion = if ($harvestPassive) { 0.22 } else { 0.12 }

    $rotationSoilQuality = if ($type -eq "grass") { 0.2 } else { 0.12 }
    $rotationFertilizationEffect = if ($cultivable) { 0.18 } else { 0.08 }
    $rotationSurvivability = if ($lifecycle -eq "perennial") { 0.79 } else { 0.64 }
    $rotationPestInteraction = if ($type -eq "fungi") { 0.31 } else { 0.17 }

    $harvestTemplate = [ordered]@{
        harvestableParts = @($harvestableParts)
        partHarvestAvailability = [ordered]@{
            active = $harvestActive
            passive = $harvestPassive
            partsByStages = @($partsByStages)
        }
        partPassiveHarvestRules = [ordered]@{
            passiveYieldStartAgeDays = $passiveYieldStartAgeDays
            yieldCapAnnual = $yieldCapAnnual
            regrowthBehavior = [ordered]@{ unitsPerGrowthSeasonWhenMature = $unitsPerGrowthSeasonWhenMature }
        }
        partActiveHarvestRules = [ordered]@{
            primeYieldAges = [ordered]@{
                startAgeDays = [int]([Math]::Round($matureAgeDays * 0.75))
                peakAgeDays = $matureAgeDays
                endAgeDays = [int]([Math]::Round($matureAgeDays * 1.6))
            }
            regrowthBehavior = [ordered]@{
                growthCyclesPerSeason = [Math]::Round($growthCycles, 3)
                unitGrowthSpeed = $unitGrowthSpeed
                matureAgeDays = $matureAgeDays
            }
            activeHarvestImpact = [ordered]@{
                harvestableStructuralUnits = $harvestableStructuralUnits
                destructiveHarvestFlag = [ordered]@{
                    passiveYieldEffectPerHarvest = $passiveYieldEffectPerHarvest
                    allPartGrowthSpeedReductionPerHarvest = $allPartGrowthSpeedReductionPerHarvest
                    maximumDestructiveHarvestsToStagnation = $maxStagnation
                    maximumDestructiveHarvestsToDeath = $maxDeath
                    canRegrow = $canRegrow
                    timeToRegrowDays = $timeToRegrowDays
                    regrowthPeriod = $regrowthPeriod
                }
            }
            unharvestedConversion = $unharvestedConversion
        }
        tools = @($tools)
        triggers = @("maturity_reached", "seasonal_window_open")
        activeHarvest = [ordered]@{
            trigger = "manual_harvest"
            rawOutput = [ordered]@{
                materials = @($output.materials)
                ingredients = @($output.ingredients)
                processing = [ordered]@{
                    byProducts = [ordered]@{ materials = @($output.byMaterials); ingredients = @($output.byIngredients) }
                }
            }
        }
        passiveHarvest = [ordered]@{
            trigger = "seasonal_yield_cycle"
            rawOutput = [ordered]@{
                materials = @($output.byMaterials)
                ingredients = @($output.ingredients)
                processing = [ordered]@{
                    byProducts = [ordered]@{ materials = @("material.compost"); ingredients = @("ingredient.seeds") }
                }
            }
        }
    }

    $lifecycleTemplate = [ordered]@{
        type = $lifecycle
        applicableStages = @("germination", "vegetative", "flowering", "fruiting", "dormancy")
        stages = $stages
    }

    $agronomyTemplate = [ordered]@{
        plantingWindow = @($plantingWindow)
        companionCrops = @($companionCrops)
        rotationBenefit = [ordered]@{
            soilQuality = $rotationSoilQuality
            fertilizationEffect = $rotationFertilizationEffect
            survivability = $rotationSurvivability
            pestInteraction = $rotationPestInteraction
        }
        antagonisticCrops = @($antagonisticCrops)
        harvestWindow = @($harvestWindow)
        shedSeasons = @($shedSeasons)
        growthSeasons = @($growthSeasons)
    }

    $domesticationTemplate = [ordered]@{
        cultivable = $cultivable
        domesticVariant = $domesticVariant
        domesticationYieldModifier = $domesticationYieldModifier
        tools = @($tools)
        difficulty = [ordered]@{
            invasivity = $invasivity
            fragilityFactors = @($fragilityFactors)
            soilDegradation = $soilDegradation
            survivability = $difficultySurvivability
            landArea = $landArea
        }
        mediation = [ordered]@{
            protection = [ordered]@{ fences = $cultivable; netting = $netting }
            pollination = [ordered]@{ fertilization = $pollinationFertilization }
            upkeep = [ordered]@{ weedControl = $weedControl; fungusControl = $fungusControl }
        }
        infrastructure = [ordered]@{
            irrigation = $irrigation
            greenhouse = $greenhouse
            mulch = $mulch
            trellising = $trellising
            raisedBeds = $raisedBeds
        }
    }

    $ecologyTemplate = [ordered]@{
        climateRange = $climateRange
        waterNeed = $waterNeed
        lightNeed = $lightNeed
        biomes = $biomes.ToArray()
        soilType = @($soilType)
    }

    $template = [ordered]@{
        identity = [ordered]@{ name = $record.name; type = $type }
        harvest = $harvestTemplate
        lifecycle = $lifecycleTemplate
        agronomy = $agronomyTemplate
        domestication = $domesticationTemplate
        ecology = $ecologyTemplate
    }

    $outRecords.Add([ordered]@{
        id = $record.id
        slug = $slug
        name = $record.name
        type = $type
        lifecycle = $lifecycle
        habitatIds = @($habitats)
        harvest = [ordered]@{
            active = $harvestActive
            passive = $harvestPassive
            yieldCap = $yieldCap
        }
        baseValue = $record.baseValue
        currencyId = $record.currencyId
        template = $template
    })
}

$result = [ordered]@{ records = $outRecords.ToArray() }
$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Resolve-Path "packages/content/base/world/flora.json"), ($result | ConvertTo-Json -Depth 100) + "`n", $enc)
Write-Output "Updated flora.json records: $($outRecords.Count)"

