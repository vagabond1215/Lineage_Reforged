/**
 * K2 first source-palette, apparent-watercourse and elevation-ramp evidence.
 * All geographic samples are derived from original registered PNGs and source
 * feature IDs. Not a biome legend, shoreline, heightmap or sovereign boundary.
 */
import {visitRasterPolygon} from './first-world-component-review.mjs';
import {SourcePairClass} from './first-world-source-pair-qa.mjs';
import {embeddedCropPng} from './first-world-coast10-ecology-review.mjs';

const C=SourcePairClass;
const classNames=[
  'SHARED_BLUE_CANDIDATE','DIVERGENT_TERRAIN_CANDIDATE',
  'SHARED_NONBLUE_UNRESOLVED','BLUE_DIVERGENCE_UNRESOLVED','ALPHA_UNRESOLVED',
];
const focus=Object.freeze([
  {key:'auric_west',id:'feature.region_auric_marches.part_4',mainland:true},
  {key:'shattercap_main',id:'feature.region_shattercap_isles.part_7',mainland:true},
  {key:'verdant_south',id:'feature.region_verdant_thalos.part_1',mainland:true},
  {key:'shattercap_southeast',id:'feature.region_shattercap_isles.part_15',mainland:true},
  {key:'windward_southeast',id:'feature.region_windward_spine.part_1',mainland:true},
  {key:'shattercap_north_island',id:'feature.region_shattercap_isles.part_4',mainland:false},
  {key:'shattercap_east_island',id:'feature.region_shattercap_isles.part_17',mainland:false},
  {key:'coast40_verdant',id:'feature.region_verdant_thalos.part_6',mainland:false},
  {key:'coast40_windward',id:'feature.region_windward_spine.part_2',mainland:false},
]);
const links=Object.freeze([
  ['auric_west','shattercap_main'],
  ['shattercap_main','shattercap_southeast'],
  ['verdant_south','shattercap_southeast'],
  ['verdant_south','windward_southeast'],
  ['shattercap_north_island','shattercap_main'],
  ['windward_southeast','shattercap_east_island'],
  ['coast40_verdant','coast40_windward'],
]);
const color=(bytes,i)=>'#'+[bytes[i*4],bytes[i*4+1],bytes[i*4+2]]
  .map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
const bright=(bytes,i)=>Math.round(.2126*bytes[i*4]+
  .7152*bytes[i*4+1]+.0722*bytes[i*4+2]);
const quantile=(sorted,q)=>sorted.length?sorted[Math.floor((sorted.length-1)*q)]:null;
const counts=()=>Object.fromEntries(classNames.map(k=>[k,0]));
const byCount=m=>[...m].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))
  .slice(0,12).map(([rgb,pixels])=>({rgb,pixels}));
const xy=(i,width)=>({x:i%width,y:Math.floor(i/width)});
function check(input){
  const {width,height,classification,terrainLabels,biomeRgba,elevationRgba,
    footprints,mainlandReferenceId}=input;
  const n=width*height;
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
    classification?.length!==n||terrainLabels?.length!==n||
    biomeRgba?.length!==4*n||elevationRgba?.length!==4*n||
    !Array.isArray(footprints)||!Number.isInteger(mainlandReferenceId)||
    mainlandReferenceId<=0)
    throw Error('K2 original source grid or catalog registration invalid');
  const ids=new Set();
  for(const p of footprints){
    if(ids.has(p.id))throw Error('K2 duplicate source feature ID: '+p.id);
    ids.add(p.id);
  }
  for(const p of focus)
    if(!ids.has(p.id))throw Error('K2 missing original source feature: '+p.id);
}
function inkContext(i,width,height,classification,terrainLabels){
  const x=i%width,y=Math.floor(i/width),neighbors=[];
  if(x>0)neighbors.push(i-1);
  if(x+1<width)neighbors.push(i+1);
  if(y>0)neighbors.push(i-width);
  if(y+1<height)neighbors.push(i+width);
  let blue=false,terrain=false,otherInk=false;
  const componentIds=new Set();
  for(const j of neighbors){
    blue ||= classification[j]===C.SHARED_BLUE_CANDIDATE;
    terrain ||= classification[j]===C.DIVERGENT_TERRAIN_CANDIDATE;
    otherInk ||= classification[j]===C.SHARED_NONBLUE_UNRESOLVED;
    if(classification[j]===C.DIVERGENT_TERRAIN_CANDIDATE)
      componentIds.add(terrainLabels[j]);
  }
  return {fourNeighborBlueCandidate:blue,fourNeighborTerrainCandidate:terrain,
    fourNeighborSharedInk:otherInk,
    adjacentTerrainOnlyComponentIds:[...componentIds].sort((a,b)=>a-b),
    interpretation:'NEIGHBOR_CONTEXT_ONLY_NOT_CONFIRMED_RIVER_OR_COAST'};
}
function anchor(p,info,input){
  const {width,height,classification,terrainLabels,mainlandReferenceId}=input;
  const indices=[];
  visitRasterPolygon(p.points,width,height,i=>{
    if(classification[i]===C.DIVERGENT_TERRAIN_CANDIDATE &&
      (!info.mainland||terrainLabels[i]===mainlandReferenceId))
      indices.push(i);
  });
  if(!indices.length)throw Error('K2 focus source part has no terrain candidates: '+p.id);
  const center=indices.reduce((s,i)=>{s.x+=i%width+.5;s.y+=Math.floor(i/width)+.5;return s;},{x:0,y:0});
  center.x/=indices.length;center.y/=indices.length;
  let best=indices[0],dist=Infinity;
  for(const i of indices){
    const dx=i%width+.5-center.x,dy=Math.floor(i/width)+.5-center.y;
    const d=dx*dx+dy*dy;
    if(d<dist || d===dist&&i<best){best=i;dist=d;}
  }
  return {...info,regionId:p.regionIds?.[0]??null,
    sourceTerrainCellsWithinRequiredComponent:indices.length,
    sourcePixel:xy(best,width),terrainOnlyComponentId:terrainLabels[best],
    provenance:'ORIGINAL_SOURCE_FOOTPRINT_TERRAIN_CENTROID_NEAREST_CELL',
    sovereignAssignmentApproved:false};
}
function windowEvidence(a,input,radius){
  const {width,height,classification,terrainLabels,biomeRgba,elevationRgba}=input;
  const {x,y}=a.sourcePixel,classes=counts(),rgb=new Map(),elevationColors=new Map();
  const elevationLuma=[],elevationChroma=[];
  const samples=[],adjacency={touchesBlueAndTerrain:0,touchesOnlyBlue:0,
    touchesOnlyTerrain:0,touchesNeither:0};
  const minX=Math.max(0,x-radius),maxX=Math.min(width-1,x+radius),
    minY=Math.max(0,y-radius),maxY=Math.min(height-1,y+radius);
  for(let cy=minY;cy<=maxY;cy++)for(let cx=minX;cx<=maxX;cx++){
    const i=cy*width+cx,cl=classification[i];
    if(cl<0||cl>4)throw Error('Unknown K2 source pair class');
    classes[classNames[cl]]++;
    if(cl===C.SHARED_NONBLUE_UNRESOLVED){
      const context=inkContext(i,width,height,classification,terrainLabels);
      const blue=context.fourNeighborBlueCandidate,terrain=context.fourNeighborTerrainCandidate;
      if(blue&&terrain)adjacency.touchesBlueAndTerrain++;
      else if(blue)adjacency.touchesOnlyBlue++;
      else if(terrain)adjacency.touchesOnlyTerrain++;
      else adjacency.touchesNeither++;
      if(samples.length<12 && (blue||terrain))
        samples.push({x:cx,y:cy,sourceBiomeRgb:color(biomeRgba,i),
          sourceElevationRgb:color(elevationRgba,i),...context});
    }
    if(cl!==C.DIVERGENT_TERRAIN_CANDIDATE)continue;
    const bc=color(biomeRgba,i),ec=color(elevationRgba,i);
    rgb.set(bc,(rgb.get(bc)||0)+1);
    elevationColors.set(ec,(elevationColors.get(ec)||0)+1);
    elevationLuma.push(bright(elevationRgba,i));
    const j=i*4;
    elevationChroma.push(Math.max(elevationRgba[j],elevationRgba[j+1],elevationRgba[j+2])-
      Math.min(elevationRgba[j],elevationRgba[j+1],elevationRgba[j+2]));
  }
  elevationLuma.sort((a,b)=>a-b);elevationChroma.sort((a,b)=>a-b);
  const total=Object.values(classes).reduce((x,y)=>x+y,0);
  if(total!==(maxX-minX+1)*(maxY-minY+1))
    throw Error('K2 window source-pair accounting mismatch');
  return {key:a.key,sourcePartId:a.id,anchor:a.sourcePixel,
    sourceRegionId:a.regionId,terrainOnlyComponentId:a.terrainOnlyComponentId,
    windowBoundsInclusive:{minX,maxX,minY,maxY},pixelCount:total,
    sourcePairClasses:classes,sharedInkFourNeighborContext:adjacency,
    representativeUnresolvedInkPixels:samples,
    candidateTerrainPalette:{
      exactBiomeRgbTop:byCount(rgb),
      uniqueExactBiomeRgbCount:rgb.size,
      exactElevationRgbTop:byCount(elevationColors),
      uniqueExactElevationRgbCount:elevationColors.size,
      uncalibratedElevationLuminance:{
        p10:quantile(elevationLuma,.1),median:quantile(elevationLuma,.5),
        p90:quantile(elevationLuma,.9)},
      uncalibratedElevationColorChannelRange:{
        median:quantile(elevationChroma,.5),p90:quantile(elevationChroma,.9)},
      biomeLabel:null,elevationMeters:null,
    },
    interpretationsHeld:['UNKNOWN_BIOME_RGB_LEGEND','UNKNOWN_ELEVATION_COLOR_RAMP',
      'UNKNOWN_RIVER_VS_COAST_VS_ARTWORK_INK']};
}
function lineCells(a,b){
  const cells=[],dx=Math.abs(b.x-a.x),dy=Math.abs(b.y-a.y),
    sx=a.x<b.x?1:-1,sy=a.y<b.y?1:-1;
  let x=a.x,y=a.y,err=dx-dy;
  while(true){
    cells.push({x,y});
    if(x===b.x&&y===b.y)break;
    const e=2*err;
    if(e>-dy){err-=dy;x+=sx;}
    if(e<dx){err+=dx;y+=sy;}
  }
  return cells;
}
function buildTransect(name,start,end,input){
  const {width,height,classification,terrainLabels,biomeRgba,elevationRgba}=input;
  const source=lineCells(start.sourcePixel,end.sourcePixel),classTotals=counts();
  let adjacentInkAtBoth=0,transitions=0,prev=null;
  const sampled=[];
  for(let j=0;j<source.length;j++){
    const {x,y}=source[j],i=y*width+x,cl=classification[i];
    classTotals[classNames[cl]]++;
    if(prev!==null&&prev!==cl)transitions++;
    prev=cl;
    if(cl===C.SHARED_NONBLUE_UNRESOLVED){
      const ctx=inkContext(i,width,height,classification,terrainLabels);
      if(ctx.fourNeighborBlueCandidate&&ctx.fourNeighborTerrainCandidate)
        adjacentInkAtBoth++;
    }
    if(j%4!==0 && j!==source.length-1)continue;
    sampled.push({x,y,sourcePairClass:classNames[cl],
      originalBiomeRgb:color(biomeRgba,i),
      originalElevationRgb:color(elevationRgba,i),
      uncalibratedElevationLuminance:bright(elevationRgba,i),
      terrainOnlyComponentId:cl===C.DIVERGENT_TERRAIN_CANDIDATE?
        terrainLabels[i]:null});
  }
  if(Object.values(classTotals).reduce((a,b)=>a+b,0)!==source.length)
    throw Error('K2 transect source-pair accounting mismatch');
  return {id:name,fromSourcePartId:start.id,toSourcePartId:end.id,
    start:start.sourcePixel,end:end.sourcePixel,
    originalGridCells:source.length,fullPathSourcePairClasses:classTotals,
    fullPathClassTransitions:transitions,
    sharedInkCellsTouchingBothTerrainAndBlue:adjacentInkAtBoth,
    sampleStrideGridCells:4,registeredSourceSamples:sampled,
    warning:'Straight grid line is a diagnostic transect only, not a road, coast, drainage route, slope direction or proposed region border.'};
}
export function buildKaelvarK2SourceProbes(input,{radius=18}={}){
  check(input);
  if(!Number.isInteger(radius)||radius<1||radius>48)
    throw Error('K2 source window radius outside audited diagnostic range');
  const partById=new Map(input.footprints.map(p=>[p.id,p]));
  const anchors=focus.map(info=>anchor(partById.get(info.id),info,input));
  const byKey=new Map(anchors.map(a=>[a.key,a]));
  const windows=anchors.map(a=>windowEvidence(a,input,radius));
  const transects=links.map(([a,b])=>buildTransect(a+'_TO_'+b,byKey.get(a),byKey.get(b),input));
  const sourceIds=new Set(anchors.map(a=>a.id));
  return {schemaVersion:1,status:'K2_RAW_SOURCE_PROBES_NOT_CALIBRATION_APPROVAL',
    referenceGrid:{width:input.width,height:input.height},
    sourceClassification:'SOURCE_PAIR_CANDIDATES_NOT_CERTIFIED_GROUND_TRUTH',
    windowRadiusGridCells:radius,anchors,windows,transects,
    retainedOriginalSourceIds:[...sourceIds],
    coastalInkDetermination:null,biomePaletteLegend:null,elevationTransferFunction:null,
    hydrologyClassification:null,approvedEcologicalZones:null,approvedBorders:null,
    requiredApprovalGates:['E0_SHARED_INK_AND_BLUE_SHORELINE_RIVER_REVIEW',
      'E1_ORIGINAL_BIOME_RGB_LEGEND_OR_OWNER_DISPOSITION',
      'E2_ELEVATION_COLOR_RAMP_OR_OWNER_DISPOSITION',
      'E3_INDEPENDENT_CONNECTED_PATCHES_AND_ECOTONES',
      'E4_ISLAND_C40_WINDWARD_SOVEREIGNTY_HOLDS'],
    sourceWritable:false};
}
export function kaelvarK2SourceProbeSvg(input,options={}){
  const evidence=buildKaelvarK2SourceProbes(input,options);
  const {width,height,classification,biomeRgba,elevationRgba}=input;
  const anchors=evidence.anchors,pts=anchors.map(a=>a.sourcePixel),pad=60;
  const roi={minX:Math.max(0,Math.min(...pts.map(p=>p.x))-pad),
    maxX:Math.min(width,Math.max(...pts.map(p=>p.x))+pad+1),
    minY:Math.max(0,Math.min(...pts.map(p=>p.y))-pad),
    maxY:Math.min(height,Math.max(...pts.map(p=>p.y))+pad+1)};
  roi.width=roi.maxX-roi.minX;roi.height=roi.maxY-roi.minY;
  const b64=[embeddedCropPng(biomeRgba,width,height,roi),
    embeddedCropPng(elevationRgba,width,height,roi)];
  const lines=evidence.transects.map((t,i)=>
    '<line x1="'+(t.start.x-roi.minX)+'" y1="'+(t.start.y-roi.minY)+
    '" x2="'+(t.end.x-roi.minX)+'" y2="'+(t.end.y-roi.minY)+
    '" stroke="'+(i%2?'#4B4A81':'#AB4575')+
    '" stroke-width="1.1" stroke-opacity=".8" stroke-dasharray="3 2"/>').join('');
  const labels=anchors.map((a,i)=>{
    const x=a.sourcePixel.x-roi.minX,y=a.sourcePixel.y-roi.minY;
    return '<circle cx="'+x+'" cy="'+y+'" r="3.2" fill="#102D44" stroke="#FFFFFF" stroke-width="1.1"/>'+
      '<text x="'+(x+5)+'" y="'+(y-3)+'" font-family="sans-serif" font-size="8" fill="#122942" '+
      'stroke="#FFFFFF" stroke-width="1.7" paint-order="stroke">'+(i+1)+': '+a.key+'</text>';
  }).join('');
  // Only the existing shared nonblue ink class is marked magenta.
  // Ocean and river/contour semantics are NOT inferred.
  const runs=[];
  for(let y=roi.minY;y<roi.maxY;y++){
    let x=roi.minX;
    while(x<roi.maxX){
      if(classification[y*width+x]!==C.SHARED_NONBLUE_UNRESOLVED){x++;continue;}
      const first=x++;
      while(x<roi.maxX&&classification[y*width+x]===C.SHARED_NONBLUE_UNRESOLVED)x++;
      runs.push('M'+(first-roi.minX)+' '+(y-roi.minY)+'h'+(x-first)+'v1h-'+(x-first)+'z');
    }
  }
  const sx=1.55,pw=sx*roi.width,ph=sx*roi.height,left=22,gap=20,top=115,
    bottom=110,totalW=Math.ceil(3*pw+2*gap+2*left),totalH=Math.ceil(top+ph+bottom);
  const panel=(i,label,base,layer)=>'<text x="'+(left+i*(pw+gap))+'" y="96" '+
    'font-family="sans-serif" fill="#233C4D" font-size="16">'+label+'</text>'+
    '<svg x="'+(left+i*(pw+gap))+'" y="'+top+'" width="'+pw+'" height="'+ph+
    '" viewBox="0 0 '+roi.width+' '+roi.height+'"><image href="'+base+
    '" width="'+roi.width+'" height="'+roi.height+'"/>'+layer+'</svg>';
  const evidenceOverlay=lines+labels;
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+totalW+
    '" height="'+totalH+'" viewBox="0 0 '+totalW+' '+totalH+'">'+
    '<title>K2 original-source calibration probes; no interpreted biome or borders</title>'+
    '<rect width="'+totalW+'" height="'+totalH+'" fill="#F7F8F6"/>'+
    '<text x="'+left+'" y="34" font-family="sans-serif" font-size="25" fill="#142D42">'+
    'Kaelvar K2: original source color, elevation and shared ink probes</text>'+
    '<text x="'+left+'" y="62" font-family="sans-serif" font-size="15" fill="#415566">'+
    'Source-ID-derived anchors; dashed lines are sampling transects, never proposed borders.</text>'+
    panel(0,'Original biome RGB + sample transects',b64[0],evidenceOverlay)+
    panel(1,'Original elevation RGB (not meters)',b64[1],evidenceOverlay)+
    panel(2,'Unresolved shared ink in magenta',b64[0],
      '<path fill="#E3288F" fill-opacity=".85" d="'+runs.join('')+'"/>'+evidenceOverlay)+
    '<text x="'+left+'" y="'+(totalH-69)+'" font-family="sans-serif" font-size="14" fill="#2A4253">'+
    'Numbers mark original footprint source samples. Blue/black river/coastline artwork requires independent interpretation.</text>'+
    '<text x="'+left+'" y="'+(totalH-42)+'" font-family="sans-serif" font-size="14" fill="#2A4253">'+
    'All biome names, elevation scales, flow directions, island sovereignty, political borders and ecotone widths are held.</text>'+
    '</svg>\n';
  return {svg,roi,readOnly:true,approvedBorders:null,sourceAnchors:anchors.length};
}
