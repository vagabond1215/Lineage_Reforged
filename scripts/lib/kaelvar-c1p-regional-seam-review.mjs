/**
 * C1-P: source-indexed, reversible mainland seam candidates.
 * Builds on exact C1-O evidence; never publishes world/region content.
 */
import {validateC1OContract,buildC1ORegionalGeometry,
  measureC1OReviewTerrain,c1oPointInRing}
  from './kaelvar-c1o-regional-boundaries.mjs';

const hold=s=>{throw Error('C1-P noncanonical HOLD: '+s);};
const IDS=['region.auric_marches','region.kharuun_drylands',
 'region.verdant_thalos','region.veyrholm_shore'];
const SOURCE='9cd6752e9dbca00796e5f7c013066bb0e5a96175';
const BIOME='9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12';
const C1O='7b1092c0aa71eb744182d4293859fb4b15fb5571';
const edgeMatches=(a,b)=>a?.startVertex===b?.startVertex&&a?.endVertex===b?.endVertex;
const exact=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

/** The C1-P JSON can change *only* its candidate inland return points. */
export function validateC1PReviewProposal(p,o,f){
 if(p?.schemaVersion!==1||
  p.type!=='kaelvar-c1p-reversible-mainland-seam-review.v1'||
  p.status!=='FOUR_SOURCE_INDEXED_REFINED_RINGS_AUTHOR_REVIEW_ONLY_NATIVE_REMEASUREMENT_HELD'||
  p.baseC1OCommit!==C1O||
  p.C1ORegionProposalPath!=='docs/design/kaelvar-c1o-regional-boundary-candidates-2026-11-14.json'||
  p.sourceVectorBlob!==SOURCE||p.sourceBiomePngSha256!==BIOME||
  p.originalContourId!==o?.source?.mainlandContourId||
  p.originalSourceEdgeCount!==599||
  !Array.isArray(p.regions)||p.regions.length!==4||
  !exact(p.regions.map(r=>r.regionId),IDS))
  hold('C1-O source witness, C1-P stage or region identifiers drift');

 const d=p.ownerReviewDirection;
 if(d?.kharuunFrontageOption!=='B'||
  !exact(d.kharuunSourceEdgeIndicesInclusive,[35,58])||
  d.verdantAttachedSoutheasternPeninsula!=='INCLUDED_IN_MAINLAND_CANDIDATE'||
  d.shattercapDetachedIslandClaims!==0||
  !exact(d.northeastHeadlandOriginalEdgesInclusive,[75,115])||
  d.northeastHeadlandOwnership!=='HELD')
  hold('owner frontage, southeastern peninsula or northeast headland hold changed');

 const h=p.holds;
 if(h?.canonicalWritable!==false||h.sourceContourCertified!==false||
  h.politicalOwnershipApproved!==false||h.newActiveRegionGeometryRefs!==0||
  h.detachedIslandClaims!==0||h.shattercapPolygon!==null||
  h.largeNortheastIslandOwnershipApproved!==false||
  h.northeasternHeadlandOwnershipApproved!==false||
  h.coast40Claim!==null||h.foreignWindwardParent!=='region.serathyl'||
  h.portPlacements!==0||h.wellOrRiverPlacements!==0||
  h.waterRoutePlacements!==0||h.saltBasinPlacements!==0||
  h.newLegacyHexDependencies!==0)
  hold('canonical, island, foreign or development dependency hold changed');

 if(!exact(p.c1oBaselineTerrainCells,{
  mainlandCandidateCells:79419,
  previewAssignedMainlandCells:53158,
  remainingUnassignedMainlandCells:26261}))
  hold('accepted C1-O terrain baseline changed');

 if(p.previewChecks?.newComponent30TerrainCellMeasurements!==null||
  p.previewChecks.nativeNodeAcceptanceClaimed!==false||
  p.previewChecks.sourceBiomeIsCertifiedLandWaterOrBiomes!==false)
  hold('unexecuted native acceptance or source-color semantics promoted');

 for(let i=0;i<4;i++){
  const r=p.regions[i],prior=o.regions[i];
  if(!edgeMatches(r.sourceArc,prior.sourceArc)||
   !Array.isArray(r.inlandWaypoints)||r.inlandWaypoints.length<5||
   r.inlandWaypoints.length>128||!r.inlandWaypoints.every(pt=>
    Array.isArray(pt)&&pt.length===2&&pt.every(x=>Number.isInteger(x)&&
      x>=0&&x<=2048))||
   !Number.isInteger(r.rawSourceContourInteriorPixelSamples)||
   r.rawSourceContourInteriorPixelSamples<=0||!r.reason)
   hold('source-indexed coast, inland waypoints or raw-pixel witness invalid: '+IDS[i]);
 }
 if(f?.reviewAnchors?.verdantMustIncludePeninsula?.length!==3||
  f.reviewAnchors.veyrholmMustExcludeInland?.length!==3)
  hold('C1-F owner anchors changed');

 // Never alter C1-O. All C1-P inland return proposals remain read-only.
 const modified=structuredClone(o);
 for(let i=0;i<4;i++)
  modified.regions[i].inlandWaypoints=p.regions[i].inlandWaypoints;
 return modified;
}

export function buildC1PRegionalReview({p,o,f,n,j,m,selected,labels=null}){
 const proposal=validateC1PReviewProposal(p,o,f);
 validateC1OContract(o,n,f,j,m);
 validateC1OContract(proposal,n,f,j,m);
 const baseline=buildC1ORegionalGeometry({proposal:o,selected,c1n:n,c1f:f});
 const revised=buildC1ORegionalGeometry({proposal,selected,c1n:n,c1f:f});
 for(let i=0;i<4;i++){
  const a=baseline.regions[i],b=revised.regions[i];
  if(!exact(a.sourceEdgeIndices,b.sourceEdgeIndices)||
    !exact(a.sourceCoastEdgeOriginalPoints,b.sourceCoastEdgeOriginalPoints))
   hold('C1-O original coastal edges changed: '+a.regionId);
  if(!exact(p.regions[i].sourceArc,{
    startVertex:b.sourceArcStartVertex,endVertex:b.sourceArcEndVertex}))
   hold('C1-P original arc changed');
 }
 if(!exact(revised.protectedOffshore.map(x=>x.id),
  baseline.protectedOffshore.map(x=>x.id)))
  hold('detached original-source contour identities changed');
 for(const island of revised.protectedOffshore)for(const r of revised.regions){
  if(island.points.some(point=>c1oPointInRing(point,r.polygonRing)))
   hold('source detached island point included inside '+r.regionId);
 }
 // Guard the unassigned northeast headland independently of candidate arcs.
 const expected=revised.coastalReviewArcs.find(x=>x.id==='northeast_headland');
 if(expected?.proposedRegionId!==null||
  !exact([expected.sourceEdgeIndices[0],expected.sourceEdgeIndices.at(-1)],[75,114]))
  hold('northeastern headland investigation was silently promoted');
 const result={status:'C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD',
  sourceVectorBlob:SOURCE,originalSourceEdgesConserved:599,
  regionCandidates:revised.regions.map(r=>({
   regionId:r.regionId,label:r.label,sourceEdgeIndices:r.sourceEdgeIndices,
   candidatePolygonVertices:r.polygonRing,rawOriginalContourPixelSamples:null,
   sourceContourCrossings:r.sourceInlandProperCrossings,
   protectedOffshoreCrossings:r.protectedOffshoreCrossings,
   politicalOwnershipApproved:false,canonicalGeometryRef:null,
  })),
  diagnostic:{polygonOwnershipCollisions:revised.regionalOverlapCount,
   sourceContourCrossings:revised.sourceCrossingCount,
   protectedOffshoreSourceClaims:0,
   detachedPhysicalComponentsClaimed:0},
  measurements:null,
  holds:{canonicalWritable:false,coastAndWaterNotCertified:true,
   shattercapAndLargeNEIslandHeld:true,northeastHeadlandHeld:true,
   coast40AndWindwardHeld:true,portsRoutesWellsSaltBasinsHeld:true},
 };
 if(labels!==null){
  const b=measureC1OReviewTerrain(baseline,labels);
  if(b.previewAssignedMainlandTerrainCells!==53158||
   b.remainingUnassignedMainlandTerrainCells!==26261||
   !exact(b.perRegion.map(x=>x.terrainCandidateCells),
     [6050,19265,19783,8060]))
   hold('C1-O raster baseline no longer reproduces accepted native totals');
  const next=measureC1OReviewTerrain(revised,labels);
  for(let i=0;i<4;i++){
   if(next.perRegion[i].rawPolygonInteriorPixelSamples!==
      p.regions[i].rawSourceContourInteriorPixelSamples)
    hold('C1-P raw source-contour pixel witness changed: '+IDS[i]);
  }
  result.regionCandidates.forEach((r,i)=>{
   r.rawOriginalContourPixelSamples=next.perRegion[i].rawPolygonInteriorPixelSamples;
   r.terrainCandidateCells=next.perRegion[i].terrainCandidateCells;
  });
  result.measurements={
   candidateMainlandTerrainCells:next.candidateMainlandTerrainCells,
   perRegion:next.perRegion,
   previewAssignedMainlandTerrainCells:next.previewAssignedMainlandTerrainCells,
   remainingUnassignedMainlandTerrainCells:next.remainingUnassignedMainlandTerrainCells,
   detachedPhysicalComponentsClaimed:next.detachedPhysicalComponentsClaimed,
   baselineAssignedMainlandTerrainCells:b.previewAssignedMainlandTerrainCells,
   baselineUnassignedMainlandTerrainCells:b.remainingUnassignedMainlandTerrainCells,
   sourceColorBiomesCertified:false,canonicalWritable:false,
  };
 }
 return {report:result,baseline,revised};
}
