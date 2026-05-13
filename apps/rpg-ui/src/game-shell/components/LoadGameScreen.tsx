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

  if (slot.status === 'incompatible') {
    return 'Incompatible Save Data';
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
    selectedSlot?.status === 'corrupt' ||
    selectedSlot?.status === 'incompatible' ||
    selectedSlot?.hasSave === true;

  return (
    <ScreenFrame
      eyebrow="Load Game"
      title="Open A Local Save"
      description="Each save record is backed by browser localStorage using account-scoped snapshot keys. Manual saves and the dedicated quick-save slot are listed together, and unreadable entries are isolated so one bad record cannot break the whole menu."
      accent="var(--color-world)"
      notice={notice}
      onDismissNotice={onDismissNotice}
      headerActions={
        <button
          type="button"
          onClick={onBack}
          className="launcher-control px-4 py-2 text-sm"
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
                  className={`launcher-save-row w-full p-4 text-left transition ${
                    slot.id === selectedSlotId
                      ? 'is-active'
                      : ''
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{slot.label}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {getSlotStatusLabel(slot)}
                      </div>
                    </div>
                    <div className="forged-chip px-3 py-1 text-xs">
                      {slot.kind === 'quick' ? 'Quick' : slot.snapshotVersion ?? 'Manual'}
                    </div>
                  </div>

                  {slot.hasSave ? (
                    <div className="mt-3 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                      <div className="text-base text-slate-50">{slot.playerName}</div>
                      <div>{slot.lastSavedLabel}</div>
                      <div>
                        {slot.lineageLabel} | {slot.backstoryLabel ?? slot.classLabel ?? 'Classless'}
                      </div>
                      <div>{slot.startingBundleLabel ?? 'No starter bundle recorded'}</div>
                      <div>{slot.settlementLabel ?? slot.regionLabel}</div>
                      <div>Level {slot.level}</div>
                      <div>{slot.inGameDate}</div>
                      <div>{slot.playtimeLabel}</div>
                      <div>Tick {slot.capturedAtTick}</div>
                    </div>
                  ) : slot.status === 'corrupt' ? (
                    <div className="mt-3 rounded-lg border border-[color:var(--color-tone-danger-border)] bg-[color:var(--color-tone-danger-bg)] px-3 py-3 text-sm text-[color:var(--color-tone-danger-text)]">
                      This slot contains malformed or incompatible local data. It cannot be loaded until it is deleted.
                    </div>
                  ) : slot.status === 'incompatible' ? (
                    <div className="mt-3 rounded-lg border border-[color:var(--color-tone-warning-border)] bg-[color:var(--color-tone-warning-bg)] px-3 py-3 text-sm text-[color:var(--color-tone-warning-text)]">
                      This slot was created before the account-scoped Legacy ledger and current snapshot revision, so it is intentionally marked incompatible.
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
                <div className="forged-subpanel p-4 text-sm text-slate-400">
                  No loadable local saves were found. Start a new game or create a quick save from an active campaign.
                </div>
              )}

              <button
                type="button"
                onClick={onLoadSelected}
                disabled={!selectedSlot?.hasSave}
                className="launcher-control forged-tone-accent w-full px-5 py-4 text-left disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="block text-lg font-semibold">Load Selected Save</span>
                <span className="mt-1 block text-sm text-[color:var(--color-text-secondary)]">
                  {selectedSlot?.hasSave
                    ? `Continue ${selectedSlot.playerName} from ${selectedSlot.label}.`
                    : 'Choose an occupied slot to continue.'}
                </span>
              </button>

              {canDeleteSelected && selectedSlot && pendingDeleteSlotId === selectedSlot.id ? (
                <div className="forged-subpanel border-[color:var(--color-tone-danger-border)] bg-[color:var(--color-tone-danger-bg)] p-4">
                  <div className="text-sm leading-6 text-[color:var(--color-tone-danger-text)]">
                    {selectedSlot.status === 'corrupt'
                      ? `Delete the unreadable data stored in ${selectedSlot.label}?`
                      : selectedSlot.status === 'incompatible'
                        ? `Delete the incompatible data stored in ${selectedSlot.label}?`
                      : `Delete ${selectedSlot.playerName} from ${selectedSlot.label}?`}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPendingDeleteSlotId(null);
                        onDeleteSlot(selectedSlot.id);
                      }}
                      className="launcher-control forged-tone-danger px-4 py-2 text-sm"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteSlotId(null)}
                      className="launcher-control px-4 py-2 text-sm"
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
                  className="launcher-control forged-tone-danger w-full px-5 py-4 text-left disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="block text-lg font-semibold">
                    {selectedSlot?.status === 'corrupt'
                      ? 'Delete Corrupt Entry'
                      : selectedSlot?.status === 'incompatible'
                        ? 'Delete Incompatible Save'
                        : 'Delete Selected Save'}
                  </span>
                  <span className="mt-1 block text-sm text-[color:var(--color-text-secondary)]">
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

              <div className="forged-subpanel p-4 text-sm text-slate-300">
                <div>Slot: {selectedSlot.label}</div>
                <div className="mt-1">Type: {selectedSlot.kind === 'quick' ? 'Quick Save' : 'Manual Save'}</div>
                <div className="mt-1">Lineage: {selectedSlot.lineageLabel}</div>
                <div className="mt-1">Backstory: {selectedSlot.backstoryLabel ?? selectedSlot.classLabel ?? 'Unrecorded'}</div>
                <div className="mt-1">Bundle: {selectedSlot.startingBundleLabel ?? 'Unrecorded'}</div>
                <div className="mt-1">Level: {selectedSlot.level}</div>
                <div className="mt-1">Region: {selectedSlot.regionLabel}</div>
                <div className="mt-1">Settlement: {selectedSlot.settlementLabel}</div>
                <div className="mt-1">Date: {selectedSlot.inGameDate}</div>
                <div className="mt-1">Playtime: {selectedSlot.playtimeLabel}</div>
                <div className="mt-1">Captured At Tick: {selectedSlot.capturedAtTick}</div>
                <div className="mt-1">Saved: {selectedSlot.lastSavedLabel}</div>
              </div>

              <div className="forged-subpanel p-4 text-sm leading-6 text-slate-300">
                Loading restores the shared snapshot directly into the existing in-game panel shell. Manual saves,
                quick saves, and safe deletion all use the same browser-local storage namespace.
              </div>
            </div>
          ) : selectedSlot?.status === 'corrupt' ? (
            <div className="space-y-4">
              <div className="forged-subpanel border-[color:var(--color-tone-danger-border)] bg-[color:var(--color-tone-danger-bg)] p-4 text-sm leading-6 text-[color:var(--color-tone-danger-text)]">
                This slot contains malformed local data. It is intentionally isolated from the rest of the menu so one
                bad record cannot block loading other saves.
              </div>
              <div className="forged-subpanel p-4 text-sm leading-6 text-slate-300">
                Delete the slot from the action card to clear the bad localStorage record, or use Reset Save Data from
                the main menu to clear every save slot at once.
              </div>
            </div>
          ) : selectedSlot?.status === 'incompatible' ? (
            <div className="space-y-4">
              <div className="forged-subpanel border-[color:var(--color-tone-warning-border)] bg-[color:var(--color-tone-warning-bg)] p-4 text-sm leading-6 text-[color:var(--color-tone-warning-text)]">
                This slot belongs to an older local save format from before the account-scoped Legacy ledger and current structured snapshot revision, and it cannot be loaded by the current build.
              </div>
              <div className="forged-subpanel p-4 text-sm leading-6 text-slate-300">
                Delete the slot from the action card to clear the incompatible localStorage record, or use Reset Save Data from the main menu to clear every save slot at once.
              </div>
            </div>
          ) : (
            <div className="forged-subpanel border-dashed p-4 text-sm leading-6 text-slate-400">
              Select an occupied, incompatible, or corrupt save slot to inspect it here. Empty slots remain available for future
              campaigns.
            </div>
          )}
        </Card>
      }
    />
  );
}
