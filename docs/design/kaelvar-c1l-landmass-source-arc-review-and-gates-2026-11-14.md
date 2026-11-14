# C1-L: mainland-first source-coast arc adjudication

Date: 2026-11-14
Status: **REVIEW ONLY, NO OWNER VISUAL APPROVAL, NO CANONICAL BORDERS**

## Entry and intent

The owner ran C1-K at exact detached SHA dc640a5e689f31c0634fa0ba356b9adba0a8f1ef and reported 72/72 native unit tests passing, zero new legacy-grid dependencies, clean detached HEAD and successful JSON/SVG generation. This proves the native source review, not that any geographic interpretation was visually approved.

C1-L groups unaltered original source coastline edges into inspectable cyclic runs for a landmass-first region review. This is a preparatory visual adjudication stage before actually authoring coast-following political polygon drafts. A Windows temporary path in a console log is not an inspectable SVG image for this branch.

## Geography to preserve

Parent: Kaelvar mainland source-pair terrain-only candidate component 30, with 79,419 terrain candidates and 26,795 currently unassigned. These are source-candidate counts, not already approved political land area. Distinct detached components: 18, totaling 3,693 source-candidate cells. All remain withheld.

Five child-region intents, no equal-size rule:
- Auric Marches: western mineral uplands, dry steppe and caravan frontier.
- Kharuun Drylands: central desert, escarpments, arid basins and water-dependent oasis pockets.
- Verdant Thalos: fertile wooded southern mainland including southeast promontory.
- Veyrholm Shore: variable-width northern mainland coastal band, not deep interior.
- Shattercap Isles: whole detached islands only, with component identity and sovereignty withheld.

No sixth mainland child, forced gap fill, canonical coordinate polygons, or source-landmass political ownership is approved.

## Source accounting and presentation

The original 599 coastline edges of feature.coastline.first_world.part_10 remain unmodified. C1-J's exact review partitions are 90 northwest + 106 north-central + 114 northeastern + 289 other. C1-L categorizes all original source edges without assigning ownership:

1. NW/north-central midpoint falls inside the existing Veyrholm guide: descriptive coincidence only.
2. NW/north-central midpoint falls inside another mainland guide: competing descriptive coincidence.
3. NW/north-central midpoint falls inside no guide: unmatched.
4. All 114 northeastern edges: Veyrholm/Kharuun frontier remains contested regardless of guide coincidence.
5. Other 289 source edges: not reviewed as north frontage, preserved unresolved.

The CLI emits category totals, all original edge labels and cyclic runs with exact original indices. A run crossing edge 598 to 0 is reported as one wraparound run, never split by the arbitrary starting vertex.

The SVG inherits C1-K's original source PNG and original vectors, adds colored dashed source-arc classifications on the northern map panel, and keeps four interior guide-gap witnesses marked as NOT BORDERS. No new contour coordinates or interpolated political boundaries are created.

## Hard holds

Preserve the 18 detached candidate units without assignment or splitting; the northeastern large island must remain a whole unclaimed hypothesis. Preserve Coast 40 as a historical region-source conflict, separate from source coastline part_40. Preserve Serathyl parent for Windward Spine. No independent coast/sea/river/ink, elevation, potable water, salt basin or Kharuun port evidence has been accepted. The existing active world catalog, maps, settlement and route data, encounters, spawns, saves and legacy compatibility code must not change.

## Native exit gates

| Gate | Pass | Hold |
| --- | --- | --- |
| L0 source | exact pinned C1-K branch, source blobs and source PNG hashes | unknown source variant |
| L1 mainland | 79,419 candidates, 26,795 unassigned, 18 detached withheld | forced ownership |
| L2 coastline | 599 indices exactly once, 196+114+289 accounted, cyclic run integrity | edge replacement or invented interpolation |
| L3 children | five ordered geographic descriptors, all geometry refs null | source coincidence promotes a border |
| L4 verification | targeted unit tests, JSON, SVG, no new grid coupling, clean HEAD | any validation failure |
| L5 owner visual | source arc overlay compared to hand-drawn map | coast or interior disputed |
| L6 new candidate polygons | subsequent independent, owner-informed draft | auto-publishing by proximity |

## PowerShell 7 verification

Run only inside a fresh detached worktree at the pinned remote SHA. Do not reset, stash or switch the primary C:\Codex\EoL checkout.

    $ErrorActionPreference='Stop'
    $Repo='C:\Codex\EoL'
    $Branch='connector/c1l-kaelvar-landmass-coast-arc-adjudication-2026-11-14'
    $Sha='<FINAL_C1L_SHA>'
    $Parent='dc640a5e689f31c0634fa0ba356b9adba0a8f1ef'
    $Wt=Join-Path $env:TEMP "lr-c1l-native-$($Sha.Substring(0,12))"
    $Out=Join-Path $env:TEMP "lr-c1l-review-$($Sha.Substring(0,12))"
    git -C $Repo fetch --no-tags origin "refs/heads/$Branch"
    if ($LASTEXITCODE) { throw 'Fetch failed' }
    if ((git -C $Repo rev-parse FETCH_HEAD).Trim() -ne $Sha) { throw 'Remote SHA drift' }
    if (Test-Path $Wt) { throw 'Worktree already exists' }
    git -C $Repo worktree add --detach $Wt $Sha
    if ($LASTEXITCODE) { throw 'Worktree creation failed' }
    Push-Location $Wt
    try {
      node --check scripts/lib/kaelvar-c1l-landmass-source-arc-review.mjs
      if ($LASTEXITCODE) { throw 'Library syntax failed' }
      node --check scripts/kaelvar-c1l-landmass-review.mjs
      if ($LASTEXITCODE) { throw 'CLI syntax failed' }
      node --test tests/unit/kaelvar-c1l-landmass-source-arc-review.test.mjs
      if ($LASTEXITCODE) { throw 'Unit tests failed' }
      node scripts/check-no-new-hex-dependencies.mjs --check
      if ($LASTEXITCODE) { throw 'New legacy dependency' }
      git diff --quiet $Parent $Sha -- packages/content/base/world
      if ($LASTEXITCODE) { throw 'Protected world content changed' }
      New-Item -ItemType Directory -Force -Path $Out | Out-Null
      $ReportPath=Join-Path $Out 'kaelvar-c1l-source-arc-report.json'
      $SvgPath=Join-Path $Out 'kaelvar-c1l-source-arc-review.svg'
      node scripts/kaelvar-c1l-landmass-review.mjs --check > $ReportPath
      if ($LASTEXITCODE) { throw 'C1-L report failed' }
      node scripts/kaelvar-c1l-landmass-review.mjs --svg > $SvgPath
      if ($LASTEXITCODE) { throw 'C1-L SVG failed' }
      $Report=Get-Content -Raw $ReportPath | ConvertFrom-Json
      if ($Report.status -ne 'C1L_LANDMASS_ARC_REVIEW_COMPLETE_OWNER_VISUAL_GATE_HELD' -or
          $Report.originalEdgesAccounted -ne 599 -or
          $Report.northernOriginalEdgesAccounted -ne 310 -or
          $Report.otherOriginalEdgesAccounted -ne 289 -or
          $Report.unassignedPhysicalMainlandCandidateCells -ne 26795 -or
          $Report.inheritedDetachedPhysicalComponentsHeld -ne 18 -or
          $Report.approval.canonicalWritable -ne $false) {
        throw 'Landmass/coastline ownership invariant drift'
      }
      if ((Get-Item $SvgPath).Length -lt 100000) { throw 'SVG unexpectedly small' }
      if (@(git status --porcelain).Count -ne 0) { throw 'Worktree dirty' }
      if ((git rev-parse HEAD).Trim() -ne $Sha) { throw 'HEAD drift' }
      Write-Host 'C1-L NATIVE SOURCE ARC GATES PASSED'
      Write-Host 'OWNER VISUAL, COAST, REGIONS, ISLANDS AND CANONICAL CONTENT HELD'
      Write-Host "Report: $ReportPath"
      Write-Host "SVG: $SvgPath"
    } finally { Pop-Location }

When the native review passes, attach the actual SVG for visual comparison. Its path alone cannot be inspected through this chat. Use that reviewed image and original hand sketch as inputs to a later, reversible candidate polygon-authoring stage.
