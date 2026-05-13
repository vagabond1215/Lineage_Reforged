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

type TopStatusBarProps = {
  name: string;
  date: string;
  season: string;
  timeOfDay: string;
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
  conditionStrip,
  readinessCard,
  meters,
  notifications,
  settingsOpen,
  onToggleSettings,
  settingsContent
}: TopStatusBarProps) {
  const [conditionOpen, setConditionOpen] = useState(false);
  const topBarButtonClass =
    'forged-icon-button text-[color:var(--color-text-primary)]';
  const overlayPanelClass =
    'forged-overlay bg-[color:var(--color-surface-overlay)]';
  const strongestConditionSeverity =
    [...conditionStrip.primary, ...conditionStrip.secondary].some((pill) => pill.severity === 'critical')
      ? 'critical'
      : [...conditionStrip.primary, ...conditionStrip.secondary].some((pill) => pill.severity === 'warning')
        ? 'warning'
        : 'normal';
  const conditionButtonClass =
    strongestConditionSeverity === 'critical'
      ? 'border-[color:var(--color-action-danger)] bg-[color:var(--color-action-danger)] text-[color:var(--color-action-danger-text)]'
      : strongestConditionSeverity === 'warning'
        ? 'border-[color:var(--color-action-warning)] bg-[color:var(--color-action-warning)] text-[color:var(--color-action-warning-text)]'
        : 'border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-selected)] text-[color:var(--color-text-primary)]';

  return (
    <header
      className="sticky top-0 z-[80] border-b border-[color:var(--color-border-soft)]"
      style={{
        background: 'var(--color-shell-bar-bg)',
        boxShadow: 'var(--shadow-shell-bar)'
      }}
    >
      <div className="mx-auto max-w-[112rem] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="min-w-0 shrink-0">
            <h1 className="truncate text-lg font-semibold leading-tight text-[color:var(--color-text-primary)] md:text-[1.35rem]">
              {name}
            </h1>
            <div className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-text-secondary)] md:text-xs">
              {date} | {season} | {timeOfDay}
            </div>
          </div>

          <div className="min-w-0 flex-1 overflow-x-auto pb-1">
            <div className="flex min-w-max items-center justify-center gap-2 pr-1">
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setConditionOpen((current) => !current)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${conditionButtonClass}`}
                >
                  {conditionStrip.expandedByDefault
                    ? 'Condition Alert'
                    : conditionStrip.collapsedLabel}
                </button>
                {conditionOpen && (
                  <div
                    className={`absolute left-1/2 top-[calc(100%+10px)] z-[120] w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 p-4 ${overlayPanelClass}`}
                  >
                    <ConditionStrip strip={conditionStrip} />
                    {readinessCard && readinessCard.recommendedActions.length > 0 && (
                      <div className="mt-4 rounded-[18px] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] p-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                          Recommended Actions
                        </div>
                        <div className="mt-2 space-y-2">
                          {readinessCard.recommendedActions.map((action) => (
                            <div
                              key={action.id}
                              className="text-sm text-[color:var(--color-text-primary)]"
                            >
                              {action.label}:{' '}
                              <span className="text-[color:var(--color-text-secondary)]">
                                {action.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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

          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell items={notifications} />
            <div className="relative z-[110]">
              <button
                type="button"
                onClick={onToggleSettings}
                className={`p-2.5 ${topBarButtonClass}`}
                aria-label="Open settings"
              >
                <Icon name="gear" className="h-5 w-5" />
              </button>
              {settingsOpen && (
                <div
                  className={`absolute right-0 top-[calc(100%+12px)] z-[120] w-[min(36rem,calc(100vw-2rem))] p-4 ${overlayPanelClass}`}
                >
                  {settingsContent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
