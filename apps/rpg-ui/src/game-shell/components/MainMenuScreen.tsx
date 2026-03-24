import { Icon } from '../../components/icons';
import { Card } from '../../components/ui/Card';
import type { GameShellNotice, SaveSlotSummary } from '../state.js';
import { ScreenFrame } from './ScreenFrame.js';

type MainMenuScreenProps = {
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
  isResetConfirmationOpen: boolean;
  onDismissNotice: () => void;
  onNewGame: () => void;
  onLoadGame: () => void;
  onOpenResetConfirmation: () => void;
  onCloseResetConfirmation: () => void;
  onConfirmReset: () => void;
  onExit: () => void;
};

const actionButtonClass =
  'flex w-full items-center justify-between rounded-[26px] border px-5 py-4 text-left transition';

export function MainMenuScreen({
  slots,
  notice,
  isResetConfirmationOpen,
  onDismissNotice,
  onNewGame,
  onLoadGame,
  onOpenResetConfirmation,
  onCloseResetConfirmation,
  onConfirmReset,
  onExit
}: MainMenuScreenProps) {
  const manualSlots = slots.filter((slot) => slot.kind === 'manual');
  const quickSaveSlot = slots.find((slot) => slot.kind === 'quick') ?? null;
  const populatedSlots = slots.filter((slot) => slot.hasSave);
  const latestSave = [...populatedSlots].sort((left, right) =>
    (right.lastSavedAt ?? '').localeCompare(left.lastSavedAt ?? '')
  )[0];

  return (
    <>
      <ScreenFrame
        eyebrow="Main Menu"
        title="Cataclysm RPG"
        description="Choose whether to begin a fresh campaign, load one of the browser-local save records, clear all local save data, or attempt a browser-safe exit. Manual slots and the dedicated quick-save slot all share the same snapshot model."
        accent="var(--color-character)"
        notice={notice}
        onDismissNotice={onDismissNotice}
        mainContent={
          <div className="space-y-4">
            <Card title="Campaign Gate" accent="var(--color-character)">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={onNewGame}
                  className={`${actionButtonClass} border-amber-300/25 bg-amber-200/10 text-amber-50 hover:bg-amber-200/14`}
                >
                  <span>
                    <span className="block text-lg font-semibold">New Game</span>
                    <span className="mt-1 block text-sm text-amber-100/80">
                      Create a character, choose a save slot, and enter the world.
                    </span>
                  </span>
                  <Icon name="chevron" className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={onLoadGame}
                  className={`${actionButtonClass} border-cyan-300/20 bg-cyan-200/10 text-cyan-50 hover:bg-cyan-200/14`}
                >
                    <span>
                      <span className="block text-lg font-semibold">Load Game</span>
                      <span className="mt-1 block text-sm text-cyan-100/80">
                        Open one of the three manual slots or the dedicated quick-save slot stored in this browser.
                      </span>
                    </span>
                    <Icon name="chevron" className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={onOpenResetConfirmation}
                  className={`${actionButtonClass} border-rose-300/20 bg-rose-200/10 text-rose-50 hover:bg-rose-200/14`}
                >
                  <span>
                    <span className="block text-lg font-semibold">Reset Save Data</span>
                    <span className="mt-1 block text-sm text-rose-100/80">
                      Clear all local save slots after an explicit confirmation step.
                    </span>
                  </span>
                  <Icon name="chevron" className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={onExit}
                  className={`${actionButtonClass} border-white/10 bg-white/5 text-slate-100 hover:bg-white/10`}
                >
                  <span>
                    <span className="block text-lg font-semibold">Exit</span>
                    <span className="mt-1 block text-sm text-slate-300">
                      Attempt to close the tab, then fall back to browser guidance if blocked.
                    </span>
                  </span>
                  <Icon name="chevron" className="h-5 w-5" />
                </button>
              </div>
            </Card>

            <Card title="Save Vault" accent="var(--color-world)">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Occupied Slots
                  </div>
                  <div className="mt-2 text-3xl text-slate-50">
                    {manualSlots.filter((slot) => slot.hasSave).length} / 3
                  </div>
                  <div className="mt-2 text-sm text-slate-400">
                    Manual slots remain available for new campaigns and overwrite-safe saves.
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Latest Save
                  </div>
                  <div className="mt-2 text-2xl text-slate-50">
                    {latestSave?.playerName ?? 'No local saves'}
                  </div>
                  <div className="mt-2 text-sm text-slate-400">
                    {latestSave?.lastSavedLabel ?? 'Start a new campaign to create a slot.'}
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    Quick Save
                  </div>
                  <div className="mt-2 text-2xl text-slate-50">
                    {quickSaveSlot?.hasSave ? quickSaveSlot.playerName : 'Unused'}
                  </div>
                  <div className="mt-2 text-sm text-slate-400">
                    {quickSaveSlot?.hasSave
                      ? quickSaveSlot.lastSavedLabel
                      : 'The quick-save slot stays separate from the three manual slots.'}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        }
        sideContent={
          <Card title="Local Save Slots" accent="var(--color-world)" className="h-full">
            <div className="space-y-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`rounded-[24px] border p-4 ${
                    slot.hasSave
                      ? 'border-white/12 bg-white/5'
                      : 'border-dashed border-white/10 bg-black/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{slot.label}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {slot.hasSave
                          ? slot.kind === 'quick'
                            ? 'Quick Save Ready'
                            : 'Occupied'
                          : slot.status === 'corrupt'
                            ? 'Corrupt Data'
                            : 'Empty'}
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
                      {slot.kind === 'quick' ? 'Quick' : slot.snapshotVersion ?? 'Ready'}
                    </div>
                  </div>

                  {slot.hasSave ? (
                    <div className="mt-3 space-y-1 text-sm text-slate-300">
                      <div className="text-base text-slate-50">{slot.playerName}</div>
                      <div>
                        {slot.lineageLabel} | {slot.classLabel}
                      </div>
                      <div>Level {slot.level}</div>
                      <div>{slot.settlementLabel}</div>
                      <div>{slot.inGameDate}</div>
                      <div className="text-slate-500">{slot.lastSavedLabel}</div>
                    </div>
                  ) : slot.status === 'corrupt' ? (
                    <div className="mt-3 text-sm text-rose-200/80">
                      This slot contains unreadable local data. Open Load Game to delete or replace it safely.
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-slate-500">
                      {slot.kind === 'quick'
                        ? 'Quick Save will populate this slot from inside the in-game shell.'
                        : 'This slot will be offered first during character creation.'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        }
      />

      {isResetConfirmationOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <Card title="Reset All Local Save Data" accent="var(--color-chronicle)" className="w-full max-w-xl">
            <div className="space-y-4">
              <p className="text-sm leading-7 text-slate-300">
                This will permanently clear all three manual save slots and the dedicated quick-save slot for the
                current browser profile. The action cannot be undone.
              </p>
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseResetConfirmation}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirmReset}
                  className="rounded-full border border-rose-300/25 bg-rose-200/10 px-4 py-2 text-sm text-rose-50 transition hover:bg-rose-200/15"
                >
                  Clear Saves
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
