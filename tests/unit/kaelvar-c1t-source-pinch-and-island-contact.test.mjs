import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1TContract,buildC1TReview}
 from '../../scripts/lib/kaelvar-c1t-source-pinch-and-island-contact.mjs';

const read=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),'utf8')
 .replace(/^\uFEFF/,''));
const docs='docs/design/';
const fixture=()=>{
 const t=read(docs+'kaelvar-c1t-teal-pinch-and-detached-component-contact-review-2026-11-14.json');
 const s=read(docs+'kaelvar-c1s-headland-shared-ink-sensitivity-2026-11-14.json');
 const c1s={
  status:'C1S_UNCERTAIN_SHARED_SOURCE_INK_SENSITIVITY_ONLY_CANONICAL_HELD',
  scenarios:[
   {id:'ORIGINAL_SOURCE_PAIR_ONLY',clearance:[{},{},{}]},
   {id:'HYPOTHETICAL_BLACK_ONLY',clearance:[{},{},{}]},
   {id:'HYPOTHETICAL_TEAL_ONLY',clearance:[{},{
    pathSha256:'0cfbc0fac95776681b79b48d9903b73ee4c588a09e9526f268e06b801249c16b'},{}]},
   {id:'HYPOTHETICAL_BLACK_AND_TEAL',clearance:[{},{},{}]},
   {id:'HYPOTHETICAL_ALL_SHARED_NONBLUE',clearance:[{},{},{}]}
  ],
  classification:{
   eligibleUncertainReferenceSamples:{black:2289,teal:173,other:351},
   candidatePixelsAdjacentToOtherOriginalPhysicalComponents:31,
   neighboringOriginalNonMainlandComponentLabels:[51,78,113]},
  paths:{HYPOTHETICAL_TEAL_ONLY:[[],Array.from({length:224},()=>({x:400,y:317})),[]]}
 };
 const c1p={status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
  originalSourceEdgesConserved:599,measurements:{
   perRegion:[5632,18624,19182,9011].map(terrainCandidateCells=>({terrainCandidateCells})),
   previewAssignedMainlandTerrainCells:52449,
   remainingUnassignedMainlandTerrainCells:26970}};
 return {t,s,c1s,c1p};
};
const check=x=>validateC1TContract(x.t,x.s,x.c1s,x.c1p);

test('C1-T has exactly one pinned unresolved teal focus and no canonical ownership',()=>{
 const x=fixture();assert.equal(check(x),true);
 assert.deepEqual(x.t.focus.referencePixel,{x:400,y:317});
 assert.deepEqual(x.t.focus.registeredOriginalSourcePixel,{x:837,y:675});
 assert.deepEqual(x.t.focus.expectedExactSharedRgb,[4,159,169]);
 assert.deepEqual(x.t.sourceAdjacentOtherComponentLabels,[51,78,113]);
 assert.equal(x.t.holds.canonicalWritable,false);
 assert.equal(x.t.holds.headlandUnassigned,true);
 assert.equal(x.t.holds.shattercapDetachedIslandsUnassigned,true);
 assert.equal(x.t.holds.originalTerrainLabelsUnchanged,true);
});
test('C1-T rejects unauthorized geographical promotion',()=>{
 for(const mutate of [
  t=>t.holds.canonicalWritable=true,
  t=>t.holds.headlandUnassigned=false,
  t=>t.holds.shattercapDetachedIslandsUnassigned=false,
  t=>t.holds.largeNortheasternIslandUnassigned=false,
  t=>t.holds.detachedComponentClaims=1,
  t=>t.holds.originalTerrainLabelsUnchanged=false,
  t=>t.holds.regionPolygonsUnchanged=false,
  t=>t.holds.serathylWindwardParent='region.verdant_thalos',
  t=>t.holds.coast40Claim='region.veyrholm_shore',
  t=>t.holds.newPortsWellsRiversRoutesSaltBasins=1
 ]){
  const x=fixture();mutate(x.t);
  assert.throws(()=>check(x),/C1-T source hold/);
 }
});
test('C1-T rejects recolored source, focus relocation or expanded class authority',()=>{
 for(const mutate of [
  t=>t.source.biomeSha256='incorrect',
  t=>t.source.elevationSha256='incorrect',
  t=>t.source.vectorBlob='incorrect',
  t=>t.source.registeredCrop.x=61,
  t=>t.focus.referencePixel.x=401,
  t=>t.focus.expectedExactSharedRgb=[4,159,168],
  t=>t.window.maxX=900,
  t=>t.sensitivityScenarioIds.push('CANONICAL_LAND'),
  t=>t.strictAllowedOwners=[0,1,3],
  t=>t.sourceAdjacentOtherComponentLabels=[51,78]
 ]){
  const x=fixture();mutate(x.t);
  assert.throws(()=>check(x),/C1-T source hold/);
 }
});
test('C1-T refuses changed C1-S pixel classes or altered terrain accounting',()=>{
 for(const mutate of [
  x=>x.c1s.classification.eligibleUncertainReferenceSamples.teal=174,
  x=>x.c1s.classification.candidatePixelsAdjacentToOtherOriginalPhysicalComponents=32,
  x=>x.c1s.scenarios[2].clearance[1].pathSha256='incorrect',
  x=>x.c1p.measurements.perRegion[2].terrainCandidateCells=19183,
  x=>x.c1p.measurements.remainingUnassignedMainlandTerrainCells=26969
 ]){
  const x=fixture();mutate(x);
  assert.throws(()=>check(x),/C1-T source hold/);
 }
});
test('C1-T cannot claim source morphology without original matched PNGs',()=>{
 const x=fixture();
 assert.throws(()=>buildC1TReview({spec:x.t,c1sSpec:x.s,c1s:x.c1s,c1p:x.c1p,
  labels:new Uint16Array(2048*1152),
  ownership:new Uint8Array(2048*1152),
  revised:{originalContour:[]}
 }),/C1-T source hold/);
});
