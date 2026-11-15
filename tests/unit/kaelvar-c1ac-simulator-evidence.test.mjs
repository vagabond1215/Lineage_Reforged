import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateC1ACOwnerViewManifest} from '../../scripts/kaelvar-c1ac-simulator-evidence.mjs';
const read=x=>JSON.parse(readFileSync(new URL('../../docs/design/'+x,import.meta.url),'utf8').replace(/^\uFEFF/,''));
const fixture=()=>({
 m:read('kaelvar-c1ac-owner-fantasy-map-simulator-screenshot-evidence-2026-11-15.json'),
 c1aa:read('kaelvar-c1aa-relative-relief-shared-seams-2026-11-15.json')
});
const check=x=>validateC1ACOwnerViewManifest(x.m,x.c1aa);
test('C1-AC original multi-view owner screenshots, editor labels and source registration are review-only',()=>{
 const x=fixture();
 assert.equal(check(x),true);
 assert.equal(x.m.screenshotManifest.length,11);
 assert.equal(x.m.screenshotManifest.reduce((n,s)=>n+s.sizeBytes,0),5356849);
 assert.equal(x.m.districtEditor.legend.length,5);
 assert.deepEqual(x.m.districtEditor.legend.map(d=>d.regionId),[
  'region.veyrholm_shore','region.auric_marches','region.kharuun_drylands',
  'region.verdant_thalos','region.shattercap_isles']);
 assert.equal(x.m.districtEditor.lineIsInkNotOwnerResolvedPolygon,true);
 assert.equal(x.m.sourceProvenance.calibratedHeightAvailable,false);
 assert.equal(x.m.sourceProvenance.simulatorSaveMatchedToSource,false);
 assert.equal(x.m.authoringPolicy.newlyAssignedIslands,0);
 assert.equal(x.m.authoringPolicy.canonicalPublication,false);
});
test('C1-AC rejects screenshot/palette/registration drifts and bogus physical ownership',()=>{
 for(const mutate of [
  x=>x.m.screenshotManifest[10].sha256='0'.repeat(64),
  x=>x.m.screenshotManifest[8].dimensions=[1400,1000],
  x=>x.m.screenshotManifest[5].filename='replaced-image.png',
  x=>x.m.screenshotBytesPersistedInGit=true,
  x=>x.m.derivedScreenshotInkReferenceSvg.sha256='0'.repeat(64),
  x=>x.m.derivedScreenshotInkReferenceSvg.canonicalWritable=true,
  x=>x.m.derivedScreenshotInkReferenceSvg.coordinateFrame='EDITOR_SCREEN_PIXELS',
  x=>x.m.screenshotArchiveSha256='0'.repeat(64),
  x=>x.m.districtEditor.legend[4].exactScreenshotInkRGB[1]=15,
  x=>x.m.districtEditor.lineIsInkNotOwnerResolvedPolygon=false,
  x=>x.m.districtEditor.visiblePageLabel='Page 5 of 5',
  x=>x.m.registration.stages[0].p95ResidualPixels=8,
  x=>x.m.registration.editorToSourceReferenceApprox[0][0]=0.4,
  x=>x.m.sourceProvenance.calibratedHeightAvailable=true,
  x=>x.m.sourceProvenance.simulatorSaveMatchedToSource=true,
  x=>x.m.sourceProvenance.originalFirstWorldBiomeSHA256='no',
  x=>x.m.authoringPolicy.canonicalPublication=true,
  x=>x.m.authoringPolicy.newlyAssignedIslands=1,
  x=>x.m.holds.pop(),
  x=>x.m.provisionalCandidateComparison.replaceEarlierSharedSeamsAutomatically=true,
  x=>x.c1aa.candidates[0].sharedChain[0][0]=280,
  x=>x.c1aa.canonicalWritable=true
 ]){
  const x=fixture();mutate(x);
  assert.throws(()=>check(x),/C1-AC simulator evidence HOLD/);
 }
});
test('C1-AC refuses false biome-only equivalence to owner editor district boundaries',()=>{
 const x=fixture();
 assert.deepEqual(x.m.provisionalCandidateComparison.nearestMatchingEditorInkScreenshotPixelDistance,
  {northVeyrholmAtCandidateVertices:[68.1,41,20,11],
   southVerdantAtCandidateVertices:[44,5.8,9.4,3.2]});
 assert.equal(x.m.provisionalCandidateComparison.northernProposalMateriallyDifferentInOwnerEditor,true);
 assert.equal(x.m.provisionalCandidateComparison.southernProposalPartlyNearOwnerEditorButNotEquivalent,true);
 assert.equal(x.m.registration.sourceImageRegistrationStatus,
  'HIGH_CONFIDENCE_VIEW_ALIGNMENT_NOT_POLYGON_OR_LANDFORM_CERTIFICATION');
 assert.ok(x.m.registration.stages.every(x=>x.p95ResidualPixels<2));
});
