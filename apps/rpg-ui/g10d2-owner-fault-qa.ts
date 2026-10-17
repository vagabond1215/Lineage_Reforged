import { openCleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';
import { CleanEpochFirstCampaignAdapter } from './src/game-shell/cleanEpochFirstCampaignAdapter.ts';
import { createDefaultAccountProfileState } from '../../packages/engines/game-engine/src/legacy-account.ts';
import { createCredentialRecord } from './src/game-shell/launcherAuthManager.ts';
import { getLineageIdentityCatalog, createDefaultStartingBundleChoiceSelections } from './src/game-shell/characterCreationCatalog.ts';
import { createDefaultCharacterCreationFormState } from './src/game-shell/characterCreationForm.ts';

const output = document.querySelector<HTMLPreElement>('#result')!;
const rows: unknown[] = [];
let sourceText = '';
type Archive = { families: Array<{ name: string; count: number; sha256: string; rows: unknown[] }> };
type Fault = { phase: 'publication' | 'consumer'; mode: 'quota' | 'abort'; ordinal: number };
const check = (value: unknown, label: string): asserts value => { if (!value) throw Error(label); };
const parsed = (text: string) => JSON.parse(text) as Archive;
const family = (archive: Archive, name: string) => archive.families.find(item => item.name === name)!;
const signature = (archive: Archive) => archive.families.map(item =>
  ({ name: item.name, count: item.count, sha256: item.sha256 }));
const same = (a: Archive, b: Archive) => JSON.stringify(signature(a)) === JSON.stringify(signature(b));
function report(label: string, data: Record<string, unknown>) {
  rows.push({ label, ...data });
  output.textContent = JSON.stringify({ status: 'RUNNING', rows }, null, 2);
}
function form() {
  const identity = getLineageIdentityCatalog('lineage.human')!;
  const bundle = 'starting_bundle.traveler';
  return { ...createDefaultCharacterCreationFormState('slot-1'), playerName: 'D3 Pending First',
    hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
    skinToneId: identity.skinToneOptions[0]!.id, startingBundleId: bundle,
    startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections(bundle),
    backstoryId: 'backstory.craftsmans_child', continentId: 'region.myridian_chain',
    regionId: 'region.starfall_isle', startingSettlementId: 'settlement.starfall_port' };
}
async function clone(label: string) {
  const name = `lineage.g10d2.${label}.${crypto.randomUUID()}`;
  const owner = await openCleanEpochAccountStore({ name });
  await owner.restoreArchive(sourceText);
  owner.close();
  return name;
}
function hook(name: string, fault?: Fault) {
  let phase: Fault['phase'] = 'publication';
  const counts = { publication: 0, consumer: 0 };
  return { counts, setPhase: (value: Fault['phase']) => { phase = value; },
    open: () => openCleanEpochAccountStore({ name,
      beforeWrite: () => {
        const ordinal = ++counts[phase];
        if (fault?.phase === phase && fault.mode === 'quota' && ordinal === fault.ordinal)
          throw new DOMException('synthetic quota', 'QuotaExceededError');
      },
      afterWrite: tx => {
        if (fault?.phase === phase && fault.mode === 'abort' && counts[phase] === fault.ordinal)
          tx.abort();
      } }) };
}
async function descendant(name: string, fault?: Fault) {
  const hooks = hook(name, fault);
  const owner = await hooks.open();
  try {
    const account = (await owner.list())[0]!;
    const slot = await owner.readSlot(account.accountId, 'quick-save');
    check(slot.status === 'ready', 'grown quick head unavailable');
    const before = parsed(await owner.exportArchive());
    const priorHead = slot.loaded.sessionControl;
    const original = owner.completeDescendantConsumers.bind(owner);
    owner.completeDescendantConsumers = (...args) => {
      hooks.setPhase('consumer');
      return original(...args);
    };
    const result = await new CleanEpochDescendantAdapter(owner).save({ accountId: account.accountId,
      sourceSlotId: 'quick-save', destinationSlotId: 'quick-save',
      expectedAccountRevision: account.revision, snapshot: slot.loaded.snapshot,
      control: priorHead, expectedDestinationAddress: {
        artifactId: priorHead.loadedArtifactId, publicationId: priorHead.loadedPublicationId } });
    const after = parsed(await owner.exportArchive());
    return { before, after, result, counts: hooks.counts, accountId: account.accountId,
      campaignId: priorHead.campaignId, priorArtifactId: priorHead.loadedArtifactId,
      priorPublicationId: priorHead.loadedPublicationId };
  } finally { owner.close(); }
}
async function runDescendantRow(label: string, fault: Fault) {
  const name = await clone(label);
  const test = await descendant(name, fault);
  check(test.result.status === 'blocked', `${label}: accepted faulted save`);
  const reopened = await openCleanEpochAccountStore({ name });
  try {
    const durable = parsed(await reopened.exportArchive());
    check(same(test.after, durable), `${label}: restart changed graph`);
    const priorArtifacts = family(test.before, 'artifacts').rows as Array<{ artifactId: string }>;
    const nowArtifacts = family(durable, 'artifacts').rows as Array<{ artifactId: string }>;
    check(priorArtifacts.every(item => nowArtifacts.some(now => now.artifactId === item.artifactId)),
      `${label}: immutable source artifact lost`);
    if (fault.phase === 'publication') {
      check(same(test.before, durable), `${label}: precommit fault changed accepted graph`);
      const read = await reopened.readSlot(test.accountId, 'quick-save');
      check(read.status === 'ready' && read.loaded.sessionControl.loadedArtifactId === test.priorArtifactId,
        `${label}: precommit head moved`);
    } else {
      check(nowArtifacts.length === priorArtifacts.length + 1, `${label}: pending artifact count`);
      check(family(test.before, 'witnesses').sha256 === family(durable, 'witnesses').sha256,
        `${label}: prior Soundings witness changed`);
      const pending = await reopened.readCurrentDescendantRecovery(test.accountId, 'quick-save');
      check(pending?.status === 'accepted_pending_consumers', `${label}: pending identity missing`);
      const pendingId = pending.publicationId;
      const resumed = await new CleanEpochDescendantAdapter(reopened).resumeCurrent(test.accountId, 'quick-save');
      check(resumed.status === 'ready' && resumed.value.loaded.publication.publicationId === pendingId,
        `${label}: exact pending resume failed`);
      const retry = await reopened.completeDescendantConsumers(test.accountId, pending.campaignId, pendingId);
      check(retry.status === 'same_source_retry', `${label}: duplicate completion`);
      const final = parsed(await reopened.exportArchive());
      check(family(final, 'artifacts').count === priorArtifacts.length + 1,
        `${label}: retry minted another artifact`);
    }
    report(label, { fault, blockedCode: test.result.code, writeCounts: test.counts,
      priorHead: test.priorArtifactId, priorPublication: test.priorPublicationId,
      prior: signature(test.before), durable: signature(durable),
      result: fault.phase === 'publication' ? 'EXACT_PRIOR_AFTER_RESTART' : 'ONE_PENDING_EXACT_RETRY' });
  } finally { reopened.close(); }
}
async function runFirstConsumer(label: string, fault: Fault) {
  const name = await clone(label);
  const accountId = `account.local.${crypto.randomUUID()}`;
  let owner = await openCleanEpochAccountStore({ name });
  try {
    await owner.register(createDefaultAccountProfileState({ accountId, displayName: 'D3 First Fault' }),
      await createCredentialRecord(accountId, 'synthetic-only-password', new Date().toISOString()));
  } finally { owner.close(); }
  const hooks = hook(name, fault);
  owner = await hooks.open();
  let before: Archive;
  let result: Awaited<ReturnType<CleanEpochFirstCampaignAdapter['start']>>;
  try {
    before = parsed(await owner.exportArchive());
    const original = owner.completePreparedAttemptConsumers.bind(owner);
    owner.completePreparedAttemptConsumers = (...args) => {
      hooks.setPhase('consumer');
      return original(...args);
    };
    result = await new CleanEpochFirstCampaignAdapter(owner).start(accountId, form());
  } finally { owner.close(); }
  check(result!.status === 'blocked', `${label}: faulted first reported success`);
  const reopened = await openCleanEpochAccountStore({ name });
  try {
    const pending = await reopened.readRecovery(accountId, 'slot-1');
    check(pending?.status === 'accepted_pending_consumers', `${label}: first pending absent`);
    const after = parsed(await reopened.exportArchive());
    check(family(after, 'artifacts').count === family(before!, 'artifacts').count + 1,
      `${label}: first pending artifact missing`);
    const completed = await reopened.completePreparedAttemptConsumers(accountId, 'slot-1',
      pending.attemptId, pending.publicationId);
    check(completed.status === 'committed', `${label}: first pending completion failed`);
    const duplicate = await reopened.completePreparedAttemptConsumers(accountId, 'slot-1',
      pending.attemptId, pending.publicationId);
    check(duplicate.status === 'same_source_retry', `${label}: first duplicate completion`);
    report(label, { fault, blockedCode: result!.code, writeCounts: hooks.counts,
      prior: signature(before!), pending: signature(after), pendingPublicationId: pending.publicationId,
      result: 'ONE_FIRST_PENDING_EXACT_RETRY' });
  } finally { reopened.close(); }
}
async function main() {
  const source = await openCleanEpochAccountStore();
  try { sourceText = await source.exportArchive(); } finally { source.close(); }
  const base = parsed(sourceText);
  check(base.families.length === 14 && family(base, 'descendantPublicationRecoveries').count >= 120 &&
    family(base, 'witnesses').count >= 1 && family(base, 'controls').count >= 3,
    'D1 mixed grown source is unavailable');
  report('grown-source', { archiveBytes: new TextEncoder().encode(sourceText).byteLength,
    families: signature(base), sourceAccountId: (family(base, 'accounts').rows[0] as { accountId: string }).accountId,
    heads: (family(base, 'controls').rows as Array<{ campaignId: string; value: { headArtifactId: string; headRevision: number } }> )
      .map(item => ({ campaignId: item.campaignId, artifactId: item.value.headArtifactId, revision: item.value.headRevision })) });
  const trialName = await clone('calibration-descendant');
  const trial = await descendant(trialName);
  check(trial.result.status === 'ready', 'D3 calibration descendant failed');
  check(trial.counts.publication >= 3 && trial.counts.consumer >= 2, 'D3 write boundary counts too small');
  report('write-calibration', { descendant: trial.counts });
  const middle = Math.ceil(trial.counts.publication / 2);
  for (const mode of ['quota', 'abort'] as const)
    for (const ordinal of [1, middle, trial.counts.publication])
      await runDescendantRow(`D3-P${ordinal === 1 ? '1' : '2'}-${mode}-${ordinal}`,
        { phase: 'publication', mode, ordinal });
  for (const mode of ['quota', 'abort'] as const)
    for (const ordinal of [1, trial.counts.consumer])
      await runDescendantRow(`D3-P3-${mode}-${ordinal}`,
        { phase: 'consumer', mode, ordinal });
  const firstTrialName = await clone('calibration-first');
  const firstId = `account.local.${crypto.randomUUID()}`;
  let firstOwner = await openCleanEpochAccountStore({ name: firstTrialName });
  await firstOwner.register(createDefaultAccountProfileState({ accountId: firstId, displayName: 'D3 First Calibration' }),
    await createCredentialRecord(firstId, 'synthetic-only-password', new Date().toISOString()));
  firstOwner.close();
  const firstHooks = hook(firstTrialName);
  firstOwner = await firstHooks.open();
  const original = firstOwner.completePreparedAttemptConsumers.bind(firstOwner);
  firstOwner.completePreparedAttemptConsumers = (...args) => {
    firstHooks.setPhase('consumer'); return original(...args);
  };
  const firstResult = await new CleanEpochFirstCampaignAdapter(firstOwner).start(firstId, form());
  firstOwner.close();
  check(firstResult.status === 'ready', 'D3 first calibration failed');
  report('first-write-calibration', { counts: firstHooks.counts });
  for (const mode of ['quota', 'abort'] as const)
    for (const ordinal of [1, firstHooks.counts.consumer])
      await runFirstConsumer(`D3-P4-first-${mode}-${ordinal}`,
        { phase: 'consumer', mode, ordinal });
  output.textContent = JSON.stringify({ status: 'PASS_D3_OWNER_PARTIAL', rows }, null, 2);
}
document.querySelector<HTMLButtonElement>('#run')!.onclick = () => {
  document.querySelector<HTMLButtonElement>('#run')!.disabled = true;
  void main().catch(error => {
    output.textContent = JSON.stringify({ status: 'FAIL', error: error instanceof Error ? error.message : String(error), rows }, null, 2);
  });
};
