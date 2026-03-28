import type { CSSProperties } from 'react';
import { startTransition, useState } from 'react';
import type { SaveSnapshot } from '../../../../packages/shared/types/src/index.js';
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
  snapshot: SaveSnapshot;
  slots: SaveSlotSummary[];
  activeSlotId: SaveSlotId;
  hasUnsavedChanges: boolean;
  notice: GameShellNotice | null;
  onDismissNotice: () => void;
  onSnapshotChange: (snapshot: SaveSnapshot) => void;
  onSave: () => void;
  onQuickSave: () => void;
  onReturnToMainMenu: () => void;
};

type InGameShellContentProps = Omit<InGameShellProps, 'snapshot' | 'onSnapshotChange'>;

function InGameShellContent({
  slots,
  activeSlotId,
  hasUnsavedChanges,
  notice,
  onDismissNotice,
  onSave,
  onQuickSave,
  onReturnToMainMenu
}: InGameShellContentProps) {
  const [activeTab, setActiveTab] = useState<TabId | null>('character');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { snapshot, uiViewModel, updateSnapshot } = useGameSession();
  const activeSlot = slots.find((slot) => slot.id === activeSlotId) ?? null;
  const quickSaveSlot = slots.find((slot) => slot.kind === 'quick') ?? null;
  const pinnedIds = snapshot.sessionState.pinnedRecordIds;
  const trackedQuestEntry =
    snapshot.sessionState.questJournal.find((entry) => entry.id === snapshot.sessionState.trackedQuestId) ??
    null;
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

      updateSnapshot({
        ...snapshot,
        sessionState: {
          ...snapshot.sessionState,
          pinnedRecordIds: nextPinnedIds
        }
      });
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

  return (
    <div className="h-screen overflow-hidden" style={{ '--tab-accent': accent } as CSSProperties}>
      <AppLayout
        topBar={
          <>
            <TopStatusBar
              {...uiViewModel.topBar}
              trackedQuestDetail={
                trackedQuestEntry
                  ? {
                      summary: trackedQuestEntry.summary,
                      objectives: trackedQuestEntry.objectives,
                      relatedLocations: trackedQuestEntry.relatedLocations
                    }
                  : null
              }
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
                  onReturnToMainMenu={onReturnToMainMenu}
                  embedded
                />
              }
            />
            {notice && (
              <div className="px-4 pt-4">
                <NoticeBanner notice={notice} onDismiss={onDismissNotice} />
              </div>
            )}
          </>
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
    </div>
  );
}

export function InGameShell({
  snapshot,
  slots,
  activeSlotId,
  hasUnsavedChanges,
  notice,
  onDismissNotice,
  onSnapshotChange,
  onSave,
  onQuickSave,
  onReturnToMainMenu
}: InGameShellProps) {
  return (
    <GameSessionProvider snapshot={snapshot} onSnapshotChange={onSnapshotChange}>
      <InGameShellContent
        slots={slots}
        activeSlotId={activeSlotId}
        hasUnsavedChanges={hasUnsavedChanges}
        notice={notice}
        onDismissNotice={onDismissNotice}
        onSave={onSave}
        onQuickSave={onQuickSave}
        onReturnToMainMenu={onReturnToMainMenu}
      />
    </GameSessionProvider>
  );
}
