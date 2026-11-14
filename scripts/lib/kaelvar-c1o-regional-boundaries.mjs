/**
 * C1-O reversible regional polygons. Source vectors and independent registered
 * terrain candidates are witnesses, never certified water/land or sovereignty.
 * No writes to gameplay world records.
 */
import {validateCoordinatePolygon} from './world-coordinate-geometry.mjs';
import {buildC1NSourceEdgeAtlas} from './kaelvar-c1n-source-edge-atlas.mjs';

const hold=s=>{throw Error('C1-O regional geometry HOLD: '+s);};
const IDS=['region.auric_marches','region.kharuun_drylands',
 'region.verdant_thalos','region.veyrholm_shore'];
const eq=(a,b)=>Array.isArray(a)&&a.length===b.length&&a.every((x,i)=>x===b[i]);
const own=(o,p)=>o&&Object.hasOwn(o,p);
const cr=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const eps=1e-9;
const on=(a,b,p)=>Math.abs(cr(a,b,p))<eps &&
 p.x>=Math.min(a.x,b.x)-eps&&p.x<=Math.max(a.x,b.x)+eps&&
 p.y>=Math.min(a.y,b.y)-eps&&p.y<=Math.max(a.y,b.y)+eps;
const properCross=(a,b,c,d)=>{
 const x=cr(a,b,c),y=cr(a,b,d),z=cr(c,d,a),w=cr(c,d,b);
 return ((x>eps&&y< -eps)||(x< -eps&&y>eps))&&
        ((z>eps&&w< -eps)||(z< -eps&&w>eps));
};
export function c1oPointInRing(p,ring){
 let inRing=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const a=ring[j],b=ring[i];
  if(on(a,b,p))return true;
  if((a.y>p.y)!==(b.y>p.y)&&
    p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inRing=!inRing;
 }
 return inRing;
}
const equalPoint=(a,b)=>a?.x===b?.x&&a?.y===b?.y;
export function c1oSourceVertexArc(points,startVertex,endVertex){
 if(points?.length!==599||!Number.isInteger(startVertex)||
  !Number.isInteger(endVertex)||startVertex<0||startVertex>598||
  endVertex<0||endVertex>598||startVertex===endVertex)
  hold('invalid original source-indexed arc');
 const out=[],indices=[];
 let at=startVertex;
 for(let step=0;step<=599;step++){
  out.push({...points[at]});indices.push(at);
  if(at===endVertex)return {vertices:out,sourceVertexIndices:indices,
   sourceEdgeIndices:indices.slice(0,-1)};
  at=(at+1)%599;
 }
 hold('source arc failed to terminate');
}
const asPoint=xy=>{
 if(!Array.isArray(xy)||xy.length!==2||
   !xy.every(n=>Number.isInteger(n)&&n>=0&&n<=2048))
  hold('nonintegral or out-of-frame inland waypoint');
 return {x:xy[0],y:xy[1]};
};
export function validateC1OContract(o,n,f,j,m){
 if(o?.schemaVersion!==1||
  o.type!=='kaelvar-c1o-source-grounded-mainland-candidate-polygons.v1'||
  o.status!=='REVERSIBLE_FOUR_MAINLAND_REGION_POLYGON_CANDIDATES_OWNER_REVIEW_HELD'||
  o.baseCommit!=='8c317d48ef405ca29830d4dc4959ce21f07693bb'||
  o.sourcePaths?.c1n!=='docs/design/kaelvar-c1n-indexed-north-coast-atlas-2026-11-14.json'||
  o.sourcePaths?.c1f!=='docs/design/kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json'||
  o.sourcePaths?.c1j!=='docs/design/kaelvar-c1j-coastline-sector-review-2026-11-13.json'||
  o.sourcePaths?.c1m!=='docs/design/kaelvar-c1m-owner-shore-correction-2026-11-14.json'||
  o.source?.path!==j?.sourceGeometryPath||
  o.source.mainlandContourId!==n?.sourceMainlandContourId||
  o.source.originalEdges!==599||
  o.source.observedParentBlob!=='9cd6752e9dbca00796e5f7c013066bb0e5a96175'||
  o.source.frame!=='world_map.first_world.reference'||
  o.source.sourceCoastlineCertified!==false||
  o.source.politicalOwnershipApproved!==false||
  f?.regionGuides?.length!==5||
  m?.ownerVisualDecision?.kharuunHasShortNorthernCoastAtDesignLevel!==true||
  m.ownerVisualDecision?.oldVeyrholmCorridorIsAcceptedBoundary!==false)
  hold('source chain, exact base or owner-intent mismatch');
 const t=o.mainlandTerrainWitness;
 if(t?.componentId!==30||t.originalCandidateCells!==79419||
  t.priorUnassignedCandidateCells!==26795||t.detachedComponentsHeld!==18||
  !Array.isArray(o.regions)||o.regions.length!==4||
  !eq(o.regions.map(r=>r.id),IDS))
  hold('source candidate counts or mainland region identities drifted');
 if(o.regions.some(r=>!/^#[0-9A-F]{6}$/.test(r.color)||
  !r.reason||!r.confidence||r.inlandWaypoints?.length<5||
  !r.inlandWaypoints.every(x=>Array.isArray(x)&&x.length===2&&
    x.every(Number.isInteger))||
  !Array.isArray(r.uncertainties)||!r.uncertainties.length||
  !Number.isInteger(r.sourceArc?.startVertex)||
  !Number.isInteger(r.sourceArc?.endVertex)))
  hold('incomplete proposed source/inland polygon evidence');
 const [auric,kharuun,verdant,veyrholm]=o.regions;
 if(!eq([auric.sourceArc.startVertex,auric.sourceArc.endVertex],[420,455])||
  !eq([kharuun.sourceArc.startVertex,kharuun.sourceArc.endVertex],[35,59])||
  !eq([verdant.sourceArc.startVertex,verdant.sourceArc.endVertex],[195,349])||
  !eq([veyrholm.sourceArc.startVertex,veyrholm.sourceArc.endVertex],[475,24])||
  veyrholm.inlandWaypoints.length<10||
  o.investigativeArcs?.find(x=>x.id==='northeast_headland')?.
   status!=='OWNERSHIP_WITHHELD_NOT_IN_POLYGON')
  hold('Kharuun short frontage, source arcs or false corridor regression');
 const h=o.politicalHolds;
 if(o.ownerAnchors?.c1fMustBePreserved!==true||
  o.ownerAnchors.veyrholmInlandExcludedCount!==3||
  o.ownerAnchors.verdantPeninsulaIncludedCount!==3||
  h?.canonicalWritable!==false||h.newActiveRegionGeometryRefs!==0||
  h.politicalCoastOwnershipApproved!==false||
  h.sourceContourCertified!==false||
  h.largeNortheastIslandWholeUnclaimed!==true||
  !eq(h.detachedClaims,[])||h.shattercapRegionPolygon!==null||
  h.coast40Claim!==null||h.foreignWindwardParent!=='region.serathyl'||
  h.portsPlaced!==0||h.wellOrRiverPlacements!==0||
  h.waterRoutesPlaced!==0||h.saltBasinsPlaced!==0||
  h.noLegacyHexChanges!==true)
  hold('island, foreign parent, fresh water, route or canonical hold changed');
 return {status:'C1O_REVIEW_CONTRACT_VALID_NOT_CANONICAL',
  mainlandPolygonCandidates:4,publicationAllowed:false};
}
const bbox=ring=>({
 minX:Math.min(...ring.map(p=>p.x)),maxX:Math.max(...ring.map(p=>p.x)),
 minY:Math.min(...ring.map(p=>p.y)),maxY:Math.max(...ring.map(p=>p.y)),
});
function crossingEdges(a,b){
 const intersections=[];
 for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++)
  if(properCross(a[i],a[(i+1)%a.length],b[j],b[(j+1)%b.length]))
   intersections.push([i,j]);
 return intersections;
}
/** Does not infer any physical feature from the coastline drawing. */
export function buildC1ORegionalGeometry({proposal,selected,c1n,c1f}){
 if(selected?.main?.id!==proposal.source.mainlandContourId||
  selected.main.points?.length!==599||
  selected.offshore?.length!==3||
  selected.report?.originalSourceEdgesAccounted!==599)
  hold('original source-mainland inventory drift');
 const atlas=buildC1NSourceEdgeAtlas(selected,c1n);
 const original=selected.main.points;
 const records=proposal.regions.map(row=>{
  const arc=c1oSourceVertexArc(original,row.sourceArc.startVertex,
   row.sourceArc.endVertex);
  const ctl=row.inlandWaypoints.map(asPoint);
  const ring=[...arc.vertices,...ctl];
  validateCoordinatePolygon({outer:ring});
  const interiorSegments=[];
  for(let i=arc.vertices.length-1;i<ring.length;i++)
   interiorSegments.push([ring[i],ring[(i+1)%ring.length]]);
  const crossing=interiorSegments.reduce((n,[a,b])=>
   n+original.reduce((count,p,j)=>count+
    Number(properCross(a,b,p,original[(j+1)%599])),0),0);
  if(crossing)hold(row.id+' inland return crosses original source coastline');
  const offshoreCrossings=selected.offshore.reduce((n,island)=>n+
   crossingEdges(ring,island.points).length,0);
  if(offshoreCrossings)hold(row.id+' crosses protected offshore source contour');
  const bounds=bbox(ring);
  const shore=arc.sourceEdgeIndices.map(i=>atlas.originalEdgeCoordinates[i]);
  if(shore.length!==arc.vertices.length-1||
   shore.some((edge,k)=>edge.sourceEdgeIndex!==arc.sourceEdgeIndices[k]||
    !equalPoint(edge.originalVertexA,ring[k])||
    !equalPoint(edge.originalVertexB,ring[k+1])))
   hold('source arc was interpolated or changed');
  return {regionId:row.id,label:row.label,color:row.color,
   confidence:row.confidence,reason:row.reason,uncertainties:row.uncertainties,
   sourceArcStartVertex:row.sourceArc.startVertex,
   sourceArcEndVertex:row.sourceArc.endVertex,
   sourceArcWrapsZero:row.sourceArc.startVertex>row.sourceArc.endVertex,
   sourceEdgeIndices:arc.sourceEdgeIndices,
   sourceCoastEdgeOriginalPoints:shore,
   sourceVertexCount:arc.vertices.length,polygonRing: ring,
   hypothesizedInlandWaypoints:ctl,bounds,
   sourceInlandProperCrossings:crossing,protectedOffshoreCrossings:0,
   regionalAuthority:'NONCANONICAL_REVIEW_CANDIDATE_ONLY'};
 });
 for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++){
  const a=records[i],b=records[j];
  if(crossingEdges(a.polygonRing,b.polygonRing).length||
   c1oPointInRing(a.polygonRing[0],b.polygonRing)||
   c1oPointInRing(b.polygonRing[0],a.polygonRing))
   hold('competing candidate polygon ownership '+a.regionId+' / '+b.regionId);
 }
 const byId=new Map(records.map(x=>[x.regionId,x]));
 for(const p of c1f.reviewAnchors.verdantMustIncludePeninsula)
  if(!c1oPointInRing(p,byId.get('region.verdant_thalos').polygonRing))
   hold('southeastern Verdant peninsula inclusion anchor lost');
 for(const p of c1f.reviewAnchors.veyrholmMustExcludeInland)
  if(c1oPointInRing(p,byId.get('region.veyrholm_shore').polygonRing))
   hold('rejected Veyrholm inland corridor reintroduced');
 if(records.some(x=>c1oPointInRing(
   c1f.reviewAnchors.unownedNortheasternIslandSample,x.polygonRing)))
  hold('large northeastern island was included');
 const kh=byId.get('region.kharuun_drylands');
 if(kh.sourceEdgeIndices.length!==24||kh.sourceEdgeIndices[0]!==35||
  kh.sourceEdgeIndices.at(-1)!==58)
  hold('short northern Kharuun frontage disappeared or expanded');
 const exploratory=proposal.investigativeArcs.map(arc=>{
  const v=c1oSourceVertexArc(original,arc.sourceStartEdge,
   (arc.sourceEndEdge+1)%599);
  return {id:arc.id,proposedRegionId:arc.candidateRegionId,
   status:arc.status,confidence:arc.confidence,
   sourceEdgeIndices:v.sourceEdgeIndices,
   sourceEdges:v.sourceEdgeIndices.map(i=>atlas.originalEdgeCoordinates[i]),
   endpoints:{start:v.vertices[0],end:v.vertices.at(-1)},
   endpointsUnapproved:true,
   endpointAlternatives:arc.endpointOptions??[]};
 });
 return {regions:records,coastalReviewArcs:exploratory,
  originalContour:original,protectedOffshore:selected.offshore,
  originalEdgesConserved:atlas.originalEdgesAccounted,
  sourceSectorCounts:atlas.countsBySourceInspectionSector,
  originalSourceContoursModified:0,
  selfIntersectionCount:0,regionalOverlapCount:0,
  sourceCrossingCount:0,offshoreSourceCrossingCount:0};
}
/** Measures only the *registered terrain-candidate component*, not land cover.
 * Per-polygon and remaining unassigned counts are always rederived, never
 * copied from C1-F or inferred from area of the vector drawing.
 */
export function measureC1OReviewTerrain(geometry,labels,{
 width=2048,height=1152,componentId=30,
}={}){
 if(labels?.length!==width*height||width!==2048||height!==1152||
  componentId!==30||geometry?.regions?.length!==4)
  hold('registered terrain component raster missing');
 const owner=new Uint8Array(labels.length),counts=[];
 const source=geometry.originalContour;
 for(let k=0;k<geometry.regions.length;k++){
  const r=geometry.regions[k],b=r.bounds,ring=r.polygonRing;
  let cells=0,sourceOutlineOutsidePixels=0,rawRingPixels=0;
  for(let y=Math.max(0,Math.floor(b.minY));y<Math.min(height,Math.ceil(b.maxY));y++)
   for(let x=Math.max(0,Math.floor(b.minX));x<Math.min(width,Math.ceil(b.maxX));x++){
    const q={x:x+.5,y:y+.5};
    if(!c1oPointInRing(q,ring))continue;
    rawRingPixels++;
    if(!c1oPointInRing(q,source))sourceOutlineOutsidePixels++;
    const index=y*width+x;
    if(labels[index]!==componentId)continue;
    if(owner[index])hold('competing regional candidate terrain cell');
    owner[index]=k+1;cells++;
   }
  if(sourceOutlineOutsidePixels)
   hold(r.regionId+' polygon extends outside unchanged source contour');
  if(cells===0)hold('empty region preview terrain candidate');
  counts.push({regionId:r.regionId,terrainCandidateCells:cells,
   rawPolygonInteriorPixelSamples:rawRingPixels,
   outsideMainlandSourceContourPixels:sourceOutlineOutsidePixels});
 }
 let main=0,unassigned=0,claimedDetached=0;
 for(let i=0;i<labels.length;i++){
  if(labels[i]===componentId){main++;if(!owner[i])unassigned++;}
  else if(owner[i])claimedDetached++;
 }
 if(main!==79419||claimedDetached||unassigned===0||
  unassigned+counts.reduce((n,x)=>n+x.terrainCandidateCells,0)!==main)
  hold('preview inventory, detached ownership or gap conservation failed');
 return {ownership:owner,candidateMainlandTerrainCells:main,
  perRegion:counts,previewAssignedMainlandTerrainCells:main-unassigned,
  remainingUnassignedMainlandTerrainCells:unassigned,
  originalC1FUnassignedMainlandTerrainCells:26795,
  detachedPhysicalComponentsClaimed:0,detachedSourceContoursClaimed:0,
  physicalLandOrSeaCertified:false,canonicalWritable:false};
}
