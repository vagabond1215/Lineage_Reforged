# First World map work: Option 2 consolidation and branch disposition review

Date: 2026-11-15 (current connector audit after 16K ZIP arrival)  
Status: **READ-ONLY HEAD / DIFF REVIEW; PRESERVE ACTIVE UNIQUE EVIDENCE; NO BULK MERGE, DELETE OR MASK PROMOTION**  
Related: [owner macro-lore v1](first-world-macro-geography-lore-revision-v1-2026-11-15.md); [16K source archive manifest](first-world-option2-16k-export-triad-manifest-2026-11-15.json).

## 1. Controlling owner decisions

Use the new Fantasy Map Simulator **Option 2** colored macro-parent layout: Dawnreach polar U-shaped northern islands; red Myridian island chain including detached jellyfish-shaped central island; Lantern rival warm-water trade sphere; remote eastern Serpent's Wake confederation; natural normally passable tidal-rock isthmus jointly managed by Draemor and Talmyra; independent sovereign neighboring merfolk underwater city.

The nine color groups are **geographic parents, not nine unified sovereign states**. Child-region identities and borders remain explicitly deferred. Do not conflate simulator country color, province, Voronoi cell, district, Lineage geographic parent, local ecological overlay or future political sovereignty.

## 2. Newly supplied source evidence and exact limits

On this date the owner uploaded ZIP `WorldMap_20261115_201735_State.zip`, SHA-256 `4e0563a71fa225c5433e69c55131275f3fa49c831fbd3091c1eda3dd2575c87d`. Its CRC passed; it contains:
- **State**: 16384×9421, 14,269,354 bytes, SHA-256 `419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de`.
- **Height**: 16384×9421, 18,484,528 bytes, SHA-256 `776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce`.
- **Biome**: 16384×9421, 17,092,660 bytes, SHA-256 `c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2`.

These are the **actual uploaded original 16K-class PNG bytes**, not the prior 2048×1177 conversation preview images. Exact Windows source-path and live-save linkage have not been proven. No new full-resolution source PNG is committed by this documentation-only review; connector-only text actions cannot transfer these binary attachments into GitHub.

Recommended archival source path, pending local Git + LFS / size-policy review:
`packages/content/base/world/map_assets/first_world_simulator_option2_2026_11_15/`.

The existing **original** `First World Biome.png` and `First World Elevation.png` remain independent provenance; do not overwrite or delete. They supported prior source registries and still have consumers. The new export contains a border and its full image cannot be mapped pixel-for-pixel to the older 2048×1152 canonical reference without an explicit alignment transform.

## 3. Repository inventory and safe disposition

Metadata and per-file changed-path inventory inspected for PRs #77–#87, #89, and the later C1-K through C1-O branches. Snapshot master `a3dd0057727c7b74743a30eb403a05996ed751d1`; exact branch HEADs and divergence require revalidation immediately before integration.

| Lane | Exact review scope | Disposition | Keep / alter | Merge status and next trigger |
| --- | --- | --- | --- | --- |
| [#77](https://github.com/vagabond1215/Lineage_Reforged/pull/77) | Old offshore-square exclusions, map review UI, audit code **and a change to `world_map_features.json`** | `HOLD_NAMED_CONSUMER` | Keep audit code, exclusions and coastline witnesses for comparison; treat altered old source-footprint ownership as **unreconciled** | **Do not merge as unit** until 16K export versus original source masks, 42 exclusions, and 88 settlement anchors are revalidated |
| [#78](https://github.com/vagabond1215/Lineage_Reforged/pull/78) | Stacked mixed-landmass conflict reviewer | `HOLD_NAMED_CONSUMER` | Potentially reusable UI and conflict reports independent of the chosen parent polygons | Hold until tool can register 16K source and clearly distinguish old/proposed parents |
| [#79](https://github.com/vagabond1215/Lineage_Reforged/pull/79) | Stacked original paired-raster readers, terrain connectivity, source QA, masked Kaelvar pilot | `CANDIDATE_INTEGRATION` **for reusable source tools only** | Preserve original SHA-checked physical-evidence code and tests; **do not** promote old Kaelvar, Windward or Shattercap candidate ownership claims | Re-author a minimal tools/test-only subset atop current master; native tests and new-source comparison needed |
| [#80](https://github.com/vagabond1215/Lineage_Reforged/pull/80) | Stacked landmass-first R0–R6 contract and audit ledger | `HOLD_NAMED_CONSUMER` | Durable physical-landmass-first concepts; child ownership and proposal ledger still provisional | Reconcile contract with Option 2 source before any integration |
| [#81](https://github.com/vagabond1215/Lineage_Reforged/pull/81) | Old Layout A Kaelvar R3 hand-sketched source windows | `SUPERSEDED_PRESERVE_EVIDENCE` **as candidate geometry**, retain source/branch | Preserve exact candidate polygons, tests, held-island audit and authoring history as comparison evidence; the old sketch is **not** current region-boundary authority | No as-unit merge. Do not close/delete branch until unique evidence is ported/referenced and owner confirms region-lane supersession |
| [#82–#87](https://github.com/vagabond1215/Lineage_Reforged/pulls?q=is%3Apr+is%3Aopen+C1) | C1 registry and coast/ink evidence stages; each stacked on predecessor | `HOLD_NAMED_CONSUMER` | Reusable coordinate-geometry infrastructure, source-vector coastline diagnostics, corrected water/ink tests; older C1 region candidates not automatically accepted | No individual blind merges: the C1 source branch has continued into newer C1 work, so integrate by **reviewed semantic subset** only after owner-native test |
| Later C1-K to C1-O | No individual matching PR in #77–#89 list, but more stacked code/docs exist on `connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14` | `ACTIVE_WORK` / protected from cleanup while consumed | Verified remote HEAD `e4a9f20f769e94e7493de1e955f8c5a8697203a8`. Current compare showed **202 ahead / 2 behind** master, 151 changed paths, including newer C1-P through C1-AD design/evidence and 28 test paths; **no canonical world-content changed paths** in the compared diff | Do not move/delete this branch, retarget its ancestry, rewrite it or invent an equivalently certified merge. C1-AD evidence attests a narrower native preflight, not an approved world import |
| [#89](https://github.com/vagabond1215/Lineage_Reforged/pull/89) | Nine owner-approved macro parent lore descriptions, explicit source holds, read-only uploaded export audits and hashes | `CANDIDATE_INTEGRATION` **documentation only** | Can preserve on master as design/evidence context provided no data claims are silently treated as loaded canonical polygons | Review and safely integrate **docs only**; canonical `regions.json` update remains held |
| [#76](https://github.com/vagabond1215/Lineage_Reforged/pull/76) | Settlement distribution/policy proposal | `HOLD_NAMED_CONSUMER` | Preserve independent population model; not a source for replacing new geospatial map | No integration as a shortcut around settlement/geography acceptance |

**Not inspected/modified**: unrelated native-v3/launcher/product PRs, their branches and worktrees; remote branch deletion is not supported by this review. No branch is proven `ABANDON_SAFE_TO_DELETE` by mere age.

## 4. Supersession ledger: what no longer fits

| Old claim, artifact or shortcut | New disposition |
| --- | --- |
| Dawnreach is an `eastern_ocean_isles` system | **Superseded narrative** by approved polar northern U-shaped Option 2; keep historical strings only for diff/migration |
| Serpent's Wake is a `southern_island_arc` chiefly composed of pirates | **Superseded narrative** by remote eastern confederation, maritime trade, tourism and covert piracy |
| Myridian has only a narrow northern cluster | **Incomplete**: detached jellyfish surface island is Myridian geographic parent |
| Myridian automatically controls underwater merfolk city | **Rejected**: independently sovereign merfolk civilization; no seabed sovereignty inference |
| Draemor and Talmyra are disconnected by ordinary deep navigable ocean | **Superseded** by a normal overland natural tidal stone isthmus with tidal water exchange, joint broad management and seasonal storm closures; requires local topological proof before runtime |
| Nine ownership colors equal nine political states | **Rejected**: colors describe geographic parents, internal political regions remain TBD |
| Old 2K chat-uploaded triad is the highest-quality source | **Superseded as primary raster evidence** by hashed 16K PNGs; old downscaled copies may still serve previews |
| Old saved original-height/biome raster geometry is automatically invalid | **Rejected blanket deletion**: original source is independently valuable and retained until source-transform validation |
| Kaelvar Layout A R3 preview may be published as an accepted region boundary | **Not approved**. Preserve historical candidate; compare to newer C1 district and 16K source evidence first |
| Deducing a full region from closest source pixel, province, simulator state, rough similarity or synthetic Voronoi fixtures | **Not authorized**. Maintain coordinate-first, physical-landmass-first, provenance and disjoint-component gates |
| 16K export alone proves precise natural isthmus arches or arctic biome coding | **Not authorized**. Simulated visual scale is too coarse for local topology; biome color legend and latitude projection remain unverified |

## 5. Safe integration order and non-goals

### Stage 0: preserve and register raw 16K source (**LOCAL CODEX ACTION**)

1. Confirm exact three Windows original paths and byte hashes against this manifest. Preserve the 43.7 MB ZIP separately; never edit it in place.
2. Check `git lfs version` and GitHub LFS support/quotas. Prefer **directory-scoped LFS tracking** for the three new PNGs to prevent repeated ~50 MB source revisions bloating regular Git history; do not alter tracking for historical `First World Biome.png` or `First World Elevation.png`.
3. If LFS is not enabled, **report the cost and obtain the local owner's explicit choice** to store ~47.5 MiB binary directly, rather than silently shipping large raw images.
4. Stage only those exact three files, the scoped `.gitattributes` (if LFS) and their manifest on an isolated branch based on current `master`, unless existing task branch can be used without affecting other active worktrees. Push a draft PR, verify remote blobs/LFS pointer objects and hashes, **do not merge** before provenance review.
5. Verify triad consistency and save/export identity; register against original source by landmarks. Preserve the previous save `20260315141309.save` independently; its filename is not proof of current payload identity.

### Stage 1: integrate owner-approved macro **documentation only**

PR #89 may be merged as documentation and audit evidence once reviewed and metadata reflect the now-received 16K ZIP; doing so would **not** accept any canonical polygon, ecology assignment, legal state, local arch geometry or route.

### Stage 2: rebase/re-author reusable source tools

Choose a narrow tested subset from #77–#80 and latest C1 branch: source crop/transform readers, original PNG hash checks, disconnected component audit, mixed-source coastal uncertainty, strict Voronoi provenance/adjacency checks, and review SVG tooling. Perform source-aware validation and run native unit suite. Do not copy obsolete coordinates or link transit solely on visual adjacency.

### Stage 3: replace stale parent-level narrative

Only after owner source acceptance, update nine parent `summary` and optionally `positionLabel` values with a schema-verified diff. Defer child region splitting, marine/merfolk polities, world map features, settlement moves and path topology.

### Stage 4: archive stale branches only after source-equivalent evidence

For any eventual `SUPERSEDED_PRESERVE_EVIDENCE` or `MERGED_RETIRE`, inspect exact unique commit/file diffs, promote remaining evidence and update the official branch-disposition register. Then close matching PR and delete exact remote/local branch with ordinary fail-closed commands only when there is no active consumer or worktree. No wildcard or orphaned-worktree deletion.

## 6. Immediate acceptance witness

This document deliberately does **not** claim the PNGs have been uploaded into GitHub, old branches have been merged/deleted, real Voronoi cells decoded, or new geometry approved. It is a safe consolidation gate and explicit record of the work worth retaining, versus the unapproved shapes and stale prose that must not be carried into new canon.
