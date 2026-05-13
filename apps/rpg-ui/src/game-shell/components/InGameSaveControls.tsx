import { Card } from '../../components/ui/Card';
import type { SaveSlotSummary } from '../state.js';

type InGameSaveControlsProps = {
  activeSlot: SaveSlotSummary | null;
  quickSaveSlot: SaveSlotSummary | null;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onQuickSave: () => void;
  onRetireCharacter: () => void;
  onReturnToMainMenu: () => void;
  embedded?: boolean;
};

export function InGameSaveControls({
  activeSlot,
  quickSaveSlot,
  hasUnsavedChanges,
  onSave,
  onQuickSave,
  onRetireCharacter,
  onReturnToMainMenu,
  embedded = false
}: InGameSaveControlsProps) {
  const content = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-[240px] flex-1 flex-wrap gap-3">
          <div className="forged-subpanel px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Current Slot</div>
            <div className="mt-1 text-sm text-slate-50">{activeSlot?.label ?? 'Unsaved Session'}</div>
            <div className="mt-1 text-xs text-slate-400">
              {activeSlot?.hasSave
                ? activeSlot.lastSavedLabel
                : activeSlot?.status === 'incompatible'
                  ? 'This slot contains data from an older incompatible save format that predates the account-scoped Legacy ledger.'
                : activeSlot?.status === 'corrupt'
                  ? 'This slot previously held unreadable data.'
                  : 'No persisted save has been written yet.'}
            </div>
          </div>

          <div className="forged-subpanel px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Quick Save</div>
            <div className="mt-1 text-sm text-slate-50">
              {quickSaveSlot?.hasSave ? quickSaveSlot.playerName : 'Unused'}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {quickSaveSlot?.hasSave
                ? quickSaveSlot.lastSavedLabel
                : 'Writes to the dedicated quick-save slot.'}
            </div>
          </div>

          <div className="forged-subpanel px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Session State</div>
            <div className="mt-1 text-sm text-slate-50">
              {hasUnsavedChanges ? 'Unsaved Changes' : 'All Changes Saved'}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Pin changes and other session edits stay in memory until an explicit save action is used.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            className="forged-icon-button forged-tone-success px-4 py-2 text-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onQuickSave}
            className="forged-icon-button px-4 py-2 text-sm text-[color:var(--color-text-primary)]"
          >
            Quick Save
          </button>
          <button
            type="button"
            onClick={onRetireCharacter}
            className="forged-icon-button forged-tone-danger px-4 py-2 text-sm"
          >
            Retire Character
          </button>
          <button
            type="button"
            onClick={onReturnToMainMenu}
            className="forged-icon-button px-4 py-2 text-sm text-[color:var(--color-text-secondary)]"
          >
            Return To Main Menu
          </button>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <Card title="Save Controls" accent="var(--color-chronicle)">
      {content}
    </Card>
  );
}
