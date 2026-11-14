#!/usr/bin/env node
/**
 * C1-N annotated original source-edge index atlas.
 * Review only: source PNG/vector verification inherited from C1-M/J.
 */
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {C1_SOURCE_VARIANTS} from './lib/world-geographic-authority.mjs';
import {readPinnedCommittedVectorSource}
 from './lib/world-source-git-witness.mjs';
import {selectC1JOriginalVectorEdges}
 from './lib/kaelvar-c1j-vector-coastline-review.mjs';
import {validateC1MShoreIntent}
 from './lib/kaelvar-c1m-shore-intent-review.mjs';
import {validateC1NAtlasContract,buildC1NSourceEdgeAtlas}
 from './lib/kaelvar-c1n-source-edge-atlas.mjs';

const mode=process.argv[2];
if(process.argv.length!==3||!['--check','--svg'].includes(mode)){
 console.error('Usage: --check|--svg (exact source indices, no political borders)');
 process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const json=p=>JSON.parse(readFileSync(resolve(root,p),'utf8').replace(/^\uFEFF/,''));
const fail=s=>{throw Error('C1-N source atlas HOLD: '+s);};
const n=json('docs/design/kaelvar-c1n-indexed-north-coast-atlas-2026-11-14.json');
const j=json(n.sourcePaths.c1j),l=json(n.sourcePaths.c1l),m=json(n.sourcePaths.c1m);
validateC1MShoreIntent(m,l,j);
validateC1NAtlasContract(n,j,l,m);
const call=(file,flag)=>execFileSync(process.execPath,[resolve(root,file),flag],{
 cwd:root,encoding:'utf8',maxBuffer:64*1024*1024,
});
const predecessor=JSON.parse(call('scripts/kaelvar-c1m-shore-intent-review.mjs','--check'));
if(predecessor.status!=='C1M_KHARUUN_SHORE_INTENT_RECORDED_MAP_FRONTAGE_UNPLACED'||
 predecessor.coastlineSourceEdgeInventory!==599||
 predecessor.historicNortheasternCompetingSourceEdges!==114||
 predecessor.kharuunShoreExistence!=='OWNER_ACCEPTED_DESIGN_GEOGRAPHY'||
 predecessor.oldVeyrholmCorridor!=='REJECTED_AS_POLITICAL_BOUNDARY'||
 predecessor.approval?.canonicalWritable!==false||
 predecessor.coastalSourceEvidence?.geographicCoastAndSeaCalibrated!==false||
 predecessor.originalSourcePngsVerified!==true)
 fail('C1-M owner/PNG/coast source certification drift');
const {sourceBlob,sourceBytes}=readPinnedCommittedVectorSource({
 repoRoot:root,sourcePath:j.sourceGeometryPath,
 acceptedBlobShas:Object.values(C1_SOURCE_VARIANTS),
});
if(sourceBlob!==predecessor.originalSourceVectorBlob)
 fail('source vector blob diverged from accepted C1-M');
const source=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
 .records.find(x=>x.mapId==='world_map.first_world');
const selected=selectC1JOriginalVectorEdges(source,j);
const atlas=buildC1NSourceEdgeAtlas(selected,n);
const report={
 status:'C1N_EXACT_SOURCE_EDGE_ATLAS_COMPLETE_FRONTAGE_REVIEW_HELD',
 predecessorStatus:predecessor.status,
 originalSourceBlob:sourceBlob,
 pngRegistrationVerified:predecessor.originalSourcePngsVerified,
 sourceContourId:atlas.sourceContourId,
 originalEdgesAccounted:atlas.originalEdgesAccounted,
 originalEdgeCoordinates:atlas.originalEdgeCoordinates,
 countsBySourceInspectionSector:atlas.countsBySourceInspectionSector,
 originalIndexRuns:atlas.cyclicInspectionRuns,
 labelsForReviewPanels:atlas.labelMarkers,
 closingEdgeReturnsToFirstVertex:atlas.preservedOriginalClosingEdge,
 acceptedDesignIntent:{
  kharuunHasLimitedNorthernShore:true,
  oldVeyrholmRibbonRejected:true,
  exactKharuunCoastalEdges:null,
  exactVeyrholmCoastalEdges:null,
  proposedPortCoordinate:null,
  independentShorelineApproval:false,
 },
 holds:{
  inlandRegionBordersApproved:0,
  coastlineEdgeOwnershipApproved:0,
  islandComponentsClaimed:0,
  largeNortheastIslandWholeAndUnclaimed:true,
  unassignedMainlandTerrainCandidateCells:26795,
  coast40StillDisputed:true,
  foreignWindwardParent:'region.serathyl',
  saltBasinsPlaced:0,
  canonicalWritable:false,
  ownerSourceEdgeSelectionRequired:true,
 },
};
if(mode==='--check'){
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
}else{
 const sourceSvg=call('scripts/kaelvar-c1j-coastline-review.mjs','--svg');
 const image=sourceSvg.match(/<image\b[^>]*\/>/)?.[0];
 if(!image||!image.includes('data:image/png;base64,'))
   fail('verified source image missing from predecessor SVG');
 const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const path=points=>points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ')+' Z';
 const original='<path d="'+path(selected.main.points)+
  '" fill="none" stroke="#F9FCFF" stroke-width="1.2" stroke-opacity=".95"/>';
 const colors=['#8DDCF8','#DFBEFF','#FFD16C'];
 const traced=selected.edgeSectors.map((set,i)=>
  '<path d="'+set.map(s=>'M'+s.a.x+' '+s.a.y+' L'+s.b.x+' '+s.b.y).join(' ')+
  '" fill="none" stroke="'+colors[i]+'" stroke-width="2.5" stroke-opacity=".9"/>').join('');
 const offshore=selected.offshore.map(x=>
  '<path d="'+path(x.points)+'" fill="none" stroke="#F4BFC0" stroke-width="1.6" stroke-dasharray="4 3"/>').join('');
 const panel=(p,i)=>{
  const [x,y,w,h]=p.viewBox;
  const width=684,height=Math.round(width*h/w);
  const offset=14+i*714;
  const size=i===0?8:i===1?5.6:4.8;
  const markers=atlas.labelMarkers[i].originalVertexLabels.map(mark=>
    '<circle cx="'+mark.x+'" cy="'+mark.y+'" r="'+(i===0?1.8:1.2)+
    '" fill="#FFFFFF" stroke="#101F33" stroke-width=".65"/>'+
    '<text x="'+(mark.x+2)+'" y="'+(mark.y-2)+'" font-size="'+size+
    '" fill="#FFFFFF" stroke="#17263C" stroke-width="1.25" paint-order="stroke">'+
    mark.originalSourceEdgeIndex+'</text>').join('');
  return '<text x="'+offset+'" y="93" fill="#EAF3FE" font-size="17">'+esc(p.label)+'</text>'+
   '<svg x="'+offset+'" y="112" width="'+width+'" height="'+height+
   '" viewBox="'+[x,y,w,h].join(' ')+'">'+image+original+traced+offshore+markers+'</svg>'+
   '<rect x="'+offset+'" y="112" width="'+width+'" height="'+height+
   '" fill="none" stroke="#A2B6D0"/>';
 };
 const xml='<svg xmlns="http://www.w3.org/2000/svg" width="2150" height="856" viewBox="0 0 2150 856">'+
  '<rect width="2150" height="856" fill="#14243A"/>'+
  '<text x="14" y="30" fill="#FFFFFF" font-size="22" font-weight="bold">'+
  'C1-N / EXACT NORTHERN SOURCE-EDGE INDEX ATLAS / NO POLITICAL COAST APPROVED</text>'+
  '<text x="14" y="61" fill="#F3CF8E" font-size="16">'+
  'OWNER INTENT: KHARUUN HAS A SHORT NORTH SHORE | WHICH EXACT SOURCE EDGES? STILL UNSELECTED</text>'+
  n.previewPanels.map(panel).join('')+
  '<text x="16" y="728" fill="#E7EDF7" font-size="16">'+
  'Colors identify SOURCE REVIEW WINDOWS only: northwest cyan (90), north-central lavender (106), northeast gold (114); other source edges (289) unassigned.</text>'+
  '<text x="16" y="763" fill="#F6D6B0" font-size="16">'+
  'Numbers mark original coastline VERTEX/EDGE indices. Index 598 closes to 0. NE spans 60-149 and 154-177, NOT automatically Kharuun territory.</text>'+
  '<text x="16" y="797" fill="#E7EDF7" font-size="15">'+
  'No Veyrholm ribbon. No chosen Kharuun frontage, port, routes, islands, salt basins, ocean calibration, or canonical regional border.</text>'+
  '<text x="16" y="829" fill="#C9DBEC" font-size="15">'+
  'Source PNG and 599 original vector edges verified unchanged | 26,795 mainland candidate cells unassigned | owner edge-index review required.</text>'+
  '</svg>\n';
 process.stdout.write(xml);
}
