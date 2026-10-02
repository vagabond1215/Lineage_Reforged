import React from 'react';
import { createRoot } from 'react-dom/client';
import { createDefaultAccountProfileState, grantLegacy } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { EpochApp } from './src/EpochApp.tsx';
import { CLEAN_EPOCH_ACCOUNT_STORE, CLEAN_EPOCH_SESSION_STORAGE_KEY,
  openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import './src/index.css';

const marker = 'lineage.g9c.app.qa.account';
const status = document.querySelector<HTMLDivElement>('#qa-status')!;
const inspection = document.querySelector<HTMLPreElement>('#qa-inspection')!;
let armed: 'quota' | 'abort' | null = null;
const originalPut = IDBObjectStore.prototype.put;
IDBObjectStore.prototype.put = function(value: unknown, key?: IDBValidKey) {
  if (armed && this.name === CLEAN_EPOCH_ACCOUNT_STORE) {
    const mode = armed; armed = null;
    if (mode === 'quota') throw new DOMException('synthetic account quota', 'QuotaExceededError');
    const result = key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
    queueMicrotask(() => { try { this.transaction.abort(); } catch { /* already settled */ } });
    return result;
  }
  return key === undefined ? originalPut.call(this, value) : originalPut.call(this, value, key);
};
document.querySelector<HTMLButtonElement>('#arm-quota')!.onclick = () => { armed = 'quota'; inspection.textContent = 'Account quota armed.'; };
document.querySelector<HTMLButtonElement>('#arm-abort')!.onclick = () => { armed = 'abort'; inspection.textContent = 'Account abort armed.'; };
async function start() {
  const owner = await openCleanEpochAccountStore();
  try {
    let accountId = new URLSearchParams(location.search).get('accountId') || sessionStorage.getItem(marker);
    if (!accountId) {
      accountId = `account.local.${crypto.randomUUID()}`;
      const base = createDefaultAccountProfileState({ accountId, displayName: 'G9C Browser QA' });
      const granted = grantLegacy(base, { amount: 100, summary: 'Synthetic G9C QA grant',
        sourceType: 'qa', sourceId: 'qa.g9c', recordedAt: new Date().toISOString() });
      if (!granted.ok) throw new Error('Synthetic QA grant failed.');
      await owner.register(granted.profile, await createCredentialRecord(accountId,
        'synthetic-g9c-password', new Date().toISOString()));
      sessionStorage.setItem(marker, accountId);
    }
    const account = await owner.readSelected(accountId);
    if (!account) throw new Error('QA account is missing.');
    localStorage.setItem(CLEAN_EPOCH_SESSION_STORAGE_KEY,
      JSON.stringify({ version: 1, accountId, issuedAt: new Date().toISOString() }));
    status.textContent = `QA ACCOUNT ${accountId} REV ${account.revision} BALANCE ${account.profile.legacy.legacyPoints}`;
    document.querySelector<HTMLButtonElement>('#inspect')!.onclick = () => { void (async () => {
      const selected = await openCleanEpochAccountStore();
      try {
        const retained = await selected.readSelected(accountId!);
        inspection.textContent = JSON.stringify({ revision: retained?.revision,
          balance: retained?.profile.legacy.legacyPoints,
          transactions: retained?.profile.legacy.legacyTransactions.length,
          unlocks: retained?.profile.legacy.legacyUnlocks.map(unlock => ({ id: unlock.unlockId, rank: unlock.rank ?? 1 })),
          selected: retained?.profile.legacy.selectedPreparationUnlockIds }, null, 2);
      } finally { selected.close(); }
    })().catch(error => { inspection.textContent = String(error); }); };
  } finally { owner.close(); }
  createRoot(document.querySelector('#root')!).render(<EpochApp />);
}
start().catch(error => { status.textContent = `FAIL: ${error instanceof Error ? error.message : String(error)}`; });
