import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1JContract,selectC1JOriginalVectorEdges}
  from '../../scripts/lib/kaelvar-c1j-vector-coastline-review.mjs';
import {validateC1FPlacementGuides}
  from '../../scripts/lib/kaelvar-c1f-placement-intent.mjs';
import {
  validateC1KContract,nearestGuideGap,buildC1KCoastInlandReview,
} from '../../scripts/lib/kaelvar-c1k-coast-informed-boundary-review.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),
  'utf8').replace(/^\uFEFF/,''));
const dir='docs/design/';
const input=()=>({
  k:read(dir+'kaelvar-c1k-coast-informed-boundary-review-2026-11-14.json'),
  j:read(dir+'kaelvar-c1j-coastline-sector-review-2026-11-13.json'),
  f:read(dir+'kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json'),
  g:read(dir+'kaelvar-c1g-coastline-salt-basin-evidence-2026-11-13.json'),
  l:read(dir+'kaelvar-c1-coordinate-geography-review-2026-11-13.json'),
});
const vector=()=>read('packages/content/base/world/world_map_features.json')
  .records.find(x=>x.mapId==='world_map.first_world');
test('C1-K inherits reviewed source and holds all canonical geography',()=>{
  const x=input();
  validateC1FPlacementGuides(x.f,x.l);
  validateC1JContract(x.j,x.l,x.f,x.g);
  const v=validateC1KContract(x.k,x.j,x.f);
  assert.equal(v.inlandReviewInterfaces,4);
  assert.equal(v.canonicalWritable,false);
});
test('599 original edges are retained; NE competition cannot become a region',()=>{
  const x=input(),selected=selectC1JOriginalVectorEdges(vector(),x.j);
  const original=JSON.stringify(selected.main.points);
  const r=buildC1KCoastInlandReview(selected,x.f,x.k);
  assert.equal(r.originalSourceEdges,599);
  assert.equal(r.northernSourceEdges,310);
  assert.equal(r.remainingOriginalSourceEdges,289);
  assert.deepEqual(r.northernSectors.map(s=>s.originalEdgeCount),
    [90,106,114]);
  assert.equal(r.northernSectors[2].competingFrontageHeld,true);
  assert.equal(r.northernSectors[2].regionOwnershipAssigned,0);
  assert.equal(r.assignedCoastlineEdges,0);
  assert.equal(r.approvedInlandBorders,0);
  assert.equal(r.canonicalWritable,false);
  assert.equal(JSON.stringify(selected.main.points),original);
  for(const s of r.northernSectors)
    assert.equal(Object.values(s.rawGuideMidpointOverlaps)
      .reduce((a,b)=>a+b,s.unmatchedSourceEdgeCount),
      s.originalEdgeCount);
});
test('Inland gaps are measured from existing disjoint guides, not new borders',()=>{
  const a=[{x:0,y:0},{x:2,y:0},{x:2,y:2},{x:0,y:2}];
  const b=[{x:5,y:0},{x:7,y:0},{x:7,y:2},{x:5,y:2}];
  const r=nearestGuideGap(a,b);
  assert.equal(r.guideGapPixels,3);
  assert.equal(r.isProposedBorder,false);
  const x=input(),s=selectC1JOriginalVectorEdges(vector(),x.j);
  const review=buildC1KCoastInlandReview(s,x.f,x.k);
  assert.equal(review.inlandInterfaces.length,4);
  assert.ok(review.inlandInterfaces.every(p=>
    p.guideGapPixels>=0&&p.approvedBorderGeometryRef===null&&
    p.ownerApprovalRequired&&p.isProposedBorder===false));
});
test('Sovereignty, shoreline and salt promotions fail closed',()=>{
  const x=input();x.k.approval.newInlandBorderGeometryApproved=true;
  assert.throws(()=>validateC1KContract(x.k,x.j,x.f),/sovereign geometry/);
  const y=input();y.k.kharuunSeaAccessApproved=true;
  assert.throws(()=>validateC1KContract(y.k,y.j,y.f),/held coast/);
  const z=input();z.k.protectedOffshoreSourceIds.pop();
  assert.throws(()=>validateC1KContract(z.k,z.j,z.f),/held coast/);
});
test('Inland review neighbor identities cannot be reassigned',()=>{
  const x=input();x.k.reviewInterfaces[1].regionB='region.shattercap_isles';
  assert.throws(()=>validateC1KContract(x.k,x.j,x.f),/inland adjacency/);
  const y=input();y.k.reviewInterfaces[0].approvedBorderGeometryRef='geom.fake';
  assert.throws(()=>validateC1KContract(y.k,y.j,y.f),/inland adjacency/);
});
test('Source edge cannot silently duplicate or disappear in review',()=>{
  const x=input(),s=selectC1JOriginalVectorEdges(vector(),x.j);
  s.unreviewedEdges[0]=s.edgeSectors[0][0];
  assert.throws(()=>buildC1KCoastInlandReview(s,x.f,x.k),
    /missing or duplicated/);
});
