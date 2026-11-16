# G2-E: authoritative terrain acquisition or explicitly authored coastlines

Status: **IMPLEMENTATION PROMPT PREPARED; NATIVE LAND SEMANTICS HELD**  
Read first: [G2-D provenance](../design/first-world-option2-g2d-native-source-provenance-and-certification-plan-2026-11-16.md), [G2-C native render crosswalk](../design/first-world-option2-g2c-semantic-land-authority-and-island-review-plan-2026-11-16.md), and [First World nine-parent roadmap](../design/first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md).

## Paste-ready execution prompt

> Continue First World Option 2 G2-E source registration from current `origin/master`. Preserve every original map source PNG, simulator save, active C1 worktree, authored region/settlement/route file, legacy hex dependency and runtime. Before touching a checkout, verify `git status --porcelain=v1`, `git worktree list --porcelain`, active branch, source hashes and related pull requests. Never reset or delete occupied worktrees.
>
> **1. Establish native provenance.** Run `scripts/first-world-option2-g2d-provenance.py` with the actual installed simulator Saves location, original 16K+4K source paths, previous `source_inventory.json` and Steam app `3035500` manifest. Keep the detailed save receipt locally and use only the redacted summary in public reports. Earlier differently sized same-named Saves are separate byte identities, not proof of corruption or source correspondence.
>
> **2. Inspect the actual Fantasy Map Simulator, not Azgaar FMG.** Record running build/version and current loaded map identity if exposed. Verify whether the installed game's supported UI/documentation offers an export with *native land/water cell classification or terrain geometry*, including schema and coordinates. Do not extract undocumented binary save fields or try unknown decryption. If only colorized Height, Biome and State PNGs exist, those are rendered terrain witnesses, **not** independent source classification.
>
> **3. Prove pairing before geometry.** A legitimate independent semantic layer must be demonstrably from the Option 2 source map underlying the archived November 15 16K triad, rather than a March-named save, different map version or unrelated Workshop map. Require traceable source identity, coordinate conversion and held-out coast measurements.
>
> **4. If a true native layer exists:** build classifier C with source land/water tags and source-matched geometry. Compare C against the existing G2 A/B crosswalk, using full 16K pixel geometry, four/eight-neighbor connectivity, inlets, river strokes, holes and erosion sensitivity. First inspect Valtherion V1 `[8164,1592,8223,1658)` and V2 `[8744,2391,8823,2452)`, the Dawnreach white U arc, detached Myridian islands and nearby independent underwater merfolk city, Kaelvar NE island/Shattercap, Serpent's Wake and the Draemor–Talmyra natural tidal stone neck. Do not create a land route or deep-ship channel from visual connectedness.
>
> **5. If no native semantic export is supported:** return `SEMANTIC_LAND_AUTHORITY_HELD` with exact blocker evidence. Prepare a bounded owner decision to certify an **owner-authored derived** coastline source from the verified PNGs, labeled `OWNER_AUTHORED_DERIVED` and never represented as recovered simulator Voronoi topology. Show V1/V2 and whole-island exceptions for approval before permanent island IDs.
>
> **6. Review exit:** produce a machine-readable source register, private/redacted provenance separation, source-matched terrain/classifier-C tests or a definitive hold; a new evidence-only PR with exact-head CI if warranted. Do not modify `regions.json`, `world_maps.json`, `world_map_features.json`, biome/ecology/settlement/travel JSON, saves, runtime, source media or active C1 branch. Changes to canonical geographical boundaries need a distinct owner approval.
>
> Report exact hashes, build/source facts, what was actually verified, unresolved risks and the next safe owner action. Don't claim a source save/landmask you cannot substantiate.

## Manual PowerShell path now, without Codex

Extract the standalone G2-D ZIP to `C:\Users\vagab\OneDrive\Desktop\FirstWorld_G2D_Kit`, then run:

```powershell
$py = "$env:LOCALAPPDATA\LineageReborn\first-world-registration-venv\Scripts\python.exe"
$kit = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_G2D_Kit"
$saves = Join-Path $env:USERPROFILE "AppData\LocalLow\The Stranger Studio\FantasyMapSimulator\Saves"
$prior = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_Option2_Registration_Audit\source_inventory.json"
$manifest = "C:\Program Files (x86)\Steam\steamapps\appmanifest_3035500.acf"
$out = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_Option2_G2D_Provenance"
& $py "$kit\first_world_option2_g2d_provenance.py" --self-test
& $py "$kit\first_world_option2_g2d_provenance.py" --repo-root "C:\Codex\EoL" --save-dir $saves --prior-receipt $prior --steam-manifest $manifest --output-dir $out
```

Use the actual Steam manifest if the game is on another library; the script does not search the machine. Upload **`g2d_shareable_summary_*.json` only**. Keep `g2d_private_provenance_*.json` and all original Saves private. A good report can legitimately end at `SEMANTIC_LAND_AUTHORITY_HELD`; that is more useful than manufacturing a cell ID.
