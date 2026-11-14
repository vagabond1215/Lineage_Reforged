/**
 * C1-X: targeted attached-tip hypothesis versus broad source-ink admission.
 * Run on SCRATCH label arrays only. Never change original classification,
 * original source assets, active region geometry, or physical ownership.
 */
import {c1oPointInRing} from './kaelvar-c1o-regional-boundaries.mjs';
import {traceCandidateCorridor} from './kaelvar-c1q-headland-continuity.mjs';

const fail=s=>{throw Error('C1-X noncanonical HOLD: '+s);};
const norm=x=>Array.isArray(x)?x.map(norm):x&&typeof x==='object'?
 Object.fromEntries(Object.keys(x).sort().map(k=>[k,norm(x[k])])):x;
const eq=(a,b)=>JSON.stringify(norm(a))===JSON.stringify(norm(b));
const parent='1fc668e30f8700b62a5ffa0c56558add2a97074f';
const hashes={
 vectorBlob:'9cd6752e9dbca00796e5f7c013066bb0e5a96175',
 originalEdgeCount:599,headlandEdgesInclusive:[75,115],
 biomeSha256:'9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12',
 elevationSha256:'02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d',
 registration:{crop:{x:60,y:60,width:3976,height:2235},
  reference:{width:2048,height:1152}}
};
const window={minX:300,minY:155,maxX:590,maxY:465};
const start={x:390,y:336},target={x:492,y:215};
const gap={x:469,y:213};
const scenarios=[
 {id:'STRICT_ORIGINAL',microBlack:false,teal:false,broadBlack:false},
 {id:'TARGETED_BLACK_GAP_ONLY',microBlack:true,teal:false,broadBlack:false},
 {id:'TEAL_ONLY',microBlack:false,teal:true,broadBlack:false},
 {id:'TEAL_PLUS_TARGETED_BLACK_GAP',microBlack:true,teal:true,broadBlack:false},
 {id:'BROAD_BLACK_AND_TEAL_WARNING',microBlack:false,teal:true,broadBlack:true}
];
const fixedBaseline={
 c1pMainlandCandidates:79419,c1pAssigned:52449,c1pUnassigned:26970,
 c1pRegionCells:[5632,18624,19182,9011],
 sourceHeadlandStrict1pxClearance:false,
 sourceHeadlandTealOnly1pxClearance:true,originalComponent51Pixels:21,
 originalComponent51InsideCoast:13,originalComponent51OutsideCoast:8,
 originalComponent51StrictlySeparate:true,
 c1uValidReviewCapIds:['INSET_RETURN_CANDIDATE','COMPACT_RETURN_CANDIDATE'],
 c1uCapContainsOriginalComponent51Cells:13,
 broadBlackAndTealPotentialComponentContactSamples:22,
 broadBlackAndTealPotentialComponentLabels:[51,78,113]
};
const holds={
 noOwnerDecision:true,noAutomaticOriginalPhysicalComponentMerge:true,
 originalSourcePngsUnmodified:true,originalSourceCoastUnmodified:true,
 originalTerrainLabelsUnmodified:true,existingC1PRegionRingsUnchanged:true,
 kharuunOptionBSourceEdges:[35,58],
 southeasternVerdantPeninsulaIncluded:true,
 veyrholmInteriorExclusionAnchorsPreserved:true,
 headlandPoliticalOwner:null,component51PoliticalOwner:null,
 detachedOriginalComponentClaims:0,largeNortheastIslandUnassigned:true,
 shattercapDetachedIslandsUnassigned:true,
 coast40Claim:null,serathylWindwardParent:'region.serathyl',
 newPortsWellsRiversRoutesSaltBasins:0,
 canonicalWritable:false,newLegacyHexDependencies:0
};
const metric=r=>({clearancePx:r.clearancePx,found:r.found,
 pixelSteps:r.pixelSteps,pathSha256:r.pathSha256});

export function validateC1XContract(s,w,ink,pinch,u,p){
 if(s?.schemaVersion!==1||
   s.type!=='kaelvar-c1x-targeted-attached-tip-hypothesis-feasibility.v1'||
   s.status!=='REVIEW_ONLY_TARGETED_INK_EXCEPTION_VS_BROAD_RECLASSIFICATION_NO_OWNER_DECISION'||
   s.parentC1WHead!==parent||!eq(s.source,hashes)||
   !eq(s.investigation,{
    provisionalPhysicalHypothesis:'COAST_ATTACHED_PROMONTORY',
    interpretationNotOwnerApproved:true,
    targetBlackGap:{reference:[469,213],originalPngPixel:[971,474],
     expectedRgb:[0,0,0],originalTerrainLabel:0,originalOwnerCode:0,
     adjacentOriginalLabels:{north:51,south:30}},
    exactTealEligibleSamplesInBoundedSourceWindow:173,
    territorialRouteWindow:window,
    territorialRouteSeed:start,territorialRouteTarget:target,
    fourNeighborOnly:true,territorialClearanceChecks:[1,2],
    allowedExistingOwnerCodes:[0,3],forbiddenExistingOwnerCodes:[1,2,4],
    scenarios
   })||!eq(s.pinnedBaseline,fixedBaseline)||!eq(s.holds,holds))
   fail('source, hypothetical local pixel, owner holds or baseline changed');
 if(w?.status!=='C1W_ORIGINAL_PAIRED_SOURCE_OWNER_CHOICE_REQUIRED_NO_GEOGRAPHIC_PUBLICATION'||
  w.decision?.ownerApproved!==false||w.decision.selected!==null||
  !eq(w.exactBridgeOriginalPixelPairs?.map(x=>x.originalTerrainLabel),[51,0,30])||
  !eq(w.exactBridgeOriginalPixelPairs?.map(x=>x.reference),
   [{x:469,y:212},{x:469,y:213},{x:469,y:214}])||
  !eq(w.exactBridgeOriginalPixelPairs?.[1]?.originalPixel,gapToOriginal())||
  w.exactBridgeOriginalPixelPairs[1].isExactUnresolvedSharedBlack!==true||
  w.component51OriginalCellInventory?.total!==21||
  w.component51OriginalCellInventory.insideMainlandVector!==13||
  w.component51OriginalCellInventory.outsideMainlandVector!==8||
  ink?.status!=='C1S_UNCERTAIN_SHARED_SOURCE_INK_SENSITIVITY_ONLY_CANONICAL_HELD'||
  !eq(ink.classification?.eligibleUncertainReferenceSamples,
   {black:2289,teal:173,other:351})||
  !eq(ink.scenarios?.map(r=>r.clearance.map(x=>x.found)),[
   [true,false,false],[true,false,false],[true,true,false],
   [true,true,true],[true,true,true]])||
  pinch?.status!=='C1T_SOURCE_MICROMORPHOLOGY_AND_DETACHED_RISK_ONLY_NO_REGION_CHANGE'||
  !eq(pinch.detachedContactAudit?.scenarios?.map(x=>x.potentialPhysicalContactSamples),
   [0,0,22,22])||
  !eq(pinch.detachedContactAudit?.scenarios?.[2]?.potentialPhysicalComponentLabels,
   [51,78,113])||
  u?.status!=='C1U_SOURCE_ARC_REVIEW_ENCLOSURES_PASSED_NO_TERRITORIAL_APPROVAL'||
  !eq(u.reviewEnclosures?.slice(1).map(x=>x.id),
   fixedBaseline.c1uValidReviewCapIds)||
  u.reviewEnclosures.slice(1).some(x=>
    x.sample?.otherOriginalPhysicalComponentsById?.['51']!==13||
    x.sample?.originalProvisionalRegionPixelCount!==0||
    x.canonicalWritable!==false)||
  p?.status!=='C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD'||
  p.originalSourceEdgesConserved!==599||
  p.sourceOriginalContourUnmodified!==true||
  p.sourcePngFingerprintsVerified!==true||
  p.measurements?.candidateMainlandTerrainCells!==79419||
  p.measurements.previewAssignedMainlandTerrainCells!==52449||
  p.measurements.remainingUnassignedMainlandTerrainCells!==26970||
  !eq(p.measurements.perRegion.map(x=>x.terrainCandidateCells),
   [5632,18624,19182,9011])||
  p.measurements.detachedPhysicalComponentsClaimed!==0||
  p.holds?.canonicalWritable!==false)
  fail('C1-S/T/U/W source witness or original region accounting drift');
 return true;
}
const gapToOriginal=()=>({x:971,y:474});
const at=(x,y)=>y*2048+x;
const originalPixel=(x,y)=>({
 x:60+Math.min(3975,Math.floor((x+.5)*3976/2048)),
 y:60+Math.min(2234,Math.floor((y+.5)*2235/1152))
});
const exactRGB=(a,b,idx,r,g,bl)=>a[idx]===r&&a[idx+1]===g&&
 a[idx+2]===bl&&b[idx]===r&&b[idx+1]===g&&b[idx+2]===bl&&
 a[idx+3]>0&&a[idx+3]===b[idx+3];
export function buildC1XPairedGates({spec,w,ink,pinch,u,p,
 labels,ownership,revised,biome,elevation}){
 validateC1XContract(spec,w,ink,pinch,u,p);
 if(labels?.length!==2048*1152||ownership?.length!==labels.length||
  revised?.originalContour?.length!==599||
  biome?.width!==4096||biome.height!==2355||
  elevation?.width!==4096||elevation.height!==2355||
  biome.rgba?.length!==4096*2355*4||
  elevation.rgba?.length!==4096*2355*4)
  fail('original source image pair and terrain label arrays required');
 const contour=revised.originalContour,i=at(gap.x,gap.y);
 if(labels[i]!==0||ownership[i]!==0||
  labels[at(469,212)]!==51||labels[at(469,214)]!==30||
  !c1oPointInRing({x:469.5,y:213.5},contour))
  fail('black gap fails strict original pixel, component, or vector containment');
 const orig=originalPixel(gap.x,gap.y);
 if(!eq(orig,gapToOriginal()))fail('black gap registered PNG source pixel changed');
 const gi=(orig.y*4096+orig.x)*4;
 if(!exactRGB(biome.rgba,elevation.rgba,gi,0,0,0))
  fail('single hypothetical black bridge no longer original shared black');
 // Only this one label-0 cell can change in a micro-black scenario.
 // All 21 actual component-51 candidate labels remain separate/unchanged.
 const microBlackLabels=new Uint16Array(labels);
 microBlackLabels[i]=30;
 // Independently reconstruct all exact teal candidates in the C1-S
 // window. No broad black admission is used by the new local hypothesis.
 const tealOnly=new Uint16Array(labels);
 const tealIndices=[],tealPoints=[];
 for(let y=window.minY;y<=window.maxY;y++)
  for(let x=window.minX;x<=window.maxX;x++){
   const ai=at(x,y);
   if(labels[ai]!==0||ownership[ai]!==0)continue;
   const img=originalPixel(x,y),pi=(img.y*4096+img.x)*4;
   if(!exactRGB(biome.rgba,elevation.rgba,pi,4,159,169))continue;
   if(!c1oPointInRing({x:x+.5,y:y+.5},contour))continue;
   tealOnly[ai]=30;tealIndices.push(ai);tealPoints.push({x,y});
  }
 if(tealIndices.length!==173||tealIndices.includes(i))
  fail('teal source-classification inventory changed or includes black gap');
 const targetedCombined=new Uint16Array(tealOnly);
 targetedCombined[i]=30;
 if(targetedCombined[at(469,212)]!==51||labels[at(469,212)]!==51)
  fail('physical component 51 was promoted instead of held');
 const traverse=data=>[1,2].map(clearance=>traceCandidateCorridor({
  labels:data,owner:ownership,sourceContour:contour,
  width:2048,height:1152,start,target,window,clearance
 }));
 const base=ink.scenarios[0].clearance.slice(1);
 const broad=ink.scenarios[3].clearance.slice(1);
 const tealResult=traverse(tealOnly);
 const gapResult=traverse(microBlackLabels);
 const together=traverse(targetedCombined);
 if(!eq(tealResult.map(x=>x.found),[true,false])||
  !eq(tealResult.map(x=>x.pathSha256),
   ink.scenarios[2].clearance.slice(1).map(x=>x.pathSha256))||
  !eq(gapResult.map(x=>x.found),[false,false]))
  fail('C1-S teal/black isolated headland sensitivity did not reproduce');
 const results=[
  {id:'STRICT_ORIGINAL',hypotheticalZeroLabelSamples:0,
   blackComponent51MayReachMainland:false,headland:base.map(metric),
   otherOriginalComponentContactRisk:0},
  {id:'TARGETED_BLACK_GAP_ONLY',hypotheticalZeroLabelSamples:1,
   blackComponent51MayReachMainland:true,headland:gapResult.map(metric),
   otherOriginalComponentContactRisk:0},
  {id:'TEAL_ONLY',hypotheticalZeroLabelSamples:173,
   blackComponent51MayReachMainland:false,headland:tealResult.map(metric),
   otherOriginalComponentContactRisk:0},
  {id:'TEAL_PLUS_TARGETED_BLACK_GAP',hypotheticalZeroLabelSamples:174,
   blackComponent51MayReachMainland:true,headland:together.map(metric),
   otherOriginalComponentContactRisk:0},
  {id:'BROAD_BLACK_AND_TEAL_WARNING',hypotheticalZeroLabelSamples:2462,
   blackComponent51MayReachMainland:true,headland:broad.map(metric),
   otherOriginalComponentContactRisk:22}
 ];
 if(!eq(results.map(x=>x.headland.map(c=>c.found)),[
  [false,false],[false,false],[true,false],
  [true,false],[true,true]]))
  fail('targeted black+teal matrix did not match source-attached hypothesis');
 if(results[3].headland[0].pixelSteps!==223)
  fail('targeted black+teal source route length changed');
 return {
  status:'C1X_PAIRED_INK_GATES_DIAGNOSTIC_PASSED_NO_PHYSICAL_OR_POLITICAL_APPROVAL',
  sourceWitness:{originalSourceBlob:hashes.vectorBlob,
   coastlineEdges:599,headlandOriginalCoastEdges:[75,115],
   originalBiomeSha256:hashes.biomeSha256,
   originalElevationSha256:hashes.elevationSha256},
  blackPixel:{reference:gap,originalPngPixel:orig,
   identicalRgb:[0,0,0],originalPhysicalLabel:0,
   cardinalNorthPhysicalLabel:51,cardinalSouthPhysicalLabel:30,
   originalImageChanged:false,uniqueHypotheticalGapSamples:1,
   component51StillLabeledAsSeparate:true,
   physicalAttachmentCertified:false},
  tealClass:{eligibleBoundedReferencePixels:tealPoints.length,
   sampleExamples:tealPoints.slice(0,12),
   hypotheticalWaterLandClassificationCertified:false},
  scenarios:results,
  selectedVisualizationPaths:{
   targetedTealOneClearance:together[0].path,
   tealOnlyOneClearance:tealResult[0].path,
   originalStrictZeroClearance:ink.paths.ORIGINAL_SOURCE_PAIR_ONLY[0]
  },
  previousUncalibratedGeometry:{
   caps:u.reviewEnclosures.slice(1).map(x=>({
    id:x.id,validReviewOnly:x.ringValidity.valid,
    originalComponent51CellsInside:x.sample.otherOriginalPhysicalComponentsById['51'],
    newPoliticalTerritoryCells:0})),
   broadBlackRiskOriginalComponents:[51,78,113],
   broadBlackRiskReachableContactSamples:22
  },
  fixedC1P:{mainlandOriginalCandidateCells:79419,
   politicallyAssigned:52449,politicallyUnassigned:26970,
   originalRegionCells:[5632,18624,19182,9011],
   promotedOriginalPhysicalComponentCells:0,
   originalPixelOrVectorEdits:0,
   existingRingEdits:0,newTerritorialCells:0,
   detachedPhysicalComponentClaims:0,
   canonicalWritable:false},
  decision:{provisionalPhysicalDesignPreference:'COAST_ATTACHED_PROMONTORY',
   ownerSelection:null,physicalContinuityCertified:false,
   VerdantPoliticalConnectionCertified:false,
   headlandPoliticalOwner:null,component51PoliticalOwner:null,
   allIslandsHeld:true,
   nextGate:'An owner source-convention decision and independently valid width-safe region geometry are required before any political expansion.'}
 };
}
