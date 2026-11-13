/** Dependency-free strict PNG decode for read-only First World terrain evidence.
 * No raster modification and no terrain inference from generated region/biome JSON.
 */
import {inflateSync} from 'node:zlib';

export function decodeSourcePng(bytes) {
  const signature = Buffer.from([137,80,78,71,13,10,26,10]);
  if (!Buffer.isBuffer(bytes) || !bytes.subarray(0,8).equals(signature))
    throw Error('Source file is not PNG');
  let at=8,header=null,palette=null,transparency=null,sawEnd=false;
  const compressed=[];
  while(at+12<=bytes.length) {
    const n=bytes.readUInt32BE(at),type=bytes.toString('ascii',at+4,at+8);
    if(n>bytes.length-at-12)throw Error('Truncated PNG chunk: '+type);
    const data=bytes.subarray(at+8,at+8+n);at+=n+12;
    if(type==='IHDR') {
      if(header||n!==13)throw Error('Malformed PNG header');
      header={width:data.readUInt32BE(0),height:data.readUInt32BE(4),
        bitDepth:data[8],colorType:data[9],compression:data[10],
        filter:data[11],interlace:data[12]};
    } else if(type==='PLTE') palette=data;
    else if(type==='tRNS') transparency=data;
    else if(type==='IDAT') compressed.push(data);
    else if(type==='IEND'){sawEnd=true;break;}
    else if(type[0]===type[0]?.toUpperCase() && !['sRGB','gAMA','cHRM','iCCP'].includes(type))
      throw Error('Unsupported critical PNG chunk '+type);
  }
  if(!header||!sawEnd||!compressed.length)throw Error('PNG missing required chunks');
  const {width,height,bitDepth,colorType,compression,filter,interlace}=header;
  if(width<1||height<1||width>8192||height>8192||width*height>50000000)
    throw Error('Unsupported source PNG dimensions');
  if(compression!==0||filter!==0||interlace!==0)
    throw Error('Interlaced or unknown PNG codec; no implicit resampling');
  const channels={0:1,2:3,3:1,4:2,6:4}[colorType];
  if(!channels || ![8,16].includes(bitDepth) || (colorType===3&&bitDepth!==8))
    throw Error('Unsupported PNG color format: type '+colorType+' depth '+bitDepth);
  if(colorType===3&&(!palette||palette.length%3||palette.length>768))
    throw Error('Palette PNG without valid PLTE');
  const bytesPerSample=bitDepth/8;
  const stride=width*channels*bytesPerSample,bpp=channels*bytesPerSample;
  const inflated=inflateSync(Buffer.concat(compressed),{maxOutputLength:(stride+1)*height});
  if(inflated.length!==(stride+1)*height)throw Error('Source PNG row length mismatch');
  const rgba=new Uint8Array(width*height*4);
  let prev=Buffer.alloc(stride),p=0;
  for(let y=0;y<height;y++){
    const kind=inflated[p++],row=Buffer.from(inflated.subarray(p,p+stride));p+=stride;
    for(let i=0;i<stride;i++){
      const left=i>=bpp?row[i-bpp]:0,above=prev[i],upperLeft=i>=bpp?prev[i-bpp]:0;
      let predictor=0;
      if(kind===1) predictor=left;
      else if(kind===2) predictor=above;
      else if(kind===3) predictor=Math.floor((left+above)/2);
      else if(kind===4){
        const q=left+above-upperLeft, a=Math.abs(q-left),b=Math.abs(q-above),c=Math.abs(q-upperLeft);
        predictor=a<=b&&a<=c?left:b<=c?above:upperLeft;
      } else if(kind!==0)throw Error('Invalid source PNG row filter '+kind);
      row[i]=(row[i]+predictor)&255;
    }
    for(let x=0;x<width;x++){
      const s=x*bpp,d=(y*width+x)*4;
      const ch=k=>row[s+k*bytesPerSample];
      if(colorType===0){rgba[d]=rgba[d+1]=rgba[d+2]=ch(0);rgba[d+3]=255;}
      else if(colorType===2){rgba[d]=ch(0);rgba[d+1]=ch(1);rgba[d+2]=ch(2);rgba[d+3]=255;}
      else if(colorType===3){
        const index=ch(0);if(index*3+2>=palette.length)throw Error('Invalid palette index');
        rgba[d]=palette[index*3];rgba[d+1]=palette[index*3+1];
        rgba[d+2]=palette[index*3+2];rgba[d+3]=transparency?.[index]??255;
      } else if(colorType===4){
        rgba[d]=rgba[d+1]=rgba[d+2]=ch(0);
        rgba[d+3]=ch(1);
      } else {
        rgba[d]=ch(0);rgba[d+1]=ch(1);rgba[d+2]=ch(2);rgba[d+3]=ch(3);
      }
    }
    prev=row;
  }
  return {width,height,bitDepth,colorType,rgba};
}

export function registeredSourceMask(png,rect,width,height) {
  if(![rect?.x,rect?.y,rect?.width,rect?.height,width,height].every(Number.isInteger) ||
     rect.width<=0||rect.height<=0||width<=0||height<=0||
     rect.x<0||rect.y<0||rect.x+rect.width>png.width||
     rect.y+rect.height>png.height)
    throw Error('Crop or reference registration outside source image');
  const mask=new Uint8Array(width*height);
  const src=png.rgba;
  for(let y=0;y<height;y++){
    const sy=rect.y+Math.min(rect.height-1,Math.floor((y+0.5)*rect.height/height));
    for(let x=0;x<width;x++){
      const sx=rect.x+Math.min(rect.width-1,Math.floor((x+0.5)*rect.width/width));
      const i=(sy*png.width+sx)*4,r=src[i],g=src[i+1],b=src[i+2];
      // Preserve original PowerShell RasterGeometry.IsWater threshold, on
      // independently sampled source RGB, not on region/biome zone geometry.
      mask[y*width+x]=(b>150 && b-g>25 && b-r>80)?0:1;
    }
  }
  return mask;
}

/** Both connectivities retained; pixel-count cutoff is never applied. */
export function labelLandComponents(mask,width,height,diagonal=false) {
  if(mask.length!==width*height)throw Error('Component dimensions mismatch');
  const labels=new Uint32Array(mask.length),queue=new Uint32Array(mask.length);
  const result=[];
  const offsets=diagonal
    ? [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]
    : [[-1,0],[1,0],[0,-1],[0,1]];
  for(let start=0;start<mask.length;start++){
    if(!mask[start]||labels[start])continue;
    const id=result.length+1;
    let head=0,tail=1,minX=width,minY=height,maxX=-1,maxY=-1;
    queue[0]=start;labels[start]=id;
    while(head<tail){
      const index=queue[head++],x=index%width,y=(index-x)/width;
      minX=Math.min(minX,x);maxX=Math.max(maxX,x);
      minY=Math.min(minY,y);maxY=Math.max(maxY,y);
      for(const [dx,dy] of offsets){
        const nx=x+dx,ny=y+dy;
        if(nx<0||ny<0||nx>=width||ny>=height)continue;
        const next=ny*width+nx;
        if(mask[next]&&!labels[next]){labels[next]=id;queue[tail++]=next;}
      }
    }
    result.push({id,areaPx2:tail,bounds:{minX,minY,maxX,maxY}});
  }
  return {labels,components:result};
}

export function diagonalJoinEvidence(four,eight) {
  if(four.labels.length!==eight.labels.length)throw Error('Connectivity grids differ');
  const members=new Map();
  for(let i=0;i<four.labels.length;i++){
    const a=four.labels[i],b=eight.labels[i];
    if(!a)continue;
    if(!members.has(b))members.set(b,new Set());
    members.get(b).add(a);
  }
  return [...members].filter(([,s])=>s.size>1)
    .map(([eightId,s])=>({eightComponentId:eightId,fourComponentIds:[...s].sort((a,b)=>a-b)}));
}
