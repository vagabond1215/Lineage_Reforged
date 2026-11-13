#!/usr/bin/env node
/**
 * First World source-pair QA: READ ONLY, no change to legacy masks/regions.
 *
 * node scripts/first-world-source-pair-qa.mjs --check > source-pair-qa.json
 * node scripts/first-world-source-pair-qa.mjs --svg-qa > source-pair-qa.svg
 * node scripts/first-world-source-pair-qa.mjs --connectivity > source-pair-connectivity.json
 * node scripts/first-world-source-pair-qa.mjs --coast10-review > coast10-ecology.json
 * node scripts/first-world-source-pair-qa.mjs --svg-coast10 > coast10-source-ecology.svg
 * node scripts/first-world-source-pair-qa.mjs --kaelvar-locality > kaelvar-locality.json
 * node scripts/first-world-source-pair-qa.mjs --svg-kaelvar > kaelvar-locality.svg
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
import {buildSourcePairTopologySensitivity,summarizeSourcePairPilotFootprints}
  from './lib/first-world-source-pair-topology.mjs';
import {coast10ReviewBounds,buildCoast10EnvironmentReview,coast10ReviewSvg}
  from './lib/first-world-coast10-ecology-review.mjs';
import {collectKaelvarLocality,kaelvarLocalitySvg,KAELVAR_LOCALITY_IDS}
  from './lib/first-world-kaelvar-locality-review.mjs';

const args=process.argv.slice(2);
if(args.length!==1 || !['--check','--svg-qa','--connectivity','--coast10-review','--svg-coast10','--kaelvar-locality','--svg-kaelvar'].includes(args[0])){
  console.error('Usage: node scripts/first-world-source-pair-qa.mjs --check|--svg-qa|--connectivity|--coast10-review|--svg-coast10|--kaelvar-locality|--svg-kaelvar');
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
if(args[0]==='--kaelvar-locality'||args[0]==='--svg-kaelvar'){
  if(args[0]==='--svg-kaelvar'){
    const preview=kaelvarLocalitySvg({
      width,height,classification:pair.classification,
      biomeRgba,footprints,regions,selectedIds:KAELVAR_LOCALITY_IDS,
    });
    process.stdout.write(preview.svg);
  }else {
    const topology=buildSourcePairTopologySensitivity({
      width,height,classification:pair.classification,
    });
    // Audit all Shattercap fragments, not merely the two large suspect
    // polygon IDs. Distinguish mainland terrain from legitimate islands.
    const allShattercapIds=footprints
      .filter(p=>p.regionIds?.[0]==='region.shattercap_isles')
      .map(p=>p.id).sort();
    const selectedIds=[...new Set([...KAELVAR_LOCALITY_IDS,...allShattercapIds])];
    const placement=collectKaelvarLocality({
      width,height,classification:pair.classification,
      terrainLabels:topology.grids.terrainOnly.four.labels,
      footprints,regions,selectedIds,
    });
    const mainId=placement.physicalReference.terrainOnlyMainlandComponentId;
    if(mainId===null)throw Error('Missing Auric reference terrain-only mainland component');
    const shattercap=placement.rows.filter(r=>r.regionId==='region.shattercap_isles');
    const sumTerrain=shattercap.reduce((n,r)=>n+r.terrainCandidatePixels,0);
    const sumMain=shattercap.reduce((n,r)=>n+r.terrainCandidatePixelsOnReferenceComponent,0);
    process.stdout.write(JSON.stringify({
      ...placement,sourceIdentity,sourceImages:metadata,
      fullShattercapReview:{
        footprintCount:shattercap.length,
        sumPerFootprintTerrainCandidatePixels:sumTerrain,
        sumPerFootprintPixelsOnAuricReferenceMainland:sumMain,
        sharePercentOfSummedFootprintPixels:sumTerrain?
          Number((sumMain/sumTerrain*100).toFixed(2)):null,
        caution:'Per-footprint sums may double count source polygons; not a unique union, not approved reassignment.',
      },
      nextGate:'Review placement SVG and authored northern-island vs southern-peninsula geography, then calibrate biome/elevation before drafting new boundaries.',
      sourceGeometryWritable:false,
    },null,2)+'\n');
  }
  process.exit(0);
}
if(args[0]==='--coast10-review'||args[0]==='--svg-coast10'){
  const focusId='feature.region_windward_spine.part_1';
  const focus=footprints.find(p=>p.id===focusId);
  if(!focus)throw Error('Coast 10 focus source polygon missing');
  const roi=coast10ReviewBounds(focus.points,width,height,38);
  const topology=buildSourcePairTopologySensitivity({
    width,height,classification:pair.classification,
  });
  const focusTopology=summarizeSourcePairPilotFootprints({
    width,height,classification:pair.classification,topology,footprints,
    selectedIds:[focusId],
  })[0];
  if(args[0]==='--svg-coast10'){
    const preview=coast10ReviewSvg({
      width,height,roi,classification:pair.classification,
      biomeRgba,elevationRgba,footprints,regions,
      coastlines:features.coastlines,focusId,
      terrainFourLabels:topology.grids.terrainOnly.four.labels,
    });
    process.stdout.write(preview.svg);
  }else {
    const environment=buildCoast10EnvironmentReview({
      width,height,classification:pair.classification,
      biomeRgba,elevationRgba,roi,footprints,regions,focusId,
    });
    // Independent full-feature crosswalk for other Kaelvar labels touching
    // the same old component. These are NOT proposed recipient regions.
    // Shattercap is authored as a northern island fringe, so its mainland
    // assignments need explicit geographic review, not automatic expansion.
    const neighborIds=[
      'feature.region_shattercap_isles.part_7',
      'feature.region_shattercap_isles.part_15',
      'feature.region_verdant_thalos.part_1',
      'feature.region_auric_marches.part_4',
    ];
    const neighboringSourceTopologies=summarizeSourcePairPilotFootprints({
      width,height,classification:pair.classification,topology,footprints,
      selectedIds:neighborIds,
    }).map(entry=>{
      const source=footprints.find(p=>p.id===entry.id);
      const region=ownerById.get(source.regionIds[0]);
      return {...entry,regionId:region.id,
        authoredPositionLabel:region.positionLabel,
        authoredSummary:region.summary,
        sourceScope:'FULL_CANONICAL_FOOTPRINT_NOT_ONLY_REVIEW_CROP'};
    });
    process.stdout.write(JSON.stringify({
      ...environment,sourceIdentity,sourceImages:metadata,
      focusTopology,neighboringSourceTopologies,componentIdentityWarning:
        'Terrain-only IDs and shared-ink-inclusive IDs are different scenario namespaces.',
      status:'REVIEW_ONLY_SOURCE_ECOLOGY_PALETTE_AND_ELEVATION_UNCALIBRATED',
      nextGate:'Inspect original biome and elevation colors and shared river ink at Coast 10 before choosing Kaelvar child boundaries.',
      sourceGeometryWritable:false,
    },null,2)+'\n');
  }
  process.exit(0);
}
if(args[0]==='--connectivity'){
  const topology=buildSourcePairTopologySensitivity({
    width,height,classification:pair.classification,
  });
  const legacyPixels=pair.report.legacyThresholdLandPixels;
  const inkScenarioPixels=topology.summary.sharedInkIncluded.landCandidatePixels;
  if(topology.summary.otherUnresolvedPixels===0 && inkScenarioPixels!==legacyPixels)
    throw Error('Shared-ink sensitivity mask did not reproduce legacy threshold');
  const pilots=summarizeSourcePairPilotFootprints({
    width,height,classification:pair.classification,topology,footprints,
    selectedIds:suspectKeys,
  });
  process.stdout.write(JSON.stringify({
    ...topology.summary,sourceIdentity,sourceImages:metadata,
    registration:{crop,width,height},
    excludedArtifactCount:42,retainedFootprints:footprints.length,
    coast10And40:pilots,
    baselineLegacyReference:{landPixels:585834,fourNeighborComponents:167,
      eightNeighborComponents:160},
    baselineLegacyReproduced:inkScenarioPixels===585834 &&
      topology.summary.sharedInkIncluded.fourNeighborComponents===167 &&
      topology.summary.sharedInkIncluded.eightNeighborComponents===160,
    reviewGate:'HOLD: component joins and ink-only artifacts are not political decisions or a certified physical shoreline.',
    sourceGeometryWritable:false,
  },null,2)+'\n');
  process.exit(0);
}
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
