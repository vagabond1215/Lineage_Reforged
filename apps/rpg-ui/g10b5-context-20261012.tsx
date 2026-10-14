import { createRoot } from 'react-dom/client';
import App from './src/App.tsx';
import { CleanEpochAccountStore } from './src/game-shell/cleanEpochAccountStore.ts';
import { CleanEpochDescendantAdapter } from './src/game-shell/cleanEpochDescendantAdapter.ts';

// One-shot interruptions wrap the real selected caller; they never write a fixture row.
const faults = { firstConsumer: false, descendantConsumer: false, preSubmit: false, lostAck: false };
const events: Array<Record<string, unknown>> = [];
const first = CleanEpochAccountStore.prototype.completePreparedAttemptConsumers;
CleanEpochAccountStore.prototype.completePreparedAttemptConsumers = async function (...args) {
  if (faults.firstConsumer) {
    faults.firstConsumer = false;
    events.push({ kind: 'first_consumer', accountId: args[0], slotId: args[1] });
    throw Error('G10B.5 one-shot first consumer interruption');
  }
  return first.apply(this, args);
};
const descendant = CleanEpochAccountStore.prototype.completeDescendantConsumers;
CleanEpochAccountStore.prototype.completeDescendantConsumers = async function (...args) {
  if (faults.descendantConsumer) {
    faults.descendantConsumer = false;
    events.push({ kind: 'descendant_consumer', accountId: args[0], slotId: args[1] });
    throw Error('G10B.5 one-shot descendant consumer interruption');
  }
  return descendant.apply(this, args);
};
const save = CleanEpochDescendantAdapter.prototype.save;
CleanEpochDescendantAdapter.prototype.save = async function (...args) {
  if (faults.preSubmit) {
    faults.preSubmit = false;
    events.push({ kind: 'pre_submit', accountId: args[0].accountId });
    return { status: 'blocked', code: 'unavailable', message: 'G10B.5 pre-submit interruption',
      accountId: args[0].accountId, slotId: args[0].destinationSlotId };
  }
  const result = await save.apply(this, args);
  if (faults.lostAck && result.status === 'ready') {
    faults.lostAck = false;
    const control = result.value.loaded.sessionControl;
    events.push({ kind: 'lost_ack', artifactId: control.loadedArtifactId,
      publicationId: control.loadedPublicationId, headRevision: control.campaignHeadRevision });
    return { status: 'blocked', code: 'readback_failed', message: 'G10B.5 lost acknowledgement',
      accountId: args[0].accountId, slotId: args[0].destinationSlotId };
  }
  return result;
};
(window as Window & { g10b5?: unknown }).g10b5 = { faults, events };
createRoot(document.querySelector<HTMLDivElement>('#root')!).render(<App />);
