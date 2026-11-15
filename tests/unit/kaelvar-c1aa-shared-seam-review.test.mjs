import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reviewSample,validateSharedEdges,loadRelativeReview} from '../../scripts/kaelvar-c1aa-relative-review.mjs';
const ring=pts=>pts.map(([x,y])=>({x,y}));
const a={regionId:'region.a',polygonRing:ring([[0,0],[1,0],[1,1],[0,1]])};
const b={regionId:'region.b',polygonRing:ring([[1,0],[2,0],[2,1],[1,1]])};
const shared=[{regionIds:['region.a','region.b'],sharedChain:[[1,0],[1,1]]}];

test('review-only shared edge has one stable sample owner, independent of scan order',()=>{
 validateSharedEdges([a,b],shared);
 for(const p of [{x:1,y:0},{x:1,y:.5},{x:1,y:1}]){
  assert.deepEqual(reviewSample(p,[b,a],shared),{regionId:'region.a',tie:true});
  assert.deepEqual(reviewSample(p,[a,b],shared),{regionId:'region.a',tie:true});
 }
 assert.equal(reviewSample({x:.9,y:.5},[a,b],shared).regionId,'region.a');
 assert.equal(reviewSample({x:1.1,y:.5},[a,b],shared).regionId,'region.b');
});
test('shared-boundary tie does not excuse a true interior overlap',()=>{
 const overlap={...b,polygonRing:ring([[.5,0],[2,0],[2,1],[.5,1]])};
 assert.throws(()=>reviewSample({x:.75,y:.5},[a,overlap],shared),/interior overlap/);
 assert.throws(()=>validateSharedEdges([a,overlap],[]),/interior polygon overlap/);
});
test('undeclared contact and same-direction shared rings fail closed',()=>{
 assert.throws(()=>reviewSample({x:1,y:.5},[a,b],[]),/undeclared shared boundary/);
 assert.throws(()=>validateSharedEdges([a,{...b,polygonRing:[...b.polygonRing].reverse()}],shared),/opposite directions/);
});
test('shared segment mismatch is not silently snapped into agreement',()=>{
 assert.throws(()=>validateSharedEdges([a,b],[{...shared[0],sharedChain:[[1,0],[1,2]]}]),/opposite directions/);
});
test('candidate envelopes never assign unresolved ink or detached components',()=>{
 for(const physicalLabel of [0,24,51,90])
  assert.deepEqual(reviewSample({x:.5,y:.5},[a,b],shared,physicalLabel),{regionId:null,tie:false});
});
test('original native sources conserve baseline and independently validate both shared seam proposals',()=>{
 const {report:r}=loadRelativeReview();
 assert.deepEqual(r.baseline,{assigned:52449,unassigned:26970,component30:79419,perRegion:[5632,18624,19182,9011]});
 assert.deepEqual(r.scenarios.map(s=>s.changedOriginalComponent30Samples),[387,1359,1746]);
 for(const s of r.scenarios){
  assert.equal(s.assigned+s.unassigned,79419);
  assert.equal(s.detachedClaims,0);assert.equal(s.unresolvedSamplesAssigned,0);
  assert.equal(s.regionalInteriorCollisions,0);assert.equal(s.sourceCoastCrossings,0);
  assert.equal(s.protectedAnchorsPreserved,true);
 }
 assert.equal(r.scenarios[2].unresolvedNewEnvelopeSamples,45);
 assert.equal(r.canonicalWritable,false);assert.equal(r.acceptedC1PChanged,false);
 assert.equal(r.physicalLabelsChanged,0);assert.equal(r.sourcePixelsChanged,0);
});
