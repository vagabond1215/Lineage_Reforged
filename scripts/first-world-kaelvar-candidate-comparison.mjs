#!/usr/bin/env node
/**
 * Read-only Kaelvar review: independent PNG source samples and A/B test windows.
 * Output is stdout only. Does not draw or approve replacement borders.
 *
 * node scripts/first-world-kaelvar-candidate-comparison.mjs --compare > report.json
 * node scripts/first-world-kaelvar-candidate-comparison.mjs --svg > comparison.svg
 */
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {verifyAuditedTextBlob} from './lib/first-world-source-identity.mjs';
import {decodeSourcePng} from './lib/first-world-source-png.mjs';
import {registeredRgba} from './lib/first-world-environment-profiles.mjs';
import {classifySourcePair} from './lib/first-world-source-pair-qa.mjs';
import {buildSourcePairTopologySensitivity,summarizeSourcePairPilotFootprints}
  from './lib/first-world-source-pair-topology.mjs';
import {buildSelectedComponentReview} from './lib/first-world-component-review.mjs';
import {buildShattercapUnionEvidence} from './lib/first-world-shattercap-union.mjs';
import {buildKaelvarCandidateComparison,kaelvarCandidateComparisonSvg}
  from './lib/first-world-kaelvar-candidate-comparison.mjs';

if(process.argv.length!==3||!['--compare','--svg'].includes(process.argv[2])){
  console.error('Usage: --compare|--svg (stdout-only read-only evidence)');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const read=path=>readFileSync(resolve(root,path));
const load=path=>JSON.parse(read(path).toString('utf8').replace(/^\uFEFF/,''));
const map=load('packages/content/base/world/world_maps.json').records
  .find(r=>r.id==='world_map.first_world');
const source=load('packages/content/base/world/world_map_features.json').records
  .find(r=>r.mapId==='world_map.first_world');
const regions=load('packages/content/base/world/regions.json').records;
const exclusion=load('docs/design/first-world-offshore-square-artifact-removal-2026-11-12.json')
  .removedSourceFeatureIds;
const ledger=load('docs/design/first-world-macro-ownership-review-2026-11-12.json');
if(!map||!source||exclusion?.length!==42||new Set(exclusion).size!==42)
  throw Error('Audited source map or 42 approved exclusions changed');
const sourceIdentity=verifyAuditedTextBlob(
  read('packages/content/base/world/world_map_features.json'),ledger.sourceGeometryBlob);
const width=source.referenceImageWidthPx,height=source.referenceImageHeightPx,
  crop=map.assetReferenceRectPx;
if(width!==2048||height!==1152||
  map.scaleProfile.referenceImageWidthPx!==width||
  map.scaleProfile.referenceImageHeightPx!==height||
  crop?.x!==60||crop?.y!==60||crop?.width!==3976||crop?.height!==2235)
  throw Error('Audited First World registered crop/grid changed');
const metadata={},images={};
for(const layer of ['biome','elevation']){
  const path=map.layerAssetPaths[layer],bytes=read(path),decoded=decodeSourcePng(bytes);
  metadata[layer]={path,sha256:createHash('sha256').update(bytes).digest('hex'),
    originalWidth:decoded.width,originalHeight:decoded.height};
  images[layer]=registeredRgba(decoded,crop,width,height);
}
const {classification,report:sourcePair}=classifySourcePair({
  width,height,biomeRgba:images.biome,elevationRgba:images.elevation});
const footprints=source.regionFootprints.filter(p=>!new Set(exclusion).has(p.id));
if(footprints.length!==159||source.coastlines.length!==68)
  throw Error('Audited footprint or coastline count changed');
const topology=buildSourcePairTopologySensitivity({width,height,classification});
const auricId='feature.region_auric_marches.part_4';
const reference=summarizeSourcePairPilotFootprints({
  width,height,classification,topology,footprints,selectedIds:[auricId]})[0];
const mainlandReferenceId=reference.terrainOnlyFourComponents[0]?.componentId;
const oldInkReferenceId=reference.sharedInkIncludedFourComponents[0]?.componentId;
if(!mainlandReferenceId||!oldInkReferenceId)
  throw Error('Auric independent physical mainland reference missing');
const inputs={width,height,classification,
  terrainLabels:topology.grids.terrainOnly.four.labels,footprints,regions,
  biomeRgba:images.biome,elevationRgba:images.elevation,mainlandReferenceId};
if(process.argv[2]==='--svg'){
  process.stdout.write(kaelvarCandidateComparisonSvg(inputs).svg);
  process.exit(0);
}
const current=buildKaelvarCandidateComparison(inputs);
const originalInkComponent=buildSelectedComponentReview({
  width,height,landMask:topology.grids.sharedInkIncluded.mask,
  fourLabels:topology.grids.sharedInkIncluded.four.labels,
  footprints,regions,selectedComponentIds:[oldInkReferenceId]})[0];
const sourceTerrainComponent=buildSelectedComponentReview({
  width,height,landMask:topology.grids.terrainOnly.mask,
  fourLabels:topology.grids.terrainOnly.four.labels,
  footprints,regions,selectedComponentIds:[mainlandReferenceId]})[0];
const shattercap=buildShattercapUnionEvidence({
  width,height,classification,
  terrainLabels:topology.grids.terrainOnly.four.labels,
  footprints,mainlandReferenceId});
if(shattercap.selectedFootprintCount!==15||
  shattercap.deduplicatedTerrainCells!==30938||
  shattercap.terrainCellsOnReferenceMainland!==27245||
  shattercap.componentRows.filter(r=>!r.mainlandReference).length!==18)
  throw Error('Owner-verified Shattercap union witness drift');
if(originalInkComponent.landPixels!==86417||
  originalInkComponent.directSameMacroChildOverlapLandPixels!==88||
  originalInkComponent.unclaimedLandPixels!==1362)
  throw Error('Legacy Coast 10 baseline drift: stop proposal review');
const coast40Footprints=['feature.region_windward_spine.part_2',
  'feature.region_verdant_thalos.part_6'];
for(const id of coast40Footprints)
  if(!footprints.some(p=>p.id===id))
    throw Error('Coast 40 original source record missing: '+id);
process.stdout.write(JSON.stringify({
  ...current,sourceIdentity,sourceImages:metadata,
  registeredCrop:crop,originalSourcePairCounts:sourcePair.candidateClasses,
  oldInkIncludedComponent:{
    componentNamespace:'SHARED_INK_INCLUDED_FOUR_NEIGHBOR_NOT_TERRAIN_ONLY',
    ...originalInkComponent,
  },
  terrainOnlyMainlandComponent:{
    componentNamespace:'TERRAIN_ONLY_FOUR_NEIGHBOR_NOT_LEGACY_COMPONENT_ID',
    ...sourceTerrainComponent,
  },
  shattercapUnion:{
    deduplicatedTerrainCells:shattercap.deduplicatedTerrainCells,
    mainlandTerrainCells:shattercap.terrainCellsOnReferenceMainland,
    detachedTerrainCells:shattercap.terrainCellsOffReferenceMainland,
    overlappingTerrainCells:shattercap.sourcePolygonOverlapCells,
    retainedDetachedComponents:shattercap.componentRows.filter(r=>!r.mainlandReference),
    partsWithoutTerrainCandidates:shattercap.partsWithoutTerrainCandidates,
  },
  coast40:'SEPARATE_ISLAND_SOVEREIGNTY_REVIEW_NOT_TRANSFERRED',
  windwardSecondaryFragment:'TWELVE_TERRAIN_CANDIDATES_RETAINED_FOR_PHYSICAL_REVIEW',
  testsNotExecutedByConnector:true,ownerApprovalRequired:true,
  sourceWritable:false,
},null,2)+'\n');
