# First World Option 2 G2-D: native source provenance and certification plan

Date: 2026-11-16  
**Status: G2D_PROVENANCE_TOOL_IMPLEMENTED; SEMANTIC_LAND_AUTHORITY_HELD**  
Predecessors: [G2-C rendered component crosswalk](first-world-option2-g2c-semantic-land-authority-and-island-review-plan-2026-11-16.md) · [Nine-parent world plan](first-world-option2-world-plan-and-geometry-roadmap-2026-11-16.md) · [G2-D local provenance tool](../../scripts/first-world-option2-g2d-provenance.py) · [G2-E implementation prompt](../dev/first-world-option2-g2e-authoritative-terrain-acquisition-prompt-2026-11-16.md).

## Scope and evidence

The first two original-16K land masks are **both rendered-color masks**; their pixel-overlap is not independent native simulator terrain authority. G2-C localized their one substantial topology disagreement to Valtherion coastal ROIs V1 `[8164,1592,8223,1658)` and V2 `[8744,2391,8823,2452)`. They remain **source-image review candidates, not approved physical islands**. The Draemor–Talmyra source continuity is rendered evidence, not permission for a bridge, road, canal, ferry or shipping route.

The private example `20260315141309.save` inspected previously has a literal first-12-byte `NFW_SAVE_BIN` tag and a little-endian integer `1` at offset 12. The meaning of that field has **not** been validated with a supported schema. A separate earlier Windows audit identified a same-named file with a different byte length (**1,235,224 versus 1,182,168**). Neither same-name identity nor a link to the November Option 2 exports is established. No binary decryption/decompression, invented offset parsing or file mutation is authorized.

**Product distinction:** This world was made in **Fantasy Map Simulator** by The Stranger Studio, Steam app **3035500**. Do not apply Azgaar Fantasy Map Generator's unrelated data/export documentation. The Fantasy Map Simulator developer's Steam announcements describe improvements to save selection by absolute paths, atomic writes and backups: https://steamcommunity.com/app/3035500/allnews/ . These release notes do **not** establish the current game's private binary-save schema or a semantic landmask export.

## Phase D1: implement a private, read-only source receipt

The repository's `scripts/first-world-option2-g2d-provenance.py` runs with **Python 3 standard library only**, using explicitly supplied paths. It:

1. Checks exact SHA-256 and byte lengths for the original **16,384×9,421** State/Height/Biome PNGs and old **4,096×2,355** Biome/Elevation PNGs when `--repo-root` is provided.
2. Inventories `*.save` files directly within a supplied `--save-dir` (nonrecursive): name, byte length, UTC mtime and SHA-256. Reads **at most the first 24 bytes** for header fingerprinting; does not decode or alter the payload.
3. Compares names, lengths and hashes against `--prior-receipt source_inventory.json`. A same-name difference becomes a hold; a same-name exact match is still **not evidence that the save generated the PNGs**.
4. Records an optional Steam `appmanifest_3035500.acf` build ID and executable metadata for an explicitly identified `FantasyMapSimulator.exe`. A disk manifest is **not proof of the executable actually running**.
5. Optionally hashes separately supplied `--semantic-export` candidate files without asserting their native schema or map identity. A `--user-declared-active-save` name is recorded as owner assertion, not automatically proven.
6. Writes two uniquely named outputs **outside Git, Saves and the game tree**: detailed private `g2d_private_provenance_*.json`, and **redacted shareable** `g2d_shareable_summary_*.json` with no private save names, hashes or full machine paths. Never overwrites prior reports.

Both outputs maintain `SEMANTIC_LAND_AUTHORITY_HELD`, `sourceToExportRelation:UNVERIFIED`, `nativeSemanticLandmask:NOT_RECOVERED` and `canonicalWritable:false`. All five exact image identities can pass without falsely certifying a save or source mesh.

### Manual Windows execution

No Codex credits are required. A separate source-only kit includes this workflow and can run from a Desktop folder, without switching the occupied repository branch. Using the repository script once it is in a clean current checkout:

```powershell
$py = "$env:LOCALAPPDATA\LineageReborn\first-world-registration-venv\Scripts\python.exe"
$repo = "C:\Codex\EoL"
$saves = Join-Path $env:USERPROFILE "AppData\LocalLow\The Stranger Studio\FantasyMapSimulator\Saves"
$prior = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_Option2_Registration_Audit\source_inventory.json"
$manifest = "C:\Program Files (x86)\Steam\steamapps\appmanifest_3035500.acf"
$out = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_Option2_G2D_Provenance"
& $py "$repo\scripts\first-world-option2-g2d-provenance.py" --self-test
& $py "$repo\scripts\first-world-option2-g2d-provenance.py" --repo-root $repo --save-dir $saves --prior-receipt $prior --steam-manifest $manifest --output-dir $out
```

If Steam uses another library, supply that library's actual app manifest instead; the script must not guess. The user's current checkout may be on a historical branch; **do not reset it just to obtain this tool**. Use the standalone kit outside the repository in that case.

**Share only `g2d_shareable_summary_*.json` for collaborative review.** Keep private provenance and all binary save files local.

## Phase D2: inspect actual simulator source identity

Using the installed game without editing or saving any map, inspect the version/build display, loaded map name/loaded save information *if the UI exposes it*, and any officially supported native terrain/cell export. Preserve what the game actually shows; do not infer the active save from its filename or modification date.

An acceptable **classifier C** requires a verifiably source-matched native land/water field or documented terrain-cell graph, coordinate layout, current-build schema and reproducible geometric checks. Another threshold on State/Height/Biome rendered colors does **not** meet this standard. Do not reverse-engineer unknown encrypted/compressed binary data by guessing offsets or treating a header number as proof of a decoder.

## Phase D3: certification choices

**If independent native terrain is found:** establish an exact link between that data, the loaded simulator map and the November 2026 Option 2 PNG triad. Validate native land/water semantics, actual cell/province/district lineage, image-coordinate transform and island topology. Compare against V1/V2 Valtherion, Dawnreach white U arc, red Myridian, Kaelvar northeastern island, Serpent's Wake, and the Draemor–Talmyra neck. Review whole islands and no-man's-land edges before publishing stable IDs.

**If no supported terrain export exists:** retain `SEMANTIC_LAND_AUTHORITY_HELD`. Offer a separate **owner-authored derived cartography** decision: explicitly approve manual coastline boundaries from unchanged source PNGs as `OWNER_AUTHORED_DERIVED`, **not** recovered native simulator Voronoi geometry. Owner-reviewed source polygons may later proceed on that separate basis; no automatic authority promotion occurs here.

## Security, compatibility and exit

The historical save sample and new local receipts are not public GitHub artifacts. No original 16K or legacy 4K image, active C1 branch, canonical regions, island registry, ecology, settlement, political authority, navigation, save file, legacy hex or runtime changes occur. Exact-head tests must pass on Windows and hydrated original Git LFS images.

**G2-D exit:** reproducible local save/build provenance instrumentation and an explicit unknown source-to-save link, not certified geographic geometry. The next gate is the [G2-E native semantic source or owner-derived cartography decision](../dev/first-world-option2-g2e-authoritative-terrain-acquisition-prompt-2026-11-16.md).
