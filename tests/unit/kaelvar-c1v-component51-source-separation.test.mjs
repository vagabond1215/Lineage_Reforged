import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1VContract,buildC1VComponent51Review}
 from '../../scripts/lib/kaelvar-c1v-component51-source-separation.mjs';
const dir='docs/design/';
const read=p=>JSON.parse(readFileSync(new URL('../../'+dir+p,import.meta.url),
 'utf8').replace(/^\uFEFF/,''));
const fixture=()=>({
 s:read('kaelvar-c1v-component51-source-physical-separation-review-2026-11-14.json'),
 u:read('kaelvar-c1u-headland-review-enclosure-feasibility-2026-11-14.json'),
 p:read('kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json'),
 c1uReport:{
  status:'C1U_SOURCE_ARC_REVIEW_ENCLOSURES_PASSED_NO_TERRITORIAL_APPROVAL',
  reviewEnclosures:[
   {id:'DIRECT_CHORD_DIAGNOSTIC'},
   {id:'INSET_RETURN_CANDIDATE',
    sample:{otherOriginalPhysicalComponentsById:{'51':13},
     originalProvisionalRegionPixelCount:0},canonicalWritable:false},
   {id:'COMPACT_RETURN_CANDIDATE',
    sample:{otherOriginalPhysicalComponentsById:{'51':13},
     originalProvisionalRegionPixelCount:0},canonicalWritable:false}
  ],
  preservedC1P:{newRegionCells:0}
 },
 c1pReport:{
  status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
  originalSourceEdgesConserved:599,
  sourcePngFingerprintsVerified:true,
  sourceOriginalContourUnmodified:true,
  measurements:{
   candidateMainlandTerrainCells:79419,
   previewAssignedMainlandTerrainCells:52449,
   remainingUnassignedMainlandTerrainCells:26970,
   detachedPhysicalComponentsClaimed:0,
   perRegion:[5632,18624,19182,9011].map(
    terrainCandidateCells=>({terrainCandidateCells}))
  }
 }
});
const v=x=>validateC1VContract(x.s,x.u,x.p,x.c1uReport,x.c1pReport);
test('C1-V freezes source physical component 51, original window and zero political authority',()=>{
 const x=fixture();assert.equal(v(x),true);
 assert.equal(x.s.study.componentId,51);
 assert.equal(x.s.study.mainlandComponentId,30);
 assert.deepEqual(x.s.study.representativeComponentPixel,{x:466,y:207});
 assert.deepEqual(x.s.study.localWindowInclusive,{minX:440,minY:185,maxX:515,maxY:255});
 assert.deepEqual(x.s.source.reviewedHeadlandEdgesInclusive,[75,115]);
 assert.deepEqual(x.s.immutableHolds.kharuunOptionBEdgesInclusive,[35,58]);
 assert.equal(x.s.immutableHolds.canonicalWritable,false);
 assert.equal(x.s.immutableHolds.shattercapDetachedIslandsUnassigned,true);
 assert.equal(x.s.immutableHolds.component51NotRelabeled,true);
});
test('C1-V refuses island, source or territorial promotion',()=>{
 for(const change of [
  x=>x.s.immutableHolds.headlandUnassigned=false,
  x=>x.s.immutableHolds.canonicalWritable=true,
  x=>x.s.immutableHolds.component51NotRelabeled=false,
  x=>x.s.immutableHolds.originalTerrainLabelsUnchanged=false,
  x=>x.s.immutableHolds.originalSourcePixelsUnchanged=false,
  x=>x.s.immutableHolds.noDetachedPhysicalComponentClaims=false,
  x=>x.s.immutableHolds.largeNortheastIslandUnassigned=false,
  x=>x.s.immutableHolds.shattercapDetachedIslandsUnassigned=false,
  x=>x.s.immutableHolds.serathylWindwardParent='region.verdant_thalos',
  x=>x.s.immutableHolds.coast40Claim='region.verdant_thalos',
  x=>x.s.immutableHolds.noPortsWellsRiversRoutesSaltBasins=false,
  x=>x.s.immutableHolds.newLegacyHexDependencies=1
 ]){
  const x=fixture();change(x);
  assert.throws(()=>v(x),/C1-V original-source HOLD/);
 }
});
test('C1-V fails closed on expanded physical claims, search window or uncertain pixels',()=>{
 for(const change of [
  x=>x.s.study.componentId=30,
  x=>x.s.study.localWindowInclusive.maxX=600,
  x=>x.s.study.hypotheticalScenarioClasses[3].allow.push('water'),
  x=>x.s.study.allowedPoliticalOwnerCodes=[0,1,3],
  x=>x.s.study.forbiddenOtherPhysicalComponentTraversal=false,
  x=>x.s.study.originalLabelZeroRequiredForUncertainPixels=false,
  x=>x.s.study.fourNeighborOnly=false,
  x=>x.s.source.biomeSha256='wrong',
  x=>x.s.source.registeredCrop.x=61
 ]){
  const x=fixture();change(x);
  assert.throws(()=>v(x),/C1-V original-source HOLD/);
 }
});
test('C1-V cannot inherit altered U component, coast or mainland accounting',()=>{
 for(const change of [
  x=>x.c1uReport.reviewEnclosures[2].sample.otherOriginalPhysicalComponentsById['51']=14,
  x=>x.c1uReport.reviewEnclosures[1].sample.originalProvisionalRegionPixelCount=1,
  x=>x.c1uReport.preservedC1P.newRegionCells=1,
  x=>x.c1pReport.sourceOriginalContourUnmodified=false,
  x=>x.c1pReport.measurements.previewAssignedMainlandTerrainCells=52450,
  x=>x.c1pReport.measurements.perRegion[2].terrainCandidateCells=19183,
  x=>x.p.ownerReviewDirection.kharuunSourceEdgeIndicesInclusive=[30,59]
 ]){
  const x=fixture();change(x);
  assert.throws(()=>v(x),/C1-V original-source HOLD/);
 }
});
test('C1-V missing original image pair or terrain labels cannot produce physical evidence',()=>{
 const x=fixture();
 assert.throws(()=>buildC1VComponent51Review({
  spec:x.s,c1uSpec:x.u,p:x.p,c1uReport:x.c1uReport,c1pReport:x.c1pReport,
  labels:new Uint16Array(2048*1152),ownership:new Uint8Array(2048*1152),
  revised:{originalContour:[],protectedOffshore:[]}
 }),/C1-V original-source HOLD/);
});
