import type { CampaignSessionControl } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import type { CleanEpochAccountStore, CleanEpochTerminalRecovery } from './cleanEpochAccountStore.js';
import type { CampaignStoreFailureCode } from './campaignIndexedDbStore.js';
import { CleanEpochTerminalAdapter, type EpochTerminalResult } from './cleanEpochTerminalAdapter.js';
import { isNativeSelectedGameplaySource } from './nativeSelectedGameplay.js';
import type { NativeSelectedSession } from './nativeSelectedSession.js';

export type NativeSelectedTerminalResult = Extract<EpochTerminalResult, { status: 'completed' }> | {
  status: 'blocked'; session: NativeSelectedSession;
  code: CampaignStoreFailureCode | 'invalid_input'; message: string; requiresReload: boolean;
};

function blocked(session: NativeSelectedSession, message: string,
  requiresReload = false): NativeSelectedTerminalResult {
  return { status: 'blocked', session, code: 'invalid_input', message, requiresReload };
}

function samePendingSource(recovery: CleanEpochTerminalRecovery,
  session: NativeSelectedSession): boolean {
  return recovery.accountId === session.snapshot.accountId &&
    recovery.campaignId === session.control.campaignId &&
    recovery.slotId === session.sourceSlotId &&
    recovery.sourceArtifactId === session.sourceAddress.artifactId &&
    recovery.sourcePublicationId === session.sourceAddress.publicationId &&
    recovery.sourceAddress.artifactId === session.sourceAddress.artifactId &&
    recovery.sourceAddress.publicationId === session.sourceAddress.publicationId &&
    recovery.expectedAccountRevision === session.accountRevision;
}

/** The existing terminal owner publishes the exact native selected pair. No UI route is activated here. */
export async function retireNativeSelectedSession(owner: CleanEpochAccountStore,
  session: NativeSelectedSession): Promise<NativeSelectedTerminalResult> {
  if (!isNativeSelectedGameplaySource(session))
    return blocked(session, 'Native terminal source is invalid or has a pending Normal defeat.');
  const result = await new CleanEpochTerminalAdapter(owner).retire({
    accountId: session.snapshot.accountId, sourceSlotId: session.sourceSlotId,
    expectedAccountRevision: session.accountRevision, snapshot: session.snapshot,
    control: session.control as unknown as CampaignSessionControl,
    expectedSourceAddress: session.sourceAddress
  });
  return result.status === 'completed' ? result : { ...result, session, requiresReload: true };
}

/** Resume only a terminal settlement already accepted from this same selected source. */
export async function resumeNativeSelectedTerminal(owner: CleanEpochAccountStore,
  session: NativeSelectedSession): Promise<NativeSelectedTerminalResult> {
  if (!isNativeSelectedGameplaySource(session))
    return blocked(session, 'Native terminal source is invalid or has a pending Normal defeat.');
  let pending: CleanEpochTerminalRecovery | null;
  try {
    pending = await owner.readPendingTerminalForAccount(session.snapshot.accountId);
  } catch (error) {
    return blocked(session, error instanceof Error ? error.message : String(error), true);
  }
  if (!pending) return blocked(session, 'No pending terminal settlement exists for this account.');
  if (!samePendingSource(pending, session))
    return blocked(session, 'Pending terminal settlement belongs to a different source.');
  const result = await new CleanEpochTerminalAdapter(owner).resumePending(session.snapshot.accountId);
  return result?.status === 'completed' ? result : blocked(session,
    result?.message ?? 'Pending terminal settlement was not retained.', true);
}
