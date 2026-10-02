import React from 'react';
import { createRoot } from 'react-dom/client';
import { createDefaultAccountProfileState, grantLegacy } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { EpochApp } from './src/EpochApp.tsx';
import { CLEAN_EPOCH_SESSION_STORAGE_KEY, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import './src/index.css';

const marker = 'lineage.g9c.app.qa.account';
const status = document.querySelector<HTMLDivElement>('#qa-status')!;
async function start() {
  const owner = await openCleanEpochAccountStore();
  try {
    let accountId = sessionStorage.getItem(marker);
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
  } finally { owner.close(); }
  createRoot(document.querySelector('#root')!).render(<EpochApp />);
}
start().catch(error => { status.textContent = `FAIL: ${error instanceof Error ? error.message : String(error)}`; });
