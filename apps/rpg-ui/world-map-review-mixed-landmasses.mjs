/**
 * Read-only 2px-cell-center source-vector audit for mixed macro ownership on a
 * traced coastline. No PNG classification, true land connectivity, pathing, or
 * canonical settlement/boundary mutation occurs here.
 */
export const MIXED_LANDMASS_STEP_PX = 2;
const FRAME_WIDTH = 2048, FRAME_HEIGHT = 1152;
const WIDTH = FRAME_WIDTH / MIXED_LANDMASS_STEP_PX;
const HEIGHT = FRAME_HEIGHT / MIXED_LANDMASS_STEP_PX;
const MIN_OWNER_AREA = 500, MIN_OWNER_SHARE = .01;

function bounds(points) {
  if (!Array.isArray(points) || points.length < 3) return null;
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  for (const p of points) {
    if (!Number.isFinite(p?.x) || !Number.isFinite(p?.y)) return null;
    minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);
    maxX=Math.max(maxX,p.x);maxY=Math.max(maxY,p.y);
  }
  return {minX,minY,maxX,maxY};
}

function scanPolygon(points, callback) {
  const b=bounds(points);
  if (!b) return;
  const first=Math.max(0,Math.floor((b.minY-1)/2));
  const last=Math.min(HEIGHT-1,Math.ceil((b.maxY-1)/2));
  for (let cy=first;cy<=last;cy++) {
    const y=cy*2+1, crossings=[];
    for (let i=0,j=points.length-1;i<points.length;j=i++) {
      const a=points[i],p=points[j];
      if ((a.y>y)!==(p.y>y))
        crossings.push(a.x+(y-a.y)*(p.x-a.x)/(p.y-a.y));
    }
    crossings.sort((a,b)=>a-b);
    for (let k=0;k+1<crossings.length;k+=2) {
      const firstX=Math.max(0,Math.ceil((crossings[k]-1)/2));
      const lastX=Math.min(WIDTH-1,Math.floor((crossings[k+1]-1)/2));
      for (let cx=firstX;cx<=lastX;cx++) callback(cy*WIDTH+cx);
    }
  }
}

function edgeStrip(b) {
  // These are thin map-frame traces, not evidence that distant continents touch.
  return Boolean(b && ((b.maxY-b.minY<=4 && b.minY<=4) ||
    (b.maxX-b.minX<=4 && b.minX<=4) ||
    (b.maxY-b.minY<=4 && b.maxY>=FRAME_HEIGHT-5) ||
    (b.maxX-b.minX<=4 && b.maxX>=FRAME_WIDTH-5)));
}

export function buildMixedLandmassCatalog(regions, footprints, coastlines) {
  if (![regions,footprints,coastlines].every(Array.isArray))
    throw new Error('Mixed landmass audit requires regions, footprints and coastlines.');
  const regionById=new Map(regions.map(r=>[r.id,r]));
  const macros=regions.filter(r=>r.regionType==='continent'||r.regionType==='island_system');
  const index=new Map(macros.map((m,i)=>[m.id,i]));
  const subIds=[...new Set(footprints.map(p=>p.regionIds?.[0]))];
  const subIndex=new Map(subIds.map((id,i)=>[id,i]));
  if (!macros.length || macros.length>16 || subIds.length>32)
    throw new Error('Unexpected macro/subregion count for sampled bitset.');
  const macroGrid=new Uint16Array(WIDTH*HEIGHT);
  const subGrid=new Uint32Array(WIDTH*HEIGHT);
  for (const part of footprints) {
    const region=regionById.get(part.regionIds?.[0]);
    if (!region) throw new Error('Unknown footprint region: '+part.id);
    const macroId=region.regionType==='subregion'?region.parentRegionId:region.id;
    const macro=index.get(macroId),sub=subIndex.get(region.id);
    if (macro===undefined || sub===undefined)
      throw new Error('Unresolved footprint owner: '+part.id);
    scanPolygon(part.points,i=>{
      macroGrid[i]|=1<<macro;
      subGrid[i]|=1<<sub;
    });
  }
  const conflicts=[];
  for (const coast of coastlines) {
    const b=bounds(coast.points);
    if (!b) continue;
    const macroCounts=macros.map(()=>0), subCounts=subIds.map(()=>0);
    let cellCount=0,directOverlapCells=0;
    scanPolygon(coast.points,i=>{
      cellCount++;
      const mask=macroGrid[i], submask=subGrid[i];
      if (mask && (mask & (mask-1))) directOverlapCells++;
      for (let m=0;m<macros.length;m++) if (mask&(1<<m)) macroCounts[m]++;
      for (let s=0;s<subIds.length;s++) if (submask&(1<<s)) subCounts[s]++;
    });
    const areaPx2=cellCount*4;
    const owners=macros.map((m,i)=>({
      id:m.id,name:m.name,regionType:m.regionType,areaPx2:macroCounts[i]*4,
      sharePercent:areaPx2?Math.round(10000*macroCounts[i]/cellCount)/100:0
    })).filter(o=>o.areaPx2>0).sort((a,b)=>b.areaPx2-a.areaPx2 || a.id.localeCompare(b.id));
    const material=owners.filter(o=>o.areaPx2>=Math.max(MIN_OWNER_AREA,areaPx2*MIN_OWNER_SHARE));
    if (material.length<2) continue;
    const subregions=subIds.map((id,i)=>({
      id,name:regionById.get(id)?.name||id,
      macroId:regionById.get(id)?.regionType==='subregion'?regionById.get(id).parentRegionId:id,
      areaPx2:subCounts[i]*4
    })).filter(s=>s.areaPx2>=Math.max(100,areaPx2*.005))
      .sort((a,b)=>b.areaPx2-a.areaPx2 || a.id.localeCompare(b.id));
    conflicts.push({
      id:coast.id,name:coast.name||coast.id,
      kind:edgeStrip(b)?'map-edge-strip':'mixed-traced-mass',
      bounds:b,areaPx2,sourceVertices:coast.points.length,
      ownerCount:material.length,owners,materialOwnerIds:material.map(m=>m.id),
      subregions,directMacroOverlapAreaPx2:directOverlapCells*4
    });
  }
  conflicts.sort((a,b)=>
    (a.kind==='map-edge-strip')-(b.kind==='map-edge-strip') ||
    b.areaPx2-a.areaPx2 || a.id.localeCompare(b.id));
  return {
    format:'first-world-mixed-landmass-source-audit.v1',
    sampling:'2x2 reference-pixel cell centers in source polygons; not independent raster land truth',
    footprintCount:footprints.length,coastlineCount:coastlines.length,
    conflicts,mixedCount:conflicts.filter(c=>c.kind==='mixed-traced-mass').length,
    edgeStripCount:conflicts.filter(c=>c.kind==='map-edge-strip').length
  };
}

export const MIXED_REVIEW_DECISIONS = Object.freeze([
  'undecided','needs_raster_witness','suspected_trace_connection',
  'suspected_owner_boundary','possible_real_land_connection','visually_checked_no_change'
]);
export function cleanMixedDecision(value) {
  return MIXED_REVIEW_DECISIONS.includes(value)?value:'undecided';
}
