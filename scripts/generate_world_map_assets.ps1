$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$workspaceRoot = Split-Path -Path $PSScriptRoot -Parent
$featurePath = Join-Path $workspaceRoot 'packages/content/base/world/world_map_features.json'
$regionPath = Join-Path $workspaceRoot 'packages/content/base/world/regions.json'
$outputRoot = Join-Path $workspaceRoot 'packages/content/base/world/map_assets'
if (-not (Test-Path -LiteralPath $outputRoot)) {
    New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
}

$featureDoc = Get-Content -LiteralPath $featurePath -Raw | ConvertFrom-Json
$regionDoc = Get-Content -LiteralPath $regionPath -Raw | ConvertFrom-Json
$featureRecord = $featureDoc.records[0]
$regionsById = @{}
foreach ($region in @($regionDoc.records)) {
    $regionsById[$region.id] = $region
}

function Convert-ToPointArray([object[]]$Points) {
    $result = New-Object 'System.Collections.Generic.List[System.Drawing.PointF]'
    foreach ($point in @($Points)) {
        [void]$result.Add((New-Object System.Drawing.PointF([single]$point.x, [single]$point.y)))
    }
    return $result.ToArray()
}

function Get-Centroid([System.Drawing.PointF[]]$Points) {
    $sumX = 0.0
    $sumY = 0.0
    foreach ($point in $Points) {
        $sumX += $point.X
        $sumY += $point.Y
    }
    return New-Object System.Drawing.PointF([single]($sumX / $Points.Length), [single]($sumY / $Points.Length))
}

function Scale-Polygon([System.Drawing.PointF[]]$Points, [float]$Factor) {
    $centroid = Get-Centroid -Points $Points
    $result = New-Object 'System.Collections.Generic.List[System.Drawing.PointF]'
    foreach ($point in $Points) {
        $scaledX = $centroid.X + (($point.X - $centroid.X) * $Factor)
        $scaledY = $centroid.Y + (($point.Y - $centroid.Y) * $Factor)
        [void]$result.Add((New-Object System.Drawing.PointF([single]$scaledX, [single]$scaledY)))
    }
    return $result.ToArray()
}

function Clamp-ColorChannel([int]$Value) {
    if ($Value -lt 0) { return 0 }
    if ($Value -gt 255) { return 255 }
    return $Value
}

function Get-BiomeRegionColor([string]$RegionId) {
    switch ($RegionId) {
        'region.auric_marches' { return [System.Drawing.Color]::FromArgb(214, 234, 214, 107) }
        'region.verdant_thalos' { return [System.Drawing.Color]::FromArgb(214, 118, 210, 86) }
        'region.shattercap_isles' { return [System.Drawing.Color]::FromArgb(214, 80, 198, 74) }
        'region.crownlands' { return [System.Drawing.Color]::FromArgb(214, 63, 182, 76) }
        'region.embersteppe' { return [System.Drawing.Color]::FromArgb(214, 226, 218, 118) }
        'region.sapphire_rivers' { return [System.Drawing.Color]::FromArgb(214, 173, 216, 98) }
        'region.jade_expanse' { return [System.Drawing.Color]::FromArgb(214, 182, 224, 101) }
        'region.windward_spine' { return [System.Drawing.Color]::FromArgb(214, 116, 198, 92) }
        'region.green_reach' { return [System.Drawing.Color]::FromArgb(214, 69, 174, 80) }
        'region.sailors_verge' { return [System.Drawing.Color]::FromArgb(214, 145, 213, 101) }
        'region.heart_basin' { return [System.Drawing.Color]::FromArgb(214, 155, 221, 100) }
        'region.emerald_mantle' { return [System.Drawing.Color]::FromArgb(214, 79, 190, 90) }
        'region.stormcap_coast' { return [System.Drawing.Color]::FromArgb(214, 59, 176, 84) }
        'region.silver_valleys' { return [System.Drawing.Color]::FromArgb(214, 104, 203, 92) }
        'region.thorn_peninsula' { return [System.Drawing.Color]::FromArgb(214, 85, 189, 90) }
        'region.watcher_coast' { return [System.Drawing.Color]::FromArgb(214, 74, 167, 82) }
        'region.myridian_chain' { return [System.Drawing.Color]::FromArgb(214, 92, 202, 80) }
        'region.lantern_isles' { return [System.Drawing.Color]::FromArgb(214, 198, 222, 120) }
        'region.serpents_wake' { return [System.Drawing.Color]::FromArgb(214, 88, 193, 87) }
        'region.dawnreach_isles' { return [System.Drawing.Color]::FromArgb(214, 163, 204, 145) }
        default { return [System.Drawing.Color]::FromArgb(214, 150, 200, 100) }
    }
}

function Get-ElevationRegionColor($RegionRecord) {
    $tags = @($RegionRecord.tags)
    if ($tags -contains 'highland' -or $tags -contains 'plateau' -or $tags -contains 'marches' -or $tags -contains 'old_realm') {
        return [System.Drawing.Color]::FromArgb(210, 234, 178, 138)
    }
    if ($tags -contains 'coastal' -or $tags -contains 'islands' -or $tags -contains 'maritime') {
        return [System.Drawing.Color]::FromArgb(198, 248, 233, 206)
    }
    if ($tags -contains 'lowlands' -or $tags -contains 'fertile' -or $tags -contains 'breadbasket' -or $tags -contains 'river_basin') {
        return [System.Drawing.Color]::FromArgb(202, 246, 223, 196)
    }
    if ($tags -contains 'forest' -or $tags -contains 'jungle') {
        return [System.Drawing.Color]::FromArgb(205, 238, 196, 160) }
    return [System.Drawing.Color]::FromArgb(202, 242, 205, 172)
}

function New-LandPath($FeatureRecord) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    foreach ($coastline in @($FeatureRecord.coastlines)) {
        $points = Convert-ToPointArray -Points $coastline.points
        if ($points.Length -ge 3) {
            $path.AddPolygon($points)
        }
    }
    return $path
}

function Draw-BaseMap([System.Drawing.Graphics]$Graphics, [string]$Mode, $FeatureRecord, $RegionsById) {
    $Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $Graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $Graphics.Clear([System.Drawing.Color]::FromArgb(72, 126, 237))

    $landPath = New-LandPath -FeatureRecord $FeatureRecord
    $coastGlowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(110, 110, 244, 245), 14)
    $coastGlowPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $landBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 244, 233))
    $coastOutlinePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 49, 56), 2)
    $riverPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 210, 234), 2.4)
    $mountainPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 176, 110, 72), 26)
    $mountainInnerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(210, 233, 163, 125), 9)
    $ridgeHighlightPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 255, 250, 240), 2.8)
    $mountainPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $mountainInnerPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $ridgeHighlightPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    try {
        $Graphics.DrawPath($coastGlowPen, $landPath)
        $Graphics.FillPath($landBrush, $landPath)
        $Graphics.SetClip($landPath)

        foreach ($footprint in @($FeatureRecord.regionFootprints)) {
            $regionId = [string]$footprint.regionIds[0]
            $regionRecord = $RegionsById[$regionId]
            $points = Convert-ToPointArray -Points $footprint.points
            if ($points.Length -lt 3) { continue }

            $baseColor = if ($Mode -eq 'Biome') { Get-BiomeRegionColor -RegionId $regionId } else { Get-ElevationRegionColor -RegionRecord $regionRecord }
            $baseBrush = New-Object System.Drawing.SolidBrush($baseColor)
            $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(
                    [int][Math]::Min(255, $baseColor.A),
                    (Clamp-ColorChannel -Value ($baseColor.R + 16)),
                    (Clamp-ColorChannel -Value ($baseColor.G + 12)),
                    (Clamp-ColorChannel -Value ($baseColor.B + 8))
                ))
            $innerPoints = Scale-Polygon -Points $points -Factor 0.72

            try {
                $Graphics.FillPolygon($baseBrush, $points)
                if ($innerPoints.Length -ge 3) {
                    $Graphics.FillPolygon($accentBrush, $innerPoints)
                }
            }
            finally {
                $baseBrush.Dispose()
                $accentBrush.Dispose()
            }
        }

        foreach ($mountain in @($FeatureRecord.mountainFeatures)) {
            $points = Convert-ToPointArray -Points $mountain.points
            if ($points.Length -ge 2) {
                $Graphics.DrawLines($mountainPen, $points)
                $Graphics.DrawLines($mountainInnerPen, $points)
                $Graphics.DrawLines($ridgeHighlightPen, $points)
            }
        }

        $Graphics.ResetClip()

        foreach ($river in @($FeatureRecord.riverFeatures)) {
            $points = Convert-ToPointArray -Points $river.points
            if ($points.Length -ge 2) {
                $Graphics.DrawLines($riverPen, $points)
            }
        }

        $Graphics.DrawPath($coastOutlinePen, $landPath)
    }
    finally {
        $landPath.Dispose()
        $coastGlowPen.Dispose()
        $landBrush.Dispose()
        $coastOutlinePen.Dispose()
        $riverPen.Dispose()
        $mountainPen.Dispose()
        $mountainInnerPen.Dispose()
        $ridgeHighlightPen.Dispose()
    }
}

foreach ($mode in @('Biome', 'Elevation')) {
    $width = [int]$featureRecord.referenceImageWidthPx
    $height = [int]$featureRecord.referenceImageHeightPx
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
        Draw-BaseMap -Graphics $graphics -Mode $mode -FeatureRecord $featureRecord -RegionsById $regionsById
        $outputPath = Join-Path $outputRoot ("first_world_{0}.png" -f $mode.ToLowerInvariant())
        $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Output $outputPath
    }
    finally {
        $graphics.Dispose()
        $bitmap.Dispose()
    }
}
