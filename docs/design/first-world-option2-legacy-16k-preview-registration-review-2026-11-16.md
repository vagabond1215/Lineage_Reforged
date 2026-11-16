# First World Option 2: zipped preview registration review against legacy source

Date: 2026-11-16  
Status: **SOURCE-ALIGNED RASTER PREVIEWS; CANDIDATE TRANSFORM ONLY / NOT CANONICAL GEOMETRY**  
Depends on [archived 16K source triad](first-world-option2-16k-export-triad-manifest-2026-11-15.json), [rendered island/component probe](first-world-option2-16k-rendered-connectivity-review-2026-11-16.md), and [coordinate-first authority](coordinate-first-world-geography-migration-contract-2026-11-13.md).  
[Compact machine readback](first-world-option2-legacy-16k-preview-registration-review-2026-11-16.json).

## Exact owner evidence received and checked

The owner executed a guarded read-only Windows audit then an OpenCV 5.0 / NumPy 2.5.5 alignment run, and uploaded unmodified `FirstWorld_Option2_Registration_Audit.zip`: **5,244,922 bytes**, SHA-256 `3ee73eeb11fc1dadaae74e3f2f9b7b89d0b47fba7c43c82e85795d26f52458e2`; ZIP CRC validation passed. Archive contains **seven 2048 × 1177 preview PNGs** (old Biome/Height, new State/Biome/Height, and two biome overlay/edge diagnostics), plus `registration_candidate.json` (162,427 bytes; SHA-256 `6d4073dfaba9ca1561c81ccda06ad2b572e28b99aac5371aaa3384664c21f6b7`) and `source_inventory.json` (5,000 bytes; SHA-256 `0184f19d1c1fd64b723280ff7226132d0924cdc5e643d6cff844360e9c2aeb6a`). **The ZIP does not contain the raw 16K source PNGs**; their original bytes and hashes already reside in master via scoped Git LFS.

Five source file SHA-256, dimensions, and sizes all passed the owner's local audit:

| Layer | IHDR dimensions | SHA-256 |
| --- | --- | --- |
| New Option 2 State | 16384 × 9421 | `419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de` |
| New Option 2 Height | 16384 × 9421 | `776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce` |
| New Option 2 Biome | 16384 × 9421 | `c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2` |
| Legacy First World Biome | 4096 × 2355 | `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12` |
| Legacy First World Elevation | 4096 × 2355 | `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d` |

The inventory was taken in a Windows checkout still at the older source-intake head `805754e118f23cc8f4cc21e0eaa9d1ac44ddf8bc`, with **pre-existing untracked nested directories**. That does not spoil the byte-verified PNGs, but is not proof that the user's checkout or game state equals latest master. One simulator save was found, `20260315141309.save`, 1,235,224 bytes, SHA-256 `db27f0ce24d66bb168a08744fdf58965f42a1cc0163fcde9902a0ff03787ddd3`. The save **is not decoded or linked to the exports**. Do not publish its binary or use its filename as an identity claim.

## Machine alignment and independent preview checks

The Python probe ran six SIFT candidate fits with a held-out feature split, using gray/gradient/Canny image representations on Biome and Height. All six affine-like preview mappings are **almost the identity** when comparing equal-size 2048×1177 previews, and report matching in all four image quadrants:

| Pair / feature | Fitting inliers | Held-out matches within 3 preview px |
| --- | ---: | ---: |
| Biome gray | 807 / 897 | 86.22% of 225 |
| **Biome gradient (selected)** | **1993 / 2049** | **97.47% of 513** |
| Biome Canny | 884 / 926 | 91.81% of 232 |
| Height gray | 1138 / 1268 | 90.54% of 317 |
| Height gradient | 1990 / 2079 | 96.54% of 520 |
| Height Canny | 895 / 957 | 94.17% of 240 |

Selected Biome-gradient `new preview → legacy preview` matrix:

```text
[ 0.9999187252146904,  0.0000170363395435, +0.0799944905932981 ]
[-0.0000170363395435,  0.9999187252146904, +0.0573542757299709 ]
```

For that candidate: 2,562 initial ratio matches, 2,049 fitting matches, 1,993 inliers (97.27%), 513 held-out matches, 97.47% within 3 px. The **held-out matches within 3 px** have median **0.289** and p95 **1.0224** preview-pixel error. All held-out matches, **including outliers**, have max error **1,199.3463** px; automatic keypoint matching is not an independently predeclared landmark audit, and the outliers must not be silently discarded.

The uploaded old/new previews were also decoded and compared **directly**, without relying on SIFT's self-reported matches. Over their full 2048×1177 pictures, 80.616% of Biome and 78.895% of Height RGB pixels match exactly. Restricting to the common inner image rectangle `[30,30,2018,1147)` (2,220,596 pixels), exact RGB rates rise to **87.231% Biome** and **85.362% Height**. On the 561,284 common non-blue-water pixels under the separately stated *preview-specific* ocean RGB rule, exact RGB rates are **72.558% Biome** and **65.163% Height**. The rendered-water classifications disagree at **5,292 / 2,220,596** inner preview pixels (**0.238%**) under that rule. Colored parent lines and original black coastlines differ visually; these counts **do not prove every original land polygon is identical**.

The visual overlay and edge comparison show widespread alignment of large continental coastlines, the northern island groups, Serathyl, Draemor–Talmyra, the detached center island and Serpent's Wake. **Geographic colors change more than the terrain silhouette**. State-parent assignments (Dawnreach Option 2, Myridian and the others) are not recoverable merely from the old Biome/Height colors.

## Precise legacy crop semantics now settled

Earlier handoffs correctly reserved judgment about `(60,60,3976,2235)`. This connector review verified the authority in [`world_maps.json`](../../packages/content/base/world/world_maps.json) and [`scripts/regenerate_world_map_features.ps1`](../../scripts/regenerate_world_map_features.ps1). The latter constructs **`System.Drawing.Rectangle(x, y, width, height)`** from `assetReferenceRectPx` and calls `Graphics.DrawImage` onto a derived 2048×1152 authored reference (or a downscaled diagnostic resolution). Therefore the 3976 and 2235 numbers are **width and height**, not far-right and bottom coordinates.

Composing the near-identity new-preview→old-preview fit, raw raster dimensions and the documented legacy crop yields this **provisional** raw 16K full-image coordinate to 2048×1152 reference affine:

```text
x_ref ≈ 0.128762170 × x16 + 0.000002193 × y16 − 30.823024
y_ref ≈−0.000002196 × x16 + 0.128834911 × y16 − 30.867024
```

The *simpler no-fit frame scaling* is:
`x_ref ≈ (x16/4 − 60) × 2048/3976`,  
`y_ref ≈ (y16 × 2355/9421 − 60) × 1152/2235`.

Their difference is very small (less than approximately 0.12 reference pixels at the image corners), but this is **not** a subpixel geographic guarantee. The 16K frame is one image pixel taller than 4×2355, and OpenCV resizing and GDI+ source-crop pixel-center conventions still require exact source and held-out landmark verification. The 16K rendered-land crop `[240,240,16144,9176)` is consistent with the older `(60,60)` top-left border at roughly 4× scale, but its lower extent should not be silently presumed exact.

## Decision and next bounded gate

**PASS:** archive CRC / source hashes / complete previews / reproducible SIFT candidates / near-identity map silhouette / legacy source-crop *semantics*.  
**REVIEW-READY SOURCE CANDIDATE:** numerical raw-16K→2048×1152 mapping for visual debugging and predeclared landmark evaluation only.  
**HELD:** exact full-resolution old-versus-new pixel-center transform; held-out independently identified source coastline/island landmarks; local Draemor–Talmyra crossing semantics; physical connected-island inventory under independent classifiers; simulator save/export match; all geographic parent and child polygons, environmental interpretation, maritime route permissions, settlement anchors, new regional and political sovereignty; release of canonical `world_maps.json` or `world_map_features.json`.

Next safe validation: use **existing authoritative region-coordinate landmarks and explicit source coasts** to make before/after old/new reference-frame overlays, with held-out coast points covering north/east/south/west. Inspect whether any mismatch clusters at tiny islands, colored shore ink or tidal-neck contact. Coordinate authoring and gameplay remain unchanged. **No canonical geometry write approved by this document.**
