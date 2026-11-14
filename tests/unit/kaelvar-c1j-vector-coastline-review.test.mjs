import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {
  validateC1JContract,selectC1JOriginalVectorEdges,sampleContourTerrainProximity,
} from '../../scripts/lib/kaelvar-c1j-vector-coastline-review.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const dir='docs/design/';
const input=()=>({
  c:read(dir+'kaelvar-c1j-coastline-sector-review-2026-11-13.json'),
  c1:read(dir+'kaelvar-c1-coordinate-geography-review-2026-11-13.json'),
  c1f:read(dir+'kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json'),
  c1g:read(dir+'kaelvar-c1g-coastline-salt-basin-evidence-2026-11-13.json'),
});
const source=()=>read('packages/content/base/world/world_map_features.json')
  .records.find(x=>x.mapId==='world_map.first_world');
test('C1-J contract keeps every coast, salt, foreign territory and river approval held',()=>{
  const x=input();
  const r=validateC1JContract(x.c,x.c1,x.c1f,x.c1g);
  assert.equal(r.northernReviewSectors,3);
  assert.equal(r.canonicalWritable,false);
});
test('Exactly 599 untouched source coastal edges split 90/106/114/289',()=>{
  const x=input(),r=selectC1JOriginalVectorEdges(source(),x.c);
  assert.deepEqual(r.report.northernSectorSourceEdgeCounts,[90,106,114]);
  assert.equal(r.report.originalSourceEdgesAccounted,599);
  assert.equal(r.unreviewedEdges.length,289);
  assert.equal(r.offshore.length,3);
  assert.equal(r.river.id,'feature.river_thalos_run');
});
test('All 68 coastline records retain ocean association, not Kaelvar sovereignty',()=>{
  const s=source();
  assert.equal(s.coastlines.length,68);
  assert.ok(s.coastlines.every(x=>
    x.regionIds.length===1&&x.regionIds[0]==='region.azure_vast'));
});
test('A proposed sea port or source-edge promotion invalidates the review ledger',()=>{
  const x=input();x.c.kharuunSeaAccessApproved=true;
  assert.throws(()=>validateC1JContract(x.c,x.c1,x.c1f,x.c1g),
    /approval changed/);
  const y=input();y.c.northSectorWindows[2].targetRegionId='region.kharuun_drylands';
  assert.throws(()=>validateC1JContract(y.c,y.c1,y.c1f,y.c1g),
    /sector was moved/);
});
test('Detached NE island and eastern contour cannot acquire component identity',()=>{
  const x=input();x.c.protectedOffshoreContours[1].physicalComponentId=24;
  assert.throws(()=>validateC1JContract(x.c,x.c1,x.c1f,x.c1g),
    /island gained/);
  const y=input();y.c.protectedOffshoreContours.pop();
  assert.throws(()=>validateC1JContract(y.c,y.c1,y.c1f,y.c1g),
    /source contours are missing/);
});
test('Nearest terrain component is ambiguous at tied radius, never assigned',()=>{
  const w=2048,h=1152,labels=new Uint32Array(w*h);
  labels[120*w+121]=30;labels[120*w+123]=24;
  const r=sampleContourTerrainProximity([
    {x:120,y:120},{x:122,y:120},{x:400,y:400}],labels,{radius:2});
  assert.equal(r.uniqueNearestSamples,1);
  assert.equal(r.ambiguousNearestSamples,1);
  assert.equal(r.unresolvedSamples,1);
  assert.equal(r.nearestSourceTerrainComponentCandidates[0].componentId,30);
  assert.equal(r.certifiesPhysicalComponent,false);
});
test('Vector source inventory and separate source river cannot drift',()=>{
  const c=input().c,s=source();
  s.coastlines.pop();
  assert.throws(()=>selectC1JOriginalVectorEdges(s,c),/inventory drift/);
  const t=source();
  t.riverFeatures.find(x=>x.id==='feature.river_thalos_run').regionIds=['region.kharuun_drylands'];
  assert.throws(()=>selectC1JOriginalVectorEdges(t,c),/river source drift/);
});
test('Shared ocean association cannot become continent parent or canonical geometry',()=>{
  const x=input();x.c.sharedOceanRegionIds=['region.kaelvar'];
  assert.throws(()=>validateC1JContract(x.c,x.c1,x.c1f,x.c1g),
    /review-hierarchy mismatch/);
  const y=input();y.c.approvedGeometryRefs=['geometry.fake'];
  assert.throws(()=>validateC1JContract(y.c,y.c1,y.c1f,y.c1g),
    /approval changed/);
});
