import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1JContract,selectC1JOriginalVectorEdges}
  from '../../scripts/lib/kaelvar-c1j-vector-coastline-review.mjs';
import {validateC1KContract,buildC1KCoastInlandReview}
  from '../../scripts/lib/kaelvar-c1k-coast-informed-boundary-review.mjs';
import {
 C1L_ARC_CLASSES,validateC1LContract,groupCyclicSourceArcStatuses,
 buildC1LLandmassSourceArcReview,
} from '../../scripts/lib/kaelvar-c1l-landmass-source-arc-review.mjs';

const read=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),
 'utf8').replace(/^\uFEFF/,''));
const d='docs/design/';
const inputs=()=>({
 l:read(d+'kaelvar-c1l-landmass-coast-arc-adjudication-2026-11-14.json'),
 k:read(d+'kaelvar-c1k-coast-informed-boundary-review-2026-11-14.json'),
 j:read(d+'kaelvar-c1j-coastline-sector-review-2026-11-13.json'),
 f:read(d+'kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json'),
 g:read(d+'kaelvar-c1g-coastline-salt-basin-evidence-2026-11-13.json'),
 c:read(d+'kaelvar-c1-coordinate-geography-review-2026-11-13.json'),
});
const source=()=>read('packages/content/base/world/world_map_features.json')
 .records.find(r=>r.mapId==='world_map.first_world');
const review=()=>{
 const x=inputs();
 validateC1JContract(x.j,x.c,x.f,x.g);
 validateC1KContract(x.k,x.j,x.f);
 validateC1LContract(x.l,x.c,x.f,x.j,x.k);
 const selected=selectC1JOriginalVectorEdges(source(),x.j);
 const kReview=buildC1KCoastInlandReview(selected,x.f,x.k);
 return {x,selected,kReview};
};

test('C1-L accepts five landmass descriptors, but zero region geometry',()=>{
 const x=inputs(),v=validateC1LContract(x.l,x.c,x.f,x.j,x.k);
 assert.equal(v.regionIntents,5);
 assert.equal(v.detachedClaims,0);
 assert.equal(v.canonicalWritable,false);
 assert.ok(x.l.regionDescriptions.every(r=>r.proposedGeometryRef===null));
});
test('Cyclic source arc runs preserve wrap from original last to first edge',()=>{
 const runs=groupCyclicSourceArcStatuses(['A','A','B','A']);
 assert.equal(runs.length,2);
 assert.deepEqual(runs.map(r=>[r.status,r.count,r.wrapsZero]),
   [['B',1,false],['A',3,true]]);
 assert.deepEqual(runs[1].sourceEdgeIndices,[3,0,1]);
 assert.deepEqual(groupCyclicSourceArcStatuses(['A','A','A'])
   .map(r=>r.count),[3]);
 assert.throws(()=>groupCyclicSourceArcStatuses([]),/invalid/);
});
test('Every original 599 coast edges has exactly one reversible arc class',()=>{
 const {x,selected,kReview}=review();
 const pointsBefore=JSON.stringify(selected.main.points);
 const r=buildC1LLandmassSourceArcReview(selected,x.f,kReview,x.l);
 assert.equal(r.originalEdgesAccounted,599);
 assert.equal(r.northernOriginalEdgesAccounted,310);
 assert.equal(r.otherOriginalEdgesAccounted,289);
 assert.deepEqual(new Set(r.statusByOriginalSourceEdgeIndex).size>0,true);
 assert.equal(r.statusByOriginalSourceEdgeIndex.length,599);
 assert.equal(r.cyclicSourceArcRuns.flatMap(r=>r.sourceEdgeIndices).length,599);
 assert.equal(new Set(r.cyclicSourceArcRuns.flatMap(r=>r.sourceEdgeIndices)).size,599);
 assert.equal(r.countsBySourceArcStatus[C1L_ARC_CLASSES[3]],114);
 assert.equal(r.countsBySourceArcStatus[C1L_ARC_CLASSES[4]],289);
 assert.equal(r.countsBySourceArcStatus[C1L_ARC_CLASSES[0]]+
   r.countsBySourceArcStatus[C1L_ARC_CLASSES[1]]+
   r.countsBySourceArcStatus[C1L_ARC_CLASSES[2]],196);
 assert.equal(JSON.stringify(selected.main.points),pointsBefore);
});
test('The northeastern competing arc is withheld even when draft guide coincides',()=>{
 const {x,selected,kReview}=review();
 const r=buildC1LLandmassSourceArcReview(selected,x.f,kReview,x.l);
 for(const edge of selected.edgeSectors[2])
   assert.equal(r.statusByOriginalSourceEdgeIndex[edge.sourceEdgeIndex],
     C1L_ARC_CLASSES[3]);
 assert.equal(r.proposedCoastalOwnershipEdges,0);
 assert.equal(r.publishedRegionBorders,0);
 assert.equal(r.publishedIslandOwnershipClaims,0);
 assert.equal(r.ownerVisualReviewRequired,true);
 assert.equal(r.canonicalWritable,false);
});
test('Source edge mutation and repetition are rejected, never silently matched',()=>{
 const a=review();
 a.selected.edgeSectors[0][0].a={x:0,y:0};
 assert.throws(()=>buildC1LLandmassSourceArcReview(
   a.selected,a.x.f,a.kReview,a.x.l),/altered or unregistered/);
 const b=review();
 b.selected.unreviewedEdges[0]=b.selected.edgeSectors[0][0];
 assert.throws(()=>buildC1LLandmassSourceArcReview(
   b.selected,b.x.f,b.kReview,b.x.l),/duplicate/);
});
test('Proposed geometry, approved coastline and changed landmass parent fail closed',()=>{
 const a=inputs();a.l.regionDescriptions[0].proposedGeometryRef='geometry.fake';
 assert.throws(()=>validateC1LContract(a.l,a.c,a.f,a.j,a.k),
   /region descriptors/);
 const b=inputs();b.l.approval.sourceCoastlineCertified=true;
 assert.throws(()=>validateC1LContract(b.l,b.c,b.f,b.j,b.k),
   /prematurely approved/);
 const c=inputs();c.l.parentRegionId='region.serathyl';
 assert.throws(()=>validateC1LContract(c.l,c.c,c.f,c.j,c.k),
   /source witness/);
});
test('Detached island claims, foreign Windward and salt placement remain blocked',()=>{
 const a=inputs();a.l.approval.detachedComponentClaims=[{componentId:24}];
 assert.throws(()=>validateC1LContract(a.l,a.c,a.f,a.j,a.k),
   /prematurely approved/);
 const b=inputs();b.l.foreignWindwardParent='region.kaelvar';
 assert.throws(()=>validateC1LContract(b.l,b.c,b.f,b.j,b.k),
   /hydrology hold/);
 const c=inputs();c.l.saltBasinsPlaced=1;
 assert.throws(()=>validateC1LContract(c.l,c.c,c.f,c.j,c.k),
   /hydrology hold/);
});
