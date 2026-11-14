/**
 * C1-H read-only terrain-and-shared-blue diagnostics.
 *
 * Source blue can be open ocean, river, hydrologic ink or artwork.
 * Elevation PNG RGB luminance is NOT a calibrated height or flow surface.
 * No coast, river, basin, land, ecological band, route or region is approved
 * by these diagnostics. Four-neighbor pixel geometry is analysis-only.
 */
const HOLD=x=>{throw Error('C1-H physical evidence HOLD: '+x);};
export const UNREACHED_BLUE_CONTACT=65535;
export function isSharedBlueCandidate(br,bg,bb,ba,er,eg,eb,ea){
  return ba>0&&ba===ea&&br===er&&bg===eg&&bb===eb&&
    bb>150&&bb-bg>25&&bb-br>80;
}
export function registeredSharedBlueMask({biome,elevation,crop,width=2048,height=1152}){
  if(!biome?.rgba||!elevation?.rgba||
    biome.width!==4096||biome.height!==2355||
    elevation.width!==4096||elevation.height!==2355||
    crop?.x!==60||crop.y!==60||crop.width!==3976||crop.height!==2235||
    width!==2048||height!==1152||
    biome.rgba.length!==biome.width*biome.height*4||
    elevation.rgba.length!==elevation.width*elevation.height*4)
    HOLD('registered source image/crop mismatch');
  const blue=new Uint8Array(width*height);
  for(let y=0;y<height;y++){
    const sy=crop.y+Math.min(crop.height-1,
      Math.floor((y+.5)*crop.height/height));
    for(let x=0;x<width;x++){
      const sx=crop.x+Math.min(crop.width-1,
        Math.floor((x+.5)*crop.width/width));
      const j=(sy*biome.width+sx)*4;
      blue[y*width+x]=Number(isSharedBlueCandidate(
        biome.rgba[j],biome.rgba[j+1],biome.rgba[j+2],biome.rgba[j+3],
        elevation.rgba[j],elevation.rgba[j+1],elevation.rgba[j+2],elevation.rgba[j+3]));
    }
  }
  return blue;
}
const neighbors=(i,w,h,visit)=>{
  const x=i%w,y=(i-x)/w;
  if(x>0)visit(i-1);
  if(x+1<w)visit(i+1);
  if(y>0)visit(i-w);
  if(y+1<h)visit(i+w);
};
/**
 * Distance (in candidate pixels ONLY) from independently registered
 * shared-blue candidates. The initial contact pixel has distance zero.
 * Blue is not certified ocean. This does not compute border buffers.
 */
export function measureBlueAdjacency({labels,blue,width,height,mainlandId=30}){
  const n=width*height;
  if(!Number.isInteger(width)||!Number.isInteger(height)||
    width<1||height<1||labels?.length!==n||blue?.length!==n||
    !Number.isInteger(mainlandId)||mainlandId<1)
    HOLD('component/blue reference size or identity mismatch');
  const d=new Uint16Array(n);d.fill(UNREACHED_BLUE_CONTACT);
  const queue=new Uint32Array(n);
  let head=0,tail=0,main=0,blueCount=0;
  for(let i=0;i<n;i++){
    if(blue[i]!==0&&blue[i]!==1)HOLD('invalid blue candidate class');
    if(blue[i])blueCount++;
    if(labels[i]!==mainlandId)continue;
    main++;
    if(blue[i])HOLD('blue candidate overlaps source terrain component');
    let contact=false;
    neighbors(i,width,height,j=>{if(blue[j])contact=true;});
    if(contact){d[i]=0;queue[tail++]=i;}
  }
  while(head<tail){
    const at=queue[head++],next=d[at]+1;
    if(next>=UNREACHED_BLUE_CONTACT)HOLD('candidate distance overflow');
    neighbors(at,width,height,j=>{
      if(labels[j]===mainlandId&&d[j]===UNREACHED_BLUE_CONTACT){
        d[j]=next;queue[tail++]=j;
      }
    });
  }
  if(main===0)HOLD('no target mainland source terrain candidate');
  return {
    distances:d,
    candidateMainlandPixels:main,
    sharedBlueCandidatePixels:blueCount,
    immediateBlueNeighborMainlandPixels:tail?queue.filter(i=>d[i]===0).length:0,
    reachableMainlandPixels:tail,
    unreachableMainlandPixels:main-tail,
    method:'FOUR_NEIGHBOR_SHARED_SOURCE_BLUE_PIXEL_DISTANCE_NOT_OCEAN_OR_KILOMETERS',
  };
}
export function sampleRegisteredLuma(png,crop,x,y,width=2048,height=1152){
  if(!png?.rgba||png.width!==4096||png.height!==2355||
    crop?.x!==60||crop.y!==60||crop.width!==3976||crop.height!==2235||
    width!==2048||height!==1152||
    !Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||
    x>=width||y>=height)
    HOLD('elevation image registration or pixel sample invalid');
  const sx=crop.x+Math.min(crop.width-1,Math.floor((x+.5)*crop.width/width));
  const sy=crop.y+Math.min(crop.height-1,Math.floor((y+.5)*crop.height/height));
  const j=(sy*png.width+sx)*4;
  const r=png.rgba[j],g=png.rgba[j+1],b=png.rgba[j+2];
  return Math.min(255,Math.max(0,Math.round(.2126*r+.7152*g+.0722*b)));
}
const quantile=(hist,count,p)=>{
  if(!count)return null;
  let sum=0;
  for(let i=0;i<hist.length;i++){sum+=hist[i];if(sum>=Math.ceil(count*p))return i;}
  return 255;
};
export function summarizeGuideSourceEvidence({
  labels,blue,distances,ownership,elevation,crop,
  width=2048,height=1152,mainlandId=30,
}){
  const n=width*height;
  if(labels?.length!==n||blue?.length!==n||distances?.length!==n||
    ownership?.length!==n||width!==2048||height!==1152)
    HOLD('guide and source evidence grids do not align');
  const rows=Array.from({length:4},(_,index)=>({
    guideIndex:index+1,
    candidateCells:0,
    nearBlueWithinThreeSteps:0,
    nearBlueWithinTwelveSteps:0,
    immediateSharedBlueNeighborCells:0,
    unreachableSharedBlue:0,
    rawImageLumaHistogram:new Uint32Array(256),
  }));
  let unassigned=0,claimedIsland=0,mainland=0;
  for(let i=0;i<n;i++){
    const region=ownership[i];
    if(region>4||!Number.isInteger(region))HOLD('unrecognized region preview code');
    if(region&&labels[i]!==mainlandId)claimedIsland++;
    if(labels[i]!==mainlandId)continue;
    mainland++;
    if(!region){unassigned++;continue;}
    const row=rows[region-1];
    row.candidateCells++;
    const distance=distances[i];
    if(distance===0)row.immediateSharedBlueNeighborCells++;
    if(distance<=3)row.nearBlueWithinThreeSteps++;
    if(distance<=12)row.nearBlueWithinTwelveSteps++;
    if(distance===UNREACHED_BLUE_CONTACT)row.unreachableSharedBlue++;
    const x=i%width,y=(i-x)/width;
    row.rawImageLumaHistogram[sampleRegisteredLuma(elevation,crop,x,y,width,height)]++;
  }
  if(claimedIsland||!mainland||rows.reduce((s,r)=>s+r.candidateCells,0)+unassigned!==mainland)
    HOLD('island assignment or mainland accounting discrepancy');
  return {
    mainCandidateCells:mainland,
    unassignedCandidateCells:unassigned,
    islandAssignedCells:0,
    guides:rows.map(({rawImageLumaHistogram:hist,...r})=>({
      ...r,
      rawElevationImageBrightness:{
        p10:quantile(hist,r.candidateCells,.10),
        median:quantile(hist,r.candidateCells,.50),
        p90:quantile(hist,r.candidateCells,.90),
        units:'RAW_RGB_LUMINANCE_0_255_NOT_HEIGHT',
      },
      seaContactApproved:false,
      riverCourseApproved:false,
      watershedApproved:false,
      basinDetected:false,
    }))
  };
}
export function sampleNorthernEvidenceTransects({
  labels,blue,ownership,distances,width=2048,height=1152,
  samples=[120,205,300,390,490],yStart=115,yEnd=330,
}){
  if(labels?.length!==width*height||blue?.length!==width*height||
    ownership?.length!==width*height||distances?.length!==width*height||
    width!==2048||height!==1152||
    !Array.isArray(samples)||samples.length===0||
    !Number.isInteger(yStart)||!Number.isInteger(yEnd)||
    yStart<0||yEnd>height||yStart>=yEnd)
    HOLD('northern review transect outside reference');
  return samples.map(x=>{
    if(!Number.isInteger(x)||x<0||x>=width)HOLD('transect coordinate outside reference');
    let topVeyr=null,bottomVeyr=null,topKharuun=null,bottomKharuun=null;
    let blueNeighbors=0,mainCandidate=0;
    for(let y=yStart;y<yEnd;y++){
      const at=y*width+x,region=ownership[at];
      if(labels[at]===30)mainCandidate++;
      if(labels[at]===30&&distances[at]===0)blueNeighbors++;
      if(region===4){if(topVeyr===null)topVeyr=y;bottomVeyr=y;}
      if(region===2){if(topKharuun===null)topKharuun=y;bottomKharuun=y;}
    }
    return {
      referenceX:x,sourceWindowY:[yStart,yEnd],
      mainlandCandidateCellsInColumn:mainCandidate,
      blueAdjacentMainlandCellsInColumn:blueNeighbors,
      veyrholmCandidateYRange:topVeyr===null?null:[topVeyr,bottomVeyr],
      kharuunCandidateYRange:topKharuun===null?null:[topKharuun,bottomKharuun],
      provesContinuousCoast:false,
      provesKharuunOceanAccess:false,
    };
  });
}
