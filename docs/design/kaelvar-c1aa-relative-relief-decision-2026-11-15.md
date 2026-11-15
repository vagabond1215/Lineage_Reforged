# C1-AA continuation: relative relief and provisional shared seams

Date: 2026-11-15. Unversioned C1-AA geography review; Game `0.1.1-prealpha`, playability `INTEGRATED_LOOP`; development and game-version impacts `none`.

**Decision: recommend two PLAUSIBLE_APPROXIMATE_SHARED_BOUNDARY candidates for owner review.** Lack of numeric height calibration no longer blocks this qualitative decision. The accepted C1-P geometry remains unchanged; the candidates are separate, reversible, noncanonical artifacts.

This supersedes the calibration-dependent selection HOLD in the [earlier C1-AA review](kaelvar-c1aa-qualitative-relief-review-2026-11-15.md), following the owner's clarification: the map came from Fantasy Map Simulator; red/orange means comparatively higher terrain, cream comparatively lower; approximate boundaries are acceptable where terrain changes gradually. These are intended ordinal semantics, not a measured elevation scale. No meters, numerical slopes, computed flow directions or modeled watersheds are introduced.

## Source investigation and confidence

The installed Steam manifest identifies Fantasy Map Simulator, app `3035500`; its `FantasyMapSimulator_Data/app.info` names The Stranger Studio. A read-only inspection found one save:

`%USERPROFILE%/AppData/LocalLow/The Stranger Studio/FantasyMapSimulator/Saves/20260315141309.save`

It is 2,261,696 bytes, last written 2026-03-15, SHA256 `2c0c159b604e4b2deb059d8f8acd1e67a0b2b32dba2c3783dc133474fda3ff13`. Strict base64 decoding yields 1,696,272 opaque bytes; direct gzip, zlib and raw-deflate decoding do not recover structured map data. **Encoding/encryption is unresolved, and this save has not been matched to First World.** No game was launched, no save/settings were written, and no local save bytes were committed or uploaded. Further save/export recovery can be a bounded separate source-recovery pass; it is not a prerequisite for this qualitative review.

The source PNG/vector hashes from the earlier review remain exact. Confidence in registration and unchanged source bytes is STRONG. Confidence in the owner's ordinal interpretation is sufficient for qualitative authoring; feature-specific interpretations below are PLAUSIBLE, not certified. The broad Kaelvar elevation view shows a stronger orange southern interior with several drawn drainage courses connecting toward paler coastal margins. That pattern is consistent with an upland interpretation and cross-checks the palette against terrain shape and drainage. It does not establish a volcanic origin, exact peak, full catchment or flow model. No island was identified or claimed from the owner's southern-island example.

## Northern recommendation

Prefer `NORTH_APPROXIMATE_COASTAL_TRANSITION`: shared reference chain, west to east,
`(279,197) → (291,192) → (301,188) → (308,185)`.

The lower pale coast grades into a warmer, relatively higher interior. This supports a coastal-margin / inland-rise distinction, while the lack of a sharp break makes an approximate seam more appropriate than a claimed ridge, escarpment or named frontier. Local drainage does not independently select the line. Biome continuity is compatible with a gradual environmental change and does not demand regionless ground.

The exact vertices are authoring choices within the visible transition, not extracted contour points or an arithmetic gap-minimization result. Both neighbors reference the same chain in reverse directions. Kharuun's existing `(279,202)` approach vertex is preserved; the short endpoint connector is an interim join to untouched geometry, not a mapped landform. Extend/smooth the boundary beyond this bounded subchain only in a later whole-interface review. Kharuun coastline option B 35–58 and Veyrholm's inland exclusions remain fixed.

## Southern recommendation

Prefer `SOUTH_APPROXIMATE_UPLAND_APRON`: shared reference chain, west to east,
`(304,330) → (320,331) → (338,332) → (352,333)`.

The stronger orange southern massif, its lower northern apron and nearby drainage course support separating the southern upland environment from the inland area to its north. This is not a simplistic "Kharuun high / Verdant low" division: the source shows comparatively higher ground within Verdant's southern interior. The chosen shared subchain lies south of the visible hooked drainage feature and north of the stronger southern upland, keeping that local hook together on the northern side. It approximates an environmental apron, not an exact river bank or watershed divide.

The initial sketch `(304,326) → (320,327) → (338,326) → (352,325)` likely crossed the cyan hook twice. Independent visual review rejected it in favor of the smoother, more southerly apron. The eastern connector back to the old Kharuun return still crosses the wider drawn drainage course; **the full catchment is not claimed to lie on one side**, and that endpoint needs wider continuation review before final geographic adoption. All Verdant southeastern peninsula anchors remain included.

## Comparison, in the owner's priority order

Source confidence is STRONG for raster/vector registration; exact natural-feature positioning remains moderate/PLAUSIBLE. The following categorical matrix replaces the earlier blanket insufficient-calibration ranking. Geometry entries apply to review artifacts only; minimality is considered after geographic coherence and coverage.

| Alternative | Relief coherence | Continuity | Transition realism | Coverage | Biome (secondary) | Geometry | Minimality / disposition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| North KEEP C1-P | PLAUSIBLE coastal/inland context | WEAK exact natural alignment | PLAUSIBLE if reserve is temporary | WEAK: two separated returns | PLAUSIBLE | STRONG baseline | STRONG minimality; preserve as accepted baseline, not preferred final topology |
| NORTH_VEYRHOLM_SOUTH_TWO | PLAUSIBLE, little change in relative relief | WEAK improvement over baseline | PLAUSIBLE | WEAK: gap remains | PLAUSIBLE | STRONG independent C1-Z gate | Small edit; not distinguishable enough to select on relief |
| NORTH_KHARUUN_NORTH_TWO | PLAUSIBLE, little change in relative relief | WEAK improvement over baseline | PLAUSIBLE | WEAK: gap remains | PLAUSIBLE | STRONG independent C1-Z gate | Small edit; not distinguishable enough to select on relief |
| NORTH_APPROXIMATE_COASTAL_TRANSITION | PLAUSIBLE coastal-margin / rising-interior seam | PLAUSIBLE shared subchain; endpoint joins provisional | STRONG design fit for gradual terrain | STRONG locally, incomplete globally | PLAUSIBLE | STRONG native review | Larger paired edit justified by shared topology; RECOMMENDED PROVISIONALLY |
| South KEEP C1-P | PLAUSIBLE broad upland-apron context | WEAK exact terrain alignment | PLAUSIBLE if reserve temporary | WEAK: gap remains | PLAUSIBLE | STRONG baseline | Minimal reference; not preferred final topology |
| SOUTH_KHARUUN_SOUTH_THREE | PLAUSIBLE but not a terrain-feature trace | WEAK demonstrated improvement | PLAUSIBLE | WEAK: gap remains | PLAUSIBLE | STRONG independent C1-Z gate | Small edit, no decisive geographic advantage |
| SOUTH_VERDANT_NORTH_THREE | PLAUSIBLE northward extension of southern apron | PLAUSIBLE small precursor, not decisive | PLAUSIBLE | WEAK: gap remains | PLAUSIBLE | STRONG independent C1-Z gate | Best small precursor to study; not full shared solution |
| SOUTH_APPROXIMATE_UPLAND_APRON | PLAUSIBLE relative upland + lower apron + drainage cross-check | PLAUSIBLE core; wider eastern connector unresolved | STRONG design fit | STRONG locally, incomplete globally | PLAUSIBLE support, not selection basis | STRONG native review | Paired shared edge justified; RECOMMENDED PROVISIONALLY |

No area gain or shortest-gap measure selected these lines. Gradual environmental influence can straddle a precise primary edge; transition width and blend weights remain unspecified. The new previews show that idea schematically rather than inventing measured transition bands. No fences, checkpoints or political control are implied.

## Reversible geometry and native checks

The [candidate JSON](kaelvar-c1aa-relative-relief-shared-seams-2026-11-15.json) stores only local waypoint replacements against C1-P. The [read-only diagnostic](../../scripts/kaelvar-c1aa-relative-review.mjs) clones C1-P, runs the original coastline/anchor/topology builder, validates oppositely directed shared edges, rejects interior overlaps and measures only original component-30 candidate samples. It tests northern-only, southern-only and both together. The accepted source/specification is never overwritten.

The old C1-Z four-sample residual-gap rule remains untouched in its historical trial validator. These separately authorized shared-edge experiments have their own review contract; removing that historical guard would be the wrong way to test touching boundaries. Exact-edge sample ties use stable region-ID ordering **only in this diagnostic**. No production resolver, regional blending engine or gameplay system was installed.

| In-memory scenario | Auric | Kharuun | Verdant | Veyrholm | Assigned | Unassigned | New component-30 candidates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Accepted C1-P, unchanged | 5,632 | 18,624 | 19,182 | 9,011 | 52,449 | 26,970 | 0 |
| Northern shared seam | 5,632 | 18,815 | 19,182 | 9,207 | 52,836 | 26,583 | 387 |
| Southern shared seam | 5,632 | 19,554 | 19,611 | 9,011 | 53,808 | 25,611 | 1,359 |
| Both shared seams | 5,632 | 19,745 | 19,611 | 9,207 | 54,195 | 25,224 | 1,746 |

Every row totals 79,419. No previously assigned regional candidate changes owner; Auric is unchanged. One pixel-center tie on the northern shared edge is resolved deterministically. There are zero interior polygon collisions, original coast crossings or detached-component claims, and all protected anchors pass.

**Physical uncertainty remains distinct:** the enlarged raw review envelopes cover 34 northern and 11 southern source-label-zero samples. All **45 remain unresolved and unassigned**, not certified dry land or water. A new envelope entering any nonzero detached component is rejected. Shared polygon edges therefore do not prove fully finalized physical coverage. This is local progress toward shared topology, not completion of Kaelvar's regional subdivision.

A first northern patch removed the `(279,202)` approach vertex and changed sample `(269,204)` outside the bounded window. The native gate rejected it. The rejected patch and reason are retained in the candidate JSON and local log. The corrected patch preserves that approach vertex; the window and source constraints were not broadened. The earlier C1-U/X rejected headland experiments also remain unchanged.

## Execution and handoff

Source base `d5f68ef349591eb696475a993e9c05e83a80af8d`; reuse existing geography branch. The source/test implementation and exact hosted/Windows evidence are recorded in the completion receipt appended below. New tests cover scan-order independence, exact-edge endpoints, interior overlaps, undeclared/same-direction contacts, unmatched segments, unresolved/detached labels and actual-source separate/combined accounting.

The [minimal backend architecture](kaelvar-c1aa-relief-first-regional-topology-and-transition-prework-2026-11-14.md) still applies: one primary region on finalized land, deterministic shared-edge resolution, explicit authoring/physical holds, optional neighboring environmental influences and settlement lookup through the same future owner. No narrative, monster, resource or political model implementation belongs here.

All island, headland, component-51, foreign-region, source-integrity and canonical-publication holds remain. Kharuun/Veyrholm canonical records remain absent and unregistered. Owner review of these concrete shared subchains and their endpoint continuations is the next bounded geography step. Lack of numeric calibration alone is **not** a blocker; unresolved physical pixels, unsupported claims and canonical approval remain real gates.

FP-002: native passes are separate from geographic/canonical acceptance. FP-007: earlier records retained with explicit supersession links. FP-009: base, test-bearing and final receipt commits distinguished. No branch integration, PR closure, permanent worktree or new permanent branch is authorized; #82–#87 retain their independent integration triggers.
