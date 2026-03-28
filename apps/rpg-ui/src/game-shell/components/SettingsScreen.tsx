import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import type { GameShellNotice, SaveSlotSummary } from '../state.js';
import { ScreenFrame } from './ScreenFrame.js';

type SettingsScreenProps = {
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
  onDismissNotice: () => void;
  onBack: () => void;
  onResetSaves: () => void;
};

export function SettingsScreen({
  slots,
  notice,
  onDismissNotice,
  onBack,
  onResetSaves
}: SettingsScreenProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);
  const occupiedManualSlots = slots.filter((slot) => slot.kind === 'manual' && slot.hasSave).length;
  const quickSaveReady = slots.some((slot) => slot.kind === 'quick' && slot.hasSave);

  return (
    <ScreenFrame
      eyebrow="Settings"
      title="Launcher Settings"
      description="The launcher uses the browser-local save system directly. Resetting save data here clears the same real save ledgers used by the main menu, character creation, and in-session saves."
      accent="var(--color-chronicle)"
      notice={notice}
      onDismissNotice={onDismissNotice}
      headerActions={
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          Back
        </button>
      }
      mainContent={
        <div className="space-y-4">
          <Card title="Save Storage" accent="var(--color-world)">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[20px] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Manual Slots</div>
                <div className="mt-2 text-3xl text-slate-50">{occupiedManualSlots} / 6</div>
                <div className="mt-2 text-sm text-slate-400">
                  Manual campaign slots remain browser-local and overwrite-safe, with an additional row available from the main menu.
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Quick Save</div>
                <div className="mt-2 text-2xl text-slate-50">{quickSaveReady ? 'Ready' : 'Unused'}</div>
                <div className="mt-2 text-sm text-slate-400">
                  Quick Save stays separate from the manual game-data ledgers.
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Storage Backend</div>
                <div className="mt-2 text-2xl text-slate-50">Browser Local</div>
                <div className="mt-2 text-sm text-slate-400">
                  Save snapshots are stored with the shared local snapshot serializer.
                </div>
              </div>
            </div>
          </Card>

          <Card title="Save Reset" accent="var(--color-chronicle)">
            {confirmingReset ? (
              <div className="space-y-4">
                <div className="text-sm leading-7 text-slate-300">
                  This clears all manual save slots and the dedicated quick-save slot for this browser profile.
                </div>
                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(false)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmingReset(false);
                      onResetSaves();
                    }}
                    className="rounded-full border border-rose-300/25 bg-rose-200/10 px-4 py-2 text-sm text-rose-50 transition hover:bg-rose-200/15"
                  >
                    Clear Saves
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingReset(true)}
                className="w-full rounded-[24px] border border-rose-300/20 bg-rose-200/10 px-5 py-4 text-left text-rose-50 transition hover:bg-rose-200/15"
              >
                <span className="block text-lg font-semibold">Reset Save Data</span>
                <span className="mt-1 block text-sm text-rose-100/80">
                  Clear all browser-local save records after a confirmation step.
                </span>
              </button>
            )}
          </Card>
        </div>
      }
      sideContent={
        <Card title="Launcher Notes" accent="var(--color-character)">
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <p>
              Empty ledgers on the main menu begin character creation directly in that chosen slot.
            </p>
            <p>
              Occupied ledgers on the main menu load their campaign directly, while the quick-save slot remains separate for in-session use.
            </p>
            <p>
              The start screen remains the mandatory application entry point. There is no launch bypass directly into the in-game shell.
            </p>
          </div>
        </Card>
      }
    />
  );
}
