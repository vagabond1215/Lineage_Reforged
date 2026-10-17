import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const rows: unknown[] = [];
let settledArchive = '';
let accountId = '';
let campaignId = '';
let publicationId = '';
let revision = 0;
type Archive = { families: Array<{ name: string; count: number; sha256: string }> };
const parsed = (text: string) => JSON.parse(text) as Archive;
const signature = (a: Archive) => a.families.map(f => ({ name: f.name, count: f.count, sha256: f.sha256 }));
const same = (a: Archive, b: Archive) => JSON.stringify(signature(a)) === JSON.stringify(signature(b));
function check(value: unknown, label: string): asserts value { if (!value) throw Error(label); }
function report(label: string, value: Record<string, unknown>) {
  rows.push({ label, ...value }); output.textContent = JSON.stringify({ status: 'RUNNING', rows }, null, 2);
}
async function prepare() {
  const source = await openCleanEpochAccountStore();
  let text: string;
  try { text = await source.exportArchive(); } finally { source.close(); }
  const owner = await openCleanEpochAccountStore({ name: `lineage.g10d2.closure.source.${crypto.randomUUID()}` });
  try {
    await owner.restoreArchive(text);
    const account = (await owner.list())[0]!;
    accountId = account.accountId;
    const slot = await owner.readSlot(accountId, 'quick-save');
    check(slot.status === 'ready', 'terminal head absent');
    const retired = await new CleanEpochTerminalAdapter(owner).retire({ accountId,
      sourceSlotId: 'quick-save', expectedAccountRevision: account.revision,
      snapshot: slot.loaded.snapshot, control: slot.loaded.sessionControl,
      expectedSourceAddress: { artifactId: slot.loaded.sessionControl.loadedArtifactId,
        publicationId: slot.loaded.sessionControl.loadedPublicationId } });
    check(retired.status === 'completed' && retired.recovery.addressSlotIds.length === 2,
      'settled source lacks two terminal addresses');
    campaignId = retired.recovery.campaignId;
    publicationId = retired.recovery.publicationId;
    revision = retired.account.revision;
    settledArchive = await owner.exportArchive();
    report('settled-source', { accountId, campaignId, publicationId, revision,
      addressSlotIds: retired.recovery.addressSlotIds,
      bytes: new TextEncoder().encode(settledArchive).byteLength,
      families: signature(parsed(settledArchive)) });
  } finally { owner.close(); }
}
async function clone(label: string) {
  const name = `lineage.g10d2.closure.${label}.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name });
  await owner.restoreArchive(settledArchive); owner.close(); return name;
}
async function closure(name: string, mode?: 'quota' | 'abort', ordinal?: number) {
  let writes = 0;
  const owner = await openCleanEpochAccountStore({ name,
    beforeWrite: () => {
      if (++writes === ordinal && mode === 'quota')
        throw new DOMException('synthetic closure quota', 'QuotaExceededError');
    },
    afterWrite: tx => { if (writes === ordinal && mode === 'abort') tx.abort(); } });
  try {
    const before = parsed(await owner.exportArchive());
    let status = ''; let code = '';
    try { status = (await owner.closeTerminalAddresses(accountId, campaignId,
      publicationId, revision, new Date().toISOString())).status; }
    catch (error) { code = (error as { code?: string }).code ?? 'unknown'; }
    return { before, after: parsed(await owner.exportArchive()), status, code, writes };
  } finally { owner.close(); }
}
async function faultRow(mode: 'quota' | 'abort', ordinal: number) {
  const label = `D4-T2-closure-${mode}-${ordinal}`;
  const name = await clone(label);
  const tested = await closure(name, mode, ordinal);
  check(tested.status === '' && tested.code !== '', `${label}: faulted closure succeeded`);
  const owner = await openCleanEpochAccountStore({ name });
  try {
    const durable = parsed(await owner.exportArchive());
    check(same(tested.before, tested.after) && same(tested.before, durable),
      `${label}: partial closure after restart`);
    const pending = await owner.readTerminalRecovery(accountId, campaignId, publicationId);
    check(pending?.status === 'settlement_completed' && !pending.addressClosure,
      `${label}: settlement or closure marker drift`);
    check((await owner.readSlot(accountId, 'quick-save')).status === 'closed' &&
      (await owner.readSlot(accountId, 'slot-1')).status === 'closed',
      `${label}: terminal address incorrectly open/empty`);
    const completed = await owner.closePendingTerminalAddressesForAccount(accountId);
    check(completed === 1 && await owner.closePendingTerminalAddressesForAccount(accountId) === 0,
      `${label}: closure retry not exact once`);
    const final = parsed(await owner.exportArchive());
    check(final.families.find(f => f.name === 'addressDeletionReceipts')!.count ===
      tested.before.families.find(f => f.name === 'addressDeletionReceipts')!.count + 2,
      `${label}: expected two terminal receipts`);
    report(label, { mode, ordinal, observedWrites: tested.writes, code: tested.code,
      result: 'EXACT_SETTLED_PRIOR_THEN_TWO_ADDRESSES_CLOSED_ONCE' });
  } finally { owner.close(); }
}
async function main() {
  await prepare();
  const trialName = await clone('calibration');
  const trial = await closure(trialName);
  check(trial.status === 'committed' && trial.writes >= 3, 'closure calibration failed');
  report('closure-calibration', { writes: trial.writes });
  for (const mode of ['quota', 'abort'] as const)
    for (const ordinal of new Set([1, Math.ceil(trial.writes / 2), trial.writes]))
      await faultRow(mode, ordinal);
  output.textContent = JSON.stringify({ status: 'PASS_TERMINAL_CLOSURE', rows }, null, 2);
}
document.querySelector<HTMLButtonElement>('#run')!.onclick = () => {
  document.querySelector<HTMLButtonElement>('#run')!.disabled = true;
  void main().catch(error => { output.textContent = JSON.stringify({ status: 'FAIL',
    error: error instanceof Error ? error.message : String(error), rows }, null, 2); });
};
