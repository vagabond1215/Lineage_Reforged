# Kaelvar C1-W: paired original-image physical interpretation, source-coast tip

Date: 2026-11-14  
Status: **HOSTED-NATIVE C1-W ACCEPTED AS REVIEW EVIDENCE; PHYSICAL CLASSIFICATION AND OWNER DECISION HELD**  
Test-bearing implementation: `021e6af4369e5f195a122888faa7637d032fec8f`  
[Passed GitHub Actions run #43651599921](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43651599921)  
[Compact C1-W machine-readable evidence](kaelvar-c1w-hosted-original-source-owner-review-evidence-2026-11-14.json)  
[The explicit three-option owner review specification](kaelvar-c1w-component51-physical-interpretation-owner-review-2026-11-14.json)

## Result and recommended owner interpretation

**C1-W confirms the source conflict, but does not choose the physical
interpretation or change any geography.** Both original biome/elevation
PNG images have been shown side-by-side at the same exact registered
reference viewport, with the original coast arc 75–115 overlaid **open**
rather than invented as a new closed coast. The third panel adds only
clearly marked source-indexed component/ink diagnostics.

The original unmodified source imagery appears to show a **narrow
coastal tip linked to the mainland**, not a detached green island
surrounded by visible blue water. **My provisional visual recommendation
is an attached promontory**, with uncertainty about coastline ink and
pixel classification recorded. This recommendation is **not** an owner
selection, approved dry-land classification, or a grant of territory to
Verdant or Shattercap. The other two interpretations remain open until
adjudicated.

This is a *physical feature* question: it is distinct from the later
*political owner* question. Even an adjudicated mainland connection
would not authorize reusing the rejected full Verdant shortcut, whose
return previously crossed original coast edge 70 and overlapped 530
provisional Kharuun cells.

## Paired original source at the exact one-pixel seam

The source is original mainland contour
`feature.coastline.first_world.part_10`: 599 source edges, with the
headland review arc at edges **75–115** and component 51 touching
original edge **81**.

| Original reference sample | Original PNG sample | Biome RGB | Elevation RGB | Strict source terrain component |
| --- | --- | --- | --- | --- |
| **(469,212)** | (971,472) | (15,100,40) | (123,126,115) | 51 |
| **(469,213)** | (971,474) | (0,0,0) | (0,0,0) | **0: excluded shared black** |
| **(469,214)** | (971,476) | (15,100,40) | (123,127,116) | 30 (mainland) |

All three reference sample centers lie inside the source mainland vector
contour, but the vector runs through part of the 21-cell component-51
footprint elsewhere. The candidate classification rule excludes shared
black source pixels and distinguishes component 51 from mainland 30.
It **does not classify the black gap as physical seawater**. The bounded
hypothetical black-enabled 4-neighbor path uses precisely the middle
sample and does not establish a walkable or permanently dry land bridge.

From all **21** original component-51 candidate pixels:

- **13** sample centers lie inside the original mainland vector contour.
- **8** lie outside it.
- The **18** unique original excluded cardinal-neighbor cells are
  all exact shared-black source-pair samples; **8** of those 18 are
  vector-inside and **10** vector-outside.
- The original strict component 51 remains separately labeled and
  politically unassigned.

The paired original PNGs are more probative for visual interpretation
than the artificially colorized temporary land-mask experiments, but
the original images and vector still do not establish a calibrated
physical coastline/biome legend.

## The three physical interpretations for owner adjudication

| Physical reading | Evidence that supports it | Unresolved before accepting |
| --- | --- | --- |
| **A. Coast-attached promontory** (visual preference) | The narrow green neck in the unaltered biome image; original coast vector includes the bridge samples; a single shared-black sample separates strict terrain components | Whether the black pixel represents shore ink over continuous ground; whether the source vector is physically authoritative at the overlapping tip |
| **B. Tiny physically detached islet** | Strict original paired-source raster labels component 51 separately; no direct component-51 edge touches component 30 | Whether the black gap truly represents water; why the source vector runs through the feature |
| **C. Unresolved cartographic linework** (conservative hold) | All surrounding excluded pixels are shared black and the source vector divides the component footprint 13/8 | Whether the small green feature is actual terrain rather than stylized source art |

**No option was selected in code.** `ownerDecision` stays null;
the C1-W report marks all three candidate interpretations undecided.
The third reading is a conservative *workflow state* and is not
proof that the feature is merely decoration.

### Recommended next action

Ask the owner to explicitly adjudicate the **physical** form using the
original-source side-by-side image: A attached tip, B detached islet, or
C unresolved artwork. If they select A, begin a **separate reversible
source interpretation review**; do not immediately merge 51 into 30 or
move a region seam. If B, separately investigate original island
contours and sea evidence before any Shattercap relationship. If C,
retain the strict labels and no ownership changes.

**Physical form adjudication does not itself approve political
allocation.** Any future Verdant alternative must have independently
valid non-self-intersecting return geometry and avoid Kharuun and
protected offshore components. All further proposals must reproduce
original source fingerprints, 599 coast edges, original component
accounting and existing protected anchors.

## Hosted acceptance and the unaltered C1-P baseline

The exact GitHub-hosted Ubuntu Node 22 workflow at
`021e6af4369e5f195a122888faa7637d032fec8f` passed **55/55**
C1-O through C1-W Node tests, **zero failures**, the strict source
PNG/vector hash and component-30 terrain gates, and the no-new-hex
scan (**886** code files, **zero** new dependencies). Both the
original-source-pair JSON and SVG outputs were generated and checked.
The source report SHA256 is
`8d212111087fc25acc0d7ecd73868dbd2879bea4c28c6f893ac582fc1667e040`.

The generated artifact is
`c1p-noncanonical-native-terrain-review` with ID **14135449545**
and a **seven-day retention**. It carries the full native JSON and
large source-backed SVG, which are not committed into the repository.
Windows PowerShell owner-local acceptance was **not** executed.

| Reversible region / hold | Original component-30 terrain candidates |
| --- | ---: |
| Auric Marches | 5,632 |
| Kharuun Drylands | 18,624 |
| Verdant Thalos | 19,182 |
| Veyrholm Shore | 9,011 |
| **Four provisional regions** | **52,449** |
| **Deliberately unassigned mainland** | **26,970** |
| **Total registered original mainland component 30** | **79,419** |

All C1-P political boundaries are unchanged. Kharuun retains original
coast edges **35–58** (option B), Verdant keeps the accepted
*southeastern* peninsula and its three anchors, and Veyrholm's
inland exclusion anchors remain protected. The separate
*northeastern* headland remains unassigned. Component 51, Shattercap,
the large northeastern island, all detached physical components,
Coast 40 and Serathyl Windward remain independent holds. No ports,
wells, rivers, sea routes, salt basins, canonical world features,
source coastlines or raster terrain labels were changed.

### Repository lifecycle

The work reuses
`connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14`,
with no additional geography branch, permanent worktree or draft PR.
GitHub alone cannot attest to local `C:\Codex` checkout cleanup.
The generated source-pair image is in the short-lived native artifact,
while this compact evidence and reviewed implementation are retained
in Git.
