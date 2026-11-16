import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const report = JSON.parse(readFileSync(
  new URL("../../docs/design/first-world-option2-g2-native-physical-component-review-2026-11-16.json", import.meta.url), "utf8"));
const script = readFileSync(
  new URL("../../scripts/first-world-option2-g2-component-audit.py", import.meta.url), "utf8");
const workflow = readFileSync(
  new URL("../../.github/workflows/first-world-option2-g2-native-component-review.yml", import.meta.url), "utf8");

test("G2 source reports two distinct rendered classifiers without inventing semantic land authority", () => {
  assert.equal(report.schemaVersion, 1);
  assert.equal(report.status, "G2_AMBIGUITY_HELD");
  assert.deepEqual(report.sources.dimensions, [16384, 9421]);
  assert.deepEqual(report.sources.cropFullExclusive, [240, 240, 16144, 9176]);
  assert.equal(report.comparison.pixelsInCrop, 142118144);
  assert.equal(report.comparison.classifierAWaterPixels, 106022308);
  assert.equal(report.comparison.classifierBWaterPixels, 106067024);
  assert.equal(report.comparison.classifiersDifferPixels, 44716);
  assert.equal(report.comparison.biomeHeightBlueVoteDisagreements, 0);
  assert.equal(report.sensitivity.length, 10);
  const base = Object.fromEntries(report.sensitivity.filter(x => x.erosionCrossIterations === 0)
    .map(x => [x.classifier + ":" + x.connectivity, x.componentCount]));
  assert.deepEqual(base, {
    "A_exact_state_ocean:4": 169, "A_exact_state_ocean:8": 161,
    "B_dual_layer_chromatic:4": 171, "B_dual_layer_chromatic:8": 163,
  });
  assert.ok(report.sensitivity.every(s => s.draemorTalmyraConnected === true));
  assert.equal(report.mixedLandParent.traversableRouteAuthorized, false);
  assert.equal(report.governance.canonicalWritable, false);
  assert.equal(report.governance.physicalComponentIdentityApproved, false);
  assert.equal(report.governance.secondSemanticWaterClassifierApproved, false);
  assert.equal(report.governance.nativeVoronoiMeshRecovered, false);
});

test("G2 reproducibility tool verifies hashes and refuses in-repository output", () => {
  for (const f of report.sources.files) assert.ok(script.includes(f.sha256));
  assert.match(script, /def self_test\(/);
  assert.match(script, /--source-dir/);
  assert.match(script, /--output-dir/);
  assert.match(script, /sha256\(path\) != expected/);
  assert.match(script, /parent \/ "\.git"/);
  assert.match(script, /canonicalWritable/);
  assert.doesNotMatch(script, /world_maps\.json|regions\.json|world_map_features\.json/);
  assert.match(workflow, /lfs: true/);
  assert.match(workflow, /ABDisagreementPixels/);
  assert.match(workflow, /G2_AMBIGUITY_HELD/);
});
