# Kaelvar C1-AB: shared regional seam terminal continuity and C1-AC handoff

Date: 2026-11-15  
Status: **HOSTED NATIVE PASS; GEOGRAPHIC ENDPOINT CONTINUATIONS, LAND/ISLANDS AND CANONICAL PUBLICATION HELD**  
Exact source/test implementation: `85302bb5809e1986ac2d9061e8dee5cb184673f6`  
[Hosted native run #43737081962](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43737081962)  
[Exact C1-AB endpoint evidence](kaelvar-c1ab-shared-seam-terminal-witness-2026-11-15.json)  
[Original owner-relative relief and shared-seam proposal](kaelvar-c1aa-relative-relief-decision-2026-11-15.md)

## Review finding

Codex's C1-AA source/test continuation has been inspected, including
its original Fantasy Map Simulator provenance attempt, relative-height
premise, original source hashes, 77 passing Windows/hosted prior tests,
two owner-provisional shared chains and exact C1-P-only terrain
accounting. It neither established that the opaque local simulator
save matches First World nor converted original colors into measured
elevation or authoritative hydrology.

**The local shared edges are tested as geometrically valid, but their
endpoint returns are not yet geographically adjudicated.** C1-AB
therefore adds a *read-only*, source-indexed junction audit, not a
replacement border, wider claimed biome strip, physical-component
merge, permanent region resolver or canonical authoring change.

The fixed owner assumption remains **orange/red relatively higher,
cream relatively lower**. Biome color remains secondary. A drawn cyan
course does not become a certified river or watershed solely from
its appearance. Primary geographic regions should eventually share
boundaries on finalized physical land; broad environmental influence
can still extend across a deterministic backend division.

## Exact shared-seam endpoint joins

Source-reference-grid vertex-to-vertex lengths below are **not
kilometers, slopes, landscape-transition widths or terrain-feature
confidence scores**. Each refers to one end of one original inland
return joining the exact accepted C1-AA *provisional* chain.

### Northern Veyrholm–Kharuun

Proposed geographic subchain:  
`(279,197) → (291,192) → (301,188) → (308,185)`.

| Existing region return | Old predecessor → first shared point | Last shared point → old successor |
| --- | --- | --- |
| Kharuun | (279,202) → (279,197), **5** source pixels | (308,185) connects toward its original coastline arc; **no following inland waypoint** |
| Veyrholm (reverse traversal) | (321,176) → (308,185), **15.81** | (279,197) → (271,194), **8.54** |

The Kharuun predecessor (279,202) remains preserved. The coastline
arc connection must be read from the source-indexed geometry, not
fabricated as an additional inland waypoint. This local transition
remains a plausible coastal-margin / inland-rise design sketch, not
an established mountain crest or a complete mainland border.

### Southern Kharuun–Verdant

Proposed geographic subchain:  
`(304,330) → (320,331) → (338,332) → (352,333)`.

| Existing region return | Old predecessor → first shared point | Last shared point → old successor |
| --- | --- | --- |
| Kharuun (reverse traversal) | (368,308) → (352,333), **29.68** source pixels | (304,330) → (296,313), **18.79** |
| Verdant | (289,348) → (304,330), **23.43** | (352,333) → (367,337), **15.52** |

The full original waypoint arrays have been read rather than inferring
neighbors from a cropped display. Two initial C1-AB negative runs
correctly failed **new test expectations** for the Verdant predecessor
and successor; no original geography was wrong or altered. The final
test pins all four original predecessors/successors and their
coordinate lengths.

The longer southern connectors should be inspected together with
the surrounding original elevation and biome images. Codex's
qualitative C1-AA report explicitly flagged the **wider eastern
drawn drainage-course crossing** as unresolved. Neither that course
nor the apron boundary has been certified as a watershed, river or
fixed topographic contour.

**Do not select a final region boundary based only on the shared
subchain's native geometry pass.** Geographic continuity across the
endpoints is still a genuine design decision.

## Exact native validation

New read-only source review files:

- `scripts/lib/kaelvar-c1ab-shared-seam-junction-audit.mjs`
- `scripts/kaelvar-c1ab-shared-seam-junctions.mjs`
- `tests/unit/kaelvar-c1ab-shared-seam-junction-audit.test.mjs`
- `.github/workflows/kaelvar-c1p-native-noncanonical-review.yml` (new isolated gate and report artifact)

The validator pins original owner-relative elevation assumptions,
both chains, their permitted change windows, source-indexed
replacements, all existing island/canon holds, the previously rejected
northern splice and southern drainage-hook sketch, original C1-P
coastline option B and the C1-AA **tested native source** results.

Its native CLI **re-runs the original C1-AA source/terrain comparison**
and requires the exact three-scenario counts and evidence before
reporting any junctions. Four new regression tests reject inadvertent
chain shifts, source/palette change, save authentication claims,
island/canon promotion and changed native ownership or unclassified
pixel counts.

[Final pinned hosted run](https://github.com/vagabond1215/Lineage_Reforged/actions/runs/43737081962)
at `85302bb5809e1986ac2d9061e8dee5cb184673f6` passed:

- **71/71** inherited C1-O through C1-AA unit tests.
- **6/6** existing relative/shared-seam native regression tests.
- **4/4** new C1-AB endpoint/contract regression tests.
- Source PNG/vector hashes, native imagery, original mainland
  component counts, every held coast/island gate and the new
  repeated source-indexed junction report.
- No-new-hex scan: **899 code files scanned, zero new dependencies**.

Native report `c1ab-shared-seam-junction-audit.json` SHA256:  
`7362b58f4576f607de55464cd04bbfe10ccde4217b7a172514f401232540e38c`.

GitHub Actions seven-day artifact
`c1p-noncanonical-native-terrain-review`, ID **14171280531**.
The generated files are not committed to Git, avoiding worktree/repo
growth. This is hosted Node 22 verification of **C1-AB**. The earlier
Codex source implementation's Windows Node 24 acceptance remains
documented separately; **C1-AB itself has not run an owner-local
Windows-native gate**.

## Frozen source and region accounting

The original mainland component 30 remains **79,419** terrain
candidate samples. Accepted **noncanonical C1-P** region counts are
unchanged: Auric 5,632; Kharuun 18,624; Verdant 19,182; Veyrholm
9,011; 52,449 provisionally assigned, 26,970 unassigned.

Codex's combined **scratch** C1-AA shared-seam scenario remains
54,195 assigned, 25,224 unassigned, with 1,746 newly covered
original mainland samples and **45 newly enveloped original source
label-zero samples still unresolved/unassigned**. Those are *trial
measurements*, not a publication event or permanent assignment.

Exact original coastline 599 edges, Kharuun option B edges 35–58,
Verdant southeastern peninsula anchors, Veyrholm dry inland
exclusions, northeastern headland 75–115, separate physical component
51, Shattercap, large northeastern island, other detached
components, Coast 40 and foreign Serathyl Windward all remain held.
No source PNG/vector, original terrain label, accepted C1-P region,
canonical catalog, settlement, monster, resource or narrative system
was edited.

## C1-AC: bounded next stage

**Priority 1: southern full-return context.** Show the unmodified
registered elevation first, biome second, with the shared apron chain
and **all four** actual original joining segments. Review the longer
Kharuun eastern (368,308) → (352,333) and Verdant western (289,348)
→ (304,330) connections together with the wider drawn drainage course.
Seek a smoother, more coherent *reversible* return only if its relative
terrain evidence improves on keeping the current one.

**Priority 2: northern coast-to-inland context.** Continue both the
Veyrholm return and Kharuun's ending original source-coast arc beyond
the four-point shared chain, retaining Option B and Veyrholm's
protected exclusions. Do not invent a coastline inland waypoint to
close a drawing.

**Priority 3: regional coverage roadmap.** Keep the long-term
single-primary-region shared-boundary model for finalized physical
land. Plan whole-interface and eventual whole-continent topology
without turning the 25,224 scratch unassigned cells into permanent
regionless ecological bands or claiming uncertain source ink.
Environmental transitions may become independent influence metadata
later; gameplay/settlement implementation remains out of scope.

If a revised whole-return alternative is authored, run the same
original-pixel, source-indexed coast, 4-region nonoverlap, shared-edge
direction, owner-tie, component-30 conservation, detached-island and
combined-scenario tests. Preserve the previous two C1-AA candidates
for side-by-side comparison and never silently relax a failure.

### Repository lifecycle

All connector changes use the existing
`connector/c1o-kaelvar-regional-boundary-candidates-2026-11-14`
branch. No additional branch, permanent local worktree, draft PR,
merge, rebase or remote branch retirement was created. The connector
cannot attest to local Windows disk or worktree cleanup. Earlier
geography draft PR #82–#87 remain independently held.
