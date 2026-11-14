import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1SSpec,buildC1SSensitivity}
 from '../../scripts/lib/kaelvar-c1s-headland-ink-sensitivity.mjs';
import {isSharedNonblueUnresolved}
 from '../../scripts/lib/kaelvar-c1i-source-ink-separation.mjs';

const load=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),'utf8')
 .replace(/^\uFEFF/,''));
const d='docs/design/';
const fixture=()=>({
 spec:load(d+'kaelvar-c1s-headland-shared-ink-sensitivity-2026-11-14.json'),
 r:load(d+'kaelvar-c1r-headland-source-bottleneck-probe-2026-11-14.json'),
 p:load(d+'kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json'),
 q:load(d+'kaelvar-c1q-northeast-headland-options-2026-11-14.json'),
 c1p:{
  status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
  originalSourceEdgesConserved:599,sourcePngFingerprintsVerified:true,
  measurements:{candidateMainlandTerrainCells:79419,
   previewAssignedMainlandTerrainCells:52449,
   remainingUnassignedMainlandTerrainCells:26970,
   perRegion:[5632,18624,19182,9011].map(terrainCandidateCells=>({terrainCandidateCells})),
   detachedPhysicalComponentsClaimed:0}
 },
 c1r:{
  status:'C1R_HELD_ORIGINAL_PAIR_SOURCE_CORRIDOR_DIAGNOSTICS_ONLY',
  widenedConnectivity:[
   {found:true,pathSha256:'0147077f649823002cb7ef7a0d40d6617c0fc699ee3b34337fcfb8ff82b1b01a'},
   {found:false},{found:false}
  ],
  narrowRouteDiagnostics:{adjacentRejectedPixelReasons:{SOURCE_PAIR_RGB_EQUALITY:96}},
  immutableAllocation:{newlyAllocatedCells:0}
 }
});
const validate=x=>validateC1SSpec(x.spec,x.r,x.p,x.q,x.c1p,x.c1r);
test('C1-S preserves exact C1-R source, C1-P accounting and all island/political holds',()=>{
 const f=fixture();
 assert.equal(validate(f),true);
 assert.deepEqual(f.spec.scenarios.map(x=>x.id),[
  'ORIGINAL_SOURCE_PAIR_ONLY','HYPOTHETICAL_BLACK_ONLY',
  'HYPOTHETICAL_TEAL_ONLY','HYPOTHETICAL_BLACK_AND_TEAL',
  'HYPOTHETICAL_ALL_SHARED_NONBLUE']);
 assert.equal(f.spec.originalC1P.assigned,52449);
 assert.equal(f.spec.originalC1P.unassigned,26970);
 assert.deepEqual(f.spec.originalC1P.originalKharuunEdgesInclusive,[35,58]);
 assert.deepEqual(f.spec.originalC1P.headlandEdgesInclusive,[75,115]);
 assert.equal(f.spec.immutableHolds.canonicalWritable,false);
 assert.equal(f.spec.immutableHolds.noOriginalTerrainLabelChanges,true);
 assert.equal(f.spec.immutableHolds.northeastHeadlandUnassigned,true);
});
test('C1-S must not approve or move coastline, detached islands or territory',()=>{
 for(const change of [
  x=>x.spec.immutableHolds.canonicalWritable=true,
  x=>x.spec.immutableHolds.northeastHeadlandUnassigned=false,
  x=>x.spec.immutableHolds.largeNortheastIslandUnassigned=false,
  x=>x.spec.immutableHolds.shattercapAllDetachedIslandsUnassigned=false,
  x=>x.spec.immutableHolds.detachedComponentClaims=1,
  x=>x.spec.immutableHolds.noOriginalTerrainLabelChanges=false,
  x=>x.spec.immutableHolds.noRegionPolygonChanges=false,
  x=>x.spec.immutableHolds.portsWellsRiversWaterRoutesSaltBasinsPlaced=1,
  x=>x.spec.immutableHolds.coast40Claim='region.verdant_thalos',
  x=>x.spec.immutableHolds.serathylWindwardParent='region.verdant_thalos',
  x=>x.spec.immutableHolds.noNewLegacyHexDependencies=false,
 ]){
  const f=fixture();change(f);
  assert.throws(()=>validate(f),/C1-S noncanonical HOLD/);
 }
});
test('C1-S class rules, source registration and scenario set are pinned',()=>{
 for(const change of [
  x=>x.spec.source.biomeSha256='incorrect',
  x=>x.spec.source.elevationSha256='incorrect',
  x=>x.spec.source.originalCoastlineBlob='incorrect',
  x=>x.spec.source.crop.x=61,
  x=>x.spec.sampling.windowInclusive.maxX=900,
  x=>x.spec.sampling.colorClassifiers.teal='ANY_BLUE',
  x=>x.spec.sampling.connectivity=8,
  x=>x.spec.sampling.allowedExistingOwnerCodes=[0,1,3],
  x=>x.spec.scenarios[4].allow.push('water'),
  x=>x.spec.scenarios.push({id:'HYPOTHETICAL_CANONICAL',allow:['black']}),
 ]){
  const f=fixture();change(f);
  assert.throws(()=>validate(f),/C1-S noncanonical HOLD/);
 }
});
test('C1-S rejects historical evidence or C1-P accounting drift',()=>{
 for(const change of [
  x=>x.r.pinnedParentHead='changed',
  x=>x.p.ownerReviewDirection.kharuunSourceEdgeIndicesInclusive=[30,59],
  x=>x.c1p.measurements.previewAssignedMainlandTerrainCells=52450,
  x=>x.c1p.measurements.perRegion[2].terrainCandidateCells=19183,
  x=>x.c1r.widenedConnectivity[1].found=true,
  x=>x.c1r.narrowRouteDiagnostics.adjacentRejectedPixelReasons.SOURCE_PAIR_RGB_EQUALITY=95,
  x=>x.c1r.immutableAllocation.newlyAllocatedCells=1,
 ]){
  const f=fixture();change(f);
  assert.throws(()=>validate(f),/C1-S noncanonical HOLD/);
 }
});
test('C1-I exact shared-nonblue rule still excludes blue, mismatched source and invalid alpha',()=>{
 assert.equal(isSharedNonblueUnresolved(0,0,0,255,0,0,0,255),true);
 assert.equal(isSharedNonblueUnresolved(4,159,169,255,4,159,169,255),true);
 assert.equal(isSharedNonblueUnresolved(0,0,255,255,0,0,255,255),false);
 assert.equal(isSharedNonblueUnresolved(4,159,169,255,4,159,168,255),false);
 assert.equal(isSharedNonblueUnresolved(0,0,0,0,0,0,0,0),false);
});
test('No source images means no C1-S terrain sensitivity acceptance',()=>{
 const f=fixture();
 assert.throws(()=>buildC1SSensitivity({
  ...f,c1rSpec:f.r,c1pReport:f.c1p,c1rReport:f.c1r,
  originalLabels:new Uint16Array(2048*1152),
  ownership:new Uint8Array(2048*1152),
  revised:{originalContour:[]}
 }),/C1-S noncanonical HOLD/);
});
