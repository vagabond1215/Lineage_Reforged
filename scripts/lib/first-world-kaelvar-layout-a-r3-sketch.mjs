/**
 * R3 Layout A: explicitly drawn review sketches, not source polygons or owner claims.
 * The raster logic only intersects original audited source footprints with an
 * author's explicit small window and independently classified source-terrain.
 * It never assigns a landmass, remaps a source record or fills the leftovers.
 */
import {rasterizePolygon} from './first-world-reviewed-macro-planner.mjs';
import {visitRasterPolygon} from './first-world-component-review.mjs';
import {SourcePairClass} from './first-world-source-pair-qa.mjs';
import {embeddedCropPng} from './first-world-coast10-ecology-review.mjs';

const T=SourcePairClass.DIVERGENT_TERRAIN_CANDIDATE;
const REGION_IDS=[
  'region.auric_marches','region.verdant_thalos','region.shattercap_isles',
];
const SOURCE_IDS=[
  'feature.region_auric_marches.part_4',
  'feature.region_verdant_thalos.part_1',
  'feature.region_shattercap_isles.part_7',
];
const POSITIONS=[
  'kaelvar_western_interior','kaelvar_southern_peninsula','kaelvar_northern_coast',
];
const HELD_IDS=[
  'feature.region_shattercap_isles.part_1',
  'feature.region_shattercap_isles.part_7',
  'feature.region_shattercap_isles.part_15',
  'feature.region_windward_spine.part_1',
  'feature.region_windward_spine.part_2',
  'feature.region_verdant_thalos.part_6',
];
const HELD_DISPOSITIONS=[
  'BLUE_ONLY_684_CELLS_NOT_EXCLUDED_43',
  'WHOLE_SOURCE_PART_WITHHELD; PARTIAL_NORTH_SKETCH_UNAPPROVED',
  'SOUTHEASTERN_SOURCE_FOOTPRINT_WITHHELD',
  'SERATHYL_CHILD_MISPLACED_SOURCE; NO_KAELVAR_TRANSFER',
  'COAST40_DISPUTED_PARENT_AND_CHILD',
  'COAST40_DISPUTED_PARENT_AND_CHILD',
];
const SKETCH_IDS=[
  'layout-a-auric-west-core-sketch',
  'layout-a-verdant-south-core-sketch',
  'layout-a-shattercap-north-strip-sketch',
];
const SOURCE_STATUSES=[
  'SOURCE_ONLY_NOT_BORDER',
  'SOURCE_ONLY_NOT_BORDER',
  'WHOLE_SOURCE_PART_WITHHELD; PARTIAL_NORTHERN_SKETCH_FOR_REVIEW_ONLY',
];
const fail=message=>{throw Error('Layout A R3 HOLD: '+message);};
const sameSet=(a,b)=>a.length===b.length&&new Set(a).size===a.length&&
  a.every(v=>b.includes(v));
const positionsInGrid=(points,w,h)=>Array.isArray(points)&&points.length>=3&&
  points.every(p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)&&
    p.x>=0&&p.x<=w&&p.y>=0&&p.y<=h);
const countMatches=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);

/**
 * These are *source-aligned preview cores* only. Neither the terrain-only
 * component ID nor any sketch point is evidence of Kaelvar macro sovereignty.
 * In particular there is NO confirmedParentByComponent passed to the existing
 * reviewed-mask acceptance validator.
 */
export function buildKaelvarLayoutAR3Sketch({
  width,height,classification,terrainLabels,footprints,regions,
  spec,expectedDetachedComponents=null,
}) {
  const n=width*height,main=spec?.terrainOnlyPhysicalComponent?.componentId;
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
    classification?.length!==n||terrainLabels?.length!==n||
    !Number.isInteger(main)||main<1||
    !Array.isArray(footprints)||!Array.isArray(regions))
    fail('source-raster registration invalid');
  if(spec?.schemaVersion!==1||
    spec?.type!=='first-world-kaelvar-layout-a-r3-sketch.v1'||
    spec.status!=='NONCANONICAL_R3_REVIEW_SKETCH_NOT_PLACEMENT_APPROVAL'||
    spec.parentMacroRegionId!=='region.kaelvar'||
    spec.parentStatus!=='CANDIDATE_AWAITING_OWNER_REVIEW'||
    spec.terrainOnlyPhysicalComponent.namespace!=='SOURCE_PAIR_TERRAIN_ONLY_4_NEIGHBOR_K1'||
    spec.layoutBStatus!=='ELIGIBILITY_ONLY_NO_POLYGON_OR_FOURTH_CHILD'||
    spec.approval?.parentConfirmed!==false||
    spec.approval?.childBordersApproved!==false||
    spec.approval?.biomeLegendApproved!==false||
    spec.approval?.elevationRampApproved!==false||
    spec.approval?.hydrologyApproved!==false||
    spec.approval?.ownerApprovalRef!==null||
    spec.approval?.canonicalWritable!==false)
    fail('preview was promoted or source contract changed');
  if(!Array.isArray(spec.originalSourceHolds)||
    !sameSet(spec.originalSourceHolds.map(v=>v.sourceFeatureId),HELD_IDS)||
    HELD_IDS.some((id,i)=>spec.originalSourceHolds.find(v=>
      v.sourceFeatureId===id)?.disposition!==HELD_DISPOSITIONS[i]))
    fail('displaced/Coast 40/blue/source hold inventory drift');
  const byId=new Map(footprints.map(p=>[p.id,p]));
  if(byId.size!==footprints.length)fail('duplicate original source footprints');
  const regionById=new Map(regions.map(r=>[r.id,r]));
  if(regionById.size!==regions.length)fail('duplicate canonical region identities');
  if(!Array.isArray(spec.previewRegions)||spec.previewRegions.length!==3||
    !sameSet(spec.previewRegions.map(s=>s.regionId),REGION_IDS))
    fail('exactly three authored child previews required');
  const windows=REGION_IDS.map((id,code)=>{
    const s=spec.previewRegions.find(p=>p.regionId===id);
    const region=regionById.get(id);
    if(s?.id!==SKETCH_IDS[code]||s.parentRegionId!=='region.kaelvar'||
      s.positionLabel!==POSITIONS[code]||
      region?.regionType!=='subregion'||
      region.parentRegionId!==s.parentRegionId||
      region.positionLabel!==s.positionLabel||
      !countMatches(s.sourceFeatureIds||[],[SOURCE_IDS[code]])||
      !positionsInGrid(s.sketchPolygon,width,height)||
      s.sourcePartStatus!==SOURCE_STATUSES[code])
      fail('authored source/region/window drift: '+id);
    const source=byId.get(SOURCE_IDS[code]);
    if(!source||!Array.isArray(source.points)||
       !source.regionIds?.includes(id))
      fail('original polygon provenance absent: '+id);
    return {spec:s,source,code:code+1,
      windowMask:rasterizePolygon(s.sketchPolygon,width,height)};
  });
  for(const id of HELD_IDS)if(!byId.has(id))
    fail('held original source polygon missing: '+id);
  const componentMask=new Uint8Array(n),heldIslands=new Uint8Array(n),
    sourceRegionCode=new Int16Array(n),sourceMember=new Uint8Array(n),
    seedBits=new Uint8Array(n),raw=new Uint8Array(n),assigned=new Uint8Array(n),
    heldReasons=new Uint8Array(n);
  const sourceRegionCodes=new Map(regions.map((r,i)=>[r.id,i+1]));
  let mainlandCells=0;
  for(let i=0;i<n;i++){
    if(classification[i]!==T)continue;
    if(!terrainLabels[i])fail('terrain candidate without four-neighbor label');
    if(terrainLabels[i]===main){componentMask[i]=1;mainlandCells++;}
  }
  const expectedMain=spec.terrainOnlyPhysicalComponent.expectedTerrainCandidateCells;
  if(Number.isInteger(expectedMain)&&expectedMain!==mainlandCells)
    fail('physical mainland reference candidate count drift');
  // Independent original polygon memberships are conflict witnesses, not
  // authority for an already-correct political border.
  for(const p of footprints){
    const rid=p.regionIds?.[0],code=sourceRegionCodes.get(rid)||-1;
    visitRasterPolygon(p.points,width,height,i=>{
      if(!componentMask[i])return;
      const previous=sourceRegionCode[i];
      if((p.regionIds?.length||0)!==1||code<1||previous===-1||
        previous!==0&&previous!==code)sourceRegionCode[i]=-1;
      else sourceRegionCode[i]=code;
    });
  }
  const perSource=new Array(3).fill(0).map(()=>({sourceCandidateCells:0,
    clippedCandidateCells:0,rawCandidateCells:0,previewCells:0}));
  for(let index=0;index<windows.length;index++){
    const w=windows[index],bit=1<<(w.code-1);
    visitRasterPolygon(w.source.points,width,height,i=>{
      if(classification[i]!==T)return;
      if(!componentMask[i])return; // Detached land stays unassigned.
      perSource[index].sourceCandidateCells++;
      if(!w.windowMask[i])return;
      perSource[index].clippedCandidateCells++;
      seedBits[i]|=bit;
      sourceMember[i]|=bit;
    });
  }
  let contestedSketch=0,contestedSource=0,borderGuard=0,rawEligible=0;
  for(let i=0;i<n;i++){
    if(!componentMask[i]||!seedBits[i])continue;
    const bit=seedBits[i];
    if((bit&(bit-1))!==0){heldReasons[i]=1;contestedSketch++;continue;}
    const chosen=bit===1?1:bit===2?2:3;
    const regionCode=sourceRegionCodes.get(REGION_IDS[chosen-1]);
    if(sourceRegionCode[i]!==regionCode){
      heldReasons[i]=2;contestedSource++;continue;
    }
    raw[i]=chosen;perSource[chosen-1].rawCandidateCells++;rawEligible++;
  }
  for(let i=0;i<n;i++){
    const chosen=raw[i];
    if(!chosen)continue;
    const x=i%width,y=(i-x)/width;
    if(x===0||y===0||x+1===width||y+1===height||
       raw[i-1]!==chosen||raw[i+1]!==chosen||
       raw[i-width]!==chosen||raw[i+width]!==chosen){
      heldReasons[i]=3;borderGuard++;continue;
    }
    assigned[i]=chosen;perSource[chosen-1].previewCells++;
  }
  // Shattercap's physically separate source-terrain cells cannot inherit
  // a political parent or child by proximity, shape or size.
  const detached=new Map();
  for(const p of footprints.filter(p=>p.regionIds?.includes('region.shattercap_isles'))){
    visitRasterPolygon(p.points,width,height,i=>{
      if(classification[i]!==T||terrainLabels[i]===main)return;
      const componentId=terrainLabels[i];
      if(!componentId)fail('detached Shattercap terrain unlabeled');
      if(heldIslands[i])return;
      heldIslands[i]=1;
      detached.set(componentId,(detached.get(componentId)||0)+1);
    });
  }
  const rows=[...detached].map(([componentId,cells])=>({componentId,terrainCandidateCells:cells,
    proposedRegionId:null,parentApprovalRef:null,status:'PARENT_AND_CHILD_SOVEREIGNTY_PENDING'}))
    .sort((a,b)=>b.terrainCandidateCells-a.terrainCandidateCells||
      a.componentId-b.componentId);
  if(expectedDetachedComponents!==null){
    if(!Array.isArray(expectedDetachedComponents)||
      !sameSet(rows.map(r=>r.componentId),expectedDetachedComponents.map(r=>r.componentId)))
      fail('detached physical island identities drift');
    for(const r of rows)
      if(expectedDetachedComponents.find(e=>e.componentId===r.componentId)
        ?.sourceTerrainCandidateCells!==r.terrainCandidateCells)
        fail('detached physical island terrain count drift: '+r.componentId);
  }
  const previews=windows.map((w,i)=>({
    id:w.spec.id,regionId:REGION_IDS[i],
    positionLabel:w.spec.positionLabel,
    originalSourceFeatureIds:[...w.spec.sourceFeatureIds],
    sourcePartStatus:w.spec.sourcePartStatus,
    ...perSource[i],sourceGeometryRetained:true,
    boundaryApproved:false,parentConfirmed:false,
  }));
  const previewTotal=previews.reduce((sum,r)=>sum+r.previewCells,0);
  const islandCells=rows.reduce((sum,r)=>sum+r.terrainCandidateCells,0);
  if(previewTotal+borderGuard+contestedSketch+contestedSource>mainlandCells||
    rawEligible!==previewTotal+borderGuard)
    fail('R3 draft pixel accounting');
  return {
    report:{
      schemaVersion:1,status:'LAYOUT_A_R3_PREVIEW_ONLY_NO_APPROVED_BORDERS',
      sourceClassification:'SOURCE_PAIR_DIVERGENCE_NOT_CERTIFIED_DRY_LAND',
      physicalComponentNamespace:spec.terrainOnlyPhysicalComponent.namespace,
      physicalMainlandReferenceComponentId:main,
      physicalMainlandCandidateTerrainCells:mainlandCells,
      sourceFootprintCount:footprints.length,
      sourcePartCrosswalk:previews,
      previewCandidateCells:previewTotal,
      unassignedAfterPreviewMainlandCandidateCells:mainlandCells-previewTotal,
      unassignedNeverSketchedMainlandCells:mainlandCells-
        rawEligible-contestedSketch-contestedSource,
      heldMultiSketchCells:contestedSketch,
      heldOriginalSourceConflictCells:contestedSource,
      heldOneCellBoundaryGuardCells:borderGuard,
      heldDetachedShattercapCandidateCells:islandCells,
      detachedShattercapRows:rows,
      originalSourceHolds:spec.originalSourceHolds,
      sourcePreviewDoesNotAssignPoliticalParent:true,
      confirmedParentByComponent:null,
      canonicalSourceWritable:false,
      biomeLegendApproved:false,elevationRampApproved:false,
      coastlineAndHydrologyApproved:false,ownerApprovalRequired:true,
      note:'Every colored cell is a reversible draft candidate, not approved political ownership. All unknown main terrain and detached islands remain unassigned.',
    },
    width,height,classification,terrainLabels,
    assigned,heldReasons,componentMask,heldIslands,
    windows:windows.map(w=>w.spec),
  };
}

function groupedRunPaths({width,roi,classification,assigned,componentMask,heldIslands,
  heldReasons},mode){
  const groups=new Map();
  const color=i=>{
    if(mode==='preview'){
      const owner=assigned[i];
      if(owner===1)return '#C29B45';
      if(owner===2)return '#3BAD82';
      if(owner===3)return '#F3A45C';
      if(heldReasons[i]===1||heldReasons[i]===2)return '#E64C87';
      if(heldReasons[i]===3)return '#CF6D9A';
      if(heldIslands[i])return '#43C4D2';
      if(componentMask[i])return '#485269';
      return null;
    }
    if(mode==='sourceRisk'){
      if(heldReasons[i]===1||heldReasons[i]===2)return '#E64C87';
      if(heldReasons[i]===3)return '#D69827';
      if(heldIslands[i])return '#43C4D2';
      return null;
    }
    return null;
  };
  for(let y=0;y<roi.height;y++){
    let x=0;
    while(x<roi.width){
      const idx=(y+roi.minY)*width+x+roi.minX,key=color(idx);
      if(!key){x++;continue;}
      const from=x++;
      while(x<roi.width&&color((y+roi.minY)*width+x+roi.minX)===key)x++;
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push('M'+from+' '+y+'h'+(x-from)+'v1h-'+(x-from)+'z');
    }
  }
  return [...groups].map(([fill,runs])=>
    '<path fill="'+fill+'" fill-opacity=".53" d="'+runs.join('')+'"/>').join('');
}

/** Three local, self-contained source panels. No approved border exists. */
export function kaelvarLayoutAR3SketchSvg(result,{biomeRgba,elevationRgba}){
  const {width,height,windows}=result;
  if(biomeRgba?.length!==width*height*4||
     elevationRgba?.length!==width*height*4)
    fail('SVG original image registration invalid');
  const roi={minX:Math.min(44,width-1),minY:Math.min(92,height-1),
    maxX:Math.min(656,width),maxY:Math.min(550,height)};
  // On tiny synthetic test grids, fall back to the entire test frame.
  if(width<656||height<550){roi.minX=0;roi.minY=0;}
  roi.width=roi.maxX-roi.minX;roi.height=roi.maxY-roi.minY;
  const biome=embeddedCropPng(biomeRgba,width,height,roi);
  const elevation=embeddedCropPng(elevationRgba,width,height,roi);
  const gap=16,margin=14,top=50,panelWidth=roi.width;
  const svgWidth=margin*2+panelWidth*3+gap*2;
  const svgHeight=top+roi.height+62;
  const panel=(number,title,src,overlay)=>{
    const left=margin+(number-1)*(panelWidth+gap);
    const outlines=windows.map((w,i)=>{
      const stroke=['#FFE49E','#A0F9CD','#FBC29E'][i];
      return '<polygon points="'+w.sketchPolygon.map(p=>
        (p.x-roi.minX)+','+(p.y-roi.minY)).join(' ')+
        '" fill="none" stroke="'+stroke+
        '" stroke-width="1.8" stroke-dasharray="6 3"/>';
    }).join('');
    return '<g transform="translate('+left+','+top+')">'+
      '<rect width="'+roi.width+'" height="'+roi.height+'" fill="#122237"/>'+
      '<image width="'+roi.width+'" height="'+roi.height+'" href="'+src+'"/>'+
      overlay+outlines+
      '<rect width="'+roi.width+'" height="'+roi.height+
      '" fill="none" stroke="#B6C6D6" stroke-width="1"/></g>'+
      '<text x="'+left+'" y="38" fill="#F1F4F8" font-size="13">'+title+'</text>';
  };
  const preview=groupedRunPaths({...result,roi,width},'preview');
  const risk=groupedRunPaths({...result,roi,width},'sourceRisk');
  const body=[
    panel(1,'1. Original registered biome RGB (no new ownership)',biome,''),
    panel(2,'2. Provisional three-child sketch + explicitly unassigned',biome,preview),
    panel(3,'3. Original elevation RGB + risk/held areas',elevation,risk),
  ].join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+svgWidth+
    '" height="'+svgHeight+'" viewBox="0 0 '+svgWidth+' '+svgHeight+'">'+
    '<rect width="100%" height="100%" fill="#172435"/>'+
    '<text x="14" y="18" fill="#FFFFFF" font-size="15" font-weight="bold">'+
    'KAELVAR LAYOUT A / NONCANONICAL R3 REVIEW SKETCH / NO BORDER APPROVAL</text>'+
    body+
    '<text x="14" y="'+(svgHeight-36)+'" fill="#B7CADC" font-size="12">'+
    'Gold: Auric draft | Green: Verdant draft | Orange: Shattercap draft | '+
    'Pink: original/seed conflict | Grey: unassigned | Cyan: detached pending island</text>'+
    '<text x="14" y="'+(svgHeight-16)+'" fill="#B7CADC" font-size="11">'+
    'Original PNGs preserved. Raw color, linework, elevation and sovereignty semantics remain HELD.</text>'+
    '</svg>\n';
}
