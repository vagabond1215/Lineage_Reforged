#!/usr/bin/env python3
"""Read-only 16K First World Option 2 rendered-component audit, not island authority.

Requires numpy and opencv-python-headless.
python scripts/first-world-option2-g2-component-audit.py --self-test
python scripts/first-world-option2-g2-component-audit.py --source-dir PATH_TO_16K_PNGS --output-dir OUTSIDE_GIT
"""
import argparse
import gc
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np

FILES = {
    "State": ("WorldMap_20261115_201735_State.png", "419f48be8991dd682fe5bbce601408ed1832b73e679b104a0c7f082abd6295de"),
    "Height": ("WorldMap_20261115_201753_Height.png", "776bb1dd3d708265741b6433b3152adb098696f60d8bf4ce85205c649bb6d8ce"),
    "Biome": ("WorldMap_20261115_201806_Biome.png", "c6904f0f23c2a7cf7fd880b38a4a9a8fa51f5bb6260605ff53ccd8a20b324fe2"),
}
X0, Y0, X1, Y1 = 240, 240, 16144, 9176
PARENTS = {
    "kaelvar": (13, 109, 0), "valtherion": (170, 0, 255),
    "serathyl": (255, 142, 210), "draemor": (255, 169, 76),
    "talmyra": (120, 87, 0), "myridian_chain": (251, 128, 114),
    "lantern_isles": (255, 208, 0), "serpents_wake": (0, 214, 141),
    "dawnreach_isles": (255, 255, 255),
}
SEEDS = {"draemor": (7428, 6552), "talmyra": (9240, 7436)}
KERNEL = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))

def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(4 * 1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def source_image(directory, layer):
    name, expected = FILES[layer]
    path = directory / name
    if not path.is_file() or sha256(path) != expected:
        raise RuntimeError("G2 SOURCE HOLD: unexpected bytes: " + str(path))
    image = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if image is None or image.shape != (9421, 16384, 3):
        raise RuntimeError("G2 SOURCE HOLD: unexpected PNG shape: " + str(path))
    return image

def exact_ocean(state):
    # Classifier A: State RGB, red==64 and blue==255, green unconstrained.
    area = state[Y0:Y1, X0:X1]
    return (area[:, :, 2] == 64) & (area[:, :, 0] == 255)

def chromatic_ocean(image):
    # Classifier B: broad blue hue from each Biome and Height, NOT native semantics.
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    result = cv2.inRange(hsv, (93, 125, 195), (125, 255, 255)) > 0
    del hsv
    result &= (image[:, :, 0] >= 195) & (image[:, :, 2] <= 135) & (image[:, :, 1] >= 70)
    return result[Y0:Y1, X0:X1].copy()

def component_pass(land, state_sample, classifier, connectivity, erosion):
    working = (cv2.erode(land.astype(np.uint8), KERNEL, iterations=erosion)
               if erosion else land.astype(np.uint8))
    count, labels, stats, centroids = cv2.connectedComponentsWithStats(
        working, connectivity=connectivity, ltype=cv2.CV_32S)
    sizes = stats[1:, cv2.CC_STAT_AREA]
    seed_labels = {key: int(labels[y - Y0, x - X0]) for key, (x, y) in SEEDS.items()}
    connected = (seed_labels["draemor"] != 0 and seed_labels["draemor"] == seed_labels["talmyra"])
    summary = {
        "classifier": classifier, "connectivity": connectivity,
        "erosionCrossIterations": erosion,
        "componentCount": int(count - 1),
        "componentCountAtLeast100Px": int(np.count_nonzero(sizes >= 100)),
        "renderedLandPixels": int(np.count_nonzero(working)),
        "draemorTalmyraConnected": bool(connected),
        "draemorSeedLabel": seed_labels["draemor"], "talmyraSeedLabel": seed_labels["talmyra"],
    }
    records = []
    if erosion == 0:
        # Bounded deterministic sampling of original State exact-fill pixels.
        sample_labels = labels[::4, ::4]
        counts = {}
        for name, (r, g, b) in PARENTS.items():
            pixels = (state_sample[:, :, 0] == b) & (state_sample[:, :, 1] == g) & (state_sample[:, :, 2] == r)
            counts[name] = np.bincount(sample_labels[pixels], minlength=count)
        sample_ids, first = np.unique(sample_labels, return_index=True)
        first_positions = dict(zip(sample_ids.tolist(), first.tolist()))
        sample_width = sample_labels.shape[1]
        eroded = cv2.erode(working, KERNEL, iterations=1)
        perimeter_counts = np.bincount(labels[(working > 0) & (eroded == 0)], minlength=count)
        del eroded
        for idx in range(1, count):
            x, y, w, h, area = [int(z) for z in stats[idx]]
            parent_samples = sorted(
                [{"name": name, "exactStateFillStride4Count": int(counts[name][idx])}
                 for name in PARENTS if counts[name][idx] > 0],
                key=lambda a: -a["exactStateFillStride4Count"])
            pos = first_positions.get(idx)
            seed = [X0 + 4 * (pos % sample_width), Y0 + 4 * (pos // sample_width)] if pos is not None else None
            records.append({
                "ephemeralLabel": idx, "areaPixels": area,
                "bboxFull16kExclusive": [X0 + x, Y0 + y, X0 + x + w, Y0 + y + h],
                "centroidFull16k": [round(float(centroids[idx, 0]) + X0, 1),
                                    round(float(centroids[idx, 1]) + Y0, 1)],
                "sampleGridSeedFull16k": seed,
                "perimeterProxyOnePixelCrossPixels": int(perimeter_counts[idx]),
                "exactStateParentFillSampleEvery4Px": parent_samples,
                "mixedParentCoreSample": sum(
                    p["exactStateFillStride4Count"] >= max(5, round(area / 16 * .005))
                    for p in parent_samples) >= 2,
                "approvedPhysicalIsland": False,
            })
    del labels, stats, centroids
    gc.collect()
    return summary, records

def self_test():
    image = np.zeros((50, 50), np.uint8)
    image[5:20, 5:20] = 1
    image[30:40, 30:40] = 1
    assert cv2.connectedComponents(image, connectivity=4)[0] == 3
    diag = np.zeros((10, 10), np.uint8)
    diag[3, 3] = diag[4, 4] = 1
    assert cv2.connectedComponents(diag, connectivity=4)[0] == 3
    assert cv2.connectedComponents(diag, connectivity=8)[0] == 2
    blue = np.full((60, 60, 3), (255, 126, 64), np.uint8)
    assert np.all((cv2.cvtColor(blue, cv2.COLOR_BGR2HSV)[:, :, 0] >= 93))
    print("PASS synthetic 4/8-connectivity and chromatic ocean witness")

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--self-test", action="store_true")
    ap.add_argument("--source-dir", type=Path)
    ap.add_argument("--output-dir", type=Path)
    args = ap.parse_args()
    if args.self_test:
        return self_test()
    if not args.source_dir or not args.output_dir:
        ap.error("--source-dir and --output-dir are required")
    source = args.source_dir.resolve()
    output = args.output_dir.resolve()
    if output == source or source in output.parents:
        raise RuntimeError("G2 OUTPUT HOLD: output inside source directory")
    if any((parent / ".git").exists() for parent in (output, *output.parents)):
        raise RuntimeError("G2 OUTPUT HOLD: output must be outside any Git checkout")
    # Fail closed on each 16K source before any report is written.
    for name, (filename, expected) in FILES.items():
        path = source / filename
        if not path.is_file() or sha256(path) != expected:
            raise RuntimeError(f"G2 SOURCE HOLD: {name} SHA-256 mismatch")
    print("G2 native source hash readback PASS", flush=True)
    votes = []
    for layer in ("Biome", "Height"):
        im = source_image(source, layer)
        votes.append(chromatic_ocean(im))
        del im
        gc.collect()
    layer_disagreements = int(np.count_nonzero(votes[0] != votes[1]))
    b_ocean = votes[0] & votes[1]
    del votes
    state = source_image(source, "State")
    a_ocean = exact_ocean(state)
    state_sample = np.ascontiguousarray(state[Y0:Y1:4, X0:X1:4])
    del state
    gc.collect()
    observations = []
    ledgers = {}
    for name, water in (("A_exact_state_ocean", a_ocean), ("B_dual_layer_chromatic", b_ocean)):
        land = ~water
        for connectivity in (4, 8):
            print("G2 labeling", name, connectivity, flush=True)
            s, records = component_pass(land, state_sample, name, connectivity, 0)
            observations.append(s)
            ledgers[name + "_C" + str(connectivity)] = records
        for erosion in (1, 2, 3):
            s, _ = component_pass(land, state_sample, name, 4, erosion)
            observations.append(s)
    output.mkdir(parents=True, exist_ok=True)
    report = {
        "schemaVersion": 1, "status": "G2_AMBIGUITY_HELD",
        "sourceHashes": {layer: sha for layer, (_, sha) in FILES.items()},
        "fullImageSize": [16384, 9421], "cropFullExclusive": [X0, Y0, X1, Y1],
        "classifierA": "State rendered RGB red 64 blue 255",
        "classifierB": "Biome/Height shared-render HSV blue spectral consensus, NOT native semantic terrain",
        "renderedOceanPixelsA": int(np.count_nonzero(a_ocean)),
        "renderedOceanPixelsB": int(np.count_nonzero(b_ocean)),
        "ABDisagreementPixels": int(np.count_nonzero(a_ocean != b_ocean)),
        "BiomeHeightBlueVoteDisagreementPixels": layer_disagreements,
        "sensitivity": observations, "canonicalWritable": False,
        "simulatorMeshRecovered": False, "islandOwnershipApproved": False,
        "tidalPassageWidthApproved": False, "routeApproved": False,
    }
    (output / "g2_component_audit_summary.json").write_text(json.dumps(report, indent=2) + "\n")
    (output / "g2_component_ledger.json").write_text(json.dumps({
        "status": "SOURCE_ONLY_NONCANONICAL", "sourceHashes": report["sourceHashes"],
        "records": ledgers}, indent=2) + "\n")
    print(json.dumps({"status": report["status"],
                      "ABDisagreementPixels": report["ABDisagreementPixels"],
                      "sensitivity": observations}, indent=2), flush=True)

if __name__ == "__main__":
    main()
