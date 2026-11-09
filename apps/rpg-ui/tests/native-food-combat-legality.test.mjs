import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createDefaultCharacterCreationFormState } from '../src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from '../src/game-shell/characterCreationCatalog.ts';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] } });
after(() => vite.close());
const { createNativeNewGameSnapshot } = await vite.ssrLoadModule('/src/game-shell/nativeNewGameSnapshot.ts');
const { createCampaignSessionControl, admitCampaignMutation } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/campaign-session.ts');
const { createNativeSelectedSession, applyNativeSelectedItem } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedSession.ts');
const { readNativeSelectedCharacter, admitNativeSelectedItemCommand } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedCharacter.ts');
const { consumeNativeFungible } = await vite.ssrLoadModule('/src/game-shell/nativeFungibleActions.ts');
const { NativeCharacterPanel } = await vite.ssrLoadModule('/src/features/NativeCharacterPanel.tsx');
const { isNativeTargetCampaignSnapshot } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/native-campaign-rules.ts');
const { tickCombatFoundation } = await vite.ssrLoadModule('/../../packages/engines/game-engine/src/combat/index.ts');
const { advanceNativeSelectedExploration, createNativeSelectedEncounterAdmission,
  admitNativeSelectedEncounter } = await vite.ssrLoadModule('/src/game-shell/nativeSelectedCombat.ts');

function createRationSession(accountId) {
  const identity = getLineageIdentityCatalog('lineage.human');
  const snapshot = createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Food legality probe',
    hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.craftsmans_child',
    continentId: 'region.kaelvar', regionId: 'region.auric_marches',
    startingSettlementId: 'settlement.stonevein', startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, accountId, {
    // Test-only entitlement. Ordinary fresh-account acquisition is a separate gate.
    appliedLegacyPreparationIds: ['legacy.unlock.preparation.storehouse_keys']
  });
  const control = createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: `artifact.${accountId}`,
    publicationId: `publication.${accountId}`, artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: `artifact.${accountId}`, headRevision: 1, sourceSnapshot: snapshot });
  return createNativeSelectedSession({ snapshot, control, sourceSlotId: 'slot-1', accountRevision: 2 });
}

function startEncounter(source) {
  let session = source;
  for (let attempt = 0; attempt < 40 && !session.snapshot.worldState.nearbyExplorationCandidate; attempt++) {
    const next = advanceNativeSelectedExploration(session);
    assert.equal(next.status, 'accepted', next.reason);
    session = next.session;
  }
  assert.ok(session.snapshot.worldState.nearbyExplorationCandidate);
  const admitted = admitNativeSelectedEncounter(session, createNativeSelectedEncounterAdmission(session));
  assert.equal(admitted.status, 'accepted', admitted.reason);
  session = admitted.session;
  assert.equal(session.snapshot.gameState.activeEncounter.state, 'active');
  return session;
}

test('ordinary food Use is blocked by both selected callers and the direct owner during active combat', () => {
  const session = startEncounter(createRationSession('account.native.food.legality'));
  const ration = readNativeSelectedCharacter(session.snapshot).fungibleStacks.find(x => x.itemId === 'item.traveler_ration');
  assert.equal(ration.canUse, false);
  assert.match(ration.useUnavailableReason, /encounter is retained/);
  const inventory = renderToStaticMarkup(React.createElement(NativeCharacterPanel, {
    snapshot: session.snapshot, mode: 'inventory', control: session.control,
    onSnapshotChange: () => {}
  }));
  assert.match(inventory, /disabled="" title="Ordinary nutrition Use is unavailable while an encounter is retained\."[^>]*>Use Traveler Ration/);
  const command = { kind: 'use', target: ration };
  const ownerRequest = { requestId: 'food.in.combat.owner',
    expectedRevision: ration.expectedRevision,
    expectedInventoryFingerprint: ration.expectedInventoryFingerprint,
    itemId: ration.itemId, itemKey: ration.itemKey,
    expectedQuantity: ration.quantity, location: ration.location };
  const before = JSON.stringify(session.snapshot);
  const owner = consumeNativeFungible(session.snapshot, ownerRequest);
  const direct = admitNativeSelectedItemCommand(session.snapshot, session.control, command, 'food.in.combat.direct');
  const wrapper = applyNativeSelectedItem(session, command, 'food.in.combat.wrapper');
  assert.deepEqual([owner.status, direct.status, wrapper.status], ['invalid', 'invalid', 'invalid']);
  assert.match(owner.reason, /encounter is retained/);
  assert.strictEqual(owner.snapshot, session.snapshot);
  assert.strictEqual(direct.snapshot, session.snapshot);
  assert.strictEqual(direct.control, session.control);
  assert.strictEqual(wrapper.session, session);
  assert.equal(JSON.stringify(session.snapshot), before);
  assert.equal(session.snapshot.nativeInventoryUse.receipts.length, 0);
  assert.equal(session.snapshot.gameState.activeEncounter.state, 'active');
  assert.equal(admitNativeSelectedItemCommand(session.snapshot, session.control, command,
    'food.in.combat.direct').status, 'invalid');
});

test('combat owner recognizes a supported paused encounter and ordinary nutrition stays unavailable', () => {
  const session = startEncounter(createRationSession('account.native.food.paused'));
  const paused = structuredClone(session.snapshot);
  paused.gameState.activeEncounter.pauseAllowed = true;
  paused.gameState.activeEncounter.paused = true;
  const tick = tickCombatFoundation(paused.gameState, paused.playerState, [], paused.clock.tick, paused.sessionState);
  assert.ok(tick.deltas.some(delta => delta.kind === 'combat' && delta.payload.state === 'paused'));
  assert.equal(paused.gameState.activeEncounter.state, 'active');
  assert.equal(isNativeTargetCampaignSnapshot(paused), true);
  const admitted = admitCampaignMutation(session.control, { mutationId: 'pause.food.encounter',
    sourceArtifactId: session.control.loadedArtifactId,
    sourceRevision: session.control.sessionRevision, ownerKind: 'engine_result', accepted: true,
    sourceSnapshot: session.snapshot, proposedSnapshot: paused,
    validateNativeSnapshot: isNativeTargetCampaignSnapshot });
  assert.equal(admitted.accepted, true, admitted.reason);
  const ration = readNativeSelectedCharacter(admitted.snapshot).fungibleStacks
    .find(x => x.itemId === 'item.traveler_ration');
  assert.equal(ration.canUse, false);
  const result = admitNativeSelectedItemCommand(admitted.snapshot, admitted.control,
    { kind: 'use', target: ration }, 'food.in.paused.encounter');
  assert.equal(result.status, 'invalid');
  assert.strictEqual(result.snapshot, admitted.snapshot);
  assert.strictEqual(result.control, admitted.control);
});

test('accepted noncombat Use replays as duplicate after combat starts; conflicts and stale requests stay blocked', () => {
  const initial = createRationSession('account.native.food.retry');
  const ration = readNativeSelectedCharacter(initial.snapshot).fungibleStacks
    .find(x => x.itemId === 'item.traveler_ration');
  assert.equal(ration.canUse, true);
  const command = { kind: 'use', target: ration };
  const requestId = 'food.before.combat';
  const accepted = applyNativeSelectedItem(initial, command, requestId);
  assert.equal(accepted.status, 'accepted', accepted.reason);
  assert.equal(accepted.session.snapshot.nativeInventoryUse.receipts.length, 1);
  assert.ok(accepted.session.snapshot.playerState.bodyState.dailyCaloriesConsumed >
    initial.snapshot.playerState.bodyState.dailyCaloriesConsumed);
  const session = startEncounter(accepted.session);
  assert.equal(readNativeSelectedCharacter(session.snapshot).fungibleStacks
    .some(x => x.itemId === 'item.traveler_ration'), false);
  const before = JSON.stringify(session.snapshot);
  const direct = admitNativeSelectedItemCommand(session.snapshot, session.control, command, requestId);
  const replay = applyNativeSelectedItem(session, command, requestId);
  const ownerRequest = { requestId,
    expectedRevision: ration.expectedRevision,
    expectedInventoryFingerprint: ration.expectedInventoryFingerprint,
    itemId: ration.itemId, itemKey: ration.itemKey,
    expectedQuantity: ration.quantity, location: ration.location };
  assert.deepEqual([direct.status, replay.status,
    consumeNativeFungible(session.snapshot, ownerRequest).status],
  ['duplicate', 'duplicate', 'duplicate']);
  assert.strictEqual(direct.snapshot, session.snapshot);
  assert.strictEqual(direct.control, session.control);
  assert.strictEqual(replay.session, session);
  assert.equal(consumeNativeFungible(session.snapshot,
    { ...ownerRequest, itemId: 'item.bread_loaf' }).status, 'invalid');
  assert.equal(admitNativeSelectedItemCommand(session.snapshot, session.control, command,
    'food.in.combat.stale').status, 'stale');
  assert.equal(JSON.stringify(session.snapshot), before);
});

test('pending defeat is rejected by common campaign admission despite direct panel bridge', () => {
  const identity = getLineageIdentityCatalog('lineage.human');
  const snapshot = createNativeNewGameSnapshot({
    ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'Pending food probe',
    hairColorId: identity.hairColorOptions[0].id, eyeColorId: identity.eyeColorOptions[0].id,
    skinToneId: identity.skinToneOptions[0].id, backstoryId: 'backstory.craftsmans_child',
    continentId: 'region.kaelvar', regionId: 'region.auric_marches',
    startingSettlementId: 'settlement.stonevein', startingBundleId: 'starting_bundle.hunter',
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter')
  }, 'account.native.food.pending', {
    appliedLegacyPreparationIds: ['legacy.unlock.preparation.storehouse_keys']
  });
  const control = createCampaignSessionControl({ accountId: snapshot.accountId,
    campaignId: snapshot.campaignIdentity.campaignId, artifactId: 'artifact.pending.food',
    publicationId: 'publication.pending.food', artifactRevision: 1,
    continuityId: snapshot.campaignIdentity.continuityId,
    headArtifactId: 'artifact.pending.food', headRevision: 1, sourceSnapshot: snapshot });
  const unsafe = structuredClone(snapshot);
  unsafe.playerState.location.settlementId = null;
  unsafe.playerState.flags = unsafe.playerState.flags.filter(x => !x.startsWith('player.start.'));
  unsafe.sessionState.knownLocations = [{ id: 'location.recovery_haven', name: 'Recovery Haven',
    regionLabel: 'Test March', settlementId: 'settlement.recovery_haven',
    regionId: 'region.test_march', type: 'settlement', x: 1, y: 1,
    note: 'Synthetic recovery destination.', known: true }];
  const staged = admitCampaignMutation(control, { mutationId: 'prepare.pending.food',
    sourceArtifactId: control.loadedArtifactId, sourceRevision: control.sessionRevision,
    ownerKind: 'engine_result', accepted: true, sourceSnapshot: snapshot,
    proposedSnapshot: unsafe,
    validateNativeSnapshot: x => x?.snapshotVersion === 'lineage.save_snapshot.v3' });
  assert.equal(staged.accepted, true, staged.reason);
  const lethal = structuredClone(staged.snapshot);
  lethal.playerState.resources.hp.current = 0;
  const defeated = admitCampaignMutation(staged.control, { mutationId: 'lethal.pending.food',
    sourceArtifactId: staged.control.loadedArtifactId, sourceRevision: staged.control.sessionRevision,
    ownerKind: 'engine_result', accepted: true, sourceSnapshot: staged.snapshot,
    proposedSnapshot: lethal,
    validateNativeSnapshot: x => x?.snapshotVersion === 'lineage.save_snapshot.v3' });
  assert.equal(defeated.accepted, true, defeated.reason);
  assert.ok(defeated.snapshot.normalDefeatReceipts.some(x => x.posture === 'recovery_pending'));
  const ration = readNativeSelectedCharacter(defeated.snapshot).fungibleStacks.find(x => x.itemId === 'item.traveler_ration');
  assert.equal(ration.canUse, false);
  assert.match(ration.useUnavailableReason, /pending defeat/i);
  const unsupported = readNativeSelectedCharacter(defeated.snapshot).fungibleStacks
    .find(x => x.itemId === 'item.arrow_bundle');
  assert.equal(unsupported.canUse, false);
  assert.equal(unsupported.useUnavailableReason, 'No authored consumable effect.');
  const inventory = renderToStaticMarkup(React.createElement(NativeCharacterPanel, {
    snapshot: defeated.snapshot, mode: 'inventory', control: defeated.control,
    onSnapshotChange: () => {}
  }));
  assert.match(inventory, /disabled="" title="Pending defeat requires recovery before item actions\."[^>]*>Use Traveler Ration/);
  assert.match(inventory, /Pending defeat requires recovery before item actions\./);
  const command = { kind: 'use', target: ration };
  const direct = admitNativeSelectedItemCommand(defeated.snapshot, defeated.control, command,
    'food.pending.direct');
  const selected = createNativeSelectedSession({ snapshot: defeated.snapshot,
    control: defeated.control, sourceSlotId: 'slot-1', accountRevision: 2 });
  const wrapper = applyNativeSelectedItem(selected, command, 'food.pending.wrapper');
  assert.equal(direct.status, 'rejected');
  assert.equal(direct.reason, 'recovery_pending');
  assert.strictEqual(direct.snapshot, defeated.snapshot);
  assert.strictEqual(direct.control, defeated.control);
  assert.equal(wrapper.status, 'rejected');
  assert.strictEqual(wrapper.session, selected);
});
