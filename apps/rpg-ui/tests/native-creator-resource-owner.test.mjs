import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';
import { getDefaultWorldSelection } from '../src/game-shell/worldSelectionCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/newGameSnapshot.ts');
const { resolveNativeStartingResourceState } = await vite.ssrLoadModule('/src/game-shell/nativeStartingResources.ts');
const { projectNativeEffectiveWornFromGear, projectNativeEffectiveWorn } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-effective-worn.ts');
const { readNativeFreshSaveSnapshot } = await vite.ssrLoadModule('/src/game-shell/saveManager.ts');

function form(bundleId) {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  return {
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Native Resource Auditor',
    hairColorId: identity.hairColorOptions[0].id,
    eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id,
    backstoryId: 'backstory.local', continentId: world.continentId,
    regionId: world.regionId, startingSettlementId: world.settlementId,
    startingBundleId: bundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundleId)
  };
}

const bundles = JSON.parse(readFileSync(new URL('../../../packages/content/base/player/starting_bundles.json', import.meta.url), 'utf8').replace(/^\uFEFF/, '')).records;
assert.equal(bundles.length, 7);
for (const { id: bundleId } of bundles) {
  test(`real ${bundleId} creator derives initial resources from native worn gear and survives Save readback`, async () => {
    const snapshot = createNativeNewGameSnapshot(form(bundleId), `account.native.resource.${bundleId}`);
    const legacy = createNewGameSnapshot(form(bundleId), `account.legacy.resource.${bundleId}`);
    assert.equal('equipment' in snapshot.playerState, false);
    const projected = projectNativeEffectiveWorn(snapshot);
    assert.deepEqual(projectNativeEffectiveWornFromGear(snapshot.playerState.gear), projected);
    const resolved = resolveNativeStartingResourceState(snapshot.playerState, snapshot.clock.tick);
    assert.deepEqual(snapshot.playerState.resources, resolved.resources);
    assert.deepEqual(snapshot.playerState.resourceRuntime, resolved.resourceRuntime);
    assert.deepEqual(snapshot.playerState.resources, legacy.playerState.resources);
    for (const key of ['hp', 'mp', 'stamina']) {
      assert.equal(snapshot.playerState.resources[key].current, snapshot.playerState.resources[key].max);
    }
    const restored = await readNativeFreshSaveSnapshot(JSON.stringify(snapshot));
    assert.deepEqual(restored.playerState.resources, snapshot.playerState.resources);
    assert.deepEqual(restored.playerState.resourceRuntime, snapshot.playerState.resourceRuntime);
    assert.deepEqual(restored.playerState.gear, snapshot.playerState.gear);
  });
}

test('Legacy preparation modifiers remain native runtime inputs without an equipment map', () => {
  const snapshot = createNativeNewGameSnapshot(form('starting_bundle.laborer'), 'account.native.resource.legacy', {
    appliedLegacyPreparationIds: ['legacy.unlock.preparation.camp_supplies', 'legacy.unlock.preparation.awakened_spark']
  });
  assert.equal('equipment' in snapshot.playerState, false);
  assert.ok(snapshot.playerState.resourceRuntime.modifiers.length > 0);
  assert.deepEqual(snapshot.playerState.resources,
    resolveNativeStartingResourceState(snapshot.playerState, snapshot.clock.tick).resources);
  const staleV2Result = structuredClone(snapshot.playerState);
  staleV2Result.resources.hp.current = 1;
  staleV2Result.resources.hp.max = 1;
  staleV2Result.resourceRuntime.lastBreakdown = null;
  assert.deepEqual(resolveNativeStartingResourceState(staleV2Result, snapshot.clock.tick).resources,
    snapshot.playerState.resources);
});
