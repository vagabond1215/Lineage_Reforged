function New-FacilityTier {
    param(
        [int]$Tier,
        [string]$Label,
        [string]$PresenceLevel,
        [int]$StaffCapacity,
        [int]$DormitoryCapacity,
        [int]$StableCapacity,
        [string]$KitchenScale,
        [string]$WorkshopScale,
        [string]$StorehouseScale,
        [string]$Autonomy,
        [string[]]$ServiceTags
    )

    return [ordered]@{
        tier = $Tier
        label = $Label
        presenceLevel = $PresenceLevel
        staffCapacity = $StaffCapacity
        dormitoryCapacity = $DormitoryCapacity
        stableCapacity = $StableCapacity
        kitchenScale = $KitchenScale
        workshopScale = $WorkshopScale
        storehouseScale = $StorehouseScale
        autonomy = $Autonomy
        serviceTags = $ServiceTags
    }
}

function Get-QuestBoardProfile {
    param([string]$Slug)

    switch ($Slug) {
        'merchant_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'escort', 'porter', 'salvage')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('trade_hub', 'port_city', 'regional_capital', 'market_town')
                supplyFocusTags = @('warehouse', 'merchant_quarter', 'bonded_storage', 'exchange')
            }
        }
        'adventurers_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('gathering', 'hunting', 'domestic_labor', 'escort', 'porter', 'exploration', 'monster_subjugation', 'salvage')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('frontier_gate', 'fortress_gate', 'watch_post', 'trade_hub')
                supplyFocusTags = @('quest_board', 'hazard_clearance', 'escort_contracts', 'salvage_registry')
            }
        }
        'agricultural_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('gathering', 'hunting', 'domestic_labor', 'porter')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('agricultural_center', 'farm_cluster', 'granary_estate', 'estate_holding')
                supplyFocusTags = @('seedkeeping', 'harvest_yard', 'grain_market', 'orchard_contracts')
            }
        }
        'fishers_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('gathering', 'domestic_labor', 'porter', 'salvage')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('harbor_town', 'port_city', 'coastal_village', 'river_market')
                supplyFocusTags = @('catch_auction', 'landing_rights', 'curing_space', 'tidal_rights')
            }
        }
        'herbalists_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('gathering', 'domestic_labor', 'exploration')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('forest_edge', 'garden_town', 'apothecary_market', 'hill_village')
                supplyFocusTags = @('drying_loft', 'remedy_stock', 'tea_sorting', 'botanical_records')
            }
        }
        'miners_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'porter', 'exploration')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('mining_town', 'quarry_edge', 'mountain_pass', 'frontier_fort')
                supplyFocusTags = @('ore_delivery', 'shaft_safety', 'claim_registry', 'assay_desk')
            }
        }
        'teamsters_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'escort', 'porter')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('trade_hub', 'road_junction', 'fortress_gate', 'market_town')
                supplyFocusTags = @('freight_board', 'relay_service', 'team_yard', 'convoy_dispatch')
            }
        }
        'drovers_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'escort', 'porter')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('ranching_valley', 'market_town', 'pasture_hub', 'frontier_gate')
                supplyFocusTags = @('stockyard_sales', 'remount_transfer', 'seasonal_drive', 'pasture_registry')
            }
        }
        'rivermen_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'escort', 'porter', 'salvage')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('river_market', 'ferry_crossing', 'canal_node', 'port_city')
                supplyFocusTags = @('wharf_order', 'tow_service', 'lockage', 'barge_charter')
            }
        }
        'shipwrights_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'escort', 'porter', 'salvage')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('port_city', 'harbor_town', 'naval_yard', 'shipyard')
                supplyFocusTags = @('hull_contracts', 'rigging_orders', 'dock_labor', 'timber_allotment')
            }
        }
        'smiths_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'porter')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('forge_district', 'market_town', 'regional_capital', 'mining_town')
                supplyFocusTags = @('smelting_orders', 'forge_marks', 'repair_contracts', 'tool_sales')
            }
        }
        'woodwrights_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'porter')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('logging_town', 'market_town', 'river_market', 'shipyard')
                supplyFocusTags = @('timber_grading', 'framing_contracts', 'wagonwork', 'charcoal_orders')
            }
        }
        'masons_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'porter')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('quarry_edge', 'fortress_gate', 'regional_capital', 'bridgehead')
                supplyFocusTags = @('cut_stone_orders', 'lime_contracts', 'repair_crews', 'yard_storage')
            }
        }
        'gemcutters_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'porter', 'salvage')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('trade_hub', 'regional_capital', 'mining_town', 'artisan_district')
                supplyFocusTags = @('assay_bench', 'polish_orders', 'secure_storage', 'luxury_brokerage')
            }
        }
        'textile_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'porter')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('loom_district', 'market_town', 'agricultural_center', 'regional_capital')
                supplyFocusTags = @('loom_contracts', 'dyed_cloth_sales', 'quality_marks', 'warehouse_bales')
            }
        }
        'glassworkers_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'porter')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('artisan_district', 'port_city', 'market_town', 'regional_capital')
                supplyFocusTags = @('kiln_registry', 'furnace_batches', 'fragile_cargo', 'lens_orders')
            }
        }
        'potters_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'porter')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('clay_bank', 'market_town', 'agricultural_center', 'river_market')
                supplyFocusTags = @('kiln_shares', 'vessel_orders', 'brick_lots', 'storage_jars')
            }
        }
        'scribes_guild' {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'exploration', 'porter', 'salvage')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('regional_capital', 'trade_hub', 'archive_town', 'university_quarter')
                supplyFocusTags = @('ledgerkeeping', 'survey_charters', 'copying_orders', 'sealed_records')
            }
        }
        default {
            return [ordered]@{
                enabled = $true
                questCategories = @('domestic_labor', 'porter')
                tracksAllResources = $true
                allowMemberSales = $true
                demandFocusTags = @('market_town')
                supplyFocusTags = @('guild_services')
            }
        }
    }
}

function Get-FacilityTiers {
    param([string]$Slug, [string]$Category)

    switch ($Category) {
        'mercantile' {
            return @(
                (New-FacilityTier 1 'Counting Desk' 'outpost' 3 0 2 'none' 'none' 'locker' 'clerical' @('notice_board', 'brokerage', 'weighing')),
                (New-FacilityTier 2 'Trade Hall' 'hall' 8 4 6 'galley' 'none' 'storeroom' 'contract_hall' @('contract_broking', 'bonded_storage', 'auction_room')),
                (New-FacilityTier 3 'Exchange House' 'exchange' 18 12 12 'house' 'bench' 'warehouse' 'regional_house' @('banking', 'warehouse_lease', 'caravan_finance')),
                (New-FacilityTier 4 'Great Exchange' 'great_house' 34 24 20 'industrial' 'shop' 'warehouse' 'autonomous_center' @('banking', 'customs_arbitration', 'long_haul_factoring'))
            )
        }
        'martial' {
            return @(
                (New-FacilityTier 1 'Hiring Desk' 'outpost' 4 4 2 'galley' 'bench' 'locker' 'clerical' @('quest_board', 'escort_contracts', 'bounty_registry')),
                (New-FacilityTier 2 'Contract Hall' 'hall' 10 14 6 'house' 'shop' 'storeroom' 'contract_hall' @('hazard_clearance', 'escort_contracts', 'company_barracks')),
                (New-FacilityTier 3 'Chapterhouse' 'chapterhouse' 20 32 14 'house' 'shop' 'storeroom' 'regional_house' @('monster_culls', 'patrol_musters', 'salvage_registry')),
                (New-FacilityTier 4 'Grand Adventuring Hall' 'guildhouse' 32 56 20 'industrial' 'hall' 'warehouse' 'autonomous_center' @('major_contracts', 'casualty_fund', 'armory_support'))
            )
        }
        'gathering' {
            return @(
                (New-FacilityTier 1 'Guild Desk' 'outpost' 3 0 2 'none' 'bench' 'locker' 'clerical' @('task_posting', 'weighing', 'member_sales')),
                (New-FacilityTier 2 'Gatherers Hall' 'hall' 8 4 4 'galley' 'shop' 'storeroom' 'contract_hall' @('labor_posting', 'sorting_tables', 'seasonal_storage')),
                (New-FacilityTier 3 'Chartered Chapterhouse' 'chapterhouse' 14 8 8 'house' 'shop' 'storeroom' 'regional_house' @('quality_control', 'reserve_stock', 'regional_contracts')),
                (New-FacilityTier 4 'Autonomous Produce House' 'guildhouse' 24 16 12 'industrial' 'hall' 'warehouse' 'autonomous_center' @('bulk_exchange', 'dispatch_office', 'deep_storage'))
            )
        }
        'logistics' {
            return @(
                (New-FacilityTier 1 'Dispatch Desk' 'outpost' 4 0 4 'none' 'bench' 'locker' 'clerical' @('route_board', 'cargo_slips', 'animal_stalls')),
                (New-FacilityTier 2 'Relay Hall' 'hall' 10 6 10 'galley' 'shop' 'storeroom' 'contract_hall' @('relay_service', 'yard_dispatch', 'porter_registry')),
                (New-FacilityTier 3 'Freight Chapterhouse' 'chapterhouse' 18 12 18 'house' 'shop' 'warehouse' 'regional_house' @('convoy_scheduling', 'stable_yards', 'bulk_hauls')),
                (New-FacilityTier 4 'Autonomous Freight Yard' 'guildhouse' 28 18 28 'industrial' 'hall' 'warehouse' 'autonomous_center' @('caravan_command', 'regional_dispatch', 'supply_depot'))
            )
        }
        'crafting' {
            return @(
                (New-FacilityTier 1 'Guild Bench' 'outpost' 3 0 1 'none' 'bench' 'locker' 'clerical' @('quality_marks', 'task_board', 'sample_storage')),
                (New-FacilityTier 2 'Craft Hall' 'hall' 8 2 2 'galley' 'shop' 'storeroom' 'contract_hall' @('apprenticeship', 'commission_board', 'shared_kiln_or_forge')),
                (New-FacilityTier 3 'Master Chapterhouse' 'chapterhouse' 14 6 4 'house' 'shop' 'warehouse' 'regional_house' @('masterwork_review', 'bulk_orders', 'materials_registry')),
                (New-FacilityTier 4 'Autonomous Makers Hall' 'guildhouse' 24 10 6 'industrial' 'hall' 'warehouse' 'autonomous_center' @('large_contracts', 'guild_workshops', 'finished_goods_storage'))
            )
        }
        'civic' {
            return @(
                (New-FacilityTier 1 'Record Desk' 'outpost' 3 0 0 'none' 'bench' 'locker' 'clerical' @('copying', 'seal_registry', 'notice_posting')),
                (New-FacilityTier 2 'Records Hall' 'hall' 8 2 1 'galley' 'shop' 'storeroom' 'contract_hall' @('ledgerkeeping', 'charters', 'survey_briefs')),
                (New-FacilityTier 3 'Chartered Archive House' 'chapterhouse' 14 4 2 'house' 'shop' 'storeroom' 'regional_house' @('archive_storage', 'copying_orders', 'map_dossiers')),
                (New-FacilityTier 4 'Autonomous Archive Center' 'guildhouse' 22 8 2 'industrial' 'hall' 'warehouse' 'autonomous_center' @('state_archives', 'regional_records', 'research_support'))
            )
        }
        default {
            return @(
                (New-FacilityTier 1 'Guild Desk' 'outpost' 2 0 0 'none' 'bench' 'locker' 'clerical' @('task_board')),
                (New-FacilityTier 2 'Guild Hall' 'hall' 6 2 2 'galley' 'shop' 'storeroom' 'contract_hall' @('member_services')),
                (New-FacilityTier 3 'Guildhouse' 'guildhouse' 12 6 4 'house' 'shop' 'warehouse' 'autonomous_center' @('regional_services'))
            )
        }
    }
}

$guildPath = 'packages/content/base/civilization/guilds.json'
$guildData = Get-Content $guildPath -Raw | ConvertFrom-Json
foreach ($record in $guildData.records) {
    $record | Add-Member -NotePropertyName questBoardProfile -NotePropertyValue (Get-QuestBoardProfile -Slug $record.slug) -Force
    $record | Add-Member -NotePropertyName facilityTiers -NotePropertyValue (Get-FacilityTiers -Slug $record.slug -Category $record.category) -Force
}
$guildData | ConvertTo-Json -Depth 12 | Set-Content -Path $guildPath

$settlementPath = 'packages/content/base/world/settlements.json'
$settlementData = Get-Content $settlementPath -Raw | ConvertFrom-Json
foreach ($record in $settlementData.records) {
    $guildPresence = @($record.guildPresence)
    if ($guildPresence.Count -gt 0 -and -not ($guildPresence.guildType -contains 'adventurers_guild')) {
        $identityTags = @($record.identityTags)
        $purposeTags = @($record.purposeTags)
        $guildCount = $guildPresence.Count
        $hasMajorTrade = (($identityTags + $purposeTags) | Where-Object { $_ -in @('trade_hub', 'port_city', 'regional_capital', 'frontier_gate', 'fortress_gate', 'river_market') }).Count -gt 0
        $presenceLevel = if (($record.populationTotal -ge 12000) -or ($guildCount -ge 5) -or $hasMajorTrade) { 'hall' } else { 'outpost' }
        $entryName = if ($presenceLevel -eq 'hall') { "$($record.name) Adventurers Hall" } else { 'Adventurers Desk' }
        $entryFunctions = if ($presenceLevel -eq 'hall') { @('quest_board', 'escort_contracts', 'hazard_clearance') } else { @('quest_board', 'general_commissions', 'escort_contracts') }
        $entryNotes = 'Operates as a shared adventurers counter within the local guild quarter so escort, labor, and hazard contracts always have a public posting point.'
        $guildPresence += [pscustomobject]@{
            guildType = 'adventurers_guild'
            name = $entryName
            presenceLevel = $presenceLevel
            functions = $entryFunctions
            notes = $entryNotes
        }
        $record.guildPresence = $guildPresence
    }
}
$settlementData | ConvertTo-Json -Depth 12 | Set-Content -Path $settlementPath
