# First World Option 2 G2-E4a: reproducible regional presentation-preview receipt

Date: 2026-11-17  
Status: **NINE_REGIONAL_RESAMPLED_PREVIEWS_PRODUCED; NOT_FULL_WORLD; NATIVE_GEOMETRY_NOT_VALIDATED; CANONICAL_PUBLICATION_HELD**  
Inspected source head: `master` `d9ff20404831c23729e8290bd3274247af3fe42d`. This is a **connector-supported external evidence receipt**, not a commit of the generated raster files or an accepted G2-E4 native-source geometry implementation.

Dependencies: [G2-E4 representative atlas/local-area scope](first-world-option2-g2e4-representative-atlas-local-map-square-boundary-2026-11-16.md), [G2-E3 approved nine source directions](first-world-option2-g2e3-owner-direction-record-2026-11-16.md), [source G2-E1 Valtherion ledger](first-world-option2-g2e1-valtherion-owner-review-2026-11-16.json), [source G2-E2 seven-site ledger](first-world-option2-g2e2-seven-site-source-review-2026-11-16.json).

## Actual bounded presentation output

A local read-only Python/Pillow/OpenCV pass used nine **resized CI-generated source-review panels**, taken byte-for-byte from:

- [G2-E1 original-source CI](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43981564104) with downloaded ZIP SHA-256 `d58df8229e341f848f195a507041e68bc761df8f71c414ebf863b848dbe1b3d3`.
- [G2-E2 original-source CI](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/44006664848) with downloaded ZIP SHA-256 `18f28ec7477158fd5ee0640f55fd8730ed9294778a92e729dcbec677ad0a70ec`.

Both CI ledgers carry matching original 16384×9421 State/Height/Biome source SHA-256s. **Those original 16K image bytes were not hydrated or checked in this local preview pass.** Derived land/water masks are still from rendered-color interpretations, not independent semantic topology.

Two PNG alternatives were generated outside the repository:

| External artifact | SHA-256 | Purpose |
| --- | --- | --- |
| `shore_detail.png` | `ddf8009131c5847a8da8b274ecf4c6141c851adea6cddf3b2a8ed8380691bbf6` | G2-E1/E2 review panel B silhouette with source State color context, detailed shoreline |
| `atlas_clarity.png` | `6db5c0a9ac097f5a96f1de236a03ee6d4e2c26f4954f9e7c498b4e55317d2931` | Same nine cropped panel silhouettes, presentation-only 5×5 median smoothing, preserving image-panel connectivity and hole counts |
| `FirstWorld_G2E4a_Regional_Preview_Packet.zip` | `e3dc12877d5335cc6b9cc40afe970636e63d61c42f55354ac41f3e99c71d3619` | Externally delivered, CRC-verified 17-entry package including both images, JSON metrics, two original CI review artifact ZIPs, nine extracted panels, standalone comparison HTML, script and README |

Package name/hash is an evidence locator, **not** a Git-tracked artifact or stable hosted URL. Keep the external package with the owner if later runs need reproduction; GitHub Actions artifacts can expire.

### Validation and precise limits

- All nine extracted rendered panels match their CI ZIP members byte-for-byte.
- At **resampled display-panel resolution** (272×237 or 300×300 pixels per crop), summed across the *nine separate crops*: 66 eight-neighbor land-component **instances**, and 24 enclosed blue-hole **instances**, before and after smoothing. These are *not* globally deduplicated whole-island or source-native topology counts; the review windows can overlap and crop land.
- Generalization changed 1,322 **display-panel** mask pixels and rolled back any per-component edit that would violate the specified component/hole/area gates; zero full-window fallbacks occurred. Five of nine crops touched a panel border. Crop edges are **not coastline**.
- Both outputs are 1600×1760 PNGs. A self-contained HTML toggles between treatments. Source-original assets and repository canonical world data were not modified.
- No SHA-256 of the original 16K PNG bytes was recomputed here; CI provenance and local output generation are distinct validation authorities.
- No polygon closure/winding/self-intersection test, whole-island boundary certification, 16K→2048 registration, source Voronoi, complete world overview vectorization, terrain movement, climate, V1 tide level, route graph, resource spawn, child regions, political sovereignty, save migration, or runtime build/test was performed.

## Next executable G2-E4a work

**One bounded original-LFS-based world-atlas source pass** remains necessary: run from an authenticated checkout/CI with hydrated 16K State/Height/Biome bytes, verify hashes and frame, generate original-native whole-feature candidates with A/B uncertainty and all nine G2-E3 owner directions, test significant island/strait/neck exceptions and holes/closure/reciprocal seams, and make two atlas-scale global presentations with simplification metrics and explicitly provisional registration. Owner review is needed only for material conflicts with prior decisions. Separate E4/G3 publication gates still apply.

**Important owner direction:** World-map geography can be representative at macro zoom. Fine footstep/tidepool/harbor detail may be authored later as independent local map squares. This does not authorize topology-changing simplification, political assignments, tide routes or ecological placement. V1 remains an ordinary-tide separate island with exceptionally-low-tide foot **intent only**; carts/wagons/caravans are excluded. V2 remains detached. Active C1 drafts and all existing canonical geography remain held.

### Branch/validation disposition

This receipt is a unique-path, documentation-only connector pass to `master`. No new branch, PR, worktree or image asset was committed. The active C1 chain and other held PRs retain their existing dispositions. Exact-head coordinate-first guard completion, if triggered, must be checked separately; it cannot prove native contour validity.
