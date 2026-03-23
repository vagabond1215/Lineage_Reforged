import { useState } from 'react';
import { uiViewModel } from '../runtime/uiViewModel';
import { matchesQuery } from '../utils';
import { PanelLayout } from '../components/layout/PanelLayout';
import { Card } from '../components/ui/Card';
import { PanelDetailStack } from '../components/ui/PanelDetailStack';
import { SelectionList } from '../components/ui/SelectionList';
import { SidebarMenu } from '../components/ui/SidebarMenu';

type QuestsPanelProps = {
  accent: string;
  searchQuery: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
};

export function QuestsPanel({ accent, searchQuery, pinnedIds, onTogglePin }: QuestsPanelProps) {
  const questData = uiViewModel.quests;
  const [activeSection, setActiveSection] = useState('active');
  const [selectedId, setSelectedId] = useState(questData.entries[0]?.id ?? '');

  const filteredItems = questData.entries.filter((item) => {
    const sectionMatches =
      activeSection === 'tracked'
        ? item.status?.toLowerCase().includes('tracked')
        : item.category === activeSection;

    return sectionMatches && matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary);
  });
  const selectedItem = filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];
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
