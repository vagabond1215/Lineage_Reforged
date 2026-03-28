import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
import type { TagTone } from '../types.js';
import type { CharacterCreationFormState } from './characterCreationForm.js';

export type AppScreen = 'MAIN_MENU' | 'CHARACTER_CREATION' | 'LOAD_GAME' | 'SETTINGS' | 'IN_GAME';
type ManualSaveSlotNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40;

export type ManualSaveSlotId = `slot-${ManualSaveSlotNumber}`;
export type QuickSaveSlotId = 'quick-save';
export type SaveSlotId = ManualSaveSlotId | QuickSaveSlotId;
export type SaveSlotKind = 'manual' | 'quick';
export type SaveSlotStatus = 'empty' | 'ready' | 'corrupt';

export interface SaveSlotMetadata {
  slotId: SaveSlotId;
  characterName: string;
  level: number;
  lineageLabel: string | null;
  classLabel: string | null;
  regionLabel: string;
  settlementLabel: string | null;
  gold: number;
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
  classLabel: string | null;
  level: number | null;
  regionLabel: string | null;
  settlementLabel: string | null;
  gold: number | null;
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
}

type GameShellBaseState = {
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
};

export type MainMenuState = GameShellBaseState & {
  screen: 'MAIN_MENU';
};

export type CharacterCreationState = GameShellBaseState & {
  screen: 'CHARACTER_CREATION';
  form: CharacterCreationFormState;
  pendingOverwriteSlotId: ManualSaveSlotId | null;
};

export type LoadGameState = GameShellBaseState & {
  screen: 'LOAD_GAME';
  selectedSlotId: SaveSlotId | null;
};

export type SettingsState = GameShellBaseState & {
  screen: 'SETTINGS';
};

export type InGameState = GameShellBaseState & {
  screen: 'IN_GAME';
  activeSlotId: SaveSlotId;
  snapshot: SaveSnapshot;
  hasUnsavedChanges: boolean;
};

export type GameShellState =
  | MainMenuState
  | CharacterCreationState
  | LoadGameState
  | SettingsState
  | InGameState;

export type GameShellAction =
  | {
      type: 'SHOW_MAIN_MENU';
      slots: SaveSlotSummary[];
      notice: GameShellNotice | null;
    }
  | {
      type: 'OPEN_CHARACTER_CREATION';
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
      slots: SaveSlotSummary[];
      selectedSlotId: SaveSlotId | null;
      notice: GameShellNotice | null;
    }
  | {
      type: 'OPEN_SETTINGS';
      slots: SaveSlotSummary[];
      notice: GameShellNotice | null;
    }
  | {
      type: 'SELECT_LOAD_SLOT';
      slotId: SaveSlotId;
    }
  | {
      type: 'ENTER_GAME';
      slots: SaveSlotSummary[];
      slotId: SaveSlotId;
      snapshot: SaveSnapshot;
      notice: GameShellNotice | null;
    }
  | {
      type: 'UPDATE_IN_GAME_SNAPSHOT';
      slots: SaveSlotSummary[];
      snapshot: SaveSnapshot;
    }
  | {
      type: 'COMPLETE_IN_GAME_SAVE';
      slots: SaveSlotSummary[];
      activeSlotId: SaveSlotId;
      notice: GameShellNotice | null;
    }
  | {
      type: 'SET_NOTICE';
      notice: GameShellNotice | null;
    };

export const MANUAL_SAVE_SLOT_COUNT = 40;
export const MANUAL_SAVE_SLOTS_PER_PAGE = 8;
export const MANUAL_SAVE_PAGE_COUNT =
  MANUAL_SAVE_SLOT_COUNT / MANUAL_SAVE_SLOTS_PER_PAGE;

function toRomanNumeral(value: number): string {
  const parts: Array<[number, string]> = [
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ];
  let remaining = value;
  let result = '';

  for (const [amount, numeral] of parts) {
    while (remaining >= amount) {
      result += numeral;
      remaining -= amount;
    }
  }

  return result;
}

export const MANUAL_SAVE_SLOT_ORDER: ReadonlyArray<{
  id: ManualSaveSlotId;
  label: string;
  kind: 'manual';
}> = Array.from({ length: MANUAL_SAVE_SLOT_COUNT }, (_, index) => {
  const slotNumber = (index + 1) as ManualSaveSlotNumber;

  return {
    id: `slot-${slotNumber}` as ManualSaveSlotId,
    label: `Slot ${toRomanNumeral(slotNumber)}`,
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
    classLabel: null,
    level: null,
    regionLabel: null,
    settlementLabel: null,
    gold: null,
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
  slots: SaveSlotSummary[],
  notice: GameShellNotice | null
): MainMenuState {
  return {
    screen: 'MAIN_MENU',
    slots,
    notice
  };
}

export function gameShellReducer(
  state: GameShellState,
  action: GameShellAction
): GameShellState {
  switch (action.type) {
    case 'SHOW_MAIN_MENU':
      return {
        screen: 'MAIN_MENU',
        slots: action.slots,
        notice: action.notice
      };
    case 'OPEN_CHARACTER_CREATION':
      return {
        screen: 'CHARACTER_CREATION',
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
        slots: action.slots,
        notice: action.notice,
        selectedSlotId: action.selectedSlotId
      };
    case 'OPEN_SETTINGS':
      return {
        screen: 'SETTINGS',
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
        slots: action.slots,
        notice: action.notice,
        activeSlotId: action.slotId,
        snapshot: action.snapshot,
        hasUnsavedChanges: false
      };
    case 'UPDATE_IN_GAME_SNAPSHOT':
      if (state.screen !== 'IN_GAME') {
        return state;
      }

      if (action.snapshot === state.snapshot && action.slots === state.slots) {
        return state;
      }

      return {
        ...state,
        slots: action.slots,
        snapshot: action.snapshot,
        hasUnsavedChanges:
          action.snapshot === state.snapshot ? state.hasUnsavedChanges : true
      };
    case 'COMPLETE_IN_GAME_SAVE':
      if (state.screen !== 'IN_GAME') {
        return state;
      }

      return {
        ...state,
        slots: action.slots,
        notice: action.notice,
        activeSlotId: action.activeSlotId,
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
