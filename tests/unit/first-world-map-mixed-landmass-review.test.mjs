import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import {buildMixedLandmassCatalog,cleanMixedDecision,MIXED_REVIEW_DECISIONS}
  from '../../apps/rpg-ui/world-map-review-mixed-landmasses.mjs';

const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
const load=path=>JSON.parse(readFileSync(join(root,path),'utf8').replace(/^\uFEFF/,''));
const feature=load('packages/content/base/world/world_map_features.json').records[0];
const regions=load('packages/content/base/world/regions.json').records;
const manifest=load('docs/design/first-world-offshore-square-artifact-removal-2026-11-12.json');
const removed=new Set(manifest.removedSourceFeatureIds);
const source=feature.regionFootprints;
const retained=source.filter(p=>!removed.has(p.id));
const catalog=buildMixedLandmassCatalog(regions,retained,feature.coastlines);
const get=n=>catalog.conflicts.find(p=>p.id==='feature.coastline.first_world.part_'+n);

test('mixed landmass audit classifies eight source traces and two frame-edge diagnostics',()=>{
  assert.equal(retained.length,159);
  assert.equal(feature.coastlines.length,68);
  assert.equal(catalog.footprintCount,159);
  assert.equal(catalog.coastlineCount,68);
  assert.equal(catalog.mixedCount,8);
  assert.equal(catalog.edgeStripCount,2);
  assert.deepEqual(catalog.conflicts.map(c=>c.id.split('.').at(-1)).sort(),
    ['part_1','part_10','part_2','part_3','part_31','part_41','part_45','part_51','part_58','part_8'].sort());
  assert.equal(get(1).kind,'map-edge-strip');
  assert.equal(get(2).kind,'map-edge-strip');
  for(const c of catalog.conflicts) {
    assert.ok(c.owners.length>=2);
    assert.ok(c.materialOwnerIds.length>=2);
    assert.ok(c.areaPx2>0);
    assert.ok(c.bounds.maxX<=2048&&c.bounds.maxY<=1152);
  }
});

test('material mixed ownership is separate from overlapping macro regions',()=>{
  assert.deepEqual(get(51).materialOwnerIds,
    ['region.draemor','region.lantern_isles','region.talmyra','region.serpents_wake']);
  assert.deepEqual(get(3).materialOwnerIds,
    ['region.valtherion','region.myridian_chain','region.dawnreach_isles']);
  assert.deepEqual(get(41).materialOwnerIds,
    ['region.dawnreach_isles','region.valtherion']);
  assert.ok(get(41).directMacroOverlapAreaPx2>0);
  assert.ok(get(51).areaPx2>get(45).areaPx2);
  assert.ok(get(10).subregions.some(s=>s.id==='region.windward_spine'));
});

test('audit cannot alter source geometry or approve map edits',()=>{
  const before=JSON.stringify({regions:regions.map(r=>r.id),source,coasts:feature.coastlines});
  buildMixedLandmassCatalog(regions,retained,feature.coastlines);
  assert.equal(JSON.stringify({regions:regions.map(r=>r.id),source,coasts:feature.coastlines}),before);
  assert.equal(cleanMixedDecision('wrong'), 'undecided');
  assert.equal(cleanMixedDecision('__proto__'), 'undecided');
  for(const decision of MIXED_REVIEW_DECISIONS)
    assert.equal(cleanMixedDecision(decision),decision);
});

test('review page offers a queue, comparison overlay and explicit draft dispositions',()=>{
  const html=readFileSync(join(root,'apps/rpg-ui/world-map-review.html'),'utf8');
  const js=readFileSync(join(root,'apps/rpg-ui/world-map-review.js'),'utf8');
  for(const id of ['mixedConflictList','mixedCount','mixedSummary','mixedFilter',
    'mixedDecision','showMixedLandmass','showContinents','showRegions','showSourceCoastline'])
    assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(js,/buildMixedLandmassCatalog/);
  assert.match(js,/drawMixedLandmass/);
  assert.match(js,/clipPathUnits:'userSpaceOnUse'/);
  assert.match(js,/kind==='mixed-coast'/);
  assert.match(js,/state\.reviews\[selectionKey\(\)\]\.decision/);
  assert.match(js,/boundary:state\.boundary/);
  assert.doesNotMatch(js,/writeFileSync|saveGame/);
});
