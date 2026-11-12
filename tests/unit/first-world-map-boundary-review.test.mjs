import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import {buildBoundaryCatalog,newBoundaryDraft,cleanBoundaryDraft,boundaryParts,
  boundaryPart,setBoundaryPoints,excludeBoundary,resetBoundary,addCustomBoundary,
  squareCandidate,segmentIndex} from '../../apps/rpg-ui/world-map-review-boundaries.mjs';

const ROOT=resolve(fileURLToPath(new URL('../..', import.meta.url)));
const dir=join(ROOT,'packages/content/base/world');
const json=(name)=>JSON.parse(readFileSync(join(dir,name),'utf8').replace(/^\uFEFF/,''));
const regions=json('regions.json').records;
const coastlineSource=json('world_map_features.json').records[0];
const originalFootprints=coastlineSource.regionFootprints;
const catalog=buildBoundaryCatalog(regions,originalFootprints);

test('both continent and subregion overlays follow source identity, not filled bboxes',()=>{
  assert.equal(originalFootprints.length,201);
  assert.equal(catalog.parts.size,201);
  assert.equal(catalog.macros.length,9); // 5 continents + 4 island systems
  assert.equal(catalog.namedRegions.length,28);
  assert.ok(catalog.macroIds.get('region.kaelvar').length>0);
  assert.equal(catalog.regionIds.get('region.kaelvar').length,0);
  assert.equal(catalog.regionIds.get('region.starfall_isle').length,0);
  assert.equal(catalog.regionIds.get('region.nacre_shelf').length,0);
  assert.equal(catalog.macroIds.get('region.myridian_chain').length,40);
  assert.equal(coastlineSource.coastlines.length,68);
});

test('exact 8-by-8 square parts are flagged, but never silently removed',()=>{
  assert.equal(catalog.suspected.length,42);
  assert.ok(catalog.suspected.every(p=>squareCandidate(p.points)));
  const d=newBoundaryDraft();
  const owner=catalog.suspected[0];
  assert.ok(owner);
  assert.equal(boundaryPart(catalog,d,'region',owner.id)?.excluded,false);
  assert.equal(boundaryPart(catalog,d,'continent',owner.id)?.excluded,false);
});

test('exclusion and vertex edits affect only chosen review layer, never source vertices',()=>{
  const first=catalog.parts.get('feature.region_auric_marches.part_3');
  assert.ok(first);
  const original=JSON.stringify(first.points);
  const draft=newBoundaryDraft();
  assert.equal(excludeBoundary(catalog,draft,'region',first.id,true),true);
  assert.equal(boundaryPart(catalog,draft,'region',first.id).excluded,true);
  assert.equal(boundaryPart(catalog,draft,'continent',first.id).excluded,false);
  const pts=first.points.map(p=>({x:p.x+1,y:p.y+1}));
  assert.equal(setBoundaryPoints(catalog,draft,'continent',first.id,pts),true);
  assert.deepEqual(boundaryPart(catalog,draft,'continent',first.id).points,pts);
  assert.notDeepEqual(boundaryPart(catalog,draft,'region',first.id).points,pts);
  assert.equal(JSON.stringify(first.points),original);
  resetBoundary(catalog,draft,'region',first.id);
  resetBoundary(catalog,draft,'continent',first.id);
  assert.equal(Object.keys(draft.region).length,0);
  assert.equal(Object.keys(draft.continent).length,0);
});

test('previously unmapped island subregion supports explicitly authored review-only polygon',()=>{
  const draft=newBoundaryDraft();
  assert.equal(boundaryParts(catalog,draft,'region','region.starfall_isle').length,0);
  const points=[{x:812,y:230},{x:834,y:234},{x:841,y:251},{x:817,y:255}];
  const id=addCustomBoundary(catalog,draft,'region','region.starfall_isle',points);
  assert.ok(id);
  assert.equal(boundaryParts(catalog,draft,'region','region.starfall_isle').length,1);
  assert.equal(addCustomBoundary(catalog,draft,'region','region.azure_vast',points),null);
  assert.equal(addCustomBoundary(catalog,draft,'region','region.starfall_isle',[{x:-1,y:0},{x:1,y:1},{x:2,y:2}]),null);
  const copy=cleanBoundaryDraft(JSON.parse(JSON.stringify(draft)),catalog);
  assert.deepEqual(copy.custom.region[id].points,points);
  resetBoundary(catalog,draft,'region',id);
  assert.equal(boundaryParts(catalog,draft,'region','region.starfall_isle').length,0);
});

test('import cleans invalid ids, bad polygon coordinates and high-risk replacement attempts',()=>{
  const draft=newBoundaryDraft();
  draft.region['unknown.part']={excluded:true};
  draft.region['feature.region_auric_marches.part_3']={points:[{x:0,y:0},{x:3000,y:0},{x:9,y:2}],excluded:true};
  draft.custom.region['draft.region.region.starfall_isle.1']={ownerId:'region.starfall_isle',points:[{x:820,y:220},{x:836,y:230},{x:826,y:246}]};
  draft.custom.continent['draft.continent.region.kaelvar.1']={ownerId:'region.kaelvar',points:[{x:-1,y:0},{x:1,y:1},{x:2,y:2}]};
  const cleaned=cleanBoundaryDraft(draft,catalog);
  assert.deepEqual(cleaned.region['feature.region_auric_marches.part_3'],{excluded:true});
  assert.equal(cleaned.region['unknown.part'],undefined);
  assert.equal(cleaned.custom.continent['draft.continent.region.kaelvar.1'],undefined);
  assert.ok(cleaned.custom.region['draft.region.region.starfall_isle.1']);
});

test('closed polygon editor inserts at nearest boundary edge',()=>{
  const pts=[{x:10,y:10},{x:100,y:10},{x:100,y:100},{x:10,y:100}];
  assert.equal(segmentIndex(pts,{x:55,y:11},true),0);
  assert.equal(segmentIndex(pts,{x:11,y:55},true),3);
});

test('Vite HTML exposes independent review scope and explicit non-authority controls',()=>{
  const html=readFileSync(join(ROOT,'apps/rpg-ui/world-map-review.html'),'utf8');
  const js=readFileSync(join(ROOT,'apps/rpg-ui/world-map-review.js'),'utf8');
  for(const id of ['showContinents','showRegions','showSuspectSquares',
    'showSourceCoastline','boundaryScope','boundaryOwner','boundaryPartList',
    'editBoundary','boundaryTool','finishBoundary','cancelBoundary',
    'toggleBoundaryPart','resetBoundaryPart','showOriginalBoundary']){
      assert.match(html,new RegExp('id="'+id+'"'));
  }
  assert.match(js,/drawBoundaryScope\('continent'\)/);
  assert.match(js,/drawBoundaryScope\('region'\)/);
  assert.match(js,/boundary:state\.boundary/);
  assert.match(js,/drawSuspectSquares/);
});
