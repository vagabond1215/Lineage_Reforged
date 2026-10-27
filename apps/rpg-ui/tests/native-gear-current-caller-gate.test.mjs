import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
import {
  createDefaultCharacterCreationFormState,
  validateCharacterCreationForm
} from '../src/game-shell/characterCreationForm.ts';
import {
  createDefaultStartingBundleChoiceSelections,
  getLineageIdentityCatalog
} from '../src/game-shell/characterCreationCatalog.ts';
import { createNewGameSnapshot } from '../src/game-shell/newGameSnapshot.ts';
import { getDefaultWorldSelection } from '../src/game-shell/worldSelectionCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { validateNativeGearPhysicalBoundary } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-gear-physical-boundary.ts');
const records = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8').replace(/^\uFEFF/, '')).records;
const fits = records('../../../packages/content/base/items/equipment_fit_profiles.json');
const items = records('../../../packages/content/base/items/items.json');
const bundles = records('../../../packages/content/base/player/starting_bundles.json');

function completeForm(bundleId) {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  const form = {
    ...createDefaultCharacterCreationFormState('slot-1'),
    playerName: 'Native Gate Auditor',
    hairColorId: identity.hairColorOptions[0]?.id ?? '',
    eyeColorId: identity.eyeColorOptions[0]?.id ?? '',
    skinToneId: identity.skinToneOptions[0]?.id ?? '',
    backstoryId: 'backstory.local',
    continentId: world.continentId,
    regionId: world.regionId,
    startingSettlementId: world.settlementId,
    startingBundleId: bundleId,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundleId)
  };
  assert.deepEqual(validateCharacterCreationForm(form).errors, {});
  return form;
}

test('all seven real creator callers remain outside the native physical admission boundary', () => {
  assert.equal(bundles.length, 7);
  for (const bundle of bundles) {
    const snapshot = createNewGameSnapshot(completeForm(bundle.id), `account.native_gate.${bundle.id}`);
    const result = validateNativeGearPhysicalBoundary(snapshot, fits, items);
    assert.equal(result.ok, false, bundle.id);
    assert.match(result.reason, /incompatible.*start a new campaign/i);
    assert.equal(snapshot.snapshotVersion, 'lineage.save_snapshot.v2');
    assert.ok('equipment' in snapshot.playerState);
    assert.equal('gear' in snapshot.playerState, false);
  }
});
