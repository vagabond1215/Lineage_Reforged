import React from 'react';
import { createRoot } from 'react-dom/client';
import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { EpochApp } from './src/EpochApp.tsx';
import { accountLifecycleGeneration, CLEAN_EPOCH_SESSION_STORAGE_KEY, CleanEpochAccountStore,
  openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';

// Synthetic selected App caller probes, authored separately from G9F repair QA.
const output = document.querySelector<HTMLPreElement>('#result')!;
const mode = new URLSearchParams(location.search).get('mode') ?? '';
const password = 'parent-audit-only';
const id = `account.local.${crypto.randomUUID()}`;
const otherId = `account.local.${crypto.randomUUID()}`;
const name = `Parent target ${id.slice(-8)}`;
const otherName = `Parent other ${otherId.slice(-8)}`;
const assert = (yes: unknown, why: string) => { if (!yes) throw new Error(why); };
async function until<T>(read: () => T | null | undefined, label: string): Promise<T> {
  for (let n = 0; n < 120; n++) { const value = read(); if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 50)); }
  throw new Error(`Timeout: ${label}`);
}
const button = (label: string) => [...document.querySelectorAll<HTMLButtonElement>('#root button')]
  .find(value => value.textContent?.trim().startsWith(label)) ?? null;
const lastButton = (label: string) => [...document.querySelectorAll<HTMLButtonElement>('#root button')]
  .filter(value => value.textContent?.trim() === label).at(-1) ?? null;
const alert = () => (document.querySelector('#root [role="alert"]')?.textContent ??
  document.querySelector('#root')?.textContent ?? '');
const passwordField = () => document.querySelector<HTMLInputElement>('#root input[placeholder="Account password"]') ??
  document.querySelector<HTMLInputElement>('#root input[type="password"]');
const enter = (value: string) => {
  const input = passwordField(); assert(!!input, 'password field absent');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
async function run() {
  const owner = await openCleanEpochAccountStore();
  await owner.register(createDefaultAccountProfileState({ accountId: id, displayName: name }),
    await createCredentialRecord(id, password, new Date().toISOString()));
  await owner.register(createDefaultAccountProfileState({ accountId: otherId, displayName: otherName }),
    await createCredentialRecord(otherId, password, new Date().toISOString()));
  localStorage.removeItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
  createRoot(document.querySelector('#root')!).render(<EpochApp />);
  await until(() => button(name), 'target picker'); button(name)!.click();
  await until(passwordField, 'picker password'); enter(password);
  const account = (await owner.readSelected(id))!;
  const revision = account.revision;
  const generation = accountLifecycleGeneration(account);
  const settings = mode.endsWith('-settings') || mode.startsWith('settings-');
  if (settings) {
    button('Log In')!.click();
    await until(() => button('Settings'), 'main menu'); button('Settings')!.click();
    await until(() => button('Delete Account'), 'Settings delete'); button('Delete Account')!.click();
    await until(() => document.querySelector<HTMLInputElement>('#root input[placeholder="Account password"]'), 'Settings confirmation');
    enter(password);
  }
  const submit = () => (settings ? lastButton('Delete Account') : button('Delete Account'))!.click();
  try {
    if (mode.startsWith('external-')) {
      const second = await openCleanEpochAccountStore();
      const externalId = crypto.randomUUID();
      await second.transitionAccount('delete', { accountId: id, expectedRevision: revision,
        expectedGeneration: generation, currentPassword: password, requestId: externalId });
      second.close();
      const receipt = JSON.stringify(await owner.readLifecycleReceipt(id));
      const other = JSON.stringify(await owner.read(otherId));
      submit(); await until(() => alert().includes('Account changed before deletion.') ? true : null,
        'external deletion stale result');
      assert(button(name) !== null || settings, 'pre-submit delete cleared selected picker');
      assert(JSON.stringify(await owner.readLifecycleReceipt(id)) === receipt &&
        JSON.stringify(await owner.read(otherId)) === other, 'pre-submit delete mutated retained authority');
    } else if (mode === 'stale-reset' || mode === 'stale-revision') {
      if (mode === 'stale-reset') await owner.transitionAccount('reset', { accountId: id,
        expectedRevision: revision, expectedGeneration: generation, currentPassword: password });
      else await owner.updateProfile(id, revision, { ...account.profile, updatedAt: new Date().toISOString() });
      const before = JSON.stringify(await owner.read(id));
      submit(); await until(() => alert().includes('Account changed before deletion.') ? true : null,
        'stale revision result');
      assert(JSON.stringify(await owner.read(id)) === before, 'stale selection mutated account');
    } else if (mode === 'wrong-password') {
      enter('incorrect-parent-password'); const before = JSON.stringify(await owner.read(id));
      submit(); await until(() => alert().includes('Current password did not match.') ? true : null,
        'wrong password result');
      assert(JSON.stringify(await owner.read(id)) === before, 'wrong credential mutated account');
    } else if (mode === 'lost-picker' || mode === 'lost-settings' ||
      mode === 'changed-password' || mode === 'changed-password-return' ||
      mode === 'changed-selection' || mode === 'toggle-selection' ||
      mode === 'create-form' || mode === 'other-account' ||
      mode === 'settings-cancel' || mode === 'settings-switch-action') {
      const original = CleanEpochAccountStore.prototype.readLifecycleReceipt;
      let armed = true;
      CleanEpochAccountStore.prototype.readLifecycleReceipt = async function(accountId) {
        if (accountId === id && armed) { armed = false; throw new Error('Parent synthetic lost acknowledgement'); }
        return original.call(this, accountId);
      };
      try {
        submit(); await until(() => alert().includes('Parent synthetic lost acknowledgement') ? true : null,
          'lost acknowledgement surfaced');
        assert(await owner.read(id) === null, 'delete did not commit before acknowledgement loss');
        const receipt = JSON.stringify(await owner.readLifecycleReceipt(id));
        const otherBefore = JSON.stringify(await owner.read(otherId));
        if (mode === 'changed-password') enter('different-parent-password');
        if (mode === 'changed-password-return') {
          enter('different-parent-password'); enter(password);
        }
        if (mode === 'changed-selection') {
          button(otherName)!.click();
          await until(() => button('Log In'), 'other selected');
          button(name)!.click();
          await until(passwordField, 'target reselected'); enter(password);
        }
        if (mode === 'other-account') {
          button(otherName)!.click();
          await until(passwordField, 'other account selected'); enter('wrong-other-password');
          submit();
          await until(() => alert().includes('Current password did not match.') ? true : null,
            'other account wrong credential');
          assert(JSON.stringify(await owner.read(otherId)) === otherBefore,
            'switched account changed without its credential');
          button(name)!.click();
          await until(passwordField, 'target after other account'); enter(password);
        }
        if (mode === 'toggle-selection') {
          button(name)!.click(); button(name)!.click();
          await until(passwordField, 'target toggled back'); enter(password);
        }
        if (mode === 'create-form') {
          button('Create Account')!.click();
          await until(() => button('Back'), 'create form'); button('Back')!.click();
          await until(() => button(name), 'picker after create form'); button(name)!.click();
          await until(passwordField, 'target after create form'); enter(password);
        }
        if (mode === 'settings-cancel') {
          button('Cancel')!.click(); button('Delete Account')!.click();
          await until(passwordField, 'reopened Settings confirmation'); enter(password);
        }
        if (mode === 'settings-switch-action') {
          button('Reset Account')!.click(); button('Delete Account')!.click();
          await until(passwordField, 'changed Settings action'); enter(password);
        }
        submit();
        if (['changed-password', 'changed-password-return', 'changed-selection',
          'toggle-selection', 'create-form', 'other-account',
          'settings-cancel', 'settings-switch-action'].includes(mode)) {
          await until(() => alert().includes('Account changed before deletion.') || button(name) === null ? true : null,
            'changed request result');
          assert(JSON.stringify(await owner.readLifecycleReceipt(id)) === receipt &&
            JSON.stringify(await owner.read(otherId)) === otherBefore && await owner.read(id) === null,
            `${mode} changed durable target or other account`);
          assert(alert().includes('Account changed before deletion.') && button(name) !== null,
            `${mode} claimed prior selected action; targetPickerPresent=${button(name) !== null}; staleAlert=${alert().includes('Account changed before deletion.')}`);
        } else {
          await until(() => button(name) === null ? true : null, 'exact selected retry');
          assert(!alert().includes('Account changed before deletion.'), 'exact retry rejected');
        }
        assert(JSON.stringify(await owner.readLifecycleReceipt(id)) === receipt,
          'retry mutated tombstone');
      } finally { CleanEpochAccountStore.prototype.readLifecycleReceipt = original; }
    } else throw new Error(`Unsupported mode ${mode}`);
    output.textContent = `PASS ${mode}: selected App authority and presentation`;
  } finally { owner.close(); }
}
run().catch(error => { output.textContent = `FAIL ${mode}: ${error instanceof Error ? error.stack : String(error)}`; });
