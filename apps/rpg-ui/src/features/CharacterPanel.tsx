import { useState } from 'react';
import { uiViewModel } from '../runtime/uiViewModel';
import { matchesQuery } from '../utils';
import { PanelLayout } from '../components/layout/PanelLayout';
import { Card } from '../components/ui/Card';
import { PanelDetailStack } from '../components/ui/PanelDetailStack';
import { SelectionList } from '../components/ui/SelectionList';
import { SidebarMenu } from '../components/ui/SidebarMenu';

type CharacterPanelProps = {
  accent: string;
  searchQuery: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
};

export function CharacterPanel({
  accent,
  searchQuery,
  pinnedIds,
  onTogglePin
}: CharacterPanelProps) {
  const characterData = uiViewModel.character;
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({
    attributes: characterData.lists.attributes?.[0]?.id ?? '',
    skills: characterData.lists.skills?.[0]?.id ?? '',
    inventory: characterData.lists.inventory?.[0]?.id ?? '',
    equipment: characterData.lists.equipment?.[0]?.id ?? '',
    traits: characterData.lists.traits?.[0]?.id ?? '',
    reputation: characterData.lists.reputation?.[0]?.id ?? '',
    titles: characterData.lists.titles?.[0]?.id ?? '',
    discoveries: characterData.lists.discoveries?.[0]?.id ?? ''
  });

  const listItems = characterData.lists[activeSection] ?? [];
  const filteredItems = listItems.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const selectedItem =
    filteredItems.find((item) => item.id === selectedIds[activeSection]) ?? filteredItems[0];
  const windowDetail = characterData.windowDetails[activeSection];
  const primaryDetail =
    activeSection === 'overview'
      ? characterData.overviewDetail
      : selectedItem
        ? {
            title: selectedItem.detailTitle ?? selectedItem.title,
            summary: selectedItem.detailSummary ?? 'No detail available.',
            groups: selectedItem.detailGroups ?? []
          }
        : undefined;

  const overviewMain = (
    <div className="panel-scroll h-full space-y-4 overflow-auto">
      <Card title="Progression Snapshot" accent={accent}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {characterData.overviewMetrics.map((metric) => (
            <div key={metric.id} className="rounded-[22px] border border-white/8 bg-black/10 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {metric.label}
              </div>
              <div className="mt-2 text-2xl text-slate-50">{metric.value}</div>
              <div className="mt-2 text-sm text-slate-400">{metric.detail}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Core Stats" accent={accent}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {characterData.coreStats.map((metric) => (
            <div key={metric.id} className="rounded-[22px] border border-white/8 bg-black/10 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {metric.label}
              </div>
              <div className="mt-2 text-2xl text-slate-50">{metric.value}</div>
              <div className="mt-2 text-sm text-slate-400">{metric.detail}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Active Effects" accent={accent}>
          <div className="flex flex-wrap gap-2">
            {characterData.activeEffects.map((effect) => (
              <span
                key={effect}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
              >
                {effect}
              </span>
            ))}
          </div>
        </Card>
        <Card title="Role Tags" accent={accent}>
          <div className="flex flex-wrap gap-2">
            {characterData.roleTags.map((role) => (
              <span
                key={role}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
              >
                {role}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <PanelLayout
      leftSidebar={
        <SidebarMenu
          title="Character"
          items={characterData.sections}
          activeId={activeSection}
          onChange={setActiveSection}
          accent={accent}
        />
      }
      mainContent={
        activeSection === 'overview' ? (
          overviewMain
        ) : (
          <SelectionList
            title={characterData.sections.find((section) => section.id === activeSection)?.label ?? 'Character'}
            items={filteredItems}
            selectedId={selectedItem?.id}
            onSelect={(id) =>
              setSelectedIds((current) => ({
                ...current,
                [activeSection]: id
              }))
            }
            pinnedIds={pinnedIds}
            onTogglePin={onTogglePin}
            accent={accent}
            emptyMessage="No character records match the active search."
          />
        )
      }
      detailPanel={
        <PanelDetailStack
          accent={accent}
          primary={primaryDetail}
          sectionDetail={windowDetail}
          emptyTitle="Details"
          emptyMessage="Choose a character record to inspect."
        />
      }
    />
  );
}
