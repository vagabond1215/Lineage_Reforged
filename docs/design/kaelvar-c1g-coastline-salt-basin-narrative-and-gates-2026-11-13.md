# C1-G: Kaelvar coastal continuity, dryland evaporation basin and ecological border evidence gate

Date: 2026-11-13
Status: **REVIEW-ONLY EVIDENCE CONTRACT, NATIVE GATES PENDING; NO REGIONAL OR BASIN PLACEMENT APPROVAL**

## Entry and owner decision

C1 owner-native acceptance: SHA `6efb4a81583911c13657eb87d2c0ab009048c909`,
29/29 native Node tests, source PNG hash/registration witness, 837
files scanned with zero new legacy dependencies, owner visual
inspection of original-source SVG. The C1-F draft PR #83,
head `f646a504e34d63fa6bbe44def222a9dffdeeac30`, generated a
source-clipped noncanonical five-child-intent review with 52,624 preview
mainland candidate-terrain cells and 26,795 explicitly unassigned.
This is *not* a canonical five-region allocation; C1-F has passed CI
but has not been owner-native accepted or border-approved here.

Owner described the preferred region geography as broad western Auric,
central Kharuun, southern peninsular Verdant, a long narrow and
variable-width Veyrholm north-coast region, and separately reviewed
Shattercap islands. Subsequent direction: let ecological/physical
geography justify whether Kharuun ever reaches the northern sea; the
continuous Veyrholm littoral is preferred but not mandatory. Salt flats
can exist in the desert. No request creates a coastline, basin, water
source, sea port or published settlement by implication.

## Historical sources reused without replacing them

- C1-F placement guides: **versioned review windows only**, not map
  geometryRefs. Colors and coastline labels are NOT calibrated biomes,
  elevation meters, published region boundaries or route authority.
- Mainline Kaelvar five-region locality/env content already includes
  `region_locality.kharuun_salt_basins`,
  `environment_zone.kharuun_salt_basins` and
  `settlement_concept.tirash_saltworks`; all are unplaced.
- The ecological profile `kharuun.saltpan` already describes
  closed evaporite basins, brackish/absent water, salt extraction,
  heat/dehydration/crust collapse and resupply-limited habitation.
- Veyrholm already has **four distinct** locality/environment-zone
  candidates: sheltered inlets, firshore ridges, tidal marshes, outer
  capes. All remain unplaced. The corresponding ecological habitats
  are in the C0 ecology pack.
- Original biome PNG, elevation PNG, crop and 201-footprint master
  vector source are protected by C1/C1-F. The 159-footprint alternate
  snapshot remains an unmerged draft evidence lane. Do not
  silently apply the draft's 42 exclusions to current mainline.
- Original Windward source conflicts stay attributed to Serathyl;
  Coast 40, the northeast whole island and 18 detached components
  remain pending. Source-image topological components are not polities.

## North-coast narrative and decision fork

**Default proposal: CONTINUOUS_VARIABLE_DEPTH_VEYRHOLM.** Coastal
landforms must determine inland reach. The littoral may widen in
sheltered inlets and freshwater valleys, and narrow around steep
escarpments and dry coastal approaches. It must stay out of deep
dryland where independent landform evidence warrants. Geomorphic
coast, freshwater drainage, local rain/shadow behavior and approved
settlement connectivity are needed to corroborate this model.
A continuous territory mask would not prove a continuous road,
navigable sea passage or potable water.

**Alternative: LIMITED_KHARUUN_DRY_COAST.** Only allow a small,
source-referenced dry coastal exception if coastal geology and
registered shoreline prove a plausible mainland connection, and
freshwater/travel dependencies are reviewed. This remains
conditional and is not an authorized port or maritime route.
No fixed-width buffer, automatic yellow RGB = desert inference,
or mandatory Kharuun ocean frontage.

## Interior salt flats and evaporite basins

Kharuun can host **one or more potential interior salt-flat basins**,
but neither the count nor the placement is established. Salt pans are
not just yellow/orange biome pixels. A defendable inland salt basin
requires a closed or sufficiently restricted drainage basin, basin
relief, a source of dissolved salts, episodic mineral-bearing inflow
and an evaporation-dominated cycle. These are hypotheses requiring
source/landform review, not claims about measured world geology.

Salt flat local generation should vary between seasonal flood,
dry-crust, harvestable deposit and exposed ground, with flash floods,
unstable salt crust and heat exposure. No new lake, oasis, freshwater
well, salt deposit, resource node or travel edge is automatically
placed. The existing Tirash Saltworks concept is a small seasonal
extraction **outpost**, not a permanent city, and continues to require
imported freshwater/supplies and validated freight access.

## C1-G stage entry/exit/holds

| Gate | Entry | Pass | HOLD |
| --- | --- | --- | --- |
| G0 catalog crosswalk | C1-F review, C0 ecological candidates | Eight referenced Northern+Salt records and habitat names match; no duplicates | stale/missing existing IDs, placed settlement |
| G1 shore narrative | author-approved continuous-preference, exception conditional | exact six independent coast-evidence prompts, all uncertified | uniform pixel buffer or forced dry coast |
| G2 evaporite narrative | existing Kharuun salt zone and Tirash | seven independent basin-evidence prompts, no location guessed | RGB-to-salt translation, inland water presumed |
| G3 sovereignty and routes | C1/C1-F owner holds | zero island claims, zero Windward transfers, no port/route publication | unapproved island, Coast 40 or save/runtime mutation |
| G4 native | exact C1-G head, clean detached worktree | syntax, new tests, legacy freeze and read-only report | failure or source drift |
| G5 real placement | *future, not entered*: independently calibrated source/lake/drainage/salt evidence and owner review | only later separate region/basin geometry candidate proposal | any attempt to publish now |

The *design narrative* and its evidence checklist can exit C1-G;
physical basin placement, exact borders, slope/rainfall certainty,
active gameplay resources and canonical migration **cannot**.

## Read-only commands

Run from a clean isolated checkout at an exact C1-G SHA.
The following checks do not create world content:

```powershell
node --check scripts/lib/kaelvar-c1g-ecology-evidence.mjs
if ($LASTEXITCODE) { throw 'C1-G library syntax failed' }
node --check scripts/kaelvar-c1g-ecology-review.mjs
if ($LASTEXITCODE) { throw 'C1-G CLI syntax failed' }
node --check tests/unit/kaelvar-c1g-ecology-evidence.test.mjs
if ($LASTEXITCODE) { throw 'C1-G tests syntax failed' }
node --test tests/unit/kaelvar-c1g-ecology-evidence.test.mjs
if ($LASTEXITCODE) { throw 'C1-G native tests failed' }
node scripts/kaelvar-c1g-ecology-review.mjs --check
if ($LASTEXITCODE) { throw 'C1-G cross-catalog audit failed' }
node scripts/kaelvar-c1g-ecology-review.mjs --review
if ($LASTEXITCODE) { throw 'C1-G narrative report failed' }
node scripts/check-no-new-hex-dependencies.mjs --check
if ($LASTEXITCODE) { throw 'Legacy dependency freeze failed' }
```


No SVG is necessary at G0-G4 because there is no source-certified
salt-basin location to plot. Keep the existing C1-F map preview as a
visual discussion reference; do not add pretend basin dots.
