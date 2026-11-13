#!/usr/bin/env node
/**
 * First World source RGB & raw height witness. READ ONLY.
 *
 * node scripts/first-world-environment-evidence.mjs --check > evidence.json
 * node scripts/first-world-environment-evidence.mjs --swatches-svg > source-rgb-swatches.svg
 *
 * IMPORTANT: a biome map is not a trusted semantic palette without a reviewed
 * color legend. Raw elevation brightness is not meters without encoding/scale
 * calibration. This tool makes unsupported interpretations impossible.
 */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {verifyAuditedTextBlob} from './lib/first-world-source-identity.mjs';
import {decodeSourcePng,registeredSourceMask} from './lib/first-world-source-png.mjs';
import {registeredRgba,buildEnvironmentProfiles}
  from './lib/first-world-environment-profiles.mjs';

const argv=process.argv.slice(2);
if(argv.length!==1 || !['--check','--swatches-svg'].includes(argv[0])){
  console.error('Usage: node scripts/first-world-environment-evidence.mjs --check|--swatches-svg');
  process.exit(2);
}
const ROOT=resolve(fileURLToPath(new URL('..',import.meta.url)));
const load=p=>JSON.parse(readFileSync(resolve(ROOT,p),'utf8').replace(/^\uFEFF/,''));
const world=load('packages/content/base/world/world_maps.json').records
  .find(r=>r.id==='world_map.first_world');
const features=load('packages/content/base/world/world_map_features.json').records
  .find(r=>r.mapId==='world_map.first_world');
const regions=load('packages/content/base/world/regions.json').records;
const ecology=load('packages/content/base/world/regional_ecology_profiles.json').records;
const catalog=load('packages/content/base/world/biomes.json').records;
const excluded=load('docs/design/first-world-offshore-square-artifact-removal-2026-11-12.json')
  .removedSourceFeatureIds;
const decisions=load('docs/design/first-world-macro-ownership-review-2026-11-12.json');
if(!world||!features||excluded.length!==42||new Set(excluded).size!==42||
   decisions.auditedCommit!=='41a8ab1dd8c35cae12c8b392fa12da55c74401db')
  throw Error('Audited source registry changed; manual review required');
const raw=readFileSync(resolve(ROOT,'packages/content/base/world/world_map_features.json'));
const identity=verifyAuditedTextBlob(raw,decisions.sourceGeometryBlob);
const {referenceImageWidthPx:width,referenceImageHeightPx:height}=features;
if(width!==2048||height!==1152||
   world.scaleProfile.referenceImageWidthPx!==width||
   world.scaleProfile.referenceImageHeightPx!==height)
  throw Error('Unreviewed source map registration');
const pathFor=layer=>resolve(ROOT,world.layerAssetPaths[layer]);
const records={};
const decoded={};
for(const name of ['biome','elevation']){
  const source=readFileSync(pathFor(name));
  const png=decodeSourcePng(source);
  records[name]={
    path:world.layerAssetPaths[name],
    sha256:createHash('sha256').update(source).digest('hex'),
    width:png.width,height:png.height,bitDepth:png.bitDepth,colorType:png.colorType,
  };
  decoded[name]=png;
}
if(decoded.biome.width!==decoded.elevation.width||
   decoded.biome.height!==decoded.elevation.height)
  throw Error('Biome/elevation source natural dimensions mismatch');
const rect=world.assetReferenceRectPx;
const biomeRgba=registeredRgba(decoded.biome,rect,width,height);
const elevationRgba=registeredRgba(decoded.elevation,rect,width,height);
const landMask=registeredSourceMask(decoded.biome,rect,width,height);
const ignored=new Set(excluded);
const footprints=features.regionFootprints.filter(p=>!ignored.has(p.id));
if(![159,201].includes(features.regionFootprints.length)||
   footprints.length!==159||features.coastlines.length!==68)
  throw Error('Unreviewed source footprint inventory');
/**
 * RGB buckets are explicitly not canonical biome labels. The viewer can
 * annotate them against an independently reviewed source color legend.
 */
function swatchesSvg(){
  const buckets=new Map();
  let land=0;
  for(let i=0;i<landMask.length;i++){
    if(!landMask[i])continue;
    land++;
    const p=i*4,r=biomeRgba[p],g=biomeRgba[p+1],b=biomeRgba[p+2];
    const key=(r>>4)*256+(g>>4)*16+(b>>4);
    if(!buckets.has(key))buckets.set(key,{count:0,r:0,g:0,b:0});
    const x=buckets.get(key);
    x.count++;x.r+=r;x.g+=g;x.b+=b;
  }
  const ordered=[...buckets.values()].sort((a,b)=>b.count-a.count)
    .slice(0,48);
  const fmt=x=>x.toString(16).padStart(2,'0').toUpperCase();
  const W=1024,cellW=164,cellH=86;
  const rows=ordered.map((o,i)=>{
    const c=i%6,row=Math.floor(i/6),x=18+c*168,y=110+row*90;
    const rgb='#'+fmt(Math.round(o.r/o.count))+fmt(Math.round(o.g/o.count))+
      fmt(Math.round(o.b/o.count));
    const share=(100*o.count/land).toFixed(2);
    return '<rect x="'+x+'" y="'+y+'" width="'+cellW+'" height="'+cellH+
      '" fill="#eef1f0" stroke="#64727d"/><rect x="'+(x+6)+'" y="'+(y+6)+
      '" width="55" height="66" fill="'+rgb+'" stroke="#334451"/>'+
      '<text x="'+(x+68)+'" y="'+(y+33)+
      '" font-family="monospace" font-size="14" fill="#172a37">'+rgb+
      '</text><text x="'+(x+68)+'" y="'+(y+56)+
      '" font-family="monospace" font-size="12" fill="#425966">'+share+'% land</text>';
  }).join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+W+
    '" height="866" viewBox="0 0 1024 866">'+
    '<rect width="1024" height="866" fill="#f7f8f5"/>'+
    '<text x="18" y="38" font-size="24" font-family="sans-serif" fill="#142635">'+
    'First World: source-biome RGB swatches</text>'+
    '<text x="18" y="67" font-size="15" font-family="sans-serif" fill="#243949">'+
    '48 most common RGB clusters inside the PROVISIONAL land mask. Not biome labels.</text>'+
    '<text x="18" y="88" font-size="13" font-family="sans-serif" fill="#243949">'+
    'Black and blue can be terrain, water or artwork; verify source before border edits.</text>'+
    rows+'</svg>\n';
}
const result=buildEnvironmentProfiles({
  width,height,biomeRgba,elevationRgba,landMask,footprints,regions,
  ecologyProfiles:ecology,
});
const authoritativeSlugs=new Set(catalog.map(b=>b.slug));
const rawAliases=[...new Set(regions.flatMap(r=>
  r.environmentProfile?.dominantBiomeMix??[]))].sort();
const unmatchedTerms=rawAliases.filter(slug=>!authoritativeSlugs.has(slug));
if(argv[0]==='--swatches-svg'){
  process.stdout.write(swatchesSvg());
  process.exit(0);
}
process.stdout.write(JSON.stringify({
  ...result,sourceGeometry:identity,sourceRasterHashes:records,
  registration:{rect,width,height,resampling:'nearest source center',
    waterRule:'B>150 and B-G>25 and B-R>80 on original biome raster'},
  authoredVocabulary:{
    catalogBiomeCount:catalog.length,profileMixTerms:rawAliases,
    nonCanonicalBiomeTerms:unmatchedTerms,
    note:'Descriptive habitat/climate/land-use names need independently approved synonym mapping; farmland cannot be read from a raw biome pixel.',
  },
  reviewGates:{
    independentRgbAndRawHeightEvidence:'MEASURED_ON_EXECUTION',
    labeledBiomeColorLegend:'NOT_PROVIDED_NOT_INTERPRETED',
    landWaterPalette:'PROVISIONAL_SOURCE_RGB_THRESHOLD_UNREVIEWED',
    elevationEncodingAndPhysicalScale:'NOT_VERIFIED_NOT_INTERPRETED',
    coherentRegionBiomeBoundaries:'NOT_YET_APPROVED',
    historicalEcologyNarratives:'EXPECTATION_ONLY_NOT_OBSERVED',
    canonicalGeographyWritable:false,
  },
},null,2)+'\n');
