// Independent nonsecret reconciliation of the fixed G10D.5 selected checkpoint ledger.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const [ledgerPath, baselineReceiptPath, finalReceiptPath] = process.argv.slice(2);
if (!ledgerPath || !baselineReceiptPath || !finalReceiptPath) throw Error('Expected ledger and two selected receipts');
const read = path => { const bytes = readFileSync(path); return { bytes, value: JSON.parse(bytes.toString('utf8')) }; };
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (left, right) => assert.deepEqual(left, right);
const ledgerFile = read(ledgerPath);
const ledger = ledgerFile.value;
const checkpoints = ledger.checkpoints;
same(checkpoints.map(row => row.accepted), [0, 20, 40, 60, 80, 100, 120]);
assert.equal(ledger.status, 'PASS_CAPACITY_AND_SELECTED_DOWNLOAD_GATES');
assert.equal(ledger.accepted, 120);
assert.ok(ledger.loads >= 24 && ledger.restarts >= 6);
assert.ok(ledger.events.includes('BASELINE selected Settings download readback gate completed; graph unchanged'));
assert.ok(ledger.events.includes('FINAL selected Settings download readback gate completed; graph unchanged'));
const baseline = checkpoints[0];
const baseAccount = baseline.accounts[0];
assert.equal(baseline.accounts.length, 1);
assert.ok(baseAccount.runCount >= 3 && baseline.heads.length >= 3 && baseline.addresses.length >= 4);
const campaignId = baseline.addresses.find(row => row.slotId === 'slot-1')?.campaignId;
const baseHead = baseline.heads.find(row => row.campaignId === campaignId);
assert.ok(baseHead && baseline.addresses.some(row => row.campaignId === campaignId && row.artifactId !== baseHead.artifactId));
const baseWitness = baseline.families.find(row => row.name === 'witnesses');
const baseDescendants = baseline.families.find(row => row.name === 'descendantPublicationRecoveries')?.count;
const baseArtifacts = baseline.families.find(row => row.name === 'artifacts')?.count;
assert.ok(baseWitness?.count >= 1 && Number.isInteger(baseDescendants) && Number.isInteger(baseArtifacts));
const names = baseline.families.map(row => row.name);
assert.equal(names.length, 14);
const hex = /^[a-f0-9]{64}$/;
let priorArtifacts = new Set(baseline.historicalArtifactIds);
for (const row of checkpoints) {
  same(row.families.map(item => item.name), names);
  assert.ok(row.families.every(item => Number.isInteger(item.count) && item.count >= 0 &&
    Number.isInteger(item.serializedRowsBytes) && item.serializedRowsBytes >= 2 && hex.test(item.sha256)));
  assert.ok(Number.isInteger(row.archiveBytes) && row.archiveBytes > 0 && hex.test(row.archiveSha256));
  assert.equal(row.accounts.length, 1);
  assert.equal(row.accounts[0].accountId, baseAccount.accountId);
  assert.equal(row.accounts[0].lifecycleGeneration, baseAccount.lifecycleGeneration);
  assert.equal(row.accounts[0].revision, baseAccount.revision + row.accepted);
  assert.equal(row.accounts[0].runCount, baseAccount.runCount);
  same(row.accounts[0].historicalCharacterIds, baseAccount.historicalCharacterIds);
  assert.equal(row.families.find(item => item.name === 'descendantPublicationRecoveries')?.count,
    baseDescendants + row.accepted);
  assert.equal(row.families.find(item => item.name === 'artifacts')?.count, baseArtifacts + row.accepted);
  assert.equal(row.families.find(item => item.name === 'witnesses')?.count, baseWitness.count);
  assert.equal(row.families.find(item => item.name === 'witnesses')?.sha256, baseWitness.sha256);
  const head = row.heads.find(item => item.campaignId === campaignId);
  assert.equal(head?.revision, baseHead.revision + row.accepted);
  for (const other of baseline.heads.filter(item => item.campaignId !== campaignId))
    same(row.heads.find(item => item.campaignId === other.campaignId), other);
  assert.equal(row.addresses.length, baseline.addresses.length);
  for (const address of baseline.addresses) {
    const current = row.addresses.find(item => item.slotId === address.slotId);
    assert.ok(current);
    assert.equal(current.accountId, address.accountId);
    assert.equal(current.campaignId, address.campaignId);
    assert.equal(current.slotGenerationId, address.slotGenerationId);
    if (address.campaignId !== campaignId) same(current, address);
  }
  const artifacts = new Set(row.historicalArtifactIds);
  assert.equal(artifacts.size, baseArtifacts + row.accepted);
  for (const id of priorArtifacts) assert.ok(artifacts.has(id));
  priorArtifacts = artifacts;
  assert.ok(row.storage && Number.isFinite(row.storage.usage) && row.storage.usage >= 0 &&
    Number.isFinite(row.storage.quota) && row.storage.quota > 0 &&
    typeof row.storage.persisted === 'boolean');
}
const receiptFiles = [baselineReceiptPath, finalReceiptPath].map(read);
for (const [index, file] of receiptFiles.entries()) {
  const receipt = file.value;
  const row = checkpoints[index === 0 ? 0 : 6];
  assert.equal(receipt.status, 'PASS_EXACT_GRAPH_SELECTED_DOWNLOAD');
  assert.equal(receipt.checkpointAccepted, row.accepted);
  assert.ok(Object.values(receipt.checks).every(Boolean));
  assert.equal(receipt.selectedSettingsDownload.bytes, row.archiveBytes);
  assert.ok(hex.test(receipt.selectedSettingsDownload.sha256));
  same(receipt.selectedSettingsDownload.families, row.families);
  same(receipt.selectedSettingsDownload.accounts, row.accounts);
  same(receipt.selectedSettingsDownload.heads, row.heads);
  same(receipt.selectedSettingsDownload.addresses, row.addresses);
  same(receipt.selectedSettingsDownload.historicalArtifactIds, row.historicalArtifactIds);
  assert.equal(receipt.adjacentOwnerCheckpoint.sha256, row.archiveSha256);
  assert.equal(receipt.adjacentOwnerCheckpoint.bytes, row.archiveBytes);
  assert.notEqual(receipt.selectedSettingsDownload.createdAt, row.archiveCreatedAt);
}
const deltas = checkpoints.slice(1).map((row, index) => ({ accepted: row.accepted,
  archiveBytes: row.archiveBytes, blockByteDelta: row.archiveBytes - checkpoints[index].archiveBytes }));
const illustration1000 = baseline.archiveBytes + Math.round((checkpoints[6].archiveBytes - baseline.archiveBytes) / 120 * 1000);
console.log(JSON.stringify({ status: 'PASS_G10D5_INDEPENDENT_RECONCILIATION',
  ledgerSha256: digest(ledgerFile.bytes), receiptSha256: receiptFiles.map(file => digest(file.bytes)),
  accepted: ledger.accepted, loads: ledger.loads, restarts: ledger.restarts,
  accountId: baseAccount.accountId, baselineAccountRevision: baseAccount.revision,
  finalAccountRevision: checkpoints[6].accounts[0].revision,
  baselineHeadRevision: baseHead.revision,
  finalHeadRevision: checkpoints[6].heads.find(item => item.campaignId === campaignId).revision,
  runCount: baseAccount.runCount, witnessCount: baseWitness.count,
  baselineDescendants: baseDescendants, finalDescendants: baseDescendants + 120,
  baselineArtifacts: baseArtifacts, finalArtifacts: baseArtifacts + 120,
  baselineArchiveBytes: baseline.archiveBytes, finalArchiveBytes: checkpoints[6].archiveBytes,
  deltas, illustration1000, illustrationIsGuarantee: false }, null, 2));
