import React from 'react';
import { createRoot } from 'react-dom/client';
import { EpochApp } from './src/EpochApp.tsx';
import { CleanEpochAccountAdapter } from './src/game-shell/cleanEpochAccountAdapter.ts';
import { CLEAN_EPOCH_SESSION_STORAGE_KEY, CleanEpochAccountStore,
  openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog,
  startingBundleOptions } from './src/game-shell/characterCreationCatalog.ts';
import { getWorldContinentOptions, getWorldRegionOptions, getWorldSettlementOptions } from './src/game-shell/worldSelectionCatalog.ts';
import { resolveNormalDefeat } from '../../packages/engines/game-engine/src/normal-defeat.ts';
import { evaluateAchievementProgress } from '../../packages/engines/game-engine/src/achievements.ts';
import { grantLegacy } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { deserializeSnapshot, serializeSnapshot } from '../../packages/shared/persistence/src/index.ts';

const out = document.querySelector<HTMLPreElement>('#audit')!;
const mode = new URLSearchParams(location.search).get('mode') ?? '';
const pass = 'selected-synthetic-password';
const target = `account.local.g9.selected.${crypto.randomUUID()}`;
const other = `account.local.g9.selected.${crypto.randomUUID()}`;
const targetName = `Target ${target.slice(-7)}`;
const otherName = `Other ${other.slice(-7)}`;
const characterName = `Audit Hero ${target.slice(-5)}`;
let checks = 0;
function assert(value: unknown, label: string): asserts value { checks++; if (!value) throw new Error(label); }
const button = (label: string) => [...document.querySelectorAll<HTMLButtonElement>('#root button')]
  .find(item => item.textContent?.trim() === label ||
    ((label === targetName || label === otherName) && item.textContent?.trim().startsWith(label))) ?? null;
const buttons = (label: string) => [...document.querySelectorAll<HTMLButtonElement>('#root button')]
  .filter(item => item.textContent?.trim() === label);
const pause = (ms = 40) => new Promise(resolve => setTimeout(resolve, ms));
async function until<T>(read: () => T | null, name: string): Promise<T> {
  for (let i = 0; i < 200; i++) { const value = read(); if (value) return value; await pause(); }
  throw new Error(`Timed out: ${name}; target=${targetName}; present=${document.querySelector('#root')?.textContent?.includes(targetName)}; buttons=${[...document.querySelectorAll<HTMLButtonElement>('#root button')].filter(item => item.textContent?.includes(targetName)).map(item => item.textContent?.trim()).join('|')}; UI: ${document.querySelector('#root')?.textContent?.slice(-900)}`);
}
function click(label: string, last = false) {
  const item = last ? buttons(label).at(-1) : button(label);
  if (!item) throw new Error(`Missing button ${label}`);
  item.click();
}
function typePassword(value: string) {
  const field = document.querySelector<HTMLInputElement>('#root input[type="password"]');
  if (!field) throw new Error('Missing selected password input');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(field, value);
  field.dispatchEvent(new Event('input', { bubbles: true }));
}
async function externalDelete(owner: CleanEpochAccountStore, accountId: string) {
  const current = (await owner.read(accountId))!;
  const result = await new CleanEpochAccountAdapter(owner).deleteAccount({ accountId,
    expectedRevision: current.revision, expectedGeneration: current.lifecycleGeneration ?? 1,
    password: pass, requestId: crypto.randomUUID() });
  assert(result.status === 'ready', 'external competing delete');
}
async function externalChange(owner: CleanEpochAccountStore, accountId: string,
  action: 'reset' | 'revision') {
  const current = (await owner.read(accountId))!;
  if (action === 'reset') {
    const result = await new CleanEpochAccountAdapter(owner).resetAccount({ accountId,
      expectedRevision: current.revision, expectedGeneration: current.lifecycleGeneration ?? 1,
      password: pass, stayLoggedIn: false });
    assert(result.status === 'ready', 'external reset');
  } else {
    const result = await owner.updateProfile(accountId, current.revision,
      { ...current.profile, updatedAt: new Date(Date.now() + 1000).toISOString() });
    assert(result.status === 'committed', 'external profile revision');
  }
}
async function seedCampaign(owner: CleanEpochAccountStore) {
  const defaults = createDefaultCharacterCreationFormState('slot-1');
  const identity = getLineageIdentityCatalog(defaults.lineageId)!;
  const continent = getWorldContinentOptions()[0]!;
  const region = getWorldRegionOptions(continent.id)[0]!;
  const settlement = getWorldSettlementOptions({ continentId: continent.id,
    regionId: region.id, backstoryId: '' })[0]!;
  const bundle = startingBundleOptions[0]!;
  const selectedForm = {
    ...defaults, playerName: characterName, hairColorId: identity.hairColorOptions[0]!.id,
    eyeColorId: identity.eyeColorOptions[0]!.id, skinToneId: identity.skinToneOptions[0]!.id,
    startingBundleId: bundle.id,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle.id),
    continentId: continent.id, regionId: region.id, startingSettlementId: settlement.id
  };
  if (mode === 'menu-defeat') {
    const first = new CleanEpochFirstCampaignAdapter(owner);
    const prepared = await first.prepare(target, selectedForm, false);
    assert(prepared.status === 'ready', 'selected pending defeat preparation');
    const snapshot = deserializeSnapshot(prepared.value.snapshotRaw);
    snapshot.playerState.location.settlementId = null;
    snapshot.playerState.flags = snapshot.playerState.flags.filter(flag => !flag.startsWith('player.start.'));
    snapshot.playerState.resources.hp.current = 0;
    const pending = resolveNormalDefeat(snapshot, { sourceMutationId: `selected.defeat.${crypto.randomUUID()}`,
      sourceKind: 'accepted_mutation' });
    assert(pending.receipt.posture === 'recovery_pending', 'selected fixture pending provenance');
    const projected = evaluateAchievementProgress(pending.snapshot, (await owner.read(target))!.profile,
      { slotId: 'slot-1', touchHistory: true, recordedAt: prepared.value.createdAt,
        suppressLegacyRewards: true }).nextSnapshot;
    const fingerprint = JSON.stringify({ slotId: 'slot-1', capturedAtTick: projected.capturedAtTick,
      characterAchievementIds: projected.playerState.achievements.unlocked.map(item => item.achievementId) });
    const opened = indexedDB.open('lineage.campaigns.epoch1');
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      opened.onsuccess = () => resolve(opened.result); opened.onerror = () => reject(opened.error);
    });
    const tx = db.transaction('campaignAttemptsV6', 'readwrite');
    tx.objectStore('campaignAttemptsV6').put({ ...prepared.value,
      snapshotRaw: serializeSnapshot(projected),
      consumerPlans: prepared.value.consumerPlans.map(plan =>
        ['active_history','account_achievements','legacy_rewards','last_played'].includes(plan.kind)
          ? { ...plan, payloadFingerprint: fingerprint } : plan) });
    await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
    db.close();
    const result = await first.resume(target, 'slot-1');
    assert(result.status === 'ready', `selected pending source: ${JSON.stringify(result)}`);
    return result.value;
  }
  const result = await new CleanEpochFirstCampaignAdapter(owner).start(target, selectedForm, false);
  assert(result.status === 'ready', `selected campaign seed: ${JSON.stringify(result)}`);
  return result.value;
}
async function run() {
  const owner = await openCleanEpochAccountStore();
  const outsider = await openCleanEpochAccountStore();
  const adapter = new CleanEpochAccountAdapter(owner);
  localStorage.removeItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
  for (const [accountId, displayName] of [[target,targetName],[other,otherName]]) {
    const made = await adapter.register({ accountId, displayName, password: pass,
      confirmPassword: pass, stayLoggedIn: mode.startsWith('settings') && accountId === target });
    assert(made.status === 'ready', `seed ${displayName}`);
  }
  const campaign = mode.startsWith('menu') || mode === 'settings-reset' ? await seedCampaign(owner) : null;
  if (mode === 'menu-legacy') {
    const account = (await owner.read(target))!;
    const granted = grantLegacy(account.profile, { amount: 100, summary: 'Synthetic selected Legacy award',
      sourceType: 'qa', sourceId: `selected.parent.${crypto.randomUUID()}`,
      recordedAt: new Date().toISOString() });
    assert(granted.ok, 'selected Legacy grant');
    await owner.updateProfile(target, account.revision, granted.profile);
  }
  if (mode.startsWith('settings') || mode.startsWith('menu')) {
    const signed = await adapter.signIn({ accountId: target, password: pass, stayLoggedIn: true });
    assert(signed.status === 'ready', 'seed selected Settings session');
  } else localStorage.removeItem(CLEAN_EPOCH_SESSION_STORAGE_KEY);
  const priorOther = JSON.stringify(await owner.read(other));
  let root = createRoot(document.querySelector('#root')!);
  const original = CleanEpochAccountStore.prototype.transitionAccount;
  let throwOnce = mode !== 'picker-external' && mode !== 'settings-external';
  // This injector loses only the selected caller's acknowledgement after the real owner committed.
  CleanEpochAccountStore.prototype.transitionAccount = async function(kind, input) {
    const result = await original.call(this, kind, input);
    if (kind === 'delete' && input.accountId === target && throwOnce) {
      throwOnce = false;
      throw new Error('Synthetic post-commit acknowledgement lost');
    }
    return result;
  };
  try {
    root.render(<EpochApp />);
    if (mode.startsWith('menu')) {
      await until(() => [...document.querySelectorAll<HTMLButtonElement>('#root button')]
        .find(item => item.title?.startsWith('Continue ')) ?? null, 'menu Continue');
      if (mode === 'menu-legacy') {
        const beforeLegacy = (await owner.read(target))!;
        click('Legacy');
        const purchase = await until(() => [...document.querySelectorAll<HTMLButtonElement>('#root button')]
          .find(item => item.textContent?.trim().startsWith('Purchase') && !item.disabled) ?? null,
          'selected Legacy purchase');
        purchase.click();
        await until(() => (document.body.textContent?.includes('Legacy Purchased') ? true : null),
          'selected Legacy readback');
        const afterLegacy = (await owner.read(target))!;
        assert(afterLegacy.revision === beforeLegacy.revision + 1 &&
          afterLegacy.profile.legacy.legacyPoints < beforeLegacy.profile.legacy.legacyPoints,
          'selected Legacy action spent once');
      } else if (mode === 'menu-defeat') {
        const sourceId = campaign!.loaded.publication.publicationId;
        [...document.querySelectorAll<HTMLButtonElement>('#root button')]
          .find(item => item.title?.startsWith('Continue '))!.click();
        await until(() => document.querySelector<HTMLButtonElement>('#root button[aria-label="Open settings"]'),
          'recovered in-game App');
        const final = await owner.readSlot(target, 'slot-1');
        assert(final.status === 'ready' && final.loaded.publication.publicationId !== sourceId &&
          final.loaded.snapshot.normalDefeatReceipts?.some(receipt => receipt.posture === 'playable'),
          'selected App recovered one playable descendant');
      } else if (mode === 'menu-retire') {
        [...document.querySelectorAll<HTMLButtonElement>('#root button')]
          .find(item => item.title?.startsWith('Continue '))!.click();
        await until(() => document.querySelector<HTMLButtonElement>('#root button[aria-label="Open settings"]'),
          'in-game settings button');
        document.querySelector<HTMLButtonElement>('#root button[aria-label="Open settings"]')!.click();
        await until(() => button('Retire Character'), 'in-game retirement');
        const originalConfirm = window.confirm;
        window.confirm = () => true;
        click('Retire Character');
        await until(() => document.body.textContent?.includes('Character Retired') ? true : null,
          'selected retirement completion');
        window.confirm = originalConfirm;
        const source = campaign!.loaded.sessionControl;
        const terminal = await owner.readTerminalForSource(target, source.campaignId,
          source.loadedPublicationId);
        assert(terminal?.status === 'settlement_completed', 'selected retirement settled exact source');
        assert(!!terminal?.addressClosure &&
          (await owner.readSlot(target, 'slot-1')).status === 'empty',
          'selected retirement settled then closed its address');
      } else {
        const del = [...document.querySelectorAll<HTMLButtonElement>('#root button')]
          .find(item => item.getAttribute('aria-label') === `Delete ${characterName}`);
        assert(!!del, 'selected address delete control'); del.click();
        await until(() => button('Delete Save'), 'address confirmation'); click('Delete Save');
        await until(() => document.body.textContent?.includes('Slot 1 is empty') ? true : null,
          'selected address deletion');
        assert((await owner.readSlot(target, 'slot-1')).status === 'empty', 'selected address empty readback');
        assert((await owner.readHistoricalFirstRecovery(target, campaign!.loaded.sessionControl.campaignId))
          .status === 'consumers_completed', 'selected deletion kept first recovery');
      }
    } else if (mode.startsWith('settings')) {
      await until(() => button('Settings'), 'main menu settings');
      click('Settings');
      await until(() => button('Reset Account'), 'settings account controls');
      if (mode === 'settings-reset') {
        click('Reset Account'); await until(() => document.querySelector<HTMLInputElement>('#root input[type="password"]'),
          'reset password'); typePassword(pass); await pause(); click('Reset Account', true);
        await until(() => document.body.textContent?.includes('Account data was erased and read back') ? true : null,
          'selected reset readback');
        const reset = (await owner.read(target))!;
        assert(reset.lifecycleGeneration === 2 && (await owner.readSlot(target, 'slot-1')).status === 'empty',
          'selected Settings reset advances generation and erases campaign');
      } else {
      click('Delete Account');
      await until(() => document.querySelector<HTMLInputElement>('#root input[type="password"]'), 'settings password');
      typePassword(pass);
      await pause();
      if (mode === 'settings-external') await externalDelete(outsider, target);
      if (mode === 'settings-stale-reset') await externalChange(outsider, target, 'reset');
      if (mode === 'settings-stale-revision') await externalChange(outsider, target, 'revision');
      click('Delete Account', true);
      if (!['settings-external','settings-stale-reset','settings-stale-revision'].includes(mode)) {
        await until(() => document.body.textContent?.includes('Synthetic post-commit acknowledgement lost') ? true : null,
          'lost Settings acknowledgement');
      } else await until(() => document.body.textContent?.includes('Account changed before deletion') ? true : null,
        'Settings external stale result');
      const firstTombstone = await owner.readLifecycleReceipt(target);
      if (mode === 'settings-cancel') {
        click('Cancel'); await until(() => !button('Cancel') ? true : null, 'cancelled action');
        click('Delete Account'); await until(() => document.querySelector<HTMLInputElement>('#root input[type="password"]'),
          'new delete action'); typePassword(pass); await pause(); click('Delete Account', true);
      } else if (mode === 'settings-switch') {
        click('Reset Account'); await pause(); click('Delete Account'); await pause();
        typePassword(pass); await pause(); click('Delete Account', true);
      } else if (mode === 'settings-unchanged') click('Delete Account', true);
      else if (mode === 'settings-remount') {
        root.unmount(); root = createRoot(document.querySelector('#root')!); root.render(<EpochApp />);
        await until(() => document.body.textContent?.includes('Campaign data is unavailable') ||
          document.body.textContent?.includes('Retry campaign data') ? true : null, 'deleted stale session blocks remount');
        assert(JSON.stringify(await owner.readLifecycleReceipt(target)) === JSON.stringify(firstTombstone),
          'Settings remount cannot change tombstone');
      }
      }
    } else {
      await until(() => button(targetName), 'target picker entry');
      click(targetName); await until(() => document.querySelector<HTMLInputElement>('#root input[type="password"]'),
        'picker password');
      typePassword(pass); await pause();
      if (mode === 'picker-external') await externalDelete(outsider, target);
      if (mode === 'picker-stale-reset') await externalChange(outsider, target, 'reset');
      if (mode === 'picker-stale-revision') await externalChange(outsider, target, 'revision');
      if (mode === 'picker-wrong-password') { typePassword('wrong'); await pause(); }
      click('Delete Account');
      if (!['picker-external','picker-stale-reset','picker-stale-revision','picker-wrong-password'].includes(mode))
        await until(() => document.body.textContent?.includes('Synthetic post-commit acknowledgement lost') ? true : null,
        'lost picker acknowledgement');
      else await until(() => document.querySelector('#root [role="alert"]')?.textContent?.includes(
        mode === 'picker-wrong-password' ? 'password' : 'Account changed before deletion') ? true : null,
        'picker external stale result');
      const firstTombstone = await owner.readLifecycleReceipt(target);
      if (mode === 'picker-selection') {
        click(otherName); click(targetName); typePassword(pass); await pause(); click('Delete Account');
      } else if (mode === 'picker-toggle') {
        click(targetName); click(targetName); typePassword(pass); await pause(); click('Delete Account');
      } else if (mode === 'picker-password-return') {
        typePassword('changed'); typePassword(pass); await pause(); click('Delete Account');
      } else if (mode === 'picker-create') {
        click('Create Account'); await until(() => button('Back'), 'create form back');
        click('Back'); await until(() => button(targetName), 'returned picker'); click(targetName);
        await until(() => document.querySelector<HTMLInputElement>('#root input[type="password"]'), 'returned password');
        typePassword(pass); await pause(); click('Delete Account');
      } else if (mode === 'picker-unchanged') click('Delete Account');
      else if (mode === 'picker-remount') {
        root.unmount(); root = createRoot(document.querySelector('#root')!); root.render(<EpochApp />);
        await until(() => button(otherName), 'picker after remount');
        assert(!button(targetName), 'remounted picker omits deleted account');
        assert(JSON.stringify(await owner.readLifecycleReceipt(target)) === JSON.stringify(firstTombstone),
          'picker remount preserves tombstone');
      }
    }
    if (mode === 'settings-reset' || mode.startsWith('menu')) {
      assert((await owner.read(target)) !== null, 'selected lifecycle action retains account');
    } else if (mode.endsWith('remount')) {
      assert(await owner.read(target) === null, 'remount cannot resurrect deleted account');
    } else if (mode.endsWith('unchanged')) {
      await until(() => !button(targetName) && !document.body.textContent?.includes('Synthetic post-commit acknowledgement lost') ? true : null,
        'unchanged request completion');
      assert(await owner.read(target) === null, 'target stays deleted on exact retry');
    } else {
      await until(() => document.body.textContent?.includes(mode === 'picker-wrong-password' ? 'password' :
        'Account changed before deletion') ? true : null,
        'changed request stale presentation');
      assert((await owner.read(target) === null) === !['picker-stale-reset','picker-stale-revision',
        'settings-stale-reset','settings-stale-revision','picker-wrong-password'].includes(mode),
        'stale action must preserve actual account state');
      if (!mode.startsWith('settings')) assert(!!button(targetName), 'changed picker intent keeps stale selection');
    }
    const tombstone = await owner.readLifecycleReceipt(target);
    if (['picker-stale-reset','picker-stale-revision','settings-stale-reset',
      'settings-stale-revision','picker-wrong-password','settings-reset','menu-retire',
      'menu-address','menu-defeat','menu-legacy'].includes(mode))
      assert(tombstone === null || tombstone.kind === 'reset', 'no delete tombstone for rejected request');
    else assert(tombstone?.version === 2 && tombstone.kind === 'delete', 'version-2 tombstone retained');
    assert(JSON.stringify(await owner.read(other)) === priorOther, 'other account bytes unchanged');
    out.textContent = `PASS ${mode} ${checks} assertions`;
  } finally {
    CleanEpochAccountStore.prototype.transitionAccount = original;
    root.unmount(); owner.close(); outsider.close();
  }
}
run().catch(error => { out.textContent = `FAIL ${mode} ${checks}: ${error instanceof Error ? error.stack : String(error)}`; });
