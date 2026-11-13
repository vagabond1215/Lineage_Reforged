import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  validateLandmassProposalLedger,auditProvisionalRegionMasks,
} from '../../scripts/lib/first-world-landmass-proposal-ledger.mjs';

const root = resolve(fileURLToPath(new URL('../..',import.meta.url)));
const read = path => readFileSync(resolve(root,path),'utf8');
const load = path => JSON.parse(read(path).replace(/^\uFEFF/,''));
const source = load('packages/content/base/world/world_map_features.json')
  .records.find(r => r.mapId === 'world_map.first_world');
const regions = load('packages/content/base/world/regions.json').records;
const exclusions = load('docs/design/first-world-offshore-square-artifact-removal-2026-11-12.json').removedSourceFeatureIds;
const ledgerPath='docs/design/first-world-kaelvar-landmass-reconstruction-ledger-2026-11-13.json';
const inputs = () => ({
  ledger:load(ledgerPath),regions,sourceFootprints:source.regionFootprints,
  approvedExclusionIds:exclusions,
});
test('Pending Kaelvar ledger preserves parent/child hierarchy, all 18 detached components and no masks',()=>{
  const result=validateLandmassProposalLedger(inputs());
  assert.equal(result.status,'R0_R3_LEDGER_VALID_PLACEMENT_HELD');
  assert.equal(result.pendingDetachedComponents,18);
  assert.equal(result.pendingDetachedTerrainCells,3693);
  assert.equal(result.proposedMaskCount,0);
  assert.equal(result.placementApproved,false);
  assert.equal(result.canonicalWritable,false);
});
test('Windward source claim cannot be given to Kaelvar or treated as placed',()=>{
  const x=inputs();
  x.ledger.displacedSourceClaims[0].reconciliationParentRegionId='region.kaelvar';
  assert.throws(()=>validateLandmassProposalLedger(x),/Windward parent reconciliation/);
  const y=inputs();
  y.ledger.sourceFootprintReviews.find(r=>r.sourceFeatureId==='feature.region_windward_spine.part_1').reassignmentApproved=true;
  assert.throws(()=>validateLandmassProposalLedger(y),/review\/source provenance/);
});
test('Physical islands cannot vanish, be merged, or be automatically assigned by size',()=>{
  const x=inputs();
  x.ledger.detachedTerrainOnlyComponents.pop();
  assert.throws(()=>validateLandmassProposalLedger(x),/detached component count/);
  const y=inputs();
  y.ledger.detachedTerrainOnlyComponents.find(c=>c.componentId===78).proposedRegionId='region.shattercap_isles';
  assert.throws(()=>validateLandmassProposalLedger(y),/disputed island/);
  const z=inputs();
  z.ledger.detachedTerrainOnlyComponents.find(c=>c.componentId===24).sourceTerrainCandidateCells++;
  assert.throws(()=>validateLandmassProposalLedger(z),/disputed island/);
});
test('No fourth child, approved mask, source artifact exclusion, or canonical publication sneaks into review',()=>{
  const x=inputs();
  x.ledger.layouts.layoutB.proposedFourthRegionId='region.kaelvar_east';
  assert.throws(()=>validateLandmassProposalLedger(x),/unapproved A\/B mask/);
  const y=inputs();
  y.ledger.ownerApprovalRef='approved';
  assert.throws(()=>validateLandmassProposalLedger(y),/unauthorized publication/);
  const z=inputs();
  z.approvedExclusionIds=[...exclusions,'feature.region_shattercap_isles.part_1'];
  assert.throws(()=>validateLandmassProposalLedger(z),/accepted exclusion count/);
});
test('Source polygon provenance, Coast 40 and canonical region placements fail closed on drift',()=>{
  const x=inputs();
  x.ledger.coast40.sourceFeatureIds=['feature.region_windward_spine.part_1'];
  assert.throws(()=>validateLandmassProposalLedger(x),/Coast 40/);
  const y=inputs();
  y.ledger.sourceFootprintReviews[1].sourceFeatureId='feature.missing';
  assert.throws(()=>validateLandmassProposalLedger(y),/required source review missing/);
  const z=inputs();
  z.regions=regions.map(r=>r.id==='region.verdant_thalos'?
    {...r,parentRegionId:'region.serathyl'}:r);
  assert.throws(()=>validateLandmassProposalLedger(z),/child intent/);
});
const pilotRegions=regions.filter(r=>['region.auric_marches','region.verdant_thalos','region.shattercap_isles'].includes(r.id));
const width=4,height=2;
const terrainCandidateMask=Uint8Array.from([1,1,0,1,1,1,0,0]);
const terrainOnlyComponentByCell=Uint32Array.from([30,30,0,24,30,30,0,0]);
const claim=(id,regionId,componentId,assigned)=>({
  id,regionId,parentRegionId:'region.kaelvar',componentId,
  sourceFeatureIds:['feature.synthetic_part'],mask:Uint8Array.from(
    Array.from({length:width*height},(_,i)=>assigned.includes(i)?1:0)),
});
const audit=(claims,confirmedParentByComponent={30:'region.kaelvar'})=>
  auditProvisionalRegionMasks({
    width,height,terrainCandidateMask,terrainOnlyComponentByCell,
    regions:pilotRegions,confirmedParentByComponent,claims,
  });
test('Explicit R3 masks admit unassigned candidate terrain and do not allocate a pending island',()=>{
  const r=audit([claim('west','region.auric_marches',30,[0]),
    claim('south','region.verdant_thalos',30,[1])]);
  assert.equal(r.status,'R3_MASK_TOPOLOGY_REVIEW_ONLY_NOT_ECOLOGICAL_APPROVAL');
  assert.equal(r.terrainCandidateCells,5);
  assert.equal(r.assignedTerrainCells,2);
  assert.equal(r.unassignedTerrainCells,3);
  assert.equal(r.sourceWritable,false);
});
test('Explicit R3 masks reject overlap, ink/water, physical island leap and unapproved macro parent',()=>{
  assert.throws(()=>audit([
    claim('a','region.auric_marches',30,[0]),
    claim('b','region.verdant_thalos',30,[0]),
  ]),/overlap/);
  assert.throws(()=>audit([claim('off','region.auric_marches',30,[2])]),/water\/ink/);
  assert.throws(()=>audit([claim('island-leap','region.auric_marches',30,[3])]),/physical component/);
  assert.throws(()=>audit([claim('island-auto','region.shattercap_isles',24,[3])]),/without confirmed parent/);
  assert.throws(()=>audit([claim('island-cross-parent','region.shattercap_isles',24,[3])],
    {30:'region.kaelvar',24:'region.serathyl'}),/without confirmed parent/);
});
test('R3 proposals require explicit provenance and cannot invent parent reassignment',()=>{
  const noSource=claim('no-source','region.auric_marches',30,[0]);
  noSource.sourceFeatureIds=[];
  assert.throws(()=>audit([noSource]),/mask\/source provenance/);
  const wrongParent=claim('wrong-parent','region.auric_marches',30,[0]);
  wrongParent.parentRegionId='region.serathyl';
  assert.throws(()=>audit([wrongParent]),/without confirmed parent/);
});
test('Read-only runner requires --check and does not write, mutate or generate geography',()=>{
  const script=read('scripts/first-world-landmass-proposal-audit.mjs');
  assert.match(script,/--check/);
  assert.match(script,/verifyAuditedTextBlob/);
  assert.match(script,/createHash/);
  assert.doesNotMatch(script,/writeFileSync|appendFileSync|renameSync|unlinkSync|spawnSync|execSync|process\.stdout\.write\(.*svg/);
});
