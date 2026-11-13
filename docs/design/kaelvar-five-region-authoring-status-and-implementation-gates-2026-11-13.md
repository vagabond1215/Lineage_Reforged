# Kaelvar five-region authoring: Kharuun Drylands and Veyrholm Shore

Date: 2026-11-13  
Status: **F5-0 MAINLINE AUTHORING NATIVELY VERIFIED / WORLD PUBLICATION HELD**  
Authority: Reviewable authored candidate data on `master`, not active `world.regions` or map geometry.

## Decision and names

The owner selected five geographically unequal Kaelvar regions: **The Auric Marches**, **The Kharuun Drylands**, **Verdant Thalos**, **The Veyrholm Shore**, and **The Shattercap Isles**. The first three existing canonical identities remain unchanged. The two newly named regions have full canonical-shaped *candidate* records in this package, but do **not** yet exist as published region IDs in `packages/content/base/world/regions.json`.

The five-region model follows the owner's map sketch: Auric is the western steppe and mineral frontier; Kharuun is the coherent central desert, oases and high desert; Verdant is the wooded, fertile south; Veyrholm is the **northern mainland** shore; Shattercap covers independently approved offshore islands only. No equal-area rule is used. The large northeastern island must be treated as a **single whole geographic unit** at later sovereignty review, whether included in Shattercap or not. No arbitrary island splitting, blank-region fill, forced fourth eastern region, or equal-sized borders.

The previously accepted R3 source-aligned Layout A witness (PR #81, `0db193e3fc30502bbfcd4eb7e8388586aec239a5`) passed 76/76 native tests and generated 38,695 provisional mainland cells with 40,724 unassigned. That evidence concerns the *old three-child* sketch only: its masks are not published, and 40,724 unassigned mainland cells are **not** automatically Kharuun. Redrawing the five-child geography needs an independently reviewed source overlay. The source RGB biome legend, elevation ramp, coastline/river ink and island/parent sovereignty are not yet calibrated or approved.

## Three reviewable master files

| File | Contents | Comparable active authority |
| --- | --- | --- |
| `docs/design/kaelvar-five-region-candidate-region-records-2026-11-13.json` | Two full subregion records with IDs, slugs, parent, map, position, summary, tags, all eight environment fields, eight simulation fields, population and economy profiles, settlement targets and generation rules, plus demographic distributions, civilization and strategic notes | `packages/content/base/world/regions.json` |
| `docs/design/kaelvar-five-region-locality-environment-and-settlement-candidates-2026-11-13.json` | Four full locality records, four matching coordinate-first environmental-zone proposals and four unplaced settlement concepts **per new region**, with complete resource catchments, settlement suitability, travel modifiers, industry lists, zone-specific barriers, hazards and resource affinities | `region_localities.json`, future coordinate environment-zone authority, `settlements.json` |
| `docs/design/kaelvar-five-region-ecology-and-generation-candidates-2026-11-13.json` | Eight habitat profiles total (four per region), terrain/geology/hydrology hypotheses, temperature and seasonal cycles, flora, fauna, monster archetypes, gathering, natural hazards, crafters, crafting chains, reproducible local-generation behavior, travel dependencies and explicit uncertainty | Later, more granular ecology and procedural-generation authorities, not yet active |

Each region **exceeds** the current existing Kaelvar child completeness in candidate detail: all active field sets are present, and the additional ecosystem, cultural, civilization, climate, population, crafting and wildlife evidence lives in explicit review-only material.

## Kharuun Drylands: geographical and ecological identity

Central dryland plateau and basin system. Four internally different habitats: salt pans; permanent water-dependent oasis pockets; stony high-desert escarpments and pass country; and intermittently flooded wadi fans. These should generate very different local maps and spawn densities. Oasis settlements must be supported by demonstrated reliable water. Salt flats should have sparse population, severe exposure, and resource extraction limited by resupply. Monster archetypes are **conceptual behaviors** tied to actual habitat and seasonal context, not existing content IDs.

Locality bands: **Kharuun Oasis Chain**, **Kharuun Salt Basins**, **Kharuun Escarpment Steps**, **Kharuun Wadi Fans**. Candidate settlements: **Azharin Wells**, **Tirash Saltworks**, **Kethra Terraces**, **Rillwash Post**. All have suggested roles, water requirements, crafts and routes, but **no** coordinates, canonical IDs, active hex anchors, travel edges, or guaranteed settlement publication.

Economy: salts, copper and stone, glass sand, pigments, oasis herbs and dried fruits, caravan and well services. Needs external grain, timber, cloth, metal tools and water-storage equipment. Routes are constrained by defensible passes and known chains of water sources, not shortest lines drawn through open desert.

## Veyrholm Shore: geographical and ecological identity

Northern **mainland** coastal culture and ecology, not an alternative name for Shattercap. Four internal habitats: rock capes and cliff watchholds; sheltered tidal inlets and fish ports; fir/conifer ridges with resin and timber; brackish tidal marshes. Storm exposure and fog differ between inlets and open capes; potable upstream water is distinct from salty estuary water. Mainline shipping and sea ferries need approved endpoints before they can become game routes.

Locality bands: **Veyrholm Sheltered Inlets**, **Veyrholm Firshore Ridges**, **Veyrholm Tidal Marshes**, **Veyrholm Outer Capes**. Candidate settlements: **Cairnport**, **Firshore Crossing**, **Eldmere Ferry**, **Cairnflare Watch**. None is placed or published. Crafts include shipwrights, rope and net makers, pitch workers, smokers, coopers, quarries, ferrymen and beacon keepers.

Economy: fish, salt, pitch, timber, rope, quarried stone and port services; imports grain, cloth, iron tools and wine. Shattercap trade is via **potential sea connections**, not continental ownership.

## Population and settlement-model conservation

Existing parent estimate: **40 million**. Existing active three-child profile: Auric 10m + Verdant 24m + Shattercap 6m = 40m. The new *illustrative five-child balance* keeps exactly 40m:

| Region | Current active, millions | Proposed, millions |
| --- | ---: | ---: |
| Auric Marches | 10 | 8 |
| Kharuun Drylands | Not active | 5 |
| Verdant Thalos | 24 | 19 |
| Veyrholm Shore | Not active | 4 |
| Shattercap Isles | 6 | 4 |
| **Kaelvar** | **40** | **40** |

These numbers are **scenario values only**. No active population, demographics, settlement target, settlement anchor, route or Save is changed. Final numbers need review with mapped inhabitable surface, agriculture, fresh water and existing named settlements. A large region may have a small population. Kharuun's target is 1 city, 4 towns, 10 villages, 9 outposts, 7 strategic sites. Veyrholm's is 1 city, 5 towns, 14 villages, 7 outposts, 6 strategic sites. Those are not yet procedural settlement quotas.

## Review gates and failure criteria

| Gate | Entry | Exit | HOLD / failure |
| --- | --- | --- | --- |
| F5-0 candidate content | Existing master catalog shapes, owner-approved name choice | Two records with full region field parity; eight locality/environment-zone pairs; eight settlement concepts; eight habitats | Missing fields, duplicated names or IDs, parent drift, population >40m |
| F5-1 source/geography | Existing 2048 × 1152 source witness and five-region owner sketch | Separate five-region overlay with source feature crosswalk, counted unresolved mainland, whole detached island identities | Using old three-region borders as authority, equal-size fill, unapproved source RGB or island split |
| F5-2 ecological semantics | Independent original biome/elevation legend, coast/river/ink adjudication | Biome and water source constraints mapped at regional and locality scale | Treating art colors as biome truth, invented springs, heights or marsh coast |
| F5-3 settlement dependency | F5-1 and F5-2 reviewed, population redistribution accepted | Region/locality/hex/settlement/route/starting-area/spawn/crafting crosswalk, Save compatibility review | Published place without source-safe coordinate or linked route; broken existing Stonevein or harbor record |
| F5-4 actual catalog publication | Explicit written owner approval and dependency audit | Separate accepted commit inserts canonical region/locality/hex records and reviewed regional geometry | Premature catalog activation, failed data validators, island/Coast 40/Windward reassignment |

Only F5-0 authored-data preflight is applicable to the files now on `master`. This is **not** the five-region geographic-mask acceptance or publication.

## Read-only native checks

The audit compares all candidate full fields with existing active templates and checks source parent IDs, names across all active continents/regions/localities/settlements, population arithmetic, race percent totals, locality/environment-zone relationships, eight habitat profiles, unplaced settlement IDs, source identity and island/approval flags.

```powershell
$ErrorActionPreference = 'Stop'
Set-Location 'C:\Codex\EoL'
node --check scripts/lib/kaelvar-five-region-candidate-audit.mjs
if ($LASTEXITCODE) { throw 'Library syntax failure' }
node --check scripts/kaelvar-five-region-candidate-audit.mjs
if ($LASTEXITCODE) { throw 'CLI syntax failure' }
node --check tests/unit/kaelvar-five-region-candidate-audit.test.mjs
if ($LASTEXITCODE) { throw 'Test syntax failure' }
node --test tests/unit/kaelvar-five-region-candidate-audit.test.mjs
if ($LASTEXITCODE) { throw 'Candidate unit tests failed' }
node scripts/kaelvar-five-region-candidate-audit.mjs --check
if ($LASTEXITCODE) { throw 'Cross-catalog candidate audit failed' }
```

**Important:** The user's primary local worktree is dirty. Do not reset, clean, stash or switch it merely to run these commands. Use an isolated clean detached checkout at a verified master SHA for native tests. The above commands assume the files have already been safely pulled into the working checkout and do not do that themselves.

## No automatic canonical or branch merge

This content is deliberately a *mainline design pack*. The accepted R3 draft remains open and unmerged. No source PNG, existing region ID, old region footprint, ecology legend, Shattercap detached island, Coast 40, foreign Windward parent, existing world hex, settlement, travel route, generation logic or Save has been modified. Later five-region geography should be built from the owner's unequal-size sketch and these profiles, then reviewed before any active content insertion.

## Owner-native F5-0 authoring acceptance, 2026-11-13

Owner executed isolated detached PowerShell 7 verification at the exact mainline content commit `997d2d7b49c592214cf764270dd00e29c42b3eb0`. All **10/10 native unit tests passed**, with no failures, and the read-only five-region CLI invariant audit passed. Native output: `KAELVAR FIVE-REGION PROFILE GATE PASSED`, `CANONICAL GEOGRAPHY STILL HELD`. The checked worktree remained clean and the HEAD matched the pinned commit.

Validated data: two new **candidate** region records, eight candidate region localities, eight unplaced environmental-zone candidates, eight unplaced settlement concepts, eight complete ecological habitat descriptions, and the five-region population scenario conserving Kaelvar's 40 million people. The audit result was `FIVE_REGION_AUTHORING_COMPLETE_CANONICAL_HELD` with `canonicalWritable:false` and `ownerGeographyApprovalRequired:true`.

**F5-0 exit ACCEPTED.** This supersedes any earlier language in this document that suggests native acceptance is pending. **F5-1 through F5-4 remain unentered or held:** neither actual world source geometry nor biome palette/height semantics are certified for the five-region model, and neither new region is active in `world.regions`. The large northeastern island remains a whole geographical object with pending sovereignty; the 18 Shattercap detached candidates remain unassigned; Windward stays parented to Serathyl; Coast 40 remains disputed. No equal-area partitions and no automatic allocation of previous Layout A's unassigned mainland cells are authorized.

**Next scoped step:** five-region, unequal-area *reversible* spatial overlay comparing the owner's annotated breakup against the registered source PNGs, with explicit five-child presence only in the proposal domain. Report the count and category of unassigned mainland cells separately from non-Kaelvar/foreign land, keep all discrete islands whole, and require owner visual review before candidate masks or content are promoted to canonical gameplay.

## Coordinate-first amendment, 2026-11-13

**Approved architectural direction: future geography is based on coordinates, polygons, named places and explicit traversal connections, not newly created hexes.** The source, freeze gate, compatibility risks and migration stages C0–C5 are in [the coordinate-first geography migration contract](coordinate-first-world-geography-migration-contract-2026-11-13.md).

Eight previous semantic world-hex *candidates* have been replaced by **eight unpublished, coordinate-first environmental-zone candidates**, retaining ecological and traversal metadata without new legacy hex identities or graph edges. Their geometry references are all `null` until source/parent review. Eight settlement concepts remain unplaced. Current active hex catalogs, edges, routes, encounters and saved game data stay intact temporarily because they remain real runtime dependencies. The prior F5-0 authoring evidence is retained; **the new coordinate-first conversion subsequently PASSED owner-native C0 verification at `831e15f5cf7504a30208daa54949db7789954f81`** before acceptance.

This is not permission to delete legacy runtime datasets, use equal-sized boundaries, automatically claim unassigned central desert, split the large northeastern island, assign the other 18 pending detached source components, resolve Coast 40 by proximity, or move Serathyl's Windward Spine into Kaelvar.
