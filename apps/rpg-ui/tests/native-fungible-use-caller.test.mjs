import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';
import { getDefaultWorldSelection } from '../src/game-shell/worldSelectionCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/newGameSnapshot.ts');
const { consumeNativeFungible, fingerprintNativeInventory } = await vite.ssrLoadModule('/src/game-shell/nativeFungibleActions.ts');
const { consumeInventoryItem, buildInventoryEntries } = await vite.ssrLoadModule('/src/features/characterPanelState.ts');
const { readNativeFreshSaveSnapshot } = await vite.ssrLoadModule('/src/game-shell/saveManager.ts');

function form() {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  return {
    ...createDefaultCharacterCreationFormState('slot-1'),
    playerName: 'Native Fungible Auditor',
    hairColorId: identity.hairColorOptions[0].id,
    eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id,
    backstoryId: 'backstory.local',
    continentId: world.continentId,
    regionId: world.regionId,
    startingSettlementId: world.settlementId,
    startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  };
}

const bread = { itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2 };
function selectedRequest(snapshot, location = { kind: 'bag', bagId: 'bag.traveler_satchel', stackIndex: 3 }) {
  return { requestId: 'native.use.1', expectedRevision: snapshot.nativeInventoryUse.revision,
    expectedInventoryFingerprint: fingerprintNativeInventory(snapshot.playerState.inventory),
    itemId: bread.itemId, itemKey: bread.itemKey, expectedQuantity: 2, location };
}

test('real native creator uses one authored Bread Loaf with exact receipt, resource parity and Save restart', async () => {
  const native = createNativeNewGameSnapshot(form(), 'account.native.use');
  const legacy = createNewGameSnapshot(form(), 'account.legacy.use');
  assert.deepEqual(native.nativeInventoryUse, { version: 1, revision: 0, receipts: [] });
  native.playerState.inventory.bags[0].stacks.push({ ...bread });
  legacy.playerState.inventory.bags[0].stacks.push({ ...bread });
  const request = selectedRequest(native);
  const result = consumeNativeFungible(native, request);
  assert.equal(result.status, 'accepted');
  assert.equal(result.snapshot.playerState.inventory.bags[0].stacks[3].quantity, 1);
  assert.equal(native.playerState.inventory.bags[0].stacks[3].quantity, 2);
  assert.deepEqual(result.snapshot.playerState.gear, native.playerState.gear);
  assert.equal(result.snapshot.nativeInventoryUse.revision, 1);
  assert.equal(result.snapshot.nativeInventoryUse.receipts.length, 1);
  assert.equal(consumeNativeFungible(result.snapshot, request).status, 'duplicate');
  const legacyEntry = buildInventoryEntries(legacy).find(entry => entry.itemId === bread.itemId);
  assert.ok(legacyEntry);
  const legacyUsed = consumeInventoryItem(legacy, legacyEntry).snapshot;
  assert.deepEqual(result.snapshot.playerState.bodyState, legacyUsed.playerState.bodyState);
  for (const key of ['hp', 'mp', 'stamina']) {
    assert.deepEqual(result.snapshot.playerState.resources[key], legacyUsed.playerState.resources[key]);
  }
  const restarted = await readNativeFreshSaveSnapshot(JSON.stringify(result.snapshot));
  assert.deepEqual(restarted.nativeInventoryUse, result.snapshot.nativeInventoryUse);
  assert.deepEqual(restarted.playerState.inventory, result.snapshot.playerState.inventory);
  assert.equal(consumeNativeFungible(restarted, request).status, 'duplicate');
});

test('native Use rejects stale, mismatched and unsupported bag/overflow selections without effects', () => {
  const native = createNativeNewGameSnapshot(form(), 'account.native.use.reject');
  native.playerState.inventory.overflow.push({ ...bread });
  const request = selectedRequest(native, { kind: 'overflow', stackIndex: native.playerState.inventory.overflow.length - 1 });
  const used = consumeNativeFungible(native, request);
  assert.equal(used.status, 'accepted');
  assert.equal(used.snapshot.playerState.inventory.overflow.at(-1).quantity, 1);
  assert.equal(consumeNativeFungible(used.snapshot, { ...request, requestId: 'native.use.2' }).status, 'stale');
  assert.equal(consumeNativeFungible(used.snapshot, { ...request, requestId: 'native.use.1', itemId: 'item.ration_bundle' }).status, 'invalid');
  assert.equal(consumeNativeFungible(native, { ...request, expectedQuantity: 1 }).status, 'stale');
  assert.equal(consumeNativeFungible(native, { ...request, location: { kind: 'bag', bagId: 'bag.traveler_satchel', stackIndex: 0 } }).status, 'stale');
  assert.equal(consumeNativeFungible(native, { ...request, location: null }).status, 'invalid');
  assert.equal(native.playerState.inventory.overflow.at(-1).quantity, 2);
  const finalRequest = { ...selectedRequest(used.snapshot, { kind: 'overflow', stackIndex: used.snapshot.playerState.inventory.overflow.length - 1 }),
    requestId: 'native.use.final', expectedQuantity: 1 };
  const emptied = consumeNativeFungible(used.snapshot, finalRequest);
  assert.equal(emptied.status, 'accepted');
  assert.equal(emptied.snapshot.playerState.inventory.overflow.length, native.playerState.inventory.overflow.length - 1);
  assert.equal(consumeNativeFungible(emptied.snapshot, finalRequest).status, 'duplicate');
  const unsupported = createNativeNewGameSnapshot(form(), 'account.native.use.unsupported');
  unsupported.playerState.inventory.overflow.push({ itemId: 'item.ration_bundle', itemKey: 'ration_bundle', quantity: 1 });
  const unsupportedRequest = { ...selectedRequest(unsupported, { kind: 'overflow', stackIndex: unsupported.playerState.inventory.overflow.length - 1 }),
    requestId: 'native.use.unsupported', itemId: 'item.ration_bundle', itemKey: 'ration_bundle', expectedQuantity: 1 };
  assert.equal(consumeNativeFungible(unsupported, unsupportedRequest).status, 'invalid');
  assert.equal(unsupported.playerState.inventory.overflow.at(-1).quantity, 1);
});
