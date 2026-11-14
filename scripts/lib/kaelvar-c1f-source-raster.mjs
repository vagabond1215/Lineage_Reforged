/**
 * C1-F source pair review raster. The two original PNGs are independently
 * registered. Blue and shared ink remain unresolved; divergent off-blue RGB
 * is only a terrain candidate, never a certified biome or sovereign land.
 */
import {labelLandComponents} from './kaelvar-c1f-source-png.mjs';

const hold=s=>{throw Error('C1-F terrain HOLD: '+s);};
export function registeredTerrainCandidates({biome,elevation,crop,width,height}){
  if(!biome?.rgba||!elevation?.rgba||
    biome.width!==4096||elevation.width!==4096||
    biome.height!==2355||elevation.height!==2355||
    !crop||crop.x!==60||crop.y!==60||crop.width!==3976||
    crop.height!==2235||width!==2048||height!==1152)
    hold('source PNG size or registered crop drift');
  const mask=new Uint8Array(width*height);
  for(let y=0;y<height;y++){
    const sy=crop.y+Math.min(crop.height-1,
      Math.floor((y+.5)*crop.height/height));
    for(let x=0;x<width;x++){
      const sx=crop.x+Math.min(crop.width-1,
        Math.floor((x+.5)*crop.width/width));
      const i=(sy*biome.width+sx)*4,k=y*width+x;
      const br=biome.rgba[i],bg=biome.rgba[i+1],bb=biome.rgba[i+2];
      const er=elevation.rgba[i],eg=elevation.rgba[i+1],eb=elevation.rgba[i+2];
      const blue=bb>150&&bb-bg>25&&bb-br>80;
      const shared=br===er&&bg===eg&&bb===eb;
      const validAlpha=biome.rgba[i+3]>0&&
        biome.rgba[i+3]===elevation.rgba[i+3];
      mask[k]=validAlpha&&!blue&&!shared?1:0;
    }
  }
  return mask;
}
export function checkedC1FMainland(mask,width=2048,height=1152){
  const {labels,components}=labelLandComponents(mask,width,height,false);
  const main=components.find(c=>c.id===30);
  if(!main||main.areaPx2!==79419)
    hold('terrain-only mainland component 30/79419 witness drift');
  return {labels,main,componentCount:components.length};
}
const pip=(ring,x,y)=>{
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const a=ring[i],b=ring[j];
    if((a.y>y)!==(b.y>y)&&x<
      (b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)
      inside=!inside;
  }
  return inside;
};
export function buildC1FPreview({spec,labels,width=2048,height=1152}){
  if(labels?.length!==width*height)
    hold('terrain component reference size mismatch');
  const ownership=new Uint8Array(labels.length),rows=[];
  const guides=spec.regionGuides.filter(g=>g.guidePolygon!==null);
  for(let region=0;region<guides.length;region++){
    const guide=guides[region],ring=guide.guidePolygon;
    const xmin=Math.max(0,Math.floor(Math.min(...ring.map(p=>p.x))));
    const xmax=Math.min(width,Math.ceil(Math.max(...ring.map(p=>p.x))));
    const ymin=Math.max(0,Math.floor(Math.min(...ring.map(p=>p.y))));
    const ymax=Math.min(height,Math.ceil(Math.max(...ring.map(p=>p.y))));
    let guideCandidateCells=0,previewCandidateCells=0;
    for(let y=ymin;y<ymax;y++)for(let x=xmin;x<xmax;x++){
      if(!pip(ring,x+.5,y+.5))continue;
      guideCandidateCells++;
      const i=y*width+x;
      if(labels[i]!==30)continue;
      if(ownership[i])hold('mainland candidate guide collision');
      ownership[i]=region+1;previewCandidateCells++;
    }
    if(!previewCandidateCells)hold('empty source-constrained preview '+guide.regionId);
    rows.push({
      regionId:guide.regionId,
      placementRule:guide.authoredPlacementRule,
      untrustedRawGuidePixels:guideCandidateCells,
      sourceConstrainedTerrainCandidateCells:previewCandidateCells,
      guideOnly:true,sourceColorBiomeCalibrationApproved:false,
    });
  }
  let assigned=0,main=0;
  for(let i=0;i<labels.length;i++){
    if(labels[i]===30)main++;
    if(ownership[i])assigned++;
  }
  if(main!==79419||assigned>=main)
    hold('mainland witness drift or forced complete coverage');
  return {
    ownership,rows,
    totalMainlandTerrainCandidateCells:main,
    previewAssignedCandidateCells:assigned,
    unassignedMainlandCandidateCells:main-assigned,
    islandAssignedCells:0,
    terrainSourceStatus:'DIVERGENT_SOURCE_PAIR_CANDIDATE_ONLY',
  };
}
