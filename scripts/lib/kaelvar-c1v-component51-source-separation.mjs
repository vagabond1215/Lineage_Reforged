/**
 * C1-V original source-pair separation analysis of physical component 51.
 * No edits to land classification, connected-component labels, original
 * vector, regional polygons, islands, or canonical world data.
 */
import {createHash} from 'node:crypto';
import {c1oPointInRing} from './kaelvar-c1o-regional-boundaries.mjs';
import {isSharedNonblueUnresolved}
 from './kaelvar-c1i-source-ink-separation.mjs';

const hold=s=>{throw Error('C1-V original-source HOLD: '+s);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const sourceHash='9cd6752e9dbca00796e5f7c013066bb0e5a96175';
const biomeHash='9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12';
const elevationHash='02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d';
const parent='02e3a0a0d42dde010c92c0fb086c9f3cdda54553';
const width=2048,height=1152;
const crop={x:60,y:60,width:3976,height:2235};
const win={minX:440,minY:185,maxX:515,maxY:255};
const seed={x:466,y:207};
const scenarios=[
 {id:'STRICT_ORIGINAL',allow:[]},
 {id:'SHARED_BLACK_ONLY',allow:['black']},
 {id:'SHARED_TEAL_ONLY',allow:['teal']},
 {id:'SHARED_BLACK_AND_TEAL',allow:['black','teal']},
 {id:'ALL_SHARED_NONBLUE',allow:['black','teal','other']}
];
const summaryKeys=['black','teal','other','sourceBlue','otherExcluded','invalidAlpha'];
const emptyClasses=()=>Object.fromEntries(summaryKeys.map(x=>[x,0]));
const cardinal=[[1,0],[-1,0],[0,1],[0,-1]];
const key=p=>p.x+','+p.y;
const sourcePt=(x,y)=>({x,y});
const insideWindow=(x,y)=>x>=win.minX&&x<=win.maxX&&y>=win.minY&&y<=win.maxY;
const sourcePixelCoord=(x,y)=>({
 x:crop.x+Math.min(crop.width-1,Math.floor((x+.5)*crop.width/width)),
 y:crop.y+Math.min(crop.height-1,Math.floor((y+.5)*crop.height/height))
});
function colorSample(biome,elevation,x,y){
 const pixel=sourcePixelCoord(x,y);
 const i=(pixel.y*biome.width+pixel.x)*4,a=biome.rgba,b=elevation.rgba;
 const rgb=[a[i],a[i+1],a[i+2]],ergb=[b[i],b[i+1],b[i+2]];
 const validAlpha=a[i+3]>0&&a[i+3]===b[i+3];
 const blue=rgb[2]>150&&rgb[2]-rgb[1]>25&&rgb[2]-rgb[0]>80;
 const shared=isSharedNonblueUnresolved(a[i],a[i+1],a[i+2],a[i+3],
  b[i],b[i+1],b[i+2],b[i+3]);
 let cls='otherExcluded';
 if(!validAlpha)cls='invalidAlpha';
 else if(blue)cls='sourceBlue';
 else if(shared)cls=rgb.every(v=>v===0)?'black':
  eq(rgb,[4,159,169])?'teal':'other';
 return {reference:{x,y},originalPngPixel:pixel,
  biomeRGB:rgb,elevationRGB:ergb,sourceAlpha:[a[i+3],b[i+3]],
  category:cls,sharedNonblue:shared,sourceBlueCutoff:blue};
}
const bbox=pts=>({
 minX:Math.min(...pts.map(x=>x.x)),minY:Math.min(...pts.map(x=>x.y)),
 maxX:Math.max(...pts.map(x=>x.x)),maxY:Math.max(...pts.map(x=>x.y))
});
const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const eps=1e-9;
function properCross(a,b,c,d){
 const ab1=cross(a,b,c),ab2=cross(a,b,d);
 const cd1=cross(c,d,a),cd2=cross(c,d,b);
 return ((ab1>eps&&ab2< -eps)||(ab1< -eps&&ab2>eps))&&
  ((cd1>eps&&cd2< -eps)||(cd1< -eps&&cd2>eps));
}
function segmentDistance(p,a,b){
 const dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;
 const t=den?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/den)):0;
 return Math.hypot(p.x-(a.x+t*dx),p.y-(a.y+t*dy));
}
function outlineProximity(pts,contour){
 let best={sourceEdgeIndex:null,distanceReferencePixels:Infinity,
  nearestComponentCell:null},dists=[];
 for(const cell of pts){
  const p={x:cell.x+.5,y:cell.y+.5};
  let local={distanceReferencePixels:Infinity,sourceEdgeIndex:null};
  for(let i=75;i<=115;i++){
   const d=segmentDistance(p,contour[i],contour[(i+1)%599]);
   if(d<local.distanceReferencePixels){local={distanceReferencePixels:d,sourceEdgeIndex:i};}
  }
  if(local.distanceReferencePixels<best.distanceReferencePixels)
   best={...local,nearestComponentCell:cell};
  dists.push(local.distanceReferencePixels);
 }
 return {...best,
  maxDistanceReferencePixels:Math.max(...dists),
  distancesAreUncalibrated:true};
}
function reviewPath(labels,owner,contour,classes,componentCells,allowed){
 const localW=win.maxX-win.minX+1,localH=win.maxY-win.minY+1;
 const lid=(x,y)=>(y-win.minY)*localW+x-win.minX;
 const xof=i=>win.minX+i%localW;
 const yof=i=>win.minY+Math.floor(i/localW);
 const parent=new Int32Array(localW*localH);parent.fill(-2);
 const q=new Int32Array(parent.length);let head=0,tail=0,end=-1;
 const permitted=(x,y)=>{
  if(!insideWindow(x,y))return false;
  const pos=y*width+x,label=labels[pos],political=owner[pos];
  if(political!==0&&political!==3)return false;
  if(label===51)return true;
  if(label===30)return c1oPointInRing({x:x+.5,y:y+.5},contour);
  if(label!==0)return false;
  if(!c1oPointInRing({x:x+.5,y:y+.5},contour))return false;
  return allowed.has(classes[lid(x,y)]);
 };
 for(const cell of componentCells){
  if(!insideWindow(cell.x,cell.y))continue;
  const i=lid(cell.x,cell.y);
  if(!permitted(cell.x,cell.y))hold('original physical component 51 seed excluded');
  if(parent[i]===-2){parent[i]=-1;q[tail++]=i;}
 }
 if(tail===0)hold('component 51 outside fixed source review window');
 while(head<tail){
  const at=q[head++],x=xof(at),y=yof(at);
  if(labels[y*width+x]===30){end=at;break;}
  for(const [dx,dy] of cardinal){
   const nx=x+dx,ny=y+dy;
   if(!permitted(nx,ny))continue;
   const ni=lid(nx,ny);
   if(parent[ni]!==-2)continue;
   parent[ni]=at;q[tail++]=ni;
  }
 }
 if(end<0)return {found:false,shortestPixelSteps:null,
  strictlyOriginalPhysicalConnectivity:false,hypotheticalPixelsOnPath:null,
  classesOnPath:null,pathSha256:null,
  sourceVectorProperCrossingsOnPath:null,path:[]};
 const path=[];
 for(let i=end;i!==-1;i=parent[i])path.push({x:xof(i),y:yof(i)});
 path.reverse();
 const used={black:0,teal:0,other:0};
 for(const pt of path){
  const pos=pt.y*width+pt.x;
  if(labels[pos]===0){
   const c=classes[lid(pt.x,pt.y)];
   if(!allowed.has(c)||!Object.hasOwn(used,c))
    hold('hypothetical corridor illegally passed unknown or non-shared pixel');
   used[c]++;
  }else if(labels[pos]!==30&&labels[pos]!==51)
   hold('hypothetical corridor entered other physical component');
 }
 let sourceCrossings=0;
 for(let j=1;j<path.length;j++){
  const a={x:path[j-1].x+.5,y:path[j-1].y+.5},
    b={x:path[j].x+.5,y:path[j].y+.5};
  for(let i=0;i<599;i++)
   if(properCross(a,b,contour[i],contour[(i+1)%599]))sourceCrossings++;
 }
 return {found:true,shortestPixelSteps:path.length-1,
  strictlyOriginalPhysicalConnectivity:used.black+used.teal+used.other===0,
  hypotheticalPixelsOnPath:used.black+used.teal+used.other,
  classesOnPath:used,
  pathSha256:createHash('sha256').update(path.map(key).join(';')).digest('hex'),
  sourceVectorProperCrossingsOnPath:sourceCrossings,path};
}
export function validateC1VContract(s,u,p,c1uReport,c1pReport){
 if(s?.schemaVersion!==1||
  s.type!=='kaelvar-c1v-physical-component51-source-pair-separation-review.v1'||
  s.status!=='ORIGINAL_COMPONENT51_INLET_SOURCE_MORPHOLOGY_NO_PHYSICAL_MERGE_OR_POLITICAL_APPROVAL'||
  s.parentC1UHead!==parent||
  !eq(s.source,{
   originalVectorBlob:sourceHash,
   sourceContourId:'feature.coastline.first_world.part_10',
   originalCoastEdges:599,reviewedHeadlandEdgesInclusive:[75,115],
   biomeSha256:biomeHash,elevationSha256:elevationHash,
   registeredCrop:crop,registeredReference:{width,height}})||
  !eq(s.study,{componentId:51,mainlandComponentId:30,
   representativeComponentPixel:seed,
   localWindowInclusive:win,sourceInlandCheckAtPixelCenters:true,
   proximityToExactSourceHeadlandEdges:[75,115],
   hypotheticalScenarioClasses:scenarios,
   originalLabelZeroRequiredForUncertainPixels:true,
   forbiddenOtherPhysicalComponentTraversal:true,
   forbiddenPoliticalOwnerCodes:[1,2,4],
   allowedPoliticalOwnerCodes:[0,3],fourNeighborOnly:true,
   sampleDistanceUnit:'UNCALIBRATED_SOURCE_REFERENCE_PIXEL'})||
  !eq(s.pinnedC1U,{
   geometryOptions:['DIRECT_CHORD_DIAGNOSTIC','INSET_RETURN_CANDIDATE','COMPACT_RETURN_CANDIDATE'],
   relevantReviewCapIds:['INSET_RETURN_CANDIDATE','COMPACT_RETURN_CANDIDATE'],
   expectedComponent51CandidateCellsInsideEach:13,
   acceptedHeadlandPoliticalOwner:null,existingC1PAssignedCells:52449,
   existingC1PUnassignedCells:26970,
   originalMainlandCandidateCells:79419})||
  !eq(s.immutableHolds,{
   canonicalWritable:false,headlandUnassigned:true,
   kharuunOptionBEdgesInclusive:[35,58],
   verdantSoutheasternPeninsulaAnchorsPreserved:3,
   originalSourcePixelsUnchanged:true,originalTerrainLabelsUnchanged:true,
   originalSourceCoastlineUnchanged:true,
   originalC1PRegionRingsUnchanged:true,
   component51NotRelabeled:true,
   noDetachedPhysicalComponentClaims:true,
   largeNortheastIslandUnassigned:true,
   shattercapDetachedIslandsUnassigned:true,
   coast40Claim:null,serathylWindwardParent:'region.serathyl',
   noPortsWellsRiversRoutesSaltBasins:true,
   newLegacyHexDependencies:0}))
  hold('original source, review window, inherited owner holds or C1-U context changed');
 if(u?.parentC1THead!=='eee96eeef6554eee148b6a7b6fb1bdf153d52f8e'||
  p?.holds?.canonicalWritable!==false||
  !eq(p.ownerReviewDirection?.kharuunSourceEdgeIndicesInclusive,[35,58])||
  c1uReport?.status!=='C1U_SOURCE_ARC_REVIEW_ENCLOSURES_PASSED_NO_TERRITORIAL_APPROVAL'||
  !eq(c1uReport.reviewEnclosures.map(x=>x.id),
   s.pinnedC1U.geometryOptions)||
  c1uReport.reviewEnclosures.slice(1).some(x=>
   x.sample.otherOriginalPhysicalComponentsById?.['51']!==13||
   x.sample.originalProvisionalRegionPixelCount!==0||
   x.canonicalWritable!==false)||
  c1uReport.preservedC1P?.newRegionCells!==0||
  c1pReport?.status!=='C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD'||
  c1pReport.originalSourceEdgesConserved!==599||
  c1pReport.sourcePngFingerprintsVerified!==true||
  c1pReport.sourceOriginalContourUnmodified!==true||
  c1pReport.measurements?.candidateMainlandTerrainCells!==79419||
  c1pReport.measurements.previewAssignedMainlandTerrainCells!==52449||
  c1pReport.measurements.remainingUnassignedMainlandTerrainCells!==26970||
  !eq(c1pReport.measurements.perRegion.map(x=>x.terrainCandidateCells),
   [5632,18624,19182,9011])||
  c1pReport.measurements.detachedPhysicalComponentsClaimed!==0)
  hold('native original C1-P or C1-U verification input changed');
 return true;
}
export function buildC1VComponent51Review({spec,c1uSpec,p,c1uReport,
 c1pReport,labels,ownership,revised,biome,elevation}){
 validateC1VContract(spec,c1uSpec,p,c1uReport,c1pReport);
 if(labels?.length!==width*height||ownership?.length!==width*height||
  revised?.originalContour?.length!==599||
  revised.protectedOffshore?.length!==3||
  biome?.width!==4096||biome.height!==2355||
  elevation?.width!==4096||elevation.height!==2355||
  biome.rgba?.length!==4096*2355*4||
  elevation.rgba?.length!==4096*2355*4)
  hold('original source labels, 599 source vertices or both registered PNGs missing');
 const contour=revised.originalContour,component=[];
 for(let i=0;i<labels.length;i++)
  if(labels[i]===51)component.push({x:i%width,y:Math.floor(i/width)});
 if(!component.length||component.length>10000||
  labels[seed.y*width+seed.x]!==51)
  hold('original separate component 51 has vanished or expanded unexpectedly');
 const pixelsSet=new Set(component.map(key));
 const visits=new Set([key(seed)]),queue=[seed];
 for(let first=0;first<queue.length;first++){
  const pt=queue[first];
  for(const [dx,dy] of cardinal){
   const q={x:pt.x+dx,y:pt.y+dy};
   if(pixelsSet.has(key(q))&&!visits.has(key(q))){
    visits.add(key(q));queue.push(q);
   }
  }
 }
 if(visits.size!==component.length)
  hold('original component 51 not one 4-neighbor connected source component');
 const capMetrics=c1uReport.reviewEnclosures.slice(1).map(x=>{
  const covered=component.filter(p=>
   c1oPointInRing({x:p.x+.5,y:p.y+.5},x.ringOriginalSourceFrame));
  if(covered.length!==13)hold('component 51 enclosure sample witness changed');
  return {id:x.id,containedOriginalComponent51Cells:covered.length,
   noComponent51Reclassification:true};
 });
 const insideCount=component.filter(p=>
  c1oPointInRing({x:p.x+.5,y:p.y+.5},contour)).length;
 const neighbors=new Map(),edges={strictMainland30:0,component51:0,
  unresolvedZero:0,outsideFrame:0,otherPhysicalComponent:0};
 for(const pt of component)for(const [dx,dy] of cardinal){
  const x=pt.x+dx,y=pt.y+dy;
  if(x<0||y<0||x>=width||y>=height){edges.outsideFrame++;continue;}
  const id=labels[y*width+x];
  if(id===51){edges.component51++;continue;}
  if(id===30)edges.strictMainland30++;
  else if(id===0)edges.unresolvedZero++;
  else edges.otherPhysicalComponent++;
  if(!neighbors.has(x+','+y))neighbors.set(x+','+y,{x,y,label:id});
 }
 const neighborTypes=emptyClasses(),nonMainlandNeighborPixels=[];
 for(const nb of neighbors.values()){
  if(nb.label!==0)continue;
  const ink=colorSample(biome,elevation,nb.x,nb.y);
  neighborTypes[ink.category]++;
  nonMainlandNeighborPixels.push({x:nb.x,y:nb.y,category:ink.category,
   originalPngPixel:ink.originalPngPixel,
   insideOriginalSourceContour:c1oPointInRing(
    {x:nb.x+.5,y:nb.y+.5},contour)});
 }
 const localW=win.maxX-win.minX+1,localH=win.maxY-win.minY+1;
 const localClass=new Array(localW*localH).fill(null);
 const idx=(x,y)=>(y-win.minY)*localW+x-win.minX;
 const sourceInk={black:0,teal:0,other:0,sourceBlue:0,
  otherExcluded:0,invalidAlpha:0};
 const candidateUnknown=[];
 for(let y=win.minY;y<=win.maxY;y++)for(let x=win.minX;x<=win.maxX;x++){
  const p=y*width+x;
  if(labels[p]!==0||ownership[p]!==0)continue;
  if(!c1oPointInRing({x:x+.5,y:y+.5},contour))continue;
  const sampled=colorSample(biome,elevation,x,y);
  sourceInk[sampled.category]++;
  localClass[idx(x,y)]=sampled.category;
  if(['black','teal','other'].includes(sampled.category))
   candidateUnknown.push({x,y,category:sampled.category});
 }
 const routes=scenarios.map(s=>{
  const a=reviewPath(labels,ownership,contour,localClass,
   component,new Set(s.allow));
  return {scenario:s.id,admittedUnresolvedClasses:s.allow,
   ...a,notLandSeaOrSovereigntyCertification:true};
 });
 const pairSamples=component.slice(0,40).map(p=>({
  ...colorSample(biome,elevation,p.x,p.y),
  strictComponentId:51,politicalOwner:ownership[p.y*width+p.x]
 }));
 if(pairSamples.some(p=>p.sharedNonblue||p.sourceBlueCutoff||p.politicalOwner!==0))
  hold('original component-51 strict source-pair pixel classification changed');
 return {
  status:'C1V_COMPONENT51_INLET_IDENTITY_NATIVE_SOURCE_AUDIT_CANONICAL_HELD',
  sourceWitness:{originalVectorBlob:sourceHash,originalContourEdges:599,
   originalBiomeSha256:biomeHash,originalElevationSha256:elevationHash,
   headlandEdges:[75,115],componentId:51,mainlandId:30},
  component:{
   originalTerrainComponentId:51,actualSourceCandidatePixelCount:component.length,
   boundingReferencePixels:bbox(component),
   fourConnected:true,originalSourceContourContainedCells:insideCount,
   originalSourceContourOutsideCells:component.length-insideCount,
   extentInsideReviewEnclosures:capMetrics,
   sourceCoastProximity:outlineProximity(component,contour),
   originalComponent51Pixels:component,
   originalPairSamples:pairSamples
  },
  componentBoundary:{
   cardinalEdgeCounts:edges,
   uniqueAdjacentReferencePixels:neighbors.size,
   uniqueAdjacentExcludedPixelColorCategories:neighborTypes,
   originalSourceZeroNeighborSamples:nonMainlandNeighborPixels,
   originalSourceBoundaryUnchanged:true
  },
  localHypotheticalConnectivity:{
   window:win,availableUnassignedOriginalZeroSourceClasses:sourceInk,
   possibleSourceIdenticalUnknownPixelSamples:candidateUnknown.length,
   originalUncertainSampleExamples:candidateUnknown.slice(0,60),
   routeScenarios:routes,
   physicalComponent51NeverRelabeled:true,
   originalMainlandComponent30NeverRelabeled:true,
   noOtherPhysicalComponentTraversed:true
  },
  fixedC1P:{mainlandOriginalCandidateCells:79419,
   originalRegionAssignedCells:52449,originalRegionUnassignedCells:26970,
   fourRegionCells:[5632,18624,19182,9011],
   sourcePixelsChanged:0,terrainComponentLabelsChanged:0,
   newPoliticalTerritoryCells:0,detachedComponentsGranted:0,
   canonicalWritable:false},
  holds:{headlandPoliticalOwner:null,shattercapUnassigned:true,
   largeNortheastIslandUnassigned:true,kharuunOptionBEdges:[35,58],
   coastlineEdgesConserved:599,
   sourceClassificationUncertified:true,
   noWaterRouteOrPortPublication:true,
   geometricReviewCapsNotPoliticalBoundaries:true}
 };
}
