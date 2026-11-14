/**
 * C1-J original vector coastline witnesses. Pixels/vector proximity are
 * uncertain observations, never coastline certification or sovereignty.
 */
import {assertCoordinatePoint,FIRST_WORLD_REFERENCE} from './world-coordinate-geometry.mjs';
const hold=s=>{throw Error('C1-J vector coastline HOLD: '+s);};
const names=['kaelvar_northwest_vector_sector',
  'kaelvar_northcentral_vector_sector','kaelvar_northeast_vector_sector'];
const boxes=[[70,120,280,235],[280,120,420,235],[420,185,540,315]];
const held=[['feature.coastline.first_world.part_7',28],
  ['feature.coastline.first_world.part_8',134],
  ['feature.coastline.first_world.part_31',312]];
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&
  new Set(a).size===a.length&&a.every(x=>b.includes(x));
const box=(p)=>({
  minX:Math.min(...p.map(q=>q.x)),minY:Math.min(...p.map(q=>q.y)),
  maxX:Math.max(...p.map(q=>q.x)),maxY:Math.max(...p.map(q=>q.y)),
});
const bboxIs=(b,values)=>b&&
  b.minX===values[0]&&b.minY===values[1]&&
  b.maxX===values[2]&&b.maxY===values[3];
export function validateC1JContract(c,c1,c1f,c1g){
  const paths={
    c1:'docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json',
    c1f:'docs/design/kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json',
    c1g:'docs/design/kaelvar-c1g-coastline-salt-basin-evidence-2026-11-13.json',
  };
  if(c?.schemaVersion!==1||
    c.type!=='kaelvar-c1j-original-vector-coastline-review.v1'||
    c.status!=='C1J_ORIGINAL_SOURCE_CONTOURS_NO_GEOGRAPHY_APPROVED'||
    c.mapId!==FIRST_WORLD_REFERENCE.mapId||
    c.coordinateSpaceId!==FIRST_WORLD_REFERENCE.coordinateSpaceId||
    c.sourceGeometryPath!=='packages/content/base/world/world_map_features.json'||
    c.originalCoastlineCount!==68||c.originalRiverCount!==8||
    !same(c.sharedOceanRegionIds,['region.azure_vast'])||
    Object.entries(paths).some(([k,v])=>c.sourcePaths?.[k]!==v)||
    c1?.sourceWitness?.originalGeometryPath!==c.sourceGeometryPath||
    c1.coordinateSpace?.widthPixels!==2048||
    c1.coordinateSpace?.heightPixels!==1152||
    c1f?.status!=='SOURCE_ALIGNED_CANDIDATE_ONLY_NO_APPROVED_BORDERS'||
    c1g?.status!=='NONCANONICAL_ECOLOGICAL_BOUNDARY_REVIEW_HELD')
    hold('source, map scale or review-hierarchy mismatch');
  if(c.mainlandSource?.id!=='feature.coastline.first_world.part_10'||
    c.mainlandSource.vertices!==599||
    !bboxIs(c.mainlandSource.bounds,[64,130,538,482])||
    c.mainlandSource.physicalComponentId!==null||
    c.mainlandSource.ownerRegionId!==null||
    c.mainlandSource.canonicalGeometryRef!==null)
    hold('source mainland was published or changed');
  if(!Array.isArray(c.northSectorWindows)||c.northSectorWindows.length!==3)
    hold('missing north sector windows');
  for(let i=0;i<3;i++){
    const s=c.northSectorWindows[i],target=i===2?null:'region.veyrholm_shore';
    if(s?.id!==names[i]||!bboxIs(s.bbox,boxes[i])||
      s.targetRegionId!==target||
      s.status!==(i===2?'COMPETING_SHORE_FRONTAGE_REVIEW_ONLY':'SOURCE_EDGE_REVIEW_ONLY')||
      s.approvedGeometryRef!==null||
      (i===2&&!same(s.possibleRegions,
        ['region.veyrholm_shore','region.kharuun_drylands'])))
      hold('north sector was moved or approved');
  }
  if(!Array.isArray(c.protectedOffshoreContours)||
    c.protectedOffshoreContours.length!==held.length)
    hold('held source contours are missing');
  for(let i=0;i<held.length;i++){
    const x=c.protectedOffshoreContours[i];
    if(x?.id!==held[i][0]||x.expectedVertices!==held[i][1]||
      x.physicalComponentId!==null||x.ownerRegionId!==null)
      hold('held island gained physical or political ownership');
  }
  if(c.separatelyAuthoredRiver?.id!=='feature.river_thalos_run'||
    c.separatelyAuthoredRiver.vertices!==5||
    !same(c.separatelyAuthoredRiver.regionIds,
      ['region.kaelvar','region.verdant_thalos'])||
    c.separatelyAuthoredRiver.hydrologyApproved!==false)
    hold('river source conflated with coastline or validated hydrology');
  if(c.distinguishLegacyCoast40FromVectorPart40!==true||
    c.retainWindwardParent!=='region.serathyl'||
    c.oldWindwardReassignmentAllowed!==false||
    c.noIslandOwnership!==true||c.noImplicitSnapToInkOrOcean!==true||
    c.regionBorderApproved!==false||
    c.northernShoreContinuityApproved!==false||
    c.kharuunSeaAccessApproved!==false||
    c.closedSaltBasinsApproved!==false||
    c.riverCoursesCalibrated!==false||c.sourceOceanCertified!==false||
    !Array.isArray(c.approvedGeometryRefs)||c.approvedGeometryRefs.length!==0||
    c.ownerApprovalRef!==null||c.canonicalWritable!==false)
    hold('coast, river, island or source-ink approval changed');
  return {status:'C1J_CONTRACT_VALID_COAST_SEMANTICS_HELD',
    northernReviewSectors:3,offshoreContourHolds:3,
    canonicalWritable:false};
}
const checkPolyline=(line,n)=>{
  if(!line||line.points?.length!==n||
    !same(line.regionIds,['region.azure_vast']))
    hold('original coastline identity/vertex count/ocean association drift');
  for(const p of line.points)assertCoordinatePoint(p);
  return line;
};
export function selectC1JOriginalVectorEdges(source,c){
  if(source?.coastlines?.length!==68||source?.riverFeatures?.length!==8||
    new Set(source.coastlines.map(x=>x.id)).size!==68)
    hold('original coastline or river inventory drift');
  const find=id=>source.coastlines.find(x=>x.id===id);
  const main=checkPolyline(find(c.mainlandSource.id),599);
  const b=box(main.points);
  if(!bboxIs(b,[64,130,538,482]))hold('original mainland contour bounding box drift');
  const edgeSectors=c.northSectorWindows.map(()=>[]);
  const other=[];
  for(let i=0;i<599;i++){
    const a=main.points[i],z=main.points[(i+1)%599];
    if(a.x===z.x&&a.y===z.y)hold('zero length contour segment');
    const x=(a.x+z.x)/2,y=(a.y+z.y)/2;
    const k=c.northSectorWindows.findIndex(s=>x>=s.bbox.minX&&
      x<s.bbox.maxX&&y>=s.bbox.minY&&y<s.bbox.maxY);
    const edge={sourceEdgeIndex:i,a,b:z};
    (k<0?other:edgeSectors[k]).push(edge);
  }
  const counts=edgeSectors.map(x=>x.length);
  if(counts.join(',')!=='90,106,114'||other.length!==289||
    counts.reduce((a,b)=>a+b,other.length)!==599)
    hold('source coastline sector accounting drift');
  const offshore=held.map(([id,n])=>checkPolyline(find(id),n));
  const river=source.riverFeatures.find(x=>
    x.id===c.separatelyAuthoredRiver.id);
  if(river?.points?.length!==5||!same(river.regionIds,
    ['region.kaelvar','region.verdant_thalos']))
    hold('separately-authored river source drift');
  for(const p of river.points)assertCoordinatePoint(p);
  return {main,edgeSectors,unreviewedEdges:other,offshore,river,
    report:{
      sourceMainlandContourId:main.id,
      originalVectorPoints:main.points.length,
      originalVectorEdges:599,
      northernSectorSourceEdgeCounts:counts,
      otherSourceEdges:other.length,
      originalSourceEdgesAccounted:599,
      sourceOceanAssociationDoesNotSetPoliticalParent:true,
      islandContoursNotAssigned:offshore.map(x=>x.id),
      separateRiverSourceId:river.id,
      publishedRegionBorders:0,
    }};
}
/**
 * Report nearest terrain-only component to each original source vertex.
 * Multiple component IDs at a tied nearest radius are ambiguous, not
 * evidence of a real-world island, shoreline, or sovereign parent.
 */
export function sampleContourTerrainProximity(points,labels,{
  width=2048,height=1152,radius=3,
}={}){
  if(!Array.isArray(points)||!points.length||
    labels?.length!==width*height||width!==2048||height!==1152||
    !Number.isInteger(radius)||radius<0||radius>8)
    hold('invalid contour-component proximity request');
  let ambiguous=0,unresolved=0;
  const ids=new Map(),hist=Array(radius+1).fill(0);
  for(const p of points){
    assertCoordinatePoint(p);
    const px=Math.round(p.x),py=Math.round(p.y);
    let near=[],distance=-1;
    for(let r=0;r<=radius;r++){
      const found=new Set();
      for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
        if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
        const x=px+dx,y=py+dy;
        if(x<0||y<0||x>=width||y>=height)continue;
        const value=labels[y*width+x];
        if(value)found.add(value);
      }
      if(found.size){near=[...found];distance=r;break;}
    }
    if(near.length===1){
      ids.set(near[0],(ids.get(near[0])??0)+1);hist[distance]++;
    }else if(near.length>1)ambiguous++;
    else unresolved++;
  }
  return {
    sourceVertices:points.length,maximumProbePixels:radius,
    uniqueNearestSamples:[...ids.values()].reduce((a,b)=>a+b,0),
    ambiguousNearestSamples:ambiguous,unresolvedSamples:unresolved,
    uniqueNearestDistanceHistogram:hist,
    nearestSourceTerrainComponentCandidates:[...ids]
      .map(([componentId,uniqueNearestSamples])=>({componentId,uniqueNearestSamples}))
      .sort((a,b)=>b.uniqueNearestSamples-a.uniqueNearestSamples||
        a.componentId-b.componentId).slice(0,12),
    certifiesPhysicalComponent:false,certifiesCoastline:false,
    assignsPoliticalRegion:false,
  };
}
