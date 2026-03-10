$ErrorActionPreference = 'Stop'

$mainStoryDir = Split-Path -Parent $PSScriptRoot
$chaptersDir = Join-Path $mainStoryDir 'chapters'
$outputPath = Join-Path $mainStoryDir 'chapter_metrics.md'

function Get-ChapterMetrics {
  param([string]$Path)

  $lines = Get-Content -LiteralPath $Path
  $start = 0
  while ($start -lt $lines.Count -and [string]::IsNullOrWhiteSpace($lines[$start])) { $start++ }
  if ($start -lt $lines.Count -and $lines[$start] -like '# Chapter*') {
    $start++
    while ($start -lt $lines.Count -and [string]::IsNullOrWhiteSpace($lines[$start])) { $start++ }
  }

  $body = if ($start -lt $lines.Count) { $lines[$start..($lines.Count - 1)] } else { @() }

  $paragraphs = New-Object System.Collections.Generic.List[string]
  $buffer = New-Object System.Collections.Generic.List[string]

  foreach ($line in $body) {
    if ([string]::IsNullOrWhiteSpace($line)) {
      if ($buffer.Count -gt 0) {
        $paragraphs.Add(($buffer -join ' ').Trim())
        $buffer.Clear()
      }
    }
    else {
      $buffer.Add($line.Trim())
    }
  }

  if ($buffer.Count -gt 0) {
    $paragraphs.Add(($buffer -join ' ').Trim())
  }

  $paragraphCount = $paragraphs.Count
  $wordCount = 0
  foreach ($p in $paragraphs) {
    if ($p) {
      $wordCount += ([regex]::Matches($p, '\b\w+\b').Count)
    }
  }

  $isArchived = ($paragraphCount -le 1 -and ($paragraphs -join ' ') -like 'Archived:*')

  [pscustomobject]@{
    File = Split-Path $Path -Leaf
    Chapter = [int](([regex]::Match((Split-Path $Path -Leaf), 'chapter-(\d+)')).Groups[1].Value)
    Paragraphs = $paragraphCount
    Words = $wordCount
    Archived = $isArchived
  }
}

$all = Get-ChildItem -LiteralPath $chaptersDir -Filter 'chapter-*.md' |
  Sort-Object Name |
  ForEach-Object { Get-ChapterMetrics -Path $_.FullName }

$active = $all | Where-Object { -not $_.Archived }
$archived = $all | Where-Object { $_.Archived }

$avgWords = if ($active.Count -gt 0) { [math]::Round((($active | Measure-Object -Property Words -Average).Average), 0) } else { 0 }
$avgParas = if ($active.Count -gt 0) { [math]::Round((($active | Measure-Object -Property Paragraphs -Average).Average), 0) } else { 0 }

function Get-Band {
  param([int]$Words)
  if ($Words -lt 1300) { return 'Lean' }
  if ($Words -gt 2400) { return 'Extended' }
  return 'Standard'
}

function Get-WatchFlag {
  param(
    [int]$Words,
    [int]$Avg
  )
  if ($Avg -le 0) { return '-' }
  $pct = [math]::Round((($Words - $Avg) / $Avg) * 100, 0)
  if ($pct -le -35) { return 'Short watch' }
  if ($pct -ge 35) { return 'Long watch' }
  return 'Within expected spread'
}

$activeRows = @()
foreach ($row in $active) {
  $activeRows += "| Chapter $($row.Chapter) | $($row.Paragraphs) | $($row.Words) | $(Get-Band -Words $row.Words) | $(Get-WatchFlag -Words $row.Words -Avg $avgWords) |"
}

$archivedRows = @()
foreach ($row in $archived) {
  $archivedRows += "| Chapter $($row.Chapter) | Archived placeholder |"
}
if ($archivedRows.Count -eq 0) {
  $archivedRows += "| - | None |"
}

$generated = Get-Date -Format 'yyyy-MM-dd HH:mm'

$content = @"
# Chapter Metrics

Generated: $generated

Purpose: Track chapter size so we can spot unusually short/long chapters while still allowing intentional variation.

## Soft Bands (Not Rules)
- Lean: under 1300 words
- Standard: 1300-2400 words
- Extended: over 2400 words

## Active Chapters
| Chapter | Paragraphs | Words | Size Band | Watch |
| --- | ---: | ---: | --- | --- |
$($activeRows -join "`r`n")

Active chapter averages:
- Average paragraphs: $avgParas
- Average words: $avgWords

## Archived Files
| Chapter | Status |
| --- | --- |
$($archivedRows -join "`r`n")

## Notes
- `Watch` is only a visibility signal, not a restriction.
- Re-run this script after major chapter edits.
"@

Set-Content -LiteralPath $outputPath -Value $content.TrimEnd() -Encoding UTF8
Write-Output "Updated $outputPath"


