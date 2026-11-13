# First World source-pair land/water/ink QA, pre-reconstruction gate

Date: 2026-11-12
Scope: **read-only** source color comparison, not a repaired coastline
Branch: `connector/first-world-raster-macro-evidence-pilot-2026-11-12`

## Why the two original images matter

The world map biome and elevation rasters are two separate expressions
of the same physical map, with an apparently shared blue ocean,
shoreline ink, and waterway artwork. The existing generator's rule
`B>150 && B-G>25 && B-R>80` identifies much of the blue background
but **also calls black/dark-blue and many blue-green features land**.
The previous 167 four-connected and 160 eight-connected component counts
are therefore provisional observations under that legacy rule.

Comparing the layers is safer than calling a black RGB pixel water,
or repairing it using nearby political borders. Exact shared
non-blue pixels may represent coastline ink, river art, lake art,
antialiasing or other image decoration. They must be classified as
**unresolved**, not forced to water or land. Distinct biome vs
elevation color can identify candidate surface terrain, but it is
not sufficient to certify a region or a climatic biome. This tool
does **not** recalculate geographical boundaries.

### Preview witness (user-uploaded half-resolution PNGs)

The owner uploaded two identically aligned previews of
`First World Biome.png` and `First World Elevation.png`, each
**2048 x 1177 RGBA**. Cropping the decorative frame from
`x=30,y=30`, to `width=1988,height=1117` in the previews yields
a 2,220,596-pixel sample that corresponds closely to the existing
repository crop `x=60,y=60,width=3976,height=2235` in the
larger source files. There is a half-pixel dimension difference
due to preview scaling. **Do not overwrite or recrop originals.**

| Conservative preview class | Pixels | Meaning |
| --- | ---: | --- |
| Shared blue candidate | 1,670,448 | Both maps identical, old water threshold says blue |
| Divergent non-blue candidate | 520,306 | Biome and elevation differ; candidate terrain |
| Shared non-blue unresolved | **29,835** | Coast ink, waterways, shadows, or other shared artwork |
| Blue divergent unresolved | 7 | Blue color but layers disagree |
| Alpha disagreement | 0 | No mismatched alpha between uploaded previews |

There are also **154,441 matching partially transparent preview
pixels**. These are shared anti-aliased artwork pixels, **not**
154,441 gaps or no-data cells. A prior draft rule that would mark
every alpha<255 pixel unresolved was corrected to preserve matched
partial alpha. Nonzero transparency can only be treated as missing
data after an independently verified image-alpha contract.

Of the 29,835 shared non-blue cells: 19,232 touch candidate land
and candidate blue in a four-neighbor test, 5,102 touch only blue,
5,474 touch only land, and 27 touch neither. These strongly
suggest largely **thin interface artwork**, but do not prove
individual cells' land/water status. Never use this comparison
to infer physical ownership or force the ambiguous cells to ocean.

The uploaded previews do **not** establish the full-resolution
repository PNG hashes. The new repo runner reads the full originals,
validates audited vector source identity and records original SHA-256.
Only its output can be considered the reproducible source witness.

### Previously captured environmental profile observations

The owner's full environmental JSON contained **159 effective
footprints** and **25 region profiles**. It reported
**13,704 unassigned provisional land cells**, **21 cross-macro
direct-overlap cells** and **510 same-macro child-overlap cells**
worldwide. These are aggregate existing-label observations, not
a new correction. They do not conflict with the more focused
component 25/91 report, which found zero direct cross-macro
overlap in those two components and 88 same-macro child overlap
on component 25.

The source elevation image uses a **colored light-to-peach terrain
gradient**, rivers and shared dark linework. Raw luminosity
percentiles from the previous environment report are not meters
or a calibrated elevation height. The source biome image has
green/yellow terrain families, but no independent biome legend
has yet been approved. Forest, farmland, desert, tundra and
mountains therefore remain semantically unclassified.

## Added diagnostic

`scripts/lib/first-world-source-pair-qa.mjs` implements independent,
review-only classes:

- `SHARED_BLUE_CANDIDATE`: source image colors identical and
  match the old blue rule. Provisional water/background only.
- `DIVERGENT_TERRAIN_CANDIDATE`: source images differ and
  color does not meet the old blue rule. Candidate terrain only.
- `SHARED_NONBLUE_UNRESOLVED`: identical RGB, not blue.
  **Hold for manual source-aware review.**
- `BLUE_DIVERGENCE_UNRESOLVED`: blue according to the old
  rule, but source colors disagree. **Hold.**
- `ALPHA_UNRESOLVED`: source images differ in alpha,
  or are fully transparent. Matched partial alpha is retained
  as color evidence; not automatically treated as no-data.

The companion `scripts/first-world-source-pair-qa.mjs` uses the
same canonical reference crop and source byte hashes. It
produces JSON with raw counts, provenance, reference-pixel
footprint profiles for all **159** retained region parts and
a Coast 10/40 candidate subset. A pure SVG QA overview paints
shared-blue dark blue, divergent terrain pale green, shared-ink
pink, blue divergence gold, and alpha disagreement gray.
All JSON/SVG is printed to stdout; **no source files are written**.

## Reproduce locally in the detached test worktree

```powershell
Set-Location C:\Codex\EoL-macro-raster-pass0
if (@(git status --porcelain).Count -ne 0) {
  throw 'Inspect local changes before updating test checkout'
}
git fetch origin connector/first-world-raster-macro-evidence-pilot-2026-11-12
git switch --detach origin/connector/first-world-raster-macro-evidence-pilot-2026-11-12

node --test tests/unit/first-world-raster-macro-evidence.test.mjs tests/unit/first-world-environment-evidence.test.mjs tests/unit/first-world-source-pair-qa.test.mjs
if ($LASTEXITCODE -ne 0) { throw 'Native test suite failed' }

$dir=Join-Path $env:TEMP 'first-world-pass0-review'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$report=Join-Path $dir 'first-world-source-pair-qa.json'
$svg=Join-Path $dir 'first-world-source-pair-qa.svg'

node scripts/first-world-source-pair-qa.mjs --check > $report
if ($LASTEXITCODE -ne 0) {
  Remove-Item $report -ErrorAction SilentlyContinue
  throw 'Native source-pair audit failed'
}
node scripts/first-world-source-pair-qa.mjs --svg-qa > $svg
if ($LASTEXITCODE -ne 0) {
  Remove-Item $svg -ErrorAction SilentlyContinue
  throw 'Native source-pair QA overview failed'
}
(Get-Content $report -Raw | ConvertFrom-Json) |
  Select-Object candidateClasses,sharedNonblueNeighborContext,
    legacyThresholdLandPixels,sharedPartialAlphaPixels,alphaMismatchPixels |
  Format-List
Invoke-Item $svg
```

These commands produce untracked evidence in the system temporary
directory and leave the source rasters, map generator, region
polygons, coastlines, and game runtime untouched.

## Explicit stage boundaries

**Entry:** original biome and elevation PNGs with matching
native dimensions, approved source crop, accepted 42 square
artifact exclusions and audited geometry blob.

**E0.1:** paired source count and visual diagnostic generated
from *original source files*; report includes both SHA-256 values.
The separately uploaded preview numbers must not substitute.

**E0.2:** review source coastline ink, rivers, ocean,
offshore islands and dark/blue ambiguous classes using
landmarks and RGB alpha around coastal edges. Make a documented
decision for each ambiguity class with exceptions.

**E0.3:** only after approval, propose an explicitly versioned
physical land/water segmentation, with 4-/8-connected component
comparison against legacy, small-island preservation, coastal
accuracy and waterway topology. No automatic raster-to-political
ownership mapping.

**E1/E2:** approve labeled biome palette and relative/physical
elevation ramp. Investigate authored description mismatches by
regional interior, ecotone margins and hydrology.

**E3 and later:** propose continent-constrained ecological
region boundaries and explicit Coast 10/40 owner decisions.
No equal-area global anchor partition, island reassignment
or canonical write without separate review.

**HOLD:** if source hashes, map crop or geometry provenance drift;
black/blue artwork remains unclassified; elevation/biome
palette lacks meaning; small islands disappear; owner approval
for territorial masks or child boundaries is absent.

No changes to canonical PNGs, generated polygons, biomes, routes,
settlements, Saves, gameplay or main branch are authorized.
