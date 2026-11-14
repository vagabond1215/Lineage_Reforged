import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1XContract,buildC1XPairedGates}
 from '../../scripts/lib/kaelvar-c1x-targeted-attached-tip-feasibility.mjs';
const spec=()=>JSON.parse(readFileSync(new URL('../../docs/design/kaelvar-c1x-targeted-promontory-vs-broad-ink-feasibility-2026-11-14.json',import.meta.url),'utf8').replace(/^\uFEFF/,''));
const fixture=()=>({
 s:spec(),
 w:{
  status:'C1W_ORIGINAL_PAIRED_SOURCE_OWNER_CHOICE_REQUIRED_NO_GEOGRAPHIC_PUBLICATION',
  decision:{ownerApproved:false,selected:null},
  exactBridgeOriginalPixelPairs:[
   {originalTerrainLabel:51,reference:{x:469,y:212}},
   {originalTerrainLabel:0,reference:{x:469,y:213},
    originalPixel:{x:971,y:474},isExactUnresolvedSharedBlack:true},
   {originalTerrainLabel:30,reference:{x:469,y:214}}],
  component51OriginalCellInventory:{total:21,insideMainlandVector:13,
   outsideMainlandVector:8}
 },
 ink:{
  status:'C1S_UNCERTAIN_SHARED_SOURCE_INK_SENSITIVITY_ONLY_CANONICAL_HELD',
  classification:{eligibleUncertainReferenceSamples:{black:2289,teal:173,other:351}},
  scenarios:[
   [true,false,false],[true,false,false],[true,true,false],
   [true,true,true],[true,true,true]
  ].map((a)=>({clearance:a.map(found=>({found}))}))
 },
 pinch:{
  status:'C1T_SOURCE_MICROMORPHOLOGY_AND_DETACHED_RISK_ONLY_NO_REGION_CHANGE',
  detachedContactAudit:{scenarios:[
   {potentialPhysicalContactSamples:0},
   {potentialPhysicalContactSamples:0},
   {potentialPhysicalContactSamples:22,
    potentialPhysicalComponentLabels:[51,78,113]},
   {potentialPhysicalContactSamples:22}
  ]}
 },
 u:{
  status:'C1U_SOURCE_ARC_REVIEW_ENCLOSURES_PASSED_NO_TERRITORIAL_APPROVAL',
  reviewEnclosures:[
   {id:'DIRECT_CHORD_DIAGNOSTIC'},
   {id:'INSET_RETURN_CANDIDATE',
    sample:{otherOriginalPhysicalComponentsById:{'51':13},
     originalProvisionalRegionPixelCount:0},canonicalWritable:false},
   {id:'COMPACT_RETURN_CANDIDATE',
    sample:{otherOriginalPhysicalComponentsById:{'51':13},
     originalProvisionalRegionPixelCount:0},canonicalWritable:false}
  ]
 },
 p:{
  status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
  originalSourceEdgesConserved:599,sourceOriginalContourUnmodified:true,
  sourcePngFingerprintsVerified:true,
  measurements:{candidateMainlandTerrainCells:79419,
   previewAssignedMainlandTerrainCells:52449,
   remainingUnassignedMainlandTerrainCells:26970,
   perRegion:[5632,18624,19182,9011].map(
    terrainCandidateCells=>({terrainCandidateCells})),
   detachedPhysicalComponentsClaimed:0},
  holds:{canonicalWritable:false}
 }
});
const check=f=>validateC1XContract(f.s,f.w,f.ink,f.pinch,f.u,f.p);
test('C1-X has no owner decision and strictly separates one black gap from teal and broad black',()=>{
 const f=fixture();
 assert.equal(check(f),true);
 assert.deepEqual(f.s.investigation.scenarios.map(x=>x.id),[
  'STRICT_ORIGINAL','TARGETED_BLACK_GAP_ONLY','TEAL_ONLY',
  'TEAL_PLUS_TARGETED_BLACK_GAP','BROAD_BLACK_AND_TEAL_WARNING']);
 assert.deepEqual(f.s.investigation.targetBlackGap.reference,[469,213]);
 assert.equal(f.s.investigation.exactTealEligibleSamplesInBoundedSourceWindow,173);
 assert.deepEqual(f.s.pinnedBaseline.broadBlackAndTealPotentialComponentLabels,[51,78,113]);
 assert.equal(f.s.pinnedBaseline.broadBlackAndTealPotentialComponentContactSamples,22);
 assert.equal(f.s.holds.noAutomaticOriginalPhysicalComponentMerge,true);
 assert.equal(f.s.holds.canonicalWritable,false);
 assert.equal(f.s.holds.headlandPoliticalOwner,null);
});
test('C1-X rejects interpretation promotion, canonical writes and coastline/island claims',()=>{
 const bad=[
  x=>x.s.investigation.interpretationNotOwnerApproved=false,
  x=>x.s.holds.noOwnerDecision=false,
  x=>x.s.holds.noAutomaticOriginalPhysicalComponentMerge=false,
  x=>x.s.holds.originalTerrainLabelsUnmodified=false,
  x=>x.s.holds.canonicalWritable=true,
  x=>x.s.holds.shattercapDetachedIslandsUnassigned=false,
  x=>x.s.holds.largeNortheastIslandUnassigned=false,
  x=>x.s.holds.detachedOriginalComponentClaims=1,
  x=>x.s.holds.headlandPoliticalOwner='region.verdant_thalos',
  x=>x.s.holds.kharuunOptionBSourceEdges=[36,58],
  x=>x.s.holds.newPortsWellsRiversRoutesSaltBasins=1,
  x=>x.s.investigation.scenarios[3].broadBlack=true
 ];
 for(const mutate of bad){
  const f=fixture();mutate(f);
  assert.throws(()=>check(f),/C1-X noncanonical HOLD/);
 }
});
test('C1-X rejects original pair source drift, owner selection or inherited risk count change',()=>{
 const bad=[
  x=>x.s.source.biomeSha256='wrong',
  x=>x.s.source.elevationSha256='wrong',
  x=>x.s.source.vectorBlob='wrong',
  x=>x.s.source.registration.crop.x=61,
  x=>x.s.investigation.targetBlackGap.originalPngPixel[0]=972,
  x=>x.s.investigation.territorialRouteWindow.minX=295,
  x=>x.s.investigation.allowedExistingOwnerCodes=[0,1,3],
  x=>x.s.pinnedBaseline.c1pAssigned=52450,
  x=>x.w.decision.ownerApproved=true,
  x=>x.w.decision.selected='COAST_ATTACHED_PROMONTORY',
  x=>x.ink.classification.eligibleUncertainReferenceSamples.teal=174,
  x=>x.ink.scenarios[2].clearance[1].found=false,
  x=>x.pinch.detachedContactAudit.scenarios[2].potentialPhysicalContactSamples=21,
  x=>x.u.reviewEnclosures[1].sample.otherOriginalPhysicalComponentsById['51']=12,
  x=>x.p.measurements.previewAssignedMainlandTerrainCells=52450
 ];
 for(const mutate of bad){
  const f=fixture();mutate(f);
  assert.throws(()=>check(f),/C1-X noncanonical HOLD/);
 }
});
test('C1-X cannot claim a source measurement without original PNGs and masks',()=>{
 const f=fixture();
 assert.throws(()=>buildC1XPairedGates({...f,spec:f.s,
  labels:new Uint16Array(2048*1152),
  ownership:new Uint8Array(2048*1152),
  revised:{originalContour:[]}
 }),/C1-X noncanonical HOLD/);
});
