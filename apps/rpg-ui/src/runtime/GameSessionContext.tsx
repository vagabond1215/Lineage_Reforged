import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import { UiViewModelProvider } from './UiViewModelContext.js';
import { createUiViewModel, type UiViewModel } from './uiViewModel.js';

export interface GameSessionState {
  snapshot: SaveSnapshot;
  uiViewModel: UiViewModel;
}

export interface GameSessionContextValue extends GameSessionState {
  updateSnapshot: (snapshot: SaveSnapshot) => void;
}

const GameSessionContext = createContext<GameSessionContextValue | null>(null);

export function createGameSessionState(snapshot: SaveSnapshot): GameSessionState {
  return {
    snapshot,
    uiViewModel: createUiViewModel(snapshot)
  };
}

type GameSessionProviderProps = {
  snapshot: SaveSnapshot;
  onSnapshotChange: (snapshot: SaveSnapshot) => void;
  children: ReactNode;
};

export function GameSessionProvider({
  snapshot,
  onSnapshotChange,
  children
}: GameSessionProviderProps) {
  const sessionState = useMemo(() => createGameSessionState(snapshot), [snapshot]);
  const contextValue = useMemo<GameSessionContextValue>(
    () => ({
      ...sessionState,
      updateSnapshot: onSnapshotChange
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
