import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateCoordinatePolygon,coordinatePolygonContains}
 from '../../scripts/lib/world-coordinate-geometry.mjs';
import {validateC1MShoreIntent}
 from '../../scripts/lib/kaelvar-c1m-shore-intent-review.mjs';
import {validateC1NAtlasContract}
 from '../../scripts/lib/kaelvar-c1n-source-edge-atlas.mjs';
import {selectC1JOriginalVectorEdges}
 from '../../scripts/lib/kaelvar-c1j-vector-coastline-review.mjs';
import {
 validateC1OContract,buildC1ORegionalGeometry,c1oSourceVertexArc,
 c1oPointInRing,measureC1OReviewTerrain,
} from '../../scripts/lib/kaelvar-c1o-regional-boundaries.mjs';

const load=p=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),
 'utf8').replace(/^\uFEFF/,''));
const dir='docs/design/';
const rows=()=>({
 o:load(dir+'kaelvar-c1o-regional-boundary-candidates-2026-11-14.json'),
 n:load(dir+'kaelvar-c1n-indexed-north-coast-atlas-2026-11-14.json'),
 f:load(dir+'kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json'),
 j:load(dir+'kaelvar-c1j-coastline-sector-review-2026-11-13.json'),
 m:load(dir+'kaelvar-c1m-owner-shore-correction-2026-11-14.json'),
 l:load(dir+'kaelvar-c1l-landmass-coast-arc-adjudication-2026-11-14.json'),
});
const source=()=>load('packages/content/base/world/world_map_features.json')
 .records.find(x=>x.mapId==='world_map.first_world');
const setup=()=>{
 const d=rows();
 validateC1MShoreIntent(d.m,d.l,d.j);
 validateC1NAtlasContract(d.n,d.j,d.l,d.m);
 validateC1OContract(d.o,d.n,d.f,d.j,d.m);
 const selected=selectC1JOriginalVectorEdges(source(),d.j);
 const geo=buildC1ORegionalGeometry({
  proposal:d.o,selected,c1n:d.n,c1f:d.f,
 });
 return {d,selected,geo};
};
test('C1-O inherits exact C1-N corrected head and all publication holds',()=>{
 const d=rows();
 assert.equal(validateC1OContract(d.o,d.n,d.f,d.j,d.m).publicationAllowed,false);
 assert.equal(d.o.baseCommit,'8c317d48ef405ca29830d4dc4959ce21f07693bb');
 assert.equal(d.o.source.observedParentBlob,
  '9cd6752e9dbca00796e5f7c013066bb0e5a96175');
 assert.equal(d.o.politicalHolds.canonicalWritable,false);
 assert.equal(d.o.politicalHolds.foreignWindwardParent,'region.serathyl');
 assert.equal(d.o.politicalHolds.coast40Claim,null);
 assert.equal(d.o.politicalHolds.portsPlaced,0);
 assert.equal(d.o.politicalHolds.waterRoutesPlaced,0);
 assert.equal(d.o.politicalHolds.saltBasinsPlaced,0);
 assert.equal(d.o.politicalHolds.shattercapRegionPolygon,null);
 assert.deepEqual(d.o.politicalHolds.detachedClaims,[]);
});
test('Original 599-edge mainland source trace is untouched and cyclic',()=>{
 const {geo,selected}=setup();
 assert.equal(geo.originalEdgesConserved,599);
 assert.equal(geo.originalSourceContoursModified,0);
 assert.equal(selected.main.points.length,599);
 assert.deepEqual(geo.sourceSectorCounts,{
  NW_ORIGINAL_SOURCE_REVIEW:90,
  NORTHCENTRAL_ORIGINAL_SOURCE_REVIEW:106,
  NORTHEAST_ORIGINAL_SOURCE_REVIEW:114,
  OTHER_SOURCE_EDGES_HELD:289,
 });
 const wrap=c1oSourceVertexArc(selected.main.points,475,24);
 assert.equal(wrap.sourceEdgeIndices.length,148);
 assert.deepEqual(wrap.sourceVertexIndices.slice(-2),[23,24]);
 assert.ok(wrap.sourceEdgeIndices.includes(598));
 assert.ok(wrap.sourceEdgeIndices.includes(0));
});
test('Kharuun has explicit limited inner-bay source frontage 35..58',()=>{
 const {geo,selected}=setup();
 const k=geo.regions.find(r=>r.regionId==='region.kharuun_drylands');
 assert.equal(k.sourceArcStartVertex,35);
 assert.equal(k.sourceArcEndVertex,59);
 assert.equal(k.sourceEdgeIndices.length,24);
 assert.deepEqual(k.sourceEdgeIndices,Array.from({length:24},(_,i)=>i+35));
 assert.deepEqual(k.polygonRing[0],selected.main.points[35]);
 assert.deepEqual(k.polygonRing[24],selected.main.points[59]);
 assert.equal(k.sourceInlandProperCrossings,0);
 const alt=geo.coastalReviewArcs.find(x=>x.id==='kharuun_inner_bay_primary');
 assert.equal(alt.endpointAlternatives.length,2);
 assert.equal(alt.endpointsUnapproved,true);
});
test('Four unequal, source-indexed mainland rings have valid vertices',()=>{
 const {geo,selected}=setup();
 assert.deepEqual(geo.regions.map(r=>r.regionId),[
  'region.auric_marches','region.kharuun_drylands',
  'region.verdant_thalos','region.veyrholm_shore']);
 assert.equal(new Set(geo.regions.map(x=>x.polygonRing.length)).size>1,true);
 for(const r of geo.regions){
  assert.doesNotThrow(()=>validateCoordinatePolygon({outer:r.polygonRing}));
  assert.equal(r.sourceInlandProperCrossings,0);
  assert.equal(r.protectedOffshoreCrossings,0);
  assert.deepEqual(r.polygonRing[0],selected.main.points[r.sourceArcStartVertex]);
  assert.deepEqual(r.polygonRing[r.sourceVertexCount-1],
   selected.main.points[r.sourceArcEndVertex]);
  assert.ok(r.sourceCoastEdgeOriginalPoints.every((edge,i)=>
   edge.sourceEdgeIndex===r.sourceEdgeIndices[i]&&
   edge.originalVertexA.x===selected.main.points[edge.sourceEdgeIndex].x&&
   edge.originalVertexA.y===selected.main.points[edge.sourceEdgeIndex].y));
 }
 assert.equal(geo.regionalOverlapCount,0);
 assert.equal(geo.selfIntersectionCount,0);
});
test('Owner C1-F Verdant inclusion and Veyrholm inland exclusion survive',()=>{
 const {d,geo}=setup();
 const v=geo.regions.find(x=>x.regionId==='region.veyrholm_shore');
 const t=geo.regions.find(x=>x.regionId==='region.verdant_thalos');
 for(const anchor of d.f.reviewAnchors.verdantMustIncludePeninsula)
  assert.ok(coordinatePolygonContains({outer:t.polygonRing},anchor));
 for(const anchor of d.f.reviewAnchors.veyrholmMustExcludeInland)
  assert.ok(!coordinatePolygonContains({outer:v.polygonRing},anchor));
 assert.ok(v.hypothesizedInlandWaypoints.length>10);
 assert.deepEqual(v.sourceEdgeIndices.slice(-3),[21,22,23]);
});
test('Northeast 75..115, eastern/southern 135..175 remain unclaimed review arcs',()=>{
 const {geo,d}=setup();
 const ne=geo.coastalReviewArcs.find(x=>x.id==='northeast_headland');
 assert.equal(ne.proposedRegionId,null);
 assert.deepEqual([ne.sourceEdgeIndices[0],ne.sourceEdgeIndices.at(-1)],
  [75,114]);
 const coast=geo.coastalReviewArcs.find(x=>x.id==='east_south_coastline');
 assert.equal(coast.proposedRegionId,null);
 assert.deepEqual([coast.sourceEdgeIndices[0],coast.sourceEdgeIndices.at(-1)],
  [135,175]);
 assert.ok(geo.regions.every(x=>!c1oPointInRing(
  d.f.reviewAnchors.unownedNortheasternIslandSample,x.polygonRing)));
});
test('Protected detached source contours and islands retain no ownership',()=>{
 const {geo}=setup();
 assert.deepEqual(geo.protectedOffshore.map(x=>x.id),[
  'feature.coastline.first_world.part_7',
  'feature.coastline.first_world.part_8',
  'feature.coastline.first_world.part_31']);
 assert.equal(geo.offshoreSourceCrossingCount,0);
 assert.ok(geo.regions.every(r=>r.regionalAuthority===
  'NONCANONICAL_REVIEW_CANDIDATE_ONLY'));
});
test('Changed coastline count, inland corridor and unauthorized port fail closed',()=>{
 const x=rows();x.o.source.originalEdges=598;
 assert.throws(()=>validateC1OContract(x.o,x.n,x.f,x.j,x.m),/source chain/);
 const y=rows();y.o.regions[3].inlandWaypoints=[[80,190],[500,190]];
 assert.throws(()=>validateC1OContract(y.o,y.n,y.f,y.j,y.m),/source\/inland|false corridor/);
 const z=rows();z.o.politicalHolds.portsPlaced=1;
 assert.throws(()=>validateC1OContract(z.o,z.n,z.f,z.j,z.m),/canonical hold/);
});
test('Interior sweep crossing or Veyrholm excessive expansion is rejected',()=>{
 const {d,selected}=setup();
 d.o.regions[3].inlandWaypoints[4]=[350,245];
 assert.throws(()=>buildC1ORegionalGeometry({
  proposal:d.o,selected,c1n:d.n,c1f:d.f,
 }),/HOLD|World coordinate/);
});
test('Source sample preview must conserve 79,419 and never claim detached cells',()=>{
 const {geo}=setup();
 const labels=new Uint16Array(2048*1152);
 assert.throws(()=>measureC1OReviewTerrain(geo,labels),
  /empty region preview terrain candidate|inventory/);
 assert.throws(()=>measureC1OReviewTerrain(geo,new Uint16Array(7)),
  /registered terrain component raster missing/);
});
