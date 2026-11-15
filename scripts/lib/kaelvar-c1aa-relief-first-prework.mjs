/**
 * C1-AA uncalibrated elevation-first regional seam comparison.
 * Diagnostic only: original RGB is color, NOT altitude or hydrology.
 * Does not alter accepted C1-P polygons, original source pixels, islands,
 * terrain component IDs, candidate ownership or canonical world content.
 */
const fail=s=>{throw Error('C1-AA relief-first HOLD: '+s);};
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==='object'?
 Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v;
const eq=(a,b)=>JSON.stringify(norm(a))===JSON.stringify(norm(b));
const SOURCE={
 vectorBlob:'9cd6752e9dbca00796e5f7c013066bb0e5a96175',
 coastlineEdges:599,
 biomeSha256:'9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12',
 elevationSha256:'02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d',
 registeredCrop:{x:60,y:60,width:3976,height:2235},
 originalPng:{width:4096,height:2355},
 referenceGrid:{width:2048,height:1152},
 originalMainlandTerrainComponent:30
};
const ELEV={
 nativeSourceProvenance:'ORIGINAL_ELEVATION_PNG',
 rampCalibration:'UNVERIFIED_COLOR_RAMP',
 sourceRGBMeansMeters:false,relativeBrightnessMeansMeters:false,
 automaticSlopeOrAspectProven:false,
 automaticRidgeOrWatershedProven:false,
 classifiedRiversOrRavinesProven:false,
 outputAllowed:'ORIGINAL_COLOR_SAMPLES_AND_PAIRED_VISUAL_OVERLAYS',
 reliefBasedRegionSelectionAllowed:false
};
const MODEL={
 regionIsPoliticalTerritory:false,
 futureFinalizedLandPrimaryRegion:'EXACTLY_ONE',
 futureAdjacentCoverage:'SHARED_NONOVERLAPPING_BOUNDARY_WHERE_LAND_IS_FINALIZED',
 reserveIsNotAutomaticPermanentNoMansLand:true,
 authoringUnassignedLandAllowed:true,
 heldPhysicalComponentsNeverAutoclaimed:true,
 optionalEnvironmentalTransitionInfluence:'SECONDARY_NOT_ALTERNATIVE_PRIMARY_REGION',
 exactBackendEdgeOwnership:'DETERMINISTIC_RULE_REQUIRED_LATER',
 futureNarrativeAndSpawns:'DESIGN_HOOKS_ONLY_NOT_IN_SCOPE',
 namedBordersOrFencesImplied:false
};
const INTERFACES=[
 {id:'VEYRHOLM_KHARUUN_NORTHERN_INLAND',center:{x:292,y:190},
  baselineUnassignedMainlandGap:10,sourceView:[265,165,72,61],
  optionIds:['KEEP_C1P_UNCHANGED','NORTH_VEYRHOLM_SOUTH_TWO','NORTH_KHARUUN_NORTH_TWO'],
  sourceConcern:'NORTHERN_COAST_AND_INLAND_RELIEF_NEEDS_INDEPENDENT_INTERPRETATION'},
 {id:'KHARUUN_VERDANT_SOUTHERN_TRANSITION',center:{x:319,y:326},
  baselineUnassignedMainlandGap:15,sourceView:[291,298,82,71],
  optionIds:['KEEP_C1P_UNCHANGED','SOUTH_KHARUUN_SOUTH_THREE','SOUTH_VERDANT_NORTH_THREE'],
  sourceConcern:'WARM_TO_GREEN_BIOME_COLOR_IS_NOT_CERTIFIED_ELEVATION_BREAK'}
];
const RULES={
 compareOriginalElevationBeforeBiome:true,
 keepOriginalC1PAsRealCandidate:true,
 evaluateOnlySourceAndC1ZVerifiedGeometry:true,
 declineNumericElevationSlopeWatershedClaims:true,
 noAutomaticGapShrinkingPreference:true,
 doNotInferGeographicFeatureFromColorOnly:true,
 doNotInventTransitoryBandWidth:true,
 preserveOptionalFutureOverlappingInfluences:true,
 environmentalColorSecondaryToSupportedLandform:true,
 noAutomaticWinner:true,humanTopographicAdjudicationRequired:true
};
const BASE={
 originalMainlandCandidateCells:79419,
 provisionalAssigned:52449,deliberatelyUnassigned:26970,
 acceptedRegionCells:[5632,18624,19182,9011],
 kharuunOptionBSourceEdges:[35,58],
 heldNortheasternHeadlandSourceEdges:[75,115],
 component51Owner:null,largeNortheastIslandOwner:null,shattercapIslandClaims:0,
 southeasternVerdantPeninsulaPreserved:true,
 veyrholmDryInlandExclusionsPreserved:true,
 coast40Claim:null,serathylWindwardParent:'region.serathyl',
 sourceRasterEdits:0,sourceVectorEdits:0,
 originalTerrainComponentRelabels:0,acceptedC1PRegionRingEdits:0,
 newTerritorialCells:0,newSettlementOrGameplayContent:0,
 canonicalWritable:false
};
const pairIds=['NORTH_VEYRHOLM_SOUTH_TWO','NORTH_KHARUUN_NORTH_TWO',
 'SOUTH_KHARUUN_SOUTH_THREE','SOUTH_VERDANT_NORTH_THREE'];
const pts=(n)=>({x:n[0],y:n[1]});

export function validateC1AAReliefContract(s,c1p,z){
 if(s?.schemaVersion!==1||
   s.type!=='kaelvar-c1aa-relief-first-regional-seam-prework.v1'||
   s.status!=='PAIRED_SOURCE_REVIEW_ONLY_RELIEF_SCALE_UNCALIBRATED_NO_REGION_SELECTION'||
   s.parentC1ZHead!=='025d097eaf2947427447d3d62346046d8c4b1563'||
   !eq(s.originalSource,SOURCE)||!eq(s.elevationInterpretation,ELEV)||
   !eq(s.regionalModel,MODEL)||!eq(s.interfaces,INTERFACES)||
   !eq(s.reviewRules,RULES)||!eq(s.lockedBaseline,BASE))
   fail('original source, relief-uncalibrated status, coverage model or island/canon holds drifted');
 if(c1p?.status!=='C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD'||
  c1p.sourceVectorBlob!==SOURCE.vectorBlob||
  c1p.sourcePngFingerprintsVerified!==true||
  c1p.sourceOriginalContourUnmodified!==true||
  c1p.originalSourceEdgesConserved!==599||
  c1p.measurements?.candidateMainlandTerrainCells!==79419||
  c1p.measurements.previewAssignedMainlandTerrainCells!==52449||
  c1p.measurements.remainingUnassignedMainlandTerrainCells!==26970||
  !eq(c1p.measurements.perRegion.map(x=>x.terrainCandidateCells),
   BASE.acceptedRegionCells)||
  c1p.measurements.detachedPhysicalComponentsClaimed!==0||
  c1p.holds?.canonicalWritable!==false)
  fail('accepted C1-P source and candidate-terrain accounting changed');
 if(z?.status!=='C1Z_FOUR_SOURCE_INDEXED_REVERSIBLE_WAYPOINT_TRIALS_CANONICAL_HELD'||
   z.sourceWitness?.originalSourceVectorBlob!==SOURCE.vectorBlob||
   z.sourceWitness.sourceCoastlineEdges!==599||
   z.sourceWitness.originalBiomeSha256!==SOURCE.biomeSha256||
   z.sourceWitness.originalElevationSha256!==SOURCE.elevationSha256||
   z.baseline?.politicallyAssigned!==52449||
   z.baseline.unassigned!==26970||z.baseline.totalMainland!==79419||
   !eq(z.baseline.perRegion,BASE.acceptedRegionCells)||
   z.unchanged?.acceptedC1PRegionRingChanges!==0||
   z.unchanged.acceptedC1POwnerChanges!==0||
   z.unchanged.canonicalWritable!==false||
   !eq(z.unchanged.originalKharuunOptionBSourceEdges,[35,58])||
   z.unchanged.component51Owner!==null||
   z.unchanged.northeasternHeadlandOwner!==null||
   z.alternatives?.length!==4||
   !eq(z.alternatives.map(x=>x.id),pairIds)||
   z.alternatives.some(x=>!x.status.startsWith('VALID_REVERSIBLE_')||
      x.acceptedAsC1PRegion!==false||x.canonicalWritable!==false||
      x.proposedPermanentSourceOrRegionEdit!==false||
      x.originalLocalReturn?.length!==3||
      x.proposedLocalReturn?.length!==3))
  fail('C1-Z reversible options or original island/region holds changed');
 return true;
}
const pixel=(x,y)=>({
 x:SOURCE.registeredCrop.x+Math.min(SOURCE.registeredCrop.width-1,
  Math.floor((x+.5)*SOURCE.registeredCrop.width/SOURCE.referenceGrid.width)),
 y:SOURCE.registeredCrop.y+Math.min(SOURCE.registeredCrop.height-1,
  Math.floor((y+.5)*SOURCE.registeredCrop.height/SOURCE.referenceGrid.height))
});
function colorAt(png,x,y){
 if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||
   x>=SOURCE.referenceGrid.width||y>=SOURCE.referenceGrid.height)
  fail('sample outside original registered reference image');
 const q=pixel(x,y),off=4*(q.y*png.width+q.x);
 return {originalSourcePngPixel:q,
  rgb:[...png.rgba.slice(off,off+3)],alpha:png.rgba[off+3]};
}
function sample(biome,elevation,p){
 const x=p.x,y=p.y;
 return {reference:{x,y},
  biome:colorAt(biome,x,y),
  elevation:colorAt(elevation,x,y),
  isElevationInMeters:false,geographicLandformCertainty:'UNRESOLVED'};
}
export function buildC1AAReliefPrework({spec,c1p,z,biome,elevation}){
 validateC1AAReliefContract(spec,c1p,z);
 for(const [id,img] of [['biome',biome],['elevation',elevation]]){
  if(img?.width!==4096||img.height!==2355||
     img.rgba?.length!==4096*2355*4)
    fail('original '+id+' PNG pair absent or unregistered');
 }
 const groups=INTERFACES.map((inter,i)=>{
  const trialIds=inter.optionIds.slice(1),
   variants=trialIds.map(id=>z.alternatives.find(x=>x.id===id));
  if(variants.some(x=>!x||x.interfaceId!==inter.id||
    x.baselineUnassignedGapSamples!==inter.baselineUnassignedMainlandGap))
   fail('missing correct C1-Z source-indexed local alternatives for '+inter.id);
  const keep={
   id:'KEEP_C1P_UNCHANGED',
   status:'EXISTING_NONCANONICAL_C1P_REVIEW_GEOMETRY',
   baselineUnassignedGapSamples:inter.baselineUnassignedMainlandGap,
   residualUnassignedGapSamples:inter.baselineUnassignedMainlandGap,
   transitoryWidthClaim:null,sourceVerifiedGeographicFeature:null,
   originalSourceSample:sample(biome,elevation,inter.center),
   primaryRegionAssignmentChanged:false,
   topographicRanking:'INSUFFICIENT_CALIBRATED_RELIEF',
   independentOwnerSelection:false
  };
  const trials=variants.map(t=>({
   id:t.id,status:'C1Z_TOPOLOGICALLY_VALID_RELIEF_NOT_CERTIFIED',
   editedRegion:t.editedRegion,
   baselineUnassignedGapSamples:t.baselineUnassignedGapSamples,
   residualUnassignedGapSamples:t.trialUnassignedGapSamples,
   trialCandidateCellsGained:t.delta?.gained,
   originalLocalReturn:t.originalLocalReturn,
   trialLocalReturn:t.proposedLocalReturn,
   acceptedOriginalWaypoint:pts(t.originalWaypoint),
   temporaryWaypoint:pts(t.trialWaypoint),
   originalOriginalPairSample:sample(biome,elevation,pts(t.originalWaypoint)),
   trialOriginalPairSample:sample(biome,elevation,pts(t.trialWaypoint)),
   sourceVerifiedGeographicFeature:null,transitoryWidthClaim:null,
   topographicRanking:'INSUFFICIENT_CALIBRATED_RELIEF',
   independentOwnerSelection:false,canonicalWritable:false
  }));
  return {id:inter.id,sourceView:inter.sourceView,
   center:inter.center,sourceConcern:inter.sourceConcern,
   options:[keep,...trials],
   reliefJudgment:'HOLD_UNCALIBRATED_ELEVATION_RAMP',
   biomeBasedWinnerForbidden:true,
   recommendedCanonicalChange:null,
   acceptedC1PKept:true};
 });
 return {
  status:'C1AA_PAIRED_ORIGINAL_RELIEF_PREWORK_SOURCE_VERIFIED_SELECTION_HELD',
  source:{originalVectorBlob:SOURCE.vectorBlob,
   originalCoastlineEdges:599,
   originalBiomeSha256:SOURCE.biomeSha256,
   originalElevationSha256:SOURCE.elevationSha256,
   registrationCrop:SOURCE.registeredCrop,
   imageFormats:{
    biome:{bitDepth:biome.bitDepth,colorType:biome.colorType},
    elevation:{bitDepth:elevation.bitDepth,colorType:elevation.colorType}
   }},
  elevationInterpretation:ELEV,
  primaryRegionAndTransitionDesign:MODEL,
  comparedInterfaces:groups,
  conclusions:{
   noMeasuredElevationOrWatershedClaim:true,
   noBiomeColorOnlyWinner:true,
   noAutomaticGapClosing:true,
   noPhysicalTransitionBandWidthAssigned:true,
   ownerTopographicDecision:null,
   sourcePairOverlayRequired:true,
   existingC1PIsOneOfThreeOptionsPerInterface:true,
   noApprovedRegionalRegionGeometryChanges:true
  },
  baseline:{
   originalMainlandCandidates:79419,provisionalAssigned:52449,
   unassigned:26970,perRegion:BASE.acceptedRegionCells,
   originalSourcePixelEdits:0,sourceVectorEdits:0,
   originalTerrainLabelsChanged:0,acceptedRegionRingsChanged:0,
   detachedComponentClaims:0,canonicalWritable:false,
   northEastHeadlandAndComponent51StillHeld:true,
   shattercapAndLargeNortheastIslandStillHeld:true
  }
 };
}
