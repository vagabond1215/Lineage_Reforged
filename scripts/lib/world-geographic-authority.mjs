/**
 * C1 noncanonical coordinate/geography registry validation.
 * Physical connectedness, regional ownership, and ecological coverage are
 * independent. This module cannot publish a world border or travel path.
 */
import {
  FIRST_WORLD_REFERENCE,assertCoordinatePoint,
  validateCoordinatePolygon,coordinatePolygonContains,
} from './world-coordinate-geometry.mjs';

const fail=reason=>{throw Error('C1 geography HOLD: '+reason);};
const unique=(items,label)=>{
  if(!Array.isArray(items)||new Set(items).size!==items.length)
    fail(label+' duplicate or missing');
};
const nonblank=s=>typeof s==='string'&&s.trim().length>0;
const finite=n=>Number.isFinite(n);
const orientation=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const epsilon=1e-9;
const onLine=(a,b,p)=>Math.abs(orientation(a,b,p))<epsilon&&
  p.x>=Math.min(a.x,b.x)-epsilon&&p.x<=Math.max(a.x,b.x)+epsilon&&
  p.y>=Math.min(a.y,b.y)-epsilon&&p.y<=Math.max(a.y,b.y)+epsilon;
function touching(a,b,c,d){
  const x=orientation(a,b,c),y=orientation(a,b,d);
  const z=orientation(c,d,a),w=orientation(c,d,b);
  if((x>epsilon&&y< -epsilon||x< -epsilon&&y>epsilon)&&
     (z>epsilon&&w< -epsilon||z< -epsilon&&w>epsilon))return true;
  return onLine(a,b,c)||onLine(a,b,d)||onLine(c,d,a)||onLine(c,d,b);
}
const rings=p=>[p.outer,...(p.holes??[])];
function polygonsTouchOrOverlap(a,b,frame){
  for(const ra of rings(a))for(const rb of rings(b))
    for(let i=0;i<ra.length;i++)for(let j=0;j<rb.length;j++)
      if(touching(ra[i],ra[(i+1)%ra.length],rb[j],rb[(j+1)%rb.length]))
        return true;
  return a.outer.some(p=>coordinatePolygonContains(b,p,frame))||
    b.outer.some(p=>coordinatePolygonContains(a,p,frame));
}
export function validateRegisteredCoordinateSpace(frame){
  const base=FIRST_WORLD_REFERENCE;
  if(!frame||frame.mapId!==base.mapId||
    frame.coordinateSpaceId!==base.coordinateSpaceId||
    frame.widthPixels!==base.widthPixels||
    frame.heightPixels!==base.heightPixels||
    frame.kilometersPerPixel!==base.kilometersPerPixel||
    frame.units!==base.units||frame.orientation!==base.orientation)
    fail('registered reference frame changed');
  return true;
}
export function validateCoordinateMultiPolygon(polygons,frame=FIRST_WORLD_REFERENCE){
  if(!Array.isArray(polygons)||polygons.length===0)
    fail('nonempty multipolygon required');
  polygons.forEach(p=>validateCoordinatePolygon(p,frame));
  for(let i=0;i<polygons.length;i++)
    for(let j=i+1;j<polygons.length;j++)
      if(polygonsTouchOrOverlap(polygons[i],polygons[j],frame))
        fail('overlapping or touching multipolygon pieces');
  return true;
}
export function validateGeographicArea(area,frame=FIRST_WORLD_REFERENCE){
  if(!area||!nonblank(area.id)||!['REGION','ECOLOGICAL_ZONE','PHYSICAL_AREA'].includes(area.kind)||
    area.mapId!==frame.mapId||area.coordinateSpaceId!==frame.coordinateSpaceId||
    !['WITHHELD','PROPOSED','APPROVED'].includes(area.geometryStatus))
    fail('area identity, kind or registered coordinates invalid');
  if(area.kind==='REGION'&&!nonblank(area.parentContinentId))
    fail('region requires an explicit parent identity');
  if(area.kind==='ECOLOGICAL_ZONE'&&area.parentContinentId!==null)
    fail('ecological coverage must not inherit political parent ownership');
  if(area.geometryStatus==='WITHHELD'){
    if(area.geometryRef!==null||area.polygons!==null)
      fail('withheld area cannot publish geometry');
  }else{
    if(!nonblank(area.geometryRef)||!Number.isInteger(area.geometryVersion)||
      area.geometryVersion<1||!Array.isArray(area.sourceFeatureIds)||
      area.sourceFeatureIds.length===0)
      fail('placed area lacks version or original source provenance');
    unique(area.sourceFeatureIds,'source feature');
    validateCoordinateMultiPolygon(area.polygons,frame);
    if(area.geometryStatus==='APPROVED'&&!nonblank(area.ownerApprovalRef))
      fail('approved area lacks owner signoff');
  }
  return true;
}
export function findCoordinateAreasAtPoint(areas,p,{kind=null,frame=FIRST_WORLD_REFERENCE}={}){
  assertCoordinatePoint(p,frame);
  if(!Array.isArray(areas))fail('area collection absent');
  const hits=[];
  for(const a of areas){
    validateGeographicArea(a,frame);
    if(a.geometryStatus==='WITHHELD'||(kind&&a.kind!==kind))continue;
    if(a.polygons.some(poly=>coordinatePolygonContains(poly,p,frame)))hits.push(a);
  }
  if(hits.filter(a=>a.kind==='REGION').length>1)
    fail('competing regional geometry at coordinate');
  return hits;
}
/** An island may only be claimed by its registered whole geometry reference. */
export function validateWholeComponentClaims(components,claims){
  if(!Array.isArray(components)||!Array.isArray(claims))
    fail('physical components or claims missing');
  const byKey=new Map(components.map(c=>[c.namespace+':'+c.componentId,c]));
  if(byKey.size!==components.length)fail('duplicated physical component identity');
  const used=new Set();
  for(const claim of claims){
    const key=claim?.namespace+':'+claim?.componentId;
    const physical=byKey.get(key);
    if(!physical||used.has(key))fail('unknown or multiply claimed physical component');
    used.add(key);
    if(claim.coverage!=='WHOLE_COMPONENT'||!nonblank(claim.regionId)||
      !nonblank(physical.geometryRef)||claim.geometryRef!==physical.geometryRef||
      !['PROPOSED','APPROVED'].includes(claim.status))
      fail('partial, unregistered or unlocated physical-component claim');
    if(claim.status==='APPROVED'&&!nonblank(claim.ownerApprovalRef))
      fail('whole island approval reference missing');
  }
  return true;
}
const expectedIslands=[
  [24,1893],[90,1013],[91,220],[34,118],[21,115],[25,80],
  [28,64],[47,37],[38,22],[20,20],[71,18],[26,17],
  [55,16],[95,16],[35,14],[51,13],[96,9],[78,8],
];
const expectedRegions=[
  'region.auric_marches','region.kharuun_drylands',
  'region.verdant_thalos','region.veyrholm_shore','region.shattercap_isles',
];
export const C1_SOURCE_VARIANTS=Object.freeze({
  master201:'9cd6752e9dbca00796e5f7c013066bb0e5a96175',
  draft159:'ec59ed66b7eaee4502dc56709a2f266b17b3cb17',
});
export function validateKaelvarC1ReviewLedger(ledger){
  if(ledger?.schemaVersion!==1||
    ledger.type!=='kaelvar-c1-coordinate-geography-review.v1'||
    ledger.status!=='C1_NONCANONICAL_GEOGRAPHY_HELD'||
    ledger.approval?.canonicalWritable!==false||
    ledger.approval?.parentConfirmed!==false||
    ledger.approval?.bordersApproved!==false||
    ledger.approval?.ownerApprovalRef!==null)
    fail('review-only status or publication lock changed');
  validateRegisteredCoordinateSpace(ledger.coordinateSpace);
  const s=ledger.sourceWitness;
  if(s?.masterGeometryBlob!==C1_SOURCE_VARIANTS.master201||
    s?.draftGeometryBlob!==C1_SOURCE_VARIANTS.draft159||
    s?.masterFootprints!==201||s?.draftFootprints!==159||
    s?.coastlines!==68||s?.acceptedDraftExclusionCount!==42||
    s?.crop?.x!==60||s?.crop?.y!==60||s?.crop?.width!==3976||
    s?.crop?.height!==2235||
    s?.biomeSha256!=='9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12'||
    s?.elevationSha256!=='02c3b133f2b3f08aed56f98bde4c846d6e3316c71a02785ec56d')
    fail('source registration or historical geometry variants changed');
  const ps=ledger.physicalComponents;
  if(!Array.isArray(ps)||ps.length!==19)fail('physical inventory incomplete');
  const ns='SOURCE_PAIR_TERRAIN_ONLY_4_NEIGHBOR_K1';
  const byId=new Map();
  for(const p of ps){
    if(p?.namespace!==ns||!Number.isInteger(p.componentId)||p.componentId<1||
      byId.has(p.componentId)||p.geometryRef!==null||
      p.parentContinentId!==null||p.ownerRegionId!==null||
      p.ownershipStatus!=='WITHHELD'||p.sourceClass!=='TERRAIN_CANDIDATE_NOT_CERTIFIED_LAND')
      fail('physical provenance, uniqueness or sovereignty hold invalid');
    byId.set(p.componentId,p);
  }
  const main=byId.get(30);
  if(main?.physicalRole!=='MAINLAND_REFERENCE'||main.candidateCells!==79419)
    fail('mainland reference drift');
  for(const [id,count] of expectedIslands){
    const p=byId.get(id);
    if(p?.physicalRole!=='DETACHED_COMPONENT'||p.candidateCells!==count)
      fail('detached component missing, count drift or misclassified: '+id);
  }
  if(ps.filter(x=>x.physicalRole==='DETACHED_COMPONENT').length!==18||
    expectedIslands.reduce((a,p)=>a+p[1],0)!==3693)
    fail('detached count or total drift');
  const areas=ledger.regionIntents;
  if(!Array.isArray(areas)||areas.length!==5||
    new Set(areas.map(a=>a.id)).size!==5||
    !expectedRegions.every(id=>areas.some(a=>a.id===id)))
    fail('five unequal child intents required');
  for(const area of areas){
    validateGeographicArea(area,ledger.coordinateSpace);
    if(area.kind!=='REGION'||area.parentContinentId!=='region.kaelvar'||
      area.geometryStatus!=='WITHHELD'||area.ownerApprovalRef!==null)
      fail('child geometry or parent prematurely activated');
  }
  if(!Array.isArray(ledger.ecologicalAreas)||ledger.ecologicalAreas.length!==0||
    !Array.isArray(ledger.componentClaims)||ledger.componentClaims.length!==0)
    fail('unreviewed ecology or component allocation');
  const h=ledger.holds;
  if(h?.northeastLargeIsland?.wholeUnitRequired!==true||
    h.northeastLargeIsland.componentId!==null||
    h.northeastLargeIsland.ownerRegionId!==null||
    h.coast40?.ownerRegionId!==null||
    h.windwardSpine?.parentContinentId!=='region.serathyl'||
    h.windwardSpine.kaelvarTransferApproved!==false||
    h.detachedComponents?.allPending!==true||
    h.unknownMainland?.forceFillAllowed!==false)
    fail('NE island, contested coast, foreign parent or unassigned holds drift');
  validateWholeComponentClaims(ps,ledger.componentClaims);
  return {
    status:'C1_REVIEW_REGISTRY_VALID_NO_GEOGRAPHY_APPROVED',
    coordinateSpaceId:ledger.coordinateSpace.coordinateSpaceId,
    childRegionIntents:areas.length,physicalComponents:ps.length,
    detachedComponents:18,detachedCandidateCells:3693,
    regionGeometriesApproved:0,componentClaims:0,canonicalWritable:false,
  };
}
