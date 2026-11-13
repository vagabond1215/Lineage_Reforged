import assert from 'node:assert/strict';
import {test} from 'node:test';
import {deflateSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeSourcePng,registeredSourceMask,labelLandComponents,diagonalJoinEvidence}
  from '../../scripts/lib/first-world-source-png.mjs';
import {planReviewedMacroOwnership,rasterizePolygon}
  from '../../scripts/lib/first-world-reviewed-macro-planner.mjs';

function pngRGB(width,height,pixels){
  const signature=Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);
  ihdr[8]=8;ihdr[9]=2;
  const raw=Buffer.alloc(height*(1+width*3));
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    const src=(y*width+x)*3,at=y*(1+width*3)+1+x*3;
    raw.set(pixels.subarray(src,src+3),at);
  }
  // PNG reader consumes the bytes after CRC; this helper supplies a placeholder
  // CRC for the tiny in-memory test input, not for production source images.
  const chunk=(type,data)=>{
    const size=Buffer.alloc(4);size.writeUInt32BE(data.length,0);
    return Buffer.concat([size,Buffer.from(type),data,Buffer.alloc(4)]);
  };
  return Buffer.concat([signature,chunk('IHDR',ihdr),
    chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);
}
const k=(id,parent=null,type='subregion')=>({id,parentRegionId:parent,regionType:type});
const regions=[
 k('region.kaelvar',null,'continent'),k('region.serathyl',null,'continent'),
 k('region.verdant_thalos','region.kaelvar'),
 k('region.windward_spine','region.serathyl'),
];
const pixels=Uint8Array.from([1,1,0,1,0,0,0,1,1]);
const comps=labelLandComponents(pixels,3,3,false);
const approval=(id,macroId,mask)=>({id,macroId,status:'approved',
  approvalRef:'human-approved-review-001',mask});

test('PNG reader independently decodes native RGB, crop and original water threshold',()=>{
  const png=decodeSourcePng(pngRGB(2,2,Uint8Array.from([
    30,70,220, 100,110,90,
    0,0,255, 180,180,180
  ])));
  assert.deepEqual([png.width,png.height,png.bitDepth,png.colorType],[2,2,8,2]);
  assert.deepEqual([...registeredSourceMask(png,{x:0,y:0,width:2,height:2},2,2)],
    [0,1,0,1]);
  assert.throws(()=>registeredSourceMask(png,{x:1,y:1,width:2,height:2},2,2),
    /registration/);
  assert.throws(()=>decodeSourcePng(Buffer.from('wrong')),/not PNG/);
});

test('4-neighbor splits diagonal touches that 8-neighbor merges without size cutoff',()=>{
  const grid=Uint8Array.from([1,0,0,0,1,0,0,0,1]);
  const four=labelLandComponents(grid,3,3,false);
  const eight=labelLandComponents(grid,3,3,true);
  assert.equal(four.components.length,3);
  assert.equal(eight.components.length,1);
  assert.deepEqual(diagonalJoinEvidence(four,eight),
    [{eightComponentId:1,fourComponentIds:[1,2,3]}]);
  assert.deepEqual(four.components.map(c=>c.areaPx2),[1,1,1]);
});

test('unapproved island and land cannot be claimed by a cross-continent anchor',()=>{
  const plan=planReviewedMacroOwnership({
    width:3,height:3,landMask:pixels,componentByCell:comps.labels,
    regions,decisions:[{id:'pilot',macroId:'region.kaelvar',status:'pending'}],
    anchors:[],
  });
  assert.equal(plan.status,'HELD_FOR_REVIEW');
  assert.equal(plan.assignedMacroCells,0);
  assert.equal(plan.unassignedMacroCells,5);
  assert.equal(plan.sourceWritable,false);
});

test('a reviewed spatial mask constrains both macro and local child claims',()=>{
  const kaelvar=Uint8Array.from([1,1,0,1,0,0,0,0,0]);
  const serathyl=Uint8Array.from([0,0,0,0,0,0,0,1,1]);
  const plan=planReviewedMacroOwnership({
    width:3,height:3,landMask:pixels,componentByCell:comps.labels,
    regions,
    decisions:[approval('west','region.kaelvar',kaelvar),
      approval('east','region.serathyl',serathyl)],
    anchors:[
      {regionId:'region.verdant_thalos',macroId:'region.kaelvar',x:0,y:0},
      {regionId:'region.windward_spine',macroId:'region.serathyl',x:1,y:2},
    ],
  });
  assert.equal(plan.status,'PLAN_COMPLETE_REVIEW_ONLY');
  assert.equal(plan.assignedMacroCells,5);
  assert.equal(plan.unassignedChildCells,0);
  assert.notEqual(plan.children[0],plan.children[7]);
  assert.equal(plan.macroIds[plan.owners[0]-1],'region.kaelvar');
  assert.equal(plan.macroIds[plan.owners[7]-1],'region.serathyl');
});

test('missing child anchor on another physical island stays unresolved',()=>{
  const mask=Uint8Array.from([1,1,0,1,0,0,0,1,1]);
  const plan=planReviewedMacroOwnership({
    width:3,height:3,landMask:pixels,componentByCell:comps.labels,
    regions,decisions:[approval('joint','region.kaelvar',mask)],
    anchors:[{regionId:'region.verdant_thalos',macroId:'region.kaelvar',x:0,y:0}],
  });
  assert.equal(plan.unassignedChildCells,2);
  assert.equal(plan.status,'HELD_FOR_REVIEW');
});

test('reviewed boundaries reject water, macro overlap, unreviewed approval and foreign child anchors',()=>{
  const west=Uint8Array.from([1,1,0,1,0,0,0,0,0]);
  assert.throws(()=>planReviewedMacroOwnership({
    width:3,height:3,landMask:pixels,componentByCell:comps.labels,
    regions,decisions:[approval('a','region.kaelvar',west),
      approval('b','region.serathyl',west)],
  }),/overlap/);
  assert.throws(()=>planReviewedMacroOwnership({
    width:3,height:3,landMask:pixels,componentByCell:comps.labels,
    regions,decisions:[approval('water','region.kaelvar',Uint8Array.from([0,0,1,0,0,0,0,0,0]))],
  }),/water/);
  assert.throws(()=>planReviewedMacroOwnership({
    width:3,height:3,landMask:pixels,componentByCell:comps.labels,
    regions,decisions:[{id:'unsigned',macroId:'region.kaelvar',status:'approved',mask:west}],
  }),/approval/);
  assert.throws(()=>planReviewedMacroOwnership({
    width:3,height:3,landMask:pixels,componentByCell:comps.labels,
    regions,decisions:[approval('west','region.kaelvar',west)],
    anchors:[{regionId:'region.windward_spine',macroId:'region.kaelvar',x:0,y:0}],
  }),/Cross-macro/);
});

test('polygon mask rasterization uses reference cell centers and does not alter input',()=>{
  const points=[{x:0,y:0},{x:2,y:0},{x:2,y:2},{x:0,y:2}];
  const before=JSON.stringify(points);
  assert.deepEqual([...rasterizePolygon(points,3,3)],[1,1,0,1,1,0,0,0,0]);
  assert.equal(JSON.stringify(points),before);
});

test('Pass 0 witness does not expose a canonical source write path',()=>{
  const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
  const cli=readFileSync(resolve(root,'scripts/first-world-raster-evidence.mjs'),'utf8');
  assert.match(cli,/--svg-pilot/);
  assert.match(cli,/--check/);
  assert.match(cli,/coastline\.first_world\.part_/);
  assert.doesNotMatch(cli,/writeFileSync|createWriteStream/);
});

test('review ledger retains 15 pending foreign-coast candidates and both pilot coasts',()=>{
  const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
  const doc=JSON.parse(readFileSync(resolve(root,
    'docs/design/first-world-macro-ownership-review-2026-11-12.json'),'utf8'));
  assert.equal(doc.foreignLandmassCandidates.length,15);
  assert.equal(doc.foreignLandmassCandidates.reduce((sum,c)=>sum+c.sampledOverlapPx2,0),74072);
  assert.deepEqual(doc.pilot.coastParts,[10,40]);
  assert.ok(doc.foreignLandmassCandidates.some(c=>
    c.sourcePolygonId==='feature.region_windward_spine.part_1'&&
    c.classification==='previously_confirmed_owner_intrusion'));
  assert.ok(doc.reviewedDecisions.every(d=>d.status==='pending'));
  assert.ok(doc.reviewedDecisions.every(d=>d.maskPolygons.length===0));
});
