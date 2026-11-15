import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1ABFixedReview,buildC1ABJunctionAudit}
 from '../../scripts/lib/kaelvar-c1ab-shared-seam-junction-audit.mjs';
const read=f=>JSON.parse(readFileSync(
 new URL('../../docs/design/'+f,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const fixture=()=>({
 spec:read('kaelvar-c1aa-relative-relief-shared-seams-2026-11-15.json'),
 p:read('kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json'),
 evidence:read('kaelvar-c1aa-relative-relief-native-evidence-2026-11-15.json')
});
const check=x=>validateC1ABFixedReview(x.spec,x.p,x.evidence);

test('C1-AB pins both owner-provisional shared chains and their four protected original returns',()=>{
 const x=fixture();assert.equal(check(x),true);
 const r=buildC1ABJunctionAudit(x);
 assert.equal(r.status,'C1AB_FOUR_ENDPOINTS_PINNED_GEOGRAPHIC_CONTINUATION_HELD');
 assert.equal(r.reportValidatedAgainstOriginalSource,false);
 assert.equal(r.inspectedSharedSeams.length,2);
 assert.deepEqual(r.inspectedSharedSeams.map(s=>s.sharedEndpoints),
  [[[279,197],[308,185]],[[304,330],[352,333]]]);
 const [north,south]=r.inspectedSharedSeams;
 assert.deepEqual(north.regionJoins[0].beforeFirstSharedEndpoint.priorOriginalWaypoint,[279,202]);
 assert.deepEqual(north.regionJoins[0].afterLastSharedEndpoint.lastSharedPoint,[308,185]);
 assert.equal(north.regionJoins[0].afterLastSharedEndpoint.nextConnectionMayBeCoastArc,true);
 assert.deepEqual(north.regionJoins[1].beforeFirstSharedEndpoint.priorOriginalWaypoint,[321,176]);
 assert.deepEqual(north.regionJoins[1].afterLastSharedEndpoint.nextOriginalWaypoint,[271,194]);
 assert.deepEqual(south.regionJoins[0].beforeFirstSharedEndpoint.priorOriginalWaypoint,[368,308]);
 assert.deepEqual(south.regionJoins[0].afterLastSharedEndpoint.nextOriginalWaypoint,[296,313]);
 assert.deepEqual(south.regionJoins[1].beforeFirstSharedEndpoint.priorOriginalWaypoint,[289,348]);
 assert.deepEqual(south.regionJoins[1].afterLastSharedEndpoint.nextOriginalWaypoint,[382,333]);
 assert.equal(south.endpointContinuityStatus,'NEEDS_WIDER_SOURCE_BACKED_REVIEW');
 assert.equal(r.combinedNoncanonicalCoverage.combinedAssignedCandidateCells,54195);
 assert.equal(r.combinedNoncanonicalCoverage.combinedUnassignedCandidateCells,25224);
 assert.equal(r.boundaryReviewRequirements.noAutomaticTerrainFeatureApproval,true);
 assert.equal(r.boundaryReviewRequirements.noCanonicalWriteOrIslandClaim,true);
});

test('C1-AB refuses altered owner ordinal semantics, save equivalence, and source or held islands',()=>{
 for(const mutation of [
  x=>x.spec.sourceAssumption.ordinalElevation='CREAM_HIGHER',
  x=>x.spec.sourceAssumption.saveMatched=true,
  x=>x.spec.sourceAssumption.numericElevation=true,
  x=>x.spec.canonicalWritable=true,
  x=>x.spec.physicalLabelsChanged=true,
  x=>x.spec.boundaryRule='RANDOM',
  x=>x.spec.holds.pop(),
  x=>x.spec.rejectedInitialNorthPatch.accepted=true,
  x=>x.spec.rejectedSketch.id='PROMOTED',
  x=>x.p.ownerReviewDirection.kharuunFrontageOption='A',
  x=>x.evidence.source.elevation='wrong',
  x=>x.evidence.scenarios[2].changedOriginalComponent30Samples=1747
 ]){
  const x=fixture();mutation(x);
  assert.throws(()=>check(x),/C1-AB shared-seam source HOLD/);
 }
});

test('C1-AB cannot silently change the source-indexed northern or southern shared chain',()=>{
 for(const mutation of [
  x=>x.spec.candidates[0].sharedChain[0][1]=196,
  x=>x.spec.candidates[1].sharedChain[3][0]=353,
  x=>x.spec.candidates[0].changeWindow.minX=269,
  x=>x.spec.candidates[1].replacements[1].reverse=true,
  x=>x.spec.candidates[1].replacements[0].deleteCount=4,
  x=>x.p.regions[1].regionId='region.alternate',
  x=>x.p.sourceVectorBlob='different'
 ]){
  const x=fixture();mutation(x);
  assert.throws(()=>check(x),/C1-AB shared-seam source HOLD/);
 }
});

test('C1-AB requires repeated native source evidence to match accepted noncanonical review',()=>{
 const x=fixture();
 const summary={status:'C1AA_QUALITATIVE_SHARED_SEAMS_PROVISIONAL_NOT_CANONICAL',
  acceptedC1PChanged:false,canonicalWritable:false,
  source:{vectorBlob:x.evidence.source.vectorBlob},
  scenarios:x.evidence.scenarios.map(s=>({
   id:s.id,assigned:s.assigned,unassigned:s.unassigned,
   changedOriginalComponent30Samples:s.changedOriginalComponent30Samples,
   unresolvedNewEnvelopeSamples:s.unresolvedNewEnvelopeSamples,
   sharedEdgeSampleTies:s.sharedEdgeSampleTies
  }))};
 const ok=buildC1ABJunctionAudit({...x,nativeReport:summary});
 assert.equal(ok.reportValidatedAgainstOriginalSource,true);
 summary.scenarios[1].unresolvedNewEnvelopeSamples=12;
 assert.throws(()=>buildC1ABJunctionAudit({...x,nativeReport:summary}),
  /C1-AB shared-seam source HOLD/);
});
