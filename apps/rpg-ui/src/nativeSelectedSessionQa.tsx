import React from 'react';
import { createRoot } from 'react-dom/client';
import { isNativeTargetCampaignSnapshot } from '../../../packages/engines/game-engine/src/native-campaign-rules.js';
import type { CampaignSessionControl } from '../../../packages/engines/game-engine/src/campaign-session.js';
import { EpochApp } from './EpochApp.js';
import { CleanEpochAccountAdapter } from './game-shell/cleanEpochAccountAdapter.js';
import { openCleanEpochAccountStore } from './game-shell/cleanEpochAccountStore.js';
import { CleanEpochFirstCampaignAdapter } from './game-shell/cleanEpochFirstCampaignAdapter.js';
import { CleanEpochDescendantAdapter } from './game-shell/cleanEpochDescendantAdapter.js';
import { CleanEpochTerminalAdapter } from './game-shell/cleanEpochTerminalAdapter.js';
import { createDefaultCharacterCreationFormState } from './game-shell/characterCreationForm.js';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './game-shell/characterCreationCatalog.js';
import { getDefaultWorldSelection } from './game-shell/worldSelectionCatalog.js';
import { applyNativeSelectedItem, createNativeSelectedSession,
  saveNativeSelectedSession } from './game-shell/nativeSelectedSession.js';
import { createNativeSelectedQuestCommand, applyNativeSelectedQuest,
  createNativeSelectedTravelCommand, applyNativeSelectedTravel,
  advanceNativeSelectedSurvey } from './game-shell/nativeSelectedGameplay.js';
import { advanceNativeSelectedExploration, createNativeSelectedEncounterAdmission,
  admitNativeSelectedEncounter, createNativeSelectedCombatStep,
  applyNativeSelectedCombatStep } from './game-shell/nativeSelectedCombat.js';
import { retireNativeSelectedSession, resumeNativeSelectedTerminal } from './game-shell/nativeSelectedTerminal.js';
import './index.css';

async function seed() {
  let owner = await openCleanEpochAccountStore();
  try {
    const gameplay = new URLSearchParams(location.search).has('gameplay');
    const combat = new URLSearchParams(location.search).has('combat');
    const terminal = new URLSearchParams(location.search).has('terminal');
    const accountId = `account.native.selected.qa.${crypto.randomUUID()}`;
    const registered = await new CleanEpochAccountAdapter(owner).register({ accountId,
      displayName: 'Native Selected QA', password: 'synthetic-only-password',
      confirmPassword: 'synthetic-only-password', stayLoggedIn: true });
    if (registered.status !== 'ready') throw new Error(registered.message);
    const identity = getLineageIdentityCatalog('lineage.human');
    const world = combat ? { continentId: 'region.kaelvar', regionId: 'region.auric_marches',
      settlementId: 'settlement.stonevein' } : gameplay ? {
      continentId: 'region.myridian_chain', regionId: 'region.starfall_isle',
      settlementId: 'settlement.starfall_port' } : getDefaultWorldSelection('backstory.local');
    if (!identity?.hairColorOptions[0] || !identity.eyeColorOptions[0] || !identity.skinToneOptions[0])
      throw new Error('Synthetic creator identity is incomplete.');
    const form = { ...createDefaultCharacterCreationFormState('slot-1'),
      playerName: 'Native EpochApp Hunter', hairColorId: identity.hairColorOptions[0].id,
      eyeColorId: identity.eyeColorOptions[0].id, skinToneId: identity.skinToneOptions[0].id,
      backstoryId: gameplay || combat ? 'backstory.craftsmans_child' : 'backstory.local', continentId: world.continentId,
      regionId: world.regionId, startingSettlementId: world.settlementId,
      startingBundleId: 'starting_bundle.hunter',
      startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter') };
    const started = await new CleanEpochFirstCampaignAdapter(owner, 'native_v3').start(accountId, form);
    if (started.status !== 'ready') throw new Error(started.message);
    if (terminal) Object.assign(window, { runNativeTerminalQa: async () => {
      let qaOwner = await openCleanEpochAccountStore();
      try {
        const source = await qaOwner.readSlot(accountId, 'slot-1');
        const account = await qaOwner.readSelected(accountId);
        if (source.status !== 'ready' || !account) throw new Error('Selected native source was not retained.');
        const first = createNativeSelectedSession({ snapshot: source.loaded.snapshot,
          control: source.loaded.sessionControl, sourceSlotId: 'slot-1',
          accountRevision: account.revision });
        const bow = first.snapshot.playerState.gear.instances.find(item => item.itemId === 'item.short_bow');
        if (!bow) throw new Error('Starter bow instance is missing.');
        const moved = applyNativeSelectedItem(first, { kind: 'gear',
          expectedRevision: first.snapshot.playerState.gear.revision,
          itemInstanceId: bow.itemInstanceId, destination: { kind: 'carried' } },
        'native.terminal.qa.bow.1');
        if (moved.status !== 'accepted') throw new Error(`Terminal item move was ${moved.status}.`);
        const mismatchedRetirement = await new CleanEpochTerminalAdapter(qaOwner).retire({
          accountId, sourceSlotId: 'slot-1', expectedAccountRevision: account.revision,
          snapshot: first.snapshot, control: moved.session.control as unknown as CampaignSessionControl,
          expectedSourceAddress: first.sourceAddress });
        if (mismatchedRetirement.status !== 'blocked' ||
            (await qaOwner.readSelected(accountId))?.revision !== account.revision ||
            (await qaOwner.readSlot(accountId, 'slot-1')).status !== 'ready')
          throw new Error('Stale native retirement pair published or changed the account.');
        const saved = await saveNativeSelectedSession(qaOwner, moved.session, 'slot-1');
        if (saved.status !== 'ready') throw new Error(`Terminal source Save blocked: ${saved.message}`);
        const gear = JSON.stringify(saved.session.snapshot.playerState.gear);
        const stale = await retireNativeSelectedSession(qaOwner, first);
        if (stale.status !== 'blocked' || (await qaOwner.readSlot(accountId, 'slot-1')).status !== 'ready')
          throw new Error('Stale terminal source changed the retained campaign.');
        qaOwner.close();
        qaOwner = await openCleanEpochAccountStore();
        const restarted = await qaOwner.readSlot(accountId, 'slot-1');
        const restartedSnapshot: unknown = restarted.status === 'ready' ? restarted.loaded.snapshot : null;
        if (restarted.status !== 'ready' || !isNativeTargetCampaignSnapshot(restartedSnapshot) ||
            JSON.stringify(restartedSnapshot.playerState.gear) !== gear ||
            restarted.loaded.publication.publicationId !== saved.publicationId)
          throw new Error('Terminal source Save/restart changed physical gear or publication.');
        qaOwner.close();
        let writes = 0;
        qaOwner = await openCleanEpochAccountStore({ afterWrite: tx => { if (++writes === 5) tx.abort(); } });
        const interrupted = await retireNativeSelectedSession(qaOwner, saved.session);
        const pending = await qaOwner.readPendingTerminalForAccount(accountId);
        if (interrupted.status !== 'blocked' || !interrupted.requiresReload ||
            pending?.status !== 'accepted_pending_settlement' ||
            pending.sourcePublicationId !== saved.publicationId ||
            (await qaOwner.readSlot(accountId, 'slot-1')).status !== 'closed')
          throw new Error('Interrupted terminal publication lost the accepted pending source.');
        qaOwner.close();
        qaOwner = await openCleanEpochAccountStore();
        const completed = await resumeNativeSelectedTerminal(qaOwner, saved.session);
        if (completed.status !== 'completed' ||
            completed.recovery.publicationId !== pending.publicationId ||
            JSON.stringify(JSON.parse(JSON.parse(completed.recovery.envelopeRaw).snapshot).playerState.gear) !== gear ||
            completed.account.profile.history.runRecords[0]?.archiveReason !== 'retired')
          throw new Error('Terminal restart failed to settle the exact physical source.');
        const duplicate = await retireNativeSelectedSession(qaOwner, saved.session);
        const changed = await retireNativeSelectedSession(qaOwner,
          { ...saved.session, accountRevision: saved.session.accountRevision + 1 });
        if (duplicate.status !== 'completed' ||
            duplicate.recovery.publicationId !== completed.recovery.publicationId ||
            changed.status !== 'blocked')
          throw new Error('Terminal retry minted another publication or accepted a changed source.');
        qaOwner.close();
        qaOwner = await openCleanEpochAccountStore();
        const retained = await qaOwner.readTerminalForSource(accountId,
          saved.session.control.campaignId, saved.publicationId);
        if (retained?.status !== 'settlement_completed' ||
            retained.publicationId !== completed.recovery.publicationId ||
            (await qaOwner.readSlot(accountId, 'slot-1')).status !== 'closed' ||
            (await qaOwner.readSelected(accountId))?.profile.history.runRecords.length !== 1)
          throw new Error('Terminal account history or exact publication was lost after restart.');
        document.body.dataset.terminal = 'pass';
        document.body.dataset.terminalPublicationId = retained.publicationId;
        document.body.dataset.terminalBowId = bow.itemInstanceId;
      } finally { qaOwner.close(); }
    } });
    if (combat) {
      const account = await owner.readSelected(accountId);
      if (!account) throw new Error('Native combat account is missing.');
      let session = createNativeSelectedSession({ snapshot: started.value.loaded.snapshot,
        control: started.value.loaded.sessionControl, sourceSlotId: 'slot-1',
        accountRevision: account.revision });
      const originalGear = JSON.stringify(session.snapshot.playerState.gear);
      for (let attempt = 0; attempt < 40 && !session.snapshot.worldState.nearbyExplorationCandidate; attempt++) {
        const explored = advanceNativeSelectedExploration(session);
        if (explored.status !== 'accepted') throw new Error(`Native exploration was ${explored.status}: ${explored.reason}`);
        session = explored.session;
      }
      const command = createNativeSelectedEncounterAdmission(session);
      if (!command) throw new Error('Ordinary exploration did not produce an authored encounter.');
      const admitted = admitNativeSelectedEncounter(session, command);
      if (admitted.status !== 'accepted') throw new Error(`Native encounter was ${admitted.status}: ${admitted.reason}`);
      session = admitted.session;
      const player = session.snapshot.gameState.activeEncounter?.combatants.find(item => item.kind === 'player');
      if (!player?.hooks.itemIds.includes('item.short_bow') || player.equipment.mainHandItemId !== 'item.short_bow')
        throw new Error('Native combat missed the owner-backed worn Short Bow.');
      for (let beat = 1; beat < 300 && session.snapshot.gameState.activeEncounter; beat++) {
        const step = createNativeSelectedCombatStep(session, 'combat.advance', null, `native.qa.combat.${beat}`);
        if (!step) throw new Error('Active native encounter has no player step.');
        const advanced = applyNativeSelectedCombatStep(session, step);
        if (advanced.status !== 'accepted') throw new Error(`Native combat was ${advanced.status}: ${advanced.reason}`);
        session = advanced.session;
        if (JSON.stringify(session.snapshot.playerState.gear) !== originalGear)
          throw new Error('Native combat changed the physical gear graph.');
      }
      if (session.snapshot.gameState.combatHistory[session.snapshot.gameState.combatHistory.length - 1]?.result !== 'enemies_victorious' ||
          session.snapshot.normalDefeatReceipts?.length !== 1 ||
          session.snapshot.normalDefeatReceipts[0]?.posture !== 'playable')
        throw new Error('Ordinary combat did not produce the expected safe-settlement defeat.');
      const priorHead = started.value.loaded.publication.publicationId;
      owner.close(); let writes = 0;
      owner = await openCleanEpochAccountStore({ afterWrite: tx => { if (++writes === 1) tx.abort(); } });
      const interrupted = await saveNativeSelectedSession(owner, session, 'slot-1');
      if (interrupted.status !== 'blocked' || interrupted.session !== session)
        throw new Error('Interrupted combat Save changed the selected pair.');
      owner.close(); owner = await openCleanEpochAccountStore();
      const stillPrior = await owner.readSlot(accountId, 'slot-1');
      if (stillPrior.status !== 'ready' || stillPrior.loaded.publication.publicationId !== priorHead)
        throw new Error('Interrupted combat Save changed the retained account head.');
      const saved = await saveNativeSelectedSession(owner, session, 'slot-1');
      if (saved.status !== 'ready') throw new Error(`Native combat Save blocked: ${saved.message}`);
      owner.close(); owner = await openCleanEpochAccountStore();
      const restarted = await owner.readSlot(accountId, 'slot-1');
      const restartedSnapshot: unknown = restarted.status === 'ready' ? restarted.loaded.snapshot : null;
      if (restarted.status !== 'ready' || !isNativeTargetCampaignSnapshot(restartedSnapshot) ||
          restarted.loaded.publication.publicationId !== saved.publicationId ||
          JSON.stringify(restartedSnapshot.playerState.gear) !== originalGear ||
          restartedSnapshot.gameState.combatHistory[restartedSnapshot.gameState.combatHistory.length - 1]?.result !== 'enemies_victorious' ||
          restartedSnapshot.normalDefeatReceipts?.[0]?.posture !== 'playable')
        throw new Error('Native combat Save/restart lost gear, history or defeat receipt.');
      document.body.dataset.combat = 'pass';
      document.body.dataset.publicationId = saved.publicationId;
      document.body.dataset.gearIds = session.snapshot.playerState.gear.instances.map(item => item.itemInstanceId).join(',');
    }
    if (gameplay) {
      const selected = await owner.readSelected(accountId);
      if (!selected) throw new Error('Native selected account is missing.');
      let session = createNativeSelectedSession({ snapshot: started.value.loaded.snapshot,
        control: started.value.loaded.sessionControl, sourceSlotId: 'slot-1',
        accountRevision: selected.revision });
      const originalGear = JSON.stringify(session.snapshot.playerState.gear);
      const quest = applyNativeSelectedQuest(session,
        createNativeSelectedQuestCommand(session, 'quest.ashen_reef_survey'));
      if (quest.status !== 'accepted') throw new Error(`Native quest was ${quest.status}: ${quest.reason}`);
      session = quest.session;
      const travel = applyNativeSelectedTravel(session,
        createNativeSelectedTravelCommand(session, 'location.ashen_reef'));
      if (travel.status !== 'accepted') throw new Error(`Native travel was ${travel.status}: ${travel.reason}`);
      session = travel.session;
      if (JSON.stringify(session.snapshot.playerState.gear) !== originalGear)
        throw new Error('Quest or travel changed physical gear.');
      const reached = await saveNativeSelectedSession(owner, session, 'slot-1');
      if (reached.status !== 'ready') throw new Error(`Native travel Save blocked: ${reached.message}`);
      session = reached.session;
      const stages = ['sector_1', 'sector_2', 'sector_3', 'ruins_confirmation'];
      for (let index = 0; index < stages.length; index += 1) {
        const prior = session;
        const requestId = `survey_request.12345678-1234-4123-8123-123456789ab${index}`;
        const shift = await advanceNativeSelectedSurvey(owner, session, requestId);
        if (shift.status !== 'accepted' || shift.stage !== stages[index])
          throw new Error(`Native ${stages[index]} was ${shift.status}: ${shift.reason}`);
        const result = shift.session.snapshot.nativeSurvey?.results[index];
        const receipt = shift.session.snapshot.nativeSurvey?.receipts[index];
        if (!result || !receipt || result.stage !== stages[index] ||
            receipt.sourceArtifactId !== prior.sourceAddress.artifactId ||
            receipt.sourcePublicationId !== prior.sourceAddress.publicationId ||
            JSON.stringify(result.sourceWitness.ownerInputs.worn) !==
              JSON.stringify(prior.snapshot.playerState.gear.instances.filter(item => item.location.kind === 'worn')))
          throw new Error(`Native ${stages[index]} witness lost exact physical source provenance.`);
        const duplicate = await advanceNativeSelectedSurvey(owner, shift.session, requestId);
        if (duplicate.status !== 'duplicate' || duplicate.session !== shift.session)
          throw new Error('Native survey duplicate request changed the selected pair.');
        if (JSON.stringify(shift.session.snapshot.playerState.gear) !== originalGear)
          throw new Error(`Native ${stages[index]} changed physical gear.`);
        session = shift.session;
        if (index === 1) {
          owner.close();
          let writes = 0;
          owner = await openCleanEpochAccountStore({ afterWrite: tx => { if (++writes === 1) tx.abort(); } });
          const interrupted = await saveNativeSelectedSession(owner, session, 'slot-1');
          if (interrupted.status !== 'blocked' || interrupted.session !== session)
            throw new Error('Interrupted survey publication changed the caller pair.');
          owner.close(); owner = await openCleanEpochAccountStore();
          const retained = await owner.readSlot(accountId, 'slot-1');
          if (retained.status !== 'ready' ||
              retained.loaded.publication.publicationId !== prior.sourceAddress.publicationId ||
              (await owner.readSelected(accountId))?.revision !== prior.accountRevision)
            throw new Error('Interrupted survey publication changed the retained head.');
        }
        const saved = await saveNativeSelectedSession(owner, session, 'slot-1');
        if (saved.status !== 'ready') throw new Error(`Native ${stages[index]} Save blocked: ${saved.message}`);
        session = saved.session;
        const stale = await advanceNativeSelectedSurvey(owner, prior,
          `survey_request.22345678-1234-4123-8123-123456789ab${index}`);
        if (stale.status !== 'stale' || stale.session !== prior)
          throw new Error('Stale native survey request changed the selected pair.');
      }
      owner.close(); owner = await openCleanEpochAccountStore();
      const restarted = await owner.readSlot(accountId, 'slot-1');
      const restartedSnapshot: unknown = restarted.status === 'ready' ? restarted.loaded.snapshot : null;
      if (restarted.status !== 'ready' ||
          !isNativeTargetCampaignSnapshot(restartedSnapshot) ||
          restartedSnapshot.nativeSurvey?.results.length !== 4 ||
          JSON.stringify(restartedSnapshot.playerState.gear) !== originalGear ||
          restarted.loaded.publication.publicationId !== session.sourceAddress.publicationId)
        throw new Error('Native four-stage survey Save/restart changed retained evidence or gear.');
      const resumed = await new CleanEpochDescendantAdapter(owner).resumeCurrent(accountId, 'slot-1');
      if (resumed.status !== 'blocked') throw new Error('Completed native publication has a pending recovery.');
      document.body.dataset.gameplay = 'pass';
      document.body.dataset.surveyCount = '4';
      document.body.dataset.publicationId = session.sourceAddress.publicationId;
      document.body.dataset.gearIds = session.snapshot.playerState.gear.instances.map(item => item.itemInstanceId).join(',');
    }
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
      const mismatched = { ...selected, control: moved.session.control };
      const directStaleSave = await new CleanEpochDescendantAdapter(owner).save({
        accountId, sourceSlotId: 'slot-1', destinationSlotId: 'slot-1',
        expectedAccountRevision: account.revision, expectedDestinationAddress: selected.sourceAddress,
        snapshot: mismatched.snapshot, control: mismatched.control
      });
      const hostStaleSave = await saveNativeSelectedSession(owner, mismatched, 'slot-1');
      if (directStaleSave.status !== 'blocked' || hostStaleSave.status !== 'blocked' ||
          !hostStaleSave.requiresReload ||
          (await owner.readSelected(accountId))?.revision !== account.revision ||
          (await owner.readSlot(accountId, 'slot-1')).status !== 'ready')
        throw new Error('Stale native snapshot/control pair published or changed the retained head.');
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
