import React from 'react';
import { createRoot } from 'react-dom/client';
import { EpochApp } from './EpochApp.js';
import { CleanEpochAccountAdapter } from './game-shell/cleanEpochAccountAdapter.js';
import { openCleanEpochAccountStore } from './game-shell/cleanEpochAccountStore.js';
import { CleanEpochFirstCampaignAdapter } from './game-shell/cleanEpochFirstCampaignAdapter.js';
import { createDefaultCharacterCreationFormState } from './game-shell/characterCreationForm.js';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './game-shell/characterCreationCatalog.js';
import { getDefaultWorldSelection } from './game-shell/worldSelectionCatalog.js';
import { applyNativeSelectedItem, createNativeSelectedSession,
  saveNativeSelectedSession } from './game-shell/nativeSelectedSession.js';
import './index.css';

async function seed() {
  let owner = await openCleanEpochAccountStore();
  try {
    const accountId = `account.native.selected.qa.${crypto.randomUUID()}`;
    const registered = await new CleanEpochAccountAdapter(owner).register({ accountId,
      displayName: 'Native Selected QA', password: 'synthetic-only-password',
      confirmPassword: 'synthetic-only-password', stayLoggedIn: true });
    if (registered.status !== 'ready') throw new Error(registered.message);
    const identity = getLineageIdentityCatalog('lineage.human');
    const world = getDefaultWorldSelection('backstory.local');
    if (!identity?.hairColorOptions[0] || !identity.eyeColorOptions[0] || !identity.skinToneOptions[0])
      throw new Error('Synthetic creator identity is incomplete.');
    const form = { ...createDefaultCharacterCreationFormState('slot-1'),
      playerName: 'Native EpochApp Hunter', hairColorId: identity.hairColorOptions[0].id,
      eyeColorId: identity.eyeColorOptions[0].id, skinToneId: identity.skinToneOptions[0].id,
      backstoryId: 'backstory.local', continentId: world.continentId,
      regionId: world.regionId, startingSettlementId: world.settlementId,
      startingBundleId: 'starting_bundle.hunter',
      startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter') };
    const started = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, form);
    if (started.status !== 'ready') throw new Error(started.message);
    if (new URLSearchParams(location.search).has('host')) {
      const account = await owner.readSelected(accountId);
      if (!account) throw new Error('Synthetic account readback is missing.');
      const selected = createNativeSelectedSession({ snapshot: started.value.loaded.snapshot,
        control: started.value.loaded.sessionControl, sourceSlotId: 'slot-1',
        accountRevision: account.revision });
      const bow = selected.snapshot.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
      if (!bow) throw new Error('Synthetic native Hunter has no physical Short Bow.');
      const moved = applyNativeSelectedItem(selected, { kind: 'gear',
        expectedRevision: selected.snapshot.playerState.gear.revision,
        itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } },
        'native.selected.host.qa.bow');
      if (moved.status !== 'accepted') throw new Error(`Native host action was ${moved.status}.`);
      const duplicate = applyNativeSelectedItem(moved.session, { kind: 'gear',
        expectedRevision: selected.snapshot.playerState.gear.revision,
        itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } },
        'native.selected.host.qa.bow');
      const stale = applyNativeSelectedItem(moved.session, { kind: 'gear',
        expectedRevision: selected.snapshot.playerState.gear.revision,
        itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } },
        'native.selected.host.qa.stale');
      if (duplicate.status !== 'duplicate' || duplicate.session !== moved.session ||
          stale.status !== 'stale' || stale.session !== moved.session)
        throw new Error('Native host duplicate or stale request changed the selected pair.');
      const staleSave = await saveNativeSelectedSession(owner,
        { ...moved.session, accountRevision: account.revision - 1 }, 'slot-1');
      if (staleSave.status !== 'blocked' || staleSave.session.snapshot !== moved.session.snapshot ||
          (await owner.readSelected(accountId))?.revision !== account.revision)
        throw new Error('Stale account Save changed retained authority.');
      const saved = await saveNativeSelectedSession(owner, moved.session, 'slot-1');
      if (saved.status !== 'ready') throw new Error(`Native host Save was blocked: ${saved.message}`);
      const repeated = await saveNativeSelectedSession(owner, moved.session, 'slot-1');
      if (repeated.status !== 'blocked' || repeated.session !== moved.session ||
          (await owner.readSelected(accountId))?.revision !== saved.session.accountRevision)
        throw new Error('Duplicate native host Save republished or changed retained authority.');
      owner.close(); owner = await openCleanEpochAccountStore();
      const restarted = await owner.readSlot(accountId, 'slot-1');
      if (restarted.status !== 'ready') throw new Error('Native host Save did not restart.');
      const reopened = createNativeSelectedSession({ snapshot: restarted.loaded.snapshot,
        control: restarted.loaded.sessionControl, sourceSlotId: 'slot-1',
        accountRevision: (await owner.readSelected(accountId))!.revision });
      const retainedBow = reopened.snapshot.playerState.gear.instances.find(item => item.itemInstanceId === bow.itemInstanceId);
      if (retainedBow?.location.kind !== 'bag' || retainedBow.durability !== bow.durability ||
          saved.publicationId !== reopened.sourceAddress.publicationId)
        throw new Error('Native host Save/restart changed bow identity, durability, location or publication.');
      document.body.dataset.host = 'pass';
      document.body.dataset.bowInstanceId = bow.itemInstanceId;
      document.body.dataset.publicationId = saved.publicationId;
    }
    document.body.dataset.seeded = 'true';
    createRoot(document.getElementById('root')!).render(<EpochApp />);
  } finally { owner.close(); }
}

if (new URLSearchParams(location.search).has('resume')) {
  document.body.dataset.seeded = 'resume';
  createRoot(document.getElementById('root')!).render(<EpochApp />);
} else seed().catch(error => {
  document.body.dataset.seeded = 'error';
  document.getElementById('root')!.textContent = error instanceof Error ? error.message : String(error);
});
