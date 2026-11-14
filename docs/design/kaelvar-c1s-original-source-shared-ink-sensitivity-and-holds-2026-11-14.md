# Kaelvar C1-S: Original-source shared-ink sensitivity and northeastern mainland HOLD

**Date:** 2026-11-14  
**Stage:** C1-S hosted-native evidence accepted; land/water, political and canonical ownership **HELD**  
**Tested implementation SHA:** `283e7e52a5f95409fb7e9574b53d8b20bcaced99`  
**Native CI:** [Run #43641073027](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43641073027), GitHub-hosted Ubuntu / Node 22, **not Windows-owner-native**  
**Retained machine-readable ledger:** [C1-S pinned witness](kaelvar-c1s-hosted-ink-sensitivity-acceptance-2026-11-14.json)

## Scope and immutable provenance

This is a noncanonical C1-S continuation of C1-R. No map source, canonical
world catalog, active region, original contour or art was changed. No new
branch or local worktree was created. C1-Q/R observed a 223-step 4-neighbor
candidate corridor connecting `(390,336)` within the provisional Verdant
region to `(492,215)` on the still-unassigned northeastern headland.

The original mainland coast is `feature.coastline.first_world.part_10`,
with **599 original source edges**; northeastern headland edges **75..115**
are under review. This is **not** Verdant's independently included
*southeastern* peninsula (all three of its owner anchors remain included)
and **not** the detached Shattercap or large NE island components.
Kharuun's original source-coast frontage stays exactly **35..58**.

Frozen source SHA fingerprints verified by the native CLI:

- Original vector Git blob: `9cd6752e9dbca00796e5f7c013066bb0e5a96175`
- Original biome PNG SHA256: `9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12`
- Original elevation PNG SHA256: `02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d`

C1-S uses the already registered source grid `2048×1152`, the exact
C1-R search window `x=300..590, y=155..465`, original source-vector
containment and **four-neighbor** path/clearance tests.

## Sensitive source classes

The earlier C1-R native probe counted **96 rejected adjacent pixel
samples** along the existing thin route. All were `SOURCE_PAIR_RGB_EQUALITY`,
meaning identical pixel RGB in the biome and elevation originals.

C1-S reuses the C1-I shared-nonblue exclusion rule and experiments only
with *temporary* additional eligibility for original terrain-label-zero,
unassigned pixels inside the source vector. No candidate is a source
pixel rewrite or a real land classification.

| Previously rejected, source-identical nonblue class | Hypothetically eligible reference pixels |
| --- | ---: |
| Exact black RGB (0,0,0) | 2,289 |
| Exact teal RGB (4,159,169) | 173 |
| Other identical nonblue RGB | 351 |
| **Total unresolved candidates within bounded review window** | **2,813** |

There are also **31 eligible unresolved source pixels immediately
adjacent to separately numbered original physical candidate components
51, 78 and 113**. This is an explicit risk of false physical-component
bridging under any permissive classifier. These are **not islands
assigned** or a certification that the original components have joined.

## Five reversible tests

All scenarios leave the original native C1-P terrain mask and component
inventory intact. `YES` below means only that a *hypothetical* temporary
pixel mask admits a source-candidate path at the selected Manhattan
clearance. None of these outcomes grants territory.

| Scenario | Temporarily allowed unknown pixels | 0px path | 1px path | 2px path |
| --- | ---: | --- | --- | --- |
| Original strict source pair | 0 | YES | NO | NO |
| Permit exact shared black only | 2,289 | YES | NO | NO |
| Permit exact shared teal only | 173 | YES | **YES** | NO |
| Permit shared black + teal | 2,462 | YES | **YES** | **YES** |
| Permit all shared nonblue | 2,813 | YES | **YES** | **YES** |

The original 0px path remains 223 steps. C1-S additionally pins:
- 1px teal-only test path SHA256
  `0cfbc0fac95776681b79b48d9903b73ee4c588a09e9526f268e06b801249c16b`.
- 2px black-and-teal test path SHA256
  `3b8a527dbb6cbf835b4b123923b2f8e6fde72f509afba3783f498a9a12d20d25`.

**Interpretation:** the 1px and 2px clearance failures under the
original source-pair rule are sensitive to how shared pixels are treated.
In particular, excluding the exact shared teal samples can determine
whether 1px clearance exists. This does **not** imply that teal is
land. The shared teal may represent water/river ink or another source
convention; black may be coastline linework, and each needs independent
source-adjudicated meaning. No source threshold was loosened in accepted
geography.

## Native verification, provenance and visual output

GitHub Actions run `43641073027` passed **36/36 tests**, zero failures;
the legacy-hex gate scanned **878** code files with **zero** new legacy-hex
dependencies. The C1-O/C1-P/C1-Q/C1-R validations were rerun before
the C1-S sensitivity check. The native CLI generated an original-source
underlaid C1-S SVG comparison and a machine-readable report.

The exact tested run retained artifact
`c1p-noncanonical-native-terrain-review` with ID `14131733341`
for **seven days**. To avoid repository growth, large generated SVGs are
not checked into Git. The C1-S report inside the pinned artifact has
SHA256 `924d7ddbcf31f614bfe510412e7456c48ba652ec462833b7d2930befb7b638f5`.
The same report bytes were verified after artifact download.

This was a hosted Ubuntu-native test, **not** an independently repeated
Windows PowerShell detached-worktree run. Windows-local acceptance
should not be implied by the hosted pass.

## C1-P and canonical holds remain unchanged

The original `component 30` terrain-candidate accounting stays:

| Region/hold | Native candidate cells |
| --- | ---: |
| Auric Marches | 5,632 |
| Kharuun Drylands | 18,624 |
| Verdant Thalos | 19,182 |
| Veyrholm Shore | 9,011 |
| **Provisional four-region total** | **52,449** |
| **Deliberately unassigned mainland** | **26,970** |
| **Source mainland candidate cells** | **79,419** |

**Zero** C1-S new political cells, source mask edits, new region rings
or detached physical-component claims. The original 599-edge source
coastline, C1-P rings, C1-F southern peninsula anchors, Veyrholm inland
exclusions, Shattercap detached islands, large NE island, Coast 40,
foreign Serathyl Windward parent, ports, wells, rivers, routes, salt
basins and all canonical publication remain untouched.

## Owner-visible C1-S verdict and C1-T next gate

**Verdict: classify northeastern headland as unresolved source-attached
mainland, with *provisional Verdant relationship* only as an unapproved
design hypothesis.** Do not grant the headland to Verdant or Shattercap.
The currently accepted C1-P geometry and 26,970-cell unassigned reserve
remain valid unchanged.

Recommended C1-T should:

1. Inspect the actual *source* biome and elevation pixels around the
   teal and black sensitivity-critical bottlenecks alongside the original
   vector coastline, separately from generic color assumptions.
2. Measure exact hypothetical clearance neighborhoods and the **31**
   original detached-component-adjacent unknown cells. A sensitivity
   mask must never silently merge an offshore physical component.
3. Produce a narrow owner-facing image that distinguishes **original
   accepted terrain**, **source-equal black**, **source-equal teal**, and
   **unresolved other** rather than painting them as land.
4. If additional physical-source evidence proves genuine continuity,
   author a separately reversible, valid polygon and rerun full
   source fingerprints, C1-F anchoring, 599-edge conservation, topology,
   native terrain accounting and island holds. Otherwise continue to
   leave the northeastern original mainland headland unassigned.

**Do not reduce unassigned land simply to make the regions appear
complete.** C1-S has no authority to publish sovereign regions, world
biomes, roads, sea routes or settlement infrastructure.

## Repository lifecycle receipt

The connector reused
`connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14` with no
new branch, worktree or PR. Local `C:\Codex` checkout/disk cleanup
cannot be certified through GitHub and remains separate Codex ownership.
