#!/usr/bin/env python3
"""G2-C native 16K A/B rendered-land component crosswalk, SOURCE_ONLY.

Never certifies physical island IDs or simulator-native terrain semantics.
Run with --self-test or --source-dir ORIGINAL_LFS_DIRECTORY --output-dir OUTSIDE_GIT.
Requires numpy and opencv-python-headless. Does not read or decode game saves.
"""
import argparse
import gc
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
X0, Y0, X1, Y1 = 240, 240, 16144, 9176


def file_hash(path):
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for data in iter(lambda: stream.read(4 * 1024 * 1024), b""):
            h.update(data)
    return h.hexdigest()


def read_source(directory, layer):
    filename, expected = SOURCES[layer]
    path = directory / filename
    if not path.is_file() or file_hash(path) != expected:
        raise RuntimeError("SOURCE_SHA256_HOLD: " + layer)
    image = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if image is None or image.shape != (9421, 16384, 3):
        raise RuntimeError("SOURCE_PNG_DIMENSION_HOLD: " + layer)
    return image


def blue_from_render(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    water = cv2.inRange(hsv, (93, 125, 195), (125, 255, 255)) > 0
    del hsv
    water &= ((image[:, :, 0] >= 195) & (image[:, :, 2] <= 135)
              & (image[:, :, 1] >= 70))
    return water[Y0:Y1, X0:X1].copy()


def crosswalk(a_land, b_land, connectivity):
    na, aa, astats, _ = cv2.connectedComponentsWithStats(
        a_land.astype(np.uint8), connectivity=connectivity, ltype=cv2.CV_32S)
    nb, bb, bstats, _ = cv2.connectedComponentsWithStats(
        b_land.astype(np.uint8), connectivity=connectivity, ltype=cv2.CV_32S)
    counts = np.zeros((na, nb), dtype=np.int64)
    for y in range(0, aa.shape[0], 256):
        al, bl = aa[y:y+256], bb[y:y+256]
        jointly_land = (al > 0) & (bl > 0)
        codes = al[jointly_land].astype(np.int64) * nb + bl[jointly_land]
        counts += np.bincount(codes, minlength=na*nb).reshape(na, nb)
    areas = astats[:, cv2.CC_STAT_AREA].astype(np.int64)
    b_areas = bstats[:, cv2.CC_STAT_AREA].astype(np.int64)
    ac = np.count_nonzero(counts[1:, 1:], axis=1)
    bc = np.count_nonzero(counts[1:, 1:], axis=0)
    splits = []
    records = []
    stable_count, stable_area = 0, 0
    for i in range(1, na):
        matches = np.flatnonzero(counts[i, 1:]) + 1
        parts = [{
            "ephemeralB": int(j),
            "overlapPixels": int(counts[i, j]),
            "retentionFractionA": round(float(counts[i, j] / areas[i]), 8),
            "retentionFractionB": round(float(counts[i, j] / b_areas[j]), 8),
        } for j in matches]
        x, y, w, h = (int(q) for q in astats[i, :4])
        bbox = [X0+x, Y0+y, X0+x+w, Y0+y+h]
        stable = (len(parts) == 1 and int(bc[int(matches[0])-1]) == 1
                  and parts[0]["retentionFractionA"] >= 0.99
                  and parts[0]["retentionFractionB"] >= 0.99)
        if stable:
            stable_count += 1
            stable_area += int(areas[i])
        row = {
            "ephemeralA": i, "areaAPixels": int(areas[i]),
            "bboxFull16kExclusive": bbox, "matchedB": parts,
            "renderedOneToOne99Pct": bool(stable),
            "physicalIslandIdentity": "HELD",
            "canonicalWritable": False
        }
        records.append(row)
        if len(matches) > 1:
            splits.append(row)
    summary = {
        "connectivity": connectivity, "AComponents": na-1, "BComponents": nb-1,
        "AUnmatched": int(np.count_nonzero(ac == 0)),
        "BUnmatched": int(np.count_nonzero(bc == 0)),
        "ASplit": int(np.count_nonzero(ac > 1)),
        "BFuse": int(np.count_nonzero(bc > 1)),
        "AStable99PctOneToOne": stable_count,
        "AStableAreaFraction": round(stable_area/int(areas[1:].sum()), 8),
        "splitRecords": splits,
    }
    del aa, bb, astats, bstats, counts
    gc.collect()
    return summary, records


def self_test():
    a = np.zeros((24, 24), np.bool_)
    a[2:16, 2:16] = True
    b = a.copy()
    b[8, 2:16] = False
    metrics, _ = crosswalk(a, b, 4)
    assert metrics["AComponents"] == 1
    assert metrics["BComponents"] == 2
    assert metrics["ASplit"] == 1 and metrics["BFuse"] == 0
    assert metrics["AUnmatched"] == 0 and metrics["BUnmatched"] == 0
    same, _ = crosswalk(a, a, 8)
    assert same["AComponents"] == same["BComponents"] == 1
    assert same["AStable99PctOneToOne"] == 1
    print("PASS synthetic split, no fusion, identical-source correspondence")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path)
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    if not args.source_dir or not args.output_dir:
        parser.error("--source-dir and --output-dir are required")
    src = args.source_dir.resolve()
    out = args.output_dir.resolve()
    if out == src or src in out.parents:
        raise RuntimeError("OUTPUT_IN_SOURCE_HOLD")
    if any((p / ".git").exists() for p in (out, *out.parents)):
        raise RuntimeError("OUTPUT_IN_GIT_HOLD")
    # Validate all 16K bytes before creating any output directory.
    for layer in SOURCES:
        path = src / SOURCES[layer][0]
        if not path.is_file() or file_hash(path) != SOURCES[layer][1]:
            raise RuntimeError("SOURCE_SHA256_HOLD: " + layer)
    state = read_source(src, "State")
    area = state[Y0:Y1, X0:X1]
    water_a = (area[:, :, 2] == 64) & (area[:, :, 0] == 255)
    del state, area
    gc.collect()
    biome = read_source(src, "Biome")
    water_b = blue_from_render(biome)
    del biome
    gc.collect()
    height = read_source(src, "Height")
    water_b &= blue_from_render(height)
    del height
    gc.collect()
    a_land, b_land = ~water_a, ~water_b
    comparison = {
        "sourceCropPixels": int(a_land.size),
        "AOnlyLandPixels": int(np.count_nonzero(a_land & ~b_land)),
        "BOnlyLandPixels": int(np.count_nonzero(b_land & ~a_land)),
        "AlandPixels": int(np.count_nonzero(a_land)),
        "BlandPixels": int(np.count_nonzero(b_land)),
    }
    summary, ledgers = [], {}
    for conn in (4, 8):
        row, records = crosswalk(a_land, b_land, conn)
        summary.append(row)
        ledgers[str(conn)] = records
        print("G2-C native overlap", conn, {k: v for k, v in row.items() if k != "splitRecords"}, flush=True)
    report = {
        "schemaVersion": 1,
        "status": "SEMANTIC_LAND_AUTHORITY_HELD",
        "sourceSha256": {k:v[1] for k,v in SOURCES.items()},
        "cropFullExclusive": [X0,Y0,X1,Y1],
        "comparison": comparison,
        "crosswalks": summary,
        "nativeSemanticLandMaskRecovered": False,
        "realVoronoiRecovered": False,
        "physicalIslandIDApproved": False,
        "canonicalWritable": False,
    }
    out.mkdir(parents=True, exist_ok=True)
    (out / "g2c_crosswalk_summary.json").write_text(json.dumps(report,indent=2)+"\n",encoding="utf8")
    (out / "g2c_crosswalk_ledger.json").write_text(json.dumps({
        "status": "SOURCE_ONLY", "records": ledgers},indent=2)+"\n",encoding="utf8")
    print("G2-C output written outside Git", out, flush=True)


if __name__ == "__main__":
    main()
