import { useMemo, useState } from 'react';
import type { AccountProfileState } from '../../../../../packages/shared/types/src/index.js';
import { Icon } from '../../components/icons';
import type { AccountMetaSectionId } from '../accountMetaPresentation.js';
import { AccountMetaPanel } from './AccountMetaPanel.js';
import { AppShell, SidebarNav } from './AppShell.js';
import {
  MANUAL_SAVE_SLOTS_PER_PAGE,
  type GameShellNotice,
  type ManualSaveSlotId,
  type SaveSlotSummary
} from '../state.js';
import { NoticeBanner } from './NoticeBanner.js';

export type LauncherSectionId = 'characters' | AccountMetaSectionId;

type MainMenuScreenProps = {
  accountProfile: AccountProfileState;
  slots: SaveSlotSummary[];
  notice: GameShellNotice | null;
  onDismissNotice: () => void;
  onActivateSlot: (slotId: ManualSaveSlotId) => void;
  onDeleteSlot: (slotId: ManualSaveSlotId) => void;
  onContinue: () => void;
  onOpenSettings: () => void;
  activeSection: LauncherSectionId;
  onActiveSectionChange: (section: LauncherSectionId) => void;
  onLogout: () => void;
  onExit: () => void;
  clockLabel: string;
  clockTitle: string;
};

function formatPossessiveName(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    return 'the next hero\'s';
  }

  return trimmed.endsWith('s') ? `${trimmed}'` : `${trimmed}'s`;
}

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
  accountProfile,
  slots,
  notice,
  onDismissNotice,
  onActivateSlot,
  onDeleteSlot,
  onContinue,
  onOpenSettings,
  activeSection,
  onActiveSectionChange,
  onLogout,
  onExit,
  clockLabel,
  clockTitle
}: MainMenuScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [pendingDeleteSlotId, setPendingDeleteSlotId] = useState<ManualSaveSlotId | null>(null);

  const manualSlots = useMemo(
    () =>
      slots.filter(
        (slot): slot is SaveSlotSummary & { id: ManualSaveSlotId } =>
          slot.kind === 'manual' && slot.hasSave
      ),
    [slots]
  );
  const latestSave = useMemo(
    () =>
      [...slots]
        .filter((slot) => slot.hasSave)
        .sort((left, right) => (right.lastSavedAt ?? '').localeCompare(left.lastSavedAt ?? ''))[0] ??
      null,
    [slots]
  );
  const continueLabel = latestSave?.playerName
    ? `Continue ${formatPossessiveName(latestSave.playerName)} Legacy`
    : 'Start your Legacy';
  const occupiedPageCount = Math.max(
    1,
    Math.ceil(manualSlots.length / MANUAL_SAVE_SLOTS_PER_PAGE)
  );
  const activePage = Math.min(currentPage, occupiedPageCount - 1);
  const slotPageStart = activePage * MANUAL_SAVE_SLOTS_PER_PAGE;
  const visibleSlots = manualSlots.slice(
    slotPageStart,
    slotPageStart + MANUAL_SAVE_SLOTS_PER_PAGE
  );
  const pendingDeleteSlot =
    manualSlots.find((slot) => slot.id === pendingDeleteSlotId) ?? null;
  const shellButtonClass =
    'inline-flex h-10 items-center justify-center rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-soft)] text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-strong)] disabled:cursor-not-allowed disabled:opacity-45';
  const continueButtonClass = `${shellButtonClass} max-w-[22rem] px-4 text-sm font-semibold`;
  const accountMenuButtonClass =
    'w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-soft)]';
  const activePageButtonClass =
    'border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-strong)] text-[color:var(--color-text-strong)] shadow-[0_10px_22px_rgba(15,23,42,0.14)]';
  const deleteButtonClass =
    'absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-300/30 bg-rose-200/10 text-rose-100 transition hover:bg-rose-200/20';
  const deleteConfirmPanelClass =
    'w-full max-w-md rounded-lg border border-rose-300/25 bg-[color:var(--color-panel-strong)] p-6 shadow-2xl';
  const deleteConfirmActionClass =
    'rounded-md border border-rose-300/30 bg-rose-200/10 px-4 py-2 text-sm text-rose-100 transition hover:bg-rose-200/20';

  const shellSubBar =
    activeSection === 'characters' && manualSlots.length > MANUAL_SAVE_SLOTS_PER_PAGE ? (
      <div className="flex h-9 w-full items-center justify-end">
        <div className="flex items-center gap-2">
          {Array.from({ length: occupiedPageCount }, (_, pageIndex) => {
            const pageLabelStart = pageIndex * MANUAL_SAVE_SLOTS_PER_PAGE + 1;
            const pageLabelEnd = pageLabelStart + MANUAL_SAVE_SLOTS_PER_PAGE - 1;
            const active = activePage === pageIndex;

            return (
              <button
                key={`page.${pageIndex}`}
                type="button"
                onClick={() => setCurrentPage(pageIndex)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-semibold transition ${
                  active
                    ? activePageButtonClass
                    : 'border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] text-[color:var(--color-text-strong)] hover:bg-[color:var(--color-surface-strong)]'
                }`}
                aria-label={`Show saved characters page ${pageIndex + 1}`}
                aria-pressed={active}
                title={`Saved characters ${pageLabelStart}-${pageLabelEnd}`}
              >
                {pageIndex + 1}
              </button>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="h-9" aria-hidden="true" />
    );

  return (
    <>
      <AppShell
        brand={
          <div className="truncate text-2xl font-semibold tracking-[0.04em] text-[color:var(--color-text-strong)] sm:text-3xl">
            Echoes of Legacy
          </div>
        }
        centerActions={
          <button
            type="button"
            onClick={onContinue}
            className={continueButtonClass}
            title={continueLabel}
          >
            <span className="truncate">{continueLabel}</span>
          </button>
        }
        accountControls={
          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAccountMenuOpen((open) => !open)}
              className="inline-flex h-10 max-w-[14rem] items-center justify-center truncate rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface-soft)] px-3 text-sm font-medium text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-strong)]"
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              title={accountProfile.displayName}
            >
              <span className="truncate">{accountProfile.displayName}</span>
            </button>
            <div
              className="inline-flex h-10 items-center px-1 text-sm font-medium tabular-nums text-[color:var(--color-text-strong)]"
              title={clockTitle}
            >
              {clockLabel}
            </div>
            {accountMenuOpen && (
              <div
                className="absolute right-0 top-12 z-50 w-48 rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-panel-strong)] p-2 shadow-2xl"
                role="menu"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    onOpenSettings();
                  }}
                  className={accountMenuButtonClass}
                >
                  Settings
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    onExit();
                  }}
                  className={accountMenuButtonClass}
                >
                  Exit
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    onLogout();
                  }}
                  className={`${accountMenuButtonClass} text-rose-600 dark:text-rose-100`}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        }
        sidebar={
          <SidebarNav
            label="Launcher sections"
            items={[
              {
                id: 'characters',
                label: 'Characters',
                active: activeSection === 'characters',
                onSelect: () => onActiveSectionChange('characters')
              },
              {
                id: 'legacy',
                label: 'Legacy',
                active: activeSection === 'legacy',
                onSelect: () => onActiveSectionChange('legacy')
              },
              {
                id: 'chronicles',
                label: 'Chronicles',
                active: activeSection === 'chronicles',
                onSelect: () => onActiveSectionChange('chronicles')
              },
              {
                id: 'settings',
                label: 'Settings',
                onSelect: onOpenSettings
              }
            ]}
          />
        }
        subBar={shellSubBar}
        notice={notice ? <NoticeBanner notice={notice} onDismiss={onDismissNotice} /> : null}
      >
        {activeSection === 'characters' ? (
          <section aria-label="Characters" className="space-y-4">
            {visibleSlots.length > 0 && (
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
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
                    className="group relative flex h-full min-h-[11rem] flex-col overflow-hidden rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-soft)] p-4 text-left transition hover:bg-[color:var(--color-surface-strong)]"
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPendingDeleteSlotId(slot.id);
                      }}
                      className={deleteButtonClass}
                      aria-label={`Delete ${slot.playerName ?? 'saved character'}`}
                      title="Delete save"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>

                    <div className="flex flex-1 flex-col">
                      <div className="mt-1 flex items-center justify-end pr-12">
                        <div className="whitespace-nowrap text-right text-[11px] tracking-[0.16em] text-[color:var(--color-muted-strong)]">
                          {formatSlotHeaderTimestamp(slot.lastSavedAt)}
                        </div>
                      </div>
                      <div className="mt-5 overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(1rem,1.4vw,1.32rem)] font-semibold leading-tight text-[color:var(--color-text-strong)]">
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <AccountMetaPanel
            accountProfile={accountProfile}
            activeSection={activeSection}
            showSectionNav={false}
            frameless
          />
        )}
      </AppShell>

      {pendingDeleteSlot && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-4">
          <div className={deleteConfirmPanelClass}>
            <div className="text-[11px] uppercase tracking-[0.22em] text-rose-200/75">
              Delete Save
            </div>
            <div className="mt-3 text-xl font-semibold text-[color:var(--color-text-strong)]">
              Remove {pendingDeleteSlot.playerName ?? 'saved character'}?
            </div>
            <div className="mt-3 text-sm leading-7 text-[color:var(--color-text-soft)]">
              This will erase the local save data for {pendingDeleteSlot.playerName ?? 'that character'} from this browser.
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDeleteSlotId(null)}
                className={`${shellButtonClass} px-4 py-2 text-sm`}
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
    </>
  );
}
