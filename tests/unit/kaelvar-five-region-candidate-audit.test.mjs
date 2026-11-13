import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateKaelvarFiveRegionCandidates}
  from '../../scripts/lib/kaelvar-five-region-candidate-audit.mjs';

const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));
const read=path=>JSON.parse(readFileSync(resolve(root,path),'utf8').replace(/^\uFEFF/,''));
const source={
  regionPack:read('docs/design/kaelvar-five-region-candidate-region-records-2026-11-13.json'),
  localityPack:read('docs/design/kaelvar-five-region-locality-hex-and-settlement-candidates-2026-11-13.json'),
  ecologyPack:read('docs/design/kaelvar-five-region-ecology-and-generation-candidates-2026-11-13.json'),
  activeRegions:read('packages/content/base/world/regions.json').records,
  activeLocalities:read('packages/content/base/world/region_localities.json').records,
  activeWorldHexes:read('packages/content/base/world/world_hexes.json').records,
  activeSettlements:read('packages/content/base/world/settlements.json').records,
};
const audit=()=>validateKaelvarFiveRegionCandidates(structuredClone(source));
const bad=mutate=>{
  const input=structuredClone(source);
  mutate(input);
  return ()=>validateKaelvarFiveRegionCandidates(input);
};

test('Two proposed regions exceed existing catalog field completeness without active publication',()=>{
  const result=audit();
  assert.equal(result.status,'FIVE_REGION_AUTHORING_COMPLETE_CANONICAL_HELD');
  assert.equal(result.newRegionCount,2);
  assert.equal(result.newLocalityCount,8);
  assert.equal(result.candidateHexCount,8);
  assert.equal(result.unplacedSettlementConceptCount,8);
  assert.equal(result.ecologicalHabitatCount,8);
  assert.equal(result.canonicalWritable,false);
  const template=source.activeRegions.find(x=>x.id==='region.auric_marches');
  for(const r of source.regionPack.newRegionRecords){
    for(const key of Object.keys(template))assert.ok(key in r,key);
    assert.ok(r.demographicProfile.raceDistribution.length>=8);
    assert.ok(r.civilizationNotes.length>=3);
    assert.ok(r.strategicNotes.length>=3);
    assert.ok(!source.activeRegions.some(x=>x.id===r.id));
  }
});
test('Five candidate populations conserve existing 40 million, with existing child records unchanged',()=>{
  const r=audit();
  assert.equal(r.fiveRegionPopulationMillions,40);
  assert.equal(r.sourceThreeRegionPopulationMillions,40);
  assert.equal(source.regionPack.populationScenario.candidateFiveRegionMillions['region.kharuun_drylands'],5);
  assert.equal(source.regionPack.populationScenario.candidateFiveRegionMillions['region.veyrholm_shore'],4);
});
test('Changing the new region parent or adding a fourth wrong region is held',()=>{
  assert.throws(bad(x=>{x.regionPack.newRegionRecords[0].parentRegionId='region.serathyl';}),/region parent/);
  assert.throws(bad(x=>{x.regionPack.newRegionRecords[1].id='region.auric_marches';}),/two region/);
});
test('Population inflation or invented demographic percentages are rejected',()=>{
  assert.throws(bad(x=>{x.regionPack.populationScenario.candidateFiveRegionMillions['region.kharuun_drylands']=9;}),/population conservation/);
  assert.throws(bad(x=>{x.regionPack.newRegionRecords[0].demographicProfile.raceDistribution[0].percentage=47;}),/region parent, population or race/);
});
test('Names cannot silently duplicate active world regions or other settlements',()=>{
  assert.throws(bad(x=>{x.regionPack.newRegionRecords[0].name='The Auric Marches';}),/name collision/);
  assert.throws(bad(x=>{x.localityPack.settlementConcepts[0].suggestedName='Aurelis';}),/name collision/);
});
test('Eight localities and hexes retain region, locality and unanchored semantics',()=>{
  assert.throws(bad(x=>{x.localityPack.localityRecords[0].regionId='region.valtherion';}),/locality fields or parent/);
  assert.throws(bad(x=>{x.localityPack.worldHexCandidateRecords[0].localityBandId='region_locality.auric_marches_ore_ridges';}),/world hex/);
  assert.throws(bad(x=>{x.localityPack.worldHexCandidateRecords[0].anchoredSettlementIds.push('settlement.aurelis');}),/world hex/);
});
test('No settlement can acquire coordinates, canonical identity or a different parent',()=>{
  assert.throws(bad(x=>{x.localityPack.settlementConcepts[0].spatialStatus='PLACED';}),/settlement concept/);
  assert.throws(bad(x=>{x.localityPack.settlementConcepts[0].canonicalSettlementId='settlement.azharin_wells';}),/settlement concept/);
  assert.throws(bad(x=>{x.localityPack.settlementConcepts[0].regionId='region.shattercap_isles';}),/settlement concept/);
});
test('All eight ecological habitats and generation dependencies are nonempty',()=>{
  for(const p of source.ecologyPack.profiles){
    assert.equal(p.ecology.habitats.length,4);
    assert.equal(p.generationAndGameHooks.crafting.length,8);
    for(const h of p.ecology.habitats){
      assert.ok(h.flora.length>=3);
      assert.ok(h.fauna.length>=3);
      assert.ok(h.monsterArchetypes.length>=2);
      assert.ok(h.hazards.length>=2);
    }
  }
  assert.throws(bad(x=>{x.ecologyPack.profiles[1].ecology.habitats.pop();}),/ecology\/generation/);
});
test('Large northeast island, existing Shattercap islands and canonical-publishing guards cannot be relaxed',()=>{
  assert.throws(bad(x=>{x.regionPack.geographyHolds.northeastLargeIsland='SPLIT';}),/island or existing child/);
  assert.throws(bad(x=>{x.regionPack.geographyHolds.shattercapIslands='AUTO_OWNED';}),/island or existing child/);
  assert.throws(bad(x=>{x.localityPack.approval.canonicalWritable=true;}),/premature world publication/);
  assert.throws(bad(x=>{x.ecologyPack.publicationHolds.ownerApprovalRef='fake';}),/premature world publication/);
});
test('CLI cannot write canonical region/hex/settlement or route content',()=>{
  const cli=readFileSync(resolve(root,'scripts/kaelvar-five-region-candidate-audit.mjs'),'utf8');
  assert.match(cli,/--check/);
  assert.doesNotMatch(cli,/writeFileSync|appendFileSync|renameSync|unlinkSync|execSync|spawnSync/);
  assert.doesNotMatch(cli,/--apply|--publish|--commit/);
  assert.equal(source.ecologyPack.publicationHolds.canonicalRegionCatalogUnchanged,true);
  assert.equal(source.ecologyPack.publicationHolds.canonicalSettlementsUnchanged,true);
});
