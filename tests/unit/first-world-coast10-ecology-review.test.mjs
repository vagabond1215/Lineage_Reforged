import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeSourcePng} from '../../scripts/lib/first-world-source-png.mjs';
import {
  coast10ReviewBounds,buildCoast10EnvironmentReview,coast10ReviewSvg,embeddedCropPng,
} from '../../scripts/lib/first-world-coast10-ecology-review.mjs';

const width=6,height=4;
const rect=(id,regionId,x0,y0,x1,y1)=>({
  id,regionIds:[regionId],points:[
    {x:x0,y:y0},{x:x1,y:y0},{x:x1,y:y1},{x:x0,y:y1},
  ],
});
const focusId='feature.region_windward_spine.part_1';
const footprints=[
  rect(focusId,'region.windward_spine',1,1,3,3),
  rect('feature.verdant','region.verdant_thalos',0,0,2,4),
  rect('feature.shattercap','region.shattercap_isles',3,0,6,4),
];
const regions=[
  {id:'region.kaelvar',regionType:'continent',name:'Kaelvar'},
  {id:'region.serathyl',regionType:'continent',name:'Serathyl'},
  {id:'region.windward_spine',regionType:'subregion',
    parentRegionId:'region.serathyl',name:'Windward Spine',
    environmentProfile:{dominantBiomeMix:['cloud_forest'],elevationProfile:'high_uplands'}},
  {id:'region.verdant_thalos',regionType:'subregion',
    parentRegionId:'region.kaelvar',name:'Verdant Thalos',
    environmentProfile:{dominantBiomeMix:['mixed_forest'],elevationProfile:'low_coast'}},
  {id:'region.shattercap_isles',regionType:'subregion',
    parentRegionId:'region.kaelvar',name:'Shattercap Isles',
    environmentProfile:{dominantBiomeMix:['conifer_forest'],elevationProfile:'rugged_islands'}},
];
const classification=new Uint8Array(width*height).fill(1);
classification[1*width+1]=2;
classification[0]=0;
const rgbaFrom=f=>{
  const result=new Uint8Array(width*height*4);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const [r,g,b,a=255]=f(x,y);
    result.set([r,g,b,a],(y*width+x)*4);
  }
  return result;
};
const biomeRgba=rgbaFrom((x,y)=>[x<=2?32:240,x<=2?180:205,20,255]);
const elevationRgba=rgbaFrom((x,y)=>[192+y,122+x,99,255]);
const roi=coast10ReviewBounds(footprints[0].points,width,height,1);

test('focus crop follows source polygon, clips to reference image, never crops canonical PNG',()=>{
  assert.deepEqual({minX:roi.minX,minY:roi.minY,
    maxX:roi.maxX,maxY:roi.maxY,width:roi.width,height:roi.height},
    {minX:0,minY:0,maxX:4,maxY:4,width:4,height:4});
  assert.throws(()=>coast10ReviewBounds([],width,height,1),/invalid/i);
  assert.throws(()=>coast10ReviewBounds(footprints[0].points,width,height,-1),/invalid/i);
});

test('per-footprint Coast 10 RGB and relative elevation measured only on candidate terrain',()=>{
  const snapshot=JSON.stringify(footprints);
  const review=buildCoast10EnvironmentReview({
    width,height,classification,biomeRgba,elevationRgba,roi,
    footprints,regions,focusId,
  });
  assert.equal(review.status,'SOURCE_ECOLOGY_REVIEW_NO_REGION_REDRAW');
  assert.equal(review.proposedChildBoundary,null);
  assert.equal(review.proposedMacroMask,null);
  const focus=review.observedExistingRegionFootprints.find(x=>x.id===focusId);
  assert.equal(focus.terrainCandidateCells,3);
  assert.equal(focus.sharedInkUnresolvedCells,1);
  assert.deepEqual(focus.expected.dominantBiomeMix,['cloud_forest']);
  assert.equal(focus.rawElevationLuma.interpretation,
    'UNVERIFIED_COLOR_RAMP_RAW_RGB_LUMINANCE_NOT_METERS');
  assert.equal(focus.sourceColorHistogramOverlapWithWindwardPercent,100);
  const neighbor=review.observedExistingRegionFootprints.find(x=>x.id==='feature.verdant');
  assert.equal(neighbor.macroId,'region.kaelvar');
  assert.ok(neighbor.terrainCandidateCells>0);
  assert.ok(neighbor.sourceColorHistogramOverlapWithWindwardPercent<=100);
  assert.equal(JSON.stringify(footprints),snapshot);
});

test('crop PNG is lossless RGBA and independently decodable',()=>{
  const data=embeddedCropPng(biomeRgba,width,height,roi);
  assert.match(data,/^data:image\/png;base64,/);
  const bytes=Buffer.from(data.split(',')[1],'base64');
  const png=decodeSourcePng(bytes);
  assert.equal(png.width,roi.width);
  assert.equal(png.height,roi.height);
  assert.deepEqual([...png.rgba.slice(0,4)],[32,180,20,255]);
  assert.throws(()=>embeddedCropPng(biomeRgba,width,height,
    {...roi,width:100}),/registration mismatch/);
});

test('three-panel SVG embeds original cropped map pixels without external image network URLs',()=>{
  const terrainFourLabels=new Uint32Array(width*height);
  for(let i=0;i<terrainFourLabels.length;i++)
    if(classification[i]===1)terrainFourLabels[i]=xFromIndex(i)<3?30:113;
  const output=coast10ReviewSvg({
    width,height,classification,biomeRgba,elevationRgba,roi,
    footprints,regions,focusId,terrainFourLabels,
    coastlines:[rect('feature.coastline.first_world.part_10','region.kaelvar',0,0,5,4)],
  });
  assert.equal(output.readonly,true);
  assert.equal(output.focusTerrainComponents.length,1);
  assert.equal(output.focusTerrainComponents[0].componentId,30);
  assert.equal(output.focusTerrainComponents[0].pixels,3);
  assert.match(output.svg,/Original biome image/);
  assert.match(output.svg,/Original elevation image/);
  assert.match(output.svg,/Terrain-only connectivity/);
  assert.match(output.svg,/data:image\/png;base64,/);
  assert.match(output.svg,/Windward Part 1/);
  const withoutNamespace=output.svg.replace('xmlns="http://www.w3.org/2000/svg"','');
  assert.doesNotMatch(withoutNamespace,/https?:|<(?:script|foreignObject)\b/i);
  assert.equal((output.svg.match(/<image href="data:image\/png;base64,/g)||[]).length,2);
});
function xFromIndex(i){return i%width;}

test('new CLI is entirely read only, and requires audited source pair',()=>{
  const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
  const runner=readFileSync(resolve(root,'scripts/first-world-source-pair-qa.mjs'),'utf8');
  assert.match(runner,/--coast10-review/);
  assert.match(runner,/--svg-coast10/);
  assert.match(runner,/neighboringSourceTopologies/);
  assert.match(runner,/FULL_CANONICAL_FOOTPRINT_NOT_ONLY_REVIEW_CROP/);
  assert.match(runner,/buildSourcePairTopologySensitivity/);
  assert.match(runner,/verifyAuditedTextBlob/);
  assert.doesNotMatch(runner,/writeFileSync|createWriteStream|--write/);
});
