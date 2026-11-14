#!/usr/bin/env node
/**
 * C1-I source-blue vs shared-nonblue sensitivity, stdout only.
 * No canonical coastlines, watersheds, water resources or region borders.
 */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeSourcePng} from './lib/kaelvar-c1f-source-png.mjs';
import {
  registeredTerrainCandidates,checkedC1FMainland,buildC1FPreview,
} from './lib/kaelvar-c1f-source-raster.mjs';
import {validateC1FPlacementGuides} from './lib/kaelvar-c1f-placement-intent.mjs';
import {validateKaelvarC1GEcology} from './lib/kaelvar-c1g-ecology-evidence.mjs';
import {registeredSharedBlueMask} from './lib/kaelvar-c1h-source-diagnostics.mjs';
import {C1_SOURCE_VARIANTS} from './lib/world-geographic-authority.mjs';
import {readPinnedCommittedVectorSource} from './lib/world-source-git-witness.mjs';
import {
  registeredSharedNonblueUnresolved,classifyBlueComponents,
  measureInkBridgeContacts,reportRegionInkContacts,UNREACHABLE_INK,
} from './lib/kaelvar-c1i-source-ink-separation.mjs';

const mode=process.argv[2];
if(process.argv.length!==3||!['--check','--svg'].includes(mode)){
  console.error('Usage: --check|--svg (review only, stdout only)');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const bytes=p=>readFileSync(resolve(root,p));
const json=p=>JSON.parse(bytes(p).toString('utf8').replace(/^\uFEFF/,''));
const hold=s=>{throw Error('C1-I original source HOLD: '+s);};
const c1=json('docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json');
const spec=json('docs/design/kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json');
const g=json('docs/design/kaelvar-c1g-coastline-salt-basin-evidence-2026-11-13.json');
validateC1FPlacementGuides(spec,c1);
validateKaelvarC1GEcology({
  review:g,c1fGuides:spec,c1Ledger:c1,
  localityPack:json(g.sourcePaths.localityPack),
  ecologyPack:json(g.sourcePaths.ecologyPack),
});
const map=json('packages/content/base/world/world_maps.json').records
  .find(x=>x.id==='world_map.first_world');
const crop=c1.sourceWitness.crop;
if(!map||!['x','y','width','height'].every(k=>map.assetReferenceRectPx?.[k]===crop[k]))
  hold('map-to-source crop drift');
const {sourceBlob,sourceBytes}=readPinnedCommittedVectorSource({
  repoRoot:root,sourcePath:c1.sourceWitness.originalGeometryPath,
  acceptedBlobShas:Object.values(C1_SOURCE_VARIANTS),
});
const src=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
  .records.find(x=>x.mapId==='world_map.first_world');
const sourceVariant=sourceBlob===C1_SOURCE_VARIANTS.master201?
  'MAINLINE_201_UNFILTERED':sourceBlob===C1_SOURCE_VARIANTS.draft159?
  'DRAFT_159_ALREADY_EXCLUDED':null;
if(!sourceVariant||src?.regionFootprints?.length!==
  (sourceVariant==='MAINLINE_201_UNFILTERED'?201:159)||
  src?.coastlines?.length!==68)
  hold('vector source fingerprint or inventory drift');
const images={};
for(const [layer,sha] of [['biome',c1.sourceWitness.biomeSha256],
  ['elevation',c1.sourceWitness.elevationSha256]]){
  const path=map.layerAssetPaths?.[layer];
  if(!path)hold('missing protected PNG path');
  const data=bytes(path);
  if(createHash('sha256').update(data).digest('hex')!==sha)
    hold('original PNG hash changed: '+layer);
  const decoded=decodeSourcePng(data);
  if(decoded.width!==4096||decoded.height!==2355)
    hold('original PNG dimensions changed');
  images[layer]={data,decoded};
}
const width=2048,height=1152;
const terrain=registeredTerrainCandidates({
  biome:images.biome.decoded,elevation:images.elevation.decoded,crop,width,height,
});
const {labels,main}=checkedC1FMainland(terrain,width,height);
const preview=buildC1FPreview({spec,labels,width,height});
const sharedBlue=registeredSharedBlueMask({
  biome:images.biome.decoded,elevation:images.elevation.decoded,crop,width,height,
});
const sharedNonblue=registeredSharedNonblueUnresolved({
  biome:images.biome.decoded,elevation:images.elevation.decoded,crop,width,height,
});
const water=classifyBlueComponents({blue:sharedBlue,width,height});
const bridge=measureInkBridgeContacts({
  boundaryBlue:water.edgeConnectedBlue,sharedNonblue,
  labels,width,height,mainlandId:30,maxInkSteps:3,
});
const byRegion=reportRegionInkContacts({
  ownership:preview.ownership,labels,contactMinInk:bridge.contactMinInk,
  width,height,mainlandId:30,maxInkSteps:3,
});
if(main.id!==30||main.areaPx2!==79419||
  preview.unassignedMainlandCandidateCells!==26795||
  preview.previewAssignedCandidateCells!==52624||
  byRegion.totalMainlandCandidateCells!==79419||
  byRegion.regionRows.map(x=>x.terrainCandidateCells).join(',')!==
    '26795,10899,20295,18474,2956'||
  bridge.summary.contactsByMinimumSharedNonblueSteps[0]>17)
  hold('registered mainland, C1-F coverage or C1-H source witness drift');
const report={
  status:'C1I_SOURCE_BLUE_INK_SEPARATION_COMPLETE_HYDROLOGY_STILL_HELD',
  originalVectorVariant:sourceVariant,originalVectorGitBlob:sourceBlob,
  originalPngSha256Verified:true,registeredSourceCrop:crop,
  inlandTerrainComponentId:30,terrainCandidateCells:79419,
  sourceBlueGraph:water.summary,
  unresolvedSharedNonblueBridge:bridge.summary,
  regionalReview:byRegion,
  interpretationHolds:{
    boundaryBlueIsOceanVerified:false,
    enclosedBlueIsInlandLakeVerified:false,
    sharedNonblueIsCoastInkVerified:false,
    closedDrainageVerified:false,
    waterElevationCalibrated:false,
    sourceShorelineCertified:false,
    veyrholmCoastContinuityCertified:false,
    kharuunSeaFrontageCertified:false,
    saltFlatLocationsCertified:0,
    originalWindwardTransferApproved:false,
    northeasternLargeIslandAllocated:false,
    detachedIslandsAllocated:0,
    routesPublished:0,
    canonicalWritable:false,
  },
};
if(mode==='--check')process.stdout.write(JSON.stringify(report,null,2)+'\n');
else{
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const ox=-crop.x*2048/crop.width,oy=-crop.y*1152/crop.height;
  const iw=4096*2048/crop.width,ih=2355*1152/crop.height;
  const bg=layer=>'<image x="'+ox+'" y="'+oy+'" width="'+iw+
    '" height="'+ih+'" preserveAspectRatio="none" href="data:image/png;base64,'+
    images[layer].data.toString('base64')+'"/>';
  const makeRuns=(predicate,color,alpha)=>{
    const paths=[];
    for(let y=90;y<570;y++){
      let x=40;
      while(x<660){
        if(!predicate(y*width+x)){x++;continue;}
        const left=x++;
        while(x<660&&predicate(y*width+x))x++;
        paths.push('M'+left+' '+y+'h'+(x-left)+'v1h-'+(x-left)+'z');
      }
    }
    return '<path fill="'+color+'" fill-opacity="'+alpha+'" d="'+paths.join('')+'"/>';
  };
  const guides=makeRuns(i=>preview.ownership[i]===4,'#73BAF1','.42')+
    makeRuns(i=>preview.ownership[i]===2,'#E1AB62','.32');
  const direct=makeRuns(i=>labels[i]===30&&bridge.contactMinInk[i]===0,'#56F6E5','.95');
  const hops1=makeRuns(i=>labels[i]===30&&bridge.contactMinInk[i]===1,'#FFF58D','.95');
  const hops23=makeRuns(i=>labels[i]===30&&
    bridge.contactMinInk[i]!==UNREACHABLE_INK&&
    bridge.contactMinInk[i]>=2&&bridge.contactMinInk[i]<=3,'#FF9D55','.9');
  const enclosed=makeRuns(i=>sharedBlue[i]&&!water.edgeConnectedBlue[i],'#FFE177','.7');
  const panel=(left,label,layer,overlay)=>'<text x="'+left+
    '" y="45" font-size="16" font-family="Arial" fill="#F0F5F9">'+esc(label)+'</text>'+
    '<svg x="'+left+'" y="58" width="608" height="470" viewBox="40 90 620 480">'+
    bg(layer)+overlay+'</svg>'+
    '<rect x="'+left+'" y="58" width="608" height="470" stroke="#AEC5D6" fill="none"/>';
  process.stdout.write('<svg xmlns="http://www.w3.org/2000/svg" width="1900" height="668" viewBox="0 0 1900 668">'+
    '<rect width="1900" height="668" fill="#142236"/>'+
    '<text x="20" y="21" font-size="18" font-family="Arial" font-weight="bold" fill="white">'+
    'KAELVAR C1-I / ORIGINAL SOURCE PIXEL SEPARATION / NOT CERTIFIED HYDROLOGY</text>'+
    panel(18,'1. Protected original biome source', 'biome','')+
    panel(646,'2. Enclosed blue patches (gold) / NO lake proof','biome',enclosed)+
    panel(1274,'3. Coast/dryland guides + unknown shared-ink contact','biome',
      guides+direct+hops1+hops23)+
    '<text x="20" y="565" fill="#E0EEF9" font-size="14">'+
    'Direct source-blue neighbor: cyan | 1 shared-nonblue step: pale yellow | 2-3 steps: amber | gold water patches: enclosed blue only.</text>'+
    '<text x="20" y="598" fill="#FFD2B6" font-size="13">'+
    'These are four-neighbor SOURCE classifications only. Blue can be river/ink; nonblue can be artwork or other unresolved terrain.</text>'+
    '<text x="20" y="623" fill="#CFDBE8" font-size="13">'+
    'No coastline, Kharuun port, Veyrholm corridor, watershed, salt basin, road or island ownership is approved.</text>'+
    '<text x="20" y="647" fill="#C6D6E9" font-size="13">'+
    'Mainland candidates: 79,419 | Unassigned: 26,795 | Shattercap islands: held | Old Windward source: excluded from proposal.</text></svg>\n');
}
