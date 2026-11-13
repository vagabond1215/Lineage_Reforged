import assert from 'node:assert/strict';
import {test} from 'node:test';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  HEX_LEGACY_BASELINE,legacyHexLines,addedLegacyHexLines,
  inspectNewLegacyHexDependencies,
} from '../../scripts/lib/legacy-hex-forward-gate.mjs';

const root=resolve(fileURLToPath(new URL('../..',import.meta.url)));

test('Legacy hex names and reference fields are recognized without matching generic coordinates',()=>{
  const hit='const anchor = settlement.hexAnchorId; const edge = route.orderedHexIds;';
  assert.equal(legacyHexLines(hit).length,1);
  assert.equal(legacyHexLines('const byId=state.worldHexesById;').length,1);
  assert.equal(legacyHexLines('let cell: WorldHexContentRecord;').length,1);
  assert.equal(legacyHexLines('const routeHex=world_hex.kharuun_oasis_chain;').length,1);
  assert.equal(legacyHexLines('const point={x:10,y:30}; const landmass="kaelvar";').length,0);
  assert.equal(legacyHexLines('const route={fromPlaceId:"a",toPlaceId:"b"};').length,0);
});
test('Original legacy lines are grandfathered but newly authored dependencies are rejected',()=>{
  const old='const legacy = value.hexAnchorId;\nconst route = source.orderedHexIds;';
  assert.deepEqual(addedLegacyHexLines(old,old),[]);
  assert.deepEqual(addedLegacyHexLines('',old),[]);
  assert.equal(addedLegacyHexLines(old+'\nconst hex = site.worldHexId;',old).length,1);
  assert.equal(addedLegacyHexLines(old.replace('legacy =','newName ='),old).length,1);
  assert.equal(addedLegacyHexLines(old+'\nconst legacy = value.hexAnchorId;',old).length,1);
});
test('Unrelated coordinate geometry may change without a hex coupling',()=>{
  const old='const first={x:0,y:0};';
  const next='const first={x:0,y:0};\nconst next={x:10.2,y:11.4};';
  assert.equal(addedLegacyHexLines(next,old).length,0);
});
test('Live repository source from frozen pretransition commit has no newly introduced dependencies',()=>{
  const checked=inspectNewLegacyHexDependencies({repoRoot:root});
  assert.equal(checked.baseline,HEX_LEGACY_BASELINE);
  assert.equal(checked.status,'NO_NEW_LEGACY_HEX_DEPENDENCIES',JSON.stringify(checked.findings));
  assert.equal(checked.newLegacyDependencies,0);
  assert.ok(checked.scannedCodeFiles>50);
});
test('The scanner refuses an invalid baseline rather than implicitly allowing all new files',()=>{
  assert.throws(()=>inspectNewLegacyHexDependencies({
    repoRoot:root,baseline:'HEAD',
  }),/invalid pinned baseline/);
  assert.throws(()=>inspectNewLegacyHexDependencies({
    repoRoot:root,baseline:'0'.repeat(40),
  }),/frozen legacy baseline/);
});
