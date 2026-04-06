import { useEffect, useReducer, useState } from 'react';
import { InGameShell } from './game-shell/InGameShell';
import {
  createDefaultCharacterCreationFormState,
  validateCharacterCreationForm
} from './game-shell/characterCreationForm';
import { CharacterCreationScreen } from './game-shell/components/CharacterCreationScreen';
import { LoadGameScreen } from './game-shell/components/LoadGameScreen';
import { MainMenuScreen } from './game-shell/components/MainMenuScreen';
import { SettingsScreen } from './game-shell/components/SettingsScreen';
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
  type ManualSaveSlotId,
  type SaveSlotId,
  type SaveSlotSummary
} from './game-shell/state';

type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'cataclysm-rpg.theme-mode';

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

function formatSaveNoticeTimestamp(savedAt: string | null, savedLabel: string | null): string {
  if (savedLabel) {
    return savedLabel;
  }

  if (!savedAt) {
    return 'an unknown time';
  }

  const parsed = new Date(savedAt);

  if (Number.isNaN(parsed.valueOf())) {
    return 'an unknown time';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(parsed);
}

function formatSaveDestination(slotId: SaveSlotId): string {
  return slotId === 'quick-save' ? 'quicksave' : getSaveSlotLabel(slotId).toLowerCase();
}

function buildSaveStatusNotice(slot: Pick<SaveSlotSummary, 'id' | 'playerName' | 'lastSavedAt' | 'lastSavedLabel'>): GameShellNotice {
  const playerName = slot.playerName ?? 'Unknown character';
  const savedAt = formatSaveNoticeTimestamp(slot.lastSavedAt, slot.lastSavedLabel);
  const message = `Game Data for ${playerName} saved to ${formatSaveDestination(slot.id)} at ${savedAt}.`;

  return {
    tone: 'accent',
    title: 'Game Data Saved',
    detail: message,
    message,
    compact: true,
    autoDismissMs: 15000
  };
}

export default function App() {
  const [state, dispatch] = useReducer(gameShellReducer, undefined, createAppState);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      return storedTheme === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
      } catch {
        // Theme persistence is optional when browser storage is blocked.
      }
    }
  }, [themeMode]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const autoDismissMs = state.notice?.autoDismissMs ?? null;

    if (!autoDismissMs || autoDismissMs <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'SET_NOTICE', notice: null });
    }, autoDismissMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [state.notice]);

  const toggleThemeMode = () => {
    setThemeMode((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

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

  const openCharacterCreation = (targetSlotId?: ManualSaveSlotId) => {
    const next = listSlotsWithFallback('read');
    dispatch({
      type: 'OPEN_CHARACTER_CREATION',
      slots: next.slots,
      form: createDefaultCharacterCreationFormState(
        targetSlotId ?? getPreferredSaveSlotId(next.slots)
      ),
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

  const openSettings = () => {
    const next = listSlotsWithFallback('read');
    dispatch({
      type: 'OPEN_SETTINGS',
      slots: next.slots,
      notice: next.notice
    });
  };

  const continueLatestGame = () => {
    const next = listSlotsWithFallback('read');
    const slotId = getPreferredLoadSlotId(next.slots);

    if (!slotId) {
      dispatch({
        type: 'SHOW_MAIN_MENU',
        slots: next.slots,
        notice: next.notice ?? {
          tone: 'warning',
          title: 'No Save To Continue',
          detail: 'Continue stays disabled until a real save exists in one of the local slots.'
        }
      });
      return;
    }

    try {
      const snapshot = loadSave(slotId);

      if (!snapshot) {
        dispatch({
          type: 'SHOW_MAIN_MENU',
          slots: next.slots,
          notice: next.notice ?? {
            tone: 'warning',
            title: 'Latest Save Unavailable',
            detail: 'The most recent save could not be loaded. Use Load Game to inspect the available slots.'
          }
        });
        return;
      }

      enterGame(slotId, snapshot, {
        tone: 'accent',
        title: 'Continuing Campaign',
        detail: `Continuing ${snapshot.playerState.coreData.playerName} from ${getSaveSlotLabel(slotId)}.`
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('continue the most recent game', error)
      });
    }
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
    if (state.screen !== 'LOAD_GAME' && state.screen !== 'MAIN_MENU') {
      return;
    }

    try {
      deleteSave(slotId);
      const next = listSlotsWithFallback('read');

      if (state.screen === 'LOAD_GAME') {
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
      } else {
        dispatch({
          type: 'SHOW_MAIN_MENU',
          slots: next.slots,
          notice: next.notice ?? {
            tone: 'success',
            title: 'Save Deleted',
            detail: `${getSaveSlotLabel(slotId)} was removed from local browser storage.`
          }
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('delete a local save', error)
      });
    }
  };

  const handleGameDataSlot = (slotId: ManualSaveSlotId) => {
    const next = listSlotsWithFallback('read');
    const selectedSlot = next.slots.find((slot) => slot.id === slotId);

    if (!selectedSlot?.hasSave) {
      openCharacterCreation(slotId);
      return;
    }

    try {
      const snapshot = loadSave(slotId);

      if (!snapshot) {
        dispatch({
          type: 'SHOW_MAIN_MENU',
          slots: next.slots,
          notice: next.notice ?? {
            tone: 'warning',
            title: 'Save Not Available',
            detail: `${getSaveSlotLabel(slotId)} could not be loaded from local browser storage.`
          }
        });
        return;
      }

      enterGame(slotId, snapshot, {
        tone: 'accent',
        title: 'Save Loaded',
        detail: `Continuing ${snapshot.playerState.coreData.playerName} from ${getSaveSlotLabel(slotId)}.`
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('load a local save', error)
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
      const savedSlot = createSave(
        state.activeSlotId,
        state.snapshot,
        buildSaveMetadata(state.activeSlotId, state.snapshot)
      );

      const next = listSlotsWithFallback('read');
      dispatch({
        type: 'COMPLETE_IN_GAME_SAVE',
        slots: next.slots,
        activeSlotId: state.activeSlotId,
        notice: next.notice ?? buildSaveStatusNotice(savedSlot)
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
      const savedSlot = quickSave(state.snapshot);

      const next = listSlotsWithFallback('read');
      dispatch({
        type: 'COMPLETE_IN_GAME_SAVE',
        slots: next.slots,
        activeSlotId: state.activeSlotId,
        notice: next.notice ?? buildSaveStatusNotice(savedSlot)
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

    const next = listSlotsWithFallback('read');
    const activeSlot = next.slots.find((slot) => slot.id === state.activeSlotId) ?? null;

    dispatch({
      type: 'SHOW_MAIN_MENU',
      slots: next.slots,
      notice: next.notice ??
        (state.hasUnsavedChanges
          ? {
              tone: 'warning',
              title: 'Returned Without Saving',
              detail: 'Unsaved in-memory changes were discarded when the session returned to the main menu.'
            }
          : activeSlot?.hasSave
            ? buildSaveStatusNotice(activeSlot)
            : {
                tone: 'accent',
                title: 'Returned To Main Menu',
                detail: 'The current session was left safely and the main menu is ready.'
              })
    });
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

  let content = null;

  if (state.screen === 'MAIN_MENU') {
    content = (
      <MainMenuScreen
        slots={state.slots}
        notice={state.notice}
        onDismissNotice={dismissNotice}
        onActivateSlot={handleGameDataSlot}
        onDeleteSlot={handleDeleteSave}
        onContinue={continueLatestGame}
        onOpenSettings={openSettings}
        onExit={handleExit}
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
      />
    );
  } else if (state.screen === 'CHARACTER_CREATION') {
    content = (
      <CharacterCreationScreen
        form={state.form}
        slots={state.slots}
        notice={state.notice}
        pendingOverwriteSlotId={state.pendingOverwriteSlotId}
        onDismissNotice={dismissNotice}
        onReturnToMainMenu={() => showMainMenu()}
        onChange={(form) => dispatch({ type: 'UPDATE_CHARACTER_CREATION_FORM', form })}
        onCreateGame={() => attemptCreateGame(false)}
        onConfirmOverwrite={() => attemptCreateGame(true)}
        onCancelOverwrite={() => dispatch({ type: 'SET_CHARACTER_OVERWRITE', slotId: null })}
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
      />
    );
  } else if (state.screen === 'LOAD_GAME') {
    content = (
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
  } else if (state.screen === 'SETTINGS') {
    content = (
      <SettingsScreen
        slots={state.slots}
        notice={state.notice}
        onDismissNotice={dismissNotice}
        onBack={() => showMainMenu()}
        onResetSaves={handleResetSaves}
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
      />
    );
  } else {
    content = (
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

  return (
    <div data-theme={themeMode} className="min-h-screen">
      {content}
    </div>
  );
}
