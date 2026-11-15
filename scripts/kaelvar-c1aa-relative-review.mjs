#!/usr/bin/env node
/** Read-only C1-AA authoring experiment. Not a production region resolver.
 * Original C1-P/C1-Z contracts stay frozen; only in-memory clones can touch.
 */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {readPinnedCommittedVectorSource} from './lib/world-source-git-witness.mjs';
import {decodeSourcePng} from './lib/kaelvar-c1f-source-png.mjs';
import {registeredTerrainCandidates,checkedC1FMainland} from './lib/kaelvar-c1f-source-raster.mjs';
import {selectC1JOriginalVectorEdges} from './lib/kaelvar-c1j-vector-coastline-review.mjs';
import {buildC1PRegionalReview,validateC1PReviewProposal} from './lib/kaelvar-c1p-regional-seam-review.mjs';
import {buildC1ORegionalGeometry,c1oPointInRing} from './lib/kaelvar-c1o-regional-boundaries.mjs';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const json=p=>JSON.parse(readFileSync(resolve(root,p),'utf8').replace(/^\uFEFF/,''));
const same=(a,b)=>a.x===b.x&&a.y===b.y;
const point=p=>({x:p[0],y:p[1]});
const on=(p,a,b)=>Math.abs((b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x))<1e-9&&
 p.x>=Math.min(a.x,b.x)&&p.x<=Math.max(a.x,b.x)&&p.y>=Math.min(a.y,b.y)&&p.y<=Math.max(a.y,b.y);
const boundary=(p,ring)=>ring.some((a,i)=>on(p,a,ring[(i+1)%ring.length]));
const edgeDirection=(ring,a,b)=>ring.some((p,i)=>same(p,a)&&same(ring[(i+1)%ring.length],b))?1:
 ring.some((p,i)=>same(p,b)&&same(ring[(i+1)%ring.length],a))?-1:0;

export function validateSharedEdges(regions,candidates){
 for(const c of candidates){
  const pair=c.regionIds.map(id=>regions.find(r=>r.regionId===id));
  assert.ok(pair.length===2&&pair.every(Boolean),'missing incident region');
  for(let i=1;i<c.sharedChain.length;i++){
   const a=point(c.sharedChain[i-1]),b=point(c.sharedChain[i]);
   assert.equal(edgeDirection(pair[0].polygonRing,a,b)*edgeDirection(pair[1].polygonRing,a,b),-1,
    'shared edge must appear exactly in opposite directions');
  }
 }
 // Proper crossings are rejected by the existing source geometry builder.
 // Also reject vertex/edge-midpoint interior containment (including collinear overlaps).
 for(let i=0;i<regions.length;i++)for(let j=0;j<regions.length;j++)if(i!==j){
  const a=regions[i].polygonRing,b=regions[j].polygonRing;
  for(let k=0;k<a.length;k++)for(const p of [a[k],{x:(a[k].x+a[(k+1)%a.length].x)/2,y:(a[k].y+a[(k+1)%a.length].y)/2}])
   assert.ok(!c1oPointInRing(p,b)||boundary(p,b),'interior polygon overlap');
 }
}

/** Raster diagnostic tie handling only; cannot promote physical candidates. */
export function reviewSample(p,regions,candidates,physicalLabel=30){
 if(physicalLabel!==30)return {regionId:null,tie:false};
 const hits=regions.filter(r=>c1oPointInRing(p,r.polygonRing));
 if(hits.length<2)return {regionId:hits[0]?.regionId??null,tie:false};
 assert.ok(hits.every(r=>boundary(p,r.polygonRing)),'interior overlap is not an edge tie');
 assert.equal(hits.length,2,'undeclared multi-region junction');
 assert.ok(candidates.some(c=>hits.every(r=>c.regionIds.includes(r.regionId))&&
  c.sharedChain.slice(1).some((b,i)=>on(p,point(c.sharedChain[i]),point(b)))),'undeclared shared boundary');
 return {regionId:hits.map(r=>r.regionId).sort()[0],tie:true};
}

export function loadRelativeReview(){
 const spec=json('docs/design/kaelvar-c1aa-relative-relief-shared-seams-2026-11-15.json');
 assert.equal(spec.type,'C1AA_RELATIVE_RELIEF_SHARED_SEAMS_REVIEW_ONLY');
 assert.equal(spec.canonicalWritable,false);assert.equal(spec.acceptedC1PChanged,false);
 assert.equal(spec.physicalLabelsChanged,false);assert.equal(spec.sourceAssumption.numericElevation,false);
 assert.equal(spec.sourceAssumption.hydrologicalModel,false);
 assert.equal(spec.boundaryRule,'LEXICOGRAPHIC_REGION_ID_ON_DECLARED_SHARED_EDGE_ONLY');
 const p=json('docs/design/kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json');
 const o=json(p.C1ORegionProposalPath),f=json(o.sourcePaths.c1f),n=json(o.sourcePaths.c1n),j=json(o.sourcePaths.c1j),m=json(o.sourcePaths.c1m);
 const {sourceBlob,sourceBytes}=readPinnedCommittedVectorSource({repoRoot:root,sourcePath:o.source.path,acceptedBlobShas:[p.sourceVectorBlob]});
 const source=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,'')).records.find(x=>x.mapId==='world_map.first_world');
 const selected=selectC1JOriginalVectorEdges(source,j);
 const ledger=json(f.sourceC1LedgerPath),images={},hashes={};
 for(const layer of ['biome','elevation']){
  const bytes=readFileSync(resolve(root,'packages/content/base/world/map_assets/First World '+(layer==='biome'?'Biome':'Elevation')+'.png'));
  hashes[layer]=createHash('sha256').update(bytes).digest('hex');
  assert.equal(hashes[layer],ledger.sourceWitness[layer+'Sha256']);
  images[layer]={bytes,img:decodeSourcePng(bytes)};
 }
 const world=json('packages/content/base/world/world_maps.json').records.find(x=>x.id==='world_map.first_world');
 assert.deepEqual(world.assetReferenceRectPx,ledger.sourceWitness.crop);
 const {labels}=checkedC1FMainland(registeredTerrainCandidates({biome:images.biome.img,elevation:images.elevation.img,crop:ledger.sourceWitness.crop,width:2048,height:1152}));
 const prior=buildC1PRegionalReview({p,o,f,n,j,m,selected,labels});
 const base=validateC1PReviewProposal(p,o,f),before=JSON.stringify(base),baseline=prior.imageMasks.refined;
 const scenarios=[];
 for(const chosen of [[spec.candidates[0]],[spec.candidates[1]],spec.candidates]){
  const proposal=structuredClone(base);
  for(const c of chosen)for(const edit of c.replacements){
   const row=proposal.regions.find(r=>r.id===edit.regionId);
   const chain=structuredClone(c.sharedChain);if(edit.reverse)chain.reverse();
   row.inlandWaypoints.splice(edit.start,edit.deleteCount,...chain);
  }
  const geometry=buildC1ORegionalGeometry({proposal,selected,c1n:n,c1f:f});
  validateSharedEdges(geometry.regions,chosen);
  for(let i=0;i<4;i++)assert.deepEqual(geometry.regions[i].sourceCoastEdgeOriginalPoints,prior.revised.regions[i].sourceCoastEdgeOriginalPoints);
  for(const island of selected.offshore)for(const r of geometry.regions)
   assert.ok(!island.points.some(q=>c1oPointInRing(q,r.polygonRing)),'detached contour claim');
  const counts=Object.fromEntries(geometry.regions.map(r=>[r.regionId,0]));
  let assigned=0,ties=0,changed=0,unresolvedNewEnvelopeSamples=0;
  const changedSamples=[];
  const bounds={minX:Math.min(...geometry.regions.map(r=>r.bounds.minX)),maxX:Math.max(...geometry.regions.map(r=>r.bounds.maxX)),minY:Math.min(...geometry.regions.map(r=>r.bounds.minY)),maxY:Math.max(...geometry.regions.map(r=>r.bounds.maxY))};
  for(let y=Math.floor(bounds.minY);y<Math.ceil(bounds.maxY);y++)for(let x=Math.floor(bounds.minX);x<Math.ceil(bounds.maxX);x++){
   const q={x:x+.5,y:y+.5},i=y*2048+x;
   const hits=geometry.regions.filter(r=>c1oPointInRing(q,r.polygonRing));
   if(hits.length)assert.ok(c1oPointInRing(q,geometry.originalContour),'outside original mainland contour');
   const sample=reviewSample(q,geometry.regions,chosen,labels[i]);
   if(labels[i]!==30){
    if(hits.length&&!prior.revised.regions.some(r=>c1oPointInRing(q,r.polygonRing))){
     assert.equal(labels[i],0,'new envelope enters held detached component');
     unresolvedNewEnvelopeSamples++;
    }
    continue;
   }
   if(sample.regionId){assigned++;counts[sample.regionId]++;}if(sample.tie)ties++;
   const old=baseline[i]?prior.revised.regions[baseline[i]-1].regionId:null;
   if(old!==sample.regionId){
    assert.equal(old,null,'existing regional sample changed');
    assert.ok(chosen.some(c=>c.regionIds.includes(sample.regionId)&&x>=c.changeWindow.minX&&x<=c.changeWindow.maxX&&y>=c.changeWindow.minY&&y<=c.changeWindow.maxY),'change outside bounded review '+JSON.stringify({scenario:chosen.map(c=>c.id),x,y,regionId:sample.regionId}));
    changed++;changedSamples.push({x,y,regionId:sample.regionId});
   }
  }
  assert.equal(assigned,52449+changed);assert.ok(assigned<79419);
  scenarios.push({id:chosen.length===2?'BOTH_SHARED_SEAMS':chosen[0].id,status:'VALID_REVERSIBLE_SHARED_SEAM_REVIEW_ONLY',perRegion:counts,assigned,unassigned:79419-assigned,changedOriginalComponent30Samples:changed,changedSamplesSha256:createHash('sha256').update(JSON.stringify(changedSamples)).digest('hex'),sharedEdgeSampleTies:ties,unresolvedNewEnvelopeSamples,unresolvedSamplesAssigned:0,detachedClaims:0,regionalInteriorCollisions:0,sourceCoastCrossings:0,protectedAnchorsPreserved:true,candidates:chosen,regionCandidates:geometry.regions.map(r=>({regionId:r.regionId,candidatePolygonVertices:r.polygonRing}))});
 }
 assert.equal(JSON.stringify(base),before);
 return {images,report:{status:'C1AA_QUALITATIVE_SHARED_SEAMS_PROVISIONAL_NOT_CANONICAL',source:{vectorBlob:sourceBlob,...hashes},interpretation:spec.sourceAssumption,baseline:{assigned:52449,unassigned:26970,component30:79419,perRegion:[5632,18624,19182,9011]},scenarios,acceptedC1PChanged:false,sourcePixelsChanged:0,physicalLabelsChanged:0,canonicalWritable:false,unresolvedNewEnvelopeSamplesAreNotLandClaims:true,holds:spec.holds}};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 assert.equal(process.argv[2],'--check','Usage: node scripts/kaelvar-c1aa-relative-review.mjs --check');
 const {report}=loadRelativeReview();process.stdout.write(JSON.stringify(report,null,2)+'\n');
}
