/**
 * C1-Q source-pair candidate terrain continuity probe. A route through
 * component 30 is not a walkable road, sovereign border or certified biome.
 * No region geometry, source vectors or persistent world content are written.
 */
import {createHash} from 'node:crypto';
import {c1oPointInRing} from './kaelvar-c1o-regional-boundaries.mjs';

const fail=s=>{throw Error('C1-Q native HOLD: '+s);};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const ids=['region.auric_marches','region.kharuun_drylands',
 'region.verdant_thalos','region.veyrholm_shore'];
const expectedCounts=[5632,18624,19182,9011];
const opts=['HOLD_UNASSIGNED','VERDANT_CORRIDOR_EVIDENCE_ONLY'];

export function validateC1QContract(c,p,r){
 if(c?.schemaVersion!==1||
  c.type!=='kaelvar-c1q-ne-mainland-headland-source-corridor-options.v1'||
  c.status!=='OWNER_COMPARE_SOURCE_CONNECTED_VS_UNASSIGNED_CANONICAL_HELD'||
  c.sourceC1PHead!=='a19fb209624b99a4803ccb8d4c6015f484b83340'||
  c.c1pCandidatePath!=='docs/design/kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json'||
  c.c1oSourceVectorBlob!=='9cd6752e9dbca00796e5f7c013066bb0e5a96175'||
  !eq(c.c1pBaselineTerrain,{mainlandCandidateCells:79419,
     assigned:52449,unassigned:26970}))
  fail('C1-P accepted source or evidence baseline changed');
 const head=c.headlandSource;
 if(head?.contourId!=='feature.coastline.first_world.part_10'||
  head.startEdge!==75||head.endEdgeInclusive!==115||
  head.startVertex!==75||head.endVertex!==116||
  head.edgeCount!==41||head.detached!==false)
  fail('original headland source edges or attachment drifted');
 const d=c.corridorTest,b=d?.allowedWindowInclusive;
 if(d?.width!==2048||d.height!==1152||
  !eq(d.fromVerdant,{x:390,y:336})||
  !eq(d.toHeadland,{x:492,y:215})||
  !eq(b,{minX:375,maxX:540,minY:190,maxY:350})||
  !eq(d.forbiddenCurrentOwners,ids.filter(x=>x!=='region.verdant_thalos'))||
  d.permittedCurrentOwner!=='region.verdant_thalos'||
  d.terrainComponentId!==30||d.sampleConnectivity!==4||
  !eq(d.clearanceChecksPx,[0,1,2])||
  d.requireOriginalSourceContour!==true||
  d.interpretation!=='SOURCE_TERRAIN_CANDIDATE_CONNECTIVITY_NOT_A_WALKABLE_ROUTE_OR_POLITICAL_BOUNDARY')
  fail('source-bounded corridor test authority changed');
 if(!eq(c.comparisonOptions?.map(x=>x.id),opts)||
  c.comparisonOptions.some(x=>x.politicalOwnershipApproved!==false||
    x.canonicalWritable!==false))
  fail('unapproved headland ownership option promoted');
 const h=c.immutableHolds;
 if(h?.original599EdgeContourUntouched!==true||
  !eq(h.kharuunOptionBEdges,[35,58])||
  h.revisedFourC1PRingsUnchanged!==true||
  h.noRegionOwnershipChanges!==true||
  h.northeastHeadlandOwnershipApproved!==false||
  h.shattercapDetachedIslandsUnclaimed!==true||
  h.largeNortheastIslandUnclaimed!==true||
  h.detachedPhysicalComponentsClaimed!==0||
  h.coast40Claim!==null||h.foreignWindwardParent!=='region.serathyl'||
  h.portsPlaced!==0||h.wellsOrRiversPlaced!==0||
  h.waterRoutesPlaced!==0||h.saltBasinsPlaced!==0||
  h.newLegacyHexDependencies!==0||h.canonicalWritable!==false)
  fail('canonical, detached island or scope hold changed');
 if(p?.ownerReviewDirection?.kharuunFrontageOption!=='B'||
  !eq(p.ownerReviewDirection.kharuunSourceEdgeIndicesInclusive,[35,58])||
  p.holds?.canonicalWritable!==false||
  r?.status!=='C1P_REFINED_FOUR_MAINLAND_RINGS_CANONICAL_HELD'||
  r?.originalSourceEdgesConserved!==599||
  r?.sourcePngFingerprintsVerified!==true||
  r?.sourceOriginalContourUnmodified!==true||
  r?.measurements?.candidateMainlandTerrainCells!==79419||
  r.measurements.previewAssignedMainlandTerrainCells!==52449||
  r.measurements.remainingUnassignedMainlandTerrainCells!==26970||
  !eq(r.measurements.perRegion.map(x=>x.regionId),ids)||
  !eq(r.measurements.perRegion.map(x=>x.terrainCandidateCells),expectedCounts)||
  r.measurements.detachedPhysicalComponentsClaimed!==0||
  r.diagnostic?.polygonOwnershipCollisions!==0||
  r.holds?.canonicalWritable!==false)
  fail('native accepted C1-P geometry or terrain accounting changed');
 return d;
}

/**
 * Exact 4-neighbor BFS, optionally with Manhattan-neighborhood pixel
 * clearance, restricted to original mainland component, source contour,
 * and currently unclaimed/Verdant C1-P terrain-candidate cells.
 */
export function traceCandidateCorridor({labels,owner,sourceContour,width,height,
 start,target,window,componentId=30,verdantOwnerCode=3,clearance=0}){
 if(width!==2048||height!==1152||labels?.length!==width*height||
  owner?.length!==width*height||sourceContour?.length!==599||
  ![0,1,2].includes(clearance)||
  !Number.isInteger(window?.minX)||!Number.isInteger(window?.maxX)||
  !Number.isInteger(window?.minY)||!Number.isInteger(window?.maxY)||
  window.minX<0||window.minY<0||window.maxX>=width||window.maxY>=height||
  window.minX>=window.maxX||window.minY>=window.maxY)
  fail('candidate component, ownership or bounded window invalid');
 const validPoint=p=>Number.isInteger(p?.x)&&Number.isInteger(p?.y)&&
  p.x>=window.minX&&p.x<=window.maxX&&
  p.y>=window.minY&&p.y<=window.maxY;
 if(!validPoint(start)||!validPoint(target))fail('unbounded route witness anchors');
 const w=window.maxX-window.minX+1,h=window.maxY-window.minY+1;
 if(w*h>100000)fail('unbounded candidate search area');
 const local=(x,y)=>(y-window.minY)*w+(x-window.minX);
 const inbounds=(x,y)=>x>=window.minX&&x<=window.maxX&&
  y>=window.minY&&y<=window.maxY;
 const raw=new Uint8Array(w*h);
 for(let y=window.minY;y<=window.maxY;y++){
  for(let x=window.minX;x<=window.maxX;x++){
   const i=y*width+x,li=local(x,y);
   if(labels[i]!==componentId)continue;
   if(owner[i]!==0&&owner[i]!==verdantOwnerCode)continue;
   if(!c1oPointInRing({x:x+.5,y:y+.5},sourceContour))continue;
   raw[li]=1;
  }
 }
 const safe=new Uint8Array(raw.length);
 for(let y=window.minY;y<=window.maxY;y++){
  for(let x=window.minX;x<=window.maxX;x++){
   const i=local(x,y);
   if(!raw[i])continue;
   let ok=true;
   for(let dy=-clearance;dy<=clearance&&ok;dy++)
    for(let dx=-clearance;dx<=clearance;dx++){
     if(Math.abs(dx)+Math.abs(dy)>clearance)continue;
     if(!inbounds(x+dx,y+dy)||!raw[local(x+dx,y+dy)]){
      ok=false;break;
     }
    }
   safe[i]=Number(ok);
  }
 }
 const startId=local(start.x,start.y),endId=local(target.x,target.y);
 const out={found:false,clearancePx:clearance,
  startIsPermitted:safe[startId]===1,targetIsPermitted:safe[endId]===1,
  visitedCandidatePixels:0,pixelSteps:null,pathSha256:null,path:[]};
 if(!safe[startId]||!safe[endId])return out;
 const parent=new Int32Array(w*h);parent.fill(-2);
 const q=new Int32Array(w*h);let first=0,last=1;
 parent[startId]=-1;q[0]=startId;
 const dirs=[[1,0],[-1,0],[0,-1],[0,1]];
 while(first<last){
  const cur=q[first++];if(cur===endId)break;
  const x=window.minX+cur%w,y=window.minY+Math.floor(cur/w);
  for(const [dx,dy] of dirs){
   const nx=x+dx,ny=y+dy;
   if(!inbounds(nx,ny))continue;
   const n=local(nx,ny);
   if(!safe[n]||parent[n]!==-2)continue;
   parent[n]=cur;q[last++]=n;
  }
 }
 out.visitedCandidatePixels=last;
 if(parent[endId]===-2)return out;
 const path=[];
 for(let id=endId;id!==-1;id=parent[id])
  path.push({x:window.minX+id%w,y:window.minY+Math.floor(id/w)});
 path.reverse();
 for(const pt of path){
  const idx=pt.y*width+pt.x;
  if(labels[idx]!==componentId||
   ![0,verdantOwnerCode].includes(owner[idx])||
   !c1oPointInRing({x:pt.x+.5,y:pt.y+.5},sourceContour))
   fail('reconstructed corridor escaped source candidates or entered held region');
 }
 out.found=true;out.pixelSteps=path.length-1;
 out.pathSha256=createHash('sha256').update(path.map(x=>x.x+','+x.y).join(';')).digest('hex');
 out.path=path;
 return out;
}

export function buildC1QHeadlandReview({c,p,r,revised,selected,labels,ownership}){
 const intent=validateC1QContract(c,p,r);
 if(revised?.originalContour?.length!==599||
  !eq(revised.originalContour,selected?.main?.points)||
  !Array.isArray(revised?.protectedOffshore)||
  revised.protectedOffshore.length!==3)
  fail('original mainland or protected detached source contour drifted');
 if(revised.regions.length!==4||
  !eq(revised.regions.map(x=>x.regionId),ids)||
  !eq(revised.regions[1].sourceEdgeIndices,Array.from({length:24},(_,i)=>i+35)))
  fail('parent coastal candidate rings changed');
 const head=selected.main.points.slice(75,117);
 if(head.length!==42||head.some(q=>!Number.isFinite(q.x)||!Number.isFinite(q.y)))
  fail('headland original source vertices unavailable');
 const start=intent.fromVerdant,target=intent.toHeadland;
 const ring=revised.regions[2].polygonRing;
 if(!c1oPointInRing({x:start.x+.5,y:start.y+.5},ring)||
  c1oPointInRing({x:target.x+.5,y:target.y+.5},ring))
  fail('corridor endpoints do not distinguish Verdant from unassigned headland');
 const starts=(start.y*2048+start.x),ends=(target.y*2048+target.x);
 if(ownership[starts]!==3||ownership[ends]!==0)
  fail('source-clipped baseline ownership anchors drifted');
 const routes=intent.clearanceChecksPx.map(clearance=>
  traceCandidateCorridor({labels,owner:ownership,
   sourceContour:revised.originalContour,width:2048,height:1152,
   start,target,window:intent.allowedWindowInclusive,clearance}));
 return {
  status:'C1Q_NORTHEAST_HEADLAND_OPTIONS_REVIEW_ONLY_NO_POLITICAL_ALLOCATION',
  sourceVectorBlob:c.c1oSourceVectorBlob,
  headland:{originalSourceEdgeIndices:Array.from({length:41},(_,i)=>75+i),
   sourceVertices:head,contourComponentId:30,
   politicalOwner:null,sourceWaterCalibrated:false},
  options:c.comparisonOptions,
  candidateCorridors:routes,
  c1pTerrainConservation:{...c.c1pBaselineTerrain,
    revisedRegionCells:r.measurements.perRegion.map(x=>({
     regionId:x.regionId,cells:x.terrainCandidateCells})),
    additionalTerritorialCellsAssigned:0,
    detachedComponentsClaimed:0},
  limits:{candidateMaskIsNotCertifiedLandSea:true,
   candidateConnectivityIsNotTravelOrPoliticalOwnership:true,
   noPortsWellsWaterRoutesOrSaltBasins:true,
   noNewPolygonOrCanonicalPublication:true,
   largeNEIslandAndShattercapRemainUnclaimed:true},
 };
}
