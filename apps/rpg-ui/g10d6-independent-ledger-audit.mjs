// Read-only reconciliation of already published nonsecret G10D ledgers.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const root = new URL('../../docs/dev/evidence/', import.meta.url);
const read = name => {
  const bytes = readFileSync(new URL(name, root));
  return { value: JSON.parse(bytes.toString('utf8')), sha256: createHash('sha256').update(bytes).digest('hex') };
};
const expectedFamilies = [
  'accounts', 'accountLifecycle', 'newCampaignAttempts', 'pendingPublicationRecoveries',
  'campaignAttemptsV6', 'firstPublicationRecoveriesV6', 'descendantPublicationRecoveries',
  'terminalLifecycleRecoveries', 'currentSlotGenerations', 'addressDeletionReceipts',
  'artifacts', 'controls', 'slots', 'witnesses',
];
const positions = [0, 20, 40, 60, 80, 100, 120];
const hex = /^[0-9a-f]{64}$/;
const emptyDigest = createHash('sha256').update('[]').digest('hex');
const signature = family => [family.name, family.count, family.serializedRowsBytes, family.sha256];
const unique = values => new Set(values).size === values.length;
const key = address => `${address.accountId}\0${address.slotId}`;

function auditRun(fileName, baselineDescendants, baselineArtifacts) {
  const file = read(fileName);
  const run = file.value;
  assert.equal(run.accepted, 120);
  assert.ok(run.loads >= 24 && run.restarts >= 6);
  assert.equal(run.checkpoints.length, 7);
  assert.deepEqual(run.checkpoints.map(row => row.accepted), positions);
  const first = run.checkpoints[0];
  const account = first.accounts[0];
  assert.equal(first.accounts.length, 1);
  assert.equal(account.runCount, 3);
  assert.equal(account.historicalCharacterIds.length, 3);
  assert.ok(unique(account.historicalCharacterIds));
  assert.equal(first.heads.length, 3);
  assert.equal(first.addresses.length, 4);
  const target = first.heads.reduce((a, b) => a.revision >= b.revision ? a : b);
  const otherHeads = first.heads.filter(head => head.campaignId !== target.campaignId);
  const addressGenerations = new Map(first.addresses.map(address => [key(address), address.slotGenerationId]));
  const firstArtifacts = new Set(first.historicalArtifactIds);
  let retainedArtifacts = firstArtifacts;
  assert.equal(firstArtifacts.size, baselineArtifacts);
  assert.equal(first.families.find(f => f.name === 'descendantPublicationRecoveries').count, baselineDescendants);
  const fixedWitness = first.families.find(f => f.name === 'witnesses').sha256;
  const rows = [];
  for (const row of run.checkpoints) {
    assert.ok(Number.isSafeInteger(row.archiveBytes) && row.archiveBytes > 0);
    assert.match(row.archiveSha256, hex);
    assert.match(row.manifestSha256, hex);
    assert.deepEqual(row.families.map(f => f.name), expectedFamilies);
    for (const family of row.families) {
      assert.ok(Number.isSafeInteger(family.count) && family.count >= 0);
      assert.ok(Number.isSafeInteger(family.serializedRowsBytes) && family.serializedRowsBytes >= 2);
      assert.match(family.sha256, hex);
      if (family.count === 0) {
        assert.equal(family.serializedRowsBytes, 2);
        assert.equal(family.sha256, emptyDigest);
      }
    }
    assert.equal(row.accounts.length, 1);
    assert.equal(row.accounts[0].accountId, account.accountId);
    assert.equal(row.accounts[0].revision, account.revision + row.accepted);
    assert.deepEqual(row.accounts[0].historicalCharacterIds, account.historicalCharacterIds);
    assert.equal(row.accounts[0].runCount, 3);
    assert.equal(row.heads.length, 3);
    assert.deepEqual(row.heads.filter(head => head.campaignId !== target.campaignId), otherHeads);
    assert.equal(row.heads.find(head => head.campaignId === target.campaignId)?.revision, target.revision + row.accepted);
    assert.equal(row.addresses.length, 4);
    for (const address of row.addresses) assert.equal(address.slotGenerationId, addressGenerations.get(key(address)));
    assert.equal(row.families.find(f => f.name === 'witnesses').count, 1);
    assert.equal(row.families.find(f => f.name === 'witnesses').sha256, fixedWitness);
    assert.equal(row.families.find(f => f.name === 'descendantPublicationRecoveries').count, baselineDescendants + row.accepted);
    assert.equal(row.families.find(f => f.name === 'artifacts').count, baselineArtifacts + row.accepted);
    assert.equal(row.historicalArtifactIds.length, baselineArtifacts + row.accepted);
    assert.ok(unique(row.historicalArtifactIds));
    for (const id of retainedArtifacts) assert.ok(row.historicalArtifactIds.includes(id));
    retainedArtifacts = new Set(row.historicalArtifactIds);
    assert.ok(Number.isSafeInteger(row.storage.usage) && row.storage.usage >= 0);
    assert.ok(Number.isSafeInteger(row.storage.quota) && row.storage.quota >= row.storage.usage);
    assert.equal(typeof row.storage.persisted, 'boolean');
    rows.push({ accepted: row.accepted, bytes: row.archiveBytes, archiveSha256: row.archiveSha256,
      accountRevision: row.accounts[0].revision, targetHeadRevision: target.revision + row.accepted,
      descendants: baselineDescendants + row.accepted, artifacts: baselineArtifacts + row.accepted,
      usage: row.storage.usage, quota: row.storage.quota, persisted: row.storage.persisted });
  }
  assert.ok(rows.every((row, index) => index === 0 || row.bytes > rows[index - 1].bytes));
  return { sourceFile: fileName, evidenceSha256: file.sha256, accountId: account.accountId,
    historicalCharacterIds: account.historicalCharacterIds, targetCampaignId: target.campaignId,
    loads: run.loads, restarts: run.restarts, rows, finalFamilySignatures: run.checkpoints.at(-1).families.map(signature) };
}

const accepted = auditRun('g10d1-combined-selected-2026-10-16.json', 4, 7);
const supplemental = auditRun('g10d5-combined-selected-2026-10-17.json', 5, 8);
assert.notEqual(accepted.accountId, supplemental.accountId);
for (const [name, position] of [
  ['g10d5-baseline-selected-download-2026-10-17.json', 0],
  ['g10d5-final-selected-download-2026-10-17.json', 120],
]) {
  const receipt = read(name).value;
  const row = read(supplemental.sourceFile).value.checkpoints.find(item => item.accepted === position);
  assert.equal(receipt.checkpointAccepted, position);
  assert.equal(receipt.selectedSettingsDownload.bytes, row.archiveBytes);
  assert.equal(receipt.adjacentOwnerCheckpoint.bytes, row.archiveBytes);
  assert.equal(receipt.adjacentOwnerCheckpoint.sha256, row.archiveSha256);
  assert.deepEqual(receipt.selectedSettingsDownload.families.map(signature), row.families.map(signature));
  for (const property of ['accounts', 'heads', 'addresses', 'historicalArtifactIds'])
    assert.deepEqual(receipt.selectedSettingsDownload[property], row[property]);
  assert.ok(Object.values(receipt.checks).every(Boolean));
  assert.equal(receipt.wholeFileSha256Equal, false);
  assert.notEqual(receipt.selectedSettingsDownload.createdAt, row.archiveCreatedAt);
}
console.log(JSON.stringify({ status: 'PASS_G10D6_EXISTING_SELECTED_LEDGER_RECONCILIATION',
  acceptedLongRun: accepted, additionalExactDownloads: {
    sourceFile: supplemental.sourceFile, evidenceSha256: supplemental.evidenceSha256,
    accountId: supplemental.accountId, loads: supplemental.loads, restarts: supplemental.restarts,
    rows: supplemental.rows,
  },
  distinctGraphIdentities: true, selectedFileVersusAdjacentOwnerSignaturesExact: true,
  wholeFileShaEqualityRequired: false }, null, 2));
