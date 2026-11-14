#!/usr/bin/env node
/** Original traced coastline source witnesses, noncanonical stdout only. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {readPinnedCommittedVectorSource} from './lib/world-source-git-witness.mjs';
import {C1_SOURCE_VARIANTS} from './lib/world-geographic-authority.mjs';
import {decodeSourcePng} from './lib/kaelvar-c1f-source-png.mjs';
import {registeredTerrainCandidates,checkedC1FMainland,buildC1FPreview}
  from './lib/kaelvar-c1f-source-raster.mjs';
import {validateC1FPlacementGuides} from './lib/kaelvar-c1f-placement-intent.mjs';
import {validateKaelvarC1GEcology} from './lib/kaelvar-c1g-ecology-evidence.mjs';
import {
  validateC1JContract,selectC1JOriginalVectorEdges,
  sampleContourTerrainProximity,
} from './lib/kaelvar-c1j-vector-coastline-review.mjs';

const mode=process.argv[2];
if(process.argv.length!==3||!['--check','--svg'].includes(mode)){
  console.error('Usage: --check|--svg (original source contour review only)');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const bytes=p=>readFileSync(resolve(root,p));
const json=p=>JSON.parse(bytes(p).toString('utf8').replace(/^\uFEFF/,''));
const fail=s=>{throw Error('C1-J original coastline HOLD: '+s);};
const contract=json('docs/design/kaelvar-c1j-coastline-sector-review-2026-11-13.json');
const c1=json(contract.sourcePaths.c1),c1f=json(contract.sourcePaths.c1f),c1g=json(contract.sourcePaths.c1g);
validateC1JContract(contract,c1,c1f,c1g);
validateC1FPlacementGuides(c1f,c1);
validateKaelvarC1GEcology({
  review:c1g,c1fGuides:c1f,c1Ledger:c1,
  localityPack:json(c1g.sourcePaths.localityPack),
  ecologyPack:json(c1g.sourcePaths.ecologyPack),
});
const maps=json('packages/content/base/world/world_maps.json').records;
const map=maps.find(x=>x.id==='world_map.first_world'),crop=c1.sourceWitness.crop;
if(!map||!['x','y','width','height'].every(k=>map.assetReferenceRectPx?.[k]===crop[k]))
  fail('map and original crop disagreement');
const {sourceBlob,sourceBytes}=readPinnedCommittedVectorSource({
  repoRoot:root,sourcePath:contract.sourceGeometryPath,
  acceptedBlobShas:Object.values(C1_SOURCE_VARIANTS),
});
const sourceVariant=sourceBlob===C1_SOURCE_VARIANTS.master201?
  'MAINLINE_201_UNFILTERED':sourceBlob===C1_SOURCE_VARIANTS.draft159?
  'DRAFT_159_ALREADY_EXCLUDED':null;
const source=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
  .records.find(x=>x.mapId==='world_map.first_world');
if(!sourceVariant||!source||source.regionFootprints?.length!==
  (sourceVariant==='MAINLINE_201_UNFILTERED'?201:159))
  fail('original vector source variant drift');
const selected=selectC1JOriginalVectorEdges(source,contract);
const imgs={};
for(const [layer,sha] of [['biome',c1.sourceWitness.biomeSha256],
  ['elevation',c1.sourceWitness.elevationSha256]]){
  const path=map.layerAssetPaths?.[layer];
  if(!path)fail('missing original source PNG '+layer);
  const data=bytes(path);
  if(createHash('sha256').update(data).digest('hex')!==sha)
    fail('original source PNG fingerprint mismatch '+layer);
  const img=decodeSourcePng(data);
  if(img.width!==4096||img.height!==2355)fail('source image dimension drift');
  imgs[layer]={data,img};
}
const width=2048,height=1152;
const terrain=registeredTerrainCandidates({
  biome:imgs.biome.img,elevation:imgs.elevation.img,crop,width,height,
});
const {labels,main}=checkedC1FMainland(terrain,width,height);
const preview=buildC1FPreview({spec:c1f,labels,width,height});
if(main.id!==30||main.areaPx2!==79419||
  preview.unassignedMainlandCandidateCells!==26795||
  preview.islandAssignedCells!==0)
  fail('physical mainland or review partition drift');
const proximity={
  originalMainland:sampleContourTerrainProximity(selected.main.points,labels),
  protectedOffshore: selected.offshore.map(x=>({
    sourceId:x.id,...sampleContourTerrainProximity(x.points,labels),
    wholeIslandOwnershipApproved:false,
  })),
  northernSectorStartPoints:selected.edgeSectors.map((edges,i)=>({
    sourceSectorId:contract.northSectorWindows[i].id,
    ...sampleContourTerrainProximity(edges.map(x=>x.a),labels),
  })),
};
const report={
  status:'C1J_VECTOR_COASTLINE_REVIEW_COMPLETE_SEMANTICS_HELD',
  sourceVariant,sourceVectorBlob:sourceBlob,originalSourcePngsVerified:true,
  registeredCrop:crop,
  sourceCoastlines:68,sourceRivers:8,sourceMainlandTerrainCandidates:79419,
  originalSourceCoastlineReview:selected.report,
  sourceContourToTerrainProximity:proximity,
  interpretationHolds:{
    oceanRegionAssociationNotPoliticalOwnership:true,
    northCoastlineSemanticsApproved:false,
    sourceBlueRiverInkCalibrated:false,
    northernCoastalCorridorApproved:false,
    kharuunDirectSeaFrontageApproved:false,
    saltBasinsMapped:0,
    islandComponentOwnershipAssigned:0,
    separateThalosRunIsNotCoastline:true,
    legacyCoast40NotIdenticalToVectorCoastlinePart40:true,
    windwardSerathylTransferApproved:false,
    canonicalWritable:false,
  },
};
if(mode==='--check')process.stdout.write(JSON.stringify(report,null,2)+'\n');
else{
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const ox=-crop.x*2048/crop.width,oy=-crop.y*1152/crop.height;
  const iw=4096*2048/crop.width,ih=2355*1152/crop.height;
  const baseImage='<image x="'+ox+'" y="'+oy+'" width="'+iw+
    '" height="'+ih+'" preserveAspectRatio="none" href="data:image/png;base64,'+
    imgs.biome.data.toString('base64')+'"/>';
  const path=(points,closed=false)=>{
    const start=points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ');
    return start+(closed?' Z':'');
  };
  const line=(p,color,width=1,opacity=1,dash='')=>
    '<path d="'+p+'" fill="none" stroke="'+color+'" stroke-width="'+width+
    '" stroke-opacity="'+opacity+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
  const contour=line(path(selected.main.points,true),'#E0E5EE',1.3,.85);
  const colors=['#73C5FF','#C4B7FF','#FFD077'];
  const north=selected.edgeSectors.map((set,i)=>
    line(set.map(s=>'M'+s.a.x+' '+s.a.y+' L'+s.b.x+' '+s.b.y).join(' '),
      colors[i],2.5,.95)).join('');
  const islands=selected.offshore.map(x=>line(path(x.points,true),
    '#F3C473',2,.9,'4 3')).join('');
  const river=line(path(selected.river.points),'#51E2C8',2.5,.9,'5 3');
  const maskRows=(predicate,color)=>{
    const runs=[];
    for(let y=90;y<570;y++){
      let x=40;
      while(x<660){
        if(!predicate(y*2048+x)){x++;continue;}
        const start=x++;
        while(x<660&&predicate(y*2048+x))x++;
        runs.push('M'+start+' '+y+'h'+(x-start)+'v1h-'+(x-start)+'z');
      }
    }
    return '<path fill="'+color+'" fill-opacity=".28" d="'+runs.join('')+'"/>';
  };
  const guides=maskRows(i=>preview.ownership[i]===4,'#80C2F5')+
    maskRows(i=>preview.ownership[i]===2,'#D9B16D');
  const panel=(left,head,overlay)=>'<text x="'+left+
    '" y="44" fill="#F0F4F9" font-size="17">'+esc(head)+'</text>'+
    '<svg x="'+left+'" y="57" width="608" height="470" viewBox="40 90 620 480">'+
    baseImage+overlay+'</svg>'+
    '<rect x="'+left+'" y="57" width="608" height="470" fill="none" stroke="#A0B3C7"/>';
  process.stdout.write('<svg xmlns="http://www.w3.org/2000/svg" width="1900" height="675" viewBox="0 0 1900 675">'+
    '<rect width="1900" height="675" fill="#142338"/>'+
    '<text x="20" y="20" fill="#FFFFFF" font-size="18" font-weight="bold">'+
    'KAELVAR C1-J / ORIGINAL COASTLINE VECTORS / NO BORDERS OR WATER SEMANTICS APPROVED</text>'+
    panel(18,'1. Protected biome source: unchanged','')+
    panel(646,'2. Mainland Part 10: original northern source edges',contour+north)+
    panel(1274,'3. Current guide cells, held islands, separate river',guides+contour+islands+river)+
    '<text x="22" y="554" font-size="14" fill="#DDECF8">'+
    'Northwest vector edges: 90 (blue) | North-central: 106 (lavender) | Northeastern: 114 (gold) | Other original edges: 289.</text>'+
    '<text x="22" y="585" font-size="13" fill="#E9D6B5">'+
    'Contours are original catalog source traces, NOT certified sea, coast ownership, biome or sovereign borders. Dashes: islands HELD / river provenance.</text>'+
    '<text x="22" y="612" font-size="13" fill="#DBE6F3">'+
    'All 68 source coastlines have an ocean-region association, not a Kaelvar political parent; Thalos Run remains distinct river evidence.</text>'+
    '<text x="22" y="639" font-size="13" fill="#C8DBED">'+
    'NE island, Shattercap components, Coast 40 and Serathyl Windward remain disputed. No Kharuun port, salt basin or route is approved.</text>'+
    '<text x="22" y="660" font-size="13" fill="#C0D4E7">'+
    'Registered 2048x1152 | 599 exact original mainland edges | 79,419 terrain candidates | 26,795 unassigned | canonical publication OFF.</text></svg>\n');
}
