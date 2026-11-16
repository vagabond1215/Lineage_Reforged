# Next execution prompt: G2-D native semantic terrain evidence and island authority

Date: 2026-11-16  
Scope: **SOURCE-ONLY, read-only unless owner explicitly authorizes a new save/export**  
Entry: [G2-C approved planning and review evidence](../design/first-world-option2-g2c-semantic-land-authority-and-island-review-plan-2026-11-16.md)  
Result to obtain: `NATIVE_SEMANTIC_SOURCE_MATCHED` or `SEMANTIC_LAND_AUTHORITY_HELD` with exact evidence.

## Copyable next prompt

> **Lineage Reborn, First World Option 2 G2-D: native land semantics.**
>
> Inspect current `origin/master`, active C1 source branch, all relevant PRs, `git status --porcelain=v1` and `git worktree list --porcelain`. Do not reset, switch, delete or clean an occupied working tree.
>
> Read:
> - `docs/design/first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md`;
> - `docs/design/first-world-option2-g2-native-physical-component-review-2026-11-16.md`;
> - `docs/design/first-world-option2-g2c-semantic-land-authority-and-island-review-plan-2026-11-16.md`;
> - `docs/design/first-world-option2-g2c-native-classifier-correspondence-2026-11-16.json`.
>
> **A. Verify sources and save identity.** Original 16K State `419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de`, Height `776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce`, Biome `c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2`. Confirm exact hashes and pixel dimensions. Never rewrite these. Independently inventory installed Fantasy Map Simulator build and the active *current* save path, size, date, SHA-256. The previous March-named save instances had **different binary sizes**; do not equate them or upload private saves into Git. Do not decode unsupported binary formats by guesswork.
>
> **B. Find independent land/water authority.** Prefer an official terrain/height/cell export, an authenticated current-save schema with demonstrably source-matched Voronoi cell membership, or game-supported map editor land classification. Check developer documentation and local game UI without patching or disassembling binaries. If the save is `NFW_SAVE_BIN` and undecodable through supported means, record that fact; stop before claiming cell-to-province mappings or terrain mask C. Rendering-based chromatic A/B tests do not qualify.
>
> **C. Reconfirm the two source review points.** A/B crosswalk localizes the **only A-component split**: Valtherion V1 `bbox [8164,1592,8223,1658)` and V2 `[8744,2391,8823,2452)`. Use the original 16K source images and any newly verified native semantic mask to determine whether they are actually detached. If source semantics cannot be certified, mark them `OWNER_REVIEW_REQUIRED` and keep physical island identity `UNKNOWN`.
>
> **D. Audit priority groups.** Use geometric pixel overlap rather than label-number equality to relate components: Kaelvar NE whole island/Shattercap, Dawnreach U-arc, northern and central detached Myridian islands, Serpent's Wake, Draemor–Talmyra, southern high-relief island, and every suspected merged/ambiguous island. Do not infer political sovereignty from geographic State colors. The nearby merfolk city is independently sovereign and underwater.
>
> **E. Geography and traversal gate.** Produce a candidate independent semantic landmask *only if supported* and a source-linkable versioned 16K→2048×1152 transform with independently chosen coastline landmarks and pixel-center convention. The natural tidal Draemor–Talmyra stone bridge, small-craft arches, monsoon closures and predator seasons remain owner design intent pending certified local geometry. No automatic ferry, open road or large-ship water route.
>
> **F. Review output.** Save machine source receipts, feature/mask confidence, provisional physical component match ledger, V1/V2 ROI, and reasons for any HELD judgment outside Git. Integrate only summarized evidence and non-mutating tests on an isolated branch; run exact-head native CI and geography lint. Do not edit `regions.json`, `world_maps.json`, `world_map_features.json`, settlement or travel network content, legacy hex, saves, source PNGs, active C1 code or runtime. Request owner decisions only on bounded features supported by the data.
>
> Success: `G2D_NATIVE_SEMANTIC_SOURCE_REVIEW_READY` with trustworthy schema and source match. Otherwise: `SEMANTIC_LAND_AUTHORITY_HELD`, with a precise blocker list rather than invented island counts. The source will determine the next safe action.

## Manual PowerShell interim path (no Codex required)

Use the existing Python 3.14 venv and an authenticated working checkout with hydrated 16K LFS assets. The new GitHub G2-C crosswalk audit (once integrated) requires only local original PNGs and outputs *outside* Git:

```powershell
$py = "$env:LOCALAPPDATA\LineageReborn\first-world-registration-venv\Scripts\python.exe"
$repo = "C:\Codex\EoL"
$src = Join-Path $repo "packages\content\base\world\map_assets\first_world_simulator_option2_2026_11_15"
$out = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_Option2_G2C_Crosswalk"
& $py "$repo\scripts\first-world-option2-g2c-crosswalk.py" --self-test
& $py "$repo\scripts\first-world-option2-g2c-crosswalk.py" --source-dir $src --output-dir $out
```

If the current checkout does not yet have the script, use a separately downloaded verified copy and do **not** switch an active branch to obtain it. The script checks exact original bytes and refuses output in a Git worktree. Full row-level results and native Valtherion ROI evidence also exist in the external owner-review `FirstWorld_Option2_G2C_CrossClassifier_Review.zip`.

For a **save-only metadata check**, use PowerShell without changing the game save:

```powershell
$saves = Join-Path $env:USERPROFILE "AppData\LocalLow\The Stranger Studio\FantasyMapSimulator\Saves"
Get-ChildItem -LiteralPath $saves -Filter *.save -File |
  Select-Object Name,Length,LastWriteTimeUtc,@{Name='SHA256';Expression={(Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash}}
```

Treat output as private audit evidence. Avoid uploading entire save files to public PRs. Current save-to-export correspondence still must be demonstrated independently.
