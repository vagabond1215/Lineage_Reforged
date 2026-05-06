import { useEffect, useReducer, useState } from 'react';
import {
  evaluateAchievementProgress,
  markRunDeleted
} from '../../../packages/engines/game-engine/src/achievements.js';
import {
  createDefaultAccountProfileState
} from '../../../packages/engines/game-engine/src/legacy-account.js';
import {
  consumeSelectedLegacyPreparations,
  getLegacyPreparationChoiceLabel,
  purchaseLegacyUnlock,
  removeLegacyPreparation,
  resolveLegacyPreparationSelection,
  setLegacyPreparationChoice,
  selectLegacyPreparation,
  type LegacyPreparationSelectionFailureReason,
  type LegacyUnlockPurchaseFailureReason
} from '../../../packages/engines/game-engine/src/legacy-unlocks.js';
import { InGameShell } from './game-shell/InGameShell';
import {
  createDefaultCharacterCreationFormState,
  validateCharacterCreationForm
} from './game-shell/characterCreationForm';
import { CharacterCreationScreen } from './game-shell/components/CharacterCreationScreen';
import { LoadGameScreen } from './game-shell/components/LoadGameScreen';
import { LocalAccountAccessScreen } from './game-shell/components/LocalAccountAccessScreen';
import { MainMenuScreen, type LauncherSectionId } from './game-shell/components/MainMenuScreen';
import { SettingsScreen } from './game-shell/components/SettingsScreen';
import { createNewGameSnapshot } from './game-shell/newGameSnapshot';
import {
  loadAccountProfile,
  saveAccountProfile
} from './game-shell/accountProfileManager.js';
import {
  MALFORMED_AUTH_NOTICE,
  bootstrapLauncherAuth,
  createLocalAccount,
  deleteLocalAccount,
  signInLocalAccount,
  signOutLauncherSession,
  type LauncherAccountDeletionResult,
  type LauncherAccountResetResult,
  type LauncherAuthResult,
  type LauncherRuntimeSession,
  resetLocalAccount
} from './game-shell/launcherAuthManager.js';
import {
  archiveActiveRun,
  consumeRetiredRunInheritanceUse,
  purgeBlockedRunSlot,
  resolveEligibleHeirSources,
  resolveHeirSourceById,
  resolveTerminalArchiveReason
} from './game-shell/runLifecycle.js';
import {
  buildSaveMetadata,
  createSave,
  deleteSave,
  listSaves,
  loadSave,
  quickSave
} from './game-shell/saveManager';
import {
  createAccountAccessState,
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
type ThemePreference = ThemeMode | 'system';
type HourFormatPreference = '12' | '24';

type LauncherTimeSettings = {
  timeZone: string;
  hourFormat: HourFormatPreference;
};

const THEME_STORAGE_KEY = 'cataclysm-rpg.theme-mode';
const TIME_SETTINGS_STORAGE_KEY = 'cataclysm-rpg.launcher-time-settings.v1';

function resolveSystemTheme(): ThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function readInitialThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      return storedTheme;
    }
  } catch {
    return 'system';
  }

  return 'system';
}

function resolveDefaultTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

function readInitialTimeSettings(): LauncherTimeSettings {
  const fallback: LauncherTimeSettings = {
    timeZone: resolveDefaultTimeZone(),
    hourFormat: '12'
  };

  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(TIME_SETTINGS_STORAGE_KEY);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<LauncherTimeSettings>;

    return {
      timeZone:
        typeof parsed.timeZone === 'string' && parsed.timeZone.trim()
          ? parsed.timeZone
          : fallback.timeZone,
      hourFormat: parsed.hourFormat === '24' ? '24' : '12'
    };
  } catch {
    return fallback;
  }
}

function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function resolveClockTimeZone(timeZone: string): string {
  const trimmed = timeZone.trim();
  return trimmed && isValidTimeZone(trimmed) ? trimmed : resolveDefaultTimeZone();
}

function formatLauncherClock(
  now: Date,
  timeSettings: LauncherTimeSettings
): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: timeSettings.hourFormat === '12',
    timeZone: resolveClockTimeZone(timeSettings.timeZone)
  }).format(now);
}

function formatLauncherClockTitle(
  now: Date,
  timeSettings: LauncherTimeSettings
): string {
  const resolvedTimeZone = resolveClockTimeZone(timeSettings.timeZone);

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
    hour12: timeSettings.hourFormat === '12',
    timeZone: resolvedTimeZone
  }).format(now);
}

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

function buildAuthNotice(
  title: string,
  detail: string,
  tone: GameShellNotice['tone'] = 'warning'
): GameShellNotice {
  return {
    tone,
    title,
    detail
  };
}

function buildLegacyPurchaseFailureNotice(
  error: LegacyUnlockPurchaseFailureReason
): GameShellNotice {
  switch (error) {
    case 'unknown_unlock':
      return buildAuthNotice(
        'Unlock Not Found',
        'That Legacy unlock is not available in this catalog.'
      );
    case 'max_rank':
      return buildAuthNotice(
        'Legacy Complete',
        'That Legacy unlock is already maxed.'
      );
    case 'unsupported_requirement':
      return buildAuthNotice(
        'Requirement Not Ready',
        'That Legacy unlock depends on a future account requirement.'
      );
    case 'ineligible':
      return buildAuthNotice(
        'Requirements Unmet',
        'Finish the listed Legacy requirement before purchasing.'
      );
    case 'insufficient_legacy':
      return buildAuthNotice(
        'Not Enough Prestige',
        'Earn more Prestige before purchasing this Legacy unlock.'
      );
    case 'invalid_cost':
      return buildAuthNotice(
        'Purchase Unavailable',
        'That Legacy unlock has an invalid cost definition.'
      );
  }

  return buildAuthNotice(
    'Purchase Unavailable',
    'That Legacy unlock cannot be purchased right now.'
  );
}

function buildLegacyPreparationFailureNotice(
  error: LegacyPreparationSelectionFailureReason
): GameShellNotice {
  switch (error) {
    case 'unknown_unlock':
      return buildAuthNotice(
        'Preparation Not Found',
        'That Legacy preparation is not available in this catalog.'
      );
    case 'not_preparation':
      return buildAuthNotice(
        'Preparation Unavailable',
        'That Legacy unlock cannot be prepared for the next heir.'
      );
    case 'not_owned':
      return buildAuthNotice(
        'Preparation Locked',
        'Purchase that preparation before selecting it for the next heir.'
      );
    case 'choice_required':
      return buildAuthNotice(
        'Choice Required',
        'That preparation needs a choice selector before it can be prepared.'
      );
    case 'invalid_choice':
      return buildAuthNotice(
        'Choice Unavailable',
        'That Legacy preparation choice is not available.'
      );
    case 'selection_unavailable':
      return buildAuthNotice(
        'Selection Unavailable',
        'That preparation cannot be finalized from this panel yet.'
      );
    case 'duplicate_selection':
      return buildAuthNotice(
        'Already Selected',
        'That preparation is already set aside for the next heir.'
      );
    case 'capacity_full':
      return buildAuthNotice(
        'Preparation Capacity Full',
        'Remove a selected preparation or increase Prepared Lineage first.'
      );
  }

  return buildAuthNotice(
    'Preparation Unavailable',
    'That preparation cannot be selected right now.'
  );
}

function listSignedInSlotsWithFallback(
  launcherSession: LauncherRuntimeSession,
  action: string,
  fallbackAccountProfile: ReturnType<typeof createDefaultAccountProfileState>
): {
  accountProfile: ReturnType<typeof createDefaultAccountProfileState>;
  slots: ReturnType<typeof createEmptySaveSlotSummaries>;
  notice: GameShellNotice | null;
} {
  try {
    const accountProfile = loadAccountProfile(launcherSession.accountId);
    return {
      accountProfile,
      slots: listSaves(accountProfile.accountId),
      notice: null
    };
  } catch (error) {
    return {
      accountProfile: fallbackAccountProfile,
      slots: createEmptySaveSlotSummaries(),
      notice: buildStorageNotice(action, error)
    };
  }
}

function createAppState(_: undefined): GameShellState {
  try {
    const bootstrap = bootstrapLauncherAuth();

    if (bootstrap.mode === 'signed_in') {
      return createInitialGameShellState(
        bootstrap.session,
        bootstrap.accountProfile,
        listSaves(bootstrap.accountProfile.accountId),
        bootstrap.notice
          ? buildAuthNotice('Local Sign-In Reset', bootstrap.notice)
          : null
      );
    }

    return createAccountAccessState(
      bootstrap.mode,
      bootstrap.accounts,
      bootstrap.notice ? buildAuthNotice('Local Sign-In Reset', bootstrap.notice) : null
    );
  } catch (error) {
    return createAccountAccessState(
      'create_first_account',
      [],
      buildStorageNotice('read launcher account data', error)
    );
  }
}

function evaluateSnapshotWithAccount(
  accountProfile: ReturnType<typeof createDefaultAccountProfileState>,
  snapshot: ReturnType<typeof createNewGameSnapshot>,
  options: {
    slotId?: SaveSlotId;
    touchHistory?: boolean;
    recordedAt?: string;
    suppressLegacyRewards?: boolean;
    persistProfile?: boolean;
  } = {}
): {
  accountProfile: ReturnType<typeof createDefaultAccountProfileState>;
  snapshot: ReturnType<typeof createNewGameSnapshot>;
} {
  const evaluated = evaluateAchievementProgress(snapshot, accountProfile, options);

  if (!evaluated.changed) {
    return {
      accountProfile,
      snapshot: evaluated.nextSnapshot
    };
  }

  if (options.persistProfile === false) {
    return {
      accountProfile: evaluated.nextAccountProfile,
      snapshot: evaluated.nextSnapshot
    };
  }

  return {
    accountProfile: saveAccountProfile(evaluated.nextAccountProfile),
    snapshot: evaluated.nextSnapshot
  };
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

function buildArchivedRunNotice(
  snapshot: ReturnType<typeof createNewGameSnapshot>,
  archiveReason: 'retired' | 'dead' | 'hardcore_dead',
  legacyGranted: number
): GameShellNotice {
  const playerName = snapshot.playerState.coreData.playerName;
  const rewardText =
    legacyGranted > 0 ? ` Legacy granted: ${legacyGranted}.` : '';

  if (archiveReason === 'retired') {
    return {
      tone: 'success',
      title: 'Character Retired',
      detail: `${playerName} was entered into the Chronicle as a retired life. All active save slots for this run were freed.${rewardText}`
    };
  }

  return {
    tone: 'warning',
    title: archiveReason === 'hardcore_dead' ? 'Hardcore Death Recorded' : 'Character Death Recorded',
    detail: `${playerName}'s run was archived after death and its active save slots were freed.${rewardText}`
  };
}

function buildBlockedRunNotice(
  slotId: SaveSlotId,
  outcome: 'archived' | 'deleted'
): GameShellNotice {
  return {
    tone: 'warning',
    title: outcome === 'archived' ? 'Archived Run Cleared' : 'Deleted Run Cleared',
    detail:
      outcome === 'archived'
        ? `${getSaveSlotLabel(slotId)} belonged to a run already archived in the Chronicle and was removed from playable saves.`
        : `${getSaveSlotLabel(slotId)} belonged to a run already removed from the active ledger and was cleared from playable saves.`
  };
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
  const [themePreference, setThemePreference] = useState<ThemePreference>(readInitialThemePreference);
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(resolveSystemTheme);
  const [timeSettings, setTimeSettings] = useState<LauncherTimeSettings>(readInitialTimeSettings);
  const [clockNow, setClockNow] = useState(() => new Date());
  const [launcherSection, setLauncherSection] = useState<LauncherSectionId>('characters');
  const themeMode: ThemeMode =
    themePreference === 'system' ? systemTheme : themePreference;
  const clockLabel = formatLauncherClock(clockNow, timeSettings);
  const clockTitle = formatLauncherClockTitle(clockNow, timeSettings);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
      } catch {
        // Theme persistence is optional when browser storage is blocked.
      }
    }
  }, [themeMode, themePreference]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const syncSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? 'light' : 'dark');
    };

    syncSystemTheme();
    mediaQuery.addEventListener('change', syncSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', syncSystemTheme);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(TIME_SETTINGS_STORAGE_KEY, JSON.stringify(timeSettings));
    } catch {
      // Time preference persistence is optional when browser storage is blocked.
    }
  }, [timeSettings]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const intervalId = window.setInterval(() => {
      setClockNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

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
    setThemePreference((currentTheme) => {
      const resolvedTheme = currentTheme === 'system' ? resolveSystemTheme() : currentTheme;
      return resolvedTheme === 'dark' ? 'light' : 'dark';
    });
  };

  const updateTimeZone = (timeZone: string) => {
    setTimeSettings((current) => ({
      ...current,
      timeZone
    }));
  };

  const updateHourFormat = (hourFormat: HourFormatPreference) => {
    setTimeSettings((current) => ({
      ...current,
      hourFormat
    }));
  };

  const dismissNotice = () => {
    dispatch({ type: 'SET_NOTICE', notice: null });
  };

  const showAccountAccess = (notice: GameShellNotice | null = null) => {
    try {
      const bootstrap = bootstrapLauncherAuth();
      const bootstrapNotice =
        bootstrap.notice
          ? buildAuthNotice('Local Sign-In Reset', bootstrap.notice)
          : null;

      if (bootstrap.mode === 'signed_in') {
        const next = listSignedInSlotsWithFallback(
          bootstrap.session,
          'read launcher account data',
          bootstrap.accountProfile
        );
        dispatch({
          type: 'SHOW_MAIN_MENU',
          launcherSession: bootstrap.session,
          accountProfile: next.notice ? bootstrap.accountProfile : next.accountProfile,
          slots: next.slots,
          notice: next.notice ?? notice ?? bootstrapNotice
        });
        return;
      }

      dispatch({
        type: 'SHOW_ACCOUNT_ACCESS',
        accessMode: bootstrap.mode,
        accounts: bootstrap.accounts,
        notice: notice ?? bootstrapNotice
      });
    } catch (error) {
      dispatch({
        type: 'SHOW_ACCOUNT_ACCESS',
        accessMode: 'create_first_account',
        accounts: [],
        notice: buildStorageNotice('read launcher account data', error)
      });
    }
  };

  const showSignedInMainMenu = (
    launcherSession: LauncherRuntimeSession,
    fallbackAccountProfile: ReturnType<typeof createDefaultAccountProfileState>,
    notice: GameShellNotice | null = null,
    targetLauncherSection?: LauncherSectionId
  ) => {
    if (targetLauncherSection) {
      setLauncherSection(targetLauncherSection);
    }

    const next = listSignedInSlotsWithFallback(
      launcherSession,
      'read launcher account data',
      fallbackAccountProfile
    );
    dispatch({
      type: 'SHOW_MAIN_MENU',
      launcherSession,
      accountProfile: next.notice ? fallbackAccountProfile : next.accountProfile,
      slots: next.slots,
      notice: next.notice ?? notice
    });
  };

  const enterGame = (
    launcherSession: LauncherRuntimeSession,
    accountProfile: ReturnType<typeof createDefaultAccountProfileState>,
    slotId: SaveSlotId,
    snapshot: ReturnType<typeof createNewGameSnapshot>,
    notice: GameShellNotice | null
  ) => {
    const next = listSignedInSlotsWithFallback(
      launcherSession,
      'read launcher account data',
      accountProfile
    );
    dispatch({
      type: 'ENTER_GAME',
      launcherSession,
      accountProfile: next.notice ? accountProfile : next.accountProfile,
      slots: next.slots,
      slotId,
      snapshot,
      notice: next.notice ?? notice
    });
  };

  const openCharacterCreation = (
    launcherSession: LauncherRuntimeSession,
    accountProfile: ReturnType<typeof createDefaultAccountProfileState>,
    targetSlotId?: ManualSaveSlotId
  ) => {
    const next = listSignedInSlotsWithFallback(
      launcherSession,
      'read launcher account data',
      accountProfile
    );
    dispatch({
      type: 'OPEN_CHARACTER_CREATION',
      launcherSession,
      accountProfile: next.notice ? accountProfile : next.accountProfile,
      slots: next.slots,
      form: createDefaultCharacterCreationFormState(
        targetSlotId ?? getPreferredSaveSlotId(next.slots)
      ),
      notice: next.notice
    });
  };

  const openLoadGame = (
    launcherSession: LauncherRuntimeSession,
    accountProfile: ReturnType<typeof createDefaultAccountProfileState>
  ) => {
    const next = listSignedInSlotsWithFallback(
      launcherSession,
      'read launcher account data',
      accountProfile
    );
    dispatch({
      type: 'OPEN_LOAD_GAME',
      launcherSession,
      accountProfile: next.notice ? accountProfile : next.accountProfile,
      slots: next.slots,
      selectedSlotId: getPreferredLoadSlotId(next.slots),
      notice: next.notice
    });
  };

  const openSettings = (
    launcherSession: LauncherRuntimeSession,
    accountProfile: ReturnType<typeof createDefaultAccountProfileState>
  ) => {
    const next = listSignedInSlotsWithFallback(
      launcherSession,
      'read launcher account data',
      accountProfile
    );
    dispatch({
      type: 'OPEN_SETTINGS',
      launcherSession,
      accountProfile: next.notice ? accountProfile : next.accountProfile,
      slots: next.slots,
      notice: next.notice
    });
  };

  const finalizeAuthResult = (
    result: LauncherAuthResult,
    successNotice: GameShellNotice,
    failureTitle: string
  ): LauncherAuthResult => {
    if (!result.ok) {
      if (result.message === MALFORMED_AUTH_NOTICE) {
        showAccountAccess(buildAuthNotice('Local Sign-In Reset', result.message));
      } else {
        dispatch({
          type: 'SET_NOTICE',
          notice: buildAuthNotice(failureTitle, result.message)
        });
      }

      return result;
    }

    showSignedInMainMenu(result.session, result.accountProfile, successNotice);
    return result;
  };

  const handleSignIn = async (options: {
    accountId: string;
    password: string;
    stayLoggedIn: boolean;
  }): Promise<LauncherAuthResult> => {
    try {
      const result = await signInLocalAccount(options);
      return finalizeAuthResult(result, {
        tone: 'success',
        title: 'Signed In',
        detail: `${result.ok ? result.accountProfile.displayName : 'This account'} is now signed in on this device.`
      }, 'Could Not Sign In');
    } catch (error) {
      const notice = buildStorageNotice('sign in to a local account', error);
      dispatch({ type: 'SET_NOTICE', notice });
      return {
        ok: false,
        message: notice.detail
      };
    }
  };

  const handleDeleteAccount = async (options: {
    accountId: string;
    password: string;
  }): Promise<LauncherAccountDeletionResult> => {
    try {
      const result = await deleteLocalAccount(options);

      if (!result.ok) {
        if (result.message === MALFORMED_AUTH_NOTICE) {
          showAccountAccess(buildAuthNotice('Sign-In Reset', result.message));
        } else {
          dispatch({
            type: 'SET_NOTICE',
            notice: buildAuthNotice('Could Not Delete Account', result.message)
          });
        }

        return result;
      }

      showAccountAccess({
        tone: 'success',
        title: 'Account Deleted',
        detail: `${result.displayName} was removed from this device.`
      });

      return result;
    } catch (error) {
      const notice = buildStorageNotice('delete a local account', error);
      dispatch({ type: 'SET_NOTICE', notice });
      return {
        ok: false,
        message: notice.detail
      };
    }
  };

  const handleCreateAccount = async (options: {
    displayName: string;
    password: string;
    confirmPassword: string;
    stayLoggedIn: boolean;
  }): Promise<LauncherAuthResult> => {
    try {
      const result = await createLocalAccount(options);
      return finalizeAuthResult(result, {
        tone: 'success',
        title: 'Account Created',
        detail: `${result.ok ? result.accountProfile.displayName : 'The new account'} is ready.`
      }, 'Could Not Create Account');
    } catch (error) {
      const notice = buildStorageNotice('create a local account', error);
      dispatch({ type: 'SET_NOTICE', notice });
      return {
        ok: false,
        message: notice.detail
      };
    }
  };

  const handleLogout = () => {
    if (state.screen === 'ACCOUNT_ACCESS') {
      return;
    }

    try {
      signOutLauncherSession();
      showAccountAccess({
        tone: 'success',
        title: 'Signed Out',
        detail: `${state.accountProfile.displayName} was signed out on this device.`
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('sign out of the current account', error)
      });
    }
  };

  const resolveRunEntry = (
    accountProfile: ReturnType<typeof createDefaultAccountProfileState>,
    slotId: SaveSlotId,
    snapshot: ReturnType<typeof createNewGameSnapshot>
  ):
    | {
        kind: 'enter';
        accountProfile: ReturnType<typeof createDefaultAccountProfileState>;
        snapshot: ReturnType<typeof createNewGameSnapshot>;
      }
    | {
        kind: 'blocked';
        accountProfile: ReturnType<typeof createDefaultAccountProfileState>;
        slots: ReturnType<typeof createEmptySaveSlotSummaries>;
        notice: GameShellNotice;
      } => {
    const blocked = purgeBlockedRunSlot({
      accountId: accountProfile.accountId,
      accountProfile,
      characterId: snapshot.playerState.playerId,
      slotId
    });

    if (blocked) {
      return {
        kind: 'blocked',
        accountProfile: blocked.accountProfile,
        slots: blocked.slots,
        notice: buildBlockedRunNotice(slotId, blocked.outcome)
      };
    }

    const prepared = evaluateSnapshotWithAccount(accountProfile, snapshot, {
      slotId,
      touchHistory: true
    });
    const deathReason = resolveTerminalArchiveReason(prepared.snapshot);

    if (deathReason) {
      const archived = archiveActiveRun({
        accountId: prepared.accountProfile.accountId,
        accountProfile: prepared.accountProfile,
        snapshot: prepared.snapshot,
        archiveReason: deathReason,
        fallbackSlotId: slotId
      });

      return {
        kind: 'blocked',
        accountProfile: archived.accountProfile,
        slots: archived.slots,
        notice: buildArchivedRunNotice(
          archived.snapshot,
          deathReason,
          archived.legacyGranted
        )
      };
    }

    return {
      kind: 'enter',
      accountProfile: prepared.accountProfile,
      snapshot: prepared.snapshot
    };
  };

  const continueLatestGame = () => {
    if (state.screen !== 'MAIN_MENU' && state.screen !== 'SETTINGS') {
      return;
    }

    const next = listSignedInSlotsWithFallback(
      state.launcherSession,
      'read launcher account data',
      state.accountProfile
    );
    const slotId = getPreferredLoadSlotId(next.slots);

    if (!slotId) {
      openCharacterCreation(
        state.launcherSession,
        next.notice ? state.accountProfile : next.accountProfile
      );
      return;
    }

    try {
      const snapshot = loadSave(next.accountProfile.accountId, slotId);

      if (!snapshot) {
        dispatch({
          type: 'SHOW_MAIN_MENU',
          launcherSession: state.launcherSession,
          accountProfile: next.notice ? state.accountProfile : next.accountProfile,
          slots: next.slots,
          notice: next.notice ?? {
            tone: 'warning',
            title: 'Latest Save Unavailable',
            detail: 'The most recent save could not be loaded. Use Load Game to inspect the available slots.'
          }
        });
        return;
      }

      const resolved = resolveRunEntry(next.accountProfile, slotId, snapshot);

      if (resolved.kind === 'blocked') {
        dispatch({
          type: 'SHOW_MAIN_MENU',
          launcherSession: state.launcherSession,
          accountProfile: resolved.accountProfile,
          slots: resolved.slots,
          notice: resolved.notice
        });
        return;
      }

      enterGame(
        state.launcherSession,
        resolved.accountProfile,
        slotId,
        resolved.snapshot,
        {
        tone: 'accent',
        title: 'Continuing Campaign',
        detail: `Continuing ${resolved.snapshot.playerState.coreData.playerName} from ${getSaveSlotLabel(slotId)}.`
        }
      );
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
      const preparationSelection = resolveLegacyPreparationSelection(state.accountProfile);
      const selectedSourceRunId = state.form.sourceRunId.trim();
      const selectedHeirSource = selectedSourceRunId
        ? resolveHeirSourceById(state.accountProfile, selectedSourceRunId)
        : null;

      if (selectedSourceRunId && !selectedHeirSource) {
        dispatch({
          type: 'SET_NOTICE',
          notice: {
            tone: 'warning',
            title: 'Lineage Source Unavailable',
            detail: 'Choose Fresh Start or select another available source line before beginning the campaign.'
          }
        });
        return;
      }

      const snapshot = createNewGameSnapshot({
        ...state.form,
        playerName
      }, state.accountProfile.accountId, {
        appliedLegacyPreparationIds: preparationSelection.selectedUnlockIds,
        appliedLegacyPreparationChoices: preparationSelection.selectedChoicePayloads,
        accountProfile: state.accountProfile,
        ...(selectedHeirSource ? { sourceRunId: selectedSourceRunId } : {}),
        ...(selectedHeirSource && selectedHeirSource.lineageId !== state.form.lineageId
          ? { crossLineageStart: true }
          : {})
      });
      const prepared = evaluateSnapshotWithAccount(state.accountProfile, snapshot, {
        slotId: state.form.saveSlotId,
        touchHistory: true,
        suppressLegacyRewards: true,
        persistProfile: false
      });

      const savedSlot = createSave(
        state.accountProfile.accountId,
        state.form.saveSlotId,
        prepared.snapshot,
        buildSaveMetadata(state.form.saveSlotId, prepared.snapshot)
      );
      const accountProfileAfterSave = savedSlot.lastSavedAt
        ? {
            ...prepared.accountProfile,
            lastPlayedAt: savedSlot.lastSavedAt
          }
        : prepared.accountProfile;
      const consumed = consumeSelectedLegacyPreparations(accountProfileAfterSave);
      const heirSourceConsumed = selectedHeirSource
        ? consumeRetiredRunInheritanceUse(consumed.profile, {
            characterId: selectedHeirSource.characterId
          })
        : null;
      const savedProfile = saveAccountProfile(
        heirSourceConsumed?.accountProfile ?? consumed.profile
      );

      enterGame(state.launcherSession, savedProfile, state.form.saveSlotId, prepared.snapshot, {
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
      const snapshot = loadSave(state.accountProfile.accountId, state.selectedSlotId);

      if (!snapshot) {
        const next = listSignedInSlotsWithFallback(
          state.launcherSession,
          'read launcher account data',
          state.accountProfile
        );
        dispatch({
          type: 'OPEN_LOAD_GAME',
          launcherSession: state.launcherSession,
          accountProfile: next.notice ? state.accountProfile : next.accountProfile,
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

      const resolved = resolveRunEntry(
        state.accountProfile,
        state.selectedSlotId,
        snapshot
      );

      if (resolved.kind === 'blocked') {
        dispatch({
          type: 'OPEN_LOAD_GAME',
          launcherSession: state.launcherSession,
          accountProfile: resolved.accountProfile,
          slots: resolved.slots,
          selectedSlotId: getPreferredLoadSlotId(resolved.slots),
          notice: resolved.notice
        });
        return;
      }

      enterGame(state.launcherSession, resolved.accountProfile, state.selectedSlotId, resolved.snapshot, {
        tone: 'accent',
        title: 'Save Loaded',
        detail: `Continuing ${resolved.snapshot.playerState.coreData.playerName} from ${getSaveSlotLabel(state.selectedSlotId)}.`
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
      const snapshot = loadSave(state.accountProfile.accountId, slotId);
      deleteSave(state.accountProfile.accountId, slotId);
      if (snapshot) {
        saveAccountProfile(
          markRunDeleted(state.accountProfile, {
            characterId: snapshot.playerState.playerId,
            slotId,
            recordedAt: new Date().toISOString()
          })
        );
      }
      const next = listSignedInSlotsWithFallback(
        state.launcherSession,
        'read launcher account data',
        state.accountProfile
      );

      if (state.screen === 'LOAD_GAME') {
        dispatch({
          type: 'OPEN_LOAD_GAME',
          launcherSession: state.launcherSession,
          accountProfile: next.notice ? state.accountProfile : next.accountProfile,
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
          launcherSession: state.launcherSession,
          accountProfile: next.notice ? state.accountProfile : next.accountProfile,
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
    if (state.screen !== 'MAIN_MENU') {
      return;
    }

    const next = listSignedInSlotsWithFallback(
      state.launcherSession,
      'read launcher account data',
      state.accountProfile
    );
    const selectedSlot = next.slots.find((slot) => slot.id === slotId);

    if (!selectedSlot?.hasSave) {
      openCharacterCreation(state.launcherSession, next.notice ? state.accountProfile : next.accountProfile, slotId);
      return;
    }

    try {
      const snapshot = loadSave(next.accountProfile.accountId, slotId);

      if (!snapshot) {
        dispatch({
          type: 'SHOW_MAIN_MENU',
          launcherSession: state.launcherSession,
          accountProfile: next.notice ? state.accountProfile : next.accountProfile,
          slots: next.slots,
          notice: next.notice ?? {
            tone: 'warning',
            title: 'Save Not Available',
            detail: `${getSaveSlotLabel(slotId)} could not be loaded from local browser storage.`
          }
        });
        return;
      }

      const resolved = resolveRunEntry(next.accountProfile, slotId, snapshot);

      if (resolved.kind === 'blocked') {
        dispatch({
          type: 'SHOW_MAIN_MENU',
          launcherSession: state.launcherSession,
          accountProfile: resolved.accountProfile,
          slots: resolved.slots,
          notice: resolved.notice
        });
        return;
      }

      enterGame(state.launcherSession, resolved.accountProfile, slotId, resolved.snapshot, {
        tone: 'accent',
        title: 'Save Loaded',
        detail: `Continuing ${resolved.snapshot.playerState.coreData.playerName} from ${getSaveSlotLabel(slotId)}.`
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('load a local save', error)
      });
    }
  };

  const handleResetAccount = async (options: {
    accountId: string;
    password: string;
  }): Promise<LauncherAccountResetResult> => {
    if (state.screen !== 'SETTINGS') {
      return {
        ok: false,
        message: 'Account reset is only available from Settings.'
      };
    }

    try {
      const result = await resetLocalAccount(options);

      if (!result.ok) {
        if (result.message === MALFORMED_AUTH_NOTICE) {
          showAccountAccess(buildAuthNotice('Sign-In Reset', result.message));
        } else {
          dispatch({
            type: 'SET_NOTICE',
            notice: buildAuthNotice('Could Not Reset Account', result.message)
          });
        }

        return result;
      }

      dispatch({
        type: 'OPEN_SETTINGS',
        launcherSession: state.launcherSession,
        accountProfile: result.accountProfile,
        slots: listSaves(result.accountProfile.accountId),
        notice: {
          tone: 'success',
          title: 'Account Reset',
          detail: 'Character data, Prestige, achievements, and local saves were reset for this account.'
        }
      });

      return result;
    } catch (error) {
      const notice = buildStorageNotice('reset the local account', error);
      dispatch({ type: 'SET_NOTICE', notice });
      return {
        ok: false,
        message: notice.detail
      };
    }
  };

  const handleSaveGame = () => {
    if (state.screen !== 'IN_GAME') {
      return;
    }

    try {
      const prepared = evaluateSnapshotWithAccount(state.accountProfile, state.snapshot, {
        slotId: state.activeSlotId,
        touchHistory: true
      });
      const savedSlot = createSave(
        prepared.accountProfile.accountId,
        state.activeSlotId,
        prepared.snapshot,
        buildSaveMetadata(state.activeSlotId, prepared.snapshot)
      );

      const next = listSignedInSlotsWithFallback(
        state.launcherSession,
        'read launcher account data',
        prepared.accountProfile
      );
      dispatch({
        type: 'COMPLETE_IN_GAME_SAVE',
        launcherSession: state.launcherSession,
        accountProfile: next.notice ? prepared.accountProfile : next.accountProfile,
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
      const prepared = evaluateSnapshotWithAccount(state.accountProfile, state.snapshot, {
        slotId: 'quick-save',
        touchHistory: true
      });
      const savedSlot = quickSave(prepared.accountProfile.accountId, prepared.snapshot);

      const next = listSignedInSlotsWithFallback(
        state.launcherSession,
        'read launcher account data',
        prepared.accountProfile
      );
      dispatch({
        type: 'COMPLETE_IN_GAME_SAVE',
        launcherSession: state.launcherSession,
        accountProfile: next.notice ? prepared.accountProfile : next.accountProfile,
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

  const handleRetireCharacter = () => {
    if (state.screen !== 'IN_GAME') {
      return;
    }

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        `Retire ${state.snapshot.playerState.coreData.playerName}? This will archive the run, free all active save slots for this character, and return to the main menu.`
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      const archived = archiveActiveRun({
        accountId: state.accountProfile.accountId,
        accountProfile: state.accountProfile,
        snapshot: state.snapshot,
        archiveReason: 'retired',
        fallbackSlotId: state.activeSlotId
      });

      dispatch({
        type: 'SHOW_MAIN_MENU',
        launcherSession: state.launcherSession,
        accountProfile: archived.accountProfile,
        slots: archived.slots,
        notice: buildArchivedRunNotice(
          archived.snapshot,
          'retired',
          archived.legacyGranted
        )
      });
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('retire the current character', error)
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

    const next = listSignedInSlotsWithFallback(
      state.launcherSession,
      'read launcher account data',
      state.accountProfile
    );
    const activeSlot = next.slots.find((slot) => slot.id === state.activeSlotId) ?? null;

    dispatch({
      type: 'SHOW_MAIN_MENU',
      launcherSession: state.launcherSession,
      accountProfile: next.notice ? state.accountProfile : next.accountProfile,
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

  const handlePurchaseLegacyUnlock = (unlockId: string) => {
    if (state.screen !== 'MAIN_MENU') {
      return;
    }

    const purchased = purchaseLegacyUnlock(state.accountProfile, unlockId);

    if (!purchased.ok) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildLegacyPurchaseFailureNotice(purchased.error)
      });
      return;
    }

    let savedProfile: ReturnType<typeof saveAccountProfile>;

    try {
      savedProfile = saveAccountProfile(purchased.profile);
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('purchase a Legacy unlock', error)
      });
      return;
    }

    let slots = state.slots;
    let refreshNotice: GameShellNotice | null = null;

    try {
      slots = listSaves(savedProfile.accountId);
    } catch (error) {
      refreshNotice = buildStorageNotice('refresh launcher saves', error);
    }

    setLauncherSection('legacy');
    dispatch({
      type: 'SHOW_MAIN_MENU',
      launcherSession: state.launcherSession,
      accountProfile: savedProfile,
      slots,
      notice: refreshNotice ?? {
        tone: 'success',
        title: 'Legacy Purchased',
        detail: purchased.transaction.summary
      }
    });
  };

  const handleSelectLegacyPreparation = (unlockId: string) => {
    if (state.screen !== 'MAIN_MENU') {
      return;
    }

    const selected = selectLegacyPreparation(state.accountProfile, unlockId);

    if (!selected.ok) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildLegacyPreparationFailureNotice(selected.error)
      });
      return;
    }

    let savedProfile: ReturnType<typeof saveAccountProfile>;

    try {
      savedProfile = saveAccountProfile(selected.profile);
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('select a Legacy preparation', error)
      });
      return;
    }

    let slots = state.slots;
    let refreshNotice: GameShellNotice | null = null;

    try {
      slots = listSaves(savedProfile.accountId);
    } catch (error) {
      refreshNotice = buildStorageNotice('refresh launcher saves', error);
    }

    setLauncherSection('legacy');
    dispatch({
      type: 'SHOW_MAIN_MENU',
      launcherSession: state.launcherSession,
      accountProfile: savedProfile,
      slots,
      notice: refreshNotice ?? {
        tone: 'success',
        title: 'Preparation Selected',
        detail: 'That preparation is set aside for the next heir.'
      }
    });
  };

  const handleSetLegacyPreparationChoice = (unlockId: string, choiceId: string) => {
    if (state.screen !== 'MAIN_MENU') {
      return;
    }

    const priorSelection = resolveLegacyPreparationSelection(state.accountProfile);
    const priorChoiceId = priorSelection.selectedChoicePayloads[unlockId] ?? null;
    const selected = setLegacyPreparationChoice(state.accountProfile, unlockId, choiceId);

    if (!selected.ok) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildLegacyPreparationFailureNotice(selected.error)
      });
      return;
    }

    let savedProfile: ReturnType<typeof saveAccountProfile>;

    try {
      savedProfile = saveAccountProfile(selected.profile);
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('select a Legacy preparation choice', error)
      });
      return;
    }

    let slots = state.slots;
    let refreshNotice: GameShellNotice | null = null;

    try {
      slots = listSaves(savedProfile.accountId);
    } catch (error) {
      refreshNotice = buildStorageNotice('refresh launcher saves', error);
    }

    const choiceLabel =
      getLegacyPreparationChoiceLabel(unlockId, choiceId) ?? choiceId;
    const updatedExistingChoice = priorChoiceId !== null && priorChoiceId !== choiceId;

    setLauncherSection('legacy');
    dispatch({
      type: 'SHOW_MAIN_MENU',
      launcherSession: state.launcherSession,
      accountProfile: savedProfile,
      slots,
      notice: refreshNotice ?? {
        tone: 'success',
        title: updatedExistingChoice ? 'Preparation Updated' : 'Preparation Selected',
        detail: `That preparation now favors ${choiceLabel} for the next heir.`
      }
    });
  };

  const handleRemoveLegacyPreparation = (unlockId: string) => {
    if (state.screen !== 'MAIN_MENU') {
      return;
    }

    const removed = removeLegacyPreparation(state.accountProfile, unlockId);
    let savedProfile: ReturnType<typeof saveAccountProfile>;

    try {
      savedProfile = saveAccountProfile(removed.profile);
    } catch (error) {
      dispatch({
        type: 'SET_NOTICE',
        notice: buildStorageNotice('remove a Legacy preparation', error)
      });
      return;
    }

    let slots = state.slots;
    let refreshNotice: GameShellNotice | null = null;

    try {
      slots = listSaves(savedProfile.accountId);
    } catch (error) {
      refreshNotice = buildStorageNotice('refresh launcher saves', error);
    }

    setLauncherSection('legacy');
    dispatch({
      type: 'SHOW_MAIN_MENU',
      launcherSession: state.launcherSession,
      accountProfile: savedProfile,
      slots,
      notice: refreshNotice ?? {
        tone: 'accent',
        title: 'Preparation Removed',
        detail: 'That preparation is no longer set aside for the next heir.'
      }
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

  if (state.screen === 'ACCOUNT_ACCESS') {
    content = (
      <LocalAccountAccessScreen
        mode={state.accessMode}
        accounts={state.accounts}
        notice={state.notice}
        onDismissNotice={dismissNotice}
        onSignIn={handleSignIn}
        onDeleteAccount={handleDeleteAccount}
        onCreateAccount={handleCreateAccount}
        themeMode={themeMode}
        onToggleThemeMode={toggleThemeMode}
      />
    );
  } else if (state.screen === 'MAIN_MENU') {
    content = (
      <MainMenuScreen
        accountProfile={state.accountProfile}
        slots={state.slots}
        notice={state.notice}
        onDismissNotice={dismissNotice}
        onActivateSlot={handleGameDataSlot}
        onDeleteSlot={handleDeleteSave}
        onContinue={continueLatestGame}
        onOpenSettings={() => openSettings(state.launcherSession, state.accountProfile)}
        activeSection={launcherSection}
        onActiveSectionChange={setLauncherSection}
        onPurchaseLegacyUnlock={handlePurchaseLegacyUnlock}
        onSelectLegacyPreparation={handleSelectLegacyPreparation}
        onSetLegacyPreparationChoice={handleSetLegacyPreparationChoice}
        onRemoveLegacyPreparation={handleRemoveLegacyPreparation}
        onLogout={handleLogout}
        onExit={handleExit}
        clockLabel={clockLabel}
        clockTitle={clockTitle}
      />
    );
  } else if (state.screen === 'CHARACTER_CREATION') {
    content = (
      <CharacterCreationScreen
        form={state.form}
        accountProfile={state.accountProfile}
        appliedLegacyPreparationIds={
          resolveLegacyPreparationSelection(state.accountProfile).selectedUnlockIds
        }
        appliedLegacyPreparationChoices={
          resolveLegacyPreparationSelection(state.accountProfile).selectedChoicePayloads
        }
        eligibleHeirSources={resolveEligibleHeirSources(state.accountProfile)}
        slots={state.slots}
        notice={state.notice}
        pendingOverwriteSlotId={state.pendingOverwriteSlotId}
        onDismissNotice={dismissNotice}
        onReturnToMainMenu={() => showSignedInMainMenu(state.launcherSession, state.accountProfile)}
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
        onBack={() => showSignedInMainMenu(state.launcherSession, state.accountProfile)}
        onSelectSlot={(slotId) => dispatch({ type: 'SELECT_LOAD_SLOT', slotId })}
        onLoadSelected={loadSelectedGame}
        onDeleteSlot={handleDeleteSave}
      />
    );
  } else if (state.screen === 'SETTINGS') {
    content = (
      <SettingsScreen
        accountProfile={state.accountProfile}
        slots={state.slots}
        notice={state.notice}
        onDismissNotice={dismissNotice}
        onOpenLauncherSection={(section) =>
          showSignedInMainMenu(state.launcherSession, state.accountProfile, null, section)
        }
        onResetAccount={handleResetAccount}
        onDeleteAccount={handleDeleteAccount}
        onContinue={continueLatestGame}
        onExit={handleExit}
        onLogout={handleLogout}
        themeMode={themeMode}
        themePreference={themePreference}
        onThemePreferenceChange={setThemePreference}
        timeZone={timeSettings.timeZone}
        onTimeZoneChange={updateTimeZone}
        hourFormat={timeSettings.hourFormat}
        onHourFormatChange={updateHourFormat}
        clockLabel={clockLabel}
        clockTitle={clockTitle}
        clockNow={clockNow}
      />
    );
  } else {
    content = (
      <InGameShell
        accountProfile={state.accountProfile}
        snapshot={state.snapshot}
        slots={state.slots}
        activeSlotId={state.activeSlotId}
        hasUnsavedChanges={state.hasUnsavedChanges}
        notice={state.notice}
        onDismissNotice={dismissNotice}
        onSnapshotChange={(snapshot) => {
          try {
            const prepared = evaluateSnapshotWithAccount(state.accountProfile, snapshot);
            const deathReason = resolveTerminalArchiveReason(prepared.snapshot);

            if (deathReason) {
              const archived = archiveActiveRun({
                accountId: prepared.accountProfile.accountId,
                accountProfile: prepared.accountProfile,
                snapshot: prepared.snapshot,
                archiveReason: deathReason,
                fallbackSlotId: state.activeSlotId
              });

              dispatch({
                type: 'SHOW_MAIN_MENU',
                launcherSession: state.launcherSession,
                accountProfile: archived.accountProfile,
                slots: archived.slots,
                notice: buildArchivedRunNotice(
                  archived.snapshot,
                  deathReason,
                  archived.legacyGranted
                )
              });
              return;
            }

            dispatch({
              type: 'UPDATE_IN_GAME_SNAPSHOT',
              launcherSession: state.launcherSession,
              accountProfile: prepared.accountProfile,
              slots: state.slots,
              snapshot: prepared.snapshot
            });
          } catch (error) {
            dispatch({
              type: 'SET_NOTICE',
              notice: buildStorageNotice('update the current run', error)
            });
          }
        }}
        onSave={handleSaveGame}
        onQuickSave={handleQuickSaveGame}
        onRetireCharacter={handleRetireCharacter}
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
