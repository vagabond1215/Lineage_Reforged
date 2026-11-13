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
