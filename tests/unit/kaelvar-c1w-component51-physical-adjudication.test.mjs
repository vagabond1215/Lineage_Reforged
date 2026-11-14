import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1WContract,buildC1WPhysicalInterpretation}
 from '../../scripts/lib/kaelvar-c1w-component51-physical-adjudication.mjs';

const d='docs/design/';
const read=path=>JSON.parse(readFileSync(new URL('../../'+d+path,import.meta.url),
 'utf8').replace(/^\uFEFF/,''));
const fixtures=()=>({
 spec:read('kaelvar-c1w-component51-physical-interpretation-owner-review-2026-11-14.json'),
 c1vSpec:read('kaelvar-c1v-component51-source-physical-separation-review-2026-11-14.json'),
 c1vReport:{
  status:'C1V_COMPONENT51_INLET_IDENTITY_NATIVE_SOURCE_AUDIT_CANONICAL_HELD',
  component:{
   actualSourceCandidatePixelCount:21,
   originalSourceContourContainedCells:13,
   originalSourceContourOutsideCells:8,
   boundingReferencePixels:{minX:466,minY:206,maxX:470,maxY:212},
   sourceCoastProximity:{sourceEdgeIndex:81,distanceReferencePixels:0},
   originalComponent51Pixels:[]},
  componentBoundary:{
   uniqueAdjacentReferencePixels:18,
   uniqueAdjacentExcludedPixelColorCategories:{
    black:18,teal:0,other:0,sourceBlue:0,otherExcluded:0,invalidAlpha:0},
   originalSourceZeroNeighborSamples:[]},
  localHypotheticalConnectivity:{routeScenarios:[
   {found:false},{found:true,path:[
    {x:469,y:212},{x:469,y:213},{x:469,y:214}]},
   {found:false},{found:true},{found:true}]},
  fixedC1P:{terrainComponentLabelsChanged:0,newPoliticalTerritoryCells:0,canonicalWritable:false}
 },
 c1pReport:{
  status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
  originalSourceEdgesConserved:599,
  sourcePngFingerprintsVerified:true,sourceOriginalContourUnmodified:true,
  measurements:{
   candidateMainlandTerrainCells:79419,
   previewAssignedMainlandTerrainCells:52449,
   remainingUnassignedMainlandTerrainCells:26970,
   perRegion:[5632,18624,19182,9011].map(
    terrainCandidateCells=>({terrainCandidateCells})),
   detachedPhysicalComponentsClaimed:0},
  holds:{canonicalWritable:false}
 }
});
const validate=x=>validateC1WContract(x.spec,x.c1vSpec,x.c1vReport,x.c1pReport);
test('C1-W lists competing physical interpretations without selecting any or publishing canon',()=>{
 const x=fixtures();
 assert.equal(validate(x),true);
 assert.deepEqual(x.spec.interpretations.map(h=>h.id),
  ['COAST_ATTACHED_PROMONTORY','PHYSICALLY_SEPARATE_ISLET',
   'UNRESOLVED_CARTOGRAPHIC_LINEWORK']);
 assert.ok(x.spec.interpretations.every(h=>h.ownerDecision===null&&h.status==='UNDECIDED'));
 assert.equal(x.spec.reviewPolicy.chooseNoAutomaticWinner,true);
 assert.equal(x.spec.reviewPolicy.noApprovalRecorded,true);
 assert.equal(x.spec.reviewPolicy.canonicalWritable,false);
 assert.equal(x.spec.focus.hypotheticalBlackConnectionExists,true);
 assert.equal(x.spec.focus.hypotheticalBlackConnectionCertifiesLand,false);
 assert.deepEqual(x.spec.focus.gapReferencePixel,[469,213]);
 assert.deepEqual(x.spec.focus.gapOriginalPngPixel,[971,474]);
 assert.deepEqual(x.spec.immutableHolds.kharuunOptionBEdges,[35,58]);
});
test('C1-W rejects any implicit owner choice or physical promotion',()=>{
 for(const change of [
  x=>x.spec.interpretations[0].ownerDecision='approved',
  x=>x.spec.interpretations[1].status='ACCEPTED',
  x=>x.spec.interpretations[2].mustNotDo=[],
  x=>x.spec.interpretations.push({...x.spec.interpretations[0]}),
  x=>x.spec.reviewPolicy.chooseNoAutomaticWinner=false,
  x=>x.spec.reviewPolicy.noApprovalRecorded=false,
  x=>x.spec.reviewPolicy.canonicalWritable=true,
  x=>x.spec.reviewPolicy.newlyAssignedPoliticalCells=1,
  x=>x.spec.reviewPolicy.component51NotRelabeled=false,
  x=>x.spec.focus.hypotheticalBlackConnectionCertifiesLand=true,
  x=>x.spec.immutableHolds.component51PoliticalOwner='region.verdant_thalos',
  x=>x.spec.immutableHolds.northeasternHeadlandPoliticalOwner='region.verdant_thalos',
  x=>x.spec.immutableHolds.shattercapDetachedIslandsUnassigned=false,
  x=>x.spec.immutableHolds.largeNortheasternIslandUnassigned=false,
 ]){
  const x=fixtures();change(x);
  assert.throws(()=>validate(x),/C1-W source-owner HOLD/);
 }
});
test('C1-W refuses source, pixel-registration, headland and parent witness changes',()=>{
 for(const change of [
  x=>x.spec.source.originalVectorBlob='wrong',
  x=>x.spec.source.originalBiomePngSha256='wrong',
  x=>x.spec.source.originalElevationPngSha256='wrong',
  x=>x.spec.source.sourceRegistration.crop.x=61,
  x=>x.spec.focus.gapReferencePixel[0]=470,
  x=>x.spec.focus.gapOriginalPngPixel[1]=475,
  x=>x.spec.focus.insideOriginalCoastCellCount=14,
  x=>x.spec.source.componentCrossingSourceEdge=82,
  x=>x.c1vReport.component.actualSourceCandidatePixelCount=22,
  x=>x.c1vReport.componentBoundary.uniqueAdjacentReferencePixels=17,
  x=>x.c1vReport.localHypotheticalConnectivity.routeScenarios[1].path[1].x=470,
  x=>x.c1pReport.measurements.previewAssignedMainlandTerrainCells=52450,
  x=>x.c1pReport.measurements.perRegion[1].terrainCandidateCells=18625,
 ]){
  const x=fixtures();change(x);
  assert.throws(()=>validate(x),/C1-W source-owner HOLD/);
 }
});
test('C1-W cannot produce owner evidence without original registered PNG pair and terrain masks',()=>{
 const x=fixtures();
 assert.throws(()=>buildC1WPhysicalInterpretation({...x,
  labels:new Uint16Array(2048*1152),
  ownership:new Uint8Array(2048*1152),
  revised:{originalContour:[]}}),/C1-W source-owner HOLD/);
});
