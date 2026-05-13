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
import { UiViewModelProvider } from './UiViewModelContext.js';
import { createUiViewModel, type UiViewModel } from './uiViewModel.js';
import {
  buildBodyStatePresentation,
  createInitialBodyStatePresentationMemory,
  type BodyStatePresentationMemory,
  type BodyStatePresentationViewModel
} from './bodyStatePresentation.js';

export interface GameSessionState {
  accountProfile: AccountProfileState;
  snapshot: SaveSnapshot;
  uiViewModel: UiViewModel;
  bodyStatePresentation: BodyStatePresentationViewModel;
}

export interface GameSessionContextValue extends GameSessionState {
  updateSnapshot: (snapshot: SaveSnapshot) => void;
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
  gameDeltas?: readonly GameDelta[];
  onSnapshotChange: (snapshot: SaveSnapshot) => void;
  children: ReactNode;
};

export function GameSessionProvider({
  accountProfile,
  gameDeltas = EMPTY_GAME_DELTAS,
  snapshot,
  onSnapshotChange,
  children
}: GameSessionProviderProps) {
  const presentationMemoryRef = useRef<BodyStatePresentationMemory>(
    createInitialBodyStatePresentationMemory()
  );
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
    [accountProfile, dismissedToastIdSet, gameDeltas, snapshot]
  );

  useEffect(() => {
    presentationMemoryRef.current = sessionState.bodyStatePresentation.nextMemory;
  }, [sessionState.bodyStatePresentation]);

  const contextValue = useMemo<GameSessionContextValue>(
    () => ({
      ...sessionState,
      updateSnapshot: onSnapshotChange,
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
    [onSnapshotChange, sessionState]
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
