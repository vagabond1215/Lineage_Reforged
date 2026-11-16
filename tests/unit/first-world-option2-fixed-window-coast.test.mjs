import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const summary=JSON.parse(readFileSync(
 new URL('../../docs/design/first-world-option2-fixed-window-coast-audit-2026-11-16.json',import.meta.url),'utf8'));
const script=readFileSync(
 new URL('../../scripts/first-world-option2-fixed-window-audit.py',import.meta.url),'utf8');

test('Option 2 fixed-window provenance preserves noncanonical 18-window review and original ZIP identity',()=>{
 assert.equal(summary.schemaVersion,1);
 assert.equal(summary.status,'PREVIEW_COAST_REVIEW_PASS_GEOMETRY_ADOPTION_HELD');
 assert.equal(summary.archive.sha256,'3ee73eeb11fc1dadaae74e3f2f9b7b89d0b47fba7c43c82e85795d26f52458e2');
 assert.equal(summary.archive.crcCheck,'PASS');
 assert.equal(summary.archive.archiveStoredInRepository,false);
 assert.deepEqual(summary.input.sizePx,[2048,1177]);
 assert.equal(summary.windowMetrics.length,18);
 assert.equal(new Set(summary.windowMetrics.map(w=>w.id)).size,18);
 assert.ok(summary.windowMetrics.every(w=>w.minSymmetricWithin2Px>=0.95&&w.maxSymmetricP95Px<=2));
 assert.deepEqual(summary.outcomes.biome,{informative:18,passed:18});
 assert.deepEqual(summary.outcomes.height,{informative:18,passed:18});
 assert.equal(summary.method.siftKeypointsUsed,false);
 assert.equal(summary.method.manualCertifiedCorrespondence,false);
 assert.equal(summary.method.biomeAndHeightWaterMasksMayShareSameRenderLayer,true);
 assert.equal(summary.outcomes.localWaterColorDifferenceCountUniqueGlobalPixels,false);
 assert.equal(summary.authority.original16kToReferenceTransformApproved,false);
 assert.equal(summary.authority.independentIslandInventoryApproved,false);
 assert.equal(summary.authority.canonicalWritable,false);
 assert.equal(summary.authority.sourceMatchedRealVoronoiMesh,false);
});

test('Option 2 source audit script exposes read-only standalone self-test and external-output guard',()=>{
 assert.match(script,/def self_test\(/);
 assert.match(script,/--self-test/);
 assert.match(script,/EXPECTED_ZIP_SHA256/);
 assert.match(script,/testzip\(/);
 assert.match(script,/repo_root in output.parents/);
 assert.match(script,/\bcanonicalWritable\b/);
 assert.doesNotMatch(script,/unlink\(|write_text\([^\n]*world_maps\.json/);
});
