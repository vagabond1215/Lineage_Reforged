import { useEffect, useMemo, useState } from 'react';
import { ActionOutcomePreview } from '../components/body-state/ActionOutcomePreview';
import { useUiViewModel } from '../runtime/UiViewModelContext';
import { matchesQuery } from '../utils';
import { Icon } from '../components/icons';
import { PanelLayout } from '../components/layout/PanelLayout';
import { Card } from '../components/ui/Card';
import { PanelDetailStack } from '../components/ui/PanelDetailStack';
import { SelectionList } from '../components/ui/SelectionList';
import { SidebarMenu } from '../components/ui/SidebarMenu';
import { useGameSession } from '../runtime/GameSessionContext';
import { GameActionButton } from '../game-shell/components/GameActionButton';
import { PanelNotice } from '../game-shell/components/PanelNotice';
import {
  getCurrentLocationLabel,
  getKnownLocationId,
  previewTravelToKnownLocation,
  travelToKnownLocation
} from '../game-shell/gameplayLoop';
import type { GameShellNotice } from '../game-shell/state';
import { buildActionOutcomePreview } from '../runtime/bodyStatePresentation';

type WorldPanelProps = {
  accent: string;
  searchQuery: string;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
};

export function WorldPanel({ accent, searchQuery, pinnedIds, onTogglePin }: WorldPanelProps) {
  const worldData = useUiViewModel().world;
  const { snapshot, updateSnapshot, bodyStatePresentation } = useGameSession();
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
  const [panelNotice, setPanelNotice] = useState<GameShellNotice | null>(null);
  const [confirmTravel, setConfirmTravel] = useState(false);

  const listItems = worldData.lists[activeSection] ?? [];
  const filteredItems = listItems.filter((item) =>
    matchesQuery(searchQuery, item.title, item.subtitle, item.tags, item.detailSummary)
  );
  const selectedItem =
    filteredItems.find((item) => item.id === selectedIds[activeSection]) ?? filteredItems[0];
  const selectedWorldLocation =
    worldData.locations.find((location) => location.id === selectedIds['world-map']) ??
    worldData.locations[0];
  const currentLocationId = getKnownLocationId(snapshot);
  const currentLocationLabel = getCurrentLocationLabel(snapshot);
  const windowDetail = worldData.windowDetails[activeSection];
  const primaryDetail = selectedItem
    ? {
        title: selectedItem.detailTitle ?? selectedItem.title,
        summary: selectedItem.detailSummary ?? 'No detail available.',
        groups: selectedItem.detailGroups ?? []
      }
    : undefined;
  const travelPreview = useMemo(
    () =>
      selectedWorldLocation
        ? previewTravelToKnownLocation(snapshot, selectedWorldLocation.id)
        : null,
    [selectedWorldLocation, snapshot]
  );
  const travelOutcome = useMemo(
    () =>
      travelPreview?.available && travelPreview.projectedBodyState
        ? buildActionOutcomePreview({
            current: bodyStatePresentation.snapshot,
            projectedBodyState: travelPreview.projectedBodyState,
            timeline: travelPreview.timeline,
            warningStreaks: bodyStatePresentation.warningStreaks,
            sustainedFlags: bodyStatePresentation.sustainedFlags
          })
        : null,
    [bodyStatePresentation, travelPreview]
  );

  useEffect(() => {
    setConfirmTravel(false);
  }, [selectedWorldLocation?.id, snapshot]);

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
                  className="forged-icon-button p-2 text-[color:var(--color-text-secondary)]"
                >
                  <Icon name="minus" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((current) => Math.min(1.6, current + 0.1))}
                  className="forged-icon-button p-2 text-[color:var(--color-text-secondary)]"
                >
                  <Icon name="plus" className="h-4 w-4" />
                </button>
              </div>
            }
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)]">
              <div className="soft-grid absolute inset-0 opacity-50" />
              <div
                className="absolute inset-0 origin-center transition-transform"
                style={{ transform: `scale(${zoom})` }}
              >
                <div className="absolute left-[10%] top-[16%] h-[24%] w-[32%] rounded-[40%] bg-[color:var(--theme-muted-noble-gold)] opacity-[0.08] blur-xl" />
                <div className="absolute left-[38%] top-[26%] h-[28%] w-[42%] rounded-[42%] bg-[color:var(--theme-deep-crimson)] opacity-[0.1] blur-2xl" />
                <div className="absolute left-[62%] top-[52%] h-[20%] w-[18%] rounded-full border border-dashed border-[color:var(--color-border-active)] opacity-25" />

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
                          ? 'border-[color:var(--color-border-active)] bg-[color:var(--color-surface-selected)] text-[color:var(--color-text-primary)]'
                          : 'border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-overlay)] text-[color:var(--color-text-secondary)]'
                      }`}
                    >
                      <Icon name="mapPin" className="h-4 w-4" />
                    </span>
                    <span className="mt-2 block rounded-full border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-overlay)] px-2 py-1 text-[11px] text-[color:var(--color-text-secondary)]">
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
                <div key={detail} className="forged-subpanel px-4 py-3 text-sm text-[color:var(--color-text-secondary)]">
                  {detail}
                </div>
              ))}
            </div>
          </Card>
          {panelNotice && <PanelNotice notice={panelNotice} />}
          <Card title="Travel Actions" accent={accent}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2 text-sm text-slate-300">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Current Location</span>
                    <div className="mt-1 text-base text-slate-50">{currentLocationLabel}</div>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Selected Destination</span>
                    <div className="mt-1 text-base text-slate-50">{selectedWorldLocation?.name ?? 'No location selected'}</div>
                  </div>
                  <div className="text-slate-400">
                    {selectedWorldLocation?.note ?? 'Choose a known location on the map to begin travel.'}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <GameActionButton
                    label={
                      travelOutcome?.riskTier === 'risky' && confirmTravel
                        ? 'Confirm Travel'
                        : 'Travel To Location'
                    }
                    tone="accent"
                    disabled={
                      !selectedWorldLocation ||
                      !selectedWorldLocation.known ||
                      selectedWorldLocation.id === currentLocationId
                    }
                    onClick={() => {
                      if (!selectedWorldLocation) {
                        return;
                      }

                      if (travelOutcome?.riskTier === 'risky' && !confirmTravel) {
                        setConfirmTravel(true);
                        return;
                      }

                      const result = travelToKnownLocation(snapshot, selectedWorldLocation.id);
                      if (result.accepted) {
                        updateSnapshot(result.snapshot);
                      }
                      setPanelNotice(result.notice);
                    }}
                  />
                </div>
              </div>
              {travelOutcome ? (
                <ActionOutcomePreview title="Travel Outlook" preview={travelOutcome} />
              ) : (
                <div className="forged-subpanel p-4 text-sm text-[color:var(--color-text-secondary)]">
                  {travelPreview?.reason ?? 'Travel outlook appears here once a destination is valid.'}
                </div>
              )}
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
