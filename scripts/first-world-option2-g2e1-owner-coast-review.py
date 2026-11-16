#!/usr/bin/env python3
"""G2-E1 read-only, 16K source-exact coast alternatives for owner review.

NOT a landmask export, simulator Voronoi recovery, certified island inventory,
territorial border, traversable route, or approved geographic polygon.
Requires numpy and opencv-python-headless. Generated files stay OUTSIDE Git.
"""
import argparse
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np

SOURCES = {
    "State": ("WorldMap_20261115_201735_State.png", "419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de"),
    "Height": ("WorldMap_20261115_201753_Height.png", "776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce"),
    "Biome": ("WorldMap_20261115_201806_Biome.png", "c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2"),
}
ISSUES = [
    ("G2E1_VALTHERION_V1", (8164, 1592, 8223, 1658), (8192, 1626), 2916),
    ("G2E1_VALTHERION_V2", (8744, 2391, 8823, 2452), (8780, 2422), 3169),
]

def digest(path):
    sha = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(4 * 1024 * 1024), b""):
            sha.update(chunk)
    return sha.hexdigest()

def safe_output(source, output):
    if output == source or source in output.parents:
        raise RuntimeError("OUTPUT_IN_SOURCE_HOLD")
    if any((p / ".git").exists() for p in (output, *output.parents)):
        raise RuntimeError("OUTPUT_IN_GIT_CHECKOUT_HOLD")
    if output.exists() and any(output.iterdir()):
        raise RuntimeError("OUTPUT_ALREADY_POPULATED_HOLD")

def blue_pixels(bgr):
    """Shared-render blue water, not independent simulator terrain semantics."""
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    blue = cv2.inRange(hsv, (93, 125, 195), (125, 255, 255)) > 0
    blue &= ((bgr[:, :, 0] >= 195) & (bgr[:, :, 2] <= 135) & (bgr[:, :, 1] >= 70))
    return blue

def crop_bbox(bbox, padding=90):
    x0, y0, x1, y1 = bbox
    return (max(240, x0 - padding), max(240, y0 - padding),
            min(16144, x1 + padding), min(9176, y1 + padding))

def panel(bgr):
    """Upscale original native pixels, no interpolation of source classifications."""
    return cv2.resize(bgr, (300, 300), interpolation=cv2.INTER_NEAREST)

def make_mask_view(land, uncertain):
    view = np.zeros((*land.shape, 3), np.uint8)
    view[land] = (210, 224, 224)         # shared rendered land candidate
    view[~land] = (150, 98, 30)         # shared rendered sea candidate
    view[uncertain] = (48, 137, 248)    # orange: A-only rendered land
    return view

def make_contact_sheet(key, crops, a, b):
    uncertain = a & ~b
    diff = make_mask_view(a & b, uncertain)
    pictures = [crops[k] for k in ("State", "Height", "Biome")]
    pictures += [make_mask_view(a, uncertain), make_mask_view(b, uncertain), diff]
    sheet = np.full((377, 1830, 3), (29, 25, 18), np.uint8)
    cv2.putText(sheet, key + "  |  SOURCE RENDER, NOT CANONICAL ISLAND",
                (18, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.68, (239, 238, 230), 1, cv2.LINE_AA)
    names = ["STATE", "HEIGHT", "BIOME", "MASK A", "MASK B", "A/B UNCERTAINTY"]
    for j, (name, img) in enumerate(zip(names, pictures)):
        x = 15 + j * 305
        cv2.putText(sheet, name, (x, 62), cv2.FONT_HERSHEY_SIMPLEX,
                    0.54, (235, 227, 211), 1, cv2.LINE_AA)
        sheet[74:374, x:x+300] = panel(img)
    return sheet

def analyze(source, output):
    for layer, (name, expected) in SOURCES.items():
        path = source / name
        if not path.is_file() or digest(path) != expected:
            raise RuntimeError("SOURCE_SHA256_HOLD:" + layer)
    safe_output(source, output)
    crop_images = {key: {} for key, _, _, _ in ISSUES}
    for layer, (name, _) in SOURCES.items():
        full = cv2.imread(str(source / name), cv2.IMREAD_COLOR)
        if full is None or full.shape != (9421, 16384, 3):
            raise RuntimeError("ORIGINAL_PNG_DIMENSIONS_HOLD:" + layer)
        for key, bbox, _, _ in ISSUES:
            x0, y0, x1, y1 = crop_bbox(bbox)
            crop_images[key][layer] = full[y0:y1, x0:x1].copy()
        del full
    issues = []
    images = []
    for key, bbox, center, b_fragment_area in ISSUES:
        crops = crop_images[key]
        state = crops["State"]
        a_water = (state[:, :, 2] == 64) & (state[:, :, 0] == 255)
        b_water = blue_pixels(crops["Biome"]) & blue_pixels(crops["Height"])
        a = ~a_water
        b = ~b_water
        uncertain = a ^ b
        if not np.any(uncertain) or np.any(b & ~a):
            raise RuntimeError("LOCAL_RENDER_MASK_RELATION_HOLD:" + key)
        roi = crop_bbox(bbox)
        issue = {
            "id": key, "sourceBBoxFull16kExclusive": list(bbox),
            "sourceCropFull16kExclusive": list(roi),
            "centerFull16k": list(center),
            "renderedBFragmentPixelsGlobal": b_fragment_area,
            "ABDisagreementPixelsInWindow": int(np.count_nonzero(uncertain)),
            "AOnlyLandPixelsInWindow": int(np.count_nonzero(a & ~b)),
            "BOnlyLandPixelsInWindow": int(np.count_nonzero(b & ~a)),
            "ownerDecision": None, "status": "PENDING_OWNER",
            "choices": ["CONNECTED_LAND", "SEPARATE_ISLAND", "HELD"],
            "geographicParentCandidate": "Valtherion",
            "physicalIslandCertified": False,
            "sourceIdentity": "OWNER_AUTHORED_DERIVED_CANDIDATE",
            "localMaskIndependence": False,
            "traversableRouteAuthorized": False,
            "politicalSovereigntyInferred": False,
        }
        issues.append(issue)
        images.append((key, make_contact_sheet(key, crops, a, b)))
    report = {
        "schemaVersion": 1, "status": "DERIVED_COAST_OWNER_REVIEW_READY",
        "originalFull16kDimensions": [16384, 9421],
        "sourceHashesSha256": {layer: expected for layer, (_, expected) in SOURCES.items()},
        "sourceAuthority": "Original render, two non-independent render-color water classifiers",
        "nativeVoronoiRecovered": False,
        "canonicalWritable": False,
        "islandIdentityApproved": False,
        "ownerApprovalRecorded": False,
        "issues": issues,
    }
    output.mkdir(parents=True, exist_ok=True)
    for key, image in images:
        if not cv2.imwrite(str(output / (key.lower() + "_source_review.png")), image):
            raise RuntimeError("FAILED_TO_WRITE_EVIDENCE_IMAGE")
    (output / "g2e1_owner_review_ledger.json").write_text(
        json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return report

def self_test():
    synthetic = np.array([[[255, 126, 64], [0, 0, 0]]], np.uint8)
    assert blue_pixels(synthetic).tolist() == [[True, False]]
    assert len(ISSUES) == 2 and len({x[0] for x in ISSUES}) == 2
    assert all(x0 < x1 and y0 < y1
               for _, (x0, y0, x1, y1), _, _ in ISSUES)
    print("PASS G2E1 synthetic blue classifier, review schema and issue coordinates")

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--source-dir", type=Path)
    parser.add_argument("--output-dir", type=Path)
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    if not args.source_dir or not args.output_dir:
        parser.error("--source-dir and --output-dir required")
    r = analyze(args.source_dir.resolve(), args.output_dir.resolve())
    print(json.dumps({
        "status": r["status"],
        "issues": [{"id": x["id"], "ABDisagreementPixelsInWindow": x["ABDisagreementPixelsInWindow"]}
                   for x in r["issues"]]
    }, indent=2))

if __name__ == "__main__":
    main()
