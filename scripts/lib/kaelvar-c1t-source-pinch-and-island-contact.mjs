/**
 * C1-T original-source micro-morphology, no geographic authority.
 * Tests one teal source-pair pixel and potential contacts to separately
 * numbered physical components using scratch-only hypothetical masks.
 */
import {c1oPointInRing} from './kaelvar-c1o-regional-boundaries.mjs';
import {traceCandidateCorridor} from './kaelvar-c1q-headland-continuity.mjs';
import {isSharedNonblueUnresolved} from './kaelvar-c1i-source-ink-separation.mjs';

const fail=s=>{throw Error('C1-T source hold: '+s);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fp={x:400,y:317},fsource={x:837,y:675};
const crop={x:60,y:60,width:3976,height:2235};
const win={minX:300,minY:155,maxX:590,maxY:465};
const start={x:390,y:336},target={x:492,y:215};
const w=2048,h=1152;
const hashes=['9cd6752e9dbca00796e5f7c013066bb0e5a96175',
 '9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12',
 '02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d'];
const tealSha='0cfbc0fac95776681b79b48d9903b73ee4c588a09e9526f268e06b801249c16b';
const scenarios=['ORIGINAL_SOURCE_PAIR_ONLY','HYPOTHETICAL_TEAL_ONLY',
 'HYPOTHETICAL_BLACK_AND_TEAL','HYPOTHETICAL_ALL_SHARED_NONBLUE'];
const group=(r,g,b)=>(r===0&&g===0&&b===0)?'black':
 (r===4&&g===159&&b===169)?'teal':'other';
const xys=(pt)=>pt.x+','+pt.y;
const pointWithin=(pt)=>pt.x>=win.minX&&pt.x<=win.maxX&&pt.y>=win.minY&&pt.y<=win.maxY;

export function validateC1TContract(t,s,c1s,c1p){
 const src=t?.source,hold=t?.holds;
 if(t?.schemaVersion!==1||
  t.type!=='kaelvar-c1t-teal-pinch-detached-component-ink-contact-review.v1'||
  t.status!=='SOURCE_PAIR_MORPHOLOGY_ONLY_NO_RECLASSIFICATION_NO_REGION_PUBLICATION'||
  t.pinnedC1SHead!=='ef615ed831f700b681837aae9a9414a1ca3d37e8'||
  t.c1sSourceSpec!=='docs/design/kaelvar-c1s-headland-shared-ink-sensitivity-2026-11-14.json'||
  src?.vectorBlob!==hashes[0]||src.biomeSha256!==hashes[1]||
  src.elevationSha256!==hashes[2]||src.contourVertices!==599||
  !eq(src.registeredCrop,crop)||src.referenceWidth!==w||src.referenceHeight!==h||
  !eq(t.focus,{referencePixel:fp,registeredOriginalSourcePixel:fsource,
   expectedExactSharedRgb:[4,159,169],localRadiusReferenceSamples:8,
   expectedC1STealOnePixelClearancePathSha256:tealSha})||
  !eq(t.window,win)||!eq(t.start,start)||!eq(t.target,target)||
  !eq(t.sensitivityScenarioIds,scenarios)||t.hypotheticalOnly!==true||
  !eq(t.strictAllowedOwners,[0,3])||!eq(t.strictForbiddenOwners,[1,2,4])||
  t.originalTerrainLabelMainland!==30||
  !eq(t.sourceAdjacentOtherComponentLabels,[51,78,113])||
  !eq(t.requiredOriginalC1P,{mainlandTerrainCandidates:79419,assigned:52449,
   unassigned:26970,regions:[5632,18624,19182,9011],
   KharuunOriginalEdgesInclusive:[35,58],reviewHeadlandEdgesInclusive:[75,115]}))
  fail('original source, C1-S path, sampling focus or parent terrain drift');
 if(!eq(hold,{
  sourceImagesUnchanged:true,originalTerrainLabelsUnchanged:true,
  originalSourceCoastUnchanged:true,regionPolygonsUnchanged:true,
  headlandUnassigned:true,shattercapDetachedIslandsUnassigned:true,
  largeNortheasternIslandUnassigned:true,detachedComponentClaims:0,
  coast40Claim:null,serathylWindwardParent:'region.serathyl',
  newPortsWellsRiversRoutesSaltBasins:0,newLegacyHexDependencies:0,
  canonicalWritable:false}))
  fail('source, detachment, sovereignty or canonical hold promoted');
 if(s?.source?.originalCoastlineBlob!==hashes[0]||
  s.immutableHolds?.canonicalWritable!==false||
  c1s?.status!=='C1S_UNCERTAIN_SHARED_SOURCE_INK_SENSITIVITY_ONLY_CANONICAL_HELD'||
  !eq(c1s.scenarios?.map(x=>x.id),[
   'ORIGINAL_SOURCE_PAIR_ONLY','HYPOTHETICAL_BLACK_ONLY',
   'HYPOTHETICAL_TEAL_ONLY','HYPOTHETICAL_BLACK_AND_TEAL',
   'HYPOTHETICAL_ALL_SHARED_NONBLUE'])||
  !eq(c1s.classification?.eligibleUncertainReferenceSamples,
   {black:2289,teal:173,other:351})||
  c1s.classification?.candidatePixelsAdjacentToOtherOriginalPhysicalComponents!==31||
  !eq(c1s.classification?.neighboringOriginalNonMainlandComponentLabels,[51,78,113])||
  c1s.paths?.HYPOTHETICAL_TEAL_ONLY?.[1]?.length!==224||
  c1s.scenarios[2].clearance[1].pathSha256!==tealSha||
  c1p?.status!=='C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD'||
  c1p.originalSourceEdgesConserved!==599||
  !eq(c1p.measurements?.perRegion.map(x=>x.terrainCandidateCells),
   [5632,18624,19182,9011])||
  c1p.measurements.previewAssignedMainlandTerrainCells!==52449||
  c1p.measurements.remainingUnassignedMainlandTerrainCells!==26970)
  fail('accepted C1-S sensitivity or source-registered C1-P baseline drift');
 return true;
}
function samplePair(biome,elevation,x,y){
 const sx=crop.x+Math.min(crop.width-1,Math.floor((x+.5)*crop.width/w));
 const sy=crop.y+Math.min(crop.height-1,Math.floor((y+.5)*crop.height/h));
 const i=(sy*biome.width+sx)*4;
 const a=biome.rgba,b=elevation.rgba;
 const rgb=[a[i],a[i+1],a[i+2]];
 const shared=isSharedNonblueUnresolved(...a.slice(i,i+4),...b.slice(i,i+4));
 return {sourcePixel:{x:sx,y:sy},rgb,
  identicalRgb:rgb.every((v,k)=>v===b[i+k]),
  sharedNonblue:shared,category:shared?group(...rgb):null,
  biomeAlpha:a[i+3],elevationAlpha:b[i+3]};
}
const metric=a=>({found:a.found,steps:a.pixelSteps,hash:a.pathSha256});
function connectedContactSet({allowed,classes,originalLabels,ownership,contour}){
 // A bounded hypothetical flood is not an update to original terrain labels.
 const bw=win.maxX-win.minX+1,bh=win.maxY-win.minY+1;
 const idx=(x,y)=>(y-win.minY)*bw+(x-win.minX);
 const okay=(x,y)=>{
  if(!pointWithin({x,y}))return false;
  const abs=y*w+x,owner=ownership[abs],label=originalLabels[abs];
  return (owner===0||owner===3)&&c1oPointInRing({x:x+.5,y:y+.5},contour)&&
   (label===30||(label===0&&allowed.has(classes[idx(x,y)])));
 };
 const vis=new Uint8Array(bw*bh),queue=new Int32Array(bw*bh);
 if(!okay(start.x,start.y))fail('original Verdant BFS seed not permitted');
 let head=0,tail=1;queue[0]=idx(start.x,start.y);vis[queue[0]]=1;
 while(head<tail){
  const at=queue[head++],x=win.minX+at%bw,y=win.minY+Math.floor(at/bw);
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,ny=y+dy;if(!okay(nx,ny))continue;
   const n=idx(nx,ny);if(!vis[n]){vis[n]=1;queue[tail++]=n;}
  }
 }
 return {visited:vis,reachedCandidateSamples:tail,idx};
}
export function buildC1TReview({spec,c1sSpec,c1s,c1p,
 labels,ownership,revised,biome,elevation}){
 validateC1TContract(spec,c1sSpec,c1s,c1p);
 if(labels?.length!==w*h||ownership?.length!==w*h||
  revised?.originalContour?.length!==599||
  biome?.width!==4096||biome.height!==2355||
  elevation?.width!==4096||elevation.height!==2355||
  biome.rgba?.length!==4096*2355*4||
  elevation.rgba?.length!==4096*2355*4)
  fail('pinned source images or original terrain masks missing');
 const focus=samplePair(biome,elevation,fp.x,fp.y);
 if(!eq(focus.sourcePixel,fsource)||!eq(focus.rgb,[4,159,169])||
  focus.category!=='teal'||!focus.identicalRgb||
  labels[fp.y*w+fp.x]!==0||ownership[fp.y*w+fp.x]!==0||
  !c1oPointInRing({x:fp.x+.5,y:fp.y+.5},revised.originalContour))
  fail('teal focus sample is not a strictly unresolved original pixel');
 const tealPath=c1s.paths.HYPOTHETICAL_TEAL_ONLY[1];
 const tealOnPath=tealPath.filter(pt=>{
  const pair=samplePair(biome,elevation,pt.x,pt.y);
  return pair.sharedNonblue&&pair.category==='teal'&&labels[pt.y*w+pt.x]===0;
 });
 if(!eq(tealOnPath,[fp]))fail('one-pixel teal path witness changed');

 const bw=win.maxX-win.minX+1,bh=win.maxY-win.minY+1;
 const idx=(x,y)=>(y-win.minY)*bw+(x-win.minX);
 const classes=new Array(bw*bh).fill(null),candidates=[],byClass={black:0,teal:0,other:0};
 const touches=[];
 const near={black:0,teal:0,other:0};
 const byComponent={};
 for(let y=win.minY;y<=win.maxY;y++)for(let x=win.minX;x<=win.maxX;x++){
  const abs=y*w+x;
  if(labels[abs]!==0||ownership[abs]!==0||
   !c1oPointInRing({x:x+.5,y:y+.5},revised.originalContour))continue;
  const pair=samplePair(biome,elevation,x,y);
  if(!pair.sharedNonblue)continue;
  classes[idx(x,y)]=pair.category;byClass[pair.category]++;
  candidates.push({x,y,category:pair.category});
  const other=new Set();
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,ny=y+dy;
   if(nx<0||ny<0||nx>=w||ny>=h)continue;
   const component=labels[ny*w+nx];
   if(component>0&&component!==30)other.add(component);
  }
  if(other.size){
   const labels=[...other].sort((a,b)=>a-b);
   touches.push({x,y,category:pair.category,componentLabels:labels});
   near[pair.category]++;
   for(const label of labels){
    const row=byComponent[label]||(byComponent[label]={candidateSamples:0,byClass:{black:0,teal:0,other:0},examples:[]});
    row.candidateSamples++;row.byClass[pair.category]++;
    if(row.examples.length<6)row.examples.push({x,y,category:pair.category});
   }
  }
 }
 if(!eq(byClass,{black:2289,teal:173,other:351})||
  touches.length!==31||!eq(Object.keys(byComponent).map(Number).sort((a,b)=>a-b),[51,78,113]))
  fail('strict original source shared-color or detached adjacency count changed');

 const scratch=(selected,removeFocus=false,focusOnly=false)=>{
  const out=new Uint16Array(labels);
  for(const c of candidates){
   if(!selected.has(c.category))continue;
   if(removeFocus&&c.x===fp.x&&c.y===fp.y)continue;
   if(focusOnly&&(c.x!==fp.x||c.y!==fp.y))continue;
   out[c.y*w+c.x]=30;
  }
  return out;
 };
 const route=l=>traceCandidateCorridor({labels:l,owner:ownership,
  sourceContour:revised.originalContour,width:w,height:h,
  start,target,window:win,clearance:1});
 const focusOnly=route(scratch(new Set(['teal']),false,true));
 const tealAblation=route(scratch(new Set(['teal']),true,false));
 const tealFull=route(scratch(new Set(['teal'])));
 if(!eq(metric(tealFull),{found:true,steps:223,hash:tealSha}))
  fail('C1-S teal 1px passage no longer matches exact source witness');

 const riskScenarios=[];
 for(const [id,types] of [
  ['ORIGINAL_SOURCE_PAIR_ONLY',[]],
  ['HYPOTHETICAL_TEAL_ONLY',['teal']],
  ['HYPOTHETICAL_BLACK_AND_TEAL',['black','teal']],
  ['HYPOTHETICAL_ALL_SHARED_NONBLUE',['black','teal','other']]
 ]){
  const allowed=new Set(types);
  const reach=connectedContactSet({allowed,classes,originalLabels:labels,
   ownership,contour:revised.originalContour});
  const exposed=touches.filter(x=>allowed.has(x.category)&&reach.visited[reach.idx(x.x,x.y)]);
  const physical=[...new Set(exposed.flatMap(x=>x.componentLabels))].sort((a,b)=>a-b);
  riskScenarios.push({id,
   hypotheticallyPermittedClasses:types,
   sourceReachableReviewSamples:reach.reachedCandidateSamples,
   potentialPhysicalContactSamples:exposed.length,
   potentialPhysicalComponentLabels:physical,
   potentialContactExamples:exposed.slice(0,12),
   actuallyMergedOrClaimedPhysicalComponents:0});
 }
 const radius=spec.focus.localRadiusReferenceSamples;
 const micro={black:0,teal:0,other:0,strictCandidate:0,notShared:0,outsideContour:0};
 const microSamples=[];
 for(let y=fp.y-radius;y<=fp.y+radius;y++)
  for(let x=fp.x-radius;x<=fp.x+radius;x++){
   const pair=samplePair(biome,elevation,x,y);
   const ii=y*w+x,inside=c1oPointInRing({x:x+.5,y:y+.5},revised.originalContour);
   if(!inside)micro.outsideContour++;
   else if(labels[ii]===30)micro.strictCandidate++;
   else if(pair.sharedNonblue)micro[pair.category]++;
   else micro.notShared++;
   if((x===fp.x&&y===fp.y)||(x===fp.x&&Math.abs(y-fp.y)<=2))
    microSamples.push({reference:{x,y},...pair,sourceTerrainLabel:labels[ii],originalOwner:ownership[ii]});
  }
 return {
  status:'C1T_SOURCE_MICROMORPHOLOGY_AND_DETACHED_RISK_ONLY_NO_REGION_CHANGE',
  focus:{reference:fp,source:fsource,...focus,
   C1STealOnePixelClearancePathSha256:tealSha,
   exactTealUnknownSamplesOnC1SOnePixelPath:tealOnPath},
  focusPixelOneAtATime:{
   originalTealSensitivity1px:metric(tealFull),
   focusOnlyHypotheticalTeal1px:metric(focusOnly),
   allTealExceptFocus1px:metric(tealAblation),
   sourceRgbReclassificationApproved:false
  },
  localSourceNeighborhood:{radius,counts:micro,originalPixelPairExamples:microSamples},
  detachedContactAudit:{
   eligibleUnresolvedSamples:byClass,sourcePixelAdjacencySamples:touches.length,
   byClass:near,byOriginalPhysicalComponent:byComponent,
   adjacencyIsNotPhysicalAttachment:true,
   scenarios:riskScenarios,
   originalPhysicalComponentLabelsUnchanged:true,
  },
  noChanges:{originalVectorEdges:599,acceptedTerrainCandidateCells:79419,
   acceptedC1PAssigned:52449,acceptedC1PUnassigned:26970,
   sourcePixelsChanged:0,originalTerrainLabelsChanged:0,
   polygonChanges:0,newHeadlandOwner:null,shattercapIslandsGranted:0,
   detachedPhysicalComponentsClaimed:0,canonicalWritable:false},
  limits:{hypotheticalLandCannotBeCertifiedFromSharedRgb:true,
   aSingleCriticalPixelCannotProveDryMainland:true,
   possibleComponentContactIsNotPoliticalOwnership:true,
   sourceVectorAndRasterRemainAuthoritative:true}
 };
}
