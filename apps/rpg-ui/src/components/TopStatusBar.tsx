import type { NotificationItem, StatMeter } from '../types';
import { NotificationBell } from './NotificationBell';
import { Icon } from './icons';
import { SearchInput } from './ui/SearchInput';
import { ProgressBar } from './ui/ProgressBar';

type TopStatusBarProps = {
  portraitInitials: string;
  name: string;
  region: string;
  settlement: string;
  date: string;
  season: string;
  timeOfDay: string;
  currency: string;
  trackedQuest: string;
  activityTag?: string;
  meters: StatMeter[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  notifications: NotificationItem[];
};

export function TopStatusBar({
  portraitInitials,
  name,
  region,
  settlement,
  date,
  season,
  timeOfDay,
  currency,
  trackedQuest,
  activityTag,
  meters,
  searchValue,
  onSearchChange,
  notifications
}: TopStatusBarProps) {
  return (
    <header className="rounded-[32px] border border-white/10 bg-[color:var(--color-panel-strong)] p-4 shadow-panel backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-[220px] items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-amber-200/30 via-slate-600/30 to-cyan-300/20 text-lg font-semibold text-slate-100">
            {portraitInitials}
          </div>
          <div>
            <h1 className="text-xl text-slate-50">{name}</h1>
            <div className="text-sm text-slate-400">
              {region} &gt; {settlement}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-3 rounded-[24px] border border-white/8 bg-black/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Icon name="clock" className="h-4 w-4 text-slate-500" />
            <span>{date} | {season} | {timeOfDay}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Icon name="coin" className="h-4 w-4 text-amber-300" />
            <span>{currency}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
            <span className="text-slate-400">Tracked</span>
            <span>{trackedQuest}</span>
          </div>
          {activityTag && (
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
              {activityTag}
            </div>
          )}
        </div>

        <div className="flex flex-1 min-w-[260px] flex-wrap items-center gap-3 lg:justify-end">
          <div className="flex flex-wrap gap-3">
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
          <div className="min-w-[240px] flex-1 lg:max-w-xs">
            <SearchInput
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Global search across the active panel"
            />
          </div>
          <NotificationBell items={notifications} />
        </div>
      </div>
    </header>
  );
}
