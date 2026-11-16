#!/usr/bin/env python3
"""Read-only Option 2 preview coastline audit. No political or canonical authority.

Input: original owner ZIP, with 7 previews and 2 receipts.
Output: report and annotated source-State atlas OUTSIDE the repo.
Requires NumPy and opencv-python-headless. --self-test uses synthetic masks.
"""
import argparse
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile

import cv2
import numpy as np

EXPECTED_ZIP_SHA256 = "3ee73eeb11fc1dadaae74e3f2f9b7b89d0b47fba7c43c82e85795d26f52458e2"
WIDTH, HEIGHT, RADIUS = 2048, 1177, 78
# Owner-State-preview review windows, NOT SIFT keypoints or registered landmarks.
WINDOWS = [
    ("kaelvar_west_fjord","Kaelvar",126,261),
    ("kaelvar_north_cap","Kaelvar",347,158),
    ("kaelvar_southeast_cape","Kaelvar",510,466),
    ("dawnreach_northern_arc","Dawnreach Isles",815,201),
    ("myridian_intercontinental_isles","Myridian Chain",606,374),
    ("myridian_detached_island","Myridian Chain",930,472),
    ("valtherion_northern_fjords","Valtherion",1458,111),
    ("valtherion_eastern_cape","Valtherion",1821,374),
    ("valtherion_southern_isles","Valtherion",1483,571),
    ("serathyl_west_coast","Serathyl",406,623),
    ("serathyl_south_spur","Serathyl",658,801),
    ("draemor_west_coast","Draemor",765,872),
    ("draemor_south_tip","Draemor",996,1022),
    ("draemor_talmyra_neck","Draemor/Talmyra",1059,789),
    ("talmyra_south_coast","Talmyra",1187,1025),
    ("lantern_isles_south","Lantern Isles",1307,967),
    ("serpents_wake_north","Serpent's Wake",1780,543),
    ("serpents_wake_south","Serpent's Wake",1711,876),
]


def png_from_zip(archive, basename):
    matches = [n for n in archive.namelist()
               if n == basename or n.endswith("/" + basename)]
    if len(matches) != 1:
        raise ValueError(f"Expected exactly one {basename}; got {len(matches)}")
    image = cv2.imdecode(np.frombuffer(archive.read(matches[0]), np.uint8),
                         cv2.IMREAD_COLOR)
    if image is None or image.shape != (HEIGHT, WIDTH, 3):
        raise ValueError(f"Wrong preview dimensions or encoding: {basename}")
    return image


def ocean(image):
    # Exact rendered-color hypothesis: RGB red 64, blue 255, green unconstrained.
    # Not a semantic simulator water classification.
    return (image[:, :, 2] == 64) & (image[:, :, 0] == 255)


def coast(mask):
    return cv2.morphologyEx(mask.astype(np.uint8),
                            cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8)) > 0


def direction(src, dst):
    if not np.any(src) or not np.any(dst):
        return None
    distances = cv2.distanceTransform((~dst).astype(np.uint8), cv2.DIST_L2, 3)[src]
    return {
        "count": int(distances.size),
        "p95PreviewPx": round(float(np.percentile(distances, 95)), 4),
        "medianPreviewPx": round(float(np.median(distances)), 4),
        "within2PreviewPxFraction": round(float(np.mean(distances <= 2.0)), 6),
    }


def compare(old_water, new_water):
    oe, ne = coast(old_water), coast(new_water)
    n2o, o2n = direction(ne, oe), direction(oe, ne)
    return {
        "oldCoastPixelCount": int(np.count_nonzero(oe)),
        "newCoastPixelCount": int(np.count_nonzero(ne)),
        "newToOld": n2o, "oldToNew": o2n,
        "differencePixelCount": int(np.count_nonzero(old_water != new_water)),
        "informative": (n2o is not None and o2n is not None
                        and min(n2o["count"], o2n["count"]) >= 30),
    }


def evaluate(legacy, new, window):
    _, _, x, y = window
    x0, x1 = max(30, x - RADIUS), min(2018, x + RADIUS)
    y0, y1 = max(30, y - RADIUS), min(1147, y + RADIUS)
    if min(x1 - x0, y1 - y0) < 90:
        raise ValueError("Window outside interior: " + window[0])
    result = compare(ocean(legacy[y0:y1, x0:x1]),
                     ocean(new[y0:y1, x0:x1]))
    result["roiPreviewPxExclusive"] = [x0, y0, x1, y1]
    return result


def atlas(state, target):
    # The actual source preview is the map. All overprints are annotations only.
    panel = np.zeros((1400, 2715, 3), np.uint8)
    panel[:] = (39, 27, 18)
    panel[145:145 + HEIGHT, 30:30 + WIDTH] = state
    white = (244, 245, 250)
    cv2.putText(panel, "FIRST WORLD | OPTION 2", (35, 62),
                cv2.FONT_HERSHEY_SIMPLEX, 1.45, white, 3, cv2.LINE_AA)
    cv2.putText(panel, "NINE GEOGRAPHIC PARENTS - SOURCE-ONLY PLANNING ATLAS", (35, 106),
                cv2.FONT_HERSHEY_SIMPLEX, 0.66, (207, 184, 166), 2, cv2.LINE_AA)
    for index, (_, _, x, y) in enumerate(WINDOWS, 1):
        pt = (x + 30, y + 145)
        cv2.circle(panel, pt, 8, white, -1, cv2.LINE_AA)
        cv2.circle(panel, pt, 9, (47, 42, 30), 2, cv2.LINE_AA)
        cv2.putText(panel, str(index), (pt[0] + 12, pt[1] - 6),
                    cv2.FONT_HERSHEY_SIMPLEX, .58, white, 2, cv2.LINE_AA)
    parents = ["Kaelvar", "Valtherion", "Serathyl", "Draemor", "Talmyra",
               "Myridian Chain", "Lantern Isles", "Serpent's Wake", "Dawnreach Isles"]
    cv2.putText(panel, "GEOGRAPHIC PARENTS", (2110, 204),
                cv2.FONT_HERSHEY_SIMPLEX, .8, white, 2, cv2.LINE_AA)
    for i, name in enumerate(parents):
        cv2.putText(panel, name, (2110, 270 + i * 86),
                    cv2.FONT_HERSHEY_SIMPLEX, .68, white, 2, cv2.LINE_AA)
    cv2.putText(panel, "Colors: geography, NOT government", (2110, 1110),
                cv2.FONT_HERSHEY_SIMPLEX, .5, (162, 217, 255), 1, cv2.LINE_AA)
    cv2.putText(panel, "Circles: review windows, NOT settlements", (2110, 1160),
                cv2.FONT_HERSHEY_SIMPLEX, .46, (162, 217, 255), 1, cv2.LINE_AA)
    cv2.putText(panel, "NO PUBLISHED ROUTES OR NEW REGION BORDERS", (35, 1360),
                cv2.FONT_HERSHEY_SIMPLEX, .77, (162, 217, 255), 2, cv2.LINE_AA)
    if not cv2.imwrite(str(target), panel):
        raise OSError("Could not write atlas: " + str(target))


def self_test():
    original = np.zeros((80, 80), np.bool_)
    original[20:60, 20:60] = True
    identical = compare(original, original)
    assert identical["differencePixelCount"] == 0
    assert identical["newToOld"]["p95PreviewPx"] == 0
    shifted = np.zeros_like(original)
    shifted[20:60, 23:63] = True
    assert compare(original, shifted)["differencePixelCount"] > 0
    assert len(WINDOWS) == len({w[0] for w in WINDOWS}) == 18
    print("PASS synthetic coastal identity, displacement and 18 fixed review windows")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--archive", type=Path)
    ap.add_argument("--output-dir", type=Path)
    ap.add_argument("--self-test", action="store_true")
    args = ap.parse_args()
    if args.self_test:
        return self_test()
    if not args.archive or not args.output_dir:
        ap.error("--archive and --output-dir are required")
    archive_path = args.archive.resolve()
    output = args.output_dir.resolve()
    # No outputs may be written into an actual repository checkout.
    repo_root = Path(__file__).resolve().parent.parent
    if (repo_root / ".git").exists() and (output == repo_root or repo_root in output.parents):
        raise SystemExit("HOLD: --output-dir must be outside the Git repository")
    if not archive_path.is_file():
        raise SystemExit("Archive missing: " + str(archive_path))
    actual = hashlib.sha256(archive_path.read_bytes()).hexdigest()
    if actual != EXPECTED_ZIP_SHA256:
        raise SystemExit("HOLD: unexpected source ZIP SHA-256: " + actual)
    with ZipFile(archive_path) as archive:
        bad = archive.testzip()
        if bad:
            raise SystemExit("HOLD: ZIP CRC failed: " + bad)
        source = {n:png_from_zip(archive, n) for n in
            ("legacy_biome_preview.png", "option2_biome_preview.png",
             "legacy_height_preview.png", "option2_height_preview.png",
             "option2_state_preview.png")}
    rows = []
    for w in WINDOWS:
        rows.append({
            "id": w[0], "geographicParentOnly": w[1],
            "centerPreviewPx": [w[2], w[3]],
            "biome":evaluate(source["legacy_biome_preview.png"],
                             source["option2_biome_preview.png"], w),
            "height":evaluate(source["legacy_height_preview.png"],
                              source["option2_height_preview.png"], w),
        })
    outcomes = {}
    for layer in ("biome", "height"):
        informative = [r[layer] for r in rows if r[layer]["informative"]]
        good = sum(all(x[d]["within2PreviewPxFraction"] >= .95
                       for d in ("newToOld", "oldToNew")) for x in informative)
        outcomes[layer] = {
            "informativeWindows":len(informative),
            "windowsPassingSymmetric95PercentWithin2Px":good,
            "minimumSymmetricWithin2PxFraction":
              min(min(r["newToOld"]["within2PreviewPxFraction"],
                      r["oldToNew"]["within2PreviewPxFraction"]) for r in informative),
        }
    report = {
        "schemaVersion":1, "type":"FIRST_WORLD_OPTION2_PREVIEW_COAST_REVIEW_V1",
        "status":"PREVIEW_COAST_REVIEW_PASS_GEOMETRY_ADOPTION_HELD",
        "archiveSha256":actual, "previewDimensions":[WIDTH, HEIGHT],
        "method":"18 fixed State-preview windows, rendered RGB R=64/B=255 water heuristic; 3x3 morph coast; independent of earlier SIFT matching; NOT manually certified geographic correspondences",
        "outcomes":outcomes, "windows":rows,
        "sourceMatchedVoronoiMesh":False, "canonicalWritable":False,
        "simulatorSaveMatched":False, "originalImagesChanged":False
    }
    output.mkdir(parents=True, exist_ok=True)
    report_file = output / "first_world_option2_fixed_window_coast_audit.json"
    report_file.write_text(json.dumps(report, indent=2) + "\n", encoding="utf8")
    atlas_file = output / "first_world_option2_review_atlas.png"
    atlas(source["option2_state_preview.png"], atlas_file)
    print(json.dumps({"outcomes":outcomes,"report":str(report_file),
                       "atlas":str(atlas_file)}, indent=2))


if __name__ == "__main__":
    main()
