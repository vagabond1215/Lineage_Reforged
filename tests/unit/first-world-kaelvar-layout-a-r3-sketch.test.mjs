import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  buildKaelvarLayoutAR3Sketch,kaelvarLayoutAR3SketchSvg,
} from '../../scripts/lib/first-world-kaelvar-layout-a-r3-sketch.mjs';

const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
const read=p=>readFileSync(resolve(root,p),'utf8');
const load=p=>JSON.parse(read(p).replace(/^\uFEFF/,''));
const canonicalSpec=load('docs/design/first-world-kaelvar-layout-a-r3-sketch-2026-11-13.json');
const rectangle=(x1,y1,x2,y2)=>[
  {x:x1,y:y1},{x:x2,y:y1},{x:x2,y:y2},{x:x1,y:y2},
];
const w=16,h=12,island=3*w+14;
const make=()=>{
  const spec=structuredClone(canonicalSpec);
  spec.terrainOnlyPhysicalComponent.expectedTerrainCandidateCells=w*h-1;
  const windows=[
    rectangle(1,1,9,10),rectangle(6,6,15,11),rectangle(6,1,15,7),
  ];
  for(let i=0;i<3;i++)spec.previewRegions[i].sketchPolygon=windows[i];
  const footprints=[
    {id:'feature.region_auric_marches.part_4',
      regionIds:['region.auric_marches'],points:rectangle(1,1,9,10)},
    {id:'feature.region_verdant_thalos.part_1',
      regionIds:['region.verdant_thalos'],points:rectangle(6,5,15,11)},
    {id:'feature.region_shattercap_isles.part_7',
      regionIds:['region.shattercap_isles'],points:rectangle(5,1,15,7)},
    {id:'feature.region_shattercap_isles.part_1',
      regionIds:['region.shattercap_isles'],points:rectangle(0,0,1,1)},
    {id:'feature.region_shattercap_isles.part_15',
      regionIds:['region.shattercap_isles'],points:rectangle(14,10,15,11)},
    {id:'feature.region_windward_spine.part_1',
      regionIds:['region.windward_spine'],points:rectangle(13,9,15,11)},
    {id:'feature.region_windward_spine.part_2',
      regionIds:['region.windward_spine'],points:rectangle(15,10,16,11)},
    {id:'feature.region_verdant_thalos.part_6',
      regionIds:['region.verdant_thalos'],points:rectangle(15,9,16,10)},
  ];
  const regions=[
    {id:'region.kaelvar',regionType:'continent'},
    {id:'region.serathyl',regionType:'continent'},
    ...[
      ['region.auric_marches','kaelvar_western_interior','region.kaelvar'],
      ['region.verdant_thalos','kaelvar_southern_peninsula','region.kaelvar'],
      ['region.shattercap_isles','kaelvar_northern_coast','region.kaelvar'],
      ['region.windward_spine','serathyl_northern_mountains','region.serathyl'],
    ].map(([id,positionLabel,parentRegionId])=>({
      id,positionLabel,parentRegionId,regionType:'subregion',
    })),
  ];
  const terrainLabels=new Uint32Array(w*h).fill(30);
  terrainLabels[island]=24;
  return {width:w,height:h,classification:new Uint8Array(w*h).fill(1),
    terrainLabels,footprints,regions,spec,
    expectedDetachedComponents:[{componentId:24,sourceTerrainCandidateCells:1}]};
};

test('Layout A creates three source-scoped sketch previews, leaves main gaps and all physical islands unassigned',()=>{
  const x=make(),result=buildKaelvarLayoutAR3Sketch(x),r=result.report;
  assert.equal(r.status,'LAYOUT_A_R3_PREVIEW_ONLY_NO_APPROVED_BORDERS');
  assert.equal(r.sourcePartCrosswalk.length,3);
  assert.deepEqual(r.sourcePartCrosswalk.map(p=>p.regionId),[
    'region.auric_marches','region.verdant_thalos','region.shattercap_isles']);
  assert.ok(r.sourcePartCrosswalk.every(p=>p.previewCells>0));
  assert.ok(r.previewCandidateCells>0);
  assert.ok(r.unassignedAfterPreviewMainlandCandidateCells>0);
  assert.ok(r.heldMultiSketchCells>0);
  assert.ok(r.heldOriginalSourceConflictCells>0);
  assert.equal(r.physicalMainlandCandidateTerrainCells,w*h-1);
  assert.equal(r.heldDetachedShattercapCandidateCells,1);
  assert.equal(r.detachedShattercapRows[0].componentId,24);
  assert.equal(r.detachedShattercapRows[0].proposedRegionId,null);
  assert.equal(result.assigned[island],0);
  assert.equal(r.confirmedParentByComponent,null);
  assert.equal(r.canonicalSourceWritable,false);
  assert.equal(r.ownerApprovalRequired,true);
  assert.equal(r.previewCandidateCells+r.unassignedAfterPreviewMainlandCandidateCells,w*h-1);
});
test('One-cell guard and source-region conflict prevent claiming nearby gaps, original overlaps, and mixed ownership',()=>{
  const result=buildKaelvarLayoutAR3Sketch(make());
  assert.equal(result.assigned[2*w+6],0); // Auric/Shattercap sketch overlap
  assert.equal(result.assigned[5*w+8],0); // Original Verdant/Shattercap overlap
  assert.equal(result.assigned[9*w+14],0); // Foreign Windward source
  assert.equal(result.assigned[0],0); // No automatic ocean/edge fill
  assert.ok(result.report.heldOneCellBoundaryGuardCells>0);
  assert.equal(new Set(Array.from(result.assigned).filter(Boolean)).size,3);
});
test('Water/ink is never preview-claimed and source rasters/footprints remain immutable',()=>{
  const x=make(),before=structuredClone(x.footprints);
  const p=4*w+4;
  x.classification[p]=2;
  x.spec.terrainOnlyPhysicalComponent.expectedTerrainCandidateCells=w*h-2;
  const result=buildKaelvarLayoutAR3Sketch(x);
  assert.equal(result.assigned[p],0);
  assert.deepEqual(x.footprints,before);
  assert.equal(x.spec.approval.canonicalWritable,false);
});
test('Foreign child, fourth region, early approval, changed source ID and missing held feature all fail closed',()=>{
  const badParent=make();
  badParent.regions.find(r=>r.id==='region.auric_marches').parentRegionId='region.serathyl';
  assert.throws(()=>buildKaelvarLayoutAR3Sketch(badParent),/authored source\/region/);
  const fourth=make();
  fourth.spec.previewRegions.push({
    ...structuredClone(fourth.spec.previewRegions[0]),regionId:'region.kaelvar_east',
  });
  assert.throws(()=>buildKaelvarLayoutAR3Sketch(fourth),/exactly three authored/);
  const approved=make();
  approved.spec.approval.parentConfirmed=true;
  assert.throws(()=>buildKaelvarLayoutAR3Sketch(approved),/promoted/);
  const source=make();
  source.spec.previewRegions[2].sourceFeatureIds=['feature.region_windward_spine.part_1'];
  assert.throws(()=>buildKaelvarLayoutAR3Sketch(source),/authored source\/region/);
  const missing=make();
  missing.footprints=missing.footprints.filter(p=>p.id!=='feature.region_verdant_thalos.part_6');
  assert.throws(()=>buildKaelvarLayoutAR3Sketch(missing),/held original source polygon missing/);
});
test('Every detached component is retained by identity; no smaller island may vanish',()=>{
  const x=make();
  assert.equal(buildKaelvarLayoutAR3Sketch(x).report.detachedShattercapRows.length,1);
  x.expectedDetachedComponents=[{componentId:24,sourceTerrainCandidateCells:2}];
  assert.throws(()=>buildKaelvarLayoutAR3Sketch(x),/detached physical island terrain count/);
  x.expectedDetachedComponents=[];
  assert.throws(()=>buildKaelvarLayoutAR3Sketch(x),/detached physical island identities drift/);
});
test('Source-embedded three-panel visual retains explicit unapproved label and no external image URLs',()=>{
  const x=make(),result=buildKaelvarLayoutAR3Sketch(x);
  const image=new Uint8Array(w*h*4).fill(255);
  const svg=kaelvarLayoutAR3SketchSvg(result,{
    biomeRgba:image,elevationRgba:image,
  });
  assert.equal((svg.match(/<image /g)||[]).length,3);
  assert.match(svg,/NONCANONICAL R3 REVIEW SKETCH/);
  assert.match(svg,/Cyan: detached pending island/);
  assert.match(svg,/data:image\/png;base64,/);
  assert.doesNotMatch(svg,/(?:href|xlink:href)="https?:\/\//);
});
test('CLI is stdout-only and source-identity pinned, and the proposed geometry never becomes canonical',()=>{
  const cli=read('scripts/first-world-kaelvar-layout-a-r3-sketch.mjs');
  for(const required of ['--report','--svg','verifyAuditedTextBlob',
    'expectedDetachedComponents','sourceFootprints','createHash',
    '8731864d809bb8a18d6d74f4003b9cc941eb0e00'])
    assert.ok(cli.includes(required),'missing CLI safeguard '+required);
  assert.doesNotMatch(cli,/writeFileSync|appendFileSync|renameSync|unlinkSync|execSync|spawnSync/);
  const parent=load('docs/design/first-world-kaelvar-landmass-reconstruction-ledger-2026-11-13.json');
  assert.equal(parent.layouts.layoutA.proposedMasks.length,0);
  assert.equal(parent.canonicalWritable,false);
  assert.equal(canonicalSpec.approval.ownerApprovalRef,null);
  assert.equal(canonicalSpec.approval.childBordersApproved,false);
});
