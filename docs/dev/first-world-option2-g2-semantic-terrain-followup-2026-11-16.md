# Next implementation prompt: G2-B independent simulator land semantics

Date: 2026-11-16  
Entry: [G2 full-resolution rendered-component audit](../design/first-world-option2-g2-native-physical-component-review-2026-11-16.md)  
Current status: **G2_AMBIGUITY_HELD**, not canonical release.

## Purpose

The two G2 color classifiers have strong numeric agreement but **share the same rendered coast/water palette**. A second threshold applied to export images does not provide a truly independent simulator land mask. Native full resolution yields 169/161 candidates under exact-color A and 171/163 under broader Biome/Height B. A and B differ at 44,716 pixels, and only one substantial mixed-parent component was sampled, Draemor–Talmyra. Those are valuable review leads, but not named island identities.

**Do not attempt to solve this by nudging color thresholds until the island counts look plausible.**

## Steps

1. **Preserve source and user checkout.** Inspect `git status`, worktrees, active C1 and current master; avoid switching/resetting an occupied branch. Verify all five original PNG hashes and original ZIP hashes. Keep simulator save files immutable.
2. **Native semantic mask discovery.** Non-destructively inspect Fantasy Map Simulator's actual current save schema, procedural Voronoi terrain mesh or export API, if available. Record version, file hash and proven correspondence to Option 2; a March-named save is not presumed the current 2026-11-15 state. Decode no unknown binary with invented offsets; do not upload private complete saves to public Git.
3. **Build classifier C using source-independent semantics.** Prefer real simulator land/water tags or decoded cell geometry, not the same renderer's blue pixels. Register its source and coordinate transform. If unavailable, declare `SEMANTIC_LAND_AUTHORITY_HELD` and use the current ledger only for annotated owner review.
4. **Island ledger comparison.** Use the native 16K 664-row provisional G2 ledger and candidate atlas as a review queue. Match features by geographic positions and shapes, never transient component IDs. Audit every whole detached island, holes, rivers, coastal strokes and nonland rock.
5. **Draemor–Talmyra local source check.** Independently verify actual dry-stone connection, local coastline, tidal and arch mechanisms if source contains them. Differentiate a walkable isthmus (owner design) from an established road/path, small-craft passage and large-vessel exclusion (still not route-authorized). Publish an evidence-only crossing table and owner-review ROI, not a travel edge.
6. **Nine-parent and child geography.** For white northern Dawnreach and red Myridian, detached jellyfish island, Kaelvar NE island/Shattercap, Serpent's Wake and remaining disputed pieces, request exact owner approval only after presenting whole-island semantic geometry. Geographic labels are not political sovereignty. Internal regions may have variable areas and exact reciprocal shared seams.
7. **Acceptance gate.** Reproducible source provenance, cross-classifier topology and honest ambiguity ledger; test exact native source on a review branch. Never write canonical regions, source PNGs, settlement coordinates, route graph, legacy hex, save or runtime until source authority and owner approvals are satisfied.

## Re-run native G2 on the user's Windows workstation (optional)

With a clean source checkout on latest `master` and fully hydrated Option 2 LFS assets, using the existing project venv:

```powershell
$py = "$env:LOCALAPPDATA\LineageReborn\first-world-registration-venv\Scripts\python.exe"
$repo = "C:\Codex\EoL"
$src = Join-Path $repo "packages\content\base\world\map_assets\first_world_simulator_option2_2026_11_15"
$out = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_Option2_G2_Native_Recheck"
& $py "$repo\scripts\first-world-option2-g2-component-audit.py" --self-test
& $py "$repo\scripts\first-world-option2-g2-component-audit.py" --source-dir $src --output-dir $out
```

The runner intentionally rejects output inside the repository. If the user's checkout is not current master or LFS is not hydrated, use a separately verified clean source checkout, not a destructive switch. The audited source PNGs have SHA-256 witnesses in the G2 report.

**Success is an evidence-backed `SOURCE_ONLY` land/sea topology review and a truthful held list. No canonical island assignment or route promotion is part of this pass.**
