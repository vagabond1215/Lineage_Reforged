/**
 * C1-L landmass-first, read-only review of original source coast arcs.
 * Groups unmodified original edges by draft-guide coincidences, never by
 * canonical coast, political ownership, ocean evidence or island claims.
 */
import {FIRST_WORLD_REFERENCE,coordinatePolygonContains}
  from './world-coordinate-geometry.mjs';

const hold=s=>{throw Error('C1-L source-arc HOLD: '+s);};
const regionIds=[
 'region.auric_marches','region.kharuun_drylands','region.verdant_thalos',
 'region.veyrholm_shore','region.shattercap_isles',
];
const roles=[
 'WESTERN_STEPPE_MINERAL_FRONTIER',
 'CENTRAL_ARID_BASINS_ESCARPMENTS_OASIS_DEPENDENT',
 'FERTILE_SOUTHERN_PENINSULA_INCLUDING_SE_PROMONTORY',
 'NORTHERN_MAINLAND_VARIABLE_DEPTH_LITTORAL',
 'DETACHED_NORTHERN_ISLAND_COMMUNITIES',
];
const northStatuses=[
 'NOT_ASSIGNED_BY_ARC_MATCH','NO_SEA_FRONTAGE_APPROVED',
 'NOT_ASSIGNED_BY_ARC_MATCH','GUIDE_COINCIDENCE_NOT_APPROVED_FRONTAGE',
 'NO_MAINLAND_OR_ISLAND_CLAIMS',
];
export const C1L_ARC_CLASSES=Object.freeze([
 'NW_NC_VEYRHOLM_GUIDE_MIDPOINT_ONLY',
 'NW_NC_OTHER_GUIDE_MIDPOINT_HELD',
 'NW_NC_NO_GUIDE_MIDPOINT_HELD',
 'NE_VEYRHOLM_KHARUUN_COMPETITION_HELD',
 'OTHER_SOURCE_ARC_UNREVIEWED_HELD',
]);
const offshore=[
 'feature.coastline.first_world.part_7',
 'feature.coastline.first_world.part_8',
 'feature.coastline.first_world.part_31',
];
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&
 a.every((v,i)=>v===b[i]);
const notBlank=s=>typeof s==='string'&&s.trim().length>0;
export function validateC1LContract(l,c1,c1f,c1j,c1k){
 if(l?.schemaVersion!==1||
   l.type!=='kaelvar-c1l-landmass-first-coast-arc-adjudication.v1'||
   l.status!=='SOURCE_ARC_AND_REGION_DESCRIPTOR_REVIEW_ONLY_NO_BORDER_AUTHORING'||
   l.mapId!==FIRST_WORLD_REFERENCE.mapId||
   l.coordinateSpaceId!==FIRST_WORLD_REFERENCE.coordinateSpaceId||
   l.parentRegionId!=='region.kaelvar'||
   l.parentLandmass!=='kaelvar_mainland_source_candidate_component_30'||
   l.mainlandSourceContourId!=='feature.coastline.first_world.part_10'||
   l.originalSourceEdges!==599||
   !same(l.northernSourceEdgeCounts,[90,106,114])||
   l.otherOriginalSourceEdges!==289||
   l.mainlandTerrainCandidateCells!==79419||
   l.unassignedMainlandTerrainCandidateCells!==26795||
   !same(l.sourceArcClasses,C1L_ARC_CLASSES)||
   l.sourcePaths?.c1!=='docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json'||
   l.sourcePaths?.c1f!=='docs/design/kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json'||
   l.sourcePaths?.c1j!=='docs/design/kaelvar-c1j-coastline-sector-review-2026-11-13.json'||
   l.sourcePaths?.c1k!=='docs/design/kaelvar-c1k-coast-informed-boundary-review-2026-11-14.json'||
   c1?.status!=='C1_NONCANONICAL_GEOGRAPHY_HELD'||
   c1f?.status!=='SOURCE_ALIGNED_CANDIDATE_ONLY_NO_APPROVED_BORDERS'||
   c1j?.mainlandSource?.id!==l.mainlandSourceContourId||
   c1j?.mainlandSource?.vertices!==599||
   c1k?.status!=='SOURCE_COAST_OUTER_REFERENCE_INLAND_DIVISIONS_UNAPPROVED')
   hold('source witness, registered frame or review hierarchy changed');
 if(!Array.isArray(l.regionDescriptions)||
   l.regionDescriptions.length!==5||
   l.regionDescriptions.some((r,i)=>
     r?.regionId!==regionIds[i]||r.role!==roles[i]||
     r.northwestSourceStatus!==northStatuses[i]||
     !notBlank(r.location)||r.proposedGeometryRef!==null))
   hold('five landmass-first region descriptors or geometry hold changed');
 if(c1.physicalComponents?.length!==19||
   c1.physicalComponents.find(p=>p.componentId===30)?.candidateCells!==79419||
   l.heldDetachedComponentCount!==18||
   l.heldDetachedCandidateCells!==3693||
   l.northeasternLargeIslandPolicy!=='WHOLE_COMPONENT_UNCLAIMED'||
   !same(l.originalOffshoreContourIds,offshore)||
   l.coast40Policy!=='HISTORIC_REGION_CONFLICT_NOT_VECTOR_PART_40'||
   l.foreignWindwardParent!=='region.serathyl'||
   l.kharuunSeaAccessApproved!==false||
   l.sourceOceanOrRiverCalibrated!==false||
   l.saltBasinsPlaced!==0)
   hold('physical mainland, offshore island, foreign territory or hydrology hold changed');
 const a=l.approval;
 if(a?.ownerVisualReviewRef!==null||
   a.sourceCoastlineCertified!==false||
   a.regionBorderGeometryApproved!==false||
   a.inlandSeamGeometryApproved!==false||
   a.sourceArcRegionOwnershipAssigned!==0||
   !same(a.detachedComponentClaims,[])||
   a.canonicalWritable!==false)
   hold('source arcs or region borders prematurely approved');
 return {status:'C1L_LANDMASS_CONTRACT_VALID_VISUAL_REVIEW_REQUIRED',
   regionIntents:5,detachedClaims:0,canonicalWritable:false};
}
/**
 * Lossless cyclic run partition. Output preserves every original edge index;
 * a last-to-first run is represented with wrapsZero:true.
 */
export function groupCyclicSourceArcStatuses(statuses){
 if(!Array.isArray(statuses)||statuses.length===0||
    statuses.some(s=>!notBlank(s)))
   hold('invalid source-edge status ring');
 const n=statuses.length;
 const boundary=statuses.findIndex((s,i)=>s!==statuses[(i+n-1)%n]);
 const start=boundary<0?0:boundary;
 const runs=[];
 for(let offset=0;offset<n;offset++){
   const index=(start+offset)%n,s=statuses[index];
   const last=runs[runs.length-1];
   if(last&&last.status===s){
     last.sourceEdgeIndices.push(index);
     last.count++;
     last.endEdgeIndex=index;
   }else{
     runs.push({
       status:s,startEdgeIndex:index,endEdgeIndex:index,
       count:1,wrapsZero:false,sourceEdgeIndices:[index],
     });
   }
 }
 for(const run of runs)
   run.wrapsZero=run.startEdgeIndex>run.endEdgeIndex&&run.count>1;
 if(runs.reduce((sum,run)=>sum+run.count,0)!==n||
   new Set(runs.flatMap(run=>run.sourceEdgeIndices)).size!==n)
   hold('missing or repeated source edge in cyclic run');
 return runs;
}
const midpoint=e=>({x:(e.a.x+e.b.x)/2,y:(e.a.y+e.b.y)/2});
export function buildC1LLandmassSourceArcReview(selected,c1f,c1kReview,l){
 const sectors=selected?.edgeSectors;
 if(selected?.main?.id!==l.mainlandSourceContourId||
   selected.main.points?.length!==599||
   !Array.isArray(sectors)||sectors.length!==3||
   !same(sectors.map(x=>x.length),[90,106,114])||
   selected.unreviewedEdges?.length!==289||
   selected.report?.originalSourceEdgesAccounted!==599||
   !same(selected.offshore?.map(x=>x.id),l.originalOffshoreContourIds)||
   c1kReview?.originalSourceEdges!==599||
   c1kReview.northernSourceEdges!==310||
   c1kReview.remainingOriginalSourceEdges!==289||
   c1kReview.assignedCoastlineEdges!==0||
   c1kReview.approvedInlandBorders!==0||
   c1kReview.canonicalWritable!==false)
   hold('C1-J/C1-K original coastline or approval drift');
 const edges=[...sectors.flat(),...selected.unreviewedEdges];
 const byIndex=Array(599).fill(null);
 const tags=Array(599).fill(null);
 const matchedGuides=c1f.regionGuides.filter(g=>g.guidePolygon!==null);
 if(!same(matchedGuides.map(g=>g.regionId),regionIds.slice(0,4)))
   hold('unexpected mainland guide identities');
 for(const e of edges){
   const i=e.sourceEdgeIndex;
   const a=selected.main.points[i],b=selected.main.points[(i+1)%599];
   if(!Number.isInteger(i)||i<0||i>=599||byIndex[i]||
     e.a.x!==a.x||e.a.y!==a.y||
     e.b.x!==b.x||e.b.y!==b.y)
     hold('duplicate, altered or unregistered original source edge');
   byIndex[i]=e;
 }
 if(byIndex.some(e=>e===null))hold('source edge omitted from review');
 const north=sectors[0].concat(sectors[1]);
 for(const e of north){
   const matching=matchedGuides.filter(g=>coordinatePolygonContains(
     {outer:g.guidePolygon},midpoint(e)));
   if(matching.length>1)hold('overlapping northern mainland draft guides');
   tags[e.sourceEdgeIndex]=matching.length===0?
     C1L_ARC_CLASSES[2]:matching[0].regionId==='region.veyrholm_shore'?
     C1L_ARC_CLASSES[0]:C1L_ARC_CLASSES[1];
 }
 for(const e of sectors[2])tags[e.sourceEdgeIndex]=C1L_ARC_CLASSES[3];
 for(const e of selected.unreviewedEdges)tags[e.sourceEdgeIndex]=C1L_ARC_CLASSES[4];
 if(tags.some(t=>t===null))hold('unclassified original source edge');
 const sourceArcRuns=groupCyclicSourceArcStatuses(tags);
 const counts=Object.fromEntries(C1L_ARC_CLASSES.map(t=>[t,0]));
 for(const tag of tags)counts[tag]++;
 if(Object.values(counts).reduce((x,y)=>x+y,0)!==599||
   counts[C1L_ARC_CLASSES[3]]!==114||
   counts[C1L_ARC_CLASSES[4]]!==289||
   counts[C1L_ARC_CLASSES[0]]+counts[C1L_ARC_CLASSES[1]]+
     counts[C1L_ARC_CLASSES[2]]!==196)
   hold('source arcs fail north-sector accounting');
 if(c1kReview.inlandInterfaces?.length!==4||
   c1kReview.inlandInterfaces.some(i=>i.approvedBorderGeometryRef!==null||
     i.isProposedBorder!==false))
   hold('inland guide-gap witness improperly promoted');
 return {
   originalSourceContourId:l.mainlandSourceContourId,
   originalEdgesAccounted:599,
   northernOriginalEdgesAccounted:310,
   otherOriginalEdgesAccounted:289,
   countsBySourceArcStatus:counts,
   cyclicSourceArcRuns:sourceArcRuns,
   statusByOriginalSourceEdgeIndex:tags,
   existingInlandGuideInterfaces:c1kReview.inlandInterfaces.map(i=>({
     interfaceId:i.reviewInterfaceId,guideGapPixels:i.guideGapPixels,
     approvedBorderGeometryRef:null,isProposedBorder:false,
   })),
   physicalMainlandCandidateCells:79419,
   unassignedPhysicalMainlandCandidateCells:26795,
   physicalDetachedCandidatesHeld:18,
   proposedCoastalOwnershipEdges:0,
   publishedRegionBorders:0,
   publishedIslandOwnershipClaims:0,
   canonicalWritable:false,
   ownerVisualReviewRequired:true,
 };
}
