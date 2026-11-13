# First World L0 source-ink connectivity sensitivity gate

Date: 2026-11-12
Branch: `connector/first-world-raster-macro-evidence-pilot-2026-11-12`
Status: **IMPLEMENTED READ-ONLY / ORIGINAL-SOURCE NATIVE EXECUTION PENDING**
Depends on: independently registered source biome + elevation PNGs, original source crop,
159 effective region footprints, 42 accepted offshore square exclusions, and the
audited geometry blob under draft PR #79.

## Observed full-resolution source pair classifications

The owner ran `scripts/first-world-source-pair-qa.mjs --check`
using actual source files, and reported reference-grid (2048×1152)
class counts:

| Provisional class | Pixels | Meaning, NOT final physical topology |
| --- | ---: | --- |
| Shared blue candidate | 1,773,462 | Background/ocean candidate |
| Divergent terrain candidate | **525,910** | Source biome/elevation colors differ |
| Shared nonblue unresolved | **59,924** | Coast/river/shore ink or other shared artwork |
| Blue divergence | 0 | No observed conflict in this class |
| Alpha unresolved | 0 | Paired partial alpha is preserved |

The 59,924 unresolved pixels exactly reconcile the original
585,834 threshold-land pixels with 525,910 independent two-source
terrain-color differences. **Reconciliation is arithmetic, not a
landmask approval**. Neighborhood context of 59,924 shared ink pixels:
6,980 touch both candidate background and terrain, 22,951 touch only
background, 28,420 touch only terrain, and 1,573 touch neither. These
are 4-neighbor observations; adjacent terrain does not prove land and
adjacent background does not prove water.

Pilot values (per source polygon; not unique land mass or jurisdiction):
- Windward Spine Part 1: 4,572 total polygon cells; 3,673 terrain
  candidates, 653 shared ink, 246 blue candidates.
- Windward Spine Part 2: 128 cells; 74 terrain, 36 ink, 18 blue.
- Verdant Thalos Part 6: 112 cells; 56 terrain, 41 ink, 15 blue.

The previous provisional-legacy landmass counts were
**167 four-connected / 160 eight-connected** components and include
all nonblue ink as land. Their component IDs 25, 82 and 91, and
associated previously measured area counts, cannot automatically
be reused as the IDs or areas of the terrain-only interpretation.

## Exact new read-only scenarios

`scripts/lib/first-world-source-pair-topology.mjs` computes:

1. **Terrain-only:** use only divergent nonblue terrain candidates;
   unresolved coastline/river ink is absent from this hypothetical mask.
   This is NOT a certified island map.
2. **Shared-ink included:** add shared nonblue artwork to terrain.
   When there are no blue/alpha anomalies, this matches the older
   threshold-land pixel set; still NOT certified land.
3. **All-unresolved included:** also include blue-divergent and
   alpha-ambiguous pixels as a wider stress test. Actual current
   anomaly counts were zero, so it should match scenario 2.

For each scenario, report candidate land cell count, 4-neighbor and
8-neighbor connected component count, largest component and
one-cell components **without pruning small islands**.

The 4-neighbor crosswalk shows, for each shared-ink-inclusive
component, the exact set of terrain-only components it absorbs.
Its `joinedFourNeighborComponentCount` is the number of
ink-inclusive components touching **more than one distinct
terrain-only component**. The `inkOnlyFourNeighborComponentCount`
reports standalone uncertain-ink components; the two effects can
cancel when only total component counts are compared. Crosswalk
rows are sorted, with an explicit truncation counter if the top
250 joined rows do not cover the full result.

For Windward Parts 1/2 and Verdant Part 6, preserve per-feature
pixel counts and component membership separately for both scenarios.
Do not infer that a new component has the same numeric ID as the
old component 25 or 91. No polygon ownership is transferred.

## Local acceptance commands

From `C:\Codex\EoL-macro-raster-pass0`, after safely updating
the clean detached worktree to the latest draft PR #79 head:

```powershell
node --test tests/unit/first-world-raster-macro-evidence.test.mjs tests/unit/first-world-environment-evidence.test.mjs tests/unit/first-world-source-pair-qa.test.mjs
if ($LASTEXITCODE -ne 0) { throw 'Unit test failure' }

$dir = Join-Path $env:TEMP 'first-world-pass0-review'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$json = Join-Path $dir 'first-world-source-pair-connectivity.json'
node scripts/first-world-source-pair-qa.mjs --connectivity > $json
if ($LASTEXITCODE -ne 0) {
  Remove-Item $json -ErrorAction SilentlyContinue
  throw 'Native sensitivity witness failed'
}

$r = Get-Content $json -Raw | ConvertFrom-Json
$r | Select-Object terrainOnly,sharedInkIncluded,allUnresolvedIncluded,
  joinedFourNeighborComponentCount,inkOnlyFourNeighborComponentCount,
  baselineLegacyReproduced | Format-List

$r.coast10And40 | Select-Object id,terrainCandidatePixels,
  unresolvedSharedInkPixels,terrainOnlyFourComponents,
  sharedInkIncludedFourComponents | Format-List

$r.joinedFourNeighborComponents | Select-Object -First 15 |
  Format-Table permissiveComponentId,permissivePixels,
    terrainOnlyFourComponentCount,unresolvedPixels -AutoSize
```

### Entry / success / failure

**Entry:** exact source identity and registration, PNG dimensions,
all 42 approved exclusions, 159 retained parts, and existing 68
coastline parts. Source-pair class totals should reconcile with
the previously measured 2,359,296 reference cells.

**Pass if:** full unit suite green; CLI exits successfully with
structured JSON; 525,910 terrain + 59,924 shared ink = 585,834
legacy-threshold nonblue cells; the ink-inclusive scenario reproduces
the former **167/160** connectivity baseline; all three pilot parts
are present with the owner-observed cell counts; the joined and
ink-only components and all three scenarios are reviewable.

**Hold if:** source hashes/geometry identity differ, counts drift,
the original source's land/water registration changes, a pixel
class has a missing value, unexpected anomaly classes appear,
any smaller island is discarded as noise, source mask is edited,
or the proposed physical topology is presented as an accepted
border without a human-reviewed terrain/ink decision.

**Next gate:** review the strongest joined land components and
Coast 10/40 component crosswalk against the original biome/
elevation artwork, differentiating coastline outlines from
rivers/lakes and legitimately traversable land bridges. Then
verify biome palettes and elevation gradients against all
authored regional profiles with tolerant ecotone margins,
*before* proposing continent-constrained administrative boundaries.

This tooling does **not** overwrite source rasters, crop settings,
regional labels, generator, biomes, routes, settlements,
character/world runtime, or Saves.
