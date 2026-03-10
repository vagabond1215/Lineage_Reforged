$ErrorActionPreference='Stop'

$workspace = 'C:\Users\vagab\OneDrive\Documents\New project'
$storyDoc = 'C:\Users\vagab\OneDrive\Documents\Justice.docx'
$refDoc = 'C:\Users\vagab\OneDrive\Desktop\story_reference_bible.docx'

function Get-DocxParagraphs {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [switch]$KeepEmpty
  )

  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
  try {
    $entry = $zip.GetEntry('word/document.xml')
    if (-not $entry) { throw "word/document.xml not found in $Path" }
    $reader = New-Object System.IO.StreamReader($entry.Open())
    $xmlText = $reader.ReadToEnd()
    $reader.Close()
  }
  finally {
    $zip.Dispose()
  }

  [xml]$doc = $xmlText
  $ns = New-Object System.Xml.XmlNamespaceManager($doc.NameTable)
  $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')

  $results = New-Object System.Collections.Generic.List[string]
  foreach ($p in $doc.SelectNodes('//w:p', $ns)) {
    $text = (($p.SelectNodes('.//w:t', $ns) | ForEach-Object { $_.InnerText }) -join '').Trim()
    if ($KeepEmpty) {
      $results.Add($text)
    }
    elseif ($text) {
      $results.Add($text)
    }
  }

  return $results
}

function New-MarkdownFile {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Content
  )

  $dir = Split-Path -Parent $Path
  if (-not (Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }

  Set-Content -LiteralPath $Path -Value $Content -Encoding UTF8
}

$storyRoot = Join-Path $workspace 'story'
$mainStoryRoot = Join-Path $storyRoot 'main_story'
$chaptersRoot = Join-Path $mainStoryRoot 'chapters'
$referenceRoot = Join-Path $storyRoot 'reference'
$charactersRoot = Join-Path $referenceRoot 'characters'
$locationsRoot = Join-Path $referenceRoot 'locations'
$divineRoot = Join-Path $referenceRoot 'divine'
$artifactsRoot = Join-Path $referenceRoot 'artifacts'
$loreRoot = Join-Path $referenceRoot 'lore'
$threadsRoot = Join-Path $referenceRoot 'threads'
$continuityRoot = Join-Path $storyRoot 'continuity'

$allDirs = @(
  $storyRoot,
  $mainStoryRoot,
  $chaptersRoot,
  $referenceRoot,
  $charactersRoot,
  $locationsRoot,
  $divineRoot,
  $artifactsRoot,
  $loreRoot,
  $threadsRoot,
  $continuityRoot
)

foreach ($dir in $allDirs) {
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

$storyParasWithGaps = Get-DocxParagraphs -Path $storyDoc -KeepEmpty
$chapterBuckets = New-Object System.Collections.Generic.List[object]
$current = New-Object System.Collections.Generic.List[string]

foreach ($line in $storyParasWithGaps) {
  if ([string]::IsNullOrWhiteSpace($line)) {
    if ($current.Count -gt 0) {
      $chapterBuckets.Add(@($current.ToArray()))
      $current = New-Object System.Collections.Generic.List[string]
    }
    continue
  }

  $current.Add($line)
}

if ($current.Count -gt 0) {
  $chapterBuckets.Add(@($current.ToArray()))
}

$chapterSummaries = @()
for ($i = 0; $i -lt $chapterBuckets.Count; $i++) {
  $chapterNumber = $i + 1
  $chapterFile = Join-Path $chaptersRoot ("chapter-{0:D2}.md" -f $chapterNumber)
  $firstLine = $chapterBuckets[$i][0]
  $chapterBody = $chapterBuckets[$i] -join "`r`n`r`n"

  $chapterContent = @"
# Chapter $chapterNumber

_Source: Justice.docx (split by existing blank-line scene breaks)_

$chapterBody
"@

  New-MarkdownFile -Path $chapterFile -Content $chapterContent.TrimEnd()

  $summary = if ($firstLine.Length -gt 90) { $firstLine.Substring(0, 90) + '...' } else { $firstLine }
  $chapterSummaries += "- Chapter ${chapterNumber}: $summary"
}

$mainStoryReadme = @"
# Main Story

This folder contains the story draft split into chapter files.

## Chapter Order
$($chapterSummaries -join "`r`n")

## Notes
- Source file: Justice.docx
- Split logic: existing blank-line scene/chapter breaks in the source document
- If you re-export from Word, keep a single blank paragraph between chapters to preserve this split behavior
"@
New-MarkdownFile -Path (Join-Path $mainStoryRoot 'README.md') -Content $mainStoryReadme.TrimEnd()

$characterFiles = @{
  'sehir.md' = @"
# Sehir

## Role / Titles
- Royal Advisor to the King
- Legal Scholar and Arbiter of Crown Statutes
- Former member of a forgotten divine order
- Former wielder of the legendary weapon Cataclysm

## Public Reputation
- Respected legal authority
- Known for calm, rational judgment
- Seen as scholarly and non-threatening

## Hidden Past
- Once served a divine order connected to the Goddess of Justice
- Wielded immense divine power
- Carried the weapon Cataclysm
- Appears to have lost memories of this life

## Traits
- Physically stronger than he appears
- Analytical and observant
- Morally principled

## Current Situation
- On expedition to Blackstone Camp
- Unaware of assassination plot
- Being watched by the Goddess of Justice
"@;

  'the_queen.md' = @"
# The Queen

## Role / Titles
- Queen of the Kingdom
- Political strategist
- Secret antagonist

## Public Persona
- Elegant, admired by citizens
- Known for economic initiatives

## Hidden Reality
- Manipulates influence networks and covert agents
- Eliminating Sehir before he uncovers corruption
"@;

  'the_king.md' = @"
# The King

## Role
- Ruling monarch

## Traits
- Respects Sehir's wisdom
- Appears pragmatic and reasonable
"@;

  'lady_arienne_valis.md' = @"
# Lady Arienne Valis

## Role
- Lightning Mage
- Royal Academy Scholar
- Covert assassin for the Queen

## Abilities
- Lightning magic
- Twin curved blades
- Fast mobility
- Precision combat

## Equipment
- Twin blades
- Staff
- Light combat armor

## Mission
- Kill Sehir during expedition
"@;

  'professor_aldren_thalrick.md' = @"
# Professor Aldren Thalrick

## Role
- Royal Academy engineer
- Geological and mining expert

## Traits
- Enthusiastic academic
- Curious and analytical

## Narrative Function
- Legitimate reason for expedition
- Knowledge source about mine
"@;

  'commander_halvren.md' = @"
# Commander Halvren

## Role
- Commander of Westfall Fortress

## Traits
- Professional
- Organized
"@;

  'warden_corvin.md' = @"
# Warden Corvin

## Role
- Overseer of the fortress prison

## Traits
- Disciplined and pragmatic
"@;

  'unknown_prisoner_female.md' = @"
# Unknown Prisoner (Female)

## Status
- Maximum security prisoner

## Observations
- Filthy but maintains noble posture
- Intelligent gaze
- Likely politically important
"@
}

foreach ($name in $characterFiles.Keys) {
  New-MarkdownFile -Path (Join-Path $charactersRoot $name) -Content ($characterFiles[$name].Trim())
}

$locationFiles = @{
  'capital_city.md' = @"
# Capital City

## Importance
- Seat of royal power
- Center of political intrigue
"@;

  'blackstone_camp.md' = @"
# Blackstone Camp

## Type
- Abandoned mining settlement
- Former iron mine

## Story Relevance
- Target location of expedition
"@;

  'western_valley.md' = @"
# Western Valley

## Routes
- Dangerous mountain pass
- Sea route via coastal fortress
"@;

  'westfall_fortress.md' = @"
# Westfall Fortress

## Type
- Coastal fortress and prison complex

## Population
- Approximately 800 residents

## Features
- Harbor chains
- Terraced farming
- Workshops and fishing
"@;

  'westfall_prison_structure.md' = @"
# Westfall Prison Structure

## Blocks
- General Population: low aggression inmates
- Cooperative Block: nonviolent offenders
- Isolation Block: violent prisoners
- Maximum Security: political or extremely dangerous prisoners
"@
}

foreach ($name in $locationFiles.Keys) {
  New-MarkdownFile -Path (Join-Path $locationsRoot $name) -Content ($locationFiles[$name].Trim())
}

$divineContent = @"
# Goddess of Justice

## Status
- Formerly widely worshiped
- Now nearly forgotten

## Symbol
- Blindfolded woman holding a broken scale

## Connection
- Sehir is her last strong link to the mortal world

## Goal
- Restore justice and awaken Sehir
"@
New-MarkdownFile -Path (Join-Path $divineRoot 'goddess_of_justice.md') -Content $divineContent.Trim()

$artifactContent = @"
# Cataclysm

## Type
- Legendary divine weapon

## Former Wielder
- Sehir

## Reputation
- Feared battlefield weapon

## Current Status
- Unknown
"@
New-MarkdownFile -Path (Join-Path $artifactsRoot 'cataclysm.md') -Content $artifactContent.Trim()

$loreContent = @"
# Magic and Supernatural Elements

## Lightning Magic
- Used by Arienne Valis
- High precision combat magic

## Elementals
- Earth spirits possibly inhabiting the mine
"@
New-MarkdownFile -Path (Join-Path $loreRoot 'magic_and_supernatural.md') -Content $loreContent.Trim()

$threadsContent = @"
# Active Story Threads

1. Assassination plot against Sehir
2. Awakening of the Goddess of Justice
3. Mystery of Blackstone Mine
4. Identity of the prisoner
5. Political corruption within the crown
"@
New-MarkdownFile -Path (Join-Path $threadsRoot 'active_story_threads.md') -Content $threadsContent.Trim()

$canonLog = @"
# Canon Log

Use this file to record continuity decisions once they are committed in-story.

## Entry Template
- Date (in-world):
- Chapter:
- Canon fact:
- Affected files:
- Notes:
"@
New-MarkdownFile -Path (Join-Path $continuityRoot 'canon_log.md') -Content $canonLog.Trim()

$timeline = @"
# Timeline

Track major events in order to avoid temporal inconsistencies.

## Event Template
- Sequence #:
- Time marker:
- Event:
- Characters involved:
- Locations involved:
- Source chapter:
"@
New-MarkdownFile -Path (Join-Path $continuityRoot 'timeline.md') -Content $timeline.Trim()

$openQuestions = @"
# Open Questions

Capture unresolved mysteries, reveals, and setup/payoff constraints.

## Question Template
- Question:
- Introduced in chapter:
- Planned payoff window:
- Owner (character/faction):
- Resolution status:
"@
New-MarkdownFile -Path (Join-Path $continuityRoot 'open_questions.md') -Content $openQuestions.Trim()

$storyReadme = @"
# Story Workspace

This workspace separates draft chapters from canon reference material.

## Structure
- main_story/chapters: Chapter files generated from the current draft (Justice.docx)
- reference/characters: One file per character for canon consistency
- reference/locations: One file per location/place
- reference/divine: Divine entities and related canon
- reference/artifacts: Important artifacts
- reference/lore: Magic and supernatural rules
- reference/threads: Active plot threads
- continuity: Working files for canon, timeline, and unresolved questions

## Source Documents
- Story draft: C:/Users/vagab/OneDrive/Documents/Justice.docx
- Reference bible: C:/Users/vagab/OneDrive/Desktop/story_reference_bible.docx
"@
New-MarkdownFile -Path (Join-Path $storyRoot 'README.md') -Content $storyReadme.TrimEnd()

$refLines = Get-DocxParagraphs -Path $refDoc
$refSnapshot = "# Reference Bible Snapshot`r`n`r`n" + ($refLines -join "`r`n")
New-MarkdownFile -Path (Join-Path $referenceRoot 'source_snapshot.md') -Content $refSnapshot.TrimEnd()

Write-Output "Created chapters: $($chapterBuckets.Count)"


