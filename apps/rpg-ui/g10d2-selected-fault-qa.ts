import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#qa-result')!;
const oldPut = IDBObjectStore.prototype.put;
let armed: null | { target: 'artifacts' | 'accounts'; mode: 'quota' | 'abort' } = null;
IDBObjectStore.prototype.put = function(value: unknown, key?: IDBValidKey) {
  if (armed && this.name === armed.target) {
    const fault = armed;
    armed = null;
    if (fault.mode === 'quota') throw new DOMException('synthetic D3 selected quota', 'QuotaExceededError');
    const request = key === undefined ? oldPut.call(this, value) : oldPut.call(this, value, key);
    queueMicrotask(() => { try { this.transaction.abort(); } catch { /* transaction settled */ } });
    return request;
  }
  return key === undefined ? oldPut.call(this, value) : oldPut.call(this, value, key);
};
async function inspect(label: string) {
  const owner = await openCleanEpochAccountStore();
  try {
    const accounts = await owner.list();
    const account = accounts[0];
    const quick = account ? await owner.readSlot(account.accountId, 'quick-save') : null;
    const pending = account ? await owner.readCurrentDescendantRecovery(account.accountId, 'quick-save') : null;
    const archive = JSON.parse(await owner.exportArchive()) as {
      families: Array<{ name: string; count: number; sha256: string }> };
    output.textContent = JSON.stringify({ label, accountId: account?.accountId,
      accountRevision: account?.revision, quickStatus: quick?.status,
      quickArtifactId: quick?.status === 'ready' ? quick.loaded.sessionControl.loadedArtifactId : null,
      quickPublicationId: quick?.status === 'ready' ? quick.loaded.publication.publicationId : null,
      pendingStatus: pending?.status, pendingPublicationId: pending?.publicationId,
      families: archive.families.map(family => ({ name: family.name, count: family.count, sha256: family.sha256 })) }, null, 2);
  } catch (error) { output.textContent = `INSPECT FAILED: ${error instanceof Error ? error.message : String(error)}`; }
  finally { owner.close(); }
}
for (const [id, target, mode] of [
  ['arm-publication-quota', 'artifacts', 'quota'],
  ['arm-publication-abort', 'artifacts', 'abort'],
  ['arm-consumer-quota', 'accounts', 'quota'],
  ['arm-consumer-abort', 'accounts', 'abort']
] as const) document.querySelector<HTMLButtonElement>(`#${id}`)!.onclick = () => {
  armed = { target, mode }; output.textContent = `ARMED ${target} ${mode}`;
};
document.querySelector<HTMLButtonElement>('#inspect')!.onclick = () => { void inspect('selected readback'); };
await inspect('before mounted App');
await import('./src/main.tsx');
