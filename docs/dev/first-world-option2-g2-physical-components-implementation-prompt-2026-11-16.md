# Executable next-pass prompt: G2 First World physical islands and the tidal neck

> Copy this prompt into Codex after credits refresh, or run the bounded PowerShell/Python source-verification prework manually in the meantime. Do not allow any tool to rewrite canonical world geometry or original map bytes.

## PROMPT START

Repository: `C:\Codex\EoL` (Windows), GitHub `vagabond1215/Lineage_Reforged`.  
Goal: **First World Option 2 G2 physically connected landmass and island review**, source-only/noncanonical.  
Latest geographic planning authority: `docs/design/first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md`.  
Latest source verification: `docs/design/first-world-option2-legacy-16k-preview-registration-review-2026-11-16.md`.  
Fixed-window review tool: `scripts/first-world-option2-fixed-window-audit.py`; committed summary `docs/design/first-world-option2-fixed-window-coast-audit-2026-11-16.json`.

**First, inventory without mutation.** Read `git status --porcelain=v1`, `git worktree list --porcelain`, `git branch --show-current`, `origin/master`, active C1 head and PRs. Preserve the current branch/worktrees and original simulator Saves. Use a clean disposable worktree if required; never reset an active checkout or clean arbitrary files. Do not delete active worktrees, old C1 source branches or LFS objects.

**Verify source identities and registration contract.** The three 16K source PNGs are in scoped Git LFS at `packages/content/base/world/map_assets/first_world_simulator_option2_2026_11_15/`:
- State SHA-256 `419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de`
- Height SHA-256 `776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce`
- Biome SHA-256 `c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2`
- Original 4096×2355 Biome SHA-256 `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12`
- Original 4096×2355 Elevation SHA-256 `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d`

The old source crop is `System.Drawing.Rectangle(x=60,y=60,width=3976,height=2235)`, scaled to the 2048×1152 reference. The direct 16K render-crop probe used `[240,240,16144,9176)`, **not yet approved as identical geographic authority**. Do not use the near-identity SIFT preview mapping as a verified real-landmark transform. Rerun the source-only 18-window audit if needed against the owner's unchanged ZIP. The observed 18/18 Biome and Height windows passing 2-pixel visual coast tolerance are prior **raster-review evidence**, not sovereign ownership or a physical topology proof.

**G2-A: dual classifier.** On original full-resolution sources, preserve an explicit mask for `R==64, B==255` rendered ocean as *classifier A*. Design and test a meaningfully independent coast/terrain classifier B from the Biome and Height layers. Record color thresholds, interpolation artifacts, shallow water, coastline ink, river pixels and false bridges. Do not silently change the definition of physical land to force preferred island counts. Build sensitivity plots for 4-connectivity, 8-connectivity, and 1/2/3-pixel erosion/opening. The prior State classifier yielded 169 four-connected /161 eight-connected rendered components over the specified crop. Those are **not** the source's native island count.

**G2-B: bounded physical-component inventory.** For every candidate component, log immutable source hash, classifier, connectivity, ephemeral pixel component index, area in native pixels, bounding box, representative seed, perimeter proxy and contact/cross-parent status. Keep geometry references or contours external until review. Do not assign production island IDs from labels that may change with a threshold. Export `land-component-ledger.json` and an image atlas/ROI list outside the repo initially. Flag tiny detached pieces separately; never auto-delete them as noise or auto-assign them to neighboring parents.

**G2-C: owner-review priority queue.** Explicitly examine all nine geographic parent groups, emphasizing the Option 2 white northern Dawnreach U-arc, adjacent red Myridian island clusters, detached Myridian jellyfish-shaped center island, large Kaelvar NE island and held Shattercap/Coast 40 features, Serpent's Wake teal chain, Valtherion mainland and offshore islands, southern high-relief radial-river/possible volcano island, and every mixed-color land component. Geography is not political sovereignty; a neighboring merfolk undersea city remains independently sovereign.

**G2-D: Draemor–Talmyra throat.** Ground and tabulate the exact native-resolution contact in all three layers. Check connectedness under both classes and 4/8 neighbors, erode 1/2/3 pixels, and document ambiguous water strokes, pinch points and measured corridor width only where robust. Owner lore: **natural tidal stone isthmus**, generally surface-land-traversable, small craft may pass under stone arches, major vessels cannot, joint management, monsoon storm closure and predator-breeding seasonal constraints. Do not create a public gameplay route, canal, large-ship shortcut, treaty, border patrol or exact navigable arch from raster adjacency alone.

**G2-E: Lineage region proposals, not publication.** Draft only source-linked candidate internal geographic region seams if independent geography supports them; adjacent regions should touch cleanly except intentionally named buffer zones. Fit variable-size candidate regions to watersheds, mountains, coasts, land ecology and certified simulator province/district lines where available. Never promote pixels, synthetic Voronoi cells, arbitrary equal-size partitions or source colors into named canonical regions.

**Quality bar and reporting.** Use focused native scripts and tests on the exact candidate commit. Report original file hashes, `git status`, component classification sensitivity table, coastline/river uncertainty, reviewer flags, dry-run coverage and explicit `REVIEW_READY` versus `HELD` decisions. Start a separate evidence-only PR from latest master if all reproducibility and content freeze gates pass. Avoid modifying `regions.json`, `world_maps.json`, `world_map_features.json`, ecology, settlements, routes, legacy hex, runtime, save files, source PNGs or the active C1 source branch. Do not merge draft unreviewed geometry. Ask the owner only for specific unresolved island/neck decisions after presenting a source-grounded overlay and review ledger.

Success: **`G2_COMPONENT_INVENTORY_REVIEW_READY`** with both classifiers and sensitivity recorded, even if geographic island assignments and true source mesh remain held. Failure/uncertainty: **`G2_AMBIGUITY_HELD`** with concrete pixels, classifiers and risks, not guessed source terrain.

## PROMPT END

## No-Codex manual prework now

In a dedicated Python venv containing NumPy/OpenCV, after fetching current master and confirming original ZIP identity:

```powershell
$venv = "$env:LOCALAPPDATA\LineageReborn\first-world-registration-venv"
$repo = "C:\Codex\EoL"
$archive = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_Option2_Registration_Audit.zip"
$output = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_Option2_Geography_Review"
& "$venv\Scripts\python.exe" "$repo\scripts\first-world-option2-fixed-window-audit.py" --self-test
& "$venv\Scripts\python.exe" "$repo\scripts\first-world-option2-fixed-window-audit.py" --archive $archive --output-dir $output
```

If the working checkout is on an old branch that does not yet contain this script, **do not switch it blindly**. Download the script from the reviewed PR, put it in the existing external audit-kit folder, and pass that script's absolute path instead of `$repo\scripts\...`. All generated images and reports must remain **outside Git**.

Run the old 16K PNG hash audit separately if desired; do not use a preview-window match as proof of a native-resolution corridor or recovered Voronoi membership.
