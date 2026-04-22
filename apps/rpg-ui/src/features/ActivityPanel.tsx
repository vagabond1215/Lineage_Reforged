import { useEffect, useMemo, useState } from 'react';
import { ActionOutcomePreview } from '../components/body-state/ActionOutcomePreview';
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
  previewAdvanceCurrentActivity,
  previewRestAtCurrentSettlement,
  restAtCurrentSettlement,
  setCurrentActivityFromRecord
} from '../game-shell/gameplayLoop';
import type { GameShellNotice } from '../game-shell/state';
import { buildActionOutcomePreview } from '../runtime/bodyStatePresentation';

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
  const { snapshot, updateSnapshot, bodyStatePresentation } = useGameSession();
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
  const [confirmAction, setConfirmAction] = useState<'advance' | 'rest' | null>(null);

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
  const advancePreview = useMemo(() => previewAdvanceCurrentActivity(snapshot), [snapshot]);
  const restPreview = useMemo(() => previewRestAtCurrentSettlement(snapshot), [snapshot]);
  const advanceOutcome = useMemo(
    () =>
      advancePreview.available && advancePreview.projectedBodyState
        ? buildActionOutcomePreview({
            current: bodyStatePresentation.snapshot,
            projectedBodyState: advancePreview.projectedBodyState,
            timeline: advancePreview.timeline,
            warningStreaks: bodyStatePresentation.warningStreaks,
            sustainedFlags: bodyStatePresentation.sustainedFlags
          })
        : null,
    [advancePreview, bodyStatePresentation]
  );
  const restOutcome = useMemo(
    () =>
      restPreview.available && restPreview.projectedBodyState
        ? buildActionOutcomePreview({
            current: bodyStatePresentation.snapshot,
            projectedBodyState: restPreview.projectedBodyState,
            timeline: restPreview.timeline,
            warningStreaks: bodyStatePresentation.warningStreaks,
            sustainedFlags: bodyStatePresentation.sustainedFlags
          })
        : null,
    [bodyStatePresentation, restPreview]
  );

  useEffect(() => {
    setConfirmAction(null);
  }, [snapshot]);

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
            <div className="space-y-4">
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
                    label={
                      advanceOutcome?.riskTier === 'risky' && confirmAction === 'advance'
                        ? 'Confirm Advance Shift'
                        : 'Advance Shift'
                    }
                    tone="accent"
                    onClick={() => {
                      if (advanceOutcome?.riskTier === 'risky' && confirmAction !== 'advance') {
                        setConfirmAction('advance');
                        return;
                      }

                      const result = advanceCurrentActivity(snapshot);
                      updateSnapshot(result.snapshot);
                      setPanelNotice(result.notice);
                    }}
                  />
                  <GameActionButton
                    label={
                      restOutcome?.riskTier === 'risky' && confirmAction === 'rest'
                        ? 'Confirm Rest'
                        : 'Rest'
                    }
                    tone="warning"
                    onClick={() => {
                      if (restOutcome?.riskTier === 'risky' && confirmAction !== 'rest') {
                        setConfirmAction('rest');
                        return;
                      }

                      const result = restAtCurrentSettlement(snapshot);
                      updateSnapshot(result.snapshot);
                      setPanelNotice(result.notice);
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {advanceOutcome ? (
                  <ActionOutcomePreview title="Advance Shift Outlook" preview={advanceOutcome} />
                ) : (
                  <div className="rounded-[22px] border border-white/8 bg-black/10 p-4 text-sm text-slate-300">
                    {advancePreview.reason ?? 'Advance Shift becomes available once the current work loop can progress.'}
                  </div>
                )}
                {restOutcome ? (
                  <ActionOutcomePreview title="Rest Outlook" preview={restOutcome} />
                ) : (
                  <div className="rounded-[22px] border border-white/8 bg-black/10 p-4 text-sm text-slate-300">
                    {restPreview.reason ?? 'Rest becomes available once a secure settlement bunk is available.'}
                  </div>
                )}
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
