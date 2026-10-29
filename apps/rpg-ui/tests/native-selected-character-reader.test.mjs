import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';
import { getDefaultWorldSelection } from '../src/game-shell/worldSelectionCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createGameSessionState } = await vite.ssrLoadModule('/src/runtime/GameSessionContext.tsx');
const { createDefaultAccountProfileState } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-account.ts');
const { createCampaignSessionControl } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-session.ts');
const { readNativeFreshSaveSnapshot } = await vite.ssrLoadModule('/src/game-shell/saveManager.ts');
const { GEAR_SLOT_IDS } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/gear-instance-owner.ts');
const { readNativeSelectedCharacter, admitNativeSelectedItemCommand } =
  await vite.ssrLoadModule('/src/game-shell/nativeSelectedCharacter.ts');

function nativeHunter() {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  return createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Selected Native Hunter',
    hairColorId: identity.hairColorOptions[0].id,
    eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id,
    backstoryId: 'backstory.local', continentId: world.continentId,
    regionId: world.regionId, startingSettlementId: world.settlementId,
    startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, 'account.native.selected.reader');
}

function session(snapshot) {
  return createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.native.selected.reader',
    publicationId: 'publication.native.selected.reader', artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: 'artifact.native.selected.reader', headRevision: 1 });
}

test('selected view-model reader accepts a real v3 Hunter without a v2 equipment map', () => {
  const snapshot = nativeHunter();
  assert.equal(Object.hasOwn(snapshot.playerState, 'equipment'), false);
  const state = createGameSessionState(createDefaultAccountProfileState({ accountId: snapshot.accountId }), snapshot);
  assert.ok(state.uiViewModel.character.lists.equipment.some(item => item.title === 'Short Bow'));
  assert.equal(state.uiViewModel.character.lists.equipment.some(item => item.id.startsWith('gear.')), true);
  const read = readNativeSelectedCharacter(snapshot);
  assert.equal(read.slots.length, GEAR_SLOT_IDS.length);
  assert.equal(read.effectiveWorn.mainHandItemId, 'item.short_bow');
  assert.equal(Object.keys(read.attributes).length, 9);
  assert.equal(read.slots.filter(slot => slot.item !== null).length, read.effectiveWorn.items.length);
  const source = JSON.stringify(snapshot);
  read.attributes.STR += 1;
  read.slots.find(slot => slot.item?.itemId === 'item.short_bow').item.location.kind = 'overflow';
  assert.equal(JSON.stringify(snapshot), source, 'presentation rows cannot mutate physical authority');
  assert.throws(() => readNativeSelectedCharacter({ ...snapshot, snapshotVersion: 'lineage.save_snapshot.v2' }),
    /not admitted/);
});

test('selected native gear command preserves exact physical item and session after Save readback', async () => {
  const initial = nativeHunter();
  const original = readNativeSelectedCharacter(initial);
  const bow = original.slots.find(entry => entry.item?.itemId === 'item.short_bow').item;
  const command = { kind: 'gear', expectedRevision: original.gearRevision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } };
  const unsupported = admitNativeSelectedItemCommand(initial, session(initial), {
    ...command, destination: { kind: 'worn', slotId: 'slot.equipment.armor.head' }
  }, 'native.selected.bow.unsupported');
  assert.equal(unsupported.status, 'invalid');
  assert.strictEqual(unsupported.snapshot, initial);
  const moved = admitNativeSelectedItemCommand(initial, session(initial), command, 'native.selected.bow.1');
  assert.equal(moved.status, 'accepted');
  assert.equal(moved.control.hasUnpublishedGameplayState, true);
  const after = readNativeSelectedCharacter(moved.snapshot);
  assert.equal(after.effectiveWorn.mainHandItemId, null);
  assert.equal(after.carriedGear.find(item => item.itemInstanceId === bow.itemInstanceId).durability, bow.durability);
  assert.equal(after.slots.find(entry => entry.slotId === bow.location.slotId).item, null);
  assert.equal(createGameSessionState(createDefaultAccountProfileState({ accountId: initial.accountId }), moved.snapshot)
    .uiViewModel.character.lists.inventory.some(item => item.id === bow.itemInstanceId), true);
  const duplicate = admitNativeSelectedItemCommand(moved.snapshot, moved.control, command, 'native.selected.bow.1');
  assert.equal(duplicate.status, 'duplicate');
  assert.strictEqual(duplicate.snapshot, moved.snapshot);
  const stale = admitNativeSelectedItemCommand(moved.snapshot, moved.control, command, 'native.selected.bow.stale');
  assert.equal(stale.status, 'stale');
  const restored = await readNativeFreshSaveSnapshot(JSON.stringify(moved.snapshot));
  assert.deepEqual(restored.playerState.gear, moved.snapshot.playerState.gear);
  const reequipped = admitNativeSelectedItemCommand(restored, moved.control, {
    kind: 'gear', expectedRevision: restored.playerState.gear.revision,
    itemInstanceId: bow.itemInstanceId, destination: { kind: 'worn', slotId: bow.location.slotId }
  }, 'native.selected.bow.2');
  assert.equal(reequipped.status, 'accepted');
  assert.equal(readNativeSelectedCharacter(reequipped.snapshot).effectiveWorn.mainHandItemId, 'item.short_bow');
  assert.equal(reequipped.snapshot.playerState.gear.instances.length, initial.playerState.gear.instances.length);
});

test('selected native Use target is bound to source stack and duplicate identity', async () => {
  const snapshot = nativeHunter();
  snapshot.playerState.inventory.bags[0].stacks.push({ itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2 });
  const read = readNativeSelectedCharacter(snapshot);
  const bread = read.fungibleStacks.find(stack => stack.itemId === 'item.bread_loaf');
  assert.equal(bread.canUse, true);
  assert.equal(read.fungibleStacks.some(stack => !stack.canUse && stack.useUnavailableReason), true);
  const command = { kind: 'use', target: bread };
  const used = admitNativeSelectedItemCommand(snapshot, session(snapshot), command, 'native.selected.bread.1');
  assert.equal(used.status, 'accepted');
  assert.equal(used.snapshot.playerState.inventory.bags[0].stacks.at(-1).quantity, 1);
  assert.deepEqual(used.snapshot.playerState.gear, snapshot.playerState.gear);
  assert.equal(admitNativeSelectedItemCommand(used.snapshot, used.control, command, 'native.selected.bread.1').status,
    'duplicate');
  assert.equal(admitNativeSelectedItemCommand(used.snapshot, used.control, command, 'native.selected.bread.stale').status,
    'stale');
  const changed = structuredClone(snapshot);
  changed.playerState.inventory.bags[0].stacks.splice(-1, 1, { itemId: 'item.ration_bundle', itemKey: 'ration_bundle', quantity: 2 });
  assert.equal(admitNativeSelectedItemCommand(changed, session(changed), command, 'native.selected.bread.changed').status,
    'stale');
  assert.equal((await readNativeFreshSaveSnapshot(JSON.stringify(used.snapshot))).nativeInventoryUse.revision, 1);
});
