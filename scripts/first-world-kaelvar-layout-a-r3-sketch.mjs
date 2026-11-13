#!/usr/bin/env node
/**
 * First World Kaelvar R3 Layout A, strictly noncanonical source-aligned sketch.
 * --report emits aggregate JSON only; --svg emits embedded original-PNG SVG.
 * Both modes are stdout-only. Redirect output to TEMP, never into world content.
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
import {validateLandmassProposalLedger}
  from './lib/first-world-landmass-proposal-ledger.mjs';
import {buildKaelvarLayoutAR3Sketch,kaelvarLayoutAR3SketchSvg}
  from './lib/first-world-kaelvar-layout-a-r3-sketch.mjs';

if(process.argv.length!==3||!['--report','--svg'].includes(process.argv[2])){
  console.error('Usage: --report|--svg (stdout-only; original rasters, no canonical writes)');
  process.exit(2);
}
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const read=p=>readFileSync(resolve(root,p));
const load=p=>JSON.parse(read(p).toString('utf8').replace(/^\uFEFF/,''));
const spec=load('docs/design/first-world-kaelvar-layout-a-r3-sketch-2026-11-13.json');
const base=load('docs/design/first-world-kaelvar-landmass-reconstruction-ledger-2026-11-13.json');
const map=load('packages/content/base/world/world_maps.json').records
  .find(r=>r.id==='world_map.first_world');
const sourcePath='packages/content/base/world/world_map_features.json';
const sourceBytes=read(sourcePath);
const source=JSON.parse(sourceBytes.toString('utf8').replace(/^\uFEFF/,''))
  .records.find(r=>r.mapId==='world_map.first_world');
const regions=load('packages/content/base/world/regions.json').records;
const exclusionPath='docs/design/first-world-offshore-square-artifact-removal-2026-11-12.json';
const exclusionBytes=read(exclusionPath);
const exclusions=JSON.parse(exclusionBytes.toString('utf8').replace(/^\uFEFF/,''))
  .removedSourceFeatureIds;
if(!map||!source||source.coastlines?.length!==68||
  source.regionFootprints?.length!==159||
  exclusions.length!==42||new Set(exclusions).size!==42||
  source.regionFootprints.some(p=>exclusions.includes(p.id)))
  throw Error('R3 requires exact cleaned source 159/68/42 inventory');
const registered=map.assetReferenceRectPx;
if(source.referenceImageWidthPx!==2048||
  source.referenceImageHeightPx!==1152||
  registered?.x!==60||registered?.y!==60||
  registered?.width!==3976||registered?.height!==2235||
  spec.sourceIdentity.grid.width!==2048||
  spec.sourceIdentity.grid.height!==1152||
  JSON.stringify(registered)!==JSON.stringify(spec.sourceIdentity.crop)||
  spec.acceptedPlanningHead!=='8731864d809bb8a18d6d74f4003b9cc941eb0e00'||
  spec.sourceIdentity.geometryGitBlob!==base.immutableEvidence.sourceGeometryGitBlob||
  spec.terrainOnlyPhysicalComponent.componentId!==30)
  throw Error('R3 grid/crop/accepted planning head drift');
const sourceIdentity=verifyAuditedTextBlob(
  sourceBytes,spec.sourceIdentity.geometryGitBlob);
const exclusionManifestIdentity=verifyAuditedTextBlob(
  exclusionBytes,'e3297ead12a6a5ce045418140b043c3fa2b8fcb3');
const baseAudit=validateLandmassProposalLedger({
  ledger:base,regions,sourceFootprints:source.regionFootprints,
  approvedExclusionIds:exclusions,
});
if(baseAudit.status!=='R0_R3_LEDGER_VALID_PLACEMENT_HELD'||
  baseAudit.sourceExclusionState!=='SOURCE_ALREADY_CLEAN'||
  baseAudit.pendingDetachedComponents!==18||
  baseAudit.pendingDetachedTerrainCells!==3693)
  throw Error('R3 parent/child or source holds changed');
const metadata={},images={};
for(const layer of ['biome','elevation']){
  const path=map.layerAssetPaths[layer],bytes=read(path);
  const sha256=createHash('sha256').update(bytes).digest('hex');
  if(sha256!==spec.sourceIdentity[layer+'PngSha256'])
    throw Error('Original source PNG hash drift: '+layer);
  const image=decodeSourcePng(bytes);
  if(image.width!==4096||image.height!==2355)
    throw Error('Original source PNG dimensions drift');
  images[layer]=registeredRgba(image,registered,2048,1152);
  metadata[layer]={path,sha256,originalWidth:image.width,
    originalHeight:image.height};
}
const {classification}=classifySourcePair({
  width:2048,height:1152,biomeRgba:images.biome,elevationRgba:images.elevation,
});
const topology=buildSourcePairTopologySensitivity({
  width:2048,height:1152,classification,
});
const ref=summarizeSourcePairPilotFootprints({
  width:2048,height:1152,classification,topology,
  footprints:source.regionFootprints,
  selectedIds:['feature.region_auric_marches.part_4'],
})[0];
const mainId=ref.terrainOnlyFourComponents[0]?.componentId;
if(mainId!==30)throw Error('K1 reference terrain-only four-neighbor component drift');
const result=buildKaelvarLayoutAR3Sketch({
  width:2048,height:1152,classification,
  terrainLabels:topology.grids.terrainOnly.four.labels,
  footprints:source.regionFootprints,regions,spec,
  expectedDetachedComponents:base.detachedTerrainOnlyComponents,
});
if(result.report.physicalMainlandCandidateTerrainCells!==79419||
  result.report.heldDetachedShattercapCandidateCells!==3693||
  result.report.detachedShattercapRows.length!==18)
  throw Error('R3 independent mainland/island witness drift');
if(process.argv[2]==='--svg'){
  process.stdout.write(kaelvarLayoutAR3SketchSvg(result,{
    biomeRgba:images.biome,elevationRgba:images.elevation,
  }));
}else{
  process.stdout.write(JSON.stringify({
    ...result.report,
    acceptedPlanningHead:spec.acceptedPlanningHead,
    registeredCrop:registered,sourceIdentity,
    exclusionManifestIdentity,sourceImages:metadata,
    originalSourceGeometryUnchanged:true,originalSourcePngsUnchanged:true,
    ownerApprovalRef:null,layoutBMask:null,proposedFourthRegionId:null,
  },null,2)+'\n');
}
