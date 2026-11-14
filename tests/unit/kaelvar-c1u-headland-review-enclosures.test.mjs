import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1USpec,buildC1UFeasibility}
 from '../../scripts/lib/kaelvar-c1u-headland-review-enclosures.mjs';
const d='docs/design/';
const read=f=>JSON.parse(readFileSync(new URL('../../'+d+f,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const fixture=()=>({
 s:read('kaelvar-c1u-headland-review-enclosure-feasibility-2026-11-14.json'),
 p:read('kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json'),
 report:{
  status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
  sourceVectorBlob:'9cd6752e9dbca00796e5f7c013066bb0e5a96175',
  originalSourceEdgesConserved:599,sourcePngFingerprintsVerified:true,
  sourceOriginalContourUnmodified:true,
  measurements:{candidateMainlandTerrainCells:79419,
   previewAssignedMainlandTerrainCells:52449,
   remainingUnassignedMainlandTerrainCells:26970,
   detachedPhysicalComponentsClaimed:0,
   perRegion:[5632,18624,19182,9011].map(
    terrainCandidateCells=>({terrainCandidateCells}))},
  holds:{canonicalWritable:false}
 }
});
const check=f=>validateC1USpec(f.s,f.p,f.report);
test('C1-U pins two source-safe but nonpolitical headland review envelopes',()=>{
 const f=fixture();assert.equal(check(f),true);
 assert.deepEqual(f.s.reviewOnlyEnclosures.map(x=>x.id),[
  'DIRECT_CHORD_DIAGNOSTIC',
  'INSET_RETURN_CANDIDATE','COMPACT_RETURN_CANDIDATE']);
 assert.deepEqual(f.s.reviewOnlyEnclosures.map(x=>x.expectedSourceCrossings),[1,0,0]);
 assert.deepEqual(f.s.source.headlandSourceEdgesInclusive,[75,115]);
 assert.deepEqual(f.s.source.headlandSourceVerticesInclusive,[75,116]);
 assert.equal(f.s.reviewOnlyEnclosures[1].expectedRawSampledRingPixels,1709);
 assert.equal(f.s.reviewOnlyEnclosures[2].expectedRawSampledRingPixels,1482);
 assert.equal(f.s.holds.canonicalWritable,false);
 assert.equal(f.s.baseline.headlandSourceArcPoliticalOwner,null);
});
test('C1-U hard-rejects political, water, island and other publication attempts',()=>{
 const changes=[
  f=>f.s.holds.canonicalWritable=true,
  f=>f.s.holds.noHeadlandPoliticalOwnership=false,
  f=>f.s.holds.noShattercapRegionPolygon=false,
  f=>f.s.holds.noDetachedIslandClaims=false,
  f=>f.s.holds.noOriginalSourcePngChanges=false,
  f=>f.s.holds.noOriginalTerrainCandidateReclassification=false,
  f=>f.s.holds.serathylWindwardParent='region.verdant_thalos',
  f=>f.s.holds.noPortsWellsRiversRoutesSaltBasins=false,
  f=>f.s.baseline.deliberatelyUnassigned=26969
 ];
 for(const change of changes){
  const f=fixture();change(f);
  assert.throws(()=>check(f),/C1-U source-feasibility HOLD/);
 }
});
test('C1-U cannot shift coast indices or silently use full Verdant shortcut',()=>{
 const changes=[
  f=>f.s.reviewOnlyEnclosures[1].sourceArc=[76,116],
  f=>f.s.reviewOnlyEnclosures[1].returnWaypoints[0][0]=501,
  f=>f.s.reviewOnlyEnclosures[0].expectedSourceCrossings=0,
  f=>f.s.fullVerdantShortcut.expectedOriginalCoastProperCrossings=0,
  f=>f.s.fullVerdantShortcut.mustBeRejectedForRegionalOverlapWith=null,
  f=>f.s.source.vertices=600,
  f=>f.s.source.originalBiomeSha256='incorrect',
  f=>f.p.ownerReviewDirection.kharuunSourceEdgeIndicesInclusive=[30,59]
 ];
 for(const change of changes){
  const f=fixture();change(f);
  assert.throws(()=>check(f),/C1-U source-feasibility HOLD/);
 }
});
test('C1-U refuses C1-P terrain accounting or source witness drift',()=>{
 const changes=[
  f=>f.report.measurements.previewAssignedMainlandTerrainCells=52450,
  f=>f.report.measurements.perRegion[1].terrainCandidateCells=18625,
  f=>f.report.measurements.detachedPhysicalComponentsClaimed=1,
  f=>f.report.sourcePngFingerprintsVerified=false,
  f=>f.report.originalSourceEdgesConserved=598
 ];
 for(const change of changes){
  const f=fixture();change(f);
  assert.throws(()=>check(f),/C1-U source-feasibility HOLD/);
 }
});
test('Synthetic missing source contour cannot certify a C1-U review enclosure',()=>{
 const f=fixture();
 assert.throws(()=>buildC1UFeasibility({...f,spec:f.s,
  labels:new Uint16Array(2048*1152),
  ownership:new Uint8Array(2048*1152),
  revised:{originalContour:[],regions:[],protectedOffshore:[]},
  selected:{main:{points:[]}}
 }),/C1-U source-feasibility HOLD/);
});
