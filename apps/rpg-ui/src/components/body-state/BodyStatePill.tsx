import { Tooltip } from '../ui/Tooltip';
import type { BodyStatePillViewModel } from '../../types';
import { TrendIndicator } from './TrendIndicator';

type BodyStatePillProps = {
  pill: BodyStatePillViewModel;
};

const severityClasses: Record<NonNullable<BodyStatePillViewModel['severity']>, string> = {
  normal: 'border-white/10 bg-white/5 text-slate-200',
  warning: 'border-amber-300/24 bg-amber-200/10 text-amber-50',
  critical: 'border-rose-300/28 bg-rose-200/12 text-rose-50'
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
