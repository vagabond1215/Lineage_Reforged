import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const ledger = JSON.parse(readFileSync(
  new URL("../../docs/design/first-world-option2-g2e1-valtherion-owner-review-2026-11-16.json", import.meta.url), "utf8"));
const audit = readFileSync(
  new URL("../../scripts/first-world-option2-g2e1-owner-coast-review.py", import.meta.url), "utf8");
const workflow = readFileSync(
  new URL("../../.github/workflows/first-world-option2-g2e1-owner-review.yml", import.meta.url), "utf8");

test("G2-E1 owner review must never approve derived islands or routes", () => {
  assert.equal(ledger.status, "DERIVED_COAST_OWNER_REVIEW_READY");
  assert.equal(ledger.schemaVersion, 1);
  assert.equal(ledger.ownerReviewIssues.length, 2);
  assert.deepEqual(ledger.ownerReviewIssues.map(x => x.id),
    ["G2E1_VALTHERION_V1", "G2E1_VALTHERION_V2"]);
  assert.deepEqual(ledger.ownerReviewIssues.map(x => x.ABDisagreementPixelsInReviewWindow), [341, 293]);
  assert.deepEqual(ledger.ownerReviewIssues.map(x => x.BFragmentLandPixelsGlobal), [2916, 3169]);
  for (const issue of ledger.ownerReviewIssues) {
    assert.equal(issue.status, "PENDING_OWNER");
    assert.equal(issue.ownerDecision, null);
    assert.equal(issue.candidateIslandIdentity, "UNASSIGNED_PENDING_OWNER");
    assert.deepEqual(issue.allowableDecisions, ["CONNECTED_LAND", "SEPARATE_ISLAND", "HELD"]);
  }
  assert.ok(Object.values(ledger.holds).every(x => x === false));
  assert.equal(ledger.classifiers.independentSemanticLandMask, false);
});

test("G2-E1 generator guards exact original source and writes evidence only outside Git", () => {
  for (const hash of Object.values(ledger.source.originalSha256)) {
    assert.ok(audit.includes(hash), "the source image hash must be pinned");
  }
  assert.match(audit, /OUTPUT_IN_GIT_CHECKOUT_HOLD/);
  assert.match(audit, /OUTPUT_ALREADY_POPULATED_HOLD/);
  assert.match(audit, /SOURCE_SHA256_HOLD/);
  assert.match(audit, /--self-test/);
  assert.match(audit, /canonicalWritable/);
  assert.match(workflow, /lfs: true/);
  assert.match(workflow, /DERIVED_COAST_OWNER_REVIEW_READY/);
  assert.match(workflow, /ABDisagreementPixelsInWindow/);
  assert.doesNotMatch(audit, /world_maps\.json|regions\.json|world_map_features\.json|\.save/);
});
