import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeSourcePng} from '../../scripts/lib/first-world-source-png.mjs';
import {
  buildShattercapUnionEvidence,shattercapInventorySvg,
} from '../../scripts/lib/first-world-shattercap-union.mjs';

const width=6,height=4;
const quad=(id,x0,y0,x1,y1)=>({
  id,regionIds:['region.shattercap_isles'],
  points:[{x:x0,y:y0},{x:x1,y:y0},{x:x1,y:y1},{x:x0,y:y1}],
});
const parts=[
  quad('feature.region_shattercap_isles.part_1',0,0,1,1),
  quad('feature.region_shattercap_isles.part_4',4,2,6,4),
  quad('feature.region_shattercap_isles.part_7',0,1,3,3),
  quad('feature.region_shattercap_isles.part_15',2,1,4,3),
];
const classification=new Uint8Array(width*height).fill(1);
classification[0]=0;
const terrainLabels=new Uint32Array(width*height).fill(30);
terrainLabels[0]=0;
for(let y=2;y<4;y++)for(let x=4;x<6;x++)
  terrainLabels[y*width+x]=91;
const biomeRgba=new Uint8Array(width*height*4);
for(let i=0;i<width*height;i++)
  biomeRgba.set([35+(i%6)*16,170,70,255],i*4);
const input={width,height,classification,terrainLabels,
  footprints:parts,mainlandReferenceId:30};

test('Shattercap union deduplicates overlapping child footprints, not simply summed area',()=>{
  const unchanged=JSON.stringify(parts);
  const result=buildShattercapUnionEvidence(input);
  assert.equal(result.selectedFootprintCount,4);
  assert.equal(result.summedFootprintTerrainCells,14);
  assert.equal(result.deduplicatedTerrainCells,12);
  assert.equal(result.sourcePolygonOverlapCells,2);
  assert.equal(result.sourcePolygonOverlapExcessMemberships,2);
  assert.equal(result.terrainCellsOnReferenceMainland,8);
  assert.equal(result.terrainCellsOffReferenceMainland,4);
  assert.equal(result.referenceMainlandShareOfUniqueTerrainPercent,66.67);
  assert.deepEqual(result.partsWithoutTerrainCandidates,
    ['feature.region_shattercap_isles.part_1']);
  assert.equal(result.componentRows[0].componentId,30);
  assert.equal(result.componentRows[0].uniqueTerrainCells,8);
  assert.equal(result.componentRows[0].summedMemberships,10);
  assert.equal(result.componentRows[1].componentId,91);
  assert.equal(result.componentRows[1].uniqueTerrainCells,4);
  assert.equal(result.approvedNewBorders,null);
  assert.equal(result.sourceWritable,false);
  assert.equal(JSON.stringify(parts),unchanged);
});

test('zero-terrain source part is retained for unresolved ink or water review',()=>{
  const row=buildShattercapUnionEvidence(input).sourcePartRows
    .find(p=>p.sourcePartId==='feature.region_shattercap_isles.part_1');
  assert.equal(row.sourcePolygonCells,1);
  assert.equal(row.terrainCandidateCells,0);
  assert.equal(row.blueCandidateCells,1);
  assert.equal(row.provenance,'EXISTING_SOURCE_POLYGON_NOT_REPAIRED_REGION');
});

test('partial terrain island component stays separate from mainland and has native coordinates',()=>{
  const result=buildShattercapUnionEvidence(input);
  const island=result.componentRows.find(p=>p.componentId===91);
  assert.deepEqual(island.terrainBounds,{minX:4,minY:2,maxX:5,maxY:3});
  assert.deepEqual(island.terrainCentroid,{x:5,y:3});
  assert.equal(island.mainlandReference,false);
});

test('Shattercap locator preserves original raster, all existing part numbers and distinct island coloring',()=>{
  const result=shattercapInventorySvg({...input,biomeRgba});
  assert.equal(result.readOnly,true);
  assert.equal(result.sourcePartCount,4);
  assert.match(result.svg,/Shattercap 15-part geographic inventory/);
  assert.match(result.svg,/Orange: reference mainland/);
  assert.match(result.svg,/#1BAAB5/);
  assert.match(result.svg,/#E88724/);
  assert.match(result.svg,/#B44FBE/);
  assert.equal((result.svg.match(/<image href="data:image\/png;base64,/g)||[]).length,2);
  const embedded=result.svg.match(/<image href="data:image\/png;base64,([^"]+)"/);
  const png=decodeSourcePng(Buffer.from(embedded[1],'base64'));
  assert.equal(png.width,result.roi.width);
  assert.equal(png.height,result.roi.height);
  const noNamespace=result.svg.replace('xmlns="http://www.w3.org/2000/svg"','');
  assert.doesNotMatch(noNamespace,/https?:|<(?:script|foreignObject)\b/i);
});

test('Shattercap evidence refuses source-registration drift and unknown physical labels',()=>{
  assert.throws(()=>buildShattercapUnionEvidence({
    ...input,classification:new Uint8Array(2),
  }),/grid or catalogs invalid/);
  assert.throws(()=>buildShattercapUnionEvidence({
    ...input,mainlandReferenceId:0,
  }),/mainland reference/);
  assert.throws(()=>buildShattercapUnionEvidence({
    ...input,terrainLabels:new Uint32Array(width*height),
  }),/no physical component label/);
});

test('native Shattercap runner has source provenance guard and no canonical write flags',()=>{
  const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
  const runner=readFileSync(resolve(root,'scripts/first-world-source-pair-qa.mjs'),'utf8');
  assert.match(runner,/--shattercap-union/);
  assert.match(runner,/--svg-shattercap/);
  assert.match(runner,/verifyAuditedTextBlob/);
  assert.match(runner,/selectedFootprintCount!==15/);
  assert.doesNotMatch(runner,/writeFileSync|createWriteStream|--write/);
});
