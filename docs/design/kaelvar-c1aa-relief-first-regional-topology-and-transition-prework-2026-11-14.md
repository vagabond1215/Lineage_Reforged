# Kaelvar C1-AA: relief-first region topology and environmental transitions

**2026-11-15 continuation:** [qualitative visual review and native result](kaelvar-c1aa-qualitative-relief-review-2026-11-15.md) keeps both C1-P seams unchanged and holds final geographic selection. Hosted and Windows executable gates now pass; source semantics and owner approval remain held.

Date: 2026-11-14  
Status: **CONNECTOR-SAFE PREWORK ONLY; NATIVE GATE AND OWNER GEOGRAPHIC INTERPRETATION SEPARATE**  
Previous accepted review: [C1-Z source-indexed seam trials](kaelvar-c1z-reversible-northern-and-southern-mainland-seams-handoff-2026-11-14.md)  
Read-only native contract: [C1-AA original source-pair and coverage constraints](kaelvar-c1aa-relief-first-regional-seams-prework-2026-11-14.json)

## Owner design decision: geographic regions, not political borders

Kaelvar's regions should be **geographic identities**, determined first by
recognizable topography and general environment. They do not imply a
government border, military fortification, fence, treaty line, customs post
or player-visible painted boundary.

Regional boundaries should **eventually touch on finalized contiguous
land** unless a deliberately identified physical/geographic exception
justifies a separate classification. The authoring-stage reserve currently
left between C1-P polygons is **not inherently a permanent no-man's-land**.
It should not be automatically filled while physical land, islands and the
underlying relief convention remain unresolved.

Choose suitable mountain divides, ravines, plateau edges, major valleys,
genuine rivers and coastlines **when independently supported by the source**.
An ecotone, gradual relief change and mixed-biome belt are normal. A
biome color edge alone is never evidence of a hard regional frontier.

An exact coordinate-to-region decision can coexist with an
imperceptible, ecologically gradual transition. Preserve a deterministic
primary region for every **finalized land** coordinate without requiring
players to perceive that internal software division.

## Original elevation is a colored source, not a calibrated height field

The registered original source assets are:

| Source witness | Frozen value |
| --- | --- |
| Elevation | `packages/content/base/world/map_assets/First World Elevation.png` |
| Biome | `packages/content/base/world/map_assets/First World Biome.png` |
| Each original PNG | 4096 × 2355 pixels |
| Original source crop | x=60, y=60, width=3976, height=2235 |
| Source reference grid | 2048 × 1152 |
| Original biome SHA256 | `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12` |
| Original elevation SHA256 | `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d` |
| Coastline vector blob | `9cd6752e9dbca00796e5f7c013066bb0e5a96175`, 599 edges |

Existing [C1-H raw-relief diagnostics](kaelvar-c1h-source-landform-diagnostics-and-gates-2026-11-13.md)
already identify the source's elevation brightness as **uncalibrated**,
not measured height. The [C1-G ecology validator](../../scripts/lib/kaelvar-c1g-ecology-evidence.mjs)
also pins `elevationScaleStatus === 'COLOR_RAMP_UNCALIBRATED'`.
The [C1-F source-pair classifier](../../scripts/lib/kaelvar-c1f-source-raster.mjs)
uses independent original RGB differences as **terrain candidates**, not a
height-to-meter conversion or definitive ocean/river classifier.

Therefore C1-AA **must not** claim meters, slope angle, aspect, drainage,
watershed separation, mapped river, canyon, escarpment or plateau solely
from PNG RGB or luminance. Qualitative color/texture changes are useful
visual *questions* for a human reviewer. A feature can be called
**source-verified** only after an appropriate legend, topographic
interpretation or other independent evidence establishes its identity.

The current world map includes authored horizontal map scale, but this
does not establish an elevation-color-to-altitude scale or license
hydrological modeling.

## Backend proposal: one primary region, optional ecological influence

This is an architecture **proposal**, not a schema migration.

1. **Physical surface:** Independently classify finalized land/water,
   original component topology and deliberately held source uncertainty.
   An ink gap is not physical seawater or dry land merely because it helps
   join region polygons.
2. **Primary geographic coverage:** On finalized land, shared-boundary
   region polygons resolve to **one primary region ID** per coordinate.
   Adjacent polygons share an edge or vertex, without overlapping
   interiors. Explicit source-uncertain land remains withheld until
   adjudicated; authoring reserve is not an everlasting blank region.
3. **Deterministic edge rule:** Choose a stable and documented tie-breaker
   for points exactly on a shared boundary (for example a canonical
   priority or region ID ordering). Do not use scan order, visual layer
   order or stochastic blending to determine primary membership.
4. **Secondary environmental transition:** If meaningful, separately
   record neighboring regional environmental influence. Such influence
   can overlap both sides of a precise primary boundary, without
   overlapping primary sovereign polygons or requiring a new region ID.
5. **Optional named natural borderlands:** Only author a named frontier,
   pass, canyon, marsh or ecotone when the geography actually warrants it;
   do not create a separate political or geographic region for every
   interpolated transition strip.

No definite environmental influence width or percentage is chosen here.
Widths should depend on terrain, climate and geographic scale, not a
fixed number of image pixels. The current 4-cell residual-gap trial
constraint was a C1-Z safety condition **only**, not a permanent
regional coverage rule.

### Future command-driven player presentation (deferred)

A player issuing movement commands can learn of a change in vegetation,
temperature, slope, wildlife, resources and travel conditions gradually
through contextual travel logs and area descriptions. An exact
coordinate crossing need not produce a border notification. Distinct
river crossings or mountain passes may create explicit events if they
exist in the geography. Future monster/resource encounter weights could
be influenced by nearby environments while settlement and location
lookups use primary region IDs.

**Do not implement** logging, spawn blending, encounters, climate,
settlement placement or geographic knowledge changes in C1-AA. The
immediate priority remains continent/region map coverage and eventual
settlement geography.

### Existing data boundaries

`packages/content/base/world/regions.json` records regional identity,
parentage and environment descriptions. The geographic source layer
and region candidate shapes are separate: the C1-P polygons remain
**noncanonical design candidates**, not a new field automatically
pushed into the existing `region.schema.json`. A region resolver
should eventually consume vetted geographic geometry rather than
narrative `environmentProfile` strings.

## C1-AA: two-source visual comparisons, not gap optimization

C1-Z found four independent *geometry-valid* local waypoint experiments:

| Interface | Original baseline | Optional reversible study | Trial reserve gap | Trial changed mainland candidates |
| --- | ---: | --- | ---: | ---: |
| Veyrholm–Kharuun | 10 | Veyrholm south by 2 ref px | 8 | 30 |
| Veyrholm–Kharuun | 10 | Kharuun north by 2 ref px | 9 | 29 |
| Kharuun–Verdant | 15 | Kharuun south by 3 ref px | 13 | 53 |
| Kharuun–Verdant | 15 | Verdant north by 3 ref px | 12 | 54 |

**C1-AA adds KEEP_C1P_UNCHANGED as an equal third option for each
interface**, instead of ranking choices by gap closure. For each
interface, the review shall show the **same three geometry options**
against (1) the unmodified original elevation raster and (2) the
unmodified original biome raster. The latter is context only.

The paired views are meant to answer, qualitatively:

- Is there an independently recognizable upland divide, saddle,
  escarpment, major valley, river or other natural feature?
- If the land changes gradually, would sharing boundaries at a
  representative point while retaining an environmental transition
  be more appropriate than protecting a permanent blank strip?
- Do any options produce arbitrary kinks, cut across a likely
  landscape feature, or conflict with protected source anchors?
- Could a wider, independently justified contour-following
  alternative be better than the four tiny one-waypoint shifts?

The **review status defaults to HOLD** where calibrated elevation or
independent landform evidence is missing. No "best" waypoint is selected
using color, unassigned-gap length, trial region gain or source image
brightness. Valid geometry is necessary but not sufficient for a
natural geographic border.

## Acceptance and current frozen baseline

C1-AA is permitted to add source-backed review scripts, original-image
comparison SVGs, original RGB sample metadata, tests, decisions and
handoff documentation **only**. It must reject any attempt to modify
original source vector/PNG, terrain components, held islands, active
region polygons, canonical content or gameplay.

Frozen C1-P original component-30 source-candidate accounting:

| Four provisional region proposals | Candidate cells |
| --- | ---: |
| Auric Marches | 5,632 |
| Kharuun Drylands | 18,624 |
| Verdant Thalos | 19,182 |
| Veyrholm Shore | 9,011 |
| **Assigned (noncanonical)** | **52,449** |
| **Unassigned authoring reserve** | **26,970** |
| **Original mainland component 30** | **79,419** |

Preserve Kharuun option B coastline original edges **35–58**; all
Verdant southeastern peninsula anchors; all three Veyrholm dry-inland
exclusion anchors; northeastern headland edges **75–115** and component
51 as held; Shattercap, large detached northeastern island, the other
independent physical components, Coast 40 and foreign Serathyl
Windward. No additional island parents, settlements, ports, wells,
water routes or salt basins are authorized.

C1-AA hosted Node/source tests, if run, are not a substitute for
owner Windows PowerShell-native validation. Document the **exact
tested implementation SHA** separately from later documentation
commits. Large generated comparisons belong in short-lived CI
artifacts, not tracked Git.

## Next Codex-local execution when available

After the read-only C1-AA evidence is reviewed:

1. Determine whether the original elevation map has an authoritative
   palette legend, source elevation encoding or independently
   defensible relative contours. If not, treat the SVG as qualitative
   source art and request/derive verified geographic features before
   selecting a boundary.
2. Inspect both interfaces on the original elevation underlay. Record
   KEEP versus the two options, geographic justification and confidence;
   **HOLD** if relief is ambiguous.
3. Plan shared regional coverage for finalized physical mainland land
   without prematurely annexing unknown coastline or offshore
   components. Separate that geometric coverage from future optional
   environmental transition influence.
4. Only then author a **distinct reversible** source-indexed candidate
   if geography supports one; native-validate source hashes,
   topology, coastline, anchor protection, component-30 accounting,
   region overlap and islands. Retain owner selection and Windows-local
   acceptance as gates.
5. Prioritize continent/region coverage and defensible future
   settlement siting before gameplay transitions or automatic
   ecology systems.

**No region selection, transition width, active polygon, island claim
or source elevation calibration is approved by this document.**

## Minimal proposed resolution contract (2026-11-15; documentation only)

Use a versioned geographic geometry set, with `mapId`, `coordinateSpaceId`,
`geometryVersion`, source/approval references and stable `regionId` polygons.
Store each shared edge once, referenced in opposite directions by neighboring
region rings, or enforce exactly identical shared coordinates at authoring
validation. Nonoverlapping interiors and complete coverage of **finalized
land** are the invariant. Physical surface and political control have separate
owners; neither is inferred from region membership.

A future `resolvePrimaryRegion(point, geometryVersion)` should return a
tagged result: `RESOLVED` with `primaryRegionId`, or `UNRESOLVED_AUTHORING`,
`SOURCE_UNCERTAIN`, `HELD_COMPONENT`, `NON_LAND`, or `OUTSIDE_FRAME` with an
explicit reason. On finalized land, absence or overlapping interiors is a
validation error, not nearest-region fallback. Authoring-unresolved statuses
remain useful during development but may not silently pass final coverage.

For exact shared edges/vertices, use the lexicographically smallest stable
region ID among the approved incident regions **at the same geographic
hierarchy level**. Apply this only after topology validation: it must never
hide interior overlaps, uncertain land or held components. Parent continent
membership is separate from the primary child-region decision. Normalize
coordinates in one versioned fixed-point representation; quantization and
edge predicates must be shared by authoring and lookup, not chosen ad hoc by
callers. Changes to precision or the tie rule require a geometry version.

Settlement locations should call this same coordinate resolver. Any cached
`primaryRegionId` must also carry the geometry version and be checked against
the settlement coordinate; neither settlement text nor existing administrative
affiliation overrides geographic lookup. No settlements are placed here.

Optional `transitionAreas` can later contain `id`, neighboring `regionIds`,
an approved `geometryRef`, descriptive environmental tags and provenance.
They may overlap both primary regions without changing either primary ID.
An intentional ecological transition is **resolved geography**, not an
unassigned primary strip. Omit unapproved transition geometry; do not turn a
review window or current polygon gap into a band. No numeric blend weights,
fixed width, extra region, encounter distribution or runtime engine is needed.
Future narrative, encounters, resources, monsters and travel-condition owners
may consume the primary ID and optional influences under their own contracts.

Compatibility gap: `findCoordinateAreasAtPoint` in
`scripts/lib/world-geographic-authority.mjs` currently throws when multiple
REGION polygons contain a point; `coordinatePolygonContains` includes edges.
That review helper does not implement the proposed shared-edge tie rule.
A later authorized resolver must distinguish shared-boundary ties from
interior collisions and test edge interiors, multi-region vertices, holes,
points on either side, reordered input, held components and version changes.
Do not weaken today's fail-closed helper or C1-Z's four-sample trial reserve
as a shortcut. Kharuun/Veyrholm canonical records are separate held
registration dependencies. This section is a proposal, not deployed behavior.
