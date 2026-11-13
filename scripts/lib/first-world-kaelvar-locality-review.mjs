/**
 * First World authored-region locality review: source pixel positions, not
 * inferred region ownership. A shared physical land component is not evidence
 * of a particular biome, political boundary, coastal climate or direction.
 */
import {visitRasterPolygon} from './first-world-component-review.mjs';
import {SourcePairClass} from './first-world-source-pair-qa.mjs';
import {embeddedCropPng} from './first-world-coast10-ecology-review.mjs';

const terrain=SourcePairClass.DIVERGENT_TERRAIN_CANDIDATE;
const palette={
  'feature.region_auric_marches.part_4':'#D9AD3F',
  'feature.region_shattercap_isles.part_7':'#EA8A26',
  'feature.region_shattercap_isles.part_15':'#D05C24',
  'feature.region_verdant_thalos.part_1':'#32A784',
  'feature.region_windward_spine.part_1':'#D34B9B',
};
export const KAELVAR_LOCALITY_IDS=Object.freeze(Object.keys(palette));
const extent=points=>({
  minX:Math.min(...points.map(p=>p.x)), minY:Math.min(...points.map(p=>p.y)),
  maxX:Math.max(...points.map(p=>p.x)), maxY:Math.max(...points.map(p=>p.y)),
});
const boundsOf=ids=>{
  const pts=ids.flatMap(x=>x.points);
  return extent(pts);
};
const closed=points=>points.map(p=>p.x+','+p.y).join(' ');
const warn='SOURCE_TERRAIN_ONLY_PLACEMENT_EVIDENCE_NOT_POLITICAL_OR_BIOME_DECISION';

export function collectKaelvarLocality({
  width,height,classification,terrainLabels,footprints,regions,
  selectedIds=KAELVAR_LOCALITY_IDS,
}) {
  const size=width*height;
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
      classification?.length!==size||terrainLabels?.length!==size||
      !Array.isArray(footprints)||!Array.isArray(regions)||
      !Array.isArray(selectedIds)||!selectedIds.length)
    throw Error('Locality input registration/catalog invalid');
  const ids=[...new Set(selectedIds)];
  const byId=new Map(footprints.map(p=>[p.id,p]));
  const byRegion=new Map(regions.map(r=>[r.id,r]));
  const selected=ids.map(id=>{
    const p=byId.get(id);
    if(!p||!Array.isArray(p.points)||p.points.length<3||
       !byRegion.has(p.regionIds?.[0]))
      throw Error('Locality selected source footprint/owner missing: '+id);
    return p;
  });
  const examined=selected.map(p=>{
    const r=byRegion.get(p.regionIds[0]);
    const macroId=r.regionType==='subregion'?r.parentRegionId:r.id;
    let pixelCount=0,terrainCells=0,inkCells=0,blueCells=0,otherCells=0,
      sumX=0,sumY=0,minX=width,minY=height,maxX=-1,maxY=-1;
    const components=new Map();
    visitRasterPolygon(p.points,width,height,(index,x,y)=>{
      pixelCount++;
      const cl=classification[index];
      if(cl===terrain){
        const id=terrainLabels[index];
        if(!id)throw Error('Terrain-only reference grid has an unlabeled terrain cell');
        const component=components.get(id)||{
          componentId:id,pixels:0,sumX:0,sumY:0,
          bounds:{minX:width,minY:height,maxX:-1,maxY:-1}
        };
        component.pixels++;component.sumX+=x+.5;component.sumY+=y+.5;
        component.bounds.minX=Math.min(component.bounds.minX,x);
        component.bounds.maxX=Math.max(component.bounds.maxX,x);
        component.bounds.minY=Math.min(component.bounds.minY,y);
        component.bounds.maxY=Math.max(component.bounds.maxY,y);
        components.set(id,component);
        terrainCells++;sumX+=x+.5;sumY+=y+.5;
        minX=Math.min(minX,x);maxX=Math.max(maxX,x);
        minY=Math.min(minY,y);maxY=Math.max(maxY,y);
      } else if(cl===SourcePairClass.SHARED_NONBLUE_UNRESOLVED)inkCells++;
      else if(cl===SourcePairClass.SHARED_BLUE_CANDIDATE)blueCells++;
      else otherCells++;
    });
    const parts=[...components.values()].sort((a,b)=>b.pixels-a.pixels||
      a.componentId-b.componentId).map(p=>({
        componentId:p.componentId,pixels:p.pixels,
        bounds:p.bounds,
        terrainCellCenter:{x:Math.round(100*p.sumX/p.pixels)/100,
          y:Math.round(100*p.sumY/p.pixels)/100}
      }));
    return {
      sourcePartId:p.id,regionId:r.id,regionName:r.name??r.id,macroId,
      authoredPositionLabel:r.positionLabel??null,authoredSummary:r.summary??null,
      currentFootprintPixelCount:pixelCount,terrainCandidatePixels:terrainCells,
      unresolvedInkPixels:inkCells,sharedBluePixels:blueCells,
      otherUnresolvedPixels:otherCells,
      terrainCandidateCentroid:terrainCells?{
        x:Math.round(sumX/terrainCells*100)/100,
        y:Math.round(sumY/terrainCells*100)/100}:null,
      terrainCandidateBounds:terrainCells?{minX,minY,maxX,maxY}:null,
      terrainOnlyFourComponents:parts,sourcePolygonBounds:extent(p.points),
      interpretation:warn,
    };
  });
  const anchor=examined.find(x=>x.sourcePartId==='feature.region_auric_marches.part_4');
  const anchorId=anchor?.terrainOnlyFourComponents?.[0]?.componentId??null;
  return {
    schemaVersion:1,status:'KAELVAR_MAINLAND_REGION_LOCALITY_REVIEW_ONLY',
    physicalReference:{
      terrainOnlyMainlandComponentId:anchorId,
      provenance:'Dominant terrain-only component of Auric Marches Part 4; not the political Kaelvar boundary',
    },
    rows:examined.map(x=>({
      ...x,terrainCandidatePixelsOnReferenceComponent:anchorId===null?null:
        x.terrainOnlyFourComponents.find(p=>p.componentId===anchorId)?.pixels??0,
    })),
    uniqueRegionIds:[...new Set(examined.map(x=>x.regionId))],
    notes:[
      'Full polygon terrain-pixel centroids and bounds are geographic references in the 2048x1152 crop.',
      'Four-neighbor component IDs are terrain-only and differ from old ink-inclusive IDs.',
      'A northern island region touching the main component is a localization review trigger, not proof of wrong boundaries.',
      'Source polygon pixel counts can overlap among neighboring authored regions; no union or transfer is claimed.',
      'Neither RGB color similarity nor geographic position alone authorizes a new recipient region.',
    ],
    approvedReplacementBoundary:null,sourceWritable:false,
  };
}

export function kaelvarLocalitySvg({
  width,height,classification,biomeRgba,footprints,regions,
  selectedIds=KAELVAR_LOCALITY_IDS,padding=25,
}) {
  if(classification?.length!==width*height||
    biomeRgba?.length!==width*height*4||
    !Array.isArray(footprints)||!Array.isArray(regions))
    throw Error('Locality SVG source-grid mismatch');
  const byId=new Map(footprints.map(p=>[p.id,p]));
  const selected=selectedIds.map(id=>{
    const p=byId.get(id);
    if(!p||!p.points?.length)throw Error('Missing locality SVG feature '+id);
    return p;
  });
  const b=boundsOf(selected);
  const roi={
    minX:Math.max(0,Math.floor(b.minX)-padding),
    maxX:Math.min(width,Math.ceil(b.maxX)+padding),
    minY:Math.max(0,Math.floor(b.minY)-padding),
    maxY:Math.min(height,Math.ceil(b.maxY)+padding),
  };
  roi.width=roi.maxX-roi.minX;roi.height=roi.maxY-roi.minY;
  if(roi.width<1||roi.height<1)throw Error('Empty Kaelvar locality crop');
  const png=embeddedCropPng(biomeRgba,width,height,roi);
  const layers=[];
  // Terrain-only pixel highlights avoid falsely coloring open-ocean or ink
  // just because existing political polygons currently cover them.
  for(const part of selected){
    const colored=new Uint8Array(roi.width*roi.height);
    visitRasterPolygon(part.points,width,height,(i,x,y)=>{
      if(classification[i]===terrain&&x>=roi.minX&&x<roi.maxX&&
         y>=roi.minY&&y<roi.maxY)
        colored[(y-roi.minY)*roi.width+x-roi.minX]=1;
    });
    const runs=[];
    for(let y=0;y<roi.height;y++){
      let x=0;
      while(x<roi.width){
        if(!colored[y*roi.width+x]){x++;continue;}
        const start=x++;
        while(x<roi.width&&colored[y*roi.width+x])x++;
        runs.push('M'+start+' '+y+'h'+(x-start)+'v1h-'+(x-start)+'z');
      }
    }
    const pts=part.points.map(p=>(p.x-roi.minX)+','+(p.y-roi.minY)).join(' ');
    const color=palette[part.id]??'#777777';
    layers.push('<path fill="'+color+'" fill-opacity=".62" d="'+runs.join('')+'"/>'+
      '<polygon points="'+pts+'" fill="none" stroke="'+color+
      '" stroke-width="1.6" vector-effect="non-scaling-stroke"/>');
  }
  const magnify=1.6,panelW=roi.width*magnify,panelH=roi.height*magnify,
    head=132,gap=28,left=22,foot=100;
  const W=Math.ceil(left*2+2*panelW+gap),
    H=Math.ceil(head+panelH+foot);
  const panel=(n,label,extra='')=>{
    const x=left+n*(panelW+gap);
    return '<text x="'+x+'" y="110" font-family="sans-serif" font-size="18" fill="#1E3C4C">'+
      label+'</text><svg x="'+x+'" y="'+head+'" width="'+panelW+'" height="'+panelH+
      '" viewBox="0 0 '+roi.width+' '+roi.height+'"><image href="'+png+
      '" width="'+roi.width+'" height="'+roi.height+'"/>'+extra+'</svg>';
  };
  const legend=selected.map((p,i)=>'<text x="'+(left+i*240)+'" y="'+(H-54)+
    '" font-family="sans-serif" font-size="14" fill="'+(palette[p.id]??'#333333')+
    '">'+p.id.replace('feature.region_','').replaceAll('_',' ').replace('.part_',' #')+'</text>').join('');
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+
    '" height="'+H+'" viewBox="0 0 '+W+' '+H+'">'+
    '<title>Kaelvar regional locality: current labels, not revised ownership</title>'+
    '<rect width="'+W+'" height="'+H+'" fill="#F7F8F6"/>'+
    '<text x="'+left+'" y="39" font-family="sans-serif" font-size="25" fill="#163044">'+
      'Kaelvar: current Shattercap / Verdant / Auric / Windward placements</text>'+
    '<text x="'+left+'" y="68" font-family="sans-serif" font-size="15" fill="#475A66">'+
      'Existing source polygons only. Terrain-only colored pixels; blue ocean and unresolved shoreline ink preserved.</text>'+
    panel(0,'Original source biome (uncalibrated colors)')+
    panel(1,'Current region footprint highlights, NOT proposed borders',layers.join(''))+
    legend+'<text x="'+left+'" y="'+(H-22)+
    '" font-family="sans-serif" font-size="15" fill="#475A66">'+
      'Shared terrain does not determine northern-island versus southern-peninsula jurisdiction.</text>'+
    '</svg>\n';
  return {svg,roi,readOnly:true};
}
