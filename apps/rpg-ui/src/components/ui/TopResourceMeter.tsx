import type { StatMeter } from '../../types';

export function getResourceFillPercent(current: number, max: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.max(0, Math.min(100, (current / max) * 100));
}

export function TopResourceMeter({ meter }: { meter: StatMeter }) {
  const validRange = Number.isFinite(meter.current) && Number.isFinite(meter.max) && meter.max > 0;
  const percent = getResourceFillPercent(meter.current, meter.max);
  const state = meter.visualState ?? 'normal';
  const stateText = state === 'normal' ? '' : `, ${state}`;
  const shortLabel = meter.label === 'Stamina' ? 'ST' : meter.label;

  return (
    <div className="grid min-w-0 grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-1.5 text-xs leading-3">
      <span className="flex items-center gap-1 font-semibold text-[color:var(--color-text-primary)]" aria-label={meter.label}>
        {shortLabel}
        {state !== 'normal' && <span className="font-bold text-[color:var(--color-tone-warning-text)]" aria-label={`${state} resource level`} title={state}>!</span>}
      </span>
      <div
        role={validRange ? 'meter' : 'group'}
        aria-label={meter.label}
        aria-valuemin={validRange ? 0 : undefined}
        aria-valuemax={validRange ? meter.max : undefined}
        aria-valuenow={validRange ? Math.max(0, Math.min(meter.current, meter.max)) : undefined}
        aria-valuetext={validRange ? `${meter.current} of ${meter.max}${stateText}` : undefined}
        data-visual-state={state}
        className="h-2.5 min-w-0 overflow-hidden rounded-sm border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)]"
      >
        <div
          className="h-full motion-safe:transition-[width] motion-reduce:transition-none"
          style={{ width: `${percent}%`, backgroundColor: meter.color }}
        />
      </div>
      <span className="min-w-[4.25rem] whitespace-nowrap text-right font-semibold tabular-nums text-[color:var(--color-text-primary)]">
        {meter.current} / {meter.max}
      </span>
    </div>
  );
}
