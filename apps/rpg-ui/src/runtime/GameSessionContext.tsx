import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';
import type {
  AccountProfileState,
  GameDelta,
  SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';
import {
  admitCampaignMutation,
  type CampaignMutationOwnerKind,
  type CampaignSessionControl
} from '../../../../packages/engines/game-engine/src/campaign-session.js';
import {
  repairPlayerSurveyActivityProjection,
  type PlayerSurveyActivityAdvancementCommand,
  type PlayerSurveyProjectionRepairResult
} from '../../../../packages/engines/game-engine/src/player-survey-activity-advancement.js';
import type { AshenReefSurveyProjectionKind } from '../../../../packages/shared/types/src/index.js';
import {
  createAuthorityId
} from '../../../../packages/engines/game-engine/src/campaign-rules.js';
import { UiViewModelProvider } from './UiViewModelContext.js';
import { createUiViewModel, type UiViewModel } from './uiViewModel.js';
import {
  buildBodyStatePresentation,
  createInitialBodyStatePresentationMemory,
  type BodyStatePresentationMemory,
  type BodyStatePresentationViewModel
} from './bodyStatePresentation.js';
import {
  advanceAshenReefSurveyCaller,
  type AshenReefSurveyCallerOutcome
} from './ashenReefSurveyCaller.js';

export type { AshenReefSurveyCallerOutcome } from './ashenReefSurveyCaller.js';

export interface GameSessionState {
  accountProfile: AccountProfileState;
  snapshot: SaveSnapshot;
  uiViewModel: UiViewModel;
  bodyStatePresentation: BodyStatePresentationViewModel;
}

export interface GameSessionContextValue extends GameSessionState {
  campaignSessionControl: CampaignSessionControl;
  updateSnapshot: (
    snapshot: SaveSnapshot,
    options?: {
      accepted?: boolean;
      ownerKind?: CampaignMutationOwnerKind;
      mutationId?: string;
      resultId?: string;
      explicitRecoveryDestinationId?: string | null;
    }
  ) => void;
  advanceAshenReefSurvey: (
    requestId: string
  ) => AshenReefSurveyCallerOutcome;
  repairAshenReefSurveyProjection: (
    resultId: string,
    projectionKind: AshenReefSurveyProjectionKind
  ) => PlayerSurveyProjectionRepairResult;
  dismissBodyStateToast: () => void;
}

const GameSessionContext = createContext<GameSessionContextValue | null>(null);
const EMPTY_GAME_DELTAS: readonly GameDelta[] = [];

export function createGameSessionState(
  accountProfile: AccountProfileState,
  snapshot: SaveSnapshot,
  memory: BodyStatePresentationMemory = createInitialBodyStatePresentationMemory(),
  dismissedToastIds: Set<string> = new Set(),
  gameDeltas: readonly GameDelta[] = []
): GameSessionState {
  const bodyStatePresentation = buildBodyStatePresentation(snapshot, memory, dismissedToastIds);

  return {
    accountProfile,
    snapshot,
    bodyStatePresentation,
    uiViewModel: createUiViewModel(snapshot, bodyStatePresentation, accountProfile, gameDeltas)
  };
}

type GameSessionProviderProps = {
  accountProfile: AccountProfileState;
  snapshot: SaveSnapshot;
  campaignSessionControl: CampaignSessionControl;
  gameDeltas?: readonly GameDelta[];
  onSnapshotChange: (
    snapshot: SaveSnapshot,
    campaignSessionControl: CampaignSessionControl
  ) => void;
  children: ReactNode;
};

export function GameSessionProvider({
  accountProfile,
  gameDeltas = EMPTY_GAME_DELTAS,
  snapshot,
  campaignSessionControl,
  onSnapshotChange,
  children
}: GameSessionProviderProps) {
  const presentationMemoryRef = useRef<BodyStatePresentationMemory>(
    createInitialBodyStatePresentationMemory()
  );
  const surveyCommandRef = useRef<Map<string, PlayerSurveyActivityAdvancementCommand>>(new Map());
  const [dismissedToastIds, setDismissedToastIds] = useState<string[]>([]);
  const dismissedToastIdSet = useMemo(() => new Set(dismissedToastIds), [dismissedToastIds]);
  const sessionState = useMemo(
    () =>
      createGameSessionState(
        accountProfile,
        snapshot,
        presentationMemoryRef.current,
        dismissedToastIdSet,
        gameDeltas
      ),
    [
      accountProfile,
      campaignSessionControl,
      dismissedToastIdSet,
      gameDeltas,
      snapshot
    ]
  );

  useEffect(() => {
    presentationMemoryRef.current = sessionState.bodyStatePresentation.nextMemory;
  }, [sessionState.bodyStatePresentation]);

  const contextValue = useMemo<GameSessionContextValue>(
    () => ({
      ...sessionState,
      campaignSessionControl,
      updateSnapshot: (proposedSnapshot, options = {}) => {
        const admission = admitCampaignMutation(campaignSessionControl, {
          mutationId:
            options.mutationId ?? createAuthorityId('mutation'),
          sourceArtifactId:
            campaignSessionControl.loadedArtifactId,
          sourceRevision:
            campaignSessionControl.sessionRevision,
          ownerKind:
            options.ownerKind ?? 'legacy_bridge',
          accepted:
            options.accepted ?? proposedSnapshot !== snapshot,
          sourceSnapshot: snapshot,
          proposedSnapshot,
          ...(options.resultId
            ? { resultId: options.resultId }
            : {}),
          ...(options.explicitRecoveryDestinationId !== undefined
            ? {
                explicitRecoveryDestinationId:
                  options.explicitRecoveryDestinationId
              }
            : {})
        });

        if (admission.accepted) {
          onSnapshotChange(
            admission.snapshot,
            admission.control
          );
        }
      },
      advanceAshenReefSurvey: (requestId) => {
        const transition = advanceAshenReefSurveyCaller(
          snapshot,
          campaignSessionControl,
          requestId,
          surveyCommandRef.current
        );
        if (transition.acceptedState) {
          onSnapshotChange(
            transition.acceptedState.snapshot,
            transition.acceptedState.control
          );
        }
        return transition.outcome;
      },
      repairAshenReefSurveyProjection: (resultId, projectionKind) => {
        const result = repairPlayerSurveyActivityProjection(
          snapshot,
          campaignSessionControl,
          resultId,
          projectionKind
        );
        if (result.accepted) {
          onSnapshotChange(result.snapshot, result.control);
        }
        return result;
      },
      dismissBodyStateToast: () => {
        const toastId = sessionState.bodyStatePresentation.toastId;
        if (!toastId) {
          return;
        }

        setDismissedToastIds((current) =>
          current.includes(toastId) ? current : [...current, toastId]
        );
      }
    }),
    [
      campaignSessionControl,
      onSnapshotChange,
      sessionState,
      snapshot
    ]
  );

  return (
    <GameSessionContext.Provider value={contextValue}>
      <UiViewModelProvider value={contextValue.uiViewModel}>{children}</UiViewModelProvider>
    </GameSessionContext.Provider>
  );
}

export function useGameSession() {
  const context = useContext(GameSessionContext);

  if (!context) {
    throw new Error('Game session context is not available. Wrap the UI in GameSessionProvider.');
  }

  return context;
}
