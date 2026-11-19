/**
 * Non-authoritative First World geographic boundary review.
 * Continent outlines are independent review projections of child subregion
 * parts. They are NOT contiguous mathematical unions or new source geometry.
 * In particular, no independent island-subregion or ocean polygon is inferred.
 */
export const BOUNDARY_DRAFT_VERSION = 2;
export const BOUNDARY_W = 2048;
export const BOUNDARY_H = 1152;
export const MAX_BOUNDARY_VERTICES = 2000;
export const MAX_CUSTOM_PARTS = 250;

export const validPoint = (p) => p && Number.isFinite(p.x) && Number.isFinite(p.y) &&
  p.x >= 0 && p.x < BOUNDARY_W && p.y >= 0 && p.y < BOUNDARY_H;
export const copyPoints = (points) => points.map((p) => ({x:Math.round(p.x),y:Math.round(p.y)}));

export function squareCandidate(points) {
  if (!Array.isArray(points) || points.length !== 4) return false;
  const xs=points.map((p)=>p.x), ys=points.map((p)=>p.y);
  const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  return x1-x0===8 && y1-y0===8 && points.every((p)=>
    (p.x===x0||p.x===x1) && (p.y===y0||p.y===y1));
}
export function polygonArea(points) {
  let sum=0;
  for(let i=0;i<points.length;i++) {
    const a=points[i],b=points[(i+1)%points.length];
    sum+=a.x*b.y-b.x*a.y;
  }
  return Math.abs(sum/2);
}
export function buildBoundaryCatalog(regions, originalFootprints) {
  const byRegion=new Map(regions.map((r)=>[r.id,r]));
  const parts=new Map(), macroIds=new Map(), regionIds=new Map();
  const macros=regions.filter((r)=>r.regionType==='continent'||r.regionType==='island_system');
  const namedRegions=regions.filter((r)=>r.regionType==='subregion');
  for(const region of regions)regionIds.set(region.id,[]);
  for(const macro of macros)macroIds.set(macro.id,[]);
  for(const f of originalFootprints) {
    const ownerId=f.regionIds?.[0],owner=byRegion.get(ownerId);
    if(!owner || !Array.isArray(f.points) || f.points.length<3) continue;
    const macroId=owner.regionType==='island_system'||owner.regionType==='continent'
      ? owner.id : owner.parentRegionId;
    const part={id:f.id,ownerId,macroId,name:f.name,
      points:f.points,area:polygonArea(f.points),squareCandidate:squareCandidate(f.points),source:true};
    parts.set(f.id,part);
    regionIds.get(ownerId)?.push(f.id);
    macroIds.get(macroId)?.push(f.id);
  }
  return {parts,macroIds,regionIds,macros,namedRegions,byRegion,
    suspected:[...parts.values()].filter((p)=>p.squareCandidate)};
}

export function newBoundaryDraft() {return {region:{},continent:{},custom:{region:{},continent:{}}};}
export function cleanBoundaryDraft(raw,catalog) {
  const out=newBoundaryDraft();
  for(const scope of ['region','continent']) {
    for(const [id,entry] of Object.entries(raw?.[scope] || {})) {
      const original=catalog.parts.get(id);
      if(!original || !entry || typeof entry!=='object')continue;
      const cleaned={};
      if(entry.excluded===true)cleaned.excluded=true;
      const pts=entry.points;
      if(Array.isArray(pts) && pts.length>=3 && pts.length<=MAX_BOUNDARY_VERTICES && pts.every(validPoint))
        cleaned.points=copyPoints(pts);
      if(Object.keys(cleaned).length)out[scope][id]=cleaned;
    }
    let total=0;
    for(const [id,entry] of Object.entries(raw?.custom?.[scope]||{})) {
      if(total>=MAX_CUSTOM_PARTS)break;
      if(!/^draft\.(region|continent)\.[a-z0-9_.-]+\.[0-9]+$/.test(id) ||
          id.length>160 || !entry || typeof entry!=='object')continue;
      const owner=scope==='region'
        ? catalog.byRegion.get(entry.ownerId)
        : catalog.macros.find((r)=>r.id===entry.ownerId);
      if(!owner || (scope==='region'&&owner.regionType!=='subregion'))continue;
      if(!Array.isArray(entry.points)||entry.points.length<3||
         entry.points.length>MAX_BOUNDARY_VERTICES||!entry.points.every(validPoint))continue;
      out.custom[scope][id]={ownerId:entry.ownerId,points:copyPoints(entry.points),excluded:entry.excluded===true};
      total++;
    }
  }
  return out;
}
export function boundaryParts(catalog,draft,scope,ownerId) {
  const originals=scope==='continent'
    ? catalog.macroIds.get(ownerId)||[]
    : catalog.regionIds.get(ownerId)||[];
  const list=originals.map((id)=>{
    const src=catalog.parts.get(id),mod=draft[scope][id]||{};
    return {...src,points:mod.points||src.points,excluded:mod.excluded===true,
      edited:Boolean(mod.points)||mod.excluded===true,custom:false};
  });
  for(const [id,entry] of Object.entries(draft.custom[scope])) {
    if(entry.ownerId===ownerId)list.push({
      id,ownerId:scope==='region'?ownerId:null,macroId:scope==='continent'?ownerId:null,
      name:'Proposed '+scope+' polygon',points:entry.points,excluded:entry.excluded===true,
      edited:true,custom:true,source:false,squareCandidate:false,area:polygonArea(entry.points)
    });
  }
  return list;
}
export function boundaryPart(catalog,draft,scope,id) {
  if(draft.custom[scope][id]) {
    const entry=draft.custom[scope][id];
    return {...entry,id,custom:true,source:false,edited:true,squareCandidate:false,
      name:'Proposed '+scope+' polygon'};
  }
  const source=catalog.parts.get(id);
  if(!source)return null;
  const mod=draft[scope][id]||{};
  return {...source,points:mod.points||source.points,excluded:mod.excluded===true,
    edited:Boolean(mod.points)||mod.excluded===true,custom:false};
}
export function setBoundaryPoints(catalog,draft,scope,id,points) {
  if(!Array.isArray(points)||points.length<3||points.length>MAX_BOUNDARY_VERTICES||
     !points.every(validPoint))return false;
  const current=boundaryPart(catalog,draft,scope,id);
  if(!current)return false;
  const cloned=copyPoints(points);
  if(current.custom)draft.custom[scope][id].points=cloned;
  else draft[scope][id]={...(draft[scope][id]||{}),points:cloned};
  return true;
}
export function excludeBoundary(catalog,draft,scope,id,excluded) {
  const current=boundaryPart(catalog,draft,scope,id);
  if(!current)return false;
  if(current.custom)draft.custom[scope][id].excluded=Boolean(excluded);
  else {
    const existing=draft[scope][id]||{};
    if(!excluded && !existing.points)delete draft[scope][id];
    else draft[scope][id]={...existing,excluded:Boolean(excluded)};
  }
  return true;
}
export function resetBoundary(catalog,draft,scope,id) {
  if(draft.custom[scope][id])delete draft.custom[scope][id];
  else if(catalog.parts.has(id))delete draft[scope][id];
}
export function addCustomBoundary(catalog,draft,scope,ownerId,points) {
  const owner=scope==='continent'
    ? catalog.macros.find(r=>r.id===ownerId)
    : catalog.byRegion.get(ownerId);
  if(!owner || (scope==='region'&&owner.regionType!=='subregion')) return null;
  if(!Array.isArray(points)||points.length<3||
     points.length>MAX_BOUNDARY_VERTICES||!points.every(validPoint))return null;
  if(Object.keys(draft.custom[scope]).length>=MAX_CUSTOM_PARTS)return null;
  const prefix='draft.'+scope+'.'+ownerId+'.';
  let i=1;
  while(draft.custom[scope][prefix+i])i++;
  const id=prefix+i;
  draft.custom[scope][id]={ownerId,points:copyPoints(points),excluded:false};
  return id;
}
export function segmentIndex(points,point,closed=true) {
  let best=Infinity,index=0;
  for(let i=0;i<(closed?points.length:points.length-1);i++) {
    const a=points[i],b=points[(i+1)%points.length],dx=b.x-a.x,dy=b.y-a.y;
    const t=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/(dx*dx+dy*dy||1)));
    const dist=Math.hypot(point.x-(a.x+t*dx),point.y-(a.y+t*dy));
    if(dist<best){best=dist;index=i;}
  }
  return index;
}
