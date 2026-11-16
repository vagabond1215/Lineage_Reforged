import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";

const report = JSON.parse(readFileSync(new URL(
  "../../docs/design/first-world-option2-g2c-native-classifier-correspondence-2026-11-16.json", import.meta.url),"utf8"));
const code = readFileSync(new URL(
  "../../scripts/first-world-option2-g2c-crosswalk.py", import.meta.url),"utf8");
const workflow = readFileSync(new URL(
  "../../.github/workflows/first-world-option2-g2c-crosswalk.yml", import.meta.url),"utf8");

test("G2-C geometric correspondence records only one Valtherion render split, with source-land identity held",()=>{
  assert.equal(report.status,"G2C_RENDERED_CORRESPONDENCE_MEASURED_SEMANTIC_LAND_AUTHORITY_HELD");
  assert.deepEqual(report.originalSource.resolution,[16384,9421]);
  assert.deepEqual(report.originalSource.cropFullExclusive,[240,240,16144,9176]);
  assert.equal(report.comparison.aOnlyLandPixels,44716);
  assert.equal(report.comparison.bOnlyLandPixels,0);
  assert.equal(report.comparison.landBsubsetLandA,true);
  assert.equal(report.crosswalk.length,2);
  assert.deepEqual(report.crosswalk.map(x=>[x.connectivity,x.AComponents,x.BComponents,x.ASplit,x.BFuse]),
     [[4,169,171,1,0],[8,161,163,1,0]]);
  assert.deepEqual(report.valtherionCoastSplit.renderedDetachedCandidates.map(x=>x.intersectionPixels),[2916,3169]);
  assert.equal(report.saveProvenance.nativeVoronoiDecoded,false);
  assert.equal(report.saveProvenance.sameNamedFilesVerifiedSameBytes,false);
  assert.equal(report.governance.semanticLandmaskAvailable,false);
  assert.equal(report.governance.physicalIslandIdentityApproved,false);
  assert.equal(report.governance.canonicalWritable,false);
});

test("G2-C reviewer runner uses exact original LFS bytes and refuses repo writes",()=>{
  for(const sha of Object.values(report.originalSource.sha256))
    assert.ok(code.includes(sha));
  assert.match(code,/file_hash\(path\) != SOURCES\[layer\]\[1\]/);
  assert.match(code,/OUTPUT_IN_GIT_HOLD/);
  assert.match(code,/nativeSemanticLandMaskRecovered/);
  assert.match(code,/--self-test/);
  assert.doesNotMatch(code,/world_maps\.json|world_map_features\.json|regions\.json|\.save/);
  assert.match(workflow,/lfs: true/);
  assert.match(workflow,/SEMANTIC_LAND_AUTHORITY_HELD/);
  assert.match(workflow,/AOnlyLandPixels/);
});
