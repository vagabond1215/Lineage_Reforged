import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {registeredRgba,buildEnvironmentProfiles}
  from '../../scripts/lib/first-world-environment-profiles.mjs';

const rgba=colors=>Uint8Array.from(colors.flatMap(([r,g,b,a=255])=>[r,g,b,a]));
const regions=[
  {id:'region.kaelvar',regionType:'continent',name:'Kaelvar'},
  {id:'region.lantern_isles',regionType:'island_system',name:'Lantern Isles'},
  {id:'region.verdant_thalos',parentRegionId:'region.kaelvar',
    regionType:'subregion',name:'Verdant Thalos',
    environmentProfile:{dominantBiomeMix:['mixed_forest'],elevationProfile:'low_hills_and_coast'}},
];
const quad=(id,owner,x0,y0,x1,y1)=>({
  id,regionIds:[owner],points:[
    {x:x0,y:y0},{x:x1,y:y0},{x:x1,y:y1},{x:x0,y:y1}
  ],
});

test('registered source RGB uses exact crop and nearest centers without interpreting biome',()=>{
  const png={width:4,height:2,rgba:rgba([
    [255,0,0],[0,255,0],[0,0,255],[255,255,0],
    [1,2,3],[4,5,6],[7,8,9],[10,11,12],
  ])};
  const sample=registeredRgba(png,{x:1,y:0,width:2,height:2},2,2);
  assert.deepEqual([...sample],[
    0,255,0,255, 0,0,255,255,
    4,5,6,255, 7,8,9,255,
  ]);
  assert.throws(()=>registeredRgba(png,{x:3,y:0,width:2,height:2},2,2),
    /Invalid source PNG registration/);
});

test('duplicate same-child footprint remains a single authored region pixel union',()=>{
  const colors=rgba([
    [3,100,4],[3,100,4],[250,210,10],
    [3,100,4],[3,100,4],[250,210,10],
  ]);
  const height=rgba([
    [0,0,0],[32,32,32],[180,180,180],
    [48,48,48],[64,64,64],[200,200,200],
  ]);
  const origin=[
    quad('feature.verdant_1','region.verdant_thalos',0,0,2,2),
    quad('feature.verdant_2','region.verdant_thalos',0,0,2,2),
    quad('feature.lantern','region.lantern_isles',2,0,3,2),
  ];
  const saved=JSON.stringify(origin);
  const output=buildEnvironmentProfiles({
    width:3,height:2,biomeRgba:colors,elevationRgba:height,
    landMask:new Uint8Array(6).fill(1),footprints:origin,regions,
  });
  const get=id=>output.regionProfiles.find(x=>x.regionId===id);
  assert.equal(output.counts.sourceFootprints,3);
  assert.equal(output.counts.unassignedRasterLandCells,0);
  assert.equal(output.counts.directSameMacroChildOverlapRasterLandCells,0);
  assert.equal(get('region.verdant_thalos').landCells,4);
  assert.equal(get('region.kaelvar').landCells,4);
  assert.equal(get('region.lantern_isles').landCells,2);
  assert.equal(get('region.lantern_isles').topSourceBiomeColors[0].rgb,'#FAD20A');
  assert.equal(get('region.verdant_thalos').topSourceBiomeColors[0].rgb,'#036404');
  assert.equal(get('region.verdant_thalos').elevationRawLuma.nearGraySharePercent,100);
  assert.equal(get('region.verdant_thalos').expected.elevationProfile,'low_hills_and_coast');
  assert.equal(get('region.verdant_thalos').ecologicalDisposition,
    'SOURCE_RGB_AND_ELEVATION_MEASURED_BIOME_LABELS_UNVERIFIED');
  assert.equal(output.elevationInterpretation,
    'BLOCKED_PENDING_APPROVED_HEIGHT_SCALE_AND_ENCODING');
  assert.equal(JSON.stringify(origin),saved);
});

test('unknown source color, water-in-footprint and non-grayscale height are not silently relabeled',()=>{
  const biomes=rgba([[130,120,90],[20,30,40]]);
  const elevation=rgba([[15,100,255],[200,200,200]]);
  const output=buildEnvironmentProfiles({
    width:2,height:1,biomeRgba:biomes,elevationRgba:elevation,
    landMask:Uint8Array.from([1,0]),
    footprints:[quad('feature.verdant','region.verdant_thalos',0,0,2,1)],
    regions,
  });
  const row=output.footprintProfiles[0];
  assert.equal(row.landCells,1);
  assert.equal(row.waterWithinPolygonCells,1);
  assert.equal(row.elevationRawLuma.coloredSharePercent,100);
  assert.equal(row.topSourceBiomeColors[0].rgb,'#82785A');
  assert.equal(output.independentBiomeInterpretation,
    'BLOCKED_PENDING_APPROVED_SOURCE_PALETTE');
});

test('source environmental evidence runner has no canonical writes',()=>{
  const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
  const runner=readFileSync(resolve(root,'scripts/first-world-environment-evidence.mjs'),'utf8');
  assert.match(runner,/--check/);
  assert.match(runner,/buildEnvironmentProfiles/);
  assert.match(runner,/verifyAuditedTextBlob/);
  assert.doesNotMatch(runner,/writeFileSync|--write|createWriteStream/);
});
