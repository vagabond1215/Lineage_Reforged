#!/usr/bin/env node
/** Read-only C1 geometry intake, original-source crosswalk and SVG evidence. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateKaelvarC1ReviewLedger,C1_SOURCE_VARIANTS}
  from './lib/world-geographic-authority.mjs';
const mode=process.argv[2];
if(process.argv.length!==3||!['--check','--svg'].includes(mode)){
  console.error('Usage: --check|--svg (read-only, stdout only)');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const bytes=p=>readFileSync(resolve(root,p));
const json=p=>JSON.parse(bytes(p).toString('utf8').replace(/^\uFEFF/,''));
const digest=(buffer,algorithm)=>createHash(algorithm).update(buffer).digest('hex');
const blobSha=buffer=>createHash('sha1')
  .update('blob '+buffer.length+'\0').update(buffer).digest('hex');
const hold=s=>{throw Error('C1 source registration HOLD: '+s);};
const ledger=json('docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json');
const audit=validateKaelvarC1ReviewLedger(ledger);
const maps=json('packages/content/base/world/world_maps.json').records;
const map=maps.find(r=>r.id==='world_map.first_world');
const sourceBytes=bytes(ledger.sourceWitness.originalGeometryPath);
const sourceBlob=blobSha(sourceBytes);
const footprintsExpected=sourceBlob===C1_SOURCE_VARIANTS.master201?201:
  sourceBlob===C1_SOURCE_VARIANTS.draft159?159:null;
if(footprintsExpected===null)hold('unrecognized original source blob');
const source=json(ledger.sourceWitness.originalGeometryPath).records
  .find(r=>r.mapId==='world_map.first_world');
if(!map||!source||source.referenceImageWidthPx!==2048||
  source.referenceImageHeightPx!==1152||
  source.regionFootprints?.length!==footprintsExpected||
  source.coastlines?.length!==68||
  new Set(source.regionFootprints.map(f=>f.id)).size!==footprintsExpected)
  hold('source vector, coastline or footprint inventory changed');
const heldIds=[
  'feature.region_shattercap_isles.part_1',
  'feature.region_shattercap_isles.part_7',
  'feature.region_shattercap_isles.part_15',
  'feature.region_windward_spine.part_1',
  'feature.region_windward_spine.part_2',
  'feature.region_verdant_thalos.part_6',
  'feature.region_auric_marches.part_4',
  'feature.region_verdant_thalos.part_1',
];
if(heldIds.some(id=>!source.regionFootprints.some(f=>f.id===id)))
  hold('protected source footprint missing');
const rect=map.assetReferenceRectPx,crop=ledger.sourceWitness.crop;
if(!rect||['x','y','width','height'].some(k=>rect[k]!==crop[k]))
  hold('source crop drift');
const active=json('packages/content/base/world/regions.json').records;
const required=['region.auric_marches','region.verdant_thalos','region.shattercap_isles'];
if(active.find(r=>r.id==='region.kaelvar')?.regionType!=='continent'||
  required.some(id=>active.find(r=>r.id===id)?.parentRegionId!=='region.kaelvar')||
  ['region.kharuun_drylands','region.veyrholm_shore'].some(id=>active.some(r=>r.id===id)))
  hold('protected active region hierarchy changed');
const images={};
for(const [layer,sha] of [['biome',ledger.sourceWitness.biomeSha256],
  ['elevation',ledger.sourceWitness.elevationSha256]]){
  const path=map.layerAssetPaths?.[layer];
  if(!path)hold('missing source image path: '+layer);
  const data=bytes(path);
  if(digest(data,'sha256')!==sha||
    data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||
    data.readUInt32BE(16)!==4096||data.readUInt32BE(20)!==2355)
    hold('source PNG identity or dimensions changed: '+layer);
  images[layer]={data,path};
}
const report={
  ...audit,
  status:'C1_SOURCE_CROSSWALK_VALID_GEOGRAPHY_STILL_HELD',
  activeVectorVariant:sourceBlob===C1_SOURCE_VARIANTS.master201?
    'MAINLINE_201_UNFILTERED':'DRAFT_159_EXCLUSIONS_ALREADY_APPLIED',
  activeVectorBlob:sourceBlob,
  sourceFootprints:footprintsExpected,sourceCoastlines:68,
  sourcePngsVerified:true,registeredCrop:rect,
  retainedOriginalSourceIds:heldIds,
  neitherSourceVariantIsApprovedFiveRegionGeometry:true,
  sourcePairTerrainComponentsAreUnreviewedEvidence:true,
  visibleReviewOnly:true,canonicalWritable:false,
};
if(mode==='--check'){
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
}else{
  const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const originX=-rect.x*2048/rect.width;
  const originY=-rect.y*1152/rect.height;
  const imageW=4096*2048/rect.width,imageH=2355*1152/rect.height;
  const img=layer=>'<image x="'+originX+'" y="'+originY+'" width="'+imageW+
    '" height="'+imageH+'" preserveAspectRatio="none" href="data:image/png;base64,'+
    images[layer].data.toString('base64')+'"/>';
  const watch=new Map([
    ['feature.region_auric_marches.part_4','#F3BF69'],
    ['feature.region_verdant_thalos.part_1','#7ED9B7'],
    ['feature.region_shattercap_isles.part_1','#47C7E3'],
    ['feature.region_shattercap_isles.part_7','#47C7E3'],
    ['feature.region_shattercap_isles.part_15','#47C7E3'],
    ['feature.region_windward_spine.part_1','#ED6C9B'],
    ['feature.region_windward_spine.part_2','#ED6C9B'],
    ['feature.region_verdant_thalos.part_6','#ED6C9B'],
  ]);
  const outlines=source.regionFootprints.filter(f=>watch.has(f.id)).map(f=>
    '<polygon points="'+f.points.map(p=>p.x+','+p.y).join(' ')+
    '" fill="none" stroke="'+watch.get(f.id)+
    '" stroke-width="2" stroke-dasharray="6 4"/>').join('');
  const labels=['The Auric Marches','The Kharuun Drylands',
    'Verdant Thalos','The Veyrholm Shore','The Shattercap Isles'];
  const colors=['#F3BF69','#DD9B60','#7ED9B7','#8AB5E6','#47C7E3'];
  const key=labels.map((s,i)=>'<g transform="translate('+(22+i*375)+',558)">'+
    '<rect width="13" height="13" fill="'+colors[i]+'"/>'+
    '<text x="20" y="12" fill="#E5ECF5" font-size="13">'+escape(s)+'</text></g>').join('');
  const panel=(left,title,layer,overlay='')=>'<text x="'+left+
    '" y="42" fill="#F0F5FA" font-size="17">'+escape(title)+'</text>'+
    '<svg x="'+left+'" y="58" width="608" height="470" viewBox="40 90 620 480">'+
    img(layer)+overlay+'</svg>'+
    '<rect x="'+left+'" y="58" width="608" height="470" fill="none" stroke="#98A9BD"/>';
  process.stdout.write('<svg xmlns="http://www.w3.org/2000/svg" width="1900" height="658" viewBox="0 0 1900 658">'+
    '<rect width="1900" height="658" fill="#152337"/>'+
    '<text x="18" y="19" fill="#FFFFFF" font-size="17" font-weight="bold">'+
    'KAELVAR C1 / SOURCE-ALIGNED INTAKE / NO FIVE-REGION BORDERS APPROVED</text>'+
    panel(18,'1. Original biome source | uncalibrated','biome')+
    panel(646,'2. Original elevation source | uncalibrated','elevation')+
    panel(1274,'3. ORIGINAL source footprint holds | NOT new borders','biome',outlines)+
    key+
    '<text x="20" y="604" fill="#E9B9C6" font-size="14">'+
    'Region colors are IDENTITIES ONLY. No colored region area is assigned; disputed mainland and detached islands remain unowned.</text>'+
    '<text x="20" y="627" fill="#C7D6E7" font-size="13">'+
    'Current vector source: '+footprintsExpected+' footprints / 68 coastlines. 18 detached candidates (3,693), NE island, Coast 40 and Windward held.</text>'+
    '<text x="20" y="648" fill="#C7D6E7" font-size="12">'+
    'Dashed shapes on panel 3 are prior source provenance, not approved land, biome, region or sovereign boundaries.</text>'+
    '</svg>\n');
}
