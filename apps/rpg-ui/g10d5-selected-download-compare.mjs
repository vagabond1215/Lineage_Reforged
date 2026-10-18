// Reads a private synthetic Settings download and prints nonsecret checkpoint comparison only.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const [ledgerPath, checkpointNumber, selectedPath] = process.argv.slice(2);
if (!ledgerPath || !checkpointNumber || !selectedPath) throw Error('Expected ledger, accepted count and private selected file');
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
const checkpoint = ledger.checkpoints.find(row => row.accepted === Number(checkpointNumber));
if (!checkpoint) throw Error(`Missing exact checkpoint ${checkpointNumber}`);
const raw = readFileSync(selectedPath);
const selected = JSON.parse(raw.toString('utf8'));
const sha = value => createHash('sha256').update(value).digest('hex');
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const families = selected.families.map(family => ({ name: family.name, count: family.count,
  serializedRowsBytes: Buffer.byteLength(JSON.stringify(family.rows)), sha256: family.sha256 }));
const familySelfChecks = selected.families.map(family => ({ name: family.name,
  countExact: family.count === family.rows.length,
  digestExact: family.sha256 === sha(JSON.stringify(family.rows)) }));
const rows = name => selected.families.find(family => family.name === name)?.rows ?? [];
const accounts = rows('accounts').map(item => ({ accountId: item.accountId, revision: item.revision,
  lifecycleGeneration: item.lifecycleGeneration,
  runCount: item.profile?.history?.runRecords?.length ?? null,
  historicalCharacterIds: item.profile?.history?.runRecords?.map(run => run.characterId) ?? [] }));
const heads = rows('controls').map(item => ({ accountId: item.accountId, campaignId: item.campaignId,
  artifactId: item.value.headArtifactId, publicationId: item.value.headPublicationId,
  revision: item.value.headRevision }));
const generations = new Map(rows('currentSlotGenerations').map(item => [
  `${item.accountId}\u0000${item.slotId}`, { slotGenerationId: item.slotGenerationId, campaignId: item.campaignId }]));
const addresses = rows('slots').map(item => ({ accountId: item.accountId, slotId: item.slotId,
  artifactId: item.artifactId, publicationId: item.publicationId,
  slotGenerationId: generations.get(`${item.accountId}\u0000${item.slotId}`)?.slotGenerationId ?? null,
  campaignId: generations.get(`${item.accountId}\u0000${item.slotId}`)?.campaignId ?? null }));
const historicalArtifactIds = rows('artifacts').map(item => item.artifactId);
const { sha256: manifestSha256, ...payload } = selected;
const checks = {
  selectedManifestSelfDigest: sha(JSON.stringify(payload)) === manifestSha256,
  selectedFamilySelfDigests: familySelfChecks.every(item => item.countExact && item.digestExact),
  exactFourteenFamilies: families.length === 14 && same(families, checkpoint.families),
  archiveBytes: raw.byteLength === checkpoint.archiveBytes,
  accounts: same(accounts, checkpoint.accounts), heads: same(heads, checkpoint.heads),
  addresses: same(addresses, checkpoint.addresses),
  historicalArtifacts: same(historicalArtifactIds, checkpoint.historicalArtifactIds)
};
const result = {
  status: Object.values(checks).every(Boolean) ? 'PASS_EXACT_GRAPH_SELECTED_DOWNLOAD' : 'FAIL',
  checkpointAccepted: checkpoint.accepted,
  selectedSettingsDownload: { bytes: raw.byteLength, sha256: sha(raw),
    createdAt: selected.createdAt, manifestSha256, families, accounts, heads, addresses,
    historicalArtifactIds },
  adjacentOwnerCheckpoint: { bytes: checkpoint.archiveBytes, sha256: checkpoint.archiveSha256,
    createdAt: checkpoint.archiveCreatedAt, manifestSha256: checkpoint.manifestSha256 },
  wholeFileSha256Equal: sha(raw) === checkpoint.archiveSha256,
  wholeFileSha256Difference: selected.createdAt === checkpoint.archiveCreatedAt ? null
    : 'Archive createdAt is generated separately for each export; compare exact family row digests and graph identities.',
  checks
};
console.log(JSON.stringify(result, null, 2));
if (result.status !== 'PASS_EXACT_GRAPH_SELECTED_DOWNLOAD') process.exitCode = 1;
