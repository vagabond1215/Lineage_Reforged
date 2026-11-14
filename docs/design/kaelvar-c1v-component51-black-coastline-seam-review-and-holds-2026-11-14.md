# Kaelvar C1-V: component 51 original-source coastline separation review

Date: 2026-11-14  
Status: **HOSTED NATIVE VERIFIED; COMPONENT 51, NE HEADLAND AND CANONICAL OWNERSHIP HELD**  
Test-bearing implementation SHA: `2392501df295967897ef540040f94f6d3e5e775f`  
[Successful hosted native run #43648675004](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43648675004)  
[Exact measurement witness JSON](kaelvar-c1v-hosted-component51-physical-source-evidence-2026-11-14.json)

## Decision

**Do not merge original terrain component 51 into mainland component 30,
declare it an independent island, or assign any portion of the northeastern
headland to Verdant or Shattercap yet.** C1-V has narrowed the ambiguity
from a vague shoreline question to a specific **single excluded,
shared-black pixel** at reference coordinate **(469,213)**.

There is a hypothetical 4-neighbor candidate connection from original
component 51 at **(469,212)**, through this black pixel, to original
component 30 at **(469,214)**. The strict original source-pair
classifier excludes the middle pixel, and the source coastline vector
cuts through the feature itself. Neither the strict gap nor its
hypothetical closure certifies the location of actual water or dry land.

This component is not the separately held large northeastern island or
the Shattercap chain. It is a tiny source-candidate feature beside the
**original-mainland northeastern headland**, whose original source
coastline segment **75–115** remains unassigned. Verdant's separate
**southeastern** peninsula is still included in C1-P.

## Full original physical component, not just the 13 enclosed pixels

C1-U reported **13** component-51 candidate pixels inside each of its
locally valid headland review envelopes. C1-V independently scanned the
full original `2048×1152` registered terrain-label raster:

| Original-source metric | Result |
| --- | --- |
| Strict terrain component label | **51**, independently 4-connected |
| Full component-51 area | **21** reference-grid candidate pixels |
| Reference-grid bounding box | x=466..470, y=206..212 |
| Component pixels **inside** original mainland vector contour | **13** |
| Component pixels **outside** that contour | **8** |
| Pixels inside each C1-U inset and compact enclosure | **13** |
| Nearest indexed headland coast edge | **81** |
| Minimum sampled center-to-source-edge distance | **0** uncalibrated reference pixels |
| Maximum sampled center-to-headland-arc distance | **1.7** reference pixels |

The source coastline runs **through the component footprint** rather
than simply enclosing all 21 cells as ordinary mainland or clearly
separating all 21 as an offshore island. The raster and vector are
different witnesses and do not establish a calibrated shared land/water
legend by themselves. A zero distance is a source sampling fact, not
evidence of safely traversable terrain.

## Immediate pixel-neighborhood original-pair test

C1-V counted the four-neighbor perimeter of all 21 component-51 cells:

- **60** sides meet another component-51 sample.
- **24** outward sides meet original label-0 excluded samples.
- These 24 sides touch **18 unique excluded samples**.
- All **18** are **exact shared-black** biome/elevation samples.
- **0** sides directly meet mainland component 30 or another numbered
  physical terrain component.

The original classifier deliberately excludes these shared-black
samples. It does not independently certify them as water or land. No
original source PNG pixel, alpha, coastline coordinate, terrain
component or region geometry was rewritten.

### Five bounded, hypothetical connectivity tests

The fixed review window was original reference coordinates
`x=440..515, y=185..255`. It used 4-neighbor connectivity, original
vector containment for hypothetical pixels, existing owner codes
**0/unassigned** or **3/Verdant** only, and forbade all other numbered
physical components.

| Source-pair rule in scratch mask | Component 51 reaches component 30? | Unknown samples used |
| --- | --- | ---: |
| **Original unchanged** | **No** | 0 |
| Admit identical-source **black only** | **Yes**, 2 reference-pixel steps | **1 black** |
| Admit identical-source **teal only** | **No** | 0 |
| Admit identical-source black + teal | **Yes** | **1 black** |
| Admit all shared nonblue | **Yes** | **1 black** |

Each positive case uses the same three source-reference sample centers:
`(469,212) → (469,213) → (469,214)`. The corresponding source-path
SHA256 is
`81534e9799d4f6b83c9c0ba106c25de2143de2b53636ecd362b0239867c7d1b8`.
The hypothetical route has **zero proper crossings** of original
coastline edges, but that alone does not certify physical passage;
one of its pixels is excluded original shared-black ink.

The source image visually suggests a small outlined coastal protrusion,
but the pixel evidence supports **multiple possible physical
interpretations**. A coastline pen stroke, a genuine small island, and
an unresolved shoreline gap must remain distinct hypotheses.

## Verification and original-source protection

The [pinned GitHub Actions run](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43648675004)
used GitHub-hosted Ubuntu and Node 22. It passed **51/51** combined
C1-O through C1-V Node tests, with **zero** new legacy-hex
dependencies across **884** scanned code files. The native command
reverified original PNG SHA256 fingerprints, vector blob, source
registration, 599 coastline edges, protected source geometry and
complete C1-P terrain accounting.

The run produced original-source-underlaid SVG and JSON evidence;
artifact `c1p-noncanonical-native-terrain-review` has ID
`14135321430` and seven-day retention. The pinned JSON SHA256 is
`b9ce8c4b7b4c6a0d7349ac1c003544bf6a4ca46d4dca4e1a2d98a6bd1c539e95`.
The user-facing native preview draws the original indexed headland
arc **open**, without inventing a false closing coastline segment.

**Owner Windows PowerShell-native acceptance has not been rerun.**
The hosted pass is not a substitute for that independent local gate.

### Frozen C1-P candidate-terrain accounting

| Region / reserve | Registered mainland component-30 cells |
| --- | ---: |
| Auric Marches | 5,632 |
| Kharuun Drylands | 18,624 |
| Verdant Thalos | 19,182 |
| Veyrholm Shore | 9,011 |
| **Four reversible regional candidates** | **52,449** |
| **Deliberately unassigned mainland** | **26,970** |
| **Original mainland candidate component total** | **79,419** |

Kharuun retains option B original source coast edges **35–58**.
The southeastern Verdant peninsula's three inclusion anchors and all
three Veyrholm inland exclusions remain protected. The northeastern
headland, component 51, original detached physical components, large
NE island, Shattercap, Coast 40 and foreign Serathyl Windward remain
independently held. No new water resources, roads, ports, navigable
routes, salt basins, active geometry or canonical world changes were
published.

## Recommended C1-W: adjudicate physical interpretation before another polygon

The technical question is now unusually small: **what does the original
black stroke at (469,213) represent, relative to the original coastline
at edge 81?** Repeated hypothetical mask widening adds little until
that convention has independent source support or an owner decision.

1. Show the original unaltered high-resolution biome/elevation pair,
   exact source vector, and the 21-cell component split together,
   without coloring excluded black ink as permanent land.
2. Record whether that coastal feature is intended as a physically
   attached headland tip, a separate islet, or unresolved stylized
   coastline ink. Any decision must explicitly acknowledge the
   13-inside / 8-outside source-vector disagreement.
3. Only **after** physical-source adjudication, author one reversible
   polygon alternative if appropriate and repeat source fingerprints,
   topology, region collisions, exact component accounting, all island
   holds and the native preview. The previous naive entire-Verdant
   shortcut still crosses original coast and overlaps Kharuun, so do
   not reuse it.
4. Keep canonical publication blocked pending owner approval and
   applicable native Windows review.

### Lifecycle receipt

All C1-V work used the existing branch
`connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14`.
No new development branch, draft PR or local worktree was created.
The GitHub connector cannot inspect local Windows disk/worktree status;
no local disk cleanup is claimed. Generated SVG artifacts remain
short-lived rather than growing the Git repository.
