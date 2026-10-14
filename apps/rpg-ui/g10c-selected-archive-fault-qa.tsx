import { createRoot } from 'react-dom/client';
import App from './src/App.tsx';
import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { CleanEpochAccountStore, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const status = document.querySelector<HTMLSpanElement>('#qa-status')!;
let fault = false;
let restoring = false;
const restore = CleanEpochAccountStore.prototype.restoreArchive;
const exportArchive = CleanEpochAccountStore.prototype.exportArchive;
CleanEpochAccountStore.prototype.restoreArchive = async function (text) {
  restoring = true;
  try { return await restore.call(this, text); }
  finally { restoring = false; }
};
CleanEpochAccountStore.prototype.exportArchive = async function () {
  if (restoring && fault) {
    fault = false;
    throw Error('synthetic post-commit readback interruption');
  }
  return exportArchive.call(this);
};
document.querySelector<HTMLButtonElement>('#arm')!.addEventListener('click', () => {
  fault = true;
  status.textContent = ' One selected readback interruption armed.';
});
document.querySelector<HTMLButtonElement>('#generate')!.addEventListener('click', () => {
  void (async () => {
    const owner = await openCleanEpochAccountStore({
      name: `lineage.g10c.tiny-source.${crypto.randomUUID()}` });
    try {
      const accountId = `account.local.${crypto.randomUUID()}`;
      await owner.register(createDefaultAccountProfileState({ accountId,
        displayName: 'G10C Tiny Synthetic' }),
      await createCredentialRecord(accountId, 'disposable-g10c-only', new Date().toISOString()));
      const archive = await owner.exportArchive();
      const url = URL.createObjectURL(new Blob([archive], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url; link.download = 'g10c-tiny-synthetic-backup.json';
      document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      status.textContent = ' Tiny synthetic archive downloaded.';
    } catch { status.textContent = ' Tiny synthetic archive generation failed.'; }
    finally { owner.close(); }
  })();
});
createRoot(document.querySelector<HTMLDivElement>('#root')!).render(<App />);
