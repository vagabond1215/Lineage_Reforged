import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { openCleanEpochAccountStore, type CleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { getLineageIdentityCatalog, startingBundleOptions, createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions, getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';

const screen = document.querySelector<HTMLPreElement>('#audit')!;
const phase = new URL(location.href).searchParams.get('phase') ?? 'publication';
const dbName = `lineage.g9.completion.terminal.${crypto.randomUUID()}`;
const password = 'synthetic-terminal-audit-password';
const families = ['accounts', 'accountLifecycle', 'newCampaignAttempts', 'pendingPublicationRecoveries',
  'descendantPublicationRecoveries', 'terminalLifecycleRecoveries', 'campaignAttemptsV6',
  'firstPublicationRecoveriesV6', 'currentSlotGenerations', 'addressDeletionReceipts',
  'artifacts', 'controls', 'slots', 'witnesses'];
let assertions = 0;
const cases: string[] = [];
function check(value: unknown, message: string): asserts value { assertions++; if (!value) throw Error(message); }
function mark(label: string) { cases.push(label); screen.textContent = `RUNNING ${label} (${assertions})`; }
function form() {
  const initial = createDefaultCharacterCreationFormState('slot-1');
  const identity = getLineageIdentityCatalog(initial.lineageId)!;
  const bundle = startingBundleOptions[0]!;
  const continent = getWorldContinentOptions()[0]!;
  const region = getWorldRegionOptions(continent.id)[0]!;
  const settlement = getWorldSettlementOptions({ continentId: continent.id, regionId: region.id,
    backstoryId: '' })[0]!;
  return { ...initial, playerName: `Terminal ${crypto.randomUUID().slice(0, 6)}`,
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle.id,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle.id),
    continentId: continent.id, regionId: region.id, startingSettlementId: settlement.id };
}
async function bytes(accountId: string) {
  const opening = indexedDB.open(dbName);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    opening.onsuccess = () => resolve(opening.result); opening.onerror = () => reject(opening.error);
  });
  try {
    const rows = [];
    for (const name of families) {
      const query = db.transaction(name).objectStore(name).getAll();
      const found = await new Promise<Record<string, unknown>[]>((resolve, reject) => {
        query.onsuccess = () => resolve(query.result as Record<string, unknown>[]);
        query.onerror = () => reject(query.error);
      });
      rows.push([name, found.filter(row => row.accountId === accountId)]);
    }
    return JSON.stringify(rows);
  } finally { db.close(); }
}
async function changeTerminalRow(accountId: string, campaignId: string, publicationId: string,
  change: (row: Record<string, unknown>) => Record<string, unknown>) {
  const opening = indexedDB.open(dbName);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    opening.onsuccess = () => resolve(opening.result); opening.onerror = () => reject(opening.error);
  });
  try {
    const tx = db.transaction('terminalLifecycleRecoveries', 'readwrite');
    const store = tx.objectStore('terminalLifecycleRecoveries');
    const key = [accountId, campaignId, publicationId];
    const get = store.get(key);
    const row = await new Promise<Record<string, unknown>>((resolve, reject) => {
      get.onsuccess = () => resolve(get.result as Record<string, unknown>);
      get.onerror = () => reject(get.error);
    });
    check(!!row, 'terminal row missing for corruption control');
    const put = store.put(change(row));
    await new Promise((resolve, reject) => {
      put.onsuccess = () => resolve(put.result);
      put.onerror = () => reject(put.error);
    });
  } finally { db.close(); }
}
async function setup(owner: CleanEpochAccountStore, twoAddresses = false) {
  const accountId = `account.local.g9.terminal.${crypto.randomUUID()}`;
  const registration = await new CleanEpochAccountAdapter(owner).register({ accountId,
    displayName: 'Synthetic terminal account', password, confirmPassword: password, stayLoggedIn: false });
  check(registration.status === 'ready', 'terminal registration');
  const started = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form(), false);
  check(started.status === 'ready', `terminal first campaign ${JSON.stringify(started)}`);
  if (twoAddresses) {
    const current = (await owner.read(accountId))!;
    const second = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'slot-1', destinationSlotId: 'slot-2', expectedDestinationAddress: null,
      expectedAccountRevision: current.revision, snapshot: started.value.loaded.snapshot,
      control: started.value.loaded.sessionControl });
    check(second.status === 'ready', `second address ${JSON.stringify(second)}`);
  }
  const sourceSlotId = twoAddresses ? 'slot-2' as const : 'slot-1' as const;
  const loaded = await owner.readSlot(accountId, sourceSlotId);
  check(loaded.status === 'ready', 'terminal source slot ready');
  const control = loaded.loaded.sessionControl;
  const account = (await owner.read(accountId))!;
  return { accountId, account,
    request: { accountId, sourceSlotId, expectedAccountRevision: account.revision,
      snapshot: loaded.loaded.snapshot, control,
      expectedSourceAddress: { artifactId: control.loadedArtifactId,
        publicationId: control.loadedPublicationId } } };
}
function inspectSettlement(result: Extract<Awaited<ReturnType<CleanEpochTerminalAdapter['retire']>>, { status: 'completed' }>) {
  const { account, recovery } = result;
  const run = account.profile.history.runRecords.find(item => item.characterId === recovery.characterId);
  check(recovery.status === 'settlement_completed' && recovery.completedAccountRevision === account.revision,
    'terminal recovery/account settlement mismatch');
  check(run?.outcome === 'archived' && run.archiveReason === 'retired' &&
    run.legacyPayoutResolvedAt === recovery.createdAt, 'retirement archive/payout missing');
  check(account.profile.estate.deposits.filter(item => item.depositId === recovery.estateDepositId &&
    item.sourceRunId === recovery.estateSourceRunId).length === 1, 'estate deposit not unique');
  check((account.profile.campaignPublicationReceipts ?? []).filter(item =>
    item.publicationId === recovery.publicationId).length === 6, 'six settlement receipts missing');
  check(recovery.payoutTransactionId === null || account.profile.legacy.legacyTransactions.filter(item =>
    item.id === recovery.payoutTransactionId).length === 1, 'Legacy payout transaction duplicated');
}
async function run() {
  const owner = await openCleanEpochAccountStore({ name: dbName });
  const otherId = `account.local.g9.terminal.other.${crypto.randomUUID()}`;
  try {
    const other = await new CleanEpochAccountAdapter(owner).register({ accountId: otherId,
      displayName: 'Synthetic other terminal account', password, confirmPassword: password, stayLoggedIn: false });
    check(other.status === 'ready', 'other account setup');
    const otherBefore = await bytes(otherId);
    if (phase === 'publication') {
      mark('count production terminal writes and verify settlement fields');
      const source = await setup(owner);
      let total = 0;
      const counter = await openCleanEpochAccountStore({ name: dbName, beforeWrite: () => { total++; } });
      const completed = await new CleanEpochTerminalAdapter(counter).retire(source.request);
      check(completed.status === 'completed', `baseline terminal ${JSON.stringify(completed)}`);
      inspectSettlement(completed);
      check((await owner.readSlot(source.accountId, 'slot-1')).status === 'closed', 'closed terminal head absent');
      check(total >= 4, `unexpected terminal write count ${total}`);
      counter.close();
      for (const fault of ['abort', 'quota'] as const)
        for (let position = 1; position <= total; position++) {
          mark(`terminal ${fault} write ${position}/${total}`);
          const subject = await setup(owner);
          const before = await bytes(subject.accountId);
          let writes = 0;
          const disrupted = await openCleanEpochAccountStore({ name: dbName, beforeWrite: tx => {
            if (++writes !== position) return;
            if (fault === 'abort') tx.abort();
            else throw new DOMException('Synthetic quota', 'QuotaExceededError');
          } });
          const failed = await new CleanEpochTerminalAdapter(disrupted).retire(subject.request);
          check(failed.status === 'blocked', `terminal ${fault} ${position} did not block`);
          disrupted.close();
          const pending = await owner.readPendingTerminalForAccount(subject.accountId);
          if (pending) {
            check(pending.status === 'accepted_pending_settlement' &&
              (await owner.read(subject.accountId))!.revision === subject.account.revision,
              'pending terminal mutated account before settlement');
            check((await owner.readSlot(subject.accountId, 'slot-1')).status === 'closed',
              'accepted terminal did not close head');
          } else check(await bytes(subject.accountId) === before,
            'failed publication changed source bytes');
          const reopened = await openCleanEpochAccountStore({ name: dbName });
          const retry = pending ? await new CleanEpochTerminalAdapter(reopened).resumePending(subject.accountId) :
            await new CleanEpochTerminalAdapter(reopened).retire(subject.request);
          check(retry?.status === 'completed', `terminal ${fault} ${position} restart retry failed`);
          inspectSettlement(retry);
          if (pending) check(retry.recovery.publicationId === pending.publicationId,
            'pending terminal retry replaced publication');
          reopened.close();
          check(await bytes(otherId) === otherBefore, 'fault case mutated other account');
        }
      mark('terminal lost committed readback and two-owner exact retry');
      const lost = await setup(owner);
      const unreliable = await openCleanEpochAccountStore({ name: dbName });
      const original = unreliable.readTerminalRecovery.bind(unreliable);
      let vanished = false;
      unreliable.readTerminalRecovery = async (...args) => {
        const value = await original(...args);
        if (!vanished && value?.status === 'settlement_completed') {
          vanished = true; throw Error('Synthetic lost settlement readback');
        }
        return value;
      };
      const lostResult = await new CleanEpochTerminalAdapter(unreliable).retire(lost.request);
      check(lostResult.status === 'blocked' && vanished, 'lost terminal readback not exposed');
      const retained = await owner.readTerminalForSource(lost.accountId,
        lost.request.control.campaignId, lost.request.control.loadedPublicationId);
      check(retained?.status === 'settlement_completed', 'lost readback did not commit settlement');
      const restarted = await openCleanEpochAccountStore({ name: dbName });
      const exact = await new CleanEpochTerminalAdapter(restarted).retire(lost.request);
      check(exact.status === 'completed' && exact.recovery.publicationId === retained.publicationId,
        'second owner did not resume exact committed terminal');
      inspectSettlement(exact);
      const changed = await new CleanEpochTerminalAdapter(owner).retire({ ...lost.request,
        expectedAccountRevision: lost.request.expectedAccountRevision + 1 });
      check(changed.status === 'blocked', 'changed terminal request claimed completed settlement');
      restarted.close(); unreliable.close();
      cases.push(`terminal write count ${total}, abort and quota at every position`);
    } else {
      mark('prepare two-address settled terminal for closure');
      const source = await setup(owner, true);
      const terminal = await new CleanEpochTerminalAdapter(owner).retire(source.request);
      check(terminal.status === 'completed', `two-address terminal ${JSON.stringify(terminal)}`);
      const staleTime = new Date().toISOString();
      let writes = 0;
      const counter = await openCleanEpochAccountStore({ name: dbName, beforeWrite: () => { writes++; } });
      const closed = await counter.closeTerminalAddresses(source.accountId,
        terminal.recovery.campaignId, terminal.recovery.publicationId, terminal.account.revision, staleTime);
      check(closed.status === 'committed' && closed.recovery.addressClosure?.receipts.length === 2,
        'two-address terminal closure not complete');
      check(writes >= 8, `unexpected closure write count ${writes}`);
      counter.close();
      const exact = await owner.closeTerminalAddresses(source.accountId,
        terminal.recovery.campaignId, terminal.recovery.publicationId, terminal.account.revision, staleTime);
      check(exact.status === 'same_source_retry', 'exact closure retry did not return receipt');
      let changed = false;
      try { await owner.closeTerminalAddresses(source.accountId, terminal.recovery.campaignId,
        terminal.recovery.publicationId, terminal.account.revision,
        new Date(Date.now() + 60000).toISOString()); } catch { changed = true; }
      check(changed, 'changed closure time claimed old receipt');
      for (const fault of ['abort', 'quota'] as const)
        for (let position = 1; position <= writes; position++) {
          mark(`two-address closure ${fault} write ${position}/${writes}`);
          const subject = await setup(owner, true);
          const settled = await new CleanEpochTerminalAdapter(owner).retire(subject.request);
          check(settled.status === 'completed', 'fault source failed settlement');
          const prior = await bytes(subject.accountId);
          let attempts = 0;
          const faulty = await openCleanEpochAccountStore({ name: dbName, beforeWrite: tx => {
            if (++attempts !== position) return;
            if (fault === 'abort') tx.abort();
            else throw new DOMException('Synthetic quota', 'QuotaExceededError');
          } });
          let rejected = false;
          const closedAt = new Date().toISOString();
          try { await faulty.closeTerminalAddresses(subject.accountId, settled.recovery.campaignId,
            settled.recovery.publicationId, settled.account.revision, closedAt); }
          catch { rejected = true; }
          check(rejected && attempts === position && await bytes(subject.accountId) === prior,
            `closure ${fault} ${position} partially wrote`);
          faulty.close();
          const reopened = await openCleanEpochAccountStore({ name: dbName });
          const resumed = await reopened.closeTerminalAddresses(subject.accountId,
            settled.recovery.campaignId, settled.recovery.publicationId,
            settled.account.revision, closedAt);
          check(resumed.status === 'committed' && resumed.recovery.addressClosure?.receipts.length === 2,
            'closure retry did not finish exact two addresses');
          reopened.close();
          check(await bytes(otherId) === otherBefore, 'closure fault changed other account');
        }
      mark('pending-settlement closure ordering');
      const pendingSource = await setup(owner, true);
      const interrupted = await openCleanEpochAccountStore({ name: dbName });
      interrupted.completeTerminalSettlement = async () => { throw Error('Synthetic settlement interruption'); };
      const pendingResult = await new CleanEpochTerminalAdapter(interrupted).retire(pendingSource.request);
      check(pendingResult.status === 'blocked', 'settlement interruption did not block terminal');
      const pending = await owner.readPendingTerminalForAccount(pendingSource.accountId);
      check(pending?.status === 'accepted_pending_settlement', 'interrupted terminal lacks durable pending owner');
      let earlyClosed = false;
      try { await owner.closeTerminalAddresses(pendingSource.accountId,
        pending.campaignId, pending.publicationId, pendingSource.account.revision,
        new Date().toISOString()); } catch { earlyClosed = true; }
      check(earlyClosed, 'closure before account settlement was accepted');
      const resumed = await new CleanEpochTerminalAdapter(owner).resumePending(pendingSource.accountId);
      check(resumed?.status === 'completed' && resumed.recovery.publicationId === pending.publicationId,
        'pending terminal resumed with different publication');
      interrupted.close();
      mark('malformed address membership blocks before first closure write');
      const reorderedSource = await setup(owner, true);
      const reorderedTerminal = await new CleanEpochTerminalAdapter(owner).retire(reorderedSource.request);
      check(reorderedTerminal.status === 'completed', 'reorder control did not settle');
      await changeTerminalRow(reorderedSource.accountId, reorderedTerminal.recovery.campaignId,
        reorderedTerminal.recovery.publicationId, row => ({ ...row,
          addressSlotIds: [(row.addressSlotIds as string[])[0], 'slot-3'] }));
      const malformedBefore = await bytes(reorderedSource.accountId);
      let malformedWrites = 0;
      const inspector = await openCleanEpochAccountStore({ name: dbName,
        beforeWrite: () => { malformedWrites++; } });
      let malformedRejected = false;
      try { await inspector.closeTerminalAddresses(reorderedSource.accountId,
        reorderedTerminal.recovery.campaignId, reorderedTerminal.recovery.publicationId,
        reorderedTerminal.account.revision, new Date().toISOString()); }
      catch { malformedRejected = true; }
      const malformedStable = await bytes(reorderedSource.accountId) === malformedBefore;
      check(malformedRejected && malformedWrites === 0 && malformedStable,
        `reordered recovery rejected=${malformedRejected} writes=${malformedWrites} stable=${malformedStable}`);
      inspector.close();
      mark('lost committed closure readback and restarted exact retry');
      const lostSource = await setup(owner, true);
      const lostTerminal = await new CleanEpochTerminalAdapter(owner).retire(lostSource.request);
      check(lostTerminal.status === 'completed', 'lost closure source did not settle');
      const unreliable = await openCleanEpochAccountStore({ name: dbName });
      const original = unreliable.readTerminalRecovery.bind(unreliable);
      let lostRead = false;
      unreliable.readTerminalRecovery = async (...args) => {
        const value = await original(...args);
        if (!lostRead && value?.addressClosure) {
          lostRead = true; throw Error('Synthetic lost closure readback');
        }
        return value;
      };
      const closedAt = new Date().toISOString();
      let lostBlocked = false;
      try { await unreliable.closeTerminalAddresses(lostSource.accountId,
        lostTerminal.recovery.campaignId, lostTerminal.recovery.publicationId,
        lostTerminal.account.revision, closedAt); } catch { lostBlocked = true; }
      check(lostBlocked && lostRead, 'lost closure readback not surfaced');
      const retained = await owner.readTerminalRecovery(lostSource.accountId,
        lostTerminal.recovery.campaignId, lostTerminal.recovery.publicationId);
      check(retained?.addressClosure?.receipts.length === 2, 'closure did not commit before readback loss');
      const restarted = await openCleanEpochAccountStore({ name: dbName });
      const exactAfterLoss = await restarted.closeTerminalAddresses(lostSource.accountId,
        lostTerminal.recovery.campaignId, lostTerminal.recovery.publicationId,
        lostTerminal.account.revision, closedAt);
      check(exactAfterLoss.status === 'same_source_retry' &&
        JSON.stringify(exactAfterLoss.recovery.addressClosure) === JSON.stringify(retained.addressClosure),
        'restart changed committed closure');
      unreliable.close(); restarted.close();
      cases.push(`two-address closure write count ${writes}, abort and quota at every position`);
    }
    check(await bytes(otherId) === otherBefore, 'terminal tests changed other account');
    screen.textContent = `PASS ${phase} ${assertions} independent assertions\n${cases.join('\n')}`;
  } finally { owner.close(); }
}
run().catch(error => { screen.textContent = `FAIL ${phase} ${assertions} after ${cases.at(-1)}: ${error instanceof Error ? error.stack : String(error)}`; });
