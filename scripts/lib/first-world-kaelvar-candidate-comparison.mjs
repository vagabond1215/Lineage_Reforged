/**
 * Kaelvar A/B geographic comparison: source-raster review windows, NOT borders.
 * This module makes no political owner decisions and never writes source files.
 */
import {visitRasterPolygon} from './first-world-component-review.mjs';
import {SourcePairClass} from './first-world-source-pair-qa.mjs';
import {embeddedCropPng} from './first-world-coast10-ecology-review.mjs';

const T=SourcePairClass.DIVERGENT_TERRAIN_CANDIDATE;
const INK=SourcePairClass.SHARED_NONBLUE_UNRESOLVED;
const BLUE=SourcePairClass.SHARED_BLUE_CANDIDATE;
const A='region.auric_marches',V='region.verdant_thalos';
const S='region.shattercap_isles',W='region.windward_spine';
const bits=new Map([[A,1],[V,2],[S,4],[W,8]]);
const focalIds=new Set([
  'feature.region_shattercap_isles.part_7',
  'feature.region_shattercap_isles.part_15',
  'feature.region_windward_spine.part_1',
]);
const share=(a,b)=>b?Number((a*100/b).toFixed(2)):null;
const round=n=>Number(n.toFixed(2));
const hex=(r,g,b)=>'#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
function check({width,height,classification,terrainLabels,footprints,regions,biomeRgba,elevationRgba,mainlandReferenceId}){
  const n=width*height;
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
     classification?.length!==n||terrainLabels?.length!==n||
     biomeRgba?.length!==n*4||elevationRgba?.length!==n*4||
     !Array.isArray(footprints)||!Array.isArray(regions)||
     !Number.isInteger(mainlandReferenceId)||mainlandReferenceId<=0)
    throw Error('Kaelvar comparison source registration/catalog invalid');
  if(new Set(footprints.map(p=>p.id)).size!==footprints.length)
    throw Error('Duplicate source footprint identity');
  for(const id of [A,V,S,W])
    if(!regions.some(r=>r.id===id))throw Error('Missing authored region: '+id);
  for(const id of focalIds)
    if(!footprints.some(p=>p.id===id))throw Error('Missing focal source part: '+id);
}
function histogramSummary(pixels,biomeRgba,elevationRgba){
  const colors=new Map(),brightness=[];
  for(const i of pixels){
    const p=i*4,key=hex(biomeRgba[p],biomeRgba[p+1],biomeRgba[p+2]);
    colors.set(key,(colors.get(key)||0)+1);
    // Diagnostic relative RGB luminance, not physical height or relief.
    brightness.push(Math.round(.2126*elevationRgba[p]+
      .7152*elevationRgba[p+1]+.0722*elevationRgba[p+2]));
  }
  brightness.sort((a,b)=>a-b);
  const q=k=>brightness.length?brightness[Math.floor((brightness.length-1)*k)]:null;
  return {sampleTerrainCells:pixels.length,
    sourceBiomeExactRgbTop:[...colors].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))
      .slice(0,8).map(([rgb,cells])=>({rgb,cells})),
    sourceElevationUncalibratedLuminance:{p10:q(.1),median:q(.5),p90:q(.9)},
    semanticBiomeClass:null,physicalElevationMeters:null};
}
export function buildKaelvarCandidateComparison(input){
  check(input);
  const {width,height,classification,terrainLabels,footprints,regions,
    biomeRgba,elevationRgba,mainlandReferenceId}=input;
  const n=width*height, ownership=new Uint8Array(n),
    shattercap=new Uint8Array(n),windward=new Uint8Array(n),
    easternTest=new Uint8Array(n);
  const regionById=new Map(regions.map(r=>[r.id,r]));
  const selected=footprints.filter(p=>bits.has(p.regionIds?.[0])&&
    (p.regionIds[0]!==W||
      ['feature.region_windward_spine.part_1','feature.region_windward_spine.part_2'].includes(p.id)));
  const provenance=[];
  for(const p of selected){
    const regionId=p.regionIds[0],bit=bits.get(regionId);
    const terrainPixels=[];
    let polygonCells=0,mainland=0,detached=0,ink=0,blue=0,other=0;
    const components=new Map();
    visitRasterPolygon(p.points,width,height,i=>{
      polygonCells++;
      const type=classification[i];
      if(type!==T){
        if(type===INK)ink++;
        else if(type===BLUE)blue++;
        else other++;
        return;
      }
      const componentId=terrainLabels[i];
      if(!componentId)throw Error('Terrain candidate missing physical component');
      ownership[i]|=bit;
      if(regionId===S)shattercap[i]=1;
      if(regionId===W)windward[i]=1;
      if(focalIds.has(p.id))easternTest[i]=1;
      if(componentId===mainlandReferenceId)mainland++;else detached++;
      components.set(componentId,(components.get(componentId)||0)+1);
      terrainPixels.push(i);
    });
    const authored=regionById.get(regionId);
    provenance.push({
      sourcePartId:p.id,authoredRegionId:regionId,
      authoredPositionLabel:authored.positionLabel??null,
      polygonCells,terrainCandidateCells:terrainPixels.length,
      mainlandTerrainCells:mainland,detachedTerrainCells:detached,
      sharedInkUnresolvedCells:ink,sharedBlueCandidateCells:blue,
      otherUnresolvedCells:other,
      physicalComponentMemberships:[...components].sort((a,b)=>b[1]-a[1]||a[0]-b[0])
        .map(([componentId,cells])=>({componentId,cells})),
      ecology:histogramSummary(terrainPixels,biomeRgba,elevationRgba),
      layoutA:'SOURCE_WINDOW_ONLY_NO_ASSIGNED_REPLACEMENT_BORDER',
      layoutB:focalIds.has(p.id)?
        'EASTERN_ECOLOGICAL_ELIGIBILITY_TEST_ONLY_NOT_POLITICAL_BORDER':
        'SOURCE_WINDOW_ONLY_NO_ASSIGNED_REPLACEMENT_BORDER',
    });
  }
  if(provenance.filter(p=>p.authoredRegionId===S).length!==15)
    throw Error('Shattercap 15-part inventory drift');
  let candidateTerrainMainland=0,heldUnique=0,heldOverlaps=0,
    originalChildOverlap=0,easternTestMainland=0,heldDetached=0;
  const regionPixels=new Map([[A,[]],[V,[]],[S,[]],[W,[]]]);
  for(let i=0;i<n;i++){
    if(classification[i]!==T)continue;
    const mainland=terrainLabels[i]===mainlandReferenceId;
    const mask=ownership[i];
    for(const [id,bit] of bits)if(mask&bit)regionPixels.get(id).push(i);
    if(mainland)candidateTerrainMainland++;
    if(mainland && ((mask&1)!==0)+((mask&2)!==0)+((mask&4)!==0)>1)
      originalChildOverlap++;
    if(shattercap[i]||windward[i]){
      heldUnique++;
      if(shattercap[i]&&windward[i])heldOverlaps++;
      if(!mainland)heldDetached++;
    }
    if(mainland&&easternTest[i])easternTestMainland++;
  }
  const authoredExpectations=[A,V,S,W].map(id=>{
    const r=regionById.get(id);
    return {regionId:id,positionLabel:r.positionLabel??null,
      authoredBiomeExpectation:r.environmentProfile?.dominantBiomeMix??[],
      authoredElevationExpectation:r.environmentProfile?.elevationProfile??null,
      observedSourceRaster:histogramSummary(regionPixels.get(id),biomeRgba,elevationRgba),
      ecologicalSuitability:'BLOCKED_UNCALIBRATED_PALETTE_ELEVATION_AND_WATER',
      boundaryAccepted:false};
  });
  return {
    schemaVersion:1,status:'SOURCE_ALIGNED_A_VS_B_REVIEW_ONLY',
    referenceGrid:{width,height},mainlandReferenceId,
    sourceClassification:'DIVERGENT_TERRAIN_CANDIDATE_NOT_CERTIFIED_DRY_LAND',
    existing:{candidateTerrainMainlandCells:candidateTerrainMainland,
      originalKaelvarChildOverlapTerrainCells:originalChildOverlap},
    candidateHold:{uniqueTerrainCellsAcrossShattercapAndWindward:heldUnique,
      heldMainlandCells:heldUnique-heldDetached,heldDetachedCells:heldDetached,
      shattercapWindwardJointMembershipTerrainCells:heldOverlaps},
    layoutA:{id:'EXISTING_THREE_CHILD_REGIONS_UNAPPROVED',
      proposedPolygons:null,approvedUnassignedArea:null,
      test:'Auric west, Verdant south, Shattercap justified northern fringe; every contested pixel withheld until independent ecology and sovereign masks exist.'},
    layoutB:{id:'UNAPPROVED_EASTERN_MAINLAND_CANDIDATE',
      proposedPolygons:null,approvedUnassignedArea:null,
      easternSourceFootprintTestWindowMainlandCells:easternTestMainland,
      warning:'This sampling window is the UNION of existing parts 7, 15 and Windward 1. It includes northern terrain; it is NOT a proposed eastern border or new regional area.',
      test:'Prove contiguous distinctive biome, relief, drainage and coastal fit before proposing a fourth child.'},
    authoredExpectations,sourcePartProvenance:provenance,
    hardHolds:['E0_SHORELINE_RIVERS_INK','E1_SOURCE_BIOME_RGB_LEGEND',
      'E2_ELEVATION_RAMP','E3_ECOLOGICAL_CONTIGUITY',
      'E4_ECOTONE_BANDS','E5_SETTLEMENT_ROUTE_HEX_DEPENDENCIES',
      'E6_OWNER_EXPLICIT_POLITICAL_APPROVAL'],
    overlaysAreOriginalSourceFootprintsNotNewBorders:true,
    sourceWritable:false,
  };
}
function filledRuns({roi,width,classification,terrainLabels,ownership,mode,mainlandReferenceId}){
  const paths=new Map();
  const sample=(x,y)=>{
    const i=(y+roi.minY)*width+x+roi.minX;
    if(classification[i]!==T)return null;
    const b=ownership[i],main=terrainLabels[i]===mainlandReferenceId;
    if(mode===0){
      if((b&1&&b&2)||(b&1&&b&4)||(b&2&&b&4))return '#D14A58';
      if(b&8)return '#CE4AA0';
      if(b&4)return '#D8953A';
      if(b&2)return '#329D75';
      if(b&1)return '#B49A48';
      return null;
    }
    if(b&8)return '#CE4AA0';
    if(b&4)return main?'#F0A14B':'#36AFBC';
    if(b&2)return '#329D75';
    if(b&1)return '#B49A48';
    return null;
  };
  for(let y=0;y<roi.height;y++){
    let x=0;
    while(x<roi.width){
      const color=sample(x,y);if(!color){x++;continue;}
      const start=x++;while(x<roi.width&&sample(x,y)===color)x++;
      if(!paths.has(color))paths.set(color,[]);
      paths.get(color).push('M'+start+' '+y+'h'+(x-start)+'v1h-'+(x-start)+'z');
    }
  }
  return [...paths].map(([color,runs])=>'<path fill="'+color+
    '" fill-opacity=".55" d="'+runs.join('')+'"/>').join('');
}
export function kaelvarCandidateComparisonSvg(input){
  check(input);
  const {width,height,classification,terrainLabels,footprints,biomeRgba,
    elevationRgba,mainlandReferenceId}=input;
  const selected=footprints.filter(p=>[A,V,S].includes(p.regionIds?.[0])||
    focalIds.has(p.id));
  const pts=selected.flatMap(p=>p.points);
  const pad=22,roi={
    minX:Math.max(0,Math.floor(Math.min(...pts.map(p=>p.x)))-pad),
    maxX:Math.min(width,Math.ceil(Math.max(...pts.map(p=>p.x)))+pad),
    minY:Math.max(0,Math.floor(Math.min(...pts.map(p=>p.y)))-pad),
    maxY:Math.min(height,Math.ceil(Math.max(...pts.map(p=>p.y)))+pad),
  };
  roi.width=roi.maxX-roi.minX;roi.height=roi.maxY-roi.minY;
  if(!roi.width||!roi.height)throw Error('Empty Kaelvar source crop');
  const sample=buildKaelvarCandidateComparison(input);
  const owners=new Uint8Array(width*height);
  for(const p of selected){
    const bit=bits.get(p.regionIds[0]);if(!bit)continue;
    visitRasterPolygon(p.points,width,height,i=>{if(classification[i]===T)owners[i]|=bit;});
  }
  const biome=embeddedCropPng(biomeRgba,width,height,roi);
  const elevation=embeddedCropPng(elevationRgba,width,height,roi);
  const outlines=(ids,stroke,dash='')=>footprints.filter(p=>ids.has(p.id)).map(p=>
    '<polygon points="'+p.points.map(q=>(q.x-roi.minX)+','+(q.y-roi.minY)).join(' ')+
    '" fill="none" stroke="'+stroke+'" stroke-width="2" '+dash+
    ' vector-effect="non-scaling-stroke"/>').join('');
  const marks=outlines(focalIds,'#252449','stroke-dasharray="5 3"');
  const paths0=filledRuns({roi,width,classification,terrainLabels,ownership:owners,
    mode:0,mainlandReferenceId});
  const pathsA=filledRuns({roi,width,classification,terrainLabels,ownership:owners,
    mode:1,mainlandReferenceId});
  const scale=1.25,pw=roi.width*scale,ph=roi.height*scale,
    left=20,gap=20,head=140,foot=140,W=Math.ceil(left*2+4*pw+3*gap),
    H=Math.ceil(head+ph+foot);
  const panel=(n,label,image,layer)=>'<text x="'+(left+n*(pw+gap))+
    '" y="111" fill="#18364A" font-family="sans-serif" font-size="18">'+label+
    '</text><svg x="'+(left+n*(pw+gap))+'" y="'+head+'" width="'+pw+
    '" height="'+ph+'" viewBox="0 0 '+roi.width+' '+roi.height+
    '"><image href="'+image+'" width="'+roi.width+'" height="'+roi.height+
    '"/>'+layer+'</svg>';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+
    '" viewBox="0 0 '+W+' '+H+'"><title>Kaelvar source-aligned existing versus layout A versus layout B: no approved borders</title>'+
    '<rect width="'+W+'" height="'+H+'" fill="#F7F8F6"/>'+
    '<text x="'+left+'" y="39" font-family="sans-serif" font-size="26" fill="#172D42">'+
    'Kaelvar regional reconstruction: decision windows only</text>'+
    '<text x="'+left+'" y="68" font-family="sans-serif" font-size="15" fill="#405567">'+
    'All colored cells are current source-polygon terrain samples. No new region boundary is drawn or approved.</text>'+
    panel(0,'Existing source labels',biome,paths0)+
    panel(1,'Layout A: three-region review',biome,pathsA)+
    panel(2,'Layout B: eastern eligibility review',biome,pathsA+marks)+
    panel(3,'Independent elevation source (raw)',elevation,'')+
    '<text x="'+left+'" y="'+(H-98)+'" font-family="sans-serif" font-size="16" fill="#263F4E">'+
    'Ochre Auric; green Verdant; orange mainland Shattercap HOLD; cyan detached Shattercap HOLD; pink Windward HOLD.</text>'+
    '<text x="'+left+'" y="'+(H-65)+'" font-family="sans-serif" font-size="16" fill="#263F4E">'+
    'Layout B dashed outlines: current Parts 7 / 15 / Windward 1 TEST WINDOWS, not an eastern-region border.</text>'+
    '<text x="'+left+'" y="'+(H-32)+'" font-family="sans-serif" font-size="16" fill="#263F4E">'+
    'Biome semantics, elevation meters, coast ink, river channels, island sovereignty and ecotones remain unresolved.</text>'+
    '</svg>\n';
  return {svg,roi,comparisonStatus:sample.status,readOnly:true,proposedBorders:null};
}
