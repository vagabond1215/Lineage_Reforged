import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import type { CampaignSessionControl } from '../../../../packages/engines/game-engine/src/campaign-session.js';
import {
  executePlayerSurveyActivityAdvancementCommand,
  preparePlayerSurveyActivityAdvancementCommand,
  resolvePlayerSurveySkillPresentation,
  shouldRetainPlayerSurveyRequestIdentity,
  type PlayerSurveyActivityAdvancementCommand,
  type PlayerSurveyActivityAdvancementPlan,
  type PlayerSurveyActivityAdvancementResult
} from '../../../../packages/engines/game-engine/src/player-survey-activity-advancement.js';

export type AshenReefSurveyCallerOutcome =
  | {
      kind: 'accepted' | 'terminal_result';
      result: PlayerSurveyActivityAdvancementResult;
      notice: PlayerSurveyActivityAdvancementResult['notice'];
    }
  | {
      kind: 'technical_retry';
      result: PlayerSurveyActivityAdvancementResult | null;
      notice: PlayerSurveyActivityAdvancementResult['notice'];
    }
  | {
      kind: 'expected_rejection' | 'unclassified_failure';
      result: null;
      notice: PlayerSurveyActivityAdvancementResult['notice'];
    };

export interface AshenReefSurveyCallerTransition {
  outcome: AshenReefSurveyCallerOutcome;
  acceptedState: {
    snapshot: SaveSnapshot;
    control: CampaignSessionControl;
  } | null;
}

export interface AshenReefSurveyPanelFacts {
  stageLabel: string;
  staminaCost: number;
  mpCost: number;
  skillId: string;
  skillDetail: string;
  operationProgress: number;
}

export function shouldRetainAshenReefSurveyCallerRequestId(
  outcome: AshenReefSurveyCallerOutcome
): boolean {
  return outcome.kind === 'technical_retry';
}

export function isAshenReefSurveyAdvanceDisabled(
  plan: PlayerSurveyActivityAdvancementPlan
): boolean {
  return !plan.accepted;
}

export function resolveAshenReefSurveyPanelFacts(
  plan: PlayerSurveyActivityAdvancementPlan
): AshenReefSurveyPanelFacts | null {
  if (!plan.accepted) return null;
  return {
    stageLabel: plan.stage.replace(/_/g, ' '),
    staminaCost: plan.resourceCosts.stamina,
    mpCost: plan.resourceCosts.mp,
    skillId: plan.skill.skillId,
    skillDetail: resolvePlayerSurveySkillPresentation(plan.skill).detail,
    operationProgress: plan.operation.progress
  };
}

export function advanceAshenReefSurveyCaller(
  snapshot: SaveSnapshot,
  campaignSessionControl: CampaignSessionControl,
  requestId: string,
  commandCache: Map<string, PlayerSurveyActivityAdvancementCommand>
): AshenReefSurveyCallerTransition {
  let command = commandCache.get(requestId);
  if (!command) {
    const preparation = preparePlayerSurveyActivityAdvancementCommand(
      snapshot,
      campaignSessionControl,
      requestId
    );
    if (preparation.kind !== 'prepared') {
      commandCache.delete(requestId);
      return {
        outcome: {
          kind: preparation.kind,
          result: null,
          notice: preparation.notice
        },
        acceptedState: null
      };
    }
    command = preparation.command;
    commandCache.set(requestId, command);
  }
  const result = executePlayerSurveyActivityAdvancementCommand(
    snapshot,
    campaignSessionControl,
    command
  );
  const retainRequestIdentity = shouldRetainPlayerSurveyRequestIdentity(result);
  if (!retainRequestIdentity) {
    commandCache.delete(requestId);
  }
  if (result.accepted) {
    return {
      outcome: { kind: 'accepted', result, notice: result.notice },
      acceptedState: { snapshot: result.snapshot, control: result.control }
    };
  }
  return {
    outcome: retainRequestIdentity
      ? { kind: 'technical_retry', result, notice: result.notice }
      : { kind: 'terminal_result', result, notice: result.notice },
    acceptedState: null
  };
}
