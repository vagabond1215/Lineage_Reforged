#!/usr/bin/env node
/** C1-F reversible owner-corrected geography preview; no catalog writes. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readPinnedCommittedVectorSource}
  from './lib/world-source-git-witness.mjs';
import {C1_SOURCE_VARIANTS}
  from './lib/world-geographic-authority.mjs';
import {validateC1FPlacementGuides}
  from './lib/kaelvar-c1f-placement-intent.mjs';
import {decodeSourcePng}
  from './lib/kaelvar-c1f-source-png.mjs';
import {registeredTerrainCandidates,checkedC1FMainland,buildC1FPreview}
  from './lib/kaelvar-c1f-source-raster.mjs';

const mode=process.argv[2];
if(process.argv.length!==3||!['--report','--svg'].includes(mode)){
  console.error('Usage: --report|--svg (read-only stdout, approval held)');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const bytes=p=>readFileSync(resolve(root,p));
const parse=p=>JSON.parse(bytes(p).toString('utf8').replace(/^\uFEFF/,''));
const hold=s=>{throw Error('C1-F source HOLD: '+s);};
const ledger=parse('docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json');
const spec=parse('docs/design/kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json');
const validation=validateC1FPlacementGuides(spec,ledger);
const maps=parse('packages/content/base/world/world_maps.json').records;
const map=maps.find(r=>r.id==='world_map.first_world');
const {sourceBlob,sourceBytes}=readPinnedCommittedVectorSource({
  repoRoot:root,sourcePath:ledger.sourceWitness.originalGeometryPath,
  acceptedBlobShas:Object.values(C1_SOURCE_VARIANTS),
});
const variant=sourceBlob===C1_SOURCE_VARIANTS.master201?'MAINLINE_201_UNFILTERED':
  sourceBlob===C1_SOURCE_VARIANTS.draft159?'DRAFT_159_ALREADY_EXCLUDED':null;
const original=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
  .records.find(r=>r.mapId==='world_map.first_world');
const crop=ledger.sourceWitness.crop;
if(!variant||!map||!original||
  original.referenceImageWidthPx!==2048||
  original.referenceImageHeightPx!==1152||
  original.regionFootprints?.length!==(variant==='MAINLINE_201_UNFILTERED'?201:159)||
  original.coastlines?.length!==68||
  !['x','y','width','height'].every(k=>map.assetReferenceRectPx?.[k]===crop[k]))
  hold('original vector provenance or registration changed');
const sources={};
for(const [name,sha] of [['biome',ledger.sourceWitness.biomeSha256],
  ['elevation',ledger.sourceWitness.elevationSha256]]){
  const path=map.layerAssetPaths?.[name];
  if(!path)hold('missing source image path');
  const data=bytes(path);
  if(createHash('sha256').update(data).digest('hex')!==sha)
    hold('source PNG hash drift: '+name);
  const decoded=decodeSourcePng(data);
  if(decoded.width!==4096||decoded.height!==2355)
    hold('original PNG dimensions drift');
  sources[name]={decoded,data};
}
const terrain=registeredTerrainCandidates({
  biome:sources.biome.decoded,elevation:sources.elevation.decoded,
  crop,width:2048,height:1152,
});
const {labels,main,componentCount}=checkedC1FMainland(terrain);
const preview=buildC1FPreview({spec,labels});
const report={
  ...validation,
  status:'C1F_NONCANONICAL_SOURCE_CLIPPED_PREVIEW_ONLY',
  sourceVariant:variant,sourceVectorBlob:sourceBlob,
  sourcePngHashesVerified:true,
  sourcePairCandidateClass:spec.sourcePairClassification,
  physicalComponentNamespace:spec.terrainOnlyComponent.namespace,
  physicalMainlandReferenceComponentId:main.id,
  physicalComponentCandidatesDetected:componentCount,
  totalMainlandTerrainCandidateCells:preview.totalMainlandTerrainCandidateCells,
  previewAssignedCandidateCells:preview.previewAssignedCandidateCells,
  unassignedMainlandCandidateCells:preview.unassignedMainlandCandidateCells,
  islandAssignedCells:0,detachedIslandClaims:0,
  guideRows:preview.rows,
  foreignWindwardSourceFeatureIdsHeld:spec.sourceHolds.foreignWindwardSourceFeatureIds,
  historicalMagentaOutlineInProposal:false,
  coast40StillUnresolved:true,
  sourceColorsNotCalibrated:true,
  outputIsCandidatePreviewNotRegisteredGeometry:true,
  canonicalWritable:false,ownerApprovalRef:null,
};
if(mode==='--report'){
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
}else{
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const left=[18,646,1274],panelY=58,panelW=608,panelH=470;
  const view='40 90 620 480';
  const originX=-crop.x*2048/crop.width;
  const originY=-crop.y*1152/crop.height;
  const imageW=4096*2048/crop.width,imageH=2355*1152/crop.height;
  const img=layer=>'<image x="'+originX+'" y="'+originY+
    '" width="'+imageW+'" height="'+imageH+
    '" preserveAspectRatio="none" href="data:image/png;base64,'+
    sources[layer].data.toString('base64')+'"/>';
  const fills=new Map();
  const colors=spec.regionGuides.slice(0,4).map(g=>g.color);
  for(let y=90;y<570;y++){
    let x=40;
    while(x<660){
      const k=preview.ownership[y*2048+x];
      if(!k){x++;continue;}
      const start=x++;
      while(x<660&&preview.ownership[y*2048+x]===k)x++;
      const color=colors[k-1];
      if(!fills.has(color))fills.set(color,[]);
      fills.get(color).push('M'+start+' '+y+'h'+(x-start)+'v1h-'+(x-start)+'z');
    }
  }
  const colored=[...fills].map(([fill,paths])=>
    '<path fill="'+fill+'" fill-opacity=".42" d="'+paths.join('')+'"/>').join('');
  const guideOutlines=spec.regionGuides.filter(g=>g.guidePolygon).map(g=>
    '<polygon points="'+g.guidePolygon.map(p=>p.x+','+p.y).join(' ')+
    '" fill="none" stroke="'+g.color+'" stroke-width="2.5" stroke-dasharray="6 4"/>').join('');
  const labels=spec.regionGuides.filter(g=>g.labelAnchor).map(g=>
    '<text x="'+g.labelAnchor.x+'" y="'+g.labelAnchor.y+
    '" font-size="13" text-anchor="middle" stroke="#172435" stroke-width="3.5"'+
    ' paint-order="stroke fill" fill="#FFFFFF">'+esc(g.label)+'</text>').join('');
  const unresolved='<text x="548" y="120" fill="#FFFFFF" font-size="11"'+
    ' text-anchor="middle" stroke="#172435" stroke-width="3"'+
    ' paint-order="stroke fill">NE island HELD</text>';
  const render=(which,index,layer,overlay)=>'<text x="'+left[index]+
    '" y="43" font-size="16" fill="#EAF2FC">'+esc(which)+'</text>'+
    '<svg x="'+left[index]+'" y="'+panelY+'" width="'+panelW+
    '" height="'+panelH+'" viewBox="'+view+'">'+img(layer)+overlay+'</svg>'+
    '<rect x="'+left[index]+'" y="'+panelY+'" width="'+panelW+
    '" height="'+panelH+'" fill="none" stroke="#AEC5D5"/>';
  const body=[
    render('1. Registered original biome | NOT calibrated',0,'biome',''),
    render('2. FOUR noncanonical source-clipped draft cores',1,'biome',
      colored+guideOutlines+labels+unresolved),
    render('3. Original elevation + candidate cores',2,'elevation',
      colored+guideOutlines),
  ].join('');
  process.stdout.write('<svg xmlns="http://www.w3.org/2000/svg"'+
    ' width="1900" height="660" viewBox="0 0 1900 660">'+
    '<rect width="1900" height="660" fill="#152337"/>'+
    '<text x="20" y="19" font-size="17" font-weight="bold" fill="#FFFFFF">'+
    'KAELVAR C1-F / OWNER-CORRECTED PLACEMENT REVIEW / NO BORDER APPROVAL</text>'+
    body+
    '<text x="20" y="564" font-size="14" fill="#DDE9F5">'+
    'Gold Auric | Sand Kharuun | Green Verdant peninsula | Blue Veyrholm coast | Shattercap islands unassigned</text>'+
    '<text x="20" y="596" font-size="13" fill="#FFDBBA">'+
    'Colored cells: source-pair terrain CANDIDATE on mainland component 30, NOT validated land, ecology or sovereignty.</text>'+
    '<text x="20" y="621" font-size="13" fill="#E4D5C4">'+
    'Old magenta Windward claim OMITTED from proposal. Contested Coast 40, NE island and 18 detached groups remain held.</text>'+
    '<text x="20" y="644" font-size="13" fill="#C2D2E4">'+
    'Mainland candidate terrain: '+preview.totalMainlandTerrainCandidateCells+
    ' | Draft-colored: '+preview.previewAssignedCandidateCells+
    ' | Unassigned: '+preview.unassignedMainlandCandidateCells+
    ' | Island assignments: ZERO | original source PNG and vector bytes unchanged.</text>'+
    '</svg>\n');
}
