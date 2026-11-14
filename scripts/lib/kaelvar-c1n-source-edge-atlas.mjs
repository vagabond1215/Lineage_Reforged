/**
 * C1-N source edge index atlas. All positions are exact original vectors.
 * It proposes neither Kharuun/Veyrholm sovereignty nor a harbor site.
 */
import {FIRST_WORLD_REFERENCE,assertCoordinatePoint}
 from './world-coordinate-geometry.mjs';
import {groupCyclicSourceArcStatuses}
 from './kaelvar-c1l-landmass-source-arc-review.mjs';

const hold=s=>{throw Error('C1-N indexed coast HOLD: '+s);};
const names=[
 'NW_ORIGINAL_SOURCE_REVIEW','NORTHCENTRAL_ORIGINAL_SOURCE_REVIEW',
 'NORTHEAST_ORIGINAL_SOURCE_REVIEW','OTHER_SOURCE_EDGES_HELD',
];
const windows=[
 ['entire_mainland','1. Entire source mainland and held islands',[40,90,620,480],40],
 ['north_coast','2. Northern source coast: indexed',[60,105,495,230],10],
 ['northeast_zoom','3. Northeastern frontage: index detail',[310,150,245,205],5],
];
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&
 a.every((x,i)=>x===b[i]);
const empty=a=>Array.isArray(a)&&a.length===0;
export function validateC1NAtlasContract(n,j,l,m){
 if(n?.schemaVersion!==1||
   n.type!=='kaelvar-c1n-original-northern-source-edge-atlas.v1'||
   n.status!=='OWNER_READY_INDEXED_SOURCE_COAST_ATLAS_NO_FRONTAGE_PUBLISHED'||
   n.mapId!==FIRST_WORLD_REFERENCE.mapId||
   n.coordinateSpaceId!==FIRST_WORLD_REFERENCE.coordinateSpaceId||
   n.sourceMainlandContourId!=='feature.coastline.first_world.part_10'||
   n.sourceCoastEdgeCount!==599||
   !same(n.sectorEdgeCounts,[90,106,114,289])||
   !same(n.sectorNames,names)||
   n.sourceDrawingOnly!==true||
   n.sourcePaths?.c1j!=='docs/design/kaelvar-c1j-coastline-sector-review-2026-11-13.json'||
   n.sourcePaths?.c1l!=='docs/design/kaelvar-c1l-landmass-coast-arc-adjudication-2026-11-14.json'||
   n.sourcePaths?.c1m!=='docs/design/kaelvar-c1m-owner-shore-correction-2026-11-14.json'||
   j?.mainlandSource?.id!==n.sourceMainlandContourId||
   j.mainlandSource.vertices!==599||
   l?.mainlandSourceContourId!==n.sourceMainlandContourId||
   m?.ownerVisualDecision?.kharuunHasShortNorthernCoastAtDesignLevel!==true||
   m.ownerVisualDecision?.oldVeyrholmCorridorIsAcceptedBoundary!==false)
   hold('unregistered source, predecessor or atlas format');
 const cross=n.northCentralCyclicRun;
 if(cross?.sourceIndexStart!==553||cross.sourceIndexEnd!==59||
   cross.wrapsZero!==true||cross.count!==106||
   !Array.isArray(n.northeasternSourceRuns)||
   n.northeasternSourceRuns.length!==2||
   n.northeasternSourceRuns[0]?.startEdgeIndex!==60||
   n.northeasternSourceRuns[0]?.endEdgeIndex!==149||
   n.northeasternSourceRuns[0]?.count!==90||
   n.northeasternSourceRuns[1]?.startEdgeIndex!==154||
   n.northeasternSourceRuns[1]?.endEdgeIndex!==177||
   n.northeasternSourceRuns[1]?.count!==24)
   hold('indexed source-contour segment specification drift');
 if(!Array.isArray(n.previewPanels)||n.previewPanels.length!==3||
   n.previewPanels.some((p,i)=>p.id!==windows[i][0]||
     p.label!==windows[i][1]||
     !same(p.viewBox,windows[i][2])||
     p.everyNthVertex!==windows[i][3]))
   hold('atlas zoom or sampling window changed');
 const o=n.ownerDesign,p=n.protected,a=n.approval;
 if(o?.kharuunHasShortNorthernCoast!==true||
   o.falseVeyrholmCorridorRejected!==true||
   o.coastKharuunSourceEdgeIndices!==null||
   o.coastVeyrholmSourceEdgeIndices!==null||
   o.kharuunVeyrholmInlandBoundaryGeometryRef!==null||
   o.kharuunCoastPortLocation!==null||
   !empty(o.supportedWholeIslandClaims)||
   o.oldSourceContoursRemainUnmodified!==true||
   p?.mainlandTerrainCandidates!==79419||
   p.unassignedMainlandTerrainCandidates!==26795||
   p.detachedPhysicalCandidates!==18||
   p.northeastLargeIslandWholeAndUnclaimed!==true||
   p.coast40DisputeHeld!==true||
   p.foreignWindwardParent!=='region.serathyl'||
   p.saltBasinsPlaced!==0||
   a?.ownerIndexSelectionRef!==null||
   a.sourceCoastCertified!==false||
   a.sourceCoastPoliticalOwnershipApproved!==false||
   a.regionPolygonsApproved!==false||
   a.maritimeRouteApproved!==false||
   a.portApproved!==false||
   a.canonicalWritable!==false)
   hold('coastal ownership or existing world protection prematurely changed');
 return {
  status:'C1N_INDEX_ATLAS_CONTRACT_VALID_NO_GEOGRAPHY_APPROVED',
  originalSourceEdgeCount:599,reviewPanels:3,canonicalWritable:false,
 };
}
/** Returns a lossless edge index crosswalk and source-native zoom markers. */
export function buildC1NSourceEdgeAtlas(selected,n){
 if(selected?.main?.id!==n.sourceMainlandContourId||
   selected.main.points?.length!==599||
   selected.report?.originalSourceEdgesAccounted!==599||
   selected.edgeSectors?.length!==3||
   !same(selected.edgeSectors.map(x=>x.length),[90,106,114])||
   selected.unreviewedEdges?.length!==289||
   selected.offshore?.length!==3)
   hold('original source coastline inventory incomplete');
 const points=selected.main.points;
 const edges=Array(599).fill(null);
 const tags=Array(599).fill(null);
 const groups=[...selected.edgeSectors,selected.unreviewedEdges];
 for(let g=0;g<groups.length;g++){
   for(const edge of groups[g]){
     const i=edge?.sourceEdgeIndex;
     if(!Number.isInteger(i)||i<0||i>=599||edges[i]!==null)
       hold('duplicate or out-of-range source-edge index');
     const a=points[i],b=points[(i+1)%599];
     if(edge.a?.x!==a.x||edge.a?.y!==a.y||
       edge.b?.x!==b.x||edge.b?.y!==b.y)
       hold('original coastal source vertex was replaced');
     assertCoordinatePoint(a);assertCoordinatePoint(b);
     edges[i]={
       sourceEdgeIndex:i,originalVertexA:a,originalVertexB:b,
       sourceSector:names[g],politicalOwnerRegionId:null,
       approvedCoastalGeometryRef:null,
     };
     tags[i]=names[g];
   }
 }
 if(edges.some(x=>!x)||tags.some(x=>!x))
   hold('source coastline missing edge identity');
 const cyclicRuns=groupCyclicSourceArcStatuses(tags);
 const center=cyclicRuns.filter(x=>x.status===names[1]);
 if(center.length!==1||center[0].startEdgeIndex!==553||
   center[0].endEdgeIndex!==59||center[0].count!==106||
   !center[0].wrapsZero)
   hold('north-central original contour wrap has drifted');
 const ne=cyclicRuns.filter(x=>x.status===names[2]);
 if(ne.length!==2||
   ne[0].startEdgeIndex!==60||ne[0].endEdgeIndex!==149||
   ne[0].count!==90||
   ne[1].startEdgeIndex!==154||ne[1].endEdgeIndex!==177||
   ne[1].count!==24)
   hold('northeast source edge runs have drifted');
 const counts=names.map(name=>tags.filter(s=>s===name).length);
 if(!same(counts,[90,106,114,289])||
   new Set(cyclicRuns.flatMap(x=>x.sourceEdgeIndices)).size!==599)
   hold('coast source edge accounting failed');
 const labelMarkers=n.previewPanels.map(p=>({
   panelId:p.id,viewBox:p.viewBox,
   originalVertexLabels:points.map((pt,i)=>({
     originalSourceEdgeIndex:i,x:pt.x,y:pt.y,
   })).filter(x=>x.originalSourceEdgeIndex%p.everyNthVertex===0||
     x.originalSourceEdgeIndex===598).filter(x=>
       x.x>=p.viewBox[0]&&x.x<=p.viewBox[0]+p.viewBox[2]&&
       x.y>=p.viewBox[1]&&x.y<=p.viewBox[1]+p.viewBox[3]),
 }));
 return {
   sourceContourId:selected.main.id,
   sourcePointCount:points.length,
   originalEdgesAccounted:edges.length,
   originalEdgeCoordinates:edges,
   countsBySourceInspectionSector:Object.fromEntries(names.map((k,i)=>[k,counts[i]])),
   cyclicInspectionRuns:cyclicRuns,
   labelMarkers,
   preservedOriginalClosingEdge:edges[598].originalVertexB.x===points[0].x&&
     edges[598].originalVertexB.y===points[0].y,
   allegedKharuunPoliticalSourceEdges:0,
   allegedVeyrholmPoliticalSourceEdges:0,
   actualPortCoordinates:null,
   ownerExactFrontageApprovalRequired:true,
   canonicalWritable:false,
 };
}
