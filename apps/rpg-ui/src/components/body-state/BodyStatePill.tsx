import { Tooltip } from '../ui/Tooltip';
import type { BodyStatePillViewModel } from '../../types';
import { TrendIndicator } from './TrendIndicator';

type BodyStatePillProps = {
  pill: BodyStatePillViewModel;
};

const severityClasses: Record<NonNullable<BodyStatePillViewModel['severity']>, string> = {
  normal:
    'border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)]',
  warning:
    'border-[color:var(--color-action-warning)] bg-[color:color-mix(in_srgb,var(--color-action-warning)_18%,transparent)] text-[color:var(--color-action-warning-text)]',
  critical:
    'border-[color:var(--color-action-danger)] bg-[color:color-mix(in_srgb,var(--color-action-danger)_20%,transparent)] text-[color:var(--color-action-danger-text)]'
};

const emphasisClasses: Record<string, string> = {
  soft: 'shadow-[0_0_0_1px_rgba(250,204,21,0.14)]',
  medium: 'shadow-[0_0_0_1px_rgba(250,204,21,0.22),0_10px_22px_rgba(250,204,21,0.1)]',
  hard: 'shadow-[0_0_0_1px_rgba(251,113,133,0.28),0_12px_24px_rgba(244,63,94,0.16)]'
};

export function BodyStatePill({ pill }: BodyStatePillProps) {
  return (
    <Tooltip
      content={<span>{pill.tooltip}</span>}
      portal
      side="bottom"
      align="center"
      className="min-w-0"
    >
      <span
        className={`inline-flex min-w-0 items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.14em] ${
          severityClasses[pill.severity]
        } ${pill.emphasis ? emphasisClasses[pill.emphasis] ?? '' : ''}`}
      >
        <TrendIndicator trend={pill.trend} />
        <span className="truncate">{pill.label}</span>
      </span>
    </Tooltip>
  );
}
