#!/usr/bin/env node
/**
 * C1-H only inspects original authored source pixels. stdout --check/--svg.
 * No canonical maps, basins, shorelines, political borders, or routes written.
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
import {validateKaelvarC1GEcology}
  from './lib/kaelvar-c1g-ecology-evidence.mjs';
import {C1_SOURCE_VARIANTS}
  from './lib/world-geographic-authority.mjs';
import {readPinnedCommittedVectorSource}
  from './lib/world-source-git-witness.mjs';
import {
  registeredSharedBlueMask,measureBlueAdjacency,
  summarizeGuideSourceEvidence,sampleNorthernEvidenceTransects,
  UNREACHED_BLUE_CONTACT,
} from './lib/kaelvar-c1h-source-diagnostics.mjs';

const mode=process.argv[2];
if(process.argv.length!==3||!['--check','--svg'].includes(mode)){
  console.error('Usage: --check|--svg (review-only stdout)');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const bytes=p=>readFileSync(resolve(root,p));
const json=p=>JSON.parse(bytes(p).toString('utf8').replace(/^\uFEFF/,''));
const fail=x=>{throw Error('C1-H source HOLD: '+x);};
const c1=json('docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json');
const spec=json('docs/design/kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json');
const c1g=json('docs/design/kaelvar-c1g-coastline-salt-basin-evidence-2026-11-13.json');
validateC1FPlacementGuides(spec,c1);
validateKaelvarC1GEcology({
  review:c1g,c1fGuides:spec,c1Ledger:c1,
  localityPack:json(c1g.sourcePaths.localityPack),
  ecologyPack:json(c1g.sourcePaths.ecologyPack),
});
const map=json('packages/content/base/world/world_maps.json').records
  .find(x=>x.id==='world_map.first_world');
const crop=c1.sourceWitness.crop;
if(!map||!['x','y','width','height']
  .every(k=>map.assetReferenceRectPx?.[k]===crop[k]))
  fail('source crop drift');
const {sourceBlob,sourceBytes}=readPinnedCommittedVectorSource({
  repoRoot:root,sourcePath:c1.sourceWitness.originalGeometryPath,
  acceptedBlobShas:Object.values(C1_SOURCE_VARIANTS),
});
const vector=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
  .records.find(x=>x.mapId==='world_map.first_world');
const variant=sourceBlob===C1_SOURCE_VARIANTS.master201?'MAINLINE_201_UNFILTERED':
  sourceBlob===C1_SOURCE_VARIANTS.draft159?'DRAFT_159_ALREADY_EXCLUDED':null;
if(!variant||vector?.regionFootprints?.length!==
   (variant==='MAINLINE_201_UNFILTERED'?201:159)||
   vector?.coastlines?.length!==68)
  fail('source vector fingerprint/inventory mismatch');
const images={};
for(const [layer,sha] of [['biome',c1.sourceWitness.biomeSha256],
  ['elevation',c1.sourceWitness.elevationSha256]]){
  const path=map.layerAssetPaths?.[layer];
  if(!path)fail('missing original PNG source path');
  const data=bytes(path);
  if(createHash('sha256').update(data).digest('hex')!==sha)
    fail('original source PNG hash drift '+layer);
  const decoded=decodeSourcePng(data);
  if(decoded.width!==4096||decoded.height!==2355)
    fail('source image dimensions drift');
  images[layer]={data,decoded};
}
const {widthPixels:width,heightPixels:height}=c1.coordinateSpace;
if(width!==2048||height!==1152)fail('registered reference dimensions changed');
const terrain=registeredTerrainCandidates({
  biome:images.biome.decoded,elevation:images.elevation.decoded,
  crop,width,height,
});
const {labels,main}=checkedC1FMainland(terrain,width,height);
const c1f=buildC1FPreview({spec,labels,width,height});
const blue=registeredSharedBlueMask({
  biome:images.biome.decoded,elevation:images.elevation.decoded,
  crop,width,height,
});
const adj=measureBlueAdjacency({labels,blue,width,height});
const region= summarizeGuideSourceEvidence({
  labels,blue,distances:adj.distances,ownership:c1f.ownership,
  elevation:images.elevation.decoded,crop,width,height,
});
if(region.mainCandidateCells!==79419||
  region.unassignedCandidateCells!==26795||
  region.guides.map(r=>r.candidateCells).join(',')!=='10899,20295,18474,2956'||
  region.islandAssignedCells!==0)
  fail('owner-reviewed C1-F guide source count drift');
const transects=sampleNorthernEvidenceTransects({
  labels,blue,ownership:c1f.ownership,distances:adj.distances,width,height,
});
const report={
  status:'C1H_REGISTERED_SOURCE_DIAGNOSTIC_COMPLETE_PHYSICAL_INTERPRETATION_HELD',
  sourceVectorVariant:variant,sourceVectorBlob:sourceBlob,
  sourcePngHashesVerified:true,sourceCrop:crop,
  sourceCandidateMethod:'SOURCE_BIOME_ELEVATION_RGB_DIFFERENCE_OFF_BLUE',
  mainlandReferenceComponentId:main.id,
  diagnosticSharedBlueContact:{
    candidateSharedBluePixels:adj.sharedBlueCandidatePixels,
    candidateMainlandPixels:adj.candidateMainlandPixels,
    immediateMainlandSharedBlueNeighborPixels:adj.immediateBlueNeighborMainlandPixels,
    reachableCandidateMainlandPixels:adj.reachableMainlandPixels,
    unreachableCandidateMainlandPixels:adj.unreachableMainlandPixels,
    method:adj.method,
    seaOrRiverClassificationVerified:false,
    mainlandShorelineCertified:false,
  },
  previewEvidence:region, northernTransects:transects,
  interpretationHolds:{
    sourceBlueIsNotCertifiedOcean:true,
    sourceBlueMayIncludeRiversOrInk:true,
    rawLumaIsNotElevationMeters:true,
    heightRampCalibrated:false,
    closedDrainageVerified:false,
    candidateSaltBasinCountVerified:false,
    saltpanCoordinatesPublished:0,
    veyrholmCoastContinuousApproved:false,
    kharuunSeaFrontageApproved:false,
    verifiedPassesAndRoads:0,
    oldWindwardTransferred:false,
    northeasternLargeIslandClaimed:false,
    otherIslandsAssigned:0,
    canonicalWritable:false,
  },
  sourceEvidenceOnly:true,ownerBorderApprovalRequired:true,
};
if(mode==='--check'){
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
}else{
  const clip={x:40,y:90,width:620,height:480};
  const esc=s=>String(s).replace(/&/g,'&amp;')
    .replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const xOrigin=-crop.x*2048/crop.width,yOrigin=-crop.y*1152/crop.height;
  const imW=4096*2048/crop.width,imH=2355*1152/crop.height;
  const bg=(name)=>'<image x="'+xOrigin+'" y="'+yOrigin+
    '" width="'+imW+'" height="'+imH+
    '" preserveAspectRatio="none" href="data:image/png;base64,'+
    images[name].data.toString('base64')+'"/>';
  // Source-constrained colored cells only; never show raw guide polygons
  // across sea, and never draw a guessed salt basin location.
  const runPaths=(predicate,color,opacity)=>{
    const parts=[];
    for(let y=clip.y;y<clip.y+clip.height;y++){
      let x=clip.x;
      while(x<clip.x+clip.width){
        let i=y*width+x;
        if(!predicate(i)){x++;continue;}
        const left=x++;
        while(x<clip.x+clip.width&&predicate(y*width+x))x++;
        parts.push('M'+left+' '+y+'h'+(x-left)+'v1h-'+(x-left)+'z');
      }
    }
    return '<path fill="'+color+'" fill-opacity="'+opacity+
      '" d="'+parts.join('')+'"/>';
  };
  const veyr=runPaths(i=>c1f.ownership[i]===4,'#75BDF4','.48');
  const khar=runPaths(i=>c1f.ownership[i]===2,'#D9AD64','.25');
  const contacts=runPaths(i=>labels[i]===30&&adj.distances[i]===0,'#47F6FF','.82');
  const panel=(heading,n,name,overlay)=>'<text x="'+[18,646,1274][n]+
    '" y="45" font-family="Arial" font-size="17" fill="#EDF2F7">'+esc(heading)+'</text>'+
    '<svg x="'+[18,646,1274][n]+'" y="58" width="608" height="470" viewBox="40 90 620 480">'+
    bg(name)+overlay+'</svg>'+
    '<rect x="'+[18,646,1274][n]+'" y="58" width="608" height="470" fill="none" stroke="#BAC5D7"/>';
  process.stdout.write('<svg xmlns="http://www.w3.org/2000/svg" width="1900" height="662" viewBox="0 0 1900 662">'+
    '<rect width="1900" height="662" fill="#142236"/>'+
    '<text x="18" y="20" fill="#F5F7FB" font-size="18" font-family="Arial" font-weight="bold">'+
    'KAELVAR C1-H | SOURCE EVIDENCE ONLY | NO COAST OR SALT BASIN APPROVED</text>'+
    panel('1. Original biome source / uncalibrated',0,'biome','')+
    panel('2. Cyan: shared-blue neighbor CANDIDATES',1,'biome',veyr+khar+contacts)+
    panel('3. Original elevation colors / NOT meters',2,'elevation',khar)+
    '<text x="20" y="557" font-size="14" fill="#E2F0F8">'+
    'Blue: Veyrholm preview cells | Tan: Kharuun preview cells | Cyan: mainland pixels beside shared-source blue</text>'+
    '<text x="20" y="583" font-size="13" fill="#FFDDBE">'+
    'WARNING: shared-blue source pixels can be sea, rivers or ink. A blue neighbor never proves ocean frontage.</text>'+
    '<text x="20" y="608" font-size="13" fill="#D8E5F4">'+
    'Elevation RGB brightness is uncalibrated. No depression, closed watershed, salt deposits, wells or roads are inferred.</text>'+
    '<text x="20" y="631" font-size="13" fill="#BED0E0">'+
    'Registered terrain candidates: '+region.mainCandidateCells+
    ' mainland | '+region.unassignedCandidateCells+' unassigned | islands owned 0 | salt basins mapped 0.'+
    '</text></svg>\n');
}

