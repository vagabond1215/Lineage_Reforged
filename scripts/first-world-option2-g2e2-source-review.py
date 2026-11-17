#!/usr/bin/env python3
"""G2-E2 read-only original 16K source review: 7 whole-island and tidal-neck ROIs.

This tool audits the visible simulator rendering, not underlying terrain cells,
recovered Voronoi polygons, sovereign claims, stable island identities or routes.
Outputs must be outside the repository and original source directory.
Requires numpy and opencv-python-headless.
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
# Original full 16K-source pixel rectangles [left,top,right,bottom), not 2048 reference space.
# Their placement comes from G2 source component bounding boxes, NOT administrative seams.
ROIS = [
    ("DAWNREACH_U_ARC", "Dawnreach Isles", (6150, 710, 8040, 2350), "COLD_CHAIN_WHOLE_ISLANDS", "Northern white U-arc, mixed neighboring Myridian candidates"),
    ("MYRIDIAN_NORTH", "Myridian Chain", (5180, 1340, 6980, 2910), "NORTHERN_CHAIN_MEMBERSHIP", "Northern red island groups adjacent to Dawnreach; parent identity not sovereignty"),
    ("MYRIDIAN_DETACHED_CENTER", "Myridian Chain", (7080, 3230, 7960, 4510), "CENTER_ISLAND_OUTLINE", "Detached jellyfish-shaped center island and surrounding ocean"),
    ("KAELVAR_NE_ISLAND", "Kaelvar", (3910, 1020, 5190, 1850), "NE_WHOLE_ISLAND_SHATTERCAP_HOLD", "Kaelvar NE candidate; Shattercap and Coast 40 ownership held"),
    ("SERPENTS_NORTH", "Serpent's Wake", (13910, 3760, 14970, 5810), "NORTHERN_CHAIN_COAST", "Northern serpentine teal candidate, maritime passage unapproved"),
    ("SERPENTS_SOUTH", "Serpent's Wake", (13260, 5830, 14590, 7480), "SOUTHERN_CHAIN_MEMBERSHIP", "Southern teal island group with multiple rendered components"),
    ("DRAEMOR_TALMYRA_NECK", "Draemor + Talmyra", (8300, 5740, 9000, 6670), "TIDAL_STONE_NECK", "Source-rendered land continuity, owner lore only, routes held"),
]
STATE_CORES = {
    "Dawnreach Isles": (255, 255, 255),
    "Myridian Chain": (251, 128, 114),
    "Kaelvar": (13, 109, 0),
    "Serpent's Wake": (0, 214, 141),
}
NECK_CORES = {"Draemor": (255, 169, 76), "Talmyra": (120, 87, 0)}


def hash_file(path):
    h = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(4 * 1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def guard_output(source, output):
    if source == output or source in output.parents or output in source.parents:
        raise RuntimeError("G2E2_OUTPUT_SOURCE_OVERLAP_HELD")
    if any((p / ".git").exists() for p in (output, *output.parents)):
        raise RuntimeError("G2E2_OUTPUT_IN_REPOSITORY_HELD")
    if output.exists() and any(output.iterdir()):
        raise RuntimeError("G2E2_OUTPUT_NOT_EMPTY_HELD")


def chromatic_water(bgr):
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    result = cv2.inRange(hsv, (93, 125, 195), (125, 255, 255)) > 0
    result &= ((bgr[:, :, 0] >= 195) & (bgr[:, :, 2] <= 135)
               & (bgr[:, :, 1] >= 70))
    return result


def panel(image, width=295, height=236):
    ih, iw = image.shape[:2]
    scale = min(width / iw, height / ih)
    size = (max(1, round(iw * scale)), max(1, round(ih * scale)))
    method = cv2.INTER_AREA if scale < 1 else cv2.INTER_NEAREST
    result = cv2.resize(image, size, interpolation=method)
    canvas = np.full((height, width, 3), (31, 29, 23), np.uint8)
    x, y = (width - result.shape[1]) // 2, (height - result.shape[0]) // 2
    canvas[y:y+result.shape[0], x:x+result.shape[1]] = result
    return canvas


def mask_image(land, uncertain, highlight=False):
    result = np.zeros((*land.shape, 3), np.uint8)
    result[~land] = (187, 101, 46)
    result[land] = (210, 218, 225)
    if highlight:
        # Enlarged halo is a visual cue ONLY. All numerical counts use raw exact pixels.
        halo = cv2.dilate(uncertain.astype(np.uint8), np.ones((17, 17), np.uint8)) > 0
        result[halo] = (18, 111, 183)
        result[uncertain] = (54, 94, 255)
    return result


def montage(key, layers, a, b, difference):
    captions = [
        "ORIGINAL STATE", "ORIGINAL HEIGHT", "ORIGINAL BIOME",
        "RENDER MASK A", "RENDER MASK B", "A/B DIFFERENCE (HALO)"
    ]
    sources = [layers[x] for x in ("State", "Height", "Biome")]
    sources += [mask_image(a, difference), mask_image(b, difference),
                mask_image(a & b, difference, True)]
    canvas = np.full((622, 943, 3), (24, 23, 19), np.uint8)
    cv2.putText(canvas, key.replace("_", " "), (17, 39),
                cv2.FONT_HERSHEY_SIMPLEX, 0.68, (240, 240, 238), 1, cv2.LINE_AA)
    for idx, (label, image) in enumerate(zip(captions, sources)):
        r, c = divmod(idx, 3)
        x, y = 17 + 309 * c, 62 + 276 * r
        cv2.putText(canvas, label, (x, y + 13),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.42, (219, 215, 205), 1, cv2.LINE_AA)
        canvas[y+24:y+260, x:x+295] = panel(image)
    return canvas


def coastal_edge_count(land):
    kernel = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))
    edge = cv2.morphologyEx(land.astype(np.uint8), cv2.MORPH_GRADIENT, kernel)
    return int(np.count_nonzero(edge))


def run(source, output):
    # Fail closed before allocating output files, opening source images or touching saves.
    for layer, (name, expected) in SOURCES.items():
        path = source / name
        if not path.is_file() or hash_file(path) != expected:
            raise RuntimeError("G2E2_ORIGINAL_SHA256_HELD:" + layer)
    guard_output(source, output)
    crops = {key: {} for key, _, _, _, _ in ROIS}
    for layer, (name, _) in SOURCES.items():
        image = cv2.imread(str(source / name), cv2.IMREAD_COLOR)
        if image is None or image.shape != (9421, 16384, 3):
            raise RuntimeError("G2E2_ORIGINAL_DIMENSIONS_HELD:" + layer)
        for key, _, (x0, y0, x1, y1), _, _ in ROIS:
            crops[key][layer] = image[y0:y1, x0:x1].copy()
        del image
    records = []
    panels = []
    for key, parent, bbox, question, note in ROIS:
        layers = crops[key]
        state = layers["State"]
        ocean_a = (state[:, :, 2] == 64) & (state[:, :, 0] == 255)
        ocean_b = chromatic_water(layers["Height"]) & chromatic_water(layers["Biome"])
        a, b = ~ocean_a, ~ocean_b
        difference = a ^ b
        if np.count_nonzero(b & ~a):
            raise RuntimeError("G2E2_SOURCE_CLASSIFIER_RELATION_HELD:" + key)
        colors = NECK_CORES if key == "DRAEMOR_TALMYRA_NECK" else {
            parent: STATE_CORES[parent]}
        exact_cores = {
            name: int(np.count_nonzero(
                (state[:, :, 2] == rgb[0]) &
                (state[:, :, 1] == rgb[1]) &
                (state[:, :, 0] == rgb[2])))
            for name, rgb in colors.items()
        }
        choices = ([
            "RETAIN_NATURAL_NECK_LORE_PENDING_EXACT_SHORE",
            "REQUEST_NECK_SHORE_REVIEW", "HELD"
        ] if key == "DRAEMOR_TALMYRA_NECK" else [
            "ACCEPT_DERIVED_COAST_CANDIDATE", "REQUEST_BOUNDARY_REVISION", "HELD"])
        records.append({
            "id": "G2E2_" + key, "sourceBBoxFull16kExclusive": list(bbox),
            "candidateGeographicParentOnly": parent,
            "reviewQuestion": question, "reviewNotes": note,
            "windowPixels": int(a.size),
            "AOnlyRenderedLandPixels": int(np.count_nonzero(a & ~b)),
            "BOnlyRenderedLandPixels": int(np.count_nonzero(b & ~a)),
            "ABDisagreementPixels": int(np.count_nonzero(difference)),
            "ALandCandidatePixels": int(np.count_nonzero(a)),
            "BLandCandidatePixels": int(np.count_nonzero(b)),
            "ACoastEdgeProxyPixels": coastal_edge_count(a),
            "BCoastEdgeProxyPixels": coastal_edge_count(b),
            "exactStateCorePixels": exact_cores,
            "ownerDecision": None, "ownerReviewStatus": "PENDING_OWNER",
            "allowedOwnerReview": choices,
            "geographicChildPolygonApproved": False,
            "permanentPhysicalIslandID": None,
            "politicalSovereigntyInferred": False,
            "traversableRouteAuthorized": False,
            "sourceSemanticsIndependent": False
        })
        panels.append((key, montage(key, layers, a, b, difference)))
    report = {
        "schemaVersion": 1,
        "status": "G2E2_SOURCE_RENDER_REVIEW_READY_OWNER_DECISIONS_PENDING",
        "originalFull16kDimensions": [16384, 9421],
        "sourceHashesSha256": {layer: expected for layer, (_, expected) in SOURCES.items()},
        "classifiers": {
            "A": "State RGB red==64 blue==255 ocean",
            "B": "Biome and Height rendered blue HSV H93..125 S>=125 V>=195 plus BGR blue>=195 red<=135 green>=70",
            "semanticallyIndependent": False
        },
        "source16KToAuthoredReferenceApproved": False,
        "nativeVoronoiRecovered": False,
        "islandOwnershipApproved": False,
        "differenceHaloIsVisualOnly": True,
        "canonicalWritable": False,
        "reviewItems": records
    }
    output.mkdir(parents=True, exist_ok=True)
    for key, image in panels:
        if not cv2.imwrite(str(output / (key.lower() + "_panel.png")), image):
            raise RuntimeError("G2E2_EVIDENCE_IMAGE_WRITE_HELD:" + key)
    full_height = len(panels) * (panels[0][1].shape[0] + 12) + 20
    atlas = np.full((full_height, 943, 3), (16, 15, 12), np.uint8)
    y = 10
    for _, image in panels:
        atlas[y:y+image.shape[0], :] = image
        y += image.shape[0] + 12
    if not cv2.imwrite(str(output / "g2e2_seven_site_atlas.png"), atlas):
        raise RuntimeError("G2E2_ATLAS_WRITE_HELD")
    (output / "g2e2_review_ledger.json").write_text(
        json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return report


def self_test():
    blue = np.array([[[255, 126, 64], [0, 0, 0]]], dtype=np.uint8)
    assert chromatic_water(blue).tolist() == [[True, False]]
    dummy = np.zeros((15, 20, 3), np.uint8)
    ones = np.ones((15, 20), dtype=bool)
    zeros = np.zeros((15, 20), dtype=bool)
    image = montage("SYNTHETIC", {"State": dummy, "Height": dummy, "Biome": dummy},
                    ones, ones, zeros)
    assert image.shape == (622, 943, 3)
    assert len(ROIS) == 7 and len(set(x[0] for x in ROIS)) == 7
    assert all(240 <= x0 < x1 <= 16144 and 240 <= y0 < y1 <= 9176
               for _, _, (x0, y0, x1, y1), _, _ in ROIS)
    print("PASS G2-E2 source ROI, six-panel layout and synthetic land-color witness")


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
    report = run(args.source_dir.resolve(), args.output_dir.resolve())
    print(json.dumps({
        "status": report["status"],
        "reviewItems": [
            {k: item[k] for k in (
                "id", "ABDisagreementPixels", "ALandCandidatePixels",
                "BLandCandidatePixels")}
            for item in report["reviewItems"]]
    }, indent=2))


if __name__ == "__main__":
    main()
