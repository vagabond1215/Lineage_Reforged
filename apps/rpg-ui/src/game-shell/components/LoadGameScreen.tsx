import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import type { GameShellNotice, SaveSlotId, SaveSlotSummary } from '../state.js';
import { ScreenFrame } from './ScreenFrame.js';

type LoadGameScreenProps = {
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
  selectedSlotId: SaveSlotId | null;
  onDismissNotice: () => void;
  onBack: () => void;
  onSelectSlot: (slotId: SaveSlotId) => void;
  onLoadSelected: () => void;
  onDeleteSlot: (slotId: SaveSlotId) => void;
};

function getSlotStatusLabel(slot: SaveSlotSummary): string {
  if (slot.hasSave) {
    return slot.kind === 'quick' ? 'Quick Save Ready' : 'Ready To Load';
  }

  if (slot.status === 'corrupt') {
    return 'Corrupt Local Data';
  }

  return 'Empty';
}

export function LoadGameScreen({
  slots,
  notice,
  selectedSlotId,
  onDismissNotice,
  onBack,
  onSelectSlot,
  onLoadSelected,
  onDeleteSlot
}: LoadGameScreenProps) {
  const [pendingDeleteSlotId, setPendingDeleteSlotId] = useState<SaveSlotId | null>(null);
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) ?? null;
  const hasAnyLoadableSave = slots.some((slot) => slot.hasSave);
  const canDeleteSelected =
    selectedSlot?.status === 'corrupt' || selectedSlot?.hasSave === true;

  return (
    <ScreenFrame
      eyebrow="Load Game"
      title="Open A Local Save"
      description="Each save record is backed by browser localStorage using the shared snapshot serializer. Manual saves and the dedicated quick-save slot are listed together, and unreadable entries are isolated so one bad record cannot break the whole menu."
      accent="var(--color-world)"
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
          <Card title="Save Records" accent="var(--color-world)">
            <div className="grid gap-3 lg:grid-cols-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => {
                    setPendingDeleteSlotId(null);
                    onSelectSlot(slot.id);
                  }}
                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                    slot.id === selectedSlotId
                      ? 'border-white/20 bg-white/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{slot.label}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {getSlotStatusLabel(slot)}
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-400">
                      {slot.kind === 'quick' ? 'Quick' : slot.snapshotVersion ?? 'Manual'}
                    </div>
                  </div>

                  {slot.hasSave ? (
                    <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                      <div className="text-base text-slate-50">{slot.playerName}</div>
                      <div>{slot.lastSavedLabel}</div>
                      <div>
                        {slot.lineageLabel} | {slot.classLabel}
                      </div>
                      <div>Level {slot.level}</div>
                      <div>{slot.settlementLabel ?? slot.regionLabel}</div>
                      <div>{slot.inGameDate}</div>
                      <div>{slot.playtimeLabel}</div>
                      <div>Tick {slot.capturedAtTick}</div>
                    </div>
                  ) : slot.status === 'corrupt' ? (
                    <div className="mt-3 rounded-[18px] border border-rose-300/20 bg-rose-200/10 px-3 py-3 text-sm text-rose-100">
                      This slot contains malformed or incompatible local data. It cannot be loaded until it is deleted.
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-slate-500">
                      No snapshot is stored in this slot yet.
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Load Actions" accent="var(--color-character)">
            <div className="space-y-4">
              {!hasAnyLoadableSave && (
                <div className="rounded-[22px] border border-white/10 bg-black/10 p-4 text-sm text-slate-400">
                  No loadable local saves were found. Start a new game or create a quick save from an active campaign.
                </div>
              )}

              <button
                type="button"
                onClick={onLoadSelected}
                disabled={!selectedSlot?.hasSave}
                className="w-full rounded-[24px] border border-amber-300/25 bg-amber-200/10 px-5 py-4 text-left text-amber-50 transition hover:bg-amber-200/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="block text-lg font-semibold">Load Selected Save</span>
                <span className="mt-1 block text-sm text-amber-100/80">
                  {selectedSlot?.hasSave
                    ? `Continue ${selectedSlot.playerName} from ${selectedSlot.label}.`
                    : 'Choose an occupied slot to continue.'}
                </span>
              </button>

              {canDeleteSelected && selectedSlot && pendingDeleteSlotId === selectedSlot.id ? (
                <div className="rounded-[22px] border border-rose-300/20 bg-rose-200/10 p-4">
                  <div className="text-sm leading-6 text-rose-100">
                    {selectedSlot.status === 'corrupt'
                      ? `Delete the unreadable data stored in ${selectedSlot.label}?`
                      : `Delete ${selectedSlot.playerName} from ${selectedSlot.label}?`}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPendingDeleteSlotId(null);
                        onDeleteSlot(selectedSlot.id);
                      }}
                      className="rounded-full border border-rose-300/25 bg-rose-200/10 px-4 py-2 text-sm text-rose-50 transition hover:bg-rose-200/15"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteSlotId(null)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      Keep Save
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => selectedSlot && setPendingDeleteSlotId(selectedSlot.id)}
                  disabled={!canDeleteSelected}
                  className="w-full rounded-[24px] border border-rose-300/20 bg-rose-200/10 px-5 py-4 text-left text-rose-50 transition hover:bg-rose-200/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="block text-lg font-semibold">
                    {selectedSlot?.status === 'corrupt' ? 'Delete Corrupt Entry' : 'Delete Selected Save'}
                  </span>
                  <span className="mt-1 block text-sm text-rose-100/80">
                    {selectedSlot
                      ? `Remove the local data stored in ${selectedSlot.label}.`
                      : 'Select a save slot to remove it.'}
                  </span>
                </button>
              )}
            </div>
          </Card>
        </div>
      }
      sideContent={
        <Card title="Selected Slot" accent="var(--color-chronicle)">
          {selectedSlot?.hasSave ? (
            <div className="space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Character</div>
                <div className="mt-2 text-xl text-slate-50">{selectedSlot.playerName}</div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-black/10 p-4 text-sm text-slate-300">
                <div>Slot: {selectedSlot.label}</div>
                <div className="mt-1">Type: {selectedSlot.kind === 'quick' ? 'Quick Save' : 'Manual Save'}</div>
                <div className="mt-1">Lineage: {selectedSlot.lineageLabel}</div>
                <div className="mt-1">Class: {selectedSlot.classLabel}</div>
                <div className="mt-1">Level: {selectedSlot.level}</div>
                <div className="mt-1">Region: {selectedSlot.regionLabel}</div>
                <div className="mt-1">Settlement: {selectedSlot.settlementLabel}</div>
                <div className="mt-1">Date: {selectedSlot.inGameDate}</div>
                <div className="mt-1">Playtime: {selectedSlot.playtimeLabel}</div>
                <div className="mt-1">Captured At Tick: {selectedSlot.capturedAtTick}</div>
                <div className="mt-1">Saved: {selectedSlot.lastSavedLabel}</div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                Loading restores the shared snapshot directly into the existing in-game panel shell. Manual saves,
                quick saves, and safe deletion all use the same browser-local storage namespace.
              </div>
            </div>
          ) : selectedSlot?.status === 'corrupt' ? (
            <div className="space-y-4">
              <div className="rounded-[20px] border border-rose-300/20 bg-rose-200/10 p-4 text-sm leading-6 text-rose-100">
                This slot contains malformed local data. It is intentionally isolated from the rest of the menu so one
                bad record cannot block loading other saves.
              </div>
              <div className="rounded-[20px] border border-white/10 bg-black/10 p-4 text-sm leading-6 text-slate-300">
                Delete the slot from the action card to clear the bad localStorage record, or use Reset Save Data from
                the main menu to clear every save slot at once.
              </div>
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-white/10 bg-black/10 p-4 text-sm leading-6 text-slate-400">
              Select an occupied or corrupt save slot to inspect it here. Empty slots remain available for future
              campaigns.
            </div>
          )}
        </Card>
      }
    />
  );
}
