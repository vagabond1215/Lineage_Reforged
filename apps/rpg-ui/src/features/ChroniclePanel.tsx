import { useState } from 'react';
import { uiViewModel } from '../runtime/uiViewModel';
import { matchesQuery } from '../utils';
import { PanelLayout } from '../components/layout/PanelLayout';
import { Card } from '../components/ui/Card';
import { PanelDetailStack } from '../components/ui/PanelDetailStack';
import { SelectionList } from '../components/ui/SelectionList';
import { SidebarMenu } from '../components/ui/SidebarMenu';

type ChroniclePanelProps = {
  accent: string;
  searchQuery: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
};

export function ChroniclePanel({
  accent,
  searchQuery,
  pinnedIds,
  onTogglePin
}: ChroniclePanelProps) {
  const chronicleData = uiViewModel.chronicle;
  const [activeSection, setActiveSection] = useState('all');
  const [selectedId, setSelectedId] = useState(chronicleData.entries[0]?.id ?? '');
  const latestEntry = chronicleData.entries[0];
  const recentTradeEntries = chronicleData.entries.filter((item) => item.category === 'trade').length;

  const filteredItems = chronicleData.entries.filter((item) => {
    const sectionMatches = activeSection === 'all' ? true : item.category === activeSection;
    return sectionMatches && matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary);
  });
  const selectedItem = filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0];
  const windowDetail = chronicleData.windowDetails[activeSection];
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
          title="Chronicle"
          items={chronicleData.sections}
          activeId={activeSection}
          onChange={setActiveSection}
          accent={accent}
        />
      }
      mainContent={
        <div className="panel-scroll h-full space-y-4 overflow-auto">
          <Card title="Chronological Feed" accent={accent}>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[22px] border border-white/8 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Latest Shift</div>
                <div className="mt-2 text-2xl text-slate-50">{latestEntry?.meta ?? 'Chronicle'}</div>
                <div className="mt-2 text-sm text-slate-400">{latestEntry?.detailSummary ?? 'No recent event recorded.'}</div>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Stat Impact</div>
                <div className="mt-2 text-2xl text-slate-50">{chronicleData.entries.length}</div>
                <div className="mt-2 text-sm text-slate-400">Timeline entries currently available in the session chronicle.</div>
              </div>
              <div className="rounded-[22px] border border-white/8 bg-black/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Use Case</div>
                <div className="mt-2 text-2xl text-slate-50">{recentTradeEntries} Trade</div>
                <div className="mt-2 text-sm text-slate-400">Chronicle records stay compatible with future analytics or replay tools.</div>
              </div>
            </div>
          </Card>
          <SelectionList
            title={chronicleData.sections.find((section) => section.id === activeSection)?.label ?? 'Chronicle'}
            items={filteredItems}
            selectedId={selectedItem?.id}
            onSelect={setSelectedId}
            pinnedIds={pinnedIds}
            onTogglePin={onTogglePin}
            accent={accent}
            emptyMessage="No chronicle entries match the active search."
          />
        </div>
      }
      detailPanel={
        <PanelDetailStack
          accent={accent}
          primary={primaryDetail}
          sectionDetail={windowDetail}
          emptyTitle="Details"
          emptyMessage="Choose a chronicle entry to inspect event outcomes."
        />
      }
    />
  );
}
