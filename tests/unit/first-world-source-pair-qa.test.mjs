import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  classifySourcePair,sourcePairFootprintRows,sourcePairQaSvg,SourcePairClass,
} from '../../scripts/lib/first-world-source-pair-qa.mjs';
import {buildSourcePairTopologySensitivity,summarizeSourcePairPilotFootprints}
  from '../../scripts/lib/first-world-source-pair-topology.mjs';

const rgb=entries=>Uint8Array.from(entries.flatMap(([r,g,b,a=255])=>[r,g,b,a]));
const blue=[64,126,255],green=[30,200,80],ink=[0,0,0];
const coast=[32,96,127],warm=[249,236,208];
const ground=rgb([blue,green,ink,blue,[...green.slice(0,3),128],coast]);
const height=rgb([blue,warm,ink,warm,warm,coast]);
const example=()=>classifySourcePair({
  width:3,height:2,biomeRgba:ground,elevationRgba:height,
});

test('independent shared-blue, divergent terrain, shared-ink and blue-conflict classes stay distinct',()=>{
  const result=example();
  assert.deepEqual([...result.classification],[
    SourcePairClass.SHARED_BLUE_CANDIDATE,
    SourcePairClass.DIVERGENT_TERRAIN_CANDIDATE,
    SourcePairClass.SHARED_NONBLUE_UNRESOLVED,
    SourcePairClass.BLUE_DIVERGENCE_UNRESOLVED,
    SourcePairClass.ALPHA_UNRESOLVED,
    SourcePairClass.SHARED_NONBLUE_UNRESOLVED,
  ]);
  assert.equal(result.report.imageReferencePixels,6);
  assert.equal(result.report.legacyThresholdLandPixels,4);
  assert.equal(result.report.unresolvedRasterPixels,4);
  assert.equal(result.report.adjudicatedRasterPixels,0);
  assert.equal(result.report.sourceGeometryWritable,false);
  assert.deepEqual(result.report.sharedNonblueTopSourceRgb.map(x=>x.rgb),
    ['#000000','#20607F']);
});

test('identical black coast ink stays unresolved even beside both water and terrain',()=>{
  const biomes=rgb([blue,ink,green]);
  const elev=rgb([blue,ink,warm]);
  const result=classifySourcePair({
    width:3,height:1,biomeRgba:biomes,elevationRgba:elev,
  });
  assert.deepEqual([...result.classification],[0,2,1]);
  assert.equal(result.report.sharedNonblueNeighborContext.touchesBoth,1);
  assert.equal(result.report.candidateClasses.SHARED_NONBLUE_UNRESOLVED.pixels,1);
});

test('any conflicting blue or alpha value fails closed without automatic reclassification',()=>{
  const result=example();
  assert.equal(result.report.candidateClasses.BLUE_DIVERGENCE_UNRESOLVED.pixels,1);
  assert.equal(result.report.candidateClasses.ALPHA_UNRESOLVED.pixels,1);
  assert.throws(()=>classifySourcePair({
    width:3,height:2,biomeRgba:ground,elevationRgba:new Uint8Array(4),
  }),/registration mismatch/);
});

test('matched partially transparent pixels retain paired RGB evidence',()=>{
  const biome=rgb([[64,126,255,220],[30,200,80,230],[0,0,0,195]]);
  const elevation=rgb([[64,126,255,220],[249,236,208,230],[0,0,0,195]]);
  const result=classifySourcePair({
    width:3,height:1,biomeRgba:biome,elevationRgba:elevation,
  });
  assert.deepEqual([...result.classification],[0,1,2]);
  assert.equal(result.report.sharedPartialAlphaPixels,3);
  assert.equal(result.report.alphaMismatchPixels,0);
  assert.equal(result.report.candidateClasses.ALPHA_UNRESOLVED.pixels,0);
});

test('per-feature candidate pixels preserve region provenance and do not imply transfer',()=>{
  const result=example();
  const regions=new Map([
    ['region.kaelvar',{id:'region.kaelvar',regionType:'continent'}],
    ['region.serathyl',{id:'region.serathyl',regionType:'continent'}],
    ['region.verdant_thalos',{id:'region.verdant_thalos',
      regionType:'subregion',parentRegionId:'region.kaelvar'}],
    ['region.windward_spine',{id:'region.windward_spine',
      regionType:'subregion',parentRegionId:'region.serathyl'}],
  ]);
  const feature=[
    {id:'feature.windward',regionIds:['region.windward_spine'],
      points:[{x:0,y:0},{x:3,y:0},{x:3,y:1},{x:0,y:1}]},
  ];
  const prior=JSON.stringify(feature);
  const rows=sourcePairFootprintRows({width:3,height:2,
    classification:result.classification,footprints:feature,regionById:regions});
  assert.equal(rows.length,1);
  assert.equal(rows[0].macroId,'region.serathyl');
  assert.equal(rows[0].footprintCells,3);
  assert.equal(rows[0].candidateClasses.SHARED_NONBLUE_UNRESOLVED.pixels,1);
  assert.equal(rows[0].resolution,'BASELINE_LABELS_ONLY_UNAPPROVED');
  assert.equal(JSON.stringify(feature),prior);
});

test('QA SVG is local and remains clearly marked unapproved',()=>{
  const result=example();
  const markup=sourcePairQaSvg(result.classification,3,2);
  assert.match(markup,/Unapproved two-source/);
  assert.match(markup,/pink shared ink/);
  assert.match(markup,/viewBox="0 0 3 48"/);
  // The standard SVG xmlns URI is mandatory, not a network request.
  // Exclude only that exact declaration before screening for external content.
  assert.match(markup,/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  const withoutNamespace=markup.replace('xmlns="http://www.w3.org/2000/svg"','');
  assert.doesNotMatch(withoutNamespace, /https?:|<(?:image|script|foreignObject)\b|\b(?:href|xlink:href)\s*=|url\s*\(/i);
});

test('paired source runner only exposes stdout evidence and validates original source identity',()=>{
  const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
  const source=readFileSync(resolve(root,'scripts/first-world-source-pair-qa.mjs'),'utf8');
  assert.match(source,/verifyAuditedTextBlob/);
  assert.match(source,/removedSourceFeatureIds/);
  assert.match(source,/--check/);
  assert.match(source,/--svg-qa/);
  assert.doesNotMatch(source,/writeFileSync|createWriteStream|--write/);
});

test('ink joins two terrain islands but creates an ink-only component: raw counts alone miss the change',()=>{
  const classification=Uint8Array.from([
    1,2,1,0,1,
    0,0,0,0,0,
    1,0,2,0,1,
  ]);
  const original=Array.from(classification);
  const sensitivity=buildSourcePairTopologySensitivity({
    width:5,height:3,classification,
  });
  const result=sensitivity.summary;
  assert.equal(result.terrainOnly.landCandidatePixels,5);
  assert.equal(result.sharedInkIncluded.landCandidatePixels,7);
  assert.equal(result.terrainOnly.fourNeighborComponents,5);
  assert.equal(result.sharedInkIncluded.fourNeighborComponents,5);
  assert.equal(result.joinedFourNeighborComponentCount,1);
  assert.equal(result.inkOnlyFourNeighborComponentCount,1);
  assert.equal(result.joinedFourNeighborComponents[0].terrainOnlyFourComponentCount,2);
  assert.equal(result.joinedFourNeighborComponents[0].unresolvedPixels,1);
  assert.equal(result.largestInkOnlyFourNeighborComponents[0].unresolvedPixels,1);
  assert.equal(result.legacyThresholdReconciliation,
    'INK_INCLUDED_EQUALS_LEGACY_THRESHOLD_PIXEL_SET');
  assert.equal(result.sourceWritable,false);
  assert.deepEqual(Array.from(classification),original);
});

test('pilot footprint component crosswalk preserves raw pixels and distinguishes stable 4-neighbor IDs',()=>{
  const classification=Uint8Array.from([
    1,2,1,0,1,
    0,0,0,0,0,
    1,0,2,0,1,
  ]);
  const topology=buildSourcePairTopologySensitivity({
    width:5,height:3,classification,
  });
  const footprint=[{id:'feature.region_windward_spine.part_1',
    points:[{x:0,y:0},{x:3,y:0},{x:3,y:1},{x:0,y:1}]}];
  const result=summarizeSourcePairPilotFootprints({
    width:5,height:3,classification,topology,footprints:footprint,
    selectedIds:['feature.region_windward_spine.part_1'],
  })[0];
  assert.equal(result.footprintPixels,3);
  assert.equal(result.terrainCandidatePixels,2);
  assert.equal(result.unresolvedSharedInkPixels,1);
  assert.equal(result.blueCandidatePixels,0);
  assert.equal(result.terrainOnlyFourComponents.length,2);
  assert.equal(result.sharedInkIncludedFourComponents.length,1);
  assert.equal(result.sharedInkIncludedFourComponents[0].pixels,3);
  assert.equal(result.disposition,'REVIEW_ONLY_NOT_POLITICAL_OWNERSHIP');
});

test('diagonal-only land contacts remain 4-disconnected even when 8-connected',()=>{
  const topology=buildSourcePairTopologySensitivity({
    width:2,height:2,classification:Uint8Array.from([1,0,0,1]),
  });
  assert.equal(topology.summary.terrainOnly.fourNeighborComponents,2);
  assert.equal(topology.summary.terrainOnly.eightNeighborComponents,1);
  assert.equal(topology.summary.sharedInkIncluded.fourNeighborComponents,2);
});

test('blue divergence stays in the most permissive scenario and is not silently called terrain',()=>{
  const topology=buildSourcePairTopologySensitivity({
    width:3,height:1,classification:Uint8Array.from([1,3,1]),
  });
  assert.equal(topology.summary.terrainOnly.fourNeighborComponents,2);
  assert.equal(topology.summary.sharedInkIncluded.fourNeighborComponents,2);
  assert.equal(topology.summary.allUnresolvedIncluded.fourNeighborComponents,1);
  assert.equal(topology.summary.otherUnresolvedPixels,1);
  assert.match(topology.summary.legacyThresholdReconciliation,/NOT_EQUIVALENT/);
  assert.throws(()=>buildSourcePairTopologySensitivity({
    width:1,height:1,classification:Uint8Array.from([255]),
  }),/Unknown source pair class/);
});

test('native source-pair topology runner exposes sensitivity diagnostics but no write flag',()=>{
  const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
  const runner=readFileSync(resolve(root,'scripts/first-world-source-pair-qa.mjs'),'utf8');
  assert.match(runner,/--connectivity/);
  assert.match(runner,/baselineLegacyReproduced/);
  assert.match(runner,/summarizeSourcePairPilotFootprints/);
  assert.doesNotMatch(runner,/writeFileSync|createWriteStream|--write/);
});
