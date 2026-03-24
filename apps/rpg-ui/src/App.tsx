import { useReducer } from 'react';
import { InGameShell } from './game-shell/InGameShell';
import {
  createDefaultCharacterCreationFormState,
  validateCharacterCreationForm
} from './game-shell/characterCreationForm';
import { CharacterCreationScreen } from './game-shell/components/CharacterCreationScreen';
import { LoadGameScreen } from './game-shell/components/LoadGameScreen';
import { MainMenuScreen } from './game-shell/components/MainMenuScreen';
import { createNewGameSnapshot } from './game-shell/newGameSnapshot';
import {
  buildSaveMetadata,
  createSave,
  deleteSave,
  listSaves,
  loadSave,
  quickSave,
  resetAllSaves
} from './game-shell/saveManager';
import {
  createEmptySaveSlotSummaries,
  createInitialGameShellState,
  gameShellReducer,
  getPreferredLoadSlotId,
  getPreferredSaveSlotId,
  getSaveSlotLabel,
  type GameShellNotice,
  type GameShellState,
  type SaveSlotId
} from './game-shell/state';

function buildStorageNotice(action: string, error: unknown): GameShellNotice {
  const detail =
    error instanceof Error
      ? error.message
      : 'The browser blocked localStorage access for this page.';

  return {
    tone: 'warning',
    title: 'Local Save Storage Unavailable',
    detail: `Could not ${action} browser save data. ${detail}`
  };
}

function listSlotsWithFallback(action: string): {
  slots: ReturnType<typeof createEmptySaveSlotSummaries>;
  notice: GameShellNotice | null;
} {
  try {
    return {
      slots: listSaves(),
      notice: null
    };
  } catch (error) {
    return {
      slots: createEmptySaveSlotSummaries(),
      notice: buildStorageNotice(action, error)
    };
  }
}

function createAppState(_: undefined): GameShellState {
  const { slots, notice } = listSlotsWithFallback('read');
  return createInitialGameShellState(slots, notice);
}

export default function App() {
  const [state, dispatch] = useReducer(gameShellReducer, undefined, createAppState);

  const dismissNotice = () => {
    dispatch({ type: 'SET_NOTICE', notice: null });
  };

  const showMainMenu = (notice: GameShellNotice | null = null) => {
    const next = listSlotsWithFallback('read');
    dispatch({
      type: 'SHOW_MAIN_MENU',
      slots: next.slots,
      notice: next.notice ?? notice
    });
  };

  const enterGame = (
    slotId: SaveSlotId,
    snapshot: ReturnType<typeof createNewGameSnapshot>,
    notice: GameShellNotice | null
  ) => {
    const next = listSlotsWithFallback('read');
    dispatch({
      type: 'ENTER_GAME',
      slots: next.slots,
      slotId,
      snapshot,
      notice: next.notice ?? notice
    });
  };

  const openCharacterCreation = () => {
    const next = listSlotsWithFallback('read');
    dispatch({
      type: 'OPEN_CHARACTER_CREATION',
      slots: next.slots,
      form: createDefaultCharacterCreationFormState(getPreferredSaveSlotId(next.slots)),
      notice: next.notice
    });
  };

  const openLoadGame = () => {
    const next = listSlotsWithFallback('read');
    dispatch({
      type: 'OPEN_LOAD_GAME',
      slots: next.slots,
      selectedSlotId: getPreferredLoadSlotId(next.slots),
      notice: next.notice
    });
  };

  const attemptCreateGame = (forceOverwrite: boolean) => {
    if (state.screen !== 'CHARACTER_CREATION') {
      return;
    }

    const playerName = state.form.playerName.trim();
    const validation = validateCharacterCreationForm({
      ...state.form,
      playerName
    });

    if (!validation.isValid) {
      dispatch({
        type: 'SET_NOTICE',
        notice: {
          tone: 'warning',
          title: 'Character Creation Incomplete',
          detail: 'Complete the required character fields before starting a new campaign.'
        }
      });
      return;
    }

    const selectedSlot = state.slots.find((slot) => slot.id === state.form.saveSlotId);

    if (selectedSlot?.hasSave && !forceOverwrite) {
      dispatch({
        type: 'SET_CHARACTER_OVERWRITE',
        slotId: state.form.saveSlotId
      });
      return;
    }

    try {
      const snapshot = createNewGameSnapshot({
        ...state.form,
        playerName
      });

      createSave(
        state.form.saveSlotId,
        snapshot,
        buildSaveMetadata(state.form.saveSlotId, snapshot)
      );

      enterGame(state.form.saveSlotId, snapshot, {
        tone: 'success',
        title: 'Campaign Started',
        detail: `${playerName} was written to ${selectedSlot?.label ?? state.form.saveSlotId} and entered the world.`
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('create or save a new game', error)
      });
    }
  };

  const loadSelectedGame = () => {
    if (state.screen !== 'LOAD_GAME') {
      return;
    }

    if (!state.selectedSlotId) {
      dispatch({
        type: 'SET_NOTICE',
        notice: {
          tone: 'warning',
          title: 'No Save Selected',
          detail: 'Choose an occupied slot before attempting to load.'
        }
      });
      return;
    }

    try {
      const snapshot = loadSave(state.selectedSlotId);

      if (!snapshot) {
        const next = listSlotsWithFallback('read');
        dispatch({
          type: 'OPEN_LOAD_GAME',
          slots: next.slots,
          selectedSlotId: getPreferredLoadSlotId(next.slots),
          notice: next.notice ?? {
            tone: 'warning',
            title: 'Save Not Available',
            detail: 'That slot is empty or its local save data could not be read.'
          }
        });
        return;
      }

      enterGame(state.selectedSlotId, snapshot, {
        tone: 'accent',
        title: 'Save Loaded',
        detail: `Continuing ${snapshot.playerState.coreData.playerName} from ${getSaveSlotLabel(state.selectedSlotId)}.`
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('load a local save', error)
      });
    }
  };

  const handleDeleteSave = (slotId: SaveSlotId) => {
    if (state.screen !== 'LOAD_GAME') {
      return;
    }

    try {
      deleteSave(slotId);
      const next = listSlotsWithFallback('read');

      dispatch({
        type: 'OPEN_LOAD_GAME',
        slots: next.slots,
        selectedSlotId: getPreferredLoadSlotId(next.slots),
        notice: next.notice ?? {
          tone: 'success',
          title: 'Save Deleted',
          detail: `${getSaveSlotLabel(slotId)} was removed from local browser storage.`
        }
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('delete a local save', error)
      });
    }
  };

  const handleResetSaves = () => {
    try {
      resetAllSaves();
      showMainMenu({
        tone: 'success',
        title: 'Save Data Reset',
        detail: 'All manual save slots and the dedicated quick-save slot were cleared from this browser.'
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('reset local saves', error)
      });
    }
  };

  const handleSaveGame = () => {
    if (state.screen !== 'IN_GAME') {
      return;
    }

    try {
      createSave(
        state.activeSlotId,
        state.snapshot,
        buildSaveMetadata(state.activeSlotId, state.snapshot)
      );

      const next = listSlotsWithFallback('read');
      dispatch({
        type: 'COMPLETE_IN_GAME_SAVE',
        slots: next.slots,
        activeSlotId: state.activeSlotId,
        notice: next.notice ?? {
          tone: 'success',
          title: 'Game Saved',
          detail: `${state.snapshot.playerState.coreData.playerName} was saved to ${getSaveSlotLabel(state.activeSlotId)}.`
        }
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('save the current game', error)
      });
    }
  };

  const handleQuickSaveGame = () => {
    if (state.screen !== 'IN_GAME') {
      return;
    }

    try {
      quickSave(state.snapshot);

      const next = listSlotsWithFallback('read');
      dispatch({
        type: 'COMPLETE_IN_GAME_SAVE',
        slots: next.slots,
        activeSlotId: state.activeSlotId,
        notice: next.notice ?? {
          tone: 'accent',
          title: 'Quick Save Complete',
          detail: `${state.snapshot.playerState.coreData.playerName} was written to the dedicated quick-save slot.`
        }
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('quick-save the current game', error)
      });
    }
  };

  const handleReturnToMainMenu = () => {
    if (state.screen !== 'IN_GAME') {
      return;
    }

    if (state.hasUnsavedChanges && typeof window !== 'undefined') {
      const confirmed = window.confirm(
        'Return to the main menu and discard unsaved in-game changes? Use Save or Quick Save first to keep them.'
      );

      if (!confirmed) {
        return;
      }
    }

    showMainMenu(
      state.hasUnsavedChanges
        ? {
            tone: 'warning',
            title: 'Returned Without Saving',
            detail: 'Unsaved in-memory changes were discarded when the session returned to the main menu.'
          }
        : {
            tone: 'accent',
            title: 'Returned To Main Menu',
            detail: 'The current session was left safely and the main menu is ready.'
          }
    );
  };

  const handleExit = () => {
    dispatch({
      type: 'SET_NOTICE',
      notice: {
        tone: 'warning',
        title: 'Exit Requested',
        detail:
          'Browsers often block scripted tab closes. If this tab remains open, close it manually from your browser.'
      }
    });

    if (typeof window !== 'undefined') {
      try {
        window.close();
      } catch {
        // Browser-safe fallback is the visible notice above.
      }
    }
  };

  if (state.screen === 'MAIN_MENU') {
    return (
      <MainMenuScreen
        slots={state.slots}
        notice={state.notice}
        isResetConfirmationOpen={state.isResetConfirmationOpen}
        onDismissNotice={dismissNotice}
        onNewGame={openCharacterCreation}
        onLoadGame={openLoadGame}
        onOpenResetConfirmation={() => dispatch({ type: 'SET_RESET_CONFIRMATION', open: true })}
        onCloseResetConfirmation={() => dispatch({ type: 'SET_RESET_CONFIRMATION', open: false })}
        onConfirmReset={handleResetSaves}
        onExit={handleExit}
      />
    );
  }

  if (state.screen === 'CHARACTER_CREATION') {
    return (
      <CharacterCreationScreen
        form={state.form}
        slots={state.slots}
        notice={state.notice}
        pendingOverwriteSlotId={state.pendingOverwriteSlotId}
        onDismissNotice={dismissNotice}
        onBack={() => showMainMenu()}
        onChange={(form) => dispatch({ type: 'UPDATE_CHARACTER_CREATION_FORM', form })}
        onCreateGame={() => attemptCreateGame(false)}
        onConfirmOverwrite={() => attemptCreateGame(true)}
        onCancelOverwrite={() => dispatch({ type: 'SET_CHARACTER_OVERWRITE', slotId: null })}
      />
    );
  }

  if (state.screen === 'LOAD_GAME') {
    return (
      <LoadGameScreen
        slots={state.slots}
        notice={state.notice}
        selectedSlotId={state.selectedSlotId}
        onDismissNotice={dismissNotice}
        onBack={() => showMainMenu()}
        onSelectSlot={(slotId) => dispatch({ type: 'SELECT_LOAD_SLOT', slotId })}
        onLoadSelected={loadSelectedGame}
        onDeleteSlot={handleDeleteSave}
      />
    );
  }

  return (
    <InGameShell
      snapshot={state.snapshot}
      slots={state.slots}
      activeSlotId={state.activeSlotId}
      hasUnsavedChanges={state.hasUnsavedChanges}
      notice={state.notice}
      onDismissNotice={dismissNotice}
      onSnapshotChange={(snapshot) => {
        dispatch({
          type: 'UPDATE_IN_GAME_SNAPSHOT',
          slots: state.slots,
          snapshot
        });
      }}
      onSave={handleSaveGame}
      onQuickSave={handleQuickSaveGame}
      onReturnToMainMenu={handleReturnToMainMenu}
    />
  );
}
