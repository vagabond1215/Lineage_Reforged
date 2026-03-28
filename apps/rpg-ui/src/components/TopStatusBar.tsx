import { useState, type ReactNode } from 'react';
import type { NotificationItem, StatMeter } from '../types';
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
  meters,
  notifications,
  settingsOpen,
  onToggleSettings,
  settingsContent
}: TopStatusBarProps) {
  const [questOpen, setQuestOpen] = useState(false);
  const activeQuestLabel = trackedQuest?.trim() ? trackedQuest : 'No active quest';
  const canExpandQuest =
    Boolean(trackedQuestDetail?.summary) ||
    Boolean(trackedQuestDetail?.objectives.length) ||
    Boolean(trackedQuestDetail?.relatedLocations.length);

  return (
    <header className="sticky top-0 z-[80] border-b border-white/10 bg-[color:var(--color-panel-strong)]/95 shadow-panel backdrop-blur-xl">
      <div className="px-4 pb-4 pt-3">
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
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell items={notifications} />
            <div className="relative z-[110]">
              <button
                type="button"
                onClick={onToggleSettings}
                className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:bg-white/10"
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
                  ? 'border-white/10 bg-white/5 text-slate-100 hover:bg-white/10'
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
