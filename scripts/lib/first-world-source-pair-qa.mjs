/**
 * Read-only, conservative comparison of original First World source layers.
 * Shared blue/ink pixels are candidate evidence only, not certified water.
 * Differing biome/elevation pixels are candidate terrain only, not an
 * authorized jurisdictional boundary or biome/elevation interpretation.
 */
import {visitRasterPolygon} from './first-world-component-review.mjs';

export const SourcePairClass=Object.freeze({
  SHARED_BLUE_CANDIDATE:0,
  DIVERGENT_TERRAIN_CANDIDATE:1,
  SHARED_NONBLUE_UNRESOLVED:2,
  BLUE_DIVERGENCE_UNRESOLVED:3,
  ALPHA_UNRESOLVED:4,
});
const names=[
  'SHARED_BLUE_CANDIDATE',
  'DIVERGENT_TERRAIN_CANDIDATE',
  'SHARED_NONBLUE_UNRESOLVED',
  'BLUE_DIVERGENCE_UNRESOLVED',
  'ALPHA_UNRESOLVED',
];
const hex=i=>'#'+(i>>>0).toString(16).padStart(6,'0').toUpperCase();
const summaryFromCounts=(counts,total)=>Object.fromEntries(
  names.map((name,index)=>[name,{
    pixels:counts[index],
    sharePercent:total?Number((100*counts[index]/total).toFixed(3)):0,
  }]),
);
export function classifySourcePair({width,height,biomeRgba,elevationRgba}) {
  const total=width*height;
  if(!Number.isInteger(width)||!Number.isInteger(height)||
     width<1||height<1||biomeRgba?.length!==total*4||
     elevationRgba?.length!==total*4)
    throw Error('Source-pair registration mismatch');
  const classification=new Uint8Array(total);
  const counts=new Uint32Array(names.length);
  const unknownColors=new Map();
  let legacyLandPixels=0,sharedPartialAlphaPixels=0,alphaMismatchPixels=0;
  for(let i=0;i<total;i++){
    const p=i*4,r=biomeRgba[p],g=biomeRgba[p+1],b=biomeRgba[p+2];
    const blue=b>150 && b-g>25 && b-r>80;
    if(!blue)legacyLandPixels++;
    const shared=r===elevationRgba[p]&&g===elevationRgba[p+1]&&
      b===elevationRgba[p+2];
    const biomeAlpha=biomeRgba[p+3],elevationAlpha=elevationRgba[p+3];
    if(biomeAlpha<255 && biomeAlpha===elevationAlpha)sharedPartialAlphaPixels++;
    if(biomeAlpha!==elevationAlpha)alphaMismatchPixels++;
    let c;
    if(biomeAlpha!==elevationAlpha || biomeAlpha===0)
      c=SourcePairClass.ALPHA_UNRESOLVED;
    else if(blue)
      c=shared?SourcePairClass.SHARED_BLUE_CANDIDATE:
        SourcePairClass.BLUE_DIVERGENCE_UNRESOLVED;
    else c=shared?SourcePairClass.SHARED_NONBLUE_UNRESOLVED:
      SourcePairClass.DIVERGENT_TERRAIN_CANDIDATE;
    classification[i]=c;counts[c]++;
    if(c===SourcePairClass.SHARED_NONBLUE_UNRESOLVED){
      const color=(r<<16)|(g<<8)|b;
      unknownColors.set(color,(unknownColors.get(color)||0)+1);
    }
  }
  // Four-neighbor context is a diagnostic, never a flood-fill.
  const neighbors={touchesBoth:0,onlyBlue:0,onlyTerrain:0,neither:0};
  for(let i=0;i<total;i++){
    if(classification[i]!==SourcePairClass.SHARED_NONBLUE_UNRESOLVED)continue;
    const x=i%width,y=(i-x)/width;
    let water=false,terrain=false;
    const ids=[];
    if(x>0)ids.push(i-1);
    if(x+1<width)ids.push(i+1);
    if(y>0)ids.push(i-width);
    if(y+1<height)ids.push(i+width);
    for(const j of ids){
      water ||= classification[j]===SourcePairClass.SHARED_BLUE_CANDIDATE;
      terrain ||= classification[j]===SourcePairClass.DIVERGENT_TERRAIN_CANDIDATE;
    }
    if(water&&terrain)neighbors.touchesBoth++;
    else if(water)neighbors.onlyBlue++;
    else if(terrain)neighbors.onlyTerrain++;
    else neighbors.neither++;
  }
  const uncertain=counts[SourcePairClass.SHARED_NONBLUE_UNRESOLVED]+
    counts[SourcePairClass.BLUE_DIVERGENCE_UNRESOLVED]+
    counts[SourcePairClass.ALPHA_UNRESOLVED];
  return {classification,width,height,
    report:{
      schemaVersion:1,policy:'SOURCE_PAIR_DIAGNOSTIC_NO_REALLOCATIONS',
      imageReferencePixels:total,legacyThresholdLandPixels:legacyLandPixels,
      legacyThresholdBluePixels:total-legacyLandPixels,
      sharedPartialAlphaPixels,alphaMismatchPixels,
      candidateClasses:summaryFromCounts(counts,total),
      sharedNonblueNeighborContext:neighbors,
      sharedNonblueTopSourceRgb:[...unknownColors.entries()]
        .sort((a,b)=>b[1]-a[1]||a[0]-b[0]).slice(0,24)
        .map(([rgb,pixels])=>({rgb:hex(rgb),pixels})),
      unresolvedRasterPixels:uncertain,
      adjudicatedRasterPixels:0,
      sourceGeometryWritable:false,
      warning:'Matching partial alpha is coast anti-alias evidence, not missing data. Shared blue, divergent terrain, and shared ink are pixel evidence classes, NOT final land/water, height or biome labels.',
    },
  };
}

export function sourcePairFootprintRows({
  width,height,classification,footprints,regionById,
}) {
  if(classification?.length!==width*height||!Array.isArray(footprints)||
     !(regionById instanceof Map))throw Error('Source pair footprint inputs invalid');
  return footprints.map(p=>{
    const regionId=p.regionIds?.[0],region=regionById.get(regionId);
    if(!region)throw Error('Unknown region owner in source pair evidence: '+p.id);
    const macroId=region.regionType==='subregion'?region.parentRegionId:region.id;
    const counts=new Uint32Array(names.length);
    visitRasterPolygon(p.points,width,height,i=>counts[classification[i]]++);
    const total=counts.reduce((a,b)=>a+b,0);
    return {
      id:p.id,regionId,macroId,footprintCells:total,
      candidateClasses:summaryFromCounts(counts,total),
      resolution:'BASELINE_LABELS_ONLY_UNAPPROVED',
    };
  });
}

export function sourcePairQaSvg(classification,width,height) {
  if(classification?.length!==width*height)throw Error('QA dimensions mismatch');
  const paths=[[],[],[],[],[]];
  // Fill background with candidate water; draw terrain and ambiguity on top.
  for(let y=0;y<height;y++){
    let x=0;
    while(x<width){
      const c=classification[y*width+x],start=x++;
      while(x<width&&classification[y*width+x]===c)x++;
      if(c!==SourcePairClass.SHARED_BLUE_CANDIDATE)
        paths[c].push('M'+start+' '+y+'h'+(x-start)+'v1h-'+(x-start)+'z');
    }
  }
  const shades=['#294D76','#C3DDAD','#D64A9A','#F2C341','#89828C'];
  const layers=paths.map((p,i)=>
    i===0?'':'<path fill="'+shades[i]+'" d="'+p.join('')+'"/>').join('');
  const header='<rect width="'+width+'" height="46" fill="#f3f4f4"/>'+
    '<text x="16" y="28" font-family="sans-serif" font-size="18" fill="#182633">'+
    'Source pair QA: pale terrain candidate; pink shared ink; gold blue mismatch</text>';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+
    width+' '+(height+46)+'" width="'+width+'" height="'+(height+46)+
    '"><title>Unapproved two-source land and water classification diagnostic</title>'+
    header+'<g transform="translate(0 46)"><rect width="'+width+
    '" height="'+height+'" fill="'+shades[0]+'"/>'+layers+'</g></svg>\n';
}
