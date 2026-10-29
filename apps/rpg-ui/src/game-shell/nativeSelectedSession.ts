import type { CampaignSessionControl } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import { isNativeTargetCampaignSnapshot, type NativeFreshCampaignSnapshot } from
  '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import { hasPendingNormalDefeat } from '../../../../packages/engines/game-engine/src/normal-defeat.js';
import type { CleanEpochAccountStore } from './cleanEpochAccountStore.js';
import { CleanEpochDescendantAdapter } from './cleanEpochDescendantAdapter.js';
import { admitNativeSelectedItemCommand, type NativeSelectedItemCommand } from './nativeSelectedCharacter.js';
import { SAVE_SLOT_ORDER, type SaveSlotId } from './state.js';

type Address = { artifactId: string; publicationId: string };

/** One selected v3 snapshot/control pair and its exact retained account source. */
export type NativeSelectedSession = Readonly<{
  snapshot: NativeFreshCampaignSnapshot;
  control: CampaignSessionControl<NativeFreshCampaignSnapshot>;
  sourceSlotId: SaveSlotId;
  accountRevision: number;
  sourceAddress: Address;
}>;

/** Called only after an account owner has read back a ready native artifact. */
export function createNativeSelectedSession(input: {
  snapshot: unknown;
  control: CampaignSessionControl;
  sourceSlotId: SaveSlotId;
  accountRevision: number;
}): NativeSelectedSession {
  if (!isNativeTargetCampaignSnapshot(input.snapshot))
    throw new Error('This development save is incompatible with native v3. Start a new campaign; the old record was not changed.');
  const snapshot = input.snapshot;
  const control = input.control;
  if (!snapshot.campaignIdentity || control.accountId !== snapshot.accountId ||
      control.campaignId !== snapshot.campaignIdentity.campaignId ||
      !control.loadedArtifactId || !control.loadedPublicationId ||
      control.soundingsAdmissionWitness ||
      !SAVE_SLOT_ORDER.some(slot => slot.id === input.sourceSlotId) ||
      !Number.isSafeInteger(input.accountRevision) || input.accountRevision < 1)
    throw new Error('Native selected session control or retained account source is invalid.');
  return { snapshot, control: control as CampaignSessionControl<NativeFreshCampaignSnapshot>,
    sourceSlotId: input.sourceSlotId, accountRevision: input.accountRevision,
    sourceAddress: { artifactId: control.loadedArtifactId,
      publicationId: control.loadedPublicationId } };
}

/** Apply one owner-admitted item result; rejected/stale/duplicate requests retain the exact pair. */
export function applyNativeSelectedItem(session: NativeSelectedSession,
  command: NativeSelectedItemCommand, requestId: string) {
  if (hasPendingNormalDefeat(session.snapshot))
    return { status: 'rejected' as const, session, reason: 'Pending defeat requires recovery before item actions.' };
  const result = admitNativeSelectedItemCommand(session.snapshot, session.control, command, requestId);
  return result.status === 'accepted'
    ? { status: result.status, session: { ...session, snapshot: result.snapshot,
        control: result.control }, reason: undefined }
    : { status: result.status, session, reason: result.reason };
}

export type NativeSelectedSaveResult =
  | { status: 'ready'; session: NativeSelectedSession; publicationId: string }
  | { status: 'blocked'; session: NativeSelectedSession; message: string; requiresReload: boolean };

/** Existing descendant account owner publishes the exact selected pair and reads it back. */
export async function saveNativeSelectedSession(owner: CleanEpochAccountStore,
  session: NativeSelectedSession, destinationSlotId: SaveSlotId,
  expectedDestinationAddress?: Address | null): Promise<NativeSelectedSaveResult> {
  if (hasPendingNormalDefeat(session.snapshot)) return { status: 'blocked', session,
    message: 'Pending Normal defeat requires its dedicated recovery publication.', requiresReload: false };
  if (destinationSlotId !== session.sourceSlotId && expectedDestinationAddress === undefined)
    return { status: 'blocked', session,
      message: 'Cross-slot Save requires the observed destination address.', requiresReload: false };
  const result = await new CleanEpochDescendantAdapter(owner).save({
    accountId: session.snapshot.accountId, sourceSlotId: session.sourceSlotId,
    destinationSlotId, expectedAccountRevision: session.accountRevision,
    expectedDestinationAddress: destinationSlotId === session.sourceSlotId
      ? session.sourceAddress : expectedDestinationAddress!,
    snapshot: session.snapshot, control: session.control
  });
  if (result.status === 'blocked') return { status: 'blocked', session,
    message: result.message, requiresReload: true };
  try {
    const account = await owner.readSelected(session.snapshot.accountId);
    if (!account || account.revision <= session.accountRevision)
      throw new Error('Published native account revision could not be verified.');
    const next = createNativeSelectedSession({ snapshot: result.value.loaded.snapshot,
      control: result.value.loaded.sessionControl, sourceSlotId: destinationSlotId,
      accountRevision: account.revision });
    if (next.sourceAddress.publicationId !== result.value.loaded.publication.publicationId)
      throw new Error('Native Save readback differed from the selected publication.');
    return { status: 'ready', session: next, publicationId: next.sourceAddress.publicationId };
  } catch (error) {
    return { status: 'blocked', session,
      message: error instanceof Error ? error.message : String(error), requiresReload: true };
  }
}
