import { useMemo, useState } from 'react';
import type { AccountProfileState } from '../../../../../packages/shared/types/src/index.js';
import { Icon } from '../../components/icons';
import type { AccountMetaSectionId } from '../accountMetaPresentation.js';
import { AccountMetaPanel } from './AccountMetaPanel.js';
import { AppShell, SidebarNav } from './AppShell.js';
import {
  getSaveSlotLabel,
  MANUAL_SAVE_SLOTS_PER_PAGE,
  type GameShellNotice,
  type ManualSaveSlotId,
  type SaveSlotSummary
} from '../state.js';
import { LauncherSpriteClock } from './LauncherSpriteClock.js';
import { NoticeBanner } from './NoticeBanner.js';
import { ShellBrandLogo } from './ShellBrandLogo.js';

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
  onPurchaseLegacyUnlock: (unlockId: string) => void;
  onSelectLegacyPreparation: (unlockId: string) => void;
  onSetLegacyPreparationChoice: (unlockId: string, choiceId: string) => void;
  onRemoveLegacyPreparation: (unlockId: string) => void;
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

function formatSlotNumberLabel(slotId: ManualSaveSlotId): string {
  return getSaveSlotLabel(slotId).replace(/^Slot\s+/, '');
}

function formatOrdinalDay(day: number): string {
  const absoluteDay = Math.trunc(Math.abs(day));
  const lastTwoDigits = absoluteDay % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${day}th`;
  }

  switch (absoluteDay % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

function formatInGameDateLabel(inGameDate: string | null): string {
  if (!inGameDate) {
    return 'Saved record';
  }

  const match = inGameDate.match(/^(\d{1,2})\s+(.+),\s*Year\s+(\d+)$/);

  if (!match) {
    return inGameDate;
  }

  const [, dayValue, monthLabel, yearValue] = match;
  const day = Number.parseInt(dayValue ?? '', 10);

  if (Number.isNaN(day)) {
    return inGameDate;
  }

  return `${formatOrdinalDay(day)} of ${monthLabel}, Year ${yearValue}`;
}

function formatCharacterSummaryLine(slot: SaveSlotSummary): string {
  const levelLabel = `Level ${slot.level ?? '?'}`;
  const sexLabel = slot.sexLabel ?? 'Unknown';
  const lineageLabel = slot.lineageLabel ?? 'Wanderer';
  const roleLabel = slot.backstoryLabel ?? slot.classLabel ?? 'Unrecorded';
  const locationLabel =
    slot.currentLocationLabel ?? slot.settlementLabel ?? slot.regionLabel ?? 'Unknown location';
  const fundsLabel = slot.fundsLabel ?? 'Uncounted';

  return `${levelLabel} ${sexLabel} ${lineageLabel} ${roleLabel} in ${locationLabel} with ${fundsLabel}`;
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
  onPurchaseLegacyUnlock,
  onSelectLegacyPreparation,
  onSetLegacyPreparationChoice,
  onRemoveLegacyPreparation,
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
        (slot): slot is SaveSlotSummary & { id: ManualSaveSlotId } => slot.kind === 'manual'
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
    : null;
  const manualPageCount = Math.max(
    1,
    Math.ceil(manualSlots.length / MANUAL_SAVE_SLOTS_PER_PAGE)
  );
  const activePage = Math.min(currentPage, manualPageCount - 1);
  const slotPageStart = activePage * MANUAL_SAVE_SLOTS_PER_PAGE;
  const visibleSlots = manualSlots.slice(
    slotPageStart,
    slotPageStart + MANUAL_SAVE_SLOTS_PER_PAGE
  );
  const pendingDeleteSlot =
    manualSlots.find((slot) => slot.id === pendingDeleteSlotId) ?? null;
  const shellButtonClass =
    'launcher-control inline-flex h-10 items-center justify-center disabled:cursor-not-allowed disabled:opacity-45';
  const continueButtonClass = `${shellButtonClass} launcher-metal-control launcher-primary-control max-w-[22rem] px-4 text-sm font-semibold`;
  const accountMenuButtonClass =
    'w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[color:var(--color-text-strong)] transition hover:bg-[color:var(--color-surface-selected)]';
  const activePageButtonClass =
    'is-active';
  const deleteButtonClass =
    'launcher-delete-rail flex min-h-[4.5rem] items-center justify-center self-stretch border-l border-[color:var(--color-border-soft)] px-2 transition';
  const deleteConfirmPanelClass =
    'launcher-menu w-full max-w-md p-6';
  const deleteConfirmActionClass =
    'launcher-control forged-tone-danger px-4 py-2 text-sm';

  const shellSubBar =
    activeSection === 'characters' ? (
      <div className="flex h-9 w-full items-center justify-end gap-2">
          {Array.from({ length: manualPageCount }, (_, pageIndex) => {
            const pageLabelStart = pageIndex * MANUAL_SAVE_SLOTS_PER_PAGE + 1;
            const pageLabelEnd = pageLabelStart + MANUAL_SAVE_SLOTS_PER_PAGE - 1;
            const active = activePage === pageIndex;

            return (
              <button
                key={`page.${pageIndex}`}
                type="button"
                onClick={() => setCurrentPage(pageIndex)}
                className={`launcher-control launcher-metal-control launcher-page-control inline-flex h-9 w-9 items-center justify-center rounded-md border text-base font-semibold transition ${
                  active
                    ? activePageButtonClass
                    : ''
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
    ) : (
      <div className="h-9" aria-hidden="true" />
    );

  return (
    <>
      <AppShell
        brand={
          <ShellBrandLogo />
        }
        centerActions={continueLabel ? (
          <button
            type="button"
            onClick={onContinue}
            className={continueButtonClass}
            title={continueLabel}
          >
            <span className="truncate">{continueLabel}</span>
          </button>
        ) : null}
        accountControls={
          <div className="relative flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAccountMenuOpen((open) => !open)}
              className="launcher-control launcher-metal-control launcher-account-control inline-flex h-10 max-w-[14rem] items-center justify-center truncate px-3 text-sm font-medium"
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              title={accountProfile.displayName}
            >
              <span className="truncate">{accountProfile.displayName}</span>
            </button>
            <LauncherSpriteClock clockLabel={clockLabel} clockTitle={clockTitle} />
            {accountMenuOpen && (
              <div
                className="launcher-menu absolute right-0 top-12 z-50 w-48 p-2"
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
                id: 'bloodlines',
                label: 'Bloodlines',
                active: activeSection === 'bloodlines',
                onSelect: () => onActiveSectionChange('bloodlines')
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
        contentInnerClassName={activeSection === 'characters' ? 'w-full p-0' : undefined}
      >
        {activeSection === 'characters' ? (
          <section aria-label="Characters" className="space-y-4">
            {visibleSlots.length > 0 && (
              <div className="launcher-save-list space-y-3">
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
                    className={`launcher-save-row group relative grid min-h-[4.5rem] overflow-hidden text-left transition ${
                      slot.hasSave
                        ? 'grid-cols-[4.25rem_minmax(0,1fr)_4.25rem]'
                        : 'is-empty grid-cols-[4.25rem_minmax(0,1fr)]'
                    }`}
                  >
                    <div className="launcher-save-index flex min-h-[4.5rem] items-center justify-center self-stretch px-1 text-[1.45rem] font-semibold tabular-nums text-[color:var(--color-text-secondary)] sm:text-[1.65rem]">
                      {formatSlotNumberLabel(slot.id)}
                    </div>

                    {slot.hasSave ? (
                      <>
                        <div className="grid min-w-0 gap-3 px-4 py-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)_minmax(0,0.85fr)]">
                          <div className="flex min-w-0 flex-col justify-center">
                            <div className="truncate text-[1.5rem] font-light leading-tight tracking-[0.08em] text-[color:var(--color-text-primary)] sm:text-[1.6875rem]">
                              {slot.playerName}
                            </div>
                            <div className="mt-1 truncate text-[1rem] text-[color:var(--color-text-muted)]">
                              {formatInGameDateLabel(slot.inGameDate)}
                            </div>
                          </div>

                          <div className="flex min-w-0 flex-col justify-center text-[1.125rem] leading-6 text-[color:var(--color-text-secondary)]">
                            <div className="launcher-save-summary-line">
                              {formatCharacterSummaryLine(slot)}
                            </div>
                          </div>

                          <div className="flex min-w-0 flex-col items-end justify-center text-right">
                            <div className="truncate text-[1rem] font-medium text-[color:var(--color-text-muted)]">
                              {formatSlotHeaderTimestamp(slot.lastSavedAt)}
                            </div>
                            <div className="mt-1 truncate text-[1.125rem] font-medium leading-6 text-[color:var(--color-text-secondary)]">
                              {slot.playtimeLabel ?? '0 ticks played'}
                            </div>
                          </div>
                        </div>

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
                          <Icon name="closeCircle" className="h-10 w-10" />
                        </button>
                      </>
                    ) : (
                      <div className="flex min-h-[4.5rem] items-center justify-center px-4 py-1">
                        <span
                          className="text-sm font-semibold uppercase tracking-[0.15em] text-[color:var(--color-text-muted)]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          Empty
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <AccountMetaPanel
            accountProfile={accountProfile}
            activeSection={activeSection}
            onPurchaseUnlock={onPurchaseLegacyUnlock}
            onSelectPreparation={onSelectLegacyPreparation}
            onSetPreparationChoice={onSetLegacyPreparationChoice}
            onRemovePreparation={onRemoveLegacyPreparation}
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
