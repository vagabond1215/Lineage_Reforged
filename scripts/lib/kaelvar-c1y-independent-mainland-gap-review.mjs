/**
 * C1-Y: bounded non-headland mainland region-interface review.
 * Uses ONLY original physical mainland label 30 and existing C1-P owners.
 * Computes shortest paths through unassigned candidate terrain without
 * claiming those pixels or changing any original/region raster or polygon.
 */
import {createHash} from 'node:crypto';
import {c1oPointInRing} from './kaelvar-c1o-regional-boundaries.mjs';

const fail=s=>{throw Error('C1-Y noncanonical source HOLD: '+s);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const base={
 source:{
  originalVectorBlob:'9cd6752e9dbca00796e5f7c013066bb0e5a96175',
  originalSourceEdgeCount:599,
  biomeSha256:'9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12',
  elevationSha256:'02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d',
  mainlandTerrainComponent:30,reference:{width:2048,height:1152}
 },
 acceptedC1P:{
  assigned:52449,unassigned:26970,totalMainland:79419,
  perRegion:[5632,18624,19182,9011],
  regionIds:['region.auric_marches','region.kharuun_drylands',
   'region.verdant_thalos','region.veyrholm_shore'],
  kharuunSourceCoastEdgeIndicesInclusive:[35,58],
  northeastHeadlandOriginalCoastEdgesInclusive:[75,115]
 },
 windows:[
  {id:'AURIC_KHARUUN_WESTERN_STEPPE',
   regionA:'region.auric_marches',regionB:'region.kharuun_drylands',
   bounds:{minX:180,minY:215,maxX:280,maxY:335}},
  {id:'AURIC_VEYRHOLM_NORTHWEST',
   regionA:'region.auric_marches',regionB:'region.veyrholm_shore',
   bounds:{minX:75,minY:180,maxX:275,maxY:275}},
  {id:'VEYRHOLM_KHARUUN_NORTHERN_INLAND',
   regionA:'region.veyrholm_shore',regionB:'region.kharuun_drylands',
   bounds:{minX:205,minY:170,maxX:365,maxY:265}},
  {id:'KHARUUN_VERDANT_SOUTHERN_TRANSITION',
   regionA:'region.kharuun_drylands',regionB:'region.verdant_thalos',
   bounds:{minX:245,minY:280,maxX:425,maxY:390}},
  {id:'AURIC_VERDANT_SOUTHWESTERN_TRANSITION',
   regionA:'region.auric_marches',regionB:'region.verdant_thalos',
   bounds:{minX:180,minY:295,maxX:310,maxY:445}}
 ],
 hold:{
  sourceRasterPixelsChanged:0,sourceContourVerticesChanged:0,
  terrainComponentLabelsChanged:0,originalC1PRegionPolygonChanges:0,
  newPoliticalTerritoryCells:0,detachedComponentsClaimed:0,
  noNortheastHeadlandOwner:true,noComponent51Owner:true,
  shattercapDetachedIslandsUnassigned:true,
  largeNortheasternIslandUnassigned:true,
  verdantSoutheasternPeninsulaPreserved:true,
  veyrholmInteriorExclusionsPreserved:true,
  coast40Claim:null,serathylWindwardParent:'region.serathyl',
  portsWellsRiversWaterRoutesSaltBasinsPlaced:0,
  canonicalWritable:false,newLegacyHexDependencies:0
 }
};
const canonicalOwner=name=>base.acceptedC1P.regionIds.indexOf(name)+1;
const offsets=[[1,0],[-1,0],[0,1],[0,-1]];
const minGap=path=>path.length-2;
const coords=idx=>({x:idx%2048,y:Math.floor(idx/2048)});
function sampleWindow(w,labels,owners,contour){
 const {minX,minY,maxX,maxY}=w.bounds,
  dx=maxX-minX+1,dy=maxY-minY+1,size=dx*dy;
 const a=canonicalOwner(w.regionA),b=canonicalOwner(w.regionB);
 if(a<=0||b<=0||a===b)fail(w.id+' region codes invalid');
 const at=(x,y)=>(y-minY)*dx+x-minX;
 const from=i=>({x:minX+i%dx,y:minY+Math.floor(i/dx)});
 const ownersCount={ownerA:0,ownerB:0,otherRegion:0,
  unassignedMainland:0,originalLabelZero:0,
  otherPhysicalComponent:0};
 const parent=new Int32Array(size);parent.fill(-2);
 const queue=new Int32Array(size);let tail=0,head=0;
 for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
  const z=y*2048+x,l=labels[z],own=owners[z],i=at(x,y);
  if(l===30){
   if(own===a){ownersCount.ownerA++;parent[i]=-1;queue[tail++]=i;}
   else if(own===b)ownersCount.ownerB++;
   else if(own===0)ownersCount.unassignedMainland++;
   else ownersCount.otherRegion++;
  }else if(l===0)ownersCount.originalLabelZero++;
  else ownersCount.otherPhysicalComponent++;
 }
 let terminal=-1;
 while(head<tail){
  const i=queue[head++],pt=from(i);
  for(const [mx,my] of offsets){
   const x=pt.x+mx,y=pt.y+my;
   if(x<minX||x>maxX||y<minY||y>maxY)continue;
   const j=at(x,y);if(parent[j]!==-2)continue;
   const z=y*2048+x;
   if(labels[z]!==30)continue;
   const own=owners[z];
   if(own===b){parent[j]=i;terminal=j;break;}
   if(own!==0)continue;
   parent[j]=i;queue[tail++]=j;
  }
  if(terminal!==-1)break;
 }
 if(ownersCount.ownerA===0||ownersCount.ownerB===0)
  fail(w.id+' window lost a required original C1-P region');
 let path=[];
 if(terminal!==-1){
  for(let i=terminal;i!==-1;i=parent[i])path.push(from(i));
  path.reverse();
 }
 const unassigned=path.slice(1,-1);
 for(let k=0;k<path.length;k++){
  const {x,y}=path[k],z=y*2048+x;
  if(labels[z]!==30)fail(w.id+' path silently uses non-mainland source');
  if(owners[z]!== (k===0?a:k===path.length-1?b:0))
   fail(w.id+' path traverses an existing other owner');
  if(!c1oPointInRing({x:x+.5,y:y+.5},contour))
   fail(w.id+' path leaves original mainland source contour');
  if(k>0&&Math.abs(path[k-1].x-x)+Math.abs(path[k-1].y-y)!==1)
   fail(w.id+' path has non-four-neighbor step');
 }
 if(path.length>1&&unassigned.length!==minGap(path))
  fail(w.id+' reserve gap accounting inconsistent');
 const median=unassigned.length?unassigned[Math.floor((unassigned.length-1)/2)]:null;
 const checkpoint=unassigned.length?[
  unassigned[Math.floor((unassigned.length-1)*.25)],
  unassigned[Math.floor((unassigned.length-1)*.5)],
  unassigned[Math.floor((unassigned.length-1)*.75)]
 ]:[]; // Three alternative waypoints, NOT a polygon or claim.
 const hash=path.length?createHash('sha256').update(
  path.map(q=>q.x+','+q.y).join(';')).digest('hex'):null;
 return {
  id:w.id,regionA:w.regionA,regionB:w.regionB,
  boundedWindow:w.bounds,
  sourceGridInventory:ownersCount,
  endpointsPresent:true,
  status:path.length?'STRICT_COMPONENT30_GAP_FOUND':'NO_STRICT_GAP_CONNECTION_IN_WINDOW',
  fourNeighborStrictMainlandOnly:true,
  originalAssignedRegionCellsTraversedOnlyAtEndpoints:true,
  actualUnassignedMainlandPixelsClaimed:0,
  shortestPixelSteps:path.length?path.length-1:null,
  minimumUnassignedIntermediateCells:path.length?unassigned.length:null,
  pathSha256:hash,
  endpointSamples:path.length?[path[0],path.at(-1)]:[],
  tentativeMidGapReviewPoint:median,
  alternateQuarterHalfThreeQuarterSourceCheckpoints:checkpoint,
  pathSamples:path,
  interpretation:'REFERENCE_GRID_SOURCE_GAP_ONLY_NOT_SOVEREIGN_LINE_OR_ROAD'
 };
}
export function validateC1YSpec(s,p,c1pReport){
 if(s?.schemaVersion!==1||
  s.type!=='kaelvar-c1y-independent-mainland-gap-and-seam-priority.v1'||
  s.status!=='READ_ONLY_ORIGINAL_COMPONENT30_MAINLAND_GAP_MEASUREMENT_CANONICAL_HELD'||
  s.parentC1XHead!=='9ed8209e48acb20b6fd834e7a95afeec27ec94db'||
  !eq(s.source,base.source)||
  !eq(s.acceptedC1P,base.acceptedC1P)||
  !eq(s.search,{
   fourNeighborOnly:true,allowedTransitTerrainComponent:30,
   transitMustBeUnassigned:true,
   endpointsMustHaveDifferentExistingC1POwners:true,
   neverTransitOtherAssignedRegion:true,
   neverIncludeUnresolvedInkOrOtherPhysicalComponents:true,
   excludeNortheasternHeadlandByFixedWindows:true,
   preserveDiscretionaryGaps:true,
   windows:base.windows
  })||
  !eq(s.reviewModes,['KEEP_UNASSIGNED_GAP','CONSIDER_WAYPOINT_SEAM_ONLY'])||
  !eq(s.hold,base.hold))
  fail('fixed source, bounded windows, no-allocation policy or C1-X parent drift');
 if(p?.sourceVectorBlob!==base.source.originalVectorBlob||
   p?.ownerReviewDirection?.kharuunFrontageOption!=='B'||
   !eq(p.ownerReviewDirection.kharuunSourceEdgeIndicesInclusive,[35,58])||
   p.ownerReviewDirection.northeastHeadlandOwnership!=='HELD'||
   p.holds?.canonicalWritable!==false||
   c1pReport?.status!=='C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD'||
   c1pReport.sourceVectorBlob!==base.source.originalVectorBlob||
   c1pReport.originalSourceEdgesConserved!==599||
   c1pReport.sourcePngFingerprintsVerified!==true||
   c1pReport.sourceOriginalContourUnmodified!==true||
   c1pReport.measurements?.candidateMainlandTerrainCells!==79419||
   c1pReport.measurements.previewAssignedMainlandTerrainCells!==52449||
   c1pReport.measurements.remainingUnassignedMainlandTerrainCells!==26970||
   !eq(c1pReport.measurements.perRegion.map(x=>x.terrainCandidateCells),
    [5632,18624,19182,9011])||
   c1pReport.measurements.detachedPhysicalComponentsClaimed!==0||
   c1pReport.diagnostic?.polygonOwnershipCollisions!==0||
   c1pReport.holds?.canonicalWritable!==false)
  fail('original C1-P accepted coastline/territory/region count changed');
 return true;
}
export function buildC1YMainlandGaps({spec,p,c1pReport,labels,ownership,revised}){
 validateC1YSpec(spec,p,c1pReport);
 if(labels?.length!==2048*1152||ownership?.length!==labels.length||
  revised?.originalContour?.length!==599||
  revised.regions?.length!==4||
  revised.protectedOffshore?.length!==3)
  fail('original source label mask and topology missing');
 const reviews=base.windows.map(w=>sampleWindow(w,labels,ownership,revised.originalContour));
 const candidatePriority=reviews.filter(x=>x.status==='STRICT_COMPONENT30_GAP_FOUND')
  .map(x=>({id:x.id,unassignedGapSamples:x.minimumUnassignedIntermediateCells,
   reviewPoint:x.tentativeMidGapReviewPoint}))
  .sort((a,b)=>a.unassignedGapSamples-b.unassignedGapSamples||
   a.id.localeCompare(b.id));
 return {
  status:'C1Y_STRICT_MAINLAND_GAP_WINDOWS_MEASURED_NO_OWNER_OR_PIXEL_ALLOCATION',
  sourceWitness:{
   originalVectorBlob:base.source.originalVectorBlob,
   originalSourceCoastEdges:599,
   biomeSha256:base.source.biomeSha256,elevationSha256:base.source.elevationSha256,
   originalMainlandComponent:30,
   headlandEdgesExcluded:[75,115]
  },
  reviewWindows:reviews,
  nextTechnicalInspectionPriority:candidatePriority,
  rankingIsNotPoliticalRecommendation:true,
  caution:'Paths are local minimum sample gaps and may fail climate, terrain, natural border, topology and cultural review. The ranking is not a mandate to fill deliberate unassigned regions.',
  frozenC1P:{
   originalMainlandCandidateCells:79419,
   originallyAssigned:52449,deliberatelyUnassigned:26970,
   perRegion:[5632,18624,19182,9011],
   originalSourceEdits:0,originalTerrainLabelEdits:0,
   originalRegionRingEdits:0,newTerritorialCells:0,
   originalDetachedPhysicalComponentClaims:0,
   kharuunOptionBOriginalCoastEdges:[35,58],
   southeasternVerdantPeninsulaPreserved:true,
   northeasternHeadlandRemainsUnassigned:true,
   component51StillSeparate:true,
   shattercapAndLargeNortheastIslandUnassigned:true,
   canonicalWritable:false
  }
 };
}
