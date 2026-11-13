# First World regional environment suitability: independent-source audit gate

Date: 2026-11-12
Status: **SOURCE RGB / RAW ELEVATION EVIDENCE TOOLING ADDED; SEMANTIC BIOME/ELEVATION CALIBRATION AND LANDSCAPE-FIT SIGNOFF NOT YET DONE**
Branch: `connector/first-world-raster-macro-evidence-pilot-2026-11-12`
Scope: **read-only diagnostic**, no canonical region polygon, biome zone, settlement, source PNG, route, Save, gameplay, branch or world-creation changes.

## Why the previous full continent audit is insufficient

The Nov 12 continent–region–biome audit compared
`regions.json.environmentProfile.dominantBiomeMix` with the 230
existing generated `world_map_features.json.biomeZones` and the
36 canonical `biomes.json` definitions. It noted the single-biome
dominance of many regions, all 12 island child regions without
independent footprints, Watcher Coast's missing surface biome coverage
and Dawnreach's 91.7% unlabeled surface. That is valuable **semantic
triage**, but the original biome and elevation PNG pixels were **not
independently interpreted** at the time.

The generator may replace one-zone surface masks with a whole
administrative region mask. Thus 100% same-owner biome overlap is
circular and is **not physical evidence that the region lies in that
biome**. Recent PR #79 source raster work independently established
land vs water and 4-/8-neighbor components only. That does not mean
a region's forests, prairie, farmland, altitude or climate correspond
to the source PNGs.

## Verified current ownership: separate from ecological suitability

Owner-executed native raster witness:

| Component | Land pixels | Covered unique pixels | Unclaimed pixels | Cross-macro direct overlap | Same-macro child overlap |
|---|---:|---:|---:|---:|---:|
| Kaelvar mainland 25 | 86,417 | 85,055 | 1,362 | 0 | **88** |
| Coast 40 island 91 | 229 | 207 | 22 | 0 | **0** |

Windward Spine Part 1 has 4,326 native land pixels on Kaelvar's
mainland; Windward Part 2 and Verdant Part 6 share distinct Coast
40 island component 91 with 110 / 97 existing labeled pixels.
These facts identify suspect territorial **partitioning**, not an
approved child-region replacement or a biome/elevation interpretation.
All 88 overlapping mainland pixels are internal to one macro; do not
interpret the 88 summed feature excess as cross-continent overlap.

## New native source-raster evidence

Run from an isolated checkout of the PR #79 branch:

```powershell
node --test tests/unit/first-world-environment-evidence.test.mjs
node scripts/first-world-environment-evidence.mjs --check > first-world-environment-evidence.json
node scripts/first-world-environment-evidence.mjs --swatches-svg > first-world-biome-rgb-swatches.svg
```

The report verifies the audited geometry SHA (allowing only
pure Windows EOL conversion), 42 previously approved square
exclusions and 159 effective footprints. It reads both original
biome/elevation PNGs and their SHA-256s using the same source
crop and 2048×1152 reference transform as the prior raster witness.

For every retained region footprint and deduplicated authored region
and macro union, the report records:

- source biome image **exact RGB** frequency and top color swatches;
- original elevation image raw luminance p10/median/p90 and
  near-grayscale percentage, **not** height in meters;
- source-raster land pixels and any terrain-water area inside
  administrative polygons;
- authored `dominantBiomeMix`, `elevationProfile`,
  `positionLabel`, climate tendencies, agricultural potential,
  and parent-macro ecology's `dominantBiomeIds` when defined;
- distinct source candidate part profiles, so Windward 1/2,
  Verdant 1/6, and any future geographic split can be reviewed
  without assuming a region's aggregate biome represents its outlier.

For macro and region summaries, overlapping polygons are counted as
a **set union**, not a sum, avoiding artificial inflation. Individual
part profiles remain separate for provenance. The swatch SVG groups
raw RGB into 4-bit-per-channel clusters for visual color calibration.
These are unlabeled swatches, **not** trustworthy forest/desert
classifications and not a certified color legend.

## Mandatory ecological interpretation gates

**E1. Approve source biome palette.** Independently inspect the actual
`First World Biome.png` map colors and any original legend. For each
distinct continuous color class or artwork palette cluster, approve a
canonical biome mapping, a transitional / mixed / unknown code, or an
explicit non-terrain annotation. A single RGB label must not be
inferred from an existing region polygon or its authored biome zone.
Avoid claiming complete classification where gradients, labels or
decorative map colors make separation ambiguous. Untagged pixels
remain `unknown` with coverage reported.

**E2. Calibrate source elevation.** Confirm whether
`First World Elevation.png` actually encodes grayscale height, a
hypsometric color table, illumination, or mixed art. Approve any
gray/color-to-height transfer and relevant sea-level reference
before declaring coastal lowland, upland, high plateau or mountains.
Raw image brightness quantiles are **diagnostics only**, never
automatically physical meters or terrain grade.

**E3. Validate authored expectations, not sizes.** The subregion
mix, parent macro ecology, climate tendencies, elevation description,
hydrology, landscape and natural coastal position together inform
candidate placement. Explicitly compare landscape-compatible cells
and incompatible interior clusters for every region and independent
island child. A proposed region boundary should follow ecologically
coherent lowland, plateau, forest, river, mountain, climate and coast
structures when geography supports it, **not** equal-sized polygons
or global nearest-anchor Voronoi regions.

**E4. Allow transitions.** A natural boundary may straddle forest/
prairie, woodland/steppe, marsh/coast, or mountain foothill ecotones.
Evaluate both a small boundary-transition band and the substantial
interior independently; permit mixed biomes in ecological margins.
Do **not** force exact single-biome purity, remove tiny islands, or
relabel land automatically because one pixel differs from the
region's authored description. Report conflict proportions and
contiguous incompatible patches; obtain approval for hard thresholds.

**E5. Separate land use and subsurface/marine.** Farmland,
orchards, villages, roads, farmland fertility, irrigation and
political ownership are **not direct biome-image colors** unless
the original source legend explicitly maps them. Validate agrarian
descriptions against river access, climate, soils/land-use evidence,
settlement and resource authoring. Surface land masks must not
consume the underwater Nacre Shelf or Deepglow Reef, and marine or
subterranean zones are separate from dry land.

**E6. Audit every candidate redraw.** Build a baseline/proposal
side-by-side terrain and labeled-biome overlay with source elevation
transects. Report new region land area, source palette composition,
elevation distribution, coast and water changes, ecotone margin,
interior contradictions, old-ID to new-ID provenance and affected
settlement/route/hex dependencies. Owner must explicitly approve the
Kaelvar child-region assignment and the separate Coast 40
political island split before any canonical write.

## Known regional expectation examples, not verified source biome truth

| Region | Authored expectation | Examples of mismatches to investigate once palette is verified |
|---|---|---|
| Kaelvar: Auric Marches | Dry scrub, steppe, upland meadow; plateau/broken uplands | Dominant rainforest or icecap in its interior |
| Kaelvar: Verdant Thalos | Mediterranean woodland, mixed forest, coastal scrub; low hills/coast, high agricultural potential | Predominantly extreme desert/tundra or high alpine interior |
| Kaelvar: Shattercap Isles | Cool conifer islands, cold marine, rugged islands | Warm desert/savanna mainland or large inland agricultural plain |
| Serathyl: Windward Spine | Mountain chain, alpine/cloud forest/high conifer and cold wet uplands | Broad flat dry steppe or hot desert without highland transition |
| Serathyl: Green Reach | Temperate rainforest and humid forest interior | Large dry desert interior |
| Valtherion: Jade Expanse | Stormbound prairie, mixed agrarian expanse | Predominantly polar ice or tropical wetland without ecological explanation |
| Draemor: Heart Basin | Prairie/basin, wetland/deciduous transition | Dominant tundra and polar mountains |
| Talmyra: Watcher Coast | Dry scrub and mangrove coastal microzones | Fully unclassified dry land, as current derived coverage shows |
| Myridian / Lantern island systems | Mixed and seasonal tropical/temperate archipelago habitats as authored | Treating parent-wide derived 100% chaparral as independent source evidence |
| Dawnreach Isles | Cold marine, conifer/taiga/tundra | Treating 91.7% missing generated surface coverage as physical tundra |

These examples are **QA hypotheses from `regions.json`**, not
empirically verified source-raster classifications. The region's
written description is an input expectation and can itself be stale
or misplaced; an independently interpreted terrain raster can reveal
a need to revise the authored lore rather than move every land cell.

## Current stop / go decision

- **Can proceed:** Source RGB/elevation raw evidence for all regions,
  color-swatch visual review, explicit palette and height calibration
  decision, Coast 10/40 territorial candidate comparisons.
- **Must stay blocked:** Automatically treating generated biome
  overlays as source truth, claiming ecological suitability from
  unlabeled RGB or brightness, nearest-anchor equal-size
  repartition, automatic political island transfers, canonical
  geometry or biography/biome rewrite.
- **Complete environmental pass exit:** Every approved land region
  has a reviewed biome mix against independently interpreted image
  colors and elevation, remaining unknown/transition coverage is
  quantified, serious interior mismatches have dispositions,
  parent/child landmass topology is valid, and all revised regions
  are accepted against descriptions and physical geography.

## Source swatch land-mask warning (owner visual witness, 2026-11-12)

The first owner-generated 48-cluster SVG covers colors **already admitted
as land by the current provisional RGB threshold**, not independently
confirmed land. Its swatch labels are **averages within 4-bit RGB buckets**,
not exact unique source RGB color values.

The source displays large light-green, bright-green and yellow RGB groups.
The reported provisional-land fractions also include a near-black bucket
(~7.75%), a dark-blue bucket (~1.49%), and a turquoise/cyan bucket
(~0.94%). Their combined share is ~10.18% **of the provisional land
mask**, not a proven sea area. The old mask considers near-black
and some blue/cyan inputs land because it identifies water only when
B > 150, B-G > 25, and B-R > 80. Those buckets could contain water,
map annotations, mountains, shadows or other intentional artwork.
Do **not** reclassify them wholesale based on a swatch or average RGB.

**Additional mandatory L0 gate:** calibrate land/water and no-data
classification against the original visually inspected source image
and any legend or source-layer conventions. Sample candidate clusters
both inside large coast polygons and in obvious open-ocean/background
reference areas; distinguish isolated map text from physical terrain,
avoid converting rivers or inland lakes to arbitrary dry land, and
compare corrected mask connectivity and offshore island components.
Preserve the original SHA, method, and provisional mask as reproducible
baseline. Recalculate the counts for components 25, 82, 91 and all
continents after an approved threshold or source color lookup.
Until then, prior 585,834 land-pixel and 167/160 component counts are
**provisional threshold observations, not final coastal truth**.

The source swatches are not yet a classified land-biome map.
Only after L0 source palette verification should E1–E6 biome/elevation
suitability and candidate boundaries advance.
