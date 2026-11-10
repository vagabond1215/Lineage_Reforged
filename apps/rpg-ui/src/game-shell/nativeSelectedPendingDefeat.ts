import { inspectCampaignSessionSource, type CampaignSessionControl } from
  '../../../../packages/engines/game-engine/src/campaign-session.js';
import { isNativeTargetCampaignSnapshot, type NativeFreshCampaignSnapshot } from
  '../../../../packages/engines/game-engine/src/native-campaign-rules.js';
import { validatePendingNormalDefeatRecoveryProvenance } from
  '../../../../packages/engines/game-engine/src/normal-defeat.js';
import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import type { CleanEpochAccountStore } from './cleanEpochAccountStore.js';
import { CleanEpochNormalDefeatRecoveryAdapter } from './cleanEpochNormalDefeatRecoveryAdapter.js';
import { createNativeSelectedSession, type NativeSelectedSession } from './nativeSelectedSession.js';
import { SAVE_SLOT_ORDER, type SaveSlotId } from './state.js';

type Address = { artifactId: string; publicationId: string };
export type NativeSelectedPendingResult =
  | { status: 'ready'; session: NativeSelectedSession; publicationId: string }
  | { status: 'blocked'; session: NativeSelectedSession; message: string; requiresReload: boolean };

function blocked(session: NativeSelectedSession, message: string,
  requiresReload = false): NativeSelectedPendingResult {
  return { status: 'blocked', session, message, requiresReload };
}

function pendingReceiptId(session: NativeSelectedSession): string | null {
  const { snapshot, control, sourceAddress, sourceSlotId, accountRevision } = session;
  if (!isNativeTargetCampaignSnapshot(snapshot) ||
      !inspectCampaignSessionSource(control, snapshot).coherent ||
      control.accountId !== snapshot.accountId ||
      control.campaignId !== snapshot.campaignIdentity?.campaignId ||
      control.loadedArtifactId !== sourceAddress.artifactId ||
      control.loadedPublicationId !== sourceAddress.publicationId ||
      control.soundingsAdmissionWitness ||
      !SAVE_SLOT_ORDER.some(slot => slot.id === sourceSlotId) ||
      !Number.isSafeInteger(accountRevision) || accountRevision < 1) return null;
  const pending = snapshot.normalDefeatReceipts?.filter(receipt => receipt.posture === 'recovery_pending') ?? [];
  if (pending.length !== 1 || !pending[0]?.receiptId) return null;
  try {
    validatePendingNormalDefeatRecoveryProvenance(snapshot, pending[0].receiptId);
    return pending[0].receiptId;
  } catch { return null; }
}

async function apply(owner: CleanEpochAccountStore, session: NativeSelectedSession,
  destinationSlotId: SaveSlotId, expectedDestinationAddress: Address | null | undefined,
  kind: 'publish' | 'recover'): Promise<NativeSelectedPendingResult> {
  const receiptId = pendingReceiptId(session);
  if (!receiptId) return blocked(session, 'Native selected source lacks one valid pending defeat receipt.');
  if (!SAVE_SLOT_ORDER.some(slot => slot.id === destinationSlotId) ||
      (destinationSlotId !== session.sourceSlotId && expectedDestinationAddress === undefined))
    return blocked(session, 'Cross-slot pending publication requires an observed destination address.');
  const adapter = new CleanEpochNormalDefeatRecoveryAdapter(owner);
  const request = { accountId: session.snapshot.accountId,
    sourceSlotId: session.sourceSlotId, destinationSlotId,
    expectedDestinationAddress: expectedDestinationAddress === undefined
      ? session.sourceAddress : expectedDestinationAddress,
    expectedAccountRevision: session.accountRevision,
    snapshot: session.snapshot,
    control: session.control as unknown as CampaignSessionControl<SaveSnapshot | NativeFreshCampaignSnapshot>,
    receiptId };
  const result = kind === 'publish' ? await adapter.publishPending(request) : await adapter.recover(request);
  if (result.status === 'blocked') return blocked(session, result.message, true);
  try {
    const account = await owner.readSelected(session.snapshot.accountId);
    if (!account || account.revision <= session.accountRevision)
      throw new Error('Pending defeat account revision did not read back.');
    const next = createNativeSelectedSession({ snapshot: result.value.loaded.snapshot,
      control: result.value.loaded.sessionControl, sourceSlotId: destinationSlotId,
      accountRevision: account.revision });
    const receipt = next.snapshot.normalDefeatReceipts?.find(row => row.receiptId === receiptId);
    if (next.sourceAddress.publicationId !== result.value.loaded.publication.publicationId ||
        receipt?.posture !== (kind === 'publish' ? 'recovery_pending' : 'playable') ||
        JSON.stringify(next.snapshot.playerState.gear) !== JSON.stringify(session.snapshot.playerState.gear))
      throw new Error('Pending defeat readback changed its receipt or physical gear.');
    return { status: 'ready', session: next, publicationId: next.sourceAddress.publicationId };
  } catch (error) {
    return blocked(session, error instanceof Error ? error.message : String(error), true);
  }
}

/** Existing account owner publishes the accepted pending mutation; no selected UI route is enabled. */
export function publishNativeSelectedPendingDefeat(owner: CleanEpochAccountStore,
  session: NativeSelectedSession, destinationSlotId: SaveSlotId,
  expectedDestinationAddress?: Address | null): Promise<NativeSelectedPendingResult> {
  return apply(owner, session, destinationSlotId, expectedDestinationAddress, 'publish');
}

/** Recover only from the exact retained pending session and its observed destination. */
export function recoverNativeSelectedPendingDefeat(owner: CleanEpochAccountStore,
  session: NativeSelectedSession, destinationSlotId: SaveSlotId,
  expectedDestinationAddress?: Address | null): Promise<NativeSelectedPendingResult> {
  return apply(owner, session, destinationSlotId, expectedDestinationAddress, 'recover');
}
