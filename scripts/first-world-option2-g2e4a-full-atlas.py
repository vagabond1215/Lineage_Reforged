#!/usr/bin/env python3
"""G2-E4a original-LFS full-world REPRESENTATIVE atlas previews, not map authority.

The two land/water masks are non-independent rendered-color hypotheses.
Output remains outside Git, not a simulator mesh, route, resource or canonical map.
"""
import argparse
import gc
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np

ASSETS = {
    "State": ("WorldMap_20261115_201735_State.png", "419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de"),
    "Height": ("WorldMap_20261115_201753_Height.png", "776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce"),
    "Biome": ("WorldMap_20261115_201806_Biome.png", "c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2"),
}
FULL_DIMS = (16384, 9421)
# Candidate frame from earlier source records; 16K->reference registration is HELD.
FRAME = (240, 240, 16144, 9176)
OUTPUT_SIZE = (2048, 1152)
REVIEW = {
    "G2E1_VALTHERION_V1": (8164, 1592, 8223, 1658),
    "G2E1_VALTHERION_V2": (8744, 2391, 8823, 2452),
    "G2E2_DAWNREACH_U_ARC": (6150, 710, 8040, 2350),
    "G2E2_MYRIDIAN_NORTH": (5180, 1340, 6980, 2910),
    "G2E2_MYRIDIAN_DETACHED_CENTER": (7080, 3230, 7960, 4510),
    "G2E2_KAELVAR_NE_ISLAND": (3910, 1020, 5190, 1850),
    "G2E2_SERPENTS_NORTH": (13910, 3760, 14970, 5810),
    "G2E2_SERPENTS_SOUTH": (13260, 5830, 14590, 7480),
    "G2E2_DRAEMOR_TALMYRA_NECK": (8300, 5740, 9000, 6670),
}


def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as fp:
        for chunk in iter(lambda: fp.read(4 * 1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def check_output(source, out):
    if source == out or source in out.parents or out in source.parents:
        raise RuntimeError("G2E4A_OUTPUT_OVERLAPS_SOURCE_HOLD")
    if any((folder / ".git").exists() for folder in (out, *out.parents)):
        raise RuntimeError("G2E4A_OUTPUT_INSIDE_CHECKOUT_HOLD")
    if out.exists() and (not out.is_dir() or any(out.iterdir())):
        raise RuntimeError("G2E4A_OUTPUT_ALREADY_POPULATED_HOLD")


def blue_render_water(bgr):
    """The exact G2-E2 B blue-water classifier, not independently semantic."""
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    blue = cv2.inRange(hsv, (93, 125, 195), (125, 255, 255)) > 0
    blue &= (bgr[:, :, 0] >= 195) & (bgr[:, :, 2] <= 135) & (bgr[:, :, 1] >= 70)
    return blue


def to_view_bbox(rect):
    x0, y0, x1, y1 = rect
    fx0, fy0, fx1, fy1 = FRAME
    ow, oh = OUTPUT_SIZE
    return [round((x0 - fx0) * ow / (fx1 - fx0)), round((y0 - fy0) * oh / (fy1 - fy0)),
            round((x1 - fx0) * ow / (fx1 - fx0)), round((y1 - fy0) * oh / (fy1 - fy0))]


def preview_mask(native_land):
    coverage = cv2.resize(native_land.astype(np.uint8) * 255, OUTPUT_SIZE, interpolation=cv2.INTER_AREA)
    return (coverage >= 128).astype(np.uint8) * 255


def structure(mask):
    """DISPLAY-scale component counters only; NOT original native island IDs."""
    comps, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
    areas = sorted((int(x) for x in stats[1:, cv2.CC_STAT_AREA]), reverse=True)
    contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    holes = sum(int(h[3] >= 0) for h in hierarchy[0]) if hierarchy is not None else 0
    return {"componentInstances": int(comps - 1),
            "componentsAtLeast8Px": sum(x >= 8 for x in areas),
            "enclosedHoleInstances": holes, "largestAreasPx": areas[:12]}, labels, stats


def clarity_mask(detail, protected):
    """Simplify display contours; fail back if notable components are damaged."""
    contours, hier = cv2.findContours(detail, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    candidate = np.zeros_like(detail)
    if hier is not None:
        order = list(range(len(contours)))
        order.sort(key=lambda i: (hier[0][i][3] >= 0, -cv2.contourArea(contours[i])))
        for idx in order:
            cnt = contours[idx]
            approx = cv2.approxPolyDP(cnt, 1.0, True) if len(cnt) >= 3 else cnt
            cv2.drawContours(candidate, [approx], -1, 0 if hier[0][idx][3] >= 0 else 255, thickness=cv2.FILLED)
    candidate[protected > 0] = detail[protected > 0]
    original_stats, original_labels, orig_areas = structure(detail)
    new_stats, new_labels, _ = structure(candidate)
    if original_stats["componentsAtLeast8Px"] != new_stats["componentsAtLeast8Px"]:
        return detail.copy(), "FALLBACK_MAJOR_COMPONENT_COUNT", original_stats
    if original_stats["enclosedHoleInstances"] != new_stats["enclosedHoleInstances"]:
        return detail.copy(), "FALLBACK_HOLE_COUNT", original_stats
    associations = {}
    for label in range(1, len(orig_areas)):
        area = int(orig_areas[label, cv2.CC_STAT_AREA])
        if area < 8:
            continue
        values, counts = np.unique(new_labels[original_labels == label], return_counts=True)
        candidate_labels = [(int(v), int(n)) for v, n in zip(values, counts) if v != 0]
        if not candidate_labels:
            return detail.copy(), "FALLBACK_VANISHED_COMPONENT", original_stats
        dest, retained = max(candidate_labels, key=lambda row: row[1])
        if retained < area * 0.90 or dest in associations:
            return detail.copy(), "FALLBACK_MAJOR_COMPONENT_COLLISION", original_stats
        associations[dest] = label
    return candidate, "SIMPLIFIED_WITH_DISPLAY_COMPONENT_GUARDS", original_stats


def style(state_preview, land, clean=False):
    canvas = state_preview.copy()
    ocean = np.array((231, 144, 70) if clean else (250, 141, 66), dtype=np.uint8)
    canvas[land == 0] = ocean
    if clean:
        neutral = np.full_like(canvas, 205)
        softened = cv2.addWeighted(canvas, 0.84, neutral, 0.16, 0)
        canvas[land > 0] = softened[land > 0]
    outline = cv2.morphologyEx(land, cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8))
    canvas[outline > 0] = (65, 66, 53) if clean else (76, 78, 55)
    return canvas


def produce(source, out, decision_path):
    if not decision_path.is_file():
        raise RuntimeError("G2E4A_NINE_DECISION_LEDGER_MISSING")
    decisions = json.loads(decision_path.read_text(encoding="utf-8"))
    ids = {r["reviewId"] for r in decisions["decisions"] if r.get("ownerSourceReviewChoice")}
    if ids != set(REVIEW) or decisions.get("geometryCertificationCount") != 0:
        raise RuntimeError("G2E4A_OWNER_DECISIONS_INVALID_OR_GEOMETRY_PROMOTED")
    if any(x.get("canonicalWritable") or x.get("routeAuthorization") is not None for x in decisions["decisions"]):
        raise RuntimeError("G2E4A_UNAUTHORIZED_PROMOTION")
    check_output(source, out)
    for key, (filename, expected) in ASSETS.items():
        file = source / filename
        if not file.is_file() or sha256(file) != expected:
            raise RuntimeError("G2E4A_ORIGINAL_SHA256_HOLD:" + key)
    fx0, fy0, fx1, fy1 = FRAME
    state = cv2.imread(str(source / ASSETS["State"][0]), cv2.IMREAD_COLOR)
    if state is None or state.shape != (FULL_DIMS[1], FULL_DIMS[0], 3):
        raise RuntimeError("G2E4A_STATE_DIMENSIONS_HOLD")
    state_preview = cv2.resize(state[fy0:fy1, fx0:fx1], OUTPUT_SIZE, interpolation=cv2.INTER_AREA)
    state_crop = state[fy0:fy1, fx0:fx1]
    ocean_a = (state_crop[:, :, 2] == 64) & (state_crop[:, :, 0] == 255)
    a_display = preview_mask(~ocean_a)
    del state, state_crop
    gc.collect()
    blues = None
    for layer in ("Height", "Biome"):
        original = cv2.imread(str(source / ASSETS[layer][0]), cv2.IMREAD_COLOR)
        if original is None or original.shape != (FULL_DIMS[1], FULL_DIMS[0], 3):
            raise RuntimeError("G2E4A_" + layer.upper() + "_DIMENSIONS_HOLD")
        blue = blue_render_water(original[fy0:fy1, fx0:fx1])
        blues = blue if blues is None else (blues & blue)
        del original, blue
        gc.collect()
    ocean_b = blues
    count_a_only = int(np.count_nonzero(ocean_b & ~ocean_a))
    count_b_only = int(np.count_nonzero(ocean_a & ~ocean_b))
    detail = preview_mask(~ocean_b)
    del ocean_a, ocean_b, blues
    gc.collect()
    protected = np.zeros_like(detail)
    for bbox in REVIEW.values():
        x0, y0, x1, y1 = to_view_bbox(bbox)
        cv2.rectangle(protected, (max(0, x0 - 3), max(0, y0 - 3)),
                      (min(OUTPUT_SIZE[0] - 1, x1 + 3), min(OUTPUT_SIZE[1] - 1, y1 + 3)), 255, -1)
    clean_mask, simplification_status, stats_detail = clarity_mask(detail, protected)
    stats_clean, _, _ = structure(clean_mask)
    detail_image = style(state_preview, detail, False)
    clean_image = style(state_preview, clean_mask, True)
    review_image = clean_image.copy()
    for n, (_, bbox) in enumerate(REVIEW.items(), 1):
        x0, y0, x1, y1 = to_view_bbox(bbox)
        cv2.rectangle(review_image, (x0, y0), (x1, y1), (245, 245, 245), 1)
        cv2.putText(review_image, str(n), (x0, max(15, y0 - 4)), cv2.FONT_HERSHEY_SIMPLEX,
                    0.49, (4, 4, 4), 3, cv2.LINE_AA)
        cv2.putText(review_image, str(n), (x0, max(15, y0 - 4)), cv2.FONT_HERSHEY_SIMPLEX,
                    0.49, (245, 245, 245), 1, cv2.LINE_AA)
    out.mkdir(parents=True, exist_ok=True)
    for name, img in {"shore_detail": detail_image, "atlas_clarity": clean_image,
                      "review_windows": review_image}.items():
        if not cv2.imwrite(str(out / (name + ".png")), img):
            raise RuntimeError("G2E4A_IMAGE_WRITE_FAILED:" + name)
    report = {
        "schemaVersion": 1,
        "status": "G2E4A_ORIGINAL_SOURCE_FULL_WORLD_DISPLAY_CANDIDATES_NOT_CANONICAL",
        "fullResolutionOriginal": list(FULL_DIMS),
        "sourceImageSha256": {k: value[1] for k, value in ASSETS.items()},
        "sourceFull16KPreviewCropExclusive": list(FRAME),
        "previewResolution": list(OUTPUT_SIZE),
        "previewOnlyCoordinateRegistrationApproved": False,
        "nativeSimulatorMeshRecovered": False,
        "classifiersSemanticallyIndependent": False,
        "ownerG2E3DirectionsIncluded": sorted(ids),
        "sourcePixelABDifferenceAOnlyLand": count_a_only,
        "sourcePixelABDifferenceBOnlyLand": count_b_only,
        "ABDifferenceScope": "full cropped 16K source frame, not uncropped image",
        "displayAOnlyLandPixels": int(np.count_nonzero((a_display > 0) & (detail == 0))),
        "displayBOnlyLandPixels": int(np.count_nonzero((a_display == 0) & (detail > 0))),
        "detailDisplayTopology": stats_detail,
        "clarityDisplayTopology": stats_clean,
        "clarityPixelDifferenceCount": int(np.count_nonzero(detail != clean_mask)),
        "simplificationStatus": simplification_status,
        "reviewRectsFull16KAndCandidatePreview": [
            {"id": k, "sourceBBox": list(b), "previewBBox": to_view_bbox(b)} for k, b in REVIEW.items()],
        "majorPhysicalIslandIDsCertified": False,
        "V1TidalFootRouteAuthorized": False,
        "localMapSquaresGenerated": False,
        "politicalSovereigntyApproved": False,
        "ecologyOrResourceSpawnPublished": False,
        "canonicalWritable": False,
    }
    (out / "full_world_atlas_preview_report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return report


def self_test():
    blue = np.array([[[255, 126, 64], [0, 0, 0]]], dtype=np.uint8)
    assert blue_render_water(blue).tolist() == [[True, False]]
    assert len(REVIEW) == 9 and len(set(REVIEW)) == 9
    assert to_view_bbox(FRAME) == [0, 0, *OUTPUT_SIZE]
    sample = np.zeros((96, 128), np.uint8)
    cv2.rectangle(sample, (10, 10), (75, 82), 255, -1)
    cv2.rectangle(sample, (34, 30), (44, 40), 0, -1)
    cv2.circle(sample, (106, 44), 8, 255, -1)
    protected = np.zeros_like(sample)
    result, status, stats = clarity_mask(sample, protected)
    assert result.shape == sample.shape and status.startswith(("FALLBACK", "SIMPLIFIED"))
    assert stats["componentsAtLeast8Px"] == 2 and stats["enclosedHoleInstances"] == 1
    print("PASS G2-E4a rendered blue, crop transform, synthetic display topology guards")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--source-dir", type=Path)
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--owner-ledger", type=Path)
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    if not args.source_dir or not args.output_dir or not args.owner_ledger:
        parser.error("--source-dir --output-dir and --owner-ledger required")
    report = produce(args.source_dir.resolve(), args.output_dir.resolve(), args.owner_ledger.resolve())
    print(json.dumps({k: report[k] for k in ("status", "sourcePixelABDifferenceAOnlyLand",
                                            "sourcePixelABDifferenceBOnlyLand",
                                            "simplificationStatus", "clarityPixelDifferenceCount")}, indent=2))


if __name__ == "__main__":
    main()
