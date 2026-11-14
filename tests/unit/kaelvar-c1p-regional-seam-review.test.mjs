import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {selectC1JOriginalVectorEdges}
 from '../../scripts/lib/kaelvar-c1j-vector-coastline-review.mjs';
import {validateC1PReviewProposal,buildC1PRegionalReview}
 from '../../scripts/lib/kaelvar-c1p-regional-seam-review.mjs';
import {c1oPointInRing} from '../../scripts/lib/kaelvar-c1o-regional-boundaries.mjs';

const read=path=>JSON.parse(readFileSync(new URL('../../'+path,import.meta.url),'utf8')
 .replace(/^\uFEFF/,''));
const prefix='docs/design/';
const fixtures=()=>({
 p:read(prefix+'kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json'),
 o:read(prefix+'kaelvar-c1o-regional-boundary-candidates-2026-11-14.json'),
 n:read(prefix+'kaelvar-c1n-indexed-north-coast-atlas-2026-11-14.json'),
 f:read(prefix+'kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json'),
 j:read(prefix+'kaelvar-c1j-coastline-sector-review-2026-11-13.json'),
 m:read(prefix+'kaelvar-c1m-owner-shore-correction-2026-11-14.json'),
});
function check(d){
 const world=read('packages/content/base/world/world_map_features.json').records
  .find(x=>x.mapId==='world_map.first_world');
 const selected=selectC1JOriginalVectorEdges(world,d.j);
 return buildC1PRegionalReview({...d,selected});
}
test('C1-P inherits exact C1-O source, Kharuun option B and all holds',()=>{
 const d=fixtures();
 const copy=validateC1PReviewProposal(d.p,d.o,d.f);
 assert.equal(copy.regions[1].sourceArc.startVertex,35);
 assert.equal(copy.regions[1].sourceArc.endVertex,59);
 assert.equal(copy.regions[2].sourceArc.endVertex,349);
 assert.equal(copy.regions[3].sourceArc.startVertex,475);
 assert.equal(d.p.holds.canonicalWritable,false);
 assert.equal(d.p.holds.detachedIslandClaims,0);
 assert.equal(d.p.holds.shattercapPolygon,null);
 assert.equal(d.p.holds.coast40Claim,null);
 assert.equal(d.p.holds.foreignWindwardParent,'region.serathyl');
 assert.equal(d.p.holds.newLegacyHexDependencies,0);
 assert.deepEqual(d.p.ownerReviewDirection.kharuunSourceEdgeIndicesInclusive,[35,58]);
 assert.deepEqual(d.p.ownerReviewDirection.northeastHeadlandOriginalEdgesInclusive,[75,115]);
 assert.equal(d.p.previewChecks.nativeNodeAcceptanceClaimed,false);
});
test('Four revised source-indexed rings do not change C1-O coast arcs',()=>{
 const {baseline,revised,report}=check(fixtures());
 assert.equal(report.status,'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD');
 assert.equal(report.sourceOriginalContourUnmodified,undefined);
 assert.equal(report.originalSourceEdgesConserved,599);
 assert.equal(report.measurements,null);
 assert.equal(report.diagnostic.polygonOwnershipCollisions,0);
 assert.equal(report.diagnostic.sourceContourCrossings,0);
 for(let i=0;i<4;i++){
  assert.deepEqual(revised.regions[i].sourceEdgeIndices,
   baseline.regions[i].sourceEdgeIndices);
  assert.equal(revised.regions[i].sourceInlandProperCrossings,0);
  assert.equal(revised.regions[i].protectedOffshoreCrossings,0);
 }
 const k=revised.regions.find(x=>x.regionId==='region.kharuun_drylands');
 assert.deepEqual([k.sourceEdgeIndices[0],k.sourceEdgeIndices.at(-1)],[35,58]);
 assert.equal(k.sourceEdgeIndices.length,24);
});
test('Southeastern Verdant remains mainland and withheld islands remain outside',()=>{
 const {revised}=check(fixtures()),f=fixtures().f;
 const verdant=revised.regions.find(r=>r.regionId==='region.verdant_thalos');
 const veyrholm=revised.regions.find(r=>r.regionId==='region.veyrholm_shore');
 for(const point of f.reviewAnchors.verdantMustIncludePeninsula)
  assert.ok(c1oPointInRing(point,verdant.polygonRing));
 for(const point of f.reviewAnchors.veyrholmMustExcludeInland)
  assert.equal(c1oPointInRing(point,veyrholm.polygonRing),false);
 assert.equal(revised.protectedOffshore.length,3);
 for(const island of revised.protectedOffshore)for(const region of revised.regions)
  assert.ok(island.points.every(p=>!c1oPointInRing(p,region.polygonRing)));
});
test('C1-P fails closed if option B shifts or a fifth region is introduced',()=>{
 const d=fixtures();
 d.p.regions[1].sourceArc.startVertex=30;
 assert.throws(()=>validateC1PReviewProposal(d.p,d.o,d.f),/source-indexed coast/);
 const e=fixtures();e.p.regions.push(structuredClone(e.p.regions[0]));
 assert.throws(()=>validateC1PReviewProposal(e.p,e.o,e.f),/source witness|region identifiers/);
});
test('C1-P rejects false island, foreign parent, port and canonical promotions',()=>{
 for(const change of [
  p=>p.holds.canonicalWritable=true,
  p=>p.holds.detachedIslandClaims=1,
  p=>p.holds.shattercapPolygon={outer:[]},
  p=>p.holds.foreignWindwardParent='region.verdant_thalos',
  p=>p.holds.portPlacements=1,
  p=>p.holds.newLegacyHexDependencies=1,
  p=>p.ownerReviewDirection.northeastHeadlandOwnership='VEYR',
 ]){
  const d=fixtures();change(d.p);
  assert.throws(()=>validateC1PReviewProposal(d.p,d.o,d.f),/HOLD/);
 }
});
test('C1-P rejects fingerprint drift and false native acceptance',()=>{
 for(const change of [
  p=>p.sourceBiomePngSha256='different',
  p=>p.sourceVectorBlob='different',
  p=>p.previewChecks.nativeNodeAcceptanceClaimed=true,
  p=>p.previewChecks.newComponent30TerrainCellMeasurements=123,
  p=>p.previewChecks.sourceBiomeIsCertifiedLandWaterOrBiomes=true,
 ]){
  const d=fixtures();change(d.p);
  assert.throws(()=>validateC1PReviewProposal(d.p,d.o,d.f),/HOLD/);
 }
});
test('Expanded interior corridor crossing or inclusion remains blocked',()=>{
 const d=fixtures();
 d.p.regions[3].inlandWaypoints[5]=[350,250];
 assert.throws(()=>check(d),/HOLD|World coordinate/);
});
test('Synthetic no-mainland raster cannot certify C1-P terrain allocations',()=>{
 const d=fixtures();
 const world=read('packages/content/base/world/world_map_features.json').records
  .find(x=>x.mapId==='world_map.first_world');
 const selected=selectC1JOriginalVectorEdges(world,d.j);
 assert.throws(()=>buildC1PRegionalReview({...d,selected,
  labels:new Uint16Array(2048*1152)}),/HOLD/);
});
