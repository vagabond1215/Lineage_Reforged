import type { CSSProperties } from 'react';
import { startTransition, useEffect, useRef, useState } from 'react';
import type {
  AccountProfileState,
  SaveSnapshot
} from '../../../../packages/shared/types/src/index.js';
import type {
  CampaignSessionControl
} from '../../../../packages/engines/game-engine/src/campaign-session.js';
import { SideNav } from '../components/SideNav';
import { TopStatusBar } from '../components/TopStatusBar';
import { AppLayout } from '../components/layout/AppLayout';
import { ActivityPanel } from '../features/ActivityPanel';
import { CharacterPanel } from '../features/CharacterPanel';
import { ChroniclePanel } from '../features/ChroniclePanel';
import { CodexPanel } from '../features/CodexPanel';
import { QuestsPanel } from '../features/QuestsPanel';
import { WorldPanel } from '../features/WorldPanel';
import { GameSessionProvider, useGameSession } from '../runtime/GameSessionContext';
import type { TabId } from '../types';
import { InGameSaveControls } from './components/InGameSaveControls';
import { NoticeBanner } from './components/NoticeBanner';
import type { GameShellNotice, SaveSlotId, SaveSlotSummary } from './state.js';

type InGameShellProps = {
  accountProfile: AccountProfileState;
  snapshot: SaveSnapshot;
  campaignSessionControl: CampaignSessionControl;
  slots: SaveSlotSummary[];
  activeSlotId: SaveSlotId;
  hasUnsavedChanges: boolean;
  notice: GameShellNotice | null;
  onDismissNotice: () => void;
  onSnapshotChange: (
    snapshot: SaveSnapshot,
    campaignSessionControl: CampaignSessionControl
  ) => void;
  onSave: () => void;
  onQuickSave: () => void;
  onRetireCharacter: () => void;
  onReturnToMainMenu: () => void;
};

type InGameShellContentProps = Omit<
  InGameShellProps,
  'accountProfile' | 'snapshot' | 'campaignSessionControl' | 'onSnapshotChange'
>;

export function getInGameNoticeAutoDismissMs(notice: GameShellNotice): number | null {
  const requested = notice.autoDismissMs;
  if (requested === null) return null;
  return typeof requested === 'number' && Number.isFinite(requested) && requested > 0
    ? requested
    : 8000;
}

function InGameShellContent({
  slots,
  activeSlotId,
  hasUnsavedChanges,
  notice,
  onDismissNotice,
  onSave,
  onQuickSave,
  onRetireCharacter,
  onReturnToMainMenu
}: InGameShellContentProps) {
  const [activeTab, setActiveTab] = useState<TabId | null>('character');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    snapshot,
    uiViewModel,
    updateSnapshot,
    bodyStatePresentation,
    dismissBodyStateToast
  } = useGameSession();
  const activeSlot = slots.find((slot) => slot.id === activeSlotId) ?? null;
  const quickSaveSlot = slots.find((slot) => slot.kind === 'quick') ?? null;
  const activeNotice = notice ?? bodyStatePresentation.toast;
  const dismissActiveNotice = notice ? onDismissNotice : dismissBodyStateToast;
  const dismissActiveNoticeRef = useRef(dismissActiveNotice);
  dismissActiveNoticeRef.current = dismissActiveNotice;
  const activeNoticeIdentity = notice ?? bodyStatePresentation.toastId;
  const activeNoticeDuration = activeNotice ? getInGameNoticeAutoDismissMs(activeNotice) : null;
  const pinnedIds = snapshot.sessionState.pinnedRecordIds;
  const activeNav =
    uiViewModel.navItems.find((item) => item.id === activeTab) ??
    uiViewModel.navItems[0]!;
  const accent = activeNav.accent;

  const sharedPanelProps = {
    accent,
    searchQuery: '',
    pinnedIds,
    onTogglePin: (id: string) => {
      const nextPinnedIds = pinnedIds.includes(id)
        ? pinnedIds.filter((itemId) => itemId !== id)
        : [...pinnedIds, id];

      updateSnapshot(
        {
          ...snapshot,
          sessionState: {
            ...snapshot.sessionState,
            pinnedRecordIds: nextPinnedIds
          }
        },
        {
          ownerKind: 'persisted_preference'
        }
      );
    }
  };

  let activePanel = <div className="h-full" />;

  if (activeTab === 'character') {
    activePanel = <CharacterPanel {...sharedPanelProps} />;
  } else if (activeTab === 'world') {
    activePanel = <WorldPanel {...sharedPanelProps} />;
  } else if (activeTab === 'activity') {
    activePanel = <ActivityPanel {...sharedPanelProps} />;
  } else if (activeTab === 'codex') {
    activePanel = <CodexPanel {...sharedPanelProps} />;
  } else if (activeTab === 'quests') {
    activePanel = <QuestsPanel {...sharedPanelProps} />;
  } else if (activeTab === 'chronicle') {
    activePanel = <ChroniclePanel {...sharedPanelProps} />;
  }

  useEffect(() => {
    if (!activeNoticeIdentity || activeNoticeDuration === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dismissActiveNoticeRef.current();
    }, activeNoticeDuration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeNoticeIdentity, activeNoticeDuration]);

  useEffect(() => {
    if (notice && bodyStatePresentation.toast) {
      dismissBodyStateToast();
    }
  }, [bodyStatePresentation.toast, dismissBodyStateToast, notice]);

  return (
    <div className="h-screen overflow-hidden" style={{ '--tab-accent': accent } as CSSProperties}>
      <AppLayout
        topBar={
          <TopStatusBar
            {...uiViewModel.topBar}
            readinessCard={uiViewModel.character.readinessCard}
            bodyState={bodyStatePresentation.snapshot}
            meters={uiViewModel.topBarMeters}
            notifications={uiViewModel.notifications}
            settingsOpen={settingsOpen}
            onToggleSettings={() => setSettingsOpen((current) => !current)}
            settingsContent={
              <InGameSaveControls
                activeSlot={activeSlot}
                quickSaveSlot={quickSaveSlot}
                hasUnsavedChanges={hasUnsavedChanges}
                onSave={onSave}
                onQuickSave={onQuickSave}
                onRetireCharacter={onRetireCharacter}
                onReturnToMainMenu={onReturnToMainMenu}
                embedded
              />
            }
          />
        }
        sideNav={
          <SideNav
            items={uiViewModel.navItems}
            activeTab={activeTab}
            onChange={(tab) =>
              startTransition(() => {
                setSettingsOpen(false);
                setActiveTab((current) => (current === tab ? null : tab));
              })
            }
          />
        }
        activePanel={activePanel}
      />
      {activeNotice && (
        <div
          className="pointer-events-none fixed bottom-4 right-4 z-[70] max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto"
          role={activeNotice.tone === 'danger' ? 'alert' : 'status'}
          aria-live={activeNotice.tone === 'danger' ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          <div className="pointer-events-auto">
            <NoticeBanner notice={activeNotice} onDismiss={dismissActiveNotice} />
          </div>
        </div>
      )}
    </div>
  );
}

export function InGameShell({
  accountProfile,
  snapshot,
  campaignSessionControl,
  slots,
  activeSlotId,
  hasUnsavedChanges,
  notice,
  onDismissNotice,
  onSnapshotChange,
  onSave,
  onQuickSave,
  onRetireCharacter,
  onReturnToMainMenu
}: InGameShellProps) {
  return (
    <GameSessionProvider
      accountProfile={accountProfile}
      snapshot={snapshot}
      campaignSessionControl={campaignSessionControl}
      onSnapshotChange={onSnapshotChange}
    >
      <InGameShellContent
        slots={slots}
        activeSlotId={activeSlotId}
        hasUnsavedChanges={hasUnsavedChanges}
        notice={notice}
        onDismissNotice={onDismissNotice}
        onSave={onSave}
        onQuickSave={onQuickSave}
        onRetireCharacter={onRetireCharacter}
        onReturnToMainMenu={onReturnToMainMenu}
      />
    </GameSessionProvider>
  );
}
