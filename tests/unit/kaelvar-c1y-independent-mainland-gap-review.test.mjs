import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {buildC1YMainlandGaps,validateC1YSpec}
 from '../../scripts/lib/kaelvar-c1y-independent-mainland-gap-review.mjs';
const read=f=>JSON.parse(readFileSync(new URL('../../docs/design/'+f,import.meta.url),
 'utf8').replace(/^\uFEFF/,''));
const fixture=()=>({
 s:read('kaelvar-c1y-independent-mainland-seam-options-2026-11-14.json'),
 p:read('kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json'),
 c1pReport:{
  status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
  sourceVectorBlob:'9cd6752e9dbca00796e5f7c013066bb0e5a96175',
  originalSourceEdgesConserved:599,
  sourcePngFingerprintsVerified:true,
  sourceOriginalContourUnmodified:true,
  measurements:{
   candidateMainlandTerrainCells:79419,
   previewAssignedMainlandTerrainCells:52449,
   remainingUnassignedMainlandTerrainCells:26970,
   perRegion:[5632,18624,19182,9011].map(terrainCandidateCells=>({terrainCandidateCells})),
   detachedPhysicalComponentsClaimed:0
  },
  diagnostic:{polygonOwnershipCollisions:0},holds:{canonicalWritable:false}
 }
});
const validate=x=>validateC1YSpec(x.s,x.p,x.c1pReport);
test('C1-Y has five fixed non-headland original mainland seam interfaces',()=>{
 const f=fixture();assert.equal(validate(f),true);
 const ws=f.s.search.windows;
 assert.deepEqual(ws.map(x=>x.id),[
  'AURIC_KHARUUN_WESTERN_STEPPE',
  'AURIC_VEYRHOLM_NORTHWEST',
  'VEYRHOLM_KHARUUN_NORTHERN_INLAND',
  'KHARUUN_VERDANT_SOUTHERN_TRANSITION',
  'AURIC_VERDANT_SOUTHWESTERN_TRANSITION'
 ]);
 assert.ok(ws.every(x=>x.bounds.maxX<455));
 assert.ok(ws.every(x=>x.bounds.minY>=170));
 assert.equal(f.s.acceptedC1P.unassigned,26970);
 assert.deepEqual(f.s.acceptedC1P.kharuunSourceCoastEdgeIndicesInclusive,[35,58]);
 assert.equal(f.s.hold.canonicalWritable,false);
 assert.equal(f.s.hold.noComponent51Owner,true);
 assert.equal(f.s.hold.noNortheastHeadlandOwner,true);
});
test('C1-Y rejects political expansion, island grabs and source alteration',()=>{
 const edits=[
  x=>x.s.hold.canonicalWritable=true,
  x=>x.s.hold.newPoliticalTerritoryCells=1,
  x=>x.s.hold.originalC1PRegionPolygonChanges=1,
  x=>x.s.hold.terrainComponentLabelsChanged=1,
  x=>x.s.hold.noComponent51Owner=false,
  x=>x.s.hold.noNortheastHeadlandOwner=false,
  x=>x.s.hold.shattercapDetachedIslandsUnassigned=false,
  x=>x.s.hold.largeNortheasternIslandUnassigned=false,
  x=>x.s.hold.coast40Claim='region.verdant_thalos',
  x=>x.s.hold.serathylWindwardParent='region.verdant_thalos',
  x=>x.s.hold.portsWellsRiversWaterRoutesSaltBasinsPlaced=1
 ];
 for(const edit of edits){
  const f=fixture();edit(f);
  assert.throws(()=>validate(f),/C1-Y noncanonical source HOLD/);
 }
});
test('C1-Y rejects source, unsafe transit classes and headland window drift',()=>{
 const edits=[
  x=>x.s.source.originalVectorBlob='changed',
  x=>x.s.source.biomeSha256='changed',
  x=>x.s.source.elevationSha256='changed',
  x=>x.s.search.fourNeighborOnly=false,
  x=>x.s.search.allowedTransitTerrainComponent=51,
  x=>x.s.search.transitMustBeUnassigned=false,
  x=>x.s.search.neverIncludeUnresolvedInkOrOtherPhysicalComponents=false,
  x=>x.s.search.windows[2].bounds.maxX=470,
  x=>x.s.search.windows[1].regionB='region.verdant_thalos',
  x=>x.s.reviewModes.push('AUTOMATIC_FILL_GAP'),
  x=>x.s.acceptedC1P.unassigned=26969,
  x=>x.p.ownerReviewDirection.kharuunFrontageOption='A',
  x=>x.c1pReport.measurements.perRegion[2].terrainCandidateCells=19183
 ];
 for(const edit of edits){
  const f=fixture();edit(f);
  assert.throws(()=>validate(f),/C1-Y noncanonical source HOLD/);
 }
});
test('C1-Y rejects absent native original source and cannot synthesize paths',()=>{
 const f=fixture();
 assert.throws(()=>buildC1YMainlandGaps({
  spec:f.s,p:f.p,c1pReport:f.c1pReport,
  labels:new Uint16Array(2048*1152),
  ownership:new Uint8Array(2048*1152),
  revised:{originalContour:[],regions:[],protectedOffshore:[]}
 }),/C1-Y noncanonical source HOLD/);
});
