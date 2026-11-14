/**
 * C1-R: native original-pair source pixel diagnostics on the held C1-Q
 * headland connection. Nothing in this module assigns geography.
 */
import {c1oPointInRing} from './kaelvar-c1o-regional-boundaries.mjs';
import {traceCandidateCorridor} from './kaelvar-c1q-headland-continuity.mjs';

const fail=s=>{throw Error('C1-R native HOLD: '+s);};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fixedWin={minX:375,maxX:540,minY:190,maxY:350};
const widerWin={minX:300,maxX:590,minY:155,maxY:465};
const start={x:390,y:336},target={x:492,y:215};
const srcCrop={x:60,y:60,width:3976,height:2235};
const limits={width:2048,height:1152};
const sourceBlob='9cd6752e9dbca00796e5f7c013066bb0e5a96175';
const biomeHash='9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12';
const elevationHash='02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d';
const pathSha='0147077f649823002cb7ef7a0d40d6617c0fc699ee3b34337fcfb8ff82b1b01a';
const inWindow=(q,b)=>q.x>=b.minX&&q.x<=b.maxX&&q.y>=b.minY&&q.y<=b.maxY;

export function validateC1RReviewSpec(s,q,p,baseline){
 if(s?.schemaVersion!==1||
  s.type!=='kaelvar-c1r-source-candidate-headland-bottleneck-probe.v1'||
  s.status!=='REVIEW_ONLY_WIDER_CORRIDOR_AND_SOURCE_PIXEL_CLASSIFICATION_CANONICAL_HELD'||
  s.pinnedParentHead!=='cc1a206b148d3d10c783aa9917575031bc360906'||
  s.c1qSourcePath!=='docs/design/kaelvar-c1q-northeast-headland-options-2026-11-14.json'||
  s.sourceVectorBlob!==sourceBlob||s.originalBiomeSha256!==biomeHash||
  s.originalElevationSha256!==elevationHash||
  !same(s.sampleDimensions,limits)||!same(s.sourceCrop,srcCrop)||
  !same(s.baselineWindowInclusive,fixedWin)||
  !same(s.widenedWindowInclusive,widerWin)||
  !same(s.sourceStart,start)||!same(s.sourceTarget,target)||
  s.sourceComponentId!==30||!same(s.permittedOwners,[0,3])||
  !same(s.disallowedOwners,[1,2,4])||
  !same(s.clearances,[0,1,2])||s.connectivity!==4)
  fail('source, exact probe windows or 4-neighbor corridor contract changed');
 const o=s.outputs,h=s.immutableHolds;
 if(Object.keys(o||{}).length!==5 ||
  Object.values(o).some(x=>x!==true)||
  h?.previousC1PAssigned!==52449||h.previousC1PUnassigned!==26970||
  h.sourceMainlandTerrainCandidates!==79419||
  !same(h.kharuunOriginalSourceEdgesInclusive,[35,58])||
  !same(h.northeastHeadlandOriginalSourceEdgesInclusive,[75,115])||
  h.verdantSoutheasternPeninsulaIncluded!==true||
  h.originalCoastlineUnmodified!==true||
  h.northeastHeadlandSovereigntyApproved!==false||
  h.shattercapIslandClaims!==0||h.largeNortheasternIslandClaims!==0||
  h.detachedComponentClaims!==0||h.coast40Claim!==null||
  h.foreignWindwardParent!=='region.serathyl'||
  h.newPortsWellsRiversRoutesSaltBasins!==0||
  h.newLegacyHexDependencies!==0||h.canonicalWritable!==false)
  fail('provisional, island or publication hold changed');
 if(q?.c1oSourceVectorBlob!==sourceBlob||
  !same(q.headlandSource?.startVertex,75)||
  !same(q.headlandSource?.endVertex,116)||
  p?.holds?.canonicalWritable!==false||
  !same(p.ownerReviewDirection?.kharuunSourceEdgeIndicesInclusive,[35,58])||
  baseline?.status!=='C1Q_NORTHEAST_HEADLAND_OPTIONS_REVIEW_ONLY_NO_POLITICAL_ALLOCATION'||
  baseline?.candidateCorridors?.length!==3||
  !same(baseline.candidateCorridors.map(x=>x.found),[true,false,false])||
  baseline.candidateCorridors[0].pixelSteps!==223||
  baseline.candidateCorridors[0].pathSha256!==pathSha||
  baseline.c1pTerrainConservation?.assigned!==52449||
  baseline.c1pTerrainConservation.unassigned!==26970||
  baseline.c1pTerrainConservation.additionalTerritorialCellsAssigned!==0)
  fail('accepted C1-Q source connectivity or C1-P ownership drifted');
 return true;
}
function pairedPixel(biome,elevation,x,y){
 const sx=srcCrop.x+Math.min(srcCrop.width-1,
  Math.floor((x+.5)*srcCrop.width/limits.width));
 const sy=srcCrop.y+Math.min(srcCrop.height-1,
  Math.floor((y+.5)*srcCrop.height/limits.height));
 const i=(sy*biome.width+sx)*4;
 const a=biome.rgba,b=elevation.rgba;
 const rgb=[a[i],a[i+1],a[i+2]],e=[b[i],b[i+1],b[i+2]];
 return {sourcePx:{x:sx,y:sy},biomeRGB:rgb,elevationRGB:e,
  blueRule:rgb[2]>150&&rgb[2]-rgb[1]>25&&rgb[2]-rgb[0]>80,
  equalRgb:rgb[0]===e[0]&&rgb[1]===e[1]&&rgb[2]===e[2],
  alphaInvalid:!(a[i+3]>0&&a[i+3]===b[i+3])};
}
/** Explain *sample* rejection, never certify water or land. */
function whyBlocked(q,{labels,owner,contour,window,biome,elevation}){
 if(!inWindow(q,window))return {reason:'WINDOW_BOUNDARY',coordinate:q};
 const i=q.y*limits.width+q.x;
 const pair=pairedPixel(biome,elevation,q.x,q.y);
 const sourceContourInside=c1oPointInRing({x:q.x+.5,y:q.y+.5},contour);
 const cls=labels[i];
 const cur=owner[i];
 let reason='ALLOWED';
 if(cur!==0&&cur!==3)reason='OTHER_PROVISIONAL_REGION';
 else if(!sourceContourInside)reason='OUTSIDE_SOURCE_CONTOUR';
 else if(cls!==30){
  if(pair.blueRule)reason='BLUE_RGB_THRESHOLD';
  else if(pair.equalRgb)reason='SOURCE_PAIR_RGB_EQUALITY';
  else if(pair.alphaInvalid)reason='SOURCE_PAIR_ALPHA_INVALID';
  else if(cls>0)reason='OTHER_TERRAIN_COMPONENT';
  else reason='NOT_REGISTERED_COMPONENT_30';
 }
 return {reason,coordinate:q,component:cls,currentOwnerCode:cur,
  sourceContourInside,...pair};
}
function accumulate(records){
 const counts={};
 for(const x of records)counts[x.reason]=(counts[x.reason]||0)+1;
 return Object.fromEntries(Object.entries(counts).sort((a,b)=>b[1]-a[1]));
}
/** Group consecutive zero-clearance path steps that fail 1-pixel clearance. */
function chokeRuns(records,path){
 const blocks=[],present=records.map(x=>x.length>0);
 for(let i=0;i<present.length;){
  if(!present[i]){i++;continue;}
  const first=i;let neighbors=[];
  while(i<present.length&&present[i]){neighbors.push(...records[i]);i++;}
  const last=i-1;
  const mid=first+Math.floor((last-first)/2);
  blocks.push({fromStep:first,toStep:last,spanSamples:last-first+1,
   from:path[first],midpoint:path[mid],to:path[last],
   blockedNeighborReasons:accumulate(neighbors),
   exampleRejectedSamples:neighbors.slice(0,3)});
 }
 return blocks.sort((a,b)=>b.spanSamples-a.spanSamples||a.fromStep-b.fromStep);
}

export function buildC1RHeadlandDiagnostic({spec,q,p,baseline,
 revised,labels,ownership,biome,elevation}){
 validateC1RReviewSpec(spec,q,p,baseline);
 if(!biome?.rgba||!elevation?.rgba||
  biome.width!==4096||biome.height!==2355||
  elevation.width!==4096||elevation.height!==2355||
  !same(revised?.originalContour?.length,599)||
  labels?.length!==limits.width*limits.height||
  ownership?.length!==labels.length)
  fail('original raster, contour or native terrain mask is missing');
 const path=baseline.candidateCorridors[0].path;
 const neighbors=path.map(pt=>{
  const rejected=[];
  for(const [dx,dy] of [[1,0],[-1,0],[0,-1],[0,1]]){
   const n={x:pt.x+dx,y:pt.y+dy};
   const info=whyBlocked(n,{labels,owner:ownership,
    contour:revised.originalContour,window:fixedWin,biome,elevation});
   if(info.reason!=='ALLOWED')rejected.push(info);
  }
  return rejected;
 });
 const runs=chokeRuns(neighbors,path);
 const allReasons=accumulate(neighbors.flat());
 const baselineCounts=baseline.candidateCorridors.map(x=>({
  clearancePx:x.clearancePx,found:x.found,
  pixelSteps:x.pixelSteps,pathSha256:x.pathSha256,
  startIsPermitted:x.startIsPermitted,targetIsPermitted:x.targetIsPermitted
 }));
 const widened=spec.clearances.map(clearance=>traceCandidateCorridor({
  labels,owner:ownership,sourceContour:revised.originalContour,
  ...limits,start,target,window:widerWin,clearance
 }));
 const blockedOwner=new Uint8Array(ownership);
 for(const pt of path.slice(1,-1)){
  const i=pt.y*limits.width+pt.x;
  if(![0,3].includes(blockedOwner[i]))
   fail('baseline path crossed forbidden regional ownership');
  blockedOwner[i]=255;
 }
 const disjoint=traceCandidateCorridor({labels,owner:blockedOwner,
  sourceContour:revised.originalContour,...limits,start,target,
  window:widerWin,clearance:0});
 const asMetrics=x=>({clearancePx:x.clearancePx,found:x.found,
  pixelSteps:x.pixelSteps,visitedCandidatePixels:x.visitedCandidatePixels,
  pathSha256:x.pathSha256,
  startIsPermitted:x.startIsPermitted,
  targetIsPermitted:x.targetIsPermitted});
 const visited=path.map(pt=>pairedPixel(biome,elevation,pt.x,pt.y));
 const pathSamples=path.filter((_,i)=>i%20===0||i===path.length-1)
  .map((pt)=>({coordinate:pt,...pairedPixel(biome,elevation,pt.x,pt.y)}));
 const result={
  status:'C1R_HELD_ORIGINAL_PAIR_SOURCE_CORRIDOR_DIAGNOSTICS_ONLY',
  inputWitness:{sourceVectorBlob:sourceBlob,biomeSha256:biomeHash,
   elevationSha256:elevationHash,originalSourceEdges:599,
   headlandSourceEdgesInclusive:[75,115],mainlandCandidateCells:79419},
  windows:{c1q:fixedWin,expanded:widerWin},
  baselineConnectivity:baselineCounts,
  widenedConnectivity:widened.map(asMetrics),
  alternateRouteWithAllC1QInteriorPathCellsExcluded:asMetrics(disjoint),
  narrowRouteDiagnostics:{
   zeroClearanceSteps:223,
   zeroClearancePathSha256:pathSha,
   sampledAlongZeroClearancePath:path.length,
   samplesLackingOnePixelManhattanClearance:neighbors.filter(x=>x.length).length,
   adjacentRejectedPixelReasons:allReasons,
   longestSuspectRuns:runs.slice(0,10),
   totalSuspectRuns:runs.length,
   originalSourcePairSamples:pathSamples,
   pathSampleRgbDiagnostics:{
    sourceBlueRulePositive:visited.filter(x=>x.blueRule).length,
    sourcePairRgbEquality:visited.filter(x=>x.equalRgb).length,
    alphaInvalid:visited.filter(x=>x.alphaInvalid).length
   }
  },
  paths:{c1q:path,expandedZero:widened[0].path,
   expandedOne:widened[1].path,expandedTwo:widened[2].path,
   alternativeDisjoint:disjoint.path},
  immutableAllocation:{
   C1PAssigned:52449,C1PUnassigned:26970,
   otherTerrainComponentsClaimed:0,newlyAllocatedCells:0,
   politicalHeadlandOwner:null,shattercapIslandClaims:0,
   canonicalWritable:false},
  interpretation:{
   sourceRGBAndTerrainCandidatesAreNotCertifiedLandSea:true,
   repeatedBFSIsNotAnApprovedRoute:true,
   expandedConnectivityDoesNotAuthorizeSovereignty:true,
   sourceCoastlineAndC1PPolygonRingsRemainUnmodified:true
  }
 };
 return result;
}
