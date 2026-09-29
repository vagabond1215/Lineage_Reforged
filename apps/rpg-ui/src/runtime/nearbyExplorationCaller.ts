import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import {
  createNearbyExplorationCommand,
  executeNearbyExplorationCommand,
  resolveNearbyExplorationPlan
} from '../../../../packages/engines/game-engine/src/player-nearby-exploration.js';
import {
  admitCampaignMutation,
  type CampaignSessionControl
} from '../../../../packages/engines/game-engine/src/campaign-session.js';

export function advanceNearbyExplorationCaller(snapshot: SaveSnapshot, control: CampaignSessionControl) {
  const plan = resolveNearbyExplorationPlan(snapshot);
  if (!plan.available) return { acceptedState: null, outcome: { accepted: false, code: plan.code, message: plan.reason } };
  const command = createNearbyExplorationCommand(snapshot);
  const result = executeNearbyExplorationCommand(snapshot, command);
  if (!result.accepted) return { acceptedState: null, outcome: { accepted: false, code: result.code, message: "Nearby exploration could not be applied. Review the current state." } };
  const admission = admitCampaignMutation(control, {
    mutationId: result.commandId,
    sourceArtifactId: control.loadedArtifactId,
    sourceRevision: control.sessionRevision,
    ownerKind: 'engine_result',
    accepted: true,
    sourceSnapshot: snapshot,
    proposedSnapshot: result.snapshot,
    resultId: result.resultId
  });
  if (!admission.accepted) return { acceptedState: null, outcome: { accepted: false, code: admission.reason, message: "Nearby exploration was not accepted by the campaign." } };
  return {
    acceptedState: { snapshot: admission.snapshot, control: admission.control },
    outcome: {
      accepted: true,
      code: result.code,
      message: result.code === 'candidate_pending'
        ? 'Signs of nearby danger were found. No encounter has begun.'
        : 'No encounter was found along the nearby approach.'
    }
  };
}
