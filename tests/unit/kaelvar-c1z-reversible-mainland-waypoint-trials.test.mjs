import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1ZContract,buildC1ZReversibleTrials}
 from '../../scripts/lib/kaelvar-c1z-reversible-mainland-waypoint-trials.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../../docs/design/'+p,import.meta.url),
 'utf8').replace(/^\uFEFF/,''));
function fixture(){
 return {
  s:read('kaelvar-c1z-two-mainland-seam-reversible-waypoint-options-2026-11-14.json'),
  p:read('kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json'),
  ySpec:read('kaelvar-c1y-independent-mainland-seam-options-2026-11-14.json'),
  c1p:{
   status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
   sourceVectorBlob:'9cd6752e9dbca00796e5f7c013066bb0e5a96175',
   sourcePngFingerprintsVerified:true,sourceOriginalContourUnmodified:true,
   originalSourceEdgesConserved:599,
   diagnostic:{polygonOwnershipCollisions:0},
   measurements:{
    candidateMainlandTerrainCells:79419,
    previewAssignedMainlandTerrainCells:52449,
    remainingUnassignedMainlandTerrainCells:26970,
    perRegion:[5632,18624,19182,9011].map(
     terrainCandidateCells=>({terrainCandidateCells})),
    detachedPhysicalComponentsClaimed:0
   },
   holds:{canonicalWritable:false}
  },
  yReport:{
   status:'C1Y_STRICT_MAINLAND_GAP_WINDOWS_MEASURED_NO_OWNER_OR_PIXEL_ALLOCATION',
   reviewWindows:[
    {id:'AURIC_KHARUUN_WESTERN_STEPPE'},
    {id:'AURIC_VEYRHOLM_NORTHWEST'},
    {id:'VEYRHOLM_KHARUUN_NORTHERN_INLAND',
     minimumUnassignedIntermediateCells:10,
     pathSha256:'fe195e3afa7ed20105bea1b23d7f32134abaee9152f02cf6c5412bd445bb9860'},
    {id:'KHARUUN_VERDANT_SOUTHERN_TRANSITION',
     minimumUnassignedIntermediateCells:15,
     pathSha256:'5363789bd3854425a2e984ca736bf21518235d0ae91b57cbc209270c9015e577'}
   ],
   frozenC1P:{
    perRegion:[5632,18624,19182,9011],
    originallyAssigned:52449,
    deliberatelyUnassigned:26970,canonicalWritable:false
   }
  }
 };
}
const check=x=>validateC1ZContract(x.s,x.p,x.c1p,x.ySpec,x.yReport);
test('C1-Z freezes exactly four reversible one-waypoint inland experiments',()=>{
 const x=fixture();
 assert.equal(check(x),true);
 assert.deepEqual(x.s.alternatives.map(a=>a.id),[
  'NORTH_VEYRHOLM_SOUTH_TWO','NORTH_KHARUUN_NORTH_TWO',
  'SOUTH_KHARUUN_SOUTH_THREE','SOUTH_VERDANT_NORTH_THREE']);
 assert.deepEqual(x.s.alternatives.map(a=>a.waypointIndex),[3,19,9,6]);
 assert.deepEqual(x.s.alternatives.map(a=>a.original),[
  [284,190],[301,193],[314,320],[320,334]]);
 assert.equal(x.s.trialPolicy.minimumResidualUnassignedPathCells,4);
 assert.equal(x.s.trialPolicy.maximumChangedComponent30CellsPerTrial,250);
 assert.equal(x.s.holds.canonicalWritable,false);
 assert.equal(x.s.holds.acceptedC1PPolygonsUnchanged,true);
});
test('C1-Z rejects source edits, changed Kharuun frontage and wrong waypoint anchors',()=>{
 const bad=[
  x=>x.s.sources.vectorBlob='changed',
  x=>x.s.sources.biomeSha256='changed',
  x=>x.s.sources.elevationSha256='changed',
  x=>x.s.alternatives[1].waypointIndex=20,
  x=>x.s.alternatives[2].original=[314,321],
  x=>x.s.alternatives[0].candidate=[284,230],
  x=>x.s.trialPolicy.maximumChangedComponent30CellsPerTrial=50000,
  x=>x.s.trialPolicy.minimumResidualUnassignedPathCells=0,
  x=>x.p.regions[1].inlandWaypoints[19]=[301,194],
  x=>x.p.ownerReviewDirection.kharuunFrontageOption='A',
  x=>x.c1p.sourceOriginalContourUnmodified=false,
  x=>x.c1p.measurements.previewAssignedMainlandTerrainCells=52450,
  x=>x.yReport.reviewWindows[2].minimumUnassignedIntermediateCells=11
 ];
 for(const edit of bad){
  const x=fixture();edit(x);
  assert.throws(()=>check(x),/C1-Z reversible source HOLD/);
 }
});
test('C1-Z protects eastern headland, detached components, anchors, foreign parent and canon',()=>{
 const bad=[
  x=>x.s.holds.canonicalWritable=true,
  x=>x.s.holds.acceptedC1PPolygonsUnchanged=false,
  x=>x.s.holds.originalTerrainLabelsUnchanged=false,
  x=>x.s.holds.northeasternHeadlandOwner='region.verdant_thalos',
  x=>x.s.holds.component51Owner='region.verdant_thalos',
  x=>x.s.holds.shattercapDetachedIslandsUnassigned=false,
  x=>x.s.holds.largeNortheasternIslandUnassigned=false,
  x=>x.s.holds.verdantSoutheasternPeninsulaAnchorsPreserved=2,
  x=>x.s.holds.veyrholmInteriorExclusionAnchorsPreserved=2,
  x=>x.s.holds.serathylWindwardParent='region.kharuun_drylands',
  x=>x.s.holds.coast40Claim='region.kharuun_drylands',
  x=>x.s.holds.newPortsWellsRiversRoutesSaltBasins=1
 ];
 for(const edit of bad){
  const x=fixture();edit(x);
  assert.throws(()=>check(x),/C1-Z reversible source HOLD/);
 }
});
test('C1-Z refuses missing original source masks and rings rather than fabricating options',()=>{
 const x=fixture();
 assert.throws(()=>buildC1ZReversibleTrials({
  spec:x.s,p:x.p,c1p:x.c1p,ySpec:x.ySpec,yReport:x.yReport,
  labels:new Uint16Array(2048*1152),ownership:new Uint8Array(2048*1152),
  revised:{originalContour:[],regions:[],protectedOffshore:[]}
 }),/C1-Z reversible source HOLD/);
});
