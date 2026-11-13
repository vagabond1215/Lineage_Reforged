import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeSourcePng} from '../../scripts/lib/first-world-source-png.mjs';
import {buildKaelvarK2SourceProbes,kaelvarK2SourceProbeSvg}
  from '../../scripts/lib/first-world-kaelvar-k2-source-probes.mjs';

const width=12,height=8;
const feature=(id,region,x,y,w,h)=>({id,regionIds:['region.'+region],
  points:[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}]});
const footprints=[
  feature('feature.region_auric_marches.part_4','auric_marches',1,4,3,2),
  feature('feature.region_shattercap_isles.part_7','shattercap_isles',4,2,3,3),
  feature('feature.region_verdant_thalos.part_1','verdant_thalos',2,5,4,2),
  feature('feature.region_shattercap_isles.part_15','shattercap_isles',7,3,2,2),
  feature('feature.region_windward_spine.part_1','windward_spine',8,5,2,2),
  feature('feature.region_shattercap_isles.part_4','shattercap_isles',8,0,2,2),
  feature('feature.region_shattercap_isles.part_17','shattercap_isles',10,4,2,2),
  feature('feature.region_verdant_thalos.part_6','verdant_thalos',2,0,2,2),
  feature('feature.region_windward_spine.part_2','windward_spine',4,0,1,2),
];
const classification=new Uint8Array(width*height).fill(1);
const terrainLabels=new Uint32Array(width*height).fill(30);
const biomeRgba=new Uint8Array(width*height*4);
const elevationRgba=new Uint8Array(width*height*4);
for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const i=y*width+x;
  biomeRgba.set([60+x*6,180-y*5,60,255],4*i);
  elevationRgba.set([220-x*3,190-y*2,175,255],4*i);
  if(y<2&&x>=8&&x<10)terrainLabels[i]=91;
  if(y>=4&&x>=10)terrainLabels[i]=92;
  if(y<2&&x>=2&&x<5)terrainLabels[i]=93;
}
classification[3*width+3]=2; // Unresolved black/blue rivers/coast art, not certified.
classification[3*width+2]=0; // Adjacent blue candidate.
terrainLabels[3*width+3]=0;terrainLabels[3*width+2]=0;
const input={width,height,classification,terrainLabels,biomeRgba,elevationRgba,
  footprints,mainlandReferenceId:30};

test('all source-ID probes select real candidate terrain, preserving three separate islands',()=>{
  const result=buildKaelvarK2SourceProbes(input,{radius:2});
  assert.equal(result.anchors.length,9);
  assert.equal(new Set(result.anchors.map(x=>x.id)).size,9);
  assert.equal(result.anchors.find(x=>x.key==='shattercap_north_island').terrainOnlyComponentId,91);
  assert.equal(result.anchors.find(x=>x.key==='shattercap_east_island').terrainOnlyComponentId,92);
  assert.equal(result.anchors.find(x=>x.key==='coast40_verdant').terrainOnlyComponentId,93);
  assert.equal(result.anchors.find(x=>x.key==='coast40_windward').terrainOnlyComponentId,93);
  for(const a of result.anchors){
    const i=a.sourcePixel.y*width+a.sourcePixel.x;
    assert.equal(classification[i],1);
    assert.equal(terrainLabels[i],a.terrainOnlyComponentId);
    assert.equal(a.sovereignAssignmentApproved,false);
  }
});

test('source windows enumerate every raster cell and do not silently turn ink into terrain',()=>{
  const result=buildKaelvarK2SourceProbes(input,{radius:6});
  for(const w of result.windows){
    assert.equal(Object.values(w.sourcePairClasses).reduce((a,b)=>a+b,0),w.pixelCount);
    assert.equal(w.candidateTerrainPalette.biomeLabel,null);
    assert.equal(w.candidateTerrainPalette.elevationMeters,null);
    assert.ok(w.candidateTerrainPalette.exactBiomeRgbTop.length);
  }
  assert.ok(result.windows.some(w=>w.sharedInkFourNeighborContext.touchesBlueAndTerrain>0));
  assert.ok(result.windows.some(w=>w.representativeUnresolvedInkPixels.some(p=>
    p.fourNeighborBlueCandidate&&p.fourNeighborTerrainCandidate)));
  assert.equal(result.coastalInkDetermination,null);
  assert.equal(result.hydrologyClassification,null);
  assert.equal(result.approvedBorders,null);
  assert.equal(result.sourceWritable,false);
});

test('each transect records full Bresenham pixel accounting separately from sparse RGB samples',()=>{
  const r=buildKaelvarK2SourceProbes(input,{radius:2});
  assert.equal(r.transects.length,7);
  for(const t of r.transects){
    assert.equal(Object.values(t.fullPathSourcePairClasses).reduce((a,b)=>a+b,0),
      t.originalGridCells);
    assert.deepEqual(t.registeredSourceSamples[0].x,t.start.x);
    assert.deepEqual(t.registeredSourceSamples[0].y,t.start.y);
    assert.equal(t.registeredSourceSamples.at(-1).x,t.end.x);
    assert.equal(t.registeredSourceSamples.at(-1).y,t.end.y);
    assert.match(t.warning,/not a road, coast, drainage route/);
  }
});

test('SVG losslessly embeds 3 registered original RGB source panels with visible ink uncertainty',()=>{
  const {svg,roi,readOnly,approvedBorders,sourceAnchors}=
    kaelvarK2SourceProbeSvg(input,{radius:2});
  assert.equal(readOnly,true);
  assert.equal(approvedBorders,null);
  assert.equal(sourceAnchors,9);
  assert.match(svg,/Original biome RGB/);
  assert.match(svg,/Original elevation RGB/);
  assert.match(svg,/Unresolved shared ink in magenta/);
  assert.match(svg,/#E3288F/);
  const all=[...svg.matchAll(/<image href="data:image\/png;base64,([^"]+)"/g)];
  assert.equal(all.length,3);
  assert.equal(all[0][1],all[2][1]);
  assert.notEqual(all[0][1],all[1][1]);
  for(const m of all){
    const png=decodeSourcePng(Buffer.from(m[1],'base64'));
    assert.equal(png.width,roi.width);
    assert.equal(png.height,roi.height);
  }
  assert.doesNotMatch(svg.replace('xmlns="http://www.w3.org/2000/svg"',''),
    /https?:|<(?:script|foreignObject)\b/i);
});

test('probe module refuses broken registration, missing provenance, source duplicates and invalid radius',()=>{
  assert.throws(()=>buildKaelvarK2SourceProbes({...input,
    biomeRgba:new Uint8Array(3)}),/registration invalid/);
  assert.throws(()=>buildKaelvarK2SourceProbes({...input,
    footprints:footprints.slice(1)}),/missing original source feature/);
  assert.throws(()=>buildKaelvarK2SourceProbes({...input,
    footprints:[...footprints,footprints[0]]}),/duplicate source feature/);
  assert.throws(()=>buildKaelvarK2SourceProbes(input,{radius:100}),/radius outside/);
});

test('K2 CLI inherits registered source identity and read-only guards',()=>{
  const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
  const runner=readFileSync(resolve(root,'scripts/first-world-kaelvar-candidate-comparison.mjs'),'utf8');
  assert.match(runner,/--k2-evidence/);
  assert.match(runner,/--k2-svg/);
  assert.match(runner,/verifyAuditedTextBlob/);
  assert.match(runner,/metadata\[layer\]\.sha256!==expected\[layer\]/);
  assert.match(runner,/current\.existing\.referenceTerrainOnlyPhysicalComponentCells!==79419/);
  assert.doesNotMatch(runner,/writeFileSync|createWriteStream|--write/);
});
