/**
 * C1-K reviewer-only: retain all original coastline edges while locating
 * apparent guide-to-source contact and the gaps between inland draft guides.
 * These measurements are NOT political borders, coast semantics, island
 * ownership or permission to fill still-unassigned mainland terrain.
 */
import {coordinatePolygonContains,FIRST_WORLD_REFERENCE}
  from './world-coordinate-geometry.mjs';

const fail=s=>{throw Error('C1-K coast/inland HOLD: '+s);};
const pairs=[
  ['auric_veyrholm','region.auric_marches','region.veyrholm_shore'],
  ['kharuun_veyrholm','region.kharuun_drylands','region.veyrholm_shore'],
  ['auric_kharuun','region.auric_marches','region.kharuun_drylands'],
  ['kharuun_verdant','region.kharuun_drylands','region.verdant_thalos'],
];
const offshore=[
  'feature.coastline.first_world.part_7',
  'feature.coastline.first_world.part_8',
  'feature.coastline.first_world.part_31',
];
const sectorIds=[
  'kaelvar_northwest_vector_sector',
  'kaelvar_northcentral_vector_sector',
  'kaelvar_northeast_vector_sector',
];
const equal=(a,b)=>Array.isArray(a)&&a.length===b.length&&
  a.every((v,i)=>v===b[i]);
export function validateC1KContract(c,c1j,c1f){
  if(c?.schemaVersion!==1||
    c.type!=='kaelvar-c1k-coast-informed-inland-boundary-review.v1'||
    c.status!=='SOURCE_COAST_OUTER_REFERENCE_INLAND_DIVISIONS_UNAPPROVED'||
    c.sourcePaths?.c1j!=='docs/design/kaelvar-c1j-coastline-sector-review-2026-11-13.json'||
    c.sourcePaths?.c1f!=='docs/design/kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json'||
    c.mapId!==FIRST_WORLD_REFERENCE.mapId||
    c.coordinateSpaceId!==FIRST_WORLD_REFERENCE.coordinateSpaceId||
    c.parentRegionId!=='region.kaelvar'||
    c.originalMainlandSourceId!=='feature.coastline.first_world.part_10'||
    c1j?.mainlandSource?.id!==c.originalMainlandSourceId||
    c1j.mainlandSource?.vertices!==599||
    c1f?.parentRegionId!==c.parentRegionId||
    c.originalSourceEdgeCount!==599||
    !equal(c.northernSectorEdgeCounts,[90,106,114])||
    c.otherSourceEdgeCount!==289||
    c.outerReferencePolicy!=='UNCHANGED_SOURCE_VECTOR_REVIEW_ONLY_NOT_CERTIFIED_COAST_OR_SOVEREIGNTY'||
    c.inlandDivisionPolicy!=='MEASURE_DISJOINT_GUIDE_GAPS_NO_AUTOMATIC_CONNECT_OR_GAP_FILL')
    fail('source hierarchy, frame or noncanonical review policy drift');
  if(!Array.isArray(c.reviewInterfaces)||
    c.reviewInterfaces.length!==pairs.length||
    pairs.some(([id,a,b],i)=>c.reviewInterfaces[i]?.id!==id||
      c.reviewInterfaces[i]?.regionA!==a||
      c.reviewInterfaces[i]?.regionB!==b||
      c.reviewInterfaces[i]?.approvedBorderGeometryRef!==null))
    fail('inland adjacency review was altered or published');
  if(c.northeastSourceSectorStatus!=='VEYRHOLM_VERSUS_KHARUUN_FRONTAGE_UNRESOLVED'||
    !equal(c.protectedOffshoreSourceIds,offshore)||
    c.largeNortheastIslandOwnership!=='UNRESOLVED_WHOLE_UNIT'||
    c.shattercapOwnership!=='UNRESOLVED_WHOLE_COMPONENTS'||
    c.coast40OwnerRegionId!==null||
    c.foreignWindwardParent!=='region.serathyl'||
    c.kharuunSeaAccessApproved!==false||
    c.saltBasinsGeometryRef!==null||
    c.riversAndOceanCalibrated!==false)
    fail('held coast, island, salt, foreign territory or water was promoted');
  const a=c.approval;
  if(!a||a.canonicalWritable!==false||
    a.sourceTraceIsApprovedRegionBorder!==false||
    a.newInlandBorderGeometryApproved!==false||
    a.shorelineFrontageCertified!==false||
    !equal(a.islandClaims,[])||
    !equal(a.publishedGeometryRefs,[])||
    a.ownerApprovalRef!==null)
    fail('unapproved sovereign geometry or settlement publication');
  return {status:'C1K_REVIEW_CONTRACT_VALID_GEOGRAPHY_HELD',
    inlandReviewInterfaces:pairs.length,canonicalWritable:false};
}
const sq=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
function nearestPointOnSegment(p,a,b){
  const dx=b.x-a.x,dy=b.y-a.y,d=dx*dx+dy*dy;
  if(!(d>0))fail('degenerate guide edge');
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/d));
  return {x:a.x+t*dx,y:a.y+t*dy};
}
const round=p=>({x:Math.round(p.x*1000)/1000,
  y:Math.round(p.y*1000)/1000});
/** Minimum separation between two already-validated disjoint guide rings. */
export function nearestGuideGap(a,b){
  if(!Array.isArray(a)||!Array.isArray(b)||a.length<3||b.length<3)
    fail('invalid disjoint guide pair');
  let best=null;
  const consider=(p,q)=>{
    const d=sq(p,q);
    if(!Number.isFinite(d))fail('invalid guide coordinate');
    if(!best||d<best.squaredDistance)
      best={squaredDistance:d,pointA:round(p),pointB:round(q)};
  };
  for(let i=0;i<a.length;i++){
    const p=a[i],q=a[(i+1)%a.length];
    for(let j=0;j<b.length;j++){
      const r=b[j],s=b[(j+1)%b.length];
      consider(p,nearestPointOnSegment(p,r,s));
      consider(q,nearestPointOnSegment(q,r,s));
      consider(nearestPointOnSegment(r,p,q),r);
      consider(nearestPointOnSegment(s,p,q),s);
    }
  }
  return {guideGapPixels:Math.round(Math.sqrt(best.squaredDistance)*1000)/1000,
    guideEndpointA:best.pointA,guideEndpointB:best.pointB,
    isProposedBorder:false,pointsAreOnlyGuideProximityWitnesses:true};
}
export function buildC1KCoastInlandReview(selected,c1f,c){
  const sectors=selected?.edgeSectors;
  if(selected?.main?.id!==c.originalMainlandSourceId||
    selected.main.points?.length!==599||
    !Array.isArray(sectors)||sectors.length!==3||
    !equal(sectors.map(s=>s.length),c.northernSectorEdgeCounts)||
    selected.unreviewedEdges?.length!==289||
    selected.offshore?.length!==3||
    !equal(selected.offshore.map(x=>x.id),c.protectedOffshoreSourceIds)||
    selected.report?.originalSourceEdgesAccounted!==599)
    fail('original untouched coastline crosswalk was altered');
  const all=[...sectors.flat(),...selected.unreviewedEdges];
  if(all.length!==599||new Set(all.map(x=>x.sourceEdgeIndex)).size!==599||
    all.some(x=>!Number.isInteger(x.sourceEdgeIndex)||
      x.sourceEdgeIndex<0||x.sourceEdgeIndex>=599))
    fail('missing or duplicated original vector edge');
  const guides=c1f.regionGuides.filter(g=>g.guidePolygon!==null);
  if(guides.length!==4||
    !equal(guides.map(g=>g.regionId),
      ['region.auric_marches','region.kharuun_drylands',
        'region.verdant_thalos','region.veyrholm_shore']))
    fail('unexpected mainland guide identities');
  const northernSectors=sectors.map((edges,sectorIndex)=>{
    const counts=Object.fromEntries(guides.map(g=>[g.regionId,0]));
    const unmatchedSourceEdgeIndices=[];
    for(const edge of edges){
      const mid={x:(edge.a.x+edge.b.x)/2,y:(edge.a.y+edge.b.y)/2};
      const matches=guides.filter(g=>coordinatePolygonContains(
        {outer:g.guidePolygon},mid));
      if(matches.length>1)fail('source midpoint overlays competing draft guides');
      if(matches.length===0)
        unmatchedSourceEdgeIndices.push(edge.sourceEdgeIndex);
      else counts[matches[0].regionId]++;
    }
    return {
      sectorId:sectorIds[sectorIndex],
      originalEdgeCount:edges.length,
      rawGuideMidpointOverlaps:counts,
      unmatchedSourceEdgeCount:unmatchedSourceEdgeIndices.length,
      unmatchedSourceEdgeIndices,
      competingFrontageHeld:sectorIndex===2,
      regionOwnershipAssigned:0,
      sourceEdgesModified:0,
      certifiesCoastline:false,
    };
  });
  const byId=new Map(guides.map(g=>[g.regionId,g]));
  const inlandInterfaces=c.reviewInterfaces.map(x=>({
    reviewInterfaceId:x.id,regionA:x.regionA,regionB:x.regionB,
    ...nearestGuideGap(byId.get(x.regionA).guidePolygon,
      byId.get(x.regionB).guidePolygon),
    approvedBorderGeometryRef:null,ownerApprovalRequired:true,
  }));
  return {
    originalSourceEdges:all.length,
    northernSourceEdges:sectors.flat().length,
    remainingOriginalSourceEdges:selected.unreviewedEdges.length,
    northernSectors,inlandInterfaces,
    assignedCoastlineEdges:0,approvedInlandBorders:0,
    sourceReconstructed:false,automaticGapFill:false,
    islandOwnershipAssigned:0,canonicalWritable:false,
  };
}
