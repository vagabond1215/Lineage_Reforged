import { useState } from 'react';
import { useUiViewModel } from '../runtime/UiViewModelContext';
import { matchesQuery } from '../utils';
import { PanelLayout } from '../components/layout/PanelLayout';
import { Card } from '../components/ui/Card';
import { PanelDetailStack } from '../components/ui/PanelDetailStack';
import { OperationsQueue } from '../components/ui/OperationsQueue';
import { SelectionList } from '../components/ui/SelectionList';
import { SidebarMenu } from '../components/ui/SidebarMenu';
import { useGameSession } from '../runtime/GameSessionContext';
import { GameActionButton } from '../game-shell/components/GameActionButton';
import { PanelNotice } from '../game-shell/components/PanelNotice';
import {
  advanceCurrentActivity,
  getCurrentLocationLabel,
  restAtCurrentSettlement,
  setCurrentActivityFromRecord
} from '../game-shell/gameplayLoop';
import type { GameShellNotice } from '../game-shell/state';

type ActivityPanelProps = {
  accent: string;
  searchQuery: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
};

export function ActivityPanel({
  accent,
  searchQuery,
  pinnedIds,
  onTogglePin
}: ActivityPanelProps) {
  const activityData = useUiViewModel().activity;
  const { snapshot, updateSnapshot } = useGameSession();
  const [activeSection, setActiveSection] = useState('employment');
  const [selectedIds, setSelectedIds] = useState<Record<string, string>>({
    employment: activityData.lists.employment?.[0]?.id ?? '',
    businesses: activityData.lists.businesses?.[0]?.id ?? '',
    crafting: activityData.lists.crafting?.[0]?.id ?? '',
    trade: activityData.lists.trade?.[0]?.id ?? '',
    contracts: activityData.lists.contracts?.[0]?.id ?? '',
    military: activityData.lists.military?.[0]?.id ?? '',
    naval: activityData.lists.naval?.[0]?.id ?? '',
    operations: activityData.lists.operations?.[0]?.id ?? ''
  });
  const [panelNotice, setPanelNotice] = useState<GameShellNotice | null>(null);

  const listItems = activityData.lists[activeSection] ?? [];
  const filteredItems = listItems.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const selectedItem =
    filteredItems.find((item) => item.id === selectedIds[activeSection]) ?? filteredItems[0];
  const currentLocationLabel = getCurrentLocationLabel(snapshot);
  const windowDetail = activityData.windowDetails[activeSection];
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
          title="Activity"
          items={activityData.sections}
          activeId={activeSection}
          onChange={setActiveSection}
          accent={accent}
        />
      }
      mainContent={
        <div className="panel-scroll h-full space-y-4 overflow-auto">
          <Card title="System Overview" accent={accent}>
            <div className="grid gap-3 md:grid-cols-3">
              {activityData.metrics.map((metric) => (
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
          {panelNotice && <PanelNotice notice={panelNotice} />}
          <Card title="Active Shift Controls" accent={accent}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2 text-sm text-slate-300">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Current Activity</span>
                  <div className="mt-1 text-base text-slate-50">
                    {snapshot.sessionState.currentActivity?.label ?? 'No active process'}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Current Location</span>
                  <div className="mt-1 text-base text-slate-50">{currentLocationLabel}</div>
                </div>
                <div className="text-slate-400">
                  {selectedItem?.detailSummary ?? 'Select a job, contract, or operation to set focus before advancing time.'}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <GameActionButton
                  label="Set Current Activity"
                  onClick={() => {
                    if (!selectedItem) {
                      return;
                    }

                    const result = setCurrentActivityFromRecord(snapshot, selectedItem.id);
                    updateSnapshot(result.snapshot);
                    setPanelNotice(result.notice);
                  }}
                  disabled={!selectedItem}
                />
                <GameActionButton
                  label="Advance Shift"
                  tone="accent"
                  onClick={() => {
                    const result = advanceCurrentActivity(snapshot);
                    updateSnapshot(result.snapshot);
                    setPanelNotice(result.notice);
                  }}
                />
                <GameActionButton
                  label="Rest"
                  tone="warning"
                  onClick={() => {
                    const result = restAtCurrentSettlement(snapshot);
                    updateSnapshot(result.snapshot);
                    setPanelNotice(result.notice);
                  }}
                />
              </div>
            </div>
          </Card>
          <SelectionList
            title={activityData.sections.find((section) => section.id === activeSection)?.label ?? 'Activity'}
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
            emptyMessage="No activities match the active search."
          />
          <OperationsQueue items={activityData.operationsQueue} accent={accent} />
        </div>
      }
      detailPanel={
        <PanelDetailStack
          accent={accent}
          primary={primaryDetail}
          sectionDetail={windowDetail}
          emptyTitle="Details"
          emptyMessage="Select an operation, business, or job to inspect."
        />
      }
    />
  );
}
