import type { BodyStateTrend } from '../../types';

type TrendIndicatorProps = {
  trend: BodyStateTrend;
};

export function TrendIndicator({ trend }: TrendIndicatorProps) {
  const label = trend === 'improving' ? 'Improving' : trend === 'worsening' ? 'Worsening' : 'Stable';
  const glyph = trend === 'improving' ? '↑' : trend === 'worsening' ? '↓' : '•';
  const toneClass =
    trend === 'improving'
      ? 'text-[color:var(--color-tone-success-text)]'
      : trend === 'worsening'
        ? 'text-[color:var(--color-tone-danger-text)]'
        : 'text-slate-400';

  return (
    <span className={`inline-flex items-center text-[11px] font-semibold ${toneClass}`} aria-label={label}>
      {glyph}
    </span>
  );
}
