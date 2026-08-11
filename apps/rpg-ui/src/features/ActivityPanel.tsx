import { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  isAshenReefSurveyAdvanceDisabled,
  resolveAshenReefSurveyPanelFacts,
  shouldRetainAshenReefSurveyCallerRequestId
} from '../runtime/ashenReefSurveyCaller';
import { createAuthorityId } from '../../../../packages/engines/game-engine/src/campaign-rules.js';
import {
  isAshenReefSurveyActivityAdvancementIntent,
  listPendingPlayerSurveyProjectionRepairs,
  resolvePlayerSurveyActivityAdvancementPlan
} from '../../../../packages/engines/game-engine/src/player-survey-activity-advancement.js';

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
  const {
    snapshot,
    updateSnapshot,
    advanceAshenReefSurvey,
    repairAshenReefSurveyProjection,
    bodyStatePresentation
  } = useGameSession();
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
  const surveyRequestIdRef = useRef<string | null>(null);

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
  const surveyIntent = isAshenReefSurveyActivityAdvancementIntent(snapshot);
  const surveyPlan = useMemo(
    () => surveyIntent ? resolvePlayerSurveyActivityAdvancementPlan(snapshot) : null,
    [snapshot, surveyIntent]
  );
  const surveyPanelFacts = useMemo(
    () => surveyPlan ? resolveAshenReefSurveyPanelFacts(surveyPlan) : null,
    [surveyPlan]
  );
  const advancePreview = useMemo(() => {
    if (!surveyPlan) return previewAdvanceCurrentActivity(snapshot);
    return surveyPlan.accepted
      ? {
          available: true,
          tickCount: surveyPlan.tickCount,
          projectedBodyState: surveyPlan.projectedBodyState,
          timeline: surveyPlan.timeline
        }
      : {
          available: false,
          reason: surveyPlan.reason,
          tickCount: 0,
          projectedBodyState: null,
          timeline: []
        };
  }, [snapshot, surveyPlan]);
  const advanceDisabled = surveyPlan
    ? isAshenReefSurveyAdvanceDisabled(surveyPlan)
    : !advancePreview.available;
  const restPreview = useMemo(() => previewRestAtCurrentSettlement(snapshot), [snapshot]);
  const pendingSurveyRepair = useMemo(
    () => listPendingPlayerSurveyProjectionRepairs(snapshot)[0] ?? null,
    [snapshot]
  );
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

  const mutedInsetCardClass =
    'rounded-[22px] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] p-4';

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
                <div key={metric.id} className={mutedInsetCardClass}>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                    {metric.label}
                  </div>
                  <div className="mt-2 text-2xl text-[color:var(--color-text-primary)]">{metric.value}</div>
                  <div className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                    {metric.detail}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          {panelNotice && <PanelNotice notice={panelNotice} />}
          <Card title="Active Shift Controls" accent={accent}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-3 text-sm text-[color:var(--color-text-secondary)]">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                      Current Activity
                    </span>
                    <div className="mt-1 text-base text-[color:var(--color-text-primary)]">
                      {snapshot.sessionState.currentActivity?.label ?? 'No active process'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                      Current Location
                    </span>
                    <div className="mt-1 text-base text-[color:var(--color-text-primary)]">
                      {currentLocationLabel}
                    </div>
                  </div>
                  {activityData.renownNote && (
                    <div className="rounded-[18px] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm text-[color:var(--color-text-secondary)]">
                      {activityData.renownNote}
                    </div>
                  )}
                  <div className="max-w-2xl text-[color:var(--color-text-secondary)]">
                    {selectedItem?.detailSummary ??
                      'Select a job, contract, or operation to set focus before advancing time.'}
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
                      if (result.accepted) {
                        updateSnapshot(result.snapshot, {
                          ownerKind: 'engine_result',
                          mutationId: result.commandId,
                          resultId: result.resultId ?? result.commandId
                        });
                      }
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

                      if (surveyIntent) {
                        if (!surveyPlan?.accepted) {
                          setPanelNotice({
                            tone: 'warning',
                            title: 'Survey not advanced',
                            detail: surveyPlan?.reason ?? 'The survey plan is unavailable.'
                          });
                          return;
                        }
                        surveyRequestIdRef.current ??= createAuthorityId('survey_request');
                        const outcome = advanceAshenReefSurvey(surveyRequestIdRef.current);
                        if (!shouldRetainAshenReefSurveyCallerRequestId(outcome)) {
                          surveyRequestIdRef.current = null;
                        }
                        setPanelNotice(outcome.notice);
                        return;
                      }

                      const result = advanceCurrentActivity(snapshot);
                      updateSnapshot(result.snapshot);
                      setPanelNotice(result.notice);
                    }}
                    disabled={advanceDisabled}
                  />
                  {pendingSurveyRepair && (
                    <GameActionButton
                      label="Repair Survey Projection"
                      onClick={() => {
                        const result = repairAshenReefSurveyProjection(
                          pendingSurveyRepair.resultId,
                          pendingSurveyRepair.projectionKind
                        );
                        const retentionExpired = result.code === 'projection_retention_expired';
                        setPanelNotice({
                          tone: result.accepted && !retentionExpired
                            ? 'success'
                            : result.duplicate || retentionExpired
                              ? 'neutral'
                              : 'warning',
                          title: result.accepted && !retentionExpired
                            ? 'Survey projection repaired'
                            : retentionExpired
                              ? 'Survey projection retention expired'
                              : 'Survey projection unchanged',
                          detail: result.accepted && !retentionExpired
                            ? 'The retained survey result was re-projected without repeating gameplay effects.'
                            : retentionExpired
                              ? 'The retained destination cannot accept this older projection without displacing newer or ambiguous evidence.'
                            : 'The retained projection is already correct, expired, or controlled by newer authority.'
                        });
                      }}
                    />
                  )}
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
                  <div className="space-y-3">
                    <ActionOutcomePreview title="Advance Shift Outlook" preview={advanceOutcome} />
                    {surveyPanelFacts && (
                      <div className={`${mutedInsetCardClass} text-sm text-[color:var(--color-text-secondary)]`}>
                        <div>Survey stage: {surveyPanelFacts.stageLabel}</div>
                        <div>
                          Explicit costs: Stamina -{surveyPanelFacts.staminaCost}, MP -{surveyPanelFacts.mpCost}
                        </div>
                        <div>
                          Skill: {surveyPanelFacts.skillId} {surveyPanelFacts.skillDetail}
                        </div>
                        <div>Operation progress: {surveyPanelFacts.operationProgress}%</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`${mutedInsetCardClass} text-sm text-[color:var(--color-text-secondary)]`}>
                    {advancePreview.reason ??
                      'Advance Shift becomes available once the current work loop can progress.'}
                  </div>
                )}
                {restOutcome ? (
                  <ActionOutcomePreview title="Rest Outlook" preview={restOutcome} />
                ) : (
                  <div className={`${mutedInsetCardClass} text-sm text-[color:var(--color-text-secondary)]`}>
                    {restPreview.reason ??
                      'Rest becomes available once a secure settlement bunk is available.'}
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
