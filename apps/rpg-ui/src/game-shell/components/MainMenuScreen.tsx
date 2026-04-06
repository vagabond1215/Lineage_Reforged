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
  onContinue: () => void;
  onOpenSettings: () => void;
  onExit: () => void;
  themeMode: 'dark' | 'light';
  onToggleThemeMode: () => void;
};

function formatSlotHeaderTimestamp(savedAt: string | null): string {
  if (!savedAt) {
    return 'No save';
  }

  const parsed = new Date(savedAt);

  if (Number.isNaN(parsed.valueOf())) {
    return 'Unknown save';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(parsed);
}

export function MainMenuScreen({
  slots,
  notice,
  onDismissNotice,
  onActivateSlot,
  onDeleteSlot,
  onContinue,
  onOpenSettings,
  onExit,
  themeMode,
  onToggleThemeMode
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
  const hasContinueSave = slots.some((slot) => slot.hasSave);
  const slotPageStart = currentPage * MANUAL_SAVE_SLOTS_PER_PAGE;
  const visibleSlots = manualSlots.slice(
    slotPageStart,
    slotPageStart + MANUAL_SAVE_SLOTS_PER_PAGE
  );
  const pendingDeleteSlot =
    manualSlots.find((slot) => slot.id === pendingDeleteSlotId) ?? null;
  const topBarBackground =
    themeMode === 'dark'
      ? 'linear-gradient(135deg, rgba(21, 27, 39, 0.88), rgba(10, 14, 22, 0.72)), radial-gradient(circle at top left, rgba(148, 163, 184, 0.18), transparent 36%), radial-gradient(circle at bottom right, rgba(96, 165, 250, 0.1), transparent 30%)'
      : 'linear-gradient(135deg, rgba(229, 237, 249, 0.98), rgba(211, 223, 242, 0.94)), radial-gradient(circle at top left, rgba(96, 165, 250, 0.16), transparent 38%), radial-gradient(circle at bottom right, rgba(100, 116, 139, 0.12), transparent 30%)';
  const iconButtonClass =
    themeMode === 'dark'
      ? 'inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-soft)] text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-strong)]'
      : 'inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-400/45 bg-slate-100/90 text-slate-700 shadow-[0_10px_20px_rgba(148,163,184,0.18)] transition hover:bg-slate-200/95';
  const continueButtonClass =
    themeMode === 'dark'
      ? 'inline-flex h-11 items-center justify-center rounded-full border border-slate-300/25 bg-slate-300/12 px-5 text-sm font-semibold tracking-[0.04em] text-slate-100 transition hover:bg-slate-300/18 disabled:cursor-not-allowed disabled:opacity-45'
      : 'inline-flex h-11 items-center justify-center rounded-full border border-slate-500/45 bg-slate-100/92 px-5 text-sm font-semibold tracking-[0.04em] text-slate-700 shadow-[0_12px_24px_rgba(148,163,184,0.18)] transition hover:bg-slate-200/96 disabled:cursor-not-allowed disabled:opacity-45';
  const activePageButtonClass =
    themeMode === 'dark'
      ? 'border-slate-300/45 bg-slate-300/22 text-slate-50 shadow-[0_0_18px_rgba(148,163,184,0.24)]'
      : 'border-slate-700/70 bg-slate-600/95 text-slate-50 shadow-[0_12px_24px_rgba(71,85,105,0.3)]';
  const deleteButtonClass =
    themeMode === 'dark'
      ? 'absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-300/25 bg-rose-200/10 text-rose-100 transition hover:bg-rose-200/20'
      : 'absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-400/35 bg-rose-100/80 text-rose-600 shadow-[0_10px_18px_rgba(251,113,133,0.16)] transition hover:bg-rose-200/85';
  const deleteConfirmPanelClass =
    themeMode === 'dark'
      ? 'w-full max-w-md rounded-[28px] border border-rose-300/20 bg-[color:var(--color-panel-strong)] p-6 shadow-2xl'
      : 'w-full max-w-md rounded-[28px] border border-rose-300/30 bg-[color:var(--color-panel-strong)] p-6 shadow-[0_28px_48px_rgba(15,23,42,0.18)]';
  const deleteConfirmEyebrowClass =
    themeMode === 'dark'
      ? 'text-[11px] uppercase tracking-[0.22em] text-rose-200/75'
      : 'text-[11px] uppercase tracking-[0.22em] text-rose-600/75';
  const deleteConfirmActionClass =
    themeMode === 'dark'
      ? 'rounded-full border border-rose-300/25 bg-rose-200/10 px-4 py-2 text-sm text-rose-100 transition hover:bg-rose-200/20'
      : 'rounded-full border border-rose-400/35 bg-rose-100/80 px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-200/85';

  return (
    <div className="h-screen overflow-auto px-4 pb-8 pt-4 sm:px-6">
      <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-5">
        <div className="sticky top-0 z-30">
          <div
            className={`rounded-[30px] border px-5 py-3 backdrop-blur-xl ${
              themeMode === 'dark'
                ? 'border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.32)]'
                : 'border-slate-300/60 shadow-[0_18px_38px_rgba(51,65,85,0.12)]'
            }`}
            style={{ background: topBarBackground }}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
              <div className="min-w-0 justify-self-start">
                <div className="truncate text-left text-4xl font-semibold tracking-[0.08em] text-[color:var(--color-text-strong)] sm:text-5xl">
                  Cataclysm
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={onContinue}
                  disabled={!hasContinueSave}
                  className={continueButtonClass}
                  title={hasContinueSave ? 'Continue the latest campaign' : 'No save available to continue'}
                >
                  Continue
                </button>
              </div>

              <div className="flex items-center justify-self-end gap-3">
                <button
                  type="button"
                  onClick={onToggleThemeMode}
                  className={iconButtonClass}
                  aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  <Icon
                    name={themeMode === 'dark' ? 'sun' : 'moon'}
                    className="h-5 w-5"
                  />
                </button>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className={iconButtonClass}
                  aria-label="Open settings"
                  title="Settings"
                >
                  <Icon name="gear" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={onExit}
                  className={iconButtonClass}
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
                            ? activePageButtonClass
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
                  className={`group relative flex min-h-[12rem] h-full flex-col overflow-hidden rounded-[28px] border p-5 text-left transition ${
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
                      className={deleteButtonClass}
                      aria-label={`Delete ${slot.label}`}
                      title="Delete save"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  )}

                  <div className="flex flex-1 flex-col">
                    <div className={`mt-2 flex items-center justify-between gap-4 ${slot.hasSave ? 'pr-14' : ''}`}>
                      <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-muted-strong)]">
                        {slot.label}
                      </div>
                      {slot.hasSave && (
                        <div className="whitespace-nowrap text-right text-[11px] tracking-[0.2em] text-[color:var(--color-muted-strong)]">
                          {formatSlotHeaderTimestamp(slot.lastSavedAt)}
                        </div>
                      )}
                    </div>
                    {slot.hasSave ? (
                      <>
                        <div className="mt-5 overflow-hidden text-[clamp(1rem,1.6vw,1.48rem)] font-semibold leading-tight text-[color:var(--color-text-strong)] whitespace-nowrap text-ellipsis">
                          {slot.playerName}
                        </div>
                        <div className="mt-4 space-y-2 text-[13px] leading-5 text-[color:var(--color-text-soft)]">
                          <div className="truncate">
                            Level {slot.level ?? '?'} {slot.lineageLabel ?? 'Wanderer'}{' '}
                            {slot.sexLabel ?? 'Unknown'} from{' '}
                            {slot.startingSettlementLabel ??
                              slot.settlementLabel ??
                              slot.regionLabel ??
                              'Unknown settlement'}
                          </div>
                          <div className="truncate">
                            {slot.backstoryLabel ?? slot.classLabel ?? 'Unrecorded'} in{' '}
                            {slot.currentLocationLabel ??
                              slot.settlementLabel ??
                              slot.regionLabel ??
                              'Unknown location'}{' '}
                            with {slot.fundsLabel ?? 'Uncounted'}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-1 items-center justify-center text-center text-2xl font-semibold text-[color:var(--color-text-strong)]">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {pendingDeleteSlot && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4">
          <div className={deleteConfirmPanelClass}>
            <div className={deleteConfirmEyebrowClass}>
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
                className={deleteConfirmActionClass}
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
