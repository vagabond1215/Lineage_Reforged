import { useEffect, useRef, useState, type ReactNode } from 'react';
import type {
  ConditionStripViewModel,
  NotificationItem,
  ReadinessCardViewModel,
  StatMeter
} from '../types';
import type {
  CalendarClimatePopupViewModel,
  CalendarClimateRow
} from '../game-shell/calendarClimatePresentation';
import type { BodyStatePresentationSnapshot } from '../runtime/bodyStatePresentation';
import { NotificationBell } from './NotificationBell';
import { Icon } from './icons';
import { TopResourceMeter } from './ui/TopResourceMeter';
import './top-status-layout.css';

type CalendarClimateSectionProps = {
  title: string;
  rows: CalendarClimateRow[];
};

export function TopConditionDetails({ strip }: { strip: ConditionStripViewModel }) {
  return (
    <ul className="space-y-2">
      {[...strip.primary, ...strip.secondary].map((pill) => (
        <li key={pill.id} className="rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] p-2 text-sm text-[color:var(--color-text-primary)]">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <strong>{pill.label}</strong>
            <span className="capitalize">{pill.severity} · {pill.trend}</span>
          </div>
          <p className="mt-1 text-[color:var(--color-text-secondary)]">{pill.tooltip}</p>
        </li>
      ))}
    </ul>
  );
}

type TopStatusBarProps = {
  name: string;
  date: string;
  season: string;
  timeOfDay: string;
  conditionStrip: ConditionStripViewModel;
  calendarClimate: CalendarClimatePopupViewModel;
  readinessCard?: ReadinessCardViewModel;
  bodyState: BodyStatePresentationSnapshot;
  meters: StatMeter[];
  notifications: NotificationItem[];
  settingsOpen: boolean;
  onToggleSettings: () => void;
  settingsContent: ReactNode;
};

function getCalendarToneClass(tone: CalendarClimateRow['tone']): string {
  switch (tone) {
    case 'info':
      return 'border-[color:var(--color-tone-accent-border)] bg-[color:var(--color-tone-accent-bg)] text-[color:var(--color-tone-accent-text)]';
    case 'warning':
      return 'border-[color:var(--color-tone-warning-border)] bg-[color:var(--color-tone-warning-bg)] text-[color:var(--color-tone-warning-text)]';
    case 'unavailable':
      return 'border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]';
    case 'neutral':
    default:
      return 'border-[color:var(--color-tone-neutral-border)] bg-[color:var(--color-tone-neutral-bg)] text-[color:var(--color-tone-neutral-text)]';
  }
}

function CalendarClimateSection({ title, rows }: CalendarClimateSectionProps) {
  return (
    <section className="space-y-2">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
        {title}
      </h3>
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.id}
            className={`rounded-lg border px-3 py-2 ${getCalendarToneClass(row.tone)}`}
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <span className="min-w-0 break-words text-[10px] font-semibold uppercase tracking-[0.14em]">
                {row.label}
              </span>
              <span className="min-w-0 break-words text-right text-sm font-semibold">
                {row.valueLabel}
              </span>
            </div>
            {row.detailLabel && (
              <div className="mt-1 break-words text-xs leading-5 opacity-80">
                {row.detailLabel}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function BodyLevel({ label, value, state }: { label: string; value: number; state: string }) {
  const current = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div className="top-status-body-level">
      <span className="top-status-body-label">{label}</span>
      <div
        className="top-status-body-track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={current}
        aria-valuetext={`${Math.round(current)} of 100, ${state}`}
        title={`${label}: ${Math.round(current)} of 100 · ${state}`}
      >
        <span className="top-status-body-fill" style={{ width: `${current}%` }} />
      </div>
      <span className="top-status-body-value">{Math.round(current)}</span>
    </div>
  );
}

export function TopStatusBar({
  name,
  date,
  season,
  timeOfDay,
  conditionStrip,
  calendarClimate,
  readinessCard,
  bodyState,
  meters,
  notifications,
  settingsOpen,
  onToggleSettings,
  settingsContent
}: TopStatusBarProps) {
  const [conditionOpen, setConditionOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const conditionTrigger = useRef<HTMLButtonElement | null>(null);
  const calendarTrigger = useRef<HTMLButtonElement | null>(null);
  const topBarButtonClass =
    'forged-icon-button text-[color:var(--color-text-primary)]';
  const overlayPanelClass =
    'forged-overlay bg-[color:var(--color-surface-overlay)]';
  const activeConditions = [...conditionStrip.primary, ...conditionStrip.secondary]
    .filter((pill) => pill.severity === 'warning' || pill.severity === 'critical');
  const climateLabel = calendarClimate.climateRows[0]?.valueLabel;
  const seasonalBandLabel = calendarClimate.temperatureRows[0]?.valueLabel;

  useEffect(() => {
    if (activeConditions.length === 0) setConditionOpen(false);
  }, [activeConditions.length]);

  return (
    <header
      className="sticky top-0 z-[80] border-b border-[color:var(--color-border-soft)]"
      style={{
        background: 'var(--color-shell-bar-bg)',
        boxShadow: 'var(--shadow-shell-bar)'
      }}
    >
      <div className="mx-auto max-w-[112rem] px-3 py-2">
        <div className="top-status-layout">
          <div className="top-status-identity relative min-w-0">
            <h1 className="truncate text-lg font-semibold leading-tight text-[color:var(--color-text-primary)] md:text-[1.25rem]">
              {name}
            </h1>
            <button
              ref={calendarTrigger}
              type="button"
              onClick={() => setCalendarOpen((current) => !current)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setCalendarOpen(false);
              }}
              className="mt-0.5 block max-w-full text-left text-xs tracking-[0.06em] text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-border-active)]"
              aria-expanded={calendarOpen}
              aria-controls="top-bar-calendar-detail"
              aria-label="Open calendar and climate context"
            >
              {date} | {season} | {timeOfDay}
            </button>
            {calendarOpen && (
              <div
                id="top-bar-calendar-detail"
                role="region"
                aria-label="Calendar and climate detail"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setCalendarOpen(false);
                    calendarTrigger.current?.focus();
                  }
                }}
                className={`absolute left-0 top-[calc(100%+12px)] z-[130] max-h-[calc(100vh-8rem)] w-[min(34rem,calc(100vw-2rem))] overflow-y-auto p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-border-active)] ${overlayPanelClass}`}
              >
                <div>
                  <h2 className="text-lg font-semibold leading-tight text-[color:var(--color-text-primary)]">
                    {calendarClimate.title}
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-[color:var(--color-text-secondary)]">
                    {calendarClimate.subtitle}
                  </p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <CalendarClimateSection title="Current Time" rows={calendarClimate.currentTimeRows} />
                  <CalendarClimateSection title="Season" rows={calendarClimate.seasonRows} />
                  <CalendarClimateSection title="Climate" rows={calendarClimate.climateRows} />
                  <CalendarClimateSection title="Temperature" rows={calendarClimate.temperatureRows} />
                </div>
                {calendarClimate.informationalEffectNotes.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {calendarClimate.informationalEffectNotes.map((note) => (
                      <div
                        key={note}
                        className="rounded-lg border border-[color:var(--color-tone-neutral-border)] bg-[color:var(--color-tone-neutral-bg)] px-3 py-2 text-xs leading-5 text-[color:var(--color-tone-neutral-text)]"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                )}
                {calendarClimate.warningNotes.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {calendarClimate.warningNotes.map((note) => (
                      <div
                        key={note}
                        className="rounded-lg border border-[color:var(--color-tone-warning-border)] bg-[color:var(--color-tone-warning-bg)] px-3 py-2 text-xs leading-5 text-[color:var(--color-tone-warning-text)]"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="top-status-resources min-w-0" role="group" aria-label="Character resources">
            <div className="grid min-w-0 grid-cols-1 gap-0" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
              {meters.map((meter) => <TopResourceMeter key={meter.label} meter={meter} />)}
            </div>
          </div>

          <div className="top-status-body min-w-0" role="group" aria-label="Energy and hydration">
            <Icon name="grain" className="top-status-body-icon" />
            <div className="top-status-body-bars">
              <BodyLevel label="Energy" value={bodyState.values.energy} state={bodyState.labels.energy} />
              <BodyLevel label="Water" value={bodyState.values.hydration} state={bodyState.labels.hydration} />
            </div>
          </div>

          <div className="top-status-climate min-w-0" role="group" aria-label="Climate context, not current weather">
            <Icon name="sun" className="top-status-climate-icon" />
            <div className="top-status-climate-lines">
              <span title={`Climate profile: ${calendarClimate.climateRows[0]?.valueLabel ?? 'Unknown'}`}>
                {climateLabel && climateLabel !== 'Unknown' ? climateLabel : 'Climate unknown'}
              </span>
              <span title={`Expected seasonal temperature band: ${calendarClimate.temperatureRows[0]?.valueLabel ?? 'Unavailable'}`}>
                {seasonalBandLabel && seasonalBandLabel !== 'Unavailable' ? seasonalBandLabel : 'Seasonal band n/a'}
              </span>
            </div>
          </div>

          <div className="top-status-alerts min-w-0" role="group" aria-label="Active conditions">
            {activeConditions.length > 0 && (
              <div className="relative flex min-w-0 flex-col gap-0.5">
                {activeConditions.map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    aria-label={`${pill.label}, ${pill.severity}. Inspect condition details`}
                    aria-expanded={conditionOpen}
                    aria-controls="top-bar-condition-detail"
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') setConditionOpen(false);
                    }}
                    onClick={(event) => {
                      conditionTrigger.current = event.currentTarget;
                      setConditionOpen((current) => !current);
                    }}
                    className={`top-status-alert rounded-md border px-1.5 text-[11px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-border-active)] ${pill.severity === 'critical'
                      ? 'border-[color:var(--color-action-danger)] bg-[color:var(--color-tone-warning-bg)] text-[color:var(--color-text-primary)]'
                      : 'border-[color:var(--color-action-warning)] bg-[color:var(--color-tone-warning-bg)] text-[color:var(--color-tone-warning-text)]'}`}
                  >
                    <span className="truncate">{pill.label}</span>
                  </button>
                ))}
                {conditionOpen && (
                  <div
                    id="top-bar-condition-detail"
                    role="region"
                    aria-label="Condition details"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        setConditionOpen(false);
                        conditionTrigger.current?.focus();
                      }
                    }}
                    className={`absolute right-0 top-[calc(100%+10px)] z-[120] max-h-[calc(100vh-12rem)] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-border-active)] ${overlayPanelClass}`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h2 className="text-sm font-semibold text-[color:var(--color-text-primary)]">Condition details</h2>
                      <button
                        type="button"
                        onClick={() => {
                          setConditionOpen(false);
                          conditionTrigger.current?.focus();
                        }}
                        className="rounded-sm px-2 py-1 text-sm text-[color:var(--color-text-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-border-active)]"
                      >Close</button>
                    </div>
                    <TopConditionDetails strip={conditionStrip} />
                    {readinessCard && readinessCard.recommendedActions.length > 0 && (
                      <div className="mt-4 rounded-[18px] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] p-3">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">Recommended Actions</div>
                        <div className="mt-2 space-y-2">
                          {readinessCard.recommendedActions.map((action) => (
                            <div key={action.id} className="text-sm text-[color:var(--color-text-primary)]">
                              {action.label}: <span className="text-[color:var(--color-text-secondary)]">{action.detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="top-status-controls flex items-center justify-end gap-1.5">
            <NotificationBell items={notifications} />
            <div className="relative z-[110]">
              <button
                type="button"
                onClick={onToggleSettings}
                className={`p-2.5 ${topBarButtonClass}`}
                aria-label="Open settings"
                aria-expanded={settingsOpen}
                aria-controls="top-bar-settings-detail"
              >
                <Icon name="gear" className="h-5 w-5" />
              </button>
              {settingsOpen && (
                <div
                  id="top-bar-settings-detail"
                  className={`absolute right-0 top-[calc(100%+12px)] z-[120] max-h-[calc(100vh-8rem)] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto p-4 ${overlayPanelClass}`}
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
