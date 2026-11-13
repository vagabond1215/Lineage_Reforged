# First World Kaelvar: Shattercap 15-part terrain-union and island-retention gate

Date: 2026-11-13
State: **READ-ONLY INVENTORY IMPLEMENTED; NATIVE 15-PART UNION / OWNER ISLAND REVIEW PENDING**
Branch: `connector/first-world-raster-macro-evidence-pilot-2026-11-12`
Source: audited 2048×1152 registered biome/elevation PNGs, original region polygons minus the 42 previously reviewed square artifacts.

## Owner's native locality results: exact scope

The owner ran the previous `--kaelvar-locality` pass. That reports
**summed, potentially overlapping source-polygon terrain memberships**:

| Statistic | Result |
| --- | ---: |
| Shattercap original footprint parts | 15 |
| Summed terrain-candidate memberships | 30,938 |
| Summed memberships on Auric-reference terrain-only main component 30 | **27,245** |
| Mainland share of summed memberships | **88.06%** |
| Summed non-mainland memberships | 3,693 |

The two large main-component contributors are Shattercap Part 7
(23,182 mainland terrain pixels plus **85** on other terrain
components 28/51/78), and Shattercap Part 15 (4,063 mainland
terrain pixels, with no separately connected terrain component).
Both lie on independent terrain-only component 30, as do
Auric Marches, Verdant Thalos, and the primary foreign Windward
Spine Part 1 intrusion. This is not merely an artificial
connectivity caused by black coastline ink.

Non-mainland contributions include Part 4 (**1,893**, component 24),
Part 17 (**1,029**, mostly component 90), Part 16 (**229**, mostly
component 91), a collection of smaller islands and thin
land fragments, plus the **85** extra non-mainland memberships
under Part 7. Source Part 1 has **zero independently classified
terrain pixels** and must be examined as water, ink, and/or a
historical artifact, **not deleted automatically**.

Some detached parts, notably Part 17 (centroid ~582,378) and
Part 16 (~548,361), are geographically east/southeast of
the central Kaelvar source terrain in the original map.
**Detached does not mean northern** or automatically fit
Shattercap's cold northern island-fringe ecology.
These source coordinates are not global geodetic latitudes.
Their actual coastline relationships require the map locator.

The prior two-panel view showed the enormous Part 7 and
southeastern Part 15 orange mainland claims. Shattercap's
canonical `regions.json` expectation is `kaelvar_northern_coast`,
a broken maritime northern island fringe, while Verdant
Thalos is the southern fertile peninsula, Auric the western
dry interior. A cold northern maritime region may retain
legitimate northern mainland ports or bridgeheads, but
its **current huge eastern/southeastern mainland extent
requires reconstruction**, not a blanket polygon transfer
based on color or percentage.

## What the new exact union tool measures

`scripts/lib/first-world-shattercap-union.mjs` now builds a
read-only terrain-candidate **coverage-count grid** across
**all** original Shattercap parts, on the same independently
decoded 2048×1152 source-pair classification.

Unlike the earlier per-footprint sums, it computes:

- **Unique Shattercap terrain pixels** (deduplicated union).
- Exact distinct pixels covered by multiple Shattercap
  polygons and excess per-polygon membership counts.
- Unique pixels on Auric-reference mainland component 30
  and off that component, with a true union-based share.
- Unique pixels per terrain-only 4-neighbor component,
  native component centroids and geographic bounds, and
  whether the component is part of the Auric reference.
- Per-part raw source polygon cell counts, independently
  classified terrain/ink/blue/other pixels and terrain
  component memberships, preserving source IDs.
- Part IDs having zero terrain pixels, for manual review.

These statistics are **physical-source candidate evidence**,
not ownership masks or final land/water truth. All unresolved
ink is still excluded from the terrain-only topology.

The companion `--svg-shattercap` output embeds the original
source biome pixels and overlays the current Shattercap
terrain assignments, with every one of the fifteen part
numbers labeled:

- **Orange:** current Shattercap terrain pixels on Auric's
  reference mainland component (not necessarily authorized
  Shattercap territory).
- **Teal:** current Shattercap terrain pixels on detached
  terrain-only components (NOT necessarily northern islands).
- **Purple:** terrain pixels multiply covered by original
  Shattercap polygons, drawn for QA rather than silently
  double-counted.

Source blue ocean/river ink remains visible. The locator is
**not a proposed new regional border**.

## Run safely in the detached pwsh worktree

```powershell
Set-Location C:\Codex\EoL-macro-raster-pass0

if (@(git status --porcelain).Count -ne 0) {
  throw 'Inspect modifications before updating review checkout'
}
$branch='connector/first-world-raster-macro-evidence-pilot-2026-11-12'
git fetch origin $branch
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed' }
git switch --detach "origin/$branch"
if ($LASTEXITCODE -ne 0) { throw 'Checkout failed' }

node --test tests/unit/first-world-shattercap-union.test.mjs
if ($LASTEXITCODE -ne 0) { throw 'Shattercap union tests failed' }

$dir=Join-Path $env:TEMP 'first-world-pass0-review'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$json=Join-Path $dir 'first-world-shattercap-union.json'
$svg=Join-Path $dir 'first-world-shattercap-inventory.svg'

node scripts/first-world-source-pair-qa.mjs --shattercap-union > $json
if ($LASTEXITCODE -ne 0) {
  Remove-Item $json -ErrorAction SilentlyContinue
  throw 'Shattercap union witness failed'
}
node scripts/first-world-source-pair-qa.mjs --svg-shattercap > $svg
if ($LASTEXITCODE -ne 0) {
  Remove-Item $svg -ErrorAction SilentlyContinue
  throw 'Shattercap island locator failed'
}

$r=Get-Content $json -Raw | ConvertFrom-Json
$r | Select-Object selectedFootprintCount,
  summedFootprintTerrainCells,deduplicatedTerrainCells,
  sourcePolygonOverlapCells,sourcePolygonOverlapExcessMemberships,
  terrainCellsOnReferenceMainland,terrainCellsOffReferenceMainland,
  referenceMainlandShareOfUniqueTerrainPercent,
  partsWithoutTerrainCandidates | Format-List
$r.componentRows | Select-Object componentId,uniqueTerrainCells,
  mainlandReference,terrainCentroid,terrainBounds |
  Format-Table -AutoSize

Invoke-Item $svg
```

## Next revision choice: no automatic polygon writes

**Option A, retain three authored Kaelvar subregions:**
Constrain Shattercap to a source-verified northern coastal/island
fringe, retain Auric's western dry and upland terrain, extend
Verdant's southern woodland/coastal system only into ecologically
appropriate eastern coast. This may still leave incompatible
eastern upland or northern interior zones requiring a
documented mixed/ecotone belt.

**Option B, reserve an additional Kaelvar eastern region:**
If independently classified biome, elevation and river
structure demonstrate that the broad eastern mainland is
neither Shattercap's northern island ecology nor Verdant's
southern agricultural woodland, draft a **new authored
eastern mainland region** for explicit world-design approval.
Do not name it or invent settlement/economy/population
canon during a purely geographic audit.

Neither option is an approved border today. A future
read-only candidate SVG must show source terrain,
rivers/sea, highlands, unique land components and the
old→new part provenance, with ecotone areas handled
explicitly. Region-size equality and global nearest-anchor
claims are prohibited. Preserve northern islands, legitimate
non-northern detached islands, and Coast 40's independent
Kaelvar/Serathyl sovereignty decision.

### Stage exit and hard failures

**Entry:** audited source identity, original crop, 15
Shattercap source parts, 42 accepted artifact exclusions,
the previously verified 525,910 source-pair terrain
candidates and old/new connectivity crosswalk.

**Pass:** read-only unit tests green; unique Shattercap
counts reconcile exactly: summed = union + overlap
excess; large mainland assignments and all detached
physical components remain visible; zero-terrain Part 1
is explicitly retained for examination; SVG renders and
contains no external image requests.

**Hold:** source hashes, component numbering or crop
changed; novel source ink/alpha interpretation; any
part disappears; union arithmetic fails; inferred
southern-island sovereignty; automatic source PNG or
canonical `world_map_features.json` modification;
unverified biome/height ramp; or an unsupported
new eastern political region.

The subsequent ecological suitability gate must compare
the *spatial* biome/height distributions of both
three-region and four-region candidate scenarios against
the existing `regions.json`/regional ecology authoring,
allowing realistic ecotones and independent land-use
validation. Only an explicit review of that evidence
can approve final region masks, followed by migration
impact testing for settlements, routes and gameplay.

## Owner-rendered all-15 Shattercap island locator review (2026-11-13)

The owner supplied a browser screenshot of
`first-world-shattercap-inventory.svg` showing both aligned
source-biome and numbered-footprint panels. This verifies the SVG
**rendered**; the accompanying **deduplicated numeric JSON has not
been supplied**, and six newly added native tests have not been
reported in this conversation.

**Visual observations, not accepted territorial decisions:**

- **Part 7:** broad orange northern/eastern *connected mainland*
  wedge, well beyond an obvious offshore island fringe. Large-scale
  authored-geography mismatch remains a high-priority candidate.
- **Part 15:** separate orange southeastern mainland source
  polygon, requiring joint review with Verdant Thalos and the
  foreign Windward Spine peninsula.
- **Part 4:** prominent teal detached northeastern island;
  strong physical-island preservation candidate. Political/ecology
  assignment still unapproved.
- **Parts 2/3/5/6/8/9:** northern small-island or coastal fragments
  to retain pending fine-grained component and source-color review.
- **Parts 16/17:** eastern/southeastern detached island geography.
  Detached physical land is not automatically a *northern* Shattercap
  regional possession; preserve physical features, hold jurisdiction.
- **Part 1:** the numbered label and thin polygon line appear
  pressed against or partially clipped at the panel's upper
  edge. The previous native locality data showed **zero
  terrain candidates** in this source polygon. This is a
  **possible source-geometry/artwork artifact requiring**
  separate original-polygon bounds and blue/ink pixel review,
  not proof of an invalid polygon or permission to remove it.
- **Parts 11/13/14:** tiny or difficult-to-see candidate
  marks over ocean/shoreline in the screenshot, needing their
  exact per-part source-pair classification. Do not infer
  no land from screen visibility or label placement.
- The locator does not display an obvious large purple
  duplicate-coverage patch; this is **not** quantitative
  proof of zero polygon overlap.

**Next exact gate:** inspect
`first-world-shattercap-union.json` fields
`summedFootprintTerrainCells`, `deduplicatedTerrainCells`,
`sourcePolygonOverlapCells`,
`terrainCellsOnReferenceMainland`,
`terrainCellsOffReferenceMainland`,
`componentRows`, and the per-part row for Part 1. They
settle source-terrain area accounting without assigning
ownership. Do not use the old summed 88.06% as a deduplicated
region-area ratio until that report is verified.

**Required boundary design constraint:** northern Shattercap
islands and legitimate northern mainland coastal access may
remain; broad eastern mainland and southern peninsula must be
validated against both the original biome and elevation maps
and their *independently approved* interpretation. Ecotones
are allowed. Generate side-by-side candidate region layouts
with an explicit unresolved territory class and no default
assignment to Verdant, Auric or a newly invented region.

**Disposition:** `ISLAND_LOCATOR_RENDER_PASS__UNION_AND_ARTIFACT_REVIEW_HELD`.
No geography, imagery, routes, Saves, settlements or runtime
changes authorized.

## Owner-executed exact union acceptance and Part 1 disposition (2026-11-13)

The owner ran the native `--shattercap-union` source-pair audit and
provided its complete coverage totals and component table.
These numbers supersede the earlier *pending union arithmetic*
status. The accompanying screenshot of the all-15-part SVG was
also visually reviewed. The unit-suite output for the six new
union tests was **not** separately supplied, so its native test
status remains unverified.

| Exact source-terrain union field | Observed |
| --- | ---: |
| `summedFootprintTerrainCells` | **30,938** |
| `deduplicatedTerrainCells` | **30,938** |
| `sourcePolygonOverlapCells` | **0** |
| `sourcePolygonOverlapExcessMemberships` | **0** |
| `terrainCellsOnReferenceMainland` | **27,245** |
| `terrainCellsOffReferenceMainland` | **3,693** |
| `referenceMainlandShareOfUniqueTerrainPercent` | **88.06%** |

Because the independently sampled source-terrain polygon union
equals the per-polygon sum and overlap is zero, the mainland
ratio is an **exact deduplicated share of Shattercap's terrain
candidates under the existing source-pair classifier**. It is
not a true political area fraction, square-kilometer measure
or approved terrestrial segmentation. The mainland represents
a single terrain-only component **30**; the **18 detached**
terrain-only components below must remain independent candidates
for island/shoreline review.

| Terrain-only component ID | Unique Shattercap terrain pixels | Source-pixel centroid (x, y) | Provisional review |
| --- | ---: | --- | --- |
| 30 | **27,245** | 382.86, 257.17 | Auric-referenced Kaelvar mainland; placement anomaly |
| 24 | **1,893** | 536.88, 150.91 | Prominent northern/eastern offshore island |
| 90 | 1,013 | 582.42, 378.16 | Detached eastern/southeastern island |
| 91 | 220 | 548.16, 360.81 | Detached eastern/southeastern island |
| 34 | 118 | 463.84, 149.87 | Northern offshore fragment |
| 21 | 115 | 298.56, 124.32 | Northern offshore fragment |
| 25 | 80 | 435.65, 129.26 | Northern offshore fragment |
| 28 | 64 | 399.89, 134.94 | Shattercap Part 7's non-mainland fragment |
| 47 | 37 | 558.39, 193.04 | Detached terrain |
| 38 | 22 | 449.55, 155.36 | Detached terrain |
| 20 | 20 | 311.75, 110.90 | Northern detached terrain |
| 71 | 18 | 551.28, 266.67 | Detached terrain |
| 26 | 17 | 376.56, 129.09 | Northern detached terrain |
| 55 | 16 | 555.50, 227.50 | Detached terrain |
| 95 | 16 | 567.31, 354.88 | Eastern/southeastern detached terrain |
| 35 | 14 | 266.29, 144.71 | Northern detached terrain |
| 51 | 13 | 468.73, 209.65 | Shattercap Part 7's non-mainland fragment |
| 96 | 9 | 554.61, 356.94 | Eastern/southeastern detached terrain |
| 78 | 8 | 511.13, 311.88 | Shattercap Part 7's non-mainland fragment |

IDs are **terrain-only 4-neighbor components**, not the earlier
ink-inclusive Coast 10/40 component identifiers and not
political jurisdictions. No island is excluded for being
small or at a seemingly inconvenient source-grid position.

### Part 1: isolated non-terrain source record

The owner separately inspected the original candidate footprint:

- `feature.region_shattercap_isles.part_1` source polygon covers
  **684 raster cells**.
- **0** divergent terrain cells, **0** unresolved shared-ink
  cells, **684** shared-blue candidate cells, **0** other.
- Polygon source bounds: `minX=254, maxX=596,
  minY=0, maxY=2` on the cropped 2048×1152 grid.
- The numbered-map visual shows a thin upper-border line
  and label near the preview top. This is consistent with
  an anomalous top-of-map source polygon over blue
  background, **not an inhabitable island** under the
  current independently derived candidate terrain.

**Case disposition:
`SHATTERCAP_PART_1_PROBABLE_BLUE_EDGE_ARTIFACT_REVIEW_REQUIRED`.**
Treat it as *not eligible for proposed dry-land political
ownership*, but preserve the original source record for
traceability. Before adding it to any approved artifact
exclusion manifest, independently verify polygon vertices,
registered source image blue pixels and expected top-of-map
geometry. An eventual removal would be an explicitly
reviewed **43rd artifact candidate**, not retroactive
permission to edit the 42-item approved exclusion manifest.
Do not classify all blue pixels in other polygons as artifacts.

### Updated region-reconstruction decision

1. **Source-area accounting passed:** no internal Shattercap
   polygon overlap and exact 27,245 mainland / 3,693
   detached candidate-terrain counts.
2. **Part 1 artifact review held:** zero terrain and
   all-blue top-edge geometry is strong evidence, but
   no source deletion or exclusion is approved.
3. **Island preservation mandatory:** all 18 distinct
   detached components retain their source-pixel
   provenance; physical detachment does not guarantee
   northern Shattercap political membership.
4. **Reconstruction layout A:** preserve the currently
   authored Auric/Verdant/Shattercap trio, constrain
   Shattercap to northern maritime terrain/islands and
   justified coastal access, with the southern/eastern
   mainland marked unresolved until source ecological
   compatibility is determined. This is a design option,
   **not a new polygon or forced Verdant assignment**.
5. **Reconstruction layout B:** introduce an explicitly
   pending *eastern-mainland region candidate* only if
   independent biome, relief, hydrological and authoring
   evidence shows neither existing regional profile
   coherently covers it. No name/lore/settlement canon
   is invented at this stage.
6. **Hard gates remaining:** land/water coastal ink,
   original biome RGB legend, actual elevation-color
   scale/relief, ecotone/transition assessment,
   candidate boundary pixel masks, existing settlement/
   travel dependencies and explicit owner approval.
   Coast 40's distinct island sovereignty remains held.

**Status:** `SHATTERCAP_UNION_PASS__ARTIFACT_AND_ECOLOGY_HOLD`.
No canonical PNG, region, coastline, biome-zone, route,
settlement, game or Save changes are authorized.
