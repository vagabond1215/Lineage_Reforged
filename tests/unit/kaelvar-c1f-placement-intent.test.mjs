import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {
  validateC1FPlacementGuides,
} from '../../scripts/lib/kaelvar-c1f-placement-intent.mjs';
import {
  buildC1FPreview,
} from '../../scripts/lib/kaelvar-c1f-source-raster.mjs';
const specPath=new URL(
  '../../docs/design/kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json',import.meta.url);
const ledgerPath=new URL(
  '../../docs/design/kaelvar-c1-coordinate-geography-review-2026-11-13.json',import.meta.url);
const data=()=>JSON.parse(readFileSync(specPath,'utf8'));
const ledger=()=>JSON.parse(readFileSync(ledgerPath,'utf8'));
const validate=s=>validateC1FPlacementGuides(s,ledger());
test('Five qualified intents, four nonoverlapping mainland guides, Shattercap withheld',()=>{
  const r=validate(data());
  assert.equal(r.regionIntents,5);
  assert.equal(r.drawnMainlandGuides,4);
  assert.equal(r.detachedRegionGuides,0);
  assert.equal(r.canonicalWritable,false);
});
test('Veyrholm cannot move inland into owner-marked yellow interior',()=>{
  const s=data(),v=s.regionGuides.find(g=>g.regionId==='region.veyrholm_shore');
  v.guidePolygon=[
    {x:170,y:160},{x:360,y:160},{x:360,y:300},{x:170,y:300},
  ];
  assert.throws(()=>validate(s),/Veyrholm|overlapping|touching/);
});
test('Verdant cannot abandon its southern and southeastern peninsula anchors',()=>{
  const s=data(),v=s.regionGuides.find(g=>g.regionId==='region.verdant_thalos');
  v.guidePolygon=[{x:320,y:340},{x:360,y:340},{x:360,y:390},{x:320,y:390}];
  v.labelAnchor={x:340,y:365};
  assert.throws(()=>validate(s),/Verdant no longer includes/);
});
test('Foreign Windward source cannot be transferred or recolored into Kaelvar',()=>{
  const s=data();s.sourceHolds.foreignSourceTransferredToKaelvar=true;
  assert.throws(()=>validate(s),/foreign source/);
  const t=data();t.regionGuides[2].sourceFeatureIds=['feature.region_windward_spine.part_1'];
  assert.throws(()=>validate(t),/foreign source contamination/);
});
test('Northeastern island and Shattercap cannot be split into provisional guides',()=>{
  const s=data();s.regionGuides[4].guidePolygon=[
    {x:540,y:130},{x:580,y:130},{x:580,y:165},{x:540,y:165},
  ];
  assert.throws(()=>validate(s),/Shattercap detached islands/);
  const t=data();t.reviewAnchors.unownedNortheasternIslandSample={x:350,y:250};
  assert.throws(()=>validate(t),/northeastern island/);
});
test('Source-clipped mainland preview preserves unassigned terrain and zero island claims',()=>{
  const s=data(),w=2048,h=1152,labels=new Uint32Array(w*h);
  // Synthetic input only: one mock candidate island near the mainland guide,
  // not a statement that the canonical component 30 has this geometry.
  for(let y=180;y<475;y++)for(let x=65;x<530;x++)labels[y*w+x]=30;
  for(let y=120;y<145;y++)for(let x=540;x<585;x++)labels[y*w+x]=24;
  // The production builder refuses a different total rather than pretending
  // a synthetic mask is the original 79,419 source witness.
  assert.throws(()=>buildC1FPreview({spec:s,labels,width:w,height:h}),
    /mainland witness drift/);
});
