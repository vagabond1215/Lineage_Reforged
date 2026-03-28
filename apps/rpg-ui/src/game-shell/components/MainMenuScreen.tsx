import { useMemo, useState } from 'react';
import { Icon } from '../../components/icons';
import { Card } from '../../components/ui/Card';
import {
  MANUAL_SAVE_PAGE_COUNT,
  MANUAL_SAVE_SLOTS_PER_PAGE,
  type GameShellNotice,
  type ManualSaveSlotId,
  type SaveSlotSummary
} from '../state.js';
import { NoticeBanner } from './NoticeBanner.js';

type MainMenuScreenProps = {
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
  onDismissNotice: () => void;
  onActivateSlot: (slotId: ManualSaveSlotId) => void;
  onDeleteSlot: (slotId: ManualSaveSlotId) => void;
  onOpenSettings: () => void;
  onExit: () => void;
};

const circleButtonClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-soft)] text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-strong)]';

function formatGold(gold: number | null): string {
  if (gold === null) {
    return 'Uncounted';
  }

  return `${new Intl.NumberFormat('en-US').format(gold)} gold`;
}

function getSlotDateLabel(slot: SaveSlotSummary): string {
  return slot.lastSavedLabel ?? 'No save recorded';
}

export function MainMenuScreen({
  slots,
  notice,
  onDismissNotice,
  onActivateSlot,
  onDeleteSlot,
  onOpenSettings,
  onExit
}: MainMenuScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pendingDeleteSlotId, setPendingDeleteSlotId] = useState<ManualSaveSlotId | null>(null);

  const manualSlots = useMemo(
    () =>
      slots.filter(
        (slot): slot is SaveSlotSummary & { id: ManualSaveSlotId } => slot.kind === 'manual'
      ),
    [slots]
  );
  const quickSaveSlot = slots.find((slot) => slot.kind === 'quick') ?? null;
  const slotPageStart = currentPage * MANUAL_SAVE_SLOTS_PER_PAGE;
  const visibleSlots = manualSlots.slice(
    slotPageStart,
    slotPageStart + MANUAL_SAVE_SLOTS_PER_PAGE
  );
  const pendingDeleteSlot =
    manualSlots.find((slot) => slot.id === pendingDeleteSlotId) ?? null;

  return (
    <div className="h-screen overflow-auto px-4 pb-8 pt-4 sm:px-6">
      <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-5">
        <div className="sticky top-0 z-30">
          <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-panel-strong)] px-5 py-4 shadow-panel backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="text-5xl font-semibold tracking-[0.08em] text-[color:var(--color-text-strong)] sm:text-6xl">
                Cataclysm
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className={circleButtonClass}
                  aria-label="Open settings"
                  title="Settings"
                >
                  <Icon name="gear" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={onExit}
                  className={circleButtonClass}
                  aria-label="Exit"
                  title="Exit"
                >
                  <Icon name="closeCircle" className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {notice && <NoticeBanner notice={notice} onDismiss={onDismissNotice} />}

        <Card accent="var(--color-world)">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-lg font-semibold text-[color:var(--color-text-strong)]">
                  Game Data
                </div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: MANUAL_SAVE_PAGE_COUNT }, (_, pageIndex) => {
                    const pageLabelStart =
                      pageIndex * MANUAL_SAVE_SLOTS_PER_PAGE + 1;
                    const pageLabelEnd =
                      pageLabelStart + MANUAL_SAVE_SLOTS_PER_PAGE - 1;
                    const active = currentPage === pageIndex;

                    return (
                      <button
                        key={`page.${pageIndex}`}
                        type="button"
                        onClick={() => setCurrentPage(pageIndex)}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
                          active
                            ? 'border-amber-300/60 bg-amber-200/18 text-[color:var(--color-accent-contrast)] shadow-[0_0_18px_rgba(251,191,36,0.24)]'
                            : 'border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-soft)] text-[color:var(--color-text-strong)] hover:bg-[color:var(--color-surface-strong)]'
                        }`}
                        aria-label={`Show save slots ${pageLabelStart} through ${pageLabelEnd}`}
                        aria-pressed={active}
                        title={`Slots ${pageLabelStart}-${pageLabelEnd}`}
                      >
                        {pageIndex + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
              {visibleSlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => onActivateSlot(slot.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onActivateSlot(slot.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`group relative flex min-h-[20rem] h-full flex-col overflow-hidden rounded-[28px] border p-5 text-left transition ${
                    slot.hasSave
                      ? 'border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-soft)] hover:bg-[color:var(--color-surface-strong)]'
                      : 'border-dashed border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-soft)] hover:bg-[color:var(--color-surface-strong)]'
                  }`}
                >
                  {slot.hasSave && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPendingDeleteSlotId(slot.id);
                      }}
                      className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-300/25 bg-rose-200/10 text-rose-100 transition hover:bg-rose-200/20"
                      aria-label={`Delete ${slot.label}`}
                      title="Delete save"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  )}

                  <div className="flex-1 pr-14">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-muted-strong)]">
                      {slot.label}
                    </div>
                    <div className="mt-4 text-2xl font-semibold text-[color:var(--color-text-strong)]">
                      {slot.hasSave ? slot.playerName : 'New Game'}
                    </div>
                    <div className="mt-2 min-h-[48px] text-sm leading-6 text-[color:var(--color-text-soft)]">
                      {slot.hasSave
                        ? slot.settlementLabel ?? slot.regionLabel ?? 'Unknown City'
                        : 'A blank ledger awaiting a new life, a new road, and a new beginning.'}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {slot.hasSave ? (
                      <>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-3">
                            <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                              City
                            </div>
                            <div className="mt-2 text-base text-[color:var(--color-text-strong)]">
                              {slot.settlementLabel ?? slot.regionLabel ?? 'Unknown'}
                            </div>
                          </div>
                          <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-3">
                            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                              <Icon name="coin" className="h-3.5 w-3.5" />
                              Gold
                            </div>
                            <div className="mt-2 text-base text-[color:var(--color-text-strong)]">
                              {formatGold(slot.gold)}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-3">
                          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted-strong)]">
                            <Icon name="clock" className="h-3.5 w-3.5" />
                            Save File Time And Date
                          </div>
                          <div className="mt-2 text-sm leading-6 text-[color:var(--color-text-strong)]">
                            {getSlotDateLabel(slot)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-strong)] px-4 py-3 text-sm leading-6 text-[color:var(--color-text-soft)]">
                        Select this slot to begin character creation here. Any new campaign started from this card will be written back into this same save slot.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {quickSaveSlot && (
              <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-muted-strong)]">
                      Quick Save
                    </div>
                    <div className="mt-2 text-sm leading-6 text-[color:var(--color-text-soft)]">
                      {quickSaveSlot.hasSave
                        ? `${quickSaveSlot.playerName ?? 'A campaign'} also rests in the dedicated quick-save slot.`
                        : 'The dedicated quick-save slot remains reserved for in-game use.'}
                    </div>
                  </div>
                  {quickSaveSlot.hasSave && (
                    <div className="text-sm text-[color:var(--color-text-strong)]">
                      {quickSaveSlot.lastSavedLabel}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {pendingDeleteSlot && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-md rounded-[28px] border border-rose-300/20 bg-[color:var(--color-panel-strong)] p-6 shadow-2xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-rose-200/75">
              Delete Save
            </div>
            <div className="mt-3 text-xl font-semibold text-[color:var(--color-text-strong)]">
              Remove {pendingDeleteSlot.label}?
            </div>
            <div className="mt-3 text-sm leading-7 text-[color:var(--color-text-soft)]">
              This will erase the local save data for {pendingDeleteSlot.playerName ?? pendingDeleteSlot.label} from this browser.
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteSlotId(null)}
                className="rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-soft)] px-4 py-2 text-sm text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-strong)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const slotId = pendingDeleteSlot.id;
                  setPendingDeleteSlotId(null);
                  onDeleteSlot(slotId);
                }}
                className="rounded-full border border-rose-300/25 bg-rose-200/10 px-4 py-2 text-sm text-rose-100 transition hover:bg-rose-200/20"
              >
                Delete Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
