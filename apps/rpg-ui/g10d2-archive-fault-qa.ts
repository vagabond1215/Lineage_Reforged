import { CLEAN_EPOCH_ARCHIVE_MAX_BYTES, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const rows: unknown[] = [];
type Archive = { families: Array<{ name: string; count: number; sha256: string; rows: unknown[] }> };
const parsed = (text: string) => JSON.parse(text) as Archive;
const signature = (a: Archive) => a.families.map(f => ({ name: f.name, count: f.count, sha256: f.sha256 }));
const same = (a: Archive, b: Archive) => JSON.stringify(signature(a)) === JSON.stringify(signature(b));
function check(value: unknown, label: string): asserts value { if (!value) throw Error(label); }
async function digest(value: string) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))]
    .map(byte => byte.toString(16).padStart(2, '0')).join('');
}
function report(label: string, value: Record<string, unknown>) {
  rows.push({ label, ...value }); output.textContent = JSON.stringify({ status: 'RUNNING', rows }, null, 2);
}
async function empty(name: string) {
  const owner = await openCleanEpochAccountStore({ name });
  try { return parsed(await owner.exportArchive()).families.every(f => f.count === 0); }
  finally { owner.close(); }
}
async function importFault(sourceText: string, source: Archive, mode: 'quota' | 'abort', ordinal: number) {
  const name = `lineage.g10d2.import.${mode}.${ordinal}.${crypto.randomUUID()}`;
  let writes = 0;
  let owner = await openCleanEpochAccountStore({ name,
    beforeWrite: () => {
      if (++writes === ordinal && mode === 'quota')
        throw new DOMException('synthetic archive quota', 'QuotaExceededError');
    },
    afterWrite: tx => { if (writes === ordinal && mode === 'abort') tx.abort(); } });
  let code = '';
  try { await owner.restoreArchive(sourceText); }
  catch (error) { code = (error as { code?: string }).code ?? 'unknown'; }
  owner.close();
  check(code !== '', `${mode} ${ordinal}: import unexpectedly succeeded`);
  check(await empty(name), `${mode} ${ordinal}: partial target after restart`);
  owner = await openCleanEpochAccountStore({ name });
  try {
    await owner.restoreArchive(sourceText);
    check(same(source, parsed(await owner.exportArchive())), `${mode} ${ordinal}: retry not complete`);
  } finally { owner.close(); }
  report(`D5-I1-${mode}-${ordinal}`, { faultOrdinal: ordinal, observedWrites: writes, code,
    targetAfterFault: 'EMPTY_AFTER_RESTART', retry: 'EXACT_ALL_14_FAMILIES' });
}
async function main() {
  const sourceOwner = await openCleanEpochAccountStore();
  let sourceText: string;
  try { sourceText = await sourceOwner.exportArchive(); } finally { sourceOwner.close(); }
  const source = parsed(sourceText);
  check(source.families.length === 14 && source.families.find(f => f.name === 'artifacts')!.count >= 120,
    'grown source unavailable');
  const sourceBytes = new TextEncoder().encode(sourceText).byteLength;
  report('source', { bytes: sourceBytes, sha256: await digest(sourceText), families: signature(source) });

  const readOwner = await openCleanEpochAccountStore();
  const oldGetAll = IDBObjectStore.prototype.getAll;
  let readCode = '';
  try {
    IDBObjectStore.prototype.getAll = function(...args) {
      if (this.name === 'artifacts') throw new DOMException('synthetic export read abort', 'AbortError');
      return oldGetAll.apply(this, args);
    };
    try { await readOwner.exportArchive(); }
    catch (error) { readCode = (error as { code?: string }).code ?? 'unknown'; }
  } finally { IDBObjectStore.prototype.getAll = oldGetAll; readOwner.close(); }
  check(readCode !== '', 'D5-E1 read fault reported success');
  const reopened = await openCleanEpochAccountStore();
  try { check(same(source, parsed(await reopened.exportArchive())), 'D5-E1 source changed'); }
  finally { reopened.close(); }
  report('D5-E1', { code: readCode, result: 'NO_PARTIAL_FILE_SOURCE_EXACT_AFTER_RESTART' });

  const capped = CLEAN_EPOCH_ARCHIVE_MAX_BYTES;
  check(sourceBytes < capped, 'valid source exceeds cap');
  const inCapName = `lineage.g10d2.in-cap.${crypto.randomUUID()}`;
  const inCap = await openCleanEpochAccountStore({ name: inCapName });
  try { await inCap.restoreArchive(sourceText);
    check(same(source, parsed(await inCap.exportArchive())), 'valid in-cap source not exact'); }
  finally { inCap.close(); }
  const overCap = sourceText + ' '.repeat(capped + 1 - sourceBytes);
  check(new TextEncoder().encode(overCap).byteLength === capped + 1, 'over-cap byte construction failed');
  const overName = `lineage.g10d2.over-cap.${crypto.randomUUID()}`;
  const over = await openCleanEpochAccountStore({ name: overName });
  let overCode = '';
  try { await over.restoreArchive(overCap); }
  catch (error) { overCode = (error as { code?: string }).code ?? 'unknown'; }
  finally { over.close(); }
  check(overCode !== '' && await empty(overName), 'over-cap input wrote target');
  report('D5-E2', { capBytes: capped, validInCapBytes: sourceBytes,
    validInCap: 'EXACT_ALL_14_FAMILIES', syntheticOverCapBytes: capped + 1,
    overCapCode: overCode, overCapTarget: 'EMPTY_AFTER_RESTART',
    note: 'Over-cap padding is only a size-rejection probe, never a valid archive.' });

  const rowCount = source.families.reduce((sum, f) => sum + f.count, 0);
  check(rowCount >= 120, 'grown source too small for first/middle/last');
  for (const mode of ['quota', 'abort'] as const)
    for (const ordinal of [1, Math.ceil(rowCount / 2), rowCount])
      await importFault(sourceText, source, mode, ordinal);
  const occupiedName = `lineage.g10d2.occupied.${crypto.randomUUID()}`;
  let occupied = await openCleanEpochAccountStore({ name: occupiedName });
  await occupied.restoreArchive(sourceText);
  occupied.close();
  occupied = await openCleanEpochAccountStore({ name: occupiedName });
  let occupiedCode = '';
  try { await occupied.restoreArchive(sourceText); }
  catch (error) { occupiedCode = (error as { code?: string }).code ?? 'unknown'; }
  check(occupiedCode === 'conflict' && same(source, parsed(await occupied.exportArchive())),
    'occupied target merged or changed');
  occupied.close();
  report('D5-I2-owner', { occupiedCode, result: 'REFUSED_EXACT_SOURCE_RETAINED' });
  output.textContent = JSON.stringify({ status: 'PASS_D5_OWNER_PARTIAL', rows }, null, 2);
  document.querySelector<HTMLButtonElement>('#download')!.disabled = false;
}
document.querySelector<HTMLButtonElement>('#run')!.onclick = () => {
  document.querySelector<HTMLButtonElement>('#run')!.disabled = true;
  void main().catch(error => { output.textContent = JSON.stringify({ status: 'FAIL',
    error: error instanceof Error ? error.message : String(error), rows }, null, 2); });
};
document.querySelector<HTMLButtonElement>('#download')!.onclick = () => {
  const url = URL.createObjectURL(new Blob([output.textContent ?? ''], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'g10d2-archive-fault-nonsecret.json';
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30_000);
};
