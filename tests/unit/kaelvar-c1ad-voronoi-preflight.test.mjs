import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateC1ADVoronoiPreflight,auditSyntheticVoronoiTopology}
 from '../../scripts/lib/kaelvar-c1ad-voronoi-preflight.mjs';
const read=x=>JSON.parse(readFileSync(new URL('../../docs/design/'+x,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const fixture=()=>({
 policy:read('kaelvar-c1ad-voronoi-provenance-and-geographic-region-preflight-2026-11-15.json'),
 c1ac:read('kaelvar-c1ac-owner-fantasy-map-simulator-screenshot-evidence-2026-11-15.json'),
 c1aa:read('kaelvar-c1aa-relative-relief-shared-seams-2026-11-15.json')
});
const check=x=>validateC1ADVoronoiPreflight(x.policy,x.c1ac,x.c1aa);
const synthetic=()=>({
 role:'SYNTHETIC_UNIT_FIXTURE_ONLY',
 coordinateFrame:'ORIGINAL_FIRST_WORLD_REFERENCE_GRID_2048_X_1152',
 sourceSaveMatched:false,canonicalWritable:false,
 cells:[
  {id:'c1',ring:[[10,10],[20,10],[20,20],[10,20]],neighborIds:['c2'],provinceId:'p1'},
  {id:'c2',ring:[[20,10],[30,10],[30,20],[20,20]],neighborIds:['c1','c3'],provinceId:'p2'},
  {id:'c3',ring:[[30,10],[40,10],[40,20],[30,20]],neighborIds:['c2'],provinceId:'p2'}
 ],
 provinces:[
  {id:'p1',cellIds:['c1'],districtId:'d1'},
  {id:'p2',cellIds:['c2','c3'],districtId:'d1'}
 ],
 districts:[{id:'d1',provinceIds:['p1','p2']}]
});
test('C1-AD documents actual cell-to-province-to-district hierarchy without inventing recovered map mesh',()=>{
 const x=fixture();assert.equal(check(x),true);
 const p=x.policy;
 assert.equal(p.sourceEvidence.ownerAttestedVoronoiMap,true);
 assert.equal(p.sourceEvidence.recoveredAdjacencyGraph,false);
 assert.equal(p.sourceEvidence.recoveredVoronoiSites,false);
 assert.equal(p.sourceEvidence.originalGameSaveMatched,false);
 assert.equal(p.ownerOverlay.polygonBoundaryAuthority,false);
 assert.equal(p.potentialLocalSaveRecovery.readOnlyInventoryOnly,true);
 assert.equal(p.proposedFutureMeshAudit.noForcedCellEdgeWhenSupportedNaturalFeatureDiffers,true);
 assert.equal(p.proposedFutureMeshAudit.exactOnePrimaryRegionPerFinalizedLandPoint,true);
 assert.equal(p.sourceHolds.canonicalWritable,false);
});
test('C1-AD fails closed on false saved mesh recoveries, incorrect source and island promotion',()=>{
 const mutations=[
  x=>x.policy.sourceEvidence.originalGameSaveMatched=true,
  x=>x.policy.sourceEvidence.recoveredCellIds=true,
  x=>x.policy.sourceEvidence.recoveredAdjacencyGraph=true,
  x=>x.policy.sourceEvidence.recoveredProvinceMembership=true,
  x=>x.policy.sourceEvidence.numericElevationMetersCertified=true,
  x=>x.policy.sourceEvidence.hierarchy[1].level='CENSUS_REGION',
  x=>x.policy.sourceEvidence.hierarchy[0].recoverableFromCurrentScreenshots=true,
  x=>x.policy.ownerOverlay.polygonBoundaryAuthority=true,
  x=>x.policy.ownerOverlay.islandOwnershipAuthority=true,
  x=>x.policy.ownerOverlay.referenceSvgSha256='wrong',
  x=>x.policy.exactSource.originalBiomeSha256='wrong',
  x=>x.policy.exactSource.acceptedC1PAssigned=60000,
  x=>x.policy.potentialLocalSaveRecovery.noAssumedSerializationSchema=false,
  x=>x.policy.potentialLocalSaveRecovery.doNotUploadPrivateOrUnverifiedSavesToGit=false,
  x=>x.policy.proposedFutureMeshAudit.noAutomaticVoronoiCellNearestSeedOwnership=false,
  x=>x.policy.proposedFutureMeshAudit.deterministicSharedBoundaryTieBreaker=false,
  x=>x.policy.geometryReview.acceptedC1PPolygonsChanged=true,
  x=>x.policy.sourceHolds.shattercapDetachedIslesHeld=false,
  x=>x.policy.sourceHolds.newCanonicallyAssignedRegionCells=1,
  x=>x.c1ac.derivedScreenshotInkReferenceSvg.canonicalWritable=true,
  x=>x.c1aa.candidates[0].sharedChain[0][0]=280
 ];
 for(const mutate of mutations){
  const x=fixture();mutate(x);
  assert.throws(()=>check(x),/C1-AD VORONOI HOLD/);
 }
});
test('C1-AD synthetic Voronoi cells require exact reciprocal geometric shared edges and connected provinces',()=>{
 const r=auditSyntheticVoronoiTopology(synthetic());
 assert.deepEqual({
  status:r.status,cells:r.cells,provinces:r.provinces,districts:r.districts,
  shared:r.sharedCellEdges,boundary:r.boundaryCellEdges,
  claimed:r.LineageRegionOwnershipAssigned,canonical:r.canonicalWritable
 },{status:'SYNTHETIC_ONLY_VORONOI_ADJACENCY_STRUCTURALLY_VALID',
  cells:3,provinces:2,districts:1,shared:2,boundary:8,
  claimed:false,canonical:false});
 assert.equal(r.originalSaveVerified,false);
});
test('C1-AD synthetic mesh audit refuses malformed geometry, mismatched neighbors, cell and province ownership',()=>{
 const mutations=[
  g=>g.sourceSaveMatched=true,
  g=>g.canonicalWritable=true,
  g=>g.role='IMPORTED_REAL_MAP',
  g=>g.cells[0].regionId='region.auric_marches',
  g=>g.cells[0].neighborIds=[],
  g=>g.cells[1].neighborIds=['c1'],
  g=>g.cells[0].id='c2',
  g=>g.cells[0].ring[0]=[0,1153],
  g=>g.cells[0].ring=[[10,10],[20,20],[10,20],[20,10]],
  g=>g.cells[1].ring[3]=[19,20],
  g=>g.cells[2].provinceId='p1',
  g=>{g.provinces[0].cellIds.push('c3');g.provinces[1].cellIds=['c2'];g.cells[2].provinceId='p1';},
  g=>g.provinces[0].cellIds.push('c2'),
  g=>g.provinces[1].districtId='missing',
  g=>g.districts[0].provinceIds=['p1','p1'],
  g=>g.districts[0].regionId='region.kharuun_drylands'
 ];
 for(const mutate of mutations){
  const g=synthetic();mutate(g);
  assert.throws(()=>auditSyntheticVoronoiTopology(g),/C1-AD VORONOI HOLD/);
 }
});
