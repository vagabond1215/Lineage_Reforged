import type { BodyStateTrend } from '../../types';

type TrendIndicatorProps = {
  trend: BodyStateTrend;
};

export function TrendIndicator({ trend }: TrendIndicatorProps) {
  const label = trend === 'improving' ? 'Improving' : trend === 'worsening' ? 'Worsening' : 'Stable';
  const glyph = trend === 'improving' ? '↑' : trend === 'worsening' ? '↓' : '•';
  const toneClass =
    trend === 'improving'
      ? 'text-emerald-200'
      : trend === 'worsening'
        ? 'text-rose-200'
        : 'text-slate-400';

  return (
    <span className={`inline-flex items-center text-[11px] font-semibold ${toneClass}`} aria-label={label}>
      {glyph}
    </span>
  );
}
