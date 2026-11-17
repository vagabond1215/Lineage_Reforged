import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const evidence = JSON.parse(readFileSync(
  new URL("../../docs/design/first-world-option2-g2e2-seven-site-source-review-2026-11-16.json", import.meta.url), "utf8"));
const script = readFileSync(
  new URL("../../scripts/first-world-option2-g2e2-source-review.py", import.meta.url), "utf8");
const ci = readFileSync(
  new URL("../../.github/workflows/first-world-option2-g2e2-source-review.yml", import.meta.url), "utf8");

test("Seven original-source review windows and exact masks are noncanonical", () => {
  assert.equal(evidence.schemaVersion, 1);
  assert.equal(evidence.status, "G2E2_SOURCE_RENDER_REVIEW_READY_OWNER_DECISIONS_PENDING");
  assert.deepEqual(evidence.sources.fullResolutionPx, [16384, 9421]);
  assert.equal(evidence.sources.renderMasksIndependentlyGrounded, false);
  assert.equal(evidence.sources.sourceToAuthoredReferenceApproved, false);
  assert.equal(evidence.sources.nativeVoronoiRecovered, false);
  assert.equal(evidence.reviewItems.length, 7);
  const differences = [286, 83, 47, 60, 73, 53, 39];
  assert.deepEqual(evidence.reviewItems.map(i => i.ABDisagreementPixels), differences);
  assert.equal(differences.reduce((a, b) => a + b, 0), 641);
  assert.deepEqual(evidence.reviewItems.map(i => i.ALandCandidatePixels),
    [508993, 549280, 243713, 285718, 197554, 183088, 245503]);
  assert.deepEqual(evidence.reviewItems.map(i => i.BLandCandidatePixels),
    [508707, 549197, 243666, 285658, 197481, 183035, 245464]);
  const ids = new Set(evidence.reviewItems.map(i => i.reviewId));
  assert.equal(ids.size, 7);
  for (const item of evidence.reviewItems) {
    assert.equal(item.ownerDecision, null);
    assert.equal(item.ownerReviewStatus, "PENDING_OWNER");
    assert.equal(item.BOnlyRenderedLandPixels, 0);
    assert.equal(item.AOnlyRenderedLandPixels, item.ABDisagreementPixels);
    assert.equal(item.permanentPhysicalIslandId, null);
    assert.equal(item.childRegionPolygonsApproved, false);
    assert.equal(item.politicalSovereigntyInferred, false);
    assert.equal(item.traversableRouteAuthorized, false);
    const [x0, y0, x1, y1] = item.sourceBBoxFull16kExclusive;
    assert.ok(x0 >= 240 && y0 >= 240 && x1 <= 16144 && y1 <= 9176 && x0 < x1 && y0 < y1);
  }
  assert.equal(evidence.holds.canonicalWritable, false);
  assert.equal(evidence.holds.travelRoutesPublished, false);
  assert.equal(evidence.holds.allSevenOwnerDecisionsUnselected, true);
});

test("G2-E2 runner pins immutable image SHA, refuses checkout writes, and presents visual-only halos", () => {
  for (const sha of Object.values(evidence.sources.hashSha256))
    assert.ok(script.includes(sha));
  assert.match(script, /G2E2_ORIGINAL_SHA256_HELD/);
  assert.match(script, /G2E2_OUTPUT_IN_REPOSITORY_HELD/);
  assert.match(script, /G2E2_OUTPUT_NOT_EMPTY_HELD/);
  assert.match(script, /differenceHaloIsVisualOnly/);
  assert.match(script, /--self-test/);
  assert.match(ci, /lfs: true/);
  assert.match(ci, /G2E2_SOURCE_RENDER_REVIEW_READY_OWNER_DECISIONS_PENDING/);
  assert.match(ci, /ABDisagreementPixels/);
  assert.doesNotMatch(script, /world_maps\.json|world_map_features\.json|regions\.json|\.save/);
});
