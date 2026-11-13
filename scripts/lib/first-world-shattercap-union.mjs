/**
 * Deduplicated Shattercap source-terrain inventory. READ ONLY.
 * Existing political polygons are sampled on original terrain candidate pixels,
 * never treated as the authority for physical land, biome or sovereignty.
 */
import {visitRasterPolygon} from './first-world-component-review.mjs';
import {SourcePairClass} from './first-world-source-pair-qa.mjs';
import {embeddedCropPng} from './first-world-coast10-ecology-review.mjs';

const TERRAIN=SourcePairClass.DIVERGENT_TERRAIN_CANDIDATE;
const INK=SourcePairClass.SHARED_NONBLUE_UNRESOLVED;
const BLUE=SourcePairClass.SHARED_BLUE_CANDIDATE;
const share=(n,d)=>d?Number((100*n/d).toFixed(2)):null;
const bounds=pts=>({
  minX:Math.min(...pts.map(p=>p.x)),maxX:Math.max(...pts.map(p=>p.x)),
  minY:Math.min(...pts.map(p=>p.y)),maxY:Math.max(...pts.map(p=>p.y)),
});
function validate(width,height,classification,terrainLabels,footprints) {
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
     classification?.length!==width*height||
     terrainLabels?.length!==width*height||!Array.isArray(footprints))
    throw Error('Shattercap union grid or catalogs invalid');
}
function sourceParts(footprints,regionId){
  const selected=footprints.filter(p=>p.regionIds?.[0]===regionId);
  if(!selected.length||new Set(selected.map(p=>p.id)).size!==selected.length)
    throw Error('Shattercap footprint identity missing or duplicated');
  return selected.sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
}
export function buildShattercapUnionEvidence({
  width,height,classification,terrainLabels,footprints,mainlandReferenceId,
  regionId='region.shattercap_isles',
}) {
  validate(width,height,classification,terrainLabels,footprints);
  if(!Number.isInteger(mainlandReferenceId)||mainlandReferenceId<=0)
    throw Error('Missing independent terrain-only mainland reference component');
  const parts=sourceParts(footprints,regionId);
  const cover=new Uint16Array(width*height);
  const partRows=[];
  let summedTerrain=0;
  for(const p of parts){
    let sourceCells=0,terrainCells=0,sharedInk=0,blue=0,other=0;
    const comps=new Map();
    visitRasterPolygon(p.points,width,height,(i,x,y)=>{
      sourceCells++;
      const cl=classification[i];
      if(cl!==TERRAIN){
        if(cl===INK)sharedInk++;
        else if(cl===BLUE)blue++;
        else other++;
        return;
      }
      const componentId=terrainLabels[i];
      if(!componentId)throw Error('Candidate terrain pixel has no physical component label');
      if(cover[i]===65535)throw Error('Excessive duplicate terrain polygon coverage');
      cover[i]++;
      terrainCells++;
      const m=comps.get(componentId)||0;
      comps.set(componentId,m+1);
    });
    summedTerrain+=terrainCells;
    partRows.push({
      sourcePartId:p.id,sourcePolygonCells:sourceCells,
      terrainCandidateCells:terrainCells,sharedInkCells:sharedInk,
      blueCandidateCells:blue,otherUnresolvedCells:other,
      terrainOnlyComponents:[...comps].sort((a,b)=>b[1]-a[1]||a[0]-b[0])
        .map(([componentId,pixels])=>({componentId,pixels})),
      provenance:'EXISTING_SOURCE_POLYGON_NOT_REPAIRED_REGION',
    });
  }
  const comps=new Map();
  let unique=0,mainlandUnique=0,overlapCells=0,overlapExcess=0;
  for(let i=0;i<cover.length;i++){
    if(!cover[i])continue;
    unique++;
    const x=i%width,y=(i-x)/width,id=terrainLabels[i];
    if(id===mainlandReferenceId)mainlandUnique++;
    if(cover[i]>1){overlapCells++;overlapExcess+=cover[i]-1;}
    const entry=comps.get(id)||{
      componentId:id,uniqueTerrainCells:0,summedMemberships:0,
      duplicateCoverageCells:0,terrainBounds:{minX:width,minY:height,maxX:-1,maxY:-1},
      centerSumX:0,centerSumY:0,
    };
    entry.uniqueTerrainCells++;entry.summedMemberships+=cover[i];
    if(cover[i]>1)entry.duplicateCoverageCells++;
    entry.terrainBounds.minX=Math.min(entry.terrainBounds.minX,x);
    entry.terrainBounds.maxX=Math.max(entry.terrainBounds.maxX,x);
    entry.terrainBounds.minY=Math.min(entry.terrainBounds.minY,y);
    entry.terrainBounds.maxY=Math.max(entry.terrainBounds.maxY,y);
    entry.centerSumX+=x+.5;entry.centerSumY+=y+.5;
    comps.set(id,entry);
  }
  if(summedTerrain!==unique+overlapExcess)
    throw Error('Shattercap source polygon union accounting mismatch');
  const componentRows=[...comps.values()].map(({centerSumX,centerSumY,...entry})=>({
    ...entry,terrainCentroid:{
      x:Number((centerSumX/entry.uniqueTerrainCells).toFixed(2)),
      y:Number((centerSumY/entry.uniqueTerrainCells).toFixed(2)),
    },
    mainlandReference:entry.componentId===mainlandReferenceId,
    interpretation:'PHYSICAL_COMPONENT_NOT_APPROVED_NORTHERN_OR_SOUTHERN_REGION',
  })).sort((a,b)=>b.uniqueTerrainCells-a.uniqueTerrainCells||
    a.componentId-b.componentId);
  return {
    schemaVersion:1,status:'SHATTERCAP_DEDUPLICATED_TERRAIN_UNION_REVIEW',
    regionId,mainlandReferenceId,
    selectedFootprintCount:parts.length,
    summedFootprintTerrainCells:summedTerrain,
    deduplicatedTerrainCells:unique,
    sourcePolygonOverlapCells:overlapCells,
    sourcePolygonOverlapExcessMemberships:overlapExcess,
    terrainCellsOnReferenceMainland:mainlandUnique,
    terrainCellsOffReferenceMainland:unique-mainlandUnique,
    referenceMainlandShareOfUniqueTerrainPercent:share(mainlandUnique,unique),
    partsWithoutTerrainCandidates:partRows.filter(p=>p.terrainCandidateCells===0)
      .map(p=>p.sourcePartId),
    sourcePartRows:partRows,
    componentRows,
    reviewGate:'Verify southern/eastern detached islands geographically before any Shattercap or Windward boundary transfer. Zero-terrain parts remain under review.',
    approvedNewBorders:null,sourceWritable:false,
  };
}

/**
 * Baseline-only 2-panel inventory with numbered positions of every source
 * Shattercap polygon. Orange pixels share Auric's terrain-only mainland,
 * teal pixels lie on other physical components, and purple is duplicated
 * Shattercap coverage. Nothing marks approved regional sovereignty.
 */
export function shattercapInventorySvg({
  width,height,classification,terrainLabels,biomeRgba,footprints,
  mainlandReferenceId,regionId='region.shattercap_isles',
}) {
  validate(width,height,classification,terrainLabels,footprints);
  if(biomeRgba?.length!==width*height*4)
    throw Error('Shattercap original biome registration mismatch');
  const parts=sourceParts(footprints,regionId);
  const all=parts.flatMap(p=>p.points),b=bounds(all);
  const pad=32;
  const roi={minX:Math.max(0,Math.floor(b.minX)-pad),
    maxX:Math.min(width,Math.ceil(b.maxX)+pad),
    minY:Math.max(0,Math.floor(b.minY)-pad),
    maxY:Math.min(height,Math.ceil(b.maxY)+pad)};
  roi.width=roi.maxX-roi.minX;roi.height=roi.maxY-roi.minY;
  if(roi.width<1||roi.height<1)throw Error('Empty Shattercap locator crop');
  const png=embeddedCropPng(biomeRgba,width,height,roi);
  const cover=new Uint8Array(roi.width*roi.height);
  for(const part of parts){
    visitRasterPolygon(part.points,width,height,(index,x,y)=>{
      if(classification[index]!==TERRAIN||x<roi.minX||x>=roi.maxX||
         y<roi.minY||y>=roi.maxY)return;
      const i=(y-roi.minY)*roi.width+x-roi.minX;
      cover[i]=Math.min(3,cover[i]+1);
    });
  }
  const runs=new Map();
  for(let y=0;y<roi.height;y++){
    let x=0;
    while(x<roi.width){
      const index=(y+roi.minY)*width+x+roi.minX;
      const local=y*roi.width+x;
      const color=!cover[local]?null:cover[local]>1?'#B44FBE':
        terrainLabels[index]===mainlandReferenceId?'#E88724':'#1BAAB5';
      if(!color){x++;continue;}
      const start=x++;
      while(x<roi.width){
        const q=y*roi.width+x,j=(y+roi.minY)*width+x+roi.minX;
        const other=!cover[q]?null:cover[q]>1?'#B44FBE':
          terrainLabels[j]===mainlandReferenceId?'#E88724':'#1BAAB5';
        if(other!==color)break;x++;
      }
      if(!runs.has(color))runs.set(color,[]);
      runs.get(color).push('M'+start+' '+y+'h'+(x-start)+'v1h-'+(x-start)+'z');
    }
  }
  const fills=[...runs].map(([color,path])=>
    '<path fill="'+color+'" fill-opacity=".8" d="'+path.join('')+'"/>').join('');
  const outlines=parts.map(p=>'<polygon points="'+p.points.map(q=>
    (q.x-roi.minX)+','+(q.y-roi.minY)).join(' ')+
    '" fill="none" stroke="#612d5d" stroke-width=".65" vector-effect="non-scaling-stroke"/>').join('');
  const labels=parts.map(p=>{
    const b=bounds(p.points),cx=(b.minX+b.maxX)/2-roi.minX,
      cy=(b.minY+b.maxY)/2-roi.minY;
    const id=p.id.match(/\.part_(\d+)$/)?.[1]||'?';
    return '<circle cx="'+cx+'" cy="'+cy+'" r="7" fill="#FFFFFF" stroke="#1f3545" stroke-width="1" vector-effect="non-scaling-stroke"/>'+
      '<text x="'+cx+'" y="'+(cy+3)+'" font-family="sans-serif" text-anchor="middle" font-size="9" fill="#102b40">'+id+'</text>';
  }).join('');
  const zoom=1.8,pw=roi.width*zoom,ph=roi.height*zoom,
    W=Math.ceil(50+2*pw+24),H=Math.ceil(128+ph+110);
  const panel=(k,title,overlay='')=>{
    const x=20+k*(pw+24);
    return '<text x="'+x+'" y="92" fill="#193649" font-family="sans-serif" font-size="18">'+title+'</text>'+
      '<svg x="'+x+'" y="128" width="'+pw+'" height="'+ph+
      '" viewBox="0 0 '+roi.width+' '+roi.height+'">'+
      '<image href="'+png+'" width="'+roi.width+'" height="'+roi.height+'"/>'+
      overlay+'</svg>';
  };
  return {
    svg:'<svg xmlns="http://www.w3.org/2000/svg" width="'+W+
      '" height="'+H+'" viewBox="0 0 '+W+' '+H+'"><title>Shattercap source-island locator, no territorial changes</title>'+
      '<rect width="'+W+'" height="'+H+'" fill="#F6F7F5"/>'+
      '<text x="20" y="36" font-family="sans-serif" font-size="25" fill="#193649">'+
      'Shattercap 15-part geographic inventory</text>'+
      '<text x="20" y="62" font-family="sans-serif" font-size="15" fill="#425a68">'+
      'Original source terrain. Labels identify existing source part numbers, not approved borders.</text>'+
      panel(0,'Original source biome (palette uncalibrated)')+
      panel(1,'Orange: reference mainland | Teal: detached | Purple: overlap',
        fills+outlines+labels)+
      '<text x="20" y="'+(H-55)+'" font-family="sans-serif" font-size="15" fill="#425a68">'+
      'Source candidate terrain only; ink, water, and small islands remain preserved for separate review.</text>'+
      '<text x="20" y="'+(H-28)+'" font-family="sans-serif" font-size="14" fill="#425a68">'+
      'Detached components are not necessarily northern. Zero-terrain parts are never silently removed.</text>'+
      '</svg>\n',
    roi,sourcePartCount:parts.length,
    status:'ORIGINAL_SOURCE_FOOTPRINTS_NO_POLITICAL_TRANSFER',
    readOnly:true,
  };
}
