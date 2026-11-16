# First World Option 2 G2-E1: Valtherion owner-review coast alternatives

Date: 2026-11-16  
Status: **DERIVED_COAST_OWNER_REVIEW_READY; TWO DECISIONS PENDING; CANONICAL_GEOMETRY_HELD**  
Sources: [Image/History export reality](first-world-option2-g2e-image-history-derived-geography-gate-2026-11-16.md), [native full-resolution A/B component crosswalk](first-world-option2-g2c-semantic-land-authority-and-island-review-plan-2026-11-16.md), [machine review ledger](first-world-option2-g2e1-valtherion-owner-review-2026-11-16.json).  
Reproducer: [16K hash-gated review generator](../../scripts/first-world-option2-g2e1-owner-coast-review.py).

## What changed and why

The Codex live simulator experiment is a separate exploratory track; no verified new source geometry or safe binary decoder has been published to GitHub. This G2-E1 pass instead makes concrete, reproducible **source-derived owner review materials** without depending on Codex credits or an unsupported simulator terrain export.

The original State, Biome and Height source PNGs were checked at full 16384×9421 resolution against the archived immutable SHA-256 digests. No game saves, private Workshop binaries, source media, active C1 branch or canonical Lineage geography was changed.

Two Valtherion coastal pieces are the *only confirmed split in the existing full-native rendered-color A/B crosswalk*: A uses State `RGB R=64,B=255` as ocean, B uses broad blue chromatic votes from **both** Biome and Height. The wider B blue mask removes thin rendered coastal strips and splits the Valtherion main source-colored component into a large mainland and two smaller coastal pieces. B **does not** provide independently sourced semantic terrain truth. A third blue threshold would not help.

## Two bounded owner decisions

| Review ID | Exact 16K source bbox `[x0,y0,x1,y1)` | B fragment area from full G2-C source crosswalk | Local A/B pixel disagreement |
| --- | --- | ---: | ---: |
| **V1** `G2E1_VALTHERION_V1` | `[8164,1592,8223,1658)` | 2,916 pixels | **341** pixels in the surrounding review window |
| **V2** `G2E1_VALTHERION_V2` | `[8744,2391,8823,2452)` | 3,169 pixels | **293** pixels in the surrounding review window |

The surrounding review crop uses **90 native-source pixels of padding**, so the local disagreement count is not the fragment's full pixel area and is not an authoritative island-size measurement. Pixel coordinates refer to original PNGs, not the unapproved 2048×1152 registration.

The 16K atlas shows six synchronized views per location: unchanged **State**, **Height**, **Biome**, A rendered land, B rendered land and the A/B pixel-disagreement overlay. Orange pixels indicate where A treats a rendered stroke as nonwater while B treats it as blue water. That signal is **not** proof of a walkable landbridge, navigable water channel or geological contact.

**Decision options for each whole physical feature:**

- `CONNECTED_LAND`: retain as a coastal spur attached to Valtherion under the later owner-authored coastline.
- `SEPARATE_ISLAND`: record as a whole detached island, still subject to a separately reviewed named/parent assignment.
- `HELD`: preserve the uncertainty until an independent cartographic adjudication.

Both `ownerDecision` values are **null**, and both review records remain `PENDING_OWNER`. Nothing automatically selects the B interpretation just because it has more detached components. A later response from the owner should cite V1 or V2 and the requested interpretation. The owner can choose `HELD` for either.

## Running the review generator without Codex

Requires Python 3.12+ with NumPy and OpenCV. Use the **original three LFS PNGs** (not downscaled preview images), or the byte-verified locally extracted originals:

```powershell
$py = "$env:LOCALAPPDATA\LineageReborn\first-world-registration-venv\Scripts\python.exe"
$repo = "C:\Codex\EoL"
$src = Join-Path $repo "packages\content\base\world\map_assets\first_world_simulator_option2_2026_11_15"
$out = "C:\Users\vagab\OneDrive\Desktop\FirstWorld_Option2_G2E1_Valtherion_Review"
& $py "$repo\scripts\first-world-option2-g2e1-owner-coast-review.py" --self-test
& $py "$repo\scripts\first-world-option2-g2e1-owner-coast-review.py" --source-dir $src --output-dir $out
```

The tool checks the three known SHA-256s before decoding; it rejects output inside an existing Git checkout, inside source directories, or over an already populated report directory. The outputs are two source-derived ROI PNGs and one exact-pixel JSON decision ledger **outside Git**. CI executes the source checks against original Git LFS images and verifies both local pixel counts and held status. The attached owner atlas is a separate contact sheet created from the same original three sources and classifier thresholds; original PNGs are **not** republished.

## Next queue after V1 and V2

Continue **G2-E2** with Dawnreach U-arc, central detached Myridian jellyfish island, northern Myridian island chain, Kaelvar NE island/Shattercap, Serpent's Wake, small unresolved specks and Draemor–Talmyra. Treat the rock neck's owner-approved lore as world design intent, **not** an automatically approved road or deep-draft vessel shortcut. Preserve independent merfolk undersea sovereignty and distinct geography/politics.

**Exit:** source-derived alternatives and review ledger are ready, but real physical island certification and any canonical polygon writes remain held. No C1 branch or active Codex worktree was switched, cleaned or merged.
