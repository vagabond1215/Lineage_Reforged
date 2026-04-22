import { useState, type ReactNode } from 'react';
import type {
  ConditionStripViewModel,
  NotificationItem,
  ReadinessCardViewModel,
  StatMeter
} from '../types';
import { ConditionStrip } from './body-state/ConditionStrip';
import { NotificationBell } from './NotificationBell';
import { Icon } from './icons';
import { ProgressBar } from './ui/ProgressBar';

type TrackedQuestDetail = {
  summary: string;
  objectives: string[];
  relatedLocations: string[];
};

type TopStatusBarProps = {
  name: string;
  date: string;
  season: string;
  timeOfDay: string;
  currency: string;
  trackedQuest: string;
  trackedQuestDetail?: TrackedQuestDetail | null;
  activityTag?: string;
  conditionStrip: ConditionStripViewModel;
  readinessCard?: ReadinessCardViewModel;
  meters: StatMeter[];
  notifications: NotificationItem[];
  settingsOpen: boolean;
  onToggleSettings: () => void;
  settingsContent: ReactNode;
};

export function TopStatusBar({
  name,
  date,
  season,
  timeOfDay,
  currency,
  trackedQuest,
  trackedQuestDetail,
  activityTag,
  conditionStrip,
  readinessCard,
  meters,
  notifications,
  settingsOpen,
  onToggleSettings,
  settingsContent
}: TopStatusBarProps) {
  const [questOpen, setQuestOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const activeQuestLabel = trackedQuest?.trim() ? trackedQuest : 'No active quest';
  const canExpandQuest =
    Boolean(trackedQuestDetail?.summary) ||
    Boolean(trackedQuestDetail?.objectives.length) ||
    Boolean(trackedQuestDetail?.relatedLocations.length);
  const topBarButtonClass =
    'border-slate-400/25 bg-[rgba(54,63,75,0.9)] text-slate-100 shadow-[0_10px_24px_rgba(2,6,23,0.22)] transition hover:border-slate-300/32 hover:bg-[rgba(69,80,95,0.96)]';
  const strongestConditionSeverity =
    [...conditionStrip.primary, ...conditionStrip.secondary].some((pill) => pill.severity === 'critical')
      ? 'critical'
      : [...conditionStrip.primary, ...conditionStrip.secondary].some((pill) => pill.severity === 'warning')
        ? 'warning'
        : 'normal';
  const conditionButtonClass =
    strongestConditionSeverity === 'critical'
      ? 'border-rose-300/28 bg-rose-200/12 text-rose-50'
      : strongestConditionSeverity === 'warning'
        ? 'border-amber-300/24 bg-amber-200/10 text-amber-50'
        : 'border-white/10 bg-white/5 text-slate-200';

  return (
    <header
      className="sticky top-0 z-[80] border-b border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
      style={{
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.84), rgba(7, 11, 18, 0.66)), radial-gradient(circle at top left, rgba(255, 255, 255, 0.16), transparent 34%), radial-gradient(circle at bottom right, rgba(148, 163, 184, 0.1), transparent 28%)'
      }}
    >
      <div className="mx-auto max-w-[112rem] px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-[220px]">
            <h1 className="text-2xl text-slate-50">{name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-amber-200">
              <Icon name="coin" className="h-4 w-4" />
              <span>{currency}</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <div className="text-base text-slate-100">{date}</div>
            <div className="mt-1 text-sm text-slate-400">
              {season} | {timeOfDay}
            </div>
            {activityTag && (
              <div className="mt-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                {activityTag}
              </div>
            )}
            <div className="mt-2 hidden md:block">
              <ConditionStrip strip={conditionStrip} />
            </div>
            <div className="relative mt-2 md:hidden">
              <button
                type="button"
                onClick={() => setConditionOpen((current) => !current)}
                className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] transition ${conditionButtonClass}`}
              >
                {conditionStrip.expandedByDefault ? 'Condition Alert' : conditionStrip.collapsedLabel}
              </button>
              {conditionOpen && (
                <div className="absolute left-1/2 top-[calc(100%+12px)] z-[120] w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[24px] border border-white/10 bg-slate-950/96 p-4 shadow-2xl backdrop-blur-xl">
                  <ConditionStrip strip={conditionStrip} />
                  {readinessCard && readinessCard.recommendedActions.length > 0 && (
                    <div className="mt-4 rounded-[18px] border border-white/8 bg-white/5 p-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Recommended Actions</div>
                      <div className="mt-2 space-y-2">
                        {readinessCard.recommendedActions.map((action) => (
                          <div key={action.id} className="text-sm text-slate-200">
                            {action.label}: <span className="text-slate-400">{action.detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell items={notifications} />
            <div className="relative z-[110]">
              <button
                type="button"
                onClick={onToggleSettings}
                className={`rounded-full border p-3 ${topBarButtonClass}`}
                aria-label="Open settings"
              >
                <Icon name="gear" className="h-5 w-5" />
              </button>
              {settingsOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-[120] w-[min(36rem,calc(100vw-2rem))] rounded-[28px] border border-white/10 bg-[color:var(--color-panel-strong)]/96 p-4 shadow-2xl backdrop-blur-xl">
                  {settingsContent}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="hidden min-w-[220px] lg:block" />
          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-3xl flex-wrap justify-center gap-3">
              {meters.map((meter) => (
                <ProgressBar
                  key={meter.label}
                  label={meter.label}
                  value={meter.current}
                  max={meter.max}
                  color={meter.color}
                  visualState={meter.visualState}
                />
              ))}
            </div>
          </div>

          <div className="relative min-w-[220px] lg:max-w-[320px]">
            <button
              type="button"
              onClick={() => canExpandQuest && setQuestOpen((current) => !current)}
              className={`w-full rounded-[22px] border px-4 py-3 text-left transition ${
                canExpandQuest
                  ? topBarButtonClass
                  : 'cursor-default border-white/8 bg-black/20 text-slate-400'
              }`}
              aria-expanded={questOpen}
            >
              <div className="truncate text-sm font-semibold">{activeQuestLabel}</div>
            </button>
            {questOpen && canExpandQuest && trackedQuestDetail && (
              <div className="absolute bottom-[calc(100%+12px)] right-0 z-[120] w-[min(24rem,calc(100vw-2rem))] rounded-[24px] border border-white/10 bg-slate-950/96 p-4 shadow-2xl backdrop-blur-xl">
                <h2 className="text-base text-slate-50">{activeQuestLabel}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{trackedQuestDetail.summary}</p>
                {trackedQuestDetail.objectives.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Objectives</div>
                    <div className="mt-2 space-y-2 text-sm text-slate-300">
                      {trackedQuestDetail.objectives.slice(0, 3).map((objective) => (
                        <div key={objective} className="rounded-[18px] border border-white/8 bg-white/5 px-3 py-2">
                          {objective}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {trackedQuestDetail.relatedLocations.length > 0 && (
                  <div className="mt-3 text-sm text-slate-400">
                    Linked locales: {trackedQuestDetail.relatedLocations.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
