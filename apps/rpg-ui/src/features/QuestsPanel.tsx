import { useState } from 'react';
import { useUiViewModel } from '../runtime/UiViewModelContext';
import { matchesQuery } from '../utils';
import { PanelLayout } from '../components/layout/PanelLayout';
import { Card } from '../components/ui/Card';
import { PanelDetailStack } from '../components/ui/PanelDetailStack';
import { SelectionList } from '../components/ui/SelectionList';
import { SidebarMenu } from '../components/ui/SidebarMenu';
import { useGameSession } from '../runtime/GameSessionContext';
import { GameActionButton } from '../game-shell/components/GameActionButton';
import { PanelNotice } from '../game-shell/components/PanelNotice';
import {
  acceptQuest,
  getQuestCommandState,
  toggleTrackedQuest,
  turnInQuest
} from '../game-shell/gameplayLoop';
import type { GameShellNotice } from '../game-shell/state';

type QuestsPanelProps = {
  accent: string;
  searchQuery: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
};

export function QuestsPanel({ accent, searchQuery, pinnedIds, onTogglePin }: QuestsPanelProps) {
  const questData = useUiViewModel().quests;
  const { snapshot, updateSnapshot } = useGameSession();
  const [activeSection, setActiveSection] = useState('active');
  const [selectedId, setSelectedId] = useState(questData.entries[0]?.id ?? '');
  const [panelNotice, setPanelNotice] = useState<GameShellNotice | null>(null);

  const filteredItems = questData.entries.filter((item) => {
    const sectionMatches =
      activeSection === 'tracked'
        ? item.status?.toLowerCase().includes('tracked')
        : item.category === activeSection;

    return sectionMatches && matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary);
  });
  const selectedItem = filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];
  const questCommandState = selectedItem ? getQuestCommandState(snapshot, selectedItem.id) : null;
  const isTrackedQuest = selectedItem ? snapshot.sessionState.trackedQuestId === selectedItem.id : false;
  const windowDetail = questData.windowDetails[activeSection];
  const primaryDetail = selectedItem
    ? {
        title: selectedItem.detailTitle ?? selectedItem.title,
        summary: selectedItem.detailSummary ?? 'No detail available.',
        groups: selectedItem.detailGroups ?? []
      }
    : undefined;

  return (
    <PanelLayout
      leftSidebar={
        <SidebarMenu
          title="Quests"
          items={questData.sections}
          activeId={activeSection}
          onChange={setActiveSection}
          accent={accent}
        />
      }
      mainContent={
        <div className="panel-scroll h-full space-y-4 overflow-auto">
          <Card title="Quest Overview" accent={accent}>
            <div className="grid gap-3 md:grid-cols-3">
              {questData.overviewMetrics.map((metric) => (
                <div key={metric.id} className="rounded-[22px] border border-white/8 bg-black/10 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{metric.label}</div>
                  <div className="mt-2 text-2xl text-slate-50">{metric.value}</div>
                  <div className="mt-2 text-sm text-slate-400">{metric.detail}</div>
                </div>
              ))}
            </div>
          </Card>
          {panelNotice && <PanelNotice notice={panelNotice} />}
          <Card title="Quest Commands" accent={accent}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2 text-sm text-slate-300">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Selected Quest</span>
                  <div className="mt-1 text-base text-slate-50">{selectedItem?.title ?? 'No quest selected'}</div>
                </div>
                <div className="text-slate-400">
                  {questCommandState?.nextStep ?? 'Select a quest or contract to review next-step guidance.'}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <GameActionButton
                  label="Accept Contract"
                  tone="accent"
                  disabled={!selectedItem || !questCommandState?.canAccept}
                  onClick={() => {
                    if (!selectedItem) {
                      return;
                    }

                    const result = acceptQuest(snapshot, selectedItem.id);
                    if (result.accepted) {
                      updateSnapshot(result.snapshot);
                      setActiveSection('active');
                    }
                    setPanelNotice(result.notice);
                  }}
                />
                <GameActionButton
                  label={isTrackedQuest ? 'Untrack Quest' : 'Track Quest'}
                  disabled={!selectedItem || !questCommandState?.canTrack}
                  onClick={() => {
                    if (!selectedItem) {
                      return;
                    }

                    const result = toggleTrackedQuest(snapshot, selectedItem.id);
                    updateSnapshot(result.snapshot);
                    setPanelNotice(result.notice);
                  }}
                />
                <GameActionButton
                  label="Turn In Quest"
                  tone="warning"
                  disabled={!selectedItem || !questCommandState?.canTurnIn}
                  onClick={() => {
                    if (!selectedItem) {
                      return;
                    }

                    const result = turnInQuest(snapshot, selectedItem.id);
                    updateSnapshot(result.snapshot);
                    setActiveSection('completed');
                    setPanelNotice(result.notice);
                  }}
                />
              </div>
            </div>
          </Card>
          <SelectionList
            title={questData.sections.find((section) => section.id === activeSection)?.label ?? 'Quests'}
            items={filteredItems}
            selectedId={selectedItem?.id}
            onSelect={setSelectedId}
            pinnedIds={pinnedIds}
            onTogglePin={onTogglePin}
            accent={accent}
            emptyMessage="No quests match the active search."
          />
        </div>
      }
      detailPanel={
        <PanelDetailStack
          accent={accent}
          primary={primaryDetail}
          sectionDetail={windowDetail}
          emptyTitle="Details"
          emptyMessage="Choose a quest to inspect objectives and rewards."
        />
      }
    />
  );
}
