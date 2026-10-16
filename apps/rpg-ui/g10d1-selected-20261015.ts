import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#audit')!;
const a = document.querySelector<HTMLIFrameElement>('#a')!;
const b = document.querySelector<HTMLIFrameElement>('#b')!;
const password = 'disposable-g10d1-local-only';
const checkpoints: unknown[] = [];
const events: string[] = [];
let accepted = 0;
let loads = 0;
let restarts = 0;
document.querySelector<HTMLButtonElement>('#download')!.onclick = () => {
  const blob = new Blob([output.textContent ?? ''], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'g10d1-nonsecret-selected-result.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
};

function doc(frame: HTMLIFrameElement): Document {
  if (!frame.contentDocument) throw Error('Selected App frame unavailable');
  return frame.contentDocument;
}
function button(frame: HTMLIFrameElement, label: string): HTMLButtonElement | null {
  const buttons = [...doc(frame).querySelectorAll<HTMLButtonElement>('button')];
  const normalized = label.replace(/\s/g, '').toLowerCase();
  return buttons.find(item => item.textContent?.replace(/\s/g, '').toLowerCase() === normalized
      || item.getAttribute('aria-label')?.toLowerCase() === label.toLowerCase())
    ?? (label === 'Load Selected Save' ? buttons.find(item => item.textContent?.trim().startsWith(label)) : null)
    ?? null;
}
function click(frame: HTMLIFrameElement, label: string) {
  const found = button(frame, label);
  if (!found || found.disabled) throw Error(`Selected ${label} unavailable; UI=${doc(frame).body.innerText.slice(0, 350)}`);
  found.click();
}
function fill(frame: HTMLIFrameElement, selector: string, value: string) {
  const found = doc(frame).querySelector<HTMLInputElement>(selector);
  if (!found) throw Error(`Missing selected ${selector}`);
  const realm = frame.contentWindow as Window & typeof globalThis;
  Object.getOwnPropertyDescriptor(realm.HTMLInputElement.prototype, 'value')!.set!.call(found, value);
  found.dispatchEvent(new realm.Event('input', { bubbles: true }));
}
async function until<T>(read: () => Promise<T | null | undefined | false> | T | null | undefined | false,
  label: string): Promise<T> {
  for (let i = 0; i < 1200; i++) {
    const result = await read();
    if (result) return result;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw Error(`Timed out: ${label}; A=${doc(a).body.innerText.slice(0, 400)}; B=${doc(b).body.innerText.slice(0, 400)}`);
}
async function reload(frame: HTMLIFrameElement) {
  const loaded = new Promise<void>(resolve => frame.addEventListener('load', () => resolve(), { once: true }));
  frame.contentWindow!.location.reload();
  await loaded;
  restarts++;
  await until(() => doc(frame).querySelector('.launcher-save-row') ? true : null, 'restarted selected launcher');
}
async function archive() {
  const owner = await openCleanEpochAccountStore();
  try {
    const text = await owner.exportArchive();
    const manifest = JSON.parse(text) as { sha256: string; families: Array<{ name: string; count: number;
      sha256: string; rows: unknown[] }> };
    const encoded = new TextEncoder().encode(text);
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', encoded)))
      .map(byte => byte.toString(16).padStart(2, '0')).join('');
    const families = manifest.families.map(family => ({ name: family.name, count: family.count,
      serializedRowsBytes: new TextEncoder().encode(JSON.stringify(family.rows)).byteLength,
      sha256: family.sha256 }));
    if (families.length !== 14) throw Error(`Expected fourteen families; found ${families.length}`);
    const rows = (name: string) => manifest.families.find(family => family.name === name)?.rows ?? [];
    const accounts = rows('accounts').map(row => { const item = row as { accountId: string; revision: number;
      lifecycleGeneration: number; profile?: { history?: { runRecords?: Array<{ characterId: string }> } } };
      return { accountId: item.accountId, revision: item.revision,
        lifecycleGeneration: item.lifecycleGeneration,
        runCount: item.profile?.history?.runRecords?.length ?? null,
        historicalCharacterIds: item.profile?.history?.runRecords?.map(run => run.characterId) ?? [] }; });
    const heads = rows('controls').map(row => { const item = row as { accountId: string; campaignId: string;
      value: { headArtifactId: string; headPublicationId: string; headRevision: number } };
      return { accountId: item.accountId, campaignId: item.campaignId,
        artifactId: item.value.headArtifactId, publicationId: item.value.headPublicationId,
        revision: item.value.headRevision }; });
    const generations = new Map(rows('currentSlotGenerations').map(row => {
      const item = row as { accountId: string; slotId: string; slotGenerationId: string };
      return [`${item.accountId}\u0000${item.slotId}`, item.slotGenerationId];
    }));
    const addresses = rows('slots').map(row => { const item = row as { accountId: string; slotId: string;
      artifactId: string; publicationId: string };
      return { accountId: item.accountId, slotId: item.slotId, artifactId: item.artifactId,
        publicationId: item.publicationId,
        slotGenerationId: generations.get(`${item.accountId}\u0000${item.slotId}`) ?? null }; });
    const history = rows('artifacts').map(row => { const item = row as { artifactId: string };
      return item.artifactId; });
    const estimate = navigator.storage?.estimate ? await navigator.storage.estimate() : null;
    const persisted = navigator.storage?.persisted ? await navigator.storage.persisted() : null;
    return { accepted, archiveBytes: encoded.byteLength, archiveSha256: digest,
      manifestSha256: manifest.sha256, families, accounts, heads, addresses, historicalArtifactIds: history,
      storage: { usage: estimate?.usage ?? null, quota: estimate?.quota ?? null, persisted } };
  } finally { owner.close(); }
}
async function selectedHead(accountId: string) {
  const owner = await openCleanEpochAccountStore();
  try {
    const slot = await owner.readSlot(accountId, 'slot-1');
    if (slot.status !== 'ready') throw Error(`Slot 1 ${slot.status}`);
    const account = (await owner.list()).find(item => item.accountId === accountId);
    if (!account) throw Error('Selected account missing');
    return { artifactId: slot.loaded.sessionControl.loadedArtifactId,
      publicationId: slot.loaded.sessionControl.loadedPublicationId,
      headRevision: slot.loaded.sessionControl.campaignHeadRevision, accountRevision: account.revision };
  } finally { owner.close(); }
}
function publish() {
  output.textContent = JSON.stringify({ status: 'RUNNING', accepted, loads, restarts, events,
    checkpoints }, null, 2);
}
async function load(frame: HTMLIFrameElement) {
  if (button(frame, 'Open settings')) click(frame, 'Open settings');
  if (button(frame, 'Return To Main Menu')) click(frame, 'Return To Main Menu');
  await until(() => button(frame, 'Load Game / Quick Save'), 'selected launcher load control');
  click(frame, 'Load Game / Quick Save');
  await until(() => button(frame, 'Load Selected Save'), 'preferred current-head load');
  click(frame, 'Load Selected Save');
  await until(() => button(frame, 'Open settings'), 'selected loaded campaign');
  loads++;
  click(frame, 'Open settings');
  await until(() => button(frame, 'Save'), 'selected Save after load');
}
async function main() {
  await until(() => button(a, 'Create Account') && button(b, 'Create Account') ? true : null,
    'two mounted default Apps');
  if (a.contentWindow === b.contentWindow || a.contentWindow!.location.origin !== b.contentWindow!.location.origin)
    throw Error('Two distinct same-origin selected contexts required');
  const name = `G10D1 fresh ${crypto.randomUUID().slice(0, 8)}`;
  fill(a, 'input[autocomplete="nickname"]', name);
  for (const input of doc(a).querySelectorAll<HTMLInputElement>('input[autocomplete="new-password"]')) {
    const realm = a.contentWindow as Window & typeof globalThis;
    Object.getOwnPropertyDescriptor(realm.HTMLInputElement.prototype, 'value')!.set!.call(input, password);
    input.dispatchEvent(new realm.Event('input', { bubbles: true }));
  }
  doc(a).querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
  click(a, 'Create Account');
  const row = await until(() => doc(a).querySelector<HTMLElement>('.launcher-save-row.is-empty'),
    'first empty selected slot');
  row.click();
  await until(() => button(a, 'Randomize Character'), 'selected creator');
  for (let i = 0; i < 80 && ![...doc(a).querySelectorAll('button')]
    .some(item => item.textContent?.includes('8Finalize')); i++) {
    click(a, 'Randomize Character');
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  const finalize = await until(() => [...doc(a).querySelectorAll<HTMLButtonElement>('button')]
    .find(item => item.textContent?.includes('8Finalize')) ?? null, 'complete selected creator');
  finalize.click();
  await until(() => button(a, 'Begin Journey'), 'selected Finalize');
  click(a, 'Begin Journey');
  await until(() => button(a, 'Open settings'), 'first selected campaign');
  click(a, 'Open settings');
  await until(() => button(a, 'Save'), 'first selected Save control');
  const owner = await openCleanEpochAccountStore();
  const account = (await owner.list()).find(item => item.profile.displayName === name);
  owner.close();
  if (!account) throw Error('New synthetic account missing');
  checkpoints.push(await archive());
  events.push('BASELINE selected first campaign; no descendant save');
  publish();

  let active = a;
  let lastHead = await selectedHead(account.accountId);
  for (let block = 1; block <= 6; block++) {
    const next = block === 2 || block === 4 ? b : a;
    if (next === b && block === 2) await reload(b);
    if (next !== active || block === 1) await load(next);
    active = next;
    for (let index = 0; index < 20; index++) {
      const currentSlot = doc(active).body.innerText.match(/CURRENT SLOT\s+(Slot 1|Quick Save)/)?.[1];
      if (!currentSlot) throw Error(`Selected current slot not visible at save ${accepted + 1}`);
      const useQuick = currentSlot === 'Slot 1' && accepted % 2 === 1;
      const destination = useQuick || currentSlot === 'Quick Save' ? 'quick-save' : 'slot-1';
      const beforePanel = doc(active).body.innerText.match(/CURRENT SLOT[\s\S]*?SESSION STATE/)?.[0];
      click(active, useQuick ? 'Quick Save' : 'Save');
      const destinationLabel = destination === 'slot-1' ? 'Slot 1' : 'Quick Save';
      await until(() => {
        if (button(active, 'Retry campaign data')) throw Error(`Selected save ${accepted + 1} visibly blocked`);
        const text = doc(active).body.innerText;
        const panel = text.match(/CURRENT SLOT[\s\S]*?SESSION STATE/)?.[0];
        return panel && panel !== beforePanel &&
          text.includes(`Saved to ${destinationLabel} and verified its exact ready address.`) ? true : null;
      }, `selected ${destinationLabel} acknowledgement ${accepted + 1}`);
      await new Promise(resolve => setTimeout(resolve, 25));
      const after = await until(async () => {
        const owner = await openCleanEpochAccountStore();
        try {
          const slot = await owner.readSlot(account.accountId, destination);
          const current = (await owner.list()).find(item => item.accountId === account.accountId);
          if (slot.status !== 'ready' || !current) return null;
          const control = slot.loaded.sessionControl;
          if (control.campaignHeadRevision !== lastHead.headRevision + 1) return null;
          return { artifactId: control.loadedArtifactId, publicationId: control.loadedPublicationId,
            headRevision: control.campaignHeadRevision, accountRevision: current.revision };
        } finally { owner.close(); }
      }, `accepted selected save ${accepted + 1}`);
      if (after.accountRevision !== lastHead.accountRevision + 1)
        throw Error(`Save ${accepted + 1} account revision mismatch: ${JSON.stringify({ lastHead, after })}`);
      lastHead = after;
      accepted++;
      if (accepted % 5 === 0) { events.push(`accepted ${accepted}`); publish(); }
    }
    const measured = await archive();
    const descendantCount = measured.families.find(family => family.name === 'descendantPublicationRecoveries')?.count;
    if (descendantCount !== accepted || measured.heads[0]?.revision !== accepted + 1)
      throw Error(`Checkpoint ${accepted} graph count/head mismatch: ${descendantCount}/${measured.heads[0]?.revision}`);
    checkpoints.push(measured);
    events.push(`CHECKPOINT ${accepted} complete`);
    publish();
    for (let i = 0; i < 4; i++) await load(active);
    await reload(active);
    await load(active);
    if (block % 2 === 0) { const other = active === a ? b : a; await reload(other); await load(other); }
    const reread = await archive();
    if (JSON.stringify({ families: reread.families, accounts: reread.accounts, heads: reread.heads,
      addresses: reread.addresses, history: reread.historicalArtifactIds }) !==
      JSON.stringify({ families: measured.families, accounts: measured.accounts, heads: measured.heads,
        addresses: measured.addresses, history: measured.historicalArtifactIds }))
      throw Error(`Checkpoint ${accepted} graph changed after selected loads/restarts`);
    events.push(`BLOCK ${block} selected loads/restarts completed`);
    publish();
  }
  output.textContent = JSON.stringify({ status: 'PASS_CAPACITY', accepted, loads, restarts, events,
    checkpoints }, null, 2);
}
main().catch(error => {
  output.textContent = JSON.stringify({ status: 'FAIL', accepted, loads, restarts,
    error: error instanceof Error ? error.message : String(error), events, checkpoints }, null, 2);
});
