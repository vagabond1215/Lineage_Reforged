/**
 * C1-S: read-only original source-pair shared-ink sensitivity.
 * Hypothetically permits individual previously excluded, RGB-identical
 * pixels ONLY inside the source vector review contour. Never mutates the
 * source PNGs, accepted terrain labels, region ownership or world content.
 */
import {c1oPointInRing} from './kaelvar-c1o-regional-boundaries.mjs';
import {traceCandidateCorridor} from './kaelvar-c1q-headland-continuity.mjs';
import {isSharedNonblueUnresolved} from './kaelvar-c1i-source-ink-separation.mjs';

const fail=s=>{throw Error('C1-S noncanonical HOLD: '+s);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const blob='9cd6752e9dbca00796e5f7c013066bb0e5a96175';
const biomeSha='9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12';
const elevationSha='02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d';
const dims={width:2048,height:1152},crop={x:60,y:60,width:3976,height:2235};
const win={minX:300,minY:155,maxX:590,maxY:465};
const from={x:390,y:336},to={x:492,y:215};
const originalCells=[5632,18624,19182,9011];
const scenarioOptions=[
 {id:'ORIGINAL_SOURCE_PAIR_ONLY',allow:[]},
 {id:'HYPOTHETICAL_BLACK_ONLY',allow:['black']},
 {id:'HYPOTHETICAL_TEAL_ONLY',allow:['teal']},
 {id:'HYPOTHETICAL_BLACK_AND_TEAL',allow:['black','teal']},
 {id:'HYPOTHETICAL_ALL_SHARED_NONBLUE',allow:['black','teal','other']},
];
const conditions=['ORIGINAL_SOURCE_VECTOR_CONTAINS_SAMPLE','IDENTICAL_BIOME_ELEVATION_RGB',
 'NOT_SOURCE_BLUE_THRESHOLD','VALID_MATCHED_ALPHA','ORIGINAL_TERRAIN_LABEL_ZERO',
 'NOT_AN_ASSIGNED_REGION'];
const classifiers={black:'RGB_EXACT_0_0_0',teal:'RGB_EXACT_4_159_169',
 other:'OTHER_IDENTICAL_NONBLUE_RGB'};
const zero={found:true,pixelSteps:223,pathSha256:
 '0147077f649823002cb7ef7a0d40d6617c0fc699ee3b34337fcfb8ff82b1b01a'};

export function validateC1SSpec(s,r,p,q,c1pReport,c1rReport){
 if(s?.schemaVersion!==1||
   s.type!=='kaelvar-c1s-original-source-shared-ink-sensitivity.v1'||
   s.status!=='REVIEW_ONLY_HYPOTHETICAL_SHARED_NONBLUE_PIXEL_SENSITIVITY_OWNERSHIP_HELD'||
   s.pinnedC1RHead!=='6a11498fd0b6cbc662fc364e3e6ee99788f77747'||
   s.c1rSpecPath!=='docs/design/kaelvar-c1r-headland-source-bottleneck-probe-2026-11-14.json'||
   !eq(s.source,{originalCoastlineBlob:blob,sourceEdgeCount:599,
    biomeSha256:biomeSha,elevationSha256:elevationSha,crop,reference:dims})||
   !eq(s.originalC1P,{componentId:30,mainlandCandidateCells:79419,
     assigned:52449,unassigned:26970,perRegion:originalCells,
     originalKharuunEdgesInclusive:[35,58],headlandEdgesInclusive:[75,115]}))
   fail('source, accepted C1-P baseline or exact C1-R parent drift');
 const t=s.sampling;
 if(!eq(t?.windowInclusive,win)||!eq(t.fromVerdant,from)||
   !eq(t.toHeadland,to)||t.connectivity!==4||
   !eq(t.clearancePx,[0,1,2])||
   !eq(t.allowedExistingOwnerCodes,[0,3])||
   !eq(t.forbiddenExistingOwnerCodes,[1,2,4])||
   !eq(t.uncertainEligibleConditions,conditions)||
   !eq(t.colorClassifiers,classifiers)||
   !eq(s.scenarios,scenarioOptions))
   fail('sensitivity bounds, classifications or scenarios changed');
 const h=s.immutableHolds;
 if(!eq(h,{
  canonicalWritable:false,noOriginalSourcePixelReclassification:true,
  noOriginalTerrainLabelChanges:true,noOriginalCoastlineEdits:true,
  noRegionPolygonChanges:true,noNewPoliticalTerritory:true,
  northeastHeadlandUnassigned:true,largeNortheastIslandUnassigned:true,
  shattercapAllDetachedIslandsUnassigned:true,detachedComponentClaims:0,
  coast40Claim:null,serathylWindwardParent:'region.serathyl',
  portsWellsRiversWaterRoutesSaltBasinsPlaced:0,
  noNewLegacyHexDependencies:true}))
  fail('immutable political, island or publication holds changed');
 if(r?.pinnedParentHead!=='cc1a206b148d3d10c783aa9917575031bc360906'||
   r?.sourceVectorBlob!==blob||
   p?.holds?.canonicalWritable!==false||
   !eq(p?.ownerReviewDirection?.kharuunSourceEdgeIndicesInclusive,[35,58])||
   q?.c1oSourceVectorBlob!==blob||
   c1pReport?.status!=='C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD'||
   c1pReport.originalSourceEdgesConserved!==599||
   c1pReport.sourcePngFingerprintsVerified!==true||
   c1pReport.measurements?.candidateMainlandTerrainCells!==79419||
   c1pReport.measurements.previewAssignedMainlandTerrainCells!==52449||
   c1pReport.measurements.remainingUnassignedMainlandTerrainCells!==26970||
   !eq(c1pReport.measurements.perRegion.map(x=>x.terrainCandidateCells),originalCells)||
   c1pReport.measurements.detachedPhysicalComponentsClaimed!==0||
   c1rReport?.status!=='C1R_HELD_ORIGINAL_PAIR_SOURCE_CORRIDOR_DIAGNOSTICS_ONLY'||
   !eq(c1rReport.widenedConnectivity.map(x=>x.found),[true,false,false])||
   !eq(c1rReport.widenedConnectivity[0].pathSha256,zero.pathSha256)||
   c1rReport.narrowRouteDiagnostics?.adjacentRejectedPixelReasons?.SOURCE_PAIR_RGB_EQUALITY!==96||
   c1rReport.immutableAllocation?.newlyAllocatedCells!==0)
   fail('C1-R source-ink or native C1-P acceptance drift');
 return true;
}
const colorClass=(r,g,b)=>r===0&&g===0&&b===0?'black':
 r===4&&g===159&&b===169?'teal':'other';
const plus=(dict,k)=>{dict[k]=(dict[k]||0)+1;};
const countClasses=()=>({black:0,teal:0,other:0});
function inspect(biome,elevation,x,y){
 const sx=crop.x+Math.min(crop.width-1,Math.floor((x+.5)*crop.width/dims.width));
 const sy=crop.y+Math.min(crop.height-1,Math.floor((y+.5)*crop.height/dims.height));
 const idx=(sy*biome.width+sx)*4,a=biome.rgba,b=elevation.rgba;
 const r=a[idx],g=a[idx+1],blue=a[idx+2],alpha=a[idx+3];
 const exactShared=isSharedNonblueUnresolved(r,g,blue,alpha,
  b[idx],b[idx+1],b[idx+2],b[idx+3]);
 return {sharedNonblue:exactShared,
  category:exactShared?colorClass(r,g,blue):null,
  rgb:[r,g,blue],sourcePixel:{x:sx,y:sy}};
}
const compact=x=>({clearancePx:x.clearancePx,found:x.found,
 pixelSteps:x.pixelSteps,pathSha256:x.pathSha256,
 startPermitted:x.startIsPermitted,targetPermitted:x.targetIsPermitted});

export function buildC1SSensitivity({spec,c1rSpec,p,q,c1pReport,c1rReport,
 originalLabels,ownership,revised,biome,elevation}){
 validateC1SSpec(spec,c1rSpec,p,q,c1pReport,c1rReport);
 if(biome?.width!==4096||biome.height!==2355||
   elevation?.width!==4096||elevation.height!==2355||
   biome.rgba?.length!==4096*2355*4||
   elevation.rgba?.length!==4096*2355*4||
   originalLabels?.length!==2048*1152||
   ownership?.length!==originalLabels.length||
   revised?.originalContour?.length!==599)
   fail('registered original PNG, source vector or base masks missing');
 const w=win.maxX-win.minX+1,h=win.maxY-win.minY+1;
 const classes=new Uint8Array(w*h),eligible=countClasses();
 const codes={black:1,teal:2,other:3},inv=['none','black','teal','other'];
 const refToLocal=(x,y)=>(y-win.minY)*w+x-win.minX;
 let uncertainInVector=0;
 let nonMainlandNeighborTouchCount=0;
 const nearOtherComponents=new Set();
 const localClassOf=(x,y)=>classes[refToLocal(x,y)];
 for(let y=win.minY;y<=win.maxY;y++)for(let x=win.minX;x<=win.maxX;x++){
  const idx=y*dims.width+x;
  if(ownership[idx]!==0||originalLabels[idx]!==0)continue;
  const cls=inspect(biome,elevation,x,y);
  if(!cls.sharedNonblue)continue;
  if(!c1oPointInRing({x:x+.5,y:y+.5},revised.originalContour))continue;
  const c=codes[cls.category];
  classes[refToLocal(x,y)]=c;eligible[cls.category]++;uncertainInVector++;
  const touched=new Set();
  for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){
   const nx=x+dx,ny=y+dy;
   if(nx<0||ny<0||nx>=dims.width||ny>=dims.height)continue;
   const sourceLabel=originalLabels[ny*dims.width+nx];
   if(sourceLabel!==0&&sourceLabel!==30)touched.add(sourceLabel);
  }
  if(touched.size){
   nonMainlandNeighborTouchCount++;
   for(const label of touched)nearOtherComponents.add(label);
  }
 }
 const outcomes=[],paths={},classMasks={};
 for(const option of scenarioOptions){
  const allowedCodes=new Set(option.allow.map(x=>codes[x]));
  const synthetic=new Uint16Array(originalLabels);
  const counts=countClasses();
  let count=0;
  const changedIndices=[];
  for(let y=win.minY;y<=win.maxY;y++)for(let x=win.minX;x<=win.maxX;x++){
   const c=localClassOf(x,y);
   if(!allowedCodes.has(c))continue;
   const idx=y*dims.width+x;
   if(originalLabels[idx]!==0||ownership[idx]!==0)
    fail('sensitivity tried to promote actual assigned/detached terrain');
   synthetic[idx]=30;count++;counts[inv[c]]++;changedIndices.push(idx);
  }
  const clearance=[0,1,2].map(level=>
   traceCandidateCorridor({labels:synthetic,owner:ownership,
    sourceContour:revised.originalContour,
    width:dims.width,height:dims.height,
    start:from,target:to,window:win,clearance:level}));
  const first=clearance[0];
  const extendedUse=level=>{
   const seen=countClasses();
   for(const pt of level.path){
    const c=localClassOf(pt.x,pt.y);
    if(c&&allowedCodes.has(c))seen[inv[c]]++;
   }
   return seen;
  };
  outcomes.push({id:option.id,allowedUnknownClasses:option.allow,
   originalMainlandLabelsChanged:0,actualTerritorialPixelsAssigned:0,
   hypotheticalCandidateSamples:count,hypotheticalByClass:counts,
   clearance:clearance.map(compact),
   pathHypotheticalUnknownUsage:clearance.map(extendedUse),
   noSourceOrPoliticalPublication:true});
  paths[option.id]=clearance.map(x=>x.path);
  classMasks[option.id]=changedIndices;
 }
 const baseline=outcomes[0];
 if(!eq(baseline.clearance.map(x=>x.found),[true,false,false])||
  !eq(baseline.clearance[0].pixelSteps,223)||
  baseline.clearance[0].pathSha256!==zero.pathSha256||
  countClasses().black!==0)
  fail('baseline source path no longer reproduces accepted C1-Q');
 return {
  status:'C1S_UNCERTAIN_SHARED_SOURCE_INK_SENSITIVITY_ONLY_CANONICAL_HELD',
  inputWitness:{sourceVectorBlob:blob,biomeSha256:biomeSha,
   elevationSha256:elevationSha,sourceContourVertices:599,
   protectedHeadlandSourceEdges:[75,115],baselineTerrainComponent:30},
  classification:{sourcePairRule:'IDENTICAL_NONBLUE_RGB_UNCALIBRATED_C1I',
   categories:{black:'0,0,0',teal:'4,159,169',
    other:'all other identical nonblue RGB'},
   eligibility:{
    registeredWindow:win,strictSourceContourContains:true,
    originalLabelMustBeZero:true,ownerMustBeUnassigned:true,
    originalSharedNonblue:true},
   eligibleUncertainReferenceSamples:eligible,
   eligibleTotal:uncertainInVector,
   candidatePixelsAdjacentToOtherOriginalPhysicalComponents:nonMainlandNeighborTouchCount,
   neighboringOriginalNonMainlandComponentLabels:[...nearOtherComponents].sort((a,b)=>a-b)},
  scenarios:outcomes,paths,
  immutableC1P:{mainlandTerrainCandidateCells:79419,
   assigned:52449,unassigned:26970,perRegion:originalCells,
   changedSourcePixels:0,changedOriginalTerrainLabels:0,
   newlyAssignedRegions:0,detachedComponentsClaimed:0,
   canonicalWritable:false},
  limits:{hypotheticalMasksAreNotCertifiedLandSea:true,
   hypotheticalPathIsNotPoliticalBorderOrRoad:true,
   sourceVectorAndOriginalPNGImmutable:true,
   originalComponent30InventoryNotRecomputedOrReplaced:true,
   environmentalCalibrationAndValidPolygonStillRequired:true},
 };
}
