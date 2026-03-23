import { useState } from 'react';
import { uiViewModel } from '../runtime/uiViewModel';
import { matchesQuery } from '../utils';
import { Icon } from '../components/icons';
import { PanelLayout } from '../components/layout/PanelLayout';
import { Card } from '../components/ui/Card';
import { PanelDetailStack } from '../components/ui/PanelDetailStack';
import { SelectionList } from '../components/ui/SelectionList';
import { SidebarMenu } from '../components/ui/SidebarMenu';

type WorldPanelProps = {
  accent: string;
  searchQuery: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
};

export function WorldPanel({ accent, searchQuery, pinnedIds, onTogglePin }: WorldPanelProps) {
  const worldData = uiViewModel.world;
  const [activeSection, setActiveSection] = useState('world-map');
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({
    'world-map': worldData.lists['world-map']?.[0]?.id ?? '',
    region: worldData.lists.region?.[0]?.id ?? '',
    settlement: worldData.lists.settlement?.[0]?.id ?? '',
    'trade-routes': worldData.lists['trade-routes']?.[0]?.id ?? '',
    travel: worldData.lists.travel?.[0]?.id ?? '',
    'local-market': worldData.lists['local-market']?.[0]?.id ?? ''
  });
  const [zoom, setZoom] = useState(1);

  const listItems = worldData.lists[activeSection] ?? [];
  const filteredItems = listItems.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const selectedItem =
    filteredItems.find((item) => item.id === selectedIds[activeSection]) ?? filteredItems[0];
  const windowDetail = worldData.windowDetails[activeSection];
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
          title="World"
          items={worldData.sections}
          activeId={activeSection}
          onChange={setActiveSection}
          accent={accent}
        />
      }
      mainContent={
        <div className="panel-scroll h-full space-y-4 overflow-auto">
          <Card
            title="World Surface"
            eyebrow="Map View"
            accent={accent}
            actions={
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((current) => Math.max(0.8, current - 0.1))}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300"
                >
                  <Icon name="minus" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((current) => Math.min(1.6, current + 0.1))}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300"
                >
                  <Icon name="plus" className="h-4 w-4" />
                </button>
              </div>
            }
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-cyan-600/10 via-slate-900 to-emerald-500/10">
              <div className="soft-grid absolute inset-0 opacity-50" />
              <div
                className="absolute inset-0 origin-center transition-transform"
                style={{ transform: `scale(${zoom})` }}
              >
                <div className="absolute left-[10%] top-[16%] h-[24%] w-[32%] rounded-[40%] bg-emerald-500/8 blur-xl" />
                <div className="absolute left-[38%] top-[26%] h-[28%] w-[42%] rounded-[42%] bg-sky-400/7 blur-2xl" />
                <div className="absolute left-[62%] top-[52%] h-[20%] w-[18%] rounded-full border border-dashed border-cyan-300/20" />

                {worldData.locations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() =>
                      setSelectedIds((current) => ({
                        ...current,
                        'world-map': location.id
                      }))
                    }
                    className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
                    style={{ left: `${location.x}%`, top: `${location.y}%` }}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                        selectedIds['world-map'] === location.id
                          ? 'border-cyan-200/40 bg-cyan-300/20 text-cyan-100'
                          : 'border-white/10 bg-slate-950/80 text-slate-300'
                      }`}
                    >
                      <Icon name="mapPin" className="h-4 w-4" />
                    </span>
                    <span className="mt-2 block rounded-full border border-white/10 bg-slate-950/90 px-2 py-1 text-[11px] text-slate-200">
                      {location.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                'Interactive map placeholder',
                'Player marker and known locations',
                'Expandable route, travel, and market overlays'
              ].map((detail) => (
                <div key={detail} className="rounded-[18px] border border-white/8 bg-black/10 px-4 py-3 text-sm text-slate-300">
                  {detail}
                </div>
              ))}
            </div>
          </Card>
          <SelectionList
            title={worldData.sections.find((section) => section.id === activeSection)?.label ?? 'World'}
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
            emptyMessage="No world records match the active search."
          />
        </div>
      }
      detailPanel={
        <PanelDetailStack
          accent={accent}
          primary={primaryDetail}
          sectionDetail={windowDetail}
          emptyTitle="Details"
          emptyMessage="Select a world record to inspect."
        />
      }
    />
  );
}
