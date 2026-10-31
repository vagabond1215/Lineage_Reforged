import type { CampaignSessionControl } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import { createNativeSelectedSession, type NativeSelectedSession } from './nativeSelectedSession.js';
import type { SaveSlotId } from './state.js';

type Address = { artifactId: string; publicationId: string };

/** Derive the selected native session from EpochApp's current reducer pair and observed account source. */
export function readNativeEpochAppSession(input: {
  snapshot: SaveSnapshot;
  campaignSessionControl: CampaignSessionControl;
  sourceSlotId: SaveSlotId | null;
  accountRevision: number | null;
  observedSourceAddress: Address | null | undefined;
}): NativeSelectedSession | null {
  if (input.snapshot.snapshotVersion !== 'lineage.save_snapshot.v3') return null;
  if (!input.sourceSlotId || input.accountRevision === null)
    throw new Error('Native selected account source or revision is unavailable. Reload the campaign.');
  const session = createNativeSelectedSession({ snapshot: input.snapshot,
    control: input.campaignSessionControl, sourceSlotId: input.sourceSlotId,
    accountRevision: input.accountRevision });
  if (!input.observedSourceAddress ||
      session.sourceAddress.artifactId !== input.observedSourceAddress.artifactId ||
      session.sourceAddress.publicationId !== input.observedSourceAddress.publicationId)
    throw new Error('Native selected source address changed. Reload the campaign.');
  return session;
}
