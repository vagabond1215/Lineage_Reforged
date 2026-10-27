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
  getLineageIdentityCatalog,
  getStartingBundleSelectedStacks
} from '../src/game-shell/characterCreationCatalog.ts';
import { createNewGameSnapshot } from '../src/game-shell/newGameSnapshot.ts';
import { getDefaultWorldSelection } from '../src/game-shell/worldSelectionCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { validateNativeGearPhysicalBoundary } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-gear-physical-boundary.ts');
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { isNativeTargetCampaignSnapshot } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-campaign-rules.ts');
const { isTargetCampaignSnapshot } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-rules.ts');
const { isNativeFreshSaveSnapshot, readNativeFreshSaveSnapshot, buildNativeGearArtifactPublication, publishSave } = await vite.ssrLoadModule('/src/game-shell/saveManager.ts');
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
    assert.equal(isTargetCampaignSnapshot(snapshot), true, bundle.id);
    assert.ok('equipment' in snapshot.playerState);
    assert.equal('gear' in snapshot.playerState, false);
  }
});

test('native creator produces fully admitted v3 campaigns for seven bundles and ten choice variants', async () => {
  let variants = 0;
  for (const bundle of bundles) {
    const choices = bundle.choiceGroups?.[0]?.options ?? [null];
    for (const choice of choices) {
      const form = completeForm(bundle.id);
      if (choice) form.startingBundleChoiceSelections[bundle.choiceGroups[0].id] = choice.itemId;
      const snapshot = createNativeNewGameSnapshot(form, `account.native.${variants}`);
      assert.equal(snapshot.snapshotVersion, 'lineage.save_snapshot.v3');
      assert.equal('equipment' in snapshot.playerState, false);
      assert.equal(validateNativeGearPhysicalBoundary(snapshot, fits, items).ok, true, bundle.id);
      assert.equal(isNativeTargetCampaignSnapshot(snapshot), true, bundle.id);
      assert.equal(await isNativeFreshSaveSnapshot(snapshot), true, bundle.id);
      const readback = await readNativeFreshSaveSnapshot(JSON.stringify(snapshot));
      assert.deepEqual(readback.playerState.gear, snapshot.playerState.gear);
      assert.deepEqual(readback.playerState.inventory, snapshot.playerState.inventory);
      const expected = new Map(getStartingBundleSelectedStacks(bundle.id, form.startingBundleChoiceSelections)
        .map(stack => [stack.itemId, stack.quantity]));
      const actual = new Map();
      for (const unit of snapshot.playerState.gear.instances) {
        actual.set(unit.itemId, (actual.get(unit.itemId) ?? 0) + 1);
        assert.equal(unit.durability, 1);
      }
      for (const stack of [...snapshot.playerState.inventory.bags.flatMap(bag => bag.stacks),
        ...snapshot.playerState.inventory.overflow]) {
        actual.set(stack.itemId, (actual.get(stack.itemId) ?? 0) + stack.quantity);
      }
      assert.deepEqual([...actual].sort(), [...expected].sort(), bundle.id);
      assert.equal(new Set(snapshot.playerState.gear.instances.map(item => item.itemInstanceId)).size,
        snapshot.playerState.gear.instances.length);
      variants += 1;
    }
  }
  assert.equal(variants, 10);
});

test('native creator grants Legacy Bedroll as one durable instance and not a stack', async () => {
  const snapshot = createNativeNewGameSnapshot(completeForm('starting_bundle.laborer'), 'account.native.bedroll', {
    appliedLegacyPreparationIds: ['legacy.unlock.preparation.camp_supplies']
  });
  assert.equal(isNativeTargetCampaignSnapshot(snapshot), true);
  assert.equal(await isNativeFreshSaveSnapshot(snapshot), true);
  assert.equal(snapshot.playerState.gear.instances.filter(item => item.itemId === 'item.bedroll_kit').length, 1);
  assert.equal(snapshot.playerState.inventory.bags.flatMap(bag => bag.stacks).some(stack => stack.itemId === 'item.bedroll_kit'), false);
});

test('real native creator snapshot prepares a versioned v3 artifact for durable publication', async () => {
  const snapshot = createNativeNewGameSnapshot(completeForm('starting_bundle.hunter'), 'account.native.publish');
  const request = await buildNativeGearArtifactPublication(snapshot, 'slot-1', {
    artifactId: 'artifact.native.1', generationId: 'generation.native.1',
    publicationId: 'publication.native.1', savedAt: '2026-10-27T00:00:00.000Z',
    expectedHead: null
  });
  const envelope = JSON.parse(request.artifactRaw);
  assert.equal(envelope.version, 8);
  assert.equal(envelope.snapshotFormatId, 'lineage.save_snapshot.v3');
  assert.deepEqual(JSON.parse(envelope.snapshot).playerState.gear, snapshot.playerState.gear);
  assert.equal(request.control.headRevision, 1);
});

test('native campaign admission rejects a parallel map, corrupt instance and v2 survey evidence', async () => {
  const original = createNativeNewGameSnapshot(completeForm('starting_bundle.hunter'), 'account.native.tamper');
  const parallel = structuredClone(original);
  parallel.playerState.equipment = { 'slot.weapon.right': null };
  assert.equal(await isNativeFreshSaveSnapshot(parallel), false);

  const broken = structuredClone(original);
  broken.playerState.gear.instances[0].itemInstanceId = broken.playerState.gear.instances[1].itemInstanceId;
  assert.equal(await isNativeFreshSaveSnapshot(broken), false);
  await assert.rejects(readNativeFreshSaveSnapshot(JSON.stringify(broken)), /incompatible or corrupt/i);

  const oldWitness = structuredClone(original);
  oldWitness.authorityLedger.ashenReefSurvey.requests.push({ version: 1 });
  assert.equal(isNativeTargetCampaignSnapshot(oldWitness), false);
});

test('a native gear payload cannot masquerade as a v2 target merely by changing its version string', () => {
  const native = createNativeNewGameSnapshot(completeForm('starting_bundle.hunter'), 'account.native.version_spoof');
  const spoofed = structuredClone(native);
  spoofed.snapshotVersion = 'lineage.save_snapshot.v2';
  assert.equal(isTargetCampaignSnapshot(spoofed), false);
  assert.throws(() => publishSave(native.accountId, 'slot-1', native, null), /Version 7 publication requires/);
});
