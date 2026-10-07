import React from 'react';
import { createRoot } from 'react-dom/client';
import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { EpochApp } from './src/EpochApp.tsx';
import { accountLifecycleGeneration, CLEAN_EPOCH_SESSION_STORAGE_KEY,
  CleanEpochAccountStore, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';

const result = document.querySelector<HTMLPreElement>('#qa-result')!;
const probe = new URLSearchParams(location.search).get('probe');
const password = 'synthetic-only-password';
const accountId = `account.local.g9f.selected.${crypto.randomUUID()}`;
const displayName = `G9F Selected App ${accountId.slice(-8)}`;
const waitFor = async <T,>(read: () => T | null, label: string): Promise<T> => {
  for (let i = 0; i < 100; i++) {
    const found = read();
    if (found) return found;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for ${label}.`);
};
const button = (name: string) => [...document.querySelectorAll<HTMLButtonElement>('#root button')]
  .find(item => item.textContent?.trim().startsWith(name)) ?? null;
const lastButton = (name: string) => [...document.querySelectorAll<HTMLButtonElement>('#root button')]
  .filter(item => item.textContent?.trim() === name).slice(-1)[0] ?? null;
const check = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
const setPassword = (value: string) => {
  const field = document.querySelector<HTMLInputElement>('#root input[type="password"]');
  if (!field) throw new Error('Selected picker password field is missing.');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(field, value);
  field.dispatchEvent(new Event('input', { bubbles: true }));
};
async function run() {
  if (!['f6', 'f7', 'f7-settings', 'fresh', 'wrong-password'].includes(probe ?? ''))
    throw new Error('Select ?probe=f6, f7, f7-settings, fresh or wrong-password.');
  const owner = await openCleanEpochAccountStore();
  try {
    await owner.register(createDefaultAccountProfileState({ accountId, displayName }),
      await createCredentialRecord(accountId, password, new Date().toISOString()));
    localStorage.removeItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
    createRoot(document.querySelector('#root')!).render(<EpochApp />);
    await waitFor(() => button(displayName), 'selected account button');
    button(displayName)!.click();
    await waitFor(() => document.querySelector<HTMLInputElement>('#root input[type="password"]'), 'password field');
    setPassword(password);
    await waitFor(() => button('Delete Account'), 'picker deletion button');
    const observed = await owner.readSelected(accountId);
    if (!observed) throw new Error('Selected account disappeared before probe.');
    if (probe === 'f6') {
      await owner.transitionAccount('reset', { accountId, expectedRevision: observed.revision,
        expectedGeneration: accountLifecycleGeneration(observed), currentPassword: password });
      button('Delete Account')!.click();
      await waitFor(() => button(displayName) === null ||
        !!document.querySelector('#root [role="alert"]'), 'picker deletion outcome');
      const after = await owner.read(accountId);
      check(after?.revision === observed.revision + 1 && accountLifecycleGeneration(after) === 2 &&
        document.querySelector('#root [role="alert"]')?.textContent === 'Account changed before deletion.',
        'Stale picker deleted or accepted an unseen generation.');
      result.textContent = `PASS ${probe}\n` + JSON.stringify({ probe, observedRevision: observed.revision,
        observedGeneration: accountLifecycleGeneration(observed), afterRevision: after?.revision ?? null,
        afterGeneration: after ? accountLifecycleGeneration(after) : null,
        accountSurvived: !!after, alert: document.querySelector('#root [role="alert"]')?.textContent ?? null }, null, 2);
    } else if (probe === 'fresh' || probe === 'wrong-password') {
      if (probe === 'wrong-password') setPassword('wrong-synthetic-password');
      button('Delete Account')!.click();
      await waitFor(() => button(displayName) === null ||
        !!document.querySelector('#root [role="alert"]'), 'fresh picker deletion outcome');
      const after = await owner.read(accountId);
      check(probe === 'fresh' ? after === null && button(displayName) === null :
        !!after && document.querySelector('#root [role="alert"]')?.textContent ===
          'Current password did not match.', 'Fresh picker or wrong-password behavior changed.');
      result.textContent = `PASS ${probe}`;
    } else {
      if (probe === 'f7-settings') {
        button('Log In')!.click();
        await waitFor(() => button('Settings'), 'main-menu Settings');
        button('Settings')!.click();
        await waitFor(() => button('Delete Account'), 'Settings delete action');
        button('Delete Account')!.click();
        await waitFor(() => document.querySelector<HTMLInputElement>('#root input[placeholder="Account password"]'),
          'Settings password confirmation');
        setPassword(password);
      }
      const original = CleanEpochAccountStore.prototype.readLifecycleReceipt;
      let armed = true;
      CleanEpochAccountStore.prototype.readLifecycleReceipt = async function(id) {
        if (id === accountId && armed) { armed = false; throw new Error('Synthetic lost delete acknowledgement.'); }
        return original.call(this, id);
      };
      try {
        const deleteAction = () => probe === 'f7-settings' ? lastButton('Delete Account') : button('Delete Account');
        deleteAction()!.click();
        await waitFor(() => (document.querySelector('#root')?.textContent ?? '').includes(
          'Synthetic lost delete acknowledgement.'), 'lost acknowledgement alert');
        const firstAlert = 'Synthetic lost delete acknowledgement.';
        if (await owner.read(accountId)) throw new Error('Synthetic delete did not commit before acknowledgement loss.');
        deleteAction()!.click();
        await waitFor(() => button(displayName) === null &&
          !!document.querySelector('#root h1')?.textContent?.includes('Account Login'), 'exact retry outcome');
        check(!document.querySelector('#root [role="alert"]') &&
          (await owner.readLifecycleReceipt(accountId))?.kind === 'delete',
          'Exact tombstone retry did not return to the picker.');
        result.textContent = `PASS ${probe}\n` + JSON.stringify({ probe, firstAlert,
          retryAlert: document.querySelector('#root [role="alert"]')?.textContent ?? null,
          pickerCleared: button(displayName) === null,
          tombstoneKind: (await owner.readLifecycleReceipt(accountId))?.kind ?? null }, null, 2);
      } finally { CleanEpochAccountStore.prototype.readLifecycleReceipt = original; }
    }
  } finally { owner.close(); }
}
run().catch(error => { result.textContent = `FAIL: ${error instanceof Error ? error.stack : String(error)}`; });
