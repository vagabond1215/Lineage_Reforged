import { createRoot } from 'react-dom/client';
import App from './src/App.tsx';
import { CleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';

const faults = { first: false, descendant: false, lost: false };
const events: unknown[] = [];
const ownerPrototype = CleanEpochAccountStore.prototype;
const firstCompletion = ownerPrototype.completePreparedAttemptConsumers;
ownerPrototype.completePreparedAttemptConsumers = async function (...args) {
  if (faults.first) {
    faults.first = false;
    events.push({ kind: 'first_consumer_interrupt', args });
    throw new Error('G10B2 first consumer completion interrupted after publication');
  }
  return firstCompletion.apply(this, args);
};
const descendantCompletion = ownerPrototype.completeDescendantConsumers;
ownerPrototype.completeDescendantConsumers = async function (...args) {
  if (faults.descendant) {
    faults.descendant = false;
    events.push({ kind: 'descendant_consumer_interrupt', args });
    throw new Error('G10B2 descendant consumer completion interrupted after publication');
  }
  return descendantCompletion.apply(this, args);
};
const save = CleanEpochDescendantAdapter.prototype.save;
CleanEpochDescendantAdapter.prototype.save = async function (...args) {
  const result = await save.apply(this, args);
  if (faults.lost && result.status === 'ready') {
    faults.lost = false;
    events.push({ kind: 'lost_post_commit_acknowledgement',
      artifactId: result.value.loaded.sessionControl.loadedArtifactId,
      publicationId: result.value.loaded.sessionControl.loadedPublicationId,
      headRevision: result.value.loaded.sessionControl.campaignHeadRevision });
    return { status: 'blocked', code: 'readback_failed', message: 'G10B2 lost post-commit save acknowledgement',
      accountId: args[0].accountId, slotId: args[0].destinationSlotId };
  }
  return result;
};
(window as Window & { g10b2?: unknown }).g10b2 = { faults, events };
createRoot(document.querySelector<HTMLDivElement>('#root')!).render(<App />);
