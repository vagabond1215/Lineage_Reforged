# Kaelvar regional locality: mainland, island fringe and southern peninsula

Date: 2026-11-12  
Branch: `connector/first-world-raster-macro-evidence-pilot-2026-11-12`  
State: **READ-ONLY PLACEMENT AUDIT IMPLEMENTED; NATIVE RASTER OUTPUT / OWNER REVIEW PENDING**

## Entry and validated starting observations

The owner reported five passing Coast 10 ecological-review tests and
ran the extended source-pair footprint crosswalk locally. Under the
independently derived **terrain-only** four-neighbor classification,
the following original source polygons share physical component 30:

| Existing polygon | Authored location | Terrain pixels on terrain-only component 30 | Other terrain components |
| --- | --- | ---: | --- |
| `feature.region_shattercap_isles.part_7` | Kaelvar northern island fringe | **23,182** | 28: 64; 51: 13; 78: 8 |
| `feature.region_shattercap_isles.part_15` | Kaelvar northern island fringe | **4,063** | None |
| `feature.region_verdant_thalos.part_1` | Kaelvar southern peninsula | 23,780 | 102: 50; 101: 25 |
| `feature.region_auric_marches.part_4` | Kaelvar western interior | 24,613 | None |
| `feature.region_windward_spine.part_1` | Serathyl northern mountains | 3,661 | 113: 12 |

The combined Shattercap Parts 7 and 15 have **27,245
terrain-candidate footprint pixel counts on component 30**.
This is not a deduplicated unique-area claim and does not prove
that the entire Shattercap region is misplaced. The substantial
mainland coverage is **not solely caused by shared black/river
ink**, since those pixels were excluded from this scenario.

Source terrain-component 30 is independently anchored in this
audit to the predominant terrain-only component of **Auric
Marches Part 4**; no component numeric ID is hard-coded as an
immutable political mainland identity. Component labels differ
from the old ink-inclusive `25` and may change if the source
land/water classifier is independently revised.

### Canonical authored geography

Direct `regions.json` readback, not a new lore invention:

- `region.shattercap_isles`:
  `positionLabel=kaelvar_northern_coast`, broken northern
  island fringe, cold marine and rugged conifer islands, sparse
  harbors and beacon cliffs.
- `region.verdant_thalos`:
  `positionLabel=kaelvar_southern_peninsula`, fertile coast,
  Mediterranean woodland, mixed forest and low hills, ports
  and managed forests.
- `region.auric_marches`:
  `positionLabel=kaelvar_western_interior`, dry scrub,
  steppe, broken uplands, sparse mining and caravan forts.
- `region.windward_spine`:
  `positionLabel=serathyl_northern_mountains`, cold-wet
  alpine/cloud/high-conifer highland spine.

The Shattercap label may have been extended across a main
landmass through the original global anchor partition.
The geographic placement requires **spatial inspection**.
Mainland contact alone is not proof a northern island-fringe
subregion cannot retain coastal mainland bridgeheads.
The exact accepted island and political boundary are not yet
known. The nearer histogram similarity to Windward Part 1
(54.32% Shattercap Part 15 versus 41.95% Verdant Part 1)
does **not** justify a Shattercap recipient assignment,
because source RGB and the elevation color ramp remain
semantically uncalibrated.

## New read-only locality review

`scripts/lib/first-world-kaelvar-locality-review.mjs` and
`scripts/first-world-source-pair-qa.mjs` now provide:

1. `--kaelvar-locality`: JSON including the five pilot
   source polygons **plus every remaining authored Shattercap
   footprint**, measured from the 2048×1152 source-pair
   terrain-only classification. For every polygon, retain
   authored region ID, parent continent, `positionLabel`,
   summary, terrain-only component membership and per-component
   pixel counts/bounds/centroid, whole-polygon source terrain
   bounds and centroid, unresolved ink/blue counts and
   coverage of the Auric-referenced main terrain component.
2. `--svg-kaelvar`: source-registered **side-by-side**
   biome raster and current-footprint placement overlay for
   Shattercap Parts 7 and 15, Verdant Part 1, Auric Part 4,
   and Windward Part 1. It colors only independently
   recognized terrain-candidate pixels inside the existing
   footprints; it does not fill ocean or apply a new
   territorial mask. The original source PNG is embedded
   locally as a lossless, cropped image inside the SVG.
3. `tests/unit/first-world-kaelvar-locality-review.test.mjs`:
   five synthetic regression tests for 4-neighbor locality
   anchoring, per-polygon source coordinate centroids,
   small distinct components, source SVG embedding and
   fail-closed/no-write behavior.

This is a placement QA and not the final continent-region-biome
suitability audit. It does **not** alter the biome source,
elevation source, landmask, settlement/route plans, region
hierarchy, saved games, game runtime or any canonical map
feature.

## Reproduce and review locally

Run in the existing detached, clean checkout after fetching
the latest draft branch. Place all reports outside the repo.

```powershell
node --test tests/unit/first-world-kaelvar-locality-review.test.mjs

$dir=Join-Path $env:TEMP 'first-world-pass0-review'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$json=Join-Path $dir 'first-world-kaelvar-locality.json'
$svg=Join-Path $dir 'first-world-kaelvar-locality.svg'

node scripts/first-world-source-pair-qa.mjs --kaelvar-locality > $json
if ($LASTEXITCODE -ne 0) {
  Remove-Item $json -ErrorAction SilentlyContinue
  throw 'Kaelvar locality JSON failed'
}
node scripts/first-world-source-pair-qa.mjs --svg-kaelvar > $svg
if ($LASTEXITCODE -ne 0) {
  Remove-Item $svg -ErrorAction SilentlyContinue
  throw 'Kaelvar locality SVG failed'
}

$r=Get-Content $json -Raw | ConvertFrom-Json
$r.physicalReference
$r.fullShattercapReview
$r.rows | Select-Object sourcePartId, authoredPositionLabel,
  terrainCandidatePixels, terrainCandidatePixelsOnReferenceComponent,
  terrainCandidateCentroid | Format-Table -AutoSize
Invoke-Item $svg
```

### Exit/failure criteria

**Source and test pass:** original audited PNG/geometry hashes
and crop remain valid, accepted 42 exclusions unchanged,
159 effective footprints and 68 coastline records present,
all native tests pass, JSON and SVG generate successfully,
and the 5 known pilot footprints reproduce their previously
measured terrain-only component counts.

**Spatial interpretation pass (not yet met):** visually verify
whether Shattercap Parts 7/15 occupy a **southern mainland**
sector inconsistent with the northern-island authored intent,
or legitimately cover a connecting northern coastal zone.
Review all Shattercap island-part rows and small islands;
do not erase the 64/13/8 tiny fragments or the Windward
12-pixel candidate fragment.

**Ecology and replacement approval (not yet met):** independently
verify source biome legend and height ramp, compare contiguous
landscape/ecotone bands to authored region identities, then
propose explicit reviewed region masks and child boundaries
without even-area repartitioning. Keep Coast 40's separate
229-pixel island sovereignty question open.

**HOLD if:** missing source feature, unexplained original
component drift, source-file modifications, masks including
unresolved ink as automatically approved land, inferred
regional recipient from RGB similarity, automatic island
transfer, or undocumented polygon edits.

No canonical geography, application runtime, game data or
original raster assets were changed during this phase.
