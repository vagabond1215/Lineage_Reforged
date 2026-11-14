/**
 * C1-I: original-source blue connectivity and shared-nonblue sensitivity.
 * Shared blue is not certified ocean. Shared nonblue may include linework,
 * unresolved terrain or river ink; crossing it never proves a coastline.
 * Analysis-only pixel connectivity; no new geographic authority.
 */
const fail=s=>{throw Error('C1-I source separation HOLD: '+s);};
const neighbors=(i,w,h,fn)=>{
  const x=i%w,y=(i-x)/w;
  if(x)fn(i-1);if(x+1<w)fn(i+1);
  if(y)fn(i-w);if(y+1<h)fn(i+w);
};
const grid=(a,w,h)=>Number.isInteger(w)&&Number.isInteger(h)&&w>0&&h>0&&a?.length===w*h;
export const UNREACHABLE_INK=255;
export function isSharedNonblueUnresolved(br,bg,bb,ba,er,eg,eb,ea){
  return ba>0&&ba===ea&&br===er&&bg===eg&&bb===eb&&
    !(bb>150&&bb-bg>25&&bb-br>80);
}
export function registeredSharedNonblueUnresolved({biome,elevation,crop,width=2048,height=1152}){
  if(!biome?.rgba||!elevation?.rgba||
    biome.width!==4096||elevation.width!==4096||
    biome.height!==2355||elevation.height!==2355||
    biome.rgba.length!==4096*2355*4||
    elevation.rgba.length!==4096*2355*4||
    crop?.x!==60||crop.y!==60||crop.width!==3976||crop.height!==2235||
    width!==2048||height!==1152)fail('source registration drift');
  const out=new Uint8Array(width*height);
  for(let y=0;y<height;y++){
    const sy=crop.y+Math.min(crop.height-1,Math.floor((y+.5)*crop.height/height));
    for(let x=0;x<width;x++){
      const sx=crop.x+Math.min(crop.width-1,Math.floor((x+.5)*crop.width/width));
      const p=(sy*4096+sx)*4;
      out[y*width+x]=Number(isSharedNonblueUnresolved(
        biome.rgba[p],biome.rgba[p+1],biome.rgba[p+2],biome.rgba[p+3],
        elevation.rgba[p],elevation.rgba[p+1],elevation.rgba[p+2],elevation.rgba[p+3]));
    }
  }
  return out;
}
/** Four-neighbor image-frame reachability, not ocean or river classification. */
export function classifyBlueComponents({blue,width,height}){
  if(!grid(blue,width,height))fail('blue dimensions invalid');
  const n=width*height,vis=new Uint8Array(n),
    edgeConnectedBlue=new Uint8Array(n),queue=new Uint32Array(n);
  let connectedBlueComponents=0,boundaryConnectedBlueComponents=0,
    enclosedBlueComponents=0,boundaryConnectedBluePixels=0,enclosedBluePixels=0;
  const enclosedLargest=[];
  for(let start=0;start<n;start++){
    if(!blue[start]||vis[start])continue;
    if(blue[start]!==1)fail('unknown blue class');
    connectedBlueComponents++;
    let head=0,tail=1,boundary=false;
    let minX=width,minY=height,maxX=-1,maxY=-1;
    queue[0]=start;vis[start]=1;
    while(head<tail){
      const i=queue[head++],x=i%width,y=(i-x)/width;
      if(!x||!y||x===width-1||y===height-1)boundary=true;
      minX=Math.min(minX,x);minY=Math.min(minY,y);
      maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
      neighbors(i,width,height,j=>{
        if(blue[j]&&!vis[j]){
          if(blue[j]!==1)fail('unknown blue class');
          vis[j]=1;queue[tail++]=j;
        }
      });
    }
    if(boundary){
      boundaryConnectedBlueComponents++;boundaryConnectedBluePixels+=tail;
      for(let k=0;k<tail;k++)edgeConnectedBlue[queue[k]]=1;
    }else{
      enclosedBlueComponents++;enclosedBluePixels+=tail;
      enclosedLargest.push({candidatePixels:tail,bounds:{minX,minY,maxX,maxY}});
    }
  }
  enclosedLargest.sort((a,b)=>b.candidatePixels-a.candidatePixels||
    a.bounds.minX-b.bounds.minX||a.bounds.minY-b.bounds.minY);
  return {edgeConnectedBlue,summary:{
    status:'SOURCE_BOUNDARY_CONNECTED_BLUE_NOT_CERTIFIED_OCEAN',
    connectedBlueComponents,boundaryConnectedBlueComponents,
    boundaryConnectedBluePixels,enclosedBlueComponents,enclosedBluePixels,
    largestEnclosedBlueComponents:enclosedLargest.slice(0,12),
    adjacency:'FOUR_NEIGHBOR',borderBlueIsNotCertifiedOcean:true,
    enclosedBlueIsNotCertifiedLake:true,
  }};
}
/** Bounded 0..maxInkSteps shortest source-nonblue bridge to mainland. */
export function measureInkBridgeContacts({
  boundaryBlue,sharedNonblue,labels,width,height,mainlandId=30,maxInkSteps=3,
}){
  if(!grid(boundaryBlue,width,height)||!grid(sharedNonblue,width,height)||
    !grid(labels,width,height)||!Number.isInteger(mainlandId)||mainlandId<1||
    !Number.isInteger(maxInkSteps)||maxInkSteps<0||maxInkSteps>8)
    fail('ink-bridge dimensions, physical ID or horizon invalid');
  const n=width*height,inkDepth=new Uint8Array(n),
    contactMinInk=new Uint8Array(n),q=new Uint32Array(n);
  inkDepth.fill(UNREACHABLE_INK);contactMinInk.fill(UNREACHABLE_INK);
  let tail=0,head=0,mainlandPixels=0,nonbluePixels=0;
  for(let i=0;i<n;i++){
    const b=boundaryBlue[i],s=sharedNonblue[i];
    if((b!==0&&b!==1)||(s!==0&&s!==1))fail('invalid source classification');
    if(b&&s)fail('source blue/shared-nonblue classes overlap');
    if(labels[i]===mainlandId){
      mainlandPixels++;
      if(b||s)fail('source classification overlaps mainland terrain');
    }
    if(s)nonbluePixels++;
    if(b){inkDepth[i]=0;q[tail++]=i;}
  }
  if(!mainlandPixels)fail('no mainland candidate component');
  let bridgedSharedNonbluePixels=0;
  while(head<tail){
    const at=q[head++],d=inkDepth[at];
    neighbors(at,width,height,j=>{
      if(labels[j]===mainlandId){
        if(d<contactMinInk[j])contactMinInk[j]=d;
      }else if(sharedNonblue[j]&&d<maxInkSteps&&
          inkDepth[j]===UNREACHABLE_INK){
        inkDepth[j]=d+1;q[tail++]=j;bridgedSharedNonbluePixels++;
      }
    });
  }
  const counts=Array(maxInkSteps+1).fill(0);
  let contacted=0;
  for(let i=0;i<n;i++){
    if(labels[i]!==mainlandId)continue;
    const d=contactMinInk[i];
    if(d!==UNREACHABLE_INK){
      if(d>maxInkSteps)fail('bridge exceeded selected horizon');
      counts[d]++;contacted++;
    }
  }
  return {inkDepth,contactMinInk,summary:{
    sharedNonblueUnresolvedPixels:nonbluePixels,
    bridgedSharedNonbluePixels,mainlandCandidatePixels:mainlandPixels,
    contactedMainlandCandidatePixels:contacted,
    contactsByMinimumSharedNonblueSteps:counts,
    uncontactedMainlandCandidatePixels:mainlandPixels-contacted,
    maxInkSteps,units:'UNVERIFIED_SHARED_NONBLUE_SOURCE_PIXELS_NOT_KILOMETERS',
    shorelineCertified:false,seaRoutesApproved:false,
    lakeVerified:false,waterResourcesCreated:0,
  }};
}
export function reportRegionInkContacts({
  ownership,labels,contactMinInk,width,height,mainlandId=30,maxInkSteps=3,
}){
  if(!grid(ownership,width,height)||!grid(labels,width,height)||
    !grid(contactMinInk,width,height))fail('regional source grid mismatch');
  const regionRows=Array.from({length:5},(_,regionIndex)=>({
    regionIndex,terrainCandidateCells:0,
    contactCandidatesByMinInkSteps:Array(maxInkSteps+1).fill(0),
    noSourceContactWithinHorizon:0,
  }));
  for(let i=0;i<ownership.length;i++){
    const k=ownership[i];
    if(k>4)fail('unrecognized region code');
    if(labels[i]!==mainlandId){
      if(k)fail('detached physical candidate received region assignment');
      continue;
    }
    const row=regionRows[k];row.terrainCandidateCells++;
    const d=contactMinInk[i];
    if(d===UNREACHABLE_INK)row.noSourceContactWithinHorizon++;
    else if(d<=maxInkSteps)row.contactCandidatesByMinInkSteps[d]++;
    else fail('contact beyond horizon');
  }
  const totalMainlandCandidateCells=regionRows.reduce((s,r)=>s+r.terrainCandidateCells,0);
  if(!totalMainlandCandidateCells)fail('no mainland pixels accounted');
  return {
    status:'NONCANONICAL_SOURCE_CONTACT_SENSITIVITY_ONLY',
    regionRows,totalMainlandCandidateCells,
    islandCandidateRegionCells:0,coastlineCertified:false,
    veyrholmCorridorApproved:false,kharuunSeaFrontageApproved:false,
    saltBasinsPlaced:0,windwardTransferred:false,canonicalWritable:false,
  };
}
