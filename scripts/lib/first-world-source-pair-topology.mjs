/**
 * First World source-pair topology sensitivity. PURE / READ ONLY.
 * Two main hypotheses are deliberately not called "land truth":
 *   terrainOnly: source RGB differs off blue (ink excluded)
 *   inkIncluded: terrain + shared nonblue ink (legacy equivalent when no
 *                blue divergence / alpha disagreement exists)
 * A third allUnresolvedIncluded variant preserves anomalous classes.
 *
 * Changes to connected components are *sensitivity*, not authorization to
 * fill rivers, delete islands, reassign continents or rewrite source masks.
 */
import {labelLandComponents} from './first-world-source-png.mjs';
import {visitRasterPolygon} from './first-world-component-review.mjs';
import {SourcePairClass} from './first-world-source-pair-qa.mjs';

const c=SourcePairClass;
const isTerrain=v=>v===c.DIVERGENT_TERRAIN_CANDIDATE;
const isInk=v=>v===c.SHARED_NONBLUE_UNRESOLVED;
const isUncertain=v=>isInk(v)||v===c.BLUE_DIVERGENCE_UNRESOLVED||
  v===c.ALPHA_UNRESOLVED;
const maxTable=250;
function measure(mask,width,height){
  const four=labelLandComponents(mask,width,height,false);
  const eight=labelLandComponents(mask,width,height,true);
  return {mask,four,eight};
}
function lens(source,base,sourceCells,width,height){
  const {labels,components}=source;
  const table=new Map(components.map(x=>[x.id,{
    permissiveComponentId:x.id,permissivePixels:x.areaPx2,
    bounds:x.bounds,terrainCells:0,uncertainCells:0,
    terrainOnlyFourComponentIds:new Map(),
    terrainOnlyEightComponentIds:new Set(),
  }]));
  for(let i=0;i<sourceCells.length;i++){
    const id=labels[i];
    if(!id)continue;
    const row=table.get(id),value=sourceCells[i];
    if(isTerrain(value))row.terrainCells++;
    else if(isUncertain(value))row.uncertainCells++;
    const fourId=base.four.labels[i];
    if(fourId)row.terrainOnlyFourComponentIds.set(fourId,
      (row.terrainOnlyFourComponentIds.get(fourId)||0)+1);
    const eightId=base.eight.labels[i];
    if(eightId)row.terrainOnlyEightComponentIds.add(eightId);
  }
  const rows=[...table.values()].map(r=>({
    permissiveComponentId:r.permissiveComponentId,
    permissivePixels:r.permissivePixels,
    terrainCandidatePixels:r.terrainCells,
    unresolvedPixels:r.uncertainCells,
    bounds:r.bounds,
    terrainOnlyFourComponentCount:r.terrainOnlyFourComponentIds.size,
    terrainOnlyEightComponentCount:r.terrainOnlyEightComponentIds.size,
    terrainOnlyFourComponentIds:[...r.terrainOnlyFourComponentIds.keys()].sort((a,b)=>a-b),
    terrainOnlyEightComponentIds:[...r.terrainOnlyEightComponentIds].sort((a,b)=>a-b),
  }));
  return rows;
}

export function buildSourcePairTopologySensitivity({width,height,classification}) {
  const size=width*height;
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<=0||
     height<=0||classification?.length!==size)
    throw Error('Invalid source pair topology input');
  const baseMask=new Uint8Array(size),
    inkMask=new Uint8Array(size),maxMask=new Uint8Array(size);
  let inkPixels=0,anomalyPixels=0;
  for(let i=0;i<size;i++){
    const k=classification[i];
    if(k<0||k>c.ALPHA_UNRESOLVED)throw Error('Unknown source pair class: '+k);
    baseMask[i]=isTerrain(k)?1:0;
    inkMask[i]=isTerrain(k)||isInk(k)?1:0;
    maxMask[i]=isTerrain(k)||isUncertain(k)?1:0;
    if(isInk(k))inkPixels++;
    if(k===c.BLUE_DIVERGENCE_UNRESOLVED||k===c.ALPHA_UNRESOLVED)anomalyPixels++;
  }
  const base=measure(baseMask,width,height),
    plus=measure(inkMask,width,height),
    maximum=measure(maxMask,width,height);
  const joined=lens(plus.four,base,classification,width,height);
  const top=joined.filter(r=>r.terrainOnlyFourComponentCount>1)
    .sort((a,b)=>b.terrainOnlyFourComponentCount-a.terrainOnlyFourComponentCount||
      b.permissivePixels-a.permissivePixels||a.permissiveComponentId-b.permissiveComponentId);
  const inkOnly=joined.filter(r=>r.terrainOnlyFourComponentCount===0)
    .sort((a,b)=>b.unresolvedPixels-a.unresolvedPixels||
      a.permissiveComponentId-b.permissiveComponentId);
  const summaries=review=>({
    landCandidatePixels:review.four.components.reduce((s,x)=>s+x.areaPx2,0),
    fourNeighborComponents:review.four.components.length,
    eightNeighborComponents:review.eight.components.length,
    largestFourNeighborComponentPixels:review.four.components.reduce((max,x)=>Math.max(max,x.areaPx2),0),
    singletonFourNeighborComponents:review.four.components.filter(x=>x.areaPx2===1).length,
  });
  const output={
    schemaVersion:1,status:'SENSITIVITY_ONLY_NOT_PHYSICAL_LAND_DECISION',
    referenceGrid:{width,height},
    terrainOnly:summaries(base),sharedInkIncluded:summaries(plus),
    allUnresolvedIncluded:summaries(maximum),
    inkPixels,otherUnresolvedPixels:anomalyPixels,
    legacyThresholdReconciliation:anomalyPixels===0 ?
      'INK_INCLUDED_EQUALS_LEGACY_THRESHOLD_PIXEL_SET':
      'NOT_EQUIVALENT_ALPHA_OR_BLUE_DIVERGENCES_REQUIRE_REVIEW',
    joinedFourNeighborComponentCount:top.length,
    inkOnlyFourNeighborComponentCount:inkOnly.length,
    joinedFourNeighborComponents:top.slice(0,maxTable),
    joinedFourNeighborComponentsTruncated:Math.max(0,top.length-maxTable),
    largestInkOnlyFourNeighborComponents:inkOnly.slice(0,40),
    notes:[
      'Component IDs differ between scenarios and are never political region IDs.',
      'A joined component means unresolved artwork could connect terrain-only pieces. This does not prove a land bridge.',
      'Ink-only components may be rivers, coast outlines, annotations or real tiny features; do not delete from canonical geography.',
      'Thin rivers may split terrain-only components even if coast ink could reconnect them; inspect before deciding water traversal.',
    ],
    sourceWritable:false,
  };
  return {
    summary:output,
    grids:{terrainOnly:base,sharedInkIncluded:plus,allUnresolvedIncluded:maximum},
  };
}

export function summarizeSourcePairPilotFootprints({
  width,height,classification,topology,footprints,selectedIds,
}) {
  const area=width*height;
  if(classification?.length!==area||
    topology?.grids?.terrainOnly?.four?.labels?.length!==area||
    topology.grids.sharedInkIncluded.four.labels.length!==area||
    !Array.isArray(footprints)||!Array.isArray(selectedIds))
    throw Error('Invalid Coast pilot topology input');
  const source=new Map(footprints.map(f=>[f.id,f]));
  return selectedIds.map(id=>{
    const part=source.get(id);
    if(!part)throw Error('Missing reviewed footprint: '+id);
    const rows={
      terrainOnly:new Map(),sharedInkIncluded:new Map(),
    };
    let pixels=0,terrain=0,sharedInk=0,blue=0,other=0;
    visitRasterPolygon(part.points,width,height,index=>{
      pixels++;
      const cl=classification[index];
      if(isTerrain(cl))terrain++;
      else if(isInk(cl))sharedInk++;
      else if(cl===c.SHARED_BLUE_CANDIDATE)blue++;
      else other++;
      const a=topology.grids.terrainOnly.four.labels[index],
        b=topology.grids.sharedInkIncluded.four.labels[index];
      if(a)rows.terrainOnly.set(a,(rows.terrainOnly.get(a)||0)+1);
      if(b)rows.sharedInkIncluded.set(b,(rows.sharedInkIncluded.get(b)||0)+1);
    });
    return {id,footprintPixels:pixels,terrainCandidatePixels:terrain,
      unresolvedSharedInkPixels:sharedInk,blueCandidatePixels:blue,
      otherUnresolvedPixels:other,
      terrainOnlyFourComponents:[...rows.terrainOnly].sort((a,b)=>b[1]-a[1])
        .map(([componentId,pixels])=>({componentId,pixels})),
      sharedInkIncludedFourComponents:[...rows.sharedInkIncluded].sort((a,b)=>b[1]-a[1])
        .map(([componentId,pixels])=>({componentId,pixels})),
      disposition:'REVIEW_ONLY_NOT_POLITICAL_OWNERSHIP',
    };
  });
}
