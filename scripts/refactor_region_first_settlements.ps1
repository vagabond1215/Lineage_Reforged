$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$settlementPath = Join-Path $repoRoot "packages/content/base/world/settlements.json"
$regionPath = Join-Path $repoRoot "packages/content/base/world/regions.json"
$localityPath = Join-Path $repoRoot "packages/content/base/world/region_localities.json"

function Clamp-Int {
  param(
    [int]$Value,
    [int]$Min,
    [int]$Max
  )

  return [Math]::Min($Max, [Math]::Max($Min, $Value))
}

function Clamp-Number {
  param(
    [double]$Value,
    [double]$Min,
    [double]$Max
  )

  return [Math]::Min($Max, [Math]::Max($Min, $Value))
}

function Round-Number {
  param(
    [double]$Value
  )

  return [Math]::Round($Value, 2)
}

function Get-BandScore {
  param(
    [string]$Band
  )

  switch ($Band) {
    "none" { return 0 }
    "scarce" { return 20 }
    "limited" { return 40 }
    "moderate" { return 60 }
    "strong" { return 80 }
    "surplus" { return 95 }
    default { return 50 }
  }
}

function Get-InfraRelief {
  param(
    [pscustomobject]$Infrastructure
  )

  $overallRelief = switch ($Infrastructure.overallLevel) {
    "rudimentary" { 0 }
    "frontier" { 1 }
    "established" { 3 }
    "developed" { 5 }
    "civic" { 7 }
    "grand" { 9 }
    default { 0 }
  }

  return $overallRelief + ($Infrastructure.roadTier * 1) + ($Infrastructure.waterTier * 1) + ($Infrastructure.marketTier * 1) + ($Infrastructure.harborTier * 1)
}

function Get-SitePenalty {
  param(
    [string]$SiteClass
  )

  switch ($SiteClass) {
    "subterranean" { return 4 }
    "underwater" { return 6 }
    default { return 0 }
  }
}

function Get-SiteClimateAdjustment {
  param(
    [string]$SiteClass
  )

  switch ($SiteClass) {
    "subterranean" { return 2 }
    "underwater" { return 6 }
    default { return 0 }
  }
}

function Get-SiteInfrastructureAdjustment {
  param(
    [string]$SiteClass
  )

  switch ($SiteClass) {
    "subterranean" { return 8 }
    "underwater" { return 12 }
    default { return 0 }
  }
}

function Get-UniqueStrings {
  param(
    [object[]]$Values
  )

  $seen = New-Object "System.Collections.Generic.HashSet[string]"
  $result = New-Object System.Collections.ArrayList
  foreach ($value in ($Values | Where-Object { $_ -is [string] -and $_.Trim().Length -gt 0 })) {
    if ($seen.Add($value)) {
      [void]$result.Add($value)
    }
  }
  return @($result)
}

function Get-DependencyBand {
  param(
    [double]$ImportBias,
    [int]$FoodSecurity,
    [int]$WaterSecurity,
    [double]$RouteAverage,
    [string]$SettlementType
  )

  $score =
    ($ImportBias * 0.55) +
    (((100 - $FoodSecurity) / 100.0) * 0.2) +
    (((100 - $WaterSecurity) / 100.0) * 0.1) +
    (((1 - [Math]::Min($RouteAverage, 1.4) / 1.4)) * 0.1)

  if ($SettlementType -in @("outpost", "camp", "fort", "citadel", "waystation", "monastery", "ferry_post")) {
    $score += 0.08
  }

  if ($score -ge 0.67) {
    return "high"
  }

  if ($score -ge 0.46) {
    return "moderate"
  }

  return "low"
}

function Get-BooleanNumber {
  param(
    [bool]$Condition,
    [double]$WhenTrue,
    [double]$WhenFalse = 0
  )

  if ($Condition) {
    return $WhenTrue
  }

  return $WhenFalse
}

$localityAssignments = @{
  "region_locality.verdant_thalos_coastal_bays" = @("aurelis", "redcliff_quay")
  "region_locality.verdant_thalos_inland_estates" = @("vinecross", "oliveford", "sunmeadow", "caskbank_estate")
  "region_locality.auric_marches_ore_ridges" = @("stonevein", "coppergate", "quarrymule_camp")
  "region_locality.auric_marches_caravan_marches" = @("sunscar_watch")
  "region_locality.shattercap_deep_harbors" = @("brineharbor", "gullsreach", "kelpnet_hamlet")
  "region_locality.shattercap_beacon_cliffs" = @("northhook_keep")
  "region_locality.crownlands_forest_vales" = @("silvergrove", "whitebark_gate", "moonwell_grove")
  "region_locality.crownlands_headwater_passes" = @("headwater_bastion")
  "region_locality.embersteppe_herd_plains" = @("ashsaddle", "coalspur")
  "region_locality.embersteppe_stepwell_corridors" = @("stepwell_redoubt", "redreed_ford")
  "region_locality.sapphire_rivers_royal_floodplain" = @("highcrown", "blueflow", "ledgerford")
  "region_locality.sapphire_rivers_bridge_corridors" = @("kingsbridge", "bridgewatch_ferry")
  "region_locality.jade_expanse_granary_core" = @("harvestrest", "golden_barrow")
  "region_locality.jade_expanse_orchard_steppe" = @("orchardhome", "greenharrow", "barleyhearth_estate")
  "region_locality.windward_spine_mountain_holds" = @("passglass_hold", "slatewake", "deepecho_camp")
  "region_locality.windward_spine_alpine_passes" = @("northpass_redoubt")
  "region_locality.green_reach_heartwood" = @("verdeward", "dyehollow")
  "region_locality.green_reach_timber_edges" = @("timbercross", "barkmill_hamlet")
  "region_locality.sailors_verge_grand_harbors" = @("seabanner", "tidecrown")
  "region_locality.sailors_verge_citrus_trade_belt" = @("islemarket", "mastfield", "dockreed_estate")
  "region_locality.heart_basin_river_capitals" = @("riverthrone", "granary_crown")
  "region_locality.heart_basin_market_mills" = @("basinford", "millrun", "southlock_ferry")
  "region_locality.emerald_mantle_pasture_uplands" = @("pasturemeet", "haywarden_estate")
  "region_locality.emerald_mantle_orchard_meadows" = @("longmeadow", "applemarsh")
  "region_locality.stormcap_coast_storm_harbors" = @("breaksail", "southlight")
  "region_locality.stormcap_coast_watch_citadels" = @("stormwatch_citadel", "cliffsalt_priory")
  "region_locality.silver_valleys_sunspire_vales" = @("sunspire_reach", "silvermere")
  "region_locality.silver_valleys_ford_corridors" = @("confederate_ford", "sunpasture_estate")
  "region_locality.silver_valleys_warrens_below" = @("redroot_warrens")
  "region_locality.thorn_peninsula_spice_markets" = @("spicehook", "pepperfield_estate")
  "region_locality.thorn_peninsula_salt_anchorage" = @("saltfang_anchorage")
  "region_locality.thorn_peninsula_watch_forts" = @("thornwatch")
  "region_locality.watcher_coast_gate_citadels" = @("watchers_gate")
  "region_locality.watcher_coast_obsidian_steps" = @("obsidian_stair", "blackglass_camp")
  "region_locality.watcher_coast_mistfen_edges" = @("mistfen_landing")
  "region_locality.myridian_ports" = @("starfall_port", "harbormast_quay", "foammarket_ferry")
  "region_locality.myridian_pearl_shoals" = @("pearlwake")
  "region_locality.myridian_beacon_bastions" = @("chainlight_bastion")
  "region_locality.lantern_harbors" = @("lantern_key")
  "region_locality.lantern_reef_depths" = @("lantern_deep")
  "region_locality.lantern_shrine_gardens" = @("glasswake_shrine", "driftglass_outpost")
  "region_locality.serpents_storm_havens" = @("stormfang_haven")
  "region_locality.serpents_reef_anchorages" = @("blackreef_anchorage", "squallhook_refuge")
  "region_locality.serpents_watch_musters" = @("stormhook_watch")
  "region_locality.dawnreach_aurora_harbors" = @("aurora_anchorage", "icehook_jetty")
  "region_locality.dawnreach_nacre_depths" = @("nacredeep")
  "region_locality.dawnreach_whalebone_watches" = @("whalebone_watch")
}

$localitySiteClassOverrides = @{
  "region_locality.auric_marches_ore_ridges" = @("surface", "subterranean")
  "region_locality.windward_spine_mountain_holds" = @("surface", "subterranean")
  "region_locality.silver_valleys_warrens_below" = @("subterranean")
  "region_locality.lantern_reef_depths" = @("underwater")
  "region_locality.dawnreach_nacre_depths" = @("underwater")
}

$settlementToLocality = @{}
foreach ($entry in $localityAssignments.GetEnumerator()) {
  foreach ($slug in $entry.Value) {
    if ($settlementToLocality.ContainsKey($slug)) {
      throw "Duplicate locality assignment for settlement slug '$slug'."
    }
    $settlementToLocality[$slug] = $entry.Key
  }
}

$regionsDocument = Get-Content $regionPath -Raw | ConvertFrom-Json
$regionsById = @{}
foreach ($record in $regionsDocument.records) {
  $regionsById[$record.id] = $record
}

$localityDocument = Get-Content $localityPath -Raw | ConvertFrom-Json
$normalizedLocalities = foreach ($record in $localityDocument.records) {
  $supportedSiteClasses = if ($localitySiteClassOverrides.ContainsKey($record.id)) {
    $localitySiteClassOverrides[$record.id]
  } elseif ($record.supportedSiteClasses -is [System.Array]) {
    @($record.supportedSiteClasses)
  } elseif ($record.supportedSiteClasses) {
    @([string]$record.supportedSiteClasses)
  } else {
    @("surface")
  }

  [pscustomobject][ordered]@{
    id = $record.id
    slug = $record.slug
    name = $record.name
    macroRegionId = $record.macroRegionId
    regionId = $record.regionId
    localityType = $record.localityType
    summary = $record.summary
    habitationScoreModifier = [int]$record.habitationScoreModifier
    resourceCatchment = [pscustomobject][ordered]@{
      arableLand = $record.resourceCatchment.arableLand
      pasture = $record.resourceCatchment.pasture
      timber = $record.resourceCatchment.timber
      fishery = $record.resourceCatchment.fishery
      stone = $record.resourceCatchment.stone
      ore = $record.resourceCatchment.ore
      salt = $record.resourceCatchment.salt
      herbs = $record.resourceCatchment.herbs
      specialty = $record.resourceCatchment.specialty
    }
    settlementSuitability = [pscustomobject][ordered]@{
      settlementWeight = Round-Number([double]$record.settlementSuitability.settlementWeight)
      maxPopulationBand = $record.settlementSuitability.maxPopulationBand
      strategicSiteWeight = Round-Number([double]$record.settlementSuitability.strategicSiteWeight)
      favoredSettlementTypes = @($record.settlementSuitability.favoredSettlementTypes)
    }
    routeAccessModifier = [pscustomobject][ordered]@{
      road = Round-Number([double]$record.routeAccessModifier.road)
      river = Round-Number([double]$record.routeAccessModifier.river)
      coastal = Round-Number([double]$record.routeAccessModifier.coastal)
      caravan = Round-Number([double]$record.routeAccessModifier.caravan)
      pass = Round-Number([double]$record.routeAccessModifier.pass)
      seaLane = Round-Number([double]$record.routeAccessModifier.seaLane)
    }
    dominantIndustries = @($record.dominantIndustries)
    supportedSiteClasses = @($supportedSiteClasses)
  }
}

$localityDocument.records = @($normalizedLocalities)
$localitiesById = @{}
foreach ($record in $localityDocument.records) {
  $localitiesById[$record.id] = $record
}

$settlementDocument = Get-Content $settlementPath -Raw | ConvertFrom-Json
$normalizedSettlements = foreach ($record in $settlementDocument.records) {
  if (-not $settlementToLocality.ContainsKey($record.slug)) {
    throw "No locality assignment defined for settlement slug '$($record.slug)'."
  }

  $region = $regionsById[$record.regionId]
  if (-not $region) {
    throw "Missing region '$($record.regionId)' for settlement '$($record.id)'."
  }

  $locality = $localitiesById[$settlementToLocality[$record.slug]]
  if (-not $locality) {
    throw "Missing locality '$($settlementToLocality[$record.slug])' for settlement '$($record.id)'."
  }

  $siteClass = [string]$record.mapLocation.siteClass
  $infraRelief = Get-InfraRelief -Infrastructure $record.infrastructureProfile
  $sitePenalty = Get-SitePenalty -SiteClass $siteClass
  $foodLocalScore =
    (Get-BandScore $locality.resourceCatchment.arableLand) * 0.45 +
    (Get-BandScore $locality.resourceCatchment.pasture) * 0.25 +
    (Get-BandScore $locality.resourceCatchment.fishery) * 0.3

  $waterRouteBonus = 0
  if ([double]$locality.routeAccessModifier.river -ge 0.8) {
    $waterRouteBonus = 10
  } elseif ([double]$locality.routeAccessModifier.coastal -ge 1.0 -or [double]$locality.routeAccessModifier.seaLane -ge 1.0) {
    $waterRouteBonus = 4
  }

  $habitationScore = Clamp-Int ([int][Math]::Round(
    [double]$region.simulationProfile.habitationScore +
    [double]$locality.habitationScoreModifier +
    ($infraRelief * 0.45) -
    $sitePenalty
  )) 5 99

  $foodSecurity = Clamp-Int ([int][Math]::Round(
    ([double]$region.simulationProfile.foodProductionCapacity * 0.65) +
    ($foodLocalScore * 0.35) +
    ([double]$record.infrastructureProfile.waterTier * 1.5) -
    (Get-SitePenalty -SiteClass $siteClass)
  )) 5 99

  $waterSecurity = Clamp-Int ([int][Math]::Round(
    [double]$region.simulationProfile.waterAvailability +
    $waterRouteBonus +
    ([double]$record.infrastructureProfile.waterTier * 3) -
    ((Get-SitePenalty -SiteClass $siteClass) * 0.5)
  )) 5 99

  $climateBurden = Clamp-Int ([int][Math]::Round(
    [double]$region.simulationProfile.climateBurden +
    (Get-SiteClimateAdjustment -SiteClass $siteClass) -
    ($infraRelief * 0.15)
  )) 5 99

  $hazardPressure = Clamp-Int ([int][Math]::Round(
    [double]$region.simulationProfile.hazardPressure +
    (([double]$locality.settlementSuitability.strategicSiteWeight - 1) * 10) +
    (Get-BooleanNumber -Condition ($record.settlementType -in @("fort", "citadel", "outpost", "camp", "waystation")) -WhenTrue 4) -
    ([double]$record.infrastructureProfile.fortificationTier * 1.2)
  )) 5 99

  $routeAverage = (
    [double]$locality.routeAccessModifier.road +
    [double]$locality.routeAccessModifier.river +
    [double]$locality.routeAccessModifier.coastal +
    [double]$locality.routeAccessModifier.caravan +
    [double]$locality.routeAccessModifier.pass +
    [double]$locality.routeAccessModifier.seaLane
  ) / 6.0

  $infrastructureDifficulty = Clamp-Int ([int][Math]::Round(
    [double]$region.simulationProfile.infrastructureDifficulty +
    ((1 - ([Math]::Min($routeAverage, 1.4) / 1.4)) * 14) +
    (Get-SiteInfrastructureAdjustment -SiteClass $siteClass) -
    ($infraRelief * 0.2)
  )) 5 99

  $adjustedRouteAccess = [ordered]@{
    road = Round-Number(Clamp-Number ([double]$locality.routeAccessModifier.road + ([double]$record.infrastructureProfile.roadTier * 0.05)) 0 1.8)
    river = Round-Number(Clamp-Number ([double]$locality.routeAccessModifier.river + ([double]$record.infrastructureProfile.waterTier * 0.05)) 0 1.8)
    coastal = Round-Number(Clamp-Number ([double]$locality.routeAccessModifier.coastal + ([double]$record.infrastructureProfile.harborTier * 0.06)) 0 1.8)
    caravan = Round-Number(Clamp-Number ([double]$locality.routeAccessModifier.caravan + ([double]$record.infrastructureProfile.roadTier * 0.03)) 0 1.8)
    pass = Round-Number(Clamp-Number ([double]$locality.routeAccessModifier.pass + ([double]$record.infrastructureProfile.roadTier * 0.02)) 0 1.8)
    seaLane = Round-Number(Clamp-Number ([double]$locality.routeAccessModifier.seaLane + ([double]$record.infrastructureProfile.harborTier * 0.06)) 0 1.8)
  }

  $adjustedRouteAverage = (
    [double]$adjustedRouteAccess.road +
    [double]$adjustedRouteAccess.river +
    [double]$adjustedRouteAccess.coastal +
    [double]$adjustedRouteAccess.caravan +
    [double]$adjustedRouteAccess.pass +
    [double]$adjustedRouteAccess.seaLane
  ) / 6.0

  $importBias = Clamp-Number (
    [double]$region.economicProfile.importBias +
    (Get-BooleanNumber -Condition ($record.settlementType -in @("outpost", "camp", "fort", "citadel", "waystation", "ferry_post", "monastery")) -WhenTrue 0.08) +
    (Get-BooleanNumber -Condition ($siteClass -ne "surface") -WhenTrue 0.06) +
    (Get-BooleanNumber -Condition ($foodSecurity -lt 55) -WhenTrue 0.06) -
    (([double]$record.infrastructureProfile.marketTier + [double]$record.infrastructureProfile.harborTier) * 0.01)
  ) 0.15 0.95

  $exportBias = Clamp-Number (
    [double]$region.economicProfile.exportBias +
    ([double]$locality.settlementSuitability.settlementWeight - 1) * 0.08 +
    ([double]$record.infrastructureProfile.marketTier * 0.015) +
    ([double]$record.infrastructureProfile.harborTier * 0.015) -
    (Get-BooleanNumber -Condition ($foodSecurity -lt 45) -WhenTrue 0.05)
  ) 0.1 0.95

  $dependencyBand = Get-DependencyBand -ImportBias $importBias -FoodSecurity $foodSecurity -WaterSecurity $waterSecurity -RouteAverage $adjustedRouteAverage -SettlementType $record.settlementType
  $dominantRole = if ($record.purposeTags.Count -gt 0) { $record.purposeTags[0] } else { "mixed_economy" }
  $secondaryRoles = if ($record.purposeTags.Count -gt 1) { @($record.purposeTags[1..($record.purposeTags.Count - 1)]) } else { @() }
  $localSupplyStrengths = Get-UniqueStrings -Values @($record.domesticResourceProfile.primaryGoods + $record.domesticResourceProfile.secondaryGoods)
  $demandPressures = Get-UniqueStrings -Values @($record.domesticResourceProfile.demandedGoods + $region.economicProfile.demandPressures)
  $stapleImports = @($record.domesticResourceProfile.demandedGoods | Select-Object -First 4)
  $exportFocus = @($record.domesticResourceProfile.primaryGoods + $record.domesticResourceProfile.secondaryGoods | Select-Object -First 4)
  $specializationWeight = Round-Number(Clamp-Number (
    [double]$locality.settlementSuitability.settlementWeight +
    ([double]$record.infrastructureProfile.marketTier * 0.04) +
    ([double]$record.infrastructureProfile.harborTier * 0.03) +
    (([double]$record.purposeTags.Count - 1) * 0.01)
  ) 0.4 1.9)

  $visualMapRef = [pscustomobject][ordered]@{
    mapId = $record.mapLocation.mapId
    pixelX = [int]$record.mapLocation.pixelX
    pixelY = [int]$record.mapLocation.pixelY
    climateZoneId = $record.mapLocation.climateZoneId
    biomeZoneId = $record.mapLocation.biomeZoneId
    notes = $record.mapLocation.notes
  }

  $normalizedRecord = [ordered]@{
    id = $record.id
    slug = $record.slug
    name = $record.name
    macroRegionId = $record.macroRegionId
    regionId = $record.regionId
    localityBandId = $locality.id
    settlementType = $record.settlementType
    siteClass = $siteClass
    terrainContext = $locality.localityType
    populationBand = $record.populationBand
    populationTotal = [int]$record.populationTotal
    administrativeRole = $record.administrativeRole
  }

  if ($null -ne $record.parentSettlementId) {
    $normalizedRecord.parentSettlementId = $record.parentSettlementId
  }

  if ($null -ne $record.dependencyRole) {
    $normalizedRecord.dependencyRole = $record.dependencyRole
  }

  $normalizedRecord.summary = $record.summary
  $normalizedRecord.siteContext = $record.siteContext
  $normalizedRecord.identityTags = @($record.identityTags)
  $normalizedRecord.purposeTags = @($record.purposeTags)
  $normalizedRecord.economicModel = [pscustomobject][ordered]@{
    dominantRole = $dominantRole
    secondaryRoles = @($secondaryRoles)
    localSupplyStrengths = @($localSupplyStrengths)
    demandPressures = @($demandPressures)
    specializationWeight = $specializationWeight
  }
  $normalizedRecord.survivalModel = [pscustomobject][ordered]@{
    habitationScore = $habitationScore
    foodSecurity = $foodSecurity
    waterSecurity = $waterSecurity
    climateBurden = $climateBurden
    hazardPressure = $hazardPressure
    infrastructureDifficulty = $infrastructureDifficulty
  }
  $normalizedRecord.tradeDependencyProfile = [pscustomobject][ordered]@{
    importBias = Round-Number($importBias)
    exportBias = Round-Number($exportBias)
    dependencyBand = $dependencyBand
    stapleImports = @($stapleImports)
    exportFocus = @($exportFocus)
    routeAccess = [pscustomobject]$adjustedRouteAccess
  }
  $normalizedRecord.infrastructureProfile = $record.infrastructureProfile
  $normalizedRecord.racialMix = @($record.racialMix)
  $normalizedRecord.domesticResourceProfile = $record.domesticResourceProfile
  $normalizedRecord.domesticTradeFlows = @($record.domesticTradeFlows)
  $normalizedRecord.guildPresence = @($record.guildPresence)
  $normalizedRecord.visualMapRef = $visualMapRef

  [pscustomobject]$normalizedRecord
}

if ($normalizedSettlements.Count -ne $settlementDocument.records.Count) {
  throw "Settlement rewrite lost records."
}

$settlementDocument.records = @($normalizedSettlements)

Set-Content -Path $localityPath -Value ($localityDocument | ConvertTo-Json -Depth 100) -Encoding UTF8
Set-Content -Path $settlementPath -Value ($settlementDocument | ConvertTo-Json -Depth 100) -Encoding UTF8

Write-Output ("region_localities=" + $localityDocument.records.Count)
Write-Output ("settlements=" + $settlementDocument.records.Count)
