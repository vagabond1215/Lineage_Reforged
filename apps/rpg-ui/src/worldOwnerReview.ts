import { createDefaultAccountProfileState } from '../../../packages/engines/game-engine/src/legacy-account.js';
import { CleanEpochAccountAdapter } from './game-shell/cleanEpochAccountAdapter.js';
import { openCleanEpochAccountStore, accountLifecycleGeneration } from './game-shell/cleanEpochAccountStore.js';
import { CleanEpochFirstCampaignAdapter } from './game-shell/cleanEpochFirstCampaignAdapter.js';
import { CleanEpochTerminalAdapter } from './game-shell/cleanEpochTerminalAdapter.js';
import { createDefaultCharacterCreationFormState } from './game-shell/characterCreationForm.js';
import { createDefaultStartingBundleChoiceSelections, getLineageIdentityCatalog } from './game-shell/characterCreationCatalog.js';
import { getDefaultWorldSelection } from './game-shell/worldSelectionCatalog.js';
import { createCredentialRecord, type LauncherRuntimeSession } from './game-shell/launcherAuthManager.js';
import type { WorldPilotCreateInput } from './game-shell/world-source/pilot.js';

const password = 'disposable-world-owner-review';
const fixtures = import.meta.glob('./game-shell/cleanEpochAccountStoreV7Qa.ts');

function verifyName(name: string) {
  if (!/^a2b-review-[a-z0-9-]+$/.test(name)) throw new Error('The review requires a disposable named database.');
}

export async function seedOriginalV7(name: string, accountId: string) {
  verifyName(name);
  const load = fixtures['./game-shell/cleanEpochAccountStoreV7Qa.ts'];
  if (!load) throw new Error('Exact v7 fixture was not materialized for this review build.');
  const legacy = await load() as typeof import('./game-shell/cleanEpochAccountStore.js');
  if (Number(legacy.CLEAN_EPOCH_DATABASE_VERSION) !== 7) throw new Error('Review fixture version must be 7.');
  const db = await legacy.openCleanEpochAccountStore({ name });
  try {
    const createdAt = new Date().toISOString();
    const profile = createDefaultAccountProfileState({ accountId, displayName: 'Original v7 review', createdAt });
    await db.register(profile, await createCredentialRecord(accountId, password, createdAt));
    return db.exportArchive();
  } finally { db.close(); }
}

export async function openWorldOwnerReview(name: string) {
  verifyName(name);
  let fault: 'abort' | 'quota' | undefined;
  const owner = await openCleanEpochAccountStore({ name,
    beforeWrite: tx => {
      if (fault === 'quota' && tx.objectStoreNames.contains('worldsV8')) {
        fault = undefined;
        throw new DOMException('Synthetic quota pressure', 'QuotaExceededError');
      }
    },
    afterWrite: tx => {
      if (fault === 'abort' && tx.objectStoreNames.contains('worldsV8')) {
        fault = undefined;
        tx.abort();
      }
    },
  });
  const adapter = new CleanEpochAccountAdapter(owner);
  let session: LauncherRuntimeSession | undefined;
  const getSession = () => {
    if (!session) throw new Error('No credential-verified review session.');
    return session;
  };
  const auth = () => ({ adapter, session: getSession() });
  return {
    async authenticate(accountId: string, register: boolean) {
      const result = register ? await adapter.register({ accountId, displayName: accountId, password,
        confirmPassword: password, stayLoggedIn: false })
        : await adapter.signIn({ accountId, password, stayLoggedIn: false });
      if (result.status !== 'ready') throw new Error(result.message);
      session = result.value.session;
      return result.value.account.revision;
    },
    create: (input: WorldPilotCreateInput) => owner.createChronicleWorld(input, auth()),
    forged: (input: WorldPilotCreateInput) => owner.createChronicleWorld(input, { adapter, session: { ...getSession() } }),
    reopen: () => owner.reopenChronicleWorld(auth()),
    list: () => owner.listChronicleWorlds(getSession().accountId),
    arm: (kind: typeof fault) => { fault = kind; },
    exportArchive: () => owner.exportArchive(),
    restoreArchive: (archive: string) => owner.restoreArchive(archive),
    close: () => owner.close(),
    async changeRevision() {
      const account = await adapter.validateSession(getSession());
      return adapter.updateProfile(account.accountId, account.revision, {
        ...account.profile, displayName: 'Updated disposable profile',
      });
    },
    async lifecycle(kind: 'reset' | 'delete') {
      const account = await adapter.validateSession(getSession());
      const parameters = { accountId: account.accountId, expectedRevision: account.revision,
        expectedGeneration: accountLifecycleGeneration(account), password };
      return kind === 'reset' ? adapter.resetAccount({ ...parameters, stayLoggedIn: false })
        : adapter.deleteAccount({ ...parameters, requestId: crypto.randomUUID() });
    },
    async seedNativeHistory() {
      const accountId = getSession().accountId;
      const native = new CleanEpochFirstCampaignAdapter(owner, 'native_v3');
      const identity = getLineageIdentityCatalog('lineage.human');
      const place = getDefaultWorldSelection('backstory.local');
      if (!identity) throw new Error('Native history fixture is missing its lineage.');
      for (const slotId of ['slot-1', 'slot-2'] as const) {
        const result = await native.start(accountId, {
          ...createDefaultCharacterCreationFormState(slotId), playerName: `Review ${slotId}`,
          hairColorId: identity.hairColorOptions[0]!.id, eyeColorId: identity.eyeColorOptions[0]!.id,
          skinToneId: identity.skinToneOptions[0]!.id, backstoryId: 'backstory.local',
          continentId: place.continentId, regionId: place.regionId, startingSettlementId: place.settlementId,
          startingBundleId: 'starting_bundle.hunter',
          startingBundleChoiceSelections: createDefaultStartingBundleChoiceSelections('starting_bundle.hunter'),
        });
        if (result.status !== 'ready') throw new Error(result.message);
      }
      const slot = await owner.readSlot(accountId, 'slot-1');
      const account = await adapter.validateSession(getSession());
      if (slot.status !== 'ready') throw new Error('Native retirement fixture did not publish.');
      const control = slot.loaded.sessionControl;
      const retired = await new CleanEpochTerminalAdapter(owner).retire({
        accountId, sourceSlotId: 'slot-1', expectedAccountRevision: account.revision,
        snapshot: slot.loaded.snapshot, control, expectedSourceAddress: {
          artifactId: control.loadedArtifactId, publicationId: control.loadedPublicationId,
        },
      });
      if (retired.status !== 'completed') throw new Error(retired.message);
      await owner.closePendingTerminalAddressesForAccount(accountId, 'lineage.save_snapshot.v3');
      const closed = await owner.readTerminalRecovery(accountId, retired.recovery.campaignId, retired.recovery.publicationId);
      const neighbor = await owner.readSlot(accountId, 'slot-2');
      if (!closed?.addressClosure || neighbor.status !== 'ready' ||
          neighbor.loaded.snapshot.snapshotVersion !== 'lineage.save_snapshot.v3')
        throw new Error('Native ready/closed neighbor fixture did not retain both histories.');
      return (await adapter.validateSession(getSession())).revision;
    },
  };
}
