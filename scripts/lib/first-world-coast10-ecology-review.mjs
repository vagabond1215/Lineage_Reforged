/**
 * Source-registered Coast 10 comparison. Read-only, no certified biome class,
 * meter scale, coastline transfer, child-region allocation, or canonical write.
 */
import {deflateSync} from 'node:zlib';
import {visitRasterPolygon} from './first-world-component-review.mjs';
import {SourcePairClass} from './first-world-source-pair-qa.mjs';

const c=SourcePairClass;
const bbox=points=>({
  minX:Math.min(...points.map(p=>p.x)),minY:Math.min(...points.map(p=>p.y)),
  maxX:Math.max(...points.map(p=>p.x)),maxY:Math.max(...points.map(p=>p.y)),
});
const overlap=(a,b)=>a.minX<=b.maxX&&a.maxX>=b.minX&&a.minY<=b.maxY&&a.maxY>=b.minY;
const hex=n=>'#'+n.toString(16).padStart(6,'0').toUpperCase();
const percentage=(count,total)=>total?Number((100*count/total).toFixed(2)):0;
const quantiles=(hist,total)=>{
  const q=p=>{
    if(!total)return null;
    let seen=0;for(let i=0;i<hist.length;i++){
      seen+=hist[i];if(seen>=Math.ceil(total*p))return i;
    }
    return null;
  };
  return {p10:q(.1),median:q(.5),p90:q(.9),
    interpretation:'UNVERIFIED_COLOR_RAMP_RAW_RGB_LUMINANCE_NOT_METERS'};
};

export function coast10ReviewBounds(points,width,height,padding=38) {
  if(!Array.isArray(points)||points.length<3||
    points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y))||
    !Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
    !Number.isInteger(padding)||padding<0)
    throw Error('Coast 10 review source points or dimensions invalid');
  const b=bbox(points);
  const minX=Math.max(0,Math.floor(b.minX)-padding),
    minY=Math.max(0,Math.floor(b.minY)-padding),
    maxX=Math.min(width,Math.ceil(b.maxX)+padding),
    maxY=Math.min(height,Math.ceil(b.maxY)+padding);
  if(maxX<=minX||maxY<=minY)throw Error('Empty Coast 10 review crop');
  return {minX,minY,maxX,maxY,width:maxX-minX,height:maxY-minY,
    reference:'Canonical 2048x1152 registered source pixel centers'};
}

function validate({width,height,classification,biomeRgba,elevationRgba,roi}) {
  const count=width*height;
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
    classification?.length!==count||biomeRgba?.length!==count*4||
    elevationRgba?.length!==count*4||!roi||
    roi.minX<0||roi.minY<0||roi.maxX>width||roi.maxY>height||
    roi.width!==roi.maxX-roi.minX||roi.height!==roi.maxY-roi.minY)
    throw Error('Coast 10 paired-source registration mismatch');
}

export function buildCoast10EnvironmentReview({
  width,height,classification,biomeRgba,elevationRgba,roi,
  footprints,regions,focusId,
}) {
  validate({width,height,classification,biomeRgba,elevationRgba,roi});
  if(!Array.isArray(footprints)||!Array.isArray(regions))
    throw Error('Coast 10 source catalogs missing');
  const focus=footprints.find(x=>x.id===focusId);
  if(!focus)throw Error('Missing approved baseline Coast 10 feature identity');
  const regionById=new Map(regions.map(r=>[r.id,r]));
  if(regionById.size!==regions.length)throw Error('Duplicate source region IDs');
  const close=[];
  const rect={minX:roi.minX,minY:roi.minY,maxX:roi.maxX,maxY:roi.maxY};
  for(const p of footprints){
    if(!p.points||!overlap(bbox(p.points),rect))continue;
    const region=regionById.get(p.regionIds?.[0]);
    if(!region)throw Error('Unrecognized region in Coast 10 review: '+p.id);
    const macroId=region.regionType==='subregion'?region.parentRegionId:region.id;
    if(!['region.kaelvar','region.serathyl'].includes(macroId))continue;
    const colors=new Map(),elevationHist=new Uint32Array(256);
    const classes=new Uint32Array(5);
    let pixelsInCrop=0,rawElevationColorCells=0;
    visitRasterPolygon(p.points,width,height,(index,x,y)=>{
      if(x<roi.minX||x>=roi.maxX||y<roi.minY||y>=roi.maxY)return;
      pixelsInCrop++;
      const cl=classification[index];
      classes[cl]++;
      if(cl!==c.DIVERGENT_TERRAIN_CANDIDATE)return;
      const q=index*4;
      const r=biomeRgba[q],g=biomeRgba[q+1],b=biomeRgba[q+2];
      const key=((r>>4)<<8)|((g>>4)<<4)|(b>>4);
      colors.set(key,(colors.get(key)||0)+1);
      const er=elevationRgba[q],eg=elevationRgba[q+1],eb=elevationRgba[q+2];
      if(Math.max(er,eg,eb)-Math.min(er,eg,eb)>2)rawElevationColorCells++;
      const light=Math.round(.2126*er+.7152*eg+.0722*eb);
      elevationHist[light]++;
    });
    if(!pixelsInCrop)continue;
    const terrainCells=classes[c.DIVERGENT_TERRAIN_CANDIDATE];
    const colorDistribution=[...colors.entries()].sort((a,b)=>b[1]-a[1]||a[0]-b[0]);
    const row={
      id:p.id,regionId:region.id,macroId,regionName:region.name??region.id,
      expected:{
        dominantBiomeMix:region.environmentProfile?.dominantBiomeMix??[],
        elevationProfile:region.environmentProfile?.elevationProfile??null,
        climateTendencies:region.environmentProfile?.climateTendencies??[],
        agriculture:region.environmentProfile?.agriculturalPotential??null,
      },
      cellsInReviewCrop:pixelsInCrop,
      terrainCandidateCells:terrainCells,
      sharedInkUnresolvedCells:classes[c.SHARED_NONBLUE_UNRESOLVED],
      blueCandidateCells:classes[c.SHARED_BLUE_CANDIDATE],
      otherUnresolvedCells:classes[c.BLUE_DIVERGENCE_UNRESOLVED]+classes[c.ALPHA_UNRESOLVED],
      rawElevationLuma:quantiles(elevationHist,terrainCells),
      rawElevationColoredSharePercent:percentage(rawElevationColorCells,terrainCells),
      top4BitSourceRgbClusters:colorDistribution.slice(0,8).map(([key,n])=>({
        key:key.toString(16).padStart(3,'0').toUpperCase(),
        percentOfTerrain:percentage(n,terrainCells),cells:n,
      })),
      _colors:colors,
    };
    close.push(row);
  }
  const focusRow=close.find(x=>x.id===focusId);
  if(!focusRow||!focusRow.terrainCandidateCells)
    throw Error('Coast 10 focus has no independent source terrain pixels');
  const similarity=(a,b)=>{
    if(!a.terrainCandidateCells||!b.terrainCandidateCells)return null;
    const allKeys=new Set([...a._colors.keys(),...b._colors.keys()]);
    let shared=0;
    for(const k of allKeys){
      shared+=Math.min((a._colors.get(k)||0)/a.terrainCandidateCells,
        (b._colors.get(k)||0)/b.terrainCandidateCells);
    }
    return Number((100*shared).toFixed(2));
  };
  const result=close.map(row=>{
    const {_colors,...publicRow}=row;
    return {...publicRow,
      sourceColorHistogramOverlapWithWindwardPercent:similarity(row,focusRow),
      sourceColorSimilarityMeaning:'Descriptive comparison only: RGB color overlap is NOT biome/elevation compatibility',
    };
  });
  return {
    schemaVersion:1,status:'SOURCE_ECOLOGY_REVIEW_NO_REGION_REDRAW',
    referenceCrop:roi,focusId,
    observedExistingRegionFootprints:result.sort((a,b)=>a.macroId.localeCompare(b.macroId)||
      b.terrainCandidateCells-a.terrainCandidateCells||a.id.localeCompare(b.id)),
    notes:[
      'Only source terrain candidates contribute biome RGB and elevation diagnostics; coastline ink is kept separate.',
      'All source RGB cluster and elevation brightness values are uncalibrated and cannot label forest, grassland, desert, tundra or height in meters.',
      'Color distribution overlap is not a metric of subregional political ownership, must not choose a replacement child region.',
      'Every row is one existing polygon clipped to this review crop: overlaps may count the same pixel more than once.',
      'Inspect ecotones and river/canyon terrain before approving any new regional border.',
    ],
    proposedMacroMask:null,proposedChildBoundary:null,sourceWritable:false,
  };
}

const crcTable=(()=>{
  const t=new Uint32Array(256);
  for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);t[i]=c>>>0;}
  return t;
})();
const crc32=b=>{
  let crc=0xFFFFFFFF;
  for(const byte of b)crc=crcTable[(crc^byte)&255]^(crc>>>8);
  return (crc^0xFFFFFFFF)>>>0;
};
const chunk=(type,bytes)=>{
  const label=Buffer.from(type,'ascii'),len=Buffer.alloc(4),crc=Buffer.alloc(4);
  len.writeUInt32BE(bytes.length,0);
  crc.writeUInt32BE(crc32(Buffer.concat([label,bytes])),0);
  return Buffer.concat([len,label,bytes,crc]);
};
/** Valid embedded lossless RGBA PNG. No network fetch, no filesystem writes. */
export function embeddedCropPng(rgba,width,height,roi) {
  if(rgba?.length!==width*height*4||!roi||roi.minX<0||roi.minY<0||
    ![roi.minX,roi.minY,roi.maxX,roi.maxY,roi.width,roi.height].every(Number.isInteger)||
    roi.maxX>width||roi.maxY>height||roi.width<1||roi.height<1||
    roi.width!==roi.maxX-roi.minX||roi.height!==roi.maxY-roi.minY)
    throw Error('Embedded crop PNG registration mismatch');
  const scan=Buffer.alloc(roi.height*(1+roi.width*4));
  for(let y=0;y<roi.height;y++){
    const dest=y*(roi.width*4+1),src=((y+roi.minY)*width+roi.minX)*4;
    scan[dest]=0;
    Buffer.from(rgba.buffer,rgba.byteOffset+src,roi.width*4)
      .copy(scan,dest+1);
  }
  const header=Buffer.alloc(13);
  header.writeUInt32BE(roi.width,0);header.writeUInt32BE(roi.height,4);
  header[8]=8;header[9]=6;
  const png=Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR',header),chunk('IDAT',deflateSync(scan)),chunk('IEND',Buffer.alloc(0)),
  ]);
  return 'data:image/png;base64,'+png.toString('base64');
}

export function coast10ReviewSvg({
  width,height,roi,classification,biomeRgba,elevationRgba,
  footprints,regions,coastlines,focusId,terrainFourLabels,
}) {
  validate({width,height,classification,biomeRgba,elevationRgba,roi});
  if(terrainFourLabels?.length!==width*height||!Array.isArray(footprints)||
    !Array.isArray(regions)||!Array.isArray(coastlines))
    throw Error('Coast 10 viewer inputs invalid');
  const focus=footprints.find(f=>f.id===focusId);
  if(!focus)throw Error('Coast 10 focus feature missing');
  const focusMark=new Uint8Array(roi.width*roi.height);
  const terrainSizes=new Map();
  visitRasterPolygon(focus.points,width,height,(i,x,y)=>{
    if(x<roi.minX||x>=roi.maxX||y<roi.minY||y>=roi.maxY)return;
    focusMark[(y-roi.minY)*roi.width+x-roi.minX]=1;
    if(classification[i]!==c.DIVERGENT_TERRAIN_CANDIDATE)return;
    const id=terrainFourLabels[i];
    if(!id)throw Error('Terrain candidate missing four-connected component label');
    terrainSizes.set(id,(terrainSizes.get(id)||0)+1);
  });
  const highlight=[...terrainSizes].sort((a,b)=>b[1]-a[1]||a[0]-b[0]);
  const colorById=new Map(highlight.map(([id],j)=>[id,
    ['#56F19B','#F9B44A','#FF7070','#76F9FF'][j%4]]));
  const fills=new Map();
  const rgbaColors={
    [c.SHARED_BLUE_CANDIDATE]:'#294D76',
    [c.DIVERGENT_TERRAIN_CANDIDATE]:'#C3DDAD',
    [c.SHARED_NONBLUE_UNRESOLVED]:'#E34B9A',
    [c.BLUE_DIVERGENCE_UNRESOLVED]:'#FFD84A',
    [c.ALPHA_UNRESOLVED]:'#8B8590',
  };
  const cellColor=(index,local)=>{
    const cl=classification[index];
    if(cl===c.DIVERGENT_TERRAIN_CANDIDATE&&focusMark[local])
      return colorById.get(terrainFourLabels[index])??'#5AE1E5';
    return rgbaColors[cl];
  };
  for(let y=0;y<roi.height;y++){
    let x=0;
    while(x<roi.width){
      const local=y*roi.width+x,index=(y+roi.minY)*width+x+roi.minX;
      const key=cellColor(index,local),start=x++;
      while(x<roi.width){
        const next=y*roi.width+x,source=(y+roi.minY)*width+x+roi.minX;
        if(cellColor(source,next)!==key)break;
        x++;
      }
      if(key==='#294D76')continue;
      if(!fills.has(key))fills.set(key,[]);
      fills.get(key).push('M'+start+' '+y+'h'+(x-start)+'v1h-'+(x-start)+'z');
    }
  }
  const gridPaths=[...fills].map(([color,paths])=>
    '<path fill="'+color+'" d="'+paths.join('')+'"/>').join('');
  const byRegion=new Map(regions.map(r=>[r.id,r]));
  const rect={minX:roi.minX,minY:roi.minY,maxX:roi.maxX,maxY:roi.maxY};
  const relevant=footprints.filter(p=>{
    if(!p.points||!overlap(bbox(p.points),rect))return false;
    const owner=byRegion.get(p.regionIds?.[0]);
    const macro=owner?.regionType==='subregion'?owner.parentRegionId:owner?.id;
    return macro==='region.kaelvar'||macro==='region.serathyl';
  });
  const points=p=>p.points.map(v=>(v.x-roi.minX)+','+(v.y-roi.minY)).join(' ');
  const edges=relevant.map(p=>{
    const r=byRegion.get(p.regionIds[0]);
    const macro=r.regionType==='subregion'?r.parentRegionId:r.id;
    const ink=macro==='region.kaelvar'?'#2FA9F4':'#EF547D';
    return '<polygon points="'+points(p)+'" fill="none" stroke="'+ink+
      '" stroke-width=".8" vector-effect="non-scaling-stroke"/>';
  }).join('');
  const coast=coastlines.find(p=>p.id==='feature.coastline.first_world.part_10');
  if(!coast)throw Error('Coast 10 coastline no longer matches reviewed provenance');
  const outline='<polygon points="'+points(coast)+
    '" fill="none" stroke="#F1BE54" stroke-width="1.1" vector-effect="non-scaling-stroke"/>';
  const focused='<polygon points="'+points(focus)+'" fill="none" stroke="#FFFFFF" '+
    'stroke-width="1.8" stroke-dasharray="5 2" vector-effect="non-scaling-stroke"/>';
  const zoom=2.3,panelW=roi.width*zoom,panelH=roi.height*zoom;
  const gap=24,edge=20,titleH=120,footer=100;
  const W=Math.ceil(edge*2+3*panelW+2*gap),H=Math.ceil(titleH+panelH+footer);
  const palette=[embeddedCropPng(biomeRgba,width,height,roi),
    embeddedCropPng(elevationRgba,width,height,roi)];
  const panel=(number,label,inside)=>{
    const x=edge+number*(panelW+gap);
    return '<text x="'+x+'" y="91" fill="#243847" font-family="sans-serif" font-size="20">'+label+'</text>'+
      '<svg x="'+x+'" y="'+titleH+'" width="'+panelW+'" height="'+panelH+
      '" viewBox="0 0 '+roi.width+' '+roi.height+'">'+
      '<rect width="'+roi.width+'" height="'+roi.height+'" fill="#294D76"/>'+
      inside+edges+outline+focused+'</svg>';
  };
  const svg=
    '<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+
    '" viewBox="0 0 '+W+' '+H+'">'+
    '<title>Coast 10 paired source ecology and land-ink sensitivity: review only</title>'+
    '<rect width="'+W+'" height="'+H+'" fill="#F6F7F3"/>'+
    '<text x="'+edge+'" y="35" font-family="sans-serif" font-size="25" fill="#12273A">'+
      'Kaelvar Coast 10: source terrain and current boundaries</text>'+
    '<text x="'+edge+'" y="60" font-family="sans-serif" font-size="15" fill="#3B5264">'+
      'Baseline only. Pale/bright are candidate terrain, magenta is unresolved ink. No region transfer approved.</text>'+
    panel(0,'Original biome image (labels uncalibrated)',
      '<image href="'+palette[0]+'" width="'+roi.width+'" height="'+roi.height+'"/>')+
    panel(1,'Original elevation image (not meters)',
      '<image href="'+palette[1]+'" width="'+roi.width+'" height="'+roi.height+'"/>')+
    panel(2,'Terrain-only connectivity + shared ink',
      '<rect width="'+roi.width+'" height="'+roi.height+'" fill="#294D76"/>'+gridPaths)+
    '<text x="'+edge+'" y="'+(H-63)+'" font-family="sans-serif" font-size="15" fill="#243847">'+
      'Blue edges: Kaelvar; pink edges: Serathyl; gold: old Coast 10; dashed white: Windward Part 1.</text>'+
    '<text x="'+edge+'" y="'+(H-37)+'" font-family="sans-serif" font-size="14" fill="#435C6B">'+
      'Bright focus colors distinguish terrain-only physical components, not new territorial regions.</text>'+
    '</svg>\n';
  return {
    svg,
    focusTerrainComponents:highlight.map(([componentId,pixels],i)=>({
      componentId,pixels,displayColor:colorById.get(componentId),rank:i+1,
      semantics:'TERRAIN_ONLY_COMPONENT_ID_NOT_POLITICAL_REGION',
    })),
    readonly:true,
  };
}
