#!/usr/bin/env node
/**
 * First World source-pair QA: READ ONLY, no change to legacy masks/regions.
 *
 * node scripts/first-world-source-pair-qa.mjs --check > source-pair-qa.json
 * node scripts/first-world-source-pair-qa.mjs --svg-qa > source-pair-qa.svg
 */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {verifyAuditedTextBlob} from './lib/first-world-source-identity.mjs';
import {decodeSourcePng} from './lib/first-world-source-png.mjs';
import {registeredRgba} from './lib/first-world-environment-profiles.mjs';
import {classifySourcePair,sourcePairFootprintRows,sourcePairQaSvg}
  from './lib/first-world-source-pair-qa.mjs';

const args=process.argv.slice(2);
if(args.length!==1 || !['--check','--svg-qa'].includes(args[0])){
  console.error('Usage: node scripts/first-world-source-pair-qa.mjs --check|--svg-qa');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const load=path=>JSON.parse(readFileSync(resolve(root,path),'utf8').replace(/^\uFEFF/,''));
const map=load('packages/content/base/world/world_maps.json').records
  .find(r=>r.id==='world_map.first_world');
const features=load('packages/content/base/world/world_map_features.json').records
  .find(r=>r.mapId==='world_map.first_world');
const regions=load('packages/content/base/world/regions.json').records;
const exclusion=load('docs/design/first-world-offshore-square-artifact-removal-2026-11-12.json')
  .removedSourceFeatureIds;
const ledger=load('docs/design/first-world-macro-ownership-review-2026-11-12.json');
if(!map||!features||exclusion.length!==42||new Set(exclusion).size!==42)
  throw Error('Original source map or exclusion manifest is not audited');
const raw=readFileSync(resolve(root,'packages/content/base/world/world_map_features.json'));
const sourceIdentity=verifyAuditedTextBlob(raw,ledger.sourceGeometryBlob);
const width=features.referenceImageWidthPx,height=features.referenceImageHeightPx;
if(width!==2048||height!==1152||
   map.scaleProfile.referenceImageWidthPx!==width||
   map.scaleProfile.referenceImageHeightPx!==height)
  throw Error('Reference-grid registration changed');
const metadata={},rasters={};
for(const layer of ['biome','elevation']){
  const path=map.layerAssetPaths[layer];
  const original=readFileSync(resolve(root,path));
  const decoded=decodeSourcePng(original);
  metadata[layer]={path,sha256:createHash('sha256').update(original).digest('hex'),
    naturalWidth:decoded.width,naturalHeight:decoded.height};
  rasters[layer]=decoded;
}
if(rasters.biome.width!==rasters.elevation.width||
   rasters.biome.height!==rasters.elevation.height)
  throw Error('Paired source PNG dimensions have diverged');
const crop=map.assetReferenceRectPx;
const biomeRgba=registeredRgba(rasters.biome,crop,width,height);
const elevationRgba=registeredRgba(rasters.elevation,crop,width,height);
const pair=classifySourcePair({width,height,biomeRgba,elevationRgba});
if(args[0]==='--svg-qa'){
  process.stdout.write(sourcePairQaSvg(pair.classification,width,height));
  process.exit(0);
}
const ignored=new Set(exclusion);
const footprints=features.regionFootprints.filter(p=>!ignored.has(p.id));
if(footprints.length!==159||features.coastlines.length!==68)
  throw Error('Audited region/coastline geometry inventory has changed');
const ownerById=new Map(regions.map(r=>[r.id,r]));
const rows=sourcePairFootprintRows({
  width,height,classification:pair.classification,footprints,
  regionById:ownerById,
});
const suspectKeys=[
  'feature.region_windward_spine.part_1',
  'feature.region_windward_spine.part_2',
  'feature.region_verdant_thalos.part_6',
];
for(const id of suspectKeys)
  if(!rows.some(r=>r.id===id))throw Error('Missing Coast 10/40 candidate: '+id);
const uncertain=row=>row.candidateClasses.SHARED_NONBLUE_UNRESOLVED.pixels+
  row.candidateClasses.BLUE_DIVERGENCE_UNRESOLVED.pixels+
  row.candidateClasses.ALPHA_UNRESOLVED.pixels;
const ranking=[...rows].filter(r=>r.footprintCells>0)
  .sort((a,b)=>(uncertain(b)/b.footprintCells)-
    (uncertain(a)/a.footprintCells) || a.id.localeCompare(b.id));
process.stdout.write(JSON.stringify({
  ...pair.report,sourceIdentity,sourceImages:metadata,
  crop,referenceGrid:{width,height},excludedArtifactCount:42,
  retainedFootprints:footprints.length,
  registration:'nearest-source-center using world_maps.json crop',
  regionFootprints:rows,
  highestUnresolvedShare:ranking.slice(0,20).map(r=>({
    id:r.id,regionId:r.regionId,footprintCells:r.footprintCells,
    unresolvedCells:uncertain(r),
    sharePercent:Number((100*uncertain(r)/r.footprintCells).toFixed(2)),
  })),
  coast10And40:rows.filter(r=>suspectKeys.includes(r.id)),
  nextGate:'Visual review of shared ink near real coastline and river channels; do not derive or merge physical components from ink-only masks.',
  sourceGeometryWritable:false,
},null,2)+'\n');
