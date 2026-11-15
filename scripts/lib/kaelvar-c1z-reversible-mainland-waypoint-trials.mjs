/**
 * C1-Z: native, reversible single-waypoint inland seam trials.
 * IMPORTANT: The accepted C1-P rings and original physical component-30
 * mask are NEVER modified. Each option is a cloned source-indexed region
 * proposal, then independently revalidated and remeasured in memory.
 */
import {validateC1PReviewProposal} from './kaelvar-c1p-regional-seam-review.mjs';
import {buildC1ORegionalGeometry,measureC1OReviewTerrain}
 from './kaelvar-c1o-regional-boundaries.mjs';
import {measureC1YGapWindow} from './kaelvar-c1y-independent-mainland-gap-review.mjs';

const fail=s=>{throw Error('C1-Z reversible source HOLD: '+s);};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const REGION=['region.auric_marches','region.kharuun_drylands',
 'region.verdant_thalos','region.veyrholm_shore'];
const INTERFACES=[
 'VEYRHOLM_KHARUUN_NORTHERN_INLAND',
 'KHARUUN_VERDANT_SOUTHERN_TRANSITION'
];
const OPTIONS=[
 {id:'NORTH_VEYRHOLM_SOUTH_TWO',interfaceId:INTERFACES[0],
  editedRegion:REGION[3],waypointIndex:3,original:[284,190],candidate:[284,192]},
 {id:'NORTH_KHARUUN_NORTH_TWO',interfaceId:INTERFACES[0],
  editedRegion:REGION[1],waypointIndex:20,original:[301,193],candidate:[301,191]},
 {id:'SOUTH_KHARUUN_SOUTH_THREE',interfaceId:INTERFACES[1],
  editedRegion:REGION[1],waypointIndex:9,original:[314,320],candidate:[314,323]},
 {id:'SOUTH_VERDANT_NORTH_THREE',interfaceId:INTERFACES[1],
  editedRegion:REGION[2],waypointIndex:6,original:[320,334],candidate:[320,331]}
];
const SOURCES={
 vectorBlob:'9cd6752e9dbca00796e5f7c013066bb0e5a96175',
 sourceCoastEdges:599,
 biomeSha256:'9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12',
 elevationSha256:'02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d',
 mainlandComponent:30,reference:{width:2048,height:1152}
};
const PRIOR={
 sourceStatus:'C1Y_STRICT_MAINLAND_GAP_WINDOWS_MEASURED_NO_OWNER_OR_PIXEL_ALLOCATION',
 northernInterface:INTERFACES[0],southernInterface:INTERFACES[1],
 northernUnassignedGapSamples:10,southernUnassignedGapSamples:15,
 northernPathSha256:'fe195e3afa7ed20105bea1b23d7f32134abaee9152f02cf6c5412bd445bb9860',
 southernPathSha256:'5363789bd3854425a2e984ca736bf21518235d0ae91b57cbc209270c9015e577'
};
const POLICY={
 singleWaypointReplacementPerTrial:true,
 allOtherSourceIndexedArcsAndWaypointsFrozen:true,
 permitOnlyOriginalComponent30PixelOwnershipDeltas:true,
 newPoliticalOwnershipNotPublished:true,
 requireChangesInsideSelectedC1YWindow:true,
 onlyAllowOwnerAndUnassignedTransitions:true,
 rejectThirdPartyOwnerChanges:true,
 noClaimOfPreviouslyHeldComponentOrSourceInk:true,
 minimumResidualUnassignedPathCells:4,
 maximumChangedComponent30CellsPerTrial:250,
 doNotAutomaticallySelectShortestGap:true
};
const HOLDS={
 sourceVectorUnchanged:true,sourceBiomeElevationPngsUnchanged:true,
 originalTerrainLabelsUnchanged:true,
 acceptedC1PPolygonsUnchanged:true,
 originalC1PCounts:[5632,18624,19182,9011],
 originalMainlandCandidates:79419,originalAssigned:52449,originalUnassigned:26970,
 kharuunOptionBSourceEdges:[35,58],
 verdantSoutheasternPeninsulaAnchorsPreserved:3,
 veyrholmInteriorExclusionAnchorsPreserved:3,
 northeasternHeadlandEdges:[75,115],
 northeasternHeadlandOwner:null,component51Owner:null,
 shattercapDetachedIslandsUnassigned:true,
 largeNortheasternIslandUnassigned:true,
 noOtherDetachedComponentsClaimed:true,
 coast40Claim:null,serathylWindwardParent:'region.serathyl',
 newPortsWellsRiversRoutesSaltBasins:0,
 noNewLegacyHexDependencies:true,canonicalWritable:false
};

export function validateC1ZContract(s,p,c1p,ySpec,yReport){
 if(s?.schemaVersion!==1||
  s.type!=='kaelvar-c1z-reversible-two-seam-inland-waypoint-alternatives.v1'||
  s.status!=='FOUR_SOURCE_BACKED_LOCAL_WAYPOINT_TRIALS_NO_ACCEPTED_C1P_OR_CANONICAL_CHANGE'||
  s.parentC1YHead!=='02b8013cab3b47a3bfbca3d3c1a9a37d3efe29ed'||
  !equal(s.sources,SOURCES)||!equal(s.priorC1Y,PRIOR)||
  !equal(s.trialPolicy,POLICY)||!equal(s.alternatives,OPTIONS)||
  !equal(s.holds,HOLDS))
  fail('original C1-P source, fixed waypoint experiment, or inherited hold drift');
 if(p?.sourceVectorBlob!==SOURCES.vectorBlob||
  p.sourceBiomePngSha256!==SOURCES.biomeSha256||
  p.originalSourceEdgeCount!==599||
  p.ownerReviewDirection?.kharuunFrontageOption!=='B'||
  !equal(p.ownerReviewDirection.kharuunSourceEdgeIndicesInclusive,[35,58])||
  p.ownerReviewDirection.northeastHeadlandOwnership!=='HELD'||
  !equal(p.regions?.map(x=>x.regionId),REGION)||
  !equal(p.regions.map(x=>x.sourceArc),[
   {startVertex:420,endVertex:455},
   {startVertex:35,endVertex:59},
   {startVertex:195,endVertex:349},
   {startVertex:475,endVertex:24}
  ])||p.holds?.canonicalWritable!==false||
  c1p?.status!=='C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD'||
  c1p.sourceVectorBlob!==SOURCES.vectorBlob||
  c1p.sourcePngFingerprintsVerified!==true||
  c1p.sourceOriginalContourUnmodified!==true||
  c1p.originalSourceEdgesConserved!==599||
  c1p.diagnostic?.polygonOwnershipCollisions!==0||
  c1p.measurements?.candidateMainlandTerrainCells!==79419||
  c1p.measurements.previewAssignedMainlandTerrainCells!==52449||
  c1p.measurements.remainingUnassignedMainlandTerrainCells!==26970||
  !equal(c1p.measurements.perRegion.map(x=>x.terrainCandidateCells),
   [5632,18624,19182,9011])||
  c1p.measurements.detachedPhysicalComponentsClaimed!==0||
  c1p.holds?.canonicalWritable!==false)
  fail('accepted C1-P terrain accounting, source arcs, or Kharuun B changed');
 if(ySpec?.parentC1XHead!=='9ed8209e48acb20b6fd834e7a95afeec27ec94db'||
  ySpec.search?.allowedTransitTerrainComponent!==30||
  ySpec.hold?.canonicalWritable!==false||
  yReport?.status!==PRIOR.sourceStatus||
  !equal(yReport.reviewWindows?.slice(2,4).map(x=>x.id),INTERFACES)||
  yReport.reviewWindows[2].minimumUnassignedIntermediateCells!==10||
  yReport.reviewWindows[3].minimumUnassignedIntermediateCells!==15||
  yReport.reviewWindows[2].pathSha256!==PRIOR.northernPathSha256||
  yReport.reviewWindows[3].pathSha256!==PRIOR.southernPathSha256||
  !equal(yReport.frozenC1P?.perRegion,[5632,18624,19182,9011])||
  yReport.frozenC1P.originallyAssigned!==52449||
  yReport.frozenC1P.deliberatelyUnassigned!==26970||
  yReport.frozenC1P.canonicalWritable!==false)
  fail('C1-Y source gap and baseline evidence changed');
 for(const opt of OPTIONS){
  const original=p.regions.find(x=>x.regionId===opt.editedRegion);
  if(!equal(original?.inlandWaypoints?.[opt.waypointIndex],opt.original))
   fail('C1-P original waypoint moved before reversible trial '+opt.id);
 }
 return true;
}

function changes(baseline,trial,labels,editedOwner,window,maxCount){
 const bounds=window.bounds,changes=[],counts={gained:0,released:0};
 for(let i=0;i<labels.length;i++){
  const was=baseline[i],now=trial[i];if(was===now)continue;
  const x=i%2048,y=Math.floor(i/2048);
  if(labels[i]!==30||(was!==0&&was!==editedOwner)||
   (now!==0&&now!==editedOwner)||
   x<bounds.minX||x>bounds.maxX||y<bounds.minY||y>bounds.maxY)
   fail('trial changes protected source/third-party/outside-window candidate sample');
  if(!((was===0&&now===editedOwner)||(was===editedOwner&&now===0)))
   fail('trial changes forbidden owner pair');
  if(now===editedOwner)counts.gained++;else counts.released++;
  changes.push({x,y,from:was,to:now});
  if(changes.length>maxCount)
   fail('trial changed too many original mainland candidate samples');
 }
 return {counts,changedCells:changes};
}

function oneTrial({opt,proposal,baseGeom,baselineOwner,labels,
 originalContour,selected,c1n,c1f,window,originalGap}){
 const cloned=structuredClone(proposal);
 const i=REGION.indexOf(opt.editedRegion);
 cloned.regions[i].inlandWaypoints[opt.waypointIndex]=[...opt.candidate];
 const baseWaypoints=proposal.regions[i].inlandWaypoints;
 const neighbors=[baseWaypoints[opt.waypointIndex-1],baseWaypoints[opt.waypointIndex+1]];
 if(neighbors.some(p=>!Array.isArray(p)||p.length!==2))
  fail('C1-Z trial local comparison neighbors missing');
 const record={
  id:opt.id,interfaceId:opt.interfaceId,editedRegion:opt.editedRegion,
  originalWaypoint:opt.original,trialWaypoint:opt.candidate,
  originalLocalReturn:[neighbors[0],opt.original,neighbors[1]],
  proposedLocalReturn:[neighbors[0],opt.candidate,neighbors[1]],
  waypointIndex:opt.waypointIndex,sourceArcChanged:false,
  proposedPermanentSourceOrRegionEdit:false,ownerApproval:false,
  status:'NOT_EVALUATED',reason:null
 };
 try{
  const geom=buildC1ORegionalGeometry({
   proposal:cloned,selected,c1n,c1f
  });
  for(let k=0;k<4;k++){
   if(!equal(geom.regions[k].sourceEdgeIndices,
    baseGeom.regions[k].sourceEdgeIndices)||
    !equal(geom.regions[k].sourceCoastEdgeOriginalPoints,
     baseGeom.regions[k].sourceCoastEdgeOriginalPoints))
    fail('trial coastline source-index data changed');
   if(k!==i&&!equal(geom.regions[k].polygonRing,
    baseGeom.regions[k].polygonRing))
    fail('trial modified another provisional region ring');
  }
  if(geom.regionalOverlapCount!==0||geom.sourceCrossingCount!==0||
   geom.offshoreSourceCrossingCount!==0||geom.originalContour.length!==599||
   geom.originalSourceContoursModified!==0)
   fail('trial violates original source/region topology');
  const measurement=measureC1OReviewTerrain(geom,labels);
  const state=changes(baselineOwner,measurement.ownership,labels,i+1,
   window,POLICY.maximumChangedComponent30CellsPerTrial);
  const gap=measureC1YGapWindow(window,labels,measurement.ownership,
   originalContour);
  if(gap.status!=='STRICT_COMPONENT30_GAP_FOUND'||
   gap.minimumUnassignedIntermediateCells<
    POLICY.minimumResidualUnassignedPathCells)
   fail('trial erases strict unassigned interface gap');
  if(gap.minimumUnassignedIntermediateCells>originalGap)
   fail('trial broadens source gap rather than refining studied transition');
  if(state.changedCells.length===0)
   fail('trial causes no original mainland sample difference');
  const deltas=measurement.perRegion.map((x,j)=>
   x.terrainCandidateCells-
   baseGeom.regionCandidatesBaselineCounts[j]);
  if(deltas.some((x,j)=>j!==i&&x!==0)||
   deltas[i]!==state.counts.gained-state.counts.released||
   measurement.previewAssignedMainlandTerrainCells-
     baseGeom.originallyAssigned!==deltas[i]||
   measurement.previewAssignedMainlandTerrainCells+
     measurement.remainingUnassignedMainlandTerrainCells!==79419)
   fail('region candidate sample conservation or one-region-only delta failed');
  record.status=gap.minimumUnassignedIntermediateCells<originalGap?
    'VALID_REVERSIBLE_REDUCED_GAP_REVIEW_ONLY':
    'VALID_REVERSIBLE_SAME_GAP_REVIEW_ONLY';
  Object.assign(record,{
   regionSourceCoastEdgesUnchanged:true,
   originalProtectedAnchorsPreserved:true,
   regionalCollisions:0,originalCoastCrossings:0,
   protectedOffshoreContourCrossings:0,
   originalComponent30Only:true,delta:state.counts,
   changedOriginalMainlandSamples:state.changedCells.length,
   changeCells:state.changedCells,
   trialSourceTerrainCandidatesByRegion:measurement.perRegion.map(
    x=>x.terrainCandidateCells),
   trialAssignedCandidateCells:measurement.previewAssignedMainlandTerrainCells,
   trialUnassignedCandidateCells:measurement.remainingUnassignedMainlandTerrainCells,
   baselineUnassignedGapSamples:originalGap,
   trialUnassignedGapSamples:gap.minimumUnassignedIntermediateCells,
   shortestTrialPathSteps:gap.shortestPixelSteps,
   trialPathSha256:gap.pathSha256,
   trialEndpointSamples:gap.endpointSamples,
   trialMidGapReviewPoint:gap.tentativeMidGapReviewPoint,
   trialGapSourcePath:gap.pathSamples,
   sourceIndexedRing:geom.regions[i].polygonRing,
   acceptedAsC1PRegion:false,canonicalWritable:false
  });
 }catch(e){
  record.status='REJECTED_NO_SOURCE_OR_POLITICAL_CHANGE';
  record.reason=String(e.message).slice(0,230);
  record.acceptedAsC1PRegion=false;
  record.canonicalWritable=false;
 }
 return record;
}

export function buildC1ZReversibleTrials({spec,p,o,c1p,ySpec,yReport,
 f,selected,c1n,labels,ownership,revised}){
 validateC1ZContract(spec,p,c1p,ySpec,yReport);
 if(labels?.length!==2048*1152||ownership?.length!==labels.length||
   revised?.regions?.length!==4||revised.originalContour?.length!==599||
   revised.protectedOffshore?.length!==3||
   selected?.main?.points?.length!==599)
  fail('original native mainland labels or source-indexed polygon geometry missing');
 const proposal=validateC1PReviewProposal(p,o,f);
 const baseGeom=Object.assign({},revised,{
  regionCandidatesBaselineCounts:[5632,18624,19182,9011],
  originallyAssigned:52449
 });
 const windows=new Map(ySpec.search.windows.map(w=>[w.id,w]));
 const sourcePaths=new Map(yReport.reviewWindows.map(w=>[
  w.id,w.minimumUnassignedIntermediateCells]));
 const results=OPTIONS.map(opt=>{
  const window=windows.get(opt.interfaceId);
  return oneTrial({opt,proposal,baseGeom,baselineOwner:ownership,
   labels,originalContour:revised.originalContour,selected,c1n,c1f:f,
   window,originalGap:sourcePaths.get(opt.interfaceId)});
 });
 const accepted=results.filter(x=>x.status.startsWith('VALID_'));
 return {
  status:'C1Z_FOUR_SOURCE_INDEXED_REVERSIBLE_WAYPOINT_TRIALS_CANONICAL_HELD',
  sourceWitness:{originalSourceVectorBlob:SOURCES.vectorBlob,
   sourceCoastlineEdges:599,
   originalBiomeSha256:SOURCES.biomeSha256,
   originalElevationSha256:SOURCES.elevationSha256,
   originalMainlandPhysicalComponent:30},
  baseline:{
   regions:REGION,politicallyAssigned:52449,unassigned:26970,
   totalMainland:79419,perRegion:[5632,18624,19182,9011],
   gapWindows:[{id:INTERFACES[0],unassignedGapSamples:10},
    {id:INTERFACES[1],unassignedGapSamples:15}],
   originalFourC1PRingsUnchanged:true
  },
  alternatives:results,
  sourceGeometricValidReviewOptions:accepted.map(x=>x.id),
  interfaceReadiness:INTERFACES.map(id=>({
   interfaceId:id,
   hasValidatedWaypointAlternative:accepted.some(x=>x.interfaceId===id),
   hasReducedGapOption:accepted.some(x=>x.interfaceId===id&&
    x.status==='VALID_REVERSIBLE_REDUCED_GAP_REVIEW_ONLY'),
   politicalOwnerApproval:false
  })),
  interpretation:{
   shortestGapIsNotBestPoliticalBoundary:true,
   trialPolygonsAreNotAcceptedWorldContent:true,
   originalFourC1PPolygonsRemainAuthoritativeForReview:true,
   noTrialAutomaticallySelected:true,
   dataAreReferencePixelsNotMetricDistances:true
  },
  unchanged:{
   originalSourceVectorEdges:599,originalSourceRasterChanges:0,
   originalComponentLabelChanges:0,acceptedC1PRegionRingChanges:0,
   acceptedC1POwnerChanges:0,newTerritorialClaims:0,
   originalDetachedPhysicalComponentClaims:0,
   originalKharuunOptionBSourceEdges:[35,58],
   northeasternHeadlandOriginalEdges:[75,115],
   northeasternHeadlandOwner:null,component51Owner:null,
   shattercapUnassigned:true,largeNEIslandUnassigned:true,
   southeasternVerdantPeninsulaPreserved:true,
   veyrholmDryInlandExcluded:true,
   coast40Claim:null,foreignSerathylWindwardParent:'region.serathyl',
   portsWellsRiversRoutesSaltBasinsAdded:0,
   canonicalWritable:false
  }
 };
}
