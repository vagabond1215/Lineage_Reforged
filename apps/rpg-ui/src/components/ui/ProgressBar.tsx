type ProgressBarProps = {
  label: string;
  value: number;
  max: number;
  color: string;
  visualState?: 'normal' | 'warning' | 'critical';
};

export function ProgressBar({
  label,
  value,
  max,
  color,
  visualState = 'normal'
}: ProgressBarProps) {
  const safeMax = Math.max(max, 1);
  const percent = Math.max(0, Math.min(100, (value / safeMax) * 100));
  const wrapperClass = visualState === 'warning' ? 'saturate-[0.8]' : '';
  const wrapperStyle =
    visualState === 'critical'
      ? {
          boxShadow:
            '0 0 0 1px color-mix(in srgb, var(--color-action-danger) 36%, transparent), 0 8px 20px color-mix(in srgb, var(--color-action-danger) 14%, transparent)'
        }
      : undefined;

  return (
    <div
      className={`min-w-[138px] rounded-full border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-elevated)] px-2.5 py-1.5 transition ${wrapperClass}`}
      style={wrapperStyle}
      aria-label={label}
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-secondary)]">
          {label}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-muted)]">
          <div
            className="h-full rounded-full transition-[width]"
            style={{
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${color} 0%, color-mix(in srgb, ${color} 62%, white) 100%)`
            }}
          />
        </div>
        <span className="shrink-0 text-[10px] font-semibold tabular-nums text-[color:var(--color-text-primary)]">
          {value}/{max}
        </span>
      </div>
    </div>
  );
}
