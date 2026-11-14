/**
 * C1-U: exact-source index, reversible NE headland geometry feasibility.
 * Local enclosure polygons are inspection windows, NOT political regions.
 * No source, raster label, existing region ring or island is mutated.
 */
import {validateCoordinatePolygon} from './world-coordinate-geometry.mjs';
import {c1oSourceVertexArc,c1oPointInRing}
 from './kaelvar-c1o-regional-boundaries.mjs';

const hold=s=>{throw Error('C1-U source-feasibility HOLD: '+s);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const SOURCE='9cd6752e9dbca00796e5f7c013066bb0e5a96175';
const B='9828eb8970dc0aa7ec1f046f51ee0542ab11c2fe7776eeaa52605d42f00cff12';
const E='02c3b133f2b3f08aed56f98bde4c846d6e3316c71de171837cb61a02785ec56d';
const C1T='eee96eeef6554eee148b6a7b6fb1bdf153d52f8e';
const ROWS=[
 {id:'DIRECT_CHORD_DIAGNOSTIC',sourceArc:[75,116],
  returnWaypoints:[],expectedSourceCrossings:1,
  expectedVerdict:'REJECT_SOURCE_COAST_CROSSING'},
 {id:'INSET_RETURN_CANDIDATE',sourceArc:[75,116],
  returnWaypoints:[[500,226],[477,225]],expectedSourceCrossings:0,
  expectedRawSampledRingPixels:1709,expectedOriginalContourEscapeSamples:0,
  expectedVerdict:'GEOMETRIC_REVIEW_ONLY'},
 {id:'COMPACT_RETURN_CANDIDATE',sourceArc:[75,116],
  returnWaypoints:[[503,220],[479,220]],expectedSourceCrossings:0,
  expectedRawSampledRingPixels:1482,expectedOriginalContourEscapeSamples:0,
  expectedVerdict:'GEOMETRIC_REVIEW_ONLY'}
];
const HARD={
 canonicalWritable:false,noRegionGeometryChange:true,
 noExistingC1PRingsChange:true,noOriginalVectorChange:true,
 noOriginalSourcePngChanges:true,noOriginalTerrainCandidateReclassification:true,
 noHeadlandPoliticalOwnership:true,noShattercapRegionPolygon:true,
 noDetachedIslandClaims:true,noLargeNortheastIslandClaim:true,
 noCoast40Claim:true,serathylWindwardParent:'region.serathyl',
 noPortsWellsRiversRoutesSaltBasins:true,newLegacyHexDependencies:0
};
export function validateC1USpec(s,p,report){
 if(s?.schemaVersion!==1||
  s.type!=='kaelvar-c1u-original-coastline-headland-review-enclosures.v1'||
  s.status!=='GEOMETRY_FEASIBILITY_ONLY_NO_POLITICAL_REGION_PUBLICATION'||
  s.parentC1THead!==C1T||
  !eq(s.source,{blob:SOURCE,
   originalMainlandContourId:'feature.coastline.first_world.part_10',
   vertices:599,headlandSourceVerticesInclusive:[75,116],
   headlandSourceEdgesInclusive:[75,115],
   originalBiomeSha256:B,originalElevationSha256:E})||
  !eq(s.reviewOnlyEnclosures,ROWS)||
  !eq(s.fullVerdantShortcut,{
   id:'NAIVE_COAST_ARC_75_TO_349_WITH_C1P_VERDANT_RETURN',
   sourceArc:[75,349],
   useUnchangedC1PVerdantInlandWaypoints:true,
   expectedOriginalCoastProperCrossings:1,
   mustBeRejectedForRegionalOverlapWith:'region.kharuun_drylands',
   status:'DIAGNOSTIC_ONLY_REJECT_NOT_A_PUBLISHED_POLYGON'})||
  !eq(s.baseline,{
   candidateMainlandTerrainCells:79419,
   assignedByFourC1PRegions:52449,deliberatelyUnassigned:26970,
   originalRegionCells:[5632,18624,19182,9011],
   kharuunOriginalCoastEdges:[35,58],
   verdantSoutheasternPeninsulaProtectedAnchors:3,
   headlandSourceArcPoliticalOwner:null,detachedOriginalTerrainComponentClaims:0})||
  !eq(s.holds,HARD))
  hold('frozen C1-T source, review options, political holds or C1-P baseline changed');
 if(p?.ownerReviewDirection?.kharuunFrontageOption!=='B'||
  !eq(p.ownerReviewDirection.kharuunSourceEdgeIndicesInclusive,[35,58])||
  p.holds?.canonicalWritable!==false||
  report?.status!=='C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD'||
  report.sourceVectorBlob!==SOURCE||report.originalSourceEdgesConserved!==599||
  report.sourcePngFingerprintsVerified!==true||
  report.sourceOriginalContourUnmodified!==true||
  report.measurements?.candidateMainlandTerrainCells!==79419||
  report.measurements.previewAssignedMainlandTerrainCells!==52449||
  report.measurements.remainingUnassignedMainlandTerrainCells!==26970||
  !eq(report.measurements.perRegion.map(x=>x.terrainCandidateCells),
   [5632,18624,19182,9011])||
  report.measurements.detachedPhysicalComponentsClaimed!==0||
  report.holds?.canonicalWritable!==false)
  hold('parent C1-P region/source/accounting guard failed');
 return true;
}
const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
const eps=1e-9;
function properCross(a,b,c,d){
 const x=cross(a,b,c),y=cross(a,b,d),z=cross(c,d,a),w=cross(c,d,b);
 return ((x>eps&&y< -eps)||(x< -eps&&y>eps))&&
  ((z>eps&&w< -eps)||(z< -eps&&w>eps));
}
function returnCrossings(ring,coastCount,source){
 let out=0,examples=[];
 for(let i=coastCount-1;i<ring.length;i++){
  const a=ring[i],b=ring[(i+1)%ring.length];
  for(let j=0;j<source.length;j++){
   const c=source[j],d=source[(j+1)%source.length];
   if(properCross(a,b,c,d)){
    out++;if(examples.length<8)examples.push({returnSegmentIndex:i,sourceEdgeIndex:j});
   }
  }
 }
 return {properCrossings:out,examples};
}
function sourceArcPoints(source,start,end){
 const a=c1oSourceVertexArc(source,start,end);
 if(a.sourceEdgeIndices.length!==((end-start+599)%599))
  hold('source coastline index conservation failed');
 return a;
}
function validateRingGeometry(ring){
 try{validateCoordinatePolygon({outer:ring});return {valid:true,error:null};}
 catch(e){return {valid:false,error:String(e.message).slice(0,180)};}
}
function sampleRing(ring,source,labels,ownership){
 const x0=Math.floor(Math.min(...ring.map(p=>p.x))),
  x1=Math.ceil(Math.max(...ring.map(p=>p.x))),
  y0=Math.floor(Math.min(...ring.map(p=>p.y))),
  y1=Math.ceil(Math.max(...ring.map(p=>p.y)));
 const out={
  rawSourceReferencePixels:0,outsideOriginalContourPixels:0,
  originalMainlandCandidatePixels:0,
  originalUnassignedMainlandCandidatePixels:0,
  originalProvisionalRegionPixelCount:0,
  otherOriginalPhysicalComponentPixels:0,
  otherOriginalPhysicalComponentsById:{},
  otherOriginalPhysicalComponentExamples:[],
  excludedOrUnregisteredSourcePixelCount:0,
  provisionalRegionContactCounts:{auric:0,kharuun:0,verdant:0,veyrholm:0}
 };
 const keys=['auric','kharuun','verdant','veyrholm'];
 for(let y=Math.max(0,y0);y<Math.min(1152,y1);y++)
  for(let x=Math.max(0,x0);x<Math.min(2048,x1);x++){
   const pt={x:x+.5,y:y+.5};
   if(!c1oPointInRing(pt,ring))continue;
   out.rawSourceReferencePixels++;
   if(!c1oPointInRing(pt,source)){out.outsideOriginalContourPixels++;continue;}
   const id=y*2048+x,cls=labels[id],owner=ownership[id];
   if(cls===30){
    out.originalMainlandCandidatePixels++;
    if(owner===0)out.originalUnassignedMainlandCandidatePixels++;
   }else if(cls>0){
    out.otherOriginalPhysicalComponentPixels++;
    out.otherOriginalPhysicalComponentsById[cls]=
     (out.otherOriginalPhysicalComponentsById[cls]||0)+1;
    if(out.otherOriginalPhysicalComponentExamples.length<24)
     out.otherOriginalPhysicalComponentExamples.push({x,y,component:cls});
   }else out.excludedOrUnregisteredSourcePixelCount++;
   if(owner){
    out.originalProvisionalRegionPixelCount++;
    if(owner<1||owner>4)hold('unexpected candidate owner code');
    out.provisionalRegionContactCounts[keys[owner-1]]++;
   }
  }
 return out;
}
function intersectsProtectedSource(ring,offshore){
 let proper=0,pointsEnclosed=0;
 for(const island of offshore){
  for(let k=0;k<island.points.length;k++){
   const a=island.points[k],b=island.points[(k+1)%island.points.length];
   if(c1oPointInRing(a,ring))pointsEnclosed++;
   for(let j=0;j<ring.length;j++)
    if(properCross(a,b,ring[j],ring[(j+1)%ring.length]))proper++;
  }
 }
 return {properIntersections:proper,sourceContourVerticesEnclosed:pointsEnclosed};
}
export function buildC1UFeasibility({spec,p,report,revised,labels,ownership,selected}){
 validateC1USpec(spec,p,report);
 const source=revised?.originalContour;
 if(source?.length!==599||!eq(source,selected?.main?.points)||
  revised.regions?.length!==4||revised.protectedOffshore?.length!==3||
  labels?.length!==2048*1152||ownership?.length!==labels.length)
  hold('source vector, terrain masks or original protected contours unavailable');
 const arc=sourceArcPoints(source,75,116);
 if(!eq(arc.vertices[0],{x:460,y:224})||
  !eq(arc.vertices.at(-1),{x:514,y:232})||
  arc.sourceEdgeIndices[0]!==75||arc.sourceEdgeIndices.at(-1)!==115||
  arc.sourceEdgeIndices.length!==41)
  hold('headland source vertices 75 and 116 or 41 coastline edges changed');
 const reviews=spec.reviewOnlyEnclosures.map(c=>{
  const a=sourceArcPoints(source,...c.sourceArc);
  const ring=[...a.vertices,...c.returnWaypoints.map(([x,y])=>({x,y}))];
  const validity=validateRingGeometry(ring);
  const sourceCheck=returnCrossings(ring,a.vertices.length,source);
  const spatial=sampleRing(ring,source,labels,ownership);
  const protectedReview=intersectsProtectedSource(ring,revised.protectedOffshore);
  if(sourceCheck.properCrossings!==c.expectedSourceCrossings)
   hold(c.id+' changed original source-coast crossing count');
  if(c.expectedRawSampledRingPixels!==undefined&&
   spatial.rawSourceReferencePixels!==c.expectedRawSampledRingPixels)
   hold(c.id+' changed exact source pixel-center samples');
  if(c.expectedOriginalContourEscapeSamples!==undefined&&
   spatial.outsideOriginalContourPixels!==c.expectedOriginalContourEscapeSamples)
   hold(c.id+' outside source contour drift');
  if(c.id!=='DIRECT_CHORD_DIAGNOSTIC'&&
   spatial.otherOriginalPhysicalComponentPixels!==13)
   hold(c.id+' physical-component contamination witness changed');
  if(c.id!=='DIRECT_CHORD_DIAGNOSTIC'&&(
   !validity.valid||sourceCheck.properCrossings!==0||
   protectedReview.properIntersections!==0||
   protectedReview.sourceContourVerticesEnclosed!==0||
   spatial.outsideOriginalContourPixels!==0||
   spatial.originalProvisionalRegionPixelCount!==0))
   hold(c.id+' source-safe geometric review gate failed');
  if(c.id==='DIRECT_CHORD_DIAGNOSTIC'&&sourceCheck.properCrossings!==1)
   hold('unsafe direct chord was silently accepted');
  return {id:c.id,status:c.expectedVerdict,
   politicalOwner:null,sourceArcOriginalEdges:a.sourceEdgeIndices,
   candidateReturnWaypoints:c.returnWaypoints,
   ringOriginalSourceFrame:ring,ringValidity:validity,
   sourceCoastReturnCrossings:sourceCheck,
   sample:spatial,protectedOffshore:protectedReview,
   physicalComponentHold:spatial.otherOriginalPhysicalComponentPixels>0,
   originalOtherComponentCellsNotClaimed:true,
   acceptedAsActiveRegion:false,canonicalWritable:false};
 });
 const verdant=revised.regions[2];
 const ext=sourceArcPoints(source,75,349);
 const shortcut=[...ext.vertices,...verdant.hypothesizedInlandWaypoints];
 const validity=validateRingGeometry(shortcut);
 const crossings=returnCrossings(shortcut,ext.vertices.length,source);
 const samples=sampleRing(shortcut,source,labels,ownership);
 if(crossings.properCrossings!==1||
   samples.provisionalRegionContactCounts.kharuun<=0)
  hold('rejected full Verdant shortcut no longer conflicts with source or Kharuun');
 const result={
  status:'C1U_SOURCE_ARC_REVIEW_ENCLOSURES_PASSED_NO_TERRITORIAL_APPROVAL',
  sourceWitness:{vectorBlob:SOURCE,originalSourceEdgeCount:599,
   heldHeadlandEdges:[75,115],sourceEndpointVertices:[arc.vertices[0],arc.vertices.at(-1)]},
  reviewEnclosures:reviews,
  naiveFullVerdantShortcut:{
   id:spec.fullVerdantShortcut.id,
   hasWellFormedRing:validity.valid,ringValidity:validity,
   originalCoastProperCrossings:crossings.properCrossings,
   sourceCoastCrossingExamples:crossings.examples,
   ownerCollisionSampleCounts:samples.provisionalRegionContactCounts,
   rawSourceReferencePixelSamples:samples.rawSourceReferencePixels,
   acceptedForPublication:false,
   rejectionReasons:['RETURN_CROSSES_ORIGINAL_SOURCE_COAST',
    'OVERLAPS_KHARUUN_PROVISIONAL_REGION']
  },
  preservedC1P:{
   candidateMainlandCells:79419,assigned:52449,unassigned:26970,
   perRegion:[5632,18624,19182,9011],newRegionCells:0,
   originalSourceCoastChanges:0,originalTerrainLabelChanges:0,
   detachedComponentClaims:0,canonicalWritable:false},
  holds:{headlandUnassigned:true,
   detachedShattercapAndLargeNortheastIslandHeld:true,
   originalC1PPolygonsUnchanged:true,
   geometricEnclosureDoesNotProveConnectionToVerdant:true,
   inkSeaLandWaterNotCertified:true,
   activeRegionPublicationAllowed:false}
 };
 return result;
}
