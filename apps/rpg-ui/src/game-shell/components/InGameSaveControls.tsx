import { Card } from '../../components/ui/Card';
import type { SaveSlotSummary } from '../state.js';

type InGameSaveControlsProps = {
  activeSlot: SaveSlotSummary | null;
  quickSaveSlot: SaveSlotSummary | null;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onQuickSave: () => void;
  onReturnToMainMenu: () => void;
  embedded?: boolean;
};

export function InGameSaveControls({
  activeSlot,
  quickSaveSlot,
  hasUnsavedChanges,
  onSave,
  onQuickSave,
  onReturnToMainMenu,
  embedded = false
}: InGameSaveControlsProps) {
  const content = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-[240px] flex-1 flex-wrap gap-3">
          <div className="rounded-[22px] border border-white/10 bg-black/10 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Current Slot</div>
            <div className="mt-1 text-sm text-slate-50">{activeSlot?.label ?? 'Unsaved Session'}</div>
            <div className="mt-1 text-xs text-slate-400">
              {activeSlot?.hasSave
                ? activeSlot.lastSavedLabel
                : activeSlot?.status === 'corrupt'
                  ? 'This slot previously held unreadable data.'
                  : 'No persisted save has been written yet.'}
            </div>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-black/10 px-4 py-3">
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

          <div className="rounded-[22px] border border-white/10 bg-black/10 px-4 py-3">
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
            className="rounded-full border border-amber-300/25 bg-amber-200/10 px-4 py-2 text-sm text-amber-50 transition hover:bg-amber-200/15"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onQuickSave}
            className="rounded-full border border-cyan-300/20 bg-cyan-200/10 px-4 py-2 text-sm text-cyan-50 transition hover:bg-cyan-200/15"
          >
            Quick Save
          </button>
          <button
            type="button"
            onClick={onReturnToMainMenu}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
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
