import { useState } from 'react';
import { useUiViewModel } from '../runtime/UiViewModelContext';
import { matchesQuery } from '../utils';
import { PanelLayout } from '../components/layout/PanelLayout';
import { Card } from '../components/ui/Card';
import { PanelDetailStack } from '../components/ui/PanelDetailStack';
import { SearchInput } from '../components/ui/SearchInput';
import { SelectionList } from '../components/ui/SelectionList';
import { SidebarMenu } from '../components/ui/SidebarMenu';

type CodexPanelProps = {
  accent: string;
  searchQuery: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
};

export function CodexPanel({ accent, searchQuery, pinnedIds, onTogglePin }: CodexPanelProps) {
  const codexData = useUiViewModel().codex;
  const [activeSection, setActiveSection] = useState('flora');
  const [localSearch, setLocalSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [showDiscoveredOnly, setShowDiscoveredOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({
    flora: codexData.entries.find((item) => item.category === 'flora' && !item.locked)?.id ?? '',
    fauna: codexData.entries.find((item) => item.category === 'fauna')?.id ?? '',
    minerals: codexData.entries.find((item) => item.category === 'minerals')?.id ?? '',
    items: codexData.entries.find((item) => item.category === 'items')?.id ?? '',
    recipes: codexData.entries.find((item) => item.category === 'recipes')?.id ?? '',
    factions: codexData.entries.find((item) => item.category === 'factions')?.id ?? '',
    notes: codexData.entries.find((item) => item.category === 'notes')?.id ?? '',
    deeds: codexData.entries.find((item) => item.category === 'deeds')?.id ?? '',
    chronicles: codexData.entries.find((item) => item.category === 'chronicles')?.id ?? ''
  });

  const combinedQuery = `${searchQuery} ${localSearch}`.trim();
  const filteredItems = codexData.entries.filter((item) => {
    if (item.category !== activeSection) {
      return false;
    }

    if (showDiscoveredOnly && item.locked) {
      return false;
    }

    const regionScopedSection = !['deeds', 'chronicles'].includes(activeSection);

    if (regionScopedSection && regionFilter !== 'All Regions' && !item.tags?.includes(regionFilter)) {
      return false;
    }

    return matchesQuery(combinedQuery, item.title, item.subtitle, item.tags, item.detailSummary);
  });

  const selectedItem =
    filteredItems.find((item) => item.id === selectedIds[activeSection]) ?? filteredItems[0];
  const windowDetail = codexData.windowDetails[activeSection];
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
          title="Codex"
          items={codexData.sections}
          activeId={activeSection}
          onChange={setActiveSection}
          accent={accent}
        />
      }
      mainContent={
        <div className="panel-scroll h-full space-y-4 overflow-auto">
          <Card title="Search and Filters" accent={accent}>
            <div className="space-y-4">
              <SearchInput
                value={localSearch}
                onChange={setLocalSearch}
                placeholder="Search entries, habitats, uses, or regions"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiscoveredOnly((current) => !current)}
                  className={`rounded-full border px-3 py-2 text-sm ${
                    showDiscoveredOnly
                      ? 'border-white/20 bg-white/10 text-slate-100'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  {showDiscoveredOnly ? 'Showing discovered only' : 'Include unknown entries'}
                </button>
                {codexData.regionFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setRegionFilter(filter)}
                    className={`rounded-full border px-3 py-2 text-sm ${
                      regionFilter === filter
                        ? 'border-white/20 bg-white/10 text-slate-100'
                        : 'border-white/10 bg-white/5 text-slate-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </Card>
          <SelectionList
            title={codexData.sections.find((section) => section.id === activeSection)?.label ?? 'Codex'}
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
            emptyMessage="No codex entries match the active filters."
          />
        </div>
      }
      detailPanel={
        <PanelDetailStack
          accent={accent}
          primary={primaryDetail}
          sectionDetail={windowDetail}
          emptyTitle="Details"
          emptyMessage="Choose a codex entry to inspect."
        />
      }
    />
  );
}
