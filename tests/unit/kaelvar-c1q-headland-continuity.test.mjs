import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1QContract,traceCandidateCorridor}
 from '../../scripts/lib/kaelvar-c1q-headland-continuity.mjs';

const read=path=>JSON.parse(readFileSync(new URL('../../'+path,import.meta.url),'utf8')
 .replace(/^\uFEFF/,''));
const d='docs/design/';
const spec=()=>read(d+'kaelvar-c1q-northeast-headland-options-2026-11-14.json');
const parent=()=>read(d+'kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json');
const ids=['region.auric_marches','region.kharuun_drylands',
 'region.verdant_thalos','region.veyrholm_shore'];
const cells=[5632,18624,19182,9011];
const witness=()=>({
 status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
 originalSourceEdgesConserved:599,sourcePngFingerprintsVerified:true,
 sourceOriginalContourUnmodified:true,
 measurements:{candidateMainlandTerrainCells:79419,
  previewAssignedMainlandTerrainCells:52449,
  remainingUnassignedMainlandTerrainCells:26970,
  perRegion:ids.map((regionId,i)=>({regionId,terrainCandidateCells:cells[i]})),
  detachedPhysicalComponentsClaimed:0},
 diagnostic:{polygonOwnershipCollisions:0},
 holds:{canonicalWritable:false},
});
const valid=()=>validateC1QContract(spec(),parent(),witness());

test('C1-Q has two noncanonical options and exact 75–115 headland source arc',()=>{
 const x=valid(),s=spec();
 assert.deepEqual(s.comparisonOptions.map(x=>x.id),
  ['HOLD_UNASSIGNED','VERDANT_CORRIDOR_EVIDENCE_ONLY']);
 assert.equal(s.headlandSource.startVertex,75);
 assert.equal(s.headlandSource.endVertex,116);
 assert.equal(s.headlandSource.edgeCount,41);
 assert.deepEqual(s.immutableHolds.kharuunOptionBEdges,[35,58]);
 assert.equal(s.immutableHolds.shattercapDetachedIslandsUnclaimed,true);
 assert.equal(s.immutableHolds.canonicalWritable,false);
 assert.equal(x.sampleConnectivity,4);
 assert.deepEqual(x.clearanceChecksPx,[0,1,2]);
});
test('C1-Q refuses any headland or Shattercap political promotion',()=>{
 for(const mutate of [
  c=>c.immutableHolds.northeastHeadlandOwnershipApproved=true,
  c=>c.immutableHolds.shattercapDetachedIslandsUnclaimed=false,
  c=>c.immutableHolds.largeNortheastIslandUnclaimed=false,
  c=>c.immutableHolds.canonicalWritable=true,
  c=>c.immutableHolds.detachedPhysicalComponentsClaimed=1,
  c=>c.immutableHolds.portsPlaced=1,
  c=>c.immutableHolds.newLegacyHexDependencies=1,
  c=>c.comparisonOptions[1].politicalOwnershipApproved=true,
 ]){
  const c=spec();mutate(c);
  assert.throws(()=>validateC1QContract(c,parent(),witness()),/HOLD/);
 }
});
test('C1-Q refuses wrong headland indices, rerouted source anchors and C1-P drift',()=>{
 const a=spec();a.headlandSource.endEdgeInclusive=114;
 assert.throws(()=>validateC1QContract(a,parent(),witness()),/HOLD/);
 const b=spec();b.corridorTest.toHeadland.x=510;
 assert.throws(()=>validateC1QContract(b,parent(),witness()),/HOLD/);
 const c=parent();c.ownerReviewDirection.kharuunFrontageOption='A';
 assert.throws(()=>validateC1QContract(spec(),c,witness()),/HOLD/);
 const r=witness();r.measurements.previewAssignedMainlandTerrainCells=52450;
 assert.throws(()=>validateC1QContract(spec(),parent(),r),/HOLD/);
});
const width=2048,height=1152;
const window={minX:12,maxX:28,minY:12,maxY:28};
const contour=Array.from({length:599},(_,i)=>{
 const t=i*2*Math.PI/599;
 return {x:20+13*Math.cos(t),y:20+13*Math.sin(t)};
});
function synthetic(){
 const labels=new Uint16Array(width*height),owner=new Uint8Array(width*height);
 for(let y=12;y<=28;y++)for(let x=12;x<=28;x++)
  labels[y*width+x]=30;
 const start={x:15,y:15},target={x:25,y:25};
 owner[start.y*width+start.x]=3;
 return {labels,owner,sourceContour:contour,width,height,
  start,target,window};
}
test('Candidate-source 4-neighbor path is deterministic, stays on unclaimed/mainland terrain',()=>{
 const x=synthetic();
 const a=traceCandidateCorridor({...x,clearance:0});
 const b=traceCandidateCorridor({...x,clearance:0});
 assert.equal(a.found,true);
 assert.equal(a.pixelSteps,a.path.length-1);
 assert.equal(a.startIsPermitted,true);
 assert.equal(a.targetIsPermitted,true);
 assert.equal(a.pathSha256,b.pathSha256);
 assert.deepEqual(a.path[0],x.start);
 assert.deepEqual(a.path.at(-1),x.target);
 for(let i=1;i<a.path.length;i++){
  const p=a.path[i-1],q=a.path[i];
  assert.equal(Math.abs(p.x-q.x)+Math.abs(p.y-q.y),1);
  assert.equal(x.labels[q.y*width+q.x],30);
  assert.ok([0,3].includes(x.owner[q.y*width+q.x]));
 }
});
test('A forbidden inland-owner barrier blocks connectivity rather than granting territory',()=>{
 const x=synthetic();
 for(let px=12;px<=28;px++)x.owner[20*width+px]=2;
 const a=traceCandidateCorridor({...x,clearance:0});
 assert.equal(a.found,false);
 assert.deepEqual(a.path,[]);
});
test('Disconnected physical component is not treated as mainland transit',()=>{
 const x=synthetic();
 for(let px=12;px<=28;px++)x.labels[20*width+px]=31;
 const a=traceCandidateCorridor({...x,clearance:0});
 assert.equal(a.found,false);
});
test('Invalid source dimensions or unbounded search fail closed',()=>{
 const x=synthetic();
 assert.throws(()=>traceCandidateCorridor({...x,width:1024}),/HOLD/);
 assert.throws(()=>traceCandidateCorridor({...x,window:{
  minX:0,maxX:1000,minY:0,maxY:1000
 }}),/HOLD/);
});
