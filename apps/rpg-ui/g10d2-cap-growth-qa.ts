import { CLEAN_EPOCH_ARCHIVE_MAX_BYTES, openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const cap = CLEAN_EPOCH_ARCHIVE_MAX_BYTES;
const sourceName = `lineage.g10d2.cap.${crypto.randomUUID()}`;
const accountId = 'account.local.fea179d5-ab9b-4cce-bc3f-fdb8602ca83e';
const rows: unknown[] = [];
function check(value: unknown, label: string): asserts value { if (!value) throw Error(label); }
async function digest(value: string) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))]
    .map(byte => byte.toString(16).padStart(2, '0')).join('');
}
function report(label: string, value: Record<string, unknown>) {
  rows.push({ label, ...value }); output.textContent = JSON.stringify({ status: 'RUNNING', rows }, null, 2);
}
async function main() {
  const source = await openCleanEpochAccountStore();
  let initial: string;
  try { initial = await source.exportArchive(); } finally { source.close(); }
  let owner = await openCleanEpochAccountStore({ name: sourceName });
  await owner.restoreArchive(initial);
  let current = await owner.readSlot(accountId, 'quick-save');
  check(current.status === 'ready', 'known synthetic head absent');
  let accepted = 0;
  let lastGood = await owner.exportArchive();
  let lastBytes = new TextEncoder().encode(lastGood).byteLength;
  let lastArtifactId = current.loaded.sessionControl.loadedArtifactId;
  report('baseline', { accepted, bytes: lastBytes, artifactId: lastArtifactId });
  while (accepted < 1400) {
    const account = await owner.read(accountId);
    check(account && current.status === 'ready', 'cap growth source missing');
    const saved = await new CleanEpochDescendantAdapter(owner).save({ accountId,
      sourceSlotId: 'quick-save', destinationSlotId: 'quick-save', expectedAccountRevision: account.revision,
      expectedDestinationAddress: { artifactId: current.loaded.sessionControl.loadedArtifactId,
        publicationId: current.loaded.sessionControl.loadedPublicationId },
      snapshot: current.loaded.snapshot, control: current.loaded.sessionControl });
    check(saved.status === 'ready', `owner cap-growth save ${accepted + 1} blocked`);
    current = saved.value;
    accepted++;
    const interval = lastBytes > 65_500_000 ? 1 : lastBytes > 60_000_000 ? 5
      : lastBytes > 45_000_000 ? 20 : 100;
    if (accepted % interval !== 0) continue;
    let text: string;
    try { text = await owner.exportArchive(); }
    catch {
      report('archive-cap-crossed', { accepted, lastGoodAccepted: accepted - interval,
        lastGoodBytes: lastBytes, capBytes: cap });
      break;
    }
    const bytes = new TextEncoder().encode(text).byteLength;
    check(bytes <= cap && bytes >= lastBytes, 'archive growth nonmonotonic or over cap');
    lastGood = text; lastBytes = bytes;
    lastArtifactId = current.loaded.sessionControl.loadedArtifactId;
    report('valid-in-cap', { accepted, bytes, artifactId: lastArtifactId });
    if (cap - bytes < 80_000) break;
  }
  owner.close();
  check(lastBytes > 62_000_000 && lastBytes <= cap,
    `did not approach cap with valid owner archive: ${lastBytes}`);
  const valid = JSON.parse(lastGood) as { families: Array<{ name: string; count: number; sha256: string }> };
  const targetName = `lineage.g10d2.cap.restore.${crypto.randomUUID()}`;
  owner = await openCleanEpochAccountStore({ name: targetName });
  try { await owner.restoreArchive(lastGood);
    const actual = JSON.parse(await owner.exportArchive()) as typeof valid;
    check(actual.families.length === 14 && actual.families.every((f, index) =>
      f.name === valid.families[index]!.name && f.count === valid.families[index]!.count &&
      f.sha256 === valid.families[index]!.sha256), 'near-cap archive failed exact restore');
  } finally { owner.close(); }
  const over = lastGood + ' '.repeat(cap + 1 - lastBytes);
  check(new TextEncoder().encode(over).byteLength === cap + 1, 'over-cap byte probe incorrect');
  const overName = `lineage.g10d2.cap.reject.${crypto.randomUUID()}`;
  owner = await openCleanEpochAccountStore({ name: overName });
  let overCode = '';
  try { await owner.restoreArchive(over); }
  catch (error) { overCode = (error as { code?: string }).code ?? 'unknown'; }
  finally { owner.close(); }
  check(overCode !== '', 'over-cap input accepted');
  owner = await openCleanEpochAccountStore({ name: overName });
  try { check((JSON.parse(await owner.exportArchive()) as typeof valid).families.every(f => f.count === 0),
    'over-cap target not empty'); }
  finally { owner.close(); }
  report('D5-E2-near-cap', { acceptedAtLastGood: accepted, validBytes: lastBytes,
    validSha256: await digest(lastGood), capBytes: cap, bytesBelowCap: cap - lastBytes,
    validFamilies: valid.families.map(f => ({ name: f.name, count: f.count, sha256: f.sha256 })),
    validRestore: 'EXACT_14_FAMILY_GRAPH', syntheticOverCapBytes: cap + 1,
    overCapCode: overCode, overCapTarget: 'EMPTY',
    note: 'Over-cap padding tests size rejection only; no padded input is counted as a valid archive.' });
  output.textContent = JSON.stringify({ status: 'PASS_NEAR_64_MIB_CAP', rows }, null, 2);
  document.querySelector<HTMLButtonElement>('#download')!.disabled = false;
}
document.querySelector<HTMLButtonElement>('#run')!.onclick = () => {
  document.querySelector<HTMLButtonElement>('#run')!.disabled = true;
  void main().catch(error => { output.textContent = JSON.stringify({ status: 'FAIL',
    error: error instanceof Error ? error.message : String(error), rows }, null, 2); });
};
document.querySelector<HTMLButtonElement>('#download')!.onclick = () => {
  const url = URL.createObjectURL(new Blob([output.textContent ?? ''], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'g10d2-cap-growth-nonsecret.json';
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30_000);
};
