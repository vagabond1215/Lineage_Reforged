import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1AAReliefContract,buildC1AAReliefPrework}
 from '../../scripts/lib/kaelvar-c1aa-relief-first-prework.mjs';

const read=p=>JSON.parse(readFileSync(
 new URL('../../docs/design/'+p,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const source='9cd6752e9dbca00796e5f7c013066bb0e5a96175';
const biomeHash='9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12';
const elevationHash='02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d';
const ids=[
 'NORTH_VEYRHOLM_SOUTH_TWO','NORTH_KHARUUN_NORTH_TWO',
 'SOUTH_KHARUUN_SOUTH_THREE','SOUTH_VERDANT_NORTH_THREE'
];
function fixture(){
 const spec=read('kaelvar-c1aa-relief-first-regional-seams-prework-2026-11-14.json');
 const prior=read('kaelvar-c1z-two-mainland-seam-reversible-waypoint-options-2026-11-14.json');
 const c1p={
  status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
  sourceVectorBlob:source,sourcePngFingerprintsVerified:true,
  sourceOriginalContourUnmodified:true,originalSourceEdgesConserved:599,
  measurements:{
   candidateMainlandTerrainCells:79419,
   previewAssignedMainlandTerrainCells:52449,
   remainingUnassignedMainlandTerrainCells:26970,
   perRegion:[5632,18624,19182,9011].map(
    terrainCandidateCells=>({terrainCandidateCells})),
   detachedPhysicalComponentsClaimed:0
  },
  holds:{canonicalWritable:false}
 };
 const z={
  status:'C1Z_FOUR_SOURCE_INDEXED_REVERSIBLE_WAYPOINT_TRIALS_CANONICAL_HELD',
  sourceWitness:{
   originalSourceVectorBlob:source,sourceCoastlineEdges:599,
   originalBiomeSha256:biomeHash,originalElevationSha256:elevationHash
  },
  baseline:{politicallyAssigned:52449,unassigned:26970,totalMainland:79419,
   perRegion:[5632,18624,19182,9011]},
  unchanged:{acceptedC1PRegionRingChanges:0,acceptedC1POwnerChanges:0,
   canonicalWritable:false,
   originalKharuunOptionBSourceEdges:[35,58],
   component51Owner:null,northeasternHeadlandOwner:null},
  alternatives:prior.alternatives.map((a,i)=>({
   id:a.id,interfaceId:a.interfaceId,
   status:'VALID_REVERSIBLE_REDUCED_GAP_REVIEW_ONLY',
   editedRegion:a.editedRegion,
   acceptedAsC1PRegion:false,canonicalWritable:false,
   proposedPermanentSourceOrRegionEdit:false,
   originalLocalReturn:[a.original,a.original,a.original],
   proposedLocalReturn:[a.original,a.candidate,a.original],
   originalWaypoint:a.original,trialWaypoint:a.candidate,
   delta:{gained:[30,29,53,54][i],released:0},
   baselineUnassignedGapSamples:i<2?10:15,
   trialUnassignedGapSamples:[8,9,13,12][i]
  }))
 };
 return {spec,c1p,z};
}
const valid=x=>validateC1AAReliefContract(x.spec,x.c1p,x.z);
test('C1-AA retains all three geographic options per seam and never assumes calibrated height',()=>{
 const x=fixture();assert.equal(valid(x),true);
 assert.deepEqual(x.spec.interfaces.flatMap(x=>x.optionIds),
  ['KEEP_C1P_UNCHANGED',...ids.slice(0,2),
   'KEEP_C1P_UNCHANGED',...ids.slice(2)]);
 assert.equal(x.spec.elevationInterpretation.rampCalibration,'UNVERIFIED_COLOR_RAMP');
 assert.equal(x.spec.elevationInterpretation.sourceRGBMeansMeters,false);
 assert.equal(x.spec.elevationInterpretation.automaticRidgeOrWatershedProven,false);
 assert.equal(x.spec.regionalModel.futureFinalizedLandPrimaryRegion,'EXACTLY_ONE');
 assert.equal(x.spec.regionalModel.regionIsPoliticalTerritory,false);
 assert.equal(x.spec.reviewRules.noAutomaticWinner,true);
 assert.equal(x.spec.lockedBaseline.canonicalWritable,false);
});
test('C1-AA refuses spurious elevation claims, mandatory gap closure and new gameplay',()=>{
 for(const change of [
  x=>x.spec.elevationInterpretation.sourceRGBMeansMeters=true,
  x=>x.spec.elevationInterpretation.rampCalibration='CALIBRATED_METERS',
  x=>x.spec.elevationInterpretation.automaticRidgeOrWatershedProven=true,
  x=>x.spec.reviewRules.noAutomaticGapShrinkingPreference=false,
  x=>x.spec.reviewRules.noAutomaticWinner=false,
  x=>x.spec.regionalModel.futureFinalizedLandPrimaryRegion='MULTIPLE',
  x=>x.spec.regionalModel.regionIsPoliticalTerritory=true,
  x=>x.spec.regionalModel.namedBordersOrFencesImplied=true,
  x=>x.spec.lockedBaseline.canonicalWritable=true,
  x=>x.spec.lockedBaseline.newSettlementOrGameplayContent=1,
  x=>x.spec.interfaces[1].optionIds[0]='AUTO_FILL_GAP'
 ]){
  const x=fixture();change(x);
  assert.throws(()=>valid(x),/C1-AA relief-first HOLD/);
 }
});
test('C1-AA rejects loss of source hashes, protected baseline and parent experiment',()=>{
 for(const change of [
  x=>x.spec.parentC1ZHead='wrong',
  x=>x.spec.originalSource.vectorBlob='wrong',
  x=>x.spec.originalSource.biomeSha256='wrong',
  x=>x.spec.originalSource.elevationSha256='wrong',
  x=>x.spec.originalSource.registeredCrop.x=61,
  x=>x.spec.lockedBaseline.kharuunOptionBSourceEdges=[36,58],
  x=>x.spec.lockedBaseline.shattercapIslandClaims=1,
  x=>x.spec.lockedBaseline.component51Owner='region.verdant_thalos',
  x=>x.c1p.measurements.remainingUnassignedMainlandTerrainCells=26969,
  x=>x.z.alternatives[1].canonicalWritable=true,
  x=>x.z.alternatives[2].id='OTHER',
  x=>x.z.alternatives[3].acceptedAsC1PRegion=true
 ]){
  const x=fixture();change(x);
  assert.throws(()=>valid(x),/C1-AA relief-first HOLD/);
 }
});
test('C1-AA makes only original pixel-color witnesses, never numerical altitude',()=>{
 const x=fixture();
 const rgba=new Uint8Array(4096*2355*4);
 const img={width:4096,height:2355,bitDepth:8,colorType:6,rgba};
 const result=buildC1AAReliefPrework({...x,biome:img,elevation:img});
 assert.equal(result.comparedInterfaces.length,2);
 assert.deepEqual(result.comparedInterfaces.map(x=>x.options.length),[3,3]);
 assert.equal(result.conclusions.ownerTopographicDecision,null);
 assert.equal(result.conclusions.noMeasuredElevationOrWatershedClaim,true);
 assert.equal(result.conclusions.noApprovedRegionalRegionGeometryChanges,true);
 assert.equal(result.baseline.acceptedRegionRingsChanged,0);
 assert.ok(result.comparedInterfaces.every(g=>
  g.options.every(o=>o.independentOwnerSelection===false)));
 assert.equal(result.comparedInterfaces[0].options[2].residualUnassignedGapSamples,9);
 assert.equal(result.comparedInterfaces[1].options[2].residualUnassignedGapSamples,12);
 assert.equal(result.comparedInterfaces[1].options[0].topographicRanking,
  'INSUFFICIENT_CALIBRATED_RELIEF');
 assert.equal(result.comparedInterfaces[0].options[1].trialOriginalPairSample.isElevationInMeters,false);
});
