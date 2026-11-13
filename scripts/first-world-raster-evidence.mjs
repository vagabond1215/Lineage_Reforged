#!/usr/bin/env node
/**
 * First World Pass 0: independent source-raster witness + Coast 10/40 pilot.
 * READ ONLY: --check (JSON stdout), --svg-pilot (SVG stdout).
 * NO --write switch, no canonical polygon, settlement, biome or Save mutation.
 *
 * node scripts/first-world-raster-evidence.mjs --check > evidence.json
 * node scripts/first-world-raster-evidence.mjs --svg-pilot > kaelvar-pilot.svg
 */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {decodeSourcePng,registeredSourceMask,labelLandComponents,diagonalJoinEvidence}
  from './lib/first-world-source-png.mjs';
import {planReviewedMacroOwnership} from './lib/first-world-reviewed-macro-planner.mjs';

const ROOT=resolve(fileURLToPath(new URL('..',import.meta.url)));
const WIDTH=2048,HEIGHT=1152;
const args=process.argv.slice(2);
if(args.length!==1||!['--check','--svg-pilot'].includes(args[0])){
  console.error('Usage: node scripts/first-world-raster-evidence.mjs --check|--svg-pilot');
  process.exit(2);
}
const load=p=>JSON.parse(readFileSync(resolve(ROOT,p),'utf8').replace(/^\uFEFF/,''));
const world=load('packages/content/base/world/world_maps.json').records
  .find(r=>r.id==='world_map.first_world');
const feature=load('packages/content/base/world/world_map_features.json').records
  .find(r=>r.mapId==='world_map.first_world');
const regions=load('packages/content/base/world/regions.json').records;
const excludes=load('docs/design/first-world-offshore-square-artifact-removal-2026-11-12.json')
  .removedSourceFeatureIds;
if(!world||!feature||excludes.length!==42||new Set(excludes).size!==42)
  throw Error('Source identities / owner-approved exclusions have changed');
if(feature.referenceImageWidthPx!==WIDTH||feature.referenceImageHeightPx!==HEIGHT||
   world.scaleProfile.referenceImageWidthPx!==WIDTH||
   world.scaleProfile.referenceImageHeightPx!==HEIGHT)
  throw Error('2048x1152 reference registration mismatch');
const excluded=new Set(excludes);
const sourceParts=feature.regionFootprints;
const parts=sourceParts.filter(p=>!excluded.has(p.id));
if(parts.length!==159||!([159,201].includes(sourceParts.length))||
   feature.coastlines.length!==68)
  throw Error('Source fingerprint changed; review inventory before proceeding');
const sources={};
for(const layer of ['biome','elevation']){
  const path=world.layerAssetPaths[layer];
  const raw=readFileSync(resolve(ROOT,path));
  const png=decodeSourcePng(raw);
  sources[layer]={path,sha256:createHash('sha256').update(raw).digest('hex'),
    nativeWidth:png.width,nativeHeight:png.height,
    bitDepth:png.bitDepth,colorType:png.colorType};
  if(world.assetReferenceRectPx.x+world.assetReferenceRectPx.width>png.width||
     world.assetReferenceRectPx.y+world.assetReferenceRectPx.height>png.height)
    throw Error('Map source crop not registered within '+layer+' image');
  if(layer==='biome')sources.biome.decoded=png;
}
if(sources.biome.nativeWidth!==sources.elevation.nativeWidth||
   sources.biome.nativeHeight!==sources.elevation.nativeHeight)
  throw Error('Biome and elevation natural dimensions diverge: manual registration review required');
const landMask=registeredSourceMask(sources.biome.decoded,world.assetReferenceRectPx,WIDTH,HEIGHT);
delete sources.biome.decoded;
const four=labelLandComponents(landMask,WIDTH,HEIGHT,false);
const eight=labelLandComponents(landMask,WIDTH,HEIGHT,true);
const joins=diagonalJoinEvidence(four,eight);
const byId=new Map(regions.map(r=>[r.id,r]));
const macroOf=p=>{
  const region=byId.get(p.regionIds?.[0]);
  if(!region)throw Error('Footprint owner not found: '+p.id);
  return region.regionType==='subregion'?region.parentRegionId:region.id;
};
const macros=new Set(regions.filter(r=>['continent','island_system'].includes(r.regionType)).map(r=>r.id));

/** Visit exact reference pixel centers in a polygon without inferred topology. */
function visit(points,fn){
  if(!points||points.length<3)throw Error('Invalid source feature vertices');
  const minY=Math.max(0,Math.floor(Math.min(...points.map(p=>p.y))-.5));
  const maxY=Math.min(HEIGHT-1,Math.ceil(Math.max(...points.map(p=>p.y))-.5));
  for(let y=minY;y<=maxY;y++){
    const scanY=y+.5,xs=[];
    for(let i=0,j=points.length-1;i<points.length;j=i++){
      const a=points[i],b=points[j];
      if((a.y>scanY)!==(b.y>scanY))
        xs.push(a.x+(scanY-a.y)*(b.x-a.x)/(b.y-a.y));
    }
    xs.sort((a,b)=>a-b);
    for(let i=0;i+1<xs.length;i+=2){
      const left=Math.max(0,Math.ceil(xs[i]-.5));
      const right=Math.min(WIDTH-1,Math.ceil(xs[i+1]-.5)-1);
      for(let x=left;x<=right;x++)fn(y*WIDTH+x,x,y);
    }
  }
}
function assess(p) {
  let cells=0,landCells=0,waterCells=0;
  const c4=new Set(),c8=new Set();
  visit(p.points,i=>{
    cells++;
    if(landMask[i]){landCells++;c4.add(four.labels[i]);c8.add(eight.labels[i]);}
    else waterCells++;
  });
  return {id:p.id,referenceAreaPx2:cells,rasterLandPx2:landCells,
    rasterWaterPx2:waterCells,connectedFourIds:[...c4].sort((a,b)=>a-b),
    connectedEightIds:[...c8].sort((a,b)=>a-b)};
}
const coastlineEvidence=feature.coastlines.map(assess);
const footprintEvidence=parts.map(p=>({...assess(p),regionId:p.regionIds[0],macroId:macroOf(p)}));
const retainedById=new Map(parts.map(p=>[p.id,p]));
const pilotParts=[
 'feature.region_windward_spine.part_1',
 'feature.region_windward_spine.part_2',
 'feature.region_verdant_thalos.part_6',
];
const pilotCoastIds=[10,40].map(i=>'feature.coastline.first_world.part_'+i);
const pilotCoasts=pilotCoastIds.map(id=>feature.coastlines.find(p=>p.id===id));
if(pilotCoasts.some(x=>!x)||pilotParts.some(id=>!retainedById.has(id)))
  throw Error('Coast 10/40 pilot provenance changed');
const selected=new Map(pilotParts.map(id=>[id,assess(retainedById.get(id))]));
// Independent pixel truth does not approve a political boundary.
const ownerPlan=planReviewedMacroOwnership({
  width:WIDTH,height:HEIGHT,landMask,componentByCell:four.labels,
  regions,decisions:[],anchors:[],
});
const report={
  schemaVersion:1,disposition:'READ_ONLY_RASTER_WITNESS_OWNER_REVIEW_REQUIRED',
  baseAuditCommit:'41a8ab1dd8c35cae12c8b392fa12da55c74401db',
  method:'Native source PNG decode; nearest-neighbor reference-cell registration; original RGB water threshold; 4/8 connectivity; no vector-derived terrain',
  registration:{referenceWidth:WIDTH,referenceHeight:HEIGHT,
    crop:world.assetReferenceRectPx,biome:sources.biome,elevation:sources.elevation,
    resampling:'nearest source center; intentionally not the old generator bicubic interpolation'},
  counts:{originalFootprints:sourceParts.length,retainedFootprints:parts.length,
    approvedArtifactExclusions:excluded.size,remainingApprovedArtifacts:parts.filter(p=>excluded.has(p.id)).length,
    coastlineParts:feature.coastlines.length,allLandPixels:ownerPlan.totalLandCells,
    fourNeighborLandmasses:four.components.length,
    eightNeighborLandmasses:eight.components.length,diagonalOnlyJoins:joins.length},
  fourNeighborComponents:four.components,
  eightNeighborComponents:eight.components,
  diagonalJoins:joins,
  coastlineEvidence,
  footprintEvidence,
  pilot:{status:'BOUNDARY_NOT_APPROVED',
    coastIds:pilotCoastIds,
    sourcePartEvidence:[...selected.values()],
    instruction:'Review PNG crop and 4/8 connectivity in Coast 10 and Coast 40; do not transfer Windward to Kaelvar until spatial macro masks and child split are signed off'},
  ownerPlan:{status:ownerPlan.status,sourceWritable:ownerPlan.sourceWritable,
    unassignedMacroCells:ownerPlan.unassignedMacroCells,
    assignedMacroCells:ownerPlan.assignedMacroCells},
};
function pilotSvg(){
  const pts=pilotCoasts.flatMap(c=>c.points);
  const pad=14,minX=Math.max(0,Math.floor(Math.min(...pts.map(p=>p.x))-pad)),
    maxX=Math.min(WIDTH,Math.ceil(Math.max(...pts.map(p=>p.x))+pad)),
    minY=Math.max(0,Math.floor(Math.min(...pts.map(p=>p.y))-pad)),
    maxY=Math.min(HEIGHT,Math.ceil(Math.max(...pts.map(p=>p.y))+pad));
  const width=maxX-minX,height=maxY-minY;
  const runs=[];
  for(let y=minY;y<maxY;y++){
    let start=-1;
    for(let x=minX;x<=maxX;x++){
      const isLand=x<maxX&&landMask[y*WIDTH+x]===1;
      if(isLand&&start<0)start=x;
      if(!isLand&&start>=0){runs.push('M'+start+' '+y+'h'+(x-start)+'v1h-'+(x-start)+'z');start=-1;}
    }
  }
  const shape=p=>p.points.map(q=>q.x+','+q.y).join(' ');
  const coastLines=pilotCoasts.map(p=>'<polygon points="'+shape(p)+'" fill="none" stroke="#f4c35d" stroke-width="1.4"/>').join('');
  const regionLines=parts.filter(p=>{
    const m=macroOf(p);return m==='region.kaelvar'||m==='region.serathyl';
  }).map(p=>'<polygon points="'+shape(p)+'" fill="none" stroke="'+
      (macroOf(p)==='region.kaelvar'?'#49a2f2':'#ed7178')+
      '" stroke-width="0.8" opacity="0.85"/>').join('');
  const focus=pilotParts.map(id=>'<polygon points="'+shape(retainedById.get(id))+
    '" fill="none" stroke="#fff" stroke-width="2.5"/>').join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+
    [minX,minY,width,height].join(' ')+'" width="'+width*2+'" height="'+height*2+
    '"><rect x="'+minX+'" y="'+minY+'" width="'+width+'" height="'+height+
    '" fill="#213d52"/><path d="'+runs.join('')+'" fill="#dae2c9"/>'+
    regionLines+coastLines+focus+'</svg>\n';
}
if(args[0]==='--svg-pilot')process.stdout.write(pilotSvg());
else process.stdout.write(JSON.stringify(report,null,2)+'\n');
