import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { createLocalAccount } from './src/game-shell/launcherAuthManager.ts';
import { buildSaveMetadata, createSave } from './src/game-shell/saveManager.ts';

const target = document.querySelector<HTMLPreElement>('#result')!;
const prefix = ['cataclysm-rpg-ui.auth.v1.', 'cataclysm-rpg-ui.accounts.v1.',
  'cataclysm-rpg-ui.saves.v7.', 'cataclysm-rpg-ui.new-campaign-attempts.v1.'];
const sha = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',
  new TextEncoder().encode(value)))).map(byte => byte.toString(16).padStart(2, '0')).join('');
async function report() {
  const keys = Object.keys(localStorage).filter(key => prefix.some(item => key.startsWith(item))).sort();
  const rows = await Promise.all(keys.map(async key => { const raw = localStorage.getItem(key)!;
    return { key, bytes: new TextEncoder().encode(raw).byteLength, sha256: await sha(raw),
      parses: (() => { try { JSON.parse(raw); return true; } catch { return false; } })() }; }));
  const epochHint = localStorage.getItem('cataclysm-rpg-ui.epoch1.session');
  target.textContent = JSON.stringify({ legacyKeys: rows, epochHintPresent: epochHint !== null,
    epochHintBytes: epochHint === null ? null : new TextEncoder().encode(epochHint).byteLength,
    epochHintSha256: epochHint === null ? null : await sha(epochHint) }, null, 2);
}
document.querySelector<HTMLButtonElement>('#read')!.onclick = report;
document.querySelector<HTMLButtonElement>('#write')!.onclick = async () => {
  target.textContent = 'WRITING';
  const owner = await openCleanEpochAccountStore();
  try {
    const account = (await owner.list())[0];
    if (!account) throw Error('Disposable epoch account unavailable');
    const slot = await owner.readSlot(account.accountId, 'slot-1');
    if (slot.status !== 'ready') throw Error(`Epoch source slot ${slot.status}`);
    const password = `${crypto.randomUUID()}!Ab1`;
    const old = await createLocalAccount({ displayName: 'G10E old-tab synthetic', password,
      confirmPassword: password, stayLoggedIn: true });
    if (!old.ok) throw Error(`Legacy account writer: ${old.message}`);
    const oldId = old.accountProfile.accountId;
    createSave(oldId, 'slot-1', slot.loaded.snapshot, buildSaveMetadata('slot-1', slot.loaded.snapshot));
    await report();
  } catch (error) { target.textContent = `OLD WRITER FAILED: ${error instanceof Error ? error.message : 'unknown'}`; }
  finally { owner.close(); }
};
