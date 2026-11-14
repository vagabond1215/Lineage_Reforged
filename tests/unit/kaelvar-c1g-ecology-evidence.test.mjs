import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {
  validateKaelvarC1GEcology,assessKaelvarEvidenceReadiness,
} from '../../scripts/lib/kaelvar-c1g-ecology-evidence.mjs';
const root=new URL('../../docs/design/',import.meta.url);
const parse=name=>JSON.parse(readFileSync(new URL(name,root),'utf8'));
const file={
  review:'kaelvar-c1g-coastline-salt-basin-evidence-2026-11-13.json',
  c1fGuides:'kaelvar-c1f-owner-corrected-placement-guides-2026-11-13.json',
  c1Ledger:'kaelvar-c1-coordinate-geography-review-2026-11-13.json',
  localityPack:'kaelvar-five-region-locality-environment-and-settlement-candidates-2026-11-13.json',
  ecologyPack:'kaelvar-five-region-ecology-and-generation-candidates-2026-11-13.json',
};
const load=()=>Object.fromEntries(Object.entries(file).map(([k,v])=>[k,parse(v)]));
test('C1-G aligns existing Salt Basins, Tirash, four north-coast habitats and all holds',()=>{
  const report=validateKaelvarC1GEcology(load());
  assert.equal(report.existingCoastalHabitatContexts,4);
  assert.equal(report.existingSaltLocalityValidated,true);
  assert.equal(report.existingTirashConceptUnplaced,true);
  assert.equal(report.unverifiedEvidenceRequirements,16);
  assert.equal(report.canonicalWritable,false);
  assert.equal(report.sourceCoordinatesPublished,0);
});
test('C1-G preference is variable coastline, not a forced equal-distance buffer',()=>{
  const v=load();
  v.review.coast.default.depthRule='FIXED_DISTANCE_IN_PIXELS';
  assert.throws(()=>validateKaelvarC1GEcology(v),/coastline default/);
});
test('Arid direct ocean access is conditional only, not implied',()=>{
  const v=load();
  v.review.coast.alternative.directKharuunSeaAccessApproved=true;
  assert.throws(()=>validateKaelvarC1GEcology(v),/unsupported dry coast/);
});
test('Salt flat has no guessed coordinates, basin count or invented wells',()=>{
  const v=load();
  v.review.drylands.saltFlat.mapCoordinates={x:344,y:282};
  assert.throws(()=>validateKaelvarC1GEcology(v),/salt flats were auto-placed/);
  const w=load();w.review.drylands.waterDependencies.wellLocationsVerified=true;
  assert.throws(()=>validateKaelvarC1GEcology(w),/unapproved water/);
});
test('Existing Tirash candidate cannot become a placed canonical salt town',()=>{
  const v=load();
  v.localityPack.settlementConcepts.find(x=>x.candidateId==='settlement_concept.tirash_saltworks')
    .canonicalSettlementId='settlement.invented';
  assert.throws(()=>validateKaelvarC1GEcology(v),/salt locality/);
});
test('Unreviewed north-coast source cannot become a certified ecological zone',()=>{
  const v=load();
  v.review.coast.coastlineEcologyBands[0].geometryRef='geometry.invented';
  assert.throws(()=>validateKaelvarC1GEcology(v),/Veyrholm ecological area/);
});
test('Evidence refs cannot be invented by simply mutating accepted review ledger',()=>{
  const v=load();
  v.review.drylands.saltFlat.evidenceRequirements[0].status='VERIFIED';
  assert.throws(()=>validateKaelvarC1GEcology(v),/uncertified evidence was promoted/);
});
test('Disputed Serathyl, Coast 40, NE island and canonical publication remain held',()=>{
  const v=load();v.review.crossRegion.foreignWindwardReassignmentApproved=true;
  assert.throws(()=>validateKaelvarC1GEcology(v),/foreign territory/);
  const w=load();w.review.approval.canonicalWritable=true;
  assert.throws(()=>validateKaelvarC1GEcology(w),/world publication/);
});
test('Evidence readiness reports missing proof, never authorizes geography',()=>{
  const req=[{id:'drainage'},{id:'source'}];
  const missing=assessKaelvarEvidenceReadiness(req,{drainage:'review-proof'});
  assert.equal(missing.status,'EVIDENCE_INCOMPLETE_NO_PLACEMENT');
  assert.deepEqual(missing.missing,['source']);
  const all=assessKaelvarEvidenceReadiness(req,{
    drainage:'review-proof',source:'source-review-proof',
  });
  assert.equal(all.reviewReadyForOwner,true);
  assert.equal(all.canonicalWritable,false);
  assert.equal(all.geometryApproved,false);
});
