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

  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-baseline justify-between gap-2 text-sm leading-5">
        <span className="font-semibold text-[color:var(--color-text-primary)]">{meter.label}</span>
        <span className="shrink-0 font-semibold tabular-nums text-[color:var(--color-text-primary)]">
          {meter.current} / {meter.max}
        </span>
      </div>
      <div
        role={validRange ? 'meter' : 'group'}
        aria-label={meter.label}
        aria-valuemin={validRange ? 0 : undefined}
        aria-valuemax={validRange ? meter.max : undefined}
        aria-valuenow={validRange ? Math.max(0, Math.min(meter.current, meter.max)) : undefined}
        aria-valuetext={validRange ? `${meter.current} of ${meter.max}${stateText}` : undefined}
        data-visual-state={state}
        className="h-3 overflow-hidden rounded-sm border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)]"
      >
        <div
          className="h-full motion-safe:transition-[width] motion-reduce:transition-none"
          style={{ width: `${percent}%`, backgroundColor: meter.color }}
        />
      </div>
      {state !== 'normal' && (
        <span className="mt-0.5 block text-xs font-medium capitalize text-[color:var(--color-tone-warning-text)]">
          {state}
        </span>
      )}
    </div>
  );
}
