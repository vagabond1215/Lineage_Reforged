/**
 * Review-only source environment profiles, never a biome classifier.
 *
 * Exact source RGB and relative image brightness are evidence. Without a
 * reviewed source color legend and elevation scale, neither may be silently
 * translated to forest, desert, alpine, farmland or physical meters.
 */
import {visitRasterPolygon} from './first-world-component-review.mjs';

export function registeredRgba(png,rect,width,height) {
  if(!png?.rgba || ![rect?.x,rect?.y,rect?.width,rect?.height,width,height]
      .every(Number.isInteger) || width<=0 || height<=0 ||
      rect.width<=0 || rect.height<=0 || rect.x<0 || rect.y<0 ||
      rect.x+rect.width>png.width || rect.y+rect.height>png.height)
    throw Error('Invalid source PNG registration for environment evidence');
  const out=new Uint8Array(width*height*4);
  for(let y=0;y<height;y++){
    const sy=rect.y+Math.min(rect.height-1,Math.floor((y+.5)*rect.height/height));
    for(let x=0;x<width;x++){
      const sx=rect.x+Math.min(rect.width-1,Math.floor((x+.5)*rect.width/width));
      const from=(sy*png.width+sx)*4,to=(y*width+x)*4;
      out[to]=png.rgba[from];out[to+1]=png.rgba[from+1];
      out[to+2]=png.rgba[from+2];out[to+3]=png.rgba[from+3];
    }
  }
  return out;
}

const hex=rgb=>rgb.toString(16).padStart(6,'0').toUpperCase();
const topColors=(hist,limit)=>[...hist.entries()].sort((a,b)=>
  b[1]-a[1] || a[0]-b[0]).slice(0,limit).map(([color,pixels])=>({
    rgb:'#'+hex(color),pixels
  }));
const percentile=(hist,total,p)=>{
  if(!total)return null;
  const target=Math.max(1,Math.ceil(total*p));
  let count=0;
  for(let i=0;i<hist.length;i++){
    count+=hist[i];
    if(count>=target)return i;
  }
  return hist.length-1;
};
function aggregate(name,expected={}) {
  return {name,expected,
    landCells:0,waterWithinPolygonCells:0,
    sourceBiomeColors:new Map(),
    sourceElevationLuma:new Uint32Array(256),
    elevationNearGrayCells:0,elevationColorCells:0,
    zeroAlphaBiomePixels:0,zeroAlphaElevationPixels:0};
}
function collect(row,i,land,biome,elevation) {
  if(!land){row.waterWithinPolygonCells++;return;}
  row.landCells++;
  const p=i*4,r=biome[p],g=biome[p+1],b=biome[p+2];
  const packed=(r<<16)|(g<<8)|b;
  row.sourceBiomeColors.set(packed,(row.sourceBiomeColors.get(packed)||0)+1);
  if(biome[p+3]<128)row.zeroAlphaBiomePixels++;
  const er=elevation[p],eg=elevation[p+1],eb=elevation[p+2];
  const light=Math.max(0,Math.min(255,Math.round(.2126*er+.7152*eg+.0722*eb)));
  row.sourceElevationLuma[light]++;
  if(Math.max(er,eg,eb)-Math.min(er,eg,eb)<=2)
    row.elevationNearGrayCells++;
  else row.elevationColorCells++;
  if(elevation[p+3]<128)row.zeroAlphaElevationPixels++;
}
function summarize(row) {
  const n=row.landCells,h=row.sourceElevationLuma;
  return {name:row.name,expected:row.expected,landCells:n,
    waterWithinPolygonCells:row.waterWithinPolygonCells,
    uniqueBiomeRgbColors:row.sourceBiomeColors.size,
    topSourceBiomeColors:topColors(row.sourceBiomeColors,16).map(c=>({
      ...c,sharePercent:n?Number((100*c.pixels/n).toFixed(2)):0
    })),
    elevationRawLuma:{
      p10:percentile(h,n,.1),median:percentile(h,n,.5),
      p90:percentile(h,n,.9),
      nearGraySharePercent:n?Number((100*row.elevationNearGrayCells/n).toFixed(2)):0,
      coloredSharePercent:n?Number((100*row.elevationColorCells/n).toFixed(2)):0,
      interpretation:'UNVERIFIED_ELEVATION_ENCODING_NOT_METERS',
    },
    sourceAlphaWarnings:{
      biomeLowAlpha:row.zeroAlphaBiomePixels,
      elevationLowAlpha:row.zeroAlphaElevationPixels,
    },
    ecologicalDisposition:'SOURCE_RGB_AND_ELEVATION_MEASURED_BIOME_LABELS_UNVERIFIED',
  };
}

/**
 * Each canonical region and continent is counted as a *union* of source
 * footprint pixels; same-child and same-macro overlaps do not double count.
 * Individual footprint profiles remain separate for transfer candidates.
 */
export function buildEnvironmentProfiles({
  width,height,biomeRgba,elevationRgba,landMask,footprints,regions,
  ecologyProfiles=[],
}) {
  const size=width*height;
  if(!Number.isInteger(width)||!Number.isInteger(height) || width<=0||height<=0 ||
    biomeRgba?.length!==size*4 || elevationRgba?.length!==size*4 ||
    landMask?.length!==size || !Array.isArray(footprints) ||
    !Array.isArray(regions)||!Array.isArray(ecologyProfiles))
    throw Error('Environment profile input dimensions or catalogs invalid');
  const byRegion=new Map(regions.map(r=>[r.id,r]));
  if(byRegion.size!==regions.length)throw Error('Duplicate authored region id');
  const macros=regions.filter(r=>r.regionType==='continent'||r.regionType==='island_system');
  const primaryIds=[...new Set(footprints.map(p=>p.regionIds?.[0]))].sort();
  if(primaryIds.length>32||macros.length>16)
    throw Error('Source region bitset exceeds supported number of owners');
  const childCode=new Map(primaryIds.map((id,i)=>[id,(1<<i)>>>0]));
  const macroCode=new Map(macros.map((m,i)=>[m.id,1<<i]));
  const childGrid=new Uint32Array(size),macroGrid=new Uint16Array(size);
  const featureRows=[];
  const authoring=r=>({
    name:r?.name??'',
    positionLabel:r?.positionLabel??null,
    dominantBiomeMix:r?.environmentProfile?.dominantBiomeMix??[],
    elevationProfile:r?.environmentProfile?.elevationProfile??null,
    climateTendencies:r?.environmentProfile?.climateTendencies??[],
    agriculturalPotential:r?.environmentProfile?.agriculturalPotential??null,
    summary:r?.summary??null,
    ecologySource:ecologyProfiles.find(x=>x.regionId===r?.id)?.dominantBiomeIds??[],
  });
  for(const p of footprints){
    const owner=p.regionIds?.[0],r=byRegion.get(owner);
    if(!r)throw Error('Unknown source footprint owner: '+p.id);
    const macroId=r.regionType==='subregion'?r.parentRegionId:r.id;
    if(!macroCode.has(macroId))throw Error('Unknown source footprint macro: '+p.id);
    const row=aggregate(p.id,authoring(r));
    visitRasterPolygon(p.points,width,height,i=>{
      collect(row,i,landMask[i]===1,biomeRgba,elevationRgba);
      if(landMask[i]){
        childGrid[i]|=childCode.get(owner);
        macroGrid[i]|=macroCode.get(macroId);
      }
    });
    featureRows.push({id:p.id,regionId:owner,macroId,...summarize(row)});
  }
  const rows=new Map();
  for(const id of [...primaryIds,...macros.map(m=>m.id)]) {
    if(rows.has(id))continue;
    const r=byRegion.get(id);
    rows.set(id,aggregate(id,authoring(r)));
  }
  let unassignedLand=0,crossMacroOverlap=0,sameMacroChildOverlap=0;
  const popcount=m=>{let n=m>>>0,c=0;while(n){n&=n-1;c++;}return c;};
  for(let i=0;i<size;i++){
    if(!landMask[i])continue;
    const ch=childGrid[i],mac=macroGrid[i];
    if(!ch)unassignedLand++;
    if(popcount(mac)>1)crossMacroOverlap++;
    if(popcount(mac)===1&&popcount(ch)>1)sameMacroChildOverlap++;
    for(let j=0;j<primaryIds.length;j++)
      if(!macroCode.has(primaryIds[j]) && (ch & ((1<<j)>>>0)))
        collect(rows.get(primaryIds[j]),i,true,biomeRgba,elevationRgba);
    for(let j=0;j<macros.length;j++)
      if(mac & (1<<j))collect(rows.get(macros[j].id),i,true,biomeRgba,elevationRgba);
  }
  return {
    schemaVersion:1,
    scope:'NATIVE_PNG_RGB_AND_RAW_ELEVATION_EVIDENCE_ONLY',
    independentBiomeInterpretation:'BLOCKED_PENDING_APPROVED_SOURCE_PALETTE',
    elevationInterpretation:'BLOCKED_PENDING_APPROVED_HEIGHT_SCALE_AND_ENCODING',
    farmlandInterpretation:'CULTIVATED_LAND_USE_REQUIRES_SEPARATE_EVIDENCE_NOT_INFERRED_FROM_BIOME_RGB',
    counts:{sourceFootprints:featureRows.length,regionProfiles:rows.size,
      unassignedRasterLandCells:unassignedLand,
      directCrossMacroOverlapRasterLandCells:crossMacroOverlap,
      directSameMacroChildOverlapRasterLandCells:sameMacroChildOverlap},
    regionProfiles:[...rows.entries()].map(([id,row])=>({regionId:id,...summarize(row)})),
    footprintProfiles:featureRows,
  };
}
