Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ([Threading.Thread]::CurrentThread.ApartmentState -ne [Threading.ApartmentState]::STA) {
    throw "This script must run in STA mode. Use run-content-browser.cmd or launch with powershell -STA."
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$workspaceRoot = Split-Path -Path $PSScriptRoot -Parent
$databaseRoot = Join-Path $workspaceRoot "packages/content/base"
$docsRoot = Join-Path $workspaceRoot "docs"
$coverageRoot = Join-Path $workspaceRoot "docs/data-dictionary"
$storyRoot = Join-Path $workspaceRoot "story"

$logRoot = Join-Path $workspaceRoot "logs"
if (-not (Test-Path -LiteralPath $logRoot)) {
    New-Item -ItemType Directory -Path $logRoot -Force | Out-Null
}
$script:logPath = Join-Path $logRoot "content_story_browser.log"

$script:selectedFilePath = $null
$script:appRootNode = $null
$script:currentMenuNode = $null
$script:currentDetailNode = $null
$script:navHistory = New-Object System.Collections.ArrayList
$script:productionChainRecords = @()
$script:workplaceChainIndex = @{}
$script:regionRecords = @()
$script:guildRecords = @()
$script:worldMapRecords = @()
$script:settlementRecords = @()
$script:isRenderingNavigation = $false
$script:lastNavClientWidth = 0

function Write-Log {
    param(
        [Parameter(Mandatory = $true)][string]$Message,
        [ValidateSet("INFO", "WARN", "ERROR")][string]$Level = "INFO"
    )

    try {
        $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss.fff")
        Add-Content -LiteralPath $script:logPath -Value "[$timestamp][$Level] $Message" -Encoding UTF8
    }
    catch {
        # Avoid secondary logging failures from interrupting the UI.
    }
}

trap {
    Write-Log -Level "ERROR" -Message "Unhandled exception: $($_.Exception.Message) | Stack: $($_.ScriptStackTrace)"
    throw
}

Write-Log -Message "Content browser starting. Workspace=$workspaceRoot"

function Test-ObjectProperty {
    param(
        $Object,
        [Parameter(Mandatory = $true)][string]$Name
    )

    if ($null -eq $Object) {
        return $false
    }

    return $null -ne $Object.PSObject.Properties[$Name]
}

function Get-ObjectProperty {
    param(
        $Object,
        [Parameter(Mandatory = $true)][string]$Name,
        $Default = $null
    )

    if (Test-ObjectProperty -Object $Object -Name $Name) {
        return $Object.$Name
    }

    return $Default
}

function Get-RelativePath {
    param(
        [string]$RootPath,
        [string]$FullPath
    )

    $rootAbsolute = [System.IO.Path]::GetFullPath($RootPath)
    $fullAbsolute = [System.IO.Path]::GetFullPath($FullPath)

    if (-not $rootAbsolute.EndsWith([System.IO.Path]::DirectorySeparatorChar.ToString())) {
        $rootAbsolute += [System.IO.Path]::DirectorySeparatorChar
    }

    $rootUri = New-Object System.Uri($rootAbsolute)
    $fullUri = New-Object System.Uri($fullAbsolute)
    $relativeUri = $rootUri.MakeRelativeUri($fullUri)
    return [System.Uri]::UnescapeDataString($relativeUri.ToString()).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
}

function Get-FriendlyLabel {
    param([string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return "(Unnamed)"
    }

    $text = $Value.Trim()
    $text = $text -replace '[_\-]', ' '
    $text = $text -replace '\.', ' '
    $text = $text -replace '\s+', ' '
    $textInfo = [System.Globalization.CultureInfo]::CurrentCulture.TextInfo
    return $textInfo.ToTitleCase($text.ToLowerInvariant())
}

function Get-RelativeWorkspaceLabel {
    param([string]$Path)

    if ([string]::IsNullOrWhiteSpace($Path) -or -not (Test-Path -LiteralPath $Path)) {
        return ""
    }

    try {
        return Get-RelativePath -RootPath $workspaceRoot -FullPath $Path
    }
    catch {
        return $Path
    }
}

function Get-ReadableContent {
    param([string]$FilePath)

    $raw = Get-Content -LiteralPath $FilePath -Raw
    $extension = [System.IO.Path]::GetExtension($FilePath).ToLowerInvariant()

    if ($extension -eq ".json") {
        try {
            $parsed = $raw | ConvertFrom-Json -ErrorAction Stop
            return $parsed | ConvertTo-Json -Depth 100
        }
        catch {
            return $raw
        }
    }

    return $raw
}

function Format-Number {
    param($Value)

    if ($null -eq $Value) {
        return "n/a"
    }

    if ($Value -is [double] -or $Value -is [float] -or $Value -is [decimal]) {
        return ([double]$Value).ToString("0.##")
    }

    return [string]$Value
}

function Format-ListText {
    param(
        $Items,
        [string]$EmptyText = "none",
        [string]$Separator = ", "
    )

    $values = @()
    foreach ($item in @($Items)) {
        if ($null -eq $item) {
            continue
        }

        $text = [string]$item
        if (-not [string]::IsNullOrWhiteSpace($text)) {
            $values += $text
        }
    }

    if ($values.Count -eq 0) {
        return $EmptyText
    }

    return ($values -join $Separator)
}

function New-LineBuffer {
    $buffer = New-Object System.Collections.ArrayList
    Write-Output -NoEnumerate $buffer
}

function Add-Section {
    param(
        [AllowEmptyCollection()][System.Collections.ArrayList]$Lines,
        [Parameter(Mandatory = $true)][string]$Title,
        [string[]]$BodyLines
    )

    $body = @()
    foreach ($line in @($BodyLines)) {
        if ($null -ne $line) {
            $body += [string]$line
        }
    }

    if ($body.Count -eq 0) {
        return
    }

    if ($Lines.Count -gt 0) {
        [void]$Lines.Add("")
    }

    [void]$Lines.Add($Title)
    [void]$Lines.Add(("-" * $Title.Length))
    foreach ($line in $body) {
        [void]$Lines.Add($line)
    }
}

function Join-Lines {
    param([System.Collections.ArrayList]$Lines)

    return ($Lines -join [Environment]::NewLine)
}

function Get-RecordDisplayLabel {
    param($Record)

    if ($null -eq $Record) {
        return "(Empty Record)"
    }

    if ($Record -isnot [System.Management.Automation.PSCustomObject] -and $Record -isnot [hashtable]) {
        return [string]$Record
    }

    foreach ($name in @("name", "title", "itemKey", "speciesKey", "label")) {
        $value = Get-ObjectProperty -Object $Record -Name $name -Default ''
        if (-not [string]::IsNullOrWhiteSpace([string]$value)) {
            return [string]$value
        }
    }

    $id = Get-ObjectProperty -Object $Record -Name 'id' -Default ''
    if (-not [string]::IsNullOrWhiteSpace([string]$id)) {
        $parts = ([string]$id).Split(".")
        return Get-FriendlyLabel -Value $parts[$parts.Length - 1]
    }

    return "Record"
}

function Get-RecordSortKey {
    param($Record)

    return (Get-RecordDisplayLabel -Record $Record).ToLowerInvariant()
}

function New-NavNode {
    param(
        [Parameter(Mandatory = $true)][string]$Kind,
        [Parameter(Mandatory = $true)][string]$Title,
        [string]$Description = "",
        [string]$SourcePath = "",
        [string]$RootPath = "",
        [string]$DetailKind = "",
        $Record = $null,
        $Data = $null,
        [hashtable]$Metadata = $null
    )

    if ($null -eq $Metadata) {
        $Metadata = @{}
    }

    return [pscustomobject]@{
        Kind = $Kind
        Title = $Title
        Description = $Description
        SourcePath = $SourcePath
        RootPath = $RootPath
        DetailKind = $DetailKind
        Record = $Record
        Data = $Data
        Metadata = $Metadata
        Children = New-Object System.Collections.ArrayList
    }
}

function Add-ChildNode {
    param(
        [Parameter(Mandatory = $true)]$Parent,
        [Parameter(Mandatory = $true)]$Child
    )

    [void]$Parent.Children.Add($Child)
    return $Child
}

function New-PlaceholderNode {
    param([string]$Message)

    return (New-NavNode -Kind "placeholder" -Title $Message -Description "" -DetailKind "placeholder")
}

function Get-RecordDetailKind {
    param([string]$DatasetKey)

    switch ($DatasetKey) {
        "flora" { return "flora_entry" }
        "fauna" { return "fauna_entry" }
        "guilds" { return "guild" }
        "regions" { return "world_region" }
        "regional_ecology_profiles" { return "regional_ecology" }
        "settlements" { return "settlement" }
        "travel_networks" { return "travel_network" }
        "world_maps" { return "world_map" }
        "world_map_features" { return "world_map_feature" }
        "workplaces" { return "workplace" }
        "infrastructure" { return "infrastructure" }
        "production_chains" { return "production_chain" }
        "meat_cut_standards" { return "meat_cut_standard" }
        default { return "generic_record" }
    }
}

function New-RecordNode {
    param(
        $Record,
        [Parameter(Mandatory = $true)][string]$DatasetKey,
        [Parameter(Mandatory = $true)][string]$SourcePath,
        [Parameter(Mandatory = $true)][string]$RecordDetailKind
    )

    $descriptionParts = @()
    $id = Get-ObjectProperty -Object $Record -Name 'id' -Default ''
    $category = Get-ObjectProperty -Object $Record -Name 'category' -Default ''
    $itemKey = Get-ObjectProperty -Object $Record -Name 'itemKey' -Default ''

    if (-not [string]::IsNullOrWhiteSpace([string]$id)) {
        $descriptionParts += [string]$id
    }
    elseif (-not [string]::IsNullOrWhiteSpace([string]$itemKey)) {
        $descriptionParts += [string]$itemKey
    }

    if (-not [string]::IsNullOrWhiteSpace([string]$category)) {
        $descriptionParts += [string]$category
    }

    return (New-NavNode -Kind "record" `
        -Title (Get-RecordDisplayLabel -Record $Record) `
        -Description (Format-ListText -Items $descriptionParts -EmptyText "Record") `
        -SourcePath $SourcePath `
        -RootPath $workspaceRoot `
        -DetailKind $RecordDetailKind `
        -Record $Record `
        -Data $Record `
        -Metadata @{
            DatasetKey = $DatasetKey
            RecordId = $id
        })
}

function Get-PreferredGroupingProperty {
    param([object[]]$Records)

    foreach ($candidate in @("category", "source", "family", "kind", "type")) {
        $allHaveValues = $true
        $values = @()

        foreach ($record in $Records) {
            $value = Get-ObjectProperty -Object $record -Name $candidate -Default ''
            if ([string]::IsNullOrWhiteSpace([string]$value)) {
                $allHaveValues = $false
                break
            }

            $values += [string]$value
        }

        if (-not $allHaveValues) {
            continue
        }

        $uniqueValues = @($values | Sort-Object -Unique)
        if ($uniqueValues.Count -ge 2 -and $uniqueValues.Count -le 12) {
            return $candidate
        }
    }

    return $null
}

function Group-RecordsByLetter {
    param(
        [object[]]$Records,
        [Parameter(Mandatory = $true)][string]$DatasetKey,
        [Parameter(Mandatory = $true)][string]$SourcePath,
        [Parameter(Mandatory = $true)][string]$RecordDetailKind
    )

    $groups = @{}
    foreach ($record in ($Records | Sort-Object { Get-RecordSortKey -Record $_ })) {
        $label = Get-RecordDisplayLabel -Record $record
        $firstCharacter = if ([string]::IsNullOrWhiteSpace($label)) { "#" } else { $label.Substring(0, 1).ToUpperInvariant() }
        if ($firstCharacter -notmatch "[A-Z0-9]") {
            $firstCharacter = "#"
        }

        if (-not $groups.ContainsKey($firstCharacter)) {
            $groups[$firstCharacter] = New-Object System.Collections.ArrayList
        }

        [void]$groups[$firstCharacter].Add($record)
    }

    $nodes = New-Object System.Collections.ArrayList
    foreach ($key in ($groups.Keys | Sort-Object)) {
        $groupNode = New-NavNode -Kind "menu" `
            -Title $key `
            -Description "$($groups[$key].Count) items" `
            -SourcePath $SourcePath `
            -RootPath $workspaceRoot `
            -DetailKind "group" `
            -Metadata @{
                DatasetKey = $DatasetKey
                GroupLabel = $key
                RecordCount = $groups[$key].Count
            }

        foreach ($record in @($groups[$key])) {
            [void](Add-ChildNode -Parent $groupNode -Child (New-RecordNode -Record $record -DatasetKey $DatasetKey -SourcePath $SourcePath -RecordDetailKind $RecordDetailKind))
        }

        [void]$nodes.Add($groupNode)
    }

    return $nodes
}

function Group-RecordNodes {
    param(
        [object[]]$Records,
        [Parameter(Mandatory = $true)][string]$DatasetKey,
        [Parameter(Mandatory = $true)][string]$SourcePath,
        [Parameter(Mandatory = $true)][string]$RecordDetailKind
    )

    $recordList = @($Records)
    $nodes = New-Object System.Collections.ArrayList

    if ($recordList.Count -le 48) {
        foreach ($record in ($recordList | Sort-Object { Get-RecordSortKey -Record $_ })) {
            [void]$nodes.Add((New-RecordNode -Record $record -DatasetKey $DatasetKey -SourcePath $SourcePath -RecordDetailKind $RecordDetailKind))
        }

        return $nodes
    }

    $groupingProperty = Get-PreferredGroupingProperty -Records $recordList
    if ($null -ne $groupingProperty) {
        $groups = $recordList | Group-Object { [string](Get-ObjectProperty -Object $_ -Name $groupingProperty -Default '') } | Sort-Object Name
        if ($groups.Count -ge 2 -and $groups.Count -le 12) {
            foreach ($group in $groups) {
                $groupTitle = Get-FriendlyLabel -Value $group.Name
                $groupNode = New-NavNode -Kind "menu" `
                    -Title $groupTitle `
                    -Description "$($group.Count) items" `
                    -SourcePath $SourcePath `
                    -RootPath $workspaceRoot `
                    -DetailKind "group" `
                    -Metadata @{
                        DatasetKey = $DatasetKey
                        GroupLabel = $group.Name
                        GroupingProperty = $groupingProperty
                        RecordCount = $group.Count
                    }

                if ($group.Count -gt 48) {
                    foreach ($childNode in @(Group-RecordsByLetter -Records @($group.Group) -DatasetKey $DatasetKey -SourcePath $SourcePath -RecordDetailKind $RecordDetailKind)) {
                        [void](Add-ChildNode -Parent $groupNode -Child $childNode)
                    }
                }
                else {
                    foreach ($record in ($group.Group | Sort-Object { Get-RecordSortKey -Record $_ })) {
                        [void](Add-ChildNode -Parent $groupNode -Child (New-RecordNode -Record $record -DatasetKey $DatasetKey -SourcePath $SourcePath -RecordDetailKind $RecordDetailKind))
                    }
                }

                [void]$nodes.Add($groupNode)
            }

            return $nodes
        }
    }

    return (Group-RecordsByLetter -Records $recordList -DatasetKey $DatasetKey -SourcePath $SourcePath -RecordDetailKind $RecordDetailKind)
}

function Build-DatasetNode {
    param([Parameter(Mandatory = $true)][string]$FilePath)

    $datasetKey = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
    $title = Get-FriendlyLabel -Value $datasetKey
    $relativePath = Get-RelativeWorkspaceLabel -Path $FilePath

    try {
        $raw = Get-Content -LiteralPath $FilePath -Raw
        $parsed = $raw | ConvertFrom-Json -ErrorAction Stop
    }
    catch {
        Write-Log -Level "WARN" -Message "Unable to parse dataset file '$FilePath': $($_.Exception.Message)"
        return (New-NavNode -Kind "file" `
            -Title $title `
            -Description "JSON file" `
            -SourcePath $FilePath `
            -RootPath $workspaceRoot `
            -DetailKind "file_json" `
            -Data $null `
            -Metadata @{
                RelativePath = $relativePath
                ParseError = $_.Exception.Message
            })
    }

    if (Test-ObjectProperty -Object $parsed -Name 'records') {
        $records = @($parsed.records)
        $node = New-NavNode -Kind "menu" `
            -Title $title `
            -Description "$($records.Count) records" `
            -SourcePath $FilePath `
            -RootPath $workspaceRoot `
            -DetailKind "dataset" `
            -Data $parsed `
            -Metadata @{
                RelativePath = $relativePath
                DatasetKey = $datasetKey
                RecordCount = $records.Count
            }

        if ($datasetKey -eq "production_chains") {
            $script:productionChainRecords = $records
        }
        elseif ($datasetKey -eq "guilds") {
            $script:guildRecords = $records
        }
        elseif ($datasetKey -eq "regions") {
            $script:regionRecords = $records
        }
        elseif ($datasetKey -eq "world_maps") {
            $script:worldMapRecords = $records
        }
        elseif ($datasetKey -eq "settlements") {
            $script:settlementRecords = $records
        }

        foreach ($childNode in @(Group-RecordNodes -Records $records -DatasetKey $datasetKey -SourcePath $FilePath -RecordDetailKind (Get-RecordDetailKind -DatasetKey $datasetKey))) {
            [void](Add-ChildNode -Parent $node -Child $childNode)
        }

        if ($node.Children.Count -eq 0) {
            [void](Add-ChildNode -Parent $node -Child (New-PlaceholderNode -Message "(No records found.)"))
        }

        return $node
    }

    return (New-NavNode -Kind "file" `
        -Title $title `
        -Description "JSON file" `
        -SourcePath $FilePath `
        -RootPath $workspaceRoot `
        -DetailKind "file_json" `
        -Data $parsed `
        -Metadata @{
            RelativePath = $relativePath
        })
}

function Build-JsonFolderNode {
    param(
        [Parameter(Mandatory = $true)][string]$FolderPath,
        [Parameter(Mandatory = $true)][string]$Title
    )

    $node = New-NavNode -Kind "menu" `
        -Title $Title `
        -Description "Data section" `
        -SourcePath $FolderPath `
        -RootPath $workspaceRoot `
        -DetailKind "folder" `
        -Metadata @{
            RelativePath = Get-RelativeWorkspaceLabel -Path $FolderPath
        }

    foreach ($directory in (Get-ChildItem -LiteralPath $FolderPath -Directory | Sort-Object Name)) {
        [void](Add-ChildNode -Parent $node -Child (Build-JsonFolderNode -FolderPath $directory.FullName -Title (Get-FriendlyLabel -Value $directory.Name)))
    }

    foreach ($file in (Get-ChildItem -LiteralPath $FolderPath -File -Filter "*.json" | Sort-Object Name)) {
        [void](Add-ChildNode -Parent $node -Child (Build-DatasetNode -FilePath $file.FullName))
    }

    if ($node.Children.Count -eq 0) {
        [void](Add-ChildNode -Parent $node -Child (New-PlaceholderNode -Message "(No JSON files found.)"))
    }

    return $node
}

function Build-MarkdownFileNode {
    param(
        [Parameter(Mandatory = $true)][string]$FilePath,
        [Parameter(Mandatory = $true)][string]$Title
    )

    return (New-NavNode -Kind "file" `
        -Title $Title `
        -Description "Markdown file" `
        -SourcePath $FilePath `
        -RootPath $workspaceRoot `
        -DetailKind "markdown" `
        -Metadata @{
            RelativePath = Get-RelativeWorkspaceLabel -Path $FilePath
        })
}

function Build-MarkdownFolderNode {
    param(
        [Parameter(Mandatory = $true)][string]$FolderPath,
        [Parameter(Mandatory = $true)][string]$Title,
        [string]$Description = "Markdown section"
    )

    $node = New-NavNode -Kind "menu" `
        -Title $Title `
        -Description $Description `
        -SourcePath $FolderPath `
        -RootPath $workspaceRoot `
        -DetailKind "folder" `
        -Metadata @{
            RelativePath = Get-RelativeWorkspaceLabel -Path $FolderPath
        }

    foreach ($directory in (Get-ChildItem -LiteralPath $FolderPath -Directory | Sort-Object Name)) {
        [void](Add-ChildNode -Parent $node -Child (Build-MarkdownFolderNode -FolderPath $directory.FullName -Title (Get-FriendlyLabel -Value $directory.Name) -Description "Subfolder"))
    }

    foreach ($file in (Get-ChildItem -LiteralPath $FolderPath -File -Filter "*.md" | Sort-Object Name)) {
        [void](Add-ChildNode -Parent $node -Child (Build-MarkdownFileNode -FilePath $file.FullName -Title (Get-FriendlyLabel -Value ([System.IO.Path]::GetFileNameWithoutExtension($file.Name)))))
    }

    if ($node.Children.Count -eq 0) {
        [void](Add-ChildNode -Parent $node -Child (New-PlaceholderNode -Message "(No markdown files found.)"))
    }

    return $node
}

function Build-ProjectDocsNode {
    $node = New-NavNode -Kind "menu" `
        -Title "Project Docs" `
        -Description "README, backlog, and planning references." `
        -SourcePath $workspaceRoot `
        -RootPath $workspaceRoot `
        -DetailKind "folder" `
        -Metadata @{
            RelativePath = "."
        }

    $readmePath = Join-Path $workspaceRoot "README.md"
    if (Test-Path -LiteralPath $readmePath) {
        [void](Add-ChildNode -Parent $node -Child (Build-MarkdownFileNode -FilePath $readmePath -Title "README"))
    }

    $backlogPath = Join-Path $docsRoot "future_content_backlog.md"
    if (Test-Path -LiteralPath $backlogPath) {
        [void](Add-ChildNode -Parent $node -Child (Build-MarkdownFileNode -FilePath $backlogPath -Title "Future Content Backlog"))
    }

    if ($node.Children.Count -eq 0) {
        [void](Add-ChildNode -Parent $node -Child (New-PlaceholderNode -Message "(No project docs found.)"))
    }

    return $node
}

function Build-WorkplaceChainIndex {
    $script:workplaceChainIndex = @{}

    foreach ($chain in @($script:productionChainRecords)) {
        foreach ($stage in @((Get-ObjectProperty -Object $chain -Name 'stages' -Default @()))) {
            $stageText = [string]$stage
            if ($stageText -notlike "workplace.*") {
                continue
            }

            if (-not $script:workplaceChainIndex.ContainsKey($stageText)) {
                $script:workplaceChainIndex[$stageText] = New-Object System.Collections.ArrayList
            }

            [void]$script:workplaceChainIndex[$stageText].Add($chain)
        }
    }
}

function Build-AppModel {
    $script:productionChainRecords = @()
    $script:regionRecords = @()
    $script:guildRecords = @()
    $script:settlementRecords = @()
    $script:worldMapRecords = @()

    $rootNode = New-NavNode -Kind "menu" `
        -Title "Home" `
        -Description "Choose a section from the navigation rail." `
        -SourcePath $workspaceRoot `
        -RootPath $workspaceRoot `
        -DetailKind "home" `
        -Metadata @{
            RelativePath = "."
        }

    [void](Add-ChildNode -Parent $rootNode -Child (Build-ProjectDocsNode))

    if (Test-Path -LiteralPath $databaseRoot) {
        foreach ($directory in (Get-ChildItem -LiteralPath $databaseRoot -Directory | Sort-Object Name)) {
            [void](Add-ChildNode -Parent $rootNode -Child (Build-JsonFolderNode -FolderPath $directory.FullName -Title (Get-FriendlyLabel -Value $directory.Name)))
        }
    }
    else {
        [void](Add-ChildNode -Parent $rootNode -Child (New-PlaceholderNode -Message "(Content root not found.)"))
    }

    if (Test-Path -LiteralPath $coverageRoot) {
        [void](Add-ChildNode -Parent $rootNode -Child (Build-MarkdownFolderNode -FolderPath $coverageRoot -Title "Coverage Reports" -Description "Data dictionary coverage and design notes."))
    }

    if (Test-Path -LiteralPath $storyRoot) {
        [void](Add-ChildNode -Parent $rootNode -Child (Build-MarkdownFolderNode -FolderPath $storyRoot -Title "Story" -Description "Narrative and worldbuilding markdown."))
    }

    Build-WorkplaceChainIndex
    return $rootNode
}

function Get-ToolRequirementSummary {
    param($ToolRequirements)

    if ($null -eq $ToolRequirements) {
        return "No explicit tool requirement defined."
    }

    $minimumTier = Get-ObjectProperty -Object $ToolRequirements -Name 'minimumToolTier' -Default ''
    $requiredTags = Format-ListText -Items (Get-ObjectProperty -Object $ToolRequirements -Name 'requiredToolTags' -Default @())

    $penalty = Get-ObjectProperty -Object $ToolRequirements -Name 'missingToolPenalty' -Default $null
    if ($null -ne $penalty) {
        $penaltyText = "{0} x{1}" -f (Get-ObjectProperty -Object $penalty -Name 'mode' -Default ''), (Format-Number -Value (Get-ObjectProperty -Object $penalty -Name 'outputMultiplier' -Default $null))
    }
    else {
        $penaltyText = "none"
    }

    return "Min tool tier $minimumTier | tools: $requiredTags | missing-tool penalty: $penaltyText"
}

function Get-IoLine {
    param(
        $Entry,
        [Parameter(Mandatory = $true)][string]$QuantityProperty,
        [string]$TypeProperty = ""
    )

    $itemKey = Get-ObjectProperty -Object $Entry -Name 'itemKey' -Default ''
    $quantity = Format-Number -Value (Get-ObjectProperty -Object $Entry -Name $QuantityProperty -Default $null)
    $unit = Get-ObjectProperty -Object $Entry -Name 'unit' -Default ''
    $line = "{0} x {1}" -f $itemKey, $quantity

    if (-not [string]::IsNullOrWhiteSpace([string]$unit)) {
        $line += " $unit"
    }

    if (-not [string]::IsNullOrWhiteSpace($TypeProperty)) {
        $typeValue = Get-ObjectProperty -Object $Entry -Name $TypeProperty -Default ''
        if (-not [string]::IsNullOrWhiteSpace([string]$typeValue)) {
            $line += " [{0}]" -f $typeValue
        }
    }

    return $line
}

function Get-InputLaborWeightSummary {
    param($Weights)

    $parts = @()
    foreach ($weight in @($Weights)) {
        $parts += ("{0}=x{1}" -f (Get-ObjectProperty -Object $weight -Name 'itemKey' -Default ''), (Format-Number -Value (Get-ObjectProperty -Object $weight -Name 'laborWeight' -Default $null)))
    }

    return (Format-ListText -Items $parts)
}

function Get-UpgradeEffectSummary {
    param($Effects)

    if ($null -eq $Effects) {
        return "No explicit effects listed."
    }

    $parts = @()
    foreach ($field in @("throughputMultiplier", "laborEfficiency", "wasteMultiplier", "qualityMultiplier", "variantSlotDelta", "switchLaborCostMultiplier")) {
        if (Test-ObjectProperty -Object $Effects -Name $field) {
            $parts += ("{0}: {1}" -f $field, (Format-Number -Value (Get-ObjectProperty -Object $Effects -Name $field -Default $null)))
        }
    }

    $variantUnlocks = @((Get-ObjectProperty -Object $Effects -Name 'variantUnlocks' -Default @()))
    if ($variantUnlocks.Count -gt 0) {
        $parts += ("variant unlocks: {0}" -f (Format-ListText -Items $variantUnlocks))
    }

    return (Format-ListText -Items $parts -Separator "; ")
}

function Get-PreviewListText {
    param(
        $Items,
        [int]$MaxItems = 8,
        [string]$EmptyText = "none"
    )

    $values = @()
    foreach ($item in @($Items)) {
        if ($null -eq $item) {
            continue
        }

        $text = [string]$item
        if (-not [string]::IsNullOrWhiteSpace($text)) {
            $values += $text
        }
    }

    if ($values.Count -eq 0) {
        return $EmptyText
    }

    if ($values.Count -le $MaxItems) {
        return ($values -join ", ")
    }

    $visible = $values[0..($MaxItems - 1)]
    return "{0} ... (+{1} more)" -f ($visible -join ", "), ($values.Count - $MaxItems)
}

function Get-YesNoText {
    param(
        $Value,
        [string]$TrueText = "Yes",
        [string]$FalseText = "No"
    )

    if ($Value) {
        return $TrueText
    }

    return $FalseText
}

function Get-HarvestOutputLines {
    param(
        $RawOutput,
        [string]$HeadingPrefix = ""
    )

    $lines = @()
    if ($null -eq $RawOutput) {
        return $lines
    }

    $materials = @((Get-ObjectProperty -Object $RawOutput -Name 'materials' -Default @()))
    if ($materials.Count -gt 0) {
        $lines += ("{0}Materials: {1}" -f $HeadingPrefix, (Get-PreviewListText -Items $materials))
    }

    $ingredients = @((Get-ObjectProperty -Object $RawOutput -Name 'ingredients' -Default @()))
    if ($ingredients.Count -gt 0) {
        $lines += ("{0}Ingredients: {1}" -f $HeadingPrefix, (Get-PreviewListText -Items $ingredients))
    }

    $processing = Get-ObjectProperty -Object $RawOutput -Name 'processing' -Default $null
    if ($null -ne $processing) {
        $byProducts = Get-ObjectProperty -Object $processing -Name 'byProducts' -Default $null
        if ($null -ne $byProducts) {
            $bpMaterials = @((Get-ObjectProperty -Object $byProducts -Name 'materials' -Default @()))
            if ($bpMaterials.Count -gt 0) {
                $lines += ("{0}Byproduct materials: {1}" -f $HeadingPrefix, (Get-PreviewListText -Items $bpMaterials))
            }

            $bpIngredients = @((Get-ObjectProperty -Object $byProducts -Name 'ingredients' -Default @()))
            if ($bpIngredients.Count -gt 0) {
                $lines += ("{0}Byproduct ingredients: {1}" -f $HeadingPrefix, (Get-PreviewListText -Items $bpIngredients))
            }
        }
    }

    return $lines
}

function Get-MenuOverviewText {
    param($Node)

    $lines = New-LineBuffer
    $children = @($Node.Children)
    $menuCount = @($children | Where-Object { $_.Kind -eq "menu" }).Count
    $leafCount = @($children | Where-Object { $_.Kind -in @("record", "file") }).Count

    if ($Node.DetailKind -eq "home") {
        Add-Section -Lines $lines -Title "Overview" -BodyLines @(
            "This browser now works like an app shell instead of a file tree.",
            "Use the left rail to move through data domains, datasets, groups, and leaf records.",
            "When a submenu opens, the right pane shows an overview until you pick an item."
        )

        $sectionLines = @()
        foreach ($child in $children) {
            if ($child.Kind -eq "placeholder") {
                continue
            }

            $sectionLines += ("{0} - {1}" -f $child.Title, $child.Description)
        }

        Add-Section -Lines $lines -Title "Available Sections" -BodyLines $sectionLines
        return (Join-Lines -Lines $lines)
    }

    $overviewLines = @(
        "Menu type: $($Node.DetailKind)",
        "Submenus: $menuCount",
        "Leaf items: $leafCount"
    )

    if ($Node.Metadata.ContainsKey("RecordCount")) {
        $overviewLines += "Dataset records: $($Node.Metadata.RecordCount)"
    }

    if (-not [string]::IsNullOrWhiteSpace($Node.Description)) {
        $overviewLines += "Notes: $($Node.Description)"
    }

    Add-Section -Lines $lines -Title "Overview" -BodyLines $overviewLines

    $optionLines = @()
    foreach ($child in ($children | Select-Object -First 12)) {
        if ($child.Kind -eq "placeholder") {
            $optionLines += $child.Title
            continue
        }

        $prefix = if ($child.Kind -eq "menu") { ">" } else { "-" }
        $optionLines += ("{0} {1}" -f $prefix, $child.Title)
    }

    if ($children.Count -gt 12) {
        $optionLines += "... and $($children.Count - 12) more"
    }

    Add-Section -Lines $lines -Title "Visible Options" -BodyLines $optionLines

    if ($Node.DetailKind -eq "dataset") {
        Add-Section -Lines $lines -Title "Interaction" -BodyLines @(
            "Selecting a submenu on the left drills into that group.",
            "Selecting a record keeps the current menu visible and updates this detail pane."
        )
    }

    return (Join-Lines -Lines $lines)
}

function Get-WorkplaceDetailText {
    param($Node)

    $record = $Node.Record
    $tierProfile = Get-ObjectProperty -Object $record -Name 'tierProfile' -Default $null
    $progression = Get-ObjectProperty -Object $record -Name 'progressionProfile' -Default $null
    $workforce = Get-ObjectProperty -Object $record -Name 'workforceProfile' -Default $null
    $ioProfile = Get-ObjectProperty -Object $record -Name 'ioProfile' -Default $null
    $upgradesProfile = Get-ObjectProperty -Object $record -Name 'upgradesProfile' -Default $null

    $lines = New-LineBuffer
    $tiers = @((Get-ObjectProperty -Object $progression -Name 'tiers' -Default @()))
    $jobs = @((Get-ObjectProperty -Object $workforce -Name 'jobs' -Default @()))
    $inputs = @((Get-ObjectProperty -Object $ioProfile -Name 'inputs' -Default @()))
    $outputs = @((Get-ObjectProperty -Object $ioProfile -Name 'outputs' -Default @()))
    $upgrades = @((Get-ObjectProperty -Object $upgradesProfile -Name 'availableUpgrades' -Default @()))

    $recommendedStaffing = 0.0
    $recommendedOutputIndex = 0.0
    $jobMaxCoverage = 0.0
    $progressionFamily = ($null -eq $tierProfile -and $tiers.Count -gt 0)
    foreach ($job in $jobs) {
        $recommendedStaffing += [double](Get-ObjectProperty -Object $job -Name 'recommendedWorkers' -Default 0)
        $recommendedOutputIndex += ([double](Get-ObjectProperty -Object $job -Name 'recommendedWorkers' -Default 0) * [double](Get-ObjectProperty -Object $job -Name 'baseOutputPerWorker' -Default 0))
        $jobMaxCoverage += [double](Get-ObjectProperty -Object $job -Name 'maxWorkers' -Default 0)
    }

    $snapshotLines = @(
        "Facility ID: $(Get-ObjectProperty -Object $record -Name 'id' -Default '')",
        "Role: $(Get-ObjectProperty -Object $record -Name 'category' -Default '')",
        "{0}: {1}" -f $(if ($progressionFamily) { 'Labor slots (family ceiling)' } else { 'Base labor slots' }), (Format-Number -Value (Get-ObjectProperty -Object $record -Name 'laborSlots' -Default $null)),
        "{0}: {1}" -f $(if ($progressionFamily) { 'Max concurrent workers (family ceiling)' } else { 'Max concurrent workers' }), (Format-Number -Value (Get-ObjectProperty -Object $workforce -Name 'maxConcurrentWorkers' -Default $null)),
        "Work cycle: $(Format-Number -Value (Get-ObjectProperty -Object $ioProfile -Name 'workCycleHours' -Default $null)) hours",
        "Consumes: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $record -Name 'inputTags' -Default @()))",
        "Produces: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $record -Name 'outputTags' -Default @()))"
    )

    if ($null -ne $tierProfile) {
        $snapshotLines += "Base form: tier $((Get-ObjectProperty -Object $tierProfile -Name 'tier' -Default '')) - $((Get-ObjectProperty -Object $tierProfile -Name 'tierLabel' -Default ''))"
        $snapshotLines += "Track: $((Get-ObjectProperty -Object $tierProfile -Name 'trackId' -Default '')) | form: $((Get-ObjectProperty -Object $tierProfile -Name 'facilityForm' -Default '')) | tech: $((Get-ObjectProperty -Object $tierProfile -Name 'techLevel' -Default ''))"
    }
    elseif ($progressionFamily) {
        $snapshotLines += "Unified workplace family: yes"
        $snapshotLines += "Tier range: 1-$((Get-ObjectProperty -Object $progression -Name 'maxTier' -Default '')) | entry represents the full upgrade line"
    }

    Add-Section -Lines $lines -Title "Facility Snapshot" -BodyLines $snapshotLines

    $laborLines = @(
        "Assigned / Available / Max labor: not simulated / $(Format-Number -Value (Get-ObjectProperty -Object $workforce -Name 'maxConcurrentWorkers' -Default $null)) / $(Format-Number -Value (Get-ObjectProperty -Object $record -Name 'laborSlots' -Default $null))",
        "Recommended staffing: $(Format-Number -Value $recommendedStaffing)",
        "Job coverage ceiling: $(Format-Number -Value $jobMaxCoverage)",
        "Recommended output index: $(Format-Number -Value $recommendedOutputIndex)",
        "Installed upgrades: not simulated in browser"
    )
    Add-Section -Lines $lines -Title "Labor And Throughput" -BodyLines $laborLines

    $toolTags = @()
    $highestToolTier = 0
    $jobLines = @()
    foreach ($job in $jobs) {
        $toolRequirements = Get-ObjectProperty -Object $job -Name 'toolRequirements' -Default $null
        $jobMinimumTier = [int](Get-ObjectProperty -Object $toolRequirements -Name 'minimumToolTier' -Default 0)
        if ($jobMinimumTier -gt $highestToolTier) {
            $highestToolTier = $jobMinimumTier
        }

        foreach ($tag in @((Get-ObjectProperty -Object $toolRequirements -Name 'requiredToolTags' -Default @()))) {
            $toolTags += [string]$tag
        }

        $jobLines += ("{0} ({1})" -f (Get-ObjectProperty -Object $job -Name 'jobId' -Default ''), (Get-ObjectProperty -Object $job -Name 'role' -Default ''))
        $jobLines += ("  staffing: min {0} | recommended {1} | max {2} | tier {3}" -f `
                (Format-Number -Value (Get-ObjectProperty -Object $job -Name 'minWorkers' -Default $null)), `
                (Format-Number -Value (Get-ObjectProperty -Object $job -Name 'recommendedWorkers' -Default $null)), `
                (Format-Number -Value (Get-ObjectProperty -Object $job -Name 'maxWorkers' -Default $null)), `
                (Format-Number -Value (Get-ObjectProperty -Object $job -Name 'requiredTier' -Default $null)))
        $jobLines += ("  output/worker: {0} | diminishing starts at {1} | factor {2}" -f `
                (Format-Number -Value (Get-ObjectProperty -Object $job -Name 'baseOutputPerWorker' -Default $null)), `
                (Format-Number -Value (Get-ObjectProperty -Object $job -Name 'diminishingStartsAt' -Default $null)), `
                (Format-Number -Value (Get-ObjectProperty -Object $job -Name 'diminishingFactor' -Default $null)))

        $jobUnlocks = @((Get-ObjectProperty -Object $job -Name 'unlocks' -Default @()))
        if ($jobUnlocks.Count -gt 0) {
            $jobLines += ("  unlocks: {0}" -f (Get-PreviewListText -Items $jobUnlocks))
        }

        $jobLines += ("  tools: {0}" -f (Get-ToolRequirementSummary -ToolRequirements $toolRequirements))
    }

    $toolLines = @(
        "Distinct tool tags: $(Get-PreviewListText -Items ($toolTags | Sort-Object -Unique))",
        "Highest minimum tool tier: $(Format-Number -Value $highestToolTier)"
    ) + $jobLines
    Add-Section -Lines $lines -Title "Workforce And Tools" -BodyLines $toolLines

    $inputLines = @()
    foreach ($input in $inputs) {
        $inputLines += (Get-IoLine -Entry $input -QuantityProperty "quantityPerCycle" -TypeProperty "consumptionType")
    }
    Add-Section -Lines $lines -Title "Production Inputs" -BodyLines $inputLines

    $outputLines = @()
    foreach ($output in $outputs) {
        $outputLines += (Get-IoLine -Entry $output -QuantityProperty "quantityPerCycle" -TypeProperty "productionType")
    }
    Add-Section -Lines $lines -Title "Production Outputs" -BodyLines $outputLines

    $tierLines = @()
    if ($tiers.Count -gt 0) {
        $tierLines += "Maximum facility tier: $(Format-Number -Value (Get-ObjectProperty -Object $progression -Name 'maxTier' -Default $null))"
        foreach ($tier in $tiers) {
            $tierLines += ("Tier {0}: {1}" -f (Format-Number -Value (Get-ObjectProperty -Object $tier -Name 'tier' -Default $null)), (Get-ObjectProperty -Object $tier -Name 'tierLabel' -Default ''))
            $tierLines += ("  benefits: throughput x{0} | variant slots {1} | switch labor {2} | power {3}" -f `
                    (Format-Number -Value (Get-ObjectProperty -Object $tier -Name 'throughputMultiplier' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $tier -Name 'variantSlots' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $tier -Name 'switchLaborCost' -Default $null)), `
                    (Get-ObjectProperty -Object $tier -Name 'powerMode' -Default ''))

            $tierLines += ("  staffing: labor slots {0} | worker cap {1} | upgrade slots {2}" -f `
                    (Format-Number -Value (Get-ObjectProperty -Object $tier -Name 'laborSlots' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $tier -Name 'maxConcurrentWorkers' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $tier -Name 'upgradeSlots' -Default $null)))

            $profileBits = @()
            $facilityForm = Get-ObjectProperty -Object $tier -Name 'facilityForm' -Default ''
            $ownershipModel = Get-ObjectProperty -Object $tier -Name 'ownershipModel' -Default ''
            $techLevel = Get-ObjectProperty -Object $tier -Name 'techLevel' -Default ''
            $wealthBand = Get-ObjectProperty -Object $tier -Name 'wealthBand' -Default ''
            if (-not [string]::IsNullOrWhiteSpace([string]$facilityForm)) { $profileBits += ("form {0}" -f $facilityForm) }
            if (-not [string]::IsNullOrWhiteSpace([string]$ownershipModel)) { $profileBits += ("ownership {0}" -f $ownershipModel) }
            if (-not [string]::IsNullOrWhiteSpace([string]$techLevel)) { $profileBits += ("tech {0}" -f $techLevel) }
            if (-not [string]::IsNullOrWhiteSpace([string]$wealthBand)) { $profileBits += ("wealth {0}" -f $wealthBand) }
            if ($profileBits.Count -gt 0) {
                $tierLines += ("  profile: {0}" -f ($profileBits -join ' | '))
            }

            $variantUnlocks = @((Get-ObjectProperty -Object $tier -Name 'variantUnlocks' -Default @()))
            if ($variantUnlocks.Count -gt 0) {
                $tierLines += ("  unlocks: {0}" -f (Get-PreviewListText -Items $variantUnlocks))
            }

            $weights = @((Get-ObjectProperty -Object $tier -Name 'inputLaborWeights' -Default @()))
            if ($weights.Count -gt 0) {
                $tierLines += ("  favored workloads: {0}" -f (Get-InputLaborWeightSummary -Weights $weights))
            }

            $requiredUpgradeIds = @((Get-ObjectProperty -Object $tier -Name 'requiredUpgradeIds' -Default @()))
            if ($requiredUpgradeIds.Count -gt 0) {
                $tierLines += ("  advancement requires: {0}" -f (Get-PreviewListText -Items $requiredUpgradeIds))
            }

            $jobUnlocks = @((Get-ObjectProperty -Object $tier -Name 'jobUnlocks' -Default @()))
            if ($jobUnlocks.Count -gt 0) {
                $tierLines += ("  new jobs: {0}" -f (Get-PreviewListText -Items $jobUnlocks))
            }

            $outputUnlocks = @((Get-ObjectProperty -Object $tier -Name 'outputUnlocks' -Default @()))
            if ($outputUnlocks.Count -gt 0) {
                $tierLines += ("  new outputs: {0}" -f (Get-PreviewListText -Items $outputUnlocks))
            }

            $districtTags = @((Get-ObjectProperty -Object $tier -Name 'districtTags' -Default @()))
            if ($districtTags.Count -gt 0) {
                $tierLines += ("  districts: {0}" -f (Get-PreviewListText -Items $districtTags))
            }

            $advancementNotes = Get-ObjectProperty -Object $tier -Name 'advancementNotes' -Default ''
            if (-not [string]::IsNullOrWhiteSpace([string]$advancementNotes)) {
                $tierLines += ("  notes: {0}" -f $advancementNotes)
            }
        }
    }
    else {
        $tierLines += "No multi-tier progression profile is stored on this workplace."
    }
    Add-Section -Lines $lines -Title "Tier Ladder" -BodyLines $tierLines

    $upgradeLines = @()
    if ($null -ne $upgradesProfile) {
        $upgradeLines += "Possible upgrades: $(Format-Number -Value (Get-ObjectProperty -Object $upgradesProfile -Name 'upgradeSlots' -Default $null)) slots"
        foreach ($upgrade in $upgrades) {
            $upgradeLines += ("{0}" -f (Get-ObjectProperty -Object $upgrade -Name 'name' -Default ''))
            $upgradeLines += ("  category: {0}" -f (Get-ObjectProperty -Object $upgrade -Name 'category' -Default ''))

            $requiredUpgradeIds = @((Get-ObjectProperty -Object $upgrade -Name 'requiredUpgradeIds' -Default @()))
            if ($requiredUpgradeIds.Count -gt 0) {
                $upgradeLines += ("  requires: {0}" -f (Get-PreviewListText -Items $requiredUpgradeIds))
            }
            else {
                $upgradeLines += "  requires: none"
            }

            $description = Get-ObjectProperty -Object $upgrade -Name 'description' -Default ''
            if (-not [string]::IsNullOrWhiteSpace([string]$description)) {
                $upgradeLines += ("  purpose: {0}" -f $description)
            }
            $upgradeLines += ("  benefits: {0}" -f (Get-UpgradeEffectSummary -Effects (Get-ObjectProperty -Object $upgrade -Name 'effects' -Default $null)))
        }

        $tierUpgradeRequirements = @((Get-ObjectProperty -Object $upgradesProfile -Name 'tierUpgradeRequirements' -Default @()))
        $progressionRequirements = @()
        foreach ($tier in $tiers) {
            $requiredUpgradeIds = @((Get-ObjectProperty -Object $tier -Name 'requiredUpgradeIds' -Default @()))
            $advancementNotes = Get-ObjectProperty -Object $tier -Name 'advancementNotes' -Default ''
            if ($requiredUpgradeIds.Count -gt 0 -or -not [string]::IsNullOrWhiteSpace([string]$advancementNotes)) {
                $progressionRequirements += [pscustomobject]@{
                    tier = Get-ObjectProperty -Object $tier -Name 'tier' -Default ''
                    label = Get-ObjectProperty -Object $tier -Name 'tierLabel' -Default ''
                    requiredUpgradeIds = $requiredUpgradeIds
                    notes = $advancementNotes
                }
            }
        }

        if ($progressionRequirements.Count -gt 0) {
            $upgradeLines += "Tier advancement requirements:"
            foreach ($requirement in $progressionRequirements) {
                $upgradeLines += ("  tier {0}: {1}" -f (Format-Number -Value $requirement.tier), $requirement.label)
                if (@($requirement.requiredUpgradeIds).Count -gt 0) {
                    $upgradeLines += ("  requires: {0}" -f (Get-PreviewListText -Items $requirement.requiredUpgradeIds))
                }
                else {
                    $upgradeLines += "  requires: none explicitly stored"
                }

                if (-not [string]::IsNullOrWhiteSpace([string]$requirement.notes)) {
                    $upgradeLines += ("  notes: {0}" -f $requirement.notes)
                }
            }
        }
        elseif ($tierUpgradeRequirements.Count -gt 0) {
            $upgradeLines += "Tier advancement requirements:"
            foreach ($requirement in $tierUpgradeRequirements) {
                $upgradeLines += ("  target: {0}" -f (Get-ObjectProperty -Object $requirement -Name 'targetWorkplaceId' -Default ''))
                $upgradeLines += ("  requires: {0}" -f (Get-PreviewListText -Items (Get-ObjectProperty -Object $requirement -Name 'requiredUpgradeIds' -Default @())))
                $notes = Get-ObjectProperty -Object $requirement -Name 'notes' -Default ''
                if (-not [string]::IsNullOrWhiteSpace([string]$notes)) {
                    $upgradeLines += ("  notes: {0}" -f $notes)
                }
            }
        }
        else {
            $upgradeLines += "Tier advancement requirements: none explicitly stored on this record."
        }
    }
    Add-Section -Lines $lines -Title "Upgrade Path" -BodyLines $upgradeLines

    $chainLines = @()
    $workplaceId = Get-ObjectProperty -Object $record -Name 'id' -Default ''
    if (-not [string]::IsNullOrWhiteSpace([string]$workplaceId) -and $script:workplaceChainIndex.ContainsKey($workplaceId)) {
        foreach ($chain in (@($script:workplaceChainIndex[$workplaceId]) | Sort-Object { Get-ObjectProperty -Object $_ -Name 'id' -Default '' })) {
            $chainLines += ("{0} -> {1}" -f (Get-ObjectProperty -Object $chain -Name 'id' -Default ''), (Get-ObjectProperty -Object $chain -Name 'primaryOutput' -Default ''))
            $variantConfig = Get-ObjectProperty -Object $chain -Name 'variantConfig' -Default $null
            if ($null -ne $variantConfig) {
                $chainLines += ("  service style: {0} | default: {1}" -f `
                        (Get-ObjectProperty -Object $variantConfig -Name 'variantFlag' -Default ''), `
                        (Get-ObjectProperty -Object $variantConfig -Name 'defaultVariant' -Default ''))
            }
        }
    }
    else {
        $chainLines += "No related production chains indexed for this workplace."
    }

    Add-Section -Lines $lines -Title "Related Production Chains" -BodyLines $chainLines
    return (Join-Lines -Lines $lines)
}

function Get-FloraDetailText {
    param($Node)

    $record = $Node.Record
    $template = Get-ObjectProperty -Object $record -Name 'template' -Default $null
    $identity = Get-ObjectProperty -Object $template -Name 'identity' -Default $null
    $harvestTemplate = Get-ObjectProperty -Object $template -Name 'harvest' -Default $null
    $ecology = Get-ObjectProperty -Object $template -Name 'ecology' -Default $null
    $agronomy = Get-ObjectProperty -Object $template -Name 'agronomy' -Default $null
    $domestication = Get-ObjectProperty -Object $template -Name 'domestication' -Default $null
    $lifecycleTemplate = Get-ObjectProperty -Object $template -Name 'lifecycle' -Default $null
    $lines = New-LineBuffer

    $fieldGuideLines = @()
    $fieldGuideLines += ("{0} is a {1} with a {2} lifecycle." -f `
            (Get-ObjectProperty -Object $record -Name 'name' -Default 'This flora entry'), `
            (Get-ObjectProperty -Object $identity -Name 'type' -Default (Get-ObjectProperty -Object $record -Name 'type' -Default 'plant')), `
            (Get-ObjectProperty -Object $record -Name 'lifecycle' -Default 'unknown'))
    $fieldGuideLines += ("Wild value: {0} {1}" -f `
            (Format-Number -Value (Get-ObjectProperty -Object $record -Name 'baseValue' -Default $null)), `
            (Get-ObjectProperty -Object $record -Name 'currencyId' -Default ''))
    $fieldGuideLines += ("Known habitats: {0}" -f (Get-PreviewListText -Items (Get-ObjectProperty -Object $record -Name 'habitatIds' -Default @())))
    Add-Section -Lines $lines -Title "Field Guide" -BodyLines $fieldGuideLines

    $habitatLines = @(
        "Climate range: $(Get-ObjectProperty -Object $ecology -Name 'climateRange' -Default 'n/a')",
        "Water need: $(Get-ObjectProperty -Object $ecology -Name 'waterNeed' -Default 'n/a')",
        "Light need: $(Get-ObjectProperty -Object $ecology -Name 'lightNeed' -Default 'n/a')",
        "Preferred soils: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $ecology -Name 'soilType' -Default @()))"
    )
    foreach ($biome in @((Get-ObjectProperty -Object $ecology -Name 'biomes' -Default @()) | Select-Object -First 6)) {
        $habitatLines += ("Habitat: {0} | prevalence {1}" -f `
                (Get-ObjectProperty -Object $biome -Name 'habitatId' -Default ''), `
                (Format-Number -Value (Get-ObjectProperty -Object $biome -Name 'prevalence' -Default $null)))
    }
    Add-Section -Lines $lines -Title "Habitat And Range" -BodyLines $habitatLines

    $growthLines = @(
        "Growth seasons: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $agronomy -Name 'growthSeasons' -Default @()))",
        "Planting window: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $agronomy -Name 'plantingWindow' -Default @()))",
        "Harvest window: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $agronomy -Name 'harvestWindow' -Default @()))",
        "Shed seasons: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $agronomy -Name 'shedSeasons' -Default @()))"
    )
    foreach ($stageName in @((Get-ObjectProperty -Object $lifecycleTemplate -Name 'applicableStages' -Default @()) | Select-Object -First 6)) {
        $stageData = Get-ObjectProperty -Object (Get-ObjectProperty -Object $lifecycleTemplate -Name 'stages' -Default $null) -Name $stageName -Default $null
        $duration = Get-ObjectProperty -Object (Get-ObjectProperty -Object $stageData -Name 'duration' -Default $null) -Name 'baseDurationDays' -Default $null
        $growthLines += ("Stage {0}: ~{1} days | triggers {2}" -f `
                $stageName, `
                (Format-Number -Value $duration), `
                (Get-PreviewListText -Items (Get-ObjectProperty -Object $stageData -Name 'transitionTriggers' -Default @())))
    }
    Add-Section -Lines $lines -Title "Growth Cycle" -BodyLines $growthLines

    $harvestLines = @(
        "Active harvest: $(Get-YesNoText -Value (Get-ObjectProperty -Object (Get-ObjectProperty -Object $record -Name 'harvest' -Default $null) -Name 'active' -Default $false))",
        "Passive harvest: $(Get-YesNoText -Value (Get-ObjectProperty -Object (Get-ObjectProperty -Object $record -Name 'harvest' -Default $null) -Name 'passive' -Default $false))",
        "Yield cap: $(Format-Number -Value (Get-ObjectProperty -Object (Get-ObjectProperty -Object $record -Name 'harvest' -Default $null) -Name 'yieldCap' -Default $null))",
        "Harvestable parts: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $harvestTemplate -Name 'harvestableParts' -Default @()))",
        "Required tools: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $harvestTemplate -Name 'tools' -Default @()))"
    )
    $harvestLines += (Get-HarvestOutputLines -RawOutput (Get-ObjectProperty -Object (Get-ObjectProperty -Object $harvestTemplate -Name 'activeHarvest' -Default $null) -Name 'rawOutput' -Default $null) -HeadingPrefix "Active harvest - ")
    $harvestLines += (Get-HarvestOutputLines -RawOutput (Get-ObjectProperty -Object (Get-ObjectProperty -Object $harvestTemplate -Name 'passiveHarvest' -Default $null) -Name 'rawOutput' -Default $null) -HeadingPrefix "Passive harvest - ")
    Add-Section -Lines $lines -Title "Harvest And Uses" -BodyLines $harvestLines

    $rotationBenefit = Get-ObjectProperty -Object $agronomy -Name 'rotationBenefit' -Default $null
    $cultivationLines = @(
        "Cultivable: $(Get-YesNoText -Value (Get-ObjectProperty -Object $domestication -Name 'cultivable' -Default $false))",
        "Domestic variant: $(Get-ObjectProperty -Object $domestication -Name 'domesticVariant' -Default 'none')",
        "Domestication yield modifier: $(Format-Number -Value (Get-ObjectProperty -Object $domestication -Name 'domesticationYieldModifier' -Default $null))",
        "Companion crops: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $agronomy -Name 'companionCrops' -Default @()))",
        "Antagonistic crops: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $agronomy -Name 'antagonisticCrops' -Default @()))",
        "Infrastructure: irrigation $(Get-YesNoText -Value (Get-ObjectProperty -Object (Get-ObjectProperty -Object $domestication -Name 'infrastructure' -Default $null) -Name 'irrigation' -Default $false)), greenhouse $(Get-YesNoText -Value (Get-ObjectProperty -Object (Get-ObjectProperty -Object $domestication -Name 'infrastructure' -Default $null) -Name 'greenhouse' -Default $false)), raised beds $(Get-YesNoText -Value (Get-ObjectProperty -Object (Get-ObjectProperty -Object $domestication -Name 'infrastructure' -Default $null) -Name 'raisedBeds' -Default $false))"
    )
    if ($null -ne $rotationBenefit) {
        $cultivationLines += ("Rotation benefit: soil {0} | fertilization {1} | survivability {2} | pest interaction {3}" -f `
                (Format-Number -Value (Get-ObjectProperty -Object $rotationBenefit -Name 'soilQuality' -Default $null)), `
                (Format-Number -Value (Get-ObjectProperty -Object $rotationBenefit -Name 'fertilizationEffect' -Default $null)), `
                (Format-Number -Value (Get-ObjectProperty -Object $rotationBenefit -Name 'survivability' -Default $null)), `
                (Format-Number -Value (Get-ObjectProperty -Object $rotationBenefit -Name 'pestInteraction' -Default $null)))
    }
    Add-Section -Lines $lines -Title "Cultivation" -BodyLines $cultivationLines

    return (Join-Lines -Lines $lines)
}

function Get-FaunaDetailText {
    param($Node)

    $record = $Node.Record
    $template = Get-ObjectProperty -Object $record -Name 'template' -Default $null
    $identity = Get-ObjectProperty -Object $template -Name 'identity' -Default $null
    $ecology = Get-ObjectProperty -Object $template -Name 'ecology' -Default $null
    $territory = Get-ObjectProperty -Object $ecology -Name 'territory' -Default $null
    $reproduction = Get-ObjectProperty -Object $template -Name 'reproduction' -Default $null
    $output = Get-ObjectProperty -Object $template -Name 'output' -Default $null
    $domestication = Get-ObjectProperty -Object $template -Name 'domestication' -Default $null
    $population = Get-ObjectProperty -Object $domestication -Name 'population' -Default $null
    $activity = Get-ObjectProperty -Object $template -Name 'activity' -Default $null
    $foodChain = Get-ObjectProperty -Object $template -Name 'foodChain' -Default $null
    $lines = New-LineBuffer

    $entryLines = @()
    $entryLines += ("{0} is a {1} {2} with {3} danger and a {4} diet." -f `
            (Get-ObjectProperty -Object $record -Name 'name' -Default 'This fauna entry'), `
            (Get-ObjectProperty -Object $identity -Name 'sizeClass' -Default 'unknown-sized'), `
            (Get-ObjectProperty -Object $identity -Name 'type' -Default (Get-ObjectProperty -Object $record -Name 'type' -Default 'creature')), `
            (Get-ObjectProperty -Object $identity -Name 'dangerClass' -Default (Get-ObjectProperty -Object $record -Name 'dangerClass' -Default 'unknown')), `
            (Get-ObjectProperty -Object $identity -Name 'dietType' -Default (Get-ObjectProperty -Object $record -Name 'diet' -Default 'unknown')))
    $entryLines += ("Best known habitats: {0}" -f (Get-PreviewListText -Items (Get-ObjectProperty -Object $record -Name 'habitatIds' -Default @())))
    $entryLines += ("Gameplay value: {0} {1}" -f `
            (Format-Number -Value (Get-ObjectProperty -Object $record -Name 'baseValue' -Default $null)), `
            (Get-ObjectProperty -Object $record -Name 'currencyId' -Default ''))
    Add-Section -Lines $lines -Title "Bestiary Entry" -BodyLines $entryLines

    $fieldLines = @(
        "Aliases: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $record -Name 'aliases' -Default @()))",
        "Behavior tags: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $identity -Name 'behavior' -Default @()))",
        "Domesticatable: $(Get-YesNoText -Value (Get-ObjectProperty -Object $identity -Name 'domesticatable' -Default (Get-ObjectProperty -Object $record -Name 'domesticatable' -Default $false)))",
        "Mountable: $(Get-YesNoText -Value (Get-ObjectProperty -Object $identity -Name 'mountable' -Default $false))",
        "Active time: $(Get-ObjectProperty -Object $activity -Name 'activeTime' -Default 'n/a')",
        "Hibernation: $(Get-ObjectProperty -Object $activity -Name 'hibernationPeriod' -Default 'n/a')"
    )
    Add-Section -Lines $lines -Title "Field Notes" -BodyLines $fieldLines

    $habitatLines = @(
        "Climate range: $(Get-ObjectProperty -Object $territory -Name 'climateRange' -Default 'n/a')",
        "Movement pattern: $(Get-ObjectProperty -Object $territory -Name 'movement' -Default 'n/a')",
        "Territory size: $(Get-ObjectProperty -Object $territory -Name 'size' -Default 'n/a')",
        "Water dependent: $(Get-YesNoText -Value (Get-ObjectProperty -Object $territory -Name 'waterDependency' -Default $false))",
        "Hydration need: $(Get-ObjectProperty -Object $territory -Name 'hydrationNeed' -Default 'n/a')"
    )
    foreach ($biome in @((Get-ObjectProperty -Object $ecology -Name 'biomes' -Default @()) | Select-Object -First 8)) {
        $habitatLines += ("Habitat: {0} | {1} | prevalence {2} | terrain {3}" -f `
                (Get-ObjectProperty -Object $biome -Name 'habitatId' -Default ''), `
                (Get-ObjectProperty -Object $biome -Name 'preference' -Default 'n/a'), `
                (Format-Number -Value (Get-ObjectProperty -Object $biome -Name 'prevalence' -Default $null)), `
                (Get-ObjectProperty -Object $biome -Name 'terrainPreference' -Default 'n/a'))
    }
    Add-Section -Lines $lines -Title "Habitat And Territory" -BodyLines $habitatLines

    $foodBehaviors = Get-ObjectProperty -Object $foodChain -Name 'foodBehaviors' -Default $null
    $foodTargets = Get-ObjectProperty -Object $foodChain -Name 'foodTargets' -Default $null
    $behaviorLines = @(
        "Predator / prey / scavenger / apex: {0} / {1} / {2} / {3}" -f `
            (Get-YesNoText -Value (Get-ObjectProperty -Object $foodBehaviors -Name 'predator' -Default $false)), `
            (Get-YesNoText -Value (Get-ObjectProperty -Object $foodBehaviors -Name 'prey' -Default $false)), `
            (Get-YesNoText -Value (Get-ObjectProperty -Object $foodBehaviors -Name 'scavenger' -Default $false)), `
            (Get-YesNoText -Value (Get-ObjectProperty -Object $foodBehaviors -Name 'apex' -Default $false)),
        "Favored fauna prey: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $foodTargets -Name 'faunaTypes' -Default @()))",
        "Favored flora targets: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $foodTargets -Name 'floraTypes' -Default @()))",
        "Specific fauna targets: $(Get-PreviewListText -Items (Get-ObjectProperty -Object (Get-ObjectProperty -Object $foodTargets -Name 'specificTargets' -Default $null) -Name 'fauna' -Default @()))",
        "Specific flora targets: $(Get-PreviewListText -Items (Get-ObjectProperty -Object (Get-ObjectProperty -Object $foodTargets -Name 'specificTargets' -Default $null) -Name 'flora' -Default @()))"
    )
    Add-Section -Lines $lines -Title "Behavior And Diet" -BodyLines $behaviorLines

    $reproductionLines = @(
        "Lifecycle type: $(Get-ObjectProperty -Object (Get-ObjectProperty -Object $template -Name 'lifecycle' -Default $null) -Name 'type' -Default 'n/a')",
        "Lifecycle stages: $(Get-PreviewListText -Items (Get-ObjectProperty -Object (Get-ObjectProperty -Object $template -Name 'lifecycle' -Default $null) -Name 'applicableStages' -Default @()))",
        "Breeding seasons: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $reproduction -Name 'breedingSeasons' -Default @()))",
        "Reproduction type: $(Get-ObjectProperty -Object $reproduction -Name 'reproductionType' -Default 'n/a')",
        "Gestation / incubation: $(Format-Number -Value (Get-ObjectProperty -Object $reproduction -Name 'gestationIncubationTimeDays' -Default $null)) days",
        "Fertile age: $(Format-Number -Value (Get-ObjectProperty -Object $reproduction -Name 'fertileAgeDays' -Default $null)) days",
        "Offspring per cycle: $(Format-Number -Value (Get-ObjectProperty -Object $reproduction -Name 'offspringPerBreedingCycle' -Default $null))",
        "Offspring survival: $(Format-Number -Value (Get-ObjectProperty -Object $reproduction -Name 'offspringSurvivalRate' -Default $null))",
        "Annual reproduction ratio: $(Format-Number -Value (Get-ObjectProperty -Object $reproduction -Name 'annualReproductionRatio' -Default $null))"
    )
    Add-Section -Lines $lines -Title "Lifecycle And Reproduction" -BodyLines $reproductionLines

    $slaughterOutput = Get-ObjectProperty -Object $output -Name 'slaughterOutput' -Default $null
    $slaughterProducts = Get-ObjectProperty -Object $slaughterOutput -Name 'products' -Default $null
    $resourceLines = @(
        "Prime harvest age: $(Format-Number -Value (Get-ObjectProperty -Object $slaughterOutput -Name 'primeAgeDays' -Default $null)) days",
        "Cull age: $(Format-Number -Value (Get-ObjectProperty -Object $slaughterOutput -Name 'cullAgeDays' -Default $null)) days",
        "Slaughter ingredients: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $slaughterProducts -Name 'ingredients' -Default @()))",
        "Slaughter byproducts: $(Get-PreviewListText -Items (Get-ObjectProperty -Object $slaughterProducts -Name 'byproducts' -Default @()))",
        "Passive output window: $(Get-ObjectProperty -Object (Get-ObjectProperty -Object $output -Name 'passiveOutput' -Default $null) -Name 'producerWindow' -Default 'n/a')",
        "Passive producer sex: $(Get-ObjectProperty -Object (Get-ObjectProperty -Object $output -Name 'passiveOutput' -Default $null) -Name 'producerSex' -Default 'n/a')"
    )
    Add-Section -Lines $lines -Title "Resources" -BodyLines $resourceLines

    $infraModifiers = Get-ObjectProperty -Object $template -Name 'infrastructureModifiers' -Default $null
    $husbandryLines = @(
        "Domestic infrastructure enabled: $(Get-YesNoText -Value (Get-ObjectProperty -Object (Get-ObjectProperty -Object $domestication -Name 'infrastructure' -Default $null) -Name 'enabled' -Default $false))",
        "Infrastructure footprint: $(Format-Number -Value (Get-ObjectProperty -Object (Get-ObjectProperty -Object $domestication -Name 'infrastructure' -Default $null) -Name 'infrastructureSize' -Default $null))",
        "Population cap: $(Format-Number -Value (Get-ObjectProperty -Object $population -Name 'populationCap' -Default $null))",
        "Population ratio: $(Format-Number -Value (Get-ObjectProperty -Object $population -Name 'populationRatio' -Default $null))",
        "Stable slaughter rate at cap: $(Format-Number -Value (Get-ObjectProperty -Object $population -Name 'stableSeasonSlaughterRateAtCap' -Default $null))",
        "Passive yield bonus at cap: $(Format-Number -Value (Get-ObjectProperty -Object $population -Name 'passiveOutputYieldBonus' -Default $null))",
        "Feed diversity bonus: $(Format-Number -Value (Get-ObjectProperty -Object $infraModifiers -Name 'feedDiversity' -Default $null))",
        "Hydration bonus: $(Format-Number -Value (Get-ObjectProperty -Object $infraModifiers -Name 'hydrationBonus' -Default $null))",
        "Fertility modifier: $(Format-Number -Value (Get-ObjectProperty -Object $infraModifiers -Name 'fertilityModifier' -Default $null))"
    )
    Add-Section -Lines $lines -Title "Husbandry" -BodyLines $husbandryLines

    return (Join-Lines -Lines $lines)
}

function Get-InfrastructureDetailText {
    param($Node)

    $record = $Node.Record
    $construction = Get-ObjectProperty -Object $record -Name 'constructionPolicy' -Default $null
    $progression = Get-ObjectProperty -Object $record -Name 'progressionProfile' -Default $null
    $serviceOutputs = @((Get-ObjectProperty -Object $record -Name 'serviceOutputs' -Default @()))
    $tiers = @((Get-ObjectProperty -Object $progression -Name 'tiers' -Default @()) | Sort-Object { Get-ObjectProperty -Object $_ -Name 'tier' -Default 0 })
    $lines = New-LineBuffer

    Add-Section -Lines $lines -Title "Overview" -BodyLines @(
        "ID: $(Get-ObjectProperty -Object $record -Name 'id' -Default '')",
        "Category: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'category' -Default ''))",
        "Infrastructure type: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'infrastructureType' -Default ''))",
        "Description: $(Get-ObjectProperty -Object $record -Name 'description' -Default '')",
        "Stored tiers: $($tiers.Count)"
    )

    if ($null -ne $construction) {
        Add-Section -Lines $lines -Title "Construction Rules" -BodyLines @(
            "Direct build allowed: $(Get-YesNoText -Value (Get-ObjectProperty -Object $construction -Name 'directBuildAllowed' -Default $false))",
            "Upgrade labor multiplier: $(Format-Number -Value (Get-ObjectProperty -Object $construction -Name 'upgradeLaborMultiplier' -Default $null))x",
            "Deconstruction labor share: $(Format-Number -Value ((Get-ObjectProperty -Object $construction -Name 'deconstructionLaborShare' -Default 0) * 100))%",
            "Policy notes: $(Get-ObjectProperty -Object $construction -Name 'notes' -Default '')"
        )
    }

    $serviceLines = @()
    foreach ($output in $serviceOutputs) {
        $serviceLines += ("{0} [{1}] - {2}" -f `
                (Get-ObjectProperty -Object $output -Name 'itemKey' -Default ''), `
                (Get-ObjectProperty -Object $output -Name 'unit' -Default ''), `
                (Get-ObjectProperty -Object $output -Name 'description' -Default ''))
    }
    Add-Section -Lines $lines -Title "Service Outputs" -BodyLines $serviceLines

    $tierLines = @()
    foreach ($tier in $tiers) {
        $tierLines += ("Tier {0} - {1}" -f `
                (Get-ObjectProperty -Object $tier -Name 'tier' -Default ''), `
                (Get-ObjectProperty -Object $tier -Name 'tierLabel' -Default ''))
        $tierLines += ("  tech level: {0}" -f (Get-ObjectProperty -Object $tier -Name 'techLevel' -Default 'n/a'))
        $tierLines += ("  technology requirements: {0}" -f (Get-PreviewListText -Items (Get-ObjectProperty -Object $tier -Name 'technologyRequirements' -Default @())))
        $tierLines += ("  direct-build labor: {0}" -f (Format-Number -Value (Get-ObjectProperty -Object $tier -Name 'laborRequirement' -Default $null)))

        $materials = @()
        foreach ($material in @((Get-ObjectProperty -Object $tier -Name 'materialRequirements' -Default @()))) {
            $materials += ("{0} x {1} {2}" -f `
                    (Get-ObjectProperty -Object $material -Name 'itemKey' -Default ''), `
                    (Format-Number -Value (Get-ObjectProperty -Object $material -Name 'quantity' -Default $null)), `
                    (Get-ObjectProperty -Object $material -Name 'unit' -Default ''))
        }
        $tierLines += ("  material requirements: {0}" -f (Format-ListText -Items $materials))
        $tierLines += ("  access requirements: {0}" -f (Get-PreviewListText -Items (Get-ObjectProperty -Object $tier -Name 'accessRequirements' -Default @())))

        foreach ($metric in @((Get-ObjectProperty -Object $tier -Name 'serviceMetrics' -Default @()))) {
            $tierLines += ("  {0}: {1}" -f `
                    (Get-ObjectProperty -Object $metric -Name 'label' -Default ''), `
                    (Get-ObjectProperty -Object $metric -Name 'valueText' -Default ''))
        }

        foreach ($benefit in @((Get-ObjectProperty -Object $tier -Name 'benefits' -Default @()))) {
            $tierLines += ("  benefit: {0}" -f $benefit)
        }

        if (Test-ObjectProperty -Object $tier -Name 'buildNotes') {
            $tierLines += ("  build notes: {0}" -f (Get-ObjectProperty -Object $tier -Name 'buildNotes' -Default ''))
        }
    }
    Add-Section -Lines $lines -Title "Tier Ladder" -BodyLines $tierLines

    return (Join-Lines -Lines $lines)
}

function Get-ProductionChainDetailText {
    param($Node)

    $record = $Node.Record
    $lines = New-LineBuffer

    $variantConfig = Get-ObjectProperty -Object $record -Name 'variantConfig' -Default $null

    $overviewLines = @(
        "ID: $(Get-ObjectProperty -Object $record -Name 'id' -Default '')",
        "Primary output: $(Get-ObjectProperty -Object $record -Name 'primaryOutput' -Default '')",
        "Byproducts: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'byProducts' -Default @()))",
        "Stage count: $(@((Get-ObjectProperty -Object $record -Name 'stages' -Default @())).Count)"
    )

    if ($null -ne $variantConfig) {
        $overviewLines += "Variant flag: $(Get-ObjectProperty -Object $variantConfig -Name 'variantFlag' -Default '')"
        $overviewLines += "Default variant: $(Get-ObjectProperty -Object $variantConfig -Name 'defaultVariant' -Default '')"
    }

    Add-Section -Lines $lines -Title "Overview" -BodyLines $overviewLines

    $stageLines = @()
    $stageIndex = 1
    foreach ($stage in @((Get-ObjectProperty -Object $record -Name 'stages' -Default @()))) {
        $stageLines += ("{0}. {1}" -f $stageIndex, $stage)
        $stageIndex += 1
    }
    Add-Section -Lines $lines -Title "Stages" -BodyLines $stageLines

    $variantLines = @()
    foreach ($variant in @((Get-ObjectProperty -Object $variantConfig -Name 'variants' -Default @()))) {
        $variantLines += ("{0}" -f (Get-ObjectProperty -Object $variant -Name 'id' -Default ''))
        $variantLines += ("  inputs: {0}" -f (Format-ListText -Items (Get-ObjectProperty -Object $variant -Name 'inputItemKeys' -Default @())))
        $variantLines += ("  output: {0}" -f (Get-ObjectProperty -Object $variant -Name 'primaryOutput' -Default ''))
        $variantLines += ("  byproducts: {0}" -f (Format-ListText -Items (Get-ObjectProperty -Object $variant -Name 'byProducts' -Default @())))
        if (Test-ObjectProperty -Object $variant -Name 'laborWeight') {
            $variantLines += ("  labor weight: {0}" -f (Format-Number -Value (Get-ObjectProperty -Object $variant -Name 'laborWeight' -Default $null)))
        }
    }

    Add-Section -Lines $lines -Title "Variants" -BodyLines $variantLines
    return (Join-Lines -Lines $lines)
}

function Get-MeatCutStandardDetailText {
    param($Node)

    $record = $Node.Record
    $lines = New-LineBuffer

    Add-Section -Lines $lines -Title "Overview" -BodyLines @(
        "ID: $(Get-ObjectProperty -Object $record -Name 'id' -Default '')",
        "Species key: $(Get-ObjectProperty -Object $record -Name 'speciesKey' -Default '')",
        "Category: $(Get-ObjectProperty -Object $record -Name 'category' -Default '')",
        "Source item: $(Get-ObjectProperty -Object $record -Name 'sourceItemKey' -Default '')",
        "Usable meat per carcass: $(Format-Number -Value (Get-ObjectProperty -Object $record -Name 'usableMeatPerCarcass' -Default $null)) $(Get-ObjectProperty -Object $record -Name 'yieldUnit' -Default '')",
        "Sausage eligible: $(Get-ObjectProperty -Object $record -Name 'sausageEligible' -Default $false)"
    )

    $bulkLines = @()
    foreach ($cut in @((Get-ObjectProperty -Object $record -Name 'bulkCuts' -Default @()))) {
        $bulkLines += ("{0} x {1}" -f (Get-ObjectProperty -Object $cut -Name 'itemKey' -Default ''), (Format-Number -Value (Get-ObjectProperty -Object $cut -Name 'portionCount' -Default $null)))
    }
    Add-Section -Lines $lines -Title "Bulk Cuts" -BodyLines $bulkLines

    $retailLines = @()
    foreach ($cut in @((Get-ObjectProperty -Object $record -Name 'retailCuts' -Default @()))) {
        $retailLines += ("{0} x {1}" -f (Get-ObjectProperty -Object $cut -Name 'itemKey' -Default ''), (Format-Number -Value (Get-ObjectProperty -Object $cut -Name 'portionCount' -Default $null)))
    }
    Add-Section -Lines $lines -Title "Retail Cuts" -BodyLines $retailLines

    $byproductLines = @()
    foreach ($byproduct in @((Get-ObjectProperty -Object $record -Name 'byproducts' -Default @()))) {
        $byproductLines += ("{0} x {1} {2}" -f `
                (Get-ObjectProperty -Object $byproduct -Name 'itemKey' -Default ''), `
                (Format-Number -Value (Get-ObjectProperty -Object $byproduct -Name 'quantity' -Default $null)), `
                (Get-ObjectProperty -Object $byproduct -Name 'unit' -Default ''))
    }
    Add-Section -Lines $lines -Title "Byproducts" -BodyLines $byproductLines

    return (Join-Lines -Lines $lines)
}

function Resolve-RegionLabel {
    param([string]$RegionId)

    foreach ($region in @($script:regionRecords)) {
        if ((Get-ObjectProperty -Object $region -Name 'id' -Default '') -eq $RegionId) {
            return (Get-ObjectProperty -Object $region -Name 'name' -Default $RegionId)
        }
    }

    return $RegionId
}

function Resolve-SettlementLabel {
    param([string]$SettlementId)

    foreach ($settlement in @($script:settlementRecords)) {
        if ((Get-ObjectProperty -Object $settlement -Name 'id' -Default '') -eq $SettlementId) {
            return (Get-ObjectProperty -Object $settlement -Name 'name' -Default $SettlementId)
        }
    }

    return $SettlementId
}

function Resolve-GuildLabel {
    param([string]$GuildType)

    foreach ($guild in @($script:guildRecords)) {
        if ((Get-ObjectProperty -Object $guild -Name 'slug' -Default '') -eq $GuildType) {
            return (Get-ObjectProperty -Object $guild -Name 'name' -Default $GuildType)
        }
    }

    return (Get-FriendlyLabel -Value $GuildType)
}

function Get-DependentSettlementsForParent {
    param([string]$ParentSettlementId)

    return @(
        $script:settlementRecords |
            Where-Object { (Get-ObjectProperty -Object $_ -Name 'parentSettlementId' -Default '') -eq $ParentSettlementId } |
            Sort-Object @{ Expression = { Get-ObjectProperty -Object $_ -Name 'populationTotal' -Default 0 }; Descending = $true }, @{ Expression = { Get-ObjectProperty -Object $_ -Name 'name' -Default '' } }
    )
}

function Get-ResolvedRegionListText {
    param(
        $RegionIds,
        [int]$MaxItems = 8
    )

    $labels = @()
    foreach ($regionId in @($RegionIds)) {
        if ([string]::IsNullOrWhiteSpace([string]$regionId)) {
            continue
        }

        $labels += (Resolve-RegionLabel -RegionId ([string]$regionId))
    }

    return (Get-PreviewListText -Items $labels -MaxItems $MaxItems)
}

function Get-RaceDistributionLines {
    param($Distribution)

    $lines = @()
    foreach ($entry in @($Distribution)) {
        $lines += ("{0}: {1}%" -f `
                (Get-FriendlyLabel -Value (Get-ObjectProperty -Object $entry -Name 'race' -Default '')), `
                (Format-Number -Value (Get-ObjectProperty -Object $entry -Name 'percentage' -Default $null)))
    }

    return $lines
}

function Get-WorldRegionDetailText {
    param($Node)

    $record = $Node.Record
    $lines = New-LineBuffer
    $recordId = Get-ObjectProperty -Object $record -Name 'id' -Default ''
    $regionType = Get-ObjectProperty -Object $record -Name 'regionType' -Default ''
    $parentRegionId = Get-ObjectProperty -Object $record -Name 'parentRegionId' -Default ''
    $population = Get-ObjectProperty -Object $record -Name 'populationProfile' -Default $null
    $demographics = Get-ObjectProperty -Object $record -Name 'demographicProfile' -Default $null
    $economy = Get-ObjectProperty -Object $record -Name 'economicProfile' -Default $null
    $geography = Get-ObjectProperty -Object $record -Name 'geography' -Default $null

    Add-Section -Lines $lines -Title "Overview" -BodyLines @(
        "ID: $recordId",
        "Region type: $(Get-FriendlyLabel -Value $regionType)",
        "Position: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'positionLabel' -Default ''))",
        "Parent region: $(if ([string]::IsNullOrWhiteSpace($parentRegionId)) { 'none' } else { Resolve-RegionLabel -RegionId $parentRegionId })",
        "Aliases: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'aliases' -Default @()))",
        "Tags: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'tags' -Default @()))"
    )

    Add-Section -Lines $lines -Title "Summary" -BodyLines @(
        (Get-ObjectProperty -Object $record -Name 'summary' -Default '')
    )

    if ($null -ne $geography) {
        $geographyLines = @()
        if (Test-ObjectProperty -Object $geography -Name 'climateSummary') {
            $geographyLines += ("Climate: {0}" -f (Get-ObjectProperty -Object $geography -Name 'climateSummary' -Default ''))
        }
        foreach ($entry in @((Get-ObjectProperty -Object $geography -Name 'terrainNotes' -Default @()))) {
            $geographyLines += ("Terrain: {0}" -f $entry)
        }
        foreach ($entry in @((Get-ObjectProperty -Object $geography -Name 'notableFeatures' -Default @()))) {
            $geographyLines += ("Feature: {0}" -f $entry)
        }
        Add-Section -Lines $lines -Title "Geography" -BodyLines $geographyLines
    }

    if ($null -ne $population) {
        $populationLines = @()
        if (Test-ObjectProperty -Object $population -Name 'densityBand') {
            $populationLines += "Density: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $population -Name 'densityBand' -Default 'unknown'))"
        }
        if (Test-ObjectProperty -Object $population -Name 'estimatedPopulationMillions') {
            $populationLines += "Estimated population: $(Format-Number -Value (Get-ObjectProperty -Object $population -Name 'estimatedPopulationMillions' -Default $null)) million"
        }
        if (Test-ObjectProperty -Object $population -Name 'settlementPattern') {
            $populationLines += "Settlement pattern: $(Get-ObjectProperty -Object $population -Name 'settlementPattern' -Default '')"
        }
        if (@((Get-ObjectProperty -Object $population -Name 'densityNotes' -Default @())).Count -gt 0) {
            $populationLines += "Density notes: $(Format-ListText -Items (Get-ObjectProperty -Object $population -Name 'densityNotes' -Default @()))"
        }
        Add-Section -Lines $lines -Title "Population" -BodyLines $populationLines
    }

    if ($null -ne $demographics) {
        $demographicLines = @()
        $demographicLines += @(Get-RaceDistributionLines -Distribution (Get-ObjectProperty -Object $demographics -Name 'raceDistribution' -Default @()))
        foreach ($group in @((Get-ObjectProperty -Object $demographics -Name 'notableGroups' -Default @()))) {
            $demographicLines += ("Notable group: {0}" -f $group)
        }
        Add-Section -Lines $lines -Title "Demographics" -BodyLines $demographicLines
    }

    if ($null -ne $economy) {
        Add-Section -Lines $lines -Title "Economy" -BodyLines @(
            "Major exports: $(Format-ListText -Items (Get-ObjectProperty -Object $economy -Name 'majorExports' -Default @()))",
            "Major imports: $(Format-ListText -Items (Get-ObjectProperty -Object $economy -Name 'majorImports' -Default @()))"
        )
    }

    Add-Section -Lines $lines -Title "Civilization Notes" -BodyLines (Get-ObjectProperty -Object $record -Name 'civilizationNotes' -Default @())
    Add-Section -Lines $lines -Title "Strategic Notes" -BodyLines (Get-ObjectProperty -Object $record -Name 'strategicNotes' -Default @())

    $childRegionLines = @()
    foreach ($childRegion in @($script:regionRecords | Where-Object { (Get-ObjectProperty -Object $_ -Name 'parentRegionId' -Default '') -eq $recordId })) {
        $childRegionLines += (Get-ObjectProperty -Object $childRegion -Name 'name' -Default '')
    }
    Add-Section -Lines $lines -Title "Subregions" -BodyLines $childRegionLines

    return (Join-Lines -Lines $lines)
}

function Get-WorldMapDetailText {
    param($Node)

    $record = $Node.Record
    $lines = New-LineBuffer

    Add-Section -Lines $lines -Title "Overview" -BodyLines @(
        "ID: $(Get-ObjectProperty -Object $record -Name 'id' -Default '')",
        "Map type: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'mapType' -Default ''))",
        (Get-ObjectProperty -Object $record -Name 'sourceSummary' -Default '')
    )

    $scale = Get-ObjectProperty -Object $record -Name 'scaleProfile' -Default $null
    if ($null -ne $scale) {
        Add-Section -Lines $lines -Title "Scale" -BodyLines @(
            "Reference image: $(Format-Number -Value (Get-ObjectProperty -Object $scale -Name 'referenceImageWidthPx' -Default $null)) x $(Format-Number -Value (Get-ObjectProperty -Object $scale -Name 'referenceImageHeightPx' -Default $null)) px",
            "Kilometers per pixel: $(Format-Number -Value (Get-ObjectProperty -Object $scale -Name 'kilometersPerPixel' -Default $null))",
            "Miles per pixel: $(Format-Number -Value (Get-ObjectProperty -Object $scale -Name 'milesPerPixel' -Default $null))",
            "Map width: $(Format-Number -Value (Get-ObjectProperty -Object $scale -Name 'mapWidthKilometers' -Default $null)) km | $(Format-Number -Value (Get-ObjectProperty -Object $scale -Name 'mapWidthMiles' -Default $null)) miles",
            "Map height: $(Format-Number -Value (Get-ObjectProperty -Object $scale -Name 'mapHeightKilometers' -Default $null)) km | $(Format-Number -Value (Get-ObjectProperty -Object $scale -Name 'mapHeightMiles' -Default $null)) miles",
            "Notes: $(Format-ListText -Items (Get-ObjectProperty -Object $scale -Name 'notes' -Default @()) -Separator ' | ')"
        )

        $rulerLines = @()
        foreach ($entry in @((Get-ObjectProperty -Object $scale -Name 'practicalRulerBenchmarks' -Default @()))) {
            $rulerLines += ("{0} px: {1} km | {2} miles" -f `
                    (Format-Number -Value (Get-ObjectProperty -Object $entry -Name 'pixels' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $entry -Name 'distanceKilometers' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $entry -Name 'distanceMiles' -Default $null)))
        }
        Add-Section -Lines $lines -Title "Practical Ruler" -BodyLines $rulerLines

        $distanceLines = @()
        foreach ($entry in @((Get-ObjectProperty -Object $scale -Name 'distanceBenchmarks' -Default @()))) {
            $distanceLines += (Get-ObjectProperty -Object $entry -Name 'name' -Default '')
            $distanceLines += ("  span: {0}-{1} km | {2}-{3} miles" -f `
                    (Format-Number -Value (Get-ObjectProperty -Object $entry -Name 'distanceKilometersMin' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $entry -Name 'distanceKilometersMax' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $entry -Name 'distanceMilesMin' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $entry -Name 'distanceMilesMax' -Default $null)))
            $distanceLines += ("  notes: {0}" -f (Get-ObjectProperty -Object $entry -Name 'notes' -Default ''))
        }
        Add-Section -Lines $lines -Title "Distance Benchmarks" -BodyLines $distanceLines
    }

    Add-Section -Lines $lines -Title "Geography Groups" -BodyLines @(
        "Continents: $(Get-ResolvedRegionListText -RegionIds (Get-ObjectProperty -Object $record -Name 'continentRegionIds' -Default @()) -MaxItems 12)",
        "Island systems: $(Get-ResolvedRegionListText -RegionIds (Get-ObjectProperty -Object $record -Name 'islandSystemRegionIds' -Default @()) -MaxItems 12)",
        "Oceans: $(Get-ResolvedRegionListText -RegionIds (Get-ObjectProperty -Object $record -Name 'oceanRegionIds' -Default @()) -MaxItems 12)"
    )

    Add-Section -Lines $lines -Title "Population Logic" -BodyLines (Get-ObjectProperty -Object $record -Name 'globalAssumptions' -Default @())

    $densityLines = @()
    foreach ($entry in @((Get-ObjectProperty -Object $record -Name 'densityScale' -Default @()))) {
        $densityLines += ("{0}: {1}" -f `
                (Get-FriendlyLabel -Value (Get-ObjectProperty -Object $entry -Name 'densityBand' -Default '')), `
                (Get-ObjectProperty -Object $entry -Name 'settlementPattern' -Default ''))
    }
    Add-Section -Lines $lines -Title "Density Scale" -BodyLines $densityLines

    $populationLines = @()
    foreach ($estimate in @((Get-ObjectProperty -Object $record -Name 'populationEstimates' -Default @()))) {
        $populationLines += ("{0}: {1} million" -f `
                (Resolve-RegionLabel -RegionId (Get-ObjectProperty -Object $estimate -Name 'regionId' -Default '')), `
                (Format-Number -Value (Get-ObjectProperty -Object $estimate -Name 'estimateMillions' -Default $null)))
    }
    if (Test-ObjectProperty -Object $record -Name 'totalPopulationMillions') {
        $populationLines += ("Total world estimate: {0} million" -f (Format-Number -Value (Get-ObjectProperty -Object $record -Name 'totalPopulationMillions' -Default $null)))
    }
    Add-Section -Lines $lines -Title "Population Estimates" -BodyLines $populationLines

    $tradeLines = @()
    foreach ($route in @((Get-ObjectProperty -Object $record -Name 'majorTradeRoutes' -Default @()))) {
        $tradeLines += (Get-ObjectProperty -Object $route -Name 'name' -Default '')
        $tradeLines += ("  summary: {0}" -f (Get-ObjectProperty -Object $route -Name 'summary' -Default ''))
        $tradeLines += ("  regions: {0}" -f (Get-ResolvedRegionListText -RegionIds (Get-ObjectProperty -Object $route -Name 'regionIds' -Default @()) -MaxItems 12))
    }
    Add-Section -Lines $lines -Title "Trade Routes" -BodyLines $tradeLines

    $conflictLines = @()
    foreach ($zone in @((Get-ObjectProperty -Object $record -Name 'conflictZones' -Default @()))) {
        $conflictLines += (Get-ObjectProperty -Object $zone -Name 'name' -Default '')
        $conflictLines += ("  summary: {0}" -f (Get-ObjectProperty -Object $zone -Name 'summary' -Default ''))
        $conflictLines += ("  regions: {0}" -f (Get-ResolvedRegionListText -RegionIds (Get-ObjectProperty -Object $zone -Name 'regionIds' -Default @()) -MaxItems 12))
    }
    Add-Section -Lines $lines -Title "Conflict Zones" -BodyLines $conflictLines

    Add-Section -Lines $lines -Title "Layer Notes" -BodyLines (Get-ObjectProperty -Object $record -Name 'layerSummaries' -Default @())
    return (Join-Lines -Lines $lines)
}

function Get-WorldMapFeatureDetailText {
    param($Node)

    $record = $Node.Record
    $lines = New-LineBuffer

    Add-Section -Lines $lines -Title "Overview" -BodyLines @(
        "ID: $(Get-ObjectProperty -Object $record -Name 'id' -Default '')",
        "Map: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'mapId' -Default ''))",
        "Reference image: $(Format-Number -Value (Get-ObjectProperty -Object $record -Name 'referenceImageWidthPx' -Default $null)) x $(Format-Number -Value (Get-ObjectProperty -Object $record -Name 'referenceImageHeightPx' -Default $null)) px",
        (Get-ObjectProperty -Object $record -Name 'summary' -Default '')
    )

    $layerLines = @()
    foreach ($layer in @((Get-ObjectProperty -Object $record -Name 'sourceLayers' -Default @()))) {
        $layerLines += ("{0} [{1}]" -f `
                (Get-ObjectProperty -Object $layer -Name 'name' -Default ''), `
                (Get-FriendlyLabel -Value (Get-ObjectProperty -Object $layer -Name 'layerType' -Default '')))
        $layerLines += ("  summary: {0}" -f (Get-ObjectProperty -Object $layer -Name 'summary' -Default ''))
    }
    Add-Section -Lines $lines -Title "Source Layers" -BodyLines $layerLines

    Add-Section -Lines $lines -Title "Geometry Counts" -BodyLines @(
        "Region footprints: $(Format-Number -Value (@((Get-ObjectProperty -Object $record -Name 'regionFootprints' -Default @())).Count))",
        "Coastlines: $(Format-Number -Value (@((Get-ObjectProperty -Object $record -Name 'coastlines' -Default @())).Count))",
        "Rivers: $(Format-Number -Value (@((Get-ObjectProperty -Object $record -Name 'riverFeatures' -Default @())).Count))",
        "Mountain features: $(Format-Number -Value (@((Get-ObjectProperty -Object $record -Name 'mountainFeatures' -Default @())).Count))",
        "Passes: $(Format-Number -Value (@((Get-ObjectProperty -Object $record -Name 'passFeatures' -Default @())).Count))",
        "Crossings: $(Format-Number -Value (@((Get-ObjectProperty -Object $record -Name 'crossingFeatures' -Default @())).Count))",
        "Climate zones: $(Format-Number -Value (@((Get-ObjectProperty -Object $record -Name 'climateZones' -Default @())).Count))",
        "Biome zones: $(Format-Number -Value (@((Get-ObjectProperty -Object $record -Name 'biomeZones' -Default @())).Count))"
    )

    $climateLines = @()
    foreach ($zone in @((Get-ObjectProperty -Object $record -Name 'climateZones' -Default @()))) {
        $climateLines += ("{0}: {1}" -f `
                (Get-ObjectProperty -Object $zone -Name 'name' -Default ''), `
                (Get-FriendlyLabel -Value ((Get-ObjectProperty -Object $zone -Name 'climateProfileId' -Default '') -replace '^climate\.', '')))
        $climateLines += ("  regions: {0}" -f (Get-ResolvedRegionListText -RegionIds (Get-ObjectProperty -Object $zone -Name 'regionIds' -Default @()) -MaxItems 12))
    }
    Add-Section -Lines $lines -Title "Climate Zones" -BodyLines $climateLines

    $biomeLines = @()
    foreach ($zone in @((Get-ObjectProperty -Object $record -Name 'biomeZones' -Default @()))) {
        $biomeLines += ("{0}: {1}" -f `
                (Get-ObjectProperty -Object $zone -Name 'name' -Default ''), `
                (Get-FriendlyLabel -Value ((Get-ObjectProperty -Object $zone -Name 'biomeId' -Default '') -replace '^biome\.', '')))
        $biomeLines += ("  regions: {0}" -f (Get-ResolvedRegionListText -RegionIds (Get-ObjectProperty -Object $zone -Name 'regionIds' -Default @()) -MaxItems 12))
    }
    Add-Section -Lines $lines -Title "Biome Zones" -BodyLines $biomeLines

    return (Join-Lines -Lines $lines)
}

function Get-TravelNetworkDetailText {
    param($Node)

    $record = $Node.Record
    $lines = New-LineBuffer

    Add-Section -Lines $lines -Title "Overview" -BodyLines @(
        "ID: $(Get-ObjectProperty -Object $record -Name 'id' -Default '')",
        "Map: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'mapId' -Default ''))",
        (Get-ObjectProperty -Object $record -Name 'summary' -Default '')
    )

    $modeLines = @()
    foreach ($mode in @((Get-ObjectProperty -Object $record -Name 'modeProfiles' -Default @()))) {
        $modeLines += ("{0}: {1} miles/day | {2} km/day [{3}] | {4}" -f `
                (Get-ObjectProperty -Object $mode -Name 'name' -Default ''), `
                (Format-Number -Value (Get-ObjectProperty -Object $mode -Name 'baseMilesPerDay' -Default $null)), `
                (Format-Number -Value ((Get-ObjectProperty -Object $mode -Name 'baseMilesPerDay' -Default 0) * 1.609344)), `
                (Get-FriendlyLabel -Value (Get-ObjectProperty -Object $mode -Name 'domain' -Default '')), `
                (Get-ObjectProperty -Object $mode -Name 'notes' -Default ''))
    }
    Add-Section -Lines $lines -Title "Travel Modes" -BodyLines $modeLines

    $benchmarkLines = @()
    foreach ($benchmark in @((Get-ObjectProperty -Object $record -Name 'travelBenchmarks' -Default @()))) {
        $benchmarkLines += (Get-FriendlyLabel -Value ((Get-ObjectProperty -Object $benchmark -Name 'modeId' -Default '') -replace '^travel_mode\.', ''))
        $benchmarkLines += ("  summary: {0}" -f (Get-ObjectProperty -Object $benchmark -Name 'summary' -Default ''))
        foreach ($example in @((Get-ObjectProperty -Object $benchmark -Name 'examples' -Default @()))) {
            $benchmarkLines += ("  {0} km | {1} miles -> {2}-{3} days" -f `
                    (Format-Number -Value (Get-ObjectProperty -Object $example -Name 'distanceKilometers' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $example -Name 'distanceMiles' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $example -Name 'expectedDaysMin' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $example -Name 'expectedDaysMax' -Default $null)))
        }
    }
    Add-Section -Lines $lines -Title "Reference Trips" -BodyLines $benchmarkLines

    $terrainLines = @()
    foreach ($rule in @((Get-ObjectProperty -Object $record -Name 'terrainVarianceRules' -Default @()))) {
        $effects = @()
        foreach ($effect in @((Get-ObjectProperty -Object $rule -Name 'modeEffects' -Default @()))) {
            $effects += ("{0}=x{1} +/-{2}%" -f `
                    (Get-FriendlyLabel -Value ((Get-ObjectProperty -Object $effect -Name 'modeId' -Default '') -replace '^travel_mode\.', '')), `
                    (Format-Number -Value (Get-ObjectProperty -Object $effect -Name 'speedMultiplier' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $effect -Name 'variancePercent' -Default $null)))
        }
        $terrainLines += ("{0}: {1}" -f (Get-ObjectProperty -Object $rule -Name 'name' -Default ''), (Get-ObjectProperty -Object $rule -Name 'summary' -Default ''))
        $terrainLines += ("  effects: {0}" -f (Format-ListText -Items $effects))
    }
    Add-Section -Lines $lines -Title "Terrain Variance" -BodyLines $terrainLines

    $featureLines = @()
    foreach ($rule in @((Get-ObjectProperty -Object $record -Name 'featureVarianceRules' -Default @()))) {
        $effects = @()
        foreach ($effect in @((Get-ObjectProperty -Object $rule -Name 'modeEffects' -Default @()))) {
            $effects += ("{0}=x{1} +/-{2}%" -f `
                    (Get-FriendlyLabel -Value ((Get-ObjectProperty -Object $effect -Name 'modeId' -Default '') -replace '^travel_mode\.', '')), `
                    (Format-Number -Value (Get-ObjectProperty -Object $effect -Name 'speedMultiplier' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $effect -Name 'variancePercent' -Default $null)))
        }
        $featureLines += ("{0}: {1}" -f (Get-ObjectProperty -Object $rule -Name 'name' -Default ''), (Get-ObjectProperty -Object $rule -Name 'summary' -Default ''))
        $featureLines += ("  effects: {0}" -f (Format-ListText -Items $effects))
    }
    Add-Section -Lines $lines -Title "Feature Variance" -BodyLines $featureLines

    $routeLines = @()
    foreach ($route in @((Get-ObjectProperty -Object $record -Name 'routeRecords' -Default @()))) {
        $timeParts = @()
        foreach ($estimate in @((Get-ObjectProperty -Object $route -Name 'travelTimeEstimates' -Default @()))) {
            $timeParts += ("{0}: {1}d +/-{2}d" -f `
                    (Get-FriendlyLabel -Value ((Get-ObjectProperty -Object $estimate -Name 'modeId' -Default '') -replace '^travel_mode\.', '')), `
                    (Format-Number -Value (Get-ObjectProperty -Object $estimate -Name 'expectedDays' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $estimate -Name 'varianceDays' -Default $null)))
        }
        $routeLines += ("{0} -> {1} | {2} miles | {3} km | {4}" -f `
                (Resolve-SettlementLabel -SettlementId (Get-ObjectProperty -Object $route -Name 'fromSettlementId' -Default '')), `
                (Resolve-SettlementLabel -SettlementId (Get-ObjectProperty -Object $route -Name 'toSettlementId' -Default '')), `
                (Format-Number -Value (Get-ObjectProperty -Object $route -Name 'distanceMiles' -Default $null)), `
                (Format-Number -Value ((Get-ObjectProperty -Object $route -Name 'distanceMiles' -Default 0) * 1.609344)), `
                (Get-FriendlyLabel -Value (Get-ObjectProperty -Object $route -Name 'routeClass' -Default '')))
        $routeLines += ("  path: {0} control points | {1} tagged segments" -f `
                (Format-Number -Value (@((Get-ObjectProperty -Object $route -Name 'pathPoints' -Default @())).Count)), `
                (Format-Number -Value (@((Get-ObjectProperty -Object $route -Name 'pathSegments' -Default @())).Count)))
        $routeLines += ("  terrain: {0}" -f (Format-ListText -Items (Get-ObjectProperty -Object $route -Name 'terrainTags' -Default @())))
        $routeLines += ("  features: {0}" -f (Format-ListText -Items (Get-ObjectProperty -Object $route -Name 'featureTags' -Default @())))
        $routeLines += ("  times: {0}" -f (Format-ListText -Items $timeParts))
    }
    Add-Section -Lines $lines -Title "Domestic Routes" -BodyLines $routeLines

    $laneLines = @()
    foreach ($lane in @((Get-ObjectProperty -Object $record -Name 'interPortShipRoutes' -Default @()))) {
        $timeParts = @()
        foreach ($estimate in @((Get-ObjectProperty -Object $lane -Name 'travelTimeEstimates' -Default @()))) {
            $timeParts += ("{0}: {1}d +/-{2}d" -f `
                    (Get-FriendlyLabel -Value ((Get-ObjectProperty -Object $estimate -Name 'modeId' -Default '') -replace '^travel_mode\.', '')), `
                    (Format-Number -Value (Get-ObjectProperty -Object $estimate -Name 'expectedDays' -Default $null)), `
                    (Format-Number -Value (Get-ObjectProperty -Object $estimate -Name 'varianceDays' -Default $null)))
        }
        $laneLines += ("{0} -> {1} | {2} miles | {3} km | {4}" -f `
                (Resolve-SettlementLabel -SettlementId (Get-ObjectProperty -Object $lane -Name 'fromSettlementId' -Default '')), `
                (Resolve-SettlementLabel -SettlementId (Get-ObjectProperty -Object $lane -Name 'toSettlementId' -Default '')), `
                (Format-Number -Value (Get-ObjectProperty -Object $lane -Name 'distanceMiles' -Default $null)), `
                (Format-Number -Value ((Get-ObjectProperty -Object $lane -Name 'distanceMiles' -Default 0) * 1.609344)), `
                (Get-FriendlyLabel -Value (Get-ObjectProperty -Object $lane -Name 'laneClass' -Default '')))
        $laneLines += ("  path: {0} control points | {1} tagged segments" -f `
                (Format-Number -Value (@((Get-ObjectProperty -Object $lane -Name 'pathPoints' -Default @())).Count)), `
                (Format-Number -Value (@((Get-ObjectProperty -Object $lane -Name 'pathSegments' -Default @())).Count)))
        $laneLines += ("  seas: {0}" -f (Get-ResolvedRegionListText -RegionIds (Get-ObjectProperty -Object $lane -Name 'seaRegionIds' -Default @()) -MaxItems 12))
        $laneLines += ("  hazards: {0}" -f (Format-ListText -Items (Get-ObjectProperty -Object $lane -Name 'featureTags' -Default @())))
        $laneLines += ("  times: {0}" -f (Format-ListText -Items $timeParts))
    }
    Add-Section -Lines $lines -Title "Inter-Port Shipping" -BodyLines $laneLines

    return (Join-Lines -Lines $lines)
}

function Get-RegionalEcologyDetailText {
    param($Node)

    $record = $Node.Record
    $lines = New-LineBuffer
    $coverage = Get-ObjectProperty -Object $record -Name 'coverageProfile' -Default $null

    Add-Section -Lines $lines -Title "Overview" -BodyLines @(
        "ID: $(Get-ObjectProperty -Object $record -Name 'id' -Default '')",
        "Region: $(Resolve-RegionLabel -RegionId (Get-ObjectProperty -Object $record -Name 'regionId' -Default ''))",
        "Primary climate: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'primaryClimateProfileId' -Default ''))",
        "Secondary climates: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'secondaryClimateProfileIds' -Default @()))"
    )

    Add-Section -Lines $lines -Title "Summary" -BodyLines @(
        (Get-ObjectProperty -Object $record -Name 'summary' -Default '')
    )

    Add-Section -Lines $lines -Title "Biomes" -BodyLines @(
        "Dominant biomes: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'dominantBiomeIds' -Default @()))",
        "Supporting biomes: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'supportingBiomeIds' -Default @()))"
    )

    Add-Section -Lines $lines -Title "Map Zones" -BodyLines @(
        "Climate zones: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'mapClimateZoneIds' -Default @()))",
        "Biome zones: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'mapBiomeZoneIds' -Default @()))"
    )

    Add-Section -Lines $lines -Title "Representative Flora" -BodyLines (Get-ObjectProperty -Object $record -Name 'nativeFloraIds' -Default @())
    Add-Section -Lines $lines -Title "Representative Fauna" -BodyLines (Get-ObjectProperty -Object $record -Name 'nativeFaunaIds' -Default @())

    if ($null -ne $coverage) {
        Add-Section -Lines $lines -Title "Coverage Profile" -BodyLines @(
            "Staple crops: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $coverage -Name 'stapleCrops' -Default ''))",
            "Herd and game: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $coverage -Name 'herdAndGame' -Default ''))",
            "Maritime foods: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $coverage -Name 'maritimeFoods' -Default ''))",
            "Timber and fiber: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $coverage -Name 'timberAndFiber' -Default ''))",
            "Metals and stone: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $coverage -Name 'metalsAndStone' -Default ''))",
            "Herbs and reagents: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $coverage -Name 'herbsAndReagents' -Default ''))",
            "Luxury goods: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $coverage -Name 'luxuryGoods' -Default ''))"
        )
    }

    Add-Section -Lines $lines -Title "Domestic Strengths" -BodyLines (Get-ObjectProperty -Object $record -Name 'domesticStrengths' -Default @())
    Add-Section -Lines $lines -Title "Domestic Gaps" -BodyLines (Get-ObjectProperty -Object $record -Name 'domesticGaps' -Default @())
    Add-Section -Lines $lines -Title "Likely Trade Partners" -BodyLines @(
        "$(Get-ResolvedRegionListText -RegionIds (Get-ObjectProperty -Object $record -Name 'likelyTradePartnerRegionIds' -Default @()) -MaxItems 12)"
    )
    Add-Section -Lines $lines -Title "Trade Pressure Notes" -BodyLines (Get-ObjectProperty -Object $record -Name 'tradePressureNotes' -Default @())

    return (Join-Lines -Lines $lines)
}

function Get-GuildDetailText {
    param($Node)

    $record = $Node.Record
    $membership = Get-ObjectProperty -Object $record -Name 'membershipModel' -Default $null
    $lines = New-LineBuffer

    Add-Section -Lines $lines -Title "Overview" -BodyLines @(
        "ID: $(Get-ObjectProperty -Object $record -Name 'id' -Default '')",
        "Category: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'category' -Default ''))",
        (Get-ObjectProperty -Object $record -Name 'summary' -Default '')
    )

    Add-Section -Lines $lines -Title "Governance" -BodyLines @(
        "Governed activities: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'governsActivities' -Default @()))",
        "Excluded activities: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'excludedActivities' -Default @()) -EmptyText 'None recorded')",
        "Contract types: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'contractTypes' -Default @()))"
    )

    Add-Section -Lines $lines -Title "Typical Presence" -BodyLines @(
        "Facility levels: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'typicalPresenceLevels' -Default @()))",
        "Settlement tags: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'typicalSettlementTags' -Default @()))"
    )

    if ($null -ne $membership) {
        $membershipLines = @(
            "Entry method: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $membership -Name 'entryMethod' -Default ''))"
        )

        $buyInRequirement = Get-ObjectProperty -Object $membership -Name 'buyInRequirement' -Default ''
        if (-not [string]::IsNullOrWhiteSpace([string]$buyInRequirement)) {
            $membershipLines += "Buy-in requirement: $buyInRequirement"
        }

        $membershipLines += "Entry requirements: $(Format-ListText -Items (Get-ObjectProperty -Object $membership -Name 'entryRequirements' -Default @()))"
        $membershipLines += "Benefits: $(Format-ListText -Items (Get-ObjectProperty -Object $membership -Name 'benefits' -Default @()))"
        $membershipLines += "Member obligations: $(Format-ListText -Items (Get-ObjectProperty -Object $membership -Name 'memberObligations' -Default @()))"

        $membershipNotes = Get-ObjectProperty -Object $membership -Name 'notes' -Default ''
        if (-not [string]::IsNullOrWhiteSpace([string]$membershipNotes)) {
            $membershipLines += "Notes: $membershipNotes"
        }

        Add-Section -Lines $lines -Title "Membership" -BodyLines $membershipLines
    }

    return (Join-Lines -Lines $lines)
}

function Get-SettlementDetailText {
    param($Node)

    $record = $Node.Record
    $lines = New-LineBuffer
    $infra = Get-ObjectProperty -Object $record -Name 'infrastructureProfile' -Default $null
    $resources = Get-ObjectProperty -Object $record -Name 'domesticResourceProfile' -Default $null
    $guilds = @((Get-ObjectProperty -Object $record -Name 'guildPresence' -Default @()))

    Add-Section -Lines $lines -Title "Overview" -BodyLines @(
        "ID: $(Get-ObjectProperty -Object $record -Name 'id' -Default '')",
        "Macro region: $(Resolve-RegionLabel -RegionId (Get-ObjectProperty -Object $record -Name 'macroRegionId' -Default ''))",
        "Region: $(Resolve-RegionLabel -RegionId (Get-ObjectProperty -Object $record -Name 'regionId' -Default ''))",
        "Settlement type: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'settlementType' -Default ''))",
        "Administrative role: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'administrativeRole' -Default ''))",
        "Parent settlement: $(if ([string]::IsNullOrWhiteSpace([string](Get-ObjectProperty -Object $record -Name 'parentSettlementId' -Default ''))) { 'None' } else { Resolve-SettlementLabel -SettlementId (Get-ObjectProperty -Object $record -Name 'parentSettlementId' -Default '') })",
        "Dependency role: $(if ([string]::IsNullOrWhiteSpace([string](Get-ObjectProperty -Object $record -Name 'dependencyRole' -Default ''))) { 'Independent center' } else { Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'dependencyRole' -Default '') })"
    )

    Add-Section -Lines $lines -Title "Identity" -BodyLines @(
        (Get-ObjectProperty -Object $record -Name 'summary' -Default ''),
        "Site context: $(Get-ObjectProperty -Object $record -Name 'siteContext' -Default '')",
        "Identity tags: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'identityTags' -Default @()))",
        "Purpose tags: $(Format-ListText -Items (Get-ObjectProperty -Object $record -Name 'purposeTags' -Default @()))"
    )

    $mapLocation = Get-ObjectProperty -Object $record -Name 'mapLocation' -Default $null
    if ($null -ne $mapLocation) {
        Add-Section -Lines $lines -Title "Map Location" -BodyLines @(
            "Map: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $mapLocation -Name 'mapId' -Default ''))",
            "Pixel coordinates: x=$(Format-Number -Value (Get-ObjectProperty -Object $mapLocation -Name 'pixelX' -Default $null)), y=$(Format-Number -Value (Get-ObjectProperty -Object $mapLocation -Name 'pixelY' -Default $null))",
            "Site class: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $mapLocation -Name 'siteClass' -Default ''))",
            "Climate zone: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $mapLocation -Name 'climateZoneId' -Default ''))",
            "Biome zone: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $mapLocation -Name 'biomeZoneId' -Default ''))",
            "Notes: $(Get-ObjectProperty -Object $mapLocation -Name 'notes' -Default '')"
        )
    }

    Add-Section -Lines $lines -Title "Population" -BodyLines @(
        "Population band: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $record -Name 'populationBand' -Default ''))",
        "Population total: $(Format-Number -Value (Get-ObjectProperty -Object $record -Name 'populationTotal' -Default $null))"
    )

    Add-Section -Lines $lines -Title "Racial Mix" -BodyLines (Get-RaceDistributionLines -Distribution (Get-ObjectProperty -Object $record -Name 'racialMix' -Default @()))

    if ($null -ne $infra) {
        Add-Section -Lines $lines -Title "Infrastructure" -BodyLines @(
            "Overall level: $(Get-FriendlyLabel -Value (Get-ObjectProperty -Object $infra -Name 'overallLevel' -Default ''))",
            "Road tier: $(Format-Number -Value (Get-ObjectProperty -Object $infra -Name 'roadTier' -Default $null))",
            "Water tier: $(Format-Number -Value (Get-ObjectProperty -Object $infra -Name 'waterTier' -Default $null))",
            "Fortification tier: $(Format-Number -Value (Get-ObjectProperty -Object $infra -Name 'fortificationTier' -Default $null))",
            "Harbor tier: $(Format-Number -Value (Get-ObjectProperty -Object $infra -Name 'harborTier' -Default $null))",
            "Market tier: $(Format-Number -Value (Get-ObjectProperty -Object $infra -Name 'marketTier' -Default $null))"
        )
    }

    if ($null -ne $resources) {
        Add-Section -Lines $lines -Title "Domestic Production" -BodyLines @(
            "Primary goods: $(Format-ListText -Items (Get-ObjectProperty -Object $resources -Name 'primaryGoods' -Default @()))",
            "Secondary goods: $(Format-ListText -Items (Get-ObjectProperty -Object $resources -Name 'secondaryGoods' -Default @()))",
            "Demanded goods: $(Format-ListText -Items (Get-ObjectProperty -Object $resources -Name 'demandedGoods' -Default @()))"
        )
    }

    $guildLines = @()
    foreach ($guild in $guilds) {
        $guildLines += ("{0} ({1})" -f `
                (Get-ObjectProperty -Object $guild -Name 'name' -Default ''), `
                (Get-FriendlyLabel -Value (Get-ObjectProperty -Object $guild -Name 'presenceLevel' -Default '')))
        $guildLines += ("  type: {0}" -f (Resolve-GuildLabel -GuildType (Get-ObjectProperty -Object $guild -Name 'guildType' -Default '')))
        $guildLines += ("  functions: {0}" -f (Format-ListText -Items (Get-ObjectProperty -Object $guild -Name 'functions' -Default @())))
        $guildLines += ("  notes: {0}" -f (Get-ObjectProperty -Object $guild -Name 'notes' -Default ''))
    }
    if ($guildLines.Count -eq 0) {
        $guildLines = @("No permanent human guild houses are based here.")
    }
    Add-Section -Lines $lines -Title "Guild Buildings" -BodyLines $guildLines

    $dependentLines = @()
    foreach ($childSettlement in @(Get-DependentSettlementsForParent -ParentSettlementId (Get-ObjectProperty -Object $record -Name 'id' -Default ''))) {
        $dependentLines += ("{0} ({1}, pop. {2})" -f `
                (Get-ObjectProperty -Object $childSettlement -Name 'name' -Default ''), `
                (Get-FriendlyLabel -Value (Get-ObjectProperty -Object $childSettlement -Name 'settlementType' -Default '')), `
                (Format-Number -Value (Get-ObjectProperty -Object $childSettlement -Name 'populationTotal' -Default $null)))
        $dependentLines += ("  role: {0}" -f (Get-FriendlyLabel -Value (Get-ObjectProperty -Object $childSettlement -Name 'dependencyRole' -Default '')))
        $dependentLines += ("  purpose: {0}" -f (Format-ListText -Items (Get-ObjectProperty -Object $childSettlement -Name 'purposeTags' -Default @())))
    }
    if ($dependentLines.Count -eq 0) {
        $dependentLines = @("No dependent settlements are linked to this settlement.")
    }
    Add-Section -Lines $lines -Title "Dependent Sites" -BodyLines $dependentLines

    $tradeLines = @()
    foreach ($flow in @((Get-ObjectProperty -Object $record -Name 'domesticTradeFlows' -Default @()))) {
        $tradeLines += ("{0} {1}" -f `
                (Get-FriendlyLabel -Value (Get-ObjectProperty -Object $flow -Name 'direction' -Default '')), `
                (Resolve-SettlementLabel -SettlementId (Get-ObjectProperty -Object $flow -Name 'partnerSettlementId' -Default '')))
        $tradeLines += ("  goods: {0}" -f (Format-ListText -Items (Get-ObjectProperty -Object $flow -Name 'goods' -Default @())))
        $tradeLines += ("  routes: {0}" -f (Format-ListText -Items (Get-ObjectProperty -Object $flow -Name 'routeModes' -Default @())))
        $tradeLines += ("  notes: {0}" -f (Get-ObjectProperty -Object $flow -Name 'notes' -Default ''))
    }
    Add-Section -Lines $lines -Title "Domestic Trade" -BodyLines $tradeLines

    return (Join-Lines -Lines $lines)
}

function Get-GenericRecordDetailText {
    param($Node)

    $record = $Node.Record
    $lines = New-LineBuffer

    $snapshotLines = @()
    $additionalLines = @()
    $preferredFields = @("id", "name", "title", "slug", "itemKey", "category", "source", "type", "lifecycle", "diet", "dangerClass", "baseValue", "currencyId", "marketable")

    if ($record -is [System.Management.Automation.PSCustomObject] -or $record -is [hashtable]) {
        foreach ($field in $preferredFields) {
            if (-not (Test-ObjectProperty -Object $record -Name $field)) {
                continue
            }

            $value = Get-ObjectProperty -Object $record -Name $field -Default $null
            if ($value -is [string] -or $value -is [ValueType]) {
                $snapshotLines += ("{0}: {1}" -f (Get-FriendlyLabel -Value $field), $value)
            }
        }

        foreach ($property in $record.PSObject.Properties) {
            if ($preferredFields -contains $property.Name) {
                continue
            }

            $value = $property.Value
            if ($value -is [string] -or $value -is [ValueType]) {
                $additionalLines += ("{0}: {1}" -f (Get-FriendlyLabel -Value $property.Name), $value)
            }
            elseif ($value -is [System.Collections.IEnumerable] -and $value -isnot [string]) {
                $items = @($value)
                if ($items.Count -gt 0 -and $items[0] -isnot [System.Management.Automation.PSCustomObject] -and $items[0] -isnot [hashtable]) {
                    $additionalLines += ("{0}: {1}" -f (Get-FriendlyLabel -Value $property.Name), (Get-PreviewListText -Items $items))
                }
                else {
                    $additionalLines += ("{0}: {1} detailed entries" -f (Get-FriendlyLabel -Value $property.Name), $items.Count)
                }
            }
            else {
                $additionalLines += ("{0}: detailed structured data" -f (Get-FriendlyLabel -Value $property.Name))
            }
        }
    }
    else {
        $snapshotLines += [string]$record
    }

    Add-Section -Lines $lines -Title "Gameplay Snapshot" -BodyLines $snapshotLines
    Add-Section -Lines $lines -Title "Additional Data" -BodyLines $additionalLines
    Add-Section -Lines $lines -Title "Source Note" -BodyLines @(
        "This browser shows condensed gameplay-facing data instead of the full raw record.",
        "Use Open Source if you need the exact JSON."
    )
    return (Join-Lines -Lines $lines)
}

function Get-FileDetailText {
    param($Node)

    try {
        $extension = [System.IO.Path]::GetExtension($Node.SourcePath).ToLowerInvariant()
        if ($extension -eq ".json") {
            $raw = Get-Content -LiteralPath $Node.SourcePath -Raw
            try {
                $parsed = $raw | ConvertFrom-Json -ErrorAction Stop
                $lines = New-LineBuffer
                $summaryLines = @(
                    "Path: $(Get-RelativeWorkspaceLabel -Path $Node.SourcePath)"
                )

                if (Test-ObjectProperty -Object $parsed -Name 'records') {
                    $records = @($parsed.records)
                    $summaryLines += "Record count: $($records.Count)"
                    $summaryLines += "Preview labels: $(Get-PreviewListText -Items ($records | Select-Object -First 6 | ForEach-Object { Get-RecordDisplayLabel -Record $_ }))"
                }
                else {
                    $summaryLines += "Top-level keys: $(Get-PreviewListText -Items ($parsed.PSObject.Properties.Name))"
                }

                Add-Section -Lines $lines -Title "JSON Summary" -BodyLines $summaryLines
                Add-Section -Lines $lines -Title "Source Note" -BodyLines @(
                    "This browser summarizes JSON files instead of dumping the full source.",
                    "Use Open Source for the exact file contents."
                )
                return (Join-Lines -Lines $lines)
            }
            catch {
                return "Unable to summarize JSON file:`r`n$($_.Exception.Message)"
            }
        }

        return (Get-ReadableContent -FilePath $Node.SourcePath)
    }
    catch {
        Write-Log -Level "ERROR" -Message "Failed to read file '$($Node.SourcePath)': $($_.Exception.Message)"
        return "Unable to read file:`r`n$($_.Exception.Message)"
    }
}

function Get-BreadcrumbText {
    $titles = @()

    foreach ($menu in @($script:navHistory)) {
        if ($null -ne $menu) {
            $titles += $menu.Title
        }
    }

    if ($null -ne $script:currentMenuNode) {
        if ($titles.Count -eq 0 -or $titles[$titles.Count - 1] -ne $script:currentMenuNode.Title) {
            $titles += $script:currentMenuNode.Title
        }
    }

    if ($null -ne $script:currentDetailNode -and $script:currentDetailNode -ne $script:currentMenuNode) {
        $titles += $script:currentDetailNode.Title
    }

    return ($titles -join " > ")
}

function Get-DetailViewForNode {
    param($Node)

    $sourceLabel = Get-RelativeWorkspaceLabel -Path $Node.SourcePath
    $subtitleParts = @()

    $breadcrumb = Get-BreadcrumbText
    if (-not [string]::IsNullOrWhiteSpace($breadcrumb)) {
        $subtitleParts += $breadcrumb
    }

    if (-not [string]::IsNullOrWhiteSpace($sourceLabel)) {
        $subtitleParts += $sourceLabel
    }

    $subtitle = $subtitleParts -join " | "
    $body = ""
    $status = "Ready."

    switch ($Node.DetailKind) {
        "home" {
            $body = Get-MenuOverviewText -Node $Node
            $status = "Browse content by section."
        }
        "folder" {
            $body = Get-MenuOverviewText -Node $Node
            $status = "Viewing folder menu."
        }
        "dataset" {
            $body = Get-MenuOverviewText -Node $Node
            $status = "Viewing dataset menu."
        }
        "group" {
            $body = Get-MenuOverviewText -Node $Node
            $status = "Viewing grouped records."
        }
        "workplace" {
            $body = Get-WorkplaceDetailText -Node $Node
            $status = "Viewing workplace record."
        }
        "infrastructure" {
            $body = Get-InfrastructureDetailText -Node $Node
            $status = "Viewing infrastructure record."
        }
        "flora_entry" {
            $body = Get-FloraDetailText -Node $Node
            $status = "Viewing flora encyclopedia entry."
        }
        "fauna_entry" {
            $body = Get-FaunaDetailText -Node $Node
            $status = "Viewing fauna bestiary entry."
        }
        "world_region" {
            $body = Get-WorldRegionDetailText -Node $Node
            $status = "Viewing world region entry."
        }
        "world_map" {
            $body = Get-WorldMapDetailText -Node $Node
            $status = "Viewing world map entry."
        }
        "world_map_feature" {
            $body = Get-WorldMapFeatureDetailText -Node $Node
            $status = "Viewing world map feature entry."
        }
        "regional_ecology" {
            $body = Get-RegionalEcologyDetailText -Node $Node
            $status = "Viewing regional ecology profile."
        }
        "guild" {
            $body = Get-GuildDetailText -Node $Node
            $status = "Viewing guild definition."
        }
        "settlement" {
            $body = Get-SettlementDetailText -Node $Node
            $status = "Viewing settlement record."
        }
        "travel_network" {
            $body = Get-TravelNetworkDetailText -Node $Node
            $status = "Viewing travel network record."
        }
        "production_chain" {
            $body = Get-ProductionChainDetailText -Node $Node
            $status = "Viewing production chain record."
        }
        "meat_cut_standard" {
            $body = Get-MeatCutStandardDetailText -Node $Node
            $status = "Viewing meat cut standard."
        }
        "generic_record" {
            $body = Get-GenericRecordDetailText -Node $Node
            $status = "Viewing record detail."
        }
        "markdown" {
            $body = Get-FileDetailText -Node $Node
            $status = "Viewing markdown file."
        }
        "file_json" {
            $body = Get-FileDetailText -Node $Node
            $status = "Viewing JSON file."
        }
        "placeholder" {
            $body = $Node.Title
            $status = "No items available in this menu."
        }
        default {
            if ($Node.Kind -eq "file") {
                $body = Get-FileDetailText -Node $Node
                $status = "Viewing file."
            }
            else {
                $body = Get-MenuOverviewText -Node $Node
            }
        }
    }

    return [pscustomobject]@{
        Title = $Node.Title
        Subtitle = $subtitle
        Body = $body
        Status = $status
    }
}

function Get-OpenTargetPath {
    if ($null -ne $script:currentDetailNode -and -not [string]::IsNullOrWhiteSpace($script:currentDetailNode.SourcePath)) {
        return $script:currentDetailNode.SourcePath
    }

    if ($null -ne $script:currentMenuNode -and -not [string]::IsNullOrWhiteSpace($script:currentMenuNode.SourcePath)) {
        return $script:currentMenuNode.SourcePath
    }

    return $null
}

$form = New-Object System.Windows.Forms.Form
$form.Text = "Cataclysm Content Browser"
$form.StartPosition = "CenterScreen"
$form.Width = 1400
$form.Height = 860
$form.MinimumSize = New-Object System.Drawing.Size(1100, 700)
$form.BackColor = [System.Drawing.Color]::FromArgb(242, 236, 224)

$navRail = New-Object System.Windows.Forms.Panel
$navRail.Dock = "Left"
$navRail.Width = 360
$navRail.Padding = New-Object System.Windows.Forms.Padding(0)
$navRail.BackColor = [System.Drawing.Color]::FromArgb(45, 61, 52)

$navHeaderPanel = New-Object System.Windows.Forms.Panel
$navHeaderPanel.Dock = "Top"
$navHeaderPanel.Height = 118
$navHeaderPanel.Padding = New-Object System.Windows.Forms.Padding(18, 18, 18, 10)
$navHeaderPanel.BackColor = [System.Drawing.Color]::FromArgb(39, 53, 45)

$appTitleLabel = New-Object System.Windows.Forms.Label
$appTitleLabel.Dock = "Top"
$appTitleLabel.Height = 34
$appTitleLabel.ForeColor = [System.Drawing.Color]::FromArgb(244, 240, 226)
$appTitleLabel.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 16)
$appTitleLabel.Text = "Content Browser"

$navSectionLabel = New-Object System.Windows.Forms.Label
$navSectionLabel.Dock = "Top"
$navSectionLabel.Height = 28
$navSectionLabel.ForeColor = [System.Drawing.Color]::FromArgb(222, 217, 197)
$navSectionLabel.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 11)
$navSectionLabel.Text = "Home"

$navHintLabel = New-Object System.Windows.Forms.Label
$navHintLabel.Dock = "Fill"
$navHintLabel.ForeColor = [System.Drawing.Color]::FromArgb(191, 196, 182)
$navHintLabel.Font = New-Object System.Drawing.Font("Segoe UI", 9.5)
$navHintLabel.Text = "Choose a section from the left rail."

[void]$navHeaderPanel.Controls.Add($navHintLabel)
[void]$navHeaderPanel.Controls.Add($navSectionLabel)
[void]$navHeaderPanel.Controls.Add($appTitleLabel)

$backButtonPanel = New-Object System.Windows.Forms.Panel
$backButtonPanel.Dock = "Bottom"
$backButtonPanel.Height = 76
$backButtonPanel.Padding = New-Object System.Windows.Forms.Padding(16, 10, 16, 16)
$backButtonPanel.BackColor = [System.Drawing.Color]::FromArgb(39, 53, 45)

$backButton = New-Object System.Windows.Forms.Button
$backButton.Dock = "Fill"
$backButton.Text = "Back / Up"
$backButton.Enabled = $false
$backButton.FlatStyle = "Flat"
$backButton.FlatAppearance.BorderSize = 1
$backButton.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(126, 148, 130)
$backButton.BackColor = [System.Drawing.Color]::FromArgb(89, 110, 92)
$backButton.ForeColor = [System.Drawing.Color]::White
$backButton.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 10)

[void]$backButtonPanel.Controls.Add($backButton)

$navButtonsPanel = New-Object System.Windows.Forms.Panel
$navButtonsPanel.Dock = "Fill"
$navButtonsPanel.AutoScroll = $true
$navButtonsPanel.BackColor = [System.Drawing.Color]::FromArgb(45, 61, 52)

[void]$navRail.Controls.Add($navButtonsPanel)
[void]$navRail.Controls.Add($backButtonPanel)
[void]$navRail.Controls.Add($navHeaderPanel)

$mainPanel = New-Object System.Windows.Forms.Panel
$mainPanel.Dock = "Fill"
$mainPanel.BackColor = [System.Drawing.Color]::FromArgb(245, 240, 229)
$mainPanel.Padding = New-Object System.Windows.Forms.Padding(18, 18, 18, 18)

$detailLayout = New-Object System.Windows.Forms.TableLayoutPanel
$detailLayout.Dock = "Fill"
$detailLayout.ColumnCount = 1
$detailLayout.RowCount = 4
[void]$detailLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::AutoSize)))
[void]$detailLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::AutoSize)))
[void]$detailLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::Percent, 100)))
[void]$detailLayout.RowStyles.Add((New-Object System.Windows.Forms.RowStyle([System.Windows.Forms.SizeType]::AutoSize)))

$detailHeaderPanel = New-Object System.Windows.Forms.Panel
$detailHeaderPanel.Dock = "Fill"
$detailHeaderPanel.Height = 96
$detailHeaderPanel.Padding = New-Object System.Windows.Forms.Padding(8, 4, 8, 8)
$detailHeaderPanel.BackColor = [System.Drawing.Color]::FromArgb(235, 229, 216)

$detailTitleLabel = New-Object System.Windows.Forms.Label
$detailTitleLabel.Dock = "Top"
$detailTitleLabel.Height = 38
$detailTitleLabel.ForeColor = [System.Drawing.Color]::FromArgb(56, 49, 37)
$detailTitleLabel.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 18)
$detailTitleLabel.Text = "Home"

$detailSubtitleLabel = New-Object System.Windows.Forms.Label
$detailSubtitleLabel.Dock = "Fill"
$detailSubtitleLabel.ForeColor = [System.Drawing.Color]::FromArgb(97, 87, 70)
$detailSubtitleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 9.5)
$detailSubtitleLabel.Text = ""

[void]$detailHeaderPanel.Controls.Add($detailSubtitleLabel)
[void]$detailHeaderPanel.Controls.Add($detailTitleLabel)

$toolbar = New-Object System.Windows.Forms.FlowLayoutPanel
$toolbar.Dock = "Fill"
$toolbar.AutoSize = $true
$toolbar.FlowDirection = "LeftToRight"
$toolbar.Padding = New-Object System.Windows.Forms.Padding(8, 10, 8, 10)
$toolbar.BackColor = [System.Drawing.Color]::FromArgb(245, 240, 229)

$refreshButton = New-Object System.Windows.Forms.Button
$refreshButton.Text = "Refresh"
$refreshButton.AutoSize = $true
$refreshButton.FlatStyle = "Flat"
$refreshButton.FlatAppearance.BorderSize = 1
$refreshButton.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(161, 150, 126)
$refreshButton.BackColor = [System.Drawing.Color]::FromArgb(227, 216, 191)
$refreshButton.ForeColor = [System.Drawing.Color]::FromArgb(66, 57, 41)
$refreshButton.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 10)

$openButton = New-Object System.Windows.Forms.Button
$openButton.Text = "Open Source"
$openButton.AutoSize = $true
$openButton.Enabled = $false
$openButton.FlatStyle = "Flat"
$openButton.FlatAppearance.BorderSize = 1
$openButton.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(161, 150, 126)
$openButton.BackColor = [System.Drawing.Color]::FromArgb(227, 216, 191)
$openButton.ForeColor = [System.Drawing.Color]::FromArgb(66, 57, 41)
$openButton.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 10)

[void]$toolbar.Controls.Add($refreshButton)
[void]$toolbar.Controls.Add($openButton)

$detailBox = New-Object System.Windows.Forms.RichTextBox
$detailBox.Dock = "Fill"
$detailBox.ReadOnly = $true
$detailBox.BorderStyle = "None"
$detailBox.BackColor = [System.Drawing.Color]::FromArgb(248, 244, 236)
$detailBox.ForeColor = [System.Drawing.Color]::FromArgb(54, 48, 37)
$detailBox.Font = New-Object System.Drawing.Font("Segoe UI", 10.25)
$detailBox.DetectUrls = $false
$detailBox.Margin = New-Object System.Windows.Forms.Padding(0, 0, 0, 8)

$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Dock = "Fill"
$statusLabel.AutoSize = $true
$statusLabel.Padding = New-Object System.Windows.Forms.Padding(8, 6, 8, 4)
$statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(97, 87, 70)
$statusLabel.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$statusLabel.Text = "Ready."

[void]$detailLayout.Controls.Add($detailHeaderPanel, 0, 0)
[void]$detailLayout.Controls.Add($toolbar, 0, 1)
[void]$detailLayout.Controls.Add($detailBox, 0, 2)
[void]$detailLayout.Controls.Add($statusLabel, 0, 3)

[void]$mainPanel.Controls.Add($detailLayout)
[void]$form.Controls.Add($mainPanel)
[void]$form.Controls.Add($navRail)

function Update-NavigationHeader {
    if ($null -eq $script:currentMenuNode) {
        return
    }

    $navSectionLabel.Text = $script:currentMenuNode.Title

    $menuPath = @()
    foreach ($menu in @($script:navHistory)) {
        $menuPath += $menu.Title
    }
    $menuPath += $script:currentMenuNode.Title

    $navHintLabel.Text = if ($menuPath.Count -gt 0) {
        $menuPath -join " > "
    }
    else {
        $script:currentMenuNode.Description
    }
}

function Update-OpenButtonState {
    $targetPath = Get-OpenTargetPath
    $script:selectedFilePath = $null

    if ($null -ne $targetPath -and (Test-Path -LiteralPath $targetPath)) {
        $script:selectedFilePath = $targetPath
        $openButton.Enabled = $true
        if (Test-Path -LiteralPath $targetPath -PathType Container) {
            $openButton.Text = "Open Folder"
        }
        else {
            $openButton.Text = "Open Source"
        }
    }
    else {
        $openButton.Enabled = $false
        $openButton.Text = "Open Source"
    }
}

function Render-Detail {
    param($Node)

    if ($null -eq $Node) {
        return
    }

    $view = Get-DetailViewForNode -Node $Node
    $detailTitleLabel.Text = $view.Title
    $detailSubtitleLabel.Text = $view.Subtitle
    $detailBox.Text = $view.Body
    $detailBox.SelectionStart = 0
    $detailBox.SelectionLength = 0
    $detailBox.ScrollToCaret()
    $statusLabel.Text = $view.Status

    Update-OpenButtonState
}

function Render-Navigation {
    if ($null -eq $script:currentMenuNode) {
        return
    }

    if ($script:isRenderingNavigation) {
        return
    }

    Update-NavigationHeader
    $backButton.Enabled = ($script:navHistory.Count -gt 0)

    $restoreScrollY = [Math]::Abs($navButtonsPanel.AutoScrollPosition.Y)
    $script:isRenderingNavigation = $true
    $navButtonsPanel.SuspendLayout()
    try {
        $navButtonsPanel.AutoScrollPosition = New-Object System.Drawing.Point(0, 0)
        $navButtonsPanel.Controls.Clear()

        $y = 12
        $buttonWidth = [Math]::Max(260, $navButtonsPanel.ClientSize.Width - 28)

        foreach ($child in @($script:currentMenuNode.Children)) {
            if ($child.Kind -eq "placeholder") {
                $placeholder = New-Object System.Windows.Forms.Label
                $placeholder.Left = 14
                $placeholder.Top = $y
                $placeholder.Width = $buttonWidth
                $placeholder.Height = 38
                $placeholder.Text = $child.Title
                $placeholder.ForeColor = [System.Drawing.Color]::FromArgb(198, 202, 193)
                $placeholder.Font = New-Object System.Drawing.Font("Segoe UI", 10)
                [void]$navButtonsPanel.Controls.Add($placeholder)
                $y += 46
                continue
            }

            $button = New-Object System.Windows.Forms.Button
            $button.Left = 14
            $button.Top = $y
            $button.Width = $buttonWidth
            $button.Height = if ($child.Kind -eq "menu") { 52 } else { 46 }
            $button.FlatStyle = "Flat"
            $button.FlatAppearance.BorderSize = 1
            $button.TextAlign = "MiddleLeft"
            $button.Padding = New-Object System.Windows.Forms.Padding(12, 0, 12, 0)
            $button.Font = New-Object System.Drawing.Font("Segoe UI Semibold", 10)
            $button.ForeColor = [System.Drawing.Color]::White
            $button.Tag = $child

            if ($child.Kind -eq "menu") {
                $button.Text = "> $($child.Title)"
                $button.BackColor = [System.Drawing.Color]::FromArgb(88, 108, 91)
                $button.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(124, 147, 128)
            }
            else {
                $button.Text = "- $($child.Title)"
                $button.BackColor = [System.Drawing.Color]::FromArgb(63, 82, 70)
                $button.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(101, 126, 104)
            }

            if ($script:currentDetailNode -eq $child) {
                $button.BackColor = [System.Drawing.Color]::FromArgb(171, 127, 62)
                $button.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(207, 173, 107)
            }

            $button.add_Click({
                    param($sender, $eventArgs)

                    $node = $sender.Tag
                    if ($null -eq $node) {
                        return
                    }

                    if ($node.Kind -eq "menu") {
                        Enter-Menu -Node $node
                        return
                    }

                    Show-Detail -Node $node
                })

            [void]$navButtonsPanel.Controls.Add($button)
            $y += $button.Height + 8
        }

        $navButtonsPanel.AutoScrollMinSize = New-Object System.Drawing.Size -ArgumentList 0, ($y + 8)
    }
    finally {
        $script:isRenderingNavigation = $false
        $navButtonsPanel.ResumeLayout()
    }

    if ($restoreScrollY -gt 0) {
        $navButtonsPanel.AutoScrollPosition = New-Object System.Drawing.Point(0, $restoreScrollY)
    }

    $script:lastNavClientWidth = $navButtonsPanel.ClientSize.Width
}

function Show-Detail {
    param($Node)

    if ($null -eq $Node) {
        return
    }

    $script:currentDetailNode = $Node
    Render-Navigation
    Render-Detail -Node $Node
    Write-Log -Message "Viewed detail: $($Node.Title)"
}

function Enter-Menu {
    param(
        $Node,
        [switch]$SkipHistory
    )

    if ($null -eq $Node) {
        return
    }

    if (-not $SkipHistory -and $null -ne $script:currentMenuNode) {
        [void]$script:navHistory.Add($script:currentMenuNode)
    }

    $script:currentMenuNode = $Node
    $script:currentDetailNode = $Node
    Render-Navigation
    Render-Detail -Node $Node
    Write-Log -Message "Entered menu: $($Node.Title)"
}

function Go-Back {
    if ($script:navHistory.Count -le 0) {
        return
    }

    $previousIndex = $script:navHistory.Count - 1
    $previousNode = $script:navHistory[$previousIndex]
    $script:navHistory.RemoveAt($previousIndex)

    $script:currentMenuNode = $previousNode
    $script:currentDetailNode = $previousNode
    Render-Navigation
    Render-Detail -Node $previousNode
    Write-Log -Message "Returned to menu: $($previousNode.Title)"
}

function Reset-AppState {
    $script:navHistory = New-Object System.Collections.ArrayList
    $script:currentMenuNode = $script:appRootNode
    $script:currentDetailNode = $script:appRootNode
    Render-Navigation
    Render-Detail -Node $script:appRootNode
}

function Refresh-AppModel {
    try {
        $statusLabel.Text = "Refreshing browser data..."
        $script:appRootNode = Build-AppModel
        Reset-AppState
        $statusLabel.Text = "Ready."
        Write-Log -Message "Browser data refreshed."
    }
    catch {
        Write-Log -Level "ERROR" -Message "Refresh failed: $($_.Exception.Message)"
        $statusLabel.Text = "Refresh failed."
        [void][System.Windows.Forms.MessageBox]::Show(
            "Failed to refresh browser data:`r`n$($_.Exception.Message)",
            "Cataclysm Content Browser",
            [System.Windows.Forms.MessageBoxButtons]::OK,
            [System.Windows.Forms.MessageBoxIcon]::Error
        )
    }
}

$navButtonsPanel.add_SizeChanged({
        if ($script:isRenderingNavigation) {
            return
        }

        if ($null -ne $script:currentMenuNode -and $navButtonsPanel.ClientSize.Width -ne $script:lastNavClientWidth) {
            Render-Navigation
        }
    })

$backButton.add_Click({
        Go-Back
    })

$refreshButton.add_Click({
        Refresh-AppModel
    })

$openButton.add_Click({
        if ($null -eq $script:selectedFilePath) {
            return
        }

        if (-not (Test-Path -LiteralPath $script:selectedFilePath)) {
            Write-Log -Level "WARN" -Message "Selected path missing for external open: $script:selectedFilePath"
            [void][System.Windows.Forms.MessageBox]::Show(
                "The selected source path no longer exists.",
                "Open Source",
                [System.Windows.Forms.MessageBoxButtons]::OK,
                [System.Windows.Forms.MessageBoxIcon]::Warning
            )
            return
        }

        try {
            Start-Process -FilePath $script:selectedFilePath
            Write-Log -Message "Opened source path externally: $script:selectedFilePath"
        }
        catch {
            Write-Log -Level "ERROR" -Message "Failed to open source path '$script:selectedFilePath': $($_.Exception.Message)"
            [void][System.Windows.Forms.MessageBox]::Show(
                "Unable to open the selected source path:`r`n$($_.Exception.Message)",
                "Open Source",
                [System.Windows.Forms.MessageBoxButtons]::OK,
                [System.Windows.Forms.MessageBoxIcon]::Error
            )
        }
    })

$form.add_Shown({
        try {
            $script:appRootNode = Build-AppModel
            Reset-AppState
            $statusLabel.Text = "Ready."
            Write-Log -Message "Content browser initialized successfully."
        }
        catch {
            Write-Log -Level "ERROR" -Message "Failed during form initialization: $($_.Exception.Message)"
            [void][System.Windows.Forms.MessageBox]::Show(
                "Failed to load browser data:`r`n$($_.Exception.Message)",
                "Cataclysm Content Browser",
                [System.Windows.Forms.MessageBoxButtons]::OK,
                [System.Windows.Forms.MessageBoxIcon]::Error
            )
            $form.Close()
        }
    })

$dialogResult = $form.ShowDialog()
Write-Log -Message "Content browser closed. DialogResult=$dialogResult"

