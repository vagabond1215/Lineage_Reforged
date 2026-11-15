/**
 * C1-AB: read-only endpoint continuity review for owner-proposed
 * approximate shared geographic subchains. Not a landscape classifier
 * or a canonical primary-region resolver.
 */
const fail=s=>{throw Error('C1-AB shared-seam source HOLD: '+s);};
const equals=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const expected={
 sourceHead:'d5f68ef349591eb696475a993e9c05e83a80af8d',
 sourceAssumption:{origin:'OWNER_CLARIFICATION_2026_11_15',
  generator:'Fantasy Map Simulator',
  ordinalElevation:'ORANGE_RED_HIGHER_CREAM_LOWER',
  numericElevation:false,hydrologicalModel:false,saveMatched:false},
 holds:['OPTION_B_35_58','VEYRHOLM_EXCLUSIONS','VERDANT_SE_PENINSULA',
  'NE_HEADLAND_75_115','COMPONENT_51','SHATTERCAP','DETACHED_NE_ISLAND',
  'ALL_OTHER_DETACHED_COMPONENTS','COAST_40','SERATHYL_WINDWARD',
  'CANONICAL_PUBLICATION'],
 candidates:[
  {id:'NORTH_APPROXIMATE_COASTAL_TRANSITION',
   confidence:'PLAUSIBLE',
   regionIds:['region.kharuun_drylands','region.veyrholm_shore'],
   sharedChain:[[279,197],[291,192],[301,188],[308,185]],
   changeWindow:{minX:270,maxX:326,minY:170,maxY:205},
   replacements:[
    {regionId:'region.kharuun_drylands',start:19,deleteCount:2,reverse:false},
    {regionId:'region.veyrholm_shore',start:2,deleteCount:2,reverse:true}
   ]},
  {id:'SOUTH_APPROXIMATE_UPLAND_APRON',
   confidence:'PLAUSIBLE',
   regionIds:['region.kharuun_drylands','region.verdant_thalos'],
   sharedChain:[[304,330],[320,331],[338,332],[352,333]],
   changeWindow:{minX:289,maxX:369,minY:308,maxY:349},
   replacements:[
    {regionId:'region.kharuun_drylands',start:7,deleteCount:3,reverse:true},
    {regionId:'region.verdant_thalos',start:5,deleteCount:4,reverse:false}
   ]}
 ],
 rejectedNorthPreserved:{start:18,deleteCount:3,accepted:false},
 rejectedSouthId:'SOUTH_CROSSING_DRAINAGE_HOOK_SKETCH'
};
const expectedEvidence={
 sourceBase:'d5f68ef349591eb696475a993e9c05e83a80af8d',
 testedSourceCommit:'7e41d35cabb22a2ae9010dd4e4860209c877be88',
 decision:'TWO_PLAUSIBLE_APPROXIMATE_SHARED_BOUNDARIES_RECOMMENDED_PROVISIONALLY',
 originalSource:{vectorBlob:'9cd6752e9dbca00796e5f7c013066bb0e5a96175',
  biome:'9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12',
  elevation:'02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d'},
 baseline:{assigned:52449,unassigned:26970,component30:79419,
  perRegion:[5632,18624,19182,9011]},
 scenarios:[
  {id:'NORTH_APPROXIMATE_COASTAL_TRANSITION',assigned:52836,
   unassigned:26583,changed:387,unknown:34,ties:1},
  {id:'SOUTH_APPROXIMATE_UPLAND_APRON',assigned:53808,
   unassigned:25611,changed:1359,unknown:11,ties:0},
  {id:'BOTH_SHARED_SEAMS',assigned:54195,
   unassigned:25224,changed:1746,unknown:45,ties:1}
 ]
};
const idToCode=['region.auric_marches','region.kharuun_drylands',
 'region.verdant_thalos','region.veyrholm_shore'];
const hypot=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
const dotTurn=(a,b,c)=>{
 const u=[b[0]-a[0],b[1]-a[1]],
  v=[c[0]-b[0],c[1]-b[1]];
 const lens=Math.hypot(...u)*Math.hypot(...v);
 if(lens===0)return null;
 return Math.round(Math.acos(Math.max(-1,Math.min(1,
  (u[0]*v[0]+u[1]*v[1])/lens)))*180/Math.PI*100)/100;
};

export function validateC1ABFixedReview(spec,p,evidence){
 if(spec?.schemaVersion!==1||
  spec.type!=='C1AA_RELATIVE_RELIEF_SHARED_SEAMS_REVIEW_ONLY'||
  spec.canonicalWritable!==false||spec.acceptedC1PChanged!==false||
  spec.physicalLabelsChanged!==false||
  spec.sourceHead!==expected.sourceHead||
  !equals(spec.sourceAssumption,expected.sourceAssumption)||
  spec.boundaryRule!=='LEXICOGRAPHIC_REGION_ID_ON_DECLARED_SHARED_EDGE_ONLY'||
  !equals(spec.holds,expected.holds)||
  spec.scope!=='LOCAL_SHARED_SUBCHAINS_ONLY_NOT_COMPLETE_FINALIZED_LAND_COVERAGE'||
  spec.candidates?.length!==2||
  spec.candidates.some((x,i)=>Object.entries(expected.candidates[i])
   .some(([key,value])=>!equals(x[key],value)))||
  spec.rejectedInitialNorthPatch?.accepted!==false||
  !equals(spec.rejectedInitialNorthPatch?.kharuunReplacement,
   {start:expected.rejectedNorthPreserved.start,
    deleteCount:expected.rejectedNorthPreserved.deleteCount})||
  spec.rejectedSketch?.id!==expected.rejectedSouthId)
  fail('owner-relative source assumptions, exact chains, retired sketch or island holds changed');
 if(p?.sourceVectorBlob!==expectedEvidence.originalSource.vectorBlob||
  p.sourceBiomePngSha256!==expectedEvidence.originalSource.biome||
  p.ownerReviewDirection?.kharuunFrontageOption!=='B'||
  !equals(p.ownerReviewDirection?.kharuunSourceEdgeIndicesInclusive,[35,58])||
  p.ownerReviewDirection?.northeastHeadlandOwnership!=='HELD'||
  p.holds?.canonicalWritable!==false||
  !equals(p.regions?.map(x=>x.regionId),idToCode))
  fail('accepted C1-P source / option B / region IDs changed');
 if(evidence?.sourceBase!==expectedEvidence.sourceBase||
   evidence.testedSourceCommit!==expectedEvidence.testedSourceCommit||
   evidence.decision!==expectedEvidence.decision||
   !equals(evidence.source,expectedEvidence.originalSource)||
   !equals(evidence.baseline,expectedEvidence.baseline)||
   !equals(evidence.scenarios?.map(x=>({
    id:x.id,assigned:x.assigned,unassigned:x.unassigned,
    changed:x.changedOriginalComponent30Samples,
    unknown:x.unresolvedNewEnvelopeSamples,
    ties:x.sharedEdgeSampleTies
   })),expectedEvidence.scenarios)||
   evidence.canonicalWritable!==false||
   evidence.acceptedC1PChanged!==false||
   evidence.physicalLabelsChanged!==0||
   evidence.sourcePixelsChanged!==0)
  fail('tested native shared-seam measurement or canonical hold changed');
 return true;
}

export function buildC1ABJunctionAudit({spec,p,evidence,nativeReport}){
 validateC1ABFixedReview(spec,p,evidence);
 if(nativeReport){
  if(nativeReport.status!=='C1AA_QUALITATIVE_SHARED_SEAMS_PROVISIONAL_NOT_CANONICAL'||
   nativeReport.acceptedC1PChanged!==false||
   nativeReport.canonicalWritable!==false||
   nativeReport.source?.vectorBlob!==expectedEvidence.originalSource.vectorBlob||
   !equals(nativeReport.scenarios?.map(x=>({
    id:x.id,assigned:x.assigned,unassigned:x.unassigned,
    changed:x.changedOriginalComponent30Samples,
    unknown:x.unresolvedNewEnvelopeSamples,
    ties:x.sharedEdgeSampleTies
   })),expectedEvidence.scenarios))
   fail('native repeated source report drift');
 }
 const regions=[];
 for(const c of spec.candidates){
  const joins=[];
  for(const repl of c.replacements){
   const region=p.regions.find(r=>r.regionId===repl.regionId);
   const points=region?.inlandWaypoints;
   if(!points||repl.start<0||repl.start+repl.deleteCount>points.length)
    fail('original inland waypoint return is unavailable');
   const preceding=points[repl.start-1]??null;
   const following=points[repl.start+repl.deleteCount]??null;
   const proposed=repl.reverse?[...c.sharedChain].reverse():c.sharedChain;
   const old=points.slice(repl.start,repl.start+repl.deleteCount);
   if(preceding&&!Number.isFinite(hypot(preceding,proposed[0])))
    fail('bad original junction geometry');
   if(following&&!Number.isFinite(hypot(proposed.at(-1),following)))
    fail('bad onward junction geometry');
   joins.push({
    regionId:repl.regionId,
    replacedExistingWaypoints:old,
    sharedChainTraversal:repl.reverse?'REVERSE':'FORWARD',
    beforeFirstSharedEndpoint:{
     priorOriginalWaypoint:preceding,firstSharedPoint:proposed[0],
     connectingReferenceGridDistance:preceding?
      Math.round(hypot(preceding,proposed[0])*100)/100:null,
     coordinateTurnDegrees:preceding?
      dotTurn(preceding,proposed[0],proposed[1]):null
    },
    afterLastSharedEndpoint:{
     lastSharedPoint:proposed.at(-1),
     nextOriginalWaypoint:following,
     connectingReferenceGridDistance:following?
      Math.round(hypot(proposed.at(-1),following)*100)/100:null,
     coordinateTurnDegrees:following?
      dotTurn(proposed.at(-2),proposed.at(-1),following):null,
     nextConnectionMayBeCoastArc:following===null
    },
    joinsAreAuthoringGeometryNotCertifiedRidgesOrRivers:true
   });
  }
  regions.push({
   candidateId:c.id,sharedChain:c.sharedChain,sharedEndpoints:[
    c.sharedChain[0],c.sharedChain.at(-1)],
   sourceConfidence:'PLAUSIBLE_OWNER_RELATIVE_ELEVATION',
   endpointContinuityStatus:'NEEDS_WIDER_SOURCE_BACKED_REVIEW',
   eastOrCoastalReturnIsNotFullyAdjudicated:true,
   regionJoins:joins,canonicalWritable:false
  });
 }
 const totalUnassigned=evidence.scenarios[2].unassigned;
 return {
  status:'C1AB_FOUR_ENDPOINTS_PINNED_GEOGRAPHIC_CONTINUATION_HELD',
  originalNativeEvidenceCommit:expectedEvidence.testedSourceCommit,
  reportValidatedAgainstOriginalSource:!!nativeReport,
  sourceInterpretation:'OWNER_ORDINAL_ORANGE_RED_HIGHER_CREAM_LOWER',
  originalSavedGameMatched:false,
  inspectedSharedSeams:regions,
  combinedNoncanonicalCoverage:{
   originalMainlandCandidateCells:79419,
   provisionalNewCandidateCells:1746,
   combinedAssignedCandidateCells:54195,
   combinedUnassignedCandidateCells:totalUnassigned,
   unresolvedNewEnvelopeSamples:45,
   originalRegionGeometryChanged:false,
   sourcePhysicalLabelsChanged:false
  },
  boundaryReviewRequirements:{
   northTerminalContext:'Coastal/inland approach must be reviewed beyond local shared subchain',
   southEasternContinuation:'Wider drawn drainage course crossed by return; revisit before source-geographic adoption',
   noElevationMetersSlopeOrAutomatedHydrology:true,
   noAutomaticTerrainFeatureApproval:true,
   noAuthoringOfRegionlessTransitoryBand:true,
   eventualFinalizedLandOnePrimaryRegion:true,
   noCanonicalWriteOrIslandClaim:true
  }
 };
}
