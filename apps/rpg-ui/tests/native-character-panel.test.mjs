import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';
import { getDefaultWorldSelection } from '../src/game-shell/worldSelectionCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
test.after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createDefaultAccountProfileState } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/legacy-account.ts');
const { createCampaignSessionControl } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-session.ts');
const { InGameShell } = await vite.ssrLoadModule('/src/game-shell/InGameShell.tsx');
const { NativeCharacterPanel } = await vite.ssrLoadModule('/src/features/NativeCharacterPanel.tsx');
const { GEAR_SLOT_IDS } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/gear-instance-owner.ts');

function hunter() {
  const identity = getLineageIdentityCatalog('lineage.human');
  const world = getDefaultWorldSelection('backstory.local');
  return createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Native Shell Hunter',
    hairColorId: identity.hairColorOptions[0].id,
    eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id,
    backstoryId: 'backstory.local', continentId: world.continentId,
    regionId: world.regionId, startingSettlementId: world.settlementId,
    startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, 'account.native.shell');
}

function control(snapshot) {
  return createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.native.shell',
    publicationId: 'publication.native.shell', artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: 'artifact.native.shell', headRevision: 1 });
}

test('real InGameShell renders native Hunter without indexing the v2 equipment map', () => {
  const snapshot = hunter();
  assert.equal(Object.hasOwn(snapshot.playerState, 'equipment'), false);
  const html = renderToStaticMarkup(React.createElement(InGameShell, {
    accountProfile: createDefaultAccountProfileState({ accountId: snapshot.accountId }),
    snapshot, campaignSessionControl: control(snapshot), slots: [], activeSlotId: 'slot-1',
    hasUnsavedChanges: false, notice: null, onDismissNotice: () => {},
    onSnapshotChange: () => {}, onSave: () => {}, onQuickSave: () => {},
    onRetireCharacter: () => {}, onReturnToMainMenu: () => {}
  }));
  assert.match(html, /Native Shell Hunter/);
  assert.match(html, /Short Bow/);
  assert.equal([...html.matchAll(/data-slot-id=/g)].length, GEAR_SLOT_IDS.length);
  assert.match(html, /Native campaign review only/);
  assert.doesNotMatch(html, /Save Game|Quick Save|World/);
  assert.match(html, /disabled=""[^>]*>Unequip/);
});

test('native Character and Inventory present exact owner-backed records without v2 controls', () => {
  const snapshot = hunter();
  snapshot.playerState.inventory.bags[0].stacks.push({
    itemId: 'item.bread_loaf', itemKey: 'bread_loaf', quantity: 2
  });
  const character = renderToStaticMarkup(React.createElement(NativeCharacterPanel,
    { snapshot, mode: 'character' }));
  assert.equal([...character.matchAll(/data-slot-id=/g)].length, GEAR_SLOT_IDS.length);
  assert.equal([...character.matchAll(/aria-label="(?:Strength|Dexterity|Agility|Constitution|Vitality|Intelligence|Wisdom|Spirit|Charisma) /g)].length, 9);
  assert.equal([...character.matchAll(/role="group"[^>]+aria-label="(?:Strength|Dexterity|Agility|Constitution|Vitality|Intelligence|Wisdom|Spirit|Charisma) /g)].length, 9);
  assert.match(character, /Short Bow/);
  assert.match(character, /durability/);
  const inventory = renderToStaticMarkup(React.createElement(NativeCharacterPanel,
    { snapshot, mode: 'inventory' }));
  assert.match(inventory, /Bread Loaf/);
  assert.match(inventory, /No authored consumable effect/);
  assert.match(inventory, /disabled=""[^>]*>Use Bread Loaf/);
  assert.equal(Object.hasOwn(snapshot.playerState, 'equipment'), false);
});

test('malformed native gear is refused before any v2 session provider mounts', () => {
  const snapshot = hunter();
  snapshot.playerState.gear.instances[0].itemInstanceId = '';
  const html = renderToStaticMarkup(React.createElement(InGameShell, {
    accountProfile: createDefaultAccountProfileState({ accountId: snapshot.accountId }),
    snapshot, campaignSessionControl: control(snapshot), slots: [], activeSlotId: 'slot-1',
    hasUnsavedChanges: false, notice: null, onDismissNotice: () => {},
    onSnapshotChange: () => {}, onSave: () => {}, onQuickSave: () => {},
    onRetireCharacter: () => {}, onReturnToMainMenu: () => {}
  }));
  assert.match(html, /Native campaign cannot be opened/);
  assert.match(html, /saved record was not changed/);
  assert.doesNotMatch(html, /Worn Equipment|Save Game/);
});
