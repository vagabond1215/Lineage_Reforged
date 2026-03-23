import type { CSSProperties } from 'react';
import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { SideNav } from './components/SideNav';
import { TopStatusBar } from './components/TopStatusBar';
import { ActivityPanel } from './features/ActivityPanel';
import { CharacterPanel } from './features/CharacterPanel';
import { ChroniclePanel } from './features/ChroniclePanel';
import { CodexPanel } from './features/CodexPanel';
import { QuestsPanel } from './features/QuestsPanel';
import { WorldPanel } from './features/WorldPanel';
import { uiViewModel } from './runtime/uiViewModel';
import type { TabId } from './types';

const PIN_STORAGE_KEY = 'cataclysm-rpg-ui-pins';

function readStoredPins(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(PIN_STORAGE_KEY);

    return stored ? (JSON.parse(stored) as string[]) : uiViewModel.initialPinnedIds;
  } catch {
    return uiViewModel.initialPinnedIds;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('character');
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => readStoredPins());
  const deferredSearch = useDeferredValue(searchQuery);

  useEffect(() => {
    window.localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  const activeNav = uiViewModel.navItems.find((item) => item.id === activeTab) ?? uiViewModel.navItems[0]!;
  const accent = activeNav.accent;

  const sharedPanelProps = {
    accent,
    searchQuery: deferredSearch,
    pinnedIds,
    onTogglePin: (id: string) =>
      setPinnedIds((current) =>
        current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
      )
  };

  let activePanel = <CharacterPanel {...sharedPanelProps} />;

  if (activeTab === 'world') {
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
    <div style={{ '--tab-accent': accent } as CSSProperties}>
      <AppLayout
        topBar={
          <TopStatusBar
            {...uiViewModel.topBar}
            meters={uiViewModel.topBarMeters}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            notifications={uiViewModel.notifications}
          />
        }
        sideNav={
          <SideNav
            items={uiViewModel.navItems}
            activeTab={activeTab}
            onChange={(tab) =>
              startTransition(() => {
                setActiveTab(tab);
              })
            }
          />
        }
        activePanel={activePanel}
      />
    </div>
  );
}
