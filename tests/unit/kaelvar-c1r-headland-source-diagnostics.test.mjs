import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {validateC1RReviewSpec,buildC1RHeadlandDiagnostic}
 from '../../scripts/lib/kaelvar-c1r-headland-source-diagnostics.mjs';

const read=path=>JSON.parse(readFileSync(new URL('../../'+path,import.meta.url),'utf8')
 .replace(/^\uFEFF/,''));
const dir='docs/design/';
const fixtures=()=>({
 s:read(dir+'kaelvar-c1r-headland-source-bottleneck-probe-2026-11-14.json'),
 q:read(dir+'kaelvar-c1q-northeast-headland-options-2026-11-14.json'),
 p:read(dir+'kaelvar-c1p-refined-mainland-seam-candidates-2026-11-14.json'),
 baseline:{
  status:'C1Q_NORTHEAST_HEADLAND_OPTIONS_REVIEW_ONLY_NO_POLITICAL_ALLOCATION',
  candidateCorridors:[
   {found:true,pixelSteps:223,
    pathSha256:'0147077f649823002cb7ef7a0d40d6617c0fc699ee3b34337fcfb8ff82b1b01a'},
   {found:false},{found:false}
  ],
  c1pTerrainConservation:{assigned:52449,unassigned:26970,
   additionalTerritorialCellsAssigned:0}
 }
});
test('C1-R retains C1-P territory, original source, fixed and wider windows',()=>{
 const {s,q,p,baseline}=fixtures();
 assert.equal(validateC1RReviewSpec(s,q,p,baseline),true);
 assert.deepEqual(s.baselineWindowInclusive,{minX:375,maxX:540,minY:190,maxY:350});
 assert.deepEqual(s.widenedWindowInclusive,{minX:300,maxX:590,minY:155,maxY:465});
 assert.deepEqual(s.clearances,[0,1,2]);
 assert.deepEqual(s.permittedOwners,[0,3]);
 assert.deepEqual(s.disallowedOwners,[1,2,4]);
 assert.deepEqual(s.immutableHolds.kharuunOriginalSourceEdgesInclusive,[35,58]);
 assert.deepEqual(s.immutableHolds.northeastHeadlandOriginalSourceEdgesInclusive,[75,115]);
 assert.equal(s.immutableHolds.canonicalWritable,false);
});
test('C1-R rejects permission to allocate headland, Shattercap, detached land or ports',()=>{
 for(const change of [
  s=>s.immutableHolds.northeastHeadlandSovereigntyApproved=true,
  s=>s.immutableHolds.shattercapIslandClaims=1,
  s=>s.immutableHolds.largeNortheasternIslandClaims=1,
  s=>s.immutableHolds.detachedComponentClaims=1,
  s=>s.immutableHolds.canonicalWritable=true,
  s=>s.immutableHolds.newPortsWellsRiversRoutesSaltBasins=1,
  s=>s.immutableHolds.newLegacyHexDependencies=1,
  s=>s.immutableHolds.foreignWindwardParent='region.veyrholm_shore',
  s=>s.immutableHolds.coast40Claim='region.verdant_thalos'
 ]){
  const x=fixtures();change(x.s);
  assert.throws(()=>validateC1RReviewSpec(x.s,x.q,x.p,x.baseline),/HOLD/);
 }
});
test('C1-R blocks source PNG drift, crop/registration drift and search changes',()=>{
 for(const change of [
  s=>s.originalBiomeSha256='different',
  s=>s.originalElevationSha256='different',
  s=>s.sourceVectorBlob='different',
  s=>s.widenedWindowInclusive.maxX=850,
  s=>s.sourceStart.x=391,
  s=>s.clearances=[0,1,3],
  s=>s.permittedOwners=[0,1,3],
  s=>s.connectivity=8,
  s=>s.outputs.drawReviewOnlySourceUnderlay=false
 ]){
  const x=fixtures();change(x.s);
  assert.throws(()=>validateC1RReviewSpec(x.s,x.q,x.p,x.baseline),/HOLD/);
 }
});
test('C1-R blocks regression in C1-Q 223-step path and C1-P allocation',()=>{
 for(const change of [
  x=>x.baseline.candidateCorridors[0].pixelSteps=224,
  x=>x.baseline.candidateCorridors[1].found=true,
  x=>x.baseline.candidateCorridors[0].pathSha256='different',
  x=>x.baseline.c1pTerrainConservation.assigned=52450,
  x=>x.p.ownerReviewDirection.kharuunSourceEdgeIndicesInclusive=[30,59]
 ]){
  const x=fixtures();change(x);
  assert.throws(()=>validateC1RReviewSpec(x.s,x.q,x.p,x.baseline),/HOLD/);
 }
});
test('C1-R cannot claim native diagnostics from absent original image pairs',()=>{
 const x=fixtures();
 assert.throws(()=>buildC1RHeadlandDiagnostic({
  spec:x.s,q:x.q,p:x.p,baseline:x.baseline,revised:{originalContour:[]},
  labels:new Uint16Array(2048*1152),ownership:new Uint8Array(2048*1152)
 }),/HOLD/);
});
