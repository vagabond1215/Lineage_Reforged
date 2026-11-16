# First World MG-0/MG-2: Option 2 simulator source registration gate

> **2026-11-16 local intake update:** The exact desktop 16K triad is now archived with scoped Git LFS in [draft PR #90](https://github.com/vagabond1215/Lineage_Reforged/pull/90), with fresh remote-byte verification. See the [source-sync and cleanup receipt](../dev/first-world-map-source-sync-and-cleanup-2026-11-16.md). Earlier missing-upload statements are historical. Save correspondence, coordinate registration, physical topology and canonical publication remain held; PR #89 branch retirement and verified local cleanup are recorded separately.
> **2026-11-15 source update (supersedes the stale missing-image part of the initial status below):** The owner has since supplied the actual **16,384 × 9,421 State, Height and Biome PNGs** inside ZIP `WorldMap_20261115_201735_State.zip`; their verified hashes, sizes and archive CRC are recorded in [the 16K triad manifest](first-world-option2-16k-export-triad-manifest-2026-11-15.json). **The 16K full-map raster evidence is received and verified**. What remains held is (a) physical transfer of the binary assets into GitHub, (b) proof that the current simulator `.save` exactly corresponds to the exported state, (c) explicit source-to-legacy-coordinate registration and connected-island inventory, and (d) tiny-isthmus local topology. Earlier paragraphs describing the triad as missing are historical initial-state requirements, not the present evidence inventory.

Date: 2026-11-15  
Status: **OWNER OPTION 2 VISUALLY APPROVED; FINAL SOURCE-ALIGNED SAVE/EXPORT MISSING; EXACT GEOMETRY HELD**  
Related: [macro lore revision v1](first-world-macro-geography-lore-revision-v1-2026-11-15.md)

## Scope and source-of-truth boundaries

The approved simulator coloring gives coarse parent *geographic* identity, not political states. Preserve every independent island. Use the original simulator save and exported color map as **two different evidence artifacts**, and distinguish them from the original **biome and elevation** source layers. An owner screenshot can ground a layout decision without proving the file byte contents or source-coordinate mapping.

### Available historical file, not accepted as Option 2 final source

Earlier owner-uploaded simulator binary:
- Name: `20260315141309.save`
- Size: **1,182,168 bytes**
- SHA-256: `11da34ba110b17de00813e4effb9213222d213c3445247943f383d9b0ad32245`
- Header observed in earlier binary inspection: `NFW_SAVE_BIN`, version field 1
- Decoder status: **NOT DECODED**; no extractable island, Voronoi, coastal, elevation or nation claims have been certified from this file.
- Its timestamp and attachment precede the later owner-approved November 15 northern Option 2 choice. **Do not claim that it encodes Option 2.** Retain it as an earlier source/provenance comparison only.

Existing First World biome/elevation images:
- `packages/content/base/world/map_assets/First World Biome.png` and `First World Elevation.png`, unchanged.
- Established original source image dimensions: 4096 × 2355; independently registered existing crop `{x:60,y:60,width:3976,height:2235}` onto 2048 × 1152 reference map.
- Previously owner-verified original source hashes: biome `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12`, elevation `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d`.
- Those image colors are environmental evidence, **not** the nine new simulator parent-area colors; an image crop match cannot establish a parent-region claim.

### Required new Option 2 evidence package

| Required artifact | Description | Approval needed |
| --- | --- | --- |
| `option2-final.save` | Fresh simulator save after accepting the second northern Dawnreach/Myri­dian color arrangement | Owner identifies as actual finalized state; exact SHA recorded |
| `option2-parent-colors.png` | Matching *full map* ownership-color export at native export resolution | Same save session; no recoloring in external editor |
| `option2-north-detail.png` | Cropped high-resolution north view showing white U-shaped Dawnreach and red Myridian eastern/southern division | Explicit identity of arc, two major white northern groups and small connecting islands |
| `option2-south-detail.png` | Draemor orange–Talmyra brown contact showing isthmus and blue tidal cutouts | Preserve untouched original pixels and any simulator cell boundaries |
| `option2-detached-island-detail.png` | Myridian red jellyfish-shaped island; indicate location of intended independent merfolk city only as conceptual marker | Do not turn seabed into Myridian polygon |
| `source-identity.json` | Sizes, SHA-256, simulator export version/options, UTC capture time and explicit correspondence of save/export | Needed to claim reproducible source authority |

No exact filename is canonical until actually provided. Do not manufacture placeholder files or reuse the previous screenshot bytes as new export evidence.

## Color mapping approved at macro-parent level

| Color on owner map | Geographic parent |
| --- | --- |
| Dark green | `region.kaelvar` |
| Purple | `region.valtherion` |
| Light magenta/pink | `region.serathyl` |
| Orange | `region.draemor` |
| Brown | `region.talmyra` |
| Red/coral | `region.myridian_chain`, **including** detached jellyfish island |
| Yellow | `region.lantern_isles` |
| Teal/light green | `region.serpents_wake`, eastern outer chain |
| White | `region.dawnreach_isles`, northern **Option 2** expanded U-shaped archipelago |

Do not infer hex codes from the prose descriptions. Obtain exact palette values from the exported image and independently document anti-aliasing, coastline outlines and blue-water pixels.

## Native PowerShell evidence acquisition (read-only hashing)

Run on your Windows PC after saving/exporting Option 2. Replace the indicated local paths with the **actual** finalized files. This block only validates and prints; it does not copy, rename, edit or delete input assets.

```powershell
$ErrorActionPreference = 'Stop'
$save = 'C:\REPLACE\WITH\option2-final.save'
$map  = 'C:\REPLACE\WITH\option2-parent-colors.png'
foreach ($p in @($save,$map)) {
  if (-not (Test-Path -LiteralPath $p -PathType Leaf)) {
    throw "Missing final-source file: $p"
  }
  $file = Get-Item -LiteralPath $p
  $hash = Get-FileHash -LiteralPath $p -Algorithm SHA256
  [pscustomobject]@{
    Path=$file.FullName
    Bytes=$file.Length
    SHA256=$hash.Hash
    ModifiedUTC=$file.LastWriteTimeUtc.ToString('o')
  } | Format-List
}
Write-Host 'Hash identity only. No decoder, map registration or geometry approval implied.'
```

If simulator export availability is restricted to imagery, preserve the exact PNG and annotate provenance. No unofficial save decryption or destructive rewriting is required for the lore stage.

## Required comparison after acquisition

1. Preserve exact hashes and raw original bytes. Confirm original current `world_maps.json` crop metadata and unchanged original PNGs.
2. Confirm one-to-one visible correspondence between **final save state**, ownership export and owner-approved **second** northern screenshot. The earlier first arrangement is explicitly not authoritative.
3. Register matching coastline landmarks to the original paired source images, noting differences between source coordinates, export resolution, and any source aspect ratio/scale. Record transform and residuals; do **not** assume identical pixels.
4. Build a physical component inventory before allocating geographically disconnected islands. The Myridian jellyfish island is owner-approved as macro geography, but its neighboring undersea city remains a separate, unprojected sovereign entity.
5. Confirm full-pixel treatment of the Dawnreach eastern arc and southern islands. No nearest-anchor reassignment or wholesale `region.nacre_shelf` child move.
6. Inspect the Draemor–Talmyra narrow contact at higher local resolution to distinguish apparent color touching from actual walkable rock; annual navigability and tidal arches require a *separate local geography decision*.
7. Compare the new proposal against existing `region.*` IDs, feature IDs, settlement anchors and pending child polygons; issue a discrepancy ledger, not an automatic migration.

## Exit criteria

**MG-0 PASS:** A new, owner-identified Option 2 `.save` and matching exported parent-color raster have verified hashes and preserve-able provenance.  
**MG-2 PASS:** The final layout has a documented coordinate transform, credible source-image coastline correspondence, disconnected-island inventory, complete parent allocation review, and owner visual acceptance of all nine parent footprints.

**HOLD** if the save is earlier than the approved recoloring; if only an older March save is available; if the exported image is postprocessed; if a parent is assigned only because of physical proximity; or if the atlas scale is used to invent local arch dimensions.

Do not change canonical polygon ownership, original PNGs, region children, the merfolk city, routes, or runtime as part of this source-registration gate.
