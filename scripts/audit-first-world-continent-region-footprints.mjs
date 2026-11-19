#!/usr/bin/env node
/**
 * Independent source-geometric audit of continent/subregion ownership and
 * connected coastline shapes. Does NOT mutate source, assert navigability,
 * or classify water by administrative labels.
 *
 * node scripts/audit-first-world-continent-region-footprints.mjs --json
 *
 * Pixels are source-reference pixels in a 2048x1152 map.
 * Geometry is raster-sampled at 2px centers, so narrow boundaries are advisory.
 */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
function read(path) {return JSON.parse(readFileSync(resolve(root,path),'utf8').replace(/^\uFEFF/,''));}
const f=read('packages/content/base/world/world_map_features.json').records[0];
const regions=read('packages/content/base/world/regions.json').records;
const manifest=read('docs/design/first-world-offshore-square-artifact-removal-2026-11-12.json');
const approved=new Set(manifest.removedSourceFeatureIds);
if(approved.size!==42)throw Error('Expected exactly 42 owner-approved removed fragments.');
const raw=f.regionFootprints, parts=raw.filter(p=>!approved.has(p.id));
if(parts.length!==159)throw Error('Expected 159 remaining polygons; observed '+parts.length);
const R=new Map(regions.map(r=>[r.id,r]));
const macros=regions.filter(r=>r.regionType==='continent'||r.regionType==='island_system');
const macroIndex=new Map(macros.map((r,i)=>[r.id,i]));
const subregionOwners=[...new Set(parts.map(p=>p.regionIds[0]))];
const subregionIndex=new Map(subregionOwners.map((s,i)=>[s,i]));
const macroOf=p=>{
 const r=R.get(p.regionIds?.[0]);
 if(!r)throw Error('Unknown region '+p.id);
 const id=r.regionType==='subregion'?r.parentRegionId:r.id;
 if(!macroIndex.has(id))throw Error('Unresolved macro owner '+p.id);
 return id;
};
const W=1024,H=576,N=W*H;
const macroGrid=new Uint16Array(N),subregionGrid=new Uint32Array(N),landGrid=new Uint8Array(N);
function samplePolygon(poly,fn){
 const p=poly.points;if(!p||p.length<3)return;
 const ys=p.map(q=>q.y);
 const lo=Math.max(0,Math.floor((Math.min(...ys)-1)/2));
 const hi=Math.min(H-1,Math.ceil((Math.max(...ys)-1)/2));
 for(let gy=lo;gy<=hi;gy++) {
  const y=gy*2+1,intersections=[];
  for(let i=0,j=p.length-1;i<p.length;j=i++) {
   const a=p[i],b=p[j];
   if((a.y>y)!==(b.y>y))intersections.push(a.x+(y-a.y)*(b.x-a.x)/(b.y-a.y));
  }
  intersections.sort((a,b)=>a-b);
  for(let k=0;k+1<intersections.length;k+=2) {
   const start=Math.max(0,Math.ceil((intersections[k]-1)/2));
   const stop=Math.min(W-1,Math.floor((intersections[k+1]-1)/2));
   for(let gx=start;gx<=stop;gx++)fn(gy*W+gx);
  }
 }
}
for(const p of parts){
 const macro=macroIndex.get(macroOf(p)),sub=subregionIndex.get(p.regionIds[0]);
 samplePolygon(p,i=>{macroGrid[i]|=1<<macro;subregionGrid[i]|=1<<sub;});
}
for(const p of f.coastlines)samplePolygon(p,i=>{landGrid[i]=1;});
const macroOverlap=new Map(),subregionOverlap=new Map(),perMacro=macros.map(m=>({
 id:m.id,name:m.name,kind:m.regionType,insideCoastPixels:0,outsideCoastPixels:0
}));
let overlapCells=0,waterFootprintCells=0,unassignedLandCells=0;
const overlapSamples=[];
for(let i=0;i<N;i++){
 const mask=macroGrid[i];
 if(mask&&!landGrid[i])waterFootprintCells++;
 if(landGrid[i]&&!mask)unassignedLandCells++;
 for(let j=0;j<macros.length;j++)if(mask&(1<<j)){
  if(landGrid[i])perMacro[j].insideCoastPixels+=4;
  else perMacro[j].outsideCoastPixels+=4;
 }
 if(mask&&(mask&(mask-1))){
  overlapCells++;
  const owners=macros.filter((m,j)=>mask&(1<<j)).map(x=>x.id);
  if(overlapSamples.length<25)overlapSamples.push({
    x:2*(i%W)+1,y:2*Math.floor(i/W)+1,owners
  });
  for(let a=0;a<macros.length;a++)for(let b=a+1;b<macros.length;b++)
   if(mask&(1<<a) && mask&(1<<b)){
    const key=macros[a].id+' / '+macros[b].id;
    macroOverlap.set(key,(macroOverlap.get(key)||0)+4);
   }
 }
 const submask=subregionGrid[i];
 if(submask&&(submask&(submask-1))){
  for(let a=0;a<subregionOwners.length;a++)for(let b=a+1;b<subregionOwners.length;b++)
   if(submask&(1<<a)&&submask&(1<<b)) {
    const key=subregionOwners[a]+' / '+subregionOwners[b];
    subregionOverlap.set(key,(subregionOverlap.get(key)||0)+4);
   }
 }
}
const coastComponents=[];
for(const c of f.coastlines){
 const areas=Array(macros.length).fill(0);let total=0;
 samplePolygon(c,i=>{
  total+=4;
  for(let j=0;j<macros.length;j++)if(macroGrid[i]&(1<<j))areas[j]+=4;
 });
 const owned=areas.map((v,i)=>({id:macros[i].id,name:macros[i].name,areaPx2:v}))
  .filter(x=>x.areaPx2>=16).sort((a,b)=>b.areaPx2-a.areaPx2);
 const material=owned.filter(x=>x.areaPx2>=Math.max(500,total*.01));
 if(material.length>1)coastComponents.push({
  coastlinePartId:c.id,componentAreaPx2:total,owners:owned,materialOwnerCount:material.length,
  finding:'MULTIPLE_MACRO_OWNERS_ON_SINGLE_SOURCE_COAST_CONTOUR'
 });
}
const direct=[];
for(const p of parts){
 let cells=0,out=0;
 samplePolygon(p,i=>{cells++;if(!landGrid[i])out++;});
 if(cells>0 && out/cells>.95 && out>=10)
  direct.push({id:p.id,ownerRegion:p.regionIds[0],areaPx2:cells*4,
    outsideCoastlinePx2:out*4,offshoreSampleShare:Math.round(out/cells*1000)/10});
}
const missingIndependent=regions.filter(r=>r.regionType==='subregion'
  && !parts.some(p=>p.regionIds.includes(r.id)))
  .map(r=>({id:r.id,parentRegionId:r.parentRegionId}));
const results={
 status:macroOverlap.size?'MACRO_BOUNDARY_CONFLICT_CANDIDATES':'NO_MACRO_OVERLAP_AT_2PX_SAMPLE',
 scope:'READ_ONLY_POST_42_EXCLUSION_AUDIT',referenceFramePx:[2048,1152],
 sampling:'2x2 reference-pixel cell-center point fill; contours are drawn source geometry, not independent decoded PNG truth.',
 counts:{sourceFootprintParts:raw.length,verifiedRemovals:approved.size,
  excludedPartsPresentInSource:raw.length-parts.length,effectiveParts:parts.length,
  macroAreas:macros.length,subregions:regions.filter(r=>r.regionType==='subregion').length,
  subregionsWithNoIndependentFootprint:missingIndependent.length,
  macroOverlapSampledAreaPx2:overlapCells*4,footprintOutsideCoastSampledAreaPx2:waterFootprintCells*4,
  landNotCoveredByRegionSampledAreaPx2:unassignedLandCells*4,
  multiMacroCoastlineComponents:coastComponents.length},
 macroOwnership:perMacro,
 macroOverlapPairs:[...macroOverlap].map(([pair,areaPx2])=>({pair,areaPx2})).sort((a,b)=>b.areaPx2-a.areaPx2),
 subregionOverlapPairs:[...subregionOverlap].map(([pair,areaPx2])=>({pair,areaPx2})).sort((a,b)=>b.areaPx2-a.areaPx2),
 macroOverlapSamples:overlapSamples,
 multiMacroConnectedCoastlines:coastComponents.sort((a,b)=>b.componentAreaPx2-a.componentAreaPx2),
 possibleResidualOffshoreParts:direct.sort((a,b)=>b.areaPx2-a.areaPx2),
 subregionsWithoutDirectGeometry:missingIndependent,
 policy:'Do not auto-move boundaries, merge islands, fabricate ocean polygons or infer land travel. Resolve each multi-owner landmass only after original raster connectivity / threshold witness.'
};
console.log(process.argv.includes('--json')?JSON.stringify(results,null,2):
  [
   results.status,
   'Effective source parts: '+parts.length+' (42 approved exclusions)',
   'Direct cross-macro sampled overlap: '+(overlapCells*4)+' px²',
   'Mixed-ownership coastline contours: '+coastComponents.length,
   'Subregions lacking direct geometry: '+missingIndependent.length,
   'Footprint outside coastline samples: '+(waterFootprintCells*4)+' px²',
   'Run with --json for the complete evidence ledger.'
  ].join('\n'));
