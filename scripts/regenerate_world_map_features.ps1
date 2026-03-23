Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

if (-not ("RasterGeometry" -as [type])) {
    Add-Type -ReferencedAssemblies @("System.Drawing", "System.Drawing.Primitives") -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;

public static class RasterGeometry
{
    private struct Segment
    {
        public Point Start;
        public Point End;

        public Segment(Point start, Point end)
        {
            Start = start;
            End = end;
        }
    }

    public static bool IsWater(Color color)
    {
        return color.B > 150 && (color.B - color.G) > 25 && (color.B - color.R) > 80;
    }

    public static Bitmap CreateLandMask(Bitmap source)
    {
        var bitmap = new Bitmap(source.Width, source.Height);
        for (var y = 0; y < source.Height; y++)
        {
            for (var x = 0; x < source.Width; x++)
            {
                var color = source.GetPixel(x, y);
                bitmap.SetPixel(x, y, IsWater(color) ? Color.Black : Color.White);
            }
        }

        return bitmap;
    }

    public static Bitmap CreateWaterMask(Bitmap source)
    {
        var bitmap = new Bitmap(source.Width, source.Height);
        for (var y = 0; y < source.Height; y++)
        {
            for (var x = 0; x < source.Width; x++)
            {
                var color = source.GetPixel(x, y);
                bitmap.SetPixel(x, y, IsWater(color) ? Color.White : Color.Black);
            }
        }

        return bitmap;
    }

    public static Bitmap IntersectMasks(Bitmap left, Bitmap right)
    {
        if (left.Width != right.Width || left.Height != right.Height)
        {
            throw new InvalidOperationException("Mask sizes must match.");
        }

        var bitmap = new Bitmap(left.Width, left.Height);
        for (var y = 0; y < left.Height; y++)
        {
            for (var x = 0; x < left.Width; x++)
            {
                var on = left.GetPixel(x, y).R > 127 && right.GetPixel(x, y).R > 127;
                bitmap.SetPixel(x, y, on ? Color.White : Color.Black);
            }
        }

        return bitmap;
    }

    public static bool MaskHasPixels(Bitmap bitmap)
    {
        for (var y = 0; y < bitmap.Height; y++)
        {
            for (var x = 0; x < bitmap.Width; x++)
            {
                if (bitmap.GetPixel(x, y).R > 127)
                {
                    return true;
                }
            }
        }

        return false;
    }

    public static List<Point[]> ExtractPolygons(Bitmap maskBitmap, int minArea)
    {
        var width = maskBitmap.Width;
        var height = maskBitmap.Height;
        var mask = new bool[width, height];
        var visited = new bool[width, height];
        var polygons = new List<Point[]>();
        var queue = new Queue<Point>();

        for (var y = 0; y < height; y++)
        {
            for (var x = 0; x < width; x++)
            {
                mask[x, y] = maskBitmap.GetPixel(x, y).R > 127;
            }
        }

        var directions = new[]
        {
            new Point(-1, 0),
            new Point(1, 0),
            new Point(0, -1),
            new Point(0, 1),
            new Point(-1, -1),
            new Point(1, -1),
            new Point(-1, 1),
            new Point(1, 1)
        };

        for (var y = 0; y < height; y++)
        {
            for (var x = 0; x < width; x++)
            {
                if (!mask[x, y] || visited[x, y])
                {
                    continue;
                }

                var pixels = new List<Point>();
                var minX = x;
                var maxX = x;
                var minY = y;
                var maxY = y;

                visited[x, y] = true;
                queue.Enqueue(new Point(x, y));

                while (queue.Count > 0)
                {
                    var current = queue.Dequeue();
                    pixels.Add(current);
                    if (current.X < minX) minX = current.X;
                    if (current.X > maxX) maxX = current.X;
                    if (current.Y < minY) minY = current.Y;
                    if (current.Y > maxY) maxY = current.Y;

                    foreach (var direction in directions)
                    {
                        var nextX = current.X + direction.X;
                        var nextY = current.Y + direction.Y;
                        if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height)
                        {
                            continue;
                        }

                        if (!mask[nextX, nextY] || visited[nextX, nextY])
                        {
                            continue;
                        }

                        visited[nextX, nextY] = true;
                        queue.Enqueue(new Point(nextX, nextY));
                    }
                }

                if (pixels.Count < minArea)
                {
                    continue;
                }

                var componentWidth = (maxX - minX) + 1;
                var componentHeight = (maxY - minY) + 1;
                var componentMask = new bool[componentWidth, componentHeight];
                foreach (var pixel in pixels)
                {
                    componentMask[pixel.X - minX, pixel.Y - minY] = true;
                }

                var contour = ExtractLargestContour(componentMask, minX, minY);
                if (contour != null && contour.Length >= 3)
                {
                    polygons.Add(contour);
                }
            }
        }

        return polygons;
    }

    private static Point[] ExtractLargestContour(bool[,] mask, int offsetX, int offsetY)
    {
        var width = mask.GetLength(0);
        var height = mask.GetLength(1);
        var segments = new List<Segment>();

        for (var y = 0; y < height; y++)
        {
            for (var x = 0; x < width; x++)
            {
                if (!mask[x, y])
                {
                    continue;
                }

                if (y == 0 || !mask[x, y - 1])
                {
                    segments.Add(new Segment(
                        new Point(offsetX + x, offsetY + y),
                        new Point(offsetX + x + 1, offsetY + y)));
                }

                if (x == width - 1 || !mask[x + 1, y])
                {
                    segments.Add(new Segment(
                        new Point(offsetX + x + 1, offsetY + y),
                        new Point(offsetX + x + 1, offsetY + y + 1)));
                }

                if (y == height - 1 || !mask[x, y + 1])
                {
                    segments.Add(new Segment(
                        new Point(offsetX + x + 1, offsetY + y + 1),
                        new Point(offsetX + x, offsetY + y + 1)));
                }

                if (x == 0 || !mask[x - 1, y])
                {
                    segments.Add(new Segment(
                        new Point(offsetX + x, offsetY + y + 1),
                        new Point(offsetX + x, offsetY + y)));
                }
            }
        }

        if (segments.Count == 0)
        {
            return null;
        }

        var edgesByStart = new Dictionary<long, List<int>>();
        for (var index = 0; index < segments.Count; index++)
        {
            var key = GetPointKey(segments[index].Start);
            if (!edgesByStart.ContainsKey(key))
            {
                edgesByStart[key] = new List<int>();
            }

            edgesByStart[key].Add(index);
        }

        var used = new bool[segments.Count];
        var bestLoop = (List<Point>)null;
        double bestArea = 0.0;

        for (var index = 0; index < segments.Count; index++)
        {
            if (used[index])
            {
                continue;
            }

            var loop = new List<Point>();
            var start = segments[index].Start;
            var current = segments[index].End;
            used[index] = true;
            loop.Add(start);
            loop.Add(current);

            while (!current.Equals(start))
            {
                var key = GetPointKey(current);
                if (!edgesByStart.ContainsKey(key))
                {
                    loop.Clear();
                    break;
                }

                var nextIndex = -1;
                foreach (var candidate in edgesByStart[key])
                {
                    if (!used[candidate])
                    {
                        nextIndex = candidate;
                        break;
                    }
                }

                if (nextIndex < 0)
                {
                    loop.Clear();
                    break;
                }

                used[nextIndex] = true;
                current = segments[nextIndex].End;
                loop.Add(current);
            }

            if (loop.Count < 4)
            {
                continue;
            }

            if (loop[loop.Count - 1].Equals(loop[0]))
            {
                loop.RemoveAt(loop.Count - 1);
            }

            var simplified = SimplifyLoop(loop);
            var area = Math.Abs(ComputePolygonArea(simplified));
            if (area > bestArea)
            {
                bestArea = area;
                bestLoop = simplified;
            }
        }

        return bestLoop == null ? null : bestLoop.ToArray();
    }

    private static List<Point> SimplifyLoop(List<Point> points)
    {
        var loop = new List<Point>(points);

        var changed = true;
        while (changed && loop.Count >= 4)
        {
            changed = false;
            for (var index = 0; index < loop.Count; index++)
            {
                var prev = loop[(index - 1 + loop.Count) % loop.Count];
                var current = loop[index];
                var next = loop[(index + 1) % loop.Count];
                if (IsCollinear(prev, current, next))
                {
                    loop.RemoveAt(index);
                    changed = true;
                    break;
                }
            }
        }

        if (loop.Count > 600)
        {
            var step = (int)Math.Ceiling((double)loop.Count / 600.0);
            var reduced = new List<Point>();
            for (var index = 0; index < loop.Count; index += step)
            {
                reduced.Add(loop[index]);
            }
            loop = reduced;
        }

        return loop;
    }

    private static bool IsCollinear(Point a, Point b, Point c)
    {
        return ((b.X - a.X) * (c.Y - b.Y)) - ((b.Y - a.Y) * (c.X - b.X)) == 0;
    }

    private static double ComputePolygonArea(List<Point> points)
    {
        var area = 0.0;
        for (var index = 0; index < points.Count; index++)
        {
            var current = points[index];
            var next = points[(index + 1) % points.Count];
            area += (current.X * next.Y) - (next.X * current.Y);
        }

        return area / 2.0;
    }

    public static Bitmap[] PartitionMaskByAnchors(Bitmap maskBitmap, int regionCount, Point[] anchors, int[] anchorRegionIndexes)
    {
        if (anchors == null || anchorRegionIndexes == null || anchors.Length != anchorRegionIndexes.Length)
        {
            throw new InvalidOperationException("Anchor points and region indexes must align.");
        }

        var outputs = new Bitmap[regionCount];
        for (var index = 0; index < regionCount; index++)
        {
            outputs[index] = new Bitmap(maskBitmap.Width, maskBitmap.Height);
            using (var graphics = Graphics.FromImage(outputs[index]))
            {
                graphics.Clear(Color.Black);
            }
        }

        for (var y = 0; y < maskBitmap.Height; y++)
        {
            for (var x = 0; x < maskBitmap.Width; x++)
            {
                if (maskBitmap.GetPixel(x, y).R <= 127)
                {
                    continue;
                }

                var bestDistance = double.MaxValue;
                var bestRegionIndex = -1;
                for (var anchorIndex = 0; anchorIndex < anchors.Length; anchorIndex++)
                {
                    var anchor = anchors[anchorIndex];
                    var dx = x - anchor.X;
                    var dy = y - anchor.Y;
                    var distance = (dx * dx) + (dy * dy);
                    if (distance < bestDistance)
                    {
                        bestDistance = distance;
                        bestRegionIndex = anchorRegionIndexes[anchorIndex];
                    }
                }

                if (bestRegionIndex >= 0)
                {
                    outputs[bestRegionIndex].SetPixel(x, y, Color.White);
                }
            }
        }

        return outputs;
    }

    public static Point GetCentroid(Point[] points)
    {
        if (points == null || points.Length == 0)
        {
            return new Point(0, 0);
        }

        long totalX = 0;
        long totalY = 0;
        for (var index = 0; index < points.Length; index++)
        {
            totalX += points[index].X;
            totalY += points[index].Y;
        }

        return new Point((int)(totalX / points.Length), (int)(totalY / points.Length));
    }

    private static long GetPointKey(Point point)
    {
        return ((long)point.X << 32) ^ (uint)point.Y;
    }
}
"@
}

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$worldMapsPath = Join-Path $workspaceRoot "packages/content/base/world/world_maps.json"
$featurePath = Join-Path $workspaceRoot "packages/content/base/world/world_map_features.json"
$regionPath = Join-Path $workspaceRoot "packages/content/base/world/regions.json"
$settlementPath = Join-Path $workspaceRoot "packages/content/base/world/settlements.json"

$worldMapData = Get-Content -LiteralPath $worldMapsPath -Raw | ConvertFrom-Json
$featureData = Get-Content -LiteralPath $featurePath -Raw | ConvertFrom-Json
$regionData = Get-Content -LiteralPath $regionPath -Raw | ConvertFrom-Json
$settlementData = Get-Content -LiteralPath $settlementPath -Raw | ConvertFrom-Json

$worldMapRecord = @($worldMapData.records)[0]
$featureRecord = @($featureData.records)[0]
$regionRecords = @($regionData.records)
$settlementRecords = @($settlementData.records)

$referenceWidth = [int](($featureRecord.referenceImageWidthPx))
$referenceHeight = [int](($featureRecord.referenceImageHeightPx))
$sampleScale = 2
$sampleWidth = [int]($referenceWidth / $sampleScale)
$sampleHeight = [int]($referenceHeight / $sampleScale)

$sourcePath = Join-Path $workspaceRoot ([string]$worldMapRecord.layerAssetPaths.biome)
$sourceRect = New-Object System.Drawing.Rectangle `
    -ArgumentList `
    ([int]$worldMapRecord.assetReferenceRectPx.x), `
    ([int]$worldMapRecord.assetReferenceRectPx.y), `
    ([int]$worldMapRecord.assetReferenceRectPx.width), `
    ([int]$worldMapRecord.assetReferenceRectPx.height)

function New-ScaledBitmap {
    param(
        [string]$Path,
        [System.Drawing.Rectangle]$SourceRect,
        [int]$Width,
        [int]$Height
    )

    $sourceBitmap = [System.Drawing.Bitmap]::FromFile($Path)
    try {
        $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.Clear([System.Drawing.Color]::Black)
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.DrawImage(
                $sourceBitmap,
                (New-Object System.Drawing.Rectangle -ArgumentList 0, 0, $Width, $Height),
                $SourceRect,
                [System.Drawing.GraphicsUnit]::Pixel
            )
        }
        finally {
            $graphics.Dispose()
        }

        return $bitmap
    }
    finally {
        $sourceBitmap.Dispose()
    }
}

function Convert-ToSamplePoints {
    param([object[]]$Points)

    $result = New-Object 'System.Collections.Generic.List[System.Drawing.Point]'
    foreach ($point in @($Points)) {
        $result.Add((New-Object System.Drawing.Point -ArgumentList ([int][Math]::Round($point.x / $sampleScale)), ([int][Math]::Round($point.y / $sampleScale))))
    }

    return $result.ToArray()
}

function Convert-ToJsonPoints {
    param([System.Drawing.Point[]]$Points)

    $result = New-Object 'System.Collections.Generic.List[object]'
    foreach ($point in @($Points)) {
        $scaledX = [int][Math]::Max(0, [Math]::Min($referenceWidth - 1, ($point.X * $sampleScale)))
        $scaledY = [int][Math]::Max(0, [Math]::Min($referenceHeight - 1, ($point.Y * $sampleScale)))
        $result.Add([ordered]@{
                x = $scaledX
                y = $scaledY
            })
    }

    return $result.ToArray()
}

function New-PolygonMaskBitmap {
    param(
        [System.Drawing.Point[]]$Points,
        [int]$Width,
        [int]$Height
    )

    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.Clear([System.Drawing.Color]::Black)
        if ($Points.Length -ge 3) {
            $graphics.FillPolygon([System.Drawing.Brushes]::White, $Points)
        }
    }
    finally {
        $graphics.Dispose()
    }

    return $bitmap
}

function Get-ZoneRegionId {
    param(
        [string]$ZoneId,
        [object[]]$Regions
    )

    $candidate = $null
    foreach ($region in @($Regions | Sort-Object { $_.slug.Length } -Descending)) {
        if ($ZoneId -match [regex]::Escape([string]$region.slug)) {
            $candidate = [string]$region.id
            break
        }
    }

    return $candidate
}

function Get-BaseFeatureClone {
    param($Feature)

    $clone = [ordered]@{
        id = [string]$Feature.id
        name = [string]$Feature.name
        regionIds = @($Feature.regionIds)
        notes = [string]$Feature.notes
    }

    $propertyNames = @($Feature.PSObject.Properties.Name)
    if ($Feature -is [System.Collections.IDictionary]) {
        $propertyNames += @($Feature.Keys | ForEach-Object { [string]$_ })
    }

    if ($propertyNames -contains 'climateProfileId') {
        $clone.climateProfileId = [string]$Feature.climateProfileId
    }

    if ($propertyNames -contains 'biomeId') {
        $clone.biomeId = [string]$Feature.biomeId
    }

    return $clone
}

function Get-CanonicalFeatureId {
    param([string]$Id)

    return ($Id -replace '(\.part_\d+)+$','')
}

function Get-CanonicalFeatureName {
    param([string]$Name)

    return ($Name -replace '( Part \d+)+$','')
}

function Convert-MaskToFeatures {
    param(
        $BaseFeature,
        [System.Drawing.Bitmap]$MaskBitmap,
        [int]$MinArea = 20
    )

    $polygons = [RasterGeometry]::ExtractPolygons($MaskBitmap, $MinArea)
    if ($null -eq $polygons -or $polygons.Count -eq 0) {
        return @()
    }

    $baseClone = Get-BaseFeatureClone -Feature $BaseFeature
    $features = New-Object 'System.Collections.Generic.List[object]'

    for ($index = 0; $index -lt $polygons.Count; $index++) {
        $suffix = if ($polygons.Count -gt 1) { ".part_$($index + 1)" } else { "" }
        $feature = [ordered]@{}
        foreach ($propertyName in $baseClone.Keys) {
            $feature[$propertyName] = $baseClone[$propertyName]
        }

        if ($suffix) {
            $feature.id = "$($feature.id)$suffix"
            $feature.name = "$($feature.name) Part $($index + 1)"
        }

        $feature.points = Convert-ToJsonPoints -Points $polygons[$index]
        $features.Add($feature)
    }

    return $features.ToArray()
}

function New-UnionMaskBitmap {
    param(
        [int]$Width,
        [int]$Height
    )

    $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
        $graphics.Clear([System.Drawing.Color]::Black)
    }
    finally {
        $graphics.Dispose()
    }

    return $bitmap
}

function Add-PolygonToMaskBitmap {
    param(
        [System.Drawing.Bitmap]$MaskBitmap,
        [object[]]$Points
    )

    $samplePoints = Convert-ToSamplePoints -Points $Points
    if ($samplePoints.Length -lt 3) {
        return
    }

    $graphics = [System.Drawing.Graphics]::FromImage($MaskBitmap)
    try {
        $graphics.FillPolygon([System.Drawing.Brushes]::White, $samplePoints)
    }
    finally {
        $graphics.Dispose()
    }
}

function Add-PointBufferToMaskBitmap {
    param(
        [System.Drawing.Bitmap]$MaskBitmap,
        [int]$PixelX,
        [int]$PixelY,
        [int]$Radius = 2
    )

    $graphics = [System.Drawing.Graphics]::FromImage($MaskBitmap)
    try {
        $graphics.FillEllipse(
            [System.Drawing.Brushes]::White,
            [single]($PixelX - $Radius),
            [single]($PixelY - $Radius),
            [single](($Radius * 2) + 1),
            [single](($Radius * 2) + 1)
        )
    }
    finally {
        $graphics.Dispose()
    }
}

$referenceBitmap = New-ScaledBitmap -Path $sourcePath -SourceRect $sourceRect -Width $sampleWidth -Height $sampleHeight
$landMask = [RasterGeometry]::CreateLandMask($referenceBitmap)
$waterMask = [RasterGeometry]::CreateWaterMask($referenceBitmap)
$regionMasksById = @{}

try {
    $newCoastlines = New-Object 'System.Collections.Generic.List[object]'
    $coastPolygons = [RasterGeometry]::ExtractPolygons($landMask, 24)
    for ($index = 0; $index -lt $coastPolygons.Count; $index++) {
        $newCoastlines.Add([ordered]@{
                id = "feature.coastline.first_world.part_$($index + 1)"
                name = "First World Coastline Part $($index + 1)"
                regionIds = @("region.azure_vast")
                notes = "Traced from the source biome map and cropped to the canonical map frame."
                points = Convert-ToJsonPoints -Points $coastPolygons[$index]
            })
    }

    $newRegionFootprints = New-Object 'System.Collections.Generic.List[object]'
    $regionBaseFeatures = @{}
    $regionAnchorLookup = @{}

    foreach ($footprint in @($featureRecord.regionFootprints)) {
        foreach ($regionId in @($footprint.regionIds)) {
            $regionId = [string]$regionId
            if (-not $regionBaseFeatures.ContainsKey($regionId)) {
                $baseFeature = Get-BaseFeatureClone -Feature $footprint
                $baseFeature.id = Get-CanonicalFeatureId -Id ([string]$baseFeature.id)
                $baseFeature.name = Get-CanonicalFeatureName -Name ([string]$baseFeature.name)
                $regionBaseFeatures[$regionId] = $baseFeature
            }
            if (-not $regionAnchorLookup.ContainsKey($regionId)) {
                $regionAnchorLookup[$regionId] = New-Object 'System.Collections.Generic.List[System.Drawing.Point]'
            }

            $footprintCentroid = [RasterGeometry]::GetCentroid((Convert-ToSamplePoints -Points $footprint.points))
            $regionAnchorLookup[$regionId].Add($footprintCentroid)
        }
    }

    foreach ($settlement in @($settlementRecords)) {
        $siteClass = if ($null -ne $settlement.mapLocation -and $settlement.mapLocation.PSObject.Properties.Name -contains 'siteClass') {
            [string]$settlement.mapLocation.siteClass
        }
        else {
            'surface'
        }
        if ($siteClass -eq 'underwater' -or $siteClass -eq 'subterranean') {
            continue
        }

        $regionId = if ($settlement.PSObject.Properties.Name -contains 'regionId') { [string]$settlement.regionId } else { '' }
        if ([string]::IsNullOrWhiteSpace($regionId) -or -not $regionAnchorLookup.ContainsKey($regionId)) {
            continue
        }

        $regionAnchorLookup[$regionId].Add((New-Object System.Drawing.Point -ArgumentList ([int][Math]::Round($settlement.mapLocation.pixelX / $sampleScale)), ([int][Math]::Round($settlement.mapLocation.pixelY / $sampleScale))))
    }

    $orderedRegionIds = @($regionBaseFeatures.Keys | Sort-Object)
    $allAnchors = New-Object 'System.Collections.Generic.List[System.Drawing.Point]'
    $allAnchorRegionIndexes = New-Object 'System.Collections.Generic.List[int]'

    for ($regionIndex = 0; $regionIndex -lt $orderedRegionIds.Count; $regionIndex++) {
        $regionId = $orderedRegionIds[$regionIndex]
        foreach ($anchor in @($regionAnchorLookup[$regionId])) {
            $allAnchors.Add($anchor)
            $allAnchorRegionIndexes.Add($regionIndex)
        }
    }

    $partitionedMasks = [RasterGeometry]::PartitionMaskByAnchors($landMask, $orderedRegionIds.Count, $allAnchors.ToArray(), $allAnchorRegionIndexes.ToArray())
    try {
        for ($regionIndex = 0; $regionIndex -lt $orderedRegionIds.Count; $regionIndex++) {
            $regionId = $orderedRegionIds[$regionIndex]
            $baseFeature = $regionBaseFeatures[$regionId]
            $regionMasksById[$regionId] = $partitionedMasks[$regionIndex]

            foreach ($settlement in @($settlementRecords | Where-Object { [string]$_.regionId -eq $regionId -and [string]$_.mapLocation.siteClass -ne 'underwater' })) {
                Add-PointBufferToMaskBitmap `
                    -MaskBitmap $regionMasksById[$regionId] `
                    -PixelX ([int][Math]::Round($settlement.mapLocation.pixelX / $sampleScale)) `
                    -PixelY ([int][Math]::Round($settlement.mapLocation.pixelY / $sampleScale)) `
                    -Radius 2
            }

            $partitionFeatures = @(Convert-MaskToFeatures -BaseFeature $baseFeature -MaskBitmap $partitionedMasks[$regionIndex] -MinArea 12)
            if ($partitionFeatures.Count -eq 0) {
                $partitionFeatures = @($baseFeature)
            }

            foreach ($feature in @($partitionFeatures)) {
                $newRegionFootprints.Add($feature)
            }
        }
    }
    finally {
        foreach ($mask in @($partitionedMasks)) {
            if ($null -ne $mask -and -not ($regionMasksById.Values -contains $mask)) {
                $mask.Dispose()
            }
        }
    }

    $canonicalBiomeZonesById = @{}
    foreach ($zone in @($featureRecord.biomeZones)) {
        $canonicalZoneId = Get-CanonicalFeatureId -Id ([string]$zone.id)
        if (-not $canonicalBiomeZonesById.ContainsKey($canonicalZoneId)) {
            $zoneClone = Get-BaseFeatureClone -Feature $zone
            $zoneClone.id = $canonicalZoneId
            $zoneClone.name = Get-CanonicalFeatureName -Name ([string]$zoneClone.name)
            $zoneClone.points = @($zone.points)
            $canonicalBiomeZonesById[$canonicalZoneId] = $zoneClone
        }
    }

    $canonicalBiomeZones = @($canonicalBiomeZonesById.Values)
    $zoneRegionSurfaceCounts = @{}
    foreach ($zone in @($canonicalBiomeZones)) {
        $biomeId = [string]$zone.biomeId
        if ($biomeId -match '^biome\.marine\.' -or $biomeId -match '^biome\.subterranean\.') {
            continue
        }

        $regionId = Get-ZoneRegionId -ZoneId ([string]$zone.id) -Regions $regionRecords
        if ([string]::IsNullOrWhiteSpace($regionId)) {
            continue
        }

        if (-not $zoneRegionSurfaceCounts.ContainsKey($regionId)) {
            $zoneRegionSurfaceCounts[$regionId] = 0
        }

        $zoneRegionSurfaceCounts[$regionId]++
    }

    $newBiomeZones = New-Object 'System.Collections.Generic.List[object]'
    foreach ($zone in @($canonicalBiomeZones)) {
        $biomeId = [string]$zone.biomeId
        $regionId = Get-ZoneRegionId -ZoneId ([string]$zone.id) -Regions $regionRecords
        $workingMask = $null
        $currentMask = $null
        $regionMask = $null
        $disposeWorkingMask = $false

        try {
            $zoneSettlements = @($settlementRecords | Where-Object {
                    (([string]$_.mapLocation.biomeZoneId) -eq ([string]$zone.id) -or ([string]$_.mapLocation.biomeZoneId).StartsWith(([string]$zone.id) + '.part_')) -and
                    ([string]$_.mapLocation.siteClass -ne 'underwater')
                })
            if ($biomeId -match '^biome\.marine\.') {
                $currentMask = New-PolygonMaskBitmap -Points (Convert-ToSamplePoints -Points $zone.points) -Width $sampleWidth -Height $sampleHeight
                $workingMask = [RasterGeometry]::IntersectMasks($currentMask, $waterMask)
                $disposeWorkingMask = $true
            }
            elseif (-not [string]::IsNullOrWhiteSpace($regionId) -and $zoneRegionSurfaceCounts[$regionId] -eq 1 -and $biomeId -notmatch '^biome\.subterranean\.') {
                $workingMask = $regionMasksById[$regionId]
            }
            else {
                $currentMask = New-PolygonMaskBitmap -Points (Convert-ToSamplePoints -Points $zone.points) -Width $sampleWidth -Height $sampleHeight
                $baseMask = if ($biomeId -match '^biome\.marine\.') { $waterMask } else { $landMask }
                $workingMask = [RasterGeometry]::IntersectMasks($currentMask, $baseMask)
                $disposeWorkingMask = $true

                if (-not [string]::IsNullOrWhiteSpace($regionId) -and $regionMasksById.ContainsKey($regionId)) {
                    $regionMask = $regionMasksById[$regionId]
                    $regionBoundMask = [RasterGeometry]::IntersectMasks($workingMask, $regionMask)
                    if ($disposeWorkingMask -and $null -ne $workingMask) {
                        $workingMask.Dispose()
                    }
                    $workingMask = $regionBoundMask
                    $disposeWorkingMask = $true
                }
            }

            if ($null -ne $workingMask) {
                foreach ($settlement in @($zoneSettlements)) {
                    Add-PointBufferToMaskBitmap `
                        -MaskBitmap $workingMask `
                        -PixelX ([int][Math]::Round($settlement.mapLocation.pixelX / $sampleScale)) `
                        -PixelY ([int][Math]::Round($settlement.mapLocation.pixelY / $sampleScale)) `
                        -Radius 2
                }
            }

            if ($null -eq $workingMask -or -not [RasterGeometry]::MaskHasPixels($workingMask)) {
                $newBiomeZones.Add($zone)
                continue
            }

            $convertedZones = @(Convert-MaskToFeatures -BaseFeature $zone -MaskBitmap $workingMask -MinArea 2)
            if ($convertedZones.Count -eq 0) {
                $newBiomeZones.Add($zone)
            }
            else {
                foreach ($feature in @($convertedZones)) {
                    $newBiomeZones.Add($feature)
                }
            }
        }
        finally {
            if ($null -ne $currentMask) {
                $currentMask.Dispose()
            }
            if ($disposeWorkingMask -and $null -ne $workingMask) {
                $workingMask.Dispose()
            }
        }
    }

    $featureRecord.summary = "Source-aligned feature geometry tying settlements, region footprints, biome zones, rivers, mountain belts, and travel corridors to the canonical 2048x1152 reference grid."
    $featureRecord.coastlines = $newCoastlines.ToArray()
    $featureRecord.regionFootprints = $newRegionFootprints.ToArray()
    $featureRecord.biomeZones = $newBiomeZones.ToArray()

    $jsonText = $featureData | ConvertTo-Json -Depth 100
    Set-Content -LiteralPath $featurePath -Value $jsonText -Encoding UTF8
}
finally {
    $referenceBitmap.Dispose()
    $landMask.Dispose()
    $waterMask.Dispose()
    foreach ($mask in $regionMasksById.Values) {
        $mask.Dispose()
    }
}
