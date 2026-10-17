import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochTerminalAdapter } from './src/game-shell/cleanEpochTerminalAdapter.ts';
import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const rows: unknown[] = [];
let sourceText = '';
type Archive = { families: Array<{ name: string; count: number; sha256: string; rows: unknown[] }> };
type Fault = { phase: 'publication' | 'settlement' | 'direct'; mode: 'quota' | 'abort'; ordinal: number };
const parsed = (text: string) => JSON.parse(text) as Archive;
const family = (a: Archive, name: string) => a.families.find(f => f.name === name)!;
const signature = (a: Archive) => a.families.map(f => ({ name: f.name, count: f.count, sha256: f.sha256 }));
const same = (a: Archive, b: Archive) => JSON.stringify(signature(a)) === JSON.stringify(signature(b));
function check(value: unknown, label: string): asserts value { if (!value) throw Error(label); }
function report(label: string, value: Record<string, unknown>) {
  rows.push({ label, ...value }); output.textContent = JSON.stringify({ status: 'RUNNING', rows }, null, 2);
}
async function clone(label: string) {
  const name = `lineage.g10d2.mixed.${label}.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name });
  await owner.restoreArchive(sourceText); owner.close(); return name;
}
function hooks(name: string, fault?: Fault) {
  let phase: Fault['phase'] = 'direct';
  const counts = { publication: 0, settlement: 0, direct: 0 };
  return { counts, setPhase: (value: Fault['phase']) => { phase = value; },
    open: () => openCleanEpochAccountStore({ name,
      beforeWrite: () => {
        const ordinal = ++counts[phase];
        if (fault?.phase === phase && fault.mode === 'quota' && ordinal === fault.ordinal)
          throw new DOMException('synthetic mixed quota', 'QuotaExceededError');
      },
      afterWrite: tx => {
        if (fault?.phase === phase && fault.mode === 'abort' && counts[phase] === fault.ordinal)
          tx.abort();
      } }) };
}
async function terminal(name: string, fault?: Fault) {
  const hook = hooks(name, fault); hook.setPhase('publication');
  const owner = await hook.open();
  try {
    const account = (await owner.list())[0]!;
    const slot = await owner.readSlot(account.accountId, 'quick-save');
    check(slot.status === 'ready', 'terminal source head not ready');
    const before = parsed(await owner.exportArchive());
    const original = owner.completeTerminalSettlement.bind(owner);
    owner.completeTerminalSettlement = (...args) => {
      hook.setPhase('settlement'); return original(...args);
    };
    const result = await new CleanEpochTerminalAdapter(owner).retire({ accountId: account.accountId,
      sourceSlotId: 'quick-save', expectedAccountRevision: account.revision,
      snapshot: slot.loaded.snapshot, control: slot.loaded.sessionControl,
      expectedSourceAddress: { artifactId: slot.loaded.sessionControl.loadedArtifactId,
        publicationId: slot.loaded.sessionControl.loadedPublicationId } });
    const after = parsed(await owner.exportArchive());
    return { before, after, result, counts: hook.counts, accountId: account.accountId,
      head: slot.loaded.sessionControl.loadedArtifactId };
  } finally { owner.close(); }
}
async function terminalFault(label: string, fault: Fault) {
  const name = await clone(label);
  const tested = await terminal(name, fault);
  check(tested.result.status === 'blocked', `${label}: faulted terminal completed`);
  const owner = await openCleanEpochAccountStore({ name });
  try {
    const after = parsed(await owner.exportArchive());
    check(same(tested.after, after), `${label}: restart drift`);
    if (fault.phase === 'publication') {
      check(same(tested.before, after), `${label}: precommit terminal changed graph`);
      const prior = await owner.readSlot(tested.accountId, 'quick-save');
      check(prior.status === 'ready' && prior.loaded.sessionControl.loadedArtifactId === tested.head,
        `${label}: prior terminal source moved`);
    } else {
      const pending = await owner.readPendingTerminalForAccount(tested.accountId);
      check(pending?.status === 'accepted_pending_settlement', `${label}: terminal pending missing`);
      check(family(after, 'artifacts').count === family(tested.before, 'artifacts').count + 1,
        `${label}: pending terminal artifact missing`);
      const resumed = await new CleanEpochTerminalAdapter(owner).resumePending(tested.accountId);
      check(resumed?.status === 'completed' && resumed.recovery.publicationId === pending.publicationId,
        `${label}: exact terminal settle failed`);
      const second = await owner.completeTerminalSettlement(tested.accountId,
        pending.campaignId, pending.publicationId);
      check(second.status === 'same_source_retry', `${label}: duplicate terminal settlement`);
    }
    report(label, { fault, blockedCode: tested.result.code, writeCounts: tested.counts,
      priorHead: tested.head, before: signature(tested.before), after: signature(after),
      result: fault.phase === 'publication' ? 'EXACT_PRIOR' : 'ONE_PENDING_EXACT_SETTLEMENT' });
  } finally { owner.close(); }
}
async function registerEmpty(name: string) {
  const id = `account.local.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name });
  try { await owner.register(createDefaultAccountProfileState({ accountId: id, displayName: 'D4 Lifecycle' }),
    await createCredentialRecord(id, 'synthetic-only-password', new Date().toISOString())); }
  finally { owner.close(); }
  return id;
}
async function lifecycle(name: string, id: string, kind: 'reset' | 'delete', fault?: Fault) {
  const hook = hooks(name, fault); const owner = await hook.open();
  try {
    const before = parsed(await owner.exportArchive());
    let status = ''; let code = '';
    try { status = (await owner.transitionAccount(kind, { accountId: id,
      expectedRevision: 1, expectedGeneration: 1, currentPassword: 'synthetic-only-password',
      ...(kind === 'delete' ? { requestId: crypto.randomUUID() } : {}) })).status; }
    catch (error) { code = (error as { code?: string }).code ?? 'unknown'; }
    return { before, after: parsed(await owner.exportArchive()), status, code, counts: hook.counts };
  } finally { owner.close(); }
}
async function lifecycleFault(kind: 'reset' | 'delete', mode: Fault['mode'], ordinal: number) {
  const label = `D4-L1-${kind}-${mode}-${ordinal}`;
  const name = await clone(label); const id = await registerEmpty(name);
  const tested = await lifecycle(name, id, kind, { phase: 'direct', mode, ordinal });
  check(tested.status === '' && tested.code !== '', `${label}: fault not blocked`);
  const owner = await openCleanEpochAccountStore({ name });
  try { const durable = parsed(await owner.exportArchive());
    check(same(tested.before, tested.after) && same(tested.before, durable),
      `${label}: lifecycle transaction partial`);
    check((await owner.read(id))?.revision === 1 && await owner.readLifecycleReceipt(id) === null,
      `${label}: lifecycle tombstone/account changed`);
    report(label, { fault: { mode, ordinal }, code: tested.code, writeCounts: tested.counts,
      result: 'EXACT_PRIOR_AFTER_RESTART' });
  } finally { owner.close(); }
}
async function deletion(name: string, fault?: Fault) {
  const hook = hooks(name, fault); const owner = await hook.open();
  try {
    const account = (await owner.list())[0]!;
    const slot = await owner.readSlot(account.accountId, 'slot-2');
    check(slot.status === 'ready', 'address deletion source missing');
    const before = parsed(await owner.exportArchive());
    const pointer = (family(before, 'currentSlotGenerations').rows as Array<{
      accountId: string; slotId: string; slotGenerationId: string }>).find(row =>
      row.accountId === account.accountId && row.slotId === 'slot-2')!;
    const input = { accountId: account.accountId, slotId: 'slot-2' as const,
      expectedAccountRevision: account.revision, expectedSlotGenerationId: pointer.slotGenerationId,
      expectedAddress: { artifactId: slot.loaded.sessionControl.loadedArtifactId,
        publicationId: slot.loaded.sessionControl.loadedPublicationId },
      deletedAt: new Date().toISOString() };
    let status = ''; let code = '';
    try { status = (await owner.deleteSlotAddress(input)).status; }
    catch (error) { code = (error as { code?: string }).code ?? 'unknown'; }
    return { before, after: parsed(await owner.exportArchive()), status, code,
      counts: hook.counts, accountId: account.accountId, sourceId: input.expectedAddress.artifactId };
  } finally { owner.close(); }
}
async function deletionFault(mode: Fault['mode'], ordinal: number) {
  const label = `D4-L1-address-${mode}-${ordinal}`;
  const name = await clone(label);
  const tested = await deletion(name, { phase: 'direct', mode, ordinal });
  check(tested.status === '' && tested.code !== '', `${label}: fault not blocked`);
  const owner = await openCleanEpochAccountStore({ name });
  try { const durable = parsed(await owner.exportArchive());
    check(same(tested.before, tested.after) && same(tested.before, durable),
      `${label}: deletion transaction partial`);
    const slot = await owner.readSlot(tested.accountId, 'slot-2');
    check(slot.status === 'ready' && slot.loaded.sessionControl.loadedArtifactId === tested.sourceId,
      `${label}: source address lost`);
    report(label, { fault: { mode, ordinal }, code: tested.code, writeCounts: tested.counts,
      result: 'EXACT_PRIOR_AFTER_RESTART' });
  } finally { owner.close(); }
}
async function main() {
  const source = await openCleanEpochAccountStore();
  try { sourceText = await source.exportArchive(); } finally { source.close(); }
  const base = parsed(sourceText);
  check(base.families.length === 14 && family(base, 'artifacts').count >= 120 &&
    family(base, 'witnesses').count >= 1, 'grown mixed source unavailable');
  report('source', { archiveBytes: new TextEncoder().encode(sourceText).byteLength,
    families: signature(base) });
  const tName = await clone('terminal-calibration');
  const t = await terminal(tName);
  check(t.result.status === 'completed', 'terminal calibration failed');
  report('terminal-calibration', { counts: t.counts });
  for (const mode of ['quota', 'abort'] as const)
    for (const ordinal of new Set([1, Math.ceil(t.counts.publication / 2), t.counts.publication]))
      await terminalFault(`D4-T1-${mode}-${ordinal}`,
        { phase: 'publication', mode, ordinal });
  for (const mode of ['quota', 'abort'] as const)
    for (const ordinal of new Set([1, Math.ceil(t.counts.settlement / 2), t.counts.settlement]))
      await terminalFault(`D4-T2-${mode}-${ordinal}`,
        { phase: 'settlement', mode, ordinal });
  for (const kind of ['reset', 'delete'] as const) {
    const name = await clone(`${kind}-calibration`);
    const id = await registerEmpty(name);
    const calibrated = await lifecycle(name, id, kind);
    check(calibrated.status === 'committed', `${kind} calibration failed`);
    report(`${kind}-calibration`, { counts: calibrated.counts });
    for (const mode of ['quota', 'abort'] as const)
      for (const ordinal of new Set([1, Math.ceil(calibrated.counts.direct / 2), calibrated.counts.direct]))
        await lifecycleFault(kind, mode, ordinal);
  }
  const dName = await clone('address-calibration');
  const d = await deletion(dName);
  check(d.status === 'committed', 'address calibration failed');
  report('address-calibration', { counts: d.counts });
  for (const mode of ['quota', 'abort'] as const)
    for (const ordinal of new Set([1, Math.ceil(d.counts.direct / 2), d.counts.direct]))
      await deletionFault(mode, ordinal);
  output.textContent = JSON.stringify({ status: 'PASS_D4_T_L_PARTIAL', rows }, null, 2);
}
document.querySelector<HTMLButtonElement>('#run')!.onclick = () => {
  document.querySelector<HTMLButtonElement>('#run')!.disabled = true;
  void main().catch(error => { output.textContent = JSON.stringify({ status: 'FAIL',
    error: error instanceof Error ? error.message : String(error), rows }, null, 2); });
};
