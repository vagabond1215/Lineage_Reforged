import type {
  AccountProfileState,
  SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';
import type {
  CampaignSessionControl
} from '../../../../packages/engines/game-engine/src/campaign-session.js';
import type { TagTone } from '../types.js';
import type { CharacterCreationFormState } from './characterCreationForm.js';
import type {
  LauncherRuntimeSession,
  LocalAccountPickerEntry
} from './launcherAuthManager.js';

export type AppScreen =
  | 'ACCOUNT_ACCESS'
  | 'MAIN_MENU'
  | 'CHARACTER_CREATION'
  | 'LOAD_GAME'
  | 'SETTINGS'
  | 'IN_GAME';
type ManualSaveSlotNumber = number;

export type ManualSaveSlotId = `slot-${ManualSaveSlotNumber}`;
export type QuickSaveSlotId = 'quick-save';
export type SaveSlotId = ManualSaveSlotId | QuickSaveSlotId;
export type SaveSlotKind = 'manual' | 'quick';
export type SaveSlotStatus = 'empty' | 'ready' | 'corrupt' | 'incompatible';

export interface SaveSlotMetadata {
  slotId: SaveSlotId;
  characterName: string;
  level: number;
  lineageLabel: string | null;
  sexLabel: string | null;
  classLabel: string | null;
  backstoryLabel: string | null;
  startingBundleLabel: string | null;
  regionLabel: string;
  settlementLabel: string | null;
  startingSettlementLabel: string | null;
  currentLocationLabel: string | null;
  gold: number;
  fundsLabel: string;
  inGameDate: string;
  totalPlayTicks: number;
  capturedAtTick: number;
  lastSavedAt: string;
  snapshotVersion: string;
}

export interface SaveSlotSummary {
  id: SaveSlotId;
  label: string;
  kind: SaveSlotKind;
  status: SaveSlotStatus;
  hasSave: boolean;
  metadata: SaveSlotMetadata | null;
  playerName: string | null;
  lineageLabel: string | null;
  sexLabel: string | null;
  classLabel: string | null;
  backstoryLabel: string | null;
  startingBundleLabel: string | null;
  level: number | null;
  regionLabel: string | null;
  settlementLabel: string | null;
  startingSettlementLabel: string | null;
  currentLocationLabel: string | null;
  gold: number | null;
  fundsLabel: string | null;
  inGameDate: string | null;
  lastSavedAt: string | null;
  lastSavedLabel: string | null;
  playtimeLabel: string | null;
  capturedAtTick: number | null;
  snapshotVersion: string | null;
}

export interface GameShellNotice {
  tone: TagTone;
  title: string;
  detail: string;
  message?: string;
  compact?: boolean;
  autoDismissMs?: number | null;
}

type SignedInGameShellBaseState = {
  launcherSession: LauncherRuntimeSession;
  accountProfile: AccountProfileState;
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
};

export type AccountAccessState = {
  screen: 'ACCOUNT_ACCESS';
  accessMode: 'pick_account' | 'create_first_account';
  accounts: LocalAccountPickerEntry[];
  notice: GameShellNotice | null;
};

export type MainMenuState = SignedInGameShellBaseState & {
  screen: 'MAIN_MENU';
};

export type CharacterCreationState = SignedInGameShellBaseState & {
  screen: 'CHARACTER_CREATION';
  form: CharacterCreationFormState;
  pendingOverwriteSlotId: ManualSaveSlotId | null;
};

export type LoadGameState = SignedInGameShellBaseState & {
  screen: 'LOAD_GAME';
  selectedSlotId: SaveSlotId | null;
};

export type SettingsState = SignedInGameShellBaseState & {
  screen: 'SETTINGS';
};

export type InGameState = SignedInGameShellBaseState & {
  screen: 'IN_GAME';
  activeSlotId: SaveSlotId;
  snapshot: SaveSnapshot;
  campaignSessionControl: CampaignSessionControl;
  hasUnsavedChanges: boolean;
};

export type GameShellState =
  | AccountAccessState
  | MainMenuState
  | CharacterCreationState
  | LoadGameState
  | SettingsState
  | InGameState;

export type GameShellAction =
  | {
      type: 'SHOW_ACCOUNT_ACCESS';
      accessMode: 'pick_account' | 'create_first_account';
      accounts: LocalAccountPickerEntry[];
      notice: GameShellNotice | null;
    }
  | {
      type: 'SHOW_MAIN_MENU';
      launcherSession: LauncherRuntimeSession;
      accountProfile: AccountProfileState;
      slots: SaveSlotSummary[];
      notice: GameShellNotice | null;
    }
  | {
      type: 'OPEN_CHARACTER_CREATION';
      launcherSession: LauncherRuntimeSession;
      accountProfile: AccountProfileState;
      slots: SaveSlotSummary[];
      form: CharacterCreationFormState;
      notice: GameShellNotice | null;
    }
  | {
      type: 'UPDATE_CHARACTER_CREATION_FORM';
      form: Partial<CharacterCreationFormState>;
    }
  | {
      type: 'SET_CHARACTER_OVERWRITE';
      slotId: ManualSaveSlotId | null;
    }
  | {
      type: 'OPEN_LOAD_GAME';
      launcherSession: LauncherRuntimeSession;
      accountProfile: AccountProfileState;
      slots: SaveSlotSummary[];
      selectedSlotId: SaveSlotId | null;
      notice: GameShellNotice | null;
    }
  | {
      type: 'OPEN_SETTINGS';
      launcherSession: LauncherRuntimeSession;
      accountProfile: AccountProfileState;
      slots: SaveSlotSummary[];
      notice: GameShellNotice | null;
    }
  | {
      type: 'SELECT_LOAD_SLOT';
      slotId: SaveSlotId;
    }
  | {
      type: 'ENTER_GAME';
      launcherSession: LauncherRuntimeSession;
      accountProfile: AccountProfileState;
      slots: SaveSlotSummary[];
      slotId: SaveSlotId;
      snapshot: SaveSnapshot;
      campaignSessionControl: CampaignSessionControl;
      notice: GameShellNotice | null;
    }
  | {
      type: 'UPDATE_IN_GAME_SNAPSHOT';
      launcherSession: LauncherRuntimeSession;
      accountProfile: AccountProfileState;
      slots: SaveSlotSummary[];
      snapshot: SaveSnapshot;
      campaignSessionControl: CampaignSessionControl;
    }
  | {
      type: 'COMPLETE_IN_GAME_SAVE';
      launcherSession: LauncherRuntimeSession;
      accountProfile: AccountProfileState;
      slots: SaveSlotSummary[];
      activeSlotId: SaveSlotId;
      snapshot: SaveSnapshot;
      campaignSessionControl: CampaignSessionControl;
      notice: GameShellNotice | null;
    }
  | {
      type: 'SET_NOTICE';
      notice: GameShellNotice | null;
    };

export const MANUAL_SAVE_SLOT_COUNT = 128;
export const MANUAL_SAVE_SLOTS_PER_PAGE = 16;
export const MANUAL_SAVE_PAGE_COUNT =
  MANUAL_SAVE_SLOT_COUNT / MANUAL_SAVE_SLOTS_PER_PAGE;

export const MANUAL_SAVE_SLOT_ORDER: ReadonlyArray<{
  id: ManualSaveSlotId;
  label: string;
  kind: 'manual';
}> = Array.from({ length: MANUAL_SAVE_SLOT_COUNT }, (_, index) => {
  const slotNumber = (index + 1) as ManualSaveSlotNumber;

  return {
    id: `slot-${slotNumber}` as ManualSaveSlotId,
    label: `Slot ${slotNumber}`,
    kind: 'manual' as const
  };
});

export const QUICK_SAVE_SLOT: Readonly<{
  id: QuickSaveSlotId;
  label: string;
  kind: 'quick';
}> = {
  id: 'quick-save',
  label: 'Quick Save',
  kind: 'quick'
};

export const SAVE_SLOT_ORDER: ReadonlyArray<{
  id: SaveSlotId;
  label: string;
  kind: SaveSlotKind;
}> = [...MANUAL_SAVE_SLOT_ORDER, QUICK_SAVE_SLOT];

function createEmptySaveSlotSummary(slot: {
  id: SaveSlotId;
  label: string;
  kind: SaveSlotKind;
}): SaveSlotSummary {
  return {
    id: slot.id,
    label: slot.label,
    kind: slot.kind,
    status: 'empty',
    hasSave: false,
    metadata: null,
    playerName: null,
    lineageLabel: null,
    sexLabel: null,
    classLabel: null,
    backstoryLabel: null,
    startingBundleLabel: null,
    level: null,
    regionLabel: null,
    settlementLabel: null,
    startingSettlementLabel: null,
    currentLocationLabel: null,
    gold: null,
    fundsLabel: null,
    inGameDate: null,
    lastSavedAt: null,
    lastSavedLabel: null,
    playtimeLabel: null,
    capturedAtTick: null,
    snapshotVersion: null
  };
}

export function createEmptySaveSlotSummaries(): SaveSlotSummary[] {
  return SAVE_SLOT_ORDER.map(createEmptySaveSlotSummary);
}

export function getPreferredSaveSlotId(slots: SaveSlotSummary[]): ManualSaveSlotId {
  return (
    (slots.find((slot) => slot.kind === 'manual' && !slot.hasSave)?.id as
      | ManualSaveSlotId
      | undefined) ?? MANUAL_SAVE_SLOT_ORDER[0]!.id
  );
}

export function getPreferredLoadSlotId(slots: SaveSlotSummary[]): SaveSlotId | null {
  const latestSave = [...slots]
    .filter((slot) => slot.hasSave)
    .sort((left, right) => (right.lastSavedAt ?? '').localeCompare(left.lastSavedAt ?? ''))[0];

  return latestSave?.id ?? null;
}

export function isManualSaveSlotId(slotId: SaveSlotId): slotId is ManualSaveSlotId {
  return MANUAL_SAVE_SLOT_ORDER.some((slot) => slot.id === slotId);
}

export function getSaveSlotLabel(slotId: SaveSlotId): string {
  return SAVE_SLOT_ORDER.find((slot) => slot.id === slotId)?.label ?? slotId;
}

export function createInitialGameShellState(
  launcherSession: LauncherRuntimeSession,
  accountProfile: AccountProfileState,
  slots: SaveSlotSummary[],
  notice: GameShellNotice | null
): MainMenuState {
  return {
    screen: 'MAIN_MENU',
    launcherSession,
    accountProfile,
    slots,
    notice
  };
}

export function createAccountAccessState(
  accessMode: 'pick_account' | 'create_first_account',
  accounts: LocalAccountPickerEntry[],
  notice: GameShellNotice | null
): AccountAccessState {
  return {
    screen: 'ACCOUNT_ACCESS',
    accessMode,
    accounts,
    notice
  };
}

export function gameShellReducer(
  state: GameShellState,
  action: GameShellAction
): GameShellState {
  switch (action.type) {
    case 'SHOW_ACCOUNT_ACCESS':
      return {
        screen: 'ACCOUNT_ACCESS',
        accessMode: action.accessMode,
        accounts: action.accounts,
        notice: action.notice
      };
    case 'SHOW_MAIN_MENU':
      return {
        screen: 'MAIN_MENU',
        launcherSession: action.launcherSession,
        accountProfile: action.accountProfile,
        slots: action.slots,
        notice: action.notice
      };
    case 'OPEN_CHARACTER_CREATION':
      return {
        screen: 'CHARACTER_CREATION',
        launcherSession: action.launcherSession,
        accountProfile: action.accountProfile,
        slots: action.slots,
        notice: action.notice,
        form: action.form,
        pendingOverwriteSlotId: null
      };
    case 'UPDATE_CHARACTER_CREATION_FORM':
      if (state.screen !== 'CHARACTER_CREATION') {
        return state;
      }

      return {
        ...state,
        form: {
          ...state.form,
          ...action.form
        },
        pendingOverwriteSlotId: null
      };
    case 'SET_CHARACTER_OVERWRITE':
      if (state.screen !== 'CHARACTER_CREATION') {
        return state;
      }

      return {
        ...state,
        pendingOverwriteSlotId: action.slotId
      };
    case 'OPEN_LOAD_GAME':
      return {
        screen: 'LOAD_GAME',
        launcherSession: action.launcherSession,
        accountProfile: action.accountProfile,
        slots: action.slots,
        notice: action.notice,
        selectedSlotId: action.selectedSlotId
      };
    case 'OPEN_SETTINGS':
      return {
        screen: 'SETTINGS',
        launcherSession: action.launcherSession,
        accountProfile: action.accountProfile,
        slots: action.slots,
        notice: action.notice
      };
    case 'SELECT_LOAD_SLOT':
      if (state.screen !== 'LOAD_GAME') {
        return state;
      }

      return {
        ...state,
        selectedSlotId: action.slotId
      };
    case 'ENTER_GAME':
      return {
        screen: 'IN_GAME',
        launcherSession: action.launcherSession,
        accountProfile: action.accountProfile,
        slots: action.slots,
        notice: action.notice,
        activeSlotId: action.slotId,
        snapshot: action.snapshot,
        campaignSessionControl: action.campaignSessionControl,
        hasUnsavedChanges: false
      };
    case 'UPDATE_IN_GAME_SNAPSHOT':
      if (state.screen !== 'IN_GAME') {
        return state;
      }

      if (
        action.snapshot === state.snapshot &&
        action.slots === state.slots &&
        action.accountProfile === state.accountProfile
      ) {
        return state;
      }

      return {
        ...state,
        launcherSession: action.launcherSession,
        accountProfile: action.accountProfile,
        slots: action.slots,
        snapshot: action.snapshot,
        campaignSessionControl: action.campaignSessionControl,
        hasUnsavedChanges:
          action.snapshot === state.snapshot ? state.hasUnsavedChanges : true
      };
    case 'COMPLETE_IN_GAME_SAVE':
      if (state.screen !== 'IN_GAME') {
        return state;
      }

      return {
        ...state,
        launcherSession: action.launcherSession,
        accountProfile: action.accountProfile,
        slots: action.slots,
        notice: action.notice,
        activeSlotId: action.activeSlotId,
        snapshot: action.snapshot,
        campaignSessionControl: action.campaignSessionControl,
        hasUnsavedChanges: false
      };
    case 'SET_NOTICE':
      return {
        ...state,
        notice: action.notice
      };
    default:
      return state;
  }
}
