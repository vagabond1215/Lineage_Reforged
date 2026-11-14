/**
 * C1-M owner design correction. "Kharuun HAS a short northern coast"
 * is accepted as authored geographic intent. Exact source arcs, sovereign
 * borders and a working port remain held until separately evidenced.
 */
const hold=s=>{throw Error('C1-M shoreline correction HOLD: '+s);};
const ids=[
 'region.auric_marches','region.kharuun_drylands','region.verdant_thalos',
 'region.veyrholm_shore','region.shattercap_isles',
];
const roles=[
 'WESTERN_STEPPE_MINERAL_FRONTIER',
 'CENTRAL_DRYLANDS_WITH_LIMITED_REAL_NORTHERN_SHORE',
 'SOUTHERN_WOODED_PENINSULA_WITH_SOUTHEAST_ANCHORS',
 'GEOGRAPHICALLY_SHAPED_NORTHERN_COASTAL_LANDS_NOT_UNIFORM_CORRIDOR',
 'DETACHED_WHOLE_ISLANDS_PENDING_OWNERSHIP',
];
const states=[
 'UNCHANGED_OWNER_DESCRIPTOR',
 'OWNER_SHORE_EXISTENCE_ACCEPTED_EXACT_FRONTAGE_HELD',
 'UNCHANGED_OWNER_DESCRIPTOR',
 'OWNER_CORRIDOR_REJECTION_ACCEPTED_EXACT_BOUNDARY_HELD',
 'UNPLACED_HELD',
];
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&
 a.every((x,i)=>x===b[i]);
const offshore=[
 'feature.coastline.first_world.part_7',
 'feature.coastline.first_world.part_8',
 'feature.coastline.first_world.part_31',
];
export function validateC1MShoreIntent(m,l,c1j){
 const p=m?.predecessor,o=m?.ownerVisualDecision,s=m?.retainedSourceClaims,
 a=m?.approval;
 if(m?.schemaVersion!==1||
   m.type!=='kaelvar-c1m-owner-northern-shore-geographic-intent.v1'||
   m.status!=='KHARUUN_SHORT_NORTHERN_SHORE_DESIGN_ACCEPTED_EXACT_GEOGRAPHY_HELD'||
   m.parentRegionId!=='region.kaelvar'||
   m.coordinateSpaceId!=='world_map.first_world.reference'||
   p?.stage!=='C1-L'||
   p.exactCommit!=='7f42edd5dd2d7e87bf434091df610352956d4316'||
   p.reviewPath!=='docs/design/kaelvar-c1l-landmass-coast-arc-adjudication-2026-11-14.json'||
   p.sourceContourId!=='feature.coastline.first_world.part_10'||
   p.originalSourceEdges!==599||
   !same(p.northSectorEdgeCounts,[90,106,114])||
   p.otherSourceEdges!==289||
   l?.mainlandSourceContourId!==p.sourceContourId||
   c1j?.mainlandSource?.id!==p.sourceContourId||
   c1j.mainlandSource?.vertices!==599)
   hold('predecessor, coastline or registered frame drift');
 if(typeof o?.observation!=='string'||!o.observation.trim()||
   o.precedence!=='SUPERSEDES_C1G_NO_KHARUUN_SEA_FRONTAGE_DEFAULT_AT_DESIGN_INTENT_ONLY'||
   o.oldVeyrholmCorridorIsAcceptedBoundary!==false||
   o.requirePhysicalCoastlineFollowNotRibbon!==true||
   o.kharuunHasShortNorthernCoastAtDesignLevel!==true||
   o.kharuunShoreIsNotEntireNortheastSector!==true||
   o.frontageSourceEdgeIndices!==null||
   o.frontageCoastStartPoint!==null||
   o.frontageCoastEndPoint!==null||
   o.frontageGeometryRef!==null||
   o.northernInlandBoundaryGeometryRef!==null||
   o.neighboringVeyrholmBoundaryGeometryRef!==null||
   o.portCityConceptAllowed!==true||
   o.portCityPlacementApproved!==false||
   o.portCityCoordinates!==null||
   o.portCityCanonicalId!==null||
   o.portCityName!==null||
   o.potableWaterSourceVerified!==false||
   o.harborBathymetryOrShelterVerified!==false||
   o.navigableConnectionVerified!==false||
   o.portRoutePublished!==false)
   hold('intent was replaced by unsupported shore arc, city, route or corridor');
 if(!Array.isArray(m.territorialIntents)||m.territorialIntents.length!==5||
   m.territorialIntents.some((r,i)=>
     r?.regionId!==ids[i]||r.role!==roles[i]||r.status!==states[i]))
   hold('five region roles or coastal interpretation drift');
 if(s?.originalMainlandEdgesAccounted!==599||
   s.originalMainlandEdgesChanged!==0||
   !same(s.sourceEdgeOwnershipClaims,[])||
   s.sourceOceanCalibrated!==false||
   s.physicalMainlandComponentId!==30||
   s.mainlandTerrainCandidateCells!==79419||
   s.unassignedMainlandTerrainCandidateCells!==26795||
   s.detachedPhysicalCandidates!==18||
   s.detachedPhysicalCandidateCells!==3693||
   s.northeastIslandWholeUnitHeld!==true||
   s.coast40OwnerRegionId!==null||
   s.foreignWindwardParent!=='region.serathyl'||
   !same(s.originalOffshoreContourOwnershipClaims,[])||
   s.saltBasinGeometryRef!==null)
   hold('original source landmass, islands, salt or foreign owner changed');
 if(a?.ownerDesignShoreExistenceAccepted!==true||
   a.ownerVisualReviewOfExactFrontageApproved!==false||
   a.coastlineSourceAsPoliticalBorderApproved!==false||
   a.kharuunCoastalGeometryApproved!==false||
   a.coastalPortSettlementPublished!==false||
   a.newRouteOrFerryPublished!==false||
   a.activeWorldGeographyWritable!==false||
   a.canonicalWritable!==false)
   hold('shore existence improperly promoted into certified geography');
 return {
   status:'C1M_KHARUUN_SHORE_DESIGN_ACCEPTED_GEOMETRY_HELD',
   kharuunHasShortNorthernCoast:true,
   veyrholmRibbonRejected:true,
   exactFrontageSourceEdgesApproved:0,
   placedPorts:0,
   canonicalWritable:false,
 };
}
export function buildC1MReview(prior,m){
 if(prior?.status!=='C1L_LANDMASS_ARC_REVIEW_COMPLETE_OWNER_VISUAL_GATE_HELD'||
   prior.originalEdgesAccounted!==599||
   prior.northernOriginalEdgesAccounted!==310||
   prior.otherOriginalEdgesAccounted!==289||
   prior.unassignedPhysicalMainlandCandidateCells!==26795||
   prior.inheritedDetachedPhysicalComponentsHeld!==18||
   !Array.isArray(prior.originalSourceEdgeClassifications)||
   prior.originalSourceEdgeClassifications.length!==599||
   !Array.isArray(prior.candidateMainlandRegionDescriptions)||
   prior.candidateMainlandRegionDescriptions.length!==5||
   prior.approval?.canonicalWritable!==false||
   prior.approval?.originalSourceArcRegionClaims!==0||
   prior.approval?.regionPolygonsPublished!==0)
   hold('C1-L source arc or held geometry drift');
 const counts=prior.countsBySourceArcStatus;
 if(!counts||
   counts.NE_VEYRHOLM_KHARUUN_COMPETITION_HELD!==114||
   counts.OTHER_SOURCE_ARC_UNREVIEWED_HELD!==289||
   counts.NW_NC_VEYRHOLM_GUIDE_MIDPOINT_ONLY+
    counts.NW_NC_OTHER_GUIDE_MIDPOINT_HELD+
    counts.NW_NC_NO_GUIDE_MIDPOINT_HELD!==196)
   hold('C1-L source arc accounting changed');
 if(m?.ownerVisualDecision?.frontageSourceEdgeIndices!==null||
   m.retainedSourceClaims?.sourceEdgeOwnershipClaims?.length!==0)
   hold('cannot claim exact Kharuun coastline from source midpoint tests');
 return {
   status:'C1M_KHARUUN_SHORE_INTENT_RECORDED_MAP_FRONTAGE_UNPLACED',
   coastlineSourceEdgeInventory:599,
   historicNortheasternCompetingSourceEdges:114,
   kharuunShoreExistence:'OWNER_ACCEPTED_DESIGN_GEOGRAPHY',
   exactKharuunSourceFrontage:'WITHHELD_NEEDS_SOURCE_AND_OWNER_ADJUDICATION',
   oldVeyrholmCorridor:'REJECTED_AS_POLITICAL_BOUNDARY',
   portOrCoastalCityConcept:'PERMITTED_UNPLACED_NO_NAME_OR_ROUTES',
   maritimeTerrainAndPotableWater:'NOT_VERIFIED',
   inlandBorderGeometriesApproved:0,
   publishedSourceEdgeOwnershipClaims:0,
   publishedIslandClaims:0,
   canonicalWritable:false,
 };
}
