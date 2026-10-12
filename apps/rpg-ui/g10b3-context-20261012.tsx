import { createRoot } from 'react-dom/client';
import App from './src/App.tsx';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';

const faults = { preSubmit: false, lostAcknowledgement: false };
const events: Array<Record<string, unknown>> = [];
const originalSave = CleanEpochDescendantAdapter.prototype.save;
CleanEpochDescendantAdapter.prototype.save = async function (...args) {
  if (faults.preSubmit) {
    faults.preSubmit = false;
    events.push({ kind: 'pre_submit_interruption' });
    return { status: 'blocked', code: 'unavailable', message: 'G10B.3 pre-submit interruption',
      accountId: args[0].accountId, slotId: args[0].destinationSlotId };
  }
  const result = await originalSave.apply(this, args);
  if (faults.lostAcknowledgement && result.status === 'ready') {
    faults.lostAcknowledgement = false;
    events.push({ kind: 'lost_post_commit_acknowledgement',
      artifactId: result.value.loaded.sessionControl.loadedArtifactId,
      publicationId: result.value.loaded.sessionControl.loadedPublicationId,
      headRevision: result.value.loaded.sessionControl.campaignHeadRevision });
    return { status: 'blocked', code: 'readback_failed', message: 'G10B.3 lost post-commit acknowledgement',
      accountId: args[0].accountId, slotId: args[0].destinationSlotId };
  }
  return result;
};
(window as Window & { g10b3?: unknown }).g10b3 = { faults, events };
createRoot(document.querySelector<HTMLDivElement>('#root')!).render(<App />);
