// Compare one private disposable selected Settings file to an adjacent nonsecret owner checkpoint.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const [checkpointPath, selectedPath] = process.argv.slice(2);
if (!checkpointPath || !selectedPath) throw Error('Expected nonsecret checkpoint and private selected file');
const checkpoint = JSON.parse(readFileSync(checkpointPath, 'utf8'));
const raw = readFileSync(selectedPath);
const selected = JSON.parse(raw.toString('utf8'));
const sha = value => createHash('sha256').update(value).digest('hex');
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const rows = name => selected.families.find(family => family.name === name)?.rows ?? [];
const families = selected.families.map(family => ({ name: family.name, count: family.count,
  serializedRowsBytes: Buffer.byteLength(JSON.stringify(family.rows)), sha256: family.sha256 }));
const accounts = rows('accounts').map(row => ({ accountId: row.accountId, revision: row.revision,
  lifecycleGeneration: row.lifecycleGeneration,
  runCharacterIds: row.profile?.history?.runRecords?.map(run => run.characterId) ?? [] }));
const heads = rows('controls').map(row => ({ accountId: row.accountId, campaignId: row.campaignId,
  headArtifactId: row.value.headArtifactId, headPublicationId: row.value.headPublicationId,
  headRevision: row.value.headRevision }));
const addresses = rows('slots').map(row => ({ accountId: row.accountId, slotId: row.slotId,
  artifactId: row.artifactId, publicationId: row.publicationId }));
const generations = rows('currentSlotGenerations').map(row => ({ accountId: row.accountId, slotId: row.slotId,
  slotGenerationId: row.slotGenerationId, campaignId: row.campaignId }));
const artifacts = rows('artifacts').map(row => ({ accountId: row.accountId, campaignId: row.campaignId,
  artifactId: row.artifactId, publicationId: row.publicationId }));
const witnesses = rows('witnesses').map(row => ({ accountId: row.accountId, campaignId: row.campaignId,
  requestId: row.requestId }));
const { sha256: manifestDigest, ...payload } = selected;
const checks = {
  manifestSelfDigest: sha(JSON.stringify(payload)) === manifestDigest,
  fourteenCompleteFamilyDigests: families.length === 14 && selected.families.every(family =>
    family.count === family.rows.length && family.sha256 === sha(JSON.stringify(family.rows))),
  exactFamilySignatures: equal(families, checkpoint.families),
  accountAndRunIdentity: equal(accounts, checkpoint.accounts),
  headIdentity: equal(heads, checkpoint.heads),
  addressIdentity: equal(addresses, checkpoint.addresses),
  generationIdentity: equal(generations, checkpoint.generations),
  artifactIdentity: equal(artifacts, checkpoint.artifacts),
  witnessIdentity: equal(witnesses, checkpoint.witnesses),
  lifecycleFamilySignature: families.find(family => family.name === 'accountLifecycle')?.sha256 ===
    checkpoint.families.find(family => family.name === 'accountLifecycle')?.sha256
};
const status = Object.values(checks).every(Boolean) ? 'PASS_G10E_EXACT_SELECTED_GRAPH' : 'FAIL';
console.log(JSON.stringify({ status, selectedBytes: raw.byteLength, selectedSha256: sha(raw),
  selectedCreatedAt: selected.createdAt, adjacentOwnerBytes: checkpoint.archiveBytes,
  adjacentOwnerSha256: checkpoint.fileSha256, fileShaEqual: sha(raw) === checkpoint.fileSha256,
  checks }, null, 2));
if (status !== 'PASS_G10E_EXACT_SELECTED_GRAPH') process.exitCode = 1;
