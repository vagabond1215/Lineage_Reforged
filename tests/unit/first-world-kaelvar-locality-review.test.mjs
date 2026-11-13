import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  collectKaelvarLocality,kaelvarLocalitySvg,KAELVAR_LOCALITY_IDS,
} from '../../scripts/lib/first-world-kaelvar-locality-review.mjs';

const width=6,height=4;
const quad=(id,owner,x0,y0,x1,y1)=>({
  id,regionIds:[owner],points:[
    {x:x0,y:y0},{x:x1,y:y0},{x:x1,y:y1},{x:x0,y:y1},
  ]
});
const footprint=[
  quad('feature.region_auric_marches.part_4','region.auric_marches',0,0,3,4),
  quad('feature.region_shattercap_isles.part_7','region.shattercap_isles',2,0,5,4),
  quad('feature.region_shattercap_isles.part_15','region.shattercap_isles',4,1,6,4),
  quad('feature.region_verdant_thalos.part_1','region.verdant_thalos',0,2,4,4),
  quad('feature.region_windward_spine.part_1','region.windward_spine',3,1,6,4),
];
const regions=[
  {id:'region.kaelvar',regionType:'continent'},
  {id:'region.serathyl',regionType:'continent'},
  {id:'region.auric_marches',regionType:'subregion',
    parentRegionId:'region.kaelvar',positionLabel:'kaelvar_western_interior'},
  {id:'region.shattercap_isles',regionType:'subregion',
    parentRegionId:'region.kaelvar',positionLabel:'kaelvar_northern_coast',
    summary:'Northern island fringe'},
  {id:'region.verdant_thalos',regionType:'subregion',
    parentRegionId:'region.kaelvar',positionLabel:'kaelvar_southern_peninsula'},
  {id:'region.windward_spine',regionType:'subregion',
    parentRegionId:'region.serathyl',positionLabel:'serathyl_northern_mountains'},
];
const classification=new Uint8Array(width*height).fill(1);
classification[0]=0;classification[7]=2;
const terrainLabels=new Uint32Array(width*height).fill(30);
terrainLabels[0]=0;terrainLabels[7]=0;terrainLabels[23]=113;
const biomeRgba=new Uint8Array(width*height*4);
for(let i=0;i<width*height;i++)
  biomeRgba.set([30+(i%6)*12,170,70,255],i*4);
const args={width,height,classification,terrainLabels,
  footprints:footprint,regions};

test('reference mainland is based on Auric terrain-only labels, not global nearest anchor',()=>{
  const before=JSON.stringify(footprint);
  const result=collectKaelvarLocality(args);
  assert.equal(result.status,'KAELVAR_MAINLAND_REGION_LOCALITY_REVIEW_ONLY');
  assert.equal(result.physicalReference.terrainOnlyMainlandComponentId,30);
  assert.equal(result.rows.length,5);
  const shatter=result.rows.find(x=>x.sourcePartId==='feature.region_shattercap_isles.part_15');
  assert.equal(shatter.terrainCandidatePixels,6);
  assert.equal(shatter.terrainCandidatePixelsOnReferenceComponent,5);
  assert.equal(shatter.terrainOnlyFourComponents.length,2);
  assert.equal(shatter.terrainOnlyFourComponents[1].componentId,113);
  assert.equal(shatter.authoredPositionLabel,'kaelvar_northern_coast');
  assert.equal(shatter.macroId,'region.kaelvar');
  assert.equal(result.approvedReplacementBoundary,null);
  assert.equal(result.sourceWritable,false);
  assert.equal(JSON.stringify(footprint),before);
});

test('source-terrain centroids and bounds follow native pixel centers and preserve tiny components',()=>{
  const result=collectKaelvarLocality(args);
  const auric=result.rows.find(x=>x.sourcePartId==='feature.region_auric_marches.part_4');
  assert.equal(auric.currentFootprintPixelCount,12);
  assert.equal(auric.terrainCandidatePixels,10);
  assert.equal(auric.sharedBluePixels,1);
  assert.equal(auric.unresolvedInkPixels,1);
  assert.deepEqual(auric.terrainCandidateBounds,
    {minX:0,minY:0,maxX:2,maxY:3});
  assert.ok(Number.isFinite(auric.terrainCandidateCentroid.x));
  assert.ok(Number.isFinite(auric.terrainCandidateCentroid.y));
  assert.equal(auric.terrainOnlyFourComponents[0].componentId,30);
  assert.equal(auric.terrainOnlyFourComponents[0].pixels,10);
});

test('locality SVG embeds source biome and highlights only source-terrain cells',()=>{
  const output=kaelvarLocalitySvg({
    width,height,classification,biomeRgba,footprints:footprint,regions,
  });
  assert.equal(output.readOnly,true);
  assert.match(output.svg,/Original source biome/);
  assert.match(output.svg,/NOT proposed borders/);
  assert.equal((output.svg.match(/<image href="data:image\/png;base64,/g)||[]).length,2);
  assert.equal((output.svg.match(/fill-opacity=".62"/g)||[]).length,5);
  const withoutNamespace=output.svg.replace('xmlns="http://www.w3.org/2000/svg"','');
  assert.doesNotMatch(withoutNamespace,/https?:|<(?:script|foreignObject)\b/i);
  assert.ok(output.roi.width<=width&&output.roi.height<=height);
  assert.deepEqual([...KAELVAR_LOCALITY_IDS].sort(),
    footprint.map(f=>f.id).sort());
});

test('locality review rejects missing or malformed sources without manufacturing an owner',()=>{
  assert.throws(()=>collectKaelvarLocality({
    ...args,selectedIds:['feature.unknown'],
  }),/footprint\/owner missing/);
  assert.throws(()=>collectKaelvarLocality({
    ...args,terrainLabels:new Uint32Array(width*height),
  }),/unlabeled terrain cell/);
  assert.throws(()=>kaelvarLocalitySvg({
    width,height,classification,biomeRgba:new Uint8Array(2),
    footprints:footprint,regions,
  }),/source-grid mismatch/);
});

test('native locality CLI remains read-only and includes all Shattercap source parts',()=>{
  const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
  const runner=readFileSync(resolve(root,'scripts/first-world-source-pair-qa.mjs'),'utf8');
  assert.match(runner,/--kaelvar-locality/);
  assert.match(runner,/--svg-kaelvar/);
  assert.match(runner,/allShattercapIds/);
  assert.match(runner,/fullShattercapReview/);
  assert.doesNotMatch(runner,/writeFileSync|createWriteStream|--write/);
});
