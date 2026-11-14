import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {selectC1JOriginalVectorEdges}
 from '../../scripts/lib/kaelvar-c1j-vector-coastline-review.mjs';
import {validateC1MShoreIntent}
 from '../../scripts/lib/kaelvar-c1m-shore-intent-review.mjs';
import {validateC1NAtlasContract,buildC1NSourceEdgeAtlas}
 from '../../scripts/lib/kaelvar-c1n-source-edge-atlas.mjs';

const read=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),
 'utf8').replace(/^\uFEFF/,''));
const d='docs/design/';
const inputs=()=>({
 n:read(d+'kaelvar-c1n-indexed-north-coast-atlas-2026-11-14.json'),
 m:read(d+'kaelvar-c1m-owner-shore-correction-2026-11-14.json'),
 l:read(d+'kaelvar-c1l-landmass-coast-arc-adjudication-2026-11-14.json'),
 j:read(d+'kaelvar-c1j-coastline-sector-review-2026-11-13.json'),
});
const source=()=>read('packages/content/base/world/world_map_features.json')
 .records.find(x=>x.mapId==='world_map.first_world');
const setup=()=>{
 const x=inputs();
 validateC1MShoreIntent(x.m,x.l,x.j);
 validateC1NAtlasContract(x.n,x.j,x.l,x.m);
 return {x,selected:selectC1JOriginalVectorEdges(source(),x.j)};
};
test('C1-N retains Kharuun short shore but no guessed edge assignment',()=>{
 const x=inputs();
 const v=validateC1NAtlasContract(x.n,x.j,x.l,x.m);
 assert.equal(v.originalSourceEdgeCount,599);
 assert.equal(v.canonicalWritable,false);
 assert.equal(x.n.ownerDesign.kharuunHasShortNorthernCoast,true);
 assert.equal(x.n.ownerDesign.coastKharuunSourceEdgeIndices,null);
 assert.equal(x.n.ownerDesign.kharuunCoastPortLocation,null);
});
test('Every exact source edge is accounted for with matching source endpoints',()=>{
 const {x,selected}=setup();
 const original=JSON.stringify(selected.main.points);
 const atlas=buildC1NSourceEdgeAtlas(selected,x.n);
 assert.equal(atlas.originalEdgesAccounted,599);
 assert.deepEqual(atlas.originalEdgeCoordinates.map(x=>x.sourceEdgeIndex),
   Array.from({length:599},(_,i)=>i));
 assert.deepEqual(Object.values(atlas.countsBySourceInspectionSector),
   [90,106,114,289]);
 assert.equal(atlas.preservedOriginalClosingEdge,true);
 assert.equal(atlas.allegedKharuunPoliticalSourceEdges,0);
 assert.equal(atlas.actualPortCoordinates,null);
 assert.equal(JSON.stringify(selected.main.points),original);
 assert.ok(atlas.originalEdgeCoordinates.every(x=>
   x.politicalOwnerRegionId===null&&
   x.approvedCoastalGeometryRef===null));
});
test('North-central source run wraps exact edge 598 to 0',()=>{
 const {x,selected}=setup();
 const atlas=buildC1NSourceEdgeAtlas(selected,x.n);
 const center=atlas.cyclicInspectionRuns.filter(x=>
   x.status==='NORTHCENTRAL_ORIGINAL_SOURCE_REVIEW');
 assert.equal(center.length,1);
 assert.deepEqual(
   [center[0].startEdgeIndex,center[0].endEdgeIndex,center[0].count,
    center[0].wrapsZero],[553,59,106,true]);
 assert.ok(center[0].sourceEdgeIndices.includes(0));
 assert.ok(center[0].sourceEdgeIndices.includes(598));
});
test('NE original source segment is two index runs, not a Kharuun claim',()=>{
 const {x,selected}=setup();
 const atlas=buildC1NSourceEdgeAtlas(selected,x.n);
 const ne=atlas.cyclicInspectionRuns.filter(x=>
   x.status==='NORTHEAST_ORIGINAL_SOURCE_REVIEW');
 assert.deepEqual(ne.map(x=>[x.startEdgeIndex,x.endEdgeIndex,x.count]),
   [[60,149,90],[154,177,24]]);
 assert.equal(atlas.allegedKharuunPoliticalSourceEdges,0);
 assert.equal(atlas.canonicalWritable,false);
});
test('Zoom markers are real source vertices, never interpolated',()=>{
 const {x,selected}=setup();
 const atlas=buildC1NSourceEdgeAtlas(selected,x.n);
 assert.equal(atlas.labelMarkers.length,3);
 assert.ok(atlas.labelMarkers.every(panel=>
   panel.originalVertexLabels.every(point=>{
     const src=selected.main.points[point.originalSourceEdgeIndex];
     return point.x===src.x&&point.y===src.y;
   })));
 assert.ok(atlas.labelMarkers[2].originalVertexLabels.length>0);
});
test('Tampering source edges, doubling edges or dropping edges fails closed',()=>{
 const a=setup();a.selected.edgeSectors[2][0].a={x:0,y:0};
 assert.throws(()=>buildC1NSourceEdgeAtlas(a.selected,a.x.n),
   /source vertex was replaced/);
 const b=setup();b.selected.unreviewedEdges[0]=b.selected.edgeSectors[1][0];
 assert.throws(()=>buildC1NSourceEdgeAtlas(b.selected,b.x.n),
   /duplicate/);
 const c=setup();c.selected.unreviewedEdges.pop();
 assert.throws(()=>buildC1NSourceEdgeAtlas(c.selected,c.x.n),
   /inventory incomplete/);
});
test('Port coordinates, Kharuun frontage indices and island ownership cannot be introduced',()=>{
 const a=inputs();a.n.ownerDesign.kharuunCoastPortLocation={x:450,y:225};
 assert.throws(()=>validateC1NAtlasContract(a.n,a.j,a.l,a.m),
   /prematurely changed/);
 const b=inputs();b.n.ownerDesign.coastKharuunSourceEdgeIndices=[60,61];
 assert.throws(()=>validateC1NAtlasContract(b.n,b.j,b.l,b.m),
   /prematurely changed/);
 const c=inputs();c.n.ownerDesign.supportedWholeIslandClaims=[24];
 assert.throws(()=>validateC1NAtlasContract(c.n,c.j,c.l,c.m),
   /prematurely changed/);
});
test('False Veyrholm corridor and changed source count are rejected',()=>{
 const a=inputs();a.n.ownerDesign.falseVeyrholmCorridorRejected=false;
 assert.throws(()=>validateC1NAtlasContract(a.n,a.j,a.l,a.m),
   /prematurely changed/);
 const b=inputs();b.n.northeasternSourceRuns[0].count=91;
 assert.throws(()=>validateC1NAtlasContract(b.n,b.j,b.l,b.m),
   /indexed source-contour segment specification drift/);
 const c=inputs();c.n.sourceCoastEdgeCount=598;
 assert.throws(()=>validateC1NAtlasContract(c.n,c.j,c.l,c.m),
   /atlas format/);
});
