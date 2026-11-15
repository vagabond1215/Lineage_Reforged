# Kaelvar C1-AD: Voronoi-provenance geography preflight and C1-AE handoff

Date: 2026-11-15  
Status: **SOURCE-VERIFIED STRUCTURAL PREWORK; NO MATCHED SIMULATOR CELL GRAPH OR NEW REGIONAL OWNERSHIP**  
Existing branch: `connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14`  
Prior work: [C1-AC owner screenshot district review](kaelvar-c1ac-owner-simulator-district-and-relative-relief-review-2026-11-15.md)  
Read-only ledger: [C1-AD strict Voronoi provenance and topology preflight](kaelvar-c1ad-voronoi-provenance-and-geographic-region-preflight-2026-11-15.json)  
Review overlay: [C1-AC screenshot-derived district ink in the original authoring frame](assets/kaelvar-c1ac-owner-simulator-district-ink-reference-only-2026-11-15.svg)

## Newly established simulator mechanics

The owner confirmed that the First World map is built on a **Voronoi diagram**. The simulator developer's published January 16, 2025 editor instructions corroborate that **a province is a grouping of multiple adjacent Voronoi cells**, rather than a single Voronoi polygon. The editing sequence is heightmap → biome based on heightmap → provinces based on biome → countries from provinces.

- Developer January 2025 instructions: https://steamdb.info/patchnotes/17025175/
- Simulator April 20, 2026 district editor release: https://steamcommunity.com/app/3035500/announcements/

The April notes establish an additional hierarchy: a **district groups multiple provinces**, can cross state boundaries, and can be manually painted by assigning provinces to districts. The user's final screenshot explicitly uses **Map Editor → Edit District** and shows five region-name swatches. It therefore expresses a deliberate *district-layer grouping*, not necessarily the underlying raw Voronoi-cell edges, province sites, province cell counts or a complete all-world set of districts.

**Keep these four concepts separate:**

1. **Voronoi cell:** A tessellation polygon with potential geometric neighbors. Its site, ID and exact vertices are presently **unrecovered**.
2. **Simulator province:** A collection of adjacent cells for simulator mechanics. It is neither a Kaelvar geographic region nor a necessarily stable location ID for Lineage.
3. **Simulator district:** A province grouping painted with visible owner region names. The screenshot provides approximate registered district boundary strokes, **not** polygon ownership data or source-equivalent province memberships.
4. **Lineage geographic region:** A physical/narrative environment across finalized terrain, independent of foreign simulator political administration. Its eventual primary region ID must resolve deterministically for every finalized land location. Optional environmental influences may cross that exact invisible line.

Do not equate every colored polygonal patch in the biome or grayscale relief images with a separately recorded height, a unique province, a province border or a regional border. The source can be Voronoi-based while the screenshot also includes rendering, brushes, elevation interpolation, rivers, land masks and distinct province/district layers.

## Critical version and save-format caution

The simulator's August 2026 announcement described staged loading, decryption, decompression and conversion of legacy saves to a new binary save format. The developer has **proposed** a possible future replacement of the Voronoi-backed representation; this was described as an uncertain plan, **not proof that the owner map or its current save changed representation**.

- Official release notes: https://steamcommunity.com/app/3035500/announcements/
- Future proposal reference: https://steamcommunity.com/app/3035500/allnews/

Therefore: **do not assume `.save` is text, JSON, a raw Voronoi mesh, or compatible with a third-party parser**. Determine the exact saved-game version/format before any extraction, and never write to or convert the owner's save during reconnaissance. An opaque binary is an acceptable checkpoint; the screenshot and source-registered geometry remain useful while save decoding is unresolved.

## What is now in Git

The owner submitted eleven original Fantasy Map Simulator screenshots, including full-world and Kaelvar biome and grayscale relief views plus an editor proposal. C1-AC registered those shots to the original hashed First World source. A compact 17 KB **noncanonical** five-color screenshot-ink reference SVG is already committed in the original 2048×1152 authoring reference coordinates. Its SHA256 is `6a0aaedfb4a4551dcbff6103bb5ca8405d1d923c0496577956af05a0657d2a8d`.

C1-AD adds a frozen source and mechanics ledger plus a read-only native preflight. Its synthetic-only topology helper tests future extraction assumptions without claiming that actual simulator cells have been imported.

It tests, using **explicitly synthetic** cell fixtures:

- Unique cell identifiers, finite source-grid coordinate vertices, nondegenerate and non-self-crossing polygons.
- Cell neighbor reciprocity tied to actual shared, oppositely directed geometric edges; no fabricated adjacency based only on cells sharing a vertex.
- No nonmanifold boundaries or inconsistent neighboring geometry.
- Connected cells within each declared simulator province and consistent cell→province→district assignment.
- No implicit geographic-region ownership on cells, provinces or districts; no assumption that exact owner lines equal nearest Voronoi seeds.
- No promotion of a synthetic graph to a proven First World save or canonical source.

**The synthetic graph is not the First World mesh.** It demonstrates only that the proposed quality gates can reject malformed topology. No recovered Voronoi sites, province lists, district memberships, seed coordinates, elevation scalars or original game-save match are claimed.

Run the native source/preflight only:

```powershell
node scripts/kaelvar-c1ad-voronoi-preflight.mjs --check
node --test tests/unit/kaelvar-c1ad-voronoi-preflight.test.mjs
```

For the prior screenshot source integrity check:

```powershell
node scripts/kaelvar-c1ac-simulator-evidence.mjs --check
```

If the owner's eleven-image packet is extracted on the machine, separately verify exact original screenshot bytes using the C1-AC `--verify-dir` mode. Neither command writes a source PNG or a region polygon.

## C1-AE: bounded read-only save reconnaissance

Codex may now inventory simulator saves **without** a new worktree and without changing or committing them.

One plausible Windows directory, corroborated by the game's documented LocalLow application path and community save instructions, is:

```text
%USERPROFILE%\AppData\LocalLow\The Stranger Studio\FantasyMapSimulator\Saves
```

Suggested **metadata-only** PowerShell inventory, not a save decoder:

```powershell
$root = Join-Path $env:USERPROFILE 'AppData\LocalLow\The Stranger Studio\FantasyMapSimulator\Saves'
if (Test-Path -LiteralPath $root) {
  Get-ChildItem -LiteralPath $root -File -Recurse -ErrorAction Stop |
    Where-Object { $_.Extension -eq '.save' } |
    Select-Object FullName, Length, LastWriteTimeUtc
}
```

For plausible candidates, record SHA256 and a stable file identity. **Do not publish the user's absolute local path, account names or private save bytes.** Keep a sanitized filename if needed. A name containing First World alone is insufficient to prove correspondence to the original PNG/vector hashes.

If the file is recognized and can be interpreted safely and **read-only**, establish:

1. Game/save format and compatible version; container compression/encryption if documented, no guessing.
2. Explicit world identity or independently corroborated terrain/shoreline registration against the fixed First World source.
3. Whether cell IDs/sites, polygon rings, adjacency, provinces, districts and their membership are actually stored and recoverable.
4. Whether recovered coordinates have a defensible transform to the exact original 2048×1152 source reference grid.
5. Independent coastline preservation, component-30 accounting, held island components and original source labels.

Only if all gates pass may a **new reversible, noncanonical mesh witness** be published. Do not overwrite C1-P or rewrite simulator saves to force correspondence.

## Regional-boundary implications

**Primary owner proposal first, topology next.** The C1-AC editor screenshot differs notably from the earlier northern C1-AA Veyrholm–Kharuun scratch seam. The southern Verdant line is closer locally but still has an unresolved eastern drainage-art continuation. Auric–Kharuun also deserves whole-interface attention, rather than another tiny inland waypoint move.

If a matching Voronoi cell graph becomes available, it is useful for **connectivity, adjacency, tracing and exact shared-edge geometry**. However, a Lineage regional border does **not** have to remain snapped to a particular Voronoi edge when a geographically better ridge, ravine, river, coastline or approximate transition crosses it. The final backend can instead dissolve cells into continuous polygons or create an independently verified source-indexed contour and use the graph as supporting evidence.

For finalized land, primary geographic region boundaries should eventually meet with no accidental blank ribbons. Where the terrain is an ecotone, a deterministic region boundary can coexist with a broad optional environmental influence across both sides. Avoid visible artificial borders, forced cliff lines and new subregions created merely to hide authoring gaps.

**Do not confuse a Voronoi cell with a final location resolution unit.** A region can contain many provinces and cells; the eventual movement/settlement resolver should use durable vetted geography, not mutable simulator province IDs.

## Frozen source and independent holds

Original Kaelvar mainland source component 30: **79,419** candidate samples.
Accepted **noncanonical** C1-P: Auric **5,632**, Kharuun **18,624**, Verdant **19,182**, Veyrholm **9,011**, totaling **52,449** provisionally assigned and **26,970** deliberately unassigned. C1-AA shared-seam trials and C1-AB terminal junctions remain independent, unpromoted experiments.

Original vector blob `9cd6752e9dbca00796e5f7c013066bb0e5a96175`, biome SHA256 `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12`, elevation SHA256 `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d` all remain unchanged.

Kharuun option B coastline edges **35–58**, Verdant southeastern peninsula, Veyrholm exclusions, northeastern headland edges **75–115**, original component 51, Shattercap, large northeastern detached island, every other detached component, Coast 40 and Serathyl Windward all remain independently held. **No canonical publication, map-image modification, island claim, settlement, port, river or gameplay content implementation** is authorized by C1-AD.

## C1-AE decision fork

- **Matched save and topology are available:** produce an original-source-aligned, reversible cell/province/district witness with exact source matching, neighbor/edge audits and no primary-region adoption. Then compare whole-region owner-drawn boundaries and naturally supported relief using that witness.
- **Save is unavailable, encrypted or unmatchable:** keep using the original source image pair, original coastline and source-reference screenshot ink as **design references**. Propose full-interface regional geometry separately and native-validate without pretending to have decoded Voronoi cells.

Either path should result in a better, whole-region design review, rather than a new chain of tiny waypoint optimizations. The focus remains continents, regions, islands and later settlement siting, not gameplay ecology or political administration.
